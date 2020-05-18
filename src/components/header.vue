<template>
    <header class="container container-header">
        <div class="header-logo" @click="toHome">
            <img :src="logo">
        </div>
        <div class="header-title" @click="toHome">
            <p>CodeSlice</p>
        </div>
    </header>
</template>

<script>
export default {
    name: 'Header',
    data() {
        return {
            logo: require('../../assets/codeslice.png')
        }
    },
    methods: {
        toHome() {
            if (this.$route.path !== '/') {
                this.$router.push('/');
            }
        }
    }
}
</script>