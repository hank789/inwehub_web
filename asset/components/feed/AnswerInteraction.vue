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
    <div class="text-16-444 mui-ellipsis">{{data.feed.title}}</div>
    <div class="text-14-808080 mui-ellipsis-2 margin-10-0-0">{{data.feed.content}}</div>
    <!--点赞 关注问题-->
    <div class="options text-right">
      <div class="component-followed-question">关注问题{{data.feed.follow_question_num}}</div>
      <div class="component-iconNumber iconPenglunWrapper">
        <svg class="icon" aria-hidden="true">
          <use xlink:href="#icon-pinglun1"></use>
        </svg><span>{{data.feed.comment_number}}</span>
      </div>
      <div class="component-iconNumber">
        <svg class="icon" aria-hidden="true">
          <use xlink:href="#icon-dianzan1"></use>
        </svg><span>{{data.feed.support_number}}</span>
      </div>
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
