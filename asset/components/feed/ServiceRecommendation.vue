<template>
    <!--swiper -->
    <div class="container-item swiper" v-if="!loading">
      <div class="title">
        <p>企业服务</p>
        <p class="more" @tap.stop.prevent="$router.pushPlus('/discover/company/services')">查看全部</p>
      </div>
      <swiper :options="swiperOption" class="home-recommend">
        <swiper-slide style="width: 5.866rem;" :title="item.title" class="home-card" :key="item.id" v-for="(item, index) in servicesList">
          <img :src="item.img_url_slide"/>
        </swiper-slide>
        <swiper-slide  style="width: 5.866rem;" class="service" v-if="isShow ? isShow : 0">
           <p @tap.stop.prevent="$router.pushPlus('/seekingCooperation')">我也可以提供服务</p>
           <p>如您或您的公司希望在InweHub展示业务开展合作，点此申请。</p>
        </swiper-slide>
      </swiper>
    </div>
</template>


<script>
  import { swiper, swiperSlide } from 'vue-awesome-swiper'
  import { postRequest } from '../../utils/request'
  import { queryParent } from '../../utils/dom'

  export default {
    data () {
      return {
        swiperOption: {
          pagination: '.swiper-pagination',
          slidesPerView: 'auto',
          spaceBetween: 10,
          onTap: this.swipperClick
        },
        loading: 1,
        servicesList: []
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
      }
    },
    created () {

    },
    watch: {},
    methods: {
      swipperClick (swiper, event) {
        var parent = queryParent(event.target, 'swiper-slide')
        if (!parent) return
        var title = parent.getAttribute('title')
        if (title) {
          this.$emit('alertClick', title)
        }
      },
      companyServices () {
        postRequest(`company/services`, {
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
        })
      }
    },
    mounted () {
      this.companyServices()
    },
    updated () {}
  }
</script>

<style  scoped>
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
  .container-item .title p:nth-of-type(1){
    float: left;
    font-size:0.426rem;
    color:#444444;

  }
  .container-item .title p:nth-of-type(2){
    float: right;
    font-size:0.346rem;
    color:#03aef9;

  }

  .home-recommend {
    width: 100%;
    height: 4.586rem;
    padding-left:4%;
    background: #FFFFFF;
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
    height: 3.92rem;
    background: #ececee;
    position: relative;
    border-radius: 0.106rem;
  }
  .home-card img{
    width:100%;
    height:100%;
    border-radius: 0.106rem;
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
  /* 合作*/
  .service{
    background: #03aef9;
    height:3.92rem;
     border-radius:0.106rem;
  }
  .service p:nth-of-type(1){
    width:3.786rem;
    height:0.933rem;
    border: 0.04rem solid #c2cddc;
    font-size:0.373rem;
    color:#FFFFFF;
    text-align: center;
    line-height: 0.933rem;
    margin: auto;
    margin-top: 0.8rem;
    margin-bottom: 0.346rem;
  }
  .service p:nth-of-type(2){
    font-size:0.346rem;
    color:#FFFFFF;
    text-align: center;
    line-height:0.48rem;
    margin: 0 8%;
  }
</style>

