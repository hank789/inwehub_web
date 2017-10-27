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

    }
  };
</script>
