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

include_once(_PS_MODULE_DIR_ . 'spinwheel/libraries/drewm/mailchimp-api/src/MailChimp.php');

class SpinWheelFrameSpinWheelModuleFrontController extends ModuleFrontController
{

    public function __construct()
    {
        parent::__construct();
    }

    /*
     * Default prestashop function for post processes
     */
    public function postProcess()
    {
        parent::init();
        $module = Module::getInstanceByName('spinwheel');
        $this->module_dir = _PS_MODULE_DIR_ . 'spinwheel/';
        $json = array();
        if (Tools::isSubmit('spinwheelajax')) {
            $json = $this->sendCouponToCustomer($_POST);
        }
        if (Tools::isSubmit('emailRecheck')) {
            $json = $this->emailRecheck($_POST);
        }
        if (Tools::isSubmit('sendEmail')) {
            $json = $this->sendEmail($_POST);
        }
        echo Tools::jsonEncode($json);
        die;
    }

     /*
     * Function to check if email is already used for generating coupon or not
     * 
     * @params    boolean return   True if not already user otherwise returns false
     */
    public function emailRecheck()
    {
        $email = Tools::getValue('email');
        $sql = "Select count(*) as count from " . _DB_PREFIX_ . "spin_wheel_user_list where customer_email='" . pSQL($email) . "'";
        $res = Db::getInstance()->getRow($sql);
        if ($res['count'] == 0) {
            return true;
        } else {
            return false;
        }
    }

    /*
     * Function to get random coupons and contains a probability logic to 
     * select slice number and according to that slice number it returns coupon data
     * 
     * @params    Array return   Coupon data of selected slice number if coupon value is not zero
     */
    private function generateCouponCode()
    {
        $length = 8;
        $code = '';
        $chars = 'abcdefghjkmnpqrstuvwxyzABCDEFGHJKMNPQRSTUVWXYZ0123456789';
        $maxlength = Tools::strlen($chars);
        if ($length > $maxlength) {
            $length = $maxlength;
        }
        $i = 0;
        while ($i < $length) {
            $char = Tools::substr($chars, mt_rand(0, $maxlength - 1), 1);
            if (!strstr($code, $char)) {
                $code .= $char;
                $i++;
            }
        }
        //
        // Check if coupon code alredy exist or not
        $sql = 'SELECT * FROM ' . _DB_PREFIX_ . 'cart_rule where code = "' . pSQL($code) . '"';
        $result = Db::getInstance()->executeS($sql);
        if (count($result) == 0) {
            $sql = 'SELECT * FROM ' . _DB_PREFIX_ . 'wheel_slices';
            $slices = db::getInstance()->executeS($sql);

            $coupon_data = array();
            $prob_arr = array();
            foreach ($slices as $slice) {
                for ($i = 0; $i < $slice['gravity']; $i++) {
                    $prob_arr[] = $slice['slice_no'];
                }
            }

            $key = array_rand($prob_arr);
            $sql = 'select slice_type, slice_label, coupon_value, coupon_type from ' . _DB_PREFIX_ . 'wheel_slices where slice_no=' . pSQL($prob_arr[$key]);
            $query = db::getInstance()->getRow($sql);

            $coupon_data['type'] = $query['slice_type'];
            $coupon_data['label'] = $query['slice_label'];
            $coupon_data['value'] = $query['coupon_value'];
            $coupon_data['coupon_type'] = $query['coupon_type'];
            $coupon_data['slice_no'] = $prob_arr[$key];
            if ($coupon_data['value'] != 0) {
                $coupon_data['code'] = $code;
            } else {
                $coupon_data['code'] = '';
            }
            return $coupon_data;
        }

        return $this->generateCouponCode();
    }

    /*
     * Function to get coupon of customer who entered email in Spin & Win 
     */
    public function sendCouponToCustomer()
    {
        $spin_wheel = array();
        $customer_email = Tools::getValue('email');
        $db_settings = Tools::unserialize(Configuration::get('SPIN_WHEEL'));

        $device = Tools::getValue('wheel_device');
        $coupon_data = $this->generateCouponCode();
        if (isset($coupon_data['code']) && $coupon_data['code'] != "") {
            $spin_wheel['code'] = $coupon_data['code'];
        } else {
            $spin_wheel['code'] = '';
        }
        $spin_wheel['slice_type'] = $coupon_data['type'];
        $spin_wheel['slice_no'] = $coupon_data['slice_no'];
        $spin_wheel['coupon_value'] = $coupon_data['value'];
        $spin_wheel['coupon_type'] = $coupon_data['coupon_type'];
        if ($spin_wheel['coupon_value'] == 0) {
            $coupon_data['suc_msg'] = $this->module->l('Better Luck Next Time!', 'framespinwheel');
        }
        $coupon_data['suc_desc'] = '';
        $spin_wheel['use_type'] = '1';
        $spin_wheel['expire_in_days'] = '1';
        $spin_wheel['currency'] = $this->context->currency->id;
        $spin_wheel['free_shipping'] = '0';
        $country = $this->getCountryFromIp();
        if ($spin_wheel['coupon_value'] != 0) {
            $prefix_syn = $this->module->l('Hurray! you hit a', 'framespinwheel');
            $suff_syn = $this->module->l('discount', 'framespinwheel');

            if ($coupon_data['coupon_type'] == 'Percentage') {
                $coupon_data['suc_msg'] = $prefix_syn .' '. $coupon_data['value'] .'% '. $suff_syn;
            } else {
                $coupon_data['suc_msg'] = $prefix_syn .' '. Tools::displayPrice($coupon_data['value']) .' '. $suff_syn;
            }
            $coupon_data['suc_desc'] = $this->module->l('Use this coupon at checkout:', 'framespinwheel');
            //insert generated coupon in module table
            $sql = 'INSERT INTO ' . _DB_PREFIX_ . 'spin_wheel_coupons
                    SET coupon = "' . pSQL($spin_wheel['code']) . '", 
                    shop_id = ' . (int) $this->context->shop->id . ', 
                    coupon_value="' . pSQL($spin_wheel['coupon_value']) . '", 
                    coupon_value_type="' . pSQL($spin_wheel['coupon_type']) . '", 
                    discount_currency = "' . pSQL($spin_wheel['currency']) . '", 
                    use_type = ' . (int) $spin_wheel['use_type'] . ', 
                    coupon_expire_in_days="' . (int) $spin_wheel['expire_in_days'] . '", 
                    coupon_expire_date="' . pSQL(date('Y-m-d 23:23:59', strtotime($spin_wheel['expire_in_days'] . ' day'))) . '", 
                    date_added = "' . pSQL(date('Y-m-d H:i:s')) . '"';
            Db::getInstance()->execute($sql);
            $new_coupon_id = Db::getInstance()->Insert_ID();
            //insert user details and coupon code
            $sql = 'INSERT INTO ' . _DB_PREFIX_ . 'spin_wheel_user_list
                    SET coupon_id = "' . (int) $new_coupon_id . '", 
                    customer_email = "' . pSQL($customer_email) . '", 
                    coupon_usage="0", 
                    country="' . pSQL($country) . '", 
                    device = "' . pSQL($device) . '", 
                    date_added = "' . pSQL(date('Y-m-d H:i:s')) . '", date_updated = "' . pSQL(date('Y-m-d H:i:s')) . '"';
            Db::getInstance()->execute($sql);

            Configuration::updateGlobalValue('PS_CART_RULE_FEATURE_ACTIVE', '1');
            //Start - Insert coupon in prestashop table

            if ($this->context->customer->isLogged() && $this->context->customer->email == $customer_email) {
                $customer_id = $this->context->customer->id;
            } else {
                $customer_id = 0;
            }

            if ($spin_wheel['coupon_type'] == 'Fixed') {
                $is_used_partial = 1;
                $fixed_reduction = $spin_wheel['coupon_value'];
                $percent_reduction = 0;
            } else {
                $is_used_partial = 0;
                $fixed_reduction = 0;
                $percent_reduction = $spin_wheel['coupon_value'];
            }

            $coupon_name = 'SpinWin';
            $sql = 'INSERT INTO ' . _DB_PREFIX_ . 'cart_rule  SET
                    id_customer = ' . (int) $customer_id . ',
                    date_from = "' . pSQL(date('Y-m-d H:i:s')) . '",
                    date_to = "' . pSQL(date('Y-m-d 23:23:59', strtotime($spin_wheel['expire_in_days'] . ' day'))) . '",
                    description = "' . pSQL(strip_tags($coupon_name)) . '",
                    quantity = 1, quantity_per_user = 1, priority = 1, partial_use = ' . (int) $is_used_partial . ',
                    code = "' . pSQL($spin_wheel['code']) . '", minimum_amount = 0, minimum_amount_tax = 0, 
                    minimum_amount_currency = ' . (int) $spin_wheel['currency'] . ', minimum_amount_shipping = 0,
                    country_restriction = 0, carrier_restriction = 0, group_restriction = 0, cart_rule_restriction = 0, 
                    product_restriction = 0, shop_restriction = 1, 
                    free_shipping = ' . (int) $spin_wheel['free_shipping'] . ',
                    reduction_percent = ' . (int) $percent_reduction . ', reduction_amount = ' . (int) $fixed_reduction . ', 
                    reduction_tax = 1, reduction_currency = ' . (int) $spin_wheel['currency'] . ', 
                    reduction_product = 0, gift_product = 0, gift_product_attribute = 0,
                    highlight = 0, active = 1, 
                    date_add = "' . pSQL(date('Y-m-d H:i:s')) . '", date_upd = "' . pSQL(date('Y-m-d H:i:s')) . '"';

            Db::getInstance()->execute($sql);

            $cart_rule_id = Db::getInstance()->Insert_ID();

            Db::getInstance()->execute('INSERT INTO ' . _DB_PREFIX_ . 'cart_rule_shop
                    set id_cart_rule = ' . (int) $cart_rule_id . ', id_shop = ' . (int) $this->context->shop->id);
             $languages = Language::getLanguages(true);
            foreach ($languages as $lang) {
                Db::getInstance()->execute('INSERT INTO ' . _DB_PREFIX_ . 'cart_rule_lang
                set id_cart_rule = ' . (int) $cart_rule_id . ', id_lang = ' . (int) $lang['id_lang'] . ', 
                name = "' . pSQL(strip_tags($coupon_name)) . '"');
            }
            //End - Insert coupon in prestashop table
        }
        return $coupon_data;
    }

    /*
     * Function to send email to customers
     * 
     * @params  boolean return  True if email is sent otherwise returns false
     */
    public function sendEmail()
    {
        $customer_email = Tools::getValue('email');
        $code = Tools::getValue('code');
        $slice_no = Tools::getValue('slice_no');
        $spin_wheel = array();
        $sql = 'select slice_type, slice_label, coupon_value, coupon_type from ' . _DB_PREFIX_ . 'wheel_slices where slice_no=' . pSQL($slice_no);
        $query = db::getInstance()->getRow($sql);
        $spin_wheel['type'] = $query['slice_type'];
        $spin_wheel['label'] = $query['slice_label'];
        $spin_wheel['coupon_value'] = $query['coupon_value'];
        $spin_wheel['coupon_type'] = $query['coupon_type'];
        if ($spin_wheel['coupon_type'] == 'Fixed') {
            $coupon_value = $spin_wheel['coupon_value'];
            $mail_coupon_value = Tools::displayPrice($coupon_value);
        } else {
            $mail_coupon_value = $spin_wheel['coupon_value'] . '%';
        }

        if (isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] == 'on') {
            $custom_ssl_var = 1;
        }

        if ((bool) Configuration::get('PS_SSL_ENABLED') && $custom_ssl_var == 1) {
            $ps_base_url = _PS_BASE_URL_SSL_;
        } else {
            $ps_base_url = _PS_BASE_URL_;
        }

        $template_vars = array(
            '{amount}' => $mail_coupon_value,
            '{coupon_code}' => $code
        );
        $select_customer_info = 'select firstname, lastname from ' . _DB_PREFIX_ . 'customer
			where email="' . pSQL($customer_email) . '"
			and id_lang=' . (int) $this->context->language->id . ' and id_shop=' . (int) $this->context->shop->id;
        $customer_info = Db::getInstance(_PS_USE_SQL_SLAVE_)->getRow($select_customer_info);
        $customer_name = $customer_info['firstname'] . ' ' . $customer_info['lastname'];
        if (empty($customer_name)) {
            $customer_name = 'Guest';
        }
        $spin_wheel_settings = unserialize(Configuration::get('SPIN_WHEEL'));
        $email_template = $spin_wheel_settings['email_templates'];
        $query = 'SELECT * FROM ' . _DB_PREFIX_ . 'wheel_email WHERE template_name ="' . pSQL($email_template) . '" AND '
                . 'id_lang="' . (int) $this->context->language->id . '" AND id_shop="' . (int) $this->context->shop->id . '"';
        $email_data = Db::getInstance()->getRow($query);
        $email_subject = $email_data['subject'];

        $is_mail_send = Mail::Send(
            $this->context->language->id,
            $email_template,
            Tools::htmlentitiesDecodeUTF8($email_subject),
            $template_vars,
            $customer_email,
            $customer_name,
            Configuration::get('PS_SHOP_EMAIL'),
            Configuration::get('PS_SHOP_NAME'),
            null,
            null,
            _PS_MODULE_DIR_ . 'spinwheel/mails/',
            false,
            $this->context->shop->id
        );
        return $is_mail_send;
    }

    /*
    * Get IP address for current user to fetch countryof that user
    */
    protected function getUserIp()
    {
        if (array_key_exists('HTTP_X_FORWARDED_FOR', $_SERVER) && !empty($_SERVER['HTTP_X_FORWARDED_FOR'])) {
            if (strpos($_SERVER['HTTP_X_FORWARDED_FOR'], ',') > 0) {
                $addr = explode(",", $_SERVER['HTTP_X_FORWARDED_FOR']);
                return trim($addr[0]);
            } else {
                return $_SERVER['HTTP_X_FORWARDED_FOR'];
            }
        } else {
            return $_SERVER['REMOTE_ADDR'];
        }
    }

    /*
    * Get country of current user by fetching IP of that user.
    */
    public function getCountryFromIp()
    {

        $ip = $this->getUserIp();
//        $ip = '182.74.233.130';
        $objIpLocationObject = new \IpLocation_Ip(new \IpLocation_Service_GeoIp());

        $results = $objIpLocationObject->getIpLocation($ip);

        if ($results !== false) {
            return Tools::ucfirst(Tools::strtolower($results->countryName));
        } else {
            $results = 'Unknown Country';
            return $results;
        }
    }

    /*
    * Function to subscribe customer email to Mailchimp
    *
    * @param    string email   Email of customer 
    * @param    string first_name   First name of customer   
    * @param    string last_name   Last name of customer 
    * @return   boolean Return  True if email is subscribed successfully otherwise returns error message 
    */
}
