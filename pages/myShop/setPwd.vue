<template>
  <div class="setPwd">
    <el-header className="go_back" title="设置提现、进店密码"></el-header>
    <section class="content" style="background-color: #efefef">
      <div class="inputList">
        <p><input type="password" v-model="password1" placeholder="请输入6位数字密码" maxlength="6" v-on:blur="checkPwd()"><span v-if="pwdErr">请输入6位数字密码</span></p>
        <p><input type="password" v-model="password2" placeholder="请重复6位数字密码" maxlength="6" v-on:blur="checkPwd2()"><span v-if="pwdErr2">请重复6位数字密码</span></p>
        <!--<p><i>新密码</i><input type="password"></p>-->
        <!--<p><i>重复密码</i><input type="password"></p>-->
      </div>
      <p class="save" v-if="/^\d{6}$/.test(password1) && password1===password2" @click="savePwd">保存</p>
      <p class="save dis" v-if="!/^\d{6}$/.test(password1) || password1!==password2 ">保存</p>
    </section>
  </div>
</template>

<script>
  import Header from '@/components/Head'
  import { MessageBox } from 'mint-ui';
  export default {
    name: 'setPwd',
    data () {
      return {
        password1:'',
        password2:'',
        pwdErr:false,
        pwdErr2:false
      }
    },
    created(){
      this.shopInfo = JSON.parse(localStorage.getItem('shopInfo'));
      this.userInfo = JSON.parse(localStorage.getItem('userInfo'));
    },
    components: {
      'el-header': Header
    },
    methods: {
      savePwd(){
          this.$http.post(this.API.my_shop_password,{
            id:this.shopInfo.id,
            payPassword:this.password1,
            payPassword2:this.password2
          }).then(res=>{
            if(res.data.status===1){
//              this.userInfo.hasPwd = 1
//              localStorage.setItem('userInfo',JSON.stringify(this.userInfo))
                this.G.goBack()
            }
          }).catch(err=>{

          })
      },
      checkPwd(){
          if(!/^\d{6}$/.test(this.password1)){
              this.pwdErr = true
          }
      },
      checkPwd2(){
          if(this.password1 !== this.password2){
              this.pwdErr2 = true
          }
      }
    },
    watch:{
        'password1'(newV,oldV){
          this.pwdErr= (newV !==oldV?false:true)
        },
        'password2'(newV,oldV){
        this.pwdErr2=(newV !==oldV?false:true)
        }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.inputList{
  padding: 1.2rem;
  background-color: #fff;
}
.inputList>p{
  line-height: 4rem;
  position: relative;
  border-bottom: 1px solid #efefef;
}
.inputList>p>input{
  line-height: 4rem;
  text-align: center;
  width: 100%;
  font-size: 1.3rem;
}
.inputList>p>span{
  color: #ff5956;
  position: absolute;
  right:0;

}
.inputList>p>i{
  float: left;
  width: 4rem;
}
  .save.dis{
    background-color:#6c9b83 ;
  }
  .save{
    margin: 1.2rem;
    color: #fff;
    line-height: 4rem;
    text-align: center;
    font-size: 1.5rem;
    background-color: #008842;
  }
</style>
