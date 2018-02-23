<template>
  <div>
    <header class="mui-bar mui-bar-nav">
      <a class="mui-action-back mui-icon mui-icon-left-nav mui-pull-left"></a>
      <h1 class="mui-title">发布动态</h1>
    </header>

    <div class="mui-content">
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
          <P>选择频道</P>
          <svg class="icon" aria-hidden="true" @tap.stop.prevent="selectChannel()" v-if="!channel">
            <use xlink:href="#icon-shuru"></use>
          </svg>
          <input type="text" v-model.trim="channel"  @tap.stop.prevent="click()"  v-else/>

          <i class="bot"></i>
        </li>
        <!--<li class="coverMap">-->
        <!--<p>封面图片</p>-->
        <!--<svg class="icon" aria-hidden="true">-->
        <!--<use xlink:href="#icon-shuru"></use>-->
        <!--</svg>-->
        <!--<div class="container-image">-->
        <!--<img src="../../statics/images/guide_01.png"/>-->
        <!--</div>-->
        <!--<i class="bot"></i>-->
        <!--</li>-->
        <button class="submit" :disabled="disableRegister" :class="isblue ? 'blue':''" @tap.stop.prevent="goPublish()">
          发布
        </button>
      </ul>

    </div>
  </div>
</template>

<script>

  import { postRequest } from '../../utils/request'
  import { autoTextArea } from '../../utils/plus'
  import popPickerComponent from '../../components/picker/poppicker.vue'

  const urlReg = /[a-zA-z]+:\/\/[^\s]*/
  export default {
    data () {
      return {
        channels: [],
        url: '',
        title: '',
        channel: '',
        isShow: false,
        channelValue: '',
        disableRegister: true,
        isblue: false
      }
    },
    components: {
      popPickerComponent
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
      channel: function (newValue, oldValue) {
        this.checkValid()
      }
    },
    methods: {
      refreshPageData () {
        this.quickUrl()
      },
      click () {
        this.channel = ''
      },
      goPublish () {
        postRequest(`article/store`, {
          type: 'link',
          title: this.title,
          url: this.url,
          category_id: this.channelValue,
          photos: '',
          current_address_name: '',
          current_address_longitude: '',
          current_address_latitude: ''
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
            this.$router.pushPlus('/discover/add/success')
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
            }
          })
        }
      },
//    (https?|ftp|file)://[-A-Za-z0-9+&@#/%?=~_|!:,.;]+[-A-Za-z0-9+&@#/%=~_|]
      // 判断否有值（改变button按钮的状态来改变颜色）；
      checkValid () {
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
        if (!this.channel) {
          this.disableRegister = true
          this.isblue = false
          return false
        }

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
    mounted () {
      autoTextArea()
    },
    created () {
      this.quickUrl()
      this.getChannels()
    }
  }
</script>

<style scoped="scoped">
  .mui-content {
    background: #FFFFFF;
    overflow: hidden !important;
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
    right: 0px;
    bottom: 0;
    left: 0px;
    height: 1px;
    -webkit-transform: scaleY(.5);
    transform: scaleY(.5);
    background-color: rgb(220, 220, 220);
  }

  /*分享文章*/
  .ShareArticles {
    width: 100%;
    height: 150px;
    background: #ececee;
    /*border:1px solid #000000;*/
    position: relative;
  }

  .ShareArticles p {
    width: 100%;
    height: 50px;
    text-align: center;
    position: absolute;
    top: 0;
    bottom: 0;
    margin: auto;
  }

  .ShareArticles p span:nth-of-type(1) {
    display: block;
    font-size: 20px;
    color: #444444;
    line-height: 20px;
  }

  .ShareArticles p span:nth-of-type(2) {
    display: block;
    font-size: 14px;
    color: #808080;
    margin-top: 8px;
  }

  /*内容*/
  .concreteContent {
    width: 100%;
    overflow: hidden;
    background: #FFFFFF;
    padding-top: 17.5px;
  }

  .concreteContent li {
    width: 92%;
    height: 43px;
    margin-left: 4%;
    position: relative;
    line-height: 43px;
  }

  .address p, .title p {
    float: left;
    color: #808080;
    font-size: 14px;
  }

  .address input {
    width: 80%;
    height: 42px;
    float: left;
    margin-bottom: 0;
    padding-right: 0;
    padding-left:15px;
    border: none;
    font-size: 14px;
    color: #444444;
    text-align: right;
  }

  .title .longContainer {
    width: 80%;
    height: 42px;
    float: left;
    margin-bottom: 0;
    padding-right: 0;
    border: none;
    font-size: 14px;
    color: #444444;

  }

  .title .shortContainer {
    width: 80%;
    height: 42px;
    float: left;
    margin-bottom: 0;
    padding-right: 0;
    border: none;
    font-size: 14px;
    color: #444444;
  }

  .title .shortContainer input {
    width: 74%;
    height: 42px;
    float: left;
    margin-bottom: 0;
    padding-right: 0;
    padding-left: 15px;
    border: none;
    font-size: 14px;
    color: #444444;
    text-align: right;
  }

  .title .shortContainer span {
    float: right;
    height: 19px;
    color: #FFFFFF;
    font-size: 12px;
    background: #03aef9;
    text-align: center;
    line-height: 18px;
    border-radius: 50px;
    padding: 0 5px;
    margin-top: 12px;

  }

  input::-webkit-input-placeholder { /*WebKit browsers*/
    color: #c8c8c8;
    font-size: 14px;
    text-align: right;
  }

  /*频道*/
  .channel p:nth-of-type(1) {
    float: left;
    color: #808080;
    font-size: 14px;
  }

  .channel input {
    width: 50%;
    float: right;
    color: #c8c8c8;
    font-size: 14px;
    border: none;
    text-align: right;
    color: #444444;
  }

  .channel svg {
    color: #c8c8c8;
    font-size: 17px;
    margin-top: 13px;
    float: right;
  }

  /*封面*/
  .concreteContent .coverMap {
    height: 166px;
  }

  .container-image {
    width: 100%;
    height: 123px;
  }

  .coverMap p {
    float: left;
    color: #808080;
    font-size: 14px;
  }

  .coverMap svg {
    color: #c8c8c8;
    font-size: 17px;
    margin-top: 13px;
    float: right;
  }

  /* 发布按钮*/
  .submit {
    width: 92%;
    margin-left: 4%;
    height: 44px;
    border-radius: 5px;
    background: #dcdcdc;
    font-size: 16px;
    color: #b4b4b6;
    border: none;
    margin-top: 30px;
    margin-bottom: 30px;
  }

  .blue {
    background: #03aef9;
    color: #FFFFFF;
  }

</style>
