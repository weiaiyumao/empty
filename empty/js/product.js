/**
 * Created by nxy on 2017/9/20.
 */


  isLogin(function(){});

  $("#toApi").on('click',function(){
    if(sessionStorage.getItem('id')) {
      isLogin(function(){
        window.location.href = './api.html';
      });
    } else {
      loginHide();
    }
  });
  $("#toSheep").on('click',function(){
    if(sessionStorage.getItem('id')) {
      isLogin(function(){
        toast('功能还未开放');
      });
    } else {
      loginHide();
    }
  });