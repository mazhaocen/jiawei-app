<!-- classType = go_back 返回-->



<template>
  <header class="header">
    <a v-if="className" :class="classType" @click="keyEvent"><span>取消</span></a>
    <span>{{title}}</span>
    <a v-if="set" :class="{set:set}"></a>
    <slot></slot>
  </header>
</template>

<script>
export default {
  name: 'head',
  data () {
    return {

    }
  },
  created(){
  },
  props:['title','className','goTo','set'],
  methods:{
    keyEvent () {
      if(this.className==='go_back' || this.className==='cancel'){
        window.isGoBack = true;
          if(this.goTo){
            this.$router.push({name:this.goTo})
          }else{
//            if(api.systemType=='android'){

//              let o = document.querySelector('.content')
//              // console.log(o.offsetHeight,document.getElementById('html').offsetHeight);


//              history.go(-1)

//            }else{
            if(window.page=='sellerStore'){
              sessionStorage.removeItem('shopId')
            }
              this.G.goBack()
//            }
          }

      }else{

      }
    }
  },
  computed: {
    classType: function () {
      return this.className
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .header{
    text-align: center;
    font-size: 1.333rem;
    color: #008842;

  }
  .header>a>span{
    display: none;
  }
  .header>a.cancel>span{
    display: block;
    font-size: 1.333rem;
    padding-left: 1rem;
  }
  .header>a{
    display: block;
    width: 3.611rem;
    height: 3.611rem;
    position: absolute;
    top:0;
    z-index: 200;
  }
  .cancel{
    content: '取消';
    color: #008842;
  }
  .go_back{
    background: url("../assets/img/head/goBack.png") no-repeat center center /.972rem;
    left:0;
  }
  .set{
    background: url("../assets/img/me/set.png") no-repeat center center /1.333rem;
    right:0;
  }

</style>
