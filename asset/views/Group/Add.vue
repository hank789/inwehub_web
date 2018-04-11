<template>
  <div>
    <header class="mui-bar mui-bar-nav">
      <a class="mui-icon mui-icon-left-nav mui-pull-left"  @tap.stop.prevent="empty()"></a>
      <h1 class="mui-title">创建圈子</h1>
    </header>
    <div class="mui-content">
    <div class="imagesContainer">
        <div class="groupImageWrapper" v-if="images.length">
          <svg class="icon" aria-hidden="true" @tap.stop.prevent="delImg(index)">
            <use xlink:href="#icon-times1"></use>
          </svg>
          <img :id="'image_' + index" :src="images[0].base64" :data-preview-src="images[0].base64" :data-preview-group="1"/>
        </div>
        <div class="container-image component-photograph" @tap.stop.prevent="uploadImage()" v-if="images.length < maxImageCount"><svg class="icon" aria-hidden="true"><use xlink:href="#icon-xiangji1"></use></svg></div>
      </div>

        <div class="address">
          <p>圈子名称</p>
          <input type="text" placeholder="圈子名称9个字以内" v-model.trim="name"/>
          <i class="bot"></i>
        </div>
       <div class="groups-content">
         <p>圈子描述</p>
         <div class="form form-ask">
           <div class="textarea-wrapper">
             <textarea id="description" v-model.trim="description"  placeholder="圈子的具体描述"></textarea>
           </div>
         </div>
         <span class="counter"><span>{{descLength}}</span><span>/</span><span>{{descMaxLength}}</span></span>
       </div>

      <div class="fixedContainer">
          <span class="niming" @tap.stop.prevent="toggleHide"><label class="nimingCheckbox"
                                                                     :class="{'active':hide}"></label>公开</span>
          <span class="niming" @tap.stop.prevent="toggleHide"><label class="nimingCheckbox"
                                                                     :class="{'active':!hide}"></label>秘密<i>（内容仅入圈成员可看）</i></span>
      </div>


     <button @tap.stop.prevent="submit()" :class="apply ? 'grey' :''">{{apply ? '正在审核':'开始创建'}}</button>
    </div>

    <uploadImage ref="uploadImage"
                 :isMultiple="true"
                 @success="uploadImageSuccess"
                 :ImageMaximum="maxImageCount - this.images.length"
    ></uploadImage>
  </div>
</template>
<script>
  import uploadImage from '../../components/uploadImage'
  import { postRequest } from '../../utils/request'
  export default {
    data () {
      return {
        images: [],
        maxImageCount: 1,
        description: '',
        name: '',
        descMaxLength: 1000,
        hide: 1,
        apply: 0
      }
    },
    computed: {
      descLength() {
        return this.description.length
      }
    },
    components: {
      uploadImage
    },
    created () {
    },
    mounted () {

    },
    watch: {
      description: function (newDescription) {
        if (newDescription.length > this.descMaxLength) {
          this.description = this.description.slice(0, this.descMaxLength)
        }
      }
    },
    methods: {
      submit () {
        if (!this.apply) {
          if (!this.images.length) {
            window.mui.toast('请选择图片')
            return
          }
          if (!this.name.length) {
            window.mui.toast('请输入圈子名称')
            return
          } else if (this.name.length > 9) {
            window.mui.toast('圈子名称9个字以内')
            return
          }
          if (!this.description.length) {
            window.mui.toast('请输入圈子描述')
            return
          }
          var data = {
            name: this.name,
            description: this.description,
            logo: this.images[0].base64,
            public: this.hide ? 1 : 0
          }
          postRequest(`group/store`, data).then(response => {
            var code = response.data.code
            if (code !== 1000) {
              window.mui.alert(response.data.message)
              return
            }
            if (response.data.data.id) {
              this.apply = 1
            }
          })
        }
      },
      toggleHide () {
        this.hide = !this.hide
      },
      uploadImage: function () {
        this.$refs.uploadImage.uploadImage()
      },
      uploadImageSuccess (images) {
        for (var i = 0; i < images.length; i++) {
          this.images.push(images[i])
        }
      },
      delImg (index) {
        this.images.splice(index, 1)
      }
    }
  }
</script>
<style scoped>
  /*清掉自带样式*/

  div,
  p,
  span,
  i,
  img,
  ul,
  li,
  a,
  input,
  button {
    margin: 0;
    padding: 0;
    list-style: none;
    font-style: normal;
  }
  .bot {
    position: absolute;
    right: 0rem;
    bottom: 0;
    left: 0rem;
    height: 0.026rem;
    -webkit-transform: scaleY(.5);
    transform: scaleY(.5);
    background-color: rgb(220, 220, 220);
  }
  .mui-content{
    background: #fff;
  }
  .groupImageWrapper img{
    width:1.626rem;
    height:1.626rem;
  }
  .component-photograph{
    width:1.626rem !important;
    height:1.626rem !important;
  }
  .imagesContainer{
    width:100%;
    overflow: hidden;
    display: flex;
    flex-direction: row;
    justify-content: center;
  }


  .address{
    width: 92%;
    height: 1.146rem;
    margin-left: 4%;
    position: relative;
    line-height: 1.146rem;
    margin-top:28px;
  }

  .address p{
    float: left;
    color: #808080;
    font-size: 0.373rem;
  }

  .address input {
    width: 80%;
    height: 1.12rem;
    float: left;
    margin-bottom: 0;
    padding-right: 0;
    padding-left:0.4rem;
    border: none;
    font-size: 0.373rem;
    color: #444444;
    text-align: right;
  }
  .groups-content{
    width:92%;
    overflow: hidden;
    margin-left: 4%;
    margin-top:10px;
    position: relative;
  }
  .groups-content p{
    font-size: 0.373rem;
    color: #808080;
  }
  .form-ask .button-wrapper {
    margin-top: 0.4rem;
    padding: 0 2.133rem
  }

  .textarea-wrapper {
    height: 200px;
    background: #ffffff;
    margin-top: 13px;
    border: 1px solid #DCDCDC;
    border-radius: 5px;
  }

  .textarea-wrapper textarea {
    background: #ffffff;
    font-size: 14px;
    color: #444444;
    height: 164px;
    border: none;
  }
  .counter{
    font-size: 14px;
    color: #C8C8C8;
    position: absolute;
    bottom: 6px;
    right: 10px;
  }
  .fixedContainer {
    position: relative;
    background: #ffff;
    padding: 0.133rem 0.3rem;
    margin-top: 5px;
  }

  .fixedContainer .counter {
    float: right;
    color: #c8c8c8;
  }

  .fixedContainer .niming {
    color: #444444;
    position: relative;
    font-size: 14px;
    padding-left: 0.24rem;
    margin-right: 30px;
  }
  .fixedContainer .niming  i{
    color: #808080;
    font-size: 14px;
  }

  .fixedContainer .niming input {
    position: absolute;
    top: 0.106rem;
    left: 0;
    vertical-align: bottom;
  }
  .nimingCheckbox {
    display: inline-block;
    width: 16px;
    height: 16px;
    position: relative;
    border: 0.026rem solid #c8c8c8;
    border-radius: 50%;
    top: 0.08rem;
    right: 0.133rem;
  }

  .nimingCheckbox.active:after {
    content: ' ';
    display: inline-block;
    width: 0.106rem;
    height: 0.106rem;
    position: absolute;
    border: 0.026rem solid #03aef9;
    background-color: #03aef9;
    border-radius: 50%;
    left: 50%;
    margin-left: -0.08rem;
    top: 50%;
    margin-top: -0.08rem;
  }

  button{
    width:92%;
    height:44px;
    border-radius: 50px;
    background: #03AEF9;
    font-size: 16px;
    color: #FFFFFF;
    line-height: 44px;
    position: fixed;
    left:0;
    right:0;
    bottom: 15px;
    margin: auto;
  }
  button.grey{
    background:rgba(220,220,220,1);
    color: #B4B4B6;
  }
</style>
