<template>
  <div class="searchList cl">
    <el-header className="go_back" :class="{'hide':hide}">
      <div class="search-head fl" @click="showSearch = true">
        <!--<input v-model="keywords" type="search" autofocus="autofocus" placeholder="搜索商品">-->
        <p >{{keywords}}</p>
        <i>搜索</i>
      </div>
    </el-header>
    <ul class="search-type cl " :class="{'top':hide}">
      <li @click="changeType(2)" :class="{on:type=='2'}"><p>菜谱</p></li>
      <li @click="changeType(1)" :class="{on:type=='1'}"><p>资讯</p></li>
      <li @click="changeType(3)" :class="{on:type=='3'}"><p>大厨</p></li>
    </ul>
    <section class="content" :class="{'toTop':hide}" ref="scrollContent">
      <!--v-infinite-scroll="getSearchData"-->
      <!--infinite-scroll-disabled="searching"-->
      <!--infinite-scroll-distance="50">-->

      <div>
        <div v-if="type==3">
          <div class="cook" v-for="l in searchList" @click="goToCook(l)">
            <div class="info cl" >
              <div class="img fl"><img v-lazy="l.img" alt=""></div>
              <div class="fl" style="width: 13.6rem">
                <p>厨师：{{l.name}}</p>
                <p>星级： <i></i></p>
                <p>地址：{{l.livingPlace}}</p>
              </div>
            </div>
            <!--<div class="cook-menu cl">-->
              <!--<div class="ba-img fl">-->
                <!--<img src="" alt="">-->
                <!--<div class="cook-live">正在烹飪</div>-->
              <!--</div>-->
              <!--<div class="ba-img fr">-->
                <!--<img src="" alt="">-->
                <!--<div class="cook-live">正在烹飪</div>-->
              <!--</div>-->
            <!--</div>-->
          </div>
        </div>
        <div style="height: .5rem;background-color: #efefef"></div>
        <div v-if="type==2">
          <div class="cook-recommend-list cl" v-for="l in searchList" @click="goToMenuDetail(l.id)">
            <div class="recommend-img fl">
              <img v-lazy="l.img" alt="">
            </div>
            <div>
              <div class="recommend-info">
                <h3>{{l.name}}</h3>
                <!--<p>{{l.name}}</p>-->
              </div>
              <div class="cl user">
                <i class="fl eye">{{l.countBrowse}}</i><i class="fl time">{{l.createTime | formatTime}}</i><span class="fr">{{l.creater}}</span>
              </div>
            </div>
          </div>
          <p v-if="searching && type==2" style="text-align: center;line-height: 3rem;font-size: 1.3rem;color: #999;">数据加载中...</p>
        </div>
        <div v-if="type==1">
          <div class="cook-recommend-list cl" v-for="l in searchList" @click="goToMenuDetail(l.id)">
            <div class="recommend-img fl">
              <img v-lazy="l.img" alt="">
            </div>
            <div>
              <div class="recommend-info">
                <h3>{{l.title}}</h3>
                <p>{{l.name}}</p>
              </div>
              <div class="cl user">
                <i class="fl eye">{{l.countBrowse}}</i><i class="fl time">{{l.operatetime | formatTime}}</i><span class="fr">{{l.operator}}</span>
              </div>
            </div>
          </div>
          <p v-if="searching && type==1" style="text-align: center;line-height: 3rem;font-size: 1.3rem;color: #999;">数据加载中...</p>
        </div>
      </div>
    </section>
    <mt-popup v-model="showSearch" :modal="false"  position="bottom" style="width: 100%;height: 100%">
      <p-search :showSearch="showSearch" v-on:showStatus='showStatus' ></p-search>
    </mt-popup>
  </div>
</template>

<script>
  import Header from '@/components/Head'
  import {Popup, Checklist, MessageBox,Toast,Actionsheet,Indicator} from 'mint-ui';
  import Search from '@/pages/search/search'
  export default {
    name: 'searchList',
    data () {
      return {
        type: '2',
        keywords: '',
        searchList: [],
        searching: false,
        page: 0,
        total: 0,
        searchHistory: [],
        showSearch:false,
        scrollTop:0,hide:false
      }
    },
    components:{
      'el-header':Header,
      'mt-popup': Popup,
      'p-search':Search
    },
    filters: {
      formatTime:(time) =>{
        let t = new Date(time);
        let y = t.getFullYear();
        let m = t.getMonth()+1>9?t.getMonth()+1:'0'+(t.getMonth()+1);
        let d = t.getDate()>9?t.getDate():'0'+t.getDate();
        let h = t.getHours()>9?t.getHours():'0'+t.getHours();
        let mm = t.getMinutes()>9?t.getMinutes():'0'+t.getMinutes();
//        let s = t.getSeconds()>9?t.getSeconds():'0'+t.getSeconds();
        let s = ''
        return y+'-'+ m +'-'+d+' '+h+':'+mm
      },
    },
    created(){
//        alert('进入列表')
//      setTimeout(()=>{
//          this.hide = true
//      },1000)
//      setTimeout(()=>{
//        this.hide = false
//      },3000)
      if(window.isGoBack && sessionStorage.getItem('historySearchList') ){//如果是返回到这个页面的 并且有历史搜索记录
        let historySearchList = JSON.parse(sessionStorage.getItem('historySearchList'))
        this.searchList = historySearchList.list
        this.type = historySearchList.type;
        this.page = historySearchList.page;
        this.keywords = historySearchList.key;
        this.scrollTop =historySearchList.scrollTop
        sessionStorage.removeItem('historySearchList')
        window.isGoBack = false
      }else{
        this.keywords =  this.$route.params.keyword;
        this.onSearch(this.keywords)//进入页面第一次搜索
      }
      if (sessionStorage.getItem('searchHistory')) {
        this.searchHistory = JSON.parse(sessionStorage.getItem('searchHistory'))
      }
    },
    mounted(){
      var that = this;
      /** 滚动预加载*/
      this.$refs.scrollContent.scrollTop=this.scrollTop
      this.$refs.scrollContent.addEventListener('scroll', function (e) {
        // this.clientHeight:可视区高度  this.scrollTop:滚动高度 this.this.scrollHeight:文档高度
//        // console.log(this.clientHeight);//可视区高度
//        // console.log(this.scrollHeight - this.scrollTop - this.clientHeight); // 到底部的距离
        if (this.scrollHeight - this.scrollTop - this.clientHeight <= 600) {
          that.getSearchData()
        }
      })

    },
    methods: {
      onSearch(key){
          Indicator.open()
        if (key) {//点击历史搜索词语  赋值搜索关键词
          this.keywords = key
        }
        this.searching = false;
        this.page = 0;
        this.searchList = [];
        this.keywords = this.keywords?this.keywords.trim():''; //去除前后空格
        let that = this
        this.searchHistory.forEach(function (m, i) {
          if (m === that.keywords) {
            that.searchHistory.splice(i, 1)
          }
        });
        if (this.keywords) {
          this.searchHistory.unshift(this.keywords);
          sessionStorage.setItem('searchHistory', JSON.stringify(this.searchHistory));
        }

        this.getSearchData()
      },
      getSearchData(){
        if (this.searching) {
          return
        }
        if (this.total == this.searchList.length && this.total != 0) {
          return
        }
        this.searching = true;
        this.page++;
        this.$http.post(this.API.search, {
          menuId: this.type,
          name: this.keywords,
          currentPage: this.page,
          pageSize: 10
        }).then(res => {
          var result = res.data.data.data;
          var that = this;
          this.total = res.data.data.totalRow
          result.forEach(function (n) {
            that.searchList.push(n)
          });
          this.searching = false
          Indicator.close()
        }).catch(err => {
          Indicator.close()
          // console.log(err)
        })
      },
      changeType(type){//选择类型搜索
        if (type) {
          this.type = type
        }
        this.onSearch(this.keywords)
      },
      showStatus(data){
        this.showSearch = data.showSearch;
        this.keywords = data.keywords;
        if(data.searching){
            this.onSearch(this.keywords)
        }
      },
      goToMenuDetail(id){
        let historySearchList = {
          list: this.searchList,
          type: this.type,
          page: this.page,
          key: this.keywords,
          scrollTop: this.$refs.scrollContent.scrollTop
        };
        sessionStorage.setItem('historySearchList', JSON.stringify(historySearchList))
        if (this.type == 2) {
          this.$router.push({name: 'cookMenuDetail', params: {id: id, type: this.type}})
        } else if (this.type == 1) {
          this.$router.push({name: 'informationDetail', params: {id: id, type: this.type}})
        }
      },
      goToCook(m) {//前往推荐厨师页面
        sessionStorage.setItem('cookInfo',JSON.stringify(m))
        let historySearchList = {
          list: this.searchList,
          type: this.type,
          page: this.page,
          key: this.keywords,
          scrollTop: this.$refs.scrollContent.scrollTop
        };
        sessionStorage.setItem('historySearchList', JSON.stringify(historySearchList))
        this.$router.push({name: 'cook'})
      },
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .search-type > li.on > p {
    background-color: #008842;
    color: #fff;
  }

  .searchList .content{
    padding-top: 7.611rem;
    /*transition:.5s;*/
    /*-webkit-transition:.5s;*/
    padding-bottom: 0;
  }
  .search-type > li > p {
    width: 6.389rem;
    height: 3.056rem;
    margin: auto;
    border: 1px solid #efefef;
    border-radius: 5px;
    color: #666;
    text-align: center;
    font-size: 1.222rem;
    line-height: 3.056rem;
  }

  .search-type > li {
    width: 33.333%;
    text-align: center;
  }

  .search-type {
    padding: .5rem;
    /*border-top: .5rem solid #efefef;*/
    width: 100%;
    background-color: #fff;
    position: fixed;
    top: 3.611rem;
    z-index: 99;
    /*transition:.5s;*/
    /*-webkit-transition:.5s;*/
  }


  .search-head > i {
    display: block;
    position: absolute;
    line-height: 2.083rem;
    right: 1rem;
    bottom: 0;
    margin: auto;
    background-color: #008842;
    color: #fff;
    top: 0.3rem;
    padding: 0 1rem;
    height: 2.083rem;
    border-radius: 3px;
  }

  .search-head {
    /*position: absolute;*/
    /*left: 0;*/
    /*right: 0;*/
    /*margin: auto;*/
  }
  .search-head > input,.search-head > p {
    border: 1px solid #008842;
    height: 2.083rem;
    width: 17.5rem;
    padding: 0 2rem 0 1rem;
    position: absolute;
    left: 5.4rem;
    top: 0.8rem;
    line-height: 2rem;
    font-size: 1rem;
    color: #999;
    text-align: left;
  }

  .hot-search-list {
    padding: 1rem;
  }

  .hot-search-list > li {
    border-radius: 10rem;
    border: 1px solid #efefef;
    text-align: center;
    padding: .2rem 1.5rem;
    margin-right: 1rem;
  }

  .recommend-img>img{
    width: 100%;
    height:100%;
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
    border-top: .3rem solid #efefef;
    padding: 1rem;
  }

  .cook-menu {
    width: 23rem;
    margin: auto;
    padding-top: .3rem;
  }

  .ba-img {
    position: relative;
    width: 10.333rem;
    height: 6.111rem;
    background: url("../../assets/img/me/cookli.png") no-repeat center center/100%;
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
    width: 2.5rem;
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
    line-height: 2.4rem;
  }

  .cook-recommend-list {
    padding: .5rem 1rem;
    border-bottom: 1px solid #efefef;
  }

</style>
