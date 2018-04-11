<template>
  <div class="-group">
    <img :src="list.logo" />
    <div class="group-right">
      <div class="unread" v-if="list.unread_count"></div>
      <div class="join grey" v-if="description && list.is_joined === 1">已{{description}}</div>
      <div class="join grey" v-else-if="description && list.is_joined === -1"  @tap.stop.prevent="goJoin(list.id)">{{description}}</div>
      <p>
        <span class="-group-name" v-html="getHighlight(list.name)" v-if="search"></span>
        <span class="-group-name" v-else>{{list.name}}</span>
      </p>
      <p class="text-line-2 text">{{list.description}}</p>
      <p class="-group-info">
        <span v-if="!list.public">
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-simi"></use>
          </svg>
          私密
        </span>
        <span><i>{{list.subscribers}}</i>/人气</span>
        <span><i>{{list.articles}}</i>/分享</span>
      </p>
    </div>
    <i class="bot"></i>
  </div>
</template>
<script>
  export default {
    data () {
      return {}
    },
    props: {
      list: {
        type: Object,
        default: {}
      },
      description: {
        type: String,
        default: ''
      },
      search: {
        type: Boolean,
        default: false
      },
      searchText: {
        type: String,
        default: ''
      }
    },
    created () {},
    watch: {},
    methods: {
      // 文字高亮
      getHighlight (content) {
        var reg = new RegExp('(' + this.searchText + ')', 'gi')  // 正则验证匹配
        var newstr = content.replace(reg, '<span style="color: #03aef9">$1</span>')  // 动态添加颜色
        return newstr
      },
      goJoin (id) {
        this.$emit('goJoin', id)
      }
    },
    mounted () {},
    updated () {}
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
    right:0;
    bottom: 0;
    left:0;
    height: 0.026rem;
    -webkit-transform: scaleY(.5);
    transform: scaleY(.5);
    background-color: rgb(220, 220, 220);
  }
  /*圈子*/
  .big.-group{
    padding: 15px 0;
    position: relative;
  }
  .small.-group{
    padding: 10px 0;
  }
  .-group{
    width:100%;
    overflow: hidden;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
  }
  .big img{
    width:92px;
    height:92px;
  }
  .small img{
    width:44px;
    height:44px;
  }
  .-group img{
    border-radius: 4px;
    margin-right: 10px;
  }
  .group-right{
    width: 90%;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }
  /*/*/
  .big .-group-name{
    font-size: 18px;
  }
  .small .-group-name{
    font-size: 14px;
  }
  .-group-name{
    font-weight: 500;
    color: #444444;
  }
  .group-right .text{
    font-size: 12px;
    color: #808080;
    margin-top: 8px;
    line-height: 16px;
  }
  .big .-group-info{
    margin-top: 8px;
  }
  .small .-group-info{
    margin-top: 1px;
  }
  .-group-info{
    font-size: 12px;
    color: #B4B4B6;
  }
  .-group-info span{
    margin-right: 9px;
  }
  .-group-info span i{
    font-size: 14px;
    color:#808080;
    font-weight: bold;
  }
  .join{
    border:1px solid #03AEF9;
    font-size: 14px;
    color: #03AEF9;
    padding:0px 10px;
    border-radius: 4px;
    position: absolute;
    top: 15px;
    right: 0;
  }
  .join.grey{
    border:1px solid #C8C8C8;
    color: #B4B4B6;

  }
  .unread{
    width:8px;
    height:8px;
    background: #FA4975;
    border-radius: 50%;
    position: absolute;
    top: 15px;
    right: 0;
  }
</style>
