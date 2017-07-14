
//現在値情報
var myLatlng;

//描画するマップ
var map1;

<!-- initialize()関数を定義 -->
function initialize() {
  if (navigator.geolocation) {
  
  // 位置情報取得のオプション。高精度にする
  var position_options = {
    enableHightAccuracy: true
  };
  
  // 現在の位置情報取得を実施 正常に位置情報が取得できると、
  // successCallbackがコールバックされる。
  navigator.geolocation.getCurrentPosition(successCallback,errorCallback);
  } else {
    alert("ごめんなさい。本ブラウザではGeolocationが使えません")
  }
  
}

// ( 2 )位置情報が正常に取得されたら
function successCallback(pos) {
  var Potition_latitude = pos.coords.latitude;
  var Potition_longitude = pos.coords.longitude;
  
  // 位置情報が取得出来たらGoogle Mapを表示する
  start(Potition_latitude,Potition_longitude);
}
 
function errorCallback(error) {
  alert("位置情報が許可されていません。位置情報をオンにしてください。");
}

function start(x,y){
  // 地図を表示する際のオプションを設定
  
  myLatlng = new google.maps.LatLng(x,y);
  
  var mapOptions = {
      center: myLatlng,
      zoom: 15,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      //position: google.maps.ControlPosition.TOP_CENTER
  };

  // Mapオブジェクトに地図表示要素情報とオプション情報を渡し、インスタンス生成
  map1 = new google.maps.Map(document.getElementById("map_canvas"), mapOptions);
  
  var marker = new google.maps.Marker({
  position: myLatlng,
  map: map1,
  title:"現在地"
  });
  get_area_name(myLatlng);
}

function get_area_name(latLng_now){
  // 座標から住所名を取得
  var geocoder = new google.maps.Geocoder();
  geocoder.geocode({latLng: latLng_now}, function(results, status){
    if(status == google.maps.GeocoderStatus.OK){
    document.getElementById("area_name").innerHTML = results[0].formatted_address+'付近にいます';
    } else {
    alert("エラー")
    }
  });
}

function getPlace(address){
        //alert("aaa")
        var service = new google.maps.places.PlacesService(map1);
        //alert(address)
        var placeRequest = {
            query: address, //入力したテキスト
        }
        //リクエストを送ってあげるとプレイス情報を格納したオブジェクトを返してくる。
        service.textSearch(placeRequest,function(results,status){
            console.log("1"+status)
            var places = results[0];
            toGeocode(places);
        });
}

function toGeocode(places){
    //取得したplacesオブジェクトから緯度と経度をgeocodeとして渡します。
    var latlng = new google.maps.LatLng(places.geometry.location.lat(),places.geometry.location.lng());
    //ルート取得
    getRoute(latlng);
}

function getRoute(latlng){
    var request = {
        origin: myLatlng, 
        destination: latlng, //到着地点の緯度、経度
        travelMode: google.maps.DirectionsTravelMode.WALKING //ルートの種類
    }
    directionsService.route(request,function(result, status){
        onsole.log("2"+status)
        toRender(result);
    });
}

function toRender(result){
    directionsDisplay = new google.maps.DirectionsRenderer();
    directionsDisplay.setDirections(result); //取得した情報をset
    directionsDisplay.setMap(map1); //マップに描画
}







