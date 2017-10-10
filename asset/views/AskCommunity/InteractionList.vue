<template>

  <div>
    <header class="mui-bar mui-bar-nav">
      <a class="mui-action-back mui-icon mui-icon-left-nav mui-pull-left"></a>
      <h1 class="mui-title">互动问答</h1>
    </header>

    <div class="mui-content absolute" v-show="!this.loading">

      <div class="menu">
        <div class="mui-segmented-control mui-segmented-control-inverted mui-segmented-control-primary">
          <a class="mui-control-item" @tap.stop.prevent="$router.replace('/askCommunity/majors')">
            专业问答
        </a>
          <a class="mui-control-item mui-active" @tap.stop.prevent="">
            互动问答
          </a>
        </div>
      </div>

      <div class="mui-scroll-wrapper" id="refreshContainer">
        <div class="mui-scroll">
          <div class="recommendlist" v-show="!this.loading">

            <div class="container" v-show="recommendList.length === 0">
              <svg class="icon" aria-hidden="true">
                <use xlink:href="#icon-zanwushuju"></use>
              </svg>
              <p>暂时还没有数据呀～</p>
            </div>

            <div>

              <ul class="mui-table-view mui-table-view-chevron">
                <li class="mui-table-view-cell" v-for="(list, index) in recommendList">
                  <div class="first">
                    <div class="avatar">
                      <div class="avatarInner"><img class="avatar" src="images/expert.png"></div>
                    </div>
                    <div class="mui-media-body">realname
            <div class="detail"><span class="position">运营专员</span><span class="split"></span><span class="company">上海樱维网络有限公</span></div>
                    </div>
                  </div>
                  <div class="second">MIX2给了小米多少抗衡苹果的勇气！？小米在11号抢在iPhone前面一天发布。</div>
                  <div class="three">2人回答</div>
                </li>
              </ul>
            </div>
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
    components: {},
    methods: {
      downRefresh(){
          this.getRecommendList();
      },
      loadMore(){
        console.log('loadMore');
        this.busy = true;
        this.getNextList();
      },
      toDetail(id) {
        this.$router.pushPlus('/askCommunity/major/' + id, 'list-detail-page', true, 'pop-in', 'hide', true);
      },
      selectType(type_text) {
        this.$router.push('/ask/type?type=majorlist')
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
            this.recommendList = []; //response.data.data;
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
            this.recommendList = this.recommendList.concat([]); //response.data.data
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
        pullRefresh: {
          container: "#refreshContainer",//下拉刷新容器标识，querySelector能定位的css选择器均可，比如：id、.class等
          down: {
            auto: true,//可选,默认false.首次加载自动下拉刷新一次
            contentdown: "下拉可以刷新",//可选，在下拉可刷新状态时，下拉刷新控件上显示的标题内容
            contentover: "释放立即刷新",//可选，在释放可刷新状态时，下拉刷新控件上显示的标题内容
            contentrefresh: "正在刷新...",//可选，正在刷新状态时，下拉刷新控件上显示的标题内容
            callback: this.downRefresh //必选，刷新函数，根据具体业务来编写，比如通过ajax从服务器获取新数据；
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
  .mui-content{
    background: #fff;
  }

  .avatar {
    z-index: 0;
    color: #ffffff;
    float: left;
    background-color: #bdbdbd;
    display: inline-block;
    height: 43px;
    width: 43px;
    font-size: 20px;
    text-align: center;
    border-radius: 50%;
  }

  .avatar .avatarInner {
    display: -webkit-box;
    display: -webkit-flex;
    display: -ms-flexbox;
    display: flex;
    width: 100%;
    height: 100%;
    -webkit-box-align: center;
    -webkit-align-items: center;
    -ms-flex-align: center;
    align-items: center;
    -webkit-box-pack: center;
    -webkit-justify-content: center;
    -ms-flex-pack: center;
    justify-content: center;
  }

  .avatar img {
    border-radius: 50%;
    width: 100%;
    height: 100%;
    display: block;
  }

  .mui-media-body {
    padding-left: 10px;
  }

  .mui-table-view-cell:after {
    right:15px;
  }

  .mui-table-view:after{
    display: none;
  }

  .mui-table-view:before{
    display: none;
  }

  .detail {
    font-size: 13px;
    color: #808080;
  }

  .first{
    height:50px;
  }

  .three{
    font-size:12px;
    color:#b4b4b6;
  }

  .split {
    position: relative;
    top: 3px;
    margin: 0 10px;
    display: inline-block;
    width: 1px;
    height: 13px;
    background: #c8c8c8;
    transform: scaleX(.5);
  }

  .menu {
    position: relative;
    z-index: 7;
  }

  .list-empty .menu {
    margin-bottom: 0px;
  }

  .mui-segmented-control .mui-control-item {
    line-height: 45px;
    font-size: 14px;
  }

  .mui-segmented-control.mui-segmented-control-inverted .mui-control-item.mui-active {
    position: relative;
    color: #03aef9;
    border: none;
  }

  .mui-segmented-control.mui-segmented-control-inverted .mui-control-item.mui-active:after {
    position: absolute;
    width: 28px;
    bottom: 0;
    left: 50%;
    margin-left: -14px;
    height: 2px;
    z-index: 999;
    content: '';
    background-color: #009FE8;
  }

  .mui-segmented-control {
    background: #f3f4f6;
  }

  #refreshContainer{
    top:45px;
  }


  .container {
    text-align: center;
    padding: 20px;
  }

  .container svg {
    font-size: 60px;

  }

  .container p {
    font-size: 12px;
    color: #c8c8c8;
  }
</style>
