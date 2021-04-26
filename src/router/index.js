import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

function importComponent(path) {
  return () => import(`../components/${path}.vue`)
}
const userRole = localStorage.getItem('role')
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
          // meta: {title: 'Bahan - AKB', owner:false, opsManager: true, waiter: false, kasir:false, chef:true},
          meta: {title: 'Bahan - AKB'},
          component: importComponent('admin/view/Bahan'),
          beforeEnter:((to,from,next)=>{
            if(userRole==="Operasional Manager" || userRole==="Chef")
              next()
            else {
              next({
                path: '/dashboard',
              })
            }
          }),
        },
        {
          path: "/customer",
          name: "customer",
          // meta: {title: 'Customer - AKB', owner:false, opsManager: true, waiter: true, kasir:false, chef:false},
          meta: {title: 'Customer - AKB'},
          component: importComponent('admin/view/Customer'),
          beforeEnter:((to,from,next)=>{
            if(userRole==="Operasional Manager" || userRole==="Waiter" || userRole==="Waiter dan Kasir")
              next()
            else {
              next({
                path: '/dashboard',
              })
            }
          }),
        },
        {
          path: "/karyawan",
          name: "karyawan",
          // meta: {title: 'Karyawan - AKB', owner:true, opsManager: true, waiter: false, kasir:false, chef:false},
          meta: {title: 'Karyawan - AKB'},
          component: importComponent('admin/view/Karyawan'),
          beforeEnter:((to,from,next)=>{
            if(userRole==="Operasional Manager" || userRole==="Owner")
              next()
            else {
              next({
                path: '/dashboard',
              })
            }
          }),
        },
        {
          path: "/laporan",
          name: "laporan",
          // meta: {title: 'Laporan - AKB',owner:true, opsManager: true, waiter: false, kasir:false, chef:false},
          meta: {title: 'Laporan - AKB'},
          component: importComponent('admin/view/Laporan'),
          beforeEnter:((to,from,next)=>{
            if(userRole==="Operasional Manager" || userRole==="Owner")
              next()
            else {
              next({
                path: '/dashboard',
              })
            }
          }),
        },
        {
          path: "/meja",
          name: "meja",
          // meta: {title: 'Meja - AKB',owner:true, opsManager: true, waiter: true, kasir:true, chef:false},
          meta: {title: 'Meja - AKB'},
          //yang bisa edit dan nambah meja cuma manager sama owner
          component: importComponent('admin/view/Meja'),
          beforeEnter:((to,from,next)=>{
            if(userRole==="Chef"){
              next({
                path: '/dashboard',
              })
            }
            else
              next()
          }),
        },
        {
          path: "/menu",
          name: "menu",
          // meta: {title: 'Menu - AKB',owner:false, opsManager: true, waiter: true, kasir:true, chef:true},
          meta: {title: 'Menu - AKB'},
          component: importComponent('admin/view/Menu'),
          beforeEnter:((to,from,next)=>{
            if(userRole==="Operasional Manager"){
              next()
            }
            else{
              next({
                path: '/dashboard',
              })
            }
          }),
        },
        // {
        //   path: "/order",
        //   name: "order",
        //   meta: {title: 'Order - AKB',owner:false, opsManager: false, waiter: false, kasir:false, chef:false},
        //   component: importComponent('admin/view/Order'),
        // },
        {
          path: "/reservasi",
          name: "reservasi",
          // meta: {title: 'Reservasi - AKB',owner:false, opsManager: true, waiter: true, kasir:false, chef:false},
          meta: {title: 'Reservasi - AKB'},
          component: importComponent('admin/view/Reservasi'),
          beforeEnter:((to,from,next)=>{
            if(userRole==="Operasional Manager" || userRole==="Waiter" || userRole==="Waiter dan Kasir")
              next()
            else {
              next({
                path: '/dashboard',
              })
            }
          }),
        },
        {
          path: "/role",
          name: "role",
          // meta: {title: 'Role Karyawan - AKB',owner:true, opsManager: true, waiter: false, kasir:false, chef:false},
          meta: {title: 'Role Karyawan - AKB'},
          component: importComponent('admin/view/Role'),
          beforeEnter:((to,from,next)=>{
            if(userRole==="Operasional Manager" || userRole==="Owner")
              next()
            else {
              next({
                path: '/dashboard',
              })
            }
          }),
        },
        {
          path: "/stok",
          name: "stok",
          // meta: {title: 'Stok - AKB',owner:false, opsManager: true, waiter: false, kasir:false, chef:true},
          meta: {title: 'Stok - AKB'},
          component: importComponent('admin/view/Stok'),
          beforeEnter:((to,from,next)=>{
            if(userRole==="Operasional Manager" || userRole==="Chef")
              next()
            else {
              next({
                path: '/dashboard',
              })
            }
          }),
        },
        {
          path: "/transaksi",
          name: "transaksi",
          // meta: {title: 'Transaksi - AKB',owner:false, opsManager: true, waiter: false, kasir:true, chef:false, waiterKasir:false},
          meta: {title: 'Transaksi - AKB'},
          component: importComponent('admin/view/Transaksi'),
          beforeEnter:((to,from,next)=>{
            if(userRole==="Operasional Manager" ||  userRole==="Waiter dan Kasir")
              next()
            else {
              next({
                path: '/dashboard',
              })
            }
          }),

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

  // if(to.meta.owner)
  // {
  //   if (userRole === 'Owner') {
  //     next()
  //   } else {
  //     next({
  //       path: '/dashboard',
  //     })
  //   }
  // }
  // else if(to.meta.opsManager)
  // {
  //   if (userRole === 'Operasional Manager') {
  //     next()
  //   } else {
  //     next({
  //       path: '/dashboard',
  //     })
  //   }
  // }
  // else if(to.meta.waiter)
  // {
  //   if (userRole === 'Waiter' || userRole === 'Waiter dan Kasir') {
  //     next()
  //   } else {
  //     next({
  //       path: '/dashboard',
  //     })
  //   }
  // }
  // else if(to.meta.kasir)
  // {
  //   if (userRole === 'Kasir' || userRole === 'Waiter dan Kasir') {
  //     next()
  //   } else {
  //     next({
  //       path: '/dashboard',
  //     })
  //   }
  // }
  // else if(to.meta.chef)
  // {
  //   if (userRole === 'Chef') {
  //     next()
  //   } else {
  //     next({
  //       path: '/dashboard',
  //     })
  //   }
  // }


  next()
})

export default router
