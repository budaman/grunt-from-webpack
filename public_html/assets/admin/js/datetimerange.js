(function ($) {
    var Datetimerange = {
        /**
         * Global vars
         */
        globals: {},

        /**
         * Main app initialization.
         */
        init: function () {
            var $this = this;
            $('.js-date-range-input').each(function () {
                $this.bindTextInput($(this));
            });
        },

        /**
         * Loads translated ranges to object keys
         * @type {{}}
         */
        getDateRanges: function (input) {
            var ranges = {};
            ranges[input.data('trans-today')] = [
                moment().startOf('day'),
                moment().endOf('day')
            ];
            ranges[input.data('trans-yesterday')] = [
                moment().subtract(1, "days").startOf('day'),
                moment().subtract(1, "days").endOf('day')
            ];
            ranges[input.data('trans-last7days')] = [
                moment().subtract(7, "days").startOf('day'),
                moment().endOf('day')
            ];
            ranges[input.data('trans-last30days')] = [
                moment().subtract(30, "days").startOf('day'),
                moment().endOf('day')
            ];
            ranges[input.data('trans-this-month')] = [
                moment().startOf('month'),
                moment().endOf('day')
            ];

            return ranges;
        },

        /**
         * Binds daterangepicker to input
         * @param {string} input
         */
        bindTextInput: function (input) {
            var dateFromInput = $('#' + input.data('from-id'));
            var dateToInput = $('#' + input.data('to-id'));

            moment.updateLocale(input.data('locale'));

            input.daterangepicker({
                autoUpdateInput: true,
                startDate: moment(dateFromInput.val()),
                endDate: moment(dateToInput.val()),
                locale: {
                    cancelLabel: input.data('trans-clear'),
                    applyLabel: input.data('trans-apply'),
                    customRangeLabel: input.data('trans-custom-range'),
                    monthNames: moment.months(),
                    'format': input.data('format')
                },
                "timePicker": true,
                "timePicker24Hour": true,
                "ranges": this.getDateRanges(input)
            });

            input.on('apply.daterangepicker', function (ev, picker) {
                $(this).val(picker.startDate.format(picker.startDate.format(input.data('format'))) + ' - ' + picker.endDate.format(input.data('format')));
                dateFromInput.val(picker.startDate.format(input.data('format')));
                dateToInput.val(picker.endDate.format(input.data('format')));
            });

            input.on('cancel.daterangepicker', function () {
                $(this).val('');
            });
        }
    };

    var App = Object.create(Datetimerange);
    App.init();
})(jQuery);
