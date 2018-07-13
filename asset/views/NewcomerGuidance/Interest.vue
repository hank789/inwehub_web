<template>
  <div>
    <div style="background: #f3f4f6"></div>
    <div class="mui-content">
        <div class="invitation-title">
          <div class="next-step" @click="nextSubmit" v-if="!showSubmit">下一步</div>
          <div class="next-step" @click="sureSubmit" v-else>确定</div>
          <div class="invitation-text">
            <p>订阅您感兴趣的领域</p>
            <p>追踪行业新动态</p>
          </div>
        </div>
        <div class="container-list-group" v-if="!loading">
          <div class="interestList">
            <template v-for="(item, index) in list">
              <span class="interestGroup"
                :key="index"
                @tap.stop.prevent="interestList(item)"
                :class="{'active': item.checked}"
              >{{item.text}}</span>
            </template>
          </div>
        </div>
        <div class="right" @tap.stop.prevent="message">都不感兴趣？</div>
    </div>
    <!-- 弹窗 -->
    <div id="shareWrapper" class="shareWrapper mui-popover mui-popover-action mui-popover-bottom">
      <div class="title">
        <span @tap.stop.prevent="message">取消</span>
        留言
      </div>
      <!--<div class="line-river"></div>-->
      <div class="wraperBox">
        <div class="inputWrapper">
          <input type="text" placeholder="在这里告诉我们您希望看到的领域！" v-model="content">
        </div>
        <div class="refer" @tap.stop.prevent="submit()">提交</div>
      </div>
    </div>
  </div>
</template>
<script>
  import { postRequest } from '../../utils/request'
  import Vue from 'vue'
  export default {
    data: () => ({
      showPopup: false,
      list: [],
      selectInterest: [],
      loading: 1,
      content: '',
      title: '用户提交新领域',
      showSubmit: false
    }),
    computed: {
      selectTags () {
        var tags = []
        window.mui.each(this.list, function (index, item) {
          if (item.checked) {
            tags.push(item.value)
          }
        })
        return tags
      }
    },
    methods: {
      interestList (item) {
        Vue.set(item, 'checked', !item.checked)
      },
      message () {
        window.mui('#shareWrapper').popover('toggle')
        // this.showPopup = !this.showPopup
      },
      // 确定按钮
      sureSubmit () {
        postRequest('profile/updateRegionTag', {
          tags: this.selectTags
        }).then(response => {
          console.log(this.selectTags)
          var code = response.data.code
          if (code !== 1000) {
            window.mui.toast(response.data.message)
            return
          }

          if (this.$route.query.from === 'home') {
            this.$router.replace('/home')
          } else {
            this.$router.replace('/userGuide/stepone?from=' + this.$route.query.from)
          }
        })
      },
      // 下一步按钮
      nextSubmit () {
        this.sureSubmit()
      },
      // 提交新的标签
      submit () {
        postRequest('system/feedback', {
          title: this.title,
          content: this.content
        }).then(response => {
          var code = response.data.code
          if (code !== 1000) {
            window.mui.toast(response.data.message)
            return
          }
          window.mui.toast('提交成功')
          window.mui('#shareWrapper').popover('toggle')
        })
      },
      getData () {
        postRequest('tags/load', {
          tag_type: 6
        }).then(response => {
          var code = response.data.code
          if (code !== 1000) {
            window.mui.toast(response.data.message)
            return
          }
          var list = response.data.data.tags

          postRequest('profile/info', {}).then(response => {
            var tags = response.data.data.info.region_tags
            // console.log('tags', tags)
            for (var j in list) {
              // @todo item.checked 赋值
              list[j].checked = false

              for (var i in tags) {
                if (list[j].value === tags[i].value) {
                  list[j].checked = true
                  break
                }
              }
            }

            this.list = list

            this.loading = 0
          })
        })
      }
    },
    mounted () {
      this.getData()
      this.showSubmit = !!this.$route.query.from
    }
  }
</script>

<style lang="less" scoped>
  .mui-content {
    background: #FFFFFF;
    .right {
      float: right;
      font-size: 0.373rem;
      color: #03AEF9;
      padding: 0 0.426rem 0.8rem;
    }
  }

  /*订阅的头部*/
  .invitation-title {
    width: 100%;
    height: 3.52rem;
    background: #f3f4f6;
    padding: 0 0.453rem;
    text-align: center;
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    svg {
      color: #b4b4b6;
      font-size: 0.666rem;
      position: absolute;
      left: 0.453rem;
      top: 0.533rem;
    }
    .next-step {
      width: 2rem;
      height: 0.906rem;
      line-height: 0.853rem;
      border: 0.026rem solid #03aef9;
      border-radius: 1.333rem;
      font-size: 0.373rem;
      color: #03aef9;
      position: absolute;
      right: 0.453rem;
      top: 0.426rem;
    }
    .invitation-text {
      position: absolute;
      top: 1.573rem;
      left: 2.4rem;
      text-align: left;
      display: flex;
      flex-direction: column;
    }
    p {
      &:nth-of-type(1) {
        font-size: 0.373rem;
        color: #808080;
      }
      &:nth-of-type(2) {
        font-size: 0.533rem;
        color: #323232;
      }
    }
  }

  // 列表
  .interestList {
    padding: 0.4rem 0.426rem 0;
    .interestGroup {
      width: 4.426rem;
      padding: 0 0.266rem;
      height: 1.68rem;
      font-size: 0.4rem;
      color: #444444;
      line-height: 1.68rem;
      text-align: center;
      border-radius: 0.106rem;
      margin-bottom: 0.266rem;
      display: inline-block;
      background: #F7F8FA;
      &:nth-child(odd) {
        margin-right: 0.266rem;
      }
    }
    .active {
      color: #fff;
      background: #03AEF9;
    }
  }

  // 弹窗

  .shareWrapper {
    text-align: left;
    .title {
      background: #fff;
      text-align: center;
      font-size: 14px;
      padding: 0.32rem 0;
      position: relative;
      color: #808080;
      border-bottom: .02667rem solid #DCDCDC;
      span {
        position: absolute;
        left: 0.586rem;
        font-size: 16px;
      }
    }
    .wraperBox {
      background: #fff;
      padding-top: 0.4rem;
      padding-bottom: 0.8rem;
      .inputWrapper {
        text-align: center;
        margin-bottom: 0.8rem;
        input {
          width: 9.146rem;
          margin-bottom: 0;
          border-radius: 0.133rem;
          border: 0.026rem solid #DCDCDC;
          &::placeholder {
            font-size: 14px;
            color: #C8C8C8;
          }
        }
      }
      .refer {
        width: 9.146rem;
        height: 1.173rem;
        line-height: 1.173rem;
        text-align: center;
        font-size: 0.426rem;
        color: #ffffff;
        margin: 0 auto;
        background: #03AEF9;
        border-radius: 1.333rem;
      }
    }
  }
</style>

