import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

function importComponent(path) {
  return () => import(`../components/${path}.vue`)
}

const router = new VueRouter({
  mode: "history",
  routes: [
    {
      path: "/login",
      name: "login",
      meta: {title: 'Sign In - AKB'},
      component: importComponent('auth/Login'),
    },
    {
      path: "/",
      name: "sidebar",
      component: importComponent('admin/Sidebar'),
      children: [
        {
          path: "/dashboard",
          name: "dashboard",
          meta: {title: 'Dashboard - AKB'},
          component: importComponent('admin/view/Dashboard'),
        },
        {
          path: "/bahan",
          name: "bahan",
          meta: {title: 'Bahan - AKB'},
          component: importComponent('admin/view/Bahan'),
        },
        {
          path: "/customer",
          name: "customer",
          meta: {title: 'Customer - AKB'},
          component: importComponent('admin/view/Customer'),
        },
        {
          path: "/karyawan",
          name: "karyawan",
          meta: {title: 'Karyawan - AKB'},
          component: importComponent('admin/view/Karyawan'),
        },
        {
          path: "/laporan",
          name: "laporan",
          meta: {title: 'Laporan - AKB'},
          component: importComponent('admin/view/Laporan'),
        },
        {
          path: "/meja",
          name: "meja",
          meta: {title: 'Meja - AKB'},
          component: importComponent('admin/view/Meja'),
        },
        {
          path: "/menu",
          name: "menu",
          meta: {title: 'Menu - AKB'},
          component: importComponent('admin/view/Menu'),
        },
        {
          path: "/order",
          name: "order",
          meta: {title: 'Order - AKB'},
          component: importComponent('admin/view/Order'),
        },
        {
          path: "/reservasi",
          name: "reservasi",
          meta: {title: 'Reservasi - AKB'},
          component: importComponent('admin/view/Reservasi'),
        },
        {
          path: "/role",
          name: "role",
          meta: {title: 'Role Karyawan - AKB'},
          component: importComponent('admin/view/Role'),
        },
        {
          path: "/stok",
          name: "stok",
          meta: {title: 'Stok - AKB'},
          component: importComponent('admin/view/Stok'),
        },
        {
          path: "/transaksi",
          name: "transaksi",
          meta: {title: 'Transaksi - AKB'},
          component: importComponent('admin/view/Transaksi'),

        },
      ]
    },
    {
      path: '*',
      redirect: '/dashboard'
    },
  ],
});


//set judul
router.beforeEach((to, from, next) => {
  document.title = to.meta.title
  if(to.name !== 'login' && !localStorage.getItem('token')){
    next({
      path:'/login',
    })
  }

  next()
})

export default router
