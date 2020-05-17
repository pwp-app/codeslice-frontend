<template>
    <div class="container-notfound">
        <div class="notfound-text">
            <p>404 not found</p>
            <p>这里什么也没有</p>
        </div>
        <div class="notfound-action">
            <el-button type="primary" @click="goBack">返回之前的页面</el-button>
        </div>
        <footer class="notfound-footer">
            <img :src="logo">
            <span>CodeSlice</span>
        </footer>
    </div>
</template>

<script>
import '../styles/views/404.less';
export default {
    name: '404',
    data() {
        return {
            logo: require('../../assets/codeslice.png')
        }
    },
    methods: {
        goBack() {
            window.history.go(-1);
        }
    }
}
</script>