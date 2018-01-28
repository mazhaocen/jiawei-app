<template>
  <div class="addressManage">
    <el-header title='收货地址管理' className="go_back" style="border-bottom: 1px solid #efefef">
      <!--<a class="set" @click="goToSetCenter"></a>-->
    </el-header>
    <section class="content">
      <ul class="address-list cl">
        <li class="cl" v-for="(i,index) in addressList">
          <p><span>{{i.name}}</span><span class="fr">{{i.phone}}</span></p>
          <span>{{i.province}}{{i.city}}{{i.area}}{{i.address}}</span>
          <div class="cl addressEdit"><span class="fl pr" @click="setDefault(i.id)"><i :class="{'on':i.isDefault}"></i>设为默认</span>
            <p class="fr">
              <button @click="goToAddressEdit(i)">编辑</button>
              <button @click="delAddress(i.id,index)">删除</button>
            </p>
          </div>
        </li>
      </ul>
    </section>
    <p class="addNewAddress" @click="goToAddressEdit">＋新增地址</p>
  </div>
</template>

<script>
  import Footer from '@/components/Foot'
  import Header from '@/components/Head'
  import {Popup} from 'mint-ui';
  export default {
    name: 'addressManage',
    data () {
      return {
        addressList: {}
      }
    },
    created(){
      this.getMyAddressList()//获取地址列表
    },
    components: {
      'el-footer': Footer,
      'el-header': Header,
      'mt-popup': Popup
    },
    methods: {
      goToAddressEdit(item){//编辑地址
        if (item) {
          sessionStorage.setItem('receiveAddress', JSON.stringify(item))
        }
        this.$router.push({name: 'addressEdit'})

      },
      delAddress(id, index){//删除地址
        this.$http.post(this.API.receive_address_del, {
          id: id
        }).then(res => {
          console.log(res.data)
          if (res.data.status == 1) {
            this.addressList.splice(index, 1)
          }
        }).catch(err => {
          console.log(err)
        })
      },
      setDefault(id){//设置默认收货地址
        this.$http.post(this.API.receive_address_default, {
          id: id
        }).then(res => {
          console.log(res.data)
          this.getMyAddressList()
        }).catch(err => {
          console.log(err)
        })
      },
      getMyAddressList(){
        this.$http.post(this.API.receive_address_my, {}).then(res => {
          this.addressList = res.data.data.data;
          localStorage.setItem('myAddressList',JSON.stringify(this.addressList))
        }).catch(err => {
          console.log(err)
        })
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .addressEdit > span {
    padding-left: 2rem;
  }

  .addressEdit > span > i.on {
    background-color: #008842;
    border: none;
  }

  .addressEdit > span > i.on:after {
    content: '';
    display: block;
    width: 0.5rem;
    height: 1rem;
    border-bottom: 1px solid #fff;
    border-right: 1px solid #fff;
    -webkit-transform: rotate(45deg);
    transform: rotate(45deg);
    position: absolute;
    top: 0.1rem;
    right: 0.5rem;
  }

  .addressEdit > span > i {
    width: 1.6rem;
    height: 1.6rem;
    display: inline-block;
    border-radius: 50%;
    border: 1px solid #ddd;
    position: absolute;
    left: 0;
    top: 1.2rem;
    box-sizing: border-box;
  }

  .addressEdit button {
    background-color: #fff;
    border: 1px solid #666;
    padding: .2rem 1rem;
    font-size: 1.1rem;
    margin-left: 1rem;
  }

  .addressEdit {
    border-top: 1px solid #efefef;
    height: 4rem;
    line-height: 4rem;
  }

  .address-list > li > span {
    font-size: 1.1rem;
    height: 2.5rem;
    line-height: 2.5rem;
    color: #999;
  }

  .address-list > li {
    padding-top: 1rem;
    width: 100%;
    font-size: 1.3rem;
    border-bottom: .3rem solid #efefef;
  }

  .address-list {
    padding: 0 1rem;
  }

  .addNewAddress {
    position: absolute;
    bottom: 0;
    width: 100%;
    line-height: 3.611rem;
    background-color: #008842;
    color: #fff;
    font-size: 1.2rem;
    text-align: center;
  }
</style>
