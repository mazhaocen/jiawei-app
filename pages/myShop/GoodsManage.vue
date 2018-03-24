<template>
  <div class="goods-manage">
    <el-header title='宝贝管理' className="go_back"></el-header>
    <section class="content" style="background-color: #efefef;padding-bottom: 0;">
      <ul class="goods-type cl">
        <li :class="{active:goodsStatus===''}" @click="goodsListChange('')">全部宝贝 <span v-if="goodsStatus===''">({{total}})</span></li>
        <li :class="{active:goodsStatus===1}" @click="goodsListChange(1)">出售中<span v-if="goodsStatus===1">({{total}})</span></li>
        <li :class="{active:goodsStatus===0}" @click="goodsListChange(0)">仓库中<span v-if="goodsStatus===0">({{total}})</span></li>
      </ul>
      <ul class="goods-manage_list cl">
        <li v-for="(item,index) in items" >
          <div class="goods-info cl">
            <div class="fl goods-info_img"><img :src="item.imgs" alt=""></div>
            <div class="fl goods-info_text">
              <h3>{{item.name}}</h3>
              <span>￥{{toDecimal2(item.presentPrice)}} <i>/500g</i></span>
              <p><span> 已售:0份</span><span>库存：{{item.stock}}份</span></p>
            </div>
          </div>
          <ul>
            <li @click="goToEditGoods(item)">编辑宝贝</li>
            <li v-if="!item.status" @click="goodsOnShow(item,index)" >上架</li>
            <li v-if="item.status" @click="goodsOffShow(item,index)" >下架</li>
            <li @click="share(item.title)">分享</li>
            <li @click="goodsDelete(item,index)">删除</li>
          </ul>
        </li>
      </ul>
      <div class="my-shop-btn">
        <!--<button>新的产品</button>-->
        <button @click="goToAddGoods">发布宝贝</button>
      </div>
    </section>
  </div>
</template>

<script>
  import Header from '@/components/Head'
  import { MessageBox, Indicator ,Toast} from 'mint-ui';
export default {
  name: 'GoodsManage',
  data () {
    return {
      goodsStatus:'',
      items:[],
      total:0
    }
  },
  components:{
    'el-header':Header
  },
  created(){
      let shop = sessionStorage.getItem('goodsData'+this.goodsStatus);
      this.shopInfo = JSON.parse(localStorage.getItem('shopInfo'))
    this.getMyAllGoods()
  },
  methods:{
    getMyAllGoods(status){//查询我的商品列表
      Indicator.open()
      this.$http.post(this.API.my_shop_goods_list,{
        currentPage:1,
        pageSize:20,
        shopId:this.shopInfo.id,
        status:status
      }).then(res=>{
        // console.log(res.data.data.data)
        this.items = res.data.data.data
        this.total = res.data.data.totalRow
        Indicator.close()
      }).catch(err=>{
        Indicator.close()
        // console.log(err)
      })
    },
    goodsOnShow(m,index){//商品上架
      Indicator.open()
      this.$http.post(this.API.my_shop_goods_on,{
        id:m.id,
      }).then(res=>{
          if(res.data.status==1){
            if(this.goodsStatus==''){
              m.status=1
            }else{
              this.items.splice(index,1)
            }
          }
        Indicator.close()
      }).catch(err=>{
        // console.log(err)
        Indicator.close()
      })
    },
    goodsOffShow(m,index){//商品下架
      Indicator.open()
      this.$http.post(this.API.my_shop_goods_off,{
        id:m.id,
      }).then(res=>{
        if(res.data.status==1){
          if(this.goodsStatus==''){
            m.status=0
          }else{
            this.items.splice(index,1)
          }
        }
        Indicator.close()
      }).catch(err=>{
        Indicator.close()
        // console.log(err)
      })
    },
    goodsDelete(m,index){//商品删除
      Indicator.open()
      this.$http.post(this.API.my_shop_goods_del,{
        id:m.id,
      }).then(res=>{
        if(res.data.status==1){
          this.items.splice(index,1)
        }
        Indicator.close()
      }).catch(err=>{
        // console.log(err);
        Indicator.close()
      })
    },
    goToAddGoods () {
      this.$router.push({name:'AddGoods'})
    },
    // 选择列表类型 全部 上架 仓库选择
    goodsListChange(status){
      this.goodsStatus= status
        this.getMyAllGoods(status)
    },
    goToEditGoods(item){//编辑商品内容
      this.$router.push({name:'AddGoods',params:{goodsId:item.id}})
    },
    toDecimal2 (x) { // 保留两位小数
      let f = parseFloat(x);
      if (isNaN(f)) {return 0;}
      f = Math.round(f * 100) / 100;
      let s = f.toString();
      let rs = s.indexOf('.');
      if (rs < 0) {rs = s.length;s += '.';}
      while (s.length <= rs + 2) {s += '0';}
      return s;
    },
    share (title) {
      let sharedModule = api.require('shareAction');
      sharedModule.share({
        text: '味人服务',
        type: 'url',
        path:'http://www.weirenfw.com/weirenService/apk/weirenService.apk'
      });
    }

  }
}
</script>

<style scoped>
  .goods-info{
    padding: .5rem 1rem;
    border-bottom:1px solid #efefef;
  }
  .goods-info_text>p>span{
    margin-right: 2rem;
  }
  .goods-info_text>h3{
    font-size: 1.333rem;
  }
  .goods-info_text>span>i{
    font-size: .8333rem;
    font-style: normal;
  }
  .goods-info_text>span{
    color: #fd6357;
    font-size: 1.333rem;
  }
  .goods-manage_list>li{
    width: 100%;
    margin-bottom: .3rem;
    background-color: #ffffff;
  }
  .goods-manage_list>li>ul>li{
    width: 25%;
    text-align: center;
    line-height: 2rem;
    color: #008842;
  }
  .goods-manage_list{
  }
  .goods-info_img{
    width:8.25rem;
    height:5.444rem;
    margin-right: 1rem;
    background: url(../../assets/img/myShop/goodManage.png) no-repeat center center/100%;
  }
  .goods-type>li:last-child{
    border:none;
  }
  .goods-type{
    margin: .2rem 0;
    padding:.5rem 0;
    background-color: #ffffff;
  }
  .goods-type>li.active{
    color: #008842;
  }
  .goods-type>li{
    width: 33.333%;
    text-align: center;
    border-right: 1px solid #008842;
    line-height: 2rem;
    color: #585858;
  }
</style>
