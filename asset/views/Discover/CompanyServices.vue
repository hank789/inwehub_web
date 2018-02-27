<template>
  <div>
    <header class="mui-bar mui-bar-nav">
      <a class="mui-action-back mui-icon mui-icon-left-nav mui-pull-left"></a>
      <h1 class="mui-title">服务列表</h1>
    </header>
    <div class="mui-content">
      <RefreshList
        v-model="list"
        :api="'company/services'"
        :pageMode="true"
        :isShowUpToRefreshDescription="false"
        :prevOtherData="{page: 1}"
        :nextOtherData="{}"
        class="listWrapper">
        <ul class="services_container">
          <li class="container-image" v-for="(item, index) in list" @tap.stop.prevent="apply()">
            <img :src="item.img_url_list"/>
            <i class="bot"></i>
          </li>
        </ul>
        <div class="apply">
          <p @tap.stop.prevent="$router.pushPlus('/seekingCooperation')">我也可以提供服务</p>
          <p>如您或您的公司希望在InweHub展示业务开展合作</p>
          <p>点此申请</p>
        </div>
      </RefreshList>

    </div>
  </div>
</template>

<script>
  import RefreshList from '../../components/refresh/List.vue'
  import {alertCompanyUser, alertCompany} from '../../utils/dialogList'
  import { getLocalUserInfo } from '../../utils/user'
  const currentUser = getLocalUserInfo()

  export default {
    data () {
      return {
        list: [],
        is_company: currentUser.is_company
      }
    },
    components: {
      RefreshList
    },
    props: {},
    watch: {},
    methods: {
      apply () {
        if (this.is_company) {
          alertCompanyUser(this)
        } else {
          alertCompany(this)
        }
      }
    },
    mounted () {
    },
    updated () {
    }
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

  .mui-content {
    background: #FFFFFF;
  }

  .bot {
    position: absolute;
    right: 0rem;
    bottom: 0;
    left: 0rem;
    height: 0.026rem;
    -webkit-transform: scaleY(.5);
    transform: scaleY(.5);
    background-color: #dcdcdc;
  }

  .services_container {
    width: 100%;
    overflow: hidden;
    padding: 0 4%;
  }

  .services_container li:nth-last-child(1) .bot {
    position: absolute;
    right: 0rem;
    bottom: 0;
    left: 0rem;
    height: 0.026rem;
    -webkit-transform: scaleY(.5);
    transform: scaleY(.5);
    background-color: #FFFFFF;
  }

  .container-image {
    padding: 0.4rem 0;
    height: 4.213rem;
    border-radius: 0.106rem;
    position: relative;
  }
  .container-image img{
    box-shadow: 0 0 0.16rem #f3f4f6;
  }

  /*申请企业服务*/
  .apply {
    width: 100%;
    height: 3.36rem;
    background: url("../../statics/images/company_services_list.png") no-repeat;
    background-size: 100% 100%;
    text-align: center;
    margin-top: 0.4rem;
    position: relative;
  }

  .apply p {
    position: absolute;
    left: 0;
    right: 0;
    margin: auto;
  }

  .apply p:nth-of-type(1) {
    width: 4.266rem;
    height: 0.933rem;
    font-size: 0.426rem;
    color: #ffffff;
    text-align: center;
    line-height: 0.8rem;
    font-weight: 500;
    border: 0.04rem solid #c2cddc;
    top: 0.533rem;
  }

  .apply p:nth-of-type(2) {
    top: 1.813rem;
    line-height: 0.48rem;
    font-size: 0.346rem;
    color: #FFFFFF;

  }

  .apply p:nth-of-type(3) {
    top: 2.373rem;
    line-height: 0.48rem;
    font-size: 0.346rem;
    color: #FFFFFF;
  }

</style>
