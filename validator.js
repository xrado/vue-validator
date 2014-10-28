define(function (require, exports, module) {

	var Vue = require('vendor/vue-0.11.0-rc3.min'),
		_ = Vue.util;
	
	_.validators = {
		required: function (value) {
			if(typeof value == 'boolean') return value;
			return !((value == null) || (value.length == 0));
		},
		numeric: function (value) {
			return (/^-?(?:0$0(?=\d*\.)|[1-9]|0)\d*(\.\d+)?$/).test(value);
		},
		integer: function (value) {
			return (/^(-?[1-9]\d*|0)$/).test(value);
		},
		digits: function (value) {
			return (/^[\d() \.\:\-\+#]+$/).test(value);
		},
		alpha: function (value) {
			return (/^[a-zA-Z]+$/).test(value);
		},
		alphaNum: function (value) {
			return !(/\W/).test(value);
		},
		email: function (value) {
			return (/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/).test(value);
		},
		url: function (value) {
			return (/^(https?|ftp|rmtp|mms):\/\/(([A-Z0-9][A-Z0-9_-]*)(\.[A-Z0-9][A-Z0-9_-]*)+)(:(\d+))?\/?/i).test(value);
		},
		minLength: function (value,arg) {
			return value && value.length && value.length >= +arg;
		},
		maxLength: function (value,arg) {
			return value && value.length && value.length <= +arg;
		},
		length: function () {
			return value && value.length == +arg;
		},
		min: function (value,arg) {
			return value >= +arg;
		},
		max: function (value,arg) {
			return value <= +arg;
		},
		pattern: function (value,arg) {
			var match = arg.match(new RegExp('^/(.*?)/([gimy]*)$'));
			var regex = new RegExp(match[1], match[2]);
			return regex.test(value);
		}
	};

	return {
		priority: 801,
		bind: function () {
			var model = this.el.getAttribute(Vue.config.prefix+'model'),
				vm = this.vm;

			if(model) {
				this._model = model;
				if(!vm.$get('validator')) this.vm.$set('validator',{});
				if(!vm.$get('validator.'+model)) {
					vm.$set('validator.'+model, {_validate:{}});

					vm.$watch(model, function (value) {
						this.validate(model,value);
					}.bind(this));

					Vue.nextTick(function () {
						this.validate(model,this.vm.$get(model));
					}.bind(this));
				}
				vm.$set('validator.'+model+'._validate.'+(this.arg || this.expression), this.expression);
				vm.$set('validator.'+model+'.'+(this.arg || this.expression), false);
			}
		},
		validate: function (model,value) {
			var vm = this.vm,
				validate = this.vm.$get('validator.'+model+'._validate'),
				valid = true,
				skip = this.el.classList.contains('skip-validation');
			
			if(!skip) {
				Object.keys(validate).forEach(function (name) {

					if(!_.validators[name]) throw new Error('missing validator for '+name);

					var arg = vm.$get('validator.'+model+'._validate.'+name);
					var _valid = (name != 'required' && ((value == null) || (value.length == 0))) ? true : _.validators[name].call(this.el,value,arg);
					vm.$set('validator.'+model+'.'+name,_valid);
					if(valid && !_valid) valid = false;

				}.bind(this));
			}

			vm.$set('validator.'+model+'.valid',valid);

			if(valid) {
				_.removeClass(this.el,'invalid');
				_.addClass(this.el,'valid');
			} else {
				_.addClass(this.el,'invalid');
				_.removeClass(this.el,'valid');
			}
		},
		unbind: function () {
			if(this.vm.$get('validator.'+this._model)) this.vm.$delete('validator.'+this._model);
		}
	}
});