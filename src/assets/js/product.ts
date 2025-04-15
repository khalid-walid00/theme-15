declare global {
    interface Window {
        xDataproduct: (product?: any) => any;
        GlobalState: any;
    }
}

function xDataproduct(product: any) {
    return {
        quntity: product?.minQuantity || 1,
        localType: null as 'call' | 'whatsapp' | null,
        gridSystem: window.innerWidth < 768
            ? 'grid-cols-1' :  window.innerWidth < 992 ? 'sm:grid-cols-3 grid-cols-2'
            : 'lg:grid-cols-4  sm:grid-cols-3 grid-cols-2',
        loading: {
            cart: false,
            checkout: false,
            priceAtCall: false,
            priceAtCallWhatsApp: false,
            buyNow: false,
        },
        loadingProducts: {} as Record<string, boolean>,

        updateGridSystem(grid: string) {
            this.gridSystem = grid;
        },

        isProductLoading(productId: string) {
            return !!this.loadingProducts[productId];
        },

        buyNowProduct(productId: string) {
            this.loading.checkout = true;
            window.Qumra.cart.buyNow(productId, this.quntity)
                .then((res: any) => {
                    this.loading.checkout = false;
                    window.updateCart(res);
                })
                .catch(() => {
                    this.loading.checkout = false;
                });
        },

        addProductToCart(productId: string, quantity?: number) {
            this.loadingProducts[productId] = true;
            window.Qumra.cart.addCartItem(productId, quantity || this.quntity)
                .then((res: any) => {
                    this.loadingProducts[productId] = false;
                    window.updateCart(res);
                })
                .catch(() => {
                    this.loadingProducts[productId] = false;
                });
        },

        async priceAtCallMethod(type: 'call' | 'whatsapp') {
            this.localType = type;
            if (type === 'call') {
                this.loading.priceAtCall = true;
            } else {
                this.loading.priceAtCallWhatsApp = true;
            }

            window.Qumra.product.productPriceAtCall(type)
                .then((res: any) => {
                    if (res?.type === 'whatsapp') {
                        window.location.href = `https://wa.me/${res.phone}`;
                    } else if (res?.type === 'call') {
                        window.location.href = `tel:${res.phone}`;
                    }
                })
                .catch((err: any) => {
                    console.error("productPriceAtCall error", err);
                })
                .finally(() => {
                    if (type === 'call') {
                        this.loading.priceAtCall = false;
                    } else {
                        this.loading.priceAtCallWhatsApp = false;
                    }
                });
        },

        decreaseCartItem(quantity: number) {
            if (quantity <= product?.minQuantity) return;
            this.quntity = quantity - 1;
        },

        increaseCartItem(quantity: number) {
            this.quntity = quantity + 1;
        },

        checkout() {
            this.loading.checkout = true;
            window.Qumra.order.checkout()
                .then((res: any) => {
                    window.location.href = res.url;
                })
                .catch((err: any) => {
                    console.error("checkout error", err);
                })
                .finally(() => {
                    this.loading.checkout = false;
                });
        },

        updateLoading(type: 'cart' | 'checkout' | 'priceAtCall' | 'priceAtCallWhatsApp' | 'buyNow', value: boolean) {
            this.loading[type] = value;
        },
    };
}

document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("productForm") as HTMLFormElement | null;

    const addToCartBtn = document.getElementById("addToCartBtn") as HTMLButtonElement | null;
    const addToCartText = document.getElementById("addToCartText") as HTMLSpanElement | null;
    const addToCartLoader = document.getElementById("addToCartLoader") as HTMLSpanElement | null;

    const buyNowBtn = document.getElementById("buyNowBtn") as HTMLButtonElement | null;
    const buyNowText = document.getElementById("buyNowText") as HTMLSpanElement | null;
    const buyNowLoader = document.getElementById("buyNowLoader") as HTMLSpanElement | null;

    if (!form) return;

    form.addEventListener("submit", (e: Event) => {
        e.preventDefault();
    
        window.Qumra.forms.getFormData(e).then((res: any) => {
            const isBuyNow = res.submitterName === "buyNow";
    
            const loader = isBuyNow ? buyNowLoader : addToCartLoader;
            const text = isBuyNow ? buyNowText : addToCartText;
    
            if (text && loader) {
                text.style.display = "none";
                loader.style.display = "inline-block";
            }
            const actionPromise = isBuyNow
                ? window.Qumra.order.buyNow(res.product, res.quantity, res.properties)
                : window.Qumra.cart.addCartItem(res.product, res.quantity, res.properties);
    
            actionPromise
                .then((cartData: any) => {
                    if (text && loader) {
                        text.style.display = "flex";
                        loader.style.display = "none";
                    }
                    window.updateCart(cartData);
                    if (isBuyNow && cartData?.redirectUrl) {
                        window.location.href = cartData.redirectUrl;
                    }
                })
                .catch((err: any) => {
                    console.error("submitForm error", err);
    
                    if (text && loader) {
                        text.style.display = "flex";
                        loader.style.display = "none";
                    }
                });
        });
    });
    
});
window.xDataproduct = xDataproduct;
