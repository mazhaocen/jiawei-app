<template>
  <div class="pay">
    <header class="header">
      <a class="go-back"></a>
      <p>支付</p>
    </header>
    <section class="content" style="background-color: #ededed">
      <div class="payDiv">
        <h3>向李婆婆菜档支付</h3>
        <p>支付金额</p>
        <div class="pr">
          <i class="pa">￥</i><input type="number">
        </div>
        <button @click="popupVisible = true">支付</button>
      </div>
      <!--输入密码支付-->
      <mt-popup  v-model="popupVisible" position="top" style="width: 90%;top: 2rem;">
        <div class="input_pwd">
          <h3>请输入支付密码 <i @click = "popupVisible = false"></i></h3>
          <p><i>￥</i>34.5</p>
          <h4>账户余额<span>￥44.3</span></h4>
          <div class="pwd">
            <input type="number" maxlength="1">
            <input type="number" maxlength="1">
            <input type="number" maxlength="1">
            <input type="number" maxlength="1">
            <input type="number" maxlength="1">
            <input type="number" maxlength="1" style="border: none;">
          </div>
        </div>
      </mt-popup>
      <!--支付成功-->
      <mt-popup  v-model="popupVisible1" position="bottom" style="width: 100%;height: 100%;text-align: center">
        <div class="input_pwd">
          <h2>支付成功</h2>
          <p style="border-top: none"><i>￥</i>34.5</p>
          <h4 class="over" style="margin-top: 1rem">收款人<span>李婆婆菜档</span></h4>
          <h4 class="over red">活动优惠<span>2.00</span></h4>
          <h4 class="over red">优惠卷<span>5.00</span></h4>
        </div>
        <button class="over-btn" @click="popupVisible1=false">完成</button>
      </mt-popup>
    </section>
  </div>
</template>

<script>
  import {Popup, Checklist, MessageBox,Toast,Actionsheet,Indicator} from 'mint-ui';
export default {
  name: 'pay',
  data () {
    return {
      popupVisible:false,
      popupVisible1:true
    }
  },
  created(){

  },
  components:{
    'mt-popup': Popup,
  },
  methods:{
    pay:function () {

    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .over-btn{
    width: 16.94rem;
    height:3.444rem;
    background-color: #fff;
    border:1px solid #1aad19;
    color: #1aad19;
    font-size: 1.667rem;
    margin-top: 15rem;
  }
  .red{
    color: red;
  }
  .input_pwd>h4.over{
    border-bottom: none;
    line-height: 3rem;
    text-align: left;
  }
  .input_pwd>h2{
    margin-top: 6rem;
    font-size: 2rem;
    color: #1aad19;
    font-weight: 400;
    text-align: center;
  }
  .input_pwd>h3>i{
    position: absolute;
    display: block;
    width: 2rem;
    height: 2rem;
    right:2rem;
    top:1rem;
    background: url("../../assets/img/pay/close.png") no-repeat center center/100%;
  }
  .input_pwd>h3{
    line-height: 4rem;
    font-size: 1.667rem;
    font-weight:400;
    padding: 0 2rem;
    position: relative;
  }

  .input_pwd>p>i{
    font-size: 1.667rem;
    margin-right: 1rem ;
  }
  .input_pwd>p{
    padding: 1rem 0;
    font-size: 3.333rem;
    text-align: center;
    border-top: 1px solid #efefef;
    border-bottom: 1px solid #efefef;
  }
  .input_pwd>h4>span{
    float: right;
  }
  .input_pwd>h4{
    border-bottom: 1px solid #efefef;
    padding: 0 2rem;
    line-height: 4rem;
    font-weight: 400;
    font-size: 1.333rem;
  }
  .pwd{
    width:24rem;
    margin:1.5rem auto;
    height: 4rem;
    border:1px solid #b1b1b1;
    box-sizing: content-box;
  }
  .pwd>input{
    width:4rem ;
    float: left;
    height: 3rem;
    margin-top: .5rem;
    border-right:1px solid #b1b1b1;
    text-align: center;
  }
  .payDiv>button{
    width: 80%;
    background-color: #008842;
    color: #fff;
    font-size: 1.667rem;
    margin: 3rem auto 2rem;
    border-radius: 3px;
    height: 3.6rem;
  }
  .payDiv>div>i{
    display: block;
    font-size: 1.667rem;
    z-index:200;
    left: 1.5rem;
    top: 1rem;
  }
  .payDiv input{
    position: relative;
    width: 92%;
    border-bottom: 1px solid #dbdbdb;
    padding: 0 3rem;
    margin: auto;
    display: block;
    height: 4.6rem;
    font-size: 4rem;
  }
  .payDiv>p{
    padding-left: 1.5rem;
    font-size: 1.333rem;
    margin-top: 3rem;
    text-align: left;
    margin-bottom: 1rem;
  }
  .payDiv>h3{
    padding-top: 2rem;
    font-size: 1.667rem;
    font-weight: 400;
    text-align: center;
  }
  .payDiv{
    width: 90%;
    background-color: #fff;
    margin: 1rem auto;
    border-radius: 5px;
    text-align: center;
  }
  .header>p{
    color: #ffffff;
    font-size: 1.667rem;
  }
  .header{
    background-color: #494949;
    text-align: center;
  }
  .go-back{
    background: url("../../assets/img/pay/pay-goback.png") no-repeat center center /.972rem;
    left:0;
  }
</style>
