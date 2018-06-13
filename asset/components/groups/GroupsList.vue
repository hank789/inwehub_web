<template>
  <div class="-group"  @tap="toDetail(list)">
    <div class="logo">
      <img class="lazyImg" v-lazy="list.logo" />
    </div>
    <div class="group-right">
      <div class="unread" v-if="list.unread_count"></div>
      <svg class="icon arrow" aria-hidden="true">
        <use xlink:href="#icon-chakangengduojiantou"></use>
      </svg>
      <div>
        <div class="-group-name font-family-medium" v-html="getHighlight(list.name)" v-if="search"></div>
        <div class="-group-name font-family-medium text-line-1" v-else> <template v-if="description"><span class="label" v-if="list.is_joined === 1 || list.is_joined === 3">已加</span></template>{{list.name}}</div>
      </div>
      <p class="text-line-2 text" v-if="!type">{{list.description}}</p>
      <p class="-group-info">
        <span v-if="!list.public">
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-simi"></use>
          </svg>
          私密
        </span>
        <span><i class="font-family-medium">{{list.subscribers}}</i>/人气</span>
        <span><i class="font-family-medium">{{list.articles}}</i>/分享</span>
      </p>
    </div>
    <i class="top" v-if="type"></i>
    <i class="bot" v-else></i>
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
        default: () => {
          return {}
        }
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
      },
      type: {
        type: String,
        default: ''
      },
      tapNothing: {
        type: Boolean,
        default: false
      }
    },
    created () {},
    watch: {},
    methods: {
      toDetail (item) {
        if (this.tapNothing) {
          return
        }

        this.$router.pushPlus('/group/detail/' + item.id)
      },
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
  .top {
    position: absolute;
    right:0;
    top: 0;
    left:0;
    height: 0.026rem;
    -webkit-transform: scaleY(.5);
    transform: scaleY(.5);
    background-color: rgb(220, 220, 220);
  }
  .detail i.top{
    display: none;
  }
  /*圈子*/
  .big.-group{
    padding: 0.4rem 0;
    position: relative;
  }
  .small.-group{
    padding-top:0.266rem;
    padding-bottom:0.266rem;
    position: relative;
  }
  .-group{
    width:100%;
    overflow: hidden;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    background: #ffffff;
  }
  .big .logo{
    width:2.453rem;
    height:2.453rem;
    margin-right: 0.266rem;
  }
  .small .logo{
    width:1.173rem;
    height:1.173rem;
    margin-right: 0.266rem;
  }
  .-group .logo img{
    width:100%;
    height:100%;
    border-radius: 0.106rem;
    object-fit: cover;
  }
  .group-right{
    overflow: hidden;
    display: flex;
    flex-direction: column;
    position: relative;
  }
  /*/*/
  .big .-group-name{
    font-size: 0.48rem;
  }
  .small .-group-name{
    font-size: 0.373rem;
  }
  .groupsList .-group-name{
    width:70%;
  }
  .-group-name{
    width:90%;
    display: block;
    color: #444444;
  }
  .group-right .text{
    font-size: 0.32rem;
    color: #808080;
    margin-top: 0.293rem;
    line-height: 0.426rem;
  }
  .big .-group-info{
    margin-top: 0.213rem;
  }
  .small .-group-info{
    margin-top: 0.026rem;
  }
  .-group-info{
    font-size: 0.32rem;
    color: #B4B4B6;
    position: absolute;
    bottom: 0;
    line-height: 0.32rem;
  }
  .-group-info span{
    margin-right: 0.24rem;
  }
  .-group-info span i{
    font-size: 0.373rem;
    color:#808080;
  }
  .-group-info span svg{
    margin-bottom: 0.026rem;
  }
  .join{
    border:0.026rem solid #03AEF9;
    font-size: 0.373rem;
    color: #03AEF9;
    width: 1.706rem;
    text-align: center;
    border-radius: 0.106rem;
    position: absolute;
    top: 0.4rem;
    right: 0;
  }
  .join.grey{
    border:0.026rem solid #C8C8C8;
    color: #B4B4B6;

  }
  .unread{
    width:0.213rem;
    height:0.213rem;
    background: #FA4975;
    border-radius: 50%;
    position: absolute;
    top: 0.4rem;
    right: 0;
  }
  .big .arrow{
    display: none;
  }
  .arrow{
    position: absolute;
    top: 0;
    bottom: 0;
    right: 0;
    margin: auto;
  }
  .label{
    width: 0.8rem;
    height: 0.4rem;
    text-align: center;
    line-height: 0.4rem;
    display: inline-block;
    font-size: 0.266rem;
    color: RGBA(128, 128, 128, 1);
    background:rgba(236,236,238,1);
    border-radius:0.106rem;
    font-weight: normal;
    position: relative;
    top: -0.053rem;
    margin-right: 0.133rem;
  }
  /* 适配*/
  @media (min-width: 320px) {
    .big .group-right {
      width: 65%;
    }
    .small .group-right {
      width: 80%;
    }
  }

  @media (min-width: 375px) {
    .big .group-right {
      width: 70%;
    }
    .small .group-right {
      width: 83%;
    }
  }

  @media (min-width: 414px) {
    .big .group-right{
      width: 73%;
    }
    .small .group-right{
      width: 85%;
    }

  }
</style>
