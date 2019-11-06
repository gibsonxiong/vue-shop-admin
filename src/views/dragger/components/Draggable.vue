<style lang="scss">
@import '../draggable.scss';
</style>
<script>
import draggable from "../draggable";

export default {
  props:{
    tag:{
      type:String,
      default:'div'
    }
  },
  render(h) {
    const slots = this.$slots.default;
    return h(this.tag, {}, slots);
  },

  mounted() {
    draggable(this.$el, function(item) {
      console.log(item);
    });
  }
};
</script>
