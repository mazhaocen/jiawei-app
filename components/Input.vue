<template>
  <div  class="">
    <input :type="type" :placeholder="placeholder"
           ref="input"
           v-bind:value="value"
           v-on:input="updateValue($event.target.value)"
           v-on:focus="selectAll"
           v-on:blur="formatValue($event.target.value)">
    <p v-if="!verifiedResults" class="err-msg">{{errMsg}}</p>
    <p v-if="isEmpty" class="err-msg">不能为空</p>
  </div>
</template>
<script>

  export default({
    data(){
      return {
        reg:{},
        verifiedResults:true,
        resultValue:'',
        isEmpty:false,
      }
    },
    props: {
      type: {
        type: String
      },
      placeholder: String,
      errMsg: String,
      value:[Number,String],
      regType: {
        type: String,
        default: 'normal'
      },
    },
    methods:{
      updateValue(value) {  // 更新input数据 传递到父组件
        this.$refs.input.value = value.trim()
        this.$emit('input',value.trim())
        this.$emit('formatValue',value.trim(),this.reg[this.regType].test(value))
      },
      formatValue(value){
         if(this.reg.empty.test(value)){
           this.isEmpty = true //结果为空
           this.$emit('formatValue',value,!this.isEmpty)
           return
         }
        this.isEmpty = false //不为空
        this.verifiedResults = (this.reg[this.regType]).test(value)
        this.$emit('blur',value,this.verifiedResults)
      },
      selectAll: function (event) {
        this.verifiedResults = true
        this.isEmpty = false //不为空
        setTimeout(function () {
          event.target.select()
        }, 0)
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
        this.reg.userName = new RegExp(/^[A-Za-z0-9_-]*$/) //字母 数字 下划线
        this.reg.price = new RegExp(/^(0|[1-9][0-9]{0,9})(\.[0-9]{1,2})?$/)
        this.reg.empty = new RegExp(/^\s*$/)//为空
        this.reg.number = new RegExp (/^\d+(\.\d+)?$/) // 数字验证
        this.reg.password = new RegExp (/\S{6,}/) // 密码6个以上字符
        this.reg.number_2 = new RegExp (/^[0-9]+(.[0-9]{2})?$/)
        this.reg.text = new RegExp (/^[A-Za-z0-9]+$/) // 文本验证
        this.reg.tel = new RegExp(/^1[3|4|5|7|8][0-9]{9}$/)// 手机号码验证
        this.reg.normal = new RegExp(/[\s\S]*/)// 任意字符
    }
  })
</script>
<style>

</style>
