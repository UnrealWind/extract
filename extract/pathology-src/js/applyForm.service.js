angular.module('infi-basic')
.service('ApplyFormService',['Utils', 'Upload', 'SYS', '$timeout',function(Utils, Upload, SYS, $timeout){

  /**
   * 将本页数据打成扁平格式对象
   * @param {*} orgData 源数据
   */
  this.flatOrgPageData = function(orgData) {
    var hasVisted = [],
        finalObj = {}

    orgData.forEach(function(ele, ind) {
      if(hasVisted.indexOf(ele.label) < 0) {
        hasVisted.push(ele.label)
        finalObj[ele.label] = []
      }

      ele.children.forEach(function(subEle, ind) {
        var tmpOjb = {
          kind: '',
          label: subEle.label,
          value: subEle.value ? subEle.value : '-'
        }

        finalObj[ele.label].push(tmpOjb)
      })

      finalObj[ele.label][0].kind = ele.label
    })
    
    return finalObj
  }


  /**
   * 生成报告页所需数据的字典
   * @param {*} orgData 
   */
  this.genReportData = function(orgData) {
    var finalObj = {}

    orgData.forEach(function(ele, ind) {
      ele.children.forEach(function(subEle, ind) {
        finalObj[subEle.labelId] = subEle
      })
    })
    
    return finalObj

  }


  /**
   * 上传文件
   * @param {*} file  文件
   * @param {*} errFiles 
   */
  this.uploadImg =function(file, errFiles, recordId) {
    // $scope.uploadFiles = function(files, errFiles) {
    //   $scope.files = files;
    //   $scope.errFiles = errFiles;
    //   angular.forEach(files, function(file) {
    //       file.upload = Upload.upload({
    //           url: 'https://angular-file-upload-cors-srv.appspot.com/upload',
    //           data: {file: file}
    //       });

    //       file.upload.then(function (response) {
    //           $timeout(function () {
    //               file.result = response.data;
    //           });
    //       }, function (response) {
    //           if (response.status > 0)
    //               $scope.errorMsg = response.status + ': ' + response.data;
    //       }, function (evt) {
    //           file.progress = Math.min(100, parseInt(100.0 * 
    //                                    evt.loaded / evt.total));
    //       });
    //   });
    // }





    if (file) {
      file.upload = Upload.upload({
          url: `${SYS.url}form/picture/${recordId}`,
          data: {file: file}
      });
    }

    file.upload.then(function (response) {
      $timeout(function () {
          file.result = response.data;
      });
    }, function (response) {

    });
  }
}]);