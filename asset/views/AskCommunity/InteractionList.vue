<template>

  <div>
    <header class="mui-bar mui-bar-nav">
      <a class="mui-action-back mui-icon mui-icon-left-nav mui-pull-left"></a>
      <h1 class="mui-title">互动问答</h1>
    </header>

    <div class="mui-content absolute">

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

      <RefreshList
        v-model="list"
        :api="'question/commonList'"
        :prevOtherData="{}"
        :nextOtherData="{}"
        :list="list"
      >
        <div class="recommendlist">
          <div>
            <ul class="mui-table-view">
              <li class="mui-table-view-cell" v-for="(item, index) in list" @tap.stop.prevent="toDetail(item.id)">
                <div class="second mui-ellipsis-2">{{ item.description }}</div>
                <div class="three">{{ item.answer_num }}人回答<span class="split"></span><span :class="{isFollowed:item.is_followed_question?true:false}">关注问题{{item.follow_num}}</span></div>
              </li>
            </ul>
          </div>
        </div>
      </RefreshList>

      <div class="button-wrapper">
        <button type="button" class="mui-btn mui-btn-block mui-btn-primary"
                @tap.stop.prevent="$router.pushPlus('/ask/interaction')">发布互动问答

        </button>
      </div>

    </div>
  </div>
</template>

<script>
  import RefreshList from '../../components/refresh/List.vue';

  const InteractionList = {
    data: () => ({
      list: []
    }),
    components: {
      RefreshList
    },
    methods: {
      toDetail(id) {
        this.$router.pushPlus('/askCommunity/interaction/answers/' + id, 'list-detail-page', true, 'pop-in', 'hide', true);
      }
    }
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
    padding-top: 5px;
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

  .isFollowed{
    color:#03aef9;
  }
</style>
