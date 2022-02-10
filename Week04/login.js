const url = "https://vue3-course-api.hexschool.io/";

const app = {
  data() {
    return {
      email: "",
      password: "",
    };
  },
  methods: {
    handleSubmit() {
      const user = { username: this.email, password: this.password };
      axios
        .post(`${url}v2/admin/signin`, user)
        .then((res) => {
          const { token, expired } = res.data;
          document.cookie = `hexToken=${token};expires=${new Date(
            expired
          )}; path=/`;
          window.location = "products.html";
          console.log("success", res.data);
        })
        .catch((error) => {
          console.log("error", error);
          alert("登入失敗，請重新輸入!");
        });
    },
  },
};

Vue.createApp(app).mount("#app");
