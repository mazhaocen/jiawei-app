<template>
  <div class="new-shop">
    <el-header className="go_back" title="申请开店"></el-header>
    <section class="content" style="background-color: #efefef">
      <p class="pd-1 open-title">请填写本人实名信息，如非本人实名将无法提现</p>
      <ul class="cl open-option">
        <li>真实姓名* <input type="text" :maxlength="10" placeholder="请输入您的真实姓名" v-model="idCardName"
                        v-on:input="inputChange('name',$event.target.value)"
                        v-on:blur="inputBlur('name',$event.target.value)"
                        v-on:focus="inputFocus('name',$event.target.value)">
          <p class="err-msg">{{realNameErrMsg}}</p>
        </li>
        <li>联系电话* <input type="tel" :maxlength="11" placeholder="请输入您的联系电话" v-model="idCardPhone"
                        v-on:input="inputChange('tel',$event.target.value)"
                        v-on:blur="inputBlur('tel',$event.target.value)"
                        v-on:focus="inputFocus('tel',$event.target.value)">
          <p class="err-msg">{{phoneErrMsg}}</p>
        </li>
        <li>身份证号* <input type="text" :maxlength="18" placeholder="请输入您的身份证号码" v-model="idCardNumber"
                        v-on:input="inputChange('idCard',$event.target.value)"
                        v-on:blur="inputBlur('idCard',$event.target.value)"
                        v-on:focus="inputFocus('idCard',$event.target.value)">
          <p class="err-msg">{{idCardNoErrMsg}}</p></li>
      </ul>
      <div class="upload-pic pd-1">
        <p>申请人照片 </p>
        <div class="cl">
          <div class="fl" @click="choosePhoto('front')">
            <div class="up">
              <img v-if="idCardFrontImg" :src="idCardFrontImg" alt="">
            </div>
            <p>身份证正面*</p>
          </div>
          <div class="fr" @click="choosePhoto('back')">
            <div class="back">
              <img v-if="idCardBackImg" :src="idCardBackImg" alt="">
            </div>
            <p>身份证背面*</p>
          </div>
        </div>
      </div>
      <div class="open-type-choose pd-1 cl">
        <p>商家类型</p>
        <button :class="{select:type==='1'}" @click="choosetype('1')" class="fl">农家自产</button>
        <button :class="{select:type==='2'}" @click="choosetype('2')" class="fr">附近商铺</button>
      </div>
      <div class="remark pd-1 cl">
        <span class="fl">备注: </span>
        <div class="fl">
          <p>附近商铺：只提供附近区域商品服务请选此选项（不可异地发货）</p>
          <p>农家自产：自产农副产品以及干货卖家请选此选项（可异地发货）</p>
        </div>
      </div>
      <div class="negotiate pd-1">
        <span :class="{'on':negotiate1}" @click="negotiateShow('开店协议认证')"><i @click.stop="negotiate1=!negotiate1"><img src="../../assets/img/me/dagou.png" alt=""></i>开店协议认证</span>
        <span :class="{'on':negotiate2}" @click="negotiateShow('味人服务配送政策')"><i @click.stop="negotiate2=!negotiate2"><img src="../../assets/img/me/dagou.png" alt=""></i>味人服务配送政策</span>
        <!--<span :class="{'on':negotiate3}" @click="negotiateShow('收费标准')"><i @click.stop="negotiate3=!negotiate3"><img src="../../assets/img/me/dagou.png" alt=""></i>收费标准</span>-->
        <span :class="{'on':negotiate4}" @click="negotiateShow('T+2结算协议')"><i @click.stop="negotiate4=!negotiate4"><img src="../../assets/img/me/dagou.png" alt=""></i>T+2结算协议</span>
      </div>
    </section>
    <footer class="footer">
      <button class="save-btn" v-if="idCardName && idCardPhone && idCardNumber && idCardFrontImg && idCardBackImg && negotiate1 && negotiate2 && negotiate3 && negotiate4"
              @click="openShop">提交
      </button>
      <button class="save-btn" v-if="!idCardName || !idCardPhone || !idCardNumber || !idCardFrontImg || !idCardBackImg ||!negotiate1 || !negotiate2|| !negotiate3|| !negotiate4"
              style="background-color: #999;color:#fff">提交
      </button>
    </footer>
    <mt-actionsheet :actions="actions" v-model="sheetVisible"></mt-actionsheet>
    <image-clip class="the-top" v-if="imageClip" :imgUrl="fsImgUrl" v-on:clipImage='resultImage' :ratio="0.654"></image-clip>
    <mt-popup v-model="showNegotiate" :modal="false"  position="bottom" style="width: 100%;height: 100%">
      <el-header :title="NegotiateTitle"></el-header>
      <div class="content">
        <img v-if="NegotiateTitle=='开店协议认证'" src="../../assets/img/myShop/sjkdxy.png" alt="">
        <img v-if="NegotiateTitle=='味人服务配送政策'" src="../../assets/img/myShop/psxy.png" alt="">
        <!--<img v-if="NegotiateTitle=='收费标准'" src="" alt="">-->
        <img v-if="NegotiateTitle=='T+2结算协议'" src="../../assets/img/myShop/T2xy.png" alt="">
      </div>
      <button class="negotiateSure" @click="showNegotiate=false">确定</button>
    </mt-popup>
  </div>
</template>

<script>
  import {Actionsheet, Indicator, Popup} from 'mint-ui';
  import ImageClip from '@/pages/takePhoto/ImageClip'
  import Header from '@/components/Head'
  export default {
    name: 'newShop',
    data () {
      return {
        sheetVisible: false,
        showNegotiate:false,
        imgUrl: '',
        upImgUrl: '',
        backImgUrl: '',
        imageClip: false,
        idCardName: "",
        idCardPhone: "",
        idCardNumber: "",
        idCardFrontImg: "",
        idCardBackImg: "",
        type: "1",
        idCardType: "",
        reg: {
          tel: new RegExp(/^1[3|4|5|7|8][0-9]{9}$/),// 手机号码验证
          name: new RegExp(/^[\u4E00-\u9FA5A-Za-z]+$/),//用户姓名
          idCard: new RegExp(/^(^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$)|(^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])((\d{4})|\d{3}[Xx])$)$/)
        },
        realNameErrMsg: '',
        phoneErrMsg: '',
        idCardNoErrMsg: '',
        actions: [{
          name: '拍照',
          method: this.openCamera
        }, {
          name: '在相册中选择',
          method: this.openAlbum
        }],
        negotiate1:true,
        negotiate2:true,
        negotiate3:true,
        negotiate4:true,
        NegotiateTitle:''
      }
    },
    created(){
    },
    components: {
      'el-header': Header,
      'mt-actionsheet': Actionsheet,
      'image-clip': ImageClip,
      'mt-popup': Popup,
    },
    methods: {
      inputChange (type, value) {
        switch (type) {
          case 'name':
            break
          case 'tel':
            break
          case 'idCard':
            if (this.reg.idCard.test(value)) {
              // console.log(value)
            }
            break
        }
      },
      inputBlur(type, value){//上去焦点时候的校验
        switch (type) {
          case 'name':
            if (this.reg.name.test(this.idCardName.trim())) {
              this.realNameErrMsg = ''
              return true
            } else {
              this.realNameErrMsg = '姓名有误'
              return false
            }
            break
          case 'tel':
            if (this.reg.tel.test(this.idCardPhone.trim())) {
              this.phoneErrMsg = ''
              return true
            } else {
              this.phoneErrMsg = '手机号码有误'
              return false
            }
            break
          case 'idCard':
            if (this.reg.idCard.test(this.idCardNumber.trim())) {
              this.idCardNoErrMsg = ''
              return true
            } else {
              this.idCardNoErrMsg = '身份证号码有误'
              return false
            }
            break
        }
      },
      inputFocus (type, value) {//获取焦点时候的校验
        switch (type) {
          case 'name':
            break
          case 'tel':
            break
          case 'idCard':
            break
        }
      },
      choosetype(type) {
        this.type = type
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
      negotiateShow( title){//查看协议详情
        this.showNegotiate=true
        if(title==="开店协议认证"){
          this.NegotiateTitle=title
        }else if(title==='味人服务配送政策'){
            this.NegotiateTitle=title
        }else if(title==='收费标准'){
           this.NegotiateTitle=title
        }else if(title==='T+3结算协议'){
            this.NegotiateTitle=title
        }
      },
      choosePhoto(type){
        this.sheetVisible = true
        this.idCardType = type  //正面 front  反面back
      },
      resultImage(url){  //裁剪后的图片路径
        if (url) {
          //getBase64Image(url,ratio)将路径下的图片转换成 base64
          this.G.getBase64Image(url, 0.654).then(res => {//传参 url图片路径 ，第二个参为 图片的比例 高/宽
            this.imgUrl = url;
            if (this.idCardType === 'front') {
              this.idCardFrontImg = res
            } else {
              this.idCardBackImg = res
            }
          })
        }
        this.imageClip = false;
      },
      openShop () {
        let arr = ['name', 'tel', 'idCard']
        for (let i = 0; i < arr.length; i++) {
          if (!this.inputBlur(arr[i])) {
            // console.log('cuole');
            alert('请上填写真确的信息')
            return
          }
        }
//        if (!this.idCardFrontImg || !this.idCardBackImg) {
//          alert('请上传证件照')
//          return
//        }
        Indicator.open('上传中...');
        let shopInfo = {
          idCardName: this.idCardName,
          idCardPhone: this.idCardPhone,
          idCardNumber: this.idCardNumber,
          idCardFrontImg: JSON.parse(JSON.stringify(this.idCardFrontImg)).split(',')[1],
          idCardBackImg: JSON.parse(JSON.stringify(this.idCardBackImg)).split(',')[1],
          type: this.type,
        }
        // console.log(JSON.stringify(this.idCardFrontImg))
        // console.log(JSON.stringify(JSON.parse(JSON.stringify(this.idCardFrontImg)).split(',')[1]))
        // console.log(JSON.stringify(shopInfo))
//        return
        this.$http.post(this.API.my_shop_apply,shopInfo).then(res=>{
          // console.log(JSON.stringify(res));
          Indicator.close();

          if(res.data.status==1){
            alert('开店成功，转到店铺页面')
            this.$router.push({name: 'MyShop'})
          }

        }).catch(err=>{
          alert('开店失败，请重试')
          // console.log(JSON.stringify(err))
          Indicator.close();
        })
      }
    },
    mounted () {
//      this.actions = [{
//        name: '拍照',
//        method: this.takePhoto
//      }, {
//        name: '在相册中选择',
//        method: this.getPic
//      }]
      this.reg.tel = new RegExp(/^1[3|4|5|7|8][0-9]{9}$/);// 手机号码验证
      this.reg.name = new RegExp(/^[\u4E00-\u9FA5A-Za-z]+$/) //用户姓名
      this.reg.idCard = new RegExp(/^(^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$)|(^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])((\d{4})|\d{3}[Xx])$)$/)
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .negotiateSure{
    position: absolute;
    bottom:0;
    background-color: #008842;
    width:100%;
    line-height: 4rem;
    color: #fff;
    font-size: 1.4rem;
  }
  .negotiate{
    margin-top: .5rem;
  }
  .negotiate>span{
    line-height: 1.6rem;
    display: block;
    height: 2.4rem;
    color: #5478fd;
  }
  .negotiate>span.on>i{
    background-color: #008842;
  }
  .negotiate>span>i:after{
    content: '';
    display: block;
    position: absolute;
    width: .4rem;
    height: .8rem;
    transform: rotate(45deg);
    border-radius: 2px;
    border-bottom: 1px solid #efefef;
    border-right: 1px solid #efefef;
    right: 0.3rem;

  }
  .negotiate>span>i{
    position: relative;
    float: left;
    margin-right: .5rem;
    border:1px solid #008842;
    border-radius: 2px;
    width: 1.2rem;
    height: 1.2rem;
    background-color: #fff;
  }
  .the-top {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 99999;
  }
.remark{
  color: #999;
  margin-top: 1rem;
}
  .open-type-choose > button.select {
    color: #ffffff;
    background-color: #008842;
  }

  .open-type-choose > button {
    width: 45%;
    height: 3.4rem;
    border-radius: 3px;
    background-color: #c3c5c8;
  }

  .open-type-choose > p {
    line-height: 4rem;
  }

  .upload-pic {
    background-color: #ffffff;
  }

  .upload-pic > p > span {
    color: #3462ff;
  }

  .upload-pic > p {
    line-height: 4rem;
  }

  .upload-pic > div > div > p {
    color: #008842;
    font-size: .733rem;
    line-height: 2rem;
  }

  .upload-pic > div > div .back {
    background: url("../../assets/img/myShop/open-img2.png") no-repeat center center /100%;
    height: 8.611rem;
  }

  .upload-pic > div > div .up {
    background: url("../../assets/img/myShop/open-img.png") no-repeat center center /100%;
    height: 8.611rem;
  }

  .upload-pic > div > div {
    width: 48%;
  }

  .open-title {
    line-height: 4rem;
  }

  .open-option {
    background-color: #fff;
    padding: 0 1rem;
  }

  .open-option > li > input {
    width: 80%;
    height: 4rem;
    padding-left: 1rem;
  }

  .open-option > li {
    position: relative;
    float: none;
    width: 100%;
    line-height: 4rem;
    border-bottom: 1px solid #efefef;
  }

</style>
