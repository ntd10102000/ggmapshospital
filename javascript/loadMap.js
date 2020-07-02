var customIcons = {
      BV: {
        url: 'icon/marker_do.png',
        scaledSize : new google.maps.Size(40, 40)
      },
      PK: {
        url: 'icon/marker_xanh.png',
        scaledSize : new google.maps.Size(40, 40)
      }
      
};
function createMarker(options, html,infoWindow) {
    var marker = new google.maps.Marker(options);
    if (html) {
      google.maps.event.addListener(marker, "click", function () {
        infoWindow.setContent(html);
        infoWindow.open(options.map, this);
      });
    }
    return marker;
}
function downloadUrl(url, callback) {
  var request = window.ActiveXObject ?
      new ActiveXObject('Microsoft.XMLHTTP') :
      new XMLHttpRequest;

  request.onreadystatechange = function() {
    if (request.readyState == 4) {
      request.onreadystatechange = doNothing;
      callback(request, request.status);
    }
  };

  request.open('GET', url, true);
  request.send(null);
}
function doNothing() {}
function contentinfoWindow(s, nameHpt, addressHpt, imageHpt, nameDistrict, phoneHpt, webHpt){
   var html = '<div>'+
    '<div>'+
        '<a href="'+webHpt+'"><strong style="color:black;font-size:17px">'+nameHpt+'</strong></a>'+
    '</div>'+
    '<div>'+
        '<img src="'+imageHpt+'" style="width:400px;height:150px; margin-left:30px">'+
    '</div>'+
    '<div>'+
        '<strong style="background-color:black;margin-left:60px;">Bác Sĩ:</strong>'+
    '</div>'+
    '<div>'+
        '<strong style="margin-left:40px;color:black">'+addressHpt+', '+nameDistrict+', Hà Nội, Việt Nam'+'</strong><br/>'+
        '<strong style="margin-left:40px;color:black;"><u>0'+phoneHpt+'</u></strong><br/>'+
        '<a href="http://'+webHpt+'/"  target="blank" style="margin-left:40px;color:black;">'+webHpt+'</a><br/>'+
        '<strong style="margin-left:40px;color:black;">Giờ mở cửa: 8h-17h</strong><br/>'+
    '</div>'+
    '<div style="width:400px; height:80px; margin-left:30px;background-color:#4d90fe;border: 1px solid transparent;border-radius: 2px 0 0 2px;box-sizing: border-box;-moz-box-sizing: border-box;outline: none;box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);">'+
        '<strong style="margin-left:40px;color:black">Các khoa của bệnh viện</strong><br/>'+
        s+
    '</div>'+
'</div>';
return html;
}
var markers=[];
var map;
var infoWindow;
var k=0;
var kt=0;
// Function khởi tạo google map
function initialize()
{

    document.getElementById("contentChiDuong").style.display="none";
    var lat=$("#maps_mapcenterlat").val("21.029707080723522");
    var lng=$("#maps_mapcenterlng").val("105.82139586791993");
    var myLatLng = new google.maps.LatLng(21.029707080723522,105.82139586791993);
    // Config google map
    var mapOptions = {
        // Tọa độ muốn hiển thị ban đầu (tung độ,vỹ độ)
        center: myLatLng,
        // Mức độ zoom
        zoom: 13,
        mapTypeId: 'roadmap'
    };

    // Hiển thị map lên bản đồ (div#map-canvas)
    var map = new google.maps.Map(document.getElementById("map-canvas"), mapOptions);

    infoWindow = infowindow = new google.maps.InfoWindow();

    var searchBox = document.getElementById('maps_address');

    var autocomplete = new google.maps.places.Autocomplete(searchBox);
    autocomplete.bindTo('bounds', map);

    
    var pyrmont;
    markers = [];
    function search(autocomplete){

      infoWindow.close();
      markers.forEach(function(marker) {
        marker.setMap(null);
      });
      if(markers1.length>0){
        markers1.forEach(function(marker) {
          marker.setMap(null);
        });
      }

      var marker = new google.maps.Marker({
        map: map
      });
      markers.push(marker);
          var place = autocomplete.getPlace();
          if (!place.geometry) {
            return;
          }

          if (place.geometry.viewport) {
            map.fitBounds(place.geometry.viewport);
          } else {
            map.setCenter(place.geometry.location);
            map.setZoom(17);
          }

          // Set the position of the marker using the place ID and location.
          marker.setPlace({
            placeId: place.place_id,
            location: place.geometry.location
          });
          pyrmont=place.geometry.location;
          marker.setVisible(true);
          downloadUrl("infoHospital_xml.php", function(data) {
          var xml = data.responseXML;
          var markers = xml.documentElement.getElementsByTagName("hospital");
          var khoa = xml.documentElement.getElementsByTagName("khoa");
          var idHpt, nameHpt,addressHpt,phoneHpt,webHpt,nameDistrict,type,imageHpt,placeId,s;
          
          for (var i = 0; i < markers.length; i++) {
            var placeIdDB = markers[i].getAttribute("placeId");

            if(placeIdDB===place.place_id){
               idHpt=markers[i].getAttribute("idHpt");
               nameHpt = markers[i].getAttribute("nameHpt");
               addressHpt = markers[i].getAttribute("addressHpt");
               phoneHpt = markers[i].getAttribute("phoneHpt");
               webHpt = markers[i].getAttribute("webHpt");
               nameDistrict = markers[i].getAttribute("nameDistrict");
               type = markers[i].getAttribute("type");
               imageHpt = markers[i].getAttribute("imageHpt");
               placeId = markers[i].getAttribute("placeId");
              var k=0;
              var nameKhoa= [];
               s="";
              for(var j = 0; j<khoa.length; j++){
                var idHpt_khoa=khoa[j].getAttribute("idHpt");
                if(idHpt_khoa===idHpt){
                    k++;
                    nameKhoa[k-1]=khoa[j].getAttribute("nameKhoa");
                    s+='<span style="margin-left:20px;width:150px;color:black;float:left"><a class="listKhoa" value="'+idHpt+'" href="DoiNguBacSiChuyenKhoa.php?idHpt='+idHpt+'">'+nameKhoa[k-1]+'</a></span>';
                }
              }
            }
          }
          var html=contentinfoWindow(s, nameHpt, addressHpt, imageHpt, nameDistrict, phoneHpt, webHpt);
          if(place.place_id===placeId){
              infoWindow.setContent(html);
              infoWindow.open(map, marker);
          }
          else{
            infoWindow.setContent('<div><strong>' + place.name + '</strong><br>' +'Place ID: ' + place.place_id + '<br>' +place.address);
          infoWindow.open(map, marker);
          } 
            });
          marker.addListener('click', function() {
            infoWindow.open(map, marker);
          });
    }
    var getPlace;
    //viết cho sự kiên click vào nút có biểu tượng tìm kiếm
    document.getElementById('searchIcon').addEventListener('click', function() {
      kt=1;
      search(autocomplete);
      document.getElementById("timDuongTuDiem").style.display="inline";
      getPlace=autocomplete.getPlace();
      
    });    
    autocomplete.addListener('place_changed', function() {
      kt=1;
      search(autocomplete);
      document.getElementById("timDuongTuDiem").style.display="inline";
      getPlace=autocomplete.getPlace();
    });
    //tìm vị trí hiện tại
    var positionStart;
    var geo=document.getElementById("divtimvitrihientai");
    var iconGeo=document.getElementById('vitrihientai');
    google.maps.event.addDomListener(geo,'click',function(){
      kt=0;
      markers.forEach(function(marker) {
        marker.setMap(null);
      });
      if(markers1.length>0){
        markers1.forEach(function(marker) {
          marker.setMap(null);
        });
      }
        // Try HTML5 geolocation.
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(function(position) {
            var pos = {
              lat: position.coords.latitude,
              lng: position.coords.longitude
            };  
            positionStart=pos;
            var icon={
            url: 'icon/vitrihientai.png',
            scaledSize : new google.maps.Size(50, 50)
            }
            var marker = new google.maps.Marker({
                map: map,
                position: new google.maps.LatLng(pos),
                draggable: true,
                icon:icon
            });
            markers.push(marker);
            pyrmont=marker.getPosition();
            infoWindow.setPosition(pos);
            //setContent infoWindow
            map.setCenter(pos);
            map.setZoom(17);

          }, function() {
            handleLocationError(true, infoWindow, map.getCenter());
          });
        } else {
          // Browser doesn't support Geolocation
          handleLocationError(false, infoWindow, map.getCenter());
        }
        document.getElementById("timDuongTuDiem").style.display="inline";

    });
    //tìm đường từ một điểm cho trước
    document.getElementById("timDuongTuDiem").addEventListener('click',function(){
      k=1;
      end.value="";
      contenTimDuong.style.display="none";
        contentChiDuong.style.display="inline";
        if(markers1.length>0){
          markers1.forEach(function(marker) {
            marker.setMap(null);
          });
        }
        document.getElementById("right-panel").style.display="none";
        if(kt===1){
          start.value=searchBox.value;
        }
        else{
          start.value="Vị trí của tôi";
        }
        
    });
    //add một marker khi click vào map
    markers = [];
    google.maps.event.addListener(map, 'click', function(e) {
      if(markers.length>0){
        markers.forEach(function(marker) {
          marker.setMap(null);
        });
      }
      
      if(markers1.length>0){
        markers1.forEach(function(marker) {
          marker.setMap(null);
        });
      }
       document.getElementById("timDuongTuDiem").style.display="none";
      var marker = new google.maps.Marker({
          map: map,
          position: new google.maps.LatLng(e.latLng.lat(), e.latLng.lng()),
          draggable: true,
          animation: google.maps.Animation.DROP
      });

      markers.push(marker);
      markerdragEvent(markers)
      pyrmont=marker.getPosition();
      
    });


    // Event on change center map
    google.maps.event.addListener(map, 'center_changed', function() {
        $("#maps_mapcenterlat").val(map.getCenter().lat());
        $("#maps_mapcenterlng").val(map.getCenter().lng());
        console.log( map.getCenter() );
    });

    //directions service:chỉ đường
    var contentChiDuong=document.getElementById("contentChiDuong");
    var contenTimDuong=document.getElementById("contenTimDuong");
    document.getElementById('divChiDuong').addEventListener('click',function(){
        k=0;
        end.value="";
        start.value="";
        contenTimDuong.style.display="none";
        contentChiDuong.style.display="inline";
        if(markers1.length>0){
          markers1.forEach(function(marker) {
            marker.setMap(null);
          });
        }
        
        if(markers.length>0){
          markers.forEach(function(marker) {
            marker.setMap(null);
          });
        }
        document.getElementById("right-panel").style.display="none";

    });
    document.getElementById('thoatChiDuong').addEventListener('click',function(){
        contenTimDuong.style.display="inline";
        contentChiDuong.style.display="none";
        document.getElementById("start").value="";
        document.getElementById("end").value="";
        directionsDisplay.setMap(null);
        document.getElementById("timDuongTuDiem").style.display="none";
        searchBox.value="";
        if(markers.length>0){
          markers.forEach(function(marker) {
            marker.setMap(null);
          });
        }
        directionsDisplay.setPanel(null);

    });
    //tìm đường đi và phương tiện đi
    
    var start = document.getElementById('start');
    var searchBoxStart = new google.maps.places.SearchBox(start);

    var end = document.getElementById('end');
    var searchBoxEnd = new google.maps.places.SearchBox(end);
    

    var directionsDisplay = new google.maps.DirectionsRenderer;
    var directionsService = new google.maps.DirectionsService;
    
    var travelMode="";

    document.getElementById('iconChiDuong').style.background='rgb(65, 165, 225)';
    travelMode="DRIVING";

    document.getElementById('iconChiDuong').addEventListener('click',function(){
        travelMode="DRIVING"
        document.getElementById('iconChiDuong').style.background='rgb(65, 165, 225)';
        document.getElementById('iconOto').style.background = '';
        document.getElementById('iconXebus').style.background = '';
        document.getElementById('iconDibo').style.background = '';
        document.getElementById('iconXedap').style.background = '';

        directionsDisplay.setMap(map);
        directionsDisplay.setPanel(document.getElementById('huongdan'));
        calculateAndDisplayRoute(directionsService, directionsDisplay,travelMode);
    });
    document.getElementById('iconOto').addEventListener('click',function(){
        travelMode="DRIVING";
        document.getElementById('iconChiDuong').style.background='';
        document.getElementById('iconOto').style.background = 'rgb(65, 165, 225)';
        document.getElementById('iconXebus').style.background = '';
        document.getElementById('iconDibo').style.background = '';
        document.getElementById('iconXedap').style.background = '';

        directionsDisplay.setMap(map);
        directionsDisplay.setPanel(document.getElementById('huongdan'));
        calculateAndDisplayRoute(directionsService, directionsDisplay,travelMode);
    });
    document.getElementById('iconXebus').addEventListener('click',function(){
        travelMode="TRANSIT";
        document.getElementById('iconChiDuong').style.background='';
        document.getElementById('iconOto').style.background = '';
        document.getElementById('iconXebus').style.background = 'rgb(65, 165, 225)';
        document.getElementById('iconDibo').style.background = '';
        document.getElementById('iconXedap').style.background = '';

        directionsDisplay.setMap(map);
        directionsDisplay.setPanel(document.getElementById('huongdan'));
        calculateAndDisplayRoute(directionsService, directionsDisplay,travelMode);
    });
    document.getElementById('iconDibo').addEventListener('click',function(){
        travelMode="WALKING";
        document.getElementById('iconChiDuong').style.background='';
        document.getElementById('iconOto').style.background = '';
        document.getElementById('iconXebus').style.background = '';
        document.getElementById('iconDibo').style.background = 'rgb(65, 165, 225)';
        document.getElementById('iconXedap').style.background = '';

        directionsDisplay.setMap(map);
        directionsDisplay.setPanel(document.getElementById('huongdan'));
        calculateAndDisplayRoute(directionsService, directionsDisplay,travelMode);
    });
    document.getElementById('iconXedap').addEventListener('click',function(){
        travelMode="DRIVING";
        document.getElementById('iconOto').style.background = '';
        document.getElementById('iconXebus').style.background = '';
        document.getElementById('iconDibo').style.background = '';
        document.getElementById('iconXedap').style.background = 'rgb(65, 165, 225)';

        directionsDisplay.setMap(map);
        directionsDisplay.setPanel(document.getElementById('huongdan'));
        calculateAndDisplayRoute(directionsService, directionsDisplay,travelMode);
    });

    directionsDisplay.setMap(map);
    directionsDisplay.setPanel(document.getElementById('huongdan'));

    var start_autocomplete = new google.maps.places.Autocomplete(start);
    start_autocomplete.bindTo('bounds', map);
    var end_autocomplete = new google.maps.places.Autocomplete(end);
    end_autocomplete.bindTo('bounds', map);

    function calculateAndDisplayRoute(directionsService, directionsDisplay,travelMode) {
      map.setZoom(12);
      var origin=null;
      var des = end_autocomplete.getPlace();
      if(k===1){
        if(kt===1){
          origin = getPlace;
          directionsService.route({
            origin: {placeId:origin.place_id},
            destination: {placeId:des.place_id},
            travelMode: travelMode
          }, function(response, status) {
            if (status === 'OK') {
              directionsDisplay.setDirections(response);
            }
          });
        }
        else if(kt===0){
          origin= positionStart
          directionsService.route({
            origin: origin,
            destination: {placeId:des.place_id},
            travelMode: travelMode
          }, function(response, status) {
            if (status === 'OK') {
              directionsDisplay.setDirections(response);
            }
          });
        }
        
      }
      else if(k===0){
        origin = start_autocomplete.getPlace(); 
        directionsService.route({
          origin: {placeId:origin.place_id},
          destination: {placeId:des.place_id},
          travelMode: travelMode
        }, function(response, status) {
          if (status === 'OK') {
            directionsDisplay.setDirections(response);
          }
        });
      }
        
    }
    start_autocomplete.addListener('place_changed', function() {
      search(start_autocomplete);
      calculateAndDisplayRoute(directionsService, directionsDisplay, travelMode);
    });
    end_autocomplete.addListener('place_changed', function() {
      search(end_autocomplete);
      calculateAndDisplayRoute(directionsService, directionsDisplay, travelMode);
    });

    //event click menu
    var menu=document.getElementById('menu');
    menu.style.display="none";
    document.getElementById('divmenu1').addEventListener('click',function(){
        menu.style.display="inline";
    });
    document.getElementById('divmenu2').addEventListener('click',function(){
        menu.style.display="inline";
    });
    document.getElementById('exitMenu').addEventListener('click',function(){
        menu.style.display="none";
    });
    //quận , khoa
    document.getElementById('tableQuan').style.display="none";
    document.getElementById('tableKhoa').style.display="none";
    document.getElementById('arrow_len').style.display="none";
    document.getElementById('arrow_xuong').addEventListener('click',function(){
        document.getElementById('arrow_xuong').style.display="none";
        document.getElementById('arrow_len').style.display="inline";
        document.getElementById('tableQuan').style.display="inline";
        document.getElementById('tableKhoa').style.display="inline";

        document.getElementById('listQuan').style.width="445px";
        document.getElementById('listQuan').style.height="200px";

        document.getElementById('tableQuan').width="445px";

        document.getElementById('tableKhoa').style.width="445px";
    });
    document.getElementById('arrow_len').addEventListener('click',function(){
        document.getElementById('arrow_xuong').style.display="inline";
        document.getElementById('arrow_len').style.display="none";
        document.getElementById('tableQuan').style.display="none";
        document.getElementById('tableKhoa').style.display="none";
        document.getElementById('listQuan').style.height="0px";     
    });
    //xử lý checkbox quận
    var classname=document.getElementsByClassName("findDistrict");
    var markers2=[];
    Array.from(classname).forEach(function(element) {
      markers2[element.value]=new Array();
      element.checked=false;
      element.addEventListener('click', function(){
        
        if(element.checked===true){
          map.setZoom(13);
          downloadUrl("infoHospital_xml.php", function(data) {
          var xml = data.responseXML;
          var markers = xml.documentElement.getElementsByTagName("hospital");
          var khoa = xml.documentElement.getElementsByTagName("khoa");
          var idHpt, nameHpt,addressHpt,phoneHpt,webHpt,nameDistrict,type,imageHpt,placeId,s;
          
          for (var i = 0; i < markers.length; i++) {
            var idDistrict= markers[i].getAttribute("idDistrict");
            if(element.value===idDistrict){
               idHpt=markers[i].getAttribute("idHpt");
               nameHpt = markers[i].getAttribute("nameHpt");
               addressHpt = markers[i].getAttribute("addressHpt");
               phoneHpt = markers[i].getAttribute("phoneHpt");
               webHpt = markers[i].getAttribute("webHpt");
               nameDistrict = markers[i].getAttribute("nameDistrict");
               type = markers[i].getAttribute("type");
               imageHpt = markers[i].getAttribute("imageHpt");
               placeId = markers[i].getAttribute("placeId");
               var point = new google.maps.LatLng(
                parseFloat(markers[i].getAttribute("lat")),
                parseFloat(markers[i].getAttribute("lng")));
              var k=0;
              var nameKhoa= [];
               s="";
              for(var j = 0; j<khoa.length; j++){
                var idHpt_khoa=khoa[j].getAttribute("idHpt");
                if(idHpt_khoa===idHpt){
                    k++;
                    nameKhoa[k-1]=khoa[j].getAttribute("nameKhoa");
                    s+='<span style="margin-left:20px;width:150px;color:black;float:left"><a class="listKhoa" value="'+idHpt+'" href="DoiNguBacSiChuyenKhoa.php?idHpt='+idHpt+'">'+nameKhoa[k-1]+'</a></span>';
                }
              }
            }
          
          var icons=customIcons[type]||{};
          var marker=new google.maps.Marker({
            map:map,
            position:point,
            icon:icons
          });
          markers2[element.value].push(marker);
          var html=contentinfoWindow(s, nameHpt, addressHpt, imageHpt, nameDistrict, phoneHpt, webHpt);
          bindInfoWindow(marker, map, infoWindow, html)
          }
          
            });
        }
        else{
          markers2[element.value].forEach(function(marker) {
            marker.setMap(null);
          });
        } 
      });
    });
    //xử lý checkbox khoa
    var classname=document.getElementsByClassName("findKhoa");
    markers2=[];
    Array.from(classname).forEach(function(element) {
      markers2[element.value]=new Array();
      element.checked=false;
      element.addEventListener('click', function(){
        
        if(element.checked===true){
          map.setZoom(13);
          downloadUrl("infoHospital_xml.php", function(data) {
          var xml = data.responseXML;
          var markers = xml.documentElement.getElementsByTagName("hospital");
          var khoa = xml.documentElement.getElementsByTagName("khoa");
          var idHpt, nameHpt,addressHpt,phoneHpt,webHpt,nameDistrict,type,imageHpt,placeId,s;
          
          for (var i = 0; i < markers.length; i++) {
              var k=0;
              var nameKhoa= [];
               s="";
               idHpt=markers[i].getAttribute("idHpt");
              for(var j = 0; j<khoa.length; j++){
                var idKhoa= khoa[j].getAttribute("idKhoa");
                var idHpt_khoa=khoa[j].getAttribute("idHpt");
                if(idHpt_khoa===idHpt){
                    k++;
                    nameKhoa[k-1]=khoa[j].getAttribute("nameKhoa");
                    s+='<span style="margin-left:20px;width:150px;color:black;float:left"><a class="listKhoa" value="'+idHpt+'" href="DoiNguBacSiChuyenKhoa.php?idHpt='+idHpt+'">'+nameKhoa[k-1]+'</a></span>';
                  if(element.value===idKhoa){
                    idHpt=markers[i].getAttribute("idHpt");
                    nameHpt = markers[i].getAttribute("nameHpt");
                    addressHpt = markers[i].getAttribute("addressHpt");
                    phoneHpt = markers[i].getAttribute("phoneHpt");
                    webHpt = markers[i].getAttribute("webHpt");
                    nameDistrict = markers[i].getAttribute("nameDistrict");
                    type = markers[i].getAttribute("type");
                    imageHpt = markers[i].getAttribute("imageHpt");
                    placeId = markers[i].getAttribute("placeId");
                    var point = new google.maps.LatLng(
                    parseFloat(markers[i].getAttribute("lat")),
                    parseFloat(markers[i].getAttribute("lng")));                
                  }
                }

              }
          var icons=customIcons[type]||{};
          var marker=new google.maps.Marker({
            map:map,
            position:point,
            icon:icons
          });
          markers2[element.value].push(marker);
          var html=contentinfoWindow(s, nameHpt, addressHpt, imageHpt, nameDistrict, phoneHpt, webHpt);
          bindInfoWindow(marker, map, infoWindow, html)
          }
          
            });
        }
        else{
          markers2[element.value].forEach(function(marker) {
            marker.setMap(null);
          });
        } 
      });
    });
    //tìm kiếm lân cận
    document.getElementById("exitPanel").addEventListener('click',function(){
      markers1.forEach(function(marker) {
        marker.setMap(null);
      });
    
      markers.forEach(function(marker) {
        marker.setMap(null);
      });
      document.getElementById("right-panel").style.display="none";
      
    });
    var service = new google.maps.places.PlacesService(map);
    document.getElementById('findAll').addEventListener('click',function(){

      document.getElementById("right-panel").style.display="inline";
      document.getElementById('places').innerHTML="";
      var radius=parseFloat(document.getElementById("radius").value) * 1000;
      markers1.forEach(function(marker) {
        marker.setMap(null);
      });
      map.setZoom(15);
        service.nearbySearch({
          location:pyrmont,
          radius: radius,
          type: ['hospital']
        }, abc);
        
    });
    function abc(results, status) {
        if (status === google.maps.places.PlacesServiceStatus.OK) {
          for (var i = 0; i < results.length; i++) {
            createMarker1(results[i]);
          }
        }
      }
  var markers1=[];
  function createMarker1(place) {
    var placesList = document.getElementById('places');
    placesList.innerHTML += '<li class="classli" id="'+place.place_id+'">'  + place.name + '</li>';

    var classname=document.getElementsByClassName("classli");
    Array.from(classname).forEach(function(element) {
      element.addEventListener('click', function(){
        downloadUrl("infoHospital_xml.php", function(data) {
        var xml = data.responseXML;

        var markers = xml.documentElement.getElementsByTagName("hospital");
        var khoa = xml.documentElement.getElementsByTagName("khoa");
        var idHpt, nameHpt,addressHpt,phoneHpt,webHpt,nameDistrict,type,imageHpt,placeId,s;
        
        for (var i = 0; i < markers.length; i++) {
          var placeIdDB = markers[i].getAttribute("placeId");

          if(placeIdDB===element.id){
             idHpt=markers[i].getAttribute("idHpt");
             nameHpt = markers[i].getAttribute("nameHpt");
             addressHpt = markers[i].getAttribute("addressHpt");
             phoneHpt = markers[i].getAttribute("phoneHpt");
             webHpt = markers[i].getAttribute("webHpt");
             nameDistrict = markers[i].getAttribute("nameDistrict");
             type = markers[i].getAttribute("type");
             imageHpt = markers[i].getAttribute("imageHpt");
             placeId = markers[i].getAttribute("placeId");
            var k=0;
            var nameKhoa= [];
             s="";
            for(var j = 0; j<khoa.length; j++){
              var idHpt_khoa=khoa[j].getAttribute("idHpt");
              if(idHpt_khoa===idHpt){
                  k++;
                  nameKhoa[k-1]=khoa[j].getAttribute("nameKhoa");
                  s+='<span style="margin-left:20px;width:150px;color:black;float:left"><a class="listKhoa" value="'+idHpt+'" href="DoiNguBacSiChuyenKhoa.php?idHpt='+idHpt+'">'+nameKhoa[k-1]+'</a></span>';
              }
            }
          }
        }
        var thongtinchitiet=document.getElementById("thongTinChiTiet");
        thongtinchitiet.style.display="inline";
        document.getElementById("divPlaces").style.display="none";
        var html=contentinfoWindow(s, nameHpt, addressHpt, imageHpt, nameDistrict, phoneHpt, webHpt);
        thongtinchitiet.innerHTML='<div style="font-size:12px;padding-top:15px">'+html+
                                  '<i id="thoatDS" class="fas fa-backspace" style="font-size:1.33em;color:black; position:absolute;right:0px;top:0px">'+
                                  '</div>';
        document.getElementById("thoatDS").addEventListener('click',function(){
          thongtinchitiet.style.display="none";
          document.getElementById("divPlaces").style.display="inline";
        });
        });
      });
    });

    var icon;
    if(place.name.substring(0,1)==="B"){
      icon=customIcons["BV"]||{};
    }
    else
      icon=customIcons["PK"]||{};
    var marker = new google.maps.Marker({
      map: map,
      icon:icon
    });

    marker.setPlace({
      placeId: place.place_id,
      location: place.geometry.location
    });
    markers1.push(marker);
    marker.setVisible(true);
    downloadUrl("infoHospital_xml.php", function(data) {
    var xml = data.responseXML;

    var markers = xml.documentElement.getElementsByTagName("hospital");
    var khoa = xml.documentElement.getElementsByTagName("khoa");
    var idHpt, nameHpt,addressHpt,phoneHpt,webHpt,nameDistrict,type,imageHpt,placeId,s;
    
    for (var i = 0; i < markers.length; i++) {
      var placeIdDB = markers[i].getAttribute("placeId");

      if(placeIdDB===place.place_id){
         idHpt=markers[i].getAttribute("idHpt");
         nameHpt = markers[i].getAttribute("nameHpt");
         addressHpt = markers[i].getAttribute("addressHpt");
         phoneHpt = markers[i].getAttribute("phoneHpt");
         webHpt = markers[i].getAttribute("webHpt");
         nameDistrict = markers[i].getAttribute("nameDistrict");
         type = markers[i].getAttribute("type");
         imageHpt = markers[i].getAttribute("imageHpt");
         placeId = markers[i].getAttribute("placeId");
        var k=0;
        var nameKhoa= [];
         s="";
        for(var j = 0; j<khoa.length; j++){
          var idHpt_khoa=khoa[j].getAttribute("idHpt");
          if(idHpt_khoa===idHpt){
              k++;
              nameKhoa[k-1]=khoa[j].getAttribute("nameKhoa");
              s+='<span style="margin-left:20px;width:150px;color:black;float:left"><a class="listKhoa" value="'+idHpt+'" href="DoiNguBacSiChuyenKhoa.php?idHpt='+idHpt+'">'+nameKhoa[k-1]+'</a></span>';
          }
        }
      }
    }

    var html=contentinfoWindow(s, nameHpt, addressHpt, imageHpt, nameDistrict, phoneHpt, webHpt);
    if(place.place_id===placeId){
        bindInfoWindow(marker, map, infoWindow, html)
    }
    else{
    var contentInfo='<div><strong>' + place.name + '</strong><br>' +'Place ID: ' + place.place_id + '<br>' +place.formatted_address;
    bindInfoWindow(marker, map, infoWindow, contentInfo)
    } 
      });
    marker.addListener('click', function() {
      infoWindow.open(map, marker);
    });
  }
  //click vào tên khoa hiện danh sách bác sĩ
  var classname=document.getElementsByClassName("listKhoa");
    Array.from(classname).forEach(function(element) {
      element.addEventListener('click', function(){
        alert("haha");
        window.location="DoiNguBacSiChuyenKhoa.php?idHpt="+element.value;
      });
    });
}
function bindInfoWindow(marker, map, infoWindow, html) {
      google.maps.event.addListener(marker, 'click', function() {
        infoWindow.setContent(html);
        infoWindow.open(map, marker);
      });
    }
function handleLocationError(browserHasGeolocation, infoWindow, pos) {
        infoWindow.setPosition(pos);
        infoWindow.setContent(browserHasGeolocation ?
                              'Error: The Geolocation service failed.' :
                              'Error: Your browser doesn\'t support geolocation.');
      }

//
function markerdragEvent(markers){
    for (var i = 0, marker; marker = markers[i]; i++) {
        $("#maps_mapcenterlat").val(marker.position.lat());
        $("#maps_mapcenterlng").val(marker.position.lng());

        google.maps.event.addListener(marker, 'drag', function(e) {
            $("#maps_mapcenterlat").val(e.latLng.lat());
            $("#maps_mapcenterlat").val(e.latLng.lng());
        });
    }
}
// Gán hàm initialize vào trong sự kiện load dom google map
google.maps.event.addDomListener(window, 'load', initialize);

