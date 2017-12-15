<template>

  <div>
    <header class="mui-bar mui-bar-nav">
      <a class="mui-action-back mui-icon mui-icon-left-nav mui-pull-left"></a>
      <h1 class="mui-title" v-if="chatUserId == 31">客服小哈</h1>
      <h1 class="mui-title" v-else>{{name}}</h1>
    </header>
    <div class="mui-content" id='contentwrapper'>

      <RefreshList ref="RefreshList"
        v-model="list"
        :api="'im/messages'"
        :autoShowEmpty="false"
        :pageMode="true"
        :downLoadMoreMode="true"
        :isShowUpToRefreshDescription="false"
        :prevOtherData="{contact_id:this.chatUserId}"
        :nextOtherData="{contact_id:this.chatUserId}"
        :prevSuccessCallback="prevSuccessCallback"
        class="chatListWrapper">
        <ul class="user" id="myData">
          <template v-for="item in list">
            <!--客服-->
            <li class="consumer" v-if="id != item.user_id">
              <p>{{item.created_at}}</p>
              <p>
                <img :src="item.avatar" v-if="chatUserId == item.user_id"/>
                <img src="../../statics/images/service2.png" v-else/>
                <span v-if="item.data.text">
                  {{item.data.text}}
                </span>
                <span v-if="item.data.image">
                  <img :src="item.data.image" width="300" height="300"/>
                </span>
              </p>

            </li>
            <!--自己-->
            <li class="Customerservice" v-else-if="id == item.user_id">
              <p>{{item.created_at}}</p>
              <p>
                <img :src="avatar" />
                <span v-if="item.data.text">
                  {{item.data.text}}
                </span>
                <span v-if="item.data.image">
                  <img :src="item.data.image" width="300" height="300"/>
                </span>
              </p>

            </li>
          </template>
        </ul>
      </RefreshList>
    </div>

    <!--发送消息框-->
    <div class="message" id="message">
      <input type="text" v-model.trim="comment" @keyup="show($event)"  @focus="focus" @blur="blur"/>
      <svg class="icon" aria-hidden="true" @tap.stop.prevent="uploadImage()">
        <use xlink:href="#icon-plus"></use>
      </svg>
      <svg class="icon" aria-hidden="true">
        <use xlink:href="#icon-fasong" @tap.stop.prevent="message()"></use>
      </svg>
    </div>
    <!--发送消息框end-->

    <uploadImage ref="uploadImage" v-model="images"
                 :isMultiple="false"
                 :images="images"
                 :ImageMaximum="maxImageCount"
    ></uploadImage>

  </div>
</template>

<script>
  import { postRequest } from '../../utils/request'
  import RefreshList from '../../components/refresh/List.vue'
  import { getLocalUserInfo } from '../../utils/user'
  import { autoTextArea } from '../../utils/plus'
  import uploadImage from '../../components/uploadImage'

  const Chat = {
    data: () => ({
      list: [],
      comment: '',
      id: getLocalUserInfo().user_id,
      avatar: getLocalUserInfo().avatar_url,
      flag: true,
      chatUserId: '',
      maxImageCount: 1,
      images: [],
      name: ''
    }),
    created () {
      this.getDetail()
    },
    computed: {
    },
    components: {
      RefreshList,
      uploadImage
    },
    watch: {
      '$route': 'refreshPageData',
      images: function (newValue, oldValue) {
        if (newValue.length) {
          var item = {
            created_at: this.currentTime(),
            data: {
              text: '',
              image: newValue[0].base64
            },
            id: null,
            user_id: this.id,
            avatar: this.avatar
          }
          this.list.push(item)
          setTimeout(() => {
            this.$refs.RefreshList.scrollToBottom()
          }, 500)
        }
      }
    },
    methods: {
     // for zhangzhen 推送消息
      chat (obj) {
        console.error(obj)
        var item = {
          created_at: obj.created_at,
          data: {
            text: obj.body.text,
            image: obj.body.image
          },
          id: obj.id,
          user_id: 0,
          avatar: obj.avatar
        }
        this.list = this.list.concat(item)
      },
      uploadImage () {
        this.$refs.uploadImage.uploadImage()
      },
      refreshPageData () {
        this.getDetail()
      },
      getDetail () {
        if (this.$route.params.id) {
          this.chatUserId = this.$route.params.id
        }
        if (this.$route.query.name) {
          this.name = this.$route.query.name
        }
      },
      prevSuccessCallback () {
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
            user_id: this.id
          }

          this.list.push(item)

          setTimeout(() => {
            this.$refs.RefreshList.scrollToBottom()
          }, 500)

          postRequest(`im/message-store`, {
            text: this.comment,
            contact_id: this.chatUserId
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
    height: 47px;
    background: #ececee;
    position: absolute;
    bottom: 0;
    padding: 0 10px;
    z-index: 999;
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    align-items: center;
  }

  .message input {
    height: 35px;
    border-radius: 5px;
    background: #ffffff;
    border: none;
    margin-bottom: 0;
    box-shadow: 0 0 10px rgba(220, 220, 220, 1);

  }

  .message svg {
    font-size: 37px;
    margin-left: 10px;
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
    /*border: 1px solid #CCCCCC;*/
  }

  .consumer p:nth-of-type(1) {
    text-align: center;
    font-size: 13px;
    color: #b4b4b6;
    line-height: 46px;
  }

  .consumer p:nth-of-type(2) {
    width: 100%;
    overflow: hidden;
  }

  .consumer p:nth-of-type(2) img {
    width: 42px;
    height: 42px;
    float: left;
    border-radius: 8px;
  }

  .consumer p:nth-of-type(2) span {
    position: relative;
    float: left;
    display: block;
    max-width: 86%;
    min-height: 35px;
    margin-left: 3%;
    border-radius: 10px;
    border: 1px solid #dcdcdc;
    text-align: left;
    background: #FFFFFF;
    padding: 7px;
  }

  .consumer p:nth-of-type(2) span:after {
    content: "";
    display: block;
    width: 6px;
    height: 6px;
    background: #FFFFFF;
    border: 1px solid #dcdcdc;
    /*border: 6px solid transparent;
    border-right: 6px solid #FFFFFF;
    border-bottom: 6px solid #FFFFFF;*/
    position: absolute;
    -webkit-transform: rotate(135deg);
    transform: rotate(135deg);
    left: -4px;
    border-top-color: #FFFFFF;
    border-left-color: #FFFFFF;
    top: 15px;
    margin: auto;
  }
  /*客服*/

  .Customerservice {
    width: 100%;
    overflow: hidden;
  }

  .Customerservice p:nth-of-type(1) {
    width: 100%;
    text-align: center;
    font-size: 13px;
    color: #b4b4b6;
    line-height: 46px;
  }

  .Customerservice p:nth-of-type(2) {
    width: 100%;
    overflow: hidden;
  }

  .Customerservice p:nth-of-type(2) img {
    width: 42px;
    height: 42px;
    float: right;
    border-radius: 8px;
  }

  .Customerservice p:nth-of-type(2) span {
    position: relative;
    float: right;
    display: block;
    max-width: 80%;
    min-height: 35px;
    margin-right: 3%;
    border-radius: 10px;
    border: 1px solid #dcdcdc;
    text-align: left;
    background: #FFFFFF;
    padding: 7px;
  }

  .Customerservice p:nth-of-type(2) span:after {
    content: "";
    display: block;
    width: 6px;
    height: 6px;
    background: #FFFFFF;
    border: 1px solid #dcdcdc;
    position: absolute;
    -webkit-transform: rotate(135deg);
    transform: rotate(135deg);
    right: -4px;
    border-bottom-color: #FFFFFF;
    border-right-color: #FFFFFF;
    top: 15px;
    margin: auto;
  }

  .chatListWrapper {
    bottom: 47px;
  }
</style>
