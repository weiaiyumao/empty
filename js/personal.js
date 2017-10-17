/**
 * Created by nxy on 2017/9/19.
 */

isLogin(function(){
  getUser(function(){
    getOrder();
  });
});
getBalance(function(){
  $("#balance").html(localStorage.getItem('balance')?localStorage.getItem('balance'):'0');
});

$("#modify").on('click',function() {
  isLogin(function(){
    $("#confirmModify").show();
    $("#modifyDisabledBtn").hide();
    $("#mask").show();
    $(".notice-box").show();
  })
});


/* 获取账户信息 */
/* ======================================= */
function getUser(callback) {
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
      if(res.resultObj.userName) {
        $('#info').html(res.resultObj.userName + '+' + res.resultObj.userPhone);
      } else {
        $('#info').html(res.resultObj.userPhone);
      }
      $("#tel").html(res.resultObj.userPhone);
      $("#phone").html(res.resultObj.userPhone);
      $("#mail").html(res.resultObj.userEmail ? res.resultObj.userEmail : '(接收通知的邮箱为空)');
	  userId = res.resultObj.id;
      callback();
    }
  })
}


/* 查询订单 */
/* ======================================= */
function getOrder() {
  var type = '';
  var status = '';
  var payType = '';
  $.ajax({
    url: url+'/userAccount/findTrdOrderByCreUserId',
    method: 'GET',
    dataType: 'json',
    data: {
      creUserId:userId,
      mobile: sessionStorage.getItem('id'),
      token: sessionStorage.getItem('token')
    }
  }).done(function(res) {
    if(res.resultCode == '000000') {
      if(res.resultObj.length > 0 ) {
        $("#noData").hide();
        var html = '';
        for(var i = 0;i < res.resultObj.length;i++){
          if(res.resultObj[i].type == 1) {
            type = '<li class="col3">充值</li>'
          } else if(res.resultObj[i].type == 2) {
            type = '<li class="col3">退款</li>'
          }

          if(res.resultObj[i].status == 0) {
            status ='<li class="col4">待处理</li>'
          } else if(res.resultObj[i].status == 1) {
            status = '<li class="col4">成功</li>'
          } else if(res.resultObj[i].status == 2) {
            status = '<li class="col4">失败</li>'
          }

          if(res.resultObj[i].payType == 1) {
            payType = '<li class="col6">支付宝</li>'
          } else if(res.resultObj[i].payType == 2) {
            payType = '<li class="col6">银联</li>'
          } else if(res.resultObj[i].payType == 3) {
            payType = '<li class="col6">创蓝充值</li>'
          } 

          html +=  '<ul class="table-row cf">'+
                      '<li class="col1">'+res.resultObj[i].orderNo+'</li>'+
                      '<li class="col2">'+res.resultObj[i].money+'</li>'+type+status+
                      '<li class="col5">'+timeToDate(res.resultObj[i].payTime)+'</li>'+payType+
                    '</ul>';
        }
        $("#tableWrapper").html(html);
      } else {
        $("#noData").show();
      }
      
    } else {
      $("#noData").show();
    }
  }).fail(function(err){
    $("#noData").show();
  });
}

// 修改邮箱
$("#confirmModify").on('click',function() {
  isLogin(function(){
    var mail = $("#email").val();
    if(mail) {
      $("#confirmModify").hide();
      $("#modifyDisabledBtn").show();
      $("#warningNull").hide();
      mailIsMatch(mail,function(){
  
        /* 修改通知方式 */
        /* ======================================= */
        $.ajax({
          url: url+'/user/updateCreUser',
          method: 'GET',
          dataType: 'json',
          data: {
            id:userId,
            userPhone: sessionStorage.getItem('id'),
            userEmail: $("#email").val(),
            token: sessionStorage.getItem('token')
          }
        }).done(function(res) {
          $("#confirmModify").show();
          $("#modifyDisabledBtn").hide();
          if(res.resultCode == '000000') {
            mailVal = res.resultObj.userEmail;
            closeMailBox();
          } else {
            toast(res.resultMsg)
          }
        }).fail(function(err){
          $("#confirmModify").show();
          $("#modifyDisabledBtn").hide();
        })
      })
    } else {
      $("#warningNull").show();
    }
  });
  
});

$("#cancleModify,.close").on('click',function() {
  closeMailBox();
});
