<template>
  <div class="withdrawCashLog ">
    <el-header className="go_back"  title="提现记录">

    </el-header>
    <section class="content" style="background-color: #efefef">
      <ul class="logList">
        <li class="cl" v-for="l in withdrawCash"><span class="fl">{{l.withdrawTime}}</span> <span class="fr"><span :style="[l.status?{color:'#008842'}:{color:'red'}]">{{l.status?'成功':'失败'}}</span>提现 ￥{{l.withdrawCash.toFixed(2)}}</span></li>
      </ul>
    </section>
  </div>
</template>

<script>
  import Header from '@/components/Head'
  import { MessageBox } from 'mint-ui';
  export default {
    name: 'withdrawCashLog',
    data () {
      return {
        withdrawCash:[]
      }
    },
    created(){
      this.shopInfo = JSON.parse(localStorage.getItem('shopInfo'))
      this.withdrawCashLog()
    },
    components: {
      'el-header': Header
    },
    methods: {

      withdrawCashLog(){
        this.$http.post(this.API.withdraw_record,{
          shopId:this.shopInfo.id
        }).then(res=>{
          this.withdrawCash = res.data.data.data
        }).catch(err=>{

        })
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .logList{
    padding-top: 1rem;
  }
  .logList>li>span{
    font-size: 1.2rem;
  }
  .logList>li{
    width: 100%;
    padding: 1rem 1rem ;
    background-color: #fff;
    border-bottom: 1px solid #efefef;
  }
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
