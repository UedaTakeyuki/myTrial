<template>
  <v-app>
    <v-main>
      <Navbar
        titleStr="Demo App" :links="links" qrExp=""
      />
      <RouterLink to="/">Go to Home</RouterLink>
      <RouterLink to="/about">/Go to About</RouterLink>
      <router-view />
    </v-main>
  </v-app>
</template>

<script setup>
import {Navbar} from 'vuetify-nav3'
const links = [
      { icon: 'home', text: 'Home', route: '/'},
      { icon: 'about', text: 'About', route: '/about'},
    ]
 //
</script>
