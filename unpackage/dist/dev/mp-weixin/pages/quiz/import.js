"use strict";
const common_vendor = require("../../common/vendor.js");
const KEY = "quiz_import_bank";
const _sfc_main = {
  data() {
    return {
      tabs: [
        { key: "single", name: "单选题" },
        { key: "multi", name: "多选题" },
        { key: "judge", name: "判断题" },
        { key: "blank", name: "填空题" }
      ],
      cur: "single",
      raw: "",
      err: "",
      preview: []
    };
  },
  computed: {
    placeholder() {
      switch (this.cur) {
        case "single":
          return "格式：\n题干\nA. 选项1\nB. 选项2\nC. 选项3\nD. 选项4\n答案：A\n---\n下一题...";
        case "multi":
          return "格式：\n题干\nA. 选项1\nB. 选项2\nC. 选项3\nD. 选项4\n答案：A,B\n---\n下一题...";
        case "judge":
          return "格式：\n题干\n答案：对/错\n---\n下一题...";
        case "blank":
          return "格式：\n题干（用【】表示空格）\n答案：填空1|填空2（多空用|分隔）\n---\n下一题...";
      }
      return "";
    }
  },
  methods: {
    fillSample() {
      const samples = {
        single: `焊接电弧的热源主要来源于？
A. 电能
B. 机械能
C. 化学能
D. 核能
答案：A
---
焊条药皮的主要作用是？
A. 形成保护气体
B. 增加焊缝强度
C. 降低电压
D. 提高电流
答案：A`,
        multi: `关于焊接安全，下列说法正确的是？
A. 焊接时应佩戴护目镜
B. 工作场所要有良好通风
C. 可以用湿手触摸焊机
D. 需要穿戴防护手套
答案：A,B,D`,
        judge: `焊接过程中产生的紫外线对人体无害。
答案：错
---
CO2气体保护焊常用作低碳钢的焊接。
答案：对`,
        blank: `焊接接头通常由【焊缝】和【热影响区】组成。
答案：焊缝|热影响区`
      };
      this.raw = samples[this.cur];
    },
    parseNow() {
      this.err = "";
      try {
        const res = this.parseText(this.cur, this.raw);
        this.preview = res;
        const pack = { type: this.cur, list: res, ts: Date.now() };
        common_vendor.index.setStorageSync(KEY, pack);
        common_vendor.index.setStorageSync(`quiz_bank_${this.cur}`, pack);
        common_vendor.index.showToast({ title: "解析成功", icon: "success" });
      } catch (e) {
        this.err = String(e.message || e);
      }
    },
    parseText(type, text) {
      if (!text || !text.trim())
        throw new Error("请输入题目文本");
      const blocks = text.split(/\n---\n/);
      const list = [];
      for (const b of blocks) {
        const lines = b.split(/\n/).map((s) => s.trim()).filter(Boolean);
        if (lines.length < 2)
          continue;
        const title = lines[0];
        const ansLine = lines.find((l) => /^答案：/i.test(l));
        if (!ansLine)
          throw new Error("缺少“答案：”行");
        const answerRaw = ansLine.replace(/^答案：/i, "").trim();
        if (type === "single" || type === "multi") {
          const opts = lines.slice(1).filter((l) => /^[A-D][\.|、]/.test(l)).map((l) => l.replace(/^[A-D][\.|、]\s*/, ""));
          if (opts.length < 2)
            throw new Error("选项不足");
          let answer = answerRaw.split(/[,，]/).map((s) => s.trim()).filter(Boolean);
          if (type === "single" && answer.length !== 1)
            throw new Error("单选题答案只能有1个");
          list.push({ type, title, options: opts, answer });
        } else if (type === "judge") {
          const answer = /^(对|错|正确|错误)$/i.test(answerRaw) ? /(对|正确)/i.test(answerRaw) ? "对" : "错" : null;
          if (!answer)
            throw new Error("判断题答案仅支持 对/错/正确/错误");
          list.push({ type, title, answer });
        } else if (type === "blank") {
          const answer = answerRaw.split("|").map((s) => s.trim()).filter(Boolean);
          if (!answer.length)
            throw new Error("填空题至少一个答案");
          list.push({
            type,
            title,
            blanks: (title.match(/【.+?】/g) || []).length || answer.length,
            answer
          });
        }
      }
      if (!list.length)
        throw new Error("未解析到题目");
      return list;
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: common_vendor.f($data.tabs, (t, k0, i0) => {
      return {
        a: common_vendor.t(t.name),
        b: t.key,
        c: t.key === $data.cur ? 1 : "",
        d: common_vendor.o(($event) => $data.cur = t.key, t.key)
      };
    }),
    b: $options.placeholder,
    c: $data.raw,
    d: common_vendor.o(($event) => $data.raw = $event.detail.value),
    e: common_vendor.o((...args) => $options.fillSample && $options.fillSample(...args)),
    f: common_vendor.o((...args) => $options.parseNow && $options.parseNow(...args)),
    g: $data.err
  }, $data.err ? {
    h: common_vendor.t($data.err)
  } : {}, {
    i: $data.preview.length
  }, $data.preview.length ? {
    j: common_vendor.t($data.preview.length),
    k: common_vendor.f($data.preview, (q, i, i0) => {
      return common_vendor.e({
        a: common_vendor.t(i + 1),
        b: common_vendor.t(q.title),
        c: q.options
      }, q.options ? {
        d: common_vendor.f(q.options, (op, oi, i1) => {
          return {
            a: common_vendor.t(String.fromCharCode(65 + oi)),
            b: common_vendor.t(op),
            c: oi
          };
        })
      } : {}, {
        e: common_vendor.t(Array.isArray(q.answer) ? q.answer.join(",") : q.answer),
        f: i
      });
    })
  } : {});
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/quiz/import.js.map
