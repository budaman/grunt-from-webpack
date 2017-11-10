var RouterService = {

    /**
     * @param {string} $route
     * @param {object}  variables
     *
     * @returns {string}
     */
    buildPath: function ($route, variables) {
        $.each( variables, function( key, value ) {
            $route = $route.replace(key, value);
        });

        return $route;
    }
};
