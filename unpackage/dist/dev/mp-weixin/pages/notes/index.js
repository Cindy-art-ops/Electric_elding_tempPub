"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  data() {
    return { content: "", notes: [] };
  },
  onShow() {
    this.load();
  },
  methods: {
    load() {
      try {
        const stored = common_vendor.index.getStorageSync("my_notes") || [];
        if (!stored.length) {
          const preset = [
            {
              time: "2025/08/08 19:30",
              text: "完成章节1学习与自测，对电弧热源原理理解更清晰；注意焊接安全装备规范佩戴。"
            },
            {
              time: "2025/08/09 10:12",
              text: "复习焊接缺陷种类，区分气孔、夹渣与未焊透的成因与预防措施。"
            },
            {
              time: "2025/08/10 21:05",
              text: "章节2自测错题回顾：多选题审题要仔细，注意“正确的是”与“错误的是”的区别。"
            }
          ];
          common_vendor.index.setStorageSync("my_notes", preset);
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
        common_vendor.index.showToast({ title: "请输入内容", icon: "none" });
        return;
      }
      const one = { text, time: (/* @__PURE__ */ new Date()).toLocaleString() };
      const arr = [one, ...this.notes || []];
      common_vendor.index.setStorageSync("my_notes", arr);
      this.content = "";
      this.notes = arr;
      common_vendor.index.showToast({ title: "已保存", icon: "success" });
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: $data.content,
    b: common_vendor.o(($event) => $data.content = $event.detail.value),
    c: common_vendor.o((...args) => $options.save && $options.save(...args)),
    d: $data.notes.length
  }, $data.notes.length ? {
    e: common_vendor.f($data.notes, (n, i, i0) => {
      return {
        a: common_vendor.t(n.time),
        b: common_vendor.t(n.text),
        c: i
      };
    })
  } : {});
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/notes/index.js.map
