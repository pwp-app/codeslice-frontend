<template>
    <div class="container-404">
        <div class="404-text">
            <p>404 not found</p>
            <p>这里什么也没有</p>
        </div>
        <div class="404-action">
            <el-button type="primary" @click="goBack">返回之前的页面</el-button>
        </div>
    </div>
</template>

<script>
import '../styles/views/404.less';
export default {
    name: '404',
    methods: {
        goBack() {
            window.history.go(-1);
        }
    }
}
</script>