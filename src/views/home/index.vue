<template>
  <div id="home">
    <mt-button type="default" size="large" @click="goLayout">布局</mt-button>
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
    }
  }
};
</script>
