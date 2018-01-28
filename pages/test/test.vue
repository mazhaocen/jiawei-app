<template>
  <div class="delete_div">
    <!--<div class="cl pa">-->
      <!--<slider_delete :sliderConf="sliderConf" title='通知消息'>-->
        <!--<div class="content1">123</div>-->
      <!--</slider_delete>-->
      <!--<div class="delete_button"></div>-->
    <!--</div>-->

    <el-input type="number" placeholder="哈哈" class="inputCss" errMsg="请输入数字" v-model="test" regType ='number'></el-input>
    <el-input type="text" placeholder="oo" class="inputCss" errMsg="请输入数字字母或下划线" v-model="test1" regType = 'userName'></el-input>
    <el-input type="number" placeholder="" class="inputCss" errMsg="请输入正确的价格" v-model="test2" regType = 'price'></el-input>
    <el-input type="text"  class="inputCss" v-on:formatValue = "checkName" v-model="test3" regType = 'userName'></el-input>

  </div>
</template>
<script>
  import SliderDelete from "@/components/test/test1";
  import Input from "@/components/test/input";
  export default({
    data(){
      return {
        sliderConf:{//滑动配置
          distance:3,
        },
        test:'',
        test1:'',
        test2:'',
        test3:''
      }
    },
    methods:{
      getResult(value){
          console.log(value)
      },
      checkName(name){
          console.log(name)
      }
    },
    components:{
      "slider_delete":SliderDelete,
      "el-input":Input
    }
  })
</script>
<style>
  .inputCss{
    border:1px solid #ddd;
    -webkit-border-radius:3px;
    -moz-border-radius:3px;
    border-radius:3px;
    margin: 2rem;
    padding: 1rem;
  }
  .content1{
    background-color: #333;
    width: 100%;
    height: 3rem;
    color: #fff;
  }
  .delete_button{
    position: absolute;
    background-color: red;
    right: 0;
    width: 2rem;
    height: 3rem;
  }
  .delete_div{
    position: relative;
  }
</style>
