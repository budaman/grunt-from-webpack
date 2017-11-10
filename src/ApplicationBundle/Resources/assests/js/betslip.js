(function ($) {
    var Betslip = {
        /**
         * Global DOM selectors used for JavaScript bindings
         */
        globals: {
            selectors: {
                removeEvent: '.js-betslip-remove-event',
                messageRemoveEvent: '.js-betslip-message-remove-event',
                eventActionState: 'is-betslip-in-action',
                eventItem: '.js-betslip-event-item',
                body: $('body'),
                innerBetslip: '#js-block-betslip-betslip'
            },
            betslipBlock: $('.js-betslip-block'),
            enabled: $('.js-betslip-block').length,
            betslipRowSelector: '.js-slip-row',
            systemConstantSelector: '#js-system-constant-select',
            eventsCount: $('.js-betslip-events-count'),
            endpoints: {
                router: Object.create(RouterService),
                toggle: function (event, selection) {
                    return this.router.buildPath(
                        '/api/v1/bet/toggle/{{event}}/{{selection}}',
                        {'{{event}}': event, '{{selection}}': selection}
                    );
                },
                remove: function (event, selection) {
                    return this.router.buildPath(
                        '/api/v1/bet/remove/{{event}}/{{selection}}',
                        {'{{event}}': event, '{{selection}}': selection}
                    );
                },
                uncheck: function (event, selection) {
                    return this.router.buildPath(
                        '/api/v1/bet/uncheck/{{event}}/{{selection}}',
                        {'{{event}}': event, '{{selection}}': selection}
                    );
                },
                changeType: function (type) {
                    return this.router.buildPath(
                        '/api/v1/bet/type/{{type}}',
                        {'{{type}}': type}
                    );
                },
                rearange: function (event, selection, position) {
                    return this.router.buildPath(
                        '/api/v1/bet/rearange/{{event}}/{{selection}}/{{position}}',
                        {'{{event}}': event, '{{selection}}': selection, '{{position}}': position}
                    );
                },
                updateBetAmount: function (betAmount, event, selection) {
                    if (typeof event != 'undefined' && typeof selection != 'undefined') {
                        return this.router.buildPath(
                            '/api/v1/bet/amount/update/{{event}}/{{selection}}?betAmount={{betAmount}}',
                            {'{{event}}': event, '{{selection}}': selection, '{{betAmount}}': betAmount}
                        );
                    }

                    return this.router.buildPath(
                        '/api/v1/bet/amount/update?betAmount={{betAmount}}',
                        {'{{betAmount}}': betAmount}
                    );
                },
                placeBet: function (step) {
                    return this.router.buildPath(
                        '/api/v1/bet/place/{{step}}',
                        {'{{step}}': step}
                    );
                },
                changeConstant: function (constant) {
                    return this.router.buildPath(
                        '/api/v1/bet/system/constant/{{constant}}',
                        {'{{constant}}': constant}
                    );
                },
                refresh: '/api/v1/bet/pull',
                addSystem: function (constant) {
                    return this.router.buildPath(
                        '/api/v1/bet/system/add/{{constant}}',
                        {'{{constant}}': constant}
                    );
                },
                removeSystem: function (constant, events) {
                    if (constant === null && events === null) {
                        return '/api/v1/bet/system/remove';
                    }

                    return this.router.buildPath(
                        '/api/v1/bet/system/remove/{{constant}}/{{events}}',
                        {'{{constant}}': constant, '{{events}}': events}
                    );
                },
                all: {
                    remove: '/api/v1/bet/all/remove',
                    check: '/api/v1/bet/all/check',
                    uncheck: '/api/v1/bet/all/uncheck'
                }
            }
        },

        busy: false,

        /**
         * Main app initialization.
         */
        init: function () {
            if (this.globals.enabled) {
                event_marker.refresh();
                this.onChangeInitBetslipSort();
                this.initToggleEventListener();
                this.initRemoveListener(this.globals.selectors.removeEvent, true);
                this.initRemoveListener(this.globals.selectors.messageRemoveEvent, false);
                this.initUncheckListener();
                this.initBetTypeChangeListener();
                this.initBetslipMassButtonsListener();
                this.initBetslipRowsSort();
                this.initBetAmountChangeListener();
                this.initPlaceBetButtonListener();
                this.initBackButton();
                this.initConstantChange();
                this.initAddSystemButtonListener();
                this.initRemoveSystemButtonListener();
            }
        },

        /**
         * listens to event when betslip dom tree is modified, and init row sorting.
         */
        onChangeInitBetslipSort: function(){
            var $this = this;
            $this.globals.betslipBlock.on('DOMSubtreeModified', function () {
                $this.initBetslipRowsSort();
                event_marker.refresh();
            });
        },

        /**
         * Back button just pulls all betslip data and replaces it with the current one.
         */
        initBackButton: function () {
            var $this = this;
            this.globals.betslipBlock.on('click', '.js-back-button', function () {
                $this.performRequest($this.globals.endpoints.refresh);
            });
        },

        /**
         * Place bet button.
         */
        initPlaceBetButtonListener: function () {
            var $this = this;

            this.globals.betslipBlock.on('click', '#js-place-bet', function (e) {
                e.preventDefault();
                $this.globals.selectors.body.addClass($this.globals.selectors.eventActionState);

                if (!$this.busy) {
                    $this.busy = true;

                    $.ajax({
                        type: "POST",
                        url: $this.globals.endpoints.placeBet($($this.globals.selectors.innerBetslip).data('step')),
                        data: $this.globals.betslipBlock.find("form").serialize(),
                        dataType: "json",
                        success: function (data) {
                            $this.busy = false;
                            $this.destroyBetslipRowsSort();

                            $this.globals.betslipBlock.html(data.html);
                            event_marker.refresh();

                        },
                        error: function () {
                            $this.busy = false;
                        },
                        complete: function () {
                            $this.globals.selectors.body.removeClass($this.globals.selectors.eventActionState);
                        }
                    });
                }
            });
        },

        /**
         * Will perform request to back-end once event is toggled.
         */
        initToggleEventListener: function () {
            var $this = this;

            $('.prelive-content').on('click', '.js-toggle-event', function () {
                var result = $(this).data('event').split('-');

                $this.performRequest($this.globals.endpoints.toggle(result[0], result[1]));
            });
        },

        /**
         * Will perform request to back-end once event is removed.
         */
        initRemoveListener: function (selector, rowSlideUp) {
            var $this = this;

            this.globals.betslipBlock.on('click', selector, function () {
                var row = $(this).parents($this.globals.betslipRowSelector);

                $this.globals.selectors.body.addClass($this.globals.selectors.eventActionState);
                if (rowSlideUp) {
                    row.slideUp(200, function () {
                        $this.performRequest($this.globals.endpoints.remove(row.data('event'), row.data('selection')));
                    });

                    return
                }

                $this.performRequest($this.globals.endpoints.remove(row.data('event'), row.data('selection')));
            });
        },

        /**
         * Will perform request to back-end once event is checked or unchecked.
         */
        initUncheckListener: function () {
            var $this = this;

            this.globals.betslipBlock.on('click', '.js-betslip-uncheck-event', function () {
                var row = $(this).parents($this.globals.betslipRowSelector);
                $this.performRequest($this.globals.endpoints.uncheck(row.data('event'), row.data('selection')));
            });
        },

        /**
         * Will perform request to back-end once bet type is changed.
         */
        initBetTypeChangeListener: function () {
            var $this = this;

            this.globals.betslipBlock.on('click', '.js-bet-type-change', function (e) {
                e.preventDefault();

                if (!$(this).hasClass('disabled') && !$(this).hasClass('active')) {
                    $this.performRequest($this.globals.endpoints.changeType($(this).data('type')));
                }
            });
        },

        /**
         * Listener for buttons like check all, unheck all and remove all.
         */
        initBetslipMassButtonsListener: function () {
            var $this = this;

            this.globals.betslipBlock.on('click', '.js-betslip-mass-button', function () {
                $this.globals.selectors.body.addClass($this.globals.selectors.eventActionState);
                $this.performRequest($this.globals.endpoints.all[$(this).data('action')]);
            });
        },

        /**
         * Will perform request to back-end when bet amount is changed.
         */
        initBetAmountChangeListener: function () {
            var $this = this;

            this.globals.betslipBlock.on('click', '.js-set-bet-amount', function () {
                $this.performRequest($this.globals.endpoints.updateBetAmount($(this).data('amount')));
            });

            this.globals.betslipBlock.on('change', '.js-event-bet-amount', function () {
                $this.performRequest($this.globals.endpoints.updateBetAmount(
                    $(this).val(),
                    $(this).data('event'),
                    $(this).data('selection')
                ));
            });

            this.globals.betslipBlock.on('change', '#bet_betAmount', function () {
                $this.performRequest($this.globals.endpoints.updateBetAmount($(this).val()));
            });
        },

        /**
         * Enabled sortable.
         */
        initBetslipRowsSort: function () {
            var $this = this;

            $('#betslip_rows').sortable({
                handle: '.handle',
                item: this.globals.betslipRowSelector,
                axis: 'y',
                cursor: 'move',
                update: function (event, ui) {
                    var item = ui.item;
                    $this.performRequest($this.globals.endpoints.rearange(
                        item.data('event'),
                        item.data('selection'),
                        item.index()
                    ));
                }
            });
            $this.initPushEventsCount($this.globals.selectors.eventItem, $this.globals.eventsCount);
        },

        /**
         * Will destroy sortable instance on betslip rows.
         */
        destroyBetslipRowsSort: function () {
            $('#betslip_rows').sortable('destroy');
        },

        /**
         * Will perform request to back-end.
         *
         * @param {string} url
         */
        performRequest: function (url) {
            if (!this.busy) {
                this.busy = true;
                var $this = this;
                $this.globals.selectors.body.addClass($this.globals.selectors.eventActionState);

                $.ajax({
                    url: url,
                    method: 'GET',
                    success: function (data) {
                        $this.busy = false;
                        $this.destroyBetslipRowsSort();
                        $this.globals.betslipBlock.html(data.html);
                        event_marker.refresh();
                    },
                    error: function () {
                        $this.busy = false;
                    },
                    complete: function () {
                        $this.globals.selectors.body.removeClass($this.globals.selectors.eventActionState);
                    }
                });
            }
        },

        /**
         * On change of constant - change form.
         */
        initConstantChange: function () {
            var $this = this;

            this.globals.betslipBlock.on('change', this.globals.systemConstantSelector, function () {
                $this.performRequest($this.globals.endpoints.changeConstant($(this).val()));
            });
        },

        /**
         * Add system button.
         */
        initAddSystemButtonListener: function () {
            var $this = this;

            this.globals.betslipBlock.on('click', '#js-system-add', function (e) {
                e.preventDefault();
                $this.globals.selectors.body.addClass($this.globals.selectors.eventActionState);

                if (!$this.busy) {
                    $this.busy = true;

                    $.ajax({
                        type: "POST",
                        url: $this.globals.endpoints.addSystem($($this.globals.systemConstantSelector).val()),
                        data: $this.globals.betslipBlock.find("#betslip_system_bet").find("select, textarea, input").serialize(),
                        dataType: "json",
                        success: function (data) {
                            $this.busy = false;
                            $this.destroyBetslipRowsSort();

                            $this.globals.betslipBlock.html(data.html);
                            event_marker.refresh();

                        },
                        error: function () {
                            $this.globals.busy = false;
                        },
                        complete: function () {
                            $this.globals.selectors.body.removeClass($this.globals.selectors.eventActionState);
                        }
                    });
                }
            });
        },

        /**
         * Remove single or all systems.
         */
        initRemoveSystemButtonListener: function () {
            var $this = this;

            this.globals.betslipBlock.on('click', '.js-remove-all-systems', function () {
                $this.performRequest($this.globals.endpoints.removeSystem(null, null));
            });

            this.globals.betslipBlock.on('click', '.js-remove-system', function () {
                var row = $(this).parents('.js-system');
                $this.performRequest($this.globals.endpoints.removeSystem(row.data('constant'), row.data('events')));
            });
        },

        /**
         * Get events count
         */
        initPushEventsCount: function ($items, $badge) {
            var $this = this,
                rowLength = $($items).length;

            $badge.html(rowLength);

            if (rowLength > 0) {
                $badge.removeClass('hidden');
            } else {
                $badge.addClass('hidden');
            }

            $badge.addClass('is-animating');
            setTimeout(function () {
                $this.globals.eventsCount.removeClass('is-animating');
            }, 800);
        }
    };
    var App = Object.create(Betslip);
    App.init();
})(jQuery);
