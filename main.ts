function licht_servo() {
    pins.servoWritePin(AnalogPin.P8, licht)
    strip.showColor(neopixel.colors(NeoPixelColors.Black))
    if (licht == 0) {
        strip.showColor(neopixel.colors(NeoPixelColors.Red))
        solar_winkel = get_winkel([solar_winkel, 1])
        pins.servoWritePin(AnalogPin.P9, solar_winkel)
    }
    licht = get_winkel([licht, 0])
}
input.onButtonPressed(Button.A, function () {
    motor_start = true
})
function init() {
    // pins.digitalWritePin(DigitalPin.P1, 0)
    pins.digitalWritePin(DigitalPin.P14, 0)
    pins.digitalWritePin(DigitalPin.P16, 0)
    strip = neopixel.create(DigitalPin.P14, 4, NeoPixelMode.RGB)
    strip.setBrightness(100)
    strip.clear()
    strip.show()
    motor_start = false
    I2C_LCD1602.LcdInit(39)
    I2C_LCD1602.BacklightOff()
    I2C_LCD1602.ShowString("Klima-LF %:", 0, 0)
    I2C_LCD1602.ShowString("Temperatur:", 0, 1)
    // pins.setAudioPin(AnalogPin.P1)
    pins.setAudioPinEnabled(false)
    pins.servoWritePin(AnalogPin.P9, 90)
    basic.clearScreen()
    init_variable()
}
function get_winkel(arr: number[]) {
    flag = arr[1]
    num = arr[0]
    num = (num + add_winkel[flag]) % (180 + add_winkel[flag])
    return num
}
input.onButtonPressed(Button.B, function () {
    motor_start = false
})
function besucher() {
    // music.play(music.tonePlayable(262, music.beat(BeatFraction.Whole)), music.PlaybackMode.InBackground)
    if (pins.digitalReadPin(DigitalPin.P15) == 1) {
        gast = 1
    } else {
        gast = 0
    }
    pins.digitalWritePin(DigitalPin.P16, gast)
}
function temperatur() {
    dht11_dht22.queryData(
        DHTtype.DHT11,
        DigitalPin.P2,
        true,
        false,
        true
    )
    if (dht11_dht22.readDataSuccessful()) {
        // if (control.millis() - temp_zeit > temp_interval || dht11_dht22.readData(dataType.temperature) != old_temp) {
        if (Math.round(dht11_dht22.readData(dataType.humidity)) != old_humidity) {
            I2C_LCD1602.BacklightOn()
            I2C_LCD1602.ShowNumber(dht11_dht22.readData(dataType.humidity), 12, 0)
            I2C_LCD1602.ShowNumber(dht11_dht22.readData(dataType.temperature), 12, 1)
            old_humidity = Math.round(dht11_dht22.readData(dataType.humidity))
            basic.pause(4000)
            I2C_LCD1602.BacklightOff()
            temp_zeit = control.millis()
        }
    }
}
function init_variable() {
    add_winkel = [45, 10]
    licht = 0
    gast = 0
    temp_zeit = -15000
    temp_interval = 15000
    solar_winkel = 90
}
function motoren() {
    if (motor_start) {
        motor = true
        pins.analogWritePin(AnalogPin.P12, 200)
        pins.analogWritePin(AnalogPin.P13, 0)
        // if (motor_start) {
        //     basic.pause(5000)
        //     pins.digitalWritePin(DigitalPin.P12, 0)
        //     pins.digitalWritePin(DigitalPin.P13, 0)
        //     if (motor_start) {
        //         basic.pause(1000)
        //         pins.analogWritePin(AnalogPin.P12, 0)
        //         pins.analogWritePin(AnalogPin.P13, 300)
        //         basic.pause(5000)
        //     }
        //     basic.pause(2000)
        // }
        // } else {

        basic.pause(2000)
        if (motor) {
            pins.digitalWritePin(DigitalPin.P12, 0)
            pins.digitalWritePin(DigitalPin.P13, 0)
            motor = false
            motor_start = false
        }
    }
}
function motorstart() {
    if (pins.analogReadPin(AnalogPin.P0) > 300) {
        motor_start = true
    }
}
let motor = false
let temp_interval = 0
let temp_zeit = 0
let gast = 0
let add_winkel: number[] = []
let num = 0
let flag = 0
let motor_start = false
let solar_winkel = 0
let strip: neopixel.Strip = null
let licht = 0
let num2 = 0
let old_humidity=0
basic.showIcon(IconNames.Yes)
init()
serial.redirectToUSB()


basic.forever(function () {
    serial.writeValue("x", pins.analogReadPin(AnalogPin.P0))
    besucher()
    temperatur()
    licht_servo()
    motorstart()
    motoren()
})
