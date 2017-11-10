(function ($) {
    var Prelive = {
        globals: {
            selectors: {
                searchButton: $('.js-search-button'),
                searchInput: $('.js-search-input'),
                searchToggleBtn: $('.js-search-toggle-btn'),
                searchToggleTarget: $('.js-search-toggle-target'),
                searchToggleState: 'is-active',
                sports: $('.js-prelive-sports'),
                sportsContainer: $('.js-prelive-sports-container'),
                sportsContainerMobile: $('.js-prelive-sports-container-mobile'),
                betslip: $('.js-betslip-block'),
                betslipContainer: $('.js-prelive-betslip-container'),
                betslipContainerMobile: $('.js-prelive-betslip-container-mobile'),
                gameFilter: $('.js-prelive-list-filter'),
                gameFilterContainer: $('.js-prelive-list-filter-container'),
                gameFilterContainerMobile: $('.js-prelive-list-menu-container-mobile'),
                slider: $('.js-prelive-slider'),
                sliderContainer: $('.js-prelive-slider-container'),
                sliderContainerMobile: $('.js-prelive-slider-container-mobile'),
                gallery: $('.js-slider-sport'),
                eventLoadMore: $('.js-prelive-load-more'),
                preliveFilterSticky: $('.js-prelive-filter-sticky'),
                stateStickyPreliveFilter: 'is-sticky-prelive-filter',
                preliveListFilterSticky: $('.js-prelive-list-filter-sticky'),
                stateStickyPreliveListFilter: 'is-sticky-prelive-list-filter',
                listForm: $('.js-prelive-list-form'),
                listFormExpandBtn: $('.js-prelive-list-form-expand'),
                listFormExpandStateClass: 'is-expanded'
            }
        },
        router: {
            routerObject: Object.create(RouterService),
            eventDetails: function (event) {
                return this.routerObject.buildPath(
                    '/api/v1/prelive/details/{{event}}',
                    {'{{event}}': event}
                );
            }
        },

        /**
         * Main app initialization.
         */
        init: function () {
            this.initSearch();
            this.initSearchToggle();
            utilities.changeElementContainer(this.globals.selectors.sports, this.globals.selectors.sportsContainer, this.globals.selectors.sportsContainerMobile, 767, true);
            utilities.changeElementContainer(this.globals.selectors.betslip, this.globals.selectors.betslipContainer, this.globals.selectors.betslipContainerMobile, 1279, true);
            utilities.changeElementContainer(this.globals.selectors.gameFilter, this.globals.selectors.gameFilterContainer, this.globals.selectors.gameFilterContainerMobile, 767, true);
            utilities.changeElementContainer(this.globals.selectors.slider, this.globals.selectors.sliderContainer, this.globals.selectors.sliderContainerMobile, 767, true);
            this.initSlider(this.globals.selectors.gallery);
            this.initLoadMoreEvents();
            utilities.makeSticky(this.globals.selectors.preliveFilterSticky, this.globals.selectors.stateStickyPreliveFilter);
            utilities.makeSticky(this.globals.selectors.preliveListFilterSticky, this.globals.selectors.stateStickyPreliveListFilter);
            utilities.initToggleClass(this.globals.selectors.listForm, this.globals.selectors.listFormExpandBtn, this.globals.selectors.listFormExpandStateClass);
        },

        /**
         * Loads more events and assigns to element "'.js-event-more-' + eventId"
         */
        initLoadMoreEvents: function () {
            var $this = this;

            this.globals.selectors.eventLoadMore.on('click', function () {
                var eventId = $(this).data('event');
                $.ajax({
                    type: "GET",
                    url: $this.router.eventDetails(eventId),
                    success: function (data) {
                        $('.js-event-more-' + eventId).html(data);
                    },
                    error: function (data) {
                        console.log(data);
                    }
                });
            });
        },

        /**
         * Init Search
         */
        initSearch: function () {
            var vm = this;

            this.globals.selectors.searchButton.on('click', function () {
                vm.searchQuery(vm.globals.selectors.searchInput.val());
            });
            this.globals.selectors.searchInput.on('keypress', function (e) {
                if (e.which === 13) {
                    vm.searchQuery(vm.globals.selectors.searchInput.val());
                }
            })
        },

        /**
         * @param {string} query
         */
        searchQuery: function (query) {
            var url = this.globals.selectors.searchInput.data('url');

            if (query && url) {
                window.location.replace(url + '/' + query);
            }
        },

        /**
         * Search form toggle in mobile
         */
        initSearchToggle: function () {
            var $this = this;

            $this.globals.selectors.searchToggleBtn.on('click', function () {
                $this.globals.selectors.searchToggleTarget.toggleClass($this.globals.selectors.searchToggleState);

                if ($this.globals.selectors.searchToggleTarget.hasClass($this.globals.selectors.searchToggleState)) {
                    setTimeout(function () {
                        document.getElementById("prelive-search").focus();
                    }, 300);
                }
            });

            $(document).mouseup(function (e) {
                var container = $this.globals.selectors.searchToggleTarget;

                if (!container.is(e.target) && container.has(e.target).length === 0) {
                    $this.globals.selectors.searchToggleTarget.removeClass($this.globals.selectors.searchToggleState);
                }
            });
        },
        /**
         * Init Slider
         *
         * @param {selector} slider
         */
        initSlider: function (slider) {
            slider.owlCarousel({
                autoplay: true,
                autoplayTimeout: 5000,
                dots: true,
                items: 1,
                lazyLoad: true,
                loop: true,
                margin: 0
            });
        }
    };

    /**
     * Initialize widget.
     *
     * @type {Loader}
     */
    Object.create(Prelive).init();
})(jQuery);
