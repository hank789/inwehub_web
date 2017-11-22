<template>
    <!--swiper -->
    <div class="container-item swiper" v-if="!loading">
      <div class="title">
        <p>企业服务</p>
        <p class="more" @tap.stop.prevent="$router.pushPlus('/discover/company/services')">查看全部</p>
      </div>
      <swiper :options="swiperOption" class="home-recommend">
        <swiper-slide style="width: 220px;" :title="item.title" class="home-card" :key="item.id" v-for="(item, index) in servicesList">
          <img :src="item.img_url_slide"/>
        </swiper-slide>
        <swiper-slide  style="width: 220px;" class="service" v-if="isShow ? isShow : 0">
           <p @tap.stop.prevent="$router.pushPlus('/feedback/cooperate')">我也可以提供服务</p>
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
          slidesPerView:'auto',
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
            }, 200)
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
    height:42.5px;
    padding: 0 4%;
    line-height: 42.5px;
  }
  .container-item .title p:nth-of-type(1){
    float: left;
    font-size:16px;
    color:#444444;

  }
  .container-item .title p:nth-of-type(2){
    float: right;
    font-size:13px;
    color:#03aef9;

  }

  .home-recommend {
    width: 100%;
    height: 172px;
    padding-left:4%;
    background: #FFFFFF;
  }
  .home-recommend:after{
    position: absolute;
    bottom: 0;
    left: 0;
    content: '';
    height: 10px;
    background-color: #f3f4f6;
    width: 100%;
  }

  .home-recommend div:nth-of-type(1) {
    margin-left: 0px;
  }
  .home-card {
    height: 147px;
    background: #ececee;
    position: relative;
    border-radius: 4px;
  }
  .home-card img{
    width:100%;
    height:100%;
    border-radius: 4px;
  }

  .container-item:after {
    position: absolute;
    bottom: 0;
    left: 0;
    content: '';
    height: 0px;
    background-color: #97d7fb;
    width: 100%;
  }
  /* 合作*/
  .service{
    background: #03aef9;
    height:147px;
     border-radius:4px;
  }
  .service p:nth-of-type(1){
    width:142px;
    height:35px;
    border: 1.5px solid #c2cddc;
    font-size:14px;
    color:#FFFFFF;
    text-align: center;
    line-height: 35px;
    margin: auto;
    margin-top: 30px;
    margin-bottom: 13px;
  }
  .service p:nth-of-type(2){
    font-size:13px;
    color:#FFFFFF;
    text-align: center;
    line-height:18px;
    margin: 0 8%;
  }
</style>

