var mailboxInput = document.getElementById("mailboxInput");
var unameInput = document.getElementById("unameInput");
var sendCaptcha = document.getElementById("sendCaptcha");
var enrollFrom = document.getElementById("enrollFrom");
var Captcha;

//验证邮箱是否被使用
mailboxInput.onblur = function () {
    var mailbox = this.value;
    var pattern = /^[1-9][0-9]{4,}@qq.com$/;
    if (!pattern.test(mailbox)) {
        document.getElementById("mailbox_err").style.display='';
        document.getElementById("mailbox_err").textContent="请输入正确的邮箱";
        return;
    }
    axios.post('http://localhost:8080/Ly/user/pdMailbox', {
        mailbox:mailbox
    }).then(function (response) {
        if (response.data === "无用") {
            //邮箱已经注册过
            document.getElementById("mailbox_err").style.display = '';
            document.getElementById("mailbox_err").textContent = '该邮箱已经被使用';
        } else {
            //名字还未被使用
            document.getElementById("mailbox_err").style.display = 'none';
        }
    }).catch(function (error) {
        console.log(error);
    });
}
//验证姓名是否被使用
unameInput.onblur = function () {
    var uname = this.value;
    axios.get('http://localhost:8080/Ly/user/pdUname',{
        params:{
            uname:uname
        }
    }).then(function (response) {
        if (response.data === "无用") {
            //名字已经注册过
            document.getElementById("uname_err").style.display = '';
        } else{
            //名字还未被使用
            document.getElementById("uname_err").style.display = 'none';
        }
    }).catch(function (eror) {
        console.log(errorr);
    });
}

let i=60;
//发送邮件
sendCaptcha.onclick=function (){
    sendCaptcha.disabled=true;
    var mailbox = mailboxInput.value;
    if(mailbox===""){
        alert("请输入邮箱后重试");
        sendCaptcha.disabled=false;
        return;
    }else {
        var pattern = /^[1-9][0-9]{4,}@qq.com$/;
        if (!pattern.test(mailbox)) {
            document.getElementById("mailbox_err").style.display='';
            document.getElementById("mailbox_err").textContent="请输入正确的邮箱";
            sendCaptcha.disabled=false;
            return;
        }else{
            axios.post('http://localhost:8080/Ly/user/sendCaptcha',{
                mailbox:mailbox,
            }).then(function (response) {
                if(response.data==="发送失败"){
                    alert("发送失败");
                    sendCaptcha.disabled=false;
                }else {
                    Captcha=response.data;
                    console.log(Captcha);
                    //邮件发送成功，开始定时器
                    let n=setInterval(function (){
                        i--;
                        sendCaptcha.value=i;
                        if(i===0){
                            sendCaptcha.disabled=false;
                            sendCaptcha.value="发送";
                            i=60;
                            clearInterval(n)
                        }
                    },1000)
                }
            }).catch(function (eror) {
                console.log(errorr);
            });
        }
    }
}
enrollFrom.addEventListener("submit", function (ev) {
    ev.preventDefault();//阻止表单默认提交行为
    var mailbox = mailboxInput.value;
    var uname = unameInput.value;
    var password = document.getElementById("passwordInput").value;
    var captcha = document.getElementById("Captcha").value;
    if(captcha===Captcha){
        axios.get('http://localhost:8080/Ly/user/enroll', {
            params:{
                mailbox: mailbox,
                password: password,
                uname:uname
            }
        }).then(function (response) {
            swal({
                title: '注册成功',
                type: 'success',
                timer: 1000, // 设定弹窗显示时间
                showConfirmButton: false, // 隐藏确定按钮
                showCloseButton: false, // 隐藏关闭按钮
                background: 'rgb(212, 78, 125)', // 自定义背景颜色
            });
            setTimeout(()=>{
                location.href = "http://localhost:8080/Ly/Login.html";
            },1200)
        }).catch(function (error) {
            console.log(error);
        });
    }else{
        swal({
            title: "验证码错误",
            type: 'error',
            timer: 500, // 设定弹窗显示时间
            showConfirmButton: false, // 隐藏确定按钮
            showCloseButton: false, // 隐藏关闭按钮
            width: '200px', // 自定义宽度
            padding: '10px', // 自定义内边距
            background: 'rgb(212, 78, 125)', // 自定义背景颜色
        });
    }
})










































