const slider = document.querySelector('.slider');
const sliderContent = document.querySelector('.slider-content');
const sliderItems = document.querySelectorAll('.slider-item');
let userData;//用户数据
let songId;//右击选择到的歌曲id

// 在页面加载后执行判断
window.onload = function () {
    userData = JSON.parse(localStorage.getItem("user_data"));
    let Avatar = userData.avatar;
    let Uname = userData.username;
    let Signature = userData.signature;
    let Mailbox = userData.mailbox;

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

    /*初始化右击选项框*/
    let myPlaylists = JSON.parse(localStorage.getItem("playlists"));
    let MyPlaylist = document.getElementById("My-playlist");
    for (let i = 0; i < myPlaylists.length; i++) {
        let playlist_options = document.createElement("span");
        playlist_options.className = "playlist-Options"
        playlist_options.title = myPlaylists[i].id;
        playlist_options.innerHTML = myPlaylists[i].name;
        MyPlaylist.appendChild(playlist_options);
        /*
        * 写点击事件
        * */
        playlist_options.addEventListener('click', function () {
            axios.get('http://localhost:8080/Ly/playlist/addSong_to_playlist', {
                params: {
                    song_id: songId,
                    list_id: myPlaylists[i].id
                }
            }).then(function (response) {
                let flag = response.data.flag;
                if (flag === 1) {
                    //添加成功
                    var successPopup = document.createElement('div');
                    successPopup.innerHTML = "添加成功";
                    successPopup.style.position = "fixed";
                    successPopup.style.top = "20%";
                    successPopup.style.left = "50%";
                    successPopup.style.transform = "translate(-50%, -50%)";
                    successPopup.style.background = "lightgreen";
                    successPopup.style.padding = "10px";
                    successPopup.style.borderRadius = "5px";
                    successPopup.style.zIndex = "999";
                    document.body.appendChild(successPopup);
                    // 1秒后自动关闭弹窗
                    setTimeout(function () {
                        document.body.removeChild(successPopup);
                    }, 1000);
                } else {
                    var successPopup = document.createElement('div');
                    successPopup.innerHTML = "该歌曲已存在";
                    successPopup.style.position = "fixed";
                    successPopup.style.top = "20%";
                    successPopup.style.left = "50%";
                    successPopup.style.transform = "translate(-50%, -50%)";
                    successPopup.style.background = "lightgreen";
                    successPopup.style.padding = "10px";
                    successPopup.style.borderRadius = "5px";
                    successPopup.style.zIndex = "999";
                    document.body.appendChild(successPopup);
                    // 1秒后自动关闭弹窗
                    setTimeout(function () {
                        document.body.removeChild(successPopup);
                    }, 1000);
                }
            }).catch(function (error) {
                console.log(error);
            });
            document.getElementById("playlist-list").style.display = "none";
        })

    }
    document.getElementById("my-avatar").src = Avatar;
    document.getElementById("change-img").src = Avatar;
    document.getElementById("change-name").value = Uname;
    document.getElementById("signature").value = Signature;

    /*登录成功之后向后端发送请求，来得到数据库中的数据，填充页面*/
    console.log(11111);
    timeRanking();
};
function timeRanking(){
    setTimeout(function (){
        document.getElementById("hot-song-ranking").style.backgroundColor="rgb(249, 249, 249)"
        document.getElementById("new-song-ranking").style.backgroundColor="rgb(230, 230, 230)"
        document.getElementById("ranking-name").textContent="新歌榜";
        document.getElementById("ranking-img").src="img/新歌榜.jpg";
    },0)
    axios.get('http://localhost:8080/Ly/song/rankingTime', {
        params: {
            flag: "初始化界面"
        }
    }).then(function (response) {
        let songs = response.data.songs;
        newSongRanking(songs);
    }).catch(function (error) {
        console.dir(error);
    });
}
function hotRanking(){
    setTimeout(function (){
        document.getElementById("hot-song-ranking").style.backgroundColor="rgb(230, 230, 230)"
        document.getElementById("new-song-ranking").style.backgroundColor="rgb(249, 249, 249)"
        document.getElementById("ranking-name").textContent="热歌榜";
        document.getElementById("ranking-img").src="img/热歌榜.jpg";
    },0)
    axios.get('http://localhost:8080/Ly/song/hotSongRanking', {
        params: {
            flag: "初始化界面"
        }
    }).then(function (response) {
        let songs = response.data.songs;
        newSongRanking(songs);
    }).catch(function (error) {
        console.dir(error);
    });
}


function newSongRanking(songs){
    let song_list = document.getElementById("song-list");
    song_list.innerHTML=" ";
    for (let i = 0; i < songs.length; i++) {
        let song_list_li = document.createElement('li');
        song_list_li.className="song";
        song_list_li.title=songs[i].id;
        song_list_li.innerHTML=`
                <div class="ranking">
                    ${i+1}
                </div>
                <div class="song-img-div">
                    <img src=${songs[i].img} class="song-img">
                </div>
                <div class="song-name-div">
                    <a  class="song-name">${songs[i].name}</a>
                </div>
                <div class="song-author-div">
                    <a  class="song-author">${songs[i].author}</a>
                </div>
                <div class="song-time-div">
                    <a class="song-time">${songs[i].time}</a>
                </div>
            `;

        /*
        * ——————————————————————————————————————————————————————————————————————————————————————————————————————————
        * 右击事件
        * */
        // 绑定右击事件处理程序到歌曲元素
        var currentContextMenu = null;
        song_list_li.addEventListener("contextmenu", function (event) {
            event.preventDefault();
            // 获取歌曲的相关信息
            songId = this.title;
            // 执行右击事件的处理逻辑
            console.log("右击歌曲" + "ID：" + songId);
            // 其他处理逻辑...
            if (currentContextMenu) {
                document.body.removeChild(currentContextMenu);
            }
            var contextMenu = document.createElement("div");
            contextMenu.className = "context-menu";
            contextMenu.style.top = event.clientY + "px";
            contextMenu.style.left = event.clientX + "px";

            var option2 = document.createElement("div");
            option2.innerHTML = "添加至歌单";
            option2.className = "menu-option";
            option2.id="add-style-song";
            contextMenu.appendChild(option2);

            let playlist_list = document.getElementById("playlist-list");
            playlist_list.style.top = event.clientY + 20 + "px";
            playlist_list.style.left = event.clientX - 50 + "px";
            /*这里可以控制位置*/

            document.body.appendChild(contextMenu);
            currentContextMenu = contextMenu;

            option2.addEventListener("mouseover", function (event) {
                document.getElementById("playlist-list").style.display="flex";
            });
            option2.addEventListener("mouseleave", function (event) {
                document.getElementById("playlist-list").style.display="none";
            });
            document.addEventListener("click", function () {
                document.body.removeChild(contextMenu);
                currentContextMenu = null;
            }, {once: true});
        });

        song_list.appendChild(song_list_li);
    }
}









document.getElementById("playlist-list").addEventListener("mouseover", function (event) {
    document.getElementById("playlist-list").style.display = "flex";
});
document.getElementById("playlist-list").addEventListener("mouseleave", function (event) {
    document.getElementById("playlist-list").style.display = "none";
});

document.getElementById("MyLike").addEventListener('click', function () {
    document.getElementById("playlist-list").style.display = "none";
    //将该歌曲添加到我喜欢
    axios.get('http://localhost:8080/Ly/playlist/addSong_to_like', {
        params: {
            mailbox: userData.mailbox,
            song_id: songId
        }
    }).then(function (response) {
        let flag = response.data.flag;
        if (flag === 1) {
            //添加成功
            var successPopup = document.createElement('div');
            successPopup.innerHTML = "添加成功";
            successPopup.style.position = "fixed";
            successPopup.style.top = "20%";
            successPopup.style.left = "50%";
            successPopup.style.transform = "translate(-50%, -50%)";
            successPopup.style.background = "lightgreen";
            successPopup.style.padding = "10px";
            successPopup.style.borderRadius = "5px";
            successPopup.style.zIndex = "999";
            document.body.appendChild(successPopup);
            // 1秒后自动关闭弹窗
            setTimeout(function () {
                document.body.removeChild(successPopup);
            }, 1000);
        } else {
            var successPopup = document.createElement('div');
            successPopup.innerHTML = "该歌曲已存在";
            successPopup.style.position = "fixed";
            successPopup.style.top = "20%";
            successPopup.style.left = "50%";
            successPopup.style.transform = "translate(-50%, -50%)";
            successPopup.style.background = "lightgreen";
            successPopup.style.padding = "10px";
            successPopup.style.borderRadius = "5px";
            successPopup.style.zIndex = "999";
            document.body.appendChild(successPopup);
            // 1秒后自动关闭弹窗
            setTimeout(function () {
                document.body.removeChild(successPopup);
            }, 1000);
        }
    }).catch(function (error) {
        console.log(error);
    });
})

let song_list = document.getElementById("song-list");
let id;
song_list.addEventListener('dblclick', function (e) {
    var liElement = findClosestParentLiElement(e.target);
    if (liElement) {
        id = liElement.getAttribute('title');
    }

// 尝试从本地存储中获取openedWindow的状态
    var openedWindowId = localStorage.getItem("openedWindowId");
    var openedWindow = openedWindowId ? window.open("", openedWindowId) : null;

    if (openedWindow === null || openedWindow.closed) {
        setCookie("song_id", song_id, 60 * 60 * 24 * 7);
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
});


/*获取最近的父级元素*/
function findClosestParentLiElement(element) {
    var parentElement = element.parentNode;
    while (parentElement) {
        if (parentElement.tagName === 'LI') {
            return parentElement;
        }
        parentElement = parentElement.parentNode;
    }
    return null;
}



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

































