<template>
<div class="mui-content">
  <html-panel :url="url"></html-panel>
</div>
</template>


<script>
  import HtmlPanel from '../../components/HtmlPanel.vue';
  import localEvent from '../../stores/localStorage';

  export default {
    data: () => ({
      loading:1,
      url: '',
      currentUser: {}
    }),
    created () {
      showInwehubWebview();
    },
    methods: {

    },
    components: {
      HtmlPanel
    },
    watch: {

    },
    mounted(){
      this.currentUser = localEvent.getLocalItem('UserInfo');
      this.url = process.env.READHUB_URL + '?uuid=' + this.currentUser.uuid;

    }
  }

</script>
