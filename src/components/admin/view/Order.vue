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
        </v-card-title>

        <v-data-table
            :headers="headers" :items="orders" :search="search"
            :loading="loadingData" loading-text="Data sedang dimuat..."
            :sort-by="['tgl_order','waktu_order']"
            :sort-desc="[true,true]"
        >

          <template v-slot:item.tgl_order="{ item }">
            <span>
              {{  moment(item.tgl_order).format("DD-MM-YYYY") }}, {{ item.waktu_order }} WIB
            </span>
          </template>

          <template v-slot:item.nama_menu="{ item }">
            <span>
              {{ titleCase(item.nama_menu) }}
            </span>
          </template>

          <template v-slot:item.jumlah_order="{ item }">
            <span>
              {{ formatPrice(item.jumlah_order) }} {{ item.unit }}
            </span>
          </template>

          <template v-slot:item.status_order="{ item }">
            <v-chip v-if="item.status_order === 'siap disajikan'" color="accent" outlined>Siap Disajikan</v-chip>
            <v-chip v-else color="red" outlined>Sedang Disiapkan</v-chip>
          </template>

          <template v-slot:item.actions="{ item }">
            <v-tooltip bottom>
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                    class="mr-2"
                    rounded
                    dark
                    x-small
                    color="#2196F3"
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
              <span>Ubah Status</span>
            </v-tooltip>
          </template>

        </v-data-table>


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

      </v-card>
    </v-container>
  </div>
</template>

<script>
import {minValue, numeric, required} from "vuelidate/lib/validators";
import moment from "moment";

export default {
  name: "Order",
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

  data() {
    return {
      currentEmail:localStorage.getItem('email'),
      menu: false,
      modal: false,
      menu2: false,
      no: 0,
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
        { text: "Waktu Order", value: "tgl_order",filterable: false}, // ditambah waktu_order pas nampil
        { text: "No. Meja", value: "no_meja"},
        { text: "Nama Menu",
          align: "start",
          value: "nama_menu" },
        { text: "Jumlah Pesanan", value: "jumlah_order",filterable: false},
        { text: "Status", value: "status_order", filterable:false},
        { value: "actions", filterable: false, sortable:false}
      ],
      order: new FormData,
      orders: [],
      form: {
        nama_bahan: '',
        jumlah_order: null,
        tgl_order: '',
        waktu_order: '',
        status_order: '',
      },
      editId: '',
      editedItem: {
        nama_bahan: '',
        jumlah_order: null,
        tgl_order: '',
        waktu_order: '',
        status_order: '',
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
  },

  methods: {
    moment,
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
      var url = this.$api + '/detailOrder/showOrder'
      this.$http.get(url, {
        headers: {
          'Authorization': 'Bearer ' + localStorage.getItem('token')
        }
      }).then(response => {
        this.orders = response.data.data
        this.loadingData = false
      })
    },

    //simpan data bahan
    // save() {
    //   this.bahan.append('nama_bahan', this.form.nama_bahan);
    //   this.bahan.append('jumlah_stok', this.form.jumlah_stok);
    //   this.bahan.append('jumlah_per_sajian', this.form.jumlah_per_sajian);
    //   this.bahan.append('unit', this.form.unit);
    //
    //   var url = this.$api + '/bahan/'
    //   this.$http.post(url, this.bahan, {
    //     headers: {
    //       'Authorization': 'Bearer ' + localStorage.getItem('token')
    //     }
    //   }).then(response => {
    //     this.error_message=response.data.message;
    //     console.log(this.error_message)
    //     this.color="green"
    //     this.iconSnackbar ='mdi-check-circle'
    //     this.snackbar=true;
    //     this.loading = false;
    //     this.close();
    //     this.readData(); //mengambil data
    //     this.readDataBahanKosong()
    //     this.resetForm();
    //   }).catch(error => {
    //     console.log(Object.values(error.response.data.message))
    //     this.error_message=error.response.data.message;
    //     console.log(typeof this.error_message)
    //     this.color="red"
    //     this.iconSnackbar ='mdi-alert-circle'
    //     this.snackbar=true;
    //     this.loading = false;
    //   })
    // },

    //ubah data bahan
    update() {
      let newData = {
        status_order: this.form.status_order,
      }
      var url = this.$api + '/detailOrder/status/' + this.editId;

      this.$http.post(url, newData, {
        headers: {
          'Authorization': 'Bearer ' + localStorage.getItem('token')
        }
      }).then(response => {
        this.error_message=response.data.message
        this.color="green"
        this.iconSnackbar ='mdi-check-circle'
        this.snackbar=true;
        this.loading = false;
        this.close();
        this.readData(); //mengambil data
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

    editHandler(item){
      this.inputType = 'Ubah';
      this.editId = item.id_detail;
      if(item.status_order === 'sedang dimasak')
        this.form.status_order = 'siap disajikan'
      else if(item.status_order === 'siap disajikan')
        this.form.status_order = 'sedang dimasak'
      this.loadingData = true
      this.update()
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
        jumlah_order: null,
        tgl_order: '',
        waktu_order: '',
        status_order: '',
      }
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