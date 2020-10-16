<template>
    <div :class="componentName"
         v-slide>
        <div class="left-delete__top"
             ref="slideItem"
             :style="wrapperStyle">
            <slot name="item"
                  v-if="$slots.item" />
            <slot v-else />
        </div>
        <div :class="`left-delete__del ${delCls}`"
             @click.stop="$emit('del-click')">
            <slot name="del"
                  v-if="$slots.del" />
            <span v-else>{{ delText }}</span>
        </div>
    </div>
</template>

<script>
//左滑删除组件
const COMPONENT_NAME = 'left-delete'; //组件名称
export default {
    name: COMPONENT_NAME,
    computed: {
        wrapperStyle () {
            return {
                transform: `translate3d(${this.offset}px, 0, 0)`,
                transition: '.6s cubic-bezier(0.18, 0.89, 0.32, 1)'
            }
        }
    },
    data () {
        return {
            delAreaWidth: 140, //滑块大小
            open: false,
            offset: 0,
            componentName: COMPONENT_NAME,
            sliderAngle: '' //当前的滑动角度
        }
    },
    props: {
        threshold: {
            type: Number,
            default: 70 //滑块的一半宽度
        },
        delCls: {
            type: String,
            default: 'left-delete__del-red'
        },
        delText: {
            type: String,
            default: '删除'
        }
    },
    methods: {
        getTouch (touch) {
            return touch.changedTouches[0] || touch.targetTouches[0]
        },
        isAngleLeft (diffX, diffY) {
            const x = Math.abs(diffX)
            const y = Math.abs(diffY)
            return !(x < 10 || (x >= 10 && y >= x * 0.58)); //角度大于30度 tan
        },
        isAngleTopBottom (diffX, diffY) { //判断是否是上下滑动
            const x = Math.abs(diffX)
            const y = Math.abs(diffY)
            return !(y < 10 || (y >= 10 && y < x * 0.58)); //角度小于30度 tan
        },
        setOpen (type = false) {
            this.open = type
            this.offset = type ? - this.delAreaWidth : 0
        },
        //关闭其他的列表项的删除按钮
        closeOther () {
            this.$parent.$children
                .filter(vNode =>
                    vNode.$el.classList.contains(this.componentName) &&
                    vNode.open &&
                    vNode !== this
                )
                .forEach(vNode => {
                    vNode.setOpen(false)
                })
        },
        //关闭所有列表项的删除按钮
        closeAll () {
            this.$parent.$children
                .filter(vNode =>
                    vNode.$el.classList.contains(this.componentName) &&
                    vNode.open
                )
                .forEach(vNode => {
                    vNode.setOpen(false)
                })

        }
    },
    directives: {
        slide: {
            bind (el, binding, vNode) {
                let startX, startY, diffX, diffY
                let vm = vNode.context
                el.addEventListener('touchstart', (e) => {
                    const { clientX, clientY } = vm.getTouch(e)
                    startX = clientX
                    startY = clientY
                    vm.sliderAngle = '';
                })
                el.addEventListener('touchmove', (e) => {
                    const { clientX, clientY } = vm.getTouch(e);
                    diffX = clientX - startX;
                    diffY = clientY - startY;

                    if (vm.sliderAngle) { //角度已经确认
                        if (vm.sliderAngle == "topBottom") {
                            vm.closeAll.call(vm, el)
                        } else {
                            // 判断默认行为是否可以被禁用
                            if (e.cancelable) { //preventDefault只有在cancelable为true时才可以取消，否则会报错
                                // 判断默认行为是否已经被禁用
                                if (!e.defaultPrevented) {
                                    e.preventDefault();
                                }
                            }
                            e.stopPropagation();
                            vm.offset = vm.open ? diffX - vm.delAreaWidth : diffX
                        }

                    } else {
                        if (vm.isAngleTopBottom(diffX, diffY)) { //上下滑动
                            vm.sliderAngle = "topBottom";
                            vm.closeAll.call(vm, el)
                        }
                        else if (
                            vm.isAngleLeft(diffX, diffY) &&
                            Math.abs(diffX) <= vm.delAreaWidth &&
                            (
                                diffX < 0 && !vm.open ||
                                diffX > 0 && vm.open
                            )
                        ) {
                            vm.sliderAngle = "leftRight";
                            // 判断默认行为是否可以被禁用
                            if (e.cancelable) { //preventDefault只有在cancelable为true时才可以取消，否则会报错
                                // 判断默认行为是否已经被禁用
                                if (!e.defaultPrevented) {
                                    e.preventDefault();
                                }
                            }
                            e.stopPropagation();
                            vm.offset = vm.open ? diffX - vm.delAreaWidth : diffX
                        }

                    }
                }, { passive: false });
                el.addEventListener('touchend', (e) => {
                    const { clientX, clientY } = vm.getTouch(e)
                    diffX = clientX - startX
                    diffY = clientY - startY
                    if (
                        diffX > 0 && diffX > vm.threshold ||
                        diffX < 0 && diffX > -vm.threshold
                    ) {
                        vm.open = false
                        vm.offset = 0
                    } else if (
                        vm.sliderAngle == "leftRight" &&
                        (
                            diffX < 0 && diffX <= -vm.threshold
                        )
                    ) {
                        vm.open = true
                        vm.offset = -vm.delAreaWidth
                        vm.closeOther.call(vm, el)
                        vm.$emit('slip-open', vm)
                    } 
                    // else if (
                    //     diffX > 0 && diffX > 10 ||
                    //     diffX < 0 && diffX > -10
                    // ) {
                    //     //排除偶尔出现的左滑到一半 卡住不动的情况
                    //     //diffX 大于10 才处理 防止click事件透穿
                     //这个是做家选项目的时候出现的特殊bug，做其他项目时可以先不写这步
                    //     vm.open = false
                    //     vm.offset = 0
                    // }
                    vm.sliderAngle = '';
                });
                document.addEventListener("scroll", () => {
                    vm.sliderAngle = 'topBottom';
                    vm.closeAll.call(vm, el); //页面上下滚动时，将左滑删除隐藏掉
                })
            }
        }
    }
}
</script>

<style lang="less">
.left-delete {
    position: relative;
    .left-delete__top {
        position: relative;
        width: 100%;
        z-index: 1;
        background-color: #fff;
    }
    .left-delete__del {
        position: absolute;
        right: 0;
        top: 0;
        bottom: 0;
        width: 140px;
        color: #fff;
        z-index: 0;
        transform: translate3d(0, 0, 0);
        span {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            text-align: center;
        }
    }
    .left-delete__del-red {
        background-color: #f01d24;
    }
}
</style>
