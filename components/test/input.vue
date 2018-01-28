<template>
  <div  class="">
    <input :type="type" :placeholder="placeholder"
           v-bind:value="value"
           v-on:input="updateValue($event.target.value)"
           v-on:focus="selectAll"
           v-on:blur="formatValue($event.target.value)">
    <p v-if="!verifiedResults">{{errMsg}}</p>
    <p v-if="verifiedEmpty">不能为空</p>
  </div>
</template>
<script>

  export default({
    data(){
      return {
        reg:{},
        verifiedResults:true,
        resultValue:'',
        verifiedEmpty:false,
      }
    },
    props:['type','placeholder','errMsg','value','regType'],
    methods:{
      updateValue(value) {  // 更新input数据 传递到父组件
////        let resultValue = value.trim().slice(0, value.indexOf('.') + 3)
//        console.log(value)
//        console.log(value.indexOf('.'))
//        if(value.indexOf('.')!==-1){
//          this.resultValue = value.trim().slice(0 , value.indexOf('.')+ 3)
//        }else{
//          this.resultValue = value
//        }
//        this.$refs.input.value = this.resultValue
////        this.$refs.input.value = resultValue
        this.$emit('input',value)
      },
      formatValue(value){
         if(this.reg.empty.test(value)){
           this.verifiedEmpty = true
           return
         }
        this.verifiedEmpty = false
//         if((this.reg[this.regType]).test(value)){
//             console.log('对的')
//           this.verifiedResults = false
//         }else{
//             console.log('错的')
//           this.verifiedResults = true
//         }

//          console.log(value)
//         console.log(this.toDecimal2(value))
//        this.resultValue = this.toDecimal2(value)
//        this.$refs.input.value = this.resultValue
        this.$emit('formatValue',value)
        this.verifiedResults = (this.reg[this.regType]).test(value)
//        this.$emit('verifyResult',value)
      },
      selectAll: function (event) {
//        setTimeout(function () {
//          event.target.select()
//        }, 0)
      },
      toDecimal2 (x) { // 保留两位小数
        var f = parseFloat(x);
        if (isNaN(f)) {
          return '';
        }
        var f = Math.round(x * 100) / 100;
        var s = f.toString();
        var rs = s.indexOf('.');
        if (rs < 0) {
          rs = s.length;
          s += '.';
        }
        while (s.length <= rs + 2) {
          s += '0';
        }
        return s;
      },
    },
    mounted () {
        this.reg.userName = new RegExp(/^[A-Za-z0-9_-]*$/)
        this.reg.price = new RegExp(/^(0|[1-9][0-9]{0,9})(\.[0-9]{1,2})?$/)
        this.reg.empty = new RegExp(/^\s*$/)
        this.reg.number = new RegExp (/^\d+(\.\d+)?$/) // 数字验证
        this.reg.number_2 = new RegExp (/^[0-9]+(.[0-9]{2})?$/)
        this.reg.text = new RegExp (/^[A-Za-z0-9]+$/) // 文本验证
        this.reg.tel = new RegExp(/^1[3|4|5|7|8][0-9]{9}$/)// 手机号码验证
    }
  })
</script>
<style>

</style>
