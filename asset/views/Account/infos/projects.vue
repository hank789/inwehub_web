<template>
  <div>

    <header class="mui-bar mui-bar-nav">
      <a class="mui-action-back mui-icon mui-icon-left-nav mui-pull-left"></a>
      <h1 class="mui-title">项目经历</h1>
    </header>

    <div class="mui-content absolute">
      <div v-show="!loading" id="container">

        <div class="container" v-show="projects.length === 0">
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-zanwushuju"></use>
          </svg>
          <p>暂时还没有数据呀～</p>
        </div>

        <ul class="mui-table-view mui-table-view-chevron" id="OA_task_1">
          <li v-for="(project, index) in projects" class="intro  mui-table-view-cell">

            <div class="mui-slider-right mui-disabled" id="roof" @tap.stop.prevent="deleteItem(project.id, index)">
              <a class="mui-btn mui-btn-red " style="background: #fa4975">删除</a>
            </div>
            <div class="mui-slider-handle  slider">
              <p class="mui-ellipsis"> {{ project.project_name }}</p>
              <p>

                <span class="mui-ellipsis">{{ project.begin_time }} 至 {{ project.end_time }}</span>
                <span class="mui-ellipsis">{{ project.title }}</span>
              </p>
            </div>
            <svg class="icon" aria-hidden="true" @tap.stop.prevent="$router.pushPlus('/my/info/project/'+project.id)">
              <use xlink:href="#icon-xiugai"></use>
            </svg>
          </li>
        </ul>

        <div class="add box-shadow-3" @tap.stop.prevent="$router.pushPlus('/my/info/project/0')">
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-shuru"></use>
          </svg>
        </div>

      </div>
    </div>
    <div id="statusBarStyle" background="#fefefe" mode="light"></div>

  </div>
</template>

<script>
  import { postRequest } from '../../../utils/request'
  import localEvent from '../../../stores/localStorage'
  import ACCOUNT_API from '../../../api/account'

  export default {
    data: () => ({
      projects: [],
      loading: true
    }),
    methods: {
      refreshPageData () {
        this.initData()
      },
      initData () {
        postRequest(`account/project/list`, {}).then(response => {
          var code = response.data.code
          if (code !== 1000) {
            window.mui.alert(response.data.message)
            return
          }

          this.projects = response.data.data
          this.loading = false

          var newProjects = []
          for (var i in this.projects) {
            var info = this.projects[i]
            var id = info.id
            newProjects[id] = info
          }
          localEvent.setLocalItem('projects', newProjects)
        })
      },
      deleteItem (id, index) {
        var btnArray = ['否', '是']
        window.mui.confirm('确认要删除？', '删除', btnArray, e => {
          if (e.index === 1) {
            var url = ACCOUNT_API.DELETE_ACCOUNT_PROJECT
            postRequest(url, {
              id: id
            }).then(response => {
              window.mui.toast('删除成功')
              this.projects.splice(index, 1)
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
    height: 6rem;
    position: relative;
  }

  .intro .slider {
    width: 100%;
    height: 6rem;
  }

  .intro .slider p:nth-of-type(1) {
    width: 100%;
    font-size: 1.4rem;
    color: #444444;
  }

  .intro .slider p:nth-of-type(2) {
    width: 100%;
    height: 1.3rem;
    line-height: 1.3rem;
    margin-top: 0.5rem;
  }

  .intro .slider p:nth-of-type(2) span {
    display: block;
    float: left;
    max-width: 13.5rem;
    height: 1.3rem;
    font-size: 1.3rem;
    color: #808080;
  }

  .intro .slider p:nth-of-type(2) span:nth-of-type(1) {
    border-right: 0.1rem solid rgb(220, 220, 220);
    padding-right: 0.5rem;
    margin-right: 0.5rem;
  }

  /*.intro .slider p:nth-of-type(2) i {
        display: inline-block;
        width: 0.1rem;
        height: 1.1rem;
        margin: 0 0.3rem -0.1rem 0.3rem;
        background: rgb(220, 220, 220);
    }*/

  .intro svg {
    position: absolute;
    font-size: 1.8rem;
    color: rgb(3, 174, 249);
    top: 1.3rem;
    right: 1.5rem;
  }

  .add {
    width: 6.4rem;
    height: 6.4rem;
    border-radius: 50%;
    background: rgb(3, 174, 249);
    position: absolute;
    left: 41%;
    bottom: 2.1rem;
    text-align: center;
    line-height: 6.4rem;
  }

  .add svg {
    font-size: 2.2rem;
    color: #FFFFFF;
  }

  #roof {
    z-index: 999;
  }

  .mui-table-view:after {
    position: absolute;
    right: 1.5rem;
    bottom: 0;
    left: 1.5rem;
    height: 0.1rem;
    content: '';
    background: #f2f2f2;
  }

  .mui-table-view-cell:after {
    position: absolute;
    right: 1.5rem;
    bottom: 0;
    left: 1.5rem;
    height: 0.1rem;
    content: '';
    background: #f2f2f2;
  }

  .box-shadow-3 {
    -webkit-box-shadow: 0 0 0.5rem rgba(3, 174, 249, .8);
    -moz-box-shadow: 0 0 0.5rem rgba(3, 174, 249, .8);
    box-shadow: 0 0 0.5rem rgba(3, 174, 249, .8);
  }

  .container {
    position: absolute;
    top: 40%;
    left: 36%;
  }

  .container svg {
    font-size: 6rem;
    margin-left: 2.3rem;
    margin-bottom: 0.8rem;
  }

  .container p {

    font-size: 1.2rem;
    color: #c8c8c8;
  }
</style>
