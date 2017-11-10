(function ($) {
    var Registration = {
        /**
         * Global DOM selectors used for JavaScript bindings
         * Translations comes from jsTranslations.html.twig template.
         */
        globals: {
            registrationBeginClass: 'js-page-user-register',
            registrationProcessClass: 'js-page-registration-process',
            mail: {
                input: '#js-mail-input',
                label: '#js-mail-error-label',
                route: API_URI + '/api/v1/player/public/validate-email'
            },
            name: {
                input: '#js-name-input',
                label: '#js-name-error-label',
                route: API_URI + '/api/v1/player/public/validate-name',
                suggestions: {
                    singleNameSelectorId: 'js-name-suggestion',
                    nameListSelectorId: 'username-suggestions'
                }
            },
            dualChecker: {
                elementSelector: '.js-dual-checker',
                dataAttribute: 'target'
            },
            autofill: {
                countrySelector: '#js-country-select',
                cities: {
                    inputSelector: '#js-city-input',
                    endpoint: API_URI + '/api/v1/player/public/city_search'
                },
                streets: {
                    inputSelector: '#js-street-input',
                    endpoint: API_URI + '/api/v1/player/public/street_search'
                },
                minStringLength: 3,
                autosuggestionCountry: 7
            }
        },

        /**
         * Main app initialization.
         */
        init: function () {
            var $this = this,
                $body = $('body');

            if ($body.hasClass($this.globals.registrationBeginClass)) {
                $this.initMailValidation();
                $this.initNameValidation();
                $this.initNameAutofill();
                $this.nameSuggestionClickListener();
            }

            if ($body.hasClass($this.globals.registrationProcessClass)) {
                $this.initDualChecker();

                $this.initAutoSuggest();
                $($this.globals.autofill.countrySelector).change(function () {
                    $this.initAutoSuggest();
                });
                $($this.globals.autofill.cities.inputSelector).change(function () {
                    $this.initAutoSuggest();
                });
            }
        },

        initAutoSuggest: function () {
            $(this.globals.autofill.cities.inputSelector).typeahead('destroy');
            $(this.globals.autofill.streets.inputSelector).typeahead('destroy');
            this.initCityAutosuggest();
            this.initStreetAutosuggest();
        },

        /**
         * Automaticly fill name field after changing an email.
         */
        initNameAutofill: function () {
            var $nameInput = $(this.globals.name.input);

            $(this.globals.mail.input).change(function () {
                var nameSuggestion = $(this).val().split('@')[0];
                if (nameSuggestion.length > 0 && $nameInput.val().length === 0) {
                    $nameInput.val(nameSuggestion);
                }
            });
        },

        /**
         * After mail input is changed, will check in back-end if mail is valid and print error if not.
         */
        initMailValidation: function () {
            var $this = this, $input = $(this.globals.mail.input);

            $input.on('change', function () {
                var mail = $(this).val();

                if (mail.split('@').length > 1) {
                    formValidate.removeInputError($input, true);
                    $.get($this.globals.mail.route, {'mail': mail, '_locale': LOCALE})
                        .success(function (data) {
                            $this.updateErrorLabel($input, $($this.globals.mail.label), data);
                        });
                } else {
                    formValidate.removeInputError($input, true);
                }
            });
        },

        /**
         * Starts validation of name input whenever any change is detected.
         */
        initNameValidation: function () {
            var $this = this, $input = $(this.globals.name.input);

            $input.on('change', function () {
                $.get($this.globals.name.route, {'name': $(this).val(), '_locale': LOCALE})
                    .success(function (data) {
                        $this.updateErrorLabel($input, $($this.globals.name.label), data);
                    });
            });
        },

        /**
         * Updates error label with error message.
         *
         * @param {jQuery} $input
         * @param {jQuery} $label
         * @param {Array}  data
         */
        updateErrorLabel: function ($input, $label, data) {
            var $this = this;

            if (data === true) {
                if (!$label.hasClass('hidden')) {
                    $label.addClass('hidden');
                }
                formValidate.removeInputError($input, true);
                $label.html('');
            } else {
                if ($label.hasClass('hidden')) {
                    $label.removeClass('hidden');
                }
                formValidate.addInputError($input, true);
                if (data.names.length == 0) {
                    $label.html(data.message);
                } else {
                    $label.html('<div id="' + this.globals.name.suggestions.nameListSelectorId + '">' + data.message + '</div>');
                    $('#' + this.globals.name.suggestions.nameListSelectorId).append('<div class="item-list"><ul class="list-unstyled d-flex mb-0 h-flex-wrap">');
                    $.each(data.names, function (index) {
                        $('#' + $this.globals.name.suggestions.nameListSelectorId + ' ul').append(
                            '<li class="mr-1 h-cp" id="' + $this.globals.name.suggestions.singleNameSelectorId + '" data-value="' + data.names[index] + '">' + data.names[index] + '</li>'
                        );
                    });
                    $('#' + this.globals.name.suggestions.nameListSelectorId).append('</ul></div>');
                }
            }
        },

        /**
         * Will update name input field whenever name suggestion is clicked.
         */
        nameSuggestionClickListener: function () {
            var $this = this,
                $nameInput = $($this.globals.name.input);

            $('body').on('click', '#' + $this.globals.name.suggestions.singleNameSelectorId, function () {
                $nameInput.val($(this).data('value'));
                $($this.globals.name.label).html('').addClass('hidden');
                formValidate.removeInputError($nameInput, true);
            });
        },

        /**
         * Will check two checkboxes at once.
         */
        initDualChecker: function () {
            var $this = this;
            $(this.globals.dualChecker.elementSelector).change(function () {
                if (this.checked) {
                    $($(this).data($this.globals.dualChecker.dataAttribute)).prop('checked', true);
                }
            });
        },

        /**
         * Call endpoint to get a list of cities to autosuggest it to user.
         */
        initCityAutosuggest: function () {
            var $countrySelect = $(this.globals.autofill.countrySelector),
                $cityInput = $(this.globals.autofill.cities.inputSelector);

            var $citiesBloodhound = new Bloodhound({
                datumTokenizer: Bloodhound.tokenizers.whitespace,
                queryTokenizer: Bloodhound.tokenizers.whitespace,
                remote: {
                    url: this.globals.autofill.cities.endpoint + '?country=' + $countrySelect.val() + '&cityPhrase=%QUERY',
                    wildcard: '%QUERY'
                }
            });

            $cityInput.typeahead(
                {hint: true, highlight: true, minLength: this.globals.autofill.minStringLength},
                {name: 'cities', source: $citiesBloodhound}
            );
        },

        /**
         * Call endpoint to get a list of streets to autosuggest it to user.
         */
        initStreetAutosuggest: function () {
            var $countrySelect = $(this.globals.autofill.countrySelector),
                $cityInput = $(this.globals.autofill.cities.inputSelector);

            var $streetInput = $(this.globals.autofill.streets.inputSelector),
                $streetsBloodhound = new Bloodhound({
                    datumTokenizer: Bloodhound.tokenizers.whitespace,
                    queryTokenizer: Bloodhound.tokenizers.whitespace,
                    remote: {
                        url: this.globals.autofill.streets.endpoint + '?country=' + $countrySelect.val() + '&city=' + $cityInput.val() + '&streetPhrase=%QUERY',
                        wildcard: '%QUERY'
                    }
                });

            $streetInput.typeahead(
                {hint: true, highlight: true, minLength: this.globals.autofill.minStringLength},
                {name: 'streets', source: $streetsBloodhound}
            );

        }
    };
    var App = Object.create(Registration);
    App.init();
})(jQuery);
