"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  methods: {
    sync() {
      common_vendor.index.showToast({ title: "同步已触发", icon: "none" });
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.f(5, (i, k0, i0) => {
      return {
        a: common_vendor.t(i),
        b: common_vendor.t(i),
        c: i
      };
    }),
    b: common_vendor.o((...args) => $options.sync && $options.sync(...args))
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/practice/index.js.map
