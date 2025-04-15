type SortOption = {
  key: string;
  label: string;
  value: 'asc' | 'desc';
};


declare global {
  interface Window {
    xDataSort: () => ReturnType<typeof xDataSort>;
    setSort?: (key: string, value: string) => void;
  }
}

export default function xDataSort() {
  return {
    selectedValue: null as string | null,
    selectedLabel: null as string | null,
    options: [
      { key: 'date', label: 'المضاف حديثا', value: 'desc' },
      { key: 'date', label: 'المضاف قديما', value: 'asc' },
      { key: 'price', label: 'السعر الاعلي', value: 'desc' },
      { key: 'price', label: 'السعر الاقل', value: 'asc' }
    ] as SortOption[],
    selectOption(option: SortOption) {
      this.selectedValue = option.value;
      this.selectedLabel = option.label;
      if( typeof window.updateLoading === 'function')  window.updateLoading('page', true);
      Qumra.products.setSort(option.key, option.value).then((res: any) => {
        window.updateLoading('page', false);
        window.toggleModal({ type: "sort", open: false });
        window.updateContext({ products: res.data.products });
      }).catch((err: any) => {
        console.error("setSort error", err);
      });
    },
  };
}

window.xDataSort = xDataSort;
