radio.onReceivedString(function (receivedString) {
  serial.writeLine("" + radio.receivedPacket(RadioPacketProperty.SerialNumber) + receivedString)
})
radio.setGroup(1)
basic.forever(function () {

})
