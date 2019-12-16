<style lang="scss">
@import "../draggable.scss";
</style>
<script>
import Draggable from "../draggable";

function clone(data){
  return JSON.parse(JSON.stringify(data));
}

export default {
  abstract: true,

  props: {
    value: {
      type: Array,
      required: true
    },
    tag: {
      type: String,
      default: "div"
    },
    options: {
      type: Object,
      default() {
        return {};
      }
    }
  },

  data() {
    return {
      draggable: null
    };
  },

  watch: {
    value(value) {
      this.draggable.setData(value);

      this.$nextTick(() => {
        this.draggable.refresh();
      });
    }
  },

  render(h) {
    const children = this.$slots.default;
    return children && children[0];
  },
  methods: {
    handleChange(data) {
      // data = data;
      // console.log('handleChange', this.$el,data);
      this.$emit("input", data);
    }
  },
  mounted() {
    this.draggable = new Draggable(this.$el, this.value, {
      ...this.options,
      autoTransfer: false,
      onChange: this.handleChange
    });
  }
};
</script>
