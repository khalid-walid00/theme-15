// تعريف واجهة للعناصر
interface Item {
  title: string;
  url: string;
  class: string;
}

// تعريف واجهة لسياق Alpine.js مع جعل $el و$refs اختيارية
interface AlpineComponent {
  $el?: HTMLElement;
  $refs?: { [key: string]: HTMLElement | HTMLElement[] };
  [key: string]: any;
}

// تعريف الواجهة العالمية
declare global {
  interface Window {
    xDataHeader: (lists: Item[]) => AlpineComponent;
    GlobalState: any;
    Alpine?: {
      nextTick: (callback: () => void) => void;
      start?: () => void;
    };
  }
}

function xDataHeader(lists: Item[]): AlpineComponent {
  return {
    allItems: lists,
    visibleItems: [] as Item[],
    dropdownItems: [] as Item[],
    container: null as HTMLElement | null,
    moreButton: null as HTMLElement | null,

    init(this: AlpineComponent) {
      this.container = this.$el?.querySelector(".header-lists") as HTMLElement | null;
      this.moreButton = this.container?.querySelector("button") as HTMLElement | null;
      this.updateItems();
      // تحديث بعد اكتمال تحميل الـ DOM
      window.Alpine?.nextTick(() => this.updateItems());
    },

    updateItems(this: AlpineComponent) {
      requestAnimationFrame(() => {
        if (!this.container) {
          console.error("Container not found!");
          this.visibleItems = this.allItems.slice(0, 3);
          this.dropdownItems = this.allItems.slice(3);
          return;
        }

        const containerWidth = this.container.offsetWidth;
        const moreButtonWidth = this.moreButton ? this.moreButton.offsetWidth + 10 : 0;

        const items = Array.isArray(this.$refs?.headerItem)
          ? (this.$refs.headerItem as HTMLElement[])
          : this.$refs?.headerItem
          ? [this.$refs.headerItem as HTMLElement]
          : [];

        if (items.length === 0) {
          const estimatedItemWidth = 100;
          let totalWidth = moreButtonWidth;
          let maxItems = 0;

          for (let i = 0; i < this.allItems.length; i++) {
            totalWidth += estimatedItemWidth + 10;
            if (totalWidth > containerWidth) break;
            maxItems = i + 1;
          }

          this.visibleItems = this.allItems.slice(0, maxItems || 1);
          this.dropdownItems = this.allItems.slice(maxItems || 1);
          return;
        }

        let totalWidth = moreButtonWidth;
        let maxItems = 0;

        for (let i = 0; i < this.allItems.length && i < items.length; i++) {
          totalWidth += items[i].offsetWidth + 10;
          if (totalWidth > containerWidth) break;
          maxItems = i + 1;
        }

        this.visibleItems = this.allItems.slice(0, maxItems);
        this.dropdownItems = this.allItems.slice(maxItems);
      });
    },
  };
}

window.xDataHeader = xDataHeader;