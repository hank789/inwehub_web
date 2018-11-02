<template>
  <div>
    <div id="dropDownMenuWrapper" class="shareWrapper mui-popover mui-popover-action mui-popover-top">
      <div class="container-select">
        <div class="select-top">
          <div class="type">
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

        <div class="list" v-for="(list, index) in selectList" :key="index">
          <div class="text ListTitle active">
            <span>产品（7）</span>
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-xiangshangjiantou"></use>
            </svg>
          </div>
          <div class="listChildren">
            <div class="list">
              <div class="text ListTitle">
                <span>全部</span>
                <svg class="icon" aria-hidden="true">
                  <use xlink:href="#icon-xiangshangjiantou"></use>
                </svg>
              </div>
            </div>
            <div class="list">
              <div class="text ListTitle">
                <span>产品1</span>
                <svg class="icon" aria-hidden="true">
                  <use xlink:href="#icon-xiangshangjiantou"></use>
                </svg>
              </div>
            </div>
            <div class="list">
              <div class="text ListTitle active">
                <span>产品2</span>
                <svg class="icon" aria-hidden="true">
                  <use xlink:href="#icon-xiangshangjiantou"></use>
                </svg>
              </div>
              <div class="listChildren">
                <div class="list">
                  <div class="text ListTitle">
                    <span>全部</span>
                    <svg class="icon" aria-hidden="true">
                      <use xlink:href="#icon-xiangshangjiantou"></use>
                    </svg>
                  </div>
                  <div class="listChildren"></div>
                </div>
                <div class="list">
                  <div class="text ListTitle">
                    <span>产品2-1</span>
                    <svg class="icon" aria-hidden="true">
                      <use xlink:href="#icon-xiangshangjiantou"></use>
                    </svg>
                  </div>
                  <div class="listChildren"></div>
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
          1,
          2
        ]
      }
    },
    components: {},
    props: {
      tree: {
        type: Object,
        default: function () {
          return {}
        }
      }
    },
    methods: {
      show () {
        window.mui('#dropDownMenuWrapper').popover('toggle')
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
    margin-top: 2.173rem;
    .select-top {
      height: 34px;
      font-size: 13px;
      line-height: 34px;
      padding: 0 16px;
      display: flex;
      position: relative;
      z-index: 2;
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

  .list {
    background: #F9F9FB;
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
</style>
