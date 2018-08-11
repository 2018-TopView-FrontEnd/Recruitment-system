$(document).ready(function() {
    //动态改变body的背景图
    // setInterval(function() {
    //     $("body").toggleClass("bodyClass");
    // }, 2000);

    //动态居中的方法
    $(function() {
        $(window).resize();
    });

    $(window).resize(function() {
        $("#contain").css({
            position: "absolute",
            left: ($(window).width() - $("#contain").outerWidth()) / 2,
            top: ($(window).height() - $("#contain").outerHeight()) / 2
        });
        $("#registerContain").css({
            position: "absolute",
            left: ($(window).width() - $("#registerContain").outerWidth()) / 2,
            top: ($(window).height() - $("#registerContain").outerHeight()) / 2
        });
        $("#message").css({
            position: "absolute",
            left: ($(window).width() - $("#message").outerWidth()) / 2,
            top: ($(window).height() - $("#message").outerHeight()) / 2
        });
    });

    //登陆注册切换
    $(".load-Register").on("click", function() { //返回登陆的按钮
        $("#contain").fadeIn(1000);
        // $("#registerContain").removeClass("register-Add"); //先把动画的类名去掉
        $("#registerContain").css("display", "none"); //注册页面消失
        $("#message").css("display", "none"); //把详细表单消失
        $("#contain").css("display", "block"); //登陆页面显示
    });
    $(".register").on("click", function() {
        // $("#registerContain").removeClass("register-Add");
        $("#registerContain").fadeIn(1000);
        $("#contain").css("display", "none");
        setTimeout(function() {
            $("#registerContain").css("display", "block");
        }, 1000);

    });

    //点击继续完善信息发送注册表单,判断什么时候可以显示出详细表单
    $(".register-Register").on("click", function() {
        var userName = /^[a-zA-Z0-9]{4,16}$/;
        var userPsw = /^.*(?=.{6,})(?=.*\d)(?=.*[A-Z])(?=.*[a-z])(?=.*[!@#$%^&*? ]).*$/;
        var email = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
        if (userName.test($(".textInput-Register").val())) { //如果正值匹配成功
            if ($(".pswInput-Register").val() != "") { //如果密码不为空
                if (userPsw.test($(".pswInput-Register").val())) { //如果密码正值匹配不成功
                    if ($(".pswInput-Register").val() == $(".pswComfirm-Register").val()) { //两次密码相同
                        if (email.test($(".emaliInput").val())) { //如果邮箱匹配正确
                            // $("#registerContain").addClass("register-Add");
                            $("#registerContain").css("display", "none");
                            $("#message").fadeIn(1500);
                            postData();
                        } else { //邮箱格式不正确
                            alertDiv($(".alertDiv-five"));
                        }
                    } else { //两次密码输入不一样的提示
                        alertDiv($(".alertDiv-second"));
                    }
                } else { //密码为空的提示
                    alertDiv($(".alertDiv-four"));
                }
            } else { //密码正值匹配不成功
                alertDiv($(".alertDiv-third"));
            }
        } else { //用户名正值匹配不成功
            alertDiv($(".alertDiv-first"));
        }

        function postData() { //发送注册的表
            var form = $("#_RegisterForm").serialize();
            $.ajax({
                url: "http://localhost:3000/form",
                async: false, //作用是设置为同步执行
                type: "POST",
                data: form,
                dataType: "json",
                success: function(data) {
                    alert("success");
                }
            });
        }
    });

    function alertDiv(divTime) {
        divTime.css("display", "block");
        divTime.fadeOut(4000);
        setTimeout(function() {
            divTime.css("display", "none");
        }, 4000);
    }

    //登陆的时候向后台发请求，拿数据
    $(".load").on("click", function() {
        var userName = $(".textInput").val();
        var psw = $(".pswInput").val();
        $.ajax({
            url: "http://localhost:3000/user/" + userName,
            async: false,
            type: "GET",
            dataType: "json",
            success: function(data) { //成功的话
                getData(data);
            },
            error: function() { //失败的话，一般都是用户名不存在获取失败
                if (psw == "") {
                    alertDiv($(".alertDiv-eight"));
                } else {
                    alertDiv($(".alertDiv-six"));
                }
            }
        });

        function getData(data) {
            console.log(data);
            if (userName == data.id) { //假设后台返回数据是{"userName":"","password":""}
                if (psw == data.password) {
                    window.open("https://www.jb51.net/article/115170.htm"); //打开新链接
                } else {
                    alertDiv($(".alertDiv-seven"));
                }
            }
        }
    });


    //发送具体信息的表单表单数据

    $(".successBun").on("click", function() {
        var word = /[\u4e00-\u9fa5]/;
        var phone = /^((13[0-9])|(14[5|7])|(15([0-3]|[5-9]))|(18[0,5-9]))\d{8}$/;
        if (word.test($(".td-first").val())) { //判断社团填写正确
            if (word.test($(".td-second").val())) {
                if (word.test($(".td-third").val())) {
                    if (phone.test($(".td-four").val())) {
                        postDataaNother();
                    } else {
                        alertDiv($(".alertDiv-twelve"));
                    }
                } else {
                    alertDiv($(".alertDiv-eleven"));
                }
            } else {
                alertDiv($(".alertDiv-ten"));
            }
        } else {
            alertDiv($(".alertDiv-night"));
        }


        function postDataaNother() { //发送详细信息的表
            var form1 = $("#_MessageForm").serialize();
            $.ajax({
                url: "http://localhost:3000/form",
                async: false, //作用是设置为同步执行
                type: "POST",
                data: form1,
                dataType: "json",
                success: function(data) {
                    alert("success");
                }
            });
        }
    });





});