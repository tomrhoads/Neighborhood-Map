function loadData() {

    var $body = $('body');
    var $wikiElem = $('#wikipedia-links');
    var $nytHeaderElem = $('#nytimes-header');
    var $nytElem = $('#nytimes-articles');
    var $greeting = $('#greeting');

    // clear out old data before new request
    $wikiElem.text("");
    $nytElem.text("");

    // load streetview
    var streetStr = $('#street').val();
    var cityStr = $('#city').val();
    var address = streetStr + ', ' + cityStr;
    var attraction = $('#attraction').val();

    $greeting.text('So, you want to check out ' + attraction + '?');

    var streetviewURL = 'http://maps.googleapis.com/maps/api/streetview?size=600x300&location=' 
    + address + '';
    $body.append('<img class="bgimg" src="' + streetviewURL + '">');

    //NY Times AJAX request
    var nytimesUrl = "https://api.nytimes.com/svc/search/v2/articlesearch.json";
    nytimesUrl += '?' + $.param({
      'api-key': "deded3c8797d49f6ba69e16f5055e4c3",
      'q': cityStr,
      'sort': "newest"
    });
    $.getJSON(nytimesUrl, function(data){

        $nytHeaderElem.text('New York Times Articles About ' + attraction);

        articles = data.response.docs;
            for (var i = 0; i < articles.length; i++) {
                var article = articles[i];
                $nytElem.append('<li class="article">'+
                    '<a href="'+article.web_url+'">'+article.headline.main+
                    '</a>'+
                    '<p>' + article.snippet + '</p>'+
                    '</li>');
            };
    }).error(function(e){
        $nytHeaderElem.text('New York Times Articles Could Not Be Loaded');
    });

    //Wikipedia AJAX request goes here
    var wikiUrl = 'http://en.wikipedia.org/w/api.php?action=opensearch&search=' +
    cityStr + '&format=json&callback=wikiCallback';

    $.ajax({
        url: wikiUrl,
        datatype: "jsonp",
        //jsonp: "callback",
        success: function( response ) {
            var articleList = response[1];

            for (var i=0; i < articleList.length; i++) {
                articleStr = articleList[i];
                var url = 'http://en.wikipedia.org/wiki/' + articleStr;
                $wikiElem.append('<li><a href="' +url + '">' + articleStr + '</a></li>');
            };
        }
    })

    return false;
};

$('#form-container').submit(loadData);

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


