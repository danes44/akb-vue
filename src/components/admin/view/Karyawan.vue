<template>
  <div id="app">
    <v-container fluid>

      <v-card class="elevation-0 rounded-lg">
        <v-card-title class="mt-3 text-center">
          <v-text-field
              v-model="search"
              append-icon="mdi-magnify"
              label="Search by ID & Nama"
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
            Tambah Karyawan
          </v-btn>

        </v-card-title>

        <v-data-table :headers="headers" :items="karyawans" :search="search" :loading="load" loading-text="Data sedang dimuat..." sort-by="id_pegawai">
          <template v-slot:item.nama_pegawai="{ item }">
            <v-list style="padding: 0;" dense id="list">
              <v-list-item class="pl-0">
                <v-list-item-content style="padding-top: 0; padding-bottom: 0; max-width: 140px;" class="float-right">
                  <v-list-item-title class="font-weight-bold text-truncate">
                    {{ titleCase(item.nama_pegawai) }}
                  </v-list-item-title>
                  <v-list-item-subtitle style="font-size: 10pt;" class="grey--text darken-4">
                    <span v-if="item.role_pegawai === 'Operasional Manager'">
                      Ops. Manager
                    </span>
                    <span v-else>
                      {{ item.role_pegawai }}
                    </span>
                  </v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
            </v-list>

          </template>

          <template v-slot:item.email="{ item }">
            <span class="truncate">
              {{item.email}}
            </span>
          </template>

          <template v-slot:item.jenis_kelamin="{ item }">
            {{ titleCase(item.jenis_kelamin) }}
          </template>

          <template v-slot:item.tgl_gabung="{ item }">
            <span>
              {{ moment(item.tgl_gabung).format("DD-MM-YYYY") }}
            </span>
          </template>

          <template v-slot:item.tgl_keluar="{ item }">
            <span v-if="item.tgl_keluar === null">
              -
            </span>
            <span v-else>
              {{ moment(item.tgl_keluar).format("DD-MM-YYYY") }}
            </span>
          </template>

          <template v-slot:item.status_pegawai="{ item }">
            <v-avatar v-if="item.status_pegawai === 'aktif'" color="#4CAF50" size="30">
              <v-tooltip bottom>
                <template v-slot:activator="{ on, attrs }">
                  <span style="color: white" v-bind="attrs" v-on="on">✓</span>
                </template>
                <span>Aktif</span>
              </v-tooltip>
            </v-avatar>

            <v-avatar v-else color="#D24848" size="30">
              <v-tooltip bottom>
                <template v-slot:activator="{ on, attrs }">
                  <span style="color: white" v-bind="attrs" v-on="on">✗</span>
                </template>
                <span>Non Aktif</span>
              </v-tooltip>
            </v-avatar>
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
                    class="mr-2"
                    rounded
                    color="orange darken-3"
                    x-small
                    icon
                    v-bind="attrs"
                    v-on="on"
                    @click="changePasswordHandler(item)"
                >
                  <v-icon>
                    mdi-lock-reset
                  </v-icon>
                </v-btn>
              </template>
              <span>Change Password</span>
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
            <span class="headline font-weight-bold">{{ formTitle }} Data Karyawan</span>
          </v-card-title>

          <v-card-text class="pt-7">
            <v-text-field
                outlined
                rounded
                class="rounded-lg"
                v-model="form.nama_pegawai"
                label="Nama Karyawan"
                required
                :error-messages="namaErrors"
                @input="$v.form.nama_pegawai.$touch()"
                @blur="$v.form.nama_pegawai.$touch()"
            >
              <template v-slot:prepend-inner>
                <v-icon class="mr-5" >mdi-account-outline</v-icon>
              </template>
            </v-text-field>

            <v-row class="pt-0">
              <v-col class="">
                <v-text-field
                    outlined
                    rounded
                    class="rounded-lg"
                    v-model="form.no_telp_pegawai"
                    label="No Telpon"
                    required
                    :error-messages="noTelpErrors"
                    @input="$v.form.no_telp_pegawai.$touch()"
                    @blur="$v.form.no_telp_pegawai.$touch()"
                >
                  <template v-slot:prepend-inner>
                    <v-icon class="mr-5">mdi-phone-outline</v-icon>
                  </template>
                </v-text-field>
              </v-col>

              <v-col class="">
                <v-autocomplete
                    outlined
                    rounded
                    class="rounded-lg"
                    v-model="form.id_role"
                    label="Role Karyawan"
                    required
                    :items="roles"
                    item-value="id_role"
                    item-text="role_pegawai"
                    :error-messages="roleErrors"
                    @input="$v.form.id_role.$touch()"
                    @blur="$v.form.id_role.$touch()"
                >
                  <template v-slot:prepend-inner>
                    <v-icon class="mr-5">mdi-account-search-outline</v-icon>
                  </template>
                </v-autocomplete>
              </v-col>
            </v-row>

            <v-text-field
                outlined
                rounded
                class="rounded-lg"
                v-model="form.email"
                label="Email"
                required
                :disabled="isEmailDisabled(form.email)"
                :error-messages="emailErrors"
                @input="$v.form.email.$touch()"
                @blur="$v.form.email.$touch()"
            >
              <template v-slot:prepend-inner>
                <v-icon class="mr-5">mdi-email-outline</v-icon>
              </template>
            </v-text-field>

<!--            <v-text-field-->
<!--                v-if="inputType==='Tambah'"-->
<!--                outlined-->
<!--                rounded-->
<!--                class="rounded-lg"-->
<!--                v-model="form.password"-->
<!--                label="Password"-->
<!--                type="password"-->
<!--                required-->
<!--                :error-messages="passwordErrors"-->
<!--                @input="$v.form.password.$touch()"-->
<!--                @blur="$v.form.password.$touch()"-->
<!--            >-->
<!--              <template v-slot:prepend-inner>-->
<!--                <v-icon class="mr-5">mdi-email-outline</v-icon>-->
<!--              </template>-->
<!--            </v-text-field>-->
            <v-text-field
                v-if="inputType==='Tambah'"
                outlined
                rounded
                class="rounded-lg"
                v-model="form.password"
                label="Password"
                type="password"
                required
                @input="$v.form.password.$touch()"
                @blur="$v.form.password.$touch()"
            >
              <template v-slot:prepend-inner>
                <v-icon class="mr-5">mdi-lock-outline</v-icon>
              </template>
            </v-text-field>

            <v-row class="pt-0">
              <v-col class="pb-0">
                <v-select
                    outlined
                    rounded
                    class="rounded-lg"
                    v-model="form.status_pegawai"
                    label="Status"
                    required
                    :items="statusList"
                    item-value="key"
                    item-text="name"
                    @change="changeStatus"
                    :error-messages="statusErrors"
                    @input="$v.form.status_pegawai.$touch()"
                    @blur="$v.form.status_pegawai.$touch()"
                >
                  <template v-slot:prepend-inner>
                    <v-icon class="mr-5">mdi-list-status</v-icon>
                  </template>
                </v-select>
              </v-col>

              <v-col class="pb-0">
                <v-select
                    outlined
                    rounded
                    class="rounded-lg"
                    v-model="form.jenis_kelamin"
                    label="Jenis Kelamin"
                    required
                    :items="jenisKelaminList"
                    item-value="key"
                    item-text="name"
                    :error-messages="jenisKelaminErrors"
                    @input="$v.form.jenis_kelamin.$touch()"
                    @blur="$v.form.jenis_kelamin.$touch()"
                >
                  <template v-slot:prepend-inner>
                    <v-icon class="mr-5">mdi-gender-male-female</v-icon>
                  </template>
                </v-select>
              </v-col>
            </v-row>

            <v-row>
              <v-col class="pt-0 pb-5">
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
                        v-model="form.tgl_gabung"
                        label="Tanggal Gabung"
                        readonly
                        v-bind="attrs"
                        v-on="on"
                        :error-messages="tglGabungErrors"
                        @input="$v.form.tgl_gabung.$touch()"
                        @blur="$v.form.tgl_gabung.$touch()"
                    >
                      <template v-slot:prepend-inner>
                        <v-icon class="mr-5">mdi-calendar</v-icon>
                      </template>
                    </v-text-field>
                  </template>
                  <v-date-picker
                      v-model="form.tgl_gabung"
                      @input="menu = false"
                      :max="new Date().toISOString().substr(0, 10)"
                      min="1950-01-01"
                  ></v-date-picker>
                </v-menu>
              </v-col>

              <v-col class="pt-0 pb-5">
                <v-menu
                    v-model="menu2"
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
                        :disabled="isDateDisabled(form.status_pegawai)"
                        v-model="form.tgl_keluar"
                        label="Tanggal Keluar"
                        prepend-inner-icon="mdi-calendar"
                        readonly
                        v-bind="attrs"
                        v-on="on"
                        clearable
                    >
                      <template v-slot:prepend-inner>
                        <v-icon class="mr-5">mdi-calendar</v-icon>
                      </template>
                    </v-text-field>
                  </template>
                  <v-date-picker
                      v-model="form.tgl_keluar"
                      @input="menu2 = false"
                      :max="new Date().toISOString().substr(0, 10)"
                      :min="form.tgl_gabung"
                  ></v-date-picker>
                </v-menu>
              </v-col>
            </v-row>
          </v-card-text>

          <v-card-actions class="pr-8 pt-9 pb-5">
            <v-spacer></v-spacer>
            <v-btn color="grey darken-1" text @click="cancel" class="ml-3 pa-6 font-weight-bold">
              Cancel
            </v-btn>
            <v-btn color="primary" elevation="0" @click="setForm" :loading="loadingData" class="px-9 py-6 font-weight-bold">
              Save
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <v-dialog v-model="dialogUpdatePassword" persistent max-width="600px">
        <v-card class="px-5 py-5">
          <v-card-title>
            <span class="headline font-weight-bold">{{ formTitle }} Karyawan</span>
          </v-card-title>

          <v-card-text class="pt-7">
            <v-text-field
                outlined
                rounded
                class="rounded-lg"
                type="password"
                v-model="form.newPassword"
                label="Password Baru"
                required
            >
              <template v-slot:prepend-inner>
                <v-icon class="mr-5" >mdi-lock-outline</v-icon>
              </template>
            </v-text-field>

            <v-text-field
                outlined
                rounded
                class="rounded-lg"
                type="password"
                v-model="form.confirmPassword"
                label="Confirm Password"
                required
            >
              <template v-slot:prepend-inner>
                <v-icon class="mr-5" >mdi-lock-outline</v-icon>
              </template>
            </v-text-field>
          </v-card-text>


          <v-card-actions class="pr-8 pt-9 pb-5">
            <v-spacer></v-spacer>
            <v-btn color="grey darken-1" text @click="cancel" class="ml-3 pa-6 font-weight-bold">
              Cancel
            </v-btn>
            <v-btn color="primary" elevation="0" @click="updatePassword" :loading="loadingData" class="px-9 py-6 font-weight-bold">
              Save
            </v-btn>
          </v-card-actions>
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
            Anda yakin ingin menghapus pegawai bernama <b>{{ form.nama_pegawai }}</b> ini?
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
  import moment from "moment"; //library buat ganti format waktu/tanggal
  import {
    email, maxLength, minLength, numeric,
    // maxLength,
    // minLength,
    // numeric,
    required,
    // requiredIf,
    // requiredUnless,
    // sameAs
  } from "vuelidate/lib/validators";

  export default {
    name: "Karyawan",
    // validations: {
    //   form: {
    //     nama_pegawai: { required,  },
    //     email: { required, email, },
    //     jenis_kelamin: { required },
    //     id_role: { required },
    //     status_pegawai: {required},
    //     password: { required : requiredUnless('isPasswordRequired'), minLength: minLength(8)},
    //     tgl_gabung: { required },
    //     tgl_keluar: { required : requiredUnless('isDateRequired')},
    //     confirmPassword: { required : requiredUnless('isPasswordRequired'), minLength: minLength(8), sameAs: sameAs('password')}
    //
    //   }
    // },
    validations: {
      form: {
        nama_pegawai: { required,  },
        email: { required, email, },
        jenis_kelamin: { required },
        id_role: { required },
        status_pegawai: {required},
        // password: { required, minLength: minLength(8)},
        tgl_gabung: { required },
        no_telp_pegawai: { required, numeric, minLength: minLength(10), maxLength: maxLength(15) },
        // tgl_keluar: { required : requiredIf('isDateRequired')},
        // newPassword: { required : requiredIf('isPasswordRequired'), minLength: minLength(8), }
        // confirmPassword: { required : requiredIf('isPasswordRequired'), minLength: minLength(8), sameAs: sameAs('newPassword')}

      }
    },
    // validations() {
    //   if ( this.inputType === 'Ubah Password') {
    //     if(this.is_active){
    //       return {
    //         nama_pegawai: { required,  },
    //         email: { required, email, },
    //         jenis_kelamin: { required },
    //         id_role: { required },
    //         status_pegawai: {required},
    //         password: { required, minLength: minLength(8)},
    //         tgl_gabung: { required },
    //         tgl_keluar: { required },
    //         // confirmPassword: { required, minLength: minLength(8), sameAs: sameAs('password')}
    //       }
    //     }
    //     else{
    //       return {
    //         nama_pegawai: { required,  },
    //         email: { required, email, },
    //         jenis_kelamin: { required },
    //         id_role: { required },
    //         status_pegawai: {required},
    //         password: { required, minLength: minLength(8)},
    //         tgl_gabung: { required },
    //         // tgl_keluar: { required },
    //         // confirmPassword: { required, minLength: minLength(8), sameAs: sameAs('password')}
    //       }
    //     }
    //   } else {
    //     return {
    //       // nama_pegawai: {required,},
    //       // email: {required, email,},
    //       // jenis_kelamin: {required},
    //       // id_role: {required},
    //       // status_pegawai: {required},
    //       newPassword: {required, minLength: minLength(8)},
    //       // tgl_gabung: {required},
    //       // tgl_keluar: { required: requiredIf(!(this.form.status_pegawai !== null && this.form.status_pegawai === 'non aktif'))},
    //       confirmPassword: { required, minLength: minLength(8), sameAs: sameAs('password')}
    //     }
    //   }
    // },

    data() {
      return {
        is_updatePassword:false,
        is_active:false,
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
        dialogUpdatePassword: false,
        dialogConfirm: false,
        headers: [
          { text: "ID", value: "id_pegawai", width:70 },
          { text: "Nama",
            align: "start",
            value: "nama_pegawai", width: 100 },
          // { text: "Role", value: "role_pegawai", width: 100,filterable: false},
          { text: "Telp.", value: "no_telp_pegawai",filterable: false, width: 70},
          { text: "Email", value: "email",filterable: false, width: 70 },
          { text: "Status", value: "status_pegawai", align: 'center', sortable: false,filterable: false, width:70},
          { text: "Gender", value: "jenis_kelamin", sortable: false,filterable: false, width: 70},
          { text: "Tgl Gabung", value: "tgl_gabung",filterable: false, width: 120  },
          { text: "Tgl Keluar", value: "tgl_keluar",filterable: false, width: 120  },
          { value: 'actions', sortable: false,filterable: false, width: 90 },
        ],
        karyawan: new FormData,
        karyawans: [],
        roles:[],
        form: {
          id_role: null,
          nama_pegawai: '',
          jenis_kelamin: null,
          tgl_gabung: "",
          tgl_keluar: "",
          status_pegawai: null,
          no_telp_pegawai:'',
          email: '',
          password: '',
          newPassword: '',
          confirmPassword: '',
        },
        editId: '',
        editedItem: {
          id_role: null,
          nama_pegawai: '',
          jenis_kelamin: null,
          tgl_gabung: "",
          tgl_keluar: "",
          status_pegawai: null,
          no_telp_pegawai:'',
          email: '',
          password: '',
          newPassword: '',
          confirmPassword: '',
        },
        jenisKelaminList: [
          {key: 'pria', name: 'Pria'},
          {key: 'wanita', name: 'Wanita'},
        ],
        statusList: [
          {key: 'aktif', name: 'Aktif'},
          {key: 'non aktif', name: 'Non Aktif'},
        ],
      };
    },
    computed: {
      isPasswordRequired(){
        return this.is_updatePassword === true;
      },
      isDateRequired(){
        return this.is_active === true;
      },
      formTitle() {
        return this.inputType
      },
      // validations
      namaErrors () {
        const errors = []
        if (!this.$v.form.nama_pegawai.$dirty) return errors
        !this.$v.form.nama_pegawai.required && errors.push('Nama harus diisi.')
        return errors
      },
      emailErrors () {
        const errors = []
        if (!this.$v.form.email.$dirty) return errors
        !this.$v.form.email.email && errors.push('Email tidak valid.')
        !this.$v.form.email.required && errors.push('Harap masukkan alamat email.')
        return errors
      },
      statusErrors () {
        const errors = []
        if (!this.$v.form.status_pegawai.$dirty) return errors
        !this.$v.form.status_pegawai.required && errors.push('Status harus diisi.')
        return errors
      },
      jenisKelaminErrors() {
        const errors = []
        if (!this.$v.form.jenis_kelamin.$dirty) return errors
        !this.$v.form.jenis_kelamin.required && errors.push('Jenis Kelamin harus diisi.')
        return errors
      },
      tglGabungErrors() {
        const errors = []
        if (!this.$v.form.tgl_gabung.$dirty) return errors
        !this.$v.form.tgl_gabung.required && errors.push('Tanggal Bergabung harus diisi.')
        return errors
      },
      roleErrors() {
        const errors = []
        if (!this.$v.form.id_role.$dirty) return errors
        !this.$v.form.id_role.required && errors.push('Role harus diisi.')
        return errors
      },
      noTelpErrors () {
        const errors = []
        if (!this.$v.form.no_telp_pegawai.$dirty) return errors
        !this.$v.form.no_telp_pegawai.maxLength && errors.push('Nomor telepon tidak boleh lebih 15 digit')
        !this.$v.form.no_telp_pegawai.minLength && errors.push('Nomor telepon tidak boleh kurang dari 10 digit.')
        !this.$v.form.no_telp_pegawai.numeric && errors.push('Nomor telepon tidak valid.')
        !this.$v.form.no_telp_pegawai.required && errors.push('Nomor telepon harus diisi')
        return errors
      },
      // tglKeluarErrors() {
      //   const errors = []
      //   if (!this.$v.form.tgl_keluar.$dirty) return errors
      //   !this.$v.form.tgl_keluar.required && errors.push('Date join is required.')
      //   return errors
      // },
      // passwordErrors () {
      //   const errors = []
      //   if (!this.$v.form.password.$dirty) return errors
      //   !this.$v.form.password.minLength && errors.push('Password harus lebih dari 8 karakter.')
      //   !this.$v.form.password.required && errors.push('Password harus diisi.')
      //   return errors
      // },
      // newPasswordErrors () {
      //   const errors = []
      //   if (!this.$v.form.newPassword.$dirty) return errors
      //   !this.$v.form.newPassword.minLength && errors.push('Password harus lebih dari 8 karakter.')
      //   !this.$v.form.newPassword.required && errors.push('Password harus diisi.')
      //   return errors
      // },
      // confirmPasswordErrors () {
      //   const errors = []
      //   if (!this.$v.form.confirmPassword.$dirty) return errors
      //   !this.$v.form.confirmPassword.required && errors.push('Password harus diisi.')
      //   !this.$v.form.confirmPassword.minLength && errors.push('Password tidak boleh kurang dari 8 karakter.')
      //   !this.$v.form.confirmPassword.sameAs && errors.push('Password tidak sama.')
      //   return errors
      // },
    },

    methods: {
      moment,
      // function buat disable tanggal keluar kalo status karyawannya aktif
      isDateDisabled(status){
        this.is_active=true
        return !(status !== null && status === 'non aktif');
      },

      isEmailDisabled(email){
        if (this.currentEmail === email)
        {
          return true
        }
      },
      changeStatus(){
        if(this.form.status_pegawai==='aktif')
          this.form.tgl_keluar=''
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
        // console.log(this.form.tgl_gabung)
        // console.log(this.form.tgl_keluar)
        this.$v.$touch()
        // console.log(this.$v)
        if(!this.$v.$error) {
          console.log('2')
          if (this.inputType === 'Tambah')
            this.save()
          else if(this.inputType === 'Ubah')
            this.update()
        }
      },

      //read data product
      readData() {
        var url = this.$api + '/pegawai'
        this.$http.get(url, {
          headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('token')
          }
        }).then(response => {
          this.load = false
          this.karyawans = response.data.data
        })
      },

      readDataRole(){
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

      //simpan data produk
      save() {
        this.karyawan.append('id_role', this.form.id_role);
        this.karyawan.append('nama_pegawai', this.form.nama_pegawai);
        this.karyawan.append('jenis_kelamin', this.form.jenis_kelamin);
        this.karyawan.append('status_pegawai', this.form.status_pegawai);
        this.karyawan.append('tgl_gabung', this.form.tgl_gabung);
        this.karyawan.append('tgl_keluar', this.form.tgl_keluar);
        this.karyawan.append('no_telp_pegawai', this.form.no_telp_pegawai);
        this.karyawan.append('email', this.form.email);
        this.karyawan.append('password', this.form.password);
        console.log(this.form.password)

        console.log(this.form.tgl_gabung,'1')
        console.log(this.form.tgl_keluar,'2')
        var url = this.$api + '/pegawai/'
        this.loadingData = true
        this.$http.post(url, this.karyawan, {
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

      //ubah data karyawan
      update() {
        let newData = {
          id_role: this.form.id_role,
          nama_pegawai: this.form.nama_pegawai,
          jenis_kelamin: this.form.jenis_kelamin,
          status_pegawai: this.form.status_pegawai,
          tgl_gabung: this.form.tgl_gabung,
          tgl_keluar: this.form.tgl_keluar,
          no_telp_pegawai : this.form.no_telp_pegawai,
          email: this.form.email,
          password: this.form.password,
        }
        var url = this.$api + '/pegawai/' + this.editId;

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
          // console.log(this.nama_pegawai)
          if (this.currentEmail === this.form.email)
          {
            localStorage.setItem("nama", this.form.nama_pegawai)
          }
          let emailUser = this.form.email
          this.loadingData = false;
          this.close();
          this.readData(); //mengambil data
          this.resetForm();
          this.inputType = 'Tambah';
          if (this.currentEmail === emailUser)
          {
            setTimeout(() => window.location.reload(), 2000)
          }

        }).catch(error => {
          this.error_message=error.response.data.message;
          this.color="red"
          this.iconSnackbar ='mdi-alert-circle'
          this.snackbar=true;
          this.loadingData = false;
        })
      },

      updatePassword(){
        let newData = {
          newPassword: this.form.newPassword,
          confirmPassword: this.form.confirmPassword,
        }
        var url = this.$api + '/pegawai/' + this.editId;

        this.loadingData = true

        this.$http.post(url, newData, {
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
          console.log(typeof this.error_message)
          console.log()
          this.color="red"
          this.iconSnackbar ='mdi-alert-circle'
          this.snackbar=true;
          this.form.nama_pegawai = null //reset form.nama_customer
          this.loadingData = false;
        })
      },

      //hapus data produk
      deleteData() {
        this.loadingData = true
        //mengahapus data
        var url = this.$api + '/pegawai/' + this.deleteId;

        //data dihapus berdasarkan id
        this.$http.delete(url, {
          headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('token')
          }
        }).then(response => {
          this.error_message=response.data.message;
          this.color="green"
          this.snackbar=true;
          this.iconSnackbar ='mdi-check-circle'
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
          this.form.nama_pegawai = '' //reset
          this.snackbar=true;
          this.loadingData = false;
        })
      },

      editHandler(item){
        this.inputType = 'Ubah';
        this.editId = item.id_pegawai;
        this.form.id_role= item.id_role
        this.form.nama_pegawai= item.nama_pegawai
        this.form.jenis_kelamin= item.jenis_kelamin
        this.form.tgl_gabung= item.tgl_gabung
        this.form.tgl_keluar= item.tgl_keluar
        this.form.status_pegawai= item.status_pegawai
        this.form.email= item.email
        this.form.no_telp_pegawai = item.no_telp_pegawai
        this.dialog = true;
      },

      changePasswordHandler(item){
        this.editId = item.id_pegawai;
        this.dialogUpdatePassword = true;
        this.is_updatePassword=true
        this.inputType = 'Ubah Password';
      },

      deleteHandler(item){
        this.deleteId = item.id_pegawai;
        this.form.nama_pegawai = item.nama_pegawai
        this.dialogConfirm = true;
      },

      close() {
        this.$v.$reset()
        this.dialog = false
        this.dialogConfirm = false
        this.dialogUpdatePassword = false
        this.form.nama_pegawai = '' //reset
        this.inputType = 'Tambah';
      },

      cancel() {
        this.$v.$reset()
        this.resetForm();
        this.readData();
        this.dialog = false;
        this.dialogConfirm = false
        this.dialogUpdatePassword = false
        this.form.nama_pegawai = '' //reset
        this.inputType = 'Tambah';
      },

      resetForm() {
        this.$v.$reset()
        this.form = {
          id_role: null,
          nama_pegawai: '',
          jenis_kelamin: null,
          tgl_gabung: "",
          tgl_keluar: "",
          status_pegawai: null,
          no_telp_pegawai:'',
          email: '',
          password: '',
          newPassword: '',
          confirmPassword: '',
        };
      },
    },

    mounted() {
      this.load = true
      this.readData()
      this.readDataRole()
    },
  }
</script>

<style scoped>
tbody tr:nth-of-type(odd) {
  background-color: #707070 !important;
}
#list{
  background-color: rgba(255,255,255,0);
}

</style>