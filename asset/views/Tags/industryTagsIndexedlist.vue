<template>
  <div>
    <header class="mui-bar mui-bar-nav mustshow">
    	 <a class="mui-action-back mui-icon mui-icon-left-nav mui-pull-left" :href="'#'+this.back_id"></a>
      <h1 class="mui-title" v-text="genderTagName"></h1>
    </header>
    <div class="mui-content mui-scroll-wrapper">


        <div class="mui-scroll">

          <div class="mui-indexed-list">
            <div class="mui-indexed-list-alert"></div>
            <div class="mui-indexed-list-inner">
              <div class="mui-indexed-list-empty-alert">没有数据</div>
              
              <div class="tag_success">
              	<p v-if="iselected.length === 0">确认</p>
              	<p v-bind:id="'done_' + back_id" @tap.stop.prevent="done" v-else>确认 ({{ iselected.length }})</p>
              </div>
              
              <ul class="mui-table-view">
     
                <li v-for="(tag, index) in tags"   class="mui-indexed-list-item tag_text"  @tap.stop.prevent="checkThis" :value="tag.value">
                        {{ tag.text }}
                    <span class="checked"
                        v-if="typeof(getSelectedCodes) === 'object' && getSelectedCodes.indexOf(tag.value) > -1">
                       <i class="round"></i>
                    </span>
                    <span v-else></span>
                   <i class="bot"></i>
                </li>
              </ul>

            </div>
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
          console.log(response_data.tags);
          this.counts = this.tags.length;
        }
        
      });

      this.iselected = this.selected ? this.selected : [];
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
      },
      getSelectedCodes(){
        var newValue = [];
        for (var i in this.iselected) {

          newValue.push(this.iselected[i].value);
        }
        return newValue;
      }
    },
    methods: {
      done(){
        this.$emit('selectedIndustryTags', this.iselected, this.object_type);
        document.getElementById(this.back_id).classList.remove('mui-active');
      },
      checkThis(e){
        var li = null;
        if (e.target.tagName === 'SPAN') {
          li = e.target.parentNode;
        } else {
          li = e.target;
        }
        var span = li.childNodes[1];
        var value = {
          text: li.innerText,
          value: parseInt(li.getAttribute('value'))
        };

        var pos = this.getSelectedCodes.indexOf(value.value);
        if (!span.classList.contains('checked')) {
          span.classList.add('checked');
          if (pos < 0) {
            this.iselected.push(value);
          }
        } else {
          span.classList.remove('checked');
          if (pos >= 0) {
             this.iselected.splice(pos, 1);
          }
        }
      }
    },
    watch: {
      selected: function (val) {
        if (typeof(val) === 'object') {
          this.iselected = val;
        }
      }
    },
    components: {
      muiIndexedList
    },
    mounted() {
      mui('.mui-scroll-wrapper').scroll();
    }
  }

</script>


<style scoped>
  .mui-bar {
    position: fixed;

  }
.bot {
		position: absolute;
		right: 0;
		bottom: 0;
		left: 0px;
		height: 1px;
		-webkit-transform: scaleY(.5);
		transform: scaleY(.5);
		background-color: #dcdcdc;
	}


ul{
	padding: 0 20px;
}
.tag_success{
	 width: 100%;	
	 height: 54px;
}
.tag_success p{
	width:89%;
	height: 34px;
	border-radius: 4px;
	background:#ececee;
	text-align: center;
    line-height: 34px;
    color: #03aef9;
    font-family: "PingFangSC";
	font-size: 14px;
	margin: 10px 20px;
 }
.tag_text{
	width: 98%;
	height: 45px;
	line-height: 45px;
	font-family: "PingFangSC";
	font-size: 14px;
	color: #444444;
	position: relative;
	
}

.tag_text span:nth-of-type(1){
	padding: 0;
	margin: 0;
	list-style: none;
    display: inline-block;
    width: 18px;
    height: 18px;
    border: 0.5px solid #c8c8c8;
    float: right;
    margin-top: 13px;
    border-radius: 50%;
    margin-right: -55px;
    
}

.tag_text span:nth-of-type(1) i.round{
	width: 8px;
	height: 8px;
	font-style: normal;
	display: inline-block;
	background:#03aef9;
	border-radius: 50%;
	margin-left: 4px;
    margin-bottom: 15px;
	
}
.tag_text span.checked{
   display: inline-block;
    width: 18px;
    height: 18px;
    float: right;
    margin-top: 13px;
    margin-right: -55px;
    border: none;
    border: 0.5px solid #c8c8c8;
}



</style>
