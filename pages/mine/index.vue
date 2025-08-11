<template>
  <scroll-view class="page" scroll-y>
    <!-- 设置 -->
    <view class="section">
      <view class="ios-large-title">设置</view>
      <view class="ios-group">
        <view class="ios-cell" @tap="go('/pages/settings/index?tab=font')">
          <text>字体</text>
          <text class="chevron">›</text>
        </view>
        <view class="ios-cell" @tap="go('/pages/settings/index?tab=theme')">
          <text>主题</text>
          <text class="chevron">›</text>
        </view>
        <view class="ios-cell" @tap="go('/pages/settings/index?tab=account')">
          <text>我的账号</text>
          <text class="chevron">›</text>
        </view>
      </view>
    </view>

    <!-- 错题集 -->
    <view class="section">
      <view class="ios-large-title">错题集</view>
      <view class="block ios-card" @tap="go('/pages/mistakes/index')">
        <text>按章节查看错题</text>
        <text class="chevron">›</text>
      </view>
    </view>

    <!-- 学习心得 -->
    <view class="section">
      <view class="ios-large-title">学习心得</view>
      <view class="block ios-card" @tap="go('/pages/notes/index')">
        <text>记录与回顾我的笔记</text>
        <text class="chevron">›</text>
      </view>
    </view>

    <!-- 我的练习记录 -->
    <view class="section">
      <view class="ios-large-title">我的练习记录</view>
      <view class="practice ios-card">
        <view class="summary">
          <text>本周练习：3 次</text>
          <button size="mini" class="btn-primary" @tap="sync">同步</button>
        </view>
        <view class="item" v-for="(p, i) in practices" :key="i">
          <text>{{ p.date }} · {{ p.title }}</text>
        </view>
      </view>
    </view>
  </scroll-view>
</template>

<script>
export default {
  data() {
    return {
      practices: [
        { date: "2025-08-08", title: "章节1 自测练习" },
        { date: "2025-08-09", title: "章节2 学习资料阅读" },
        { date: "2025-08-10", title: "章节2 自测错题复盘" },
      ],
    };
  },
  methods: {
    go(url) {
      uni.navigateTo({ url });
    },
    sync() {
      uni.showToast({ title: "已触发同步", icon: "none" });
    },
  },
};
</script>

<style lang="scss">
$page-padding: 24rpx;
$primary: #d32f2f;

.page {
  padding: $page-padding;
}
.section {
  margin-bottom: 32rpx;
}
/* 使用全局 ios-large-title */

.block {
  padding: 24rpx;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.chevron {
  color: #8e8e93;
}

.practice {
  padding: 16rpx 20rpx;
  .summary {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 12rpx;
  }
  .item {
    padding: 16rpx 0;
    border-top: 1rpx solid #f0f0f0;
    color: #555;
  }
}

.btn-primary {
  background: $primary;
  color: #fff;
}
</style>
