<template>
<div class="goodsDetail">
    <section>
      <img class="detail-img" v-for="i in goodsInfo.detailImgList" :src="i" alt="">
    </section>
  </div>
</template>

<script>
export default {
  name: 'goodsDetail',
  data () {
    return {
    }
  },
  components:{
  },
  created(){

  },
  methods:{

  },
  props:['goodsInfo']
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.detail-img{
  width: 100%;
  display: block;
  height: 100%;
}
</style>
