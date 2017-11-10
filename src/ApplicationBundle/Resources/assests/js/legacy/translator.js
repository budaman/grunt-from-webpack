var TranslatorService = {

    /**
     * Translates given key to system language. Returns same key if translation does not exists.
     *
     * @param {string} key
     *
     * @returns {string}
     */
    translate: function (key) {
        if (typeof translations[key] === 'undefined') {
            return key;
        }

        return translations[key];
    }
};
