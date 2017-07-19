
//現在値情報
var myLatlng;

//描画するマップ
var map1;

var directions;

//現在地のマーカー
var marker = null;

//フラグ
var initialize_route_flag = false;

//車(2)か徒歩(1)か
var drive_or_walk_flag = 1;

//うりぼーモードON,OFF
var uribo_flag = true;

//うりぼー画像の情報
var image;

//作成するマーカーのリスト
var marker_list = [];

//失敗回数をカウントするカウンター
false_counter = 0;

//イメージアイコン
var image_icon = ["marker_blue.png","marker_green.png","marker_purple.png"];


<!-- initialize()関数を定義 -->
function initialize() {
  if (navigator.geolocation) {
  set_on_off('on');
  // 位置情報取得のオプション。高精度にする
  var position_options = {
    enableHightAccuracy: true,
    timeout:10000, //タイムアウトは10秒
    maximumAge:0 //キャッシュは使用禁止
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
  
  myLatlng = new google.maps.LatLng(x,y);
  
  if (marker){// マーカーがすでにあるなら消去
    marker.setMap(null);
  }else{ //もし、初期化で呼び出されたならば
    // 地図を表示する際のオプションを設定
    var mapOptions = {
      center: myLatlng,
      zoom: 12,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      //position: google.maps.ControlPosition.TOP_CENTER
    };
  
    // Mapオブジェクトに地図表示要素情報とオプション情報を渡し、インスタンス生成
    map1 = new google.maps.Map(document.getElementById("map_canvas"), mapOptions);
  }
  
  
  marker = new google.maps.Marker({
    position: myLatlng,
    //map: map1,
    title: "現在地",
    icon: image,
    optimized: !uribo_flag,//うりぼーフラグがtrueならfalseに設定,これでgifが動く
    zIndex: 5
  });
  marker.setMap(map1);
  map1.setCenter( myLatlng );
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

function search_route(callback){
  callback(2);
  document.getElementById("clear_route").disabled = false;
  directionsService = new google.maps.DirectionsService();
  
  var mapOptions = {
      center: myLatlng,
      zoom: map1.getZoom(),
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      //position: google.maps.ControlPosition.TOP_CENTER
  };

  // Mapオブジェクトに地図表示要素情報とオプション情報を渡し、インスタンス生成
  map1 = new google.maps.Map(document.getElementById("map_canvas"), mapOptions);
  marker = new google.maps.Marker({
  position: myLatlng,
  map: map1,
  title:"現在地",
  zIndex: 5,
  icon: image,
  optimized: !uribo_flag,//うりぼーフラグがtrueならfalseに設定,これでgifが動く
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
  
  var directionsDisplay = new google.maps.DirectionsRenderer(rendererOptions); // ルート案内
  directionsDisplay.setMap(map1);
  if (document.getElementById("route").childNodes[0]){
    document.getElementById("route").removeChild(document.getElementById("route").childNodes[0]);
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
  var start_point = document.getElementById("start_address").value;
  if (start_point == ""){
    start_point = myLatlng;
    create_maker("出発地", myLatlng, make_maker, 1);
  }else{
    set_Center(start_point);
    create_maker(start_point, null, make_maker, 1);
  }
  var end = document.getElementById("end_address").value;
  if (end != ""){
    create_maker(end, null, make_maker, 2);
  }
  var waypoint1 = document.getElementById("via_address").value;
  if (waypoint1 !=""){
    var request = {
      origin:start_point, // 出発地
      destination:end, // 目的地
      waypoints:[{location:waypoint1}], //途中経路
      travelMode: travel_mode //移動手段
    };
    create_maker(waypoint1, null,make_maker, 3);
  }else{
    var request = {
      origin:start_point, // 出発地
      destination:end, // 目的地
      travelMode: travel_mode //移動手段
    };
  }
  directionsService.route(request, function(results, status) {
    if (status == ds.OK) {
      while(1){//マーカーを描画
        m = marker_list.pop();
        if (m != undefined){
          m.setMap(map1);
        }else{
          break;
        }
      }
      directionsDisplay.setDirections(results); // 描画
    }else{
      alert("ルート検索が失敗しました。" + directionsErr[status]);
      //initialize_route_flag = false;
      while(1){
        m = marker_list.pop();
        if (m == undefined){
          break;
        }
      }
    }
  });
  callback(1);
}


//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//geocodeは非同期なのでコールバック処理
function create_maker(address_data, now_latlng, callback, image_num){
  if (now_latlng == null){
      var geocoder = new google.maps.Geocoder();
      geocoder.geocode( { 'address': address_data, 'language': 'ja'}, function(results, status) {
        if(status == google.maps.GeocoderStatus.OK){
          callback(address_data, new google.maps.LatLng(results[0].geometry.location.lat(),results[0].geometry.location.lng()), image_num);
        } else {
          //false_counter = false_counter + 1;
          //if (false_counter==10){
            alert("マーカーの作成に失敗しました。もう一度検索しなおしてみてください。\n(どうしても上手く行かない場合、検索ワードを変えると上手く行くこともあります。)")
            //false_counter = 0;
          //}else{
            //create_maker(address_data, now_latlng, callback, image_num);
          //}
        }
      });
  }else{
    callback(address_data, now_latlng, image_num);
  }
}

function make_maker(address_data, latlng, image_num){
  var point_marker = new google.maps.Marker({
    position: latlng,
    //map: map1,
    label: {
      text: address_data,
      color: "black",
      fontSize: "12px",
    },
    icon: { 
      url: image_icon[image_num - 1], 
      scaledSize: new google.maps.Size( 40, 40 )
    },
    zIndex: 1
  });
  marker_list.push(point_marker);
}

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function set_Center(address){
  var geocoder = new google.maps.Geocoder();
  geocoder.geocode( { 'address': address, 'language': 'ja'}, function(results, status) {
    if(status == google.maps.GeocoderStatus.OK){
      map1.setCenter(new google.maps.LatLng(results[0].geometry.location.lat(),results[0].geometry.location.lng()));
    } else {
      
    }
  });
}


function set_move(move_num){
  drive_or_walk_flag = move_num;
}

function init_map(){
  //initialize_route_flag = false;
  if (document.getElementById("route").childNodes[0]){
    document.getElementById("route").removeChild(document.getElementById("route").childNodes[0]);
  }
  clear_map();
}

function clear_map(){
  // 地図を表示する際のオプションを設定
  var mapOptions = {
    center: myLatlng,
    zoom: map1.getZoom(),
    mapTypeId: google.maps.MapTypeId.ROADMAP,
    //position: google.maps.ControlPosition.TOP_CENTER
  };
  
  // Mapオブジェクトに地図表示要素情報とオプション情報を渡し、インスタンス生成
  map1 = new google.maps.Map(document.getElementById("map_canvas"), mapOptions);
  
  marker = new google.maps.Marker({
    position: myLatlng,
    //map: map1,
    title: "現在地",
    icon: image,
    optimized: !uribo_flag,//うりぼーフラグがtrueならfalseに設定,これでgifが動く
    zIndex: 5
  });
  
  marker.setMap(map1);
  map1.setCenter( myLatlng );
  get_area_name(myLatlng);
}

function marker_reset(){
  if(marker){
    marker.setMap(null);
    marker = new google.maps.Marker({
      position: myLatlng,
      //map: map1,
      title: "現在地",
      icon: image,
      optimized: !uribo_flag,//うりぼーフラグがtrueならfalseに設定,これでgifが動く
      zIndex: 5
    });
    marker.setMap(map1);
  }
}


function set_on_off(mode){
  if (mode == 'on'){
    uribo_flag = true;
    //うりぼー画像設定
    image = { url: "./uribo.gif", scaledSize: new google.maps.Size( 40, 40 ) };
  }else{
    uribo_flag = false;
    image = { url: "./marker_red.png", scaledSize: new google.maps.Size( 40, 40 ) };
  }
  marker_reset();
}
