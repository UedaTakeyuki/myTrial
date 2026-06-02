<script setup>
import PocketBase from 'pocketbase'
const pb = new PocketBase('https://pocketbase.uedasoft.com');
const authData = await pb.collection("users").authWithPassword('hba01111@nifty.com', 'dista226');

// after the above you can also access the auth data from the authStore
console.log(pb.authStore.isValid);
console.log(pb.authStore.token);
console.log(pb.authStore.record.id);
console.log(pb.authStore.record.email);
console.log(pb.authStore.record.name);

// "logout" the last authenticated record
pb.authStore.clear();
</script>

<template>
  <h1>You did it!</h1>
  <p>
    Visit <a href="https://vuejs.org/" target="_blank" rel="noopener">vuejs.org</a> to read the
    documentation
  </p>
</template>

<style scoped></style>
