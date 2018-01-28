<template>
  <div class="farmerGoods">
    <header class="header">
      <a @click="this.G.goBack" class="go_back"></a>
      <p>绿色有机</p>
    </header>
    <section class="content" style="padding-bottom: 0" ref="scrollContent">
      <ul class="cl nav">
        <li :class="{on:item.name == types}" v-for="(item,index) in goodsType" @click="chooseType(item)">
          {{item.name}}
        </li>
      </ul>
      <mt-loadmore :top-method="reSearch" :bottom-all-loaded="allLoaded" ref="loadmore"  style="min-height: 90%">
        <div class="store-goods cl" v-for="(i,index) in onlineList" @click.stop="goToGoods(i)">
          <div class="img fl"><img v-lazy="i.imgs" alt=""></div>
          <div class="info fl">
            <h3>{{i.name}}</h3>
            <span v-if="i.detail">{{i.detail}}</span>
            <p>￥{{i.presentPrice}}/<span>500g</span></p>
            <!--<s>￥2.3/<span>100g</span></s>-->
            <!--<div class="recommend" @click.stop="goToGoods2"><span>烹饪推荐</span></div>-->
            <button @click.stop="goToGoods2(i)">烹饪推荐</button>
            <!--<button @click.stop="">立即购买</button>-->
          </div>
          <!--<div class="same-goods cl" v-if=" index ==0 || index==2">-->
          <!--<p class="fl">同类产品</p>-->
          <!--<div class="cl">-->
          <!--<div class="cl" v-for="i in 4">-->
          <!--<div class="logo fl"><img src="" alt=""></div>-->
          <!--<div class="text"><span>沃尔玛生鲜超市</span><p>月销量：2309</p></div>-->
          <!--<p>单价：<span>￥4.5/ <i>500g</i></span></p>-->
          <!--</div>-->
          <!--</div>-->
          <!--</div>-->
        </div>
        <p v-if="searching" style="text-align: center;line-height: 3rem;font-size: 1.3rem;color: #999;">数据加载中...</p>
        <p v-if="this.total===0 && !searching" style="text-align: center;line-height: 3rem;font-size: 1.3rem;color: #999;">暂无数据！</p>
      </mt-loadmore>

    </section>
  </div>
</template>

<script>
  import head from '@/components/Head'
  import {MessageBox, Toast, Actionsheet, Indicator, Loadmore} from 'mint-ui';
  export default {
    name: 'farmerGoods',
    data () {
      return {
        goodsType: [],
        chooseIndex: 0,
        onlineList: [],
        allLoaded: false,
        searching: false,
        page: 0,
        types:'全部',
        total:0,
        topStatus:false
      }
    },
    created(){

      sessionStorage.removeItem('shopId')
      if (!window.goodsType) {
        Indicator.open();
        this.getGoodsType()
      } else {
        this.goodsType = [{name:'全部',id:0}].concat(window.goodsType)
      }
      if(sessionStorage.getItem('shopGoodsList')){
//        let shopGoodsList = JSON.parse(sessionStorage.getItem('shopGoodsList'))
//        this.$refs.scrollContent.scrollTop=shopGoodsList.scrollTop;
//          this.types=shopGoodsList.types;
//          this.onlineList=shopGoodsList.onlineList;
//          this.page=shopGoodsList.page
      }else{
        Indicator.open();
        this.queryData()
      }

    },
    mounted(){
      let that = this;
      /** 滚动预加载*/
      this.$refs.scrollContent.addEventListener('scroll', function (e) {
          // this.clientHeight:可视区高度  this.scrollTop:滚动高度 this.this.scrollHeight:文档高度
//        console.log(this.clientHeight);//可视区高度
//        console.log(this.scrollHeight - this.scrollTop - this.clientHeight); // 到底部的距离
        if (this.scrollHeight - this.scrollTop - this.clientHeight <= 600) {
          that.queryData()
        }
      })
      if(sessionStorage.getItem('shopGoodsList')){
        let shopGoodsList = JSON.parse(sessionStorage.getItem('shopGoodsList'))
        this.$refs.scrollContent.scrollTop=shopGoodsList.scrollTop;
        this.types=shopGoodsList.types;
        this.onlineList=shopGoodsList.onlineList;
        this.page=shopGoodsList.page
        sessionStorage.removeItem('shopGoodsList')
      }else{
//        this.queryData()
      }
    },
    components: {
      'mt-loadmore': Loadmore
    },
    methods: {

      goToCookRecommend(){
        this.$router.push({name: 'cookRecommend'})
      },
      goToGoods2(item){//前往烹饪推荐页面
        this.sessionInfo();
        sessionStorage.setItem('goodsInfo',JSON.stringify(item))
        sessionStorage.setItem('goodsActive','goodsRecommend')
        this.$router.push({name: 'goodsContainer'})
      },
      goToGoods(item){//前往商品详情
        sessionStorage.setItem('goodsInfo', JSON.stringify(item));
        sessionStorage.setItem('goodsActive','goods')
        this.sessionInfo()
        this.$router.push({name: 'goodsContainer'})
      },
      sessionInfo(){//跳转页面存储信息
        let shopGoodsList={
          scrollTop:this.$refs.scrollContent.scrollTop,
          types:this.types,
          onlineList:this.onlineList,
          page:this.page
        };
        sessionStorage.setItem('shopGoodsList',JSON.stringify(shopGoodsList))
      },
      chooseType(item){
        this.types = item.name
        this.reSearch()
      },
      reSearch() {//重新加载商品列表
        //...// 加载更多数据
        this.page = 0;
        this.onlineList = [];
        Indicator.open()
        this.queryData();
        this.allLoaded = true
      },
      getGoodsType(){//获取商品类型
        this.$http.post(this.API.my_shop_goods_type, {}).then(res => {//获取商品分类列表
          window.goodsType = res.data.data.data;
          Indicator.close();
          this.goodsType =[{name:'全部',id:0}].concat(window.goodsType)
        }).catch(err => {
          Indicator.close();
          console.log(err)
        })
      },
      queryData(){//查询商品列表
        if (this.searching) {
          return
        }
        if (this.total == this.onlineList.length && this.total != 0) {
          return
        }
        this.searching = true;
        this.page++;
        let params = {
          currentPage: this.page,
          pageSize: 10,
          shopType: 1,
          types:this.types=='全部'?'':this.types
        };
        this.$http.post(this.API.getGoodsByType, params).then(res => {
          let that = this;
          Indicator.close()
          let result = res.data.data.data;
          this.total = res.data.data.totalRow;
          result.forEach(function (n) {
            that.onlineList.push(n)
          });
          this.$refs.loadmore.onTopLoaded();
          this.searching = false;
          this.topStatus = false
        }).catch(err => {
          console.log(err)
        })
      },
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .same-goods .text > p {
    position: absolute;
    bottom: 0;
    left: 3.144rem;
    color: #b9b9b9;
  }

  .same-goods .text {
    position: relative;
    height: 2.944rem;
    font-size: .667rem;
    line-height: 1.2rem;
  }

  .same-goods > div > div > p > span > i {
    font-size: .8rem;
  }

  .same-goods > div > div > p > span {
    color: #f02b2b;
    font-size: 1rem;
  }

  .same-goods > div > div > p {
    font-size: .8rem;
  }

  .same-goods > div > div {
    display: inline-block;
    width: 32%;
    padding: .3rem;
    background-color: #ffffff;
    margin-right: .5rem;
  }

  .same-goods .logo {
    background-color: #efefef;
    width: 2.944rem;
    height: 2.944rem;
    margin-right: .2rem;
  }

  .same-goods > div {
    overflow: auto;
  }

  .same-goods {
    background-color: #efefef;
    padding: .3rem;
    float: left;
    width: 100%;
    margin-top: .5rem;

  }

  .same-goods > p {
    writing-mode: tb-rl;
    margin-top: .5rem;
    margin-right: .5rem;
  }

  .nav .on {
    color: #008842;
    border-bottom: 1px solid #008842;
  }

  .nav > li {
    padding: 0 .6rem;
    line-height: 2rem;
    margin-right: 1rem;
    float: none;
    display: inline-block;
    white-space: normal;
    font-size: 1.2rem;
  }

  .nav {
    /*white-space: nowrap;*/
    text-overflow: clip;
    overflow: auto;
    padding: 1rem;
    background-color: #efefef;
  }

  .info > button {
    width: 6.667rem;
    height: 2.333rem;
    background-color: #008842;
    color: #ffffff;
    position: absolute;
    bottom: 0;
    right: 0;
    line-height: 2.333rem;
    border-radius: 3px;
  }

  .recommend > span {
    font-size: 1.2rem;
    color: #008842;
  }

  .recommend > p {
    width: 2.028rem;
    margin: auto;
    height: 1.389rem;
    background: url("../../assets/img/sellerStore/penrentuijian.png") no-repeat center center/100%;
  }

  .recommend {
    position: absolute;
    bottom: 0;
    right: 1rem;

  }

  .store-goods > .info > s > span {
    font-size: .7rem;
  }

  .store-goods > .info > s {
    font-size: .9rem;
    color: #848689;
  }

  .store-goods > .info > p > span {
    font-size: 1rem;
    font-weight:bold;
  }

  .store-goods > .info > p {
    font-size: 1.263rem;
    color: #f02b2b;
    /*margin-top: .5rem;*/
  }

  .store-goods > .info > span {
    /*font-size: .833rem;*/
    white-space: nowrap;
    overflow: hidden;
    display: inline-block;
    width: 21rem;
    text-overflow: ellipsis;
  }

  .store-goods > .info > h3 {
    /*white-space: normal;*/
    font-size: 1.2rem;
    font-weight: 400;
    overflow: hidden;
  }

  .store-goods > .info {
    width: 78%;
    white-space: normal;
    margin-left: .6rem;
    position: relative;
    height: 5.139rem;
    background-color: #fff;
  }

  .store-goods > .img >img{
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  .store-goods > .img {
    width: 5.139rem;
    height: 5.139rem;
  }

  .store-goods {
    border-bottom: .25rem solid #efefef;
    padding: .7rem 1rem;
    background-color: #fff;
  }
</style>
