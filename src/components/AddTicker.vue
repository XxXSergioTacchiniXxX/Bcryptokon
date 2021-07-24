<template>
  <section class="mb-3">
    <div class="flex">
      <div class="max-w-xs">
        <label for="wallet" class="block text-sm font-medium text-gray-700"
          >Тикер</label
        >
        <div class="mt-1 relative rounded-md shadow-md">
          <input
            v-model="ticker"
            @keydown.enter="add"
            type="text"
            name="wallet"
            id="wallet"
            class="block w-full pr-10 border-gray-300 text-gray-900 focus:outline-none p-2 focus:ring-gray-500 focus:border-gray-500 sm:text-sm rounded-md"
            placeholder="Например DOGE"
          />
        </div>
        <div
          v-if="hints.length"
          class="flex bg-white shadow-md p-1 rounded-md shadow-md flex-wrap mt-2 mb-2"
        >
          <span
            v-for="hint of hints"
            @click="selectHint(hint)"
            :key="hint"
            class="inline-flex items-center px-2 m-1 rounded-md text-xs font-medium bg-gray-300 text-gray-800 cursor-pointer"
          >
            {{ hint }}
          </span>
        </div>
        <div v-if="hasAddTickerError" class="text-sm text-red-600">
          Такой тикер уже добавлен
        </div>
      </div>
    </div>
    <add-button @click="add" />
  </section>
</template>

<script>
import AddButton from "./AddButton.vue";

export default {
  components: {
    AddButton,
  },

  data() {
    return {
      ticker: "",
      hints: [],
      isAddTickerError: false,
    };
  },

  props: {
    allTickerNames: {
      type: Array,
      required: false,
    },

    activeTickers: {
      type: Array,
      required: false,
    },
  },

  emits: {
    "add-ticker": {
      type: String,
    },
  },

  methods: {
    selectHint(tickerName) {
      this.isAddTickerError = false;
      this.ticker = tickerName;
      this.add();
    },

    updateHints() {
      if (!this.ticker) {
        this.hints = [];
        return;
      }

      const matchs = this.allTickerNames.filter((name) =>
        name.includes(this.ticker.toUpperCase())
      );

      this.hints = matchs.slice(0, 4);
    },

    add() {
      if (this.hasAddTickerError) return;

      this.$emit("add-ticker", this.ticker);
      this.ticker = "";
    },
  },

  watch: {
    ticker() {
      this.updateHints();
    },
  },

  computed: {
    hasAddTickerError() {
      const hasError = this.activeTickers.find(
        (ticker) => ticker.name === this.ticker.toUpperCase()
      );
      return !!hasError;
    },
  },
};
</script>

<style></style>
