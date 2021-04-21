<template>
  <div id="app">
    <b-container class="p-4">
      <div id="sign-in" >
        <b-card
            class="border-0 shadow-lg p-0 rounded p-0 no-gutters"
            alt="illustration-signin"
        >
          <b-row no-gutters align-v="center">
            <b-col md="7">
              <b-card-img
              :src="require('../../assets/illustration2.svg')"
              width="100%"
              class="rounded-0">
              </b-card-img>
            </b-col>
            <b-col md="5">
              <b-row
                  class="justify-content-md-center justify-content-sm-center justify-content-xs-center"

                  align-v="center"
              >
                <h1 class="text-center"><b>SIGN IN</b></h1>
              </b-row>

                <!--          SIGN IN FORM     -->
              <b-form class="px-5 pt-5" ref="form" >
                <b-form-row class="mb-3">
                  <b-input-group>
                    <b-input-group-prepend is-text class="text">
                      <b-icon icon="envelope-fill"></b-icon>
                    </b-input-group-prepend>
                    <b-form-input
                        type="email"
                        v-model="email"
                        placeholder="Email"
                        v-on:keydown.enter="submit"
                    ></b-form-input>
                  </b-input-group>
                </b-form-row>

                <b-form-row class="mb-3">
                  <b-input-group>
                    <b-input-group-prepend is-text class="text">
                      <b-icon icon="lock-fill"></b-icon>
                    </b-input-group-prepend>
                    <b-form-input
                        type="password"
                        placeholder="Password"
                        v-model="password"
                        v-on:keydown.enter="submit"
                    ></b-form-input>
                  </b-input-group>
                </b-form-row>

                <b-form-row class="pt-5 pb-3">
                  <b-button
                      class="py-2 font-weight-bold border-0"
                      block
                      @click="submit"
                      style="background-color: #111111; color: white; border-radius: 0.5rem"
                  >Sign In</b-button
                  >
                </b-form-row>

              </b-form>
            </b-col>
          </b-row>
        </b-card>
      </div>
    </b-container>
  </div>
</template>

<script>
  export default {
    name: "Login",
    data() {
      return {
        loader: null,
        loading: false,
        load: false,
        error_message: "",
        valid: false,
        email: "",
        password: "",
      };
    },
    methods: {
      toast(state,variant,response) {
        this.$bvToast.toast(response, {
          title: `Sign In ${state}`,
          toaster: 'b-toaster-top-center',
          solid: true,
          appendToast: false,
          variant: variant
        })
      },
      submit() {
        this.$http
          .post(this.$api + "/login", {
            email: this.email,
            password: this.password,
          })
          .then((response) => {
            localStorage.setItem("id", response.data.user.id_pegawai) //menyimpan id user yang sedang login
            localStorage.setItem("token", response.data.access_token) //menyimpan auth token
            localStorage.setItem("role", response.data.userJoin.role_pegawai) //menyimpan nama role
            localStorage.setItem("email", response.data.user.email) //menyimpan email user
            localStorage.setItem("nama", response.data.userJoin.nama_pegawai) //menyimpan nama user
            this.toast('Success','success',Object.values(response.data.message))
            this.load = false

            //set timeout biar toast nya bisa keluar dulu baru ganti component
            setTimeout(() => this.$router.push({
              name: "dashboard",
            }), 1000);


          })
          .catch((error) => {
            this.error_message = Object.values(error.response.data.message); //fetch response error message
            console.log(Object.values(error.response.data.message))
            this.toast('Failed','danger',this.error_message);
            localStorage.removeItem("token");
            this.load = false;
          });

      },
    },
  };
</script>

<style scoped>
  :root {
    /*padding-top: 2.5%;*/
    overflow-y: hidden !important;
  }
  .bg-info {
    background-color: #f2f5f7 !important;
  }
  .rounded {
    border-radius: 1rem !important;
  }
  .card-body{
    padding: 0;
  }

  .rounded-0 {
    border-radius: 1rem 0 0 1rem !important;
  }

  .input-group-text {
    color: #111111;
    background-color: #F6F6F6!important;
    border-color: #F6F6F6!important;
    border-radius: .5rem 0 0 .5rem !important;
  }
  input {
    color: #111111;
    background-color: #F6F6F6!important;
    border: none !important;
  }
  .form-control {
    border: 1px solid #f6f6f6;
    border-radius: 0 .5rem .5rem 0 !important;
    background-color: #F6F6F6!important;
  }

  /*kelas .container -nya bootstrapvue sama vuetify tabrakan.. dibawah ini biar breakpoints nya sama seperti yang diharapkan*/
  @media (min-width: 576px) {
    .container, .container-sm, .container-md, .container-lg, .container-xl {
      max-width: 540px !important;
    }
  }
  @media (min-width: 768px) {
    .container, .container-sm, .container-md, .container-lg, .container-xl {
      max-width: 720px !important;
    }
  }
  @media (min-width: 992px) {
    .container, .container-sm, .container-md, .container-lg, .container-xl {
      max-width: 960px !important;
    }
  }
  @media (min-width: 1200px) {
    .container, .container-sm, .container-md, .container-lg, .container-xl {
      max-width: 1140px !important;
    }
  }







</style>