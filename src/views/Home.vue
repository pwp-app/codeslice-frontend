<template>
    <div class="container-home">
        <Header></Header>
        <Editor></Editor>
    </div>
</template>

<script>
import Header from '../components/header';
import Editor from '../components/editor';
export default {
    name: 'Home',
    components: {
        Header,
        Editor
    }
}
</script>