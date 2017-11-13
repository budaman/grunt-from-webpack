(function ($) {
    var TOPSPORT = {
        /**
         * Global DOM selectors
         * used for JavaScript bindings
         */
        globals: {
            debit: {
                submitInput: '#debit_amount_amount'
            },
            wrapper: '#debit-amount-form-wrapper',
            label: '.label-info'
        },

        /**
         * Main app initialization
         */
        init: function () {
            this.showValue(this.globals.label);
            this.bindShowValue(this.globals.debit.submitInput);
            this.disableOnClick();
        },

        /**
         * Bind slider handler
         *
         * @param selector
         */
        bindShowValue: function (selector) {
            var $this = this;

            $(selector).on('input change', function () {
                $this.showValue($this.globals.label);
            });
        },

        /**
         * Display value on button
         *
         * @param selector
         */
        showValue: function (selector) {
            var amount = $(this.globals.debit.submitInput).val(),
                currency = $(this.globals.wrapper).data('currency');

            $(selector).html(amount + ' ' + currency);
        },

        disableOnClick: function () {
            $(this.globals.wrapper).children('form').submit(function() {
                $("button[type='submit']", this)
                    .prop('disabled', 'disabled');
                return true;
            });
        }
    };

    var App = Object.create(TOPSPORT);
    App.init();
})(jQuery);