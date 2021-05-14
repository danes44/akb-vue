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
              class="mt-6 ml-3 rounded-lg"
          ></v-text-field>
          <v-switch
              class="ml-6 mr-8 mr-md-16 mr-xl-16"
              v-model="switchDataKosong"
              inset
          >
            <template v-slot:label style="margin-bottom: 0!important;">
              <span class="mb-n2">Tampil Bahan Kosong</span>
            </template>
          </v-switch>
          <v-spacer></v-spacer>
          <v-btn color="#37A37B" @click="dialog = true" dark class="mr-3 px-4 py-5 rounded-lg font-weight-bold" elevation="0" style="font-size: 14px">
            <v-icon class="mr-3 ">
              mdi-plus
            </v-icon>
            Tambah Bahan
          </v-btn>
        </v-card-title>

        <v-data-table v-if="switchDataKosong" :headers="headers" :items="bahanKosong" :search="search" :loading="loadingData" loading-text="Data sedang dimuat..." >
          <template v-slot:item.jumlah_stok="{ item }">
            <span>
              {{ formatPrice(item.jumlah_stok) }} {{ item.unit }}
            </span>
          </template>

          <template v-slot:item.jumlah_per_sajian="{ item }">
            <span>
              {{ formatPrice(item.jumlah_per_sajian) }} {{ item.unit }}
            </span>
          </template>

          <template v-slot:item.ketersediaan="{ item }">
            <v-chip v-if="item.ketersediaan" color="accent" outlined>Tersedia</v-chip>
            <v-chip v-else color="red" outlined>Tidak</v-chip>
          </template>

          <template v-slot:[`item.actions`]="{ item }">
            <v-tooltip bottom>
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                    class="mr-2"
                    rounded
                    color="#37A37B"
                    x-small
                    icon
                    v-bind="attrs"
                    v-on="on"
                    @click="stokMasukHandler(item)"
                >
                  <v-icon>
                    mdi-basket-plus
                  </v-icon>
                </v-btn>
              </template>
              <span>Tambah Stok</span>
            </v-tooltip>

            <v-tooltip bottom>
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                    class="mr-2"
                    rounded
                    color="red"
                    x-small
                    icon
                    v-bind="attrs"
                    v-on="on"
                    @click="stokKeluarHandler(item)"
                >
                  <v-icon>
                    mdi-basket-minus
                  </v-icon>
                </v-btn>
              </template>
              <span>Buang Bahan</span>
            </v-tooltip>

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

        <v-data-table v-else :headers="headers" :items="bahans" :search="search" :loading="loadingData" loading-text="Data sedang dimuat...">
          <template v-slot:item.jumlah_stok="{ item }">
            <span>
              {{ formatPrice(item.jumlah_stok) }} {{ item.unit }}
            </span>
          </template>

          <template v-slot:item.jumlah_per_sajian="{ item }">
            <span>
              {{ formatPrice(item.jumlah_per_sajian) }} {{ item.unit }}
            </span>
          </template>

          <template v-slot:item.ketersediaan="{ item }">
            <v-chip v-if="item.ketersediaan" color="accent" outlined>Tersedia</v-chip>
            <v-chip v-else color="red" outlined>Tidak</v-chip>
          </template>

          <template v-slot:[`item.actions`]="{ item }">
            <v-tooltip bottom>
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                    class="mr-2"
                    rounded
                    color="#37A37B"
                    x-small
                    icon
                    v-bind="attrs"
                    v-on="on"
                    @click="stokMasukHandler(item)"
                >
                  <v-icon>
                    mdi-basket-plus
                  </v-icon>
                </v-btn>
              </template>
              <span>Tambah Stok</span>
            </v-tooltip>

            <v-tooltip bottom>
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                    class="mr-2"
                    rounded
                    color="red"
                    x-small
                    icon
                    v-bind="attrs"
                    v-on="on"
                    @click="stokKeluarHandler(item)"
                >
                  <v-icon>
                    mdi-basket-minus
                  </v-icon>
                </v-btn>
              </template>
              <span>Buang Bahan</span>
            </v-tooltip>

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
            <span class="headline font-weight-bold">{{ formTitle }} Data Bahan</span>
          </v-card-title>

          <v-card-text class="pt-7">
<!--            <label>Nama Bahan</label>-->
            <v-text-field
                outlined
                rounded
                class="rounded-lg"
                v-model="form.nama_bahan"
                label="Nama Bahan"
                required
                :error-messages="namaErrors"
                @input="$v.form.nama_bahan.$touch()"
                @blur="$v.form.nama_bahan.$touch()"
            >
              <template v-slot:prepend-inner>
                <v-icon class="mr-5" >mdi-food-steak</v-icon>
              </template>
            </v-text-field>

            <v-row class="pt-0">
              <v-col class="pb-0">
                <v-text-field
                    outlined
                    rounded
                    class="rounded-lg"
                    v-model="form.jumlah_stok"
                    label="Jumlah Stok"
                    required
                    type="number"
                    :error-messages="stokErrors"
                    @input="$v.form.jumlah_stok.$touch()"
                    @blur="$v.form.jumlah_stok.$touch()"
                >
                  <template v-slot:prepend-inner>
                    <v-icon class="mr-5">mdi-archive-outline</v-icon>
                  </template>
                </v-text-field>
              </v-col>

              <v-col class="pb-0">
                <v-text-field
                    outlined
                    rounded
                    class="rounded-lg"
                    v-model="form.jumlah_per_sajian"
                    label="Serving Size"
                    required
                    type="number"
                    :error-messages="servingSizeErrors"
                    @input="$v.form.jumlah_per_sajian.$touch()"
                    @blur="$v.form.jumlah_per_sajian.$touch()"
                >
                  <template v-slot:prepend-inner>
                    <v-icon class="mr-5">mdi-room-service-outline</v-icon>
                  </template>
                </v-text-field>
              </v-col>
            </v-row>

            <v-row>
              <v-col class="pt-0">
                <v-text-field
                    outlined
                    rounded
                    class="rounded-lg"
                    v-model="form.unit"
                    label="Unit"
                    required
                    :error-messages="unitErrors"
                    @input="$v.form.unit.$touch()"
                    @blur="$v.form.unit.$touch()"
                >
                  <template v-slot:prepend-inner>
                    <v-icon class="mr-5" >mdi-scale-balance</v-icon>
                  </template>
                </v-text-field>
              </v-col>
            </v-row>


          </v-card-text>

          <v-card-actions class="pr-8 pt-9 pb-5">
            <v-spacer></v-spacer>
            <v-btn color="grey darken-1" text @click="cancel" class=" pa-6 font-weight-bold">
              Cancel
            </v-btn>
            <v-btn color="primary" elevation="0" @click="setForm"
                   class="ml-3 px-9 py-6 font-weight-bold"
                   :loading="loading"
                   :disabled="loading">
              Save
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

<!--      dialog form stok masuk dan stok keluar-->
      <v-dialog v-model="dialogStok" persistent max-width="600px">
        <v-card class="px-5 py-5">
          <v-card-title>
            <span class="headline font-weight-bold">{{ formTitle }} Bahan</span>
          </v-card-title>

          <v-card-text v-if="inputType==='Tambah Stok'" class="pt-7">

            <v-row class="pt-0">
              <v-col class="pb-0">
                <v-text-field
                    outlined
                    rounded
                    class="rounded-lg"
                    v-model="formMasuk.jumlah"
                    label="Jumlah Stok"
                    required
                    type="number"
                >
                  <template v-slot:prepend-inner>
                    <v-icon class="mr-5">mdi-archive-outline</v-icon>
                  </template>
                </v-text-field>
              </v-col>

              <v-col class="pb-0">
                <v-text-field
                    outlined
                    rounded
                    class="rounded-lg"
                    v-model="formMasuk.harga"
                    label="Harga"
                    required
                    type="number"
                >
                  <template v-slot:prepend-inner>
                    <v-icon class="mr-5">mdi-cash</v-icon>
                    <span style="line-height: 1.375rem !important;">Rp. </span>
                  </template>
                </v-text-field>
              </v-col>
            </v-row>
          </v-card-text>

          <v-card-text v-else class="pt-7">
            <v-row class="pt-0">
              <v-col class="pb-0">
                <v-text-field
                    outlined
                    rounded
                    class="rounded-lg"
                    v-model="formKeluar.jumlah"
                    label="Jumlah Stok"
                    required
                    type="number"
                >
                  <template v-slot:prepend-inner>
                    <v-icon class="mr-5">mdi-archive-outline</v-icon>
                  </template>
                </v-text-field>
              </v-col>
            </v-row>
          </v-card-text>

          <v-card-actions class="pr-8 pt-9 pb-5">
            <v-spacer></v-spacer>
            <v-btn color="grey darken-1" text @click="cancel" class=" pa-6 font-weight-bold">
              Cancel
            </v-btn>
            <v-btn v-if="inputType==='Tambah Stok'" color="primary" elevation="0" @click="saveMasuk"
                   class="ml-3 px-9 py-6 font-weight-bold"
                   :loading="loading"
                   :disabled="loading">
              Save
            </v-btn>
            <v-btn v-else color="primary" elevation="0" @click="saveKeluar"
                   class="ml-3 px-9 py-6 font-weight-bold"
                   :loading="loading"
                   :disabled="loading">
              Save
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>


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
<!--        <template v-slot:action="{ attrs }">-->
<!--          <v-btn-->
<!--              color="grey"-->
<!--              text-->
<!--              icon-->
<!--              v-bind="attrs"-->
<!--              @click="snackbar = false"-->
<!--          >-->
<!--            <v-icon>mdi-close-circle-outline</v-icon>-->
<!--          </v-btn>-->
<!--        </template>-->
      </v-snackbar>

      <v-dialog v-model="dialogConfirm" persistent max-width="400px">
      <v-card>
        <v-card-title class="pt-6">
          <v-icon color="red" class="h3 mr-4" size="30">mdi-alert-circle</v-icon>
          <span class="h3 font-weight-bold red--text">Warning!</span>
        </v-card-title>
        <v-card-text>
          Anda yakin ingin menghapus bahan bernama <b>{{ form.nama_bahan }}</b> ini?
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="grey darken-1" class="mb-3 pa-6 font-weight-bold"  text @click="close">
            Cancel
          </v-btn>
          <v-btn color="red" class="mx-3 mb-3 px-9 py-6 font-weight-bold" :loading="loading" elevation="0" dark @click="deleteData" >
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
  numeric,
  required,
  minValue,
  // maxValue,
  // between,
} from "vuelidate/lib/validators";

export default {
  name: "Bahan",
  validations: {
    form: {
      nama_bahan: { required,  },
      jumlah_stok: { required, numeric, minValue: minValue(0) },
      // jumlah_per_sajian: { required, numeric, between (value) {
      //     return between(0, this.jumlah_stok)(value)
      //   }},
      // jumlah_per_sajian: { required, numeric, between: between(0,'jumlah_stok')},
      jumlah_per_sajian: { required, numeric, },
      unit: { required },
    }
  },
  // validations() {
  //   if ( this.inputType === 'Tambah') {
  //     return {
  //       form: {
  //         nama_bahan: { required,  },
  //         jumlah_stok: { required, numeric, minValue: minValue(0) },
  //         // jumlah_per_sajian: { required, numeric, between (value) {
  //         //     return between(0, this.jumlah_stok)(value)
  //         //   }},
  //         // jumlah_per_sajian: { required, numeric, between: between(0,'jumlah_stok')},
  //         jumlah_per_sajian: { required, numeric, },
  //         unit: { required },
  //       }
  //     }
  //   }else if ( this.inputType === 'Tambah Stok') {
  //     return {
  //       formMasuk:{
  //         jumlah: { required, numeric, minValue: minValue(0) },
  //         harga: { required, numeric, },
  //       }
  //     }
  //   } else {
  //     return {
  //       formKeluar: {
  //         jumlah: {required, numeric, minValue: minValue(0)},
  //       }
  //     }
  //   }
  // },

  data() {
    return {
      currentEmail:localStorage.getItem('email'),
      menu: false,
      modal: false,
      menu2: false,
      loadingData: false,
      inputType: 'Tambah',
      load: false,
      loading: false,
      snackbar: false,
      error_message: '',
      color: '',
      iconSnackbar:'',
      search: null,
      switchDataKosong: false,
      dialog: false,
      dialogStok : false,
      dialogConfirm: false,
      headers: [
        { text: "ID", value: "id_bahan", width:70 },
        { text: "Nama Bahan",
          align: "start",
          value: "nama_bahan" },
        { text: "Jumlah Stok", value: "jumlah_stok",filterable: false},
        { text: "Serving Size", value: "jumlah_per_sajian",filterable: false},
        { text: "Tersedia", value: "ketersediaan", filterable:false},
        // { text: "Unit", value: "unit", align: 'center', sortable: false, width:70},
        { value: 'actions', sortable: false },
      ],
      bahan: new FormData,
      stokMasuk: new FormData,
      stokKeluar: new FormData,
      bahans: [],
      bahanKosong: [],
      menus:[],
      stokMasuks: [],
      stokKeluars: [],
      form: {
        nama_bahan: '',
        jumlah_stok: null,
        jumlah_per_sajian: null,
        unit: '',
        ketersediaan: 0,
      },
      formKeluar: {
        id_bahan: null,
        jumlah: null,
        status: '',
      },
      formMasuk: {
        id_bahan: null,
        jumlah: null,
        harga: null,
      },
      editId: '',
      editedItem: {
        nama_bahan: '',
        jumlah_stok: null,
        jumlah_per_sajian: null,
        unit: '',
        ketersediaan: 0,
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
      if (!this.$v.form.nama_bahan.$dirty) return errors
      !this.$v.form.nama_bahan.required && errors.push('Nama harus diisi.')
      return errors
    },
    stokErrors () {
      const errors = []
      if (!this.$v.form.jumlah_stok.$dirty) return errors
      !this.$v.form.jumlah_stok.required && errors.push('Jumlah stok harus diisi.')
      !this.$v.form.jumlah_stok.numeric && errors.push('Jumlah stok harus berupa angka.')
      !this.$v.form.jumlah_stok.minValue && errors.push('Jumlah stok minimal 0.')
      return errors
    },
    servingSizeErrors () {
      const errors = []
      if (!this.$v.form.jumlah_per_sajian.$dirty) return errors
      !this.$v.form.jumlah_per_sajian.required && errors.push('Serving size harus diisi.')
      !this.$v.form.jumlah_per_sajian.numeric && errors.push('Serving size harus berupa angka.')
      // !this.$v.form.jumlah_per_sajian.minValue && errors.push('Serving size minimal 0.')
      // !this.$v.form.jumlah_per_sajian.between && errors.push('Min. 0 dan maks. sebanyak jumlah stok.')
      return errors
    },
    unitErrors () {
      const errors = []
      if (!this.$v.form.unit.$dirty) return errors
      !this.$v.form.unit.required && errors.push('Unit harus diisi.')
      return errors
    },
    // jumlahKeluarErrors () {
    //   const errors = []
    //   if (!this.$v.formKeluar.jumlah.$dirty) return errors
    //   !this.$v.formKeluar.jumlah.required && errors.push('Jumlah stok harus diisi.')
    //   !this.$v.formKeluar.jumlah.numeric && errors.push('Jumlah stok harus berupa angka.')
    //   !this.$v.formKeluar.jumlah.minValue && errors.push('Jumlah stok minimal 0.')
    //   return errors
    // },
    // jumlahMasukErrors () {
    //   const errors = []
    //
    //   if (!this.$v.formMasuk.jumlah.$dirty) return errors
    //   !this.$v.formMasuk.jumlah.required && errors.push('Jumlah stok harus diisi.')
    //   !this.$v.formMasuk.jumlah.numeric && errors.push('Jumlah stok harus berupa angka.')
    //   !this.$v.formMasuk.jumlah.minValue && errors.push('Jumlah stok minimal 0.')
    //   return errors
    // },
    // hargaErrors () {
    //   const errors = []
    //   if (!this.$v.formMasuk.harga.$dirty) return errors
    //   !this.$v.formMasuk.harga.required && errors.push('Serving size harus diisi.')
    //   !this.$v.formMasuk.harga.numeric && errors.push('Serving size harus berupa angka.')
    //   return errors
    // },
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
      // console.log(this.$v)
      if(!this.$v.$error) {
        console.log('2')
        if (this.inputType === 'Tambah') {
          this.loading = true
          this.save()
        }
        else {
          this.loading = true
          this.update()
        }
      }
    },

    //read data product
    readData() {
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

    //read data product
    readDataBahanKosong() {
      var url = this.$api + '/bahan/kosong'
      this.$http.get(url, {
        headers: {
          'Authorization': 'Bearer ' + localStorage.getItem('token')
        }
      }).then(response => {
        this.loadingData = false
        this.bahanKosong = response.data.data
      })
    },

    //simpan data bahan
    saveMasuk() {
      this.loading = true
      this.stokMasuk.append('id_bahan', this.formMasuk.id_bahan)
      this.stokMasuk.append('jumlah', this.formMasuk.jumlah)
      this.stokMasuk.append('harga', this.formMasuk.harga)

      var url = this.$api + '/stokMasuk/'
      this.$http.post(url, this.stokMasuk, {
        headers: {
          'Authorization': 'Bearer ' + localStorage.getItem('token')
        }
      }).then(response => {
        this.error_message=response.data.message;
        console.log(this.error_message)
        this.color="green"
        this.iconSnackbar ='mdi-check-circle'
        this.snackbar=true;
        this.loading = false;
        this.updateBahanDariStokMasuk()
        this.readDataStokKeluar(); //mengambil data
        this.readDataStokMasuk();
        this.close();
        this.resetForm();
      }).catch(error => {
        console.log(Object.values(error.response.data.message))
        this.error_message=error.response.data.message;
        console.log(typeof this.error_message)
        this.color="red"
        this.iconSnackbar ='mdi-alert-circle'
        this.snackbar=true;
        this.loading = false;
      })
    },

    //simpan data bahan
    saveKeluar() {
      this.loading = true
      this.stokKeluar.append('id_bahan', this.formKeluar.id_bahan)
      this.stokKeluar.append('jumlah', this.formKeluar.jumlah)
      this.stokKeluar.append('status', 'sisa')

      var url = this.$api + '/stokKeluar/'
      this.$http.post(url, this.stokKeluar, {
        headers: {
          'Authorization': 'Bearer ' + localStorage.getItem('token')
        }
      }).then(response => {
        this.error_message=response.data.message;
        console.log(this.error_message)
        this.color="green"
        this.iconSnackbar ='mdi-check-circle'
        this.snackbar=true;
        this.loading = false;
        this.updateBahanDariStokKeluar()
        this.readDataStokKeluar(); //mengambil data
        this.readDataStokMasuk();
        this.close();
        this.resetForm();
      }).catch(error => {
        console.log(Object.values(error.response.data.message))
        this.error_message=error.response.data.message;
        console.log(typeof this.error_message)
        this.color="red"
        this.iconSnackbar ='mdi-alert-circle'
        this.snackbar=true;
        this.loading = false;
      })
    },

    updateBahanDariStokMasuk() {
      let newData = {
        jumlah_stok: this.formMasuk.jumlah
      }
      var url = this.$api + '/bahan/stokMasuk/' + this.formMasuk.id_bahan;

      this.$http.put(url, newData, {
        headers: {
          'Authorization': 'Bearer ' + localStorage.getItem('token')
        }
      }).then(response => {
        this.error_message=response.data.message;
        console.log(typeof this.error_message)
        this.color="green"
        this.iconSnackbar ='mdi-check-circle'
        this.snackbar=true;
        this.close();
        this.readData(); //mengambil data

      }).catch(error => {
        console.log(error.response.data.message)
        this.error_message=error.response.data.message;
        this.color="red"
        this.iconSnackbar ='mdi-alert-circle'
        this.snackbar=true;
        this.loading = false;
      })
    },

    updateBahanDariStokKeluar() {
      let newData = {
        jumlah_stok: this.formKeluar.jumlah
      }
      var url = this.$api + '/bahan/stokKeluar/' + this.formKeluar.id_bahan;

      this.$http.put(url, newData, {
        headers: {
          'Authorization': 'Bearer ' + localStorage.getItem('token')
        }
      }).then(response => {
        this.error_message=response.data.message;
        console.log(typeof this.error_message)
        this.color="green"
        this.iconSnackbar ='mdi-check-circle'
        this.snackbar=true;
        this.close();
        this.readData(); //mengambil data

      }).catch(error => {
        console.log(error.response.data.message)
        this.error_message=error.response.data.message;
        this.color="red"
        this.iconSnackbar ='mdi-alert-circle'
        this.snackbar=true;
        this.loading = false;
      })
    },

    //simpan data bahan
    save() {
      this.bahan.append('nama_bahan', this.form.nama_bahan);
      this.bahan.append('jumlah_stok', this.form.jumlah_stok);
      this.bahan.append('jumlah_per_sajian', this.form.jumlah_per_sajian);
      this.bahan.append('unit', this.form.unit);

      var url = this.$api + '/bahan/'
      this.$http.post(url, this.bahan, {
        headers: {
          'Authorization': 'Bearer ' + localStorage.getItem('token')
        }
      }).then(response => {
        this.error_message=response.data.message;
        console.log(this.error_message)
        this.color="green"
        this.iconSnackbar ='mdi-check-circle'
        this.snackbar=true;
        this.loading = false;
        this.close();
        this.readData(); //mengambil data
        this.readDataBahanKosong()
        this.resetForm();
      }).catch(error => {
        console.log(Object.values(error.response.data.message))
        this.error_message=error.response.data.message;
        console.log(typeof this.error_message)
        this.color="red"
        this.iconSnackbar ='mdi-alert-circle'
        this.snackbar=true;
        this.loading = false;
      })
    },

    //ubah data bahan
    update() {
      let newData = {
        nama_bahan: this.form.nama_bahan,
        jumlah_stok: this.form.jumlah_stok,
        jumlah_per_sajian: this.form.jumlah_per_sajian,
        unit: this.form.unit,
      }
      console.log(this.form.ketersediaan)
      var url = this.$api + '/bahan/' + this.editId;

      this.$http.put(url, newData, {
        headers: {
          'Authorization': 'Bearer ' + localStorage.getItem('token')
        }
      }).then(response => {
        this.error_message=response.data.message;
        console.log(typeof this.error_message)
        this.color="green"
        this.iconSnackbar ='mdi-check-circle'
        this.snackbar=true;
        this.loading = false;
        this.close();
        this.readData(); //mengambil data
        this.readDataBahanKosong()
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

    //ubah data menu pas ganti jumlah bahan

    // updateMenu() {
    //   let id_table= this.menus.find(menus => menus.id_bahan === this.form.id_bahan) //get id menu mana yang punya id_bahan yang sama
    //   console.log(id_table.id_menu)
    //
    //   let newData = {
    //     id_bahan: this.form.id_bahan,
    //     nama_menu: this.form.nama_menu,
    //     deskripsi: this.form.deskripsi,
    //     unit: this.form.unit,
    //     tipe_menu: this.form.tipe_menu,
    //     harga: this.form.harga,
    //     is_available: this.form.is_available,
    //   }
    //
    //   if(id_table.jumlah_stok >= id_table.jumlah_per_sajian)
    //   {
    //     this.menu.append('is_available', 1);
    //   }
    //   else
    //     this.menu.append('is_available', 0);
    //
    //   var url = this.$api + '/menu/' + this.editId;
    //
    //   this.$http.put(url, newData, {
    //     headers: {
    //       'Authorization': 'Bearer ' + localStorage.getItem('token')
    //     }
    //   }).then(response => {
    //     this.saveImage()
    //     this.error_message=response.data.message;
    //     this.color="green"
    //     this.iconSnackbar ='mdi-check-circle-outline'
    //     this.snackbar=true;
    //     this.loading = false;
    //     this.close();
    //     this.readData(); //mengambil data
    //     this.resetForm();
    //     this.inputType = 'Tambah';
    //
    //   }).catch(error => {
    //     this.error_message=error.response.data.message;
    //     this.color="red"
    //     this.iconSnackbar ='mdi-alert-circle-outline'
    //     this.snackbar=true;
    //     this.loading = false;
    //   })
    // },

    //hapus data bahan
    deleteData() {
      this.loading = true
      //mengahapus data
      var url = this.$api + '/bahan/' + this.deleteId;

      //data dihapus berdasarkan id
      this.$http.delete(url, {
        headers: {
          'Authorization': 'Bearer ' + localStorage.getItem('token')
        }
      }).then(response => {
        this.error_message=response.data.message;
        this.color="green"
        this.iconSnackbar ='mdi-check-circle'
        this.snackbar=true;
        this.loading = false;
        this.close();
        this.readData(); //mengambil data
        this.resetForm();
        this.readDataBahanKosong()
        this.dialogConfirm = false;
        this.inputType = 'Tambah';
      }).catch(error => {
        this.error_message=error.response.data.message;
        this.color="red"
        this.iconSnackbar ='mdi-alert-circle'
        this.form.nama_bahan = null //reset form.nama_bahan
        this.snackbar=true;
        this.loading = false;
      })
    },

    deleteHandler(item){
      this.deleteId = item.id_bahan;
      this.form.nama_bahan = item.nama_bahan
      this.dialogConfirm = true;
    },

    editHandler(item){
      this.inputType = 'Ubah';
      this.editId = item.id_bahan;
      this.form.nama_bahan = item.nama_bahan
      this.form.jumlah_stok = item.jumlah_stok
      this.form.jumlah_per_sajian = item.jumlah_per_sajian
      this.form.unit = item.unit
      this.dialog = true;
    },

    stokMasukHandler(item){
      this.inputType = 'Tambah Stok';
      this.formMasuk.id_bahan = item.id_bahan
      this.formMasuk.jumlah = item.jumlah
      this.formMasuk.harga = item.harga
      this.dialogStok = true;
    },

    stokKeluarHandler(item){
      this.inputType = 'Buang Stok';
      this.formKeluar.id_bahan = item.id_bahan
      this.formKeluar.jumlah = item.jumlah
      this.formKeluar.status = item.status
      this.dialogStok = true;
    },

    close() {
      this.$v.$reset()
      this.dialogConfirm = false
      this.dialog = false
      this.dialogStok = false
      this.inputType = 'Tambah';
      this.form.nama_bahan = null //reset form.nama_bahan
    },

    cancel() {
      this.$v.$reset()
      this.resetForm();
      this.readData();
      this.dialog = false;
      this.dialogStok = false
      this.inputType = 'Tambah';
      this.form.nama_bahan = null //reset form.nama_bahan
    },

    resetForm() {
      this.$v.$reset()
      this.form = {
        nama_bahan: '',
        jumlah_stok: null,
        jumlah_per_sajian: null,
        unit: '',
      }
      this.formMasuk= {
        id_bahan: null,
        jumlah: null,
        harga: null,
      }
      this.formKeluar= {
        id_bahan: null,
        jumlah: null,
        status: '',
      }
    },
  },

  mounted() {
    this.loadingData = true
    this.readData()
    this.readDataBahanKosong()
    console.log(this.$v.formMasuk)
  },
}
</script>

<style scoped>
  label.v-label.theme--light {
    margin-bottom: 0!important;
  }
</style>