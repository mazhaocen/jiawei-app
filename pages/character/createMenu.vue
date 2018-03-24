<template>
  <div class="createMenu">
    <el-header title="创建菜谱">
      <a class="cancel" @click="cancelCrated">取消</a>
      <!--<a href="" class="pa" style="right: 0;font-size: 1.333rem;color:#008842;">发布</a>-->
    </el-header>
    <section class="content" style="padding-bottom: 0">
      <div style="padding-left:1rem;padding-right:1rem;">
        <div class="head-img" data-bil=".653" @click="addImg(0.653,'coverImg')">
          <i style="padding-top: 2rem">+</i>
          <span style="font-size: 1.4rem">添加菜谱封面</span>
          <img :src="menuData.coverImg" alt="">
        </div>
        <div class="title">
          <p><input type="text" placeholder="输入菜谱名称" v-model="menuData.name"></p>
        </div>
        <div class="food">
          <h3>用料</h3>
          <h4>主料：<input type="text" v-model="menuData.mainMaterial" placeholder="请添加主料"></h4>
          <p>可用到: <span><i v-for="m in mainMaterialList" @click="chooseMainMaterial(m)" :class="{'on':menuData.mainMaterial.indexOf(m)!=-1}">{{m}}</i></span></p>
          <h4>辅料：<input type="text" placeholder="请添加辅材" v-model="menuData.auxiliaryMaterial"></h4>
          <p>可用到: <span><i v-for="i in auxiliaryMaterialList" @click="chooseAuxiliaryMaterial(i)" :class="{'on':menuData.auxiliaryMaterial.indexOf(i)!=-1}">{{i}}</i></span></p>
          <h3>做法</h3>
          <h4 v-for="(step,index) in menuData.stepList">
            <span>步骤{{index + 1}}</span><span class="fr" style="font-weight: normal;color: #ff5956;width: 3rem" v-if="menuData.stepList.length>=3" @click="delStep(index,step)">删除</span>
            <!--<i @click="addImg(0.6,index)"></i>-->
            <p @click="addImg(0.572,index)">
              <i>+</i>
              <span>添加步骤图片</span>
              <img :src="step.stepImg" alt="">
            </p>
            <edit-div v-model="step.stepDesc" placeholder="添加步骤详情"></edit-div>
          </h4>
        </div>
        <div class="add-btn">
          <p @click="addStep">增加步骤</p>
          <h4 class="cl">小建议：
            <!--<input type="text" style="width: 80%">-->
            <edit-div v-model="menuData.tip" placeholder="添加一些小建议" style="width: 80%" class="fr"></edit-div>
          </h4>
        </div>
        <div class="menu-type">
          <!--<p>分类:</p>-->
          <!--<ul class="cl">-->
          <!--<li>闽菜</li>-->
          <!--<li>闽菜</li>-->
          <!--<li>闽菜</li>-->
          <!--<li>闽菜</li>-->
          <!--<li>闽菜</li>-->
          <!--<li>闽菜</li>-->
          <!--<li>闽菜</li>-->
          <!--<li>闽菜</li>-->
          <!--</ul>-->
        </div>
      </div>
      <!--<input type="file" accept="image/*" name="img" @change="changeFile($event,'coverImg')">-->

      <div class="send-btn" v-if="!this.menuId" @click="saveMenu">发布菜谱</div>
      <div class="send-btn" v-if="this.menuId" @click="saveMenu">保存菜谱</div>
    </section>
    <mt-actionsheet :actions="actions" v-model="pictureSource"></mt-actionsheet>
    <image-clip class="the-top" v-if="imageClip" :imgUrl="fsImgUrl" v-on:clipImage='resultImage' :ratio="ratio"></image-clip>

  </div>

</template>

<script>
  import Header from '@/components/Head'
  import {Popup, Checklist, MessageBox, Toast, Actionsheet, Indicator} from 'mint-ui';
  import ImageClip from '@/pages/takePhoto/ImageClip'
  import editDiv from '@/components/editDiv'

  export default {
    name: 'createMenu',
    data () {
      return {
        text:'aaa',
        mainMaterialList: ['鸡肉', '鸭肉', '鲤鱼', '五花肉', '大虾', '螃蟹'],
        auxiliaryMaterialList:['酱油', '盐', '味精', '辣椒', '醋', '淀粉'],
        menuData:{
          name: "",
          mainMaterial: "",
          auxiliaryMaterial: [],
          typeId: 1,
          coverImg: "",
          tip: "",
          stepList: [
            {
              stepDesc: "",
              stepImg: ""
            },
            {
              stepDesc: "",
              stepImg: ""
            }
          ]
        },
        pictureSource: false,
        ratio: 1,//图片比例  高/宽 三位小数
        imageClip: false,
        actions: [{
          name: '拍照',
          method: this.openCamera
        }, {
          name: '在相册中选择',
          method: this.openAlbum
        }],
        copySteps:''
      }
    },
    created(){
        this.menuId = this.$route.params.id
        if(this.menuId){
          this.getMenuDetailData()
        }
        window.page='createMenu'
    },
    destroyed () {
      window.page = ''
    },
    components: {
      'el-header': Header,
      'mt-popup': Popup,
      'image-clip': ImageClip,
      'mt-actionsheet': Actionsheet,
      'edit-div':editDiv
    },
    methods: {
      addImg(ratio,position){
        this.ratio = ratio;
//        this.pictureSource = true;
        this.position = position;
        this.openAlbum()
      },
      addStep(){//添加步骤
//        if(this.menuId){
//          this.menuData.stepList.push({
//            stepDesc: "",
//            stepImg: "",
//            id:this.stepId
//          })
//        }else{
          this.menuData.stepList.push({
            stepDesc: "",
            stepImg: ""
          });
//        }

      },
      delStep(index,step){
        MessageBox({
          title: '提示',
          message: '您确认删除此步骤吗？',
          showCancelButton: true
        }).then(res => {
          if (res === 'confirm') {
            this.copySteps.forEach(function (n) {
              if(n.id==step.id){
                  n.stepDesc=null;
                  n.stepImg=null
              }
            });
            this.menuData.stepList.splice(index,1)

          }
        });

      },
      cancelCrated(){
        api.confirm({
          title: '提示',
          msg: '如果取消，创建或修改的信息将不被保存',
          buttons: ['确定', '取消']
        }, function(ret, err) {
          // console.log(JSON.stringify(ret))
          if(ret.buttonIndex==1){
            window.isGoBack = true;
            history.go(-1)
          }
        });
//        MessageBox({
//          title: '提示',
//          message: '如果取消，创建或修改的信息将不被保存',
//          showCancelButton: true
//        }).then(res => {
//          if (res === 'confirm') {
//            this.G.goBack()
//          } else {
//          }
//        });
      },
      openCamera () { //拍照
        this.G.getPicture('camera', this).then(res => {
          this.fsImgUrl = res;

          this.imageClip = true
        })
      },
      openAlbum () { // 相册
        this.G.getPicture('album', this).then(res => {
          this.fsImgUrl = res;
          console.log(this.fsImgUrl)
          this.imageClip = true
        })
      },
      resultImage(url){  //裁剪后的图片路径
        if (url) {
          //getBase64Image(url,ratio)将路径下的图片转换成 base64
          this.G.getBase64Image(url, this.ratio).then(res => {//传参 url图片路径 ，第二个参为 图片的比例 高/宽
            this.imgUrl = url;
            //getBlobBydataURI(base64) 将 base64 格式图片 转换成 blob file文件
              if(this.position==='coverImg'){
                this.menuData.coverImg= res;
              }else{
                this.menuData.stepList[this.position].stepImg= res;
              }
            })
        }
        this.imageClip = false;
      },
      saveMenu(){
        if(!this.menuData.coverImg){
          Toast({message:'请添加菜谱封面图片'})
          return
        }
        if(!this.menuData.name){
          Toast({message:'请添菜谱标题'})
          return
        }
        if(!this.menuData.mainMaterial){
          Toast({message:'请添加主材料'})
          return
        }
        if(!this.menuData.auxiliaryMaterial){
          Toast({message:'请添加辅助材料'})
          return
        }
        if(!this.menuData.stepList[0].stepDesc ||!this.menuData.stepList[1].stepDesc){
          Toast({message:'请添完成至少两个步骤的内容填写'})
          return
        }
        Indicator.open('正在保存...')
        let menudata = JSON.parse(JSON.stringify(this.menuData))//复制 menuData 数据
        if(menudata.coverImg.indexOf('base64')!=-1){
          menudata.coverImg = menudata.coverImg .split(',')[1];  //将上传的 base64 前缀去掉
        }else{
          menudata.coverImg=''
        }
        for(let i=0;i<menudata.stepList.length;i++){
          if(menudata.stepList[i].stepImg.indexOf('base64')!=-1){
            menudata.stepList[i].stepImg = menudata.stepList[i].stepImg.split(',')[1]
          }else{
            menudata.stepList[i].stepImg=''
          }
        }
//        console.log();
        if(typeof menudata.auxiliaryMaterial=='string'){
          menudata.auxiliaryMaterial = menudata.auxiliaryMaterial.split(',').join(',')
        }else {
          menudata.auxiliaryMaterial = menudata.auxiliaryMaterial.join(',')
        }

//        this.copyMenuData.stepList = menudata.auxiliaryMaterial.join(',')
        // console.log(JSON.stringify(menudata));
//        console.log(menudata)
//        return
        if(this.menuId){//保存编辑的菜谱
          let that = this
          menudata.stepList.forEach(function (n,i) {
              if(!n.id){
                that.copySteps.push(n)
              }
            that.copySteps.forEach(function (m) {
              if(n.id===m.id){
                m.stepImg=n.stepImg
                m.stepDesc = n.stepDesc
              }
            })
          });
          menudata.stepList = this.copySteps

//          Indicator.close()
          this.$http.post(this.API.menu_update,menudata).then(res=>{
            // console.log(JSON.stringify(res.data))
            if (res.data.status === 1) {
              let msg = '';
              if (res.data.status === 1) {
                msg = '保存成功！';
                this.G.goBack()
              } else {
                msg = res.data.message
              }
              Toast({message: msg});
            }
            Indicator.close()
          }).catch(err=>{

          })
        }else{//保存新增的菜谱
          this.$http.post(this.API.menu_add,menudata).then(res=>{
//            // console.log(JSON.stringify(res.data))
            if (res.data.status === 1) {
              let msg = '';
              if (res.data.status === 1) {
                msg = '发布成功！';
                this.toBeCooker()
                this.G.goBack()
              } else {
                msg = res.data.message
              }
              Toast({message: msg});
            }
            Indicator.close()
          }).catch(err=>{
            // console.log(JSON.stringify(err))
            Indicator.close();
            Toast({message: '失败'});
          })
        }

      },
      goToCooker(){
        this.$router.push({name: 'Cooker'})
      },
      chooseMainMaterial(m){//选择主要材料
        this.menuData.mainMaterial = m
      },
      chooseAuxiliaryMaterial(i){
          if(Object.prototype.toString.call(this.menuData.auxiliaryMaterial)!="[object Array]"){
              if(this.menuData.auxiliaryMaterial){
                this.menuData.auxiliaryMaterial= this.menuData.auxiliaryMaterial.split(',')
              }else{
                this.menuData.auxiliaryMaterial=[]
              }

          }
        let has = false,that=this;
        this.menuData.auxiliaryMaterial.forEach(function (n,o) {
          if (n == i) {
            that.menuData.auxiliaryMaterial.splice(o,1)
            has = true
          }
        });
        if (!has) {
          this.menuData.auxiliaryMaterial.push(i)
        }
      },
      toBeCooker(){
        this.$http.post(this.API.toBe_cooker,{}).then(res=>{
            // console.log(res.data)
        }).catch(err=>{
            // console.log(err)
        })
      },
      getMenuDetailData(){//编辑菜谱获取菜谱详情
        Indicator.open()
          this.$http.post(this.API.menu_detail,{id:this.menuId}).then(res=>{
              // console.log(res.data)
            this.menuData = res.data.data
            this.menuData.auxiliaryMaterial = this.menuData.auxiliaryMaterial.split(',')
            this.copySteps = JSON.parse(JSON.stringify(res.data.data.stepList))
            Indicator.close()
          }).catch(err=>{
              // console.log(err)
            Indicator.close()
          })
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .menu-type > ul > li {
    background-color: #e6e6e6;
    padding: .5rem 1rem;
    margin-right: .5rem;
    margin-top: .5rem;
  }

  .menu-type {
    margin-top: 1.5rem;
    margin-bottom: 1rem;

  }

  .menu-type > p {
    font-size: 1.333rem;
  }

  .add-btn > p {
    font-size: 1.1rem;
    color: #008842;
  }

  .add-btn {
    margin-top: 2rem;

  }

  .food > p {
    white-space: normal;
    margin-top: .5rem;
  }

  .food span {
    vertical-align: top;
    display: inline-block;
    width: 24rem;
  }

  .food span > i.on {
    background-color: #008842;
    color: #fff;
  }
  .food span > i {
    margin-bottom: .5rem;
    display: inline-block;
    vertical-align: middle;
    background-color: #e6e6e6;
    padding: .5rem 1rem;
    margin-right: .5rem;
  }

  .food > h4 > p >i,.head-img>i{
    display: block;
    font-size: 5rem;
    color: #999;
    margin-top: 2rem;
  }
  .food > h4 > p >span,.head-img>span{
    color: #999;
  }
  .food > h4 > p >img{
    position: absolute;
    left:0;
    top:0;
  }
  .food > h4 > p {
    position: relative;
    text-align: center;
    display: block;
    width: 28rem;
    height: 16.222rem;
    margin: .5rem auto;
    background-color: #efefef;
    overflow: hidden;
  }

  .food > h4 > i {
    display: inline-block;
    position: absolute;
    right: 0;
    width: 2.222rem;
    height: 1.639rem;
    top: 0;
    background: url("../../assets/img/cook/add-img.png") no-repeat center/100%;
  }

  .food > h4 > input, .add-btn > h4 > input {
    /*border-bottom: 1px solid #efefef;*/
    width: 85%;
    font-size: 1.3rem;
  }
  .food>h4>span{
    font-weight: bold;
  }
  .food > h4, .add-btn > h4 {
    position: relative;
    margin-top: 1rem;
    font-size: 1.333rem;
    font-weight: normal;
  }

  .food > h3 {
    margin-top: 1rem;
    font-size: 1.667rem;
    font-weight: normal;
  }

  .head-img >img{
    position: absolute;
    left:0;
    top:0;
  }
  .head-img {
    text-align: center;
    position: relative;
    height: 18.284rem;
    width: 28rem;
    background-color: #efefef;
  }

  .send-btn {
    width: 100%;
    background-color: #008842;
    color: #fff;
    font-size: 1.667rem;
    text-align: center;
    line-height: 3.66rem;
    bottom: 0;
  }

  .text {
    margin-top: 3rem;
  }

  .text textarea {
    margin-top: 1rem;
    border: 1px solid #efefef;
    width: 100%;
    height: 25rem;
  }

  .text > p > i {
    color: #008842;
  }

  .title {
    margin-top: 1rem;
  }

  .title input {
    font-size: 1.667rem;
    width: 100%;
    border-bottom: 1px solid #efefef;
    margin-top: 1rem;
  }

  .cancel {
    font-size: 1.333rem;
    padding-left: 1rem;
  }
</style>
