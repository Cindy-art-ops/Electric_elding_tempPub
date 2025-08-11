<template>
  <scroll-view class="page" scroll-y>
    <view class="tip"
      >支持粘贴四种题型的文本模版，解析成功后会暂存到本地（仅前端）。</view
    >

    <view class="tabs">
      <view
        v-for="t in tabs"
        :key="t.key"
        class="tab"
        :class="{ active: t.key === cur }"
        @tap="cur = t.key"
        >{{ t.name }}</view
      >
    </view>

    <textarea class="editor" v-model="raw" :placeholder="placeholder" />
    <view class="btns">
      <button class="btn-outline" @tap="fillSample">填入示例</button>
      <button class="btn-primary" @tap="parseNow">解析保存</button>
    </view>

    <view v-if="err" class="err">{{ err }}</view>
    <view v-if="preview.length" class="preview">
      <view class="pre-title">解析预览（{{ preview.length }} 道）</view>
      <view class="card" v-for="(q, i) in preview" :key="i">
        <text class="q">{{ i + 1 }}. {{ q.title }}</text>
        <view v-if="q.options">
          <text v-for="(op, oi) in q.options" :key="oi"
            >{{ String.fromCharCode(65 + oi) }}. {{ op }}</text
          >
        </view>
        <text class="a"
          >答案：{{
            Array.isArray(q.answer) ? q.answer.join(",") : q.answer
          }}</text
        >
      </view>
    </view>
  </scroll-view>
</template>

<script>
const KEY = "quiz_import_bank";
export default {
  data() {
    return {
      tabs: [
        { key: "single", name: "单选题" },
        { key: "multi", name: "多选题" },
        { key: "judge", name: "判断题" },
        { key: "blank", name: "填空题" },
      ],
      cur: "single",
      raw: "",
      err: "",
      preview: [],
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
    },
  },
  methods: {
    fillSample() {
      const samples = {
        single: `焊接电弧的热源主要来源于？\nA. 电能\nB. 机械能\nC. 化学能\nD. 核能\n答案：A\n---\n焊条药皮的主要作用是？\nA. 形成保护气体\nB. 增加焊缝强度\nC. 降低电压\nD. 提高电流\n答案：A`,
        multi: `关于焊接安全，下列说法正确的是？\nA. 焊接时应佩戴护目镜\nB. 工作场所要有良好通风\nC. 可以用湿手触摸焊机\nD. 需要穿戴防护手套\n答案：A,B,D`,
        judge: `焊接过程中产生的紫外线对人体无害。\n答案：错\n---\nCO2气体保护焊常用作低碳钢的焊接。\n答案：对`,
        blank: `焊接接头通常由【焊缝】和【热影响区】组成。\n答案：焊缝|热影响区`,
      };
      this.raw = samples[this.cur];
    },
    parseNow() {
      this.err = "";
      try {
        const res = this.parseText(this.cur, this.raw);
        this.preview = res;
        // 按章节维度可扩展，这里简化存储
        const pack = { type: this.cur, list: res, ts: Date.now() };
        uni.setStorageSync(KEY, pack);
        // 额外按题型单独存储，便于“章节自测”汇总展示
        uni.setStorageSync(`quiz_bank_${this.cur}`, pack);
        uni.showToast({ title: "解析成功", icon: "success" });
      } catch (e) {
        this.err = String(e.message || e);
      }
    },
    parseText(type, text) {
      if (!text || !text.trim()) throw new Error("请输入题目文本");
      const blocks = text.split(/\n---\n/);
      const list = [];
      for (const b of blocks) {
        const lines = b
          .split(/\n/)
          .map((s) => s.trim())
          .filter(Boolean);
        if (lines.length < 2) continue;
        const title = lines[0];
        const ansLine = lines.find((l) => /^答案：/i.test(l));
        if (!ansLine) throw new Error("缺少“答案：”行");
        const answerRaw = ansLine.replace(/^答案：/i, "").trim();

        if (type === "single" || type === "multi") {
          const opts = lines
            .slice(1)
            .filter((l) => /^[A-D][\.|、]/.test(l))
            .map((l) => l.replace(/^[A-D][\.|、]\s*/, ""));
          if (opts.length < 2) throw new Error("选项不足");
          let answer = answerRaw
            .split(/[,，]/)
            .map((s) => s.trim())
            .filter(Boolean);
          if (type === "single" && answer.length !== 1)
            throw new Error("单选题答案只能有1个");
          // 转换成索引或字母均可，这里保留字母
          list.push({ type, title, options: opts, answer });
        } else if (type === "judge") {
          const answer = /^(对|错|正确|错误)$/i.test(answerRaw)
            ? /(对|正确)/i.test(answerRaw)
              ? "对"
              : "错"
            : null;
          if (!answer) throw new Error("判断题答案仅支持 对/错/正确/错误");
          list.push({ type, title, answer });
        } else if (type === "blank") {
          const answer = answerRaw
            .split("|")
            .map((s) => s.trim())
            .filter(Boolean);
          if (!answer.length) throw new Error("填空题至少一个答案");
          list.push({
            type,
            title,
            blanks: (title.match(/【.+?】/g) || []).length || answer.length,
            answer,
          });
        }
      }
      if (!list.length) throw new Error("未解析到题目");
      return list;
    },
  },
};
</script>

<style lang="scss">
$primary: #d32f2f;
.page {
  padding: 24rpx;
}
.tip {
  color: #666;
  font-size: 24rpx;
  margin-bottom: 12rpx;
}
.tabs {
  display: flex;
  background: #fff;
  border-radius: 12rpx;
  overflow: hidden;
  margin-bottom: 12rpx;
}
.tab {
  flex: 1;
  text-align: center;
  padding: 16rpx;
  color: #666;
}
.tab.active {
  color: #fff;
  background: $primary;
}
.editor {
  width: 100%;
  height: 420rpx;
  background: #fff;
  border-radius: 12rpx;
  padding: 16rpx;
  box-sizing: border-box;
}
.btns {
  display: flex;
  gap: 12rpx;
  margin: 12rpx 0 6rpx;
}
.btn-primary {
  background: $primary;
  color: #fff;
}
.btn-outline {
  color: $primary;
  border: 2rpx solid $primary;
  background: #fff;
}
.err {
  color: #d32f2f;
  margin: 8rpx 0;
}
.preview {
  margin-top: 8rpx;
}
.pre-title {
  font-weight: 600;
  margin-bottom: 8rpx;
}
.card {
  background: #fff;
  border-radius: 12rpx;
  padding: 16rpx;
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.06);
}
.card + .card {
  margin-top: 12rpx;
}
.q {
  display: block;
  margin-bottom: 6rpx;
}
.a {
  color: #333;
  margin-top: 6rpx;
  display: block;
}
</style>
