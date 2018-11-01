// 解析字符串的方式计算
//function calFAT(img) {
//    // select的为波段信息
//    var sur_refl_b01  = img.select("sur_refl_b01");
//    var sur_refl_b02 = img.select("sur_refl_b02");
//    var sur_refl_b05 = img.select("sur_refl_b05");
//    var FAI = img.expression(
//      "sur_refl_b02 - (sur_refl_b01 + sur_refl_b05 - sur_refl_b01 * (sur_refl_b02 - sur_refl_b01)/(sur_refl_b05 - sur_refl_b01))",
//      {
//        "sur_refl_b01": sur_refl_b01,
//        "sur_refl_b02": sur_refl_b02,
//        "sur_refl_b05": sur_refl_b05
//      }
//    );
//    return FAI;
//   }

// 运用image内置的运算符计算
// CHL_A模型01
function calFAT(img) {
    // select的为波段信息
    var b1 = img.select("sur_refl_b01");
    var b2 = img.select("sur_refl_b02");
    var b5 = img.select("sur_refl_b05");
    var FAI = b2.subtract(b1.add(b5).subtract(b1.multiply(b2.subtract(b1).divide(b5.subtract(b1)))));
    // a.exp()直接就是e的a次方
    var CHL_A = FAI.multiply(110.89).exp().multiply(12.237);
    return CHL_A;
   }

// CHL_A模型02
function calChl_a02(img){
  var b1 = img.select("sur_refl_b01");
  var b2 = img.select("sur_refl_b02");
  var b3 = img.select("sur_refl_b03");
  var APPEL = b2.subtract(b3.subtract(b2).multiply(b2).add(b1).subtract(b2));
  var CHL_A = APPEL.multiply(28.176).exp().multiply(8.5739);
  return CHL_A
}

// CHL_A模型03
//function calChl_a02(img){
//  var b1 = img.select("sur_refl_b01");
//  var b3 = img.select("sur_refl_b03");
//  var b4 = img.select("sur_refl_b04");
//  var b11 = img.select("sur_refl_b11");
//  var b10 = img.select("sur_refl_b10");
//  //lnChla = 
//
//}
   
// 学长找到的modis的图像集
var part = ee.ImageCollection("MODIS/006/MYD09A1").filterDate('2017-12-1','2018-1-1').median();
// gee提供的提取后的水体图像，用来制作掩膜
var gsw = ee.Image('JRC/GSW1_0/GlobalSurfaceWater');
// 制作掩膜并将modis图像的值附在掩膜上
var occurrence = gsw.select('occurrence');
var water_mask = occurrence.gt(50).unmask(0);
var maskedComposite = part.updateMask(water_mask);
var VIS_OCCURRENCE = {
    min:0,
    max:50,
    palette: ['red', 'blue']
  };

var VIS_WATER_MASK = {
    palette: ['white', 'black']
  };
// 计算FAI
var FAIResult = calChl_a02(maskedComposite);
// 显示a

Map.setCenter(33.04, 0.49,3)

Map.addLayer(
    {
        eeObject:FAIResult,
        name:'CHL-A指数计算结果',
        visParams: VIS_OCCURRENCE
    }
);

Map.addLayer({
  eeObject: water_mask,
  visParams: VIS_WATER_MASK,
  name: '50% occurrence water mask'
});
Map.addLayer({
  eeObject: occurrence.updateMask(occurrence.divide(100)),
  name: "Water Occurrence (1984-2015)",
  visParams: VIS_OCCURRENCE
});