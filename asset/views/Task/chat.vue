<template>

  <div>
    <header class="mui-bar mui-bar-nav">
      <Back></Back>
      <h1 class="mui-title">{{name}}</h1>
      <a v-if="source" @tap.stop.prevent="showOptions"
         class="mui-btn appPageSubmit mui-btn-link mui-pull-right">圈子</a>
    </header>
    <div class="mui-content" id='contentwrapper' :class="{singleChat: !source}">

      <RefreshList v-if="this.chatRoomId" ref="RefreshList"
        v-model="list"
        :api="'im/messages'"
        :prevOtherData="{room_id: this.chatRoomId}"
        :nextOtherData="{room_id: this.chatRoomId}"
        @prevSuccessCallback="prevSuccessCallback"
        class="chatListWrapper">
        <ul class="user" id="myData">
          <template v-for="(item, index) in list">
            <!--用户-->
            <li class="consumer" v-if="currentUser.user_id != item.user_id">
              <p>{{showTime(list[index-1], item)}}</p>
              <p>
                <img class="lazyImg" v-lazy="item.avatar"  @tap.stop.prevent="toAvatar(item.uuid)" />
                <span v-if="item.data.text">
                  {{item.data.text}}
                </span>
                <i>{{item.user_name}}</i>
                <span v-if="item.data.img" class="chatImg">
                   <SingleImage :src="item.data.img" :isSmallImage="item.data.img.length < 100" :group="currentUser.user_id + ''"></SingleImage>
                </span>
              </p>
            </li>

            <!--自己  -->
            <li class="Customerservice" v-else-if="currentUser.user_id == item.user_id">
              <p>{{showTime(list[index-1], item)}}</p>
              <p>
                <img class="lazyImg" v-lazy="currentUser.avatar_url" @tap.stop.prevent="toAvatar(item.uuid)"/>
                <span v-if="item.data.text" v-html="textToLink(item.data.text)">
                </span>
                <span v-if="item.data.img" class="chatImg">
                  <SingleImage :src="item.data.img" :isSmallImage="item.data.img.length < 100" :group="currentUser.user_id + ''"></SingleImage>
                </span>
              </p>
            </li>

            <li v-else-if="item.user_id === 0">
              <div  class="hint" >
                <p>{{showTime(list[index-1], item)}}</p>
                <p>
                  <span v-if="item.data.text" v-html="textToLink(item.data.text)"></span>
                </p>
              </div>
            </li>
          </template>
        </ul>
      </RefreshList>
    </div>

    <!--发送消息框-->
    <div class="message" id="message">
      <input type="text" v-model.trim="comment" v-on:keydown.enter="message($event)" @keyup="whisperFinishedTyping" @keydown="whisperTyping"  @focus="focus" @blur="blur" id="bounce"/>
      <svg class="icon" aria-hidden="true" @tap.stop.prevent="uploadImage()">
        <use xlink:href="#icon-plus"></use>
      </svg>
      <svg class="icon" aria-hidden="true" @tap.stop.prevent="message()">
        <use xlink:href="#icon-fasong" ></use>
      </svg>
    </div>
    <!--发送消息框end-->

    <uploadImage ref="uploadImage"
                 :isMultiple="false"
                 @success="uploadImageSuccess"
                 :ImageMaximum="maxImageCount"
    ></uploadImage>

    <typing class="typingWrapper" v-if="this.chatRoomId" :room_id="this.chatRoomId"></typing>

    <Options
      ref="itemOptions"
      :id="'itemOptions'"
      :options="itemOptions"
      @selectedItem="selectedItem"
    ></Options>

  </div>
</template>

<script>
//  {contact_id:this.chatUserId}
  import { postRequest } from '../../utils/request'
  import RefreshList from '../../components/refresh/MescrollListChat.vue'
  import { getLocalUserInfo } from '../../utils/user'
  import { autoTextArea, openVendorUrl } from '../../utils/plus'
  import uploadImage from '../../components/uploadImage'
  import SingleImage from '../../components/image/Image.vue'
  import { textToLinkHtml } from '../../utils/dom'
  import Typing from '../../components/Typing.vue'
  import { searchText } from '../../utils/search'
  import localEvent from '../../stores/localStorage'
  import Options from '../../components/Options.vue'

  const Chat = {
    data: () => ({
      list: [],
      comment: '',
      currentUser: getLocalUserInfo(),
      flag: true,
      chatRoomId: '',
      chatUserId: 0,
      maxImageCount: 1,
      images: [],
      isTyping: false,
      itemOptions: [
        '进入圈子'
        // '关闭消息通知'
      ],
      name: '',
      source: null,
      oldUrl: ''
    }),
    created () {
      this.getDetail()
    },
    computed: {
    },
    components: {
      RefreshList,
      uploadImage,
      SingleImage,
      Typing,
      Options
    },
    watch: {
      '$route': 'refreshPageData'
    },
    beforeRouteEnter (to, from, next) { // 如果没有配置回到顶部按钮或isBounce,则beforeRouteEnter不用写
      next(vm => {
        // 找到当前mescroll的ref,调用子组件mescroll-vue的beforeRouteEnter方法
        vm.$refs.RefreshList && vm.$refs.RefreshList.beforeRouteEnter() // 进入路由时,滚动到原来的列表位置,恢复回到顶部按钮和isBounce的配置
      })
    },
    beforeRouteLeave (to, from, next) { // 如果没有配置回到顶部按钮或isBounce,则beforeRouteLeave不用写
      // 找到当前mescroll的ref,调用子组件mescroll-vue的beforeRouteLeave方法
      this.$refs.RefreshList && this.$refs.RefreshList.beforeRouteLeave() // 退出路由时,记录列表滚动的位置,隐藏回到顶部按钮和isBounce的配置
      next()
    },
    methods: {
      showOptions () {
        this.$refs.itemOptions.toggle()
      },
      selectedItem (item) {
        switch (item) {
          case this.itemOptions[0]:
            this.$refs.itemOptions.toggle()
            this.$router.pushPlus('/group/detail/' + this.source.id)
            break
          case this.itemOptions[1]:
            // todo 接后台关闭消息通知接口
            break
        }
      },
      uploadImageSuccess (images) {
        if (images.length) {
          if (!images[0].base64) {
            return
          }

          var item = {
            created_at: this.currentTime(),
            data: {
              text: '',
              img: images[0].base64
            },
            id: null,
            user_id: this.currentUser.user_id,
            avatar: this.currentUser.avatar_url_url
          }
          this.list.push(item)

          this.images = []

          postRequest(`im/message-store`, {
            img: images[0].base64,
            contact_id: this.chatUserId,
            room_id: this.chatRoomId
          }).then(response => {
            var code = response.data.code

            if (code !== 1000) {
              window.mui.alert(response.data.message)
              return
            }
          })
          if (this.$refs.RefreshList) {
            setTimeout(() => {
              this.$refs.RefreshList.scrollToBottom()
            }, 500)
          }
        }
      },
      // 转换成html
      textToLink (text) {
        return textToLinkHtml(' ' + text)
      },
      /**
       * Broadcast "typing".
       *
       * @return void
       */
      whisperTyping () {
        console.log('chat.room whisperTyping() fired roomId:' + this.chatRoomId)
        var roomId = this.chatRoomId
        if (this.isTyping) return
        console.log('chat.room roomId:' + roomId)
        window.Echo.private('chat.room.' + roomId).whisper('typing', {
          username: this.currentUser.name
        })
        this.isTyping = true
      },
      /**
       * Broadcast "finished-typing".
       *
       * @return void
       */
      whisperFinishedTyping () {
        var roomId = this.chatRoomId
        searchText('ok', () => {
          console.log('chat.room roomId:' + roomId)
          window.Echo.private('chat.room.' + roomId).whisper('finished-typing', {
            username: this.currentUser.name
          })
          this.isTyping = false
        }, 3000)
      },
      showTime (prevtime, time) {
        if (prevtime) {
          var current = new Date(time.created_at.replace(/-/g, '/'))
          var previous = new Date(prevtime.created_at.replace(/-/g, '/'))
          var interval = parseInt(current - previous) / 1000 / 60
          if (interval >= 5) {
            return this.timeago(time.created_at)
          } else {
            return ''
          }
        } else {
          return this.timeago(time.created_at)
        }
      },
      toAvatar (uuid) {
        if (!uuid) {
          return false
        }
        this.$router.pushPlus('/share/resume?id=' + uuid + '&goback=1' + '&time=' + (new Date().getTime()))
      },
     // for zhangzhen 推送消息
      chat (obj) {
        var item = {
          created_at: obj.created_at,
          data: {
            text: obj.body.text,
            img: obj.body.img
          },
          id: obj.id,
          user_id: obj.user_id,
          avatar: obj.avatar,
          uuid: obj.uuid,
          user_name: obj.name
        }
        if (parseInt(this.chatRoomId) === obj.room_id) {
          this.list.push(item)
        } else {
          return false
        }
        if (this.$refs.RefreshList) {
          setTimeout(() => {
            this.$refs.RefreshList.scrollToBottom()
          }, 500)
        }
      },
      uploadImage () {
        var input = document.getElementById('bounce')
        input.blur()
        this.$refs.uploadImage.uploadImage()
      },
      refreshPageData () {
        if (this.chatRoomId) {
          window.Echo.leave('chat.room.' + this.chatRoomId)
          window.Echo.leave('room.' + this.chatRoomId + '.user.' + this.currentUser.user_id)
        }
        this.getDetail()

        if (this.chatUserId === this.$route.params.id) {
          this.prevSuccessCallback()
        }
      },
      getDetail () {
        console.log('getDetail:...')
        this.source = null
        if (this.$route.params.id) {
          this.chatUserId = this.$route.params.id
          postRequest(`im/getWhisperRoom`, {
            contact_id: this.$route.params.id
          }).then(response => {
            var code = response.data.code

            if (code !== 1000) {
              window.mui.alert(response.data.message)
              return
            }
            this.chatRoomId = response.data.data.room_id
            this.name = response.data.data.contact_name
            window.Echo.private('chat.room.' + this.chatRoomId)
            window.Echo.private('room.' + this.chatRoomId + '.user.' + this.currentUser.user_id).notification((n) => {
              console.log(n)
              this.chat(n)
            })
            this.message()
          })
        } else if (this.$route.params.room_id) {
          postRequest(`im/getRoom`, {
            room_id: this.$route.params.room_id
          }).then(response => {
            var code = response.data.code

            if (code !== 1000) {
              window.mui.alert(response.data.message)
              return
            }
            this.chatRoomId = response.data.data.id
            this.source = response.data.data.source
            this.name = response.data.data.source.name + '(' + response.data.data.source.subscribers + ')'
            window.Echo.private('chat.room.' + this.chatRoomId)
            window.Echo.private('room.' + this.chatRoomId + '.user.' + this.currentUser.user_id).notification((n) => {
              console.log(n)
              this.chat(n)
            })
          })
        }
      },
      prevSuccessCallback () {
        if (parseInt(this.$refs.RefreshList.currentPage) === 1) {
          if (this.$refs.RefreshList) {
            setTimeout(() => {
              this.$refs.RefreshList.scrollToBottom()
              var comment = localEvent.getLocalItem('information')
              localEvent.clearLocalItem('information')
              if (comment.length) {
                this.comment = comment
              }
              this.message()
            }, 500)
          }
        }
      },
      focus () {
        if (this.$refs.RefreshList) {
          setTimeout(() => {
            this.$refs.RefreshList.scrollToBottom()
          }, 1000)
        }
      },
      blur () {},
      // 回车键发送‘
      show: function (ev) {
        if (ev.keyCode === 13) {
          // 发送
          this.message()
        }
      },
      // 获取本地时间；
      currentTime () {
        var now = new Date()

        var year = now.getFullYear() // 年
        var month = now.getMonth() + 1 // 月
        var day = now.getDate() // 日

        var hh = now.getHours() // 时
        var mm = now.getMinutes() // 分
        var ss = now.getSeconds() // 秒

        var clock = year + '-'

        if (month < 10) {
          clock += '0'
        }
        clock += month + '-'

        if (day < 10) {
          clock += '0'
        }
        clock += day + ' '

        if (hh < 10) {
          clock += '0'
        }
        clock += hh + ':'
        if (mm < 10) clock += '0'
        clock += mm + ':'

        if (ss < 10) clock += '0'
        clock += ss
        return (clock)
      },
      // 消息；
      message () {
        if (this.comment) {
          var item = {
            created_at: this.currentTime(),
            data: {
              text: this.comment
            },
            id: 2,
            user_id: this.currentUser.user_id
          }

          this.list.push(item)
          if (this.$refs.RefreshList) {
            setTimeout(() => {
              this.$refs.RefreshList.scrollToBottom()
            }, 500)
          }
          //  清空
          localEvent.clearLocalItem('share')
          postRequest(`im/message-store`, {
            text: this.comment,
            contact_id: this.chatUserId,
            room_id: this.chatRoomId
          }, false).then(response => {
            var code = response.data.code

            if (code !== 1000) {
              window.mui.alert(response.data.message)
              window.mui.back()
              return
            }

            if (response.data.data) {
              this.comment = ''
            }
          })
        }
      }
    },
    updated () {
   // 打开第三方链接
      this.$nextTick(function () {
        var myData = this.$el.querySelector('#myData')
        if (myData) {
          openVendorUrl(myData)
        }
      })
    },
    mounted () {
      // 保存链接
      var a = localEvent.getLocalItem('share')
      if (a && a.length > 0) {
        localEvent.setLocalItem('share', null)
        this.comment = a
      }
      autoTextArea()
    }
  }
  export default Chat
</script>

<style scoped>
  /*清掉自带样式*/

  div,
  p,
  span,
  i,
  img,
  ul,
  li,
  a {
    margin: 0;
    padding: 0;
    list-style: none;
    font-style: normal;
  }

  .mui-content {
    background: #f3f4f6;
  }
  /*input 输入框*/

  .message {
    width: 100%;
    height: 1.253rem;
    background: #ececee;
    position: absolute;
    bottom: 0;
    padding: 0 0.266rem;
    z-index: 5;
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    align-items: center;
  }

  .message input {
    height: 0.933rem;
    border-radius: 0.133rem;
    background: #ffffff;
    border: none;
    margin-bottom: 0;
    box-shadow: 0 0 0.266rem rgba(220, 220, 220, 1);

  }

  .message svg {
    font-size: 0.986rem;
    margin-left: 0.266rem;
    color: #03aef9;

  }
  /*内容区域*/

  .user {
    width: 96%;
    margin-left: 2%;
    overflow: hidden;
    /*background: #CCCCCC;*/
  }

  .user li {
    width: 100%;
    overflow: hidden;
    margin-top: 0.266rem;
    /*border: 0.026rem solid #CCCCCC;*/
  }
   /*客服*/
  .consumer p:nth-of-type(1) {
    text-align: center;
    font-size: 0.346rem;
    color: #b4b4b6;
    line-height: 1.226rem;
  }

  .consumer p:nth-of-type(2) {
    width: 100%;
    overflow: hidden;
    position: relative;
  }

  .consumer p:nth-of-type(2) img {
    width: 1.12rem;
    height: 1.12rem;
    float: left;
    border-radius: 0.213rem;
  }

  .consumer p:nth-of-type(2) span {
    position: relative;
    float: left;
    display: block;
    max-width: 80%;
    min-height: 0.933rem;
    margin-left: 3%;
    border-radius: 0.266rem;
    border: 0.026rem solid #dcdcdc;
    text-align: left;
    background: #FFFFFF;
    padding: 0.186rem;
    word-wrap:break-word;
    margin-top: 0.426rem;
  }

  .consumer p:nth-of-type(2) i{
   position: absolute;
    top: -0.106rem;
    left: 1.44rem;
    color:#808080;
    font-size:0.293rem;
  }

  .consumer p:nth-of-type(2) span:after {
    content: "";
    display: block;
    width: 0.16rem;
    height: 0.16rem;
    background: #FFFFFF;
    border: 0.026rem solid #dcdcdc;
    /*border: 0.16rem solid transparent;
    border-right: 0.16rem solid #FFFFFF;
    border-bottom: 0.16rem solid #FFFFFF;*/
    position: absolute;
    -webkit-transform: rotate(135deg);
    transform: rotate(135deg);
    left: -0.106rem;
    border-top-color: #FFFFFF;
    border-left-color: #FFFFFF;
    top: 0.4rem;
    margin: auto;
  }
  .consumer p:nth-of-type(2) .chatImg{
    width:2.266rem;
    height:2.8rem;
    padding: 0;
  }
  .consumer p:nth-of-type(2) .chatImg:after {
    z-index: -1;
    content: "";
    display: block;
    width: 0.16rem;
    height: 0.16rem;
    background: #FFFFFF;
    border: 0.026rem solid #dcdcdc;
    /*border: 0.16rem solid transparent;
    border-right: 0.16rem solid #FFFFFF;
    border-bottom: 0.16rem solid #FFFFFF;*/
    position: absolute;
    -webkit-transform: rotate(135deg);
    transform: rotate(135deg);
    left: -0.106rem;
    border-top-color: #FFFFFF;
    border-left-color: #FFFFFF;
    top: 0.4rem;
    margin: auto;
  }
  .consumer p:nth-of-type(2) .chatImg img{
    width:100%;
    height:100%;
  }
  /*自己*/

  .Customerservice {
    width: 100%;
    overflow: hidden;
  }

  .Customerservice p:nth-of-type(1) {
    width: 100%;
    text-align: center;
    font-size: 0.346rem;
    color: #b4b4b6;
    line-height: 1.226rem;
  }

  .Customerservice p:nth-of-type(2) {
    width: 100%;
    overflow: hidden;
    position: relative;
  }

  .Customerservice p:nth-of-type(2) img {
    width: 1.12rem;
    height: 1.12rem;
    float: right;
    border-radius: 0.213rem;
  }

  .Customerservice p:nth-of-type(2) span {
    position: relative;
    float: right;
    display: block;
    max-width: 80%;
    min-height: 0.933rem;
    margin-right: 3%;
    border-radius: 0.266rem;
    border: 0.026rem solid #dcdcdc;
    text-align: left;
    background: #FFFFFF;
    padding: 0.186rem;
    word-wrap: break-word;
  }

  .Customerservice p:nth-of-type(2) span:after {
    content: "";
    display: block;
    width: 0.16rem;
    height: 0.16rem;
    background: #FFFFFF;
    border: 0.026rem solid #dcdcdc;
    position: absolute;
    -webkit-transform: rotate(135deg);
    transform: rotate(135deg);
    right: -0.106rem;
    border-bottom-color: #FFFFFF;
    border-right-color: #FFFFFF;
    top: 0.4rem;
    margin: auto;
  }
  .Customerservice p:nth-of-type(2) .chatImg{
    width:2.266rem;
    height:2.8rem;
    padding: 0;
  }
  .Customerservice p:nth-of-type(2) .chatImg:after {
    z-index: -1;
    content: "";
    display: block;
    width: 0.16rem;
    height: 0.16rem;
    background: #FFFFFF;
    border: 0.026rem solid #dcdcdc;
    position: absolute;
    -webkit-transform: rotate(135deg);
    transform: rotate(135deg);
    right: -0.106rem;
    border-bottom-color: #FFFFFF;
    border-right-color: #FFFFFF;
    top: 0.4rem;
    margin: auto;
  }
  .Customerservice p:nth-of-type(2) .chatImg img{
    width:100%;
    height:100%;
  }
  .chatListWrapper {
    bottom: 1.253rem !important;
    padding-bottom:0.266rem;
  }
  /*权限提示样式*/
  .hint{
    width: 96%;
    margin-left: 2%;
    overflow: hidden;
  }
  .hint p:nth-of-type(1){
    width: 100%;
    text-align: center;
    font-size: 0.346rem;
    color: #b4b4b6;
    line-height: 1.226rem;
  }
  .hint p:nth-of-type(2){
    background: #ECECEE;
    border-radius:0.106rem;
    color: #808080;
    font-size: 0.32rem;
    line-height: 0.453rem;
    padding: 0.213rem 0.4rem;
  }
  .typingWrapper{
    position: absolute;
    bottom:1.333rem;
    text-align: center;
    width: 100%;
  }
  .singleChat .Customerservice p:nth-of-type(2) i{
    display: none;
  }
  .singleChat .consumer p:nth-of-type(2) i{
    display: none;
  }
  .singleChat .Customerservice p:nth-of-type(2) span{
    margin-top:0;
  }
  .singleChat .consumer p:nth-of-type(2) span{
    margin-top:0;
  }
</style>
<style>
  .chatImg .container-image{
    height:2.8rem;
  }
</style>
