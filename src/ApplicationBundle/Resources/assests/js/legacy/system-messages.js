(function ($) {
    var SystemMessages = {

        /**
         * Messages list array.
         */
        html: '',

        /**
         * If messages list have been saw once.
         */
        initialized: false,

        /**
         * Unread messages array.
         */
        unread: [],

        /**
         * Global DOM selectors used for JavaScript bindings.
         */
        globals: {
            route: {
                unread: '{{base}}/api/v1/notify/unread?ts_secret={{token}}',
                pull: '{{base}}/api/v1/notify/pull?_locale={{locale}}&count={{count}}&start={{page}}&ts_secret={{token}}',
                read: '{{base}}/api/v1/notify/read?_locale={{locale}}&count={{count}}&start={{page}}&ts_secret={{token}}'
            },
            pagination: {
                page: 1,
                next: 1,
                limit: 10
            },
            selectors: {
                container: '#notifications',
                overlay: '.notification-backdrop',
                bell: '#notification-bell',
                wrapper: '.js-notifications-wrapper',
                notification: '.js-notifications-badge',
                notificationsNone: '.js-notifications-none',
                messages: '.js-notifications-items',
                read: '.js-notifications-more'
            },
            template: {
                html: '<li class="dropdown-item notification-{{class}}"> ' +
                '<span class="notification-time text-muted">{{date}}</span> ' +
                '<div>{{message}}</div> ' +
                '</li>'
            }
        },

        translator: Object.create(TranslatorService),

        /**
         * Main app initialization.
         */
        init: function () {
            if (CLIENT_USER_ID) {
                this.checkUnreadMessagesCount();
                var $this = this;

                $(this.globals.selectors.bell).click(function () {
                    if (!$this.initialized) {
                        $this.initializeReadMoreButton();
                        $this.initialized = true;

                        $this.getRemoteData($this.buildRequestPath(
                            $this.globals.route.pull,
                            $this.globals.pagination.page,
                            $this.globals.pagination.limit,
                            $this.getCurrentLocale()
                        ));
                    }
                    if ($(this).parent().hasClass('show')) {
                        $this.removeDocumentScroll(false);

                        return;
                    }
                    $this.removeDocumentScroll(true);
                });

                $(document).mouseup(function (e) {
                    var container = $($this.globals.selectors.container);
                    if (!container.is(e.target) && container.has(e.target).length === 0) {
                        $this.removeDocumentScroll(false);
                        $this._toggleClass($this.globals.selectors.container, 'is-active');
                    }
                });

                this.bindMessagesList(this.globals.selectors.bell);
            }
        },

        /**
         * On page load will check messages count.
         */
        checkUnreadMessagesCount: function () {
            var $this = this;

            $.ajax({
                dataType: 'json',
                url: $this.buildRequestPath($this.globals.route.unread),
                success: function (data, status) {
                    if (status === 'success') {
                        var $badge = $($this.globals.selectors.notification);
                        $badge.html(data);
                        if (data > 0) {
                            $badge.removeClass('hidden');
                        }
                    }
                }
            });
        },

        /**
         *
         * Build request uri.
         *
         * @param {string} route
         * @param {int} page
         * @param {int} count
         * @param {string} locale
         *
         * @returns {string}
         */
        buildRequestPath: function (route, page, count, locale) {
            return route
                .replace(/{{page}}/g, page)
                .replace(/{{base}}/g, API_URI)
                .replace(/{{count}}/g, count)
                .replace(/{{token}}/g, USER_TOKEN)
                .replace(/{{locale}}/g, locale);
        },

        /**
         * Display new messages count.
         *
         * @param {string} selector
         * @param {array} data
         */
        bindMessagesCount: function (selector, data) {
            var $bell = $(this.globals.selectors.bell);

            $(selector).html(data.params.total_unread);

            if (data.params.total_unread > 0) {
                $bell.addClass('is-active');
            } else {
                $bell.removeClass('is-active');
            }
        },

        /**
         * Mark message as read.
         */
        markAsRead: function () {
            if (this.unread.length > 0) {
                this.makePost(
                    this.buildRequestPath(
                        this.globals.route.read,
                        this.globals.pagination.next,
                        this.globals.pagination.limit,
                        this.getCurrentLocale()
                    )
                );
                var $badge = $(this.globals.selectors.notification),
                    newCount = parseInt($badge.text()) - this.globals.pagination.limit;
                $badge.html(newCount < 0 ? 0 : newCount);
                if (newCount <= 0) {
                    $badge.addClass('hidden');
                }
            }
        },

        /**
         * Mark message as read ajax request.
         */
        makePost: function (route) {
            var $this = this;

            $.ajax({
                url: route,
                data: JSON.stringify($this.unread),
                type: 'POST',
                crossDomain: true,
                contentType: 'application/json',
                dataType: 'json',
                success: function () {
                    $this.unread = [];
                }
            });
        },

        /**
         * Get current locale string.
         *
         * @returns {string}
         */
        getCurrentLocale: function () {
            return $('body').data('locale');
        },

        /**
         * Get remote data.
         */
        getRemoteData: function (route) {
            var $this = this;

            Loader.setLoader('.js-notification-loader', true);

            $.ajax({
                dataType: 'json',
                url: route,
                success: function (data, status) {
                    if (status === 'success' && data.items.length > 0) {
                        $this.bindMessagesCount($this.globals.selectors.notification, data);
                        $this.createMessagesTemplate($this.globals.selectors.messages, data);
                        $this.bindInfinityScroll($this.globals.selectors.wrapper);
                        $this.globals.pagination.next = data.next;
                    }
                    $this.showMessage(data.total_count);
                    Loader.setLoader('.js-notification-loader', false);
                }
            });
        },

        /**
         * Show message
         *
         * @param {number} count
         */
        showMessage: function (count) {
            var $message = $(this.globals.selectors.notificationsNone);

            if (count < 1) {
                $message.removeClass('hide');

                return;
            }

            $message.addClass('hide');
        },

        initializeReadMoreButton: function () {
            var $this = this;

            $(this.globals.selectors.read).on('click', function () {
                event.preventDefault();

                $this.getRemoteData($this.buildRequestPath(
                    $this.globals.route.pull,
                    $this.globals.pagination.next,
                    $this.globals.pagination.limit,
                    $this.getCurrentLocale()
                ));
            });
        },

        /**
         * Infinity scroll.
         *
         * @param selector
         */
        bindInfinityScroll: function (selector) {
            var $this = this;

            $(selector).bind('scroll', function (e) {
                if ($(this).scrollTop() + $(this).innerHeight() >= $(this)[0].scrollHeight && $this.globals.pagination.next !== null) {
                    e.preventDefault();

                    $(selector).unbind('scroll');
                    $this.getRemoteData($this.buildRequestPath(
                        $this.globals.route.pull,
                        $this.globals.pagination.next,
                        $this.globals.pagination.limit,
                        $this.getCurrentLocale()
                    ));
                }
            });
        },

        /**
         * Build messages template.
         */
        createMessagesTemplate: function (selector, data) {
            var $this = this;

            $.each(data.items, function (index, value) {
                if (value.read === null) {
                    $this.unread.push(value.id);
                }

                $this.html += $this.globals.template.html
                    .replace(/{{message}}/g, value.template.notification)
                    .replace(/{{date}}/g, moment(value.created, "YYYYMMDD").locale($this.getCurrentLocale()).fromNow())
                    .replace(/{{class}}/g, value.read === null ? 'active' : 'inactive');
            });

            if (data.next === null) {
                $this.html += $this.globals.template.html
                    .replace(/{{message}}/g, this.translator.translate('No messages'))
                    .replace(/{{date}}/g, '')
                    .replace(/{{class}}/g, 'inactive');

                $($this.globals.selectors.read).addClass('hide');
            } else {
                $($this.globals.selectors.read).removeClass('hide');
            }

            $(selector).html($this.html);
        },

        /**
         * Display messages container.
         *
         * @param selector
         */
        bindMessagesList: function (selector) {
            var $this = this;

            $(selector).on('click', function () {
                $this._toggleClass($this.globals.selectors.container, 'is-active');
                $this.initialized = true;
            });
        },

        /**
         * Toggle CSS class.
         *
         * @param {string} selector
         * @param {string} className
         *
         * @private
         */
        _toggleClass: function (selector, className) {
            $(selector).toggleClass(className);

            if (this.initialized) {
                this.markAsRead();
            }
        },
        /**
         * Toggle document scroll
         *
         * @param {boolean} bool
         */
        removeDocumentScroll: function (bool) {
            var $html = $('html'),
                style = (bool ? 'overflow-y: hidden' : 'overflow-y: auto');

            $html.attr('style', style);
        }
    };

    /**
     * Initialize widget.
     *
     * @type {SystemMessages}
     */
    Object.create(SystemMessages).init();
})(jQuery);
