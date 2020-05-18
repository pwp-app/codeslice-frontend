<template>
    <div class="container-present">
        <div class="present">
            <Header></Header>
            <transition mode="out-in" enter-active-class="animated fadeIn" leave-active-class="animated fadeOut animate-delay">
                <div class="container present-main" key="loading" v-if="slice.loading">
                    <div class="present-text present-loading">
                        <i class="el-icon-loading"></i>
                        <span>加载中</span>
                    </div>
                </div>
                <div
                    class="container present-main"
                    key="main"
                    v-if="slice.content && !slice.loading"
                >
                    <div class="present-text present-title">
                        <span>
                            以下是<i class="present-space"></i>{{ slice.poster ? slice.poster : ""}}<i class="present-space"></i>分享给您的代码：
                        </span>
                    </div>
                    <div class="present-code">
                        <pre id="code">{{ slice.content }}</pre>
                    </div>
                    <div class="present-bottom">
                        <div class="present-info">
                            <div class="present-info-create">
                                <span>创建时间：{{ slice.createTime }}</span>
                            </div>
                            <div class="present-info-expires">
                                <span>过期时间：{{ slice.expires }}</span>
                            </div>
                        </div>
                        <div class="present-action">
                            <el-button type="primary" @click="doCopy"
                                >复制到剪贴板</el-button
                            >
                            <el-button type="primary" @click="doSave"
                                >下载为文本</el-button
                            >
                        </div>
                        <div class="clearfix"></div>
                    </div>
                </div>
                <div
                    class="container present-main"
                    key="error"
                    v-if="error"
                >
                    <div class="present-text present-error">
                        <span>{{
                            error ? error : "很抱歉，该代码不存在或已过期。"
                        }}</span>
                    </div>
                    <div class="present-retry">
                        <el-button type="primary">重试</el-button>
                    </div>
                </div>
            </transition>
        </div>
        <Footer></Footer>
    </div>
</template>

<script>
import dayjs from "dayjs";
import saveAs from "file-saver";
import Header from "../components/header";
import Footer from "../components/footer";
import "../styles/views/presentation.less";

export default {
    name: "presentation",
    components: {
        Header,
        Footer
    },
    data() {
        return {
            slice: {
                loading: false
            },
            error: null,
            timeout: false
        };
    },
    created() {
        this.fetch();
    },
    mounted() {
        // 超过500ms没有加载完成，显示加载中
        setTimeout(() => {
            if (!this.slice.content && !this.error) {
                this.slice.loading = true;
            }
        }, 500);
    },
    methods: {
        fetch() {
            this.axios
                .get("/api/v1/slice/get", {
                    params: {
                        key: this.$route.params.key
                    }
                })
                .then(res => {
                    if (res && res.data.code === 200) {
                        if (
                            res.data.data.createTime + res.data.data.expires <=
                            new Date().getTime() / 1000
                        ) {
                            this.slice.loading = false;
                            return;
                        }
                        this.slice = res.data.data;
                        this.slice.createTime = dayjs(
                            this.slice.createTime
                        ).format("YYYY-MM-DD HH:mm:ss");
                        this.slice.expires = dayjs(this.slice.createTime)
                            .add(this.slice.expires, "s")
                            .format("YYYY-MM-DD HH:mm:ss");
                        if (this.slice.content) {
                            this.$nextTick(() => {
                                let code = document.getElementById("code");
                                hljs.highlightBlock(code);
                                hljs.lineNumbersBlock(code);
                            });
                        }
                    }
                })
                .catch(() => {
                    this.slice.loading = false;
                    this.slice.content = null;
                    this.error = "获取失败，请检查您的网络设置。";
                });
        },
        doCopy() {
            this.$copyText(this.slice.content).then(
                e => {
                    this.$message({
                        type: "success",
                        message: "代码已复制到剪贴板"
                    });
                },
                function(e) {
                    this.$message({
                        type: "error",
                        message: "复制失败"
                    });
                }
            );
        },
        doSave() {
            const filename = `${this.$route.params.key}.txt`;
            const blob = new Blob([this.slice.content], {
                type: "text/plain;charset=utf-8"
            });
            saveAs(blob, filename);
        }
    }
};
</script>