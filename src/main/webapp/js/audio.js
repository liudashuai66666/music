const audio = document.getElementById('audio-element');


let playButton = document.getElementById('play-button');
let backButton = document.getElementById('back-button');
let nextButton = document.getElementById('next-button');

let head_song_img = document.getElementById("head-song-img");
let head_song_name = document.getElementById("head-song-name");
let head_song_author = document.getElementById("head-song-author");

const iPlay = document.getElementById('i-play');

playButton.addEventListener('click',function (){
// 检查当前的图标内容
    const currentIcon = iPlay.className;
// 使用条件语句切换图标内容
    if (currentIcon === 'fa fa-play') {
        iPlay.className = 'fa fa-pause'; // 切换为暂停图标
        audio.play();
    } else {
        iPlay.className = 'fa fa-play'; // 切换为播放图标
        audio.pause();
    }
})

backButton.addEventListener('click',function (){
    if(song_i===0){
        song_i=songs.length;
    }
    song_i--;
    console.log(song_i)
    if (prevLiElement) {
        prevLiElement.style.backgroundColor = ''; // 将之前被点击的 <li> 元素的背景颜色清空
    }
    prevLiElement = song[song_i]; // 存储当前被点击的 <li> 元素，供下一个点击使用
    song[song_i].style.backgroundColor = 'rgb(55, 128, 206)';
    audio.src=songs[song_i].href;
    head_song_author.textContent=songs[song_i].author;
    head_song_name.textContent=songs[song_i].name;
    head_song_img.src=songs[song_i].img;
    iPlay.className = 'fa fa-pause'; // 切换为暂停图标
    audio.load();
    audio.play();
})
nextButton.addEventListener('click',function (){
    console.log(songs.length)
    song_i++;
    if (song_i===songs.length){
        song_i=0;
    }
    console.log(song_i)
    if (prevLiElement) {
        prevLiElement.style.backgroundColor = ''; // 将之前被点击的 <li> 元素的背景颜色清空
    }
    prevLiElement = song[song_i]; // 存储当前被点击的 <li> 元素，供下一个点击使用
    song[song_i].style.backgroundColor = 'rgb(55, 128, 206)';
    audio.src=songs[song_i].href;
    head_song_author.textContent=songs[song_i].author;
    head_song_name.textContent=songs[song_i].name;
    head_song_img.src=songs[song_i].img;
    iPlay.className = 'fa fa-pause'; // 切换为暂停图标
    audio.load();
    audio.play();
})




audio.addEventListener('ended', () => {
    // 音频播放结束后的操作
    // 例如，停止播放、切换下一首等
});






var usedTimeSpan = document.getElementById('used-time');
var remainingTimeSpan = document.getElementById('remaining-time');
var rangeInput = document.getElementById('range');
var currentTime;
var remainingTime;

// 音频播放时间更新时触发的事件监听器
audio.addEventListener('timeupdate', function() {
    currentTime = audio.currentTime; // 获取当前播放时间
    remainingTime = audio.duration - currentTime; // 计算剩余时间

    usedTimeSpan.textContent = formatTime(currentTime); // 更新播放时间显示
    remainingTimeSpan.textContent = formatTime(remainingTime); // 更新剩余时间显示

    rangeInput.value = currentTime; // 设置 range 输入框的值为当前播放时间，从而让其自动移动
});


// 当拖动 range 输入框时触发的事件监听器
rangeInput.addEventListener('input', function() {
    // 获取 range 输入框的值
    audio.currentTime = rangeInput.value; // 将音频的当前播放时间设置为 range 的值
    currentTime=audio.currentTime;
});

// 音频播放时间更新时触发的事件监听器
audio.addEventListener('timeupdate', function() {
    rangeInput.value = currentTime; // 更新 range 的值为音频的当前播放时间
});

// 辅助函数：将时间格式化为 "MM:SS" 的形式
function formatTime(time) {
    var minutes = Math.floor(time / 60); // 获取分钟数
    var seconds = Math.floor(time % 60); // 获取秒数
    seconds = seconds < 10 ? '0' + seconds : seconds; // 将秒数格式化为两位数
    return minutes + ':' + seconds; // 返回格式化后的时间字符串
}



// 音频播放结束时触发的事件监听器
/*audio.addEventListener('ended', function() {
    // 执行播放结束后的处理逻辑，例如重置播放进度
    rangeInput.value = 0; // 将 range 输入框的值重置为 0
    audio.currentTime = 0; // 将音频的当前播放时间重置为 0
    usedTimeSpan.textContent = formatTime(0); // 更新播放时间显示为 0:00
    remainingTimeSpan.textContent = formatTime(audio.duration); // 更新剩余时间显示为音频总时长
});*/



