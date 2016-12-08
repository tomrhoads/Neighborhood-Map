
var initialParkLocations = [{
  name:"Helen Putnam Regional Park",
  address: "411 Chileno Valley Rd, Petaluma, CA 94952", 
  latlng: {
    lat: 38.219530, 
    lng: -122.661224
  }
}, {
  name: "McNear Park", 
  address: "1008 G St, Petaluma, CA 94952",
  latlng: {
    lat: 38.225059, 
    lng: -122.638393
  }
}, {
  name: "Walnut Park", 
  address: "Walnut Park, Petaluma, CA 94952",
  latlng: {
    lat: 38.231532, 
    lng: -122.633415
  }
}, {
  name: "Putnam Plaza Park", 
  address: "129 Petaluma Blvd N, Petaluma, CA 94952",
  latlng: {
    lat: 38.234903, 
    lng: -122.640796
  }
}, {
  name: "Shollenberger Park", 
  address: "1400 Cader Ln, Petaluma, CA 94954", 
  latlng: {
    lat: 38.225734, 
    lng: -122.597881
  }
}, {
  name: "Rocky Memorial Dog Park", 
  address: "Casa Grande Rd, Petaluma, CA 94954",
  latlng: {
    lat: 38.230318, 
    lng: -122.607837
  }
}, {
  name: "Petaluma Parks and Recreation", 
  address: "320 N McDowell Blvd, Petaluma, CA 94954",
  latlng: {
    lat: 38.253104, 
    lng: -122.630325
  }
}, {
  name: "Prince Park", 
  address: "2301 E Washington St, Petaluma, CA 94954",
  latlng: {
    lat: 38.264291, 
    lng: -122.616764
  }
}, {
  name: "Wiseman Park", 
  address: "St Augustine Cir, Petaluma, CA 94954",
  latlng: {
    lat: 38.253239, 
    lng: -122.600456
  }
}, {
  name: "Petaluma Adobe State Historical Park", 
  address: "3325 Adobe Rd, Petaluma, CA 94954",
  latlng: {
    lat: 38.256743, 
    lng: -122.581916
  }
}
];

var map;
var marker;
var infoWindow;
var content = "you just clicked me";

function initMap() {
  map = new google.maps.Map(document.getElementById('map-canvas'), {
    zoom: 13,
    center: {lat: 38.237869, lng: -122.616077}
  });
};

function parkLocation(value) {
    this.name = ko.observable(value.name);
    this.address = ko.observable(value.address);
    this.latlng = ko.observable(value.lat);
}

//view model
function ViewModel() {
  var self = this;
  self.markers = [];

  //Editable Data
  self.parkLocations = ko.observableArray(initialParkLocations);

  self.parkLocations().forEach(function(location) {
    marker = new google.maps.Marker({
      position: location.latlng,
      map: map,
      title: location.name,
      icon: 'https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png',
      animation: google.maps.Animation.DROP
    });

    location.marker = marker;

    this.markers.push(marker);
  });

  //Map info windows to each item in the markers array
  self.markers.map(function(info) {
    infoWindow = new google.maps.InfoWindow({
      content: content
    });
    //Add click event to each marker to open info window
    info.addListener('click', function() {
      infoWindow.open(map, this),
        info.setAnimation(google.maps.Animation.BOUNCE) //Markers will bounce when clicked
      setTimeout(function() {
        info.setAnimation(null)
      }, 2000); //Change value to null after 2 seconds and stop markers from bouncing
    });

  });

  //Click on item in list view
  self.listViewClick = function(park) {
    if (park.name) {
      map.setZoom(15); //Zoom map view
      map.panTo(park.latlng); // Pan to correct marker when list view item is clicked
      park.marker.setAnimation(google.maps.Animation.BOUNCE); // Bounce marker when list view item is clicked
      infoWindow.open(map, park.marker); // Open info window on correct marker when list item is clicked
    }
    setTimeout(function() {
      park.marker.setAnimation(null); // End animation on marker after 2 seconds
    }, 2000);
  };
}

$(document).ready(function() {
  initMap();
  ko.applyBindings(ViewModel());
});


