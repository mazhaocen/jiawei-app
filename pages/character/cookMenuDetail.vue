<template>
  <div class="cookeMenuDetail">
    <el-header className='go_back' :title="title"></el-header>
    <section class="content">

      <div class="menu-head cl">
        <div class="big-img"><img v-lazy="menuData.coverImg" alt=""></div>
        <div class="head-text pr">
          <p style="line-height: 2rem;padding-left: 7rem; margin-bottom: 1rem;height: 2rem;"><b><img v-lazy="menuData.accountImg" alt=""></b>{{menuData.creater}}
            <a class="pa" @click="cookerCollect(menuData.accountId)" :class="{'on':menuData.hasChefCollected}">{{menuData.hasChefCollected ? '已关注' : '关注'}}</a>
          </p>
          <p class="cl"><i class="fl">心德：</i><span>{{menuData.tip}}</span></p>
          <p>星级：<label></label><label></label></p>
          <p style="border-bottom: 1px solid #efefef">直播账号：{{menuData.accountLiveRoomId}}</p>

          <div class="live-menu" v-if="menuData.accountLiveUrl" @click="goToLookLive">
            <img v-lazy="menuData.accountLiveImg" alt="">
            <p>正在直播 <i></i></p>
            <p style="top: 2rem;">{{menuData.accountLiveTitle}}</p>
          </div>
        </div>
      </div>
      <!--<ul class="video-list cl">-->
        <!--<li class="video-li"><i class="play"></i></li>-->
        <!--<li class="video-li"><i class="play"></i></li>-->
        <!--<li class="video-li"><i class="play"></i></li>-->
      <!--</ul>-->
      <div class="method">
        <h3>{{menuData.name}}</h3>
        <div class="cl"><i>主 料:</i>
          <div>{{menuData.mainMaterial}}</div>
        </div>
        <div class="cl"><i>辅 料:</i>
          <div>{{menuData.auxiliaryMaterial}}</div>
        </div>
        <div class="cl stepList" v-for="(s,index) in menuData.stepList">
          <i class="fl">步 骤{{index+1}}:</i><p class="fl">{{s.stepDesc}}</p>
          <div class="steps">
            <div class="step-img" v-if="s.stepImg"><img v-lazy="s.stepImg" alt=""></div>
          </div>
        </div>
      </div>
      <!--<div class="support">-->
      <!--<p>赞 (88)</p>-->
      <!--<ul>-->
      <!--<li v-for="i in 12"><img src="" alt=""></li>-->
      <!--</ul>-->
      <!--</div>-->
      <div class="discuss">
        <p>评论 ({{menuData.countComment}})</p>
        <ul class="discussList">
          <li class="cl" v-for="(c,index) in menuData.commentList">
            <div class="discuss-head"><img :src="c.img" alt=""></div>
            <div class="discuss-detail">
              <p class="cl"><i class="fl">{{c.userName}}<span style="display: block"><i></i></span></i><span class="fr">{{c.createTime | formatTime}}</span>
              </p>
              <p class="discuss-text">{{c.comment}}</p>
              <div class="more-discuss" v-if="c.replyList.length>0">
                <p v-for="r in c.replyList" @click="replay(r,c.id,index)"><span class="user" >{{r.replyUserName}}</span>回复 <span class="user">{{r.userName}}</span>:{{r.replyComment}}</p>
              </div>
              <div class="replay">
                <span class="fr" style="color: #008842;" @click="replay(c,'',index)">回复</span>
              </div>
            </div>
          </li>
        </ul>
      </div>
    </section>
    <div class="footer replay" v-if="isReplay">
      <input ref="searchInput" :placeholder="placeholder" type="text" v-on:blur="changeCount()" v-model="replayContent">
      <span class="fr" v-if="!isComment" @click="addReply">发送</span>
      <span class="fr" v-if="isComment" @click="sendComment">发送</span>
    </div>
    <footer class="footer" v-if="!isReplay">
      <input type="text" v-model="commentText" placeholder="发表评论" readonly @click="commentInput">
      <p class="share-btn" @click="share"></p>
      <p class="collect-btn" :class="{'on':menuData.hasCollected}" @click="menuCollect()">{{menuData.countCollect}}</p>
      <p class="support-btn" :class="{'on':menuData.hasFavored}" @click="favour()">{{menuData.countFavor}}</p>
    </footer>
  </div>
</template>

<script>
  import Footer from '@/components/Foot'
  import Header from '@/components/Head'
  import Vue from 'vue'
  import {Popup, Checklist, MessageBox, Toast, Actionsheet, Indicator} from 'mint-ui';
  export default {
    name: 'cookeMenuDetail',
    data () {
      return {
        title: '菜谱',
        menuData: '',
        commentText: '',
        isReplay:false,
        replayContent:'',
        placeholder:'',
        index:'',
        isComment:false
      }
    },
    components: {
      'el-header': Header,
      'el-footer': Footer,
      'mt-popup': Popup,
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
    created(){
      this.menuId = this.$route.params.id;
      this.menuType = this.$route.params.type;
      if (this.menuId) {
        this.getMenuDetailData()
        this.addBrowse();
      }
    },
    methods: {
      getMenuDetailData(){//获取菜谱详情
        Indicator.open()
        this.$http.post(this.API.menu_detail, {
          id: this.menuId
        }).then(res => {
          console.log(res.data.data);
          if(!res.data.data.commentList){
            res.data.data.commentList=[]
          }
          this.menuData = res.data.data
          Indicator.close()
        }).catch(err => {
          Indicator.close()
        })
      },
      addBrowse(){
        this.$http.post(this.API.addBrowse,{
          menuId:this.menuType,
          browseId:this.menuId
        }).then(res=>{

        }).catch(err=>{

        })
      },
      goToLookLive(){
        api.openFrame({
          name: 'playConfig',
          url: 'widget://html/playConfig.html',
          rect: {
            x: 0,
            y: 0,
            w: 'auto',
            h: 'auto'
          },
          pageParam:{
            url:this.menuData.accountLiveUrl
          }
        })
      },
      menuCollect(id){//收藏菜谱
        if (this.menuData.hasCollected) {
          this.$http.post(this.API.cancelCollect, {//取消收藏
            menuId: 2,//1.资讯  2.菜谱3.大厨 4.店铺 5.商品
            collectId: this.menuId
          }).then(res => {
            if (res.data.status === 1) {
              this.menuData.hasCollected = false;
              this.menuData.countCollect--
            }
          })
        } else {
          this.$http.post(this.API.addCollect, {//收藏
            menuId: 2,
            collectId: this.menuId
          }).then(res => {
            console.log(res.data);
            if (res.data.status === 1) {
              this.menuData.hasCollected = true;
              this.menuData.countCollect++
            }
          }).catch(err => {
            console.log(err)
          })
        }
      },
      cookerCollect(id){//收藏厨师
        if (this.menuData.hasChefCollected) {
          this.$http.post(this.API.cancelCollect, {//取消收藏
            menuId: 3,//1.资讯  2.菜谱3.大厨 4.店铺 5.商品
            collectId: id
          }).then(res => {
            if (res.data.status === 1) {
              this.menuData.hasChefCollected = false;
            }
          })
        } else {
          this.$http.post(this.API.addCollect, {//收藏
            menuId: 3,
            collectId: id
          }).then(res => {
            console.log(res.data);
            if (res.data.status === 1) {
              this.menuData.hasChefCollected = true;
            }
          }).catch(err => {
            console.log(err)
          })
        }
      },
      commentInput(){
        this.isReplay = true;
        this.isComment = true;
        this.replayContent='';
        setTimeout(()=>{
            if(this.isReplay){
              this.$refs.searchInput.focus();
            }
        },100)
        this.placeholder = '发表评论'
      },
      sendComment(){//发布评论
        Indicator.open()
        this.$http.post(this.API.addComment, {
          menuId: 2,
          commentId: this.menuId,
          comment: this.replayContent
        }).then(res => {
          if(res.data.status===1){
            this.menuData.commentList.push({
              comment:JSON.parse(JSON.stringify(this.replayContent)),
              img:'',
              replyList:[],
              createTime:new Date().getTime(),
              userId:localStorage.getItem('userId'),
              userName:localStorage.getItem('userName')
            });
            this.replayContent='';
          }
          Indicator.close()
//          console.log(res.data)
        }).catch(err=>{
          Indicator.close()
        })
      },
      favour(){//点赞
        if (!this.menuData.hasFavored) {
          this.$http.post(this.API.addFavor, {
            menuId: 2,
            favorId: this.menuId
          }).then(res => {
            console.log(res.data);
            if (res.data.status === 1) {
              this.menuData.hasFavored = true;
              this.menuData.countFavor++
            }
          })
        }
      },
      addReply(){//发送回复的内容
          this.replayData.replyComment = this.replayContent;
          Indicator.open()
          this.$http.post(this.API.addReply,this.replayData).then(res=>{
            //回复成功后 不需要再次请求数据，从本地添加
            if(res.data.status===1){
              let replayData = {
                replyComment: JSON.parse(JSON.stringify(this.replayContent)),
                replyUserId: localStorage.getItem('userId'),
                replyUserName: localStorage.getItem('userName'),
                userId:this.replayData.userId ,
                userName: this.replayData.userName
              }
              this.menuData.commentList[this.index].replyList.push(replayData)
              this.isReplay = false;
            }
            Indicator.close()
          }).catch(err=>[
            Indicator.close()
          ])
      },
      replay(data,id,index){//选择回复的内容
          this.index=index
        this.replayData = data;
          if(id){
            this.replayData={
              menuId:'2',
              userId:data.replyUserId,
              userName:data.replyUserName,
              commentId:id,
              replyComment:''
            }
            this.placeholder = '回复 '+data.replyUserName
          }else{
            this.replayData={
              menuId:'2',
              userId:data.userId,
              userName:data.userName,
              commentId:data.id,
              replyComment:''
            };
            this.placeholder = '回复 '+data.userName
          }
        this.isReplay = true;
        this.replayContent='';
        setTimeout(()=>{
          if(this.isReplay){
            this.$refs.searchInput.focus();
          }
        })

      },
      changeCount(){
        setTimeout(()=>{
          this.isReplay = false
          this.isComment = false
        })
      },
      share () {
        let sharedModule = api.require('shareAction');
        sharedModule.share({
          text: '味人服务',
          type: 'url',
          path:'https://www.baidu.com/'
        });
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .method > div > div.steps{
    width: 100%;
    padding-left: 0;
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
  .collect-btn {
    background: url("../../assets/img/cook/shoucang.png") no-repeat 1rem center /1.58rem;
  }

  .collect-btn.on {
    background: url("../../assets/img/cook/xin.png") no-repeat 1rem center /1.58rem;
  }

  .support-btn {
    background: url("../../assets/img/cook/zan.png") no-repeat 1rem center /1.56rem;
  }

  .support-btn.on {
    background: url("../../assets/img/cook/zan-on.png") no-repeat 1rem center /1.56rem;
  }

  .footer > input {
    margin-left: 1rem;
    padding: .2rem 1rem;
    width: 15rem;
    height: 3rem;
    border: 1px solid #efefef;
  }

  .footer > p {
    vertical-align: middle;
    display: inline-table;
    padding-left: 3rem;
    height: 3.611rem;
  }

  .share-btn {
    background: url("../../assets/img/cook/fenxiang.png") no-repeat 1rem center /1.5rem;
  }

  .collect-btn {
    background: url("../../assets/img/cook/shoucang.png") no-repeat 1rem center /1.58rem;
  }

  .support-btn {
    background: url("../../assets/img/cook/zan.png") no-repeat 1rem center /1.56rem;
  }

  .footer > input {
    margin-left: 1rem;
    padding: .2rem 1rem;
    width: 14rem;
    height: 3rem;
    border: 1px solid #efefef;
  }

  .footer > p {
    /*float: left;*/
    vertical-align: middle;
    display: inline-table;
    padding-left: 3rem;
    height: 3.611rem;
  }

  .footer {
    border-top: 1px solid #efefef;
    background-color: #fff;
  }

  .more-discuss .user {
    color: #008842;
  }

  .more-discuss > p {
    white-space: normal;
  }
  .more-discuss {
    margin: .5rem 0 .5rem 0;
    padding: .5rem;
    background-color: #f4f4f4;
  }

  .discuss-detail > p > span {
    color: #a1a1a1;
  }

  .discuss-detail > p {
    white-space:normal;
  }
  .discuss-detail > p > i {
    color: #008842;
  }

  .discuss-detail {
    border-bottom: 1px solid #efefef;
    width: 90%;
    float: left;
    padding-left: 1rem;
    padding-top: .5rem;
  }

  .discussList > li {
    float: none;
  }

  .discuss-head {
    float: left;
  }

  .discuss > p {
    margin-bottom: 2rem;
    font-size: 1.111rem;
    padding-left: 2rem;
    background: url("../../assets/img/cook/msg.png") no-repeat left center/1.523rem;
  }

  .discuss {
    padding: 1rem;
  }

  .support {
    padding: 1rem;
    border-bottom: 1px solid #efefef;
  }

  .support > ul {
    overflow: auto;
    text-overflow: clip;
    margin-top: .5rem;
  }

  .support > ul > li, .discuss-head {
    width: 2.611rem;
    height: 2.611rem;
    border-radius: 50%;
    background: url("../../assets/img/cook/cook-head.png") no-repeat center/cover;
  }

  .support > ul > li {
    margin-right: 1rem;
    float: none;
    display: inline-block;
  }

  .support > p {
    font-size: 1.111rem;
    padding-left: 2rem;
    background: url("../../assets/img/cook/zan.png") no-repeat left center/1.333rem;
  }

  .step-img >img{
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  .step-img {
    height: 18.222rem;
    overflow: hidden;
  }


  .stepList >i{
    padding-bottom: .5rem;
  }
  .stepList >p{
    width: 24rem;
    white-space: normal;
    padding-left: 1rem;
    padding-bottom: .5rem;
  }

  .method > div {
    margin-bottom: .5rem;
  }

  .method > div > div {
    float: left;
    width: 25rem;
    white-space: normal;
    padding-left: 2rem;
  }

  .method > div > i {
    float: left;
    padding-left: 1rem;
  }

  .method {
    font-size: 1.2rem;
    padding: 1rem 0;
  }

  h3 {
    text-align: center;
    font-size: 1.667rem;
    line-height: 3rem;
    /*background-color: #efefef;*/
  }

  .video-list {
    padding: 0 1rem;
  }

  .video-li > i {
    display: block;
    width: 6.111rem;
    height: 4.667rem;
    background: url("../../assets/img/cook/bofang.png") no-repeat center/2.056rem;
  }

  .video-li {
    background-color: #efefef;
    width: 6.111rem;
    height: 4.667rem;
    margin-right: .5rem
  }

  .live-menu > p {
    position: absolute;
    text-align: center;
    padding-top: .6rem;
    left: 0;
    right: 0;
    margin: auto;
  }

  .live-menu > p > i {
    margin-left: 1rem;
    vertical-align: middle;
    display: inline-block;
    width: 2.25rem;
    height: 2rem;
    background: url("../../assets/img/cookRecommend/live.png") no-repeat center .3rem/2.25rem;
  }

  .live-menu >img{
    position: absolute;
    width:100%;
    height: 100%;
    object-fit: cover;
  }
  .live-menu {
    position: relative;
    margin-top: 1rem;
    width: 12.889rem;
    height: 5.194rem;
    background-color: #efefef;
    bottom: 0
  }

  .menu-head > div {
    /*height: 18.611rem;*/
  }

  .big-img >img{
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  .big-img {
    width: 100%;
    height: 21.611rem;
    background: url("../../assets/img/cook/menuimg1.png") no-repeat center / 14.167rem;
  }

  .head-text {
    /*padding-left: 1rem;*/
    padding-top:.6rem
  }
  .live-menu{
    margin-left: 1rem;
  }
  .head-text >p> a.on {
    color: #008842;
    background-color: #fff;
  }
  .head-text >p> a {
    color: #fff;
    border-radius: 10rem;
    padding: .1rem 1rem;
    border: 1px solid #008842;
    margin-top: .5rem;
    display: inline-block;
    right:1rem;
    top:0;
    background-color: #008842;
  }

  .head-text > p >b{
    position: absolute;
    display: block;
    width:5rem;
    height:5rem;
    border-radius: 50%;
    overflow: hidden;
    top:-2.3rem;
    left:1rem;
  }
  .head-text > p {
    white-space: normal;
    /*margin-top: 1rem;*/
    /*padding-bottom: .5rem;*/
    line-height:2rem;
    font-size: 1.2rem;
    padding-left: 1rem;
  }

  .head-text > p > span {
    width: 76%;
    float: left;
  }

  .head-text > p > label, .discuss-detail > p > i > span > i {
    display: inline-block;
    width: .972rem;
    height: .972rem;
    background: url("../../assets/img/me/star.png") no-repeat center center /.972rem;
  }
</style>
