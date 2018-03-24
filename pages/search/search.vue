<template>
  <div class="search cl">
    <el-header>
      <div class="search-head fl">
        <p class="fl" @click="cancel">取消</p>
        <input ref="searchInput" v-model="keywords" type="search"  placeholder="搜索商品">
        <i @click="onSearch('')">搜索</i>
      </div>
    </el-header>
    <section class="content" ref="scrollContent">
      <div>
        <p class="hot-search">最近搜索</p>
        <ul class="hot-search-list cl">
          <li v-for="h in searchHistory" @click="onSearch(h)">{{h}}</li>
        </ul>
      </div>
    </section>
  </div>
</template>

<script>
  import Header from '@/components/Head'
  import {InfiniteScroll} from 'mint-ui';
  export default {
    name: 'search',
    data () {
      return {
        type: '2',
        keywords: '',
        searchList: [],
        searching: false,
        page: 0,
        total: 0,
        searchHistory: []
      }
    },
    props:['showSearch'],
    components: {
      'el-header': Header,
    },
//    props:['searchWord'],
    created(){
//        this.keywords = this.key
      if (sessionStorage.getItem('searchHistory')) {
        this.searchHistory = JSON.parse(sessionStorage.getItem('searchHistory'))
      }
    },
    mounted(){

    },
    watch:{
        'showSearch'(newV,oldV){
            if(newV){
              this.$refs.searchInput.focus()
            }
        }
    },
    methods: {
      onSearch(key){
        if (key) {//点击历史搜索词语  赋值搜索关键词
          this.keywords = key
        }
        this.keywords = this.keywords?this.keywords.trim():''; //去除前后空格
        let that = this
        this.searchHistory.forEach(function (m, i) {//搜索关键词是否在搜索历史中  存在 就删除
          if (m === that.keywords) {
            that.searchHistory.splice(i, 1)
          }
        });
        if (this.keywords) {//如果 搜索关键词 不为空 添加到历史搜索中
          this.searchHistory.unshift(this.keywords);
          sessionStorage.setItem('searchHistory', JSON.stringify(this.searchHistory));
        }
//        this.$router.push({name:'searchList',params:{keyword:this.keywords}});
        // console.log(this.keywords)
        this.$emit('showStatus',{
          showStatus:false,
          keywords:this.keywords,
          searching:true
        })
      },
      cancel(){
        this.$emit('showStatus',{
          showStatus:false,
          keywords:this.keywords,
          searching:false
        })
      },
      inInput(){

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
    border-top: .5rem solid #efefef;
  }

  .hot-search {
    font-size: 1.222rem;
    line-height: 2.305;
    background-color: #efefef;
    padding-left: 1rem;
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
    top: 0.1rem;
    padding: 0 1rem;
    height: 2.083rem;
    border-radius: 3px;
  }

  .search-head {
    position: absolute;
    left: 0;
    right: 0;
    margin: auto;
  }

  .search-head > p {
    width: 5.1rem;
    color: #999;
    font-size: 1.2rem;
  }
  .search-head > input {
    border: 1px solid #008842;
    height: 2.083rem;
    width: 17.5rem;
    padding: 0 2rem 0 1rem;
    position: absolute;
    left: 5.4rem;
    top: 0.8rem;
  }

  .hot-search-list {
    padding: 1rem;
  }

  .hot-search-list > li {
    border-radius: 10rem;
    border: 1px solid #efefef;
    text-align: center;
    padding: 0 1.5rem;
    margin-right: 1rem;
    background-color: #efefef;
    height: 2.2rem;
    line-height: 2.2rem;
    margin-bottom: 1rem;
  }

  .recommend-img {
    width: 10.556rem;
    height: 6.889rem;
    background-color: #b9b9b9;
    margin-right: 1rem;
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

</style>
