let id;//你当前看的评论的歌曲或者歌单id
let cnt;//代表你当前看的评论的歌曲的信息是本地存的songs的cnt索引
let songs;//这是你本地存的播放列表
let user;//用户信息
let comments;//当前页面的评论
let sum=0;

window.onload = function () {
    // 获取 URL 查询参数
    const queryParams = new URLSearchParams(window.location.search);
    // 获取 playlist 属性值
    const playlist = queryParams.get("playlist");
    id = queryParams.get("song");
    // 获取 songIndex 属性值
    songs = JSON.parse(localStorage.getItem("songs"));
    user = JSON.parse(localStorage.getItem("user_data"));
    for (let i = 0; i < songs.length; i++) {
        if(songs[i].id.toString()===id){
            cnt=i;
            break;
        }
    }
    document.getElementById("avatar-img").src=songs[cnt].img;
    document.getElementById("name").textContent=songs[cnt].name;
    document.getElementById("playlist-author").textContent=songs[cnt].author;
    document.getElementById("playlist-zhuanji").textContent="专辑: "+songs[cnt].album;
    document.getElementById("playlist-time").textContent="发布时间: "+songs[cnt].createTime;
    document.getElementById("description").style.display="none";

    axios.get('http://localhost:8080/Ly/comment/selectCommentBySongId', {
        params:{
            song_id:id
        }
    }).then(function (response) {
        console.log(response.data.comments);
        comments = response.data.comments;
        sum+=comments.length;
        let comments_list_one = document.getElementById("comments-list");
        comments_list_one.innerHTML=" ";
        for (let i = 0; i < comments.length; i++) {
            let comments_list_one_li = document.createElement('li');
            comments_list_one_li.className="comments-list-li";
            comments_list_one_li.innerHTML=`
                <div class="yiji-comments">
                    <div class="img">
                        <img src=${comments[i].user_avatar} class="comments-avatar">              
                    </div>
                    <div class="content">
                        <span class="uname">${comments[i].user_name}</span>
                        <span class="send-time">${comments[i].time}</span>
                        <span class="comments-content">${comments[i].content}</span>
                        <div class="dianzhan-div">
                            <i class="fa-regular fa-thumbs-up"></i>
                            <span class="one-huifu-button">回复</span>
                        </div>
                        <div class="one-write-comments-div">
                            <textarea class="one-write-comments"></textarea>
                            <div class="one-buttons">
                                <span class="one-okButton" data-ancestor_id="${comments[i].id}" data-my_id="${comments[i].id}" data-name=${comments[i].user_name}>发送</span>
                                <span class="one-noButton">取消</span>
                            </div>
                        </div>
                        <span class="reply-button">查看${comments[i].list.length}条回复<i class="fa-solid fa-angle-down"></i></span>
                    </div>
                </div>
            `;
            let comment_list_two = document.createElement("ul");
            comment_list_two.className="lower-comments-list";
            let lowComments = comments[i].list;
            sum+=lowComments.length;
            for (let j = 0; j < lowComments.length; j++) {
                let comment_list_two_li = document.createElement('li');
                comment_list_two_li.className="lower-comments-list-li";
                comment_list_two_li.innerHTML=`
                    <div class="yiji-comments">
                        <div class="img">
                            <img src=${lowComments[j].user_avatar} class="comments-avatar">
                        </div>
                        <div class="content">
                            <div class="uname-div">
                                <span class="uname">${lowComments[j].user_name}</span>
                                <div class="huifu-duixiang" data-ancestor_id="${lowComments[j].ancestor_id}" data-receiver_id="${lowComments[j].receiver_id}">
                                    <i class="fa-solid fa-arrow-right" style="color: #31c27c;"></i>
                                    <span class="erji-uname">${lowComments[j].receiver_name}</span>
                                </div>
                            </div>
                            <span class="send-time">${lowComments[j].time}</span>
                            <span class="lower-comments-content">${lowComments[j].content}</span>
                            <div class="dianzhan-div">
                                <i class="fa-regular fa-thumbs-up"></i>
                                <span class="two-huifu-button">回复</span>
                            </div>
                            <div class="two-write-comments-div">
                                <textarea class="two-write-comments"></textarea>
                                <div class="two-buttons">
                                    <span class="two-okButton" data-ancestor_id="${comments[i].id}" data-my_id="${lowComments[j].id}" data-name=${lowComments[j].user_name}>发送</span>
                                    <span class="two-noButton">取消</span>
                                </div>
                            </div>
                        </div>
                    </div>
                `;
                comment_list_two.appendChild(comment_list_two_li);
            }
            comments_list_one_li.appendChild(comment_list_two);
            comments_list_one.appendChild(comments_list_one_li);

        }
        bind();
    }).catch(function (error) {
        console.log(error);
    });

}


document.getElementById("send-button").addEventListener("click",function (){
    let contents = document.getElementById("write-comments");
    let content = contents.value;
    if(content){
        contents.value="";

        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, "0");
        const day = String(now.getDate()).padStart(2, "0");
        const hours = String(now.getHours()).padStart(2, "0");
        const minutes = String(now.getMinutes()).padStart(2, "0");
        const seconds = String(now.getSeconds()).padStart(2, "0");
        const time = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
        console.log(time);

        axios.get('http://localhost:8080/Ly/comment/addComments_one', {
            params:{
                mailbox: user.mailbox,
                song_id:id,
                content:content,
                time:time
            }
        }).then(function (response) {
            console.log(response.data)
            let newId = response.data.newId;
            let newComment = document.createElement('li');
            newComment.className="comments-list-li";
            newComment.innerHTML=`
            <div class="yiji-comments">
                <div class="img">
                    <img src= ${user.avatar} class="comments-avatar">
                </div>
                <div class="content">
                    <span class="uname">${user.username}</span>
                    <span class="send-time">${time}</span>
                    <span class="comments-content">${content}</span>
                    <div class="dianzhan-div">
                        <i class="fa-regular fa-thumbs-up"></i>
                        <span class="one-huifu-button">回复</span>
                    </div>
                    <div class="one-write-comments-div">
                        <textarea class="one-write-comments"></textarea>
                        <div class="one-buttons">
                            <span class="one-okButton" data-ancestor_id="${newId}" data-my_id="${newId}" data-name=${user.username}>发送</span>
                            <span class="one-noButton">取消</span>
                        </div>
                    </div>
                    <span class="reply-button">查看0条回复<i class="fa-solid fa-angle-down"></i></span>
                </div>
            </div>
            <ul class="lower-comments-list">
               
            </ul>
        `;
            document.getElementById("comments-list").appendChild(newComment);


            let reply_button = newComment.getElementsByClassName("reply-button");
            let lower_comments_list = newComment.getElementsByClassName("lower-comments-list");
            for (let i = 0; i < reply_button.length; i++) {
                let flag = reply_button[i].getElementsByTagName("i")[0];
                reply_button[i].addEventListener("click",function (){
                    if(flag.className==="fa-solid fa-angle-down"){
                        lower_comments_list[i].style.display="block";
                        flag.className="fa-solid fa-angle-up"
                    }else{
                        lower_comments_list[i].style.display="none";
                        flag.className="fa-solid fa-angle-down";
                    }
                })
            }
            let one_huifu_button = newComment.getElementsByClassName("one-huifu-button");
            let one_write_comments_div = newComment.getElementsByClassName("one-write-comments-div");
            for (let i = 0; i < one_huifu_button.length; i++) {
                one_huifu_button[i].addEventListener("click",function (){
                    if(one_huifu_button[i].textContent==="回复"){
                        one_huifu_button[i].textContent="取消";
                        one_write_comments_div[i].style.display="flex";
                    }else{
                        one_huifu_button[i].textContent="回复";
                        one_write_comments_div[i].style.display="none";
                    }
                })
            }

            let one_okButton = newComment.getElementsByClassName("one-okButton");
            let one_write_comments = newComment.getElementsByClassName("one-write-comments");
            for (let i = 0; i < one_okButton.length; i++) {
                one_okButton[i].addEventListener('click',function (){
                    if(one_write_comments[i].value){
                        let content = one_write_comments[i].value;
                        one_write_comments[i].value="";
                        let ancestor_id = one_okButton[i].dataset.ancestor_id;
                        let receiver_id = one_okButton[i].dataset.my_id;
                        let name = one_okButton[i].dataset.name;
                        let cnt = one_okButton[i].dataset.cnt;
                        const now = new Date();
                        const year = now.getFullYear();
                        const month = String(now.getMonth() + 1).padStart(2, "0");
                        const day = String(now.getDate()).padStart(2, "0");
                        const hours = String(now.getHours()).padStart(2, "0");
                        const minutes = String(now.getMinutes()).padStart(2, "0");
                        const seconds = String(now.getSeconds()).padStart(2, "0");
                        const time = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;

                        axios.get('http://localhost:8080/Ly/comment/addComments_two', {
                            params:{
                                mailbox: user.mailbox,
                                time:time,
                                content:content,
                                song_id:id,
                                receiver_id:receiver_id,
                                ancestor_id:ancestor_id
                            }
                        }).then(function (response) {
                            console.log(response.data)
                            let newId = response.data.newId;

                            let lower_comments_list_li = document.createElement("li");
                            lower_comments_list_li.className="lower-comments-list-li";
                            lower_comments_list_li.innerHTML=`
                            <div class="yiji-comments">
                                <div class="img">
                                    <img src=${user.avatar} class="comments-avatar">
                                </div>
                                <div class="content">
                                    <div class="uname-div">
                                        <span class="uname">${user.username}</span>
                                        <div class="huifu-duixiang" data-ancestor_id="${ancestor_id}" data-receiver_id="${receiver_id}">
                                            <i class="fa-solid fa-arrow-right" style="color: #31c27c;"></i>
                                            <span class="erji-uname">${name}</span>
                                        </div>
                                    </div>
                                    <span class="send-time">${time}</span>
                                    <span class="lower-comments-content">${content}</span>
                                    <div class="dianzhan-div">
                                        <i class="fa-regular fa-thumbs-up"></i>
                                        <span class="two-huifu-button">回复</span>
                                        <div class="two-write-comments-div">
                                            <textarea class="two-write-comments"></textarea>
                                            <div class="two-buttons">
                                                <span class="two-okButton" data-ancestor_id="${ancestor_id}" data-my_id="${newId}" data-name=${user.username}>发送</span>
                                                <span class="two-noButton">取消</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                    `;
                            lower_comments_list[i].appendChild(lower_comments_list_li);

                            let two_huifu_button = lower_comments_list_li.getElementsByClassName("two-huifu-button");
                            let two_write_comments_div = lower_comments_list_li.getElementsByClassName("two-write-comments-div");
                            /*新添加的绑定js事件*/
                            for (let i = 0; i < two_huifu_button.length; i++) {
                                two_huifu_button[i].addEventListener("click",function (){
                                    if(two_huifu_button[i].textContent==="回复"){
                                        two_huifu_button[i].textContent="取消";
                                        two_write_comments_div[i].style.display="flex";
                                    }else{
                                        two_huifu_button[i].textContent="回复";
                                        two_write_comments_div[i].style.display="none";
                                    }
                                })
                            }
                            for (const elementsByClassNameElement of lower_comments_list_li.getElementsByClassName("huifu-duixiang")) {
                                console.log(elementsByClassNameElement)
                                if(elementsByClassNameElement.dataset.ancestor_id===elementsByClassNameElement.dataset.receiver_id){
                                    elementsByClassNameElement.style.display="none";
                                }
                            }
                        }).catch(function (error) {
                            console.log(error);
                        });


                    }
                })
            }
        }).catch(function (error) {
            console.log(error);
        });
    }
})



















function bind(){

    let comments_number = document.getElementById("comments-number");
    comments_number.innerHTML=`
    共${sum}条评论
    `;

    let reply_button = document.getElementsByClassName("reply-button");
    let lower_comments_list = document.getElementsByClassName("lower-comments-list");
    for (let i = 0; i < reply_button.length; i++) {
        let flag = reply_button[i].getElementsByTagName("i")[0];
        reply_button[i].addEventListener("click",function (){
            if(flag.className==="fa-solid fa-angle-down"){
                lower_comments_list[i].style.display="block";
                flag.className="fa-solid fa-angle-up"
            }else{
                lower_comments_list[i].style.display="none";
                flag.className="fa-solid fa-angle-down";
            }
        })
    }
    let one_huifu_button = document.getElementsByClassName("one-huifu-button");
    let one_write_comments_div = document.getElementsByClassName("one-write-comments-div");
    for (let i = 0; i < one_huifu_button.length; i++) {
        one_huifu_button[i].addEventListener("click",function (){
            if(one_huifu_button[i].textContent==="回复"){
                one_huifu_button[i].textContent="取消";
                one_write_comments_div[i].style.display="flex";
            }else{
                one_huifu_button[i].textContent="回复";
                one_write_comments_div[i].style.display="none";
            }
        })
    }
    let two_huifu_button = document.getElementsByClassName("two-huifu-button");
    let two_write_comments_div = document.getElementsByClassName("two-write-comments-div");
    for (let i = 0; i < two_huifu_button.length; i++) {
        two_huifu_button[i].addEventListener("click",function (){
            if(two_huifu_button[i].textContent==="回复"){
                two_huifu_button[i].textContent="取消";
                two_write_comments_div[i].style.display="flex";
            }else{
                two_huifu_button[i].textContent="回复";
                two_write_comments_div[i].style.display="none";
            }
        })
    }
    for (const elementsByClassNameElement of document.getElementsByClassName("huifu-duixiang")) {
        console.log(elementsByClassNameElement)
        if(elementsByClassNameElement.dataset.ancestor_id===elementsByClassNameElement.dataset.receiver_id){
            elementsByClassNameElement.style.display="none";
        }
    }

    let one_okButton = document.getElementsByClassName("one-okButton");
    let one_write_comments = document.getElementsByClassName("one-write-comments");
    for (let i = 0; i < one_okButton.length; i++) {
        one_okButton[i].addEventListener('click',function (){
            if(one_write_comments[i].value){
                let content = one_write_comments[i].value;
                one_write_comments[i].value="";
                let ancestor_id = one_okButton[i].dataset.ancestor_id;
                let receiver_id = one_okButton[i].dataset.my_id;
                let name = one_okButton[i].dataset.name;
                const now = new Date();
                const year = now.getFullYear();
                const month = String(now.getMonth() + 1).padStart(2, "0");
                const day = String(now.getDate()).padStart(2, "0");
                const hours = String(now.getHours()).padStart(2, "0");
                const minutes = String(now.getMinutes()).padStart(2, "0");
                const seconds = String(now.getSeconds()).padStart(2, "0");
                const time = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;

                axios.get('http://localhost:8080/Ly/comment/addComments_two', {
                    params:{
                        mailbox: user.mailbox,
                        time:time,
                        content:content,
                        song_id:id,
                        receiver_id:receiver_id,
                        ancestor_id:ancestor_id
                    }
                }).then(function (response) {
                    console.log(response.data)
                    let newId = response.data.newId;

                    let lower_comments_list_li = document.createElement("li");
                    lower_comments_list_li.className="lower-comments-list-li";
                    lower_comments_list_li.innerHTML=`
                            <div class="yiji-comments">
                                <div class="img">
                                    <img src=${user.avatar} class="comments-avatar">
                                </div>
                                <div class="content">
                                    <div class="uname-div">
                                        <span class="uname">${user.username}</span>
                                        <div class="huifu-duixiang" data-ancestor_id="${ancestor_id}" data-receiver_id="${receiver_id}">
                                            <i class="fa-solid fa-arrow-right" style="color: #31c27c;"></i>
                                            <span class="erji-uname">${name}</span>
                                        </div>
                                    </div>
                                    <span class="send-time">${time}</span>
                                    <span class="lower-comments-content">${content}</span>
                                    <div class="dianzhan-div">
                                        <i class="fa-regular fa-thumbs-up"></i>
                                        <span class="two-huifu-button">回复</span>
                                        <div class="two-write-comments-div">
                                            <textarea class="two-write-comments"></textarea>
                                            <div class="two-buttons">
                                                <span class="two-okButton" data-ancestor_id="${ancestor_id}" data-my_id="${newId}" data-name=${user.username}>发送</span>
                                                <span class="two-noButton">取消</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                    `;
                    lower_comments_list[i].appendChild(lower_comments_list_li);

                    let two_huifu_button = lower_comments_list_li.getElementsByClassName("two-huifu-button");
                    let two_write_comments_div = lower_comments_list_li.getElementsByClassName("two-write-comments-div");
                    /*新添加的绑定js事件*/
                    for (let i = 0; i < two_huifu_button.length; i++) {
                        two_huifu_button[i].addEventListener("click",function (){
                            if(two_huifu_button[i].textContent==="回复"){
                                two_huifu_button[i].textContent="取消";
                                two_write_comments_div[i].style.display="flex";
                            }else{
                                two_huifu_button[i].textContent="回复";
                                two_write_comments_div[i].style.display="none";
                            }
                        })
                    }
                    for (const elementsByClassNameElement of lower_comments_list_li.getElementsByClassName("huifu-duixiang")) {
                        console.log(elementsByClassNameElement)
                        if(elementsByClassNameElement.dataset.ancestor_id===elementsByClassNameElement.dataset.receiver_id){
                            elementsByClassNameElement.style.display="none";
                        }
                    }


                }).catch(function (error) {
                    console.log(error);
                });
            }
        })
    }


    let two_okButton = document.getElementsByClassName("two-okButton");
    let two_write_comments = document.getElementsByClassName("two-write-comments");

    for (let j = 0; j < lower_comments_list.length; j++) {
        let two_okButton = lower_comments_list[j].getElementsByClassName("two-okButton");
        let two_write_comments = lower_comments_list[j].getElementsByClassName("two-write-comments");
        for (let i = 0; i < two_okButton.length; i++) {
            two_okButton[i].addEventListener("click",function (){
                let content = two_write_comments[i].value;
                if(content){
                    two_write_comments[i].value="";
                    let ancestor_id = two_okButton[i].dataset.ancestor_id;
                    let receiver_id = two_okButton[i].dataset.my_id;
                    let name = two_okButton[i].dataset.name;
                    const now = new Date();
                    const year = now.getFullYear();
                    const month = String(now.getMonth() + 1).padStart(2, "0");
                    const day = String(now.getDate()).padStart(2, "0");
                    const hours = String(now.getHours()).padStart(2, "0");
                    const minutes = String(now.getMinutes()).padStart(2, "0");
                    const seconds = String(now.getSeconds()).padStart(2, "0");
                    const time = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;

                    axios.get('http://localhost:8080/Ly/comment/addComments_two', {
                        params:{
                            mailbox: user.mailbox,
                            time:time,
                            content:content,
                            song_id:id,
                            receiver_id:receiver_id,
                            ancestor_id:ancestor_id
                        }
                    }).then(function (response) {
                        console.log(response.data)
                        let newId = response.data.newId;

                        let lower_comments_list_li = document.createElement("li");
                        lower_comments_list_li.className="lower-comments-list-li";
                        lower_comments_list_li.innerHTML=`
                            <div class="yiji-comments">
                                <div class="img">
                                    <img src=${user.avatar} class="comments-avatar">
                                </div>
                                <div class="content">
                                    <div class="uname-div">
                                        <span class="uname">${user.username}</span>
                                        <div class="huifu-duixiang" data-ancestor_id="${ancestor_id}" data-receiver_id="${receiver_id}">
                                            <i class="fa-solid fa-arrow-right" style="color: #31c27c;"></i>
                                            <span class="erji-uname">${name}</span>
                                        </div>
                                    </div>
                                    <span class="send-time">${time}</span>
                                    <span class="lower-comments-content">${content}</span>
                                    <div class="dianzhan-div">
                                        <i class="fa-regular fa-thumbs-up"></i>
                                        <span class="two-huifu-button">回复</span>
                                        <div class="two-write-comments-div">
                                            <textarea class="two-write-comments"></textarea>
                                            <div class="two-buttons">
                                                <span class="two-okButton" data-ancestor_id="${ancestor_id}" data-my_id="${newId}" data-name=${user.username}>发送</span>
                                                <span class="two-noButton">取消</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                    `;
                        lower_comments_list[j].appendChild(lower_comments_list_li);

                        let two_huifu_button = lower_comments_list_li.getElementsByClassName("two-huifu-button");
                        let two_write_comments_div = lower_comments_list_li.getElementsByClassName("two-write-comments-div");
                        /*新添加的绑定js事件*/
                        for (let i = 0; i < two_huifu_button.length; i++) {
                            two_huifu_button[i].addEventListener("click",function (){
                                if(two_huifu_button[i].textContent==="回复"){
                                    two_huifu_button[i].textContent="取消";
                                    two_write_comments_div[i].style.display="flex";
                                }else{
                                    two_huifu_button[i].textContent="回复";
                                    two_write_comments_div[i].style.display="none";
                                }
                            })
                        }
                        for (const elementsByClassNameElement of lower_comments_list_li.getElementsByClassName("huifu-duixiang")) {
                            console.log(elementsByClassNameElement)
                            if(elementsByClassNameElement.dataset.ancestor_id===elementsByClassNameElement.dataset.receiver_id){
                                elementsByClassNameElement.style.display="none";
                            }
                        }
                    }).catch(function (error) {
                        console.log(error);
                    });
                }
            })
        }
    }


}































