<template>
  <div>
    <header class="mui-bar mui-bar-nav">
      <Back></Back>
      <h1 class="mui-title">待您回答</h1>
    </header>
    <div class="mui-content">
        <div class="title">
          <p>根据您的擅长和关注推荐以下问答</p>
          <p @tap.stop.prevent="change()">换一批</p>
        </div>
        <ul  v-if="list.length">
          <li v-for="(item,index) in list" @tap.stop.prevent="skip(item.question_type,item.id)">
            <p>{{index+1}}.</p>
            <p>
              <span v-if="item.tags.length"><i v-for="tag in item.tags" @tap.stop.prevent="toTagDetail(tag.name)">{{tag.name}}</i></span>
              <span class="mui-ellipsis-3">{{item.title}}</span>
            </p>
            <p>{{item.answer_number}}人回答  |  {{item.follow_number}}关注</p>
            <i class="bot" v-if="index !== list.length-1"></i>
          </li>
        </ul>
      <Empty v-else></Empty>
    </div>
    <div class="tags" @tap.stop.prevent="$router.pushPlus('/my/advantage')">丰富我的擅长</div>
  </div>
</template>
<script>
  import { postRequest } from '../utils/request'
  import Empty from '../components/Empty.vue'
  import userAbility from '../utils/userAbility'

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
      toTagDetail (name) {
        userAbility.jumpToTagDetail(name)
      },
      skip (type, id) {
        switch (type) {
          case 1:
            this.$router.pushPlus('/askCommunity/major/' + id)
            break
          case 2:
            this.$router.pushPlus('/ask/offer/answers/' + id)
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
    height: 0.026rem;
    -webkit-transform: scaleY(.5);
    transform: scaleY(.5);
    background-color: rgb(220, 220, 220);
  }
  .mui-content{
    background: #FFFFFF;
    bottom:1.173rem;
  }
  .title{
    width:100%;
    height:1.04rem;
    padding-left:4% ;
    background: #f3f4f6;
  }
  .title p{
    float: left;
    line-height: 1.04rem;
  }
  .title p:nth-of-type(2){
    float: right;
    color: #FFFFFF;
    padding: 0rem 0.506rem 0rem 0.56rem;
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
    padding:0.32rem 0 0.32rem 0;
  }
  ul li p:nth-of-type(1){
  position: absolute;
    left:-0.48rem;
    font-size:0.426rem;
    color: #03aef9;
    font-weight: 500;
  }
  ul li p:nth-of-type(2){
    font-size: 0.426rem;
    color: #444444;
    line-height: 0.56rem;
  }
  ul li p:nth-of-type(2) span:nth-of-type(1){
    display: block;
  }
  ul li p:nth-of-type(2) span:nth-of-type(1) i{
    display: inline-block;
    font-size: 0.32rem;
    color: #9e9e9e;
    margin-bottom: 0.106rem;
    margin-right: 0.24rem;
    background: #ececee;
    border-radius: 1.333rem;
    padding:0rem 0.266rem;
  }
  ul li p:nth-of-type(3){
    font-size: 0.32rem;
    color:#808080;
    margin-top: 0.08rem;
  }
  .tags{
    width:100%;
    height:1.173rem;
    background:#f3f4f6;
    text-align: center;
    line-height: 1.173rem;
    font-size:0.4rem;
    color: #03aef9;
    position: absolute;
    bottom: 0;
  }
</style>
