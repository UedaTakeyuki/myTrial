<template>
<v-dialog
  v-model="isOpen"
  width="auto"
>
  <v-card
    max-width="400"
    prepend-icon="mdi-update"
    text="彡⌒ミ がいるぞ殺せ！"
  >

    <p>email:{{email}}</p>
    <p>pw:{{pw}}</p>
    <v-text-field
      class="mx-1"
      v-model="email"
      label="Email address"
      placeholder="johndoe@gmail.com"
      type="email"
    />
    <v-text-field
      class="mx-1"
      v-model="pw"
      hint="Enter your password to access this website"
      label="Password"
      type="input"
    />
    <v-btn
      class="ma-1"
    >
      Login
    </v-btn>

  </v-card>
</v-dialog>
</template>

<script setup>
  import { ref, onMounted } from 'vue'

// defineModel を使うことで、親の v-model と自動的に双方向同期されます
  const isOpen = defineModel({ type: Boolean, default: false })

  const email = ref("kerokero@keroro.co.jp")
  const pw = ref("1234")

  const login=()=>{
    
  }
</script>