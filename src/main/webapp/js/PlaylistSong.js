let songs;//当前歌单中的歌曲
let song_list = document.getElementById("song-list");
let playlist;//当前页面的歌单对象
var selectedCount = 0;//风格选择的数量，不能超过两个
// 在页面加载后执行判断

let songId;//右击选择到的歌曲id
let Uname;
let mailbox;
let playlist_id;
let id;
let collectionPlaylists;//我收藏的歌单
window.onload = function () {

    // 获取 URL 查询参数
    const queryParams = new URLSearchParams(window.location.search);

    myPlaylists = JSON.parse(localStorage.getItem("playlists"));
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

// 获取 playlist 属性值
    playlist_id = queryParams.get("id");
    collectionPlaylists = JSON.parse(localStorage.getItem("collectionPlaylists"));
/*如果是自己的收藏，就改变收藏的按钮样式*/
    for (let i = 0; i < collectionPlaylists.length; i++) {
        if (collectionPlaylists[i].id === parseInt(playlist_id)) {
            let collection = document.getElementById("xing-xing");
            collection.className = "fa-solid fa-star";
            collection.style.color = "#31c27c";
            break;
        }
    }

    axios.get('http://localhost:8080/Ly/playlist/selectPlaylist_id', {
        params: {
            id: playlist_id
        }
    }).then(function (response) {
        let play_list = response.data;
        playlist = play_list.playlist;
        let styles = play_list.styles;
        /*歌单数据添加到界面上面*/
        document.getElementById("cnt").textContent="播放："+playlist.cnt;
        let label_class = document.getElementById("label");
        label_class.innerHTML = " ";
        for (let i = 0; i < styles.length; i++) {
            let label = document.createElement('span');
            label.className = "label-class";
            label.innerHTML = styles[i];
            label_class.appendChild(label);
        }
// 获取所有的复选框元素
        const checkboxes = document.querySelectorAll('input[type="checkbox"][name="tag"]');
// 遍历复选框元素，并根据styles数组中的数据选择对应的复选框
        checkboxes.forEach((checkbox) => {
            if (styles.includes(checkbox.value)) {
                checkbox.checked = true; // 选择复选框
                selectedCount++;
            }
        });

        let img = playlist.img;
        let name = playlist.name;
        let author = playlist.author;
        let description = playlist.description;
        let time = playlist.time;
        if (author === Uname) {
            document.getElementById("edit-playlist").style.display = "flex";
            document.getElementById("choose-label-text").style.display = "flex";
            document.getElementById("collection-playlist").style.display = "none";
        }
        for (const avatar of document.getElementsByClassName("avatar-img")) {
            avatar.src = img;
        }
        for (const uname of document.getElementsByClassName("name")) {
            uname.textContent = name;
        }
        document.getElementById("playlist-author").textContent = author;
        document.getElementById("playlist-time").textContent = time;
        document.getElementById("description").textContent = description;

        document.getElementById("playlist-img").src = playlist.img;
        document.getElementById("playlist-name").value = playlist.name;
        document.getElementById("playlist-description").value = playlist.description;

    }).catch(function (error) {
        console.log(error);
    });

    let user_data = localStorage.getItem("user_data");
    let userData = JSON.parse(user_data);
    let Avatar = userData.avatar;
    mailbox = userData.mailbox;
    Uname = userData.username;

    document.getElementById("my-avatar").src = Avatar;//导航栏头像

    /*将歌单列表里面的值得到*/
    axios.get('http://localhost:8080/Ly/song/select_Playlist', {
        params: {
            id: playlist_id
        }
    }).then(function (response) {
        songs = response.data.songs;
        console.log(songs)
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

                if (playlist.author === Uname) {
                    var option1 = document.createElement("div");
                    option1.innerHTML = "从歌单中移除";
                    option1.className = "menu-option";
                    contextMenu.appendChild(option1);
                    option1.addEventListener("click", function () {
                        console.log(songId);
                        /*从当前歌单删除*/
                        axios.get('http://localhost:8080/Ly/playlist/delete_playlistSong', {
                            params: {
                                listId: playlist_id,
                                songId: songId
                            }
                        }).then(function (response) {
                            songs.splice(i, 1);
                            let list_song = document.getElementsByClassName("song");
                            var elementToRemove = list_song[i];
                            elementToRemove.parentNode.removeChild(elementToRemove);
                        }).catch(function (error) {
                            console.log(error);
                        });
                    });
                }

                var option2 = document.createElement("div");
                option2.innerHTML = "添加至歌单";
                option2.className = "menu-option";
                contextMenu.appendChild(option2);
                let playlist_list = document.getElementById("playlist-list");
                playlist_list.style.top = event.clientY + 20 + "px";
                playlist_list.style.left = event.clientX - 50 + "px";

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
    }).catch(function (error) {
        console.dir(error);
    });
};


document.getElementById("playlist-list").addEventListener("mouseover", function (event) {
    document.getElementById("playlist-list").style.display = "flex";
});
document.getElementById("playlist-list").addEventListener("mouseleave", function (event) {
    document.getElementById("playlist-list").style.display = "none";
});

var prevLiElement = null; // 用于存储之前被点击的 <li> 元素

document.getElementById("play-song").addEventListener('click', function (e) {
    var liElement = findClosestParentLiElement(e.target);
    if (liElement) {
        id = liElement.getAttribute('title');
    }
    /*打开播放界面*/
    var openedWindowId = localStorage.getItem("openedWindowId");
    var openedWindow = openedWindowId ? window.open("", openedWindowId) : null;

    if (openedWindow === null || openedWindow.closed) {
        openedWindow = window.open(
            "http://localhost:8080/Ly/PlaySong.html?playlist=" + playlist_id,
            "音乐播放"
        );
        openedWindowId = "playSongPage"; // 使用一个固定的标识符，如"playSongPage"
        console.log("第一次打开播放列表");
    } else {
        openedWindow.close(); // 关闭之前的窗口
        openedWindow = window.open(
            "http://localhost:8080/Ly/PlaySong.html?playlist=" + playlist_id,
            "音乐播放"
        );
        openedWindowId = "playSongPage"; // 使用一个固定的标识符，如"playSongPage"
        console.log("在一个新的窗口打开播放列表");
    }

    localStorage.setItem("openedWindowId", openedWindowId); // 存储窗口标识符到本地存储
})

song_list.addEventListener('dblclick', function (e) {
    var liElement = findClosestParentLiElement(e.target);
    if (liElement) {
        id = liElement.getAttribute('title');
    }
    /*打开播放界面*/
    var openedWindowId = localStorage.getItem("openedWindowId");
    var openedWindow = openedWindowId ? window.open("", openedWindowId) : null;

    if (openedWindow === null || openedWindow.closed) {
        openedWindow = window.open(
            "http://localhost:8080/Ly/PlaySong.html?song=" + id,
            "音乐播放"
        );
        openedWindowId = "playSongPage"; // 使用一个固定的标识符，如"playSongPage"
        console.log("第一次打开播放列表");
    } else {
        openedWindow.close(); // 关闭之前的窗口
        openedWindow = window.open(
            "http://localhost:8080/Ly/PlaySong.html?song=" + id,
            "音乐播放"
        );
        openedWindowId = "playSongPage"; // 使用一个固定的标识符，如"playSongPage"
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
* ——————————————————————————————————————————————————————————————————————————————————————————————————————————————————————
* 编辑歌单
* */

document.getElementById("edit-button").addEventListener('click', function () {
    document.getElementById("create-playlist-div").style.display = "flex";
})
document.getElementById("playlist-img").addEventListener("click", function () {
    // 创建文件选择器的 input 元素
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".jpg, .png"; // 可选的文件类型

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
    axios.get('http://localhost:8080/Ly/playlist/revisePlayliet', {
        params: {
            id: playlist.id,
            img: img,
            name: name,
            description: description,
            author: Uname
        }
    }).then(function (response) {
        playlist = response.data.playlist;
        let img = playlist.img;
        let name = playlist.name;
        let author = playlist.author;
        let description = playlist.description;
        let time = playlist.time;
        if (author === Uname) {
            document.getElementById("edit-playlist").style.display = "flex";
        }
        for (const avatar of document.getElementsByClassName("avatar-img")) {
            avatar.src = img;
        }
        for (const uname of document.getElementsByClassName("name")) {
            uname.textContent = name;
        }
        document.getElementById("playlist-author").textContent = author;
        document.getElementById("playlist-time").textContent = time;
        document.getElementById("description").textContent = description;

        document.getElementById("playlist-img").src = playlist.img;
        document.getElementById("playlist-name").value = playlist.name;
        document.getElementById("playlist-description").value = playlist.description;

    }).catch(function (error) {
        console.log(error);
    });

    setTimeout(() => {
        axios.get('http://localhost:8080/Ly/playlist/selectByAuthor', {
            params: {
                author: Uname
            }
        }).then(function (response) {
            myPlaylists = response.data.playlists;
            localStorage.setItem('playlists', JSON.stringify(myPlaylists));
        }).catch(function (error) {
            console.log(error);
        });
    }, 500)
    document.getElementById("create-playlist-div").style.display = "none";
})


document.getElementById("choose-label-text").addEventListener("click", function () {
    document.getElementById("choose-label-div").style.display = "flex";
})
document.getElementById("noChoose-button").addEventListener("click", function () {
    document.getElementById("choose-label-div").style.display = "none";
})
document.getElementById("okChoose-button").addEventListener("click", function () {
    var selectedTags = Array.from(document.querySelectorAll('input[name="tag"]:checked'));

    var selectedTagValues = selectedTags.map(function (tag) {
        return tag.value;
    });
    console.log(selectedTagValues);
    /*
    * 删除歌单风格
    * */
    axios.get('http://localhost:8080/Ly/playlist/deletePlaylistStyle', {
        params: {
            id: playlist_id,
        }
    }).then(function (response) {

    }).catch(function (error) {
        console.log(error);
    });
    /*
    * 添加歌单风格
    * */
    setTimeout(() => {
        for (let i = 0; i < selectedTagValues.length; i++) {
            axios.get('http://localhost:8080/Ly/playlist/createStyle', {
                params: {
                    id: playlist_id,
                    style: selectedTagValues[i]
                }
            }).then(function (response) {
                console.log(response.data);
            }).catch(function (error) {
                console.log(error);
            });
        }
    }, 500)
    let label_class = document.getElementById("label");
    label_class.innerHTML = " ";
    for (let i = 0; i < selectedTagValues.length; i++) {
        let label = document.createElement('span');
        label.className = "label-class";
        label.innerHTML = selectedTagValues[i];
        label_class.appendChild(label);
    }
    document.getElementById("choose-label-div").style.display = "none";
});
/*
这个是选选择标签的里面的js代码
*/
var tagForm = document.getElementById('tagForm');
// 用于追踪已选择的标签数


// 监听表单元素的 change 事件
tagForm.addEventListener('change', function (event) {
    var checkbox = event.target;

    // 如果点击的是复选框
    if (checkbox.type === 'checkbox') {
        // 如果复选框被选中
        if (checkbox.checked) {
            // 标签数加1
            selectedCount++;
        } else {
            // 标签数减1
            selectedCount--;
        }

        // 如果标签数超过了2个，取消当前点击的复选框的选中状态
        if (selectedCount > 2) {
            checkbox.checked = false;
            // 标签数重置为2
            selectedCount = 2;
        }
    }
});

/*
* ——————————————————————————————————————————————————————————————————————————————————————————————————————————————————————
* */

/*
* 用户菜单
*
* */

let playlist_author = document.getElementById("playlist-author");
playlist_author.addEventListener("click",function (){
    let author = playlist_author.textContent;

    axios.get('http://localhost:8080/Ly/user/pdUname', {
        params:{
            uname:author
        }
    }).then(function (response) {
        console.log(response.data)
        if(response.data==="无用"){
            window.open("http://localhost:8080/Ly/user.html?name="+author);
        }

    }).catch(function (error) {
        console.log(error);
    });

})

/*
* ——————————————————————————————————————————————————————————————————————————————————————————————————————————————————————
* 删除歌单
* */

document.getElementById("delete-button").addEventListener("click", function () {
    var confirmed = confirm("确定要删除吗？");
    if (confirmed) {

        axios.get('http://localhost:8080/Ly/playlist/deletePlaylist', {
            params: {
                id: playlist.id,
            }
        }).then(function (response) {
            var successPopup = document.createElement('div');
            successPopup.innerHTML = "删除成功";
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
            setTimeout(() => {
                location.href = "http://localhost:8080/Ly/MySong.html";
            }, 1200)
        }).catch(function (error) {
            console.log(error);
        });
        setTimeout(() => {
            axios.get('http://localhost:8080/Ly/playlist/selectByAuthor', {
                params: {
                    author: Uname
                }
            }).then(function (response) {
                myPlaylists = response.data.playlists;
                localStorage.setItem('playlists', JSON.stringify(myPlaylists));
            }).catch(function (error) {
                console.log(error);
            });
        }, 500)
        console.log("执行删除操作");
    } else {
        // 弹窗消失，不执行删除操作
        console.log("取消删除操作");
    }
})
/*
* ——————————————————————————————————————————————————————————————————————————————————————————————————————————————————————
* 收藏歌单操作
* */
let timerId; // 用于存储计时器的ID
const delay = 1000; // 定时器的延迟时间（1秒）
let flag_xing = 1;
let className = document.getElementById("xing-xing").className;

function startTimer() {

    clearTimeout(timerId); // 清除之前的计时器
    // 开始新的计时器
    let collection = document.getElementById("xing-xing");
    if (collection.className === "fa-regular fa-star") {
        collection.className = "fa-solid fa-star";
        collection.style.color = "#31c27c";
        flag_xing = 1;//表示添加
        if (className === "fa-solid fa-star") {
            flag_xing = 0;
        }
        //添加数组中的数据
    } else {
        collection.className = "fa-regular fa-star";
        collection.style.color = "#31c27c";
        flag_xing = -1;
        //表示删除
        //删除数组中的数据

    }
    console.log("点击我了")
    timerId = setTimeout(() => {
        // 在定时器结束时执行的代码
        console.log(flag_xing);
        axios.get('http://localhost:8080/Ly/playlist/CollectionPlaylist', {
            params: {
                mailbox: mailbox,
                list_id: playlist_id,
                flag: flag_xing
            }
        }).then(function (response) {
            let flag = response.data.flag;
            if (flag === 1) {
                /*代表添加成功*/
                collectionPlaylists.push(playlist);
            } else if (flag === -1) {
                /*代表删除成功*/
                for (let i = 0; i < collectionPlaylists.length; i++) {
                    if (collectionPlaylists[i].id===parseInt(playlist_id)){
                        collectionPlaylists.splice(i,1);
                        break;
                    }
                }
            }
            localStorage.setItem('collectionPlaylists', JSON.stringify(collectionPlaylists));
        }).catch(function (error) {
            console.log(error);
        });
    }, delay);
}

// 在按钮点击事件中调用 startTimer() 函数
document.getElementById("collection-playlist").addEventListener('click', startTimer);

















