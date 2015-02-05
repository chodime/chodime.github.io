var form = function($){

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

    $('#inputRegister').click(function(event) {
        event.preventDefault();

        var email = $('#inputEmail').val();
        var donateValue = $('#inputAmount').val();
        var willDonate = $('#inputDonate').is(':checked');
        var name = $('#inputName').val();
        var phone = adjustPhoneNumber($('#inputPhone').val());

        validateField($('#inputAmount'), !willDonate || parseInt(donateValue) > 0);
        $('#inputPhone').val(phone);
        validateField($('#inputPhone'), !(!phone || phone.trim().length === 0));
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
            // go to donation page
            var totalAmount = 100;
            if (willDonate) {
                totalAmount += parseInt(donateValue);
            }
            var url = 'http://www.darujspravne.cz/prispevek/' + totalAmount + '/721/';
            window.location.href = url;
        }
    });

    $('#inputWalk').prop('checked', true);

};
form(jQuery);