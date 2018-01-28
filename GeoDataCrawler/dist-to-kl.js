var map;
var path = "http://localhost:63342/GeoDataCrawler/coords.csv";

// https://developers.google.com/maps/documentation/javascript/examples/distance-matrix
// https://developers.google.com/maps/documentation/javascript/distancematrix

// Read address data
$.get(path, function(data) {
    papaObj = Papa.parse(data);
    geoInfoObjArr = papaObj.data;
    // The length of array may not match the actual no. of rows with data in the csv
    // console.log(geoInfoObjArr.length);

    var dest = 'Kuala Lumpur';
    var latitude = '';
    var longtitude = '';
    var geocode = {};
    var indices = [];
    var noofRequests = Math.ceil(geoInfoObjArr.length/25);

    parentLoop();
    async function parentLoop() {
        for (var i = 0; i < noofRequests; i++) {
            var origins = [];
            var apiLimit = (i < noofRequests - 1) ? 26 : (geoInfoObjArr.length - 25*i - 1);
            indices = [];
            for (var j = 1; j < apiLimit; j++) {
                await new Promise(resolve => setTimeout(resolve, Math.random() * 500));
                // indices.push(geoInfoObjArr[25*i + j][0]);
                latitude = parseFloat(geoInfoObjArr[25*i + j][2]);
                longtitude = parseFloat(geoInfoObjArr[25*i + j][3]);
                geocode['lat'] = latitude;
                geocode['lng'] = longtitude;
                // origins.push(geocode);
                origins.push(JSON.stringify(geocode));
            }
            console.log(i);
            calDist(origins);
        }    
    }

    function calDist(originJsonArr) {
        var service = new google.maps.DistanceMatrixService();
        var originArr = [];
        for (var i = 0; i < originJsonArr.length; i++) {
            originArr.push(JSON.parse(originJsonArr[i]));
        }
        // console.log(originArr);
        service.getDistanceMatrix({
            origins: originArr,
            destinations: [dest],
            travelMode: 'DRIVING',
            unitSystem: google.maps.UnitSystem.METRIC,
            avoidHighways: false,
            avoidTolls: false
        }, callback)
    }

    function callback(response, status) {
        if (status == 'OK') {
            var origins = response.originAddresses;
            var destinations = response.destinationAddresses;

            for (var i = 0; i < origins.length; i++) {
                var results = response.rows[i].elements;
                for (var j = 0; j < results.length; j++) {
                    var element = results[j];
                    var distance = element.distance.text;
                    var duration = element.duration.text;
                    // console.log(indices[i] + ',' + distance + ',' + duration);
                    $("p").append(i + ',' + distance + ',' + duration + '<br>');
                    var from = origins[i];
                    var to = destinations[j];
                }
            }
        } else {
            $("p").append('<br>');
        }
    }
});