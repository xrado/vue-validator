vue-validator
=============

form validator for vue 0.11


_v-valid options_

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


_validator data_

* valid - input is valid
* invalid - input is modified and invalid
* modified - input is modified (current value != start value)


_methods added to VM_

* $valid([group]) - return if true if form is valid (group is optional)
* $modified([group]) - return if true if form is modified (group is optional)


DEMO
----

[http://xrado.github.io/vue-validator/](http://xrado.github.io/vue-validator/)



TODO
----

* may still need some tweaking
* tests
