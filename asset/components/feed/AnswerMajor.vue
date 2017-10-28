<template>
  <div class="container-item">
    <div class="container-avatarAndText">
      <div class="author">
        <div class="avatar"  @tap.stop.prevent="toResume(data.user.uuid)">
          <div class="avatarInner"><img :src="data.user.avatar">
            <svg class="icon" aria-hidden="true" v-if="data.user.is_expert === 1">
              <use xlink:href="#icon-zhuanjiabiaojishixin"></use>
            </svg>
          </div>
        </div>
        <div class="mui-media-body">{{data.title}}</div>
      </div>
    </div>
    <div class="text-16-444 mui-ellipsis-2">{{data.feed.title}}</div>
  </div>
</template>


<script type="text/javascript">
  export default {
    data () {
      return {

      }
    },
    components: {

    },
    props: {
      data: {
        type: Object,
        default: {}
      },
    },
    created(){
    },
    watch: {
    },
    mounted(){
    },
    methods: {
      toResume(uuid){
        if (!uuid) {
          return false;
        }
        this.$router.pushPlus('/share/resume?id=' + uuid + '&goback=1' + '&time=' + (new Date().getTime()));
      }
    }
  };
</script>
