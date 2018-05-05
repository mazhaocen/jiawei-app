<template>
  <div class="me">
    <el-header title='我'>
      <a class="set" @click="goToSetCenter"></a>
    </el-header>
    <section class="content">
      <div class="about_me">
        <div class="head_img" v-if="userInfo.img"><img v-lazy="userInfo.img" alt=""></div>
        <div class="head_text">
          <h4 v-if="username">{{username}}</h4>
          <h4 v-if="!username" @click="goToSingIn">登录</h4>
          <p v-if="username">星级: <span></span></p>
          <a @click="goToUserCenter">账户管理</a>
        </div>
      </div>
      <div class="my_order cell cl">
        <div class="fl order_img">
          <img src="../../assets/img/me/order.png" alt=""><p>我的订单</p></div>
        <ul class="cl fl">
          <li @click="goToPayOrder()">
            <img src="../../assets/img/me/pay.png" alt=""><p>待付款</p>
          </li>
          <li @click="goToReceivedOrder()" >
            <img src="../../assets/img/me/get-goods.png" alt=""><p>待收货</p>
          </li>
          <li @click="goToAppraise()">
            <img src="../../assets/img/me/evaluation.png" alt=""><p>待评价</p>
          </li>
        </ul>
      </div>
      <div class="my_purse cell cl">
        <div class="fl purse_img">
          <img src="../../assets/img/me/purse.png" alt=""><p>我的钱包</p></div>
        <ul class="cl fl">
          <li>
            <h4>0</h4><p>可用菜钱</p>
          </li>
          <!--<li>-->
            <!--<h4>0</h4><p>优惠券</p>-->
          <!--</li>-->
          <li @click="goToBalanceMoney">
            <h4>￥0.00</h4><p>可用余额</p>
          </li>
        </ul>
      </div>
      <div class="my_shop sm_cell pd-1 cl bdt-5" @click="goToMyShop">
        <p><img src="../../assets/img/me/me-shop.png" alt=""></p>
        <span>我的店铺</span>
      </div>
      <ul class="cl pd-1 bdt-5 ul_list">
        <li class="cl sm_cell cookbook" @click="goToMenuInfo('meCreateMenu')">
          <p><img src="../../assets/img/me/me-cookbook.png" alt=""></p><span>我发菜谱</span>
        </li>
        <li class="cl sm_cell cookInfo info" @click="goToMenuInfo('meSeenMenu')">
          <p><img src="../../assets/img/me/look-cookbook.png" alt=""></p><span>我发资讯</span>
        </li>
        <li class="cl sm_cell collect" @click="goToMenuInfo('meCollectMenu')">
          <p><img src="../../assets/img/me/collect-cookbook.png" alt=""></p><span>收藏菜谱</span>
        </li>
      </ul>
      <ul class="cl pd-1 bdt-5 ul_list">
        <li class="cl sm_cell careShop" @click="goToCollectStore()">
          <p><img src="../../assets/img/me/me-shop.png" alt=""></p><span>关注店铺</span>
        </li>
        <li class="cl sm_cell careCook" @click="goToCollectCook()">
          <p><img src="../../assets/img/me/care-cooker.png" alt=""></p><span>关注厨师</span>
        </li>
      </ul>
      <ul class="cl pd-1 bdt-5 ul_list">
        <li class="cl sm_cell address" @click="goToAddressListManage">
          <p><img src="../../assets/img/me/address.png" alt=""></p><span>地址管理</span>
        </li>
        <li class="cl sm_cell service" @click="show=true">
          <p><img src="../../assets/img/me/server.png" alt=""></p><span>客服</span>
        </li>
      </ul>

    </section>
    <el-footer :choose=5></el-footer>
    <mt-popup v-model="show" position="bottom" style="width: 100%" class="make-call">
        <p>请确认拨打客服电话：0755-26905891</p>
        <div><button style="background: #ccc" @click="show=false">取消</button><a @click="show=false" v-bind:href="tel">确认</a></div>
    </mt-popup>
    <mt-popup v-model="inputPwd" position="top" class="inputpwd">
      <p>请输入进店密码</p>
      <input type="password"  v-model="payPassword" maxlength="6" placeholder="请输入密码" ref="focusStatue">
      <span v-if="pwdErr">密码有误，请重新输入!</span>
      <div class="dis" v-if="!/^\d{6}$/.test(payPassword)">进入店铺</div>
      <div v-if="/^\d{6}$/.test(payPassword)" @click="goToShopCheck">进入店铺</div>
    </mt-popup>
  </div>
</template>

<script>
  import Footer from '@/components/Foot'
  import Header from '@/components/Head'
  import { Popup, MessageBox, Indicator } from 'mint-ui';
export default {
  name: 'me',
  data () {
    return {
      show:false,
      tel:'tel:0755-26905891',
      username:'',
      userInfo:{},
      inputPwd:false,
      payPassword:'',
      pwdErr:false,
    }
  },
  components:{
    'el-footer':Footer,
    'el-header':Header,
    'mt-popup': Popup
  },
  created(){
    if(localStorage.getItem('userInfo')){
      this.userInfo = JSON.parse(localStorage.getItem('userInfo'))
    }else{
      this.userInfo.img=''
    }
  },
  activated(){ //activated  keep-alive组件激活时调用。该钩子在服务器端渲染期间不被调用。
//    // console.log(this.$route.meta.height);
    if(document.getElementsByClassName('content')[1]){
      document.getElementsByClassName('content')[1].scrollTop = this.$route.meta.height
    }
    if(localStorage.getItem('userInfo')){
      this.userInfo = JSON.parse(localStorage.getItem('userInfo'))
    }else{
        this.userInfo.img=''
    }

    if(localStorage.getItem('userName')){
      this.username =localStorage.getItem('userName')
    }else if(localStorage.getItem('phone')){
      this.username =localStorage.getItem('phone')
    }else{
      this.username=''
    }
    window.page='me'
  },
  beforeRouteLeave(to, from, next){
    this.$route.meta.height=document.getElementsByClassName('content')[0].scrollTop;
    window.page='';
    next()
  },
  mounted(){

  },
  destroyed () {
    window.page = ''
  },
  methods:{
    goToMyShop () {//去我的店铺

      if(localStorage.getItem('userId')){
        Indicator.open()
        this.$http.post(this.API.my_shop_Info,{}).then(res=>{//请求我的店铺资料
          Indicator.close()
          if(res.data.status==1){
            Indicator.close()
            localStorage.setItem('shopInfo',JSON.stringify(res.data.data));
            this.shopInfo = res.data.data;
            if(JSON.parse(sessionStorage.getItem('goToShopPwd'))){//如果不是第一次进入就进入店铺页面
              this.$router.push({name:'MyShop'})
            }else{
              if(this.shopInfo.isExistPayPwd){  //如果第一次进入页面 看有咩有密码 有密码输入
                this.inputPwd = true;
                setTimeout( ()=> {
                  this.$refs.focusStatue.focus()
                },200)
              }else{  //没密码提示设置密码
                MessageBox({
                  title: '说明',
                  message: '您还没有设置进店密码，为了确保您的店铺安全，请设置密码',
                  showCancelButton: true,
                  cancelButtonText:'不了下次',
                  cancelButtonClass:'alertCancel'
                }).then(res =>{
                  if(res ==='confirm'){
                    this.$router.push({name:'setPwd'})
                  }else{
                    this.$router.push({name:'MyShop'})
                  }
                });
              }
            }
          }else if(res.data.status==0 && res.data.message=='未找到您的店铺'){
            Indicator.close()
            this.$router.push({name:'NewShop'})
          }
        }).catch(err=>{
          // console.log(err)
          Indicator.close()
        })
      }else{
        // Indicator.close()
        this.goToSingIn()
      }

    },
    goToShopCheck(){//输入密码进店
      this.pwdErr = false
      this.$http.post(this.API.inShopCheck,{
        id:this.shopInfo.id,
        payPassword:this.payPassword
      }).then(res=>{
          if(res.data.status===1){
              sessionStorage.setItem('goToShopPwd',true)
            this.payPassword=''
            this.inputPwd = false;
            setTimeout(()=> {
              this.$router.push({name:'MyShop'})
            },200)

          }else{
              this.pwdErr = true
          }
      }).catch(err=>{

      })
    },
    goToMenuInfo (name) { //去我发的菜谱 我发的资讯 我收藏的菜谱
      if(localStorage.getItem('userId')){
        this.$router.push({name:'menu',params:{name:name}})
        sessionStorage.setItem('menuName',name)
      }else{
        this.goToSingIn()
      }
    },
    goToCollectCook() {//查看我关注的厨师
      if(localStorage.getItem('userId')){
        this.$router.push({name:'collectCook'})
      }else{
        this.goToSingIn()
      }

    },
    goToCollectStore() {//去我关注的店铺
      if(localStorage.getItem('userId')){
        this.$router.push({name:'collectStore'})
      }else{
        this.goToSingIn()
      }

    },
    goToAppraise () {//去待评价
      if(localStorage.getItem('userId')){
        this.$router.push({name:'appraise'})
      }else{
        this.goToSingIn()
      }
    },
    goToReceivedOrder(){//前往待收货
      if(localStorage.getItem('userId')){
        this.$router.push({name:'receivedOrder'})
      }else{
        this.goToSingIn()
      }

    },
    goToUserCenter () {//去用户管理界面
      if(localStorage.getItem('userId')){
        this.$router.push({name:'userCenter'})
      }else{
        this.goToSingIn()
      }
    },
    goToBalanceMoney(){//查看可用余额
      if(localStorage.getItem('userId')){
        this.$router.push({name:'BalanceMoney'})
      }else{
        this.goToSingIn()
      }
    },
    goToSetCenter(){//去设置中心
      if(localStorage.getItem('userId')){
        this.$router.push({name:'setCenter'})
      }else{
        this.goToSingIn()
      }
    },
    goToAddressListManage(){//去设置中心
      if(localStorage.getItem('userId')){
        this.$router.push({name:'addressManage'})
      }else{
        this.goToSingIn()
      }
    },
    goToPayOrder(){
      if(localStorage.getItem('userId')){
        this.$router.push({name:'payOrder'})
      }else{
        this.goToSingIn()
      }
    },
    goToSingIn(){
      this.$router.push({name:'Login'})
    }
  }
}
</script>

<style scoped>
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
  .cookInfo>p>img{width: 1.472rem;}
  .cookbook>p>img{width: 1.111rem;}
  .my_shop>p>img{width: 1.583rem;}
  .careShop>p>img{width: 1.583rem;}
  .collect>p>img{width: 1.583rem;}
  .careCook>p>img{width: .972rem;}
  .address>p>img{width: .806rem;}
  .service>p>img{width: .972rem;}
  .order_img>img{width:1.222rem;padding-top: .1rem}
  .purse_img>img{width:1.523rem;padding-top: .7rem}
  .my_order>ul>li:nth-child(1)>img{width:1.611rem;padding-top: .4rem}
  .my_order>ul>li:nth-child(2)>img{width:1.667rem }
  .my_order>ul>li:nth-child(3)>img{width:1.778rem;padding-top: .3rem}
  .make-call>p{line-height: 10rem;font-size: 1.333rem;}
  .make-call{text-align: center;}
  .make-call>div>a{background: #008842;}
  .make-call>div>button,.make-call>div>a{display: block;float: left;width: 50%;text-align: center;color: #fff;line-height: 3.5rem;font-size: 1.333rem;}
  .ul_list li.sm_cell{float: none;border-bottom:1px solid #f6f6f6;height:3.528rem;}
  .sm_cell>p{float: left;text-align: center;width: 2rem;line-height: 3.228rem}
  .sm_cell span{line-height: 3.52rem;float: left;margin-left: 1rem;}
  .sm_cell>a{display: block;height:3.528rem}
  .sm_cell{height:3.528rem;}
  .sm_cell img{vertical-align: middle}
  .my_order{border-bottom: 0.805rem solid #f6f6f6;}
  .cell>ul{width: 77.777%;}
  .cell>ul>li>h4{line-height: 2.254rem;font-weight: 400;font-size: 1.33rem;}
  .cell>ul>li{width:33.333%;}
  .cell>div:after{content: '';width:1px;height:5rem;position: absolute;background-color: #cccccc;left:6.666rem;top:0;bottom:0;margin: auto;}
  .cell p{line-height: 2.2rem;}
  .cell>div{width: 22.222%;}
  .cell{padding-top: 1.833rem;padding-bottom: 1.111rem;text-align: center;position: relative;}
  .head_text>a{font-size: .833rem;display: block;position: absolute;right:2rem;top:0;line-height: 6.611rem;}
  .head_text>p>span{display: inline-block;width:.972rem;height:.972rem;background: url("../../assets/img/me/star.png") no-repeat center center /.972rem;}
  .head_text{padding: 2rem 0 0 7rem;}
  .head_img{position: absolute;margin: auto;top:0;bottom:0;left:1.75rem;width:4.333rem;height:4.333rem;overflow: hidden;
    -webkit-border-radius:50%;-moz-border-radius:50%;border-radius:50%;background: url("../../assets/img/me/me-head.png") no-repeat center center /4.333rem;}
  .about_me{vertical-align: middle;height: 6.611rem ;width: 100%;background-color: #f6f6f6;position: relative;}
  .set{background: url("../../assets/img/me/set.png") no-repeat center center /1.333rem;right:0;}

</style>
