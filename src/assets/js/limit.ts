type Option = {
  value: number;
  label: string;
};

function xDataLimit() {
  return {
    selectedValue: null as number | null,
    selectedLabel: null as string | null,
    options: [
      { value: 10, label: '10 منتج' },
      { value: 20, label: '20 منتج' },
      { value: 30, label: '30 منتج' }
    ] as Option[],
    selectOption(option: Option) {
      this.selectedValue = option.value;
      this.selectedLabel = option.label;
      if (typeof window.updateLoading === 'function') window.updateLoading('page', true);
      Qumra.products.setLimit(option.value).then((res: any) => {
        window.updateLoading('page', false);
        window.toggleModal({ type: "sort", open: false });
        window.updateContext({ products: res.data.products, pagination: res.data.pagination });
      }).catch((err: any) => {
        console.error("setLimit error", err);
      }
      );

    },
  };
}
window.xDataLimit = xDataLimit;
