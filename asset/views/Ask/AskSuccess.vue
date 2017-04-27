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
        <div class="mui-table-view detail-ask-timeline">
          <div class="mui-table-view-cell">
            <div class="timeline timeline-collapsing">
              <div class="timeline-block" v-for="(item, index) in timelines">
                <div class="timeline-icon"></div>
                <div class="timeline-content">
                  {{ item.title }}<br/>
                  <timeago :since="getTime(item.created_at)"></timeago>
                </div>
              </div>
              </div>
            </div>
          </div>
        </div>


        <div class="ask-success mui-table-view" v-show="!loading">
          <div class="mui-table-view-cell">
            <i class="mui-icon iconfont icon-success"></i>您的提问平台已经受理，我们将会尽快为您找寻合适的专家！
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
  import {createAPI, addAccessToken} from '../../utils/request';
  const AskSuccess = {
    data: () => ({
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

      addAccessToken().post(createAPI(`question/info`), {id: id},
        {
          validateStatus: status => status === 200
        }
      )
        .then(response => {

          var code = response.data.code;
          if (code !== 1000) {
            mui.alert(response.data.message);
            this.$router.go(-1);
          }

          this.ask = response.data.data;
          this.loading = 0;
        })
        .catch(({response: {message = '网络状况堪忧'} = {}}) => {
          this.$store.dispatch(NOTICE, cb => {
            cb({
              text: data.message,
              time: 2000,
              status: false
            });
          });
        })
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

  .timeline .timeline-block {
    margin: 40px 0;
  }

  .timeline .timeline-icon {
    position: absolute;
    width: 10px;
    height: 10px;
    left: 50%;
    margin-left: -16px;
    margin-top: 25px;
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
    padding: 12px;
    color:#999;
    background-color: #EEE;
    border: 1px solid #e5e5e5;
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

  .timeline::before {
    position: absolute;
    width: 2px;
    height: 100%;
    top: 0;
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
    margin-left: 72px;
    margin-right: 10px;
  }

  .timeline.timeline-collapsing .timeline-icon {
    left: auto;
    margin-left: -46px;
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
    padding:10px;
  }

  .ask-success .mui-icon {
    float: left;
    font-size: 30px;
    color: #007aff;
    margin-right: 20px;
  }

  .timeline .timeline-block:first-child .timeline-icon{
    border-color:#FF6961;
  }

  .timeline .timeline-block:first-child .timeline-content{
    color:#3f3f3f;
  }

  .ask-success .title{
    margin:10px 0;
  }

  .buttons{
    text-align: center;
  }
  .buttons button{
    margin:0 10px;
    padding:6px 20px;
  }
</style>
