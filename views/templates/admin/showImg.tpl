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
<div id="image-holder" style="width: 30%"><img class="default-image" style="max-width:300px; border: 1px solid #C7D6DB" src="{$display_image_path|escape:'htmlall':'UTF-8'}">
                       </div><input id="remove-button" class="btn btn-default"
                       onclick="removeImage();" type="button" 
                         value="{l s='Remove Background Image' mod='spinwheel'}"/>