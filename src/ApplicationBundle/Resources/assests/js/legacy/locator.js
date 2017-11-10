(function ($) {
    var Locator = {
        /**
         * Global DOM selectors used for JavaScript bindings
         */
        globals: {
            selectors: {
                mapSelector: '#js-google-map',
                citySelector: '#js-city-select',
                gallery: '.js-locations-gallery',
                galleryPrev: '.js-locations-gallery-prev',
                galleryNext: '.js-locations-gallery-next',
                locations: '#locations',
                locationsItemActive: '.is-locations-item-active'
            }
        },

        /**
         * Main app initialization.
         */
        init: function () {
            this.bindCitySelector(this.globals.selectors.citySelector);

            if (this.isGoogleInitialized()) {
                var $this = this,
                    $map = this.initGoogleMaps();

                if (!this.getDataAttribute('forward') || this.navigateToCityPage()) {
                    var targetId = $($this.globals.selectors.locations).find($this.globals.selectors.locationsItemActive).data('id');

                    this.getDataAttribute('markers').forEach(function ($marker) {
                        if ($marker.id === targetId) {
                            $this.addLocationMarker($map, $marker, true);
                        } else {
                            $this.addLocationMarker($map, $marker, false);
                        }
                    })
                }
            }

            this.initGallery();
        },

        /**
         * If user shares his location, then we will automatically redirect him to his nearest city page.
         *
         * @return {boolean}
         */
        navigateToCityPage: function () {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(function (position) {
                    window.location = window.location + '?lat=' + position.coords.latitude + '&lng=' + position.coords.longitude;
                });
            }

            return true;
        },

        /**
         * Add location marker.
         *
         * @param $map
         * @param $marker
         */
        addLocationMarker: function ($map, $marker, isActive) {
            var pinIconDefault = "../assets/front/images/icons/map-marker-default.svg",
                pinIconActive = "../assets/front/images/icons/map-marker-active.svg",
                pinIconUrl = isActive ? pinIconActive : pinIconDefault,
                pinIconSize = isActive ? 64 : 32;

            var pinIcon = new google.maps.MarkerImage(
                pinIconUrl,
                null, //size is determined at runtime
                null, //origin is 0,0
                null, //anchor is bottom center of the scaled image
                new google.maps.Size(pinIconSize, pinIconSize)
            );

            new google.maps.Marker({
                position: this.getPointCoordinates($marker),
                animation: google.maps.Animation.DROP,
                map: $map,
                icon: pinIcon,
                title: $marker.address
            }).addListener('click', function () {
                window.location = '/location/' + $marker.id
            });
        },

        /**
         * Get point coordinates.
         *
         * @param $marker
         * @returns {google.maps.LatLng}
         */
        getPointCoordinates: function ($marker) {
            return new google.maps.LatLng($marker.coordinates.longitude, $marker.coordinates.latitude);
        },

        /**
         * Initialize google maps.
         */
        initGoogleMaps: function () {
            var $map = new google.maps.Map($(this.globals.selectors.mapSelector)[0]);

            $map.setZoom(this.getDataAttribute('zoom'));
            $map.setCenter(this.getCenterCoordinates());
            $map.setMapTypeId(google.maps.MapTypeId.ROADMAP);

            return $map;
        },

        /**
         * Resolves center point on map.
         *
         * @returns {google.maps.LatLng}
         */
        getCenterCoordinates: function () {
            return new google.maps.LatLng(
                this.getDataAttribute('center-lat'),
                this.getDataAttribute('center-lng')
            );
        },

        /**
         * Get data attribute value.
         *
         * @param attribute
         */
        getDataAttribute: function (attribute) {
            return $(this.globals.selectors.mapSelector).data(attribute);
        },

        /**
         * When city is changed it will redirect automaticly to sthe selected city.
         */
        bindCitySelector: function (selector) {
            $(selector).on('change', function () {
                window.location = this.value;
            })
        },

        /**
         * Check if google scripts loaded.
         *
         * @returns {boolean}
         */
        isGoogleInitialized: function () {
            return typeof google === 'object' && typeof google.maps === 'object'
        },

        /**
         * Locations item gallery
         */
        initGallery: function () {
            var $this = this,
                $slider = $($this.globals.selectors.gallery);

            $slider.owlCarousel({
                loop: true,
                items: 1,
                margin: 10,
                nav: false,
                dots: true,
                lazyLoad: true
            });
            $($this.globals.selectors.galleryPrev).click(function () {
                $slider.trigger('prev.owl.carousel');
            });
            $($this.globals.selectors.galleryNext).click(function () {
                $slider.trigger('next.owl.carousel');
            });
        }
    };
    var App = Object.create(Locator);
    App.init();
})(jQuery);
