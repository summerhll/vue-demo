<template>
  <div id="home">
     <van-button  plain type="primary"  @click="goDemo" class = "box"> demo</van-button>
     <van-button plain type="primary" @click="goLayout" class = "box"> 布局</van-button>
     <van-button  plain type="primary" @click="goJiaXuan" class = "box">家选</van-button>
     <van-button plain type="primary" @click="goScroll" class = "box">滚动透传</van-button>
  </div>
</template>

<script>
const STATUS_PENDING = Symbol('pending')
const STATUS_RESOLVED = Symbol('resolved')
const STATUS_REJECTED = Symbol('rejected')

function MyPromise(executor) {
   
  const that = this
  that.data = null
  that.status = STATUS_PENDING

  that.onResolvedCallback = []
  that.onRejectedCallback = []
  
  function resolve(value) {
    console.log("resolve")
    if (that.status !== STATUS_PENDING) {
      return
    }

    that.data = value
    that.status = STATUS_RESOLVED
     console.log("resolve: " + that.onResolvedCallback.length)
    for (let callback of that.onResolvedCallback) {
      callback(that.data)
    }
  }

  function reject(error) {
    if (that.status !== STATUS_PENDING) {
      return
    }

    that.data = error
    that.status = STATUS_REJECTED
    for (let callback of that.onRejectedCallback) {
      callback(that.data)
    }
  }

  try {
    // 默认是交给参数传入的回调函数来执行状态的变更
    executor(resolve, reject)
  } catch(error) {
    // 如果回调函数的执行发生错误，抛出异常
    // “主动”扭转状态
    reject(error)
  }
}

MyPromise.prototype.then = function (onfulfilled, onrejected) {
 
  const that = this

  onfulfilled = typeof onfulfilled === 'function' ? onfulfilled : function (v) { return v }
  onrejected = typeof onrejected === 'function' ? onrejected : function(reason) { throw reason }
  
  if (that.status === STATUS_RESOLVED) {
     console.log(2)
    const promise2 = new MyPromise((resolve, reject) => {
      try {
        const value = onfulfilled(that.data)
        if (value instanceof MyPromise) { 
          value.then(resolve, reject)
        } else {
          resolve(value)
        }
      } catch (error) {
        reject(error)
      }
    })
    return promise2
  }

  if (that.status === STATUS_REJECTED) {
      console.log(3)
    return new MyPromise((resolve, reject) => {
      try {
        const value = onrejected(that.data)
        if (value instanceof MyPromise) {
          value.then(resolve, reject)
        } else {
          resolve(value)
        }
      } catch (error) {
        reject(error)
      }
    })
  }

  if (that.status === STATUS_PENDING) {
  
    return new MyPromise((resolve, reject) => {
        console.log(1)
      that.onResolvedCallback.push(function () {
        try {
          const value = onfulfilled(that.data)
          if (value instanceof MyPromise) {
            value.then(resolve, reject)
          } else {
            resolve(value)
          }
        } catch (error) {
          reject(error)
        }
      })

      that.onRejectedCallback.push(function () {
        try {
         const value = onrejected(that.data)
          if (value instanceof MyPromise) {
            value.then(resolve, reject)
          } else {
            resolve(value)
          }
        } catch (error) {
          reject(error)
        }
      })
    })
  }
}

MyPromise.prototype.catch = function (onrejected) {
  return this.then(null, onrejected)
}

export default {
  name: "parent",
  components: {
    // child
  },
  data() {
    return {};
  },

  created() {
  
  //测试数据 待删除
    new MyPromise((resolve, reject)=>{ //eslint-disable-line
        setTimeout(()=>{
            resolve(4)
        }, 1000)

    }).then(()=>{
      console.log('result')
    })
  },

  methods: {
    goDemo(){
      this.$router.push("demo")

    },
    goLayout() {
      this.$router.push("layout");
    },
    goJiaXuan(){
      this.$router.push("jiaxuan")
    },
    goScroll(){
        this.$router.push("scroll")
    }
  }
};
</script>

<style lang="less" scoped>
  .box{
    margin-bottom: 20px;
  }

</style>
