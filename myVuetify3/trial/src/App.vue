<template>
  <v-app>
    <v-main>
      <v-app-bar :elevation="2">
        <template v-slot:prepend>
          <v-app-bar-nav-icon></v-app-bar-nav-icon>
        </template>

        <v-app-bar-title>Application Bar</v-app-bar-title>
      </v-app-bar>
      <RouterLink to="/">Go to Home</RouterLink>
      <RouterLink to="/about">/Go to About</RouterLink>
      <router-view />
    </v-main>
  </v-app>
</template>

<script setup>
  //
</script>
