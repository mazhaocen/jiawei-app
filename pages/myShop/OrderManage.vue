<template>
  <div class="order_manage">
    <el-header title='订单管理' className="go_back"></el-header>
    <section class="content" style="padding-bottom: 0;padding-top: 7rem">
      <ul class="order-manage-type cl pa">
        <li :class="{active:chooseType=='all'}" @click="orderChoose('all')">全部</li>
        <!--<li> &nbsp </li>-->
        <li :class="{active:chooseType=='1'}" @click="orderChoose('1')">待配送</li>
        <li :class="{active:chooseType=='2'}" @click="orderChoose('2')">配送中</li>
        <li :class="{active:chooseType=='4'}" @click="orderChoose('4')">已完成</li>
        <!--<li @click="orderChoose('more')">更多</li>-->
      </ul>
      <div class="datePick pa">开始日期：<input type="date" v-model="startDate">结束日期：<input type="date" v-model="endDate"></div>
      <div class="order-manage-list" v-for=" (item ,index) in orderList">
        <h3>#{{index + 1}}</h3>
        <div class="buyer-info">
          <h4>配送信息</h4>
          <p><i>配送时间</i><span>{{item.deliveryDate}}  {{item.deliveryTime?item.deliveryTime:(item.cartShow.shopType==1?'顺丰快递':'上门自提')}}</span></p>
          <p class="cl" style="border: none;"><i>配送地址</i><span>{{item.receiverName}} <i>{{item.receiverPhone}}</i></span><span
            class="buyer-info-address">{{item.receiverProvince}}{{item.receiverCity}}{{item.receiverArea}}{{item.receiverAddress}}</span></p>
          <div class="buyer-info-btn">
            <!--<button v-if="!chooseSend" @click="sendChoose('自己配送')">自己配送</button>-->
            <!--<button v-if="!chooseSend" @click="sendChoose('发起配送')">发起配送</button>-->
            <!--<button v-if="chooseSend" class="active">已经{{chooseSend}}</button>-->
          </div>
        </div>
        <div class="order-info">
          <h4>订单详情</h4>
          <ul class="cl pd-1">
            <li v-for="list in item.cartShow.items">
              <span class="dishes">{{list.goodsName}}</span>
              <span class="price">¥{{list.goodsPrice}}/500g</span><span class="number">{{list.goodsNum*50}}g</span><span class="total-price">¥{{list.goodsPrice*list.goodsNum/10}}</span>
            </li>
          </ul>
          <ul class="cl pd-1 order-other">
            <li><span>配送费</span><span></span><span>顺丰快递</span><span class="fr">¥{{item.logisticsFreight}}</span></li>
            <li><span>小计</span><span></span><span></span><span class="fr">¥{{parseFloat(item.totalPrice.toFixed(2))}}</span></li>

            <!--<li><span>活动支出</span><span></span><span></span><span class="fr">¥1.20</span></li>-->
            <!--<li><span>平台服务费</span><span></span><span></span><span class="fr">-¥0.00</span></li>-->
            <!--<li><p>本单预计收入<span>¥15.7</span></p></li>-->
            <!--<li>-->
              <!--<button @click="cancelOrder" v-if="orderStatus">取消订单</button>-->
              <!--<button v-if="orderStatus">打包打印订单</button>-->
              <!--<button v-if="!orderStatus" :class="{status:!orderStatus}">订单以取消</button>-->
            <!--</li>-->
            <li>{{item.dealTime}}下单  / 订单编号：{{item.orderCode}}</li>
          </ul>
        </div>
      </div>
      <p v-if="!orderList.length" style="line-height: 4rem;font-size: 1.2rem;color: #008842;text-align: center">选择日期内没有订单!</p>
    </section>
  </div>
</template>

<script>
  import Footer from '@/components/Foot'
  import Header from '@/components/Head'
  import {MessageBox, Toast,Indicator} from 'mint-ui';
  import {getLocation} from '@/service/service'

  export default {
    name: 'orderManage',
    data () {
      return {
        popupVisible: false,
        value: [],
        options: [],
        chooseType: 'all',
        chooseSend: '',
        orderStatus: '1',
        address: [],
        localaddress: '',
        gpsAddress: '',
        gpserr:'',
        num:0,
        addressErr:'',
        orderList:[],
        startDate:'',
        endDate:''
      }
    },
    components: {
      'el-footer': Footer,
      'el-header': Header,
    },
    created(){
        this.startDate = this.formatDate(new Date)
//      this.getMyShopOrder()
    },
    mounted () {
    },
    watch:{
        'startDate'(newV,oldV){
          if(this.endDate && new Date(newV).getTime()>new Date(this.endDate).getTime()){
            this.endDate = this.startDate
          }
          this.getMyShopOrder()
        },
      'endDate'(newV,oldV){
        if(new Date(newV).getTime()<new Date(this.startDate).getTime()){
          this.startDate = this.endDate
          this.getMyShopOrder()
        }
      }
    },
    methods: {
      getMyShopOrder(status){
          Indicator.open()
        this.$http.post(this.API.my_shop_order,{
          currentPage:1,
          pageSize:1000,
          startDate:this.startDate,
          endDate:this.endDate,
          status:status?status:''//BEFORE_SEND(1, "待发货"),SENDING(2, "配送中"),AFTER_SEND(3, "已收货"),FINISH(4, "已完成");
        }).then(res=>{
          Indicator.close()
          this.orderList = res.data.data.data
        }).catch(err=>{
          Indicator.close()
            console.log(err)
        })
      },
      orderChoose (type){
        this.chooseType = type
        this.getMyShopOrder(type)
      },
      sendChoose (type) {
        MessageBox({
          title: '提示',
          message: '您确定' + type + '？',
          showCancelButton: true,
          confirmButtonText: '确定'
        }).then(res => {
          if (res === 'confirm') {
            this.chooseSend = type
            Toast({
              message: '选择' + type + '成功',
              iconClass: 'mintui mintui-success'
            });
          } else {
          }
        });
      },
      cancelOrder(){
        MessageBox({
          title: '提示',
          message: '您确定取消订单吗？',
          showCancelButton: true,
          confirmButtonText: '确定'
        }).then(res => {
          if (res === 'confirm') {
            this.orderStatus = 0
            Toast({
              message: '订单取消成功',
              iconClass: 'mintui mintui-success'
            });
          } else {

          }
        });
      },
      formatDate(d){
        return d.getFullYear() + '-' + (d.getMonth() + 1>9?d.getMonth() + 1:'0'+(d.getMonth() + 1)) + '-' + (d.getDate()>9?d.getDate():'0'+d.getDate())
      },
    }
  }
</script>

<style scoped>
  .datePick>input{
    background-color: #fff;
    color: #333;
    height: 3rem;
    width: 8rem;
  }
  .datePick{
    width: 100%;
    background-color: #fff;
    line-height: 3rem;
    padding: 0 1rem;
    font-size: 1.2rem;
    border-bottom: 1px solid #efefef;
    top:6.75rem;
  }
  .order-manage-type > :not(:last-child) {
    border-right: 1px solid #008842;
  }

  .order-manage-type > li.active {
    background-color: #008842;
    color: #ffffff;
  }

  .order-manage-type {
    background-color: #fff;
    width: 100%;
    border-top: 3px solid #efefef;
    border-bottom: 3px solid #efefef;
    padding: .3rem 0;
    top:3.661rem;
  }

  .order-manage-type > li {
    width: 25%;
    text-align: center;
    line-height: 2rem;
  }

  .order-other > li:last-child{
    color: #999;
    font-size: .733rem;
  }

  .order-other > li:nth-child(6) > button.status {
    border: 1px solid gray;
  }

  .order-other > li:nth-child(6) > button {
    background-color: #ffffff;
    border: 1px solid #008842;
    border-radius: 2px;
    padding: .5rem 1rem;
    margin-left: .5rem;
  }

  .order-other > li:nth-child(6) {
    text-align: right;
  }

  .order-other > li:nth-child(5) > p > span {
    color: #008842;
    float: right;
    width: 15%;
  }

  .order-other > li:last-child > p {
    font-size: 1.111rem;
  }

  .order-info > ul > li > span:nth-child(1) {
    width: 40%;
  }

  .order-info > ul > li > span:nth-child(2) {
    width: 25%;
  }

  .order-info > ul > li > span:nth-child(3) {
    width: 20%;
    color: #999;
  }

  .order-info > ul > li > span:nth-child(4) {
    width: 15%;
  }

  .order-info > ul {
    border-bottom: 1px solid #efefef;
  }

  .order-info > ul > li {
    width: 100%;
    line-height: 2.2rem;
  }

  .order-info > ul > li > span {
    display: inline-block;
  }

  .buyer-info-btn {
    text-align: right;
    padding: 0 1rem;
  }

  .buyer-info-btn > button.active {
    background-color: #008842;
    color: #ffffff;
  }

  .buyer-info-btn > button {
    background-color: #ffffff;
    border: 1px solid #008842;
    color: #008842;
    padding: .2rem .5rem;
    margin-left: .5rem;
  }

  .order-manage-list {
    line-height: 2.8rem;
    border: 1px solid #efefef;
    margin: .5rem;
  }

  .order-manage-list > h3 {
    padding: 0 1rem;
    border-top: 1px solid #efefef;
  }

  .buyer-info > p {
    border-bottom: 1px solid #efefef;
    padding: 0 1rem;
  }

  .order-manage-list h4 {
    background-color: #efefef;
    color: #008842;
    padding: 0 1rem;
    line-height: 2.8rem;
    font-weight: normal;
  }

  .buyer-info > p > span {
    float: right;
    width: 83%;
  }

  .buyer-info-address {
    line-height: 2rem;
    white-space: pre-wrap;
  }

  .buyer-info > p > i {
    color: #747474;
  }
</style>
