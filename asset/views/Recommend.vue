<template>
  <div>
    <header class="mui-bar mui-bar-nav">
      <a class="mui-action-back mui-icon mui-icon-left-nav mui-pull-left"></a>
      <h1 class="mui-title">精选推荐</h1>
    </header>

    <div class="mui-content">

      <RefreshList
        ref="RefreshList"
        v-model="list"
        :api="'recommendRead'"
        :prevOtherData="{}"
        :nextOtherData="{}"
        :pageMode = true
        class="listWrapper"
      >
          <ul class="recommend">
            <template v-for="(item, index) in list">
            <li>
              <img :src="item.data.img" />
              <div class="text-content">
                <p class="text-line-3">
                  <span>{{ typeDesc(item.read_type) }}</span>
                  {{ item.data.title }}
                </p>
                <p class="information">
                  <span>88浏览<i></i></span>
                  <span>88点赞<i></i></span>
                  <span>好评率96%</span>
                </p>
              </div>
              <i class="bot"></i>
            </li>
            </template>
          </ul>
      </RefreshList>
    </div>
  </div>
</template>
<script>
  import RefreshList from '../components/refresh/List.vue'

  export default {
    data () {
      return {
        list: []
      }
    },
    components: {
      RefreshList
    },
    props: {},
    watch: {},
    methods: {
      typeDesc (type) {
        switch (type) {
          case 1:
            return '发现分享'
          case 2:
            return '专业问答'
          case 3:
            return '互动问答'
          case 4:
            return '活动'
          case 5:
            return '项目机遇'
          case 6:
            return '互动问答回复'
        }
      }
    },
    mounted () {
    },
    updated () {}
  }
</script>
<style scoped="scoped">
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
    left: 0rem;
    height: 0.026rem;
    -webkit-transform: scaleY(.5);
    transform: scaleY(.5);
    background-color: rgb(220, 220, 220);
  }
  .mui-content{
    background: #ffffff;
  }
  /*精选推荐*/
  .recommend{
    width:100%;
    overflow: hidden;
    background: #ffffff;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  .recommend li{
    width: 92%;
    height:110px;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    position: relative;
  }
  .recommend li img{
    width:121px;
    height:81px;
    border-radius:4px;
    object-fit: cover;
  }
  .recommend li .text-content{
    height:81px;
    margin-left: 15px;
    display: flex;
    flex-direction: column;
  }
  .text-content p:nth-of-type(1){
    font-size: 14px;
    color: RGBA(68, 68, 68, 1);
    font-weight: 500;
    line-height: 20px;
  }
  .text-content p:nth-of-type(1) span{
    display: inline-block;
    font-size: 10px;
    color: RGBA(128, 128, 128, 1);
    background:rgba(236,236,238,1);
    padding: 1px 5px;
    border-radius:4px;
  }
  .information{
    width:100%;
    overflow: hidden;
    display: flex;
    flex-direction: row;
    align-items: center;
    font-size: 12px;
    color: RGBA(128, 128, 128, 1);
  }
  .information i{
    display: inline-block;
    width:1px;
    height:12px;
    background:RGBA(219, 219, 219, 1);
    margin: 0 10px;
    margin-bottom: -3px;
  }
</style>
