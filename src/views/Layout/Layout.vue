<template>
    <div id="app-wrapper">
        <keep-alive>
            <sidebar></sidebar>
        </keep-alive>
        <div class="main">
            <keep-alive>
                <top-bar></top-bar>
            </keep-alive>
            <transition>
                <router-view :key="key"></router-view>
            </transition>
        </div>
    </div>
</template>
<script>
    import sidebar from './sidebar';
    import topBar from './topBar.vue';

    export default {
        name: 'app',
        computed: {
            key() {
                return this.$route.name !== undefined ? this.$route.name + +new Date() : this.$route + +new Date();
            }
        },
        components: {
            sidebar,
            topBar
        }
    };
</script>
<style  lang="scss">
    .main {
        margin-left: 200px;
        min-width: 900px;
        margin-top:35px;
    }

    .main {
        height: 100%;
    }
a{text-decoration:none;}
    body {
        margin: 0;
        padding: 0;
        background: #eeeeee;
        font-size: 13px;
    }

    .clear:after {
        content: '';
        display: block;
        clear: both;
    }

    input {
        outline: none;
    }

    tbody {
        background: #fff;
    }
</style>
