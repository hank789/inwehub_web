<template>
  <div>
    <div class="global-comment-shadow" :class="{active: isShow}"></div>
    <div class="global-comment-wrapper" :class="{active: isShow}">

      <div class="formWrapper">
        <form>
          <textarea :placeholder="placeholder" ref="alertTextarea" v-model="value"></textarea>
          <footer>
            <div class="btnCancel" @tap.stop.prevent="_cancel">取消</div>
            <div class="btnSubmit" @tap.stop.prevent="_submit">发送</div>
          </footer>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
  import localEvent from '../../stores/localStorage'

  const AlertCommentTextarea = {
    data: () => ({
      isShow: false,
      placeholder: '在此留言',
      value: '',
      submitCallback: null,
      cancelCallback: null,
      isCache: false,
      cacheId: ''
    }),
    methods: {
      _show (cancelCallback, submitCallback) {
        this.cancelCallback = cancelCallback
        this.submitCallback = submitCallback
        this.isShow = true
        this.$refs.alertTextarea.focus()
      },
      show (value, cancelCallback, submitCallback) {
        this.isCache = false
        this._show()
      },
      cacheShow (id, value, cancelCallback, submitCallback) {
        this.isCache = true
        this.cacheId = this.$route.name + '_' + id
        this.value = value
        var cache = localEvent.getLocalItem(this.cacheId)
        if (cache.value) {
          this.setValue(cache.value)
          localEvent.clearLocalItem(this.cacheId)
        }
        this._show(cancelCallback, submitCallback)
      },
      close () {
        this.isShow = false
      },
      _cancel () {
        if (this.isCache && this.value) {
          localEvent.setLocalItem(this.cacheId, {value: this.value})
        }

        if (this.cancelCallback) {
          this.cancelCallback(this.value)
        }
        this.close()
      },
      setPlaceholder (placeholder) {
        this.placeholder = placeholder
      },
      setValue (value) {
        this.value = value
      },
      _submit () {
        if (this.submitCallback) {
          var rs = this.submitCallback(this.value)
          if (rs) {
            this.value = ''
            this.close()
          }
        } else {
          this.close()
        }
      }
    }
  }
  export default AlertCommentTextarea
</script>


<style scoped="scoped">
  .global-comment-shadow{
    z-index:998;
    display: none;
    position: fixed;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
  }
  .global-comment-shadow.active{
    display: block;
  }

  .global-comment-wrapper{
    position: fixed;
    z-index:999;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    -webkit-align-items: center;
    -ms-flex-align: center;
    align-items: center;
    -webkit-justify-content: center;
    -ms-flex-pack: center;
    justify-content: center;
    -webkit-transform: translate(0, -120%);
    transform: translate(0, -120%);
    transition: all 0.6s cubic-bezier(0.25, 0.12, 0.21, 0.98);
  }

  .global-comment-wrapper.active{
    display:block;
    -webkit-transform: translate(0, 0%);
    transform: translate(0, 0%);
  }

  .global-comment-wrapper form{
    background: #FFF;
    padding:0.4rem;
    transition: all 0.6s;
  }
  .global-comment-wrapper textarea{
    background-color: #fff;
    width: 100%;
    height:2.506rem;
    resize: none;
    font-size:0.4rem;
    margin:0;
    padding:0;
    color:#000;
    line-height: 0.48rem;
    outline:none;
    border: none;
    -webkit-writing-mode: horizontal-tb !important;
  }


  .global-comment-wrapper footer{
    display: -webkit-flex;
    display: -ms-flexbox;
    display: flex;
    justify-content: flex-end;
  }

  .global-comment-wrapper footer .btnCancel{
    display: -webkit-inline-flex;
    display: -ms-inline-flexbox;
    display: inline-flex;
    cursor: pointer;
    color: #86939E;
    padding: 0.213rem 0.533rem;
    font-size:0.4rem;
    background: none;
    transition: all 0.6s;
    -webkit-tap-highlight-color: rgba(255, 255, 255, 0.4);
  }

  .global-comment-wrapper footer .btnSubmit{
    background-color: #3086F0;
    color: #FFF;
    display: -webkit-inline-flex;
    display: -ms-inline-flexbox;
    display: inline-flex;
    padding: 0.213rem 0.533rem;
    border-radius: 0.08rem;
    cursor: pointer;
    font-size:0.4rem;
  }
</style>
