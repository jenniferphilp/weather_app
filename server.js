var express = require('express');
var bodyParser = require('body-parser');
var request = require('request');
var app = express();

app.use(express.static('public'));

app.use(bodyParser.json());

app.use(function(req, res, next) {
 res.header("Access-Control-Allow-Origin", "*");
 res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, authorization");
 next();
});


// obtains city from user input and passes into geocoding api, which get the latitude and longitude to pass into dark sky
app.get('/city', (req, res, error) => {
    let city = req.query.city || 'Toronto';

        let url = 'https://maps.googleapis.com/maps/api/geocode/json?address=' + city +'&key=AIzaSyC84wr_31uk2Jc1h7Q2TJX655qZR-lfd3s'

        request(url, function (error, response, body) {
            if (!error && response.statusCode == 200) {
                
                results = JSON.parse(body);
                var latitude = results.results[0].geometry.location.lat;
                var longitude = results.results[0].geometry.location.lng;

                       request('https://api.darksky.net/forecast/b6566addaaf77446eec48ab40af21abf/'+ latitude +','+ longitude, function (error, response, body) {
                            if (!error && response.statusCode == 200) {
                                res.json(body);
                            }
                            else {
                                console.log('error');
                            }
                       });
            }
            else{
                console.log('server error');
            }
        });

});
  
app.listen(3000, function(){
    console.log('listening on 3000');
});