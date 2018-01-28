<template>
  <div class="informationDetail">
    <el-header className = 'go_back' :title="title"></el-header>
    <section class="content">
      <h3>{{data.title}}</h3>
      <div class="menu-head cl">
        <p>发布人：{{data.operator}} <span class="fr" data-info="时间">{{data.operatetime}}</span></p>
        <div class="menu-head-img">
          <img :src="data.img" alt="">
        </div>
        <p style="text-indent: 2em">{{data.content}}</p>
      </div>

      <div></div>
      <!--<div class="support">-->
        <!--<p>赞 ({{data.countFavor}})</p>-->
        <!--<ul>-->
          <!--<li v-for="i in 12"><img src="" alt=""></li>-->
        <!--</ul>-->
      <!--</div>-->
      <div class="discuss">
        <p>评论 ({{data.countComment}})</p>
        <ul class="discussList">
          <li class="cl" v-for="i in data.commentList">
            <div class="discuss-head"><img src="" alt=""></div>
            <div class="discuss-detail">
              <p class="cl"><i class="fl">{{i.userName}}<span style="display: block"><i></i></span></i><span class="fr">{{i.createTime | formatTime}}</span></p>
              <p class="discuss-text">{{i.comment}}<!--<span class="fr" style="color: #008842;">回复</span>--></p>
              <!--<div class="more-discuss">-->
                <!--<p><span class="user" >鸭子达人</span>回复 <span class="user">鸭子天禧</span>鸭子片皮不是 说一说就可以学会的，这些都是勤加练习的，我也不会，可以的话多指教。</p>-->
                <!--<p><span class="user" >鸭子天禧</span>回复 <span class="user">鸭子达人</span>大家相互学习</p>-->
              <!--</div>-->
            </div>
          </li>
        </ul>
      </div>
    </section>
    <div class="footer replay" v-if="isReplay">
      <input ref="searchInput" :placeholder="placeholder" type="text" v-on:blur="changeCount()" v-model="commentText">
      <span class="fr" @click="sendComment">发送</span>
    </div>
    <footer class="footer"  v-if="!isReplay">
      <input type="text" readonly @click="commentInput" placeholder="发表评论">
      <p class="share-btn" @click=""></p>
      <p class="collect-btn" :class="{'on':data.hasCollected}" @click="collect(data.hasCollected)">{{data.countCollect}}</p>
      <p class="support-btn" :class="{'on':data.hasFavored}" @click="favour(data.hasFavored)">{{data.countFavor}}</p>
    </footer>
  </div>
</template>

<script>
  import Footer from '@/components/Foot'
  import Header from '@/components/Head'
  import {Popup, Checklist, MessageBox,Toast,Actionsheet,Indicator} from 'mint-ui';
  export default {
  name: 'informationDetail',
  data () {
    return {
      title:'资讯详情',
      data:'',
      commentText:'',
      isReplay:false
    }
  },
  components:{
    'el-header':Header,
    'el-footer':Footer,
    'mt-popup': Popup,
  },
  created(){
    this.infoId = this.$route.params.id;
    this.infoType = this.$route.params.type;
    this.getInformationDetail(this.infoId)
    this.addBrowse()
  },
    filters: {
      formatTime:(time) =>{
        let t = new Date(time);
        let y = t.getFullYear();
        let m = t.getMonth()+1>9?t.getMonth()+1:'0'+(t.getMonth()+1);
        let d = t.getDate()>9?t.getDate():'0'+t.getDate();
        let h = t.getHours()>9?t.getHours():'0'+t.getHours();
        let mm = t.getMinutes()>9?t.getMinutes():'0'+t.getMinutes();
        let s = t.getSeconds()>9?t.getSeconds():'0'+t.getSeconds();
        return y+'-'+ m +'-'+d+' '+h+':'+mm+':'+s
      },
    },
  methods:{
    getInformationDetail(id){
      this.$http.post(this.API.infoDetail,{id:id}).then(res=>{
          console.log(res.data);
        this.data = res.data.data
      }).catch(err=>{

      })
    },
    addBrowse(){
      this.$http.post(this.API.addBrowse,{
        menuId:this.infoType,
        browseId:this.infoId
      }).then(res=>{

      }).catch(err=>{

      })
    },
    collect(){//收藏按钮
      if(!this.data.hasCollected){
          this.$http.post(this.API.addCollect,{//收藏
            menuId:1,
            collectId:this.infoId
          }).then(res=>{
              if(res.data.status===1){
                this.data.hasCollected = true;
                this.data.countCollect++
              }
          })
      }else{
          this.$http.post(this.API.cancelCollect,{//取消收藏
            menuId:1,
            collectId:this.infoId
          }).then(res=>{
            if(res.data.status===1){
              this.data.hasCollected = false;
              this.data.countCollect--
            }
          })
      }
    },
    favour(){//点赞按钮
      if(!this.data.hasFavored){
          this.$http.post(this.API.addFavor,{
            menuId:1,
            favorId:this.infoId
          }).then(res=>{
              console.log(res.data);
            if(res.data.status===1){
              this.data.hasFavored = true;
              this.data.countFavor++
            }
          })
      }
    },
    commentInput(){
      this.isReplay = true;
      this.replayContent='';
      setTimeout(()=>{
        if(this.isReplay){
          this.$refs.searchInput.focus();
        }
      },100)
      this.placeholder = '发表评论'
    },
    sendComment(){
        Indicator.open()
      this.$http.post(this.API.addComment,{
        menuId:1,
        commentId:this.infoId,
        comment:this.commentText
      }).then(res=>{
          console.log(res.data)
        if(res.data.status==1){
          this.getInformationDetail(this.infoId)
        }
        Indicator.close()
      }).catch(err=>{
        Indicator.close()
      })
    },
    changeCount(){
      setTimeout(()=>{
        this.isReplay = false
        this.isComment = false
      })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .share-btn{background: url("../../assets/img/cook/fenxiang.png") no-repeat 1rem center /1.5rem;  }
  .collect-btn{background: url("../../assets/img/cook/shoucang.png") no-repeat 1rem center /1.58rem;  }
  .collect-btn.on{background: url("../../assets/img/cook/xin.png") no-repeat 1rem center /1.58rem;  }
  .support-btn{background: url("../../assets/img/cook/zan.png") no-repeat 1rem center /1.56rem;  }
  .support-btn.on{background: url("../../assets/img/cook/zan-on.png") no-repeat 1rem center /1.56rem;  }
  .footer>input{margin-left: 1rem;padding: .2rem 1rem;width: 15rem;height: 3rem;border:1px solid #efefef;}
  .footer>p{vertical-align: middle;display: inline-table;padding-left: 3rem;height: 3.611rem;}
  .footer{border-top: 1px solid #efefef;background-color:#fff ;}
  .more-discuss .user{color: #008842;}
  .more-discuss>p{white-space:normal;}
  .more-discuss{margin: .5rem 0 0 0;padding: .5rem;width: 90%;background-color: #f4f4f4;}
  .discuss-detail>p>span{color: #a1a1a1;}
  .discuss-detail>p>i{color: #008842;}
  .discuss-detail{border-bottom: 1px solid #efefef;width: 90%;float: left;padding-left: 1rem;padding-bottom: 1rem}
  .discussList>li{float: none;padding-top: .5rem}
  .discuss-head{float: left;}
  .discuss>p{ margin-bottom: 1.5rem;  font-size: 1.111rem;  padding-left: 2rem;  background: url("../../assets/img/cook/msg.png") no-repeat left center/1.523rem;  }
  .discuss{  padding: 1rem ;  }
  .support{  padding: 1rem;  border-bottom: 1px solid #efefef;  }
  .support>ul{  overflow: auto;  text-overflow: clip; margin-top: .5rem;  }
  .support>ul>li,.discuss-head{width: 2.611rem;height: 2.611rem;border-radius: 50%;background: url("../../assets/img/cook/cook-head.png") no-repeat center/cover;  }
  .support>ul>li{  margin-right: 1rem;  float: none;  display: inline-block;  }
  .support>p{  font-size: 1.111rem;  padding-left: 2rem;  background: url("../../assets/img/cook/zan.png") no-repeat left center/1.333rem;  }
  .stepList>li>p{  white-space:normal;  }
  .stepList>li{  padding-bottom: .5rem;  float: none;  }
  h3{  text-align: left;  font-size: 1.667rem;padding:1rem;  }
  .menu-head-img{width: 28rem;height:18.273rem ;background-color: #efefef;margin: 1rem auto}
  .menu-head-img>img{
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  .menu-head{
    padding: 1rem;
  }
  .menu-head>p{
    white-space: normal;
  }
  .replay.footer>span{
    background-color: #008842;
    color: #fff;
    border-radius: 3px;
    width: 4.5rem;
    text-align: center;
    font-size: 1.2rem;
    height: 2.6rem;
    line-height:2.6rem;
    margin-top: .555rem;
    margin-right: 2rem;
  }
  .replay.footer>input{
    border: 1px solid #efefef;
    width: 21rem;
    border-radius: 3px;
  }
</style>
