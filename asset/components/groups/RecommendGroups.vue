<template>
  <div class="container-item swiper" v-if="!loading && apper">
    <div class="title">
      <p class="resumeTitle">{{title}}</p>
      <p v-if="isShowMore" @tap.stop.prevent="$router.pushPlus('/groups')">更多</p>
    </div>
    <swiper :options="swiperOption" class="home-recommend" >
      <swiper-slide style="width: 2.08rem;" class="home-card" :key="item.id" v-for="(item, index) in groupsList">
        <img :src='item.logo'  @tap.stop.prevent="toDetail(item)" />
        <p class="mui-ellipsis">{{item.name}}</p>
        <i v-if="item.unread_count"></i>
      </swiper-slide>
      <swiper-slide  style="width: 2.08rem;" v-if="isShowMore">
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
  export default {
    data () {
      return {
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
      groupsList: {
        type: Array,
        default: []
      },
      loading: {
        type: Number,
        default: 1
      },
      apper: {
        type: Number,
        default: 1
      },
      isShowMore: {
        type: Boolean,
        default: false
      },
      title: {
        type: String,
        default: ''
      }
    },
    watch: {},
    methods: {
      toDetail (item) {
        this.$router.pushPlus('/group/detail/' + item.id)
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
    font-size:0.426rem;
    color:rgba(68,68,68,1);
    font-weight: 500;
  }
  .container-item .title p:nth-of-type(2){
    float: right;
    font-size:0.373rem;
    color:#03AEF9;
  }
  .resume p.resumeTitle{
    font-size: 0.373rem;
    color:rgba(128,128,128,1);
  }
  .home-recommend {
    width: 100%;
    height: 3.28rem;
    padding-left:4%;
    background: #FFFFFF;
  }
  .home-recommend i{
    position: absolute;
    top:0.133rem;
    right:0.133rem;
    display: block;
    width:0.213rem;
    height:0.213rem;
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
    height: 2.08rem;
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
    font-size: 0.32rem;
    color:rgba(128,128,128,1);
    margin-top: -0.106rem;
  }
  /* 合作*/
  .service{
    background: #ffffff;
    height:2.08rem;
    border-radius:0.106rem;
    border: 0.026rem solid RGBA(220, 220, 220, 1);
    position: relative;
  }
  .addtitle{
    font-size: 0.32rem;
    color:rgba(128,128,128,1);
  }
  .service svg{
    position: absolute;
    left: 0;
    top:0;
    bottom: 0;
    right: 0;
    margin: auto;
    font-size: 0.666rem;
    color:rgba(3,174,249,1);
  }
</style>
