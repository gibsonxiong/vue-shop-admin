<style lang="scss">
@import '../draggable.scss';
</style>
<script>
import Draggable from "../draggable";

export default {
  props:{
    tag:{
      type:String,
      default:'div'
    },
  },
  render(h) {
    const slots = this.$slots.default;
    return h(this.tag, {}, slots);
  },

  mounted() {
    new Draggable(this.$el);
  }
};
</script>
