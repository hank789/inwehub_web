<template>
  <div class="dianPingProductAdd">
    <header class="mui-bar mui-bar-nav">
      <Back></Back>
      <h1 class="mui-title">提交产品</h1>
    </header>
    <div class="mui-content">

      <div class="container-addProduct">
        <div class="headPhotowrapper">
          <div class="headImages">
            <svg class="icon logoImg" aria-hidden="true" v-if="!images.length">
              <use xlink:href="#icon-biaozhunlogoshangxiayise"></use>
            </svg>
            <img v-if="images.length" :id="'image_0'" :src="images[0].base64" :data-preview-src="images[0].base64" :data-preview-group="1"/>
            <div class="headPhotograph" @tap.stop.prevent="uploadImage('small')">
              <svg class="icon" aria-hidden="true">
                <use xlink:href="#icon-xiangji1"></use>
              </svg>
            </div>
          </div>
        </div>

        <div class="productName">
          <input type="text" placeholder="输入产品名称" v-model.trim="name">
        </div>

        <div class="productType">
          <div class="title">产品类型</div>
          <div class="typeListWrappre">
            <div class="typeList" v-for="(item, index) in categorytags" :key="index">
              <span>{{ item.name }}</span>
              <svg class="icon" aria-hidden="true" @tap.stop.prevent="deleteTags(index)">
                <use xlink:href="#icon-times--"></use>
              </svg>
            </div>
            <div class="typeList add border-football" @tap.stop.prevent="addTags">
              <svg class="icon" aria-hidden="true">
                <use xlink:href="#icon-plus--"></use>
              </svg>
              <span>添加</span>
            </div>
          </div>
        </div>

        <div class="companyWrapper">
          <div class="title" @tap.stop.prevent="$router.push('/selectCompany?from=product')">
            <div>归属公司</div>
            <div class="company">
              <span v-if="companyName.length">{{ companyName }}</span>
              <svg class="icon" aria-hidden="true">
                <use xlink:href="#icon-jinru"></use>
              </svg>
            </div>
          </div>
          <div class="bot"></div>
        </div>

        <div class="productSummary">
          <div class="title">产品简介</div>
          <div class="textareaWrapper">
            <textarea v-model.trim="description" placeholder="产品具体介绍"></textarea>
          </div>
        </div>

        <div class="sureButton" @tap.stop.prevent="submit">确认提交</div>

      </div>

    </div>

    <uploadImage ref="uploadImage"
                 :isMultiple="true"
                 @success="uploadImageSuccess"
                 :ImageMaximum="maxImageCount - this.images.length"
    ></uploadImage>

    <DropDownMenu
      ref="dropdownMenu"
      :tree="categories"
      :showSelectTop="false"
      :showProductAddBack="true"
      v-model="categorytags"
    ></DropDownMenu>
  </div>
</template>

<script>
  import uploadImage from '../../../components/uploadImage'
  import localEvent from '../../../stores/localStorage'
  import DropDownMenu from '../../../components/select/DropDownMenu.vue'
  import { getCategories, addProduct } from '../../../utils/dianping'
  const currentUser = localEvent.getLocalItem('UserInfo')

  export default {
    data () {
      return {
        id: currentUser.user_id,
        name: '',
        description: '',
        maxImageCount: 1,
        images: [],
        companyName: '',
        categorytags: [],
        categories: []
      }
    },
    components: {
      uploadImage,
      DropDownMenu
    },
    computed: {
    },
    mounted () {
      this.refreshPageData()
    },
    methods: {
      deleteTags (index) {
        this.categorytags.splice(index, 1)
      },
      refreshPageData () {
        getCategories(this, (categories) => {
          this.categories = categories
        })

        this.companyName = localEvent.getLocalItem('product_company' + this.id)
        localEvent.clearLocalItem('product_company' + this.id)
      },
      addTags () {
        this.$refs.dropdownMenu.show()
      },
      uploadImageSuccess (images) {
        this.images = images
      },
      uploadImage: function () {
        this.$refs.uploadImage.uploadImage()
      },
      submit () {
        if (!this.images.length) {
          window.mui.toast('请选择图片')
          return
        }

        if (!this.name.length) {
          window.mui.toast('请输入产品名称')
          return
        }

        if (!this.categorytags.length) {
          window.mui.toast('请选择产品类型')
          return
        }

        if (!this.description.length) {
          window.mui.toast('请输入产品具体介绍')
          return
        }

        var categorytagsId = this.categorytags.map(categorytags => { return categorytags.id })
        var data = {
          name: this.name,
          logo: this.images[0].base64,
          category_ids: categorytagsId,
          company: this.companyName,
          summary: this.description
        }
        addProduct(this, data, () => {
          window.mui.toast('我们已收到您提交的产品，请耐心等候')
          this.$router.replace('/dianping/product/' + this.name)
        })
      }
    }
  }
</script>

<style scoped lang="less">
  .mui-content {
    background: #FFFFFF;
  }

  .bot {
    position: absolute;
    right: 0.426rem;
    bottom: 0;
    left: 0.426rem;
    height: 0.026rem;
    transform: scaleY(0.5);
    background-color: #dcdcdc;
  }
  .container-addProduct {
    position: relative;
    .title {
      color: #808080;
      font-size: 0.373rem;
      padding: 0 0.426rem;
      line-height: 0.533rem;
    }
    .productName {
      input[type='text'] {
        margin-bottom: 0;
        border: none;
        color: #444444;
        font-size: 0.533rem;
        margin-top: 0.026rem;
        text-align: center;
        font-family: PingFangSC-Medium;
        &::-webkit-input-placeholder {
          color: #C8C8C8;
          font-size: 0.533rem;
          font-family: PingFangSC-Medium;
        }
        &:-ms-input-placeholder {
          color: #C8C8C8;
          font-size: 0.533rem;
          font-family: PingFangSC-Medium;
        }
        &::-ms-input-placeholder {
          color: #C8C8C8;
          font-size: 0.533rem;
          font-family: PingFangSC-Medium;
        }
        &::placeholder {
          color: #C8C8C8;
          font-size: 0.533rem;
          font-family: PingFangSC-Medium;
        }
      }
    }
    .productType {
      margin-top: 0.64rem;
      .typeListWrappre {
        padding: 0.186rem 0.293rem 0;
        .typeList {
          padding: 0 0.266rem;
          height: 0.72rem;
          line-height: 0.613rem;
          background: #F3F4F6;
          border-radius: 2.666rem;
          display: inline-block;
          margin: 0.133rem;
          span {
            color: #444444;
            font-size: 0.32rem;
          }
          .icon {
            font-size: 0.213rem;
            color: #B4B4B6;
          }
          &.add {
            background: none;
            line-height: 0.666rem;
            span {
              color: #03AEF9;
            }
          }
        }
      }
    }
    .companyWrapper {
      position: relative;
      padding: 0.266rem 0 0.32rem;
      .title {
        display: flex;
        justify-content: space-between;
        .company {
          span {
            color: #444444;
          }
        }
      }
    }
    .productSummary {
      padding-top: 0.293rem;
      .textareaWrapper {
        padding: 0.346rem 0.426rem 0;
        textarea {
          padding: 0.32rem 0.4rem;
          height: 4.373rem;
          color: #444444;
          font-size: 0.373rem;
          line-height: 0.533rem;
        }
      }
    }
    .sureButton {
      width: 9.146rem;
      height: 1.173rem;
      margin: 0.266rem auto 0;
      color: #FFFFFF;
      font-size: 0.426rem;
      line-height: 1.173rem;
      text-align: center;
      background: #03AEF9;
      border-radius: 2.666rem;
      font-family:PingFangSC-Medium;
    }
  }
  .headPhotowrapper {
    margin-top: 0.133rem;
    .headImages {
      width: 1.573rem;
      height: 1.573rem;
      margin: 0 auto;
      position: relative;
      background: #E3E3E3;
      border-radius: 0.106rem;
      img {
        width: 100%;
        height: 100%;
        border-radius: 0.106rem;
      }
      .logoImg {
        position: absolute;
        top: 0.4rem;
        left: 50%;
        font-size: 0.746rem;
        color: #8B8B8B;
        transform: translateX(-50%);
      }
      .headPhotograph {
        width: 1.573rem;
        height: 1.573rem;
        border-radius: 0.106rem;
        position: absolute;
        top: 0;
        left: 0;
        background:rgba(0,0,0,.3);
        .icon {
          color: #FFFFFF;
          font-size: 0.56rem;
          position: absolute;
          top: 0.506rem;
          left: 50%;
          transform: translateX(-50%);
        }
      }
    }
  }
  .openAppH5 #dropDownMenuWrapper {
    top: auto !important;
    bottom: 0 !important;
    border-top-right-radius: 0.48rem;
    border-top-left-radius: 0.48rem;
    overflow: hidden;
  }
</style>

<style>
  .dianPingProductAdd .mui-scroll-wrapper {
    top: 0 !important;
  }
  .dianPingProductAdd .mui-popover {
    border-radius: 0;
  }
  .dianPingProductAdd .mui-popover .mui-scroll-wrapper {
    margin: 0;
    border-radius: 0.48rem 0.48rem 0 0 !important;
  }

  .dianPingProductAdd .dropDownMenuRoot .shareWrapper {
    border-top-right-radius: 0.48rem !important;
    border-top-left-radius: 0.48rem !important;
  }
  .dianPingProductAdd .container-select .listWrapper > .list:first-child {
   border-top-right-radius: 0.48rem;
   border-top-left-radius: 0.48rem;
   overflow: hidden;
  }
  .dianPingProductAdd .listWrapper {
    background: #FFF;
  }
</style>
