// 猫夏云芯 常用封装引脚表
// 按芯片 id 索引；数据来源为厂商数据手册，仅收录引脚定义明确的高频型号
// 字段：no 引脚号 / name 引脚名称 / func 功能与主要复用

const pins = {
  // ============ MCU ============
  'stm32f103c8t6': [
    { no: '1', name: 'VBAT', func: 'RTC 后备电源输入' },
    { no: '2', name: 'PC13', func: 'TAMPER-RTC，仅低速推挽输出' },
    { no: '3', name: 'PC14', func: 'OSC32_IN，可作 GPIO（限 2MHz）' },
    { no: '4', name: 'PC15', func: 'OSC32_OUT，可作 GPIO（限 2MHz）' },
    { no: '5', name: 'PD0', func: 'OSC_IN，主晶振输入' },
    { no: '6', name: 'PD1', func: 'OSC_OUT，主晶振输出' },
    { no: '7', name: 'NRST', func: '系统复位，低电平有效' },
    { no: '8', name: 'VSSA', func: '模拟地' },
    { no: '9', name: 'VDDA', func: '模拟电源，接 3.3V' },
    { no: '10', name: 'PA0', func: 'WKUP / TIM2_CH1 / ADC12_IN0' },
    { no: '11', name: 'PA1', func: 'TIM2_CH2 / ADC12_IN1 / USART2_RTS' },
    { no: '12', name: 'PA2', func: 'TIM2_CH3 / ADC12_IN2 / USART2_TX' },
    { no: '13', name: 'PA3', func: 'TIM2_CH4 / ADC12_IN3 / USART2_RX' },
    { no: '14', name: 'PA4', func: 'SPI1_NSS / ADC12_IN4' },
    { no: '15', name: 'PA5', func: 'SPI1_SCK / ADC12_IN5' },
    { no: '16', name: 'PA6', func: 'SPI1_MISO / ADC12_IN6 / TIM3_CH1' },
    { no: '17', name: 'PA7', func: 'SPI1_MOSI / ADC12_IN7 / TIM3_CH2' },
    { no: '18', name: 'PB0', func: 'ADC12_IN8 / TIM3_CH3' },
    { no: '19', name: 'PB1', func: 'ADC12_IN9 / TIM3_CH4' },
    { no: '20', name: 'PB2', func: 'BOOT1 / GPIO' },
    { no: '21', name: 'PB10', func: 'I2C2_SCL / USART3_TX' },
    { no: '22', name: 'PB11', func: 'I2C2_SDA / USART3_RX' },
    { no: '23', name: 'VSS', func: '数字地' },
    { no: '24', name: 'VDD', func: '数字电源 3.3V' },
    { no: '25', name: 'PB12', func: 'SPI2_NSS / USART3_CK' },
    { no: '26', name: 'PB13', func: 'SPI2_SCK / TIM1_CH1N' },
    { no: '27', name: 'PB14', func: 'SPI2_MISO / TIM1_CH2N' },
    { no: '28', name: 'PB15', func: 'SPI2_MOSI / TIM1_CH3N' },
    { no: '29', name: 'PA8', func: 'TIM1_CH1 / MCO 时钟输出' },
    { no: '30', name: 'PA9', func: 'USART1_TX / TIM1_CH2' },
    { no: '31', name: 'PA10', func: 'USART1_RX / TIM1_CH3' },
    { no: '32', name: 'PA11', func: 'USART1_CTS / USBDM' },
    { no: '33', name: 'PA12', func: 'USART1_RTS / USBDP' },
    { no: '34', name: 'PA13', func: 'JTMS / SWDIO 调试口' },
    { no: '35', name: 'VSS', func: '数字地' },
    { no: '36', name: 'VDD', func: '数字电源 3.3V' },
    { no: '37', name: 'PA14', func: 'JTCK / SWCLK 调试口' },
    { no: '38', name: 'PA15', func: 'JTDI / TIM2_CH1_ETR / SPI3_NSS' },
    { no: '39', name: 'PB3', func: 'JTDO / SPI3_SCK / TIM2_CH2' },
    { no: '40', name: 'PB4', func: 'JNTRST / SPI3_MISO / TIM3_CH1' },
    { no: '41', name: 'PB5', func: 'SPI3_MOSI / I2C1_SMBA' },
    { no: '42', name: 'PB6', func: 'I2C1_SCL / TIM4_CH1' },
    { no: '43', name: 'PB7', func: 'I2C1_SDA / TIM4_CH2' },
    { no: '44', name: 'BOOT0', func: '启动选择：低=Flash，高=系统存储器' },
    { no: '45', name: 'PB8', func: 'TIM4_CH3 / I2C1_SCL（重映射）' },
    { no: '46', name: 'PB9', func: 'TIM4_CH4 / I2C1_SDA（重映射）' },
    { no: '47', name: 'VSS', func: '数字地' },
    { no: '48', name: 'VDD', func: '数字电源 3.3V' }
  ],
  'atmega328p-au': [
    { no: '1', name: 'PD3', func: 'D3 / INT1 / PCINT19' },
    { no: '2', name: 'PD4', func: 'D4 / PCINT20 / T0' },
    { no: '3', name: 'GND', func: '地' },
    { no: '4', name: 'VCC', func: '数字电源' },
    { no: '5', name: 'GND', func: '地' },
    { no: '6', name: 'VCC', func: '电源' },
    { no: '7', name: 'PB6', func: 'XTAL1 / TOSC1，可接晶振' },
    { no: '8', name: 'PB7', func: 'XTAL2 / TOSC2' },
    { no: '9', name: 'PD5', func: 'D5 / PCINT21 / T1' },
    { no: '10', name: 'PD6', func: 'D6 / PCINT22 / AIN0' },
    { no: '11', name: 'PD7', func: 'D7 / PCINT23 / AIN1' },
    { no: '12', name: 'PB0', func: 'D8 / ICP1 / PCINT0' },
    { no: '13', name: 'PB1', func: 'D9 / OC1A PWM / PCINT1' },
    { no: '14', name: 'PB2', func: 'D10 / OC1B PWM / SS / PCINT2' },
    { no: '15', name: 'PB3', func: 'D11 / OC2A PWM / MOSI / PCINT3' },
    { no: '16', name: 'PB4', func: 'D12 / MISO / PCINT4' },
    { no: '17', name: 'PB5', func: 'D13 / SCK / PCINT5，板载 LED' },
    { no: '18', name: 'AVCC', func: '模拟电源，必须接 VCC' },
    { no: '19', name: 'ADC6', func: 'A6（仅 TQFP 封装）' },
    { no: '20', name: 'AREF', func: 'ADC 基准电压' },
    { no: '21', name: 'GND', func: '地' },
    { no: '22', name: 'ADC7', func: 'A7（仅 TQFP 封装）' },
    { no: '23', name: 'PC0', func: 'A0 / PCINT8' },
    { no: '24', name: 'PC1', func: 'A1 / PCINT9' },
    { no: '25', name: 'PC2', func: 'A2 / PCINT10' },
    { no: '26', name: 'PC3', func: 'A3 / PCINT11' },
    { no: '27', name: 'PC4', func: 'A4 / SDA / PCINT12' },
    { no: '28', name: 'PC5', func: 'A5 / SCL / PCINT13' },
    { no: '29', name: 'PC6', func: 'RESET / PCINT14' },
    { no: '30', name: 'PD0', func: 'D0 / RXD / PCINT16' },
    { no: '31', name: 'PD1', func: 'D1 / TXD / PCINT17' },
    { no: '32', name: 'PD2', func: 'D2 / INT0 / PCINT18' }
  ],

  // ============ 模拟器件 ============
  'ne555': [
    { no: '1', name: 'GND', func: '地' },
    { no: '2', name: 'TRIG', func: '触发输入，低于 1/3VCC 触发' },
    { no: '3', name: 'OUT', func: '输出，可拉灌 200mA' },
    { no: '4', name: 'RESET', func: '复位，低电平有效，不用时接 VCC' },
    { no: '5', name: 'CTRL', func: '控制电压，改变阈值，常接 10nF 到地' },
    { no: '6', name: 'THRES', func: '阈值输入，高于 2/3VCC 复位' },
    { no: '7', name: 'DISCH', func: '放电端，接定时电阻' },
    { no: '8', name: 'VCC', func: '电源 4.5~16V' }
  ],
  'lm358': [
    { no: '1', name: 'OUT1', func: 'A 路输出' },
    { no: '2', name: 'IN1-', func: 'A 路反相输入' },
    { no: '3', name: 'IN1+', func: 'A 路同相输入' },
    { no: '4', name: 'GND/V-', func: '地（单电源）或负电源' },
    { no: '5', name: 'IN2+', func: 'B 路同相输入' },
    { no: '6', name: 'IN2-', func: 'B 路反相输入' },
    { no: '7', name: 'OUT2', func: 'B 路输出' },
    { no: '8', name: 'V+', func: '电源 3~32V' }
  ],
  'lm393': [
    { no: '1', name: 'OUT1', func: 'A 路输出（集电极开路，需上拉）' },
    { no: '2', name: 'IN1-', func: 'A 路反相输入' },
    { no: '3', name: 'IN1+', func: 'A 路同相输入' },
    { no: '4', name: 'GND', func: '地' },
    { no: '5', name: 'IN2+', func: 'B 路同相输入' },
    { no: '6', name: 'IN2-', func: 'B 路反相输入' },
    { no: '7', name: 'OUT2', func: 'B 路输出（集电极开路，需上拉）' },
    { no: '8', name: 'VCC', func: '电源 2~36V' }
  ],
  'ne5532': [
    { no: '1', name: 'OUT A', func: 'A 路输出' },
    { no: '2', name: 'IN A-', func: 'A 路反相输入' },
    { no: '3', name: 'IN A+', func: 'A 路同相输入' },
    { no: '4', name: 'V-', func: '负电源（单电源时接地）' },
    { no: '5', name: 'IN B+', func: 'B 路同相输入' },
    { no: '6', name: 'IN B-', func: 'B 路反相输入' },
    { no: '7', name: 'OUT B', func: 'B 路输出' },
    { no: '8', name: 'V+', func: '正电源' }
  ],
  'lm324': [
    { no: '1', name: 'OUT1', func: '1 路输出' },
    { no: '2', name: 'IN1-', func: '1 路反相输入' },
    { no: '3', name: 'IN1+', func: '1 路同相输入' },
    { no: '4', name: 'VCC', func: '电源 3~32V' },
    { no: '5', name: 'IN2+', func: '2 路同相输入' },
    { no: '6', name: 'IN2-', func: '2 路反相输入' },
    { no: '7', name: 'OUT2', func: '2 路输出' },
    { no: '8', name: 'OUT3', func: '3 路输出' },
    { no: '9', name: 'IN3-', func: '3 路反相输入' },
    { no: '10', name: 'IN3+', func: '3 路同相输入' },
    { no: '11', name: 'GND', func: '地（单电源）或负电源' },
    { no: '12', name: 'IN4+', func: '4 路同相输入' },
    { no: '13', name: 'IN4-', func: '4 路反相输入' },
    { no: '14', name: 'OUT4', func: '4 路输出' }
  ],
  'lm386': [
    { no: '1', name: 'GAIN', func: '增益设定，接 1-8 短接增益 200' },
    { no: '2', name: 'IN-', func: '反相输入' },
    { no: '3', name: 'IN+', func: '同相输入（常用输入端）' },
    { no: '4', name: 'GND', func: '地' },
    { no: '5', name: 'OUT', func: '输出，经 250μF 电容接喇叭' },
    { no: '6', name: 'VS', func: '电源 4~12V' },
    { no: '7', name: 'BYPASS', func: '旁路，接 10μF 到地' },
    { no: '8', name: 'GAIN', func: '增益设定，与 1 脚配合' }
  ],

  // ============ 电源 ============
  'ams1117-3.3': [
    { no: '1', name: 'GND/ADJ', func: '地（固定输出版）；可调版为调整端' },
    { no: '2', name: 'VOUT', func: '稳压输出 3.3V' },
    { no: '3', name: 'VIN', func: '输入，最高 15V' },
    { no: 'TAB', name: 'VOUT', func: '散热片，内部接输出' }
  ],
  'lm317': [
    { no: '1', name: 'ADJ', func: '调整端，R1/R2 分压设定输出' },
    { no: '2', name: 'VOUT', func: '输出 1.25~37V' },
    { no: '3', name: 'VIN', func: '输入 3~40V' }
  ],
  'tl431': [
    { no: '1', name: 'REF', func: '基准端，2.5V' },
    { no: '2', name: 'ANODE', func: '阳极（接低电位）' },
    { no: '3', name: 'CATHODE', func: '阴极（接高电位）' }
  ],
  'tp4056': [
    { no: '1', name: 'TEMP', func: '温度检测，常接地或接 NTC' },
    { no: '2', name: 'PROG', func: '充电电流设定，Rprog=1.2V/Ichg' },
    { no: '3', name: 'GND', func: '地' },
    { no: '4', name: 'VCC', func: '电源输入 4~8V' },
    { no: '5', name: 'BAT', func: '电池端，4.2V 恒压' },
    { no: '6', name: 'STDBY', func: '充电完成指示（开漏，低有效）' },
    { no: '7', name: 'CHRG', func: '充电中指示（开漏，低有效）' },
    { no: '8', name: 'CE', func: '使能，高电平允许充电' }
  ],
  'dw01a': [
    { no: '1', name: 'OD', func: '放电 MOS 栅极驱动' },
    { no: '2', name: 'CS', func: '过流检测，经 1kΩ 接 V-' },
    { no: '3', name: 'OC', func: '充电 MOS 栅极驱动' },
    { no: '4', name: 'TD', func: '延时设定，接 0.1μF 到地' },
    { no: '5', name: 'VCC', func: '电源，接电芯正极' },
    { no: '6', name: 'GND', func: '地，接电芯负极' }
  ],

  // ============ 接口与驱动 ============
  'max3232': [
    { no: '1', name: 'C1+', func: '电荷泵电容 C1 正端' },
    { no: '2', name: 'V+', func: '电荷泵正输出，接 100nF 到地' },
    { no: '3', name: 'C1-', func: '电荷泵电容 C1 负端' },
    { no: '4', name: 'C2+', func: '电荷泵电容 C2 正端' },
    { no: '5', name: 'C2-', func: '电荷泵电容 C2 负端' },
    { no: '6', name: 'V-', func: '电荷泵负输出，接 100nF 到地' },
    { no: '7', name: 'T2OUT', func: 'TTL 输入 T2 的 RS232 输出' },
    { no: '8', name: 'R2IN', func: 'RS232 输入 2' },
    { no: '9', name: 'R2OUT', func: 'RS232 输入 2 的 TTL 输出' },
    { no: '10', name: 'T2IN', func: 'TTL 输入 2' },
    { no: '11', name: 'T1IN', func: 'TTL 输入 1（接 MCU TX）' },
    { no: '12', name: 'R1OUT', func: 'TTL 输出 1（接 MCU RX）' },
    { no: '13', name: 'R1IN', func: 'RS232 输入 1' },
    { no: '14', name: 'GND', func: '地' },
    { no: '15', name: 'VCC', func: '电源 3~5.5V' },
    { no: '16', name: 'T1OUT', func: 'TTL 输入 T1 的 RS232 输出' }
  ],
  'uln2003': [
    { no: '1', name: 'IN1', func: '驱动输入 1（接 MCU IO）' },
    { no: '2', name: 'IN2', func: '驱动输入 2' },
    { no: '3', name: 'IN3', func: '驱动输入 3' },
    { no: '4', name: 'IN4', func: '驱动输入 4' },
    { no: '5', name: 'IN5', func: '驱动输入 5' },
    { no: '6', name: 'IN6', func: '驱动输入 6' },
    { no: '7', name: 'IN7', func: '驱动输入 7' },
    { no: '8', name: 'GND', func: '地' },
    { no: '9', name: 'COM', func: '续流二极管公共端，接负载电源' },
    { no: '10', name: 'OUT7', func: '驱动输出 7（集电极开路）' },
    { no: '11', name: 'OUT6', func: '驱动输出 6' },
    { no: '12', name: 'OUT5', func: '驱动输出 5' },
    { no: '13', name: 'OUT4', func: '驱动输出 4' },
    { no: '14', name: 'OUT3', func: '驱动输出 3' },
    { no: '15', name: 'OUT2', func: '驱动输出 2' },
    { no: '16', name: 'OUT1', func: '驱动输出 1' }
  ],
  'sn74hc595': [
    { no: '1', name: 'QB', func: '并行输出 B（Q1）' },
    { no: '2', name: 'QC', func: '并行输出 C（Q2）' },
    { no: '3', name: 'QD', func: '并行输出 D（Q3）' },
    { no: '4', name: 'QE', func: '并行输出 E（Q4）' },
    { no: '5', name: 'QF', func: '并行输出 F（Q5）' },
    { no: '6', name: 'QG', func: '并行输出 G（Q6）' },
    { no: '7', name: 'QH', func: '并行输出 H（Q7）' },
    { no: '8', name: 'GND', func: '地' },
    { no: '9', name: 'QH\'', func: '串行级联输出，接下一片 SER' },
    { no: '10', name: 'SRCLR', func: '移位寄存器清零，低有效，常接 VCC' },
    { no: '11', name: 'SRCLK', func: '移位时钟' },
    { no: '12', name: 'RCLK', func: '锁存时钟，上升沿更新输出' },
    { no: '13', name: 'OE', func: '输出使能，低有效，常接地' },
    { no: '14', name: 'SER', func: '串行数据输入' },
    { no: '15', name: 'QA', func: '并行输出 A（Q0）' },
    { no: '16', name: 'VCC', func: '电源 2~6V' }
  ],
  'pcf8574': [
    { no: '1', name: 'A0', func: '地址位 0' },
    { no: '2', name: 'A1', func: '地址位 1' },
    { no: '3', name: 'A2', func: '地址位 2' },
    { no: '4', name: 'P0', func: '准双向 IO 0' },
    { no: '5', name: 'P1', func: '准双向 IO 1' },
    { no: '6', name: 'P2', func: '准双向 IO 2' },
    { no: '7', name: 'P3', func: '准双向 IO 3' },
    { no: '8', name: 'GND', func: '地' },
    { no: '9', name: 'INT', func: '中断输出（开漏），输入变化触发' },
    { no: '10', name: 'P4', func: '准双向 IO 4' },
    { no: '11', name: 'P5', func: '准双向 IO 5' },
    { no: '12', name: 'P6', func: '准双向 IO 6' },
    { no: '13', name: 'P7', func: '准双向 IO 7' },
    { no: '14', name: 'SCL', func: 'I2C 时钟' },
    { no: '15', name: 'SDA', func: 'I2C 数据' },
    { no: '16', name: 'VDD', func: '电源 2.5~6V' }
  ],
  'l298n': [
    { no: '1', name: 'SENSE_A', func: 'A 桥电流检测，接采样电阻' },
    { no: '2', name: 'OUT1', func: 'A 桥输出 1' },
    { no: '3', name: 'OUT2', func: 'A 桥输出 2' },
    { no: '4', name: 'VS', func: '功率电源 5~46V' },
    { no: '5', name: 'IN1', func: 'A 桥输入 1（逻辑）' },
    { no: '6', name: 'ENA', func: 'A 桥使能（PWM 调速）' },
    { no: '7', name: 'IN2', func: 'A 桥输入 2（逻辑）' },
    { no: '8', name: 'GND', func: '地' },
    { no: '9', name: 'VSS', func: '逻辑电源 5V' },
    { no: '10', name: 'IN3', func: 'B 桥输入 1（逻辑）' },
    { no: '11', name: 'ENB', func: 'B 桥使能（PWM 调速）' },
    { no: '12', name: 'IN4', func: 'B 桥输入 2（逻辑）' },
    { no: '13', name: 'OUT3', func: 'B 桥输出 1' },
    { no: '14', name: 'OUT4', func: 'B 桥输出 2' },
    { no: '15', name: 'SENSE_B', func: 'B 桥电流检测' }
  ],

  // ============ 存储与时钟 ============
  'at24c02': [
    { no: '1', name: 'A0', func: '地址位 0' },
    { no: '2', name: 'A1', func: '地址位 1' },
    { no: '3', name: 'A2', func: '地址位 2' },
    { no: '4', name: 'GND', func: '地' },
    { no: '5', name: 'SDA', func: 'I2C 数据' },
    { no: '6', name: 'SCL', func: 'I2C 时钟' },
    { no: '7', name: 'WP', func: '写保护，高=只读，常接地' },
    { no: '8', name: 'VCC', func: '电源 1.8~5.5V' }
  ],
  'ds1302': [
    { no: '1', name: 'VCC1', func: '备用电源（电池）' },
    { no: '2', name: 'X1', func: '32.768kHz 晶振' },
    { no: '3', name: 'X2', func: '32.768kHz 晶振' },
    { no: '4', name: 'GND', func: '地' },
    { no: '5', name: 'CE/RST', func: '片选 / 复位，高有效' },
    { no: '6', name: 'IO', func: '三线接口数据线' },
    { no: '7', name: 'SCLK', func: '三线接口时钟' },
    { no: '8', name: 'VCC2', func: '主电源' }
  ],
  'pcf8563': [
    { no: '1', name: 'OSCI', func: '32.768kHz 晶振输入' },
    { no: '2', name: 'OSCO', func: '32.768kHz 晶振输出' },
    { no: '3', name: 'INT', func: '中断输出（开漏），闹钟/定时器' },
    { no: '4', name: 'VSS', func: '地' },
    { no: '5', name: 'SDA', func: 'I2C 数据' },
    { no: '6', name: 'SCL', func: 'I2C 时钟' },
    { no: '7', name: 'CLKOUT', func: '时钟输出，可输出 32.768k/1Hz 等' },
    { no: '8', name: 'VDD', func: '电源 1.0~5.5V' }
  ],

  // ============ 传感器与显示 ============
  'ds18b20': [
    { no: '1', name: 'GND', func: '地' },
    { no: '2', name: 'DQ', func: '单总线数据，需 4.7kΩ 上拉' },
    { no: '3', name: 'VDD', func: '电源 3~5.5V（寄生供电时接地）' }
  ],
  'ws2812b': [
    { no: '1', name: 'VDD', func: '电源 3.5~5.3V' },
    { no: '2', name: 'DIN', func: '数据输入' },
    { no: '3', name: 'GND', func: '地' },
    { no: '4', name: 'DOUT', func: '数据输出，级联下一颗 DIN' }
  ],
  'mpu6050': [
    { no: '1', name: 'VCC', func: '电源 3.3~5V（模组含稳压）' },
    { no: '2', name: 'GND', func: '地' },
    { no: '3', name: 'SCL', func: 'I2C 时钟' },
    { no: '4', name: 'SDA', func: 'I2C 数据' },
    { no: '5', name: 'XDA', func: '辅助 I2C 数据（外接磁力计）' },
    { no: '6', name: 'XCL', func: '辅助 I2C 时钟' },
    { no: '7', name: 'AD0', func: '地址选择：0x68（低）/ 0x69（高）' },
    { no: '8', name: 'INT', func: '中断输出，姿态数据就绪' }
  ]
};

module.exports = { pins };
