"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const common_vendor = require("./common/vendor.js");
if (!Math) {
  "./pages/home/index.js";
  "./pages/mine/index.js";
  "./pages/course/detail.js";
  "./pages/learn/material.js";
  "./pages/quiz/chapter.js";
  "./pages/quiz/import.js";
  "./pages/mistakes/index.js";
  "./pages/notes/index.js";
  "./pages/practice/index.js";
  "./pages/settings/index.js";
}
const _sfc_main = {
  onLaunch: function() {
    try {
      const follow = common_vendor.index.getStorageSync("theme_follow");
      const saved = common_vendor.index.getStorageSync("theme_mode");
      const followSystem = typeof follow === "boolean" ? follow : true;
      const sys = common_vendor.index.getSystemInfoSync && common_vendor.index.getSystemInfoSync() || {};
      const systemTheme = sys.theme === "dark" || sys.theme === "light" ? sys.theme : "light";
      const theme = followSystem ? systemTheme : saved === "dark" ? "dark" : "light";
      this.applyTheme(theme);
      if (typeof common_vendor.index.onThemeChange === "function") {
        common_vendor.index.onThemeChange(({ theme: next }) => {
          const f = common_vendor.index.getStorageSync("theme_follow");
          if (f === true || f === void 0) {
            this.applyTheme(next === "dark" ? "dark" : "light");
          }
        });
      }
    } catch (e) {
    }
  },
  onShow: function() {
    common_vendor.index.__f__("log", "at App.vue:29", "App Show");
  },
  onHide: function() {
    common_vendor.index.__f__("log", "at App.vue:32", "App Hide");
  },
  methods: {
    applyTheme(theme) {
      const t = theme === "dark" ? "dark" : "light";
      common_vendor.index.setStorageSync("theme_effective", t);
    }
  }
};
function createApp() {
  const app = common_vendor.createSSRApp(_sfc_main);
  return {
    app
  };
}
createApp().app.mount("#app");
exports.createApp = createApp;
//# sourceMappingURL=../.sourcemap/mp-weixin/app.js.map
