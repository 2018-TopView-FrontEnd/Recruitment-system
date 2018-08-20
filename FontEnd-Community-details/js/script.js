//go back to the top
$('#back').click(function () {
  $('html,body').animate({
    scrollTop: 0
  }, 800);
});

//upload photo
var initCropperInModal = function(img, input, modal){
  var $image = img;
  var $inputImage = input;
  var $modal = modal;
  var options = {
    aspectRatio: 1, // 横纵比
    viewMode: 2,
    preview: '.img-preview' // 预览图的class名
  };
  // 模态框隐藏后需要保存的数据对象
  var saveData = {};
  var URL = window.URL || window.webkitURL;
  var blobURL;
  $modal.on('show.bs.modal',function () {
    // 如果打开模态框时没有选择文件就点击“打开图片”按钮
    if(!$inputImage.val()){
      $inputImage.click();
    }
  }).on('shown.bs.modal', function () {
    // 重新创建
    $image.cropper( $.extend(options, {
      ready: function () {
        // 当剪切界面就绪后，恢复数据
        if(saveData.canvasData){
          $image.cropper('setCanvasData', saveData.canvasData);
          $image.cropper('setCropBoxData', saveData.cropBoxData);
        }
      }
    }));
  }).on('hidden.bs.modal', function () {
    // 保存相关数据
    saveData.cropBoxData = $image.cropper('getCropBoxData');
    saveData.canvasData = $image.cropper('getCanvasData');
    // 销毁并将图片保存在img标签
    $image.cropper('destroy').attr('src',blobURL);
  });
  if (URL) {
    $inputImage.change(function() {
      var files = this.files;
      var file;
      if (!$image.data('cropper')) {
        return;
      }
      if (files && files.length) {
        file = files[0];
        if (/^image\/\w+$/.test(file.type)) {

          if(blobURL) {
            URL.revokeObjectURL(blobURL);
          }
          blobURL = URL.createObjectURL(file);

          // 重置cropper，将图像替换
          $image.cropper('reset').cropper('replace', blobURL);

          // 选择文件后，显示和隐藏相关内容
          $('.img-container').removeClass('hidden');
          $('.img-preview-box').removeClass('hidden');
          $('#changeModal .disabled').removeAttr('disabled').removeClass('disabled');
          $('#changeModal .tip-info').addClass('hidden');

        } else {
          window.alert('请选择一个图像文件！');
        }
      }
    });
  } else {
    $inputImage.prop('disabled', true).addClass('disabled');
  }
}
//对接

//将base64转换为文件
function dataURLtoFile(dataurl) {
  var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
    bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
  while(n--){
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new File([u8arr],{type:mime});
}

var sendPhoto = function () {
  // 得到PNG格式的dataURL
  var photo = $('#photo').cropper('getCroppedCanvas', {
    width: 270,
    height: 220
  }).toDataURL('image/png');

  console.log(dataURLtoFile(photo));

  //图片上传
  var xhr;
  //上传文件方法
  function UpladFile() {
    var url =  "http://10.21.23.165:8080/department/saveDepartment"; // 接收上传文件的后台地址
    var form = new FormData(); // FormData 对象
    form.append("file", dataURLtoFile(photo)); // 文件对象
    form.append("organizationId", 1); // 文件对象
    form.append("name", $('#departmentName').html()); // 文件对象
    form.append("introduction", $('.departement2-content').html()); // 文件对象

    xhr = new XMLHttpRequest();  // XMLHttpRequest 对象
    xhr.open("post", url, true); //post方式，url为服务器请求地址，true 该参数规定请求是否异步处理。
    xhr.onload = uploadComplete; //请求完成
    xhr.onerror =  uploadFailed; //请求失败
    xhr.send(form); //开始上传，发送form数据
  }

  //上传成功响应
  function uploadComplete(evt) {
    //服务断接收完文件返回的结果
    var data = JSON.parse(evt.target.responseText);
    if(data.success) {
      alert("上传成功！");
      newUplodFile();
    }else{
      alert("上传失败！");
    }
  }
  //上传失败
  function uploadFailed() {
    alert("上传失败！");
  }
  UpladFile();
}

//从后台接收部门信息和图片显示过来
function newUplodFile() {
  var url = "http://10.21.23.165:8080/department/findById";
  $.ajax({
    type:'post',
    url:url,
    data: {
      id: 118
    },
    //显示上传成功响应
    success:function (result) {
      $('.departement2-content').html(result.data.introduction);
      $('#departmentName').html(result.data.name);
      $('#user-photo').attr('src', 'http://10.21.23.165:8080/' + result.data.logoUrl);
      $('#changeModal').hide();
      $('.modal-backdrop').hide();
    }
  })
}

$(function(){
  initCropperInModal($('#photo'),$('#photoInput'),$('#changeModal'));
});



//---------------------------------------------------------------------------------
//接口2：获取同一社团的所有部门
function getDepartementsData() {
  var url = "http://10.21.23.112:8080/department/getOrganizationDepartment";
  $.ajax({
    type:'post',
    url:url,
    data: {
      organizationId: 1
    },
    //显示上传成功响应
    success:function (result) {
      var departementArr = result.data;
      for(var i = 0; i < departementArr.length; i++){
        $('.selectDepartments').append("<li>" + departementArr[i].name + "</li>");
      }
    }
  })
}

//接口三：部门搜索特定人员

function searchStu() {
  var url = "接口";
  var pattern = /^[0-9]+$/,searchType;
  if(pattern.test($('.search-input').val())){
    searchType = 'stuId';
  }else{
    searchType = 'name';
  }
  $.ajax({
    type:'post',
    url:url,
    data: {
      searchType: searchType,
      searchValue: $('.search-input').val().trim(),
    },
    success: function (result) {
      //xx函数(result.blabla),从后台取得页数，利用锋哥的函数跳转到对应页
      //取得所在页面的13条数据的数组，由后台给的行数得到blabla[i]
      //blabla[i].css('background','red')
    }
  })
}
//---------------------------------------------------------
window.onload =function () {
  getDepartementsData();
  newUplodFile();
  //searchStu();
}
