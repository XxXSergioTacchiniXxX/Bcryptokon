<template>
  <div
    v-if="isLoad"
    class="fixed w-100 h-100  bg-purple-800 inset-0 z-50 flex items-center justify-center"
  >
    <svg
      class="animate-spin -ml-1 mr-3 h-12 w-12 text-white"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        class="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        stroke-width="4"
      ></circle>
      <path
        class="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      ></path>
    </svg>
  </div>
  <div class="container mx-auto flex flex-col items-center bg-gray-100 p-4">
    <div class="container">
      <hr class="w-full border-t border-gray-600 my-4" />

      <add-ticker @add-ticker="add" :allTickerNames="allTickerNames" :activeTickers="tickers"/>

      <section>
        <label>
          Фильтр
          <input
            v-model="filterText"
            class="mt-1 mb-3 relative rounded-md shadow-md"
          />
        </label>
        <br />
        <button
          v-if="pageNumber > 1"
          @click="pageNumber--"
          class="my-4 mr-3 inline-flex items-center py-2 px-4 border border-transparent shadow-sm text-sm leading-4 font-medium rounded-full text-white bg-gray-600 hover:bg-gray-700 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
        >
          Назад
        </button>
        <button
          v-if="hasNextPage"
          @click="pageNumber++"
          class="my-4 inline-flex items-center py-2 px-4 border border-transparent shadow-sm text-sm leading-4 font-medium rounded-full text-white bg-gray-600 hover:bg-gray-700 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
        >
          Вперед
        </button>
      </section>
      <template v-if="tickers.length">
        <hr class="w-full border-t border-gray-600 my-4" />
        <dl class="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-3">
          <div
            v-for="t in slicedTickers"
            @click="select(t)"
            :key="t.name"
            :class="{
              'border-4': selectTicker === t,
            }"
            class="bg-white overflow-hidden shadow rounded-lg border-purple-800 border-solid cursor-pointer"
          >
            <div
              :class="{
                'bg-red-400': !t.isCorrect,
              }"
              class="px-4 py-5 sm:p-6 text-center"
            >
              <dt class="text-sm font-medium text-gray-500 truncate">
                {{ t.name }} - USD
              </dt>
              <dd class="mt-1 text-3xl font-semibold text-gray-900">
                {{ formatPrice(t.price) }}
              </dd>
            </div>
            <div class="w-full border-t border-gray-200"></div>
            <button
              @click.stop="remove(t)"
              class="flex items-center justify-center font-medium w-full bg-gray-100 px-4 py-4 sm:px-6 text-md text-gray-500 hover:text-gray-600 hover:bg-gray-200 hover:opacity-20 transition-all focus:outline-none"
            >
              <svg
                class="h-5 w-5"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="#718096"
                aria-hidden="true"
              >
                <path
                  fill-rule="evenodd"
                  d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                  clip-rule="evenodd"
                ></path></svg
              >Удалить
            </button>
          </div>
        </dl>
        <hr class="w-full border-t border-gray-600 my-4" />
      </template>
      <section v-if="selectTicker" class="relative">
        <h3 class="text-lg leading-6 font-medium text-gray-900 my-8">
          {{ selectTicker.name }} - USD
        </h3>
        <div
          class="flex items-end border-gray-600 border-b border-l h-64"
          ref="graph"
        >
          <div
            v-for="(bar, i) of normalizedGraph"
            :style="{
              height: `${bar}%`,
            }"
            ref="graphBar"
            :key="i"
            class="bg-purple-800 border w-10 "
          ></div>
        </div>
        <button
          @click="clearSelect"
          type="button"
          class="absolute top-0 right-0"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            xmlns:xlink="http://www.w3.org/1999/xlink"
            xmlns:svgjs="http://svgjs.com/svgjs"
            version="1.1"
            width="30"
            height="30"
            x="0"
            y="0"
            viewBox="0 0 511.76 511.76"
            style="enable-background:new 0 0 512 512"
            xml:space="preserve"
          >
            <g>
              <path
                d="M436.896,74.869c-99.84-99.819-262.208-99.819-362.048,0c-99.797,99.819-99.797,262.229,0,362.048    c49.92,49.899,115.477,74.837,181.035,74.837s131.093-24.939,181.013-74.837C536.715,337.099,536.715,174.688,436.896,74.869z     M361.461,331.317c8.341,8.341,8.341,21.824,0,30.165c-4.16,4.16-9.621,6.251-15.083,6.251c-5.461,0-10.923-2.091-15.083-6.251    l-75.413-75.435l-75.392,75.413c-4.181,4.16-9.643,6.251-15.083,6.251c-5.461,0-10.923-2.091-15.083-6.251    c-8.341-8.341-8.341-21.845,0-30.165l75.392-75.413l-75.413-75.413c-8.341-8.341-8.341-21.845,0-30.165    c8.32-8.341,21.824-8.341,30.165,0l75.413,75.413l75.413-75.413c8.341-8.341,21.824-8.341,30.165,0    c8.341,8.32,8.341,21.824,0,30.165l-75.413,75.413L361.461,331.317z"
                fill="#718096"
                data-original="#000000"
              ></path>
            </g>
          </svg>
        </button>
      </section>
    </div>
  </div>
</template>

<script>
import AddTicker from "./components/AddTicker.vue";

import {
  subToUpdatePrice,
  unsubToUpdatePrice,
  loadAllDataTickers,
} from "./api";

export default {
  components: {
    AddTicker,
  },

  name: "App",
  data() {
    return {
      ticker: "",
      tickers: [],

      filterText: "",
      pageNumber: 1,

      selectTicker: null,
      graph: [],
      isLoad: true,
      allTickerNames: [],
      maxGraphSize: 1,
    };
  },
  async created() {
    const windowsData = Object.fromEntries(
      new URL(window.location).searchParams.entries()
    );

    if (windowsData.filter) {
      this.filterText = windowsData.filter;
    }

    if (windowsData.pageNumber) {
      this.pageNumber = windowsData.pageNumber;
    }

    this.allTickerNames = await loadAllDataTickers();
    this.isLoad = false;

    const tickersData = localStorage.getItem("crypto-list");
    if (!tickersData) return;

    const loadedTickers = JSON.parse(tickersData);
    loadedTickers.forEach((t) => {
      subToUpdatePrice(t.name, (newPrice, isCorrect) => {
        this.updateTicker(t.name, newPrice, isCorrect);
      });
    });

    this.tickers = loadedTickers;
  },

  mounted() {
    window.addEventListener("resize", this.calculateMaxGraphSize);
  },

  beforeUnmount() {
    window.removeEventListener("resize", this.calculateMaxGraphSize);
  },

  computed: {
    graphBarWidth() {
      return this.$refs.graphBar.clientWidth;
    },

    normalizedGraph() {
      const maxValue = Math.max(...this.graph);
      const minValue = Math.min(...this.graph);

      return this.graph.map(
        (price) => 5 + ((price - minValue) * 95) / (maxValue - minValue + 1)
      );
    },

    slicedTickers() {
      return this.sortedTickers.slice(this.startIndex, this.endIndex);
    },

    hasNextPage() {
      return this.endIndex < this.sortedTickers.length;
    },

    sortedTickers() {
      return this.tickers.filter((t) =>
        t.name.includes(this.filterText.toUpperCase())
      );
    },

    startIndex() {
      return 6 * (this.pageNumber - 1);
    },
    endIndex() {
      return this.pageNumber * 6;
    },
    pageOptionURL() {
      return {
        pageNumber: this.pageNumber,
        filterText: this.filterText,
      };
    },
  },

  methods: {
    calculateMaxGraphSize() {
      if (!this.selectTicker) {
        return;
      }

      this.maxGraphSize = this.$refs.graph.clientWidth / this.graphBarWidth;
    },

    updateTicker(tickerName, newPrice, isCorrect) {
      this.tickers
        .filter((t) => t.name === tickerName)
        .forEach((t) => {
          t.price = newPrice;
          t.isCorrect = isCorrect;

          if (this.selectTicker?.name === tickerName) {
            this.graph.push(newPrice);
            this.$nextTick().then(this.calculateMaxGraphSize);
            if (this.graph.length > this.maxGraphSize) {
              this.graph = this.graph.splice(1, this.maxGraphSize);
            }
          }
        });
    },

    formatPrice(price) {
      if (price === "-") return price;

      return price > 1 ? price.toFixed(2) : price.toPrecision(2);
    },

    add(ticker) {

      const newTicker = {
        name: ticker.toUpperCase(),
        price: "-",
        isCorrect: true,
      };

      this.tickers = [...this.tickers, newTicker];

      subToUpdatePrice(newTicker.name, (price, isCorrect) => {
        this.updateTicker(newTicker.name, price, isCorrect);
      });
    },

    remove(deleteTickers) {
      unsubToUpdatePrice(deleteTickers.name);
      this.tickers = this.tickers.filter((item) => item !== deleteTickers);
      this.clearSelect();
    },

    select(newSelectTicker) {
      this.selectTicker = newSelectTicker;
    },

    clearSelect() {
      this.selectTicker = null;
      this.graph = [];
    },


    updateLocalStorage() {
      localStorage.setItem("crypto-list", JSON.stringify(this.tickers));
    },
  },

  watch: {
    slicedTickers() {
      if (this.slicedTickers.length === 0 && this.pageNumber > 1) {
        this.pageNumber--;
      }
    },

    selectTicker() {
      this.graph = [];
    },
    tickers() {
      this.updateLocalStorage();
    },
    filterText() {
      this.pageNumber = 1;
    },
    pageOptionURL(v) {
      window.history.pushState(
        null,
        document.title,
        `${window.location.pathname}?filter=${v.filterText}&pageNumber=${v.pageNumber}`
      );
    },
  },
};
</script>
