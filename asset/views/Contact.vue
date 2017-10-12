<template>
  <div>

    <header class="mui-bar mui-bar-nav">
      <a class="mui-action-back mui-icon mui-icon-left-nav mui-pull-left"></a>
      <h1 class="mui-title">邀请回答</h1>
    </header>

    <div class="mui-content absolute">
      <Contact
        @click="choose"
        :list="list"
        :search="search">
        <div slot="header" class="indexHeader">
          <div class="searchWrapper">
            <input type="text"
                   placeholder="输入用户名" v-model.trim="search">
          </div>

          <div class="notFound">
            找不到成员？<span @tap.stop.prevent="toFollowMore()">微信直接邀请</span>
          </div>

        </div>

        <div class="indexTitle">
          已关注的成员

        </div>
      </Contact>
    </div>
  </div>
</template>

<script>

  import Contact from './../components/contact/Index.vue'
  import { apiRequest, postRequest } from '../utils/request';


  export default {
    data(){
      return {
        search: '',
        list: []
      }
    },
    components: {
      Contact
    },
    computed: {},
    methods: {
      choose(item){
         mui.alert('开发中...');
      },
      toFollowMore(){
          this.$router.push('/askCommunity/majors');
      },
      getList() {
        postRequest(`followed/users`, {}).then(response => {
          var code = response.data.code;
          if(code !== 1000) {
            mui.alert(response.data.message);
            mui.back();
            return;
          }

          if(response.data.data.length > 0) {
            this.list = response.data.data;
          }
          this.loading = 0;
        });
      },
    },
    mounted(){

    },

    created(){
      this.getList();
    }
  };
</script>

<style lang="less" rel="stylesheet/less" scoped>
  .indexHeader {
    background-color: #f3f4f6;
    padding: 10px 15px;

    .searchWrapper {

      input {
        height: 34px;
        font-size: 14px;
        border-radius: 50px;
        background: #fff;
        border: 1px solid #dcdcdc;
        margin-bottom: 5px;

        &::placeholder {
          color: #c8c8c8;
        }
      }
    }

    .notFound {
      font-size: 13px;
      color: #808080;

      span {
        color: #03aef9;
      }
    }
  }

  .indexTitle {
    background: #ececee;
    font-size: 13px;
    height: 25px;
    line-height: 25px;
    padding: 0 15px;
    color: #808080;
  }

  .mui-content {
    background: #fff;
  }
</style>
