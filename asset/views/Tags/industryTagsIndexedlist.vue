<template>
  <div>
    <header class="mui-bar mui-bar-nav">
      <a v-bind:id="'industry_tags_close_button_'+ back_id" class="mui-icon mui-icon-close mui-pull-left" :href="'#'+this.back_id"></a>
      <h1 class="mui-title" v-text="genderTagName"></h1>
      <a v-bind:id="'done_' + back_id" class="mui-btn mui-btn-link mui-pull-right mui-btn-blue mui-disabled">完成</a>
    </header>
    <div class="mui-content">
      <div v-bind:id="'list_' + back_id" class="mui-indexed-list">
        <div class="mui-indexed-list-search mui-input-row mui-search">
          <input type="search" class="mui-input-clear mui-indexed-list-search-input" placeholder="搜索">
        </div>
        <!--<div class="mui-indexed-list-bar">-->
          <!--<a>A</a>-->
          <!--<a>B</a>-->
          <!--<a>C</a>-->
          <!--<a>D</a>-->
          <!--<a>E</a>-->
          <!--<a>F</a>-->
          <!--<a>G</a>-->
          <!--<a>H</a>-->
          <!--<a>I</a>-->
          <!--<a>J</a>-->
          <!--<a>K</a>-->
          <!--<a>L</a>-->
          <!--<a>M</a>-->
          <!--<a>N</a>-->
          <!--<a>O</a>-->
          <!--<a>P</a>-->
          <!--<a>Q</a>-->
          <!--<a>R</a>-->
          <!--<a>S</a>-->
          <!--<a>T</a>-->
          <!--<a>U</a>-->
          <!--<a>V</a>-->
          <!--<a>W</a>-->
          <!--<a>X</a>-->
          <!--<a>Y</a>-->
          <!--<a>Z</a>-->
        <!--</div>-->
        <div class="mui-indexed-list-alert"></div>
        <div class="mui-indexed-list-inner">
          <div class="mui-indexed-list-empty-alert">没有数据</div>
          <ul class="mui-table-view">
            <li v-for="(tag, index) in tags" class="mui-table-view-cell mui-indexed-list-item mui-checkbox mui-left">

                <input type="checkbox" class="tagSelect" checked="checked" @tap.stop.prevent="checkThis" v-if="typeof(selected) === 'object' && selected.indexOf(tag) > -1"/>

              <input type="checkbox" class="tagSelect"  @tap.stop.prevent="checkThis"   v-else/>{{ tag }}  <span v-if="index == counts-1" style="display: none">{{ loading=0 }} </span>
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
    data: ()=> ({
      tags: '',
      counts: 0,
      loading: 1
    }),
    props: ['tag_type','back_id','object_type', 'selected'],
    created () {
      apiRequest(`tags/load`,{tag_type: this.tag_type}).then(response_data => {
        if (response_data !== false){
          this.tags = response_data.tags;
          this.counts = this.tags.length;
        }
      });
    },
    computed: {
        getSelected(){
            console.log(this.selected);
        },
        genderTagName() {
            var tag_name = '行业领域';
            switch (this.tag_type){
              case 3:
                tag_name = '行业领域';
                break;
              case 4:
                tag_name = '产品类型';
                break;
            }
            return tag_name;
        }
    },
    methods: {
        checkThis(e){
            e.target.checked = !e.target.checked?'checked':false;
            mui.trigger(e.target, 'change');
        },
        updateFinish(){
          var done = document.getElementById('done_' + this.back_id);
          var list = document.getElementById('list_' + this.back_id);
          var count = list.querySelectorAll('input[type="checkbox"]:checked').length;
          var value = count ? "完成(" + count + ")" : "完成";
          done.innerHTML = value;
          if (count) {
            if (done.classList.contains("mui-disabled")) {
              done.classList.remove("mui-disabled");
            }
          } else {
            if (!done.classList.contains("mui-disabled")) {
              done.classList.add("mui-disabled");
            }
          }
        }
    },
    watch: {
      selected:function(val, oldVal){
        console.log('in');
        setTimeout(() => {
          this.updateFinish();
        }, 1000);

      },
      loading: function(val, oldVal) {
        if(val === 0 && oldVal === 1){
          mui.init();
          mui.ready(() => {
            var header = document.querySelector('header.mui-bar');
            var list = document.getElementById('list_' + this.back_id);
            var done = document.getElementById('done_' + this.back_id);
            //calc hieght
            //list.style.height = (document.body.offsetHeight - header.offsetHeight) + 'px';
            //create
            window.indexedList = new mui.IndexedList(list);
            //done event
            done.addEventListener('tap', () => {
              var checkboxArray = [].slice.call(list.querySelectorAll('input[type="checkbox"]'));
              var checkedValues = [];
              checkboxArray.forEach(function(box) {
                if (box.checked) {
                  checkedValues.push(box.parentNode.innerText);
                }
              });
              if (checkedValues.length > 0) {
                this.$emit('selectedIndustryTags',checkedValues, this.object_type);
                var modals = document.querySelectorAll(".mui-modal");
                if (modals !== 'undefined') {
                  modals.forEach(function (modal) {
                    modal.classList.remove("mui-active");
                  });
                }
                //mui.alert('你选择了: ' + checkedValues);
              } else {
                //mui.alert('你没选择任何机场');
              }
            }, false);
            mui('.mui-indexed-list-inner').on('change', 'input', () => {
                this.updateFinish();
            });
          });
        }
      }
    },
    components: {
      muiIndexedList
    },
    mounted() {
    }

  }

</script>
