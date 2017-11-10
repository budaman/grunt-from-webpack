(function ($) {
    var FormValidator = {
        /**
         * Global DOM selectors used for JavaScript bindings
         * Translations comes from jsTranslations.html.twig template.
         */
        globals: {
            formSelector: '.js-validate-form',
            submitButtonSelector: '.js-submit-form',
            inputErrorClass: 'has-danger'
        },

        /**
         * Main app initialization.
         */
        init: function () {
            var $this = this;
            $('input').change(function () {
                var $input = $(this);

                if ($input.closest('.form-group').hasClass($this.globals.inputErrorClass)) {
                    $input.closest('.form-group').removeClass($this.globals.inputErrorClass);
                }
            });
            $(this.globals.formSelector).submit(function ($event) {
                $event.preventDefault();

                $this.initFormValidations();
            });
        },

        /**
         * Before submiting form will check if it does not have any errors.
         */
        initFormValidations: function () {
            var $this = this,
                $hasErrors = false,
                $inputs = $(this.globals.formSelector + ' input:visible');

            $inputs.each(function () {
                var $input = $(this);
                if ($input.closest('.form-group').hasClass($this.globals.inputErrorClass)) {
                    $hasErrors = true;
                    $input.focus();

                    return false;
                }
            });

            if (!$hasErrors) {
                var $form = $(this.globals.formSelector);
                $form.unbind('submit');
                $form.submit();
            }
        }
    };
    var App = Object.create(FormValidator);
    App.init();
})(jQuery);
