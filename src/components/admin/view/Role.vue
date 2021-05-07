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
            Tambah Role
          </v-btn>
        </v-card-title>

        <v-data-table :headers="headers" :items="roles" :search="search" :loading="load" loading-text="Data sedang dimuat..." striped>
          <template v-slot:item.role_pegawai="{ item }">
            <span>
              {{ titleCase(item.role_pegawai) }}
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
            <span class="headline font-weight-bold">{{ formTitle }} Data Role</span>
          </v-card-title>

          <v-card-text class="pt-7">
            <v-text-field
                outlined
                rounded
                class="rounded-lg"
                v-model="form.role_pegawai"
                label="Nama Role"
                required
                :error-messages="namaErrors"
                @input="$v.form.role_pegawai.$touch()"
                @blur="$v.form.role_pegawai.$touch()"
            >
              <template v-slot:prepend-inner>
                <v-icon class="mr-5" >mdi-account-search-outline</v-icon>
              </template>
            </v-text-field>

            <v-card-actions class="pr-8 pt-9 pb-5">
              <v-spacer></v-spacer>
              <v-btn color="grey darken-1" text @click="cancel" class=" pa-6 font-weight-bold">
                Cancel
              </v-btn>
              <v-btn color="primary" elevation="0" @click="setForm" :loading="loadingData" class="ml-3 px-9 py-6 font-weight-bold">
                Save
              </v-btn>
            </v-card-actions>
          </v-card-text>
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
            Anda yakin ingin menghapus role bernama <b>{{ form.role_pegawai }}</b> ini?
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
  required,
} from "vuelidate/lib/validators";

export default {
  name: "Role",
  validations: {
    form: {
      role_pegawai: { required,  },
    }
  },

  data() {
    return {
      currentEmail:localStorage.getItem('email'),
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
      dialogConfirm: false,
      headers: [
        { text: "ID", value: "id_role", width:70 },
        { text: "Nama Role",
          align: "start",
          value: "role_pegawai" },
        // { text: "Unit", value: "unit", align: 'center', sortable: false, width:70},
        { value: 'actions', sortable: false, width: 100 },
      ],
      role: new FormData,
      roles: [],
      form: {
        role_pegawai: '',
      },
      editId: '',
      editedItem: {
        role_pegawai: '',
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
      if (!this.$v.form.role_pegawai.$dirty) return errors
      !this.$v.form.role_pegawai.required && errors.push('Nama role harus diisi.')
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
      if(!this.$v.$error) {
        if (this.inputType === 'Tambah')
          this.save()
        else
          this.update()
      }
    },

    //read data role
    readData() {
      var url = this.$api + '/role'
      this.$http.get(url, {
        headers: {
          'Authorization': 'Bearer ' + localStorage.getItem('token')
        }
      }).then(response => {
        this.load = false
        this.roles = response.data.data
      })
    },

    //simpan data role
    save() {
      this.role.append('role_pegawai', this.form.role_pegawai);

      var url = this.$api + '/role/'
      this.loadingData = true
      this.$http.post(url, this.role, {
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
        this.color="red"
        this.iconSnackbar ='mdi-alert-circle'
        this.snackbar=true;
        this.loadingData = false;
      })
    },

    //ubah data role
    update() {
      let newData = {
        role_pegawai: this.form.role_pegawai,
      }
      var url = this.$api + '/role/' + this.editId;

      this.loadingData = true

      this.$http.put(url, newData, {
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
        this.inputType = 'Tambah';

      }).catch(error => {
        this.error_message=error.response.data.message;
        this.color="red"
        this.iconSnackbar ='mdi-alert-circle'
        this.snackbar=true;
        this.load = false;
      })
    },

    //hapus data role
    deleteData() {
      this.loadingData = true
      //mengahapus data
      var url = this.$api + '/role/' + this.deleteId;

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
        this.form.role_pegawai = null //reset form.role_pegawai
        this.snackbar=true;
        this.loadingData = false;
      })
    },

    deleteHandler(item){
      this.deleteId = item.id_role;
      this.form.role_pegawai = item.role_pegawai
      this.dialogConfirm = true;
    },

    editHandler(item){
      this.inputType = 'Ubah';
      this.editId = item.id_role;
      this.form.role_pegawai = item.role_pegawai
      this.dialog = true;
    },

    close() {
      this.$v.$reset()
      this.dialogConfirm = false
      this.dialog = false
      this.inputType = 'Tambah';
      this.form.role_pegawai = null //reset form.role_pegawai
    },

    cancel() {
      this.$v.$reset()
      this.resetForm();
      this.readData();
      this.dialog = false;
      this.inputType = 'Tambah';
      this.form.role_pegawai = null //reset form.role_pegawai
    },

    resetForm() {
      this.$v.$reset()
      this.form = {
        role_pegawai: '',
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