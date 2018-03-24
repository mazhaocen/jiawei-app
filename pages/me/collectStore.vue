<template>
  <div class="collectStore">
    <el-header className="go_back" title="关注店鋪" more="true">
      <span v-if="!del" class="pa edit" @click="del=true">编辑</span>
      <span v-if="del" class="pa edit" @click="del=false">取消</span>
    </el-header>
    <section class="content" style="padding-bottom: 0">
      <div class="store cl pr" v-for="i,index in storeList" @click="goToSellerStore(i)" >
      <span v-if="del" class="pa delete" @click.stop="deleteStore(index)" >删除</span>
        <div class="img fl"><img v-lazy="i.img" alt=""></div>
        <div class="text fl">
          <h3>{{i.name}}</h3>
          <p>现有商品：<span>{{i.countGoodsNum}}</span></p>
          <!--<p>新增：<span>3</span></p>-->
          <!--<p>优惠劵：<span>2</span></p>-->
        </div>
      </div>
    </section>
  </div>
</template>

<script>
  import Header from '@/components/Head'
  import {Popup, Checklist, MessageBox, Toast, Actionsheet, Indicator} from 'mint-ui';
export default {
  name: 'collectStore',
  data () {
    return {
      del:false,
      storeList:[]
    }
  },
  created(){
    this.getCollectStore()
  },
  components:{
      'el-header':Header
  },
  methods:{
    getCollectStore(){
      this.$http.post(this.API.myCollect,{
          menuId:4
      }).then(res=>{
          // console.log(res.data)
        this.storeList= res.data.data.data
      }).catch(err=>{
          // console.log(err.data)
      })
    },
    goToSellerStore(i){
      sessionStorage.setItem('shopId',i.id)
      this.$router.push({name:'sellerStore'})
    },
    deleteStore(info,index){
      MessageBox({
        title: '提示',
        message: '您确定删除选择的收藏店铺吗？',
        showCancelButton: true
      }).then(res => {
        if (res === 'confirm') {
          Indicator.open()
          this.$http.post(this.API.cancelCollect,{
            menuId:4,
            collectId:info.id
          }).then(res=>{
            if(res.data.status==1){
              this.array.splice(index,1);
              // console.log(res.data)
              Toast({message: '删除成功！'});
            }
            Indicator.close()
          })
          this.array.splice(index,1)
          Indicator.close()
        } else {
        }
      });
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .edit{
    right:1rem;
    font-size: 1.2rem;
  }
  .delete{
    right:1rem;
    z-index:200;
    font-size: 1.4rem;
    color: red;
  }
  .content{
    background-color: #efefef;
  }
  .text>p>span{
    color: #ff0000;
  }
  .text>p{
    font-size: 1.111rem;
    padding-top: .2rem;
  }
  .text>h3{
    padding: .3rem 0;
    font-size: 1.333rem;
    margin-bottom: .6rem;
  }
  .text{
    width: 16.111rem;
    margin-left: 1.5rem;
  }
.store{
  background-color: #fff;
  border-top: .3rem solid #efefef;
  padding:.5rem;
}
  .img>img{
    width: 100%;
    height:100%;
    object-fit: cover;
  }
  .img{
    overflow: hidden;
    width: 10.944rem;
    height: 9rem;
    background-color: #efefef;
  }
</style>
