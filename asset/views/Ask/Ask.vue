<template>
  <div>
    <header class="mui-bar mui-bar-nav">
      <a class="mui-icon mui-icon-left-nav mui-pull-left" @tap.stop.prevent="cancelAsk"></a>
      <h1 class="mui-title">发起提问</h1>
    </header>

    <div class="mui-content absolute askWrapper">

      <div class="category"><span class="tip">问题分类</span>
        <button class="mui-btn mui-btn-block mui-btn-primary" type="button" @tap.stop.prevent="selectType()">
          <span  v-if="tags.length || newTags.length">修改</span>
          <span  v-else>选择</span>
        </button>
      </div>
      <div class="ask_tags" v-if="tag.length">
        <p v-for="(tagName, index) in tag">{{tagName.text}}</p>
      </div>
      <div class="form form-ask">
        <div class="textarea-wrapper">
          <textarea id="description" v-model.trim="description" @focus="textareaFocus"
                    @blur="textareaBlur"></textarea>
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
          <button type="button" class="mui-btn mui-btn-block mui-btn-primary" @tap.stop.prevent="showMoney();">
            提好问题了
          </button>
        </div>

        <div class="help">
          <div class="item" @tap.stop.prevent="$router.pushPlus('/help/ask')">如何提一个好问题？</div>
          <div class="item" @tap.stop.prevent="fenhongxize()">问答被查看后我的分成细则？</div>


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
                 :ImageMaximum="maxImageCount - this.images.length"
    ></uploadImage>

    <pay
      ref="pay"
      :payItems="payItems"
      :pay_object_type="'ask'"
      :pay_object_id="0"
      :pay_money="money"
      @pay_success="goAsk"
      @payMoneyChange="payMoneyChange"
    >
    </pay>

  </div>
</template>

<script>

  import { ASK_INFO, ASK_TYPE_SELECT } from '../../stores/types'
  import { postRequest } from '../../utils/request'
  import pay from '../../components/pay/pay.vue'
  import { setStatusBarBackgroundAndStyle } from '../../utils/statusBar'
  import { alertFenhongxize } from '../../utils/dialogList'
  import localEvent from '../../stores/localStorage'
  import userAbility from '../../utils/userAbility'
  import { getLocalUserInfo } from '../../utils/user'
  const currentUser = getLocalUserInfo()
  import { autoTextArea } from '../../utils/plus'
  import uploadImage from '../../components/uploadImage'

  const Ask = {
    data: () => ({
      id: currentUser.user_id,
      images: [],
      maxImageCount: 9,
      tags: [],
      newTags: [],
      tag: [],
      money: 88,
      payItems: [],
      uid: 0,
      description: '',
      selectOther: false,
      hide: 0,
      descMaxLength: 1000,
      isShowMoneyDev: false,
      descPlaceholder: '1.请精确描述输入问题详情，并等待平台专家回答' + '\n' + '2.答案每被查看一次，你和回答者可从中获取分成' + '\n' + '3.请根据问题难易程度等合理选择支付金额'
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

      this.textareaBlur()

      // 弹窗
      var font = '<p style="text-align: left; font-size:14px; color: #444444;  margin-top:15px;">' +
                  '</p>' +
                  '<p style="text-align: left; font-size:14px; color: #444444;  margin-top:15px;">' +
                  '专家准入具有较高门槛，我们会根据您的提问自动匹配回答专家，提问请遵守相关问答规范。' +
                  '</p>'
      window.mui.alert(font, '什么是专业问答？', '确定', function () {}, 'div')
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
      payMoneyChange (money) {
        this.money = money
      },
      refreshPageData () {
        this.initData()
      },
      uploadImageSuccess (images) {
        for (var i = 0; i < images.length; i++) {
          this.images.push(images[i])
        }
      },
      initData () {
        // 取标签；
        this.tag = localEvent.getLocalItem('ask_skill_tags' + this.id)
        // 返回时重新取值
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
      fenhongxize () {
        alertFenhongxize(this)
      },
      getMethodIcon () {
        if (window.mui.os.plus && window.mui.os.ios) {
          return '#icon-apple'
        }

        return '#icon-wechat'
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
            // 删除标签；
            this.clearCache()
            setTimeout(() => {
              window.mui.back()
            }, 100)
          }
        }, 'div')
      },
      showMoney () {
        var inputElem = document.querySelector('textarea')
        inputElem.blur()

        if (!this.description || this.description === this.descPlaceholder) {
          window.mui.toast('请填写提问内容')
          return
        }

        this.$refs.pay.showSelectMoney()
      },
      speech () {
        var options = {}
        options.engine = 'iFly'
        var t = this
        window.plus.speech.startRecognize(options, function (s) {
          t.description += s
        }, function (e) {
          window.mui.alert('语音识别失败：' + e.message)
        })
      },
      selectType () {
        var info = {
          money: this.money,
          desc: this.description,
          hide: this.hide,
          selectOther: this.selectOther
        }
        this.$store.dispatch(ASK_INFO, info)
        this.$router.push('/selecttags?from=ask')
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

          for (var i in this.payItems) {
            var item = this.payItems[i]
            if (item.default) {
              this.money = parseInt(item.value)
            }
          }
        })
      },
      clearCache () {
        var info = {}
        this.images = []
        this.tags = []
        this.tag = []
        this.newTags = []
        localEvent.clearLocalItem('ask_skill_tags' + this.id)
        this.$store.dispatch(ASK_INFO, info)
        this.$store.dispatch(ASK_TYPE_SELECT, '')
      },
      goAsk (orderId, payObjectType) {
        if (!this.money) {
          window.mui.toast('请选择提问金额')
          return
        }

        if (this.money < 0) {
          window.mui.toast('提问金额不能小于0')
          return
        }

        if (!this.description) {
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
          question_type: 1,
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
          var timeend = result.waiting_second ? result.waiting_second : 15

          this.$router.replace({path: '/pay/ask/' + id + '?money=' + result.price + '&timeend=' + timeend})
        })
      }
    },
    watch: {
      description: function (newDescription) {
        if (newDescription.length > this.descMaxLength) {
          this.description = this.description.slice(0, this.descMaxLength)
        }
      },
      money: function (newMoney) {
        const askDetail = /^[0-9]+$/
        if (!askDetail.test(newMoney) && this.money) {
          this.money = parseInt(this.money)
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
  }

  .mui-ios .mui-content{
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
