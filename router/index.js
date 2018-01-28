import Vue from 'vue'
import Router from 'vue-router'
/**
 * 客户端*/
// import Hello from '@/components/Hello'
/** 主页面*/
import shop from '@/pages/shop/Shop'
import character from '@/pages/character/Character'
import live from '@/pages/live/Live'
import shoppingCart from '@/pages/shoppingCart/ShoppingCart'
import me from '@/pages/me/Me'


/** shop 下面的子页面*/
import nearbyGoods from '@/pages/shop/nearbyGoods'
import farmerGoods from '@/pages/shop/farmerGoods'

/*** 商品 推荐  详情  评价*/
import goodsContainer from '@/pages/goods/goodsContainer'
import goods from '@/pages/goods/goods'
import recommendInfo from '@/pages/goods/recommendInfo'
import goodsDetail from '@/pages/goods/goodsDetail'
import goodsEvaluation from '@/pages/goods/goodsEvaluation'
import allComment from '@/pages/goods/allComment'



/**注册 登录  忘记密码 */
import Login from '@/pages/login/Login'
import register from '@/pages/login/register'
import ForgotPwd from '@/pages/login/ForgotPwd'
/**  */
/**  */
/**  */
/**  */
/**  */

import Footer from '@/components/Foot'



import cook from '@/pages/character/cook'


import setCenter from '@/pages/me/setCenter'
import userCenter from '@/pages/me/userCenter'
/**
  商家版路由*/
import MyShop from '@/pages/myShop/MyShop'
import AddGoods from '@/pages/myShop/AddGoods'
import GoodsManage from '@/pages/myShop/GoodsManage'

import UserManage from '@/pages/myShop/UserManage'
import ShopSignature from '@/pages/myShop/ShopSignature'
import SendAddress from '@/pages/myShop/SendAddress'
import NewShop from '@/pages/myShop/NewShop'
import OrderManage from '@/pages/myShop/OrderManage'
import BalanceMoney from '@/pages/myShop/BalanceMoney'
import BankCard from '@/pages/myShop/BankCard'
import withdrawCash from '@/pages/myShop/withdrawCash'
import VerifyPhone from '@/pages/myShop/VerifyPhone'
import setPwd from '@/pages/myShop/setPwd'
import withdrawCashMoney from '@/pages/myShop/withdrawCashMoney'
import withdrawCashLog from '@/pages/myShop/withdrawCashLog'
import todayMoney from '@/pages/myShop/todayMoney'
import moneyLog from '@/pages/myShop/moneyLog'
import aboutMe from '@/pages/me/aboutMe'




import search from '@/pages/search/search'
import TakePhoto from '@/pages/takePhoto/TakePhoto'
import ImageClip from '@/pages/takePhoto/ImageClip'
import scan from '@/pages/takePhoto/scan'
import sellerStore from '@/pages/sellerStore/sellerStore'

import cookRecommend from '@/pages/cookRecommend/cookRecommend'

import scanInfo from '@/pages/scan/scanInfo'
import pay from '@/pages/scan/pay'
import menu from '@/pages/me/menu'
import myInfo from '@/pages/me/myInfo'
import collectCook from '@/pages/me/collectCook'
import collectStore from '@/pages/me/collectStore'
import appraise from '@/pages/me/appraise'
import writeAppraise from '@/pages/me/writeAppraise'


import payOrder from '@/pages/me/payOrder'
import receivedOrder from '@/pages/me/receivedOrder'
import receivedOrderState from '@/pages/me/receivedOrderState'

/** 资讯路由*/
import cookMenuDetail from '@/pages/character/cookMenuDetail'
import informationDetail from '@/pages/character/informationDetail'
import upInformation from '@/pages/character/upInformation'
import createMenu from '@/pages/character/createMenu'

import searchList from '@/pages/search/searchList'
import searchGoodsList from '@/pages/shop/searchGoodsList'
import addressManage from '@/pages/me/addressManage'
import addressEdit from '@/pages/me/addressEdit'
/** 直播*/
import applyLive from '@/pages/live/applyLive'
import liveCertify from '@/pages/live/liveCertify'
import beginLive from '@/pages/live/beginLive'
import livePlay from '@/pages/live/livePlay'


import Test from '@/pages/test/test'


// import cookInfo from '@/pages/character/cookInfo'
// import cookMenu from '@/pages/character/cookMenu'
Vue.use(Router);

export default new Router({
  routes: [
    /*** 商家版页面*/
      {path: '/ImageClip', name: 'ImageClip', component: ImageClip},
      {path: '/TakePhoto', name: 'TakePhoto', component: TakePhoto},
      {path: '/scan', name: 'scan', component: scan},
      {path: '/VerifyPhone', name: 'VerifyPhone', component: VerifyPhone},
      {path: '/BalanceMoney', name: 'BalanceMoney', component: BalanceMoney},
      {path: '/BankCard', name: 'BankCard', component: BankCard},
      {path: '/withdrawCash', name: 'withdrawCash', component: withdrawCash},
      {path: '/OrderManage', name: 'OrderManage', component: OrderManage},
      {path: '/NewShop', name: 'NewShop', component: NewShop},
      {path: '/SendAddress', name: 'SendAddress', component: SendAddress},
      {path: '/ShopSignature/:title', name: 'ShopSignature', component: ShopSignature},
      {path: '/UserManage', name: 'UserManage', component: UserManage},
      {path: '/ForgotPwd', name: 'ForgotPwd', component: ForgotPwd},
      {path: '/Login', name: 'Login', component: Login},
      {path: '/register', name: 'register', component: register},
      {path: '/GoodsManage', name: 'GoodsManage', component: GoodsManage},
      {path: '/AddGoods', name: 'AddGoods', component: AddGoods},
      {path: '/MyShop', name: 'MyShop', component: MyShop},
      {path: '/setPwd', name: 'setPwd', component: setPwd},
      {path: '/Test', name: 'Test', component: Test},
      {path: '/withdrawCashMoney', name: 'withdrawCashMoney', component: withdrawCashMoney},
      {path: '/withdrawCashLog', name: 'withdrawCashLog', component: withdrawCashLog},
      {path: '/todayMoney', name: 'todayMoney', component: todayMoney},
      {path: '/moneyLog', name: 'moneyLog', component: moneyLog},
    /*** 客户版页面*/
    //主页面
    {meta:{keepAlive:true},path: '/', name: 'shop', component: shop},
    {meta:{keepAlive:true},path: '/character', name: 'character', component: character},
    {meta:{keepAlive:true},path: '/live', name: 'live', component: live},
    {path: '/ShoppingCart', name: 'shoppingCart', component: shoppingCart},
    {path: '/me', name: 'me', component: me},



    {path: '/footer', name: 'Footer', component: Footer},
    {path: '/searchList', name: 'searchList', component: searchList},
    {path: '/searchGoodsList', name: 'searchGoodsList', component: searchGoodsList},


    {path: '/cook', name: 'cook', component: cook},

    /** shop 子页面*/
    {path: '/nearbyGoods', name: 'nearbyGoods', component: nearbyGoods},
    {path: '/farmerGoods', name: 'farmerGoods', component: farmerGoods},

    /*** 商品 推荐  详情  评价*/
    {path: '/goods', name: 'goods', component: goods},
    {path: '/goodsEvaluation', name: 'goodsEvaluation', component: goodsEvaluation},
    {path: '/goodsDetail', name: 'goodsDetail', component: goodsDetail},
    {path: '/recommendInfo', name: 'recommendInfo', component: recommendInfo},
    {path: '/goodsContainer', name: 'goodsContainer', component: goodsContainer},
    {path: '/search', name: 'search', component: search},
    {path: '/allComment', name: 'allComment', component: allComment},
    /*** 卖家店铺页面*/
    {path: '/sellerStore', name: 'sellerStore', component: sellerStore},//卖家商品
    {path: '/cookRecommend', name: 'cookRecommend', component: cookRecommend},

    {path: '/scanInfo', name: 'scanInfo', component: scanInfo},
    {path: '/pay', name: 'pay', component: pay},
    /** 我的页面*/
    {path: '/menu', name: 'menu', component: menu}, //我的菜单
    {path: '/myInfo', name: 'myInfo', component: myInfo},//我的信息
    {path: '/collectCook', name: 'collectCook', component: collectCook},  //收藏厨师
    {path: '/collectStore', name: 'collectStore', component: collectStore}, //收藏店铺
    {path: '/appraise', name: 'appraise', component: appraise},//待评价
    {path: '/writeAppraise', name: 'writeAppraise', component: writeAppraise},//待评价
    {path: '/receivedOrder', name: 'receivedOrder', component: receivedOrder},//待评价
    {path: '/payOrder', name: 'payOrder', component: payOrder},//待付款订单
    {path: '/receivedOrderState', name: 'receivedOrderState', component: receivedOrderState},//待评价
    {path: '/cookMenuDetail', name: 'cookMenuDetail', component: cookMenuDetail},//菜谱详情
    {path: '/informationDetail', name: 'informationDetail', component: informationDetail},//菜谱详情
    {path: '/upInformation', name: 'upInformation', component: upInformation},//新建资讯
    {path: '/createMenu', name: 'createMenu', component: createMenu},//新建菜谱
    {path: '/setCenter', name: 'setCenter', component: setCenter},//新建菜谱
    {path: '/userCenter', name: 'userCenter', component: userCenter},//新建菜谱
    {path: '/addressManage', name: 'addressManage', component: addressManage},//收货地址管理
    {path: '/addressEdit', name: 'addressEdit', component: addressEdit},//新增 编辑 收货地址
    {path: '/aboutMe', name: 'aboutMe', component: aboutMe},//关于我们
    /** 直播*/
    {path: '/applyLive', name: 'applyLive', component: applyLive},//申请直播
    {path: '/liveCertify', name: 'liveCertify', component: liveCertify},//直播认证
    {path: '/beginLive', name: 'beginLive', component: beginLive},//开始直播
    {path: '/livePlay', name: 'livePlay', component: livePlay},//播放直播

    // {path: '/cookInfo', name: 'cookInfo', component: cookInfo},//大厨资料
    // {path: '/cookMenu', name: 'cookMenu', component: cookMenu},//大厨菜谱
  ],
  // mode:'history',
  // scrollBehavior(to, from, savedPosition) {
  //   console.log(savedPosition )
  //   if (savedPosition) {
  //     return savedPosition
  //   } else {
  //     if (from.meta.keepAlive) {
  //       from.meta.savedPosition = document.getElementsByClassName('content')[0].scrollTop
  //     }
  //     return { x: 0, y: to.meta.savedPosition || 0 }
  //   }
  // },
  // mode:'history'
})
