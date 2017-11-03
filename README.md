 LIGHTBOX总结
---------------------------------------

# Html代码总结

<div id=“G-lightbox-mask”></div>  //遮罩层

<div id=“G-lightbox-popup”></div>//弹出层

在弹出层加入所需的东西（图片区和标题区）

# CSS代码总结

1.左右按钮设置各为40%，中间留白。

2.标题区域移动时，margin：0 5px；留出左右边框。

3.left，top改为margin-left，margin-top调整位置

4.遮罩层和弹出层隐藏

# JQ代码总结

## 一、在html文件创建lightbox

$(function(){

var lightbox =new LightBox();

});

## 二、创建lightbox.js

面向对象的声明类

;(function($){

var LightBox=function(){

//创建遮罩和弹出框

//保存body

//渲染剩余的dom

renderDOM方法调用

//准备开发时间委托，获取组数据(调用getGroup方法)（调用初始化弹出 initPopup方法）

数据清零

定义数组

//获取图片的属性

点击事件（关闭按钮事件，遮罩层点击事件）关闭弹出框

点击事件（左右按钮）触发goto事件

}

LightBox.prototype={

//方法插件放置处

renderDOM方法

}

window[‘LightBox’]= LightBox;

})(JQuery)

## 三、方法：

1. renderDOM（渲染剩余dom）：

（1）把图片区和标题区的代码加入到一个dom节点上，插入到弹出层

（2）把遮罩层和弹出层一起插入到body里面

（3）注释掉html的弹出层和遮罩层

2.getGroup（提取group）

（1）根据当前的组别名臣获取页面中所有相同自别的对象

（2）循环数组push出src id caption

3\. initPopup（提取出图片的大小和各种值）

（1）获取src和id。

（2）调用showMaskAndPop方法把获取的src和id调用

4.showMaskAndPop

（1）隐藏预览图片和描述

（2）遮罩层和弹出层淡入

（3）回调函数loadPicSize

（4）根据当前点击的元素ID获取在当前组别里面的索引getIndex

（5）对图片位置的判断在prevbtn，在nextBtn是否加入disabled

5\. getIndex

（1）index输出

6.loadPicSize 加载图片

（1）  调用preLoadImg（source，function（）{}）来查看是否加载完

（2）加载完成调用changePic方法，显示图片，改变弹出框大小和图片适应

（3）显示图片和改变弹出框前，对图片一次清空

7.  preLoadImg （src，callback）图片是否加载完

（1）IE浏览器和其他浏览器处理不同返回callback（）又回调函数

8.changePic改变图片

1.判断图片和可视区的大小，进行变化（过滤）

2.把传递的弹出层的宽高减去border得到图片区域的大小

3.弹出框的添加动作，变成图片相符合的大小；

然后再水平居中和垂直居中

4.显示出图片和描述区

5.改变描述区的文字

9.goto事件

1.判断左右按钮，再判断是否为前一个和最后一个

2.前一个prev加入display，后一个next加入display

## 四、配置参数：

data-role='lightbox' 表示该元素要启用lightbox
data-group='group-1' 表示当前元素是否属于一个组 data-id='2' 表示该元素在该组别的索引值 data-caption='lightbox' 表示该元素的描述文字

class="js-lightbox"   

src="images/1-1.jpg" 表示原图图片的位置

## 五、知识：

1.;(function(){})()立即执行表达式等同于(function(){}())，;防止多个文件压缩集合后没有正确关闭，缺少；导致的错误

2.事件委托

this.bodyNody.on(‘click’,’img. js-lightbox ,*[data-role=lightbox]’,function(e){})

body.on(event,element, callback)

3.阻止事件冒泡

e.stopPropagation();

4.寻找参数*[data-rolo=’’]

5.清空数组 abbabab.Length=0；

6.可视区域：$(window).width();$(window).height();

7.图片大小为可视区高或宽的一半，弹出层为可视区高或宽的一半加上两边border的和

8.水平居中：弹出层的宽度的一半为margin-left的距离

垂直居中：可视区的高度减去弹出层的高度的一半

9\. IE 浏览器不支持图片的onload事件；

(1)IE独特支持window.ActiveObject对象，其他对象不支持；

(2)IE对图片的加载支持onreadystatechange 事件，同时加载完成为readyState == "complete"；

10.面向对象采用工厂模式


```
function factory(color,size,gender){//有个工厂
 var o = new Object();//做个样板
    o.color = color;
    o.size = size;
    o.gender = gender;
    o.mycolor= function(){
        console.log(this.color);

    }

    return o ;

}

var clothes = factory("red","L","man");
```


11.self当this指向的东西变化了采用self

12.委托时间对象不能添加阻止冒泡事件，阻止的是被委托对象的冒泡而不是对象本身的冒泡

13.Math.min(winWidth/pixWidth+10,winHeight/picHeight+10,1)

min() 方法可返回指定的数字中带有最低值的数字,.

如果宽大于视口，那么宽要乘以的系数必须要比 视口的宽度/图片的宽度 要小才行 （因为只有这样才能让图片在视口里）.

如果值小于1，取最小值。如果值大于1，取1.

14.*[data-rolo=’hhaha’], 其中*匹配所有元素
