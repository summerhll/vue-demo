<template>
  <div class="wrap">
    <van-button  plain hairline type="info"  @click="goKeyIndex">使用index当key</van-button>
    <van-button  plain hairline type="info" @click="goTransitionKey">transition使用key</van-button>
    <van-button  plain hairline type="info" @click="goRouteChilden">嵌套路由（不设置默认页面）</van-button>
    <van-button  plain hairline type="info" @click="goRouteChildenTab">tab 嵌套路由（设置默认页面）</van-button>
    <van-button  plain hairline type="info" @click="goTab">tab v-show</van-button>
     <van-button  plain hairline type="info" @click="goModal">显示弹窗</van-button>
  </div>
</template>

<script>
export default {
  name: "jiaxuan",

  data() {
    return {};
  },

  methods: {
 

    goKeyIndex() {
      this.$router.push("demo/key");
    },
    goTransitionKey(){
       this.$router.push("demo/transition-key");
    },
    goRouteChilden(){
       this.$router.push("demo/route-children");
    },
     goRouteChildenTab(){
       this.$router.push("demo/route-children-tab");
    },

    goTab(){
       this.$router.push("demo/tab");
    },
    goModal(){
       this.$router.push("demo/modal");
    }
  }
};
</script>
<style lang = "less" scoped>
.wrap {
 margin: 0 0.15rem;
 .mint-button{
    margin:  0.15rem;

 }
}

</style>
