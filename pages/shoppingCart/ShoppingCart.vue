<template>
  <div class="shoppingCart">
    <el-header title="购物车"></el-header>
    <section class="content pr">
      <div class="no_goods" v-if="!orderList.length">
        <img src="../../assets/img/shoppingCart/car_img.png" alt="">
        <p>空空的购物车</p>
        <button @click="goToShop">去购物</button>
      </div>
      <div class="" v-if="orderList.length">
          <ul class="orderList cl">
            <li v-for="item,index in orderList" @click="getOrderInfo(item)">订单{{index+1}}<span style="color: #333;" v-if="goodsList.shopId ==item.shopId">: {{item.shopName}}</span></li>
          </ul>
        <address class="address pd-1 cl" style="padding-right: 3rem" @click = openAddressList>配送地点:<i>{{address.province}}{{address.city}}{{address.area}}{{address.address}}</i></address>
        <div class="about_goods">
          <!--<div class="address pd-1" @click="openPicker" v-if="expressType==2">配送时间:<span>{{sendDate}}</span> <span>{{sendTime}}</span><span style="float: right;width:4rem;">{{sendPrice}}元</span></div>-->
          <!--<div class="address pd-1" @click="openPicker" v-if="expressType!=2">配送时间:<span>{{expressText}}</span><span style="float: right;width:4rem;">{{sendPrice}}元</span></div>-->
          <ul class=" shoppingCart_list">
            <li class="cl" v-for="(i,index) in goodsList.items">
              <div class="cl pr">
                <div class="goods_img fl"><img v-lazy="i.goodsImg" alt=""></div>
                <div class="goods_msg fl">
                  <h3>{{i.goodsName}}</h3>
                  <!--<p>买三斤送一斤</p>-->
                </div>
                <div class="goods_price fr">
                  <h3 class="price">{{i.goodsPrice}}<span>/500g</span></h3>
                </div>
                <h3 class="li_price_all"><span class="fl" @click="delGoods(i,index)">删除<i>×</i></span></h3>
              </div>
              <div class="cl" style="line-height: 3.4rem;border-top: 1px solid  #efefef;">
                <span class="fl" style="width: 10rem">总重量 :<span>{{50*i.goodsNum}}g</span></span>
                <div class="buy_num fl cl">
                  <i @click="minusGoodsNum(i)" :class="{'dis':(i.goodsNum<=1 || !i.goodsNum)}">-</i><input type="number" value="1" v-model="i.goodsNum" @change="inputChange(i)"><i style="border-left: 1px solid #efefef" @click="addGoodsNum(i)">+</i>
                </div>
                <span style="text-align:right;margin-left: 1rem;width: 6rem;overflow: hidden;font-size: 1.3rem;font-weight: bold;" class="fr">￥{{(i.goodsNum*parseFloat(i.goodsPrice)/10).toFixed(2)}}</span>
              </div>
              <!--<h3 class="li_price_all"><span class="fl" @click="delGoods(i,index)">删除<i>×</i></span></h3>-->
            </li>
          </ul>
        </div>
        <div class=""></div>
        <div class="shoppingCart_foot pa">
          <!--<div class="check_coupon pd-1"> 查看优惠券 <i></i></div>-->
          <div class="settlement">
            <h3 class="cl"><i class="fl">当前订单</i> <i class="fr">商品金额<span class="">￥{{totalPrice}}</span></i></h3>
            <button @click="addOrder()">提交订单</button>
          </div>
        </div>

      </div>
    </section>
    <el-footer :choose=4></el-footer>
    <!--<mt-popup v-model="popupVisible" position="bottom" style="width: 100%;height: 23rem;padding-top:0">-->
    <!--<p class="chooseBtn"> <button @click="cancel">取消</button> <button @click="sure">确定</button></p>-->
    <!--<p style="padding: 1rem 0 1rem 1rem;font-size: 1.2rem;">配送时间:</p>-->
    <!--<p style="text-align: center;font-size: 1.2rem;padding: 1rem 0">3元</p>-->
    <!--<mt-picker :slots="slots" @change="onValuesChange" :visibleItemCount="3"></mt-picker>-->
  <!--</mt-popup>-->
    <!--地址弹出选择-->
    <mt-popup v-model="popupVisible1" position="bottom" class="addressList">
    <p>配送地址: <span class="fr" @click="addAddress">新增</span></p>
    <ul class="cl address-list" style="height: 23rem;overflow:auto;">
      <li v-for="(i,index) in addressList" @click="chooseAddress(index)">
        <p class="cl"><span class="fl">{{i.name}}</span><span class="fr">{{i.phone}}</span></p>
        <span>{{i.province}}{{i.city}}{{i.area}}{{i.address}}</span>
      </li>
    </ul>
  </mt-popup>
    <!--<mt-popup v-model="expressShow" position="bottom" class="expressList" >-->
      <!--<div @click="expressShow=false">-->
        <!--<img v-if="orderType==1" @click="chooseTime(1)" style="top: 12%;" src="../../assets/img/shoppingCart/ziting.png" alt="">-->
        <!--<img v-if="orderType==1" @click="chooseTime(2)" style="top:34%" src="../../assets/img/shoppingCart/dada.png" alt="">-->
        <!--<img v-if="orderType==2" @click="chooseTime(3)" style="top:34%" src="../../assets/img/shoppingCart/shunf.png" alt="">-->
      <!--</div>-->
    <!--</mt-popup>-->

  </div>
</template>

<script>
  import Header from '@/components/Head'
  import Footer from '@/components/Foot'
  import { Picker, Popup, MessageBox, Toast, Indicator} from 'mint-ui'
export default {
  name: 'shoppingCar',
  data () {
    return {
      popupVisible:false,
      popupVisible1:false,
      sendDate:this.formatDate(new Date),
      sendTime:'即时配送',
      send:'',
      goodsList:[],
      orderList:[],
      goodsPriceList:[],
      addressList:[],
      address:{
        province:'',
        city:'',
        area:'',
        address:''
      },
      slots: [
        {
          flex: 1,
          values: [this.formatDate(new Date), this.formatDate(new Date(Date.parse(new Date())+86400000))],
//          values: ['2015-01', '2015-02', '2015-03', '2015-04', '2015-05', '2015-06'],
          className: 'slot1',
          textAlign: 'right',
          defaultIndex:2
        }, {
          divider: true,
          content: '-',
          className: 'slot2'
        }, {
          flex: 1,
          values: ['即时配送','17:30-18:00','18:00-18:30'],
          className: 'slot3',
          textAlign: 'left',
          defaultIndex:3
        }
      ],
      totalPrice:0,
      totalWeight:0,
      expressShow:false,
      orderType:1,//店铺类型
      expressType:0,//快递方式
      expressText:'',//快递显示
      sendPrice:0
    }
  },
  components:{
    'el-footer':Footer,
    'el-header':Header,
    'mt-picker':Picker,
    'mt-popup':Popup
  },
  created(){
//    this.slots[0].values=[this.formatDate(new Date), this.formatDate(new Date(Date.parse(new Date())+86400000))];
//    Date.parse(new Date());
//    // console.log(this.formatDate(new Date(Date.parse(new Date())+86400000)))
    window.page='shoppingCar'

    this.getMyAddressList()
    this.getMyShopCartList()
  },
  destroyed () {
    window.page = ''
  },
  methods:{
    addOrder(){//提交订单
        if(!this.address.province){
          MessageBox('提示', '请选择或添加配送地址');
          return
        }
        let params={
          cartItems:this.goodsList,
          receiverName:this.address.name,
          receiverPhone:this.address.phone,
          receiverProvince:this.address.province,
          receiverCity:this.address.city,
          receiverArea:this.address.area,
          receiverAddress:this.address.address,
          receiverPostCard:this.address.postCode,
          weight:this.totalWeight,
        };
        Indicator.open()
         this.$http.post(this.API.shop_cart_addOrder,params).then(res=>{
             // console.log(res.data)
           if(res.data.status==1){
             Indicator.close()
             this.$router.push({name:'payOrder',params:{orderId:res.data.data}})
           }
         }).catch(err=>{
           Indicator.close()
             // console.log(err)
         })
    },
    getMyAddressList(){//获取收货地址列表
      this.$http.post(this.API.receive_address_my,{}).then(res=>{
        this.addressList = res.data.data.data;
//        // console.log(JSON.stringify(this.addressList))
        let that = this;
        if( this.addressList.length || this.addressList){
//          this.address = this.addressList[0]
          res.data.data.data.forEach(function (n) {
            if(n.isDefault){
              that.address = n
            }
          });
        }
        // console.log(res.data.data.data)
      }).catch(err=>{
        // console.log(err)
      })
    },
    getMyShopCartList(){//获取购物车条目列表
      this.$http.post(this.API.shop_cart_my,{currentPage:'1',pageSize:'100'}).then(res=>{
        this.orderList = res.data.data.data;
        let that = this
        this.goodsList = this.orderList[0];
        this.goodsList.items.forEach(function (n) {
          that.totalPrice =parseFloat(that.totalPrice)+(n.goodsNum*parseFloat(n.goodsPrice)/10)
          that.totalWeight = parseFloat(that.totalWeight)+(parseFloat(50*n.goodsNum)/1000)
        })
        this.totalPrice =this.totalPrice.toFixed(2)
        this.totalWeight =this.totalPrice.toFixed(2)
      }).catch(err=>{
        // console.log(err)
      })
    },
    addGoodsNum(goods){//商品数量 +1
      if(goods.goodsNum>=1000){
        return
      }
      this.$http.post(this.API.shop_cart_goods_add,{
          id:goods.id
      }).then(res=>{
        // console.log(res.data)
        if(res.data.status==1){
          goods.goodsNum++
          this.upTotalPrice()
        }
      }).catch(err=>{
        // console.log(err)
      })
    },
    minusGoodsNum(goods){//商品数量-1
      if(goods.goodsNum<=1 || !goods.goodsNum){
          return
      }
      this.$http.post(this.API.shop_cart_goods_minus,{
          id:goods.id
      }).then(res=>{
        // console.log(res.data)
        if(res.data.status==1){
          goods.goodsNum--
          this.upTotalPrice()
        }
      }).catch(err=>{
        // console.log(err)
      })
    },
    upTotalPrice(){//更新订单价格
      this.totalPrice=0;
      this.totalWeight=0;
      let that = this
      this.goodsList.items.forEach(function (n) {
        that.totalPrice = parseFloat(that.totalPrice)+(n.goodsNum*parseFloat(n.goodsPrice)/10)
        that.totalWeight = parseFloat(that.totalWeight)+(parseFloat(50*n.goodsNum)/1000)
      })
      this.totalPrice =this.totalPrice.toFixed(2)
      this.totalWeight =this.totalWeight.toFixed(2)
    },
    inputChange(item){
        // console.log(item.goodsNum)
        if(item.goodsNum>1000){
          item.goodsNum=1000
        }else if(num<=0){
          item.goodsNum=1
        }else if(isNaN(num)){
          item.goodsNum=1
        }
    },
    addAddress(){//添加新的地址
      this.$router.push({name:'addressEdit'})
    },
    getOrderInfo(item){//获取订单详情
//      this.orderType= (index%2)?2:1
      this.goodsList= item
    },
    openPicker() {
      this.expressShow=true;
    },
    chooseTime(index){
      this.expressShow=false;
      this.expressType=index
      if(index==1){
        this.expressText = '上门自提'
        this.sendPrice=0
      }
      if(index==3){
        this.expressText = '顺丰快递'
        this.sendPrice=20
      }
      if(index==2){
        this.popupVisible = true;
        this.slots[0].defaultIndex =0;
        this.slots[2].defaultIndex =0;
        this.sendPrice=5
      }
    },
    onValuesChange(picker, values) {
      this.send = picker.getValues()
//      if (values[0] > values[1]) {
//        picker.setSlotValue(1, values[0]);
//      }
    },
    formatDate(d){
        return  d.getFullYear()+'-'+(d.getMonth()+1)+'-'+d.getDate()
    },
    cancel(){
      this.popupVisible = false;
    },
    sure(){
      this.popupVisible = false;
      this.sendDate = this.send[0];
      this.sendTime = this.send[1]
    },
    chooseAddress(index){
        this.address = this.addressList[index]
      this.popupVisible1 = false;
    },
    openAddressList(){
      this.popupVisible1 = true;
    },
    delGoods(goods,index){//删除购物车
      MessageBox({
          title: '提示',
          message: '您确将此商品从购物车中删除吗',
          showCancelButton: true
        }).then(res => {
          if (res === 'confirm') {
            this.$http.post(this.API.shop_cart_goods_del,{
              id:goods.id
            }).then(res=>{
              // console.log(res.data);
              if(res.data.status==1){
                this.goodsList.items.splice(index,1)
                Toast({message: '删除成功！'});
                this.upTotalPrice()//更新价格
                if(!this.goodsList.items.length){//如果删除了所有商品 重新获取购物车列表
                    this.getMyShopCartList()
                }
              }
            }).catch(err=>{
              // console.log(err)
            })
          } else {
          }
        });
    },
    goToShop(){
        this.$router.push({name:'shop'})
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .expressList>div{
    width: 100%;
    height: 100%;
    padding-top:0;
    background-color: rgba(0,0,0,0);
  }
  .expressList{
    width: 100%;
    height: 100%;
    padding-top:0;
    background-color: rgba(0,0,0,0.3);
  }
  .expressList>div>img{
    display: block;
    position: absolute;
    width: 86%;
    left: 0;
    right: 0;
    margin: auto;
  }
  .orderList>li{
    margin: .5rem .5rem;
    border-radius: 10rem;
    color: #008842;
    line-height: 2.4rem;
    padding: 0 .5rem;
    display: inline-block;
    float: none;
    background-color: #fff;
    font-size: 1.2rem;
  }
  .orderList{
    height: 3.4rem;
    overflow: auto;
    text-overflow: clip;
  }
  .addressList>p{
    padding: 1rem 0 1rem 1rem;
    font-size: 1.2rem;
    line-height: 2.2rem;
  }
  .addressList>p>span{
    padding:.5rem 1rem;
    margin-right: 1rem;
    line-height: 1.1rem;
    border:1px solid #008842;
    border-radius: 3px;
    color: #008842;
  }
  .address-list{
    padding: 0 1.5rem;
    -webkit-scroll-snap-type: none;
  }
  .address-list>li>span{
    color: #999;
    font-size: 1.2rem;
    line-height: 2.5rem;
  }
  .address-list>li{
    white-space: normal;
    float: none;
    font-size: 1.4rem;
    line-height: 2rem;
    padding: 1rem 0;
    border-bottom: 1px solid #efefef;
  }
  .chooseBtn>button:last-child{
    background-color:#008842;
    color: #fff;
  }
  .chooseBtn>button{
    background: none;
    outline: none;
    border:none;
    width: 50%;
    height: 3.6rem;
    font-size: 1.4rem;
  }
  .chooseBtn{
    border-bottom: 1px solid #008842;
  }
  .check_coupon>i{
    display: block;
    float: right;
    width: 4rem;
    height:4rem;
    background: url("../../assets/img/shoppingCart/go_new.png") no-repeat right center/.5rem;
  }
  .check_coupon{
    background-color: #fff;
    line-height: 4rem;
    margin-bottom: 1.3rem;
    font-size: 1.333rem;
    color: #4a90e2;
  }
  .shoppingCart_foot{
    bottom:3.611rem;
    width: 100%;
  }
  .settlement{
    text-align: center;
    background-color: #fff;
  }
  .settlement>button{
    color: #fff;
    background-color: #008842;
    -webkit-border-radius:5px;
    -moz-border-radius:5px;
    border-radius:5px;
    font-size: 1.333rem;
    width:91.66%;
    height:3.333rem;
    margin-bottom: .5rem;
  }
  .settlement>h3>i>span{
    color: #008842;
    padding-left: 2rem;
    font-weight: bold;
  }
  .settlement>h3>i{
    font-weight: normal;

  }
  .settlement>h3{
    line-height: 4rem;
    font-size: 1.333rem;
    padding:0 1.2rem;
  }
  .price{
    font-size: 1.111rem
  }
  .price>span{
    font-size: .667rem;
    font-weight: 300;
  }
  .li_price_all i{
    font-size: 1.9rem;
    font-weight: 200;
    line-height: 1.9rem;
  }
  .li_price_all>span{
    font-weight: normal;
    color:red;
    line-height: 1.9rem;
  }
  .li_price_all{
    padding-top: .8rem;
    font-size: 1.111rem;
    text-align: right;
    right: 0;
    bottom: 0;
    position: absolute;
  }
  .goods_price{
    text-align: right;
    line-height: 2.4rem;
    font-size: 1.111rem
  }
  .shoppingCart_list{
    border-top:1px solid #f6f6f6;
    height: 30.8rem;
    overflow: auto;
    background-color: #efefef;
  }
  .shoppingCart_list>li{
    float: none;
    width: 100%;
    padding: .7rem 2rem 0 1rem;
    border-bottom: 5px solid #efefef;
    background-color: #fff;
  }
  .buy_num>input{
    width: 3.677rem;
    height: 2.333rem;
    line-height: 2.333rem;
    text-align: center;
    float: left;
    font-size: 1.2rem;
  }
  .buy_num>i.dis{
    color: #ccc;
  }
  .buy_num>i:first-child{
    border-right: 1px solid #efefef
  }
  .buy_num>i{
    float: left;
    line-height: 2.133rem;
    height: 2.333rem;
    width: 2.333rem;
    text-align: center;
    font-size: 2rem ;
  }
  .buy_num{
    border:1px solid #dddddd;
    /*margin-top: 1rem;*/
    width: 8.743rem;
    margin: .5rem 1rem .5rem 0;

  }
  .goods_msg>h3{
    line-height: 2.4rem;
    font-size: 1.111rem
  }
  .goods_msg{
    width:12.6rem;
  }
  .goods_img>img{
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  .goods_img{
    margin-right: .8rem;
    width: 10rem;
    height:7.777rem;
    margin-bottom: .5rem;
  }
  .about_goods{
    background-color: #fff;
  }
  .address>i{
    color: #000;
    display: block;
    width: 80%;
    float: right;
    font-size: 1.2rem;
  }
  .address>span{
    color: #000;
    margin-left:1rem;
    font-size: 1.2rem;
  }
  .address{
    white-space: normal;
    font-style: normal;
    color: #1026ff;
    line-height: 1.2rem;
    background:url("../../assets/img/shoppingCart/diandian.png") #fff no-repeat 28rem center /.3rem;
    padding-top: .8rem;
    padding-bottom: .8rem;
    margin: 0 auto .3rem;
  }
  .no_goods>button{
    width:18.444rem;
    height:3.333rem;
    background-color: transparent;
    color: #008842;
    border:1px solid #008842;
    -webkit-border-radius:5px;
    -moz-border-radius:5px;
    border-radius:5px;
    font-size: 1.333rem;
  }
  .no_goods>p{
    line-height:4rem;
  }
  .no_goods{
    font-size: 1.333rem;
    padding-top: 2.333rem;
    text-align: center;
  }
  .no_goods>img{
    width: 11.111rem;
  }
.shoppingCart .content{
  background-color: #efefef;
}
  .addressList{
    width: 100%;height: 28rem;padding-top:0
  }
</style>
