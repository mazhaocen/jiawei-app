/**
 * Created by ma on 2017/5/27.
 */
window.onload = function () {
  // var content = document.querySelector('.content')
  // content.style.height = window.screen.height+'px'

  apiready = function () {
    api.setStatusBarStyle({
      style: "light" //”dark  light
    });
    document.getElementById('html').style.height = api.winHeight+'px';
    var head = document.getElementById('head');
    var style = document.createElement('style');
    var styleCss=document.createTextNode(".content{height:"+api.winHeight+'px'+"}");
    style.appendChild(styleCss)
    head.appendChild(style)
    var systemVersion = api.systemVersion;
    console.log(systemVersion)
    if (parseFloat(systemVersion) < 4.3) {
      api.alert({title: '提示', msg: 'Android系统版本为:' + systemVersion + ',请用更Android4.3以上系统使用此软件'})
    }

    var mkeyTime = new Date().getTime();
    api.addEventListener({
      name: 'keyback'
    }, function (ret) {
      if (ret) {

        var  arr = ['live','shop','character','shoppingCar','me'];
        if(arr.indexOf(window.page)!==-1 && !window.liveing) {
          if ((new Date().getTime() - mkeyTime) > 2000) {
            mkeyTime = new Date().getTime();
            api.toast({
              msg: '再按一次退出程序',
              duration: 2000,
              location: 'bottom'
            });
          } else {
            api.closeWidget();
          }
          // api.toLauncher();
        }else if(window.page==='imageClip'){
          let FNImageClip = api.require('FNImageClip');
          FNImageClip.close();
        }else if(window.page==='createMenu'){
          // alert(123)
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
        }else if(window.page==='upInformation'){
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
        }else if(window.page==='AddGoods'){
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
        }else{
          window.isGoBack = true;
          history.go(-1)
        }
      }
    });
  };
}

