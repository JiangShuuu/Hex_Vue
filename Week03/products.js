let productModal = null;
let delProductModal = null;

const app = {
  name: "products",
  data() {
    return {
      apiUrl: "https://vue3-course-api.hexschool.io/v2",
      apiPath: "johntext",
      products: [],
      temProduct: {},
      isNew: false,
      addImg: "",
    };
  },
  mounted() {
    const token = document.cookie.replace(
      /(?:(?:^|.*;\s*)hexToken\s*\=\s*([^;]*).*$)|^.*$/,
      "$1"
    );
    axios.defaults.headers.common["Authorization"] = token;
    this.checkAdmin();
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
  },
  methods: {
    checkAdmin() {
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
      let newImg = this.addImg.match(/http:\/\/.+/);
      if (newImg === null) {
        alert("請輸入圖片網址!");
        this.addImg = "";
        return;
      }
      this.temProduct.imagesUrl.push(this.addImg);
      this.addImg = "";
      alert("已新增圖片，請按確認完成存檔!");
    },
  },
};

Vue.createApp(app).mount("#app");
