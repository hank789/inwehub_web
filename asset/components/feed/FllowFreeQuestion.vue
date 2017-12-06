<template>
  <div class="container-item">
    <div class="container-avatarAndText">
      <div class="author">
        <div class="avatar" @tap.stop.prevent="toResume(data.user.uuid)">
          <div class="avatarInner"><Avatar :avatar="data.user.avatar"></Avatar>
            <svg class="icon" aria-hidden="true" v-if="data.user.is_expert === 1">
              <use xlink:href="#icon-zhuanjiabiaojishixin"></use>
            </svg>
          </div>
        </div>
        <div class="mui-media-body">{{data.title}}</div>
      </div>
    </div>
    <div class="text-16-444 mui-ellipsis-2"> {{data.feed.title}}</div>
    <div class="labelWrapper"><span class="font-12 color-b4b4b6 line-vertical">回答 {{data.feed.answer_num}}</span><span
      class="font-12 color-03aef9">关注问题 {{data.feed.follow_num}}</span></div>
    <div class="answer-list mui-ellipsis">
      回答者：<span v-for="item in data.feed.answer_user_list">{{item.name}}<i>,</i></span>
    </div>
  </div>
</template>


<script type="text/javascript">

  import Avatar from '../../components/image/Avatar.vue'
  export default {
    data () {
      return {}
    },
    components: {Avatar},
    props: {
      data: {
        type: Object,
        default: {}
      }
    },
    created () {
    },
    watch: {},
    mounted () {

    },
    methods: {
      toResume (uuid) {
        if (!uuid) {
          return false
        }
        this.$router.pushPlus('/share/resume?id=' + uuid + '&goback=1' + '&time=' + (new Date().getTime()))
      }
    }
  }
</script>
<style scoped>
  .labelWrapper{
    text-align: right;
  }
  /*回答者列表*/
 .answer-list{
   width:100%;
   height:43px;
   background:#f3f4f6;
   border-radius: 4px;
   line-height: 43px;
   padding: 0 15px;
   font-size:13px;
   color: rgb(128,128,128);
   margin-top: 12.5px;
 }
  .answer-list span{
    color:#03aef9;
  }
  .answer-list span i{
    color: rgb(146,146,146);
    margin-right: 5px;
  }
  .answer-list span:nth-last-of-type(1) i{
   display: none;
  }
</style>
