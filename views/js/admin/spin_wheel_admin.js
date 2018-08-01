/**
 * DISCLAIMER
 *
 * Do not edit or add to this file if you wish to upgrade PrestaShop to newer
 * versions in the future. If you wish to customize PrestaShop for your
 * needs please refer to http://www.prestashop.com for more information.
 * We offer the best and most useful modules PrestaShop and modifications for your online store.
 *
 * @author    knowband.com <support@knowband.com>
 * @copyright 2017 Knowband
 * @license   see file: LICENSE.txt
 * @category  PrestaShop Module
 *
 *
 * Description
 *
 * Gamification wheel for offering discount coupons.
 */
$(document).ready(function ()
{
    $('.datetimepicker').click(function(){
            $('.ui-datepicker').css('z-index', '99999999');
        });
    if(imageexist){
        $('#remove-button').show();
    } else {
        $('#remove-button').hide();
    }
//    if (email_marketing_values['mailchimp_status'] == 1) {
//        $('.spin_error').remove();
//        var mailchimphtml = '';
//        if (email_marketing_values['mailchimp_api'] != '') {
//            $.ajax({
//                url: module_path,
//                type: 'post',
//                data: 'ajax=true&method=mailchimpgetlist&api_key=' + email_marketing_values['mailchimp_api'],
//                dataType: 'json',
//                success: function (json) {
//                    if (json['error'] !== undefined) {
//                        $("[name='spin_wheel[mailchimp_list]']").html('<option value="no_list">' + json['error'][0]['label'] + '</option>');
//                        $("[name='spin_wheel[mailchimp_list]']").css('border', '1px solid #ff0000');
//                    }
//                    else {
//                        mailchimphtml += '<select name="spin_wheel[mailchimp_list]"';
//                        mailchimphtml += 'id="spin_wheel[mailchimp_list]">';
//                        for (i in json['success'])
//                        {
//                            if (email_marketing_values['mailchimp_list'] == json['success'][i]['value']) {
//                                mailchimphtml += '<option value="' + json['success'][i]['value'] + '" selected>' + json['success'][i]['label'] + '</option>';
//                            }
//                            else {
//                                mailchimphtml += '<option value="' + json['success'][i]['value'] + '">' + json['success'][i]['label'] + '</option>';
//                            }
//                        }
//                        mailchimphtml += '</select>';
//                        $("[name='spin_wheel[mailchimp_list]']").html(mailchimphtml);
//                        $("[name='spin_wheel[mailchimp_list]']").css('border', '');
//                    }
//                }
//            });
//        }
//    }
//    if (email_marketing_values['klaviyo_status'] == 1) {
//        $('.spin_error').remove();
//        var api_key = email_marketing_values['klaviyo_api'];
//        var listid = email_marketing_values['klaviyo_list'];
//        var klaviyohtml = '';
//        if (api_key != '') {
//            $.ajax({
//                url: module_path,
//                type: 'post',
//                data: 'ajax=true&method=klaviyogetlist&api_key=' + api_key,
//                dataType: 'json',
//                success: function (json) {
//                    if (json['error'] !== undefined) {
//                        $("[name='spin_wheel[klaviyo_list]']").html('<option value="no_list">' + json['error'][0]['label'] + '</option>');
//                        $("[name='spin_wheel[klaviyo_list]']").css('border', '1px solid #ff0000');
//                    }
//                    else {
//                        klaviyohtml += '<select name="spin_wheel[klaviyo_list]"';
//
//                        klaviyohtml += 'id="klaviyo_selectlist">';
//
//                        for (i in json['success'])
//                        {
//                            if (listid == json['success'][i]['value'])
//                                klaviyohtml += '<option value="' + json['success'][i]['value'] + '" selected>' + json['success'][i]['label'] + '</option>';
//                            else
//                                klaviyohtml += '<option value="' + json['success'][i]['value'] + '">' + json['success'][i]['label'] + '</option>';
//                        }
//                        klaviyohtml += '</select>';
//                        $("[name='spin_wheel[klaviyo_list]']").html(klaviyohtml);
//                        $("[name='spin_wheel[klaviyo_list]']").css('border', '');
//                    }
//                }
//            });
//        }
//    }

    //getLineGraph(total_generated_coupon_data, total_unused_data, total_used_data, ticks);
    $('#discount_track_from_date').datepicker();
    $('#discount_track_to_date').datepicker();
    $('.datepicker').datepicker({
        dateFormat: 'yy-mm-dd',
    });
    $('#velsof_spin_filter').on('click', function () {
        $('.spin_error').remove();
        $("input[name='discount_track_from_date']").removeClass('error_field');
        $("input[name='discount_track_to_date']").removeClass('error_field');
        var error = false;
        var from_date_mand = velovalidation.checkMandatory($("#discount_track_from_date"));
        if (from_date_mand != true) {
            error = true;
            $("input[name='discount_track_from_date']").addClass('error_field');
            $("input[name='discount_track_from_date']").closest('.filter_inline_div').after($('<p class="from_date_mand spin_error">' + from_date_mand + '</p>'));
        } else {
            var from_date_syntax = velovalidation.checkDateddmmyy($("#discount_track_from_date"));
            if (from_date_syntax != true) {
                error = true;
                $("input[name='discount_track_from_date']").addClass('error_field');
                $("input[name='discount_track_from_date']").closest('.filter_inline_div').after($('<p class="from_date_mand spin_error">' + from_date_syntax + '</p>'));
            }
        }

        if (error != true) {
            var to_date_mand = velovalidation.checkMandatory($("#discount_track_to_date"));
            if (to_date_mand != true) {
                error = true;
                $("input[name='discount_track_to_date']").addClass('error_field');
                $("input[name='discount_track_to_date']").closest('.filter_inline_div').after($('<p class="to_date_mand spin_error">' + to_date_mand + '</p>'));
            } else {
                var to_date_syntax = velovalidation.checkDateddmmyy($("#discount_track_to_date"));
                if (to_date_syntax != true) {
                    error = true;
                    $("input[name='discount_track_to_date']").addClass('error_field');
                    $("input[name='discount_track_to_date']").closest('.filter_inline_div').after($('<p class="to_date_mand spin_error">' + to_date_syntax + '</p>'));
                }
            }
        }
        if (error !== true) {
            var from_arr = $("#discount_track_from_date").val().split('/');
            var to_arr = $("#discount_track_to_date").val().split('/');
            
        var from = new Date(from_arr[1] +"/"+ from_arr[0] +"/"+ from_arr[2]);
        var to = new Date(to_arr[1] +"/"+ to_arr[0] +"/"+ to_arr[2]);
        var today = new Date();
            if (from > to)
            {
                var error = true;
                $("input[name='discount_track_from_date']").addClass('error_field');
                $("input[name='discount_track_to_date']").addClass('error_field');
                $("input[name='discount_track_to_date']").closest('.filter_inline_div').after($('<p class="to_date_mand spin_error">' + fromtodate + '</p>'));
            } else if (to > today) {
                var error = true;
                $("input[name='discount_track_to_date']").addClass('error_field');
                $("input[name='discount_track_to_date']").closest('.filter_inline_div').after($('<p class="to_date_mand spin_error">To date cannot be greater that current date.</p>'));
            }
        }
        if (error === false) {
            $.ajax({
                url: module_path,
                type: 'post',
                data: 'ajax=true&method=filterData&from_date=' + $("#discount_track_from_date").val() + '&to_date=' + $("#discount_track_to_date").val(),
                dataType: 'json',
                beforeSend: function () {
                    $('#show_loader_filter').show();
                },
                success: function (json) {
                    if (json !== '') {
                        getLineGraph(json['total_generated'], json['total_unused'], json['total_used'], json['ticks']);
                        // alert('hgvyugv');
                    }
                    else {
                        alert('No data found.');
                    }
                },
                complete: function () {
                    $('#show_loader_filter').hide();
                }
            });

        }
    });

    $("#velsof_spin_wheel_image").on('change', function () {
        var imgPath = $(this)[0].value;
        var extn = imgPath.substring(imgPath.lastIndexOf('.') + 1).toLowerCase();
        var image_holder = $("#image-holder");
        $('.spin_error').remove();
        var img_vali = velovalidation.checkImage($(this),2097152,'mb');
        $('.default-image').hide();
        $('.thumb-image').remove();
        if (img_vali == true) {
            if (typeof (FileReader) != "undefined") {
                var reader = new FileReader();
                reader.onload = function (e) {
                    $("<img />", {
                        "src": e.target.result,
                        "class": "thumb-image",
                        "width": "200px",
                        "id": "new-image"
                    }).appendTo(image_holder);
                }
                $('#remove-button').show();
                image_holder.show();
                reader.readAsDataURL($(this)[0].files[0]);
            } else {
                alert(browser_support_text);
            }
            $('#imageerr').remove();
        } else {
            $('#remove-button').hide();
            $('.default-image').show();
            $('.thumb-image').remove();
            // alert(image_select_text);
            $('#velsof_spin_wheel_image-name').parent('.dummyfile').after($('<p class="imageerr spin_error">' + img_vali + '</p>'));
        }
    });



    $('#to_date').parent().parent().append('<div class="col-lg-4"><div class="row"><button class="filter_button btn btn-default" id="visitor_filter_button" onclick="return refreshGraphAjax();">' + filter_text + '</button>\n\
<button class="reset_button btn btn-default" id="visitor_reset_button" onclick="return resetGraphAjax();">' + reset_text + '</button></div></div>');
//$("[name='spin_wheel[from_date]']").parents().parents().addClass('row');
//$('<div class="row">').insertBefore($("[name='spin_wheel[from_date]']").parents('.form-group'));
    $("[name^='spin_wheel[email_templates]']").on('change', function () {
        var temp = $(this).val();
        //alert(email_lang);
        $.ajax({
            url: module_path,
            type: 'post',
            data: 'ajax=true&method=loadEmailTemplate&temp_name=' + temp + '&selected_lang=' + email_lang,
            dataType: 'json',
            success: function (json) {
                // alert(json);
                tinyMCE.get('optn_email_content_' + email_lang).setContent(json['body']);
            }
        });
    });

//    $('.edit').on('click',function(){
    $(document).on('click', '.edit', function () {
       var sliceNo =  $(this).closest('tr').find('td.slice_no');
        if ($.trim(sliceNo.text()) != "1") {
            alert(feature_not_available);
            
            return false;
        }
        
        $('.edit').closest('tr').removeClass('slice_tb');
        $('.edit').each(function () {
            $(this).addClass('disabled');
        });
        $(this).closest('tr').addClass('slice_tb');
        var link = $(this).attr('href');
        var arr = link.split('&');
        var slice_id_arr = arr[2].split('=');
        var slice_id = slice_id_arr[1];
        $(this).parent().html('<span class="slice_save btn btn-default" type="' + slice_id + '">' + save + '</span>');

        $.ajax({
            url: module_path,
            type: 'post',
            data: 'ajax=true&method=getSliceData&slice_id=' + slice_id,
            dataType: 'json',
            success: function (json) {
                var coupon_type = json['coupon_type'];
                var slice_label = json['slice_label'];
                var coupon_value = json['coupon_value'];
                var gravity_data = json['gravity'];
                var perselected = '';
                var fixselected = '';
                if (coupon_type == 'Percentage') {
                    perselected = 'selected';
                }
                if (coupon_type == 'Fixed') {
                    fixselected = 'selected';
                }

                var couponType = $('<select id="coupon_type_input"><option value="Percentage" ' + perselected + '>Percentage</option><option value="Fixed" ' + fixselected + '>Fixed</option></select>');
                var label = $('<input id="label_input" type="text" value="' + slice_label + '" />');
                var couponValue = $('<input id="coupon_value_input" type="text" value="' + coupon_value + '" />');
                var gravity = $('<input id="gravity_data_input" type="text" value="' + gravity_data + '" />');

                $('.slice_tb').find('.coupon_type').html(couponType);
                $('.slice_tb').find('.slice_label').html(label);
                $('.slice_tb').find('.coupon_value').html(couponValue);
                $('.slice_tb').find('.gravity').html(gravity);

            }
        });
        return false;
    });

    $(document).on('click', '.slice_save', function () {
        $('.spin_error').remove();
        var error_edit = 0;
        var slice_id = $(this).attr('type');
        var coupon_type = $('#coupon_type_input').val();
        var slice_label = $('#label_input').val();
        var slice_label_mand = velovalidation.checkMandatory($('[id^="label_input"]'));
        if (slice_label_mand !== true) {
            error_edit = 1;
            $('[id^="label_input"]').addClass('error_field');
            $('[id^="label_input"]').after($('<p class="slice_label_mand spin_error"></p>'));
            $('.slice_label_mand').html(slice_label_mand);

        }
        var coupon_value = $('#coupon_value_input').val();
        var coupon_value_input_mand = velovalidation.checkMandatory($('[id^="coupon_value_input"]'));
        var coupon_value_input_num = velovalidation.isNumeric($('[id^="coupon_value_input"]'));
        var coupon_value_input_percent = velovalidation.checkPercentage($('[id^="coupon_value_input"]'));
        if(coupon_type === 'Percentage') {
        if (coupon_value_input_mand !== true) {
            error_edit = 1;
            $('[id^="coupon_value_input"]').addClass('error_field');
            $('[id^="coupon_value_input"]').after($('<p class="coupon_value_input_mand spin_error"></p>'));
            $('.coupon_value_input_mand').html(coupon_value_input_mand);

        } else if(coupon_value_input_percent !== true) {
            error_edit = 1;
            $('[id^="coupon_value_input"]').addClass('error_field');
            $('[id^="coupon_value_input"]').after($('<p class="coupon_value_input_percent spin_error"></p>'));
            $('.coupon_value_input_percent').html(coupon_value_input_percent);
        }
        } else {
        if (coupon_value_input_mand !== true) {

            error_edit = 1;
            $('[id^="coupon_value_input"]').addClass('error_field');
            $('[id^="coupon_value_input"]').after($('<p class="coupon_value_input_mand spin_error"></p>'));
            $('.coupon_value_input_mand').html(coupon_value_input_mand);

        }
        else if (coupon_value_input_num !== true) {

            error_edit = 1;
            $('[id^="coupon_value_input"]').addClass('error_field');
            $('[id^="coupon_value_input"]').after($('<p class="coupon_value_input_num spin_error"></p>'));
            $('.coupon_value_input_num').html(coupon_value_input_num);

        }
    }
        // var gravity = $('#gravity_data_input').val();
        var gravity = $('#gravity_data_input').val();

        var gravity_data_input_mand = velovalidation.checkMandatory($('[id^="gravity_data_input"]'));
        var gravity_data_input_num = velovalidation.isNumeric($('[id^="gravity_data_input"]'));
        if (gravity_data_input_mand !== true) {

            error_edit = 1;
            $('[id^="gravity_data_input"]').addClass('error_field');
            $('[id^="gravity_data_input"]').after($('<p class="gravity_data_input_mand spin_error"></p>'));
            $('.gravity_data_input_mand').html(gravity_data_input_mand);

        } else if (gravity_data_input_num !== true) {

            error_edit = 1;
            $('[id^="gravity_data_input"]').addClass('error_field');
            $('[id^="gravity_data_input"]').after($('<p class="gravity_data_input_num spin_error"></p>'));
            $('.gravity_data_input_num').html(gravity_data_input_num);

        } else if (gravity.trim() > 100) {
            error_edit = 1;
            $('[id^="gravity_data_input"]').addClass('error_field');
            $('[id^="gravity_data_input"]').after($('<p class="gravity_data_input_mand spin_error"></p>'));
            $('.gravity_data_input_mand').html(value_between_msg2);
        } else {
            var c = 0;
            $('td.gravity').each(function () {
                var gravity_val = $(this).text().trim();
                var thenum = gravity_val.replace(/^\D+/g, '');
                c = Number(c) + Number(thenum);
            });
            c = c + Number(gravity);
            //  alert(c);
            if (c > 100 || c < 1) {
                error_edit = 1;
                $('[id^="gravity_data_input"]').addClass('error_field');
                $('[id^="gravity_data_input"]').after($('<p class="spin_error">' + value_sum + c + '</p>'));
            }

        }
        //alert(gravity);
        if (error_edit === 0) {
            $.ajax({
                url: module_path,
                type: 'post',
                data: 'ajax=true&method=updateSliceData&slice_id=' + slice_id + '&coupon_type=' + coupon_type + '&slice_label=' + slice_label + '&coupon_value=' + coupon_value + '&gravity=' + gravity,
                dataType: 'json',
                beforeSend: function (){
                    var html = "<div class='velsof_spinwheel_admin_overlay'></div>";
                    $('body').append(html);
                },
                success: function (json) {
                    if (json === true) {
                        showSuccessMessage(update_success_msg);
                        refresh();
                    } else {
                        showErrorMessage(update_error_msg);
                    }
                    
                }
            });
        }
    });

//    $("[name^='spin_wheel[mailchimp_api]']").on('blur', function () {
//        $('.spin_error').remove();
//        var mailchimp_api_key = $(this).val().trim();
//        var clickmailchimphtml = '';
//        if (mailchimp_api_key != '') {
//            $.ajax({
//                url: module_path,
//                type: 'post',
//                data: 'ajax=true&method=mailchimpgetlist&api_key=' + mailchimp_api_key,
//                dataType: 'json',
//                success: function (json) {
//                    if (json['error'] !== undefined) {
//                        $("[name='spin_wheel[mailchimp_list]']").html('<option value="no_list">' + json['error'][0]['label'] + '</option>');
//                        $("[name='spin_wheel[mailchimp_list]']").css('border', '1px solid #ff0000');
//                    } else {
//                        clickmailchimphtml += '<select name="spin_wheel[mailchimp_list]"';
//
//                        clickmailchimphtml += 'id="spin_wheel[mailchimp_list]">';
//
//                        for (i in json['success'])
//                        {
//                            clickmailchimphtml += '<option value="' + json['success'][i]['value'] + '">' + json['success'][i]['label'] + '</option>';
//                        }
//                        clickmailchimphtml += '</select>';
//                        $("[name='spin_wheel[mailchimp_list]']").html(clickmailchimphtml);
//                        $("[name='spin_wheel[mailchimp_list]']").css('border', '');
//                    }
//                }
//            });
//        }
//    });
//
//    $("[name^='spin_wheel[klaviyo_api]']").on('blur', function () {
//        $('.spin_error').remove();
//        var klaviyo_api_key = $(this).val().trim();
//        var clickklaviyohtml = '';
//        $.ajax({
//            url: module_path,
//            type: 'post',
//            data: 'ajax=true&method=klaviyogetlist&api_key=' + klaviyo_api_key,
//            dataType: 'json',
//            success: function (json_data) {
//                if (json_data['error'] !== undefined) {
//                    $("[name='spin_wheel[klaviyo_list]']").html('<option value="no_list">' + json_data['error'][0]['label'] + '</option>');
//                    $("[name='spin_wheel[klaviyo_list]']").css('border', '1px solid #ff0000');
//                }
//                else {
//                    clickklaviyohtml += '<select name="spin_wheel[klaviyo_list]"';
//
//                    clickklaviyohtml += 'id="klaviyo_selectlist">';
//
//                    for (i in json_data['success'])
//                    {
//                        clickklaviyohtml += '<option value="' + json_data['success'][i]['value'] + '">' + json_data['success'][i]['label'] + '</option>';
//                    }
//                    clickklaviyohtml += '</select>';
//                    $("[name='spin_wheel[klaviyo_list]']").html(clickklaviyohtml);
//                    $("[name='spin_wheel[klaviyo_list]']").css('border', '');
//
//                }
//            }
//        });
//    });

    $("#test_email").on('click', function () {
        $('.spin_error').remove();
        $('.success_field').remove();
        var error = false;
        var email = $("[name^='spin_wheel[test_email]']").val();
        var check_email_mand = velovalidation.checkMandatory($("input[name='spin_wheel[test_email]']"));
        var check_email = velovalidation.checkEmail($("input[name='spin_wheel[test_email]']"));
        if (check_email_mand !== true) {

            error = true;
            $("input[name='spin_wheel[test_email]']").addClass('error_field');
            $("input[name='spin_wheel[test_email]']").after($('<p class="check_email_mand spin_error"></p>'));
            $('.check_email_mand').html(check_email_mand);
        }
        else if (check_email !== true) {

            error = true;
            $("input[name='spin_wheel[test_email]']").addClass('error_field');
            $("input[name='spin_wheel[test_email]']").after($('<p class="check_email spin_error"></p>'));
            $('.check_email').html(check_email);
        }
        if (error === false) {
            $.ajax({
                url: module_path,
                type: 'post',
                data: 'ajax=true&method=sendTestMail&email=' + email,
                dataType: 'json',
                beforeSend: function () {
                    $('#show_loader').show();
                },
                success: function (json) {

                    if (json == true) {
                        $("input[name='spin_wheel[test_email]']").after($('<p class="email_sent success_field"></p>'));
                        $('.email_sent').html(email_sent);
                    } else {
                        $("input[name='spin_wheel[test_email]']").after($('<p class="email_sent_error spin_error"></p>'));
                        $('.email_sent_error').html(json);
                    }
                },
                complete: function () {
                    $('#show_loader').hide();
                }
            });

        }
    });

//    $('<div class="panel_spin_wheel">MailChimp</div>').insertBefore($("[name='spin_wheel[mailchimp_status]']").parents('.form-group'));
//    $('<div class="panel_spin_wheel">Klaviyo</div>').insertBefore($("[name='spin_wheel[klaviyo_status]']").parents('.form-group'));
    $('<div class="panel_spin_wheel">Constant Contact</div>').insertBefore($("[name='spin_wheel[constant_contact_status]']").parents('.form-group'));
    $('<div class="panel_spin_wheel">Get Response</div>').insertBefore($("[name='spin_wheel[getresponse_status]']").parents('.form-group'));

    $('[name="spin_wheel[fix_time]"]').click(function () {// alert('hi');
        if ($(this).val() == '1') {//alert('hi');
            $("[name='spin_wheel[active_date]']").parents('.form-group').show();
            $("[name='spin_wheel[expire_date]']").parents('.form-group').show();
        } else {//
            $("[name='spin_wheel[active_date]']").parents('.form-group').hide();
            $("[name='spin_wheel[expire_date]']").parents('.form-group').hide();
        }
    });
    $('[name="spin_wheel[coupon_display_options]"]').click(function () {
        if ($(this).val() == '1') {//alert('hi');
            $("[name='spin_wheel_email_subject_1']").parents('.form-group ').hide();
            $("[name^='spin_wheel[email_templates]']").closest('.form-group ').hide();
            $("[name='spin_wheel_email_content_"+language_id+"']").parents('.form-group').hide();
            $(".optn_test_email").closest('.form-group ').hide();
            $(".test_button").hide();
        } else {//
            $("[name='spin_wheel_email_subject_1']").parents('.form-group ').show();
            $("[name^='spin_wheel[email_templates]']").closest('.form-group ').show();
            $("[name='spin_wheel_email_content_"+language_id+"']").parents('.form-group').show();
            $(".optn_test_email").closest('.form-group ').show();
            $(".test_button").show();
        }
    });

//    $('[name="spin_wheel[mailchimp_status]"]').click(function () {// alert('hi');
//        if ($(this).val() == '1') {
//            $("[name='spin_wheel[mailchimp_api]']").parents('.form-group').show();
//            $("[name='spin_wheel[mailchimp_list]']").parents('.form-group').show();
//        } else {//
//            $("[name='spin_wheel[mailchimp_api]']").parents('.form-group').hide();
//            $("[name='spin_wheel[mailchimp_list]']").parents('.form-group').hide();
//        }
//    });

//    $('[name="spin_wheel[klaviyo_status]"]').click(function () {// alert('hi');
//        if ($(this).val() == '1') {//alert('hi');
//            $("[name='spin_wheel[klaviyo_api]']").parents('.form-group').show();
//            $("[name='spin_wheel[klaviyo_list]']").parents('.form-group').show();
//        } else {//
//            $("[name='spin_wheel[klaviyo_api]']").parents('.form-group').hide();
//            $("[name='spin_wheel[klaviyo_list]']").parents('.form-group').hide();
//        }
//    });
//    $('[name="spin_wheel[getresponse_status]"]').click(function () {// alert('hi');
//        if ($(this).val() == '1') {//alert('hi');
//            $("[name='spin_wheel[getresponse_api]']").parents('.form-group').show();
//            $("[name='spin_wheel[getresponse_list]']").parents('.form-group').show();
//        } else {//
//            $("[name='spin_wheel[getresponse_api]']").parents('.form-group').hide();
//            $("[name='spin_wheel[getresponse_list]']").parents('.form-group').hide();
//        }
//    });

//    $('[name="spin_wheel[constant_contact_status]"]').click(function () {// alert('hi');
//        if ($(this).val() == '1') {//alert('hi');
//            $("[name='spin_wheel[constant_contact_api]']").parents('.form-group').show();
//            $("[name='spin_wheel[constant_contact_token]']").parents('.form-group').show();
//            $("[name='spin_wheel[constant_contact_list]']").parents('.form-group').show();
//        } else {//
//            $("[name='spin_wheel[constant_contact_api]']").parents('.form-group').hide();
//            $("[name='spin_wheel[constant_contact_token]']").parents('.form-group').hide();
//            $("[name='spin_wheel[constant_contact_list]']").parents('.form-group').hide();
//        }
//    });

    $('[name="spin_wheel[when_to_display]"]').on('change', function () {
        if ($(this).val() === '2') {
            //alert('test');
            $("[name='spin_wheel[time_display]']").parents('.form-group').show();
        }
        else {
            $("[name='spin_wheel[time_display]']").parents('.form-group').hide();
        }
        if ($(this).val() === '3') {
            //alert('test');
            $("[name='spin_wheel[scroll_display]']").parents('.form-group').show();
        }
        else {
            $("[name='spin_wheel[scroll_display]']").parents('.form-group').hide();
        }
    });

    $('[name="spin_wheel[geo_location]"]').on('change', function () {
        if ($(this).val() === '2') {
            //alert('test');
            $("[name='spin_wheel[selected_country][]']").parents('.form-group').show();
        }
        else {
            $("[name='spin_wheel[selected_country][]']").parents('.form-group').hide();
        }
        if ($(this).val() === '3') {
            //alert('test');
            $("[name='spin_wheel[unselected_country][]']").parents('.form-group').show();
        }
        else {
            $("[name='spin_wheel[unselected_country][]']").parents('.form-group').hide();
        }

    });

    $('[name="spin_wheel[where_to_display]"]').on('change', function () {
        if ($(this).val() === '2') {
            //alert('test');
            $("[name='spin_wheel[show_page][]']").parents('.form-group').show();
        }
        else {
            $("[name='spin_wheel[show_page][]']").parents('.form-group').hide();
        }
        if ($(this).val() === '3') {
            //alert('test');
            $("[name='spin_wheel[not_show_page][]']").parents('.form-group').show();
        }
        else {
            $("[name='spin_wheel[not_show_page][]']").parents('.form-group').hide();
        }

    });

    $(".graph_spin_wheel").hide();
    $("[name='spin_wheel[show_page][]']").parents('.form-group').hide();
    $("[name='spin_wheel[not_show_page][]']").parents('.form-group').hide();
    $("[name='spin_wheel[selected_country][]']").parents('.form-group').hide();
    $("[name='spin_wheel[unselected_country][]']").parents('.form-group').hide();
    $("[name='spin_wheel[time_display]']").parents('.form-group').hide();
    $("[name='spin_wheel[scroll_display]']").parents('.form-group').hide();
    $('#configuration_form').addClass('col-lg-10 col-md-9');
    $("[name='spin_wheel[enable]']").closest('.form-group ').show();
    $("[name^='spin_wheel[show_popup]']").closest('.form-group ').show();
    $("[name^='spin_wheel[display_interval]']").closest('.form-group ').show();
    $("[name='spin_wheel[email_recheck]']").closest('.form-group ').show();
    $("[name='spin_wheel_email_subject_1']").parents('.form-group ').hide();
    $("[name^='spin_wheel[email_templates]']").closest('.form-group ').hide();
    $("[name='spin_wheel_email_content_1']").parents('.form-group').hide();
    $(".optn_test_email").closest('.form-group ').hide();
    $(".test_button").hide();
    $("[name='spin_wheel[logo]']").parents('.form-group').hide();
    $("[name='spin_wheel[background_color_spin]']").parents('.form-group').hide();
    $("[name='spin_wheel[background_color_cancel]']").parents('.form-group').hide();
    $("[name='spin_wheel[title_text]']").closest('.form-group').hide();
    $("[name='spin_wheel[guide_text]']").closest('.form-group').hide();
    // tinymce.attr('optn_title_text').show();
//    $("[name='spin_wheel[background_color_wheel]']").parents('.form-group').hide();
//    $("[name='spin_wheel[text_color_wheel]']").parents('.form-group').hide();
    $("[name='spin_wheel[background_color_slice_even]']").parents('.form-group').hide();
    $("[name='spin_wheel[background_color_slice_odd]']").parents('.form-group').hide();
    $("[name='spin_wheel[active_date]']").parents('.form-group').hide();
    $("[name='spin_wheel[expire_date]']").parents('.form-group').hide();
    $('.list_slice').hide();
    $("[name='spin_wheel[min_screen_size]']").closest('.form-group').hide();
    $("[name='spin_wheel[max_display_freq]']").closest('.form-group').hide();
    $("[name='spin_wheel[hide_after]']").closest('.form-group').hide();
    $("[name='spin_wheel[where_to_display]']").parents('.form-group').hide();
    $("[name='spin_wheel[who_to_show]']").closest('.form-group').hide();
    $("[name='spin_wheel[when_to_display]']").closest('.form-group').hide();
    $("[name='spin_wheel[geo_location]']").closest('.form-group').hide();
    $("[name='spin_wheel[fix_time]']").closest('.form-group').hide();
    $("[name='spin_wheel[coupon_display_options]']").closest('.form-group').hide();
//    $("[name='spin_wheel[mailchimp_status]']").closest('.form-group').hide();
//    $("[name='spin_wheel[mailchimp_api]']").closest('.form-group').hide();
//    $("[name='spin_wheel[mailchimp_list]']").closest('.form-group').hide();
    $("[name='spin_wheel[constant_contact_status]']").parents('.form-group').hide();
    $("[name='spin_wheel[constant_contact_api]']").closest('.form-group').hide();
    $("[name='spin_wheel[constant_contact_token]']").closest('.form-group').hide();
    $("[name='spin_wheel[constant_contact_list]']").closest('.form-group').hide();
//    $("[name='spin_wheel[klaviyo_status]']").closest('.form-group').hide();
//
//    $("[name='spin_wheel[klaviyo_api]']").closest('.form-group').hide();
//    $("[name='spin_wheel[klaviyo_list]']").closest('.form-group').hide();
    $("[name='spin_wheel[getresponse_status]']").closest('.form-group').hide();
    $("[name='spin_wheel[getresponse_api]']").closest('.form-group').hide();
    $("[name='spin_wheel[getresponse_list]']").closest('.form-group').hide();
    $('.panel_spin_wheel').hide();
    $("[name='spin_wheel[to_date]']").closest('.form-group').hide();
    $("[name='spin_wheel[from_date]']").closest('.form-group').hide();
    $("[name='spin_wheel[display_image]']").closest('.form-group').hide();
    $('.kpi-container').hide();
//    var drawPieChart = function (data, colors, id) {
//        var canvas = document.getElementById(id);
//        var ctx = canvas.getContext('2d');
//        var x = canvas.width / 2;
//        y = canvas.height / 2;
//        var color,
//                startAngle,
//                endAngle,
//                total = getTotal(data);
//
//        for (var i = 0; i < data.length; i++) {
//            color = colors[i];
//            startAngle = calculateStart(data, i, total);
//            endAngle = calculateEnd(data, i, total);
//
//            ctx.beginPath();
//            ctx.fillStyle = color;
//            ctx.moveTo(x - 100, y - 100);
//            ctx.arc(x - 100, y - 100, y - 130, startAngle, endAngle);
//            ctx.fill();
//            ctx.rect(canvas.width - 420, y - i * 30, 12, 15);
//            ctx.fill();
//            ctx.font = "13px sans-serif";
//            ctx.fillText(data[i].label + " - " + data[i].value + " (" + calculatePercent(data[i].value, total) + "%)", canvas.width - 420 + 40, y - i * 30 + 15);
//        }
//    };

    var calculatePercent = function (value, total) {

        return (value / total * 100).toFixed(2);
    };

    var getTotal = function (data) {
        var sum = 0;
        for (var i = 0; i < data.length; i++) {
            sum += data[i].value;
        }

        return sum;
    };

    var calculateStart = function (data, index, total) {
        if (index === 0) {
            return 0;
        }

        return calculateEnd(data, index - 1, total);
    };

    var calculateEndAngle = function (data, index, total) {
        var angle = data[index].value / total * 360;
        var inc = (index === 0) ? 0 : calculateEndAngle(data, index - 1, total);

        return (angle + inc);
    };

    var calculateEnd = function (data, index, total) {

        return degreeToRadians(calculateEndAngle(data, index, total));
    };

    var degreeToRadians = function (angle) {
        return angle * Math.PI / 180
    }

    var i;
    var data = [];
    var colors = [];
    var temp_color = ({
        0: '#39CCCC',
        1: '#3D9970',
        2: '#001F3F',
        3: '#85144B',
        4: '#00FFFF',
        5: '#7FFF00',
        6: '#6495ED',
        7: '#C71585',
        8: '#B0C4DE',
        9: '#FA8072'
    });
    $.ajax({
        type: "POST",
        url: module_path,
        data: 'ajax=true&method=getGraphCountryData',
        dataType: 'json',
        success: function (json) {
            for (i = 0; i < json.length; i++)
            {
                data.push({
                    label: json[i]['country'],
                    value: parseInt(json[i]['count'], 10)
                });
                colors.push([temp_color[i]]);
            }
            id = 'pie_country';
            //drawPieChart(data, colors, id);
        }
    });
    var j;
    var data_device = [];
    var colors2 = [];
    var temp_color = ({
        0: '#39CCCC',
        1: '#3D9970',
        2: '#001F3F',
        3: '#85144B',
        4: '#00FFFF',
        5: '#7FFF00',
        6: '#6495ED',
        7: '#C71585',
        8: '#B0C4DE',
        9: '#FA8072'
    });

    $.ajax({
        type: "POST",
        url: module_path,
        data: 'ajax=true&method=getGraphDeviceData',
        dataType: 'json',
        success: function (json) {
            for (j = 0; j < json.length; j++)
            {
                data_device.push({
                    label: json[j]['device'],
                    value: parseInt(json[j]['count'], 10)
                });
                colors2.push([temp_color[j]]);
            }
            //drawPieChart(data_device, colors2, 'pie_device');
        }
    });
//    function getLineGraph(total_generated_coupon_data, total_unused_data, total_used_data, ticks) {
//        var data1 = [];
//        var data2 = [];
//        var data3 = [];
//
//        var dataObj1 = total_generated_coupon_data;
//        var dataObj2 = total_unused_data;
//        var dataObj3 = total_used_data;
//        var dataObj4 = ticks;
//
//        var tickss = [];
//        for (var i in dataObj4)
//        {
//            tickss.push([i, dataObj4[i]]);
//            data1.push([i, dataObj1[i]]);
//            data2.push([i, dataObj3[i]]);
//            data3.push([i, dataObj2[i]]);
//        }
//
//        var dataset = [
//            {
//                label: total_generated_coupon,
//                data: data1,
//                points: {fillColor: "#0062FF", show: true},
//                lines: {show: true, fillColor: '#DA4C4C'}
//            },
//            {
//                label: total_used_coupons,
//                data: data2,
//                points: {fillColor: "#FF0000", show: true},
//                lines: {show: true, fillColor: '#DA4C4C'}
//            },
//            {
//                label: coupon_unused,
//                data: data3,
//                points: {fillColor: "#b000df", show: true},
//                lines: {show: true, fillColor: '#b000df'}
//            }
//        ];
//
//        var options = {
//            series: {
//                lines: {
//                    show: true
//                },
//                points: {
//                    radius: 3,
//                    fill: true,
//                    show: true
//                }
//            },
//            xaxis: {
//                ticks: tickss,
//                axisLabel: "Time",
//                axisLabelUseCanvas: true,
//                axisLabelFontSizePixels: 12,
//                axisLabelFontFamily: 'Verdana, Arial',
//                axisLabelPadding: 10
//            },
//            yaxes: [{
//                    axisLabel: "No. of times",
//                    axisLabelUseCanvas: true,
//                    axisLabelFontSizePixels: 12,
//                    axisLabelFontFamily: 'Verdana, Arial',
//                    axisLabelPadding: 3,
//                }, {
//                    position: "right",
//                    axisLabel: "Change",
//                    axisLabelUseCanvas: true,
//                    axisLabelFontSizePixels: 12,
//                    axisLabelFontFamily: 'Verdana, Arial',
//                    axisLabelPadding: 3
//                }
//            ],
//            legend: {
//                noColumns: 0,
//                labelBoxBorderColor: "#000000",
//                position: "nw"
//            },
//            grid: {
//                hoverable: true,
//                borderWidth: 2,
//                borderColor: "#633200",
//                backgroundColor: {colors: ["#ffffff", "#EDF5FF"]}
//            },
//            colors: ["#FF0000", "#0022FF"]
//        };
//        $.plot($('#flot-placeholder1'), dataset, options);
//        $('#flot-placeholder1').UseTooltip();
//    }
if(default_tab == 'analytics') {
      setTimeout(function(){
                    $('#link-Statistics').trigger('click');
                },
                500
            );
}
});
var previousPoint = null, previousLabel = null;
var monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
$.fn.UseTooltip = function () {
    $(this).bind("plothover", function (event, pos, item) {
        if (item) {
            if ((previousLabel != item.series.label) || (previousPoint != item.dataIndex)) {
                previousPoint = item.dataIndex;
                previousLabel = item.series.label;
                $("#tooltip").remove();

                var x = item.datapoint[0];
                var y = item.datapoint[1];

                var color = item.series.color;
                var month = new Date(x).getMonth();
                if (item.seriesIndex == 0) {
                    showTooltip(item.pageX,
                            item.pageY,
                            color,
                            "<strong>" + item.series.label + "</strong><br><strong>" + y + "</strong>");
                } else {
                    showTooltip(item.pageX,
                            item.pageY,
                            color,
                            "<strong>" + item.series.label + "</strong><br><strong>" + y + "</strong>");
                }
            }
        } else {
            $("#tooltip").remove();
            previousPoint = null;
        }
    });
};
function gd(year, month, day) {
    return new Date(year, month, day).getTime();
}


function showTooltip(x, y, color, contents) {
    $('<div id="tooltip">' + contents + '</div>').css({
        position: 'absolute',
        display: 'none',
        top: y - 40,
        left: x - 120,
        border: '2px solid ' + color,
        padding: '3px',
        'font-size': '9px',
        'border-radius': '5px',
        'background-color': '#fff',
        'font-family': 'Verdana, Arial, Helvetica, Tahoma, sans-serif',
        opacity: 0.9
    }).appendTo("body").fadeIn(200);
}

function getCookie(name) {
    var dc = document.cookie;
    var prefix = name + "=";
    var begin = dc.indexOf("; " + prefix);
    if (begin == -1) {
        begin = dc.indexOf(prefix);
        if (begin != 0)
            return null;
    }
    else
    {
        begin += 2;
        var end = document.cookie.indexOf(";", begin);
        if (end == -1) {
            end = dc.length;
        }
    }
    return decodeURI(dc.substring(begin + prefix.length, end));
}
function change_tab(a, b)
{
    if (b == 1) {
        document.cookie = 'tab=1';
        // var tt = document.cookie ;
        var myCookie = getCookie("tab");
        // alert(myCookie);
        // if(myCookie === 7) {
        $('.kpi-container').hide();

        $("[id^='fieldset'] h3").html(general_settings);
        $(".panel-heading").html(general_settings);
        $("[name='spin_wheel[display_image]']").closest('.form-group').hide();

        $("[name^='spin_wheel[display_interval]']").closest('.form-group ').show();
        $("[name='spin_wheel[time_display]']").parents('.form-group').hide();
        $("[name='spin_wheel[scroll_display]']").parents('.form-group').hide();
        $("[name='spin_wheel[enable]']").closest('.form-group ').show();
        $("[name^='spin_wheel[show_popup]']").closest('.form-group ').show();
        $("[name='spin_wheel[email_recheck]']").closest('.form-group ').show();
        $("[name='spin_wheel_email_subject_1']").parents('.form-group ').hide();
        $("[name^='spin_wheel[email_templates]']").closest('.form-group ').hide();
        $("[name='spin_wheel_email_content_1']").parents('.form-group').hide();
        $(".optn_test_email").closest('.form-group ').hide();
        $(".test_button").hide();
        $("[name='spin_wheel[logo]']").parents('.form-group').hide();
        $("[name='spin_wheel[background_color_spin]']").parents('.form-group').hide();
        $("[name='spin_wheel[background_color_cancel]']").parents('.form-group').hide();
        $("[name='spin_wheel[title_text]']").closest('.form-group').hide();
        $("[name='spin_wheel[guide_text]']").closest('.form-group').hide();
        $("[name='spin_wheel[custom_css]']").parents('.form-group').show();
        $("[name='spin_wheel[custom_js]']").parents('.form-group').show();
//        $("[name='spin_wheel[background_color_wheel]']").parents('.form-group').hide();
//        $("[name='spin_wheel[text_color_wheel]']").parents('.form-group').hide();
        $("[name='spin_wheel[background_color_slice_even]']").parents('.form-group').hide();
        $("[name='spin_wheel[background_color_slice_odd]']").parents('.form-group').hide();
        $("[name='spin_wheel[active_date]']").parents('.form-group').hide();
        $("[name='spin_wheel[expire_date]']").parents('.form-group').hide();
        $('.list_slice').hide();
        $('.spinwheel').show();
        $("[name='spin_wheel[coupon_display_options]']").closest('.form-group').hide();

        $("[name='spin_wheel[min_screen_size]']").closest('.form-group').hide();
        $("[name='spin_wheel[max_display_freq]']").closest('.form-group').hide();
        $("[name='spin_wheel[hide_after]']").closest('.form-group').hide();
        $("[name='spin_wheel[where_to_display]']").parents('.form-group').hide();
        $("[name='spin_wheel[who_to_show]']").closest('.form-group').hide();
        $("[name='spin_wheel[when_to_display]']").closest('.form-group').hide();
        $("[name='spin_wheel[geo_location]']").closest('.form-group').hide();
        $("[name='spin_wheel[fix_time]']").closest('.form-group').hide();

//        $("[name='spin_wheel[mailchimp_status]']").closest('.form-group').hide();
//        $("[name='spin_wheel[mailchimp_api]']").closest('.form-group').hide();
//        $("[name='spin_wheel[mailchimp_list]']").closest('.form-group').hide();
        $("[name='spin_wheel[constant_contact_status]']").parents('.form-group').hide();
        $("[name='spin_wheel[constant_contact_api]']").closest('.form-group').hide();
        $("[name='spin_wheel[constant_contact_token]']").closest('.form-group').hide();
        $("[name='spin_wheel[constant_contact_list]']").closest('.form-group').hide();
//        $("[name='spin_wheel[klaviyo_status]']").closest('.form-group').hide();
//
//        $("[name='spin_wheel[klaviyo_api]']").closest('.form-group').hide();
//        $("[name='spin_wheel[klaviyo_list]']").closest('.form-group').hide();
        $("[name='spin_wheel[getresponse_status]']").closest('.form-group').hide();
        $("[name='spin_wheel[getresponse_api]']").closest('.form-group').hide();
        $("[name='spin_wheel[getresponse_list]']").closest('.form-group').hide();
        $('.panel_spin_wheel').hide();
        $(".graph_spin_wheel").hide();
        $('.btn_save_wheel').show();
        $("[name='spin_wheel[to_date]']").closest('.form-group').hide();
        $("[name='spin_wheel[from_date]']").closest('.form-group').hide();
        $("[name='spin_wheel[show_page][]']").parents('.form-group').hide();
        $("[name='spin_wheel[not_show_page][]']").parents('.form-group').hide();
        $("[name='spin_wheel[selected_country][]']").parents('.form-group').hide();
        $("[name='spin_wheel[unselected_country][]']").parents('.form-group').hide();

        //  }
    } 
//    else if (b == 2) {
//        document.cookie = 'cat=2';
//        var myCookie = getCookie("cat");
//        // alert(myCookie);
//        // if(myCookie == 2) {
//        $("[id^='fieldset'] h3").html(display_settings);
//        $(".panel-heading").html(display_settings);
//        $("[name='spin_wheel[display_image]']").closest('.form-group').hide();
//
//        $("[name^='spin_wheel[display_interval]']").closest('.form-group ').hide();
//        if ($('[id^="spin_wheel[fix_time]_on"]').is(':checked') === true) {
//            $("[name='spin_wheel[active_date]']").parents('.form-group').show();
//            $("[name='spin_wheel[expire_date]']").parents('.form-group').show();
//        }
//        else {//
//            $("[name='spin_wheel[active_date]']").parents('.form-group').hide();
//            $("[name='spin_wheel[expire_date]']").parents('.form-group').hide();
//        }
//        $('.kpi-container').hide();
//
//
//        if ($('[name="spin_wheel[when_to_display]"]').val() === '2') {
//
//            $("[name='spin_wheel[time_display]']").closest('.form-group').show();
//        }
//        else {
//            $("[name='spin_wheel[time_display]']").parents('.form-group').hide();
//        }
//
//        if ($("[name='spin_wheel[when_to_display]']").val() === '3') {
//            $("[name='spin_wheel[scroll_display]']").parents('.form-group').show();
//        }
//        else {
//            $("[name='spin_wheel[scroll_display]']").parents('.form-group').hide();
//        }
////  
////
////   
//        if ($('[name="spin_wheel[geo_location]"]').val() === '2') {
//            //alert('test');
//            $("[name='spin_wheel[selected_country][]']").parents('.form-group').show();
//        }
//        else {
//            $("[name='spin_wheel[selected_country][]']").parents('.form-group').hide();
//        }
//        if ($('[name="spin_wheel[geo_location]"]').val() === '3') {
//            //alert('test');
//            $("[name='spin_wheel[unselected_country][]']").parents('.form-group').show();
//        }
//        else {
//            $("[name='spin_wheel[unselected_country][]']").parents('.form-group').hide();
//        }
//
////
////  
////
//        $("[name='spin_wheel[coupon_display_options]']").closest('.form-group').hide();
//
//        if ($('[name="spin_wheel[where_to_display]"]').val() === '2') {
//            //alert('test');
//            $("[name='spin_wheel[show_page][]']").parents('.form-group').show();
//        }
//        else {
//            $("[name='spin_wheel[show_page][]']").parents('.form-group').hide();
//        }
//        if ($('[name="spin_wheel[where_to_display]"]').val() === '3') {
//            //alert('test');
//            $("[name='spin_wheel[not_show_page][]']").parents('.form-group').show();
//        }
//        else {
//            $("[name='spin_wheel[not_show_page][]']").parents('.form-group').hide();
//        }
//
//
//
////        $("[name='spin_wheel[time_display]']").parents('.form-group').hide();
////        $("[name='spin_wheel[scroll_display]']").parents('.form-group').hide();
//        $("[name='spin_wheel[enable]']").closest('.form-group ').hide();
//        $("[name^='spin_wheel[show_popup]']").closest('.form-group ').hide();
//        $("[name='spin_wheel[email_recheck]']").closest('.form-group ').hide();
//        $("[name='spin_wheel_email_subject_1']").parents('.form-group ').hide();
//        $("[name^='spin_wheel[email_templates]']").closest('.form-group ').hide();
//        $("[name='spin_wheel_email_content_1']").parents('.form-group').hide();
//        $(".optn_test_email").closest('.form-group ').hide();
//        $(".test_button").hide();
//        $("[name='spin_wheel[logo]']").parents('.form-group').hide();
//        $("[name='spin_wheel[background_color_spin]']").parents('.form-group').hide();
//        $("[name='spin_wheel[background_color_cancel]']").parents('.form-group').hide();
//        $("[name='spin_wheel[title_text]']").closest('.form-group').hide();
//        $("[name='spin_wheel[guide_text]']").closest('.form-group').hide();
//        $("[name='spin_wheel[custom_css]']").parents('.form-group').hide();
//        $("[name='spin_wheel[custom_js]']").parents('.form-group').hide();
////        $("[name='spin_wheel[background_color_wheel]']").parents('.form-group').hide();
////        $("[name='spin_wheel[text_color_wheel]']").parents('.form-group').hide();
//        $("[name='spin_wheel[background_color_slice_even]']").parents('.form-group').hide();
//        $("[name='spin_wheel[background_color_slice_odd]']").parents('.form-group').hide();
////        $("[name='spin_wheel[active_date]']").parents('.form-group').hide();
////        $("[name='spin_wheel[expire_date]']").parents('.form-group').show();
//        $('.list_slice').hide();
//        $('.spinwheel').show();
//
//        $("[name='spin_wheel[min_screen_size]']").closest('.form-group').show();
//        $("[name='spin_wheel[max_display_freq]']").closest('.form-group').show();
//        $("[name='spin_wheel[hide_after]']").closest('.form-group').show();
//        $("[name='spin_wheel[where_to_display]']").parents('.form-group').show();
//        $("[name='spin_wheel[who_to_show]']").closest('.form-group').show();
//        $("[name='spin_wheel[when_to_display]']").closest('.form-group').show();
//        $("[name='spin_wheel[geo_location]']").closest('.form-group').show();
//        $("[name='spin_wheel[fix_time]']").closest('.form-group').show();
//
////        $("[name='spin_wheel[mailchimp_status]']").closest('.form-group').hide();
////        $("[name='spin_wheel[mailchimp_api]']").closest('.form-group').hide();
////        $("[name='spin_wheel[mailchimp_list]']").closest('.form-group').hide();
//        $("[name='spin_wheel[constant_contact_status]']").parents('.form-group').hide();
//        $("[name='spin_wheel[constant_contact_api]']").closest('.form-group').hide();
//        $("[name='spin_wheel[constant_contact_token]']").closest('.form-group').hide();
//        $("[name='spin_wheel[constant_contact_list]']").closest('.form-group').hide();
////        $("[name='spin_wheel[klaviyo_status]']").closest('.form-group').hide();
////
////        $("[name='spin_wheel[klaviyo_api]']").closest('.form-group').hide();
////        $("[name='spin_wheel[klaviyo_list]']").closest('.form-group').hide();
//        $("[name='spin_wheel[getresponse_status]']").closest('.form-group').hide();
//        $("[name='spin_wheel[getresponse_api]']").closest('.form-group').hide();
//        $("[name='spin_wheel[getresponse_list]']").closest('.form-group').hide();
//        $('.panel_spin_wheel').hide();
//        $(".graph_spin_wheel").hide();
//        $('.btn_save_wheel').show();
//        $("[name='spin_wheel[to_date]']").closest('.form-group').hide();
//        $("[name='spin_wheel[from_date]']").closest('.form-group').hide();
//
//
//
//        //  }
//    } 
    else if (b == 2) {
        document.cookie = 'tab=2';
        // var tt = document.cookie ;
        var myCookie = getCookie("tab");
        // alert(myCookie);
        $("[id^='fieldset'] h3").html(look_feel_settings);
        $(".panel-heading").html(look_feel_settings);
        $('.kpi-container').hide();
        $("[name^='spin_wheel[display_interval]']").closest('.form-group ').hide();
        $("[name='spin_wheel[display_image]']").closest('.form-group').show();
        $("[name='spin_wheel[coupon_display_options]']").closest('.form-group').hide();

        $("[name='spin_wheel[time_display]']").parents('.form-group').hide();
        $("[name='spin_wheel[scroll_display]']").parents('.form-group').hide();
        $("[name='spin_wheel[enable]']").closest('.form-group ').hide();
        $("[name^='spin_wheel[show_popup]']").closest('.form-group ').hide();
        $("[name='spin_wheel[email_recheck]']").closest('.form-group ').hide();
        $("[name='spin_wheel_email_subject_1']").parents('.form-group ').hide();
        $("[name^='spin_wheel[email_templates]']").closest('.form-group ').hide();
        $("[name='spin_wheel_email_content_1']").parents('.form-group').hide();
        $(".optn_test_email").closest('.form-group ').hide();
        $(".test_button").hide();
        $("[name='spin_wheel[logo]']").parents('.form-group').show();
        $("[name='spin_wheel[background_color_spin]']").parents('.form-group').show();
        $("[name='spin_wheel[background_color_cancel]']").parents('.form-group').show();
        $("[name='spin_wheel[title_text]']").closest('.form-group').show();
        $("[name='spin_wheel[guide_text]']").closest('.form-group').show();
        $("[name='spin_wheel[custom_css]']").parents('.form-group').hide();
        $("[name='spin_wheel[custom_js]']").parents('.form-group').hide();
//        $("[name='spin_wheel[background_color_wheel]']").parents('.form-group').hide();
//        $("[name='spin_wheel[text_color_wheel]']").parents('.form-group').hide();
        $("[name='spin_wheel[background_color_slice_even]']").parents('.form-group').hide();
        $("[name='spin_wheel[background_color_slice_odd]']").parents('.form-group').hide();
        $("[name='spin_wheel[active_date]']").parents('.form-group').hide();
        $("[name='spin_wheel[expire_date]']").parents('.form-group').hide();
        $('.list_slice').hide();
        $('.spinwheel').show();

        $("[name='spin_wheel[min_screen_size]']").closest('.form-group').hide();
        $("[name='spin_wheel[max_display_freq]']").closest('.form-group').hide();
        $("[name='spin_wheel[hide_after]']").closest('.form-group').hide();
        $("[name='spin_wheel[where_to_display]']").parents('.form-group').hide();
        $("[name='spin_wheel[who_to_show]']").closest('.form-group').hide();
        $("[name='spin_wheel[when_to_display]']").closest('.form-group').hide();
        $("[name='spin_wheel[geo_location]']").closest('.form-group').hide();
        $("[name='spin_wheel[fix_time]']").closest('.form-group').hide();

//        $("[name='spin_wheel[mailchimp_status]']").closest('.form-group').hide();
//        $("[name='spin_wheel[mailchimp_api]']").closest('.form-group').hide();
//        $("[name='spin_wheel[mailchimp_list]']").closest('.form-group').hide();
        $("[name='spin_wheel[constant_contact_status]']").parents('.form-group').hide();
        $("[name='spin_wheel[constant_contact_api]']").closest('.form-group').hide();
        $("[name='spin_wheel[constant_contact_token]']").closest('.form-group').hide();
        $("[name='spin_wheel[constant_contact_list]']").closest('.form-group').hide();
//        $("[name='spin_wheel[klaviyo_status]']").closest('.form-group').hide();
//
//        $("[name='spin_wheel[klaviyo_api]']").closest('.form-group').hide();
//        $("[name='spin_wheel[klaviyo_list]']").closest('.form-group').hide();
        $("[name='spin_wheel[getresponse_status]']").closest('.form-group').hide();
        $("[name='spin_wheel[getresponse_api]']").closest('.form-group').hide();
        $("[name='spin_wheel[getresponse_list]']").closest('.form-group').hide();
        $('.panel_spin_wheel').hide();
        $(".graph_spin_wheel").hide();
        $('.btn_save_wheel').show();
        $("[name='spin_wheel[to_date]']").closest('.form-group').hide();
        $("[name='spin_wheel[from_date]']").closest('.form-group').hide();
        $("[name='spin_wheel[show_page][]']").parents('.form-group').hide();
        $("[name='spin_wheel[not_show_page][]']").parents('.form-group').hide();
        $("[name='spin_wheel[selected_country][]']").parents('.form-group').hide();
        $("[name='spin_wheel[unselected_country][]']").parents('.form-group').hide();

    } 
//    else if (b == 4) {
//        document.cookie = 'tab=4';
//        //  var tt = document.cookie ;
//        var myCookie = getCookie("tab");
//        // alert(myCookie);
//        $("[id^='fieldset'] h3").html(wheel_settings);
//        $(".panel-heading").html(wheel_settings);
//        $('.kpi-container').hide();
//        $("[name^='spin_wheel[display_interval]']").closest('.form-group ').hide();
//        $("[name='spin_wheel[display_image]']").closest('.form-group').hide();
//        $("[name='spin_wheel[coupon_display_options]']").closest('.form-group').hide();
//
//        $("[name='spin_wheel[time_display]']").parents('.form-group').hide();
//        $("[name='spin_wheel[scroll_display]']").parents('.form-group').hide();
//        $("[name='spin_wheel[enable]']").closest('.form-group ').hide();
//        $("[name^='spin_wheel[show_popup]']").closest('.form-group ').hide();
//        $("[name='spin_wheel[email_recheck]']").closest('.form-group ').hide();
//        $("[name='spin_wheel_email_subject_1']").parents('.form-group ').hide();
//        $("[name^='spin_wheel[email_templates]']").closest('.form-group ').hide();
//        $("[name='spin_wheel_email_content_1']").parents('.form-group').hide();
//        $(".optn_test_email").closest('.form-group ').hide();
//        $(".test_button").hide();
//        $("[name='spin_wheel[logo]']").parents('.form-group').hide();
//        $("[name='spin_wheel[background_color_spin]']").parents('.form-group').hide();
//        $("[name='spin_wheel[background_color_cancel]']").parents('.form-group').hide();
//        $("[name='spin_wheel[title_text]']").closest('.form-group').hide();
//        $("[name='spin_wheel[guide_text]']").closest('.form-group').hide();
//        $("[name='spin_wheel[custom_css]']").parents('.form-group').hide();
//        $("[name='spin_wheel[custom_js]']").parents('.form-group').hide();
////        $("[name='spin_wheel[background_color_wheel]']").parents('.form-group').show();
////        $("[name='spin_wheel[text_color_wheel]']").parents('.form-group').show();
//        $("[name='spin_wheel[background_color_slice_even]']").parents('.form-group').show();
//        $("[name='spin_wheel[background_color_slice_odd]']").parents('.form-group').show();
//        $("[name='spin_wheel[active_date]']").parents('.form-group').hide();
//        $("[name='spin_wheel[expire_date]']").parents('.form-group').hide();
//        $('.list_slice').hide();
//        $('.spinwheel').show();
//
//        $("[name='spin_wheel[min_screen_size]']").closest('.form-group').hide();
//        $("[name='spin_wheel[max_display_freq]']").closest('.form-group').hide();
//        $("[name='spin_wheel[hide_after]']").closest('.form-group').hide();
//        $("[name='spin_wheel[where_to_display]']").parents('.form-group').hide();
//        $("[name='spin_wheel[who_to_show]']").closest('.form-group').hide();
//        $("[name='spin_wheel[when_to_display]']").closest('.form-group').hide();
//        $("[name='spin_wheel[geo_location]']").closest('.form-group').hide();
//        $("[name='spin_wheel[fix_time]']").closest('.form-group').hide();
//        $("[name='spin_wheel[mailchimp_status]']").closest('.form-group').hide();
//        $("[name='spin_wheel[mailchimp_api]']").closest('.form-group').hide();
//        $("[name='spin_wheel[mailchimp_list]']").closest('.form-group').hide();
//        $("[name='spin_wheel[constant_contact_status]']").parents('.form-group').hide();
//        $("[name='spin_wheel[constant_contact_api]']").closest('.form-group').hide();
//        $("[name='spin_wheel[constant_contact_token]']").closest('.form-group').hide();
//        $("[name='spin_wheel[constant_contact_list]']").closest('.form-group').hide();
//        $("[name='spin_wheel[klaviyo_status]']").closest('.form-group').hide();
//
//        $("[name='spin_wheel[klaviyo_api]']").closest('.form-group').hide();
//        $("[name='spin_wheel[klaviyo_list]']").closest('.form-group').hide();
//        $("[name='spin_wheel[getresponse_status]']").closest('.form-group').hide();
//        $("[name='spin_wheel[getresponse_api]']").closest('.form-group').hide();
//        $("[name='spin_wheel[getresponse_list]']").closest('.form-group').hide();
//        $('.panel_spin_wheel').hide();
//        $(".graph_spin_wheel").hide();
//        $('.btn_save_wheel').show();
//        $("[name='spin_wheel[to_date]']").closest('.form-group').hide();
//        $("[name='spin_wheel[from_date]']").closest('.form-group').hide();
//        $("[name='spin_wheel[show_page][]']").parents('.form-group').hide();
//        $("[name='spin_wheel[not_show_page][]']").parents('.form-group').hide();
//        $("[name='spin_wheel[selected_country][]']").parents('.form-group').hide();
//        $("[name='spin_wheel[unselected_country][]']").parents('.form-group').hide();
//
//    } 
    else if (b == 3) {
        document.cookie = 'tab=3';
        var myCookie = getCookie("tab");
        //  alert(myCookie);
        $("[id^='fieldset'] h3").html(slice_settings);
        $(".panel-heading").html(slice_settings);
        $('.kpi-container').hide();
        $("[name^='spin_wheel[display_interval]']").closest('.form-group ').hide();
        $("[name='spin_wheel[display_image]']").closest('.form-group').hide();
        $("[name='spin_wheel[coupon_display_options]']").closest('.form-group').hide();

        $("[name='spin_wheel[time_display]']").parents('.form-group').hide();
        $("[name='spin_wheel[scroll_display]']").parents('.form-group').hide();
        $("[name='spin_wheel[enable]']").closest('.form-group ').hide();
        $("[name^='spin_wheel[show_popup]']").closest('.form-group ').hide();
        $("[name='spin_wheel[email_recheck]']").closest('.form-group ').hide();
        $("[name='spin_wheel_email_subject_1']").parents('.form-group ').hide();
        $("[name^='spin_wheel[email_templates]']").closest('.form-group ').hide();
        $("[name='spin_wheel_email_content_1']").parents('.form-group').hide();
        $(".optn_test_email").closest('.form-group ').hide();
        $(".test_button").hide();
        $("[name='spin_wheel[logo]']").parents('.form-group').hide();
        $("[name='spin_wheel[background_color_spin]']").parents('.form-group').hide();
        $("[name='spin_wheel[background_color_cancel]']").parents('.form-group').hide();
        $("[name='spin_wheel[title_text]']").closest('.form-group').hide();
        $("[name='spin_wheel[guide_text]']").closest('.form-group').hide();
        $("[name='spin_wheel[custom_css]']").parents('.form-group').hide();
        $("[name='spin_wheel[custom_js]']").parents('.form-group').hide();
//        $("[name='spin_wheel[background_color_wheel]']").parents('.form-group').hide();
//        $("[name='spin_wheel[text_color_wheel]']").parents('.form-group').hide();
        $("[name='spin_wheel[background_color_slice_even]']").parents('.form-group').hide();
        $("[name='spin_wheel[background_color_slice_odd]']").parents('.form-group').hide();
        $("[name='spin_wheel[active_date]']").parents('.form-group').hide();
        $("[name='spin_wheel[expire_date]']").parents('.form-group').hide();
        $('.list_slice').show();
        $('.spinwheel').hide();

        $("[name='spin_wheel[min_screen_size]']").closest('.form-group').hide();
        $("[name='spin_wheel[max_display_freq]']").closest('.form-group').hide();
        $("[name='spin_wheel[hide_after]']").closest('.form-group').hide();
        $("[name='spin_wheel[where_to_display]']").parents('.form-group').hide();
        $("[name='spin_wheel[who_to_show]']").closest('.form-group').hide();
        $("[name='spin_wheel[when_to_display]']").closest('.form-group').hide();
        $("[name='spin_wheel[geo_location]']").closest('.form-group').hide();
        $("[name='spin_wheel[fix_time]']").closest('.form-group').hide();

//        $("[name='spin_wheel[mailchimp_status]']").closest('.form-group').hide();
//        $("[name='spin_wheel[mailchimp_api]']").closest('.form-group').hide();
//        $("[name='spin_wheel[mailchimp_list]']").closest('.form-group').hide();
        $("[name='spin_wheel[constant_contact_status]']").parents('.form-group').hide();
        $("[name='spin_wheel[constant_contact_api]']").closest('.form-group').hide();
        $("[name='spin_wheel[constant_contact_token]']").closest('.form-group').hide();
        $("[name='spin_wheel[constant_contact_list]']").closest('.form-group').hide();
//        $("[name='spin_wheel[klaviyo_status]']").closest('.form-group').hide();
//
//        $("[name='spin_wheel[klaviyo_api]']").closest('.form-group').hide();
//        $("[name='spin_wheel[klaviyo_list]']").closest('.form-group').hide();
        $("[name='spin_wheel[getresponse_status]']").closest('.form-group').hide();
        $("[name='spin_wheel[getresponse_api]']").closest('.form-group').hide();
        $("[name='spin_wheel[getresponse_list]']").closest('.form-group').hide();
        $('.panel_spin_wheel').hide();
        $('.btn_save_wheel').show();
        $("[name='spin_wheel[to_date]']").closest('.form-group').hide();
        $("[name='spin_wheel[from_date]']").closest('.form-group').hide();


        $(".graph_spin_wheel").hide();
        $("[name='spin_wheel[show_page][]']").parents('.form-group').hide();
        $("[name='spin_wheel[not_show_page][]']").parents('.form-group').hide();
        $("[name='spin_wheel[selected_country][]']").parents('.form-group').hide();
        $("[name='spin_wheel[unselected_country][]']").parents('.form-group').hide();
    }
//    else if (b == 5) {
//        document.cookie = 'tab=5';
//        var myCookie = getCookie("tab");
//        //alert(myCookie);
//        $("[id^='fieldset'] h3").html(email_marketing);
//        $(".panel-heading").html(email_marketing);
//        $('.kpi-container').hide();
//        $("[name^='spin_wheel[display_interval]']").closest('.form-group ').hide();
//        $("[name='spin_wheel[display_image]']").closest('.form-group').hide();
//        $("[name='spin_wheel[coupon_display_options]']").closest('.form-group').hide();
//
//        $("[name='spin_wheel[time_display]']").parents('.form-group').hide();
//        $("[name='spin_wheel[scroll_display]']").parents('.form-group').hide();
//        $("[name='spin_wheel[enable]']").closest('.form-group ').hide();
//        $("[name^='spin_wheel[show_popup]']").closest('.form-group ').hide();
//        $("[name='spin_wheel[email_recheck]']").closest('.form-group ').hide();
//        $("[name='spin_wheel_email_subject_1']").parents('.form-group ').hide();
//        $("[name^='spin_wheel[email_templates]']").closest('.form-group ').hide();
//        $("[name='spin_wheel_email_content_1']").parents('.form-group').hide();
//        $(".optn_test_email").closest('.form-group ').hide();
//        $(".test_button").hide();
//        $("[name='spin_wheel[logo]']").parents('.form-group').hide();
//        $("[name='spin_wheel[background_color_spin]']").parents('.form-group').hide();
//        $("[name='spin_wheel[background_color_cancel]']").parents('.form-group').hide();
//        $("[name='spin_wheel[title_text]']").closest('.form-group').hide();
//        $("[name='spin_wheel[guide_text]']").closest('.form-group').hide();
//        $("[name='spin_wheel[custom_css]']").parents('.form-group').hide();
//        $("[name='spin_wheel[custom_js]']").parents('.form-group').hide();
////        $("[name='spin_wheel[background_color_wheel]']").parents('.form-group').hide();
////        $("[name='spin_wheel[text_color_wheel]']").parents('.form-group').hide();
//        $("[name='spin_wheel[background_color_slice_even]']").parents('.form-group').hide();
//        $("[name='spin_wheel[background_color_slice_odd]']").parents('.form-group').hide();
//        $("[name='spin_wheel[active_date]']").parents('.form-group').hide();
//        $("[name='spin_wheel[expire_date]']").parents('.form-group').hide();
//        $('.list_slice').hide();
//        $('.spinwheel').show();
//
//        $("[name='spin_wheel[min_screen_size]']").closest('.form-group').hide();
//        $("[name='spin_wheel[max_display_freq]']").closest('.form-group').hide();
//        $("[name='spin_wheel[hide_after]']").closest('.form-group').hide();
//        $("[name='spin_wheel[where_to_display]']").parents('.form-group').hide();
//        $("[name='spin_wheel[who_to_show]']").closest('.form-group').hide();
//        $("[name='spin_wheel[when_to_display]']").closest('.form-group').hide();
//        $("[name='spin_wheel[geo_location]']").closest('.form-group').hide();
//        $("[name='spin_wheel[fix_time]']").closest('.form-group').hide();
//
////        $("[name='spin_wheel[mailchimp_status]']").closest('.form-group').show();
////        $("[name='spin_wheel[mailchimp_api]']").closest('.form-group').show();
////        $("[name='spin_wheel[mailchimp_list]']").closest('.form-group').show();
//        $("[name='spin_wheel[constant_contact_status]']").parents('.form-group').show();
//        $("[name='spin_wheel[constant_contact_api]']").closest('.form-group').show();
//        $("[name='spin_wheel[constant_contact_token]']").closest('.form-group').show();
//        $("[name='spin_wheel[constant_contact_list]']").closest('.form-group').show();
////        $("[name='spin_wheel[klaviyo_status]']").closest('.form-group').show();
////
////        $("[name='spin_wheel[klaviyo_api]']").closest('.form-group').show();
////        $("[name='spin_wheel[klaviyo_list]']").closest('.form-group').show();
//        $("[name='spin_wheel[getresponse_status]']").closest('.form-group').show();
//        $("[name='spin_wheel[getresponse_api]']").closest('.form-group').show();
//        $("[name='spin_wheel[getresponse_list]']").closest('.form-group').show();
//        $('.panel_spin_wheel').show();
//        $('.btn_save_wheel').show();
//        $(".graph_spin_wheel").hide();
//        $("[name='spin_wheel[to_date]']").closest('.form-group').hide();
//        $("[name='spin_wheel[from_date]']").closest('.form-group').hide();
//        $("[name='spin_wheel[show_page][]']").parents('.form-group').hide();
//        $("[name='spin_wheel[not_show_page][]']").parents('.form-group').hide();
//        $("[name='spin_wheel[selected_country][]']").parents('.form-group').hide();
//        $("[name='spin_wheel[unselected_country][]']").parents('.form-group').hide();
//
////        if ($('[id^="spin_wheel[mailchimp_status]_on"]').is(':checked') === true) {//alert('hi');
////            $("[name='spin_wheel[mailchimp_api]']").parents('.form-group').show();
////            $("[name='spin_wheel[mailchimp_list]']").parents('.form-group').show();
////        } else {//
////            $("[name='spin_wheel[mailchimp_api]']").parents('.form-group').hide();
////            $("[name='spin_wheel[mailchimp_list]']").parents('.form-group').hide();
////        }
////
////        if ($('[id^="spin_wheel[klaviyo_status]_on"]').is(':checked') === true) {//alert('hi');
////            $("[name='spin_wheel[klaviyo_api]']").parents('.form-group').show();
////            $("[name='spin_wheel[klaviyo_list]']").parents('.form-group').show();
////        } else {//
////            $("[name='spin_wheel[klaviyo_api]']").parents('.form-group').hide();
////            $("[name='spin_wheel[klaviyo_list]']").parents('.form-group').hide();
////        }
//
//        if ($('[id^="spin_wheel[getresponse_status]_on"]').is(':checked') === true) {//alert('hi');
//            $("[name='spin_wheel[getresponse_api]']").parents('.form-group').show();
//            $("[name='spin_wheel[getresponse_list]']").parents('.form-group').show();
//        } else {//
//            $("[name='spin_wheel[getresponse_api]']").parents('.form-group').hide();
//            $("[name='spin_wheel[getresponse_list]']").parents('.form-group').hide();
//        }
//
//        if ($('[id^="spin_wheel[constant_contact_status]_on"]').is(':checked') === true) {//alert('hi');
//            $("[name='spin_wheel[constant_contact_api]']").parents('.form-group').show();
//            $("[name='spin_wheel[constant_contact_token]']").parents('.form-group').show();
//            $("[name='spin_wheel[constant_contact_list]']").parents('.form-group').show();
//        } else {//
//            $("[name='spin_wheel[constant_contact_api]']").parents('.form-group').hide();
//            $("[name='spin_wheel[constant_contact_token]']").parents('.form-group').hide();
//            $("[name='spin_wheel[constant_contact_list]']").parents('.form-group').hide();
//        }
//    } 
//    else if (b == 5) {
//        document.cookie = 'tab=5';
//        var myCookie = getCookie("tab");
//        //alert(myCookie);
//        $("[id^='fieldset'] h3").html(email_settings);
//        $(".panel-heading").html(email_settings);
//        $('.kpi-container').hide();
//        $("[name^='spin_wheel[display_interval]']").closest('.form-group ').hide();
//        $("[name='spin_wheel[display_image]']").closest('.form-group').hide();
//        $("[name='spin_wheel[coupon_display_options]']").closest('.form-group').show();
//        if ($("[name='spin_wheel[coupon_display_options]']").val() == 1) {
//            $("[name='spin_wheel_email_subject_1']").parents('.form-group ').hide();
//            $("[name^='spin_wheel[email_templates]']").closest('.form-group ').hide();
//            $("[name='spin_wheel_email_content_"+language_id+"']").parents('.form-group').hide();
//            $("[name='spin_wheel[test_email]']").closest('.form-group ').hide();
//            $("#test_email_button").hide();
//        } else {
//            $("[name='spin_wheel_email_subject_1']").parents('.form-group ').show();
//            $("[name^='spin_wheel[email_templates]']").closest('.form-group ').show();
//            $("[name='spin_wheel_email_content_"+language_id+"']").parents('.form-group').show();
//            $("[name='spin_wheel[test_email]']").closest('.form-group ').show();
//            $("#test_email_button").show();
//        }
//        $("[name='spin_wheel[time_display]']").parents('.form-group').hide();
//        $("[name='spin_wheel[scroll_display]']").parents('.form-group').hide();
//        $("[name='spin_wheel[enable]']").closest('.form-group ').hide();
//        $("[name^='spin_wheel[show_popup]']").closest('.form-group ').hide();
//        $("[name='spin_wheel[email_recheck]']").closest('.form-group ').hide();
//
//        $("[name='spin_wheel[logo]']").parents('.form-group').hide();
//        $("[name='spin_wheel[background_color_spin]']").parents('.form-group').hide();
//        $("[name='spin_wheel[background_color_cancel]']").parents('.form-group').hide();
//        $("[name='spin_wheel[title_text]']").closest('.form-group').hide();
//        $("[name='spin_wheel[guide_text]']").closest('.form-group').hide();
//        $("[name='spin_wheel[custom_css]']").parents('.form-group').hide();
//        $("[name='spin_wheel[custom_js]']").parents('.form-group').hide();
////        $("[name='spin_wheel[background_color_wheel]']").parents('.form-group').hide();
////        $("[name='spin_wheel[text_color_wheel]']").parents('.form-group').hide();
//        $("[name='spin_wheel[background_color_slice_even]']").parents('.form-group').hide();
//        $("[name='spin_wheel[background_color_slice_odd]']").parents('.form-group').hide();
//        $("[name='spin_wheel[active_date]']").parents('.form-group').hide();
//        $("[name='spin_wheel[expire_date]']").parents('.form-group').hide();
//        $('.list_slice').hide();
//        $('.spinwheel').show();
//
//        $("[name='spin_wheel[min_screen_size]']").closest('.form-group').hide();
//        $("[name='spin_wheel[max_display_freq]']").closest('.form-group').hide();
//        $("[name='spin_wheel[hide_after]']").closest('.form-group').hide();
//        $("[name='spin_wheel[where_to_display]']").parents('.form-group').hide();
//        $("[name='spin_wheel[who_to_show]']").closest('.form-group').hide();
//        $("[name='spin_wheel[when_to_display]']").closest('.form-group').hide();
//        $("[name='spin_wheel[geo_location]']").closest('.form-group').hide();
//        $("[name='spin_wheel[fix_time]']").closest('.form-group').hide();
////        $("[name='spin_wheel[mailchimp_status]']").closest('.form-group').hide();
////        $("[name='spin_wheel[mailchimp_api]']").closest('.form-group').hide();
////        $("[name='spin_wheel[mailchimp_list]']").closest('.form-group').hide();
//        $("[name='spin_wheel[constant_contact_status]']").parents('.form-group').hide();
//        $("[name='spin_wheel[constant_contact_api]']").closest('.form-group').hide();
//        $("[name='spin_wheel[constant_contact_token]']").closest('.form-group').hide();
//        $("[name='spin_wheel[constant_contact_list]']").closest('.form-group').hide();
////        $("[name='spin_wheel[klaviyo_status]']").closest('.form-group').hide();
////
////        $("[name='spin_wheel[klaviyo_api]']").closest('.form-group').hide();
////        $("[name='spin_wheel[klaviyo_list]']").closest('.form-group').hide();
//        $("[name='spin_wheel[getresponse_status]']").closest('.form-group').hide();
//        $("[name='spin_wheel[getresponse_api]']").closest('.form-group').hide();
//        $("[name='spin_wheel[getresponse_list]']").closest('.form-group').hide();
//
//        $('.panel_spin_wheel').hide();
//        $('.btn_save_wheel').show();
//        $(".graph_spin_wheel").hide();
//        $("[name='spin_wheel[to_date]']").closest('.form-group').hide();
//        $("[name='spin_wheel[from_date]']").closest('.form-group').hide();
//        $("[name='spin_wheel[show_page][]']").parents('.form-group').hide();
//        $("[name='spin_wheel[not_show_page][]']").parents('.form-group').hide();
//        $("[name='spin_wheel[selected_country][]']").parents('.form-group').hide();
//        $("[name='spin_wheel[unselected_country][]']").parents('.form-group').hide();
//    } 
//    else if (b == 8) {
//        $('.kpi-container').show();
//        document.cookie = 'tab=8';
//        var myCookie = getCookie("tab");
//        // alert(myCookie);
//        $("[name='spin_wheel[display_image]']").closest('.form-group').hide();
//        $("[name='spin_wheel[coupon_display_options]']").closest('.form-group').hide();
//
//        $("[id^='fieldset'] h3").html(statistics);
//        $(".panel-heading").html(statistics);
//        $("[name='spin_wheel[time_display]']").parents('.form-group').hide();
//        $("[name='spin_wheel[scroll_display]']").parents('.form-group').hide();
//        $("[name='spin_wheel[enable]']").closest('.form-group ').hide();
//        $("[name^='spin_wheel[show_popup]']").closest('.form-group ').hide();
//        $("[name='spin_wheel[email_recheck]']").closest('.form-group ').hide();
//        $("[name='spin_wheel_email_subject_1']").parents('.form-group ').hide();
//        $("[name^='spin_wheel[email_templates]']").closest('.form-group ').hide();
//        $(".optn_email_content").closest('.form-group ').hide();
//        $("[name='spin_wheel_email_content_1']").parents('.form-group').hide();
//        $(".optn_test_email").closest('.form-group ').hide();
//        $(".test_button").hide();
//        $("[name='spin_wheel[logo]']").parents('.form-group').hide();
//        $("[name='spin_wheel[background_color_spin]']").parents('.form-group').hide();
//        $("[name='spin_wheel[background_color_cancel]']").parents('.form-group').hide();
//        $("[name='spin_wheel[title_text]']").closest('.form-group').hide();
//        $("[name='spin_wheel[guide_text]']").closest('.form-group').hide();
//        $("[name='spin_wheel[custom_css]']").parents('.form-group').hide();
//        $("[name='spin_wheel[custom_js]']").parents('.form-group').hide();
//        $("[name='spin_wheel[background_color_wheel]']").parents('.form-group').hide();
//        $("[name='spin_wheel[text_color_wheel]']").parents('.form-group').hide();
//        $("[name='spin_wheel[background_color_slice_even]']").parents('.form-group').hide();
//        $("[name='spin_wheel[background_color_slice_odd]']").parents('.form-group').hide();
//        $("[name='spin_wheel[active_date]']").parents('.form-group').hide();
//        $("[name='spin_wheel[expire_date]']").parents('.form-group').hide();
//        $('.list_slice').hide();
//        $("[name^='spin_wheel[display_interval]']").closest('.form-group ').hide();
//
//        $("[name='spin_wheel[min_screen_size]']").closest('.form-group').hide();
//        $("[name='spin_wheel[max_display_freq]']").closest('.form-group').hide();
//        $("[name='spin_wheel[hide_after]']").closest('.form-group').hide();
//        $("[name='spin_wheel[where_to_display]']").parents('.form-group').hide();
//        $("[name='spin_wheel[who_to_show]']").closest('.form-group').hide();
//        $("[name='spin_wheel[when_to_display]']").closest('.form-group').hide();
//        $("[name='spin_wheel[geo_location]']").closest('.form-group').hide();
//        $("[name='spin_wheel[fix_time]']").closest('.form-group').hide();
//        $("[name='spin_wheel[mailchimp_status]']").closest('.form-group').hide();
//        $("[name='spin_wheel[mailchimp_api]']").closest('.form-group').hide();
//        $("[name='spin_wheel[mailchimp_list]']").closest('.form-group').hide();
//        $("[name='spin_wheel[constant_contact_status]']").parents('.form-group').hide();
//        $("[name='spin_wheel[constant_contact_api]']").closest('.form-group').hide();
//        $("[name='spin_wheel[constant_contact_token]']").closest('.form-group').hide();
//        $("[name='spin_wheel[constant_contact_list]']").closest('.form-group').hide();
//        $("[name='spin_wheel[klaviyo_status]']").closest('.form-group').hide();
//
//        $("[name='spin_wheel[klaviyo_api]']").closest('.form-group').hide();
//        $("[name='spin_wheel[klaviyo_list]']").closest('.form-group').hide();
//        $("[name='spin_wheel[getresponse_status]']").closest('.form-group').hide();
//        $("[name='spin_wheel[getresponse_api]']").closest('.form-group').hide();
//        $("[name='spin_wheel[getresponse_list]']").closest('.form-group').hide();
//        $('.panel_spin_wheel').hide();
//        $(".graph_spin_wheel").show();
//        $('.spinwheel').hide();
//        $('.btn_save_wheel').hide();
//        $("[name='spin_wheel[to_date]']").closest('.form-group').show();
//        $("[name='spin_wheel[from_date]']").closest('.form-group').show();
//        $("[name='spin_wheel[show_page][]']").parents('.form-group').hide();
//        $("[name='spin_wheel[not_show_page][]']").parents('.form-group').hide();
//        $("[name='spin_wheel[selected_country][]']").parents('.form-group').hide();
//        $("[name='spin_wheel[unselected_country][]']").parents('.form-group').hide();
////       $("[name='spin_wheel[to_date]']").parents('.form-group').show();
////       $("[name='spin_wheel[from_date]']").parents('.form-group').show();
//
//    }
    $('.list-group-item').attr('class', 'list-group-item');
    $(a).attr('class', 'list-group-item active');

}

function removeImage() {
    if (confirm(delete_image_text)) {
        if ($('.thumb-image').attr('src') == undefined) {
            $.ajax({
                url: module_path,
                data: 'ajax=true&method=deleteImage',
                success: function (result) {
                    if (result == 'No Image Found') {
                        alert(no_image_text);
                    } else {
                        alert(image_deleted_text);
                        $('#remove-button').hide();
                        $('.default-image').attr('src', default_image_path);
                    }

                }

            });
        }
        else {
            $('.thumb-image').remove();
            $('.default-image').show();
            $('#velsof_exitpopup_image-name').val("");
            $('#remove-button').hide();
        }
    }
    return false;


}

function refresh() {

    $.ajax({
        url: module_path,
        type: 'post',
        data: 'ajax=true&method=refreshList',
        dataType: 'json',
        success: function (json) {
            $('.list_slice').html(json);
            $('.velsof_spinwheel_admin_overlay').remove();
        }
    })

}
function send_coupon() {
    var btn_Text = $('#subBtn').html();
    $('.velsof-err_msg').html('');
    $('.velsof-err_msg').hide();
    $.ajax({
        type: "POST",
        url: spinwheel_base_url + 'modules/spinwheel/ajax_send_coupon.php', //$('#vel-scratch-form').attr('action'),
        data: $('#vel-scratch-form').serialize(),
        dataType: 'json',
        beforeSend: function () {
            $('#subBtn').html($('#btn_progress_text').val());
            $('.velsof-success-msg-div').hide();
            $('.velsof-thankyouDiv > div').html('');
        },
        complete: function () {
            $('#subBtn').html(btn_Text);
        },
        success: function (json) {
            if (json['error'] != undefined) {
                for (var i in json['error']) {
                    if (json['error'][i]['tag'] == 'name') {
                        $('.velsof-nameErr').html(json['error'][i]['response']);
                    }
                    if (json['error'][i]['tag'] == 'email') {
                        $('.velsof-emailErr').html(json['error'][i]['response']);
                    }
                }
                $('.velsof-err_msg').show();
            }
            if (json['success'] != undefined) {
                $('input[name="customer_name"]').attr('value', '');
                $('input[name="customer_email"]').attr('value', '');
                if (json['success']['tag'] == 'email_not_send') {
                    $('.velsof-errorResponse').html(json['success']['response']);
                }
                if (json['success']['tag'] == 'email_send') {
                    $('.velsof-thanksTxt').html(json['success']['response_thanks']);
                    $('.velsof-successMsg').html(json['success']['response']);
                }
                $('#coupon_form').remove();
                $('#scratch_form').remove();
                $('.velsof-success-msg-div').show();
                $("html, body").animate({scrollTop: 0}, "fast");
                setTimeout(function () {
                    $('#velsof-scratch-main').slideUp();
                    $('#velsof-scratch-main').remove();
                }, 10000);
            }
        }
    });
}

function GetFormattedDate() {
    var todayTime = new Date();
    var month = format(todayTime .getMonth() + 1);
    var day = format(todayTime .getDate());
    var year = format(todayTime .getFullYear());
    return month + "/" + day + "/" + year;
}



