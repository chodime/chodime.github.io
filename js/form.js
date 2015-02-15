var form = function($){

    var currentLanguage = 'cz';

    var topOffset = $('[data-scroller]').attr('data-offset');

    var validateEmail = function validateEmail(email) {
        var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(email);
    };

    var validateField = function(field, condition) {
        if (!condition) {
            field.closest('.form-group').addClass('has-error');
            field.select();
            field.focus();
        } else {
            field.closest('.form-group').removeClass('has-error');
        }
    };

    var adjustPhoneNumber = function(number) {
        if (!number) {
            return '';
        }
        return number.replace(/\D/g,'');
    };

    var googleFormId = '1E6cnbxByjpYRXjKeJbgBOj0oODv8GNTEKGn213sa8Qc';
    var googleFormEntries = {
        inputName : 'entry.1183915569',
        inputEmail : 'entry.646985132',
        inputSize : 'entry.602551427',
        inputRequests : 'entry.2132595967',
        inputAmount : 'entry.378396832',
        inputSource : 'entry.971956177',
        inputSendEmails : 'entry.1381002933'
    };

    var sendDataToGoogleForm = function(cb) {
        var toSend = {};
        $('#registerForm input,textarea,select').each(function () {
            var googleId = googleFormEntries[$(this).attr('id')];
            if (googleId) {
                if ($(this).attr('type') == 'checkbox') {
                    toSend[googleId] = $(this).is(':checked');
                } else {
                    toSend[googleId] = $(this).val();
                }
            }
        });
        $('#inputRegister').attr('disabled', 'disabled');
        var oldHtml = $('#inputRegister').html();
        $('#inputRegister').html('Processing...');
        $.support.cors = true;
        $.ajax({
            url : 'https://docs.google.com/forms/d/' + googleFormId + '/formResponse',
            data: toSend,
            type: 'POST',
            dataType: 'xml'
        })
        .always(function() {
            $('#inputRegister').html(oldHtml);
            $('#inputRegister').removeAttr('disabled');
            if (typeof cb == 'function') {
                cb();
            }
        });
    };

    var setLanguage = function(from, to) {
        var invisibleLanguage = from;
        currentLanguage = to;

        $('.' + invisibleLanguage).each(function() {
            $(this).css('display', 'none');
        });
        $('.' + currentLanguage).each(function() {
            $(this).css('display', 'inline');
        });
        // update placehodler
        $('[data-placeholder-' + currentLanguage + ']').each(function() {
            var value = $(this).attr('data-placeholder-' + currentLanguage);
            $(this).attr('placeholder', value);
        });
        // update text
        $('[data-text-' + currentLanguage + ']').each(function() {
            var value = $(this).attr('data-text-' + currentLanguage);
            $(this).html(value);
        });

    };

    $('#inputDonate').change(function(event) {
        if($(this).is(':checked')) {
            $('#inputAmount').removeAttr('disabled');
            $('#inputAmount').select();
            $('#inputAmount').focus();
        } else {
            $('#inputAmount').attr('disabled', 'disabled');
        }
    });

    $('#inputWalk').change(function(event) {
        if($(this).is(':checked')) {
            $('#inputRegister').removeAttr('disabled');
        } else {
            $('#inputRegister').attr('disabled', 'disabled');
        }
    });

    $('#lang').click(function() {
        var newLanguage;
        if (currentLanguage == 'en') {
           newLanguage = 'cz';
        } else {
           newLanguage = 'en';
        }
        setLanguage(currentLanguage, newLanguage);
    });

    $('#inputRegister').click(function(event) {
        event.preventDefault();

        var email = $('#inputEmail').val();
        var willDonate = $('#inputDonate').is(':checked');
        if (!willDonate) {
            $('#inputAmount').val('');
        }
        var donateValue = $('#inputAmount').val();
        var name = $('#inputName').val();

        validateField($('#inputAmount'), !willDonate || parseInt(donateValue) > 0);
        validateField($('#inputEmail'), validateEmail(email));
        validateField($('#inputName'), !(!name || name.trim().length === 0));

        var errorFields = $('#registerForm .has-error');
        if (errorFields.length > 0) {
            var errorField = $('#registerForm .has-error').first();
            $('html, body').animate({
                scrollTop: errorField.offset().top - topOffset - 50
            });
        } else {
            // register in google spreadsheet
            var totalAmount = 100;
            if (willDonate) {
                totalAmount += parseInt(donateValue);
            }
            var url = 'http://www.darujspravne.cz/prispevek/' + totalAmount + '/721/';
            var tab = window.open(url);
            sendDataToGoogleForm(function() {
                if (tab && typeof tab.focus == 'function') {
                    tab.focus();
                }
            });
        }
    });

    $('#inputWalk').prop('checked', true);
    setLanguage('en', 'cz');

};
form(jQuery);