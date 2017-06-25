<template>
  <div>

    <header class="mui-bar mui-bar-nav">
      <a class="mui-action-back mui-icon mui-icon-left-nav mui-pull-left"></a>
      <h1 class="mui-title">教育经历</h1>
      <a @tap.stop.prevent="$router.pushPlus('/my/info/edu/0')"
         class="mui-btn mui-btn-blue mui-btn-link mui-pull-right">添加</a>
    </header>

    <div class="mui-content" v-show="!loading">
      <ul class="mui-table-view mui-table-view-chevron" v-show="edus.length == 0">
        <li class="mui-table-view-cell no-empty">请维护教育经历</li>
      </ul>

      <ul class="mui-table-view mui-table-view-chevron">
        <li v-for="edu in edus" class="mui-table-view-cell">
          <a @tap.stop.prevent="$router.pushPlus('/my/info/edu/'+edu.id)" class="mui-navigate-right">
            {{ edu.school }}
                  <p class='mui-ellipsis'>{{ edu.begin_time }} ~ {{ edu.end_time }} | {{ edu.major }} | {{ edu.degree
            }}</p>
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
      edus:[],
      loading: true
    }),
    methods: {

    },
    mounted () {
      showInwehubWebview();
      window.addEventListener('refreshData', function(e){
        //执行刷新
        console.log('refresh-edus');
      });
    },

    computed:{

    },

    created () {
      postRequest(`account/edu/list`, {}).then(response => {

        var code = response.data.code;
        if (code !== 1000) {
          mui.alert(response.data.message);
          return;
        }

        this.edus = response.data.data;
        this.loading = false;

        var newEdus = [];
        for(var i in this.edus) {
          var info = this.edus[i];
          var id = info.id;
          newEdus[id] = info;
        }
        localEvent.setLocalItem('edus', newEdus);

      });
    }
  }
</script>

<style scoped>

</style>
