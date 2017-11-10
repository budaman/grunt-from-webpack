(function ($) {
    var Casino = {

        /**
         * Global DOM selectors used for JavaScript bindings
         */
        globals: {
            casino: {
                container: '.js-casino-game-container',
                stateActive: 'is-active',
                gameIframe: '#js-casino-game-iframe'
            },
            slider: '.js-slider-casino',
            menu: {
                selector: '.js-casino-menu',
                stateSticky: 'is-casino-menu-sticky'
            },
            modalLogin: {
                btn: '.js-modal-casino-login-btn',
                title: '.js-modal-casino-login-title',
                loginLink: '.js-modal-casino-login-link',
                stateNoTitle: 'is-no-title'
            },
            preloader: {
                selector: '.js-casino-game-loader',
                stateActive: 'is-active'
            },
            fullscreen: {
                btn: '.js-btn-toggle-fullscreen'
            },
            mobile: {
                casinoContainer: '#casino-container',
                stateIsMobile: 'is-mobile'
            },
            timer: '.js-casino-game-timer'
        },
        $body: $('body'),

        /**
         * Main app initialization.
         */
        init: function () {
            if (this.$body.hasClass('page-casino')) {
                var $this = this;

                $this.initSlider();
                $this.initModalLogin();
                $this.hidePreloader();
                $this.isMobile($this.globals.mobile.stateIsMobile);
                $this.toggleFullScreen();
                $this.initCalculateIframeHeight(true);
                $this.initTimer();
                $this.initMenuSticky(true);
            }
        },

        /**
         * Init Slider
         */
        initSlider: function () {
            $(this.globals.slider).owlCarousel({
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
         * Init Login/Register modal
         */
        initModalLogin: function () {
            var $this = this,
                $title = $($this.globals.modalLogin.title);

            $($this.globals.modalLogin.btn).on('click', function () {
                var title = $(this).data('title');

                $($this.globals.modalLogin.loginLink).attr('href', $(this).data('login'));
                $title.removeClass($this.globals.modalLogin.stateNoTitle);
                if (title !== '') {
                    $title.text(title);
                } else {
                    $title.text('');
                    $title.addClass($this.globals.modalLogin.stateNoTitle);
                }
            });
        },

        /**
         * Toggles fullscreen on or off.
         *
         * @private
         */
        toggleFullScreen: function () {
            var $this = this,
                $elem = $($this.globals.casino.gameIframe).get(0);

            $($this.globals.fullscreen.btn).on('click', function () {
                if ((document.fullScreenElement !== undefined && document.fullScreenElement === null) || (document.msFullscreenElement !== undefined && document.msFullscreenElement === null) || (document.mozFullScreen !== undefined && !document.mozFullScreen) || (document.webkitIsFullScreen !== undefined && !document.webkitIsFullScreen)) {
                    if ($elem.requestFullScreen) {
                        $elem.requestFullScreen();
                    } else if ($elem.mozRequestFullScreen) {
                        $elem.mozRequestFullScreen();
                    } else if ($elem.webkitRequestFullScreen) {
                        $elem.webkitRequestFullScreen(Element.ALLOW_KEYBOARD_INPUT);
                    } else if ($elem.msRequestFullscreen) {
                        $elem.msRequestFullscreen();
                    }
                } else {
                    if (document.cancelFullScreen) {
                        document.cancelFullScreen();
                    } else if (document.mozCancelFullScreen) {
                        document.mozCancelFullScreen();
                    } else if (document.webkitCancelFullScreen) {
                        document.webkitCancelFullScreen();
                    } else if (document.msExitFullscreen) {
                        document.msExitFullscreen();
                    }
                }
            });
        },

        /**
         * If user is browsing in mobile device - this script will add class class.
         *
         * @param {string} className
         *
         * @private
         */
        isMobile: function (className) {
            var $element = $(this.globals.mobile.casinoContainer),
                isMobile = {
                    Android: function () {
                        return navigator.userAgent.match(/Android/i);
                    },
                    BlackBerry: function () {
                        return navigator.userAgent.match(/BlackBerry/i);
                    },
                    iOS: function () {
                        return navigator.userAgent.match(/iPhone|iPad|iPod/i);
                    },
                    Opera: function () {
                        return navigator.userAgent.match(/Opera Mini/i);
                    },
                    Windows: function () {
                        return navigator.userAgent.match(/IEMobile/i) || navigator.userAgent.match(/WPDesktop/i);
                    },
                    any: function () {
                        return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows());
                    }
                };

            if (isMobile.any()) {
                $element.addClass(className);
            }
        },

        /**
         * Will start timer on passed element.
         *
         * @private
         */
        initTimer: function () {
            var $element = $(this.globals.timer);

            setInterval(function () {
                $element.text((new Date).toTimeString().split(' ')[0]);
            }, 1000);
        },
        initCalculateIframeHeight: function (bindEvent) {
            var $this = this,
                $iframe = $($this.globals.casino.gameIframe),
                iframeOriginalWidth = $iframe.data('width'),
                iframeOriginalHeight = $iframe.data('height'),
                iframeCurrentWidth = $iframe.width(),
                iframeCalcHeight = iframeOriginalHeight * iframeCurrentWidth / iframeOriginalWidth;

            $iframe.css('height', (iframeCalcHeight / 10 + 'rem'));

            if (bindEvent) {
                $(window).on('resize', function () {
                    $this.initCalculateIframeHeight(false);
                });
            }
        },

        /**
         * Hides preloader and shows game.
         * @private
         */
        hidePreloader: function () {
            $(this.globals.preloader.selector).removeClass(this.globals.preloader.stateActive);
            $(this.globals.casino.container).addClass(this.globals.casino.stateActive);
        },

        /**
         * Menu sticky
         * @private
         */
        initMenuSticky: function (bindEvent) {
            var $this = this,
                docEl = document.documentElement,
                $menu = $($this.globals.menu.selector),
                menuTop = $menu.offset().top,
                scrollTop = (window.pageYOffset || docEl.scrollTop) - (docEl.clientTop || 0);

            if (scrollTop > menuTop) {
                $menu.addClass($this.globals.menu.stateSticky);
            } else {
                $menu.removeClass($this.globals.menu.stateSticky);
            }

            if (bindEvent) {
                $(window).on('scroll resize', function () {
                    $this.initMenuSticky(false);
                });
            }
        }

    };
    var App = Object.create(Casino);
    App.init();
})(jQuery);
