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
##页面布局
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


##dialog使用:
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


##dialog全局使用
  this.$parent.$refs.inwehubDialog.getHtml('test', {ok:'this is ok'}, (html) => {
            console.log('html:'+html);
            alertSimple(html, 'ok');
        });



##message组件
    调用
      this.$refs.MessageComponent.show('hello', () => {
          //点击后要处理的业务
            });


##路由命名
   1 小驼峰式
   2 列表如: /my/info/trains 以复数形式结尾
   3 详情
        如: '/my/info/train/:id'  需要id以:id结尾, 不需要id的以单数形式结尾


##pc端阶梯式布局尺寸参考值
    1-768        手机    100%
    768-992      平板    750px
    992-1200     小pc    970px
    1200-1919    大pc    1170px
    1920-        超大pc





