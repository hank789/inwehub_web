<template>

  <div>
    <header class="mui-bar mui-bar-nav">
      <a class="mui-action-back mui-icon mui-icon-left-nav mui-pull-left"></a>
      <h1 class="mui-title">通知</h1>
    </header>
    <!--导航栏-->

    <div class="mui-content">
      <div class="mui-scroll-wrapper">
        <div class="content">
          <div class="menu">
            <span @tap.stop.prevent="$router.replace('/task')">任务</span>
            <span @tap.stop.prevent="">消息 <i></i></span>
            <div class="menu_message" v-show="total_count != 0">{{total_count}}</div>
          </div>
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
                <li @tap.stop.prevent="skip(1)">
                  <img src="../../statics/images/inform1.png"/>
                  <div class="message" v-if="list.notice_message.unread_count">{{list.notice_message.unread_count}}</div>
                  <p>
                    <span>通知公告</span>
                    <span class="mui-ellipsis">{{list.notice_message.last_message ? list.notice_message.last_message.data.title : ''}}</span>
                  </p>
                  <a>{{list.notice_message.last_message ? list.notice_message.last_message.created_at : ''}}</a>
                  <i class="bot"></i>
                </li>
                <li @tap.stop.prevent="skip(2)">
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
                <li @tap.stop.prevent="skip(3)">
                  <img src="../../statics/images/mission1.png"/>
                  <div class="message" v-if="list.task_message.unread_count">{{list.task_message.unread_count}}</div>
                  <p>
                    <span>问答通知</span>
                    <span class="mui-ellipsis">{{list.task_message.last_message ? list.task_message.last_message.data.title : ""}} </span>
                  </p>
                  <a>{{list.task_message.last_message ? list.task_message.last_message.created_at : ''}}</a>
                  <i class="bot"></i>
                </li>
                <li @tap.stop.prevent="skip(4)">
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
                <li   v-for="(item, index) in list.im_messages" @tap.stop.prevent="gochat(item)">
                  <img :src="item.avatar" class="radius"/>
                  <div class="message" v-if="item.unread_count != 0">{{item.unread_count}}</div>
                  <p>
                    <span class="mui-ellipsis">{{item.name}}</span>
                    <span class="mui-ellipsis">{{item.last_message ? item.last_message.text : ''}}</span>
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
    }),
    components: {
      RefreshList
    },
    methods: {
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
            this.list.money_count.unread_count = 0
            this.$router.pushPlus('/balancebar')
            break
          case 3:
            this.list.task_count.unread_count = 0
            this.$router.pushPlus('/taskbar')
            break
          case 4:
            this.list.readhub_count.unread_count = 0
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
    right: 16px;
    bottom: 0;
    left: 16px;
    height: 1px;
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

  /*导航栏的样式*/

  .mui-content {
    background: #FFFFFF;
  }

  .mui-wechat .menu {
    width: 100%;
    height: 45px;
    position: absolute;
    top: 0;
    z-index: 10;
    background: #f3f4f6;
  }

  .mui-wechat .content {
    margin-top: 45px;
  }

  .menu {
    width: 100%;
    height: 45px;
    position: absolute;
    top: 0;
    z-index: 99;
    background: #f3f4f6;
  }

  .menu span {
    display: inline-block;
    width: 49%;
    height: 100%;
    font-size: 14px;
    color: #444444;
    text-align: center;
    line-height: 45px;
    font-weight: 600;
    position: relative;
  }

  .menu span:nth-of-type(2) {
    color: #3c95f9;
  }

  .menu i {
    display: block;
    position: absolute;
    width: 30px;
    height: 1.8px;
    right: 42.65%;
    bottom: 0.5px;
    background: #3c95f9;
  }

  /*内容区域*/
  .content {
    margin-top: 45px;
  }

  .content ul li {
    width: 100%;
    height: 60px;
    padding: 0 16px;
    position: relative;
  }

  .content ul li img {
    width: 42px;
    height: 42px;
    margin-top: 10px;
    float: left;
  }


  .content ul li p {
    float: left;
    margin-top: 10px;
    margin-left: 12px;
  }

  .content ul li a {
    position: absolute;
    top: 10px;
    right: 16px;
    font-size: 12px;
    color: #c8c8c8;
  }

  .content ul li p span:nth-of-type(1) {
    display: block;
    font-size: 16px;
    color: #444444;
  }

  .content ul li p {
    width: 81%;
  }

  .content ul li p span:nth-of-type(2) {
    display: block;
    width: 100%;
    height: 18px;
    font-size: 13px;
    color: #808080;
  }

  .message {
    position: absolute;
    font-size: 11px;
    color: #ffffff;
    min-width: 18px;
    height: 18px;
    background: #f03c69;
    border-radius: 50%;
    text-align: center;
    line-height: 18px;
    left: 45px;
    top: 5px;
  }

  .menu_message {
    position: absolute;
    left: 79%;
    top: 8px;
    background: #f03c69;
    font-size: 11px;
    text-align: center;
    color: #fff;
    padding: 0px 3px;
    min-width: 15px;
    min-height: 15px;
    border-radius: 15px;
    line-height: 15px;
  }

  .radius {
    border-radius: 50%;
  }
  /*客服头像方形*/
  .content ul li:nth-of-type(5) img{
    border-radius: 10px;
  }

  .listWrapper{
    top:45px;
    bottom: 50px;
  }
</style>
