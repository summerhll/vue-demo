<template>
  <div class="wrap">
    <div class="float-box">
      <div class="left"></div>
      <div class="right"></div>
      <div class="middle"></div>
    </div>

  </div>
</template>

<script>
/** 
 * 三列布局, 左右定宽, 中间自适应
 */

export default {
  name: "layout",

  data() {
    return {};
  }
};
</script>

<style lang = "less">
.float-box {
  &::after {
    content: "";
    display: block;
    clear: both;
  }

  .left,
  .right {
    width: 60px;
    height: 30px;
  }

  .left {
    background-color: black;
    float: left;
  }
  .middle {
    background-color: red;
    margin-right: 70px;
    margin-left: 70px;
    height: 30px;
  }
  .right {
    background: green;
    float: right;
  }

}


</style>
