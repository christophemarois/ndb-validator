ndb-validator
=============

An unintrusive jQuery form validator.

###Install

Add `ndb-validator.js` to your project.

###Example

**HTML**

```html

<form id="register">

	<input type="text" name="name" data-v-required="true" data-v-minlength="4" data-v-pattern="name">
	<input type="text" name="email" data-v-required="true" data-v-pattern="email">
	<input type="text" name="password" data-v-required="true" data-v-min-strength="4" data-v-differs-from="name, email">
	<input type="text" name="password-confirm" data-v-required="true" data-v-equal-to="password">
	<input type="checkbox" name="accept-tos" data-v-must-check="true">
	
</form>
```

**Javascript**

```javascript

$("#register").ndbValidator({
	showErrors: function (input, errors) {},
	hideErrors: function (input) {}
});

```

###License

This software is licensed under the MPL.