/**
 * Created by liujiabin on 2017/10/10.
 */
;(function ($) {
    var LightBox = function () {
        var self = this;

        //创建遮罩和弹出框
        this.popupMask = $('<div id="G-lightbox-mask"></div>');
        this.popupWin = $('<div id="G-lightbox-popup"></div>');

        //保存BODY
        this.bodyNode = $(document.body);

        //渲染剩余的DOM，并且插入到body下
        this.renderDOM();
        this.picViewArea = this.popupWin.find('div.lightbox-pic-view'); //图片预览区
        this.popupPic = this.popupWin.find('img.lightbox-image'); //获取图片
        this.picCaptionArea = this.popupWin.find('div.lightbox-pic-caption'); //图片说明文字
        this.prevBtn = this.popupWin.find('span.lightbox-prev-btn'); //左箭头
        this.nextBtn = this.popupWin.find('span.lightbox-next-btn'); //右箭头
        this.captionText = this.popupWin.find('p.lightbox-pic-desc'); //图片说明文字
        this.currentIndex = this.popupWin.find('span.lightbox-of-index'); //图片的索引
        this.closeBtn = this.popupWin.find('span.lightbox-close-btn'); //关闭按钮
        this.flag = true; //动画的在上一次没执行完，不执行下一次动画


        //准备开发事件委托，获取组数据
        this.groupName = null;
        this.groupData = [];//放置数据
        this.bodyNode.on('click', '.js-lightbox,*[data-role=lightbox]', function (e) {
            //阻止事件冒泡
            e.stopPropagation();
            // 点击每一个img元素,取得当前组的名
            var currentGroupName = $(this).attr("data-group");
            // 点击img，避免同一组的信息多次获取
            if (currentGroupName != self.groupName) {
                //清空数组
                self.groupData = [];
                self.groupName = currentGroupName;
                //根据当前组名获取同一组数据
                self.getGroup();
            };
            //初始化弹出
            self.initPopup($(this));
        });
        this.popupMask.click(function () {
            $(this).fadeOut();
            self.popupWin.fadeOut();

        });
        this.closeBtn.click(function () {
            self.popupWin.fadeOut();
            self.popupMask.fadeOut();
        });
        this.nextBtn.hover(function(){
            if(!$(this).hasClass('disabled')&&self.groupData.length>1){
                $(this).addClass("lightbox-next-btn-show");
            }
        },function () {
            if(!$(this).hasClass('disabled')&&self.groupData.length>1){
                $(this).removeClass("lightbox-next-btn-show");
            }
        }).click(function (e) {
            if(!$(this).hasClass('disabled')&&self.flag){
                self.flag=false;
                e.stopPropagation();
                self.goTo('next');
            }
        });
        this.prevBtn.hover(function(){
            if(!$(this).hasClass('disabled')&&self.groupData.length>1){
                $(this).addClass("lightbox-prev-btn-show");
            }
        },function () {
            if(!$(this).hasClass('disabled')&&self.groupData.length>1){
                $(this).removeClass("lightbox-prev-btn-show");
            }
        }).click(function (e) {
            if(!$(this).hasClass('disabled')&&self.flag){
                self.flag=false;
                e.stopPropagation();
                self.goTo('prev');
            }
        });

    };
    LightBox.prototype = {
        goTo:function (dir) {
            if(dir==='next'){
                this.index++;
                if(this.index>=this.groupData.length-1){
                    this.nextBtn.addClass('disabled').removeClass('lightbox-next-btn-show');
                }
                else if(this.index!=0){
                    this.prevBtn.removeClass('disabled');
                }
                var src=this.groupData[this.index].src;
                this.loadPicSize(src);

            }
            else if(dir==='prev'){
                this.index--;
                if(this.index>=this.groupData.length-1){
                    this.prevBtn.removeClass('disabled');
                }
                else if(this.index<=0){
                    this.prevBtn.addClass('disabled').removeClass('lightbox-prev-btn-show');
                }
                var src=this.groupData[this.index].src;
                this.loadPicSize(src);
            }
        },
        showMaskAndPopup:function (sourceSrc,currentiId) {
            var self = this;

            this.popupPic.hide();
            this.picCaptionArea.hide();

            this.popupMask.fadeIn();
            var winWidth = $(window).width(),
                winheight = $(window).height();
            // 把图片预览区设置为可视区域高宽的一半
            this.picViewArea.css({
                width: winWidth/2,
                height: winheight/2
            });
            this.popupWin.fadeIn();

            var viewHeight=winheight/2+10;

            this.popupWin.css({
                width: winWidth/2 + 10,
                height: winheight/2 +10,
                marginLeft:-( winWidth/2 + 10)/2,
                top:-viewHeight
            }).animate({
                top:(winheight-viewHeight)/2
            },function () {
                self.loadPicSize(sourceSrc);
            });
        //根据id获得索引
            this.index = this.getIndexOf(currentiId);
            //console.log(this.index )

            var groupDataLength=this.groupData.length;
            if(groupDataLength>1){
                if(this.index===0){
                    this.prevBtn.addClass("disabled");
                    this.nextBtn.removeClass("disabled");
                }else if(this.index===groupDataLength-1){
                    this.nextBtn.addClass("disabled");
                    this.prevBtn.removeClass("disabled");
                }else{
                    this.prevBtn.removeClass("disabled");
                    this.nextBtn.removeClass("disabled");
                }
            }
        },
        loadPicSize:function(sourceSrc){
            var self=this;
            self.popupPic.css({
                width:"auto",
                height:"auto",
            })
        this.preloadImg(sourceSrc,function () {
            self.popupPic.attr("src",sourceSrc);
            var picWidth=self.popupPic.width(),
                picHeight=self.popupPic.height();
            self.changePic(picWidth,picHeight);

        })
        },
        changePic:function(width,height){
            var self =this,
                winWidth=$(window).width(),
                winHight=$(window).height();

            var scale = Math.min(winWidth /(width + 10),winHight/ (height + 10),1);
            width = width*scale;
            height = height*scale;

            this.picViewArea.animate({
                width:width-10,
                height:height-10,
            });
            this.popupWin.animate({
                width:width,
                height:height,
                marginLeft:-(width/2),
                top:(winHight-height)/2
            },function () {
                self.popupPic.css({
                    width:width-10,
                    height:height-10
                }).fadeIn();
                self.picCaptionArea.fadeIn();
                self.flag=true;
            });
            this.captionText.html(this.groupData[this.index].caption);
            this.currentIndex.text("当前索引："+(this.index+1)+"of"+this.groupData.length);
        },
        preloadImg:function (src,callback) {
            var img =new Image();
            if(!!window.ActiveXObject){
                img.onreadystatechange=function(){
                    if(this.readyState=="complete"){
                        callback();
                    };
                };
            }else{
                img.onload=function () {
                    callback();
                }
            };
            img.src=src;
        },
        getIndexOf:function(currentiId){
            var index=0;
            $(this.groupData).each(function (i) {
                index=i;
                if (this.id===currentiId){
                    return false;
                }
            })
            return index;
        },
        initPopup: function (currentObj) {
            var self = this,
                sourceSrc = currentObj.attr("data-source"),
                currentiId = currentObj.attr("data-id");
            this.showMaskAndPopup(sourceSrc,currentiId)

        },
        renderDOM: function () {
            var strDom = '<div class="lightbox-pic-view">' +
                '<span class="lightbox-btn lightbox-prev-btn"></span>' +
                '<img class="lightbox-image" src="images/2-2.jpg"/>' +
                '<span class="lightbox-btn lightbox-next-btn "></span>' +
                '</div>' +
                '<div class="lightbox-pic-caption">' +
                '<div class="lightbox-caption-area">' +
                '<p class="lightbox-pic-desc"></p>' +
                '<span class="lightbox-of-index">当前索引：0 of 0</span>' +
                '</div>' +
                '<span class="lightbox-close-btn"></span>' +
                '</div>';
            //插入到popupWin
            this.popupWin.html(strDom);
            this.bodyNode.append(this.popupMask, this.popupWin);
        },
        getGroup: function () {
            var self = this;

            var groupList = this.bodyNode.find('*[data-group = ' + this.groupName + ']');
            groupList.each(function () {
                self.groupData.push({
                    id: $(this).attr('data-id'),
                    caption: $(this).attr('data-caption'),
                    src: $(this).attr('src')
                });
            });
        }
    };
    //弄到全局变量里
    window["LightBox"] = LightBox;
})(jQuery);