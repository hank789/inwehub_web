<template>
  <div>
    <header class="mui-bar mui-bar-nav">
      <Back></Back>
      <h1 class="mui-title">创建产品</h1>
    </header>
    <div class="mui-content">

      <div class="container-addProduct">
        <div class="headPhotowrapper">
          <div class="headImages">
            <svg class="icon logoImg" aria-hidden="true">
              <use xlink:href="#icon-biaozhunlogoshangxiayise"></use>
            </svg>
            <!--<img src="../../../statics/images/uicon.jpg" alt="">-->
            <!--<img v-if="images.length" :id="'image_0'" :src="images[0].base64" :data-preview-src="images[0].base64" :data-preview-group="1"/>-->
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
            <div class="typeList" v-for="(item, index) in 3" :key="index">
              <span>Business Services</span>
              <svg class="icon" aria-hidden="true">
                <use xlink:href="#icon-times--"></use>
              </svg>
            </div>
            <div class="typeList add border-football">
              <svg class="icon" aria-hidden="true">
                <use xlink:href="#icon-plus--"></use>
              </svg>
              <span>添加</span>
            </div>
          </div>
        </div>

        <div class="companyWrapper">
          <div class="title">
            <div>归属公司</div>
            <div class="company">
              <span>归属公司</span>
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

        <div class="sureButton">确认创建</div>

      </div>

    </div>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        name: '',
        description: ''
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
    right: 16px;
    bottom: 0;
    left: 16px;
    height: 0.026rem;
    transform: scaleY(0.5);
    background-color: #dcdcdc;
  }
  .container-addProduct {
    position: relative;
    .title {
      color: #808080;
      font-size: 14px;
      padding: 0 16px;
      line-height: 20px;
    }
    .productName {
      input[type='text'] {
        margin-bottom: 0;
        border: none;
        color: #444444;
        font-size: 0.533rem;
        margin-top: 1px;
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
      margin-top: 24px;
      .typeListWrappre {
        padding: 7px 11px 0;
        .typeList {
          padding: 0 10px;
          height: 27px;
          line-height: 23px;
          background: #F3F4F6;
          border-radius: 100px;
          display: inline-block;
          margin: 5px;
          span {
            color: #444444;
            font-size: 12px;
          }
          .icon {
            font-size: 8px;
            color: #B4B4B6;
          }
          &.add {
            background: none;
            line-height: 25px;
            span {
              color: #03AEF9;
            }
          }
        }
      }
    }
    .companyWrapper {
      position: relative;
      padding: 10px 0 12px;
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
      padding-top: 11px;
      .textareaWrapper {
        padding: 13px 16px 0;
        textarea {
          padding: 12px 15px;
          height: 164px;
          color: #444444;
          font-size: 14px;
          line-height: 20px;
        }
      }
    }
    .sureButton {
      width: 343px;
      height: 44px;
      margin: 10px auto 0;
      color: #FFFFFF;
      font-size: 16px;
      line-height: 44px;
      text-align: center;
      background: #03AEF9;
      border-radius: 100px;
      font-family:PingFangSC-Medium;
    }
  }
  .headPhotowrapper {
    margin-top: 5px;
    .headImages {
      width: 59px;
      height: 59px;
      margin: 0 auto;
      position: relative;
      background: #E3E3E3;
      border-radius: 4px;
      img {
        width: 100%;
        height: 100%;
        border-radius: 4px;
      }
      .logoImg {
        position: absolute;
        top: 15px;
        left: 50%;
        font-size: 28px;
        color: #8B8B8B;
        transform: translateX(-50%);
      }
      .headPhotograph {
        width: 59px;
        height: 59px;
        border-radius: 4px;
        position: absolute;
        top: 0;
        left: 0;
        background:rgba(0,0,0,.3);
        .icon {
          color: #FFFFFF;
          font-size: 21px;
          position: absolute;
          top: 19px;
          left: 50%;
          transform: translateX(-50%);
        }
      }
    }

  }
</style>
