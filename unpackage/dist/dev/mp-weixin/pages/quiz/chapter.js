"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  data() {
    return {
      chapter: "",
      bank: { type: "", list: [] },
      count: { single: 0, multi: 0, judge: 0, blank: 0 },
      mode: "view",
      questions: [],
      userAns: [],
      result: { score: 0, total: 0, details: [] },
      syncing: false,
      horizontal: false,
      currentIndex: 0
    };
  },
  onLoad(q) {
    this.chapter = q && q.chapter ? q.chapter : "";
    this.loadBank();
  },
  methods: {
    goImport() {
      common_vendor.index.navigateTo({ url: "/pages/quiz/import" });
    },
    loadBank() {
      var _a, _b, _c, _d;
      try {
        const prefix = this.chapter ? `quiz_bank_${this.chapter}_` : "quiz_bank_";
        const packs = [
          common_vendor.index.getStorageSync(prefix + "single") || {},
          common_vendor.index.getStorageSync(prefix + "multi") || {},
          common_vendor.index.getStorageSync(prefix + "judge") || {},
          common_vendor.index.getStorageSync(prefix + "blank") || {}
        ];
        const list = packs.flatMap(
          (p) => Array.isArray(p.list) ? p.list.map((q) => ({ ...q })) : []
        );
        this.bank = { type: "mix", list };
        this.count = {
          single: (((_a = common_vendor.index.getStorageSync(prefix + "single")) == null ? void 0 : _a.list) || []).length,
          multi: (((_b = common_vendor.index.getStorageSync(prefix + "multi")) == null ? void 0 : _b.list) || []).length,
          judge: (((_c = common_vendor.index.getStorageSync(prefix + "judge")) == null ? void 0 : _c.list) || []).length,
          blank: (((_d = common_vendor.index.getStorageSync(prefix + "blank")) == null ? void 0 : _d.list) || []).length
        };
      } catch (e) {
        this.bank = { type: "", list: [] };
        this.count = { single: 0, multi: 0, judge: 0, blank: 0 };
      }
    },
    remoteSync() {
      if (this.syncing)
        return;
      this.syncing = true;
      common_vendor.index.showLoading({ title: "同步中..." });
      setTimeout(() => {
        const single = [
          {
            type: "single",
            title: "焊接电弧的热源主要来源于？",
            options: ["电能", "机械能", "化学能", "核能"],
            answer: ["A"]
          },
          {
            type: "single",
            title: "焊条药皮的主要作用是？",
            options: ["形成保护气体", "增加焊缝强度", "降低电压", "提高电流"],
            answer: ["A"]
          }
        ];
        const multi = [
          {
            type: "multi",
            title: "关于焊接安全，下列说法正确的是？",
            options: [
              "焊接时应佩戴护目镜",
              "工作场所要有良好通风",
              "可以用湿手触摸焊机",
              "需要穿戴防护手套"
            ],
            answer: ["A", "B", "D"]
          }
        ];
        const judge = [
          {
            type: "judge",
            title: "焊接过程中产生的紫外线对人体无害。",
            answer: "错"
          },
          {
            type: "judge",
            title: "CO2气体保护焊常用于低碳钢的焊接。",
            answer: "对"
          }
        ];
        const blank = [
          {
            type: "blank",
            title: "焊接接头通常由【焊缝】和【热影响区】组成。",
            blanks: 2,
            answer: ["焊缝", "热影响区"]
          }
        ];
        const prefix = this.chapter ? `quiz_bank_${this.chapter}_` : "quiz_bank_";
        common_vendor.index.setStorageSync(prefix + "single", {
          type: "single",
          list: single,
          ts: Date.now()
        });
        common_vendor.index.setStorageSync(prefix + "multi", {
          type: "multi",
          list: multi,
          ts: Date.now()
        });
        common_vendor.index.setStorageSync(prefix + "judge", {
          type: "judge",
          list: judge,
          ts: Date.now()
        });
        common_vendor.index.setStorageSync(prefix + "blank", {
          type: "blank",
          list: blank,
          ts: Date.now()
        });
        this.loadBank();
        common_vendor.index.hideLoading();
        this.syncing = false;
        common_vendor.index.showToast({ title: "同步成功", icon: "success" });
      }, 500);
    },
    onToggleLayout(e) {
      this.horizontal = !!e.detail.value;
    },
    onSwiperChange(e) {
      this.currentIndex = e.detail.current || 0;
    },
    prevQ() {
      if (this.currentIndex > 0)
        this.currentIndex--;
    },
    nextQ() {
      if (this.currentIndex < this.questions.length - 1)
        this.currentIndex++;
    },
    startQuiz() {
      this.questions = this.bank.list.slice();
      this.userAns = new Array(this.questions.length).fill(null);
      this.mode = "do";
    },
    resetQuiz() {
      this.mode = "view";
      this.currentIndex = 0;
      this.horizontal = false;
    },
    submitQuiz() {
      let score = 0;
      const details = [];
      for (let i = 0; i < this.questions.length; i++) {
        const q = this.questions[i];
        const ans = this.userAns[i];
        let ok = false;
        if (q.type === "single" || q.type === "judge") {
          ok = Array.isArray(q.answer) ? ans === q.answer[0] : ans === q.answer;
        } else if (q.type === "multi") {
          const right = (q.answer || []).slice().sort().join(",");
          const mine = (ans || []).slice().sort().join(",");
          ok = right === mine;
        } else if (q.type === "blank") {
          const right = (q.answer || []).map((s) => String(s).trim());
          const mine = (ans || []).map((s) => String(s || "").trim());
          ok = right.length === mine.length && right.every((v, idx) => v === mine[idx]);
        }
        if (ok)
          score++;
        details.push({ correct: ok });
      }
      this.result = { score, total: this.questions.length, details };
      this.mode = "result";
      const wrong = [];
      details.forEach((d, idx) => {
        if (!d.correct)
          wrong.push({ q: this.questions[idx], user: this.userAns[idx] });
      });
      if (wrong.length) {
        try {
          const key = `mistakes_${this.chapter || "all"}`;
          const old = common_vendor.index.getStorageSync(key) || [];
          common_vendor.index.setStorageSync(key, [...wrong, ...old]);
        } catch (e) {
        }
      }
    },
    letter(i) {
      return String.fromCharCode(65 + i);
    },
    onSingleChange(i, val) {
      this.$set ? this.$set(this.userAns, i, val) : this.userAns[i] = val;
    },
    onMultiChange(i, vals) {
      this.$set ? this.$set(this.userAns, i, vals) : this.userAns[i] = vals;
    },
    onJudgeChange(i, val) {
      this.onSingleChange(i, val);
    },
    onBlankInput(i, bi, val) {
      const arr = Array.isArray(this.userAns[i]) ? this.userAns[i].slice() : [];
      arr[bi] = val;
      this.onMultiChange(i, arr);
    },
    typeName(t) {
      return t === "single" ? "单选题" : t === "multi" ? "多选题" : t === "judge" ? "判断题" : t === "blank" ? "填空题" : "未知";
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: common_vendor.t($data.chapter),
    b: common_vendor.t($data.syncing ? "同步中..." : "远程同步题库"),
    c: common_vendor.o((...args) => $options.remoteSync && $options.remoteSync(...args)),
    d: $data.syncing,
    e: common_vendor.o((...args) => $options.goImport && $options.goImport(...args)),
    f: !$data.bank.list.length
  }, !$data.bank.list.length ? {} : common_vendor.e({
    g: common_vendor.t($data.count.single),
    h: common_vendor.t($data.count.multi),
    i: common_vendor.t($data.count.judge),
    j: common_vendor.t($data.count.blank),
    k: common_vendor.t($data.bank.list.length),
    l: common_vendor.f($data.bank.list.slice(0, 3), (q, i, i0) => {
      return {
        a: common_vendor.t(i + 1),
        b: common_vendor.t($options.typeName(q.type)),
        c: common_vendor.t(q.title),
        d: i
      };
    }),
    m: $data.mode === "view"
  }, $data.mode === "view" ? {
    n: common_vendor.o((...args) => $options.startQuiz && $options.startQuiz(...args))
  } : {}), {
    o: $data.mode === "do"
  }, $data.mode === "do" ? common_vendor.e({
    p: common_vendor.t($data.questions.length),
    q: $data.horizontal,
    r: common_vendor.o((...args) => $options.onToggleLayout && $options.onToggleLayout(...args)),
    s: !$data.horizontal
  }, !$data.horizontal ? {
    t: common_vendor.f($data.questions, (q, i, i0) => {
      return common_vendor.e({
        a: common_vendor.t(i + 1),
        b: common_vendor.t($options.typeName(q.type)),
        c: common_vendor.t(q.title),
        d: q.type === "single"
      }, q.type === "single" ? {
        e: common_vendor.f(q.options, (op, oi, i1) => {
          return {
            a: $options.letter(oi),
            b: ($data.userAns[i] || "") === $options.letter(oi),
            c: common_vendor.t($options.letter(oi)),
            d: common_vendor.t(op),
            e: oi
          };
        }),
        f: common_vendor.o(($event) => $options.onSingleChange(i, $event.detail.value), i)
      } : q.type === "multi" ? {
        h: common_vendor.f(q.options, (op, oi, i1) => {
          return {
            a: $options.letter(oi),
            b: ($data.userAns[i] || []).includes($options.letter(oi)),
            c: common_vendor.t($options.letter(oi)),
            d: common_vendor.t(op),
            e: oi
          };
        }),
        i: common_vendor.o(($event) => $options.onMultiChange(i, $event.detail.value), i)
      } : q.type === "judge" ? {
        k: ($data.userAns[i] || "") === "对",
        l: ($data.userAns[i] || "") === "错",
        m: common_vendor.o(($event) => $options.onJudgeChange(i, $event.detail.value), i)
      } : q.type === "blank" ? {
        o: common_vendor.f(q.blanks, (b, bi, i1) => {
          return {
            a: common_vendor.t(bi + 1),
            b: ($data.userAns[i] || [])[bi] || "",
            c: common_vendor.o(($event) => $options.onBlankInput(i, bi, $event.detail.value), bi),
            d: bi
          };
        })
      } : {}, {
        g: q.type === "multi",
        j: q.type === "judge",
        n: q.type === "blank",
        p: i
      });
    }),
    v: common_vendor.o((...args) => $options.resetQuiz && $options.resetQuiz(...args)),
    w: common_vendor.o((...args) => $options.submitQuiz && $options.submitQuiz(...args))
  } : {
    x: common_vendor.f($data.questions, (q, i, i0) => {
      return common_vendor.e({
        a: common_vendor.t(i + 1),
        b: common_vendor.t($options.typeName(q.type)),
        c: common_vendor.t(q.title),
        d: q.type === "single"
      }, q.type === "single" ? {
        e: common_vendor.f(q.options, (op, oi, i1) => {
          return {
            a: $options.letter(oi),
            b: ($data.userAns[i] || "") === $options.letter(oi),
            c: common_vendor.t($options.letter(oi)),
            d: common_vendor.t(op),
            e: oi
          };
        }),
        f: common_vendor.o(($event) => $options.onSingleChange(i, $event.detail.value), i)
      } : q.type === "multi" ? {
        h: common_vendor.f(q.options, (op, oi, i1) => {
          return {
            a: $options.letter(oi),
            b: ($data.userAns[i] || []).includes($options.letter(oi)),
            c: common_vendor.t($options.letter(oi)),
            d: common_vendor.t(op),
            e: oi
          };
        }),
        i: common_vendor.o(($event) => $options.onMultiChange(i, $event.detail.value), i)
      } : q.type === "judge" ? {
        k: ($data.userAns[i] || "") === "对",
        l: ($data.userAns[i] || "") === "错",
        m: common_vendor.o(($event) => $options.onJudgeChange(i, $event.detail.value), i)
      } : q.type === "blank" ? {
        o: common_vendor.f(q.blanks, (b, bi, i1) => {
          return {
            a: common_vendor.t(bi + 1),
            b: ($data.userAns[i] || [])[bi] || "",
            c: common_vendor.o(($event) => $options.onBlankInput(i, bi, $event.detail.value), bi),
            d: bi
          };
        })
      } : {}, {
        g: q.type === "multi",
        j: q.type === "judge",
        n: q.type === "blank",
        p: i
      });
    }),
    y: $data.currentIndex,
    z: common_vendor.o((...args) => $options.onSwiperChange && $options.onSwiperChange(...args)),
    A: common_vendor.o((...args) => $options.prevQ && $options.prevQ(...args)),
    B: $data.currentIndex === 0,
    C: common_vendor.t($data.currentIndex + 1),
    D: common_vendor.t($data.questions.length),
    E: common_vendor.o((...args) => $options.nextQ && $options.nextQ(...args)),
    F: $data.currentIndex === $data.questions.length - 1,
    G: common_vendor.o((...args) => $options.submitQuiz && $options.submitQuiz(...args))
  }) : {}, {
    H: $data.mode === "result"
  }, $data.mode === "result" ? {
    I: common_vendor.t($data.result.score),
    J: common_vendor.t($data.result.total),
    K: common_vendor.f($data.result.details, (d, i, i0) => {
      return {
        a: common_vendor.t(i + 1),
        b: common_vendor.t($options.typeName($data.questions[i].type)),
        c: common_vendor.t($data.questions[i].title),
        d: common_vendor.t(d.correct ? "正确" : "错误"),
        e: d.correct ? 1 : "",
        f: !d.correct ? 1 : "",
        g: i
      };
    }),
    L: common_vendor.o((...args) => $options.resetQuiz && $options.resetQuiz(...args))
  } : {});
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/quiz/chapter.js.map
