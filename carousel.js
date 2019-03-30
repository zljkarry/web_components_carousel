const templateCarousel = document.createElement('template')

templateCarousel.innerHTML = `

<div class="box" id="box">
    <div class="inner">
        <!--轮播图-->
        <ul id = "myul">
        </ul>
 
        <ol class="bar">
        </ol>

        <!--左右焦点-->
        <div id="arr">
                    <span id="left">
                        <
                    </span>
            <span id="right">
                        >
                    </span>
        </div>
 
    </div>
`
class Mycarousel extends HTMLElement {
    constructor() {
        super()

        const shadow = this.attachShadow({
            mode: 'open'
        });

        const div = document.createElement('div');
        const style = document.createElement('style');
        style.innerHTML = `
        * {
            margin: 0;
            padding: 0
        }
        
        .box {
            width: 500px;
            height: 300px;
            border: 1px solid #ccc;
            margin: 100px auto;
            padding: 5px;
        
        }
        
        .inner {
            width: 500px;
            height: 300px;
            position: relative;
            overflow: hidden;
        }
        
        .inner img {
            width: 500px;
            height: 300px;
            vertical-align: top
        }
        
        ul {
            width: 1000%;
            position: absolute;
            list-style: none;
            left: 0;
            top: 0;
        }
        
        .inner li {
            float: left;
        
        }
        
        ol {
            position: absolute;
            height: 20px;
            right: 20px;
            bottom: 20px;
            text-align: center;
            padding: 5px;
        }
        
        ol li {
            display: inline-block;
            width: 20px;
            height: 20px;
            line-height: 20px;
            background-color: #fff;
            margin: 5px;
            cursor: pointer;
        
        }
        
        ol .current {
            background-color: red;
        }
        
        
        
        #arr span {
            width: 40px;
            height: 40px;
            position: absolute;
            left: 5px;
            top: 50%;
            margin-top: -20px;
            background: #fff;
            cursor: pointer;
            line-height: 40px;
            text-align: center;
            font-weight: bold;
            font-family: '黑体';
            font-size: 30px;
            color: #000;
            opacity: 0.5;
            border: 1px solid #fff;
        }
        
        #arr #right {
            right: 5px;
            left: auto;
        }

        .hover{
			background: red;
        }

        `
        shadow.appendChild(style);
        shadow.appendChild(div);
        // initial state
        this.state = {};

    }


    my$(id) {
        return this.shadowRoot.getElementById(id);
    }


    // 当 custom element首次被插入文档DOM时，被调用
    connectedCallback() {
        //注入state
        this.state.sheets = this.getAttribute('sheets')
        this.state.a = this.getAttribute('transition-mode')
        this.state.time = parseInt(this.getAttribute('time'))
        // console.log('Custom square element added to page.');
        this.shadowRoot.appendChild(templateCarousel.content.cloneNode(true))


        // let sheets = 5;
        let myul = this.shadowRoot.getElementById('myul')
        for (let i = 0; i < this.state.sheets; i++) {
            let node = document.createElement("li");
            node.innerHTML = "<div><img src='./images/" + i + ".jpg'></div>"


            myul.appendChild(node);
        }


        //获取各元素，方便操作
        let box = this.my$("box");
        let inner = box.children[0];
        let ulObj = inner.children[0];
        let List = ulObj.children;
        let olObj = inner.children[1];
        let arr = this.my$("arr");
        let imgWidth = inner.offsetWidth;
        let right = this.my$("right");
        let left = this.my$("left");
        let pic = 0;

        //设置任意的一个元素,移动到指定的目标位置
        function animate(element, target) {
            clearInterval(element.timeId);
            //定时器的id值存储到对象的一个属性中
            element.timeId = setInterval(function () {
                //获取元素的当前的位置,数字类型
                let current = element.offsetLeft;
                //每次移动的距离
                let step = 10;
                step = current < target ? step : -step;
                //当前移动到位置
                current += step;
                if (Math.abs(current - target) > Math.abs(step)) {
                    element.style.left = current + "px";
                } else {
                    //清理定时器
                    clearInterval(element.timeId);
                    //直接到达目标
                    element.style.left = target + "px";
                }
            }, 10);
        }
        //根据li个数，创建小按钮
        for (let i = 0; i < List.length; i++) {
            let liObj = document.createElement("li");

            olObj.appendChild(liObj);
            liObj.innerText = (i + 1);
            liObj.setAttribute("index", i);


            



            //为按钮注册mouseover事件
            liObj.onmouseover = function () {
                //先清除所有按钮的样式

                for (let j = 0; j < olObj.children.length; j++) {
                    olObj.children[j].removeAttribute("class");
                }
                this.className = "current";
                pic = this.getAttribute("index");
                animate(ulObj, -pic * imgWidth);
            }

        }


        //设置ol中第一个li有背景颜色
        olObj.children[0].className = "current";
        //克隆一个ul中第一个li,加入到ul中的最后=====克隆
        ulObj.appendChild(ulObj.children[0].cloneNode(true));

        const switchover = () => {
            switch (this.state.a) {
                case 'lr':
                    onmouseclickHandle();
                    break;
                case 'opacity':
                    opacityFun();
                    break;
            }
        }



        let timeId = setInterval(switchover, this.state.time);
        //鼠标移入停止自动切换
        box.onmouseenter = function () {
            arr.style.display = "block";
            clearInterval(timeId);
            console.log(2)
        };
        //鼠标移出开始自动切换
        box.onmouseleave = function () {
            arr.style.display = "none";
            timeId = setInterval(switchover, this.state.time);

            console.log(3)
        };

        //透明度渐变
        function opacityFun() {
            let i = 0;
            i++;
            if (i == List.length) {
                i = 0;
            }
            if (i == -1) {
                i = List.length - 1;
            }
            //角标颜色随图片变化
            for (let j = 0; j < olObj.length; j++) {
                olObj[j].className = "";
            }
            olObj.children[i].className = "hover";
            //先将所有透明度都变为0，再将指定的那个变为1
            for (let m = 0; m < List.length; m++) {
                List[m].style.opacity = animate(List[m], {
                    "opacity": 0
                });
            }
            List[i].style.opacity = animate(List[i], {
                "opacity": 100
            });


        }


        //左右渐变
        function onmouseclickHandle() {
            //如果pic的值是5,恰巧是ul中li的个数-1的值,此时页面显示第六个图片,而用户会认为这是第一个图,
            //所以,如果用户再次点击按钮,用户应该看到第二个图片
            if (pic == List.length - 1) {
                //如何从第6个图,跳转到第一个图
                pic = 0; //先设置pic=0
                ulObj.style.left = 0 + "px"; //把ul的位置还原成开始的默认位置
            }
            pic++; //立刻设置pic加1,那么此时用户就会看到第二个图片了
            animate(ulObj, -pic * imgWidth); //pic从0的值加1之后,pic的值是1,然后ul移动出去一个图片
            //如果pic==5说明,此时显示第6个图(内容是第一张图片),第一个小按钮有颜色,
            if (pic == List.length - 1) {
                //第五个按钮颜色干掉
                olObj.children[olObj.children.length - 1].className = "";
                //第一个按钮颜色设置上
                olObj.children[0].className = "current";
            } else {
                //干掉所有的小按钮的背景颜色
                for (let i = 0; i < olObj.children.length; i++) {
                    olObj.children[i].removeAttribute("class");
                }
                olObj.children[pic].className = "current";
            }
        }

        //左右焦点实现点击切换图片功能
        right.onclick = onmouseclickHandle;
        left.onclick = function () {
            if (pic == 0) {
                pic = List.length - 1;
                ulObj.style.left = -pic * imgWidth + "px";
            }
            pic--;
            animate(ulObj, -pic * imgWidth);
            for (let i = 0; i < olObj.children.length; i++) {
                olObj.children[i].removeAttribute("class");
            }
            //当前的pic索引对应的按钮设置颜色
            olObj.children[pic].className = "current";
        };
    }
}


customElements.define('my-carousel', Mycarousel)