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


            <div class="container" v-show="list.length === 0">
              <svg class="icon" aria-hidden="true">
                <use xlink:href="#icon-zanwushuju"></use>
              </svg>
              <p>暂时还没有数据呀～</p>
            </div>

            <div>

              <ul class="mui-table-view mui-table-view-chevron">
                <li class="mui-table-view-cell" v-for="(item, index) in list" @tap.stop.prevent="toDetail(item.id)">
                  <div class="first">
                    <div class="avatar">
                      <div class="avatarInner"><img class="avatar" :src="item.question_user_avatar_url"></div>
                    </div>
                    <div class="mui-media-body">{{ item.question_username }}</div>
                  </div>
                  <div class="second">{{ item.description }}</div>
                  <div class="three">{{ item.answer_num }}人回答</div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>


      <div class="button-wrapper">
        <button type="button" class="mui-btn mui-btn-block mui-btn-primary"
                @tap.stop.prevent="$router.pushPlus('/ask?question_type=2')">发布互动问答
        </button>
      </div>

    </div>
  </div>
</template>

<script>
  import {createAPI, addAccessToken, postRequest} from '../../utils/request';
  import userAbility from '../../utils/userAbility';

  const InteractionList = {
    data: () => ({
      list: [],
      busy: false,
      loading: true,
    }),
    computed: {
      type() {
        return this.$store.state.askType.selected ? this.$store.state.askType.selected : '';
      },
      bottomId() {
        var length = this.list.length;
        if (length) {
          return this.list[length - 1].id;
        }
        return 0;
      },
    },
    components: {},
    methods: {
      downRefresh(){
        this.getList();
      },
      loadMore(){
        this.busy = true;
        this.getNextList();
      },
      toDetail(id) {
        this.$router.pushPlus('/askCommunity/interaction/answers/' + id, 'list-detail-page', true, 'pop-in', 'hide', true);
      },
      selectType(type_text) {
        this.$router.push('/ask/type?type=majorlist')
      },
      getList() {
        postRequest(`question/commonList`, {
          tag_id: this.type.split(':')[1]
        }).then(response => {
          var code = response.data.code;
          //如果请求不成功提示信息 并且返回上一页；
          if (code !== 1000) {
            mui.alert(response.data.message);
            mui.back();
            return;
          }

          if (response.data.data) {
            this.list = response.data.data;
          }
          //没有数据的显示框不显示；
          this.loading = false;
          mui('#refreshContainer').pullRefresh().endPulldownToRefresh(); //refresh completed
        });
      },
      getNextList() {
        postRequest(`question/commonList`, {
          bottom_id: this.bottomId,
          tag_id: this.type.split(':')[1]
        }).then(response => {
          var code = response.data.code;
          if (code !== 1000) {
            mui.alert(response.data.message);
            mui.back();
          }

          if (response.data.data.length > 0) {
            this.list = this.list.concat([]); //response.data.data
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
  export default InteractionList;
</script>

<style scoped>
  .mui-content {
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
    right: 15px;
  }

  .mui-table-view:after {
    display: none;
  }

  .mui-table-view:before {
    display: none;
  }

  .detail {
    font-size: 13px;
    color: #808080;
  }

  .first {
    height: 50px;
  }

  .three {
    font-size: 12px;
    color: #b4b4b6;
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
    width: 56px;
    bottom: 0;
    left: 50%;
    margin-left: -28px;
    height: 2px;
    z-index: 999;
    content: '';
    background-color: #009FE8;
  }

  .mui-segmented-control {
    background: #f3f4f6;
  }

  #refreshContainer {
    top: 45px;
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

  .button-wrapper {
    position: fixed;
    bottom: 0;
    width: 100%;
    padding: 0;
    z-index: 999;
  }

  .button-wrapper button {
    border-radius: 0;
    margin-bottom: 0;
    padding: 12px 0;
    font-size: 17px;
  }
</style>
