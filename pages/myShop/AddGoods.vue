<template>
  <div class="add_goods">
    <el-header v-if="!goodsId" title='发布商品' className="go_back"></el-header>
    <el-header v-if="goodsId" title='编辑商品' className="cancel"></el-header>
    <section class="content" style="padding-bottom: 0">
      <div class="goods-img cl">
        <i v-for="(img,index) in goods.imgList" @click="choosePic(index,'head')">
          <b v-if="goodsId" @click.stop="deleteImg(index)">×</b>
          <img v-lazy="img" alt="">
        </i>
        <i v-if="goods.imgList.length<4" @click="choosePic(-1,'head')">
          <span style="font-size: 5rem;color: #999;">+</span>
          <p>添加图片</p>
        </i>

      </div>
      <form action="">
        <div class="pd-1 goods-title pr">
          <p>商品名称</p>
          <input type="text" v-model.trim="goods.name" maxlength="30" v-on:blur="inputBlur(goods.name,'name')"
                 placeholder="请输入商品名称">
          <span style="line-height: 3rem;">{{goods.name.length}}/30</span>
          <b>{{titleErrMsg}}</b>
        </div>
        <div class="pd-1 goods-title pr" style="border: none;">
          <p style="line-height: 2rem">商品描述</p>
          <input v-model.trim="goods.detail" maxlength="100" v-on:blur="inputBlur(goods.detail,'description')"
                 style="width: 100%;margin: 0" placeholder="请输入商品描述">
          <span style="line-height: 3rem">{{goods.detail?goods.detail.length:0}}/100</span>
          <b>{{descriptionErr}}</b>
        </div>
        <div class="goods-msg">
          <div @click="popupVisible = true">
            <span>类目 </span>
            <!--<input type="text" :value="goods.typeList | typeFilter(goods.typeList)" placeholder="请选择商品类型" readonly>-->
            <input type="text" :value="goods.typeList" placeholder="请选择商品类型" readonly>
            <b>{{typeErrMsg}}</b>
          </div>
          <div>
            <span>原价</span>
            <input maxlength="10" type="number" v-model.trim="goods.oldPrice" placeholder="0.00"
                   v-on:blur="inputBlur(goods.oldPrice,'oldPrice')"
                   v-on:focus="inputFocus($event)"><i>/500g</i>
          </div>
          <div>
            <span>价格 </span>
            <input maxlength="10" type="number" v-model.trim="goods.presentPrice" placeholder="0.00"
                   v-on:blur="inputBlur(goods.presentPrice,'presentPrice')"
                   v-on:focus="inputFocus($event)"><i>/500g</i>
          </div>
          <div>
            <span>库存 </span>
            <input maxlength="10" type="number" v-model.trim="goods.stock" placeholder="0"
                   v-on:blur="inputBlur(goods.stock,'stock')"
                   v-on:focus="inputFocus($event)"><i>/份</i>
          </div>
          <div>
            <span>运费 </span>
            <input maxlength="10" type="number" v-model.trim="goods.freight" placeholder="0.00"
                   v-on:blur="inputBlur(goods.freight,'freight')"
                   v-on:focus="inputFocus($event)"><i>/元</i>
          </div>
          <div class="keywords cl">
            <span>关键词</span>
            <ul class="cl fl">
              <li v-for="(key,index) in goods.keywordList">{{key}} <i @click="delKeyWords(index)">×</i></li>
            </ul>
            <a class="fl" @click="addKeyWord" v-if="goods.keywordList.length<3">添加</a>
            <i>{{goods.keywordList.length}}/3</i>
          </div>
          <p style="padding-left: 1rem;color: #007aff;">关键词(如：青菜、牛肉)方便用户搜索到您的商品</p>
          <div >
            <p>宝贝详情</p>
            <ul class="detailImgList cl">
              <li v-for=" (img,index) in goods.detailImgList " @click="choosePic(index,'detail')">
                <img v-lazy="img" alt="">
                <!--<b v-if="goodsId" @click.stop="delDetailImg(index)">×</b>-->
                <b @click.stop="delDetailImg(index)">×</b>
              </li>
              <div class="add_detailImg" v-if="goods.detailImgList.length<6" @click="choosePic(-1,'detail')"></div>
            </ul>
          </div>
        </div>
        <div class="my-shop-btn">
          <button type="button" @click="saveORPutAway('0')">放入仓库</button>
          <button type="button" @click="saveORPutAway('1')">立即发布</button>
        </div>
      </form>
    </section>
    <div class="footer replay" v-if="addKeyWords">
      <input ref="searchInput" :placeholder="placeholder" type="text" v-on:blur="changeCount()" v-model="replayContent">
      <span class="fr" @click="addKeySure">确定</span>
    </div>
    <mt-popup v-model="popupVisible" position="bottom" class="type-list">
      <p>商品类别：</p>
      <ul class="goodsType">
        <li v-for="item in goodsType" :class="{'on':goods.typeList.indexOf(item.name)!=-1}" @click="chooseGoodsType(item.name)">{{item.name}}</li>
      </ul>
    </mt-popup>
    <mt-actionsheet :actions="actions" v-model="sheetVisible"></mt-actionsheet>
    <image-clip class="the-top" v-if="imageClip" :imgUrl="fsImgUrl" v-on:clipImage='resultImage' :ratio="ratio"></image-clip>
  </div>
</template>

<script>
  import Footer from '@/components/Foot'
  import Header from '@/components/Head'
  import {Popup, MessageBox, Toast, Actionsheet, Indicator} from 'mint-ui';
  import ImageClip from '@/pages/takePhoto/ImageClip'
  export default {
    name: 'AddGoods',
    data () {
      return {
        sheetVisible: false,
        popupVisible: false,
        replayContent:'',
        actions: [
          {
            name: '拍照',
            method: this.openCamera
          }, {
            name: '在相册中选择',
            method: this.openAlbum
          }
        ],
        addKeyWords:false,
        goodsType: [],
        goods: {
          shopId: '',
          name: '',
          typeList: [],
          oldPrice: 0,
          presentPrice: 0,
          stock: 0,
          imgList: [],
          detail: '',
          freight: '',
          detailImgList: [],
          keywordList:[]
        },
        titleErrMsg: '',
        typeErrMsg: '',
        descriptionErr: '',
        fsImgUrl: '',
        imageClip: false,
        picNum: -1,
        imgHeight: '',
        picType: '',
        ratio: 1,
        goodsId: 0,
        typeName:'',
        placeholder:'请输入关键词，方便用户搜索到您的商品'
      }
    },
    components: {
      'el-footer': Footer,
      'el-header': Header,
      'mt-popup': Popup,
      'mt-actionsheet': Actionsheet,
      'image-clip': ImageClip
    },
    created(){
      this.shopInfo = JSON.parse(localStorage.getItem('shopInfo'))
      this.goodsId = this.$route.params.goodsId
      if(!window.goodsType){
        this.$http.post(this.API.my_shop_goods_type, {}).then(res => {//获取商品分类列表
          // console.log(res.data)
         this.goodsType = window.goodsType = res.data.data.data;
          if (this.goodsId) {
            this.getGoodsInfo()//获取单个商品详情
          }
        }).catch(err => {
          // console.log(err)
        })
      }else{
        this.goodsType = window.goodsType;
        if (this.goodsId) {
          this.getGoodsInfo()//获取单个商品详情
        }
      }
      window.page='AddGoods'

    },
    destroyed () {
      window.page = ''
    },
    mounted () {
//      let that = this
//      api.addEventListener({
//        name: 'keyback'
//      }, function (ret) {
//        if (ret) {
//
//        }
//      })
    },
    methods: {
      getGoodsInfo(){//当编辑情况下时 调用此函数
        Indicator.open()
        this.$http.post(this.API.my_shop_goods_show, {//获取单个商品详情
          id: this.goodsId
        }).then(res => {
          this.goods = res.data.data;
          Indicator.close()
        }).catch(err => {
          Indicator.close()
          // console.log(err)
        })
      },
      addKeyWord(){//添加关键词
        this.addKeyWords = true;
        this.replayContent='';
        setTimeout(()=>{
            if(this.addKeyWords){
              this.$refs.searchInput.focus();
            }
        },100)
      },
      changeCount(){//添加关键词输入框 失去焦点事件
        setTimeout(()=>{
          this.addKeyWords = false
        })
      },
      addKeySure(){//确定添加关键词
        this.goods.keywordList.push(this.replayContent)
        this.addKeyWords = false
      },
      delKeyWords(index){//删除关键词标签
        this.goods.keywordList.splice(index,1)
      },
      delDetailImg(index){//删除 详情图片
        this.goods.detailImgList.splice(index,1)
      },
      inputBlur(value, type){
        switch (type) {
          case 'name':
            break
          case 'type':
            break
          case 'presentPrice':
            this.goods.presentPrice = this.toDecimal2(value)
            break
          case 'stock':
            this.goods.stock = parseInt(value)
            break
          case 'freight':
            this.goods.freight = this.toDecimal2(value)
            break
          case 'description':
            break
        }
      },
      inputFocus(e){
        setTimeout(() => {
          e.target.select()
        }, 0)
      },
      toDecimal2 (x) { // 保留两位小数
        let f = parseFloat(x);
        if (isNaN(f)) {
          return 0;
        }
        f = Math.round(f * 100) / 100;
        let s = f.toString();
        let rs = s.indexOf('.');
        if (rs < 0) {
          rs = s.length;
          s += '.';
        }
        while (s.length <= rs + 2) {
          s += '0';
        }
        return s;
      },
      // 保存仓库  立即发布
      saveORPutAway (type) {
        if (!this.verifiedInput()) {
          return
        }
        this.saveGoodsInfo(type)
      },
      // 验证输入
      verifiedInput(){
        this.titleErrMsg = ''
        this.typeErrMsg = ''
        this.descriptionErr = ''
//        // console.log(!this.goods.name, this.goods.typeList.length === 0, !this.goods.detail);
        if (!this.goods.name) {
          this.titleErrMsg = '请输入商品标题'
          return false
        } else if (this.goods.typeList.length === 0) {
          this.typeErrMsg = '请选择商品类型'
          return false
        } else if (!this.goods.detail) {
          this.descriptionErr = '请输入商品描述'
          return false
        }
        return true
      },
      choosePic(num, type){
        this.sheetVisible = true
        this.picNum = num
        if (type === 'head') {
          this.ratio = 0.659;
          this.picType = 'head'
        } else if (type === 'detail') {
          this.ratio = '';
          this.picType = 'detail'
        }
      },
      openCamera () { //拍照
        this.G.getPicture('camera', this).then(res => {
          this.fsImgUrl = res;
          if(this.picType==='detail'){
              this.resultImage(res)
          }else {
            this.imageClip = true
          }
        })
      },
      openAlbum () { // 相册
        this.G.getPicture('album', this).then(res => {
          this.fsImgUrl = res;
          if(this.picType==='detail'){
            this.resultImage(res)
          }else {
            this.imageClip = true
          }
        })
      },
      resultImage (url) {  //裁剪后的图片地址
        if (url) {
          this.G.getBase64Image(url, this.ratio).then(res => {
            // console.log('选择的序号' + this.picNum)
            // console.log(res)
            if (this.picNum >= 0) {
              if (this.picType === 'head') {
                this.goods.imgList.splice(this.picNum, 1, res)
              } else {
                this.goods.detailImgList.splice(this.picNum, 1, res)
//                this.goods.detailImgList[this.picNum] = res
              }
            } else {
              if (this.picType === 'head') {
                this.goods.imgList.push(res)
              } else {
                this.goods.detailImgList.push(res)
              }
            }
            // console.log(JSON.stringify(this.goods.imgList));
            // console.log(JSON.stringify(this.goods.detailImgList));
          });
        } else {
          this.picNum = -1
        }
        this.imageClip = false
      },
      //保存商品信息
      saveGoodsInfo (type) {
        let goods = JSON.parse(JSON.stringify(this.goods))
//        goods.type = goods.type.join(',')
        let imgListArr = []
        let detailImgListArr = [];
        goods.imgList.forEach(function (n) {
          // console.log('imglist' + JSON.stringify(n))
          if (n.indexOf('base64') != -1) {
            imgListArr.push(n.split(',')[1])
          } else {
            imgListArr.push(n)
          }
        });
        goods.detailImgList.forEach(function (m) {
          // console.log('detailImgList' + JSON.stringify(m))
          if (m.indexOf('base64') != -1) {
            detailImgListArr.push(m.split(',')[1])
          } else {
            detailImgListArr.push(m)
          }
        })
        goods.imgList = imgListArr
        goods.detailImgList = detailImgListArr
        goods.status=type
        goods.shopId = this.shopInfo.id;
        goods.shopType = this.shopInfo.type
        Indicator.open()
        if (this.goodsId) {
          // console.log('编辑保存'+JSON.stringify(goods));
          this.$http.post(this.API.my_shop_goods_edit, goods).then(res => {
            // console.log(JSON.stringify(res.data))
            if (res.data.status == 1) {
              this.G.goBack()
            }
            Indicator.close()
          }).catch(err => {
            // console.log(err)
            Indicator.close()
          })
        } else {
          // console.log('添加保存'+JSON.stringify(goods));
          this.$http.post(this.API.my_shop_goods_add, goods).then(res => {
            // console.log(JSON.stringify(res.data))
            if (res.data.status == 1) {
                this.G.goBack()
            }
            Indicator.close()
          }).catch(err => {
            // console.log(err)
            Indicator.close()
          })
        }
      },
      deleteImg(index){
          this.goods.imgList.splice(index,1)
      },
      chooseGoodsType(name){
          if(this.goods.typeList.indexOf(name)!=-1){
            this.goods.typeList.splice(this.goods.typeList.indexOf(name),1)
          }else{
            this.goods.typeList.push(name)
          }
      }
    }
  }
</script>

<style scoped>
  .type-list>p{
    padding:.5rem 1rem;
    /*background-color: #fff;*/
  }
  .goodsType>li.on{
    background-color: #008842;
    color: #fff;
  }
  .goodsType>li{
    background-color: #fff;
    -webkit-border-radius:10rem;
    -moz-border-radius:10rem;
    border-radius:10rem;
    padding: .2rem 1rem;
    margin: 1rem 1rem .5rem;
  }
  .keywords>span{
    margin-right: 1rem;
  }
  .keywords>a{
    border:1px solid #008842;
    border-radius: 3px;
    height: 2rem;
    line-height: 2rem;margin-top: 1rem;
    margin-left: 2rem;
    padding: 0 .5rem;
    color: #008842;
  }
  .keywords>ul>li>i{
    display: block;
    position: absolute;
    border-radius: 50%;
    background-color: #ddd;
    width: 1.3rem;
    height: 1.3rem;
    top: -0.6rem;
    right: -0.6rem;
    color: #000;
    text-align: center;
    line-height: 1.2rem;
    font-size: 1.2rem;
  }
  .keywords>ul>li{
    color: #fff;
    background-color: #008842;
    line-height: 2rem;
    height: 2rem;
    border-radius: 5px;
    padding: 0 .5rem;
    margin: 1rem 1rem 0 0;
    position: relative;
  }
  .replay.footer>span{
    background-color: #008842;
    color: #fff;
    border-radius: 3px;
    width: 4.5rem;
    text-align: center;
    font-size: 1.2rem;
    height: 2.6rem;
    line-height:2.6rem;
    margin-top: .555rem;
    margin-right: 2rem;
  }
  .replay.footer{
    padding-left:1rem;
    padding-top: .2rem;
    background-color: #eee;
  }
  .replay.footer>input{
    border: 1px solid #efefef;
    width: 21rem;
    border-radius: 3px;
  }
  .detailImgList > li > img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  .detailImgList > li {
    overflow: hidden;
    position: relative;
    float: left;
    width: 33.333%;
    height: 7rem;
    text-align: center;
    margin-bottom: .2rem;
  }

  .detailImgList {
    margin-bottom: 1rem;
  }

  .add_detailImg {
    float: left;
    width: 33.333%;
    height: 7.061rem;
    background: url("../../assets/img/myShop/add.png") #e0e0e0 no-repeat center center/2.833rem;
  }

  .type-list {
    width: 100%;
    background-color: #efefef;
    height: 40vh;
  }

  .goods-msg > div > span, .goods-msg > div > p {
    text-align: left;
    font-size: 1.2rem;
  }

  .goods-msg > div > span {
    display: block;
    float: left;

  }

  .goods-msg > div > b, .goods-title b {
    color: orangered;
    display: block;
    line-height: 1.6rem;
    text-align: right;
  }

  .goods-msg > div {
    padding: 0 1.111rem;
    line-height: 4rem;
    text-align: right;
    position: relative;
  }

  .goods-msg textarea {
    width: 100%;
    height: 4rem;
    border: 1px solid #efefef;
    padding: .5rem 1rem;
    white-space: normal;
  }

  .goods-msg input {
    width: 85%;
    margin-left: 1rem;
    padding-left: 1rem;
  }

  .goods-title > span, .goods-msg > div > i {
    right: 2rem;
    color: #cccccc;
    position: absolute;
  }

  .add_goods input {
    border-bottom: 1px solid #efefef;
    height: 3rem;
    padding-right: 4rem;
    font-size: 1.2rem;
  }

  .goods-title input {
    width: 100%;
    margin-bottom: 1rem;
    padding-left: 1rem;
    font-size: 1.2rem;
  }

  .goods-title>p {
    font-size: 1.2rem;
  }
  .goods-title {
    line-height: 2rem;
  }

  .goods-img > i > img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .goods-img > i>b,.detailImgList>li>b {
    display: block;
    width: 2rem;
    border-radius: 50%;
    background-color: #ff5956;
    height: 2rem;
    position: absolute;
    right: -0.5em;
    top: -0.5rem;
    font-size: 1.4rem;
    text-align: left;
    padding-left: 0.3rem;
    color: #fff;
    line-height: 2.1rem;
    box-sizing: border-box;
  }
  .goods-img > i {
    overflow: hidden;
    display: block;
    width: 49%;
    float: left;
    text-align: center;
    background-color: #efefef;
    /*background: url("../../assets/img/myShop/goodManage.png") no-repeat center center/100%;*/
    height: 10rem;
    margin-right: 1%;
    margin-bottom: 0.3rem;
    position: relative;
  }

  .goods-img {
    border-bottom: 2px solid #efefef;
    padding-left: 1%;
  }
</style>
