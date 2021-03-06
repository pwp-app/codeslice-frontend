<template>
    <div class="container-home">
        <Header></Header>
        <div class="container home-main">
            <div class="home-section home-header">
                <div class="home-header-tip">
                    <span>在下方输入您要分享的代码：</span>
                </div>
            </div>
            <div class="home-section home-body">
                <Editor></Editor>
                <el-form
                    class="home-body-form"
                    ref="infoForm"
                    :inline="true"
                    :model="infoForm"
                    :rules="infoFormRules"
                >
                    <el-form-item label="署名">
                        <el-input
                            v-model="infoForm.poster"
                            placeholder="留空视为匿名"
                        ></el-input>
                    </el-form-item>
                    <el-form-item label="过期时间">
                        <el-select v-model="infoForm.expires">
                            <el-option
                                v-for="item in expiresOptions"
                                :key="item.value"
                                :label="item.text"
                                :value="item.value"
                                >{{ item.text }}</el-option
                            >
                        </el-select>
                    </el-form-item>
                    <div class="home-body-action">
                        <el-button
                            type="primary"
                            @click="doSubmit"
                            :disabled="submitButtonDisabled"
                        >
                            分享
                        </el-button>
                    </div>
                </el-form>
            </div>
        </div>
        <Footer></Footer>
    </div>
</template>

<script>
import Header from "../components/header";
import Footer from "../components/footer";
import Editor from "../components/editor";
import "../styles/editor/editor.less";
import "../styles/views/home.less";

export default {
    name: "Home",
    components: {
        Header,
        Footer,
        Editor
    },
    data() {
        return {
            infoForm: {
                poster: "",
                expires: 3600
            },
            infoFormRules: {
                poster: [
                    { max: 30, message: "长度在30个字符以内", trigger: "blur" }
                ],
                expires: [
                    {
                        require: true,
                        message: "必须选择过期时间",
                        trigger: "change"
                    }
                ]
            },
            expiresOptions: [
                {
                    value: 300,
                    text: "5分钟"
                },
                {
                    value: 600,
                    text: "10分钟"
                },
                {
                    value: 1800,
                    text: "30分钟"
                },
                {
                    value: 3600,
                    text: "1小时"
                },
                {
                    value: 7200,
                    text: "2小时"
                },
                {
                    value: 14400,
                    text: "4小时"
                },
                {
                    value: 21600,
                    text: "6小时"
                },
                {
                    value: 43200,
                    text: "12小时"
                },
                {
                    value: 86400,
                    text: "24小时"
                }
            ],
            submitButtonDisabled: false
        };
    },
    methods: {
        validateForm() {
            return new Promise((resolve, reject) => {
                this.$refs.infoForm.validate(valid => {
                    resolve(valid);
                });
            });
        },
        doSubmit() {
            this.submit();
        },
        async submit() {
            let content = window.editor.innerText.trim();
            if (content.length < 1) {
                this.$message({
                    type: "error",
                    message: "请填写内容"
                });
                return;
            }
            const h = this.$createElement;
            this.submitButtonDisabled = true;
            await this.$recaptchaLoaded();
            const token = await this.$recaptcha("login");
            this.axios
                .post("/api/v1/slice/submit", {
                    content,
                    expires: this.infoForm.expires,
                    poster: this.infoForm.poster.length
                        ? this.infoForm.poster
                        : null,
                    token
                })
                .then(res => {
                    this.submitButtonDisabled = false;
                    if (!res || res.data.code !== 200) {
                        let message = res.data.message.trim();
                        this.$message({
                            type: "error",
                            message: message.length > 0 ? message : "分享失败"
                        });
                        return;
                    }
                    let key = res.data.data;
                    let link = `https://codeslice.pwp.app/${key}`;
                    this.$msgbox({
                        title: "分享链接",
                        message: h(
                            "a",
                            {
                                class: "home-share-link",
                                attrs: {
                                    href: link,
                                    target: "_blank"
                                }
                            },
                            link
                        ),
                        showCancelButton: false
                    })
                        .then(() => {
                            this.$copyText(link);
                        })
                        .catch(() => {
                            /* do nothing */
                        });
                })
                .catch(() => {
                    this.$message({
                        type: "error",
                        message: '与服务器通讯失败',
                    });
                    this.submitButtonDisabled = false;
                });
        }
    }
};
</script>