<template>
    <div class="index-bar-container">
        <slot name="header"></slot>
        <div class="index-bar-main">
            <div class="index-bar-content">
                <slot></slot>
                <div class="groupWrapper">
                    <ul v-for="(list, key) in data" class="index-bar-group">
                        <li :id="key" class="index-bar-cell index-bar-cell-head">{{key}}</li>
                        <li v-for="(item, index) in list" :key="index" :data-raw="item.raw"
                            class="index-bar-cell tap-active" :class="{bottomBorder:index !== list.length-1  }">

                            <div class="avatar">
                                <div class="avatarInner" @tap.stop.prevent="">
                                    <img :src="item.user_avatar_url">

                                    <svg class="icon" aria-hidden="true" v-show="true">
                                        <use xlink:href="#icon-zhuanjiabiaojishixin"></use>
                                    </svg>
                                </div>
                            </div>

                            <div class="textBody">
                                {{item.user_name}}
                                <div class="desc">{{item.description}}</div>
                            </div>

                            <div class="ibutton" @tap.stop.prevent="chooseItem(item)">邀请</div>

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
                        return item.pinyin.raw.indexOf(search) > -1 || item.pinyin.camel.indexOf(search.toUpperCase()) > -1 || item.pinyin.full.toUpperCase().indexOf(search.toUpperCase()) > -1
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
                    item.pinyin =  pinyin.getFullCamelChars(item.user_name)
                    return item;
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
                var initial = item.pinyin.camel[0]

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
                var innerHTML = e.target.innerHTML;
                var target = document.getElementById(innerHTML);
                if (target) {
                    var oPos = target.offsetTop;
                    console.log(oPos);
                    document.getElementsByClassName('groupWrapper')[0].scrollTo(0, oPos - 12);
                }
            },
            chooseItem (item) {
                this.$emit('click', item)
            }
        }
    }
</script>
<style scoped>
    .index-bar-container {

    }

    .index-bar-container .index-bar-main {

    }

    .groupWrapper{
        overflow-y: auto;
        position: fixed;
        z-index: 10;
        top:149px;
        left: 0;
        right: 0;
        bottom:0;
        width: 100%;
    }



    .index-bar-container .index-bar-main .index-bar-content .index-bar-group {
        padding: 0;
        margin: 0;
        color: #656565;
    }

    .index-bar-container .index-bar-main .index-bar-content .index-bar-group .index-bar-cell {
        padding-left: 15px;
        color: #000000;

        background-color: #ffffff;
    }

    .index-bar-container .index-bar-main .index-bar-content .index-bar-group .index-bar-cell.index-bar-cell-head {
        font-size:13px;
        height: 25px;
        line-height: 25px;
        padding-left: 15px;
        background-color: #f5f5f5;
    }

    .index-bar {
        position: absolute;
        right: 0;
        top: 135px;
        z-index: 12;
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
        line-height: 17px;
        font-size: 12px;
        text-align: center;
        display: inline-block;
    }

    .groupWrapper {
        background: #fff;
        padding-right: 30px;
        overflow-y: scroll;
    }

    .bottomBorder:after{
        right:0;
    }

    .groupWrapper:last-child:after{
        display: none;
    }

    .avatar {
        z-index: 0;
        color: #ffffff;
        background-color: #bdbdbd;
        display: inline-block;
        height: 44px;
        width: 44px;
        font-size: 20px;
        text-align: center;
        border-radius: 50%;
    }

    .avatar .avatarInner {
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

    .tap-active{
        font-size:14px;
        padding:10px 0 4px;
    }

    .textBody{
        display: inline-block;
        vertical-align: top;
        color:#565656;
    }
    .textBody .desc{
        color:#b4b4b6;
    }

    .ibutton{
        float:right;
        color:#03aef9;
        border-radius:50px;
        border:1px solid #03aef9;
        padding:0 15px;
        position: relative;
        top:10px;
        margin-right:5px;
    }
</style>
