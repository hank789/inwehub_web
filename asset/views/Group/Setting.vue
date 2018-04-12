<template>
   <div>
       <header class="mui-bar mui-bar-nav">
         <a class="mui-action-back mui-icon mui-icon-left-nav mui-pull-left"></a>
         <h1 class="mui-title">圈住设置</h1>
       </header>
       <div class="mui-content absolute">
         <RefreshList
           ref="RefreshList"
           v-model="list"
           :api="'group/members'"
           :prevOtherData="{id: id, type: 3}"
           :nextOtherData="{id: id, type: 3}"
           :pageMode = true
           class="listWrapper"
         >
           <div class="apply">
             入圈申请
             <i class="bot"></i>
           </div>
           <ul class="cions-list">
             <template v-for="(item, index) in list">
               <li>
                 <div class="cions-avatar">
                   <img :src="item.avatar_url"/>
                   <svg class="icon" aria-hidden="true">
                     <use xlink:href="#icon-zhuanjiabiaojishixin"></use>
                   </svg>
                 </div>
                 <div class="detail">
                   <p>{{item.name}}</p>
                   <p></p>
                 </div>
                 <div class="fouce" v-if="item.audit_status === 0">通过</div>
                 <div class="fouce space" v-if="item.audit_status === 0">拒绝</div>
                 <div class="fouce grey" v-if="item.audit_status === 1">已通过</div>
                 <div class="fouce grey" v-if="item.audit_status === 2">已拒绝</div>
                 <i class="bot"></i>
               </li>
             </template>
           </ul>
         </RefreshList>
       </div>
   </div>
</template>

<script>
  import RefreshList from '../../components/refresh/List.vue'

  export default {
    data () {
      return {
        id: null,
        list: []
      }
    },
    components: {
      RefreshList
    },
    props: {},
    methods: {
      refreshPageData () {
        this.getData()
      },
      getData () {
        this.id = parseInt(this.$route.params.id)
        if (!this.id) {
          window.mui.back()
          return
        }
      }
    },
    mounted () {
    },
    updated () {},
    watch: {
      '$route': 'refreshPageData'
    },
    created () {
      this.getData()
    }
  }

</script>
<style scoped>
  /*清掉自带样式*/
  div,
  p,
  span,
  i,
  img,
  ul,
  li,
  a {
    margin: 0;
    padding: 0;
    list-style: none;
    font-style: normal;
  }

  .bot {
    position: absolute;
    right: 0;
    bottom: 0;
    left: 0;
    height: 0.026rem;
    -webkit-transform: scaleY(.5);
    transform: scaleY(.5);
    background-color: rgb(220, 220, 220);
  }
  .mui-content{
    background: #ffffff;
  }
  .apply{
    width:92%;
    height:44px;
    margin-left: 4%;
    line-height: 44px;
    font-size: 16px;
    color: #444444;
    font-weight: 500;
    position: relative;
  }
  /*列表区域*/
  .cions-list{
    width:100%;
    overflow: hidden;
    padding: 0 4%;
  }
  .cions-list li{
    position: relative;
    height:1.706rem;
  }
  .cions-list li div{
    float: left;
  }
  .cions-list li .cions-avatar{
    position: relative;
    width:1.173rem;
    height:1.173rem;
    border-radius:50%;
    background: #cccccc;
    margin-top: 0.266rem;
  }
  .cions-list li .cions-avatar img{
    width:1.173rem;
    height:1.173rem;
    border-radius:50%;
  }
  .cions-list li .cions-avatar svg{
    position: absolute;
    font-size: 0.533rem;
    right: -0.133rem;
    bottom: -0.053rem;
  }
  .cions-list li .detail{
    width: 30%;
    margin-top: 0.373rem;
    font-size:0.373rem;
    color: #444444;
    margin-left: 0.213rem;
  }
  .cions-list li .detail p:nth-of-type(1){
    display: flex;
    flex-direction: row;
    align-items: center;
  }
  .cions-list li .detail p:nth-of-type(2){
    width:5.333rem;
    font-size:0.32rem;
    color: #b4b4b6;
    margin-top: -0.053rem;
  }
  .cions-list li .fouce{
    width:1.626rem;
    height:0.72rem;
    background:#03aef9;
    border-radius: 1.333rem;
    text-align: center;
    line-height: 0.72rem;
    font-size:0.373rem;
    color: #ffffff;
    margin-top: 0.493rem;
    float: right;

  }
  .cions-list li .grey{
    color: #b4b4b6;
    background: #dbdcdb;
  }
  .space{
    margin-right: 10px;
  }
</style>
