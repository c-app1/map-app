<!-- initialize()�֐����` -->
function initialize() {
  if (navigator.geolocation) {
  
  // �ʒu���擾�̃I�v�V�����B�����x�ɂ���
  var position_options = {
    enableHightAccuracy: true
  };
  
  // ���݂̈ʒu���擾�����{ ����Ɉʒu��񂪎擾�ł���ƁA
  // successCallback���R�[���o�b�N�����B
  navigator.geolocation.getCurrentPosition(successCallback,errorCallback);
  } else {
    alert("���߂�Ȃ����B�{�u���E�U�ł�Geolocation���g���܂���")
  }
  
}

// ( 2 )�ʒu��񂪐���Ɏ擾���ꂽ��
function successCallback(pos) {
  var Potition_latitude = pos.coords.latitude;
  var Potition_longitude = pos.coords.longitude;
  
  // �ʒu��񂪎擾�o������Google Map��\������
  start(Potition_latitude,Potition_longitude);
}
 
function errorCallback(error) {
  alert("�ʒu��񂪋�����Ă��܂���B�ʒu�����I���ɂ��Ă��������B");
}

function start(x,y){
  // �n�}��\������ۂ̃I�v�V������ݒ�
  
  var myLatlng = new google.maps.LatLng(x,y);
  
  var mapOptions = {
      center: myLatlng,
      zoom: 15,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      //position: google.maps.ControlPosition.TOP_CENTER
  };

  // Map�I�u�W�F�N�g�ɒn�}�\���v�f���ƃI�v�V��������n���A�C���X�^���X����
  var map = new google.maps.Map(document.getElementById("map_canvas"), mapOptions);
  
  var marker = new google.maps.Marker({
  position: myLatlng,
  map: map,
  title:"���ݒn"
  });
  get_area_name(myLatlng);
}

function get_area_name(latLng_now){
  // ���W����Z�������擾
  var geocoder = new google.maps.Geocoder();
  geocoder.geocode({latLng: latLng_now}, function(results, status){
    if(status == google.maps.GeocoderStatus.OK){
    document.getElementById("area_name").innerHTML = results[0].formatted_address+'�t�߂ɂ��܂�';
    } else {
    alert("�G���[")
    }
  });
}