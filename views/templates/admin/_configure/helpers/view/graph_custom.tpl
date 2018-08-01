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
<style>
    .graph_con_dev {
        display: inline-block;
        height : 400px;
        border: 1px solid black;
    }
    .graph_con{
        float:left;
        width:460px;
    }
    .graph_dev{
        float:left;
        width:460px;
    }
    #country_graph{
        font-weight: 500;
        font-size: 15px;
        text-overflow: ellipsis;
        white-space: nowrap;
        color: #555;
        height: 32px;
        border-top-right-radius: 2px;
        border-top-left-radius: 2px;
        box-sizing: border-box;
        padding-right: 130px;
    }
    .graph_lines{
        width:1000px;
        height: 400px;
    }
    .flot_graph {
        width:900px;
        height:300px;
    }
    .filter_inline_div{
        width:auto !important;
    }

    .filter_inputs{
        width: 100px !important;
        margin-bottom: 0 !important;
        display: inline !important;
        margin-left: 10px !important;
    }
    #getdiscountTrackingdataButton {
        width:50px;


    }

</style>

{*<div class="panel col-lg1" id='list_graph'>*}<!--Div for country graph -->
<div class='panel'>
    <div id="discount_tracking_filters" class="row" style='text-align: center;'>
        <div class="filter_inline_div"><span>{l s='From' mod='spinwheel'}:</span><input type="text" data-hex="true" class="filter_inputs datepicker" id="discount_track_from_date" name="discount_track_from_date"  value="{date('d/m/Y', strtotime($start_date|escape:'quotes':'UTF-8'))}" />
            <span>{l s='To' mod='spinwheel'}:</span><input type="text" class="filter_inputs datepicker" id="discount_track_to_date" name="discount_track_to_date"  value="{date('d/m/Y', strtotime($end_date|escape:'quotes':'UTF-8'))}" />
            <input type="button" id="velsof_spin_filter" class="btn btn-warning" name="discount_track_to_date" value="{l s='Filter' mod='spinwheel'}" style="
                   width: 10%;
                   "><img style="width:40px;height:40px;display:none" src="{$root_path|escape:'quotes':'UTF-8'}views/img/admin/show_loader.gif" id="show_loader_filter"/></div>
            {*              <div class="filter_inline_div"></div>*}
            {*              <div class="filter_inline_div"></div>*}
    </div>
</div>
<div class="panel">
    <div class="graph_lines">  
        <h4>{l s='Coupons Statistics' mod='spinwheel'}</h4>
        <div id="flot-placeholder1" class="flot_graph"></div>        
    </div>
</div>


<div class="graph_con_dev panel" id='list_graph'>
    <h4 style="border-bottom: solid 1px #eee;">{l s='Other Statistics' mod='spinwheel'}</h4>
    <div class="graph_con col-lg-6">
        {if !empty($graph_country)}
            <div class="vss-button statistics"><span  id="country_graph" class="btn btn-block" >{l s='Country Graph' mod='spinwheel'}</span></div>
            {/if}
        <canvas id="pie_country" width="500" height="400" ></canvas>
    </div>
    <div class="graph_dev col-lg-6">
        {if !empty($graph_device)}
            <div class="vss-button statistics"><span  id="country_graph" class="btn btn-block" >{l s='Device Graph' mod='spinwheel'}</span></div>
            {/if}
        <canvas id="pie_device" width="500" height="400" ></canvas>
    </div>


</div>



{*<div id="fixed_discount_tracking_chart" style="height:100px;">                                                                    
<div class="no_chart"><span>{l s='No Data Found' mod='spinwheel'}</span></div>
</div>*}



{*</div>*}
{*<body>
<div id="curve_chart" style="width: 900px; height: 500px"></div>
</body>*}

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
* @copyright 2015 Knowband
* @license   see file: LICENSE.txt
*
* Description
*
* Admin tpl file
*}

