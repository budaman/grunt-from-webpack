(function ($) {
    var Notifications = {
        /**
         * Global DOM selectors used for JavaScript bindings
         */
        globals: {
            counter: null,
            audio: new Audio('/assets/admin/audio/Alarm.wav'),
            links: {
                feed: $(".notifications-menu").data("feed-url")
            },
            refresh: 25000,
            notifications: {
                badgeSelector: '.staff-notifications-badge',
                menuSelector: '.notifications-menu > a',
                notificationsSelector: '#notifications-menu',
                dropDownMenuSelector: '.dropdown-menu'
            }
        },

        /**
         * Main app initialization.
         */
        init: function () {
            this._getNotifications();
            this._bindNotificationsBadge();
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
        },

        /**
         * Bind notifications count refresh interval.
         *
         * @private
         */
        _bindNotificationsBadge: function () {
            var $this = this;
            setInterval(function () {
                $this._getNotifications();
            }, this.globals.refresh);
        },

        /**
         * Make ajax call for notifications count.
         *
         * @private
         */
        _getNotifications: function () {
            var $this = this;
            $.ajax({
                dataType: 'json',
                url: $this.globals.links.feed,
                success: function (data, status) {
                    if (status === 'success') {
                        $this.globals.counter = data.total;
                        $this._handleNotificationsCountResponse(data.total);
                        $this._handleNotificationsListResponse(data.notifications);
                        $this._initializeSlimScroll($this.globals.notifications.notificationsSelector);
                    }
                }
            });
        },

        /**
         * Handle notifications count response.
         *
         * @private
         */
        _handleNotificationsCountResponse: function (total) {
            var $badge = $(this.globals.notifications.badgeSelector);
            $badge.html(total);
            if ($badge.closest('a').hasClass('hidden')) {
                $badge.closest('a').removeClass('hidden');
            }
        },

        /**
         * Handle notifications list response.
         *
         * @private
         */
        _handleNotificationsListResponse: function (notifications) {
            var $dropdownMenu = $(this.globals.notifications.notificationsSelector);
            $dropdownMenu.html('');

            if (notifications.length > 0) {
                $(".notifications-menu .dropdown-menu").removeClass("hidden");
                $.each(notifications, function (index, value) {
                    if (value.count > 0) {
                        $dropdownMenu.append(
                            '<li><a href="' + value.url + '"><i class="fa ' + value.icon + '"></i> ' + value.count + ' ' + value.message + '</a></li>'
                        );
                    }
                });
            } else {
                $(".notifications-menu .dropdown-menu").addClass("hidden");
            }
        }
    };
    var App = Object.create(Notifications);
    App.init();
})(jQuery);
