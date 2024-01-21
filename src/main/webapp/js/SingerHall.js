let name;//当前页面的歌手名字
let concerns;//我的关注

let myData = JSON.parse(localStorage.getItem("user_data"));

window.onload = function () {

    // 获取 URL 查询参数
    const queryParams = new URLSearchParams(window.location.search);
    name = queryParams.get("name");
    document.getElementById("my-avatar").src=myData.avatar;
    axios.get('http://localhost:8080/Ly/user/selectByName', {
        params:{
            name:name
        }
    }).then(function (response) {
        let user = response.data.user;
        document.getElementById("avatar-img").src=user.avatar;
        document.getElementById("description").textContent=user.signature
        document.getElementById("name").textContent=user.username;

        let book=0;
        for (let i = 0; i < myConcerns.length; i++) {
            if(myConcerns[i].mailbox===user.mailbox){
                book=1;//1表示这个人是你的关注
                className="已关注";
                let flag_i = document.getElementById("concern-flag");
                let concern_button = document.getElementById("concern-button");
                flag_i.className="fa-solid fa-check";
                concern_button.textContent="已关注";
            }
        }

    }).catch(function (error) {
        console.log(error);
    });

    axios.get('http://localhost:8080/Ly/song/selectSongsByAuthor', {
        params:{
            author:name
        }
    }).then(function (response) {
        let songs = response.data.songs;
        document.getElementById("cnt").textContent="歌曲："+songs.length;
        let song_list = document.getElementById("song-list");
        song_list.innerHTML=" ";
        for (let i = 0; i < songs.length; i++) {
            let song_list_li = document.createElement("li");
            song_list_li.className="song-list-li";
            song_list_li.innerHTML=`
                <div class="song-ing-div">
                    <img src= ${songs[i].img} class="song-img">
                </div>
                <div class="song-name-div">
                    <a class="song-name">${songs[i].name}</a>
                </div>
                <div class="song-author-div">
                    <a class="song-author">${songs[i].author}</a>
                </div>
                <div class="song-album-div">
                    <a class="song-album">${songs[i].album}</a>
                </div>
                <div class="song-time-div">
                    <a class="song-time">${songs[i].time}</a>
                </div>
            `;
            song_list.appendChild(song_list_li);

            song_list_li.addEventListener('dblclick',function (event){
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
        }
    }).catch(function (error) {
        console.log(error);
    });

}


let playAll = document.getElementById("play-div");
playAll.addEventListener('click',function (event){
    event.preventDefault();//阻止默认点击行为
    // 尝试从本地存储中获取openedWindow的状态
    var openedWindowId = localStorage.getItem("openedWindowId");
    var openedWindow = openedWindowId ? window.open("", openedWindowId) : null;

    if (openedWindow === null || openedWindow.closed) {

        openedWindow = window.open(
            "http://localhost:8080/Ly/PlaySong.html?singer=" + name,
            "音乐播放"
        );
        openedWindowId = openedWindow.name; // 使用窗口的名称作为标识符
        console.log(openedWindowId);
        console.log("第一次打开播放列表");
    } else {
        openedWindow.close(); // 关闭之前的窗口
        openedWindow = window.open(
            "http://localhost:8080/Ly/PlaySong.html?singer=" + name,
            "音乐播放"
        );
        openedWindowId = openedWindow.name; // 使用窗口的名称作为标识符
        console.log(openedWindowId);
        console.log("在一个新的窗口打开播放列表");
    }

    localStorage.setItem("openedWindowId", openedWindowId); // 存储窗口标识符到本地存储
})



let myConcerns = JSON.parse(localStorage.getItem("concerns"));
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
















