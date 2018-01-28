dd<template>
  <div class="menu">
    <el-header className="go_back" title="大厨菜谱">
      <a class="set"></a>
    </el-header>
    <section class="content" style="padding-bottom: 0">
      <div class="my-info">
        <div class="head-img"><img src="" alt=""></div>
        <p>客家的厨子</p>
        <h3>星级：<i></i></h3>
        <span>地址：香格里拉大酒店</span>
      </div>
      <ul class="menu-type cl">
        <li @click="goToCookMenu()" class="on">大厨菜谱</li>
        <li @click="goToCookInfo()">大厨资料</li>
      </ul>
      <div class="menu-list cl">
        <div class="fl" v-for="(i,index) in menuList" :style="[index%2?{float:'right'}:'']">
          <div class="menu-img"><img v-lazy="i.pic"></div>
          <h3>油焖大虾</h3>
          <p>客家厨子</p>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
  import Header from '@/components/Head'
export default {
  name: 'menu',
  data () {
    return {
        title: '',
      m:1,
      menuList:[
        {pic:'http://pics.sc.chinaz.com/files/pic/pic9/201702/zzpic1399.jpg'},
        {pic:'http://pics.sc.chinaz.com/files/pic/pic9/201612/fpic9875.jpg'},
        {pic:'http://pics.sc.chinaz.com/files/pic/pic9/201610/fpic8220.jpg'},
        {pic:'http://pics.sc.chinaz.com/files/pic/pic9/201611/fpic8607.jpg'},
        {pic:'http://pics.sc.chinaz.com/files/pic/pic9/201611/fpic8745.jpg'},
        {pic:'http://pics.sc.chinaz.com/files/pic/pic9/201701/zzpic437.jpg'},
        {pic:'http://pics.sc.chinaz.com/files/pic/pic9/201610/apic23881.jpg'},
        {pic:'http://pics.sc.chinaz.com/files/pic/pic9/201608/fpic5949.jpg'},
        {pic:'http://pics.sc.chinaz.com/files/pic/pic9/201608/fpic6419.jpg'},
        {pic:'http://pics.sc.chinaz.com/files/pic/pic9/201609/fpic7403.jpg'},
        {pic:'http://pics.sc.chinaz.com/files/pic/pic9/201609/fpic7317.jpg'},
        {pic:'http://pics.sc.chinaz.com/files/pic/pic9/201605/fpic1376.jpg'},
        {pic:'http://pics.sc.chinaz.com/files/pic/pic9/201606/apic21195.jpg'},
        {pic:'http://pics.sc.chinaz.com/files/pic/pic9/201606/apic21465.jpg'},
        {pic:'http://pics.sc.chinaz.com/files/pic/pic9/201604/apic20040.jpg'},
        {pic:'http://pics.sc.chinaz.com/files/pic/pic9/201604/fpic914.jpg'},
        {pic:'http://pics.sc.chinaz.com/files/pic/pic9/201604/fpic873.jpg'},
        {pic:'http://pics.sc.chinaz.com/files/pic/pic9/201605/fpic1208.jpg'}
      ]
    }
  },
  created(){
    this.m = this.$route.params.id
  },
  components:{
    'el-header':Header
  },
  methods:{
    goToCookMenu:function (i) {
      this.$router.push({name:'cookMenu'})
    },
    goToCookInfo:function () {
      this.$router.push({name:'cookInfo'})
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
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
  .menu-img{
    width: 14.056rem;
    height: 8.684rem;
    background-color: #efefef;
    overflow: hidden;
  }
  .menu-type>li.on{
    border-bottom: 3px solid #008842;
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
  }
  .my-info{
    width: 50%;
    margin: auto;
  }
  .my-info>p{
    text-align: center;
    padding: .5rem 0;
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
