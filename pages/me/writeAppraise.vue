<template>
  <div class="writeAppraise">
    <el-header className="go_back" title="评价"></el-header>
    <section class="content" style="padding-bottom: 0;">
      <div class="appraise-order">
        <div class="cl">
          <div class="img fl"><img :src="item.goodsImg" alt=""></div>
          <div class="text fl">
            <div class="info">{{item.goodsName}}</div>
            <div class="star">
              <i v-for="(i,index) in 5" @click="star(index)" :class="{on:starNum>=index}"></i>
            </div>
          </div>
        </div>
        <div class="order-info">
          <textarea cols="30" rows="5" v-model="commentText"></textarea>
        </div>
        <div class="add-img"></div>
        <div class="anonymous" @click="isAnonymous()">匿名评论 <span :class="{on:anonymous}"><img src="../../assets/img/me/dagou.png" alt=""></span></div>
      </div>
      <div class="btn" @click="subComment">提价评论</div>
    </section>
  </div>
</template>

<script>
  import Header from '@/components/Head'
export default {
  name: 'writeAppraise',
  data () {
    return {
        title: '',
      m:1,
      starNum:0,
      anonymous:true,
      item:'',
      commentText:''
    }
  },
  created(){
    this.item = JSON.parse(sessionStorage.getItem('appraise'));
  },
  components:{
    'el-header':Header
  },
  methods:{
    star (i) {
      this.starNum = i
    },
    isAnonymous () {
        this.anonymous = !this.anonymous
    },
    subComment(){
        this.$http.post(this.API.sub_comment,{
          orderId:JSON.parse(sessionStorage.getItem('appraiseOrderId')),
          goodsId:this.item.goodsId,
          comment:this.commentText,
          imgList:[],
          isAnonymous:this.anonymous?1:0,
          rateLevel:''
        }).then(res=>{

        }).catch(err=>{

        })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .anonymous>span.on{
    background-color:#008842;
  }
  .anonymous>span>img{
    width: 80%;
    margin-top: .2rem;
  }
  .anonymous{
    font-size: 1.333rem;
    color: #6a6a6a;
    margin-top: 2rem;
  }
  .anonymous>span{
    margin-left: 1rem;
    text-align: center;
    display: inline-block;
    width: 1.389rem;
    height: 1.389rem;
    background-color:#ccc;
    border-radius: 2px;
  }
  .add-img{
    width:4.167rem;
    height:4.167rem;
    margin-top: 1rem;
    background: url("../../assets/img/me/pingjia.png") no-repeat center center /100%;
  }
  .star>i.on{
    background: url("../../assets/img/me/star.png") no-repeat center center /100%;
  }
  .star>i{
    margin: 1rem 1rem  0 0;
    display: inline-block;
    width:1.444rem;
    height:1.444rem;
    background: url("../../assets/img/goods/star-off.png") no-repeat center center/100%;
  }
  .btn{
    text-align: center;
    width: 100%;
    height: 4rem;
    background-color: #ccc;
    position:absolute;
    bottom:0;
    line-height: 4rem;
    font-size: 1.333rem;
    color: #fff;
  }
  .order-info>textarea{
    width: 100%;
    color: #6a6a6a;
    padding: .5rem;
    border: 1px solid #bcbcbc;
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
    width: 12.778rem;
    white-space: normal;
    font-size: 1.4rem;
  }
  .text{
    padding-left: 1rem;
    width: 19.889rem;
    color: #6a6a6a;
    height: 5.722rem;
  }
  .appraise-order>div{
    padding-top: .5rem;
  }
  .appraise-order{
    background-color: #fff;
    padding: .5rem 1rem;
    margin-top: .5rem;
  }

</style>
