;(function () {

	var install = function (Vue, options) {
		var _ = Vue.util;

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

		// Helpers

		var checkIf = function (prop,validatorData,group) {
			var stack = [];

			function iterate(obj) {
				for (var property in obj) {
					if (obj.hasOwnProperty(property)) {
						if (typeof obj[property] == "object" && !obj[property]._validate) {
							iterate(obj[property]);
						} else {
							if(!group || (obj[property]._validate.group && group == obj[property]._validate.group)) stack.push(obj[property])
						}
					}
				}
			}

			iterate(validatorData,group);

			if(prop == 'valid') {
				return stack.every(function (d) {
					return d.valid;
				})
			}

			if(prop == 'modified') {
				return stack.some(function (d) {
					return d.modified;
				})
			}
		};

		// Directive

		Vue.directive('valid', {
			priority: 801,
			bind: function () {
				var model = this.el.getAttribute(Vue.config.prefix+'model'),
					vm = this.vm,
					startValue;

				if(!vm.$valid){
					vm.$valid = function (group) {
						vm.$emit('validate');
						return checkIf('valid',vm.validator,group);
					}

					vm.$modified = function (group) {
						return checkIf('modified',vm.validator,group);
					}
				}

				if(model) {
					this._model = model;
					if(!vm.$get('validator')) this.vm.$set('validator',{});
					if(!vm.$get('validator.'+model)) {
						vm.$set('validator.'+model, {_validate:{}});

						// if invalid check as you type
						this._onChange = vm.$watch(model, function (value) {
							vm.$set('validator.'+model+'.modified', value !== startValue);
							if(vm.$get('validator.'+model+'.invalid')) this.validate(model,true);
						}.bind(this));

						// if valid or not modified check on blur
						this._onBlur = function () {
							var value = this.vm.$get(model);
							this.validate(model,value !== startValue);
						}.bind(this);
						_.on(this.el,'blur', this._onBlur);

						// validate all
						this._onValidate = vm.$on('validate', function () {
							this.validate(model,true);
						}.bind(this));

						Vue.nextTick(function () {
							startValue = this.vm.$get(model);
							this.validate(model);
						}.bind(this));
					}

					vm.$set('validator.'+model+'._validate.'+(this.arg || this.expression), this.expression);

					if(this.arg != 'group') vm.$set('validator.'+model+'.'+(this.arg || this.expression), false);
				}
			},
			validate: function (model,modifying) {
				var vm = this.vm,
					value = vm.$get(model);
				validate = this.vm.$get('validator.'+model+'._validate'),
					valid = true,
					skip = this.el.classList.contains('skip-validation');

				if(!skip) {
					Object.keys(validate).forEach(function (name) {
						if(name == 'group') return;
						if(!_.validators[name]) throw new Error('missing validator for '+name);

						var arg = vm.$get('validator.'+model+'._validate.'+name);
						var _valid = (name != 'required' && ((value == null) || (value.length == 0))) ? true : _.validators[name].call(this,value,arg);
						vm.$set('validator.'+model+'.'+name,_valid);

						if(valid && !_valid) valid = false;

					}.bind(this));
				}

				vm.$set('validator.'+model+'.valid',valid);
				vm.$set('validator.'+model+'.invalid',modifying && !valid);

				if(modifying) {
					this.el.classList.remove('valid');
					this.el.classList.remove('invalid');

					if(valid) {
						this.el.classList.add('valid');
					} else {
						this.el.classList.add('invalid');
					}
				}

			},
			unbind: function () {
				if(this.vm.$get('validator.'+this._model)) this.vm.$delete('validator.'+this._model);
				if(this._onBlur) _.off(this.el,'blur',this._onBlur);
				if(this._onValidate) this._onValidate();
			}
		});
	};

	if (typeof exports == "object") {
		module.exports = install;
	} else if (typeof define == "function" && define.amd) {
		define([], function(){ return install; })
	} else if (window.Vue) {
		Vue.use(install)
	}

})();