(function ($) {
    var Bonuses = {
        /**
         * Global DOM selectors used for JavaScript bindings
         * Translations comes from jsTranslations.html.twig template.
         */
        globals: {
            bonusFormSelector: '.js-bonus-form',
            promoCodeInputSelector: '.js-campaign-code',
            submitSelector: '.js-bonus-submit',
            publicBonusCLass: 'js-public-bonus',
            dataPropertyPromoCode: 'promo',
            alertType: 'warning'
        },

        translator: Object.create(TranslatorService),

        /**
         * Main app initialization.
         */
        init: function () {
            var $this = this;

            $(this.globals.submitSelector).click(function (event) {
                event.preventDefault();
                $this.throwSweetAlert($(event.target));
            });
        },

        /**
         * Will throw sweetalert if user press on any campaign.
         *
         * @param {jQuery} $button
         *
         * @private
         */
        throwSweetAlert: function ($button) {
            var $this = this;

            if (!$button.hasClass(this.globals.publicBonusCLass) && $(this.globals.promoCodeInputSelector).val() == '') {
                swal({
                        title: this.translator.translate('Hey...'),
                        text: this.translator.translate('You forgot to enter bonus code!'),
                        type: this.globals.alertType,
                        showCancelButton: false,
                        confirmButtonText: this.translator.translate('Ok'),
                        closeOnConfirm: true
                    });
            } else {
                swal({
                        title: this.translator.translate('Ready for action?'),
                        text: this.translator.translate('Are you really ready for this bonus?'),
                        type: this.globals.alertType,
                        showCancelButton: true,
                        confirmButtonText: this.translator.translate('Yes, I take it!'),
                        cancelButtonText: this.translator.translate('No'),
                        closeOnConfirm: false,
                        closeOnCancel: true,
                        showLoaderOnConfirm: true
                    }, function (isConfirm) {
                        $this.confirmedCallback(isConfirm, $button);
                    }
                );
            }
        },

        /**
         * Callback if user decides to participate in campaign.
         *
         * @param {boolean} isConfirm
         * @param {jQuery}  $buttonPressed
         *
         * @private
         */
        confirmedCallback: function (isConfirm, $buttonPressed) {
            if (isConfirm) {
                if ($buttonPressed.hasClass(this.globals.publicBonusCLass)) {
                    $(this.globals.promoCodeInputSelector).val($buttonPressed.data(this.globals.dataPropertyPromoCode));
                }
                $(this.globals.bonusFormSelector).submit();
            }
        }
    };
    var App = Object.create(Bonuses);
    App.init();
})(jQuery);
