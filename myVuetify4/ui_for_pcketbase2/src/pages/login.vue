<script setup>
  import PocketBase from 'pocketbase'
  const pb = new PocketBase('https://pocketbase.uedasoft.com');
  const authData = await pb.collection("users").authWithPassword('hba01111@nifty.com', 'dista226');

</script>