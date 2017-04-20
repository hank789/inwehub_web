<template>
  <div class="page page-white">
    <div class="page-container">
      <header class="mui-bar mui-bar-nav">
        <a class="mui-action-back mui-icon mui-icon-left-nav mui-pull-left"></a>
        <h1 class="mui-title">提问</h1>
      </header>

      <div class="mui-content form form-ask">
        <div class="mui-table-view">
          <div class="mui-table-view-cell">
            <form>
              <div class="textarea-wrapper">
                <textarea></textarea>
                <span class="counter"><span>80</span><span>/</span><span>80</span></span>
              </div>

              <div class="title">请选择提问金额</div>
              <div class="category">
                <span class="active">88元</span>
                <span>188元</span>
                <span>其他金额</span>
                <span class="active">88元</span>
                <span>188元</span>
                <span><input type="text" value=""/> </span>
              </div>
              <div class="title">请选择分类问题：</div>
              <div class="select">已选择: <span class="active">A-B</span></div>
              <div class="button-wrapper">
                <button type="button" class="mui-btn mui-btn-block mui-btn-primary mui-btn-outlined" @click="selectType">点击选择分类</button>
              </div>
            </form>
          </div>
        </div>


        <div class="mui-table-view mt15">
          <div class="mui-table-view-cell">
            <div class="button-wrapper">
              <button type="button" class="mui-btn mui-btn-block mui-btn-primary mui-btn-outlined" onclick="window.location='myAskDetail.html'">立即提问</button>
            </div>
            <div class="options">
              <input type="checkbox" /> 匿名
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
