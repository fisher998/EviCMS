// 将时间转化成YYYY-MM-DD格式
export function translateTime(time) {
    if (time !== '') {
        let date = new Date(time);
        let Y = date.getFullYear() + '-';
        let M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
        let D = date.getDate() + ' ';
        return Y + M + D;
    }
}
// 将时间转换成YYYY-MM-DD HH:MM:SS
function add0(m) {
    return m < 10 ? '0' + m : m;
}
export function formatDate(needTime) {
    // needTime是整数，否则要parseInt转换
    if (needTime) {
        let time = new Date(needTime);
        let y = time.getFullYear();
        let m = time.getMonth() + 1;
        let d = time.getDate();
        let h = time.getHours();
        let mm = time.getMinutes();
        let s = time.getSeconds();
        return y + '-' + add0(m) + '-' + add0(d) + ' ' + add0(h) + ':' + add0(mm) + ':' + add0(s);
    }
}
// 判断元素是否在数组之中
export function contains(obj) {
    let arr = JSON.parse(localStorage.getItem('permission'));
    let i = arr.length;
    while (i--) {
        if (arr[i] === obj) {
            return true;
        }
    }
    return false;
}
