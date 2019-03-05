app.controller('indexController', ['$scope', 'indexFactory', 'configFactory', ($scope, indexFactory, configFactory) => {

    $scope.messages = [] //mesaj datalarının tutulduğu array

    //kullanıcıdan isim bilgisi alımı
    $scope.init = () => {
        const username = prompt('Please enter username');
        if (username)
            initSocket(username);
        else
            return false;
    };

    //Mesajların scroll düzenini sağlaması gereken fonksiyon
    function scrollTop() {
        setTimeout(() => {
            //Mesaj alanını seçtik
            const element = document.getElementById('chat-area');
            element.scrollTop = element.scrollHeight;
        });
    }

    //Mesajların top üzerinde gösterilmesi
    function showBubble(id, message) {
        $('#' + id).find('.message').show().html(message);
        setTimeout(() => {
            $('#' + id).find('.message').hide();
        }, 2000);
    }


    async function initSocket(username) {
        //Socket ayarlarını yaptık
        const options = {
            reconnectionAttemps: 3, //Yeniden bağlanma girişimi sayısı
            reconnectionDelay: 600 //Kaç saniyede bir yeniden bağlanmayı denesin
        };
        try {
            //Soket url i ni configFactory den aldık
            const socketUrl = await configFactory.getConfig();
            //IndexFactory den connectSocket fonksiuonuna eriştik
            const socket = await indexFactory.connectSocket(socketUrl.data.socketUrl, options);
            socket.emit('newUser', {
                username
            }); //Yeni kullanıcıyı sokete emit ettik

            //Oyun alanındaki kullanıcıların karşılanması
            socket.on('initPlayers', (players) => {
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
                $scope.players[data.id] = data;
                //scope'u onayladık
                $scope.$apply();
                scrollTop();
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
                scrollTop();
            });

            //Diğer kıullanıcıların konumunun değiştirilmesi
            socket.on('animate', data => {
                $('#' + data.socketId).animate({
                    'left': data.x + 'px',
                    'top': data.y + 'px'
                }, () => {
                    animate = false;
                });

            })

            //Animasyonun bitmeden çalışmaması için değişken oluşturduk
            let animate = false;
            //Top konumunun alınması
            $scope.onClickPlayer = ($event) => {
                let x = $event.offsetX;
                let y = $event.offsetY;
                //Konumun sokete iletilmesi
                socket.emit('animate', {
                    x,
                    y
                });
                //Animasyonun gerçekleşmesi
                if (!animate) {
                    $('#' + socket.id).animate({
                        'left': x,
                        'top': y
                    }, () => {
                        animate = false;
                    });
                }
            };

            //Mesaj yazma fonksiyonu 
            $scope.newMessage = () => {
                let message = $scope.message;
                //Defaul mesajData oluşturduk
                const messageData = {
                    type: { //info type
                        code: 1, //SERVER or USER message
                    },
                    username: username,
                    text: message,
                };
                //Mesajları emit ettik
                socket.emit('newMessage', messageData);
                //Mesajları messages dizisine ekledik
                $scope.messages.push(messageData);
                //mesaj kutusunu sıfırladık
                $scope.message = '';
                showBubble(socket.id, message);
                scrollTop();
                // $scope.$apply();

            }
            //Mesajların tüm kullanıcılara gösterilmesi
            socket.on('newMessage', (data) => {
                $scope.messages.push(data);
                //scope u onayladık
                $scope.$apply();
                //Mesaj balonunu gösterdik
                showBubble(data.socketId, data.text);
                scrollTop();
            });
        }
        catch(e) {
            console.log(e);
        }
    }
}]);