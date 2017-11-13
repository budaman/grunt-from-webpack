(function ($) {
    var Feed = {

        /**
         * Global DOM selectors used for JavaScript bindings
         */
        globals: {
            links: {
                mailbox: {
                    count: '/api/v1/mail/count',
                    feed: '/api/v1/mail/unread'
                },
                messages: {
                    count: '/api/v1/database/count',
                    feed: '/api/v1/database/messages'
                }
            },
            selector: {
                mailbox: {
                    badgeSelector: '.mail-box-badge',
                    menuSelector: '.mailbox-messages > a',
                    wrapper: '#mailbox'
                },
                messages: {
                    badgeSelector: '.database-messages-box-badge',
                    menuSelector: '.database-messages > a',
                    wrapper: '#database'
                },
                dropDownMenuSelector: '.dropdown-menu'
            },
            refresh: 30000
        },

        /**
         * Main app initialization.
         */
        init: function () {
            if ($(this.globals.selector.mailbox.menuSelector).length) {
                this._initMailbox();
            }

            if ($(this.globals.selector.messages.menuSelector).length) {
                this._initDatabaseMessages();
            }
        },

        /**
         * Initialize mailbox messages.
         *
         * @private
         */
        _initMailbox: function () {
            this._getMessageCount(
                this.globals.links.mailbox.count,
                this.globals.selector.mailbox.badgeSelector
            );

            this._bindMessageBadge(
                this.globals.links.mailbox.count,
                this.globals.selector.mailbox.badgeSelector
            );

            this._bindMessagesSummaryButton(
                this.globals.links.mailbox.feed,
                this.globals.selector.mailbox.menuSelector,
                this.globals.selector.mailbox.wrapper
            );
        },

        /**
         * Initialize database messages.
         *
         * @private
         */
        _initDatabaseMessages: function () {
            this._getMessageCount(
                this.globals.links.messages.count,
                this.globals.selector.messages.badgeSelector
            );

            this._bindMessageBadge(
                this.globals.links.messages.count,
                this.globals.selector.messages.badgeSelector
            );

            this._bindMessagesSummaryButton(
                this.globals.links.messages.feed,
                this.globals.selector.messages.menuSelector,
                this.globals.selector.messages.wrapper
            );
        },

        /**
         * Make ajax call for count.
         *
         * @private
         */
        _getMessageCount: function (route, selector) {
            var $this = this;

            $.ajax({
                dataType: 'json',
                url: route,
                success: function (data, status) {
                    if (status === 'success') {
                        $this._handleMessageCountResponse(selector, data);
                    }
                }
            });
        },

        /**
         * Handle mail message count response.
         *
         * @private
         */
        _handleMessageCountResponse: function (selector, data) {
            var $badge = $(selector);

            if(data.count !== 0) {
                $badge.html(data.count);
            }

            if ($badge.closest('a').hasClass('hidden')) {
                $badge.closest('a').removeClass('hidden');
            }
        },

        /**
         * Bind message refresh interval.
         *
         * @private
         */
        _bindMessageBadge: function (route, selector) {
            var $this = this;

            setInterval(function () {
                $this._getMessageCount(route, selector);
            }, this.globals.refresh);
        },

        /**
         * Bind summary button.
         *
         * @param route
         * @param button
         * @param wrapper
         * @private
         */
        _bindMessagesSummaryButton: function (route, button, wrapper) {
            var $this = this;

            $(button).on('click', function (event) {
                event.preventDefault();

                $(this).parent().find('.dropdown-menu').load(route, function () {
                    $this._initializeSlimScroll(wrapper);
                });
            });
        },

        /**
         * Initialize slim scroll.
         *
         * @param selector
         * @private
         */
        _initializeSlimScroll: function (selector) {
            $(selector).one().slimScroll({
                height: '200px',
                alwaysVisible: false,
                size: '3px'
            });
        }
    };

    var App = Object.create(Feed);
    App.init();
})(jQuery);