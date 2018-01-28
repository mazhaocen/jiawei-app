<template>
  <div class="withdrawCash">
    <el-header className="go_back" title="转入银行卡"></el-header>
    <section class="content" style="background-color: #efefef">
      <div v-if="!withdrawOk">
        <div class="model">
          <div class="bank cl">
            <p class="fl">银行卡</p>
            <div class="fl">
              <span>{{shopInfo.bankCardType}}（{{shopInfo.bankCardNo.substring(shopInfo.bankCardNo.length-4)}}）</span>
              <p>转入到{{shopInfo.bankCardType}}，手续费 无</p>
            </div>
          </div>
          <div class="moneyNum">
            <p>转入金额</p>
            <div class="cl"><i>￥</i><input type="number" v-model="moneyNum" :placeholder="0.00"></div>
            <span>当前可提现{{shopInfo.todayWithdrawPrice.toFixed(2)}}元，<i @click="moneyNum =shopInfo.todayWithdrawPrice.toFixed(2)">全部转入银行卡</i></span>
          </div>
        </div>
        <p class="button" v-if="moneyNum" @click="withdraw()">转入银行卡</p>
        <p class="button dis" v-if="!moneyNum">转入银行卡</p>
      </div>
      <div v-if="withdrawOk">
        <p style="text-align: center;font-size: 2rem;line-height: 4rem;color: #008842">操作成功！</p>
      </div>

    </section>
    <mt-popup v-model="inputPwd" position="top" class="inputpwd">
      <p>请输入取现密码</p>
      <input type="password"  v-model="payPassword" maxlength="6" placeholder="请输入密码" ref="focusStatue">
      <span v-if="pwdErr">密码有误，请重新输入!</span>
      <div class="dis" v-if="!/^\d{6}$/.test(payPassword)">确定</div>
      <div v-if="/^\d{6}$/.test(payPassword)" @click="submitPwd">确定</div>
    </mt-popup>
  </div>
</template>

<script>
  import Header from '@/components/Head'
  import { MessageBox ,Popup} from 'mint-ui';
  export default {
    name: 'withdrawCash',
    data () {
      return {
        withdrawOk:false,
        pwdErr:false,
        inputPwd:false,
        moneyNum:'',
        payPassword:''
      }
    },
    created(){
      this.shopInfo = JSON.parse(localStorage.getItem('shopInfo'))
    },
    components: {
      'el-header': Header,
      'mt-popup': Popup
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
      //生成提现记录
      withdraw(){
        this.payPassword=''
        this.$http.post(this.API.withdraw_apply,{
          shopId:this.shopInfo.id,
          withdrawCash:this.moneyNum,
        }).then(res=>{
          if(res.data.status ===1){
            this.withdrawInfo = res.data.data;
            this.inputPwd = true;
            setTimeout(()=>{
              this.$refs.focusStatue.focus()
            },200)

          }else{
              alert(res.data.message)
          }
        }).catch(err=>{

        })
      },
      //提交密码
      submitPwd(item){
        this.$http.post(this.API.withdraw_check,{
          id:this.withdrawInfo.id,
          shopId:this.withdrawInfo.shopId,
          payPassword:this.payPassword,
        }).then(res=>{
          if(res.data.status ===1){
            this.inputPwd = false;
            this.withdrawOk = true;
            this.shopInfo.todayWithdrawPrice = this.shopInfo.todayWithdrawPrice-this.moneyNum;
//            alert(this.shopInfo.todayWithdrawPrice )
            localStorage.setItem('shopInfo',JSON.stringify(this.shopInfo))
          }
        }).catch(err=>{

        })
      }
    },
    watch:{
        'moneyNum'(newV,oldV){
            if(newV.indexOf('.')!=-1){
              if(newV.split('.')[1].length>2){
                this.moneyNum = newV.split('.')[0]+'.'+newV.split('.')[1].substring(0,2)
              }
            }
            if(newV>this.shopInfo.todayWithdrawPrice){
                this.moneyNum = this.shopInfo.todayWithdrawPrice.toFixed(2)
            }
        }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .button.dis{
    background-color: #6c9b83;
  }
  .button{
    margin: 3rem 1.2rem;
    text-align: center;
    background-color: #008842;
    font-size: 1.5rem;
    line-height: 4rem;
    color: #fff;
  }
  .moneyNum>span>i{
    color: #194cba;
  }
  .moneyNum>span{
    padding: 1rem 0;
  }
  .moneyNum>div>i{
    position: absolute;
    z-index:99;
    left:0;
    top:0;
  }
  .moneyNum>div>input{
    font-size: 3rem;
    position: absolute;
    width: 100%;
    border-bottom: 1px solid #efefef;
    left:0;
    top:1rem;
    padding-left: 4rem;
  }
  .moneyNum>div{
    height: 5rem;
    position: relative;
    font-size: 2rem;
  }
  .model>div{
    padding: 1.5rem;
  }
  .model>div>p{
    color: #676767;
  }
  .model{
    margin: .7rem 1.2rem;
    background-color: #fff;

    font-size: 1.2rem;
  }
  .bank>div{
    margin-left: 4rem;
  }
  .bank>div>p{
    font-size: 1rem;
  }
  .bank>div>span{
    color: #194cba;
  }
  .bank{
    background-color: #fbfbfb;
  }
  .inputpwd>input{
    border: 1px solid #efefef;
    width: 100%;
    height: 3rem;
    text-align: center;
    margin: 3rem auto;
    font-size: 1.5rem;
  }
  .inputpwd>div.dis{
    background-color: #6c9b83;
  }
  .inputpwd>div{
    width: 100%;
    background-color: #008842;
    color: #fff;
    text-align: center;
    line-height: 4rem;
    margin-top: 3rem;
  }
  .inputpwd>span{
    display: block;
    text-align: right;
    font-size: 1rem;
    color:#ff5956;
  }
  .inputpwd{
    width: 100%;
    font-size: 1.3rem;
    padding:3rem 1rem;
    z-index: 2001;
    height: 25rem;
  }

</style>
