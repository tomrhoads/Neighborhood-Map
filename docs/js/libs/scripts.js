//JSON Data
var initialParkLocations = [{
  name:"Helen Putnam Regional Park",
  address: "411 Chileno Valley Rd, Petaluma, CA 94952", 
  latlng: {
    lat: 38.219530,
    lng: -122.661224
  },
  id: "4b998f08f964a520888335e3"
}, {
  name: "McNear Park", 
  address: "1008 G St, Petaluma, CA 94952",
  latlng: {
    lat: 38.225059, 
    lng: -122.638393
  },
  id: "4bca4d5f68f976b0502d5f83"
}, {
  name: "Walnut Park", 
  address: "Walnut Park, Petaluma, CA 94952",
  latlng: {
    lat: 38.231532, 
    lng: -122.633415
  },
  id: "4c17b44a834e2d7fe5c02780"
}, {
  name: "Putnam Plaza Park", 
  address: "129 Petaluma Blvd N, Petaluma, CA 94952",
  latlng: {
    lat: 38.234903, 
    lng: -122.640796
  },
  id: "4c55d920479fc928c1e28995"
}, {
  name: "Shollenberger Park", 
  address: "1400 Cader Ln, Petaluma, CA 94954", 
  latlng: {
    lat: 38.225734, 
    lng: -122.597881
  },
  id: "4b3e7982f964a520b59d25e3"
}, {
  name: "Rocky Memorial Dog Park", 
  address: "Casa Grande Rd, Petaluma, CA 94954",
  latlng: {
    lat: 38.230318, 
    lng: -122.607837
  },
  id: "4bbfc7c9920eb7130eff172c"
}, {
  name: "Lucchesi Park", 
  address: "320 N McDowell Blvd, Petaluma, CA 94954",
  latlng: {
    lat: 38.253104, 
    lng: -122.630325
  },
  id: "4bcbc92b68f976b0cccd6183"
}, {
  name: "Prince Park", 
  address: "2301 E Washington St, Petaluma, CA 94954",
  latlng: {
    lat: 38.264291, 
    lng: -122.616764
  },
  id: "4baed13af964a52086da3be3"
}, {
  name: "Wiseman Park", 
  address: "St Augustine Cir, Petaluma, CA 94954",
  latlng: {
    lat: 38.253239, 
    lng: -122.600456
  },
  id: "4be21c56b02ec9b6064c4cc0"
}, {
  name: "Petaluma Adobe State Historical Park", 
  address: "3325 Adobe Rd, Petaluma, CA 94954",
  latlng: {
    lat: 38.256743, 
    lng: -122.581916
  },
  id: "4c27cfd0d26eb713082114d1"
}];

"use strict";

//Global Variables
var map;
var marker;
var foursquareUrl = 'https://api.foursquare.com/v2/venues/search';

//Initialize google map
function initMap() {
  /*var mapOptions = {
    zoom: 13,
    center: {lat: 38.245902, lng: -122.630577}
  };*/
  map = new google.maps.Map(document.getElementById('map-canvas')/*, mapOptions*/);
  ko.applyBindings(new ViewModel());
  console.log("initMap");
}

//Error handler in case google map does not load
var googleError = function() {
  alert("Google map did not load.  Check console for error.");
};

//Constructor that creates new parks for observable list
var ParkLocation = function(value) {
  var self = this;
  self.name = ko.observable(value.name);
  self.address = ko.observable(value.address);
  self.latlng = ko.observable(value.latlng);
  self.id = ko.observable(value.id);
};

//view model
var ViewModel = function() {
  var self = this;

  //Initial Map View variables
  var latitude = 38.245902;
  var longitude = -122.630577;
  var center = new google.maps.LatLng(latitude, longitude);

  //KO Observables
  self.visibleList = ko.observable(true);
  self.initialParkLocations = ko.observableArray([]);
  self.parkLocations = ko.observableArray([]);
  self.query = ko.observable('');
  
  //Infowindow initializer
  var infoWindow = new google.maps.InfoWindow({});

  //Iterate through each park in JSON Array
  initialParkLocations.forEach(function(parkItem) {

    //Declare new park objects
    var park = new ParkLocation(parkItem);

    //Create marker
    marker = new google.maps.Marker({
      position: parkItem.latlng,
      map: map,
      title: parkItem.name,
      animation: google.maps.Animation.DROP
    });

    //Add listener and behaviors to marker
    marker.addListener('click', function(){
      self.infoWindowClick(this);
      this.setAnimation(google.maps.Animation.BOUNCE);
      setTimeout(function() {
          park.marker.setAnimation(null); // End animation on marker after 2 seconds
        }, 1400);
    });

    //Set marker
    park.marker = marker;

    //Boolean for visibility of each park
    park.isVisible = ko.observable(true);

    //Push each park object into parkLocation array
    self.parkLocations.push(park);

    //Filter results of user search
    self.filter = ko.computed(function() {
      if(!self.query()) {
        self.parkLocations().forEach(function(location){
          infoWindow.close();
          location.marker.setVisible(true);
          location.isVisible(true);
          map.panTo(center);
          map.setZoom(13);
        });
      } else {
        self.parkLocations().forEach(function(location) {
          var match = location.name().toLowerCase().indexOf(self.query().toLowerCase()) != -1;
          infoWindow.close();
          location.marker.setVisible(match);
          location.isVisible(match);
          map.panTo(center);
          map.setZoom(13);
        });
      }
    });
  });


  //AJAX request opens infowindow with Foursquare information
  this.infoWindowClick = function(marker) {
    $.ajax({
      url: foursquareUrl,
      type: 'GET',
      dataType: "json",
      data: {
        client_id: 'NONGGLXBKX5VFFIKKEK1HXQPFAFVMEBTRXBWJUPEN4K14JUE',
        client_secret: 'ZZDD1SLJ4PA2X4AJ4V23OOZ53UM4SFZX0KORGWP5TZDK4YYJ',
        v: '20161201',
        ll: marker.position.lat() + ',' + marker.position.lng(),
        limit: 1,
        query: marker.title,
        async: true
      },
      success: function (results) {
        console.log("infoWindowClick AJAX Success Function");
        infoWindow.open(map, marker);
        infoWindow.setContent('<div><h4>' + marker.title + '</h4><p>Foursquare Check-ins: ' + 
          results.response.venues[0].stats.checkinsCount + '</p>');
      },
      error: function(xhr, ajaxOptions, thrownError) {
        alert("Foursquare data did not load");
        console.log(xhr);
        console.log(ajaxOptions);
        console.log(thrownError);
      }
    });
  };

  self.toggleClick = function() {
    this.visibleList(!this.visibleList());
  }

  //Click on item in list view to open infowindow and pan to location
  self.listViewClick = function(parkListItem) {
    self.infoWindowClick(parkListItem.marker);
    if (parkListItem.name) {
      console.log("listViewClick");
      map.setZoom(15); 
      map.panTo(parkListItem.marker.getPosition());
      parkListItem.marker.setAnimation(google.maps.Animation.BOUNCE);
    }
    //Make marker stop bouncing after 2 seconds
    setTimeout(function() {
      parkListItem.marker.setAnimation(null);
    }, 1400);
  };
};
