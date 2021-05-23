<template>
  <div class = "wrap">
    <div class= "box">
     <van-button type="default" size="large" @click="goNoScroll">body无滚动 + 弹层无滚动</van-button>
     </div>
      <div class= "box">
     <van-button type="default" size="large" @click="goTwoLayout">两列自适应布局</van-button>
      </div>
  </div>
</template>

<script>
export default {
  name: "layout",

  data() {
    return {};
  },

  methods: {
    goNoScroll() {
      this.$router.push("noScroll");
    },

    goTwoLayout(){
       this.$router.push("twoCols");

    },
  

  }
};
</script>
<style lang = "less" scoped>
.box{
  margin-bottom: 20px;
}
</style>
