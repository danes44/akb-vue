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

        <v-data-table v-if="userRole==='Operasional Manager'"
                      :headers="headersManager"
                      :items="menus"
                      :search="search"
                      :loading="loadingData"
                      loading-text="Data sedang dimuat..." sort-by="id_menu">
          <template v-slot:item.nama_menu="{ item }">
            <v-list style="padding: 0;" dense class="list">
              <v-list-item class="pl-0">
                <v-list-item-avatar class="mr-3" rounded>
                  <v-btn icon>
                    <v-avatar v-if="item.str_gambar === null" size="40" rounded>
                      <v-img :src="require('../../../assets/dummy.png')"></v-img>
                    </v-avatar>

                    <v-avatar v-else size="40" rounded @click="showImage(item)">
                      <v-img :src="'http://localhost:8000'+item.str_gambar"></v-img>
                    </v-avatar>
                  </v-btn>
                </v-list-item-avatar>

                <v-list-item-content style="padding-top: 0; padding-bottom: 0; max-width: 140px;" class="float-right">
                  <v-list-item-title class="font-weight-bold text-truncate">{{ titleCase(item.nama_menu) }}</v-list-item-title>
                  <v-list-item-subtitle style="font-size: 10pt;" class="grey--text darken-4">{{ titleCase(item.tipe_menu) }}</v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
            </v-list>
          </template>

          <template v-slot:item.harga="{ item }">
            <span v-if="item.harga === 0">Gratis</span>
            <span v-else>Rp. {{ formatPrice(item.harga) }}</span>

          </template>

          <template v-slot:item.ketersediaan="{ item }">
            <v-chip v-if="item.ketersediaan" color="accent" outlined> Ya </v-chip>
            <v-chip v-else color="red" outlined>Tidak</v-chip>
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
        <v-data-table v-else
                      :headers="headers"
                      :items="menus"
                      :search="search"
                      :loading="loadingData"
                      loading-text="Data sedang dimuat..." sort-by="id_menu">
          <template v-slot:item.nama_menu="{ item }">
            <v-list style="padding: 0;" dense class="list">
              <v-list-item class="pl-0">
                <v-list-item-avatar class="mr-3" rounded>
                  <v-btn icon>
                    <v-avatar v-if="item.str_gambar === null" size="40" rounded>
                      <v-img :src="require('../../../assets/dummy.png')"></v-img>
                    </v-avatar>

                    <v-avatar v-else size="40" rounded @click="showImage(item)">
                      <v-img :src="'http://localhost:8000'+item.str_gambar"></v-img>
                    </v-avatar>
                  </v-btn>
                </v-list-item-avatar>

                <v-list-item-content style="padding-top: 0; padding-bottom: 0; max-width: 140px;" class="float-right">
                  <v-list-item-title class="font-weight-bold text-truncate">{{ titleCase(item.nama_menu) }}</v-list-item-title>
                  <v-list-item-subtitle style="font-size: 10pt;" class="grey--text darken-4">{{ titleCase(item.tipe_menu) }}</v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
            </v-list>
          </template>

          <template v-slot:item.harga="{ item }">
            <span v-if="item.harga === 0">Gratis</span>
            <span v-else>Rp. {{ formatPrice(item.harga) }}</span>

          </template>

          <template v-slot:item.ketersediaan="{ item }">
            <v-chip v-if="item.ketersediaan" color="accent" outlined> Ya </v-chip>
            <v-chip v-else color="red" outlined>Tidak</v-chip>
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

      <v-dialog v-model="dialog" persistent max-width="700px">
        <v-card class="px-5 py-5">
          <v-card-title>
            <span class="headline font-weight-bold">{{ formTitle }} Data Menu</span>
          </v-card-title>

          <v-card-text class="pt-7">
            <v-text-field
                outlined
                rounded
                class="rounded-lg"
                v-model="form.nama_menu"
                label="Nama Menu"
                required
                :error-messages="namaErrors"
                @input="$v.form.nama_menu.$touch()"
                @blur="$v.form.nama_menu.$touch()"
            >
              <template v-slot:prepend-inner>
                <v-icon class="mr-5" >mdi-room-service-outline</v-icon>
              </template>
            </v-text-field>

            <v-row class="pt-0">
              <v-col class="pb-0">
                <v-select
                    outlined
                    rounded
                    class="rounded-lg"
                    v-model="form.id_bahan"
                    label="Nama Bahan"
                    required
                    :items="bahans"
                    item-value="id_bahan"
                    item-text="nama_bahan"
                    :error-messages="bahanErrors"
                    @input="$v.form.id_bahan.$touch()"
                    @blur="$v.form.id_bahan.$touch()"
                >
                  <template v-slot:prepend-inner>
                    <v-icon class="mr-5">mdi-food-steak</v-icon>
                  </template>
                </v-select>
              </v-col>
              <v-col>
                <v-select
                    outlined
                    rounded
                    class="rounded-lg"
                    v-model="form.tipe_menu"
                    label="Tipe Menu"
                    required
                    :items="tipeMenuList"
                    item-value="key"
                    item-text="name"
                    :error-messages="tipeErrors"
                    @input="$v.form.tipe_menu.$touch()"
                    @blur="$v.form.tipe_menu.$touch()"
                >
                  <template v-slot:prepend-inner>
                    <v-icon class="mr-5">mdi-menu-open</v-icon>
                  </template>
                </v-select>
              </v-col>
            </v-row>


            <v-textarea
                outlined
                rounded
                class="rounded-lg"
                v-model="form.deskripsi"
                label="Deskripsi"
                required
                :error-messages="deskripsiErrors"
                @input="$v.form.deskripsi.$touch()"
                @blur="$v.form.deskripsi.$touch()"
            >
              <template v-slot:prepend-inner>
                <v-icon class="mr-5">mdi-text-subject</v-icon>
              </template>
            </v-textarea>

            <v-row class="pt-0">
              <v-col class="pb-0">
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
                    <v-icon class="mr-5">mdi-scale-balance</v-icon>
                  </template>
                </v-text-field>
              </v-col>

              <v-col class="pb-0">
                <v-text-field
                    outlined
                    rounded
                    class="rounded-lg"
                    v-model="form.harga"
                    label="Harga"
                    required
                    type="number"
                    :error-messages="hargaErrors"
                    @input="$v.form.harga.$touch()"
                    @blur="$v.form.harga.$touch()"
                >
                  <template v-slot:prepend-inner>
                    <v-icon class="mr-5">mdi-cash</v-icon>
                  </template>
                </v-text-field>
              </v-col>
            </v-row>

            <v-row class="pt-0 mt-0" v-if="inputType==='Ubah' || this.tempGambar!=null">
              <v-col cols="4" class="mx-auto">
                <v-img class="mx-auto" :src="'http://localhost:8000'+this.tempGambar" max-width="200" max-height="200"></v-img>
              </v-col>
              <v-col cols="8">
                <v-file-input
                    outlined
                    rounded
                    truncate-length="12"
                    class="rounded-lg"
                    v-model="form.str_gambar"
                    label="Gambar"
                    required
                    prepend-icon=""
                    accept="image/png, image/jpeg, image/bmp"
                >
                  <template v-slot:prepend-inner>
                    <v-icon class="mr-5">mdi-camera-outline</v-icon>
                  </template>
                </v-file-input>
              </v-col>
            </v-row>

            <v-row class="pt-0 mt-0" v-else>
              <v-col>
                <v-file-input
                    outlined
                    rounded
                    truncate-length="12"
                    class="rounded-lg"
                    v-model="form.str_gambar"
                    label="Gambar"
                    required
                    prepend-icon=""
                    accept="image/png, image/jpeg, image/bmp"
                >
                  <template v-slot:prepend-inner>
                    <v-icon class="mr-5">mdi-camera-outline</v-icon>
                  </template>
                </v-file-input>
              </v-col>
            </v-row>
          </v-card-text>

          <v-card-actions class="pr-8 pt-9 pb-5">
            <v-spacer></v-spacer>
            <v-btn color="grey darken-1" text @click="cancel" class="ml-3 pa-6 font-weight-bold">
              Cancel
            </v-btn>
            <v-btn color="primary" elevation="0" @click="setForm" class="px-9 py-6 font-weight-bold">
              Save
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

<!--      snackbar section-->
      <v-snackbar v-if="typeof error_message==='object'" multi-line v-model="snackbar" light timeout="4000" right bottom >
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

      <v-snackbar v-else multi-line v-model="snackbar" light timeout="4000" right bottom >
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
            Anda yakin ingin menghapus menu bernama <b>{{ form.nama_menu }}</b> ini?
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="grey darken-1" class="mb-3 pa-6 font-weight-bold"  text @click="close">
              Cancel
            </v-btn>
            <v-btn color="red" class="mx-3 mb-3 px-9 py-6 font-weight-bold" elevation="0" dark @click="deleteData" >
              Delete
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <v-dialog v-model="dialogImage" max-width="1000px">
        <v-card>
          <v-img :src="'http://localhost:8000'+this.idImage" max-height="550"></v-img>
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
  numeric,
  required,
  // requiredIf,
  // sameAs
} from "vuelidate/lib/validators";

export default {
  name: "Menu",
  validations: {
    form: {
      id_bahan:{ required},
      nama_menu: { required, },
      deskripsi: { required, },
      unit: { required },
      tipe_menu: { required },
      harga: { required, numeric },
      // str_gambar: { required },
    }
  },

  data() {
    return {
      // rulesInput: [
      //   value => !value || value.size < 5000000 || 'Harus dalam format .jpg, .png, atau .bmp dibawah 5 MB',
      // ],
      userRole:localStorage.getItem('role'),
      loadingData: 'false',
      inputType: 'Tambah',
      load: false,
      snackbar: false,
      error_message: '',
      color: '',
      iconSnackbar:'',
      search: null,
      dialog: false,
      dialogImage: false,
      idImage: null,
      dialogConfirm: false,
      headersManager:[
        { text: "ID", value: "id_menu", width:70 },
        { text: "Nama Menu",
          align: "start",
          value: "nama_menu",width: 150 },
        { text: "Deskripsi", value: "deskripsi", sortable: false},
        { text: "Unit", value: "unit",width: 90},
        { text: "Harga", value: "harga",width: 150 },
        { text: "Tersedia", value: "ketersediaan",width: 90, sortable: false,  },
        { value: 'actions', sortable: false, width:100 },
      ],
      headers: [
        { text: "ID", value: "id_menu", width:70 },
        { text: "Nama Menu",
          align: "start",
          value: "nama_menu",width: 150 },
        { text: "Deskripsi", value: "deskripsi", sortable: false},
        { text: "Unit", value: "unit",width: 90},
        { text: "Harga", value: "harga",width: 150 },
        { text: "Tersedia", value: "ketersediaan",width: 90, sortable: false,  },
      ],
      menu: new FormData,
      menus: [],
      bahans:[],
      tipeMenuList: [
        { key: 'utama', name: 'Utama'},
        { key: 'side dish', name: 'Side Dish'},
        { key: 'minuman', name: 'Minuman'},
      ],
      form: {
        id_bahan: null,
        nama_menu: '',
        deskripsi: '',
        unit: '',
        tipe_menu: '',
        harga: null,
        str_gambar:null,
      },
      tempGambar:null,
      editId: '',
      editedItem: {
        id_bahan: null,
        nama_menu: '',
        deskripsi: '',
        unit: '',
        tipe_menu: '',
        harga: null,
        str_gambar:null,
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
      if (!this.$v.form.nama_menu.$dirty) return errors
      !this.$v.form.nama_menu.required && errors.push('Nama harus diisi.')
      return errors
    },
    deskripsiErrors () {
      const errors = []
      if (!this.$v.form.deskripsi.$dirty) return errors
      !this.$v.form.deskripsi.required && errors.push('Harap masukkan deskripsi menu.')
      return errors
    },
    unitErrors () {
      const errors = []
      if (!this.$v.form.unit.$dirty) return errors
      !this.$v.form.unit.required && errors.push('Unit harus diisi.')
      return errors
    },
    tipeErrors() {
      const errors = []
      if (!this.$v.form.tipe_menu.$dirty) return errors
      !this.$v.form.tipe_menu.required && errors.push('Tipe menu harus diisi.')
      return errors
    },
    hargaErrors() {
      const errors = []
      if (!this.$v.form.harga.$dirty) return errors
      !this.$v.form.harga.required && errors.push('Harga harus diisi.')
      !this.$v.form.harga.numeric && errors.push('Harga harus berupa angka.')
      return errors
    },
    bahanErrors() {
      const errors = []
      if (!this.$v.form.id_bahan.$dirty) return errors
      !this.$v.form.id_bahan.required && errors.push('Bahan harus diisi.')
      return errors
    },
    // gambarErrors() {
    //   const errors = []
    //   if (!this.$v.form.str_gambar.$dirty) return errors
    //   !this.$v.form.str_gambar.required && errors.push('Gambar harus diisi.')
    //   return errors
    // },
  },

  methods: {
    // function buat format angka
    formatPrice(value) {
      let val = (value/1).toFixed(0).replace('.', ',')
      return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
    },

    // function buat disable tanggal keluar kalo status karyawannya aktif
    isDateDisabled(status){
      return !(status !== null && status === 'non aktif');
    },

    //function show image when click avatar menu
    showImage(item){
      this.idImage = item.str_gambar
      this.dialogImage = true
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
      // console.log(this.menu)
        if (this.inputType === 'Tambah')
        {
          console.log('sampe setForm belum masuk save()')
          this.save()
        }
        else{
          console.log('sampe setForm belum masuk update()')
          this.update()
        }
      }
    },

    //read data product
    readData() {
      var url = this.$api + '/menu'
      this.$http.get(url, {
        headers: {
          'Authorization': 'Bearer ' + localStorage.getItem('token')
        }
      }).then(response => {
        this.loadingData = false
        this.menus = response.data.data
        console.log(this.menus)
      })
    },

    readDataBahan(){
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

    saveImage(){
      this.menu.append('str_gambar', this.form.str_gambar);

      var url = this.$api + '/menu/images/' + this.editId
      this.load = true
      this.$http.post(url, this.menu, {
        headers: {
          'Authorization': 'Bearer ' + localStorage.getItem('token')
        }
      }).then(response => {
        console.log(response.data.message)
        this.error_message=response.data.message;
        this.color="green"
        this.iconSnackbar ='mdi-check-circle-outline'
        this.snackbar=true;
        this.load = false;
        this.close();
        this.readData(); //mengambil data
        this.resetForm();
      }).catch(error => {
        console.log(error.response.data.message)
        // this.error_message=error.response.data.message;
        // this.color="red"
        // this.iconSnackbar ='mdi-alert-circle-outline'
        this.snackbar=true;
        this.load = false;
      })
    },

    //simpan data produk
    save() {
      console.log(this.form.id_bahan)
      this.menu.append('id_bahan', this.form.id_bahan);
      this.menu.append('nama_menu', this.form.nama_menu);
      this.menu.append('deskripsi', this.form.deskripsi);
      this.menu.append('unit', this.form.unit);
      this.menu.append('tipe_menu', this.form.tipe_menu);
      this.menu.append('harga', this.form.harga);
      this.menu.append('str_gambar', this.form.str_gambar);

      var url = this.$api + '/menu/'
      this.load = true
      this.$http.post(url, this.menu, {
        headers: {
          'Authorization': 'Bearer ' + localStorage.getItem('token')
        }
      }).then(response => {
        this.error_message=response.data.message;
        this.color="green"
        this.iconSnackbar ='mdi-check-circle-outline'
        this.snackbar=true;
        this.load = false;
        console.log('sampe sini')
        this.close();
        this.readData(); //mengambil data
        this.resetForm();
      }).catch(error => {
        console.log(Object.values(error.response.data.message))
        this.error_message=error.response.data.message;
        this.color="red"
        this.iconSnackbar ='mdi-alert-circle-outline'
        this.snackbar=true;
        this.load = false;
      })
    },

    //ubah data menu
    update() {
      let newData = {
        id_bahan: this.form.id_bahan,
        nama_menu: this.form.nama_menu,
        deskripsi: this.form.deskripsi,
        unit: this.form.unit,
        tipe_menu: this.form.tipe_menu,
        harga: this.form.harga,
      }
      var url = this.$api + '/menu/' + this.editId;

      this.load = true

      this.$http.put(url, newData, {
        headers: {
          'Authorization': 'Bearer ' + localStorage.getItem('token')
        }
      }).then(response => {
        if(this.form.str_gambar!==null)
        {
          this.saveImage()
        }
        this.error_message=response.data.message;
        this.color="green"
        this.iconSnackbar ='mdi-check-circle-outline'
        this.snackbar=true;
        this.load = false;

        console.log(this.form.id_bahan)
        this.close();
        this.readData(); //mengambil data
        this.resetForm();
        this.inputType = 'Tambah';
        console.log('sampe sini')
      }).catch(error => {
        this.error_message=error.response.data.message;
        this.color="red"
        this.iconSnackbar ='mdi-alert-circle-outline'
        this.snackbar=true;
        this.load = false;
      })
    },

    //hapus data produk
    deleteData() {
      //mengahapus data
      var url = this.$api + '/menu/' + this.deleteId;

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
        this.form.nama_menu = '' //reset form.nama_menu
        this.snackbar=true;
        this.load = false;
      })
    },

    editHandler(item){
      this.inputType = 'Ubah';
      this.editId = item.id_menu;
      this.form.id_bahan= item.id_bahan
      this.form.nama_menu= item.nama_menu
      this.form.deskripsi= item.deskripsi
      this.form.unit= item.unit
      this.form.tipe_menu= item.tipe_menu
      this.form.harga= item.harga
      this.tempGambar=item.str_gambar
      this.dialog = true;
    },

    deleteHandler(item){
      this.deleteId = item.id_menu
      this.form.nama_menu= item.nama_menu
      this.dialogConfirm = true;
    },

    close() {
      this.$v.$reset()
      this.dialogConfirm = false
      this.dialog = false
      this.inputType = 'Tambah';
      this.form.nama_menu = '' //reset form.nama_menu
      this.tempGambar=null
    },

    cancel() {
      this.$v.$reset()
      this.resetForm();
      this.readData();
      this.dialog = false;
      this.inputType = 'Tambah';
      this.tempGambar=null
      this.form.nama_menu = '' //reset form.nama_menu
    },

    resetForm() {
      this.$v.$reset()
      this.form = {
        id_bahan: null,
        nama_menu: '',
        deskripsi: '',
        unit: '',
        tipe_menu: '',
        harga: null,
        str_gambar:null,
      };
      this.tempGambar=null
    },
  },

  mounted() {
    this.loadingData = true
    this.readData()
    this.readDataBahan()
    console.log('menus '+this.menus)
  },
}
</script>

<style scoped>
  .list{
    background-color: rgba(255,255,255,0);
  }
</style>