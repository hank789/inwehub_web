<template>
  <div>
    <header class="mui-bar mui-bar-nav">
      <Back :tapCallback="empty"></Back>
      <h1 class="mui-title">发布</h1>
      <a @tap.stop.prevent="goPublish()"
         class="mui-plus-visible mui-btn appPageSubmit mui-btn-link mui-pull-right">确认发布</a>
    </header>

    <div class="mui-content">
      <div class="container-tabs">
        <div class="tab active"><span>文章链接</span></div>
        <div class="tab" @tap.stop.prevent="$router.replace('/discover/add')"><span>图文分享</span></div>
      </div>

      <div class="ShareArticles">
        <p>
          <span>分享你发现的好文</span>
          <span>复制文章源地址</span>
        </p>
      </div>
      <ul class="concreteContent">
        <li class="address">
          <p>文章地址</p>
          <input type="text" placeholder="输入URL" v-model.trim="url"/>
          <i class="bot"></i>
        </li>
        <li class="title">
          <p>文章标题</p>
          <div class="shortContainer" v-if="isShow">
            <input type="text" placeholder="输入文章标题" v-model.trim="title"/>
            <span @tap.stop.prevent="getUrl">自动获取</span>
          </div>
          <input type="text" placeholder="输入文章标题" v-model.trim="title" class="longContainer" v-else/>
          <i class="bot"></i>
        </li>
        <li class="channel">
         <p>所属圈子</p>
          <svg class="icon" aria-hidden="true" @tap.stop.prevent="selectGroup()">
            <use xlink:href="#icon-shuru"></use>
          </svg>
          <span class="groupName" v-if="selectedGroup.name">{{selectedGroup.name.length > 12 ?selectedGroup.name.substr(0, 12) + '...':selectedGroup.name}}</span>
          <i class="bot"></i>
        </li>
        <li class="coverMap" :class="{noImg: image.length?false:true}">
          <p>封面图片</p>
          <svg class="icon" aria-hidden="true" @tap.stop.prevent="selectImage()">
            <use xlink:href="#icon-shuru"></use>
          </svg>
          <div class="container-image" v-if="image">
            <img class="lazyImg" v-lazy="image"/>
          </div>
        </li>
        <!--<li class="channel articleTags">-->
          <!--<p>文章标签</p>-->
          <!--<svg class="icon" aria-hidden="true" @tap.stop.prevent="selectTags()">-->
            <!--<use xlink:href="#icon-shuru"></use>-->
          <!--</svg>-->
          <!--<div class="tags" v-if="tags.length">-->
            <!--<label v-for="(tagName, index) in tags">{{tagName.text}}</label>-->
          <!--</div>-->
        <!--</li>-->
        <button class="submit mui-plus-hidden" :disabled="disableRegister" :class="isblue ? 'blue':''" @tap.stop.prevent="goPublish()">
          确认发布
        </button>
      </ul>

    </div>

    <uploadImage ref="uploadImage"
                 :isMultiple="false"
                 @success="uploadImageSuccess"
                 :ImageMaximum="1"
    ></uploadImage>
  </div>
</template>

<script>

  import { postRequest } from '../../utils/request'
  import { autoTextArea } from '../../utils/plus'
  import popPickerComponent from '../../components/picker/poppicker.vue'
  import localEvent from '../../stores/localStorage'
  import { getLocalUserInfo } from '../../utils/user'
  import uploadImage from '../../components/uploadImage'
  const currentUser = getLocalUserInfo()

  const urlReg = /[a-zA-z]+:\/\/[^\s]*/
  export default {
    data () {
      return {
        id: currentUser.user_id,
        channels: [],
        url: '',
        title: '',
        channel: '',
        isShow: false,
        channelValue: '',
        disableRegister: true,
        isblue: false,
        selectedGroup: null,
        tags: [],
        image: ''
      }
    },
    components: {
      popPickerComponent,
      uploadImage
    },
    watch: {
      '$route': 'refreshPageData',
      url: function (newValue, oldValue) {
        if (newValue) {
          this.isShow = true
        } else {
          this.isShow = false
        }
        this.checkValid()
      },
      title: function (newValue, oldValue) {
        this.checkValid()
      },
      tags: function (newValue, oldValue) {
        this.checkValid()
      },
      image: function (newValue, oldValue) {
        this.checkValid()
      },
      selectedGroup: function (newValue, oldValue) {
        this.checkValid()
      }
    },
    methods: {
      selectImage () {
        this.$refs.uploadImage.uploadImage()
      },
      uploadImageSuccess (images) {
        if (images.length) {
          if (!images[0].base64) {
            return
          }
          this.image = images[0].base64
        }
      },
      empty () {
        this.resetData()
        window.mui.back()
      },
      resetData () {
        localEvent.clearLocalItem('selectedGroup' + this.id)
      },
      readGroup () {
        this.selectedGroup = localEvent.getLocalItem('selectedGroup' + this.id)
      },
      selectTags () {
        this.$router.push('/selecttags?from=article')
      },
      selectGroup () {
        this.$router.push('/group/my?from=discover_add')
      },
      refreshPageData () {
        this.readGroup()
        this.quickUrl()
        this.getTags()
      },
      click () {
        this.channel = ''
      },
      goPublish () {
        if (!this.selectedGroup.id) {
          window.mui.toast('别忘了选择圈子后再发布！')
          return
        }

        postRequest(`article/store`, {
          type: 'link',
          title: this.title,
          url: this.url,
//          category_id: this.channelValue,
          photos: [this.image],
          current_address_name: '',
          current_address_longitude: '',
          current_address_latitude: '',
          group_id: this.selectedGroup.id,
          tags: []
        }).then(response => {
          var code = response.data.code
          // 如果请求不成功提示信息 并且返回上一页；
          if (code !== 1000) {
            if (code === 6101) {
              var that = this
              window.mui.alert('链接已存在,现在跳转原链接位置', '', ['跳转'], function (e) {
                that.$router.pushPlus(response.data.data.exist_url)
              })
              return
            }
            window.mui.alert(response.data.message)
            return
          } else if (code === 1000) {
            this.url = ''
            this.title = ''
            this.channel = ''
            this.channelValue = ''
            this.disableRegister = true
            this.isblue = false
            this.isShow = false
            this.resetData()
            window.mui.toast('发布成功！')
            this.$router.replace('/c/' + response.data.data.category_id + '/' + response.data.data.slug)
            return
          }
        })
      },
      getUrl () {
        if (!urlReg.test(this.url)) {
          window.mui.toast('请填写正确的url格式')
          return
        } else {
          postRequest(`article/fetch-url-title`, {
            url: this.url
          }).then(response => {
            var code = response.data.code
            // 如果请求不成功提示信息 并且返回上一页；
            if (code === 6102) {
              window.mui.toast(response.data.message)
              return
            } else if (code !== 1000) {
              window.mui.toast(response.data.message)
              return
            }
            if (response.data.data) {
              this.title = response.data.data.title
              this.image = response.data.data.img_url
            }
          })
        }
      },
//    (https?|ftp|file)://[-A-Za-z0-9+&@#/%?=~_|!:,.;]+[-A-Za-z0-9+&@#/%=~_|]
      // 判断否有值（改变button按钮的状态来改变颜色）；
      checkValid () {
        if (!this.selectedGroup) {
          this.disableRegister = true
          this.isblue = false
          return false
        }

        // 地址；
        if (!this.url) {
          this.disableRegister = true
          this.isblue = false
          return false
        }
        // 标题；
        if (!this.title) {
          this.disableRegister = true
          this.isblue = false
          return false
        }

        // 频道；
//        if (!this.channel) {
//          this.disableRegister = true
//          this.isblue = false
//          return false
//        }

        this.disableRegister = false
        this.isblue = true
      },
      getChannels () {
        postRequest(`article/get-categories`, {}).then(response => {
          var code = response.data.code
          if (code !== 1000) {
            window.mui.alert(response.data.message)
            window.mui.back()
            return
          }

          if (response.data.data.length > 0) {
            this.channels = response.data.data
          }
          this.loading = 0
        })
      },
      getTags () {
        this.tags = localEvent.getLocalItem('selected_article_skill_tags' + this.id)
      },
      selectChannel () {
        var userPicker = new window.mui.PopPicker()

        userPicker.setData(this.channels)

        userPicker.show(items => {
          this.channel = items[0].text
          this.channelValue = items[0].value
          userPicker.dispose()
        })
      },
      focus () {},
      quickUrl () {
        if (this.$route.query.url) {
          this.url = this.$route.query.url
          this.channel = '观点洞见'
          this.channelValue = 39
          this.getUrl()
        }
      }
    },
    activated: function () {
      this.getTags()
    },
    mounted () {
      var referer = localEvent.getLocalItem('referer')
      if (referer) {
        if (referer.path === '/selecttags' || this.$route.query.from === 'selecttags') {
          // ...
        } else {
          localEvent.clearLocalItem('selected_article_skill_tags' + this.id)
        }
      }
      this.getTags()
      autoTextArea()
    },
    created () {
      this.readGroup()
      this.quickUrl()
      this.getChannels()
    }
  }
</script>

<style lang="less" rel="stylesheet/less" scoped>
  .category {
    background: #fff;
    /*padding: 0.4rem 0.453rem;*/
    height:1.173rem;
    position: relative;
    padding-left: 4%;

    p{
      display: inline-block;
      line-height: 1.2rem;
      font-size:0.426rem;
      color: #444444;
      text-align: left;

      &:nth-of-type(1){
        display: inline-block;
        margin-right: 0.8rem;
        color: #444444;
        font-weight: 500;
        position: relative;

        &:after {
          position: absolute;
          width:0.853rem;
          bottom: 0;
          left: 0;
          height: 0.053rem;
          z-index: 999;
          content: '';
          background-color: #009FE8;
        }
      }
    }

    button {
      position: absolute;
      border: 0.026rem solid #03aef9;
      background-color: #03aef9;
      width: auto;
      font-size: 0.373rem;
      padding: 0rem 0.453rem;
      height: 0.906rem;
      right: 0.266rem;
      top: 0.09rem;
    }
  }
</style>

<style scoped="scoped">
  .groupName{
    font-size: 0.373rem;
    color: #444;
  }
  .mui-content {
    background: #FFFFFF;
  }

  /*清掉自带样式*/

  div,
  p,
  span,
  i,
  img,
  ul,
  li,
  a,
  input,
  button {
    margin: 0;
    padding: 0;
    list-style: none;
    font-style: normal;
  }

  .bot {
    position: absolute;
    right: 0rem;
    bottom: 0;
    left: 0rem;
    height: 0.026rem;
    -webkit-transform: scaleY(.5);
    transform: scaleY(.5);
    background-color: rgb(220, 220, 220);
  }

  /*分享文章*/
  .ShareArticles {
    width: 100%;
    height: 4rem;
    background: #ececee;
    /*border:0.026rem solid #000000;*/
    position: relative;
  }

  .ShareArticles p {
    width: 100%;
    height: 1.333rem;
    text-align: center;
    position: absolute;
    top: 0;
    bottom: 0;
    margin: auto;
  }

  .ShareArticles p span:nth-of-type(1) {
    display: block;
    font-size: 0.533rem;
    color: #444444;
    line-height: 0.533rem;
  }

  .ShareArticles p span:nth-of-type(2) {
    display: block;
    font-size: 0.373rem;
    color: #808080;
    margin-top: 0.213rem;
  }

  /*内容*/
  .concreteContent {
    width: 100%;
    overflow: hidden;
    background: #FFFFFF;
    padding-top: 0.466rem;
  }

  .concreteContent li {
    width: 92%;
    height: 1.146rem;
    margin-left: 4%;
    position: relative;
    line-height: 1.146rem;
  }

  .address p, .title p {
    float: left;
    color: #808080;
    font-size: 0.373rem;
  }

  .address input {
    width: 80%;
    height: 1.12rem;
    float: left;
    margin-bottom: 0;
    padding-right: 0;
    padding-left:0.4rem;
    border: none;
    font-size: 0.373rem;
    color: #444444;
    text-align: right;
  }

  .title .longContainer {
    width: 80%;
    height: 1.12rem;
    float: left;
    margin-bottom: 0;
    padding-right: 0;
    border: none;
    font-size: 0.373rem;
    color: #444444;
    text-align: right;
  }

  .title .shortContainer {
    width: 80%;
    height: 1.12rem;
    float: left;
    margin-bottom: 0;
    padding-right: 0;
    border: none;
    font-size: 0.373rem;
    color: #444444;
  }

  .title .shortContainer input {
    width: 74%;
    height: 1.12rem;
    float: left;
    margin-bottom: 0;
    padding-right: 0;
    padding-left: 0.4rem;
    border: none;
    font-size: 0.373rem;
    color: #444444;
    text-align: right;
  }

  .title .shortContainer span {
    float: right;
    height: 0.506rem;
    color: #FFFFFF;
    font-size: 0.32rem;
    background: #03aef9;
    text-align: center;
    line-height: 0.48rem;
    border-radius: 1.333rem;
    padding: 0 0.133rem;
    margin-top: 0.32rem;

  }

  input::-webkit-input-placeholder { /*WebKit browsers*/
    color: #c8c8c8;
    font-size: 0.373rem;
    text-align: right;
  }

  /*频道*/
  .channel p:nth-of-type(1) {
    float: left;
    color: #808080;
    font-size: 0.373rem;
  }

  .channel input {
    width: 50%;
    float: right;
    font-size: 0.373rem;
    border: none;
    text-align: right;
    color: #444444;
  }

  .channel span{
    color:#444;
    float:right;
    margin-right: 0.133rem;
  }

  .channel svg {
    color: #c8c8c8;
    font-size: 0.453rem;
    margin-top: 0.346rem;
    float: right;
    position: relative;
    z-index: 9999;
  }

  /*封面*/
  .concreteContent .coverMap {
    height: 4.64rem;
  }

  .container-image {
    width: 100%;
    height: 3.28rem;
  }

  .coverMap p {
    float: left;
    color: #808080;
    font-size: 0.373rem;
  }

  .coverMap svg {
    color: #c8c8c8;
    font-size: 0.453rem;
    margin-top: 0.346rem;
    float: right;
    position: relative;
    z-index: 9999;
  }

  /* 发布按钮*/
  .submit {
    width: 92%;
    margin-left: 4%;
    height: 1.173rem;
    border-radius: 0.133rem;
    background: #dcdcdc;
    font-size: 0.426rem;
    color: #b4b4b6;
    border: none;
    margin-top: 0.4rem;
    margin-bottom: 0.8rem;
  }

  .blue {
    background: #03aef9;
    color: #FFFFFF;
  }

  .articleTags{
    height:auto !important;
  }
  .articleTags .tags{
    padding-top:1.253rem;
    position: relative;
    top: -0.346rem;
  }
  .articleTags .tags label{
    border-radius: 1.333rem;
    border: 0.026rem solid #DBDBDB;
    background: #F7F8FA;
    color:#235280;
    margin-right:0.133rem;
    font-size:0.32rem;
    padding:0.08rem 0.133rem;
  }
  .noImg{
    height:1.146rem !important;
  }
</style>
