vue-validator
=============

form validator for vue 0.11

__usage:__

    var Vue = require('vue')
    var validator = require('vue-validator')
    Vue.use(validator)

in template

    <input type="text" v-model="name" v-valid="required,minLength:3,alpha">

means.. name is required, must be at least 3 character length and only alphabetic characters. If all this rules are satisfied input will get valid class otherwise invalid. Validator status is held in vm.validator. See demo.js for more examples of usage.

__v-valid options:__

* required
* numeric
* integer
* digits
* alpha
* alphaNum
* email
* url
* minLength: min string length
* maxLength: max string length
* length: string length
* min: number value
* max: number value
* pattern: regex
* group: group name


__validator data:__

* valid - input is valid
* invalid - input is modified and invalid
* modified - input is modified (current value != start value)


__methods added to VM:__

* $valid([group]) - return if true if form is valid (group is optional)
* $modified([group]) - return if true if form is modified (group is optional)


DEMO
----

[http://xrado.github.io/vue-validator/](http://xrado.github.io/vue-validator/)



TODO
----

* may still need some tweaking
* tests