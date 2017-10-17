/**
 * Created by nxy on 2017/9/21.
 */

isLogin(function(){
  getUserId();

});
var qrcode = new QRCode(document.getElementById("qrcode"), {
  width : 172,
  height : 172
});
var productsId = 1;
var productIndex = 1;
var number = 0;
var orderNo = '';
var time = null;

$(".recharge-package").on('click',function () {
  orderNo = '';
  clearInterval(time);
  qrcode.clear();
  $(".ways").hide();
  $("#confirm").show();
  var index = $(this).index();
  if(index == 0) {
    productIndex = 1;
    productsId = 1;
    $("#money").html('950');
  } else if(index == 1) {
    productIndex = 2;
    productsId = 2;
    $("#money").html('9000');
  } else if(index == 2) {
    productIndex = 3;
    productsId = 3;
    $("#money").html('16000');
  }
  number = 0;
  $(this).addClass('active').siblings().removeClass('active');
});

$("#confirmCount").on('click',function(){
  if($("#confirmInput").val()) {

    orderNo = '';
    clearInterval(time);
    qrcode.clear();
    $(".ways").hide();
    $("#confirm").show();

    number = $("#confirmInput").val()/0.002;
    productsId = 4;
    var next = 0;

    for (var i = 0; i < $("#confirmInput").val().length; i++) {
      if (/(^[0-9]*$)/.test($("#confirmInput").val()[i])) {
        next++;
      }
    }

    if(next == $("#confirmInput").val().length) {
      if($("#confirmInput").val() >= 20) {
        $("#money").html($("#confirmInput").val());
		if($("#confirmInput").val() >= 900) {
			toast('建议您选择更优惠套餐')
		}
      } else {
        toast('充值金额必须大于20元')
      }
    } else {
      toast('请输入整数');
    }
  } else {
    productsId = productIndex;
    if(productIndex == 1) {
      $("#money").html('950');
    } else if(productIndex == 2) {
      $("#money").html('9000');
    } else if(productIndex == 3) {
      $("#money").html('16000');
    }
    // $("#money").html('0');
  }
  // $("#confirmInput").val('');
});


// $("#aliPay").on('click',function(){
//   toast("<p>此功能暂未开放</p><p>敬请期待</p>")
// });



$("#confirm").on('click',function () {



  makeOrder(function(url){
    qrcode.makeCode(url);
    clearInterval(time);
    time = setInterval(function(){
      isPay(function(){
        clearInterval(time);
        window.location.href = './personal-center.html'
      })
    },10000)
  });
});


function makeOrder(callback){
  var money = $("#money").html();
  $.ajax({
    url: url+'/trdorder/alipayrecharge',
    method: 'GET',
    dataType: 'json',
    data: {
      mobile: sessionStorage.getItem('id'),
      token:sessionStorage.getItem('token'),
      creUserId:userId,
      productsId:productsId,
      money:money,
      payType:1,//
      type:1,
      number:number
    }
  }).done(function(res) {
    if(res.resultCode == '000000') {
      $("#confirm").hide();
      $(".ways").show();
      var resObj = JSON.parse(res.resultObj);
      orderNo = resObj.orderNo;
      callback(resObj.payUrl);
    } else {
      toast(res.resultMsg);
    }
  }).fail(function(err) {
    toast('下单失败');
  })
}

function isPay(callback){
  $.ajax({
    url: url+'/trdorder/findOrderInfoByOrderNo',
    method: 'GET',
    dataType: 'json',
    data: {
      mobile: sessionStorage.getItem('id'),
      token:sessionStorage.getItem('token'),
      orderNo:orderNo,
    }
  }).done(function(res) {
    if(res.resultCode == '000000') {
      if(res.resultObj.status == 1){
        callback();
      }
    } else {
      toast(res.resultMsg);
    }
  }).fail(function(err) {
    toast('请求超时');
  })
}

$(".tabs span").on('click',function(){
  $(".tabs span").removeClass('active');
  $(this).addClass('active');
  var index=$(".tabs span").index(this);
  if (index==0) {
    $(".detection").hasClass("df");
    $(".detection").addClass("df");
    
  }else{
    $(".detection").removeClass("df");
  }
  if (index==1) {
    $(".rinse").hasClass("df");
    $(".rinse").addClass("df");
    
  }else{
    $(".rinse").removeClass("df");
  }
  if (index==2) {
    $(".control").hasClass("df");
    $(".control").addClass("df");
    
  }else{
    $(".control").removeClass("df");
  }
});
