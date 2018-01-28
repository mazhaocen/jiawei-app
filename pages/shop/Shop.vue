<template>
    <div class="shop">
      <header class="header box pd-1">
        <div class="shop-gps fl"><p>{{address}}</p></div>
        <div class="search pd-1 fl">
          <input type="text" readonly placeholder="搜索商品" @click="search()">
        </div>
        <div class="scan fl hd-h" @click="scanner()"></div>
        <div class="more fr hd-h"></div>
      </header>
      <section class="content">
        <mt-loadmore :top-method="reSearch" :bottom-all-loaded="allLoaded"  ref="loadmore">
          <div class="banner cl">
            <swiper :options="swiperOption">
              <swiper-slider class="banner-img" v-for="item in bannerImg" :key="item.img"><img v-lazy="item.img" alt="" @click.stop="goToGoods(item)"></swiper-slider>
              <div class="swiper-pagination"  slot="pagination"></div>
            </swiper>
          </div>
          <div style="padding-top: .6rem;background-color: #efefef;border-bottom: .5rem solid #efefef;" @click="goToFarmer()">
            <img src="../../assets/img/shop/shopfl.png" alt="">
          </div>
          <div class="seckill">
            <header class="pd-1">
              <img src="../../assets/img/shop/seckill.png" alt="">
            </header>
            <swiper :options="TJSwiperOption">
              <swiper-slider  v-for="s,index in nearbyList" :key="index">
                <div class="seckill_list" @click="goToNearby()">
                  <img v-lazy="s.imgs" alt="">
                  <p>¥{{s.presentPrice}}</p>
                  <del>¥{{s.oldPrice}}</del>
                </div>
              </swiper-slider>
            </swiper>
          </div>
          <div class="recommend">
            <div class="first_recommend" @click="goToGoods(recommendList[0])">
              <img v-lazy="recommendList[0].imgs" alt="">
              <p @click.stop="goToGoodsRecommend(recommendList[0])"><img src="../../assets/img/shop/recommend-btn1.png" alt=""></p>
            </div>
            <ul data-width="470" data-height="270" class="recommend_list">
              <li v-for="(a,index) in recommendList" :key="a.id" @click="goToGoods(a)" v-if="index!=0">
                <div class="recommend_img"><img v-lazy="a.imgs" alt=""></div><div class="recommend_msg">
                <!--<h4>{{index % 2==0?'今日推荐':'下单即送'}}</h4>-->
                <strong>{{a.name}}</strong>
                <p>{{a.detail}}</p>
                <h3><span>￥</span>{{a.presentPrice}}<span>/500g</span></h3>
                <!--<i class="car"></i>-->
                <i class="recommend_btn" @click.stop="goToGoodsRecommend(a)"></i>
              </div>
              </li>
            </ul>
          </div>
        </mt-loadmore>
      </section>
      <mt-popup v-model="showSearch" :modal="false" position="bottom" style="width: 100%;height: 100%">
        <p-search :showSearch="showSearch" v-on:showStatus='showStatus'></p-search>
      </mt-popup>
      <el-footer :choose=1></el-footer>
    </div>
</template>

<script>
  import Footer from '@/components/Foot'
  import {Popup, Checklist, MessageBox, Toast, Actionsheet, Indicator, Loadmore} from 'mint-ui';
  import {swiper, swiperSlide} from 'vue-awesome-swiper'
  import Search from '@/pages/search/search'
  export default {
    name: 'shop',
    data () {
      return {
        address: '',
        bannerImg: [],
        recommendList: [],
        swiperOption: {
          autoplay: 4000,
          autoplayDisableOnInteraction: false,
//          loop:true,
          pagination: '.swiper-pagination'
        },
        TJSwiperOption: {
          slidesPerView: 'auto',//'auto',
          freeMode: true
        },
        showSearch: false,
        allLoaded:false,
        searchShow:false,
        nearbyList:[]
      }
    },
    components: {
      'el-footer': Footer,
      'swiper': swiper,
      'swiper-slider': swiperSlide,
      'mt-popup': Popup,
      'p-search': Search,
      'mt-loadmore': Loadmore
    },
    activated(){
      if (document.getElementsByClassName('content')[1]) {
        document.getElementsByClassName('content')[1].scrollTop = this.$route.meta.height
      }
      window.page = 'shop'
    },
    beforeRouteLeave(to, from, next){
      this.$route.meta.height = document.getElementsByClassName('content')[0].scrollTop;
      window.page = ''
      next()
    },

    created(){
      Indicator.open()
      this.getBannerData()
      this.getRecommendData()
      this.getNearbyGoods()
    },
    destroyed () {
      window.page = ''
    },
    mounted(){
      setTimeout(() => {
        this.getLocation()
      }, 2000)
    },
    methods: {
      //获取坐标和位置信息
      getLocation (){
        var num = 0;
        var that = this;
        var bMap = api.require('bMap');
        console.log(JSON.stringify(api.systemType));
        bMap.getLocationServices((ret, err) => {
          if (ret.enable) {
            console.log(JSON.stringify(ret));
            if (api.systemType == 'ios') {
              bMap.initMapSDK((ret, err) => {
                console.log(JSON.stringify(ret))
                if (ret.status) {
                  console.log('ios 初始化地图成功')
                  getLoca()
                }
              });
            } else {
              getLoca()
            }
          } else {
            alert("未开启定位功能！");
          }
        });
        /** 获取坐标*/
        function getLoca() {
          bMap.getLocation({
            accuracy: '100m',
            autoStop: true,
            filter: 1
          }, function (ret, err) {
            console.log(JSON.stringify(ret))
            if (ret.status) {
              console.log('获取坐标成功')
              getNameFromCoord(ret.lon, ret.lat)
            } else {
              console.log(JSON.stringify(err))
              // that.gpserr = '错误 code'+err.code+'/错误信息'+err.msg
            }
          });
        }

        /** 通过坐标获取位置信息*/
        function getNameFromCoord(lon, lat) {
          bMap.getNameFromCoords({
            lon: lon,
            lat: lat,
          }, function (ret, err) {
            console.log(JSON.stringify(ret))
            if (!ret.status) {
              num++;
              if (num > 10) {
                console.log(JSON.stringify(err));
                return
              }
              getNameFromCoord(lon, lat);
            } else {
              var addComp = ret;
//              address = addComp.province + ", " + addComp.city + ", " + addComp.district + "," + addComp.streetName + "," + addComp.streetNumber;
              if (addComp.streetName && addComp.streetNumber) {
                that.address = addComp.streetName + addComp.streetNumber;
              }
              if (addComp.district && addComp.streetName && !addComp.streetNumber) {
                that.address = addComp.district + addComp.streetName;
              }
              if (addComp.city && addComp.district && !addComp.streetName) {
                that.address = addComp.city + addComp.district
              }
              if (addComp.province && addComp.city && !addComp.district) {
                that.address = addComp.province + addComp.city
              }
              if (addComp.province && addComp.city && addComp.district && !addComp.streetName && !addComp.streetNumber) {
                that.address = addComp.province + addComp.city + addComp.district
              }
            }
          });
        }
      },
      //打开扫描二维码
      scanner(){
        let FNScanner = api.require('FNScanner');
        let that = this
        FNScanner.openScanner({
          autorotation: false
        }, function(ret, err) {
          if (ret) {
//            alert(JSON.stringify(ret));
            console.log(JSON.stringify(ret))
            if (ret.eventType == 'success') {
              console.log(JSON.stringify(ret.content))
              sessionStorage.setItem('scanMessage',JSON.stringify(ret.content));
              that.$router.push({name:'scanInfo'})
            }
          } else {
            alert(JSON.stringify(err));
          }
        });
      },
      getNearbyGoods(){
          this.$http.post(this.API.nearbyGoods,{}).then(res=>{
              console.log(res.data)
            this.nearbyList = res.data.data.data
          }).catch(err=>{

          })
      },
      //下拉刷新  获取地址和获取数据
      reSearch() {
        Indicator.open()
        this.getBannerData()
        this.getRecommendData()
        this.getNearbyGoods()
        this.allLoaded = true
      },
      //获取 banner 数据
      getBannerData(){
        this.$http.post(this.API.indexBanner, {}).then(res => {
          this.bannerImg = res.data.data.data
          console.log(res)
          Indicator.close()
          this.$refs.loadmore.onTopLoaded();
        }).catch(err => {

        })
      },
      //获取 推荐商品列表数据
      getRecommendData(){
        this.$http.post(this.API.goods_recommend_list, {}).then(res => {
          this.recommendList = res.data.data.data
//          console.log('推荐商品', res.data.data)
          Indicator.close()
          this.$refs.loadmore.onTopLoaded();
        }).catch(err => {
          console.log(err)
          Indicator.close()

        })
      },
      //前往农家自产商品列表
      goToFarmer() {
        this.$router.push({name: 'farmerGoods'})
      },
      //前往附近商铺 商品列表
      goToNearby() {
        this.$router.push({name: 'nearbyGoods'})
      },
      //点击商品查看商品详情
      goToGoods(item){
        sessionStorage.setItem('goodsInfo', JSON.stringify(item))
        sessionStorage.setItem('goodsActive', 'goods')
        this.$router.push({name: 'goodsContainer'})
      },
      //点击商品推荐 查看商品推荐列表
      goToGoodsRecommend(g){
        sessionStorage.setItem('goodsInfo',JSON.stringify(g))
        sessionStorage.setItem('goodsActive','goodsRecommend')
        this.$router.push({name: 'goodsContainer'})
      },
      //搜索弹框
      search(){
        this.showSearch = true;
      },
      //搜索跳转
      showStatus(data){
        this.showSearch = data.showSearch;
        if (data.searching) {
          this.$router.push({name: 'searchGoodsList', params: {keyword: data.keywords}});
        }
      },
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .recommend_msg{
    width: 14rem;
  }
  .swiper-slide{width: auto;}
  .recommend_img{width:13.056rem;margin-right:1rem;background: url("../../assets/img/shop/tuijian2.png") no-repeat center center;background-size: 100%;
  overflow: hidden}
  .recommend_img>img{  width:100%;  height:100%;object-fit: cover}
  .recommend_msg>h3>span{font-size: 1rem;font-weight: 400;}
  .recommend_msg>h3{font-size:2.222rem ;color: #fd6357;
    position: absolute;
    bottom:.5rem;}
  .recommend_msg>p{color: #6a6a6a;  font-size: .889rem;  white-space: normal;  height: 2.5rem;  overflow: hidden;}
  .recommend_msg>strong{font-size: 1.333rem;}
  .recommend_list>li .recommend_btn,.recommend_list>li .car{display: block;position: absolute;}
  .recommend_list>li .recommend_btn{width:8rem;height:2.222rem;right:0;bottom:0;
    background: url(../../assets/img/shop/recommend-btn2.png) no-repeat center center/100%;  }
  .recommend_list>li .car{width: 3rem;height: 3rem;top:0;right:0;
    background: url(../../assets/img/shop/car.png) no-repeat center center/1.667rem ;}
  .recommend_msg>h4{background-color: #e95d39;color: #fff;font-size: .889rem;width:4.74rem;text-align: center;
    -webkit-border-radius:2px;-moz-border-radius:2px;border-radius:2px;font-weight: 100;}
  .recommend_list>li>div{height:7.5rem;float: left;}
  .recommend_list>li{position: relative;border-bottom: .417rem solid #efefef;padding:.972rem 0 .972rem .972rem;width: 100%;}
  .first_recommend>p{position: absolute;bottom:-.2rem;right:0;padding:0;margin: 0;width:9.722rem;}
  .first_recommend{position: relative;
    height:12.389rem;
    overflow: hidden;}
  .first_recommend>img{
    width:100%;
    height:100%;
  object-fit: cover}
  .seckill_list>p{color: red;}
  .seckill_list>del{color: #bbb;font-size: .833rem;}
  .seckill_list>img{width:7.778rem;height: 7.778rem;object-fit: cover}
  .seckill_list::-webkit-scrollbar{display: none;}
  .seckill_list{padding: 0 .5rem .5rem .5rem;overflow-scrolling: touch;width: 8.778rem}
  .seckill_list{text-align: center;}
  .seckill>header{height:2.639rem;vertical-align: middle;display: table-cell;}
  .seckill>header>strong{font-size: 1.111rem;margin-left: .5rem;}
  .seckill>header>span{color: #595959;margin-left: .5rem;}
  .seckill>header>img{width:10.556rem;vertical-align: middle;}
  .type_modular2{-webkit-overflow-scrolling: touch;overflow: auto;border-bottom: .667rem solid #e3e3e3;border-top: .667rem solid #e3e3e3;}
  .type_modular2::-webkit-scrollbar{display: none;}
  .type_modular2>li>img{width: 3.667rem;}
  .type_modular2>li>p{margin-top: .2rem;}
  .type_modular2>li{text-align: center;width:20%;float: left;overflow: auto;margin: 1rem auto;}
  .choose_type>p.on>span{color: #fff;}
  .choose_type>p>span{font-size: .833rem;color: #bbb;}
  .choose_type>p.on{color: #fff;background-color: #008842;}
  .choose_type>p{width:44.94%;height:2.945rem;line-height:2.945rem;border:1px solid #008842;display: inline-block;text-align: center;margin: 0 .628rem;}
  .type_modular>p{background-color: #efefef;color: #313131;line-height:2.25rem;}
  .banner,.banner-img{height:14.389rem;overflow: hidden}
  .banner-img>img{width: 100%;height: 100%;object-fit: cover}
  .shop-gps > p {overflow: hidden;width: 5.944rem;height: 3.611rem}
  .shop-gps {padding-left: 1.333rem;background: url(../../assets/img/shop/gps.png) no-repeat left center/1rem;line-height: 3.611rem;font-size: .833rem;}
  .search {line-height: 3.611;}
  .search > input {border: 1px solid #008842;height: 2.083rem;width: 12.5rem;padding: 0 2rem 0 1rem;  }
  .hd-h{  height: 3.611rem;  }
  .scan{
    background: url(../../assets/img/shop/saomiao.png) no-repeat center center/2.111rem;
    width:2.111rem;
    margin:0 1rem 0 .5rem;
  }
  .more{
    background: url(../../assets/img/shop/more.png) no-repeat center center/1.439rem;
    width:1.639rem;
  }
</style>
