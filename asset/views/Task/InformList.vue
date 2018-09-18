<template>

  <div>
    <header class="mui-bar mui-bar-nav">
      <span class="mui-pull-left settingBtn" @tap.stop.prevent="toSetting">设置</span>
      <h1 class="mui-title">通知</h1>
      <a class="mui-icon mui-pull-right" @tap.stop.prevent="allRead()">
        <svg class="icon" aria-hidden="true">
          <use xlink:href="#icon-yidu"></use>
        </svg>
      </a>
    </header>
    <!--导航栏-->

    <div class="mui-content">
          <!--内容区域-->
          <RefreshList
            ref="RefreshList"
            v-model="list"
            :api="'notification/count'"
            :prevOtherData="{}"
            :nextOtherData="{}"
            :isShowUpToRefreshDescription="false"
            :autoShowEmpty="false"
            class="listWrapper">

              <div class="line-river-after"></div>
              <div class="noticeWrapper" v-if="isOpenNotification === 1 && closingNotice">
                <div class="closeNotice" @tap.stop.prevent="closeNotice">
                  <svg class="icon" aria-hidden="true">
                    <use xlink:href="#icon-times"></use>
                  </svg>
                </div>
                <div class="noticeText">打开通知，避免错过订阅的热点新闻，深度文章，招聘动态和招标快讯</div>
                <div class="unlock border-football" @tap.stop.prevent="goUnlock">开启</div>
              </div>
              <div class="line-river-after"></div>

              <ul>
                <div class="notice" @tap.stop.prevent="$router.pushPlus('/task')" v-if="list.todo_task_message.unread_count">
                  <p>
                    <img src="../../statics/images/notice_img@2x.png"  class="notice_l"/>
                    <span>({{list.todo_task_message.unread_count}})</span>
                    <img  src="../../statics/images/notice_text@2x.png" class="notice_r"/>
                  </p>
                  <p>前往完成</p>
                </div>

                <li @tap.stop.prevent="skip(1)" v-if="list.notice_message.last_message">
                  <img src="../../statics/images/inform1.png"/>
                  <div class="message" v-if="list.notice_message.unread_count">{{list.notice_message.unread_count}}</div>
                  <p>
                    <span>通知公告</span>
                    <span class="mui-ellipsis">{{list.notice_message.last_message ? list.notice_message.last_message.data.title : ''}}</span>
                  </p>
                  <a>
                    {{timeago(list.notice_message.last_message ? list.notice_message.last_message.created_at : '', false)}}
                  </a>
                  <i class="bot"></i>
                </li>
                <li @tap.stop.prevent="skip(2)" v-if="list.money_message.last_message ">
                  <img src="../../statics/images/balance1.png"/>
                  <div class="message" v-if="list.money_message.unread_count">{{list.money_message.unread_count}}</div>
                  <p>
                    <span>余额变动</span>
                    <span class="mui-ellipsis">{{list.money_message.last_message ? list.money_message.last_message.data.title : ""}} </span>
                  </p>
                  <a>
                    {{timeago(list.money_message.last_message ? list.money_message.last_message.created_at : '', false)}}
                  </a>
                  <i class="bot"></i>
                </li>

                <li @tap.stop.prevent="skip(3)" v-if="list.task_message.last_message">
                  <img src="../../statics/images/mission.png"/>
                  <div class="message" v-if="list.task_message.unread_count">{{list.task_message.unread_count}}</div>
                  <p>
                    <span>问答通知</span>
                    <span class="mui-ellipsis">{{list.task_message.last_message ? list.task_message.last_message.data.title : ""}} </span>
                  </p>
                  <a>
                    {{timeago(list.task_message.last_message ? list.task_message.last_message.created_at : '', false)}}
                  </a>
                  <i class="bot"></i>
                </li>
                <li @tap.stop.prevent="skip(4)" v-if="list.readhub_message.last_message">
                  <img src="../../statics/images/read1.png"/>
                  <div class="message" v-if="list.readhub_message.unread_count">{{list.readhub_message.unread_count}}</div>
                  <p>
                    <span>动态通知</span>
                    <span class="mui-ellipsis">{{list.readhub_message.last_message ? list.readhub_message.last_message.data.title : ""}} </span>
                  </p>
                  <a>
                    {{timeago(list.readhub_message.last_message ? list.readhub_message.last_message.created_at : '', false)}}
                  </a>
                  <i class="bot"></i>
                </li>
                <!--消息通知-->
                <li v-for="(item, index) in list.im_messages" :class="'type_' + item.room_type">
                  <img class="lazyImg radius" v-lazy="item.avatar" @tap.stop.prevent="toAvatar(item.contact_uuid)"/>
                  <div class="message" v-if="item.unread_count != 0">{{item.unread_count}}</div>
                  <p @tap.stop.prevent="gochat(item)">
                    <span class="mui-ellipsis">{{item.name}}</span>
                    <span class="mui-ellipsis" v-if="item.last_message.data.img">[图片]</span>
                    <span class="mui-ellipsis" v-else>{{item.last_message.data.text}}</span>
                  </p>
                  <a>
                    {{timeago(item.last_message ? item.last_message.created_at : '', false)}}
                  </a>
                  <i class="bot"></i>
                </li>
              </ul>
          </RefreshList>
        </div>


    <Options
      ref="allOptions"
      :id="'allOptions'"
      :options="['全部标记为已读']"
      @selectedItem="selectedItem"
    ></Options>

  </div>
</template>

<script type="text/javascript">
  import { postRequest } from '../../utils/request'
  import Options from '../../components/Options.vue'
  import RefreshList from '../../components/refresh/List.vue'
  import { checkPermission, toSettingSystem } from '../../utils/plus'

  const TaskMain = {
    data: () => ({
      list: {
        todo_task_message: {
          last_message: {
            status_description: '',
            task_type_description: ''
          },
          unread_count: ''
        },
        notice_message: {
          last_message: {
            created_at: '',
            data: {
              title: ''
            }
          },
          unread_count: ''
        },
        money_message: {
          last_message: {
            created_at: '',
            data: {
              title: ''
            }
          },
          unread_count: ''
        },
        readhub_message: {
          last_message: {
            created_at: '',
            data: {
              title: ''
            }
          },
          unread_count: ''
        },
        task_message: {
          last_message: {
            created_at: '',
            data: {
              title: ''
            }
          },
          unread_count: ''
        },
        im_messages: []
      },
      loading: true,
      total_count: 0,
      mobile: 0,
      closingNotice: '',
      Today: '',
      isShowNotice: -1,
      isOpenNotification: -1 // -1， 未知, 1 yes 0 no
    }),
    components: {
      RefreshList,
      Options
    },
    created () {
    },
    activated () {
      this.checkPermission()
    },
    methods: {
      checkPermission () {
        checkPermission('NOTIFITION', () => {
          this.isOpenNotification = 0
        }, () => {
          this.isOpenNotification = 1
        })
      },
      goUnlock () {
        toSettingSystem('NOTIFITION')
      },
      closeNotice () {
        var data = new Date().toLocaleString().split(' ')[0]
        localStorage.setItem('closingNotice', data)
        this.closingNotice = false
      },
      toSetting () {
        this.$router.pushPlus('/push/setting')
      },
      allRead () {
        this.$refs.allOptions.toggle()
      },
      selectedItem (item) {
        switch (item) {
          case '全部标记为已读':
            this.notification()
            this.$refs.allOptions.toggle()
            break
        }
      },
      notification () {
        postRequest(`notification/mark_as_read`, {
          notification_type: 0
        }).then(response => {
          var code = response.data.code
          if (code !== 1000) {
            window.mui.alert(response.data.message)
            window.mui.back()
            return
          }
          this.list.money_message.unread_count = 0
          this.list.notice_message.unread_count = 0
          this.list.readhub_message.unread_count = 0
          this.list.task_message.unread_count = 0
          for (var i = 0; i < this.list.im_messages.length; i++) {
            this.list.im_messages[i].unread_count = 0
          }
          window.mui.toast('标记为已读')
        })
      },
      toAvatar (uuid) {
        if (!uuid) {
          return false
        }
        this.$router.pushPlus('/share/resume?id=' + uuid + '&goback=1' + '&time=' + (new Date().getTime()))
      },
      messagecountchange (obj) {
        this.total_count = obj
      },
      gochat (item) {
        item.unread_count = 0
        if (item.room_type === 1) {
          // 私聊
          this.$router.pushPlus('/chat/' + item.contact_id)
        } else {
          // 群聊
          this.$router.pushPlus('/group/chat/' + item.room_id)
        }
      },
      skip (num) {
        switch (num) {
          case 1:
            this.list.notice_message.unread_count = 0
            this.$router.pushPlus('/informbar')
            break
          case 2:
            this.list.money_message.unread_count = 0
            this.$router.pushPlus('/balancebar')
            break
          case 3:
            this.list.task_message.unread_count = 0
            this.$router.pushPlus('/taskbar')
            break
          case 4:
            this.list.readhub_message.unread_count = 0
            this.$router.pushPlus('/readbar')
            break
        }
      }
    },
    mounted () {
      this.closingNotice = localStorage.getItem('closingNotice')
      var data = new Date().toLocaleString().split(' ')[0]
      if (data === this.closingNotice) {
        this.closingNotice = false
      } else {
        this.closingNotice = true
      }
      window.addEventListener('resume', () => {
        this.checkPermission()
      }, true)
    }
  }
  export default TaskMain
</script>

<style scoped="scoped" lang="less">
  .bot {
    position: absolute;
    right: 0.426rem;
    bottom: 0;
    left: 0.426rem;
    height: 0.026rem;
    -webkit-transform: scaleY(.5);
    transform: scaleY(.5);
    background-color: rgb(220, 220, 220);
  }

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

  .mui-icon {
    .icon {
      font-size: 0.4rem;
    }
  }

  .noticeWrapper {
    padding: 0.266rem 0.426rem;
    height: 1.493rem;
    background: #F3F4F6;
    display: flex;
    .closeNotice {
      font-size: 0.48rem;
      display: flex;
      color: #C8C8C8;
      margin-right: 0.4rem;
      margin-top: 0.24rem;
      .icon {
        font-size: 0.48rem;
      }
    }
    .noticeText {
      width: 71%;
      color: #03AEF9;
      font-size: 0.373rem;
      line-height: 0.533rem;
      margin-top: -0.026rem;
    }
    .unlock {
      width: 1.76rem;
      height: 0.72rem;
      color: #03AEF9;
      font-size: 0.373rem;
      margin: 0.133rem 0 0 0.4rem;
      line-height: 0.72rem;
      text-align: center;
      border-radius: 2.666rem;
      /*border: 0.026rem solid #03AEF9;*/
    }
    .border-football {
      &:after {
        border-color: #03AEF9;
      }
    }
  }

  .mui-content {
    background: #FFFFFF;
  }
  /*内容区域*/
  .mui-content ul li {
    width: 100%;
    height: 1.6rem;
    padding: 0 0.426rem;
    position: relative;
  }

  .mui-content ul li img {
    width: 1.12rem;
    height: 1.12rem;
    margin-top: 0.266rem;
    float: left;
  }


  .mui-content ul li p {
    float: left;
    margin-top: 0.266rem;
    margin-left: 0.32rem;
  }

  .mui-content ul li a {
    position: absolute;
    top: 0.266rem;
    right: 0.426rem;
    font-size: 0.32rem;
    color: #c8c8c8;
  }

  .mui-content ul li p span:nth-of-type(1) {
    display: block;
    font-size: 0.426rem;
    color: #444444;
  }

  .mui-content ul li p {
    width: 81%;
  }

  .mui-content ul li p span:nth-of-type(2) {
    display: block;
    width: 100%;
    height: 0.48rem;
    font-size: 0.346rem;
    color: #808080;
  }
  .mui-content ul li:nth-last-of-type(1) i{
    display: none;
  }
  .message {
    position: absolute;
    font-size: 0.293rem;
    color: #ffffff;
    min-width: 0.48rem;
    height: 0.48rem;
    background: #f03c69;
    border-radius: 50%;
    text-align: center;
    line-height: 0.48rem;
    left: 1.2rem;
    top: 0.133rem;
  }

  .menu_message {
    position: absolute;
    left: 79%;
    top: 0.213rem;
    background: #f03c69;
    font-size: 0.293rem;
    text-align: center;
    color: #fff;
    padding: 0rem 0.08rem;
    min-width: 0.4rem;
    min-height: 0.4rem;
    border-radius: 0.4rem;
    line-height: 0.4rem;
  }

  .radius {
    border-radius: 50%;
  }
  /*客服头像方形*/
  .mui-content ul li:nth-of-type(5) img{
    border-radius: 0.266rem;
  }

  .listWrapper{
    bottom: 1.333rem;
  }

  .w414-3 .listWrapper{
    bottom:50px !important;  /* px不转换 */
  }

  /*待完成任务*/
  .notice{
    width:100%;
    height:1.173rem;
    margin-top: 0.2rem;
    padding: 0 0.426rem;
  }
  .notice p:nth-of-type(1){
    width: 72%;
    height:100%;
    background:#dcdcdc;
    border-radius: 0.106rem 0 0rem 0.106rem;
    float: left;
    position: relative;
    z-index: 9;
  }
  .notice p:nth-of-type(1) .notice_l{
    float: left;
    height:100%;
  }
  .notice p:nth-of-type(1) .notice_r{
    height:0.4rem;
    float: right;

    margin-top: 0.386rem;

  }
  .notice p:nth-of-type(1) span{
    display: block;
    height: 100%;
    float: right;
    margin-right: 4%;
    margin-left: 1%;
    line-height: 1.146rem;
    font-size: 0.426rem;
    color: #235280;
  }
  .notice p:nth-of-type(1):after {
    content: "";
    display: block;
    width: 0.266rem;
    height: 0.266rem;
    border-radius: 0.053rem;
    background: #dcdcdc;
    position: absolute;
    -webkit-transform: rotate(135deg);
    transform: rotate(135deg);
    right: -0.106rem;
    top: 0rem;
    bottom: 0;
    margin: auto;
  }

  .notice p:nth-of-type(2){
    float: right;
    width: 27%;
    height:100%;
    background:#f03c69;
    text-align: center;
    line-height: 1.173rem;
    font-size:0.426rem;
    color: #FFFFFF;
    font-weight:500;
    border-radius:  0 0.106rem 0.106rem 0;
    position: relative;
  }
  .notice p:nth-of-type(2):after {
    content: "";
    display: block;
    width: 0.266rem;
    height: 0.266rem;
    border-radius: 0.053rem;
    background: #FFFFFF;
    /*border: 0.026rem solid #000000;*/
    position: absolute;
    -webkit-transform: rotate(135deg);
    transform: rotate(135deg);
    left: -0.133rem;
    top: 0rem;
    bottom: 0;
    margin: auto;
  }
  /*适配*/
  @media (min-width: 320px) {
    .notice p:nth-of-type(1) .notice_l{
      width:45%;
      margin-right: 0;
    }
  }

  @media (min-width: 375px) {
    .notice p:nth-of-type(1) .notice_l{
      margin-right: 5%;
    }
  }

  @media (min-width: 414px) {
    .notice p:nth-of-type(1) .notice_l{
      margin-right: 5%;
    }
    .noticeText {
      /*margin-top: 0.026rem;*/
    }
  }
  header svg{
    font-size: 0.453rem;
    color:#808080;
    position: relative;
    top:-0.106rem;
  }
  .type_2 img{
    border-radius: 0.266rem;
  }
  .settingBtn{
    padding-top:0.266rem;
    font-size:0.4rem;
    font-family:PingFangSC-Medium;
    color:#808080;
  }
</style>
