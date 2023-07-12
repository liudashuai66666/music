var mailboxInput = document.getElementById("mailboxInput");
var passwordInput = document.getElementById("passwordInput");
var loginFrom = document.getElementById("loginFrom");
loginFrom.addEventListener("submit", function (ev) {
    ev.preventDefault();//阻止表单默认提交行为
    var mailbox = mailboxInput.value;
    var password = passwordInput.value;
    axios.get('http://localhost:8080/Ly/loginServlet', {
        params: {
            mailbox: mailbox,
            password: password
        }
    }).then(function (response) {
        /*if (response.data === "登录成功") {
            // 登录成功
            window.location.href = "/Ly/loginServlet?mailbox=2385272607@qq.com&password=1314520qwe";
        } else {
            // 登录失败，重定向到登录页面
            alert(response.data);
        }*/
        alert(response.data)
    }).catch(function (error) {
            console.log(error);
        });
})



