<template>
  <div id="app">
    <v-container fluid>

      <v-card class="elevation-0 rounded-lg">
        <v-card-title class="mt-3 text-center">
          <v-text-field
              v-model="search"
              append-icon="mdi-magnify"
              label="Search"
              filled
              rounded
              single-line
              dense
              style="max-width: 400px!important;"
              class="mt-6 ml-3 mr-8 mr-md-16 mr-xl-16 rounded-lg"
          ></v-text-field>
          <v-spacer></v-spacer>
          <v-btn color="#37A37B" @click="dialog = true" dark class="mr-3 px-4 py-5 rounded-lg" elevation="0" style="font-size: 14px">
            <v-icon class="mr-3 ">
              mdi-plus
            </v-icon>
            Tambah Customer
          </v-btn>

        </v-card-title>

        <v-data-table :headers="headers" :items="customers" :search="search" :loading="loadingData" loading-text="Data sedang dimuat..." striped>
          <template v-slot:item.nama_pegawai="{ item }">
            {{ titleCase(item.nama_customer) }}
          </template>

          <template v-slot:item.no_telp="{ item }">
            <span v-if="item.no_telp === null">
              -
            </span>
            <span v-else>
              {{ item.no_telp }}
            </span>
          </template>

          <template v-slot:item.email_customer="{ item }">
            <span v-if="item.email_customer === null">
              -
            </span>
            <span v-else>
              {{ item.email_customer }}
            </span>
          </template>

          <template v-slot:[`item.actions`]="{ item }">
            <v-tooltip bottom>
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                    class="mr-2"
                    rounded
                    color="#2196F3"
                    x-small
                    icon
                    v-bind="attrs"
                    v-on="on"
                    @click="editHandler(item)"
                >
                  <v-icon>
                    mdi-pencil
                  </v-icon>
                </v-btn>
              </template>
              <span>Edit Data</span>
            </v-tooltip>

            <v-tooltip bottom>
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                    rounded
                    color="red"
                    x-small
                    icon
                    v-bind="attrs"
                    v-on="on"
                    @click="deleteHandler(item.id_customer)"
                >
                  <v-icon>
                    mdi-trash-can
                  </v-icon>
                </v-btn>
              </template>
              <span>Delete Data</span>
            </v-tooltip>

          </template>

        </v-data-table>
      </v-card>

      <v-dialog v-model="dialog" persistent max-width="600px">
        <v-card class="px-5 py-5">
          <v-card-title>
            <span class="headline font-weight-bold">{{ formTitle }} Data Customer</span>
          </v-card-title>

          <v-card-text class="pt-7">
            <v-text-field
                outlined
                rounded
                class="rounded-lg"
                v-model="form.nama_customer"
                label="Nama Customer"
                required
                :error-messages="namaErrors"
                @input="$v.form.nama_customer.$touch()"
                @blur="$v.form.nama_customer.$touch()"
            >
              <template v-slot:prepend-inner>
                <v-icon class="mr-5" >mdi-account-outline</v-icon>
              </template>
            </v-text-field>

            <v-row class="pt-0">
              <v-col class="pb-0">
                <v-text-field
                    outlined
                    rounded
                    class="rounded-lg"
                    v-model="form.no_telp"
                    label="No Telpon"
                    required
                    :error-messages="noTelpErrors"
                    @input="$v.form.no_telp.$touch()"
                    @blur="$v.form.no_telp.$touch()"
                >
                  <template v-slot:prepend-inner>
                    <v-icon class="mr-5">mdi-phone-outline</v-icon>
                  </template>
                </v-text-field>
              </v-col>

              <v-col class="pb-0">
                <v-text-field
                    outlined
                    rounded
                    class="rounded-lg"
                    v-model="form.email_customer"
                    label="Email"
                    required
                    :error-messages="emailErrors"
                    @input="$v.form.email_customer.$touch()"
                    @blur="$v.form.email_customer.$touch()"
                >
                  <template v-slot:prepend-inner>
                    <v-icon class="mr-5">mdi-email-outline</v-icon>
                  </template>
                </v-text-field>
              </v-col>
            </v-row>

          </v-card-text>

          <v-card-actions class="pr-8 pt-9 pb-5">
            <v-spacer></v-spacer>
            <v-btn color="primary" elevation="0" @click="setForm" class="px-9 py-6">
              Save
            </v-btn>
            <v-btn color="red" text @click="cancel" class="ml-3 pa-6">
              Cancel
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <v-snackbar v-model="snackbar" :color="color" timeout="4000" bottom>
        {{error_message}}
      </v-snackbar>

      <v-dialog v-model="dialogConfirm" persistent max-width="400px">
        <v-card>
          <v-card-title>
            <span class="headline">warning!</span>
          </v-card-title>
          <v-card-text>
            Anda yakin ingin menghapus produk ini?
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue darken-1" text @click="dialogConfirm = false">
              Cancel
            </v-btn>
            <v-btn color="blue darken-1" text @click="deleteData">
              Delete
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-container>
  </div>
</template>

<script>
import {
  email,
  maxLength,
  minLength,
  numeric,
  required,
  // requiredIf,
  // sameAs
} from "vuelidate/lib/validators";

export default {
  name: "Customer",
  validations: {
    form: {
      nama_customer: { required,  },
      email_customer: { email, },
      no_telp: { numeric, minLength: minLength(10), maxLength: maxLength(15) },
    }
  },

  data() {
    return {
      currentEmail:localStorage.getItem('email'),
      menu: false,
      modal: false,
      menu2: false,
      loadingData: 'false',
      inputType: 'Tambah',
      load: false,
      snackbar: false,
      error_message: '',
      color: '',
      search: null,
      dialog: false,
      dialogConfirm: false,
      headers: [
        { text: "ID", value: "id_customer", width:70 },
        { text: "Nama",
          align: "start",
          value: "nama_customer" },
        { text: "No. Telpon", value: "no_telp"},
        { text: "Email", value: "email_customer"},
        { value: 'actions', sortable: false },
      ],
      customer: new FormData,
      customers: [],
      roles:[],
      form: {
        nama_customer: null,
        no_telp: '',
        email_customer: '',
      },
      editId: '',
      editedItem: {
        nama_customer: null,
        no_telp: '',
        email_customer: '',
      },
    };
  },
  computed: {
    formTitle() {
      return this.inputType
    },
    // validations
    namaErrors () {
      const errors = []
      if (!this.$v.form.nama_customer.$dirty) return errors
      !this.$v.form.nama_customer.required && errors.push('Nama harus diisi.')
      return errors
    },
    emailErrors () {
      const errors = []
      if (!this.$v.form.email_customer.$dirty) return errors
      !this.$v.form.email_customer.email && errors.push('Email tidak valid.')
      return errors
    },
    noTelpErrors () {
      const errors = []
      if (!this.$v.form.no_telp.$dirty) return errors
      !this.$v.form.no_telp.maxLength && errors.push('Nomor telepon tidak boleh lebih 15 digit')
      !this.$v.form.no_telp.minLength && errors.push('Nomor telepon tidak boleh kurang dari 10 digit.')
      !this.$v.form.no_telp.numeric && errors.push('Nomor telepon tidak valid.')
      return errors
    },
  },

  methods: {
    // function buat uppercase each word
    titleCase(str) {
      var splitStr = str.toLowerCase().split(' ');
      for (var i = 0; i < splitStr.length; i++) {
        // You do not need to check if i is larger than splitStr length, as your for does that for you
        // Assign it back to the array
        splitStr[i] = splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);
      }
      // Directly return the joined string
      return splitStr.join(' ');
    },

    // submit form
    setForm() {
      this.$v.$touch()
      console.log(this.$v)
      if(!this.$v.$error) {
        console.log('2')
        if (this.inputType === 'Tambah')
          this.save()
        else
          this.update()
      }
    },

    //read data customer
    readData() {
      var url = this.$api + '/customer'
      this.$http.get(url, {
        headers: {
          'Authorization': 'Bearer ' + localStorage.getItem('token')
        }
      }).then(response => {
        this.loadingData = false
        this.customers = response.data.data
      })
    },

    //simpan data customer
    save() {
      this.customer.append('nama_customer', this.form.nama_customer);
      this.customer.append('no_telp', this.form.no_telp);
      this.customer.append('email_customer', this.form.email_customer);

      var url = this.$api + '/customer/'
      this.load = true
      this.$http.post(url, this.customer, {
        headers: {
          'Authorization': 'Bearer ' + localStorage.getItem('token')
        }
      }).then(response => {
        this.error_message=response.data.message;
        this.color="green"
        this.snackbar=true;
        this.load = false;
        this.close();
        this.readData(); //mengambil data
        this.resetForm();
      }).catch(error => {
        console.log(Object.values(error.response.data.message))
        this.error_message=Object.values(error.response.data.message).toString();
        this.color="red"
        this.snackbar=true;
        this.load = false;
      })
    },

    //ubah data customer
    update() {
      let newData = {
        nama_customer: this.form.nama_customer,
        email_customer: this.form.email_customer,
        no_telp: this.form.no_telp,
      }
      var url = this.$api + '/customer/' + this.editId;

      this.load = true

      this.$http.put(url, newData, {
        headers: {
          'Authorization': 'Bearer ' + localStorage.getItem('token')
        }
      }).then(response => {
        this.error_message=response.data.message;
        this.color="green"
        this.snackbar=true;
        this.load = false;
        this.close();
        this.readData(); //mengambil data
        this.resetForm();
        this.inputType = 'Tambah';

      }).catch(error => {
        this.error_message=Object.values(error.response.data.message);
        this.color="red"
        this.snackbar=true;
        this.load = false;
      })
    },

    //hapus data produk
    deleteData() {
      //mengahapus data
      var url = this.$api + '/customer/' + this.deleteId;

      //data dihapus berdasarkan id
      this.$http.delete(url, {
        headers: {
          'Authorization': 'Bearer ' + localStorage.getItem('token')
        }
      }).then(response => {
        this.error_message=response.data.message;
        this.color="green"
        this.snackbar=true;
        this.load = false;
        this.close();
        this.readData(); //mengambil data
        this.resetForm();
        this.dialogConfirm = false;
        this.inputType = 'Tambah';
      }).catch(error => {
        this.error_message=error.response.data.message;
        this.color="red"
        this.snackbar=true;
        this.load = false;
      })
    },

    editHandler(item){
      this.inputType = 'Ubah';
      this.editId = item.id_customer;
      this.form.nama_customer= item.nama_customer
      this.form.no_telp= item.no_telp
      this.form.email_customer= item.email_customer
      this.dialog = true;
    },

    deleteHandler(id){
      this.deleteId = id;
      this.dialogConfirm = true;
    },

    close() {
      this.dialog = false
      this.inputType = 'Tambah';
    },

    cancel() {
      this.$v.$reset()
      this.resetForm();
      this.readData();
      this.dialog = false;
      this.inputType = 'Tambah';
    },

    resetForm() {
      this.form = {
        nama_customer: null,
        no_telp: '',
        email_customer: '',
      };
    },
  },

  mounted() {
    this.loadingData = true
    this.readData()
  },
}
</script>

<style scoped>

</style>