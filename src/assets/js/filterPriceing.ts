
declare global {
  interface Window {
    xDataPriceSlider: () => any;
    GlobalState: any;

  }
}

function xDataPriceSlider() {
  return {
    minVal: 0,
    maxVal: 9999,
    minPos: 0,
    maxPos: 100,
    maxLimit: 9999,
    dragging: null,
    lastUpdate: 0,

    updatePosition() {
      this.minPos = (this.minVal / this.maxLimit) * 100;
      this.maxPos = (this.maxVal / this.maxLimit) * 100;
    },

    startDrag(type:any) {
      this.dragging = type;
    },

    stopDrag() {
      if (!this.dragging) return;
      this.dragging = null;
      if( typeof window.updateLoading === 'function')  window.updateLoading('page', true);
          Qumra.products.setPriceRange(this.minVal, this.maxVal)
        .then((res: any) => {
         window.updateLoading('page', false);
      console.log("setPrice", this.minVal, this.maxVal);
      window.updateContext({products: res.data.products});
        })
        .catch((err: any) => {
          console.error("setPrice error", err);
        });
    },

    drag(event:any) {
      if (!this.dragging) return;
      const now = Date.now();
      if (now - this.lastUpdate < 16) return;
      this.lastUpdate = now;

      const clientX = event.type.includes('touch')
        ? event.touches[0].clientX
        : event.clientX;

      const slider = event.currentTarget;
      if (!slider) {
        console.error('Slider not found');
        return;
      }

      const rect = slider.getBoundingClientRect();
      const newPos = Math.max(0, Math.min(100, ((clientX - rect.left) / rect.width) * 100));
      const newVal = Math.round((newPos / 100) * this.maxLimit);

      if (this.dragging === 'min' && newVal < this.maxVal - 50 && newVal >= 0) {
        this.minVal = newVal;
        this.updatePosition();
      } else if (this.dragging === 'max' && newVal > this.minVal + 50 && newVal <= this.maxLimit) {
        this.maxVal = newVal;
        this.updatePosition();
      }
    }
  };
}

window.xDataPriceSlider = xDataPriceSlider;