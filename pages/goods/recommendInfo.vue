<template>
  <div class="cookRecommend">

    <!--<section class="">-->
    <div style="height: .5rem;background-color: #efefef"></div>
    <div class="cook-recommend-list cl" v-for="i in listData">
      <div class="img fl">
        <img v-lazy="i.img" alt="">
      </div>
      <div @click="goToCookMenuDetail(i)">
        <div class="info">
          <h3 v-if="i.title">{{i.title}}</h3>
          <h3 v-if="i.name">{{i.name}}</h3>
          <p></p>
        </div>
        <div class="cl user">
          <i class="fl eye">{{i.countBrowse}}</i>
          <i class="fl time" v-if="i.operatetime">{{i.operatetime}}</i>
          <i class="fl time" v-if="i.createTime">{{i.createTime}}</i>
          <span class="fr" v-if="i.operator">{{i.operator}}</span>
          <span class="fr" v-if="i.creater">{{i.creater}}</span>
        </div>
      </div>
    </div>
    <p v-if="searching" style="text-align: center;line-height: 3rem;font-size: 1.3rem;color: #999;">数据加载中...</p>
    <p v-if="this.total===0 && !searching" style="text-align: center;line-height: 3rem;font-size: 1.3rem;color: #999;">暂无数据！</p>
  </div>
</template>

<script>
  import {Popup, Checklist, MessageBox, Toast, Actionsheet, Indicator} from 'mint-ui';
  export default {
    name: 'cookRecommend',
    data () {
      return {
        popupVisible: false,
        modal: false,
        options: [],
        value: [],
        page: 0,
        listData: [],
        searching: false,
        total: 0
      }
    },
    created(){
      if(sessionStorage.getItem('goodsAllInfo')){
        let goodsAllInfo = JSON.parse(sessionStorage.getItem('goodsAllInfo'))
        this.active=goodsAllInfo.active;
          this.goodsKey=goodsAllInfo.goodsKey;
          this.page=goodsAllInfo.page;
          this.listData=goodsAllInfo.listData;
          this.total=goodsAllInfo.total

      }
      if (this.active == 'goodsRecommend' && this.page == 0) {
        this.goodsKey = JSON.parse(sessionStorage.getItem('keywordList'))
        this. getListData()
      }
    },
    methods: {
      choose: function () {
        this.popupVisible = false
      },
      goToCookMenuDetail(item){//查看推荐详情
        let goodsAllInfo = {
          active: this.active,
          scrollTop: this.scrollTopD.scrollTop,
          goodsKey: this.goodsKey,
          page: this.page,
          listData: this.listData,
          total:this.total
        };
        sessionStorage.setItem('goodsAllInfo', JSON.stringify(goodsAllInfo))
        sessionStorage.setItem('goodsActive',this.active);
        if(item.code==2){
            this.$router.push({name: 'cookMenuDetail', params: {id: item.mixid}})
        }else{
            this.$router.push({name: 'informationDetail', params: {id: item.mixid}})
        }
      },
       getListData(){//获取推荐列表数据
        if (this.searching) {
          return
        }
        if (this.total == this.listData.length && this.total != 0) {
          return
        }
        this.searching = true;
        this.page++;
        this.$http.post(this.API.searchByKeyWordList, {
          nameList: this.goodsKey,
          currentPage: this.page,
          pageSize: 10
        }).then(res => {
          let result = res.data.data.data;
          let that = this;
          this.total = res.data.data.totalRow;
          result.forEach(function (n) {
            that.listData.push(n)
          });
          this.searching = false
          Indicator.close()
        }).catch(err => {
          Indicator.close()
          console.log(err)
        })
      },
    },
    props: ['goodsKey', 'active', 'scrollTopD'],
    components: {
      'mt-popup': Popup,
    },
    mounted () {

    },
    watch: {
      'active'(newV, oldV){
        if (newV == 'goodsRecommend' && this.page == 0) {
          this. getListData()
        }
      },
      'scrollTopD'(newV, oldV){
        if ((newV.scrollHeight - newV.scrollTop - newV.clientHeight) < 500 && this.active == 'goodsRecommend') {
          this. getListData()
        }
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .img > img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  .img {
    width: 10.556rem;
    height: 6.889rem;
    background-color: #eee;
    margin-right: 1rem;
    overflow: hidden;
  }
  .info > h3 {
    white-space: normal;
  }
  .info > p {
    white-space: normal;
  }
  .info {
    height: 6.889rem;
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
    border-bottom: 1px solid #efefef;
    padding: .5rem 1rem;
  }
</style>
