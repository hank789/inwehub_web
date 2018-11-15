<template>
  <div id="dropDownMenuWrapper" class="immersed-top shareWrapper mui-popover mui-popover-top">
    <slot name="dropDownMenuHeader"></slot>
    <div class="container-select">
      <div class="select-top">
        <div class="type" @tap.stop.prevent="show">
          <span>选择类型</span>
          <div class="jianTou">
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-xiangshangjiantou"></use>
            </svg>
          </div>
        </div>
      </div>
      <div class="mui-scroll-wrapper dropDownScrollWrapper">
        <div class="mui-scroll">
          <div class="listWrapper">
            <div class="list" v-for="(item, index) in tree" :key="index">
              <div class="text ListTitle" @tap.capture="selectItem($event, item)">
                <span>{{item.name}} {{parseInt(item.children_count) > 0 ? '(' + item.children_count + ')' : '' }}</span>
                <svg class="icon" aria-hidden="true">
                  <use xlink:href="#icon-xiangshangjiantou"></use>
                </svg>
              </div>

              <DropDownMenuChild
                v-if="item.children.length"
                :tree="item"
                @selectItem="selectItem"
              ></DropDownMenuChild>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import DropDownMenuChild from '../../components/select/DropDownMenuChild.vue'

  export default {
    data () {
      return {}
    },
    components: {
      DropDownMenuChild
    },
    props: {
      tree: {
        type: Array,
        default: function () {
          return []
        }
      }
    },
    mounted () {
      setTimeout(() => {
        window.mui('.dropDownScrollWrapper').scroll({
          scrollY: true,
          scrollX: false,
          indicators: true,
          bounce: false
        })
      }, 100)
    },
    methods: {
      selectItem (event, item) {
        var curEle = event.target
        if (curEle.tagName === 'SPAN') {
          curEle = curEle.parentElement
        }

        var status = curEle.classList.contains('active')
//        window.mui.each(curEle.parentElement.parentElement.children, function (index, children) {
//          var listTitle = children.querySelector('.ListTitle')
//          if (listTitle) {
//            listTitle.classList.remove('active')
//          }
//          var listChildren = children.querySelector('.listChildren')
//          if (listChildren) {
//            listChildren.classList.remove('active')
//          }
//        })

        if (!status) {
          curEle.classList.add('active')

          if (curEle.nextElementSibling) {
            curEle.nextElementSibling.classList.add('active')
          } else {
            window.mui('#dropDownMenuWrapper').popover('toggle')
            setTimeout(() => {
              this.$emit('input', {id: item.id, name: item.name})
            }, 100)
          }

//          if (curEle && curEle.offsetTop) {
//            document.querySelector('.dropDownScrollWrapper > .mui-scroll').style.transform = 'translate3d(0rem, -' + curEle.offsetTop + 'px, 0rem) translateZ(0rem)'
//          }
        } else {
          curEle.classList.remove('active')
          if (curEle.nextElementSibling) {
            curEle.nextElementSibling.classList.remove('active')
          }
        }

        setTimeout(() => {
          this.autoScrollWrapperHeight()
        }, 100)
      },
      autoScrollWrapperHeight () {
        var height = document.querySelector('.dropDownScrollWrapper > .mui-scroll').offsetHeight
        if (height > 400) {
          height = 400
        }

        document.querySelector('.dropDownScrollWrapper').style.height = height + 'px'
        document.querySelector('#dropDownMenuWrapper').style.height = height + 'px'
        document.querySelector('.container-select').style.height = height + 'px'
      },
      show () {
        window.mui('#dropDownMenuWrapper').popover('toggle')
        this.autoScrollWrapperHeight()
        var backdrop = document.querySelector('.mui-backdrop')
        if (backdrop) {
          var offsetTop = document.querySelector('#dropDownMenuWrapper').offsetTop
          document.querySelector('.mui-backdrop').style.top = offsetTop + 'px'
        }
      }
    }
  }
</script>

<style scoped="scoped" lang="less">
  .mui-scroll-wrapper {
    top: 0.906rem;
    margin-top: 0 !important;
    border-radius: 0 !important;
  }

  .container-select .listWrapper > .list {
    &:last-child {
      border-bottom-right-radius: 0.48rem;
      border-bottom-left-radius: 0.48rem;
      overflow: hidden;
    }
  }

  .container-select {
    position: absolute;
    width: 100%;

    .select-top {
      height: 0.906rem;
      font-size: 0.346rem;
      line-height: 0.906rem;
      padding: 0 0.426rem;
      display: flex;
      position: relative;
      z-index: 2;
      background: #ffffff;
      justify-content: space-between;
      box-shadow: 0rem 0.133rem 0.266rem 0rem #F9F9FB;
      .type {
        display: flex;
        color: #03AEF9;
        .icon {
          font-size: 0.186rem;
        }
        .jianTou {
          margin-left: 0.08rem;
          margin-top: -0.053rem;
        }
      }
    }
  }
  .mui-popover .mui-scroll-wrapper {
    overflow: hidden;
    border-bottom-right-radius: 0.48rem !important;
    border-bottom-left-radius: 0.48rem !important;
  }
  .dropDownMenuRoot .shareWrapper {
    border-bottom-right-radius: 0.48rem;
    border-bottom-left-radius: 0.48rem;
  }

  .showTagsHome {
    display: block !important;
  }



  #dropDownMenuWrapper {
    width:100%;
    bottom: auto !important;
    box-shadow: none !important;
  }

  .openAppH5 #dropDownMenuWrapper {
    top: 1.306rem;
    bottom: auto !important;
  }

  .dropDownMenuRoot {
    position: absolute;
    width: 100%;
  }
</style>

<style>
  .dropDownScrollWrapper  .list {
    background: #F9F9FB;
  }

  .dropDownScrollWrapper .list .listChildren {
    display: none;
  }

  .dropDownScrollWrapper .list .listChildren.active {
    display: block;
  }

  .dropDownScrollWrapper .list .text.active {
    color: #03AEF9;
    background: #F9F9FB;
  }

  .dropDownScrollWrapper .list .list .list {
    background: #F3F4F6;
  }

  .dropDownScrollWrapper .list .list .list .list {
    background: #ECECEE;
  }

  .dropDownScrollWrapper .list .list .list .active {
    background: #ECECEE;
  }

  .dropDownScrollWrapper .list .list .active {
    color: #03AEF9;
    background: #F3F4F6;
  }

  .dropDownScrollWrapper .list .text {
    color: #444444;
    font-size: 0.373rem;
    line-height: 0.906rem;
    display: flex;
    justify-content: space-between;
  }

  .dropDownScrollWrapper .list .text span {
    padding: 0 0.426rem;
  }

  .dropDownScrollWrapper .list .text.active .icon {
    display: block;
    color: #03AEF9;
  }

  .dropDownScrollWrapper .list .text .icon {
    font-size: 0.186rem;
    margin: 0.293rem 0.426rem 0;
    display: none;
  }
</style>
