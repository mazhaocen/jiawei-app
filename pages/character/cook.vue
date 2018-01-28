dd<template>
  <div class="cook">
    <el-header className="go_back" title="">
      <a class="pa" style="color: #008842; font-size: 1.333rem;right: .5rem;width: 5rem;" @click="collapse()">{{cookerInfo.hasCollected?'已关注':'关注'}}</a>
    </el-header>
    <section class="content" style="padding-bottom: 0">
      <div class="my-info pr">
        <div class="head-img"><img v-lazy="cookerInfo.img" alt=""></div>
        <p>{{cookerInfo.name}}</p>
        <h3>星级：<i></i></h3>
        <span>地址：{{cookerInfo.livingPlaceProvince}}{{cookerInfo.livingPlaceCity}}{{cookerInfo.livingPlaceArea}}{{cookerInfo.livingPlaceAddress}}</span>
        <!--<i :class="{'already':already}" @click="guanZhu">{{already?'已关注':'关注'}}</i>-->
      </div>
      <ul class="menu-type cl">
        <li @click="goTo('cookMenu')" :class="{on:active=='cookMenu'}">大厨菜谱</li>
        <li @click="goTo('cookInfo')" :class="{on:active=='cookInfo'}">大厨资料</li>
      </ul>
      <mt-tab-container v-model="active" :swipeable="true">
        <!--大厨菜谱-->
        <mt-tab-container-item id="cookMenu">
          <div class="menu-list cl">
            <div class="fl" v-for="(i,index) in menuList" :style="[index%2?{float:'right'}:'']" @click="goToMenuDetail(i.id)">
              <div class="menu-img"><img v-lazy="i.coverImg"></div>
              <h3>{{i.name}}</h3>
              <p>{{i.creater}}</p>
            </div>
          </div>
        </mt-tab-container-item>
        <!--大厨信息-->
        <mt-tab-container-item id="cookInfo">
          <div class="info">
            <p><i>昵称</i> <span>{{cookerInfo.name}}</span></p>
            <!--<p><i>地区</i> <span>粤</span></p>-->
            <p><i>个性签名</i> <span>{{cookerInfo.signature}}</span></p>
            <p style="border-top:1px solid #efefef;padding-top: 1rem"><i>故乡</i> <span>{{cookerInfo.hometownProvince}} {{cookerInfo.hometownCity}}</span></p>
            <p style="border-bottom:1px solid #efefef"><i>现居</i> <span>{{cookerInfo.livingPlaceProvince}} {{cookerInfo.livingPlaceCity}}</span></p>
            <p style="padding-top: 1.2rem"><i>我的经历</i> <span>{{cookerInfo.experience}}</span></p>
          </div>
        </mt-tab-container-item>
      </mt-tab-container>
    </section>
  </div>
</template>

<script>
  import Header from '@/components/Head'
  import {Swipe, SwipeItem, TabContainer, TabContainerItem, Popup, Indicator, Toast} from 'mint-ui'
export default {
  name: 'cook',
  data () {
    return {
        title: '',
      m:1,
      already:'false',
      active:'cookMenu',
      menuList:[],
      cookerInfo:{},
    }
  },
  created(){
    this.cookerId = JSON.parse(sessionStorage.getItem('cookerId'));
    if(sessionStorage.getItem('cookInfo')){
      this.cookerInfo = JSON.parse(sessionStorage.getItem('cookInfo'));
      this.cookerInfo.name=this.cookerInfo.username ||this.cookerInfo.name
    }
    if(this.cookerId){
      this.getCookMenuList()
      this.getCookerInfo()
    }
  },
  mounted(){
    let that = this;
    /** 滚动预加载*/
//    this.$refs.scrollContent.addEventListener('scroll', function (e) {
//      // this.clientHeight:可视区高度  this.scrollTop:滚动高度 this.this.scrollHeight:文档高度
////        console.log(this.clientHeight);//可视区高度
////        console.log(this.scrollHeight - this.scrollTop - this.clientHeight); // 到底部的距离
//      if (this.scrollHeight - this.scrollTop - this.clientHeight <= 600) {
////        that.getCookMenuList()
//      }
//    })
  },
  components:{
    'el-header':Header,
    'mt-tab-container-item':TabContainerItem,
    'mt-tab-container':TabContainer
  },
  methods:{
    goTo(name) {
      this.active = name
    },
    goToMenuDetail(id){
        console.log(id)
      this.$router.push({name:'cookMenuDetail',params:{id:id,type:2}})
    },
    getCookMenuList(){//获取当前厨师的菜谱列表
      this.$http.post(this.API.menu_userOnlineCookbooks,{
        currentPage:1,
        pageSize:1000,
        accountId:this.cookerId
      }).then(res=>{
          this.menuList = res.data.data.data
        console.log(res.data)
      }).catch(err=>{
          console.log(err)
      })
    },
    collapse(){//关注、取消关注
      if(!this.cookerInfo.hasCollected){
        this.$http.post(this.API.addCollect,{
          menuId:3,
          collectId:this.cookerId
        }).then(res=>{
          if(res.data.status==1){
            this.cookerInfo.hasCollected=true
          }
        })
      }else{
        this.$http.post(this.API.cancelCollect,{
          menuId:3,
          collectId:this.cookerId
        }).then(res=>{
          if(res.data.status==1){
            this.cookerInfo.hasCollected=false
          }
        })
      }
    },
    getCookerInfo(){//获取大厨信息
      this.$http.post(this.API.show_chef_info,{
         id:this.cookerId
      }).then(res=>{
        this.cookerInfo = res.data.data
      })
    },
    guanZhu(){
        this.already = !this.already
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .my-info>i.already{
    background-color: #fff;
    color: #008842;
    border:1px solid #008842;
  }
  .my-info>i{
    display: block;
    position: absolute;
    top:6rem;
    left:-4rem;
    width: 4rem;
    line-height: 2rem;
    border-radius: 10rem;
    background-color: #008842;
    color: #fff;
    text-align: center;
  }
  .info{
    padding: 1rem  1.5rem;
  }
  .info>p{
    padding: .5rem 0;
  }
  .info>p>span{
    font-size: 1.333rem;
    color: #000;
    white-space:normal;
    width: 80%;
    display: inline-block;}
  .info>p>i{
    font-size: 1.1rem;
    vertical-align: top;
    color: #bbbbbb;
    width: 5rem;
    display: inline-block;
  }
  .menu-list>div>h3{
    font-size: 1rem;
    margin-top: .5rem;
  }
  .menu-list>div{
    padding-bottom: .5rem;
  }
  .menu-list{
    padding: .5rem;
  }
  .menu-img>img{
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  .menu-img{
    width: 14.056rem;
    height: 8.684rem;
    background-color: #efefef;
    overflow: hidden;
  }
  .menu-type>li.on{
    border-bottom: 3px solid #008842;
    color: #000;
    font-weight: bold;
  }
  .menu-type{
    margin-top: .6rem;
    border-bottom: 1px solid #efefef;
    border-top: 1px solid #efefef;
  }
  .menu-type>li{
    width: 40%;
    margin: 0 5%;
    text-align: center;
    padding: 1rem 0;
    font-size: 1.2rem;
    color: #999;
    letter-spacing: 1px;
  }
  .my-info{
    width: 50%;
    margin: 4rem auto 0;
  }
  .my-info>p{
    text-align: center;
    padding: .5rem 0;
  }
  .my-info>span{
    white-space:normal;
  }
  .my-info>h3{
    font-size: 1rem;
    font-weight: 400;
  }
  .my-info>h3>i{
    display: inline-block;
    width:.972rem;
    height:.972rem;
    background: url("../../assets/img/me/star.png") no-repeat center center /.972rem;
  }
.head-img{
  width: 6.389rem;
  height:6.389rem;
  border-radius: 50%;
  overflow: hidden;
  margin: auto;
  background-color: #efefef;
}
  .set{
    background: url("../../assets/img/me/set.png") no-repeat center center /1.333rem;
    right:0;
  }
</style>
