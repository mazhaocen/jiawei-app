<template>
  <div class="register1">
    <el-header className="go_back" title="注册">
      <a style="right: 1rem;font-size: 1.333rem;color: #008842;" @click="this.G.goBack">登录</a>
    </el-header>
    <section class="content">
      <div class="register-input">
        <div class="user pr">
          <input type="tel" v-model="phone" placeholder="请输入手机号码">
          <p v-if="!phone.trim()" class="pa dis">获取验证码</p>
          <p v-if="phone.trim() && getMsgCodeTime" class="pa dis">{{getMsgCodeTime}}s</p>
          <p v-if="phone.trim() && !getMsgCodeTime" class="pa" @click="getMsgCode">获取验证码</p>
        </div>
        <div class="verify"><input type="number" v-model="msgCode" placeholder="请输入验证码" maxlength="6"></div>
        <div class="password"><input type="password" v-model="password" placeholder="请输入密码"></div>
        <div class="recommend"><input type="text" v-model="serviceCode" placeholder="请输填写推荐人"></div>
      </div>
      <div class="btn-s cl">
        <!--<p  :class="{'on':agree}"><span class="pr" @click="agree=!agree"></span></p>-->
        <p @click="showNegotiate=true" :class="{'on':agree}"> <span @click.stop="agree=!agree"><img src="../../assets/img/me/dagou.png" alt=""></span>注册协议</p>
        <div class="login-btn" v-if="!agree ||!(phone.trim())||!(msgCode.trim())||!(password.trim())">注册</div>
        <div class="login-btn on" v-if="agree&&phone.trim()&&msgCode.trim()&&password.trim()" @click="register">注册</div>
      </div>
    </section>
    <mt-popup v-model="showNegotiate" :modal="false"  position="bottom" style="width: 100%;height: 100%">
      <el-header title="用户注册协议"></el-header>
      <div class="content">
        <img  src="../../assets/img/login/zhucexy.jpg" alt="">
      </div>
      <button class="negotiateSure" @click="showNegotiate=false">确定</button>
    </mt-popup>
  </div>
</template>

<script>
  import {Indicator, Toast, Popup} from 'mint-ui';
  import Header from '@/components/Head'
  export default {
    name: 'register',
    data () {
      return {
        agree: true,
        phone: '',
        msgCode: '',
        password: '',
        getMsgCodeTime: null,
        serviceCode:'',
        showNegotiate:false
      }
    },
    components: {
      'el-header': Header,
      'mt-popup': Popup,
    },
    created(){

    },
    methods: {
      getMsgCode(){//获取短信验证码
        this.$http.post(this.API.sendSms, {
          phone: this.phone
        }).then(res => {
          // console.log(JSON.stringify(res.data));
          let msg = '';
          if (res.data.status === 1) {//发送成功 提示 再次获得验证码倒计时
            msg = '发送成功，请查收短信!';
            this.getMsgCodeTime = 90;
            this.computingTime()
          } else {                    //发送失败 提示
            msg = res.data.message
          }
          Toast({
            message: msg
          });

        })
      },
      computingTime(){// 获取验证码 倒计时方法
        let codeTime = setInterval(() => {
          this.getMsgCodeTime--
          if (this.getMsgCodeTime == 0) {
            clearInterval(codeTime)
            this.getMsgCodeTime = null
          }
        }, 1000)
      },
      goToLogin () {//前往登录页面
        this.$router.push({name: 'Login'})
      },
      register () { //点击注册
        Indicator.open('注册中...');
        this.$http.post(this.API.register, {
          phone: this.phone,
          captcha: this.msgCode,
          password: this.password,
          serviceCode:this.serviceCode
        }).then(res => {
          // console.log(res.data)
          Indicator.close();
          let msg = ''
          if (res.data.status === 1) {//注册成功 提示 前往登录页面
            msg = '注册成功!';
            setTimeout(()=>{
                this.G.goBack()
            },1500)
          } else {                    //注册失败 提示
            msg = res.data.message
          }
          Toast({
            message: msg
          });
        }).catch(err => {
          // console.log(err.response);
          Indicator.close();
          Toast({
            message: '注册失败！',
          });
        })
      },
    },
    destroyed () {
      sessionStorage.removeItem('photoNum')
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .negotiateSure{
    position: absolute;
    bottom:0;
    background-color: #008842;
    width:100%;
    line-height: 4rem;
    color: #fff;
    font-size: 1.4rem;
  }
  .recommend {
    background: url("../../assets/img/login/user.png") no-repeat left 2rem/1.444rem;
  }
  .register-input input {
    margin-left: 2rem;
    width: 20rem;
    background-color: #fff;
    height: 3rem;
    margin-top: 1.35rem;
  }

  .register-input > div {
    border-bottom: 1px solid #008842;
    height: 4.444rem;
  }

  .register-input {
    width: 21.944rem;
    margin: 2rem auto 3rem;
  }

  .user > p.dis {
    background-color: #efefef;
    color: #666;
  }

  .user > p {
    width: 9rem;
    line-height: 3rem;
    text-align: center;
    background-color: #008842;
    font-size: 1.333rem;
    color: #fff;
    border-radius: 5px;
    border: 3px solid #fff;
    right: -3px;
    bottom: -3px;
  }

  .user {
    background: url("../../assets/img/login/tel.png") no-repeat left 1.8rem /1.444rem;
  }

  .verify {
    background: url("../../assets/img/login/msg.png") no-repeat left 2.3rem /1.444rem;
  }

  .password {
    background: url("../../assets/img/login/pwd.png") no-repeat left 2.2rem/1.444rem;
  }

  .btn-s {
    width: 24rem;
    margin: 6rem auto 0;
  }

  .login-btn {
    text-align: center;
    color: #008842;
    background-color: #efefed;
    font-size: 1.333rem;
    line-height: 3.333rem;
    border-radius: 3px;
  }

  .login-btn.on {
    color: #fff;
    background-color: #008842;
  }

  .btn-s > p.on > span {
    background-color: #008842;
  }
  .btn-s > p > span {
    float: left;
    width: 1.25rem;
    height: 1.25rem;
    border: 1px solid #a9b3bd;
    border-radius: 3px;
    box-sizing: border-box;
    margin-right: .5rem;
  }

  .btn-s > p {
    padding: 1rem .5rem;
    line-height: 1.25rem;
    /*font-size: .833rem;*/
    color: #008842;
    width: 7rem;
  }
</style>
