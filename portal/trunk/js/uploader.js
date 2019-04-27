var app = angular.module('app', []);
app.controller('Uploaderctrl', ['$scope', '$http', '$rootScope', '$timeout', function ($scope, $http, $rootScope, $timeout) {


      // $scope.URL = "http://upload.wikimedia.org/wikipedia/en/2/24/Lenna.png";
      //       $scope.ORIGINAL_SIZE = 473831;
      //       $scope.info = "";

      //       $scope.fetch = function() {
      //         // Resetting headers to Accept */* is necessary to perform a simple cross-site request
      //         // (see https://developer.mozilla.org/en-US/docs/HTTP/Access_control_CORS#Simple_requests)
      //         delete $http.defaults.headers.common['X-Requested-With'];
      //         $http.get($scope.URL, {
      //           responseType: "arraybuffer"
      //         }).
      //         success(function(data) {

      //             $scope.Images = data;
      // 
      //           console.log("Trying saveBlob method ...");
      //           var blob = new Blob([data], {
      //             type: 'image/png'
      //           });
      //           console.log(blob);
      //           if (navigator.msSaveBlob)
      //             navigator.msSaveBlob(blob, 'Lenna.png');
      //           else {
      //             // Try using other saveBlob implementations, if available
      //             var saveBlob = navigator.webkitSaveBlob || navigator.mozSaveBlob || navigator.saveBlob;
      //             if (saveBlob === undefined) throw "Not supported";
      //             saveBlob(blob, filename);
      //           }
      //           console.log("saveBlob succeeded");


      //         }).
      //         error(function(data, status) {
      //           $scope.info = "Request failed with status: " + status;
      //         });
      //       };

      
        $scope.display = function () {
          $http.get('http://172.20.70.72:9000/api/imageLogs')
            .success(function (data) {
              $scope.Images = data;
              if ($scope.Images.length > 0) {
                $scope.onShowImage($scope.Images[0].Image_Path);
              }
            })
            .error(function () {
              console.log("An Error has occured while loading posts!");
            });


          $scope.onShowImage = function (Image_Path) {
            $scope.ShowImage = false;
            $scope.AnimationImageName = Image_Path

            $timeout(function () {
              $scope.ShowImage = true;
            }, 400);

          }
        }

        //  $scope.download = function() {
        //   $http.get('http://192.168.200.14:9000/api/imageLogs', {
        //       responseType: "arraybuffer"
        //     })
        //     .success(function(data) {
        //       var anchor = angular.element('<a/>');
        //       var blob = new Blob([data]);
        //       anchor.attr({
        //         href: window.URL.createObjectURL(blob),
        //         target: '_blank',
        //         download: 'fileName.png'
        //       })[0].click();
        //     })
        // }

        $scope.SettingFile = ""; $scope.uploadFile = function () {
          var file = $scope.SettingFile;
          var uploadUrl = "http://172.20.70.72:9000/api/uploadPhoto";
        


            var fd = new FormData();
               fd.append('file', file);
            
               $http.post(uploadUrl, fd, {
                  transformRequest: angular.identity,
                  headers: {'Content-Type': undefined}
               }).success(function(response){
                    $rootScope.fileValue = response.value;

                    $scope.display();
               }).error(function(err){

                 console.log(err);
               });
        };
      }]).directive('settingUpload', [function () {
      return {
        restrict: 'A',
        link: function (scope, elem, attrs) {
          var canvas = document.createElement("canvas");
          var reader = new FileReader();
          reader.onload = function (e) {
            scope.settingImage = e.target.result;
            var image = new Image();
            image.src = e.target.result;
            var area = [];
            image.onload = function () {
              area = imageScale(image.width, image.height);

              var ctx = canvas.getContext("2d");
              canvas.width = area.width;
              canvas.height = area.height;

              ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
              var dataurl = canvas.toDataURL("image/png");
              scope.image = dataurl;

              // var imageContent = atob(dataurl.substring(22));
              var blobBin = atob(dataurl.split(',')[1]);
              var array = [];
              for (var i = 0; i < blobBin.length; i++) {
                array.push(blobBin.charCodeAt(i));
              }
              var file = new Blob([new Uint8Array(array)], {
                type: 'image/jpeg'
              });
              file.name = scope.SettingValue;
              if (file.name.length > 100) {
                file.name = file.name.substring(0, 100) + ".jpg";
              }
              scope.SettingFile = file;
              console.log(scope.SettingFile);
              scope.$apply();
            }
            if (scope.settingImage) {
              scope.serverimage = false;
            }
            scope.$apply();
          }

          elem.on('change', function () {
            reader.readAsDataURL(elem[0].files[0]);
            scope.SettingFile = elem[0].files[0];
            scope.SettingValue = elem[0].files[0].name.replace(" ", "");
            if (scope.model) {
              scope.model.FileName = elem[0].files[0].name.replace(" ", "");
            }

          });
        }
      };
    }]);