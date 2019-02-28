const socketio = require('socket.io'); //Socket io dahil edildi
const io = socketio(); //Socket io başladı

const socketApi = {}; //Bir obje oluşturduk

socketApi.io = io; //Obje içerisinde ki io metoduna socketi bağladık

const users = []; //Kullanıcıların toplanacağı değişken

//Bağlantıyı yakaladık
io.on('connection', (socket) => {
    console.log('a user connected');
    //Soket'e gelen username bilgisini karşıladık
    socket.on('newUser', (data) => {
        //Varsayılan bir pozisyon bilgisi oluşturduk
        const defaultData = {
            id: socket.id,
            position: {
                x: 0,
                y: 0
            }
        }
        //defaultData referansı ile gelen datayı eşitledik
        const userData = Object.assign(data, defaultData);
        //users arrayine userData'yı ekledik
        users.push(userData);
    });
});

//Objeyi dışarı aktardık
module.exports = socketApi;