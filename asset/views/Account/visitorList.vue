<template>
  <div>
    <header class="mui-bar mui-bar-nav">
      <a class="mui-action-back mui-icon mui-icon-left-nav mui-pull-left"></a>
      <h1 class="mui-title">我的人气</h1>
    </header>
    <div class="mui-content">
      <RefreshList
        ref="RefreshList"
        v-model="list"
        :api="'profile/recentVisitors'"
        :pageMode="true"
        :prevOtherData="prevOtherData"
        :nextOtherData="prevOtherData"
        :prevSuccessCallback="prevSuccessCallback"
        class="listWrapper">
          <div class="component-card">
            <div class="number">{{hot_number}}</div>
            <div class="label">人气指数</div>
            <div class="desc">完善个人资料/参与平台互动/积极分享<br>可快速提升人气</div>
          </div>
          <div class="component-title-home">
            <div class="left">最近访客</div>
          </div>
          <div class="line-river"></div>
          <div class="container-list-people">
            <div class="item" v-for="(item, index) in list">
              <div class="component-imageAndText">
                <div class="imageWrapper"><img :src="item.user_avatar_url"></div>
                <div class="textWrapper">
                  <div class="line-1 text-line-1">{{item.user_name}}</div>
                  <div class="line-2 text-line-1">{{item.description}}</div>
                </div>
                <div class="time">{{item.visited_time}}</div>
              </div>
              <div class="line-river"></div>
            </div>
          </div>
          <div class="component-button-empty margin-13-15"><span>查看所有访客</span></div>
      </RefreshList>
    </div>
  </div>
</template>
<script>
  import { getLocalUuid } from '../../utils/user'
  import RefreshList from '../../components/refresh/List.vue'

  export default {
    components: {
      RefreshList
    },
    data () {
      return {
        hot_number: 0,
        list: [],
        prevOtherData: {
          uuid: getLocalUuid()
        }
      }
    },
    created () {},
    methods: {
      prevSuccessCallback () {
        this.hot_number = this.$refs.RefreshList.getResponse().data.hot_number
      }
    }
  }
</script>

<style scoped>
  .mui-content{
    background:#fff;
  }
  .component-card {
    position: relative;
    height: 144px;
    background: linear-gradient(-135.1deg, #07d6fc, #03aef9);
    width: 100%;
    text-align: center; }
  .component-card:before {
    position: absolute;
    left: 0;
    bottom: 0;
    right: 0;
    content: '';
    height: 100%;
    background-image: url("../../statics/images/baisebolang@3x.png");
    background-size: contain;
    background-position: left 72px;
    background-repeat: no-repeat;
    opacity: 0.16; }
  .component-card .number {
    font-family: Tahoma-Bold;
    font-size: 34px;
    line-height: 41px;
    padding-top: 16px;
    color: #fff; }
  .component-card .label {
    display: inline-block;
    width: 68px;
    height: 19px;
    font-size: 12px;
    line-height: 19px;
    background: #235280;
    border-radius: 4px;
    color: #A8DFF7;
    margin-top: 4px; }
  .component-card .desc {
    margin-top: 7px;
    font-size: 12px;
    color: #fff;
    line-height: 17px; }

  .component-imageAndText {
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    padding-bottom: 5px;
    position: relative;}
  .component-imageAndText .imageWrapper img {
    width: 44px;
    height: 44px;
    border-radius: 50%; }
  .component-imageAndText .textWrapper {
    -webkit-box-flex: 2;
    -ms-flex-positive: 2;
    flex-grow: 2;
    padding: 5px 0 0 8px;
    line-height: 18px; }
  .component-imageAndText .textWrapper .line-1 {
    max-width: 223px;
    color: #444444;
    font-size: 14px; }
  .component-imageAndText .textWrapper .line-2 {
    color: #B4B4B6;
    font-size: 13px; }
  .component-imageAndText .time {
    font-size: 6px;
    color: #235280;
    position: absolute;
    right: 0;
    top: 3px; }

  .component-button-empty {
    text-align: center; }
  .component-button-empty span {
    display: inline-block;
    border: 1px solid #03AEF9;
    color: #03AEF9;
    font-size: 16px;
    border-radius: 50px;
    padding: 10px 22px; }

  .container-list-people .item {
    padding: 10px 16px 0; }
</style>
