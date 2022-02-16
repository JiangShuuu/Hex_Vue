const { defineRule, Form, Field, ErrorMessage, configure } = VeeValidate;
const { required, email, min, max } = VeeValidateRules;
const { localize, loadLocaleFromURL } = VeeValidateI18n;

defineRule("required", required);
defineRule("email", email);
defineRule("min", min);
defineRule("max", max);

loadLocaleFromURL(
  "https://unpkg.com/@vee-validate/i18n@4.1.0/dist/locale/zh_TW.json"
);

configure({
  // 用來做一些設定
  generateMessage: localize("zh_TW"), //啟用 locale
});

const apiUrl = "https://vue3-course-api.hexschool.io/v2";
const apiPath = "johntext";

const app = Vue.createApp({
  name: "cart",
  components: {
    VForm: Form,
    VField: Field,
    ErrorMessage: ErrorMessage,
  },
  data() {
    return {
      cartData: {
        carts: [],
      },
      products: [],
      productId: "",
      isLoadingItem: "",
      form: {
        user: {
          name: "",
          email: "",
          tel: "",
          address: "",
        },
        message: "",
      },
    };
  },
  mounted() {
    this.getProducts();
    this.getCart();
  },
  methods: {
    getProducts() {
      axios.get(`${apiUrl}/api/${apiPath}/products/all`).then((res) => {
        this.products = res.data.products;
      });
    },
    openProductModal(id) {
      this.productId = id;
      this.$refs.productModal.openModal();
    },
    getCart() {
      axios.get(`${apiUrl}/api/${apiPath}/cart`).then((res) => {
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
      axios.post(`${apiUrl}/api/${apiPath}/cart`, { data }).then(() => {
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
    createOrder() {
      const order = this.form;
      axios
        .post(`${apiUrl}/api/${apiPath}/order`, { data: order })
        .then((res) => {
          alert(res.data.message);
          this.$refs.form.resetForm(); // 欄位清空
          this.getCart();
        });
    },
    cleanCart() {
      axios.delete(`${apiUrl}/api/${apiPath}/carts`).then((res) => {
        alert(res.data.message);
        this.getCart();
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
