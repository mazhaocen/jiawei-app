<template>
  <div class="beginLive">
    <el-header title="直播" className="go_back"></el-header>
    <section class="content" style="padding-bottom: 0">
      <div class="live-content">
        <!--<div class="control">-->
          <!--<div>-->
            <!--<i class="checkout"></i>-->
            <!--<i class="close"></i>-->
          <!--</div>-->
        <!--</div>-->
        <div class="main-title">
          <input type="text" placeholder="填写直播主题">
        </div>
        <div class="add-img">
          <p class="add-icon"></p>
          <p>封面设置</p>
        </div>
        <div class="live-Type">
          <p>做菜直播</p>
          <p>特产直播</p>
        </div>
        <div class="live-begin">
          <p @click="setInfo">开始直播</p>
        </div>
      </div>


      <!--<div class="button">-->
        <!--<button @click="initLive">初始化直播界面</button>-->
        <!--<button @click="beginPush">开始推流</button>-->
        <!--<button @click="stopPush">停止推流</button>-->
        <!--<button @click="addPushEvent">推流监听</button><span>{{pushEvent}}</span>-->
        <!--<button @click="initPlayer">初始化播放器</button>-->
        <!--<button @click="relayPlay">准备播放</button>-->
        <!--<button @click="toPlay">播放</button>-->
        <!--<button @click="toPause">暂停</button>-->
        <!--<button @click="stopPlay">停止播放</button>-->
        <!--<button @click="addPlayEvent">播放监听</button><span>{{playEvent}}</span>-->
        <!--<button @click="getErrCode">错误码</button><span>{{errCode}}</span>-->
      <!--</div>-->
    </section>
  </div>
</template>

<script>
  import Header from '@/components/Head'
  import {Popup, Checklist, MessageBox, Toast, Actionsheet, Indicator} from 'mint-ui';
export default {
  name: 'beginLive',
  data () {
    return {
      playEvent:'',
      errCode:'',
      pushEvent:""
    }
  },
  components:{
    'el-header': Header
  },

  created(){
    this.liveInfo = JSON.parse(sessionStorage.getItem('liveInfo'))

    this.pushAuth()

  },
  methods:{
    //推流鉴权
    pushAuth(){
      this.$http.post(this.API.live_auth,{
        timestamp:this.liveInfo.timestamp,
        md5hash:this.liveInfo.md5hash,
        appName:this.liveInfo.appName,
        streamName:this.liveInfo.streamName
      }).then(res=>{
        if(res.data.status==1){
            this.getPullInfo()
        }
      })
    },
    setInfo(){
      this.$http.post('http://119.23.209.222/weirenService/app/live/set',{
        liveImg:'',
        liveTitle:'AA'
      }).then(res=>{

      })
    },
    //获取播放地址
    getPullInfo(){
      this.$http.post(this.API.live_pull_info).then(res=>{
        if(res.data.status==1){
          this.liveInfo.pullUrl = res.data.data.pullUrl
          sessionStorage.setItem('liveInfo',JSON.stringify(this.liveInfo))
          // console.log(JSON.stringify(this.liveInfo))
          api.openFrame({
            name: 'liveConfig',
            url: 'widget://html/liveConfig.html',
            rect: {
              x: 0,
              y: 0,
              w: 'auto',
              h: 'auto'
            },
            pageParam:this.liveInfo
          })
//          this.initLive()
        }
      })
    },
    initLive(){
      var aliLive = api.require('aliyunLive');
      var that = this
      aliLive.configStream({
        rect: {//视图的位置及尺寸
          x: 180,   //（可选项）数字类型；模块左上角的 x 坐标（相对于所属的 Window 或 Frame）；默认值：0
          y: 0,   //（可选项）数字类型；模块左上角的 y 坐标（相对于所属的 Window 或 Frame）；默认值：0
          w: 195,  //（可选项）数字类型；模块的宽度；默认父视图的宽度
          h: 300   //（可选项）数字类型；模块的宽度；默认父视图的高度
        },
//        url: this.liveInfo.pushUrl,//推流url
        url: 'rtmp://video-center-bj.alivecdn.com/weirenService/account_14?vhost=videolive.weirenfw.com&auth_key=1515571322-0-0-11fc7b32f5547c03c980196de8aef05f',//推流url
//        url: 'rtmp://push-videocall.aliyuncs.com/test/stream6',//推流url
        bitRate: {//（可选项）码率
          videoMaxBitRate: 1500 * 1000, //(可选项)数字类型；最大码率，默认“1500 * 1000”,网速变化的时候会根据这个值来提供建议码率
          videoMinBitRate: 400 * 1000,      //(可选项)数字类型；最小码率，默认“400 * 1000”,网速变化的时候会根据这个值来提供建议码率
          videoBitRate: 600 * 1000,         //(可选项)数字类型；当前码率，默认“600 * 1000”,在最大码率和最小码率之间
          audioBitRate: 64 * 1000          //(可选项)数字类型；音频码率，默认“64 * 1000”
        },
        fps: 20,//(可选项)帧率
        screenOrientation: 'vertical',//(可选项）屏幕方向 horizontal vertical
        reconnectTimeout: 5,//(可选项)重连超时时长  （单位:s）
        videoResolution: '240P',//(可选项)视频分辨率  取值范围：240P 360P 480P 540P 720P 1080P
        outputResolution: '240P',//输出分辨率  取值范围：240P 360P 480P 540P 720P 1080P
//        exposure:'',//曝光度（-1 或 不传表示自动曝光）取值范围：0~100
        videoPreset: '960*540',//(可选项)摄像头采集质量 960*540  1280*720
        cameraPosition: 'front',//(可选项)摄像头位置  back  front,
//        frontMirror:true,//(可选项）是否开启前置摄像头镜像(仅支持iOS)
        waterMarkImage: {//(可选项)水印图片，不添加该参数，则无水印图片
          path: '',                //字符串类型，图片的路径，支持fs://,widget://
          location: 'leftTop',            //字符串类型，图片位置，取值范围：rightTop,leftTop,leftBottom,rightBottom,默认leftTop
          maginX: 20,              //数字类型，水印图片左上角顶点的x坐标，默认20
          maginY: 20               //数字类型，水印图片左上角顶点的y坐标，默认20
        },
//        fixedOn:'scan',
        fixed: true
      }, function (ret) {
        // console.log('初始化界面：'+JSON.stringify(ret));

      });
    },
    beginPush(){
      var aliyunLive = api.require('aliyunLive');
      aliyunLive.startStream(function(ret){
        // console.log('开始推流：'+JSON.stringify(ret));
      });
    },
    stopPush(){
      var aliyunLive = api.require('aliyunLive');
      aliyunLive.stopStream(function(ret){
        // console.log('停止推流：'+JSON.stringify(ret));
      });
    },
    addPushEvent(){
        var that = this
      var aliyunLive = api.require('aliyunLive');
      aliyunLive.addConnectStatusListener(function(ret){
        // console.log('推流监听：'+JSON.stringify(ret));
        that.pushEvent = JSON.stringify(ret)
      });
    },
    initPlayer(){
      var mediaPlayer = api.require('aliyunLive');
      mediaPlayer.init({
        rect: {
          x: 180,
          y: 300,
          w: 195,
          h: 300
        },
        accessKeyId : 'LTAIxxCIEY2aYiex',
        accessKeySecret : 'LhGhxkN9ce36rPqk8ndm4AB5mi3DYR',
        businessId : 'video_live'
      }, function(ret, err) {
        if(ret){
          // console.log('初始化播放器：'+JSON.stringify(ret));
        }
      });
    },
    relayPlay(){
      var mediaPlayer = api.require('aliyunLive');
      mediaPlayer.prepareToPlay({
//        url:this.liveInfo.pullUrl
        url:'http://videolive.weirenfw.com/weirenService/account_14_hd.flv?auth_key=1515571819-0-0-5733cb232a906cfee38f368d8172a779'
//        url:'rtmp://pull-videocall.aliyuncs.com/test/stream6'
      }, function(ret, err) {
        // console.log('准备播放：'+JSON.stringify(ret));
        if(ret && ret.status){
          // console.log('准备播放：'+JSON.stringify(ret)+'===MediaPlayer Prepare Ready');
        }
      });
    },
    toPlay(){
      var mediaPlayer = api.require('aliyunLive');
      mediaPlayer.play();
    },
    toPause(){
      var mediaPlayer = api.require('aliyunLive');
      mediaPlayer.pause();
    },
    stopPlay(){
      var mediaPlayer = api.require('aliyunLive');
      mediaPlayer.stop();
    },
    addPlayEvent(){
      var that = this
      var mediaPlayer = api.require('aliyunLive');
      mediaPlayer.addEventListener(function(ret){
        // console.log('播放监听：'+JSON.stringify(ret));
        that.playEvent = JSON.stringify(ret)
      });
    },
    getErrCode(){
      var that = this
      var mediaPlayer = api.require('aliyunLive');
      mediaPlayer.getErrorCode(function(ret){
        if(ret){
          // console.log('播放错误：'+ret.errorCode);
          that.errCode= ret.errorCode
        }
      });
    }

  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .live-begin>p{
    width: 150px;
    height: 70px;
    color: #fff;
    background-color: #008842;
    margin: auto;
    text-align: center;
    font-size: 24px;
    line-height: 70px;
    border-radius: 3px;
  }
  .live-Type>p:last-child{
    float: right;
  }
  .live-Type>p{
    float: left;
    font-size: 26px;
    color: #fff;
  }
  .live-Type{
    overflow: hidden;
    width: 60%;
    margin:40px auto;
  }
  .add-img>p{
    color: #fff;
    font-size: 16px;
    text-align: center;
    margin-bottom: 5px;
  }
  .add-img{
    width: 20%;
    margin: auto;
  }
  .add-icon{
    width: 50px;
    height: 40px;
    background: url("../../assets/img/live/fenmian.png") no-repeat center  center/100%;
    margin: auto;
  }
  .main-title>input{
    width:100%;
    border-bottom:1px solid #008842;
    font-size:26px;
    background: transparent;
    text-align: center;
  }
  .main-title{
    width: 70%;
    padding-top: 30%;
    margin:0 auto 30% auto;
  }
  .live-content{
    background-color: rgba(0,0,0,.2);
    height: 100%;
  }
  .control>div{
    float: right;
  }
  .control{
    overflow: hidden;
  }
  .control i{
    float: left;
  }
  .checkout{
    background: url("../../assets/img/live/huan.png") no-repeat center center/100%;
    width: 24px;
    height: 30px;
  }
  .close{
    background: url("../../assets/img/live/close.png") no-repeat center center/100%;
    width: 20px;
    height: 30px;
    margin-left: 10px;
    margin-right: 15px;
  }




  .button>button{
    display: block;
    line-height: 3rem;
    margin-bottom: .5rem;
    margin-left: 2rem;
    padding: 0 1rem;
  }
  .applyText{
    text-align: center;
    margin-top: 10rem;
  }
  .applyText>p:last-child{
    margin: 5rem auto;
  }
  .applyText>p{
    font-size: 1.222rem;
    color: #888;
  }
  .applyText>h2{
    margin-bottom: 2rem;
    font-size: 2rem;
  }
  .applyBtn>p:last-child{
    background-color: #fff;
    color: #008842;
  }
  .applyBtn>p{
    width: 18.611rem;
    height: 3.556rem;
    font-size: 1.333rem;
    border-radius: 5px;
    text-align: center;
    margin: 1rem auto;
    border:1px solid #008842;
    line-height: 3.556rem;
    background-color: #008842;
    color: #fff;
  }
</style>
