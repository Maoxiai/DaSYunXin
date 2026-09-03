const tools = [
  { id: 'resistor', icon: '🎨', name: '色环电阻计算', desc: '4/5/6 环阻值识读' },
  { id: 'converter', icon: '🔢', name: '进制转换', desc: 'HEX/DEC/BIN/OCT' },
  { id: 'divider', icon: '⚡', name: '分压计算', desc: '任填三项求第四项' },
  { id: 'timer', icon: '⏱️', name: '定时器计算', desc: 'STM32 PSC/ARR' },
  { id: 'protocol', icon: '📡', name: '协议速查', desc: 'UART/SPI/I2C/CAN' },
  { id: 'units', icon: '📏', name: '单位换算', desc: 'dBm/频率/波特率' },
  { id: 'led', icon: '💡', name: 'LED 限流电阻', desc: '阻值计算与推荐' },
  { id: 'ohm', icon: '🔌', name: '欧姆定律', desc: 'V/I/R/P 任填两项' },
  { id: 'rc', icon: '⏳', name: 'RC 时间常数', desc: '充放电与滤波频率' },
  { id: 'adc', icon: '📊', name: 'ADC 换算', desc: '读数与电压互转' },
  { id: 'ne555', icon: '🕐', name: '555 定时器', desc: '无稳态/单稳态' },
  { id: 'battery', icon: '🔋', name: '电池续航', desc: '容量与续航估算' }
];

Page({
  data: {
    tools
  },

  openTool(e) {
    tt.navigateTo({
      url: '/pages/tools/' + e.currentTarget.dataset.id + '/' + e.currentTarget.dataset.id
    });
  }
});
