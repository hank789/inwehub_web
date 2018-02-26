<template>

  <div>
    <header class="mui-bar mui-bar-nav">
      <h1 class="mui-title">通知</h1>
    </header>
    <!--导航栏-->

    <div class="mui-content">
      <div class="mui-scroll-wrapper">
        <div class="content">
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
              <ul>
                <div class="notice" @tap.stop.prevent="$router.pushPlus('/task')" v-if="list.todo_task_message.unread_count">
                  <p>
                    <img src="../../statics/images/notice_img@2x.png"  class="notice_l"/>
                    <span>({{list.todo_task_message.unread_count}})</span>
                    <img  src="../../statics/images/notice_text@2x.png" class="notice_r"/>
                  </p>
                  <p>前往完成</p>
                </div>
                <!--<li @tap.stop.prevent="$router.pushPlus('/task')" v-if="list.todo_task_message.last_message">-->
                  <!--<img src="../../statics/images/task.png" />-->
                  <!--<div class="message" v-if="list.todo_task_message.unread_count">{{list.todo_task_message.unread_count}}</div>-->
                  <!--<p>-->
                  <!--<span>任务通知</span>-->
                  <!--<span class="mui-ellipsis"><i>{{list.todo_task_message.last_message ? list.todo_task_message.last_message.task_type_description: ""}}</i><i>{{list.todo_task_message.last_message ? '&nbsp;|&nbsp;' + list.todo_task_message.last_message.status_description: ""}}</i> </span>-->
                  <!--</p>-->
                  <!--<a>{{list.todo_task_message.last_message ? list.todo_task_message.last_message.created_at : ''}}</a>-->
                  <!--<i class="bot"></i>-->
                <!--</li>-->
                <li @tap.stop.prevent="skip(1)" v-if="list.notice_message.last_message">
                  <img src="../../statics/images/inform1.png"/>
                  <div class="message" v-if="list.notice_message.unread_count">{{list.notice_message.unread_count}}</div>
                  <p>
                    <span>通知公告</span>
                    <span class="mui-ellipsis">{{list.notice_message.last_message ? list.notice_message.last_message.data.title : ''}}</span>
                  </p>
                  <a>{{list.notice_message.last_message ? list.notice_message.last_message.created_at : ''}}</a>
                  <i class="bot"></i>
                </li>
                <li @tap.stop.prevent="skip(2)" v-if="list.money_message.last_message ">
                  <img src="../../statics/images/balance1.png"/>
                  <div class="message" v-if="list.money_message.unread_count">{{list.money_message.unread_count}}</div>
                  <p>
                    <span>余额变动</span>
                    <span class="mui-ellipsis">{{list.money_message.last_message ? list.money_message.last_message.data.title : ""}} </span>
                  </p>
                  <a>{{list.money_message.last_message ? list.money_message.last_message.created_at : ''}}</a>
                  <i class="bot"></i>
                </li>
                <!--<li @tap.stop.prevent="$router.pushPlus('/integralbar')">-->
                      <!--<img src="../../statics/images/integral1.png" />-->
                      <!--<div class="message">99</div>-->
                      <!--<p>-->
                         <!--<span>积分变动</span>-->
                         <!--<span class="mui-ellipsis">回答了一条问题增加2积分</span>-->
                      <!--</p>-->
                      <!--<a>16:44</a>-->
                      <!--<i class="bot"></i>-->
                 <!--</li>-->
                <li @tap.stop.prevent="skip(3)" v-if="list.task_message.last_message">
                  <img src="../../statics/images/mission.png"/>
                  <div class="message" v-if="list.task_message.unread_count">{{list.task_message.unread_count}}</div>
                  <p>
                    <span>问答通知</span>
                    <span class="mui-ellipsis">{{list.task_message.last_message ? list.task_message.last_message.data.title : ""}} </span>
                  </p>
                  <a>{{list.task_message.last_message ? list.task_message.last_message.created_at : ''}}</a>
                  <i class="bot"></i>
                </li>
                <li @tap.stop.prevent="skip(4)" v-if="list.readhub_message.last_message">
                  <img src="../../statics/images/read1.png"/>
                  <div class="message" v-if="list.readhub_message.unread_count">{{list.readhub_message.unread_count}}</div>
                  <p>
                    <span>动态通知</span>
                    <span class="mui-ellipsis">{{list.readhub_message.last_message ? list.readhub_message.last_message.data.title : ""}} </span>
                  </p>
                  <a>{{list.readhub_message.last_message ? list.readhub_message.last_message.created_at : ''}}</a>
                  <i class="bot"></i>
                </li>
                <!--消息通知-->
                <li   v-for="(item, index) in list.im_messages">
                  <img :src="item.avatar" class="radius" @tap.stop.prevent="toAvatar(item.contact_uuid)"/>
                  <div class="message" v-if="item.unread_count != 0">{{item.unread_count}}</div>
                  <p @tap.stop.prevent="gochat(item)">
                    <span class="mui-ellipsis">{{item.name}}</span>
                    <span class="mui-ellipsis" v-if="item.last_message.data.img">[图片]</span>
                    <span class="mui-ellipsis" v-else>{{item.last_message.data.text}}</span>
                  </p>
                  <a>{{item.last_message ? item.last_message.created_at : ''}}</a>
                  <i class="bot"></i>
                </li>
              </ul>
          </RefreshList>
        </div>
      </div>
    </div>
    <!--<div id="statusBarStyle" background="#fff" bgColor="#fff" mode="dark"></div>-->
  </div>
</template>

<script type="text/javascript">
  import RefreshList from '../../components/refresh/List.vue'
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
      mobile: 0
    }),
    components: {
      RefreshList
    },
    methods: {
      toAvatar (uuid) {
        if (!uuid) {
          return false
        }
        this.$router.pushPlus('/share/resume?id=' + uuid + '&goback=1' + '&time=' + (new Date().getTime()))
      },
      messagecountchange (obj) {
        this.total_count = obj
//           console.log(obj);
      },
      gochat (item) {
        item.unread_count = 0
        this.$router.pushPlus('/chat/' + item.contact_id)
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
    }
  }
  export default TaskMain
</script>

<style scoped="scoped">
  .bot {
    position: absolute;
    right: 1.6rem;
    bottom: 0;
    left: 1.6rem;
    height: 0.1rem;
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
  .mui-content {
    background: #FFFFFF;
  }
  /*内容区域*/
  .content {
    margin-top: 4.5rem;
  }

  .content ul li {
    width: 100%;
    height: 6rem;
    padding: 0 1.6rem;
    position: relative;
  }

  .content ul li img {
    width: 4.2rem;
    height: 4.2rem;
    margin-top: 1rem;
    float: left;
  }


  .content ul li p {
    float: left;
    margin-top: 1rem;
    margin-left: 1.2rem;
  }

  .content ul li a {
    position: absolute;
    top: 1rem;
    right: 1.6rem;
    font-size: 1.2rem;
    color: #c8c8c8;
  }

  .content ul li p span:nth-of-type(1) {
    display: block;
    font-size: 1.6rem;
    color: #444444;
  }

  .content ul li p {
    width: 81%;
  }

  .content ul li p span:nth-of-type(2) {
    display: block;
    width: 100%;
    height: 1.8rem;
    font-size: 1.3rem;
    color: #808080;
  }

  .message {
    position: absolute;
    font-size: 1.1rem;
    color: #ffffff;
    min-width: 1.8rem;
    height: 1.8rem;
    background: #f03c69;
    border-radius: 50%;
    text-align: center;
    line-height: 1.8rem;
    left: 4.5rem;
    top: 0.5rem;
  }

  .menu_message {
    position: absolute;
    left: 79%;
    top: 0.8rem;
    background: #f03c69;
    font-size: 1.1rem;
    text-align: center;
    color: #fff;
    padding: 0rem 0.3rem;
    min-width: 1.5rem;
    min-height: 1.5rem;
    border-radius: 1.5rem;
    line-height: 1.5rem;
  }

  .radius {
    border-radius: 50%;
  }
  /*客服头像方形*/
  .content ul li:nth-of-type(5) img{
    border-radius: 1rem;
  }

  .listWrapper{
    bottom: 5rem;
  }

  /*待完成任务*/
  .notice{
    width:100%;
    height:4.4rem;
    margin-top: 0.75rem;
    padding: 0 1.6rem;
  }
  .notice p:nth-of-type(1){
    width: 72%;
    height:100%;
    background:#dcdcdc;
    border-radius: 0.4rem 0 0rem 0.4rem;
    float: left;
    position: relative;
    z-index: 9;
  }
  .notice p:nth-of-type(1) .notice_l{
    float: left;
    height:100%;
  }
  .notice p:nth-of-type(1) .notice_r{
    height:1.5rem;
    float: right;

    margin-top: 1.45rem;

  }
  .notice p:nth-of-type(1) span{
    display: block;
    height: 100%;
    float: right;
    margin-right: 4%;
    margin-left: 1%;
    line-height: 4.3rem;
    font-size: 1.6rem;
    color: #235280;
  }
  .notice p:nth-of-type(1):after {
    content: "";
    display: block;
    width: 1rem;
    height: 1rem;
    border-radius: 0.2rem;
    background: #dcdcdc;
    position: absolute;
    -webkit-transform: rotate(135deg);
    transform: rotate(135deg);
    right: -0.4rem;
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
    line-height: 4.4rem;
    font-size:1.6rem;
    color: #FFFFFF;
    font-weight:500;
    border-radius:  0 0.4rem 0.4rem 0;
    position: relative;
  }
  .notice p:nth-of-type(2):after {
    content: "";
    display: block;
    width: 1rem;
    height: 1rem;
    border-radius: 0.2rem;
    background: #FFFFFF;
    /*border: 0.1rem solid #000000;*/
    position: absolute;
    -webkit-transform: rotate(135deg);
    transform: rotate(135deg);
    left: -0.5rem;
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
  }

</style>
