<template>
  <div class="goods-evaluation">
    <section class="content">
      <ul class="evaluation-type cl">
        <li :class="{select:type=='all'}" @click="chooseEvaluation('all')"><p>全部评价</p><span>533</span></li>
        <li :class="{select:type=='good'}" @click="chooseEvaluation('good')"><p>好评</p><span>513</span></li>
        <li :class="{select:type=='ordinary'}" @click="chooseEvaluation('ordinary')"><p>中评</p><span>14</span></li>
        <li :class="{select:type=='bad'}" @click="chooseEvaluation('bad')"><p>差评</p><span>6</span></li>
      </ul>
      <div class="evaluation-list" v-for="i in 3">
          <div class="user-info">
            <div class="user-head"><img src="" alt=""></div> <span>mzw1116</span> <i>2017-1-23</i>
          </div>
          <div class="evaluation-detail">
            <div class="star cl"><i v-for="i in 5"></i></div>
            <div class="evaluation-text">
              <p style="white-space: normal;">送货快。虽然价格不便宜但是我迟到了农村地里直接摘的西红柿的味道，我 开心。这是给我儿女买的，每天辅食就是靠这西红柿。</p>
              <ul class="evaluation-img cl">
                <li v-for="i in 4"><div><img src="" alt=""></div></li>
              </ul>
              <p>产品名称</p>
              <p>购买日期：2017-3-21</p>
            </div>
          </div>
      </div>
    </section>
  </div>
</template>

<script>
export default {
  name: 'goods-evaluation',
  data () {
    return {
        type:'all'
    }
  },
  components:{

  },
  created(){

  },
  methods:{
    chooseEvaluation:function (type) {
        this.type = type
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .evaluation-list{
    border-bottom: .5rem solid #efefef;
  }
  .evaluation-img>li>div{
    width: 5.667rem;
    height: 5.667rem;
    background-color: #efefef;
    /*margin: auto;*/
  }
  .evaluation-img{
    margin: .5rem 0;
  }
  .evaluation-img>li{
    width: 25%;
  }
  .evaluation-text{
    font-size: .833rem;
  }
  .star{
    padding:0 0 0.4rem 0
  }
  .star>i{
    float: left;
    display: block;
    width:0.862rem;
    height:0.862rem;
    margin-right: .3rem;
    background: url("../../assets/img/goods/star-off.png") no-repeat center center/100%;
  }
  .user-head{
    width: 2.111rem;
    height: 2.111rem;
    background-color: #b9b9b9;
    border-radius: 2px;
    float: left;
    margin-right: .5rem;
  }
  .user-info>i{
    float: right;
  }
  .user-info{
    color: #a3a3a3;
    padding: 1rem;
    line-height: 2.111rem;
    font-size: .833rem;
    border-bottom: 1px solid #efefef;
  }
  .evaluation-detail{
    white-space: normal;
    padding: 1rem;
  }
  .evaluation-type{
    padding: 1rem;
    border-bottom:1rem solid #efefef;
  }
  .evaluation-type>li.select{
    color: #fe371e;
  }
  .evaluation-type>li{
    width: 25%;
    text-align: center;
    font-size: .833rem;
  }
</style>
