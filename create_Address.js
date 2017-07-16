
//現在値情報
var myLatlng;

//描画するマップ
var map1;


var directions;

//現在地のマーカー
var marker;

//フラグ
var initialize_map_flag = false;

//フラグ
var initialize_route_flag = false;

//車(2)か徒歩(1)か
var drive_or_walk_flag = 1;


/*var directionsErr = new Array(); //ルート結果のエラーメッセージ 
directionsErr[ds.INVALID_REQUEST] = "指定された DirectionsRequest が無効です。"; 
directionsErr[ds.MAX_WAYPOINTS_EXCEEDED] = "DirectionsRequest に指定された DirectionsWaypoint が多すぎます。ウェイポイントの最大許容数は 8 に出発地点と到着地点を加えた数です。"; 
directionsErr[ds.NOT_FOUND] = "出発地点、到着地点、ウェイポイントのうち、少なくとも 1 つがジオコード化できませんでした。"; 
directionsErr[ds.OVER_QUERY_LIMIT] = "ウェブページは、短期間にリクエストの制限回数を超えました。"; 
directionsErr[ds.REQUEST_DENIED] = "ウェブページではルート サービスを使用できません。"; 
directionsErr[ds.UNKNOWN_ERROR] = "サーバー エラーのため、ルート リクエストを処理できませんでした。もう一度試すと正常に処理される可能性があります。"; 
directionsErr[ds.ZERO_RESULTS] = "出発地点と到着地点間でルートを見つけられませんでした。"; 
*/

<!-- initialize()関数を定義 -->
function initialize() {
  if (navigator.geolocation) {
  
  // 位置情報取得のオプション。高精度にする
  var position_options = {
    enableHightAccuracy: true
  };
  
  // 現在の位置情報取得を実施 正常に位置情報が取得できると、
  // successCallbackがコールバックされる。
  //navigator.geolocation.getCurrentPosition(successCallback,errorCallback);
  navigator.geolocation.watchPosition(successCallback,errorCallback);
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
  
  if (initialize_map_flag == false){//もし、初期化で呼び出されたならば
    
    myLatlng = new google.maps.LatLng(x,y);
    
    // 地図を表示する際のオプションを設定
    var mapOptions = {
      center: myLatlng,
      zoom: 12,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      //position: google.maps.ControlPosition.TOP_CENTER
    };
  
    // Mapオブジェクトに地図表示要素情報とオプション情報を渡し、インスタンス生成
    map1 = new google.maps.Map(document.getElementById("map_canvas"), mapOptions);
    
    initialize_map_flag = true; // 初期化しました
    
  }else{
    marker.setMap(null);
  }
  
  marker = new google.maps.Marker({
  position: myLatlng,
  //map: map1,
  title:"現在地"
  });
  marker.setMap(map1);
  get_area_name(myLatlng);
}

function get_area_name(latLng_now){
  // 座標から住所名を取得
  var geocoder = new google.maps.Geocoder();
  geocoder.geocode({latLng: latLng_now}, function(results, status){
    if(status == google.maps.GeocoderStatus.OK){
      document.getElementById("area_name").innerHTML = results[0].formatted_address+'付近にいます';
    } else {
      //alert("エラー")
    }
  });
}


/*function s() {
  myLatlng = new google.maps.LatLng(34.68639,135.52);
  
  var mapOptions = {
      center: myLatlng,
      zoom: 12,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      //position: google.maps.ControlPosition.TOP_CENTER
  };

  // Mapオブジェクトに地図表示要素情報とオプション情報を渡し、インスタンス生成
  map1 = new google.maps.Map(document.getElementById("map_canvas"), mapOptions);
  
  var marker = new google.maps.Marker({
  position: myLatlng,
  map: map1,
  title:"東京"
  });
  
}*/


/*function initialize(){
  s();
  search_route();
}*/


function search_route(){
  directionsService = new google.maps.DirectionsService();
  
  var mapOptions = {
      center: myLatlng,
      zoom: 12,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      //position: google.maps.ControlPosition.TOP_CENTER
  };

  // Mapオブジェクトに地図表示要素情報とオプション情報を渡し、インスタンス生成
  map1 = new google.maps.Map(document.getElementById("map_canvas"), mapOptions);
  marker = new google.maps.Marker({
  position: myLatlng,
  map: map1,
  title:"現在地"
  });
  get_area_name(myLatlng);
  
  rendererOptions = {
    draggable: false,    //ドラッグ操作の有効/無効
    preserveViewport: true,    //ズームの有無
    suppressMarkers: true,    //デフォルトのマーカーを非表示
    polylineOptions: {    //ルートの色と太さはここで変える
        strokeColor:"#f00",    //色
        strokeWeight:3    //太さ
    }
  };
  
  var ds = google.maps.DirectionsStatus;//ルート結果のステータス
  var directionsErr = new Array(); //ルート結果のエラーメッセージ 
  directionsErr[ds.INVALID_REQUEST] = "指定された DirectionsRequest が無効です。"; 
  directionsErr[ds.MAX_WAYPOINTS_EXCEEDED] = "DirectionsRequest に指定された DirectionsWaypoint が多すぎます。ウェイポイントの最大許容数は 8 に出発地点と到着地点を加えた数です。"; 
  directionsErr[ds.NOT_FOUND] = "出発地点、到着地点、ウェイポイントのうち、少なくとも 1 つがジオコード化できませんでした。"; 
  directionsErr[ds.OVER_QUERY_LIMIT] = "ウェブページは、短期間にリクエストの制限回数を超えました。"; 
  directionsErr[ds.REQUEST_DENIED] = "ウェブページではルート サービスを使用できません。"; 
  directionsErr[ds.UNKNOWN_ERROR] = "サーバー エラーのため、ルート リクエストを処理できませんでした。もう一度試すと正常に処理される可能性があります。"; 
  directionsErr[ds.ZERO_RESULTS] = "出発地点と到着地点間でルートを見つけられませんでした。"; 
  
  
  /*myLatlng = new google.maps.LatLng(35.681382,139.766084);
  
  var mapOptions = {
      center: myLatlng,
      zoom: 50,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      //position: google.maps.ControlPosition.TOP_CENTER
  };

  // Mapオブジェクトに地図表示要素情報とオプション情報を渡し、インスタンス生成
  map1 = new google.maps.Map(document.getElementById("map_canvas"), mapOptions);
  */
  
  var directionsDisplay = new google.maps.DirectionsRenderer(rendererOptions); // ルート案内
  directionsDisplay.setMap(map1);
  if (initialize_route_flag == true){
    document.getElementById("route").removeChild(document.getElementById("route").childNodes[0]);
  }else{
    initialize_route_flag = true;
  }
  directionsDisplay.setPanel(document.getElementById("route"));
  google.maps.event.addListener(directionsDisplay,'directions_changed', function(){});
  
  //var start = "梅田駅";
  //var end = "天王寺駅";
  
  var travel_mode;
  
  if (drive_or_walk_flag == 1){
    travel_mode = google.maps.DirectionsTravelMode.WALKING;
  }else{
    travel_mode = google.maps.DirectionsTravelMode.DRIVING;
  }
  //console.log(travel_mode);
  var end = document.getElementById("end_address").value;
  var waypoint1 = document.getElementById("via_address").value;
  if (waypoint1 !=""){
    var request = {
      origin:myLatlng, // 出発地
      destination:end, // 目的地
      waypoints:[{location:waypoint1}], //途中経路
      travelMode: travel_mode //移動手段
    };
  }else{
    var request = {
      origin:myLatlng, // 出発地
      destination:end, // 目的地
      travelMode: travel_mode //移動手段
    };
  }
  directionsService.route(request, function(results, status) {
    if (status == ds.OK) {
      directionsDisplay.setDirections(results); // 描画
      // ポリライン(折れ線)を生成し、マップに表示 
      /*var poly = new google.maps.Polyline({
      map: map1,              //マップ 
      path: results.routes[0].overview_path,//ポリラインの座標の列 
      strokeWeight: 5,       //ストローク幅(ピクセル単位) 
      strokeColor: "#f01010",//16進数形式のストロークの色 
      strokeOpacity: 0.5     //ストロークの不透明度(0.0～1.0) 
      }); 
      // 検索結果の中心設定 
      map1.setCenter(results.routes[0].bounds.getCenter());*/
    }else{
      alert("ルート検索が失敗しました。" + directionsErr[status]);
    }
  });
}

function create_maker(latlng){
  var point_marker = new google.maps.Marker({
  position: latlng,
  map: map1,
  title:address
  });
}

function get_area_name_a(address){
  // 座標から住所名を取得
  var latlng;
  var geocoder = new google.maps.Geocoder();
  geocoder.geocode({address: address}, function(results, status){
    if(status == google.maps.GeocoderStatus.OK){
      latlng = results[0].geometry.location;
    } else {
      latlng = -1;
      alert("エラー");
    }
  });
  return latlng;
}

function set_move(move_num){
  drive_or_walk_flag = move_num;
}

function init_map(){
  initialize_map_flag = false;
  initialize_route_flag = false;
  document.getElementById("route").removeChild(document.getElementById("route").childNodes[0]);
  initialize();
}

