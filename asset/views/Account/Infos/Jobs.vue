<template>
  <div>

    <header class="mui-bar mui-bar-nav">
      <Back></Back>
      <h1 class="mui-title">工作经历</h1>
    </header>

    <div class="mui-content absolute">
      <div v-show="!loading" id="container">

        <div class="container" v-show="jobs.length === 0">
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-zanwushuju"></use>
          </svg>
          <p>暂时还没有数据呀～</p>
        </div>

        <ul class="mui-table-view mui-table-view-chevron" id="OA_task_1">
          <li v-for="(job,index) in jobs" class="intro  mui-table-view-cell">

            <div class="mui-slider-right mui-disabled" id="roof" @tap.stop.prevent="deleteItem(job.id, index)">
              <a class="mui-btn mui-btn-red " style="background: #fa4975">删除</a>
            </div>
            <div class="mui-slider-handle  slider">
              <p class="mui-ellipsis"> {{ job.company }}</p>
              <p>

                <span class="mui-ellipsis">{{ job.begin_time }} 至 {{ job.end_time }}</span>
                <span class="mui-ellipsis">{{ job.title }}</span>
              </p>
            </div>
            <svg class="icon" aria-hidden="true" @tap.stop.prevent="$router.pushPlus('/my/info/job/' + job.id)">
              <use xlink:href="#icon-xiugai"></use>
            </svg>
          </li>
        </ul>

        <div class="add box-shadow-3" @tap.stop.prevent="$router.pushPlus('/my/info/job/0')">
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-shuru"></use>
          </svg>
        </div>
      </div>
    </div>

    <div id="statusBarStyle" background="#ffffff" mode="light"></div>
  </div>
</template>

<script>
  import { postRequest } from '../../../utils/request'
  import localEvent from '../../../stores/localStorage'
  import ACCOUNT_API from '../../../api/account'

  export default {
    data: () => ({
      jobs: [],
      loading: true
    }),
    methods: {
      refreshPageData () {
        this.initData()
      },
      initData () {
        postRequest(`account/job/list`, {}).then(response => {
          var code = response.data.code
          if (code !== 1000) {
            window.mui.alert(response.data.message)
            return
          }

          this.jobs = response.data.data

          var newJobs = []
          for (var i in this.jobs) {
            var info = this.jobs[i]
            var id = info.id
            newJobs[id] = info
          }
          localEvent.setLocalItem('jobs', newJobs)

          this.loading = false
        })
      },
      deleteItem (id, index) {
        var btnArray = ['否', '是']
        window.mui.confirm('确认要删除？', '删除', btnArray, e => {
          if (e.index === 1) {
            var url = ACCOUNT_API.DELETE_ACCOUNT_JOB
            postRequest(url, {
              id: id
            }).then(response => {
              window.mui.toast('删除成功')
              this.jobs.splice(index, 1)
            })
          }
        }, 'div')
      }
    },
    mounted () {},

    computed: {},
    created () {
      this.initData()
    }
  }
</script>

<style scoped>
  .mui-content {
    background: #FFFFFF;
  }

  #container {
    width: 100%;
    height: 100%;
    background: #FFFFFF;
  }

  .intro {
    width: 100%;
    height: 1.6rem;
    position: relative;
  }

  .intro .slider {
    width: 100%;
    height: 1.6rem;
  }

  .intro .slider p:nth-of-type(1) {
    font-family: "PingFangSC";
    font-size: 0.373rem;
    color: #444444;
    width: 100%;
  }

  .intro .slider p:nth-of-type(2) {
    width: 100%;
    height: 0.346rem;
    line-height: 0.346rem;
    margin-top: 0.133rem;
  }

  .intro .slider p:nth-of-type(2) span {
    display: block;
    float: left;
    max-width: 3.6rem;
    height: 0.346rem;
    font-size: 0.346rem;
    color: #808080;
  }

  .intro .slider p:nth-of-type(2) span:nth-of-type(1) {
    border-right: 0.026rem solid rgb(220, 220, 220);
    padding-right: 0.133rem;
    margin-right: 0.133rem;
  }

  /*.intro .slider p:nth-of-type(2) i {
        display: inline-block;
        width: 0.026rem;
        height: 0.293rem;
        margin: 0 0.08rem -0.026rem 0.08rem;
        background: rgb(220, 220, 220);
    }*/

  .intro svg {
    position: absolute;
    font-size: 0.48rem;
    color: rgb(3, 174, 249);
    top: 0.346rem;
    right: 0.4rem;
  }

  .add {
    width: 1.706rem;
    height: 1.706rem;
    border-radius: 50%;
    background: rgb(3, 174, 249);
    position: absolute;
    left: 41%;
    bottom: 0.56rem;
    text-align: center;
    line-height: 1.706rem;
  }

  .add svg {
    font-size: 0.586rem;
    color: #FFFFFF;
  }

  #roof {
    z-index: 999;
  }

  .mui-table-view:after {
    position: absolute;
    right: 0.4rem;
    bottom: 0;
    left: 0.4rem;
    height: 0.026rem;
    content: '';
    background: #f2f2f2;
  }

  .mui-table-view-cell:after {
    position: absolute;
    right: 0.4rem;
    bottom: 0;
    left: 0.4rem;
    height: 0.026rem;
    content: '';
    background: #f2f2f2;
  }

  .box-shadow-3 {
    -webkit-box-shadow: 0 0 0.133rem rgba(3, 174, 249, .8);
    -moz-box-shadow: 0 0 0.133rem rgba(3, 174, 249, .8);
    box-shadow: 0 0 0.133rem rgba(3, 174, 249, .8);
  }

  .container {
    position: absolute;
    top: 40%;
    left: 36%;
  }

  .container svg {
    font-size: 1.6rem;
    margin-left: 0.613rem;
    margin-bottom: 0.213rem;
  }

  .container p {
    font-family: "PingFangSC";
    font-size: 0.32rem;
    color: #c8c8c8;
  }
</style>
