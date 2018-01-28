<template>
  <div class="payOrder">
    <el-header className="go_back" title="待付款"></el-header>
    <section class="content" style="background-color: #efefef" v-if="orderList.length">
      <div class="order-nav cl">
        <p class="fl">订单列表</p>
        <ul class="cl ">
          <li v-for="i,index in orderList" @click="chooseOrder(index,i)" :class="{on:index==orderIndex}">订单{{index + 1}}</li>
        </ul>
      </div>
      <div class="detail">
        <p>店铺：<i>{{orderDetail.cartShow.shopName}} </i><span @click="orderDelete(orderDetail.id)">删除订单</span></p>
        <div class="goods-list">
          <ul class="cl">
            <li v-for="g in orderDetail.cartShow.items"><span class="fl">{{g.goodsName}}</span>
              <i class="price">￥{{g.goodsPrice}}/500g</i>
              <span class="num">&nbsp;{{g.goodsNum * 50}}g</span>
              <span class="total">￥{{(g.goodsPrice * g.goodsNum / 10).toFixed(2)}}</span></li>
          </ul>
        </div>
      </div>
      <div class="send-info">
        <p>配送信息</p>
        <div class="info">
          <div class="address pd-1 send" @click="chooseSendType()">配送时间:
            <span>{{orderDetail.deliveryDate?orderDetail.deliveryDate:formatDate(new Date)}}</span>
            <span>{{orderDetail.deliveryTime}}</span>
            <span>{{orderDetail.goodsFreight}}元</span>
          </div>
          <div class="address cl">
            <span class="fl">配送地址:</span>
            <p class="fl">
              <i>{{orderDetail.receiverProvince}}{{orderDetail.receiverCity}}{{orderDetail.receiverArea}}{{orderDetail.receiverAddress}}</i>
              <i>{{orderDetail.receiverName}} {{orderDetail.receiverPhone}}</i>
            </p>
          </div>
        </div>
      </div>
      <!--<pre>-->
          <!--{{sendInfo}}-->
          <!--{{resolveInfo}}-->
          <!--{{sendMsg}}-->

      <!--</pre>-->
      <div class="btns shoppingCart_foot">
        <div class="settlement">
          <h3 class="cl"><i class="fl">当前订单</i> <i class="fr">总金额
            <span class="" >￥{{parseFloat(orderDetail.goodsPrice) + orderDetail.goodsFreight}}</span>
            <!--<span class="" v-if="orderDetail.goodsFreight">￥{{parseFloat(orderDetail.goodsPrice)}}</span>-->
          </i></h3>
          <button @click="orderSure()">结算</button>
          <!--<button @click="payShow=true">结算</button>-->
        </div>
      </div>
    </section>
    <section class="content" style="background-color: #efefef" v-if="!orderList.length">
      <p style="text-align: center"> 没有待支付订单！{{orderList.length}}</p>
    </section>
    <!--配送时间弹窗-->
    <!--<mt-popup v-model="popupVisible" position="bottom" style="width: 100%;height: 23rem;padding-top:0">-->
    <mt-popup v-model="popupVisible" position="bottom" style="width: 100%;height: 23rem;padding-top:0">
      <div v-if="orderDetail.logisticsType!=3">
        <p class="chooseBtn">
          <button @click="cancel">取消</button>
          <button style="background-color: #999999" v-if="slots[2].values[0]==='今日结束配送' || !send[0] || !send[1]">确定</button>
          <button @click="sure" v-if="slots[2].values[0]!=='今日结束配送' && send[0] && send[1]">确定</button>
        </p>
        <p style="padding: 1rem 0 1rem 1rem;font-size: 1.2rem;">配送时间:</p>
        <p style="text-align: center;font-size: 1.2rem;padding: 1rem 0" v-if="popupVisible">{{sendInfo.dadaLogistics.logisticsFreight}}元</p>
        <mt-picker :slots="slots" @change="onValuesChange" :visibleItemCount="3"></mt-picker>
      </div>
      <div v-if="orderDetail.logisticsType==3" class="sfExpress">
        <div v-for="item in sendInfo.sfLogistics" @click="chooseSf(item)" >
          <h3>{{item.limitTypeName}}：</h3>
          <p>预计时效：{{item.deliverTime}} <span class="fr">运费：{{item.freight}}</span></p>
        </div>
      </div>

    </mt-popup>
    <!--选择快递弹窗-->
    <mt-popup v-model="expressShow" position="bottom" class="expressList">
      <div @click="expressShow=false">
        <img v-if="orderDetail.cartShow.shopType==2" @click="chooseType(1)" style="top: 12%;" src="../../assets/img/shoppingCart/ziting.png" alt="">
        <img v-if="orderDetail.cartShow.shopType==2" @click="chooseType(2)" style="top:34%" src="../../assets/img/shoppingCart/dada.png" alt="">
        <img v-if="orderDetail.cartShow.shopType==1" @click="chooseType(3)" style="top:34%" src="../../assets/img/shoppingCart/shunf.png" alt="">
      </div>
    </mt-popup>
    <!--确认支付弹窗-->
    <mt-popup  v-model="payShow" position="bottom" style="width: 100%;height: 100%;" class="pa">
      <el-header title="确认支付">
        <a class="go_back" @click="payShow=false"></a>
      </el-header>
      <div class="content choosePay">
        <span v-if="payShow">当前支付 <i class="fr">￥{{parseFloat(orderDetail.goodsPrice) + orderDetail.goodsFreight}}</i></span>
        <p>选择支付方式</p>
        <ul>
          <!--<li class="qb" :class="{'on':payMethod=='1'}" @click="payMethod=1">钱包支付 <span></span></li>-->
          <li class="wx" :class="{'on':payMethod=='2'}" @click="payMethod=2">微信支付 <span></span></li>
          <li class="ali" :class="{'on':payMethod=='3'}" @click="payMethod=3">支付宝支付 <span></span></li>
        </ul>
        <button @click="paySure">确认支付</button>
      </div>
    </mt-popup>
  </div>

</template>

<script>
  import Header from '@/components/Head'
  import {Picker, Popup, MessageBox, Toast} from 'mint-ui'
  import CITYS from '../../../static/json/city.json'
  export default {
    name: 'payOrder',
    data () {
      return {
        title: '',
        m: 1,
        orderIndex: 0,
        expressShow: false,
        popupVisible: false,
        sendDate: this.formatDate(new Date),
        sendPrice: 0,
        slots: [
          {
            flex: 1,
            values: [this.formatDate(new Date), this.formatDate(new Date(Date.parse(new Date()) + 86400000))],
            className: 'slot1',
            textAlign: 'right',
            defaultIndex: 2
          }, {
            divider: true,
            content: '-',
            className: 'slot2'
          }, {
            flex: 1,
            values: ['即时配送(1小时内达到)', '17:30-18:00', '18:00-18:30'],
            className: 'slot3',
            textAlign: 'left',
            defaultIndex: 3,
          }
        ],
        orderList: [],
        orderDetail: {
          cartShow: {}
        },
        payShow: false,
        payMethod: 1,
//        sendInfo: {
//          goodsFreight: 0,
//        },
        allCity:'',
        sendInfo:'',
        resolveInfo:'',
        sendMsg:'',
        send:[]
      }
    },
    created(){
      this.orderId = this.$route.params.orderId
      this.getMyOrderList()
      this.allCity = CITYS;

//
//      this.formatAddress('福建','福州','鼓楼')
    },
    components: {
      'el-header': Header,
      'mt-picker': Picker,
      'mt-popup': Popup
    },
    methods: {
        //切换快递
      chooseSendType(){
//        if (this.orderDetail.status == 2) {
//          MessageBox('提示', '该订单您已经确认过了,无法修改订单信息，如需修改请从新下单！');
//          return
//        }
        this.expressShow = true
      },
      //选择订单
      chooseOrder(i, item){
        this.orderIndex = i
        this.orderDetail = item
        if(this.orderDetail.logisticsType){
        }else{
          this.chooseType(item.cartShow.shopType == 1 ? 3 : 1)
        }
      },
      //获取订单列表
      getMyOrderList(){
        this.$http.post(this.API.query_order, {
          currentPage: '1',
          pageSize: '1000',
          status:1 //1,2待付款   3//待发货  4配送中 5已收货 6 已完成
        }).then(res => {
          this.orderList = res.data.data.data;
          this.orderDetail = this.orderList[0]
          if(this.orderDetail.status===1){
            this.chooseType(this.orderDetail.cartShow.shopType == 2 ? 1 : 3) //this.orderType 2为附近商铺  1 为农家自产  后面1 为自提  3 为顺丰
          }
        }).catch(err => {
          console.log(err)
        })
      },
      //选择快递 配送时间
      chooseType(index){//index  1 为自提  2为达达 3 为顺丰
        this.expressShow = false;
        this.$http.post(this.API.business_order, {//查询物流 运费
          id: this.orderDetail.id,
          logisticsType: index, //1 自取 2达达 3 顺丰
          weight:''

        }).then(res => {
//          console.log(JSON.stringify(res));
          if (res.data.status === 1) {
            this.sendInfo = res.data.data;
            if (index == 1) {
              this.orderDetail.deliveryDate = this.formatDate(new Date());
              this.orderDetail.deliveryTime = '上门自提';
              this.orderDetail.goodsFreight = 0;
              this.orderDetail.logisticsNo = '';
              this.orderDetail.logisticsType=1
              this.orderDetail.sfExpressType = 0
            }
            if (index == 3) {
              this.orderDetail.deliveryDate = this.formatDate(new Date());
              this.orderDetail.deliveryTime = '请选择快递';
              this.orderDetail.logisticsNo = '';
              this.orderDetail.logisticsType=3
              this.popupVisible = true;
            }
            if (index == 2) {
              this.popupVisible = true;
              this.orderDetail.logisticsType = 2;
              this.slots[0].defaultIndex = 0;
              this.slots[2].defaultIndex = 0;
            }
          } else if (res.data.status === 0) {
            MessageBox('提示', res.data.message);
          }

        })
      },
      //删除订单
      orderDelete(id){
        MessageBox({
          title: '提示',
          message: '您确定删除该订单吗？',
          showCancelButton: true,
        }).then(res => {
          if (res === 'confirm') {
            this.$http.post(this.API.order_delete, {
              id: id
            }).then(res => {
              if (res.data.status == 1) {
                this.orderList.splice(this.orderIndex, 1)
                Toast({
                  message: '删除成功',
                  iconClass: 'mintui mintui-success'
                });
                this.getMyOrderList()
              }
            }).catch(err => {
            })
          } else {
          }
        });
      },
      //取消订单
      orderCancel(id){
        MessageBox({
          title: '提示',
          message: '您确定取消该订单吗？',
          showCancelButton: true,
        }).then(res => {
          if (res === 'confirm') {
            this.$http.post(this.API.order_cancel, {
              id: id
            }).then(res => {
              if (res.data.status == 1) {
                this.orderList.splice(this.orderIndex, 1)
                Toast({
                  message: '取消成功',
                  iconClass: 'mintui mintui-success'
                });
              }
            }).catch(err => {
            })
          } else {
          }
        });
      },
      //确定订单 准备支付（结算）
      orderSure(){
        if(!this.orderDetail.goodsFreight && this.orderDetail.logisticsType!=1){
            alert('请选择快递');
            return
        }
        this.payShow = true
//      this.$router.push({name:'payFor'})
      },
      //确定支付
      paySure(){
        let params = {
          id: this.orderDetail.id,
          payType: 1,
          logisticsType: this.orderDetail.logisticsType,//物流类别
          logisticsNo: this.orderDetail.logisticsNo,//物流单号
          goodsFreight: this.orderDetail.goodsFreight ? 0.01 : 0,//物流运费
          deliveryDate: this.orderDetail.deliveryDate || this.formatDate(new Date()),//配送日期
          deliveryTime: this.orderDetail.deliveryTime//配送时间
        };
//        console.log(params)
//        return
        if (this.payMethod === 1) {

        }
        if (this.payMethod === 3) {//选择支付宝支付
          params.payType = 1
        }

        if (this.payMethod === 2) {//选择微信支付
          params.payType = 2
        }


//        console.log(JSON.stringify(params));
//        if (this.orderDetail.status === 1) {
          this.newPay(params)
//        } else {
//          this.continuePay(this.orderDetail.id,params.payType)
//        }
      },
      //状态为1时新的支付
      newPay(params){
        this.$http.post(this.API.order_sure, params).then(res => {
          if (res.data.status == 1) {
            if (this.payMethod === 3) {
              this.alipay(res.data.data)
            }
            if (this.payMethod === 2) {
              this.wxpay(res.data.data.split('&'))
            }

          } else {
            MessageBox('提示', res.data.message);
          }
        }).catch(err => {
          console.log(err)
        })
      },
      //状态为2时 继续支付
      continuePay(id,type){
        this.$http.post(this.API.order_continue, {id: id,payType:type}).then(res => {
          if (res.data.status == 1) {
            if (this.payMethod === 3) {
              this.alipay(res.data.data)
            }
            if (this.payMethod === 2) {
              this.wxpay(res.data.data.split('&'))
            }
          } else {
            MessageBox('提示', res.data.message);
          }
        }).catch(err => {
          console.log(err)
        })
      },
      //阿里支付
      alipay(info){
        var aliPayPlus = api.require('aliPayPlus');
        let that = this
        aliPayPlus.payOrder({
          orderInfo: info
        }, function (ret, err) {
          if (ret.code == 9000) {
            that.payShow = false;
            MessageBox.alert('提示', '支付成功！').then(action => {
              that.getMyOrderList()
            });

          }
          if (ret.code == 8000) {
            that.payShow = false;
            MessageBox.alert('提示', '正在处理中，支付结果未知（有可能已经支付成功），请查询商户订单列表中订单的支付状态！').then(action => {
              that.getMyOrderList()
            });
          }
          if (ret.code == 4000) {
            that.payShow = false;
            MessageBox.alert('提示', '订单支付失败！').then(action => {
              that.getMyOrderList()
            });
          }
          if (ret.code == 6001) {
            that.payShow = false;
            MessageBox.alert('提示', '订单支付取消！').then(action => {
              that.getMyOrderList()
            })
          }
          if (ret.code == 6002) {
            that.payShow = false;
            MessageBox.alert('提示', '网络连接出错！').then(action => {
              that.getMyOrderList()
            });
          }
          if (ret.code == 6004) {
            that.payShow = false;
            MessageBox.alert('提示', '支付结果未知（有可能已经支付成功），请查询商户订单列表中订单的支付状态！').then(action => {
              that.getMyOrderList()
            });
          }

          console.log(JSON.stringify(ret))
        });
      },
      wxpay(info){
        console.log(info);
        let that = this;
        let params = {
          apiKey: info[0].split('=')[1],
          orderId: info[3].split('=')[1],
          mchId: info[2].split('=')[1],
          nonceStr: info[1].split('=')[1],
          timeStamp: info[4].split('=')[1],
          sign: info[5].split('=')[1],
          package:'Sign=WXPay'
        }
        console.log(JSON.stringify(params))
        var wxPay = api.require('wxPay');
        wxPay.payOrder(params, function (ret, err) {
          if (ret.status) {
            MessageBox.alert('提示', '支付成功！').then(action => {
              that.getMyOrderList()
            });
          } else {
              if(err.code==-2){
                MessageBox.alert('提示', '订单支付取消！').then(action => {
                  that.getMyOrderList()
                })
              }
//            alert(err.code);
          }
        });
      },


      onValuesChange(picker, values) {
//       console.log(new Date(values[0]).getTime(),new Date().getTime())
        if(new Date(values[0]).getTime()>new Date().getTime()){
           console.log('第二天')
          this.getTomorrowTimeList()
        }else{
          console.log('今天')
          this.getTodayTimeList()
        }
        this.send = picker.getValues()
        console.log(this.send)
      },
      //确定配送时间
      sure(){
        console.log(this.send)
        this.orderDetail.sfExpressType = 0
        this.popupVisible = false;
//        this.sendDate = this.send[0];
//        this.sendTime = this.send[1];
        this.orderDetail.deliveryDate = this.send[0];
        this.orderDetail.deliveryTime = this.send[1];
        this.orderDetail.goodsFreight = this.sendInfo.dadaLogistics.logisticsFreight;
        this.orderDetail.logisticsNo = this.sendInfo.dadaLogistics.logisticsNo;
        this.orderDetail.logisticsType=3
      },
      chooseSf(item){
          if(item.limitTypeName=='顺丰标快'){
            this.orderDetail.deliveryTime = '顺丰标快';
            this.orderDetail.sfExpressType = 1
          }else if(item.limitTypeName=='顺丰特惠'){
            this.orderDetail.deliveryTime = '顺丰特惠';
            this.orderDetail.sfExpressType = 2
          }
        this.orderDetail.goodsFreight = item.freight;
        this.popupVisible = false;

      },
      cancel(){
        this.popupVisible = false;
      },
      formatTime(d){
        return (d.getHours()>9?d.getHours():'0'+d.getHours()) + ':' + (d.getMinutes()>9?d.getMinutes():'0'+d.getMinutes())
      },
      formatDate(d){
        return d.getFullYear() + '-' + (d.getMonth() + 1>9?d.getMonth() + 1:'0'+(d.getMonth() + 1)) + '-' + (d.getDate()>9?d.getDate():'0'+d.getDate())
      },
      getTomorrowTimeList(){
        let sendTime =[]
        for(let i = 6;i<22;i++){
          sendTime.push(i+':00 - '+(i+1)+':00')
        }
        this.slots[2].values = sendTime
      },
      getTodayTimeList(){
          let t = new Date,sendTime=['即时(1小时达)']
        if(t.getHours()<6){
          this.getTomorrowTimeList()
        }else if(t.getHours()>=22){
          sendTime=['今日结束配送']
          this.slots[2].values = sendTime;
        }else{
          for(let i = t.getHours()+1;i<22;i++){
            sendTime.push(i+':00 - '+(i+1)+':00')
          }
          this.slots[2].values = sendTime;
        }
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .sfExpress>div{
    padding: 1rem 0;
  }
  .sfExpress p{
    font-size: 1.2em;
  }
  .sfExpress h3{
    margin-bottom: .5rem;
    font-size: 1.2rem;
    font-weight: normal;
  }
  .sfExpress{
    padding: 1.3rem;
  }
  .choosePay > span > i {
    color: #008842;
  }

  .choosePay > span {
    font-size: 1.4rem;
    padding: 1rem;
    display: block;
  }

  .choosePay > ul {
    padding: 0 1rem 0 2rem;
  }

  .choosePay > ul > li > span:before {
    content: '';
    display: block;
    position: absolute;
    width: 0.6rem;
    height: 1.1rem;
    border-right: 2px solid #fff;
    border-bottom: 2px solid #fff;
    -webkit-transform: rotate(45deg);
    transform: rotate(45deg);
    right: 0.7rem;
    top: 0.2rem;
  }

  .choosePay > ul > li.on > span {
    background-color: #008842;
  }

  .choosePay > ul > li.qb {
    background: url("../../assets/img/me/qioanbao.png") no-repeat left center/3rem;
  }

  .choosePay > ul > li.wx{
    background: url("../../assets/img/me/wxpay.png") no-repeat left center/3rem;
  }

  .choosePay > ul > li.ali {
    background: url("../../assets/img/me/alipay.png") no-repeat left center/3rem;
  }

  .choosePay > ul > li > span {
    background-color: #efefef;
    position: absolute;
    width: 2rem;
    height: 2rem;
    border-radius: 50%;
    right: 0;
    top: 0;
    bottom: 0;
    margin: auto;
  }

  .choosePay > button {
    width: 90%;
    margin: 2rem auto;
    height: 3.6rem;
    font-size: 1.4rem;
    background-color: #008842;
    color: #fff;
    display: block;
    line-height: 3.6rem;
    border-radius: 3px;
  }

  .choosePay > ul > li {
    text-align: left;
    position: relative;
    float: none;
    padding-left: 4rem;
    font-size: 1.2rem;
    line-height: 5rem;
    border-bottom: 1px solid #ddd;
  }

  .choosePay {

  }

  .choosePay > p {
    padding: 1rem 1.1rem;
    font-size: 1.2rem;
    border-bottom: 1px solid #ddd;
    line-height: 3rem;
    background-color: #efefef;
  }

  .btns li {
    font-size: 1.333rem;
    background-color: #bddbcb;
    width: 33.333%;
    border-right: 1px solid #ffffff;
    line-height: 3.611rem;
    text-align: center;
  }

  .btns {
    /*height: 3.611rem;*/
    width: 100%;
    position: absolute;
    bottom: 0;
  }

  .chooseBtn > button:last-child {
    background-color: #008842;
    color: #fff;
  }

  .chooseBtn > button {
    background: none;
    outline: none;
    border: none;
    width: 50%;
    height: 3.6rem;
    font-size: 1.4rem;
  }

  .chooseBtn {
    border-bottom: 1px solid #008842;
  }

  .address > p > i {
    display: block;
    line-height: 1.9rem;
  }

  .address > p {
    white-space: normal;
    width: 23rem;
    padding-left: 1rem;
  }

  .address.send {
    background: url("../../assets/img/shoppingCart/diandian.png") #fff no-repeat 28rem center /.3rem;
  }

  .address {
    padding: 1rem;
  }
  .time > span {
    padding-left: 1rem;
  }

  .address.pd-1 > span:last-child {
    float: right;width:4rem;
    padding-right: 1.3rem;
  }
  .address.pd-1 > span {
    color: #000;
    margin-left: 1rem;
    font-size: 1.2rem;
  }

  .shoppingCart_foot {
    background-color: #fff;
    width: 100%;
  }

  .settlement {
    text-align: center;
    background-color: #fff;
  }

  .settlement > button {
    display: block;
    margin: .5rem auto;
    color: #fff;
    background-color: #008842;
    -webkit-border-radius: 5px;
    -moz-border-radius: 5px;
    border-radius: 5px;
    font-size: 1.333rem;
    width: 91.66%;
    height: 3.333rem;
  }

  .settlement > h3 > i > span {
    color: #008842;
    padding-left: 1rem;
    font-weight: bold;
    width: 5rem;
    float: right;
  }

  .settlement > h3 > i {
    font-weight: normal;

  }

  .settlement > h3 {
    line-height: 4rem;
    font-size: 1.333rem;
    padding: 0 1.2rem;
  }

  .time {
    padding: 1rem;
    border-bottom: 1px solid #efefef;
  }

  .info {
    font-size: 1.1rem;
    background-color: #fff;
  }

  .send-info > p {
    padding: .5rem 1rem;
    color: #008842;
  }

  .price {
    margin-right: 2rem;
  }

  .num {
    margin-right: 2rem;
    color: #868686;
  }

  .total {
  }

  .goods-list {
    border-bottom: 1px solid #efefef;
  }

  .goods-list li > .total {

  }

  .goods-list li > .total {
    float: right;
    width: 4rem;
  }

  .goods-list li {
    text-align: right;
    float: none;
    padding: 1rem;
    line-height: 2rem;
  }

  .order-nav > ul::-webkit-scrollbar {
    display: none;
  }

  .order-nav > ul {

    overflow: auto;
    text-overflow: clip;
  }

  .order-nav {
    padding: .5rem 1rem 0 1rem;
  }

  .order-nav > ul > li.on {
    background-color: #008842;
    color: #fff;
  }

  .order-nav > ul > li {
    background-color: #f9f9f9;
    padding: 0 1rem;
    margin-right: .5rem;
    line-height: 2.4rem;
    display: inline-block;
    float: none;
  }

  .order-nav > p {
    color: #008842;
    margin-right: 2rem;
    line-height: 2.4rem;
  }

  .detail > p > i {
    color: #0033f3;
  }
  .detail > p > span {
    float: right;
    color: #ff5956;
  }

  .detail > p {
    padding: 1rem 1rem;
    border-bottom: 1px solid #efefef;
  }

  .detail {
    font-size: 1.1rem;
    color: #000;
    background-color: #fff;
    padding: .5rem 0;
  }

  .expressList > div {
    width: 100%;
    height: 100%;
    padding-top: 0;
    background-color: rgba(0, 0, 0, 0);
  }

  .expressList {
    width: 100%;
    height: 100%;
    padding-top: 0;
    background-color: rgba(0, 0, 0, 0.3);
  }

  .expressList > div > img {
    display: block;
    position: absolute;
    width: 86%;
    left: 0;
    right: 0;
    margin: auto;
  }
</style>
