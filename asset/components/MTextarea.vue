<template>

    <div class="textarea-wrapper">
      <textarea v-model.trim="description" :rows="rows" :placeholder="placeholder"></textarea>
      <span class="counter"><span>{{ descLength }}</span><span>/</span><span>{{ descMaxLength }}</span></span>
    </div>
</template>

<script type="text/javascript">
  export default {
    data: () => ({
      description:""
    }),
    props: {
      content:{
        type: String,
        default: ''
      },
      rows: {
        type: Number,
        default: 5
      },
      placeholder:{
        type: String,
        default: ''
      },
      descMaxLength:{
        type: Number,
        default: 5000
      }
    },
    mounted() {
      this.description = this.content;
    },
    watch: {
      'content'(newVal, oldVal) {
         this.description = newVal;
      },
      description: function (newDescription) {
        if (!newDescription) {
          this.$emit('input', this.description);
          return;
        }

        if (newDescription.length > this.descMaxLength) {
          this.description = this.description.slice(0, this.descMaxLength);
        }

        this.$emit('input', this.description);
      },
    },
    computed:{
      descLength() {
        if (this.description) {
          return this.description.length;
        } else {
          return 0;
        }
      }
    },
  }
</script>

<style scoped>
  .textarea-wrapper {
    margin: 0 5px;
    height: 100%;
    position: relative;
    border-radius: 5px;
    border: 1px solid #bbbbbb;
    background: #fff;
    padding-bottom: 20px;
  }

  .textarea-wrapper .counter {
    position: absolute;
    right: 4px;
    font-size: 12px;
    bottom: 0px;
    color: #b0b0b0;
  }

  .textarea-wrapper textarea {
    border: none;
    margin: 0;
    padding-bottom: 0;
  }
</style>
