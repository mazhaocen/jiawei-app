<template>
  <div id="app">
    <transition :name="transitionName">
      <keep-alive include="shop,character,live,shoppingCart,me">
        <router-view></router-view>
      </keep-alive>
    </transition>

  </div>
</template>

<script>
export default {
  name: 'app',
  data() {
    return {
      transitionName:'go',
      mainPage:['shop', 'character', 'live', 'shoppingCart', 'me']
    }
  },
  methods:{
      isMain(x){
         return this.mainPage.some(function (i) {
           return i === x
         })
      }
  },
  watch:{
      '$route'(to ,from){
//        let isBack = this.$router.isBack;  //  监听路由变化时的状态为前进还是后退
        if(window.isBack) {
          this.transitionName = 'back'
        } else {
          this.transitionName = 'go'
        }
        if( this.isMain(to.name) && this.isMain(from.name)){
          this.transitionName = ''
        }
        window.isBack = false
      }
  }
}
</script>

<style>
#app>div{
  width: 100%;
  position: absolute;
  background-color: #ffffff;
  transition: all .3s ease;
}
#app>div.v-leave-active,#app>div.v-enter-active{
  transition: all 0s ease;
}
#app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.go-enter, .back-leave-active {
  -webkit-transform: translate(100%, 0);
  transform: translate(100%, 0);
}

.go-leave-active, .back-enter {
  -webkit-transform: translate(-100%, 0);
  transform: translate(-100% 0);
}
  .main-enter,.main-leave-active{
    background-color: #fff;
  }
  .v-enter-to{
    z-index: 999;
  }
</style>
