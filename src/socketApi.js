const socketio = require('socket.io'); //Socket io dahil edildi
const io = socketio(); //Socket io başladı

const socketApi = {}; //Bir obje oluşturduk

socketApi.io = io; //Obje içerisinde ki io metoduna socketi bağladık

const users = {}; //Kullanıcıların toplanacağı değişken

//Helper metodunu dahil ettik

const randomColor = require('../helpers/randomColor');


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
            },
            color: randomColor(), //Rastgele bir renk verdik
        }
        //defaultData referansı ile gelen datayı eşitledik
        const userData = Object.assign(data, defaultData);
        //users değişeknine userData'yı ekledik
        users[socket.id] = userData;
        //Diğer kullanıcılara giriş yapan kişinin bilgilerini döndürme
        socket.broadcast.emit('newUser', users[socket.id]);
        //Yeni kullanıcıya diğer kullanıcı bilgilerini ve oyun haritasını göndermek
        socket.emit('initPlayers', users);
    });

    //Kullanıcı ayrıldığında soketten yakaladık
    socket.on('disconnect', ()=>{
        //Diğer kullanıcılara ayrılan kullanıcının bilgisini ilettik
        socket.broadcast.emit('disUser', users[socket.id]);
        //ayrılan kullanıcıları kullanıcılar objesinden sildik
        delete users[socket.id];
    });

    //Konum bilgilerinin paylaşılması
    socket.on('animate', (data) => {
       try {
            //Kullanının konum bilgisinin değiştirilmesi
        users[socket.id].position.x = data.x;
        users[socket.id].position.y = data.y;
        //Diğer kullanıcılara konumun iletilmesi
        socket.broadcast.emit('animate', {
            socketId: socket.id,
            x:data.x,
            y:data.y, 
        });
       } 
        catch (error) {
        console.log(error)
       }
    });

    //Mesajların iletilmesi
    socket.on('newMessage', (data)=> {
        const messageData = Object.assign({socketId: socket.id},data);
        socket.broadcast.emit('newMessage',messageData);
    })
});

//Objeyi dışarı aktardık
module.exports = socketApi;