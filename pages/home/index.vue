<template>
  <view class="page">
    <!-- 今日课程推荐 -->
    <view class="section recommend">
      <view class="ios-large-title">今日课程推荐</view>
      <scroll-view class="reco-list" scroll-x>
        <view
          class="reco-item"
          v-for="(item, i) in recommends"
          :key="i"
          @tap="goCourse(item)"
        >
          <image class="reco-cover" :src="item.cover" mode="aspectFill" />
          <text class="reco-name">{{ item.title }}</text>
        </view>
      </scroll-view>
    </view>

    <!-- 学习页面（章节分级） -->
    <view class="section">
      <view class="ios-large-title">学习章节</view>
      <view class="chapters">
        <view class="chapter-card" v-for="c in chapters" :key="c.id">
          <view class="chapter-head">
            <text class="chapter-title">{{ c.title }}</text>
            <view class="actions">
              <button size="mini" class="btn-primary" @tap="openMaterial(c)">
                学习资料
              </button>
              <button size="mini" class="btn-outline" @tap="openQuiz(c)">
                章节自测
              </button>
            </view>
          </view>
          <!-- 进度条 -->
          <view class="progress">
            <view class="bar" :style="{ width: c.progress * 100 + '%' }"></view>
          </view>
          <view class="progress-text"
            >学习进度：{{ Math.round(c.progress * 100) }}%</view
          >
        </view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      recommends: [
        {
          title: "焊接安全基础",
          cover: "/static/showimage/0a3acd402819bb4edcdda7d839db8642.jpg",
          id: "safe",
        },
        {
          title: "焊条电弧焊入门",
          cover: "/static/showimage/5c9bbb5a0993a4ff88edb21268879410.jpg",
          id: "smaw",
        },
        {
          title: "常见焊接缺陷",
          cover: "/static/showimage/7321baffef3b56972a67ace6e5341512.jpg",
          id: "defect",
        },
      ],
      chapters: [
        { id: 1, title: "焊接教学章节1", progress: 0.25 },
        { id: 2, title: "焊接教学章节2", progress: 0.6 },
        { id: 3, title: "焊接教学章节3", progress: 0.1 },
      ],
    };
  },
  methods: {
    goCourse(item) {
      uni.navigateTo({ url: `/pages/course/detail?id=${item.id}` });
    },
    openMaterial(chapter) {
      uni.navigateTo({ url: `/pages/learn/material?chapter=${chapter.id}` });
    },
    openQuiz(chapter) {
      uni.navigateTo({ url: `/pages/quiz/chapter?chapter=${chapter.id}` });
    },
  },
};
</script>

<style lang="scss">
$page-padding: 24rpx;
$primary: #d32f2f; // 主色红

.page {
  padding: $page-padding;
}
.section {
  margin-bottom: 28rpx;
}

.recommend {
  .reco-list {
    white-space: nowrap;
  }
  .reco-item {
    display: inline-flex;
    flex-direction: column;
    width: 360rpx;
    margin-right: 20rpx;
    background: #fff;
    border-radius: 18rpx;
    overflow: hidden;
    border: 1rpx solid #ececef;
    box-shadow: 0 8rpx 26rpx rgba(0, 0, 0, 0.07);
  }
  .reco-cover {
    width: 360rpx;
    height: 210rpx;
    background: #f2f2f2;
  }
  .reco-name {
    font-size: 28rpx;
    padding: 16rpx 16rpx 18rpx;
    color: #111;
  }
}

.chapters {
  .chapter-card {
    background: #fff;
    border: 1rpx solid #ececef;
    border-radius: 18rpx;
    padding: 22rpx;
    margin-bottom: 18rpx;
    box-shadow: 0 8rpx 26rpx rgba(0, 0, 0, 0.07);
  }
  .chapter-head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 14rpx;
  }
  .chapter-title {
    font-size: 32rpx;
    font-weight: 700;
    color: #111;
  }
  .actions button {
    margin-left: 12rpx;
  }

  .progress {
    height: 14rpx;
    border-radius: 14rpx;
    background: #ebebf0;
    overflow: hidden;
  }
  .bar {
    height: 100%;
    background: $primary;
  }
  .progress-text {
    font-size: 24rpx;
    color: #6d6d72;
    margin-top: 10rpx;
  }
}

.btn-primary {
  background: $primary;
  color: #fff;
}
.btn-outline {
  color: $primary;
  border: 2rpx solid $primary;
  background: #fff;
}
</style>
