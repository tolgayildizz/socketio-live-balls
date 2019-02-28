app.controller('indexController', ['$scope', 'indexFactory', ($scope, indexFactory) => {
    //kullanıcıdan isim bilgisi alımı
    $scope.init = () => {
        const username = prompt('Please enter username');
        if (username)
            initSocket(username);
        else 
            return false;
    };

    function initSocket(username) {
        //Socket ayarlarını yaptık
        const options = {
            reconnectionAttemps: 3, //Yeniden bağlanma girişimi sayısı
            reconnectionDelay: 600 //Kaç saniyede bir yeniden bağlanmayı denesin
        };

        //IndexFactory den connectSocket fonksiuonuna eriştik
        indexFactory.connectSocket('http://localhost:3000/', options).then((socket) => {
            console.log('Bağlantı Gerçekleşti'); //Bağlantı gerçekleşti
            socket.emit('newUser', {username}); //Yeni kullanıcıyı sokete emit ettik
        }).catch((err) => {
            console.log(err); //Bağlantı gerçekleşmedi
        });
    }
}]);