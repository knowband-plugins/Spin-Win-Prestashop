
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
$(document).ready(function () {
    $(".velovalidation_spin_wheel").click(function () {
        if (form_validation() == false) {
            return false;
        }
        /*Knowband button validation start*/
        $('.velovalidation_spin_wheel').attr("disabled", "disabled");
        /*Knowband button validation end*/
        $('.spinwheel').submit();
    });
});

function form_validation() {
    $('.vel_error_msg').remove();
    $('.error_field').removeClass('error_field');
    $('.velsof_error_label').hide();
    $('.enter_text_mand_cancel').remove();
    $('.enter_text_mand').remove();
    $('.enter_text_color_check_cancel').remove();
    $('.enter_text_color_check').remove();
    $('.spin_error').remove();
    $('.background_color_slice_odd').remove();
    $('.background_color_slice_odd_mand').remove();
    $('.background_color_slice_even').remove();
    $('.background_color_slice_even_mand').remove();
    $('.text_color_check').remove();
    $('.text_color_mand').remove();
//    $('.background_wheel_color').remove();
//    $('.background_wheel').remove();
//    $('.mailchimp_api_mand').remove();
    $('.constant_api_mand').remove();
    $('.constant_token_mand').remove();
//    $('.klaviyo_api_mand').remove();
    $('.getresponse_api_mand').remove();
    //alert('wew');
    var general_settings_tab = 0;
    var display_setting_tab = 0;
    var look_and_feel_tab = 0;
   // var wheel_setting_tab = 0;
//    var email_marketing_tab = 0;
    var email_setting_tab = 0;
    //var statistics = 0;

    var error = false;
    var errorMessage = '';

    /*Knowband validation start*/
//    var custom_js_tag = velovalidation.checkTags($("textarea[name='spin_wheel[custom_js]']"));
//
//    if (custom_js_tag !== true) {
//        //alert('test');
//        error = true;
//        $("textarea[name='spin_wheel[custom_js]']").addClass('error_field');
//        $("textarea[name='spin_wheel[custom_js]']").after($('<p class="spin_error">' + custom_js_tag + '</p>'));
//        general_settings_tab = 1;
//    }
//    var custom_css_tag = velovalidation.checkHtmlTags($("textarea[name='spin_wheel[custom_css]']"));
//    if (custom_css_tag !== true) {
//        error = true;
//        $("textarea[name='spin_wheel[custom_css]']").addClass('error_field');
//        $("textarea[name='spin_wheel[custom_css]']").after($('<p class="spin_error">' + custom_css_tag + '</p>'));
//        general_settings_tab = 1;
//    }
    if ($('[id^="spin_wheel[fix_time]_on"]').is(':checked') === true) {
        var active_date = velovalidation.checkMandatory($("input[name='spin_wheel[active_date]']"));
        if (active_date !== true) {
            error = true;
            $("input[name='spin_wheel[active_date]']").addClass('error_field');
            $("input[name='spin_wheel[active_date]']").after($('<p class="active_date spin_error">' + active_date + '</p>'));
            display_setting_tab = 1;
        }
        var expire_date = velovalidation.checkMandatory($("input[name='spin_wheel[expire_date]']"));
        if (expire_date !== true) {
            error = true;

            $("input[name='spin_wheel[expire_date]']").addClass('error_field');
            $("input[name='spin_wheel[expire_date]']").after($('<p class="expire_date spin_error">' + expire_date + '</p>'));
//            $('.expire_date').html(expire_date);
            display_setting_tab = 1;
        }
    }
    
    /*Knowband button validation end*/
    if($("#velsof_spin_wheel_image").val() !== '') {
       var img_vali = velovalidation.checkImage($("#velsof_spin_wheel_image"), 2097152, 'mb');
       if(img_vali !== true) {
           error = true;
           $('#velsof_spin_wheel_image-name').parent('.dummyfile').after($('<p class="imageerr spin_error">' + img_vali + '</p>'));
           look_and_feel_tab = 1;
       }
    }
    /*Knowband button validation start*/
    var activation_date = Date.parse($('input[name="spin_wheel[active_date]"]').val());
    var deactivation_date = Date.parse($('input[name="spin_wheel[expire_date]"]').val());
    if (parseInt(deactivation_date) <= parseInt(activation_date)) {
        error = true;
        display_setting_tab = 1;
        $('input[name="spin_wheel[expire_date]"]').addClass('error_field');
        $('input[name="spin_wheel[expire_date]"]').parent().parent().append('<span class="spin_error">' + deactivation_date_error + '</span>');
    }
  
  if ($('[name="spin_wheel[where_to_display]"]').val() === '2') {
        var selected_page = $("[name='spin_wheel[show_page][]']").val();
        if ( selected_page === null ) {
            error = true;
            $("[name='spin_wheel[show_page][]']").addClass('error_field');
            $("[name='spin_wheel[show_page][]']").after($('<p class="selected_page spin_error"></p>'));
            $('.selected_page').text(multiple_select_message);
            display_setting_tab = 1;
        }
    }
    if ($('[name="spin_wheel[where_to_display]"]').val() === '3') {
        var unselected_page = $("[name='spin_wheel[not_show_page][]']").val();
        if ( unselected_page === null ) {
            error = true;
            $("[name='spin_wheel[not_show_page][]']").addClass('error_field');
            $("[name='spin_wheel[not_show_page][]']").after($('<p class="unselected_page spin_error"></p>'));
            $('.unselected_page').text(multiple_select_message);
            display_setting_tab = 1;
        }
    }
    if ($('[name="spin_wheel[geo_location]"]').val() === '2') {
        var selected_country = $("[name='spin_wheel[selected_country][]']").val();
        if ( selected_country === null ) {
            error = true;
            $("[name='spin_wheel[selected_country][]']").addClass('error_field');
            $("[name='spin_wheel[selected_country][]']").after($('<p class="selected_country spin_error"></p>'));
            $('.selected_country').text(multiple_select_message);
            display_setting_tab = 1;
        }
    }
    if ($('[name="spin_wheel[geo_location]"]').val() === '3') {
        var unselected_country = $("[name='spin_wheel[unselected_country][]']").val();
        if ( unselected_country === null ) {
            error = true;
            $("[name='spin_wheel[unselected_country][]']").addClass('error_field');
            $("[name='spin_wheel[unselected_country][]']").after($('<p class="unselected_country spin_error"></p>'));
            $('.unselected_country').text(multiple_select_message);
            display_setting_tab = 1;
        }
    }
    if ($('[name="spin_wheel[when_to_display]"]').val() === '2') {
        var time_display = velovalidation.checkMandatory($("input[name='spin_wheel[time_display]']"));
        if (time_display !== true) {
            error = true;
            $("input[name='spin_wheel[time_display]']").addClass('error_field');
            $("input[name='spin_wheel[time_display]']").after($('<p class="time_display spin_error"></p>'));
            $('.time_display').html(time_display);
            display_setting_tab = 1;
        } else {
            var time_display_num = velovalidation.isNumeric($("input[name='spin_wheel[time_display]']"));
            if(time_display_num != true){
                error = true;
                $("input[name='spin_wheel[time_display]']").addClass('error_field');
                $("input[name='spin_wheel[time_display]']").after($('<p class="time_display spin_error">'+time_display_num+'</p>'));
                display_setting_tab = 1;
            }
        }
    }

    if ($('[name="spin_wheel[when_to_display]"]').val() === '3') {
        var scroll_display = velovalidation.checkMandatory($("input[name='spin_wheel[scroll_display]']"));
        if (scroll_display !== true) {
            error = true;
            $("input[name='spin_wheel[scroll_display]']").addClass('error_field');
            $("input[name='spin_wheel[scroll_display]']").after($('<p class="scroll_display spin_error"></p>'));
            $('.scroll_display').html(scroll_display);
            display_setting_tab = 1;
        } else {
            var scroll_display_num = velovalidation.checkPercentage($("input[name='spin_wheel[scroll_display]']"));
            if(scroll_display_num != true){
                error = true;
                $("input[name='spin_wheel[scroll_display]']").addClass('error_field');
                $("input[name='spin_wheel[scroll_display]']").after($('<p class="scroll_display spin_error">'+scroll_display_num+'</p>'));
            }
        }
    }

    var enter_text_mand = velovalidation.checkMandatory($("input[name='spin_wheel[background_color_spin]']"));
    var enter_text_color_check = velovalidation.isColor($("input[name='spin_wheel[background_color_spin]']"));
    if (enter_text_mand !== true) {
        error = true;
        $("input[name='spin_wheel[background_color_spin]']").addClass('error_field');
        $("input[name='spin_wheel[background_color_spin]']").closest('.form-group').after($('<p class="enter_text_mand spin_error" style="margin-top: -10px;"></p>'));
        $('.enter_text_mand').html(enter_text_mand);
        look_and_feel_tab = 1;
    }
    else if (enter_text_color_check !== true) {
        error = true;
        $("input[name='spin_wheel[background_color_spin]']").addClass('error_field');
        $("input[name='spin_wheel[background_color_spin]']").closest('.form-group').after($('<p class="enter_text_color_check spin_error" style="margin-top: -10px;"></p>'));
        $('.enter_text_color_check').html(enter_text_color_check);
        look_and_feel_tab = 1;
    }

    var enter_text_mand_cancel = velovalidation.checkMandatory($("input[name='spin_wheel[background_color_cancel]']"));
    var enter_text_color_check_cancel = velovalidation.isColor($("input[name='spin_wheel[background_color_cancel]']"));
    if (enter_text_mand_cancel !== true) {

        error = true;
        $("input[name='spin_wheel[background_color_cancel]']").addClass('error_field');
        $("input[name='spin_wheel[background_color_cancel]']").closest('.form-group').after($('<p class="enter_text_mand_cancel spin_error" style="margin-top: -10px;"></p>'));
        $('.enter_text_mand_cancel').html(enter_text_mand_cancel);
        look_and_feel_tab = 1;
    }
    else if (enter_text_color_check_cancel !== true) {
        error = true;
        $("input[name='spin_wheel[background_color_cancel]']").addClass('error_field');
        $("input[name='spin_wheel[background_color_cancel]']").closest('.form-group').after($('<p class="enter_text_color_check_cancel spin_error" style="margin-top: -10px;"></p>'));
        $('.enter_text_color_check_cancel').html(enter_text_color_check_cancel);
        look_and_feel_tab = 1;
    }

//    var background_wheel = velovalidation.checkMandatory($("input[name='spin_wheel[background_color_wheel]']"));
//    var background_wheel_color = velovalidation.isColor($("input[name='spin_wheel[background_color_wheel]']"));
//    if (background_wheel !== true) {
//
//        error = true;
//        $("input[name='spin_wheel[background_color_wheel]']").addClass('error_field');
//        $("input[name='spin_wheel[background_color_wheel]']").closest('.form-group').after($('<p class="background_wheel spin_error" style="margin-top: -10px;"></p>'));
//        $('.background_wheel').html(background_wheel);
//        wheel_setting_tab = 1;
//    }
//    else if (background_wheel_color !== true) {
//        $('.enter_text_color_check_cancel').remove();
//
//        error = true;
//        $("input[name='spin_wheel[background_color_wheel]']").addClass('error_field');
//        $("input[name='spin_wheel[background_color_wheel]']").closest('.form-group').after($('<p class="background_wheel_color spin_error" style="margin-top: -10px;"></p>'));
//        $('.background_wheel_color').html(background_wheel_color);
//        wheel_setting_tab = 1;
//    }
//
//    var text_color_mand = velovalidation.checkMandatory($("input[name='spin_wheel[text_color_wheel]']"));
//    var text_color_check = velovalidation.isColor($("input[name='spin_wheel[text_color_wheel]']"));
//    if (text_color_mand !== true) {
//
//        error = true;
//        $("input[name='spin_wheel[text_color_wheel]']").addClass('error_field');
//        $("input[name='spin_wheel[text_color_wheel]']").closest('.form-group').after($('<p class="text_color_mand spin_error" style="margin-top: -10px;"></p>'));
//        $('.text_color_mand').html(text_color_mand);
//        wheel_setting_tab = 1;
//    }
//    else if (text_color_check !== true) {
//
//
//        error = true;
//        $("input[name='spin_wheel[text_color_wheel]']").addClass('error_field');
//        $("input[name='spin_wheel[text_color_wheel]']").closest('.form-group').after($('<p class="text_color_check spin_error" style="margin-top: -10px;"></p>'));
//        $('.text_color_check').html(text_color_check);
//        wheel_setting_tab = 1;
//    }
 var display_interval_mand = velovalidation.checkMandatory($("input[name='spin_wheel[display_interval]']"));
    var display_interval_num = velovalidation.isNumeric($("input[name='spin_wheel[display_interval]']"));
   var days_display_interval = $("input[name='spin_wheel[display_interval]']").val();
    if (display_interval_mand !== true) {

        error = true;
        $("input[name='spin_wheel[display_interval]']").addClass('error_field');
        $("input[name='spin_wheel[display_interval]']").after($('<p class="display_interval_mand spin_error"></p>'));
        $('.display_interval_mand').html(display_interval_mand);
        general_settings_tab = 1;
    }
else if (display_interval_num !== true) {

        error = true;
        $("input[name='spin_wheel[display_interval]']").addClass('error_field');
        $("input[name='spin_wheel[display_interval]']").after($('<p class="display_interval_num spin_error"></p>'));
        $('.display_interval_num').html(display_interval_num);
        general_settings_tab = 1;
    }  else if(days_display_interval > 365) {
         error = true;
        $("input[name='spin_wheel[display_interval]']").addClass('error_field');
        $("input[name='spin_wheel[display_interval]']").parent().after($('<p class="days_display_interval spin_error">'+ display_interval_error +'</p>'));
        general_settings_tab = 1;
    }
//    if ($('[id^="spin_wheel[mailchimp_status]_on"]').is(':checked') === true) {
//        //  alert('test');
//        var mailchimp_api_mand = velovalidation.checkMandatory($("input[name='spin_wheel[mailchimp_api]']"));
//        var list_val = $("[name='spin_wheel[mailchimp_list]']").val();
//        if (mailchimp_api_mand !== true) {
//            error = true;
//
//            $("input[name='spin_wheel[mailchimp_api]']").addClass('error_field');
//            $("input[name='spin_wheel[mailchimp_api]']").after($('<p class="mailchimp_api_mand spin_error"></p>'));
//            $('.mailchimp_api_mand').html(mailchimp_api_mand);
//            email_marketing_tab = 1;
//        } else if (list_val == 'no_list') {
//            error = true;
//
//            $("input[name='spin_wheel[mailchimp_api]']").addClass('error_field');
//            $("input[name='spin_wheel[mailchimp_api]']").after($('<p class="mailchimp_api_mand spin_error"></p>'));
//            $('.mailchimp_api_mand').html(no_list_mailchimp);
//            email_marketing_tab = 1;
//        }
//    }
    if ($('[id^="spin_wheel[constant_contact_status]_on"]').is(':checked') === true) {
        //  alert('test');
        var constant_api_mand = velovalidation.checkMandatory($("input[name='spin_wheel[constant_contact_api]']"));
        var constant_token_mand = velovalidation.checkMandatory($("input[name='spin_wheel[constant_contact_token]']"));
        if (constant_api_mand !== true) {
            error = true;

            $("input[name='spin_wheel[constant_contact_api]']").addClass('error_field');
            $("input[name='spin_wheel[constant_contact_api]']").after($('<p class="constant_api_mand spin_error"></p>'));
            $('.constant_api_mand').html(constant_api_mand);
            email_marketing_tab = 1;
        }
        if (constant_token_mand !== true) {
            error = true;

            $("input[name='spin_wheel[constant_contact_token]']").addClass('error_field');
            $("input[name='spin_wheel[constant_contact_token]']").after($('<p class="constant_token_mand spin_error"></p>'));
            $('.constant_token_mand').html(constant_token_mand);
            email_marketing_tab = 1;
        }
    }
//    if ($('[id^="spin_wheel[klaviyo_status]_on"]').is(':checked') === true) {
//        //  alert('test');
//        var klaviyo_api_mand = velovalidation.checkMandatory($("input[name='spin_wheel[klaviyo_api]']"));
//        var list_val_ka = $("[name='spin_wheel[klaviyo_list]']").val();
//        if (klaviyo_api_mand !== true) {
//            error = true;
//
//            $("input[name='spin_wheel[klaviyo_api]']").addClass('error_field');
//            $("input[name='spin_wheel[klaviyo_api]']").after($('<p class="klaviyo_api_mand spin_error"></p>'));
//            $('.klaviyo_api_mand').html(klaviyo_api_mand);
//            email_marketing_tab = 1;
//        } else if (list_val_ka == 'no_list') {
//            error = true;
//
//            $("input[name='spin_wheel[klaviyo_api]']").addClass('error_field');
//            $("input[name='spin_wheel[klaviyo_api]']").after($('<p class="klaviyo_api_mand spin_error"></p>'));
//            $('.klaviyo_api_mand').html(no_list_mailchimp);
//            email_marketing_tab = 1;
//        }
//    }
    if ($('[id^="spin_wheel[getresponse_status]_on"]').is(':checked') === true) {
        //  alert('test');
        var getresponse_api_mand = velovalidation.checkMandatory($("input[name='spin_wheel[getresponse_api]']"));
        if (getresponse_api_mand !== true) {
            error = true;

            $("input[name='spin_wheel[getresponse_api]']").addClass('error_field');
            $("input[name='spin_wheel[getresponse_api]']").after($('<p class="getresponse_api_mand spin_error"></p>'));
            $('.getresponse_api_mand').html(getresponse_api_mand);
            email_marketing_tab = 1;
        }
    }
//
//$('input[name^="spin_wheel_email_subject"]').each(function () {
//            var content_val = checkMandatory($('input[name^="spin_wheel_email_subject"]'));
//
//            //console.log(content_val);
//            if (content_val !== true) {
//                  is_error = true;
//                $('#area').after('<span class="spin_error_message">' + content_val + '</span>');
//                $('#mce_53').css("border","1px solid #F44336");
//
//            }
//            else{
//              $('#mce_53').css('border', '1px solid #008000');
//        }
//            count++;
//        });
//


    $("input[name^=spin_wheel_email_subject_]").each(function () {

        var email_sub_mand = velovalidation.checkMandatory($(this));
        if (email_sub_mand != true) {
            error = true;
            $(this).addClass('error_field');

            $(this).after('<span class="spin_error">' + check_for_all_lang + '</span>');
            email_setting_tab = 1;
        }
    });

    var first_err_flag_top = 0;
    $("[name^=spin_wheel_email_content]").each(function () {
        var email_err1 = tinyMCE.get($(this).attr("id")).getContent().trim();
        if (email_err1 == '') {

            if (first_err_flag_top == 0) {
                $('textarea[name^="spin_wheel_email_content_"]').addClass('error_field');
                if (first_err_flag_top == 0) {


                    $('<p class="spin_error ">' + check_for_all_lang + '</p>').insertAfter($('textarea[name^="spin_wheel_email_content"]'));


                }
            }
            first_err_flag_top = 1;
            email_setting_tab = 1;
            error = true;
        }
    });


//    if($('[name="spin_wheel[where_to_display]"]').val() === '2') {
//     var show_page = velovalidation.checkMandatory($("input[name='spin_wheel[show_page][]']"));
//     if (show_page!== true){
//        error = true;
//       
//        $("input[name='spin_wheel[show_page][]']").addClass('error_field');
//        $("input[name='spin_wheel[show_page][]']").after($('<p class="show_page spin_error"></p>'));
//        $('.show_page').html(show_page);
//        display_setting_tab = 1;
//    }   
//    }
//    
//     if($('[name="spin_wheel[where_to_display]"]').val() === '3') {
//     var not_show_page = velovalidation.checkMandatory($("input[name='spin_wheel[not_show_page][]']"));
//     if (not_show_page!== true){
//        error = true;
//       
//        $("input[name='spin_wheel[not_show_page][]']").addClass('error_field');
//        $("input[name='spin_wheel[not_show_page][]']").after($('<p class="not_show_page spin_error"></p>'));
//        $('.show_page').html(not_show_page);
//        display_setting_tab = 1;
//    } 
//    }
    // alert('test111');
    // alert(error);
    if (error === true) {
        //alert('test');
        if (general_settings_tab === 1) {
            $('#link-General_Settings').children('.velsof_error_label').show();
            $('#link-General_Settings').children().children('#velsof_error_icon').css('display', 'inline');
        }
//        if (display_setting_tab === 1) {
//            $('#link-Display_Settings').children('.velsof_error_label').show();
//            $('#link-Display_Settings').children().children('#velsof_error_icon').css('display', 'inline');
//        }
        if (look_and_feel_tab === 1) {
            $('#link-Look_Feel_Settings').children('.velsof_error_label').show();
            $('#link-Look_Feel_Settings').children().children('#velsof_error_icon').css('display', 'inline');
        }
//        if (wheel_setting_tab === 1) {
//            $('#link-Wheel_Settings').children('.velsof_error_label').show();
//            $('#link-Wheel_Settings').children().children('#velsof_error_icon').css('display', 'inline');
//        }
//        if (email_marketing_tab === 1) {
//            $('#link-Email_Marketing').children('.velsof_error_label').show();
//            $('#link-Email_Marketing').children().children('#velsof_error_icon').css('display', 'inline');
//        }
//        if (email_setting_tab === 1) {
//            $('#link-Email_Settings').children('.velsof_error_label').show();
//            $('#link-Email_Settings').children().children('#velsof_error_icon').css('display', 'inline');
//        }

        return false;
    }
}