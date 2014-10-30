define(function(require){

	var Vue = require('vendor/vue-0.11.0-rc3.min'),
		validator = require('validator');

	Vue.use(validator);

	Vue.filter('JSON', function (value) {
		return JSON.stringify(value,null, "\t");
	});

	var App = new Vue({
		el: '#app',
		data: {
			validator: {},
			form: {
				name: '',
				age: null,
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
			},
			isModified: function () {
				this.validator;

				return Object.keys(this.validator.form).some(function (key) {
					return this.validator.form[key].modified;
				}.bind(this));
			}
		},
		methods: {
			onSave: function () {
				alert('form is '+(this.$valid() ? 'VALID' : 'INVALID'));
			}
		}
	});

});

