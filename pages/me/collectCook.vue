<template>
  <div class="collectCook">
    <el-header className="go_back" title="关注厨师">
      <span v-if="!del" class="pa edit" @click="del=true">编辑</span>
      <span v-if="del" class="pa edit" @click="del=false">取消</span>
    </el-header>
    <section class="content" style="padding-bottom: 0">
      <div class="cook" v-for="(i,index) in cookerList" @click="goToCook(i)">
        <div class="info cl pr">
          <span v-if="del" class="pa delete" @click.stop="deleteCook(i,index)" >删除</span>
          <div class="img fl"><img v-lazy="i.img" alt=""></div>
          <div class="fl" style="width: 13.6rem">
            <p>厨师：{{i.name}}</p>
            <p>星级： <i></i></p>
            <p>地址：深圳香格里拉大酒店格里拉大酒店</p>
          </div>
        </div>
        <div class="cook-menu cl">
          <div class="ba-img fl" v-for="menu in i.cookbooks">
            <img v-lazy="menu.coverImg" alt="">
            <div class="pa" style="background-color: rgba(0,0,0,0.5);bottom: 0;text-align: center;color:#fff;width: 100%">{{menu.name}}</div>
            <!--<div class="cook-live">正在烹飪</div>-->
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
  import Header from '@/components/Head'
  import {Popup, Checklist, MessageBox, Toast, Actionsheet, Indicator} from 'mint-ui';
export default {
  name: 'collectCook',
  data () {
    return {
      del:false,
      cookerList:[]
    }
  },
  created(){
    this.getCollectStore()
  },
  components:{
      'el-header':Header
  },
  methods:{
    goToCook(i){
      sessionStorage.setItem('cookerId',JSON.stringify(i.id));
      this.$router.push({name:'cook'})
    },
    deleteCook(info,index){
      MessageBox({
        title: '提示',
        message: '您确定删除选择的收藏厨师吗？',
        showCancelButton: true
      }).then(res => {
        if (res === 'confirm') {
          Indicator.open()
          this.$http.post(this.API.cancelCollect,{
            menuId:3,
            collectId:info.id
          }).then(res=>{
            if(res.data.status==1){
              this.cookerList.splice(index,1)
              Toast({message: '删除成功！'});
            }
            Indicator.close()
          })
        } else {
        }
      });
    },
    getCollectStore(){
      this.$http.post(this.API.myCollect,{
        menuId:3
      }).then(res=>{
        // console.log(res.data)
        this.cookerList = res.data.data.data
      }).catch(err=>{
        // console.log(err.data)
      })
    },
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
    right:0;
    z-index:200;
    font-size: 1.4rem;
    color: red;
  }
  .cook-live{
    color: #fff;
    top:0;
    left:0;
    line-height: 5rem;
    position: absolute;
    text-align: center;
    width: 10.333rem;
    height:6.111rem;
    background: url("../../assets/img/cookRecommend/live.png") no-repeat center 3.8rem/2.25rem;
  }
.cook{
  border-top: .3rem solid #efefef;
  padding: 1rem;
}
.cook-menu{
  width: 23rem;
  margin: auto;
  padding-top: .3rem;
}
.ba-img>img{
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.ba-img{
  position: relative;
  width: 10.333rem;
  height:6.111rem;
  /*background: url("../../assets/img/me/cookli.png") no-repeat center center/100%;*/
}
  .info>div>p{
    font-size: 1.111rem;
    white-space:normal;
  }
  .info>div>p>i{
    display: inline-block;
    width:.972rem;
    height:.972rem;
    background: url("../../assets/img/me/star.png") no-repeat center center /.972rem;
  }
  .info{
    border-bottom: 1px solid #efefef;
    width: 25rem;
    margin: auto;
    padding-bottom: .5rem;
  }
  .img{
    width: 5.111rem;
    height: 5.111rem;
    border-radius: 50%;
    overflow: hidden;
    background-color: #efefef;
    margin: 0 2rem;
  }
</style>
