<?php
/**
 * DISCLAIMER
 *
 * Do not edit or add to this file if you wish to upgrade PrestaShop to newer
 * versions in the future. If you wish to customize PrestaShop for your
 * needs please refer to http://www.prestashop.com for more information.
 * We offer the best and most useful modules PrestaShop and modifications for your online store.
 *
 * @author    knowband.com <support@knowband.com>
 * @copyright 2015 knowband
 * @license   see file: LICENSE.txt
 * @category  PrestaShop Module
 */

class CommonWheel extends Module
{
    /*
     * Function to add aqua template in database while installing the module
     */
    protected function getDefaultAquaEmail()
    {
        $template_html = array();
        $template_html['name'] = 'Aqua';
        $template_html['body'] = $this->context->smarty->fetch(_PS_MODULE_DIR_ . 'spinwheel/views/templates/admin/aqua.tpl');
        $template_html['subject'] = 'Congratulation! Redeem Your Coupon on First Purchase';
        $template_html['text_content'] = '';
        $template_html['template_lang'] = 1;
        return $template_html;
    }
    /*
     * Function to add wind template in database while installing the module
     */
    protected function getDefaultWindEmail()
    {
        $template_html = array();
        $template_html['name'] = 'Wind';
        $template_html['body'] = $this->context->smarty->fetch(_PS_MODULE_DIR_ . 'spinwheel/views/templates/admin/wind.tpl');
        $template_html['subject'] = 'Congratulation! Redeem Your Coupon on First Purchase';
        $template_html['text_content'] = '';
        $template_html['template_lang'] = 1;
        return $template_html;
    }
    /*
     * Function to add void template in database while installing the module
     */
    protected function getDefaultVoidEmail()
    {
        $template_html = array();
        $template_html['name'] = 'Void';
        $template_html['body'] = $this->context->smarty->fetch(_PS_MODULE_DIR_ . 'spinwheel/views/templates/admin/void.tpl');
        $template_html['subject'] = 'Congratulation! Redeem Your Coupon on First Purchase';
        $template_html['text_content'] = '';
        $template_html['template_lang'] = 1;
        return $template_html;
    }
    /*
     * Function to add fire template in database while installing the module
     */
    protected function getDefaultFireEmail()
    {
        $template_html = array();
        $template_html['name'] = 'Fire';
        $template_html['body'] = $this->context->smarty->fetch(_PS_MODULE_DIR_ . 'spinwheel/views/templates/admin/fire.tpl');
        $template_html['subject'] = 'Congratulation! Redeem Your Coupon on First Purchase';
        $template_html['text_content'] = '';
        $template_html['template_lang'] = 1;
        return $template_html;
    }
    /*
     * Function to add earth template in database while installing the module
     */
    protected function getDefaultEarthEmail()
    {
        $template_html = array();
        $template_html['name'] = 'Earth';
        $template_html['body'] = $this->context->smarty->fetch(_PS_MODULE_DIR_ . 'spinwheel/views/templates/admin/earth.tpl');
        $template_html['subject'] = 'Congratulation! Redeem Your Coupon on First Purchase';
        $template_html['text_content'] = '';
        $template_html['template_lang'] = 1;
        return $template_html;
    }
}
