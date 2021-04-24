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
            Tambah Bahan
          </v-btn>
        </v-card-title>

        <v-data-table :headers="headers" :items="bahans" :search="search" :loading="loadingData" loading-text="Data sedang dimuat..." striped>
          <template v-slot:item.jumlah_stok="{ item }">
            <span>
              {{ formatPrice(item.jumlah_stok) }}
            </span>
          </template>
          <template v-slot:item.jumlah_per_sajian="{ item }">
            <span>
              {{ formatPrice(item.jumlah_per_sajian) }} {{ item.unit }}
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
            <v-btn color="red" text @click="cancel" class=" pa-6 font-weight-bold">
              Cancel
            </v-btn>
            <v-btn color="primary" elevation="0" @click="setForm" class="ml-3 px-9 py-6 font-weight-bold">
              Save
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <v-snackbar multi-line v-model="snackbar" :color="color" timeout="4000" bottom>
        <v-icon class="mr-3">
          {{iconSnackbar}}
        </v-icon>
        {{error_message}}
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
      iconSnackbar:'',
      search: null,
      dialog: false,
      dialogConfirm: false,
      headers: [
        { text: "ID", value: "id_bahan", width:70 },
        { text: "Nama Bahan",
          align: "start",
          value: "nama_bahan" },
        { text: "Jumlah Stok", value: "jumlah_stok"},
        { text: "Serving Size", value: "jumlah_per_sajian"},
        // { text: "Unit", value: "unit", align: 'center', sortable: false, width:70},
        { value: 'actions', sortable: false },
      ],
      bahan: new FormData,
      bahans: [],
      form: {
        nama_bahan: null,
        jumlah_stok: null,
        jumlah_per_sajian: null,
        unit: null,
      },
      editId: '',
      editedItem: {
        nama_bahan: null,
        jumlah_stok: null,
        jumlah_per_sajian: null,
        unit: null,
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
      !this.$v.form.jumlah_per_sajian.between && errors.push('Min. 0 dan maks. sebanyak jumlah stok.')
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
        console.log('2')
        if (this.inputType === 'Tambah')
          this.save()
        else
          this.update()
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

    //simpan data bahan
    save() {
      this.bahan.append('nama_bahan', this.form.nama_bahan);
      this.bahan.append('jumlah_stok', this.form.jumlah_stok);
      this.bahan.append('jumlah_per_sajian', this.form.jumlah_per_sajian);
      this.bahan.append('unit', this.form.unit);

      var url = this.$api + '/bahan/'
      this.load = true
      this.$http.post(url, this.bahan, {
        headers: {
          'Authorization': 'Bearer ' + localStorage.getItem('token')
        }
      }).then(response => {
        this.error_message=response.data.message;
        this.color="green"
        this.iconSnackbar ='mdi-check-circle'
        this.snackbar=true;
        this.load = false;
        this.close();
        this.readData(); //mengambil data
        this.resetForm();
      }).catch(error => {
        console.log(Object.values(error.response.data.message))
        this.error_message=Object.values(error.response.data.message).toString();
        this.color="red"
        this.iconSnackbar ='mdi-alert-circle'
        this.snackbar=true;
        this.load = false;
      })
    },

    //ubah data karyawan
    update() {
      let newData = {
        nama_bahan: this.form.nama_bahan,
        jumlah_stok: this.form.jumlah_stok,
        jumlah_per_sajian: this.form.jumlah_per_sajian,
        unit: this.form.unit,
      }
      var url = this.$api + '/bahan/' + this.editId;

      this.load = true

      this.$http.put(url, newData, {
        headers: {
          'Authorization': 'Bearer ' + localStorage.getItem('token')
        }
      }).then(response => {
        this.error_message=response.data.message;
        this.color="green"
        this.iconSnackbar ='mdi-check-circle'
        this.snackbar=true;
        this.load = false;
        this.close();
        this.readData(); //mengambil data
        this.resetForm();
        this.inputType = 'Tambah';

      }).catch(error => {
        this.error_message=Object.values(error.response.data.message).toString();
        this.color="red"
        this.iconSnackbar ='mdi-alert-circle'
        this.snackbar=true;
        this.load = false;
      })
    },

    //hapus data bahan
    deleteData() {
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
        this.load = false;
        this.close();
        this.readData(); //mengambil data
        this.resetForm();
        this.dialogConfirm = false;
        this.inputType = 'Tambah';
      }).catch(error => {
        this.error_message=Object.values(error.response.data.message).toString();
        this.color="red"
        this.iconSnackbar ='mdi-alert-circle'
        this.form.nama_bahan = null //reset form.nama_bahan
        this.snackbar=true;
        this.load = false;
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

    close() {
      this.$v.$reset()
      this.dialogConfirm = false
      this.dialog = false
      this.inputType = 'Tambah';
      this.form.nama_bahan = null //reset form.nama_bahan
    },

    cancel() {
      this.$v.$reset()
      this.resetForm();
      this.readData();
      this.dialog = false;
      this.inputType = 'Tambah';
      this.form.nama_bahan = null //reset form.nama_bahan
    },

    resetForm() {
      this.$v.$reset()
      this.form = {
        nama_bahan: null,
        jumlah_stok: null,
        jumlah_per_sajian: null,
        unit: null,
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