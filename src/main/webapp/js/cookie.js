/**
 * 设置cookie/添加cookie
 * @param name
 * @param value
 * @param time
 */
function setCookie(name,value,time){
    let date= new Date();
    date.setDate(date.getDate()+time);
    document.cookie = name+"="+value+";expires="+date;
}

/**
 * 获得name获取cookie
 * @param cooNname
 * @returns {null|string}
 */
function getCookie(cookieName) {
    const name = cookieName + "=";
    const decodedCookie = decodeURIComponent(document.cookie);
    const cookieArray = decodedCookie.split(";");

    for (let i = 0; i < cookieArray.length; i++) {
        let cookie = cookieArray[i];
        while (cookie.charAt(0) === " ") {
            cookie = cookie.substring(1);
        }
        if (cookie.indexOf(name) === 0) {
            return decodeURIComponent(cookie.substring(name.length, cookie.length));
        }
    }
    return "";
}
/**
 * 删除cookie
 * @param name
 */
function removeCookie(name){
    setCookie(name,"",0)
}
