
// 运用image内置的运算符计算
// 悬浮物浓度01，姜杰
function calSuspend(img) {
    // select的为波段信息
    var b1 = img.select("B1");
    var b4 = img.select("B4");
    var suspend =b4.divide(b1).multiply(3.6913).add(0.6028); 
    return suspend;
   }

function calSuspend02(img){
  var b2 = img.select("B2");
  var b3 = img.select("B3");
  var suspend = b3.divide(b2).subtract(0.2454).divide(0.1683).exp().divide(1000);
  return suspend;
}

// 学长找到的modis的图像集
var part = ee.ImageCollection("LANDSAT/LC08/C01/T1_SR").filterDate('2017-12-1','2018-1-1').median();
// gee提供的提取后的水体图像，用来制作掩膜
var gsw = ee.Image('JRC/GSW1_0/GlobalSurfaceWater');
// 制作掩膜并将modis图像的值附在掩膜上
var occurrence = gsw.select('occurrence');
var water_mask = occurrence.gt(50).unmask(0);
var maskedComposite = part.updateMask(water_mask);
var VIS_OCCURRENCE = {
    min:0,
    max:10,
    palette: ['red', 'blue']
  };

var VIS_WATER_MASK = {
    palette: ['white', 'black']
  };
// 计算FAI
var ssResult01 = calSuspend(maskedComposite);
var ssResult02 = calSuspend02(maskedComposite);

// 显示a

Map.setCenter(33.04, 0.49,3)

Map.addLayer(
    {
        eeObject:ssResult01,
        name:'悬浮物浓度模型01',
        visParams: VIS_OCCURRENCE
    }
);

Map.addLayer(
  {
      eeObject:ssResult02,
      name:'悬浮物浓度模型02',
      visParams: VIS_OCCURRENCE
  }
);

//Map.addLayer({
//  eeObject: water_mask,
//  visParams: VIS_WATER_MASK,
//  name: '70% occurrence water mask'
//});
//Map.addLayer({
//  eeObject: occurrence.updateMask(occurrence.divide(100)),
//  name: "Water Occurrence (1984-2015)",
//  visParams: VIS_OCCURRENCE
//});