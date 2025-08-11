"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  data() {
    return {
      recommends: [
        {
          title: "焊接安全基础",
          cover: "/static/showimage/0a3acd402819bb4edcdda7d839db8642.jpg",
          id: "safe"
        },
        {
          title: "焊条电弧焊入门",
          cover: "/static/showimage/5c9bbb5a0993a4ff88edb21268879410.jpg",
          id: "smaw"
        },
        {
          title: "常见焊接缺陷",
          cover: "/static/showimage/7321baffef3b56972a67ace6e5341512.jpg",
          id: "defect"
        }
      ],
      chapters: [
        { id: 1, title: "焊接教学章节1", progress: 0.25 },
        { id: 2, title: "焊接教学章节2", progress: 0.6 },
        { id: 3, title: "焊接教学章节3", progress: 0.1 }
      ]
    };
  },
  methods: {
    goCourse(item) {
      common_vendor.index.navigateTo({ url: `/pages/course/detail?id=${item.id}` });
    },
    openMaterial(chapter) {
      common_vendor.index.navigateTo({ url: `/pages/learn/material?chapter=${chapter.id}` });
    },
    openQuiz(chapter) {
      common_vendor.index.navigateTo({ url: `/pages/quiz/chapter?chapter=${chapter.id}` });
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.f($data.recommends, (item, i, i0) => {
      return {
        a: item.cover,
        b: common_vendor.t(item.title),
        c: i,
        d: common_vendor.o(($event) => $options.goCourse(item), i)
      };
    }),
    b: common_vendor.f($data.chapters, (c, k0, i0) => {
      return {
        a: common_vendor.t(c.title),
        b: common_vendor.o(($event) => $options.openMaterial(c), c.id),
        c: common_vendor.o(($event) => $options.openQuiz(c), c.id),
        d: c.progress * 100 + "%",
        e: common_vendor.t(Math.round(c.progress * 100)),
        f: c.id
      };
    })
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/home/index.js.map
