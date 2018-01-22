<template>
  <div>
    <header class="mui-bar mui-bar-nav">
      <a class="mui-action-back mui-icon mui-icon-left-nav mui-pull-left"></a>
      <h1 class="mui-title">待您回答</h1>
    </header>
    <div class="mui-content absolute">
        <div class="title" v-if="this.tag.length">
          <p>根据您的擅长推荐以下问答</p>
          <p @tap.stop.prevent="change()">换一批</p>
        </div>
        <div class="title" v-else>
          <p>完善擅长标签即为您定向推荐问答</p>
          <p @tap.stop.prevent="$router.pushPlus('/my/advantage')">我的擅长</p>
        </div>
        <ul  v-if="list.length">
          <li v-for="(item,index) in list" @tap.stop.prevent="skip(item.question_type,item.id)">
            <p>{{index+1}}.</p>
            <p class="mui-ellipsis-3"><span v-for="tag in item.tags">#{{tag.name}}#</span>{{item.title}}</p>
            <p>{{item.answer_number}}人回答  |  {{item.follow_number}}关注</p>
            <i class="bot"></i>
          </li>
        </ul>
      <Empty v-else></Empty>
    </div>
  </div>
</template>
<script>
  import { postRequest } from '../utils/request'
  import Empty from '../components/Empty.vue'

  export default {
    data: () => ({
      list: [],
      tag: [],
      page: 1,
      loading: 1
    }),
    created () {
    },
    computed: {
    },
    components: {
      Empty
    },
    methods: {
      skip (type, id) {
        switch (type) {
          case 1:
            this.$router.pushPlus('/askCommunity/major/' + id)
            break
          case 2:
            this.$router.pushPlus('/askCommunity/interaction/answers/' + id)
            break
        }
      },
      getdata () {
        postRequest('question/recommendUser', {
          page: this.page
        }).then(response => {
          var code = response.data.code
          if (code !== 1000) {
            window.mui.alert(response.data.message)
            window.mui.back()
            return
          }
          this.tag = response.data.data.user_skill_tags
          this.list = response.data.data.data
          this.loading = 0
        })
      },
      change () {
        this.page += 1
        this.getdata()
      }
    },
    mounted () {
      this.getdata()
    },
    updated () {
    }
  }

</script>

<style scoped>
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

  .bot {
    position: absolute;
    right: 0;
    bottom: 0;
    left: 0;
    height: 1px;
    -webkit-transform: scaleY(.5);
    transform: scaleY(.5);
    background-color: rgb(220, 220, 220);
  }
  .mui-content{
    background: #FFFFFF;
  }
  .title{
    width:100%;
    height:39px;
    padding-left:4% ;
    background: #f3f4f6;
  }
  .title p{
    float: left;
    line-height: 39px;
  }
  .title p:nth-of-type(2){
    float: right;
    color: #FFFFFF;
    padding: 0px 19px 0px 21px;
    background: #03aef9;
  }


  ul{
    width:100%;
    overflow: hidden;
  }
  ul li{
    width:87%;
    margin-left: 9%;
    position: relative;
    padding:12px 0 12px 0;
  }
  ul li p:nth-of-type(1){
  position: absolute;
    left:-18px;
    font-size:16px;
    color: #03aef9;
    font-weight: 500;
  }
  ul li p:nth-of-type(2){
    font-size: 16px;
    color: #444444;
    line-height: 21px;
  }
  ul li p:nth-of-type(2) span{
    color: rgb(35,82,128);
    margin-right: 6px;
  }
  ul li p:nth-of-type(3){
    font-size: 12px;
    color:#808080;
    margin-top: 3px;
  }
</style>
