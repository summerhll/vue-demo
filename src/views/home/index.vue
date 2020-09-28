<template>
  <div id="home">
    <mt-button type="default" size="large" @click="goLayout" class = "box"> 布局</mt-button>
     <mt-button type="default" size="large" @click="goJiaXuan" class = "box">家选</mt-button>
  </div>
</template>

<script>
export default {
  name: "parent",
  components: {
    // child
  },
  data() {
    return {};
  },

  created() {},

  methods: {
    goLayout() {
      this.$router.push("layout");
    },
    goJiaXuan(){
      this.$router.push("jiaxuan")
    }
  }
};
</script>

<style lang="less" scoped>
  .box{
    margin-bottom: 20px;
  }

</style>
