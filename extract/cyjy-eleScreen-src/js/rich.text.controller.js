angular.module('infi-basic').controller('RichTextController',['$scope','$location','SYS','$rootScope','ManagementService','Utils','$routeParams',function ($scope,$location,SYS,$rootScope,ManagementService,Utils,$routeParams) {
    $scope.article = {
        title:null,
        location:null,
        thumbnail:null,
        weight:null,
        articleText:null
    };
    if($routeParams.id){
        $scope.article.id = $routeParams.id;
    }

    function initToolbarBootstrapBindings() {
        var fonts = ['Serif', 'Sans', 'Arial', 'Arial Black', 'Courier',
                'Courier New', 'Comic Sans MS', 'Helvetica', 'Impact', 'Lucida Grande', 'Lucida Sans', 'Tahoma', 'Times',
                'Times New Roman', 'Verdana'],
            fontTarget = $('[title=Font]').siblings('.dropdown-menu');
        $.each(fonts, function (idx, fontName) {
            fontTarget.append($('<li><a data-edit="fontName ' + fontName +'" style="font-family:\''+ fontName +'\'">'+fontName + '</a></li>'));
        });
        $('a[title]').tooltip({container:'body'});
        $('.dropdown-menu input').click(function() {return false;})
            .change(function () {$(this).parent('.dropdown-menu').siblings('.dropdown-toggle').dropdown('toggle');})
            .keydown('esc', function () {this.value='';$(this).change();});

        $('[data-role=magic-overlay]').each(function () {
            var overlay = $(this), target = $(overlay.data('target'));
            overlay.css('opacity', 0).css('position', 'absolute').offset(target.offset()).width(target.outerWidth()).height(target.outerHeight());
        });
        if ("onwebkitspeechchange" in document.createElement("input")) {
            var editorOffset = $('#editor').offset();
            $('#voiceBtn').css('position','absolute').offset({top: editorOffset.top, left: editorOffset.left+$('#editor').innerWidth()-35});
        } else {
            $('#voiceBtn').hide();
        }
    };
    function showErrorAlert (reason, detail) {
        var msg='';
        if (reason==='unsupported-file-type') { msg = "Unsupported format " +detail; }
        else {
            console.log("error uploading file", reason, detail);
        }
        $('<div class="alert"> <button type="button" class="close" data-dismiss="alert">×</button>'+
            '<strong>File upload error</strong> '+msg+' </div>').prependTo('#alerts');
    };
    initToolbarBootstrapBindings();

    $('#editor').wysiwyg({ fileUploadError: showErrorAlert} );

    $scope.updateArticle  = function(){
        $scope.article.articleText = $('#editor').wysiwyg()[0].innerHTML;
        ManagementService.saveArticle($scope.article).then(function(msg){
            Utils.sysTip($scope,msg);
        })
    }

    $scope.upadateImg = function (that) {
        var tagUrl = null;
        var file = that.files[0];
        var reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = function(e){
            $scope.article.thumbnail = encodeURI(this.result);
        }

    }
}]);