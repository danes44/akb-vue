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
          <v-btn color="#37A37B" @click="dialog = true" dark class="mr-3 px-4 py-5 rounded-lg font-weight-bold" elevation="0" style="font-size: 14px">
            <v-icon class="mr-3 ">
              mdi-plus
            </v-icon>
            Tambah Menu
          </v-btn>

        </v-card-title>

        <v-data-table :headers="headers" :items="reservasis" :search="search" :loading="loadingData" loading-text="Data sedang dimuat..." sort-by="id_reservasi">
          <template v-slot:item.nama_customer="{ item }">
            <span>{{ titleCase(item.nama_customer) }}</span>
          </template>

          <template v-slot:item.nama_pegawai="{ item }">
            <span>{{ titleCase(item.nama_pegawai) }}</span>
          </template>

          <template v-slot:item.sesi="{ item }">
            <span>{{ titleCase(item.sesi) }}</span>
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

      <div>
<!--            <v-dialog v-model="dialog" persistent max-width="600px">-->
<!--              <v-card class="px-5 py-5">-->
<!--                <v-card-title>-->
<!--                  <span class="headline font-weight-bold">{{ formTitle }} Data Menu</span>-->
<!--                </v-card-title>-->
<!--      -->
<!--                <v-card-text class="pt-7">-->
<!--                  <v-text-field-->
<!--                      outlined-->
<!--                      rounded-->
<!--                      class="rounded-lg"-->
<!--                      v-model="form.nama_menu"-->
<!--                      label="Nama Menu"-->
<!--                      required-->
<!--                      :error-messages="namaErrors"-->
<!--                      @input="$v.form.nama_menu.$touch()"-->
<!--                      @blur="$v.form.nama_menu.$touch()"-->
<!--                  >-->
<!--                    <template v-slot:prepend-inner>-->
<!--                      <v-icon class="mr-5" >mdi-room-service-outline</v-icon>-->
<!--                    </template>-->
<!--                  </v-text-field>-->
<!--      -->
<!--                  <v-row class="pt-0">-->
<!--                    <v-col class="pb-0">-->
<!--                      <v-select-->
<!--                          outlined-->
<!--                          rounded-->
<!--                          class="rounded-lg"-->
<!--                          v-model="form.id_bahan"-->
<!--                          label="Nama Bahan"-->
<!--                          required-->
<!--                          :items="bahans"-->
<!--                          item-value="id_bahan"-->
<!--                          item-text="nama_bahan"-->
<!--                          :error-messages="bahanErrors"-->
<!--                          @input="$v.form.id_bahan.$touch()"-->
<!--                          @blur="$v.form.id_bahan.$touch()"-->
<!--                      >-->
<!--                        <template v-slot:prepend-inner>-->
<!--                          <v-icon class="mr-5">mdi-food-steak</v-icon>-->
<!--                        </template>-->
<!--                      </v-select>-->
<!--                    </v-col>-->
<!--                    <v-col>-->
<!--                      <v-select-->
<!--                          outlined-->
<!--                          rounded-->
<!--                          class="rounded-lg"-->
<!--                          v-model="form.tipe_menu"-->
<!--                          label="Tipe Menu"-->
<!--                          required-->
<!--                          :items="tipeMenuList"-->
<!--                          item-value="key"-->
<!--                          item-text="name"-->
<!--                          :error-messages="tipeErrors"-->
<!--                          @input="$v.form.tipe_menu.$touch()"-->
<!--                          @blur="$v.form.tipe_menu.$touch()"-->
<!--                      >-->
<!--                        <template v-slot:prepend-inner>-->
<!--                          <v-icon class="mr-5">mdi-menu-open</v-icon>-->
<!--                        </template>-->
<!--                      </v-select>-->
<!--                    </v-col>-->
<!--                  </v-row>-->
<!--      -->
<!--      -->
<!--                  <v-textarea-->
<!--                      outlined-->
<!--                      rounded-->
<!--                      class="rounded-lg"-->
<!--                      v-model="form.deskripsi"-->
<!--                      label="Deskripsi"-->
<!--                      required-->
<!--                      :error-messages="deskripsiErrors"-->
<!--                      @input="$v.form.deskripsi.$touch()"-->
<!--                      @blur="$v.form.deskripsi.$touch()"-->
<!--                  >-->
<!--                    <template v-slot:prepend-inner>-->
<!--                      <v-icon class="mr-5">mdi-text-subject</v-icon>-->
<!--                    </template>-->
<!--                  </v-textarea>-->
<!--      -->
<!--                  <v-row class="pt-0">-->
<!--                    <v-col class="pb-0">-->
<!--                      <v-text-field-->
<!--                          outlined-->
<!--                          rounded-->
<!--                          class="rounded-lg"-->
<!--                          v-model="form.unit"-->
<!--                          label="Unit"-->
<!--                          required-->
<!--                          :error-messages="unitErrors"-->
<!--                          @input="$v.form.unit.$touch()"-->
<!--                          @blur="$v.form.unit.$touch()"-->
<!--                      >-->
<!--                        <template v-slot:prepend-inner>-->
<!--                          <v-icon class="mr-5">mdi-scale-balance</v-icon>-->
<!--                        </template>-->
<!--                      </v-text-field>-->
<!--                    </v-col>-->
<!--      -->
<!--                    <v-col class="pb-0">-->
<!--                      <v-text-field-->
<!--                          outlined-->
<!--                          rounded-->
<!--                          class="rounded-lg"-->
<!--                          v-model="form.harga"-->
<!--                          label="Harga"-->
<!--                          required-->
<!--                          type="number"-->
<!--                          :error-messages="hargaErrors"-->
<!--                          @input="$v.form.harga.$touch()"-->
<!--                          @blur="$v.form.harga.$touch()"-->
<!--                      >-->
<!--                        <template v-slot:prepend-inner>-->
<!--                          <v-icon class="mr-5">mdi-cash</v-icon>-->
<!--                        </template>-->
<!--                      </v-text-field>-->
<!--                    </v-col>-->
<!--                  </v-row>-->
<!--      -->
<!--                  <v-row class="pt-0 mt-0">-->
<!--                    <v-col>-->
<!--                      <v-file-input-->
<!--                          outlined-->
<!--                          rounded-->
<!--                          truncate-length="12"-->
<!--                          class="rounded-lg"-->
<!--                          v-model="form.str_gambar"-->
<!--                          label="Gambar"-->
<!--                          required-->
<!--                          prepend-icon=""-->
<!--                          accept="image/png, image/jpeg, image/bmp"-->
<!--                          :error-messages="gambarErrors"-->
<!--                          @input="$v.form.str_gambar.$touch()"-->
<!--                          @blur="$v.form.str_gambar.$touch()"-->
<!--                      >-->
<!--                        <template v-slot:prepend-inner>-->
<!--                          <v-icon class="mr-5">mdi-cash</v-icon>-->
<!--                        </template>-->
<!--                      </v-file-input>-->
<!--                    </v-col>-->
<!--                  </v-row>-->
<!--                </v-card-text>-->
<!--      -->
<!--                <v-card-actions class="pr-8 pt-9 pb-5">-->
<!--                  <v-spacer></v-spacer>-->
<!--                  <v-btn color="red" text @click="cancel" class="ml-3 pa-6 font-weight-bold">-->
<!--                    Cancel-->
<!--                  </v-btn>-->
<!--                  <v-btn color="primary" elevation="0" @click="setForm" class="px-9 py-6 font-weight-bold">-->
<!--                    Save-->
<!--                  </v-btn>-->
<!--                </v-card-actions>-->
<!--              </v-card>-->
<!--            </v-dialog>-->
      </div>

      <v-snackbar multi-line v-model="snackbar" light timeout="4000" right bottom >
        <v-icon class="mr-3" :color="color">
          {{iconSnackbar}}
        </v-icon>
        <span class="font-weight-bold">{{error_message}}</span>
        <template v-slot:action="{ attrs }">
          <v-btn
              color="grey"
              text
              icon
              v-bind="attrs"
              @click="snackbar = false"
          >
            <v-icon>mdi-close-circle-outline</v-icon>
          </v-btn>
        </template>
      </v-snackbar>

      <v-dialog v-model="dialogConfirm" persistent max-width="400px">
        <v-card>
          <v-card-title class="pt-6">
            <v-icon color="red" class="h3 mr-4" size="30">mdi-alert-circle</v-icon>
            <span class="h3 font-weight-bold red--text">Warning!</span>
          </v-card-title>
          <v-card-text>
            Anda yakin ingin menghapus <b>data reservasi</b> ini?
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="secondary" class="mb-3 pa-6 font-weight-bold"  text @click="close">
              Cancel
            </v-btn>
            <v-btn color="red" class="mx-3 mb-3 px-9 py-6 font-weight-bold" elevation="0" dark @click="deleteData" >
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
    // email, maxLength, minLength,
    // maxLength,
    // minLength,
    // numeric,
    required,
    // requiredIf,
    // sameAs
  } from "vuelidate/lib/validators";

  export default {
    name: "Menu",
    validations: {
      form: {
        id_pegawai: {required},
        id_customer: {required},
        no_meja: {required},
        tgl_reservasi: {required},
        sesi: {required},
      }
    },

    data() {
      return {
        // rulesInput: [
        //   value => !value || value.size < 5000000 || 'Harus dalam format .jpg, .png, atau .bmp dibawah 5 MB',
        // ],
        loadingData: 'false',
        inputType: 'Tambah',
        load: false,
        snackbar: false,
        error_message: '',
        color: '',
        iconSnackbar:'',
        search: null,
        dialog: false,
        dialogConfirm: false,
        headers: [
          { text: "ID", value: "id_reservasi", width:70 },
          { text: "Nama Customer",
            align: "start",
            value: "nama_customer",width: 150 },
          { text: "No. Meja", value: "no_meja", sortable: false,width: 70},
          { text: "Tgl Reservasi", value: "tgl_reservasi",width: 150},
          { text: "Tgl Pesan", value: "created_at",width: 150},
          { text: "Sesi", value:"sesi",width: 80 },
          { text: "Waiter", value: "nama_pegawai",width: 100, sortable: false,  },
          { value: 'actions', sortable: false, width:100 },
        ],
        reservasi: new FormData,
        reservasis: [],
        customers:[],
        mejas:[],
        pegawais:[],
        tipeMenuList: [
          { key: 'lunch', name: 'Lunch'},
          { key: 'dinner', name: 'Dinner'},
        ],
        form: {
          id_pegawai: null,
          id_customer: null,
          no_meja: null,
          tgl_reservasi: null,
          sesi: null,
        },
        editId: '',
        editedItem: {
          id_pegawai: null,
          id_customer: null,
          no_meja: null,
          tgl_reservasi: null,
          sesi: null,
        },
      };
    },
    computed: {
      formTitle() {
        return this.inputType
      },
      // validations
      tanggalErrors () {
        const errors = []
        if (!this.$v.form.tgl_reservasi.$dirty) return errors
        !this.$v.form.tgl_reservasi.required && errors.push('Tanggal reservasi harus diisi.')
        return errors
      },
      sesiErrors () {
        const errors = []
        if (!this.$v.form.deskripsi.$dirty) return errors
        !this.$v.form.deskripsi.required && errors.push('Harap masukkan sesi.')
        return errors
      },
      customerErrors () {
        const errors = []
        if (!this.$v.form.unit.$dirty) return errors
        !this.$v.form.unit.required && errors.push('Nama customer harus diisi.')
        return errors
      },
      pegawaiErrors() {
        const errors = []
        if (!this.$v.form.tipe_menu.$dirty) return errors
        !this.$v.form.tipe_menu.required && errors.push('Nama waiter harus diisi.')
        return errors
      },
      mejaErrors() {
        const errors = []
        if (!this.$v.form.harga.$dirty) return errors
        !this.$v.form.harga.required && errors.push('No. meja harus diisi.')
        return errors
      },
    },

    methods: {
      // function buat format angka
      formatPrice(value) {
        let val = (value/1).toFixed(0).replace('.', ',')
        return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
      },

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
          console.log(this.menu)
          if (this.inputType === 'Tambah')
          {
            this.save()
          }
          else
            this.update()
        }
      },

      //read data product
      readData() {
        var url = this.$api + '/reservasi'
        this.$http.get(url, {
          headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('token')
          }
        }).then(response => {
          this.loadingData = false
          this.reservasis = response.data.data
        })
      },

      readDataCustomer(){
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

      readDataPegawai(){
        var url = this.$api + '/pegawai'
        this.$http.get(url, {
          headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('token')
          }
        }).then(response => {
          this.loadingData = false
          this.pegawais = response.data.data
        })
      },

      readDataMeja(){
        var url = this.$api + '/meja'
        this.$http.get(url, {
          headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('token')
          }
        }).then(response => {
          this.loadingData = false
          this.mejas = response.data.data
        })
      },

      //simpan data produk
      save() {
        this.menu.append('id_pegawai', this.form.id_pegawai);
        this.menu.append('id_customer', this.form.id_customer);
        this.menu.append('no_meja', this.form.no_meja);
        this.menu.append('tgl_reservasi', this.form.tgl_reservasi);
        this.menu.append('sesi', this.form.sesi);

        var url = this.$api + '/reservasi/'
        this.load = true
        this.$http.post(url, this.reservasi, {
          headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('token')
          }
        }).then(response => {
          this.error_message=response.data.message;
          this.color="green"
          this.iconSnackbar ='mdi-check-circle-outline'
          this.snackbar=true;
          this.load = false;
          this.close();
          this.readData(); //mengambil data
          this.resetForm();
        }).catch(error => {
          console.log(Object.values(error.response.data.message))
          this.error_message=Object.values(error.response.data.message).toString();
          this.color="red"
          this.iconSnackbar ='mdi-alert-circle-outline'
          this.snackbar=true;
          this.load = false;
        })
      },

      //ubah data karyawan
      update() {
        let newData = {
          id_pegawai: this.id_pegawai,
          id_customer: this.id_customer,
          no_meja: this.no_meja,
          tgl_reservasi: this.tgl_reservasi,
          sesi: this.sesi,
        }
        var url = this.$api + '/reservasi/' + this.editId;

        this.load = true

        this.$http.put(url, newData, {
          headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('token')
          }
        }).then(response => {
          this.error_message=response.data.message;
          this.color="green"
          this.iconSnackbar ='mdi-check-circle-outline'
          this.snackbar=true;
          this.load = false;
          this.close();
          this.readData(); //mengambil data
          this.resetForm();
          this.inputType = 'Tambah';

        }).catch(error => {
          this.error_message=Object.values(error.response.data.message).toString();
          this.color="red"
          this.iconSnackbar ='mdi-alert-circle-outline'
          this.snackbar=true;
          this.load = false;
        })
      },

      //hapus data produk
      deleteData() {
        //mengahapus data
        var url = this.$api + '/reservasi/' + this.deleteId;

        //data dihapus berdasarkan id
        this.$http.delete(url, {
          headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('token')
          }
        }).then(response => {
          this.error_message=response.data.message;
          this.color="green"
          this.snackbar=true;
          this.iconSnackbar ='mdi-check-circle-outline'
          this.load = false;
          this.close();
          this.readData(); //mengambil data
          this.resetForm();
          this.dialogConfirm = false;
          this.inputType = 'Tambah';
        }).catch(error => {
          this.error_message=error.response.data.message;
          this.color="red"
          this.iconSnackbar ='mdi-alert-circle-outline'
          this.snackbar=true;
          this.load = false;
        })
      },

      editHandler(item){
        this.inputType = 'Ubah';
        this.editId = item.id_reservasi;
        this.form.id_pegawai= item.id_pegawai,
        this.form.id_customer= item.id_customer,
        this.form.no_meja= item.no_meja,
        this.form.tgl_reservasi= item.tgl_reservasi,
        this.form.sesi= item.sesi,
        this.dialog = true;
      },

      deleteHandler(item){
        this.deleteId = item.id_reservasi
        this.dialogConfirm = true;
      },

      close() {
        this.$v.$reset()
        this.dialogConfirm = false
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
        this.$v.$reset()
        this.form = {
          id_pegawai: null,
          id_customer: null,
          no_meja: null,
          tgl_reservasi: null,
          sesi: null,
        };
      },
    },

    mounted() {
      this.loadingData = true
      this.readData()
      this.readDataCustomer()
      this.readDataMeja()
      this.readDataPegawai()
    },
  }
</script>

<style scoped>

</style>