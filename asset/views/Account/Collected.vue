<template>
  <div>
    <header class="mui-bar mui-bar-nav">
      <a class="mui-action-back mui-icon mui-icon-left-nav mui-pull-left"></a>
      <h1 class="mui-title">我的收藏</h1>
    </header>


    <div class="mui-content">
      <!--导航栏-->
      <div class="menu">
        <span @tap.stop.prevent="">问答  <i></i></span>
        <span @tap.stop.prevent="$router.replace('/my/collectedArticle')">动态</span>

      </div>


      <RefreshList
        v-model="list"
        :api="'collected/answers'"
        :prevOtherData="{}"
        :nextOtherData="{}"
        :list="list"
         class="listWrapper"
      >
        <ul class="hotAnswer_b">
          <li class="listBottomBorder" v-for="(item, index) in list" @tap.stop.prevent="toDetail(item)">
            <div class="mui-ellipsis title">{{ item.title }}</div>
            <div class="mui-ellipsis-2 titleSub">{{ item.description?item.description:'[图片]' }}</div>
            <div class="hotAnswer_d">
              <p>
                <img :src="item.user_avatar_url"/>
                <svg class="icon" aria-hidden="true" v-show="item.is_expert">
                  <use xlink:href="#icon-zhuanjiabiaojishixin"></use>
                </svg>
              </p>
              <p class="mui-ellipsis">回答者：{{ item.user_name}}</p>
            </div>
            <i class="bot"></i>
          </li>
        </ul>

      </RefreshList>
    </div>
  </div>
</template>

<script>
  import RefreshList from '../../components/refresh/List.vue'

  const Obj = {
    data: () => ({
      list: []
    }),
    components: {
      RefreshList
    },
    methods: {
      toDetail (item) {
        if (item.question_type === 2) {
          this.$router.pushPlus('/askCommunity/interaction/' + item.answer_id, 'list-detail-page', true, 'pop-in', 'hide', true)
        } else {
          this.$router.pushPlus('/askCommunity/major/' + item.question_id, 'list-detail-page', true, 'pop-in', 'hide', true)
        }
      }
    },
    computed: {
    },
    mounted () {
      window.addEventListener('refreshData', (e) => {
        // 执行刷新
        console.log('refresh-onlookerslist')
      })
    }
  }
  export default Obj

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

  .mui-content{
    background: #FFFFFF;
  }
  /*导航栏的样式*/

  .menu {
    width: 100%;
    height: 4.5rem;
    position: absolute;
    z-index: 10;
    background: #f3f4f6;
  }

  .menu span {
    display: block;
    width: 50%;
    height: 100%;
    float: left;
    font-size: 1.4rem;
    color: #444444;
    text-align: center;
    line-height: 4.5rem;
    font-weight: 600;
  }

  .menu span:nth-of-type(1) {
    color: #3c95f9;
    position: relative;
  }

  .menu i {
    display: block;
    position: absolute;
    width: 2.7rem;
    height: 0.15rem;
    left: 42%;
    bottom: 0.05rem;
    background: #3c95f9;
  }


  .bot {
    position: absolute;
    right: 1.5rem;
    bottom: 0;
    left:1.5rem;
    height: 0.1rem;
    -webkit-transform: scaleY(.5);
    transform: scaleY(.5);
    background-color: rgb(220, 220, 220);
  }

  .hotAnswer_b {
    /*height: 20rem;*/
    overflow: hidden;
  }

  .hotAnswer_b li {
    width: 100%;
    padding:1.5rem 1.5rem;
    position: relative;
  }

  .hotAnswer_b li > p {
    margin-top: 1.2rem;
    font-size: 1.6rem;
    color: #444444;
  }

  .hotAnswer_d {
    width: 100%;
    height: 3.2rem;
  }

  .hotAnswer_d p {
    float: left;
  }

  .hotAnswer_d p:nth-child(1) {
    width: 3.2rem;
    height: 3.2rem;
    /*background: #CCCCCC;*/
    position: relative;
  }

  .hotAnswer_d p:nth-child(1) > svg {
    position: absolute;
    font-size: 1.4rem;
    bottom: 0;
    right: -0.4rem;
  }

  .hotAnswer_d p:nth-child(1) > img {
    width: 100%;
    height: 100%;
    border-radius: 50%;
  }

  .hotAnswer_d p:nth-child(2) {
    width: 32%;
    height: 1.5rem;
    margin-top: 0.85rem;
    font-size: 1.3rem;
    color: #808080;
    margin-left:1rem;
    line-height: 1.5rem;
  }

  .hotAnswer_d p:nth-child(3) {
    width: 21%;
    height: 1.5rem;
    margin-top: 0.85rem;
    font-size: 1.3rem;
    color: #808080;
    border-right: 0.1rem solid #c8c8c8;
    text-align: center;
    line-height: 1.5rem;
  }

  .hotAnswer_d p:nth-child(4) {
    width: 37.5%;
    height: 1.5rem;
    margin-top: 0.85rem;
    font-size: 1.3rem;
    color: #808080;
    text-align: center;
    line-height: 1.5rem;
  }

  /*无数据的样式 */

  .container {
    position: absolute;
    top: 40%;
    left: 36%;
  }

  .container svg {
    font-size: 6rem;
    margin-left: 2.3rem;
    margin-bottom: 0.8rem;
  }

  .container p {
    font-size: 1.2rem;
    color: #c8c8c8;
  }

  .title{
    font-size:1.6rem;
    color:#444;
  }
  .titleSub{
    font-size:1.4rem;
    color:#808080;
    padding:0.5rem 0 0;
  }

  .listWrapper{
    top: 4.5rem;
  }
</style>
