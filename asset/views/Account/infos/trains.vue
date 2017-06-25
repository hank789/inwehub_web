<template>
  <div>

    <header class="mui-bar mui-bar-nav">
      <a class="mui-action-back mui-icon mui-icon-left-nav mui-pull-left"></a>
      <h1 class="mui-title">培训经历</h1>
      <a @tap.stop.prevent="$router.pushPlus('/my/info/train/0')"
         class="mui-btn mui-btn-blue mui-btn-link mui-pull-right">添加</a>
    </header>

    <div class="mui-content" v-show="!loading">
      <ul class="mui-table-view mui-table-view-chevron" v-show="trains.length == 0">
        <li class="mui-table-view-cell no-empty">请维护培训经历</li>
      </ul>

      <ul class="mui-table-view mui-table-view-chevron">
        <li v-for="train in trains" class="mui-table-view-cell">
          <a @tap.stop.prevent="$router.pushPlus('/my/info/train/'+train.id)" class="mui-navigate-right">
            {{ train.agency }}
                  <p class='mui-ellipsis'>{{ train.get_time }} | {{ train.certificate }}</p>
          </a>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
  import {NOTICE} from '../../../stores/types';
  import {createAPI, addAccessToken, postRequest} from '../../../utils/request';
  import localEvent from '../../../stores/localStorage';
  import ACCOUNT_API from '../../../api/account';
  import dPickerComponent from '../../../components/picker/date-picker.vue';
  import popPickerComponent from '../../../components/picker/poppicker.vue';

  export default {
    data: () => ({
      trains:[],
      loading: true
    }),
    methods: {

    },
    mounted () {
      showInwehubWebview();
      window.addEventListener('refreshData', function(e){
        //执行刷新
        console.log('refresh-trains');
      });
    },

    computed:{

    },

    created () {

      postRequest(`account/train/list`, {}).then(response => {

        var code = response.data.code;
        if (code !== 1000) {
          mui.alert(response.data.message);
          return;
        }

        this.trains = response.data.data;
        this.loading = false;

        var newTrains = [];
        for(var i in this.trains) {
          var info = this.trains[i];
          var id = info.id;
          newTrains[id] = info;
        }
        localEvent.setLocalItem('trains', newTrains);
      });

    }
  }
</script>

<style scoped>

</style>
