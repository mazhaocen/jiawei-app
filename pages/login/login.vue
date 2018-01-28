<template>
  <div class="login1">
    <el-header className="go_back" title="登录">
      <a style="right: 1rem;font-size: 1.333rem;color: #008842;" @click="goToRegister">注册</a>
    </el-header>
    <div class="login-input">
      <div class="user"><input type="tel" v-model="phone"></div>
      <div class="password"><input type="password" v-model="password"></div>
    </div>
    <div class="btn-s cl">
      <div v-if="!phone.trim() || !(password.trim())" class="login-btn ">登录</div>
      <div v-if="phone.trim() && password.trim()" class="login-btn on" @click="singIn">登录</div>
      <p class="fr">忘记密码</p>
    </div>
    <div class="other-login cl">
      <p>或一键登录:</p>
      <a class="fl wx-login" @click="wxLogin"></a>
      <a class="fr qq-login" @click="qqLogin"></a>
    </div>
  </div>
</template>

<script>
  import Header from '@/components/Head'
  import {Indicator, Toast, MessageBox} from 'mint-ui';
  export default {
    name: 'login',
    data () {
      return {
        phone: '',
        password: ''
      }
    },
    components: {
      'el-header': Header,
    },
    created(){

    },
    methods: {
      goToRegister(){
        this.$router.push({name: 'register'})
      },
      qqLogin(){//qq 登录
        var qq = api.require('QQPlus');
        qq.login((ret, err)=> {
          var openId = ret.openId
          qq.getUserInfo((ret, err)=> {
            if (ret.status) {
//              api.alert({ msg: JSON.stringify(ret) });
              console.log(JSON.stringify(ret))
              let info;
              if (api.systemType == 'ios') {
                info  = ret.info
              } else {
                info  = JSON.parse(ret.info)
              }
              this.logoin3('QQ',openId,info.nickname,info.figureurl_qq_2)
            } else {
              MessageBox('提示', err.msg);
              console.log(JSON.stringify(err))
            }
          });

        });
      },
      wxLogin(){
        var wx = api.require('wx');
        let that = this;
        wx.auth({//微信授权登录
          apiKey: 'wx4fb8f98522d08bc4'
        }, function(ret, err) {
//          alert(JSON.stringify(ret));
//          alert(JSON.stringify(err));
          if (ret.status) {
            console.log(JSON.stringify(ret));
            wx.getToken({//微信授权成功后 获取 token 信息
              apiKey: 'wx4fb8f98522d08bc4',
              apiSecret: '676b9357d92b225e6db805c4143cca0d',
              code: ret.code
            }, function(ret, err) {
              if (ret.status) {
                console.log(JSON.stringify(ret));
                wx.getUserInfo({//获取 token 成功后 获取用户信息
                  accessToken: ret.accessToken,
                  openId: ret.openId
                }, function(ret, err) {
                  if (ret.status) {
                    console.log(JSON.stringify(ret));
                    that.logoin3("微信",ret.openid,ret.nickname,ret.headimgurl)
                  } else {
                    alert(err.code);
                  }
                });
              } else {
//                alert(err.code);
                if(err.code==4){
                  MessageBox('提示', '网络超时，请重试！');
                }
              }
            });
          } else {
            //-1（未知错误），
            //0（成功，用户同意）
            //1 (用户取消)
            //2 (用户拒绝授权)
            //3 (当前设备未安装微信客户端)
            if(err.code==1){
              MessageBox('提示', '用户取消登录！');
            }
            if(err.code==2){
              MessageBox('提示', '登录失败，用户拒绝授权！');
            }
            if(err.code==3){
              MessageBox('提示', '当前设备未安装微信客户端,请先安装微信客户端！');
            }

          }
        });
      },
      logoin3(type,openId,nickName,headImg){//第三方登录
          let params={
            loginType:type,
            openId:openId,
            nickName:nickName,
            headImg:headImg
          };
          console.log('用户信息：'+JSON.stringify(params))
          this.$http.post(this.API.login3,params).then(res=>{
              console.log(JSON.stringify(res.data))
            let msg=''
            if(res.data.status==1){
              msg = '登录成功!';
              localStorage.setItem('userId',res.data.data.id);
              localStorage.setItem('chefStatus',res.data.data.chefStatus);
              if(res.data.data.username){
                localStorage.setItem('userName',res.data.data.username);
              }
              localStorage.setItem('phone',res.data.data.phone);
              this.getUserInfo(res.data.data.id)
            } else {                     //发送失败 提示
              msg = res.data.message
            }
            Toast({
              message: msg
            });
          }).catch(err=>{
              console.log(err)
          })
      },
      singIn(){
        Indicator.open('登录中...')
        this.$http.post(this.API.login, {
          phone: this.phone,
          password: this.password,
        }).then(res => {
          Indicator.close()
            let msg=''
          if (res.data.status === 1) {//登录成功
            msg = '登录成功!';
            localStorage.setItem('userId',res.data.data.id);
            localStorage.setItem('chefStatus',res.data.data.chefStatus);
            if(res.data.data.username){
              localStorage.setItem('userName',res.data.data.username);
            }
            localStorage.setItem('phone',res.data.data.phone);
            this.getUserInfo(res.data.data.id)
          } else {                    //发送失败 提示
            msg = res.data.message
          }
          Toast({
            message: msg
          });
        }).catch(err => {
          Indicator.close()
          console.log(err)
        })
      },
      getUserInfo(){
          this.$http.post(this.API.show_chef_info, {
            id: localStorage.getItem('userId')
          }).then(res => {
              Indicator.close()
            localStorage.setItem('userInfo',JSON.stringify(res.data.data));
            this.G.goBack()
          }).catch(err => {
              console.log(err)
          })
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .other-login > p {
    text-align: center;
    color: #878787;
    font-size: .833rem;
  }

  .other-login > a.wx-login {
    background: url("../../assets/img/login/wx.png") no-repeat center/100%;
  }

  .other-login > a.qq-login {
    background: url("../../assets/img/login/qq.png") no-repeat center/100%;
  }

  .other-login > a {
    margin-top: 4rem;
    width: 3.444rem;
    height: 3.444rem;
  }

  .other-login {
    width: 15.556rem;
    margin: 10rem auto 0;
  }

  .btn-s > p {
    color: #008842;
    line-height: 4rem;
  }

  .btn-s {
    width: 24rem;
    margin: auto;
  }

  .login-btn.on {
    color: #fff;
    background-color: #008842;
  }

  .login-btn {
    text-align: center;
    color: #008842;
    background-color: #efefed;
    font-size: 1.333rem;
    line-height: 3.333rem;
    border-radius: 3px;
  }

  .login-input input {
    margin-left: 2rem;
    width: 20rem;
    background-color: #fff;
    height: 4rem;
    margin-top: 0.222rem;
  }

  .login-input > div {
    border-bottom: 1px solid #008842;
    height: 4.444rem;
  }

  .login-input {
    width: 21.944rem;
    margin: 10rem auto 3rem;
  }

  .user {
    background: url("../../assets/img/login/user.png") no-repeat center left/1.444rem;
  }

  .password {
    background: url("../../assets/img/login/pwd.png") no-repeat center left/1.444rem;
  }
</style>
