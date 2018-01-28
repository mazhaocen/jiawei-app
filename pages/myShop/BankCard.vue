<template>
  <div class="bank-card">
    <el-header className="go_back" title="绑定银行卡"></el-header>
    <section class="content" style="background-color: #efefef">
      <div class="bank-card-msg" v-if="!shopInfo.isBindCard">
        <p>请绑定本人的银行卡</p>
        <ul class="cl">
          <li><span>持卡人</span><input type="text" placeholder="请输入持卡人姓名" v-model="bankCardOwner"></li>
          <li><span>卡号</span><input type="text" placeholder="请输入卡号" v-model="bankCardNo" v-on:blur="cardCheck"><span v-if="cardErr">卡号有误，请重新输入！</span></li>
        </ul>
        <!--<p>请选择银行卡类型</p>-->
        <ul class="cl" v-if="bankCardType">
          <li><span>所属银行</span> <i>{{bankCardType}}</i></li>
          <!--<li><span>手机号</span><input type="text" placeholder="请输入银行预留手机号码"></li>-->
        </ul>
        <span style="line-height: 4rem;padding: 1rem">温馨提示：请正确填写银行信息，否则无法提现！</span>
        <!--<label class="pd-1"><p class="fl pd-1" @click="agreeBind"><i :class="{active:agree}"></i> 同意</p><span>《用户协议》</span></label>-->
        <button class="pd-1 dis" v-if="!bankCardType || !bankCardNo || !bankCardOwner">确定</button>
        <button class="pd-1" v-if="bankCardType && bankCardNo && bankCardOwner" @click="bindCard">确定</button>
      </div>
      <div class="bank-card-msg" v-if="shopInfo.isBindCard">
        <p>请绑定本人的银行卡</p>
        <ul class="cl">
          <li><span>持卡人</span><input type="text" placeholder="请输入持卡人姓名" v-model="shopInfo.bankCardOwner"></li>
          <li><span>卡号</span><input type="text" placeholder="请输入卡号" v-model="shopInfo.bankCardNo" v-on:blur="cardCheck"><span v-if="cardErr">卡号有误，请重新输入！</span></li>
        </ul>
        <!--<p>请选择银行卡类型</p>-->
        <ul class="cl" v-if="shopInfo.bankCardType">
          <li><span>所属银行</span> <i>{{shopInfo.bankCardType}}</i></li>
          <!--<li><span>手机号</span><input type="text" placeholder="请输入银行预留手机号码"></li>-->
        </ul>
        <span style="line-height: 4rem;padding: 1rem">温馨提示：请正确填写银行信息，否则无法提现！</span>
        <!--<label class="pd-1"><p class="fl pd-1" @click="agreeBind"><i :class="{active:agree}"></i> 同意</p><span>《用户协议》</span></label>-->
        <button class="pd-1 dis" v-if="!bankCardType || !bankCardNo || !bankCardOwner">保存</button>
        <button class="pd-1" v-if="bankCardType && bankCardNo && bankCardOwner" @click="bindCard">保存</button>
      </div>

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
        agree:true,
        bankCardOwner:'',
        bankCardNo:'',
        bankCardType:'',
        cardErr:false
      }
    },
    created(){
      this.shopInfo = JSON.parse(localStorage.getItem('shopInfo'))
    },
    components: {
      'el-header': Header
    },
    methods: {
      bindCard(){
          this.$http.post(this.API.bind_bank_card,{
            id:this.shopInfo.id,
            bankCardOwner:this.bankCardOwner,
            bankCardNo:this.bankCardNo,
            bankCardType:this.bankCardType,
          }).then(res=>{

          }).catch(err=>{

          })
      },
      cardCheck(){
        this.cardErr =false;
          this.$http.post(this.API.bind_bank_card_check,{
            bankCardNo:this.bankCardNo
          }).then(res =>{
              if(res.data.status===1){
                this.bankCardType = res.data.data
              }else{
                this.cardErr =true
                this.bankCardType = ''
              }

        }).catch(err=>{

          })
      },
      agreeBind () {
        this.agree = !this.agree
      },
      goToVerifyPhone () {
        this.$router.push({name:'VerifyPhone'})
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .bank-card-msg>button.dis{
    background-color: #ddd;
  }
  .bank-card-msg>button{
    width:100%;
    background-color: #008842;
    color: #ffffff;
    height: 4rem;
    font-size: 1.4rem;
    display: block;
  }
  .bank-card-msg>label{
    line-height: 3rem;
    /*display: flex;*/
  }
  .bank-card-msg>label i.active{
    background-color: #008842;
  }
  .bank-card-msg>label i.active:before{
    content: '';
    display: block;
    -webkit-transform: rotate(45deg);
    transform: rotate(45deg);
    border: 2px solid #ffffff;
    position: absolute;
    left: -4px;
    top: -8px;
    width: 10px;
    height: 10px;
  }
  .bank-card-msg>label i{
    display:inline-flex;
    width:10px;
    height: 10px;
    background-color: #fff;
    position:relative;
    overflow: hidden;
  }
  .bank-card-msg>ul>li>input{
    width: 82%;
    float: right;
    font-size: 1.111rem;
    height: 3rem;
    position: absolute;
    z-index:99;
    background: transparent;
  }
  .bank-card-msg>ul>li>span:first-child{
    display: inline-block;
    width: 5rem;
  }
  .bank-card-msg>ul>li>span:last-child{
    color: #ff5956;
    position: absolute;
    right:0;
    z-index:1;
  }

  .bank-card-msg>ul>li{
    position: relative;
    float: none;
    font-size: 1.111rem;
    width:100%;
    line-height: 3rem;
    border-bottom:1px solid #efefef;
  }
  .bank-card-msg> ul{
    padding: 0 1rem;
    background-color: #fff;
  }
  .bank-card-msg>p{
    padding: 0 1rem;
    line-height: 3rem;
  }
</style>
