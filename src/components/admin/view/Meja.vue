<template>
  <div id="app">
    <v-container fluid>

      <v-card class="elevation-0 rounded-lg">
        <v-card-title class="mt-3 text-center">
          <v-text-field
              v-model="search"
              label="Search"
              filled
              rounded
              single-line
              dense
              style="max-width: 200px!important;"
              class="mt-6 mx-3 rounded-lg"
          >
            <template v-slot:prepend-inner>
              <v-icon class="mr-5">mdi-magnify</v-icon>
            </template>
          </v-text-field>

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
                  style="max-width: 250px!important;"
                  filled
                  rounded
                  single-line
                  dense
                  hide-details
                  class="rounded-lg mx-3"
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
                v-model="form.tgl_reservasi"
                @input="menu = false"
            ></v-date-picker>
          </v-menu>

          <v-select
              style="max-width: 200px!important;"
              filled
              rounded
              single-line
              dense
              class="rounded-lg mx-3"
              v-model="form.sesi"
              label="Sesi"
              required
              hide-details
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

          <v-spacer></v-spacer>

          <v-btn color="#37A37B" @click="save()" dark class="mr-3 px-4 py-5 rounded-lg font-weight-bold" elevation="0" style="font-size: 14px">
            <v-icon class="mr-3 ">
              mdi-plus
            </v-icon>
            Tambah Meja
          </v-btn>
        </v-card-title>

        <v-data-iterator :items="mejas" :search="search" :loading="loadingData" disable-pagination hide-default-footer class="pb-4">
          <template v-slot:loading>
            <v-progress-linear
              indeterminate
            ></v-progress-linear>
            <div class="text-center">Data sedang dimuat...</div>
          </template>

          <template v-slot:default="props">
            <v-container class="px-6">
              <v-row>
                <v-col
                    v-for="item in props.items"
                    :key="item.no_meja"
                    cols="12"
                    sm="6"
                    md="4"
                    lg="3"
                    xl="2"
                >
                  <v-card elevation="0" v-if="item.status_meja==='tersedia'" color="accent" dark max-width="256px">
                    <v-card-title class="heading font-weight-bold">
                      {{ item.no_meja }}
                    </v-card-title>
                    <v-card-subtitle>
                      {{ titleCase(item.status_meja) }}
                    </v-card-subtitle>

                    <v-card-actions >
                      <v-spacer></v-spacer>
                      <v-tooltip bottom>
                        <template v-slot:activator="{ on, attrs }">
                          <v-btn
                              class="mr-2"
                              rounded
                              dark
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
                              dark
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
                    </v-card-actions>
                  </v-card>


                  <v-card elevation="0" v-else color="red" dark max-width="256px">
                    <v-card-title class="subheading font-weight-bold">
                      {{ item.no_meja }}
                    </v-card-title>
                    <v-card-subtitle>
                      {{ titleCase(item.status_meja) }}
                    </v-card-subtitle>
                    <v-card-actions>
                      <v-spacer></v-spacer>
                      <v-tooltip bottom>
                        <template v-slot:activator="{ on, attrs }">
                          <v-btn
                              class="mr-2"
                              rounded
                              dark
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
                              dark
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
                    </v-card-actions>
                  </v-card>
                </v-col>
              </v-row>
            </v-container>
          </template>

        </v-data-iterator>

      </v-card>

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
            Anda yakin ingin menghapus meja bernomor <b>{{ form.no_meja }}</b> ini?
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="grey darken-1" class="mb-3 pa-6 font-weight-bold"  text @click="dialogConfirm = false">
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
export default {
  name: "Meja",

  data() {
    return {
      filter: {},
      loadingData: 'false',
      inputType: 'Tambah',
      load: false,
      snackbar: false,
      error_message: '',
      color: '',
      iconSnackbar:'',
      search: '',
      dialog: false,
      dialogConfirm: false,
      headers: [
        { text: "No. Meja", value: "no_meja", width: 150},
        { text: "Status",
          align: "start",
          value: "status_meja" },
        // { text: "Unit", value: "unit", align: 'center', sortable: false, width:70},
        { value: 'actions', sortable: false, width: 100 },
      ],
      meja: new FormData,
      mejas: [],
      form: {
        status_meja: null,
      },
      editId: '',
      editedItem: {
        status_meja: null,
      },
    };
  },

  computed: {
    formTitle() {
      return this.inputType
    },
    filteredKeys: function () {
      return this.mejas.filter(key => key !== this.mejas.no_meja)
    },
  },

  methods: {

    customSearch (value, search) {
      const data = value
      var i  = data.length
      if (search.length > 0) {
        while(i--) {
          console.log(data[i].id)
          if (data[i].id !== parseInt(search)) {
            data.splice(i, 1)
          }
        }
      }
      return data
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
    // setForm() {
    //   this.$v.$touch()
    //   if(!this.$v.$error) {
    //     if (this.inputType === 'Tambah')
    //       this.save()
    //     else
    //       this.update()
    //   }
    // },

    //read data meja
    readData() {
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

    //simpan data meja
    save() {
      this.meja.append('status_meja', 'tersedia');

      var url = this.$api + '/meja/'
      this.load = true
      this.$http.post(url, this.meja, {
        headers: {
          'Authorization': 'Bearer ' + localStorage.getItem('token')
        }
      }).then(response => {
        this.error_message=response.data.message;
        this.color="green"
        this.iconSnackbar ='mdi-check-circle'
        this.snackbar=true;
        this.load = false;
        this.readData(); //mengambil data
      }).catch(error => {
        console.log(Object.values(error.response.data.message))
        this.error_message=error.response.data.message;
        this.color="red"
        this.iconSnackbar ='mdi-alert-circle'
        this.snackbar=true;
        this.load = false;
      })
    },

    //ubah data meja
    update() {
      let newData = {
        status_meja: this.form.status_meja,
      }
      var url = this.$api + '/meja/' + this.editId;

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
        this.error_message=error.response.data.message;
        this.color="red"
        this.iconSnackbar ='mdi-alert-circle'
        this.snackbar=true;
        this.load = false;
      })
    },

    //hapus data meja
    deleteData() {
      //mengahapus data
      var url = this.$api + '/meja/' + this.deleteId;

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
        this.error_message=error.response.data.message;
        this.color="red"
        this.iconSnackbar ='mdi-alert-circle'
        this.form.status_meja = null //reset form.status_meja
        this.snackbar=true;
        this.load = false;
      })
    },

    deleteHandler(item){
      this.deleteId = item.no_meja;
      this.form.status_meja = item.status_meja
      this.dialogConfirm = true;
    },

    editHandler(item){
      this.editId = item.no_meja;
      if(item.status_meja === 'tersedia')
        this.form.status_meja = 'tidak tersedia'
      else if(item.status_meja === 'tidak tersedia')
        this.form.status_meja = 'tersedia'
      this.update()
    },

    close() {
      this.dialog = false
      this.inputType = 'Tambah';
      this.form.status_meja = null //reset form.status_meja
    },

    cancel() {
      this.resetForm();
      this.readData();
      this.dialog = false;
      this.inputType = 'Tambah';
      this.form.status_meja = null //reset form.status_meja
    },

    resetForm() {
      this.form = {
        status_meja: null,
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