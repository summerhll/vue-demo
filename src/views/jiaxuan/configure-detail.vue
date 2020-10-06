<style lang="less">
.pg-basic-equipment-wrapper {
  h3 {
    font-size: 13px;
    margin: 0;
    font-weight: normal;
    line-height: 35px;
    padding-left: 14px;
    color: #e12c35;
    background: #fff;
  }
  .basic-equipment-content {
    box-sizing: border-box;
    padding-bottom: 54px;
  }
}
</style>
<template>
  <div class="pg-basic-equipment-wrapper">
    <div class="basic-equipment-content">
      <h3>*车型配置仅供参考, 具体配置以实车为准</h3>
      <configure-detail v-for="(item, index) in items" :key="index" :detail="item"></configure-detail>
    </div>
  </div>
</template>
<script>
import ConfigureDetail from "@/components/configure-detail/index";
export default {
  name: "basic-equipment",

  data() {
    return {
      items: []
    };
  },
  components: {
    ConfigureDetail
  },

  methods: {
    getData() {
      let configInfoDetails = [
        {
          itemName: "基本参数",
          itemValue: [
            { title: "产商", value: "奔驰(进口)" },
            { title: "级别", value: "紧凑型车" },
            { title: "发动机", value: "1.6T 122马力 L4" },
            { title: "变速箱", value: "7挡双离合" },
            { title: "长*宽*高(mm)", value: "4359*1786*1558" },
            { title: "车身结构", value: "两厢车" },
            { title: "最高车速(km/h)", value: "190.00" },
            { title: "官方0-100km/加速(s)", value: "10.20" },
            { title: "工信部综合油耗(L/100km)", value: "6.20" },
            { title: "整车质保", value: "3年/不限公里" },
            { title: "加装配置", value: "-" }
          ],
          value: "baseParam"
        },
        {
          itemName: "车身",
          itemValue: [
            { title: "长度(mm)", value: "4359" },
            { title: "宽度(mm)", value: "1786" },
            { title: "高度(mm)", value: "1558" },
            { title: "轴距(mm)", value: "2699" },
            { title: "前轮距(mm)", value: "1552" },
            { title: "后轮距(mm)", value: "1549" },
            { title: "最小离地间隙(mm)", value: "-" },
            { title: "整车质量(kg)", value: "1494" },
            { title: "车身结构", value: "两厢车" },
            { title: "车门数(个)", value: "5" },
            { title: "座位数(个)", value: "5" },
            { title: "油箱容积(L)", value: "50" },
            { title: "行李厢容积(L)", value: "488" }
          ],
          value: "carBodyParam"
        },
        {
          itemName: "发动机",
          itemValue: [
            { title: "发动机型号", value: "M270" },
            { title: "排量(L)", value: "1.60" },
            { title: "进气方式", value: "涡轮增压" },
            { title: "气缸排列形式", value: "L" },
            { title: "气缸数(个)", value: "4" },
            { title: "每缸气门数(个)", value: "4" },
            { title: "压缩比", value: "10.30" },
            { title: "配气机构", value: "DOHC" },
            { title: "缸径(mm)", value: "-" },
            { title: "行程(mm)", value: "-" },
            { title: "最大马力(Ps)", value: "122" },
            { title: "最大功率(kW)", value: "-" },
            { title: "最大功率转速(rpm)", value: "5000" },
            { title: "最大扭矩(N・m)", value: "-" },
            { title: "最大扭矩转速(rpm)", value: "4000" },
            { title: "发动机特有技术", value: "-" },
            { title: "燃料形式", value: "汽油" },
            { title: "燃油标号", value: "95号" },
            { title: "供油方式", value: "直喷" },
            { title: "缸盖材料", value: "铝合金" },
            { title: "缸体材料", value: "铝合金" },
            { title: "排放标准", value: "国IV" }
          ],
          value: "engineParam"
        },
        {
          itemName: "电动机",
          itemValue: [
            { title: "电机类型", value: "-" },
            { title: "电动机总功率(kW)", value: "-" },
            { title: "电动机总扭矩(N・m)", value: "-" },
            { title: "电动机最大功率(kW)", value: "-" },
            { title: "前电动机最大扭矩(N・m)", value: "-" },
            { title: "后电动机最大功率(kW)", value: "-" },
            { title: "后电动机最大扭矩(N・m)", value: "-" },
            { title: "系统综合功率(kW)", value: "-" },
            { title: "系统综合扭矩(N・m)", value: "-" },
            { title: "电池类型", value: "-" },
            { title: "工信部续航里程(km)", value: "-" },
            { title: "电池容量(kWh)", value: "-" },
            { title: "百公里耗电量(kWh/100km)", value: "-" },
            { title: "电池组质保", value: "-" },
            { title: "电池充电时间", value: "-" },
            { title: "快充电量(%)", value: "-" },
            { title: "充电桩价格", value: "-" }
          ],
          value: "motorParam"
        },
        {
          itemName: "变速箱",
          itemValue: [
            { title: "挡位个数", value: "7" },
            { title: "变速箱类型", value: "双离合变速箱(DCT)" }
          ],
          value: "gearboxParam"
        },
        {
          itemName: "底盘转向",
          itemValue: [
            { title: "驱动方式", value: "前置前驱" },
            { title: "四驱形式", value: "-" },
            { title: "中央差速器结构", value: "-" },
            { title: "前悬架类型", value: "麦弗逊式独立悬架" },
            { title: "后悬架类型", value: "多连杆式独立悬架" },
            { title: "助力类型", value: "电动助力" },
            { title: "车体结构", value: "承载式" }
          ],
          value: "chassisteeringParam"
        },
        {
          itemName: "车轮制动",
          itemValue: [
            { title: "前制动器类型", value: "通风盘式" },
            { title: "后制动器类型", value: "盘式" },
            { title: "驻车制动类型", value: "电子驻车" },
            { title: "前轮胎规格", value: "225/50 R16 " },
            { title: "后轮胎规格", value: "225/50 R16 " },
            { title: "备胎规格", value: "无" }
          ],
          value: "wheelBrakingParam"
        },
        {
          itemName: "主被动安全装备",
          itemValue: [
            { title: "主/副驾驶座安全气囊", value: "主● / 副●" },
            { title: "前/后排侧气囊", value: "前● / 后-" },
            { title: "前/后排头部气囊(气帘)", value: "前● / 后●" },
            { title: "膝部气囊", value: "●" },
            { title: "胎压监测装置", value: "●" },
            { title: "零胎压继续行驶", value: "●" },
            { title: "安全带未系提示", value: "●" },
            { title: "ISOFIX儿童座椅接口", value: "●" },
            { title: "ABS防抱死", value: "●" },
            { title: "制动力分配(EBD/CBC等)", value: "●" },
            { title: "刹车辅助(EBA/BAS/BA等)", value: "●" },
            { title: "牵引力控制(ASR/TCS/TRC等)", value: "●" },
            { title: "车身稳定控制(ESC/ESP/DSC等)", value: "●" },
            { title: "并线辅助", value: "-" },
            { title: "车道偏离预警系统", value: "-" },
            { title: "主动刹车", value: "-" },
            { title: "夜视系统", value: "-" }
          ],
          value: "safetyEquipmentParam"
        },
        {
          itemName: "辅助/操控配置",
          itemValue: [
            { title: "前驻车雷达", value: "前● / 后●" },
            { title: "后驻车雷达", value: "前● / 后●" },
            { title: "倒车视频影像", value: "-" },
            { title: "全景摄像头", value: "-" },
            { title: "定速巡航", value: "●" },
            { title: "自适应巡航", value: "-" },
            { title: "自动泊车入位", value: "●" },
            { title: "发动机启停技术", value: "●" },
            { title: "上坡辅助", value: "-" },
            { title: "可变悬架", value: "-" },
            { title: "空气悬架", value: "-" },
            { title: "可变转向比", value: "-" },
            { title: "前桥限滑差速器/差速锁", value: "-" },
            { title: "中央差速器锁止功能", value: "-" },
            { title: "后桥限滑差速器/差速锁", value: "-" },
            { title: "整体主动转向系统", value: "-" }
          ],
          value: "manipulation"
        },
        {
          itemName: "外部/防盗配置",
          itemValue: [
            { title: "电动天窗", value: "-" },
            { title: "全景天窗", value: "●" },
            { title: "运动外观套件", value: "-" },
            { title: "铝合金轮圈", value: "●" },
            { title: "电动吸合门", value: "-" },
            { title: "侧滑门", value: "-" },
            { title: "电动后备厢", value: "-" },
            { title: "感应后备厢", value: "-" },
            { title: "车顶行李架", value: "-" },
            { title: "发动机电子防盗", value: "●" },
            { title: "车内中控锁", value: "●" },
            { title: "遥控钥匙", value: "●" },
            { title: "无钥匙启动系统", value: "-" },
            { title: "无钥匙进入系统", value: "-" }
          ],
          value: "retrofit"
        },
        {
          itemName: "内部配置",
          itemValue: [
            { title: "真皮方向盘", value: "-" },
            { title: "方向盘调节", value: "-" },
            { title: "方向盘电动调节", value: "-" },
            { title: "多功能方向盘", value: "●" },
            { title: "方向盘换挡", value: "●" },
            { title: "方向盘加热", value: "-" },
            { title: "方向盘记忆", value: "-" },
            { title: "行车电脑显示屏", value: "●" },
            { title: "全液晶仪表盘", value: "-" },
            { title: "HUD抬头数字显示", value: "-" }
          ],
          value: "innerParam"
        },
        {
          itemName: "座椅配置",
          itemValue: [
            { title: "座椅材质", value: "-" },
            { title: "座椅高低调节", value: "●" },
            { title: "腰部支撑调节", value: "-" },
            { title: "肩部支撑调节", value: "-" },
            { title: "主/副驾驶座电动调节", value: "主● / 副●" },
            { title: "第二排靠背角度调节", value: "-" },
            { title: "第二排座椅移动", value: "-" },
            { title: "后排座椅电动调节", value: "-" },
            { title: "电动座椅记忆", value: "●" },
            { title: "前排座椅通风", value: "-" },
            { title: "后排座椅通风", value: "-" },
            { title: "前排座椅加热", value: "-" },
            { title: "后排座椅加热", value: "-" },
            { title: "前/后排座椅按摩", value: "-" },
            { title: "第三排座椅", value: "-" },
            { title: "前/后中央扶手", value: "前● / 后-" },
            { title: "后排杯架", value: "-" }
          ],
          value: "cgairParam"
        },
        {
          itemName: "多媒体配置",
          itemValue: [
            { title: "GPS导航系统", value: "-" },
            { title: "定位互动服务", value: "-" },
            { title: "中控台彩色大屏", value: "●" },
            { title: "中控液晶屏分屏显示", value: "-" },
            { title: "蓝牙/车载电话", value: "●" },
            { title: "车载电视", value: "-" },
            { title: "后排液晶屏", value: "-" },
            { title: "220V/230V电源", value: "-" },
            { title: "外接音源接口", value: "-" },
            { title: "多媒体系统", value: "多碟CD●" },
            { title: "扬声器品牌", value: "-" },
            { title: "扬声器数量", value: "8-9喇叭●" }
          ],
          value: "multimedia"
        },
        {
          itemName: "灯光配置",
          itemValue: [
            { title: "近光灯", value: "-" },
            { title: "远光灯", value: "-" },
            { title: "日间行车灯", value: "-" },
            { title: "自适应远近光", value: "-" },
            { title: "自动头灯", value: "●" },
            { title: "转向辅助灯", value: "-" },
            { title: "转向头灯", value: "-" },
            { title: "前雾灯", value: "-" },
            { title: "大灯高度可调", value: "●" },
            { title: "大灯清洗装置", value: "-" },
            { title: "车内氛围灯", value: "-" }
          ],
          value: "lightParam"
        },
        {
          itemName: "玻璃/后视镜",
          itemValue: [
            { title: "前/后电动车窗", value: "前● / 后●" },
            { title: "车窗防夹手功能", value: "●" },
            { title: "防紫外线", value: "-" },
            { title: "后视镜电动调节", value: "●" },
            { title: "后视镜加热", value: "●" },
            { title: "内/外后视镜自动防眩目", value: "-" },
            { title: "后视镜电动折叠", value: "-" },
            { title: "后视镜记忆", value: "●" },
            { title: "后风挡遮阳帘", value: "-" },
            { title: "后排侧隐私玻璃", value: "-" },
            { title: "遮阳板化妆镜", value: "●" },
            { title: "后雨刷", value: "●" },
            { title: "感应雨刷", value: "-" }
          ],
          value: "enterWithoutKey"
        },
        {
          itemName: "空调/冰箱",
          itemValue: [
            { title: "空调控制方式", value: "-" },
            { title: "后排独立空调", value: "-" },
            { title: "后座出风口", value: "-" },
            { title: "温度分区控制", value: "-" },
            { title: "车内空气调节/花粉过滤", value: "●" },
            { title: "车载冰箱", value: "-" }
          ],
          value: "refrigeration"
        }
      ];

      for (var index in configInfoDetails) {
        var list = [];
        let tempDic1 = { name: "", value: "", list: [] };
        tempDic1.name = configInfoDetails[index].itemName;
        tempDic1.value = configInfoDetails[index].value;
        let valuesAry = configInfoDetails[index].itemValue;
        for (var item in valuesAry) {
          let tempDic = { name: "", value: "" };
          tempDic.name = valuesAry[item].title;
          tempDic.value = valuesAry[item].value;
          list.push(tempDic);
        }
        tempDic1.list = list;
        this.items.push(tempDic1);
      }
    }
  },
  mounted() {
    this.getData();
  }
};
</script>


