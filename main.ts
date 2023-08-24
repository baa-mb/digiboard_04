input.onButtonPressed(Button.A, function () {
    lauf = true
})
input.onButtonPressed(Button.B, function () {
    lauf = false
})
let motor = false
let lauf = false
basic.showIcon(IconNames.Yes)
let strip = neopixel.create(DigitalPin.P14, 4, NeoPixelMode.RGB)
lauf = false
I2C_LCD1602.LcdInit(0)
I2C_LCD1602.ShowString("Klima", 0, 0)
basic.forever(function () {
    pins.servoWritePin(AnalogPin.P8, Math.map(input.lightLevel(), 0, 255, 0, 180))
    if (input.lightLevel() < 5) {
        strip.showColor(neopixel.colors(NeoPixelColors.Red))
        pins.analogWritePin(AnalogPin.P16, 635)
    } else {
        strip.showColor(neopixel.colors(NeoPixelColors.Green))
        pins.analogWritePin(AnalogPin.P16, 0)
    }
    if (lauf) {
        motor = true
        pins.analogWritePin(AnalogPin.P12, 100)
        pins.analogWritePin(AnalogPin.P13, 0)
        if (lauf) {
            basic.pause(5000)
            pins.digitalWritePin(DigitalPin.P12, 0)
            pins.digitalWritePin(DigitalPin.P13, 0)
            if (lauf) {
                basic.pause(1000)
                pins.analogWritePin(AnalogPin.P12, 0)
                pins.analogWritePin(AnalogPin.P13, 248)
                basic.pause(5000)
            }
        }
    } else {
        if (motor) {
            pins.digitalWritePin(DigitalPin.P12, 0)
            pins.digitalWritePin(DigitalPin.P13, 0)
            motor = false
        }
        dht11_dht22.queryData(
        DHTtype.DHT11,
        DigitalPin.P2,
        true,
        false,
        true
        )
        if (dht11_dht22.readDataSuccessful()) {
            I2C_LCD1602.ShowNumber(dht11_dht22.readData(dataType.humidity), 12, 0)
            I2C_LCD1602.ShowNumber(dht11_dht22.readData(dataType.temperature), 12, 1)
            I2C_LCD1602.ShowNumber(1, 2, 1)
        } else {
            I2C_LCD1602.ShowNumber(0, 2, 1)
        }
    }
    I2C_LCD1602.ShowString(convertToText(input.lightLevel() + 1000).substr(1, 3), 8, 1)
    basic.pause(2000)
})
