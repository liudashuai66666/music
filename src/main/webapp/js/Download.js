window.onload = function () {
    // 获取 URL 查询参数
    const queryParams = new URLSearchParams(window.location.search);
    // 获取 playlist 属性值
    const playlist = queryParams.get("playlist");
    let id = queryParams.get("song");

    axios.get('http://localhost:8080/Ly/song/selectById', {
        params:{
            id:id
        }
    }).then(function (response) {
        let song = response.data.song;
        // 设置歌曲名称
        document.getElementById("songName").textContent = song.name;
        // 根据需要设置超链接的href属性，指向要下载的文件的路径
        document.getElementById("imageLink").href = song.img;
        document.getElementById("mp3Link").href = song.href;
        document.getElementById("lyricsLink").href = song.lyrics;

        document.getElementById("imageLink").download = getFileName(song.img);
        document.getElementById("mp3Link").download = getFileName(song.href);
        document.getElementById("lyricsLink").download =  getFileName(song.lyrics);
    }).catch(function (error) {
        console.log(error);
    });
}


function getFileName(path) {
    // 使用lastIndexOf方法找到最后一个斜杠的位置
    var slashIndex = path.lastIndexOf("/");
    if (slashIndex !== -1) {
        // 返回分割后的文件名部分
        return path.substring(slashIndex + 1);
    }
    // 没有找到斜杠，直接返回原始路径
    return path;
}