<template>
  <div class="allComment">
    <el-header className="go_back" title="评论"></el-header>
    <section class="content" ref="scrollContent">
      <div class="discuss">
        <p>评论 ({{total}})</p>
        <ul class="discussList">
          <li class="cl" v-for="i in commentList">
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
      </div>
    </section>
  </div>
</template>

<script>
    import { Popup } from 'mint-ui'
    import Header from '@/components/Head'
  import {swiper, swiperSlide} from 'vue-awesome-swiper'
  export default {
    name: 'allComment',
    data () {
      return {
        popupVisible1:false,
        number: '1',
        commentList:[],
        searching: false,
        total: 0,
        page: 0,
        allLoaded:false,
      }
    },
    components: {
      'el-header': Header,
      'swiper': swiper,
      'swiper-slide': swiperSlide,
      'mt-popup':Popup,
    },
    mounted(){
      var that = this;
      /** 滚动预加载*/
      this.$refs.scrollContent.addEventListener('scroll', function (e) {
        // this.clientHeight:可视区高度  this.scrollTop:滚动高度 this.this.scrollHeight:文档高度
//        // console.log(this.clientHeight);//可视区高度
//        // console.log(this.scrollHeight - this.scrollTop - this.clientHeight); // 到底部的距离
        if (this.scrollHeight - this.scrollTop - this.clientHeight <= 300) {
          that.getComment()
        }
      })
    },
    created(){
      this.goodsInfo = JSON.parse(sessionStorage.getItem('goodsInfo'));
      this.getComment()
    },

    methods: {
      getComment(){
        if (this.searching) {
          return
        }
        if (this.total == this.commentList.length && this.total != 0) {
          return
        }
        this.searching = true;
        this.page++;
          this.$http.post(this.API.goods_comment,{
            currentPage:this.page,
            pageSize:10,
            id:this.goodsInfo.id
          }).then(res=>{
            var that = this;
            let result = res.data.data.data
            result.forEach(function (n) {
              that.commentList.push(n)
            });
            this.total = res.data.data.totalRow
            this.searching = false;
          }).catch(err=>{

          })
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


</style>
