<template>
  <div>
    <div class="tag-title">
      <div class="tag-l" v-if="tagDetail.logo">
        <img :src="tagDetail.logo">
      </div>
      <div class="tag-l bg-grey" v-else>
        <svg class="icon" aria-hidden="true">
          <use xlink:href="#icon-biaozhunlogoshangxiayise"></use>
        </svg>
      </div>
      <div class="tag-r">
        <p>
          <span>{{tagDetail.name}}</span>
          <!--<span class="grey" v-if="tagDetail.is_followed" @tap.stop.prevent="collectTag(tagDetail.id)">已关注</span>-->
          <!--<span  v-else @tap.stop.prevent="collectTag(tagDetail.id)">关注</span>-->
        </p>
        <p class="mui-ellipsis-3">{{tagDetail.summary}}</p>
      </div>
    </div>
    <!--<div class="tag-focus" @tap.stop.prevent="$router.pushPlus('/tag/FocusMembers?tagname=' + encodeURIComponent(tagDetail.name))" v-if="tagDetail.followers">-->
      <!--<div class="tag-people">-->
        <!--<p class="number"><span>{{tagDetail.followers}}</span>  /关注</p>-->
        <!--<div class="tag-avatar">-->
          <!--<template  v-for="(item, index) in tagDetail.followed_users">-->
            <!--<img :src="item.avatar" />-->
          <!--</template>-->
           <!--<svg class="icon" aria-hidden="true">-->
            <!--<use xlink:href="#icon-chakangengduojiantou"></use>-->
           <!--</svg>-->
        <!--</div>-->
      <!--</div>-->
    <!--</div>-->
  </div>
</template>
<script>
  import { postRequest } from '../../utils/request'
  import localEvent from '../../stores/localStorage'
  import { getLocalUserInfo } from '../../utils/user'
  const currentUser = getLocalUserInfo()

  export default {
    data () {
      return {
        id: currentUser.user_id,
        tagDetail: {}
      }
    },
    created () {
    },
    props: {
      tagName: {
        type: String,
        default: ''
      },
      type: {
        type: String,
        default: ''
      }
    },
    watch: {
      tagName: function (newValue, oldValue) {
        if (newValue !== oldValue) {
          this.getTagInfo()
        }
      }
    },
    methods: {
      getTagInfo () {
        postRequest('tags/tagInfo', {
          tag_name: this.tagName
        }).then(response => {
          var code = response.data.code
          if (code !== 1000) {
            window.mui.toast(response.data.message)
            return
          }
          this.tagDetail = response.data.data
          this.loading = 0
         // 储存状态
          localEvent.setLocalItem('tagsInfo_status' + this.id, response.data.data)
          localEvent.setLocalItem('tagsInfo_name' + this.id, response.data.data.name)
        })
      },
      collectTag (id) {
        postRequest(`follow/tag`, {
          id: id
        }).then(response => {
          var code = response.data.code
          if (code !== 1000) {
            window.mui.alert(response.data.message)
            return
          }
          if (response.data.data.type === 'unfollow') {
            this.tagDetail.is_followed = 0
          } else {
            this.tagDetail.is_followed = 1
          }
          window.mui.toast(response.data.data.tip)
        })
      }
    },
    mounted () {
      var tagsStatus = localEvent.getLocalItem('tagsInfo_status' + this.id)
    // 判断是否请求
      if (this.type === 'tag') {
        this.tagDetail = tagsStatus
        console.log('不请求')
      } else {
        this.getTagInfo()
        console.log('请求')
      }
    },
    updated () {
      this.$nextTick(() => {
        if (this.tagDetail.followers) {
          document.querySelector('.mui-content').classList.add('hasFollowers')
        }
      })
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
  .tag-title{
    width:100%;
    height:3.546rem;
    background: #f3f4f6;
    padding: 1.5rem 4% 1.4rem 4%;
    /*padding: 0 4%;*/
    display: flex;
    flex-direction: row;
    align-items: center;
  }
  .tag-l{
    width:2.453rem;
    height:2.453rem;
  }
  .tag-l img{
    width: 100%;
    height:100%;
    border-radius: 0.106rem;
  }
  .tag-l.bg-grey{
    background: #ececee;
    border-radius: 0.106rem;
    position: relative;
  }
  .tag-l.bg-grey svg{
    color: #c8c8c8;
    font-size: 1.333rem;
    position: absolute;
    left:0;
    right:0;
    top:0;
    bottom: 0;
    margin:auto;
  }

  .tag-r{
    height:2.453rem;
    margin-left: 0.266rem;
  }
  .tag-r p:nth-of-type(1){
    font-size:0.48rem;
    color: #444444;
    font-weight:500;
  }
  .tag-r p:nth-of-type(1) span:nth-of-type(2){
    float: right;
    width:1.653rem;
    height:0.72rem;
    background: #a8dff7;
    text-align: center;
    line-height: 0.693rem;
    border-radius: 0.106rem;
    font-size:0.373rem;
    color: #235280;
  }
  .tag-r p:nth-of-type(1) span:nth-of-type(2).grey{
    color: #808080;
    background: #dcdcdc;
  }
  .tag-r p:nth-of-type(2){
    margin-top: 0.293rem;
  }
  /*关注成员*/
  .tag-focus{
    width:100%;
    height: 1.706rem;
    background: #f3f4f6;
  }
  .tag-people{
    width:92%;
    height: 100%;
    margin-left: 4%;
    border-top:0.026rem solid #dcdcdc;
  }
  .tag-people .number{
    float: left;
    margin-top: 0.48rem;
    font-size: 0.293rem;
    color: #b4b4b6;
  }
  .tag-people .number span{
    font-size: 0.613rem;
    color: #444444;
    font-weight: bold;
    letter-spacing: 0;
  }
  .tag-avatar{
    width:70%;
    height: 0.853rem;
    margin-top: 0.4rem;
    /*background: #ffffff;*/
    float: right;
    border-left: 0.026rem solid #dcdcdc;
    padding:0 0.106rem 0 0.4rem;
    overflow: hidden;
    position: relative;
  }
  .tag-avatar  img{
    width:0.853rem;
    height:0.853rem;
    border-radius: 50%;
    margin-right: 0.133rem;

  }
  .tag-avatar  svg{
    position: absolute;
    right: 0;
    top:0;
    bottom: 0;
    margin: auto;
    color: #808080;
  }
  /***媒体查询*****/

  @media screen and (min-width: 320px) {
    .tag-r {
      width: 70%;
    }
  }

  @media screen and (min-width: 375px) {
    .tag-r {
      width: 70%;
    }
  }

  @media screen and (min-width: 414px) {
    .tag-r {
      width: 73%;
    }
  }
</style>
