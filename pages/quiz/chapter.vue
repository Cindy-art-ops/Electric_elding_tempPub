<template>
  <view class="page">
    <view class="ios-large-title">章节自测</view>
    <text>当前章节：{{ chapter }}</text>

    <!-- 概览卡片 -->
    <view class="card ios-card">
      <view class="actions">
        <button
          class="btn-outline"
          size="mini"
          @tap="remoteSync"
          :disabled="syncing"
        >
          {{ syncing ? "同步中..." : "远程同步题库" }}
        </button>
        <button
          class="btn-primary"
          size="mini"
          style="margin-left: 12rpx"
          @tap="goImport"
        >
          导入题库
        </button>
      </view>
      <view class="hr" />
      <view>
        <text v-if="!bank.list.length" class="muted"
          >暂无导入题目，可点击“导入题库”。</text
        >
        <view v-else>
          <text class="muted"
            >汇总：单选 {{ count.single }} 道，多选 {{ count.multi }} 道，判断
            {{ count.judge }} 道，填空 {{ count.blank }} 道（合计
            {{ bank.list.length }}）</text
          >
          <view class="q" v-for="(q, i) in bank.list.slice(0, 3)" :key="i"
            >{{ i + 1 }}. [{{ typeName(q.type) }}] {{ q.title }}</view
          >
          <view class="actions" v-if="mode === 'view'">
            <button
              class="btn-primary"
              @tap="startQuiz"
              style="margin-top: 12rpx"
            >
              开始答题
            </button>
          </view>
        </view>
      </view>
    </view>

    <!-- 答题区 -->
    <view class="card ios-card" v-if="mode === 'do'">
      <view class="quiz-title">答题中（共 {{ questions.length }} 题）</view>
      <view class="opt-row">
        <text>横向逐题切换</text>
        <switch :checked="horizontal" @change="onToggleLayout" />
      </view>

      <!-- 竖向：全部题纵向滚动 -->
      <view v-if="!horizontal">
        <view class="quiz-item" v-for="(q, i) in questions" :key="i">
          <view class="quiz-q"
            >{{ i + 1 }}. [{{ typeName(q.type) }}] {{ q.title }}</view
          >
          <view v-if="q.type === 'single'">
            <radio-group @change="onSingleChange(i, $event.detail.value)">
              <label class="row" v-for="(op, oi) in q.options" :key="oi">
                <radio
                  :value="letter(oi)"
                  :checked="(userAns[i] || '') === letter(oi)"
                />
                <text>{{ letter(oi) }}. {{ op }}</text>
              </label>
            </radio-group>
          </view>
          <view v-else-if="q.type === 'multi'">
            <checkbox-group @change="onMultiChange(i, $event.detail.value)">
              <label class="row" v-for="(op, oi) in q.options" :key="oi">
                <checkbox
                  :value="letter(oi)"
                  :checked="(userAns[i] || []).includes(letter(oi))"
                />
                <text>{{ letter(oi) }}. {{ op }}</text>
              </label>
            </checkbox-group>
          </view>
          <view v-else-if="q.type === 'judge'">
            <radio-group @change="onJudgeChange(i, $event.detail.value)">
              <label class="row"
                ><radio
                  value="对"
                  :checked="(userAns[i] || '') === '对'"
                /><text>对</text></label
              >
              <label class="row"
                ><radio
                  value="错"
                  :checked="(userAns[i] || '') === '错'"
                /><text>错</text></label
              >
            </radio-group>
          </view>
          <view v-else-if="q.type === 'blank'">
            <view class="row" v-for="(b, bi) in q.blanks" :key="bi">
              <text>填空{{ bi + 1 }}：</text>
              <input
                class="blank-input"
                :value="(userAns[i] || [])[bi] || ''"
                @input="onBlankInput(i, bi, $event.detail.value)"
                placeholder="请输入"
              />
            </view>
          </view>
        </view>
        <view class="actions">
          <button class="btn-outline" @tap="resetQuiz">取消</button>
          <button
            class="btn-primary"
            style="margin-left: 12rpx"
            @tap="submitQuiz"
          >
            提交评分
          </button>
        </view>
      </view>

      <!-- 横向：swiper 逐题切换 -->
      <view v-else>
        <swiper class="swiper" :current="currentIndex" @change="onSwiperChange">
          <swiper-item v-for="(q, i) in questions" :key="i">
            <view class="quiz-item">
              <view class="quiz-q"
                >{{ i + 1 }}. [{{ typeName(q.type) }}] {{ q.title }}</view
              >
              <view v-if="q.type === 'single'">
                <radio-group @change="onSingleChange(i, $event.detail.value)">
                  <label class="row" v-for="(op, oi) in q.options" :key="oi">
                    <radio
                      :value="letter(oi)"
                      :checked="(userAns[i] || '') === letter(oi)"
                    />
                    <text>{{ letter(oi) }}. {{ op }}</text>
                  </label>
                </radio-group>
              </view>
              <view v-else-if="q.type === 'multi'">
                <checkbox-group @change="onMultiChange(i, $event.detail.value)">
                  <label class="row" v-for="(op, oi) in q.options" :key="oi">
                    <checkbox
                      :value="letter(oi)"
                      :checked="(userAns[i] || []).includes(letter(oi))"
                    />
                    <text>{{ letter(oi) }}. {{ op }}</text>
                  </label>
                </checkbox-group>
              </view>
              <view v-else-if="q.type === 'judge'">
                <radio-group @change="onJudgeChange(i, $event.detail.value)">
                  <label class="row"
                    ><radio
                      value="对"
                      :checked="(userAns[i] || '') === '对'"
                    /><text>对</text></label
                  >
                  <label class="row"
                    ><radio
                      value="错"
                      :checked="(userAns[i] || '') === '错'"
                    /><text>错</text></label
                  >
                </radio-group>
              </view>
              <view v-else-if="q.type === 'blank'">
                <view class="row" v-for="(b, bi) in q.blanks" :key="bi">
                  <text>填空{{ bi + 1 }}：</text>
                  <input
                    class="blank-input"
                    :value="(userAns[i] || [])[bi] || ''"
                    @input="onBlankInput(i, bi, $event.detail.value)"
                    placeholder="请输入"
                  />
                </view>
              </view>
            </view>
          </swiper-item>
        </swiper>
        <view class="actions" style="align-items: center">
          <button
            class="btn-outline"
            @tap="prevQ"
            :disabled="currentIndex === 0"
          >
            上一题
          </button>
          <text class="muted" style="margin: 0 12rpx"
            >{{ currentIndex + 1 }} / {{ questions.length }}</text
          >
          <button
            class="btn-outline"
            @tap="nextQ"
            :disabled="currentIndex === questions.length - 1"
          >
            下一题
          </button>
          <button
            class="btn-primary"
            style="margin-left: 12rpx"
            @tap="submitQuiz"
          >
            提交评分
          </button>
        </view>
      </view>
    </view>

    <!-- 结果区 -->
    <view class="card ios-card" v-if="mode === 'result'">
      <view class="quiz-title"
        >成绩：{{ result.score }} / {{ result.total }}</view
      >
      <view class="quiz-item" v-for="(d, i) in result.details" :key="i">
        <view class="quiz-q"
          >{{ i + 1 }}. [{{ typeName(questions[i].type) }}]
          {{ questions[i].title }}</view
        >
        <view class="verdict" :class="{ ok: d.correct, bad: !d.correct }">{{
          d.correct ? "正确" : "错误"
        }}</view>
      </view>
      <view class="actions">
        <button class="btn-outline" @tap="resetQuiz">返回</button>
      </view>
    </view>
  </view>
</template>

<script>
export default {
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
      currentIndex: 0,
    };
  },
  onLoad(q) {
    this.chapter = q && q.chapter ? q.chapter : "";
    this.loadBank();
  },
  methods: {
    goImport() {
      uni.navigateTo({ url: "/pages/quiz/import" });
    },
    loadBank() {
      try {
        const prefix = this.chapter
          ? `quiz_bank_${this.chapter}_`
          : "quiz_bank_";
        const packs = [
          uni.getStorageSync(prefix + "single") || {},
          uni.getStorageSync(prefix + "multi") || {},
          uni.getStorageSync(prefix + "judge") || {},
          uni.getStorageSync(prefix + "blank") || {},
        ];
        const list = packs.flatMap((p) =>
          Array.isArray(p.list) ? p.list.map((q) => ({ ...q })) : []
        );
        this.bank = { type: "mix", list };
        this.count = {
          single: (uni.getStorageSync(prefix + "single")?.list || []).length,
          multi: (uni.getStorageSync(prefix + "multi")?.list || []).length,
          judge: (uni.getStorageSync(prefix + "judge")?.list || []).length,
          blank: (uni.getStorageSync(prefix + "blank")?.list || []).length,
        };
      } catch (e) {
        this.bank = { type: "", list: [] };
        this.count = { single: 0, multi: 0, judge: 0, blank: 0 };
      }
    },
    remoteSync() {
      // 将“远程同步题库”按钮行为调整为：加载示例题库
      if (this.syncing) return;
      this.syncing = true;
      uni.showLoading({ title: "同步中..." });
      setTimeout(() => {
        const single = [
          {
            type: "single",
            title: "焊接电弧的热源主要来源于？",
            options: ["电能", "机械能", "化学能", "核能"],
            answer: ["A"],
          },
          {
            type: "single",
            title: "焊条药皮的主要作用是？",
            options: ["形成保护气体", "增加焊缝强度", "降低电压", "提高电流"],
            answer: ["A"],
          },
        ];
        const multi = [
          {
            type: "multi",
            title: "关于焊接安全，下列说法正确的是？",
            options: [
              "焊接时应佩戴护目镜",
              "工作场所要有良好通风",
              "可以用湿手触摸焊机",
              "需要穿戴防护手套",
            ],
            answer: ["A", "B", "D"],
          },
        ];
        const judge = [
          {
            type: "judge",
            title: "焊接过程中产生的紫外线对人体无害。",
            answer: "错",
          },
          {
            type: "judge",
            title: "CO2气体保护焊常用于低碳钢的焊接。",
            answer: "对",
          },
        ];
        const blank = [
          {
            type: "blank",
            title: "焊接接头通常由【焊缝】和【热影响区】组成。",
            blanks: 2,
            answer: ["焊缝", "热影响区"],
          },
        ];
        const prefix = this.chapter
          ? `quiz_bank_${this.chapter}_`
          : "quiz_bank_";
        uni.setStorageSync(prefix + "single", {
          type: "single",
          list: single,
          ts: Date.now(),
        });
        uni.setStorageSync(prefix + "multi", {
          type: "multi",
          list: multi,
          ts: Date.now(),
        });
        uni.setStorageSync(prefix + "judge", {
          type: "judge",
          list: judge,
          ts: Date.now(),
        });
        uni.setStorageSync(prefix + "blank", {
          type: "blank",
          list: blank,
          ts: Date.now(),
        });
        this.loadBank();
        uni.hideLoading();
        this.syncing = false;
        uni.showToast({ title: "同步成功", icon: "success" });
      }, 500);
    },
    onToggleLayout(e) {
      this.horizontal = !!e.detail.value;
    },
    onSwiperChange(e) {
      this.currentIndex = e.detail.current || 0;
    },
    prevQ() {
      if (this.currentIndex > 0) this.currentIndex--;
    },
    nextQ() {
      if (this.currentIndex < this.questions.length - 1) this.currentIndex++;
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
          ok =
            right.length === mine.length &&
            right.every((v, idx) => v === mine[idx]);
        }
        if (ok) score++;
        details.push({ correct: ok });
      }
      this.result = { score, total: this.questions.length, details };
      this.mode = "result";
      // 记录错题
      const wrong = [];
      details.forEach((d, idx) => {
        if (!d.correct)
          wrong.push({ q: this.questions[idx], user: this.userAns[idx] });
      });
      if (wrong.length) {
        try {
          const key = `mistakes_${this.chapter || "all"}`;
          const old = uni.getStorageSync(key) || [];
          uni.setStorageSync(key, [...wrong, ...old]);
        } catch (e) {}
      }
    },
    letter(i) {
      return String.fromCharCode(65 + i);
    },
    onSingleChange(i, val) {
      this.$set ? this.$set(this.userAns, i, val) : (this.userAns[i] = val);
    },
    onMultiChange(i, vals) {
      this.$set ? this.$set(this.userAns, i, vals) : (this.userAns[i] = vals);
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
      return t === "single"
        ? "单选题"
        : t === "multi"
        ? "多选题"
        : t === "judge"
        ? "判断题"
        : t === "blank"
        ? "填空题"
        : "未知";
    },
  },
};
</script>

<style>
.page {
  padding: 24rpx;
}
.title {
  font-size: 32rpx;
  font-weight: 600;
  margin-bottom: 16rpx;
}
.card {
  margin-top: 16rpx;
  background: #fff;
  padding: 20rpx;
  border-radius: 12rpx;
}
.hr {
  height: 1rpx;
  background: #f0f0f0;
  margin: 16rpx 0;
}
.actions {
  display: flex;
  justify-content: flex-end;
  align-items: center;
}
.row {
  display: flex;
  align-items: center;
}
.opt-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8rpx;
}
.muted {
  color: #6d6d72;
}
.q {
  margin-top: 8rpx;
}
.quiz-title {
  font-weight: 600;
  margin-bottom: 8rpx;
}
.quiz-item {
  padding: 12rpx 0;
  border-top: 1rpx solid #f3f3f3;
}
.quiz-q {
  margin-bottom: 8rpx;
}
.blank-input {
  flex: 1;
  background: #fafafa;
  border-radius: 8rpx;
  padding: 8rpx 12rpx;
  margin-left: 8rpx;
}
.verdict {
  margin-top: 6rpx;
  font-size: 26rpx;
}
.verdict.ok {
  color: #2e7d32;
}
.verdict.bad {
  color: #c62828;
}
.swiper {
  height: 520rpx;
}
</style>
