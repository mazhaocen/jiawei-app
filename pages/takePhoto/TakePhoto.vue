<template>
  <div class="take-photo">
    <!--<div class="top">-->
      <!--<span class="fl">闪光灯</span>-->
      <!--<span class="fr">换摄像头</span>-->
    <!--</div>-->
    <div v-if="imagePath" :style="{width:width+'px',height:height+'px'}"><img :src="imagePath" alt=""></div>
    <div class="bottom">
      <div>
        <span class="cancel" @click="cancel">取消</span>
        <div class="takeKey" @click="takePhoto"></div>
        <span v-if="imagePath" class="sure" @click="sure">确定</span>
      </div>
    </div>
  </div>
</template>

<script>

  export default {
    name: 'takePhoto',
    data () {
      return {
        takeTime: new Date().getTime(),
        width: window.screen.width,
        height: window.screen.height - 125,
        imagePath: ''
      }
    },
    created(){
      this.openCamera()

    },
    methods: {
      openCamera () {
        var FNPhotograph = api.require('FNPhotograph');
        FNPhotograph.openCameraView({
          rect: {
            x: 0,
            y: 45,
            w: this.width,
            h: this.height
          },
          orientation: 'portrait',
//          fixedOn: api.frameName,
          fixed: true
        }, (ret) => {
          alert(JSON.stringify(ret));
        });
      },
      takePhoto(){
        var FNPhotograph = api.require('FNPhotograph');
        FNPhotograph.takePhoto({
          quality: 'medium',
          path: 'fs://FNPhotograph/head' + this.takeTime,
          album: true
        }, (ret) => {
          this.imagePath = ret.imagePath
          this.closeCameraView()
        });
      },
      cancel() {
        if (this.imagePath) {
          this.imagePath = ''
          this.openCamera()
        } else {
          this.closeCameraView()
          history.go(-1)
        }
      },
      sure(){
        sessionStorage.setItem('takePhotoUrl', this.imagePath)
        this.closeCameraView()
        history.go(-1)
      },
      closeCameraView(){
        var FNPhotograph = api.require('FNPhotograph');
        FNPhotograph.closeCameraView(
          function (ret) {
            if (ret) {

            }
          });
      }

    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .take-photo .top > span {
    display: block;
    line-height: 45px;
    margin: 0 15px;
  }

  .take-photo .bottom > div > .takeKey {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    background-color: #fff;
    margin: auto;
  }

  .take-photo .bottom > div > span.sure {
    right: 15px;
    top: 0;
  }

  .take-photo .bottom > div > span {
    position: absolute;
    height: 50px;
    display: block;
    line-height: 50px;
  }

  .take-photo .bottom > div > span.cancel {
    left: 15px;
  }

  .take-photo .bottom > div {
    height: 60px;
    width: 100%;
    position: relative;
    margin-top: 20px;
  }

  .take-photo .bottom {
    background-color: #000;
    color: #fff;
    height: 80px;
    width: 100%;
    position: fixed;
    bottom: 0;
  }

  .take-photo .top {
    background-color: #000;
    color: #fff;
    height: 45px;
    width: 100%;
  }
</style>
