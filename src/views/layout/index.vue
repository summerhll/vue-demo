<template>
  <div class = "wrap">
    <div class= "box">
     <mt-button type="default" size="large" @click="goThreeLayout">三列布局</mt-button>
     </div>
      <div class= "box">
     <mt-button type="default" size="large" @click="goTwoLayout">两列自适应布局</mt-button>
      </div>
       <div class= "box">
     <mt-button type="default" size="large" @click="goBorder">1px</mt-button>
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
