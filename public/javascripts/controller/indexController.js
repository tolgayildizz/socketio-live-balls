app.controller('indexController', ['$scope', 'indexFactory', ($scope, indexFactory) => {

    $scope.messages = [] //mesaj datalarının tutulduğu array

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
            socket.emit('newUser', {
                username
            }); //Yeni kullanıcıyı sokete emit ettik

            //Oyun alanındaki kullanıcıların karşılanması
            socket.on('initPlayers',(players)=>{
                //Kullanıcı bilgilerini scope a aktardık
                $scope.players = players;
                //Scope'u onayladık
                $scope.$apply();
            });

            //Yeni kullanıcı eklendiğinde mesaj eklemek için emit ettiğimiz soketi on ettik
            socket.on('newUser', (data) => {
                //Defaul mesajData oluşturduk
                const messageData = {
                    type: { //info type
                        code: 0, //info Code
                        message: 1 //Login Message
                    },
                    username: data.username
                };
                //Mesajları messages dizisine ekledik
                $scope.messages.push(messageData);
                //Yeni oyuncunun topunu alana ekledik
                $scope.players[data.id]=data;
                //scope'u onayladık
                $scope.$apply();
            });

            //Kullanıcı çıkış işleminin gösterilmesi
            //disUser emitinin karşılanması 
            socket.on('disUser', (data) => {
                //Defaul mesajData oluşturduk
                const messageData = {
                    type: { //info type
                        code: 0, //info Code
                        message: 0 //Disconnect Message
                    },
                    username: data.username
                };
                //Mesajları messages dizisine ekledik
                $scope.messages.push(messageData);
                //scope'u onayladık
                $scope.$apply();
            });

            //Diğer kıullanıcıların konumunun değiştirilmesi
            socket.on('animate', data => {
                $('#'+data.socketId).animate({'left':data.x +'px', 'top':data.y + 'px'}, ()=> {
                    animate=false;
                });

            })

            //Animasyonun bitmeden çalışmaması için değişken oluşturduk
            let animate = false;
            //Top konumunun alınması
            $scope.onClickPlayer= ($event) => {
                let x = $event.offsetX;
                let y = $event.offsetY;
                //Konumun sokete iletilmesi
                socket.emit('animate', {x,y});
                //Animasyonun gerçekleşmesi
                if(!animate) {
                    $('#' + socket.id).animate({'left':x,'top':y}, ()=> {
                        animate = false;
                    });
                }
            }
        }).catch((err) => {
            console.log(err); //Bağlantı gerçekleşmedi
        });
    }
}]);