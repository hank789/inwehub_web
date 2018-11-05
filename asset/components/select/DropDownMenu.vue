<template>
  <div>
    <div id="dropDownMenuWrapper" class="shareWrapper mui-popover mui-popover-action mui-popover-top">
      <div class="container-select">
        <div class="select-top">
          <div class="type" @tap.stop.prevent="show">
            <span>选择类型</span>
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-xiangshangjiantou"></use>
            </svg>
          </div>
          <div class="order">
            <span>排序</span>
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-paixu"></use>
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
        selectList: [
          {
            text: '产品'
          },
          {
            text: '服务'
          }
        ],
        showSelect: false,
        listChildren2: false
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
            this.$emit('input', {id: item.id, name: item.name})
            window.mui('#dropDownMenuWrapper').popover('toggle')
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
        setTimeout(() => {
          if (document.querySelector('.mui-backdrop')) {
            document.querySelector('.mui-backdrop').style.top = '93px'
          }
        }, 100)
      }
    }
  }
</script>

<style scoped="scoped" lang="less">
  .container-select > .list {
    &:last-child {
      border-bottom-right-radius: 18px;
      border-bottom-left-radius: 18px;
      overflow: hidden;
    }
  }

  .container-select {
    margin-top: 93px;
    .select-top {
      height: 34px;
      font-size: 13px;
      line-height: 34px;
      padding: 0 16px;
      display: flex;
      position: relative;
      z-index: 2;
      background: #ffffff;
      justify-content: space-between;
      box-shadow: 0px 5px 10px 0px #F9F9FB;
      .type {
        color: #03AEF9;
        .icon {
          font-size: 7px;
        }
      }
      .order {
        color: #808080;
        .icon {
          font-size: 10px;
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
    font-size: 14px;
    line-height: 34px;
    display: flex;
    justify-content: space-between;
  }

  .list .text span {
    padding: 0 16px;
  }

  .list .text .icon {
    font-size: 7px;
    margin: 11px 16px 0;
  }

  .mui-popover-top {
    top: 0;
    bottom: auto !important;
  }
</style>
