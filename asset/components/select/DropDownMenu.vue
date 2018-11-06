<template>
  <div class="immersed-top dropDownMenuRoot">
    <div id="dropDownMenuWrapper" class="shareWrapper mui-popover mui-popover-action mui-popover-top">
      <div class="container-select">
        <div class="select-top">
          <div class="type" @tap.stop.prevent="show">
            <span>选择类型</span>
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-xiangshangjiantou"></use>
            </svg>
          </div>
        </div>
        <div class="listWrapper">
          <div class="list" v-for="(item, index) in tree" :key="index">
            <div class="text ListTitle" @tap.capture="selectItem($event, item)">
              <span>{{item.name}}（{{item.children_count}}）</span>
              <svg class="icon" aria-hidden="true">
                <use xlink:href="#icon-xiangshangjiantou"></use>
              </svg>
            </div>
            <div class="listChildren" v-if="item.children.length">
              <div class="list">
                <div class="text ListTitle" @tap.capture="selectItem($event, item)">
                  <span>全部</span>
                  <svg class="icon" aria-hidden="true">
                    <use xlink:href="#icon-xiangshangjiantou"></use>
                  </svg>
                </div>
              </div>
              <div class="list" v-for="(itemTwo, itemTwoindex) in item.children" :key="'itemtwo_' + itemTwoindex">
                <div class="text ListTitle" @tap.capture="selectItem($event, itemTwo)">
                  <span>{{ itemTwo.name }}（{{itemTwo.children_count}}）</span>
                  <svg class="icon" aria-hidden="true">
                    <use xlink:href="#icon-xiangshangjiantou"></use>
                  </svg>
                </div>
                <div class="listChildren" v-if="itemTwo.children.length">
                  <div class="list">
                    <div class="text ListTitle" @tap.capture="selectItem($event, itemTwo)">
                      <span>全部</span>
                      <svg class="icon" aria-hidden="true">
                        <use xlink:href="#icon-xiangshangjiantou"></use>
                      </svg>
                    </div>
                  </div>
                  <div class="list" v-for="(itemThree, itemThreeindex) in itemTwo.children"
                       :key="'itemthree_' + itemThreeindex">
                    <div class="text ListTitle" @tap.capture="selectItem($event, itemThree)">
                      <span>{{ itemThree.name }}（{{itemThree.children_count}}）</span>
                      <svg class="icon" aria-hidden="true">
                        <use xlink:href="#icon-xiangshangjiantou"></use>
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    data () {
      return {
      }
    },
    components: {},
    props: {
      tree: {
        type: Array,
        default: function () {
          return []
        }
      }
    },
    methods: {
      selectItem (event, item) {
        var curEle = event.target
        if (curEle.tagName === 'SPAN') {
          curEle = curEle.parentElement
        }

        var status = curEle.classList.contains('active')
        window.mui.each(curEle.parentElement.parentElement.children, function (index, children) {
          var listTitle = children.querySelector('.ListTitle')
          if (listTitle) {
            listTitle.classList.remove('active')
          }
          var listChildren = children.querySelector('.listChildren')
          if (listChildren) {
            listChildren.classList.remove('active')
          }
        })

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
        } else {
          curEle.classList.remove('active')
          if (curEle.nextElementSibling) {
            curEle.nextElementSibling.classList.remove('active')
          }
        }
      },
      show () {
        window.mui('#dropDownMenuWrapper').popover('toggle')

        if (document.querySelector('.mui-backdrop')) {
          var topHeight = 0
          var logoAndTabs = document.querySelector('.container-control-logoAndTabsAndSearch')
          if (logoAndTabs) {
            topHeight += logoAndTabs.offsetHeight + 5
          }
          var openAppHeight = 0
          var openAppSlider = document.querySelector('#OpenAppSlider')
          if (openAppSlider) {
            openAppHeight += openAppSlider.offsetHeight
          }

          var muiBarHeight = 0
          var muiBar = document.querySelector('.mui-bar-nav')
          if (muiBar) {
            muiBarHeight += muiBar.offsetHeight
          }

          document.querySelector('.mui-backdrop').style.top = (muiBarHeight + topHeight + openAppHeight + window.immersedHeight) + 'px'
        }
      }
    }
  }
</script>

<style scoped="scoped" lang="less">
  .listWrapper{
    max-height:300px;
    overflow: scroll;
  }
  .container-select .listWrapper > .list {
    &:last-child {
      border-bottom-right-radius: 0.48rem;
      border-bottom-left-radius: 0.48rem;
      overflow: hidden;
    }
  }

  .container-select {
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
        color: #03AEF9;
        .icon {
          font-size: 0.186rem;
        }
      }
    }
  }
</style>
<style scoped="scoped">

  .showTagsHome {
    display: block !important;
  }

  .list {
    background: #F9F9FB;
  }

  .list .listChildren {
    display: none;
  }

  .list .listChildren.active {
    display: block;
  }

  .list .text.active {
    color: #03AEF9;
    background: #F9F9FB;
  }

  .list .list .list {
    background: #F3F4F6;
  }

  .list .list .list .list {
    background: #ECECEE;
  }

  .list .list .list .active {
    background: #ECECEE;
  }

  .list .list .active {
    color: #03AEF9;
    background: #F3F4F6;
  }

  .list .text {
    color: #444444;
    font-size: 0.373rem;
    line-height: 0.906rem;
    display: flex;
    justify-content: space-between;
  }

  .list .text span {
    padding: 0 0.426rem;
  }

  .list .text.active .icon {
    display: block;
    color: #03AEF9;
  }
  .list .text .icon {
    font-size: 0.186rem;
    margin: 0.293rem 0.426rem 0;
    display: none;
  }

  .mui-popover-top {
    top: 1.173rem;
    bottom: auto !important;
  }

  .openAppH5 .mui-popover-top {
    top: 2.479rem;
    bottom: auto !important;
  }

  .dropDownMenuRoot{
    position: absolute;
    width:100%;
  }
</style>
