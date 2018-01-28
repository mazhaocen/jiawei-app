<template>
  <div class="slider_delete" :style="{webkitTransform:'translate3d('+transformX+'rem,0,0)'}"
       @touchstart.stop="touchStart($event)"
       @touchend.stop="touchEnd($event)"
       @touchmove.stop="touchMove($event)">
    {{title}}
  </div>
</template>
<script>
  /*
   * 滑动配置。distance 滑动距离
   */
  export default({
    data(){
      return {
        startPos:{x:0},
        endPos:{x:0},
        transformX:0,
        transformStartX:0,

      }
    },
    props:['sliderConf','title'],
    methods:{
      touchStart(e){
        e.preventDefault();
        this.startPos.x = e.targetTouches[0].screenX;
        this.transformStartX = this.transformX;
      },
      touchMove(e){
        e.preventDefault();
        var x = e.targetTouches[0].screenX;
        var temp = (x - this.startPos.x)/12;
        if(temp > this.sliderConf.distance || (this.transformX == 0 && temp > 0) ){
          this.transformX = 0;
        }else{
          this.transformX =this.transformStartX + temp;
        }
        console.log(this.transformX);
      },
      touchEnd(e){
        e.preventDefault();

        if(this.transformX > -1){
          this.transformX = 0;
        }else if(this.transformX < -1){
          this.transformX = -this.sliderConf.distance;
        }else{

        }
      }
    }
  })
</script>
<style>
  .slider_delete{
    width: 100%;
    position: absolute;
    left: 0;
    z-index: 100;
  }
</style>
