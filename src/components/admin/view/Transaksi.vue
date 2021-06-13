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
          <v-spacer></v-spacer>
          <v-btn color="#37A37B" @click="dialog = true" dark class="mr-3 px-4 py-5 rounded-lg font-weight-bold" elevation="0" style="font-size: 14px">
            <v-icon class="mr-3 ">
              mdi-plus
            </v-icon>
            Tambah Transaksi
          </v-btn>
        </v-card-title>

        <v-data-table
            :headers="headers" :items="transaksis" :search="search"
            :loading="loadingData" loading-text="Data sedang dimuat..."
        >

          <template v-slot:item.payment_method="{ item }">
            <v-chip v-if="item.payment_method === 'credit/debit card'" color="accent" outlined>Kredit/Debit</v-chip>
            <v-chip v-else color="#2196F3" outlined>Cash</v-chip>
          </template>

          <template v-slot:item.no_kartu="{ item }">
            <span v-if="item.no_kartu === null" > - </span>
            <span v-else >{{ item.no_kartu }}</span>
          </template>

          <template v-slot:item.no_verifikasi="{ item }">
            <span v-if="item.no_verifikasi === null" > - </span>
            <span v-else >{{ item.no_verifikasi }}</span>
          </template>

          <template v-slot:item.nama_customer="{ item }">
            <span>
              {{ titleCase(item.nama_customer) }}
            </span>
          </template>

          <template v-slot:item.waktu_transaksi="{ item }">
            <span>
              {{  moment(item.waktu_transaksi).format("DD-MM-YYYY h:m:s") }} WIB
            </span>
          </template>

          <template v-slot:item.total="{ item }">
            <span>
              Rp. {{ formatPrice(item.total) }}
            </span>
          </template>

          <template v-slot:item.actions="{ item }">
            <v-tooltip bottom>
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                    class="mr-2"
                    rounded
                    color="accent"
                    x-small
                    icon
                    v-bind="attrs"
                    v-on="on"
                    @click="printHandler(item)"
                >
                  <v-icon>
                    mdi-cloud-print
                  </v-icon>
                </v-btn>
              </template>
              <span>Cetak Struk</span>
            </v-tooltip>
          </template>

        </v-data-table>

        <v-dialog v-model="dialog" persistent max-width="600px">
          <v-card class="px-5 py-5">
            <v-card-title>
              <span class="headline font-weight-bold">Tambah Data Transaksi</span>
            </v-card-title>

            <v-card-text class="pt-7">
              <v-row class="pt-0">
                <v-col class="pb-0">
                  <v-autocomplete
                      outlined
                      rounded
                      class="rounded-lg"
                      v-model="form.payment_method"
                      :items="listPaymentMethod"
                      item-value="key"
                      item-text="name"
                      label="Metode Bayar"
                      required
                      :error-messages="paymentErrors"
                      @input="$v.form.payment_method.$touch()"
                      @blur="$v.form.payment_method.$touch()"
                  >
                    <template v-slot:prepend-inner>
                      <v-icon class="mr-5">mdi-credit-card-multiple-outline</v-icon>
                    </template>
                  </v-autocomplete>
                </v-col>

                <v-col class="pb-0">
                  <v-autocomplete
                      outlined
                      rounded
                      class="rounded-lg"
                      v-model="form.id_kartu"
                      :items="kartus"
                      item-value="id_kartu"
                      item-text="no_kartu"
                      label="Nomor Kartu"
                      required
                      :disabled="isKartu(form.payment_method)"
                      clearable
                  >
                    <template v-slot:prepend-inner>
                      <v-icon class="mr-5">mdi-credit-card-multiple-outline</v-icon>
                    </template>
                  </v-autocomplete>
                </v-col>
              </v-row>

              <v-row class="pt-0">
                <v-col class="pb-0">
                  <v-autocomplete
                      outlined
                      rounded
                      class="rounded-lg"
                      v-model="form.id_reservasi"
                      :items="reservasis"
                      item-value="id_reservasi"
                      item-text="created_at"
                      label="Tanggal Membuat Reservasi"
                      required
                      :error-messages="reservasiErrors"
                      @input="$v.form.id_reservasi.$touch()"
                      @blur="$v.form.id_reservasi.$touch()"
                  >
                    <template v-slot:prepend-inner>
                      <v-icon class="mr-5">mdi-credit-card-multiple-outline</v-icon>
                    </template>
                  </v-autocomplete>
                </v-col>
                <v-col class="pb-0">
                  <v-autocomplete
                      outlined
                      rounded
                      class="rounded-lg"
                      v-model="form.id_kasir"
                      :items="pegawais"
                      item-value="id_pegawai"
                      item-text="nama_pegawai"
                      label="Nama Kasir"
                      required
                      :error-messages="pegawaiErrors"
                      @input="$v.form.id_kasir.$touch()"
                      @blur="$v.form.id_kasir.$touch()"
                  >
                    <template v-slot:prepend-inner>
                      <v-icon class="mr-5">mdi-credit-card-multiple-outline</v-icon>
                    </template>
                  </v-autocomplete>
                </v-col>
              </v-row>

              <v-row>
                <v-col>
                  <v-text-field
                      outlined
                      rounded
                      class="rounded-lg"
                      v-model="form.no_verifikasi"
                      label="No. Verifikasi"
                      required
                      type="number"
                      :disabled="isKartu(form.payment_method)"
                      clearable
                  >
                    <template v-slot:prepend-inner>
                      <v-icon class="mr-5">mdi-credit-card-multiple-outline</v-icon>
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
              <v-btn color="primary" elevation="0" @click="setForm" :loading="loadingData" class="ml-3 px-9 py-6 font-weight-bold">
                Save
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>

        <v-dialog v-model="dialogPrint" persistent max-width="600px">
          <v-card>
            <v-container>

              <div id="testHtml">
                <v-card-title class="pt-6 text-left">
                  <v-img :src="require('../../../assets/logoSidebar.svg')" max-width="180" class="mx-auto"></v-img>
                </v-card-title>
                <v-card-text class="px-8 pt-5 text-center">
                  <v-row class="pb-0">
                    <v-col class="pb-0 pr-0 text-left">
                      <span> <b>Receipt #</b></span>
                    </v-col>
                    <v-col class="pb-0 pl-0 text-left">
                      <span> {{ this.struk.id_transaksi }}</span>
                    </v-col>
                    <v-col class="pb-0 pr-0 text-right">
                      <span> <b>Date</b></span>
                    </v-col>
                    <v-col class="pb-0 pl-0 text-right">
                      <span> {{ moment(new Date()).format('MMM DD, YYYY') }}</span>
                    </v-col>
                  </v-row>

                  <v-row class="pb-0">
                    <v-col class="pb-0 pr-0 text-left">
                      <span> <b>Kasir </b> </span>
                    </v-col>
                    <v-col class="pb-0 pl-0 text-left">
                      <span>{{ this.struk.nama_pegawai }}</span>
                    </v-col>
                    <v-col class="pb-0 pr-0 text-right">
                      <span> <b>Time</b></span>
                    </v-col>
                    <v-col class="pb-0 pl-0 text-right">
                      <span> {{ moment(new Date()).format('HH:mm') }} WIB</span>
                    </v-col>
                  </v-row>

                  <v-row class="pb-0">
                    <v-col class="pb-0 pr-0 text-left">
                      <span> <b>Table #</b> </span>
                    </v-col>
                    <v-col class="pb-0 pl-0 text-left">
                      <span>{{ this.struk.no_meja }}</span>
                    </v-col>
                    <v-col class="pb-0 pr-0 text-right">
                      <span> <b>Customer</b></span>
                    </v-col>
                    <v-col class="pb-0 pl-0 text-right">
                      <span > {{ this.struk.nama_customer }} </span>
                    </v-col>
                  </v-row>
                </v-card-text>
                <v-card-text class="px-8 pt-5 text-center">
                  <v-data-table :headers="headersDetail" :items="detailOrders" hide-default-footer
                                :loading="load" loading-text="Data sedang dimuat..."
                                class="pb-6">
                    <template v-slot:item.harga="{ item }">
                      <span>
                        Rp. {{ formatPrice(item.harga) }}
                      </span>
                    </template>

                    <template v-slot:item.subtotal_qty="{ item }">
                      <span>
                        Rp. {{ formatPrice(item.subtotal_qty) }}
                      </span>
                    </template>
                  </v-data-table >

                  <v-row class="pb-0 ">
                    <v-col cols="8" class="pb-0 pr-0 text-right">
                      <span> Subtotal </span>
                    </v-col>
                    <v-col cols="4" class="pb-0 pl-11 text-left">
                      <span>Rp. {{ formatPrice(this.struk.subtotal) }}</span>
                    </v-col>
                  </v-row>
                  <v-row class="pb-0 ">
                    <v-col cols="8" class="pb-0 pr-0 text-right">
                      <span> Service 5%</span>
                    </v-col>
                    <v-col cols="4" class="pb-0 pl-11 text-left">
                      <span > Rp. {{ formatPrice(this.struk.service) }} </span>
                    </v-col>
                  </v-row>
                  <v-row class="pb-0 ">
                    <v-col cols="8" class="pb-0 pr-0 text-right">
                      <span> Tax 10%</span>
                    </v-col>
                    <v-col cols="4" class="pb-0 pl-11 text-left">
                      <span > Rp. {{ formatPrice(this.struk.tax) }} </span>
                    </v-col>
                  </v-row>
                  <v-row class="pb-0 ">
                    <v-col cols="8" class="pb-0 pr-0 text-right">
                      <span> <b>Total</b></span>
                    </v-col>
                    <v-col cols="4" class="pb-0 pl-11 text-left">
                      <span > <b>Rp. {{ formatPrice(this.struk.total) }}</b> </span>
                    </v-col>
                  </v-row>

<!--                  <v-row class="mx-auto">-->
<!--                    <span-->
<!--                        class="body-1 text&#45;&#45;primary font-weight-bold mx-auto"-->
<!--                        style="font-family: 'Open Sans', sans-serif !important;"-->
<!--                    >-->
<!--                      Printed {{ moment(new Date()).format('MMM DD, YYYY HH:mm') }} WIB-->
<!--                    </span>-->
<!--                  </v-row>-->
<!--                  <v-row class="mx-auto pt-3">-->
<!--                  <span-->
<!--                      class="text&#45;&#45;primary mx-auto"-->
<!--                      style="font-family: 'Open Sans', sans-serif !important;"-->
<!--                  >-->
<!--                    Printed by {{ this.printedBy }}-->
<!--                  </span>-->
<!--                  </v-row>-->
                </v-card-text>
              </div>
              <v-card-actions class="pt-10">
                <v-btn color="secondary" class="mx-3 mb-3 px-5 py-3 font-weight-bold" :loading="loadingData" elevation="0" dark text @click="printPdf">
                  Print PDF
                </v-btn>
                <v-spacer></v-spacer>
                <v-btn color="grey darken-1" class="mx-3 mb-3 px-5 py-3 font-weight-bold" elevation="0" dark text @click="close">
                  Close
                </v-btn>
              </v-card-actions>


            </v-container>
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
        </v-snackbar>

      </v-card>
    </v-container>
  </div>
</template>

<script>
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas"
import { required} from "vuelidate/lib/validators";
import moment from "moment";

export default {
  name: "Transaksi",
  validations: {
    form: {
      id_reservasi: { required,  },
      id_kasir: { required,  },
      payment_method: { required,  },
    }
  },

  data() {
    return {
      currentEmail:localStorage.getItem('email'),
      printedBy: localStorage.getItem('nama'),
      menu: false,
      modal: false,
      menu2: false,
      no: 1,
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
      dialogPrint : false,
      dialogConfirm: false,
      headers: [
        { text: "ID Transaksi", value: "id_transaksi",filterable: false}, // ditambah waktu_order pas nampil
        { text: "No. Meja", value: "no_meja", width: 70, sortable: false},
        { text: "Nama Customer",
          align: "start",
          value: "nama_customer" },
        { text: "Metode Pembayaran", value: "payment_method",filterable: false},
        { text: "No. Kartu", value: "no_kartu", filterable:false},
        { text: "Kode Verifikasi", value: "no_verifikasi", filterable:false},
        { text: "Nama Kasir", value: "nama_pegawai", filterable:false},
        { text: "Waktu Transaksi", value: "waktu_transaksi", filterable:false},
        { text: "Total Pembayaran", value: "total", filterable:false},
        { value: "actions", filterable: false, sortable:false}
      ],
      headersDetail: [
        { text: "Qty", value: "qty",filterable: false, sortable: false}, // ditambah waktu_order pas nampil
        { text: "Nama Menu", value: "nama_menu", filterable: false, sortable: false},
        { text: "Harga", value: "harga",filterable: false,sortable: false},
        { text: "Subtotal", value: "subtotal_qty", filterable:false, sortable: false},
      ],
      transaksi: new FormData,
      transaksis: [],
      pegawais:[],
      reservasis:[],
      kartus:[],
      struks:[],
      detailOrders:[],
      listPaymentMethod:[
        { key:'cash', name:'Cash' },
        { key:'credit/debit card', name:'Credit/Debit' }
      ],
      form: {
        id_transaksi: null,
        id_reservasi: null,
        id_kasir: null,
        id_kartu: null,
        no_verifikasi: '',
        payment_method: '',
      },
      editId: '',
      editedItem: {
        id_transaksi: null,
        id_reservasi: null,
        id_kasir: null,
        id_kartu: null,
        no_verifikasi: '',
        payment_method: '',
      },
      struk: {
        id_transaksi: null,
        id_reservasi: null,
        service: null,
        tax: null,
        subtotal: null,
        total: null,
        no_meja: '',
        nama_customer: '',
        nama_pegawai: '',
      },
    };
  },
  computed: {
    formTitle() {
      return this.inputType
    },

    // validations
    paymentErrors () {
      const errors = []
      if (!this.$v.form.payment_method.$dirty) return errors
      !this.$v.form.payment_method.required && errors.push('Metode bayar harus diisi.')
      return errors
    },
    reservasiErrors () {
      const errors = []
      if (!this.$v.form.id_reservasi.$dirty) return errors
      !this.$v.form.id_reservasi.required && errors.push('Reservasi harus diisi.')
      return errors
    },
    pegawaiErrors () {
      const errors = []
      if (!this.$v.form.id_kasir.$dirty) return errors
      !this.$v.form.id_kasir.required && errors.push('Nama kasir harus diisi.')
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

    isKartu(status){
      return status !== 'credit/debit card';
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
      // console.log(this.$v)
      if(!this.$v.$error) {
        this.loading = true
        this.save()
      }
    },

    readDataPegawai(){
      var url = this.$api + '/pegawai/kasir'
      this.$http.get(url, {
        headers: {
          'Authorization': 'Bearer ' + localStorage.getItem('token')
        }
      }).then(response => {
        this.load = false
        this.pegawais = response.data.data
      })
    },

    readDataReservasi(){
      var url = this.$api + '/reservasi/aktif'
      this.$http.get(url, {
        headers: {
          'Authorization': 'Bearer ' + localStorage.getItem('token')
        }
      }).then(response => {
        this.load = false
        this.reservasis = response.data.data
      })
    },

    readDataKartu(){
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

    //read data product
    readData() {
      var url = this.$api + '/transaksi'
      this.$http.get(url, {
        headers: {
          'Authorization': 'Bearer ' + localStorage.getItem('token')
        }
      }).then(response => {
        this.transaksis = response.data.data
        console.log(this.transaksis)
        this.loadingData = false
      })
    },

    //read data transaksi struk
    readDataStruk(id) {
      var url = this.$api + '/transaksi/showStruk/' + id
      this.$http.get(url, {
        headers: {
          'Authorization': 'Bearer ' + localStorage.getItem('token')
        }
      }).then(response => {
        this.struks = response.data.data
        console.log(this.struks)
        this.loadingData = false
      })
    },

    //read data transaksi struk
    readDataDetailOrder(id) {
      var url = this.$api + '/detailOrder/showStruk/' + id
      this.$http.get(url, {
        headers: {
          'Authorization': 'Bearer ' + localStorage.getItem('token')
        }
      }).then(response => {
        this.detailOrders = response.data.data
        this.loadingData = false
      })
    },

    // simpan data transaksi
    save() {
      console.log("LIHAT INI "+this.form.id_reservasi)
      this.transaksi.append('id_transaksi', 'AKB-'+moment(new Date).format('DDMMYY')+'-'+this.no);
      this.transaksi.append('id_kasir', this.form.id_kasir);
      this.transaksi.append('id_reservasi', this.form.id_reservasi);
      this.transaksi.append('payment_method', this.form.payment_method);
      this.transaksi.append('no_verifikasi', this.form.no_verifikasi);
      if(this.form.id_kartu !== null)
        this.transaksi.append('id_kartu', this.form.id_kartu);

      var url = this.$api + '/transaksi/'
      this.$http.post(url, this.transaksi, {
        headers: {
          'Authorization': 'Bearer ' + localStorage.getItem('token')
        }
      }).then(response => {

        this.updateStatus() //update status reservasi
        this.error_message=response.data.message;
        console.log(this.error_message)
        this.color="green"
        this.iconSnackbar ='mdi-check-circle'
        this.snackbar=true;
        this.loading = false;
        this.close();
        this.readData(); //mengambil data
        this.readDataPegawai()
        this.readDataReservasi()
        this.readDataKartu()
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

    // ubah status reservasi
    updateStatus() {
      let newData = {
        status_reservasi: 'selesai',
      }
      var url = this.$api + '/reservasi/updateStatus/' + this.form.id_reservasi;

      this.$http.post(url, newData, {
        headers: {
          'Authorization': 'Bearer ' + localStorage.getItem('token')
        }
      }).then(response => {
        if(moment().isBetween(moment('00:00:00','HH:mm:ss'),moment('23:59:59','HH:mm:ss')))
          this.no++
        else
          this.no = 0

        console.log("variabel this.no = "+this.no)
        this.error_message=response.data.message
        this.color="green"
        this.iconSnackbar ='mdi-check-circle'
        this.snackbar=true;
        this.loading = false;
        this.close();
        this.inputType = 'Tambah';

      }).catch(error => {
        this.error_message=error.response.data.message;
        this.color="red"
        this.iconSnackbar ='mdi-alert-circle'
        this.snackbar=true;
        this.loading = false;
      })
    },

    // ubah data bahan
    // update() {
    //   let newData = {
    //     status_order: this.form.status_order,
    //   }
    //   var url = this.$api + '/transaksi/' + this.editId;
    //
    //   this.$http.post(url, newData, {
    //     headers: {
    //       'Authorization': 'Bearer ' + localStorage.getItem('token')
    //     }
    //   }).then(response => {
    //     this.error_message=response.data.message
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
    //     this.error_message=error.response.data.message;
    //     this.color="red"
    //     this.iconSnackbar ='mdi-alert-circle'
    //     this.snackbar=true;
    //     this.loading = false;
    //   })
    // },

    // editHandler(item){
    //   this.inputType = 'Ubah';
    //   // this.editId = item.id_detail;
    //   // if(item.status_order === 'sedang dimasak')
    //   //   this.form.status_order = 'siap disajikan'
    //   // else if(item.status_order === 'siap disajikan')
    //   //   this.form.status_order = 'sedang dimasak'
    //   this.loadingData = true
    //   this.update()
    // },

    printHandler(item){
      this.editId = item.no_transaksi
      this.readDataStruk(this.editId)
      this.readDataDetailOrder(this.editId)
      this.struk.id_transaksi = this.struks[0].id_transaksi
      this.struk.service= this.struks[0].service
      this.struk.tax= this.struks[0].tax
      this.struk.subtotal= this.struks[0].total-this.struks[0].tax-this.struks[0].service
      this.struk.total= this.struks[0].total
      this.struk.no_meja= this.struks[0].no_meja
      this.struk.nama_customer= this.struks[0].nama_customer
      this.struk.nama_pegawai= this.struks[0].nama_pegawai
      this.dialogPrint = true;
    },

    //fungsi download pdf
    printPdf(){
      this.loadingData = true
      var canvas = document.getElementById('testHtml')
      html2canvas(canvas).then(function (canvas){
        var imgData = canvas.toDataURL('image/png')
        var doc = new jsPDF('p', 'mm', 'A4')

        doc.addImage({
          imageData: imgData,
          format: 'PNG',
          x:30,
          y:8,
          compression:'NONE'})
        // doc.addImage(imgData,'PNG',150,150)
        doc.save('Struk.pdf')
      })
      setTimeout(() => this.loadingData = false, 3000);

    },

    close() {
      this.$v.$reset()
      this.dialogConfirm = false
      this.dialog = false
      this.dialogStok = false
      this.dialogPrint = false
      this.inputType = 'Tambah';

      this.editId = null
      this.struk.id_transaksi= null,
      this.struk.id_reservasi= null
      this.struk.service= null
      this.struk.tax= null
      this.struk.subtotal= null
      this.struk.total= null
      this.struk.no_meja= ''
      this.struk.nama_customer= ''
      this.struk.nama_pegawai= ''
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
        id_transaksi: '',
        no_meja: null,
        id_customer: null,
        id_kasir: null,
        no_verifikasi: '',
        payment_method: '',
      }
    },
  },

  mounted() {
    this.loadingData = true
    this.readData()
    this.readDataPegawai()
    this.readDataReservasi()
    this.readDataKartu()
  },
}
</script>

<style scoped>

</style>