var Media = {
    /**
     * Global DOM selectors used for JavaScript bindings
     */
    globals: {
        container: 'div[class^="image_"]',
        input: 'input[class="selection-id"]',
        description: '.field-short-description',
        form: '#image-upload',
        loader: '.overlay',
        templates: {
            tooltip: '<img width="150" class="img-responsive" src=""/>',
            loading: '<div class="overlay"><i class="fa fa-refresh fa-spin"></i></div>'
        },
        buttons: {
            delete: '.delete-media',
            gallery: '.gallery-media',
            upload: '.upload-media',
            create: '.btn-upload-media',
            preview: '.preview',
            copy: '.copy'
        },
        keyboard: {
            enter: 13
        },
        pagination: {
            pager: '.pagination'
        },
        status: {
            success: 'success'
        },
        popup: {
            alert: '.alert',
            body: '.modal-body',
            item: '.modal-media',
            submit: '.upload-submit',
            path: '.upload-path',
            categories: '.categories-selection',
            storage: '.storage-selection',
            search: '.search-submit'
        },
        messages: {
            noImageFound: 'No image found.'
        }
    },

    /**
     * Main app initialization.
     */
    init: function () {
        this.bindDeleteButtons(this.globals.buttons.delete);
        this.bindGalleryButton(this.globals.buttons.gallery);
        this.bindUploadButton(this.globals.buttons.upload, false);
        this.bindUploadButton(this.globals.buttons.create, true);
        this.previewImage(this.globals.buttons.preview);
    },

    /**
     * Display list uploaded images.
     *
     * @param selector
     */
    bindGalleryButton: function (selector) {
        var $this = this;

        $(selector).on('click', function (event) {
            event.preventDefault();

            var target = $(this).data('target');

            $this.displayLoader(target);

            $(target).modal('show').find($this.globals.popup.body).load($(this).data('action'), function (response, status) {
                if (status === $this.globals.status.success) {
                    $this.bindGalleryItems($this.globals.popup.item, target);
                    $this.bindGalleryFilter($this.globals.popup.categories, target);
                    $this.bindPagination(target);
                    $this.bindDataStorageFilter($this.globals.popup.storage, target);
                    $this.bindSearchButton($this.globals.popup.search, target);
                }
            });
        });
    },

    /**
     * Bind gallery filters.
     *
     * @param selector
     * @param target
     */
    bindGalleryFilter: function (selector, target) {
        var $this = this;

        $(selector).find('li > a').on('click', function (event) {
            event.preventDefault();

            $this.displayLoader(target);

            $(target).modal('show').find($this.globals.popup.body).load($(this).data('action'), function (response, status) {
                if (status === $this.globals.status.success) {
                    $this.bindGalleryItems($this.globals.popup.item, target);
                    $this.bindGalleryFilter($this.globals.popup.categories, target);
                    $this.bindPagination(target);
                    $this.bindDataStorageFilter($this.globals.popup.storage, target);
                    $this.bindSearchButton($this.globals.popup.search, target);
                }
            });
        });
    },

    /**
     * Bind data storage select widget
     *
     * @param selector
     * @param target
     */
    bindDataStorageFilter: function (selector, target) {
        var $this = this;

        $(selector).on('change', function (event) {
            event.preventDefault();

            $this.displayLoader(target);

            $(target).modal('show').find($this.globals.popup.body).load($(this).children(":selected").data('action'), function (response, status) {
                if (status === $this.globals.status.success) {
                    $this.bindGalleryItems($this.globals.popup.item, target);
                    $this.bindGalleryFilter($this.globals.popup.categories, target);
                    $this.bindPagination(target);
                    $this.bindDataStorageFilter($this.globals.popup.storage, target);
                    $this.bindSearchButton($this.globals.popup.search, target);
                }
            });
        });
    },

    /**
     * Bind search button.
     *
     * @param selector
     * @param target
     */
    bindSearchButton: function (selector, target) {
        var $this = this;

        $this.disableKeyboardButton($this.globals.keyboard.enter);

        $(selector).on('click', function (event) {
            event.preventDefault();

            var href = $(this).data('action'),
                query = $('input[name="query"]').val(),
                path = href + (query !== '' ? '/' + query : '');

            $(target).modal('show').find($this.globals.popup.body).load(path, function (response, status) {
                if (status === $this.globals.status.success) {
                    $this.bindGalleryItems($this.globals.popup.item, target);
                    $this.bindGalleryFilter($this.globals.popup.categories, target);
                    $this.bindPagination(target);
                    $this.bindDataStorageFilter($this.globals.popup.storage, target);
                    $this.bindSearchButton($this.globals.popup.search, target);
                }
            });
        });
    },

    /**
     * Disable keyboard button.
     *
     * @param button
     */
    disableKeyboardButton: function (button) {
        $(document).keypress(function (e) {
            if (e.which === button) {
                e.preventDefault();
            }
        });
    },

    /**
     * Bind popup elements for selection.
     *
     * @param selector
     * @param target
     */
    bindGalleryItems: function (selector, target) {
        var $this = this;

        $(selector).on('click', function (event) {
            event.preventDefault();

            var $container = this.closest($this.globals.container);

            $($container).find($this.globals.input).val($(this).data('id'));
            $($container).find($this.globals.description).val($(this).data('action'));

            $this.toggleButton($container, $this.globals.buttons.delete, false);
            $this.hideModal(target);
        });
    },

    /**
     * Delete relation to selected document. Override to null on save.
     *
     * @param selector
     */
    bindDeleteButtons: function (selector) {
        var $this = this,
            $containers = $(selector).closest($this.globals.container);

        $containers.each(function () {
            if ($(this).find($this.globals.input).val() === '') {
                $this.toggleButton(this, selector, true);
            }
        });

        $(selector).on('click', function (event) {
            event.preventDefault();

            var $container = this.closest($this.globals.container);

            $($container).find($this.globals.input).val('');
            $($container).find($this.globals.description).val('');

            $this.toggleButton($container, selector, true);
        });
    },

    /**
     * Bind upload button.
     *
     * @param selector
     * @param form
     */
    bindUploadButton: function (selector, form) {
        var $this = this;

        $(selector).on('click', function (event) {
            event.preventDefault();

            var $container = this.closest($this.globals.container),
                target = $(this).data('target');

            $this.displayLoader(target);

            $(target).modal('show').find($this.globals.popup.body).load($(this).data('action'), function (response, status) {
                if (status === $this.globals.status.success) {
                    if (false === form) {
                        $this.bindModalUploadWithoutForm($container, target, $this.globals.popup.submit);
                    } else {
                        $this.bindModalUploadWidthForm(target, $this.globals.popup.submit);
                    }
                }

                $this.hideLoader(target);
            });
        });
    },

    /**
     * Separate form upload handler.
     *
     * @param target
     * @param selector
     *
     *
     */
    bindModalUploadWidthForm: function (target, selector) {
        var $this = this;

        $(target).find(selector).on('click', function (event) {
            event.preventDefault();

            $this.displayLoader(target);

            $.ajax({
                type: 'POST',
                url: $this.getUploadPath(target),
                data: new FormData($($this.globals.form)[0]),
                contentType: false,
                processData: false,
                success: function (data) {
                    if (data.code === 0 && data.message === '') {
                        location.reload();
                    }
                },
                error: function (response) {
                    var $response = $.parseJSON(response.responseText);

                    $($this.globals.popup.alert).removeClass('hidden').text($response.message).show().delay(5000).fadeOut();
                    $($this.globals.popup.submit).attr('disabled', false);

                    $this.hideLoader(target);
                }
            });
        });
    },

    /**
     * Get upload path.
     *
     * @param target
     *
     *
     */
    getUploadPath: function (target) {
        return $(target).find(this.globals.popup.path).val();
    },

    /**
     * Widget upload handler.
     *
     * @param container
     * @param target
     * @param selector
     *
     *
     */
    bindModalUploadWithoutForm: function (container, target, selector) {
        var $this = this;

        $(target).find(selector).on('click', function (event) {
            event.preventDefault();

            $this.displayLoader(target);

            var $button = $(this).attr('disabled', true),
                $data = new FormData(),
                $container = $(container);

            $(target + ' [name^="images"]').each(function () {
                var input = $(this), value = input.val();
                if (input.attr('type') === 'file') {
                    value = input[0].files[0];
                }
                $data.append(input.attr('name'), value);
            });

            $.ajax({
                type: 'POST',
                url: $this.getUploadPath(target),
                data: $data,
                contentType: false,
                processData: false,
                success: function (data) {
                    if (data.code === 0 && data.message === '') {
                        $container.find($this.globals.input).val(data.file.id);
                        $container.find($this.globals.description).val(data.file.image);

                        $this.hideModal(target);
                    }
                },
                error: function (response) {
                    var $response = $.parseJSON(response.responseText);

                    $container.find($this.globals.popup.alert).removeClass('hidden').text($response.message).show().delay(5000).fadeOut();
                    $button.attr('disabled', false);

                    $this.hideLoader(target);
                }
            });
        });
    },

    /**
     * Bind pagination.
     *
     * @param target
     *
     *
     */
    bindPagination: function (target) {
        var pagination = this.globals.pagination,
            $this = this;

        $(pagination.pager).find('li > a').on('click', function (event) {
            event.preventDefault();

            $this.displayLoader(target);

            if ($(this).attr('href') !== undefined) {
                $(target).modal('show').find($this.globals.popup.body).load($(this).attr('href'), function (response, status) {
                    if (status === $this.globals.status.success) {
                        $this.bindPagination(target);
                        $this.bindGalleryFilter($this.globals.popup.categories, target);
                        $this.bindGalleryItems($this.globals.popup.item, target);
                        $this.bindDataStorageFilter($this.globals.popup.storage, target);
                        $this.bindSearchButton($this.globals.popup.search, target);
                    }
                });
            }
        });
    },

    /**
     * Preview image tooltip.
     *
     * @param selector
     *
     *
     */
    previewImage: function (selector) {
        var $selector = $(selector),
            $this = this;

        $selector.on('mouseenter', function () {
            var image = $(this).parent().find($this.globals.description).val(),
                message = $this.globals.messages.noImageFound;

            if (image) {
                message = $($this.globals.templates.tooltip).attr('src', image);
            }

            $(this).tooltip({
                container: 'body',
                html: true,
                title: message
            }).tooltip('show');
        }).on('mouseleave', function () {
            $(this).tooltip('destroy');
        });
    },

    /**
     * Display loader.
     *
     * @param selector
     *
     *
     */
    displayLoader: function (selector) {
        $(selector).find(this.globals.popup.body).append(this.globals.templates.loading);
    },

    /**
     * Hide loader.
     *
     * @param selector
     *
     *
     */
    hideLoader: function (selector) {
        $(selector).find(this.globals.loader).remove();
    },

    /**
     * Hide modal popup.
     *
     * @param selector
     *
     *
     */
    hideModal: function (selector) {
        $(selector).modal('hide');
    },

    /**
     * Change button state.
     *
     * @param container
     * @param selector
     * @param state
     *
     *
     */
    toggleButton: function (container, selector, state) {
        if (state === true) {
            $(container).find(selector).addClass('disabled');
        }

        if (state === false) {
            $(container).find(selector).removeClass('disabled');
        }
    }
};

var MediaUploader = Object.create(Media);
MediaUploader.init();
