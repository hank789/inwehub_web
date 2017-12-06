<template>
  <div class="container-item">
    <div class="color-808080 font-13">{{data.title}}</div>
    <div class="flex margin-5-0-0 mui-ellipsis">
      <div class="left">
        <div class="container-avatarAndText">
          <div class="author">
            <div class="avatar" @tap.stop.prevent="toResume(data.user.uuid)">
              <div class="avatarInner"><Avatar :avatar="data.user.avatar"></Avatar>
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
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-jia"></use>
          </svg>
        </div>
      </div>
      <div class="right">
        <div class="container-avatarAndText">
          <div class="author">
            <div class="avatar" @tap.stop.prevent="toResume(data.feed.follow_user_uuid)">
              <div class="avatarInner"><Avatar :avatar="data.feed.follow_user_avatar"></Avatar>
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

<style scoped>
  .component-follow .icon {
    margin-left: -11px !important;
    margin-top: -10px !important;
    font-size: 21px !important;
    z-index: 9 !important;
    color: #dcdcdc !important;
    background-color: #fff;
  }

  .middle-width {
    width: 113px;
  }

  .left{
    max-width:40%;
  }

  .right{
    max-width:40%;
  }

  .left .avatar{
    width:44px;
    height:44px;
  }

  .right .avatar{
    width:44px;
    height:44px;
  }

  .container-avatarAndText{
    height:44px;
    line-height: 44px;
    margin-bottom:0 !important;
  }

  .middle-width{
    height:44px;
  }

  .middle-width .component-follow{
    height:44px;
  }
</style>
