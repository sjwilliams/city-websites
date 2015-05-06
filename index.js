'use strict';
var fs = require('fs');
var request = require('request');
var async = require('async');

var outputFile = 'city-websites.json';
var cityWebsites = [];

request('https://gist.githubusercontent.com/sjwilliams/e3f1e046e41755dc7603/raw/bfb35f17bc5d5f86ec0f10b80f7b80e823e9197f/states_titlecase.json', function (error, response, body) {
  if (!error && response.statusCode === 200) {
    async.each(JSON.parse(body), function(state, callback){
      request('http://api.sba.gov/geodata/city_links_for_state_of/'+state.abbreviation.toLowerCase()+'.json', function(error, response, body){
        if (!error && response.statusCode === 200) {
          console.log('Downloaded', state.name);
          cityWebsites = cityWebsites.concat(JSON.parse(body));
        } else {
          console.log('File not available for', state.name);
        }
        callback();
      });
    }, function(err){
      if( err ) {
        console.log('An error occurred downloading a state file.');
      } else {
        fs.writeFile(outputFile, JSON.stringify(cityWebsites, null, ' '), function(err) {
          if(err) {
            return console.log(err);
          }
          console.log('Successfully saved ', cityWebsites.length, ' records to ', outputFile);
        });
      }
    });
  }
});
