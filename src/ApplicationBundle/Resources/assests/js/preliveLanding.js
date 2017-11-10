(function ($) {
    var PreliveLanding = {
        globals: {
            selectors: {
                superBetTabs: $('.js-super-bet-tab'),
                superBetContent: $('.js-super-bet-content'),
                popBetTabs: $('.js-pop-bet-tab'),
                popBetTabsContent: $('.js-pop-bet-content'),
                lastMinuteBetTabs: $('.js-last-minutes-bet-tab'),
                lastMinuteBetContent: $('.js-last-minutes-bet-content'),
                BCLiveWidget: $('#bcsportsbookiframe-widget'),
                comboWidget: $('.js-daily-combo-widget'),
                comboWidgetButton: $('.js-daily-combo-button'),
                betSlipBlock: $('.js-betslip-block')
            }
        },
        router: {
            routerObject: Object.create(RouterService),
            dailyComb: '/api/v1/prelive/combo/bet',
            widgetTabs: function (type, sport) {
                return this.routerObject.buildPath(
                    '/api/v1/prelive/landing/tabs/{{type}}/{{sport}}',
                    {'{{type}}': type, '{{sport}}': sport}
                );
            }
        },

        /**
         * Main app initialization.
         */
        init: function () {
            this.initLoadSuperBetsTabs();
            this.initLoadPopBetsTabs();
            this.initLoadLastMinuteBetTabs();
            this.initBcLiveWidget();
            this.initComboWidget();

        },

        initComboWidget: function () {
            var $this = this;
            if ($this.globals.selectors.comboWidget.length !== 0) {

                var timeoutID;
                var currentBetAmount = 5;
                var minBetAmount = 5;
                var maxBetAmount = 100;
                var maxWinAmount = 10000;
                var coefValue = parseFloat($this.globals.selectors.comboWidgetButton.data('kof'));

                $this.globals.selectors.comboWidgetButton.on('click', function () {
                    $.post(
                        $this.router.dailyComb,
                        {
                            'events': $(this).data('events'),
                            'betAmount': currentBetAmount
                        }
                    ).success(function (data) {
                        $this.globals.selectors.betSlipBlock.html(data.html);
                        event_marker.refresh();
                    }).error(function (data) {
                        console.log(data);
                    })
                });

                setTimeout(function () {
                    updateAmount();
                }, 3000);

                function updateAmount() {
                    var newBetAmount = parseInt(Math.floor(Math.random() * (maxBetAmount - minBetAmount - 1) + minBetAmount).toFixed(0));
                    var kf = 100 * coefValue;

                    if (newBetAmount > maxBetAmount || newBetAmount * coefValue > maxWinAmount) {
                        clearTimeout(timeoutID);
                        return;
                    }

                    $('.js-win-amount').html(parseFloat(Math.round(newBetAmount * kf) / 100).toFixed(2));
                    currentBetAmount = newBetAmount;
                    timeoutID = setTimeout(updateAmount, 3000);
                }
            }

        },

        initBcLiveWidget: function () {
            var $this = this;
            if ($this.globals.selectors.BCLiveWidget.length !== 0) {
                window.addEventListener("message", function (message) {
                    var path = $this.globals.selectors.BCLiveWidget.data('path');

                    if (message.data.action === "open_game") {
                        // trackGaEvent("bc-events-slideshow-widget", 'click', window.location.pathname);
                        window.location = path + "?type=1&sport=" + message.data.data.sportId +
                            "&region=" + message.data.data.regionId +
                            "&game=" + message.data.data.gameId +
                            "&competition=" + message.data.data.competitionId;
                    }
                }, false);
            }
        },

        initLoadSuperBetsTabs: function () {
            var $this = this;

            $this.globals.selectors.superBetTabs.on('show.bs.tab', function () {
                $this.getContent('superBets', $(this).data('sport'), $this.globals.selectors.superBetContent);

            });
        },

        initLoadPopBetsTabs: function () {
            var $this = this;

            $this.globals.selectors.popBetTabs.on('show.bs.tab', function () {
                $this.getContent('popularBets', $(this).data('sport'), $this.globals.selectors.popBetTabsContent);

            });
        },

        initLoadLastMinuteBetTabs: function () {
            var $this = this;

            $this.globals.selectors.lastMinuteBetTabs.on('show.bs.tab', function () {
                $this.getContent('lastMinuteBets', $(this).data('sport'), $this.globals.selectors.lastMinuteBetContent);
            });
        },

        getContent: function (method, sportId, callback) {
            var $this = this;
            var response = '';
            $.ajax({
                type: "GET",
                url: $this.router.widgetTabs(method, sportId),
                success: function (data) {
                    callback.html(data);
                    event_marker.refresh();
                },
                error: function (data) {
                    console.log(data);
                }
            });
            return response;
        }
    };
    /**
     * Initialize widget.
     *
     * @type {Loader}
     */
    Object.create(PreliveLanding).init();
})(jQuery);
