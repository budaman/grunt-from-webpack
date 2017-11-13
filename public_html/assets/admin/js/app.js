$(function () {
    $(".select2").select2();
    $(".select2-tags").select2({
        tags: true,
        theme: "classic",
        tokenSeparators: [',', ' ']
    });

    var $deleteSelector = $('.delete');

    if ($deleteSelector.length > 0) {
        $deleteSelector.on('click', function (event) {
            event.preventDefault();
            var $this = this;
            swal({
                title: "Are you sure?",
                text: "Your will not be able to recover this file!",
                type: "warning",
                showCancelButton: true,
                confirmButtonClass: "btn-danger",
                confirmButtonText: "Yes, delete it!",
                closeOnConfirm: true
            }, function (isConfirm) {
                if (isConfirm) {
                    window.location.href = $($this).attr('href');
                }
            });
        });
    }

    $('[data-toggle="tooltip"]').tooltip({
        trigger: 'hover focus click'
    });

    $('#notify_send_at').datetimepicker({
        format: 'Y-m-d H:i',
        step: 5
    });

    var clipboard = new Clipboard('#urltracker');

    $('#selectBetslipModal').on('shown.bs.modal', function () {
        selectBetslipModal();
    });

    $('#selectPathModal').on('shown.bs.modal', function () {
        selectPathModal();
    });

    function selectBetslipModal() {
        var wnd = $('.modal-body');
        var selbets = [];
        var selectBetOdds;

        var cont = $('.betSlip', wnd);
        cont.show();
        var contlistbets = cont;
        cont.empty();
        cont.append($('<div><input size="3" value="25" class="betamount">EUR x <span class="bcoef">1.0</span> = <span class="bwin">x</span>EUR <button class="btn btn-primary" data-dismiss="modal" type="button" name="ok"> OK </button></div> <button class="btn btn-primary" name="add"><span class="glyphicon glyphicon-plus"></span></button>'));
        $('button[name="add"]', cont).click(function () {
            cont.hide();
            selectBetOdds();
        });
        $('button[name="ok"]', cont).click(function () {
            var p = ':b:' + parseFloat($('.betamount', contlistbets).val()) + '-' + (selbets.length === 1 ? 'single' : 'multi') + '-' + selbets.join('-');
            $('input[name="notify[message_attr]"]').val(p);
        });
        var contbets = null;


        var recalcBets = function () {
            var cf = 1.0;

            $('b', contlistbets).each(function () {
                cf *= parseFloat($(this).text());
            });
            cf = ((cf * 100) << 0) / 100;

            var am = parseFloat($('.betamount', contlistbets).val()),
                win = cf * am;

            win = ((win * 100) << 0) / 100;

            $('.bcoef', contlistbets).text(cf);
            $('.bwin', contlistbets).text(win);
        };

        $('.betamount', contlistbets).change(function () {
            recalcBets();
        });

        selectBetOdds = function () {
            var wnd2 = $('.modal-body');
            contbets = $('.betOdds', wnd2);
            contbets.show();
            var path = '',
                pathtitle = '';

            var getNextBets = function () {

                var params = {method: 'offers', os: 'i2', lang: 'lt'};
                if (path !== '')
                    params.id = path;

                $.getJSON(document.location.origin + '/mobile/', {json: JSON.stringify(params)}, function (d) {
                    var contbet = contbets;

                    contbet.text('');
                    contbet.append($('<h1></h1>').text(pathtitle));

                    for (var i in d) {
                        var mp = $('<div><b></b><a></a> <span style="font-style:italic;"></span></div>');

                        if (d[i].type !== 'betting' || d[i].object.advanced_bet) {
                            $('a', mp).attr('ts:nav', (d[i].type === 'betting' ? path + '/' : '') + d[i].object.id);
                        }

                        if (d[i].object.name) {
                            $('a', mp).text(d[i].object.name);
                        }

                        if (d[i].object.gametype) {
                            $('span', mp).text('( ' + d[i].object.gametype + ' )');
                        }

                        if (d[i].type === 'betting') {
                            var bets = $('<div></div>');
                            mp.append(bets);

                            for (var j in d[i].object.bets) {
                                var od = d[i].object.bets[j];
                                bets.append($('<button class="btn btn-primary" type="button"></button>').html(od.title + ' <b>' + od.odds + '</b>').attr('ts:title', d[i].object.name + ' ( ' + d[i].object.gametype + ' )').attr('ts:bet', d[i].object.id + ';' + od.id));
                            }
                        }

                        contbet.append(mp);
                    }

                    contbet.append('<div><button class="btn btn-primary" type="button" ts:nav="back">&lt;&lt; Atgal</button> <button class="btn btn-primary" type="button" ts:nav="cancel">Atšaukti</button></div>');

                    $('a', contbet).click(function () {
                        var nnpath = $(this).attr('ts:nav');
                        if (nnpath) {
                            path = nnpath;
                            pathtitle = $(this).text();
                            getNextBets();
                        }
                    });
                    $('button', contbet).click(function () {
                        var b = $(this);
                        if ('back' === b.attr('ts:nav')) {
                            var parts = path.split('/');
                            parts.pop();
                            path = parts.join('/');
                            getNextBets();
                        }
                        else if ('cancel' === b.attr('ts:nav')) {
                            cont.show();
                            contbets.hide();
                        }
                        else if (b.attr('ts:bet')) {
                            selbets.push(b.attr('ts:bet'));
                            contlistbets.append($('<div></div>').html(b.attr('ts:title') + ' - ' + b.html()));
                            $('.noteprev').text('TOP statymas!');
                            $('input[name="notify[subject]"]').val('TOP statymas!');
                            recalcBets();
                            cont.show();
                            contbets.hide();

                        }
                    });

                });
            };
            getNextBets();
        };
    }

    function selectPathModal() {
        var wnd = $('#selectPathModal'),
            inp = $('input[name="notify[message_attr]"]'),
            inpt = $('input[name="notify[subject]"]'),
            path = inp.val(),
            pathtitle = inpt.val();

        var getPath = function () {
            var params = {method: 'offers', os: 'i2', lang: 'lt'};

            if (path !== '' && path.indexOf(':') >= 0) {
                path = '';
            }

            if (path === 'webViewBetConstruct' || path === 'webViewBetGamesTV') {
                path = '';
            }

            if (path !== '') {
                params.id = path;
            }

            $.getJSON(document.location.origin + '/mobile/', {json: JSON.stringify(params)}, function (d) {
                var cont = $('.modal-body', wnd),
                    footer = $('.modal-footer', wnd);

                cont.text('');

                for (var i in d) {
                    var mp = $('<div><a></a> <span style="font-style:italic;"></span></div>');

                    if (d[i].type !== 'betting' || d[i].object.advanced_bet) {
                        $('a', mp).attr('ts:nav', (d[i].type === 'betting' ? path + '/' : '') + d[i].object.id);
                    }

                    if (d[i].object.name) {
                        $('a', mp).text(d[i].object.name);
                    }

                    if (d[i].object.gametype) {
                        $('span', mp).text('( ' + d[i].object.gametype + ' )');
                    }

                    cont.append(mp);
                }

                footer.text('');
                footer.append('<button class = "btn btn-primary" type="button" ts:nav="back">&lt;&lt; Back</button> <button class = "btn btn-primary" type="button" data-dismiss="modal">Select</button>');
                $('a', cont).click(function () {
                    var nnpath = $(this).attr('ts:nav');

                    if (nnpath) {
                        path = nnpath;
                        pathtitle = $(this).text();
                        getPath();
                    }
                });
                $('button', footer).click(function () {
                    var b = $(this);
                    if ('back' === b.attr('ts:nav')) {
                        var parts = path.split('/');
                        parts.pop();
                        path = parts.join('/');
                        getPath();
                    }
                    else {
                        $('input[name="notify[message_attr]"]').val('');
                        $('input[name="notify[subject]"]').val('');
                        inp.val(path);
                        inpt.val(pathtitle);
                    }
                });
            });
        };
        getPath();
    }

    var validUntilSelector = '#player_document_valid_untill',
        issueDateSelector = '#player_document_issue_date',
        documentNumberSelector = '#player_document_document_number',
        playerDocumentComment = '#player_document_comment',
        playerDocumentStatus = 'input[name="player_document[status]"]';

    $(validUntilSelector).datetimepicker({
        lazyInit: true,
        format: 'Y-m-d',
        timepicker: false
    });

    $(issueDateSelector).datetimepicker({
        lazyInit: true,
        format: 'Y-m-d',
        timepicker: false
    });

    $(".zoom").on("mousewheel", function (e) {
        e.preventDefault();
        var $panzoom = $(this).panzoom();
        var delta = e.delta || e.originalEvent.wheelDelta;
        var zoomOut = delta ? delta < 0 : e.originalEvent.deltaY > 0;
        $panzoom.panzoom("zoom", zoomOut, {
            increment: 0.1,
            animate: true,
            focal: e
        });
    });

    $(playerDocumentStatus).init(function () {
        evaluate($(this).val());
    });
    $(playerDocumentStatus).change(function () {
        evaluate($(this).val());
    });

    function evaluate(val) {
        var statusApproved = '1';

        if (val === statusApproved) {
            $(playerDocumentComment).removeAttr('required');
            $(documentNumberSelector).prop('required', true);
        } else {
            $(documentNumberSelector).removeAttr('required');
            $(playerDocumentComment).prop('required', true);
        }
    }

    $('.js-rotate-left').click(function () {
        var image = $(this).closest("form").find(".js-rotate");
        image.rotate(getNextAngle(-90));
    });

    $('.js-rotate-right').click(function () {
        var image = $(this).closest("form").find(".js-rotate");
        image.rotate(getNextAngle(90));
    });

    var nextAngle = 0;

    function getNextAngle(angle) {
        nextAngle += angle;
        return nextAngle;
    }

    $(validUntilSelector).change(function () {
        var validUntilDate = $(this).val().split('-'),
            todaysDate = new Date();

        todaysDate = new Date(todaysDate.getFullYear(), todaysDate.getMonth(), todaysDate.getDate() - 1);
        validUntilDate = new Date(validUntilDate[0], validUntilDate[1] - 1, validUntilDate[2]);

        if (!(todaysDate < validUntilDate) && $(this).val()) {
            $(this).parent().addClass("has-error");
        } else {
            $(this).parent().removeClass("has-error");
        }
    });

    var $body = $("body");

    $body.on("collapsed.pushMenu", function () {
        setCookie('toggleState', 'closed', 365);

    });

    $body.on("expanded.pushMenu", function () {
        setCookie('toggleState', 'opened', 365);

    });
    var re = new RegExp('toggleState' + "=([^;]+)");
    var value = re.exec(document.cookie);
    var toggleState = (value != null) ? unescape(value[1]) : null;

    if (toggleState === 'closed') {
        $("body").addClass('sidebar-collapse');
    }

    function setCookie(cname, cvalue, exdays) {
        var d = new Date();
        d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
        var expires = "expires=" + d.toUTCString();
        document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
    }
});

function selectPopup() {
    $('input[name="notify[message_attr]"]').val(':m:');
    $('input[name="notify[url]"]').prop('disabled', 'disabled');

}
function redirectTo() {
    $('input[name="notify[message_attr]"]').val('Open');
    $('input[name="notify[url]"]').prop('required', 'required').prop('disabled', false);
}
function selectwebViewBetGamesTV() {
    $('input[name="notify[message_attr]"]').val('webViewBetGamesTV');
    $('input[name="notify[url]"]').prop('disabled', 'disabled');

}
function selectwebViewBetConstruct() {
    $('input[name="notify[message_attr]"]').val('webViewBetConstruct');
    $('input[name="notify[url]"]').prop('disabled', 'disabled');

}

function initializeCollectionType(divClass, addElementClass, removeElementClass, name, colSize) {
    colSize = typeof colSize !== 'undefined' ? colSize  : 'col-md-12';

    var $collectionHolder;
    var $addPriceLink = $('<div class="' + colSize + '"><a href="#" class="btn btn-danger ' + addElementClass + '">Add ' + name + '</a></div>');

    $('.' + divClass).on('click', '.' + removeElementClass, function(){
        removeElement(event, $(this), colSize);
    });

    $collectionHolder = $('div.' + divClass);
    $collectionHolder.append($addPriceLink);
    $collectionHolder.data('index', $collectionHolder.find(':input').length);

    $('.' + addElementClass).on('click', function (e) {
        addElement(e, $collectionHolder, $addPriceLink, removeElementClass, name, colSize);
    });
}

function addElement(e, holder, link, removeElementClass, name, colSize) {
    e.preventDefault();
    addTagForm(holder, link, removeElementClass, name, colSize);
}

function removeElement(e, $this, colSize) {
    e.preventDefault();
    $this.closest('.' + colSize).remove();
    $('form').submit();
}

function addTagForm(holder, link, removeElementClass, name, colSize) {
    var prototype = holder.data('prototype'),
        index = holder.data('index'),
        newForm = prototype.replace(/__name__/g, index);
    holder.data('index', index + 1);
    var $newFormLi = $('<div class="' + colSize + '"> <div class="box box-solid box-danger"> <div class="box-header with-border"> <h3 class="box-title">' + name + '</h3> <div class="box-tools pull-right"> ' +
        '<button type="button" class="btn btn-box-tool ' + removeElementClass + '" data-widget="remove"><i class="fa fa-times"></i></button> </div> ' +
        '</div> <div class="box-body"> ' + newForm + '</div> </div> </div></button></a>');

    link.before($newFormLi);
}


$('body').on('click', '.confirmation-dialog', function (e) {
    e.preventDefault();
    var message = $(this).data('message'),
        title = $(this).data('title'),
        cancel = $(this).data('cancel'),
        submit = $(this).data('submit'),
        $this = this;

    swal({
        title: title,
        text: message,
        cancelButtonText: cancel,
        type: "warning",
        showCancelButton: true,
        confirmButtonClass: "btn-danger",
        confirmButtonText: submit,
        closeOnConfirm: true
    }, function (isConfirm) {
        if (isConfirm) {
            window.location.href = $($this).attr('href');
        }
    });
});
