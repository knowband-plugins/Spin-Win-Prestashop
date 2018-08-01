
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
var copy_msg_show = true;
function onRotateWheel() {
    var email = $("input[name='spin_wheel_email']").val();
    var email_error = checkEnteredEmail(email);
    if (email_error === false) {
        if (email_recheck == 1) {
            $.ajax({
                url: spin_wheel_front_path,
                type: 'post',
                data: 'emailRecheck=true&email=' + email,
                dataType: 'json',
                success: function (json) {
                    if (json == false) {
                        error = true;
                        $('#velsof_spin_wheel').tooltipster('content', email_check);
                        $('#velsof_spin_wheel').tooltipster('show');
                        setTimeout(function () {
                            $('#velsof_spin_wheel').tooltipster('destroy');
                        }, 2000);
                    } else {
                        var email = $("input[name='spin_wheel_email']").val().trim();
                        $.ajax({
                            // url: spinwheel_base_url + 'modules/spinwheel/sendCoupon.php',
                            url: spin_wheel_front_path,
                            type: 'post',
                            data: 'spinwheelajax=true&email=' + email + '&wheel_device=' + wheel_device,
                            dataType: 'json',
                            beforeSend: function () {
                                $('#main_title').hide();
                                $('#velsof_description').hide();
                                $('.velsof_ul').hide();
                                $('#rotate_btn').hide();
                                $('#exit').hide();
                                $('#velsof_spin_wheel').hide();
                                $('.before_loader').show();
                            },
                            success: function (json) {
                                document.getElementById('velsof_spinner').style.animationName = 'spinwheel_' + json['slice_no'];
                                var code = json['code'];
                                var slice_no = json['slice_no'];
                                setTimeout(function () {
                                    setCookie('velsof_wheel_used', 2);
                                    $('#suc_msg').html(json['suc_msg']);
                                    $('#velsof_description').html(json['suc_desc']);
                                    $('#velsof_description').show();
                                    $('#suc_msg').show();

                                    if (display_option == 2) {
                                        // alert(email_only);
                                        $('#velsof_spin_wheel').val(email_only_msg);
                                        $('#velsof_spin_wheel').show();
                                        $('#continue_btn').show();
                                    } else {
                                        if (json['code'] !== '') {
                                            copy_msg_show = false;
                                            $('#velsof_spin_wheel').val(json['code']);
                                            $('#velsof_spin_wheel').show();
                                        }
                                        $('#continue_btn').show();
                                    }

                                }, 6000);
                                if (display_option == '1') {

                                } else {
                                    if (json['code'] !== '') {
                                        $.ajax({
                                            //url: spinwheel_base_url + 'modules/spinwheel/sendCoupon.php',
                                            url: spin_wheel_front_path,
                                            type: 'post',
                                            data: 'sendEmail=true&email=' + email + '&code=' + code + '&slice_no=' + slice_no,
                                            dataType: 'json',
                                            success: function (json) {
                                            }
                                        });
                                    }
                                }
                            },
                            complete: function () {
                                $('.before_loader').hide();
                            }
                        });
                    }
                }
            });
        } else {
            var email = $("input[name='spin_wheel_email']").val().trim();
            $.ajax({
                // url: spinwheel_base_url + 'modules/spinwheel/sendCoupon.php',
                url: spin_wheel_front_path,
                type: 'post',
                data: 'spinwheelajax=true&email=' + email + '&wheel_device=' + wheel_device,
                dataType: 'json',
                beforeSend: function () {
                    $('#main_title').hide();
                    $('#velsof_description').hide();
                    $('.velsof_ul').hide();
                    $('#rotate_btn').hide();
                    $('#exit').hide();
                    $('#velsof_spin_wheel').hide();
                    $('.before_loader').show();
                },
                success: function (json) {
                    document.getElementById('velsof_spinner').style.animationName = 'spinwheel_' + json['slice_no'];
                    var code = json['code'];
                    var slice_no = json['slice_no'];
                    setTimeout(function () {
                        setCookie('velsof_wheel_used', 2);
                        $('#suc_msg').html(json['suc_msg']);
                        $('#velsof_description').html(json['suc_desc']);
                        $('#velsof_description').show();
                        $('#suc_msg').show();

                        if (display_option == 2) {
                            // alert(email_only);
                            $('#velsof_spin_wheel').val(email_only_msg);
                            $('#velsof_spin_wheel').show();
                            $('#continue_btn').show();
                        } else {
                            if (json['code'] !== '') {
                                copy_msg_show = false;
                                $('#velsof_spin_wheel').val(json['code']);
                                $('#velsof_spin_wheel').show();
                            }
                            $('#continue_btn').show();
                        }

                    }, 6000);
                    if (display_option == '1') {

                    } else {
                        if (json['code'] !== '') {
                            $.ajax({
                                //url: spinwheel_base_url + 'modules/spinwheel/sendCoupon.php',
                                url: spin_wheel_front_path,
                                type: 'post',
                                data: 'sendEmail=true&email=' + email + '&code=' + code + '&slice_no=' + slice_no,
                                dataType: 'json',
                                success: function (json) {
                                }
                            });
                        }
                    }
                },
                complete: function () {
                    $('.before_loader').hide();
                }
            });
        }
    }
}
function checkEnteredEmail(email) {
    var error = false;
    $('.spin_error').remove();
    $('#velsof_spin_wheel').tooltipster({
        animation: 'swing',
        'theme': ['tooltipster-default', 'tooltipster-velsofspinwheel']
    });

    var email_mand = velovalidation.checkMandatory($("input[name='spin_wheel_email']"));
    var email_valid = velovalidation.checkEmail($("input[name='spin_wheel_email']"));
    if (email_mand !== true) {
        error = true;
        $('#velsof_spin_wheel').tooltipster('content', email_mand);
        $('#velsof_spin_wheel').tooltipster('show');
        setTimeout(function () {
            $('#velsof_spin_wheel').tooltipster('destroy');
        }, 2000);
//        $("input[name='spin_wheel_email']").addClass('error_field');
//        $("input[name='spin_wheel_email']").after('<span class="spin_error">' + email_mand + '</span>')
        return error;
    } else if (email_valid !== true) {
        error = true;
        $('#velsof_spin_wheel').tooltipster('content', email_valid);
        $('#velsof_spin_wheel').tooltipster('show');
        setTimeout(function () {
            $('#velsof_spin_wheel').tooltipster('destroy');
        }, 2000);
//        $("input[name='spin_wheel_email']").addClass('error_field');
//        $("input[name='spin_wheel_email']").after('<span class="spin_error">' + email_valid + '</span>');
        return error;
    } else {
        return error;
    }
}
function wheelAction(data, email) {
    $('.before_loader').hide();

    if (data['type'] === 'Win') {
        var code = data['code'];
        var slice_no = data['slice_no'];
        $.ajax({
            //  url: spinwheel_base_url + 'modules/spinwheel/sendCoupon.php',
            url: spin_wheel_front_path,
            type: 'post',
            data: 'sendEmail=true&email=' + email + '&code=' + code + '&slice_no=' + slice_no,
            dataType: 'json',
            success: function (json) {
                console.log(json);
            }
        });
        var code = data['code'];
        var label = data['label'];

//        $('.coupon_result').html('<div id="velsof_offer_main_container"><span class="velsof_main_title">' + win_msg + ' ' + label + '</span><br><br><span  class="velsof_main_title">' + coupon_msg + '</span><br><br><input  class="velsof_input_field" style="color:black;" value="'+code+'"></div>');

    }
    else {

//        $('.coupon_result').html('<div id="velsof_offer_main_container"><span class="velsof_main_title">' + loose_msg + '</span></div>');
    }

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
$(document).ready(function () {
    var show = true;
    if (hide_after !== '') {
         
        $('#pull_out').hide();
        setTimeout(function () {
            $('#pull_out').hide();
            $("#velsof_wheel_container").hide();
            setTimeout(function () {
                if (show_pull_out == 1) {
            $('#pull_out').show();
        } else {
            $('#pull_out').hide();
        }
                $('#velsof_wheel_main_container').removeClass('transform');
            }, 500);
        }, hide_after * 1000);
    }

    if (min_screen_size !== '') {
        var screen = min_screen_size.split('_');
        var width = screen[0];
        var height = screen[1];
        if (window.screen.width < width) {
            $('#velsof_wheel_main_container').removeClass('transform');
            $("#velsof_wheel_container").hide();
            $('#pull_out').hide();
             show = false;
        }
    }

    if (time_display !== '') {
        
        var time = Number(time_display) * 1000;
        var myCookie = getCookie("velsof_spin_wheel_tab");
        var velsof_wheel_used = getCookie('velsof_wheel_used');
        if(myCookie == null && velsof_wheel_used == null) {
            if (show_pull_out == 1) {
            $('#pull_out').show();
        } else {
            $('#pull_out').hide();
        }
        setTimeout(function () {
            $('#velsof_wheel_container').show();
            $('#pull_out').hide();
            // document.getElementById("velsof_wheel_container").style.display = 'block';
            $('#velsof_wheel_main_container').addClass('transform');
        },
                time);
            }
    } else if (scroll_display !== '') {
        
        $(document).on("scroll", function () {
            if (!window.displayed_through_scroll) {
                var s = $(window).scrollTop(),
                        d = $(document).height(),
                        c = $(window).height();
                var scrollPercent = (s / (d - c)) * 100;
                if (scrollPercent >= scroll_display) {
                    var myCookie = getCookie("velsof_spin_wheel_tab");
        var velsof_wheel_used = getCookie('velsof_wheel_used');
        if(myCookie == null && velsof_wheel_used == null) {
                        if (show_pull_out == 1) {
                            $('#pull_out').show();
                        } else {
                            $('#pull_out').hide();
                        }
                    setTimeout(function () {
                        $('#pull_out').hide();
                        $("#velsof_wheel_container").show();
                        $("#velsof_wheel_main_container").addClass("transform");


                        window.displayed_through_scroll = true;

                    }
                    , 300);
                }
            }
            }
        });

    } else if (exit_display == true) {
        
         var myCookie = getCookie("velsof_spin_wheel_tab");
        var velsof_wheel_used = getCookie('velsof_wheel_used');
        if(myCookie == null && velsof_wheel_used == null) {
            if (show_pull_out == 1) {
            $('#pull_out').show();
        } else {
           $('#pull_out').hide();
        }
        setTimeout(function() {
                var popup = ouibounce(document.getElementById("velsof_wheel_container"), {
                aggressive: true,
                timer: 0,
                callback: function () {
                     $('#pull_out').hide();
                    
                    setTimeout(function () {
                        jQuery('#velsof_wheel_main_container').addClass('transform');
                    }, 500);
                    
                }
            });
        }, 500);
    }
    }
    
    else {
        
        if(show) {
        var myCookie = getCookie("velsof_spin_wheel_tab");
        var velsof_wheel_used = getCookie('velsof_wheel_used');
        if (myCookie == null && velsof_wheel_used == null) {
            $('#velsof_wheel_container').show();
            setTimeout(function () {
                $('#velsof_wheel_main_container').addClass('transform');
            }, 500);
        }
        else {
            var cookie = getCookie('velsof_wheel_used');
            if (show_pull_out == 1 && cookie == null) {

                $('#pull_out').show();
            }
        }
    }
    }

    $('.cancel_button').on('click', function () {
        setCookie('velsof_spin_wheel_tab', 3);
        $('#velsof_wheel_main_container').removeClass('transform');
        setTimeout(function () {
            $('#velsof_wheel_container').hide();
            if (show_pull_out == 1) {
                $('#pull_out').show();
            }
        }, 500);
    });

    $('#continue_btn').on('click', function () {
        if (display_option != 2 && copy_msg_show == false) {
            copyToClipboard(document.getElementById("velsof_spin_wheel"));
            $('#velsof_spin_wheel').tooltipster({
                animation: 'swing',
                'theme': ['tooltipster-default', 'tooltipster-velsofspinwheel']
            });

            $('#velsof_spin_wheel').tooltipster('content', copy_msg);
            $('#velsof_spin_wheel').tooltipster('show');
            setTimeout(function () {
                $('#velsof_spin_wheel').tooltipster('destroy');
                $('#velsof_wheel_main_container').removeClass('transform');
                setTimeout(function () {
                    $('#velsof_wheel_container').hide();

                    $('#pull_out').hide();

                }, 500);

            }, 2000);
        } else {
//        setTimeout(function () {
            $('#velsof_wheel_main_container').removeClass('transform');
            setTimeout(function () {
                $('#velsof_wheel_container').hide();
                $('#pull_out').hide();
            }, 500);
//        }, 2000);
        }

    });

    $('.spin_toggle').on('click', function () {
        $('#pull_out').hide();
        $('#velsof_wheel_container').show();

        setTimeout(
                function () {
                    $('#velsof_wheel_main_container').addClass('transform');
                }, 500);
    });



});

function setCookie(cookie_name, cookie_value) {
    date = new Date();
    date.setTime(date.getTime() + 24 * 60 * 60 * 1000);
    expires = "; expires=" + date.toUTCString();
    document.cookie = cookie_name + '=' + cookie_value + expires + '; path=/';
}


function copyToClipboard(elem) {
    // create hidden text element, if it doesn't already exist
    var targetId = "_hiddenCopyText_";
    var isInput = elem.tagName === "INPUT" || elem.tagName === "TEXTAREA";
    var origSelectionStart, origSelectionEnd;
    if (isInput) {
        // can just use the original source element for the selection and copy
        target = elem;
        origSelectionStart = elem.selectionStart;
        origSelectionEnd = elem.selectionEnd;
    } else {
        // must use a temporary form element for the selection and copy
        target = document.getElementById(targetId);
        if (!target) {
            var target = document.createElement("textarea");
            target.style.position = "absolute";
            target.style.left = "-9999px";
            target.style.top = "0";
            target.id = targetId;
            document.body.appendChild(target);
        }
        target.textContent = elem.textContent;
    }
    // select the content
    var currentFocus = document.activeElement;
    target.focus();
    target.setSelectionRange(0, target.value.length);

    // copy the selection
    var succeed;
    try {
        succeed = document.execCommand("copy");
    } catch (e) {
        succeed = false;
    }
    // restore original focus
    if (currentFocus && typeof currentFocus.focus === "function") {
        currentFocus.focus();
    }

    if (isInput) {
        // restore prior selection
        elem.setSelectionRange(origSelectionStart, origSelectionEnd);
    } else {
        // clear temporary content
        target.textContent = "";
    }
    return succeed;
}