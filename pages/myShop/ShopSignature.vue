<template>
  <div class="shop-signature">
    <el-header className="go_back" :title="title"></el-header>
    <section class="content" style="background-color: #efefef">
      <textarea v-model="shopText" maxlength="40"></textarea>
      <div class="pd-1">
        <span>说明：</span>
        <p>1.不能包含（￥%&*@）等特殊字符;</p>
        <p>2.签名长度不能超过40个字符;</p>
      </div>
    </section>
    <footer class="footer">
      <button class="save-btn" @click="saveSetting">保存</button>
    </footer>
  </div>
</template>

<script>
  import Header from '@/components/Head'
  import {MessageBox,Toast,Indicator} from 'mint-ui';
//  import {updateShopName, updateShopSlogan} from '@/service/service';

  export default {
    name: 'userManage',
    data () {
      return {
        title: '',
        shopText: '',
        shopInfo:''
      }
    },
    created(){
      this.shopInfo = JSON.parse(sessionStorage.getItem('shopInfo'))
      this.getTitle(this.$route.params.title)
      // console.log(this.shopInfo)

    },
    components: {
      'el-header': Header
    },
    methods: {
      getTitle (title) {
        if (title === 'sign') {
          this.title = '店铺签名'
          this.shopText = this.shopInfo.slogan
        } else if (title === 'name') {
          this.title = '店铺名称'
          this.shopText = this.shopInfo.name
        }
      },
      saveSetting () {
        MessageBox({
          title: '提示',
          message: '您确认修改吗？',
          showCancelButton: true,
          confirmButtonText:'确定'
        }).then(res =>{
          Indicator.open('提交中...')
          if(res ==='confirm'){
              if(this.$route.params.title ==='name') {
                this.shopNameUpdate()
              }else{
                this.sloganUpdate()
              }
          }else{
          }
        });
      },
      shopNameUpdate () {
//        updateShopName(this.shopText).then(res=>{
//          Indicator.close()
//          // console.log(res)
//          this.shopInfo.name = this.shopText
//          sessionStorage.setItem('shopInfo',JSON.stringify(this.shopInfo))
//          Toast({
//            message: '修改成功',
//            iconClass: 'mintui mintui-success'
//          });
//          history.go(-1)
//        }).catch(err=>{
//          Indicator.close()
//          // console.log(err.response)
//          Toast({
//            message: '修改失败，请重试',
//          });
//        })
      },
      sloganUpdate () {
//        updateShopSlogan(this.shopText).then(res=>{
//          Indicator.close()
//          // console.log(res)
//           this.shopInfo.slogan = this.shopText
//          sessionStorage.setItem('shopInfo',JSON.stringify(this.shopInfo))
//          Toast({
//            message: '修改成功',
//            iconClass: 'mintui mintui-success'
//          });
//          history.go(-1)
//        }).catch(err=>{
//          Indicator.close()
//          // console.log(err.response)
//          Toast({
//            message: '修改失败，请重试',
//          });
//        })
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .shop-signature .pd-1 {
    color: #999999;
  }

  .shop-signature textarea {
    resize: none;
    width: 100%;
    padding: 1rem;
    height: 8rem;
    font-size: 1.333rem;
    margin: .3rem 0;
  }

</style>
