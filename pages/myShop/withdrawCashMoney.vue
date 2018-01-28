<template>
  <div class="withdrawCashMoney balance-money">
    <el-header className="go_back"  title="可提现额度">
      <a @click="goToWithdrawCashLog" class="log">提现记录</a>
    </el-header>
    <section class="content" style="background-color: #efefef">
      <img src="../../assets/img/myShop/moneyBag.png" alt="">
      <p>¥{{shopInfo.todayWithdrawPrice.toFixed(2)}}</p>
      <button @click="openConfirm">转入银行卡</button>
      <span @click="goToBindCard()">{{shopInfo.isBindCard?'修改绑定银行卡':'绑定银行卡'}}</span>
      <!--<span>{{0?'修改绑定银行卡':'绑定银行卡'}}</span>-->
    </section>
  </div>
</template>

<script>
  import Header from '@/components/Head'
  import { MessageBox } from 'mint-ui';
  export default {
    name: 'withdrawCashMoney',
    data () {
      return {
        shopInfo:''
      }
    },
    created(){
      this.shopInfo = JSON.parse(localStorage.getItem('shopInfo'))
//      alert(this.shopInfo.todayWithdrawPrice)
    },
    components: {
      'el-header': Header
    },
    methods: {
      openConfirm () {
//        this.shopInfo.isBindCard=0
          if(this.shopInfo.isBindCard){
            this.$router.push({name:'withdrawCash'})
          }else{
            MessageBox({
              title: '说明',
              message: '请添加一张提现储蓄卡！',
              showCancelButton: true,
              confirmButtonText:'添加储蓄卡'
            }).then(res =>{
              if(res ==='confirm'){
                this.$router.push({name:'BankCard'})
              }else{
//              alert('bu添加')
              }
            });
          }
      },
      goToWithdrawCashLog(){
        this.$router.push({name:'withdrawCashLog'})
      },
      goToBindCard(){
        this.$router.push({name:'BankCard'})
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .balance-money>section>button{
    width:78.88%;
    background-color: #008842;
    color: #ffffff;
    border-radius: 3px;
    font-size: 1.333rem;
    margin-top: 3rem;
    height:3.4rem;
  }
  .balance-money>section>p{
    font-size: 2rem;
  }
  .balance-money>section{
    text-align: center;
  }
  .balance-money>section>img{
    width: 7.14rem;
    margin: 1rem auto;
  }
  .log{
    right:1.5rem;
    font-size: 1.1rem;
    color: #008842;
  }
  .content>span{
    position: absolute;
    bottom:1rem;
    display: block;
    text-align: center;
    left:0;
    right:0;
    font-size: 1.2rem;
    color: #008842;
  }
</style>
