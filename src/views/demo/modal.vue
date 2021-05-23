<template>
  <div class="wrap">
    <button style="position: fixed; top: 0" @click="showModal">显示弹窗</button>
    <div>测试弹窗</div>
    <div>测试弹窗</div>
    <div>测试弹窗</div>
    <div>测试弹窗</div>
    <div>测试弹窗</div>
    <div>测试弹窗</div>
    <div>测试弹窗</div>
    <div>测试弹窗</div>
    <div>测试弹窗</div>
    <div>测试弹窗</div>
    <div>测试弹窗</div>
    <div>测试弹窗</div>
    <div>测试弹窗</div>
    <div>测试弹窗</div>
    <div>测试弹窗</div>
    <div>测试弹窗</div>
    <div>测试弹窗</div>
    <div>测试弹窗</div>
    <div>测试弹窗</div>
    <div>测试弹窗</div>
    <div>测试弹窗</div>
    <div>测试弹窗</div>
    <div>测试弹窗</div>
    <div>测试弹窗</div>
    <div>测试弹窗</div>
    <div>测试弹窗</div>
    <div>测试弹窗</div>
    <div>测试弹窗</div>
    <div>测试弹窗</div>
    <div>测试弹窗</div>
    <div>测试弹窗</div>
    <div>测试弹窗</div>
    <modal :show.sync="show"></modal>
  </div>
</template>

<script>
/**
 * 模态窗
 */

import modal from "@/components/modal";
export default {
  data() {
    return {
      show: false,
    };
  },
  components: {
    modal,
  },
  methods: {
    showModal() {
      this.show = true;
    },
  },
};
</script>
