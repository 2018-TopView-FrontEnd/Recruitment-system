var idName = "#searchInterviewLiPage"
function list() {
  $("ul").each(
    function () {
      $(this).slideUp(0);
  });
  $("aside").on("click",".list",
    function () {
      $(this.nextElementSibling).slideToggle();
    });
  $("aside").on("click","li",
    function () {
      let name = "#"+this.id+"Page";
      $(idName).prop("style","display:none;");
      $(name).prop("style","display:block");
      idName = name;
    })
}

function searchInterview1() {
  var times;
  $.ajax({
    type:"post",
    url:"http://10.21.23.112:8080/department/getOrganizationDepartment",
    data:{
      organizationId:1
    },
    success:function (result) {
      let val = "<option>请选择你需要查询的部门</option>";
      for (let i = 0;i < result.data.length;i++) {
        val = val + "<option value = "+result.data[i].id+">"+result.data[i].name+"</option>"
      }
      $("#searchName").html(val);
      document.getElementById("searchName").onchange = function () {
          $.ajax({
            type:"post",
            url:"http://10.21.23.112:8080/department/stage/listAllStageByDepartmentId",
            data:{
              departmentId:12,//$(this).val(),
            },
            success:function (result) {
              let val = "<option>请选择你需要查询的面试轮次</option>";
              for (let i = 0;i < result.data.length;i++) {
                val = val + "<option value = "+result.data[i].id+">"+result.data[i].stageName+"</option>";
              }
              $("#searchTimeName").html(val).prop("style","display:inline-block;");
              document.getElementById("searchTimeName").onchange = function () {
                times = $(this).val()
                if (times != "请选择你需要查询的面试轮次") {
                  $("#searchButton").prop("style","");
                  $("#searchStatus").prop("style","");
                } else {
                  $("#searchButton").prop("style","display:none");
                  $("#searchStatus").prop("style","display:none");
                }
              }
              $("#searchButton").on("click",
                function () {
                  $(".status").text($("#searchStatus").find("option:selected").text());
                  $("#nameAndTime").text($("#searchName").find("option:selected").text()+""+$("#searchTimeName").find("option:selected").text());

                  interviewInformation(times,1,$("#searchStatus").val());
                })
              }
          })
        }
    }
  })
}

function interviewInformation(department,stage,status) {
    $.ajax({
      type:"GET",
      url:"http://192.168.1.131:8080/application/get",
      
      data:{
        "pageNum":/*stage*/0,
        "pageSize":13,
        "status":/*status*/1,
        "stageId":/*department*/3
      },
      success:function (result) {
        $(".searchInterviewPage").text(result.pageNum);
        var val = "";
        var gender1 = "";

        for (let i = 0;i < result.data.list.length;i++) {

          var message = result.data.list[i];

          if (message.gender == 0) {
            gender1 = "男";
          } else if (message.gender == 1) {
            gender1 = "女";
          }

          val = val + ''
            +   '<tr>'
            +     '<td>'+message.stuName+'</td>'
            +     '<td>'+message.stuId+'</td>'
            +     '<td>'+message.academy+'</td>'
            +     '<td>'+message.majorAndClass+'</td>'
            +     '<td>'+gender1+'</td>'
            +     '<td>'+message.tel+'</td>'
            +     '<td>'+message.wechat+'</td>'
            +     '<td>'+message.dormitory+'</td>'
            +     '<td>'+message.introduction+'</td>'
            +   '</tr>'
        }

        var valAll = $(val);
        var searchInterviewTr = $(".searchInterviewTr");
        if (searchInterviewTr[0].nextSibling != null) {
          searchInterviewTr[0].nextSibling.remove();
        }
        searchInterviewTr.after(valAll);

        var pages = "";
        for (let i = 1;i <= result.data.pages;i++) {
          pages = pages + "<option value = "+i+">"+i+"</option>"
        }
        $("#searchInterviewSelect").html(pages);

        document.getElementsByClassName("leftButton")[0].onclick =
        function () {
          if (result.data.hasPreviousPage) {
            stage--;
            interviewInformation(department,stage,status);
          }
        }

        document.getElementsByClassName("rightButton")[0].onclick =
        function () {
          if (result.data.hasNextPage) {
            stage++;
            interviewInformation(department,stage,status);
          }
        }

        document.getElementById("searchInterviewSelect").onchange = function () {
          interviewInformation(department,$("#searchInterviewSelect").val(),status);
        }
      },
      error: function (result) {
        alert(result.msg);
      }
    })
}

function searchInterview() {   
  $("#buttonInterview").on("click",
    function () {
      let sel = $("#selectionInterview");
      var getContent = $("#searchBartch").val();
      if (sel[0].style.cssText == "display: none;") {
        try{                                          //尝试获取搜索部门的面试轮次信息
          $.get('http://localhost:3003/user?apartment='+encodeURIComponent(getContent,'UTF-8'),
            function (result) {
              let pattern = /data./;                 //面试轮次的属性名以data-开头
              var keyValue = [];
              for (let key in result[0]) {               //遍历获得的对象取得每轮面试的面试名，并存入数组中
                if (pattern.test(key)) {
                  keyValue.push("<option>"+result[0][key]+"</option>");
                }
              }
              handle(keyValue);
            })
            let handle = function (keyValue) {
                var value = keyValue.join("");
                $("#InterviewSel").html(value);
                $("#searchBartch").prop("style","display:none;"); //隐藏搜索部门的输入框，显示选择框
                sel[0].style = "";
              }
        } catch {
          alert("无结果");                            //日后再改，未写完
        }
      } else {
        $.get('http://localhost:3003/user?time='+encodeURIComponent($("#InterviewSel").val(),"UTF-8"),
          function (result) {                        //获取搜索结果，即面试信息
            alert(result[0].content); //未写完，content是信息列表，还需判断result为空
            $("#nameAndTime").text(""+getContent+""+$("#InterviewSel").val()+"")
            $("#searchBartch").val("");
            sel[0].style = "display:none;"
            $("#searchBartch").prop("style","");
        })
      }
    })
}

function applicationThawing() {
  $("#applicationThawingButton").on("click",
    function () {
      $.ajax({
        type:"post",
        url:" http://localhost:3003/user",
        data:{
          content:$("#applicationThawingDiv").val().trim()
        }
      })
      $("#applicationThawingDiv").val("");
    })
}

function createAccount() {
  $("#createAccount").on("click",
    function () {
      $.ajax({
        type:"post",
        url:"http://10.21.23.112:8080/department/getOrganizationDepartment",
        data:{
          organizationId:1
        },
        success:function (result) {
          let valNew = "";
          for (let i = 0;i < result["data"].length;i++) {
            let newOne = "<option value = '"+result["data"][i].id+"'>"+result["data"][i].name+"</option>";
            valNew = valNew + newOne;
          }
          $(".createAccountSelect").html(valNew);
        }
      });
    })
  $("#createAccountButton").on("click",
    function () {
      if ($("#password").val() == $("#passwordAgain").val()){
        $.ajax({
          type:"post",
          url:"http://10.21.23.140/xiaopan/organization/addDepartmentAdmin",
          contentType: "application/json",
          data:JSON.stringify({
            "departmentId":$(".createAccountSelect").val(),
            "user":{
              "username":$("#username").val(),
              "password":$("#password").val(),
              "tel":"133228",
              "wechat":"133228"
            }
          }),
          success:function (result) {
            alert(result.msg);
          }
        })
      } else {
        alert("验证错误");                    //未写完，需分类哪个input出现错误
      }
    })
}

function changePassword() {
  $("#changePasswordButton").on("click",
    function () {
      var url ="http://10.21.23.112:8080/department/user/updatePassword";
      $.ajax({
        type:'post',
        url:url,
        data: {
          oldPassword: $('.oldPassword').html().trim(),
          newPassword: $('.newPassword1').html().trim()
        },
        //显示上传成功响应
        success:function (result) {
          if($('.newPassword1').html().trim() != $('.newPassword2').html().trim()) {
            alert('请再次检查重新输入的密码！');
          }else if  (result.success) {
            alert('修改密码成功！');
          }else{
            alert('原密码错误！');
          }
        }
      })
    })
}

function communityResources() {
  var id;
  $("#communityResources").on("click",
    function () {
      $.ajax({
        type:"post",
        url:"http://10.21.23.140/xiaopan/organization/getOrganization",
        data:{
          organizationId:10,
        },
        success:function (result) {
          $(".communityResourcesName").text(result.data.name);
          $(".communityResourcesTel").text(result.data.tel);
          $(".communityResourcesPeople").text(result.data.linkman);
          $(".communityResourcesJianJie").text(result.data.introduction);
          $(".communityResourcesClass").text(result.data.category);
          $(".communityResourcesLogo")[0].src = result.data.logoUrl;
          id = result.data.id;
        }
      })
    })
  $(".communityResourcesMain").on("click",".icon-weibiaoti2010104",
    function () {
      $(this).prev().prop("contenteditable","true").focus();
      $(this).removeClass("icon-weibiaoti2010104").addClass("icon-queding");
    });
  $(".communityResourcesMain").on("click",".icon-queding",
    function () {
      $(this).prev("span").prop("contenteditable","false");
      $(this).removeClass("icon-queding").addClass("icon-weibiaoti2010104");
      $.ajax({
        type:"post",
        url:"http://10.21.23.140/xiaopan/organization/updateOrganization",
        data:{
          id:id,
          linkman:$(".communityResourcesPeople").text(),
          tel:$(".communityResourcesTel").text(),
          introduction:$(".communityResourcesJianJie").text()
        },
        success:function (result) {
          alert(result.msg);
        }
      });
    });
}

function createDepartment() {
  $(".createDepartmentButton").on("click",
    function (e) {
      e.preventDefault();
      $.ajax({
        type:"post",
        url:"http://10.21.23.112:8080/department/saveDepartment",
        data:{
          organizationId:1,
          name:"22",
          introduction:"222",
        },
        success:function (result) {
          alert(result.msg);
          $(".createDepartmentInput").text("");
          $("createDepartmentTextarea").text("");
        }
      })
    })
}

function deregistrationDepartment() {
  $("#deregistrationDepartment").on("click",
    function () {     
      $.ajax({
        type:"post",
        url:"http://10.21.23.112:8080/department/getOrganizationDepartment",
        data:{
          organizationId:1
        },
        success:function (result) {
          let val = "";
          for (let i = 0;i < result.data.length;i++) {
            val = val + '<div class="deregistrationDepartmentDiv" id = "'+result.data[i].id+'">'+result.data[i].name+'<i class="iconfont icon-Shapecopy deregistrationDepartmentDelete"></i></div>'
          }
          $(".deregistrationDepartmentMain").html(val);
        }
      })
      $(".deregistrationDepartmentMain").on("click",".deregistrationDepartmentDelete",
        function () {        
          $.ajax({
            type:"post",
            url:"http://10.21.23.140/xiaopan/organization/deleteDepartmentAdmin",
            data:{
              departmentId:this.parentElement.id,
            },
            success:function (result) {
              alert(result.msg);
            }
          })
        })
    })
}



window.onload = function () {
  list();
  searchInterview1();
  applicationThawing();
  createAccount();
  communityResources();
  createDepartment();
  deregistrationDepartment();
}