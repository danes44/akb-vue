<template>
  <v-app>
    <div id="app">
      <v-app-bar app color="#ffffff" outlined elevate-on-scroll>
        <v-app-bar-nav-icon @click.stop="sidebarMenu = !sidebarMenu" >
          <v-img :src="require('../../assets/hamburgerbar2.svg')" max-width="30px"></v-img>
        </v-app-bar-nav-icon>

        <v-spacer></v-spacer>

        <v-list style="padding: 0" dense>
          <v-list-item class="px-2" >
            <v-list-item-avatar class="mr-3">
              <v-avatar size="40">
                {{ this.accName[0].toUpperCase() }}
              </v-avatar>
            </v-list-item-avatar>

            <v-list-item-content style="padding-top: 0; padding-bottom: 0; max-width: 140px;" class="float-right">
              <v-list-item-title class="font-weight-bold text-truncate">{{ this.accName[0].toUpperCase() + this.accName.slice(1) }}</v-list-item-title>
              <v-list-item-subtitle style="font-size: 10pt;" class="grey--text darken-4">{{ titleCase(this.role) }}</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
        </v-list>

      </v-app-bar>

      <v-navigation-drawer
          v-model="sidebarMenu"
          app
          floating
          :permanent="sidebarMenu"
      >
        <v-list-item class="px-9 py-9">
          <v-list-item-content class="text-truncate" >
            <v-img :src="require('../../assets/logoSidebar.svg')"></v-img>
          </v-list-item-content>
        </v-list-item>

        <v-list class="px-5 drawer" v-if="role==='Operasional Manager'">
          <v-list-item v-for="item in itemsManager" :key="item.title" link :to="item.href" class="px-3 my-3 rounded-lg">
            <v-list-item-icon class="px-3" >
              <v-icon  >{{ item.icon }}</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title class="listTab" color="#11111">{{ item.title }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>

          <v-list-item @click="logout" class="px-3 rounded-lg" style="margin-top: 40%">
            <v-list-item-icon class="px-3">
              <v-icon color="red">mdi-logout-variant</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title class="font-weight-bold" style="color: #D24848">Logout</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list>

        <v-list class="px-5 drawer" v-else-if="role==='Owner'">
          <v-list-item v-for="item in itemsOwner" :key="item.title" link :to="item.href" class="px-3 my-3 rounded-lg">
            <v-list-item-icon class="px-3" >
              <v-icon  >{{ item.icon }}</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title class="listTab" color="#11111">{{ item.title }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>

          <v-list-item @click="logout" class="px-3 rounded-lg" style="margin-top: 40%">
            <v-list-item-icon class="px-3">
              <v-icon color="red">mdi-logout-variant</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title class="font-weight-bold" style="color: #D24848">Logout</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list>

        <v-list class="px-5 drawer" v-else-if="role==='Kasir'">
          <v-list-item v-for="item in itemsKasir" :key="item.title" link :to="item.href" class="px-3 my-3 rounded-lg">
            <v-list-item-icon class="px-3" >
              <v-icon  >{{ item.icon }}</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title class="listTab" color="#11111">{{ item.title }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>

          <v-list-item @click="logout" class="px-3 rounded-lg" style="margin-top: 40%">
            <v-list-item-icon class="px-3">
              <v-icon color="red">mdi-logout-variant</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title class="font-weight-bold" style="color: #D24848">Logout</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list>

        <v-list class="px-5 drawer" v-else-if="role==='Waiter'">
          <v-list-item v-for="item in itemsWaiter" :key="item.title" link :to="item.href" class="px-3 my-3 rounded-lg">
            <v-list-item-icon class="px-3" >
              <v-icon  >{{ item.icon }}</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title class="listTab" color="#11111">{{ item.title }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>

          <v-list-item @click="logout" class="px-3 rounded-lg" style="margin-top: 40%">
            <v-list-item-icon class="px-3">
              <v-icon color="red">mdi-logout-variant</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title class="font-weight-bold" style="color: #D24848">Logout</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list>

        <v-list class="px-5 drawer" v-else-if="role==='Waiter dan Kasir'">
          <v-list-item v-for="item in itemsWaiterKasir" :key="item.title" link :to="item.href" class="px-3 my-3 rounded-lg">
            <v-list-item-icon class="px-3" >
              <v-icon  >{{ item.icon }}</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title class="listTab" color="#11111">{{ item.title }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>

          <v-list-item @click="logout" class="px-3 rounded-lg" style="margin-top: 40%">
            <v-list-item-icon class="px-3">
              <v-icon color="red">mdi-logout-variant</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title class="font-weight-bold" style="color: #D24848">Logout</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-navigation-drawer>

      <v-main>
        <v-container class="px-4 py-0 fill-height" fluid>
          <v-row class="fill-height">
            <v-col>
              <transition name="fade">
                <router-view></router-view>
              </transition>
            </v-col>
          </v-row>
        </v-container>
      </v-main>

    </div>
  </v-app>
</template>

<script>
export default {
  name: "Sidebar",
  computed:{
    // mini() {
    //   return (this.$vuetify.breakpoint.smAndDown) || this.toggleMini
    // },
  },
  data() {
    return {
      sidebarMenu: true,
      toggleMini: false,
      itemsManager: [
        { title:"Dashboard", href:"/dashboard", icon:"mdi-view-dashboard-outline"},
        { title:"Bahan", href:"/bahan", icon:"mdi-food-steak"},
        { title:"Customer", href:"/customer", icon:"mdi-account-supervisor-outline" },
        { title:"Karyawan", href:"/karyawan", icon:"mdi-account-group-outline" },
        { title:"Laporan", href:"/laporan", icon:"mdi-file-chart-outline" },
        { title:"Meja", href:"/meja", icon:"mdi-table-chair" },
        { title:"Menu", href:"/menu", icon:"mdi-room-service-outline" },
        { title:"Order", href:"/order", icon:"mdi-order-bool-ascending" },
        { title:"Reservasi", href:"/reservasi", icon:"mdi-book-account-outline" },
        { title:"Role", href:"/role", icon:"mdi-account-search-outline" },
        { title:"Stok", href:"/stok", icon:"mdi-archive-outline" },
        { title:"Transaksi", href:"/transaksi", icon:"mdi-cart-outline" },
      ],
      itemsOwner: [
        { title:"Dashboard", href:"/dashboard", icon:"mdi-view-dashboard-outline"},
        { title:"Karyawan", href:"/karyawan", icon:"mdi-account-group-outline" },
        { title:"Laporan", href:"/laporan", icon:"mdi-file-chart-outline" },
        { title:"Role", href:"/role", icon:"mdi-account-search-outline" },
      ],
      itemsWaiter: [
        { title:"Dashboard", href:"/dashboard", icon:"mdi-view-dashboard-outline"},
        { title:"Customer", href:"/customer", icon:"mdi-account-supervisor-outline" },
        { title:"Meja", href:"/meja", icon:"mdi-table-chair" },
        { title:"Menu", href:"/menu", icon:"mdi-room-service-outline" },
        { title:"Order", href:"/order", icon:"mdi-order-bool-ascending" },
        { title:"Reservasi", href:"/reservasi", icon:"mdi-book-account-outline" },
      ],
      itemsKasir: [
        { title:"Dashboard", href:"/dashboard", icon:"mdi-view-dashboard-outline"},
        { title:"Meja", href:"/meja", icon:"mdi-table-chair" },
        { title:"Order", href:"/order", icon:"mdi-order-bool-ascending" },
        { title:"Transaksi", href:"/transaksi", icon:"mdi-cart-outline" },
      ],
      itemsChef: [
        { title:"Dashboard", href:"/dashboard", icon:"mdi-view-dashboard-outline"},
        { title:"Bahan", href:"/bahan", icon:"mdi-food-steak"},
        { title:"Stok", href:"/stok", icon:"mdi-archive-outline" },
      ],
      itemsWaiterKasir: [
        { title:"Dashboard", href:"/dashboard", icon:"mdi-view-dashboard-outline"},
        { title:"Customer", href:"/customer", icon:"mdi-account-supervisor-outline" },
        { title:"Meja", href:"/meja", icon:"mdi-table-chair" },
        { title:"Menu", href:"/menu", icon:"mdi-room-service-outline" },
        { title:"Order", href:"/order", icon:"mdi-order-bool-ascending" },
        { title:"Reservasi", href:"/reservasi", icon:"mdi-book-account-outline" },
        { title:"Transaksi", href:"/transaksi", icon:"mdi-cart-outline" },
      ],
      load: false,
      snackbar: false,
      error_message: '',
      color: '',
      accName: localStorage.getItem('nama'),
      role: localStorage.getItem('role'),
    }
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
    logout(){
      this.snackbar=true;
      localStorage.removeItem('token')
      this.$router.go('/login');
      this.load = true
    }
  },
}
</script>

<style scoped>
.v-application {
  font-family: 'Open Sans', sans-serif !important;
  background-color: #f2f5f7 !important;
}

.v-avatar{
  border-radius: 0.3rem !important;
  color:white!important;
  background-color: #D24848;
}

.theme--light.v-list-item:not(.v-list-item--active):not(.v-list-item--disabled) {
  color: #111111!important;
}

.drawer .v-list-item--active {
  color: #ffffff!important;
  background-color: #111111 !important;
}

.listTab{
  font-size: 0.9rem;
}

/*.v-toolbar{*/
/*  box-shadow: none;*/
/*}*/




</style>