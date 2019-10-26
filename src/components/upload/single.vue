<style lang="scss" scoped>

.feedback_add_img {
  display: flex;
  flex-wrap: wrap;
}

.remark_add {
  position: relative;
  width: 79px;
  height: 79px;
  color: #bcbcbc;
  text-align: center;
  border: 1px dashed #bcbcbc;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;

  .icon-camera_light {
    font-size: 25px;
  }

  p {
    font-size: 12px;
  }

  input {
    width: 79px;
    height: 79px;
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    opacity: 0;
  }
}

.img_box {
  width: 79px;
  height: 79px;
  position: relative;
  display: flex;
  margin: 5px;

}
.img_del {
  position: absolute;
  font-size: 20px;
  height: 25px;
  color: red;
  background: #fff;
  top: -13px;
  left: -8px;
  border-radius: 50%;
}
img {
  width: 100%;
  object-fit: cover;
  border: 1px solid #dcdcdc;
}
</style>
<template>
  <div class="feedback_add_img">
    <div v-if="value" class="img_box">
      <i class="img_del iconfont icon-roundclosefill" @click="remove" />
      <img :src="value">
    </div>
    <div v-if="!value" class="img_box">
      <div class="remark_add">
        <template v-if="uploadProgress >= 0">
          <el-progress :percentage="uploadProgress" :text-inside="true" :stroke-width="14" style="width:85%" />
          <p>上传中</p>
        </template>
        <template v-else>
          <i id="portrait" class="iconfont icon-camera_light" />
          <p>添加图片</p>
          <input
            type="file"
            name="file"
            accept="image/*"
            @change="handleInputChange($event)"
          >
        </template>
      </div>
    </div>
  </div>
</template>
<script>

export default {
  props: {
    value: {
      type: String
    }
  },
  data() {
    return {
      uploadProgress: -1
    }
  },
  created() {},
  methods: {
    remove() {
      this.$emit('input', '')
    },
    async handleInputChange(event) {
      // 图片预览
      const files = event.target.files

      try {
        const formData = new FormData()

        formData.append('img', files[0])

        this.uploadProgress = 0
        const res = await this.$api.upload(formData, e => {
          const p = (e.loaded / e.total) * 100
          this.uploadProgress = p

          if (p >= 100) {
            this.uploadProgress = -1
          }
        })

        this.$emit('input', res.data[0].src)
      } catch (err) {
        this.uploadProgress = -1
        return this.$message.error(err.message)
      }
    }
  }
}
</script>

