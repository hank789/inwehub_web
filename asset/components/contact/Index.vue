<template>
  <div class="index-bar-container">
    <slot name="header"></slot>
    <div class="index-bar-main">
      <div class="index-bar-content">
        <slot></slot>
      </div>
      <div class="index-bar" @tap="chooseIndex">
        <ul class="index-bar-list">
          <li v-for="char in chars" class="index-bar-item">{{char}}</li>
        </ul>
      </div>
    </div>
  </div>
</template>
<script type="text/babel">
  let pinyin = require('./pinyin')
  let chars = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', '#']
  export default{
    props: {
      list: {
        type: Array,
        required: true
      },
      search: String
    },
    data () {
      return {
        // map: {},
        chars: chars
      }
    },
    computed: {
      data () {
        if (!this.search) {
          return this.map
        }
        // 搜索,支持汉字,拼音,拼音首字母
        // let search = pinyin.getFullCamelChars(this.search)
        let search = this.search
        let map = {}
        let tmp = []

        for (let key in this.map) {
          tmp = this.map[key].filter(function (item) {
            return item.pinyin.raw.indexOf(search) > -1 || item.pinyin.camel.indexOf(search.toUpperCase()) > -1 || item.pinyin.full.toUpperCase().indexOf(search.toUpperCase()) > -1
          })
          if (!tmp) {
            console.log('key not found:' + key)
          }
          if (tmp.length) {
            map[key] = tmp
          }
        }
        return map
      },
      map () {
        // 数据映射
        let map = {}
        chars.forEach((c) => {
          map[c] = []
        })

        let arr = this.list.map(function (item) {
          if (!item.name) {
            console.log('name is empty:' + JSON.stringify(item))
          }
          item.pinyin = pinyin.getFullCamelChars(item.name)
          return item
        })

        arr.forEach((item) => {
          this.sort(map, item)
        })

        for (var key in map) {
          if (!map[key]) {
            console.log('key not found2:' + key)
          }
          if (map[key].length === 0) {
            delete map[key]
          }
        }

        return map
      }
    },
    methods: {
      sort (map, item) {
        var initial = item.pinyin.camel[0]

        var arr = map[initial]
        if (!arr) {
          console.log('key not found3:' + JSON.stringify(item))
        }
        var len = arr.length
        var i = len - 1
        if (len === 0) {
          return arr.push(item)
        }
        if (item.pinyin.full < arr[0].pinyin.full) {
          return arr.unshift(item)
        }
        for (; i >= 0; i--) {
          if (arr[i].pinyin.full <= item.pinyin.full) {
            arr.splice(i + 1, 0, item)
            break
          }
        }
      },
      chooseIndex (e) {
        var innerHTML = e.target.innerHTML
        var target = document.getElementById(innerHTML)
        if (target) {
          var oPos = target.offsetTop
          console.log(oPos)
          var obj = document.querySelector('.mui-content')
          if (obj.scrollTo) {
            obj.scrollTo(0, oPos - 40)
          } else {
            obj.scrollTop = oPos - 40
          }
        }
      }
    },
    watch: {
      data: function (newValue) {
        this.$emit('input', newValue)
      }
    }
  }
</script>
<style scoped>
  .index-bar-container {

  }

  .index-bar-container .index-bar-main {
    position: relative;
  }

  .index-bar-container .index-bar-main .index-bar-content .index-bar-group {
    padding: 0;
    margin: 0;
    color: #656565;
  }

  .index-bar-container .index-bar-main .index-bar-content .index-bar-group .index-bar-cell {
    padding-left: 0.4rem;
    color: #000000;
    position: relative;
    background-color: #ffffff;
  }

  .index-bar-container .index-bar-main .index-bar-content .index-bar-group .index-bar-cell.index-bar-cell-head {
    font-size: 0.346rem;
    height: 0.666rem;
    line-height: 0.666rem;
    padding-left: 0.4rem;
    background-color: #f5f5f5;
  }

  .index-bar {
    position: fixed;
    right: 0;
    bottom: 1.253rem;
    z-index: 12;
    width: 0.613rem;
    font-family: 'Helvetica Neue', Helvetica, sans-serif;
    font-size: 0.266rem;
    color: #316ccb;
  }

  .index-bar .index-bar-list {

    display: -webkit-box;
    display: -webkit-flex;
    display: flex;
    -webkit-box-orient: vertical;
    box-orient: vertical;
    -webkit-flex-direction: column;
    flex-direction: column;
    list-style: none;
    height: 100%;
    padding: 0;
    width: 100%;
  }

  .index-bar .index-bar-item {
    color: #444;
    line-height: 0.453rem;
    font-size: 0.32rem;
    text-align: center;
    display: inline-block;
  }

  @media screen and (max-width: 370px) {
    .index-bar .index-bar-item {
      line-height: 0.373rem;
    }
  }

  .groupWrapper {
    background: #fff;
    overflow-y: scroll;
  }

  .bottomBorder:after {
    right: 0;
  }

  .groupWrapper:last-child:after {
    display: none;
  }

  .avatar {
    z-index: 0;
    color: #ffffff;
    background-color: #bdbdbd;
    display: inline-block;
    height: 1.173rem;
    width: 1.173rem;
    font-size: 0.533rem;
    text-align: center;
    border-radius: 50%;
  }

  .avatar .avatarInner {
    position: relative;
    display: -webkit-box;
    display: -webkit-flex;
    display: -ms-flexbox;
    display: flex;
    width: 100%;
    height: 100%;
    -webkit-box-align: center;
    -webkit-align-items: center;
    -ms-flex-align: center;
    align-items: center;
    -webkit-box-pack: center;
    -webkit-justify-content: center;
    -ms-flex-pack: center;
    justify-content: center;
  }

  .avatar img {
    border-radius: 50%;
    width: 100%;
    height: 100%;
    display: block;
  }

  .avatarInner .icon {
    position: absolute;
    right: -0.16rem;
    bottom: -0.026rem;
    font-size: 0.64rem;
    color: #03aef9;
  }

  .tap-active {
    font-size: 0.373rem;
    padding: 0.266rem 0 0.106rem;
  }

  .textBody {
    position: absolute;
    top: 0.32rem;
    right: 1.813rem;
    left: 1.813rem;
    vertical-align: top;
    color: #565656;
  }

  .textBody .desc {
    color: #b4b4b6;
  }

  .ibutton {
    float: right;
    border-radius: 1.333rem;
    width: 1.64rem;
    height: 0.72rem;
    text-align: center;
    line-height: 0.72rem;
    position: relative;
    top: 0.266rem;
    margin-right: 0.133rem;
    background: #03aef9;
    color: #fff;
  }

  .ibutton.active {
    background: #dcdcdc;
    color: #b4b4b6;
  }
  .index-bar-content{
    padding-right:0.8rem;
  }

</style>
