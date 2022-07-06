<template>
  <div>
     <div class="text-white text-center font-bold p-5 mb-4"
      v-if="reg_show_alert" :class="reg_alert_variant">
      {{ reg_alert_msg }}
     </div>
    <VeeForm :validation-schema="valSchema"
      @submit="register" :initial-values="userData" >
      <!-- Name -->
      <div class="mb-3">
        <label class="inline-block mb-2">Name</label>
        <VeeField name="name" type="text"
          class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition
            duration-500 focus:outline-none focus:border-black rounded"
          placeholder="Enter Name" />
        <ErrorMessage class="text-red-600" name="name" />
      </div>
      <!-- Email -->
      <div class="mb-3">
        <label class="inline-block mb-2">Email</label>
        <VeeField name="email" type="email"
          class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition
            duration-500 focus:outline-none focus:border-black rounded"
          placeholder="Enter Email" />
        <ErrorMessage class="text-red-600" name="email" />
      </div>
      <!-- Age -->
      <div class="mb-3">
        <label class="inline-block mb-2">Age</label>
        <VeeField name="age" type="number"
          class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition
            duration-500 focus:outline-none focus:border-black rounded" />
        <ErrorMessage class="text-red-600" name="age" />
      </div>
      <!-- Password -->
      <div class="mb-3">
        <label class="inline-block mb-2">Password</label>
        <!-- :bails="false" allows us to output multiple errors for each field,
          without it only 1 error will get output at once -->
        <VeeField name="password" type="password" :bails="false" v-slot="{ field, errors }" >
          <input type="password" class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition
            duration-500 focus:outline-none focus:border-black rounded" placeholder="Password" v-bind="field" />
          <div  class="text-red-600" v-for="error in errors" :key="error">
            {{ error }}
          </div>
        </VeeField>

      </div>
      <!-- Confirm Password -->
      <div class="mb-3">
        <label class="inline-block mb-2">Confirm Password</label>
        <VeeField name="confirm_password" type="password"
          class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition
            duration-500 focus:outline-none focus:border-black rounded"
          placeholder="Confirm Password" />
        <ErrorMessage class="text-red-600" name="confirm_password" />
      </div>
      <!-- Country -->
      <div class="mb-3">
        <label class="inline-block mb-2">Country</label>
        <VeeField as="select" name="country"
          class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition
            duration-500 focus:outline-none focus:border-black rounded">
          <option value="Australia">Australia</option>
          <option value="New Zealand">New Zealand</option>
          <option value="China">China</option>
          <option value="Antarctica">Antarctica</option>
        </VeeField>
        <ErrorMessage class="text-red-600" name="country" />
      </div>
      <!-- TOS -->
      <div class="mb-1 pl-6">
        <VeeField type="checkbox" name="tos" value="1"  class="w-4 h-4 float-left -ml-6 mt-1 rounded" />
        <label class="block">Accept terms of service</label>              
      </div>
      <div class="mb-3">
        <ErrorMessage class="text-red-600" name="tos" />
      </div>
      <button type="submit" :disabled="reg_in_submission"
        class="block w-full bg-purple-600 text-white py-1.5 px-3 rounded transition
          hover:bg-purple-700">
        Submit
      </button>
    </VeeForm>       

  </div> 
</template>

<script>
  export default {
    name: 'RegisterForm',
    data() {
      return {
        valSchema: {
          name: 'required|min:3|max:100|alpha_spaces',
          email: 'required|min:3|max:100|email',
          age: 'required|min_value:18|max_value:110',
          password: 'required|min:5|max:100',
          confirm_password: 'passwords_mismatch:@password',
          country: 'required|country_excluded:Antarctica',
          tos: 'tos'
        },
        userData: {
          country: 'Australia',
        },
        reg_in_submission: false,
        reg_show_alert: false,
        reg_alert_variant: 'bg-blue-500',
        reg_alert_msg: 'Please wait! Your account is being created.',
      };
    },
    methods: {
      async register(values) {
        this.reg_show_alert = true;
        this.reg_in_submission = true;
        this.reg_alert_variant = 'bg-blue-500';
        this.reg_alert_msg = 'Please wait! Your account is being created.';

        try {
          // dispatching the 'register' action to the store (Vuex)
          await this.$store.dispatch('register', values);
        } catch (error) {
          this.reg_in_submission = false;
          this.reg_alert_variant = 'bg-red-500';
          this.reg_alert_msg = 'Registration unsuccessful. Please try again later.';
          console.log(error);
          return;
        };

        this.reg_alert_variant = 'bg-green-500';
        this.reg_alert_msg = 'Success! Your account has been created.';
        window.location.reload();
      }
    },
  };
</script>

