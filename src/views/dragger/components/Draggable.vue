<style lang="scss">
@import "../draggable.scss";
</style>
<script>
import Draggable from "../draggable";

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
      this.draggable.refreshData(value);
    }
  },

  render(h) {
    const children = this.$slots.default;
    return children && children[0];
  },
  methods: {
    handleUpdate(data) {
      data = [
        ...data
      ];
      this.$emit("input", data);
      this.$nextTick(() => {
        this.draggable.refresh();
      });
    }
  },
  mounted() {
    this.draggable = new Draggable(this.$el, this.value, {
      ...this.options,
      autoTransfer: false,
      onUpdate: this.handleUpdate
    });
  }
};
</script>
