const slider = document.querySelector('.slider');
const sliderContent = document.querySelector('.slider-content');
const sliderItems = document.querySelectorAll('.slider-item');


// 在页面加载后执行判断
window.onload = function () {
    let user_data = localStorage.getItem("user_data");
    let userData = JSON.parse(user_data);
    let Avatar = userData.avatar;
    let Uname = userData.username;
    let Signature = userData.signature;
    let Mailbox = userData.mailbox;
    console.log(Mailbox);
    console.log(Avatar);
    console.log(Uname);
    console.log(Signature);
    document.getElementById("my-avatar").src = Avatar;
    document.getElementById("change-img").src = Avatar;
    document.getElementById("change-name").value = Uname;
    document.getElementById("signature").value = Signature;
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
    for (const avatar of document.getElementsByClassName("my-avatar")) {
        avatar.src = Avatar;
    }
    for (const uname of document.getElementsByClassName("my-info-name")) {
        uname.textContent = Uname;
    }
    for (const signature of document.getElementsByClassName("my-info-js")) {
        signature.textContent = Signature;
    }

    /*登录成功之后向后端发送请求，来得到数据库中的数据，填充页面*/
    console.log(11111);
    axios.get('http://localhost:8080/Ly/playlist/selectHot', {
        params: {
            id: userData.id
        }
    }).then(function (response) {
        let playlists = response.data.playlists;
        let recommend_list = document.getElementById("recommend-list");
        recommend_list.innerHTML=" ";
        for (let i = 0; i < 8; i++) {
            let recommend_list_li = document.createElement('li');
            recommend_list_li.className="recommend-list-li";
            recommend_list_li.innerHTML=`
            <div class="recommend-cnt">
                <img src=${playlists[i].img} class="playlist-img">
                <a href="PlaylistSong.html?id=${playlists[i].id}" title=${playlists[i].name} class="img-msk">
                ${playlists[i].name}</a>
            </div>
            <p class="dec">
                <a title=${playlists[i].name} class="dec-msk"
                   href="PlaylistSong.html?id=${playlists[i].id}">${playlists[i].name}</a>
            </p>
            `;
            recommend_list.appendChild(recommend_list_li);
        }

        let recommend_Personality = document.getElementById("recommend-Personality");
        recommend_Personality.innerHTML=" ";
        for (let i = 8; i < 12; i++) {
            let recommend_list_li = document.createElement('li');
            recommend_list_li.className="recommend-list-li";
            recommend_list_li.innerHTML=`
            <div class="recommend-cnt">
                <img src=${playlists[i].img} class="playlist-img">
                <a href="PlaylistSong.html?id=${playlists[i].id}" title=${playlists[i].name} class="img-msk">
                ${playlists[i].name}</a>
            </div>
            <p class="dec">
                <a title=${playlists[i].name} class="dec-msk"
                   href="PlaylistSong.html?id=${playlists[i].id}">${playlists[i].name}</a>
            </p>
            `;
            recommend_Personality.appendChild(recommend_list_li);
        }
    }).catch(function (error) {
        console.dir(error);
    });

};


let currentIndex = 0;
let interval;


function startSlider() {
    interval = setInterval(() => {
        currentIndex = (currentIndex + 1) % sliderItems.length;
        updateSlider();
    }, 3000);
}

function updateSlider() {
    sliderContent.style.transform = `translateX(-${currentIndex * (100 / sliderItems.length)}%)`;
}

startSlider();

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

document.getElementById("Back-off-login").addEventListener("click",function (){
    location.href = "http://localhost:8080/Ly/Login.html";
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
































