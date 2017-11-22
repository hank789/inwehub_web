<template>
  <div class="container-item">
    <div class="container-avatarAndText" @tap.stop.prevent="toDetail(data.url)">
      <div class="author">
        <div class="avatar" @tap.stop.prevent="toResume(data.user.uuid)">
          <div class="avatarInner"><img :src="data.user.avatar">
            <svg class="icon" aria-hidden="true" v-if="data.user.is_expert === 1">
              <use xlink:href="#icon-zhuanjiabiaojishixin"></use>
            </svg>
          </div>
        </div>
        <div class="mui-media-body">{{data.title}}</div>
      </div>
    </div>
    <div class="text-16-444 text-line-5" @tap.stop.prevent="toDetail(data.url)">{{data.feed.title}}</div>

    <Images class="container-images-discover padding-0 margin-10-0-0" :images="data.feed.img" :group="data.id" v-if="data.feed.img.length > 0"></Images>

    <!--<div class="container-images container-images-discover padding-0 margin-10-0-0" v-if="data.feed.img.length > 0">-->
      <!--<div class="container-image"  v-for="(image, index) in data.feed.img">-->
        <!--<img :src="image"/>-->
      <!--</div>-->
    <!--</div>-->
    <div class="options text-right">
      <div class="component-iconNumber">
        <svg class="icon" aria-hidden="true">
          <use xlink:href="#icon-pinglun1"></use>
        </svg><span>{{data.feed.comment_number}}</span>
      </div>
      <div class="component-iconNumber" :class="{'active': data.feed.is_upvoted}">
        <svg class="icon" aria-hidden="true">
          <use xlink:href="#icon-dianzan1"></use>
        </svg><span>{{data.feed.support_number}}</span>
      </div>
    </div>
    <div class="container-answer margin-10-0-0" @tap.stop.prevent="toDetail(data.url)">
      <div class="component-dianzanList"><svg class="icon" aria-hidden="true">
          <use xlink:href="#icon-dianzan1"></use>
        </svg><span v-for="(item, index) in data.feed.supporter_list" @tap.stop.prevent="toResume(index)">{{item}}</span>等{{data.feed.support_number}}人
      </div>
      <div class="line-horizontal padding-5-0-5-0"></div>
      <div class="container-comments">
        <div class="comment text-line-5" v-for="(comment, index) in data.feed.comments"><span class="from" @tap.stop.prevent="toResume(comment.owner.uuid)">{{comment.owner.name}}</span>{{comment.content}}</div>
        <div class="more" @tap.stop.prevent="toDetail(data.url)">查看全部{{data.feed.comment_number}}条评论</div>
      </div>
    </div>
    <div class="component-address margin-5-0-0" v-show="data.feed.current_address_name" @tap.stop.prevent="toDetail(data.url)">
      <svg class="icon" aria-hidden="true">
        <use xlink:href="#icon-dingwei1"></use>
      </svg>{{data.feed.current_address_name}}
    </div>
  </div>
</template>

<script type="text/javascript">

  import Images from '../../components/image/Images.vue'

  export default {
    data () {
      return {}
    },
    components: {
      Images
    },
    props: {
      data: {
        type: Object,
        default: {}
      }
    },
    created () {
    },
    watch: {},
    mounted () {

    },
    methods: {
      toDetail (url) {
        this.$router.pushPlus(url, 'list-detail-page')
      },
      toResume (uuid) {
        if (!uuid) {
          return false
        }
        this.$router.pushPlus('/share/resume?id=' + uuid + '&goback=1' + '&time=' + (new Date().getTime()))
      }
    }
  }
</script>

