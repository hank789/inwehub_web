## 初始化
npm install

## 构建
### 开发环境
npm run dev

### 测试环境
npm run test

### 生产环境
npm run build


## 目录介绍
/asset  资源目录,开发主要目录
/dist   生成的静态文件


#规范
页面标题栏
  <header class="mui-bar-nav">
      //标题栏内容
  </header>

页面主体内容
  <div class="mui-content">
      //页面主体内容
  </div>

页面底部内容
  <nav class="footer-bar">
      //页面底部内容
  </nav>


dialog使用:
1. import {alertSkyOne, alertSkyTwo, alertSimple} from '../../utils/dialog';
     import inwehubDialog from '../../components/Dialog.vue';

2.  components: {
         inwehubDialog,
       },

3. <inwehubDialog ref="inwehubDialog"></inwehubDialog>


4. this.$refs.inwehubDialog.getHtml('test', {ok:'this is ok'}, (html) => {
             console.log('html:'+html);
             alertSimple(html, 'ok');
         });


dialog全局使用
  this.$parent.$refs.inwehubDialog.getHtml('test', {ok:'this is ok'}, (html) => {
            console.log('html:'+html);
            alertSimple(html, 'ok');
        });



message组件
    调用
      this.$refs.MessageComponent.show('hello', () => {
          //点击后要处理的业务
            });
