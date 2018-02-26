<template>

  <div>
    <header class="mui-bar mui-bar-nav">
      <a class="mui-action-back mui-icon mui-icon-left-nav mui-pull-left"></a>
      <h1 class="mui-title">{{name}}<typing v-if="this.chatRoomId" :room_id="this.chatRoomId"></typing></h1>
    </header>
    <div class="mui-content" id='contentwrapper'>

      <RefreshList v-if="this.chatRoomId" ref="RefreshList"
        v-model="list"
        :api="'im/messages'"
        :autoShowEmpty="false"
        :pageMode="true"
        :downLoadMoreMode="true"
        :isShowUpToRefreshDescription="false"
        :prevOtherData="{room_id: this.chatRoomId}"
        :nextOtherData="{room_id: this.chatRoomId}"
        :prevSuccessCallback="prevSuccessCallback"
        class="chatListWrapper">
        <ul class="user" id="myData">
          <template v-for="(item, index) in list">
            <!--用户 && chatUserId == item.user_id"-->
            <li class="consumer" v-if="currentUser.user_id != item.user_id && chatUserId == item.user_id">
              <p>{{showTime(list[index-1], item)}}</p>
              <p>
                <img :src="item.avatar"  @tap.stop.prevent="toAvatar(item.uuid)" />
                <span v-if="item.data.text">
                  {{item.data.text}}
                </span>
                <span v-if="item.data.img" class="chatImg">
                   <SingleImage :src="item.data.img" :isSmallImage="item.data.img.length < 100" :group="currentUser.user_id + ''"></SingleImage>
                </span>
              </p>
            </li>
            <!--自己  -->
            <li class="Customerservice" v-else-if="currentUser.user_id == item.user_id">
              <p>{{showTime(list[index-1], item)}}</p>
              <p>
                <img :src="currentUser.avatar_url" @tap.stop.prevent="toAvatar(item.uuid)"/>
                <span v-if="item.data.text" v-html="textToLink(item.data.text)">
                   <!--{{item.data.text}}-->
                </span>
                <span v-if="item.data.img" class="chatImg">
                  <SingleImage :src="item.data.img" :isSmallImage="item.data.img.length < 100" :group="currentUser.user_id + ''"></SingleImage>
                </span>
              </p>

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

  </div>
</template>

<script>
//  {contact_id:this.chatUserId}
  import { postRequest } from '../../utils/request'
  import RefreshList from '../../components/refresh/List.vue'
  import { getLocalUserInfo } from '../../utils/user'
  import { autoTextArea, openVendorUrl } from '../../utils/plus'
  import uploadImage from '../../components/uploadImage'
  import SingleImage from '../../components/image/Image.vue'
  import { textToLinkHtml } from '../../utils/dom'
  import Typing from '../../components/Typing.vue'
  import { searchText } from '../../utils/search'

  const Chat = {
    data: () => ({
      list: [],
      comment: '',
      currentUser: getLocalUserInfo(),
      flag: true,
      chatRoomId: '',
      chatUserId: '',
      maxImageCount: 1,
      images: [],
      isTyping: false,
      name: ''
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
      Typing
    },
    watch: {
      '$route': 'refreshPageData'
    },
    methods: {
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

          setTimeout(() => {
            this.$refs.RefreshList.scrollToBottom()
          }, 500)
        }
      },
//      转换成html
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
        })
      },
      showTime (prevtime, time) {
        if (prevtime) {
          var current = new Date(time.created_at.replace(/-/g, '/'))
          var previous = new Date(prevtime.created_at.replace(/-/g, '/'))
          var interval = parseInt(current - previous) / 1000 / 60
          if (interval >= 5) {
            return time.created_at
          } else {
            return ''
          }
        } else {
          return time.created_at
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
          name: obj.name
        }
        this.name = item.name
        if (parseInt(this.chatUserId) === item.user_id) {
          this.list.push(item)
        } else {
          return false
        }
        setTimeout(() => {
          this.$refs.RefreshList.scrollToBottom()
        }, 500)
      },
      uploadImage () {
        var input = document.getElementById('bounce')
        input.blur()
        this.$refs.uploadImage.uploadImage()
      },
      refreshPageData () {
        this.getDetail()
      },
      getDetail () {
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
            window.Echo.private('chat.room.' + this.chatRoomId)
          })
        }
      },
      prevSuccessCallback () {
        this.name = this.$refs.RefreshList.getResponse().data.contact.name
        if (parseInt(this.$refs.RefreshList.currentPage) === 1) {
          setTimeout(() => {
            this.$refs.RefreshList.scrollToBottom()
          }, 500)
        }
      },
      focus () {
        setTimeout(() => {
          this.$refs.RefreshList.scrollToBottom()
        }, 1000)
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

          setTimeout(() => {
            this.$refs.RefreshList.scrollToBottom()
          }, 500)

          postRequest(`im/message-store`, {
            text: this.comment,
            contact_id: this.chatUserId,
            room_id: this.chatRoomId
          }).then(response => {
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
        openVendorUrl(this.$el.querySelector('#myData'))
      })
    },
    mounted () {
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
    height: 4.7rem;
    background: #ececee;
    position: absolute;
    bottom: 0;
    padding: 0 1rem;
    z-index: 5;
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    align-items: center;
  }

  .message input {
    height: 3.5rem;
    border-radius: 0.5rem;
    background: #ffffff;
    border: none;
    margin-bottom: 0;
    box-shadow: 0 0 1rem rgba(220, 220, 220, 1);

  }

  .message svg {
    font-size: 3.7rem;
    margin-left: 1rem;
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
    margin-top: 1rem;
    /*border: 0.1rem solid #CCCCCC;*/
  }
   /*客服*/
  .consumer p:nth-of-type(1) {
    text-align: center;
    font-size: 1.3rem;
    color: #b4b4b6;
    line-height: 4.6rem;
  }

  .consumer p:nth-of-type(2) {
    width: 100%;
    overflow: hidden;
  }

  .consumer p:nth-of-type(2) img {
    width: 4.2rem;
    height: 4.2rem;
    float: left;
    border-radius: 0.8rem;
  }

  .consumer p:nth-of-type(2) span {
    position: relative;
    float: left;
    display: block;
    max-width: 80%;
    min-height: 3.5rem;
    margin-left: 3%;
    border-radius: 1rem;
    border: 0.1rem solid #dcdcdc;
    text-align: left;
    background: #FFFFFF;
    padding: 0.7rem;
    word-wrap:break-word;
  }

  .consumer p:nth-of-type(2) span:after {
    content: "";
    display: block;
    width: 0.6rem;
    height: 0.6rem;
    background: #FFFFFF;
    border: 0.1rem solid #dcdcdc;
    /*border: 0.6rem solid transparent;
    border-right: 0.6rem solid #FFFFFF;
    border-bottom: 0.6rem solid #FFFFFF;*/
    position: absolute;
    -webkit-transform: rotate(135deg);
    transform: rotate(135deg);
    left: -0.4rem;
    border-top-color: #FFFFFF;
    border-left-color: #FFFFFF;
    top: 1.5rem;
    margin: auto;
  }
  .consumer p:nth-of-type(2) .chatImg{
    width:8.5rem;
    height:10.5rem;
    padding: 0;
  }
  .consumer p:nth-of-type(2) .chatImg:after {
    z-index: -1;
    content: "";
    display: block;
    width: 0.6rem;
    height: 0.6rem;
    background: #FFFFFF;
    border: 0.1rem solid #dcdcdc;
    /*border: 0.6rem solid transparent;
    border-right: 0.6rem solid #FFFFFF;
    border-bottom: 0.6rem solid #FFFFFF;*/
    position: absolute;
    -webkit-transform: rotate(135deg);
    transform: rotate(135deg);
    left: -0.4rem;
    border-top-color: #FFFFFF;
    border-left-color: #FFFFFF;
    top: 1.5rem;
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
    font-size: 1.3rem;
    color: #b4b4b6;
    line-height: 4.6rem;
  }

  .Customerservice p:nth-of-type(2) {
    width: 100%;
    overflow: hidden;
  }

  .Customerservice p:nth-of-type(2) img {
    width: 4.2rem;
    height: 4.2rem;
    float: right;
    border-radius: 0.8rem;
  }

  .Customerservice p:nth-of-type(2) span {
    position: relative;
    float: right;
    display: block;
    max-width: 80%;
    min-height: 3.5rem;
    margin-right: 3%;
    border-radius: 1rem;
    border: 0.1rem solid #dcdcdc;
    text-align: left;
    background: #FFFFFF;
    padding: 0.7rem;
    word-wrap: break-word;
  }

  .Customerservice p:nth-of-type(2) span:after {
    content: "";
    display: block;
    width: 0.6rem;
    height: 0.6rem;
    background: #FFFFFF;
    border: 0.1rem solid #dcdcdc;
    position: absolute;
    -webkit-transform: rotate(135deg);
    transform: rotate(135deg);
    right: -0.4rem;
    border-bottom-color: #FFFFFF;
    border-right-color: #FFFFFF;
    top: 1.5rem;
    margin: auto;
  }
  .Customerservice p:nth-of-type(2) .chatImg{
    width:8.5rem;
    height:10.5rem;
    padding: 0;
  }
  .Customerservice p:nth-of-type(2) .chatImg:after {
    z-index: -1;
    content: "";
    display: block;
    width: 0.6rem;
    height: 0.6rem;
    background: #FFFFFF;
    border: 0.1rem solid #dcdcdc;
    position: absolute;
    -webkit-transform: rotate(135deg);
    transform: rotate(135deg);
    right: -0.4rem;
    border-bottom-color: #FFFFFF;
    border-right-color: #FFFFFF;
    top: 1.5rem;
    margin: auto;
  }
  .Customerservice p:nth-of-type(2) .chatImg img{
    width:100%;
    height:100%;
  }
  .chatListWrapper {
    bottom: 4.7rem;
  }

</style>
<style>
  .chatImg .container-image{
    height:10.5rem;
  }
</style>
