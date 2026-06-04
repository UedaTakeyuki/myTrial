<template>
  <v-card
    v-show="true"
    title="Sign Up"
    width="331"
  >
    <v-card-item>
      <v-text-field
        v-model="name"
        label="Name"
        placeholder="Jane Doe"
        type="name"
      />

      <v-text-field
        v-model="email"
        label="Email address"
        placeholder="johndoe@gmail.com"
        type="email"
      />
      <span v-if="serversideErrors.email">{{ serversideErrors.email.message }}</span>

      <PwInput 
        v-model="pw"
        :rules=passwordRules
      />
      <span v-if="serversideErrors.password">{{ serversideErrors.password.message }}</span>

      <PwInput 
        v-model="pw2"
        label="Password Confirm"
        hint="Confirm password"
        :rules="[matchRule]"
      />
      <span v-if="serversideErrors.passwordConfirm">{{ serversideErrors.passwordConfirm.message }}</span>
      
      <!-- 一般的なエラー（システムエラーなど）の表示 -->
      <p v-if="serversideErrors.message" style="color: red;">{{ serversideErrors.message }}</p>

    </v-card-item>
    <v-card-actions class="justify-end">
      <v-btn
        icon="mdi-check"
        color="primary"
        @click.once="signUpUser"
      >
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script setup>
  import { ref, onMounted } from 'vue'
  import PocketBase from 'pocketbase'
  import PwInput from '@/components/PwInput.vue'

  // two-way bindings
  const email = ref()
  const pw = ref()
  const pw2 = ref()
  const name = ref()
  const serversideErrors = ref({})

  // Sign Up
  const signUpUser = async ()=>{
    // registered
    serversideErrors.value = {}

    const pb = new PocketBase('https://pocketbase.uedasoft.com');
    const data = {
      "email": email.value,
      "password": pw.value,
      "passwordConfirm": pw2.value,
      "name": name.value
    };

    try {
      // 'users' is the default auth collection in PocketBase
      const record = await pb.collection('users').create(data);
      
      console.log('Successfully registered:', record.id);

      // login with registered email & pw
      const authData = await pb.collection("users").authWithPassword(email.value, pw.value);
      location.reload();

    } catch (err) {
      console.error('Registration failed:', err.data);
      if (err.response && err.response.data) {
        serversideErrors.value = err.response.data;
      } else {
        serversideErrors.value = { message: '予期せぬエラーが発生しました。' };
      }
    }
  }

  // Rule: general pw rules
  const passwordRules = [
    v => !!v || 'Cannot be blank.',
    v => (v && v.length >= 8) || 'Must be at least 8 character(s).',
  ]

  // Rule: value of pw2 should match with pw
  const matchRule = (value) => (value == pw.value) || 'password not match.'

</script>