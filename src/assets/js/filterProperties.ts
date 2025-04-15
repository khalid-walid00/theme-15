declare global {
  interface Window {
    xDataPropertiesFilter: () => any;
    setProperties?: (properties: number[]) => void;
  }
}

export default function xDataPropertiesFilter() {
  return {
    selectedFilters: {
      colors: [] as { id: number; value: string }[],
      texts: [] as { id: number; value: string }[]
    },
    globalProperties: [] as number[],
    FilterCategoryItems: [] as { id: number; title: string }[],

    toggleFilterCategory(item: { id: number; title: string }) {
      const index = this.FilterCategoryItems.findIndex((i) => i.id === item.id);
      if (index === -1) {
        this.FilterCategoryItems.push(item);
      } else {
        this.FilterCategoryItems.splice(index, 1);
      }

      const ids = this.FilterCategoryItems.map(i => i.id);

      if (typeof window.updateLoading === 'function') window.updateLoading('page', true);
      Qumra.products.setCategory(ids).then((res) => {
        window.updateLoading('page', false);
        window.updateContext({ products: res.data.products });
      }).catch((err) => {
        console.error("setCategory error", err);
      });
    },

    addFilter(type: 'colors' | 'texts', item: { id: number; value: string }) {
      if (!this.selectedFilters[type]) {
        this.selectedFilters[type] = [];
      }

      const list = this.selectedFilters[type];
      const index = list.findIndex((f) => f.id === item.id);

      if (index > -1) {
        this.selectedFilters[type].splice(index, 1);
      } else {
        this.selectedFilters[type].push(item);
      }

      this.updateFilters();
    },

    updateFilters() {
      this.globalProperties = [
        ...new Set([
          ...this.selectedFilters.colors.map((c) => c.id),
          ...this.selectedFilters.texts.map((t) => t.id)
        ])
      ];

      const properties = this.globalProperties;
      if (typeof window.updateLoading === 'function') window.updateLoading('page', true);
      Qumra.products.setProperties(properties).then((res) => {
        window.updateLoading('page', false);
        window.updateContext({ products: res.data.products });
      }).catch((err) => {
        console.error("setProperties error", err);
      });
    },

    clearAllFilters() {
      this.selectedFilters.colors = [];
      this.selectedFilters.texts = [];
      this.FilterCategoryItems = [];
      this.globalProperties = [];
      if (typeof window.updateLoading === 'function') window.updateLoading('page', true);
      Promise.all([
        Qumra.products.setCategory([]),
        Qumra.products.setProperties([])
      ]).then(([categoryRes, propertiesRes]) => {
        window.updateLoading('page', false);
        window.updateContext({ products: propertiesRes.data.products });
      }).catch((err) => {
        console.error("clearAllFilters error", err);
      });
    },

    isSelected(type: 'colors' | 'texts', id: number) {
      return this.selectedFilters[type]?.some((f) => f.id === id);
    },

    isCategorySelected(id: number) {
      return this.FilterCategoryItems.some((item) => item.id === id);
    }
  };
}

window.xDataPropertiesFilter = xDataPropertiesFilter;
