<template>
  <footer class="foot" >
    <ul class="cl">
      <li :class="{on:choose==1}" @click="goToShop"><a><p>商店</p></a></li>
      <li :class="{on:choose==2}" @click="goToCooker"><a><p>特色</p></a></li>
      <li :class="{on:choose==3}" @click="goToLive"><a><p>直播</p></a></li>
      <li :class="{on:choose==4}" @click="goToShoppingCart"><a><p>购物篮</p></a></li>
      <li :class="{on:choose==5}" @click="goToMe"><a><p>我</p></a></li>
    </ul>
  </footer>
</template>

<script>
export default {
  name: 'foot',
  props:['choose'],
  data () {
    return {
    }
  },
  created(){
  },
  methods:{
    goToShop:function () {
      this.$router.push({name:'shop'})
    },
    goToCooker:function () {
      this.$router.push({name:'character'})
    },
    goToLive:function () {
      this.$router.push({name:'live'})
    },
    goToShoppingCart:function () {
      this.$router.push({name:'shoppingCart'})
    },
    goToMe:function () {
      this.$router.push({name:'me'})
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .foot{
    position: fixed;
    bottom:0;
    width:100%;
    max-width:640px;
    height: 3.611rem;
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
    border-top: 1px solid #dddddd;
    background-color: #fff;
  }
  .foot>ul>li.on>a{
    color: #008842;
  }
  .foot>ul>li>a{
    color: #aeaeae;
    display: block;
    line-height: 5.611rem;
  }
  .foot>ul>li:nth-child(1)>a{
     background: url('../assets/img/footer/shop.png') no-repeat center 0.4rem/ 1.944rem ;
   }
  .foot>ul>li:nth-child(2)>a{
    background: url('../assets/img/footer/cooker.png') no-repeat center 0.4rem/ 1.278rem ;
  }
  .foot>ul>li:nth-child(3)>a{
    background: url('../assets/img/footer/live.png') no-repeat center 0.7rem/ 1.667rem ;
  }
  .foot>ul>li:nth-child(4)>a{
    background: url('../assets/img/footer/cart.png') no-repeat center 0.5rem/ 1.583rem ;
  }
  .foot>ul>li:nth-child(5)>a{
    background: url('../assets/img/footer/me.png') no-repeat center 0.5rem/ 1.222rem ;
  }
  .foot>ul>li.on:nth-child(1)>a{
    background: url('../assets/img/footer/shop_on.png') no-repeat center 0.4rem/ 1.944rem ;
  }
  .foot>ul>li.on:nth-child(2)>a{
    background: url('../assets/img/footer/cooker_on.png') no-repeat center 0.4rem/ 1.278rem ;
  }
  .foot>ul>li.on:nth-child(3)>a{
    background: url('../assets/img/footer/live_on.png') no-repeat center 0.7rem/ 1.667rem ;
  }
  .foot>ul>li.on:nth-child(4)>a{
    background: url('../assets/img/footer/cart_on.png') no-repeat center 0.5rem/ 1.583rem ;
  }
  .foot>ul>li.on:nth-child(5)>a{
    background: url('../assets/img/footer/me_on.png') no-repeat center 0.5rem/ 1.222rem ;
  }
  .foot>ul>li{
    width:20%;
    text-align: center;
  }
</style>
