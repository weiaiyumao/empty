/**
 * Created by nxy on 2017/9/20.
 */


isLogin(function(){});

$(".tabs li").on('click',function(){
  $(".tabs li").removeClass('active');
  $(this).addClass('active');
  var index=$(".tabs li").index(this);
  console.log(index);
  if (index==0) {
    $(".active1").hasClass("detection");
    $(".active1").addClass("detection");
    
  }else{
    $(".active1").removeClass("detection");
  }
  if (index==1) {
    $(".active2").hasClass("detection");
    $(".active2").addClass("detection");
    
  }else{
    $(".active2").removeClass("detection");
  }
  if (index==2) {
    $(".active3").hasClass("detection");
    $(".active3").addClass("detection");
    
  }else{
    $(".active3").removeClass("detection");
  }
  if (index==3) {
    $(".active4").hasClass("detection");
    $(".active4").addClass("detection");
    
  }else{
    $(".active4").removeClass("detection");
  }
});


//开关按钮
$(".switch1").on('click',function(){
  if($(".switch1").attr('data-status') == 1) {
    $('.switch1').attr('data-status','2');
    $(".push-btn").stop().animate({left:'31px'});
    $(".switch1").css({"background-color":'#6b6c6c'});
    $(".reception").attr({"disabled":''});
  } else {
    $('.switch1').attr('data-status','1')
    $(".push-btn").stop().animate({left:'1px'});
    $(".switch1").css({"background-color":'#689cfc'});
    $(".reception").removeAttr("disabled");
  }
})


// 轮播图
// 
bannerIndex = 0;
$(".nav-wrapper li").on('click',function(){
  bannerIndex = $(this).index();
  tick();
});

timeTick();
function timeTick(){
  timer = setInterval(function(){
    bannerIndex++;
    if(bannerIndex > 3) {
      bannerIndex = 0
    }
    tick();
  },8000);
}

function tick() {
  $(".nav-wrapper li").removeClass('active');
  $(".swiper-wrapper").animate({'left':'-' + bannerIndex*1200 + 'px'});
  $(".nav-wrapper li").eq(bannerIndex).addClass('active');
}