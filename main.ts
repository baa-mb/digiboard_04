function licht_servo () {
    pins.servoWritePin(AnalogPin.P8, Math.map(input.lightLevel(), 0, 255, 0, 180))
}
input.onButtonPressed(Button.A, function () {
    lauf = true
})
function init () {
    pins.digitalWritePin(DigitalPin.P1, 0)
    pins.digitalWritePin(DigitalPin.P14, 0)
    pins.digitalWritePin(DigitalPin.P16, 0)
    strip = neopixel.create(DigitalPin.P14, 4, NeoPixelMode.RGB)
    strip.setBrightness(100)
    strip.clear()
    strip.show()
    lauf = false
    I2C_LCD1602.LcdInit(39)
    I2C_LCD1602.BacklightOff()
    I2C_LCD1602.ShowString("Klima-LF %:", 0, 0)
    I2C_LCD1602.ShowString("Temperatur:", 0, 1)
    pins.setAudioPin(AnalogPin.P1)
    pins.setAudioPinEnabled(true)
    gast = 0
    temp_zeit = -15000
}
input.onButtonPressed(Button.B, function () {
    lauf = false
})
function besucher () {
    basic.showNumber(pins.digitalReadPin(DigitalPin.P15))
    if (pins.digitalReadPin(DigitalPin.P15) == 1) {
        gast = 1
        music.play(music.tonePlayable(262, music.beat(BeatFraction.Whole)), music.PlaybackMode.UntilDone)
    } else {
        gast = 0
    }
    pins.digitalWritePin(DigitalPin.P16, gast)
}
function temperatur () {
    dht11_dht22.queryData(
    DHTtype.DHT11,
    DigitalPin.P2,
    true,
    false,
    true
    )
    if (dht11_dht22.readDataSuccessful()) {
        if (control.millis() - temp_zeit > 15000) {
            I2C_LCD1602.BacklightOn()
            I2C_LCD1602.ShowNumber(dht11_dht22.readData(dataType.humidity), 12, 0)
            I2C_LCD1602.ShowNumber(dht11_dht22.readData(dataType.temperature), 12, 1)
            basic.pause(5000)
            I2C_LCD1602.BacklightOff()
            temp_zeit = control.millis()
        }
    }
}
function motoren () {
    if (lauf) {
        motor = true
        pins.analogWritePin(AnalogPin.P12, 200)
        pins.analogWritePin(AnalogPin.P13, 0)
        if (lauf) {
            basic.pause(5000)
            pins.digitalWritePin(DigitalPin.P12, 0)
            pins.digitalWritePin(DigitalPin.P13, 0)
            if (lauf) {
                basic.pause(1000)
                pins.analogWritePin(AnalogPin.P12, 0)
                pins.analogWritePin(AnalogPin.P13, 300)
                basic.pause(5000)
            }
        }
    } else {
        if (motor) {
            pins.digitalWritePin(DigitalPin.P12, 0)
            pins.digitalWritePin(DigitalPin.P13, 0)
            motor = false
        }
    }
    basic.pause(2000)
}
let motor = false
let temp_zeit = 0
let gast = 0
let strip: neopixel.Strip = null
let lauf = false
basic.showIcon(IconNames.Yes)
init()
basic.forever(function () {
    besucher()
    temperatur()
})
