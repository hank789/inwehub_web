<template>
    <div class="container-item">
        <div class="color-808080 font-13">{{data.title}}</div>
        <div class="flex space-between margin-5-0-0">
          <div class="left">
            <div class="container-avatarAndText">
              <div class="author">
                <div class="avatar">
                  <div class="avatarInner"><img :src="data.avatar">
                    <svg class="icon" aria-hidden="true" v-if="data.user.is_expert === 1">
                      <use xlink:href="#icon-zhuanjiabiaojishixin"></use>
                    </svg>
                  </div>
                </div>
                <div class="mui-media-body color-565656">{{data.user.name}}</div>
              </div>
            </div>
          </div>
          <div class="middle grow-2">
            <div class="component-follow">
              <div class="circle">
                <svg class="icon" aria-hidden="true" >
                  <use xlink:href="#icon-plus--"></use>
                </svg>
              </div>
            </div>
          </div>
          <div class="right">
            <div class="container-avatarAndText">
              <div class="author">
                <div class="avatar">
                  <div class="avatarInner"><img :src="data.avatar.follow_user_avatar">
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

    }
  };
</script>