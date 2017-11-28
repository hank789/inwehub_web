<template>
  <div>

    <header class="mui-bar mui-bar-nav">
      <a class="mui-action-back mui-icon mui-icon-left-nav mui-pull-left"></a>
      <h1 class="mui-title">寻求合作</h1>
    </header>

    <div class="mui-content absolute">
      <div class="feedback">
        <div class="title">
          合作类型
          <i class="bot"></i>
        </div>
        <ul class="cooperation_type">
          <li>服务入驻</li>
          <li>机遇发布 </li>
          <li>活动展示 </li>
          <li>专家推荐</li>
          <li>其他</li>
        </ul>

        <MTextarea  class="customStyle" v-model.trim="description" :content="description" :rows="15" :descMaxLength="1000"
                   :placeholder='placeholdercontent'></MTextarea>

          <button type="button" class="mui-btn mui-btn-block mui-btn-primary" @tap.stop.prevent="submit">提交申请</button>

      </div>
    </div>

  </div>
</template>

<script>
  import { NOTICE } from '../stores/types'
  import { createAPI, addAccessToken } from '../utils/request'
  import MTextarea from '../components/MTextarea.vue'

  const Feedback = {
    data: () => ({
      description: '',
      headercontent: '',
      titlecontent: '',
      type: '',
      placeholdercontent: '请简述您的需求，提交并通过审核后，相应内容将会出现在活动版块，并通过平台进行信息分发合作对接，信息的发布完全免费。\n' +
      '\n' +
      '收到您的申请提交后，我们会尽快与您取得联系并沟通详细信息。'
    }),
    components: {
      MTextarea
    },
    created () {

    },
    watch: {
      '$route': 'refreshPageData'
    },
    methods: {
      submit () {
        if (!this.description) {
          window.mui.toast('请填写反馈内容')
          return
        }

        var data = {
          name: this.type,
          title: this.headercontent,
          content: this.description
        }

        addAccessToken().post(createAPI(`system/feedback`), data, {
          validateStatus: status => status === 200
        })
          .then(response => {
            var code = response.data.code
            if (code !== 1000) {
              window.mui.alert(response.data.message)
              return
            }
            this.description = ''
            window.mui.toast('反馈成功')
          })
          .catch(({
                    response: {
                      message = '网络状况堪忧'
                    } = {}
                  }) => {
            this.$store.dispatch(NOTICE, cb => {
              cb({
                text: data.message,
                time: 2000,
                status: false
              })
            })
          })
      }
    },
    mounted () {
    }
  }
  export default Feedback
</script>

<style scoped>
  .mui-content {
   background:#fefefe;
  }
  ul,
  li,
  p,
  span,
  a,
  i,
  input{
    margin: 0;
    padding: 0;
    list-style: none;
  }
  .bot {
    position: absolute;
    right:  0;
    bottom: 0;
    left:  0;
    height: 1px;
    -webkit-transform: scaleY(.5);
    transform: scaleY(.5);
    background-color: rgb(220, 220, 220);
  }
  .title {
    color: #aba9ab;
    height: 40px;
    line-height: 40px;
    padding-left: 15px;
    position: relative;
  }

  .feedback {
  }

  .feedback textarea {
    height: 200px;
    background: red;
  }

  .textarea-wrapper {
    position: relative;
    width: 100%;
    margin:0;
    background: #f3f4f6;
    border-radius: 5px;
    border: 1px solid #cccccc;
    padding-bottom: 20px;
  }

  .textarea-wrapper textarea {
    padding-bottom: 0;
    margin-bottom: 0;
    border:1px solid #cccccc;

  }

  .textarea-wrapper .counter {
    position: absolute;
    right: 10px;
    bottom: 2px;
    color: #999;
  }

  .customStyle{
    background: #f3f4f6;
    border:none;
  }

/* 提交*/
 button{
    width:92%;
    border-radius:5px;
    margin:auto;
    margin-top: 20px;
  }
  /*合作类型*/
  .cooperation_type{
    width:100%;
    padding: 5px 15px 10px 0px;
    overflow: hidden;
  }
  .cooperation_type li{
    width:86px;
    height:34px;
    padding: 10px 11px;
    background: #ececee;
    border-radius: 4px;
    float: left;
    text-align: center;
    color: #808080;
    font-size:14px;
    margin-left: 15px;
    margin-top: 10px;
    line-height: 14px;
  }
</style>
