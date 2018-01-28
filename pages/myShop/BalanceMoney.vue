<template>
  <div class="balance-money">
    <el-header className="go_back"  title="可用额度"></el-header>
    <section class="content" style="background-color: #efefef">
      <img src="../../assets/img/myShop/moneyBag.png" alt="">
      <p>¥0.00</p>
      <button style="background-color: #999999">转入银行卡</button>
      <!--<button @click="openConfirm">转入银行卡</button>-->
    </section>
  </div>
</template>

<script>
  import Header from '@/components/Head'
  import { MessageBox } from 'mint-ui';
  export default {
    name: 'balanceMoney',
    data () {
      return {
        images:[
          {
            base64:'',
            statue:''
          },
          {
            base64:'',
            statue:''
          },
          {
            base64:'',
            statue:''
          }
        ]
      }
    },
    created(){

    },
    components: {
      'el-header': Header
    },
    methods: {
      openConfirm () {
        this.$router.push({name:'withdrawCash'})
//        MessageBox({
//          title: '说明',
//          message: '请添加一张提现储蓄卡！',
//          showCancelButton: true,
//          confirmButtonText:'添加储蓄卡'
//        }).then(res =>{
//            if(res ==='confirm'){
//              this.$router.push({name:'BankCard'})
//            }else{
////              alert('bu添加')
//            }
//        });
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
</style>
