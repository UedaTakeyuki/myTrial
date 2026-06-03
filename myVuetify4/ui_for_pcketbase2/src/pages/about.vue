<template>
  
  <v-responsive
    class="mx-auto"
    max-width="344"
  >
    <p>email:{{email}}</p>
    <p>pw:{{pw}}</p>
    <v-text-field
      v-model="email"
      label="Email address"
      placeholder="johndoe@gmail.com"
      type="email"
    />
    <v-text-field
      v-model="pw"
      hint="Enter your password to access this website"
      label="Password"
      type="input"
    ></v-text-field>
  </v-responsive>
</template>

<script lang="ts" setup>
  import { ref, onMounted } from 'vue'
  import PocketBase from 'pocketbase'
  const email = ref("kerokero@keroro.co.jp")
  const pw = ref("1234")

  onMounted(async () => {
    console.log(`コンポーネントがマウントされました。`)
    const pb = new PocketBase('https://pocketbase.uedasoft.com');

    // Check if user is already logged in on page load
    const isLoggedIn = pb.authStore.isValid;
    const currentUser = pb.authStore.model;

    console.log(isLoggedIn)
    console.log(currentUser)

    const authData = await pb.collection("users").authWithPassword('hba01111@nifty.com', 'dista226');
    console.log(authData)

    // after the above you can also access the auth data from the authStore
    console.log(pb.authStore.isValid);
    console.log(pb.authStore.token);
    if (pb.authStore.isValid){
      console.log(pb.authStore.record.id);
      console.log(pb.authStore.record.email);
      console.log(pb.authStore.record.name);
    }

    // "logout" the last authenticated record
    // pb.authStore.clear();

  })
</script>