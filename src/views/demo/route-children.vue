<template>
    <div class="wrap">
         <!--路由的公共部分-->
        <h1>嵌套路由</h1>
        <div>
            <div class="tab">
                <router-link to="/demo/route-children/a">
                    <div class="children">transition使用key</div>
                </router-link>
                <router-link to="/demo/route-children/b">
                    <div class="children">使用index做key </div>
                </router-link>
            </div>
            
            <!--子路由-->
            <router-view/>
        </div>
    </div>
</template>

<style lang = "less" scoped>
.wrap {
 font-size: 0.14rem;
 padding: 0.1rem;
 box-sizing: border-box;
 .tab{
     margin-bottom: 0.5rem;
 }
}

</style>