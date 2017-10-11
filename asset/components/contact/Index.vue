<template>
    <div class="index-bar-container">
        <slot name="header"></slot>
        <div class="index-bar-main">
            <div class="index-bar-content">
                <slot></slot>
                <div class="groupWrapper">
                    <ul v-for="(list, key) in data" class="index-bar-group">
                        <li :id="key" class="index-bar-cell index-bar-cell-head">{{key}}</li>
                        <li v-for="(item, index) in list" :key="index" @tap="chooseItem" :data-raw="item.raw"
                            class="index-bar-cell tap-active">
                            {{item.raw}}

                    </li>
                    </ul>
                </div>

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
    let chars = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z']
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
                        return item.raw.indexOf(search) > -1 || item.camel.indexOf(search.toUpperCase()) > -1 || item.full.toUpperCase().indexOf(search.toUpperCase()) > -1
                    })
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
                    return pinyin.getFullCamelChars(item)
                })
                arr.forEach((item) => {
                    this.sort(map, item)
                })
                for (var key in map) {
                    if (map[key].length === 0) {
                        delete map[key]
                    }
                }
                return map
            }
        },
        methods: {
            sort (map, item) {
                var initial = item.camel[0]
                var arr = map[initial]
                var len = arr.length
                var i = len - 1
                if (len === 0) {
                    return arr.push(item)
                }
                if (item.full < arr[0].full) {
                    return arr.unshift(item)
                }
                for (; i >= 0; i--) {
                    if (arr[i].full <= item.full) {
                        arr.splice(i + 1, 0, item)
                        break
                    }
                }
            },
            chooseIndex (e) {
                var oPos = e.target.offsetTop;
                document.getElementsByClassName('index-bar-content')[0].scrollTo(0, oPos);
            },
            chooseItem (e) {
                var raw = e.target.getAttribute('data-raw')
                this.$emit('click', raw)
            }
        }
    }
</script>
<style scoped>
    .index-bar-container {
        position: fixed;
        z-index: 10;
        left: 0;
        right: 0;
        height: 100%;
        width: 100%;
        display: -webkit-box;
        display: -webkit-flex;
        display: flex;
        -webkit-box-orient: vertical;
        box-orient: vertical;
        -webkit-flex-direction: column;
        flex-direction: column;
    }

    .index-bar-container .index-bar-head {
        background: #ffffff;
        width: 100%;
    }

    .index-bar-container .index-bar-main {
        -webkit-box-flex: 1;
        box-flex: 1;
        -webkit-box-sizing: border-box;
        box-sizing: border-box;
        height: 1%;
        -webkit-flex: 1;
        flex: 1;
        position: relative;
    }

    .index-bar-container .index-bar-main .index-bar-content {
        height: 100%;
        overflow-y: auto;
    }

    .index-bar-container .index-bar-main .index-bar-content .index-bar-group {
        font-size: 0.75rem;
        padding: 0;
        margin: 0;
        color: #656565;
    }

    .index-bar-container .index-bar-main .index-bar-content .index-bar-group .index-bar-cell {
        padding-left: 0.8rem;
        color: #000000;
        height: 2.2rem;
        line-height: 2.2rem;
        background-color: #ffffff;
        border-bottom: 1px solid #f7f7f7;
    }

    .index-bar-container .index-bar-main .index-bar-content .index-bar-group .index-bar-cell.index-bar-cell-head {
        font-size: 0.7rem;
        height: 25px;
        line-height: 25px;
        padding-left: 0.8rem;
        background-color: #f5f5f5;
        margin-top: -1px;
    }

    .index-bar {
        position: absolute;
        right: 0;
        top: 35px;
        z-index: 1;
        height: 100%;
        width: 23px;
        font-family: 'Helvetica Neue', Helvetica, sans-serif;
        font-size: 10px;
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
        line-height:17px;
        font-size: 12px;
        text-align: center;
        display: inline-block;
    }

    .groupWrapper{
        background:#fff;
        padding-right:30px;
    }
</style>