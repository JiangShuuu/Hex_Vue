// const url = "https://vue3-course-api.hexschool.io/";
// const path = "JohnText";

const app = {
  name: "products",
  data() {
    return {
      apiUrl: "https://vue3-course-api.hexschool.io",
      apiPath: "johntext",
      products: [],
    };
  },
  created() {
    const token = document.cookie.replace(
      /(?:(?:^|.*;\s*)hexToken\s*\=\s*([^;]*).*$)|^.*$/,
      "$1"
    );
    axios.defaults.headers.common.Authorization = token;
    this.checkAdmin();
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
          window.location = "index.html";
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
    removeItem(id) {
      // console.log(id);
      const url = `${this.apiUrl}/api/${this.apiPath}/admin/product/${id}`;
      axios
        .delete(url)
        .then((res) => {
          alert(res.data.message);
          this.products = this.products.filter((item) => item.id !== id);
        })
        .catch((err) => {
          alert(err.data.message);
        });
    },
  },
};

Vue.createApp(app).mount("#app");
