(function ($) {
    var DatePicker = {
        /**
         * Global DOM selectors used for JavaScript bindings
         */
        globals: {
            purchaseButtonSelector: '.js-purchase-button',
            joinButtonSelector: '.js-btn-loyalty-join',
            alertType: 'warning',
            productIdInput: '#product_purchase_product',
            productPriceInput: '#product_purchase_price',
            productForm: '#js-product-purchase-form'
        },

        translator: Object.create(TranslatorService),

        /**
         * Main app initialization.
         */
        init: function () {
            this.initPurchaseSwal();
            this.initJoinSwal();
        },

        /**
         * @private
         */
        initPurchaseSwal: function () {
            var $this = this;

            $(this.globals.purchaseButtonSelector).click(function (event) {
                event.preventDefault();
                var $button = this;

                swal({
                        title: $this.translator.translate('Change tops to this discount?'),
                        type: $this.globals.alertType,
                        showCancelButton: true,
                        confirmButtonText: $this.translator.translate('Yes, change!'),
                        cancelButtonText: $this.translator.translate('No'),
                        closeOnConfirm: false,
                        closeOnCancel: true,
                        showLoaderOnConfirm: true
                    }, function (isConfirm) {
                        if (isConfirm) {
                            var $form = $($this.globals.productForm);

                            $($form.data('product-selector')).val($($button).data('product'));
                            $($form.data('price-selector')).val($($button).data('price'));

                            $form.submit();
                        }
                    }
                );
            });
        },

        /**
         * @private
         */
        initJoinSwal: function () {
            var $this = this;

            $(this.globals.joinButtonSelector).click(function () {
                event.preventDefault();
                var $button = this;

                swal({
                        title: $this.translator.translate('Activate TOP club program?'),
                        type: $this.globals.alertType,
                        showCancelButton: true,
                        confirmButtonText: $this.translator.translate('Yes, activate!'),
                        cancelButtonText: $this.translator.translate('No'),
                        closeOnConfirm: false,
                        closeOnCancel: true,
                        showLoaderOnConfirm: true
                    }, function (isConfirm) {
                        if (isConfirm) {
                            $($($button).data('form')).submit();
                        }
                    }
                );
            });
        }
    };
    var App = Object.create(DatePicker);
    App.init();
})(jQuery);
