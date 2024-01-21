let songs;//该用户喜欢的歌曲
let myPlaylists;//该创建的歌单列表
let collectionPlaylists;//该用户收藏的歌单
let mySongs;//该用户上传的歌曲
let userData;//该用户的数据
let fans;//该用户的粉丝
let concerns;//该用户的关注
let myFans;//我的粉丝
let myConcerns;//我的关注
let className="关注";//刚开始的状态到底是关注还是没关注

let My_create = document.getElementById("My-create-playlist");
let MyLike = document.getElementById("MyLike-nav");
// 在页面加载后执行判断
let Uname;
let mailbox;
let id;//这是当前选择的歌曲的id
let songId;
window.onload = function () {
    // 获取 URL 查询参数
    const queryParams = new URLSearchParams(window.location.search);
// 获取 playlist 属性值
    const playlist = queryParams.get("playlist");
    let name = queryParams.get("name");
    axios.get('http://localhost:8080/Ly/user/selectAllData', {
        params: {
            uname: name
        }
    }).then(function (response) {
        console.log(response.data)
        userData = response.data.user;
        myPlaylists = response.data.playlists;
        collectionPlaylists = response.data.collectionPlaylists;
        songs = response.data.songs;
        fans = response.data.fans;
        concerns = response.data.concerns;
        mySongs = response.data.mySongs;
        myFans = JSON.parse(localStorage.getItem("fans"));
        myConcerns = JSON.parse(localStorage.getItem("concerns"));

        if(userData.status==="SINGER"){
            document.getElementById("MySong").style.display="flex";
            document.getElementById("singer-flag").style.display="flex";
        }

        let book=0;
        for (let i = 0; i < myConcerns.length; i++) {
            if(myConcerns[i].mailbox===userData.mailbox){
                book=1;//1表示这个人是你的关注
                className="已关注";
                let flag_i = document.getElementById("concern-flag");
                let concern_button = document.getElementById("concern-button");
                flag_i.className="fa-solid fa-check";
                concern_button.textContent="已关注";
            }
        }


        document.getElementById("playlist_number").textContent = "歌单 " + collectionPlaylists.length;
        let MyPlaylist = document.getElementById("My-playlist");

        let Playlists = JSON.parse(localStorage.getItem("playlists"));

        for (let i = 0; i < Playlists.length; i++) {
            let playlist_options = document.createElement("span");
            playlist_options.className = "playlist-Options"
            playlist_options.title = Playlists[i].id;
            playlist_options.innerHTML = Playlists[i].name;
            MyPlaylist.appendChild(playlist_options);
            /*
            * 写点击事件
            * */
            playlist_options.addEventListener('click', function () {
                axios.get('http://localhost:8080/Ly/playlist/addSong_to_playlist', {
                    params: {
                        song_id: songId,
                        list_id: Playlists[i].id
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

        }/*我创建的歌单*/
        let recommend_list = document.getElementById("recommend-list-collection");
        recommend_list.innerHTML = " ";
        for (let i = 0; i < collectionPlaylists.length; i++) {
            let recommend_list_li = document.createElement('li');
            recommend_list_li.className = "recommend-list-li";
            recommend_list_li.innerHTML = `
                <div class="recommend-cnt">
                <img src=${collectionPlaylists[i].img} class="playlist-img">
                    <a href="PlaylistSong.html?id=${collectionPlaylists[i].id}" title=${collectionPlaylists[i].name} 
                      class="img-msk"></a>
                </div>
                <p class="dec">
                    <a title=${collectionPlaylists[i].name} class="dec-msk"
                       href="PlaylistSong.html?id=${collectionPlaylists[i].id}">${collectionPlaylists[i].name} </a>
                </p>
            `;
            recommend_list.appendChild(recommend_list_li);
        }/*我收藏的歌单*/

        let Avatar = userData.avatar;
        mailbox = userData.mailbox;
        Uname = userData.username;
        for (const avatar of document.getElementsByClassName("avatar-img")) {
            avatar.src = Avatar;
        }
        for (const uname of document.getElementsByClassName("name")) {
            uname.textContent = Uname;
        }
        document.getElementById("my-avatar").src = Avatar;
        document.getElementById("fans").textContent = fans.length;
        document.getElementById("concern").textContent = concerns.length;
        /*登录成功之后向后端发送请求，来得到数据库中的数据，填充页面*/

        songs = response.data.songs;
        document.getElementById("song_number").textContent = "歌曲 " + songs.length;
        console.log(songs);
        let song_list = document.getElementById("song-list");
        song_list.innerHTML = " ";//清空
        for (let i = 0; i < songs.length; i++) {
            let song_list_li = document.createElement('li');
            song_list_li.className = "song";
            song_list_li.title = songs[i].id;
            song_list_li.innerHTML = `
                    <div class="song-ing-div">
                        <img src=${songs[i].img} class="song-img">
                    </div>
                    <div class="song-name-div">
                        <a  class="song-name">${songs[i].name}</a>
                    </div>
                    <div class="song-author-div">
                        <a  class="song-author">${songs[i].author}</a>
                    </div>
                    <div class="song-album-div">
                        <a  class="song-album">${songs[i].album}</a>
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
                option2.id = "add-style-song";
                contextMenu.appendChild(option2);

                let playlist_list = document.getElementById("playlist-list");
                playlist_list.style.top = event.clientY + 20 + "px";
                playlist_list.style.left = event.clientX - 50 + "px";
                /*这里可以控制位置*/

                document.body.appendChild(contextMenu);
                currentContextMenu = contextMenu;

                option2.addEventListener("mouseover", function (event) {
                    document.getElementById("playlist-list").style.display = "flex";
                });
                option2.addEventListener("mouseleave", function (event) {
                    document.getElementById("playlist-list").style.display = "none";
                });
                document.addEventListener("click", function () {
                    document.body.removeChild(contextMenu);
                    currentContextMenu = null;
                }, {once: true});
            });

            song_list.appendChild(song_list_li);
        }

        mySongs = response.data.mySongs;
        document.getElementById("MySong").textContent = "我上传的歌曲 " + mySongs.length;
        let mySong_list = document.getElementById("mySong-list");
        mySong_list.innerHTML = " ";//清空
        for (let i = 0; i < mySongs.length; i++) {
            let song_list_li = document.createElement('li');
            song_list_li.className = "song";
            song_list_li.title = mySongs[i].id;
            song_list_li.innerHTML = `
                    <div class="song-ing-div">
                        <img src=${mySongs[i].img} class="song-img">
                    </div>
                    <div class="song-name-div">
                        <a  class="song-name">${mySongs[i].name}</a>
                    </div>
                    <div class="song-author-div">
                        <a  class="song-author">${mySongs[i].author}</a>
                    </div>
                    <div class="song-album-div">
                        <a  class="song-album">${mySongs[i].album}</a>
                    </div>
                    <div class="song-time-div">
                        <a class="song-time">${mySongs[i].time}</a>
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
                option2.id = "add-style-song";
                contextMenu.appendChild(option2);

                let playlist_list = document.getElementById("playlist-list");
                playlist_list.style.top = event.clientY + 20 + "px";
                playlist_list.style.left = event.clientX - 50 + "px";
                /*这里可以控制位置*/

                document.body.appendChild(contextMenu);
                currentContextMenu = contextMenu;

                option2.addEventListener("mouseover", function (event) {
                    document.getElementById("playlist-list").style.display = "flex";
                });
                option2.addEventListener("mouseleave", function (event) {
                    document.getElementById("playlist-list").style.display = "none";
                });
                document.addEventListener("click", function () {
                    document.body.removeChild(contextMenu);
                    currentContextMenu = null;
                }, {once: true});
            });

            mySong_list.appendChild(song_list_li);
        }

    }).catch(function (error) {
        console.log(error);
    });
};

document.getElementById("playlist-list").addEventListener("mouseover", function (event) {
    document.getElementById("playlist-list").style.display = "flex";
});
document.getElementById("playlist-list").addEventListener("mouseleave", function (event) {
    document.getElementById("playlist-list").style.display = "none";
});




document.getElementById("MyLike").addEventListener('click', function () {
    let myData = JSON.parse(localStorage.getItem("user_data"));
    let playlists = JSON.parse(localStorage.getItem("playlists"));

    document.getElementById("playlist-list").style.display = "none";
    //将该歌曲添加到我喜欢
    axios.get('http://localhost:8080/Ly/playlist/addSong_to_like', {
        params: {
            mailbox: myData.mailbox,
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










/*导航栏*/
My_create.addEventListener("click", function () {
    //将前面的颜色消除
    document.getElementById("recommend-list-collection").style.display = "none";
    MyLike.style.color = "rgb(255,255,255)";
    MyLike.href = "user.html?name="+Uname;
    My_create.style.color = "rgb(49, 194, 124)";
    let main_body = document.getElementById("content");
    main_body.innerHTML = `
        <div class="song-list-div">
            <div class="list-button">
            </div>
        </div>
    `;

    let list = document.createElement("ul");
    list.className = "recommend-list";
    list.id = "recommend-list";
    for (let i = 0; i < myPlaylists.length; i++) {
        let li = document.createElement('li');
        li.className = "recommend-list-li";
        li.innerHTML = `
                <div class="recommend-cnt">
                <img src=${myPlaylists[i].img} class="playlist-img">
                    <a href="PlaylistSong.html?id=${myPlaylists[i].id}" title=${myPlaylists[i].name} 
                      class="img-msk"></a>
                </div>
                <p class="dec">
                    <a title=${myPlaylists[i].name} class="dec-msk"
                       href="PlaylistSong.html?id=${myPlaylists[i].id}">${myPlaylists[i].name} </a>
                </p>
            `;
        list.appendChild(li);
    }
    main_body.appendChild(list);
})
/*我收藏的歌单*/
/*我收藏的歌单*/
document.getElementById("playlist_number").addEventListener("click",function (){
    /*变成我收藏的歌单的界面*/
    setTimeout(function (){
        document.getElementById("song-list-div").style.display='none';
        document.getElementById("song_number").style.color="rgb(51, 51, 51)";
        document.getElementById("MySong").style.color="rgb(51, 51, 51)";
        document.getElementById("playlist_number").style.color="rgb(49, 194, 124)";
        document.getElementById("recommend-list-collection").style.display="flex";
    },0)
})
/*我喜欢的音乐*/
document.getElementById("song_number").addEventListener("click",function (){
    /*变成我喜欢的音乐的界面*/
    setTimeout(function (){
        document.getElementById("recommend-list-collection").style.display="none";
        document.getElementById("playlist_number").style.color="rgb(51, 51, 51)";
        document.getElementById("MySong").style.color="rgb(51, 51, 51)";
        document.getElementById("song_number").style.color="rgb(49, 194, 124)";
        document.getElementById("song-list-div").style.display='block';
        document.getElementById("mySong-list").style.display='none';
        document.getElementById("song-list").style.display='block';
    },0)
})
document.getElementById("MySong").addEventListener("click",function (){
    setTimeout(function (){
        document.getElementById("recommend-list-collection").style.display="none";
        document.getElementById("playlist_number").style.color="rgb(51, 51, 51)";
        document.getElementById("song_number").style.color="rgb(51, 51, 51)";
        document.getElementById("MySong").style.color="rgb(49, 194, 124)";
        document.getElementById("song-list-div").style.display='block';
        document.getElementById("mySong-list").style.display='block';
        document.getElementById("song-list").style.display='none';
    },0)
})

let MyData = JSON.parse(localStorage.getItem("user_data"));//我的个人资料

document.getElementById("play-all-song").addEventListener("click", function (e) {
    var liElement = findClosestParentLiElement(e.target);
    if (liElement) {
        id = liElement.getAttribute('title');
    }

// 尝试从本地存储中获取openedWindow的状态
    var openedWindowId = localStorage.getItem("openedWindowId");
    var openedWindow = openedWindowId ? window.open("", openedWindowId) : null;

    if (openedWindow === null || openedWindow.closed) {

        openedWindow = window.open(
            "http://localhost:8080/Ly/PlaySong.html?playlist=" + MyData.mailbox,
            "音乐播放"
        );
        openedWindowId = openedWindow.name; // 使用窗口的名称作为标识符
        console.log(openedWindowId);
        console.log("第一次打开播放列表");
    } else {
        openedWindow.close(); // 关闭之前的窗口

        openedWindow = window.open(
            "http://localhost:8080/Ly/PlaySong.html?playlist=" + MyData.mailbox,
            "音乐播放"
        );
        openedWindowId = openedWindow.name; // 使用窗口的名称作为标识符
        console.log(openedWindowId);
        console.log("在一个新的窗口打开播放列表");
    }

    localStorage.setItem("openedWindowId", openedWindowId); // 存储窗口标识符到本地存储
})


var prevLiElement = null; // 用于存储之前被点击的 <li> 元素
/*var openedWindow;*/
document.getElementById("song-list").addEventListener('dblclick', function (e) {
    var liElement = findClosestParentLiElement(e.target);
    if (liElement) {
        id = liElement.getAttribute('title');
    }

// 尝试从本地存储中获取openedWindow的状态
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
});
document.getElementById("mySong-list").addEventListener('dblclick', function (e) {
    var liElement = findClosestParentLiElement(e.target);
    if (liElement) {
        id = liElement.getAttribute('title');
    }

// 尝试从本地存储中获取openedWindow的状态
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


/*
* 关注
* */




let timerId; // 用于存储计时器的ID
const delay = 1000; // 定时器的延迟时间（1秒）
let flag = 0;
function startTimer() {
    clearTimeout(timerId); // 清除之前的计时器
    // 开始新的计时器
    let flag_i = document.getElementById("concern-flag");
    let concern_button = document.getElementById("concern-button");
    if(concern_button.textContent==="关注"){
        flag_i.className="fa-solid fa-check";
        concern_button.textContent="已关注";
        flag=1; //  1表示关注这个人
        if(className==="已关注"){
            flag=0;
        }
    }else{
        flag_i.className="fa-solid fa-plus";
        concern_button.textContent="关注";
        flag=-1;//  -1表示取消关注
        if(className==="关注"){
            flag=0;
        }
    }
    timerId = setTimeout(() => {
        // 在定时器结束时执行的代码
        axios.get('http://localhost:8080/Ly/user/concern', {
            params:{
                user:userData.mailbox,
                fans:MyData.mailbox,
                flag:flag
            }
        }).then(function (response) {
            if(flag===1){
                //关注成功，你的关注列表要加入一个人
                myConcerns.push(userData);
                className="已关注";
            }else if(flag===-1){
                className="关注";
                //删除成功，你的关注列表要少一个人
                for (let i = 0; i < myConcerns.length; i++) {
                    if(myConcerns[i].mailbox===userData.mailbox){
                        myConcerns.splice(i,1);
                        break;
                    }
                }
            }
            localStorage.setItem('concerns', JSON.stringify(myConcerns));
        }).catch(function (error) {
            console.log(error);
        });
    }, delay);

}

// 在按钮点击事件中调用 startTimer() 函数
document.getElementById("concern-div").addEventListener('click', startTimer);















