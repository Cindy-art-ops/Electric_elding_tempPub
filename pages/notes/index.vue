<template>
  <view class="page">
    <view class="title">学习心得</view>
    <textarea
      class="note"
      v-model="content"
      placeholder="记录你的学习心得..."
    />
    <view class="btns">
      <button class="btn-primary" @tap="save">保存</button>
    </view>
    <view class="list" v-if="notes.length">
      <view class="item" v-for="(n, i) in notes" :key="i">
        <view class="meta">{{ n.time }}</view>
        <view class="text">{{ n.text }}</view>
      </view>
    </view>
  </view>
</template>
<script>
export default {
  data() {
    return { content: "", notes: [] };
  },
  onShow() {
    this.load();
  },
  methods: {
    load() {
      try {
        const stored = uni.getStorageSync("my_notes") || [];
        if (!stored.length) {
          const preset = [
            {
              time: "2025/08/08 19:30",
              text: "完成章节1学习与自测，对电弧热源原理理解更清晰；注意焊接安全装备规范佩戴。",
            },
            {
              time: "2025/08/09 10:12",
              text: "复习焊接缺陷种类，区分气孔、夹渣与未焊透的成因与预防措施。",
            },
            {
              time: "2025/08/10 21:05",
              text: "章节2自测错题回顾：多选题审题要仔细，注意“正确的是”与“错误的是”的区别。",
            },
          ];
          uni.setStorageSync("my_notes", preset);
          this.notes = preset;
        } else {
          this.notes = stored;
        }
      } catch (e) {
        this.notes = [];
      }
    },
    save() {
      const text = (this.content || "").trim();
      if (!text) {
        uni.showToast({ title: "请输入内容", icon: "none" });
        return;
      }
      const one = { text, time: new Date().toLocaleString() };
      const arr = [one, ...(this.notes || [])];
      uni.setStorageSync("my_notes", arr);
      this.content = "";
      this.notes = arr;
      uni.showToast({ title: "已保存", icon: "success" });
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
.note {
  width: 100%;
  height: 320rpx;
  background: #fff;
  border-radius: 12rpx;
  padding: 16rpx;
  box-sizing: border-box;
  margin-bottom: 16rpx;
}
.btns {
  display: flex;
  gap: 12rpx;
  margin-bottom: 16rpx;
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
.list {
  display: flex;
  flex-direction: column;
  gap: 12rpx;
}
.item {
  background: #fff;
  border-radius: 12rpx;
  padding: 16rpx;
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.06);
}
.meta {
  color: #999;
  font-size: 24rpx;
  margin-bottom: 8rpx;
}
.text {
  color: #333;
  white-space: pre-wrap;
}
</style>
