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
        :nextSuccessCallback="nextSuccessCallback"
        class="listWrapper">
          <div class="component-card">
            <div class="number">
              <template v-for="(number, index) in hot_number">
                <svg class="icon" aria-hidden="true">
                  <use :xlink:href="'#icon-' + number"></use>
                </svg>
              </template>
            </div>
            <div class="label">人气指数</div>
            <div class="desc">完善个人资料/参与平台互动/积极分享<br>可快速提升人气</div>
          </div>
          <div class="component-title-home">
            <div class="left">最近访客</div>
          </div>
          <div class="line-river"></div>
          <div class="container-list-people">
            <div class="item" v-for="(item, index) in list">
              <div class="component-imageAndText" @tap.stop.prevent="toResume(item.uuid)">
                <div class="imageWrapper"><img :src="item.user_avatar_url"></div>
                <div class="textWrapper">
                  <div class="line-1 text-line-1">{{item.user_name}}</div>
                  <div class="line-2 text-line-1">{{item.description}}</div>
                </div>
                <div class="time">{{item.visited_time}}</div>
              </div>
              <div class="line-river" v-if="index !== list.length-1 || localUserLevel < 4"></div>
            </div>
          </div>
          <div class="component-button-empty" v-show="localUserLevel < 4" @tap.stop.prevent="seeAll"><span>查看所有访客</span></div>
      </RefreshList>
    </div>
  </div>
</template>
<script>
  import { getLocalUuid, getLocalUserLevel } from '../../utils/user'
  import RefreshList from '../../components/refresh/List.vue'
  import userAbility from '../../utils/userAbility'

  export default {
    components: {
      RefreshList
    },
    data () {
      return {
        localUserLevel: getLocalUserLevel(),
        hot_number: '0',
        list: [],
        prevOtherData: {
          uuid: getLocalUuid()
        }
      }
    },
    created () {},
    methods: {
      seeAll () {
        window.trackMixpanelEvent('show-all-visitor', '/my/visitors', 'my-visitors', '我的人气')
        if (this.localUserLevel < 4) {
          userAbility.jumpJudgeGrade(this)
        }
      },
      toResume (uuid) {
        userAbility.jumpToResume(uuid, this)
      },
      prevSuccessCallback () {
        if (this.localUserLevel < 4) {
          var len = this.$refs.RefreshList.list.length >= 3 ? 3 : this.$refs.RefreshList.list.length
          this.$refs.RefreshList.list = this.$refs.RefreshList.list.slice(0, len)
        }
        this.hot_number = this.$refs.RefreshList.getResponse().data.hot_number.toString()
      },
      nextSuccessCallback () {
        if (this.localUserLevel < 4) {
          this.$refs.RefreshList.list = this.$refs.RefreshList.list.slice(0, 3)
        }
      }
    }
  }
</script>

<style scoped>
  @media (-webkit-device-pixel-ratio: 2) {
    .line-river {
      height: 1px !important; /* px不转换 */} }

  .line-river {
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    height: 0.5px; /* px不转换 */
    position: relative;
    width: 100%;
    background-color: #dcdcdc;
    overflow: hidden; }
  .line-river:after{
    display: none;
  }
  .mui-content{
    background:#fff;
  }
  .component-card {
    position: relative;
    height: 3.84rem;
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
    background-position: left 1.92rem;
    background-repeat: no-repeat;
    opacity: 0.16; }
  .component-card .number {
    font-size: 0.746rem;
    line-height: 1.093rem;
    padding-top: 0.506rem;
    color: #fff; }
  .component-card .number .icon {
    margin: 0 -0.08rem; }
  .component-card .label {
    display: inline-block;
    width: 1.813rem;
    height: 0.506rem;
    font-size: 0.32rem;
    line-height: 0.506rem;
    background: #235280;
    border-radius: 0.106rem;
    color: #A8DFF7;
    margin-top: 0.053rem; }
  .component-card .desc {
    margin-top: 0.186rem;
    font-size: 0.32rem;
    color: #fff;
    line-height: 0.453rem; }

  .component-imageAndText {
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    padding-bottom: 0.133rem;
    position: relative;}
  .component-imageAndText .imageWrapper img {
    width: 1.173rem;
    height: 1.173rem;
    border-radius: 50%; }
  .component-imageAndText .textWrapper {
    -webkit-box-flex: 2;
    -ms-flex-positive: 2;
    flex-grow: 2;
    padding: 0.133rem 0 0 0.213rem;
    line-height: 0.48rem; }
  .component-imageAndText .textWrapper .line-1 {
    max-width: 5.946rem;
    color: #444444;
    font-size: 0.373rem; }
  .component-imageAndText .textWrapper .line-2 {
    color: #B4B4B6;
    font-size: 0.346rem; }
  .component-imageAndText .time {
    font-size: 0.32rem;
    color: #235280;
    position: absolute;
    right: 0;
    top: 0.08rem; }

  .container-list-people .item {
    padding: 0.266rem 0.426rem 0; }

  .component-button-empty{
    margin-top:0.8rem;
  }
</style>
