{*
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
*}

<html>
    <head>
        <meta name="viewport" content="initial-scale=1.0, maximum-scale=1.0, width=device-width">
        <script>
            var velsofWheelHexCode = "#4497bb";
            var spinwheel_base_url = "{$spinwheel_base_url|escape:'htmlall':'UTF-8'}";
            var win_msg = "{l s='You Win ' mod='spinwheel'}";
            var loose_msg = "{l s='Not lucky today ! Try next time.' mod='spinwheel'}";
            var coupon_msg = "{l s='Use This Code To Redeem Your Offer.' mod='spinwheel'}";
            var show_pull_out = "{$show_popup|escape:'htmlall':'UTF-8'}";
            var email_recheck = "{$email_recheck|escape:'htmlall':'UTF-8'}";
            var wheel_device = "{$wheel_device|escape:'htmlall':'UTF-8'}";
            var email_check = "{l s='This email has been used already.' mod='spinwheel'}";
            var time_display = "{$time_display|escape:'htmlall':'UTF-8'}"
            var scroll_display = "{$scroll_display|escape:'htmlall':'UTF-8'}";
            var exit_display = "{$exit_display|escape:'htmlall':'UTF-8'}";
            var hide_after = "{$hide_after|escape:'htmlall':'UTF-8'}";
            var min_screen_size = "{$min_screen_size|escape:'htmlall':'UTF-8'}";
            var copy_msg = "{l s='Code Copied' mod='spinwheel'}";
            {*         var only_wheel = "{$only_wheel|escape:'htmlall':'UTF-8'}";*}
            var display_option = "{$display_option|escape:'htmlall':'UTF-8'}";
            var spin_wheel_front_path = "{$spin_wheel_front_path}"; {*variable contains HTML content, Can not escape this*}
            var email_only_msg = "{l s='Coupon code has been sent to your email id.' mod='spinwheel'}";
            velovalidation.setErrorLanguage({
                empty_field: "{l s='Field cannot be empty.' mod='spinwheel'}",
                number_field: "{l s='You can enter only numbers.' mod='spinwheel'}",
                positive_number: "{l s='Number should be greater than 0.' mod='spinwheel'}",
                maxchar_field: "{l s='Field cannot be greater than {#} characters.' mod='spinwheel'}",
                minchar_field: "{l s='Field cannot be less than {#} character(s).' mod='spinwheel'}",
                empty_email: "{l s='Please enter Email.' mod='spinwheel'}",
                validate_email: "{l s='Please enter a valid Email.' mod='spinwheel'}",
                invalid_date: "{l s='Invalid date format.' mod='spinwheel'}",
                validate_range: "{l s='Number is not in the valid range. It should be betwen {##} and {###}' mod='spinwheel'}",
                valid_amount: "{l s='Field should be numeric.' mod='spinwheel'}",
                valid_decimal: "{l s='Field can have only upto two decimal values.' mod='spinwheel'}",
                max_email: "{l s='Email cannot be greater than {#} characters.' mod='spinwheel'}",
                specialchar_zip: "{l s='Zip should not have special characters.' mod='spinwheel'}",
                valid_percentage: "{l s='Percentage should be in number.' mod='spinwheel'}",
                between_percentage: "{l s='Percentage should be between 0 and 100.' mod='spinwheel'}",
                maxchar_size: "{l s='Size cannot be greater than {#} characters.' mod='spinwheel'}",
                maxchar_color: "{l s='Color could not be greater than {#} characters.' mod='spinwheel'}",
                invalid_color: "{l s='Color is not valid.' mod='spinwheel'}",
                specialchar: "{l s='Special characters are not allowed.' mod='spinwheel'}",
                script: "{l s='Script tags are not allowed.' mod='spinwheel'}",
                style: "{l s='Style tags are not allowed.' mod='spinwheel'}",
                iframe: "{l s='Iframe tags are not allowed.' mod='spinwheel'}",
                not_image: "{l s='Uploaded file is not an image.' mod='spinwheel'}",
                image_size: "{l s='Uploaded file size must be less than {#}.' mod='spinwheel'}",
                html_tags: "{l s='Field should not contain HTML tags.' mod='spinwheel'}",
            });
            {$custom_js}{*variable contains JS content, Can not escape this*}
        </script>
        <style>
            {$custom_css}{*variable contains CSS content, Can not escape this*}
            .velsof_button {
                background-color: {$spin_button_color};{*variable contains HTML content, Can not escape this*}
            }
            .cancel_button{
                color: {$cancel_button_color};{*variable contains HTML content, Can not escape this*}
                text-align: right;  cursor: pointer;
            }
            #velsof_wheel_main_container{
                background-color: #004d70;
            }
            .wheelslices{
                color: #ffffff;
            }

        </style>
    </head>
    <body>

        {* <div>
             
        <iframe src="{$front_path}" style="    width: 100%;
        height: 100%;
        position: fixed;
        left: 0px;
        bottom: 0px;
        top: 0px;
        z-index: 100000;"></iframe>
        </div>*}
        <span class="spin_toggle"><img src="{$path|escape:'htmlall':'UTF-8'}views/img/front/right_slide.png" alt="slide" style="display: none;width:50px;height: 50px;" id="pull_out"/></span>


        <div id="velsof_wheel_container"  style="display: none;height: 100%;
             position: fixed;
             left: 0px;
             bottom: 0px;
             top: 0px;
             z-index: 100000">

            <div id="velsof_wheel_model"> </div>
            <div id="velsof_wheel_main_container">
                <div id="velsof_offer_container">
                    <div id="velsof_offer_main_container">
                        {if isset($front_image_path) && $front_image_path neq "" }
                            <div><img src='{$front_image_path}' alt='Website Logo' id='spin_wheel_logo'/></div>{*variable contains HTML content, Can not escape this*}
                            {/if}
                        <div id='main_title' class="velsof_main_title">{l s='Special bonus unlocked' mod='spinwheel'}</div>
                        <div id = 'suc_msg' style = 'display: none;' class="velsof_main_title"></div>
                        <div>
                            <div id='velsof_description' class="velsof_subtitle" style="padding-bottom:10px;">{l s='You have a chance to win a nice big fat discount. Are you ready?' mod='spinwheel'}</div>
                            <ul class="velsof_ul">
                                <li>{l s='You can spin the wheel only once.' mod='spinwheel'}</li>
                                <li>
                                    {l s='If you win, you can claim your coupon for 1 day only!' mod='spinwheel'} 
                                </li>
                            </ul>
                        </div>
                        <div>
                            <input id='velsof_spin_wheel' type="text" name="spin_wheel_email" class="velsof_input_field" placeholder="{l s='Enter you email' mod='spinwheel'}" value=''>
                            <input id='rotate_btn' type="button" class="velsof_button" name="Rotate" value="{l s='Try your luck' mod='spinwheel'}" onclick="onRotateWheel()" />
                            <div id="exit" class="velsof_subtitle cancel_button" >{l s='No, I do not feel lucky' mod='spinwheel'}</div>
                            <div id="continue_btn" class="velsof_button exit_button" style='display:none;'>{l s='Continue' mod='spinwheel'}</div>
                        </div>
                    </div>
                    <div class='before_loader' id="velsof_offer_main_container" style='display:none;'><img id='spin_after_loader' src="{$path|escape:'htmlall':'UTF-8'}views/img/front/loader.gif" alt='loader'/> </div>  
                    <div class='coupon_result'></div>

                </div>

                <div id="velsof_spinner_container">
                    <div id="velsof_spinners">
                        <div class="velsof_shadow"></div>
                        <div id="velsof_spinner">
                            {$deg = 0}

                            {foreach $label_name key=numStep item=tab}                     
                                <div class="wheelslices" style="transform: rotate(-{$deg}deg) translate(0px, -50%);">{*variable contains HTML content, Can not escape this*}
                                    {$tab|escape:'quotes':'UTF-8'}
                                </div>
                                {$deg = $deg + 30}
                            {/foreach}

                        </div>
                    </div>
                    <div id="velsof_wheel_pointer"> </div>
                </div>
            </div>
        </div>
    </body>
