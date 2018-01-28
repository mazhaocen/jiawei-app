/**
 * Created by ma on 2017/9/27.
 */
window.isBack = false;
const goBack = () => {
    window.isBack = true;
    window.isGoBack = true;
    history.go(-1)
  },
  /**
   * 打开 手机相册或相机 通过系统相册或拍照获取图片和视频*/
  getPicture = (type,that) => {
    return new Promise((resolve, reject)=>{
       api.getPicture({
        sourceType: type, // （可选项）图片源类型， 从相册、图片库或相机获取图片 1:library 图片库; 2:camera 相机; 3:album 相册 默认值：library
        encodingType: 'jpg', //（可选项）返回图片类型 jpg或png 默认值：png
        destinationType: 'url',//（可选项）返回数据类型，指定返回图片地址或图片经过base64编码后的字符串 1:base64 指定返回数据为base64;2:url指定返回数据为选取的图片地址 默认值：url
        // mediaValue:'pic', //（可选项）媒体类型，图片或视频  1:pic//图片;2:video 视频;3:all 图片和视频，Android不支持 默认值：pic
        // allowEdit: false, //（可选项）是否可以选择图片后进行编辑，支持iOS及部分安卓手机. 默认值：false
        quality: 50, //可选项）图片质量，只针对jpg格式图片（0-100整数）默认值：50
        // targetHeight:'',// 类型：数字  描述：（可选项）压缩后的图片高度，图片会按比例适配此高度. 默认值：原图高度
        saveToPhotoAlbum: true //描述：（可选项）拍照或录制视频后是否保存到相册. 默认值：false
      }, (ret, err) => {
        if (ret) {  //data:"",图片路径;
          // base64Data:"",base64数据，destinationType为base64时返回
          // duration:0 ,视频时长（数字类型）
          if (ret.data) {
            // alert(JSON.stringify(ret.data))
            resolve(ret.data)
            // that.fsImgUrl =
            // that.imageClip = true
          }
        } else {
        }
      });
    })

  },
  /** 将图片转换成 base64 格式*/
  getBase64Image = (url, ratio, height, callback) => {
    return new Promise((resolve, reject)=>{
      let img = new Image();
      img.src = url;
      img.onload = () => {//图片加载完成
        let canvas = document.createElement("canvas");
        canvas.width = api.winWidth;
        canvas.height = api.winWidth*ratio;
        canvas.getContext("2d").drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL('image/jpeg',0.9));
      }

    });

  },
  /**
   * 将 base64 格式图片转换成 blob （文件形式）*/
  getBlobBydataURI = (dataURI) => {//base64 图片转换成 file 文件
    return new Promise((resolve, reject)=>{
      let type = dataURI.split(',')[0].match(/:(.*?);/)[1];
      let img = atob(dataURI.split(',')[1]); //将 base64 进行解码
      console.log('图片大小：'+(img.length/1024)+'kb');
      let ab = new ArrayBuffer(img.length);
      let array = new Uint8Array(ab);
      for (let i = 0; i < img.length; i++) {
        array[i]=img.charCodeAt(i);
      }
      resolve(new Blob([ab], {type:type}));
    })
  },
  //测试用
  fileToBase64 = (e) => {
    return new Promise((resolve, reject) => {
      let r = new FileReader(),file = e.target.files[0],base64;
      r.readAsDataURL(file);
      r.onload = (e) => {
        base64 = e.target.result;
        resolve(e.target.result)
      };
    })

  }
// const getLocation =() =>{
//   var num=0
//   var bMap = api.require('bMap');
//   if(api.systemType=='ios'){
//     bMap.initMapSDK(function (ret) {
//       if (ret.status) {
//        return getLoca()
//       }
//     });
//   }else{
//    return getLoca()
//   }
//   /** 获取坐标*/
//   function getLoca(){
//     bMap.getLocation({
//       accuracy: '100m',
//       autoStop: true,
//       filter: 1
//     }, function(ret, err){
//       if (ret.status) {
//       return  getNameFromCoord(ret.lon,ret.lat)
//       } else {
//         // that.gpserr = '错误 code'+err.code+'/错误信息'+err.msg
//       }
//     });
//   }
//   /** 通过坐标获取位置信息*/
//   function getNameFromCoord(lon,lat){
//     bMap.getNameFromCoords({
//       lon: lon,
//       lat: lat,
//     }, function(ret, err) {
//       if(!ret.status){
//         num++;
//         if(num>10){
//           alert(JSON.stringify(err));
//           return
//         }
//        return getNameFromCoord(lon,lat);
//       }else{
//         var addComp = ret;
//         var assress = addComp.province + ", " + addComp.city + ", " + addComp.district + "," + addComp.streetName + "," + addComp.streetNumber;
//         if(addComp.streetName && addComp.streetNumber){
//           return addComp.streetName + addComp.streetNumber;
//         }
//         if(addComp.district && addComp.streetName && !addComp.streetNumber){
//           return addComp.district + addComp.streetName;
//         }
//         if(addComp.city && addComp.district && !addComp.streetName){
//           return addComp.city + addComp.district
//         }
//         if(addComp.province && addComp.city && !addComp.district){
//           return addComp.province + addComp.city
//         }
//         if(addComp.province && addComp.city && addComp.district && !addComp.streetName && !addComp.streetNumber){
//           return addComp.province + addComp.city+ addComp.district
//         }
//         // that.address = ret.poiList
//       }
//     });
//   }
// }

// };
export default {
  goBack,
  getPicture,
  getBase64Image,
  getBlobBydataURI,
  // formatTime,
  fileToBase64
}
