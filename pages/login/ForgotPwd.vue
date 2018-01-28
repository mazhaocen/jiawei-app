<template>
  <div class="register" style="padding: 0">
    <header>忘记密码</header>
    <section class="content" style="padding-bottom: 0">
      <div>
        <ul class=" register-input account cl">
          <li><img src="../../assets/img/login/user.png" alt=""><input type="text" placeholder="请输入用户账号"></li>
          <li><img src="../../assets/img/login/pwd.png" alt=""><input type="text" placeholder="请输入新密码"></li>
          <li><img src="../../assets/img/login/pwd.png" alt=""><input type="text" placeholder="请再次输入新密码"></li>
          <li class="security"><img src="../../assets/img/login/tel.png" alt="">
            <input type="text" placeholder="请输入手机号">
            <!--<el-get-code></el-get-code>-->
          </li>
          <li><img src="../../assets/img/login/msg.png" alt=""><input type="text" placeholder="请输入验证码"></li>
        </ul>
      </div>
      <div class="register-btn">
        <button>修改密码</button>
        <p @click="goToLogin"><!--<span class="fl">注册</span>--><span class="">已有账号 登录</span></p>
      </div>
    </section>
    <!--<footer @click="goToRegister">申请开店</footer>-->
  </div>
</template>

<script>
//  import GetCode from '@/components/GetCode'
  export default {
    name: 'register',
    data () {
      return {
          loginType:'account'
      }
    },
    components:{
//        'el-get-code':GetCode
    },
    created(){

    },
    methods: {
      registerType (type) {
          this.loginType = type
      },
      goToLogin () {
          this.$router.push({name:'Login'})
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
