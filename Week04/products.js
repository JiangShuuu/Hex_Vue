import pagination from "./pagination.js";

let productModal = null;
let delProductModal = null;

const apiUrl = "https://vue3-course-api.hexschool.io/v2";
const apiPath = "johntext";
let isNew = false;

const app = Vue.createApp({
  name: "products",
  components: {
    pagination,
  },
  data() {
    return {
      products: [],
      temProduct: {
        imagesUrl: [],
      },
      pagination: {},
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
      const url = `${apiUrl}/api/user/check`;
      axios
        .post(url)
        .then(() => {
          this.getProduct();
        })
        .catch((err) => {
          alert(err.data.message);
          window.location = index.html;
        });
    },
    getProduct(page = 1) {
      // 參數預設值
      const url = `${apiUrl}/api/${apiPath}/admin/products/?page=${page}`;
      axios
        .get(url)
        .then((res) => {
          const { products, pagination } = res.data;
          this.products = products;
          this.pagination = pagination;
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
        isNew = true;
        productModal.show();
      } else if (state === "edit") {
        if (item.imagesUrl.length === 0) {
          this.temProduct = { ...item, imagesUrl: [] };
        } else {
          this.temProduct = { ...item };
        }
        isNew = false;
        productModal.show();
      } else if (state === "delete") {
        this.temProduct = { ...item };
        delProductModal.show();
      }
    },
    deleteProduct(id) {
      let api = `${apiUrl}/api/${apiPath}/admin/product/${id}`;
      axios
        .delete(api, { data: this.temProduct })
        .then((res) => {
          alert(res.data.message);
          delProductModal.hide();
          this.getProduct();
        })
        .catch((err) => {
          alert(err.data.message);
        });
    },
  },
});

app.component("productModal", {
  props: ["temProduct"],
  template: "#templateForProductModal",
  methods: {
    updateProduct(id) {
      let api = `${apiUrl}/api/${apiPath}/admin/product`;
      let httpMethod = "post";

      if (!isNew) {
        api = `${apiUrl}/api/${apiPath}/admin/product/${id}`;
        httpMethod = "put";
      }

      axios[httpMethod](api, { data: this.temProduct })
        .then((res) => {
          alert(res.data.message);
          productModal.hide();
          this.$emit("get-product");
        })
        .catch((err) => {
          alert(err.data.message);
        });
    },
    deleteImage(index) {
      this.temProduct.imagesUrl.splice(index, 1);
    },
    addImage() {
      let newImg = this.temProduct.imageUrl.match(/https:\/\/.+/);
      console.log(newImg);
      console.log(this.temProduct.imageUrl);
      console.log(this.temProduct.imagesUrl);
      if (newImg === null) {
        alert("請輸入圖片網址!");
        this.temProduct.imageUrl = "";
        return;
      }
      this.temProduct.imagesUrl.push(this.temProduct.imageUrl);
      this.temProduct.imageUrl = "";
      alert("已新增圖片，請按確認完成存檔!");
    },
  },
});

app.mount("#app");
