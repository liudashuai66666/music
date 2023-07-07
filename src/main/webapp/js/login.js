var account = document.getElementById("accountInput");
var password = document.getElementById("passwordInput");
account.onblur = function (){
    // 获取输入框的值
    var accountValue = account.value.trim();

    // 创建正则表达式模式
    var pattern = /^\d{10}$/;

    // 使用正则表达式进行匹配
    if (!pattern.test(accountValue)) {
        //不符合规范
        document.getElementById("account_err").style.display='';
    }else{
        document.getElementById("account_err").style.display='none';
    }
}