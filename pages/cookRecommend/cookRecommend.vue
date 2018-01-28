<template>
  <div class="cookRecommend">
      <header class="header">
        <a @click="this.G.goBack" class="go_back"></a>
        <p>烹饪推荐</p>
        <div @click="popupVisible = true" class="pa choose" >筛选</div>
      </header>
      <section class="content" style="padding-bottom: 0">
        <div style="height: .5rem;background-color: #efefef"></div>
        <div class="cook-recommend-list cl" v-for="i in type">
          <div class="img fl">
            <!--直播显示-->
            <div v-if="i.l" class="live-img">正在烹饪</div>
            <img src="" alt="">
          </div>
          <!--视频显示的块-->
          <div v-if="!i.l" @click="goToCookMenuDetail">
            <div class="info">
              <h3>叉烧鸭</h3>
              <p>长汀河田鸡是世界五大名鸡之一:美国白洛克鸡、中国的河田鸡、美国的洛岛红鸡...</p>
            </div>
            <div class="cl user">
              <i class="fl eye">2309</i>
              <i class="fl time">1小时</i>
              <span class="fr">西红柿大哥</span>
            </div>
          </div>
          <!--直播显示的块-->
          <div class="live" v-if="i.l">
            <div style="height:6.899rem ">
              <h3>直播   虫草花脆鸭汤</h3>
              <ul>
                <li>厨师:鸭子爸爸</li>
                <li>星级: <i v-for="i in 3"></i></li>
                <li>地址:深圳香格里拉酒店</li>
              </ul>
            </div>
            <div class="cl user">
              <i class="fl eye">23</i>
            </div>
          </div>
        </div>
      </section>
    <mt-popup v-model="popupVisible" position="top" class="type-list">
      <mt-checklist
        title="筛选选项" v-model="value" :options="options">
      </mt-checklist>
      <button class="choose-btn" @click="choose()">筛选</button>
    </mt-popup>
  </div>
</template>

<script>
  import {Popup, Checklist, MessageBox,Toast,Actionsheet,Indicator} from 'mint-ui';
export default {
  name: 'cookRecommend',
  data () {
    return {
      popupVisible: false,
      popupVisible1: false,
      modal:false,
      options :[],
      value:[],
      type:[
          {l:0},
          {l:0},
          {l:1},
          {l:0},
          {l:0},
          ]
    }
  },
  created(){
    this.popupVisible1 = true
  },
  methods:{
    choose:function () {
      this.popupVisible = false
    },
    goToCookMenuDetail(){
        this.$router.push({name:'cookMenuDetail'})
    }
  },
  components: {
    'mt-popup': Popup,
    'mt-checklist': Checklist,
  },
  mounted () {
    this.options = ['水果', '蔬菜', '生肉', '海鲜', '禽类', '水产品', '速冻食品', '农副产品','土特产','山货','粮食','茶','其他'];
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .choose:before{
    content: '';
    display: block;
    position: absolute;
    width: 4rem;
    height: 1px;
    background-color: #008842;
    bottom: .5rem;
    left: -0.5rem;
  }
  .choose:after{
    content: '';
    display: block;
    border:5px solid transparent;
    border-top-color:#008842 ;
    position: absolute;
    top: 1.5rem;
    right: -1.2rem;
  }
  .choose{
   top: 0;right:2rem;
  }
  .choose-btn{
    position: absolute; width: 7rem; height: 2.2rem;border-radius: 3px;color: #fff;background-color: #008842; bottom: 1rem; left: 0;right: 0;margin: auto}
  .type-list{
    width: 100%;
    background-color: #efefef;
    height: 40vh;
    /*top:3.666rem;*/
  }

  .img{
    width: 10.556rem;
    height:6.889rem;
    background-color: #b9b9b9;
    margin-right: 1rem;
  }
  .info>h3{
    white-space:normal;
  }
  .info>p{
    white-space:normal;
  }
  .info{
    height: 6.889rem;
  }
  .user>i.eye{
    background: url("../../assets/img/cookRecommend/eye.png") no-repeat left center/.978rem;
    margin-right: 2rem;
  }
  .user>i.time{
    background: url("../../assets/img/cookRecommend/time.png") no-repeat left center /.878rem;
  }
  .user{
    line-height: 2.4rem;
  }
  .user>i{
    color: #808080;
    font-size: .833rem;
    padding-left: 1.5rem;
  }
  .cook-recommend-list{
    border-bottom: 1px solid #efefef;
    padding: .5rem 1rem;
  }
  .live ul>li>i{
    display: inline-block;
    width: 1rem;
    height: 1rem;
    background: url("../../assets/img/cookRecommend/star.png") no-repeat center center/100%;
  }
  .live ul>li{
    float: none;
  }
  .live-img{
    background: url("../../assets/img/cookRecommend/live.png") no-repeat center 3.8rem/2.25rem;
    text-align: center;
    color: #fff;
    line-height: 4.4rem;
    height: 6.889rem;
  }

</style>
