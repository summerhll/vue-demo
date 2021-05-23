<template>
  <div class = "wrap">
    <div class= "box">
     <van-button  plain hairline type="info"  @click="goThreeLayout">三列布局</van-button>
     </div>
      <div class= "box">
     <van-button  plain hairline type="info" @click="goTwoLayout">两列自适应布局</van-button>
      </div>
       <div class= "box">
     <van-button  plain hairline type="info"  @click="goBorder">1px</van-button>
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
    goThreeLayout() {
      this.$router.push("threeCols");
    },

    goTwoLayout(){
       this.$router.push("twoCols");
    },
    goBorder(){
      this.$router.push("border");
    }
  

  }
};
</script>
<style lang = "less" scoped>
.box{
  margin-bottom: 20px;
}
</style>
