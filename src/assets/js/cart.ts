declare global {
  interface Window {
    xDataCart: () => any;
    GlobalState: any;
  }
}

export default function xDataCart() {

  
  return {
    loading:{
      checkout: false,
      cart: false,
    },
    clearCartItem(id: string) {
      this.loading.cart = true
      window.Qumra.cart.clearCartItem(id).then((res) => {
        window.updateCart(res);
          this.loading.cart = false
        }).catch((err: any) => {
        console.error("clearCartItem error", err);
      });
    },

    decreaseCartItem(id: string, quantity: number) {
          this.loading.cart = true
          window.Qumra.cart.updateQuantity(id, quantity - 1)
        .then((res) => {
          window.updateCart(res)
          this.loading.cart = false
        })
        .catch((err: any) => console.error("decreaseCartItem error", err));
    },

    increaseCartItem(id: string, quantity: number) {
      this.loading.cart = true
      window.Qumra.cart.updateQuantity(id, quantity + 1)
        .then((res) => {
          window.updateCart(res)
          this.loading.cart = false
        })
        .catch((err: any) => console.error("increaseCartItem error", err));
    },

    checkout() {
      this.loading.checkout = true
      window.Qumra.order.checkout()
        .then((res: any) => {
        this.loading.checkout = false
          window.location.href = res.url;
        })
        .catch((err: any) => {
          console.error("checkout error", err);
        })
        .finally(() => {
          window.loading.checkout = false;
        });
    },
  };
}

window.xDataCart = xDataCart;
