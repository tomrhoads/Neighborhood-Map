
      function initMap() {
        var petaluma = {lat: 38.244923, lng: -122.626991};
        var map = new google.maps.Map(document.getElementById('map-canvas'), {
          zoom: 8,
          center: petaluma
        });
        var marker = new google.maps.Marker({
          position: petaluma,
          map: map
        });
      }
    