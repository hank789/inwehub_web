<template>
  <div class="container-item">
    <div class="color-808080 font-13">{{data.title}}</div>
    <div class="flex margin-5-0-0">
      <div class="left">
        <div class="container-avatarAndText">
          <div class="author">
            <div class="avatar" @tap.stop.prevent="toResume(data.user.uuid)">
              <div class="avatarInner"><img :src="data.user.avatar">
                <svg class="icon" aria-hidden="true" v-if="data.user.is_expert === 1">
                  <use xlink:href="#icon-zhuanjiabiaojishixin"></use>
                </svg>
              </div>
            </div>
            <div class="mui-media-body color-565656">{{data.user.name}}</div>
          </div>
        </div>
      </div>
      <div class="middle-width">
        <div class="component-follow">
          <svg class="icon" aria-hidden="true" style="display: none">
            <use xlink:href="#icon-plus-o"></use>
          </svg>
        </div>
      </div>
      <div class="right">
        <div class="container-avatarAndText">
          <div class="author">
            <div class="avatar" @tap.stop.prevent="toResume(data.feed.follow_user_uuid)">
              <div class="avatarInner"><img :src="data.feed.follow_user_avatar">
                <svg class="icon" aria-hidden="true" v-if="data.feed.follow_user_is_expert === 1">
                  <use xlink:href="#icon-zhuanjiabiaojishixin"></use>
                </svg>
              </div>
            </div>
            <div class="mui-media-body color-565656">{{data.feed.follow_user_name}}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script type="text/javascript">
  export default {
    data () {
      return {}
    },
    components: {},
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

<style>
  .component-follow .icon {
    margin-left: -11px !important;
    margin-top: -10px !important;
    font-size: 21px !important;
    z-index: 9 !important;
    color: #dcdcdc !important;
  }

  .middle-width {
    width: 68px;
  }
</style>
