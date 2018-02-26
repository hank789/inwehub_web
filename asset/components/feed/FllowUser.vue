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
    margin-left: -1.1rem !important;
    margin-top: -1rem !important;
    font-size: 2.1rem !important;
    z-index: 9 !important;
    color: #dcdcdc !important;
    background-color: #fff;
  }

  .middle-width {
    width: 11.3rem;
  }

  .left{
    max-width:40%;
  }

  .right{
    max-width:40%;
  }

  .left .avatar{
    width:4.4rem;
    height:4.4rem;
  }

  .right .avatar{
    width:4.4rem;
    height:4.4rem;
  }

  .container-avatarAndText{
    height:4.4rem;
    line-height: 4.4rem;
    margin-bottom:0 !important;
  }

  .middle-width{
    height:4.4rem;
  }

  .middle-width .component-follow{
    height:4.4rem;
  }
</style>
