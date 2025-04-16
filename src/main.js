import Vue from "vue";
import init from "./init";

// Custom code : adding bootstrap to global
import BootstrapVue from 'bootstrap-vue';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-vue/dist/bootstrap-vue.css';
Vue.use(BootstrapVue); // Registers all BootstrapVue components and directives globally
Vue.config.productionTip = false;

init();
