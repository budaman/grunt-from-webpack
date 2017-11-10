(function ($) {
    var FileUpload = {
        /**
         * Global DOM selectors used for JavaScript bindings
         * Translations comes from jsTranslations.html.twig template.
         */
        globals: {
            fileUploadSelector: '.file-upload',
            uploadButtonSelector: '.btn-upload',
            uploadedFilePathSelector: '.btn-upload-file-path',
            uploadedFileClass: 'uploaded'
        },

        /**
         * Main app initialization.
         */
        init: function () {
            var $this = this;
            $(this.globals.fileUploadSelector).on('change', function () {
                $this.fileUploadedCallback()
            });
        },

        /**
         * @private
         */
        fileUploadedCallback: function () {
            if ($(this.globals.fileUploadSelector).val() && $(this.globals.fileUploadSelector).val().length > 1) {
                $(this.globals.uploadButtonSelector).addClass(this.globals.uploadedFileClass);
                $(this.globals.uploadedFilePathSelector).html($(this.globals.fileUploadSelector).val());
            }
        }
    };
    var App = Object.create(FileUpload);
    App.init();
})(jQuery);
