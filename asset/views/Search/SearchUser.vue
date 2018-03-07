<template>
  <div>
    <div class="mui-content">
      <div class="search">
        <p>
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-sousuo"></use>
          </svg>
          <input type="text" placeholder="" />
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-times1"></use>
          </svg>
        </p>
        <p>取消</p>
      </div>
      <!--导航栏-->
      <div class="menu">
        <span @tap.stop.prevent="$router.replace('/searchQuestion')">问答<i></i></span>
        <span @tap.stop.prevent="$router.replace('/searchSubmission')">分享</span>
        <span @tap.stop.prevent="$router.replace('/searchTag')">标签</span>
        <span @tap.stop.prevent="">用户<i></i></span>
        <i class="bot"></i>
      </div>
    </div>
  </div>
</template>

<script type="text/javascript">
  export default {
    data () {
      return {}
    },
    components: {
    },
    created () {
    },
    watch: {},
    mounted () {
    },
    methods: {
    }
  }
</script>

<style lang="less" scoped>
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

  .bot {
    position: absolute;
    right: 0;
    bottom: 0;
    left: 0;
    height: 0.026rem;
    -webkit-transform: scaleY(.5);
    transform: scaleY(.5);
    background-color: rgb(220, 220, 220);
  }
  .mui-content{
    .search{
      width:100%;
      height:44px;
      background: #ffffff;
      padding: 0 4%;
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
      p{
        &:nth-of-type(1){
          width:75%;
          height:34px;
          border-radius: 50px;
          background: #f3f4f6;
          border:1px solid #dcdcdc;
          display: flex;
          flex-direction: row;
          align-items: center;
          justify-content: space-between;
          padding: 0 10px;
          svg{
            color: #c8c8c8;
            &:nth-of-type(1){
              font-size: 18px;
              margin-right: 10px;
            }
            &:nth-of-type(2){
              margin-left: 10px;
              font-size: 20px;
            }
          }
          input{
            margin: 0;
            padding: 0;
            height:32px;
            border: none;
            background: #f3f4f6;
            font-size: 14px;
            color: #444444;
          }
        }
        &:nth-of-type(2){
          width:66px;
          height:34px;
          background: #03aef9;
          border-radius: 50px;
          font-size: 14px;
          color: #ffffff;
          text-align: center;
          line-height: 34px;
        }
      }
    }
    /*导航栏的样式*/
    .menu{
      width:100%;
      height:1.04rem;
      background: #ffffff;
      font-size:0.373rem;
      color: #444444;
      display: flex;
      flex-direction: row;
      justify-content: space-around;
      align-items: center;
      position: relative;
      span{
        &:nth-of-type(4){
          font-size: 14px;
          position:relative;
          color: #444444;
          font-weight: 500;
          i{
            position:absolute;
            width:0.72rem;
            height:2px;
            border-radius: 1.333rem;
            background:#03aef9;
            top: 0.746rem;
            left: 0;
            right: 0;
            margin: auto;
          }
        }
      }
    }
    /**/
  }

</style>
