<template>
  <!--<mt-popup v-model="popupVisible" position="bottom" style="width: 100%;height: 100%">-->
  <div class="upInformation">
    <el-header title="上传资讯">
      <a class="cancel" @click="cancelCrated">取消</a>
    </el-header>
    <section class="content" style="padding-bottom: 0">
      <div class="title">
        <p>标题:</p>
        <p><input type="text" placeholder="输入资讯标题" v-model="title"></p>
      </div>
      <div class="text">
        <p class="cl"><span class="fl">内容</span>
          <i class="fr" @click="pictureSource = true" >添加图片

            <!--<input type="file" accept="image/*" name="img" @change="changeFile($event)">-->
          </i>
        </p>
        <div class="imgDiv" v-if="imgUrl">
          <img v-lazy="imgUrl" alt="">
          <!--<mt-progress :value="precent" :bar-height="5"></mt-progress>-->
        </div>

        <textarea v-model="content"></textarea>
      </div>
      <div class="send-btn" @click="onSave" v-if="!infoId">发布资讯</div>
      <div class="send-btn" @click="onUpData" v-if="infoId">保存资讯</div>
    </section>

    <mt-actionsheet :actions="actions" v-model="pictureSource"></mt-actionsheet>
    <image-clip class="the-top" v-if="imageClip" :imgUrl="fsImgUrl" v-on:clipImage='resultImage' :ratio="0.653"></image-clip>
  </div>
  <!--</mt-popup>-->

</template>

<script>
  import Header from '@/components/Head'
  //  import axios from 'axios'
  import {Popup, Checklist, MessageBox, Toast, Actionsheet, Indicator,Progress} from 'mint-ui';
  import {informationUploadImg} from '@/service/service'
  import ImageClip from '@/pages/takePhoto/ImageClip'
  export default {
    name: 'upInformation',
    data () {
      return {
        popupVisible: true,
        imgUrl: '',
        title: '',
        content: '',
        fsImgUrl: '',
        imageClip: false,
        pictureSource: false,//图片来源选择项 显示
        actions: [{
          name: '拍照',
          method: this.openCamera
        }, {
          name: '在相册中选择',
          method: this.openAlbum
        }],
        precent:0
      }
    },
    components: {
      'el-header': Header,
      'mt-popup': Popup,
      'image-clip': ImageClip,
      'mt-actionsheet': Actionsheet,
      'mt-progress':Progress
    },
    created(){
      this.infoId = this.$route.params.id;
      if (this.infoId) {
        this.getInformationData()
      }
      window.page='upInformation'
     
    },
    destroyed () {
      window.page = ''
    },
    methods: {
      changeFile(e){
        this.G.fileToBase64(e).then(res => {
          this.G.getBlobBydataURI(res).then(ret => {
            console.log(ret)
            this.onSave(ret)
          })
        })
      },
      cancelCrated(){
        api.confirm({
          title: '提示',
          msg: '如果取消，创建或修改的信息将不被保存',
          buttons: ['确定', '取消']
        }, function (ret, err) {
          console.log(JSON.stringify(ret))
          if (ret.buttonIndex == 1) {
            window.isGoBack = true;
            history.go(-1)
          }
        });
      },
      onSave(ret){  //保存  上传图片->上传数据
        Indicator.open('数据上传中...')
        let config = {//添加请求头
          headers: {'Content-Type': 'multipart/form-data'}
         /* onUploadProgress:(event)=> {
//              console.log(event)
              if(event.lengthComputable){
                let loaded = event.loaded,
                  total = event.total;
//                console.log((loaded/total) * 100);
                this.$nextTick(() =>{
                    this.precent = parseInt((loaded/total) * 100)
//                  console.log((loaded/total) * 100);
                })
              }
            }*/
        };
          this.$http.post(this.API.info_uploadImg,this.formData,config).then(res => {//上传图片
            console.log('上传成功 返回的图片路径：' + JSON.stringify(res.data));
            if (res.data.status === 1) {
              if (this.infoId) { //有 id 更新资讯
                console.log('这是更新资讯数据')
                this.saveUpData(res.data.data)
              } else {  //没有 id 添加新的资讯
                console.log('这是发布资讯数据')
                this.addInfo(res.data.data)
              }
            }
          }).catch(err => {
            console.log('报错了')
            Indicator.close();
            console.log( JSON.stringify(err))
          })
      },
      onUpData(){//修改后保存资讯
        if (this.base64Url) {
            console.log('需改图片了')
          this.onSave()
        } else {
          console.log('没有需改图片')
          Indicator.open('数据上传中...');
          this.saveUpData('')
        }
      },
      saveUpData(img){
        this.$http.post(this.API.updateInfo, {
          id: this.infoId,
          title: this.title,
          img: img,
          content: this.content
        }).then(res => {
          Indicator.close();
          let msg = '';
          if (res.data.status === 1) {
            msg = '修改成功！';
            this.G.goBack()
          } else {
            msg = res.data.message
          }
          Toast({message: msg});
        })
      },
      addInfo(img){//添加资讯数据
        this.$http.post(this.API.addInfo, {
          title: this.title,
          img: img,
          content: this.content
        }).then(res => {
          Indicator.close();
          let msg = '';
          if (res.data.status === 1) {
            msg = '上传成功！';
            this.G.goBack()
          } else {
            msg = res.data.message
          }
          Toast({message: msg});
          console.log(JSON.stringify(res.data));
        }).catch(err => {
          Indicator.close()
          console.log(err)
        })
      },
      openCamera () { //拍照
        this.G.getPicture('camera', this).then(res=>{
          this.fsImgUrl = res
          this.imageClip = true
        })
      },
      openAlbum () { // 相册
        this.G.getPicture('album', this).then(res=>{
            this.fsImgUrl = res
          this.imageClip = true
        })
      },
      resultImage(url){  //裁剪后的图片路径
        if(url){
          //getBase64Image(url,ratio)将路径下的图片转换成 base64
          this.G.getBase64Image(url,0.653).then(res => {//传参 url图片路径 ，第二个参为 图片的比例 高/宽
            this.base64Url = res;
            this.imgUrl = url;
            //getBlobBydataURI(base64) 将 base64 格式图片 转换成 blob file文件
            this.G.getBlobBydataURI(this.base64Url).then(res => {
              this.formData = new FormData();
              this.formData.append('img', res, "img_" + Date.parse(new Date()) + ".jpg");
              alert('图片大小：'+res.size/1024+'kb')
            })
          });
        }
        this.imageClip = false;
      },
      getInformationData(){//进入 编辑资讯时获取数据
        Indicator.open('数据加载中...');
        this.$http.post(this.API.infoDetail, {
          id: this.infoId
        }).then(res => {
          this.data = res.data.data;
          this.content = this.data.content;
          this.title = this.data.title;
          this.imgUrl = this.data.img;
          Indicator.close()
        })
      }

    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .send-btn {width: 100%;background-color: #008842;color: #fff;font-size: 1.667rem;text-align: center;line-height: 4rem;margin-top: 2rem}

  .text {margin-top: 3rem;}

  .text textarea {margin-top: 1rem;border: 1px solid #efefef;width: 100%;height: 16rem;display: block;white-space: normal;text-indent: 2em}

  .text > p > i > input {position: absolute;opacity: 0;left: 0;}

  /*.text > .imgDiv>img {width: 100%;height:100% ;object-fit: cover;}*/
  .text > .imgDiv {width: 28rem;height:18.273rem;background-color: #efefef;margin-top: 1rem;
    border:1px solid #efefef;}
  .text > .imgDiv>img{
    width: 100%;
    height:100%;
    object-fit: cover;
  }
  .text > p > i {overflow: hidden;color: #008842;position: relative}

  .title {margin-top: 3rem;}

  .title input {font-size: 1.667rem;width: 100%;border-bottom: 1px solid #efefef;margin-top: 1rem;}

  .cancel {font-size: 1.333rem;padding-left: 1rem;}

  .upInformation section {padding-left: 1rem;padding-right: 1rem;}
</style>
