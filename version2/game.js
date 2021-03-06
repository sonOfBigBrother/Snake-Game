var ctx = document.querySelector("canvas").getContext("2d"),
    // 2d 对象
    
    direction = [
        { x: -1, y: 0 },
        { x: 0, y: -1 },
        { x: 1, y: 0 },
        { x: 0, y: 1 },
    ],
    // 方向列表，分别是 左 上 右 下 的位移增量，后面通过 keycode - 37 直接访问到该增量

    preDir = direction[1],
    // 当前方向，值为 direction 中四个元素之一

    food = { x: -1, y: -1 },
    // 食物的位置，初始化为 -1 ，第一次循环生成

    snkArr = [
        { x: 14, y: 20 },
        { x: 14, y: 21 },
        { x: 14, y: 22 },
    ];
// 蛇身

// 画方块，{x，y} 为方块的坐标，认为 20 * 20 为一个像素，实现中会做处理， color 为方块颜色
var draw = ({ x, y }, color) => (
    (ctx.fillStyle = color), ctx.fillRect(x * 20, y * 20, 19, 19), 1
);
// keydown 的回调
var changeDir = (e) => {
    // 禁止同方向变化
    Math.abs(e.keyCode - 37 - direction.indexOf(preDir)) != 2 &&
        // 禁止其他按键影响
        e.keyCode - 37 >= 0 &&
        // preDir 赋值
        e.keyCode - 37 <= 3 &&
        ((preDir = direction[e.keyCode - 37]),
            // 移除事件监听，防止两帧之间连续改变方向
            document.removeEventListener("keydown", changeDir));
};
setInterval(() => {
    // 添加事件监听
    // map 判断有没有碰到蛇身，碰到后置蛇头超出范围
    if (
        document.addEventListener("keydown", changeDir) ||
        (snkArr.map((val, i) => {
            snkArr[0].x + preDir.x == val.x &&
                snkArr[0].y + preDir.y == val.y &&
                (snkArr[0].x = 31);
        }) &&
            // 判断蛇头有没有超出范围
            !(
                snkArr[0].x + preDir.x >= 30 ||
                snkArr[0].y + preDir.y >= 30 ||
                snkArr[0].x + preDir.x <= -1 ||
                snkArr[0].y + preDir.y <= -1
            ))
    ) {
        // snkArr 蛇身增加新蛇头
        snkArr.unshift({ x: snkArr[0].x + preDir.x, y: snkArr[0].y + preDir.y });
        // 画蛇头
        draw({ x: snkArr[0].x, y: snkArr[0].y }, "#0aa");
        // 条件：if 碰到食物，（同时判断若食物未初始化则画食物）
        !(
            ((snkArr[0].x == food.x && snkArr[0].y == food.y) ||
                (food.x == -1 && draw(snkArr.pop(), "#ccc"))) &&
            // then 画食物
            draw(
                ((() => {
                    while (
                        snkArr.indexOf({
                            x: (food.x = ~~(Math.random() * 29)),
                            y: (food.y = ~~(Math.random() * 29)),
                        }) > -1
                    );
                })(),
                    food),
                "#fff"
            )
        ) &&
            // else 不去蛇尾（意为没碰到食物则去蛇尾）
            draw(snkArr.pop(), "#ccc");
    } else {
        // 游戏结束
        alert("Game over!", location.reload());
    }
}, 150);
