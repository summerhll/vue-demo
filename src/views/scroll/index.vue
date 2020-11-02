<template>
  <div class = "wrap">
    <div class= "box">
     <mt-button type="default" size="large" @click="goNoScroll">body无滚动 + 弹层无滚动</mt-button>
     </div>
      <div class= "box">
     <mt-button type="default" size="large" @click="goTwoLayout">两列自适应布局</mt-button>
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
<style lang = "less">
.box{
  margin-bottom: 20px;
}
</style>
