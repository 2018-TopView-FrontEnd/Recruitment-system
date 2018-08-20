

// // 小方块定时变颜色
// setInterval(function () {
//     var randomColor = '#' + ('00000'+(0|Math.random()*(1<<24)).toString(16)).slice(-6);
//     $('#SignUpChange').css('background-color',randomColor);
//     $('#SignUpChange').css('opacity',Math.random());
//     $('#SignUpChange').css('border-radius',Math.random() * 50 + '%');
// },4000);

// // 小方块随着鼠标移动而移动
// $(document).on('mousemove','*',function (e) {
//     var left = document.getElementById('SignUpChange').getBoundingClientRect().left;
//     var top1 = document.getElementById('SignUpChange').getBoundingClientRect().top;
//     var SignUpChange = document.getElementById('SignUpChange');
//     var x = e.clientX - left;
//     var y = e.clientY - top1;
//     $('#SignUpChange').css('margin-left',~~(-x / 50) + 'px');
//     $('#SignUpChange').css('margin-top',~~(-y / 50) + 'px');
// });



// $(document).on('mouseup','#SignUpHead',function (e) {
//     var leftDemo = document.getElementById('SignUpHead').getBoundingClientRect().left;
//     var topDemo = document.getElementById('SignUpHead').getBoundingClientRect().top;
//     var widthDemo = document.getElementById('SignUpHead').getBoundingClientRect().width;
//     var heightDemo = document.getElementById('SignUpHead').getBoundingClientRect().height;
//     var div = $('<div style="border-radius:100%;position:absolute;transform:translate(-50%, -50%);background: rgba(201, 195, 195, 0.2);z-index:1;"></div>');
//     var x = e.clientX - leftDemo;
//     var y = e.clientY - topDemo;
//     var radius = Math.sqrt(widthDemo * widthDemo + heightDemo * heightDemo);
//     div.css('top',y);
//     div.css('left',x);
//     $('#SignUpHead').append(div);
//     div.animate({
//         // transform: 'scale(' + radius + ',' + radius + ')'
//         width: 2 * radius,
//         height: 2 * radius,
//         opacity: 'hide'
//     },1500,function () {
//         div.remove();
//     });
    
// });

// $.get('http://localhost:3000/comments/seven',function (result) {
//     // console.log(result.code);
// });

// $.post('http://localhost:3000/comments',{
//     'id': 'coolBoy',
//     'code': 'dsadasd'
// }
// ,function (result) {
//     console.log(result.code);
// });


// 获取正在招新的部门
$.ajax({
    url:'http://10.21.23.112:8080/department/getSigningDepartment',
    dataType:'json',
    type:'POST',
    // contentType: "application/json",
    data:{
        "organizationId": 1
    },
    success:function (data) {


        $(data.data).each(function (i) {
            $('select[name="department"]').append($('<option value="' + $(this).attr('id') +  '">' + $(this).attr('name') + '</option>'));
        console.log($(this).attr('id'));
        });

    }
});

var isFresh = 0;
$('#SignUpBody').on('focus','input',function () {
    $(this).closest('li').find('.fakeLetter').attr('style','margin-left: -4.5em;color:#64f39b;');
});

$('#SignUpBody').on('blur','input',function () {
    if ($(this).val() == '') {
        $(this).closest('li').find('.fakeLetter').attr('style','margin-left: 0.82em;color:#757579;');
    }
    
});
$('form').on('submit',function (e) {
    var stuNameZ = /^(?!_)(?!.*?_$)[a-zA-Z0-9_\u4e00-\u9fa5]{1,10}$/;
    var stuIdZ = /^\d{10}$/;
    var majorAndClassZ = /^(?!_)(?!.*?_$)[a-zA-Z0-9_\u4e00-\u9fa5]{1,20}$/;
    var telZ = /^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/;
    var dormitoryZ = /^(?!_)(?!.*?_$)[a-zA-Z0-9_\u4e00-\u9fa5]{1,10}$/;
    var wechatZ = /\S{1,20}$/;
    var TextareaZ = /\S\s{1,200}$/;
    var isTrue = true;
    if (isFresh != 0) {
        $(this).find('[type="submit"]')
    }
    e.preventDefault();
    $('input[type="text"]').each(function (i) {
        switch(i) {
            case 0:
                if (!stuNameZ.test($(this).val())) {
                    $(this).next().slideDown();
                    isTrue = false;
                } else {
                    $(this).next().slideUp();
                }
                break;
            case 1:
                if (!stuIdZ.test($(this).val())) {
                    $(this).next().slideDown();
                    isTrue = false;
                } else {
                    $(this).next().slideUp();
                }
                break;
            case 2:
                if (!majorAndClassZ.test($(this).val())) {
                    $(this).next().slideDown();
                    isTrue = false;
                } else {
                    $(this).next().slideUp();
                }
                break;
            case 3:
                if (!telZ.test($(this).val())) {
                    $(this).next().slideDown();
                    isTrue = false;
                } else {
                    $(this).next().slideUp();
                }
                break;
            case 4:
                if (!dormitoryZ.test($(this).val())) {
                    $(this).next().slideDown();
                    isTrue = false;
                } else {
                    $(this).next().slideUp();
                }
                break;
            case 5:
                if (!wechatZ.test($(this).val())) {
                    $(this).next().slideDown();
                    isTrue = false;
                } else {
                    $(this).next().slideUp();
                }
                break;
        }       
    });

    if (!stuNameZ.test($('textarea').val())) {
        $('textarea').next().slideDown();
        isTrue = false;
    } else {
        $('textarea').next().slideUp();
    }
    if (!isTrue) {
        return;
    }
  
    $.ajax({
        url:'http://192.168.43.133:8080/application/add',
        dataType:'json',
        type:'POST',
        contentType: "application/json",
        data:JSON.stringify({
            "organizationId": 1,
            "departmentId": $('[name="department"]').val(),
            "stuName": $('[name="stuName"]').val(),
            "gender": (($('[name="gender"]').val())? 0 : 1),
            "academy": $('[name="academy"]').val(),
            "majorAndClass": $('[name="majorAndClass"]').val(),
            "wechat": $('[name="wechat"]').val(),
            "tel": $('[name="tel"]').val(),
            "stuId": $('[name="stuId"]').val(),
            "dormitory": $('[name="dormitory"]').val(),
            "adjustable": (($('[name="adjustable"]').val())? false : true),
            "introduction": $('[name="introduction"]').val()
        }),
        success:function (data) {
            if (data.success == true) {
                alert('报名成功！');
            } else {
                alert('您已报名，请勿重复报名！');
            };
            
        }
    });
});
