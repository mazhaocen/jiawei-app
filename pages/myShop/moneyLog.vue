<template>
  <div class="moneyLog ">
    <el-header className="go_back"  title="历史收入">
    </el-header>
    <section class="content" style="background-color: #efefef">
      <p>本月</p>
      <ul class="logList">
        <li class="cl"><span class="fl">2017-10-12</span> <span class="fr">￥：120</span></li>
        <li class="cl"><span class="fl">2017-10-12</span> <span class="fr">￥：120</span></li>
        <li class="cl"><span class="fl">2017-10-12</span> <span class="fr">￥：120</span></li>
      </ul>
    </section>
  </div>
</template>

<script>
  import Header from '@/components/Head'
  import { MessageBox } from 'mint-ui';
  export default {
    name: 'moneyLog',
    data () {
      return {
        images:[
          {
            base64:'',
            statue:''
          },
          {
            base64:'',
            statue:''
          },
          {
            base64:'',
            statue:''
          }
        ]
      }
    },
    created(){

    },
    components: {
      'el-header': Header
    },
    methods: {
      openConfirm () {
        this.$router.push({name:'withdrawCash'})
//        MessageBox({
//          title: '说明',
//          message: '请添加一张提现储蓄卡！',
//          showCancelButton: true,
//          confirmButtonText:'添加储蓄卡'
//        }).then(res =>{
//            if(res ==='confirm'){
//              this.$router.push({name:'BankCard'})
//            }else{
////              alert('bu添加')
//            }
//        });
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .logList{
  }
  .logList>li>span{
    font-size: 1.2rem;
  }
  .logList>li{
    width: 100%;
    padding: 1rem 1rem ;
    background-color: #fff;
    border-bottom: 1px solid #efefef;
  }
  .content>p{
    background-color: #e5e9f2;
    line-height: 3rem;
    font-size: 1.3rem;
    padding-left: 1rem;
  }

</style>
