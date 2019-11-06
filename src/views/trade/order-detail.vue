<style lang="scss" scoped>
.steps-wrap {
  padding: 20px 50px;
}

.section {
  padding: 20px 10px;

  & + .section {
    margin-top: 10px;
    border-top: 1px solid #eee;
  }

  .section-title {
    font-size: 16px;
    margin-bottom: 20px;
  }
}

.info-wrap {
  .info {
    display: flex;
    font-size: 14px;
    margin-bottom: 8px;
    color: #777;
    .info-label {
      width: 80px;

      &.right{
        text-align: right;
      }
    }

    .info-value {
      color: #333;
      flex:1;
      padding-left: 15px;

      &.right{
        text-align: right;
      }
    }
  }
}
</style>

<template>
  <div class="app-container">
    <div class="section">
      <h2 class="section-title">订单状态</h2>

      <div class="steps-wrap">
        <!-- 交易取消 -->
        <div v-if="detail.status == 9" class>
          <el-steps :active="2" align-center finish-status="error">
            <el-step title="下单成功" :description="detail.createTime"></el-step>
            <el-step title="交易取消" :description="detail.endTime"></el-step>
          </el-steps>
        </div>
        <el-steps v-else :active="Number(detail.status)" align-center>
          <el-step title="下单成功" :description="detail.createTime | parseTime"></el-step>

          <el-step
            v-if="detail.status >= 2"
            title="买家已付款"
            :description="detail.payTime | parseTime"
          ></el-step>
          <el-step v-else title="待付款"></el-step>

          <el-step
            v-if="detail.status >= 3"
            title="买家已发货"
            :description="detail.deliverTime | parseTime"
          ></el-step>
          <el-step v-else title="待发货"></el-step>

          <el-step v-if="detail.status >= 4" title="交易完成" :description="detail.endTime | parseTime"></el-step>
          <el-step v-else title="待收货"></el-step>
        </el-steps>
      </div>
      <div>
        <el-button v-if="detail.status == 2" type="primary" @click="handleDeliver(detail)">发货</el-button>
      </div>
    </div>

    <div class="section">
      <h2 class="section-title">订单信息</h2>

      <div class="info-wrap">
        <div class="info">
          <div class="info-label">订单编号</div>
          <div class="info-value">{{detail.orderNo}}</div>
        </div>
        <div class="info" v-if="detail.createTime">
          <div class="info-label">创建时间</div>
          <div class="info-value">{{detail.createTime | parseTime}}</div>
        </div>
        <div class="info" v-if="detail.payTime">
          <div class="info-label">付款时间</div>
          <div class="info-value">{{detail.payTime | parseTime}}</div>
        </div>
        <div class="info" v-if="detail.deliverTime">
          <div class="info-label">发货时间</div>
          <div class="info-value">{{detail.deliverTime | parseTime}}</div>
        </div>
        <div class="info" v-if="detail.endTime">
          <div class="info-label">成交时间</div>
          <div class="info-value">{{detail.endTime | parseTime}}</div>
        </div>
      </div>
    </div>

    <div class="section">
      <h2 class="section-title">收货人信息</h2>

      <div class="info-wrap">
        <div class="info">
          <div class="info-label">收货人</div>
          <div
            class="info-value"
          >{{`${detail.receiverProvince}${detail.receiverCity}${detail.receiverArea} ${detail.receiverDetailAddr}`}}</div>
        </div>
        <div class="info">
          <div class="info-label">收货地址</div>
          <div class="info-value">{{detail.createTime}}</div>
        </div>
        <div class="info">
          <div class="info-label">联系方式</div>
          <div class="info-value">{{detail.receiverPhone}}</div>
        </div>
      </div>
    </div>

    <div class="section">
      <h2 class="section-title">商品清单</h2>

      <el-table row-key="id" :data="detail.order_items" fit style="width: 100%;">
        <el-table-column label="商品图片" prop="itemImg" width="80">
          <template slot-scope="{row}">
            <img style="width:60px" :src="row.itemImg" alt />
          </template>
        </el-table-column>

        <el-table-column label="商品" prop="itemName">
          <template slot-scope="{row}">
            {{row.itemName}}
            <span style="color:#aaa">({{row.itemPropvalues}})</span>
          </template>
        </el-table-column>

        <el-table-column label="商品价格" prop="itemPrice" />

        <el-table-column label="数量" prop="quantity" />

        <el-table-column label="总价" >
          <template slot-scope="{row}">
            {{row.itemPrice * row.quantity}}
          </template>
        </el-table-column>
      </el-table>

      <div style="display:flex;justify-content:flex-end;margin-top:30px;">
        <div class="info-wrap" style="min-width:150px;">
          
          <div class="info" >
            <div class="info-label right">商品小计</div>
            <div class="info-value right">￥{{detail.itemFee}}</div>
          </div>
          <div class="info">
            <div class="info-label right">运费</div>
            <div class="info-value right">￥{{detail.postFee}}</div>
          </div>
          <div class="info" v-if="detail.discountFee > 0">
            <div class="info-label right">优惠券减免</div>
            <div class="info-value right">￥{{detail.discountFee}}</div>
          </div>
          <div class="info">
            <div class="info-label right">总金额</div>
            <div class="info-value right">￥{{detail.orderFee}}</div>
          </div>
        </div>
      </div>
    </div>

    <DeliverDialog
      v-bind="dialog"
      :visible.sync="dialog.visible"
      @dataSubmited="handleDeliverSubmited"
    />
  </div>
</template>

<script>
import DeliverDialog from "./components/order-deliver";

export default {
  components: {
    DeliverDialog
  },
  data() {
    return {
      orderId: "",

      detail: {},

      // dialog
      dialog: {
        id:'',
        visible: false,
      }
    };
  },
  methods: {
    async loadDetail() {
      let res = await this.$api.order.detail(this.orderId);

      this.detail = res.data;
    },

    //发货
    handleDeliver(row) {
      this.dialog.id = row.id;
      this.dialog.visible = true;
    },

    handleDeliverSubmited() {
      this.loadDetail();
    }
  },
  created() {
    this.orderId = this.$route.params.orderId;

    this.loadDetail();
  }
};
</script>

