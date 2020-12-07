<template>
  <div class="wrap">
    <div class="box">
      <mt-button type="default" size="large" @click="goSlider">轮播</mt-button>
    </div>

    <div class="box">
      <mt-button type="default" size="large" @click="goLeftDelete">左滑删除</mt-button>
    </div>

    <div class="box">
      <mt-button type="default" size="large" @click="goConfigureDetail">配置详情</mt-button>
    </div>
    <div class="box">
      <mt-button type="default" size="large" @click="goPkDetail">对比详情</mt-button>
    </div>
  </div>
</template>

<script>
export default {
  name: "jiaxuan",

  data() {
    return {};
  },

  methods: {
    //跳转到swiper页面
    goSlider() {
      this.$router.push("slider");
    },

    //跳转到左滑删除页面
    goLeftDelete() {
      this.$router.push("leftDelete");
    },

    //跳转到配置详情页面
    goConfigureDetail() {
      this.$router.push("configureDetail");
    },

    //跳转到对比详情页面
    goPkDetail(){
      this.$router.push("pkDetail");

    }
  }
};
</script>
<style lang = "less" scoped>
.box {
  margin-bottom: 20px;
}
</style>
