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
    <div class="container-answer">
      <div class="color-808080 font-13">发布者：{{data.feed.submission_username}}</div>
      <div class="container-image margin-10-0-0" v-if="data.feed.img">
        <img :src="data.feed.img"/>
      </div>
      <div class="color-444 font-16 margin-10-0-0 mui-ellipsis-2">{{data.feed.title}}<span class="color-b4b4b6 font-12">-{{data.feed.domain}}</span></div>
    </div>
  </div>
</template>

<script type="text/javascript">
  export default {
    data() {
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
    created() {},
    watch: {},
    mounted() {

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
