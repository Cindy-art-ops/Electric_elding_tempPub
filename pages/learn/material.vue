<template>
  <view class="page">
    <view class="title">学习资料</view>
    <text>当前章节：{{ chapter }}</text>
    <view class="card">
      <text>这里展示章节资料列表（文档、图片、视频等）</text>
    </view>
  </view>
</template>
<script>
export default {
  data() {
    return { chapter: "" };
  },
  onLoad(q) {
    this.chapter = q?.chapter || "";
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
.card {
  margin-top: 16rpx;
  background: #fff;
  padding: 20rpx;
  border-radius: 12rpx;
}
</style>
