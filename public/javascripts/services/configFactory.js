app.factory('configFactory', ['$http',($http) => {
    //Yeni bir ayar sorgulama fonksiyonu oluşturduk
    const getConfig = (url, options) => {
        //Bir promise return ettik 
        return new Promise((resolve, reject) => {
           $http.get('/getEnv').then((data)=> {
               resolve(data);
           }).catch((err)=>{
                reject(err);
           })
        });
    }
    //Fonksiyonu döndük
    return {
        getConfig
    }

}]);