<template>
  <div class="live">
    <el-header title="直播" class="live-head">
      <a @click="goToLive">开播</a>
    </el-header>
    <section class="content">
      <!--<div class="banner cl">-->
        <!--<swiper :options="swiperOption_live">-->
          <!--<swiper-slider v-for="a,index in 3" :key="index"><img src="../../assets/img/shop/banner.png" alt=""></swiper-slider>-->
          <!--&lt;!&ndash;<swiper-slider class="banner-img" v-for="item in bannerImg"><img :src="item.img" alt=""></swiper-slider>&ndash;&gt;-->
          <!--<div class="swiper-pagination"  slot="pagination"></div>-->
        <!--</swiper>-->
      <!--</div>-->
      <div>
        <div class="live-nva">
          <!--<p class="on">做菜直播</p><p>特产直播</p>-->
          <p>直播列表</p>
        </div>
        <div class="menu-list cl">
          <div class="fl pr" v-for="(i,index) in liveList" :key="index" :style="[index%2?{float:'right'}:'']" @click="lookLive(i)">
            <div class="menu-img pr">
              <!--<span v-if="del" class="pa infoEdit" @click.stop="editInfo(i.id)">编辑</span>-->
              <!--<span v-if="del" class="pa infoDelete" @click.stop="deleteInfo(i,index)">删除</span>-->
              <img v-lazy="i.liveImg">
              <span class="pa" style="right: 0;top: 0;display: block;padding: .5rem 1rem;background-color: rgba(0,0,0,.5);color:#fff;">主播ID：{{i.roomId}}</span>
            </div>
            <h3>{{i.liveTitle}} <span class="fr">{{i.liveUserNumber}}人观看</span></h3>
            <p>{{i.accountName}}</p>
          </div>
          <!--<button @click="editInfo('')" v-if="!myInfoList.length">发布资讯</button>-->
        </div>
      </div>
    </section>
    <el-footer :choose=3></el-footer>
  </div>
</template>

<script>
  import Footer from '@/components/Foot'
  import Header from '@/components/Head'
  import {swiper, swiperSlide} from 'vue-awesome-swiper'
  import {Popup, Checklist, MessageBox, Toast, Actionsheet, Indicator} from 'mint-ui';
export default {
  name: 'live',
  data () {
    return {
      swiperOption_live: {
        autoplay: 3000,
        autoplayDisableOnInteraction : false,
        loop:true,
        pagination : '.swiper-pagination'
      },
      liveList:[]
    }
  },
  components:{
    'el-footer':Footer,
    'el-header': Header,
    'swiper':swiper,
    'swiper-slider':swiperSlide,
  },
  activated(){
//    // console.log(this.$route.meta.height);
    if(this.$route.meta.height){
      document.getElementsByClassName('content')[1].scrollTop = this.$route.meta.height
    }

    window.page='live';
    this.getLiveList()
  },
  beforeRouteLeave(to, from, next){
    this.$route.meta.height=document.getElementsByClassName('content')[0].scrollTop;
    window.page=''
    next()
  },
  created(){
    this.getLiveList()
  },
  destroyed () {
    window.page = ''
  },
  methods:{
    goToLive(){//获取直播推流信息
        this.$http.post(this.API.live_begin).then(res=>{
            // console.log(JSON.stringify(res.data))
          if(res.data.status==0 && res.data.message=="直播前请先进行认证"){
            this.$router.push({name:'applyLive'})
          }else if(res.data.status==1){
            this.liveInfo = res.data.data
            this.pushAuth(res.data.data)
          }
        }).catch(err=>{

        })
    },
    //推流鉴权
    pushAuth(info){
      this.$http.post(this.API.live_auth,{
        timestamp:info.timestamp,
        md5hash:info.md5hash,
        appName:info.appName,
        streamName:info.streamName
      }).then(res=>{
        if(res.data.status==1){
          api.openFrame({
            name: 'liveConfig',
            url: 'widget://html/liveConfig.html',
            rect: {
              x: 0,
              y: 0,
              w: 'auto',
              h: 'auto'
            },
            pageParam:{
              info:info,
              liveId:info.streamName,
              userName:localStorage.getItem('userName')
            }
          })
        }
      })
    },
    lookLive(item){
      //获取直播地址
      this.$http.post(this.API.live_pull_url,{
        appName:item.appName,
        streamName:item.streamName
      }).then(res=>{
        if(res.data.status==1){
          api.openFrame({
            name: 'playConfig',
            url: 'widget://html/playConfig.html',
            rect: {
              x: 0,
              y: 0,
              w: 'auto',
              h: 'auto'
            },
            pageParam:{
              url:res.data.data,
              liveId:item.streamName,
              userName:localStorage.getItem('userName')||'游客',

            }
          })
        }
      })

    },
    //获取直播列表
    getLiveList(){
      this.$http.post(this.API.live_pull_list,{
        liveType:0
      }).then(res=>{
          this.liveList = res.data.data.data
      }).catch(err=>{

      })

    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .live-nva>p.on{
    color: #008842;
  }
  .live-nva>p.on:after{
    content: '';
    display:block;
    position: absolute;
    width: 50%;
    left:25%;
    bottom:.5rem;
    height: .25rem;
    background-color: #008842;
  }
  .live-nva>p{
    padding-left: 1rem;
    position: relative;
    display: inline-block;
    line-height: 4rem;
    font-size: 1.333rem;
    /*width: 50%;*/
    text-align: center;
  }
  .live-nva{
    height: 4rem;
    background-color: #e8e8e8;
  }
  .banner,.banner-img{height:12.389rem;overflow: hidden}
  .banner-img>img{width: 100%;height: 100%;object-fit: cover}
  .live-head>a{
    right:0;
    font-size: 1.2rem;
    color: #008842;
  }
  .menu-list > div > h3>span {
    font-size:.9rem;
    font-weight: normal;
    color: #666;
  }

  .menu-list > div > h3 {
    font-size: 1rem;
    margin-top: .5rem;
    line-height: 1.7rem;

  }

  .menu-list > div {
    padding-bottom: .5rem;
    text-align: left;
  }
  .menu-list {
    text-align: center;
    padding: .5rem;
  }
  .menu-img >img{
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  .menu-img {
    width: 14.056rem;
    height: 8.684rem;
    background-color: #efefef;
    overflow: hidden;
  }
</style>
