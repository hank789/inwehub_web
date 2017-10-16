<template>
  <div>

    <header class="mui-bar mui-bar-nav">
      <a class="mui-action-back mui-icon mui-icon-left-nav mui-pull-left"></a>
      <h1 class="mui-title">邀请回答</h1>
    </header>

    <div class="mui-content">
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

      <Share
        ref="ShareBtn"
        :hideShareBtn="true"
        :title="'邀您回答|' + title"
        :link="shareUrl"
        :content="'诚挚的邀请您前往参与回答和互动，已有' + answernum + '个回答、' + followednum + '个关注'"
        :imageUrl="shareImg"
        :thumbUrl="shareImg"
        @success="shareSuccess"
        @fail="shareFail"
      ></Share>
    </div>
  </div>
</template>

<script>

  import Contact from './../components/contact/Index.vue'
  import { apiRequest, postRequest } from '../utils/request';
  import Share from '../components/Share.vue';


  export default {
    data(){
      return {
        id:0,
        search: '',
        username:'',
        shareUrl:'',
        shareImg:'',
        answernum:0,
        followednum:0,
        title:'',
        list: []
      }
    },
    components: {
      Contact,
      Share
    },
    computed: {},
    methods: {
      shareSuccess(){

      },
      shareFail(){

      },
      choose(item){
        postRequest(`question/inviteAnswer`, {
          question_id:this.id,
          user_id:item.id
        }).then(response => {
          var code = response.data.code;
          if(code !== 1000) {
            mui.alert(response.data.message);
            mui.back();
            return;
          }
        });
      },
      toFollowMore(){
          this.$refs.ShareBtn.share();
      },
      getList(id) {
        postRequest(`question/inviterList`, {
          question_id:id
        }).then(response => {
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
      this.id = parseInt(this.$route.query.id);
      this.username = this.$route.query.username;
      this.title = this.$route.query.title;
      this.answernum = this.$route.query.answernum;
      this.followednum = this.$route.query.followednum;

      var currentUrl = '/askCommunity/interaction/answers/' + this.id;
      this.shareUrl = process.env.API_ROOT + 'wechat/oauth?redirect=' + currentUrl;
      this.shareImg = 'https://cdn.inwehub.com/system/whiteLogo@2x.png';

      this.getList(this.id);
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
