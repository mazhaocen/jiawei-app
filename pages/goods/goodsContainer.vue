<template>
  <div class="goodsContainer">
    <header class="header">
      <a @click="this.G.goBack" class="go_back"></a>
      <ul class="cl">
        <li :class="{select:active=='goodsRecommend'}" @click="goTo('goodsRecommend')">特色推荐</li>
        <li :class="{select:active=='goods'}" @click="goTo('goods')">商品</li>
        <li :class="{select:active=='goodsDetail'}" @click="goTo('goodsDetail')">详情</li>
      </ul>
      <a class="more"></a>
    </header>
    <section class="content" ref="scrollGoodsContainer">
      <div v-show="active=='goodsRecommend'" id="goodsRecommend">
        <goods-recommend :goodsKey="goods.keywordList" :active="active" :scrollTopD="scrollTopD"></goods-recommend>
      </div>
      <div id="goods" v-show="active=='goods'">
        <goods v-on:goodsInfo="getGoodsInfo" :active="active"></goods>
      </div>
      <div id="goodsDetail" v-show="active=='goodsDetail'">
        <goods-detail :goodsInfo="goods"></goods-detail>
      </div>
    </section>
    <footer class="footer" style="border-top: 1px solid #efefef">
      <ul class="cl">
        <li @click="show=true">
          <div><img style="width:2.222rem" src="../../assets/img/goods/lianximaijia.png" alt=""></div>
          <p>联系卖家</p></li>
        <li @click="goToSellerStore()">
          <div><img style="width: 1.583rem" src="../../assets/img/goods/dianpu.png" alt=""></div>
          <p>店铺</p></li>
        <li @click="collapse()">
          <div v-if="! goods.hasCollected"><img style="width: 1.444rem" src="../../assets/img/goods/shoucang.png" alt=""></div>
          <div v-if="goods.hasCollected"><img style="width: 1.444rem" src="../../assets/img/cook/xin.png" alt=""></div>
          <p>收藏</p></li>
      </ul>
      <p class="fl" @click="addShopCar()">加入购物篮</p>
    </footer>
    <mt-popup v-model="show" position="bottom" style="width: 100%" class="make-call">
      <p>请确认拨打客服电话：{{goods.shopPhone}}</p>
      <div>
        <button style="background: #ccc" @click="show=false">取消</button>
        <a @click="show=false" :href="goods.shopPhone">确认</a></div>
    </mt-popup>
  </div>
</template>

<script>
  import goods from '@/pages/goods/goods.vue'
  import goodsRecommend from '@/pages/goods/recommendInfo.vue'
  import goodsDetail from '@/pages/goods/goodsDetail.vue'
  import {Swipe, SwipeItem, TabContainer, TabContainerItem, Popup, Indicator, Toast} from 'mint-ui'
  export default {
    name: 'goodsContainer',
    data () {
      return {
        number: '1',
        active: 'goods',
        show: false,
        shopId: '',
        goods: {},
        scrollTopD: 0,
        scrollTop: 0
      }
    },
    components: {
      'mt-swipe': Swipe,
      'mt-swipe-item': SwipeItem,
      'mt-popup': Popup,
      'goods': goods,
      'goods-recommend': goodsRecommend,
      'goods-detail': goodsDetail
    },
    created(){
      if (sessionStorage.getItem('goodsInfo')) {
          // console.log(JSON.parse(sessionStorage.getItem('goodsInfo')))
        this.goods = JSON.parse(sessionStorage.getItem('goodsInfo'))
      }
      var name,that = this;
      setTimeout(function () {
        if (sessionStorage.getItem('goodsActive')) {
          name = sessionStorage.getItem('goodsActive');
        }
        that.active = name ? name : 'goods';
      })
    },
    mounted(){

      let that = this;
      /** 滚动预加载*/
      this.$refs.scrollGoodsContainer.addEventListener('scroll', function (e) {
//        // console.log(this.clientHeight);//可视区高度
//        // console.log(this.scrollTop); // 滚动高度
//        // console.log(this.scrollHeight); // 文档高度
//      // console.log(this.scrollHeight - this.scrollTop - this.clientHeight); // 到底部的距离
        that.scrollTopD = {
            scrollHeight:this.scrollHeight,
          scrollTop:this.scrollTop,
          clientHeight:this.clientHeight}//将离底部的高度传递到 recommend 子组件中
      })
      if(sessionStorage.getItem('goodsAllInfo')){
        let goodsAllInfo = JSON.parse(sessionStorage.getItem('goodsAllInfo'))
        // console.log(goodsAllInfo.scrollTop)
        let that = this
        setTimeout(function () {
          that.$refs.scrollGoodsContainer.scrollTop = goodsAllInfo.scrollTop
        },100);
        if(this.active=='goodsRecommend'){
          sessionStorage.removeItem('goodsAllInfo')
        }
      }
    },
    watch: {
      'active'(newV, oldV){
        if (newV == 'goodsRecommend') {
          let that = this
          setTimeout(function () {
            that.$refs.scrollGoodsContainer.scrollTop = that.scrollTop
          }, 0)
        } else if (oldV == 'goodsRecommend') {
          this.scrollTop = this.$refs.scrollGoodsContainer.scrollTop
        }
      }
    },
    methods: {
      goTo: function (name) {//显示页面
        this.active = name
      },
      getGoodsInfo(i){//获取商品详情
        // console.log(i)
        this.goods = i.goods;
        this.shopId = i.goods.shopId
        this.number = i.num
      },
      collapse(){//收藏 、取消收藏
        if(!this.goods.hasCollected){
          this.$http.post(this.API.addCollect,{
            menuId:5,
            collectId:this.goods.id
          }).then(res=>{
              if(res.data.status==1){
                  this.goods.hasCollected=true
              }
          })
        }else{
          this.$http.post(this.API.cancelCollect,{
            menuId:5,
            collectId:this.goods.id
          }).then(res=>{
            if(res.data.status==1){
              this.goods.hasCollected=false
            }
          })
        }

      },
      goToSellerStore(){//前往商品所在店铺
        sessionStorage.setItem('goodsInfo',JSON.stringify(this.goods));
        sessionStorage.setItem('goodsActive',this.active);
        if (sessionStorage.getItem('shopId')) {
          if (sessionStorage.getItem('shopId') == this.shopId) {
            this.G.goBack()
            return
          }
        }
        sessionStorage.setItem('shopId', this.shopId)
        this.$router.push({name: 'sellerStore', params: {shopId: this.shopId}})
      },
      addShopCar(){//添加购物车
        Indicator.open()
        let goods = this.goods
        let params = {
          goodsId: goods.id,
          goodsName: goods.name,
          goodsNum: 1,
          goodsPrice: goods.presentPrice,
          goodsImg: goods.imgList[0]
        };
        this.$http.post(this.API.shop_cart_add, params).then(res => {
          // console.log(res.data)
          if(res.data.status==1){
            Toast({message: '加入成功！'});
          }
          Indicator.close()
        }).catch(err => {
          // console.log(err)
          Indicator.close()
        })
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

  .make-call > p {
    line-height: 10rem;
    font-size: 1.333rem;
  }
  .make-call {
    text-align: center;
  }
  .make-call > div > a {
    background: #008842;
  }
  .make-call > div > button, .make-call > div > a {
    display: block;
    float: left;
    width: 50%;
    text-align: center;
    color: #fff;
    line-height: 3.5rem;
    font-size: 1.333rem;
  }
  .footer > p {
    float: left;
    width: 37.963%;
    text-align: center;
    color: #fff;
    background-color: #008842;
  }
  .footer ul > li > p {
    text-align: center;

  }

  .footer ul > li > div > img {
    margin-top: .5rem;
  }

  .footer ul > li > div {
    height: 2.4rem;
  }

  .footer ul > li {
    width: 33.333%;
    color: #008842;
    font-size: .833rem;
    text-align: center;
    line-height: 1rem;
  }

  .footer {
    background-color: #ffffff;
  }

  .footer ul {
    float: left;
    padding: 0 1rem;
    width: 62.037%
  }

  .more {
    background: url(../../assets/img/shop/more.png) no-repeat center center/1.439rem;
    right: 0;
  }

  .header > ul > li.select {
    font-size: 1.333rem;
    color: #008842;
    border-bottom: 2px solid #008842;
  }

  .header > ul > li {
    width: 33.333%;
    text-align: center;
    font-size: 1.167rem;
    color: #c4c4c4;
  }

  .header > ul {
    width: 16.111rem;
    margin: auto;
  }

</style>
