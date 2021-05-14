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
          <v-btn color="#37A37B" @click="dialogAddCustomer = true" dark class="mr-3 px-4 py-5 rounded-lg font-weight-bold" elevation="0" style="font-size: 14px">
            <v-icon class="mr-3 ">
              mdi-plus
            </v-icon>
            Tambah Reservasi
          </v-btn>

        </v-card-title>

        <v-data-table :headers="headers" :items="reservasis" :search="search" :loading="load" loading-text="Data sedang dimuat..." sort-by="id_reservasi">
          <template v-slot:item.nama_customer="{ item }">
            <span>{{ titleCase(item.nama_customer) }}</span>
          </template>

          <template v-slot:item.nama_pegawai="{ item }">
            <span>{{ titleCase(item.nama_pegawai) }}</span>
          </template>

          <template v-slot:item.tgl_reservasi="{ item }">
            <span>
              {{ moment(item.tgl_reservasi).format("DD-MM-YYYY") }}
            </span>
          </template>

          <template v-slot:item.created_at="{ item }">
            <span>
              {{ moment(item.created_at).format("DD-MM-YYYY, HH:mm") }} WIB
            </span>
          </template>

          <template v-slot:item.sesi="{ item }">
            <v-chip v-if="item.sesi==='lunch'" dark color="orange darken-4">
              <span>{{ titleCase(item.sesi) }}</span>
            </v-chip>
            <v-chip v-else dark color="blue darken-2">
              <span>{{ titleCase(item.sesi) }}</span>
            </v-chip>
          </template>

          <template v-slot:item.status_reservasi="{ item }">
            <v-chip v-if="item.status_reservasi==='aktif'" outlined color="accent">
              <span>{{ titleCase(item.status_reservasi) }}</span>
            </v-chip>
            <v-chip v-else-if="item.status_reservasi==='non aktif'" outlined color="red ">
              <span>{{ titleCase(item.status_reservasi) }}</span>
            </v-chip>
            <v-chip v-else outlined color="blue darken-3">
              <span>{{ titleCase(item.status_reservasi) }}</span>
            </v-chip>
          </template>

          <template v-slot:[`item.actions`]="{ item }">
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
              <span>Cetak QR Code</span>
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


      <v-dialog v-model="dialog" persistent max-width="800px">
        <div>
<!--        <v-card class="px-5 py-5">-->
<!--          <v-card-title>-->
<!--            <span class="headline font-weight-bold">{{ formTitle }} Data Menu</span>-->
<!--          </v-card-title>-->

<!--          <v-card-text class="pt-7">-->
<!--            <v-select-->
<!--                outlined-->
<!--                rounded-->
<!--                class="rounded-lg"-->
<!--                v-model="form.id_customer"-->
<!--                label="Nama Customer"-->
<!--                required-->
<!--                :items="customers"-->
<!--                item-value="id_customer"-->
<!--                item-text="nama_customer"-->
<!--                :error-messages="customerErrors"-->
<!--                @input="$v.form.id_customer.$touch()"-->
<!--                @blur="$v.form.id_customer.$touch()"-->
<!--            >-->
<!--              <template v-slot:prepend-inner>-->
<!--                <v-icon class="mr-5" >mdi-account-supervisor-outline</v-icon>-->
<!--              </template>-->
<!--            </v-select>-->

<!--            <v-row class="pt-0">-->
<!--              <v-col class="pb-0">-->
<!--                <v-select-->
<!--                    outlined-->
<!--                    rounded-->
<!--                    class="rounded-lg"-->
<!--                    v-model="form.id_waiter"-->
<!--                    label="Nama Waiter"-->
<!--                    required-->
<!--                    :items="pegawais"-->
<!--                    item-value="id_pegawai"-->
<!--                    item-text="nama_pegawai"-->
<!--                    :error-messages="pegawaiErrors"-->
<!--                    @input="$v.form.id_waiter.$touch()"-->
<!--                    @blur="$v.form.id_waiter.$touch()"-->
<!--                >-->
<!--                  <template v-slot:prepend-inner>-->
<!--                    <v-icon class="mr-5">mdi-account-group-outline</v-icon>-->
<!--                  </template>-->
<!--                </v-select>-->
<!--              </v-col>-->
<!--              <v-col class="pb-0">-->
<!--                <v-select-->
<!--                    outlined-->
<!--                    rounded-->
<!--                    class="rounded-lg"-->
<!--                    v-model="form.no_meja"-->
<!--                    label="No. Meja"-->
<!--                    required-->
<!--                    :items="mejaTersedia"-->
<!--                    item-value="no_meja"-->
<!--                    item-text="no_meja"-->
<!--                    :disabled="disableMeja(form.tgl_reservasi,form.sesi)"-->
<!--                    :error-messages="mejaErrors"-->
<!--                    @input="$v.form.no_meja.$touch()"-->
<!--                    @blur="$v.form.no_meja.$touch()"-->
<!--                >-->
<!--                  <template v-slot:prepend-inner>-->
<!--                    <v-icon class="mr-5">mdi-table-chair</v-icon>-->
<!--                  </template>-->
<!--                </v-select>-->
<!--              </v-col>-->
<!--            </v-row>-->

<!--            <v-row class="pt-0 mt-0">-->
<!--              <v-col class="pb-0">-->
<!--                <v-menu-->
<!--                    v-model="menu"-->
<!--                    :close-on-content-click="false"-->
<!--                    :nudge-right="40"-->
<!--                    transition="scale-transition"-->
<!--                    offset-y-->
<!--                    min-width="auto"-->
<!--                >-->
<!--                  <template v-slot:activator="{ on, attrs }">-->
<!--                    <v-text-field-->
<!--                        outlined-->
<!--                        rounded-->
<!--                        hide-details-->
<!--                        class="rounded-lg"-->
<!--                        v-model="form.tgl_reservasi"-->
<!--                        label="Tanggal Reservasi"-->
<!--                        readonly-->
<!--                        v-bind="attrs"-->
<!--                        v-on="on"-->
<!--                        :error-messages="tanggalErrors"-->
<!--                        @input="$v.form.tgl_reservasi.$touch()"-->
<!--                        @blur="$v.form.tgl_reservasi.$touch()"-->
<!--                    >-->
<!--                      <template v-slot:prepend-inner>-->
<!--                        <v-icon class="mr-5">mdi-calendar</v-icon>-->
<!--                      </template>-->
<!--                    </v-text-field>-->
<!--                  </template>-->
<!--                  <v-date-picker-->
<!--                      v-if="inputType==='Tambah'"-->
<!--                      v-model="form.tgl_reservasi"-->
<!--                      @input="menu = false"-->
<!--                      :min="new Date().toISOString().substr(0, 10)"-->
<!--                  ></v-date-picker>-->
<!--                  <v-date-picker-->
<!--                      v-else-if="inputType==='Ubah'"-->
<!--                      v-model="form.tgl_reservasi"-->
<!--                      @input="menu = false"-->
<!--                      :min="this.tgl_pesan"-->
<!--                  ></v-date-picker>-->
<!--                </v-menu>-->
<!--              </v-col>-->

<!--              <v-col class="pb-0">-->
<!--                <v-select-->
<!--                    outlined-->
<!--                    rounded-->
<!--                    class="rounded-lg"-->
<!--                    v-model="form.sesi"-->
<!--                    label="Sesi"-->
<!--                    required-->
<!--                    :items="sesiList"-->
<!--                    item-value="key"-->
<!--                    item-text="name"-->
<!--                    :error-messages="sesiErrors"-->
<!--                    @input="$v.form.sesi.$touch()"-->
<!--                    @blur="$v.form.sesi.$touch()"-->
<!--                >-->
<!--                  <template v-slot:prepend-inner>-->
<!--                    <v-icon class="mr-5">mdi-clock-time-eight-outline</v-icon>-->
<!--                  </template>-->
<!--                </v-select>-->
<!--              </v-col>-->
<!--            </v-row>-->

<!--          </v-card-text>-->

<!--          <v-card-actions class="pr-8 pt-9 pb-5">-->
<!--            <v-spacer></v-spacer>-->
<!--            <v-btn color="grey darken-1" text @click="cancel" class="ml-3 pa-6 font-weight-bold">-->
<!--              Cancel-->
<!--            </v-btn>-->
<!--            <v-btn color="primary" elevation="0" @click="setForm" class="px-9 py-6 font-weight-bold">-->
<!--              Save-->
<!--            </v-btn>-->
<!--          </v-card-actions>-->
<!--        </v-card>-->
        </div>

        <v-stepper v-model="e1">
          <v-container>
            <v-stepper-header class="elevation-0 py-5 px-5">
              <v-stepper-step
                  step="1"
              >
                Set Data
              </v-stepper-step>

              <v-divider></v-divider>

              <v-stepper-step
                  step="2"
              >
                Pick Table
              </v-stepper-step>
            </v-stepper-header>

            <v-stepper-items class="py-5 px-6">
              <v-stepper-content step="1">
                <v-card elevation="0">
                  <v-row class="pt-0 mt-0">
                    <v-col class="pb-0">
                      <v-select
                          outlined
                          rounded
                          class="rounded-lg"
                          v-model="form.id_customer"
                          label="Nama Customer"
                          required
                          :items="customers"
                          item-value="id_customer"
                          item-text="nama_customer"
                          :error-messages="customerErrors"
                          @input="$v.form.id_customer.$touch()"
                          @blur="$v.form.id_customer.$touch()"
                      >
                        <template v-slot:prepend-inner>
                          <v-icon class="mr-5" >mdi-account-supervisor-outline</v-icon>
                        </template>
                      </v-select>
                    </v-col>
                    <v-col>
                      <v-select
                          outlined
                          rounded
                          class="rounded-lg"
                          v-model="form.id_waiter"
                          label="Nama Waiter"
                          required
                          :items="pegawais"
                          item-value="id_pegawai"
                          item-text="nama_pegawai"
                          :error-messages="pegawaiErrors"
                          @input="$v.form.id_waiter.$touch()"
                          @blur="$v.form.id_waiter.$touch()"
                      >
                        <template v-slot:prepend-inner>
                          <v-icon class="mr-5">mdi-account-group-outline</v-icon>
                        </template>
                      </v-select>
                    </v-col>
                  </v-row>


                  <v-row class="pt-0 mt-0">
                    <v-col class="pb-0">
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
                              outlined
                              rounded
                              hide-details
                              class="rounded-lg"
                              v-model="form.tgl_reservasi"
                              label="Tanggal Reservasi"
                              readonly
                              v-bind="attrs"
                              v-on="on"
                              :error-messages="tanggalErrors"
                              @input="$v.form.tgl_reservasi.$touch()"
                              @blur="$v.form.tgl_reservasi.$touch()"
                          >
                            <template v-slot:prepend-inner>
                              <v-icon class="mr-5">mdi-calendar</v-icon>
                            </template>
                          </v-text-field>
                        </template>
                        <v-date-picker
                            v-if="inputType==='Tambah'"
                            v-model="form.tgl_reservasi"
                            @input="menu = false"
                            :min="new Date().toISOString().substr(0, 10)"
                        ></v-date-picker>
                        <v-date-picker
                            v-else-if="inputType==='Ubah'"
                            v-model="form.tgl_reservasi"
                            @input="menu = false"
                            :min="this.tgl_pesan"
                        ></v-date-picker>
                      </v-menu>
                    </v-col>

                    <v-col class="pb-0">
                      <v-select
                          outlined
                          rounded
                          class="rounded-lg"
                          v-model="form.sesi"
                          label="Sesi"
                          required
                          :items="sesiList"
                          item-value="key"
                          item-text="name"
                          :error-messages="sesiErrors"
                          @input="$v.form.sesi.$touch()"
                          @blur="$v.form.sesi.$touch()"
                      >
                        <template v-slot:prepend-inner>
                          <v-icon class="mr-5">mdi-clock-time-eight-outline</v-icon>
                        </template>
                      </v-select>
                    </v-col>
                  </v-row>

                </v-card>
                <v-card-actions class="pt-15">
                  <v-spacer></v-spacer>
                  <v-btn class="ml-3 pa-6 font-weight-bold" color="grey darken-1" text @click="cancel">
                    Cancel
                  </v-btn>

                  <v-btn class="px-9 py-6 font-weight-bold" color="primary" elevation="0" :loading="loadingData" @click="nextStep(1,null)">
                    Continue
                  </v-btn>
                </v-card-actions>

              </v-stepper-content>

              <v-stepper-content step="2">
                <v-card elevation="0" class="pb-5">
                    <v-row class="pt-0 mt-0">
                      <v-col
                        v-for="item in mejas"
                        :key="item.no_meja"
                        cols="12"
                        sm="6"
                        md="4"
                        lg="3"
                        xl="3"
                      >
                        <v-card
                          elevation="0" v-if="item.status_meja==='tersedia'"
                          color="accent"
                          dark
                          min-width="150px"
                          @click="setNoMeja(item)"
                        >
                          <v-card-title class="heading font-weight-bold">
                            {{ item.no_meja }}
                          </v-card-title>
                          <v-card-subtitle>
                            {{ titleCase(item.status_meja) }}
                          </v-card-subtitle>
                        </v-card>
                        <v-card elevation="0" v-else color="red" dark min-width="150px">
                          <v-card-title class="subheading font-weight-bold">
                            {{ item.no_meja }}
                          </v-card-title>
                          <v-card-subtitle>
                            {{ titleCase(item.status_meja) }}
                          </v-card-subtitle>
                        </v-card>
                      </v-col>
                    </v-row>
                </v-card>
                <v-card-actions class="pt-15">
                  <span>Meja terpilih : <b v-show="this.form.no_meja===null">-</b><b>{{ this.form.no_meja }}</b></span>
                  <v-spacer></v-spacer>
                  <v-btn class="ml-3 pa-6 font-weight-bold" color="grey darken-1" text @click="e1=1">
                    Back
                  </v-btn>
                  <v-btn class="px-9 py-6 font-weight-bold" color="primary" elevation="0" :loading="loadingData" @click="nextStep(2)">
                    Submit
                  </v-btn>
                </v-card-actions>
              </v-stepper-content>

            </v-stepper-items>
          </v-container>
        </v-stepper>


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

<!--      dialog confirm hapus-->
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
            <v-btn color="grey darken-1" class="mb-3 pa-6 font-weight-bold"  text @click="close">
              Cancel
            </v-btn>
            <v-btn color="red" class="mx-3 mb-3 px-9 py-6 font-weight-bold" :loading="loadingData" elevation="0" dark @click="deleteData" >
              Delete
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

<!--      dialog print qrcode-->
      <v-dialog v-model="dialogPrint" persistent max-width="400px">
        <v-card>
          <v-container>

            <div id="testHtml">
              <v-card-title class="pt-6 text-center align-content-center align-center">
                <v-img :src="require('../../../assets/logoSidebar.svg')" max-width="180" class="mx-auto"></v-img>
              </v-card-title>
              <v-card-text class="px-12 pt-5 text-center">
                <div id="qr_code">
                  <QRCanvas :options="options" />
                </div>
              </v-card-text>
              <v-card-text class="px-12 pt-5 text-center">
                <v-row class="mx-auto">
                  <span
                    class="body-1 text--primary font-weight-bold mx-auto"
                    style="font-family: 'Open Sans', sans-serif !important;"
                  >
                    Printed {{ moment(new Date()).format('MMM DD, YYYY HH:mm') }} WIB
                  </span>
                </v-row>
                <v-row class="mx-auto pt-3">
                  <span
                      class="text--primary mx-auto"
                      style="font-family: 'Open Sans', sans-serif !important;"
                  >
                    Printed by {{ this.printedBy }}
                  </span>
                </v-row>
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

      <v-dialog v-model="dialogAddCustomer" persistent max-width="400px">
        <v-card>
          <v-card-title class="pt-6">
            <v-icon color="orange darken-2" class="h3 mr-4" size="30">mdi-alert-circle</v-icon>
            <span class="h3 font-weight-bold orange--text">Warning!</span>
          </v-card-title>
          <v-card-text>
            Apakah customer <b>sudah terdaftar?</b> Jika belum silakan membuat data customer.
          </v-card-text>
          <v-card-actions class="pt-4">
            <v-spacer></v-spacer>
            <v-btn color="grey darken-2" class="mb-3 pa-6 font-weight-bold" text @click="addCustomerFirst">
              Belum
            </v-btn>
            <v-btn color="primary" class="mx-3 mb-3 px-6 py-6 font-weight-bold" elevation="0" dark @click="openDialog" >
              Sudah
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

    </v-container>
  </div>
</template>


<script>
  import { jsPDF } from "jspdf";
  import html2canvas from "html2canvas"
  import { QRCanvas } from 'qrcanvas-vue' //import library buat qr code
  import moment from "moment"; //library buat ganti format waktu/tanggal
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
    //import component QR
    components: {
      QRCanvas,
    },
    name: "Menu",
    validations: {
      form: {
        id_waiter: {required},
        id_customer: {required},
        // no_meja: {required},
        tgl_reservasi: {required},
        sesi: {required},
      }
    },

    data() {
      return {
        // rulesInput: [
        //   value => !value || value.size < 5000000 || 'Harus dalam format .jpg, .png, atau .bmp dibawah 5 MB',
        // ],
        e1: 1,
        idMejaDelete: null,
        printedBy:localStorage.getItem('nama'),
        qrText: '',
        menu: false,
        modal: false,
        menu2: false,
        loadingData: false,
        inputType: 'Tambah',
        load: false,
        snackbar: false,
        error_message: '',
        color: '',
        iconSnackbar:'',
        search: null,
        dialog: false,
        dialogPrint : false,
        dialogConfirm: false,
        dialogAddCustomer: false,
        headers: [
          { text: "ID", value: "id_reservasi", width:70 },
          { text: "Nama Customer",
            align: "start",
            value: "nama_customer",width: 140 },
          { text: "No. Meja", value: "no_meja", sortable: false,width: 100,filterable: false},
          { text: "Tgl Reservasi", value: "tgl_reservasi",width: 120,filterable: false},
          { text: "Sesi", value:"sesi",width: 80,filterable: false },
          { text: "Tgl Pesan", value: "created_at",width: 140},
          { text: "Status", value: "status_reservasi",width: 110},
          { text: "Waiter", value: "nama_pegawai",width: 100, sortable: false  },
          { value: 'actions', sortable: false, width:100,filterable: false },
        ],
        reservasi: new FormData,
        meja: new FormData,
        reservasis: [],
        customers:[],
        mejas:[],
        mejaTersedia:[],
        pegawais:[],
        tgl_pesan:null,
        sesiList: [
          { key: 'lunch', name: 'Lunch'},
          { key: 'dinner', name: 'Dinner'},
        ],
        form: {
          id_waiter: null,
          id_customer: null,
          no_meja: null,
          tgl_reservasi: null,
          sesi: null,
        },
        editId: '',
        editedItem: {
          id_waiter: null,
          id_customer: null,
          no_meja: null,
          tgl_reservasi: null,
          sesi: null,
        },
      };
    },
    computed: {
      //method buat settingan generate QR code
      options() {
        return {
          cellSize: 4,
          data: this.qrText,
        };
      },
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
        if (!this.$v.form.sesi.$dirty) return errors
        !this.$v.form.sesi.required && errors.push('Harap masukkan sesi.')
        return errors
      },
      customerErrors () {
        const errors = []
        if (!this.$v.form.id_customer.$dirty) return errors
        !this.$v.form.id_customer.required && errors.push('Nama customer harus diisi.')
        return errors
      },
      pegawaiErrors() {
        const errors = []
        if (!this.$v.form.id_waiter.$dirty) return errors
        !this.$v.form.id_waiter.required && errors.push('Nama waiter harus diisi.')
        return errors
      },
      // mejaErrors() {
      //   const errors = []
      //   if (!this.$v.form.no_meja.$dirty) return errors
      //   !this.$v.form.no_meja.required && errors.push('No. meja harus diisi.')
      //   return errors
      // },
    },

    methods: {
      moment,

      nextStep(step){
        if(step===1)
        {
          this.$v.$touch()
          console.log(this.$v)
          if(!this.$v.$error) {
            this.loadingData = true
            this.readDataMeja()
            this.readDataMejaPerTanggal().then(() => {
              this.selectMeja()
            })
          }
        }
        if(step===2)
        {
          this.setForm()
        }
      },
      setNoMeja(item){
        if(item.status_meja==='tersedia'){
          this.form.no_meja=item.no_meja
        }
      },

      disableMeja(tgl,sesi){
        return !(tgl !== null && sesi !== null);
      },
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

      addCustomerFirst(){
        this.dialogAddCustomer = false
        this.$router.push({
          name: "customer",
        });
      },

      openDialog(){
        this.dialogAddCustomer = false
        this.dialog = true
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
          this.load = false
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
          this.load = false
          this.customers = response.data.data
        })
      },

      readDataPegawai(){
        var url = this.$api + '/pegawai/waiter'
        this.$http.get(url, {
          headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('token')
          }
        }).then(response => {
          this.load = false
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

      selectMeja(){
        for (let i = 0; i<this.mejaTersedia.length ; i++) {
          console.log(this.mejaTersedia.length)
          console.log(i)
          for (let j = 0; j < this.mejas.length; j++) {
            if(this.mejaTersedia[i].no_meja === this.mejas[j].no_meja)
            {
              this.mejas[j].status_meja = 'tidak tersedia'
            }
            console.log(this.mejas[j].status_meja)
          }
        }
        this.e1=2
        this.loadingData = false
      },

      async readDataMejaPerTanggal(){
        let newData = {
          tgl_reservasi: this.form.tgl_reservasi,
          sesi: this.form.sesi,
        }
        var url = this.$api + '/reservasi/select'
        await this.$http.post(url, newData, {
          headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('token')
          }
        }).then(response => {
          this.loadingData = false
          this.mejaTersedia = response.data.data
          console.log(this.mejaTersedia.length)
        })
      },

      //simpan data produk
      save() {
        this.reservasi.append('id_waiter', this.form.id_waiter);
        this.reservasi.append('id_customer', this.form.id_customer);
        this.reservasi.append('no_meja', this.form.no_meja);
        this.reservasi.append('tgl_reservasi', this.form.tgl_reservasi);
        this.reservasi.append('sesi', this.form.sesi);
        this.reservasi.append('status_reservasi', 'non aktif');

        var url = this.$api + '/reservasi/'
        this.loadingData = true
        this.$http.post(url, this.reservasi, {
          headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('token')
          }
        }).then(response => {
          // if(this.form.tgl_reservasi === moment())
          //   this.saveMeja(this.form.no_meja)
          this.error_message=response.data.message;
          this.color="green"
          this.iconSnackbar ='mdi-check-circle-outline'
          this.snackbar=true;
          this.loadingData = false;
          this.close();
          this.readData(); //mengambil data
          this.resetForm();
        }).catch(error => {
          console.log(Object.values(error.response.data.message))
          this.error_message=error.response.data.message;
          this.color="red"
          this.iconSnackbar ='mdi-alert-circle-outline'
          this.snackbar=true;
          this.loadingData = false;
        })
      },

      //simpan data meja kalo update/tambah
      saveMeja(id) {
        let newData = {
          status_meja: 'tidak tersedia',
        }
        var url = this.$api + '/meja/' + id;

        this.load = true

        this.$http.put(url, newData, {
              headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('token')
              }
        }).then(response => {
          this.error_message=response.data.message;
          console.log(this.form.no_meja)
          this.color="green"
          this.iconSnackbar ='mdi-check-circle-outline'
          this.snackbar=true;
          this.load = false;
          this.close();
          this.readData(); //mengambil data
          this.resetForm();
        }).catch(error => {
          console.log(Object.values(error.response.data.message))
          console.log()
          this.error_message=error.response.data.message;
          this.color="red"
          this.iconSnackbar ='mdi-alert-circle-outline'
          this.snackbar=true;
          this.loadingData = false;
        })
      },

      //simpan data meja kalo delete reservasi
      saveMejaDelete(id) {
        let newData = {
          status_meja: 'tersedia',
        }
        var url = this.$api + '/meja/' + id;

        this.loadingData = true

        this.$http.put(url, newData, {
          headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('token')
          }
        }).then(response => {
          this.error_message=response.data.message;
          console.log(this.form.no_meja)
          this.color="green"
          this.iconSnackbar ='mdi-check-circle-outline'
          this.snackbar=true;
          this.loadingData = false;
          this.close();
          this.readData(); //mengambil data
          this.resetForm();
        }).catch(error => {
          console.log(Object.values(error.response.data.message))
          console.log()
          this.error_message=error.response.data.message;
          this.color="red"
          this.iconSnackbar ='mdi-alert-circle-outline'
          this.snackbar=true;
          this.loadingData = false;
        })
      },

      //ubah data karyawan
      update() {
        let newData = {
          id_waiter: this.form.id_waiter,
          id_customer: this.form.id_customer,
          no_meja: this.form.no_meja,
          tgl_reservasi: this.form.tgl_reservasi,
          sesi: this.form.sesi,
        }
        var url = this.$api + '/reservasi/' + this.editId;

        this.loadingData = true

        this.$http.put(url, newData, {
          headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('token')
          }
        }).then(response => {
          // this.saveMeja(this.form.no_meja)
          this.error_message=response.data.message;
          this.color="green"
          this.iconSnackbar ='mdi-check-circle-outline'
          this.snackbar=true;
          this.loadingData = false;
          this.close();
          this.readData(); //mengambil data
          this.resetForm();
          this.inputType = 'Tambah';

        }).catch(error => {
          this.error_message=error.response.data.message;
          this.color="red"
          this.iconSnackbar ='mdi-alert-circle-outline'
          this.snackbar=true;
          this.loadingData = false;
        })
      },

      //hapus data produk
      deleteData() {
        this.loadingData = true
        //mengahapus data
        var url = this.$api + '/reservasi/' + this.deleteId;

        //data dihapus berdasarkan id
        this.$http.delete(url, {
          headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('token')
          }
        }).then(response => {
          // this.saveMejaDelete(this.idMejaDelete)
          this.error_message=response.data.message;
          this.color="green"
          this.snackbar=true;
          this.iconSnackbar ='mdi-check-circle-outline'
          this.loadingData = false;
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
          this.loadingData = false;
        })
      },

      editHandler(item){
        this.inputType = 'Ubah';
        this.editId = item.id_reservasi;
        this.form.id_waiter= item.id_waiter
        this.form.id_customer= item.id_customer
        this.form.no_meja= item.no_meja
        this.form.tgl_reservasi= item.tgl_reservasi
        this.form.sesi= item.sesi
        this.tgl_pesan = item.created_at
        this.dialog = true;
      },

      deleteHandler(item){
        this.deleteId = item.id_reservasi
        this.idMejaDelete = item.no_meja
        this.dialogConfirm = true;
      },

      //handler buka dialog qr code
      printHandler(item){
        this.editId = item.id_reservasi
        this.qrText = item.id_reservasi + ';' + item.nama_customer + ';' + item.no_meja + ';' + moment(new Date()).format('DD-MM-YYYY HH:mm')
        // let tableWaiter= this.pegawais.find(pegawais => pegawais.id_pegawai === item.id_waiter)
        // console.log(tableWaiter.nama_pegawai)
        // this.printedBy = tableWaiter.nama_pegawai
        this.dialogPrint = true;
      },
      //fungsi download pdf
      printPdf(){
        this.loadingData = true
        var canvas = document.getElementById('testHtml')
        html2canvas(canvas).then(function (canvas){
          var imgData = canvas.toDataURL('image/png')
          var doc = new jsPDF('p', 'mm', 'A6')

          doc.addImage({
            imageData: imgData,
            format: 'PNG',
            x:3,
            y:8,
            compression:'NONE'})
          // doc.addImage(imgData,'PNG',150,150)
          doc.save('QR Code.pdf')
        })
        setTimeout(() => this.loadingData = false, 3000);

      },
      close() {
        this.$v.$reset()
        this.dialogPrint = false
        this.dialogConfirm = false
        this.dialog = false
        this.inputType = 'Tambah';
        this.e1=1
      },

      cancel() {
        this.$v.$reset()
        this.resetForm();
        this.readData();
        this.dialog = false;
        this.inputType = 'Tambah';
        this.e1=1
      },

      resetForm() {
        this.$v.$reset()
        this.form = {
          id_waiter: null,
          id_customer: null,
          no_meja: null,
          tgl_reservasi: null,
          sesi: null,
        };
      },
    },

    mounted() {
      this.load = true
      this.readData()
      this.readDataCustomer()
      this.readDataMeja()
      this.readDataPegawai()
    },
  }
</script>

<style scoped>

</style>