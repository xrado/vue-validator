define(function(require){

	var Vue = require('vendor/vue-0.11.0-rc3.min'),
		validator = require('validator');

	Vue.filter('JSON', function (value) {
		return JSON.stringify(value,null, "\t");
	});

	var App = new Vue({
		el: '#app',
		directives: {
			valid: validator
		},
		data: {
			validator: {},
			form: {
				name: '5',
				age: 0,
				check: false,
				pattern: '',
				email: ''
			}
		},
		computed: {
			isValid: function () {
				this.validator;

				return Object.keys(this.validator.form).every(function (key) {
					return this.validator.form[key].valid;
				}.bind(this));
			}
		}
	});

});

