<template>
  <router-view>
  </router-view>
</template>

<style>
@import url('https://fonts.googleapis.com/css2?family=Open+Sans:ital,wght@0,300;0,400;0,600;0,700;0,800;1,300;1,400;1,600;1,700;1,800&display=swap');
@import url('https://cdn.jsdelivr.net/npm/font-awesome@4.x/css/font-awesome.min.css');
@import url('https://cdn.jsdelivr.net/npm/@mdi/font@5.x/css/materialdesignicons.min.css');



:root {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  overflow-x: hidden;
}

body{
  font-family: 'Open Sans', sans-serif !important;
  font-weight: normal;
  color: #111111!important;
  background-color: #f2f5f7 !important;
}
.btn:hover {
  background-color: #242424 !important;
  text-decoration: none;
}
a {
  transition: color 0.3s ease-in-out;
}

a:hover{
  text-decoration: none!important;
}

.on-scrollbar{
  width: 0.3rem;
  scrollbar-width: 0.3rem !important; /* Firefox */
  -ms-overflow-style: none !important; /* IE 10+ */
}

.on-scrollbar::-webkit-scrollbar-track {
  -webkit-box-shadow: none !important;
  background-color: transparent !important;
}

.on-scrollbar::-webkit-scrollbar {
  width: 6px !important;
  background-color: transparent;
}

.on-scrollbar::-webkit-scrollbar-thumb {
  background-color: #acacac;
}

::-webkit-scrollbar {
  width: 0.3rem;
  -webkit-box-shadow: none !important;
}

::-webkit-scrollbar-thumb {
  background-color: #111111;
}

::-webkit-scrollbar-thumb:hover {
  background-color: #444;
  cursor: pointer;
}

::-webkit-scrollbar-track {
  background-color: #d7d7d7;
  -webkit-box-shadow: none !important;
}



.theme--light.v-list-item:hover:before {
  background-color: #4c4c4c;
}

/*.v-list-item .v-list-item__subtitle, .v-list-item .v-list-item__title {*/
/*  line-height: 1.2!important;*/
/*}*/

</style>
