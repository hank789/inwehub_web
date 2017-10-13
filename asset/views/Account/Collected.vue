<template>
  <div>
    <header class="mui-bar mui-bar-nav">
      <a class="mui-action-back mui-icon mui-icon-left-nav mui-pull-left"></a>
      <h1 class="mui-title">我的收藏</h1>
    </header>


    <div class="mui-content absolute">
      <RefreshList
        v-model="list"
        :api="'collected/answers'"
        :prevOtherData="{}"
        :nextOtherData="{}"
        :list="list"
      >
        <ul class="hotAnswer_b">
          <li class="listBottomBorder" v-for="(item, index) in list" @tap.stop.prevent="toDetail(item)">
            <div class="mui-ellipsis title">{{ item.title }}</div>
            <div class="mui-ellipsis-2 titleSub">{{ item.description }}</div>
            <div class="hotAnswer_d">
              <p>
                <img :src="item.user_avatar_url"/>
                <svg class="icon" aria-hidden="true" v-show="item.is_expert">
                  <use xlink:href="#icon-zhuanjiabiaojishixin"></use>
                </svg>
              </p>
              <p class="mui-ellipsis">回答者：{{ item.user_name}}</p>
            </div>
          </li>
        </ul>

      </RefreshList>
    </div>
  </div>
</template>

<script>
  import {createAPI, addAccessToken, postRequest} from '../../utils/request';
  import RefreshList from '../../components/refresh/List.vue';


  const Obj = {
    data: () => ({
      list: []
    }),
    components: {
      RefreshList
    },
    methods: {
      toDetail(item) {
          if (item.question_type === 2) {
            this.$router.push('/askCommunity/interaction/' + item.answer_id);
          } else {
            this.$router.push('/askCommunity/major/' + item.question_id);
          }
      },
    },
    computed: {
    },
    mounted(){
      window.addEventListener('refreshData', (e) => {
        //执行刷新
        console.log('refresh-onlookerslist');
      });
    }
  };
  export default Obj;

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

  .mui-bar-nav ~ .mui-content.absolute {
    top: 44px;
    background: #fff;
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

  .hotAnswer_b {
    /*height: 200px;*/
    overflow: hidden;
  }

  .hotAnswer_b li {
    width: 100%;
    padding:15px 15px;
    position: relative;
  }

  .hotAnswer_b li > p {
    margin-top: 12px;
    font-size: 16px;
    color: #444444;
  }

  .hotAnswer_d {
    width: 100%;
    height: 32px;
  }

  .hotAnswer_d p {
    float: left;
  }

  .hotAnswer_d p:nth-child(1) {
    width: 32px;
    height: 32px;
    /*background: #CCCCCC;*/
    position: relative;
  }

  .hotAnswer_d p:nth-child(1) > svg {
    position: absolute;
    font-size: 14px;
    bottom: 0;
    right: -4px;
  }

  .hotAnswer_d p:nth-child(1) > img {
    width: 100%;
    height: 100%;
    border-radius: 50%;
  }

  .hotAnswer_d p:nth-child(2) {
    width: 32%;
    height: 15px;
    margin-top: 8.5px;
    font-size: 13px;
    color: #808080;
    margin-left:10px;
    line-height: 15px;
  }

  .hotAnswer_d p:nth-child(3) {
    width: 21%;
    height: 15px;
    margin-top: 8.5px;
    font-size: 13px;
    color: #808080;
    border-right: 1px solid #c8c8c8;
    text-align: center;
    line-height: 15px;
  }

  .hotAnswer_d p:nth-child(4) {
    width: 37.5%;
    height: 15px;
    margin-top: 8.5px;
    font-size: 13px;
    color: #808080;
    text-align: center;
    line-height: 15px;
  }

  /*无数据的样式 */

  .container {
    position: absolute;
    top: 40%;
    left: 36%;
  }

  .container svg {
    font-size: 60px;
    margin-left: 23px;
    margin-bottom: 8px;
  }

  .container p {
    font-size: 12px;
    color: #c8c8c8;
  }

  .title{
    font-size:16px;
    color:#444;
  }
  .titleSub{
    font-size:14px;
    color:#808080;
    padding:5px 0;
  }
</style>
