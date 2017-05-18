<template>
  <div>

    <header class="mui-bar mui-bar-nav">
      <a class="mui-action-back mui-icon mui-icon-left-nav mui-pull-left"></a>
      <h1 class="mui-title">我的钱包</h1>
    </header>


    <div class="mui-content">
      <div class="feedback">


        <div class="button-wrapper">
          <oauth>

          </oauth>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
  import {apiRequest} from '../../utils/request';
  import oauth from '../../components/oauth/oauth.vue';

  export default {
    data: () => ({

    }),
    computed: {

    },
    components: {
      oauth
    },
    methods: {
      check_withdraw() {

      }
    },
    watch: {

    }
  }
</script>


<style scoped>
  .mui-content{
  }

  .feedback{
  }
  .feedback textarea{
    height:200px;
  }

  .button-wrapper{
    margin-top:40px;
    padding:0 50px;
  }
</style>
