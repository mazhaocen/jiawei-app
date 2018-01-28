<template>
  <div class="image-clip">
    <!--<div class="top">-->
      <!--<span class="fl">闪光灯</span>-->
      <!--<span class="fr">换摄像头</span>-->
    <!--</div>-->
    <!--<div v-if="imagePath" :style="{width:width+'px',height:height+'px'}"><img :src="imagePath" alt=""></div>-->
    <div class="bottom">
      <div>
        <span class="cancel" @click="imgCancel">取消</span><span class="reset" @click="imgReset">重置</span><span class="sure" @click="imgSave">确定</span>
      </div>
    </div>
  </div>
</template>

<script>

  export default {
    name: 'imageClip',
    data () {
      return {
        takeTime: new Date().getTime(),
        imagePath: '',
        clipShow:true
      }
    },
    created(){
      window.page = 'imageClip'
        let FNImageClip = api.require('FNImageClip');
        FNImageClip.open({
          rect: {
            x:0,
            y:0,
            w: api.winWidth,
            h: api.winHeight-50
          },
          srcPath: this.imgUrl,//源图片路径，要求本地路径（fs://、widget://）
          highDefinition:false, //(可选项）截图时是否截取与原图分辨率一致的图 默认：false
          style:{
            mask: 'rgba(255,255,255,0.5)',                        //（可选项）字符串类型；图片裁剪控件遮罩层背景，支持 rgb，rgba，#；默认：#888
            clip: {
              w: api.winWidth,                                    //（可选项）数字类型；裁剪区域的宽度，当 appearance 为 circular 时，w 为半径；默认：rect.w / 2
              h: api.winWidth*this.ratio,                         //（可选项）数字类型；裁剪区域的高度，当 appearance 为 circular 时，h 无效；默认：w
              x: 0,                                               //（可选项）数字类型；裁剪区域左侧相对于裁剪控件左侧的距离；默认：(rect.w - w) / 2
              y: (api.winHeight-50-(api.winWidth*this.ratio))/2,  //（可选项）数字类型；裁剪区域顶部相对于裁剪控件顶部的距离；默认：(rect.h - h) / 2
//              borderColor: '#0f0',           //（可选项）字符串类型；裁剪区域边线颜色，支持 rgb，rgba，#；默认：透明
//              borderWidth: 1,                //（可选项）数字类型；裁剪区域边线；默认：0
//              appearance: 'circular',        //（可选项）字符串类型；裁剪区域的形状，支持 circular | rectangle；默认：rectangle
            }
          },
          mode:'image', //裁剪模式
          fixedOn: api.frameName
        }, (ret, err)=> {
          if (ret) {
//            alert(JSON.stringify(ret));
          } else {
//            alert(JSON.stringify(err));
          }
        });
    },
    props:{
      imgUrl:String,
      ratio:{
        type:Number,
        default:1
      }},
    methods: {
      imgCancel() {
        let FNImageClip = api.require('FNImageClip');
        FNImageClip.close();
        this.$emit('clipImage','')
      },
      imgSave(){
        let FNImageClip = api.require('FNImageClip');
        FNImageClip.save({
          destPath: 'fs://imageClip/'+this.takeTime+'.png',
          copyToAlbum: false,
          quality: 1
        }, (ret, err)=> {
          if (ret) {
            this.$emit('clipImage',ret.destPath)
            FNImageClip.close();
          } else {
          }
        });
      },
      imgReset(){
        let FNImageClip = api.require('FNImageClip');
        FNImageClip.reset();
      }
    },
    mounted(){
      api.addEventListener({
        name: 'keyback'
      }, (ret) =>{

        if (ret) {
          let  arr = ['index','myShop'];
          if(arr.indexOf(window.page)!==-1) {
            api.toLauncher();
          }else if(window.page==='imageClip'){
            let FNImageClip = api.require('FNImageClip');
            FNImageClip.close();
            this.$emit('clipImage','')
          } else{
            history.go(-1)
          }
        }
      });
    },
    destroyed () {
      window.page = ''
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .image-clip .bottom .sure{float: right;border-left:1px solid #ffffff;}

  .image-clip .bottom .cancel{float: left;border-right:1px solid #ffffff;}

  .image-clip .bottom span{width: 33.333%;text-align: center;font-size: 1.1rem;display: inline-block;-webkit-box-sizing:
    border-box;-moz-box-sizing: border-box;box-sizing: border-box;  }

  .image-clip .bottom{background-color: #008842;height: 50px;color: #fff;line-height: 50px;position: fixed;bottom:0;width: 100%;}
</style>
