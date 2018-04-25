// 产生八位随机数
export function getRandomNum() {
    let t = '';
    for (let i = 0; i < 8; i++) {
        t += Math.floor(Math.random() * 10);
    }
    return t;
}
