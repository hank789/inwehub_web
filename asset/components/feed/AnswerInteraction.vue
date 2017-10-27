<template>
  <div class="container-item">
    <div class="container-avatarAndText">
      <div class="author">
        <div class="avatar">
          <div class="avatarInner"><img :src="data.user.avatar">
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-zhuanjiabiaojishixin"></use>
            </svg>
          </div>
        </div>
        <div class="mui-media-body">{{data.title}}</div>
      </div>
    </div>
    <div class="text-16-444 mui-ellipsis">敢在抢在iPhone8发布之前登场, 究竟是谁给了小</div>
    <div class="text-14-808080 mui-ellipsis-2 margin-10-0-0">发布会一上来，雷军就说小米终于回到全球出货量前五名了！排在三星、苹果、华为和OPPO后面，估计是因</div>
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

    }
  };
</script>
