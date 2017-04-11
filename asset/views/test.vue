<template>
  <Button type="primary" @click="info">显示普通提醒</Button>
</template>
<script>
  export default {
    methods: {
      info () {
        this.$Message.info('密码重置成功', 2, () => {
        });
      }
    }
  }
</script>
