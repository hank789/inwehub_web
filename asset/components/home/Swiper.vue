<template>
  <!--人物推荐-->
  <div class="container-item" v-show="!loading">
    <div class="title">推荐专家<span class="more" @tap.stop.prevent="more()">更多</span></div>
    <swiper :options="swiperOption" id="home-recommend" ref="mySwiper">
      <swiper-slide id="home-card" :class="experts.uuid" v-for="(experts, index) in recommend_experts" :key="index"
                    :uuid="experts.uuid" :index="index">
        <div class="home_avatar">
          <Avatar :avatar="experts.avatar_url" :class="experts.uuid"></Avatar>
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-zhuanjiabiaojishixin"></use>
          </svg>
        </div>
        <span>
          <i :class="experts.uuid" class="mui-ellipsis">{{ experts.name }}</i>
        </span>
        <span class="mui-ellipsis">{{ experts.title ? experts.title : '　' }}</span>
        <span class="followed" :id="'follow_' + index" v-if="experts.is_followed">已关注</span>
        <span class="follow" :id="'follow_' + index" v-else>关注 Ta</span>
        <p>
          {{experts.work_years ? experts.work_years : "0"}}年
					</p>
      </swiper-slide>
      <swiper-slide class="moreExperts">
        <div>
						<span class="Expertround">
              <svg class="icon" aria-hidden="true">
						     <use xlink:href="#icon-shouyegengduozhuanjia"></use>
						  </svg>
						</span>
          <p>申请成为专家</p>
          <p>开展业务合作</p>
        </div>
      </swiper-slide>
    </swiper>
  </div>
</template>

<script type="text/javascript">
  import { postRequest } from '../../utils/request'
  import { swiper, swiperSlide } from 'vue-awesome-swiper'
  import { queryParent } from '../../utils/dom'
  import userAbilityCheck from '../../utils/userAbilityCheck'
  import Avatar from '../../components/image/Avatar.vue'
  import userAbility from '../../utils/userAbility'

  export default {
    data () {
      return {
        recommend_experts: [],
        swiperOption: {
          pagination: '.swiper-pagination',
          slidesPerView: 3,
          spaceBetween: 10,
          onTap: this.swipperClick
        },
        loading: 1
      }
    },
    components: {
      swiper,
      swiperSlide,
      Avatar
    },
    props: {},
    created () {
      this.getHomeData()
    },
    watch: {},
    mounted () {
    },
    computed: {
      swiper () {
        return this.$refs.mySwiper.swiper
      }
    },
    updated () {
      var that = this
      this.$nextTick(() => {
        if (that.$refs.mySwiper.swiper) {
          that.$refs.mySwiper.swiper.update(true)
        }
      })
    },
    methods: {
      collectProfessor: function (uuid, index) {
        if (!uuid) {
          return
        }
        postRequest(`follow/user`, {
          id: uuid
        }).then(response => {
          var code = response.data.code
          if (code !== 1000) {
            window.mui.alert(response.data.message)
            return
          }

          var obj = document.querySelector('#follow_' + index)
          if (obj) {
            obj.classList.add('followed')
            obj.classList.remove('follow')
            obj.innerText = '已关注'
          }

          window.mui.toast(response.data.data.tip)
        })
      },
      swipperClick (swiper, event) {
        var classList = event.target.classList
        var parent = queryParent(event.target, 'swiper-slide')
        if (!parent) return
        var uuid = parent.getAttribute('uuid')
        var index = parent.getAttribute('index')
        if (uuid) {
          if (classList && classList.contains('follow')) {
            this.collectProfessor(uuid, index)
          } else {
            this.$router.pushPlus('/share/resume?id=' + uuid + '&goback=1')
          }
        } else {
          userAbility.jumpToApplyProfessor(this)
        }
      },
      more () {
        userAbilityCheck.moreProfessor(this.$parent)
      },
      getHomeData () {
        postRequest(`home`, {}, false).then(response => {
          var code = response.data.code
          if (code !== 1000) {
            window.mui.toast(response.data.message)
            return
          }
          this.recommend_experts = response.data.data.recommend_experts
          this.loading = 0
        })
      }
    }
  }
</script>
<style scoped="scoped">
  /*人物推荐*/
  #home-recommend {
    width: 100%;
    height: 4.186rem;
    background: #FFFFFF;
    padding-left: 4%;
  }

  #home-recommend div:nth-of-type(1) {
    margin-left: 0rem;
  }
/*box-shadow: 0 0 0.266rem #f3f4f6;*/
  #home-card {
    width: 3.04rem;
    height: 3.946rem;
    background:#FFFFFF;
    padding-top: 0.266rem;
    position: relative;
    border-radius: 0.106rem;
    border:0.005rem solid #dcdcdc;
    box-shadow: 0 0 0.133rem #ececee;
  }

  #home-card img {
    width: 1.333rem;
    height: 1.333rem;
    display: block;
    border-radius: 50%;
    margin: 0 auto;
  }

  #home-card span {
    display: block;
    text-align: center;
    font-size: 0.32rem;
    padding: 0 0.106rem;
  }

  #home-card span:nth-of-type(1) i {
    display: inline-block;
    max-width: 1.866rem;
    height: 0.533rem;
    font-style: normal;
  }

  #home-card span:nth-of-type(1) {
    width: 100%;
    text-align: center;
    font-size: 0.373rem;
    font-weight: 600;
    color: #444444;
    margin-top: 0.053rem;
  }

  #home-card span:nth-of-type(1) svg {
    font-size: 0.533rem;
    color: #03aef9;
    margin-bottom: 0.066rem;
    margin-left: -0.08rem;
  }

  .home-card span:nth-of-type(2) {
    display: inline-block;
    width: 100%;
    color: #444444;
  }

  #home-card span:nth-of-type(3) {
    width: 70%;
    height: 0.64rem;
    line-height: 0.586rem;
    border-radius: 1.333rem;
    border: 0.013rem solid #03aef9;
    margin-left: 15%;
    margin-top: 0.16rem;
    font-size: 0.373rem;
    text-align: center;
    color: #03aef9;
  }

  #home-card p {
    position: absolute;
    top: 0rem;
    /*right: 0rem;*/
    width: 0.746rem;
    text-align: center;
    background: url("../../statics/images/fill_1@2x.png") no-repeat;
    background-size: 100% 100%;
    font-size: 0.32rem;
    color: #ffffff;
  }

  /*查看更多专家样式*/

  .moreExperts {
    width: 3.155rem;
    margin-right: 0.266rem;
    height: 3.946rem;
    background:#FFFFFF;
    border-radius: 0.106rem;
    position: relative;
    border: 0.005rem solid #dcdcdc;
    box-shadow: 0 0 0.133rem #ececee;
  }

  .moreExperts > div {
    width: 80%;
    height: 60%;
    position: absolute;
    top: 20%;
    left: 10%;
    /*background: #CCCCCC;*/
  }

  .moreExperts > div > span {
    display: inline-block;
    border: 0.026rem solid #b4b4b6;
    width: 1.333rem;
    height: 1.333rem;
    border-radius: 50%;
    margin-left: 25%;
    position: relative;
  }

  .moreExperts > div svg {
    font-size: 0.8rem;
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    margin: auto;
    text-align: center;
    color: #b4b4b6;
  }

  .moreExperts > div p {
    text-align: center;
    color: #444444;
    font-size: 0.32rem;
    margin-top: 0.053rem;
    margin-bottom: 0;
  }
  .moreExperts > div p:nth-of-type(2){
    margin-top:-0.133rem;
  }

  .container-item {
    padding-right: 0;
    padding-left: 0;
    padding-bottom: 0.266rem;
    padding-top: 0.133rem;
  }

  .title {
    font-size: 0.346rem;
    color: #444;
    padding-left: 0.4rem;
    padding-bottom: 0.133rem;
  }

  .title .more {
    float: right;
    margin-right: 0.4rem;
    font-size: 0.346rem;
    color: #03aef9;
  }

  .followed {
    color: #b4b4b6 !important;
    border-color: #b4b4b6 !important;
  }
  /*头像*/
  .home_avatar{
    position: relative;
  }
  .home_avatar svg{
    font-size:0.533rem;
    position: absolute;
    bottom: 0;
    right: 25%;
  }
  /* 适配*/
  @media (min-width: 320px) {
    #home-card p {
      right: 0;
    }
  }
  @media (min-width: 375px) {
    #home-card p {
      right: 4%;
    }
  }
  @media (min-width: 414px) {
    #home-card p {
      right: 4%;
    }
  }

</style>
