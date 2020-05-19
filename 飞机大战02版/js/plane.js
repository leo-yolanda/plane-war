(function(){
    var planeBox = document.getElementById("plane");
    //我方战机
    var planeO = document.getElementsByClassName("plane"),
        //敌方战机
        enemyP = document.getElementsByClassName("enemy");
    
    //获取奖励
    var prize = document.getElementsByClassName("prize"),
    //获取得分板
        score = document.getElementsByClassName("score");
  
    //获取区域宽 高
    var planeW = planeBox.clientWidth,
        planeH = planeBox.clientHeight;
    //定义敌机出现的频率
    var speedEnemy = [700, 400, 300, 200];
     //敌机信息
    var eneInfo = {
            strong: { //大机型
                width: 260,
                height: 200,
                blood: 6 //大家伙的 总血量
            },
            weak: { //小机型
                width: 108,
                height: 80,
                blood: 1 //小家伙的 血量
            }
        },
    //我方本机信息
    planeInfo = {
        strong: { //进化版
            width: 122,
            height: 95,
            srcFile: "img/plane_1.png"
        },
        weak: { //普通版
            width: 97,
            height: 97,
            srcFile: "img/plane_0.png"
        }
    };
    //界面初始化函数
        start()
        function start(){
        //清空界面
            planeBox.innerHTML = "";
            planeBox.className = "bg0"
            //存模式
            var pattern = ["简单模式","一般模式","困难模式","变态模式"]
            var H1 = document.createElement("h1");
                H1.innerHTML = "雷霆战机大乱斗版"
                planeBox.appendChild(H1)
                //生成目录
                for(var i=0;i<pattern.length;i++){
                   
                    div = document.createElement("div")
                    //存序号
                    div.num = i

                    div.innerHTML = pattern[i]
                    div.className = "option"
                    //生成后挂点击事件
                    div.onclick = function(e){
                        //点击启动游戏后传入序号和事件对象
                        startGame(this.num,e)
                    }
                    planeBox.appendChild(div)
                }
    }
    //游戏开始核心函数
    function startGame(num,e){//num下标 =>模式 e=>事件对象
        //清空界面
        planeBox.innerHTML = "";
        //定义敌军随机机型
        var ranP = ["weak","weak","weak","strong"]
        //更换背景
        planeBox.className = "bg" + (num+1) + " animate"
        //生成敌军函数，挂载到自定义属性上
        planeBox.eneTimer = setInterval(function(){
            //开启敌军函数
            enemy(num,ranP[randN(0,3)])
        },speedEnemy[num])
        //开启我军函数
        myPlane(e,num,"weak")//开始为固定机型
        //生成奖励函数挂载到大盒子自定义属性上
        planeBox.prizeTimer = setInterval(function () {
            reward_PP(["火力X1","火力X2","火力X3"][randN(0, 2)])
        },5500)
        //计分函数运行
        scoreRun()
        //开启背景音乐
        let audio = document.createElement("audio")
            audio.src = "img/game_music.mp3"
            audio.autoplay = true
            audio.loop = true
           planeBox.appendChild(audio)
    
        }
    //敌军生成函数
    function enemy(num,model){
        //num 模式 model 机型
        //敌机盒子
        var ene = document.createElement("div"),
        //总血条盒子
        bloodBox = document.createElement("div"),
        //血量条
        blood = document.createElement("p"),
        //飞机图片
        img = document.createElement("img");
        //敌机加类名，随机不同大小
        ene.className ="enemy " + model
        //血条加类名
        bloodBox.className = "blood"

        //记录机型以便后续判断敌军实力
        ene.model = model;

        //预存敌军血量好判断实力
        ene.blood = eneInfo[model].blood


        //飞机图片从定义的定军信息里面拿
        img.width = eneInfo[model].width
        img.height = eneInfo[model].height
        img.src = "img/enemy_" + model + ".png"
        

        // 创建的敌军 组装好 扔进 界面
        planeBox.appendChild(ene).appendChild(bloodBox).appendChild(blood);
        ene.appendChild(img);
        //起始位置为0
        ene.style.top = 0;
        //限制敌机的定位宽度
        ene.style.left = randN(0,planeW - ene.clientWidth) + "px"

        //随机下敌机下落的速度
        ene.speed = randN(1,2)
        //敌机运动函数
        eneMove()
        function eneMove(){
           ene.style.top = ene.offsetTop + ene.speed + "px"
             
            if(ene.offsetTop >= planeH - ene.offsetHeight){
                planeBox.removeChild(ene)
                cancelAnimationFrame(ene.move)
            }else{
                if(planeO[0] && boomPeng(planeO[0],ene)){
                     //true 相撞
                    boom(ene)//敌军爆炸
                    boom(planeO[0])//我军爆炸
                    gameOver()//游戏结束
                }
               ene.move = requestAnimationFrame(eneMove)
            }

        }
    }
    //我军生成函数
    function myPlane(e,num,model){
        var maxTop,
            maxLeft,
            minLeft;
            //创建我军
        var ownPlane = document.createElement("div"),
            img = document.createElement("img");
            img.src = planeInfo[model].srcFile;
            img.width = planeInfo[model].width;
            img.height = planeInfo[model].height;
            //添加类名
            ownPlane.className = "plane " + model
            //存下机型
            ownPlane.model = model
            //定义默认火力
            ownPlane.power = 0;
            //定义默认子弹列数
            ownPlane.bullet = 0;
            //塞到大盒子里
            planeBox.appendChild(ownPlane).appendChild(img)
            img.onload = function(){
                maxTop = planeH - ownPlane.offsetHeight;
                maxLeft = planeW - ownPlane.offsetWidth;
                minLeft = 0;
                //初始飞机位置
                ownPlane.style.top = e.clientY - planeBox.offsetTop - ownPlane.offsetHeight / 2 +"px"
                ownPlane.style.left = e.clientX - planeBox.offsetLeft - ownPlane.offsetWidth / 2 +"px"
            }
            //我军移动
            document.onmousemove = function (e) {
                // 改变后的 飞机的位置
                var changeT = e.clientY - planeBox.offsetTop - ownPlane.offsetHeight / 2
                var changeL = e.clientX - planeBox.offsetLeft - ownPlane.offsetWidth / 2
                //限定范围
                changeT = Math.max(changeT, 0)
                changeT = Math.min(changeT, maxTop)
                changeL = Math.min(changeL, maxLeft)
                changeL = Math.max(changeL, minLeft)
                //赋值我军位置
                ownPlane.style.top = changeT + "px";
                ownPlane.style.left = changeL + "px";
                //判断一下是否与奖励相撞
               
                for(var i =0;i < prize.length;i++){
                    if(boomPeng(ownPlane,prize[i])){//相撞函数执行  true =>相撞
                        if(prize[i].innerHTML === "火力X1"){//碰撞为火力时
                            //火力增加
                            ownPlane.power = 1;
                            ownPlane.bullet = 0;
                           
                        }else if(prize[i].innerHTML === "火力X2"){
                            //子弹输出列数增加
                            ownPlane.bullet = 1;
                        }else{
                            ownPlane.bullet = 2;
                        }
                        //更换机型和图片路径
                        ownPlane.model = "strong"
                        img.src = planeInfo[ownPlane.model].srcFile;
                        //清除下面的奖励消失的定时器
                        clearTimeout(prize[i].timer)
                        //同时移除奖励
                        planeBox.removeChild(prize[i])
                    }
                    
                }
            }
            //开始创建子弹
            //子弹生成频率
        var speed = 250,
        //子弹运动速度
            bullets = 5;
        //开启子弹生成函数
        planeBox.BBtimer = setInterval(function(){
            for(var i=0;i<=ownPlane.bullet;i++){
                send(i,ownPlane.power,ownPlane.bullet)
            }
        },speed)
        //子弹生成函数
        function send(i,power,bullet){
            
            var sendBB = document.createElement("img");
                sendBB.src = "img/fire.png"
                if(bullet > 0||power > 0){
                    sendBB.className = "biu strong2" 
                     //存子弹火力方便和血量计算
                    sendBB.power = power + 2
                }else{
                    sendBB.className = "biu strong1" 
                     //存子弹火力方便和血量计算
                    sendBB.power = power + 1
                }
               
               
                planeBox.appendChild(sendBB);
                sendBB.style.top = ownPlane.offsetTop + "px"
           
            //安排子弹的left值
            switch (bullet) {
                case 0:
                    //生成一排
                    sendBB.style.left = ownPlane.offsetLeft + ownPlane.offsetWidth / 2 - sendBB.offsetWidth / 2 + "px"
                    break;
                case 1:
                    //生成两排
                    sendBB.style.left = [ownPlane.offsetLeft, ownPlane.offsetLeft + ownPlane.offsetWidth - sendBB.offsetWidth][i] + "px";
                    break;
                case 2:
                    //生成三排
                    sendBB.style.left = [ownPlane.offsetLeft, ownPlane.offsetLeft + ownPlane.offsetWidth / 2 - sendBB.offsetWidth / 2, ownPlane.offsetLeft + ownPlane.offsetWidth - sendBB.offsetWidth][i] + "px"
                    break;
            }
            //子弹运行函数
           
            runBB()
            function runBB(){
                sendBB.style.top = sendBB.offsetTop - bullets +"px";
                
                //判断是否到达顶部
                if(parseFloat(sendBB.style.top)<=0){//到达顶部时
                        planeBox.removeChild(sendBB)
                        cancelAnimationFrame(sendBB.Timer)
                }else{//没有到达顶部时
                    sendBB.Timer = requestAnimationFrame(runBB)
                    
                    for(let i=0;i < enemyP.length;i++){
                     
                       if(boomPeng(sendBB,enemyP[i])){//碰撞为true
                            //损毁敌机血量
                            enemyP[i].blood -= sendBB.power

                            //计算血量条宽度 (血量/总血量 = 血条宽度/血条总宽度)
                            enemyP[i].children[0].children[0].style.width = (enemyP[i].blood / eneInfo[enemyP[i].model].blood) * enemyP[i].children[0].clientWidth + "px"
                           
                            //清除子弹动画
                            cancelAnimationFrame(sendBB.Timer)
                            //移除子弹
                            planeBox.removeChild(sendBB)

                            
                            //判断血量是否清空
                            if(enemyP[i].blood<=0){ //添加积分
                                
                               if(enemyP[i].model === "weak"){//小机型加5分
                                planeBox.score += 5
                                }else{//大机型加10
                                    planeBox.score += 10
                                }
                                boom(enemyP[i])//爆炸敌机
                                planeBox.attr++;
                            }
                            score[0].innerHTML = planeBox.score //添加积分内容
                        }
                    }

                }
            }

        }
     }
    
    //创建奖励
    function reward_PP(str){
        var div = document.createElement("div")
            div.className = "prize"
            div.innerHTML = str
            planeBox.appendChild(div)
            //给定随机位置
            div.style.top = randN(0,planeH - div.offsetHeight) + "px"
            div.style.left = randN(0,planeW - div.offsetWidth) + "px"
        //如果没接到过5秒消失
        div.timer = setTimeout(function(){
            planeBox.removeChild(div)
        },5000)
    }
    //判断是否相撞函数
     function boomPeng(ele1,ele2){
        var left1 = ele1.offsetLeft,
            top1 = ele1.offsetTop,
            bottom1 = ele1.offsetTop + ele1.offsetHeight,
            right1 = ele1.offsetLeft + ele1.offsetWidth,
            left2 = ele2.offsetLeft,
            top2 = ele2.offsetTop,
            bottom2 = ele2.offsetTop + ele2.offsetHeight,
            right2 = ele2.offsetLeft + ele2.offsetWidth;

        return left1 < right2 && top1 < bottom2 && right1 > left2 && bottom1 > top2
    }
    //爆炸函数
    function boom(ele){//炸毁
       var img = document.createElement("img");
           img.className = "boom";
           img.src = "img/boom_" + ele.model + ".png"
           //爆炸图片大小
            img.width = ele.clientWidth;
            img.height = ele.clientHeight;
            //爆炸图片位置
            img.style.top = ele.offsetTop + "px";
            img.style.left = ele.offsetLeft + "px";

            planeBox.appendChild(img)
            planeBox.removeChild(ele)
            //事件监听动画结束后移除img
            img.addEventListener("webkitAnimationEnd", function () {
            planeBox.removeChild(img)
        })
    }
    //积分函数
    function scoreRun(){
        var span = document.createElement("span")
            span.className = "score"
            //挂载自定义属性存值值好记录得分
            planeBox.score = 0;
            //初始积分盒子
            span.innerHTML = 0;
            //记录击落飞机数
            planeBox.attr = 0;
            planeBox.appendChild(span)
    }
    function gameOver(){
        let audio1 = document.createElement("audio")
                audio1.src = "img/game_over.mp3"
                audio1.autoplay = true
                audio1.loop = true
                planeBox.appendChild(audio1)
        //清除鼠标移动事件
        document.onmousemove = null;
        //清除敌机生成定时器
        clearInterval(planeBox.eneTimer)
        //清除生成奖励定时器
        clearInterval(planeBox.prizeTimer)
        //清除子弹生成定时器
        clearInterval(planeBox.BBtimer)
       
       //过一秒生成结算画面
        setTimeout(ggRecord,1000)
    }
    //结算画面
    function ggRecord(){
                //清空界面
                planeBox.innerHTML = "";
                //外面盒子
            var div = document.createElement("div"),
                //放击落数量
                p = document.createElement("p"),
                numBer = document.createElement("span")
                //放得分
                p1 = document.createElement("p"),
                numBer1 = document.createElement("span")
                //再来一次
                again = document.createElement("div")

                div.className = "record"
                p.innerHTML = "击落飞机"
                numBer.innerHTML = planeBox.attr
                p1.innerHTML = "恭喜你得分"
                numBer1.innerHTML = planeBox.score;
                again.className = "btn"
                again.innerHTML = "再来一次"
                again.onclick = function(){
                    start()
                }
                div.appendChild(p).appendChild(numBer)
                div.appendChild(p1).appendChild(numBer1)
                div.appendChild(again)
                planeBox.appendChild(div)
        }
    // //随机函数
    function randN(a,b){
        return Math.floor(Math.random()*(b-a+1)+a)
    }
})()