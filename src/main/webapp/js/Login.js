var mailboxInput = document.getElementById("mailboxInput");
var passwordInput = document.getElementById("passwordInput");
var loginFrom = document.getElementById("loginFrom");
let userDate;



loginFrom.addEventListener("submit", function (ev) {
    ev.preventDefault();//阻止表单默认提交行为
    var mailbox = mailboxInput.value;
    var password = passwordInput.value;
    axios.get('http://localhost:8080/Ly/user/login', {
        params:{
            mailbox: mailbox,
            password: password
        }
    }).then(function (response) {
        if (response.data.flag === 1) {
            // 登录成功
            console.log("登录成功");
            // 获取从服务器返回的JWT
            var token=response.headers.token;
            var long_token=response.headers.long_token;
            var user_data=response.data.user_data;
            userDate=JSON.parse(user_data);
            var playlists=response.data.playlists;
            var collectionPlaylists=response.data.collectionPlaylists;
            var likeSongs=response.data.likeSongs;
            var concerns=response.data.concerns;
            var mySongs=response.data.mySongs;
            var fans=response.data.fans;
            // 将JWT保存在localStorage中
            localStorage.setItem('token', token);
            localStorage.setItem('long_token', long_token);
            localStorage.setItem('user_data', user_data);
            localStorage.setItem('playlists', JSON.stringify(playlists));
            localStorage.setItem('collectionPlaylists', JSON.stringify(collectionPlaylists));
            localStorage.setItem('likeSongs', JSON.stringify(likeSongs));
            localStorage.setItem('mySongs', JSON.stringify(mySongs));
            localStorage.setItem('concerns', JSON.stringify(concerns));
            localStorage.setItem('fans', JSON.stringify(fans));
            var songs = [];
            localStorage.setItem("songs", JSON.stringify(songs));
            if(userDate.state==="正常"){
                swal({
                    title: '登录成功',
                    type: 'success',
                    timer: 1000, // 设定弹窗显示时间
                    showConfirmButton: false, // 隐藏确定按钮
                    showCloseButton: false, // 隐藏关闭按钮
                    background: 'rgb(212, 78, 125)', // 自定义背景颜色
                });
                setTimeout(()=>{
                    location.href = "http://localhost:8080/Ly/Hall.html";
                },1200)
            }else{
                swal({
                    title: "该账号已被冻结",
                    type: 'error',
                    timer: 1000, // 设定弹窗显示时间
                    showConfirmButton: false, // 隐藏确定按钮
                    showCloseButton: false, // 隐藏关闭按钮
                    width: '200px', // 自定义宽度
                    padding: '10px', // 自定义内边距
                    background: 'rgb(212, 78, 125)', // 自定义背景颜色
                });
            }
        } else {
            //登录失败
            swal({
                title: response.data.msg,
                type: 'error',
                timer: 1000, // 设定弹窗显示时间
                showConfirmButton: false, // 隐藏确定按钮
                showCloseButton: false, // 隐藏关闭按钮
                width: '200px', // 自定义宽度
                padding: '10px', // 自定义内边距
                background: 'rgb(212, 78, 125)', // 自定义背景颜色
            });
        }
    }).catch(function (error) {
            console.log(error);
        });
})



