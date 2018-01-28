<template>
  <div class="myInfo">
    <el-header className="go_back" title="大厨资料"></el-header>
    <section class="content" style="padding-bottom: 0">
      <div class="my-info">
        <div class="head-img"><img src="" alt=""></div>
        <p>客家的厨子</p>
        <h3>星级：<i></i></h3>
        <span>地址：香格里拉大酒店</span>
      </div>
      <ul class="menu-type cl">
        <li @click="goToCookMenu()">大厨菜谱</li>
        <li @click="goToCookInfo()" class="on">大厨资料</li>
      </ul>
      <div class="info">
        <p><i>昵称</i> <span>客家的厨子</span></p>
        <p><i>地区</i> <span>粤</span></p>
        <p><i>个性签名</i> <span>客家人做客家菜绝对好吃</span></p>
        <p style="border-top:1px solid #efefef;padding-top: 1rem"><i>故乡</i> <span>福建   龙岩</span></p>
        <p style="border-bottom:1px solid #efefef"><i>现居</i> <span>广东   深圳</span></p>
        <p style="padding-top: 1.2rem"><i>我的经历</i> <span>没有大起大落的经历，老老实实做自 客家菜，做自己的味道，家乡的味道</span></p>
      </div>
    </section>
  </div>
</template>

<script>
  import Header from '@/components/Head'
export default {
  name: 'myInfo',
  data () {
    return {
        title: '',
      m:1
    }
  },
  created(){

  },
  components:{
    'el-header':Header
  },
  methods:{
    goToCookMenu:function (i) {
      this.$router.push({name:'cookMenu'})
        this.m=i
      },
    goToCookInfo:function () {
      this.$router.push({name:'cookInfo'})
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
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
</style>
