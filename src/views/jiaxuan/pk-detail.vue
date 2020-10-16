<template>
    <div class="car-pk-detail-wrap">
        <div ref="widgetInnerWrap"
             v-if="!isSupportSticky"
             class="widget-inner-wrap">
            <div class="space-div"></div>
            <!-- 隐藏相同项 -->
            <mt-switch class="header-switch" v-model="hideCommons">隐藏</mt-switch>
        </div>
        <div class="car-table-wrap table-wrap"
             ref="carTableWrap">
            <div class="widget-wrap">
                <div class="space-div"></div>
                  <!-- 隐藏相同项 -->
                 <mt-switch  class="header-switch" v-model="hideCommons">隐藏</mt-switch>
               
            </div>
            <div class="card-wrap">
                <div class="placeholder"></div>
                <div class="car-card"
                     :key="car.carId"
                     v-for="car in cars">
                    <div class="car-img">
                        <img :src="`${car.mainImg}?x-oss-process=image/resize,m_fill,w_1600,h_1200,limit_0`"/>
                    </div>
                    <p>{{ car.modelName }}</p>
                </div>
            </div>
        </div>
        <!--  v-if="hideCommonAccordion(accordion)" -->
        <fixed-accordion :collapsed="false"
                         :key="accordion"
                         :title="accordion"
                       
                         v-for="accordion in accordions"
                         @remount="tableRemountHandler">
            <jupiter-table :key="`${accordion}-table`"
                           :fixed="true"
                           :data="getAccordionData(accordion)">
                <jupiter-table-row :key="`${accordion}-${row}`"
                                   :hideCommonRow="hideCommons"
                                   :field="row"
                                   :label="row"
                                   :isSame="getIsSame(getAccordionData(accordion), row)"
                                   v-for="row in getAccordionRows(accordion)">
                </jupiter-table-row>
            </jupiter-table>
        </fixed-accordion>
        
        <fixed-accordion :collapsed="false"
                         key="发动机"
                         title="发动机"
                         v-if="hideCommonAccordion('发动机')"
                         @remount="tableRemountHandler">
            <jupiter-table key="发动机-table"
                           :fixed="true"
                           :data="getAccordionData('发动机')">
                <jupiter-table-row :key="`发动机-${row}`"
                                   :hideCommonRow="hideCommons"
                                   :field="row"
                                   :label="row"
                                   :isSame="getIsSame(getAccordionData('发动机'))"
                                   v-for="row in getAccordionRows('发动机')">
                </jupiter-table-row>
            </jupiter-table>
            <template slot="widgets">
                <span class="engine-accordion-widgets">
                    <span>○ 选配</span>
                    <span>● 标配</span>
                    <span>– 无</span>
                </span>
            </template>
        </fixed-accordion>
       
        
    </div>
</template>

<script>

 import _get from 'lodash.get';
 import throttle from 'lodash.throttle';
import JupiterTable from '@/components/table';
import JupiterTableRow from '@/components/table/row';
import FixedAccordion from '@/components/fixed-accordion';

const nonAccordionProps = [
    'carId',
    'mainImg',
    'modelName'
];
const specialAccordionProps = [
    '车辆瑕疵',//'carFlawnessView',
    '配置亮点',//'carStrengthConfigView',
    '发动机'//'carEnginView'
]

export default {
    name: 'car-pk-detail',
    data () {
       

        return {
           
            cars: [],
            hideCommons: false,
            flawDesc: [],
            showFlawDesc: false,
            isSupportSticky: true, //是否支持sticky属性，默认值为true
        }
    },
    // mixins: [BaseClass],
    computed: {
        accordions () {
            if (this.cars.length) {
                return Object.keys(this.cars[0]).filter(k => {
                    return (
                        nonAccordionProps.findIndex(nk => nk === k) < 0 &&
                        specialAccordionProps.findIndex(sk => sk === k) < 0
                    )
                });
            } else {
                return [];
            }
        }
    },
    components: {
        JupiterTable,
        JupiterTableRow,
        FixedAccordion
    },
    methods: {
        transformRes (res) {
            const ret = [];
            const propInUse = ['carId', 'mainImg', 'modelName', 'carBaseInfoView', 'carPriceSchemeView', 'carStructureConfigViews'];

            if (Array.isArray(res)) {
                res.forEach(car => {
                    ret.push(Object.keys(car).reduce((prev, k) => {

                        if (propInUse.findIndex(p => p === k) < 0) {
                            return prev;
                        }

                        if (Object.prototype.toString.call(car[k]) === '[object Object]') {

                            const key = _get(car, `${k}.itemName`, '');
                            const values = _get(car, `${k}.itemValue`, []);

                            if (values && typeof values[0] === 'string') {
                                //亮点配置数据，字符串数组
                                prev[key] = values.slice();
                            } else {
                                //普通数据，对象数组
                                prev[key] = values.reduce((accu, item) => {
                                    accu[_get(item, 'title', '')] = _get(item, 'value', '');
                                    return accu;
                                }, {})
                            }
                        } else if (Object.prototype.toString.call(car[k]) === '[object Array]') {

                            prev = {
                                ...prev,
                                ...this.transformCarBodyData(car[k])
                            };
                        } else {
                            prev[k] = car[k];
                        }

                        return prev;
                    }, {}));
                })
            } else {
                //do something else
            }

            return ret;
        },
        transformCarBodyData (data) {
            let ret;

            if (Array.isArray(data)) {
                ret = Object.keys(data).reduce((prev, k) => {
                    const key = _get(data, `${k}.itemName`, '');
                    const values = _get(data, `${k}.itemValue`, []);

                    if (values && typeof values[0] === 'string') {
                        //亮点配置数据，字符串数组
                        prev[key] = values.slice();
                    } else {
                        //普通数据，对象数组
                        prev[key] = values.reduce((accu, item) => {
                            accu[_get(item, 'title', '')] = _get(item, 'value', '');
                            return accu;
                        }, {})
                    }

                    return prev;
                }, {});
            } else {
                //do something else
                ret = {};
            }

            return ret;
        },
        getAccordionData (prop, defaultValue) {
         
            return this.cars.map(c => {
                if (c[prop] && Object.prototype.toString.call(c[prop]) === '[object Object]') {
                    return { ...c[prop], carId: c.carId };
                } else {
                    return c[prop] || defaultValue;
                }
            });
        },
        getAccordionRows (prop) {
            return Object.keys(_get(this.cars[0], prop, {}));
        },
        bindScroll () {
            const tableWraps = Array.prototype.slice.call(document.querySelectorAll('.table-wrap'));
            const unionScroll = e => {
                tableWraps
                    .filter(wrap => wrap !== e.target)
                    .forEach(wrap => {
                        if (wrap) {
                            wrap.onscroll = null;
                            wrap.scrollLeft = e.target.scrollLeft;
                        } 
                    });

                tableWraps.forEach(wrap => {
                    wrap.onscroll = throttle(unionScroll, 100, { trailing: false });
                });
            };
            //trailing属性必须加上,不然不起作用
            tableWraps.forEach(wrap => {
                wrap.onscroll = throttle(unionScroll, 100, { trailing: false });
            });

            return () => {
                tableWraps.forEach(wrap => wrap.onscroll = null);
            };
        },
        unBindScroll () { },
        tableRemountHandler () {
            this.unBindScroll = this.bindScroll();
        },
        getCarDetailsAsync () {
            let data = [{"carBaseInfoView":{"itemName":"基本信息","itemValue":[{"title":"初次上牌","value":"2017年04月"},{"title":"表显里程","value":"8.31万公里"},{"title":"排放标准","value":"国VI"},{"title":"变速箱","value":"8挡手自一体"},{"title":"排量","value":"2.0T"},{"title":"颜色","value":"白色"}]},"carId":"c8500349061144ffb3bcb9fd081f319b","carListView":{"brandCode":"brand-20","brandName":"宝马","buyoutPricePicturePcUrl":"http://img.souche.com/f2e/2a3f808cfdef300b63c2a83d18e4432e.png","buyoutPricePictureUrl":"http://img.souche.com/f2e/bc24cb20ecccc272ac9a827b101dbf5a.png","carBody":"SUV","carId":"c8500349061144ffb3bcb9fd081f319b","carModel":"中型SUV","carTagList":[],"carType":0,"cityCode":"00975","cityName":"杭州","detailUrl":"https://jia-app.souche.com/#/car/detail?carId=c8500349061144ffb3bcb9fd081f319b&shopCode=01325403","firstLicensePlateDate":"2017-04-01 00:00:00","firstLicensePlateDateStr":"2017年04月","hasContrast":false,"hasDownPayment":false,"hasFollow":false,"hasLeaseReorder":false,"hasRecommendedReasons":0,"isActivity":false,"isBuyoutPrice":false,"isGeneralActivity":false,"isRecommended":false,"isYichenggou":false,"mileage":83100,"mileageStr":"8.31万公里","modelName":"宝马X3(进口) 2016款 sDrive20i","registerYear":2017,"registerYearStr":"2017年","requestId":"x148W7mIh5","salePrice":295000.0,"seriesCode":"series-707","seriesImg":"http://img.souche.com/67d40263-4909-4084-b145-42e1fc125415.jpg","seriesImgs":["http://img.souche.com/67d40263-4909-4084-b145-42e1fc125415.jpg","http://img.souche.com/57f44261-0e13-402c-b082-288fe2e9fdc8.jpg","http://img.souche.com/85ab5090-2026-45f8-9391-62c678e62810.jpg","http://img.souche.com/b16a2a3b-7112-4502-a96e-7928f28ec232.jpg","http://img.souche.com/8c81fd85-2e1b-4eda-afb4-241ae64062a1.jpg","http://img.souche.com/0b347341-ea97-4978-aa9c-232d7b2a37a2.jpg","http://img.souche.com/233afa43-b89a-4ce7-a891-14855c5c5f18.jpg","http://img.souche.com/9fd6c617-bedb-48d6-a4e4-e54eefa63458.jpg","http://img.souche.com/e21b2668-7786-4d9d-94a3-dbcf3e090663.jpg","http://img.souche.com/d67fa1c8-592e-4f64-acea-9335f448d4d8.jpg","http://img.souche.com/1115d149-23fd-49d9-a3c0-01880bfdda6a.jpg","http://img.souche.com/10b0a856-cb9c-495a-bff2-1cdc198c8737.jpg"],"seriesName":"宝马X3(进口)","shopCode":"01325403","simpleModelName":"2016款 sDrive20i","source":"app_entering","status":"5","type":"car"},"carPriceSchemeView":{"itemName":"价格方案","itemValue":[{"title":"售价","value":"29.50万"},{"title":"新车价","value":"45.70万"}]},"carStructureConfigViews":[{"itemName":"基本参数","itemValue":[{"title":"产商","value":"宝马(进口)"},{"title":"级别","value":"中型SUV"},{"title":"发动机","value":"2.0T 184马力 L4"},{"title":"变速箱","value":"8挡手自一体"},{"title":"长*宽*高(mm)","value":"4665*1890*1690"},{"title":"车身结构","value":"SUV"},{"title":"最高车速(km/h)","value":"210.00"},{"title":"官方0-100km/加速(s)","value":"8.20"},{"title":"工信部综合油耗(L/100km)","value":"7.20"},{"title":"整车质保","value":"3年/10万公里"},{"title":"加装配置","value":"-"}],"value":"baseParam"},{"itemName":"车身","itemValue":[{"title":"长度(mm)","value":"4665"},{"title":"宽度(mm)","value":"1890"},{"title":"高度(mm)","value":"1690"},{"title":"轴距(mm)","value":"2810"},{"title":"前轮距(mm)","value":"1616"},{"title":"后轮距(mm)","value":"1632"},{"title":"最小离地间隙(mm)","value":"-"},{"title":"整车质量(kg)","value":"1800"},{"title":"车身结构","value":"SUV"},{"title":"车门数(个)","value":"5"},{"title":"座位数(个)","value":"5"},{"title":"油箱容积(L)","value":"67"},{"title":"行李厢容积(L)","value":"550"}],"value":"carBodyParam"},{"itemName":"发动机","itemValue":[{"title":"发动机型号","value":"N20B20"},{"title":"排量(L)","value":"2.00"},{"title":"进气方式","value":"涡轮增压"},{"title":"气缸排列形式","value":"L"},{"title":"气缸数(个)","value":"4"},{"title":"每缸气门数(个)","value":"4"},{"title":"压缩比","value":"10.00"},{"title":"配气机构","value":"DOHC"},{"title":"缸径(mm)","value":"84.00"},{"title":"行程(mm)","value":"90.10"},{"title":"最大马力(Ps)","value":"184"},{"title":"最大功率(kW)","value":"-"},{"title":"最大功率转速(rpm)","value":"6250"},{"title":"最大扭矩(N・m)","value":"-"},{"title":"最大扭矩转速(rpm)","value":"4500"},{"title":"发动机特有技术","value":"-"},{"title":"燃料形式","value":"汽油"},{"title":"燃油标号","value":"95号"},{"title":"供油方式","value":"直喷"},{"title":"缸盖材料","value":"铝合金"},{"title":"缸体材料","value":"铝合金"},{"title":"排放标准","value":"国VI"}],"value":"engineParam"},{"itemName":"电动机","itemValue":[{"title":"电机类型","value":"-"},{"title":"电动机总功率(kW)","value":"-"},{"title":"电动机总扭矩(N・m)","value":"-"},{"title":"电动机最大功率(kW)","value":"-"},{"title":"前电动机最大扭矩(N・m)","value":"-"},{"title":"后电动机最大功率(kW)","value":"-"},{"title":"后电动机最大扭矩(N・m)","value":"-"},{"title":"系统综合功率(kW)","value":"-"},{"title":"系统综合扭矩(N・m)","value":"-"},{"title":"电池类型","value":"-"},{"title":"工信部续航里程(km)","value":"-"},{"title":"电池容量(kWh)","value":"-"},{"title":"百公里耗电量(kWh/100km)","value":"-"},{"title":"电池组质保","value":"-"},{"title":"电池充电时间","value":"-"},{"title":"快充电量(%)","value":"-"},{"title":"充电桩价格","value":"-"}],"value":"motorParam"},{"itemName":"变速箱","itemValue":[{"title":"挡位个数","value":"8"},{"title":"变速箱类型","value":"手自一体变速箱(AT)"}],"value":"gearboxParam"},{"itemName":"底盘转向","itemValue":[{"title":"驱动方式","value":"前置后驱"},{"title":"四驱形式","value":"-"},{"title":"中央差速器结构","value":"-"},{"title":"前悬架类型","value":"双球节弹簧减振支柱前桥"},{"title":"后悬架类型","value":"五连杆独立悬架"},{"title":"助力类型","value":"电动助力"},{"title":"车体结构","value":"承载式"}],"value":"chassisteeringParam"},{"itemName":"车轮制动","itemValue":[{"title":"前制动器类型","value":"通风盘式"},{"title":"后制动器类型","value":"通风盘式"},{"title":"驻车制动类型","value":"电子驻车"},{"title":"前轮胎规格","value":"225/60 R17"},{"title":"后轮胎规格","value":"225/60 R17"},{"title":"备胎规格","value":"无"}],"value":"wheelBrakingParam"},{"itemName":"主被动安全装备","itemValue":[{"title":"主/副驾驶座安全气囊","value":"主● / 副●"},{"title":"前/后排侧气囊","value":"前● / 后-"},{"title":"前/后排头部气囊(气帘)","value":"前● / 后●"},{"title":"膝部气囊","value":"-"},{"title":"胎压监测装置","value":"●"},{"title":"零胎压继续行驶","value":"●"},{"title":"安全带未系提示","value":"●"},{"title":"ISOFIX儿童座椅接口","value":"●"},{"title":"ABS防抱死","value":"●"},{"title":"制动力分配(EBD/CBC等)","value":"●"},{"title":"刹车辅助(EBA/BAS/BA等)","value":"●"},{"title":"牵引力控制(ASR/TCS/TRC等)","value":"●"},{"title":"车身稳定控制(ESC/ESP/DSC等)","value":"●"},{"title":"并线辅助","value":"-"},{"title":"车道偏离预警系统","value":"-"},{"title":"主动刹车","value":"-"},{"title":"夜视系统","value":"-"}],"value":"safetyEquipmentParam"},{"itemName":"辅助/操控配置","itemValue":[{"title":"前驻车雷达","value":"前● / 后●"},{"title":"后驻车雷达","value":"前● / 后●"},{"title":"倒车视频影像","value":"-"},{"title":"全景摄像头","value":"-"},{"title":"定速巡航","value":"●"},{"title":"自适应巡航","value":"-"},{"title":"自动泊车入位","value":"-"},{"title":"发动机启停技术","value":"●"},{"title":"上坡辅助","value":"●"},{"title":"可变悬架","value":"-"},{"title":"空气悬架","value":"-"},{"title":"可变转向比","value":"-"},{"title":"前桥限滑差速器/差速锁","value":"-"},{"title":"中央差速器锁止功能","value":"-"},{"title":"后桥限滑差速器/差速锁","value":"-"},{"title":"整体主动转向系统","value":"-"}],"value":"manipulation"},{"itemName":"外部/防盗配置","itemValue":[{"title":"电动天窗","value":"-"},{"title":"全景天窗","value":"●"},{"title":"运动外观套件","value":"-"},{"title":"铝合金轮圈","value":"●"},{"title":"电动吸合门","value":"-"},{"title":"侧滑门","value":"-"},{"title":"电动后备厢","value":"-"},{"title":"感应后备厢","value":"-"},{"title":"车顶行李架","value":"●"},{"title":"发动机电子防盗","value":"●"},{"title":"车内中控锁","value":"●"},{"title":"遥控钥匙","value":"●"},{"title":"无钥匙启动系统","value":"●"},{"title":"无钥匙进入系统","value":"-"}],"value":"retrofit"},{"itemName":"内部配置","itemValue":[{"title":"真皮方向盘","value":"●"},{"title":"方向盘调节","value":"-"},{"title":"方向盘电动调节","value":"-"},{"title":"多功能方向盘","value":"●"},{"title":"方向盘换挡","value":"-"},{"title":"方向盘加热","value":"-"},{"title":"方向盘记忆","value":"-"},{"title":"行车电脑显示屏","value":"●"},{"title":"全液晶仪表盘","value":"-"},{"title":"HUD抬头数字显示","value":"-"}],"value":"innerParam"},{"itemName":"座椅配置","itemValue":[{"title":"座椅材质","value":"-"},{"title":"座椅高低调节","value":"-"},{"title":"腰部支撑调节","value":"-"},{"title":"肩部支撑调节","value":"-"},{"title":"主/副驾驶座电动调节","value":"主● / 副●"},{"title":"第二排靠背角度调节","value":"-"},{"title":"第二排座椅移动","value":"-"},{"title":"后排座椅电动调节","value":"-"},{"title":"电动座椅记忆","value":"●"},{"title":"前排座椅通风","value":"-"},{"title":"后排座椅通风","value":"-"},{"title":"前排座椅加热","value":"-"},{"title":"后排座椅加热","value":"-"},{"title":"前/后排座椅按摩","value":"-"},{"title":"第三排座椅","value":"-"},{"title":"前/后中央扶手","value":"前● / 后●"},{"title":"后排杯架","value":"●"}],"value":"cgairParam"},{"itemName":"多媒体配置","itemValue":[{"title":"GPS导航系统","value":"-"},{"title":"定位互动服务","value":"-"},{"title":"中控台彩色大屏","value":"●"},{"title":"中控液晶屏分屏显示","value":"-"},{"title":"蓝牙/车载电话","value":"-"},{"title":"车载电视","value":"-"},{"title":"后排液晶屏","value":"-"},{"title":"220V/230V电源","value":"-"},{"title":"外接音源接口","value":"-"},{"title":"多媒体系统","value":"-"},{"title":"扬声器品牌","value":"-"},{"title":"扬声器数量","value":"8-9喇叭●"}],"value":"multimedia"},{"itemName":"灯光配置","itemValue":[{"title":"近光灯","value":"-"},{"title":"远光灯","value":"-"},{"title":"日间行车灯","value":"●"},{"title":"自适应远近光","value":"-"},{"title":"自动头灯","value":"●"},{"title":"转向辅助灯","value":"-"},{"title":"转向头灯","value":"-"},{"title":"前雾灯","value":"●"},{"title":"大灯高度可调","value":"●"},{"title":"大灯清洗装置","value":"●"},{"title":"车内氛围灯","value":"-"}],"value":"lightParam"},{"itemName":"玻璃/后视镜","itemValue":[{"title":"前/后电动车窗","value":"前● / 后●"},{"title":"车窗防夹手功能","value":"●"},{"title":"防紫外线","value":"●"},{"title":"后视镜电动调节","value":"●"},{"title":"后视镜加热","value":"●"},{"title":"内/外后视镜自动防眩目","value":"-"},{"title":"后视镜电动折叠","value":"-"},{"title":"后视镜记忆","value":"●"},{"title":"后风挡遮阳帘","value":"-"},{"title":"后排侧隐私玻璃","value":"-"},{"title":"遮阳板化妆镜","value":"●"},{"title":"后雨刷","value":"●"},{"title":"感应雨刷","value":"●"}],"value":"enterWithoutKey"},{"itemName":"空调/冰箱","itemValue":[{"title":"空调控制方式","value":"-"},{"title":"后排独立空调","value":"-"},{"title":"后座出风口","value":"-"},{"title":"温度分区控制","value":"-"},{"title":"车内空气调节/花粉过滤","value":"●"},{"title":"车载冰箱","value":"-"}],"value":"refrigeration"}],"mainImg":"http://img.souche.com/67d40263-4909-4084-b145-42e1fc125415.jpg","modelName":"宝马X3(进口) 2016款 sDrive20i"},{"carBaseInfoView":{"itemName":"基本信息","itemValue":[{"title":"初次上牌","value":"2017年05月"},{"title":"表显里程","value":"3.18万公里"},
            {"title":"排放标准","value":"国V"},{"title":"变速箱","value":"CVT无级变速(模拟8挡)"},{"title":"排量","value":"1.8T"},{"title":"颜色","value":"蓝色"}]},"carId":"ebc97878ed464c6da15eb958d830d8e0","carListView":{"brandCode":"brand-15","brandName":"奥迪","buyoutPricePicturePcUrl":"http://img.souche.com/f2e/2a3f808cfdef300b63c2a83d18e4432e.png","buyoutPricePictureUrl":"http://img.souche.com/f2e/bc24cb20ecccc272ac9a827b101dbf5a.png","carBody":"掀背车","carId":"ebc97878ed464c6da15eb958d830d8e0","carModel":"中型车","carTagList":[],"carType":0,"cityCode":"00975","cityName":"杭州","detailUrl":"https://jia-app.souche.com/#/car/detail?carId=ebc97878ed464c6da15eb958d830d8e0&shopCode=01325403","firstLicensePlateDate":"2017-05-01 00:00:00","firstLicensePlateDateStr":"2017年05月","hasContrast":false,"hasDownPayment":false,"hasFollow":false,"hasLeaseReorder":false,"hasRecommendedReasons":0,"isActivity":false,"isBuyoutPrice":false,"isGeneralActivity":false,"isRecommended":false,"isYichenggou":false,"mileage":31833,"mileageStr":"3.18万公里","modelName":"奥迪A5 2016款 改款 Sportback 35 TFSI 进取型","registerYear":2017,"registerYearStr":"2017年","requestId":"Reuk4WGZgY","salePrice":255000.0,"seriesCode":"series-1676","seriesImg":"http://img.souche.com/19a1ab5d-5709-4fed-acfd-1be5fd8d911f.jpg","seriesImgs":["http://img.souche.com/19a1ab5d-5709-4fed-acfd-1be5fd8d911f.jpg","http://img.souche.com/70e9a614-22a8-4738-8325-475fef910656.jpg","http://img.souche.com/f51ccaa9-43df-414f-a697-6be39ea9ccbe.jpg","http://img.souche.com/ad31a10e-0174-4854-80c8-b5cbe5b7239a.jpg","http://img.souche.com/ffcc4d13-b38c-4d7a-b5f5-a4b41c852765.jpg","http://img.souche.com/300f04ea-421b-485a-9b2e-33f95845796d.jpg","http://img.souche.com/ab6e2e24-597b-4da2-b598-9cb0c4cb937b.jpg","http://img.souche.com/e9400132-a300-43c6-b9db-5e6e4afdd929.jpg","http://img.souche.com/5d6c3c27-2f00-413e-ab4d-ca39d6ac1a53.jpg"],"seriesName":"奥迪A5","shopCode":"01325403","simpleModelName":"2016款 改款 Sportback 35 TFSI 进取型","source":"app_entering","status":"5","type":"car"},"carPriceSchemeView":{"itemName":"价格方案","itemValue":[{"title":"售价","value":"25.50万"},{"title":"新车价","value":"43.20万"}]},"carStructureConfigViews":[{"itemName":"基本参数","itemValue":[{"title":"产商","value":"奥迪(进口)"},{"title":"级别","value":"中型车"},{"title":"发动机","value":"1.8T 177马力 L4"},{"title":"变速箱","value":"CVT无级变速(模拟8挡)"},{"title":"长*宽*高(mm)","value":"4712*1854*1391"},{"title":"车身结构","value":"掀背车"},{"title":"最高车速(km/h)","value":"221.00"},{"title":"官方0-100km/加速(s)","value":"8.40"},{"title":"工信部综合油耗(L/100km)","value":"6.40"},{"title":"整车质保","value":"3年/10万公里"},{"title":"加装配置","value":"-"}],"value":"baseParam"},{"itemName":"车身","itemValue":[{"title":"长度(mm)","value":"4712"},{"title":"宽度(mm)","value":"1854"},{"title":"高度(mm)","value":"1391"},{"title":"轴距(mm)","value":"2817"},{"title":"前轮距(mm)","value":"-"},{"title":"后轮距(mm)","value":"-"},{"title":"最小离地间隙(mm)","value":"-"},{"title":"整车质量(kg)","value":"1610"},{"title":"车身结构","value":"掀背车"},{"title":"车门数(个)","value":"5"},{"title":"座位数(个)","value":"4"},{"title":"油箱容积(L)","value":"63"},{"title":"行李厢容积(L)","value":"480"}],"value":"carBodyParam"},{"itemName":"发动机","itemValue":[{"title":"发动机型号","value":"-"},{"title":"排量(L)","value":"1.80"},{"title":"进气方式","value":"涡轮增压"},{"title":"气缸排列形式","value":"L"},{"title":"气缸数(个)","value":"4"},{"title":"每缸气门数(个)","value":"4"},{"title":"压缩比","value":"-"},{"title":"配气机构","value":"DOHC"},{"title":"缸径(mm)","value":"-"},{"title":"行程(mm)","value":"-"},{"title":"最大马力(Ps)","value":"177"},{"title":"最大功率(kW)","value":"-"},{"title":"最大功率转速(rpm)","value":"6200"},{"title":"最大扭矩(N・m)","value":"-"},{"title":"最大扭矩转速(rpm)","value":"3800"},{"title":"发动机特有技术","value":"-"},{"title":"燃料形式","value":"汽油"},{"title":"燃油标号","value":"95号"},{"title":"供油方式","value":"混合喷射"},{"title":"缸盖材料","value":"铝合金"},{"title":"缸体材料","value":"铸铁"},{"title":"排放标准","value":"国V"}],"value":"engineParam"},{"itemName":"电动机","itemValue":[{"title":"电机类型","value":"-"},{"title":"电动机总功率(kW)","value":"-"},{"title":"电动机总扭矩(N・m)","value":"-"},{"title":"电动机最大功率(kW)","value":"-"},{"title":"前电动机最大扭矩(N・m)","value":"-"},{"title":"后电动机最大功率(kW)","value":"-"},{"title":"后电动机最大扭矩(N・m)","value":"-"},{"title":"系统综合功率(kW)","value":"-"},{"title":"系统综合扭矩(N・m)","value":"-"},{"title":"电池类型","value":"-"},{"title":"工信部续航里程(km)","value":"-"},{"title":"电池容量(kWh)","value":"-"},{"title":"百公里耗电量(kWh/100km)","value":"-"},{"title":"电池组质保","value":"-"},{"title":"电池充电时间","value":"-"},{"title":"快充电量(%)","value":"-"},{"title":"充电桩价格","value":"-"}],"value":"motorParam"},{"itemName":"变速箱","itemValue":[{"title":"挡位个数","value":"8"},{"title":"变速箱类型","value":"无级变速箱(CVT)"}],"value":"gearboxParam"},{"itemName":"底盘转向","itemValue":[{"title":"驱动方式","value":"前置前驱"},{"title":"四驱形式","value":"-"},{"title":"中央差速器结构","value":"-"},{"title":"前悬架类型","value":"五连杆独立悬架"},{"title":"后悬架类型","value":"梯形连杆式后悬架"},{"title":"助力类型","value":"电动助力"},{"title":"车体结构","value":"承载式"}],"value":"chassisteeringParam"},{"itemName":"车轮制动","itemValue":[{"title":"前制动器类型","value":"通风盘式"},{"title":"后制动器类型","value":"盘式"},{"title":"驻车制动类型","value":"电子驻车"},{"title":"前轮胎规格","value":"245/40 R18"},{"title":"后轮胎规格","value":"245/40 R18"},{"title":"备胎规格","value":"非全尺寸●"}],"value":"wheelBrakingParam"},{"itemName":"主被动安全装备","itemValue":[{"title":"主/副驾驶座安全气囊","value":"主● / 副●"},{"title":"前/后排侧气囊","value":"前● / 后-"},{"title":"前/后排头部气囊(气帘)","value":"前● / 后●"},{"title":"膝部气囊","value":"-"},{"title":"胎压监测装置","value":"●"},{"title":"零胎压继续行驶","value":"-"},{"title":"安全带未系提示","value":"●"},{"title":"ISOFIX儿童座椅接口","value":"●"},{"title":"ABS防抱死","value":"●"},{"title":"制动力分配(EBD/CBC等)","value":"●"},{"title":"刹车辅助(EBA/BAS/BA等)","value":"●"},{"title":"牵引力控制(ASR/TCS/TRC等)","value":"●"},{"title":"车身稳定控制(ESC/ESP/DSC等)","value":"●"},{"title":"并线辅助","value":"-"},{"title":"车道偏离预警系统","value":"-"},{"title":"主动刹车","value":"-"},{"title":"夜视系统","value":"-"}],"value":"safetyEquipmentParam"},{"itemName":"辅助/操控配置","itemValue":[{"title":"前驻车雷达","value":"前● / 后●"},{"title":"后驻车雷达","value":"前● / 后●"},{"title":"倒车视频影像","value":"-"},{"title":"全景摄像头","value":"-"},{"title":"定速巡航","value":"-"},{"title":"自适应巡航","value":"-"},{"title":"自动泊车入位","value":"-"},{"title":"发动机启停技术","value":"●"},{"title":"上坡辅助","value":"-"},{"title":"可变悬架","value":"-"},{"title":"空气悬架","value":"-"},{"title":"可变转向比","value":"-"},{"title":"前桥限滑差速器/差速锁","value":"-"},{"title":"中央差速器锁止功能","value":"-"},{"title":"后桥限滑差速器/差速锁","value":"-"},{"title":"整体主动转向系统","value":"-"}],"value":"manipulation"},{"itemName":"外部/防盗配置","itemValue":[{"title":"电动天窗","value":"●"},{"title":"全景天窗","value":"-"},{"title":"运动外观套件","value":"-"},{"title":"铝合金轮圈","value":"●"},{"title":"电动吸合门","value":"-"},{"title":"侧滑门","value":"-"},{"title":"电动后备厢","value":"-"},{"title":"感应后备厢","value":"-"},{"title":"车顶行李架","value":"-"},{"title":"发动机电子防盗","value":"●"},{"title":"车内中控锁","value":"●"},{"title":"遥控钥匙","value":"●"},{"title":"无钥匙启动系统","value":"●"},{"title":"无钥匙进入系统","value":"●"}],"value":"retrofit"},{"itemName":"内部配置","itemValue":[{"title":"真皮方向盘","value":"●"},{"title":"方向盘调节","value":"-"},{"title":"方向盘电动调节","value":"-"},{"title":"多功能方向盘","value":"●"},{"title":"方向盘换挡","value":"-"},{"title":"方向盘加热","value":"-"},{"title":"方向盘记忆","value":"-"},{"title":"行车电脑显示屏","value":"●"},{"title":"全液晶仪表盘","value":"-"},{"title":"HUD抬头数字显示","value":"-"}],"value":"innerParam"},{"itemName":"座椅配置","itemValue":[{"title":"座椅材质","value":"-"},{"title":"座椅高低调节","value":"●"},{"title":"腰部支撑调节","value":"-"},{"title":"肩部支撑调节","value":"-"},{"title":"主/副驾驶座电动调节","value":"主● / 副●"},{"title":"第二排靠背角度调节","value":"-"},{"title":"第二排座椅移动","value":"-"},{"title":"后排座椅电动调节","value":"-"},{"title":"电动座椅记忆","value":"-"},{"title":"前排座椅通风","value":"-"},{"title":"后排座椅通风","value":"-"},{"title":"前排座椅加热","value":"前- / 后●"},{"title":"后排座椅加热","value":"前- / 后●"},{"title":"前/后排座椅按摩","value":"-"},{"title":"第三排座椅","value":"-"},{"title":"前/后中央扶手","value":"前● / 后●"},{"title":"后排杯架","value":"●"}],"value":"cgairParam"},{"itemName":"多媒体配置","itemValue":[{"title":"GPS导航系统","value":"-"},{"title":"定位互动服务","value":"-"},{"title":"中控台彩色大屏","value":"●"},{"title":"中控液晶屏分屏显示","value":"-"},{"title":"蓝牙/车载电话","value":"●"},{"title":"车载电视","value":"-"},{"title":"后排液晶屏","value":"-"},{"title":"220V/230V电源","value":"-"},{"title":"外接音源接口","value":"-"},{"title":"多媒体系统","value":"-"},{"title":"扬声器品牌","value":"Bang & Olufsen○"},{"title":"扬声器数量","value":"10-11喇叭●/≥12喇叭○"}],"value":"multimedia"},{"itemName":"灯光配置","itemValue":[{"title":"近光灯","value":"-"},{"title":"远光灯","value":"-"},{"title":"日间行车灯","value":"●"},{"title":"自适应远近光","value":"-"},{"title":"自动头灯","value":"●"},{"title":"转向辅助灯","value":"-"},{"title":"转向头灯","value":"-"},{"title":"前雾灯","value":"●"},{"title":"大灯高度可调","value":"●"},{"title":"大灯清洗装置","value":"●"},{"title":"车内氛围灯","value":"-"}],"value":"lightParam"},{"itemName":"玻璃/后视镜","itemValue":[{"title":"前/后电动车窗","value":"前● / 后●"},{"title":"车窗防夹手功能","value":"●"},{"title":"防紫外线","value":"●"},{"title":"后视镜电动调节","value":"●"},{"title":"后视镜加热","value":"●"},{"title":"内/外后视镜自动防眩目","value":"-"},{"title":"后视镜电动折叠","value":"●"},{"title":"后视镜记忆","value":"-"},{"title":"后风挡遮阳帘","value":"-"},{"title":"后排侧隐私玻璃","value":"-"},{"title":"遮阳板化妆镜","value":"●"},{"title":"后雨刷","value":"-"},{"title":"感应雨刷","value":"●"}],"value":"enterWithoutKey"},{"itemName":"空调/冰箱","itemValue":[{"title":"空调控制方式","value":"-"},{"title":"后排独立空调","value":"-"},{"title":"后座出风口","value":"●"},{"title":"温度分区控制","value":"●"},{"title":"车内空气调节/花粉过滤","value":"●"},{"title":"车载冰箱","value":"-"}],"value":"refrigeration"}],"mainImg":"http://img.souche.com/19a1ab5d-5709-4fed-acfd-1be5fd8d911f.jpg","modelName":"奥迪A5 2016款 改款 Sportback 35 TFSI 进取型"},{"carBaseInfoView":{"itemName":"基本信息","itemValue":[{"title":"初次上牌","value":"2018年04月"},{"title":"表显里程","value":"4.57万公里"},{"title":"排放标准","value":"国V"},{"title":"变速箱","value":"9挡手自一体"},{"title":"排量","value":"2.0T"},{"title":"颜色","value":"白色"}]},"carId":"133f492a26a947e0ac1aac19a1be6f37","carListView":{"brandCode":"brand-25","brandName":"奔驰",
            "buyoutPricePicturePcUrl":"http://img.souche.com/f2e/2a3f808cfdef300b63c2a83d18e4432e.png","buyoutPricePictureUrl":"http://img.souche.com/f2e/bc24cb20ecccc272ac9a827b101dbf5a.png","carBody":"三厢车","carId":"133f492a26a947e0ac1aac19a1be6f37","carModel":"中型车","carTagList":[],"carType":0,"cityCode":"00975","cityName":"杭州","detailUrl":"https://jia-app.souche.com/#/car/detail?carId=133f492a26a947e0ac1aac19a1be6f37&shopCode=003036","firstLicensePlateDate":"2018-04-01 00:00:00","firstLicensePlateDateStr":"2018年04月","hasContrast":false,"hasDownPayment":false,"hasFollow":false,"hasLeaseReorder":false,"hasRecommendedReasons":0,"isActivity":false,"isBuyoutPrice":false,"isGeneralActivity":false,"isRecommended":false,"isYichenggou":false,"mileage":45685,"mileageStr":"4.57万公里","modelName":"奔驰C级 2018款 C 200 L","registerYear":2018,"registerYearStr":"2018年","requestId":"qHqGet0I91","salePrice":286000.0,"seriesCode":"series-246","seriesImg":"http://img.souche.com/2525f139-0337-4d25-8fbb-b7fe35440f8f.jpg","seriesImgs":["http://img.souche.com/2525f139-0337-4d25-8fbb-b7fe35440f8f.jpg","http://img.souche.com/a5f6eb58-26bb-4c54-8ead-d2aee5e95ebf.jpg","http://img.souche.com/34448674-ef28-4473-b0af-76219faafbf9.jpg","http://img.souche.com/976bc9ad-b581-4374-b15c-38fdb613cce8.jpg","http://img.souche.com/472e9326-1af3-4ef8-b817-813355a5d91f.jpg","http://img.souche.com/8047f750-bf39-4d44-b453-bf319821e862.jpg","http://img.souche.com/5a10ffdb-ac14-498c-afea-bf8c5a24758a.jpg","http://img.souche.com/46e0d622-9a57-4def-bc09-655d436645fb.jpg","http://img.souche.com/9925dbd2-d9d5-4068-926b-ae3bda8ba5e1.jpg","http://img.souche.com/3031f0f5-cb6a-4a01-b9fa-0e676afeb361.jpg","http://img.souche.com/461dbd65-15f1-4869-b6f1-a5b91b89d1a0.jpg","http://img.souche.com/0c3d3197-2e85-4086-8532-831bcbeed69b.jpg","http://img.souche.com/b331a8ff-3566-40de-8ee1-f14c20255297.jpg","http://img.souche.com/0bd56621-df49-4028-a1c5-efb24738b434.jpg","http://img.souche.com/927d9dcd-a473-4e78-b334-bd503a898d94.jpg","http://img.souche.com/368b001a-d2ca-4a0c-abf1-806ab4aaed3e.jpg","http://img.souche.com/5bea71fc-630f-45be-b02a-a3ca38cf4cf0.jpg","http://img.souche.com/0ac6f27f-38eb-4ec1-8c0b-1a2a8a557175.jpg","http://img.souche.com/9eedfe48-6476-4898-af85-045035e64a4e.jpg","http://img.souche.com/24d16681-d7c9-4466-bfe6-2ea89d48208f.jpg"],"seriesName":"奔驰C级","shopCode":"003036","simpleModelName":"2018款 C 200 L","source":"app_entering","status":"5","type":"car"},"carPriceSchemeView":{"itemName":"价格方案","itemValue":[{"title":"售价","value":"28.60万"},{"title":"新车价","value":"38.08万"}]},"carStructureConfigViews":[{"itemName":"基本参数","itemValue":[{"title":"产商","value":"北京奔驰"},{"title":"级别","value":"中型车"},{"title":"发动机","value":"2.0T 184马力 L4"},{"title":"变速箱","value":"9挡手自一体"},{"title":"长*宽*高(mm)","value":"4783*1810*1442"},{"title":"车身结构","value":"三厢车"},{"title":"最高车速(km/h)","value":"236.00"},{"title":"官方0-100km/加速(s)","value":"7.90"},{"title":"工信部综合油耗(L/100km)","value":"6.30"},{"title":"整车质保","value":"三年不限公里"},{"title":"加装配置","value":"-"}],"value":"baseParam"},{"itemName":"车身","itemValue":[{"title":"长度(mm)","value":"4783"},{"title":"宽度(mm)","value":"1810"},{"title":"高度(mm)","value":"1442"},{"title":"轴距(mm)","value":"2920"},{"title":"前轮距(mm)","value":"1563"},{"title":"后轮距(mm)","value":"1545"},{"title":"最小离地间隙(mm)","value":"-"},{"title":"整车质量(kg)","value":"-"},{"title":"车身结构","value":"三厢车"},{"title":"车门数(个)","value":"4"},{"title":"座位数(个)","value":"5"},{"title":"油箱容积(L)","value":"-"},{"title":"行李厢容积(L)","value":"-"}],"value":"carBodyParam"},{"itemName":"发动机","itemValue":[{"title":"发动机型号","value":"274 920"},{"title":"排量(L)","value":"2.00"},{"title":"进气方式","value":"涡轮增压"},{"title":"气缸排列形式","value":"L"},{"title":"气缸数(个)","value":"4"},{"title":"每缸气门数(个)","value":"4"},{"title":"压缩比","value":"-"},{"title":"配气机构","value":"DOHC"},{"title":"缸径(mm)","value":"-"},{"title":"行程(mm)","value":"-"},{"title":"最大马力(Ps)","value":"184"},{"title":"最大功率(kW)","value":"-"},{"title":"最大功率转速(rpm)","value":"5500"},{"title":"最大扭矩(N・m)","value":"-"},{"title":"最大扭矩转速(rpm)","value":"4000"},{"title":"发动机特有技术","value":"-"},{"title":"燃料形式","value":"汽油"},{"title":"燃油标号","value":"95号"},{"title":"供油方式","value":"直喷"},{"title":"缸盖材料","value":"铝合金"},{"title":"缸体材料","value":"铝合金"},{"title":"排放标准","value":"国V"}],"value":"engineParam"},{"itemName":"电动机","itemValue":[{"title":"电机类型","value":"-"},{"title":"电动机总功率(kW)","value":"-"},{"title":"电动机总扭矩(N・m)","value":"-"},{"title":"电动机最大功率(kW)","value":"-"},{"title":"前电动机最大扭矩(N・m)","value":"-"},{"title":"后电动机最大功率(kW)","value":"-"},{"title":"后电动机最大扭矩(N・m)","value":"-"},{"title":"系统综合功率(kW)","value":"-"},{"title":"系统综合扭矩(N・m)","value":"-"},{"title":"电池类型","value":"-"},{"title":"工信部续航里程(km)","value":"-"},{"title":"电池容量(kWh)","value":"-"},{"title":"百公里耗电量(kWh/100km)","value":"-"},{"title":"电池组质保","value":"-"},{"title":"电池充电时间","value":"-"},{"title":"快充电量(%)","value":"-"},{"title":"充电桩价格","value":"-"}],"value":"motorParam"},{"itemName":"变速箱","itemValue":[{"title":"挡位个数","value":"9"},{"title":"变速箱类型","value":"手自一体变速箱(AT)"}],"value":"gearboxParam"},{"itemName":"底盘转向","itemValue":[{"title":"驱动方式","value":"前置后驱"},{"title":"四驱形式","value":"-"},{"title":"中央差速器结构","value":"-"},{"title":"前悬架类型","value":"多连杆式独立悬架"},{"title":"后悬架类型","value":"多连杆式独立悬架"},{"title":"助力类型","value":"电动助力"},{"title":"车体结构","value":"承载式"}],"value":"chassisteeringParam"},{"itemName":"车轮制动","itemValue":[{"title":"前制动器类型","value":"通风盘式"},{"title":"后制动器类型","value":"盘式"},{"title":"驻车制动类型","value":"电子驻车"},{"title":"前轮胎规格","value":"225/50 R17"},{"title":"后轮胎规格","value":"225/50 R17"},{"title":"备胎规格","value":"无"}],"value":"wheelBrakingParam"},{"itemName":"主被动安全装备","itemValue":[{"title":"主/副驾驶座安全气囊","value":"主● / 副●"},{"title":"前/后排侧气囊","value":"前● / 后-"},{"title":"前/后排头部气囊(气帘)","value":"-"},{"title":"膝部气囊","value":"●"},{"title":"胎压监测装置","value":"●"},{"title":"零胎压继续行驶","value":"●"},{"title":"安全带未系提示","value":"●"},{"title":"ISOFIX儿童座椅接口","value":"●"},{"title":"ABS防抱死","value":"●"},{"title":"制动力分配(EBD/CBC等)","value":"●"},{"title":"刹车辅助(EBA/BAS/BA等)","value":"●"},{"title":"牵引力控制(ASR/TCS/TRC等)","value":"●"},{"title":"车身稳定控制(ESC/ESP/DSC等)","value":"●"},{"title":"并线辅助","value":"-"},{"title":"车道偏离预警系统","value":"-"},{"title":"主动刹车","value":"-"},{"title":"夜视系统","value":"●"}],"value":"safetyEquipmentParam"},{"itemName":"辅助/操控配置","itemValue":[{"title":"前驻车雷达","value":"前○ / 后-"},{"title":"后驻车雷达","value":"前○ / 后-"},{"title":"倒车视频影像","value":"●"},{"title":"全景摄像头","value":"-"},{"title":"定速巡航","value":"●"},{"title":"自适应巡航","value":"-"},{"title":"自动泊车入位","value":"●"},{"title":"发动机启停技术","value":"●"},{"title":"上坡辅助","value":"-"},{"title":"可变悬架","value":"-"},{"title":"空气悬架","value":"-"},{"title":"可变转向比","value":"●"},{"title":"前桥限滑差速器/差速锁","value":"-"},{"title":"中央差速器锁止功能","value":"-"},{"title":"后桥限滑差速器/差速锁","value":"-"},{"title":"整体主动转向系统","value":"-"}],"value":"manipulation"},{"itemName":"外部/防盗配置","itemValue":[{"title":"电动天窗","value":"-"},{"title":"全景天窗","value":"●"},{"title":"运动外观套件","value":"-"},{"title":"铝合金轮圈","value":"●"},{"title":"电动吸合门","value":"-"},{"title":"侧滑门","value":"-"},{"title":"电动后备厢","value":"-"},{"title":"感应后备厢","value":"-"},{"title":"车顶行李架","value":"-"},{"title":"发动机电子防盗","value":"●"},{"title":"车内中控锁","value":"●"},{"title":"遥控钥匙","value":"●"},{"title":"无钥匙启动系统","value":"●"},{"title":"无钥匙进入系统","value":"-"}],"value":"retrofit"},{"itemName":"内部配置","itemValue":[{"title":"真皮方向盘","value":"●"},{"title":"方向盘调节","value":"-"},{"title":"方向盘电动调节","value":"-"},{"title":"多功能方向盘","value":"●"},{"title":"方向盘换挡","value":"●"},{"title":"方向盘加热","value":"-"},{"title":"方向盘记忆","value":"-"},{"title":"行车电脑显示屏","value":"●"},{"title":"全液晶仪表盘","value":"-"},{"title":"HUD抬头数字显示","value":"-"}],"value":"innerParam"},{"itemName":"座椅配置","itemValue":[{"title":"座椅材质","value":"-"},{"title":"座椅高低调节","value":"●"},{"title":"腰部支撑调节","value":"-"},{"title":"肩部支撑调节","value":"-"},{"title":"主/副驾驶座电动调节","value":"主● / 副●"},{"title":"第二排靠背角度调节","value":"-"},{"title":"第二排座椅移动","value":"-"},{"title":"后排座椅电动调节","value":"-"},{"title":"电动座椅记忆","value":"-"},{"title":"前排座椅通风","value":"-"},{"title":"后排座椅通风","value":"-"},{"title":"前排座椅加热","value":"-"},{"title":"后排座椅加热","value":"-"},{"title":"前/后排座椅按摩","value":"-"},{"title":"第三排座椅","value":"-"},{"title":"前/后中央扶手","value":"-"},{"title":"后排杯架","value":"●"}],"value":"cgairParam"},{"itemName":"多媒体配置","itemValue":[{"title":"GPS导航系统","value":"-"},{"title":"定位互动服务","value":"●"},{"title":"中控台彩色大屏","value":"●"},{"title":"中控液晶屏分屏显示","value":"-"},{"title":"蓝牙/车载电话","value":"●"},{"title":"车载电视","value":"-"},{"title":"后排液晶屏","value":"-"},{"title":"220V/230V电源","value":"-"},{"title":"外接音源接口","value":"-"},{"title":"多媒体系统","value":"-"},{"title":"扬声器品牌","value":"Burmester柏林之声○"},{"title":"扬声器数量","value":"-"}],"value":"multimedia"},{"itemName":"灯光配置","itemValue":[{"title":"近光灯","value":"-"},{"title":"远光灯","value":"-"},{"title":"日间行车灯","value":"●"},{"title":"自适应远近光","value":"-"},{"title":"自动头灯","value":"●"},{"title":"转向辅助灯","value":"-"},{"title":"转向头灯","value":"-"},{"title":"前雾灯","value":"-"},{"title":"大灯高度可调","value":"●"},{"title":"大灯清洗装置","value":"-"},{"title":"车内氛围灯","value":"-"}],"value":"lightParam"},{"itemName":"玻璃/后视镜","itemValue":[{"title":"前/后电动车窗","value":"-"},{"title":"车窗防夹手功能","value":"●"},{"title":"防紫外线","value":"-"},{"title":"后视镜电动调节","value":"●"},{"title":"后视镜加热","value":"●"},{"title":"内/外后视镜自动防眩目","value":"-"},{"title":"后视镜电动折叠","value":"●"},{"title":"后视镜记忆","value":"-"},{"title":"后风挡遮阳帘","value":"-"},{"title":"后排侧隐私玻璃","value":"●"},{"title":"遮阳板化妆镜","value":"●"},{"title":"后雨刷","value":"-"},{"title":"感应雨刷","value":"●"}],"value":"enterWithoutKey"},{"itemName":"空调/冰箱","itemValue":[{"title":"空调控制方式","value":"-"},{"title":"后排独立空调","value":"-"},{"title":"后座出风口","value":"●"},{"title":"温度分区控制","value":"●"},{"title":"车内空气调节/花粉过滤","value":"-"},{"title":"车载冰箱","value":"-"}],"value":"refrigeration"}],"mainImg":"http://img.souche.com/2525f139-0337-4d25-8fbb-b7fe35440f8f.jpg","modelName":"奔驰C级 2018款 C 200 L"},
            {"carBaseInfoView":{"itemName":"基本信息","itemValue":[{"title":"初次上牌","value":"2014年09月"},{"title":"表显里程","value":"8.59万公里"},{"title":"排放标准","value":"国IV"},{"title":"变速箱","value":"7挡双离合"},{"title":"排量","value":"1.8T"},{"title":"颜色","value":"黑色"}]},"carId":"59c7d118fa1140f1aa20f27a9aa06a98","carListView":{"brandCode":"brand-41","brandName":"大众","buyoutPricePicturePcUrl":"http://img.souche.com/f2e/2a3f808cfdef300b63c2a83d18e4432e.png","buyoutPricePictureUrl":"http://img.souche.com/f2e/bc24cb20ecccc272ac9a827b101dbf5a.png","carBody":"三厢车","carId":"59c7d118fa1140f1aa20f27a9aa06a98","carModel":"中型车","carTagList":[],"carType":0,"cityCode":"00106","cityName":"石家庄","detailUrl":"https://jia-app.souche.com/#/car/detail?carId=59c7d118fa1140f1aa20f27a9aa06a98&shopCode=01515258","firstLicensePlateDate":"2014-09-01 00:00:00","firstLicensePlateDateStr":"2014年09月","hasContrast":false,"hasDownPayment":false,"hasFollow":false,"hasLeaseReorder":false,"hasRecommendedReasons":0,"isActivity":false,"isBuyoutPrice":false,"isGeneralActivity":false,"isRecommended":false,"isYichenggou":false,"mileage":85900,"mileageStr":"8.59万公里","modelName":"大众 迈腾 2013款 1.8TSI 领先型","registerYear":2014,"registerYearStr":"2014年","requestId":"i6euTrNnT5","salePrice":103000.0,"seriesCode":"series-135","seriesImg":"http://img.souche.com/0b36d4d5-8a01-4d88-8048-f85dd009c599.jpg","seriesImgs":["http://img.souche.com/0b36d4d5-8a01-4d88-8048-f85dd009c599.jpg","http://img.souche.com/3c977aa8-de0e-42ee-bd69-fb148361e69f.jpg","http://img.souche.com/ce41524d-04ba-4d42-824b-a5dfd82aeae8.jpg","http://img.souche.com/a927afcc-0322-4dd3-a378-52b3afb5a73a.jpg","http://img.souche.com/6e39b7db-f333-4a0e-8945-6b276fe5e894.jpg","http://img.souche.com/113b926c-5afd-42c5-b694-d946fca9bcff.jpg","http://img.souche.com/a45c7dd7-1fe6-4a49-80d7-38d0a19a838f.jpg","http://img.souche.com/10b69cc0-f8fd-4f7e-90cd-2facdd80ceb3.jpg","http://img.souche.com/93e564da-265a-48ca-a3a7-677e3d666c7f.jpg","http://img.souche.com/62592d35-8768-42b7-bd3e-4b2b0dba6f62.jpg","http://img.souche.com/e02d905f-8445-4337-b497-6bc0cdbd646c.jpg","http://img.souche.com/f289f36d-97dd-4302-853c-536ef6d15308.jpg","http://img.souche.com/33011b83-5a46-44d4-ba02-44dc8281f14e.jpg","http://img.souche.com/91c0a5f8-6a55-4280-af9d-fe6c474c5632.jpg","http://img.souche.com/d3990493-a4b2-4902-9021-4b00734d4ddf.jpg","http://img.souche.com/c17f1370-4501-4d7a-b618-5f144a6f9500.jpg","http://img.souche.com/8C5C8132-F5D4-40E9-BE5F-C417A30D40EC.jpg","http://img.souche.com/3E59F8C9-FAB5-4EA3-BE66-5EEB55174303.jpg","http://img.souche.com/DBA2704E-8FCA-4AF5-9FEB-939AC46637C5.jpg","http://img.souche.com/1D861FBA-2737-413D-8731-390BCF4BAC95.jpg","http://img.souche.com/AD66E4AD-99C9-492E-9CE8-1CF8D636A22D.jpg","http://img.souche.com/FA9EF132-75F9-400B-8382-79B1FF8E46D1.jpg","http://img.souche.com/65B760A4-714F-4500-94E5-6D844CBF89EC.jpg","http://img.souche.com/977F80B6-D37D-4856-BF22-AA14529ED536.jpg","http://img.souche.com/0F16CB72-E8E0-468F-87E2-B38E4FB9A18E.jpg","http://img.souche.com/A4DDAED2-3640-4A97-9CCD-270694B48720.jpg","http://img.souche.com/4286A862-F9CC-47A3-BA8E-ABC255F0E846.jpg","http://img.souche.com/B8D8835E-A379-48E3-87A9-B8285EC3E99E.jpg","http://img.souche.com/344535A2-1CF6-454B-B7E7-7E87348353EC.jpg","http://img.souche.com/C4595F1F-F6AD-4218-9AF7-2C1A87594B8F.jpg","http://img.souche.com/B75E62CC-6279-425D-A326-1D94F200FF0B.jpg","http://img.souche.com/C5D773B4-8DEC-45E6-A326-B23D1BF428BA.jpg"],"seriesName":"迈腾","shopCode":"01515258","simpleModelName":"2013款 1.8TSI 领先型","source":"app_entering","status":"5","type":"car"},"carPriceSchemeView":{"itemName":"价格方案","itemValue":[{"title":"售价","value":"10.30万"},{"title":"新车价","value":"23.86万"}]},"carStructureConfigViews":[{"itemName":"基本参数","itemValue":[{"title":"产商","value":"一汽-大众"},{"title":"级别","value":"中型车"},{"title":"发动机","value":"1.8T 160马力 L4"},{"title":"变速箱","value":"7挡双离合"},{"title":"长*宽*高(mm)","value":"4865*1820*1475"},{"title":"车身结构","value":"三厢车"},{"title":"最高车速(km/h)","value":"215.00"},{"title":"官方0-100km/加速(s)","value":"-"},{"title":"工信部综合油耗(L/100km)","value":"-"},{"title":"整车质保","value":"3年/10万公里"},{"title":"加装配置","value":"-"}],"value":"baseParam"},{"itemName":"车身","itemValue":[{"title":"长度(mm)","value":"4865"},{"title":"宽度(mm)","value":"1820"},{"title":"高度(mm)","value":"1475"},{"title":"轴距(mm)","value":"2812"},{"title":"前轮距(mm)","value":"-"},{"title":"后轮距(mm)","value":"-"},{"title":"最小离地间隙(mm)","value":"-"},{"title":"整车质量(kg)","value":"1545"},{"title":"车身结构","value":"三厢车"},{"title":"车门数(个)","value":"4"},{"title":"座位数(个)","value":"5"},{"title":"油箱容积(L)","value":"70"},{"title":"行李厢容积(L)","value":"565"}],"value":"carBodyParam"},{"itemName":"发动机","itemValue":[{"title":"发动机型号","value":"-"},{"title":"排量(L)","value":"1.80"},{"title":"进气方式","value":"涡轮增压"},{"title":"气缸排列形式","value":"L"},{"title":"气缸数(个)","value":"4"},{"title":"每缸气门数(个)","value":"4"},{"title":"压缩比","value":"9.60"},{"title":"配气机构","value":"DOHC"},{"title":"缸径(mm)","value":"82.50"},{"title":"行程(mm)","value":"84.10"},{"title":"最大马力(Ps)","value":"160"},{"title":"最大功率(kW)","value":"-"},{"title":"最大功率转速(rpm)","value":"6200"},{"title":"最大扭矩(N・m)","value":"-"},{"title":"最大扭矩转速(rpm)","value":"4500"},{"title":"发动机特有技术","value":"-"},{"title":"燃料形式","value":"汽油"},{"title":"燃油标号","value":"95号"},{"title":"供油方式","value":"直喷"},{"title":"缸盖材料","value":"铝合金"},{"title":"缸体材料","value":"铸铁"},{"title":"排放标准","value":"国IV"}],"value":"engineParam"},{"itemName":"电动机","itemValue":[{"title":"电机类型","value":"-"},{"title":"电动机总功率(kW)","value":"-"},{"title":"电动机总扭矩(N・m)","value":"-"},{"title":"电动机最大功率(kW)","value":"-"},{"title":"前电动机最大扭矩(N・m)","value":"-"},{"title":"后电动机最大功率(kW)","value":"-"},{"title":"后电动机最大扭矩(N・m)","value":"-"},{"title":"系统综合功率(kW)","value":"-"},{"title":"系统综合扭矩(N・m)","value":"-"},{"title":"电池类型","value":"-"},{"title":"工信部续航里程(km)","value":"-"},{"title":"电池容量(kWh)","value":"-"},{"title":"百公里耗电量(kWh/100km)","value":"-"},{"title":"电池组质保","value":"-"},{"title":"电池充电时间","value":"-"},{"title":"快充电量(%)","value":"-"},{"title":"充电桩价格","value":"-"}],"value":"motorParam"},{"itemName":"变速箱","itemValue":[{"title":"挡位个数","value":"7"},{"title":"变速箱类型","value":"双离合变速箱(DCT)"}],"value":"gearboxParam"},{"itemName":"底盘转向","itemValue":[{"title":"驱动方式","value":"前置前驱"},{"title":"四驱形式","value":"-"},{"title":"中央差速器结构","value":"-"},{"title":"前悬架类型","value":"麦弗逊式独立悬架"},{"title":"后悬架类型","value":"多连杆式独立悬架"},{"title":"助力类型","value":"电动助力"},{"title":"车体结构","value":"承载式"}],"value":"chassisteeringParam"},{"itemName":"车轮制动","itemValue":[{"title":"前制动器类型","value":"通风盘式"},{"title":"后制动器类型","value":"盘式"},{"title":"驻车制动类型","value":"电子驻车"},{"title":"前轮胎规格","value":"215/55 R16"},{"title":"后轮胎规格","value":"215/55 R16"},{"title":"备胎规格","value":"非全尺寸●"}],"value":"wheelBrakingParam"},{"itemName":"主被动安全装备","itemValue":[{"title":"主/副驾驶座安全气囊","value":"主● / 副●"},{"title":"前/后排侧气囊","value":"前● / 后-"},{"title":"前/后排头部气囊(气帘)","value":"-"},{"title":"膝部气囊","value":"-"},{"title":"胎压监测装置","value":"●"},{"title":"零胎压继续行驶","value":"-"},{"title":"安全带未系提示","value":"●"},{"title":"ISOFIX儿童座椅接口","value":"●"},{"title":"ABS防抱死","value":"●"},{"title":"制动力分配(EBD/CBC等)","value":"●"},{"title":"刹车辅助(EBA/BAS/BA等)","value":"●"},{"title":"牵引力控制(ASR/TCS/TRC等)","value":"●"},{"title":"车身稳定控制(ESC/ESP/DSC等)","value":"●"},{"title":"并线辅助","value":"-"},{"title":"车道偏离预警系统","value":"-"},{"title":"主动刹车","value":"-"},{"title":"夜视系统","value":"-"}],"value":"safetyEquipmentParam"},{"itemName":"辅助/操控配置","itemValue":[{"title":"前驻车雷达","value":"前○ / 后-"},{"title":"后驻车雷达","value":"前○ / 后-"},{"title":"倒车视频影像","value":"-"},{"title":"全景摄像头","value":"-"},{"title":"定速巡航","value":"-"},{"title":"自适应巡航","value":"-"},{"title":"自动泊车入位","value":"-"},{"title":"发动机启停技术","value":"-"},{"title":"上坡辅助","value":"-"},{"title":"可变悬架","value":"-"},{"title":"空气悬架","value":"-"},{"title":"可变转向比","value":"-"},{"title":"前桥限滑差速器/差速锁","value":"-"},{"title":"中央差速器锁止功能","value":"-"},{"title":"后桥限滑差速器/差速锁","value":"-"},{"title":"整体主动转向系统","value":"-"}],"value":"manipulation"},{"itemName":"外部/防盗配置","itemValue":[{"title":"电动天窗","value":"●"},{"title":"全景天窗","value":"-"},{"title":"运动外观套件","value":"-"},{"title":"铝合金轮圈","value":"●"},{"title":"电动吸合门","value":"-"},{"title":"侧滑门","value":"-"},{"title":"电动后备厢","value":"-"},{"title":"感应后备厢","value":"-"},{"title":"车顶行李架","value":"-"},{"title":"发动机电子防盗","value":"●"},{"title":"车内中控锁","value":"●"},{"title":"遥控钥匙","value":"●"},{"title":"无钥匙启动系统","value":"-"},{"title":"无钥匙进入系统","value":"-"}],"value":"retrofit"},{"itemName":"内部配置","itemValue":[{"title":"真皮方向盘","value":"●"},{"title":"方向盘调节","value":"-"},{"title":"方向盘电动调节","value":"-"},{"title":"多功能方向盘","value":"●"},{"title":"方向盘换挡","value":"-"},{"title":"方向盘加热","value":"-"},{"title":"方向盘记忆","value":"-"},{"title":"行车电脑显示屏","value":"●"},{"title":"全液晶仪表盘","value":"-"},{"title":"HUD抬头数字显示","value":"-"}],"value":"innerParam"},{"itemName":"座椅配置","itemValue":[{"title":"座椅材质","value":"-"},{"title":"座椅高低调节","value":"●"},{"title":"腰部支撑调节","value":"-"},{"title":"肩部支撑调节","value":"-"},{"title":"主/副驾驶座电动调节","value":"主● / 副●"},{"title":"第二排靠背角度调节","value":"-"},{"title":"第二排座椅移动","value":"-"},{"title":"后排座椅电动调节","value":"-"},{"title":"电动座椅记忆","value":"-"},{"title":"前排座椅通风","value":"-"},{"title":"后排座椅通风","value":"-"},{"title":"前排座椅加热","value":"-"},{"title":"后排座椅加热","value":"-"},{"title":"前/后排座椅按摩","value":"-"},{"title":"第三排座椅","value":"-"},{"title":"前/后中央扶手","value":"-"},{"title":"后排杯架","value":"●"}],"value":"cgairParam"},{"itemName":"多媒体配置","itemValue":[{"title":"GPS导航系统","value":"-"},{"title":"定位互动服务","value":"-"},{"title":"中控台彩色大屏","value":"-"},{"title":"中控液晶屏分屏显示","value":"-"},{"title":"蓝牙/车载电话","value":"-"},{"title":"车载电视","value":"-"},{"title":"后排液晶屏","value":"-"},{"title":"220V/230V电源","value":"-"},{"title":"外接音源接口","value":"-"},{"title":"多媒体系统","value":"-"},{"title":"扬声器品牌","value":"-"},{"title":"扬声器数量","value":"8-9喇叭●"}],"value":"multimedia"},{"itemName":"灯光配置","itemValue":[{"title":"近光灯","value":"-"},{"title":"远光灯","value":"-"},
            {"title":"日间行车灯","value":"-"},{"title":"自适应远近光","value":"-"},{"title":"自动头灯","value":"-"},{"title":"转向辅助灯","value":"-"},{"title":"转向头灯","value":"-"},{"title":"前雾灯","value":"●"},{"title":"大灯高度可调","value":"-"},{"title":"大灯清洗装置","value":"-"},{"title":"车内氛围灯","value":"-"}],"value":"lightParam"},{"itemName":"玻璃/后视镜","itemValue":[{"title":"前/后电动车窗","value":"-"},{"title":"车窗防夹手功能","value":"●"},{"title":"防紫外线","value":"-"},{"title":"后视镜电动调节","value":"●"},{"title":"后视镜加热","value":"●"},{"title":"内/外后视镜自动防眩目","value":"-"},{"title":"后视镜电动折叠","value":"-"},{"title":"后视镜记忆","value":"-"},{"title":"后风挡遮阳帘","value":"-"},{"title":"后排侧隐私玻璃","value":"-"},{"title":"遮阳板化妆镜","value":"●"},{"title":"后雨刷","value":"-"},{"title":"感应雨刷","value":"-"}],"value":"enterWithoutKey"},{"itemName":"空调/冰箱","itemValue":[{"title":"空调控制方式","value":"-"},{"title":"后排独立空调","value":"-"},{"title":"后座出风口","value":"●"},{"title":"温度分区控制","value":"-"},{"title":"车内空气调节/花粉过滤","value":"-"},{"title":"车载冰箱","value":"-"}],"value":"refrigeration"}],"mainImg":"http://img.souche.com/0b36d4d5-8a01-4d88-8048-f85dd009c599.jpg","modelName":"大众 迈腾 2013款 1.8TSI 领先型"},{"carBaseInfoView":{"itemName":"基本信息","itemValue":[{"title":"初次上牌","value":"2015年09月"},{"title":"表显里程","value":"8.05万公里"},{"title":"排放标准","value":"国IV"},{"title":"变速箱","value":"7挡双离合"},{"title":"排量","value":"2.0T"},{"title":"颜色","value":"--"}]},"carId":"bc9f6b2ef47941e18e3db7d14bea8799","carListView":{"brandCode":"brand-15","brandName":"奥迪","buyoutPricePicturePcUrl":"http://img.souche.com/f2e/2a3f808cfdef300b63c2a83d18e4432e.png","buyoutPricePictureUrl":"http://img.souche.com/f2e/bc24cb20ecccc272ac9a827b101dbf5a.png","carBody":"SUV","carId":"bc9f6b2ef47941e18e3db7d14bea8799","carModel":"紧凑型SUV","carTagList":[],"carType":0,"cityCode":"01841","cityName":"长沙","detailUrl":"https://jia-app.souche.com/#/car/detail?carId=bc9f6b2ef47941e18e3db7d14bea8799&shopCode=005802","firstLicensePlateDate":"2015-09-01 00:00:00","firstLicensePlateDateStr":"2015年09月","hasContrast":false,"hasDownPayment":false,"hasFollow":false,"hasLeaseReorder":false,"hasRecommendedReasons":0,"isActivity":false,"isBuyoutPrice":false,"isGeneralActivity":false,"isRecommended":false,"isYichenggou":false,"mileage":80500,"mileageStr":"8.05万公里","modelName":"奥迪Q3 2015款 35 TFSI quattro 技术型","registerYear":2015,"registerYearStr":"2015年","requestId":"aVa2dPUJwf","salePrice":146800.0,"seriesCode":"series-2728","seriesImg":"http://img.souche.com/0A6C4475-CF66-4E0E-9859-171E18072DCF.jpg","seriesImgs":["http://img.souche.com/0A6C4475-CF66-4E0E-9859-171E18072DCF.jpg","http://img.souche.com/3B553DB9-A7B0-488F-A026-BA4D8C491233.jpg","http://img.souche.com/314B3641-F956-443D-889F-747FCD2EF11E.jpg","http://img.souche.com/98F10CB9-978D-4200-956D-FF36B150199F.jpg","http://img.souche.com/3D9950A5-40A0-408F-B170-96F903AC470F.jpg","http://img.souche.com/15F9F11A-EEB5-462E-A37F-90A515DFE355.jpg","http://img.souche.com/50DAD51F-FA8F-4CEE-9E00-191DB7ABDE6D.jpg","http://img.souche.com/A5CD70B6-C8B3-414D-9AC6-162651BBDDD2.jpg","http://img.souche.com/A171574C-6FB2-4EBE-A6D5-B7BB01CE7802.jpg","http://img.souche.com/1E422E3C-1314-40E2-A9BF-195FD6886B6D.jpg","http://img.souche.com/4229912F-A000-43D6-AC99-208DD4985AA5.jpg","http://img.souche.com/F2CEBADD-0FFC-49C1-93AD-52B41F1DFE5B.jpg","http://img.souche.com/0A60F002-CCF2-488A-8D11-A6C418E5C96A.jpg","http://img.souche.com/5BABBFFA-516E-4BEC-A039-4C3FD2476FF7.jpg","http://img.souche.com/F2806CBC-D7E0-42E9-8B2E-163ECDF811B7.jpg","http://img.souche.com/E5A66514-571E-43A8-9F2A-3FFA8BC4E8EB.jpg"],"seriesName":"奥迪Q3","shopCode":"005802","simpleModelName":"2015款 35 TFSI quattro 技术型","source":"app_entering","status":"13","type":"car"},"carPriceSchemeView":{"itemName":"价格方案","itemValue":[{"title":"售价","value":"14.68万"},{"title":"新车价","value":"36.23万"}]},"carStructureConfigViews":[{"itemName":"基本参数","itemValue":[{"title":"产商","value":"一汽-大众奥迪"},{"title":"级别","value":"紧凑型SUV"},{"title":"发动机","value":"2.0T 170马力 L4"},{"title":"变速箱","value":"7挡双离合"},{"title":"长*宽*高(mm)","value":"4385*1831*1589"},{"title":"车身结构","value":"SUV"},{"title":"最高车速(km/h)","value":"212.00"},{"title":"官方0-100km/加速(s)","value":"8.40"},{"title":"工信部综合油耗(L/100km)","value":"8.20"},{"title":"整车质保","value":"3年/10万公里"},{"title":"加装配置","value":"-"}],"value":"baseParam"},{"itemName":"车身","itemValue":[{"title":"长度(mm)","value":"4385"},{"title":"宽度(mm)","value":"1831"},{"title":"高度(mm)","value":"1589"},{"title":"轴距(mm)","value":"2603"},{"title":"前轮距(mm)","value":"1571"},{"title":"后轮距(mm)","value":"1575"},{"title":"最小离地间隙(mm)","value":"0"},{"title":"整车质量(kg)","value":"1670"},{"title":"车身结构","value":"SUV"},{"title":"车门数(个)","value":"5"},{"title":"座位数(个)","value":"5"},{"title":"油箱容积(L)","value":"64"},{"title":"行李厢容积(L)","value":"460"}],"value":"carBodyParam"},{"itemName":"发动机","itemValue":[{"title":"发动机型号","value":"-"},{"title":"排量(L)","value":"2.00"},{"title":"进气方式","value":"涡轮增压"},{"title":"气缸排列形式","value":"L"},{"title":"气缸数(个)","value":"4"},{"title":"每缸气门数(个)","value":"4"},{"title":"压缩比","value":"0.00"},{"title":"配气机构","value":"DOHC"},{"title":"缸径(mm)","value":"0.00"},{"title":"行程(mm)","value":"0.00"},{"title":"最大马力(Ps)","value":"170"},{"title":"最大功率(kW)","value":"-"},{"title":"最大功率转速(rpm)","value":"6200"},{"title":"最大扭矩(N・m)","value":"-"},{"title":"最大扭矩转速(rpm)","value":"4200"},{"title":"发动机特有技术","value":"-"},{"title":"燃料形式","value":"汽油"},{"title":"燃油标号","value":"95号"},{"title":"供油方式","value":"直喷"},{"title":"缸盖材料","value":"铝合金"},{"title":"缸体材料","value":"铸铁"},{"title":"排放标准","value":"国IV"}],"value":"engineParam"},{"itemName":"电动机","itemValue":[{"title":"电机类型","value":"-"},{"title":"电动机总功率(kW)","value":"-"},{"title":"电动机总扭矩(N・m)","value":"-"},{"title":"电动机最大功率(kW)","value":"-"},{"title":"前电动机最大扭矩(N・m)","value":"-"},{"title":"后电动机最大功率(kW)","value":"-"},{"title":"后电动机最大扭矩(N・m)","value":"-"},{"title":"系统综合功率(kW)","value":"-"},{"title":"系统综合扭矩(N・m)","value":"-"},{"title":"电池类型","value":"-"},{"title":"工信部续航里程(km)","value":"-"},{"title":"电池容量(kWh)","value":"-"},{"title":"百公里耗电量(kWh/100km)","value":"-"},{"title":"电池组质保","value":"-"},{"title":"电池充电时间","value":"-"},{"title":"快充电量(%)","value":"-"},{"title":"充电桩价格","value":"-"}],"value":"motorParam"},{"itemName":"变速箱","itemValue":[{"title":"挡位个数","value":"7"},{"title":"变速箱类型","value":"双离合变速箱(DCT)"}],"value":"gearboxParam"},{"itemName":"底盘转向","itemValue":[{"title":"驱动方式","value":"前置四驱"},{"title":"四驱形式","value":"全时四驱"},{"title":"中央差速器结构","value":"多片离合器"},{"title":"前悬架类型","value":"麦弗逊式独立悬架"},{"title":"后悬架类型","value":"四连杆独立悬架"},{"title":"助力类型","value":"电动助力"},{"title":"车体结构","value":"承载式"}],"value":"chassisteeringParam"},{"itemName":"车轮制动","itemValue":[{"title":"前制动器类型","value":"通风盘式"},{"title":"后制动器类型","value":"盘式"},{"title":"驻车制动类型","value":"电子驻车"},{"title":"前轮胎规格","value":"235/55 R17"},{"title":"后轮胎规格","value":"235/55 R17"},{"title":"备胎规格","value":"非全尺寸●"}],"value":"wheelBrakingParam"},{"itemName":"主被动安全装备","itemValue":[{"title":"主/副驾驶座安全气囊","value":"主● / 副●"},{"title":"前/后排侧气囊","value":"前● / 后-"},{"title":"前/后排头部气囊(气帘)","value":"-"},{"title":"膝部气囊","value":"-"},{"title":"胎压监测装置","value":"●"},{"title":"零胎压继续行驶","value":"-"},{"title":"安全带未系提示","value":"●"},{"title":"ISOFIX儿童座椅接口","value":"●"},{"title":"ABS防抱死","value":"●"},{"title":"制动力分配(EBD/CBC等)","value":"●"},{"title":"刹车辅助(EBA/BAS/BA等)","value":"●"},{"title":"牵引力控制(ASR/TCS/TRC等)","value":"●"},{"title":"车身稳定控制(ESC/ESP/DSC等)","value":"●"},{"title":"并线辅助","value":"-"},{"title":"车道偏离预警系统","value":"-"},{"title":"主动刹车","value":"-"},{"title":"夜视系统","value":"-"}],"value":"safetyEquipmentParam"},{"itemName":"辅助/操控配置","itemValue":[{"title":"前驻车雷达","value":"前○ / 后-"},{"title":"后驻车雷达","value":"前○ / 后-"},{"title":"倒车视频影像","value":"-"},{"title":"全景摄像头","value":"-"},{"title":"定速巡航","value":"-"},{"title":"自适应巡航","value":"-"},{"title":"自动泊车入位","value":"-"},{"title":"发动机启停技术","value":"●"},{"title":"上坡辅助","value":"●"},{"title":"可变悬架","value":"-"},{"title":"空气悬架","value":"-"},{"title":"可变转向比","value":"-"},{"title":"前桥限滑差速器/差速锁","value":"-"},{"title":"中央差速器锁止功能","value":"-"},{"title":"后桥限滑差速器/差速锁","value":"-"},{"title":"整体主动转向系统","value":"-"}],"value":"manipulation"},{"itemName":"外部/防盗配置","itemValue":[{"title":"电动天窗","value":"-"},{"title":"全景天窗","value":"●"},{"title":"运动外观套件","value":"-"},{"title":"铝合金轮圈","value":"●"},{"title":"电动吸合门","value":"-"},{"title":"侧滑门","value":"-"},{"title":"电动后备厢","value":"-"},{"title":"感应后备厢","value":"-"},{"title":"车顶行李架","value":"●"},{"title":"发动机电子防盗","value":"●"},{"title":"车内中控锁","value":"●"},{"title":"遥控钥匙","value":"●"},{"title":"无钥匙启动系统","value":"-"},{"title":"无钥匙进入系统","value":"-"}],"value":"retrofit"},{"itemName":"内部配置","itemValue":[{"title":"真皮方向盘","value":"●"},{"title":"方向盘调节","value":"-"},{"title":"方向盘电动调节","value":"-"},{"title":"多功能方向盘","value":"●"},{"title":"方向盘换挡","value":"-"},{"title":"方向盘加热","value":"-"},{"title":"方向盘记忆","value":"-"},{"title":"行车电脑显示屏","value":"●"},{"title":"全液晶仪表盘","value":"-"},{"title":"HUD抬头数字显示","value":"-"}],"value":"innerParam"},{"itemName":"座椅配置","itemValue":[{"title":"座椅材质","value":"-"},{"title":"座椅高低调节","value":"●"},{"title":"腰部支撑调节","value":"-"},{"title":"肩部支撑调节","value":"-"},{"title":"主/副驾驶座电动调节","value":"主● / 副●"},{"title":"第二排靠背角度调节","value":"-"},{"title":"第二排座椅移动","value":"-"},{"title":"后排座椅电动调节","value":"-"},{"title":"电动座椅记忆","value":"-"},{"title":"前排座椅通风","value":"-"},{"title":"后排座椅通风","value":"-"},{"title":"前排座椅加热","value":"前- / 后●"},{"title":"后排座椅加热","value":"前- / 后●"},{"title":"前/后排座椅按摩","value":"-"},{"title":"第三排座椅","value":"-"},{"title":"前/后中央扶手","value":"-"},{"title":"后排杯架","value":"●"}],"value":"cgairParam"},{"itemName":"多媒体配置","itemValue":[{"title":"GPS导航系统","value":"-"},{"title":"定位互动服务","value":"-"},{"title":"中控台彩色大屏","value":"-"},{"title":"中控液晶屏分屏显示","value":"-"},{"title":"蓝牙/车载电话","value":"-"},{"title":"车载电视","value":"-"},{"title":"后排液晶屏","value":"-"},{"title":"220V/230V电源","value":"-"},{"title":"外接音源接口","value":"-"},{"title":"多媒体系统","value":"-"},{"title":"扬声器品牌","value":"BOSE○"},
            {"title":"扬声器数量","value":"10-11喇叭●/≥12喇叭○"}],"value":"multimedia"},{"itemName":"灯光配置","itemValue":[{"title":"近光灯","value":"-"},{"title":"远光灯","value":"-"},{"title":"日间行车灯","value":"●"},{"title":"自适应远近光","value":"-"},{"title":"自动头灯","value":"●"},{"title":"转向辅助灯","value":"-"},{"title":"转向头灯","value":"-"},{"title":"前雾灯","value":"●"},{"title":"大灯高度可调","value":"●"},{"title":"大灯清洗装置","value":"●"},{"title":"车内氛围灯","value":"-"}],"value":"lightParam"},{"itemName":"玻璃/后视镜","itemValue":[{"title":"前/后电动车窗","value":"-"},{"title":"车窗防夹手功能","value":"●"},{"title":"防紫外线","value":"-"},{"title":"后视镜电动调节","value":"●"},{"title":"后视镜加热","value":"●"},{"title":"内/外后视镜自动防眩目","value":"-"},{"title":"后视镜电动折叠","value":"●"},{"title":"后视镜记忆","value":"-"},{"title":"后风挡遮阳帘","value":"-"},{"title":"后排侧隐私玻璃","value":"-"},{"title":"遮阳板化妆镜","value":"●"},{"title":"后雨刷","value":"●"},{"title":"感应雨刷","value":"●"}],"value":"enterWithoutKey"},{"itemName":"空调/冰箱","itemValue":[{"title":"空调控制方式","value":"-"},{"title":"后排独立空调","value":"-"},
            {"title":"后座出风口","value":"●"},{"title":"温度分区控制","value":"●"},{"title":"车内空气调节/花粉过滤","value":"-"},{"title":"车载冰箱","value":"-"}],"value":"refrigeration"}],"mainImg":"http://img.souche.com/0A6C4475-CF66-4E0E-9859-171E18072DCF.jpg","modelName":"奥迪Q3 2015款 35 TFSI quattro 技术型"}];

            this.cars = this.transformRes(data);
            
            
        },
       
        shallowCompare (data = []) {
            let bRet = true;

            if (data.length) {
                const keys = Object.keys(data[0]).filter(k => k !== 'carId');

                for (let i = 0; i < keys.length; i++) {
                    const key = keys[i];
                    let isEqual = true;

                    for (let j = 0; j < data.length; j++) {
                        if (data[j][key] !== data[0][key]) {
                            isEqual = false;
                            break;
                        }
                    }

                    if (!isEqual) {
                        bRet = false;
                        break;
                    }
                }
            } else {
                //do something else
            }

            return bRet;
        },
        hideCommonAccordion (prop) {
            return !this.hideCommons || !this.shallowCompare(this.getAccordionData(prop));
        },
        getIsSame (data, row) {
            const items = data.map(d => d[row]);
            let bRet = true;
            for (let i = 1; i < items.length; i++) {
                if (items[i] !== items[0]) {
                    bRet = false;
                    break;
                }
            }

            return bRet;
        },
        //判断某个元素是否有某一个class类
        hasClassName (element, className) {
            return element.className.indexOf(className) > -1;
        },
        //判断浏览器是否兼容sticky属性
        checkIsSupportSticky () {
            let prefixList = ['', '-webkit-'];
            let stickyStyleText = '';
            for (let i = 0; i < prefixList.length; i++) {
                stickyStyleText += 'position:' + prefixList[i] + 'sticky;';
            }
            let divTestDom = document.createElement('div');
            divTestDom.style.cssText = stickyStyleText;
            document.body.appendChild(divTestDom);
            const isSupport = /sticky/i.test(window.getComputedStyle(divTestDom).position);
            this.isSupportSticky = isSupport;
            document.body.removeChild(divTestDom);
            divTestDom = null;
            return isSupport;
        },
        stickyCompatible () {
            let carTableWrapTop = 100;
            window.onscroll = throttle(() => {
                let scropllTop = document.documentElement.scrollTop || document.body.scrollTop;
                if (scropllTop > carTableWrapTop) {
                    this.$refs.carTableWrap.style.position = "fixed";
                    this.$refs.carTableWrap.style.right = "0";
                    this.$refs.carTableWrap.style.left = "0";
                } else {
                    this.$refs.carTableWrap.style.position = "static";
                    this.$refs.widgetInnerWrap.style.top = -scropllTop + "px";
                }
            }, 10);

        }
    },
    beforeDestroy () {
        this.unBindScroll();
    },
    watch: {
        cars () {
            this.$nextTick(() => {
                this.unBindScroll = this.bindScroll();
            });
        }
    },
    mounted () {
        this.$nextTick(() => {
            this.unBindScroll = this.bindScroll();
        });
        this.getCarDetailsAsync();
       
        !this.checkIsSupportSticky() && this.stickyCompatible(); //sticky 属性兼容


    }
}
</script>

<style lang="less">
.car-pk-detail-wrap {
    .widget-inner-wrap {
        //width: 1.9rem;
        //height: 3.6rem;
        width: 95px;
        height: 180px;
        display: inline-block;
        background: #fff;
        position: fixed;
        left: 0;
        z-index: 10;
    }
    .space-div {
        width: 100%;
        // height: 2rem;
        height: 100px;
    }
    .som-switch {
        display: flex;
        flex-flow: column;
        flex-direction: column-reverse;

        .som-switch__ft__input {
            border: 1px solid #eee;
            //width: 1.02rem;
            width: 51px;
            //height: 0.66rem;
            height: 33px;
            //border-radius: 0.48rem;
            border-radius: 24px;

            &::before {
                display: none;
            }

            &::after {
                //width: 0.56rem;
                width: 28px;
                // height: 0.56rem;
                height: 28px;
                //border-radius: 0.56rem;
                border-radius: 28px;
                display: inline-block;
                //top: 0.04rem;
                top: 2px;
            }
            &:checked::after {
                //transform: translateX(0.44rem);
                transform: translateX(22px);
            }
        }
        .som-list-item-label {
            color: #8d8e99;
            //font-size: 0.24rem;
            font-size: 12px;
        }
        .som-list-item__bd {
            // padding: 0.14rem 0 0;
            padding: 7px 0 0;
        }
        &::before {
            display: none !important;
        }
    }

    .car-table-wrap {
        overflow-x: auto;
        -webkit-overflow-scrolling: touch;
        position: sticky;
        //top: -2rem;
        top: -100px;
        z-index: 2;
        white-space: nowrap;
        background: #fff;
        transform: translateZ(0);

        .widget-wrap {
            //width: 1.9rem;
            //height: 3.6rem;
            width: 95px;
            height: 180px;
            position: sticky;
            left: 0;
            display: inline-block;
            background: #fff;
            z-index: 2;
        }

        .card-wrap {
            display: inline-block;
            vertical-align: top;

            .placeholder {
                //width: 1.9rem;
                width: 95px;
            }
            .car-card {
                //width: 2.56rem;
                width: 128px;
                //height: 3.6rem;
                height: 180px;
                display: inline-block;
                vertical-align: top;
            }
        }
    }

    //overrides component styles
    .jupiter-horizontal-table {
        width: 100%;

        .jupiter-table-row {
            .custom-cell {
                & > span {
                    // padding: 0 0.32rem;
                    padding: 0 16px;
                }
            }

            .icon-wrap {
                display: inline-block;
                //width: 0.26rem;
                width: 13px;
                //height: 0.26rem;
                height: 13px;
                //line-height: 0.26rem;
                line-height: 13px;
                text-align: center;
                // border-radius: 0.26rem;
                border-radius: 13px;
                color: #fff;
            }

            .issue-wrap {
                .icon-wrap {
                    background: #ffc400;
                }
                & > label {
                    //margin: 0 0 0 0.08rem;
                    margin: 0 0 0 4px;
                }
            }

            .reorganize-wrap {
                .icon-wrap {
                    background: #1dbf6e;
                }
                & > label {
                    //margin: 0 0 0 0.08rem;
                    margin: 0 0 0 4px;
                }
            }

            .feature-wrap {
                //margin: 0 0.26rem;
                margin: 0 13px;

                & > li {
                    // font-size: 0.2rem;
                    font-size: 10px;
                    margin: 5px 0;
                    // margin: 0.1rem 0;

                    & > span {
                        color: #5e5e66;
                        // padding: 0 0.08rem;
                        padding: 0 4px;
                        background: #f2f3f5;
                        //border-radius: 1rem;
                        border-radius: 50px;
                    }
                }
            }
        }
    }

    .engine-accordion-widgets {
        // margin: 0 0.4rem 0;
        margin: 0 20px 0;
        color: #5e5e66;
        //font-size: 0.24rem;
        font-size: 12px;

        & > span {
            //margin: 0 0.15rem;
            margin: 0 7.5px;
        }
    }

    .car-card {
        .car-img {
            display: inline-block;
            overflow: hidden;
            //border-radius: 0.1rem;
            border-radius: 5px;
            //height: 2rem;
            height: 100px;
            box-sizing: border-box;
            width: 100%;
            //padding: 0.16rem 0.08rem;
            padding: 8px 4px;

            & > img {
                width: 100%;
                height: auto;
                display: block;
                //border-radius: 0.1rem;
                border-radius: 5px;
            }
        }

        & > p {
            // padding: 0 0.16rem;
            padding: 0 8px;
            // font-size: 0.26rem;
            font-size: 13px;
            font-weight: 700;
            white-space: normal;
        }
    }

    .flow-desc-list {
        // padding: 0 0.4rem;
        padding: 0 20px;

        & > li {
            list-style-type: decimal;
            //padding: 0.08rem 0;
            padding: 4px 0;
            //font-size: 0.24rem;
            font-size: 12px;
            color: #5e5e66;
        }
    }
}
</style>

