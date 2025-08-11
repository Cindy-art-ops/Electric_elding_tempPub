<template>
  <view class="page">
    <view class="title">我的练习记录</view>
    <view class="card" v-for="i in 5" :key="i"
      >2025-08-0{{ i }} · 示例记录 {{ i }}</view
    >
    <button class="btn-primary" @tap="sync">同步</button>
  </view>
</template>
<script>
export default {
  methods: {
    sync() {
      uni.showToast({ title: "同步已触发", icon: "none" });
    },
  },
};
</script>
<style lang="scss">
$primary: #d32f2f;
.page {
  padding: 24rpx;
}
.title {
  font-size: 32rpx;
  font-weight: 600;
  margin-bottom: 16rpx;
}
.card {
  background: #fff;
  border-radius: 12rpx;
  padding: 16rpx;
  margin-bottom: 12rpx;
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.06);
}
.btn-primary {
  background: $primary;
  color: #fff;
}
</style>
