var event_marker = {

    globals:{
        selectors:{
            betButtonActivePattern: '.js-toggle-event[data-event="__selection__"]'
        }
    },

    /**
     * Main app initialization.
     */
    init: function () {
        this.refresh();
    },

    refresh: function () {
        var events = [];

        $('.js-toggle-event.is-active').removeClass('is-active');

        if ($('#js-block-betslip-betslip').length) {
            events = $('#js-block-betslip-betslip').data('events').events;
        }
        var $this = this;
        events.forEach(function (event) {
            var selector = $this.globals.selectors.betButtonActivePattern.replace('__selection__', event.event_selection);
            $(selector).addClass('is-active');
        });
    }
};
/**
 * Initialize widget.
 */
Object.create(event_marker).init();
