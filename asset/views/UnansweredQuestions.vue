<template>
  <div>
    <header class="mui-bar mui-bar-nav">
      <a class="mui-action-back mui-icon mui-icon-left-nav mui-pull-left"></a>
      <h1 class="mui-title">待您回答</h1>
    </header>
    <div class="mui-content absolute">
        <div class="title">
          <p>根据您的擅长和关注推荐以下问答</p>
          <p @tap.stop.prevent="change()">换一批</p>
        </div>
        <ul  v-if="list.length">
          <li v-for="(item,index) in list" @tap.stop.prevent="skip(item.question_type,item.id)">
            <p>{{index+1}}.</p>
            <p>
              <span v-if="item.tags.length"><i v-for="tag in item.tags">{{tag.name}}</i></span>
              <span class="mui-ellipsis-3">{{item.title}}</span>
            </p>
            <p>{{item.answer_number}}人回答  |  {{item.follow_number}}关注</p>
            <i class="bot"></i>
          </li>
        </ul>
      <Empty v-else></Empty>
      <div class="tags" @tap.stop.prevent="$router.pushPlus('/my/advantage')">丰富我的擅长</div>
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
    height: 0.1rem;
    -webkit-transform: scaleY(.5);
    transform: scaleY(.5);
    background-color: rgb(220, 220, 220);
  }
  .mui-content{
    background: #FFFFFF;
  }
  .title{
    width:100%;
    height:3.9rem;
    padding-left:4% ;
    background: #f3f4f6;
  }
  .title p{
    float: left;
    line-height: 3.9rem;
  }
  .title p:nth-of-type(2){
    float: right;
    color: #FFFFFF;
    padding: 0rem 1.9rem 0rem 2.1rem;
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
    padding:1.2rem 0 1.2rem 0;
  }
  ul li p:nth-of-type(1){
  position: absolute;
    left:-1.8rem;
    font-size:1.6rem;
    color: #03aef9;
    font-weight: 500;
  }
  ul li p:nth-of-type(2){
    font-size: 1.6rem;
    color: #444444;
    line-height: 2.1rem;
  }
  ul li p:nth-of-type(2) span:nth-of-type(1){
    display: block;
  }
  ul li p:nth-of-type(2) span:nth-of-type(1) i{
    display: inline-block;
    font-size: 1.2rem;
    color: #9e9e9e;
    margin-bottom: 0.4rem;
    margin-right: 0.9rem;
    background: #ececee;
    border-radius: 5rem;
    padding:0rem 1rem;
  }
  ul li p:nth-of-type(3){
    font-size: 1.2rem;
    color:#808080;
    margin-top: 0.3rem;
  }
  .tags{
    width:100%;
    height:4.4rem;
    background:#f3f4f6;
    text-align: center;
    line-height: 4.4rem;
    font-size:1.5rem;
    color: #03aef9;
    position: fixed;
    bottom: 0;
  }
</style>
