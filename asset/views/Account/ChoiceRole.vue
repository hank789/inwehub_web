<template>
  <div>
    <header class="mui-bar mui-bar-dark mui-bar-nav">
      <Back></Back>
      <!--<h1 class="mui-title">选择角色</h1>-->
    </header>
    <div class="mui-content">
      <div class="choiceText">选择您的角色</div>
      <div class="roleList">
        <div class="role" @tap.stop.prevent="$router.pushPlus('/my/service/' + item.type)" v-for="(item,index) in roleList" :key="index">{{item.text}}</div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        roleList: [
          {text: '甲方需求方', type: 1},
          {text: '乙方产品方', type: 2},
          {text: '乙方服务方', type: 3},
          {text: '行业从业者', type: 4}
        ]
      }
    },
    methods: {
    }
  }
</script>

<style scoped lang="less">
  .mui-content {
    background: #ffffff;
    text-align: center;
  }
  .choiceText {
    color: #444444;
    font-size: 0.533rem;
    margin-top: 1.92rem;
    font-family:PingFangSC-Medium;
  }

  .roleList {
    margin-top: 0.533rem;
    .role {
      width: 5.333rem;
      height: 1.173rem;
      margin: 0.266rem auto;
      color: #B4B4B6;
      font-size: 0.426rem;
      line-height: 1.173rem;
      text-align: center;
      border-radius: 2.666rem;
      border: 0.026rem solid #DCDCDC;
      &:active {
        border-color: #03AEF9;
        color: #03AEF9;
      }
    }
  }
</style>
