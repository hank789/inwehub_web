<template>
    <div>
        <div class="mui-content">
            <div>
                <div class="invitation-title">
                    <div class="next-step" @click="nextSubmit" v-if="showSubmit">下一步</div>
                    <div class="next-step" @click="sureSubmit" v-else>确定</div>
                    <div class="invitation-text">
                        <p>订阅您感兴趣的领域</p>
                        <p>追踪行业新动态</p>
                    </div>
                </div>
                <div class="container-list-group">
                    <div class="interestList">
                        <div class="interestGroup text-line-1" 
                            v-for="(item,index) in list" 
                            :key="index" 
                            @click="interestList(item)" 
                            :class="item.checked ? 'active' : '' "
                            > {{item.text}}
                        </div>
                    </div>
                </div>
                <div class="right" @tap.stop.prevent="message">都不感兴趣？</div>
            </div>
            <!-- 弹窗 -->
            <div class="popup" v-if="showPopup">
                <div class="popupContent">
                    <div class="popupTop">
                        <div @tap.stop.prevent="message">取消</div>
                        <div>留言</div>
                    </div>
                    <div class="input">
                        <input type="text" placeholder="在这里告诉我们您希望看到的领域！" v-model="content">
                    </div>
                    <div class="submit" @tap.stop.prevent="submit()">提交</div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import { postRequest } from '../../utils/request'
import localEvent from '../../stores/localStorage'
import Vue from 'vue'
export default {
    data: () => ({
        showPopup: false,
        // interestGroupClass: [],
        list: [],
        loading: 1,
        content: '',
        page: 1,
        title: '用户提交新领域',
        showSubmit: true
    }),
    computed: {
        selectTags () {
            var tags = []
            window.mui.each(this.list, function (index, item) {
                if (item.checked) {
                    tags.push(item.value)
                }
            })
            return tags
        }
    },
    methods: {
        interestList(item) {
            Vue.set(item, 'checked', !item.checked)
            // this.$set(this.interestGroupClass,index,(!this.interestGroupClass[index] ? true : false))
            // console.log(this.interestGroupClass)
        },
        message () {
            this.showPopup = !this.showPopup
        },
        //确定  按钮
        sureSubmit () {
            postRequest('profile/updateRegionTag', {
                tags: this.selectTags
            }).then(response => {
                console.log(this.selectTags)
                var code = response.data.code
                if (code !== 1000 ) {
                    window.mui.toast(response.data.message)
                    return
                }
                this.$router.replace('/home')
            })
        },
        //下一步  按钮
        nextSubmit () {
            postRequest('profile/updateRegionTag', {
                tags: this.selectTags
            }).then(response => {
                // console.log(this.selectTags)
                var code = response.data.code
                if (code !== 1000 ) {
                    window.mui.toast(response.data.message)
                    return
                }
                this.$router.replace('/userGuide/stepone?from=' + this.$route.query.from)
            })
        },
        // 提交  按钮
        submit() {
            postRequest('system/feedback',{
                title: this.title,
                content: this.content
            }).then(response => {
                var code = response.data.code
                if (code !== 1000) {
                    window.mui.toast(response.data.message)
                    return
                }
                if (this.$route.query.type === "1") {
                    window.mui.toast('提交成功')
                    this.$router.replace('/home')
                }else {
                    window.mui.toast('提交成功')
                    this.$router.replace('/userGuide/stepone?from=' + this.$route.query.from)
                }
            })
        },
        getData () {
            postRequest('tags/load', {
                tag_type: 6
            }).then(response => {
                var code = response.data.code
                if (code !== 1000) {
                    window.mui.toast(response.data.message)
                    return
                }
                this.list = response.data.data.tags
                this.loading = 0    
            })
        }
    },
    mounted () {
        this.getData()
        if (this.$route.query.type === "1") {
            this.showSubmit = !this.showSubmit
        }
    }
}
</script>

<style lang="less" scoped>
.mui-content{
    background: #FFFFFF;
    .right {
        float: right;
        font-size: 14px;
        color: #03AEF9;
        padding: 0 16px 30px;
    }
}
/*订阅的头部*/
.invitation-title{
    width:100%;
    height:3.52rem;
    background: #f3f4f6;
    padding: 0 0.453rem;
    text-align: center;
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
}
.invitation-title svg{
    color: #b4b4b6;
    font-size: 0.666rem;
    position: absolute;
    left:0.453rem;
    top:0.533rem;
}
.invitation-title .next-step{
    width:2rem;
    height:0.906rem;
    line-height: 0.853rem;
    border: 0.026rem solid #03aef9;
    border-radius: 1.333rem;
    font-size:0.373rem;
    color:#03aef9;
    position: absolute;
    right:0.453rem;
    top:0.426rem;
}
.invitation-title .invitation-text{
    position: absolute;
    top:1.573rem;
    left: 90px;
    text-align: left;
    display: flex;
    flex-direction: column;
}
.invitation-text p:nth-of-type(1){
    font-size:0.373rem;
    color: #808080;
}
.invitation-text p:nth-of-type(2){
    font-size:0.533rem;
    color: #323232;
}
// 列表
.interestList {
    padding: 15px 16px 0;
    .interestGroup {
        width: 166px;
        padding: 0 10px;
        height: 63px;
        font-size: 15px;
        color: #444444;
        line-height: 63px;
        text-align: center;
        border-radius: 4px;
        margin-bottom: 5px;
        display: inline-block;
        background: #F7F8FA;
        &:nth-child(odd) {
            margin-right: 10px; 
        }
    }
    .active {
        color: #fff;
        background: #03AEF9;
    }
}
// 弹窗
.popup {
    position: fixed;
    z-index: 1000;
    top: 0;
    right: 0;
    left: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.3);
    .popupContent {
        width: 100%;
        padding: 16px 0 30px;
        position: absolute;
        bottom: 0;
        background: #fff;
        .popupTop {
            padding-left: 11px;
            line-height: 15px;
            padding-bottom: 16px;
            border-bottom: .02667rem solid #DCDCDC;
            div {
                color: #808080;
                font-size: 14px;
                text-align: center;
                &:nth-child(1) {
                    font-size: 16px;
                    float: left;
                }
            }
        }
        .input {
            margin-top: 15px;
            margin-bottom: 30px;
            text-align: center;
            input {
                width: 343px;
                border-radius: 5px;
                border: 0.026rem solid #DCDCDC;
            }
        }
        .submit {
            width: 343px;
            height: 44px;
            line-height: 44px;
            text-align: center;
            font-size: 16px;
            color: #ffffff;
            margin: 0 auto;
            background: #03AEF9;
            border-radius: 50px;
        }
    }
}
</style>

