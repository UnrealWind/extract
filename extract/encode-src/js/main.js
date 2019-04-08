$(document).ready(function () {
    $('button').click(function () {
        var username = $('#username').val(),password = $('#password').val();
        if(username != '' && password != ''){
            $('.tip').hide();
            $.ajax({
                type: 'GET',
                url:'http://192.168.1.173:28080/encode/info/'+ username +'/'+password,
                success: function (msg) {
                    var data = JSON.parse(msg);
                    $('.result').show();
                    $('.username').html(data.salt);
                    $('.password').html(data.hashPassword);
                    $('.user_sys_name').html(data.encodeLoginName);
                    $('.pass_sys_word').html(data.passWord);
                    $('.titleUser').html(username+' 的md5');
                    $('.titlePass').html(password+' 的密文');
                    $('.title_sys_User').html(username+' 的encodeLoginName');
                    $('.title_sys_Pass').html(password+' 的passWord');
                },
                error:function (err) {
                    console.log(err);
                }
            });
        }else{
            $('.tip').show();
        }
    });

    $('.copyusername').click(function () {
        if($('.username').html() != ''){
            var $aux = $('<input/>').val($(this).prev().html());
            $(event.currentTarget).after($aux);
            $aux[0].select();
            document.execCommand("copy");
            $aux.remove();
            $(this).html('复制成功');
            setTimeout(function () {
                $('.copyusername').html('复制');
            },1500);
        }
    });
    $('.copypassword').click(function () {
        if($('password').html() != ''){
            var $aux = $('<input/>').val($(this).prev().html());
            $(event.currentTarget).after($aux);
            $aux[0].select();
            document.execCommand("copy");
            $aux.remove();
            $(this).html('复制成功');
            setTimeout(function () {
                $('.copypassword').html('复制');
            },1500);
        }
    });
    $('.copy_sys_password').click(function () {
        if($('password').html() != ''){
            var $aux = $('<input/>').val($(this).prev().html());
            $(event.currentTarget).after($aux);
            $aux[0].select();
            document.execCommand("copy");
            $aux.remove();
            $(this).html('复制成功');
            setTimeout(function () {
                $('.copy_sys_password').html('复制');
            },1500);
        }
    });
    $('.copy_sys_username').click(function () {
        if($('.username').html() != ''){
            var $aux = $('<input/>').val($(this).prev().html());
            $(event.currentTarget).after($aux);
            $aux[0].select();
            document.execCommand("copy");
            $aux.remove();
            $(this).html('复制成功');
            setTimeout(function () {
                $('.copy_sys_username').html('复制');
            },1500);
        }
    });


});