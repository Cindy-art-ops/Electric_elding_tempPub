<template>
  <view class="page">
    <view class="title">错题集</view>
    <view class="chapters">
      <view class="chapter" v-for="c in 3" :key="c">
        <text>焊接教学章节{{ c }}</text>
        <text class="count">错题 0 道</text>
      </view>
    </view>
  </view>
</template>
<script>
export default {};
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
.chapter {
  padding: 20rpx;
  background: #fff;
  border-radius: 12rpx;
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.06);
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.chapter + .chapter {
  margin-top: 16rpx;
}
.count {
  color: #999;
}
</style>
