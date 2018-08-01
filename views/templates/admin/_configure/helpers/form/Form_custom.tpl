
{extends file="helpers/form/form.tpl"}

{block name="defaultForm"}
    <script>
        var general_settings = "{$general_settings|escape:'htmlall':'UTF-8'}";
{*        var display_settings = "{$display_settings|escape:'htmlall':'UTF-8'}";*}
        var look_feel_settings = "{$look_feel_settings}";{*variable contains HTML content, Can not escape this*}
{*        var wheel_settings = "{$wheel_settings|escape:'htmlall':'UTF-8'}";*}
        var slice_settings = "{$slice_settings|escape:'htmlall':'UTF-8'}";
        var email_marketing_values = {$email_marketing_values|escape:'quotes':'UTF-8'};
{*        var email_marketing = "{$email_marketing|escape:'htmlall':'UTF-8'}";*}
{*        var email_settings = "{$email_settings|escape:'htmlall':'UTF-8'}";*}
        var wheel_user_list = "{$wheel_user_list|escape:'htmlall':'UTF-8'}";
        var imageexist = "{$imageexist|escape:'htmlall':'UTF-8'}";
        var default_tab = "{$default_tab|escape:'htmlall':'UTF-8'}";
{*        var statistics = "{$statistics|escape:'htmlall':'UTF-8'}";*}
        var path = "{$path|escape:'htmlall':'UTF-8'}";
        {*        var image_path = "{$pathimage}";{*variable contains HTML content, Can not escape this*}
        var module_path = "{$module_path}";{*variable contains HTML content, Can not escape this*}
        {*        var fix_time = "{$fixtime|escape:'htmlall':'UTF-8'}";*}
        var email_lang = "{$email_lang|escape:'htmlall':'UTF-8'}";
        var update_success_msg = "{l s='Data has been submitted successfully.' mod='spinwheel'}";
        var update_error_msg = "{l s='Data could not be saved.' mod='spinwheel'}"
        var no_list_mailchimp = "{l s='No list exists for this API key.' mod='spinwheel'}";
        var filter_text = "{l s='Filter' mod='spinwheel'}";
        var reset_text = "{l s='Reset' mod='spinwheel'}";
        var default_image_path = "{$default_image_path|escape:'quotes':'UTF-8'}";
        var display_image_path = "{$display_image_path|escape:'quotes':'UTF-8'}";
        var image_select_text = "{l s='Please select only images' mod='spinwheel'}";
        var no_image_text = "{l s='No Image Found' mod='spinwheel'}";
        var image_deleted_text = "{l s='Image deleted successfully' mod='spinwheel'}";
        var delete_image_text = "{l s='Are you sure to delete?' mod='spinwheel'}";
        var browser_support_text = "{l s='This browser does not support FileReader.' mod='spinwheel'}";
        var deactivation_date_error = "{l s='Expire date can not be less than active date.' mod='spinwheel'}";
        var value_between_msg2 = "{l s='This field can not contain number which is greater than 100.' mod='spinwheel'}";
        var count_lang = "{$count_lang|escape:'quotes':'UTF-8'}";
        var check_for_all_lang = "{l s='This field can not be empty.Please check for all languages.' mod='spinwheel'}";
        var value_sum = "{l s='Total of gravity should be 100.Your sum is ' mod='spinwheel'}";
        var spinwheel_base_url = "{$spinwheel_base_url}";{*Variable contains html content, escape not required*}
{*        var total_generated_coupon = "{l s='Total Generated Coupons' mod='spinwheel'}";*}
        var total_used_coupons = "{l s='Total Used Coupons' mod='spinwheel'}";
        var coupon_unused = "{l s='Total Unused Coupons' mod='spinwheel'}";
        var fromtodate = "{l s='To date should be greater than or equal to from date' mod='spinwheel'}";
        var save = "{l s='Save' mod='spinwheel'}";
        var multiple_select_message = "{l s='This field can not be empty.' mod='spinwheel'}";
        var total_generated_coupon_data = {$total_generated_coupon_data|escape:'quotes':'UTF-8'};
        var total_unused_data = {$total_unused_data|escape:'quotes':'UTF-8'};
{*        var total_used_data = {$total_used_data|escape:'quotes':'UTF-8'};*}
        var ticks = {$ticks|escape:'quotes':'UTF-8'};
        var email_sent = "{l s='Email has been sent successfully.' mod='spinwheel'}";
        var filter_date_error = "{l s='To date can not be less than From date.' mod='spinwheel'}";
        var display_interval_error = "{l s='Days should not be greater than 365.' mod='spinwheel'}";
        var language_id = "{$language_id|escape:'quotes':'UTF-8'}";
        var feature_not_available = "{l s='This feature is not available in free version.' mod='spinwheel'}";
        {*var id_lang_arr = [];
        var id_lang_arr = {$language};*}
        {*  var j = 0;
        {foreach from=$language item=i }
        var id_lang_arr[j] = {i.[id_lang]};
        j++;
        {/foreach}*}
        //error messages for velovalidation.js
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
            number_pos:"{l s='You can enter only positive numbers.' mod='spinwheel'}",
            
        });

    </script>

{*    <div class='panel kpi-container' style="display:none">
        <div class='row'>
            <div class="col-sm-4">{$kpis1}</div>
            <div class="col-sm-4"> {$kpis2}</div>
            <div class="col-sm-4">{$kpis3}</div>
        </div>
    </div> *}
    <div class='row'>
        <div class="productTabs col-lg-2 col-md-3">
            <div class="list-group">
                {$i=1}
                {foreach $product_tabs key=numStep item=tab}
                    <a class="list-group-item {if $tab.selected|escape:'htmlall':'UTF-8'}active{/if}" id="link-{$tab.id|escape:'htmlall':'UTF-8'}" onclick="change_tab(this,{$i|escape:'htmlall':'UTF-8'});">{$tab.name|escape:'htmlall':'UTF-8'}
                        <label class="velsof_error_label"><img id='velsof_error_icon' class="velsof_error_tab_img"  style="display:none; position:absolute; right:10px; top:10px;" src="{$path|escape:'htmlall':'UTF-8'}views/img/admin/error_icon.gif"></label>
                    </a>
                    {$i=$i+1}
                {/foreach}
            </div>
        </div>
        {*            {if $list neq NULL }*}

        {$form} {*Variable contains html content, escape not required*}
        {*  <div id="image-holder" style="width: 30%"><img class="default-image" src="{$display_image_path|escape:'htmlall':'UTF-8'}"></div><input id="remove-button" class="btn btn-default" onclick="removeImage();" type="button" value="{l s='Remove Background Image' mod='exitpopupmodule'}"/>*}
        {*            {/if}*}
        


        <div class="list_slice col-lg-10">
            {$list_slice}{*Variable contains html content, escape not required*}

        </div>
        <div class='graph_spin_wheel col-lg-10'>


            {*Variable contains html content, escape not required*}
{*            <div >
                {$list_customer}
            </div>*}
        </div>
        <div class="col-lg-10 col-lg-offset-2">
            {$free_version}{*Variable contains html content, escape not required*}
        </div>

   
            
        


    {/block}


    {*
    * DISCLAIMER
    *
    * Do not edit or add to this file if you wish to upgrade PrestaShop to newer
    * versions in the future. If you wish to customize PrestaShop for your
    * needs please refer tohttp://www.prestashop.com for more information.
    * We offer the best and most useful modules PrestaShop and modifications for your online store.
    *
    * @category  PrestaShop Module
    * @author    knowband.com <support@knowband.com>
    * @copyright 2017 Knowband
    * @license   see file: LICENSE.txt
    *
    * Description
    *
    * Admin tpl file
    *}

