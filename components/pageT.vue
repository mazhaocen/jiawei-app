<template>

    <transition :name="transitionName" @before-Leave="beforeLeave" class="Router">
      <slot></slot>
    </transition>

</template>

<script>
export default {
  name: 'hello',
  data () {
    return {
      transitionName: 'slide'  // 默认动态路由变化为slide-right
    }
  },
  created(){

  },
//  activated(){
//    if(window.isGoBack){
//      this.transitionName ='del';
//    }else{
//      this.transitionName ='slide';
//    }
//    // console.log(this.transitionName);
//    window.isGoBack = false;
//  },

//  watch: {
//    '$route' (to, from) {
//        // console.log(window.isGoBack);
//
//    }
//  },
  methods:{
    beforeLeave(el){
      if(window.isGoBack){
        this.transitionName ='del';
      }else{
        this.transitionName ='slide';
      }
      // console.log(this.transitionName);
      window.isGoBack = false;
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

  .slide-enter{
    -webkit-transform: translate(100%, 0);
    transform: translate(100%, 0);
  }
  .slide-enter-active{
    transition: all .3s ease;
  }
  .slide-leave-to{
    -webkit-transform: translate(0, 0);
    transform: translate(0, 0);
  }
  .slide-leave-active{
    /*z-index: 100;*/
    transition: all .3s ease;
  }


  /*.del-enter{*/
    /*-webkit-transform: translate(100%, 0);*/
    /*transform: translate(100%, 0);*/
  /*}*/
  /*.del-enter-active{*/
    /*!*z-index: 99;*!*/
    /*transition: all .3s ease;*/
  /*}*/

  .del-leave-to{
    -webkit-transform: translate(-100%, 0);
    transform: translate(-100%, 0);
  }
  .slide-leave-active{
    z-index: 200;
    background-color: #ffffff;
    transition: all 10s ease;
  }
</style>
