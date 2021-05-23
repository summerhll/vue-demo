
<template>
  <div class="modal-outer-wrapper">
    <div class="mask" v-if="show" @click="closeMask"></div>
    <transition name="bounce">
      <div class="wrapper" v-if="show">
        <div class="main">
          <div>测试弹窗</div>
          <div>测试弹窗</div>
          <div>测试弹窗</div>
          <div>测试弹窗</div>
          <div>测试弹窗</div>
          <div>测试弹窗</div>
          <div>测试弹窗</div>
          <div>测试弹窗</div>
        </div>
      </div>
    </transition>
  </div>
</template>
<script>


export default {
  name: "Modal",
  data() {
    return {
      scrollTop: 0,
    };
  },
  props:{
      show : {
          type: Boolean, 
          default: false
      }
  },

  watch: {
    //弹窗显示时，通过设置body为fixed定位，并通过设置top值来实现Y方向偏移量，从而body禁止滚动，弹窗隐藏后恢复body static定位
    show(value) {
      if (value) {
        this.scrollTop =
          document.documentElement.scrollTop || document.body.scrollTop;
        document.body.style.cssText += `position: fixed;width: 100vw;left: 0;top: ${-this
          .scrollTop}px;`;
      } else {
        document.body.style.cssText += "position: static;";
        window.scrollTo(0, Math.abs(parseFloat(this.scrollTop)));
      }
    },
  },
  methods: {
    closeMask() {
       this.$emit("update:show", false);
    
    },
  },
};
</script>
<style lang="less" scoped>

.modal-outer-wrapper {
    color: #1A1D33;
    .mask {
        position: fixed;
        z-index: 100;
        left: 0;
        top: 0;
        width: 100vw;
        height:100vh;
        background: rgba(0, 0, 0, .75);
    }
    .wrapper {
        position: fixed;
        z-index: 201;
        bottom: 0;
        left: 0;
        width: 100%;
        box-sizing: border-box;
        background: #fff;
        height: 450px; 
    }

    .bounce-enter-active, .bounce-leave-active {
        transition: all .3s ease-in-out;
    }
    .bounce-enter, .bounce-leave-to {
        transform: translateY(100%);
    }
}

</style>