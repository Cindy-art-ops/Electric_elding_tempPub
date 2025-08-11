"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  data() {
    return {
      practices: [
        { date: "2025-08-08", title: "章节1 自测练习" },
        { date: "2025-08-09", title: "章节2 学习资料阅读" },
        { date: "2025-08-10", title: "章节2 自测错题复盘" }
      ]
    };
  },
  methods: {
    go(url) {
      common_vendor.index.navigateTo({ url });
    },
    sync() {
      common_vendor.index.showToast({ title: "已触发同步", icon: "none" });
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.o(($event) => $options.go("/pages/settings/index?tab=font")),
    b: common_vendor.o(($event) => $options.go("/pages/settings/index?tab=theme")),
    c: common_vendor.o(($event) => $options.go("/pages/settings/index?tab=account")),
    d: common_vendor.o(($event) => $options.go("/pages/mistakes/index")),
    e: common_vendor.o(($event) => $options.go("/pages/notes/index")),
    f: common_vendor.o((...args) => $options.sync && $options.sync(...args)),
    g: common_vendor.f($data.practices, (p, i, i0) => {
      return {
        a: common_vendor.t(p.date),
        b: common_vendor.t(p.title),
        c: i
      };
    })
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/mine/index.js.map
