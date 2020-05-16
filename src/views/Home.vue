<template>
    <div class="container-home">
        <div class="container home-main">
            <Header></Header>
            <div class="home-section home-header">
                <div class="home-header-tip">
                    <span>在下方输入您要分享的代码：</span>
                </div>
            </div>
            <div class="home-section home-body">
                <Editor></Editor>
                <el-form
                    class="home-body-form"
                    :inline="true"
                    :model="infoForm"
                    :rules="infoFormRules"
                >
                    <el-form-item label="署名">
                        <el-input
                            :model="infoForm.name"
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
                        <el-button type="primary">分享</el-button>
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
                name: "",
                expires: 3600
            },
            infoFormRules: {
                name: [
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
            ]
        };
    }
};
</script>