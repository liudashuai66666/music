let style_choose = document.getElementById("style-choose");
let song_style = document.getElementById("song-style");




window.onload = function () {

    let user_data = localStorage.getItem("user_data");
    let userData = JSON.parse(user_data);
    document.getElementById("my-avatar").src=userData.avatar;

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
    console.log("全部歌单");
    axios.get("/Ly/playlist/selectAll",{
        params:{
            style:"全部"
        }
    }).then(function (response){
        style_choose.textContent="全部";
        playlist_data(response)
    }).catch(function (error){
        console.log(error);
    })
};




style_choose.addEventListener('focus', function() {
    song_style.style.display = 'block';
});

document.addEventListener('click', function(event) {
    if (!style_choose.contains(event.target)) {
        // 如果点击事件不是在搜索框内部触发的，则收起下拉选择框
        song_style.style.display = 'none';
    }
});

document.getElementById("style-all").addEventListener("click",function (){
    console.log("全部歌单");
    axios.get("/Ly/playlist/selectAll",{
        params:{
            style:"全部"
        }
    }).then(function (response){
        style_choose.textContent="全部";
        playlist_data(response)
    }).catch(function (error){
        console.log(error);
    })
})

document.getElementById("style-chinese").addEventListener("click",function (){
    console.log("华语歌单");
    axios.get("/Ly/playlist/selectPlaylist",{
        params:{
            style:"华语"
        }
    }).then(function (response){
        style_choose.textContent="华语";
        playlist_data (response)
    }).catch(function (error){
        console.log(error);
    })
})

document.getElementById("style-english").addEventListener("click",function (){
    console.log("欧美歌单");
    axios.get("/Ly/playlist/selectPlaylist",{
        params:{
            style:"欧美"
        }
    }).then(function (response){
        style_choose.textContent="欧美";
        playlist_data (response)
    }).catch(function (error){
        console.log(error);
    })
})

document.getElementById("style-sad").addEventListener("click",function (){
    console.log("伤感歌单");
    axios.get("/Ly/playlist/selectPlaylist",{
        params:{
            style:"伤感"
        }
    }).then(function (response){
        style_choose.textContent="伤感";
        playlist_data (response)
    }).catch(function (error){
        console.log(error);
    })
})

document.getElementById("style-rock").addEventListener("click",function (){
    console.log("摇滚歌单");
    axios.get("/Ly/playlist/selectPlaylist",{
        params:{
            style:"摇滚"
        }
    }).then(function (response){
        style_choose.textContent="摇滚";
        playlist_data (response)
    }).catch(function (error){
        console.log(error);
    })
})

document.getElementById("style-ballad").addEventListener("click",function (){
    console.log("民谣歌单");
    axios.get("/Ly/playlist/selectPlaylist",{
        params:{
            style:"民谣"
        }
    }).then(function (response){
        style_choose.textContent="民谣";
        playlist_data (response)
    }).catch(function (error){
        console.log(error);
    })
})

document.getElementById("style-rap").addEventListener("click",function (){
    console.log("说唱歌单");
    axios.get("/Ly/playlist/selectPlaylist",{
        params:{
            style:"说唱"
        }
    }).then(function (response){
        style_choose.textContent="说唱";
        playlist_data (response)
    }).catch(function (error){
        console.log(error);
    })
})



function playlist_data (response) {
    let playlists = response.data.playlists;
    console.log(playlists)
    let recommend_list = document.getElementById("recommend-list");
    recommend_list.innerHTML = " ";// 清空'
    for (let i = 0; i < playlists.length; i++) {
        let playlist = playlists[i];
        let list_li = document.createElement('li');
        list_li.className = "recommend-list-li";
        list_li.innerHTML = `
            <div class="recommend-cnt">
                <img src=${playlist.img} class="playlist-img">
                    <a href="PlaylistSong.html?id=${playlist.id}" title=${playlist.name} 
                      class="img-msk"></a>
            </div>
            <p class="dec">
                <a title=${playlist.name} class="dec-msk"
                   href="#">${playlist.name} </a>
            </p>
            `;
        recommend_list.appendChild(list_li);
    }
}

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
