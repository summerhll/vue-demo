<template>
  <div class = "wrap">
    <h1>因为这个解决的方法是简单粗暴的让body：overflow-hidden，所以触发弹层出来的按钮最好在最顶部，也就是用户不翻页下滑前就能调出弹层。<span style="color: tomato">具体解析在控制台输出~</span></h1>
    <button id="btn" @click = "showModal">点击出弹层</button>
     <div class="layer" id="layer">
      <div class="layer-box">
        <div class="close" id="close" @click = "close">X</div>
        <div class="layer-cont">百度图片使用世界前沿的人工智能技术,为用户甄选海量的高清美图,用更流畅、更快捷、更精准的搜索体验,带你去发现多彩的世界。</div>
        <div class="btns">
          <div class="btn-confirm">确认</div>
          <div class="btn-cancel">取消</div>
        </div>
      </div>
    </div>
     
    <div class="for-height">
      为了称高度 - 百度图片使用世界前沿的人工智能技术,为用户甄选海量的高清美图,用更流畅、更快捷、更精准的搜索体验,带你去发现多彩的世界。
      <img src="http://www.pptbz.com/pptpic/UploadFiles_6909/201203/2012031220134655.jpg" alt="">
      百度图片使用世界前沿的人工智能技术,为用户甄选海量的高清美图,用更流畅、更快捷、更精准的搜索体验,带你去发现多彩的世界。
     <img src="http://www.pptbz.com/pptpic/UploadFiles_6909/201203/2012031220134655.jpg" alt="">
      百度图片使用世界前沿的人工智能技术,为用户甄选海量的高清美图,用更流畅、更快捷、更精准的搜索体验,带你去发现多彩的世界。
      <img src="http://www.pptbz.com/pptpic/UploadFiles_6909/201203/2012031220134655.jpg" alt="">
      百度图片使用世界前沿的人工智能技术,为用户甄选海量的高清美图,用更流畅、更快捷、更精准的搜索体验,带你去发现多彩的世界。
      为了称高度 - 百度图片使用世界前沿的人工智能技术,为用户甄选海量的高清美图,用更流畅、更快捷、更精准的搜索体验,带你去发现多彩的世界。
       <img src="http://www.pptbz.com/pptpic/UploadFiles_6909/201203/2012031220134655.jpg" alt="">
      百度图片使用世界前沿的人工智能技术,为用户甄选海量的高清美图,用更流畅、更快捷、更精准的搜索体验,带你去发现多彩的世界。
       <img src="http://www.pptbz.com/pptpic/UploadFiles_6909/201203/2012031220134655.jpg" alt="">
      百度图片使用世界前沿的人工智能技术,为用户甄选海量的高清美图,用更流畅、更快捷、更精准的搜索体验,带你去发现多彩的世界。
      <img src="http://www.pptbz.com/pptpic/UploadFiles_6909/201203/2012031220134655.jpg" alt="">
      百度图片使用世界前沿的人工智能技术,为用户甄选海量的高清美图,用更流畅、更快捷、更精准的搜索体验,带你去发现多彩的世界。
    </div>
    
  </div>
</template>

<script>
/** body无滚动 + 弹层无滚动 */
export default {
  name: "noScroll",

  data() {
    return {};
  },

  methods: {
   showModal(){
        document.getElementById("layer").style.display = 'block';
        document.body.style.overflow = 'hidden';
       document.body.style.position = 'fixed';//果然是因为加了fixed，就会自动回滚到顶部
   },
   close(){
         document.getElementById("layer").style.display = 'none';
      document.body.style.overflow = 'auto';
      document.body.style.position = 'static';
   }
  

  }
};
</script>
<style lang = "less" scoped>
/*
 * @Author: @Guojufeng 
 * @Date: 2019-03-15 09:22:19 
 * @Last Modified by: @Guojufeng
 * @Last Modified time: 2019-03-20 23:57:47
 */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
 
}

button {
  padding: .2rem 0;
  background: rgba(255, 0, 0, 0);
}

img,
button {
  display: block;
  width: 100%;
  margin: .2rem 0;
}

h1 {
  font-size: .34rem;
}

.box {
  font-size: .24rem;
  padding: .4rem;
  padding-bottom: .74rem;
}

.layer {
  display: none;
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background: rgba(0, 0, 0, 0.5);
}

.layer-box {
  width: 200px;
  padding-top: 1rem;
  border-radius: 8px;
  background: #fff;
  margin: 3rem auto 0;
  position: relative;
  font-size: .28rem;
  max-height: 300px;
  overflow-y: scroll;
  -webkit-overflow-scrolling: touch;/* 解决在IOS上滚动惯性失效的问题 */
}

.close {
  position: absolute;
  right: .4rem;
  top: .2rem;
  z-index: 1;
  font-size: .3rem;
  font-weight: 600;
  border: 1px solid;
  display: inline-block;
  /* float: right; */
  padding: .1rem .2rem;
  border-radius: 50%;
  color: #ddd;
}

.close:hover {
  color: #333;
}

.layer-cont {
  line-height: 1.5;
  margin-bottom: .54rem;
  padding: 0 .4rem;
}

.layer-list {
  padding: .4rem;
  list-style: none;
}

.btns {
  display: flex;
  justify-content: space-between;
  align-items: center;

  color: #08f;
  border-top: 1px solid #f1f1f1;
}

.btns div {
  padding: .2rem 0;
  flex: 1;
  text-align: center;
  border-right: 1px solid #f1f1f1;
}

div.btn-cancel {
  border-right: 0;
}

</style>
