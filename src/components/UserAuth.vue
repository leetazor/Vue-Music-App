<template>
  <div class="fixed z-10 inset-0 overflow-y-auto" id="modal"
  :class="{ hidden: !authModalShow }">
    <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center
      sm:block sm:p-0">
      <div class="fixed inset-0 transition-opacity">
        <div class="absolute inset-0 bg-gray-800 opacity-75"></div>
      </div>

      <!-- This element is to trick the browser into centering the modal contents. -->
      <span class="hidden sm:inline-block sm:align-middle sm:h-screen">&#8203;</span>

      <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden
        shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">

        <!-- Add margin if you want to see some of the overlay behind the modal-->
        <div class="py-4 text-left px-6">
          <!--Title-->
          <div class="flex justify-between items-center pb-4">
            <p class="text-2xl font-bold">Your Account</p>
            <!-- Modal Close Button -->
            <div class="modal-close cursor-pointer z-50" @click.prevent="toggleAuthModal" >
              <i class="fas fa-times"></i>
            </div>
          </div>

          <!-- Tabs -->
          <ul class="flex flex-wrap mb-4">
            <li class="flex-auto text-center">
              <a class="block rounded py-3 px-4 transition" href="#" @click.prevent="(tab = 'login')"
                :class="{
                'hover:text-white text-white bg-blue-600': tab === 'login',
                'hover:text-blue-600': tab === 'register' 
                }">Login</a>
            </li>
            <li class="flex-auto text-center">
              <a class="block rounded py-3 px-4 transition"
                href="#" @click.prevent="(tab = 'register')"
                 :class="{
                'hover:text-blue-600': tab === 'login',
                'hover:text-white text-white bg-blue-600': tab === 'register' 
                }"
                >Register</a>
            </li>
          </ul>

          <!-- Login Form -->
          <form v-show="(tab === 'login')">
            <!-- Email -->
            <div class="mb-3">
              <label class="inline-block mb-2">Email</label>
              <input type="email"
                class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition
                  duration-500 focus:outline-none focus:border-black rounded"
                placeholder="Enter Email" />
            </div>
            <!-- Password -->
            <div class="mb-3">
              <label class="inline-block mb-2">Password</label>
              <input type="password"
                class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition
                  duration-500 focus:outline-none focus:border-black rounded"
                placeholder="Password" />
            </div>
            <button type="submit"
              class="block w-full bg-purple-600 text-white py-1.5 px-3 rounded transition
                hover:bg-purple-700">
              Submit
            </button>
          </form>
          <!-- Registration Form -->
          <VeeForm v-show="(tab === 'register')" :validation-schema="valSchema"
            @submit="register" >
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
                <input class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition
                  duration-500 focus:outline-none focus:border-black rounded" placeholder="Password" v-bind="field" />
                <div  class="text-red-600" v-for="error in errors" :key="error">
                  {{ error }}
                </div>
              </VeeField>
              <ErrorMessage class="text-red-600" name="password" />
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
                <option value="USA">Australia</option>
                <option value="Mexico">New Zealand</option>
                <option value="Germany">China</option>
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
            <button type="submit"
              class="block w-full bg-purple-600 text-white py-1.5 px-3 rounded transition
                hover:bg-purple-700">
              Submit
            </button>
          </VeeForm>
       
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapMutations, mapState } from 'vuex';

export default {
  name: 'UserAuth',
  data() {
    return {
      tab: 'login',
      valSchema: {
        name: 'required|min:3|max:100|alpha_spaces',
        email: 'required|min:3|max:100|email',
        age: 'required|min_value:18|max_value:110',
        password: 'required|min:5|max:100',
        confirm_password: 'confirmed:@password',
        country: 'required|excluded:Antarctica',
        tos: 'required'
      }
    }
  },
  computed: {

    ...mapState(['authModalShow']),

    // mapping state, using Aliases:
    // ...mapState({
    //   authModal: 'authModalShow',
    //   }),    

    // getAuthModalShow() {
    //   return this.$store.getters.getAuthModalShow;
    // },
  },
  methods: {
    ...mapMutations(['toggleAuthModal']),
    register(values) {
      console.log(values);
    }
  },
};

</script>
