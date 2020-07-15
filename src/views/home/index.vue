<template>
  <div id="home">
   首页
  </div>
</template>

<script>
//import child from '../../components/child'
export default {
  name: 'parent',
  components: {
   // child
  },
   data(){
     return {
        message: 'Hello',
         items: [
            { message: 'Foo' },
            { message: 'Bar' }
          ]

     }
   },
  computed: {
    // 计算属性的 getter
    reversedMessage(){
      // `this` 指向 vm 实例
      return this.message.split('').reverse().join('')
    }
  },

   watch: {
    // 如果 `message` 发生改变，这个函数就会运行
    message(newValue, oldValue) {
         console.log( "watch reversedMessage ..." + oldValue +  '->' + newValue);
    }
  },

  created() {
    this.message = '111';
    console.log('I am parents created');
  },
 
}
</script>
