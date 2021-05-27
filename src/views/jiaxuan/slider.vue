<template>
  <div class="pg-home-wrapper">
    <!-- :class="{ isIphonex: isIphonex() }" -->
    <div
      class="search-content"
      :class="{ 'lighter-search-content': lighterSearch }"
      ref="searchbarInFlow"
    >
      <div class="city-box">
        <span class="city-name">杭州</span>
        <span class="city-icon"></span>
      </div>
      <div class="search-box">
        <img
          class="search-icon"
          src="//img.souche.com/f2e/c780877cbb1aedab9c1d3a154ee15562.png"
          alt="search"
        />
        <span class="search-tip">{{ searchText }}</span>
      </div>
      <!--这一段必须要有，用于解决ios手机scroll事件触发低频问题-->
      <input class="test-input" v-model="curOpacityRate" />
    </div>
    <!--顶部样式-->
    <div class="top-wrapper">
      <div class="bg-wrapper bottom-layer" ref="bottomLayerWrapper"></div>
      <div class="bg-wrapper" ref="topWrapper"></div>

      <div
        class="search-content search-hidden"
        :class="{ 'lighter-search-content': lighterSearch }"
        ref="searchbarHiddenFlow"
      >
        <div class="city-box">
          <span class="city-name">杭州</span>
          <span class="city-icon"></span>
        </div>
        <div class="search-box">
          <img
            class="search-icon"
            src="//img.souche.com/f2e/c780877cbb1aedab9c1d3a154ee15562.png"
            alt="search"
          />
          <span class="search-tip">{{ searchText }}</span>
        </div>
      </div>

      <div class="banner-wrapper" ref="avatar">
        <div
          class="banner-content swiper-container"
          id="serviceSwiperContainer"
          v-if="homePage.length > 0"
        >
          <div class="swiper-wrapper">
            <div
              class="swiper-slide"
              :class="{
                                'swiper-no-swiping': homePage.length == 1
                            }"
              :key="index"
              v-for="(item, index) in homePage"
            >
              <img class="swiper-slide-img" :src="item.imgUrl" />
            </div>
          </div>
          <div class="swiper-pagination"></div>
        </div>
        <div v-else class="banner-content swiper-container banner-default-bg"></div>
      </div>
    </div>
    <div class="space">1111</div>
    <div class="space">1111</div>
    <div class="space">1111</div>
    <div class="space">1111</div>
    <div class="space">1111</div>
  </div>
</template>

<script>
/**引入swiper */
// import Swiper from "swiper/dist/js/swiper.js";
// import "swiper/dist/css/swiper.min.css";

 // import Swiper JS
  import Swiper from 'swiper';
  // import Swiper styles
  import 'swiper/swiper-bundle.css';
export default {
  name: "home",
  data() {
    return {
      serviceSwiper: null, //服务保障轮播图
      lighterSearch: false, //顶部搜索框背景色是否为白色
      homePage: [], //首页轮播
      curOpacityRate: "", //当前透明度
      start_y: "", //touch时的起始纵坐标
      searchText: "大搜车家选" //搜索栏文字
    };
  },


  methods: {
    //顶部搜索栏特效
    animateAvatar() {
      const { searchbarInFlow } = this.$refs;
      const scrollTop = window.scrollY;
      const opacityRate = scrollTop / 150; //背景色透明度
      this.curOpacityRate = opacityRate;
      searchbarInFlow.style.background =
        "rgba(255, 255, 255, " + opacityRate + ")";
      if (opacityRate > 0.4) {
        this.lighterSearch = true;
      } else {
        this.lighterSearch = false;
      }
    },

    //滚动条滚动事件
    subscribeScroll() {
      window.onscroll = () => {
        this.animateAvatar();
      };
    },
    //接触滚动条滚动事件
    unsubscribeScroll() {
      window.onscroll = null;
    },

    //初始化服务保障轮播图
    initServiceSwiper() {
      const _self = this;
      const isShowPagination = this.homePage.length > 1;
      let autoplay = isShowPagination
        ? {
            delay: 3000,
            stopOnLastSlide: false,
            disableOnInteraction: false
          }
        : false;
      let pagination = isShowPagination
        ? {
            el: ".swiper-pagination"
          }
        : {};
      if (_self.homePage.length == 1) {
        _self.$refs.topWrapper.style.background = _self.homePage[0].color;
        _self.$refs.bottomLayerWrapper.style.background =
          _self.homePage[0].color;
      }
      let touchStartX = "";
      const clientWidth =
        document.documentElement.clientWidth || document.body.clientWidth;
      const sliderWidth = clientWidth - 24;
      this.serviceSwiper = new Swiper("#serviceSwiperContainer", {
        initialSlide: 0,
        setWrapperSize: false,
        loop: isShowPagination,
        loopedSlides: _self.homePage.length,
        watchSlidesProgress: true,
        watchSlidesVisibility: true,
        lazyLoading: true,
        longSwipesRatio: 0.3,
        noSwiping: !isShowPagination, //配合类名类名'swiper-no-swiping'使用，当bannner只有一条记录时，使该slide无法拖动
        observer: true,
        observeParents: true, //修改swiper的父元素时，自动初始化swiper
        slidesPerView: "auto", //自定义slider宽度
        autoplay: autoplay,
        pagination: pagination,
        on: {
          slideChangeTransitionStart() {
            let index = this.realIndex; //this 指向swiper
            let newBackground = _self.homePage[index].color;
            if (_self.$refs.topWrapper) {
              _self.$refs.topWrapper.style.background = newBackground;
              _self.$refs.topWrapper.style.opacity = 1;
            }
          },
          slideChangeTransitionEnd() {
            let index = this.realIndex; //this 指向swiper
            let newBackground = _self.homePage[index].color;
            if (_self.$refs.topWrapper) {
              _self.$refs.topWrapper.style.background = newBackground;
              _self.$refs.topWrapper.style.opacity = 1;
            }
            if (_self.$refs.bottomLayerWrapper) {
              _self.$refs.bottomLayerWrapper.style.background = newBackground;
            }
          },
          touchEnd() {
            let index = this.realIndex;
            let newBackground = _self.homePage[index].color;
            if (_self.$refs.topWrapper) {
              _self.$refs.topWrapper.style.background = newBackground;
              _self.$refs.topWrapper.style.opacity = 1;
            }
            if (_self.$refs.bottomLayerWrapper) {
              _self.$refs.bottomLayerWrapper.style.background = newBackground;
            }
          },
          touchStart(swiper,event) {
          
            const touches = event.targetTouches[0];
            touchStartX = touches.pageX; //记录触摸起点
          },
          //slider 滑动开始时背景色就开始变化 变换透明度，从0.3开始
          sliderMove(swiper,event) {
            const endTouches = event.targetTouches[0];
            let touchEndX = endTouches.pageX;
            const curSliderIndex = +event.srcElement.parentNode.getAttribute(
              "data-swiper-slide-index"
            ); //当前slider的索引
            const sliderTotal = _self.homePage.length;
            let toBeDisplayedIndex; //待展示的slider的索引
            if (touchEndX > touchStartX) {
              //向右滑动
              toBeDisplayedIndex =
                curSliderIndex > 0 ? curSliderIndex - 1 : sliderTotal - 1;
            } else {
              //向左滑动
              toBeDisplayedIndex =
                curSliderIndex < sliderTotal - 1 ? curSliderIndex + 1 : 0;
            }
            let slideDiff = Math.abs(touchEndX - touchStartX); //滑动距离
            let slidePercent = slideDiff / sliderWidth;
            let newBackground = _self.homePage[toBeDisplayedIndex].color;
            if (_self.$refs.topWrapper) {
              _self.$refs.topWrapper.style.background = newBackground;
              _self.$refs.topWrapper.style.opacity = slidePercent;
            }
          }
        }
      });
      this.serviceSwiper.update(); //更新slider
      //首页banner的跳转地址需要后台配置
      this.serviceSwiper.slides.on("click", this.goToBannerDetail, true); //兼容IOS手机和android手机
    },

    //跳转到banner对应的详情页
    goToBannerDetail() {
      //跳转到对应的营销页  防抖
    },

    //获取banner列表，对接春娇
    //跳转地址链接和图片地址 都支持http和https协议，但是返回的都是http
    getBannerListByPosition() {
      this.serviceSwiper && this.serviceSwiper.destroy();
      this.homePage = [
        {
          imgUrl: " //img.souche.com/f2e/f851e1d3f5533a33d9aabed84004bd07.png",
          color: "#bd1923"
        },
        {
          imgUrl:
            "http://img.souche.com/20200113/jpg/f5f30a3cff9325d95e5f6a81a56ecbd9.jpg",

          color: "blue"
        },
        {
          imgUrl: " //img.souche.com/f2e/f851e1d3f5533a33d9aabed84004bd07.png",
          color: "black"
        }
      ];

     // nextTick 应用：echarts画图，swiper初始化数据
      this.$nextTick(() => {
        // 下一个UI帧再初始化swiper
        this.initServiceSwiper();
      });
    },

    //获取状态栏及刘海高度
    // getBarHeight () {
    //     if (Tower.app && this.isAndroid()) {
    //         Tower.agreement(DST.GET_STATUS_BAR, null, res => {
    //             //isNotchScreen 是否是刘海屏手机
    //             //statusBarHeight 状态栏高度或刘海屏高度
    //             this.$refs.searchbarInFlow.style.paddingTop =
    //                 res.statusBarHeight + "px";
    //             this.$refs.searchbarHiddenFlow.style.paddingTop =
    //                 res.statusBarHeight + "px";
    //             this.$refs.avatar.style.paddingTop =
    //                 72 + res.statusBarHeight - 20 + "px";
    //             //刘海屏
    //             this.$refs.topWrapper.style.height =
    //                 193.5 + res.statusBarHeight - 20 + "px";
    //         });
    //     }
    // },

    //修复顶部下拉刷新时，搜索框消失的bug
    //如果只使用一个fixed定位的搜索框，那么在执行下拉刷新的操作时，该搜索框会消失
    //因此需要添加一个absolute定位的搜索框，且它只在下拉刷新的时候出现
    pullRefresh() {
      const { searchbarInFlow, searchbarHiddenFlow } = this.$refs;
      document.addEventListener("touchstart", event => {
        let touch = event.targetTouches[0]; //获取第一个触点
        this.start_y = Number(touch.pageY); //第一个触点的Y坐标
      });

      document.addEventListener("touchmove", event => {
        let scrollTop =
          document.documentElement.scrollTop || document.body.scrollTop;
        //处于页面顶部时下拉刷新才起作用
        if (scrollTop <= 0) {
          let touch = event.targetTouches[0]; //获取第一个触点
          //获取手指向下移动的长度距离
          let end_y = Number(touch.pageY) - this.start_y;
          if (end_y > 5) {
            //防止手误操作
            searchbarInFlow.style.opacity = 0;
            searchbarHiddenFlow.style.opacity = 1;
          }
        } else {
          searchbarInFlow.style.opacity = 1;
          searchbarHiddenFlow.style.opacity = 0;
        }
      });
    }
  },

  //页面销毁时 删除滚动条监听事件
  beforeDestroy() {
    if (typeof this.unsubscribeScroll === "function") {
      this.unsubscribeScroll();
    }
  },
  mounted() {
    this.subscribeScroll(); //监听滚动条滚动事件
    this.pullRefresh(); //下拉刷新
    //this.getBarHeight(); //调用协议获取安卓手机状态栏高度，兼容安卓刘海屏手机
    this.getBannerListByPosition();
  }
};
</script>

<style lang="less" scoped>
.isIphonex {
  .search-content {
    padding-top: env(safe-area-inset-top) !important;
    padding-top: const(safe-area-inset-top) !important;
  }

  .banner-wrapper {
    padding-top: calc(72px + env(safe-area-inset-top) - 20px) !important;
    padding-top: calc(72px + const(safe-area-inset-top) - 20px) !important;
  }
  .bg-wrapper {
    height: calc(193.5px + env(safe-area-inset-top) - 20px) !important;
  }
}

/*
修复顶部搜索栏在IOS手机上的样式bug 滚动时颜色会突然变白
位置移到输入框处，防止点击它调起输入法（森刚手机会）
*/
.test-input {
  position: fixed;
  top: 26px;
  left: 100px;
  width: 10px;
  height: 0;
  opacity: 0;
}
.pg-home-wrapper {
  width: 100%;
  overflow: hidden;
  /*搜索栏样式*/
  .search-content {
    box-sizing: border-box;
    padding: 26px 16px 14px;
    display: flex;
    align-items: center;
    height: auto;
    z-index: 999;
    position: fixed;
    width: 100vw;
    top: 0;
    left: 0;
    .city-box {
      display: flex;
      align-items: center;
      .city-name {
        font-size: 15px;
        color: #fff;
      }
      .city-icon {
        width: 14px;
        height: 14px;
        margin-left: 4px;
        background: url("//img.souche.com/f2e/5e616057e36bbf6e848655b20429ebc5.png");
        background-size: 100% 100%;
      }
    }
    .search-box {
      display: flex;
      flex: 1;
      margin-left: 12px;
      margin-left: 12px;
      align-items: center;
      background: #fff;
      border-radius: 50px;
      width: 100%;
      height: 32px;
      justify-content: center;
      .search-icon {
        width: 16px;
        height: 16px;
        margin-right: 9px;
      }
      .search-tip {
        font-size: 13px;
        color: #5e5e66;
      }
    }

    &.lighter-search-content {
      .city-box {
        .city-name {
          color: #1b1c33;
        }
        .city-icon {
          background: url("//img.souche.com/f2e/43bc57176da35f87a70e0ef24ee12895.png");
          background-size: 100% 100%;
        }
      }
      .search-box {
        background: #ededf0;
        .search-tip {
          color: #8d8e99;
        }
      }
    }
  }

  .search-hidden {
    position: absolute;
    opacity: 0;
  }
  .top-wrapper {
    width: 100%;
    position: relative;
    .bg-wrapper {
      width: 100%;
      height: 193.5px;
      transition: background 0.2s;
      position: absolute;
      background: rgb(237, 237, 240);
      z-index: 2;
      &.bottom-layer {
        z-index: 1;
      }
    }
    .banner-wrapper {
      position: relative;
      padding-top: 72px;
      width: 100%;
      min-height: calc((100vw - 32px) * 0.4491);
      .banner-content {
        width: 100%;
        &.banner-default-bg {
          height: calc((100vw - 32px) * 0.4491);
          background: #ededf0;
        }
      }

      /deep/ .swiper-container {
        z-index: 10;
        .swiper-pagination {
          bottom: 6px;
        }
        .swiper-pagination-bullet {
          width: 6px;
          height: 6px;
          background: rgba(255, 255, 255, 1);
          opacity: 0.3;
          margin: 0;
          margin-right: 4px;
        }
        .swiper-pagination-bullet-active {
          opacity: 1;
        }

        .swiper-wrapper {
          height: auto;
          .swiper-slide {
            position: relative;
            display: inline-block;
            vertical-align: top;
            border-radius: 8px;
            overflow: hidden;
            width: calc(100vw - 32px);
            height: auto;
            margin-left: 16px;
            &:last-child {
              margin-right: 16px;
            }
            .swiper-slide-img {
              width: 100%;
              height: auto;
              vertical-align: top;
              position: relative;
              border-radius: 8px;
            }
          }
        }
      }
    }
  }

  .space {
    width: 100%;
    height: 200px;
    background: blue;
  }
}
</style>
