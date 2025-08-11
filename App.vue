<script>
export default {
  onLaunch: function () {
    // 初始化主题
    try {
      const follow = uni.getStorageSync("theme_follow");
      const saved = uni.getStorageSync("theme_mode");
      const followSystem = typeof follow === "boolean" ? follow : true;
      const sys = (uni.getSystemInfoSync && uni.getSystemInfoSync()) || {};
      const systemTheme =
        sys.theme === "dark" || sys.theme === "light" ? sys.theme : "light";
      const theme = followSystem
        ? systemTheme
        : saved === "dark"
        ? "dark"
        : "light";
      this.applyTheme(theme);
      if (typeof uni.onThemeChange === "function") {
        uni.onThemeChange(({ theme: next }) => {
          const f = uni.getStorageSync("theme_follow");
          if (f === true || f === undefined) {
            this.applyTheme(next === "dark" ? "dark" : "light");
          }
        });
      }
    } catch (e) {}
  },
  onShow: function () {
    console.log("App Show");
  },
  onHide: function () {
    console.log("App Hide");
  },
  methods: {
    applyTheme(theme) {
      const t = theme === "dark" ? "dark" : "light";
      // H5：设置 html data-theme
      // #ifdef H5
      try {
        document.documentElement.setAttribute("data-theme", t);
      } catch (e) {}
      // #endif
      uni.setStorageSync("theme_effective", t);
    },
  },
};
</script>

<style>
/* 全局样式（Apple风格基线） */
page {
  background-color: #f2f2f7;
}

/* 统一圆角/阴影/分割线 */
:root {
  --radius-sm: 10rpx;
  --radius-md: 16rpx;
  --radius-lg: 22rpx;
  --shadow-soft: 0 6rpx 20rpx rgba(0, 0, 0, 0.06);
  --line: 1rpx solid #e9e9ec;
  --primary: #d32f2f; /* 维持项目主色为红 */
}

/* 卡片 */
.ios-card {
  background: #fff;
  border-radius: var(--radius-lg);
  border: var(--line);
  box-shadow: var(--shadow-soft);
}

/* 分组列表（Group） */
.ios-group {
  margin: 12rpx 0;
}
.ios-cell {
  background: #fff;
  border-bottom: var(--line);
  padding: 26rpx 28rpx;
}
.ios-cell:first-child {
  border-top-left-radius: var(--radius-lg);
  border-top-right-radius: var(--radius-lg);
}
.ios-cell:last-child {
  border-bottom-left-radius: var(--radius-lg);
  border-bottom-right-radius: var(--radius-lg);
  border-bottom: none;
}
.ios-cell .chevron {
  color: #8e8e93;
}

/* 大标题 */
.ios-large-title {
  font-size: 44rpx;
  font-weight: 700;
  color: #111;
  margin: 8rpx 0 20rpx;
}
.ios-subtle {
  color: #6d6d72;
}

/* 按钮（胶囊样式） */
.btn-primary {
  background: var(--primary);
  color: #fff;
  border-radius: 999rpx;
  padding: 10rpx 20rpx;
}
.btn-outline {
  color: var(--primary);
  border: 2rpx solid var(--primary);
  background: #fff;
  border-radius: 999rpx;
  padding: 8rpx 18rpx;
}

/* 暗色模式覆盖（H5 通过 html[data-theme=dark] 触发） */
/* #ifdef H5 */
:root[data-theme="dark"] page {
  background-color: #000;
}
:root[data-theme="dark"] .ios-card {
  background: #1c1c1e;
  border-color: #2c2c2e;
  box-shadow: none;
}
:root[data-theme="dark"] .ios-large-title {
  color: #fff;
}
:root[data-theme="dark"] .btn-outline {
  color: #ff6b6b;
  border-color: #ff6b6b;
  background: #1c1c1e;
}
:root[data-theme="dark"] .btn-primary {
  background: #ff3b30;
}
:root[data-theme="dark"] .ios-cell {
  background: #1c1c1e;
  border-bottom-color: #2c2c2e;
  color: #fff;
}
:root[data-theme="dark"] .chevron {
  color: #8e8e93;
}
/* #endif */
</style>
