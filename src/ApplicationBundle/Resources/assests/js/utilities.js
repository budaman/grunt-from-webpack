var utilities = {

    /**
     * Global DOM selectors used for JavaScript bindings
     * Translations comes from jsTranslations.html.twig template.
     */
    globals: {
        selectors: {
            positionStateMob: 'is-position-mob',
            positionStatePc: 'is-position-pc'
        }
    },

    /**
     * Main app initialization.
     */
    init: function () {},

    /**
     * On responsive detach element and append it to target container
     *
     * @param {selector} $el
     * @param {selector} $elContainer
     * @param {selector} $targetContainer
     * @param {number} responsiveStep
     * @param {bool} bindEvent
     */
    changeElementContainer: function ($el, $elContainer, $targetContainer, responsiveStep, bindEvent) {
        var $this = this,
            $isMob = $this.globals.selectors.positionStateMob,
            $isPc = $this.globals.selectors.positionStatePc;

        $(document).on('ready', function () {
            if ($this.getClientWidth() <= responsiveStep) {
                $this.appendEl($el, $targetContainer, $isMob, $isPc);
            } else {
                $this.appendEl($el, $elContainer, $isPc, $isMob);
            }
        });
        if ($this.getClientWidth() <= responsiveStep) {
            if ($el.hasClass($isPc)) {
                $this.appendEl($el, $targetContainer, $isMob, $isPc);
            }
        } else {
            if ($el.hasClass($isMob)) {
                $this.appendEl($el, $elContainer, $isPc, $isMob);
            }
        }
        if (bindEvent) {
            $(window).on('resize', function () {
                $this.changeElementContainer($el, $elContainer, $targetContainer, responsiveStep, false);
            });
        }
    },

    /**
     * Detach element and append it to target container
     *
     * @param {selector} $element
     * @param {selector} $target
     * @param {string} classAdd
     * @param {string} classRemove
     */
    appendEl: function ($element, $target, classAdd, classRemove) {
        $target.append($element.detach().addClass(classAdd).removeClass(classRemove));
    },

    /**
     * Get correct screen width
     *
     * @returns {Number|number|*}
     */
    getClientWidth: function () {
        var w = window,
            d = document,
            e = d.documentElement,
            g = d.getElementsByTagName('body')[0];

        return w.innerWidth || e.clientWidth || g.clientWidth
    },

    /**
     *
     * @param {selector} $elParent
     * @param {string} stateClass
     */
    makeSticky: function ($elParent, stateClass) {
        if (!$elParent.length) {
            return;
        }

        var docEl = document.documentElement,
            scrollTop = 0,
            elTop = $elParent.offset().top;

        $(window).on('scroll resize', function () {
            elTop = $elParent.offset().top;
            scrollTop = (window.pageYOffset || docEl.scrollTop) - (docEl.clientTop || 0);
            if (scrollTop >= elTop) {
                $elParent.addClass(stateClass);
            } else {
                $elParent.removeClass(stateClass);
            }
        });
    },

    /**
     * Toggle class
     *
     * @param {selector} $el
     * @param {selector} $btn
     * @param {string} stateClass
     */
    initToggleClass: function ($el, $btn, stateClass) {
        $btn.on('click', function () {
            $el.toggleClass(stateClass);
        });
    }
};

/**
 * Initialize widget.
 * @type {utilities}
 */
Object.create(utilities).init();
