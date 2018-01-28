<template>
  <div class="applyLive">
    <el-header title="申请直播" className="go_back"></el-header>
    <section class="content">
      <div class="applyText">
        <h2>直播申请快速成功</h2>
        <p>一分钟实名认证即可快速开播</p>
        <p>有机会登上首页，让更多人看到你</p>
        <p>快来开播吧！</p>
      </div>
      <div class="applyBtn">
        <p @click="goToCertify(0)">成为个人主播</p>
        <p @click="goToCertify(1)">成为餐厅主播</p>
      </div>
    </section>
  </div>
</template>

<script>
  import Header from '@/components/Head'
  import {Popup, Checklist, MessageBox, Toast, Actionsheet, Indicator} from 'mint-ui';
export default {
  name: 'applyLive',
  data () {
    return {

    }
  },
  components:{
    'el-header': Header
  },

  created(){

  },
  methods:{
    goToCertify(type){
        this.$router.push({name:'liveCertify',params:{liveType:type}})
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .applyText{
    text-align: center;
    margin-top: 10rem;
  }
  .applyText>p:last-child{
    margin: 5rem auto;
  }
  .applyText>p{
    font-size: 1.222rem;
    color: #888;
  }
  .applyText>h2{
    margin-bottom: 2rem;
    font-size: 2rem;
  }
  .applyBtn>p:last-child{
    background-color: #fff;
    color: #008842;
  }
  .applyBtn>p{
    width: 18.611rem;
    height: 3.556rem;
    font-size: 1.333rem;
    border-radius: 5px;
    text-align: center;
    margin: 1rem auto;
    border:1px solid #008842;
    line-height: 3.556rem;
    background-color: #008842;
    color: #fff;
  }
</style>
