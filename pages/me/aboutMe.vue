<template>
  <div class="aboutMe">
    <el-header className="go_back" title='关于我们'></el-header>
    <section class="content " style="padding:4rem 1rem 0 1rem;">
      <img src="../../assets/img/me/aboutme.png" alt="">
    </section>
  </div>
</template>

<script>
  import Header from '@/components/Head'
  import {Actionsheet, Indicator, Toast,MessageBox} from 'mint-ui';
  import ImageClip from '@/pages/takePhoto/ImageClip'
  import {updateShopLogo} from '@/service/service'
  export default {
    name: 'aboutMe',
    data () {
      return {

      }
    },
    created(){

    },
    components: {
      'el-header': Header,

    },
    methods: {
      leaveApp(){
        api.closeWidget({
        });
      }
    },
    mounted () {

    }

  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
