<template>
  <div class="menu">
    <el-header className="go_back" :title="title">
      <span v-if="!del && active!='myInfo'" class="pa edit" @click="del=true">编辑</span>
      <span v-if="del" class="pa edit" @click="del=false">取消</span>
    </el-header>
    <section class="content" style="padding-bottom: 0">
      <div class="my-info">
        <div class="head-img"><img :src="userInfo.img" alt=""></div>
        <p>{{userInfo.name}}</p>
        <h3>星级：<i></i></h3>
        <span>地址：{{userInfo.livingPlaceProvince}}{{userInfo.livingPlaceCity}}{{userInfo.livingPlaceArea}}{{userInfo.livingPlaceAddress}}</span>
      </div>
      <ul class="menu-type cl">
        <li @click="toShow('meCreateMenu')" :class="{on:active=='meCreateMenu'}">我发菜谱</li>
        <li @click="toShow('meSeenMenu')" :class="{on:active=='meSeenMenu'}">我发资讯</li>
        <li @click="toShow('meCollectMenu')" :class="{on:active=='meCollectMenu'}">收藏菜譜</li>
        <li @click="toShow('myInfo')" :class="{on:active=='myInfo'}">我的资料</li>
      </ul>
      <mt-tab-container v-model="active" :swipeable="false">
        <!--我创建的菜谱列表-->
        <mt-tab-container-item id="meCreateMenu">
          <div class="menu-list cl">
            <div class="cl">
              <div class="fl pr" v-for="(i,index) in myCreateMenuList" :style="[index%2?{float:'right'}:'']" @click="goToMenuDetail(i.id)">
                <!--<span v-if="del" class="pa infoEdit" @click.stop="editInfo(i.id)">编辑</span>-->
                <!--<span v-if="del" class="pa delete" @click.stop="deleteMenu(index)">×</span>-->
                <div class="menu-img">
                  <span v-if="del" class="pa infoEdit" @click.stop="editMenu(i.id)">编辑</span>
                  <span v-if="del" class="pa infoDelete" @click.stop="deleteMenu(i,index)">删除</span>
                  <img v-lazy="i.coverImg">
                </div>
                <h3>{{i.name}}</h3>
                <p>{{i.creater}}</p>
              </div>
            </div>

            <p><button @click="editMenu('')" v-if="!myCreateMenuList.length">创建菜谱</button></p>
          </div>
        </mt-tab-container-item>
        <!--我发的资讯列表-->
        <mt-tab-container-item id="meSeenMenu">
          <div class="menu-list cl">
            <div class="cl">
              <div class="fl pr" v-for="(i,index) in myInfoList" :style="[index%2?{float:'right'}:'']" @click="goToInfoDetail(i.id)">
                <div class="menu-img pr">
                  <span v-if="del" class="pa infoEdit" @click.stop="editInfo(i.id)">编辑</span>
                  <span v-if="del" class="pa infoDelete" @click.stop="deleteInfo(i,index)">删除</span>
                  <img v-lazy="i.img">
                </div>
                <h3>{{i.title}}</h3>
                <p>{{i.operatetime}}</p>
              </div>
            </div>
           <p><button @click="editInfo('')">发布资讯</button></p>
          </div>
        </mt-tab-container-item>
        <!--我收藏的菜谱列表-->
        <mt-tab-container-item id="meCollectMenu">
          <div class="menu-list cl">
            <div class="fl pr" v-for="(i,index) in myCollectMenuList" :style="[index%2?{float:'right'}:'']" @click="goToMenuDetail(i.id)">
              <span v-if="del" class="pa delete" @click.stop="deleteCollectMenu(i,index)">×</span>
              <div class="menu-img"><img v-lazy="i.img"></div>
              <h3>{{i.name}}</h3>
              <p>{{i.operatetime}}</p>
            </div>
            <p><button @click="goToCharacter" v-if="!myCollectMenuList.length">前往浏览菜谱</button></p>
          </div>
        </mt-tab-container-item>
        <mt-tab-container-item id="myInfo">
          <div class="info">
            <p><i>昵称</i> <span>{{userInfo.name}}</span></p>
            <!--<p><i>地区</i> <span>{{userInfo.}}</span></p>-->
            <p><i>个性签名</i> <span>{{userInfo.signature}}</span></p>
            <p style="border-top:1px solid #efefef;padding-top: 1rem"><i>故乡</i> <span>{{userInfo.hometownProvince}} {{userInfo.hometownCity}}</span></p>
            <p style="border-bottom:1px solid #efefef"><i>现居</i> <span>{{userInfo.livingPlaceProvince}} {{userInfo.livingPlaceCity}}</span></p>
            <p style="padding-top: 1.2rem"><i>我的经历</i> <span>{{userInfo.experience}}</span></p>
          </div>
        </mt-tab-container-item>
      </mt-tab-container>

    </section>
  </div>
</template>

<script>
  import Header from '@/components/Head'
  import {Popup, Checklist, MessageBox, Toast, Actionsheet, Indicator, TabContainerItem, TabContainer} from 'mint-ui';
  export default {
    name: 'menu',
    data () {
      return {
        title: '',
        del: false,
        active: 'myInfo',
        myInfoList: [],
        myCreateMenuList:[],
        myCollectMenuList:[],
        userInfo:''
      }
    },
    created(){
      this.userInfo=JSON.parse(localStorage.getItem('userInfo'))
      let name = sessionStorage.getItem('menuName')
      this.active = name ? name : sessionStorage.getItem('menuName')
      switch (this.active) {
        case'meSeenMenu':
          this.meSeenMenu();
          break;
        case'meCreateMenu':
          this.meCreateMenu();
          break;
        case'meCollectMenu':
          this.meCollectMenu();
          break;
      }
    },
    components: {
      'el-header': Header,
      'mt-tab-container-item':TabContainerItem,
      'mt-tab-container':TabContainer

    },
    methods: {
      toShow(name){
        sessionStorage.setItem('menuName', name);
        this.active = name;
        this.del = false
        switch (name) {
          case'meSeenMenu':
            this.meSeenMenu();
            break;
          case'meCreateMenu':
            this.meCreateMenu();
            break;
          case'meCollectMenu':
            this.meCollectMenu();
            break;
        }
      },
      goToMenuDetail(id){//查看我创建的菜谱详情
        this.$router.push({name: 'cookMenuDetail', params: {id: id,type:2}})
      },
      editMenu(id){//编辑我创建的菜谱
        this.$router.push({name: 'createMenu', params: {id: id}})
      },
      goToInfoDetail(id){//查看资讯详情
        this.$router.push({name: 'informationDetail', params: {id: id,type:1}})
      },
      editInfo(id){//编辑资讯详情
        this.$router.push({name: 'upInformation', params: {id: id}})
      },
      goToCharacter(){//看菜谱
        this.$router.push({name: 'character'})
      },
      meSeenMenu(){
        Indicator.open()
        this.$http.post(this.API.myInfoList, {}).then(res => {
          console.log(res.data.data.data)
          this.myInfoList = res.data.data.data
          Indicator.close()
        }).catch(err => {
          Indicator.close()
        })
      },
      meCreateMenu(){
          Indicator.open()
        this.$http.post(this.API.menu_myOnlineCookbooks, {
          currentPage:'1',
          pageSize:'10'
        }).then(res => {
          console.log(res.data.data.data);
          this.myCreateMenuList = res.data.data.data
          Indicator.close()
        }).catch(err => {
          Indicator.close()
        })
      },
      meCollectMenu(){
        Indicator.open()
        this.$http.post(this.API.myCollect, {
          menuId:'2',
          currentPage:'1',
          pageSize:'10'
        }).then(res => {
          console.log(res.data.data.data);
          this.myCollectMenuList = res.data.data.data
          Indicator.close()
        }).catch(err => {
          Indicator.close()
        })
      },
      deleteInfo(info,index){
        MessageBox({
          title: '提示',
          message: '您确定删除选择的资讯吗',
          showCancelButton: true
        }).then(res => {
          if (res === 'confirm') {
            Indicator.open()
            this.$http.post(this.API.info_delete,{
              id:info.id
            }).then(res=>{
              if(res.data.status==1){
                this.myInfoList.splice(index,1)
                console.log(res.data)
                Toast({message: '删除成功！'});
                Indicator.close()
              }
            })
          } else {
          }
        });

      },
      deleteMenu(menu,index){
        MessageBox({
          title: '提示',
          message: '您确定删除选择的菜谱吗？',
          showCancelButton: true
        }).then(res => {
          if (res === 'confirm') {
            Indicator.open()
            this.$http.post(this.API.menu_delete,{
              id:menu.id
            }).then(res=>{
              if(res.data.status==1){
                this.myCreateMenuList.splice(index,1)
                console.log(res.data)
                Toast({message: '删除成功！'});
                Indicator.close()
              }
            })
          } else {
          }
        });

      },
      deleteCollectMenu(menu,index){
        MessageBox({
          title: '提示',
          message: '您确定删除选择收藏的菜谱吗？',
          showCancelButton: true
        }).then(res => {
          if (res === 'confirm') {
            Indicator.open()
            this.$http.post(this.API.cancelCollect,{
              menuId:'2',
              collectId:menu.id
            }).then(res=>{
              if(res.data.status==1){
                this.myCollectMenuList.splice(index,1);
                Toast({message: '删除成功！'});
                console.log(res.data)
              }
              Indicator.close()
            })
          } else {
          }
        });

      },
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .edit {
    right: 1rem;
    font-size: 1.2rem;
  }

  .delete {
    right: -.2rem;
    z-index: 200;
    font-size: 1.8rem;
    color: #fff;
    top: -.3rem;
    display: block;
    width: 1.5rem;
    height: 1.5rem;
    text-align: center;
    line-height: 1.2rem;
    border-radius: 50%;
    border: 1px solid red;
    background-color: rgb(255, 0, 0);
  }

  .menu-img > span {
    z-index: 200;
    font-size: 1.1rem;
    color: #fff;
    top: 0;
    display: block;
    width: 50%;
    text-align: center;
    line-height: 1.5rem;
  }

  .infoDelete {
    right: 0;
    background-color: rgb(255, 0, 0);
  }

  .infoEdit {
    left: 0;
    background-color: #008842;
  }

  .info {
    padding: 1rem 1.5rem;
  }

  .info > p {
    padding: .5rem 0;
  }

  .info > p > span {
    font-size: 1.333rem;
    color: #000;
    white-space: normal;
    width: 80%;
    display: inline-block;
  }

  .info > p > i {
    font-size: 1.1rem;
    vertical-align: top;
    color: #bbbbbb;
    width: 5rem;
    display: inline-block;
  }

  .menu-list > div > h3 {
    font-size: 1rem;
    margin-top: .5rem;
    line-height: 1.7rem;
    overflow: hidden;

  }

  .menu-list > div {
    padding-bottom: .5rem;
    text-align: left;
    width: 14.056rem;
  }

  .menu-list>p>button {
    width: 10rem;
    height: 3.6rem;
    background-color: #fff;
    color: #008842;
    text-align: center;
    border:1px solid #008842;
    margin:2rem auto;
    font-size: 1.2rem;
  }
  .menu-list {
    text-align: center;
    padding: .5rem;
  }

  .menu-img >img{
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  .menu-img {
    width: 14.056rem;
    height: 8.684rem;
    background-color: #efefef;
    overflow: hidden;
  }

  .menu-type > li.on {
    border-bottom: 3px solid #008842;
    color: #000;
    font-weight: bold;
  }

  .menu-type {
    margin-top: .6rem;
    border-bottom: 1px solid #efefef;
    border-top: 1px solid #efefef;
  }

  .menu-type > li {
    width: 25%;
    text-align: center;
    padding: 1rem 0;
    font-size: 1.2rem;
    color: #999;
    letter-spacing: 1px;
  }

  .my-info {
    width: 50%;
    margin: 4rem auto 0;
  }

  .my-info > p {
    text-align: center;
    padding: .5rem 0;
  }

  .my-info > h3 {
    font-size: 1rem;
    font-weight: 400;
  }

  .my-info > h3 > i {
    display: inline-block;
    width: .972rem;
    height: .972rem;
    background: url("../../assets/img/me/star.png") no-repeat center center /.972rem;
  }

  .head-img {
    width: 6.389rem;
    height: 6.389rem;
    border-radius: 50%;
    overflow: hidden;
    margin: auto;
    background-color: #efefef;
  }
</style>
