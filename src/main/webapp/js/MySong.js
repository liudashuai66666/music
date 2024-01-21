let songs;//我喜欢的歌曲
let mySongs;//我上传的歌曲
let myPlaylists;//我创建的歌单列表
let fans;//我的粉丝
let concerns;//我的关注
let MyLike = document.getElementById("MyLike-nav");
let My_create = document.getElementById("My-create-playlist");

// 在页面加载后执行判断
let userData = JSON.parse(localStorage.getItem("user_data"));
let Uname;
let mailbox;
let id;//这是当前选择的歌曲的id
let songId;
let collectionPlaylists;//我收藏的歌单
window.onload = function () {

    if(userData.status==="SINGER"){
        document.getElementById("MySong").style.display="flex";
        document.getElementById("concern-div").style.display="flex";
    }
    if(userData.status==="USER"){
        document.getElementById("singer-div").style.display="flex"
    }
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
    let user_data = localStorage.getItem("user_data");
    myPlaylists = JSON.parse(localStorage.getItem("playlists"));
    fans = JSON.parse(localStorage.getItem("fans"));
    concerns = JSON.parse(localStorage.getItem("concerns"));
    collectionPlaylists = JSON.parse(localStorage.getItem("collectionPlaylists"));
    document.getElementById("playlist_number").textContent="歌单 "+collectionPlaylists.length;

    let MyPlaylist = document.getElementById("My-playlist");
    for (let i = 0; i < myPlaylists.length; i++) {
        let playlist_options = document.createElement("span");
        playlist_options.className="playlist-Options"
        playlist_options.title=myPlaylists[i].id;
        playlist_options.innerHTML=myPlaylists[i].name;
        MyPlaylist.appendChild(playlist_options);
        /*
        * 写点击事件
        * */
        playlist_options.addEventListener('click',function (){
            axios.get('http://localhost:8080/Ly/playlist/addSong_to_playlist', {
                params:{
                    song_id:songId,
                    list_id:myPlaylists[i].id
                }
            }).then(function (response) {
                let flag = response.data.flag;
                if(flag===1){
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
                    setTimeout(function() {
                        document.body.removeChild(successPopup);
                    }, 1000);
                }else{
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
                    setTimeout(function() {
                        document.body.removeChild(successPopup);
                    }, 1000);
                }
            }).catch(function (error) {
                console.log(error);
            });
            document.getElementById("playlist-list").style.display="none";
        })

    }/*我创建的歌单*/
    let recommend_list = document.getElementById("recommend-list-collection");
    recommend_list.innerHTML=" ";
    for (let i = 0; i < collectionPlaylists.length; i++) {
        let recommend_list_li = document.createElement('li');
        recommend_list_li.className="recommend-list-li";
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


    userData = JSON.parse(user_data);
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
    axios.get('http://localhost:8080/Ly/song/selectLike', {
        params: {
            mailbox: mailbox
        }
    }).then(function (response) {
        console.log("初始化界面成功");
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

                var option1 = document.createElement("div");
                option1.innerHTML = "从我喜欢移除";
                option1.className = "menu-option";
                contextMenu.appendChild(option1);

                var option2 = document.createElement("div");
                option2.innerHTML = "添加至歌单";
                option2.className = "menu-option";
                option2.id="add-style-song";
                contextMenu.appendChild(option2);

                let playlist_list = document.getElementById("playlist-list");
                playlist_list.style.top = event.clientY+ 40 + "px";
                playlist_list.style.left = event.clientX-50 + "px";
                /*这里可以控制位置*/

                document.body.appendChild(contextMenu);
                currentContextMenu = contextMenu;

                option1.addEventListener("click", function () {
                    console.log(songId);
                    /*从我喜欢删除*/
                    axios.get('http://localhost:8080/Ly/playlist/delete_likeSong', {
                        params:{
                            mailbox: mailbox,
                            songId:songId
                        }
                    }).then(function (response) {
                        songs.splice(i,1);
                        let likeSong_li = document.getElementsByClassName("song");
                        var elementToRemove = likeSong_li[i];
                        elementToRemove.parentNode.removeChild(elementToRemove);
                    }).catch(function (error) {
                        console.log(error);
                    });
                });

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
    }).catch(function (error) {
        console.dir(error);
    });

    /*
    * 我上传的歌曲界面
    * */
    axios.get('http://localhost:8080/Ly/song/selectMySong', {
        params:{
            uname: userData.username
        }
    }).then(function (response) {
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
                        <a  class="song-album">${mySongs[i].state}</a>
                    </div>
                    <div class="song-time-div">
                        <a class="song-time">${mySongs[i].time}</a>
                    </div>
            `;
            mySong_list.appendChild(song_list_li);
        }
    }).catch(function (error) {
        console.log(error);
    });




};



document.getElementById("playlist-list").addEventListener("mouseover", function (event) {
    document.getElementById("playlist-list").style.display="flex";
});
document.getElementById("playlist-list").addEventListener("mouseleave", function (event) {
    document.getElementById("playlist-list").style.display="none";
});


/*导航栏*/
My_create.addEventListener("click", function () {
    //将前面的颜色消除
    setTimeout(function (){
        My_create.style.color="rgb(49, 194, 124)"
        document.getElementById("recommend-list-collection").style.display="none";
        document.getElementById("My-fans-button").style.color = "rgb(255, 255, 255)";
        document.getElementById("content").style.display = "block";
        document.getElementById("concern-main").style.display="none"
        document.getElementById("MyLike-nav").style.color = "rgb(255, 255, 255)";
        document.getElementById("My-concern-button").style.color = "rgb(255, 255, 255)";
    },0)
    let main_body = document.getElementById("content");
    main_body.innerHTML = `
        <div class="song-list-div">
            <div class="list-button">
                <a class="button" id="create-playlist-button">新建歌单</a>
            </div>
        </div>
    `;
    document.getElementById("create-playlist-button").addEventListener("click", function () {
        document.getElementById("create-playlist-div").style.display = "flex";
        document.getElementById("playlist-img").src = "img/newPlaylist.png";
    })
    let list = document.createElement("ul");
    list.className = "recommend-list";
    list.id = "recommend-list";
    axios.get('http://localhost:8080/Ly/playlist/selectByAuthor', {
        params: {
            author: userData.username
        }
    }).then(function (response) {
        myPlaylists = response.data.playlists;
        console.log(myPlaylists);
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
    }).catch(function (error) {
        console.log(error);
    });
    main_body.appendChild(list);
})
/*我收藏的歌单*/
document.getElementById("playlist_number").addEventListener("click",function (){
    /*变成我收藏的歌单的界面*/
    setTimeout(function (){
        document.getElementById("song-list-div").style.display='none';
        document.getElementById("song_number").style.color="rgb(51, 51, 51)";
        document.getElementById("MySong").style.color="rgb(51, 51, 51)";
        document.getElementById("playlist_number").style.color="rgb(49, 194, 124)";
        document.getElementById("recommend-list-collection").style.display="flex";
        document.getElementById("song-album-title").textContent="专辑";
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
        document.getElementById("song-album-title").textContent="专辑";
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
        document.getElementById("song-album-title").textContent="状态";
    },0)

    axios.get('http://localhost:8080/Ly/song/selectMySong', {
        params:{
            uname: userData.username
        }
    }).then(function (response) {
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
                        <a  class="song-album">${mySongs[i].state}</a>
                    </div>
                    <div class="song-time-div">
                        <a class="song-time">${mySongs[i].time}</a>
                    </div>
            `;
            mySong_list.appendChild(song_list_li);
        }
    }).catch(function (error) {
        console.log(error);
    });
})


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
            "http://localhost:8080/Ly/PlaySong.html?playlist=" + mailbox,
            "音乐播放"
        );
        openedWindowId = openedWindow.name; // 使用窗口的名称作为标识符
        console.log(openedWindowId);
        console.log("第一次打开播放列表");
    } else {
        openedWindow.close(); // 关闭之前的窗口

        openedWindow = window.open(
            "http://localhost:8080/Ly/PlaySong.html?playlist=" + mailbox,
            "音乐播放"
        );
        openedWindowId = openedWindow.name; // 使用窗口的名称作为标识符
        console.log(openedWindowId);
        console.log("在一个新的窗口打开播放列表");
    }

    localStorage.setItem("openedWindowId", openedWindowId); // 存储窗口标识符到本地存储
})


var prevLiElement = null; // 用于存储之前被点击的 <li> 元素
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
    axios.get('http://localhost:8080/Ly/song/selectById', {
        params:{
            id:id
        }
    }).then(function (response) {
        let song = response.data.song;
        if(song.state==="已发布"){
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

        }
    }).catch(function (error) {
        console.log(error);
    });
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
* ——————————————————————————————————————————————————————————————————————————————————————————————————————————————————————
* 创建歌单
* */
document.getElementById("playlist-img").addEventListener("click", function () {
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
            formData.append("img", file);

            // 发送 POST 请求进行文件上传
            axios.post('http://localhost:8080/Ly/playlist/changeImg', formData)
                .then(function (response) {
                    let avatar_name = response.data;
                    let filename = "img/playlist/" + avatar_name;
                    document.getElementById("playlist-img").src = filename;
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
document.getElementById("no-button").addEventListener("click", function () {
    document.getElementById("create-playlist-div").style.display = "none";
})

document.getElementById("ok-button").addEventListener("click", function () {
    let imgs = document.getElementById("playlist-img").src;
    var prefix = "http://localhost:8080/Ly/";
    let name = document.getElementById("playlist-name").value;
    let description = document.getElementById("playlist-description").value;
    var img = imgs.replace(prefix, "");
    axios.get('http://localhost:8080/Ly/playlist/createPlayliet', {
        params: {
            img: img,
            name: name,
            description: description,
            author: Uname
        }
    }).then(function (response) {
        let playlist = response.data.playlist;
        myPlaylists.push(playlist);
        document.getElementById("MySong").textContent = "我上传的歌曲 " + mySongs.length;
        localStorage.setItem('playlists', JSON.stringify(myPlaylists));
        let recommend_list = document.getElementById("recommend-list");
        recommend_list.innerHTML = " ";
        for (let i = 0; i < myPlaylists.length; i++) {
            let recommend_list_li = document.createElement('li');
            recommend_list_li.className = "recommend-list-li";
            recommend_list_li.innerHTML = `
                <div class="recommend-cnt">
                <img src=${myPlaylists[i].img} class="playlist-img">
                    <a href="PlaylistSong.html?id=${myPlaylists[i].id}" title=${myPlaylists[i].name} 
                      class="img-msk"></a>
                </div>
                <p class="dec">
                    <a title=${myPlaylists[i].name} class="dec-msk"
                       href="#">${myPlaylists[i].name} </a>
                </p>
            `;
            recommend_list.appendChild(recommend_list_li);
        }
    }).catch(function (error) {
        console.log(error);
    });
    setTimeout(function (){
        document.getElementById("create-playlist-div").style.display = "none";
    },0)
})


/*
* ——————————————————————————————————————————————————————————————————————————————————————————————————————————————————————
* 关注和粉丝点击按钮
* */
let My_concern_button = document.getElementById("My-concern-button");
let My_fans_button = document.getElementById("My-fans-button");
//关注
My_concern_button.addEventListener("click", function() {
    fans = JSON.parse(localStorage.getItem("fans"));
    concerns = JSON.parse(localStorage.getItem("concerns"));
    
    let concern_list = document.getElementById("concern-list");
    concern_list.innerHTML=" ";
    for (let i = 0; i < concerns.length; i++) {
        let concern_list_li = document.createElement("li");
        concern_list_li.className="concern-list-li";
        concern_list_li.innerHTML=`
            <div class="concern-cnt">
                <img src=${concerns[i].avatar} class="concern-user-img">
                <a href="http://localhost:8080/Ly/${concerns[i].status === 'SINGER' ? 'SingerHall.html' : 'user.html'}?name=${concerns[i].username}" title=${concerns[i].username}
                   class="img-msk" target="_blank"></a>
            </div>
            <p class="dec">
                <a title="假如能回到过去，你想做什么" class="concern-user-name"
                   href="http://localhost:8080/Ly/${concerns[i].status === 'SINGER' ? 'SingerHall.html' : 'user.html'}?name=${concerns[i].username}" target="_blank">${concerns[i].username}</a>
            </p>
        `;
        concern_list.appendChild(concern_list_li);
    }
    setTimeout(function() {
        document.getElementById("My-create-playlist").style.color = "rgb(255, 255, 255)";
        document.getElementById("MyLike-nav").style.color = "rgb(255, 255, 255)";
        document.getElementById("My-fans-button").style.color = "rgb(255, 255, 255)";
        document.getElementById("recommend-list-collection").style.display="none";
        document.getElementById("content").style.display="none";
    }, 0);
    My_concern_button.style.color="rgb(49, 194, 124)";
    document.getElementById("concern-main").style.display="block";
});


//粉丝
My_fans_button.addEventListener("click", function() {
    fans = JSON.parse(localStorage.getItem("fans"));
    concerns = JSON.parse(localStorage.getItem("concerns"));

    let concern_list = document.getElementById("concern-list");
    concern_list.innerHTML=" ";
    for (let i = 0; i < fans.length; i++) {
        let concern_list_li = document.createElement("li");
        concern_list_li.className="concern-list-li";
        concern_list_li.innerHTML=`
            <div class="concern-cnt">
                <img src=${fans[i].avatar} class="concern-user-img">
                <a href="http://localhost:8080/Ly/${fans[i].status === 'SINGER' ? 'SingerHall.html' : 'user.html'}?name=${fans[i].username}" title=${fans[i].username}
                   class="img-msk" target="_blank"></a>
            </div>
            <p class="dec">
                <a title="假如能回到过去，你想做什么" class="concern-user-name"
                   href="http://localhost:8080/Ly/${fans[i].status === 'SINGER' ? 'SingerHall.html' : 'user.html'}?name=${fans[i].username}" target="_blank">${fans[i].username}</a>
            </p>
        `;
        concern_list.appendChild(concern_list_li);
    }
    setTimeout(function() {
        document.getElementById("My-create-playlist").style.color = "rgb(255, 255, 255)";
        document.getElementById("MyLike-nav").style.color = "rgb(255, 255, 255)";
        document.getElementById("My-concern-button").style.color = "rgb(255, 255, 255)";
        document.getElementById("recommend-list-collection").style.display="none";
        document.getElementById("content").style.display="none";
    }, 0);
    My_fans_button.style.color="rgb(49, 194, 124)";
    document.getElementById("concern-main").style.display="block";
});
/*
* ——————————————————————————————————————————————————————————————————————————————————————————————————————————————————————
* */


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
* ——————————————————————————————————————————————————————————————————————————————————————————————————————————————————————
* 上传歌曲
* */
document.getElementById("concern-div").addEventListener("click",function (){
    document.getElementById("create-song-div").style.display="flex";
})

document.getElementById("song-img").addEventListener("click", function () {
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
            formData.append("img", file);
            // 发送 POST 请求进行文件上传
            axios.post('http://localhost:8080/Ly/song/changeImg', formData)
                .then(function (response) {
                    let avatar_name = response.data;
                    let filename = "img/song/" + avatar_name;
                    document.getElementById("song-img").src = filename;
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

document.getElementById("song-mp3-button").addEventListener("click", function () {
    // 创建文件选择器的 input 元素
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".mp3"; // 可选的文件类型

// 当文件选择器的值发生改变时触发上传文件的函数
    input.addEventListener("change", function (event) {
        const file = event.target.files[0]; // 获取第一个选定的文件
        if (file) {
            // 创建 FormData 对象
            const formData = new FormData();
            formData.append("mp3", file);
            // 发送 POST 请求进行文件上传
            axios.post('http://localhost:8080/Ly/song/setMp3', formData)
                .then(function (response) {
                    let filename = response.data;
                    document.getElementById("song-mp3").value = filename;
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

document.getElementById("song-lyrics-button").addEventListener("click", function () {
    // 创建文件选择器的 input 元素
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".lrc"; // 可选的文件类型

// 当文件选择器的值发生改变时触发上传文件的函数
    input.addEventListener("change", function (event) {
        const file = event.target.files[0]; // 获取第一个选定的文件
        if (file) {
            // 创建 FormData 对象
            const formData = new FormData();
            formData.append("歌词", file);
            // 发送 POST 请求进行文件上传
            axios.post('http://localhost:8080/Ly/song/setLyrics', formData)
                .then(function (response) {
                    let filename = response.data;
                    document.getElementById("song-lyrics").value = filename;
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

document.getElementById("no-button-song").addEventListener("click",function (){
    document.getElementById("create-song-div").style.display="none";
})

document.getElementById("ok-button-song").addEventListener("click",function (){
    var prefix = "http://localhost:8080/Ly/";
    let imgs = document.getElementById("song-img").src;
    let lyrics = document.getElementById("song-lyrics").value;//歌词
    let mp3 = document.getElementById("song-mp3").value;//歌曲文件
    let name = document.getElementById("song-name").value;//歌名
    let long_time;//歌曲时间
    console.log(11111);
    console.log(mp3);
    let href="mp3/"+mp3;
    const audio = new Audio(href); // 替换为你的歌曲文件路径
    audio.addEventListener('loadedmetadata', function() {
        // 获取音频文件的持续时间（以秒为单位）
        const duration = audio.duration;
        // 将持续时间转换为分钟和秒钟
        const minutes = Math.floor(duration / 60);
        const seconds = Math.floor(duration % 60);
        // 将分钟和秒钟格式化为"mm:ss"的形式
        long_time = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        console.log('歌曲路径:', audio.src);
        console.log('歌曲时长:', long_time);

        var img = imgs.replace(prefix, "");//图片
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, "0");
        const day = String(now.getDate()).padStart(2, "0");
        const hours = String(now.getHours()).padStart(2, "0");
        const minutes1 = String(now.getMinutes()).padStart(2, "0");
        const seconds1 = String(now.getSeconds()).padStart(2, "0");
        const time = `${year}-${month}-${day} ${hours}:${minutes1}:${seconds1}`;//创建时间

        let user = JSON.parse(localStorage.getItem("user_data"));

        axios.get('http://localhost:8080/Ly/song/createSong', {
            params: {
                img: img,
                name: name,
                lyrics: lyrics,
                mp3: mp3,
                createTime:time,
                time:long_time,
                author:user.username
            }
        }).then(function (response) {

            let song = response.data.song;
            mySongs.push(song);

            localStorage.setItem('mySongs', JSON.stringify(mySongs));
            let mySong_list = document.getElementById("mySong-list");
            let mySong_list_li = document.createElement('li');
            mySong_list_li.className="song";
            mySong_list_li.innerHTML=`
            <div class="song-ing-div">
                <img src= ${song.img} class="song-img">
            </div>
            <div class="song-name-div">
                <a  class="song-name">${song.name}</a>
            </div>
            <div class="song-author-div">
                <a  class="song-author">${song.author}</a>
            </div>
            <div class="song-album-div">
                <a  class="song-album">${song.state}</a>
            </div>
            <div class="song-time-div">
                <a class="song-time">${song.time}</a>
            </div>
        `;
            mySong_list.appendChild(mySong_list_li);
            console.log(song);
        }).catch(function (error) {
            console.log(error);
        });
        setTimeout(function (){
            document.getElementById("create-song-div").style.display = "none";
        },0)

    });
// 加载音频文件
    audio.load();

})

/*
* ——————————————————————————————————————————————————————————————————————————————————————————————————————————————————————
* */


/*
* ——————————————————————————————————————————————————————————————————————————————————————————————————————————————————————
* 成为歌手
* */
document.getElementById("singer-div").addEventListener("click",function (){
    document.getElementById("become-singer-div").style.display="flex";
})

document.getElementById("singer-song-img").addEventListener("click", function () {
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
            formData.append("img", file);
            // 发送 POST 请求进行文件上传
            axios.post('http://localhost:8080/Ly/song/changeImg', formData)
                .then(function (response) {
                    let avatar_name = response.data;
                    let filename = "img/song/" + avatar_name;
                    document.getElementById("singer-song-img").src = filename;
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

document.getElementById("singer-mp3-button").addEventListener("click", function () {
    // 创建文件选择器的 input 元素
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".mp3"; // 可选的文件类型

// 当文件选择器的值发生改变时触发上传文件的函数
    input.addEventListener("change", function (event) {
        const file = event.target.files[0]; // 获取第一个选定的文件
        if (file) {
            // 创建 FormData 对象
            const formData = new FormData();
            formData.append("mp3", file);
            // 发送 POST 请求进行文件上传
            axios.post('http://localhost:8080/Ly/song/setMp3', formData)
                .then(function (response) {
                    let filename = response.data;
                    document.getElementById("singer-song-mp3").value = filename;
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

document.getElementById("singer-lyrics-button").addEventListener("click", function () {
    // 创建文件选择器的 input 元素
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".lrc"; // 可选的文件类型

// 当文件选择器的值发生改变时触发上传文件的函数
    input.addEventListener("change", function (event) {
        const file = event.target.files[0]; // 获取第一个选定的文件
        if (file) {
            // 创建 FormData 对象
            const formData = new FormData();
            formData.append("歌词", file);
            // 发送 POST 请求进行文件上传
            axios.post('http://localhost:8080/Ly/song/setLyrics', formData)
                .then(function (response) {
                    let filename = response.data;
                    document.getElementById("singer-song-lyrics").value = filename;
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

document.getElementById("no-button-singer-song").addEventListener("click",function (){
    document.getElementById("become-singer-div").style.display="none";
})

document.getElementById("ok-button-singer-song").addEventListener("click",function (){
    var prefix = "http://localhost:8080/Ly/";
    let imgs = document.getElementById("singer-song-img").src;
    let lyrics = document.getElementById("singer-song-lyrics").value;//歌词
    let mp3 = document.getElementById("singer-song-mp3").value;//歌曲文件
    let name = document.getElementById("singer-song-name").value;//歌名
    let long_time;//歌曲时间
    console.log(11111);
    console.log(mp3);
    let href="mp3/"+mp3;
    const audio = new Audio(href); // 替换为你的歌曲文件路径
    audio.addEventListener('loadedmetadata', function() {
        // 获取音频文件的持续时间（以秒为单位）
        const duration = audio.duration;
        // 将持续时间转换为分钟和秒钟
        const minutes = Math.floor(duration / 60);
        const seconds = Math.floor(duration % 60);
        // 将分钟和秒钟格式化为"mm:ss"的形式
        long_time = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        console.log('歌曲路径:', audio.src);
        console.log('歌曲时长:', long_time);

        var img = imgs.replace(prefix, "");//图片
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, "0");
        const day = String(now.getDate()).padStart(2, "0");
        const hours = String(now.getHours()).padStart(2, "0");
        const minutes1 = String(now.getMinutes()).padStart(2, "0");
        const seconds1 = String(now.getSeconds()).padStart(2, "0");
        const time = `${year}-${month}-${day} ${hours}:${minutes1}:${seconds1}`;//创建时间

        let user = JSON.parse(localStorage.getItem("user_data"));

        axios.get('http://localhost:8080/Ly/song/becomeSinger', {
            params: {
                img: img,
                name: name,
                lyrics: lyrics,
                mp3: mp3,
                createTime:time,
                time:long_time,
                author:user.username
            }
        }).then(function (response) {

            let song = response.data.song;
            mySongs.push(song);

            localStorage.setItem('mySongs', JSON.stringify(mySongs));
            let mySong_list = document.getElementById("mySong-list");
            let mySong_list_li = document.createElement('li');
            mySong_list_li.className="song";
            mySong_list_li.innerHTML=`
            <div class="song-ing-div">
                <img src= ${song.img} class="song-img">
            </div>
            <div class="song-name-div">
                <a  class="song-name">${song.name}</a>
            </div>
            <div class="song-author-div">
                <a  class="song-author">${song.author}</a>
            </div>
            <div class="song-album-div">
                <a  class="song-album">${song.state}</a>
            </div>
            <div class="song-time-div">
                <a class="song-time">${song.time}</a>
            </div>
        `;
            mySong_list.appendChild(mySong_list_li);
            console.log(song);
        }).catch(function (error) {
            console.log(error);
        });
        setTimeout(function (){
            document.getElementById("become-singer-div").style.display = "none";
        },0)

    });
// 加载音频文件
    audio.load();

})

/*
* ——————————————————————————————————————————————————————————————————————————————————————————————————————————————————————
* */





















