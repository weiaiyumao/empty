/**
 * Created by nxy on 2017/9/19.
 */

/* 进入页面检查上次检测是否结束 -> (否)loadingTick/check */
/* 是否登录 -> 是否为空 -> 余额是否足够 */

  var timer1 = null;
  var timer2 = null;
  var timer3 = null;
  var timer4 = null;
  // var timer5 = null;
  var balanceVal = '';
  var fileUrl = localStorage.getItem('url') ? localStorage.getItem('url') : '';
  var runCount = '';
  var num2 = ['3','5','7','8'];
  var uploadUrl = '';
  var progress = parseInt(localStorage.getItem('progress')) ? parseInt(localStorage.getItem('progress')) : 0;//浏览器中如果没有存进度说明检测已经完毕

  var testStatus = false;

  isLogin(function(){
    loginBtnShow();
    getBalance(function(){
      getUserId(function(){
        if(localStorage.getItem('url')){//如果有浏览器中有url的话说明上次检测还未提交
          runIng(function(){

            localStorage.setItem('timetamp','');//检测成功之后把时间戳清空
            localStorage.setItem('url','');//检测成功之后把地址清空
            localStorage.setItem('count','');//检测成功之后把进度清空
            localStorage.setItem('progress','');//检测成功之后把进度清空
            clearTimeout(timer4);
            $("#testing").hide();
          })
        } else {
          localStorage.setItem('timetamp','');//检测成功之后把时间戳清空
          localStorage.setItem('url','');//检测成功之后把地址清空
          localStorage.setItem('count','');//检测成功之后把进度清空
          localStorage.setItem('progress','');//检测成功之后把进度清空
          $("#fileBtn").show();
          $("#notAllow").hide();
        }
      })
    });
  });

  
  /* 上传文件 */
  /* ======================================= */
  function upLoad(callback){
    var token = sessionStorage.getItem('token');
    var tel = sessionStorage.getItem('id');
    var formData = new FormData();
    var name = $("#file").val();
    formData.append("file",$("#file")[0].files[0]);
    formData.append("name",name);
    $.ajax({
      url: url + '/file/upload?mobile=' + tel + '&token=' + token,
      method: 'POST',
      dataType: 'json',
      data: formData,
      processData : false,
      contentType : false,
    }).done(function(res) {
      if(res.resultCode = '000000') {
        fileUrl = res.resultObj.fileUploadUrl;
        localStorage.setItem('count',res.resultObj.txtCount);
        uploadUrl = res.resultObj.fileUploadUrl;
        callback();
      }
    })
  }



  function runIng(callback){

    if(!localStorage.getItem('timetamp')) {
      localStorage.setItem('timetamp',new Date().getTime());
    }
    var timetamp = localStorage.getItem('timetamp')
    $.ajax({
      url: url + '/credit/runTheTest',
      method: 'GET',
      dataType: 'json',
      data: {
        timestamp: timetamp,
        fileUrl: localStorage.getItem('url'),
        mobile: sessionStorage.getItem('id'),
        token: sessionStorage.getItem('token'),
        userId: userId
      }
    }).done(function(res) {
      $("#testBtnDisabled").hide();
      if(res.resultCode == '000000') {
        if(res.resultObj && res.resultObj.status == 2) {
          $("#fileBtn").show();
          $("#notAllow").hide();
          $("#testing").hide();
          $("#testBox").hide();
          $("#mask").hide();
          
          callback();
        } else if(res.resultObj && res.resultObj.status == 1) {
          localStorage.setItem('progress',res.resultObj.runCount);
          progress = parseInt(res.resultObj.runCount);
          isDone();
          $("#fileBtn").hide();
          $("#notAllow").show();
          $("#testing").show();
        } else if(res.resultObj && res.resultObj.status == 3) {
          toast('系统异常')
          $("#fileBtn").show();
          $("#notAllow").hide();
          $("#testing").hide();
          $("#testBox").hide();
          $("#mask").hide();
          $("#test").hide();
          localStorage.setItem('url','');
          localStorage.setItem('count','');
          localStorage.setItem('progress','');

        } else if(res.resultObj && res.resultObj.status == 4) {
          toast('账户余额不足');

          $("#fileBtn").show();
          $("#notAllow").hide();
          $("#testing").hide();
          $("#testBox").hide();
          $("#mask").hide();
          $("#test").hide();
          localStorage.setItem('url','');
          localStorage.setItem('count','');
          localStorage.setItem('progress','');
        }
      } else {
        toast(res.resultMsg);
        $("#testing").hide();
        $("#test").hide();
        $("#fileBtn").show();
        $("#notAllow").hide();
        $("#mask").hide();
        $("#testBox").hide();

        localStorage.setItem('url','');
        localStorage.setItem('count','');
        localStorage.setItem('progress','');
      }
    }).fail(function(err){
      toast('请求超时');
      $("#testing").hide();
      $("#test").hide();
      $("#fileBtn").show();
      $("#notAllow").hide();
      $("#mask").hide();
      $("#testBox").hide();
      $("#testBtnDisabled").hide();
      localStorage.setItem('url','');
      localStorage.setItem('count','');
      localStorage.setItem('progress','');
      // isDone();
      // toast('请稍等')
    })
  }

  /* 上传文件类型必须为txt */
  /* ======================================= */
  function isTxt(path) {
    var str = path.split('.')[1].toLowerCase();
    if(str == 'txt') {
      return true;
    } else {
      return false;
    }
  }

  /* 是否检测完毕 */
  /* ======================================= */
  function isDone() {
    clearTimeout(timer4);
    timer4 = setTimeout(function(){
      runIng(function(){
        clearTimeout(timer4);
        doneTick();
      });
    },15000);
  }

  /* 正在检测时的显示方式 */
  /* ======================================= */
  function loadingTick() {
    $("#loadingBox").show();
    $("#fileLoading").hide();

    $("#allCount").html(localStorage.getItem('count'));
    // $("#numList").addClass("scroll");
    clearInterval(timer2);
    clearInterval(timer3);
    timer3 = setInterval(function(){
      randomPhone(36);
      for(var i = 0;i < 36;i++) {
        $("#numList li:eq("+i+")").remove();
      }
    },576);

    // setInterval(function(){
    //   progress = parseInt(localStorage.getItem('progress')) ? parseInt(localStorage.getItem('progress')) : 0;//浏览器中如果没有存进度说明检测已经完毕
    // },15000);
    timer2 = setInterval(function(){
      progress = parseInt(progress);
      progress+=121;
      
      if(progress>=parseInt(localStorage.getItem('count'))){
        progress = parseInt(localStorage.getItem('count'));
        localStorage.setItem('progress',localStorage.getItem('count'));
        clearInterval(timer2);
        clearInterval(timer3);
        $("#loadingBox").hide();
        $("#fileLoading").show();
        isDone();     
      }
      $("#progress").html(parseInt((progress/parseInt(localStorage.getItem('count')))*100)+'%');
      $("#loadingBox").css({'background-position-y':138 - (progress/parseInt(localStorage.getItem('count')))*138+'px'});
      $("#runCount").html(progress);
    },1400);

    

    $("#mask").show();
    $("#fileBtn").hide();
    $("#notAllow").show();
    $("#testBox").show();
    $("#test").hide();
    $("#testing").show();
  }

  /* 检测完毕时的显示方式 */
  /* ======================================= */
  function doneTick() {

    // $("#notice").hide();
    $("#doneBox .p2 .cost").html(localStorage.getItem('count'));
    $("#doneBox .p3 .last").html(parseInt(localStorage.getItem('balance')) - parseInt(localStorage.getItem('count')));

    localStorage.setItem('timetamp','');//检测成功之后把时间戳清空
    localStorage.setItem('url','');//检测成功之后把地址清空
    localStorage.setItem('count','');//检测成功之后把进度清空
    localStorage.setItem('progress','');//检测成功之后把进度清空
    $("#mask").show();
    $("#doneBox").show();
    $("#fileBtn").show();
    $("#notAllow").hide();
    $("#testBox").hide();
    $("#test").hide();
    $("#testing").hide();
    var second = 10;

    clearInterval(timer1);
    timer1 = setInterval(function() {
      second -- ;
      $("#second").html(second);
      if(second <= 0) {
        clearInterval(timer1);

        window.location.href = './result.html';
      }
    },1000);
  }


  /* 检查进度 */
  /* ======================================= */
  function check(){
    // clearInterval(timer5);
    // timer5 = setInterval(function(){
    //   runIng();
    // },15000);
  }

  /* 随机生成72个号码 */
  /* ======================================= */

  randomPhone(72);
  function randomPhone (num) {
    var html = '';
    for(var i = 0;i < num;i++) {
      var status = Math.random();
      if(status > 0 && status < 0.01 ) {
        html += '<li class="red">'+randomOneNum()+'<span>X</span></li>';
      } else if(status >= 0.01 && status < 0.03) {
        html += '<li class="yellow">'+randomOneNum()+'<span>?</span></li>';
      } else {
        html += '<li class="green">'+randomOneNum()+'<span>√</span></li>';
      }
    }

    $("#numList").append(html);
  }
  /* 随机生成1个号码 */
  /* ======================================= */
  function randomOneNum(){
    var oTel = '1';
    var random = Math.random();
    if(random >= 0.1 && random < 0.2) {
      oTel+='5';
    } else if(random >= 0.05 && random < 0.1) {
      oTel+='8';
    } else if(random >= 0 && random < 0.05) {
      oTel+='7';
    } else {
      oTel+='3';
    }
    // oTel+=randomNum();
    oTel+='*****';
    for(var i = 0; i < 4; i++) {
      oTel+=randomNum();
    }
    return oTel;
  }

  /* 随机生成1个数字 */
  /* ======================================= */
  function randomNum(){
    return Math.floor(Math.random()*10)
  }

  /* 触发事件 */
  /* ======================================= */

  function clickFile(){
    $("#file").click();
  }
  //浏览文件
  $("#fileBtn").on('click',function() {
    if(parseInt(localStorage.getItem('balance')) > 0) { //先判断余额是不是大于0
      if(sessionStorage.getItem('id')) {//判断用户是否登录
        $("#file").click();
      } else {
        loginHide();
      }
    } else {
      toast('账户余额不足')
    }
  });

  //file文件改变
  $("#file").on('change',function() {
    if($("#file").val()) {//上传的文件是否为空
      if(isTxt($("#file").val())) {//上传的文件是否为txt格式
        // var fileSystem = new ActiveXObject("Scripting.FileSystemObject");
        // var fileaaa = fileSystem.GetFile ($("#file").val());
        var fileSize = $("#file")[0].files[0].size;
        if(fileSize/1024/1024 < 10) {//文件大小不能大于10mb
          $("#fileName").html($("#file").val());
          localStorage.setItem('timetamp',new Date().getTime());

          upLoad(function(){
            $("#test").show();
          });
        } else {
          toast('文件大小不能超过10MB');
        }    
      } else {
        toast('请上传TXT格式文件');
      }
    } else {
      $("#fileName").html('请上传文件进行检测');
      $("#test").hide();
    }
  });

  //开始检测
  $("#test").on('click',function() {
    $(this).hide();
    $("#testBtnDisabled").show();
    loadingTick();
    testStatus = true;
    localStorage.setItem('url',uploadUrl);
    runIng(function(){
      doneTick()
    });
  });

  //关闭检测弹框
  $("#testBox span.close").on('click',function() {
    $("#mask").hide();
    $("#testBox").hide();
    // $("#notice").show();
    $("#phone").html(sessionStorage.getItem('id'));
  });

  //
  $("#testing").on('click',function() {
    testStatus = true;

    // if(testStatus) {
    loadingTick();
    // } else {
    //   toast('正在检测中，请稍等');
    // }
  });





  $("#confirmModify").on('click',function() {
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
            testStatus = false;
            runIng(function () {});
            toast('提交成功');
            mailVal = res.resultObj.userEmail;
            closeMailBox();
          } else {
            toast(res.resultMsg)
          }
        }).fail(function(err){
          toast('请检查网络');
          $("#confirmModify").show();
          $("#modifyDisabledBtn").hide();
        })
      })
    } else {
      $("#warningNull").show();
    }
  });


