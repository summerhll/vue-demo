<template>
  <div class="wrap">
    <mt-button size="small" @click="goKeyIndex">使用index当key</mt-button>
    <mt-button size="small" @click="goTransitionKey">transition使用key</mt-button>
    <mt-button size="small" @click="goRouteChilden">嵌套路由</mt-button>
    <mt-button size="small" @click="goRouteChildenTab">tab 嵌套路由</mt-button>
    <mt-button size="small" @click="goTab">tab v-show</mt-button>
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
