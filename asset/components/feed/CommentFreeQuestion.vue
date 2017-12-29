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
    <div class="text-14-444 text-line-2 textToLink" v-html="data.feed.comment_content"></div>
    <div class="container-answer margin-10-0-0">
      <div class="color-444 font-16 text-line-2">{{data.feed.question_title}}</div>
      <div class="color-808080 font-14 margin-5-0-0 text-line-3">{{data.feed.answer_content}}</div>
      <div class="color-808080 font-13">回答者：{{data.feed.answer_user_name}}</div>
    </div>
  </div>
</template>

<script type="text/javascript">

  import Avatar from '../../components/image/Avatar.vue'

  export default {
    data () {
      return {}
    },
    components: {
      Avatar
    },
    props: {
      data: {
        type: Object,
        default: {}
      }
    },
    created () {},
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
