<template>
  <div>
    <div style="background: #fff"></div>
    <div class="mui-content">
      <div class="invitation-title">
        <svg class="icon" aria-hidden="true" @tap.stop.prevent="close()">
          <use xlink:href="#icon-guanbi"></use>
        </svg>
        <div class="next-step" @tap.stop.prevent="close()">完成</div>
      </div>

      <div class="component-contact-find">
        <div class="line1">寻找你的通讯录好友</div>
        <div class="line2">看看他们的平台动态</div>
        <div class="circleWrapper" @tap.stop.prevent="getContacts()">
          <div class="iconWrapper">
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-tongxunlu"></use>
            </svg><span class="font-family-medium">点击寻找</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import userAbility from '../../utils/userAbility'

  export default {
    data: () => ({}),
    created () {
    },
    computed: {},
    components: {},
    methods: {
      close () {
        if (this.$route.query.from === 'feed') {
          this.$router.pushPlus('/home?refresh=1')
        } else {
          this.$router.pushPlus('/my')
        }
      },
      getContacts () {
        userAbility.getLocalContact(this)
      }
    },
    mounted () {
    },
    updated () {
    }
  }

</script>
<style scoped>
  ul,
  li,
  p,
  span,
  a,
  i {
    margin: 0;
    padding: 0;
    list-style: none;
  }
  .bot {
    position: absolute;
    right: 0;
    bottom: 0;
    left: 0rem;
    height: 0.026rem;
    -webkit-transform: scaleY(.5);
    transform: scaleY(.5);
    background-color: rgb(220, 220, 220);
  }
  .mui-content{
    background: #FFFFFF;
  }
  /*邀请的头部*/
  .invitation-title{
    width:100%;
    height:3.52rem;
    padding: 0 0.453rem;
    text-align: center;
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  .invitation-title svg{
    color: #b4b4b6;
    font-size: 0.666rem;
    position: absolute;
    left:0.453rem;
    top:0.533rem;
  }
  .invitation-title .next-step{
    width:2rem;
    height:0.906rem;
    line-height: 0.853rem;
    border: 0.026rem solid #03aef9;
    border-radius: 1.333rem;
    font-size:0.373rem;
    color:#03aef9;
    position: absolute;
    right:0.453rem;
    top:0.426rem;
  }
  .invitation-title .invitation-text{
    position: absolute;
    top:1.573rem;
    text-align: left;
    display: flex;
    flex-direction: column;
  }
  .invitation-text p:nth-of-type(1){
    font-size:0.373rem;
    color: #808080;
  }
  .invitation-text p:nth-of-type(2){
    font-size:0.533rem;
    color: #323232;
  }

  .invitation-recommend p{
    width:50%;
    height:1.173rem;
    text-align: center;
    font-size:0.373rem;
    color: #235280;
    line-height: 1.173rem;
    float: left;
  }
  .invitation-recommend p svg{
    font-size: 0.533rem;
    margin-bottom: -0.053rem;
  }
  .invitation-recommend i{
    width:0.026rem;
    height:0.506rem;
    background: #dcdcdc;
    position: absolute;
    top:0;
    bottom: 0;
    left:0;
    right: 0;
    margin: auto;
  }

  .component-contact-find {
    text-align: center; }
  .component-contact-find .line1 {
    font-size: 0.533rem;
    color: #323232;
    line-height: 0.746rem; }
  .component-contact-find .line2 {
    margin-top: 0.053rem;
    font-size: 0.373rem;
    line-height: 0.533rem;
    color: #808080; }
  .component-contact-find .circleWrapper {
    margin-top: 0.906rem;
    display: inline-block;
    position: relative;
    width: 6.133rem;
    height: 6.133rem; }
  .component-contact-find .circleWrapper:before {
    content: '';
    position: absolute;
    left: 50%;
    top: 50%;
    margin-top: -3.066rem;
    margin-left: -3.066rem;
    width: 6.133rem;
    height: 6.133rem;
    border-radius: 50%;
    border: 0.026rem solid #F3F4F6; }
  .component-contact-find .circleWrapper:after {
    content: '';
    position: absolute;
    left: 50%;
    top: 50%;
    margin-top: -2.266rem;
    margin-left: -2.266rem;
    width: 4.533rem;
    height: 4.533rem;
    border-radius: 50%;
    border: 0.026rem solid #F3F4F6; }
  .component-contact-find .circleWrapper .iconWrapper {
    position: absolute;
    left: 50%;
    top: 50%;
    margin-top: -1.733rem;
    margin-left: -1.733rem;
    display: inline-block;
    text-align: center;
    width: 3.573rem;
    height: 3.573rem;
    border-radius: 50%;
    background: #F3F4F6; }
  .component-contact-find .circleWrapper .iconWrapper .icon {
    color: #64A0E6;
    margin-top: 0.666rem;
    font-size: 1.44rem; }
  .component-contact-find .circleWrapper span {
    display: block;
    color: #808080;
    font-size: 0.373rem;
    line-height: 0.533rem;
    margin-top: 0.16rem; }
</style>
