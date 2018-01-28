<template>
  <div class="scan">

  </div>
</template>

<script>
  export default {
    name: 'scan',
    data () {
      return {

      }
    },
    created(){
        var FNScanner = api.require('FNScanner');
        FNScanner.openView({
        }, function(ret, err) {
          if (ret) {
//              alert(ret.eventType);
              if(ret.eventType=='show'){
                api.openFrame({
                  name: 'scan',
                  url: 'widget://html/scan.html',
                })
              }
          } else {
            alert(JSON.stringify(err) + 'bbb');
          }
        });
        setTimeout(function () {
          FNScanner.closeView();
        },5000)
    },
    props:{
//      imgUrl:String,
//      ratio:{
//        type:Number,
//        default:1
//      }
    },
    methods: {

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
  #scan-h{
    width: 100%;
    background-color: red;
    overflow: hidden;
    position: absolute;
    z-index: -1;
  }
   .bottom .sure{
    float: right;
    border-left:1px solid #ffffff;
  }
  .bottom .cancel{
    float: left;
    border-right:1px solid #ffffff;
  }
   .bottom span{
    width: 33.333%;
    text-align: center;
    font-size: 1.1rem;
    display: inline-block;
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
  }
  .bottom{
    background-color: #008842;
    height: 50px;
    color: #fff;
    line-height: 50px;
    position: fixed;
    bottom:0;
    width: 100%;

  }
</style>
