"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  data() {
    const follow = common_vendor.index.getStorageSync("theme_follow");
    const saved = common_vendor.index.getStorageSync("theme_mode");
    const followSystem = typeof follow === "boolean" ? follow : true;
    const dark = saved === "dark";
    return { followSystem, dark };
  },
  methods: {
    toggleFollow(e) {
      this.followSystem = !!e.detail.value;
      common_vendor.index.setStorageSync("theme_follow", this.followSystem);
      if (this.followSystem) {
        const sys = common_vendor.index.getSystemInfoSync && common_vendor.index.getSystemInfoSync() || {};
        const systemTheme = sys.theme === "dark" || sys.theme === "light" ? sys.theme : "light";
        this.applyTheme(systemTheme);
      } else {
        this.applyTheme(this.dark ? "dark" : "light");
      }
    },
    toggleDark(e) {
      this.dark = !!e.detail.value;
      common_vendor.index.setStorageSync("theme_mode", this.dark ? "dark" : "light");
      if (!this.followSystem) {
        this.applyTheme(this.dark ? "dark" : "light");
      }
    },
    applyTheme(theme) {
      try {
        const t = theme === "dark" ? "dark" : "light";
        try {
          const app = typeof getApp === "function" ? getApp() : null;
          if (app && app.$vm && typeof app.$vm.applyTheme === "function") {
            app.$vm.applyTheme(t);
            return;
          }
        } catch (e) {
        }
        common_vendor.index.setStorageSync("theme_effective", t);
      } catch (e) {
      }
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: $data.followSystem,
    b: common_vendor.o((...args) => $options.toggleFollow && $options.toggleFollow(...args)),
    c: $data.dark,
    d: $data.followSystem,
    e: common_vendor.o((...args) => $options.toggleDark && $options.toggleDark(...args))
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/settings/index.js.map
