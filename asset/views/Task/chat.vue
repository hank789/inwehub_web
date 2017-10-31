<template>

  <div>
    <header class="mui-bar mui-bar-nav">
      <a class="mui-action-back mui-icon mui-icon-left-nav mui-pull-left"></a>
      <h1 class="mui-title">客服小哈</h1>
    </header>
    <div class="mui-content absolute" id='contentwrapper'>
      <RefreshList ref="RefreshList" 
        v-model="list" :api="'im/messages'" 
        :autoShowEmpty="false" 
        :pageMode="true" 
        :downLoadMoreMode="true" 
        :isShowUpToRefreshDescription="false" 
        :prevOtherData="{contact_id:0}" 
        :nextOtherData="{contact_id:0}" 
        :list="list" class="listWrapper">

        <ul class="user" id="myData">
          <template v-for="item in list">
            <!--客服-->
            <li class="consumer" v-if="id != item.user_id">
              <p>{{item.created_at}}</p>
              <p>
                <img src="../../statics/images/service1.png" />
                <span>
                  {{item.data.text}}
             </span>
              </p>

            </li>
            <!--自己-->
            <li class="Customerservice" v-if="id == item.user_id">
              <p>{{item.created_at}}</p>
              <p>
                <img :src="avatar" />
                <span>
                  {{item.data.text}}
            </span>
              </p>

            </li>
          </template>
        </ul>
      </RefreshList>

      <!--发送消息框-->
      <div class="message" id="message">
        <input type="text" v-model.trim="comment" @keyup="show($event)" />
        <svg class="icon" aria-hidden="true">
          <use xlink:href="#icon-fasong" @tap.stop.prevent="message()"></use>
        </svg>
      </div>
      <!--发送消息框end-->

    </div>
  </div>
</template>

<script>
  import { postRequest } from '../../utils/request';
  import uploadHeader from '../../components/uploadHeader.vue';
  import RefreshList from '../../components/refresh/List.vue';
  import { getLocalUserInfo, isCompanyStatus } from '../../utils/user';
  import localEvent from '../../stores/localStorage';
  const Chat = {
    data: () => ({
      list: [],
      page: 1,
      comment: "",
      id: "",
      avatar: "",
      flag: true

    }),
    created() {
      //id  和  头像；
      this.id = getLocalUserInfo().user_id;
      this.avatar = getLocalUserInfo().avatar_url;

    },
    computed: {

    },
    components: {
      RefreshList
    },
    methods: {
      //回车键发送‘
      show: function(ev) {
        if(ev.keyCode == 13) {
          //发送
          this.message();
        }
      },
      //获取本地时间；
      CurentTime() {
        var now = new Date();

        var year = now.getFullYear(); //年
        var month = now.getMonth() + 1; //月
        var day = now.getDate(); //日

        var hh = now.getHours(); //时
        var mm = now.getMinutes(); //分
        var ss = now.getSeconds(); //秒

        var clock = year + "-";

        if(month < 10)
          clock += "0";

        clock += month + "-";

        if(day < 10)
          clock += "0";

        clock += day + " ";

        if(hh < 10)
          clock += "0";

        clock += hh + ":";
        if(mm < 10) clock += '0';
        clock += mm + ":";

        if(ss < 10) clock += '0';
        clock += ss;
        return(clock);
      },
      chat(obj) {
        var item = {
          created_at: obj.created_at,
          data: {
            text: obj.body.text
          },
          id: obj.id,
          user_id: 0,
          avatar: obj.avatar,
        };
        this.list = this.list.concat(item);
        this.flag = true;
        // console.log(item);
        //  console.log(this.list);
      },
      // 消息；
      message() {
        let id = parseInt(this.$route.params.id);
        if(this.comment) {
          var item = {
            // created_at: new Date().toLocaleString(),
            created_at: this.CurentTime(),
            data: {
              text: this.comment
            },
            id: 2,
            user_id: this.id,

          };

          this.list = this.list.concat(item);

          postRequest(`im/message-store`, {
            text: this.comment,
            contact_id: 0
          }).then(response => {
            var code = response.data.code;
            //如果请求不成功提示信息 并且返回上一页；
            if(code !== 1000) {
              mui.alert(response.data.message);
              mui.back();
              return;
            }

            if(response.data.data) {

              this.comment = '';

              //            this.list = this.list.concat(response.data.data);

              this.flag = true;

            }

            this.loading = 0;
          });

        }

      }
      //end；

    },
    mounted() {

    },
    updated() {
      if(this.flag) {
        this.flag = false;

        this.$nextTick(() => {
          this.$refs.RefreshList.scrollToBottom();
        });
      }
    }
  }
  export default Chat;
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
  a {
    margin: 0;
    padding: 0;
    list-style: none;
    font-style: normal;
  }
  
  .mui-content {
    background: #f3f4f6;
  }
  /*input 输入框*/
  
  .message {
    width: 100%;
    height: 47px;
    background: #ececee;
    position: fixed;
    bottom: 0;
    padding: 0 10px;
    z-index: 999;
  }
  
  .message input {
    width: 88%;
    height: 35px;
    border-radius: 5px;
    background: #ffffff;
    border: none;
    box-shadow: 0 0 10px rgba(220, 220, 220, 1);
    margin-top: 6px;
    float: left;
  }
  
  .message svg {
    font-size: 32px;
    margin-top: 7px;
    color: #03aef9;
    float: right;
  }
  /*内容区域*/
  
  .user {
    width: 96%;
    margin-left: 2%;
    overflow: hidden;
    /*background: #CCCCCC;*/
  }
  
  .user li {
    width: 100%;
    overflow: hidden;
    /*border: 1px solid #CCCCCC;*/
  }
  
  .consumer p:nth-of-type(1) {
    text-align: center;
    font-size: 13px;
    color: #b4b4b6;
    line-height: 46px;
  }
  
  .consumer p:nth-of-type(2) {
    width: 100%;
    overflow: hidden;
  }
  
  .consumer p:nth-of-type(2) img {
    width: 42px;
    height: 42px;
    float: left;
  }
  
  .consumer p:nth-of-type(2) span {
    position: relative;
    float: left;
    display: block;
    max-width: 86%;
    min-height: 35px;
    margin-left: 3%;
    border-radius: 10px;
    border: 1px solid #dcdcdc;
    text-align: left;
    background: #FFFFFF;
    padding: 7px;
  }
  
  .consumer p:nth-of-type(2) span:after {
    content: "";
    display: block;
    width: 6px;
    height: 6px;
    background: #FFFFFF;
    border: 1px solid #dcdcdc;
    /*border: 6px solid transparent;
    border-right: 6px solid #FFFFFF;
    border-bottom: 6px solid #FFFFFF;*/
    position: absolute;
    -webkit-transform: rotate(135deg);
    transform: rotate(135deg);
    left: -4px;
    border-top-color: #FFFFFF;
    border-left-color: #FFFFFF;
    top: 15px;
    margin: auto;
  }
  /*客服*/
  
  .Customerservice {
    width: 100%;
    overflow: hidden;
  }
  
  .Customerservice p:nth-of-type(1) {
    width: 100%;
    text-align: center;
    font-size: 13px;
    color: #b4b4b6;
    line-height: 46px;
  }
  
  .Customerservice p:nth-of-type(2) {
    width: 100%;
    overflow: hidden;
  }
  
  .Customerservice p:nth-of-type(2) img {
    width: 42px;
    height: 42px;
    float: right;
    border-radius: 8px;
  }
  
  .Customerservice p:nth-of-type(2) span {
    position: relative;
    float: right;
    display: block;
    max-width: 86%;
    min-height: 35px;
    margin-right: 3%;
    border-radius: 10px;
    border: 1px solid #dcdcdc;
    text-align: left;
    background: #FFFFFF;
    padding: 7px;
  }
  
  .Customerservice p:nth-of-type(2) span:after {
    content: "";
    display: block;
    width: 6px;
    height: 6px;
    background: #FFFFFF;
    border: 1px solid #dcdcdc;
    position: absolute;
    -webkit-transform: rotate(135deg);
    transform: rotate(135deg);
    right: -4px;
    border-bottom-color: #FFFFFF;
    border-right-color: #FFFFFF;
    top: 15px;
    margin: auto;
  }
  
  .listWrapper {
    bottom: 47px;
  }
  
  .mui-scroll-wrapper {
    /*position: absolute;
    z-index: 2;
    top: 0;
    bottom: 0;
    left: 0;*/
    overflow: scroll;
    /*width: 100%;*/
  }
</style>