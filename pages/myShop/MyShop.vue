<template>
  <div class="my_shop">
    <el-header className="go_back" title='我的店铺'>
      <a class="refresh"></a>
    </el-header>
    <!--<section class="content" v-if="haveData" style="padding-bottom: 0">-->
    <section class="content"  style="padding-bottom: 0">
      <div class="about_me">
        <div class="head_img"><img v-lazy="shopInfo.shopImg" alt=""></div>
        <div class="head_text">
          <h4>{{shopInfo.shopName}}</h4>
          <p>店铺ID:{{shopInfo.shopNo}}</p>
          <a @click="goToUserManage">店铺管理</a>
        </div>
      </div>
      <!--<div v-if="haveShop">-->
      <div>
        <ul class="today-data cl">
          <li @click="goToTodayMoney">
            <span>今日成交总额</span>
            <p>￥{{shopInfo.todayTotalPrice.toFixed(2)}}</p>
          </li>
          <li @click="goToWithdrawCashMoney">
            <span>可提现额</span>
            <p>￥{{shopInfo.todayWithdrawPrice.toFixed(2)}}</p>
          </li>
          <li>
            <span>今日订单</span>
            <p>{{shopInfo.todayCountOrders}}</p>
          </li>
        </ul>
        <ul class="order-list cl">
          <li @click="goToAddGoods"><div></div><p>发布商品</p></li>
          <li @click="goToGoodsManage"><div></div><p>商品管理</p></li>
          <li @click="goToOrderManage"><div></div><p>订单管理</p></li>
          <li class="bd-t" @click="agreeDada()"><div></div><p>新手必学</p></li>
          <li class="bd-t" @click="goToMyShop"><div></div><p>店铺首页</p></li>
          <!--<li class="bd-t" @click="goToOpenShop"><div></div><p>催单</p></li>-->
        </ul>
        <img src="../../assets/img/myShop/banner2.jpg" alt="" style="margin-top: .5rem;height: auto;border-top:3px solid #efefef;padding-top: .3rem">
      </div>
      <!--<div v-if="!haveShop" class="open-button">-->
        <!--<button type="button" @click="goToNewShop">申请开店</button>-->

      <!--</div>-->
      <!--<div v-if="!haveShop" class="banner">-->
        <!--<img src="../../assets/img/myShop/banner.png" alt="">-->
      <!--</div>-->
    </section>
    <!--<el-footer :choose=5></el-footer>-->
  </div>
</template>

<script>
  import Footer from '@/components/Foot'
  import Header from '@/components/Head'
  import {Indicator, MessageBox} from 'mint-ui';
export default {
  name: 'myShop',
  data () {
    return {
      haveShop:false,
      haveData:false,
      shopInfo:'',
      todaySunPrice:0,
    }
  },
  components:{
    'el-footer':Footer,
    'el-header':Header
  },
  created(){
    this.shopInfo = JSON.parse(localStorage.getItem('shopInfo'))
//    this.getTodaySumPrice()
  },
  methods:{
//    getTodaySumPrice(){//获取今日的成交额度
//      this.$http.post(this.API.sumPrice,{
//          date:this.formatDate(new Date())
//      }).then(res=>{
//        console.log(res.data)
//        this.todaySunPrice = res.data.data
//      }).catch(err=>{
//        console.log(err)
//      })
//    },
    formatDate(d){
      return  d.getFullYear()+'-'+((d.getMonth()+1)>9?(d.getMonth()+1):('0'+(d.getMonth()+1)))+'-'+(d.getDate()>9?d.getDate():'0'+d.getDate())
    },
    goToAddGoods () {
        if(!this.shopInfo.shopProvince){
          this.alertNotify()
          return;
        }
      this.$router.push({name:'AddGoods'})
    },
    alertNotify(){
      MessageBox({
        title: '提示',
        message: '请前往"店铺管理"完善店铺资料！',
        showCancelButton: true
      }).then(res => {
        if (res === 'confirm') {
          this.goToUserManage()
        } else {
        }
      });
    },
    goToGoodsManage () {
      if(!this.shopInfo.shopProvince){
        this.alertNotify();
        return;
      }
      this.$router.push({name:'GoodsManage'})
    },
    goToUserManage () {
        this.$router.push({name:'UserManage'})
    },
    goToOrderManage () {
      if(!this.shopInfo.shopProvince){
        this.alertNotify()
        return;
      }
      this.$router.push({name:'OrderManage'})
    },
    goToBalanceMoney () {
      this.$router.push({name:'BalanceMoney'})
    },
    goToOpenShop () {
      this.$router.push({name: 'NewShop'})
    },
    goToMyShop(){
        sessionStorage.setItem('shopId', this.shopInfo.id)
      this.$router.push({name: 'sellerStore'})
    },
    goToWithdrawCashMoney(){
      this.$router.push({name: 'withdrawCashMoney'})
    },
    goToTodayMoney(){
      this.$router.push({name: 'todayMoney'})
    }
  },
  destroyed () {
    window.page=''
//    alert(123)
  },
  mounted(){
    window.page = 'myShop'
  }
}
</script>

<style scoped>
  .banner{
    width: 80%;
    margin: 3rem auto;
  }
  .refresh{
    right:0;
    background: url("../../assets/img/myShop/shuax.png") no-repeat center center /2rem;
  }
  .open-button>button{
    width: 100%;
    height: 5rem;
    background-color: #008842;
    color: #ffffff;
    font-size: 1.3rem;
  }
  .open-button{
    text-align: center;
  }
  .bd-t{
    border-top:1px solid #efefef;
  }
  .order-list>li:nth-child(1)>div{
    background: url("../../assets/img/myShop/shop_icon1.png") #feb664 no-repeat center center /1.611rem;
  }
  .order-list>li:nth-child(2)>div{
    background: url("../../assets/img/myShop/shop_icon2.png") #abd788 no-repeat center center /1.611rem;
  }
  .order-list>li:nth-child(3)>div{
    background: url("../../assets/img/myShop/shop_icon3.png") #fc8587 no-repeat center center /1.611rem;
  }
  .order-list>li:nth-child(4)>div{
    background: url("../../assets/img/myShop/shop_icon4.png") #87d9c2 no-repeat center center /1.611rem;
  }
  .order-list>li:nth-child(5)>div{
    background: url("../../assets/img/myShop/dpsy.png") #c9a9f4 no-repeat center center /2.11rem;
  }
  .order-list>li:nth-child(6)>div{
    background: url("../../assets/img/myShop/shop_icon6.png") #90caf8 no-repeat center center /1.611rem;
  }
  .order-list>li>p{
    line-height: 3rem;
    font-size: .833rem;
  }
  .order-list>li>div{
    width: 4.111rem;
    height:4.111rem;
    margin: 1.388rem auto 0;
    -webkit-border-radius:50%;
    -moz-border-radius:50%;
    border-radius:50%;
    background-color: #90caf8;
  }
  .order-list>li:not(:nth-child(3n)){
    border-right:1px solid #efefef;
  }
  .order-list>li{
    width: 33.333%;
    text-align: center;
  }
  .today-data{
    padding: 1rem 0;
    border-bottom: 3px solid #efefef;
  }
  .today-data>li>p{
    font-size:1.333rem;
    line-height: 1.8rem;
  }
  .today-data>li>span{
    font-size: .833rem;
  }
  .today-data>li:not(:last-child){
    border-right:1px solid #008842;
  }
  .today-data>li{
    float: left;
    width:33.333%;
    text-align: center;
  }
  .head_text>a{
    font-size: .833rem;
    display: block;
    position: absolute;
    right:2rem;
    top:0;
    line-height: 6.611rem;
  }
  .head_text>p>span{
    display: inline-block;
    width:.972rem;
    height:.972rem;
    background: url("../../assets/img/me/star.png") no-repeat center center /.972rem;
  }
  .head_text{
    padding: 2rem 0 0 7rem;
  }
  .head_img{
    position: absolute;
    margin: auto;
    top:0;
    bottom:0;
    left:1.75rem;
    width:4.333rem;
    height:4.333rem;
    -webkit-border-radius:50%;
    -moz-border-radius:50%;
    border-radius:50%;
    background: url("../../assets/img/myShop/logo.png") no-repeat center center /4.333rem;
    overflow: hidden;
  }
  .about_me{
    vertical-align: middle;
    height: 6.611rem ;
    width: 100%;
    background-color: #f6f6f6;
    position: relative;
  }
</style>
