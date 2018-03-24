<template>

  <div class="cooker">
    <header class="header">
      <div class="fl issue" @click="chooseIssueList">发布</div>
      <div class="cooker-search fl" @click="showSearch = true">
        <p>搜索菜谱、资讯</p>
        <i></i>
      </div>
      <!--<div @click="popupVisible = true" class="pa choose">筛选</div>-->
    </header>
    <section class="content" ref="scrollContent">
      <mt-loadmore :top-method="reSearch" :bottom-all-loaded="allLoaded"  ref="loadmore">
        <div class="cook">
          <swiper :options="cookSwiperOption">
            <swiper-slider v-for="(item,index) in cookerList" :key="index" class="cook-swiper">
              <div class="info cl" @click="goToCook(item)">
                <div class="img fl"><img v-lazy="item.img" alt=""></div>
                <div class="fl" style="width: 13.6rem">
                  <p>厨师：{{item.username}}</p>
                  <p>星级： <i></i></p>
                  <p>地址：{{item.livingPlace}}</p>
                </div>
              </div>
              <div class="cook-menu cl">
                <div v-for="cb,index in item.cookbooks" class="ba-img fl" :style="[index==1?{float:'right'}:'']">
                  <img v-lazy="cb.coverImg" alt="">
                  <!--<div class="cook-live">正在烹飪</div>-->
                  <div class="pa" style="background-color: rgba(0,0,0,0.5);bottom: 0;text-align: center;color:#fff;width: 100%">{{cb.name}}</div>
                </div>
                <!--<div class="ba-img fr">-->
                  <!--<img src="" alt="">-->
                  <!--<div class="cook-live">正在烹飪</div>-->
                <!--</div>-->
              </div>
            </swiper-slider>
            <div class="swiper-pagination" slot="pagination"></div>
          </swiper>
        </div>
        <!--<div style="height: .5rem;background-color: #efefef"></div>-->
        <p style="line-height: 3rem;padding-left: 1rem;background-color: #efefef;font-size: 1.2rem">菜谱、资讯</p>
        <div class="cook-recommend-list cl" v-for="list in queryList" :key="list.code" @click="goToDetail(list.code,list.mixid)">
          <div class="recommend-img fl">
            <img v-lazy="list.img" alt="">
          </div>
          <div>
            <div class="recommend-info">
              <h3>{{list.name}}</h3>
              <p>{{list.brief}}</p>
            </div>
            <div class="cl user">
              <i class="fl eye">{{list.countBrowse}}</i>
              <i class="fl time">{{list.operatetime.split(' ')[0]}}</i>
              <span class="fr">{{list.operator}}</span>
            </div>
          </div>
        </div>
      </mt-loadmore>
    </section>
    <el-footer :choose=2></el-footer>
    <mt-popup v-model="popupVisible" position="right" style="width: 60%;height: 100%">
      <ul class="cl selectList">
        <li @click="selected($event)" class="on">菜谱</li>
        <li @click="selected($event)">咨询、专题</li>
        <li @click="selected($event)">厨师</li>
      </ul>
      <p @click="popupVisible=false" class="selectBtn">确定</p>
    </mt-popup>
    <mt-popup v-model="issueList" :modal="false" position="bottom" style="width: 100%;height: 100%">
      <i class="issue-close" @click="issueList = false"></i>
      <div class="issue-div issue-head"><img v-lazy="headImg" alt=""></div>
      <div class="issue-div issue-create" @click="goToCreateMenu()"></div>
      <div class="issue-div issue-up" @click="goToUpInfo()"></div>
      <div></div>
    </mt-popup>
    <mt-popup v-model="showSearch" :modal="false" position="bottom" style="width: 100%;height: 100%">
      <p-search :showSearch="showSearch" v-on:showStatus='showStatus'></p-search>
    </mt-popup>
  </div>
</template>

<script>
  import Footer from '@/components/Foot'
  import {Popup, Checklist, MessageBox, Toast, Actionsheet, Indicator, Loadmore} from 'mint-ui';
  import {swiper, swiperSlide} from 'vue-awesome-swiper'
  import Search from '@/pages/search/search'
  export default {
    name: 'character',
    data () {
      return {
        popupVisible: false,
        issueList: false,
        showSearch: false,
        cookSwiperOption: {
          autoplayDisableOnInteraction: false,
          pagination: '.swiper-pagination'
        },
        keywords: '',
        queryList: [],
        searching: false,
        total: 0,
        page: 0,
        allLoaded:false,
        cookerList:[]
      }
    },
    components: {
      'el-footer': Footer,
      'mt-popup': Popup,
      'swiper': swiper,
      'swiper-slider': swiperSlide,
      'p-search': Search,
      'mt-loadmore': Loadmore
    },
    activated(){
      document.getElementsByClassName('content')[1].scrollTop = this.$route.meta.height
      window.page = 'character'
    },
    created(){
        if(localStorage.getItem('userInfo')){
          this.headImg = JSON.parse(localStorage.getItem('userInfo')).img
        }
      Indicator.open()
      this.queryData()
      this.queryCooker()
    },
    destroyed () {
      window.page = ''
    },
    mounted(){
      var that = this;
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
    beforeRouteLeave(to, from, next){
      this.$route.meta.height = document.getElementsByClassName('content')[0].scrollTop;
      window.page=''
      next()
    },
    methods: {
      chooseIssueList(){//点击发布 弹出 选择
        if (localStorage.getItem('userInfo')) {
          this.issueList = true
        } else {
          this.$router.push({name: 'Login'})
        }

      },
      reSearch() {
        //...// 加载更多数据
        this.page=0
        this.queryList=[]
        this.queryData()
        this.allLoaded = true
      },
      queryCooker(){//加载推荐的大厨
        this.$http.post(this.API.recommend_cooker,{}).then(res=>{
            this.cookerList = res.data.data.data
            // console.log(res.data)
        }).catch(err=>{
            // console.log(err)
        })
      },
      goToCook(m) {//前往推荐厨师页面
        sessionStorage.setItem('cookInfo',JSON.stringify(m))
        sessionStorage.setItem('cookerId',JSON.stringify(m.accountId))
        this.$router.push({name: 'cook'})
      },
      goToDetail(code, id){
        if (code == '1') {
          this.$router.push({name: 'informationDetail', params: {id: id,type:code}})
        } else if (code == '2') {
          this.$router.push({name: 'cookMenuDetail', params: {id: id,type:code}})
        }
      },
      goToCreateMenu(){
        this.issueList = false;
        this.$router.push({name: 'createMenu'});
      },
      goToUpInfo(){
        this.issueList = false;
        this.$router.push({name: 'upInformation'});
      },
      selected(e) {
        if (e.target.hasAttribute('class', 'on')) {
          e.target.removeAttribute('class', 'on')
        } else {
          e.target.setAttribute('class', 'on')
        }
      },
      showStatus(data){
        this.showSearch = data.showSearch;
        if(data.searching){
          this.$router.push({name:'searchList',params:{keyword:data.keywords}});
        }
      },
      queryData(){
        if (this.searching) {
          return
        }
        if (this.total == this.queryList.length && this.total != 0) {
          return
        }
        this.searching = true;
        this.page++;
        let page = {currentPage: this.page, pageSize: 10};
        this.$http.post(this.API.noun_selectAll, page).then(res => {
//          // console.log(res)
          var that = this;
          Indicator.close()
          let result = res.data.data.data
          this.total = res.data.data.totalRow
          result.forEach(function (n) {
            that.queryList.push(n)
          });
          this.cookSwiperOption = {
            autoplayDisableOnInteraction: false,
            pagination: '.swiper-pagination'
          }
          this.$refs.loadmore.onTopLoaded();
          this.searching = false;
        }).catch(err => {
          // console.log(err)
        })
      },

    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .issue-div {
    position: absolute;
    left: 0;
    right: 0;
    margin: auto;
  }

  .issue-head {
    width: 6.167rem;
    height: 6.167rem;
    border-radius: 50%;
    overflow: hidden;
    background-color: #efefef;
    top: 10rem;
  }

  .issue-create, .issue-up {
    width: 19.639rem;
    height: 6.611rem;
  }

  .issue-create {
    top: 25rem;
    background: url("../../assets/img/cook/chuanjian.png") no-repeat center/cover;
  }

  .issue-up {
    top: 35rem;
    background: url("../../assets/img/cook/zixun.png") no-repeat center/cover;
  }

  .cook-swiper {
    width: 100%;
    margin: auto;
    padding-bottom: 1rem;
  }

  .issue-close {
    position: absolute;
    display: block;
    width: 2rem;
    height: 2rem;
    right: 2rem;
    top: 2rem;
    background: url("../../assets/img/pay/close.png") no-repeat center center/100%;
  }

  .selectBtn {
    position: absolute;
    bottom: 0;
    line-height: 4rem;
    color: #fff;
    background-color: #008842;
    width: 100%;
    text-align: center;
    font-size: 1.333rem;
  }

  .selectList > li.on {
    color: #008842;
    border: 1px solid #008842;
  }

  .selectList {
    padding-top: 1.5rem;
  }

  .selectList > li {
    float: none;
    width: 80%;
    background-color: #f0f2f5;
    margin: 1.5rem auto 0;
    height: 2.5rem;
    text-align: center;
    font-size: 1.333rem;
    line-height: 2.5rem;
  }

  .issue {
    background: url("../../assets/img/cook/fabu.png") no-repeat 1rem .7rem/1.917rem;
    padding-left: 3.3rem;
    color: #008842;
  }

  .cooker-search > i {
    display: block;
    position: absolute;
    top: 0;
    bottom: 0;
    margin: auto;
    right: 2rem;
    width: 1.556rem;
    height: 1.333rem;
    background: url("../../assets/img/shop/fadajin.png") no-repeat center center/99%;
  }

  .cooker-search {
    position: relative;
    line-height: 2.111;
    padding: .8rem 1.411rem;
  }

  .cooker-search > p {
    border: 1px solid #008842;
    height: 2.083rem;
    width: 17.5rem;
    padding: 0 2rem 0 1rem;
  }

  .recommend-img > img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .recommend-img {
    width: 10.556rem;
    height: 6.889rem;
    background-color: #efefef;
    margin-right: 1rem;
    overflow: hidden;
  }

  .cook-live {
    color: #fff;
    top: 0;
    left: 0;
    line-height: 5rem;
    position: absolute;
    text-align: center;
    width: 10.333rem;
    height: 6.111rem;
    background: url("../../assets/img/cookRecommend/live.png") no-repeat center 3.8rem/2.25rem;
  }

  .cook {
    /*border-top: .3rem solid #efefef;*/
    padding: 1rem;
  }

  .cook-menu {
    width: 23rem;
    margin: auto;
    padding-top: .3rem;
  }

  .ba-img >img{
    width:100%;
    height:100%;
    object-fit: cover;
  }
  .ba-img {
    position: relative;
    width: 10.333rem;
    height: 6.111rem;
    overflow: hidden;
  }

  .info > div > p {
    font-size: 1.111rem;
    white-space: normal;
  }

  .info > div > p > i {
    display: inline-block;
    width: .972rem;
    height: .972rem;
    background: url("../../assets/img/me/star.png") no-repeat center center /.972rem;
  }

  .info {
    border-bottom: 1px solid #efefef;
    width: 25rem;
    margin: auto;
    padding-bottom: .5rem;
  }

  .recommend-info > h3 {
    white-space: normal;
  }

  .recommend-info > p {
    white-space: normal;
  }

  .recommend-info {
    height: 6.889rem;
  }

  .img {
    width: 5.111rem;
    height: 5.111rem;
    border-radius: 50%;
    overflow: hidden;
    background-color: #efefef;
    margin: 0 2rem;
  }

  .user > i.eye {
    background: url("../../assets/img/cookRecommend/eye.png") no-repeat left center/.978rem;
    margin-right: 2rem;
    width: 3rem;
  }

  .user > i.time {
    background: url("../../assets/img/cookRecommend/time.png") no-repeat left center /.878rem;
  }

  .user {
    line-height: 2.4rem;
  }

  .user > i {
    color: #808080;
    font-size: .833rem;
    padding-left: 1.5rem;
  }

  .cook-recommend-list {
    padding: .5rem 1rem;
    border-bottom: 1px solid #efefef;
  }

  .choose:before {
    content: '';
    display: block;
    position: absolute;
    width: 4rem;
    height: 1px;
    background-color: #008842;
    bottom: .5rem;
    left: -0.5rem;
  }

  .choose:after {
    content: '';
    display: block;
    border: 5px solid transparent;
    border-top-color: #008842;
    position: absolute;
    top: 1.5rem;
    right: -1.2rem;
  }

  .choose {
    top: 0;
    right: 2rem;
  }

  .swiper-container-horizontal > .swiper-pagination-bullets, .swiper-pagination-custom, .swiper-pagination-fraction {
    bottom: -2px
  }
</style>
