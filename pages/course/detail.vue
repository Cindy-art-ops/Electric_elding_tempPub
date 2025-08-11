<template>
  <view class="page">
    <view class="title">课程详情</view>
    <text>课程ID：{{ id }}</text>
  </view>
</template>
<script>
export default {
  data() {
    return { id: "" };
  },
  onLoad(q) {
    this.id = q?.id || "";
  },
};
</script>
<style>
.page {
  padding: 24rpx;
}
.title {
  font-size: 32rpx;
  font-weight: 600;
  margin-bottom: 16rpx;
}
</style>
