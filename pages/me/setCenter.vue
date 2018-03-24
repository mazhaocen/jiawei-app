<template>
  <div class="set-center">
    <el-header className="go_back" title='设置中心'></el-header>
    <section class="content " style="padding-bottom: 0">
      <ul class="cl">
        <!--<li>修改密码</li>-->
        <li>客服热线 <span class="fr">0755-26905891</span></li>
        <li>清除缓存</li>
        <li>版本更新 <span class="fr">{{appVersion}}</span></li>
        <li @click="goToAbout">关于我们</li>
        <li @click="leaveApp">退出应用</li>
      </ul>
    </section>
  </div>
</template>

<script>
  import Header from '@/components/Head'
  import {Actionsheet, Indicator, Toast,MessageBox} from 'mint-ui';
  import ImageClip from '@/pages/takePhoto/ImageClip'
  import {updateShopLogo} from '@/service/service'
  export default {
    name: 'setCenter',
    data () {
      return {
        appVersion:''
      }
    },
    created(){
      this.appVersion = api.appVersion;
    },
    components: {
      'el-header': Header,

    },
    methods: {
      leaveApp(){
        api.closeWidget({
        });
      },
      goToAbout(){
          this.$router.push({name:'aboutMe'})
      }
    },
    mounted () {

    }

  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .set-center ul{
    border-top: 3px solid #efefef;
  }
  .set-center ul>li{
    float: none;
    padding: 0 1rem ;
    border-bottom: 1px solid #efefef;
    line-height: 4rem;
    font-size: 1.333rem;
  }
  .manage-cell > div {
    padding: 0 1rem;
    border-bottom: 1px solid #efefef;
    line-height: 3.4rem;
    font-size: 1.333rem;
    color: #5f646c;
    background: url("../../assets/img/myShop/arr-ri.png") no-repeat 97% center /.778rem;
  }

  .manage-cell > p {
    padding: 0 1rem;
    background-color: #efefef;
    color: #999;
    line-height: 2.6rem;
  }
</style>
