<template>
  <div class="addressEdit" >
    <el-header className="go_back" title='地址管理'></el-header>
    <section class="content" style="background-color: #efefef">
      <ul class="send-address-list cl">
        <li><p><i style="color: red;">*</i>收货人</p><input type="text" value="李桥乡" v-model="addressInfo.name" :maxlength="20">
          <p class="err-msg">{{nameErrMsg}}</p>
        </li>
        <li><p><i style="color: red;">*</i>手机号码</p><input type="tel" value="13500012345" v-model="addressInfo.phone" maxlength="11"><p class="err-msg">{{telErrMsg}}</p></li>
        <li><p>邮政编码</p><input type="tel" value="518000" v-model="addressInfo.postCode" maxlength="6"></li>
        <li @click="chooseAddress"><p><i style="color: red;">*</i>收货地址</p><span>{{addressInfo.province}}{{addressInfo.city}}{{addressInfo.area}}</span><p class="err-msg">{{errAddressMsg}}</p></li>
        <li><textarea placeholder="请输入具体地址(必填)" v-model="addressInfo.address" :maxlength="100"></textarea>
          <p class="err-msg" style="left: inherit; right: 0;">{{addressErr}}</p>
        </li>
      </ul>
    </section>
    <mt-popup v-model="showSelect" :modal="true" position="bottom" style="width: 100%;" class="addressEdit">
      <p>
        <button @click="showSelect=false">取消</button>
        <button @click="selectSure">确定</button>
      </p>
      <mt-picker :slots="slots" @change="onAddressChange" :visibleItemCount="5"
                 style="font-size: 1.1rem;border-top: 2px solid #efefef"></mt-picker>
    </mt-popup>
    <footer class="footer">
      <button class="save-btn" @click="saveSetting">保存</button>
    </footer>
  </div>
</template>

<script>
  import Header from '@/components/Head'
  import {Actionsheet, Indicator, Toast, MessageBox, Picker, Popup} from 'mint-ui';
  export default {
    name: 'addressEdit',
    data () {
      return {
        showSelect:false,
        addressInfo:{},
        inputAddress:'',
        selectAddress:'',
        reg:{},
        nameErrMsg:'',
        telErrMsg:'',
        addressErr:'',
        errAddressMsg:'',
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
        cityArrObj:[],
        provinceArr:[],
      }
    },
    created(){
        if(sessionStorage.getItem('receiveAddress')){
          this.addressInfo = JSON.parse(sessionStorage.getItem('receiveAddress'))
          sessionStorage.removeItem('receiveAddress')
        }
    },
    components:{
      'el-header':Header,
      'mt-picker':Picker,
      'mt-popup':Popup,
    },
    methods: {
      goToShopSignature () {
          this.$router.push({name:'ShopSignature'})
      },
      chooseAddress () {
          this.showSelect = true
        let that = this;
        window.ADDRESS.forEach(function (m) {
          that.provinceArr.push(m.name);//省份数组
          that.cityArrObj[m.name] = m.sub//城市数组对象
        });
        this.slots[0].defaultIndex = 0;
        this.slots[2].defaultIndex = 0;
        this.slots[4].defaultIndex = 0;
        this.slots[0].values = this.provinceArr;//设置身省份
//        var UIActionSelector = api.require('UIActionSelector');
//        UIActionSelector.open({
//          datas: this.jsonData,
//          layout: {
//            row: 5,                            //（可选项）数字类型；每屏显示的数据行数，超出的数据可以滑动查看，只能是奇数；默认：5
//            col: 3,                            //（可选项）数字类型；数据源的数据级数，最多3级；默认：3
//            height: 30,                        //（可选项）数字类型；每行选项的高度；默认：30
//            size: 12,                          //（可选项）数字类型；普通选项的字体大小；默认：12
//            sizeActive: 14,                     //（可选项）数字类型；当前选项的字体大小；默认：同 size
//            rowSpacing: 5,                     //（可选项）数字类型；行与行之间的距离；默认：5
//            colSpacing: 10,                    //（可选项）数字类型；列与列之间的距离；默认：10
//            maskBg: 'rgba(0,0,0,0.2)',         //（可选项）字符串类型；遮罩层背景，点击该区域隐藏选择器，支持 rgb，rgba，#，img；默认：rgba(0,0,0,0.2)
//            bg: '#fff',                        //（可选项）字符串类型；选择器有效区域背景，支持 rgb，rgba，#，img；默认：#fff
//            color: '#888',                     //（可选项）字符串类型；选项的文字颜色，支持 rgb，rgba，#；默认：#848484
//            colorActive: '#008842',
//            colorSelected: '#008842'            //（可选项）字符串类型；已选项的文字颜色，支持 rgb，rgba，#；默认：同 colorActive
//          },
//          cancel: {
//            text: '取消',
//            size: 14,
//            bgActive: '#008842',
//            color: '#008842',
//            colorActive: '#fff'
//          },
//          ok: {
//            text: '确定',
//            size: 14,
//            bg: '#008842',
//            bgActive: '#fff',
//            color: '#fff',
//            colorActive: '#008842'
//          },
//          title: {
//            text: '请选择地区',
//            size: 12,
//            h: 44,
//            bg: '#eee',
//            color: '#008842'
//          },
//        }, (ret, err)=>{
//          if (ret) {
//            if(ret.eventType=='ok'){
//              this.province=ret.level1,
//              this.city=ret.level2,
//              this.country=ret.level3
//            }
//          } else {
////            alert(JSON.stringify(err));
//          }
//        });
      },
      selectSure(){//地址选择确认
        this.addressInfo.province = this.selectVal.province
        this.addressInfo.city = this.selectVal.city
        this.addressInfo.area = this.selectVal.country
        this.showSelect = false
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
      saveSetting () {
        console.log(!this.addressInfo.province)
          if(!this.addressInfo.name || !this.reg.name.test(this.addressInfo.name.trim())){
            this.nameErrMsg = '请正确填写送货人'
            return
          }else if(!this.addressInfo.phone || !this.reg.tel.test(this.addressInfo.phone.trim())){
            this.nameErrMsg = ''
            this.telErrMsg = '请正确填写手机号码'
            return
          }else if(!this.addressInfo.province){
            this.telErrMsg = ''
            this.errAddressMsg = '请填选择城市地址'
            return
          }else if(!this.addressInfo.address){
            this.errAddressMsg = ''
            this.addressErr = '请填写具体地址'
            return
          }
        this.nameErrMsg = ''
        this.telErrMsg = ''
        this.addressErr = ''
        this.errAddressMsg = ''
        console.log(this.addressInfo)
        if(this.addressInfo.id){
              this.editAddress()
        }else{
            this.addNewAddress()
        }

      },
      addNewAddress(){
        this.$http.post(this.API.receive_address_add,this.addressInfo).then(res=>{
          console.log(res.data)
          if(res.data.status==1){
//                localStorage.setItem('addressInfo',JSON.stringify(this.addressInfo))
//                Toast({
//                  message: '保存成功',
//                  iconClass: 'mintui mintui-success'
//                });
            this.G.goBack()
          }
          Indicator.close()
        }).catch(err=>{
          console.log(err)
          Indicator.close()
        })
      },
      editAddress(){
        this.$http.post(this.API.receive_address_update,this.addressInfo).then(res=>{
          console.log(res.data)
          if(res.data.status==1){
//                localStorage.setItem('addressInfo',JSON.stringify(this.addressInfo))
//                Toast({
//                  message: '保存成功',
//                  iconClass: 'mintui mintui-success'
//                });
            this.G.goBack()
          }
          Indicator.close()
        }).catch(err=>{
          console.log(err)
          Indicator.close()
        })
      }
    },
    mounted () {
      this.reg.tel = new RegExp(/^1[3|4|5|7|8][0-9]{9}$/);// 手机号码验证
      this.reg.name = new RegExp(/^[\u4E00-\u9FA5A-Za-z]+$/) //用户姓名
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

  .send-address-list>li>textarea{
    font-size: 1.333rem;
    min-height: 5rem;
    height:auto;
    width: 100%;
    padding-top: 1rem;
    white-space: normal;
  }
  .send-address-list>li>input{
    width: 70%;
    float: right;
    text-align: right;
    height: 3.888rem;
    font-size: 1.333rem;
  }
  .send-address-list>li>span{
    display: inline-block;
    width: 50%;
    float: right;
    text-align: right;
  }
  .send-address-list>li>p.err-msg{
    color: #ff5956;
    font-size: 12px;
    left: 9rem;
    right: initial;
  }
  .send-address-list>li>p{
    display: inline-block;
    color: #5f646e;
  }
  .send-address-list>li{
    width: 100%;
    background-color: #ffffff;
    padding: 0 1rem;
    border-bottom:1px solid #efefef;
    line-height: 3.888rem;
    font-size: 1.333rem;
    position: relative;
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
