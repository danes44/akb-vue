<template>
  <div id="app">
    <v-container fluid>
      <v-row>
        <v-col cols="12" md="12" lg="12" xl="6">
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
                  class="mt-6 ml-3 rounded-lg"
              ></v-text-field>

              <v-tooltip bottom>
                <template v-slot:activator="{ on, attrs }">
                  <v-btn color="primary"
                         @click="dialogFilter = true" dark icon
                         class="ml-3 px-4 py-5 rounded-lg font-weight-bold"
                         elevation="0"
                         v-bind="attrs"
                         v-on="on" style="font-size: 14px">
                    <v-icon class="">
                      mdi-filter-variant
                    </v-icon>
                  </v-btn>
                </template>
                <span>Search Filter</span>
              </v-tooltip>

              <div v-show="this.filterTanggal!==null">
                <v-chip outlined class="mx-3">{{ this.filterTanggal }}</v-chip>
              </div>
              <v-spacer></v-spacer>
              <span class="mr-3 font-weight-bold">Stok Masuk</span>
            </v-card-title>

            <v-data-table v-if="filterTanggal===null" :headers="headersMasuk" :items="stokMasuks" :search="search" :loading="loadingData" loading-text="Data sedang dimuat..." >

              <template v-slot:item.jumlah="{ item }">
                <span>
                  {{ formatPrice(item.jumlah) }}
                </span>
              </template>

              <template v-slot:item.harga="{ item }">
                <span>
                  Rp. {{ formatPrice(item.harga) }}
                </span>
              </template>
            </v-data-table>

            <v-data-table v-else :headers="headersMasuk" :items="stokMasukFiltered" :search="search" :loading="loadingData" loading-text="Data sedang dimuat..." >
<!--              <template v-slot:item.nama_bahan="{ item }">-->
<!--                <span>-->
<!--                  {{ item.nama_bahan }} asdasdasd-->
<!--                </span>-->
<!--              </template>-->

              <template v-slot:item.jumlah="{ item }">
                <span>
                  {{ formatPrice(item.jumlah) }}
                </span>
              </template>

              <template v-slot:item.harga="{ item }">
                <span>
                  Rp. {{ formatPrice(item.harga) }}
                </span>
              </template>
            </v-data-table>

          </v-card>
        </v-col>
        <v-col>
          <v-card class="elevation-0 rounded-lg">
            <v-card-title class="mt-3 text-center">
              <v-text-field
                  v-model="searchKeluar"
                  append-icon="mdi-magnify"
                  label="Search"
                  filled
                  rounded
                  single-line
                  dense
                  style="max-width: 400px!important;"
                  class="mt-6 ml-3 rounded-lg"
              ></v-text-field>
              <v-spacer></v-spacer>
              <span class="mr-3 font-weight-bold">Stok Keluar</span>
            </v-card-title>

            <v-data-table :headers="headersKeluar" :items="stokKeluars" :search="searchKeluar" :loading="loadingData" loading-text="Data sedang dimuat...">

              <template v-slot:item.jumlah="{ item }">
                <span>
                  {{ formatPrice(item.jumlah) }}
                </span>
              </template>

              <template v-slot:item.status="{ item }">
                <v-chip v-if="item.status === 'keluar'" color="#2196F3" outlined>Keluar</v-chip>
                <v-chip v-else color="red" outlined>Buang</v-chip>
              </template>

            </v-data-table>
          </v-card>
        </v-col>
      </v-row>

      <!--      dialog form-->
      <div>
<!--        <v-dialog v-model="dialog" persistent max-width="600px">-->
<!--          <v-card class="px-5 py-5">-->
<!--            <v-card-title>-->
<!--              <span class="headline font-weight-bold">{{ formTitle }}</span>-->
<!--            </v-card-title>-->

<!--            <v-card-text v-if="formTitle==='Ubah Stok Masuk'" class="pt-7">-->
<!--              &lt;!&ndash;            <label>Nama Bahan</label>&ndash;&gt;-->
<!--              <v-autocomplete-->
<!--                  outlined-->
<!--                  rounded-->
<!--                  class="rounded-lg"-->
<!--                  v-model="formMasuk.id_bahan"-->
<!--                  label="Nama Bahan"-->
<!--                  required-->
<!--                  :items="bahans"-->
<!--                  item-value="id_bahan"-->
<!--                  item-text="nama_bahan"-->
<!--                  :error-messages="bahanErrors"-->
<!--                  @input="$v.formMasuk.id_bahan.$touch()"-->
<!--                  @blur="$v.formMasuk.id_bahan.$touch()"-->
<!--              >-->
<!--                <template v-slot:prepend-inner>-->
<!--                  <v-icon class="mr-5" >mdi-food-steak</v-icon>-->
<!--                </template>-->
<!--              </v-autocomplete>-->

<!--              <v-row class="pt-0">-->
<!--                <v-col class="pb-0">-->
<!--                  <v-text-field-->
<!--                      outlined-->
<!--                      rounded-->
<!--                      class="rounded-lg"-->
<!--                      v-model="formMasuk.jumlah"-->
<!--                      label="Jumlah Stok"-->
<!--                      required-->
<!--                      type="number"-->
<!--                      :error-messages="jumlahErrors"-->
<!--                      @input="$v.formMasuk.jumlah.$touch()"-->
<!--                      @blur="$v.formMasuk.jumlah.$touch()"-->
<!--                  >-->
<!--                    <template v-slot:prepend-inner>-->
<!--                      <v-icon class="mr-5">mdi-archive-outline</v-icon>-->
<!--                    </template>-->
<!--                  </v-text-field>-->
<!--                </v-col>-->

<!--                <v-col class="pb-0">-->
<!--                  <v-text-field-->
<!--                      outlined-->
<!--                      rounded-->
<!--                      class="rounded-lg"-->
<!--                      v-model="formMasuk.harga"-->
<!--                      label="Harga"-->
<!--                      required-->
<!--                      type="number"-->
<!--                      :error-messages="hargaErrors"-->
<!--                      @input="$v.formMasuk.harga.$touch()"-->
<!--                      @blur="$v.formMasuk.harga.$touch()"-->
<!--                  >-->
<!--                    <template v-slot:prepend-inner>-->
<!--                      <v-icon class="mr-5">mdi-cash</v-icon>-->
<!--                      <span style="line-height: 1.375rem !important;">Rp. </span>-->
<!--                    </template>-->
<!--                  </v-text-field>-->
<!--                </v-col>-->
<!--              </v-row>-->
<!--            </v-card-text>-->

<!--            <v-card-text v-else class="pt-7">-->
<!--              &lt;!&ndash;            <label>Nama Bahan</label>&ndash;&gt;-->
<!--              <v-autocomplete-->
<!--                  outlined-->
<!--                  rounded-->
<!--                  class="rounded-lg"-->
<!--                  v-model="formKeluar.id_bahan"-->
<!--                  label="Nama Bahan"-->
<!--                  required-->
<!--                  :items="bahans"-->
<!--                  item-value="id_bahan"-->
<!--                  item-text="nama_bahan"-->
<!--                  :error-messages="bahanErrors"-->
<!--                  @input="$v.formKeluar.id_bahan.$touch()"-->
<!--                  @blur="$v.formKeluar.id_bahan.$touch()"-->
<!--              >-->
<!--                <template v-slot:prepend-inner>-->
<!--                  <v-icon class="mr-5" >mdi-food-steak</v-icon>-->
<!--                </template>-->
<!--              </v-autocomplete>-->

<!--              <v-row class="pt-0">-->
<!--                <v-col class="pb-0">-->
<!--                  <v-text-field-->
<!--                      outlined-->
<!--                      rounded-->
<!--                      class="rounded-lg"-->
<!--                      v-model="formKeluar.jumlah"-->
<!--                      label="Jumlah Stok"-->
<!--                      required-->
<!--                      type="number"-->
<!--                      :error-messages="jumlahErrors"-->
<!--                      @input="$v.formKeluar.jumlah.$touch()"-->
<!--                      @blur="$v.formKeluar.jumlah.$touch()"-->
<!--                  >-->
<!--                    <template v-slot:prepend-inner>-->
<!--                      <v-icon class="mr-5">mdi-archive-outline</v-icon>-->
<!--                    </template>-->
<!--                  </v-text-field>-->
<!--                </v-col>-->

<!--                <v-col class="pb-0">-->
<!--                  <v-select-->
<!--                      outlined-->
<!--                      rounded-->
<!--                      class="rounded-lg"-->
<!--                      v-model="formKeluar.status"-->
<!--                      label="Status"-->
<!--                      required-->
<!--                      :items="statusList"-->
<!--                      item-value="key"-->
<!--                      item-text="name"-->
<!--                      :error-messages="statusErrors"-->
<!--                      @input="$v.formKeluar.status.$touch()"-->
<!--                      @blur="$v.formKeluar.status.$touch()"-->
<!--                  >-->
<!--                    <template v-slot:prepend-inner>-->
<!--                      <v-icon class="mr-5">mdi-cash</v-icon>-->
<!--                    </template>-->
<!--                  </v-select>-->
<!--                </v-col>-->
<!--              </v-row>-->
<!--            </v-card-text>-->

<!--            <v-card-actions class="pr-8 pt-9 pb-5">-->
<!--              <v-spacer></v-spacer>-->
<!--              <v-btn color="grey darken-1" text @click="cancel" class=" pa-6 font-weight-bold">-->
<!--                Cancel-->
<!--              </v-btn>-->
<!--              <v-btn color="primary" elevation="0" @click="setForm"-->
<!--                     class="ml-3 px-9 py-6 font-weight-bold"-->
<!--                     :loading="loading"-->
<!--                     :disabled="loading">-->
<!--                Save-->
<!--              </v-btn>-->
<!--            </v-card-actions>-->
<!--          </v-card>-->
<!--        </v-dialog>-->
      </div>


      <!--      snackbar section -->
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


      <!--      dialog confirm delete-->
      <div>
<!--        <v-dialog v-model="dialogConfirm" persistent max-width="400px">-->
<!--          <v-card>-->
<!--            <v-card-title class="pt-6">-->
<!--              <v-icon color="red" class="h3 mr-4" size="30">mdi-alert-circle</v-icon>-->
<!--              <span class="h3 font-weight-bold red&#45;&#45;text">Warning!</span>-->
<!--            </v-card-title>-->
<!--            <v-card-text>-->
<!--              Anda yakin ingin menghapus stok bahan ini?-->
<!--            </v-card-text>-->
<!--            <v-card-actions>-->
<!--              <v-spacer></v-spacer>-->
<!--              <v-btn color="grey darken-1" class="mb-3 pa-6 font-weight-bold"  text @click="close">-->
<!--                Cancel-->
<!--              </v-btn>-->
<!--              <v-btn v-if="deleteType==='masuk'" color="red" class="mx-3 mb-3 px-9 py-6 font-weight-bold" :loading="loading" elevation="0" dark @click="deleteDataMasuk" >-->
<!--                Delete-->
<!--              </v-btn>-->
<!--              <v-btn v-else color="red" class="mx-3 mb-3 px-9 py-6 font-weight-bold" :loading="loading" elevation="0" dark @click="deleteDataKeluar" >-->
<!--                Delete-->
<!--              </v-btn>-->
<!--            </v-card-actions>-->
<!--          </v-card>-->
<!--        </v-dialog>-->
      </div>

      <v-dialog v-model="dialogFilter" persistent max-width="400px">
        <v-card>
          <v-container>
            <v-toolbar elevation="0">
              <span class="headline font-weight-bold">Filter Search Tanggal</span>
              <v-spacer></v-spacer>
              <v-btn
                  icon
                  @click="close"
              >
                <v-icon>mdi-close</v-icon>
              </v-btn>
            </v-toolbar>
            <v-menu
                v-model="menu"
                :close-on-content-click="false"
                :nudge-right="40"
                transition="scale-transition"
                offset-y
                min-width="auto"
            >
              <template v-slot:activator="{ on, attrs }">
                <v-text-field
                    filled
                    rounded
                    single-line
                    dense
                    hide-details
                    clearable
                    class="rounded-lg mx-3 my-5"
                    v-model="filterTanggal"
                    label="Tanggal"
                    readonly
                    v-bind="attrs"
                    v-on="on"
                >
                  <template v-slot:prepend-inner>
                    <v-icon class="mr-5">mdi-calendar</v-icon>
                  </template>
                </v-text-field>
              </template>
              <v-date-picker
                  v-model="filterTanggal"
                  @input="menu = false"
              ></v-date-picker>
            </v-menu>

            <v-card-actions class="pt-10">
              <v-spacer></v-spacer>
              <v-btn color="grey darken-1" class="mb-3 pa-6 font-weight-bold"  text @click="resetFilter">
                Reset
              </v-btn>
              <v-btn color="primary" class="mx-3 mb-3 px-9 py-6 font-weight-bold" elevation="0" dark @click="searchTanggal" >
                Submit
              </v-btn>
            </v-card-actions>
          </v-container>

        </v-card>
      </v-dialog>

    </v-container>
  </div>
</template>

<script>
// import {
//   numeric,
//   required,
//   minValue,
//   // maxValue,
//   // between,
// } from "vuelidate/lib/validators";

export default {
  name: "Stok",
  // validations: {
  //   form: {
  //     id_bahan: { required,  },
  //     jumlah: { required, numeric, minValue: minValue(0) },
  //     // jumlah_per_sajian: { required, numeric, between (value) {
  //     //     return between(0, this.jumlah_stok)(value)
  //     //   }},
  //     // jumlah_per_sajian: { required, numeric, between: between(0,'jumlah_stok')},
  //     jumlah_: { required, numeric, },
  //     unit: { required },
  //   }
  // },
  // validations() {
  //     if ( this.inputType === 'Ubah Stok Masuk') {
  //       return {
  //         formMasuk:{
  //           id_bahan: { required,  },
  //           jumlah: { required, numeric, minValue: minValue(0) },
  //           harga: { required, numeric, },
  //         }
  //       }
  //     } else {
  //       return {
  //         formKeluar: {
  //           id_bahan: {required,},
  //           jumlah: {required, numeric, minValue: minValue(0)},
  //           status: {required,},
  //         }
  //       }
  //     }
  //   },

  data() {
    return {
      currentEmail:localStorage.getItem('email'),
      menu: false,
      modal: false,
      menu2: false,
      loadingData: false,
      inputType: 'Ubah Stok Masuk',
      deleteType: 'masuk',
      loading: false,
      snackbar: false,
      error_message: '',
      color: '',
      iconSnackbar:'',
      search: null,
      searchKeluar: null,
      dialog: false,
      dialogFilter: false,
      dialogConfirm: false,
      isFilter:false,
      headersMasuk: [
        { text: "ID", value: "id_stok_masuk", width:70 },
        { text: "Nama Bahan",
          align: "start",
          value: "nama_bahan" },
        { text: "Stok", value: "jumlah",filterable: false, width: 100},
        { text: "Harga", value: "harga",filterable: false},
        { text: "Tanggal", value: "created_at"}
      ],
      headersKeluar: [
        { text: "ID", value: "id_stok_keluar", width:70 },
        { text: "Nama Bahan",
          align: "start",
          value: "nama_bahan" },
        { text: "Stok", value: "jumlah",filterable: false,  width: 100},
        { text: "Status", value: "status", sortable: false},
        { text: "Tanggal", value: "created_at"}
      ],
      stokMasuks: [],
      stokMasukFiltered: [],
      stokKeluars: [],
      bahans: [],
      statusList: [
        { key: 'keluar', name: 'Keluar'},
        { key: 'sisa', name: 'Buang'},
      ],
      filterTanggal: null,
      // formMasuk: {
      //   id_bahan: null,
      //   jumlah: null,
      //   harga: null,
      // },
      // formKeluar: {
      //   id_bahan: null,
      //   jumlah: null,
      //   status: '',
      // },
      // editIdMasuk: '',
      // editIdKeluar: '',
      // editedItemMasuk: {
      //   id_bahan: null,
      //   jumlah: null,
      //   harga: null,
      // },
      // editedItemKeluar: {
      //   id_bahan: null,
      //   jumlah: null,
      //   status: '',
      // },
    };
  },
  computed: {
    formTitle() {
      return this.inputType
    },

    // validations
    // bahanErrors () {
    //   const errors = []
    //   if(this.inputType === 'Ubah Stok Masuk') {
    //     if (!this.$v.formMasuk.id_bahan.$dirty) return errors
    //     !this.$v.formMasuk.id_bahan.required && errors.push('Nama bahan harus diisi.')
    //   }
    //   else{
    //     if (!this.$v.formKeluar.id_bahan.$dirty) return errors
    //     !this.$v.formKeluar.id_bahan.required && errors.push('Nama bahan harus diisi.')
    //   }
    //   return errors
    // },
    // jumlahErrors () {
    //   const errors = []
    //   if(this.inputType === 'Ubah Stok Masuk') {
    //     if (!this.$v.formMasuk.jumlah.$dirty) return errors
    //     !this.$v.formMasuk.jumlah.required && errors.push('Jumlah stok harus diisi.')
    //     !this.$v.formMasuk.jumlah.numeric && errors.push('Jumlah stok harus berupa angka.')
    //     !this.$v.formMasuk.jumlah.minValue && errors.push('Jumlah stok minimal 0.')
    //   }
    //   else{
    //     if (!this.$v.formKeluar.jumlah.$dirty) return errors
    //     !this.$v.formKeluar.jumlah.required && errors.push('Jumlah stok harus diisi.')
    //     !this.$v.formKeluar.jumlah.numeric && errors.push('Jumlah stok harus berupa angka.')
    //     !this.$v.formKeluar.jumlah.minValue && errors.push('Jumlah stok minimal 0.')
    //   }
    //
    //   return errors
    // },
    // hargaErrors () {
    //   const errors = []
    //   if(this.inputType === 'Ubah Stok Masuk') {
    //     if (!this.$v.formMasuk.harga.$dirty) return errors
    //     !this.$v.formMasuk.harga.required && errors.push('Serving size harus diisi.')
    //     !this.$v.formMasuk.harga.numeric && errors.push('Serving size harus berupa angka.')
    //   }
    //   else{
    //     if (!this.$v.formKeluar.harga.$dirty) return errors
    //     !this.$v.formKeluar.harga.required && errors.push('Serving size harus diisi.')
    //     !this.$v.formKeluar.harga.numeric && errors.push('Serving size harus berupa angka.')
    //   }
    //   return errors
    // },
    // statusErrors () {
    //   const errors = []
    //   if(this.inputType === 'Ubah Stok Masuk') {
    //     if (!this.$v.formMasuk.status.$dirty) return errors
    //     !this.$v.formMasuk.status.required && errors.push('Unit harus diisi.')
    //   }
    //   else{
    //     if (!this.$v.formKeluar.status.$dirty) return errors
    //     !this.$v.formKeluar.status.required && errors.push('Unit harus diisi.')
    //   }
    //   return errors
    // },
  },

  methods: {
    searchTanggal(){
      this.loading = true
      if (this.filterTanggal!==null)
      {
        this.searchTanggalStok()
        this.loading = false
        this.dialogFilter = false
      }
      else
      {
        this.error_message="Sesi dan Tgl Reservasi harus diisi";
        this.color="red"
        this.iconSnackbar ='mdi-alert-circle'
        this.snackbar=true;
      }
    },

    // function buat format angka
    formatPrice(value) {
      console.log()
      let val = (value/1).toFixed(0).replace('.', ',')
      return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
    },

    // function buat uppercase each word
    // titleCase(str) {
    //   var splitStr = str.toLowerCase().split(' ');
    //   for (var i = 0; i < splitStr.length; i++) {
    //     // You do not need to check if i is larger than splitStr length, as your for does that for you
    //     // Assign it back to the array
    //     splitStr[i] = splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);
    //   }
    //   // Directly return the joined string
    //   return splitStr.join(' ');
    // },

    // submit form
    // setForm() {
    //   this.$v.$touch()
    //   // console.log(this.$v)
    //   if(!this.$v.$error) {
    //     if (this.inputType === 'Ubah Stok Masuk') {
    //       this.loading = true
    //       this.updateMasuk()
    //     }
    //     else {
    //       this.loading = true
    //       console.log(this.inputType)
    //       this.updateKeluar()
    //     }
    //   }
    // },

    //read data product
    readDataStokMasuk() {
      var url = this.$api + '/stokMasuk'
      this.$http.get(url, {
        headers: {
          'Authorization': 'Bearer ' + localStorage.getItem('token')
        }
      }).then(response => {
        this.loadingData = false
        this.stokMasuks = response.data.data
      })
    },

    //read data product
    readDataStokKeluar() {
      var url = this.$api + '/stokKeluar'
      this.$http.get(url, {
        headers: {
          'Authorization': 'Bearer ' + localStorage.getItem('token')
        }
      }).then(response => {
        this.loadingData = false
        this.stokKeluars = response.data.data
      })
    },

    //read data product
    readDataBahan() {
      var url = this.$api + '/bahan'
      this.$http.get(url, {
        headers: {
          'Authorization': 'Bearer ' + localStorage.getItem('token')
        }
      }).then(response => {
        this.loadingData = false
        this.bahans = response.data.data
      })
    },

    // search tanggal
    searchTanggalStok() {
        let newData = {
          created_at: this.filterTanggal
        }
        var url = this.$api + '/stokMasuk/showTanggal'

        this.$http.post(url, newData, {
          headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('token')
          }
        }).then(response => {
          this.error_message=response.data.message;
          this.color="green"
          this.iconSnackbar ='mdi-check-circle'
          this.snackbar=true;
          this.stokMasukFiltered = response.data.data
          this.loading = false;
          this.close();
          this.readDataStokMasuk()//mengambil data
          this.readDataStokKeluar()
          this.resetForm();
          this.inputType = 'Tambah';

        }).catch(error => {
          this.error_message=error.response.data.message;
          this.color="red"
          this.iconSnackbar ='mdi-alert-circle'
          this.snackbar=true;
          this.loading = false;
        })
      },

    // //ubah data bahan
    // updateBahan() {
    //   let newData = {
    //     jumlah_stok: this.formMasuk.jumlah
    //   }
    //   var url = this.$api + '/bahan/stokMasuk/' + this.formMasuk.id_bahan;
    //
    //   this.$http.put(url, newData, {
    //     headers: {
    //       'Authorization': 'Bearer ' + localStorage.getItem('token')
    //     }
    //   }).then(response => {
    //     this.error_message=response.data.message;
    //     console.log(typeof this.error_message)
    //     this.color="green"
    //     this.iconSnackbar ='mdi-check-circle'
    //     this.snackbar=true;
    //     this.loading = false;
    //     this.close();
    //     this.readData(); //mengambil data
    //     this.resetForm();
    //     this.inputType = 'Tambah';
    //
    //   }).catch(error => {
    //     console.log(error.response.data.message)
    //     this.error_message=error.response.data.message;
    //     this.color="red"
    //     this.iconSnackbar ='mdi-alert-circle'
    //     this.snackbar=true;
    //     this.loading = false;
    //   })
    // },
    //
    // //ubah data bahan
    // updateMasuk() {
    //   let newData = {
    //     id_bahan: this.formMasuk.id_bahan,
    //     jumlah: this.formMasuk.jumlah,
    //     harga: this.formMasuk.harga,
    //   }
    //   var url = this.$api + '/stokMasuk/' + this.editIdMasuk;
    //
    //   this.$http.put(url, newData, {
    //     headers: {
    //       'Authorization': 'Bearer ' + localStorage.getItem('token')
    //     }
    //   }).then(response => {
    //     this.error_message=response.data.message;
    //     console.log(typeof this.error_message)
    //     this.color="green"
    //     this.iconSnackbar ='mdi-check-circle'
    //     this.snackbar=true;
    //     this.updateBahan()
    //     this.loading = false;
    //     this.close();
    //     this.readDataStokKeluar(); //mengambil data
    //     this.readDataStokMasuk();
    //     this.resetForm();
    //     this.inputType = 'Tambah';
    //
    //   }).catch(error => {
    //     this.error_message=error.response.data.message;
    //     this.color="red"
    //     this.iconSnackbar ='mdi-alert-circle'
    //     this.snackbar=true;
    //     this.loading = false;
    //   })
    // },
    //
    // //ubah data bahan
    // updateKeluar() {
    //   let newData = {
    //     id_bahan: this.formKeluar.id_bahan,
    //     jumlah: this.formKeluar.jumlah,
    //     status: this.formKeluar.status
    //   }
    //   var url = this.$api + '/stokKeluar/' + this.editIdKeluar;
    //
    //   this.$http.put(url, newData, {
    //     headers: {
    //       'Authorization': 'Bearer ' + localStorage.getItem('token')
    //     }
    //   }).then(response => {
    //     this.error_message=response.data.message;
    //     console.log(typeof this.error_message)
    //     this.color="green"
    //     this.iconSnackbar ='mdi-check-circle'
    //     this.snackbar=true;
    //     this.loading = false;
    //     this.close();
    //     this.readDataStokKeluar(); //mengambil data
    //     this.readDataStokMasuk();
    //     this.resetForm();
    //     this.inputType = 'Tambah';
    //
    //   }).catch(error => {
    //     this.error_message=error.response.data.message;
    //     this.color="red"
    //     this.iconSnackbar ='mdi-alert-circle'
    //     this.snackbar=true;
    //     this.loading = false;
    //   })
    // },
    //
    // //hapus data bahan
    // deleteDataMasuk() {
    //   this.loading = true
    //   //mengahapus data
    //   var url = this.$api + '/stokMasuk/' + this.deleteId;
    //
    //   //data dihapus berdasarkan id
    //   this.$http.delete(url, {
    //     headers: {
    //       'Authorization': 'Bearer ' + localStorage.getItem('token')
    //     }
    //   }).then(response => {
    //     this.error_message=response.data.message;
    //     this.color="green"
    //     this.iconSnackbar ='mdi-check-circle'
    //     this.snackbar=true;
    //     this.loading = false;
    //     this.close();
    //     this.readDataStokKeluar(); //mengambil data
    //     this.readDataStokMasuk();
    //     this.resetForm();
    //     this.dialogConfirm = false;
    //     this.inputType = 'Tambah';
    //   }).catch(error => {
    //     this.error_message=error.response.data.message;
    //     this.color="red"
    //     this.iconSnackbar ='mdi-alert-circle'
    //     this.form.nama_bahan = null //reset form.nama_bahan
    //     this.snackbar=true;
    //     this.loading = false;
    //   })
    // },
    //
    // //hapus data bahan
    // deleteDataKeluar() {
    //   this.loading = true
    //   //mengahapus data
    //   var url = this.$api + '/stokMasuk/' + this.deleteId;
    //
    //   //data dihapus berdasarkan id
    //   this.$http.delete(url, {
    //     headers: {
    //       'Authorization': 'Bearer ' + localStorage.getItem('token')
    //     }
    //   }).then(response => {
    //     this.error_message=response.data.message;
    //     this.color="green"
    //     this.iconSnackbar ='mdi-check-circle'
    //     this.snackbar=true;
    //     this.loading = false;
    //     this.close();
    //     this.readDataStokKeluar(); //mengambil data
    //     this.readDataStokMasuk();
    //     this.resetForm();
    //     this.dialogConfirm = false;
    //     this.inputType = 'Tambah';
    //   }).catch(error => {
    //     this.error_message=error.response.data.message;
    //     this.color="red"
    //     this.iconSnackbar ='mdi-alert-circle'
    //     this.form.nama_bahan = null //reset form.nama_bahan
    //     this.snackbar=true;
    //     this.loading = false;
    //   })
    // },
    //
    // deleteHandlerMasuk(item){
    //   this.deleteId = item.id_stok_masuk;
    //   this.formMasuk.nama_bahan = item.nama_bahan
    //   this.deleteType = 'masuk'
    //   this.dialogConfirm = true;
    // },
    //
    // deleteHandlerKeluar(item){
    //   this.deleteId = item.id_stok_keluar;
    //   this.formKeluar.nama_bahan = item.nama_bahan
    //   this.deleteType = 'keluar'
    //   this.dialogConfirm = true;
    // },
    //
    // editHandlerMasuk(item){
    //   this.inputType = 'Ubah Stok Masuk';
    //   this.editIdMasuk = item.id_stok_masuk;
    //   this.formMasuk.id_bahan = item.id_bahan
    //   this.formMasuk.jumlah = item.jumlah
    //   this.formMasuk.harga = item.harga
    //   this.dialog = true;
    // },
    //
    // editHandlerKeluar(item){
    //   this.inputType = 'Ubah Stok Keluar';
    //   this.editIdKeluar = item.id_stok_keluar;
    //   this.formKeluar.id_bahan = item.id_bahan
    //   this.formKeluar.jumlah = item.jumlah
    //   this.formKeluar.status = item.status
    //   this.dialog = true;
    // },

    close() {
      this.dialogConfirm = false
      this.dialog = false
      this.dialogFilter = false
      this.inputType = 'Ubah Stok Masuk';
    },

    cancel() {
      this.resetForm();
      this.readDataStokMasuk()
      this.readDataStokKeluar()
      this.readDataBahan()
      this.dialog = false;
      this.inputType = 'Ubah Stok Masuk';
    },

    resetFilter(){
      this.readDataStokKeluar()
      this.readDataStokMasuk()
      this.readDataBahan()
      this.filterTanggal = null
    },

    // resetForm() {
    //   this.$v.$reset()
    //   this.formMasuk= {
    //     id_bahan: null,
    //     jumlah: null,
    //     harga: null,
    //   }
    //   this.formKeluar= {
    //     id_bahan: null,
    //     jumlah: null,
    //     status: '',
    //   }
    // },
  },

  mounted() {
    this.loadingData = true
    this.readDataStokMasuk()
    this.readDataStokKeluar()
    this.readDataBahan()
  },
}
</script>

<style scoped>
label.v-label.theme--light {
  margin-bottom: 0!important;
}
</style>