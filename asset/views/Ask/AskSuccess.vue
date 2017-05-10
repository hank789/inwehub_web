<template>
<div>
      <header class="mui-bar mui-bar-nav">
        <h1 class="mui-title">受理成功</h1>
      </header>

      <div class="mui-content loading" v-show="loading">
        <div class="loading">
          <img :src="loading_gif"/>
        </div>
      </div>

      <div class="mui-content" v-show="!loading">

        <div class="ask-success mui-table-view">
          <div class="mui-table-view-cell">
            <h4>亲爱的{{username}}：</h4>
            <div class="mui-row infos">
              <div class="mui-col-sm-2 mui-col-xs-2">
                <i class="mui-icon iconfont icon-success"></i>
              </div>
              <div class="mui-col-sm-10 mui-col-xs-10 info">
                恭喜您！<br/>
                您提交的问题我们已经成功受理啦！我们正在玩命帮您匹配寻找最合适作答的资深顾问和专家！</div>
            </div>

            <div class="kefu">
              <div class="person">
                <div class="avatar">
                  <div class="avatarInner">
                    <img src="images/uicon.jpg" class="avatar"/>
                  </div>
                </div>
                <div class="mui-media-body">
                  <span class="username">您的专属客服：小哈</span>
                  <div>
                    <span class="time">{{ ask.question.created_at }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>


        <div class="mui-table-view detail-ask-timeline mt15">
          <div class="mui-table-view-cell">
            <div class="timeline timeline-collapsing">
              <div class="timeline-block" v-for="(item, index) in timelines">
                <div class="timeline-icon"></div>
                <div class="timeline-content">
                  {{ item.title }}<br/>
                  <timeago class="timeago" :since="getTime(item.created_at)"></timeago>
                </div>
              </div>
              </div>
            </div>
          </div>
        </div>


        <div class="ask-success ask-success2 mui-table-view" v-show="!loading">
          <div class="mui-table-view-cell">
                        <div class="title">您还可以：</div>
            <div class="buttons">
              <button type="button" class="mui-btn mui-btn-primary" @tap.stop.prevent="$router.replace('/ask/' + id)">查看问题</button>
              <button type="button" class="mui-btn mui-btn-primary" @tap.stop.prevent="$router.replace('/ask')">再问一条</button>
            </div>
            <div class="mui-row buttons">
              <div class="mui-col-sm-6 mui-col-xs-6">
              </div>
              <div class="mui-col-sm-6 mui-col-xs-6">
              </div>
            </div>
          </div>
        </div>
</div>
</template>

<script>
  import {NOTICE} from '../../stores/types';
  import {createAPI, addAccessToken, postRequest} from '../../utils/request';
  import localEvent from '../../stores/localStorage';

  const currentUser = localEvent.getLocalItem('UserInfo');

  const AskSuccess = {
    data: () => ({
      username:currentUser.name,
      ask: {
        answers: [],
        question: {created_at:''},
        feedback: {
          rate_star:0
        },
        timeline:[]
      },
      id: 0,
      loading: true,
      loading_gif: loading_gif
    }),
    computed: {
      timelines() {
        return this.ask.timeline.reverse();
      }
    },
    methods: {
      getTime(time) {
        let newDate = new Date();
        newDate.setTime(Date.parse(time.replace(/-/g, "/")));
        return newDate;
      }
    },
    created () {
      let id = parseInt(this.$route.params.id);

      if (!id) {
        this.$store.dispatch(NOTICE, cb => {
          cb({
            text: '发生一些错误',
            time: 1500,
            status: false
          });
        });
        this.$router.back();
        return;
      }

      this.id = id;

      postRequest(`question/info`, {id: id}).then(response => {
        var code = response.data.code;
        if (code !== 1000) {
          mui.alert(response.data.message);
          this.$router.go(-1);
        }

        this.ask = response.data.data;
        this.loading = 0;
      });
    }
  }
  export default AskSuccess;
</script>


<style scoped>
  .timeline {
    box-sizing: border-box;
    background: #fff;
  }

  .timeline::before {
    box-sizing: border-box;
  }

  .timeline * {
    box-sizing: border-box;
  }

  .timeline *::before {
    box-sizing: border-box;
  }

  /* Main logic */
  .timeline {
    position: relative;
    font-size: 1em;
    width: 100%;
    height: 100%;
    margin: 0 auto;
    overflow-y: hidden;
  }

  .timeline .timeline-icon {
    position: absolute;
    width: 10px;
    height: 10px;
    left: 50%;
    margin-left: -16px;
    margin-top: 18px;
    border: 2px solid #999;
    border-radius: 100%;
    background-color: white;
    text-align: center;
  }

  .timeline .timeline-icon.timeline-icon-hide-border {
    border: 0;
  }

  .timeline .timeline-icon.timeline-icon-hide-border i.fa, .timeline .timeline-icon.timeline-icon-hide-border img {
    margin-left: 0;
    margin-top: 0;
  }

  .timeline .timeline-icon i.fa, .timeline .timeline-icon img {
    display: inline-block;
    width: 32px;
    height: 32px;
    margin-left: -4px;
    margin-top: -4px;
    vertical-align: bottom;
    line-height: 32px;
    text-align: center;
    font-size: 30px;
  }

  .timeline .timeline-icon img {
    border-radius: 100%;
  }

  .timeline .timeline-content {
    position: relative;
    width: 45%;
    padding: 12px 0 12px 12px;
    color:#999;
    line-height: 20px;
    min-height: 64px;
  }

  .timeline .timeline-date {
    position: absolute;
    width: auto;
    top: 0;
    left: 118%;
    font-size: 80%;
  }

  .detail-ask-timeline{
    padding-bottom:10px;
  }

  .timeline::before {
    position: absolute;
    width: 2px;
    height: 100%;
    top: 26px;
    left: 50%;
    margin-left: -1px;
    /* Half of width */
    background-color: #CFCFC4;
    content: "";
  }

  .timeline.timeline-collapsing::before {
    left: auto;
    margin-left: 30px;
  }

  .timeline.timeline-collapsing .timeline-block {
    margin-left: 42px;
    margin-right: 10px;
  }

  .timeline.timeline-collapsing .timeline-icon {
    left: auto;
    margin-left: -16px;
  }

  .timeline.timeline-collapsing .timeline-content {
    width: auto;
  }

  .timeline.timeline-collapsing .timeline-date {
    width: auto;
    left: 0;
    margin-left: -130px;
    text-align: right;
  }

  .ask-success {
    margin-top: 15px;
    padding:10px 0;
  }

  .ask-success .mui-icon {
    float: left;
    font-size: 30px;
    color: #007aff;
    margin-top:15px;
    margin-right: 20px;
  }

  .timeline .timeline-block:first-child .timeline-icon{
    border-color:#FF6961;
  }

  .timeline .timeline-block:first-child .timeline-content{
    color:#3f3f3f;
  }

  .ask-success .title{
    margin:0 0 10px 0;
  }

  .buttons{
    text-align: center;
  }
  .buttons button{
    margin:0 10px;
    padding:6px 20px;
  }

  .infos{
    margin-top:10px;
  }
  .infos .mui-icon{
    font-size:60px;
  }

  .infos .info{
    padding-left:10px;
    line-height:23px;
  }

  h4{
    font-weight:normal;
  }

  .person .avatar{
    z-index: 0;
    color: #ffffff;
    float:left;
    background-color: #bdbdbd;
    display: inline-block;
    height: 40px;
    width: 40px;
    font-size: 20px;
    color: #ffffff;
    background-color: #bdbdbd;
    text-align: center;
    border-radius: 50%;
  }


  .person .avatar .avatarInner{
    display: -webkit-box;
    display: -webkit-flex;
    display: -ms-flexbox;
    display: flex;
    width: 100%;
    height: 100%;
    -webkit-box-align: center;
    -webkit-align-items: center;
    -ms-flex-align: center;
    align-items: center;
    -webkit-box-pack: center;
    -webkit-justify-content: center;
    -ms-flex-pack: center;
    justify-content: center;
  }

  .person .avatar img {
    border-radius: 50%;
    width: 100%;
    height: 100%;
    display: block;
  }

  .timeago{
    display: inline-block;
    color:#007aff;
    margin-top:10px;
  }

  .kefu{
    float: right;
    margin-top:20px;
    font-size:14px;
  }
  .kefu .mui-media-body{
    padding-left:10px;
  }

  .ask-success2{
    margin-bottom: 20px;
  }

  .detail-ask-timeline .mui-table-view-cell{
    padding-right:0;
    padding-left:0;
  }
</style>
