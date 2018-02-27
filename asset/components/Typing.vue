<template>
    <span class="typing" :class="{ 'display-hidden': !typers.length }">
        <i class="text" v-if="typers.length === 1">
             正在输入
        </i>

        <i class="text" v-if="typers.length === 2">
            {{ typers[0] }} and {{ typers[1] }} 正在输入
        </i>

        <span class="dots">
            <span>.</span><span>.</span><span>.</span>
        </span>
    </span>
</template>


<script>
  export default {
    components: {},
    props: {
      room_id: ''
    },
    data () {
      return {
        typers: []
      }
    },

    created () {
      this.listen()
      this.$on('finished-typing', this.finishedTyping)
    },

    methods: {
      listen () {
        // we can't do presence channel or/and listen for private channels, if the user is a guest
        window.Echo.private('chat.room.' + this.room_id)
          .listenForWhisper('typing', (user) => {
            this.startedTyping(user.username)
          }).listenForWhisper('finished-typing', (user) => {
            this.finishedTyping(user.username)
          })
      },
      startedTyping (username) {
        let index = this.typers.indexOf(username)

        if (index === -1) {
          this.typers.push(username)
        }
      },

      finishedTyping (username) {
        let index = this.typers.indexOf(username)

        if (index !== -1) {
          this.typers.splice(index, 1)
        }
      }
    },
    watch: {
      'room_id' (newVal, oldVal) {
        if (newVal) {
          this.listen()
        }
      }
    }
  }
</script>


<style>
  @keyframes blink {
    0% {
      opacity: .2;
    }

    20% {
      opacity: 1;
    }

    100% {
      opacity: .2;
    }
  }

  .display-hidden {
    display: none;
  }

  .typing {
    margin-top: -0.693rem;
    color: #717577;
  }

  .typing a {
    color: #717577;
    font-weight: bold;
  }

  .typing a:hover,
  .typing a:focus {
    text-decoration: underline;
  }

  .dots {
    font-size: 0.8rem;
  }

  .typing span {
    animation-name: blink;
    animation-duration: 1.4s;
    animation-iteration-count: infinite;
    animation-fill-mode: both;
  }

  .typing span:nth-child(2) {
    animation-delay: .2s;
  }

  .typing span:nth-child(3) {
    animation-delay: .4s;
  }

  .typing .text {
    font-size: 0.32rem;
  }
</style>
