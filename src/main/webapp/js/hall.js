const slider = document.querySelector('.slider');
const sliderContent = document.querySelector('.slider-content');
const sliderItems = document.querySelectorAll('.slider-item');


document.getElementById("nav1")
document.addEventListener('DOMContentLoaded', function() {
    // 获取导航栏链接列表
    var navLinks = Array.from(document.getElementById('nav1').getElementsByTagName('a'));

    // 为每个导航栏链接添加点击事件监听器
    navLinks.forEach(function(link) {
        link.addEventListener('click', function(event) {
            event.preventDefault(); // 阻止链接默认行为

            // 获取目标链接的href属性值
            var target = this.getAttribute('href');

            // 加载目标链接的内容到内容区域
            loadContent(target);
        });
    });

    // 默认加载第一个链接的内容
    if (navLinks.length > 0) {
        var defaultTarget = navLinks[0].getAttribute('href');
        loadContent(defaultTarget);
    }
});

// 加载内容到指定的内容区域
function loadContent(target) {
    var contentContainer = document.querySelector('#content2');
    axios.get(target)
        .then(function(response) {
            var content = response.data;

            contentContainer.innerHTML = content;
        })
        .catch(function(error) {
            console.error('Error:', error);
        });
}


















// 在页面加载后执行判断
window.onload = function() {
    let Avatar = getCookie("avatar");
    let Mailbox = getCookie("mailbox");
    let Uname = getCookie("uname");
    let Signature = getCookie("signature");
    console.log(Mailbox);
    console.log(Avatar);
    console.log(Uname);
    console.log(Signature);
    for (const avatar of document.getElementsByClassName("my-avatar")) {
        avatar.src=Avatar;
    }
    for (const uname of document.getElementsByClassName("my-info-name")) {
        uname.textContent=Uname;
    }
    for (const signature of document.getElementsByClassName("my-info-js")) {
        signature.textContent=Signature;
    }

    /*登录成功之后向后端发送请求，来得到数据库中的数据，填充页面*/
    console.log(11111);
    axios.get('http://localhost:8080/Ly/hallServlet', {
        params:{
            flag:"初始化界面"
        }
    }).then(function (response) {
        console.log("初始化界面成功");

        /*let hall_body = document.getElementById("hall-body");*/

        let playlists = response.data.playlists;
        console.log(playlists);
        let song_img = document.getElementsByClassName("playlist-img");
        let playlist_msk = document.getElementsByClassName("dec-msk");
        let img_msk = document.getElementsByClassName("img-msk");
        for(let i=0;i<12;i++){
            song_img[i].src=playlists[i].img;
            playlist_msk[i].textContent=playlists[i].name;
            playlist_msk[i].title=playlists[i].name;
            song_img[i].herf=playlists[i].id;
            img_msk[i].title=playlists[i].name;
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
/*轮播图*/













































