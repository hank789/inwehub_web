<template>
  <div class="messageWrapper">
    <div class="message slideDown" v-for="(message, index) in messages" :id="'message_' + index"
         @click.stop.prevent="onTap(message, index)">
      {{ message.text }}

    </div>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        messages: [],
      }
    },
    methods: {
      close(index){
        var elem = document.getElementById('message_' + index);
        elem.classList.remove('slideDown');
        elem.classList.add('slideUp');
        setTimeout(() => {
          this.messages.splice(index, 1);
        }, 1500);
      },
      onTap(message, index){
        message.callback();
        this.close(index);
      },
      show(message, callback){
        this.messages.push({
          text: message,
          callback: callback
        });

        this.$nextTick(() => {

          var messages = document.getElementsByClassName('message');

          mui.each(messages, (index, elem) => {
            var startX, startY, moveX, moveY;

            elem.addEventListener("touchstart", (e) => {
              e.stopPropagation();

              var touch = e.touches[0];
              startX = touch.pageX;
              startY = touch.pageY;
            });

            elem.addEventListener("touchmove", (e) => {
              e.stopPropagation();
              e.preventDefault();

              var touch = e.touches[0];
              moveX = touch.pageX - startX;
              moveY = touch.pageY - startY;

              if (moveY < 0) {
                elem.style.top = moveY + 'px';
              }
            });

            elem.addEventListener("touchend", (e) => {
              e.stopPropagation();

              if (moveY < -10) {
                this.close(index);
              }
            });


          });
        });
      },
    }
  }
</script>

<style scoped>
  .messageWrapper {
    position: fixed;
    top: 0;
    width: 100%;
    z-index: 999;
  }

  .message {
    position: fixed;
    top: 0;
    width: 100%;
    background: #444;
    color: #fff;
    padding: 20px;
    z-index: 999;
    font-size: 13px;
  }

  .message:after {
    bottom: 10px;
    border-radius: 1px;
    left: 50%;
    margin-left: -17px;
    position: absolute;
    content: ' ';
    width: 34px;
    height: 2px;
    background: #d8d8d8;
  }

  @-webkit-keyframes slideUp {
    0% {
      -webkit-transform: translate3d(0, 0, 0);
      transform: translate3d(0, 0, 0);
    }

    100% {
      visibility: hidden;
      -webkit-transform: translate3d(0, -100%, 0);
      transform: translate3d(0, -100%, 0);
    }
  }

  @keyframes slideUp {
    0% {
      -webkit-transform: translate3d(0, 0, 0);
      transform: translate3d(0, 0, 0);
    }

    100% {
      visibility: hidden;
      -webkit-transform: translate3d(0, -100%, 0);
      transform: translate3d(0, -100%, 0);
    }
  }

  .slideUp {
    -webkit-animation-name: slideUp;
    animation-name: slideUp;
    -webkit-animation-duration: 1s;
    animation-duration: 1s;
    -webkit-animation-fill-mode: both;
    animation-fill-mode: both;
  }

  @-webkit-keyframes slideDown {
    0% {
      -webkit-transform: translate3d(0, -100%, 0);
      transform: translate3d(0, -100%, 0);
      visibility: visible;
    }

    100% {
      -webkit-transform: translate3d(0, 0, 0);
      transform: translate3d(0, 0, 0);
    }
  }

  @keyframes slideDown {
    0% {
      -webkit-transform: translate3d(0, -100%, 0);
      transform: translate3d(0, -100%, 0);
      visibility: visible;
    }

    100% {
      -webkit-transform: translate3d(0, 0, 0);
      transform: translate3d(0, 0, 0);
    }
  }

  .slideDown {
    -webkit-animation-name: slideDown;
    animation-name: slideDown;
    -webkit-animation-duration: 1s;
    animation-duration: 1s;
    -webkit-animation-fill-mode: both;
    animation-fill-mode: both;
  }
</style>
