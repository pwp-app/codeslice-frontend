<template>
    <header class="container container-header">
        <div class="header-logo">
            <img :src="logo">
        </div>
        <div class="header-title">
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
    }
}
</script>