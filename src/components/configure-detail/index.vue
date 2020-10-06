<template>
    <div class="configuration-details">
        <div class="detail-title">{{detail.name}}
            <div class="tips">
                <span class="dot standard">标配</span>
                <span class="none">无</span>
            </div>
        </div>
        <div class="detail-list">
            <div class="detail-item" v-for="(item, index) in detail.list" :key="index">
                <span class="item-name">{{item.name}}</span>
                <span class="item-value">{{item.value}}</span>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'ConfigurationDetails',
    props: {
        detail: {
            type: Object,
            default: () => ({})
        }
    }
};
</script>

<style lang="less" scoped>

 .configuration-details {
    background: #fff;
    color: #1a1d33;
    font-size: 13px;
    position: relative;
    .detail-title {
        position: sticky;
        z-index: 3;
        top: 0;
        left: 0;
        box-sizing: border-box;
        width: 100%;
        height: 36px;
        line-height: 36px;
        padding: 0 16px;
        background: #F7F8FA;
        display: flex;
        justify-content: space-between;
        overflow: hidden;
        span {
            margin-left: 16px;
            &:before {
                content: '-';
                display: inline-block;
                margin-right: 6px;
            }
        }
        .dot:before {
            content: '';
            width: 6px;
            height: 6px;
            box-sizing: border-box;
            border-radius: 100%;
            vertical-align: top;
            margin-top: 15px;
        }
        .standard:before {
            background: #1a1d33;
        }
        .choise:before {
            border: 1px solid #1a1d33;
        }
    }
    .detail-list {
        padding: 10px 16px;
        .detail-item {
            display: flex;
            border-bottom: #F2F3F5;
            &:last-child:after {
                height: 0;
            }
            .item-name {
                padding: 10px 0;
                display: inline-block;
                width: 122px;
                flex-shrink: 0;
            }
            .item-value {
                padding: 10px 0;
                overflow: hidden;
                white-space: nowrap;
                text-overflow: ellipsis;
            }
        }
    }
}


</style>