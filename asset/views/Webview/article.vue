<template>
<div>

</div>
</template>


<script>
  import localEvent from '../../stores/localStorage';
  import axios from 'axios';

  export default {
    data: () => ({
      loading:1
    }),
    created () {
      showInwehubWebview();
    },
    methods: {

    },
    watch: {

    },
    mounted(){
      mui.plusReady(() => {
        var ws = plus.webview.currentWebview();
        ws.addEventListener('show',createEmbed(ws),false);
        var currentUser = localEvent.getLocalItem('UserInfo');
        var url = process.env.READHUB_URL + '/api-request?uuid=' + currentUser.uuid;

        function createEmbed(ws) {
          var embed=plus.webview.create(ws.article_url, ws.id,{popGesture: 'close',
            top:'0px',
            bottom:'0px',
            position:'dock',
            dock:'bottom',
            backButtonAutoControl: 'hide',
            titleNView: {
              backgroundColor: '#f7f7f7', //导航栏背景色
              titleText: ws.article_title, //导航栏标题
              titleColor: '#000000', //文字颜色
              type: 'transparent', //透明渐变样式
              autoBackButton: false, //自动绘制返回箭头
              buttons: [
                {
                  color: '#5e5e5e',
                  'float': 'left',
                  fontSize: '27px',
                  text: '\u1438',
                  onclick: ()=>{
                    var current_ws = plus.webview.getWebviewById(ws.id);
                    if (current_ws) {
                      current_ws.close();
                    }
                  }
                },
                {
                  color: '#5e5e5e',
                  'float': 'left',
                  fontSize: '27px',
                  text: '\u2606',
                  onclick: ()=> {
                    console.log('bookmark');
                    axios.post(url,{
                      api_name : 'bookmark-submission',
                      id : ws.article_id
                    }).then((response) => {
                      plus.nativeUI.toast('收藏成功');
                    }).catch((error) => {
                      plus.nativeUI.toast('收藏失败');
                    });
                  }
                },
                {
                  color: '#5e5e5e',
                  'float': 'right',
                  fontSize: '27px',
                  text: '\u25B2',
                  onclick: ()=>{
                    console.log('upvote');
                    axios.post(url,{
                      api_name : 'upvote-submission',
                      previous_vote: null,
                      submission_id : ws.article_id
                    }).then((response) => {
                      plus.nativeUI.toast('已赞');
                    }).catch((error) => {
                      plus.nativeUI.toast('失败');
                    });
                  }
                },
                {
                  color: '#5e5e5e',
                  'float': 'right',
                  fontSize: '27px',
                  text: '\u25BC',
                  onclick: ()=> {
                    console.log('downvote');
                    this.$emit('downvote');
                    axios.post(url,{
                      api_name : 'downvote-submission',
                      previous_vote: null,
                      submission_id : ws.article_id
                    }).then((response) => {
                      plus.nativeUI.toast('已踩');
                    }).catch((error) => {
                      plus.nativeUI.toast('失败');
                    });
                  }
                },
              ],
              splitLine: { //底部分割线
                color: '#cccccc'
              }
            },
            bounce:'vertical'});

          ws.append(embed);
        }
      });

    }
  }

</script>
