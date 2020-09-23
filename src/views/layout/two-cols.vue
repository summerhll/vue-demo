<template>
  <div class="two-cols-wrap">
    <div class="two-cols-box">
      <div class="left"></div>
      <div class="right">
        <div class="right-fix"></div>
      </div>
    </div>
  </div>
</template>

<style lang = "less">
.two-cols-box {
  margin-top: 20px;

  &::after {
    content: "";
    clear: both;
    display: block;
  }

  .left {
    float: left;
    width: 30px;
    height: 20px;
    background-color: black;
    position: relative;
  }
  .right {
    float: right;
    margin-left: -30px;
    width: 100%;
    height: 20px;

    .right-fix {
      margin-left: 40px;
      background-color: red;
      height: 20px;
    }
  }
}
</style>
