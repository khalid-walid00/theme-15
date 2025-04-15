document.addEventListener("DOMContentLoaded", () => {
	(document?.getElementById('spinner-container') as any).style.display = 'none';
});
interface GlobalStateInterface {
	modal: {
		open: boolean;
		type: string;
	};
	[key: string]: any;
	init: () => void;
}

function GlobalState(): GlobalStateInterface {
	return {
		...window.__qumra__,
		loading: {
			page: false,
			reedemCode: false,
			cart: false,
			checkout: false,
			coupon: false,
			addToCart: false,
			buyNow: false,
		},
		currency: window.__qumra__.data.app.currency.currencySymbol,
		modal: {
			open: false,
			type: "",
		},
		modals:[{}],
		setSearch(q: string) {
			this.loading.page = true;
			console.log("setSearch", q);
			Qumra.products.setSearch(q).then((res: any) => (
				this.loading.page = false,
				this.context.products = res.data.products
			)).catch((err: any) => (
				console.error("setSearch error", err)
			)),
				this.context.search = q;
		},

		toggleModal(type: string, open?: boolean) {
			this.modal = {
				open: open !== undefined ? open : !this.modal.open,
				type: type,
			}
		},
		updateContext(data: any) {
			console.log("updateContext", data);
			this.context = {
				...this.context,
				...data
			}
		},
		updateCart(data: any) {
			console.log("updateCart", data);
			this.cart = data
		},
		updateLoading(type: string, value: boolean) {
			this.loading[type] = value;
		},
		init() {
			window.updateCart = this.updateCart.bind(this);
			window.updateLoading = this.updateLoading.bind(this);
			window.setSearch = this.setSearch.bind(this);
			window.updateContext = this.updateContext.bind(this);
			window.toggleModal = this.toggleModal.bind(this);
		},
	};
}
document.addEventListener("DOMContentLoaded", () => {
	if (Qumra && Qumra.events) {
		window.Qumra.events.on('addToCart' as any, (data: any) => window.updateCart(data));

	} else {
		console.error("Qumra is not defined or events are not available.");
	}
})
window.addEventListener("pageshow", function (event) {
	if (event.persisted) {
	  window.updateCart(JSON.parse(localStorage.getItem('cart') || '{}'));
	}
  });
window.GlobalState = GlobalState;
