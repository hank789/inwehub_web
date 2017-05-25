<template>
  <div>

    <header class="mui-bar mui-bar-nav">
      <a class="mui-action-back mui-icon mui-icon-left-nav mui-pull-left"></a>
      <h1 class="mui-title">教育经历</h1>
      <a @tap.stop.prevent="$router.push('/my/info/edu/0')"
         class="mui-btn mui-btn-blue mui-btn-link mui-pull-right">添加</a>
    </header>

    <div class="mui-content">
      <ul class="mui-table-view mui-table-view-chevron" v-show="edus.length == 0">
        <li class="mui-table-view-cell no-empty">请维护教育经历</li>
      </ul>

      <ul class="mui-table-view mui-table-view-chevron">
        <li v-for="edu in edus" class="mui-table-view-cell">
          <a @tap.stop.prevent="$router.push('/my/info/edu/'+edu.id)" class="mui-navigate-right">
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
      edus:[]
    }),
    methods: {

    },
    mounted () {

    },

    computed:{

    },

    created () {
       var edus = localEvent.getLocalItem('edus');

       if (edus) {
         this.edus = edus;
       }
    }
  }
</script>

<style scoped>

</style>
