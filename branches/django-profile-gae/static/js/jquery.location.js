function mapFramework() {

	if (GBrowserIsCompatible()) {

   	this.map = new GMap2(document.getElementById("map"));
		this.map.addControl(new GLargeMapControl());
		this.map.addControl(new GOverviewMapControl())
		this.map.addControl(new GMapTypeControl())
		this.map.enableContinuousZoom();

		var lat = lng = 0;
    if ($("#id_geopoint").val()) {
      lat = $("#id_geopoint").val().split(",")[0];
      lng = $("#id_geopoint").val().split(",")[1];
    }

  	this.map.setCenter(new GLatLng(lat, lng), 4);
		this.marker = new GMarker(new GLatLng(lat, lng), {clickable: false, bouncy: true, draggable: true}); 
  	this.map.addOverlay(this.marker);

		GEvent.addListener(this.marker, "dragend", function(){
    	$("img.loading").show();
    	var point = this.getLatLng();
      $("#id_geopoint").val(point.lat().toFixed(6) + "," + point.lng().toFixed(6));
    	$.getJSON("/accounts/profile/getcountry_info/" + point.lat() + "/" +  point.lng() + "/", function(data) {
      	$("#id_country").val(data['country']);
      	$("#id_location").val(data['region']);
      	$("#location_info").text(data['region']);
      	$("img.loading").hide();
    	});
  	});
	}
}

mapFramework.prototype.searchLocation = function() {
	if (!$("#id_country option:selected").text()) {
		return;
	} 

	address = $("#id_country option:selected").text();
	$("img.loading").show();
 	geocoder = new GClientGeocoder();

	var g = this;
 	geocoder.getLatLng(address, function(point){
 		if (point) {
 			g.map.setCenter(point);
 			g.marker.setLatLng(point);
      $("#id_geopoint").val(point.lat().toFixed(6) + "," + point.lng().toFixed(6));
 			$.getJSON("/accounts/profile/getcountry_info/" + point.lat() + "/" +  point.lng() + "/", function(data) {
 				$("#id_country").val(data['country']);
 				$("img.loading").hide();
 			});
 		}
 	}); 
}

var googlemaps;

function initMap() {
	googlemaps = new mapFramework();
	googlemaps.searchLocation();
}

function initMap2() {
	googlemaps = new mapFramework();
}

$(function() {
	$("#id_country").change(function() {
		$("#location_info").text("Drag the marker on the map to establish a more precise location.");
		if (!$("#id_country option:selected").val()) {
			$("#id_location").val('');
			$("#id_geopoint").val('');
			$("div.mapinfo").hide();
			return;
		}
		if ($("div.mapinfo").css("display") == "none") {
			$("div.mapinfo").show();
			$.getScript("http://maps.google.com/maps?file=api&v=2.x&key=" + $("#apikey").text() + "&async=2&callback=initMap");
		} else {
			googlemaps.searchLocation();
		}
	});

	if ($("#id_country option:selected").val()) {
      $("div.mapinfo").show();
      $.getScript("http://maps.google.com/maps?file=api&v=2.x&key=" + $("#apikey").text() + "&async=2&callback=initMap2");
	}
});