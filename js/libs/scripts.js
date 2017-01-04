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
var map;
var marker;
var foursquareUrl = 'https://api.foursquare.com/v2/venues/search';

function initMap() {
  var mapOptions = {
    zoom: 13,
    center: {lat: 38.237869, lng: -122.616077}
  };
  map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
  ko.applyBindings(new viewModel());
  console.log("initMap");
};

var googleError = function() {
  $('#map-canvas').append('<div class= "alert alert-danger"><h3>Google map did not load</h3></div>');
};

var ParkLocation = function(value) {
    var self = this;
    self.name = ko.observable(value.name);
    self.address = ko.observable(value.address);
    self.latlng = ko.observable(value.latlng);
    self.id = ko.observable(value.id);
};

//view model
viewModel= function() {
  var self = this;

  //Editable Data
  this.showItem = ko.observable(false);
  this.parkLocations = ko.observableArray([]);
  self.query = ko.observable('');
  self.showItem = ko.observable(true);
  
  var infoWindow = new google.maps.InfoWindow({});

  initialParkLocations.forEach(function(parkItem) {
    if(!self.query() || parkItem.name.toLowerCase().indexOf(self.query().toLowerCase()) != 0){
      console.log("search filter if statement true");
      //for (var x in )
      var park = new ParkLocation(parkItem);
      marker = new google.maps.Marker({
        position: parkItem.latlng,
        map: map,
        title: parkItem.name,
        animation: google.maps.Animation.DROP
      });

      marker.addListener('click', function(){
        self.infoWindowClick(this);
      });

      park.marker = marker;
      self.parkLocations.push(park);
    } else {
        console.log("search filter if statement false");
        parkItem.showItem;
    };
  });

 

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
      }
    });
  };

  //Click on item in list view
  self.listViewClick = function(parkListItem) {
    self.infoWindowClick(parkListItem.marker);
    if (parkListItem.name) {
      console.log("listViewClick");
      map.setZoom(15); //Zoom map view
      map.panTo(parkListItem.marker.getPosition()); // Pan to correct marker when list view item is clicked
      parkListItem.marker.setAnimation(google.maps.Animation.BOUNCE); // Bounce marker when list view item is clicked
    }
    setTimeout(function() {
      parkListItem.marker.setAnimation(null); // End animation on marker after 2 seconds
    }, 2000);
  };

  //something I am working on for search filter
  /*this.showItem = function(loc) {
    console.log("search filter");
    viewModel.parkLocations.removeAll();
    if (loc == '') return;
    for (var parkLoc in parkLocations) {
      if (parkLocations[parkLoc].name.toLowerCase().indexOf(loc.toLowerCase()) >= 0) {
        viewModel.parkLocations.push(parkLocations[parkLoc]);
      }
    }
  }*/
}

$(document).ready(function() {
  initMap();
});

