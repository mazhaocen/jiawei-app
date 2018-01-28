<template>
  <div class="appraise">
    <el-header className="go_back" title="待评价"></el-header>
    <section class="content" style="padding-bottom: 0;background-color: #efefef">
      <div v-for=" item in appraiseList">
        <div class="appraise-order" v-for=" i in item.cartShow.items">
          <h3>{{i.goodsName}} <span>交易成功</span></h3>
          <div class="cl">
            <div class="img fl"><img :src="i.goodsImg" alt=""></div>
            <div class="text fl cl">
              <!--<div class="info fl">原汁原味农家种 吃得放心</div>-->
              <div class="price fr">
                <p>￥{{i.goodsPrice}}/500g</p>
                <span>x{{i.goodsNum}}</span>
              </div>
            </div>
          </div>
          <div class="order-info">
            <!--<p>共1件商品 合计：￥2.30 （含运费￥0.00）</p>-->
          </div>
          <div class="btn">
            <button @click="goToWrite(i,item.id)">评价</button>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
  import Header from '@/components/Head'
export default {
  name: 'appraise',
  data () {
    return {
        title: '',
      appraiseList:[]
    }
  },
  created(){
    this.getOrder()
  },
  components:{
    'el-header':Header
  },
  methods:{
    goToWrite (item,id) {
        sessionStorage.setItem('appraiseOrderId',JSON.stringify(id));
        sessionStorage.setItem('appraise',JSON.stringify(item));
        this.$router.push({name:'writeAppraise'})
    },
    getOrder(){
        this.$http.post(this.API.query_order,{
          currentPage:'1',
          pageSize:'1000',
          status:6
        }).then(res=>{
          this.appraiseList = res.data.data.data
        }).catch(err=>{

        })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .btn>button{
    width: 5.528rem;
    height: 2.5rem;
    font-size: 1.167rem;
    color: #ff0000;
    background-color: #fff;
    border-radius: 3px;
    border:1px solid #ff0000;
  }
  .btn{
    text-align: right;
  }
  .order-info{
    color: #6a6a6a;
    text-align: right;
    padding-bottom: .3rem;
    border-bottom: 1px solid #bcbcbc;
  }
  .price{
    text-align: right;
  }
  .price>p{
    margin-bottom: 1.5rem;
  }
  .img >img{
    width: 100%;
    height:100%;
    object-fit: cover;
  }
  .img {
    width:8.056rem;
    height:5.722rem;
    background-color: #efefef;
  }
  .info{
    padding-left: 1rem;
    width: 12.778rem;
    white-space: normal;
  }
  .text{
    width: 19.889rem;
    color: #6a6a6a;
  }
  .appraise-order>div{
    padding-top: .5rem;
  }
  .appraise-order>h3>span{
    float: right;
    color: #008842;
    font-weight: 400;
    font-size: .833rem;
    line-height: 2rem;
  }
  .appraise-order>h3{
    border-bottom: 1px solid  #bcbcbc;
    font-size: 1.333rem;
  }
  .appraise-order{
    background-color: #fff;
    padding: .5rem 1rem;
    margin-top: .5rem;
  }

</style>
