// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import VueLazyload from 'vue-lazyload'
// import MintUi from 'mint-ui'
import 'mint-ui/lib/style.css'
import './assets/css/main.css'
import './assets/js/api.js'
import './assets/js/index.js'
import './assets/js/address.js'
import './assets/js/fastclick'
import md5 from 'blueimp-md5'
import _global from './assets/js/global'
import './assets/css/swipermin.css'


import VueAwesomeSwiper from 'vue-awesome-swiper'
Vue.use(VueAwesomeSwiper)
FastClick.attach(document.body);//fastClick
Vue.config.productionTip = false;
let dpr = window.devicePixelRatio;
let bodyd = document.body;
bodyd.setAttribute('data-dpr',dpr);
let width = bodyd.offsetWidth;
let baseNum = width/360*12+'px';
document.getElementById('html').style.fontSize = baseNum;

/* eslint-disable no-new */
Vue.prototype.G = _global;
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App },
  // render: h => h(App)
});
Vue.use(VueLazyload, {//图片懒加载
  preLoad: 1.3,  //加载数量比例
  error: './static/goods-type.png',
  loading: './static/goods-type.png',
  attempt: 3
});
// Vue.use(MintUi);
Vue.use(md5);
// apiready = function () {
//   api.setStatusBarStyle({
//     style: "light" //”dark  light
//   });
//
//   document.getElementById('html').style.height = api.winHeight+'px';
//   var head = document.getElementById('head');
//   var style = document.createElement('style');
//   var styleCss=document.createTextNode(".content{height:"+api.winHeight+'px'+"}");
//   style.appendChild(styleCss)
//   head.appendChild(style)
//   var systemVersion = api.systemVersion;
//   // console.log(systemVersion)
//   if (parseFloat(systemVersion) < 4.3) {
//     api.alert({title: '提示', msg: 'Android系统版本为:' + systemVersion + ',请用更Android4.3以上系统使用此软件'})
//   }
//
//   var mkeyTime = new Date().getTime();
//   api.addEventListener({
//     name: 'keyback'
//   }, function (ret) {
//     if (ret) {
//
//       var  arr = ['live','shop','character','shoppingCar','me'];
//       if(arr.indexOf(window.page)!==-1) {
//         if ((new Date().getTime() - mkeyTime) > 2000) {
//           mkeyTime = new Date().getTime();
//           api.toast({
//             msg: '再按一次退出程序',
//             duration: 2000,
//             location: 'bottom'
//           });
//         } else {
//           api.closeWidget();
//         }
//         // api.toLauncher();
//       }else if(window.page==='imageClip'){
//         let FNImageClip = api.require('FNImageClip');
//         FNImageClip.close();
//       } else{
//         window.isGoBack = true;
//         history.go(-1)
//       }
//     }
//   });
// }
// Vue.use(Swiper);







