<template>
  <div class="container-item swiper" v-if="!loading && apper">
    <div class="title">
      <p>我的</p>
      <p v-if="isShow" @tap.stop.prevent="$router.pushPlus('/groups')">更多</p>
    </div>
    <swiper :options="swiperOption" class="home-recommend" >
      <swiper-slide style="width: 78px;;" class="home-card" :key="item.id" v-for="(item, index) in servicesList">
        <img :src='item.logo'  @tap.stop.prevent="toDetail(item.is_joined, item.id)" />
        <p class="mui-ellipsis">{{item.name}}</p>
        <i v-if="item.unread_count"></i>
      </swiper-slide>
      <swiper-slide  style="width: 78px;" v-if="isShow">
        <div class="service" @tap.stop.prevent="$router.pushPlus('/groups')">
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-tianjia"></use>
          </svg>
        </div>
        <p class="addtitle" @tap.stop.prevent="$router.pushPlus('/groups')">加入新圈子</p>
      </swiper-slide>
    </swiper>
  </div>
</template>

<script>
  import { swiper, swiperSlide } from 'vue-awesome-swiper'
  import { postRequest } from '../../utils/request'
  export default {
    data () {
      return {
        servicesList: [],
        loading: 1,
        apper: 0,
        swiperOption: {
          pagination: '.swiper-pagination',
          slidesPerView: 'auto',
          spaceBetween: 10,
          onTap: this.swipperClick
        }
      }
    },
    components: {
      swiper,
      swiperSlide
    },
    props: {
      isShow: {
        type: Boolean,
        default: false
      },
      isApper: {
        type: Boolean,
        default: false
      }
    },
    watch: {},
    methods: {
      toDetail (isJoin, id) {
        if (isJoin) {
          this.$router.pushPlus('/group/detail/' + id)
        } else {
          this.$router.pushPlus('/group/apply/' + id)
        }
      },
      companyServices () {
        postRequest(`group/mine`, {
          page: 1
        }).then(response => {
          var code = response.data.code
          // 如果请求不成功提示信息 并且返回上一页；
          if (code !== 1000) {
            window.mui.alert(response.data.message)
            window.mui.back()
            return
          }
          if (response.data.data.data) {
            this.servicesList = response.data.data.data
            setTimeout(() => {
              this.loading = 0
            }, 300)
          }
          if (this.isApper && !this.servicesList.length) {
            this.apper = 0
          } else {
            this.apper = 1
          }
        })
      }
    },
    mounted () {
      this.companyServices()
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
  /*swiper*/
  .swiper{
    margin-bottom: 0;
    background: #FFFFFF;
  }
  .container-item .title{
    width:100%;
    height:1.133rem;
    padding: 0 4%;
    line-height: 1.133rem;
  }
  .container-item .title p{
    float: left;
    font-size:16px;
    color:rgba(68,68,68,1);
    font-weight: 500;
  }
  .container-item .title p:nth-of-type(2){
    float: right;
    font-size:14px;
    color:#03AEF9;
  }
  .home-recommend {
    width: 100%;
    height: 123px;
    padding-left:4%;
    background: #FFFFFF;
  }
  .home-recommend i{
    position: absolute;
    top:5px;
    right:5px;
    display: block;
    width:8px;
    height:8px;
    background: #FA4975;
    border-radius: 50%;
  }
  .home-recommend:after{
    position: absolute;
    bottom: 0;
    left: 0;
    content: '';
    height: 0.266rem;
    background-color: #f3f4f6;
    width: 100%;
  }

  .home-recommend div:nth-of-type(1) {
    margin-left: 0rem;
  }
  .home-card {
    height: 78px;
    background: #ececee;
    position: relative;
    border-radius: 0.106rem;
  }
  .home-card img{
    width:100%;
    height:100%;
    border-radius: 0.106rem;
    object-fit: cover;
  }

  .container-item:after {
    position: absolute;
    bottom: 0;
    left: 0;
    content: '';
    height: 0rem;
    background-color: #97d7fb;
    width: 100%;
  }
  .home-card p{
    font-size: 12px;
    color:rgba(128,128,128,1);
    margin-top: -4px;
  }
  /* 合作*/
  .service{
    background: #ffffff;
    height:78px;
    border-radius:0.106rem;
    border: 1px solid RGBA(220, 220, 220, 1);
    position: relative;
  }
  .addtitle{
    font-size: 12px;
    color:rgba(128,128,128,1);
  }
  .service svg{
    position: absolute;
    left: 0;
    top:0;
    bottom: 0;
    right: 0;
    margin: auto;
    font-size: 25px;
    color:rgba(3,174,249,1);
  }
</style>
