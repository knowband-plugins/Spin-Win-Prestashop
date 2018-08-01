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

include_once dirname(__FILE__) . '/classes/admin/common.php';

/**
 * The parent class is extending the "Module" core class.
 * So no need to extend "Module" core class here in this class.
 */
class SpinWheel extends CommonWheel
{

    public function __construct()
    {
        $this->name = 'spinwheel';
        $this->tab = 'front_office_features';
        $this->version = '1.0.0';
        $this->author = 'Knowband';
        $this->need_instance = 0;
        $this->module_key = '64708b4cfc3aa007f44226d6b7d30e14';
        $this->ps_versions_compliancy = array('min' => '1.6', 'max' => _PS_VERSION_);
        $this->bootstrap = true;
        parent::__construct(); /* Calling the parent constuctor method */
        $this->displayName = $this->l('Spin and Win Free Version');
        $this->description = $this->l('This module provides a different way to generate coupons by using a wheel game.');
        $this->confirmUninstall = $this->l('Are you sure you want to uninstall?');
        if (!Configuration::get('SPIN_WHEEL')) {
            $this->warning = $this->l('No name provided');
        }
        if (!class_exists('MailChimp')) {
            include_once(dirname(__FILE__) . '/libraries/drewm/mailchimp-api/src/MailChimp.php');
        }
        if (!class_exists('IpLocation_Ip')) {
            require_once(dirname(__FILE__) . '/libraries/ip_location/IpLocation/Ip2.php');
        }
        if (!class_exists('IpLocation_Service_CsvWebhosting')) {
            require_once(dirname(__FILE__) . '/libraries/ip_location/IpLocation/Service/CsvWebhosting.php');
        }
        if (!class_exists('IpLocation_Service_GeoIp')) {
            require_once(dirname(__FILE__) . '/libraries/ip_location/IpLocation/Service/GeoIp.php');
        }
        if (!class_exists('Mobile_Detect')) {
            require_once(_PS_TOOL_DIR_ . 'mobile_Detect/Mobile_Detect.php');
        }
        if (!class_exists('IpLocation_Results')) {
            require_once(dirname(__FILE__) . '/libraries/ip_location/IpLocation/Service/Results.php');
        }
    }

    /*
     * Default prestashop function for installation
     */

    public function install()
    {
        if (Shop::isFeatureActive()) {
            Shop::setContext(Shop::CONTEXT_ALL);
        }
        if (!parent::install() ||
                !$this->registerHook('leftColumn') ||
                !$this->registerHook('header') ||
                !$this->registerHook('displayHeader')
        ) {
            return false;
        }
        $mail_dir = dirname(__FILE__) . '/mails/en';
        if (Context::getContext()->language->iso_code != 'en') {
            $new_dir = dirname(__FILE__) . '/mails/' . Context::getContext()->language->iso_code;
            $this->copyfolder($mail_dir, $new_dir);
        }

        //Create slice table of wheel
        $query = 'CREATE TABLE IF NOT EXISTS `' . _DB_PREFIX_ . 'wheel_slices` (
            `id_slice` int(11) NOT NULL auto_increment,
            `slice_no` int(11) unsigned NOT NULL ,
            `slice_type` ENUM("Win","Loose") NOT NULL,
            `coupon_type` ENUM("Percentage","Fixed") NOT NULL,
            `slice_label` VARCHAR(100) NOT NULL,
            `coupon_value` int(30)unsigned NOT NULL,
            `gravity` int(10) NOT NULL,
            `date_added` DATETIME NULL,
            `date_updated` DATETIME NULL ,    
             PRIMARY KEY (`id_slice`)
              ) CHARACTER SET utf8 COLLATE utf8_general_ci';
        Db::getInstance()->execute($query);

        //Create email templates table
        $query = 'CREATE TABLE IF NOT EXISTS `' . _DB_PREFIX_ . 'wheel_email` (
			`id_template` int(10) NOT NULL auto_increment,
			`id_lang` int(10) NOT NULL,
			`id_shop` INT(11) NOT NULL DEFAULT  "0",
			`iso_code` char(4) NOT NULL,
			`template_name` varchar(255) NOT NULL,
			`text_content` text NOT NULL,
			`subject` varchar(255) NOT NULL,
			`body` text NOT NULL,
			`date_added` DATETIME NULL,
			`date_updated` DATETIME NULL,
			PRIMARY KEY (`id_template`),
			INDEX (  `id_lang` )
			) CHARACTER SET utf8 COLLATE utf8_general_ci';
        Db::getInstance()->execute($query);

        //Create user list who have tried spin wheel
        $query = 'CREATE TABLE IF NOT EXISTS `' . _DB_PREFIX_ . 'spin_wheel_user_list` (
			`id_user_list` int(10) NOT NULL auto_increment,
			`coupon_id` int(10) NOT NULL,
			`customer_email` varchar(100) NOT NULL DEFAULT  "0",
			`coupon_usage` int(10) NOT NULL,
			`country` varchar(50) NOT NULL,
			`device` varchar(50) NOT NULL,
			`date_added` DATETIME NULL,
			`date_updated` DATETIME NULL,
			PRIMARY KEY (`id_user_list`)
			) CHARACTER SET utf8 COLLATE utf8_general_ci';
        Db::getInstance()->execute($query);

        //Create Coupon table, this table will save coupon generated by this plugin
        $create_table = 'CREATE TABLE IF NOT EXISTS `' . _DB_PREFIX_ . 'spin_wheel_coupons` (
                                        `coupon_id` int(11) NOT NULL auto_increment,
                                        `coupon` varchar(50) NOT NULL,
                                        `shop_id` INT( 11 ) NOT NULL DEFAULT  "0",
                                        `coupon_value` varchar(50) NOT NULL,
                                        `coupon_value_type` varchar(20) NOT NULL,
                                        `use_type` TINYINT(1) NOT NULL,
                                        `discount_currency` VARCHAR( 11 ) NOT NULL,
                                        `coupon_expire_in_days` int(2) NOT NULL,
                                        `coupon_expire_date` DATETIME NOT NULL DEFAULT  "0000-00-00 00:00:00",
                                        `date_added` DATETIME NOT NULL DEFAULT  "0000-00-00 00:00:00",
                                        PRIMARY KEY  (`coupon_id`),
                                        INDEX (  `coupon` )
                                        )';
        Db::getInstance()->execute($create_table);

        //Store default email data(language default)
        $sql = 'SELECT COUNT(*) FROM ' . _DB_PREFIX_ . 'wheel_email';
        $res = Db::getInstance(_PS_USE_SQL_SLAVE_)->getRow($sql);
        if (!($res['COUNT(*)'] > 0)) {
            $template_aqua = $this->getDefaultAquaEmail();
            $this->insertEmailDefaultData($template_aqua);
            $template_wind = $this->getDefaultWindEmail();
            $this->insertEmailDefaultData($template_wind);
            $template_void = $this->getDefaultVoidEmail();
            $this->insertEmailDefaultData($template_void);
            $template_earth = $this->getDefaultEarthEmail();
            $this->insertEmailDefaultData($template_earth);
            $template_fire = $this->getDefaultFireEmail();
            $this->insertEmailDefaultData($template_fire);
        }
        $default_settings = $this->getDefaultSettings();
        Configuration::updateValue('SPIN_WHEEL', serialize($default_settings));
        return true;
    }

    /*
     * Function to insert email templates in DB and assigning variables to email templates
     * 
     *  @param    Array template_data    Contains template data which is to be inserted
     *  @param    boolean return    True if email is inserted
     */

    protected function insertEmailDefaultData($template_data)
    {
        foreach (Language::getLanguages(false) as $lang) {
            $template_data['body'] = str_replace('{minimal_img_path}', $this->getModuleDirUrl() . 'spinwheel/views/img/admin/email/minimal6.png', $template_data['body']);
            $template_data['body'] = str_replace('{icon_img_path}', $this->getModuleDirUrl() . 'spinwheel/views/img/admin/email/ICON.png', $template_data['body']);
            $template_data['body'] = str_replace('{fb_img_path}', $this->getModuleDirUrl() . 'spinwheel/views/img/admin/email/FB.png', $template_data['body']);
            $template_data['body'] = str_replace('{tumbler_img_path}', $this->getModuleDirUrl() . 'spinwheel/views/img/admin/email/TUMBLER.png', $template_data['body']);
            $template_data['body'] = str_replace('{pininterest_img_path}', $this->getModuleDirUrl() . 'spinwheel/views/img/admin/email/PINTEREST.png', $template_data['body']);
            $template_data['body'] = str_replace('{twitter_img_path}', $this->getModuleDirUrl() . 'spinwheel/views/img/admin/email/TWITTER.png', $template_data['body']);
            $qry = 'INSERT into ' . _DB_PREFIX_ . 'wheel_email values ("", ' .
                    (int) $lang['id_lang'] . ',
                ' . (int) $this->context->shop->id . ', "' .
                    pSQL($lang['iso_code']) . '",
                "' . pSQL($template_data['name']) . '", "' .
                    pSQL(Tools::htmlentitiesUTF8($template_data['text_content'])) . '",
                "' . pSQL(Tools::htmlentitiesUTF8($template_data['subject'])) . '", "' .
                    pSQL(Tools::htmlentitiesUTF8($template_data['body'])) . '",
                now(), now())';
            $res = Db::getInstance(_PS_USE_SQL_SLAVE_)->execute($qry);
        }
        return true;
    }

    /*
     * Default Prestashop function for uninstallation
     */

    public function uninstall()
    {
        if (!parent::uninstall() ||
                !$this->unregisterHook('displayHeader') ||
                !Configuration::deleteByName('SPIN_WHEEL')
        ) {
            return false;
        }
        return true;
    }

    /*
     * Default Prestashop display hook : display header
     */

    public function hookDisplayHeader()
    {
        if (Module::isInstalled('spinwheel')) {
            $show_wheel = true;
            $every_visit_flag = true;
            $new_visit_flag = true;
            $return_visit_flag = true;
            $all_visitor = true;
            $show_on_page = true;
            $mobile_only = false;
            $display_interval_flag = true;
            $config = Tools::unserialize(Configuration::get('SPIN_WHEEL'));
            //Check if enable
            if ($config['enable'] == 1) {
                //set media
                $sql = 'SELECT * FROM ' . _DB_PREFIX_ . 'wheel_slices';
                $slices = db::getInstance()->executeS($sql);
                $label_name = array();
                foreach ($slices as $slice) {
                    $label_name[] = $slice['slice_label'];
                }
                //Detect device
                $this->mobile_detect = new Mobile_Detect();
                if ($this->mobile_detect->isMobile()) {
                    $mobile_class = 'Mobile';
                } elseif ($this->mobile_detect->isTablet()) {
                    $mobile_class = 'Tablet';
                } else {
                    $mobile_class = 'Desktop';
                }
                //Check pages
                if ($config['where_to_display'] == 2) {
                    $show_page = array();
                    $show_page_fetched = array();
                    $show_page = $config['show_page'];
                    $current_page = $this->context->controller->php_self;
                    foreach ($show_page as $key => $value) {
                        $show_page_fetched[] = $value;
                    }
                    if (in_array($current_page, $show_page_fetched)) {
                        $show_on_page = true;
                    } else {
                        $show_on_page = false;
                    }
                }
                //check country and hide show pop up
                if ($config['geo_location'] == 2) {
                    $select_country = array();
                    $select_country_fetched = array();
                    $select_country = $config['selected_country'];
                    $select_country = implode(',', $select_country);

                    $current_country = $this->getCountryFromIp();
                    $sql = 'SELECT name FROM ' . _DB_PREFIX_ . 'country_lang WHERE id_lang=' . (int) $this->context->language->id . ''
                            . ' AND id_country IN (' . pSQL($select_country) . ')';
                    $select_country_fetched = Db::getInstance()->executeS($sql);
                    $select_country_arr = array();
                    foreach ($select_country_fetched as $key => $value) {
                        $select_country_arr[] = $value['name'];
                    }

                    if (in_array($current_country, $select_country_arr)) {
                        $show_wheel = true;
                    } else {
                        $show_wheel = false;
                    }
                } elseif ($config['geo_location'] == 3) {
                    $unselect_country = array();
                    $unselect_country_fetched = array();
                    $unselect_country = $config['unselected_country'];
                    $unselect_country = implode(',', $unselect_country);
                    $current_country = $this->getCountryFromIp();
                    $sql = 'SELECT name FROM ' . _DB_PREFIX_ . 'country_lang WHERE id_lang=' . (int) $this->context->language->id . ''
                            . ' AND id_country IN (' . pSQL($unselect_country) . ')';
                    $unselect_country_fetched = Db::getInstance()->getRow($sql);
                    $unselect_country_arr = array();
                    foreach ($unselect_country_fetched as $key => $value) {
                        $unselect_country_arr[] = $value['name'];
                    }
                    if (in_array($current_country, $unselect_country_arr)) {
                        $show_wheel = false;
                    } else {
                        $show_wheel = true;
                    }
                }
                if ($config['coupon_display_options'] == 1) {
                    $this->context->smarty->assign('display_option', 1);
                }
                //Check when to display
                if ($config['when_to_display'] == 2) {
                    $time_duration = $config['time_display'];
                    $this->context->smarty->assign('time_display', $time_duration);
                } else {
                    $this->context->smarty->assign('time_display', '');
                }

                if ($config['when_to_display'] == 3) {
                    $scroll_per = $config['scroll_display'];
                    $this->context->smarty->assign('scroll_display', $scroll_per);
                } else {
                    $this->context->smarty->assign('scroll_display', '');
                }

                if ($config['when_to_display'] == 4) {
                    $this->context->smarty->assign('exit_display', true);
                } else {
                    $this->context->smarty->assign('exit_display', false);
                }

                //Set per visit frequency
                if (isset($this->context->cookie->first_visit_cookie) && $this->context->cookie->first_visit_cookie == 1) {
                    if (isset($config['max_display_freq'])) {
                        if ($config['max_display_freq'] == 2) {  //hour
                            if (!isset($this->context->cookie->visit_cookie)) {
                                $this->context->cookie->__set('visit_cookie', 1);
                                $this->context->cookie->setExpire(time() + 3600);
                            }
                        } elseif ($config['max_display_freq'] == 3) {  //day
                            if (!isset($this->context->cookie->visit_cookie)) {
                                $this->context->cookie->__set('visit_cookie', 2);
                                $this->context->cookie->setExpire(time() + 86400);
                            }
                        } elseif ($config['max_display_freq'] == 4) {  //week
                            if (!isset($this->context->cookie->visit_cookie)) {
                                $this->context->cookie->__set('visit_cookie', 3);
                                $this->context->cookie->setExpire(time() + 86400 * 7);
                            }
                        } elseif ($config['max_display_freq'] == 5) {  //month
                            if (!isset($this->context->cookie->visit_cookie)) {
                                $this->context->cookie->__set('visit_cookie', 4);
                                $this->context->cookie->setExpire(time() + 86400 * 30);
                            }
                        } else {
                            $every_visit_flag = false;
                        }
                    }
                }

                //Check visit is first
                if (!isset($this->context->cookie->first_visit_cookie)) {
                    $this->context->cookie->__set('first_visit_cookie', 1);
                }
                //Check who to show
                if ($config['who_to_show'] == 2) {
                    if (!isset($this->context->cookie->new_visitor_cookie)) {
                        $this->context->cookie->__set('new_visitor_cookie', 1);
                        $this->context->cookie->setExpire(time() + 86400 * 30);
                        $new_visit_flag = true;
                    } else {
                        $new_visit_flag = false;
                    }
                } elseif ($config['who_to_show'] == 3) {
                    if (isset($this->context->cookie->new_visitor_cookie) && $this->context->cookie->new_visitor_cookie == 1) {
                        $return_visit_flag = true;
                    } else {
                        $this->context->cookie->__set('new_visitor_cookie', 1);
                        $this->context->cookie->setExpire(time() + 86400 * 30);
                        $return_visit_flag = false;
                    }
                }

                //Hide After
                if ($config['hide_after'] == 2) {
                    $this->context->smarty->assign('hide_after', 10);
                } elseif ($config['hide_after'] == 3) {
                    $this->context->smarty->assign('hide_after', 20);
                } elseif ($config['hide_after'] == 4) {
                    $this->context->smarty->assign('hide_after', 30);
                } elseif ($config['hide_after'] == 5) {
                    $this->context->smarty->assign('hide_after', 60);
                } else {
                    $this->context->smarty->assign('hide_after', '');
                }

                //Minimum Screen Size
                if ($config['min_screen_size'] != 6) {
                    $this->context->smarty->assign('min_screen_size', $config['min_screen_size']);
                } else {
                    if ($mobile_class == 'Mobile') {
                        $mobile_only = false;
                    } else {
                        $mobile_only = true;
                    }
                }
                $this->context->smarty->assign(array(
                    'spin_button_color' => $config['background_color_spin'],
                    'cancel_button_color' => $config['background_color_cancel'],
                    'show_popup' => $config['show_popup'],
                    'email_recheck' => $config['email_recheck'],
                    'wheel_device' => $mobile_class,
                    'custom_css' => $config['custom_css'],
                    'custom_js' => $config['custom_js'],
                ));

                if ($config['display_image'] == 1) {
                    if (isset($config['image_path'])) {
                        if (strpos($config['image_path'], 'show.jpg') == false) {
                            $this->context->smarty->assign('front_image_path', $config['image_path']);
                        }
                    }
                }
                $custom_ssl_var = 0;
                if (isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] == 'on') {
                    $custom_ssl_var = 1;
                }
                if ((bool) Configuration::get('PS_SSL_ENABLED') && $custom_ssl_var == 1) {
                    $ps_base_url = _PS_BASE_URL_SSL_;
                } else {
                    $ps_base_url = _PS_BASE_URL_;
                }
                $this->context->smarty->assign('rootDirectory', _PS_MODULE_DIR_ . 'spinwheel');
                $this->context->smarty->assign('spinwheel_base_url', $ps_base_url . __PS_BASE_URI__);
                $link = $this->context->link->getModuleLink(
                    'spinwheel',
                    'framespinwheel'
                );
                $this->context->smarty->assign('spin_wheel_front_path', $link);
                $path = $this->_path;
                $this->context->smarty->assign('path', $path);
                $this->context->smarty->assign('label_name', $label_name);
                //active/expire date
                $current_client_time = strtotime(date('Y-m-d H:i:s'));
                if (($config["fix_time"] == 0) || ($config["fix_time"] == 1 && $current_client_time >= strtotime($config["active_date"]) && $current_client_time <= strtotime($config["expire_date"]))) {
                    if ($show_wheel == true && (!isset($this->context->cookie->visit_cookie) || $every_visit_flag == false) && $new_visit_flag == true && $return_visit_flag == true && $all_visitor == true && $show_on_page == true && $mobile_only == false) {
                        if (isset($config['display_interval']) && $config['display_interval'] != 0) {
                            $days = $config['display_interval'];
                            if (!isset($this->context->cookie->display_interval_wheel)) {
                                $this->context->cookie->__set('display_interval_wheel', '1');
                                $this->context->cookie->setExpire(time() + 86400 * $days);
                            } else {
                                $display_interval_flag = false;
                            }
                        }
                        if ($display_interval_flag) {
                            $this->setFrontMedia();
                            if ($config['when_to_display'] == 4) {
                                $this->context->controller->addJs($this->getModuleDirUrl() . 'spinwheel/views/js/front/ouibounce.js');
                            }
                            return $this->display(__FILE__, 'views/templates/hook/spin_wheel.tpl');
                        }
                    }
                }
            }
        }
    }

    /*
     * Add Media in Front (CSS & JS)
     */

    public function setFrontMedia()
    {
        $this->context->controller->addCSS($this->getModuleDirUrl() . 'spinwheel/views/css/front/spin_wheel.css');
        $this->context->controller->addCSS('https://fonts.googleapis.com/css?family=Baloo+Bhaijaan|Merriweather|Roboto');
        $this->context->controller->addJs($this->getModuleDirUrl() . 'spinwheel/views/js/front/velsof_wheel.js');
        $this->context->controller->addJs($this->getModuleDirUrl() . 'spinwheel/views/js/front/spin_wheel.js');
        $this->context->controller->addJs($this->getModuleDirUrl() . 'spinwheel/views/js/velovalidation.js');
        $this->context->controller->addJs($this->getModuleDirUrl() . 'spinwheel/views/js/front/tooltipster.js');
        $this->context->controller->addCSS($this->getModuleDirUrl() . 'spinwheel/views/css/front/tooltipster.css');
    }

    /*
     * Function to fetch front controller link
     */

    public function getFrontControllerPath()
    {
        $front_controller_path = $this->context->link->getModuleLink(
            $this->name,
            'framespinwheel'
        );
        return $front_controller_path;
    }

    /*
     * Default main prestashop function
     */

    public function getContent()
    {
        $output = null;
        $this->setKbMedia();  //Add Media
        //get pages
        $controllers_name = $this->getControllers();
        $controllers = $controllers_name;
        //Check for ajax
        if (Tools::isSubmit('ajax')) {
            $this->ajaxProcess(Tools::getValue('method'));
        }
        //For image default path
        $form_value = Tools::unserialize(Configuration::get('SPIN_WHEEL'));
        $my_image = 'show.jpg';
        $default_image_path = $this->getModuleDirUrl() . 'spinwheel/views/img/admin/uploads/' . $my_image;
        if (isset($form_value['image_path']) && $form_value['image_path'] != '') {
            $display_image_path = $form_value['image_path'];
        } else {
            $display_image_path = $default_image_path;
        }
        if ((strpos($display_image_path, 'show.jpg') == false)) {
            $this->context->smarty->assign('imageexist', true);
        } else {
            $this->context->smarty->assign('imageexist', false);
        }
        $this->context->smarty->assign('display_image_path', $display_image_path);
        $this->context->smarty->assign('test_email_loader', $this->getModuleDirUrl() . 'spinwheel/views/img/admin/show_loader.gif');
        $formvalue = array();
        if (!isset($formvalue['display_interval'])) {
            $formvalue['display_interval'] = 0;
        }
        //Check if form is submitted or not
        if (Tools::isSubmit('submit' . $this->name)) {
            $formvalue = Tools::getvalue('spin_wheel');
            $languages = Language::getLanguages(true); //Getting languages
            $error_count = 0;

            if ($formvalue['fix_time'] == 1) {
                if (empty($formvalue['active_date']) || empty($formvalue['active_date'])) {
                    $output .= $this->displayError($this->l('Please provide active & expire date.'));
                    $error_count++;
                }
            }

            if ($formvalue['when_to_display'] == 2) {
                if (empty($formvalue['time_display'])) {
                    $output .= $this->displayError($this->l('Please provide time in seconds.'));
                    $error_count++;
                }
            }
            if ($formvalue['when_to_display'] == 3) {
                if (empty($formvalue['scroll_display'])) {
                    $output .= $this->displayError($this->l('Please provide scroll percentage.'));
                    $error_count++;
                }
            }

            foreach ($languages as $lang) {
                if (empty(Tools::getValue('spin_wheel_email_subject_' . $lang['id_lang'])) || empty(Tools::getValue('spin_wheel_email_content_' . $lang['id_lang']))) {
                    $output .= $this->displayError($this->l('Please enter the subject for email for all languages.'));
                } else {
                    $email_subject = Tools::getValue(
                        'spin_wheel_email_subject_' . $lang['id_lang']
                    );
                    $email_content = Tools::getValue(
                        'spin_wheel_email_content_' . $lang['id_lang']
                    );
                    $template_data = array();
                    $template_data['template_lang'] = $lang['id_lang'];
                    $template_data['name'] = $formvalue['email_templates'];
                    $result = $this->getEmailData($template_data);
                    if (!empty($result)) {
                        $template_data['name'] = $formvalue['email_templates'];
                        $template_data['subject'] = $email_subject;
                        $template_data['template_lang'] = $lang['id_lang'];
                        $template_data['body'] = $email_content;
                        $this->updateEmailTemplate($template_data);
                    } else {
                        $template_data['name'] = $formvalue['email_templates'];
                        $template_data['subject'] = $email_subject;
                        $template_data['text_content'] = '';
                        $template_data['template_lang'] = $lang['id_lang'];
                        $template_data['body'] = $email_content;
                        $this->insertEmailDefaultData($template_data);
                    }
                }
            }
            //Upload image
            if ($_FILES['spin_wheel']['name']['logo'] != null || !empty($_FILES['spin_wheel']['name']['logo'])) {
                $image_name = $_FILES['spin_wheel']['name']['logo'];
                $image_size = $_FILES['spin_wheel']['size']['logo'];
                $image_tmp = $_FILES['spin_wheel']['tmp_name']['logo'];
                $formvalue['image_name'] = $image_name;
                $formvalue['image_size'] = $image_size;
                $formvalue['image_tmp_name'] = $image_tmp;
                $x = explode('.', $image_name);
                $image_name = $x[0] . '_' . time();
                $image_ext = Tools::strtolower(end($x));
                $expensions = array("jpeg", "jpg", "png", "gif");
                $prev_img = isset($form_value['logo']) ? $form_value['logo'] : '';
                $formvalue['logo'] = $image_name . '.' . $image_ext;
                $image_new_name = $formvalue['logo'];
                $image_path = _PS_BASE_URL_SSL_ . __PS_BASE_URI__ . 'modules/' . $this->name . '/views/img/admin/uploads/';
                $formvalue['image_path'] = $this->getModuleDirUrl() . 'spinwheel/views/img/admin/uploads/' . $image_new_name;
                $display_image_path = $formvalue['image_path'];
                $allowedTypes = array('image/png', 'image/jpeg', 'image/gif');
                $detectedType = mime_content_type($_FILES['spin_wheel']['tmp_name']['logo']);
                if (in_array($detectedType, $allowedTypes) === false) {
                    $output .= $this->displayError(
                        $this->l('Please choose image in jpeg,jpg,gif or png file.')
                    );
                    $error_count++;
                }

                if (in_array($image_ext, $expensions) === false) {
                    $output .= $this->displayError(
                        $this->l('Please choose image in jpeg,jpg,gif or png file.')
                    );
                    $error_count++;
                }

                if ($image_size >= 4194304) {
                    $output .= $this->displayError($this->l('File size must be less than 4 MB.'));
                    $error_count++;
                }
            }
            //If error is zero then update values
            if ($error_count == 0) {
                if (!isset($formvalue['image_path'])) {
                    $form_value = Tools::unserialize(Configuration::get('SPIN_WHEEL'));
                    if (!isset($form_value['image_path'])) {
                        $my_image = 'show.jpg';
                        $default_image_path = $this->getModuleDirUrl() . 'spinwheel/views/img/admin/uploads/' . $my_image;
                        $formvalue['image_path'] = $default_image_path;
                    } else {
                        $formvalue['image_path'] = $form_value['image_path'];
                    }
                }

                if ((strpos($formvalue['image_path'], 'show.jpg') == false)) {
                    $this->context->smarty->assign('imageexist', true);
                } else {
                    $this->context->smarty->assign('imageexist', false);
                }
                $formvalue['background_color_spin'] = '#000000';
                $formvalue['background_color_cancel'] = '#ffffff';
                $formvalue['active_date'] = '';
                $formvalue['expire_date'] = '';
                $formvalue['fix_time'] = 0;
                $formvalue['when_to_display'] = '4';
                $formvalue['where_to_display'] = '2';
                $formvalue['show_page'] = array('index');
                $formvalue['custom_js'] = '';
                $formvalue['custom_css'] = '';
                $formvalue['show_popup'] = 0;
                $formvalue['email_recheck'] = 0;
                $formvalue['display_interval'] = 0;
                $formvalue['background_color_spin'] = '#000000';
                $formvalue['background_color_cancel'] = '#ffffff';
                $formvalue['coupon_display_options'] = '1';
                $formvalue['hide_after'] = '1';
                $formvalue['who_to_show'] = '1';
                $formvalue['geo_location'] = '1';
                $formvalue['max_display_freq'] = '1';

                Configuration::updateValue('SPIN_WHEEL', serialize($formvalue));
                $display_image_path = $formvalue['image_path'];
                $this->context->smarty->assign('display_image_path', $display_image_path);
                if ($_FILES['spin_wheel']['name']['logo'] != null) {
                    $image_path = _PS_MODULE_DIR_ . $this->name . '/views/img/admin/uploads/';
                    if (isset($prev_img) && $prev_img != '') {
                        $mask = _PS_MODULE_DIR_ . $this->name . '/views/img/admin/uploads/' . $prev_img;
                        array_map('unlink', glob($mask));
                    }

                    move_uploaded_file($image_tmp, $image_path . $image_new_name);
                }
                $output .= $this->displayConfirmation($this->l('Settings updated'));
            }
        }

        //Forms
        $temp_options = array(
            array(
                'id_temp' => 'Fire',
                'name' => $this->l('Fire'),
            ),
            array(
                'id_temp' => 'Aqua',
                'name' => $this->l('Aqua'),
            ),
            array(
                'id_temp' => 'Wind',
                'name' => $this->l('Wind'),
            ),
            array(
                'id_temp' => 'Void',
                'name' => $this->l('Void'),
            ),
            array(
                'id_temp' => 'Earth',
                'name' => $this->l('Earth'),
            ),
        );

        $screen_size = array(
            array(
                'id_size' => '320_480',
                'name' => $this->l('Smartphone (320x480)'),
            ),
        );

        $display_freq = array(
            array(
                'id_freq' => '1',
                'name' => $this->l('Every Visit'),
            ),
        );

        $hide_after = array(
            array(
                'id_hide' => '1',
                'name' => $this->l('Always Display'),
            ),
        );

        $where_to_display = array(
            array(
                'id_wheredisplay' => '2',
                'name' => $this->l('Shown on selected pages'),
            ),
        );
        $who_to_show = array(
            array(
                'id_show' => '1',
                'name' => $this->l('All Vistors'),
            ),
        );
        $when_to_display = array(
            array(
                'id_whendisplay' => '4',
                'name' => $this->l('When Exit'),
            ),
        );
        $geo_location = array(
            array(
                'id_geo' => '1',
                'name' => $this->l('World Wide'),
            ),
        );
        $chimp_options = array();
        $chimp_options[] = array(
            'id_hide' => '',
            'name' => ''
        );
        $klav_options = array();
        $klav_options[] = array(
            'id_hide' => '',
            'name' => ''
        );
        $sql = 'SELECT cl.name, cl.id_country FROM ' . _DB_PREFIX_ . 'country_lang cl INNER JOIN ' . _DB_PREFIX_ . 'country c ON cl.id_country = c.id_country AND cl.id_lang=' . (int) $this->context->language->id;
        $spin_country_data = db::getInstance()->executeS($sql);
        $spin_country = array();
        $selected_country = array();
        $unselected_country = array();
        foreach ($spin_country_data as $country_spin) {
            $selected_country[] = array(
                'id_con' => $country_spin['id_country'],
                'name' => $country_spin['name'],
            );
            $unselected_country[] = array(
                'id_uncon' => $country_spin['id_country'],
                'name' => $country_spin['name'],
            );
        }
        $this->context->smarty->assign('show_toolbar', false);
        $front_pages = array();
        if (empty($controllers)) {
            $front_pages[] = array(
                'id_page_type' => ' ',
                'name' => '',
            );
        } else {
            foreach ($controllers as $key => $value) {
                $front_pages[] = array(
                    'id_page_type' => $key,
                    'name' => $value,
                );
            }
        }
        $coupon_display = array(
            array(
                'id_coupon_display' => '1',
                'name' => $this->l('Only on wheel'),
            ),
        );
        $this->fields_form = array(
            'form' => array(
                'legend' => array(
                    'title' => $this->l('General Settings'),
                ),
                'input' => array(
                    array(
                        'label' => $this->l('Enable/Disable'),
                        'type' => 'switch',
                        'hint' => $this->l('Enable/Disable this plugin'),
                        'class' => 'optn_enable_disable',
                        'name' => 'spin_wheel[enable]',
                        'is_bool' => true,
                        'values' => array(
                            array(
                                'value' => 1,
                            ),
                            array(
                                'value' => 0,
                            ),
                        ),
                    ),
                    array(
                        'label' => $this->l('Show pull-out tab'),
                        'type' => 'hidden',
                        'value' => 0,
                        'hint' => $this->l('Allow customer to hide/show popup'),
                        'class' => 'optn_show_popup',
                        'name' => 'spin_wheel[show_popup]',
                        'is_bool' => true,
                        'values' => array(
                            array(
                                'value' => 1,
                            ),
                            array(
                                'value' => 0,
                            ),
                        ),
                    ),
                    array(
                        'label' => $this->l('Email Recheck'),
                        'type' => 'hidden',
                        'value' => 0,
                        'hint' => $this->l('Allow customer to provide coupon code more than one time.'),
                        'class' => 'optn_email_recheck',
                        'name' => 'spin_wheel[email_recheck]',
                        'is_bool' => true,
                        'values' => array(
                            array(
                                'value' => 1,
                            ),
                            array(
                                'value' => 0,
                            ),
                        ),
                    ),
                    array(
                        'type' => 'hidden',
                        'label' => $this->l('Wheel Display Interval'),
                        'name' => 'spin_wheel[display_interval]',
                        'hint' => $this->l('Enter the display interval(in days) after after which pop will be show.'),
                        'desc' => $this->l('Please enter display interval in days.'),
                        'col' => 2,
                    ),
                    array(
                        'type' => 'hidden',
                        'label' => $this->l('Custom CSS'),
                        'hint' => $this->l('Add custom css.Do not add style tags.'),
                        'name' => 'spin_wheel[custom_css]',
                        'required' => false,
                        'cols' => '9',
                        'rows' => '5',
                        'desc' => $this->l('Please do not add style tags.')
                    ),
                    array(
                        'type' => 'hidden',
                        'label' => $this->l('Custom JS'),
                        'hint' => $this->l('Add custom JS.Do not add script tags.'),
                        'name' => 'spin_wheel[custom_js]',
                        'required' => false,
                        'cols' => '9',
                        'rows' => '5',
                        'desc' => $this->l('Please do not add script tags.')
                    ),
                    array(
                        'label' => $this->l('Minimum Screen Size'),
                        'type' => 'select',
                        'hint' => $this->l('Select minimum screen size'),
                        'name' => 'spin_wheel[min_screen_size]',
                        'is_bool' => true,
                        'options' => array(
                            'query' => $screen_size,
                            'id' => 'id_size',
                            'name' => 'name',
                        ),
                    ),
                    array(
                        'label' => $this->l('Maximum Display Frequency'),
                        'type' => 'select',
                        'name' => 'spin_wheel[max_display_freq]',
                        'hint' => $this->l('Select maximum display frequency.'),
                        'is_bool' => true,
                        'options' => array(
                            'query' => $display_freq,
                            'id' => 'id_freq',
                            'name' => 'name',
                        ),
                    ),
                    array(
                        'label' => $this->l('Hide After'),
                        'type' => 'select',
                        'name' => 'spin_wheel[hide_after]',
                        'hint' => $this->l('Select time after which pop up should hide.'),
                        'is_bool' => true,
                        'options' => array(
                            'query' => $hide_after,
                            'id' => 'id_hide',
                            'name' => 'name',
                        ),
                    ),
                    array(
                        'label' => $this->l('Set Fix Time'),
                        'type' => 'switch',
                        'hint' => $this->l('Allow customer to win coupons for defined time.'),
                        'class' => 'optn_allow_date',
                        'name' => 'spin_wheel[fix_time]',
                        'is_bool' => true,
                        'values' => array(
                            array(
                                'value' => 1,
                            ),
                            array(
                                'value' => 0,
                            ),
                        ),
                    ),
                    array(
                        'type' => 'datetime',
                        'label' => $this->l('Active Date/Time'),
                        'name' => 'spin_wheel[active_date]',
                        'size' => 5,
                        'required' => false,
                        'hint' => $this->l('Active time of wheel game'),
                    ),
                    array(
                        'type' => 'datetime',
                        'label' => $this->l('Expire Date/Time'),
                        'name' => 'spin_wheel[expire_date]',
                        'size' => 5,
                        'required' => false,
                        'hint' => $this->l('Expire time of wheel game'),
                    ),
                    array(
                        'label' => $this->l('Where to Display'),
                        'type' => 'select',
                        'name' => 'spin_wheel[where_to_display]',
                        'hint' => $this->l('Select where to display pop up.'),
                        'is_bool' => true,
                        'options' => array(
                            'query' => $where_to_display,
                            'id' => 'id_wheredisplay',
                            'name' => 'name',
                        ),
                    ),
                    array(
                        'type' => 'select',
                        'multiple' => true,
                        'label' => $this->l('Select the Page'),
                        'name' => 'spin_wheel[show_page][]',
                        'hint' => $this->l('Select the Pages to display spin wheel pop up.'),
                        'is_bool' => true,
                        'options' => array(
                            'query' => $front_pages,
                            'id' => 'id_page_type',
                            'name' => 'name',
                        ),
                        'required' => true,
                    ),
                    array(
                        'type' => 'select',
                        'multiple' => true,
                        'label' => $this->l('Select the Page'),
                        'name' => 'spin_wheel[not_show_page][]',
                        'hint' => $this->l('Select the Pages  not to display spin wheel pop up.'),
                        'is_bool' => true,
                        'options' => array(
                            'query' => $front_pages,
                            'id' => 'id_page_type',
                            'name' => 'name',
                        ),
                        'required' => true,
                    ),
                    array(
                        'label' => $this->l('Who to show'),
                        'type' => 'select',
                        'name' => 'spin_wheel[who_to_show]',
                        'hint' => $this->l('Select who to show this pop up.'),
                        'is_bool' => true,
                        'options' => array(
                            'query' => $who_to_show,
                            'id' => 'id_show',
                            'name' => 'name',
                        ),
                    ),
                    array(
                        'label' => $this->l('When to Display'),
                        'type' => 'select',
                        'name' => 'spin_wheel[when_to_display]',
                        'hint' => $this->l('Select when to display this pop up.'),
                        'is_bool' => true,
                        'options' => array(
                            'query' => $when_to_display,
                            'id' => 'id_whendisplay',
                            'name' => 'name',
                        ),
                    ),
                    array(
                        'type' => 'text',
                        'label' => $this->l('Enter Time(in seconds)'),
                        'name' => 'spin_wheel[time_display]',
                        'hint' => $this->l('Enter time in seconds after which you want to display spin wheel pop up.'),
                    ),
                    array(
                        'type' => 'text',
                        'label' => $this->l('Enter Scroll Percentage'),
                        'name' => 'spin_wheel[scroll_display]',
                        'hint' => $this->l('Enter scroll percentage after which you want to display spin wheel pop up.'),
                        'desc' => $this->l('Do not enter percentage sign.')
                    ),
                    array(
                        'label' => $this->l('GEO Location'),
                        'type' => 'select',
                        'name' => 'spin_wheel[geo_location]',
                        'hint' => $this->l('Select GEO location in which you want to show this pop up.'),
                        'is_bool' => true,
                        'options' => array(
                            'query' => $geo_location,
                            'id' => 'id_geo',
                            'name' => 'name',
                        ),
                    ),
                    array(
                        'type' => 'select',
                        'multiple' => true,
                        'name' => 'spin_wheel[selected_country][]',
                        'is_bool' => true,
                        'options' => array(
                            'query' => $selected_country,
                            'id' => 'id_con',
                            'name' => 'name',
                        ),
                        'col' => '4',
                    ),
                    array(
                        'type' => 'select',
                        'multiple' => true,
                        'name' => 'spin_wheel[unselected_country][]',
                        'is_bool' => true,
                        'options' => array(
                            'query' => $unselected_country,
                            'id' => 'id_uncon',
                            'name' => 'name',
                        ),
                    ),
                    array(
                        'type' => 'hidden',
                        'label' => $this->l('Coupon Display Options'),
                        'name' => 'spin_wheel[coupon_display_options]',
                        'hint' => $this->l('Select coupon display options.'),
                        'is_bool' => true,
                        'options' => array(
                            'query' => $coupon_display,
                            'id' => 'id_coupon_display',
                            'name' => 'name',
                        ),
                    ),
                    array(
                        'label' => $this->l('Email Subject'),
                        'type' => 'text',
                        'lang' => true,
                        'hint' => $this->l('Subject of email which will be sent to customers.'),
                        'class' => 'optn_email_subject',
                        'name' => 'spin_wheel_email_subject',
                        'required' => true,
                    ),
                    array(
                        'label' => $this->l('Email Templates'),
                        'type' => 'select',
                        'class' => 'optn_email_templates',
                        'name' => 'spin_wheel[email_templates]',
                        'is_bool' => true,
                        'options' => array(
                            'query' => $temp_options,
                            'id' => 'id_temp',
                            'name' => 'name',
                        ),
                    ),
                    array(
                        'type' => 'textarea',
                        'label' => $this->l('Email Content'),
                        'hint' => $this->l('Content of selected email templates'),
                        'name' => 'spin_wheel_email_content',
                        'id' => 'optn_email_content',
                        'required' => true,
                        'cols' => '9',
                        'rows' => '20',
                        'class' => 'col-lg-9',
                        'lang' => true,
                        'autoload_rte' => true
                    ),
                    array(
                        'label' => $this->l('Test Email'),
                        'type' => 'text',
                        'hint' => $this->l('This is used to test email.'),
                        'class' => 'optn_test_email',
                        'name' => 'spin_wheel[test_email]',
                        'size' => 50,
                        'col' => 7,
                    ),
                    array(
                        'type' => 'html',
                        'name' => '',
                        'html_content' => $this->context->smarty->fetch(_PS_MODULE_DIR_ . 'spinwheel/views/templates/admin/testEmail.tpl'),
                    ),
                    array(
                        'label' => $this->l('Display Image'),
                        'type' => 'switch',
                        'hint' => $this->l('Allow Logo on wheel.'),
                        'class' => 'optn_allow_date',
                        'name' => 'spin_wheel[display_image]',
                        'is_bool' => true,
                        'values' => array(
                            array(
                                'value' => 1,
                            ),
                            array(
                                'value' => 0,
                            ),
                        ),
                    ),
                    array(
                        'type' => 'file',
                        'label' => $this->l('Logo'),
                        'name' => 'spin_wheel[logo]',
                        'id' => 'velsof_spin_wheel_image',
                        'required' => false,
                        'display_image' => true,
                        'class' => 'optn_upload_logo',
                        'desc' => $this->l('Only .png or .jpg file format accepted.'),
                        'hint' => $this->l('This image will be display on the top of pop up.'),
                        'image' => $this->context->smarty->fetch(_PS_MODULE_DIR_ . 'spinwheel/views/templates/admin/showImg.tpl'),
                    ),
                    array(
                        'label' => $this->l('Button Background Color'),
                        'type' => 'hidden',
                        'hint' => $this->l('Change background color of spin button.'),
                        'name' => 'spin_wheel[background_color_spin]',
                        'size' => 50,
                        'required' => true
                    ),
                    array(
                        'label' => $this->l('No, I do not feel lucky text color'),
                        'type' => 'hidden',
                        'hint' => $this->l('Change font color of No, I do not feel lucky text.'),
                        'name' => 'spin_wheel[background_color_cancel]',
                        'size' => 50,
                        'required' => true
                    ),
                    array(
                        'type' => 'date',
                        'name' => 'spin_wheel[from_date]',
                        'label' => $this->l('From'),
                        'id' => 'from_date',
                    ),
                    array(
                        'type' => 'date',
                        'name' => 'spin_wheel[to_date]',
                        'label' => $this->l('To'),
                        'id' => 'to_date',
                    ),
                ),
                'submit' => array(
                    'title' => $this->l('Save'),
                    'id' => 'velsof_spin_wheel_submit',
                    'class' => 'btn btn-default pull-right btn_save_wheel velovalidation_spin_wheel',
                ),
            ),
        );
        //Fetching values from database
        $form_value = Tools::unserialize(Configuration::get('SPIN_WHEEL'));
        //Set default value
        $field_value = array(
            'spin_wheel[enable]' => $form_value['enable'],
            'spin_wheel[show_popup]' => 0,
            'spin_wheel[email_recheck]' => 0,
            'spin_wheel[custom_css]' => $form_value['custom_css'],
            'spin_wheel[custom_js]' => $form_value['custom_js'],
            'spin_wheel[min_screen_size]' => $form_value['min_screen_size'],
            'spin_wheel[max_display_freq]' => $form_value['max_display_freq'],
            'spin_wheel[hide_after]' => $form_value['hide_after'],
            'spin_wheel[where_to_display]' => $form_value['where_to_display'],
            'spin_wheel[who_to_show]' => $form_value['who_to_show'],
            'spin_wheel[when_to_display]' => $form_value['when_to_display'],
            'spin_wheel[geo_location]' => $form_value['geo_location'],
            'spin_wheel[active_date]' => $form_value['active_date'],
            'spin_wheel[expire_date]' => $form_value['expire_date'],
            'spin_wheel[background_color_spin]' => '#000000',
            'spin_wheel[background_color_cancel]' => '#ffffff',
            'spin_wheel[email_templates]' => $form_value['email_templates'],
            'spin_wheel[fix_time]' => $form_value['fix_time'],
            'spin_wheel[time_display]' => $form_value['time_display'],
            'spin_wheel[scroll_display]' => $form_value['scroll_display'],
            'spin_wheel[to_date]' => $form_value['to_date'],
            'spin_wheel[from_date]' => $form_value['from_date'],
            'spin_wheel[test_email]' => $form_value['test_email'],
            'spin_wheel[display_interval]' => $form_value['display_interval'],
            'spin_wheel[display_image]' => isset($form_value['display_image']) ? $form_value['display_image'] : 0,
            'spin_wheel[coupon_display_options]' => $form_value['coupon_display_options']
        );

        $email_marketing_values = array();
        if (!isset($form_value['selected_country'])) {
            $field_value['spin_wheel[selected_country][]'] = array();
        } else {
            $field_value['spin_wheel[selected_country][]'] = $form_value['selected_country'];
        }
        if (!isset($form_value['unselected_country'])) {
            $field_value['spin_wheel[unselected_country][]'] = array();
        } else {
            $field_value['spin_wheel[unselected_country][]'] = $form_value['unselected_country'];
        }

        if (!isset($form_value['show_page'])) {
            $field_value['spin_wheel[show_page][]'] = array();
        } else {
            $field_value['spin_wheel[show_page][]'] = $form_value['show_page'];
        }
        if (!isset($form_value['not_show_page'])) {
            $field_value['spin_wheel[not_show_page][]'] = array();
        } else {
            $field_value['spin_wheel[not_show_page][]'] = $form_value['not_show_page'];
        }
        $custom_ssl_var = 0;
        if (isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] == 'on') {
            $custom_ssl_var = 1;
        }
        if ((bool) Configuration::get('PS_SSL_ENABLED') && $custom_ssl_var == 1) {
            $ps_base_url = _PS_BASE_URL_SSL_;
        } else {
            $ps_base_url = _PS_BASE_URL_;
        }
        $this->context->smarty->assign('spinwheel_base_url', $ps_base_url . __PS_BASE_URI__);
        $languages = Language::getLanguages(true);
        foreach ($languages as $lang) {
            $template_name = $form_value['email_templates'];

            $fetch_template_query = 'select * from ' . _DB_PREFIX_ . 'wheel_email where id_lang=' . (int) $lang['id_lang'] .
                    ' and id_shop=' . (int) $this->context->shop->id . ' and template_name="' . pSQL($template_name) . '"';
            $template_data = Db::getInstance(_PS_USE_SQL_SLAVE_)->getRow($fetch_template_query);
            $template_data['body'] = Tools::htmlentitiesDecodeUTF8($template_data['body']);
            if (!empty($template_data['subject'])) {
                $field_value['spin_wheel_email_subject'][$lang['id_lang']] = $template_data['subject'];
            } else {
                $field_value['spin_wheel_email_subject'][$lang['id_lang']] = "Win Exclusive Prizes";
            }
            if (!empty($template_data['body'])) {
                $field_value['spin_wheel_email_content'][$lang['id_lang']] = $template_data['body'];
            } else {
                $template_fire = $this->getDefaultFireEmail();
                $field_value['spin_wheel_email_content'][$lang['id_lang']] = $template_fire['body'];
            }
        }
        //To pass is_Default parameter
        foreach ($languages as $k => $language) {
            $languages[$k]['is_default'] = ((int) ($language['id_lang'] == $this->context->language->id));
        }
        //To show available tabs
        $this->available_tabs_lang = array(
            'General_Settings' => $this->l('General Settings'),
            'Look_Feel_Settings' => $this->l('Look and Feel Settings'),
            'Slice_Settings' => $this->l('Slice Settings'),
        );

        $this->available_tabs = array('General_Settings', 'Look_Feel_Settings', 'Slice_Settings');

        $this->tab_display = 'General_Settings';
        $product_tabs = array();

        foreach ($this->available_tabs as $product_tab) {
            $product_tabs[$product_tab] = array(
                'id' => $product_tab,
                'selected' => (Tools::strtolower($product_tab) == Tools::strtolower($this->tab_display) ||
                (isset($this->tab_display_module) && 'module' .
                $this->tab_display_module == Tools::strtolower($product_tab))),
                'name' => $this->available_tabs_lang[$product_tab],
                'href' => AdminController::$currentIndex . '&token=' . Tools::getAdminTokenLite('AdminModules'),
            );
        }
//Helper form to generate form 
        $helper = new HelperForm();
        $helper->module = $this;
        $helper->table = 'configuration';
        $helper->fields_value = $field_value;
        $helper->name_controller = $this->name;
        $helper->languages = $languages;
        $helper->default_form_language = $this->context->language->id;
        $helper->token = Tools::getAdminTokenLite('AdminModules');
        $helper->currentIndex = AdminController::$currentIndex . '&configure=' . $this->name;
        $helper->title = $this->displayName;
        $helper->show_toolbar = true;
        $helper->toolbar_scroll = true;
        $helper->show_cancel_button = false;
        $helper->submit_action = 'submit' . $this->name;
        $form = $helper->generateForm(array($this->fields_form));
        $custom_ssl_var = 0;
        if ((bool) Configuration::get('PS_SSL_ENABLED') && $custom_ssl_var == 1) {
            $ps_base_url = _PS_BASE_URL_SSL_;
        } else {
            $ps_base_url = _PS_BASE_URL_;
        }

        $this->context->smarty->assign('form', $form);  //Assigned form to template
        $this->context->smarty->assign('product_tabs', $product_tabs);
        $this->context->smarty->assign(
            'path',
            $ps_base_url . __PS_BASE_URI__ . str_replace(_PS_ROOT_DIR_ . '/', '', _PS_MODULE_DIR_) . $this->name . '/'
        );
        $this->context->smarty->assign('root_path', $this->_path);
        $count_lang = count($languages);
        $this->context->smarty->assign('count_lang', $count_lang);
        $this->context->smarty->assign('language', $languages);
        $this->context->smarty->assign('language_id', $this->context->language->id);
        $email_lang = $this->context->language->id;
        $this->context->smarty->assign('email_lang', $email_lang);
        $this->context->smarty->assign('email_marketing_values', Tools::jsonEncode($email_marketing_values));
        $path = $this->_path;
        $module_path = AdminController::$currentIndex . '&token=' . Tools::getAdminTokenLite('AdminModules') .
                '&configure=' . $this->name;
        $this->context->smarty->assign('module_path', $module_path); //module path
        $this->context->smarty->assign('display_image_path', $display_image_path);
        $this->context->smarty->assign('default_image_path', $default_image_path);
        $this->context->smarty->assign('path', $path);
        $this->context->smarty->assign('general_settings', $this->l('General Settings'));
//        $this->context->smarty->assign('display_settings', $this->l('Display Settings'));
        $this->context->smarty->assign('look_feel_settings', $this->l('Look & Feel Settings'));
//        $this->context->smarty->assign('wheel_settings', $this->l('Wheel Settings'));
        $this->context->smarty->assign('slice_settings', $this->l('Slice Settings'));
//        $this->context->smarty->assign('email_marketing', $this->l('Email Marketing'));
        //   $this->context->smarty->assign('email_settings', $this->l('Email Settings'));
        $this->context->smarty->assign('wheel_user_list', $this->l('Wheel User List'));
        //$this->context->smarty->assign('statistics', $this->l('Statistics'));
        $this->context->smarty->assign('firstCall', false);
        $this->context->smarty->assign('tab', $this->l($this->tab_display));
        $list_slice = $this->initListSlice();
        $this->context->smarty->assign('list_slice', $list_slice);
        $this->context->smarty->assign('default_tab', '');
        //Code for line graph data
        $current_time = date('Y-m-d h:i:s');
        $pasttime = date('Y-m-d h:i:s', strtotime('-10 days'));
        $this->context->smarty->assign(array(
            'start_date' => $pasttime,
            'end_date' => $current_time
        ));

        $data_query = 'SELECT COUNT(coupon_id) as total_coupons,DATE(date_added)as date  FROM ' . _DB_PREFIX_ . 'spin_wheel_coupons  WHERE DATE(date_added) >= "' . pSQL($pasttime) . '" and DATE(date_added) <="' . pSQL($current_time) .
                '" GROUP BY DATE(date_added) ORDER BY date_added DESC';
        $total_generated_coupon_data = Db::getInstance()->executeS($data_query);
        $i = 0;
        $dates = array();
        $coupons_data = array();
        foreach ($total_generated_coupon_data as $k => $coupon) {
            $coupons_data[$coupon['date']] = $coupon['total_coupons'];
        }
        $i = 0;
        $date = date('Y-m-d', strtotime($pasttime));
        $total_generated_coupon_graph_data = array();
        while (true) {
            $i++;
            if (isset($coupons_data[$date])) {
                $total_generated_coupon_graph_data[] = $coupons_data[$date];
            } else {
                $total_generated_coupon_graph_data[] = 0;
            }
            $date = date("Y-m-d", strtotime("+1 day", strtotime($date)));
            if (strtotime($date) > strtotime($current_time) || $i == 12) {
                break;
            }
        }
        $this->context->smarty->assign('total_generated_coupon_data', Tools::jsonEncode($total_generated_coupon_graph_data));
        $unused_date_query = 'select SUM(cr.quantity) as unused_coupons, DATE(sc.date_added)as date  from ' . _DB_PREFIX_ . 'spin_wheel_coupons as sc INNER JOIN ' . _DB_PREFIX_ . 'cart_rule as cr '
                . 'ON sc.coupon=cr.code AND DATE(sc.date_added) >= "' . pSQL($pasttime) . '" and DATE(sc.date_added) <="' . pSQL($current_time) . '" '
                . ' GROUP BY DATE(sc.date_added) ORDER BY DATE(sc.date_added) DESC';
        $total_unused_data = Db::getInstance()->executeS($unused_date_query);
        $i = 0;
        $dates = array();
        $coupons_data = array();
        foreach ($total_unused_data as $k => $coupon) {
            $coupons_data[$coupon['date']] = $coupon['unused_coupons'];
        }

        $i = 0;

        $total_unused_graph_data = array();
        $date = date('Y-m-d', strtotime($pasttime));
        while (true) {
            $i++;
            if (isset($coupons_data[$date])) {
                $total_unused_graph_data[] = $coupons_data[$date];
            } else {
                $total_unused_graph_data[] = 0;
            }
            $date = date("Y-m-d", strtotime("+1 day", strtotime($date)));
            if (strtotime($date) > strtotime($current_time) || $i == 60) {
                break;
            }
        }
        $this->context->smarty->assign('total_unused_data', Tools::jsonEncode($total_unused_graph_data));

        $used_date_query = 'SELECT (COUNT(sc.coupon_id)-SUM(cr.quantity)) as used_coupons, DATE(sc.date_added)as date  from ' . _DB_PREFIX_ . 'spin_wheel_coupons as sc INNER JOIN ' . _DB_PREFIX_ . 'cart_rule as cr '
                . 'ON sc.coupon=cr.code AND DATE(sc.date_added) >= "' . pSQL($pasttime) . '" and DATE(sc.date_added) <="' . pSQL($current_time) . '" '
                . ' GROUP BY DATE(sc.date_added) ORDER BY DATE(sc.date_added) DESC';
        $total_used_data = Db::getInstance()->executeS($used_date_query);
        $i = 0;
        $dates = array();
        $coupons_data = array();
        foreach ($total_used_data as $k => $coupon) {
            $coupons_data[$coupon['date']] = $coupon['used_coupons'];
        }
        $i = 0;
        $ticks = array();
        $date = date('Y-m-d', strtotime($pasttime));
        $total_used_graph_data = array();
        while (true) {
            $i++;
            if (isset($coupons_data[$date])) {
                $total_used_graph_data[] = $coupons_data[$date];
            } else {
                $total_used_graph_data[] = 0;
            }
            $ticks[] = date("d M", strtotime($date));
            $date = date("Y-m-d", strtotime("+1 day", strtotime($date)));
            if (strtotime($date) > strtotime($current_time)) {
                break;
            }
            if ($i == 60) {
                break;
            }
        }
        $this->context->smarty->assign('ticks', Tools::jsonEncode($ticks));
        
        $helper = new HelperView();
        $helper->module = $this;
        $helper->token = Tools::getAdminTokenLite('AdminModules');
        $helper->current = AdminController::$currentIndex . '&configure=' . $this->name;
        $helper->show_toolbar = true;
        $helper->toolbar_scroll = true;
        $helper->override_folder = 'helpers/';
        $helper->base_folder = 'view/';
        $helper->base_tpl = 'free_version.tpl';
        $free_version = $helper->generateView();
        $this->context->smarty->assign('free_version', $free_version);
        
        

        //Rendered custom tpl with helperForm class
        $tpl = 'Form_custom.tpl';
        $helper = new Helper();
        $helper->module = $this;
        $helper->override_folder = 'helpers/';
        $helper->base_folder = 'form/';
        $helper->setTpl($tpl);
        $tpl = $helper->generate();

        $output = $output . $tpl;
        return $output;
    }

    /*
     * Function to get email data for selected shop, email template name and language
     * 
     *  @param    Array template_data    Contains template data which is to be updated
     *  @param    boolean return    True if email is updated otherwise returns False
     */

    protected function getEmailData($template_data)
    {
        $fetch_template_query = 'select * from ' . _DB_PREFIX_ . 'wheel_email where id_lang=' . (int) $template_data['template_lang'] .
                ' and id_shop=' . (int) $this->context->shop->id . ' and template_name="' . pSQL($template_data['name']) . '"';
        $template_data = Db::getInstance(_PS_USE_SQL_SLAVE_)->getRow($fetch_template_query);
        return $template_data;
    }

    /*
     * Function to update email templates in DB and to update email html and text files in mails folder
     * 
     *  @param    Array template_data    Contains template data which is to be updated
     *  @param    boolean return    True if email is updated otherwise returns False
     */

    protected function updateEmailTemplate($template_data)
    {
        $tem_name = $template_data['name'];
        $qry = 'UPDATE ' . _DB_PREFIX_ . 'wheel_email set subject = "' . pSQL(Tools::htmlentitiesUTF8($template_data['subject'])) . '",
				body="' . pSQL(Tools::htmlentitiesUTF8($template_data['body'])) . '", date_updated=now() WHERE
				template_name = "' . pSQL($tem_name) . '" and id_lang=' . (int) $template_data['template_lang'];
        Db::getInstance(_PS_USE_SQL_SLAVE_)->execute($qry);

        $iso = Language::getIsoById((int) $template_data['template_lang']);

        $directory = _PS_MODULE_DIR_ . 'spinwheel/mails/' . $iso;
        if (!file_exists($directory)) {
            Tools::chmodr(_PS_MODULE_DIR_ . 'spinwheel/mails', 0755);
            $mail_dir = dirname(__FILE__) . '/mails/en';
            $new_dir = dirname(__FILE__) . '/mails/' . $iso;
            $this->copyfolder($mail_dir, $new_dir);
        }
        Tools::chmodr(_PS_MODULE_DIR_ . 'spinwheel/mails', 0755);
        if (is_writable($directory)) {
            $f = fopen($directory . '/' . $tem_name . '.txt', 'w');

            fwrite($f, strip_tags($template_data['body']));
            fwrite($f, PHP_EOL);
            fclose($f);

            $f = fopen($directory . '/' . $tem_name . '.html', 'w');

            $base_html = $this->getTemplateBaseHtml();

            $final_html = str_replace('{template_content}', $template_data['body'], $base_html);
            fwrite($f, $final_html);
            fwrite($f, PHP_EOL);
            fclose($f);
            return true;
        } else {
            return false;
        }
    }

    /*
     * Function to fetch base html for updating email template in mails folder
     */

    private function getTemplateBaseHtml()
    {
        $template_html = $this->context->smarty->fetch(_PS_MODULE_DIR_ . 'spinwheel/views/templates/admin/email_base_temp.tpl');
        return $template_html;
    }

    /*
     * Function for ajax process
     * 
     *  @param    string method  Name of method which is to be called for ajax process
     */

    private function ajaxProcess($method)
    {
        $this->json = array();
        if ($method == 'loadEmailTemplate') {
            $template_name = Tools::getValue('temp_name');
            $language = Tools::getValue('selected_lang');
            $fetch_template_query = 'select * from ' . _DB_PREFIX_ . 'wheel_email where id_lang=' . (int) $language .
                    ' and id_shop=' . (int) $this->context->shop->id . ' and template_name="' . pSQL($template_name) . '"';
            $template_data = Db::getInstance(_PS_USE_SQL_SLAVE_)->getRow($fetch_template_query);
            $template_data['body'] = Tools::htmlentitiesDecodeUTF8($template_data['body']);
            $this->json = $template_data;
        }

        if ($method == 'mailchimpgetlist') {
            $this->json = array();
        }

        if ($method == 'constantcontactgetlist') {
            $api_key = Tools::getValue('api_key');
            $api_token = Tools::getValue('api_token');
            $ConstantContact = new ConstantContactComponent();
            $list = $ConstantContact->getLists($api_key, $api_token);
            $this->json = $list;
        }

        if ($method == 'klaviyogetlist') {
            $this->json = array();
        }

        if ($method == 'getresponsegetlist') {
            $api_key = Tools::getValue('api_key');
            $GetResponse = new GetResponseComponent();
            $list = $GetResponse->getLists($api_key);
            $this->json = $list;
        }

        if ($method == 'getSliceData') {
            $slice_id = Tools::getValue('slice_id');
            $sql = 'Select * from ' . _DB_PREFIX_ . 'wheel_slices where id_slice=' . (int) $slice_id;
            $slice_data = db::getInstance()->getRow($sql);
            $this->context->smarty->assign(array('slice_no' => $slice_data['slice_no'],
                'coupon_type' => $slice_data['coupon_type'],
                'slice_label' => $slice_data['slice_label'],
                'coupon_value' => $slice_data['coupon_value'],
                'gravity' => $slice_data['gravity'],));
            $this->json = $slice_data;
        }

        if ($method == 'updateSliceData') {
            $coupon_type = Tools::getValue('coupon_type');
            $label = Tools::getValue('slice_label');
            $coupon_value = Tools::getValue('coupon_value');
            $gravity = Tools::getValue('gravity');
            $id_slice = Tools::getValue('slice_id');
            $sql = 'UPDATE ' . _DB_PREFIX_ . 'wheel_slices SET coupon_type="' . pSQL($coupon_type) . '",'
                    . ' slice_label="' . pSQL($label) . '", coupon_value="' . pSQL($coupon_value) . '", gravity="' . pSQL($gravity) . '" WHERE slice_no = 1 and id_slice=' . (int) $id_slice;
            $res = db::getInstance()->execute($sql);
            $this->json = $res;
        }

        if ($method == 'refreshList') {
            $res = $this->initListSlice();
            $this->json = $res;
        }

        if ($method == 'getGraphCountryData') {
            $graph_query = 'SELECT COUNT(country) as count, country  FROM ' . _DB_PREFIX_ . 'spin_wheel_user_list GROUP BY country ORDER BY count DESC LIMIT 10';
            $data_graph = Db::getInstance(_PS_USE_SQL_SLAVE_)->executeS($graph_query);
            $value_c = array();
            $i = 0;
            foreach ($data_graph as $graph) {
                $value_c[$i]['country'] = $graph['country'];
                $value_c[$i]['count'] = $graph['count'];
                $i++;
            }
            $this->json = $value_c;
        }

        if ($method == 'getGraphDeviceData') {
            $graph_query = 'SELECT COUNT(device) as count, device  FROM ' . _DB_PREFIX_ . 'spin_wheel_user_list GROUP BY device ORDER BY count DESC LIMIT 10';
            $data_graph = Db::getInstance(_PS_USE_SQL_SLAVE_)->executeS($graph_query);
            $value = array();
            $i = 0;
            foreach ($data_graph as $graph) {
                $value[$i]['device'] = $graph['device'];
                $value[$i]['count'] = $graph['count'];
                $i++;
            }
            $this->json = $value;
        }

        if ($method == 'deleteImage') {
            $res = $this->deleteImage();
            $this->json = $res;
        }

        if ($method == 'generateCoupon') {
            $this->json = $this->generateCouponCode();
        }
        if ($method == 'sendTestMail') {
            $this->json = false;
        }

        if ($method == 'filterData') {
            $from_date = Tools::getValue('from_date');
            $to_date = Tools::getValue('to_date');
            // d(date('Y-m-d', strtotime($from_date)));
            $result = $this->getFilteredData($from_date, $to_date);
            $this->json = $result;
        }

        header('Content-Type: application/json', true);
        echo Tools::jsonEncode($this->json);
        die;
    }

    /*
     * Get months name to show in graph when filtering case is of month
     *
     * @param    int month_num   Month number
     * @return   Array   Return 3 letters month name
     */

    public function getMonths($month_num)
    {
        $month_name = '';
        switch ($month_num) {
            case '1':
                $month_name = $this->l('Jan');
                break;
            case '2':
                $month_name = $this->l('Feb');
                break;
            case '3':
                $month_name = $this->l('Mar');
                break;
            case '4':
                $month_name = $this->l('Apr');
                break;
            case '5':
                $month_name = $this->l('May');
                break;
            case '6':
                $month_name = $this->l('Jun');
                break;
            case '7':
                $month_name = $this->l('Jul');
                break;
            case '8':
                $month_name = $this->l('Aug');
                break;
            case '9':
                $month_name = $this->l('Sep');
                break;
            case '10':
                $month_name = $this->l('Oct');
                break;
            case '11':
                $month_name = $this->l('Nov');
                break;
            case '12':
                $month_name = $this->l('Dec');
                break;
        }
        return $month_name;
    }

    /*
     * Statistics Graph Filter
     *
     * @param    date from_date   Start date of filter data
     * @param    date to_date    End date of filter data
     * @return   Array   Return Filtered data according to from and to date
     */

    public function getFilteredData($from_date, $to_date)
    {
        if (isset($from_date) && isset($to_date)) {
            $start_date = explode('/', $from_date);
            $start_date = $start_date[2] . '-' . $start_date[1] . '-' . $start_date[0];
            $end_date = explode('/', $to_date);
            $end_date = $end_date[2] . '-' . $end_date[1] . '-' . $end_date[0];
            $start_date = strtotime($start_date);
            $end_date = strtotime($end_date);
            $datediff = $end_date - $start_date;
            $days = floor($datediff / (60 * 60 * 24));
            if ($days == 0) {
                $diff = 'hours';
            } elseif ($days < 31) {
                $diff = 'days';
            } elseif ($days < 366) {
                $diff = 'months';
            } else {
                $diff = 'year';
            }
            switch ($diff) {
                case 'hours':
                    $start_date = date('Y-m-d 00:00:00', $start_date);
                    $new_start_date = date('Y-m-d 00:00:00', strtotime($start_date));
                    $end_date = date('Y-m-d 23:59:59', $end_date);
                    $data_query = 'SELECT COUNT(coupon_id) as total_coupons, HOUR(date_added) as hour  FROM ' . _DB_PREFIX_ . 'spin_wheel_coupons  WHERE DATE(date_added) >= "' . pSQL($start_date) . '" and DATE(date_added) <="' . pSQL($end_date) .
                            '" AND shop_id=' . (int) $this->context->shop->id . ' GROUP BY HOUR(date_added) ORDER BY HOUR(date_added) DESC';
                    $total_generated_coupon_data = Db::getInstance()->executeS($data_query);
                    $i = 0;
                    $dates = array();
                    $coupons_data = array();
                    foreach ($total_generated_coupon_data as $k => $coupon) {
                        $coupons_data[$coupon['hour']] = $coupon['total_coupons'];
                    }
                    $total_generated_coupon_graph_data = array();
                    $date = 0;
                    while (true) {
                        $i++;
                        if (isset($coupons_data[$date])) {
                            $total_generated_coupon_graph_data[] = $coupons_data[$date];
                        } else {
                            $total_generated_coupon_graph_data[] = 0;
                        }
                        $date += 1;
                        $new_start_date = date("Y-m-d H:i:s", strtotime("+1 hour", strtotime($new_start_date)));
                        if ($date > date('H', strtotime($end_date)) || $i == 25) {
                            break;
                        }
                    }
                    $graph_data = array();
                    $graph_data['total_generated'] = $total_generated_coupon_graph_data;

                    $unused_date_query = 'select SUM(cr.quantity) as unused_coupons, HOUR(sc.date_added)as hour  from ' . _DB_PREFIX_ . 'spin_wheel_coupons as sc INNER JOIN ' . _DB_PREFIX_ . 'cart_rule as cr '
                            . 'ON sc.coupon=cr.code AND DATE(sc.date_added) >= "' . pSQL($start_date) . '" and DATE(sc.date_added) <="' . pSQL($end_date) . '" '
                            . ' AND shop_id=' . (int) $this->context->shop->id . ' GROUP BY HOUR(sc.date_added) ORDER BY HOUR(sc.date_added) DESC';
                    $total_unused_data = Db::getInstance()->executeS($unused_date_query);

                    $i = 0;
                    $dates = array();
                    $coupons_data = array();
                    foreach ($total_unused_data as $k => $coupon) {
                        $coupons_data[$coupon['hour']] = $coupon['unused_coupons'];
                    }
                    $total_unused_garph_data = array();
                    $date = 0;
                    while (true) {
                        $i++;
                        if (isset($coupons_data[$date])) {
                            $total_unused_garph_data[] = $coupons_data[$date];
                        } else {
                            $total_unused_garph_data[] = 0;
                        }
                        $date += 1;
                        $new_start_date = date("Y-m-d H:i:s", strtotime("+1 hour", strtotime($new_start_date)));
                        if ($date > date('H', strtotime($end_date)) || $i == 25) {
                            break;
                        }
                    }
                    $graph_data['total_unused'] = $total_unused_garph_data;
                    $new_start_date = date('Y-m-d 00:00:00', strtotime($this->request->data['start_date']));
                    $used_date_query = 'SELECT (COUNT(sc.coupon_id)-SUM(cr.quantity)) as used_coupons, HOUR(sc.date_added) as hour  from ' . _DB_PREFIX_ . 'spin_wheel_coupons as sc INNER JOIN ' . _DB_PREFIX_ . 'cart_rule as cr '
                            . 'ON sc.coupon=cr.code AND DATE(sc.date_added) >= "' . pSQL($start_date) . '" and DATE(sc.date_added) <="' . pSQL($end_date) . '" '
                            . ' AND shop_id=' . (int) $this->context->shop->id . ' GROUP BY HOUR(sc.date_added) ORDER BY HOUR(sc.date_added) DESC';
                    $total_used_data = Db::getInstance()->executeS($used_date_query);
                    $i = 0;
                    $dates = array();
                    $coupons_data = array();
                    foreach ($total_used_data as $k => $coupon) {
                        $coupons_data[$coupon['hour']] = $coupon['used_coupons'];
                    }
                    $total_used_graph_data = array();
                    $date = 0;
                    $ticks = array();
                    while (true) {
                        $i++;
                        if (isset($coupons_data[$date])) {
                            $total_used_graph_data[] = $coupons_data[$date];
                        } else {
                            $total_used_graph_data[] = 0;
                        }
                        $ticks[] = date("h a", strtotime($new_start_date));
                        $date += 1;
                        $new_start_date = date("Y-m-d H:i:s", strtotime("+1 hour", strtotime($new_start_date)));
                        if ($date > date('H', strtotime($end_date)) || $i == 25) {
                            break;
                        }
                    }
                    $graph_data['total_used'] = $total_used_graph_data;
                    $graph_data['ticks'] = $ticks;
                    return $graph_data;
                case 'days':
                    $start_date = date('Y-m-d 00:00:00', $start_date);
                    $end_date = date('Y-m-d 23:59:59', $end_date);
                    $data_query = 'SELECT COUNT(coupon_id) as total_coupons, DATE(date_added) as date_added  FROM ' . _DB_PREFIX_ . 'spin_wheel_coupons  WHERE date_added >= "' . pSQL($start_date) . '" and date_added <="' . pSQL($end_date) .
                            '" AND shop_id=' . (int) $this->context->shop->id . ' GROUP BY DATE(date_added) ORDER BY DATE(date_added) DESC';
                    $total_generated_coupon_data = Db::getInstance()->executeS($data_query);
                    $i = 0;
                    $dates = array();
                    $coupons_data = array();
                    foreach ($total_generated_coupon_data as $k => $coupon) {
                        $coupons_data[$coupon['date_added']] = $coupon['total_coupons'];
                    }

                    $i = 0;
                    $date = date('Y-m-d', strtotime($start_date));
                    while (true) {
                        $i++;
                        if (isset($coupons_data[$date])) {
                            $total_generated_coupon_graph_data[] = $coupons_data[$date];
                        } else {
                            $total_generated_coupon_graph_data[] = 0;
                        }
                        $date = date("Y-m-d", strtotime("+1 day", strtotime($date)));
                        if (strtotime($date) > strtotime($end_date) || $i == 60) {
                            break;
                        }
                    }
                    $graph_data['total_generated'] = $total_generated_coupon_graph_data;

                    $unused_date_query = 'select SUM(cr.quantity) as unused_coupons, DATE(sc.date_added)as date_added  from ' . _DB_PREFIX_ . 'spin_wheel_coupons as sc INNER JOIN ' . _DB_PREFIX_ . 'cart_rule as cr '
                            . 'ON sc.coupon=cr.code AND sc.date_added >= "' . pSQL($start_date) . '" and sc.date_added <="' . pSQL($end_date) . '" '
                            . ' AND shop_id=' . (int) $this->context->shop->id . ' GROUP BY DATE(sc.date_added) ORDER BY DATE(sc.date_added) DESC';
                    $total_unused_data = Db::getInstance()->executeS($unused_date_query);

                    $i = 0;
                    $dates = array();
                    $coupons_data = array();
                    foreach ($total_unused_data as $k => $coupon) {
                        $coupons_data[$coupon['date_added']] = $coupon['unused_coupons'];
                    }
                    $i = 0;
                    $date = date('Y-m-d', strtotime($start_date));
                    while (true) {
                        $i++;
                        if (isset($coupons_data[$date])) {
                            $total_unused_garph_data[] = $coupons_data[$date];
                        } else {
                            $total_unused_garph_data[] = 0;
                        }
                        $date = date("Y-m-d", strtotime("+1 day", strtotime($date)));
                        if (strtotime($date) > strtotime($end_date) || $i == 60) {
                            break;
                        }
                    }
                    $graph_data['total_unused'] = $total_unused_garph_data;
                    $new_start_date = date('Y-m-d 00:00:00', strtotime($this->request->data['start_date']));
                    $used_date_query = 'SELECT (COUNT(sc.coupon_id)-SUM(cr.quantity)) as used_coupons, DATE(sc.date_added)as date_added  from ' . _DB_PREFIX_ . 'spin_wheel_coupons as sc INNER JOIN ' . _DB_PREFIX_ . 'cart_rule as cr '
                            . 'ON sc.coupon=cr.code AND sc.date_added >= "' . pSQL($start_date) . '" and sc.date_added <="' . pSQL($end_date) . '" '
                            . ' AND shop_id=' . (int) $this->context->shop->id . ' GROUP BY DATE(sc.date_added) ORDER BY DATE(sc.date_added) DESC';
                    $total_used_data = Db::getInstance()->executeS($used_date_query);

                    $i = 0;
                    $ticks = array();
                    $dates = array();
                    $coupons_data = array();
                    foreach ($total_used_data as $k => $coupon) {
                        $coupons_data[$coupon['date_added']] = $coupon['used_coupons'];
                    }

                    $i = 0;
                    $total_used_garph_data = array();
                    $date = date('Y-m-d', strtotime($start_date));
                    while (true) {
                        $i++;
                        if (isset($coupons_data[$date])) {
                            $total_used_garph_data[] = $coupons_data[$date];
                        } else {
                            $total_used_garph_data[] = 0;
                        }
                        $ticks[] = date("d M", strtotime($date));
                        $date = date("Y-m-d", strtotime("+1 day", strtotime($date)));
                        if (strtotime($date) > strtotime($end_date) || $i == 60) {
                            break;
                        }
                    }
                    $graph_data['total_used'] = $total_used_garph_data;
                    $graph_data['ticks'] = $ticks;
                    return $graph_data;
                case 'months':
                    $start_date = date('Y-m-d 00:00:00', $start_date);
                    $end_date = date('Y-m-d 23:59:59', $end_date);
                    $data_query = 'SELECT COUNT(coupon_id) as total_coupons, MONTH(date_added) as month  FROM ' . _DB_PREFIX_ . 'spin_wheel_coupons  WHERE date_added >= "' . pSQL($start_date) . '" and date_added <="' . pSQL($end_date) .
                            '" AND shop_id=' . (int) $this->context->shop->id . ' GROUP BY YEAR(date_added),MONTH(date_added) ';
                    $total_generated_coupon_data = Db::getInstance()->executeS($data_query);
                    $i = 0;
                    $date = date('m', strtotime($start_date));
                    $coupons_data = array();
                    foreach ($total_generated_coupon_data as $k => $coupon) {
                        $coupons_data[$coupon['month']] = $coupon['total_coupons'];
                    }
                    $i = 0;
                    while (true) {
                        $i++;
                        if (isset($coupons_data[$date])) {
                            $total_generated_coupon_graph_data[] = $coupons_data[$date];
                        } else {
                            $total_generated_coupon_graph_data[] = 0;
                        }
                        $date += 1;
                        if ($date > date('m', strtotime($end_date)) || $i == 60) {
                            break;
                        }
                    }
                    $graph_data['total_generated'] = $total_generated_coupon_graph_data;

                    $unused_date_query = 'select SUM(cr.quantity) as unused_coupons, MONTH(sc.date_added)as month  from ' . _DB_PREFIX_ . 'spin_wheel_coupons as sc INNER JOIN ' . _DB_PREFIX_ . 'cart_rule as cr '
                            . 'ON sc.coupon=cr.code AND sc.date_added >= "' . pSQL($start_date) . '" and sc.date_added <="' . pSQL($end_date) . '" '
                            . ' AND shop_id=' . (int) $this->context->shop->id . ' GROUP BY MONTH(sc.date_added) ORDER BY MONTH(sc.date_added) DESC';
                    $total_unused_data = Db::getInstance()->executeS($unused_date_query);

                    $i = 0;
                    $date = date('m', strtotime($start_date));
                    $coupons_data = array();
                    foreach ($total_unused_data as $k => $coupon) {
                        $coupons_data[$coupon['month']] = $coupon['unused_coupons'];
                    }
                    $i = 0;
                    while (true) {
                        $i++;
                        if (isset($coupons_data[$date])) {
                            $total_unused_garph_data[] = $coupons_data[$date];
                        } else {
                            $total_unused_garph_data[] = 0;
                        }
                        $date += 1;
                        if ($date > date('m', strtotime($end_date)) || $i == 60) {
                            break;
                        }
                    }
                    $graph_data['total_unused'] = $total_unused_garph_data;
                    $used_date_query = 'SELECT (COUNT(sc.coupon_id)-SUM(cr.quantity)) as used_coupons, MONTH(sc.date_added)as month  from ' . _DB_PREFIX_ . 'spin_wheel_coupons as sc INNER JOIN ' . _DB_PREFIX_ . 'cart_rule as cr '
                            . 'ON sc.coupon=cr.code AND sc.date_added >= "' . pSQL($start_date) . '" and sc.date_added <="' . pSQL($end_date) . '" '
                            . ' AND shop_id=' . (int) $this->context->shop->id . ' GROUP BY MONTH(sc.date_added) ORDER BY MONTH(sc.date_added) DESC';
                    $total_used_data = Db::getInstance()->executeS($used_date_query);
                    $date = date('m', strtotime($start_date));
                    $coupons_data = array();
                    $ticks = array();
                    foreach ($total_used_data as $k => $coupon) {
                        $coupons_data[$coupon['month']] = $coupon['used_coupons'];
                    }
                    $i = 0;
                    while (true) {
                        $i++;
                        if (isset($coupons_data[$date])) {
                            $total_used_garph_data[] = $coupons_data[$date];
                        } else {
                            $total_used_garph_data[] = 0;
                        }
                        $ticks[] = $this->getmonths($date);
                        $date += 1;
                        if ($date > date('m', strtotime($end_date)) || $i == 60) {
                            break;
                        }
                    }
                    $graph_data['total_used'] = $total_used_garph_data;
                    $graph_data['ticks'] = $ticks;
                    return $graph_data;
                case 'year':
                    $start_date = date('Y-m-d 00:00:00', $start_date);
                    $end_date = date('Y-m-d 23:59:59', $end_date);

                    $data_query = 'SELECT COUNT(coupon_id) as total_coupons, YEAR(date_added) as Year  FROM ' . _DB_PREFIX_ . 'spin_wheel_coupons  WHERE DATE(date_added) >= "' . pSQL($start_date) . '" and DATE(date_added) <="' . pSQL($end_date) .
                            '" AND shop_id=' . (int) $this->context->shop->id . ' GROUP BY YEAR(date_added),YEAR(date_added) ';
                    $total_generated_coupon_data = Db::getInstance()->executeS($data_query);
                    $date = date('Y', strtotime($start_date));
                    $coupons_data = array();

                    foreach ($total_generated_coupon_data as $k => $coupon) {
                        $coupons_data[$coupon['Year']] = $coupon['total_coupons'];
                    }
                    $i = 0;
                    while (true) {
                        $i++;
                        if (isset($coupons_data[$date])) {
                            $total_generated_coupon_graph_data[] = $coupons_data[$date];
                        } else {
                            $total_generated_coupon_graph_data[] = 0;
                        }
                        $date += 1;
                        if ($date > date('Y', strtotime($end_date)) || $i == 60) {
                            break;
                        }
                    }

                    $graph_data['total_generated'] = $total_generated_coupon_graph_data;
                    $unused_date_query = 'select SUM(cr.quantity) as unused_coupons, YEAR(sc.date_added) as Year  from ' . _DB_PREFIX_ . 'spin_wheel_coupons as sc INNER JOIN ' . _DB_PREFIX_ . 'cart_rule as cr '
                            . 'ON sc.coupon=cr.code AND DATE(sc.date_added) >= "' . pSQL($start_date) . '" and DATE(sc.date_added) <="' . pSQL($end_date) . '" '
                            . ' AND shop_id=' . (int) $this->context->shop->id . ' GROUP BY YEAR(sc.date_added) ORDER BY YEAR(sc.date_added) DESC';
                    $total_unused_data = Db::getInstance()->executeS($unused_date_query);

                    $date_strt = date('Y', strtotime($start_date));
                    $coupons_used_data = array();
                    foreach ($total_unused_data as $k => $coupon) {
                        $coupons_used_data[$coupon['Year']] = $coupon['unused_coupons'];
                    }
                    $i = 0;
                    while (true) {
                        $i++;
                        if (isset($coupons_used_data[$date_strt])) {
                            $total_unused_garph_data[] = $coupons_used_data[$date_strt];
                        } else {
                            $total_unused_garph_data[] = 0;
                        }
                        $date_strt += 1;
                        if ($date_strt > date('Y', strtotime($end_date)) || $i == 60) {
                            break;
                        }
                    }

                    $graph_data['total_unused'] = $total_unused_garph_data;
                    $new_start_date = date('Y-m-d 00:00:00', strtotime($this->request->data['start_date']));
                    $used_date_query = 'SELECT (COUNT(sc.coupon_id)-SUM(cr.quantity)) as used_coupons, YEAR(sc.date_added)as Year  from ' . _DB_PREFIX_ . 'spin_wheel_coupons as sc INNER JOIN ' . _DB_PREFIX_ . 'cart_rule as cr '
                            . 'ON sc.coupon=cr.code AND sc.date_added >= "' . pSQL($start_date) . '" and sc.date_added <="' . pSQL($end_date) . '" '
                            . ' AND shop_id=' . (int) $this->context->shop->id . ' GROUP BY YEAR(sc.date_added) ORDER BY YEAR(sc.date_added) DESC';
                    $total_used_data = Db::getInstance()->executeS($used_date_query);
                    $date = date('Y', strtotime($start_date));
                    $discount_data = array();
                    $ticks = array();

                    foreach ($total_used_data as $k => $discount) {
                        $discount_data[$discount['Year']] = $discount['used_coupons'];
                    }
                    $i = 0;
                    while (true) {
                        $i++;
                        if (isset($discount_data[$date])) {
                            $total_used_garph_data[] = $discount_data[$date];
                        } else {
                            $total_used_garph_data[] = 0;
                        }
                        $ticks[] = $date;
                        $date += 1;
                        if (($date > date('Y', strtotime($end_date))) || $i == 60) {
                            break;
                        }
                    }
                    $graph_data['total_used'] = $total_used_garph_data;
                    $graph_data['ticks'] = $ticks;
                    return $graph_data;
                default:
                    $graph_data = array();
                    return $graph_data;
            }
        }
    }

    /*
     * Delete image from DB and uploads folder on clicking remove image
     */

    public function deleteImage()
    {
        $velsof_spin_wheel = Tools::unSerialize(Configuration::get('SPIN_WHEEL')); //Array from db
        if (isset($velsof_spin_wheel['image_path'])) {
            $extension = explode('.', $velsof_spin_wheel['image_name']);
            unset($velsof_spin_wheel['image_path']);
            unset($velsof_spin_wheel['image_name']);
            unset($velsof_spin_wheel['image_type']);
            unset($velsof_spin_wheel['image_tmp_name']);
            unset($velsof_spin_wheel['image_size']);
            //Update new array and Deleting file from server
            Configuration::updateValue('SPIN_WHEEL', serialize($velsof_spin_wheel));
            unlink(_PS_MODULE_DIR_ . $this->name . '/views/img/admin/uploads/' . $velsof_spin_wheel['logo']);
        } else {
            echo 'No Image Found';
        }
    }

    /*
     * Add admin media (CSS & JS)
     */

    public function setKbMedia()
    {
        $this->context->controller->addJs($this->getModuleDirUrl() . 'spinwheel/views/js/velovalidation.js');
        $this->context->controller->addJs($this->getModuleDirUrl() . 'spinwheel/views/js/admin/spin_wheel_admin.js');
        $this->context->controller->addCSS($this->getModuleDirUrl() . 'spinwheel/views/css/admin/spin_wheel_admin.css');
        $this->context->controller->addJs($this->getModuleDirUrl() . 'spinwheel/views/js/admin/spin_wheel_validations.js');
        $this->context->controller->addJqueryPlugin('flot');
    }

    /*
     * Insert default settings in configuration table while installing the module
     */

    private function getDefaultSettings()
    {
        $settings = array(
            'enable' => 0,
            'fix_time' => 0,
            'show_popup' => 0,
            'email_recheck' => 0,
            'custom_css' => '',
            'custom_js' => '',
            'min_screen_size' => '320_480',
            'max_display_freq' => '1',
            'hide_after' => '1',
            'where_to_display' => '2',
            'who_to_show' => '1',
            'when_to_display' => '4',
            'geo_location' => '1',
            'active_date' => '',
            'expire_date' => '',
            'background_color_spin' => '#000000',
            'background_color_cancel' => '#ffffff',
            'email_templates' => 'Fire',
            'time_display' => '10',
            'scroll_display' => '10',
            'to_date' => '',
            'from_date' => '',
            'test_email' => '',
            'selected_country' => array(),
            'unselected_country' => array(),
            'show_page' => array('index'),
            'not_show_page' => array(),
            'display_interval' => '5',
            'coupon_display_options' => 1,
            'display_image' => 0,
        );
        $sql = 'SELECT COUNT(*) as count FROM ' . _DB_PREFIX_ . 'wheel_slices';
        $result = Db::getInstance()->getRow($sql);
        if ($result['count'] == 0) {
            $query = 'INSERT INTO ' . _DB_PREFIX_ . 'wheel_slices VALUES("","1","Win","Fixed","10 OFF","10","35",now(),now())';
            Db::getInstance()->execute($query);
            $label = 15;
            $flag = true;
            for ($i = 2; $i <= 12; $i++) {
                if (($i % 2) != 0) {
                        $query = 'INSERT INTO ' . _DB_PREFIX_ . 'wheel_slices VALUES("","' . (int) $i . '","Win","Percentage","' . pSQL($label) . '% OFF","' . (int) $label . '","10",now(),now())';
                        Db::getInstance()->execute($query);
                        $label+=5;
                } else {
                    if ($flag == true) {
                        $flag = false;
                        $query = 'INSERT INTO ' . _DB_PREFIX_ . 'wheel_slices VALUES("","' . (int) $i . '","Loose","Percentage","Not Lucky Today","0","0",now(),now())';
                        Db::getInstance()->execute($query);
                    } else {
                        $flag = true;
                        $query = 'INSERT INTO ' . _DB_PREFIX_ . 'wheel_slices VALUES("","' . (int) $i . '","Loose","Percentage","Oops!Sorry","0","5",now(),now())';
                        Db::getInstance()->execute($query);
                    }
                }
            }
        }
        return $settings;
    }

    /*
     * Get list of customers who used Spin & Win (from helper list class of prestashop)
     */


    /*
     * Get list of slice data from helper list class of prestashop
     */
    public function initListSlice()
    {
        $this->fields_list = array(
            'slice_no' => array(
                'title' => $this->l('S.No.'),
                'type' => 'text',
                'search' => false,
                'class' => 'slice_no'
            ),
            'coupon_type' => array(
                'title' => $this->l('Coupon Type'),
                'type' => 'text',
                'search' => false,
                'class' => 'coupon_type'
            ),
            'slice_label' => array(
                'title' => $this->l('Label'),
                'type' => 'text',
                'search' => false,
                'class' => 'slice_label'
            ),
            'coupon_value' => array(
                'title' => $this->l('Coupon Value'),
                'type' => 'text',
                'search' => false,
                'class' => 'coupon_value'
            ),
            'gravity' => array(
                'title' => $this->l('Gravity'),
                'type' => 'text',
                'search' => false,
                'class' => 'gravity'
            ),
        );

        $helper = new HelperList();
        $helper->shopLinkType = '';
        $helper->simple_header = false;
        $helper->no_link = true;
        // Actions to be displayed in the "Actions" column
        $helper->actions = array('edit');
        $helper->identifier = 'id_slice';
        $helper->show_toolbar = true;
        $helper->title = $this->l('Slice List');
        $helper->table = 'wheel_slices';
        $helper->token = Tools::getAdminTokenLite('AdminModules');
        $helper->currentIndex = AdminController::$currentIndex . '&configure=' . $this->name;
        $query = "SELECT * FROM " . _DB_PREFIX_ . "wheel_slices";
        $data = Db::getInstance(_PS_USE_SQL_SLAVE_)->executeS($query);
        $results = $data;
        return $helper->generateList($results, $this->fields_list);
    }

    /*
     * Get front controllers or available pages of shop
     */

    public function getControllers()
    {
        $controllers_name = array(
            'index' => $this->l('Home Page'),
        );
        return $controllers_name;
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
        $objIpLocationObject = new \IpLocation_Ip(new \IpLocation_Service_GeoIp());
        $results = $objIpLocationObject->getIpLocation($ip);
        if ($results !== false) {
            return Tools::ucfirst(Tools::strtolower($results->countryName));
        } else {
            $results = $this->l('Unknown Country');
            return $results;
        }
    }

    /*
     * Get Mailchimp List from subscribed user list
     *
     * @param    string start   API key for Mailchimp Integration 
     */

    /*
     * Get Klaviyo List from subscribed user list
     *
     * @param    string $api_key   API key for Klaviyo API 
     */


    /*
     * Copies files of one folder into another folder
     *
     * @param    string source   Path of source folder 
     * @param    string destination   Path of destination folder
     */
    protected function copyfolder($source, $destination)
    {
        $directory = opendir($source);
        mkdir($destination);
        while (($file = readdir($directory)) != false) {
            Tools::copy($source . '/' . $file, $destination . '/' . $file);
        }
        closedir($directory);
    }

    /*
     * Function to check module url is secure or not
     */

    private function getModuleDirUrl()
    {
        $module_dir = '';
        if ($this->checkSecureUrl()) {
            $module_dir = _PS_BASE_URL_SSL_ . __PS_BASE_URI__ . str_replace(_PS_ROOT_DIR_ . '/', '', _PS_MODULE_DIR_);
        } else {
            $module_dir = _PS_BASE_URL_ . __PS_BASE_URI__ . str_replace(_PS_ROOT_DIR_ . '/', '', _PS_MODULE_DIR_);
        }
        return $module_dir;
    }

    /*
     * Function to check url is secure or not
     */

    private function checkSecureUrl()
    {
        $custom_ssl_var = 0;
        if (isset($_SERVER['HTTPS'])) {
            if ($_SERVER['HTTPS'] == 'on') {
                $custom_ssl_var = 1;
            }
        } else if (isset($_SERVER['HTTP_X_FORWARDED_PROTO']) && $_SERVER['HTTP_X_FORWARDED_PROTO'] == 'https') {
            $custom_ssl_var = 1;
        }
        if ((bool) Configuration::get('PS_SSL_ENABLED') && $custom_ssl_var == 1) {
            return true;
        } else {
            return false;
        }
    }

    /*
     * Statistics List Filter
     *
     * @param    int start   Number of starting records in the list 
     * @param    int limit   Number of records to be displayed in the list
     * @param    boolean filter Whether to retunr filter data OR non filter data 
     * @return   Array   Return Filter/non filter data according to search conditions
     */

    public static function getMappedProducts($start, $limit, $filter = false)
    {
        if ($filter) {
            $data_dis = Tools::getValue('spin_wheel_user_listFilter_coupon');
            $data_mail = Tools::getValue('spin_wheel_user_listFilter_customer_email');
            $data_con = Tools::getValue('spin_wheel_user_listFilter_country');
            $data_dev = Tools::getValue('spin_wheel_user_listFilter_device');
            $where_string = '';
            if (trim($data_dis) != '') {
                $where_string .= "swc.coupon LIKE '%" . pSQL(trim($data_dis)) . "%'";
            }

            if (trim($where_string) != '' && trim($data_mail) != '') {
                $where_string .= "OR ul.customer_email LIKE '%" . pSQL(trim($data_mail)) . "%'";
            } else if (trim($data_mail) != '') {
                $where_string .= "ul.customer_email LIKE '%" . pSQL(trim($data_mail)) . "%'";
            }

            if (trim($where_string) != '' && trim($data_con) != '') {
                $where_string .= "OR ul.country LIKE '%" . pSQL(trim($data_con)) . "%'";
            } else if (trim($data_con) != '') {
                $where_string .= "ul.country LIKE '%" . pSQL(trim($data_con)) . "%'";
            }

            if (trim($where_string) != '' && trim($data_dev) != '') {
                $where_string .= "OR ul.device LIKE '%" . pSQL(trim($data_dev)) . "%'";
            } else if (trim($data_dev) != '') {
                $where_string .= "ul.device LIKE '%" . pSQL(trim($data_dev)) . "%'";
            }
            $query = "SELECT COUNT(*) as count FROM " . _DB_PREFIX_ . "spin_wheel_user_list ul INNER JOIN " . _DB_PREFIX_ . "spin_wheel_coupons"
                    . " swc ON swc.coupon_id = ul.coupon_id WHERE " . $where_string;
            $count = Db::getInstance()->getValue($query);
            $query = "SELECT * FROM " . _DB_PREFIX_ . "spin_wheel_user_list ul INNER JOIN " . _DB_PREFIX_ . "spin_wheel_coupons"
                    . " swc ON swc.coupon_id = ul.coupon_id  WHERE " . $where_string
                    . "LIMIT " . pSQL($start) . ',' . pSQL($limit);
            $data = Db::getInstance(_PS_USE_SQL_SLAVE_)->executeS($query);
        } else {
            $query = "SELECT COUNT(*) as count FROM " . _DB_PREFIX_ . "spin_wheel_user_list ul INNER JOIN " . _DB_PREFIX_ . "spin_wheel_coupons"
                    . " swc ON swc.coupon_id = ul.coupon_id";
            $count = Db::getInstance()->getValue($query);
            $query = "SELECT * FROM " . _DB_PREFIX_ . "spin_wheel_user_list ul INNER JOIN " . _DB_PREFIX_ . "spin_wheel_coupons"
                    . " swc ON swc.coupon_id = ul.coupon_id LIMIT " . pSQL($start) . ',' . pSQL($limit);
            $data = Db::getInstance(_PS_USE_SQL_SLAVE_)->executeS($query);
        }
        return array('data' => $data, 'count' => $count);
    }
}
