<template>
  <div class="wrap">
    <input type="radio" value="0" v-model="show" /> 使用index作为key
    <br />
    <input type="radio" value="1" v-model="show" />
    不使用index作为key
    <br />


    <div class="box" v-if="show == 0">
      <h1>使用index作为key</h1>
      <div
        v-for="(item, index) in list"
        :key="index"
        @click.stop="handleDelete(index)"
      >{{ item.name}}</div>
    </div>
    <div class="box" v-if="show == 1">
      <h1>不使用index作为key</h1>
      <div
        v-for="(item2, index2) in list2"
        :key="item2.id"
        @click.stop="handleDelete2(index2)"
      >{{ item2.name}}</div>
    </div>
  </div>
</template>
<script>



export default {
  name: "parent",

  data() {
    return {
      show: "0",
      list: [
        {
          id: 1,
          name: "Person1"
        },
        {
          id: 2,
          name: "Person2"
        },
        {
          id: 3,
          name: "Person3"
        },
        {
          id: 4,
          name: "Person4"
        }
      ],
      list2: [
        {
          id: 1,
          name: "Person1"
        },
        {
          id: 2,
          name: "Person2"
        },
        {
          id: 3,
          name: "Person3"
        },
        {
          id: 4,
          name: "Person4"
        }
      ]
    };
  },

  methods: {
    handleDelete(index) {
      //当使用index作为key时，对所有的数据都进行了更新。
      this.list.splice(index, 1);
    },

    handleDelete2(index) {
      //当使用id作为key时，执行删除第一条数据时，就只删除了第一条数据，没有影响其他数据。
      this.list2.splice(index, 1);
    }
  }
};
</script>

<style lang = "less" scoped>
.wrap {
  padding: 0.2rem;
  font-size: 0.18rem;
}
</style>
