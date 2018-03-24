<template>
  <div class="searchList cl">
    <el-header className="go_back" :class="{'hide':hide}">
      <div class="search-head fl" @click="showSearch = true">
        <!--<input v-model="keywords" type="search" autofocus="autofocus" placeholder="搜索商品">-->
        <p>{{keywords}}</p>
        <i>搜索</i>
      </div>
    </el-header>
    <section class="content" :class="{'toTop':hide}" ref="scrollContent">
      <div>
        <div>
          <div class="store-goods cl" v-for="i in searchList" @click="goToGoodsDetail(i)">
            <div class="img fl"><img v-lazy="i.imgs" alt=""></div>
            <div class="info fl">
              <h3>{{i.name}}</h3>
              <span v-if="i.detail">({{i.detail}}）</span>
              <div style="position: absolute;bottom: 0;">
                <i>剩余：{{i.stock}}/份</i>
                <p>￥{{i.presentPrice}}/<span>100g</span></p>
                <s v-if="i.oldPrice">￥{{i.oldPrice}}/<span>100g</span></s>
              </div>
              <!--<div class="recommend"><p></p><span>123m</span></div>-->
              <!--<button>立即购买</button>-->
            </div>
          </div>
        </div>
        <p v-if="searching && type==1" style="text-align: center;line-height: 3rem;font-size: 1.3rem;color: #999;">
          数据加载中...</p>
      </div>
      <!--</div>-->
    </section>
    <mt-popup v-model="showSearch" :modal="false" position="bottom" style="width: 100%;height: 100%">
      <p-search :showSearch="showSearch" v-on:showStatus='showStatus'></p-search>
    </mt-popup>
  </div>
</template>

<script>
  import Header from '@/components/Head'
  import {Popup, Checklist, MessageBox, Toast, Actionsheet, Indicator} from 'mint-ui';
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
        showSearch: false,
        scrollTop: 0, hide: false
      }
    },
    components: {
      'el-header': Header,
      'mt-popup': Popup,
      'p-search': Search
    },
    created(){
        // console.log(window.isGoBack)
      if(window.isGoBack && sessionStorage.getItem('historySearchList')){//如果是返回到这个页面的 并且有历史搜索记录
        let historySearchList = JSON.parse(sessionStorage.getItem('historySearchList'))
        // console.log(historySearchList)
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
      this.$refs.scrollContent.addEventListener('scroll', function (e) {
//         // this.clientHeight:可视区高度  this.scrollTop:滚动高度 this.this.scrollHeight:文档高度
//        // console.log(this.clientHeight);//可视区高度
//        // console.log(this.scrollHeight - this.scrollTop - this.clientHeight); // 到底部的距离
        if (this.scrollHeight - this.scrollTop - this.clientHeight <= 800) {
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
        this.keywords = this.keywords ? this.keywords.trim() : ''; //去除前后空格
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
        this.$http.post(this.API.goods_Search, {//搜索商品
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
      showStatus(data){
        this.showSearch = data.showSearch;
        this.keywords = data.keywords;
        if (data.searching) {
          this.onSearch(this.keywords)
        }
      },
      goToGoodsDetail(item){
        sessionStorage.setItem('goodsInfo', JSON.stringify(item));
        sessionStorage.setItem('goodsActive','goods')
//        this.sessionInfo()
        let historySearchList = {
          list: this.searchList,
          page: this.page,
          key: this.keywords,
          scrollTop: this.$refs.scrollContent.scrollTop
        };
        // console.log(historySearchList)
        sessionStorage.setItem('historySearchList', JSON.stringify(historySearchList))
        this.$router.push({name: 'goodsContainer'})
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .search-type > li.on > p {
    background-color: #008842;
    color: #fff;
  }

  .searchList .content {
    padding-top: 3.611rem;
    transition: .5s;
    -webkit-transition: .5s;
    padding-bottom: 0;
  }

  .content, .header {
    transition: .5s;
    -webkit-transition: .5s;
  }

  .searchList .content {
    transition: .5s;
    -webkit-transition: .5s;
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

  .search-head > input, .search-head > p {
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
    /*border-bottom: 1px solid #efefef;*/
    width: 25rem;
    margin: auto;
    padding-bottom: .5rem;
  }

  .store-goods > .info > div > s > span {
    font-size: .7rem;
  }

  .store-goods > .info > div > s {
    font-size: .9rem;
    color: #848689;
  }

  .store-goods > .info > div > p > span {
    font-size: 1rem;
  }

  .store-goods > .info > div > i {
    color: #008842;
  }

  .store-goods > .info > div > p {
    font-size: 1.263rem;
    color: #f02b2b;
    /*margin-top: .5rem;*/
  }

  .store-goods > .info > span {
    font-size: .833rem;
  }

  .store-goods > .info > h3 {
    white-space: normal;
    font-size: 1.111rem;
    font-weight: 400;
  }

  .store-goods > .info {
    width: 65%;
    white-space: normal;
    margin-left: 1rem;
    position: relative;
    height: 8.778rem;
  }

  .store-goods > .img > img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .store-goods > .img {
    width: 8.778rem;
    height: 8.778rem;
  }

  .store-goods {
    border-bottom: .25rem solid #efefef;
    padding: .7rem 1rem;
  }

  .info > button {
    width: 6.667rem;
    height: 2.333rem;
    background-color: #008842;
    color: #ffffff;
    position: absolute;
    bottom: 0;
    right: 0;
    border-radius: 3px;
  }

  .recommend > span {
    font-size: .833rem;
    color: #008842;
  }

  /*.recommend > p {*/
    /*width: .861rem;*/
    /*margin: auto;*/
    /*height: 1.306rem;*/
    /*background: url("../../assets/img/recommend-secondsKill/gps2.png") no-repeat center center/100%;*/
  /*}*/
</style>
