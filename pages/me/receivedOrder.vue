<template>
  <div class="receivedOrder">
    <el-header className="go_back" title="待收"></el-header>
    <section class="content" style="background-color: #efefef" v-if="orderList.length">
      <div class="order-nav cl">
        <p class="fl">订单详情</p>
        <ul class="cl ">
          <li v-for="i,index in orderList" @click="chooseOrder(index,i)" :class="{on:index==orderIndex}">订单{{index+1}}</li>
        </ul>
      </div>
      <div class="detail">
        <p>店铺：{{orderDetail.cartShow.shopName}}  <span></span></p>
        <div class="goods-list">
          <ul class="cl">
            <li v-for="g in orderDetail.cartShow.items"><span class="fl">{{g.goodsName}}</span> <i class="price">￥{{g.goodsPrice}}/50g</i> <span class="num">&nbsp;{{g.goodsNum*50}}g</span> <span class="total">￥{{g.goodsPrice*g.goodsNum/10}}</span></li>
          </ul>
        </div>
        <p>配送费<span>￥{{orderDetail.goodsFreight}}</span></p>
        <!--<p>首单立减/优惠劵 <span>-￥5.00</span></p>-->
        <!--<p style="color: #7f7f7f;border: none;">总价￥10 优惠￥5 <span style="color: #000;">实付 <i style="color: #008842;">￥5</i></span></p>-->
        <p style="color: #7f7f7f;border: none;" class="cl"> <span style="color: #000;">总价 <i style="color: #008842;">￥{{parseFloat(orderDetail.goodsPrice) + parseFloat(orderDetail.goodsFreight)}}</i></span></p>
      </div>
      <div class="send-info">
        <p>配送信息</p>
        <div class="info">
          <p class="time">配送时间<span> <i v-if="orderDetail.logisticsType==1">上门自提</i>
            <i v-if="orderDetail.logisticsType==2">达达配送</i>
            <i v-if="orderDetail.logisticsType==3">顺丰快递</i>
              {{orderDetail.deliveryDate}}  {{orderDetail.deliveryTime}}</span></p>
          <div class="address cl">
            <span class="fl">配送地址:</span>
            <p class="fl">
              <i>{{orderDetail.receiverProvince}}{{orderDetail.receiverCity}}{{orderDetail.receiverArea}}{{orderDetail.receiverAddress}}</i>
              <i>{{orderDetail.receiverName}} {{orderDetail.receiverPhone}}</i>
            </p>
          </div>
        </div>
      </div>
    </section>
    <section class="content" style="background-color: #efefef" v-if="!orderList.length">
      <p style="text-align: center"> 没有待收货！</p>
    </section>
    <div class="btns">
      <ul>
        <!--<li>催单</li>-->
        <!--<li @click="goToReceivedOrderState()">订单状态</li>-->
        <li style="border: none;background-color: #008842;color: #fff;" @click="confirmReceive">确认收货</li>
      </ul>
    </div>
  </div>
</template>

<script>
  import Header from '@/components/Head'
export default {
  name: 'receivedOrder',
  data () {
    return {
        title: '',
      m:1,
      orderIndex:0,
      orderList:[],
      orderDetail:{}
    }
  },
  created(){
    this.getMyOrderList()
  },
  components:{
    'el-header':Header
  },
  methods:{
    goToWrite () {
        this.$router.push({name:'writeAppraise'})
    },
    chooseOrder(i){
      this.orderIndex = i
    },
    goToReceivedOrderState(){
        this.$router.push({name:'receivedOrderState'})
    },
    confirmReceive(){
      this.$http.post(this.API.buyerConfirm,{
          id:this.orderDetail.id
      }).then(res=>{

      }).catch(err=>{

      })
    },
    getMyOrderList(){//获取订单列表
      this.$http.post(this.API.query_order,{
        currentPage:'1',
        pageSize:'1000',
        status:3 //待付款   3//待发货"  4已发货
      }).then(res=>{
        this.orderList = res.data.data.data;
        let that = this;
        if(this.orderId){
          this.orderList.forEach(function (n,i) {
            if(n.id===that.orderId){
              that.orderType = n.cartShow.shopType
              that.chooseOrder(i,n)
              return
            }
          });
        }else{
          this.orderDetail=res.data.data.data[0]
          this.orderType = res.data.data.data[0].cartShow.shopType
          this.chooseTime(this.orderType==2?1:3)
        }
      }).catch(err=>{
        console.log(err)
      })
    },
    chooseOrder(i,item){//选择订单
      this.orderIndex = i
      this.orderDetail=item
      this.orderType = item.cartShow.shopType
    },
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .btns li{
    font-size: 1.333rem;
    background-color: #bddbcb;
    /*width: 33.333%;*/
    width:100%;
    border-right: 1px solid #ffffff;
    line-height: 3.611rem;
    text-align: center;
  }
  .btns{
    height: 3.611rem;
    width: 100%;
    position: absolute;
    bottom:0;
  }
  .address>p>i{
    display: block;
  }
  .address>p{
    white-space:normal;
    width: 23rem;
    padding-left: 1rem;
  }
  .address{
    padding:1rem
  }
  .time>span{
    padding-left: 1rem;
  }
  .time{
    padding: 1rem;
    border-bottom: 1px solid #efefef;
  }
  .info{
    font-size: 1.1rem;
    background-color: #fff;
  }
  .send-info>p{
    padding: .5rem 1rem;
    color: #008842;
  }
  .price{
    margin-right: 2rem;
  }
  .num{
    margin-right: 2rem;
    color: #868686;
  }
  .total{
  }
  .goods-list{
    border-bottom: 1px solid #efefef;
  }
  .goods-list li{
    text-align: right;
    float: none;
    padding:1rem;
    line-height: 2rem;
  }
  .order-nav>ul::-webkit-scrollbar{
    display: none;
  }
 .order-nav>ul{

   overflow: auto;
   text-overflow: clip;
 }
 .order-nav{
   padding: .5rem 1rem 0 1rem;
 }
 .order-nav>ul>li.on{
   background-color: #008842;
   color: #fff;
 }
 .order-nav>ul>li{
   background-color: #f9f9f9;
   padding: 0 1rem;
   margin-right: .5rem;
   line-height: 2.4rem;
   display: inline-block;
   float: none;
 }
 .order-nav>p{
   color: #008842;
   margin-right: 2rem;
   line-height: 2.4rem;
 }
  .detail>p>span{
    float: right;
  }
  .detail>p{
    padding:1rem 1rem;
    border-bottom: 1px solid #efefef;
  }
  .detail{
    font-size: 1.1rem;
    color: #000;
    background-color: #fff;
    padding:.5rem 0;
  }
</style>
