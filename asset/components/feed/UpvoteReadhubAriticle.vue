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
        <div class="mui-media-body freeQuestion-content">{{data.title}}</div>
        <div class="freeQuestion-time">
          <timeago :since="timeago(data.created_at)">
          </timeago>
        </div>
      </div>
    </div>
    <div class="container-answer">
      <div class="container-image margin-0-0-10" v-if="data.feed.img">
        <img :src="data.feed.img"/>
      </div>
      <div class="color-444 font-16 mui-ellipsis-2">{{data.feed.title}}<span class="color-b4b4b6 font-12"
                                                                                           v-if="data.feed.domain"> - {{data.feed.domain}}</span>
      </div>
      <div class="color-808080 font-13">发布者：{{data.feed.submission_username}}</div>
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
      // 时间处理；
      timeago (time) {
        let newDate = new Date()
        newDate.setTime(Date.parse(time.replace(/-/g, '/')))
        return newDate
      },
      toResume (uuid) {
        if (!uuid) {
          return false
        }
        this.$router.pushPlus('/share/resume?id=' + uuid + '&goback=1' + '&time=' + (new Date().getTime()))
      }
    }
  }
</script>
