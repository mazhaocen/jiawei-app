<template>
  <div class="user-center">
    <el-header className="go_back" title='用户管理'></el-header>
    <section class="content manage-cell" style="padding-bottom: 0">
      <p>用户信息</p>
      <div class="shop_img" @click="sheetVisible = true"><p>用户头像</p><span><i><img v-lazy="imgUrl" alt=""></i></span></div>
      <div @click="openTextEdit(40,'用户名称',username)"><p>用户名称</p><span>{{username}}</span></div>
      <div @click="openTextEdit(100,'个性签名',signature)"><p>个性签名</p><span>{{signature}}</span></div>
      <div @click="openAddEdit('居住地址',userInfo)"><p>居住地址</p><span>{{livingPlaceProvince}}{{livingPlaceCity}}{{livingPlaceArea}}{{livingPlaceAddress}}</span>
      </div>
      <div @click="openAddEdit('故乡',userInfo)"><p>故乡</p><span>{{hometownProvince}}{{hometownCity}}{{hometownArea}}{{hometownAddress}}</span>
      </div>
      <div @click="openTextEdit(200,'我的经历',experience)"><p>我的经历</p><span>{{experience}}</span></div>
      <p>安全设置</p>
      <!--<div><p>支付密码管理</p><span></span></div>-->
      <div @click="showPwdEdit = true"><p>修改登录密码</p><span></span></div>
      <p>其他</p>
      <div @click="loginOut"><p>退出</p><span></span></div>
    </section>
    <!--图片、拍照选择-->
    <mt-actionsheet :actions="actions" v-model="sheetVisible"></mt-actionsheet>
    <!--图片裁剪-->
    <image-clip class="the-top" v-if="imageClip" :imgUrl="fsImgUrl" v-on:clipImage='resultImage'
                :ratio="1"></image-clip>
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
    <!--地址选择编辑部分-->
    <mt-popup v-model="showAddEdit" :modal="false" position="bottom" style="width: 100%;height: 100%">
      <el-header :title='editTitle'><a class="cancel" @click="showAddEdit=false">取消</a></el-header>
      <section class="content" style="background-color: #efefef">
        <div class="addressEdit">
          <p @click="showSelect=true">
            地址：<span>{{selectResult.province}}{{selectResult.city}}{{selectResult.country}}</span></p>
          <textarea placeholder="请输入详细地址" class="editarea" maxlength="200" v-model="inputAddress"></textarea>
          <div class="pd-1">
            <span>说明：</span>
            <p :class="{'red':!selectResult.province}">1.地址不能为空。</p>
            <p>2.请输入1-200个字符。</p>
          </div>
          <mt-popup v-model="showSelect" :modal="true" position="bottom" style="width: 100%;bottom: 4rem;">
            <p>
              <button @click="showSelect=false">取消</button>
              <button @click="selectSure">确定</button>
            </p>
            <mt-picker :slots="slots" @change="onAddressChange" :visibleItemCount="5"
                       style="font-size: 1.1rem;border-top: 2px solid #efefef"></mt-picker>
          </mt-popup>
        </div>
      </section>
      <footer class="footer">
        <button class="save-btn dis" v-if="!selectResult.province">保存</button>
        <button class="save-btn" v-if="selectResult.province" @click="saveEdit(editTitle)">保存</button>
      </footer>
    </mt-popup>
    <mt-popup v-model="showPwdEdit" :modal="false" position="bottom" style="width: 100%;height: 100%">
      <el-header title='修改登录密码'><a class="cancel" @click="showPwdEdit=false">取消</a></el-header>
      <section class="content up-pwd" style="background-color: #efefef">
        <p>请输入原密码：<input type="password" v-model="oldPassword"></p>
        <p>请输入新密码：<input type="password" v-model="newPassword1"></p>
        <p>再次输入新密码：<input type="password" v-model="newPassword2"></p>
        <span v-if="newPassword2!==newPassword1 && newPassword1 && newPassword2" style="color: red;float: right;padding-right: 1rem">新密码不一致</span>
      </section>
      <footer class="footer">
        <button class="save-btn dis" v-if="!oldPassword ||!newPassword1||!newPassword2 ||newPassword2!==newPassword1 ">保存</button>
        <button class="save-btn" v-if="oldPassword &&newPassword1&&newPassword2 &&newPassword2===newPassword1" @click="upPassword()">保存</button>
      </footer>
    </mt-popup>
  </div>
</template>

<script>
  import Header from '@/components/Head'
  import {Actionsheet, Indicator, Toast, MessageBox, Picker, Popup} from 'mint-ui';
  import ImageClip from '@/pages/takePhoto/ImageClip'
  import {updateShopLogo} from '@/service/service'
  export default {
    name: 'userCenter',
    data () {
      return {
        sheetVisible: false,
        showTextEdit: false,
        showAddEdit: false,
        showPwdEdit:false,
        showSelect: false,
        editTitle: '',
        actions: [{
          name: '拍照',
          method: this.openCamera
        }, {
          name: '在相册中选择',
          method: this.openAlbum
        }],
        shopImg: '',
        textContent: '',
        imgUrl: '',
        fsPath: '',
        username: '',
        signature: '',
        experience: '',
        hometown: '',
        selectAddress: '',
        inputAddress: '',
        imageClip: false,
        selectVal: '',
        selectResult: '',
        slots: [
          {
            flex: 1,
            values: [],
            className: 'slot1',
            textAlign: 'right',
            defaultIndex: 0
          }, {
            divider: true,
            content: '-',
            className: 'slot2'
          }, {
            flex: 1,
            values: [],
            className: 'slot3',
            textAlign: 'center',
            defaultIndex: 0
          }, {
            divider: true,
            content: '',
            className: 'slot4'
          }, {
            flex: 1,
            values: [],
            className: 'slot5',
            textAlign: 'left',
            defaultIndex: 0
          }
        ],
        cityArrObj: [],
        provinceArr: [],
        selecter: true,
        long: 40,
        hometownProvince: '',//大厨故乡
        hometownCity:'',
        hometownArea:'',
        hometownAddress:'',
        livingPlaceProvince: '',//大厨现居地
        livingPlaceCity: '',
        livingPlaceArea: '',
        livingPlaceAddress: '',
        userInfo:{},
        oldPassword:'',
        newPassword1:'',
        newPassword2:''
      }
    },
    created(){
//      console.log(localStorage.getItem('userId'))
      if (localStorage.getItem('userId')) {
        Indicator.open('加载数据...')
        this.$http.post(this.API.show_chef_info, {
          id: localStorage.getItem('userId')
        }).then(res => {
          Indicator.close()
          this.userInfo = res.data.data
          this.username = res.data.data.name || '';
          this.signature = res.data.data.signature || '';
          this.experience = res.data.data.experience || '';
          this.imgUrl = res.data.data.img || '';
          this.hometownProvince= res.data.data.hometownProvince
          this.hometownCity=res.data.data.hometownCity
          this.hometownArea=res.data.data.hometownArea
          this.hometownAddress=res.data.data.hometownAddress
          this.livingPlaceProvince= res.data.data.livingPlaceProvince
          this.livingPlaceCity= res.data.data.livingPlaceCity
          this.livingPlaceArea= res.data.data.livingPlaceArea
          this.livingPlaceAddress= res.data.data.livingPlaceAddress;
          localStorage.setItem('userInfo',JSON.stringify(res.data.data));

        })
          .catch(err => {
          Indicator.close()
          console.log(err)
        })
      }
      window.page='userCenter'
    },
    destroyed () {
      window.page = ''
    },
    components: {
      'el-header': Header,
      'mt-actionsheet': Actionsheet,
      'image-clip': ImageClip,
      'mt-picker': Picker,
      'mt-popup': Popup
    },
    methods: {
      openTextEdit(long, title, text){//打开文字编辑窗口
        window.pageNot=true
        this.editTitle = title;
        this.showTextEdit = true;
        this.textContent = text;//显示编辑内容
        this.long = long;
      },
      openAddEdit(title, text){ //打开地址选择窗口
        this.editTitle = title;
        window.pageNot=true
        this.showAddEdit = true; //显示地址选择内容
        if(title=='居住地址'){
          this.selectResult = {
            province: text.livingPlaceProvince,
            city: text.livingPlaceCity,
            country: text.livingPlaceArea
          }
          this.inputAddress = text.livingPlaceAddress;
        }else{
          this.selectResult = {
            province: text.hometownProvince,
            city: text.hometownCity,
            country: text.hometownArea
          }
          this.inputAddress = text.hometownAddress;
        }

        let that = this;
        window.ADDRESS.forEach(function (m) {
          that.provinceArr.push(m.name);//省份数组
          that.cityArrObj[m.name] = m.sub//城市数组对象
        });
        this.slots[0].defaultIndex = 0;
        this.slots[2].defaultIndex = 0;
        this.slots[4].defaultIndex = 0;
        this.slots[0].values = this.provinceArr;//设置身省份
      },
      onAddressChange(picker, values){//地址选择器改变
        let cityArr = [];
        let countryArrObj = {};
        if (!values[0]) {
          return
        }
        this.cityArrObj[values[0]].forEach(function (m) {
          cityArr.push(m.name);//城市数组
          if (m.sub) {
            countryArrObj[m.name] = m.sub //地区数组对象
          }
        });
        let countryArr = [];
        this.slots[3].content = '';
        if (countryArrObj[values[1]]) {
          this.slots[3].content = '-';
          countryArrObj[values[1]].forEach(function (m) {
            countryArr.push(m.name)//地区数组
          })
        }
        picker.setSlotValues(1, cityArr);//设置 城市数组
        picker.setSlotValues(2, countryArr);//设置 地区数组
        this.selectVal = {
          province: values[0],
          city: values[1],
          country: values[2] ? values[2] : ''
        }
      },
      selectSure(){//地址选择确认
        this.selectResult = this.selectVal
        this.showSelect = false
      },
      saveEdit(type){//保存编辑内容
        switch (type) {
          case '用户名称':
            this.username = this.textContent;
            break;
          case '个性签名':
            this.signature = this.textContent;
            break;
          case '居住地址':
            this.livingPlaceProvince = this.selectResult.province;
            this.livingPlaceCity = this.selectResult.city;
            this.livingPlaceArea = this.selectResult.country;
            this.livingPlaceAddress = this.inputAddress;
            break;
          case '故乡':
            this.hometownProvince = this.selectResult.province;
            this.hometownCity = this.selectResult.city;
            this.hometownArea = this.selectResult.country;
            this.hometownAddress = this.inputAddress;
            break;
          case'我的经历':
            this.experience = this.textContent;
            break;
        }
        Indicator.open('正在保存...');
        this.saveUserData()
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
            this.base64Url = res;
            this.onSaveImg()
          });
        }
        this.imageClip = false;
        this.imgUrl = url
      },
      onSaveImg(){  //保存  上传图片->上传数据
        Indicator.open('头像上传中...')
        let formData = new FormData();
        let config = {//添加请求头
          headers: {'Content-Type': 'multipart/form-data'}
        };
        //getBlobBydataURI(base64) 将 base64 格式图片 转换成 blob file文件
        this.G.getBlobBydataURI(this.base64Url).then(res => {
          formData.append('img', res, "img_" + Date.parse(new Date()) + ".jpg");
          this.$http.post(this.API.user_uploadImg, formData, config).then(res => {
            console.log('上传成功 返回的图片路径：' + JSON.stringify(res.data));
            if (res.data.status === 1) {
              this.saveUserData(res.data.data)
            } else {
              Indicator.close();
              Toast({message: res.data.message});
            }
          }).catch(err => {
            console.log(err)
            Toast({message: '失败！'});
            Indicator.close();
          })
        })
      },
      saveUserData(img){
        let userInfo={
          email: '',
          username: this.username,
          hometownProvince: this.hometownProvince ,//大厨故乡
          hometownCity:this.hometownCity ,
          hometownArea:this.hometownArea ,
          hometownAddress:this.hometownAddress ,
          livingPlaceProvince: this.livingPlaceProvince ,//大厨现居地
          livingPlaceCity: this.livingPlaceCity ,
          livingPlaceArea: this.livingPlaceArea ,
          livingPlaceAddress: this.livingPlaceAddress ,
          signature: this.signature,//个性签名
          img: img,//大厨头像
          experience: this.experience,//工作经历
          liveRoom: '', //直播房间号
          liveUrl: ''//直播URL
        }
        this.$http.post(this.API.up_user_info,userInfo).then(res => {
          Indicator.close();
          let msg = '';
          if (res.data.status === 1) {
            msg = '上传成功！';
            if (this.showTextEdit || this.showAddEdit) {
              this.showTextEdit = false;
              this.showAddEdit = false;
            }
            localStorage.setItem('userName', this.username)
            localStorage.setItem('userInfo', JSON.stringify(userInfo))
          }
          Toast({
            message: msg
          });
          console.log(res.data)
        }).catch(err=>{
          Indicator.close();
        })
      },
      loginOut(){
        MessageBox({
          title: '提示',
          message: '确定退出当前用户吗?',
          showCancelButton: true
        }).then(res => {
          if (res === 'confirm') {
            localStorage.clear()
            sessionStorage.clear()
            this.$http.post(this.API.logout, {}).then(res => {
              console.log(res)
              this.G.goBack()
            }).catch(err => {

            })
//            this.$router.push({name:'Index'})
          } else {
          }
        });
      },
      upPassword(){
        Indicator.open();
          this.$http.post(this.API.upPassword,{
            password:this.oldPassword,
            newPassword:this.newPassword1,
            newPassword2:this.newPassword2
          }).then(res=>{
            let msg = '';
              console.log(res.data)
            if(res.data.status==1){
              msg = '修改成功！'
              this.showPwdEdit=false
              this.oldPassword=''
              this.newPassword1=''
              this.newPassword2=''
            }else{
              msg=res.data.message
            }
            console.log(msg)
            Indicator.close();
            Toast({message: msg});
          }).catch(err=>{
            Indicator.close();
              console.log(err)
          })
      },
    },
    mounted () {
      let that = this
      api.addEventListener({
        name: 'keyback'
      }, function (ret) {
        if (ret) {
          console.log('quxiao')
            if(that.sheetVisible == true || that.showTextEdit == true|| that.showAddEdit == true|| that.showPwdEdit == true|| that.showSelect == true) {
              that.sheetVisible= false
              that.showTextEdit= false
              that.showAddEdit= false
              that.showPwdEdit=false
              that.showSelect= false
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
  .up-pwd>p>input{
    width: 20rem;
    height: 4rem;
    font-size: 1.2rem;
  }
  .up-pwd>p{
    border-bottom: 1px solid #efefef;
    background-color: #fff;
    line-height: 4rem;
    padding-left: 1rem;
    font-size: 1.2rem;
  }
  .addressEdit > p {
    border-top: 1px solid #efefef;
    border-bottom: 1px solid #efefef;
    padding: 0 1rem;
    line-height: 4rem;
    background-color: #fff;
    font-size: 1.2rem
  }

  .addressEdit {
    margin: .3rem 0;
    padding: 1rem auto;
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

  .cancel {
    font-size: 1.2rem;
    color: #008842;
  }

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

  .red {
    color: red
  }

  .addressEdit p > button:first-child {
    color: #008842;
    background-color: #fff;
  }

  .addressEdit p > button {
    width: 50%;
    height: 3rem;
    border-radius: 0;
    color: #fff;
    background-color: #008842;
  }
</style>
