import type { Item, AlpineComponent } from './types';
function xDataHeader(lists: Item[]): AlpineComponent {
  return {
    allItems: lists,
    visibleItems: [] as Item[],
    dropdownItems: [] as Item[],
    container: null as HTMLElement | null,
    moreButton: null as HTMLElement | null,
    retryCount: 0,
    lastWidth: 0, // لتتبع آخر عرض لتجنب التحديثات غير الضرورية

    init(this: AlpineComponent) {
      this.container = this.$el?.querySelector(".header-lists") as HTMLElement | null;
      this.moreButton = this.container?.querySelector("button") as HTMLElement | null;

      // تحديث بعد تحميل الصفحة بالكامل
      window.addEventListener('load', () => {
        this.updateItems();
      });

      // تحديث أولي
      window.Alpine?.nextTick(() => this.updateItems());

      // مراقبة تغييرات الحاوية
      if (this.container) {
        const observer = new ResizeObserver(() => {
          const currentWidth = this.container?.clientWidth || 0;
          // تحديث فقط إذا تغير العرض بشكل كبير
          if (Math.abs(currentWidth - this.lastWidth) > 5) {
            this.updateItems();
          }
        });
        observer.observe(this.container);
      }
    },

    updateItems(this: AlpineComponent) {
      requestAnimationFrame(() => {
        if (!this.container) {
          console.warn("Container is null, stopping retries.");
          this.visibleItems = this.allItems.slice(0, Math.min(3, this.allItems.length));
          this.dropdownItems = this.allItems.slice(Math.min(3, this.allItems.length));
          return;
        }

        const isVisible = this.container.offsetParent !== null && this.container.getBoundingClientRect().width > 0;
        const containerWidth = this.container.clientWidth;

        if (!isVisible || containerWidth === 0) {
          if (this.retryCount >= 5) {
            console.warn("Max retries reached, using fallback.");
            this.visibleItems = this.allItems.slice(0, Math.min(3, this.allItems.length));
            this.dropdownItems = this.allItems.slice(Math.min(3, this.allItems.length));
            return;
          }

          this.retryCount++;
          console.warn(`Container not ready (retry ${this.retryCount}/5), visibility: ${isVisible}, width: ${containerWidth}`);
          setTimeout(() => this.updateItems(), 100);
          return;
        }

        // تحديث آخر عرض
        this.lastWidth = containerWidth;

        const gap = parseFloat(getComputedStyle(this.container).gap) || 10;
        const moreButtonWidth = this.moreButton ? this.moreButton.offsetWidth : 0;

        const items = Array.isArray(this.$refs?.headerItem)
          ? (this.$refs.headerItem as HTMLElement[])
          : this.$refs?.headerItem
          ? [this.$refs.headerItem as HTMLElement]
          : [];

        if (items.length === 0) {
          const estimatedItemWidth = this.estimateItemWidth();
          let totalWidth = moreButtonWidth;
          let maxItems = 0;

          for (let i = 0; i < this.allItems.length; i++) {
            totalWidth += estimatedItemWidth + gap;
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
          totalWidth += items[i].offsetWidth + gap;
          if (totalWidth > containerWidth) break;
          maxItems = i + 1;
        }

        this.visibleItems = this.allItems.slice(0, maxItems);
        this.dropdownItems = this.allItems.slice(maxItems);

        // التحقق من إمكانية إضافة عنصر إضافي
        if (this.dropdownItems.length > 0 && items.length > maxItems) {
          const nextItemWidth = items[maxItems]?.offsetWidth || 0;
          if (totalWidth + nextItemWidth + gap <= containerWidth) {
            this.visibleItems.push(this.dropdownItems.shift()!);
            totalWidth += nextItemWidth + gap;
          }
        }

        // تسجيل القيم للتصحيح
        console.log({
          containerWidth,
          moreButtonWidth,
          gap,
          totalWidth,
          maxItems,
          visibleItems: this.visibleItems.length,
          dropdownItems: this.dropdownItems.length,
          remainingSpace: containerWidth - totalWidth,
        });
      });
    },

    estimateItemWidth(this: AlpineComponent): number {
      if (!this.allItems.length) return 120;
      const canvas = document.createElement("canvas");
      const context = canvas.getContext("2d");
      if (!context) return 120;

      context.font = getComputedStyle(document.body).font || "16px sans-serif";
      const maxWidth = Math.max(...this.allItems.map((item :any ) => context.measureText(item.title).width));
      return maxWidth + 20;
    },
  };
}

window.xDataHeader = xDataHeader;