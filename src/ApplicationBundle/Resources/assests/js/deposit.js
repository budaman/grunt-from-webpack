(function ($) {
    var Deposit = {
        /**
         * Main app initialization.
         */
        init: function () {
            $('.js-deposit-quick-input').on('click', function () {
                var pushedButton = $(this);

                $(pushedButton.data('target')).val(pushedButton.data('amount'));
            });
        }
    };

    /**
     * Initialize widget.
     * @type {Deposit}
     */
    Object.create(Deposit).init();
})(jQuery);
