var formValidate = {
    /**
     * Global DOM selectors used for JavaScript bindings
     * Translations comes from jsTranslations.html.twig template.
     */
    globals: {
        selectors: {
            formGroup: '.form-group',
            inputErrorClass: 'is-invalid',
            inputErrorFeedback: '.invalid-feedback'
        }
    },
    /**
     * Main app initialization.
     */
    init: function () {
        this.resetForm('list_filter', 'button:reset', true);
    },
    /**
     * Add input error
     * @param {selector} $selector
     * @param {boolean} inputFeedback
     */
    addInputError: function ($selector, inputFeedback) {
        var $this = this;

        if (!$selector.hasClass($this.globals.selectors.inputErrorClass)) {
            $selector.addClass($this.globals.selectors.inputErrorClass);
            if (inputFeedback) {
                $selector.closest($this.globals.selectors.formGroup).find($this.globals.selectors.inputErrorFeedback).addClass($this.globals.selectors.inputErrorClass);
            }
        }
    },
    /**
     * Remove input error
     * @param {selector} $selector
     * @param {boolean} inputFeedback
     */
    removeInputError: function ($selector, inputFeedback) {
        var $this = this;

        if ($selector.hasClass($this.globals.selectors.inputErrorClass)) {
            $selector.removeClass($this.globals.selectors.inputErrorClass);
            if (inputFeedback) {
                $selector.closest($this.globals.selectors.formGroup).find($this.globals.selectors.inputErrorFeedback).removeClass($this.globals.selectors.inputErrorClass);
            }
        }
    },

    resetForm: function (formName, button, submit) {
        var $form = $('form[name="' + formName +'"]');
        $form.find(button).click(function () {
            $form
                .find(':radio, :checkbox').removeAttr('checked').end()
                .find('textarea, :text, select').val('');

            if (submit) {
                $form.submit();
            }

            return false;
        });
    }
};
/**
 * Initialize widget.
 * @type {formValidate}
 */
Object.create(formValidate).init();
