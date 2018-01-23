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

  export default {
    data () {
      return {
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
          window.mui.toast(response.data.data.tip)
        })
      }
    },
    mounted () {
      this.getTagInfo()
    },
    updated () {}
  }
</script>
<style scoped>
  .tag-title{
    width:100%;
    height:133px;
    background: #f3f4f6;
    padding: 0 4%;
    display: flex;
    flex-direction: row;
    align-items: center;
  }
  .tag-l{
    width:92px;
    height:92px;
  }
  .tag-l img{
    width: 100%;
    height:100%;
    border-radius: 4px;
  }
  .tag-l.bg-grey{
    background: #ececee;
    border-radius: 4px;
    position: relative;
  }
  .tag-l.bg-grey svg{
    color: #c8c8c8;
    font-size: 50px;
    position: absolute;
    left:0;
    right:0;
    top:0;
    bottom: 0;
    margin:auto;
  }

  .tag-r{
    height:92px;
    margin-left: 10px;
  }
  .tag-r p:nth-of-type(1){
    font-size:18px;
    color: #444444;
    font-weight:500;
  }
  .tag-r p:nth-of-type(1) span:nth-of-type(2){
    float: right;
    width:62px;
    height:27px;
    background: #a8dff7;
    text-align: center;
    line-height: 26px;
    border-radius: 4px;
    font-size:14px;
    color: #235280;
  }
  .tag-r p:nth-of-type(1) span:nth-of-type(2).grey{
    color: #808080;
    background: #dcdcdc;
  }
  .tag-r p:nth-of-type(2){
    margin-top: 11px;
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
