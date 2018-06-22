<template>
  <div>
    <header class="mui-bar mui-bar-nav">
      <a class="mui-icon mui-icon-left-nav mui-pull-left" @tap.stop.prevent="cancelAsk"></a>
      <h1 class="mui-title">{{ pageTitle }}</h1>
      <a class="mui-btn mui-btn-blue mui-btn-link mui-pull-right" @tap.stop.prevent="showMoney();">发布</a>
    </header>

    <div class="mui-content">
      <!--new-->
      <swiper :options="swiperOption" class="container-label padding-10-16-0" v-if="tag.length">
        <swiper-slide v-for="(tagName, index) in tag" :key="'tag_'+index" @tap.stop.prevent="toTagDetail(tagName.text)">{{tagName.text}}</swiper-slide>
      </swiper>

      <div class="textarea-wrapper padding-10-16-0" :class="{'textareaWrapperHasImage': images.length > 0, 'textareaWrapperHasTag': tag.length}">
        <textarea id="description" v-model.trim="description" @focus="textareaFocus"
                  @blur="textareaBlur"></textarea>
      </div>

      <!--展示图片-->
      <swiper :options="swiperOption" class="container-upload-images" v-show="images.length">
        <swiper-slide class="image" v-for="(image, index) in images" :key="'image_'+index" ><img :src="image.base64" :data-preview-src="image.base64" :data-preview-group="1"/><svg class="icon" aria-hidden="true" @tap.stop.prevent="delImg(index)">
          <use xlink:href="#icon-times1"></use>
        </svg></swiper-slide>
      </swiper>

      <div class="container-textareaMenu">
        <div class="leftParter"><span class="item" @tap.stop.prevent="toggleHide">
            <div class="component-radio" :class="{active: this.hide}"></div><span class="noImportant">匿名</span></span><span class="item" @tap.stop.prevent="uploadImage" v-if="images.length < maxImageCount">
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-tupian"></use>
            </svg></span></div>
        <div class="rightParter"><span class="item" @tap.stop.prevent="selectType()">
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-biaoqian2"></use>
            </svg><label v-if="tags.length || newTags.length">修改</label><label v-else>选标签</label></span></div>
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
      v-if="payMethod === 'select'"
    >
    </pay>

    <payInput
      ref="pay"
      :payItems="payItems"
      :pay_object_type="'ask'"
      :pay_object_id="0"
      :pay_money="money"
      @pay_success="goAsk"
      @payMoneyChange="payMoneyChange"
      v-else
    ></payInput>

  </div>
</template>

<script>

  import { ASK_INFO, ASK_TYPE_SELECT } from '../../stores/types'
  import { postRequest } from '../../utils/request'
  import pay from '../../components/pay/pay.vue'
  import payInput from '../../components/pay/payInput.vue'
  import { setStatusBarBackgroundAndStyle } from '../../utils/statusBar'
  import { alertFenhongxize } from '../../utils/dialogList'
  import localEvent from '../../stores/localStorage'
  import userAbility from '../../utils/userAbility'
  import { getLocalUserInfo } from '../../utils/user'
  const currentUser = getLocalUserInfo()
  import { autoTextArea } from '../../utils/plus'
  import uploadImage from '../../components/uploadImage'
  import { swiper, swiperSlide } from 'vue-awesome-swiper'

  const Ask = {
    data: () => ({
      swiperOption: {
        slidesPerView: 'auto',
        spaceBetween: 10,
        freeMode: true
      },
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
      descPlaceholder: '输入问题描述',
      pageTitle: '悬赏提问',
      payMethod: 'input' // 支付方式, input式还是select式
    }),
    components: {
      pay,
      uploadImage,
      payInput,
      swiper,
      swiperSlide
    },
    activated: function () {
      this.initData()
    },
    mounted () {
      userAbility.showFreeAskGuide(this)

      window.mui.previewImage()
      autoTextArea()
      this.initData()

      setStatusBarBackgroundAndStyle('#3c3e44', 'light')

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
    created () {},
    methods: {
      toTagDetail (name) {
        userAbility.jumpToTagDetail(name)
      },
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
        if (this.$route.params.uuid) {
          this.uid = this.$route.params.uuid
        } else {
          this.uid = 0
        }

        var info = this.$store.state.askType.info
        if (info.money || info.desc) {
          this.money = info.money
          this.description = info.desc
          this.hide = info.hide
          this.selectOther = info.selectOther
        }
        this.check()

        // 取标签；
        this.tag = localEvent.getLocalItem('selected_ask_skill_tags' + this.id)
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

        if (!this.tags.length && !this.newTags.length) {
          window.mui.toast('请选择标签')
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

          if (response.data.data.title) {
            this.pageTitle = response.data.data.title
          }

          if (response.data.data.help_tips) {
            response.data.data.help_tips = response.data.data.help_tips.replace(/\\n/g, '\n')
            if (response.data.data.help_tips !== this.descPlaceholder) {
              if (this.description === this.descPlaceholder) {
                this.description = response.data.data.help_tips
              }
              this.descPlaceholder = response.data.data.help_tips
            }
          }

          this.payItems = response.data.data.pay_items
          if (response.data.data.must_apple_pay) {
            this.payMethod = 'select'
          } else {
            this.payMethod = 'input'
          }

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
        localEvent.clearLocalItem('selected_ask_skill_tags' + this.id)
        this.description = ''
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
            window.mui.toast(response.data.message)
            return
          }

          this.clearCache()

          var result = response.data.data
          var id = result.id
          var timeend = result.waiting_second ? result.waiting_second : 15
          if (process.env.NODE_ENV === 'production' && window.mixpanel.track) {
            // mixpanel
            window.mixpanel.track(
              'inwehub:ask:store:success',
              {
                'app': 'inwehub',
                'user_device': window.getUserAppDevice(),
                'page': this.$route.fullPath,
                'page_name': this.$route.name,
                'page_title': this.$route.meta.title,
                'referrer_page': ''
              }
            )
          }

          this.$router.replace('/pay/ask/' + id + '?money=' + result.price + '&timeend=' + timeend)
        })
      }
    },
    watch: {
      '$route': 'refreshPageData',
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
    width:1.626rem !important;
    height:1.626rem !important;
  }

  .mui-content {
    background-color: #f3f4f6;
  }

  .mui-ios .mui-content{
    overflow: hidden !important;
  }

  .mui-bar-nav ~ .mui-content {
    padding-top: 0;
  }

  .textarea-wrapper {
    position: absolute;
    top:0;
    left:0;
    bottom:1.44rem;
    width: 100%;
  }

  .textareaWrapperHasImage{
    bottom:3.466rem;
  }

  .textareaWrapperHasTag{
    top:0.906rem;
  }

  .textarea-wrapper textarea {
    background: #f3f4f6;
    border:none;
    padding:0;
  }

  .container-upload-images{
    background: #F3F4F5;
    position: absolute;
    bottom:1.333rem;
    left:0.133rem;
    width:100%;
  }
</style>
