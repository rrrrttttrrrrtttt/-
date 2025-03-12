import Vue from 'vue';
import Toasted from 'vue-toasted';

Vue.use(Toasted, {
  duration: 5000,
  position: 'top-right',
});

Vue.prototype.$toast = Vue.toasted;
