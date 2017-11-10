(function ($) {
    var Print = {
        /**
         * Global DOM selectors used for JavaScript bindings
         */
        globals: {
            printButtonSelector: '.js-print-button',
            dataAttribute: 'target',
            printBlockSelector: '#print-block',
            bodyPrintClass: 'modalprinter',
            bodySelector: 'body'
        },

        /**
         * Main app initialization.
         */
        init: function () {
            this.initPrint();
        },

        /**
         * @private
         */
        initPrint: function () {
            var $this = this;
            $(this.globals.printButtonSelector).on('click', function () {
                $this.print($(this).data($this.globals.dataAttribute));
            });
        },

        /**
         * @param {string} selector
         *
         * @private
         */
        print: function (selector) {
            $(this.globals.bodySelector).addClass(this.globals.bodyPrintClass);
            $(this.globals.printBlockSelector).html($(selector).html());
            window.print();
            $(this.globals.bodySelector).removeClass(this.globals.bodyPrintClass);
        }
    };
    var App = Object.create(Print);
    App.init();
})(jQuery);
