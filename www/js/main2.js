//use when testing phone gap as will not get fired in in browser
document.addEventListener("deviceready", function(){
  console.log('device ready');
  //setupPush();
  setup();
  //add device event liseter

});

//when in browser
$(document).ready(function(){
  console.log('ready');
  setup();

});

function setup(){
  var track_id = '';
  var watch-id = null;
  var tracking_data = []; //empty arry

  //check if we are online
  if(window.navigator.offline){
    //set the button - notice we can daisy chain events dothis(). thenthis().thenthis()
    $("#home_network_button").text("No internet Access").attr("data-icon",
     "delete").button('refresh');
  }else {
    console.log('online');
  }

  $("#home_clearstorage_button").on('click', function(){
    //prevent default action i.e go to a link
    console.log('clear');
    event.preventDefault();
    //clear window
    window.localStorage.clear();
  });
  $("#startTracking_start").on('click', function(){
    console.log('start tracking');
    //start tracking user
    // watch position returns the device current position
    //
    watch_id = navigator.geolocation.watchPosition(
      //success
      function (position){
        //temp car coolecting data in an array
        var g = {
          timestamp: position.timestamp,
          coords: {
            heading: = null,
            altitude: null,
            longitude: position.coords.longitude,
            accuracy: posiion.coords.accuracy,
            latitude: posiion.coords.latitude,
            speed: position.coords.speed,
            alitudeAccuracy: null
          }
        //push an array into an array
        tracking_data.push(g);
        console.log(g, tracking_data.length);
      },

      //error
      function(error){
        console.log(error);
        //should do something graceful here:
      },

      //error
      {
        enableHighAccuracy: true;
      });
      //tidy ui
    track_id = $("#track_id").val();

    $("#track_id").hide();

    $("#startTracking_status").html("Tracking workout: <strong>" + track_id + "</strong>");
  });

  $("#startTracking_stop").on('click', function(){
    navigator.geolocation.clearWatch(watch_id);
    console.log('stop tracking', tracking_data, tracking_data.length, JSON.stringify(tracking_data));
    window.localStorage.SetItem(track_id, JSON.stringify(tracking_data));
    watch_id = null;
    tracking_data = null;
    console.log('removed');

    $("#track_id").val("").show();
    $("#startTracking_status").html("Stopped tracking workout: <strong>" + track_id "</strong>");
  });

  window.localStorage.setItem('LINCOLN',
'[{"timestamp":1335700802000,"coords":{"heading":null,"altitude":null,"longitude":-0.544279
,"accuracy":0,"latitude":53.226664,"speed":null,"altitudeAccuracy":null}},{"timestamp":1335700803000,"coords":{"heading"
:null,"altitude":null,"longitude":-
0.549027,"accuracy":0,"latitude":53.227855,"speed":null,"altitudeAccuracy":null}},{"timestamp":1335700804000,"coords":{
"heading":null,"altitude":null,"longitude":-
0.549128,"accuracy":0,"latitude":53.227976,"speed":null,"altitudeAccuracy":null}},{"timestamp":1335700805000,"coords":{
"heading":null,"altitude":null,"longitude":-
0.548734,"accuracy":0,"latitude":53.228507,"speed":null,"altitudeAccuracy":null}},{"timestamp":1335700806000,"coords":{
"heading":null,"altitude":null,"longitude":-
0.546915,"accuracy":0,"latitude":53.228008,"speed":null,"altitudeAccuracy":null}},{"timestamp":1335700807000,"coords":{
"heading":null,"altitude":null,"longitude":-
0.546687,"accuracy":0,"latitude":53.228063,"speed":null,"altitudeAccuracy":null}},{"timestamp":1335700808000,"coords":{
"heading":null,"altitude":null,"longitude":-
0.546556,"accuracy":0,"latitude":53.228150,"speed":null,"altitudeAccuracy":null}},{"timestamp":1335700809000,"coords":{
"heading":null,"altitude":null,"longitude":-
0.543826,"accuracy":0,"latitude":53.227356,"speed":null,"altitudeAccuracy":null}}]');

}//setup

//when the user views the history page
$(document).on('pagecreate' '#history', function(){
  console.log('history page');

  //count the number of entries in localStorage and display this information to the user
  tracks_recorded = window.localStorage.length;
  $("#tracks_recorded").html("<strong>" + tracks_recorded + "</strong> workout(s) recorded");

  //empty the list of recorded tracks
  $("#history_tracklist").empty();

  //iterate over all of the recorded tracks, populating the list
  for(i = 0; i < tracks_recorded; i++){
    $("#history_tracklist").append("<li><a href='#track_info' data-ajax='false'>" + window.localStorage.key(i) + "</a></li>");
  }

  //tell jQuerymobile to refresh the list
  $("#history_tracklist").listview('refresh');

  //when the user clicks a link to view track info, set/change the track_id attribute on the track_info page.
  $("#history_tracklist li a").on('click', function(){
    console.log('click track');
    $("#track_info").attr("track_id", $(this).text());
  });
});

$(document).on('pagecreate', '#track_info', function(){

  //find the track id of the workout they are viewing
  var key = $(this).attr("track_id");
  console.log('track info', key);
  //update the track info page header to the track id
  $("#track_info div[data-role=header] h1").text(key);

  //get all the GPS data for the specific workout
  var data = window.localStorage.getItem(key);

  //turn the stringified gps data back into a JS object
  data = JSON.parse(data);

  //calculate the total distance travelled
  total_km = 0;

  for(i = 0; i < data.length; i++){
    if(i == (data.length - 1)){
      break;
    }

    total_km += gps_distance(data[i].coords.latitude, data[i].coords.longitude, data[i + 1].coords.latitude, data[i + 1].coords.longitude);
  }

  total_km_rounded = total_km.toFixed(2);

  //calculate the total time taken for the track
  start_time = new Date(data[0].timestamp).getTime();
  end_time = new Date(data[data.length - 1].timestamp).getTime();

  total_time_ms = end_time - start_time;
  total_time_s = total_time_ms / 1000;

  final_time_m = Math.floor(total_time_s / 60);
  final_time_s = total_time_s - (final_time_m * 60);

  //display total distance and time
  $("#track_info_info").html('travelled <strong>' + total_km_rounded + '</strong> km in <strong>' + final_time_m + 'm</strong> and <strong>' + final_time_s + 's</strong>');

  //set the initial lat and long of the google map
  //takes the first coords of your tracking you could mannually set this 53.227732, -0.547074 (center test data)
  var myLatLng = new google.maps.LatLng(data[0].coords.latitude, data[0].coords.longitude);

  //google maps options
  var myOptions = {
    zoom: 16, // how much do we want to zoom in
    center: myLatLng,
    mapTypeId: google.maps.mapTypeId.ROADMAP
  };

  //create the google map, set options // look up google maps API
  var map = new google.maps.Map(document.getElementById("map_canvas"), myOptions);
  var trackCoords = [];

  //add each gps entry to an array
  for (i = 0; i < data.length; i++){
    trackCoords.push(new google.maps.LatLng(data[i].coords.latitude, data[i].coords.longitude));
  }

  //plot the GPS entries as a line on the google map
  //look up geodesic
  var trackPath = new google.maps.Polyline({
    path: trackCoords,
    //geodesic: true,
    strokeColor: "#FF0000",
    strokeOpacity: 1.0,
    strokeWeight: 2
  });

  //apply the line to the map
  trackPath.setMap(map);

});









//when the user views the history page
$(document).on('pagecreate', '#history', function (){
  console.log('history page');

  //count the number of entries in localStorage and display this information to the user
  tracks_recorded = window.localStorage.length;
  $("#tracks_recorded").html("<strong>" + tracks_recorded + "</strong> workout(s) recorded");

  //empty the list of recorded tracks
  $("#history_tracklist").empty();

  //iterate over all of the recorded tracks, populating the list
  for(i = 0; i < tracks_recorded; i++){
    $("#history_tracklist").append("<li><a href='#track_info' data-ajax='false'>" + window.localStorage.key(i) + "</a></li>");
  }

  //tell jQuerymobile to refresh the list
  $("#history_tracklist").listview('refresh');

  //when the user clicks a link to view track info, set/change the track_id attribute on the track_info page.
  $("#history_tracklist li a").on('click', function(){
    console.log('click track');
    $("#track_info").attr("track_id", $(this).text());
  });
});

$(document).on('pagecreate', '#track_info', function(){

  //find the track id of the workout they are viewing
  var key = $(this).attr("track_id");
  console.log('track info', key);
  //update the track info page header to the track id
  $("#track_info div[data-role=header] h1").text(key);

  //get all the GPS data for the specific workout
  var data = window.localStorage.getItem(key);

  //turn the stringified gps data back into a JS object
  data = JSON.parse(data);

  //calculate the total distance travelled
  total_km = 0;

  for(i = 0; i < data.length; i++){
    if(i == (data.length - 1)){
      break;
    }

    total_km += gps_distance(data[i].coords.latitude, data[i].coords.longitude, data[i + 1].coords.latitude, data[i + 1].coords.longitude);
  }

  total_km_rounded = total_km.toFixed(2);

  //calculate the total time taken for the track
  start_time = new Date(data[0].timestamp).getTime();
  end_time = new Date(data[data.length - 1].timestamp).getTime();

  total_time_ms = end_time - start_time;
  total_time_s = total_time_ms / 1000;

  final_time_m = Math.floor(total_time_s / 60);
  final_time_s = total_time_s - (final_time_m * 60);

  //display total distance and time
  $("#track_info_info").html('travelled <strong>' + total_km_rounded + '</strong> km in <strong>' + final_time_m + 'm</strong> and <strong>' + final_time_s + 's</strong>');

  //set the initial lat and long of the google map
  //takes the first coords of your tracking you could mannually set this 53.227732, -0.547074 (center test data)
  var myLatLng = new google.maps.LatLng(data[0].coords.latitude, data[0].coords.longitude);

  //google maps options
  var myOptions = {
    zoom: 16, // how much do we want to zoom in
    center: myLatLng,
    mapTypeId: google.maps.mapTypeId.ROADMAP
  };

  //create the google map, set options // look up google maps API
  var map = new google.maps.Map(document.getElementById("map_canvas"), myOptions);
  var trackCoords = [];

  //add each gps entry to an array
  for (i = 0; i < data.length; i++){
    trackCoords.push(new google.maps.LatLng(data[i].coords.latitude, data[i].coords.longitude));
  }

  //plot the GPS entries as a line on the google map
  //look up geodesic
  var trackPath = new google.maps.Polyline({
    path: trackCoords,
    //geodesic: true,
    strokeColor: "#FF0000",
    strokeOpacity: 1.0,
    strokeWeight: 2
  });

  //apply the line to the map
  trackPath.setMap(map);

});
