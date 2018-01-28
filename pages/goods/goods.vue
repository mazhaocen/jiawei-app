<template>
  <div class="goods">
    <section>
      <div style="height: 25rem">
        <swiper :options="goodsSwiperOption">
          <swiper-slide v-for="n in goods.imgList" :key="n">
            <div class="goods-banner"><img v-lazy="n" alt=""></div>
          </swiper-slide>
        </swiper>
      </div>
      <div class="goods-info">
        <h4>{{goods.name}}</h4>
        <span>{{goods.detail}}</span>
        <h3><span>￥</span>{{goods.presentPrice}}<i>/500g</i></h3>
      </div>
      <div class="goods-section send-type cl" style="border-bottom: .5rem solid #efefef;">
        <span>配送</span>
        <div>指定地点配送上门</div>
        <p>不可退换货</p>
      </div>
      <div style="padding:1rem">
        <div class="about-shop cl">
          <div class="small-logo"><img :src="goods.shopImg" alt=""></div>
          <div style="width:19.1rem;">
            <p>{{goods.shopName}}</p>
            <!--<p style="color: #81838e;">优品生鲜</p>-->
            <ul class="about-goods cl">
              <li><h3>{{goods.countShopCollect}}</h3><span>关注人数</span></li>
              <li><h3>{{goods.countShopGoods}}</h3><span>全部商品</span></li>
              <li><h3>{{goods.countUpdateShopGoods}}</h3><span>店铺动态</span></li>
            </ul>
          </div>
        </div>

      </div>
      <!--<div class="goods_comment">-->
        <!--<p>商品评论</p>-->
        <!--<ul>-->
          <!--<li></li>-->
        <!--</ul>-->
      <!--</div>-->
      <div class="discuss">
        <p>评论 ({{goods.countGoodsComment}})</p>
        <ul class="discussList">
          <li class="cl" v-for="i in goods.commentList">
            <div class="discuss-head"><img v-lazy="i.userImg" alt=""></div>
            <div class="discuss-detail">
              <p class="cl"><i class="fl">{{i.userName}}<span style="display: block"><i></i></span></i><span class="fr">{{i.createTime | formatTime}}</span></p>
              <p class="discuss-text">{{i.comment}}<!--<span class="fr" style="color: #008842;">回复</span>--></p>
              <!--<div class="more-discuss">-->
              <!--<p><span class="user" >鸭子达人</span>回复 <span class="user">鸭子天禧</span>鸭子片皮不是 说一说就可以学会的，这些都是勤加练习的，我也不会，可以的话多指教。</p>-->
              <!--<p><span class="user" >鸭子天禧</span>回复 <span class="user">鸭子达人</span>大家相互学习</p>-->
              <!--</div>-->
            </div>
          </li>
        </ul>
        <span @click="allComment" v-if="goods.countGoodsComment>5">更多</span>
      </div>
    </section>
  </div>
</template>

<script>
    import { Popup } from 'mint-ui'
  import {swiper, swiperSlide} from 'vue-awesome-swiper'
  export default {
    name: 'goods',
    data () {
      return {
        popupVisible1:false,
        number: '1',
        goods: {},
        goodsSwiperOption: {
//        pagination: '.swiper-pagination',
//        loop: true,
        }
      }
    },
    props:['active'],
    components: {
      'swiper': swiper,
      'swiper-slide': swiperSlide,
      'mt-popup':Popup,
    },
    mounted(){

    },
    created(){
      this.goodsInfo = JSON.parse(sessionStorage.getItem('goodsInfo'));
      if (this.goodsInfo && this.active=='goods') {
        this.getGoodsInfo()
      }
    },

    methods: {
      getGoodsInfo(){//获取商品信息
        this.$http.post(this.API.my_shop_goods_show, {
          id: this.goodsInfo.id?this.goodsInfo.id:this.goodsInfo.goodsId
        }).then(res => {
          console.log(res.data)
          this.goods = res.data.data
          this.$emit('goodsInfo',{
              goods:this.goods,
              num:this.number
          })
        }).catch(err => {
          console.log(err)
        })
      },
      goToSellerStore(){//前往商品所在店铺
        console.log(this.goods.shopId)
        this.$router.push({name: 'sellerStore',params:{shopId:this.goods.shopId}})
      },
      allComment(){
          this.$router.push({name:'allComment'})
      }

    },
    filters: {
      formatTime:(time) =>{
        let t = new Date(time);
        let y = t.getFullYear();
        let m = t.getMonth()+1>9?t.getMonth()+1:'0'+(t.getMonth()+1);
        let d = t.getDate()>9?t.getDate():'0'+t.getDate();
        let h = t.getHours()>9?t.getHours():'0'+t.getHours();
        let mm = t.getMinutes()>9?t.getMinutes():'0'+t.getMinutes();
        let s = t.getSeconds()>9?t.getSeconds():'0'+t.getSeconds();
        return y+'-'+ m +'-'+d+' '+h+':'+mm+':'+s
      },
    },
    watch: {
      'active'(newV, oldV){
        if (newV == 'goods') {
          this. getGoodsInfo()
        }
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.goods_comment>p{
  padding: .5rem 1rem;
  background-color: #efefef;
  line-height: 2.4rem;
  font-size: 1.2rem;
}
.goods_comment>ul>li{

}
.goods_comment>ul{

}
.more-discuss .user{color: #008842;}
.more-discuss>p{white-space:normal;}
.more-discuss{margin: .5rem 0 0 0;padding: .5rem;width: 90%;background-color: #f4f4f4;}
.discuss-detail>p>span{color: #a1a1a1;}
.discuss-detail>p>i{color: #008842;}
.discuss-detail{border-bottom: 1px solid #efefef;width: 90%;float: left;padding-left: 1rem;padding-bottom: 1rem}
.discussList>li{float: none;padding-top: .5rem}
.discuss-head{float: left;}
.discuss>p{ margin-bottom: 1.5rem;  font-size: 1.111rem;  padding-left: 2rem;  background: url("../../assets/img/cook/msg.png") no-repeat left center/1.523rem;  }
.discuss{  padding: 1rem ;  }
.discuss-head{width: 2.611rem;height: 2.611rem;border-radius: 50%;background: url("../../assets/img/cook/cook-head.png") no-repeat center/cover;overflow: hidden  }
.discuss-head>img{
  width: 100%;
  height:100%;
  object-fit: cover;
}
.discuss>span{
  text-align: center;
  font-size: 1.2rem;
  color: #008842;
  display: block;
  line-height: 3rem;
}

  .about-goods {

  }

  .about-goods > li > h3 {
    font-size: 1.167rem;
    font-weight: 500;
    margin-top: .7rem;
    margin-bottom: .4rem;

  }
  .about-goods > li > span {
    font-size: .889rem;
    color: #81838e;
  }

  .about-goods > li {
    width: 33.333%;
    text-align: center;
  }

  .about-shop > div > p {
    font-size: 1.2rem;
    text-align: center;
    line-height: 3rem;
  }

  .about-shop > div {
    float: left;
    margin-right: 1rem;
  }

  .small-logo img {
    width: 100%;
    height:100%;
    object-fit: cover;
  }
  .small-logo {
    width: 6.889rem;
    height: 6.886rem;
    /*background: url("../../assets/img/goods/smlogo.png") no-repeat center center/100%;*/
  }

  .send-type > p {
    float: left;
    padding-left: 1.5rem;
    background: url("../../assets/img/goods/gantan.png") no-repeat center left /1.111rem;
    font-size: .8333rem;
    color: #a3a3a3;
    margin-top: .5rem;
  }
  .goods-section {
    border-top: .5rem solid #efefef;
    padding: 1rem;
    white-space: normal;
  }

  .goods-section > div {
    float: left;
    padding-left: 2rem;
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
    width: 83%;
  }

  .goods-section > span {
    color: #7f7f7f;
    float: left;
  }

  .goods-info {
    padding: 1rem 1rem 0 1rem;
  }

  .goods-info > h4 {
    font-size: 1.333rem;
    color: #222222;
  }

  .goods-info > span {
    font-size: .889rem;
    color: #8f8f8f;
  }

  .goods-info > h3 > span {
    font-size: 1rem;
  }

  .goods-info > h3 > i {
    color: #666;
    font-size: 1rem;
    font-weight: normal;
  }

  .goods-info > h3 {
    font-size: 2.222rem;
    color: #fd6357;
    margin-top: .5rem;
  }

  .goods-banner > img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  .goods-banner {
    height: 25rem;
    background-size: 100%;
  }
</style>
