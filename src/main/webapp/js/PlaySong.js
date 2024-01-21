let songs;//播放列表
let cnt;//当前播放到哪首歌了
var prevLiElement = null; // 用于存储之前被点击的 <li> 元素
let book=1;

let playButton = document.getElementById('play-button');
let backButton = document.getElementById('back-button');
let nextButton = document.getElementById('next-button');
let lyricsButton = document.getElementById('song-lyrics');
let song_img = document.getElementById("song-img");
let song_name = document.getElementById("song-name");
let song_author = document.getElementById("song-author");
const iPlay = document.getElementById('i-play');//暂停还是播放图标
const iLyrics = document.getElementById('i-lyrics');//歌词还是播放列表
let audio = document.getElementById("audio-element");
let id;//当前播放的歌曲id
/*
* 要写一个清空列表的功能
* 就是将本地的songs中的数据清空就行了
*
* */


window.onload = function () {
// 获取 URL 查询参数
    const queryParams = new URLSearchParams(window.location.search);
// 获取 playlist 属性值
    const playlist = queryParams.get("playlist");
    id = queryParams.get("song");
    const singer = queryParams.get("singer");
// 获取 songIndex 属性值
    let user_data = localStorage.getItem("user_data");
    let userData = JSON.parse(user_data);
    let mailbox1 = userData.mailbox;
    if (playlist !== null) {
        cnt = 0;
        if (playlist === mailbox1) {
            axios.get("/Ly/song/selectLike", {
                params: {
                    mailbox: mailbox1
                }
            }).then(function (response) {
                songs = response.data.songs;
                localStorage.setItem("songs", JSON.stringify(songs));
                playlist_flash();
            }).catch(function (error) {
                console.log(error);
            })
        } else{
            axios.get("/Ly/song/select_Playlist", {
                //通过歌单来获取歌单里面的歌曲
                params: {
                    id: playlist
                }
            }).then(function (response) {
                songs = response.data.songs;
                localStorage.setItem("songs", JSON.stringify(songs));
                playlist_flash();
            }).catch(function (error) {
                console.log(error);
            })
        }
    } else if(id!==null){
        //现在有一首歌的id，到时候要将其添加进歌单
        //添加的时候要注意遍历数组，看看有没有相同的歌曲，比较歌曲id就行了
        //然后切歌是在本地存一个当前播放是第几首歌了，用cnt
        //若是添加的歌曲在数组中有了，就直接开始播放该位置的歌曲，并且更新本地的cnt
        //若是添加的歌曲在数组中没有，那就直接开始播放添加后的数组的最后一个元素，更新本地的cnt；
        //歌单也要存在本地，就用songs来做名字；
        songs = JSON.parse(localStorage.getItem("songs"));
        let flag = 0;
        for (let i = 0; i < songs.length; i++) {
            if (songs[i].id.toString() === id) {
                flag = 1;
                cnt = i;
                break;
            }
        }
        if (flag === 0) {
            //这说明这首歌没有在现有的歌单里面，要加进去
            axios.get('http://localhost:8080/Ly/song/selectById', {
                params: {
                    id: id
                }
            }).then(function (response) {
                console.log(response.data.song)
                let newSong = response.data.song;
                songs.push(newSong);
                localStorage.setItem("songs", JSON.stringify(songs));
                cnt = songs.length - 1;
                playlist_flash();
            }).catch(function (error) {
                console.log(error);
            });
        } else {
            playlist_flash();
        }
    }else{
        cnt=0;
        axios.get("/Ly/song/selectSongsByAuthor", {
            params: {
                author: singer
            }
        }).then(function (response) {
            songs = response.data.songs;
            localStorage.setItem("songs", JSON.stringify(songs));
            playlist_flash();
        }).catch(function (error) {
            console.log(error);
        })
    }
}
document.getElementById("clean-button").addEventListener("click", function () {
    songs = [];
    localStorage.setItem("songs", JSON.stringify(songs));
    cnt = 0;
    playlist_flash();
})

function playlist_flash() {
    let song_list = document.getElementById("song-list");
    song_list.innerHTML = " "//清空
    for (let i = 0; i < songs.length; i++) {
        let song = songs[i];
        let song_list_li = document.createElement('li');
        song_list_li.className = "playlist";
        song_list_li.title = i;
        song_list_li.innerHTML = `
            <div class="playlist-img-div">
                <img src=${song.img} class="playlist-img">
            </div>
            <div class="playlist-song-msg">
                <div class="play-song-name">
                    <span>${song.name}</span>
                </div>
                <div class="playlist-song-author">
                    <span>${song.author}</span>
                </div>
            </div>
            `;
        song_list.appendChild(song_list_li);
    }
    song_img.src = songs[cnt].img;
    song_name.textContent = songs[cnt].name;
    song_author.textContent = songs[cnt].author;
    audio.src = songs[cnt].href;
    let song_li = document.getElementsByClassName("playlist");
    song_li[cnt].style.backgroundColor = 'rgb(158, 110, 107)';
    prevLiElement = song_li[cnt];
    // 检查当前的图标内容
    const currentIcon = iPlay.className;
    // 使用条件语句切换图标内容
    if (currentIcon === 'fa fa-play') {
        iPlay.className = 'fa fa-pause'; // 切换为暂停图标
        song_img.style.transform = `scale(1)`;
        audio.play();
    } else {
        iPlay.className = 'fa fa-play'; // 切换为播放图标
        song_img.style.transform = `scale(0.7)`;
        audio.pause();
    }
    var lrcFilePath = songs[cnt].lyrics; // 替换为您的LRC文件路径
    readLrcFile(lrcFilePath);
}

playButton.addEventListener('click', function () {
// 检查当前的图标内容
    const currentIcon = iPlay.className;
// 使用条件语句切换图标内容
    if (currentIcon === 'fa fa-play') {
        iPlay.className = 'fa fa-pause'; // 切换为暂停图标
        song_img.style.transform = `scale(1)`;
        audio.play();
    } else {
        iPlay.className = 'fa fa-play'; // 切换为播放图标
        song_img.style.transform = `scale(0.7)`;
        audio.pause();
    }
})

backButton.addEventListener('click', function () {
    let song_li = document.getElementsByClassName("playlist");
    if (cnt === 0) {
        cnt = songs.length;
    }
    cnt--;
    console.log(cnt)
    if (prevLiElement) {
        prevLiElement.style.backgroundColor = ''; // 将之前被点击的 <li> 元素的背景颜色清空
    }
    prevLiElement = song_li[cnt]; // 存储当前被点击的 <li> 元素，供下一个点击使用
    song_li[cnt].style.backgroundColor = 'rgb(158, 110, 107)';
    audio.src = songs[cnt].href;
    song_img.src = songs[cnt].img;
    song_name.textContent = songs[cnt].name;
    song_author.textContent = songs[cnt].author;
    iPlay.className = 'fa fa-pause'; // 切换为暂停图标
    song_img.style.transform = `scale(1)`;
    var lrcFilePath = songs[cnt].lyrics; // 替换为您的LRC文件路径
    readLrcFile(lrcFilePath);

    audio.load();
    audio.play();
    axios.get('http://localhost:8080/Ly/user/addCnt', {
        params:{
            id:songs[cnt].id
        }
    }).then(function (response) {
        console.log(response);
    }).catch(function (error) {
        console.log(error);
    });
})
nextButton.addEventListener('click', function () {
    let song_li = document.getElementsByClassName("playlist");
    console.log(songs.length)
    cnt++;
    if (cnt === songs.length) {
        cnt = 0;
    }
    console.log(cnt)
    if (prevLiElement) {
        prevLiElement.style.backgroundColor = ''; // 将之前被点击的 <li> 元素的背景颜色清空
    }
    prevLiElement = song_li[cnt]; // 存储当前被点击的 <li> 元素，供下一个点击使用
    song_li[cnt].style.backgroundColor = 'rgb(158, 110, 107)';
    audio.src = songs[cnt].href;
    song_img.src = songs[cnt].img;
    song_name.textContent = songs[cnt].name;
    song_author.textContent = songs[cnt].author;
    iPlay.className = 'fa fa-pause'; // 切换为暂停图标
    song_img.style.transform = `scale(1)`;
    var lrcFilePath = songs[cnt].lyrics; // 替换为您的LRC文件路径
    readLrcFile(lrcFilePath);
    audio.load();
    audio.play();
    axios.get('http://localhost:8080/Ly/user/addCnt', {
        params:{
            id:songs[cnt].id
        }
    }).then(function (response) {
        console.log(response);
    }).catch(function (error) {
        console.log(error);
    });
})

lyricsButton.addEventListener('click', function () {
    let className = iLyrics.className;
    if (className === "fa fa-music") {
        iLyrics.className = "fa fa-list";
        document.getElementById("song-list-div").style.display = "none";
        document.getElementById("song-lyrics-div").style.display = "block"
    } else {
        iLyrics.className = "fa fa-music";
        document.getElementById("song-list-div").style.display = "block";
        document.getElementById("song-lyrics-div").style.display = "none"
    }
})


/*双击事件选择歌曲*/
document.getElementById("song-list").addEventListener('dblclick', function (e) {
    var liElement = findClosestParentLiElement(e.target);
    if (liElement) {
        cnt = liElement.getAttribute('title');
        if (prevLiElement) {
            prevLiElement.style.backgroundColor = ''; // 将之前被点击的 <li> 元素的背景颜色清空
        }
        prevLiElement = liElement; // 存储当前被点击的 <li> 元素，供下一个点击使用138, 90, 87
        liElement.style.backgroundColor = 'rgb(158, 110, 107)';
        audio.src = songs[cnt].href;
        song_img.src = songs[cnt].img;
        song_name.textContent = songs[cnt].name;
        song_author.textContent = songs[cnt].author;
        var lrcFilePath = songs[cnt].lyrics; // 替换为您的LRC文件路径
        readLrcFile(lrcFilePath);
        audio.load();
        audio.play();
        axios.get('http://localhost:8080/Ly/user/addCnt', {
            params:{
                id:songs[cnt].id
            }
        }).then(function (response) {
            console.log(response);
        }).catch(function (error) {
            console.log(error);
        });
    }
    iPlay.className = 'fa fa-pause'; // 切换为暂停图标
    song_img.style.transform = `scale(1)`;
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


var usedTimeSpan = document.getElementById('used-time');
var remainingTimeSpan = document.getElementById('remaining-time');
var rangeInput = document.getElementById('range');
var currentTime;
var remainingTime;

const lyricsList = document.getElementsByClassName("song-lyrics-li"); // 获取所有歌词行
const lyrics_line = document.getElementsByClassName("song-lyrics"); // 获取所有歌词行
// 音频加载完成时触发的事件监听器
audio.addEventListener('loadedmetadata', function () {
    rangeInput.max = audio.duration; // 设置进度条的最大值为音频的总时长
});

// 音频播放时间更新时触发的事件监听器


document.getElementById("song-lyrics-div").addEventListener("mouseover",function (){
    book=0;
})
document.getElementById("song-lyrics-div").addEventListener("mouseleave",function (){
    book=1;
})
audio.addEventListener('timeupdate', function () {
    currentTime = audio.currentTime; // 获取当前播放时间
    remainingTime = audio.duration - currentTime; // 计算剩余时间

// 获取当前歌词元素
    let currentLyric = null;
    for (let lyric of lyricsList) {
        if (currentTime >= lyric.dataset.time) {
            currentLyric = lyric;
        } else {
            break;
        }
    }

    // 更新歌词样式
    for (let i = 0; i < lyricsList.length; i++) {
        const lyric = lyricsList[i];
        if (lyric === currentLyric) {
            lyrics_line[i].style.backgroundColor = 'rgb(158, 110, 107)';//框框颜色
            lyrics_line[i].style.color = 'rgb(255, 255, 255)';//字颜色
            lyrics_line[i].style.fontSize = '30px'; //字体大小
            lyric.style.fontWeight = 'bold';  // 当前歌词字体
        } else {
            lyrics_line[i].style.backgroundColor = 'rgb(138, 90, 87)';
            lyrics_line[i].style.color = 'rgb(210,210,210)';
            lyrics_line[i].style.fontSize = '27px';
            lyric.style.fontWeight = '';  // 其他歌词字体
        }
    }
    // 自动滚动到当前歌词

    if (currentLyric && book) {
        let lyricsDiv = document.getElementById("song-lyrics-div");
        let targetScrollTop = currentLyric.offsetTop - (lyricsDiv.offsetHeight / 2);
        lyricsDiv.scrollTo({
            top: targetScrollTop,
            behavior: 'smooth'
        });//平滑效果
    }

    usedTimeSpan.textContent = formatTime(currentTime); // 更新播放时间显示
    remainingTimeSpan.textContent = formatTime(remainingTime); // 更新剩余时间显示

    rangeInput.value = currentTime; // 设置 range 输入框的值为当前播放时间，从而让其自动移动
});


// 当拖动 range 输入框时触发的事件监听器
rangeInput.addEventListener('input', function () {
    // 获取 range 输入框的值
    audio.currentTime = rangeInput.value; // 将音频的当前播放时间设置为 range 的值
    currentTime = audio.currentTime;
});

// 辅助函数：将时间格式化为 "MM:SS" 的形式
function formatTime(time) {
    var minutes = Math.floor(time / 60); // 获取分钟数
    var seconds = Math.floor(time % 60); // 获取秒数
    seconds = seconds < 10 ? '0' + seconds : seconds; // 将秒数格式化为两位数
    return minutes + ':' + seconds; // 返回格式化后的时间字符串
}

audio.addEventListener('ended', () => {
    let song_li = document.getElementsByClassName("playlist");
    let play_manner = document.getElementById("play-manner");
    if(play_manner.className==="fas fa-angle-double-right"){
        cnt++;
        if (cnt === songs.length) {
            cnt = 0;
        }
    }else if(play_manner.className==="fa-solid fa-shuffle"){
        // 生成0到10之间的随机整数，包含10
        while(1){
            const randomInt = Math.floor(Math.random() * songs.length);
            console.log(randomInt);
            if(cnt!==randomInt || songs.length===1){
                cnt=randomInt;
                break;
            }
        }
    }
    console.log(cnt)
    if (prevLiElement) {
        prevLiElement.style.backgroundColor = ''; // 将之前被点击的 <li> 元素的背景颜色清空
    }
    prevLiElement = song_li[cnt]; // 存储当前被点击的 <li> 元素，供下一个点击使用
    song_li[cnt].style.backgroundColor = 'rgb(158, 110, 107)';
    audio.src = songs[cnt].href;
    song_img.src = songs[cnt].img;
    song_name.textContent = songs[cnt].name;
    song_author.textContent = songs[cnt].author;
    iPlay.className = 'fa fa-pause'; // 切换为暂停图标
    song_img.style.transform = `scale(1)`;
    var lrcFilePath = songs[cnt].lyrics; // 替换为您的LRC文件路径
    readLrcFile(lrcFilePath);
    audio.load();
    audio.play();
    axios.get('http://localhost:8080/Ly/user/addCnt', {
        params:{
            id:songs[cnt].id
        }
    }).then(function (response) {
        console.log(response);
    }).catch(function (error) {
        console.log(error);
    });


});

/*切换播放模式*/
let play_choose = document.getElementById("play-choose");
play_choose.addEventListener('click',function (){
    let play_manner = document.getElementById("play-manner");
    if(play_manner.className==="fas fa-angle-double-right"){
        play_manner.className="fa-solid fa-shuffle";
        play_choose.title="随机播放";
        var successPopup = document.createElement('div');
        successPopup.innerHTML = "随机播放";
        successPopup.style.position = "fixed";
        successPopup.style.top = "720px";
        successPopup.style.left = "320px";
        successPopup.style.transform = "translate(-50%, -50%)";
        successPopup.style.background = "lightgreen";
        successPopup.style.padding = "10px";
        successPopup.style.borderRadius = "5px";
        successPopup.style.zIndex = "999";
        successPopup.style.backgroundColor="rgb(118, 70, 67)"
        successPopup.style.color="rgb(255, 255, 255)"
        document.body.appendChild(successPopup);
        // 1秒后自动关闭弹窗
        setTimeout(function() {
            document.body.removeChild(successPopup);
        }, 1000);

    }else if(play_manner.className==="fa-solid fa-shuffle"){
        play_manner.className="fa-solid fa-arrows-rotate";
        play_choose.title="单曲循环";
        var successPopup = document.createElement('div');
        successPopup.innerHTML = "单曲循环";
        successPopup.style.position = "fixed";
        successPopup.style.top = "720px";
        successPopup.style.left = "320px";
        successPopup.style.transform = "translate(-50%, -50%)";
        successPopup.style.background = "lightgreen";
        successPopup.style.padding = "10px";
        successPopup.style.borderRadius = "5px";
        successPopup.style.zIndex = "999";
        successPopup.style.backgroundColor="rgb(118, 70, 67)"
        successPopup.style.color="rgb(255, 255, 255)"
        document.body.appendChild(successPopup);
        // 1秒后自动关闭弹窗
        setTimeout(function() {
            document.body.removeChild(successPopup);
        }, 1000);


    }else if (play_manner.className==="fa-solid fa-arrows-rotate"){
        play_manner.className="fas fa-angle-double-right";
        play_choose.title="顺序播放";
        var successPopup = document.createElement('div');
        successPopup.innerHTML = "顺序播放";
        successPopup.style.position = "fixed";
        successPopup.style.top = "720px";
        successPopup.style.left = "320px";
        successPopup.style.transform = "translate(-50%, -50%)";
        successPopup.style.background = "lightgreen";
        successPopup.style.padding = "10px";
        successPopup.style.borderRadius = "5px";
        successPopup.style.zIndex = "999";
        successPopup.style.backgroundColor="rgb(118, 70, 67)"
        successPopup.style.color="rgb(255, 255, 255)"
        document.body.appendChild(successPopup);
        // 1秒后自动关闭弹窗
        setTimeout(function() {
            document.body.removeChild(successPopup);
        }, 1000);


    }
})
/*切换播放模式*/


document.getElementById("song-comments").addEventListener('click', function () {
    window.open("http://localhost:8080/Ly/Comments.html?song=" + songs[cnt].id);
})
/*
* 调节音量
* */
// 获取 <input> 和 <audio> 元素
const volumeInput = document.getElementById('volume');

// 监听 <input> 元素的值变化事件
volumeInput.addEventListener('input', function() {
    // 获取当前 <input> 元素的值
    const volumeValue = volumeInput.value;

    // 将值应用到 <audio> 元素的音量属性
    audio.volume = volumeValue / 100; // 根据最大值进行归一化

});



/*
* ——————————————————————————————————————————————————————————————————————————————————————————————————————————
* 歌词处理
* */
function readLrcFile(path) {
    fetch(path)
        .then(response => response.text())
        .then(contents => {
            parseLrc(contents); // 处理LRC歌词内容
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

function parseLrc(contents) {
    // 在这里执行解析LRC的逻辑，根据自己的需求处理歌词内容
    // 可以使用正则表达式或字符串处理方法来提取时间标签和歌词内容
    // 例如：[00:22.32]这是歌词内容
    // 示例: 将每一行的时间标签和歌词内容存储到数组中
    var lines = contents.split('\n');
    var lyrics = [];
    var timePattern = /\[(\d{2}):(\d{2})(?:\.(\d{2,3}))?\](.*)/; // 更新的正则表达式

    lines.forEach(function (line) {
        var match = line.match(timePattern);
        if (match) {
            var minutes = parseInt(match[1]);
            var seconds = parseInt(match[2]);
            var milliseconds = match[3] ? parseInt(match[3]) : 0;
            var time = minutes * 60 + seconds + milliseconds / 1000;
            var text = match[4].trim();
            lyrics.push({
                time: time,
                text: text
            });
        }
    });
    // 在这里可以对解析后的歌词数据进行进一步处理或使用
    console.log(lyrics);
    let lyrics_list = document.getElementById("lyrics-list");
    lyrics_list.innerHTML = " ";//清空
    for (let i = 0; i < lyrics.length; i++) {
        let lyrics_list_li = document.createElement('li');
        lyrics_list_li.className = "song-lyrics-li";
        lyrics_list_li.id = "line-" + i;
        lyrics_list_li.dataset.time = lyrics[i].time;
        lyrics_list_li.innerHTML = `
        <span class="song-lyrics">${lyrics[i].text}</span>
        `;
        lyrics_list_li.addEventListener("click",function (){
            currentTime = lyrics_list_li.dataset.time;
            remainingTime = audio.duration - currentTime; // 计算剩余时间
            audio.currentTime = currentTime;
            rangeInput.value = currentTime;
        })
        lyrics_list.appendChild(lyrics_list_li);
    }
}







/*
* 下载歌曲
* */

document.getElementById("download").addEventListener("click", function (){
    window.open("http://localhost:8080/Ly/Download.html?song=" + songs[cnt].id);
})










