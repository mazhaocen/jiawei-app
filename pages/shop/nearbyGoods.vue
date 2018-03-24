<template>
    <div class="nearbyGoods">
      <header class="header">
        <a @click="this.G.goBack" class="go_back"></a>
        <p @click="changeAddShow = true">{{address}}</p>
        <div @click="popupVisible = true" class="pa choose" >筛选</div>
      </header>
      <section class="content" style="padding-bottom: 0" ref="scrollContent">
        <div class="goods-type cl">
          <!--<div class="shop-gps fl"><p >客户和客户看见好看哈哈好看见好看还款 客户计划{{address}}</p></div>-->
          <p>抢购中，先下先得</p>
        </div>
        <mt-loadmore :top-method="reSearch" :bottom-all-loaded="allLoaded"  ref="loadmore" style="min-height: 90%">
          <div class="store-goods cl" v-for="i in onlineList" @click="goToGoodsDetail(i.goods[0])">
            <div class="img fl"><img v-if="i.goods[0]" v-lazy="i.goods[0].imgs" alt=""></div>
            <div class="info fl">
              <h3>{{i.goods[0].name}}</h3>
              <span v-if="i.goods[0].detail">{{i.goods[0].detail}}</span>
              <div style="position: absolute;bottom: 0;">
                <i>剩余：{{i.goods[0].stock}}kg</i>
                <p>￥{{i.goods[0].presentPrice}}/<span>500g</span></p>
                <s>￥{{i.goods[0].oldPrice}}/<span>500g</span></s>
              </div>
              <div class="recommend"><p></p><span>{{parseFloat(i.routeValue/1000).toFixed(2)}}km</span></div>
              <button>烹饪推荐</button>
            </div>
          </div>
          <p v-if="searching" style="text-align: center;line-height: 3rem;font-size: 1.3rem;color: #999;">数据加载中...</p>
          <p v-if="this.total===0 && !searching" style="text-align: center;line-height: 3rem;font-size: 1.3rem;color: #999;">暂无数据！</p>
        </mt-loadmore>
      </section>
      <mt-popup v-model="popupVisible" position="top" class="type-list">
        <!--<mt-checklist title="筛选选项" v-model="value" :options="goodsType"></mt-checklist>-->
        <p>商品类别：</p>
        <ul class="goodsType">
          <li v-for="item in goodsType" :class="{'on':types==item.name}" @click="chooseGoodsType(item.name)">{{item.name}}</li>
        </ul>
        <!--<button class="choose-btn" @click="choose()">筛选</button>-->
      </mt-popup>
      <mt-popup v-model="changeAddShow" position="bottom" :modal='false' class="changeAddress">
        <el-header title="切换地址">
          <a class="go_back" @click="changeAddShow = false"></a>
        </el-header>
        <div class="changeContent content pr">
          <div class="addressSearch">
            <input type="text" placeholder="请输入地址" v-model="searchKeyword">
          </div>
          <p class="localAddress" @click="getlocalAddress()">点击定位当前地址</p>
          <ul class="cl pa">
            <li v-for="item in resultsList" @click="sureAddress(item)">
              <span>{{item.name}}</span>
              <p>{{item.address}}</p>
            </li>
          </ul>
        </div>
      </mt-popup>
    </div>
</template>

<script>
  import Header from '@/components/Head'
  import {Popup, Checklist, MessageBox,Toast,Actionsheet,Indicator,Loadmore} from 'mint-ui';
export default {
  name: 'nearbyGoods',
  data () {
    return {
      changeAddShow:false,
      popupVisible: false,
      goodsType :[],
      value:[],
      searchKey:[],
      onlineList:[],
      allLoaded:false,
      searching:false,
      page:0,
      total:0,
      types:'全部',
      searchKeyword:'',
      resultsList:[],
      address:''
//      resultsList:[{"uid":"925c550ff54b54b15a3ac82c","poiType":0,"phone":"","lon":114.06597124912336,"address":"坂田街道岗头村","name":"新围仔村","lat":22.665594688289307,"city":"深圳市"},{"uid":"fa7da3e893c2e66242d63ec6","poiType":0,"phone":"","lon":114.1453275578486,"address":"深圳市","name":"新围仔","lat":22.66972997161292,"city":"深圳市"},{"uid":"22e114075a3330b4d5b74ec7","poiType":0,"phone":"","lon":114.08128735806342,"address":"广东省深圳市龙岗区坂田街道新河街","name":"新围仔","lat":22.627687611563818,"city":"深圳市"},{"uid":"4cd0beebd9a5925bb4265578","poiType":0,"phone":"","lon":113.93395627142061,"address":"深圳市宝安区应人石路","name":"新围仔","lat":22.658524395733153,"city":"深圳市"},{"uid":"680fb70389df2c9f8bb9882e","poiType":0,"phone":"","lon":114.06779480930801,"address":"广东省深圳市龙华区","name":"新围仔","lat":22.70855879584445,"city":"深圳市"},{"uid":"19ad4762f2618fdde8e582ff","poiType":0,"phone":"","lon":114.08219464662821,"address":"新河二巷8号附近","name":"新围仔村","lat":22.627629233510337,"city":"深圳市"},{"uid":"063e13f08d5edec622f01731","poiType":0,"phone":"","lon":114.06576463885614,"address":"广东省深圳市龙岗区坂田街道岗头村","name":"岗头新围仔","lat":22.66540292814078,"city":"深圳市"},{"uid":"8830a4e20e2d7d70c27da2b4","poiType":0,"phone":"","lon":113.9818808703621,"address":"华宁路与德政路交叉口西南100米","name":"大浪新围仔","lat":22.69949028566692,"city":"深圳市"},{"uid":"e82eb54d571c8e652cb17e25","poiType":0,"phone":"","lon":114.14608213447673,"address":"布吉新区平湖佳惠百货商场西南(工作路北)","name":"新围仔办公楼","lat":22.669646600210736,"city":"深圳市"},{"uid":"cd49238581b29abb2eb96d56","poiType":0,"phone":"","lon":114.08550041090383,"address":"深圳市龙岗区环城路","name":"新围仔工业园","lat":22.62544420833023,"city":"深圳市"},{"uid":"38a7d4bf65e0cecb2b201a4c","poiType":0,"phone":"","lon":114.08218566357311,"address":"广东省深圳市龙岗区坂田街道新围仔新河一巷11号","name":"新围仔便利店","lat":22.627120509411387,"city":"深圳市"},{"uid":"dde821add0751bf243afe64f","poiType":0,"phone":"","lon":113.93602237409287,"address":"广东省深圳市宝安区羊台山森林公园附近","name":"新围仔村00430栋","lat":22.657874043714823,"city":"深圳市"},{"uid":"12bb675639904cf160685869","poiType":0,"phone":"","lon":113.93388440697983,"address":"新围仔村357栋","name":"新围仔村00357栋","lat":22.659308149151737,"city":"深圳市"},{"uid":"c04b1278363af16f94031982","poiType":0,"phone":"","lon":114.1453275578486,"address":"广东省深圳市龙岗区布吉新区平湖佳惠百货商场西南(工作路北)","name":"新围仔住宅区","lat":22.66972997161292,"city":"深圳市"},{"uid":"045927c512f103b076e5b614","poiType":0,"phone":"","lon":114.14642349057041,"address":"广东省深圳市龙岗区新木路65-4号","name":"新围仔老围","lat":22.66959657734482,"city":"深圳市"},{"uid":"726281afc23a27e4c4f02557","poiType":0,"phone":"","lon":114.14635162612963,"address":"广东省深圳市龙岗区平湖街道新木社区新围仔村57号","name":"新围仔炮楼院","lat":22.669479857252586,"city":"深圳市"},{"uid":"975a1b790ad80dcfd0ff23e9","poiType":0,"phone":"","lon":113.93513305163829,"address":"广东省深圳市宝安区宝安中心区文川路新围仔村00263栋","name":"新围仔村00263栋","lat":22.65775731353542,"city":"深圳市"},{"uid":"491d36da22a11e6cabf0cd07","poiType":0,"phone":"","lon":113.93574389938487,"address":"广东省深圳市宝安区羊台山森林公园附近","name":"新围仔村00444栋","lat":22.658049138795636,"city":"深圳市"},{"uid":"42241f6fdebe42a97369d354","poiType":0,"phone":"","lon":113.93412694946745,"address":"广东省深圳市宝安区羊台山森林公园附近","name":"新围仔村00439栋","lat":22.65730706761706,"city":"深圳市"},{"uid":"75595c29432a278193114c9d","poiType":0,"phone":"","lon":113.93524983135455,"address":"广东省深圳市宝安区新围仔村00436栋(羊台山森林公园附近)","name":"新围仔村00436栋","lat":22.6573404192178,"city":"深圳市"},{"uid":"a54cc1513766e786eedfca42","poiType":0,"phone":"","lon":113.93558220439313,"address":"广东省深圳市宝安区新围仔村00433栋(羊台山森林公园附近)","name":"新围仔村00433栋","lat":22.657515514987214,"city":"深圳市"},{"uid":"4ed524db0993c9748936ee7d","poiType":0,"phone":"","lon":113.93460305138758,"address":"广东省深圳市宝安区","name":"新围仔村00351栋","lat":22.659524931212886,"city":"深圳市"},{"uid":"bb136d622c7ac85e8a36ee97","poiType":0,"phone":"","lon":113.93487254304048,"address":"广东省深圳市宝安区羊台山森林公园深蓝之星幼儿园北","name":"新围仔村00336栋","lat":22.659825090418046,"city":"深圳市"},{"uid":"4a0202397873df05adb22a62","poiType":0,"phone":"","lon":113.93423474612861,"address":"广东省深圳市宝安区羊台山森林公园深蓝之星幼儿园","name":"新围仔村00446栋","lat":22.658390990445064,"city":"深圳市"},{"uid":"8f8b57d502f27667157643cf","poiType":0,"phone":"","lon":113.93465694971816,"address":"广东省深圳市宝安区羊台山森林公园深蓝之星幼儿园附近","name":"新围仔村00316栋","lat":22.65905801557385,"city":"深圳市"},{"uid":"3aa17237f72fcdfedc1e520b","poiType":0,"phone":"","lon":113.935384577181,"address":"广东省深圳市宝安区新围仔村00435栋(羊台山森林公园西)","name":"新围仔村00435栋","lat":22.6574488118636,"city":"深圳市"},{"uid":"7178fbebd704ae396849f300","poiType":0,"phone":"","lon":113.93463898360797,"address":"广东省深圳市宝安区羊台山森林公园深蓝之星幼儿园北","name":"新围仔村00366栋","lat":22.65941654022561,"city":"深圳市"},{"uid":"2cdd9a7fad08c3b5364aae79","poiType":0,"phone":"","lon":113.93440542417545,"address":"新围仔村350栋","name":"新围仔村00350栋","lat":22.657640583255596,"city":"深圳市"},{"uid":"d680f74f25799595f02d8331","poiType":0,"phone":"","lon":113.93524084829946,"address":"广东省深圳市宝安区羊台山森林公园","name":"新围仔村00309栋","lat":22.658524395733153,"city":"深圳市"},{"uid":"54cd7d9be51ba3c143afe615","poiType":0,"phone":"","lon":113.93508813636281,"address":"广东省深圳市宝安区羊台山森林公园深蓝之星幼儿园附近","name":"新围仔村00449栋","lat":22.658824557151778,"city":"深圳市"}]
//      cockData:[{"id":2,"type":2,"shopNo":"wrShop002","shopImg":"","shopName":"李婆婆菜档","shopCode":"http://qr.liantu.com/api.php?&w=300&text=2|李婆婆菜档","shopProvince":"广东","shopCity":"深圳","shopArea":"南山区","shopAddress":"白石洲高新园区","shopLng":113.97542454834189,"shopLat":22.539927236329085,"goods":[{"id":4,"shopId":2,"goodsNo":"WrGoods201712221513374","name":"好喝","keywords":null,"keywordList":["涉黑滴滴滴"],"imgs":"http://119.23.209.222/weirenService/goods/2017/1222/20171222151337280.JPEG","oldPrice":30,"presentPrice":0.1,"stock":10,"detail":"不错不错，，，你自己注意身体不好吧亲爱的","status":1}],"routeValue":2259}]
    }
  },
  created(){

    Indicator.open()
    if(!window.goodsType){
      this.getGoodType()
    }else{
      this.goodsType =[{name:'全部',id:0}].concat(window.goodsType)
    }
    this.getLocation()
  },

  mounted(){
    let that = this;
    /** 滚动预加载*/
    this.$refs.scrollContent.addEventListener('scroll', function (e) {
      // this.clientHeight:可视区高度  this.scrollTop:滚动高度 this.this.scrollHeight:文档高度
//        // console.log(this.clientHeight);//可视区高度
//        // console.log(this.scrollHeight - this.scrollTop - this.clientHeight); // 到底部的距离
      if (this.scrollHeight - this.scrollTop - this.clientHeight <= 600) {
        that.queryData()
      }
    })
  },
  watch:{
      'searchKeyword'(newV,oldV){
          if(newV!=oldV){
              this.chooseAddress()
          }
      }
  },
  methods:{
    sureAddress(item){
      this.page=0
      this.onlineList=[]
      this.address = item.name;
      this.getLocation(item);
      this.changeAddShow = false
    },
    getlocalAddress(){
      this.page=0
      this.onlineList=[]
      this.getLocation()
      this.changeAddShow = false
    },
    chooseAddress:function () {
      var map = api.require('bMap');
      var that = this;
      map.searchInCity({
        city: '深圳',
        keyword: this.searchKeyword,
        pageCapacity: 30
      }, function (ret, err){
        if (ret.status) {
          that.resultsList = ret.results
//          // console.log(JSON.stringify(that.resultsList))
        } else {
          // console.log(JSON.stringify(err));
        }
      });
    },
    goToCookRecommend(){
        this.$router.push({name:'cookRecommend'})
    },
    goToGoodsDetail(item){//查看商品详情
      sessionStorage.setItem('goodsInfo',JSON.stringify(item));
      sessionStorage.setItem('goodsActive','goods')
      this.sessionInfo()
      this.$router.push({name:'goodsContainer'})
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
    chooseGoodsType(name){//选择商品类型 重新搜索
      this.types = name;
      this.reSearch();
      this.popupVisible = false
    },

    getGoodType(){//获取商品分类 类别
      this.$http.post(this.API.my_shop_goods_type, {}).then(res => {//获取商品分类列表
        // console.log(res.data);
        window.goodsType = res.data.data.data;
        this.goodsType =[{name:'全部',id:0}].concat(window.goodsType)
      }).catch(err => {
        // console.log(err)
      })
    },
    reSearch() {
      //...// 加载更多数据
      this.page=0
      this.onlineList=[]
      Indicator.open()
      this.getLocation()
      this.allLoaded = true
    },
    getLocation (item){//获取坐标和位置信息
      var num = 0;
      var that = this;
      var bMap = api.require('bMap');
      if(item){
        getNameFromCoord(item.lon,item.lat)
      }else{
        bMap.getLocationServices((ret, err) => {
          if (ret.enable) {
            // console.log(JSON.stringify(ret));
            if (api.systemType == 'ios') {
              bMap.initMapSDK((ret, err) => {
                // console.log(JSON.stringify(ret))
                if (ret.status) {
                  // console.log('ios 初始化地图成功')
                  getLoca()
                }
              });
            } else {
              // console.log('获取坐标')
              getLoca()
            }
          } else {
            alert("未开启定位功能！");
          }
        });
      }

      /** 获取坐标*/
      function getLoca() {
        bMap.getLocation({
          accuracy: '100m',
          autoStop: true,
          filter: 1
        }, function (ret, err) {
          // console.log(JSON.stringify(ret))
          if (ret.status) {
            // console.log('获取坐标成功')
            getNameFromCoord(ret.lon, ret.lat)
          } else {
            // console.log(JSON.stringify(err))
            // that.gpserr = '错误 code'+err.code+'/错误信息'+err.msg
          }
        });
      }

      /** 通过坐标获取位置信息*/
      function getNameFromCoord(lon, lat) {
        that.lon = lon
        that.lat = lat
        bMap.getNameFromCoords({
          lon: lon,
          lat: lat,
        }, function (ret, err) {
          // console.log(JSON.stringify(ret))
          if (!ret.status) {
            num++;
            if (num > 10) {
              // console.log(JSON.stringify(err));
              return
            }
            getNameFromCoord(lon, lat);
          } else {
            that.district = ret.district
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
            that.queryData(lon,lat)
          }
        });
      }
    },
    queryData(lon,lat){//分页查询数据
      if (this.searching) {
        this.$refs.loadmore.onTopLoaded();
        return
      }
      if (this.total == this.onlineList.length && this.total != 0) {
        this.$refs.loadmore.onTopLoaded();
        return
      }
      this.searching = true;
      this.page++;
//      let params = {currentPage: this.page, pageSize: 10,shopType:2,types:this.types=='全部'?'':this.types};
      let params = {
        area:this.district,
        lng:lon,
        lat:lat
      };
      this.$http.post(this.API.nearbyShop, params).then(res => {
        // console.log(JSON.stringify(res.data))
        var that = this;
        Indicator.close();
        let result = res.data.data.data
        this.total = res.data.data.totalRow
        result.forEach(function (n) {
          that.onlineList.push(n)
        });
        this.$refs.loadmore.onTopLoaded();
        this.searching = false;
      }).catch(err => {
        // console.log(err)
      })
    },
  },
  components: {
    'mt-loadmore': Loadmore,
    'mt-popup': Popup,
    'el-header': Header
//    'mt-checklist': Checklist,
//    'mt-actionsheet' :Actionsheet,
  },
  mounted () {
//    this.options = ['水果', '蔬菜', '生肉', '海鲜', '禽类', '水产品', '速冻食品', '农副产品','土特产','山货','粮食','茶','其他'];
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .changeContent>ul{
    top:8rem;
    background-color: #fff;
    width: 100%;
    padding: 1rem 1.33rem;
    font-size: 1.1rem;
  }
  .changeContent>ul>li>p{
    color: #777;
    padding-top: .5rem;
    white-space:normal;
  }
  .changeContent>ul>li>span{
    color: #333;
  }
  .changeContent>ul>li{
    border-bottom: 1px solid #efefef;
    float: none;
    width: 100%;
    padding: 0.5rem 0;

  }
  .localAddress{
    text-align: center;
    line-height: 3rem;
    background-color: #fff;
    margin: 1rem auto;
    font-size: 1.2rem;
    color: #666;
    position: absolute;
    top: 9.5rem;
    width: 100%;
  }
  .addressSearch{
    z-index: 99;
    width: 100%;
    position: fixed;
    background-color: #fff;
    height: 4rem;
    padding: .5rem 1.3rem;
  }
  .addressSearch input{
    background-color: #efefef;
    width: 100%;
    height: 3rem;
    padding-left:1rem;
    border-radius: 5px;
  }
  .changeAddress{
    width: 100%;
    background-color: #efefef;
    height: 100%;
  }
  .type-list>p{
    padding:.5rem 1rem;
    /*background-color: #fff;*/
  }
  .goodsType>li.on{
    background-color: #008842;
    color: #fff;
  }
  .goodsType>li{
    background-color: #fff;
    -webkit-border-radius:10rem;
    -moz-border-radius:10rem;
    border-radius:10rem;
    padding: .2rem 1rem;
    margin: 1rem 1rem .5rem;
  }
  .choose:before{
    content: '';
    display: block;
    position: absolute;
    width: 4rem;
    height: 1px;
    background-color: #008842;
    bottom: .5rem;
    left: -0.5rem;
  }
  .choose:after{
    content: '';
    display: block;
    border:5px solid transparent;
    border-top-color:#008842 ;
    position: absolute;
    top: 1.5rem;
    right: -1.2rem;
  }
  .choose{
   top: 0;right:2rem;
  }
  .type-list{
    width: 100%;
    background-color: #efefef;
    height: 40vh;
  }
  .header>p{
    text-align: center;
    color: #008842;
    font-size: 1.333rem;
    width: 17rem;
    overflow: hidden;
    margin: auto;
  }
  .go_back{
    background: url("../../assets/img/head/goBack.png") no-repeat center center /.972rem;
    left:0;
  }
  .goods-type{
    /*padding-left: 1.333rem;*/
    border-bottom: 1px solid #efefef;
  }
  .goods-type>p{
    line-height: 3rem;
    color: #3e3e3e;
    background-color: #efefef;
    padding-left:1rem;
  }
  .info>button{
    width: 6.667rem;
    height: 2.333rem;
    background-color: #008842;
    color: #ffffff;
    position: absolute;
    bottom:0;
    right:0;
    border-radius: 3px;
  }
  .store-goods>.info>div>s>span{
    font-size: .7rem;
  }
  .store-goods>.info>div>s{
    font-size: .9rem;
    color: #848689;
  }
  .store-goods>.info>div>p>span{
    font-size: 1rem;
  }
  .store-goods>.info>div>i{
    color: #008842;
  }
  .store-goods>.info>div>p{
    font-size: 1.263rem;
    font-weight: bold;
    color: #f02b2b;
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
    white-space: normal;
    font-size: 1.2rem;
    font-weight: 400;
  }
  .store-goods>.info{
    width: 65%;
    white-space: normal;
    margin-left: 1rem;
    position: relative;
    height: 8.778rem;
  }
  .store-goods>.img>img{
    width:100%;
    height: 100%;
    object-fit: cover;
  }
  .store-goods>.img{
    width:8.778rem ;
    height: 8.778rem;
  }
  .store-goods{
    border-bottom: .25rem solid #efefef;
    padding: .7rem 1rem;
  }
  .recommend > span {
    font-size: .833rem;
    color: #008842;
  }
  .recommend > p {
  width: .861rem;
  margin: auto;
  height: 1.306rem;
  background: url("../../assets/img/shop/gps2.png") no-repeat center center/100%;
  }
  .recommend {
    position: absolute;
    right: 7.8rem;
    bottom: -0.2rem;
  }
  .shop-gps > p {overflow: hidden;width: 12.944rem;line-height: 3rem;font-size: 1.1rem;
    color: #333;}
  .shop-gps {padding-left: 1.333rem;background: url(../../assets/img/shop/gps.png) no-repeat left center/1rem;line-height: 3rem;font-size: .833rem;}


</style>
