//在进入页面 和 离开页面 需要记录用户在 当前页面的 停留时间  
//简化为打印console

let cache = null // 确保进入和离开是一个page

export default {
    methods: {
        sendEnterPage() {
            cache = this.$route
            console.log('enter page', cache)
        },
        sendLeavePage() {
            console.log('leave page', cache)
        }
    },
    mounted(){
        this.sendEnterPage()
    },
    destroyed() {
        this.sendLeavePage()
    }
}