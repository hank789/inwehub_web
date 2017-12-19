<template>
  <div class="commentWrapper" id="commentWrapper" v-show="showTextarea">
    <div class="textareaWrapper">
        <textarea v-on:keydown.enter="sendMessage" @blur.stop.prevent="textareaBlur" @focus.stop.prevent="textareaFocus" @keydown="autoTextArea"
                  v-model="textarea" :placeholder="targetUsername?'回复' + targetUsername:'在此留言'" id="commentTextarea"
                  autocomplete="off"></textarea>
      <svg class="icon" aria-hidden="true" @tap.stop.prevent="sendMessage">
        <use xlink:href="#icon-fasong"></use>
      </svg>
    </div>
  </div>
</template>

<script>
  import { autoHeight } from '../../utils/textarea'
  import { softInput } from '../../utils/plus'

  const CommentTextarea = {
    data: () => ({
      showTextarea: false,
      textarea: '',
      targetUsername: ''
    }),
    props: {},
    mounted () {
      softInput()
    },
    methods: {
      autoTextArea (event) {
        autoHeight(event)
      },
      textareaFocus () {
        window.mui.waitingBlank()
        console.log('comment focus')
      },
      textareaBlur () {
        window.mui.closeWaitingBlank()
        console.log('comment blur')
        this.showTextarea = false
      },
      comment (targetUsername) {
        if (targetUsername === '') {
          this.showTextarea = !this.showTextarea
        } else {
          this.showTextarea = true
        }

        this.targetUsername = targetUsername

        if (this.showTextarea) {
          console.log('bind comment事件')
          window.document.addEventListener('tap', (e) => {
            console.log('document tap 事件被触发')
            // this.showTextarea = false
            document.getElementById('commentTextarea').blur()
          }, false)

          setTimeout(() => {
            document.getElementById('commentTextarea').focus()
          }, 500)
        } else {
          document.getElementById('commentTextarea').blur()
        }
      },
      finish () {
        this.textarea = ''
        this.showTextarea = false
        document.querySelector('#commentTextarea').style.height = '20px'
      },
      sendMessage (event) {
        event.preventDefault()
        event.stopPropagation()

        if (!this.textarea.trim()) {
          return false
        }

        this.$emit('sendMessage', this.textarea)

        document.getElementById('commentTextarea').blur()
      }
    }
  }
  export default CommentTextarea
</script>

<style scoped="scoped">
  .commentWrapper {
    background: #ececee;
    position: absolute;
    width: 100%;
    bottom: 0;
    left: 0;
    min-height: 45px;
    overflow: hidden;
    padding: 5px 15px;
    z-index: 10001;
  }

  .commentWrapper .textareaWrapper {
    position: relative;
    background: #fff;
    border-radius: 5px;
    min-height: 35px;
  }

  .commentWrapper textarea {
    border: none;
    display: inline-block;
    width: 100%;
    height: 20px;
    margin: 6px 0 0;
    padding: 0 31px 0 5px;
    font-size: 14px;

  }

  .commentWrapper textarea::placeholder {
    color: #c8c8c8;
  }

  .commentWrapper .icon {
    position: absolute;
    right: 5px;
    color: #03aef9;
    font-size: 26px;
    bottom: 5px;
  }

  .commentShadowWrapper{
    display: none;
    position: absolute;
    left:0;
    width:100%;
    bottom:0;
  }
</style>
