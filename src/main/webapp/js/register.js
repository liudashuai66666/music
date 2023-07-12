var mailboxInput = document.getElementById("mailboxInput");
var unameInput = document.getElementById("unameInput");
var sendCaptcha = document.getElementById("sendCaptcha");

//验证邮箱是否被使用
mailboxInput.onblur = function () {
    var mailbox = this.value;
    var pattern = /^[1-9][0-9]{4,}@qq.com$/;
    if (!pattern.test(mailbox)) {
        document.getElementById("mailbox_err").style.display='';
        document.getElementById("mailbox_err").textContent="请输入正确的邮箱";
        return;
    }
    axios.get('http://localhost:8080/Ly/pdMailboxServlet', {
        params:{
            mailbox:mailbox
        }
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
    axios.get('http://localhost:8080/Ly/pdUnameServlet',{
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
//发送邮件
sendCaptcha.onclick=function (){
    var mailbox = mailboxInput.value;
    if(mailbox==""){
        alert("请输入邮箱后重试");
        return;
    }else {
        var pattern = /^[1-9][0-9]{4,}@qq.com$/;
        if (!pattern.test(mailbox)) {
            document.getElementById("mailbox_err").style.display='';
            document.getElementById("mailbox_err").textContent="请输入正确的邮箱";
            return;
        }
    }
}









































