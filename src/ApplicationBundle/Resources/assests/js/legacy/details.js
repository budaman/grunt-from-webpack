(function ($) {
    var Details = {
        /**
         * Global DOM selectors used for JavaScript bindings
         */
        globals: {
            firstPasswordInputSelector: '#details_password_first',
            secondPasswordInputSelector: '#details_password_second',
            eventToCheckOn: 'keyup',
            passwordStrengthIndicatorSelector: '#js-password-indicator-text',
            samePasswordsIndicatorSelector: '#js-same-passwords',
            statuses: {
                weak: 'weak',
                fair: 'fair',
                good: 'good',
                strong: 'strong'
            }
        },

        /**
         * Main app initialization.
         */
        init: function () {
            this.initPasswordComplexityChecker();
            this.repeatedPasswordMatch();
        },

        /**
         * Checks if both passwords match.
         *
         * @private
         */
        repeatedPasswordMatch: function () {
            var $this = this;

            $(this.globals.firstPasswordInputSelector + ', ' + this.globals.secondPasswordInputSelector).on(
                this.globals.eventToCheckOn,
                function () {
                    var first = $($this.globals.firstPasswordInputSelector).val(),
                        second = $($this.globals.secondPasswordInputSelector).val(),
                        $indicator = $($this.globals.samePasswordsIndicatorSelector);

                    if (first != second) {
                        $indicator.html($indicator.data('different'));
                    } else {
                        $indicator.html($indicator.data('same'));
                    }
                }
            );
        },

        /**
         * Starts checking password complexity on every key up event.
         *
         * @private
         */
        initPasswordComplexityChecker: function () {
            var $this = this;

            $(this.globals.firstPasswordInputSelector).on(this.globals.eventToCheckOn, function () {
                $this.updatePasswordStatus(
                    $this.evaluatePasswordStrength($($this.globals.firstPasswordInputSelector).val())
                );
            });
        },

        /**
         * @param status
         *
         * @private
         */
        updatePasswordStatus: function (status) {
            var $indicator = $(this.globals.passwordStrengthIndicatorSelector);
            status = $indicator.data(status) != '' ? $indicator.data(status) : 'status';
            $indicator.html(status);
        },

        /**
         * Evaluates current entered password strength.
         *
         * @param {string} password
         *
         * @returns {{strength: number, strengthType: string}}
         *
         * @private
         */
        evaluatePasswordStrength: function (password) {
            var strength = 100,
                hasLowercase = /[a-z]+/.test(password),
                hasUppercase = /[A-Z]+/.test(password),
                hasNumbers = /[0-9]+/.test(password),
                hasPunctuation = /[^a-zA-Z0-9]+/.test(password),
                status = this.globals.statuses.strong;

            if (password.length < 6) {
                strength -= ((6 - password.length) * 5) + 30;
            }

            strength -= (!hasLowercase + !hasUppercase + !hasNumbers + !hasPunctuation) * 10;

            if (strength <= 60) {
                status = this.globals.statuses.weak;
            } else if (strength <= 70) {
                status = this.globals.statuses.fair;
            } else if (strength <= 80) {
                status = this.globals.statuses.good;
            }

            return status;
        }
    };
    var App = Object.create(Details);
    App.init();
})(jQuery);
