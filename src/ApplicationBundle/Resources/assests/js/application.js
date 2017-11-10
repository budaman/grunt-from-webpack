(function ($) {
    var Application = {

        /**
         * Global DOM selectors used for JavaScript bindings.
         */
        globals: {
            selectors: {
                $body: $('body'),
                dropdown: '.dropdown',
                stateHeaderDropdownOpened: 'is-header-dropdown-opened',
                dropdownBtn: '[data-toggle="dropdown"]',
                dropdownMenuUnhide: '[data-unhide="true"], [data-unhide="true"] *',
                popperTooltip: '.js-popper-tooltip',
                popperTooltipRef: '.js-popper-tooltip-ref',
                initPopperTooltips: '.js-init-popper-tooltips',
                headerNotice: $('.js-header-notice'),
                header: $('#header'),
                headerMenu: $('.js-header-menu'),
                headerBonus: $('.js-header-bonus'),
                headerBonusContainer: $('.js-header-bonus-container'),
                headerBonusContainerMobile: $('.js-header-bonus-container-mobile'),
                landingGallery: $('.js-slider-landing'),
                carouselTopFive: $('.js-carousel-top-five')
            },
            confirmation: {
                cashout: '.button-cashout'
            },
            datePicker: '.js-date-range-picker',
            header: {
                stateStickyMenu: 'is-sticky-menu',
                stateStickyBar: 'is-sticky-bar',
                stateScrollingDown: 'is-scrolling-down'
            },
            navbar: {
                menu: '#navbarHeaderMenu',
                user: '#navbarHeaderUser',
                stateOpen: 'is-nav-opened'
            },
            showPassword: '.js-show-password',
            partners: '.js-partners',
            swipeMenu: {
                container: '.js-swipe-menu',
                next: '.js-swipe-menu-btn-next',
                stateActive: 'is-nav-item-active'
            }
        },

        /**
         * Main app initialization.
         */
        init: function () {
            this.bindConfirmationDialog(this.globals.confirmation.cashout);
            // this.initTooltip();
            // this.initDatePicker(); TODO
            utilities.makeSticky(this.globals.selectors.headerMenu, this.globals.header.stateStickyMenu);
            utilities.makeSticky(this.globals.selectors.header, this.globals.header.stateStickyBar);
            this.initMobileHeaderSticky(this.globals.selectors.header);
            this.initHeaderMenuToggle(this.globals.navbar.menu, this.globals.navbar.user);
            this.initHeaderMenuToggle(this.globals.navbar.user, this.globals.navbar.menu);
            this.initShowPassword(this.globals.showPassword);
            this.initCarouselPartners(this.globals.partners);
            this.initSwipeMenu(this.globals.swipeMenu.container, this.globals.swipeMenu.next, this.globals.swipeMenu.stateActive);
            this.initStopPropagation(this.globals.selectors.dropdownMenuUnhide);
            this.initDropdownOverlay(this.globals.selectors.stateHeaderDropdownOpened);
            this.initPopperTooltip();
            utilities.changeElementContainer(this.globals.selectors.headerBonus, this.globals.selectors.headerBonusContainer, this.globals.selectors.headerBonusContainerMobile, 767, true);
            this.initSlider(this.globals.selectors.landingGallery);
            this.initCarouselFiveItems(this.globals.selectors.carouselTopFive);
        },

        /**
         * Bind confirmation dialog.
         * @param {string} selector
         */
        bindConfirmationDialog: function (selector) {
            $(selector).on('click', function (e) {
                e.preventDefault();

                var $this = $(this);

                swal({
                    title: $this.data('title'),
                    type: 'warning',
                    confirmButtonText: $this.data('confirm'),
                    cancelButtonText: $this.data('cancel'),
                    showCancelButton: true
                }, function () {
                    window.location.href = $this.attr('href');
                });
            });
        },

        /**
         * Initialize tooltip.
         */
        initTooltip: function () {
            $('[data-toggle="tooltip"]').tooltip({});
        },

        /**
         * @private
         */
        initDatePicker: function () {
            $(this.globals.datePicker).daterangepicker({
                locale: {
                    format: 'YYYY-MM-DD',
                    applyLabel: '<span class="glyphicon glyphicon-ok"></span>',
                    cancelLabel: '<span class="glyphicon glyphicon-remove"></span>'
                },
                'buttonClasses': 'btn-daterange',
                'applyClass': 'btn-daterange-apply',
                'cancelClass': 'btn-daterange-cancel',
                'opens': 'right',
                singleDatePicker: true
            });
        },

        /**
         * Mobile Header Sticky Hide on scroll down
         * @param {selector} $header
         */
        initMobileHeaderSticky: function ($header) {
            var $this = this,
                docEl = document.documentElement,
                lastScrollTop = 0,
                scrollTop = 0,
                headerTop = $header.offset().top;

            $(window).on('scroll resize', function () {
                headerTop = $header.offset().top;
                scrollTop = (window.pageYOffset || docEl.scrollTop) - (docEl.clientTop || 0);

                if (scrollTop > lastScrollTop) {
                    //If menu opened
                    if ($(".navbar-collapse.show")[0]) {
                        return;
                    }
                    if (scrollTop >= headerTop + 75) {
                        $header.addClass($this.globals.header.stateScrollingDown);
                    }
                } else {
                    $header.removeClass($this.globals.header.stateScrollingDown);
                }
                lastScrollTop = scrollTop;
            });
        },

        /**
         * Header Menu Toggle
         * @param {string} btn
         * @param {string} target
         */
        initHeaderMenuToggle: function (btn, target) {
            var $this = this;

            $('[data-target="' + btn + '"]').on('click', function () {

                //Close target menu
                $('[data-target="' + target + '"]')
                    .attr('aria-expanded', false)
                    .addClass('collapsed');
                $(target).removeClass('show');

                //Toggle state class
                if ($(this).attr('aria-expanded') === 'false') {
                    $this.globals.selectors.$body.addClass($this.globals.navbar.stateOpen);
                } else {
                    $this.globals.selectors.$body.removeClass($this.globals.navbar.stateOpen);
                }
            });
        },

        /**
         * Toggle Show password
         * @param {string} selector
         */
        initShowPassword: function (selector) {
            $(selector).on('click', function () {
                $(this)
                    .parent()
                    .find('.form-control')
                    .attr('type', function (index, attr) {
                        if (attr === 'password') {
                            $(this).parent().addClass('is-active');

                            return 'text';
                        }
                        $(this).parent().removeClass('is-active');

                        return 'password';
                    });
            });
        },

        /**
         * Carousel Partners
         * @param {string} selector
         */
        initCarouselPartners: function (selector) {
            $(selector).owlCarousel({
                loop: true,
                margin: 2,
                nav: false,
                dots: false,
                responsive: {
                    0: {
                        items: 3
                    },
                    543: {
                        items: 4
                    },
                    767: {
                        items: 5
                    },
                    1023: {
                        items: 6
                    },
                    1279: {
                        items: 7
                    }
                }
            })
        },

        /**
         * Show password
         * @param {string} carousel
         * @param {string} btnNext
         * @param {string} menuItemActive
         */
        initSwipeMenu: function (carousel, btnNext, menuItemActive) {
            $(carousel).each(function () {
                var $this = $(this),
                    startPosition = $this.find('.' + menuItemActive).data('index'),
                    nextBtn = $this.parent().find(btnNext);

                $this.owlCarousel({
                    loop: false,
                    items: 1,
                    nav: false,
                    dots: false,
                    autoWidth: true,
                    startPosition: 0
                });

                //Scroll active menu item to position on visible area
                $(window).load(function () {
                    setTimeout(function () {
                        $this.trigger('to.owl.carousel', startPosition - 1);
                    }, 1);
                });

                //If swipe container smaller than menu items container show arrow (next btn)
                nextBtnControl();
                $this.on('changed.owl.carousel', function () {
                    nextBtnControl();
                });

                //Trigger carousel next
                $this.parent().find(btnNext).click(function () {
                    $this.trigger('next.owl.carousel');
                });

                function nextBtnControl() {
                    setTimeout(function () {
                        if ($this.find('.owl-item:last-child').hasClass('active')) {
                            nextBtn.removeClass('is-active');
                        } else {
                            nextBtn.addClass('is-active');
                        }
                    }, 500);
                }
            });
        },

        /**
         *  Stop Propagation
         *  @param {string} selector
         */
        initStopPropagation: function (selector) {
            $(selector).on('click', function (e) {
                e.stopPropagation();
            });
        },

        /**
         * Show overlay
         *  @param {string} stateClass
         */
        initDropdownOverlay: function (stateClass) {
            var $this = this;

            $($this.globals.selectors.dropdownBtn).on('click', function () {
                var attr = $(this).attr('data-overlay');

                if (typeof attr === typeof undefined && attr !== false) {
                    return
                }
                if ($(this).parent().hasClass('show')) {
                    $this.globals.selectors.$body.removeClass(stateClass);

                    return;
                }
                $this.globals.selectors.$body.addClass(stateClass);
            });

            $(document).mouseup(function (e) {
                var container = $($this.globals.selectors.dropdown);

                if (!container.is(e.target) && container.has(e.target).length === 0) {
                    $this.globals.selectors.$body.removeClass(stateClass);
                }
            });
        },

        /**
         * Initialize Popper Tooltip //https://popper.js.org/ (default with bootstrap 4 beta)
         */
        initPopperTooltip: function () {
            var $this = this;

            $($this.globals.selectors.popperTooltipRef).each(function () {
                $this.createPopperTooltip($(this));
            });
        },

        /**
         * Initialize Popper Tooltip
         *  @param {selector} $selector
         */
        createPopperTooltip: function ($selector) {
            var $this = this,
                $reference = $selector,
                $popper = $selector.parent().find($this.globals.selectors.popperTooltip);

            new Popper($reference, $popper, {
                placement: 'top-start',
                boundariesElement: $reference.parentNode
            });
        },

        /**
         * Init Slider
         *
         * @param {selector} $selector
         */
        initSlider: function ($selector) {
            $selector.owlCarousel({
                autoplay: true,
                autoplayTimeout: 5000,
                dots: true,
                items: 1,
                lazyLoad: true,
                loop: true,
                margin: 0
            });
        },

        /**
         * Init Carousel (items slider)
         *
         * @param {selector} $selector
         */
        initCarouselFiveItems: function ($selector) {
            $selector.owlCarousel({
                autoplay: true,
                autoplayTimeout: 3000,
                lazyLoad: true,
                dots: false,
                loop: true,
                margin: 6,
                responsive: {
                    0: {
                        items: 1,
                        dots: true
                    },
                    375: {
                        items: 2
                    },
                    568: {
                        items: 3
                    },
                    1024: {
                        items: 4
                    },
                    1280: {
                        items: 5,
                        autoplay: false
                    }
                }
            });
        }
    };

    /**
     * Initialize widget.
     * @type {Application}
     */
    Object.create(Application).init();
})(jQuery);
