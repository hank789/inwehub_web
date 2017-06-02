<template>

  <div>

    <header class="mui-bar mui-bar-nav">
      <a class="mui-action-back mui-icon mui-icon-left-nav mui-pull-left"></a>
      <h1 class="mui-title">我的收藏</h1>
    </header>

    <div class="mui-content">
      <div class="menu">
        <div class="mui-segmented-control mui-segmented-control-inverted mui-segmented-control-primary">
          <a class="mui-control-item mui-active" @tap.stop.prevent="" href="#item1">
            专家
        </a>
          <div class="mui-control-item" @tap.stop.prevent="" href="#item2">
            问答
        </div>

        </div>
      </div>
      <div class="detailList">

        <div id="item1" class=" task-list">
          <div class="">
            <ul class="mui-table-view mui-table-view-chevron">
              <li class="mui-table-view-cell" v-for="(item, index) in list">
                <div class="person">
                  <div class="avatar">
                    <div class="avatarInner">
                      <img :src="item.user_avatar_url" class="avatar"/>
                    </div>
                  </div>
                  <div class="mui-media-body">
                    <span class="username">{{ item.user_name }}</span>
                    <div class="site-desc mui-ellipsis-3">
                      {{ item.description }}

                    </div>
                  </div>
                  <span class="mui-icon myicon myicon-ask" @tap.stop.prevent="$router.push('/ask?id=' + item.user_id)"></span>
                </div>

              </li>


            </ul>
          </div>
        </div>



      </div>


    </div>

  </div>
</template>
<script>
  import localEvent from '../../stores/localStorage';
  import {NOTICE, TASK_LIST_APPEND, ANSWERS_LIST_APPEND, ASKS_LIST_APPEND} from '../../stores/types';
  import router from '../../routers/index';
  import {apiRequest, postRequest} from '../../utils/request';

  export  default {
    data(){
      return {
         list:[],
         loading:1
      }
    },
    methods: {

    },
    computed: {
      bottomId () {
        var length = this.list.length;
        if (length) {
          return this.list[length - 1].id;
        }
        return 0;
      }
    },
    created(){
      postRequest(`followed/users`, {bottom_id: this.bottomId}).then(response => {
        var code = response.data.code;
        if (code !== 1000) {
          mui.alert(response.data.message);
          this.$router.go(-1);
        }

        if (response.data.data.length > 0) {
          this.list = this.list.concat(response.data.data);
        }
        this.loading = 0;
      });
    }
  }

</script>

<style scoped>

  .menu{
    position: relative;
  }
  .menu:after{
    position: absolute;
    right: 0;
    bottom: 0;
    left: 0;
    height: 1px;
    content: '';
    -webkit-transform: scaleY(.5);
    transform: scaleY(.5);
    background-color: #D9D9D9;
  }
  .mui-segmented-control .mui-control-item{
    line-height: 50px;
    font-size:16px;
  }
  .mui-segmented-control.mui-segmented-control-inverted .mui-control-item.mui-active{
    position: relative;
    border:none;
  }
  .mui-segmented-control.mui-segmented-control-inverted .mui-control-item.mui-active:after{
    position: absolute;
    width:50px;
    right: 10px;
    bottom: 0;
    left: 50%;
    margin-left:-25px;
    height: 5px;
    content: '';
    -webkit-transform: scaleY(.5);
    transform: scaleY(.5);
    background-color: #009FE8;
  }

  .detailList{

  }


  .mui-table-view{
    background: none;
  }

  .task-list{
    line-height: 33px;
  }
  .task-list .mui-table-view-chevron .mui-table-view-cell{
    padding-right:5px;
  }
  .task-list .time{
    display: inline-block;
    width:130px;
    color:#101010;
  }
  .mui-badge{
    padding:5px 10px;
    position: relative;
    bottom: 3px;
  }
  .task-list .link a{
    color: #8f8f94;
    font-size: 14px;
  }
  .task-list .type{
    font-weight:bold;
  }

  .mui-media-body{
    padding-left:10px;
  }
  .task-list .username{
    color:#555555;
  }


  .mui-media-body{
    position:relative;
  }

  .mui-navigate-right:after{
    font-size:24px;
    font-weight:bolder;
  }

  .avatar{
    z-index: 0;
    margin-top: 5px;
    color: #ffffff;
    float:left;
    display: inline-block;
    height: 55px;
    width: 55px;
    font-size: 20px;
    text-align: center;
    border-radius: 50%;
  }

  .avatar .avatarInner{
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

  .avatar img {
    border-radius: 50%;
    width: 100%;
    height: 100%;
    display: block;
  }
  .site-desc{
    color:#666;
    font-size:12px;
    line-height: 18px;
    padding-right:50px;
  }

  .mui-table-view:after{
    display: none;
  }

  .myicon-ask{
    width:30px;
    height:30px;
    position: absolute;
    right:10px;
    top:50%;
    margin-top:-15px;
  }

  .person{
    position: relative;
  }
</style>
