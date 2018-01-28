<template>
  <div class="edit-div"
       v-html="innerText"
       :contenteditable="canEdit"
       @focus="isLocked = true"
       @blur="isLocked = false"
       @input="changeText">
  </div>
</template>

<script>
export default {
  name: 'editDiv',
  data(){
    return {
      innerText: this.value,
      isLocked: false
    }
  },
  props: {
    value: {
      type: String,
      default: ''
    },
    canEdit: {
      type: Boolean,
      default: true
    }
  },
  watch: {
    'value'(){
      if (!this.isLocked || !this.innerText) {
        this.innerText = this.value;
      }
    }
  },
  methods: {
    changeText(){
      this.$emit('input', this.$el.innerHTML);
    }
  },
  created(){

  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->

<style scoped>

  .edit-div {
    width: 100%;
    height: 100%;
    overflow: auto;
    word-break: break-all;
    outline: none;
    user-select: text;
    white-space: pre-wrap;
    text-align: left;
    min-height: 1.5rem;
  }
  .edit-div[contenteditable=true]{
     user-modify: read-write-plaintext-only;
  }

  .edit-div:empty:before {
     content: attr(placeholder);
     display: block;
     color: #ccc;
   }
</style>
