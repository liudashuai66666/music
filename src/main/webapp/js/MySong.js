let song = document.getElementsByClassName("song");
let song_img = document.getElementsByClassName("song-img");
let song_name = document.getElementsByClassName("song-name");
let song_author = document.getElementsByClassName("song-author");
let song_album = document.getElementsByClassName("song-album");
let song_time = document.getElementsByClassName("song-time");
let song_list = document.getElementById("song-list");
var songs;
var song_i;//当前播放的是第几首歌

// 在页面加载后执行判断
window.onload = function() {
    let Avatar = getCookie("avatar");
    let Mailbox = getCookie("mailbox");
    let Uname = getCookie("uname");
    for (const avatar of document.getElementsByClassName("avatar-img")) {
        avatar.src=Avatar;
    };
    for (const uname of document.getElementsByClassName("name")) {
        uname.textContent=Uname;
    };
    /*登录成功之后向后端发送请求，来得到数据库中的数据，填充页面*/
    axios.get('http://localhost:8080/Ly/mySongServlet', {
        params:{
            flag:"初始化界面"
        }
    }).then(function (response) {
        console.log("初始化界面成功");
        songs = response.data.songs;
        for(let i=0;i<10;i++){
            song[i].title=i;
            song_img[i].src=songs[i].img;
            song_name[i].textContent=songs[i].name;
            song_author[i].textContent=songs[i].author;
            song_album[i].textContent=songs[i].album;
            song_time[i].textContent=songs[i].time;
        }
    }).catch(function (error) {
        console.dir(error);
    });
};



var prevLiElement = null; // 用于存储之前被点击的 <li> 元素
song_list.addEventListener('dblclick', function(e) {
    iPlay.className = 'fa fa-pause'; // 切换为暂停图标
    var liElement = findClosestParentLiElement(e.target);
    if (liElement) {
        song_i = liElement.getAttribute('title');
        if (prevLiElement) {
            prevLiElement.style.backgroundColor = ''; // 将之前被点击的 <li> 元素的背景颜色清空
        }
        prevLiElement = liElement; // 存储当前被点击的 <li> 元素，供下一个点击使用
        liElement.style.backgroundColor = 'rgb(55, 128, 206)';
        audio.src=songs[song_i].href;
        head_song_author.textContent=songs[song_i].author;
        head_song_name.textContent=songs[song_i].name;
        head_song_img.src=songs[song_i].img;
        audio.load();
        audio.play();
    }
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































