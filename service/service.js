/**
 * Created by ma on 2017/5/31.
 */
import Vue from 'vue'
import axios from 'axios'
import router from '../router/index'
import {Indicator} from 'mint-ui'
Vue.prototype.$http = axios;
axios.defaults.withCredentials=true;
axios.defaults.timeout=0;
// axios.defaults.baseURL='base/weirenService/app/';
axios.defaults.baseURL='http://www.weirenfw.com/weirenService/app/';

// let url = '/mock'

axios.interceptors.request.use(function (config) {
  // 在发送请求之前做些什么
  return config;
}, function (error) {
  // 对请求错误做些什么
  return Promise.reject(error);
});

// 添加响应拦截器
axios.interceptors.response.use(function (res) {
  // 对响应数据做点什么
  if(res.data.errorCode=='-2'){
    // localStorage.clear()
    router.push({name:'Login'});
    Indicator.close()
    return
  }
  // // console.log(res)
  let response={
    data:res.data,
  }
  return response;
}, function (error) {
  // 对响应错误做点什么
  Indicator.close()
  return Promise.reject(error);
});

Vue.prototype.API = {
  /** 注册登录*/

  // register:'account/register',//注册
  register:'account/register/new',//注册(新)
  // login:'account/login',//登录
  login:'account/login/new',//登录(新)
  login3:'account/login/tx',//第三方登录
  sendSms:'account/sendSms',//发送手机验证码
  resetSendSms:'account/resetSendSms',//发送手机验证码
  logout:'account/logout',//退出登录
  upPassword:'account/modifyPwd',//修改登录密码
  resetPwd:'account/resetPwd',//重置密码
  /** 资讯*/
  info_uploadImg:'information/uploadImg',//新增资讯图片
  addInfo:'information/add',//新增资讯
  updateInfo:'information/update',//修改资讯
  infoList:'information/selectOnlineInformations',//资讯列表（仅审核通过的）
  myInfoList:'information/myOnlineInformations',//我上传的资讯列表
  // searchInfo:'information/search',//关键字查询资讯
  infoDetail:'information/show',//资讯详情
  // addInfoComment:'informationComment/add',//新增资讯评论
  // addInfoFavor:'informationFavor/add',//新增资讯点赞
  info_delete:'information/delete',//删除资讯


  /** 首页*/
  indexBanner:'banner/allShow',//首页轮播图
  getGoodsByType:'goods/selectByShopTypeAndTypes',//通过店铺类型和商品类型获取商品
    nearbyGoods:'shop/indexNearby',//附近商铺商品
  /** 搜索*/
  search:'common/search',
  goods_Search:'goods/search',//商品搜索
  /** 公共方法 */
  addFavor:'common/addFavor',//点赞
  addCollect:'common/addCollect',//收藏
  cancelCollect:'common/cancelCollect',//取消收藏
  addComment:'common/addComment',//添加评论
  myCollect:'common/myCollect',//我的收藏
  addReply:'common/addReply',//添加回复
  addBrowse:'common/addBrowse',//浏览量统计


  /**我的 */
  user_uploadImg:'account/uploadImg',//上传我的头像图片
  beChef:'account/beChef',
  up_user_info:'account/complete',//更新 我的资料
  show_chef_info:'account/showChef',//获取大厨的资料
  toBe_cooker:'account/beChef',//成为大厨
  buyerConfirm:'order/buyerConfirm',//买家确认收货
  sub_comment:'order/insertComment',//发表评价

  /**创建菜谱 */
  menu_uploadImg:'cookbook/uploadImg',
  menu_add:'cookbook/add',//上传新的菜谱
  menu_myOnlineCookbooks:'cookbook/myOnlineCookbooks',//查询 上传的菜谱列表
  menu_userOnlineCookbooks:'/cookbook/selectCookbooksByAccountId',//查询 用户上传的菜谱
  menu_detail:'cookbook/show',//菜谱详情
  menu_update:'cookbook/update',//菜谱更新
  menu_delete:'cookbook/delete',//菜谱删除


  /**特色首页 */

  noun_selectAll:'infoCookMix/selectAllInfoCookMix',//菜谱/资讯 混合接口 特色首页使用
  searchByKeyWordList:'infoCookMix/searchByKeywordList',//菜谱/资讯 混合接口 特色首页使用
  recommend_cooker:'chefRecommend/all',//推荐厨师
  /**商品列表 */
  goods_recommend_list:'goods/selectGoodsRecommend',//推荐商品列表
  goods_online_list:'goods/selectOnlineGoods',//上线商品列表

  /**我的店铺 */
  my_shop_apply:'shop/apply',//申请开店
  my_shop_Info:'shop/my',//我的店铺信息
  my_shop_manage:'shop/manage',//更新我的店铺信息
  my_shop_createCode:'shop/createCode',//生成二维码
  my_shop_goods_add:'goods/publish',//新增商品
  my_shop_goods_list:'goods/selectGoodsByShopId',//店铺所有商品列表
  my_shop_goods_show:'goods/show',//获取商品详情
  my_shop_goods_edit:'goods/complete',//修改商品
  my_shop_goods_del:'goods/delete',//删除商品
  my_shop_goods_on:'goods/onShow',//上架商品
  my_shop_goods_off:'goods/offShow',//下架商品
  my_shop_order:'shopOrder/my',//我店铺的订单
    my_shop_password:'shop/payPassword',//我店铺的密码
  nearbyShop:'shop/nearby',//附近商铺
  getShowById:'shop/showById',//通过 Id 获取商铺信息
  sumPrice:'shopOrder/sumPrice',//今日成交额
  inShopCheck:'/shop/checkPassword',//进入店铺验证
  withdraw_apply:'shopWithdraw/apply',//提现申请
  withdraw_check:'shopWithdraw/check',//提现验证
  withdraw_record:'shopWithdraw/record',//提现记录
  goods_comment:'goods/searchCommentByGoodsId',//获取商品评价
  all_shopOrder:'shopOrder/all',//我店铺订单所有订单

  /** */
  my_shop_goods_type:'goodsType/all',//商品类别查询
  /** 收货地址*/
  receive_address_update :'address/update',//更新收货地址
  receive_address_add :'address/add',//添加新的收货地址
  receive_address_my :'address/my',//我的收货地址列表
  receive_address_del :'address/delete',//删除收货地址
  receive_address_default :'address/default',//设置为默认收货地址

  /** 购物车*/
  shop_cart_add :'cart/add',//添加商品到购物车
  shop_cart_my :'cart/my',//我的购物车列表
  shop_cart_goods_add :'cart/addNum',//我的购物车列表
  shop_cart_goods_minus :'cart/minusNum',//我的购物车列表
  shop_cart_goods_del :'cart/delete',//删除购物条目
  shop_cart_addOrder :'order/add',//新增订单（提交订单）
  query_order :'order/my',//等待付款订单

  /** 我的订单*/
  business_order:'order/logistics',//物流价格
  /** */
  shop_agree_dada:'shop/agreeDada',//同意哒哒快递
  order_sure:'order/sure',//确认订单
  order_cancel:'order/cancel',//取消订单
  order_delete:'order/delete',//删除订单
  order_continue:'order/continue',//继续支付订单
  /** 直播*/
  live_open:'live/open',//开播认证
  live_begin:'live/my/push',//获取我的开播信息 推流信息
  live_auth:'live/auth/push',//直播推流鉴权
  live_pull_info:'live/my/pull',//直播播放信息
  live_pull_list:'live/now/list',//直播列表
  live_pull_url:'live/now/trigger',//获取直播url
  /** 绑定银行卡*/
  bind_bank_card:'shop/addBankCard',//绑定银行卡
  bind_bank_card_check:'shop/checkBankCard',//银行卡校验

  /** */
};

// let getGoodsManageList = () => {
//   return axios({
//     method: 'get',
//     url: url+'/goodsManageList.json',
//     data: {
//       // firstName: 'Fred',
//       // lastName: 'Flintstone'
//     }
//   })
// }
//
// let getInformations = (page) =>{
//   return axios({
//     method:'POST',
//     url:url+'information/selectOnlineInformations',
//     data:page
//   })
// }
// let myOnlineInformations = (page)=>{
//   return axios({
//     method:'POST',
//     url:'/base/information/myOnlineInformations',
//     data:page
//   })
// }


export {
  // getGoodsManageList,
  // getInformations,
  // myOnlineInformations
}
