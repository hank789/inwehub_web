<template>
    <div>
        <div class="mui-content">
            <div>
                <div class="invitation-title">
                    <div class="next-step" @click="nextSubmit" v-if="!showSubmit">下一步</div>
                    <div class="next-step" @click="sureSubmit" v-else>确定</div>
                    <div class="invitation-text">
                        <p>订阅您感兴趣的领域</p>
                        <p>追踪行业新动态2</p>
                    </div>
                </div>
                <div class="container-list-group">
                    <div class="interestList">
                        <div class="interestGroup text-line-1" 
                            v-for="(item,index) in list" 
                            :key="index" 
                            @click="interestList(item)" 
                            :class="{'active': item.checked}"
                            > {{item.checked}}
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
        selectInterest: [],
        loading: 1,
        content: '',
        page: 1,
        title: '用户提交新领域',
        showSubmit: false
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
            console.log('item:' + item.checked)
            Vue.set(item, 'checked', !item.checked)
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
                // console.log(this.list)
                
            })
            
        }
    },
    mounted () {
        this.getData()
        this.showSubmit = !!this.$route.query.type
        
        postRequest('profile/info',{}).then(response => {
            this.selectInterest = response.data.data.info.region_tags.map(item => {
                return item.value
            })
        });
    },
    watch: {
        selectInterest(value) {
            this.list.forEach (item => {
                item.checked = value.indexOf(item.value) >= 0 ? true : false
            })
            console.log(this.list)
        }
    }
}
</script>

<style lang="less" scoped>
.mui-content{
    background: #FFFFFF;
    .right {
        float: right;
        font-size: 0.373rem;
        color: #03AEF9;
        padding: 0 0.426rem 0.8rem;
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
    left: 2.4rem;
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
    padding: 0.4rem 0.426rem 0;
    .interestGroup {
        width: 4.426rem;
        padding: 0 0.266rem;
        height: 1.68rem;
        font-size: 0.4rem;
        color: #444444;
        line-height: 1.68rem;
        text-align: center;
        border-radius: 0.106rem;
        margin-bottom: 0.133rem;
        display: inline-block;
        background: #F7F8FA;
        &:nth-child(odd) {
            margin-right: 0.266rem; 
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
        padding: 0.426rem 0 0.8rem;
        position: absolute;
        bottom: 0;
        background: #fff;
        .popupTop {
            padding-left: 0.293rem;
            line-height: 0.4rem;
            padding-bottom: 0.426rem;
            border-bottom: .02667rem solid #DCDCDC;
            div {
                color: #808080;
                font-size: 0.373rem;
                text-align: center;
                &:nth-child(1) {
                    font-size: 0.426rem;
                    float: left;
                }
            }
        }
        .input {
            margin-top: 0.4rem;
            margin-bottom: 0.8rem;
            text-align: center;
            input {
                width: 9.146rem;
                border-radius: 0.133rem;
                border: 0.026rem solid #DCDCDC;
            }
        }
        .submit {
            width: 9.146rem;
            height: 1.173rem;
            line-height: 1.173rem;
            text-align: center;
            font-size: 0.426rem;
            color: #ffffff;
            margin: 0 auto;
            background: #03AEF9;
            border-radius: 1.333rem;
        }
    }
}
</style>

