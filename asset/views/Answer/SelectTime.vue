<template>
  <div>

    <header class="mui-bar mui-bar-nav">
      <a class="mui-action-back mui-icon mui-icon-left-nav mui-pull-left"></a>
      <h1 class="mui-title">确认应答</h1>
    </header>

    <div class="mui-content wait-answer">
      <div class="mui-table-view">
        <div class="mui-table-view-cell">
          <div class="form form-ask-refuse">
            <div class="title">不着急，先好好思考后再作答吧，点击选择最迟反馈时间并设置回答提醒：</div>
            <button type="button" data-id="picker"  @tap.stop.prevent="initDate()" data-options='{"type":"time"}' class="mui-btn mui-btn-block mui-btn-primary">选择时间</button>

            <br/>
            <div class="title">如果答案已经了然于胸了，还可以立刻前往作答：</div>
            <button type="button" class="mui-btn mui-btn-block mui-btn-primary"  @tap.stop.prevent="$router.replace('/realAnswer/' + id)">立即回答</button>
          </div>
        </div>

      </div>
    </div>

  </div>
</template>

<script>
  import {NOTICE} from '../../stores/types';
  import {createAPI, addAccessToken} from '../../utils/request';
  import dPickerComponent from '../../components/picker/date-picker.vue';

  const SelectTime = {
    data: () => ({
      id:null
    }),
    ready(){
      mui.init();
    },
    created () {
      let id = parseInt(this.$route.params.id);

      if (!id) {
        this.$store.dispatch(NOTICE, cb => {
          cb({
            text: '发生一些错误',
            time: 1500,
            status: false
          });
        });
        this.$router.back();
        return;
      }
      this.id = id;
    },
    methods:{
      initDate:function(){
        let that=this;
        let param={
          "type":"time",
          "customData": {
            "h": [
              { value: "1", text: "1" },
              { value: "2", text: "2" },
              { value: "3", text: "3" }
            ]
          }
        };
        let picker = new mui.DtPicker(param);
        picker.show((rs) => {
          picker.dispose();
          var selectTime = rs.value.replace(':', '');
          if (selectTime.length == 3) {
              selectTime = '0' + selectTime;
          }
          this.submit(selectTime);
        });
      },
      submit(time)
      {
        var data = {
          question_id: this.id,
          promise_time:time
        };

        addAccessToken().post(createAPI(`answer/store`), data,
          {
            validateStatus: status => status === 200
          }
        )
          .then(response => {

            var code = response.data.code;
            if (code !== 1000) {
              mui.alert(response.data.message);
              return;
            }

            this.$router.replace('/answer/' + this.id);
          })
          .catch(({response: {message = '网络状况堪忧'} = {}}) => {
            this.$store.dispatch(NOTICE, cb => {
              cb({
                text: data.message,
                time: 2000,
                status: false
              });
            });
          })
      }
    },
    components:{
      dPickerComponent
    }
  }
  export default SelectTime;
</script>


<style scoped>

  .wait-answer .title{
    margin-bottom: 15px;
  }
</style>
