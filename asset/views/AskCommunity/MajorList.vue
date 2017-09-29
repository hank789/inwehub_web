<template>

  <div>
    <header class="mui-bar mui-bar-nav">
      <a class="mui-action-back mui-icon mui-icon-left-nav mui-pull-left"></a>
      <h1 class="mui-title">问答社区</h1>
    </header>

    <div id="refreshContainer" class="mui-content mui-scroll-wrapper" v-show="!this.loading">
      <div class="mui-scroll">
        <div class="hotquiz">
          <div class="quiz">
            <p>
              <span>热门问答</span>
              <button @tap.stop.prevent="$router.pushPlus('/ask')">提问</button>
              <i class="bot"></i>
            </p>
          </div>

          <ul class="hotAnswer_b">
            <li v-for="(hot, index) in hotList" @tap.stop.prevent="toDetail(hot.id)" >
              <p class="mui-ellipsis-2">{{hot.description}}</p>
              <div class="hotAnswer_d">
                <p>
                  <img :src="hot.answer_user_avatar_url"/>
                  <svg class="icon" aria-hidden="true" v-if="hot.answer_user_is_expert == 1">
                    <use xlink:href="#icon-zhuanjiabiaojishixin"></use>
                  </svg>
                </p>
                <p class="mui-ellipsis" v-if="hot.hide == 1">回答者：{{hot.answer_username}}</p>
                <p class="mui-ellipsis" v-if="hot.hide == 0">回答者:匿名</p>
                <p class="mui-ellipsis">{{hot.answer_user_title}}</p>
                <p class="mui-ellipsis">{{hot.answer_user_company}}</p>
              </div>
              <i class="bot" v-show="index != hotList.length-1"></i>
            </li>

          </ul>
        </div>
        <!--推荐问答-->

        <div class="river"></div>

        <div class="recommendlist" v-show="!this.loading">
          <div class="recommend">
            <p>
              <span>推荐问答</span>
              <span>

            	   	  	<a @tap.stop.prevent="selectType()">{{ type ? type.split(':')[0] : '全部'}}</a>
            	   	  	<svg class="icon" aria-hidden="true">
					  <use xlink:href="#icon-fenleichakan"></use>
					</svg>
					<i></i>
            	   	  </span>
              <i class="bot"></i>
            </p>
          </div>

          <div class="container" v-show="recommendList.length === 0">
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-zanwushuju"></use>
            </svg>
            <p>暂时还没有数据呀～</p>
          </div>

          <div>
            <ul class="recommend_b">
              <li v-for="(list, index) in recommendList" @tap.stop.prevent="toDetail(list.id)">
                <p class="mui-ellipsis-2">{{list.description}}</p>
                <div class="recommend_d">
                  <p>
                    <img :src="list.answer_user_avatar_url"/>
                    <svg class="icon" aria-hidden="true" v-if="list.answer_user_is_expert == 1">
                      <use xlink:href="#icon-zhuanjiabiaojishixin"></use>
                    </svg>
                  </p>
                  <p class="mui-ellipsis" v-if="list.hide == 1">回答者：{{hot.answer_username}}</p>
                  <p class="mui-ellipsis" v-if="list.hide == 0">回答者:匿名</p>
                  <p class="mui-ellipsis">{{list.answer_user_title}}</p>
                  <p class="mui-ellipsis">{{list.answer_user_company}}</p>
                </div>
                <i class="bot" v-show="index != recommendList.length-1"></i>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import {createAPI, addAccessToken, postRequest} from '../../utils/request';
  import userAbility from '../../utils/userAbility';

  const MajorList = {
    data: () => ({
      hotList: [],
      recommendList: [],
      busy: false,
      loading: true,
    }),
    computed: {
      type() {
        return this.$store.state.askType.selected ? this.$store.state.askType.selected : '';
      },
      bottomId() {
        var length = this.recommendList.length;
        if (length) {
          return this.recommendList[length - 1].id;
        }
        return 0;
      },
    },
    components: {

    },
    methods: {
      downRefresh(){
        this.getHotList(() => {
          this.getRecommendList();
        });
      },
      loadMore(){
        console.log('loadMore');
        this.busy = true;
        this.getNextList();
      },
      toDetail(id) {
        this.$router.pushPlus('/askCommunity/major/' + id, 'askCommunity-major-detail' ,true,'pop-in','hide',true);
      },
      selectType(type_text) {
        this.$router.push('/ask/type?type=majorlist')
      },
      //热门回答的列表；
      getHotList(callback = () => {}) {
        postRequest(`question/majorHot`, {}).then(response => {
          var code = response.data.code;
          //如果请求不成功提示信息 并且返回上一页；
          if (code !== 1000) {
            mui.alert(response.data.message);
            mui.back();
          }
          //请求成功的操作
          if (response.data.data) {
            this.hotList = response.data.data;
          }
          callback();
        });
      },
      getRecommendList() {
        postRequest(`question/majorList`, {
          tag_id: this.type.split(':')[1]
        }).then(response => {
          var code = response.data.code;
          //如果请求不成功提示信息 并且返回上一页；
          if (code !== 1000) {
            mui.alert(response.data.message);
            mui.back();
          }

          if (response.data.data) {
            this.recommendList = response.data.data;
          }
          //没有数据的显示框不显示；
          this.loading = false;
          mui('#refreshContainer').pullRefresh().endPulldownToRefresh(); //refresh completed
        });
      },
      getNextList() {
        postRequest(`question/majorList`, {
          bottom_id: this.bottomId,
          tag_id: this.type.split(':')[1]
        }).then(response => {
          var code = response.data.code;
          if (code !== 1000) {
            mui.alert(response.data.message);
            mui.back();
          }

          if (response.data.data.length > 0) {
            this.recommendList = this.recommendList.concat(response.data.data);
          }


          if (response.data.data.length < 10) {
            this.busy = true;
          } else {
            this.busy = false;
          }
          this.loading = false;
          mui('#refreshContainer').pullRefresh().endPullupToRefresh(this.busy);

        });
      }

    },
    mounted() {
      mui.init({
        pullRefresh : {
          container:"#refreshContainer",//下拉刷新容器标识，querySelector能定位的css选择器均可，比如：id、.class等
          down : {
            auto: true,//可选,默认false.首次加载自动下拉刷新一次
            contentdown : "下拉可以刷新",//可选，在下拉可刷新状态时，下拉刷新控件上显示的标题内容
            contentover : "释放立即刷新",//可选，在释放可刷新状态时，下拉刷新控件上显示的标题内容
            contentrefresh : "正在刷新...",//可选，正在刷新状态时，下拉刷新控件上显示的标题内容
            callback :this.downRefresh //必选，刷新函数，根据具体业务来编写，比如通过ajax从服务器获取新数据；
          },
          up: {
            contentrefresh: '正在加载...',
            contentnomore: '没有更多数据了', //可选，请求完毕若没有更多数据时显示的提醒内容；
            callback: this.getNextList
          }
        }
      });
    },
  }
  export default MajorList;
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
    height: 1px;
    -webkit-transform: scaleY(.5);
    transform: scaleY(.5);
    background-color: rgb(220, 220, 220);
  }

  /*提问样式*/

  .hotquiz {
    width: 100%;
    overflow: hidden;
    background: #FFFFFF;
  }

  .quiz {
    width: 92%;
    height: 44px;
    margin-left: 4%;
    background: #FFFFFF;
    position: relative;
  }

  .quiz span {
    display: block;
    font-size: 16px;
    color: #444444;
    line-height: 44px;
    float: left;
  }

  .quiz button {
    width: 65px;
    height: 29px;
    font-size: 14px;
    color: #FFFFFF;
    background: #03aef9;
    float: right;
    margin-top: 7px;
    border: none;
  }

  /*问答列表*/

  .hotAnswer_b {
    width: 100%;
    background: #FFFFFF;
    overflow: hidden;
  }

  .hotAnswer_b li {
    width: 92%;
    margin-left: 4%;
    overflow: hidden;
    padding: 12px 0;
    position: relative;
  }

  .hotAnswer_b li > p {
    font-size: 14px;
    color: #444444;
  }

  .hotAnswer_d {
    width: 100%;
    height: 32px;
    margin-top: 4.5px;
  }

  .hotAnswer_d p {
    float: left;
  }

  .hotAnswer_d p:nth-child(1) {
    /*width: 8.4%;*/
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
    max-width: 32%;
    height: 15px;
    margin-top: 8.5px;
    font-size: 13px;
    color: #808080;
    border-right: 1px solid #c8c8c8;
    text-align: center;
    line-height: 15px;
    padding: 0 2%;
  }

  .hotAnswer_d p:nth-child(3) {
    max-width: 21%;
    height: 15px;
    margin-top: 8.5px;
    font-size: 13px;
    color: #808080;
    border-right: 1px solid #c8c8c8;
    text-align: center;
    line-height: 15px;
    padding: 0 2%;
  }

  .hotAnswer_d p:nth-child(4) {
    max-width: 36%;
    height: 15px;
    margin-top: 8.5px;
    font-size: 13px;
    color: #808080;
    text-align: center;
    line-height: 15px;
    padding: 0 2%;
  }

  /*推荐问答*/

  .recommendlist {
    width: 100%;
    overflow: hidden;
    background: #FFFFFF;
  }

  .recommend {
    width: 92%;
    height: 44px;
    margin-left: 4%;
    background: #FFFFFF;
    position: relative;
  }

  .recommend span:nth-of-type(1) {
    display: block;
    font-size: 16px;
    color: #444444;
    line-height: 44px;
    float: left;
  }

  .recommend span:nth-of-type(2) {
    display: block;
    width: 70%;
    height: 44px;
    float: right;
    /*background: #CCCCCC;*/
  }

  .recommend span:nth-of-type(2) i {
    float: right;
    display: block;
    width: 1px;
    height: 15px;
    background: #dbdbdb;
    margin-top: 15px;
    margin-right: 15px;
  }

  .recommend span:nth-of-type(2) svg {
    float: right;
    display: block;
    font-size: 16px;
    margin-top: 14px;
    margin-right: 3px;
    color: #03aef9;
  }

  .recommend span:nth-of-type(2) a {
    float: right;
    display: block;
    height: 44px;
    line-height: 44px;
    color: #03aef9;
  }

  /*问答列表*/

  .recommend_b {
    width: 100%;
    background: #FFFFFF;
    overflow: hidden;
  }

  .recommend_b li {
    width: 92%;
    margin-left: 4%;
   /* height: 88px;*/
    overflow: hidden;
    padding: 12px 0;
    position: relative;
  }

  .recommend_b li > p {
   /* margin-top: 12px;*/
    font-size: 14px;
    color: #444444;
  }

  .recommend_d {
    width: 100%;
    height: 32px;
    margin-top: 4.5px;
  }

  .recommend_d p {
    float: left;
  }

  .recommend_d p:nth-child(1) {
    /*width: 8.4%;*/
    height: 32px;
    /*background: #CCCCCC;*/
    position: relative;
  }

  .recommend_d p:nth-child(1) > svg {
    position: absolute;
    font-size: 14px;
    bottom: 0;
    right: -4px;
  }

  .recommend_d p:nth-child(1) > img {
    width: 100%;
    height: 100%;
    border-radius: 50%;
  }

  .recommend_d p:nth-child(2) {
    max-width: 32%;
    height: 15px;
    margin-top: 8.5px;
    font-size: 13px;
    color: #808080;
    border-right: 1px solid #c8c8c8;
    text-align: center;
    line-height: 15px;
    padding: 0 2%;
  }

  .recommend_d p:nth-child(3) {
    max-width: 21%;
    height: 15px;
    margin-top: 8.5px;
    font-size: 13px;
    color: #808080;
    border-right: 1px solid #c8c8c8;
    text-align: center;
    line-height: 15px;
     padding: 0 2%;
  }

  .recommend_d p:nth-child(4) {
    max-width: 36%;
    height: 15px;
    margin-top: 8.5px;
    font-size: 13px;
    color: #808080;
    text-align: center;
    line-height: 15px;
     padding: 0 2%;
  }

  /*无数据的样式 */

  .container {
    text-align: center;
    padding:20px;
  }

  .container svg {
    font-size: 60px;

  }

  .container p {
    font-size: 12px;
    color: #c8c8c8;
  }
  /*滚动区域*/

  .mui-content{
    background-color: #fff;
  }
  
  
  /***媒体查询*****/

	@media screen and (min-width: 320px) {
		
		.recommend_d p:nth-child(1),.hotAnswer_d p:nth-child(1)  {
		width: 11%;
		}
	}

	@media screen and (min-width: 375px) {
		.recommend_d p:nth-child(1),.hotAnswer_d p:nth-child(1)  {
			width: 9.5%;
	      }
	}

	@media screen and (min-width: 414px) {
		.recommend_d p:nth-child(1),.hotAnswer_d p:nth-child(1)  {
		width: 8.4%;
		}
		
	}
</style>
