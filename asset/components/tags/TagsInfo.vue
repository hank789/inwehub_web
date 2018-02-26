<template>
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
        <span class="grey" v-if="tagDetail.is_followed" @tap.stop.prevent="collectTag(tagDetail.id)">已关注</span>
        <span  v-else @tap.stop.prevent="collectTag(tagDetail.id)">关注</span>
      </p>
      <p class="mui-ellipsis-3">{{tagDetail.summary}}</p>
    </div>
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
          this.tagDetail.is_followed = !this.tagDetail.is_followed
          this.getTagInfo()
          window.mui.toast(response.data.data.tip)
        })
      }
    },
    mounted () {
      var tagsStatus = localEvent.getLocalItem('tagsInfo_status' + this.id)
      var name = localEvent.getLocalItem('tagsInfo_name' + this.id)
    // 判断是否请求
      if (name === this.tagName) {
        this.tagDetail = tagsStatus
      } else {
        this.getTagInfo()
      }
    },
    updated () {}
  }
</script>
<style scoped>
  .tag-title{
    width:100%;
    height:13.3rem;
    background: #f3f4f6;
    padding: 0 4%;
    display: flex;
    flex-direction: row;
    align-items: center;
  }
  .tag-l{
    width:9.2rem;
    height:9.2rem;
  }
  .tag-l img{
    width: 100%;
    height:100%;
    border-radius: 0.4rem;
  }
  .tag-l.bg-grey{
    background: #ececee;
    border-radius: 0.4rem;
    position: relative;
  }
  .tag-l.bg-grey svg{
    color: #c8c8c8;
    font-size: 5rem;
    position: absolute;
    left:0;
    right:0;
    top:0;
    bottom: 0;
    margin:auto;
  }

  .tag-r{
    height:9.2rem;
    margin-left: 1rem;
  }
  .tag-r p:nth-of-type(1){
    font-size:1.8rem;
    color: #444444;
    font-weight:500;
  }
  .tag-r p:nth-of-type(1) span:nth-of-type(2){
    float: right;
    width:6.2rem;
    height:2.7rem;
    background: #a8dff7;
    text-align: center;
    line-height: 2.6rem;
    border-radius: 0.4rem;
    font-size:1.4rem;
    color: #235280;
  }
  .tag-r p:nth-of-type(1) span:nth-of-type(2).grey{
    color: #808080;
    background: #dcdcdc;
  }
  .tag-r p:nth-of-type(2){
    margin-top: 1.1rem;
  }
  /***媒体查询*****/

  @media screen and (min-width: 32rem) {
    .tag-r {
      width: 70%;
    }
  }

  @media screen and (min-width: 37.5rem) {
    .tag-r {
      width: 70%;
    }
  }

  @media screen and (min-width: 41.4rem) {
    .tag-r {
      width: 73%;
    }
  }
</style>
