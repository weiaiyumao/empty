/**
 * Created by nxy on 2017/9/20.
 */
//
// var url = 'http://172.16.4.218:8765';
// var downUrl = 'http://172.16.4.218/';
var url = 'https://kh_bd.253.com/';
var downUrl = 'https://kh_bd.253.com/';
// var url = 'http://172.16.3.237:8765';
// var downUrl = 'http://172.16.3.237/';

var token,tel;
var timer;
var userId = '';
var mailVal = '';



$('body').append('<div id="loginBox">' +
'<p>一键登录</p>' +
'<input id="account" placeholder="请输入账号(手机号码)" type="text"/>' +
'<span id="warningTel" class="red">手机格式不正确</span>' +
'<div class="code-wrapper cf">' +
  '<input id="code" class="fl" placeholder="请输入验证码" type="text"/>' +
  '<div id="getCode" class="fr">获取验证码</div>' +
  '<div id="codeBtn" class="fr"><span>60</span>S</div>' +
'<span id="warningCode" class="red">验证码不能为空</span>' +
'<span id="wrongCode" class="red">验证码错误</span>' +
'</div>' +
'<div id="loginBtn">登录</div>' +
'<div class="login-disabled-btn loading-btn">登录</div>' +
'<span class="closeLogin"></span>' +
'</div>');

$('body').append('<div id="tipBox">' +
'</div>');

$('body').ajaxError(function(){
toast('请稍后再试');
});


// if(sessionStorage.getItem('id')) {
//   isLogin(function(){
//     loginBtnShow();
//     getUserId();
//   })
// } else {
//   loginBtnHide();
// }

// 客服
$("#kf,.kfqq").on('click',function(){
  ud.init();
  ud.showPanel();
});





/* 登录弹窗 */
/* ======================================= */
function loginShow(){
  $("#rechargeBtn").show();
  $(".personal-center").show();
  $("#login").hide();
  $("#mask").hide();
  $("#loginBox").hide();
}
function loginHide(){
  $("#rechargeBtn").hide();
  $(".personal-center").hide();
  $("#login").show();
  $("#mask").stop().fadeIn();
  $("#loginBox").stop().fadeIn();
}
function loginBtnShow(){
  $("#rechargeBtn").show();
  $(".personal-center").show();
  $("#login").hide();
}
function loginBtnHide(){
  $("#rechargeBtn").hide();
  $(".personal-center").hide();
  $("#login").show();
}
//关闭修改邮箱弹框
function closeMailBox(){
  $("#warningMail").hide();
  $("#warningNull").hide();
  $("#mask").hide();
  $(".notice-box").hide();
  $("#mail").html(mailVal?mailVal:'(接收通知的邮箱为空)');
}



/* 查询登录状态 */
/* ======================================= */
function isLogin(callback) {
  $.ajax({
    url: url+'/login/isLogout',
    method: 'GET',
    dataType: 'json',
    data: {
      mobile: sessionStorage.getItem('id'),
      token: sessionStorage.getItem('token')
    }
  }).done(function(res) {
    if(res.resultObj) {
      loginBtnShow();
      callback();
    } else {
      toast('还未登录');
      sessionStorage.setItem('id','');
      sessionStorage.setItem('token','');
      loginBtnHide();

    }
  }).fail(function(err){
    sessionStorage.setItem('id','');
    sessionStorage.setItem('token','');
    loginBtnHide();
  });
}


/* 登录 */
/* ======================================= */
function login(tel,code,callback) {
  $.ajax({
    url: url+'/login/userLogin',
    method: 'GET',
    dataType: 'json',
    data: {
      mobile: tel,
      code:code
    }
  }).done(function(res) {
    if(res.resultCode == '000000') {
      sessionStorage.setItem('token',res.resultObj.token);
      sessionStorage.setItem('id',tel);
      toast('登录成功');
      loginShow();
      callback();
    } else {
      $("#loginBtn").show();
      $(".login-disabled-btn").hide();
      toast(res.resultMsg);
      // loginOut();
    }
  }).fail(function(err) {
    toast('稍后再试');
    $("#loginBtn").show();
    $(".login-disabled-btn").hide();
    // loginOut();
  })
}


/* 用户id */
/* ======================================= */
function getUserId(callback){
  $.ajax({
    url: url+'/user/findbyMobile',
    method: 'GET',
    dataType: 'json',
    data: {
      mobile: sessionStorage.getItem('id'),
      token: sessionStorage.getItem('token')
    }
  }).done(function(res) {
    if(res.resultCode == '000000') {
      userId = res.resultObj.id;
      callback();
    } else {
      // toast(res.resultMsg);
    }
  }).fail(function(err){
    toast('请求超时');
  })
}

/* 登出 */
/* ======================================= */
function loginOut() {
  $.ajax({
    url: url+'/login/logout',
    method: 'GET',
    dataType: 'json',
    data: {
      mobile: sessionStorage.getItem('id'),
      token:sessionStorage.getItem('token')
    }
  }).done(function(res) {
    if(res.resultCode == '000000') {
      sessionStorage.setItem('id','');
      sessionStorage.setItem('token','');
      location.reload();
    } else {
      toast('请求超时');
    }
  }).fail(function(err) {
    toast('请求超时');
  });
}

/* 获取余额 */
/* ======================================= */
function getBalance(callback){
  $.ajax({
    url:url+'/userAccount/findbyMobile',
    method: 'GET',
    dataType: 'json',
    data:{
      mobile: sessionStorage.getItem('id'),
      token: sessionStorage.getItem('token')
    }
  }).done(function(res){
    if(res.resultCode == '000000') {
      if(res.resultObj) {
        localStorage.setItem('balance',res.resultObj.account);
      } else {
        localStorage.setItem('balance','0');
      }
      callback();
    } else {
      toast(res.resultMsg);
      $("#balance").html('0');
    }
  }).fail(function(err){
    toast('请求超时');
    $("#balance").html('0');
  })
}


//倒计时中断
function secondDone(){
  $("#getCode").show();
  $("#codeBtn").hide();
  $("#codeBtn span").html('60');
}

/* 获取验证码 */
/* ======================================= */
function getCode(tel) {
  $.ajax({
    url: url+'/login/sendSms',
    method: 'GET',
    dataType: 'json',
    data: {
      mobile: tel
    }
  }).done(function(res) {
    if(res.resultCode = '000000') {

    } else {
      secondDone();
    }
  }).fail(function(err) {
    secondDone();
  })
}

/* 验证手机格式 */
/* ======================================= */
function phoneIsMatch(tel,callback){
  var telReg = /^13[0-9]{9}$|14[0-9]{9}$|15[0-9]{9}$|16[0-9]{9}$|17[0-9]{9}$|18[0-9]{9}$|19[0-9]{9}$/;
  if(tel.match(telReg)) {
    $("#warningTel").stop().fadeOut();
    callback();
  } else {
    $("#warningTel").stop().fadeIn();
  }
}

/* 验证邮箱格式 */
/* ======================================= */
function mailIsMatch(mail,callback){
  var mailReg = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
  if(mail.match(mailReg)){
    $("#warningMail").hide();
    callback();
  } else {
    $("#confirmModify").show();
    $("#modifyDisabledBtn").hide();
    $("#warningMail").show();
  }
}
/* 验证邮箱格式 */
/* ======================================= */

function timeToDate(time){
  var date = new Date(time);

  var year = date.getFullYear();
  var month = date.getMonth()+1;
  var date = date.getDate();

  var hour = (new Date(time)).getHours();

  var minute = (new Date(time)).getMinutes();
  var second = (new Date(time)).getSeconds();
  return (year+'-'+month+'-'+date+' '+hour+':'+minute+':'+second);
}

/* 显示提示框 */
/* ======================================= */
function toast(val) {
  $("#tipBox").html(val);
  $("#tipBox").stop().fadeIn();
  setTimeout(function(){
    $("#tipBox").stop().fadeOut();
  },2000)
}





  //打开登录框
  $("#login").on('click',function(){
    loginHide();
  });

  // 关闭登录框
  $(".closeLogin").on('click',function() {
    $("#account").val('');
    $("#code").val('');
    $("#warningTel").hide();
    $("#warningCode").hide();
    $("#wrongCode").hide();
    $("#loginBtn").show();
    $(".login-disabled-btn").hide();
    $("#mask").stop().fadeOut();
    $("#loginBox").stop().fadeOut();
  });

  // 获取验证码
  $("#getCode").on('click',function(){
    clearInterval(timer);
    let tel = $("#account").val();
    phoneIsMatch(tel,function(){
      $("#getCode").hide();
      $("#codeBtn").show();

      getCode(tel);

      var second = 60;
      timer = setInterval(function(){
        second -- ;
        $("#codeBtn span").html(second);
        if(second <= 0) {
          clearInterval(timer);
          secondDone();
        }
      },1000)
    })
  });

  // 登录
  $("#loginBtn").on('click',function() {
    var tel = $("#account").val();
    var code = $("#code").val();

    phoneIsMatch(tel,function(){
      if(code) {
        $("#loginBtn").hide();
        $(".login-disabled-btn").show();
        $("#warningCode").hide();
        login(tel,code,function(){
          location.reload();
        });
      } else {
        $("#warningCode").stop().fadeIn();
      }
    });
  });

  // 登出
  $("#loginOut").on('click',function(){
    loginOut();
  });




// window.onload = function() {

  


// };