<template>
  <div class="verify-phone">
    <el-header className="go_back" goTo="" title="验证手机号码"></el-header>
    <section class="content">
      <p class="pd-1">绑定银行卡需要短息确认，验证码发送至手机:138****8888，请按提示操作。</p>
      <div class="pd-1">验证码<input type="text" placeholder="请输入验证码"><button disabled="disabled">获取验证码（20）</button></div>
      <button @click="cardBinding">绑定</button>
    </section>
  </div>
</template>

<script>
  import Header from '@/components/Head'
  import { MessageBox } from 'mint-ui';
  export default {
    name: 'VerifyPhone',
    data () {
      return {

      }
    },
    created(){

    },
    components: {
      'el-header': Header
    },
    methods: {
      cardBinding () {
        MessageBox({
          title: '提示',
          message: '绑定成功',
          showCancelButton: false,
          showConfirmButton:'确定'
        }).then(res=>{
            this.$router.push({name:'BalanceMoney'})
        })
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .verify-phone>section>button{
    width:100%;
    background-color: #008842;
    color: #ffffff;
    font-size: 1.333rem;
    height: 4rem;
    margin-top: 1rem;
  }
  .verify-phone>section>div>button{
    height:3rem;
    float: right;
    background-color: transparent;
    color: #008842;
  }
  .verify-phone>section>div>input{
    height: 3rem;
    width: 40%;
    font-size: 1.166rem;
    padding: 0 1rem;
  }
  .verify-phone>section>div{
    border-bottom:1px solid #efefef;
    margin: 0 1rem;
  }
  .verify-phone>section{
    font-size: 1.166rem;
    color: #999999;
  }
  .verify-phone>section>p{
    white-space: normal;
    text-align: center;
    margin: 2rem auto 1rem;
  }
</style>
