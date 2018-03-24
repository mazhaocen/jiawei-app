<template>
  <div class="sellerStore">
    <el-header :title='shopInfo.shopName' className="go_back" ></el-header>
    <section class="content" style="padding-bottom: 0">
      <!--<mt-swipe :auto="0" style="height: 10.778rem">-->
        <!--<mt-swipe-item>-->
          <div class="store-banner"><img v-lazy="shopInfo.shopImg" alt=""></div>
        <!--</mt-swipe-item>-->
      <!--</mt-swipe>-->
      <ul class="store-nav cl">
        <li>首页</li>
        <li>全部商品 <span>{{shopGoodsList.totalRow}}</span></li>
        <li>最新上架 <span>{{1}}</span></li>
        <li style="border: none" @click="collapse()">{{shopInfo.hasCollected?'已关注':'关注店铺'}}</li>
      </ul>
      <div class="goods-type">
        <p>生鲜</p>
        <div class="store-goods cl" v-for="i in shopGoodsList.data" :key="i.id" @click="goToGoods(i)">
          <div class="img fl"><img v-lazy="i.imgs" alt=""></div>
          <div class="info fl">
            <h3>{{i.name}}</h3>
            <span>{{i.detail}}</span>
            <p>￥{{i.presentPrice}}/<span>100g</span></p>
            <s v-if="i.oldPrice && i.oldPrice!='0'">￥{{i.oldPrice}}/<span>100g</span></s>
            <div class="recommend" @click.stop="goToGoods2(i)"><p></p><span>烹饪推荐</span></div>
            <button @click.stop="addShopCar(i)">立即购买</button>
          </div>
        </div>
      </div>
    </section>

  </div>
</template>

<script>
  import  Header from '@/components/Head'
  import {Swipe,SwipeItem,Toast,Indicator} from 'mint-ui'
export default {
  name: 'sellerStore',
  data () {
    return {
        shopId:'',
      shopInfo:{},
      shopGoodsList:[]
    }
  },
  created(){
    this.shopId = sessionStorage.getItem('shopId');
    if(this.shopId){
        this.getShopGoodsList()
        this.getShopInfo()
    }
    if(sessionStorage.getItem('shopAllGoods')){
        this.shopGoodsList = JSON.parse(sessionStorage.getItem('shopAllGoods'))
        sessionStorage.removeItem('shopAllGoods')
    }
    window.page='sellerStore'
  },
  destroyed () {
    window.page=''
  },
  components:{
    'el-header':Header,
    'mt-swipe':Swipe,
    'mt-swipe-item':SwipeItem
  },
  methods:{
    getShopInfo(){
      this.$http.post(this.API.getShowById,{
        id:this.shopId,
      }).then(res=>{
          // console.log(res.data)
        this.shopInfo = res.data.data
      }).catch(err=>{
          // console.log(err)
      })
    },
    addShopCar(item){//添加购物车
      Indicator.open()
//      let goods = this.goods
      let params = {
        goodsId: item.id,
        goodsName: item.name,
        goodsNum: 1,
        goodsPrice: item.presentPrice,
        goodsImg: item.imgs
      };
      this.$http.post(this.API.shop_cart_add, params).then(res => {
        // console.log(res.data)
        if(res.data.status==1){
          Toast({message: '加入购物篮成功！'});
        }
        Indicator.close()
      }).catch(err => {
        // console.log(err)
        Indicator.close()
      })
    },
    getShopGoodsList(){//获取店铺商品信息
//      Indicator.open()
      this.$http.post(this.API.my_shop_goods_list,{
        currentPage:1,
        pageSize:20,
        shopId:this.shopId,
        status:1//上架传：1, 仓库传0
      }).then(res=>{
        this.shopGoodsList = res.data.data
//        Indicator.close()
      }).catch(err=>{
//        Indicator.close()
        // console.log(err)
      })
    },
    goToGoods2(item){//前往烹饪推荐页面
      sessionStorage.setItem('goodsInfo',JSON.stringify(item))
      sessionStorage.setItem('goodsActive','goodsRecommend')
      this.$router.push({name: 'goodsContainer'})
    },
    goToGoods(item){//查看具体商品信息
      sessionStorage.setItem('shopAllGoods',JSON.stringify(this.shopInfo));
      sessionStorage.setItem('goodsInfo',JSON.stringify(item));
      sessionStorage.setItem('goodsActive','goods')
      this.$router.push({name:'goodsContainer'})
    },
    collapse(){
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
  .info>button{
    width: 6.667rem;
    height: 2.333rem;
    background-color: #008842;
    color: #ffffff;
    position: absolute;
    bottom:1rem;
    right:1rem;
    border-radius: 3px;
  }
  .recommend>span{
    font-size: .833rem;
    color: #008842;
  }
  .recommend>p{
    width: 2.028rem;
    margin: auto;
    height:1.389rem;
    background: url("../../assets/img/sellerStore/penrentuijian.png") no-repeat center center/100%;
  }
  .recommend{
    position: absolute;
    bottom: 0.8rem;
    right: 9rem;
    z-index: 100;
  }
  .store-goods>.info>s>span{
    font-size: .7rem;
  }
  .store-goods>.info>s{
    height: 1rem;
    font-size: .9rem;
    color: #848689;
  }
  .store-goods>.info>p>span{
    font-size: 1rem;
  }
  .store-goods>.info>p{
    font-size: 1.263rem;
    color: #f02b2b;
    font-weight: bold;
    /*margin-top: .5rem;*/
  }
  .store-goods>.info>span{
    white-space: nowrap;
    overflow: hidden;
    display: inline-block;
    width: 19rem;
    text-overflow: ellipsis;
  }
  .store-goods>.info>h3{
    /*white-space: normal;*/
    font-size: 1.2rem;
    font-weight: 400;
    overflow: hidden;
  }
  .store-goods>.info{
    width: 68%;
    white-space: normal;
    margin-left: 1rem;
    /*position: relative;*/
  }
  .store-goods>.img>img{
    width:100%;
    height: 100%;
    object-fit: cover;
  }
  .store-goods>.img{
    width:7.75rem ;
    height: 6.86rem;
    overflow: hidden;
    background: url("../../assets/img/sellerStore/goods-img.png") no-repeat center center/100%;
  }
  .store-goods{
    border-bottom: .25rem solid #efefef;
    padding: .7rem 1rem;
    position: relative;
  }
.store-banner>img{
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.store-banner{
  height: 18.778rem;

  background: url("../../assets/img/sellerStore/shopbanner.png") no-repeat center center/100%;
}
  .store-nav{
    padding: .5rem 0;
    font-size: .833rem;
    text-align: center;
  }
  .store-nav>li>span{
    color: #ff0000;
  }
  .store-nav>li{
    color: #008842;
    width: 25%;
    line-height: 2rem;
    border-right: 1px solid #7f7f7f;
  }
  .goods-type>p{
    line-height: 3rem;
    color: #3e3e3e;
    background-color: #efefef;
    padding-left:1rem;
  }

</style>
