(function ($) {
    var DateDiff = {
        /**
         * Global DOM selectors used for JavaScript bindings
         */
        globals: {
            elementSelector: '#js-date-diff',
            dataFrom: 'from',
            dataTo: 'to'
        },

        /**
         * Main app initialization.
         */
        init: function () {
            moment.locale(LOCALE);



            this.updateDateDiff();
        },

        /**
         * Will update elements contents with time difference between data-to and data-from properties.
         */
        updateDateDiff: function () {
            $(this.globals.elementSelector).html(moment.duration(this.getDateDiff()).humanize());
        },

        /**
         * Will return time difference between two dates set on elementSelector.
         *
         * @return {int}
         */
        getDateDiff: function () {
            var $element = $(this.globals.elementSelector);

            return moment($element.data(this.globals.dataTo)).diff(moment($element.data(this.globals.dataFrom)));
        }
    };
    var App = Object.create(DateDiff);
    App.init();
})(jQuery);
