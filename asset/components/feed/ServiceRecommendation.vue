<template>
  <div>
    <!--swiper -->
    <div class="container-item" >
      <div class="title">
        <p>企业服务</p>
        <p class="more" @tap.stop.prevent="$router.pushPlus('/discover/company/services')">查看全部</p>
      </div>
      <swiper :options="swiperOption" id="home-recommend">
        <swiper-slide style="width: 220px;" id="home-card" v-for="(item, index) in servicesList">
          <img :src="item.img_url"/>
        </swiper-slide>
      </swiper>
    </div>
  </div>
</template>


<script>
  import { swiper, swiperSlide } from 'vue-awesome-swiper'
  import { postRequest } from '../../utils/request'
  import { alertCompanyUser, alertDiscoverCompany } from '../../utils/dialogList'

  export default {
    data () {
      return {
        swiperOption: {},
        servicesList: []
      }
    },
    components: {
      swiper,
      swiperSlide
    },
    props: {},
    created () {
      this.swiperOption = {
        pagination: '.swiper-pagination',
        slidesPerView: 1.66,
        spaceBetween: 10,
        onTap: this.swipperClick
      }
    },
    watch: {},
    methods: {
      swipperClick () {
        if (this.is_company) {
          alertCompanyUser(this)
        } else {
          alertDiscoverCompany(this)
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
          }
        })
      }
    },
    mounted () {
      this.companyServices()
    },
    updated () {
//      console.error(this.list)
//      /EnrollmentStatus/11   活动机遇

    }
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
  .container-item{
    background: #FFFFFF;
    margin-bottom: 10px;
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

  #home-recommend {
    width: 100%;
    height: 162px;
    padding-left:4%;
    background: #FFFFFF;
  }

  #home-recommend div:nth-of-type(1) {
    margin-left: 0px;
  }
  #home-card {
    height: 147px;
    background: #ececee;
    position: relative;
    border-radius: 4px;
  }
  #home-card img{
    width:100%;
    height:100%;
    border-radius: 4px;
  }

</style>

