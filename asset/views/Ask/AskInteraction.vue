<template>
  <div>
    <header class="mui-bar mui-bar-nav">
      <a class="mui-icon mui-icon-left-nav mui-pull-left" @tap.stop.prevent="cancelAsk"></a>
      <h1 class="mui-title">提问</h1>
    </header>

    <div class="mui-content absolute askWrapper">

      <div class="category"><span class="tip">问题分类</span>
        <button class="mui-btn mui-btn-block mui-btn-primary" type="button" @tap.stop.prevent="selectType">
          <span  v-if="this.tags.length || this.newTags.length">修改</span>
          <span  v-else>选择</span>
        </button>
      </div>

      <div class="ask_tags" v-if="tag.length">
        <p v-for="(tagName, index) in tag">{{tagName.text}}</p>
      </div>

      <div class="form form-ask">
        <div class="textarea-wrapper">
          <textarea id="description" v-model.trim="description" @focus="textareaFocus" @blur="textareaBlur"></textarea>
        </div>
      </div>

      <!--展示图片-->
      <div class="container-images" :class="'container-images-' + (images.length + 1)">
        <div class="container-image" v-for="(image, index) in images">
          <svg class="icon" aria-hidden="true" @tap.stop.prevent="delImg(index)">
            <use xlink:href="#icon-times1"></use>
          </svg>
          <img :id="'image_' + index" :src="image.base64" :data-preview-src="image.base64" :data-preview-group="1"/>
        </div><div class="container-image component-photograph" @tap.stop.prevent="uploadImage()" v-if="images.length < maxImageCount"><svg class="icon" aria-hidden="true"><use xlink:href="#icon-xiangji1"></use></svg></div>
      </div>

      <div class="fixedDiv">
        <div class="fixedContainer">
          <span class="niming" @tap.stop.prevent="toggleHide"><label class="nimingCheckbox"
                                                                     :class="{'active':hide}"></label>匿名</span>
          <span class="counter"><span>{{ descLength }}</span><span>/</span><span>{{ descMaxLength }}</span></span>
        </div>

        <div class="button-wrapper" v-show="!isShowMoneyDev">
          <button type="button" class="mui-btn mui-btn-block mui-btn-primary" @tap.stop.prevent="submit();">
            提好问题了



          </button>
        </div>

        <div class="help">
          <div class="item" @tap.stop.prevent="$router.pushPlus('/help/ask')">如何提一个好问题？</div>


          <div class="button-wrapper">
            <button type="button" class="mui-btn mui-btn-block mui-btn-primary"
                    @tap.stop.prevent="toAskCommunity">
              去问答社区看看

            </button>
          </div>
        </div>
      </div>

    </div>

    <!--上传图片-->
    <uploadImage ref="uploadImage"
                 :isMultiple="true"
                 @success="uploadImageSuccess"
                 :ImageMaximum="maxImageCount"
    ></uploadImage>

    <pay v-show="false" :payItems="[]" ref="pay" :pay_object_type="pay_object_type" :pay_object_id="0" :pay_money="money"
         v-on:pay_success="goAsk">
    </pay>


  </div>
</template>

<script>

  import { ASK_INFO, ASK_TYPE_SELECT } from '../../stores/types'
  import { postRequest } from '../../utils/request'
  import pay from '../../components/pay/pay.vue'
  import { setStatusBarBackgroundAndStyle } from '../../utils/statusBar'
  import userAbility from '../../utils/userAbility'
  import { getLocalUserInfo } from '../../utils/user'
  const currentUser = getLocalUserInfo()
  import localEvent from '../../stores/localStorage'
  import { autoTextArea } from '../../utils/plus'
  import uploadImage from '../../components/uploadImage'

  const Ask = {
    data: () => ({
      id: currentUser.user_id,
      tags: [],
      tag: [],
      newTags: [],
      money: 0,
      payItems: [],
      images: [],
      maxImageCount: 9,
      uid: 0,
      description: '',
      question_type: 2,  // 提问类型，1为付费专业问答，2为免费问答互助,默认为1
      selectOther: false,
      hide: 0,
      descMaxLength: 1000,
      isShowMoneyDev: false,
      test: 0,
      pay_object_type: 'free_ask',
      descPlaceholder: '可征集大家的意见，可在问题详情页进行回答邀请。'
    }),
    components: {
      pay,
      uploadImage
    },
    activated: function () {
      this.initData()
    },
    mounted () {
      window.mui.previewImage()
      autoTextArea()
      this.initData()

      setStatusBarBackgroundAndStyle('#3c3e44', 'light')

      window.addEventListener('refreshData', function (e) {
        // 执行刷新
        console.log('refresh-ask')
      })
      window.mui.init()

      this.textareaBlur()
    },
    computed: {
      type () {
        return this.$store.state.askType.selected ? this.$store.state.askType.selected : ''
      },
      descLength () {
        return this.description.length
      }
    },
    created () {
      if (this.$route.query.id) {
        var id = this.$route.query.id
        if (id) {
          this.uid = id
        }
      }

      var info = this.$store.state.askType.info
      if (info.money || info.desc) {
        this.money = info.money
        this.description = info.desc
        this.hide = info.hide
        this.selectOther = info.selectOther
      }
      this.check()
    },
    methods: {
      uploadImageSuccess (images) {
        for (var i = 0; i < images.length; i++) {
          this.images.push(images[i])
        }
      },
      initData () {
        // 取标签；
        this.tag = localEvent.getLocalItem('interaction_skill_tags' + this.id)
        this.tags = []
        this.newTags = []
        for (var i in this.tag) {
          if (typeof (this.tag[i].value) === 'string') {
            if (this.newTags.indexOf(this.tag[i].value) === -1) {
              this.newTags.push(this.tag[i].value)
            }
          } else {
            this.tags.push(this.tag[i].value)
          }
        }
      },
      uploadImage: function () {
        var textarea = window.document.getElementById('discoverTextarea')
        if (textarea) {
          textarea.blur()
        }
        this.$refs.uploadImage.uploadImage()
      },
      delImg (index) {
        this.images.splice(index, 1)
      },
      submit () {
        this.$refs.pay.setPayMethod()
        this.$refs.pay.pay()
      },
      textareaFocus () {
        if (this.description === this.descPlaceholder) {
          this.description = ''
        }
      },
      textareaBlur () {
        if (this.description === '') {
          this.description = this.descPlaceholder
        }
      },
      toggleHide () {
        this.hide = !this.hide
      },
      toAskCommunity () {
        userAbility.jumpToAskCommunity(this)
      },
      cancelAsk () {
        var inputElem = document.querySelector('textarea')
        inputElem.blur()
        if (!this.type && this.description === this.descPlaceholder && !this.tags.length) {
          window.mui.back()
          return
        }
        window.mui.confirm('退出此处编辑？', null, ['确定', '取消'], e => {
          if (e.index === 0) {
            this.clearCache()
            window.mui.back()
          }
        }, 'div')
      },
      selectType () {
        var info = {
          money: this.money,
          desc: this.description,
          hide: this.hide,
          selectOther: this.selectOther
        }
        this.$store.dispatch(ASK_INFO, info)
        this.$router.push('/selecttags?from=interaction')
      },
      check () {
        var t = this

        postRequest(`question/request`, {uuid: this.uid}).then(response => {
          var code = response.data.code

          if (code === 3000) {
            window.mui.alert(response.data.message, null, null, function () {
              t.$router.replace('/my/info')
            })
            return
          }

          if (code !== 1000) {
            window.mui.alert(response.data.message)
            window.mui.back()
            return
          }

          this.payItems = response.data.data.pay_items
        })
      },
      clearCache () {
        var info = {}
        this.images = []
        this.tag = []
        this.tags = []
        this.newTags = []
        // 删除标签；
        localEvent.clearLocalItem('interaction_skill_tags' + this.id)
        this.$store.dispatch(ASK_INFO, info)
        this.$store.dispatch(ASK_TYPE_SELECT, '')
      },
      goAsk (orderId, payObjectType) {
//        if (!this.tags.length) {
//          window.mui.toast('请选择问题分类')
//          return
//        }
        if (!this.description || this.description === this.descPlaceholder) {
          window.mui.toast('请填写提问内容')
          return
        }

        // 提问设备，1为IOS，2为安卓，3为网页，4为微信小程序
        var device = 1
        if (window.mui.os.plus) {
          if (window.mui.os.android) {
            device = 2
          }
        } else {
          device = 3
        }

        var data = {
          order_id: orderId,
          question_type: this.question_type,
          answer_uuid: this.uid,
          description: this.description,
          price: this.money,
          tags: this.tags,
          new_tags: this.newTags,
          hide: this.hide,
          device: device,
          photos: []
        }

        for (var i in this.images) {
          var compressBase64 = this.images[i].base64
          data.photos.push(compressBase64)
        }

        postRequest(`question/store`, data).then(response => {
          var code = response.data.code
          if (code !== 1000) {
            window.mui.alert(response.data.message)
            return
          }

          this.clearCache()

          var result = response.data.data
          var id = result.id

          this.$router.replace({path: '/askCommunity/interaction/answers/' + id})
        })
      }
    },
    watch: {
      description: function (newDescription) {
        if (newDescription.length > this.descMaxLength) {
          this.description = this.description.slice(0, this.descMaxLength)
        }
      }
    }
  }
  export default Ask
</script>

<style scoped>
  .component-photograph{
    width:61px !important;
    height:61px !important;
  }

  .askWrapper .category {
    background: #fff;
    padding: 15px 17px;
    position: relative;
  }

  .askWrapper .category .tip {
    font-size: 16px;
    color: #444444;
  }

  .askWrapper .category button {
    position: absolute;
    border: 1px solid #03aef9;
    background-color: #03aef9;
    width: auto;
    font-size: 14px;
    padding: 4px 17px;
    right: 10px;
    top: 12px;
  }

  .mui-content > .mui-table-view:first-child {
    margin-top: 0;
  }

  .mui-content {
    background-color: #fff;
    overflow: hidden !important;
  }

  .mui-bar-nav ~ .mui-content {
    padding-top: 0;
  }

  .form-ask {
    padding-top: 0;
    background: #fff;
    height: 202px;
    width: 100%;
    z-index: 0;
  }

  .form-ask textarea {
    width: 100%;
    height: 100%;
    border: none;
    margin: 0;
    padding: 10px 17px;
    color: #9b9b9b;
  }

  .selectMoney {
    background: #fff;
  }

  .selectMoney .category span.active, .form-ask .select span.active {
    border: 1px solid #4990E2;
    color: #4990E2;
  }

  .selectMoney .category span {
    border: 1px solid #b6b6b6;
    border-radius: 5px;
    width: 30%;
    display: inline-block;
    height: 32px;
    margin: 0 3px 10px;
    text-align: center;
    line-height: 32px;
    position: relative;
  }

  .selectMoney .help {
    margin: 30px 0;
  }

  .form-ask .select span {
    border: 1px solid #b6b6b6;
    border-radius: 5px;
    padding: 0 10px;
    display: inline-block;
    height: 32px;
    margin-right: 6px;
    margin-bottom: 10px;
    text-align: center;
    line-height: 32px;
    position: relative;
  }

  .selectMoney .category span input {
    display: inline-block;
    position: relative;
    border: none;
    height: 90%;
    margin-top: -4px;
    width: 90%;
    text-align: center;
  }

  .form-ask .button-wrapper {
    margin-top: 15px;
    padding: 0 80px
  }

  .textarea-wrapper {
    height: 100%;
    background: #f3f4f6;
  }

  .textarea-wrapper textarea {
    background: #f3f4f6;
  }

  .mui-bar .mui-btn-link {
    color: #fff;
  }

  .mui-bar .mui-btn-nav.mui-pull-left {
    margin-left: 5px;
  }

  .selectMoney {
    text-align: center;
    padding: 0 15px 15px 15px;
  }

  .selectMoney .payDesc {
    position: relative;
    font-size: 14px;
  }

  .selectMoney .payDesc {
    font-size: 14px;
    height: 40px;
    line-height: 40px;
    color: #999;
  }

  .selectMoney .button-wrapper {
    margin: 20px 0 10px;
    padding: 0 30px;
  }

  .selectMoney .payDesc .dash {
    position: relative;
    top: -4px;
    margin: 0 5px;
    display: inline-block;
    border-top: 1px solid #999;
    width: 45px;
  }

  .selectMoney .payDesc .mui-icon {
    margin-right: 5px;
  }

  .fixedContainer {
    position: relative;
    background: #f3f4f6;
    padding: 5px 10px;
  }

  .fixedContainer .counter {
    float: right;
    color: #c8c8c8;
  }

  .fixedContainer .niming {
    color: #808080;
    position: relative;
    font-size: 14px;
    padding-left: 9px;
  }

  .fixedContainer .niming input {
    position: absolute;
    top: 4px;
    left: 0;
    vertical-align: bottom;
  }

  .fixedDiv .title {
    margin: 10px 0;
    text-align: center;
    color: #8b8b8b;
    height: 32px;
  }

  .fixedDiv {
    padding-bottom: 10px;
    background-color: #fff;
    width: 100%;
  }

  .fixedDiv .select span {
    border: 1px solid #b6b6b6;
    border-radius: 5px;
    padding: 0 10px;
    display: inline-block;
    height: 32px;
    margin-right: 6px;
    margin-bottom: 10px;
    text-align: center;
    line-height: 32px;
    position: relative;
  }

  .fixedDiv .select span.active {
    border: 1px solid #4a90e2;
  }

  .fixedDiv .button-wrapper {
    margin-top: 15px;
    padding: 0 15px;
  }

  .fixedDiv .button-wrapper button {
    background: #03aef9;
    color: #f2f2f2;
    border-radius: 5px;
    border: 1px solid #03aef9;
  }

  .mui-popover .mui-table-view {
    background: none !important;
    margin-top: 0 !important;
    border-radius: 0 !important;
    color: rgba(155, 155, 155, 100) !important;
  }

  #expert.mui-popover .mui-table-view {
    background: #fff !important;
    border-radius: 5px !important;
    color: #4990E2 !important;
  }

  #expert.mui-popover .mui-table-view-cell {
    padding: 13px 15px;
  }

  .selectMoney .title {
    padding: 22px 0;
    margin: 0 8px;
    text-align: center;
    position: relative;
  }

  .selectMoney .title:after {
    position: absolute;
    right: 0;
    bottom: 0;
    left: 0;
    height: 1px;
    content: '';
    -webkit-transform: scaleY(.5);
    transform: scaleY(.5);
    background-color: #c8c7cc;
  }

  .selectMoney .mui-table-view-cell {
    padding: 10px 0;
  }

  .selectMoney .mui-pull-right {
    float: right !important;
    padding-right: 35px;

    color: rgba(74, 144, 226, 100) !important;
    text-align: right;
  }

  .selectMoney .mui-icon {
    color: rgba(138, 138, 138, 100);
    opacity: 0.67;
    font-size: 24px;
  }

  .selectMoney .apple-icon {
    padding: 8px 35px 0 0;
  }

  .mui-popover .mui-table-view .mui-table-view-cell:last-child, .mui-popover .mui-table-view .mui-table-view-cell:last-child > a:not(.mui-btn) {
    border-radius: 0 !important;
  }

  .mui-table-view-cell:after {
    left: 0 !important;
  }

  .mui-input-row label {
    padding-left: 5px;
    text-align: left;
  }

  .help {
    color: #03aef9;
    font-size: 14px;
    padding: 0 15px;

  }

  .help .item {
    padding: 10px 0 0;
  }

  .help .button-wrapper {
    margin-top: 46px;
    padding: 0 75px;
  }

  .help .button-wrapper button {
    border-radius: 50px;
    border: 1px solid #dcdcdc;
    background: #fff;
    color: #444;
    padding: 5px 0;
  }

  .nimingCheckbox {
    display: inline-block;
    width: 16px;
    height: 16px;
    position: relative;
    border: 1px solid #c8c8c8;
    border-radius: 50%;
    top: 3px;
    right: 5px;
  }

  .nimingCheckbox.active:after {
    content: ' ';
    display: inline-block;
    width: 4px;
    height: 4px;
    position: absolute;
    border: 1px solid #03aef9;
    background-color: #03aef9;
    border-radius: 50%;
    left: 50%;
    margin-left: -3px;
    top: 50%;
    margin-top: -3px;
  }

  @media screen and (max-width: 374px) {
    .form-ask {
      height: 220px;
    }
  }
  .container-images{
    background: #F3F4F5;
  }
  /*标签样式*/
  .ask_tags{
    width:100%;
    background: #f3f4f6;
    overflow: hidden;
    padding: 0  16px 0px 7px;
  }
  .ask_tags p{
    margin: 0;
    padding: 0;
    float: left;
    background: #a8dff7;
    color:#FFFFFF;
    padding: 0px 8px;
    border-radius:50px;
    margin-top: 9px;
    margin-left: 9px;
    font-size:12px;
  }
</style>
