<template>
  <div>
    <div class="mui-content">
      <div class="button-wrapper">
        <button type="button" class="mui-btn mui-btn-block mui-btn-primary" @tap.stop.prevent="$router.push('/ask')">提问</button>
      </div>
    </div>
  </div>
</template>


<style scoped>
  .button-wrapper{
    margin:10px;
  }

</style>
