<template>
  <div class="liveCertify">
    <el-header title="直播认证" className="go_back"></el-header>
    <section class="content">
      <div class="liverInfo">
        <span>请填写本人实名信息，如非本人实名将无法提现</span>
        <p><span>真实姓名</span><input v-model="linkName" type="text" placeholder="请输入您的真实姓名"><span v-if="nameErr" class="err">请输入正确姓名</span></p>
        <p><span>联系电话</span><input v-model="linkPhone" type="text" placeholder="请输入您的联系电话"><span v-if="telErr" class="err">请输入正确手机号码</span></p>
        <p><span>身份证号</span><input v-model="linkCardNo" type="text" placeholder="请输入您的身份证号"><span v-if="idCardErr" class="err">请输入正确身份证号码</span></p>
      </div>
      <p class="liveXy" @click="showNegotiate=true" :class="{'on':agree}"> <span @click.stop="agree=!agree"><img src="../../assets/img/me/dagou.png" alt=""></span>直播协议</p>
      <div class="applyBtn">
        <p @click="certify" v-if="agree">开始认证</p>
        <p class="dis" v-if="!agree">开始认证</p>
      </div>
    </section>
    <mt-popup v-model="showNegotiate" :modal="false"  position="bottom" style="width: 100%;height: 100%">
      <el-header title="直播协议"></el-header>
      <div class="content">
        <img  src="../../assets/img/live/liveXy.png" alt="">
      </div>
      <button class="negotiateSure" @click="showNegotiate=false">确定</button>
    </mt-popup>
  </div>
</template>

<script>
  import Header from '@/components/Head'
  import {Popup, Checklist, MessageBox, Toast, Actionsheet, Indicator} from 'mint-ui';
export default {
  name: 'liveCertify',
  data () {
    return {
      linkName:'',
      linkPhone:'',
      linkCardNo:'',
      agree:true,
      showNegotiate:false,
      nameErr:false,
      telErr:false,
      idCardErr:false,
      reg:{
        tel:new RegExp(/^1[3|4|5|7|8][0-9]{9}$/),//用户姓名
        name :new RegExp(/^[\u4E00-\u9FA5A-Za-z]+$/), // 手机号码验证
        idCard: new RegExp(/^(^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$)|(^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])((\d{4})|\d{3}[Xx])$)$/)
      }
    }
  },
  components:{
    'el-header': Header,
    'mt-popup':Popup
  },

  created(){
    // console.log(this.$route.params.liveType)
  },
  methods:{
    certify(){
      this.nameErr = false
      this.telErr = false
      this.idCardErr = false
      if(!this.reg.name.test(this.linkName)){
          // console.log('名字错')
        this.nameErr= true
        return
      }
      if(!this.reg.tel.test(this.linkPhone)){
        // console.log('电话错')
        this.telErr= true
        return
      }
      if(!this.reg.idCard.test(this.linkCardNo)){
        // console.log('省份证错')
        this.idCardErr= true
        return
      }

        this.$http.post(this.API.live_open,{
          linkName:this.linkName,
          linkPhone:this.linkPhone,
          linkCardNo:this.linkCardNo,
          liveType:this.$route.params.liveType
        }).then(res=>{
          // console.log(res.data)
          if(res.data.status==1){
            MessageBox.confirm('认证成功，开始直播吧！','提示').then(action =>{
              this.$router.push({name:'beginLive'})
            }).catch(err=>{
              this.G.goBack()
            });
          }else{
            MessageBox.alert('认证失败，请重试！','提示').then(action => {

            });
          }
        }).catch(err=>{

        })
    }
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
.liverInfo>p>input{
  width: 23rem;
  height: 4rem;
  padding-left: 1rem;
}
.liverInfo>p .err{
  position: absolute;
  right:1rem;
  color: #ff5956;
  line-height: 4rem;
}
.liverInfo>p{
  position: relative;
  border-bottom:1px solid #efefef;
  padding: 0 1rem;
  height: 4.1rem;
  line-height: 3.6rem;
}
.liverInfo>span{
  padding:0 1rem;
  display: block;
  line-height: 4rem;
  background-color: #e8e8e8;
}
.liverInfo{

}

.liveXy>span{
  float: left;
  width: 1.25rem;
  height: 1.25rem;
  border: 1px solid #a9b3bd;
  border-radius: 3px;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  margin-right: .5rem;
}
.liveXy{
  padding: 1rem;
  line-height: 1.25rem;
  /* font-size: .833rem; */
  color: #008842;
  width: 7rem;
}

.liveXy.on > span{
background-color: #008842;
}
  .applyBtn{
    margin-top: 5rem;
  }
  .applyBtn>p.dis{
    background-color: #ddd;
  }
  .applyBtn>p{
    width: 18.611rem;
    height: 3.556rem;
    font-size: 1.333rem;
    border-radius: 5px;
    text-align: center;
    margin: 1rem auto;
    line-height: 3.556rem;
    background-color: #008842;
    color: #fff;
  }
</style>
