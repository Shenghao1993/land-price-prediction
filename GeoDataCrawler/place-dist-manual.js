var map;
var path = "http://localhost:63342/GeoDataCrawler/coords.csv";
var pyrmont = {};
var distValsArr = [];

// Read coordinates data
$.get(path, function (data) {
    papaObj = Papa.parse(data);
    coordsObjArr = papaObj.data;

    parentLoop();
    async function parentLoop() {
        for (var i = 0; i < coordsObjArr.length; i++) {
            await new Promise(resolve => setTimeout(resolve, Math.random() * 1000));
            var str = coordsObjArr[i][0];
            lat = str.substr(0,str.indexOf(' '));
            lng = str.substr(str.indexOf(' ')+1);
            console.log("Addr ID: " + i);
            initMap(lat, lng);
        }
    };

    function initMap(lat, lng) {
        if (lat === '' || lng === '') {
            $("p").append('<br>');
        } else {
            var pyrmont = new google.maps.LatLng(parseFloat(lat), parseFloat(lng));
            // console.log(pyrmont);

            map = new google.maps.Map(document.getElementById('map'), {
                center: pyrmont,
                zoom: 15
            });

          var placeService = new google.maps.places.PlacesService(map);
          var request = {
            location: pyrmont,
            radius: 2000,
            type: ['school']
          };
          placeService.nearbySearch(request, function(results, status){
            if (results === undefined || results === null || results.length <= 0) {
                $("p").append('<br>');
            } else {
                // calPoiDist(results, status, pyrmont);
                calMinPoiDist(results, status, pyrmont, lat, lng);
            }
          
          });

          // var request = {
          //     location: pyrmont,
          //     radius: 1000,
          //     query: ['manufacturing'],
          //     type: ['establishment']
          // };
          // placeService.textSearch(request, function (results, status) {
          //     if (results === undefined || results === null || results.length <= 0) {
          //         $("p").append('<br>');
          //     } else {
          //         calPoiDist(results, status, pyrmont, lat, lng);
          //     }
          // })
        }
        
    }

    function calPoiDist(results, status, pyrmont, lat, lng) {
        if (status == "OK") {
            distValsArr = [];

            var xx = results[0].geometry.location.lat();
            var yy = results[0].geometry.location.lng();
            var location = new google.maps.LatLng(xx, yy);
            console.log(getDistance(pyrmont, location));
            // $("p").append(getDistance(pyrmont, location) + '<br>');
            $("p").append(lat + ' ' + lng + ',' + results.length + '<br>');
        } else {
            $("p").append('<br>');
        }
        
    }

    function calMinPoiDist(results, status, pyrmont, lat, lng) {
        if (status == "OK") {
            var minPoiDist = 10000;

            for (var k = 0; k < results.length; k++) {
                var x = results[k].geometry.location.lat();
                var y = results[k].geometry.location.lng();
                var location = new google.maps.LatLng(x, y);
                if(getDistance(pyrmont, location) < minPoiDist) {
                    minPoiDist = getDistance(pyrmont, location);
                }
            }
            $("p").append(lat + ' ' + lng + ',' + minPoiDist + ',' + results.length + '<br>');
        } else {
            $("p").append('<br>');
        }

    }

	function getDistance(p1, p2) {
        var R = 6378137; // Earth’s mean radius in meter
        var dLat = rad(p2.lat() - p1.lat());
        var dLong = rad(p2.lng() - p1.lng());
        var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(rad(p1.lat())) * Math.cos(rad(p2.lat())) *
            Math.sin(dLong / 2) * Math.sin(dLong / 2);
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        var d = R * c;
        return d; // returns the distance in meter
    }

    var rad = function(x) {
        return x * Math.PI / 180;
    };
});

