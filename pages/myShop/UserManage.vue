<template>
  <div class="user-manage">
    <el-header className="go_back" title='店铺管理'></el-header>
    <section class="content manage-cell" style="padding-bottom: 0">
      <p>店铺信息</p>
      <div class="shop_img" @click="showGetType">
        <p>店铺头像</p>
        <span>
          <i><img v-lazy="shopInfo.shopImg" alt=""></i>
        </span>
        <!--<p>店铺头像</p><span><img :src="thumbImg" alt=""></span>-->
      </div>
      <div @click="openTextEdit(40,'店铺名称',shopInfo.shopName)"><p>店铺名称</p><span>{{shopInfo.shopName}}</span></div>
      <div @click="createCode()"><p>店铺二维码</p><span></span></div>
      <div>
        <p>发货地址</p>
        <span @click="goToSendAddress($event)">
          {{shopInfo.shopProvince}}{{shopInfo.shopCity}}{{shopInfo.shopArea}}{{shopInfo.shopAddress}}
        </span>
      </div>
      <!--<div><p>地区（省 市）</p><span>深圳市南山区</span></div>-->
      <div @click="openTextEdit(200,'店铺说明',shopInfo.shopMotto)"><p>店铺说明</p><span>{{shopInfo.shopMotto}}</span></div>
      <p>安全设置</p>
      <div @click="goToSetPwd"><p>提款 进店密码</p><span></span></div>
      <!--<p>其他</p>-->
      <!--<div @click="loginOut"><p>退出</p><span></span></div>-->
    </section>
    <mt-actionsheet :actions="actions" v-model="sheetVisible"></mt-actionsheet>
    <image-clip class="the-top" v-if="imageClip" :imgUrl="fsImgUrl" v-on:clipImage='resultImage' :ratio="1"></image-clip>
    <!--纯文本编辑部分-->
    <mt-popup v-model="showTextEdit" :modal="false" position="bottom" style="width: 100%;height: 100%">
      <el-header :title='editTitle'><a class="cancel" @click="showTextEdit=false">取消</a></el-header>
      <section class="content" style="background-color: #efefef">
        <div>
          <textarea class="editarea" v-model="textContent" :maxlength="long"></textarea>
          <div class="pd-1">
            <span>说明：</span>
            <p :class="{red:(/[^\w\u4E00-\u9FA5]/g).test(textContent)}">1.不能包含除"_"以外的特殊字符。如（￥%&*@）等;</p>
            <p>2.长度不能超过{{long}}个字符。</p>
          </div>
        </div>
      </section>
      <footer class="footer">
        <button class="save-btn dis" v-if="(!(textContent.trim()) || (/[^\w\u4E00-\u9FA5]/g).test(textContent))">保存
        </button>
        <button class="save-btn" v-if="textContent.trim() && !((/[^\w\u4E00-\u9FA5]/g).test(textContent))"
                @click="saveEdit(editTitle)">保存
        </button>
      </footer>
    </mt-popup>
    <mt-popup v-model="showCode"  position="bottom" style="width: 100%;height: 50%">
      <img class="pa" style="top: 0;right: 0;left: 0;bottom: 0;margin: auto" :src="shopInfo.shopCode" alt="">
    </mt-popup>
  </div>
</template>

<script>
  import Header from '@/components/Head'
  import {Actionsheet, Indicator, Toast, MessageBox, Picker, Popup} from 'mint-ui';


  import ImageClip from '@/pages/takePhoto/ImageClip'
//  import {updateShopLogo} from '@/service/service'
  export default {
    name: 'userManage',
    data () {
      return {
        sheetVisible: false,
        showTextEdit:false,
        imageClip: false,
        showCode:false,
        shopInfo:{},

        actions: [{
          name: '拍照',
          method: this.openCamera
        }, {
          name: '在相册中选择',
          method: this.openAlbum
        }],
        shopImg: '',
        fsImgUrl: '',
        editTitle:'',
        long:'',
        textContent:'',
      }
    },
    created(){
        if(localStorage.getItem('shopInfo')){
          let shopInfo = JSON.parse(localStorage.getItem('shopInfo'));
          this.shopInfo = shopInfo
//          console.log(shopInfo)
//          this.shopImg = shopInfo.logoLink
//          this.shopName = shopInfo.name
//          this.shopSign = shopInfo.slogan
//          let shopAddress = shopInfo.mainContact
//          if(shopAddress){
//            this.selectAddress = shopAddress.province+shopAddress.city+shopAddress.district
//            this.inputAddress = shopInfo.mainContact.address
//          }else{
//            this.selectAddress = ''
//            this.inputAddress = ''
//          }
        }
    },
    components: {
      'el-header': Header,
      'mt-actionsheet': Actionsheet,
      'image-clip': ImageClip,
      'mt-popup':Popup
    },
    methods: {
      showGetType(){
//        if(sessionStorage.getItem('shopInfo')){
          this.sheetVisible = true
//        }else{
//          alert('您还没有店铺，请先开店')
//        }
      },
      openTextEdit(long, title, text){//打开文字编辑窗口
        this.editTitle = title;
        this.showTextEdit = true;
        this.textContent = text?text:'';//显示编辑内容
        this.long = long;
      },
      createCode(){//生成店铺二维码
        this.$http.post(this.API.my_shop_createCode,{
            id:this.shopInfo.id,
//            shopName:'<a href="wrserver//?'+this.shopInfo.shopName+'|'+this.shopInfo.id+'">味人服务</a>'
            shopName:this.shopInfo.shopName
        }).then(res=>{
            this.showCode=true;
          this.shopInfo.shopCode = res.data.data
            console.log(res.data)
        })
      },
      saveEdit(type){//保存编辑内容
        switch (type) {
          case '店铺名称':
            this.shopInfo.shopName = this.textContent;
            break;
          case '店铺说明':
            this.shopInfo.shopMotto = this.textContent;
            break;
//          case '居住地址':
//            this.livingPlaceProvince = this.selectResult.province;
//            this.livingPlaceCity = this.selectResult.city;
//            this.livingPlaceArea = this.selectResult.country;
//            this.livingPlaceAddress = this.inputAddress;
//            break;
//          case '故乡':
//            this.hometownProvince = this.selectResult.province;
//            this.hometownCity = this.selectResult.city;
//            this.hometownArea = this.selectResult.country;
//            this.hometownAddress = this.inputAddress;
//            break;
//          case'我的经历':
//            this.experience = this.textContent;
//            break;
        }
        this.saveShopData()
      },
      saveShopData(){//保存店铺信息
        Indicator.open();
        this.$http.post(this.API.my_shop_manage,{
          id:this.shopInfo.id,
          shopImg:JSON.parse(JSON.stringify(this.shopInfo.shopImg)).split(',')[1],
          shopName:this.shopInfo.shopName,
          shopMotto:this.shopInfo.shopMotto
        }).then(res=>{
          console.log(res.data);
          if(res.data.status==1){
              localStorage.setItem('userInfo',JSON.stringify(this.shopInfo))
            this.showTextEdit = false
          }
          Indicator.close();
        }).catch(err=>{
            console.log(err)
          Indicator.close();
        })
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
          this.imageClip = true
        })
      },
      resultImage(url){  //图片地址
        if (url) {
          this.G.getBase64Image(url, 1).then(res => {
            this.shopInfo.shopImg = res;
            this.saveShopData()
          });
        }
        this.imageClip = false;
      },
      goToSendAddress (e) {
//        if(sessionStorage.getItem('shopInfo')){
          this.$router.push({name: 'SendAddress'})
//        }else{
//          alert('您还没有店铺，请先开店')
//        }
      },
      goToSetPwd(){
        this.$router.push({name: 'setPwd'})
      }
    },
    mounted () {
      let that = this
      api.addEventListener({
        name: 'keyback'
      }, function (ret) {
        if (ret) {
          console.log('quxiao')
          if(that.sheetVisible == true || that.showTextEdit == true|| that.showCode == true) {
            that.sheetVisible=false
            that.showTextEdit=false
            that.imageClip=false
            that.showCode=false
          }else{
            console.log('fanhui')
            that.G.goBack()
          }

        }
      })
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  ul.mint-actionsheet-list > li {
    float: none;
  }

  .manage-cell > div.shop_img {
    height: 5.355rem;
    padding: .3rem 1rem;
    line-height: 5.033rem;
  }

  .manage-cell > div.shop_img > span {
    text-align: right;
    height: 5rem;
  }

  .manage-cell > div.shop_img > span > i {
    width: 4.555rem;
    display: block;
    float: right;
    height: 4.555rem;
    border-radius: 50%;
    overflow: hidden;
    background: url("../../assets/img/myShop/shopimg.png") no-repeat center center/cover;
  }

  .manage-cell > div > span {
    display: inline-block;
    width: 68%;
    float: right;
    padding-right: 1.5rem;
    box-sizing: border-box;
    overflow: hidden;
    text-overflow: ellipsis;
    height: 3.4rem;
  }

  .manage-cell > div > p {
    display: inline-block;
  }

  .manage-cell > div {
    padding: 0 1rem;
    border-bottom: 1px solid #efefef;
    line-height: 3.4rem;
    font-size: 1.333rem;
    color: #5f646c;
    background: url("../../assets/img/myShop/arr-ri.png") no-repeat 97% center /.778rem;
  }

  .manage-cell > p {
    padding: 0 1rem;
    background-color: #efefef;
    color: #999;
    line-height: 2.6rem;
  }
  .editarea {
    resize: none;
    width: 100%;
    padding: 1rem;
    height: 12rem;
    font-size: 1.333rem;
    margin: .3rem 0;
    white-space: normal
  }

</style>
