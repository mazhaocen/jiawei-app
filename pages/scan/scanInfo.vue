<template>
  <div class="scanInfo">
    <header class="header">
      <button>取消</button>
    </header>
    <section class="content">
      <div class="shop-info">
        <p class="name">店铺名称:<span>{{shopInfo.shopName}}</span></p>
        <p class="number">店铺号码:<span>{{shopInfo.shopNo}}</span></p>
      </div>
      <div class="btn">
        <button @click="goToPay()">支付</button>
        <button @click="collapse()">{{shopInfo.hasCollected?'已关注':'关注本店'}}</button>
      </div>
    </section>
  </div>
</template>

<script>
export default {
  name: 'scanInfo',
  data () {
    return {
      scanMessage:[],
    shopInfo:{}
    }
  },
  created(){
    this.scanMessage = JSON.parse(sessionStorage.getItem('scanMessage')).split('|');
    console.log(sessionStorage.getItem('scanMessage'))
    this.getShopInfo(this.scanMessage[0])
  },
  methods:{
    goToPay:function () {
      this.$router.push({name:'pay'})
    },
    getShopInfo(shopId){
      this.$http.post(this.API.getShowById,{
          id:shopId
      }).then(res=>{
          console.log(JSON.stringify(res.data))
        this.shopInfo = res.data.data
      }).catch(err=>{
          console.log(err)
      })
    },
    collapse(){//关注店铺
      if(!this.shopInfo.hasCollected){
        this.$http.post(this.API.addCollect,{
          menuId:4,
          collectId:this.shopInfo.id
        }).then(res=>{
          if(res.data.status==1){
            this.shopInfo.hasCollected=true
          }
        })
      }else{
        this.$http.post(this.API.cancelCollect,{
          menuId:4,
          collectId:this.shopInfo.id
        }).then(res=>{
          if(res.data.status==1){
            this.shopInfo.hasCollected=false
          }
        })
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .btn>button{
    width: 100%;
    background-color: #008842;
    color: #fff;
    border-radius: 3px;
    float:left;
    margin-bottom: 2rem;
    height: 3.889rem;
    font-size: 1.667rem;
  }
  .btn{
    position: absolute;
    bottom:5rem;
    width: 70%;
    margin: auto;
    left:0;
    right:0;
  }
  .header>button{
    background-color: #fff;
    color: #008842;
    font-size: 1.2rem;
    padding-left: 1rem;
  }
  .shop-info>p.name>span{
    color: #000;
    font-size: 1.667rem;
  }
  .shop-info>p>span{
    display: inline-block;
    width: 60%;
    text-align: center;
  }
  .shop-info>p{
    color: #008842;
    font-size: 1.2rem;
    margin-bottom: 2rem;
  }
  .shop-info{
    margin-top: 5rem;
    padding: 2rem;
  }
</style>
