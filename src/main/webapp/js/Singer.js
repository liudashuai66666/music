let style_choose = document.getElementById("style-choose");
let song_style = document.getElementById("song-style");

let cnt=1;//歌手分页的当前页数
let CNT=1;//歌手总页数
let sum;//歌手分页的数据总数




window.onload = function () {
    let userData = JSON.parse(localStorage.getItem("user_data"));
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
    selectSinger();
};

function selectSinger(){
    axios.get('http://localhost:8080/Ly/user/selectSinger', {
        params: {
            cnt: (cnt-1)*6
        }
    }).then(function (response) {
        sum=response.data.number;
        let users=response.data.users;
        if (sum%10===0){
            CNT=sum/10;
        }else{
            CNT=sum/10+1;
            CNT=parseInt(CNT);
        }
        let recommend_list = document.getElementById("recommend-list");
        recommend_list.innerHTML=" ";
        for (let i = 0; i < users.length; i++) {
            let recommend_list_li = document.createElement("li");
            recommend_list_li.className="recommend-list-li";
            recommend_list_li.innerHTML=`
                <div class="recommend-cnt">
                    <img src= ${users[i].avatar}>
                    <a href="http://localhost:8080/Ly/${users[i].status === 'SINGER' ? 'SingerHall.html' : 'user.html'}?name=${users[i].username}"
                       class="img-msk"></a>
                </div>
                <p class="dec">
                    <a class="dec-msk"
                       href="http://localhost:8080/Ly/${users[i].status === 'SINGER' ? 'SingerHall.html' : 'user.html'}?name=${users[i].username}">${users[i].username}</a>
                </p>
            `;
            recommend_list.appendChild(recommend_list_li);
        }
        document.getElementById("cnt-span").textContent="一共 "+sum+" 条数据";
        document.getElementById("pages-span").textContent="当前 " +cnt+"/"+CNT+" 页";
        document.getElementById("pages-input").value=cnt;
        if(cnt>=CNT){
            nextButton.style.color="rgb(153, 153, 153)";
        }else{
            nextButton.style.color="rgb(0, 0, 0)";
        }
        if(cnt<=1){
            backButton.style.color="rgb(153, 153, 153)";
        }else{
            backButton.style.color="rgb(0, 0, 0)";
        }
    }).catch(function (error) {
        console.dir(error);
    });
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
