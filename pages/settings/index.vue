<template>
  <view class="page">
    <view class="ios-large-title">设置</view>

    <!-- 主题设置 -->
    <view class="ios-group">
      <view class="ios-cell row">
        <text>跟随系统</text>
        <switch :checked="followSystem" @change="toggleFollow" />
      </view>
      <view class="ios-cell row">
        <text>暗色模式</text>
        <switch :checked="dark" :disabled="followSystem" @change="toggleDark" />
      </view>
    </view>

    <!-- 说明 -->
    <view class="ios-card note">
      <text class="ios-subtle"
        >开启“跟随系统”后，将自动与系统外观保持一致；关闭后可手动切换深浅色。</text
      >
    </view>
  </view>
</template>
<script>
export default {
  data() {
    const follow = uni.getStorageSync("theme_follow");
    const saved = uni.getStorageSync("theme_mode");
    const followSystem = typeof follow === "boolean" ? follow : true;
    const dark = saved === "dark";
    return { followSystem, dark };
  },
  methods: {
    toggleFollow(e) {
      this.followSystem = !!e.detail.value;
      uni.setStorageSync("theme_follow", this.followSystem);
      if (this.followSystem) {
        const sys = (uni.getSystemInfoSync && uni.getSystemInfoSync()) || {};
        const systemTheme =
          sys.theme === "dark" || sys.theme === "light" ? sys.theme : "light";
        this.applyTheme(systemTheme);
      } else {
        // 保持当前 dark 状态
        this.applyTheme(this.dark ? "dark" : "light");
      }
    },
    toggleDark(e) {
      this.dark = !!e.detail.value;
      uni.setStorageSync("theme_mode", this.dark ? "dark" : "light");
      if (!this.followSystem) {
        this.applyTheme(this.dark ? "dark" : "light");
      }
    },
    applyTheme(theme) {
      // 交给 App.vue 的方法处理（H5 会设置 data-theme）
      try {
        const t = theme === "dark" ? "dark" : "light";
        // 优先调用全局 App 的 applyTheme 以统一处理
        try {
          const app = typeof getApp === "function" ? getApp() : null;
          if (app && app.$vm && typeof app.$vm.applyTheme === "function") {
            app.$vm.applyTheme(t);
            return;
          }
        } catch (e) {}
        // #ifdef H5
        document.documentElement.setAttribute("data-theme", t);
        // #endif
        uni.setStorageSync("theme_effective", t);
      } catch (e) {}
    },
  },
};
</script>
<style>
.page {
  padding: 24rpx;
}
.row {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.note {
  padding: 20rpx;
  margin-top: 12rpx;
}
</style>
