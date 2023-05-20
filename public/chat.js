const socket = io();
// 
const template = document.getElementById('template').innerHTML;
const target = document.getElementById('target');
const loctn_template = document.getElementById('loctn-template').innerHTML;
const loctn_target = document.getElementById('loctn_target');

socket.on('joined', (welcomeMessage) => {
    const time = moment(message.createdAt).format('hh:mm A')
    var rendered = Mustache.render(template, { createdAt: time, message1: welcomeMessage.text });
    target.insertAdjacentHTML('beforeend', rendered);
})
socket.on('message', (username, message) => {
    const time = moment(message.createdAt).format('hh:mm A')
    var rendered = Mustache.render(template, { username, createdAt: time, message1: message.text });
    target.insertAdjacentHTML('beforeend', rendered);
    autoscroll()
})
socket.on('newuser', (message) => {
})

function autoscroll() {
    var elem = document.getElementById('target');
    elem.scrollTop = elem.scrollHeight;

}
const sendMessage = (e) => {
    e.preventDefault();
    const messageBtn = document.getElementById('message')
    const sendbutton = document.querySelector('#send-Button')

    sendbutton.setAttribute('disabled', true);
    socket.emit('message', messageBtn.value, (deliveryAck) => {
        console.log(deliveryAck)
        messageBtn.value = '';
        messageBtn.focus();
        sendbutton.disabled = false;
    });

}
const sendLocation = (e) => {
    console.log('sendLocation')
    if (navigator.geolocation) {
        console.log('geolocation inside')
        navigator.geolocation.getCurrentPosition(() => {
            console.log('sendLocation')
            // socket.emit('location', {
            //     latitude: loc.coords.latitude,
            //     longitude: loc.coords.longitude
            // }, (ack) => {
            //     console.log(ack)
            // })
        }, () => {
            console.log('rror')
        })
    }
    else
        window.alert('Browser does not support location')
}

socket.on('location', (location) => {
    console.log('locket socket on')
    const url = `https://www.google.com/maps?q=${location.latitude},${location.longitude}`
    const rendered = Mustache.render(loctn_template, { url: url });
    target.insertAdjacentHTML('beforeend', rendered);
    autoscroll()
})


const { username, roomid } = Qs.parse(location.search, { ignoreQueryPrefix: true });
socket.emit('join', ({ username, roomid }), (error) => {
    if (error) {

        window.alert(error)
        location.href = '/'
    }
})