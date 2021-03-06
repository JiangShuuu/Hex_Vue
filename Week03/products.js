let productModal = null;
let delProductModal = null;

const app = {
  name: "products",
  data() {
    return {
      apiUrl: "https://vue3-course-api.hexschool.io/v2",
      apiPath: "johntext",
      products: [],
      temProduct: {
        imageUrl: "",
      },
      isNew: false,
    };
  },
  mounted() {
    this.checkAdmin();
  },
  methods: {
    checkAdmin() {
      const token = document.cookie.replace(
        /(?:(?:^|.*;\s*)hexToken\s*\=\s*([^;]*).*$)|^.*$/,
        "$1"
      );
      axios.defaults.headers.common["Authorization"] = token;
      productModal = new bootstrap.Modal(
        document.getElementById("productModal"),
        {
          keyboard: false,
        }
      );
      delProductModal = new bootstrap.Modal(
        document.getElementById("delProductModal"),
        {
          keyboard: false,
        }
      );
      const url = `${this.apiUrl}/api/user/check`;
      axios
        .post(url)
        .then(() => {
          this.getData();
        })
        .catch((err) => {
          alert(err.data.message);
          window.location = index.html;
        });
    },
    getData() {
      const url = `${this.apiUrl}/api/${this.apiPath}/admin/products`;
      axios
        .get(url)
        .then((res) => {
          this.products = res.data.products;
        })
        .catch((err) => {
          alert(err.data.message);
        });
    },
    openModal(state, item) {
      if (state === "new") {
        this.temProduct = {
          imagesUrl: [],
        };
        this.isNew = true;
        productModal.show();
      } else if (state === "edit") {
        this.temProduct = { ...item };
        this.isNew = false;
        productModal.show();
      } else if (state === "delete") {
        this.temProduct = { ...item };
        delProductModal.show();
      }
    },
    updateProduct(id) {
      let api = `${this.apiUrl}/api/${this.apiPath}/admin/product`;
      let httpMethod = "post";

      if (!this.isNew) {
        api = `${this.apiUrl}/api/${this.apiPath}/admin/product/${id}`;
        httpMethod = "put";
      }

      axios[httpMethod](api, { data: this.temProduct })
        .then((res) => {
          alert(res.data.message);
          productModal.hide();
          this.getData();
        })
        .catch((err) => {
          alert(err.data.message);
        });
    },
    deleteProduct(id) {
      let api = `${this.apiUrl}/api/${this.apiPath}/admin/product/${id}`;
      axios
        .delete(api, { data: this.temProduct })
        .then((res) => {
          alert(res.data.message);
          delProductModal.hide();
          this.getData();
        })
        .catch((err) => {
          alert(err.data.message);
        });
    },
    deleteImage(index) {
      this.temProduct.imagesUrl.splice(index, 1);
    },
    addImage() {
      axios
        .get(this.temProduct.imageUrl)
        .then((res) => {
          console.log(res);
          console.log("hi");
          this.temProduct.imagesUrl.push(this.temProduct.imageUrl);
          this.temProduct.imageUrl = "";
          alert("??????????????????????????????????????????!");
        })
        .catch((err) => {
          console.log(err);
          alert("??????????????????????????????!");
          this.temProduct.imageUrl = "";
        });
    },
  },
};

Vue.createApp(app).mount("#app");
