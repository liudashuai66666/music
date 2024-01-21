let userData;//用户数据

// 在页面加载后执行判断
window.onload = function () {
    let user_data = localStorage.getItem("user_data");
    userData = JSON.parse(user_data);
    document.getElementById("my-avatar").src = userData.avatar;

    if(userData.status==="MANAGE"){
        let manage_nav = document.getElementById("manage-div");
        manage_nav.style.cursor="pointer";
        manage_nav.href="Manage.html";
        manage_nav.addEventListener('mouseover',function (){
            manage_nav.style.backgroundColor="rgb(0, 0, 0)";
        })
        manage_nav.addEventListener('mouseleave',function (){
            manage_nav.style.backgroundColor="rgb(51, 51, 51)";
        })
    }

    /*登录成功之后向后端发送请求，来得到数据库中的数据，填充页面*/
    axios.get('http://localhost:8080/Ly/user/selectCommunity', {
        params: {
            flag: "初始化界面"
        }
    }).then(function (response) {
        let communities = response.data.communities;
        let dynamics_list = document.getElementById("dynamics-list");

        dynamics_list.innerHTML=" ";
        for (let i = 0; i < communities.length; i++) {
            let dynamics_list_li = document.createElement('div');
            dynamics_list_li.className="dynamics-list-li";
            dynamics_list_li.innerHTML=`
                <div class="user_data">
                    <div class="avatar-div">
                        <img src=${communities[i].avatar} class="user_avatar">
                        <a href="http://localhost:8080/Ly/user.html?name=${communities[i].name}" class="avatar-a"></a>
                    </div>
                    <div class="name_and_time">
                        <span class="user_name">${communities[i].name}<span class="types">${communities[i].types}</span></span>
                        <span class="send_time">${communities[i].send_time}</span>
                    </div>
                </div>
                <span class="dynamic-text">${communities[i].text}</span>
            `;
            if(communities[i].song_id){
                axios.get('http://localhost:8080/Ly/song/selectById', {
                    params:{
                        id:communities[i].song_id
                    }
                }).then(function (response) {
                    let song = response.data.song;
                    let song_div = document.createElement("div");
                    song_div.className="dynamic-song";
                    song_div.title=song.id;
                    song_div.innerHTML=`
                        <img src=${song.img} class="song-img">
                        <div class="song-data">
                            <span class="song-name">${song.name}</span>
                            <span class="song-author">${song.author}</span>
                        </div>
                    `;
                    dynamics_list_li.appendChild(song_div);
                    song_div.addEventListener('click',function (){
                        let id=song_div.title;
                        var openedWindowId = localStorage.getItem("openedWindowId");
                        var openedWindow = openedWindowId ? window.open("", openedWindowId) : null;

                        if (openedWindow === null || openedWindow.closed) {

                            openedWindow = window.open(
                                "http://localhost:8080/Ly/PlaySong.html?song=" + id,
                                "音乐播放"
                            );
                            openedWindowId = openedWindow.name; // 使用窗口的名称作为标识符
                            console.log(openedWindowId);
                            console.log("第一次打开播放列表");
                        } else {
                            openedWindow.close(); // 关闭之前的窗口

                            openedWindow = window.open(
                                "http://localhost:8080/Ly/PlaySong.html?song=" + id,
                                "音乐播放"
                            );
                            openedWindowId = openedWindow.name; // 使用窗口的名称作为标识符
                            console.log(openedWindowId);
                            console.log("在一个新的窗口打开播放列表");
                        }
                        localStorage.setItem("openedWindowId", openedWindowId); // 存储窗口标识符到本地存储
                    })
                }).catch(function (error) {
                    console.log(error);
                });
            }

            if(communities[i].playliat_id){
                axios.get('http://localhost:8080/Ly/playlist/selectPlaylist_id', {
                    params:{
                        id:communities[i].playliat_id
                    }
                }).then(function (response) {
                    let playlist = response.data.playlist;
                    let song_div = document.createElement("div");
                    song_div.className="dynamic-song";
                    song_div.title=playlist.id;
                    song_div.innerHTML=`
                        <img src=${playlist.img} class="song-img">
                        <div class="song-data">
                            <span class="song-name">${playlist.name}</span>
                            <span class="song-author">${playlist.author}</span>
                        </div>
                    `;
                    dynamics_list_li.appendChild(song_div);
                    song_div.addEventListener('click',function (){
                        window.open("http://localhost:8080/Ly/PlaylistSong.html?id=" + playlist.id);
                    })
                }).catch(function (error) {
                    console.log(error);
                });
            }

            if(communities[i].singer_name){
                axios.get('http://localhost:8080/Ly/user/selectByName', {
                    params:{
                        name:communities[i].singer_name
                    }
                }).then(function (response) {
                    let user = response.data.user;
                    let song_div = document.createElement("div");
                    song_div.className="dynamic-song";
                    song_div.title=song.id;
                    song_div.innerHTML=`
                        <img src=${user.avatar} class="song-img">
                        <div class="song-data">
                            <span class="song-name">${user.username}</span>
                        </div>
                    `;
                    dynamics_list_li.appendChild(song_div);
                    song_div.addEventListener('click',function (){
                        window.open("http://localhost:8080/Ly/user.html?name=" + user.username);
                    })
                }).catch(function (error) {
                    console.log(error);
                });
            }

            if(communities[i].img){
                const regex = /\[(.*?)\]/g;
                const matches = communities[i].img.match(regex);
                let imgs;
                if(matches){
                    imgs = matches.map(match => match.slice(1, -1));
                }
                let dynamic_img = document.createElement('div');
                dynamic_img.className="dynamic-img";
                for (let j = 0; j < imgs.length; j++) {
                    let img_list = document.createElement('img');
                    img_list.className="photo";
                    img_list.src=imgs[j];
                    dynamic_img.appendChild(img_list);
                    dynamics_list_li.appendChild(dynamic_img);
                    img_list.addEventListener("click",function (){
                        if(img_list.width===150){
                            img_list.style.width="200px";
                            img_list.style.height="200px";
                        }else{
                            img_list.style.width="150px";
                            img_list.style.height="150px";
                        }
                    })
                }
            }

            dynamics_list.appendChild(dynamics_list_li);
        }
    }).catch(function (error) {
        console.dir(error);
    });
};




/*头像悬停事件*/
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


/*
* 浮窗
* */

var floatingWindow = document.querySelector('#floating-window');
var isDragging = false;
var offset = { x: 0, y: 0 };

floatingWindow.addEventListener('mousedown', function(event) {
    isDragging = true;
    offset.x = event.clientX - floatingWindow.offsetLeft;
    offset.y = event.clientY - floatingWindow.offsetTop;
});

document.addEventListener('mousemove', function(event) {
    if (isDragging) {
        floatingWindow.style.left = (event.clientX - offset.x) + 'px';
        floatingWindow.style.top = (event.clientY - offset.y) + 'px';
    }
});

document.addEventListener('mouseup', function() {
    isDragging = false;
});
/*
* 发布动态
* */
document.getElementById("send-dynamics-button").addEventListener('click',function (){
    document.getElementById("floating-window").style.display="block";
    document.getElementById("choose-img-list").innerHTML=" ";
    document.getElementById("choose-img-list").style.display="none";
    document.getElementById("text").value='';
    document.getElementById("choose-song").innerHTML=`
        <img src="img/newPlaylist.png">
        <p>给动态配上音乐</p>
    `;

})
document.getElementById("close").addEventListener('click',function (){
    document.getElementById("floating-window").style.display="none";
})
document.getElementById("img-button").addEventListener("click",function (){
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
                    document.getElementById("choose-img-list").style.display="flex";
                    let img_li = document.createElement('img');
                    img_li.className="choose-img";
                    img_li.src=filename;
                    document.getElementById("choose-img-list").appendChild(img_li);
                    console.log(filename);
                })
                .catch(function (error) {
                    console.log(error);
                });
        }
    });

// 模拟点击文件选择器的 input 元素
    input.click();
})