<template>
  <div class="following-shops-wrap">
    <left-delete @del-click = "unfollow">
      <div class="following-shops-item-wrap ">
        <div class="following-shops-item">
          <div class="img-wrap ">
            <img src="//img.souche.com/5F1DF224-F5B4-477A-935B-880F93DA9997.jpg" />
          </div>
          <div class="content-wrap">
            <h1>大搜车车行</h1>
            <p class="info">浙江省杭州市余杭区五常大道丰岭路26号</p>

            <div class="shop-info-wrap ">
              <div class="grayed">在售11辆</div>
              <div class="grayed">11米</div>
            </div>
          </div>
        </div>
      </div>
    </left-delete>

     <left-delete @del-click = "unfollow">
      <div class="following-shops-item-wrap ">
        <div class="following-shops-item">
          <div class="img-wrap ">
            <img src="//img.souche.com/5F1DF224-F5B4-477A-935B-880F93DA9997.jpg" />
          </div>
          <div class="content-wrap ">
            <h1>大搜车车行</h1>
            <p class="info">浙江省杭州市余杭区五常大道丰岭路26号</p>

            <div class="shop-info-wrap">
              <div class="grayed">在售11辆</div>
              <div class="grayed">11米</div>
            </div>
          </div>
        </div>
      </div>
    </left-delete>
  </div>
</template>

<script>
import leftDelete from "@/components/left-delete";

//左滑删除
export default {
  name: "following-shops",
  data() {
    return {
      delText: "删除"
    };
  },
  components: {
    leftDelete
  },
  methods: {
    unfollow() {
      alert("删除");
    }
  }
};
</script>

<style lang="less" scoped>
@tag-color: #f01d24;
@tag-color: var(--primary);
@detail-color: #8d8e99;
@item-border-color: #eee;
@highlight-color: #5e5e66;


.following-shops-item-wrap {
  display: flex;
  position: relative;
  padding-left: 16px;
   box-sizing: border-box;
 
  .closed {
    opacity: 0.5;
  }
  .grayed {
    color: @detail-color !important;
  }
  .following-shops-item {
    display:flex;
    flex: 1;
    padding: 16px 16px 16px 0;
    border-bottom: 0.5px solid @item-border-color;
  
    .img-wrap {
      position: relative;
      height: 81px;
      flex: 0 0 108px;
      overflow: hidden;
       box-sizing: border-box;
      & > img {
        width: 108px;
        height: 81px;
        vertical-align: top;
        border-radius: 8px;
        pointer-events: none;
        
      }
    }
    .content-wrap {
      flex: 1;
      margin: 0 0 0 10px;
       box-sizing: border-box;

      & > h1 {
        color: #1a1d33;
        font-size: 15px;
        margin: 0;
        padding-bottom: 4px;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .info {
        color: @detail-color;
        font-size: 12px;
        margin: 0 0 8px;
        line-height: 16px;
      }
      .tag-wrap {
        margin-bottom: 8px;
        line-height: 1;
        & > span {
          font-size: 12px;
          height: 16px;
          -webkit-box-sizing: border-box;
          font-family: "PingFangSC-Regular";
          box-sizing: border-box;
          padding: 0 2px;
          color: #f01d24;
          // opacity: 0.6;
          color: var(--primary);
          background: rgb(255, 237, 239, 0.6);
          border-radius: 3px;
          display: inline-block;
          line-height: 16px;
        }
      }
      .shop-info-wrap {
        display: flex;
        font-size: 13px;
        justify-content: space-between;
        align-items: center;
      }
      .invalid-label {
        color: @highlight-color;
        font-size: 14px;
        margin: 0;
        position: relative;
        font-weight: bold;
      }
    }
  }
}


</style>

