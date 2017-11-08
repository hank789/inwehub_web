<template>
  <div>

    <header class="mui-bar mui-bar-nav">
      <a class="mui-action-back mui-icon mui-icon-left-nav mui-pull-left"></a>
      <h1 class="mui-title">培训经历</h1>

    </header>

    <div class="mui-content absolute" v-show="!loading">
      <div class="container" v-show="trains.length === 0">
        <svg class="icon" aria-hidden="true">
          <use xlink:href="#icon-zanwushuju"></use>
        </svg>
        <p>暂时还没有数据呀～</p>
      </div>

      <ul class="mui-table-view mui-table-view-chevron" id="OA_task_1">
        <li v-for="(train, index) in trains" class="intro  mui-table-view-cell">

          <div class="mui-slider-right mui-disabled" id="roof" @tap.stop.prevent="deleteItem(train.id, index)">
            <a class="mui-btn mui-btn-red " style="background: #fa4975">删除</a>
          </div>
          <div class="mui-slider-handle  slider">
            <p class="mui-ellipsis"> {{ train.certificate }}</p>
            <p>

              <span class="mui-ellipsis">{{ train.get_time }} | {{ train.agency }}</span>

            </p>
          </div>
          <svg class="icon" aria-hidden="true" @tap.stop.prevent="$router.pushPlus('/my/info/train/'+train.id)">
            <use xlink:href="#icon-xiugai"></use>
          </svg>
        </li>
      </ul>

      <div class="add box-shadow-3" @tap.stop.prevent="$router.pushPlus('/my/info/train/0')">
        <svg class="icon" aria-hidden="true">
          <use xlink:href="#icon-shuru"></use>
        </svg>
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
      trains: [],
      loading: true
    }),
    methods: {
      refreshPageData () {
        this.initData()
      },
      initData () {
        postRequest(`account/train/list`, {}).then(response => {
          var code = response.data.code
          if (code !== 1000) {
            window.mui.alert(response.data.message)
            return
          }

          this.trains = response.data.data
          this.loading = false

          var newTrains = []
          for (var i in this.trains) {
            var info = this.trains[i]
            var id = info.id
            newTrains[id] = info
          }
          localEvent.setLocalItem('trains', newTrains)
        })
      },
      deleteItem (id, index) {
        var btnArray = ['否', '是']
        window.mui.confirm('确认要删除？', '删除', btnArray, e => {
          if (e.index === 1) {
            var url = ACCOUNT_API.DELETE_ACCOUNT_TRAIN
            postRequest(url, {
              id: id
            }).then(response => {
              window.mui.toast('删除成功')
              this.trains.splice(index, 1)
            })
          }
        }, 'div')
      }
    },
    mounted () {
    },

    computed: {},

    created () {
      this.initData()
    }
  }
</script>

<style scoped>
  #container {
    width: 100%;
    height: 100%;
    background: #FFFFFF;
  }

  .mui-content {
    background: #FFFFFF;
  }

  .intro {
    width: 100%;
    height: 60px;
    position: relative;
  }

  .intro .slider {
    width: 100%;
    height: 60px;
  }

  .intro .slider p:nth-of-type(1) {
    width: 100%;
    font-size: 14px;
    color: #444444;
  }

  .intro .slider p:nth-of-type(2) span {
    display: block;
    width: 100%;
    font-size: 13px;
    color: #808080;

  }

  .intro svg {
    position: absolute;
    font-size: 18px;
    color: rgb(3, 174, 249);
    top: 13px;
    right: 15px;
  }

  .add {
    width: 64px;
    height: 64px;
    border-radius: 50%;
    background: rgb(3, 174, 249);
    position: absolute;
    left: 41%;
    bottom: 21px;
    text-align: center;
    line-height: 64px;
  }

  .add svg {
    font-size: 22px;
    color: #FFFFFF;
  }

  #roof {
    z-index: 999;
  }

  .mui-table-view:after {
    position: absolute;
    right: 15px;
    bottom: 0;
    left: 15px;
    height: 1px;
    content: '';
    background: #f2f2f2;
  }

  .mui-table-view-cell:after {
    position: absolute;
    right: 15px;
    bottom: 0;
    left: 15px;
    height: 1px;
    content: '';
    background: #f2f2f2;
  }

  .box-shadow-3 {
    -webkit-box-shadow: 0 0 5px rgba(3, 174, 249, .8);
    -moz-box-shadow: 0 0 5px rgba(3, 174, 249, .8);
    box-shadow: 0 0 5px rgba(3, 174, 249, .8);
  }

  .container {
    position: absolute;
    top: 40%;
    left: 36%;
  }

  .container svg {
    font-size: 60px;
    margin-left: 23px;
    margin-bottom: 8px;
  }

  .container p {

    font-size: 12px;
    color: #c8c8c8;
  }
</style>
