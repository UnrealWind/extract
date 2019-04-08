angular.module("infi-basic").service("PatiProfileService", [
  "$http",
  "SYS",
  "$location",
  "Utils",
  function($http, SYS, $location, Utils) {


    this.checkUsr = function() {
      var params = "";
      for (var key in $location.search()) {
        params += "&weiyi_" + key + "=" + $location.search()[key];
      }

      return $http
        .get(SYS.abnormalUrl + "user/adapter/weiyi?" + params)
        .then(function(msg1) {
          if (msg1.data.sucess === "error") {
            return {
              status: "error",
            };
          } else {
            return {
              status: "success",
              data: msg1.data.data
            };
          }
        }, function(error) {
          return {
            status: "error",
          };
        });
    };

    this.getAbnormalView = function(param) {
      var sendParam = {
        patient_id: param.xlPatientId
      };

      return $http.post(SYS.abnormalUrl + `view/data`, sendParam).then(
        function(msg) {
          if(msg.data.status == 'ok') {
            return {
              status: 'ok',
              data: JSON.parse(msg.data.data)
            }
          } else {
            return {
              status: "error"
            }
          }
        },
        function(error) {
          return {
            status: "error"
          };
        }
      );
    };
  }
]);
