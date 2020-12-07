<template>
  <div class="wrap">
    <button @click.stop="change">切换</button>
    <p></p>
    <transition name="fade">
      <div v-if="show" key="box1" v-bury = "{data: 111}">
        <div class="item-box">1111</div>
      </div>
      <div v-else key="box2">
        <span>暂无更多</span>
      </div>
    </transition>
  </div>
</template>
<script>
export default {
  name: "transition-key",

  data() {
    return {
      show: true
    };
  },
  methods: {
    change() {
      this.show = !this.show;
    }
  }
};
</script>

<style lang = "less" scoped>
.wrap {
  padding: 0.2rem;
  font-size: 0.18rem;
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
</style>
