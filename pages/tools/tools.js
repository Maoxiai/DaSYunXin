// 工具箱分类：电子电路 / 嵌入式开发 / 计算机基础
const categories = [
  {
    name: '电子电路',
    tools: [
      { id: 'resistor', icon: '🎨', name: '色环电阻计算', desc: '4/5/6 环阻值识读' },
      { id: 'ohm', icon: '🔌', name: '欧姆定律', desc: 'V/I/R/P 任填两项' },
      { id: 'divider', icon: '⚡', name: '分压计算', desc: '任填三项求第四项' },
      { id: 'led', icon: '💡', name: 'LED 限流电阻', desc: '阻值计算与推荐' },
      { id: 'rc', icon: '⏳', name: 'RC 时间常数', desc: '充放电与滤波频率' },
      { id: 'parallel', icon: '🔀', name: '电阻并联', desc: '多电阻并联总阻值' },
      { id: 'capacitor', icon: '🔆', name: '电容串并联', desc: '串/并联总电容' },
      { id: 'ne555', icon: '🕐', name: '555 定时器', desc: '无稳态/单稳态' }
    ]
  },
  {
    name: '嵌入式开发',
    tools: [
      { id: 'timer', icon: '⏱️', name: '定时器计算', desc: 'STM32 PSC/ARR' },
      { id: 'pwm', icon: '〰️', name: 'PWM 计算', desc: '频率/分辨率/占空比' },
      { id: 'adc', icon: '📊', name: 'ADC 换算', desc: '读数与电压互转' },
      { id: 'protocol', icon: '📡', name: '协议速查', desc: 'UART/SPI/I2C/CAN' },
      { id: 'crc', icon: '🛡️', name: 'CRC 校验', desc: 'CRC8/16/32 计算' },
      { id: 'pullup', icon: '🔝', name: 'I2C 上拉电阻', desc: '上拉阻值范围' },
      { id: 'battery', icon: '🔋', name: '电池续航', desc: '容量与续航估算' },
      { id: 'units', icon: '📏', name: '单位换算', desc: 'dBm/频率/波特率' }
    ]
  },
  {
    name: '计算机基础',
    tools: [
      { id: 'converter', icon: '🔢', name: '进制转换', desc: 'HEX/DEC/BIN/OCT' },
      { id: 'ipcalc', icon: '🌐', name: 'IP 子网计算', desc: '掩码/网段/主机数' },
      { id: 'ascii', icon: '🔤', name: 'ASCII 码表', desc: '字符码值速查' },
      { id: 'datasize', icon: '💾', name: '数据大小换算', desc: 'bit/Byte 各进制' }
    ]
  }
];

Page({
  data: {
    categories
  },

  openTool(e) {
    tt.navigateTo({
      url: '/pages/tools/' + e.currentTarget.dataset.id + '/' + e.currentTarget.dataset.id
    });
  }
});
