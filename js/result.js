/**
 * Created by nxy on 2017/9/21.
 */

var timer = null;
var bannerIndex = 0;

isLogin(function(){})
getUserId(function(){
  getHistory();

})
function getHistory(){
  $.ajax({
    url: url+'/credit/findByUserId',
    method: 'GET',
    dataType: 'json',
    data: {
      userId:userId,
      mobile: sessionStorage.getItem('id'),
      token: sessionStorage.getItem('token')
    }
  }).done(function(res) {
    $("#threePackage").html('0');    
    $("#sixPackage").html('0');
    $("#threePackageMb").html('0');
    $("#sixPackageMb").html('0');
    $("#nullPackage").html('0');
    $("#nullPackageMb").html('0');
    $("#downThree").on('click',function(){
      if(res.resultCode == '000000') {
        // window.location.href = downUrl + res.resultObj[0].thereFilePath;
        if(res.resultObj.length>0) {
          window.location.href = downUrl + res.resultObj[res.resultObj.length-1].thereFilePath;
        } else {
          toast('实号包不存在，所以无法下载')
        }
      } else {
        toast(res.resultMsg)
      }
    });
    $("#downSix").on('click',function(){
      if(res.resultCode == '000000') {
        // window.location.href = downUrl + res.resultObj[0].sixFilePath;
        if(res.resultObj.length>0) {
          window.location.href = downUrl + res.resultObj[res.resultObj.length-1].sixFilePath;
        } else {
          toast('空号包不存在，所以无法下载')
        }
      } else {
        toast(res.resultMsg)
      }
    });
    $("#downNull").on('click',function(){
      if(res.resultCode == '000000') {
        // window.location.href = downUrl + res.resultObj[0].unknownFilePath;
        if(res.resultObj.length>0) {
          window.location.href = downUrl + res.resultObj[res.resultObj.length-1].unknownFilePath;
        } else {
          toast('暂无数据')
        }
      } else {
        toast(res.resultMsg)
      }
    });
    $("#downAll").on('click',function(){
      if(res.resultCode == '000000') {
        // window.location.href = downUrl + res.resultObj[0].zipPath;
        if(res.resultObj.length>0) {
          window.location.href = downUrl + res.resultObj[res.resultObj.length-1].zipPath;
        } else {
          toast('暂无数据')
        }
      } else {
        toast(res.resultMsg)
      }
    });

    if(res.resultCode == '000000') {
      //res.resultObj.length-1
      // $("#threePackage").html(res.resultObj[0].thereCount?res.resultObj[0].thereCount:'0');
      // $("#sixPackage").html(res.resultObj[0].sixCount?res.resultObj[0].sixCount:'0');
      // $("#nullPackage").html(res.resultObj[0].unknownSize?res.resultObj[0].unknownSize:'0');
      // $("#threePackageMb").html(res.resultObj[0].thereFileSize?res.resultObj[0].thereFileSize:'0M');
      // $("#sixPackageMb").html(res.resultObj[0].sixFileSize?res.resultObj[0].sixFileSize:'0M');
      // $("#nullPackageMb").html(res.resultObj[0].unknownFileSize?res.resultObj[0].unknownFileSize:'0M');


      var html = '';
      $("#history").html('');
      if(res.resultObj.length > 0) {

        $("#threePackage").html(res.resultObj[res.resultObj.length-1].thereCount?res.resultObj[res.resultObj.length-1].thereCount:'0');
        $("#sixPackage").html(res.resultObj[res.resultObj.length-1].sixCount?res.resultObj[res.resultObj.length-1].sixCount:'0');
        $("#nullPackage").html(res.resultObj[res.resultObj.length-1].unknownSize?res.resultObj[res.resultObj.length-1].unknownSize:'0');
        $("#threePackageMb").html(res.resultObj[res.resultObj.length-1].thereFileSize?res.resultObj[res.resultObj.length-1].thereFileSize:'0M');
        $("#sixPackageMb").html(res.resultObj[res.resultObj.length-1].sixFileSize?res.resultObj[res.resultObj.length-1].sixFileSize:'0M');
        $("#nullPackageMb").html(res.resultObj[res.resultObj.length-1].unknownFileSize?res.resultObj[res.resultObj.length-1].unknownFileSize:'0M');

        $("#noData").hide();

        for(var i = (res.resultObj.length -1);i >= 0;i--) {
          html+= '<li class="cf" data-id="'+res.resultObj[i].id+'">'+
                    '<p class="col1">'+
                        '<input class="singleCheck" type="checkbox" data-id="'+res.resultObj[i].id+'">'+
                    '</p>'+
                    '<p class="col2">'+res.resultObj[i].zipName+'</p>'+
                    '<p class="col3">'+res.resultObj[i].zipSize+'</p>'+
                    '<p class="col4">'+timeToDate(res.resultObj[i].createTime)+'</p>'+
                    '<p class="col5"><span class="down" data-path="'+res.resultObj[i].zipPath+'">下载</span><span class="del" data-id="'+res.resultObj[i].id+'">删除</span></p>'+
                  '</li>'
        }
        // for(var i = 0;i < res.resultObj.length ;i++) {
        //   html+= '<li class="cf" data-id="'+res.resultObj[i].id+'">'+
        //             '<p class="col1">'+
        //                 '<input class="singleCheck" type="checkbox" data-id="'+res.resultObj[i].id+'">'+
        //             '</p>'+
        //             '<p class="col2">'+res.resultObj[i].zipName+'</p>'+
        //             '<p class="col3">'+res.resultObj[i].zipSize+'</p>'+
        //             '<p class="col4">'+timeToDate(res.resultObj[i].createTime)+'</p>'+
        //             '<p class="col5"><span class="down" data-path="'+res.resultObj[i].zipPath+'">下载</span><span class="del" data-id="'+res.resultObj[i].id+'">删除</span></p>'+
        //           '</li>'
        // }
        $("#history").html(html);

        $(".down").on('click',function(){
          window.location.href= downUrl + $(this).attr('data-path');
        });

        $(".del").on('click',function(){
          delHistory($(this).attr('data-id'))
        })

        $(".singleCheck").on('change',function(){
          if($(".singleCheck:checked").length == $(".singleCheck").length) {
            $("#checkAll").prop('checked',true);
          } else {
            $("#checkAll").prop('checked',false);
          }
        });
      } else {
        $("#noData").show();
      }
    } else {
      $("#noData").show();
    }
  }).fail(function(err){
    $("#noData").show();
  })
}

/* 删除记录 */
/* ======================================= */
function delHistory(ids){
  $.ajax({
    url: url+'/credit/deleteCvsByIds',
    method: 'GET',
    dataType: 'json',
    data: {
      ids:ids,
      userId:userId,
      mobile: sessionStorage.getItem('id'),
      token: sessionStorage.getItem('token')
    }
  }).done(function(res) {
    if(res.resultCode == '000000') {
      toast('删除成功')
      location.reload();
    } else {
      toast(res.resultMsg)
    }
  })
}


$("#checkAll").change(function() {
  if($(this).prop('checked')){
    $(".singleCheck").each(function(index,val){
      $(val).prop('checked',true);
    });
  } else {
    $(".singleCheck").each(function(index,val){
      $(val).prop('checked',false);
    });
  }
});


$("#deleteAll").on('click',function(){
  var ids= ' ';
  $(".singleCheck").each(function (index,val) {
     if($(val).prop('checked')) {
        ids+= $(val).attr('data-id') + ',';
      }
  });
  if (ids) {
    delHistory(ids);
  }else{
    toast('请至少选择一条数据')
  };
  // if($("#checkAll").prop('checked')) {

  //   var ids = '';

  //   $(".singleCheck").each(function(index,val){
  //     if($(val).prop('checked')) {
  //       ids+= $(val).attr('data-id') + ',';
  //     }
  //   });
  //   delHistory(ids);
  // } else {
  //   toast('请至少选择一条数据')
  // }
});


// 轮播图
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

// $("#downAll").on('click',function(){
//   if($("#checkAll").prop('checked')) {
//     $(".singleCheck").each(function (index, val) {
//       if($(val).prop('checked')) {
//         ids+= $(val).attr('data-id') + ',';
//       }
//     });
//   } else {
//     toast('请至少选择一条数据')
//   }
// })
    $("#downThree").on('click',function(){
      console.log($("#threePackage").html());
      if($("#threePackage").html()==0) {
          toast('实号包不存在，所以无法下载');
      }
    });
    $("#downSix").on('click',function(){
      console.log($("#sixPackage").html());
      if($("#sixPackage").html()==0) {
          toast('空号包不存在，所以无法下载');
      }
    });
