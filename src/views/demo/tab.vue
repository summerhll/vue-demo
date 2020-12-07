<template>
  <div class="wrap">
    <ul>
      <li @click="cur=0" :class="{active:cur==0}">
        <span>全部</span>
      </li>
      <li @click="cur=1" :class="{active:cur==1}">
        <span>好评</span>
      </li>
      <li @click="cur=2" :class="{active:cur==2}">
        <span>差评</span>
      </li>
    </ul>


    <div class="show">
      <ul class="topnav-show" v-show="cur==0">
        <li>内容1</li>
      </ul>
      <ul class="topnav-show" v-show="cur==1">
        <li>内容2</li>
      </ul>
      <ul class="topnav-show" v-show="cur==2">
        <li>内容3</li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      cur: 0
    };
  }
};
</script>
<style lang="less" scoped>
.wrap{
    font-size : 0.16rem;
    padding: 0.15rem;
    box-sizing: border-box;
    
    ul{
        margin-bottom: 0.5rem;
    }
}
</style>