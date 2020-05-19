let oBox = document.getElementById("box");
/*
    1.创建初始化页面
        1.1.边框
        1.2.标题
        1.3.难度
    2.我军生成
    3.敌军生成
*/
init();
//***初始化页面
function init() {
    //创建初始页面 创建标题
    let h1 = document.createElement("h1");
    h1.innerHTML = `雷霆战机为所欲为究极PLUS版`;
    //将创建的标题放在盒子里
    oBox.appendChild(h1);

    //利用数组的方式将四个难度存起来
    let optionArr = ["简单模式", "容易模式", "困难模式", "地狱模式"];
    //循环生成四个难度
    for (let i = 0; i < optionArr.length; i++) {
        //创建四个难度盒子
        let oDiv = document.createElement("div");
        //四个难度加进去
        oDiv.innerHTML = optionArr[i];
        //给四个盒子添加类名方便给样式
        oDiv.className = "option";
        //下标值用自定义属性将得到的等级序号存起来
        oDiv.option = i;
        //每个选项添加点击事件 进入不同的等级
        oDiv.onclick = function() {
                //利用自定义属性拿到对应的等级序号
                startGame(this.option);
            }
            //将创建的难度盒子放进大盒子里
        oBox.appendChild(oDiv);
    }
}


//***游戏部分 点击难度之后开始游戏
function startGame(option) {
    //游戏开始之后清除初始化界面
    oBox.innerHTML = "";
    //给盒子添加类名
    oBox.className = "animate";
    //根据选择的难度更换背景图片 option 传参 对应的下标值
    oBox.style.backgroundImage = `url(img/bg${option+1}.png)`;
    //创建分数
    createScore();
    //游戏开始之后的我军 启动我军 发生碰撞时
    let plane = ownAir(option);
    //游戏开始之后的敌军 option 传参 通过自定义属性拿到对应的下标值
    enemAir(option, plane); //启动敌军
    //开启背景音乐
    let audio = document.createElement("audio");
    //添加背景音乐
    audio.src = "music/game_music.mp3";
    //打开音乐
    audio.autoplay = true;
    //循环播放
    audio.loop = true;
    //添加类名
    oBox.appendChild(audio);
}


//***我军生成 功能函数
function ownAir(option, e) {
    e = e || window.event;
    //创建我军飞机
    let ownPlane = document.createElement("img");
    //添加图片
    ownPlane.src = `img/plane2.png`;
    //修改飞机宽高
    ownPlane.style.width = 80 + "px";
    ownPlane.style.height = 60 + "px";
    //改变飞机位置 初始位置 整个盒子高度-飞机高度
    ownPlane.style.top = e.pageY - oBox.offsetHeight - 70 + "px";
    //整个盒子宽度的一半-飞机宽度的一半
    ownPlane.style.left = e.pageX - oBox.offsetWidth / 2 - 60 + "px";
    //将创建的飞机节点放在盒子里
    oBox.appendChild(ownPlane);

    //我军移动 数组控制 利用数组记录按下的键
    //飞机最大移动距离
    //飞机边界
    var leftMax, leftMin, topMax, topMin;
    leftMin = 0;
    leftMax = oBox.offsetWidth - ownPlane.width;
    topMin = 0;
    topMax = oBox.offsetHeight - ownPlane.height;

    //让飞机随着鼠标移动
    document.onmousemove = function(e) {
        e = e || window.event;
        let left = e.pageX - oBox.offsetLeft - ownPlane.width / 2,
            top = e.pageY - oBox.offsetTop - ownPlane.height / 2;
        //console.log(left)
        left = Math.max(left, leftMin);
        left = Math.min(left, leftMax);
        top = Math.max(top, topMin);
        top = Math.min(top, topMax);

        ownPlane.style.left = left + 'px';
        ownPlane.style.top = top + 'px';

    };




    //*****生成我军子弹
    //根据等级生成子弹间隔
    let arrTime = [200, 150, 150, 100];
    setInterval(() => {
        let biu = document.createElement("img");
        biu.src = `img/biu.png`;
        ////因为要用循环的方式遍历所有的子弹是否发生碰撞，所以要给子弹图片添加类名区分
        biu.className = "biu";
        biu.style.width = 80 + "px";
        biu.style.height = 80 + "px";
        biu.style.top = ownPlane.offsetTop - 50 + "px";
        biu.style.left = ownPlane.offsetLeft + 10 + "px";
        oBox.appendChild(biu);

        //让子弹飞
        biuFly();

        function biuFly() {
            biu.style.top = biu.offsetTop - 8 + "px";
            if (biu.offsetTop < 0) {
                oBox.removeChild(biu);
            } else {
                //取名 当我军与敌军发生碰撞时子弹清除动画 判断是否存在父节点然后结束动画
                ownPlane.parentNode && (biu.timer = requestAnimationFrame(biuFly));
            }
        }
    }, arrTime[option]);
    //将发生碰撞的我军的飞机返回出来 拿到240行代码用 需要在游戏部分用变量存起来
    return ownPlane;

    let audio = document.createElement("audio");
    //添加背景音乐
    audio.src = "music/enemy2_out.mp3";
    //打开音乐
    audio.autoplay = true;
    //循环播放
    audio.loop = true;
    //设置音量
    audio.volume = 0.1;
    //添加类名
    oBox.appendChild(audio);
}


//****敌军生成 功能函数
function enemAir(option, plane) {
    //根据不同等级生成飞机速度
    let arrTime = [600, 500, 200, 100];

    //获取计分板 谁先要渲染出来就写在前面
    let oScore = oBox.getElementsByClassName("score")[0];
    //敌军生成动画 定时器生成 给生成敌军的定时器取名 当敌军与我军发生碰撞时停止动画
    oBox.enmeyAirTime = setInterval(function() {
        //创建敌机图片
        let enemyPlane = document.createElement("img");
        //随机出现敌机
        let enemy_Air_Arr = ["img/enemy0.png", "img/enemy1.png", "img/enemy2.png", "", "img/enemy3.png", "img/enemy4.png"]
            //遍历敌军
        for (let i = 0; i < enemy_Air_Arr.length; i++) {
            //塞图片
            let j = Math.floor(Math.random() * i)
            enemyPlane.src = `img/enemy${j}.png`;
        }
        //设置宽高
        enemyPlane.style.width = 50 + "px";
        enemyPlane.style.height = 50 + "px";
        //设置敌军的位置 先让他的初始值为0
        enemyPlane.style.top = 0;
        //敌军位置随机 400-50 盒子宽度-飞机宽度
        enemyPlane.style.left = Math.random() * 350 + "px";
        //将创建的敌军放进盒子里
        oBox.appendChild(enemyPlane);

        //敌军随机速度
        let speed = Math.random() * 5 + 2;
        //启动
        enemyDown();
        //敌军下落
        function enemyDown() {
            //改变高度 飞机自身高度+下落速度
            enemyPlane.style.top = enemyPlane.offsetTop + speed + "px";
            //判断飞机是否飞出盒子 飞出移除 盒子高度-飞机高度
            if (enemyPlane.offsetTop >= 550) {
                oBox.removeChild(enemyPlane);
            } else {
                //获取生成的子弹
                let aBiu = oBox.getElementsByClassName("biu");
                //遍历所有生成的子弹
                for (let i = 0; i < aBiu.length; i++) {
                    //敌军在生成下落的时候要判断一下检测碰撞 传参 敌军 子弹
                    if (isCollision(aBiu[i], enemyPlane)) {
                        // console.log("碰到了")
                        //计分板
                        oBox.score += 100;
                        //添加计分板
                        oScore.innerHTML = oBox.score;
                        //敌军别子弹打中的爆炸效果 (敌军，初始位置)
                        Bong(enemyPlane, 0);
                        //清除子弹动画
                        cancelAnimationFrame(aBiu[i].timer)
                            //移除敌机 动画还在发生
                        oBox.removeChild(enemyPlane);
                        //移除打中的子弹
                        oBox.removeChild(aBiu[i]);
                        //取消子弹打中敌机后的动画
                        return false;
                    }
                }
                //检测我军与敌军发生的碰撞 判断是否存在我军父节点
                if (plane.parentNode && isCollision(plane, enemyPlane)) {
                    //我军爆照效果
                    Bong(plane, 1);
                    //清除敌军生成
                    clearInterval(oBox.enmeyAirTime);
                    //清除敌军
                    oBox.removeChild(enemyPlane);
                    //清除我军
                    oBox.removeChild(plane);
                    //发生碰撞之后返回出来 清除动画
                    return false;
                }
                //判定之后在执行动画   
                plane.parentNode && requestAnimationFrame(enemyDown);


            }

        }
        //根据点击的难度对应的下标值来设置敌军运动时间
    }, arrTime[option])
}


//***检测子弹是否与敌机发生碰撞 利用返回的布尔值来判断知否发生碰撞
function isCollision(obj, enemy) {
    //碰撞情况分析 我军飞机发生碰撞的情况
    let Top1 = obj.offsetTop;
    //获取内部样式有单位需要去除parseFloat 
    let Botton1 = obj.offsetTop + parseFloat(obj.style.height);
    let Left1 = obj.offsetLeft;
    let Right1 = obj.offsetLeft + parseFloat(obj.style.width);

    //敌军的位置
    let Top2 = enemy.offsetTop;
    //左边值+自身宽度  获取内部样式有单位需要去除parseFloat 
    let Botton2 = enemy.offsetTop + parseFloat(enemy.style.height);
    let Left2 = enemy.offsetLeft;
    let Right2 = enemy.offsetLeft + parseFloat(enemy.style.width);

    //判断子弹与敌军是否发生碰撞 只要满足所有条件就没有碰撞并改变布尔值
    if (Top1 > Botton2 || Left1 > Right2 || Botton1 < Top2 || Right1 < Left2) {
        return false;
    } else {
        return true;
    }
}


//***爆炸效果 2个参数 我军发生碰撞 敌军发生碰撞
function Bong(obj, i) {
    //获取obj爆炸对象获取 i 爆炸效果的筛选
    let bongArr = ["img/boom_small.png", "img/boom_big.png"];
    let img = document.createElement("img");
    //通过i获取是谁发生的爆炸
    img.src = bongArr[i];
    //修改图片大小 位置
    img.style.width = obj.style.width;
    img.style.height = obj.style.height;
    img.style.top = obj.offsetTop + "px";
    img.style.left = obj.offsetLeft + "px";
    oBox.appendChild(img);
    //如果我军发生爆炸 游戏结束
    setTimeout(function() {
        img.parentNode && oBox.removeChild(img);
        if (i === 1) {
            gameover()
        }
    }, 300)

    //清除动画
    setTimeout(function() {
        img.parentNode && oBox.removeChild(img)
    }, 300)

    let audio = document.createElement("audio");
    //添加背景音乐
    audio.src = "music/enemy3_down.mp3";
    //打开音乐
    audio.autoplay = true;
    //循环播放
    audio.loop = false;
    //添加类名
    oBox.appendChild(audio);
}


//***计算分数
function createScore() {
    //初始化分数板 写在敌军的碰撞里
    oBox.score = 0
    let div = document.createElement("div");
    div.className = "score";
    div.innerHTML = `得分${oBox.score}：`;
    oBox.appendChild(div);
}


//***游戏结束
function gameover() {
    //清空战场
    oBox.innerHTML = "";
    //清除动画
    oBox.className = "";
    //还原界面
    oBox.style.background = "";
    let overBox = document.createElement("div");
    overBox.className = "overBox";
    overBox.innerHTML = `<h2>游戏结束</h2><p>得分：${oBox.score}</p>`;
    oBox.appendChild(overBox);
    let gameStart = document.createElement("div");
    gameStart.className = "start";
    gameStart.innerHTML = "再来一次";
    gameStart.onclick = function() {
        oBox.innerHTML = "";
        init();
    }
    overBox.appendChild(gameStart);

    let audio = document.createElement("audio");
    //添加背景音乐
    audio.src = "music/game_over.mp3";
    //打开音乐
    audio.autoplay = true;
    //循环播放
    audio.loop = false;
    //添加类名
    oBox.appendChild(audio);
}