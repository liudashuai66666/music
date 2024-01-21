let userData;//用户数据
let cnt1=1;//歌曲分页的当前页数
let cnt2=1;//歌手分页的当前页数
let cnt3=1;//用户分页的当前页数
let CNT1=1;//歌曲总页数
let CNT2=1;//歌手总页数
let CNT3=1;//用户总页数
let sum1;//歌曲分页的数据总数
let sum2;//歌手分页的数据总数
let sum3;//用户分页的数据总数

// 在页面加载后执行判断
window.onload = function () {
    userData = JSON.parse(localStorage.getItem("user_data"));
    if(userData.status==="MANAGE"){
        let manage_nav = document.getElementById("manage-div");
        manage_nav.style.cursor="pointer";
        manage_nav.style.backgroundColor= "rgb(0, 0, 0)";
    }

    document.getElementById("my-avatar").src=userData.avatar;
    selectSong();
    selectSinger();
    selectUser();
};
/*
* 分页按钮
* */
let nextButton = document.getElementById("next-button");//下一页
let backButton = document.getElementById("back-button");//上一页
let homeButton = document.getElementById("home-button");//首页
let endButton = document.getElementById("end-button");//尾页
let goButton = document.getElementById("go-button");//指定页数
let pagesInput = document.getElementById("pages-input");//指定页数
nextButton.addEventListener("click",function (){
    if(cnt1<CNT1){
        cnt1++;
        selectSong();
    }
})
backButton.addEventListener("click",function (){
    if(cnt1>1){
        cnt1--;
        selectSong();
    }
})
homeButton.addEventListener("click",function (){
    cnt1=1;
    selectSong();
})
endButton.addEventListener("click",function (){
    cnt1=CNT1;
    selectSong();
})
goButton.addEventListener('click',function (){
    cnt1=pagesInput.value;
    selectSong();
})
/*
* ——————————————————————————————————————————————————————————————————————————————————————————————————————————————————————
* */

function selectSong(){
    axios.get('http://localhost:8080/Ly/song/selectNewSongs', {
        params: {
            cnt: (cnt1-1)*6
        }
    }).then(function (response) {
        sum1=response.data.number;
        if (sum1%6===0){
            CNT1=sum1/6;
        }else{
            CNT1=sum1/6+1;
            CNT1=parseInt(CNT1);
        }
        let songs = response.data.songs;
        let song_list = document.getElementById("song-list");
        song_list.innerHTML=" ";
        for (let i = 0; i < songs.length; i++) {
            let song_list_li = document.createElement("a");
            song_list_li.className="song-list-li";
            song_list_li.title=songs[i].id;
            song_list_li.addEventListener("dblclick",function (event){
                event.preventDefault();//阻止默认点击行为
                // 尝试从本地存储中获取openedWindow的状态
                var openedWindowId = localStorage.getItem("openedWindowId");
                var openedWindow = openedWindowId ? window.open("", openedWindowId) : null;

                if (openedWindow === null || openedWindow.closed) {

                    openedWindow = window.open(
                        "http://localhost:8080/Ly/PlaySong.html?song=" + song_list_li.title,
                        "音乐播放"
                    );
                    openedWindowId = openedWindow.name; // 使用窗口的名称作为标识符
                    console.log(openedWindowId);
                    console.log("第一次打开播放列表");
                } else {
                    openedWindow.close(); // 关闭之前的窗口
                    openedWindow = window.open(
                        "http://localhost:8080/Ly/PlaySong.html?song=" + song_list_li.title,
                        "音乐播放"
                    );
                    openedWindowId = openedWindow.name; // 使用窗口的名称作为标识符
                    console.log(openedWindowId);
                    console.log("在一个新的窗口打开播放列表");
                }

                localStorage.setItem("openedWindowId", openedWindowId); // 存储窗口标识符到本地存储
            })
            song_list_li.innerHTML=`
                <img src= ${songs[i].img} class="song-img">
                <span class="song-name">${songs[i].name}</span>
                <span class="song-author">${songs[i].author}</span>
                <span class="song-createTime">${songs[i].createTime}</span>
            `;
            let noButton = document.createElement('span');
            noButton.className="noButton";
            noButton.textContent="打回"
            let okButton = document.createElement('span');
            okButton.className="okButton";
            okButton.textContent="通过"
            song_list_li.appendChild(noButton);
            song_list_li.appendChild(okButton);
            song_list.appendChild(song_list_li);


            noButton.addEventListener("click",function (){
                let result = confirm("确定将该歌曲打回？");
                if (result) {
                    // 用户点击了确认按钮
                    axios.get('http://localhost:8080/Ly/song/updateSongState_no', {
                        params:{
                            id:songs[i].id,
                        }
                    }).then(function (response) {
                        swal({
                            title: '处理成功',
                            type: 'success',
                            timer: 1000, // 设定弹窗显示时间
                            showConfirmButton: false, // 隐藏确定按钮
                            showCloseButton: false, // 隐藏关闭按钮
                            background: 'rgb(212, 78, 125)', // 自定义背景颜色
                        });
                        selectSong();
                    }).catch(function (error) {
                        console.log(error);
                    });
                } else {
                    // 用户点击了取消按钮
                }
            })
            okButton.addEventListener("click",function (){
                let result = confirm("确定通过该歌曲审核？");
                if (result) {
                    // 用户点击了确认按钮
                    axios.get('http://localhost:8080/Ly/song/updateSongState_yes', {
                        params:{
                            id:songs[i].id,
                        }
                    }).then(function (response) {
                        swal({
                            title: '处理成功',
                            type: 'success',
                            timer: 1000, // 设定弹窗显示时间
                            showConfirmButton: false, // 隐藏确定按钮
                            showCloseButton: false, // 隐藏关闭按钮
                            background: 'rgb(212, 78, 125)', // 自定义背景颜色
                        });
                        selectSong();
                    }).catch(function (error) {
                        console.log(error);
                    });
                } else {
                    // 用户点击了取消按钮
                }
            })


        }
        document.getElementById("cnt-span").textContent="一共 "+sum1+" 条数据";
        document.getElementById("pages-span").textContent="当前 " +cnt1+"/"+CNT1+" 页";
        document.getElementById("pages-input").value=cnt1;
        if(cnt1>=CNT1){
            nextButton.style.color="rgb(153, 153, 153)";
        }else{
            nextButton.style.color="rgb(0, 0, 0)";
        }
        if(cnt1<=1){
            backButton.style.color="rgb(153, 153, 153)";
        }else{
            backButton.style.color="rgb(0, 0, 0)";
        }
    }).catch(function (error) {
        console.dir(error);
    });
}
/*填充界面的函数*/
function selectSinger(){
    axios.get('http://localhost:8080/Ly/song/selectNewSinger', {
        params: {
            cnt: (cnt2-1)*5
        }
    }).then(function (response) {
        sum2=response.data.number;
        if (sum2%6===0){
            CNT2=sum2/6;
        }else{
            CNT2=sum2/6+1;
            CNT2=parseInt(CNT2);
        }
        let songs = response.data.songs;
        let users = response.data.users;
        let song_list = document.getElementById("singer-list");
        song_list.innerHTML=" ";
        for (let i = 0; i < users.length; i++) {
            let song_list_li = document.createElement("div");
            song_list_li.className="singer-list-li";/*大的li*/

            let singer_user = document.createElement("div");
            singer_user.className="singer-user";/*用户*/
/*
            singer_user.title=users[i].username;
*/
            singer_user.innerHTML=`
                <img src= ${users[i].avatar} class="user-img">
                <span class="user-name">${users[i].username}</span>
                <span class="user-author">${users[i].signature}</span>
                <span class="user-createTime">${songs[i].createTime}</span>
            `;
            let noButton = document.createElement('span');
            noButton.className="noButton";
            noButton.textContent="打回"
            let okButton = document.createElement('span');
            okButton.className="okButton";
            okButton.textContent="通过"
            singer_user.appendChild(noButton);
            singer_user.appendChild(okButton);
            song_list_li.appendChild(singer_user);

            let singer_song = document.createElement("div");
            singer_song.className="singer-song";
            singer_song.innerHTML=`
                <img src=${songs[i].img} class="singer-song-img">
                <span class="singer-song-name">${songs[i].name}</span>
            `;
            song_list_li.appendChild(singer_song);
            let unfold = document.createElement("span");
            unfold.className="unfold";
            unfold.textContent="展开";

            unfold.addEventListener("click", function (){
                if(unfold.textContent==="展开"){
                    singer_song.style.display="flex";
                    unfold.textContent="收起"
                }else{
                    singer_song.style.display="none";
                    unfold.textContent="展开"
                }
            })


            song_list_li.appendChild(unfold);

            song_list.appendChild(song_list_li);

            singer_user.addEventListener("dblclick",function (){
                if(users[i].status==="SINGER"){
                    window.open("http://localhost:8080/Ly/SingerHall.html?name=" + users[i].username);
                }else{
                    window.open("http://localhost:8080/Ly/user.html?name=" + users[i].username);
                }
            })
            singer_song.addEventListener('dblclick',function (event){
                event.preventDefault();//阻止默认点击行为
                // 尝试从本地存储中获取openedWindow的状态
                var openedWindowId = localStorage.getItem("openedWindowId");
                var openedWindow = openedWindowId ? window.open("", openedWindowId) : null;

                if (openedWindow === null || openedWindow.closed) {

                    openedWindow = window.open(
                        "http://localhost:8080/Ly/PlaySong.html?song=" + songs[i].id,
                        "音乐播放"
                    );
                    openedWindowId = openedWindow.name; // 使用窗口的名称作为标识符
                    console.log(openedWindowId);
                    console.log("第一次打开播放列表");
                } else {
                    openedWindow.close(); // 关闭之前的窗口
                    openedWindow = window.open(
                        "http://localhost:8080/Ly/PlaySong.html?song=" + songs[i].id,
                        "音乐播放"
                    );
                    openedWindowId = openedWindow.name; // 使用窗口的名称作为标识符
                    console.log(openedWindowId);
                    console.log("在一个新的窗口打开播放列表");
                }

                localStorage.setItem("openedWindowId", openedWindowId); // 存储窗口标识符到本地存储
            })

            noButton.addEventListener("click",function (){
                let result = confirm("拒绝该用户成为歌手？");
                if (result) {
                    // 用户点击了确认按钮
                    axios.get('http://localhost:8080/Ly/song/singerButton_no', {
                        params:{
                            id:songs[i].id
                        }
                    }).then(function (response) {
                        swal({
                            title: '处理成功',
                            type: 'success',
                            timer: 1000, // 设定弹窗显示时间
                            showConfirmButton: false, // 隐藏确定按钮
                            showCloseButton: false, // 隐藏关闭按钮
                            background: 'rgb(212, 78, 125)', // 自定义背景颜色
                        });
                        selectSinger();
                    }).catch(function (error) {
                        console.log(error);
                    });
                } else {
                    // 用户点击了取消按钮
                }
            })
            okButton.addEventListener("click",function (){
                let result = confirm("同意让该用户成为歌手？");
                if (result) {
                    // 用户点击了确认按钮
                    axios.get('http://localhost:8080/Ly/song/singerButton_yes', {
                        params:{
                            id:songs[i].id,
                            name:users[i].username
                        }
                    }).then(function (response) {
                        swal({
                            title: '处理成功',
                            type: 'success',
                            timer: 1000, // 设定弹窗显示时间
                            showConfirmButton: false, // 隐藏确定按钮
                            showCloseButton: false, // 隐藏关闭按钮
                            background: 'rgb(212, 78, 125)', // 自定义背景颜色
                        });
                        selectSinger();
                    }).catch(function (error) {
                        console.log(error);
                    });
                } else {
                    // 用户点击了取消按钮
                }
            })



        }
        document.getElementById("singer-cnt-span").textContent="一共 "+sum2+" 条数据";
        document.getElementById("singer-pages-span").textContent="当前 " +cnt2+"/"+CNT2+" 页";
        document.getElementById("singer-pages-input").value=cnt2;
        if(cnt2>=CNT2){
            singerNextButton.style.color="rgb(153, 153, 153)";
        }else{
            singerNextButton.style.color="rgb(0, 0, 0)";
        }
        if(cnt2<=1){
            singerBackButton.style.color="rgb(153, 153, 153)";
        }else{
            singerBackButton.style.color="rgb(0, 0, 0)";
        }
    }).catch(function (error) {
        console.dir(error);
    });
}
/*填充界面的函数*/
let singerNextButton = document.getElementById("singer-next-button");//下一页
let singerBackButton = document.getElementById("singer-back-button");//上一页
let singerHomeButton = document.getElementById("singer-home-button");//首页
let singerEndButton = document.getElementById("singer-end-button");//尾页
let singerGoButton = document.getElementById("singer-go-button");//指定页数
let singerPagesInput = document.getElementById("singer-pages-input");//指定页数
singerNextButton.addEventListener("click",function (){
    if(cnt2<CNT2){
        cnt2++;
        selectSinger();
    }
})
singerBackButton.addEventListener("click",function (){
    if(cnt2>1){
        cnt2--;
        selectSinger();
    }
})
singerHomeButton.addEventListener("click",function (){
    cnt2=1;
    selectSinger();
})
singerEndButton.addEventListener("click",function (){
    cnt2=CNT2;
    selectSinger();
})
singerGoButton.addEventListener('click',function (){
    cnt2=singerPagesInput.value;
    selectSinger();
})


function selectUser(){
    axios.get('http://localhost:8080/Ly/user/selectAll', {
        params: {
            cnt: (cnt3-1)*6
        }
    }).then(function (response) {
        sum3=response.data.number;
        if (sum3%6===0){
            CNT3=sum3/6;
        }else{
            CNT3=sum3/6+1;
            CNT3=parseInt(CNT3);
        }
        let users = response.data.users;
        let user_list = document.getElementById("user-list");
        user_list.innerHTML=" ";
        for (let i = 0; i < users.length; i++) {
            let user_list_li = document.createElement("div");
            user_list_li.className="user-list-li";/*大的li*/
            user_list_li.innerHTML=`
                <img src= ${users[i].avatar} class="user-img">
                <span class="user-name">${users[i].username}</span>
                <span class="user-author">${users[i].signature}</span>
                <span class="user-createTime">${users[i].status}</span>
            `;
            let okButton = document.createElement('span');
            okButton.className="okButton";
            if(users[i].state==="正常"){
                okButton.textContent="冻结";
                okButton.style.backgroundColor="rgb(244, 67, 54)"
            }else {
                okButton.textContent="解冻";
            }
            user_list_li.appendChild(okButton);
            user_list.appendChild(user_list_li);
            user_list_li.addEventListener("dblclick",function (){
                if(users[i].status==="SINGER"){
                    window.open("http://localhost:8080/Ly/SingerHall.html?name=" + users[i].username);
                }else{
                    window.open("http://localhost:8080/Ly/user.html?name=" + users[i].username);
                }
            })
            okButton.addEventListener("click",function (){
                if(okButton.textContent==="冻结"){
                    let result = confirm("确定冻结该用户？");
                    if (result) {
                        // 用户点击了确认按钮
                        axios.get('http://localhost:8080/Ly/user/changeState', {
                            params:{
                                name:users[i].username,
                                flag:"冻结"
                            }
                        }).then(function (response) {
                            swal({
                                title: '冻结成功',
                                type: 'success',
                                timer: 1000, // 设定弹窗显示时间
                                showConfirmButton: false, // 隐藏确定按钮
                                showCloseButton: false, // 隐藏关闭按钮
                                background: 'rgb(212, 78, 125)', // 自定义背景颜色
                            });
                            selectUser();
                        }).catch(function (error) {
                            console.log(error);
                        });
                    } else {
                        // 用户点击了取消按钮
                    }
                }else{
                    let result = confirm("确定将该用户解冻？");
                    if (result) {
                        // 用户点击了确认按钮
                        axios.get('http://localhost:8080/Ly/user/changeState', {
                            params:{
                                name:users[i].username,
                                flag:"解冻"
                            }
                        }).then(function (response) {
                            swal({
                                title: '解冻成功',
                                type: 'success',
                                timer: 1000, // 设定弹窗显示时间
                                showConfirmButton: false, // 隐藏确定按钮
                                showCloseButton: false, // 隐藏关闭按钮
                                background: 'rgb(212, 78, 125)', // 自定义背景颜色
                            });
                            selectUser();
                        }).catch(function (error) {
                            console.log(error);
                        });
                    } else {
                        // 用户点击了取消按钮
                    }
                }

            })
        }
        document.getElementById("user-cnt-span").textContent="一共 "+sum3+" 条数据";
        document.getElementById("user-pages-span").textContent="当前 " +cnt3+"/"+CNT3+" 页";
        document.getElementById("user-pages-input").value=cnt3;
        if(cnt3>=CNT3){
            userNextButton.style.color="rgb(153, 153, 153)";
        }else{
            userNextButton.style.color="rgb(0, 0, 0)";
        }
        if(cnt3<=1){
            userBackButton.style.color="rgb(153, 153, 153)";
        }else{
            userBackButton.style.color="rgb(0, 0, 0)";
        }
    }).catch(function (error) {
        console.dir(error);
    });
}
let userNextButton = document.getElementById("user-next-button");//下一页
let userBackButton = document.getElementById("user-back-button");//上一页
let userHomeButton = document.getElementById("user-home-button");//首页
let userEndButton = document.getElementById("user-end-button");//尾页
let userGoButton = document.getElementById("user-go-button");//指定页数
let userPagesInput = document.getElementById("user-pages-input");//指定页数
userNextButton.addEventListener("click",function (){
    if(cnt3<CNT3){
        cnt3++;
        selectUser();
    }
})
userBackButton.addEventListener("click",function (){
    if(cnt3>1){
        cnt3--;
        selectUser();
    }
})
userHomeButton.addEventListener("click",function (){
    cnt3=1;
    selectUser();
})
userEndButton.addEventListener("click",function (){
    cnt3=CNT3;
    selectUser();
})
userGoButton.addEventListener('click',function (){
    cnt3=userPagesInput.value;
    selectUser();
})









/*头像悬停事件*/
/*跟头像有关的*/
let my_avatar = document.getElementById("my-avatar");
let control = document.getElementById("my-msg-control");
my_avatar.addEventListener('mouseenter', function () {
    /*当鼠标悬停在头像时*/
    control.style.display = 'flex';
})

my_avatar.addEventListener('mouseleave', function () {
    /*当鼠标离开头像时*/
    control.style.display = 'none';
})

control.addEventListener('mouseenter', function () {
    /*当鼠标悬停在头像时*/
    control.style.display = 'flex';
})

control.addEventListener('mouseleave', function () {
    /*当鼠标离开头像时*/
    control.style.display = 'none';
})

let change_msg_button = document.getElementById("change-msg-button");
let change_jiemian = document.getElementById("change-my-msg");
change_msg_button.addEventListener('click', function () {
    let user_data = localStorage.getItem("user_data");
    let userData = JSON.parse(user_data);
    let Avatar = userData.avatar;
    let Uname = userData.username;
    let Signature = userData.signature;
    change_jiemian.style.display = 'flex';
    document.getElementById("change-img").src = Avatar;
    document.getElementById("change-name").value=Uname;
    document.getElementById("signature").value=Signature;
})

document.getElementById("no-button").addEventListener("click", function () {
    change_jiemian.style.display = 'none';
})

document.getElementById("change-img").addEventListener("click", function () {
    // 创建文件选择器的 input 元素
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".jpg, .png, .webp"; // 可选的文件类型

// 当文件选择器的值发生改变时触发上传文件的函数
    input.addEventListener("change", function (event) {
        const file = event.target.files[0]; // 获取第一个选定的文件
        if (file) {
            // 创建 FormData 对象
            const formData = new FormData();
            formData.append("avatar", file);

            // 发送 POST 请求进行文件上传
            axios.post('http://localhost:8080/Ly/user/changeImg', formData)
                .then(function (response) {
                    let avatar_name = response.data;
                    let filename = "img/avatar/" + avatar_name;
                    document.getElementById("change-img").src = filename;
                    console.log(filename);
                })
                .catch(function (error) {
                    console.log(error);
                });
        }
    });

// 模拟点击文件选择器的 input 元素
    input.click();
});


document.getElementById("ok-button").addEventListener("click", function () {
    let newName = document.getElementById("change-name").value;
    let Signature = document.getElementById("signature").value;
    let avatarsrc = document.getElementById("change-img").src;
    var prefix = "http://localhost:8080/Ly/";
    var Avatar = avatarsrc.replace(prefix, "");
    console.log(Avatar);

    let user_data = localStorage.getItem("user_data");
    let userData = JSON.parse(user_data);
    let oldName = userData.username;

    axios.get('http://localhost:8080/Ly/user/changeMsg', {
        params: {
            oldName: oldName,
            newName: newName,
            signature: Signature,
            avatar: Avatar
        }
    }).then(function (response) {
        console.log(response.data)
        if (response.data === "修改成功") {
            userData.username = newName;
            userData.avatar = Avatar;
            userData.signature = Signature;
            localStorage.setItem("user_data", JSON.stringify(userData));
            document.getElementById("my-avatar").src = Avatar;
            document.getElementById("change-img").src = Avatar;
            for (const avatar of document.getElementsByClassName("my-avatar")) {
                avatar.src = Avatar;
            }
            for (const uname of document.getElementsByClassName("my-info-name")) {
                uname.textContent = newName;
            }
            for (const signature of document.getElementsByClassName("my-info-js")) {
                signature.textContent = Signature;
            }
            change_jiemian.style.display = 'none';
        }
    }).catch(function (error) {
        console.log(error);
    });

})

document.getElementById("Back-off-login").addEventListener("click",function (){
    location.href = "http://localhost:8080/Ly/Login.html";
})

/*搜索框*/
var searchInput = document.getElementById("SearchInput");

searchInput.addEventListener("keydown", function(event) {
    if (event.key === "Enter") {
        // 获取输入框的值
        var searchText = searchInput.value.trim();
        // 构建跳转的链接
        var url = "http://localhost:8080/Ly/search.html?text=" +searchText;

        // 页面跳转
        window.location.href = url;
    }
});







document.getElementById("manage-singer").addEventListener("click", function (){
    document.getElementById("manage-song-list").style.display="none";
    document.getElementById("manage-singer-list").style.display="flex";
    document.getElementById("manage-user-list").style.display="none";
    document.getElementById("manage-user").style.backgroundColor="rgb(225, 225, 225)"
    document.getElementById("manage-singer").style.backgroundColor="rgb(205, 205, 205)"
    document.getElementById("manage-song").style.backgroundColor="rgb(225, 225, 225)"
})

document.getElementById("manage-song").addEventListener("click", function (){
    document.getElementById("manage-song-list").style.display="flex";
    document.getElementById("manage-singer-list").style.display="none";
    document.getElementById("manage-user-list").style.display="none";
    document.getElementById("manage-user").style.backgroundColor="rgb(225, 225, 225)"
    document.getElementById("manage-song").style.backgroundColor="rgb(205, 205, 205)"
    document.getElementById("manage-singer").style.backgroundColor="rgb(225, 225, 225)"
})
document.getElementById("manage-user").addEventListener("click", function (){
    document.getElementById("manage-song-list").style.display="none";
    document.getElementById("manage-singer-list").style.display="none";
    document.getElementById("manage-user-list").style.display="flex";
    document.getElementById("manage-song").style.backgroundColor="rgb(225, 225, 225)"
    document.getElementById("manage-singer").style.backgroundColor="rgb(225, 225, 225)"
    document.getElementById("manage-user").style.backgroundColor="rgb(205, 205, 205)"
})












