const apiUrl = "https://vue3-course-api.hexschool.io/v2";
const apiPath = "johntext";

const app = Vue.createApp({
  name: "cart",
  data() {
    return {
      cartData: {},
      products: [],
      productId: "",
      isLoadingItem: "",
    };
  },
  mounted() {
    this.getProducts();
    this.getCart();
  },
  methods: {
    getProducts() {
      axios.get(`${apiUrl}/api/${apiPath}/products/all`).then((res) => {
        console.log(res);
        this.products = res.data.products;
      });
    },
    openProductModal(id) {
      this.productId = id;
      this.$refs.productModal.openModal();
    },
    getCart() {
      axios.get(`${apiUrl}/api/${apiPath}/cart`).then((res) => {
        console.log(res);
        this.cartData = res.data.data;
      });
    },
    addToCart(id, qty = 1) {
      const data = {
        product_id: id,
        qty,
      };
      this.isLoadingItem = id;
      this.$refs.productModal.closeModal();
      axios.post(`${apiUrl}/api/${apiPath}/cart`, { data }).then((res) => {
        console.log(res);
        this.getCart();
        this.isLoadingItem = "";
      });
    },
    removeCartItem(id) {
      this.isLoadingItem = id;
      axios.delete(`${apiUrl}/api/${apiPath}/cart/${id}`).then((res) => {
        console.log(res);
        this.getCart();
        this.isLoadingItem = "";
      });
    },
    updateCartItem(item) {
      const data = {
        product_id: item.id,
        qty: item.qty,
      };
      this.isLoadingItem = item.id;
      axios
        .put(`${apiUrl}/api/${apiPath}/cart/${item.id}`, { data })
        .then((res) => {
          console.log(res);
          this.getCart();
          this.isLoadingItem = "";
        });
    },
  },
});

// $refs
app.component("product-modal", {
  template: "#userProductModal",
  props: ["id"],
  data() {
    return {
      modal: {},
      product: {},
      qty: 1,
    };
  },
  watch: {
    id() {
      this.getProduct();
    },
  },
  methods: {
    openModal() {
      this.modal.show();
    },
    closeModal() {
      this.modal.hide();
    },
    getProduct() {
      axios.get(`${apiUrl}/api/${apiPath}/product/${this.id}`).then((res) => {
        console.log(res);
        this.product = res.data.product;
      });
    },
    addToCart() {
      this.$emit("add-cart", this.product.id, this.qty);
    },
  },
  mounted() {
    // 223行 ref="modal"
    this.modal = new bootstrap.Modal(this.$refs.modal);
  },
});

app.mount("#app");
