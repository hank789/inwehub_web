<template>
  <div class="page page-white">
    <div class="page-container">

      <header class="mui-bar mui-bar-nav">
        <a class="mui-action-back mui-icon mui-icon-left-nav mui-pull-left"></a>
        <h1 class="mui-title">任务</h1>
      </header>

      <div class="mui-content task-list">
        <div class="mui-table-view">
          <div class="mui-table-view-cell">
            <div class="title">
              <span class="msg">您有新的任务</span>
              <span class="type">提问</span>
              <span class="time">12分钟前</span>
            </div>
            <div class="subTitle">
              <span class="questions">SAP是个好ERP么?</span>
              <span class="time">倒计时1小时2分钟</span>
            </div>
            <div class="link">
              <a href="waitAnswerList.html">需要前往 确认回答，请点击前往<span class="mui-icon mui-icon-arrowright"></span> </a>
            </div>
          </div>
        </div>

        <div class="mui-table-view">
          <div class="mui-table-view-cell">
            <div class="title">
              <span class="msg">您有新的任务</span>
              <span class="type">提问</span>
              <span class="time">12分钟前</span>
            </div>
            <div class="subTitle">
              <span class="questions">SAP是个好ERP么?</span>
              <span class="time">倒计时1小时2分钟</span>
            </div>
            <div class="link">
              <a href="waitAnswerList.html">需要前往 确认回答，请点击前往<span class="mui-icon mui-icon-arrowright"></span></a>
            </div>
          </div>
        </div>

        <div class="mui-table-view">
          <div class="mui-table-view-cell">
            <div class="title">
              <span class="msg">您有新的任务</span>
              <span class="type">提问</span>
              <span class="time">12分钟前</span>
            </div>
            <div class="subTitle">
              <span class="questions">SAP是个好ERP么?</span>
              <span class="time">倒计时1小时2分钟</span>
            </div>
            <div class="link">
              <a href="myAskDetailAnswer.html">需要前往查看回答并进行点评<span class="mui-icon mui-icon-arrowright"></span></a>
            </div>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script>

  const Ask = {
    methods: {
      selectType () {
        this.$router.push('ask/type');
      },
    }
  }
  export default Ask;
</script>


<style scoped>
  .form-ask textarea {
    width:100%;
    height:100px;
    border:1px solid #efefef;
  }
  .form-ask .title{
    margin-top:10px;
    color:#8b8b8b;
    height:32px;
  }
  .form-ask .category span.active, .form-ask .select span.active{
    border:1px solid #4a90e2;
  }

  .form-ask .category span, .form-ask .select span{
    border:1px solid #b6b6b6;
    border-radius: 5px;
    width:30%;
    display: inline-block;
    height: 32px;
    margin-right: 6px;
    margin-bottom:10px;
    text-align: center;
    line-height: 32px;
    position: relative;
  }
  .form-ask .category span input{
    display: inline-block;
    position: relative;
    border:none;
    height: 90%;
    margin-top:-4px;
    width:90%;
    text-align: center;
  }
  .form-ask .options{
    text-align: center;
  }
  .form-ask .button-wrapper{
    margin-top:15px;
  }


  .textarea-wrapper{
    position: relative;
  }
  .textarea-wrapper .counter{
    position: absolute;
    right: 10px;
    bottom: 30px;
    color:#999;
  }

</style>
