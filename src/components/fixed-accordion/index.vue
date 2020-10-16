<template>
    <div class="accordion-wrap">
         <!-- <div class="accordion" :style="{ top: stickyTop, left: stickyLeft }" @click="toggle"> -->
        <div class="accordion"  @click="toggle">
            <span>{{ title }}</span>
            <slot name="widgets"></slot>
            <span class="icon-wrap" > 切换
            </span>
        </div>
        <slot v-if="!innerCollapsed" v-bind:collasped="innerCollapsed"></slot>
    </div>
</template>

<script>
export default {
    name: 'fixed-accordion',
    props: {
        title: String,
        collapsed: {
            default() {
                return false;
            },
            type: Boolean
        },
        // stickyTop: {
        //     default() {
        //         return 'auto';
        //     },
        //     type: String
        // },
        // stickyLeft: {
        //     default() {
        //         return '0';
        //     },
        //     type: String
        // }        
    },
    data() {
        return {
            innerCollapsed: this.collapsed
        };
    },
    methods: {
        toggle() {
            this.innerCollapsed = !this.innerCollapsed;

            if (!this.innerCollapsed) {
                this.$nextTick(() => {
                    this.$emit('remount');
                });
            }
        }
    }
}
</script>

<style lang="less">
.accordion-wrap {
    background: #fff;
    
    .accordion {
        cursor: pointer;
        height: 48px;
         line-height: 48px;
        box-sizing: border-box;
        border-width: 1px 0 1px;
        border-style: solid;
        border-color: #EBEDF0;
        // position: sticky;
        // top: 0;
        // left: 0;
          padding: 0 16px;
   
         font-size: 14px;
        z-index: 1;
        background: #fff;

        .icon-wrap {
            float: right;
          
            right: 16px;
            color: #C4C5CC;
        }
    }
}
</style>

