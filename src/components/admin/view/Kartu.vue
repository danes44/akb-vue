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
          <v-btn color="#37A37B" @click="dialog = true"  dark class="mr-3 px-4 py-5 rounded-lg font-weight-bold" elevation="0" style="font-size: 14px">
            <v-icon class="mr-3 ">
              mdi-plus
            </v-icon>
            Tambah Kartu
          </v-btn>

        </v-card-title>

        <v-data-table :headers="headers" :items="kartus" :search="search" :loading="load" loading-text="Data sedang dimuat..." striped>
          <template v-slot:item.nama_pemilik="{ item }">
            {{ titleCase(item.nama_pemilik) }}
          </template>

          <template v-slot:item.tipe_kartu="{ item }">
            <v-chip v-if="item.tipe_kartu === 'credit'" color="#2196F3" outlined>Kredit</v-chip>
            <v-chip v-else color="#37A37B" outlined>Debit</v-chip>
          </template>

          <template v-slot:item.expired_date="{ item }">
            {{  moment(item.expired_date).format("MM/YY") }}
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
                    @click="deleteHandler(item)"
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
            <span class="headline font-weight-bold">{{ formTitle }} Data Kartu</span>
          </v-card-title>

          <v-card-text class="pt-7">
            <v-text-field
                outlined
                rounded
                class="rounded-lg"
                v-model="form.nama_pemilik"
                label="Nama Customer"
                required
                :error-messages="namaErrors"
                @input="$v.form.nama_pemilik.$touch()"
                @blur="$v.form.nama_pemilik.$touch()"
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
                    v-model="form.no_kartu"
                    label="No Kartu"
                    required
                    :error-messages="noKartuErrors"
                    @input="$v.form.no_kartu.$touch()"
                    @blur="$v.form.no_kartu.$touch()"
                >
                  <template v-slot:prepend-inner>
                    <v-icon class="mr-5">mdi-credit-card-outline</v-icon>
                  </template>
                </v-text-field>
              </v-col>

              <v-col class="pb-0">
                <v-select
                    outlined
                    rounded
                    class="rounded-lg"
                    v-model="form.tipe_kartu"
                    label="Tipe Kartu"
                    required
                    :items="tipeKartuList"
                    item-value="key"
                    item-text="name"
                    :error-messages="tipeErrors"
                    @input="$v.form.tipe_kartu.$touch()"
                    @blur="$v.form.tipe_kartu.$touch()"
                >
                  <template v-slot:prepend-inner>
                    <v-icon class="mr-5">mdi-credit-card-multiple-outline</v-icon>
                  </template>
                </v-select>
              </v-col>
            </v-row>
            <v-row>
              <v-col>
                <v-menu
                    v-model="menu2"
                    :close-on-content-click="false"
                    :nudge-right="40"
                    transition="scale-transition"
                    offset-y
                    min-width="auto"
                >
                  <template v-slot:activator="{ on, attrs }">
                    <v-text-field
                        outlined
                        rounded
                        hide-details
                        class="rounded-lg"
                        v-model="form.expired_date"
                        label="Expired Date"
                        prepend-inner-icon="mdi-calendar"
                        readonly
                        v-bind="attrs"
                        v-on="on"
                        clearable
                        :error-messages="dateErrors"
                        @input="$v.form.expired_date.$touch()"
                        @blur="$v.form.expired_date.$touch()"
                    >
                      <template v-slot:prepend-inner>
                        <v-icon class="mr-5">mdi-calendar</v-icon>
                      </template>
                    </v-text-field>
                  </template>
                  <v-date-picker
                      v-model="form.expired_date"
                      @input="menu2 = false"
                      type="month"
                      min="1950-01-01"
                  ></v-date-picker>
                </v-menu>
              </v-col>
            </v-row>

          </v-card-text>

          <v-card-actions class="pr-8 pt-9 pb-5">
            <v-spacer></v-spacer>
            <v-btn color="grey darken-1" text @click="cancel" class=" pa-6 font-weight-bold">
              Cancel
            </v-btn>
            <v-btn color="primary" elevation="0" @click="setForm" :loading="loadingData" class="ml-3 px-9 py-6 font-weight-bold">
              Save
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <!--      snackbar section-->
      <v-snackbar v-if="typeof error_message==='object'" multi-line v-model="snackbar" light timeout="4000" right top >
        <v-icon class="mr-3" :color="color">
          {{iconSnackbar}}
        </v-icon>
        <span class="font-weight-bold" style="font-size: 1rem">Error</span>
        <ul class="pt-3">
          <li v-for="item in error_message" :key="item">
            {{ item.toString() }}
          </li>
        </ul>
      </v-snackbar>

      <v-snackbar v-else multi-line v-model="snackbar" light timeout="4000" right top >
        <v-icon class="mr-3" :color="color">
          {{iconSnackbar}}
        </v-icon>
        <span class="font-weight-bold">{{error_message}}</span>
      </v-snackbar>

      <v-dialog v-model="dialogConfirm" persistent max-width="400px">
        <v-card>
          <v-card-title class="pt-6">
            <v-icon color="red" class="h3 mr-4" size="30">mdi-alert-circle</v-icon>
            <span class="h3 font-weight-bold red--text">Warning!</span>
          </v-card-title>
          <v-card-text>
            Anda yakin ingin menghapus customer bernama <b>{{ form.nama_pemilik }}</b> ini?
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="grey darken-1" class="mb-3 pa-6 font-weight-bold"  text @click="close">
              Cancel
            </v-btn>
            <v-btn color="red" class="mx-3 mb-3 px-9 py-6 font-weight-bold" :loading="loadingData" elevation="0" dark @click="deleteData" >
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
  maxLength,
  minLength,
  numeric,
  required,
  // requiredIf,
  // sameAs
} from "vuelidate/lib/validators";

import moment from "moment"; //library buat ganti format waktu/tanggal

export default {
  name: "Customer",
  validations: {
    form: {
      no_kartu:{ required,numeric,minLength: minLength(13), maxLength: maxLength(16)  },
      nama_pemilik: { required,  },
      expired_date: { required,  },
      tipe_kartu: { required,  },
    }
  },

  data() {
    return {
      menu: false,
      modal: false,
      menu2: false,
      loadingData: false,
      inputType: 'Tambah',
      load: false,
      snackbar: false,
      error_message: '',
      color: '',
      iconSnackbar: '',
      search: null,
      dialog: false,
      dialogConfirm: false,
      headers: [
        { text: "ID", value: "id_kartu", width:70 },
        { text: "Nama Pemilik",
          align: "start",
          value: "nama_pemilik" },
        { text: "No. Kartu", value: "no_kartu",filterable: false},
        { text: "Tipe Kartu", value: "tipe_kartu",filterable: false},
        { text: "Expired Date (MM/YY)", value: "expired_date",filterable: false, sortable: false},
        { value: 'actions', sortable: false },
      ],
      kartu: new FormData,
      kartus: [],
      roles:[],
      form: {
        no_kartu:'',
        nama_pemilik: '',
        expired_date: '',
        tipe_kartu: '',
      },
      editId: '',
      editedItem: {
        no_kartu:'',
        nama_pemilik: '',
        expired_date: '',
        tipe_kartu: '',
      },
      tipeKartuList:[
        { name:'Kredit', key:'credit'},
        { name:'Debit', key:'debit'},
      ]
    };
  },
  computed: {
    formTitle() {
      return this.inputType
    },
    // validations
    namaErrors () {
      const errors = []
      if (!this.$v.form.nama_pemilik.$dirty) return errors
      !this.$v.form.nama_pemilik.required && errors.push('Nama harus diisi.')
      return errors
    },
    dateErrors () {
      const errors = []
      if (!this.$v.form.expired_date.$dirty) return errors
      !this.$v.form.expired_date.required && errors.push('Tanggal kadaluarsa harus diisi.')
      return errors
    },
    tipeErrors () {
      const errors = []
      if (!this.$v.form.tipe_kartu.$dirty) return errors
      !this.$v.form.tipe_kartu.required && errors.push('Tipe kartu harus diisi.')
      return errors
    },
    noKartuErrors () {
      const errors = []
      if (!this.$v.form.no_kartu.$dirty) return errors
      !this.$v.form.no_kartu.maxLength && errors.push('Nomor telepon tidak boleh lebih 16 digit')
      !this.$v.form.no_kartu.minLength && errors.push('Nomor telepon tidak boleh kurang dari 13 digit.')
      !this.$v.form.no_kartu.numeric && errors.push('Nomor telepon tidak valid.')
      !this.$v.form.no_kartu.required && errors.push('Tipe kartu harus diisi.')
      return errors
    },
  },

  methods: {
    moment,
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
      var url = this.$api + '/kartu'
      this.$http.get(url, {
        headers: {
          'Authorization': 'Bearer ' + localStorage.getItem('token')
        }
      }).then(response => {
        this.load = false
        this.kartus = response.data.data
      })
    },

    //simpan data customer
    save() {
      this.loadingData = true
      this.kartu.append('no_kartu', this.form.no_kartu);
      this.kartu.append('nama_pemilik', this.form.nama_pemilik);
      this.kartu.append('tipe_kartu', this.form.tipe_kartu);
      this.kartu.append('expired_date', this.form.expired_date);

      var url = this.$api + '/kartu/'
      this.$http.post(url, this.kartu, {
        headers: {
          'Authorization': 'Bearer ' + localStorage.getItem('token')
        }
      }).then(response => {
        this.error_message=response.data.message;
        this.color="green"
        this.iconSnackbar ='mdi-check-circle'
        this.snackbar=true;
        this.loadingData = false;
        this.close();
        this.readData(); //mengambil data
        this.resetForm();
      }).catch(error => {
        console.log(Object.values(error.response.data.message))
        this.error_message=error.response.data.message;
        this.iconSnackbar ='mdi-alert-circle'
        this.color="red"
        this.snackbar=true;
        this.loadingData = false;
      })
    },

    //ubah data customer
    update() {
      this.loadingData = true
      console.log('LOOK AT THIS'+this.form.expired_date)

      let newData = {
        no_kartu:this.form.no_kartu,
        nama_pemilik:this.form.nama_pemilik,
        expired_date: this.form.expired_date,
        tipe_kartu: this.form.tipe_kartu,
      }
      console.log('LOOK AT THIS'+newData.expired_date)
      var url = this.$api + '/kartu/' + this.editId;


      this.$http.put(url, newData, {
        headers: {
          'Authorization': 'Bearer ' + localStorage.getItem('token')
        }
      }).then(response => {
        this.error_message=response.data.message;
        this.color="green"
        this.snackbar=true;
        this.iconSnackbar ='mdi-check-circle'
        this.loadingData = false;
        this.close();
        this.readData(); //mengambil data
        this.resetForm();
        this.inputType = 'Tambah';

      }).catch(error => {
        this.error_message=error.response.data.message;
        this.color="red"
        this.iconSnackbar ='mdi-alert-circle'
        this.snackbar=true;
        this.loadingData = false;
      })
    },

    //hapus data produk
    deleteData() {
      this.loadingData = true
      //mengahapus data
      var url = this.$api + '/kartu/' + this.deleteId;

      //data dihapus berdasarkan id
      this.$http.delete(url, {
        headers: {
          'Authorization': 'Bearer ' + localStorage.getItem('token')
        }
      }).then(response => {
        this.error_message=response.data.message;
        this.color="green"
        this.snackbar=true;
        this.iconSnackbar ='mdi-check-circle'
        this.loadingData = false;
        this.close();
        this.readData(); //mengambil data
        this.resetForm();
        this.dialogConfirm = false;
        this.inputType = 'Tambah';
      }).catch(error => {
        this.error_message=error.response.data.message;
        this.color="red"
        this.iconSnackbar ='mdi-alert-circle'
        this.form.nama_pemilik= null //reset form.nama_pemilik
        this.snackbar=true;
        this.loadingData = false;
      })
    },

    editHandler(item){
      this.inputType = 'Ubah';
      this.editId = item.id_kartu;
      this.form.no_kartu = item.no_kartu
      this.form.nama_pemilik = item.nama_pemilik
      this.form.expired_date = item.expired_date
      this.form.tipe_kartu = item.tipe_kartu
      this.dialog = true;
    },

    deleteHandler(item){
      this.deleteId = item.id_kartu;
      this.form.nama_pemilik= item.nama_pemilik
      this.dialogConfirm = true;
    },

    close() {
      this.$v.$reset()
      this.dialogConfirm = false
      this.dialog = false
      this.inputType = 'Tambah';
      this.form.nama_pemilik= null //reset form.nama_pemilik
    },

    cancel() {
      this.$v.$reset()
      this.resetForm();
      this.readData();
      this.dialog = false;
      this.inputType = 'Tambah';
      this.form.nama_pemilik= null //reset form.nama_pemilik
    },

    resetForm() {
      this.$v.$reset()
      this.form = {
        no_kartu:'',
        nama_pemilik: '',
        expired_date: '',
        tipe_kartu: '',
      };
    },
  },

  mounted() {
    this.load = true
    this.readData()
  },
}
</script>

<style scoped>

</style>