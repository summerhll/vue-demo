<template>
  <div class="wrap">
    <div class="border-box border-top">border-top</div>
    <div class="border-box border-bottom">border-bottom</div>
    <div class="border-box border-left">border-left</div>
    <div class="border-box border-right">border-right</div>
    <div class="border-box border">border</div>
  </div>
</template>

<script>
export default {
  name: "layout",

  data() {
    return {};
  },

  methods: {}
};
</script>
<style lang = "less" scoped>
.border-box {
  margin-top: 0.12rem;
  width: 100%;
  height: 1rem;
  background: red;
  font-size: 0.22rem;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
}
.border-top {
  .border-top-1px(black);
}
.border-bottom {
  .border-bottom-1px(black);
}
.border-left {
  .border-left-1px(black);
}
.border-right {
  .border-right-1px(black);
}
.border {
  .border-1px();
}
</style>
