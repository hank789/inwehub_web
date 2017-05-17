<template>
  <div>
    <header class="mui-bar mui-bar-nav">
      <a class="mui-icon mui-icon-close mui-pull-left"
         :href="'#'+this.back_id"></a>
      <h1 class="mui-title" v-text="genderTagName"></h1>
      <a class="mui-btn mui-btn-link mui-pull-right mui-btn-blue mui-disabled"
         v-if="iselected.length === 0">完成</a>
      <a v-bind:id="'done_' + back_id" @tap.stop.prevent="done" class="mui-btn mui-btn-link mui-pull-right mui-btn-blue"
         v-else>完成<span>({{ iselected.length }})</span></a>
    </header>
    <div class="mui-content">
      <div class="mui-indexed-list">
        <div class="mui-indexed-list-search mui-input-row mui-search">
          <input type="search" class="mui-input-clear mui-indexed-list-search-input" placeholder="搜索">
        </div>
        <div class="mui-indexed-list-alert"></div>
        <div class="mui-indexed-list-inner">
          <div class="mui-indexed-list-empty-alert">没有数据</div>
          <ul class="mui-table-view">
            <li v-for="(tag, index) in tags" class="mui-input-row mui-table-view-cell mui-indexed-list-item mui-checkbox mui-left">
              <input type="checkbox" v-model="iselected" :value="tag" class="tagSelect"/>{{ tag }}
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>

</template>

<script>
  import {apiRequest} from '../../utils/request';
  import muiIndexedList from '../../components/indexedlist/indexedlist.vue';

  export default {
    data: () => ({
      tags: '',
      counts: 0,
      loading: 1,
      iselected: []
    }),
    props: ['tag_type', 'back_id', 'object_type', 'selected'],
    created () {
      apiRequest(`tags/load`, {tag_type: this.tag_type}).then(response_data => {
        if (response_data !== false) {
          this.tags = response_data.tags;
          this.counts = this.tags.length;
        }
      });
    },
    computed: {
      genderTagName() {
        var tag_name = '行业领域';
        switch (this.tag_type) {
          case 3:
            tag_name = '行业领域';
            break;
          case 4:
            tag_name = '产品类型';
            break;
        }
        return tag_name;
      },
      getSelected(){
        return this.selected;
      }
    },
    methods: {
      done(){
        this.$emit('selectedIndustryTags',this.iselected, this.object_type);
        document.getElementById(this.back_id).classList.remove('mui-active');
      },
      checkThis(e){
        e.target.checked = !e.target.checked ? 'checked' : false;
        mui.trigger(e.target, 'change');
      }
    },
    watch: {
      selected: function (val, oldVal) {
        this.iselected = val;
      }
    },
    components: {
      muiIndexedList
    },
    mounted() {
    }
  }

</script>
