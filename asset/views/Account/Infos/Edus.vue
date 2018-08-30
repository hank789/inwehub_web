<template>
  <div>

    <header class="mui-bar mui-bar-nav">
      <a class="mui-action-back mui-icon mui-icon-left-nav mui-pull-left"></a>
      <h1 class="mui-title">教育经历</h1>

    </header>

    <div class="mui-content absolute">
      <div v-show="!loading" id="container">

        <div class="container" v-show="edus.length === 0">
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-zanwushuju"></use>
          </svg>
          <p>暂时还没有数据呀～</p>
        </div>

        <ul class="mui-table-view mui-table-view-chevron" id="OA_task_1">
          <li v-for="(edu, index) in edus" class="intro  mui-table-view-cell">

            <div class="mui-slider-right mui-disabled" id="roof" @tap.stop.prevent="deleteItem(edu.id, index)">
              <a class="mui-btn mui-btn-red " style="background: #fa4975">删除</a>
            </div>
            <div class="mui-slider-handle  slider">
              <p class="mui-ellipsis"> {{ edu.school }}</p>
              <p>

                <span class="mui-ellipsis">{{ edu.begin_time }}  至 {{ edu.end_time }}</span>

                <span class="mui-ellipsis">{{ edu.major }}</span>

                <span class="mui-ellipsis">{{ edu.degree}}</span>
              </p>
            </div>
            <svg class="icon" aria-hidden="true" @tap.stop.prevent="$router.pushPlus('/my/info/edu/'+edu.id)">
              <use xlink:href="#icon-xiugai"></use>
            </svg>
          </li>
        </ul>

        <div class="add box-shadow-3" @tap.stop.prevent="$router.pushPlus('/my/info/edu/0')">
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
      edus: [],
      loading: true
    }),
    methods: {
      refreshPageData () {
        this.initData()
      },
      initData () {
        postRequest(`account/edu/list`, {}).then(response => {
          var code = response.data.code
          if (code !== 1000) {
            window.mui.alert(response.data.message)
            return
          }

          this.edus = response.data.data
          this.loading = false

          var newEdus = []
          for (var i in this.edus) {
            var info = this.edus[i]
            var id = info.id
            newEdus[id] = info
          }
          localEvent.setLocalItem('edus', newEdus)
        })
      },
      deleteItem (id, index) {
        var btnArray = ['否', '是']
        window.mui.confirm('确认要删除？', '删除', btnArray, e => {
          if (e.index === 1) {
            var url = ACCOUNT_API.DELETE_ACCOUNT_EDU
            postRequest(url, {
              id: id
            }).then(response => {
              window.mui.toast('删除成功')
              this.edus.splice(index, 1)
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
    width: 100%;
    font-size: 0.373rem;
    color: #444444;
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
    font-size: 0.346rem;
    color: #808080;
    height: 0.346rem;
    font-size: 0.346rem;
    color: #808080;
  }

  .intro .slider p:nth-of-type(2) span:nth-of-type(1) {
    max-width: 3.413rem;
  }

  .intro .slider p:nth-of-type(2) span:nth-of-type(2) {
    max-width: 3.413rem;
    border-right: 0.026rem solid rgb(220, 220, 220);
    border-left: 0.026rem solid rgb(220, 220, 220);
    margin-right: 0.133rem;
    margin-left: 0.133rem;
    padding-right: 0.133rem;
    padding-left: 0.133rem;
  }

  .intro .slider p:nth-of-type(2) span:nth-of-type(3) {
    max-width: 0.746rem;
  }

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

    font-size: 0.32rem;
    color: #c8c8c8;
  }
</style>
