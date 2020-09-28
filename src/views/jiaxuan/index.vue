<template>
  <div class="wrap">
    <div class="box">
      <mt-button type="default" size="large" @click="goSlider">轮播</mt-button>
    </div>

    <div class="box">
      <mt-button type="default" size="large" @click="goLeftDelete">左滑删除</mt-button>
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
    goSlider() {
      this.$router.push("slider");
    },

    goLeftDelete() {
      this.$router.push("leftDelete");
    }
  }
};
</script>
<style lang = "less">
.box {
  margin-bottom: 20px;
}
</style>
