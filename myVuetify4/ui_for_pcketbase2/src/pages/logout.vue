<script setup>
  import PocketBase from 'pocketbase'
  const pb = new PocketBase('https://pocketbase.uedasoft.com');
  pb.authStore.clear();
  location.reload();

</script>