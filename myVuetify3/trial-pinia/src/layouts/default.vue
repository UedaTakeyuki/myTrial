<template>
  <Navbar
    titleStr="Demo App" :links="links" qrExp="けろけろせぶん"
  />
  <v-main>
    <router-view />
  </v-main>

  <AppFooter />
</template>

<script setup>
import {Navbar} from 'vuetify-nav3'
const links = [
  { icon: 'home', text: 'Home', route: '/'},
  { icon: 'about', text: 'About', route: '/about'},
]
//
</script>
