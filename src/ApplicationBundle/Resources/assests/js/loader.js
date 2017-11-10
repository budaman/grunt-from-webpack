var Loader = {
    /**
     * Main app initialization.
     */
    init: function () {
    },
    /**
     * @Toggle Loader
     * @param {string} selector
     * @param {boolean} active
     */
    setLoader: function (selector, active) {
        if (active) {
            $(selector).addClass('is-active');

            return
        }
        $(selector).removeClass('is-active');
    }
};
/**
 * Initialize widget.
 * @type {Loader}
 */
Object.create(Loader).init();