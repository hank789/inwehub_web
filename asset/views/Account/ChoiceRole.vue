<template>
  <div>
    <header class="mui-bar mui-bar-dark mui-bar-nav">
      <a class="mui-action-back mui-icon mui-icon-left-nav mui-pull-left"></a>
      <!--<h1 class="mui-title">选择角色</h1>-->
    </header>
    <div class="mui-content">
      <div class="choiceText">选择您的角色</div>
      <div class="roleList">
        <div class="role"  @tap.stop.prevent="$router.pushPlus('/my/service/' + item.type)" v-for="(item,index) in roleList" :key="index">{{item.text}}</div>
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
    font-size: 20px;
    font-weight: 500;
    margin-top: 72px;
  }

  .roleList {
    margin-top: 20px;
    .role {
      width: 200px;
      height: 44px;
      margin: 10px auto;
      color: #B4B4B6;
      font-size: 16px;
      line-height: 44px;
      text-align: center;
      border-radius: 100px;
      border: 1px solid #DCDCDC;
    }
  }
</style>
