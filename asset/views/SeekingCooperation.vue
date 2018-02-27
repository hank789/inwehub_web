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
          <li v-for="(item, index) in list" :class="{'presentActive':intergerOn == index }" @tap.stop.prevent="choose(index,item.name)">{{item.name}}</li>
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
      list: [{name: '服务入驻'},
          {name: '机遇发布'},
          {name: '活动展示'},
          {name: '专家推荐'},
          {name: '其他'}
      ],
      description: '',
      intergerOn: '0',
      headercontent: '',
      titlecontent: '',
      type: '寻求合作',
      cooperationType: '',
      placeholdercontent: '如果您是企业服务及管理咨询领域专家，您或您的公司需要或期待与平台深入合作，请留下介绍信息。\n' +
      '\n' +
      '我们很期待与您合作共赢，收到您的申请提交后，我们会尽快与您取得联系并沟通详细信息。'
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
//      添加颜色
      choose (index, name) {
        switch (index) {
          case 0:
            this.placeholdercontent = '如果您是企业服务及管理咨询领域专家，您或您的公司需要或期待与平台深入合作，请留下介绍信息。\n' +
              '\n' +
              '我们很期待与您合作共赢，收到您的申请提交后，我们会尽快与您取得联系并沟通详细信息。'
            break
          case 1:
            this.placeholdercontent = '请简述您的需求，提交并通过审核后，相应内容将会出现在机遇版块，并通过平台进行信息分发合作对接，信息的发布完全免费。\n' +
              '\n' +
              '收到您的申请提交后，我们会尽快与您取得联系并沟通详细信息。'
            break
          case 2:
            this.placeholdercontent = '请简述您的需求，提交并通过审核后，相应内容将会出现在活动版块，并通过平台进行信息分发合作对接，信息的发布完全免费。\n' +
              '\n' +
              '收到您的申请提交后，我们会尽快与您取得联系并沟通详细信息。'
            break
          case 3:
            this.placeholdercontent = '请描述您推荐的专家姓名、简介、擅长方向、联系方式等。\n' +
              '\n' +
              '如您推荐的专家最终成功入驻，您将获得邀请分红及贡献值奖励兑换礼品。'
            break
          case 4:
            this.placeholdercontent = '请清晰简单的描述您需要寻求的其他合作的类型。\n' +
              '\n' +
              '收到您的申请提交后，我们会尽快与您取得联系并沟通详细信息。'
            break
        }
        this.cooperationType = name
        if (this.intergerOn === index) {
          this.intergerOn = '-1'
        } else {
          this.intergerOn = index
        }
      },
      submit () {
//        if (this.intergerOn === '-1') {
//          window.mui.toast('请选择合作类型')
//          return
//        }
        if (!this.description) {
          window.mui.toast('请填写反馈内容')
          return
        }

        var data = {
          title: this.type + '->' + this.cooperationType,
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
            this.intergerOn = '-1'
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
    height: 0.026rem;
    -webkit-transform: scaleY(.5);
    transform: scaleY(.5);
    background-color: rgb(220, 220, 220);
  }
  .title {
    color: #aba9ab;
    height: 1.066rem;
    line-height: 1.066rem;
    padding-left: 0.4rem;
    position: relative;
  }

  .feedback {
  }

  .feedback textarea {
    height: 5.333rem;
    background: red;
  }

  .textarea-wrapper {
    position: relative;
    width: 100%;
    margin:0;
    background: #f3f4f6;
    border-radius: 0.133rem;
    border: 0.026rem solid #cccccc;
    padding-bottom: 0.533rem;
  }

  .textarea-wrapper textarea {
    padding-bottom: 0;
    margin-bottom: 0;
    border:0.026rem solid #cccccc;

  }

  .textarea-wrapper .counter {
    position: absolute;
    right: 0.266rem;
    bottom: 0.053rem;
    color: #999;
  }

  .customStyle{
    background: #f3f4f6;
    border:none;
  }

/* 提交*/
 button{
    width:92%;
    border-radius:0.133rem;
    margin:auto;
    margin-top: 0.533rem;
  }
  /*合作类型*/
  .cooperation_type{
    width:100%;
    padding: 0.133rem 0.4rem 0.266rem 0rem;
    overflow: hidden;
  }
  .cooperation_type li{
    width:2.293rem;
    height:0.906rem;
    padding: 0.266rem 0.293rem;
    background: #ececee;
    border-radius: 0.106rem;
    float: left;
    text-align: center;
    color: #808080;
    font-size:0.373rem;
    margin-left: 0.4rem;
    margin-top: 0.266rem;
    line-height: 0.373rem;
  }
  /* 点击的颜色*/
  .cooperation_type .presentActive{
    background: #03aef9;
    color: #FFFFFF;
  }
</style>
