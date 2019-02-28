app.factory('indexFactory', [() => {
    //Yeni bir bağlantı fonksiyonu oluşturduk
    const connectSocket = (url, options) => {
        //Bir promise return ettik 
        return new Promise((resolve, reject) => {
            //Socket bağlantısını gerçekleştirdik
            const socket = io.connect(url, options);
            //Bağlantı durumu sağlanmışsa resolve ettik
            socket.on('connect', () => {
                resolve(socket);
            });
            //Bağlantı hatası varsa reject ettik
            socket.on('connect_error', () => {
                reject(new Error('connect_error'));
            });

        });
    }
    //Fonksiyonu döndük
    return {
        connectSocket
    }

}]);