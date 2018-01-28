<template>
  <div class="receivedOrderState">
    <el-header className="go_back" title="待收"></el-header>
    <section class="content" style="background-color: #efefef">
      <div class="order-nav cl">
        <p class="fl">订单状态</p>
        <ul class="cl ">
          <li v-for="i,index in 4" @click="chooseOrder(index)" :class="{on:index==orderIndex}">{{index+1}}单</li>
        </ul>
      </div>
      <div class="detail">
        <ul class="cl">
          <li class="step first on">
            <div class=""><p>订单已提交</p><span>请耐心等待商家确认</span></div><span>12:30</span>
          </li>
          <li class="step on">
            <div class="select"><p>支付成功</p></div><span>12:32</span>
          </li>
          <li class="step">
            <div class=""><p>等待商家接单</p></div><span></span>
          </li>
          <li class="step last ">
            <div class=""><p>确认收货</p></div><span></span>
          </li>
        </ul>
        <div class="wait">
          <p>等待接单    00:29:48</p>
          <span>30分钟内商家未接单，将自动取消。</span>
        </div>
      </div>
    </section>
    <div class="btns">
      <ul>
        <li>催单</li>
        <li style="width: 66.666%;background-color: #a9a9a9">取消订单</li>
      </ul>
    </div>
  </div>
</template>

<script>
  import Header from '@/components/Head'
export default {
  name: 'receivedOrderState',
  data () {
    return {
        title: '',
      m:1,
      orderIndex:0
    }
  },
  created(){

  },
  components:{
    'el-header':Header
  },
  methods:{
    goToWrite () {
        this.$router.push({name:'writeAppraise'})
    },
    chooseOrder(i){
      this.orderIndex = i
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .wait>span{
    color: #a9a9a9;
  }
  .wait{
    margin-top: 5rem;
    border-top: 1px solid #efefef;
    padding:1rem;
  }
  .wait>p{
    color: #008842;
  }
  .step:after{
    width: .889rem;
    height: .889rem;
    border-radius: 50%;
    top:0;
    bottom:0;
    margin: auto;
    left:-2rem;
    z-index:333;
  }
  .step.last:before{
    /*height: 3.139rem;*/
    /*top:0*/
  }
  .step.first:before{
    height: 0;
  }
  .step:before{
    height: 6.278rem;
    width: 1px;
    left:-1.555rem;
    top:-3.139rem;

  }
  .step.on:before,.step.on:after{
    background-color: #008842;
  }
  .step:before,.step:after{
    content: '';
    display: block;
    position: absolute;
    background-color: #dadada;
  }
  .step>span{
    vertical-align: middle;
    display: table-cell;
    text-align: right;
    color: #adadad;
  }
  .step>div>span{
    color: #adadad;
  }
  .step>div>p{
    font-size: 1.333rem;
  }
  .step .select>p{
    color: #008842;
  }
  .step>div{
    vertical-align: middle;
    display: table-cell;
  }
  .detail>ul{
    padding: 1rem;
  }
  .detail .step{
    position: relative;
    padding:0 1rem;
    border-bottom: 1px solid #efefef;
    width: 21.944rem;
    height: 6.278rem;
    float: right;
    display: table;
  }
  .btns li{
    font-size: 1.333rem;
    background-color: #bddbcb;
    width: 33.333%;
    border-right: 1px solid #ffffff;
    line-height: 3.611rem;
    text-align: center;
  }
  .btns{
    height: 3.611rem;
    width: 100%;
    position: absolute;
    bottom:0;
  }

 .order-nav{
   padding: .5rem 1rem 0 1rem;
 }
 .order-nav>ul>li.on{
   background-color: #fff;
 }
 .order-nav>ul>li{
   background-color: #f9f9f9;
   padding: 0 1rem;
   margin-right: .5rem;
   line-height: 2rem;
 }
 .order-nav>p{
   color: #008842;
   margin-right: 2rem;
 }
  .detail{
    background-color: #fff;
  }
</style>
