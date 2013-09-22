// No-damn-bullsh* validator
//
// $(form).ndbValidator({
//   showErrors: function (input, errors) {},
//   hideErrors: function (input) {}
// });

(function($) {

  // Create namespace.
  if (!$.ndbValidator) $.ndbValidator = {};

  // Binding function
  $.fn.ndbValidator = function (params) {

    var $this = this;

    var showErrors = params.showErrors || $.noop;
    var hideErrors = params.hideErrors || $.noop;

    return $this.each(function() {

      var $form = $(this);

      // Prevent HTML5 validation
      $form.attr('novalidate', 'novalidate');

      // Bind submit function
      $form.submit(function(e) {

        // Prevent form from submitting
        e.preventDefault(); e.stopPropagation();

        // Run validation over every element
        $form.find('input').each(function(){
          $.ndbValidator.validateInput(this, showErrors, hideErrors);
        });

        // Check if there are validation errors
        var errorsFound = false;
        
        $form.find('input').not('[type="submit"]').each(function(){
          if( $(this).data('validation-error') ) errorsFound = true;
        });

        if ( errorsFound ) {

          // It there has been errors, trigger error messages
          $form.data('submit-failed', true);

          // Run validation over every element
          $form.find('input').each(function(){
            $.ndbValidator.validateInput(this, showErrors, hideErrors);
          });

        } else {

          // Unbind this event
          $form.unbind(e);

          // Submit form
          return $form.submit();

        }

      });

      // Mark all fields as erroneous at first
      $form.find('input').data('validation-error', true);
      
      // Bind events
      $form.bind('keyup focusout change', function(){
        $.ndbValidator.validateInput(this, showErrors, hideErrors)
      });

    });

  };

  // Validating function
  $.ndbValidator.validateInput = function(element, showErrors, hideErrors){

    // Get input and value
    var $input = $(element);
    var val = $input.val();

    // Shortcuts for attributes
    var regexp            = $input.data('v-pattern'),
        required          = $input.data('v-required'),
        minlength         = $input.data('v-minlength'),
        email             = $input.data('v-email'),
        equal_to          = $input.data('v-equal-to'),
        differs_from      = $input.data('v-differs-from'),
        must_check        = $input.data('v-must-check');
        
    var password_strength = parseInt($input.data('v-password-strength'));

    // Error definitions (in order of importance)
    var errors = {
      regexp:            !!regexp        && !regexp.test(val),
      required:          !!required      && val.length <= 0,
      minlength:         !!minlength     && val.length < parseInt(minlength, 0),
      email:             !!email         && !$.ndbValidator.regexps.email.test(val),
      equal_to:          !!equal_to      && val != $('input[name="' + equal_to + '"]').val(),
      differs_from:      !!differs_from  && val == differsFromSelector(differs_from).val(),
      must_check:        !!must_check    && !$input[0].checked,
      password_strength: !!password_strength && zxcvbn(val).score < password_strength;
    };

    // Check for errors in inputs rules
    var key, errorCatched;
    
    for(key in errors){
      if(errors[key]) errorCatched = true;
    }

    if (errorCatched) {

      // Make an array of errors
      var errorArray = [];
      
      for(var key in errors) {
        if(errors[key]) errorArray.push(key);
      }

      // Show error on element
      showErrors($input, errorArray);
      $input.data('validation-error', true);

    } else {

       // Remove error on element
       if ($input.data('validation-error')){
          hideErrors($input);
          $input.data('validation-error', false);
       }

    }

  };

  // Differs from rule helper. Takes a string
  // rule 'name, email' and converts it to jquery
  // selector $('input[name="name"], input[name="email"]')
  $.ndbvalidator.differsFromSelector = function(attribute){

    var selector = [];

    // Remove whitespace and split with commas
    attribute = attribute.replace(/\s/g, '').split(',');

    $.each(attribute, function(i, element){
      selector.push('input[name="' + element + '"]');
    });

    return $(selector.join(','));

  };
  
  // Regular expressions
  $.ndbValidator.regexps = {
    // by Scott Gonzalez: http://projects.scottsplayground.com/email_address_validation/
    email: /^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))$/i
  };

})($);