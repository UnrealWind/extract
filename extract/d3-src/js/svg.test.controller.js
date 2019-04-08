angular.module('infi-basic').controller('SvgController', ['$scope', 'SYS','SvgService', function ($scope, SYS, SvgService) {
    $scope.btnJson = null;
    $scope.dataJson = null;
    $scope.labelType = "心脏";
    function init(){
        SvgService.getBtnJson().then(function(msg){
            $scope.btnJson = msg.data;
        });
        SvgService.getDataJson().then(function(msg){
            $scope.dataJson = msg.data;
        });
    }
    $scope.switch = function(name){
        var svgdoc = document.getElementById("test1").getSVGDocument();
        angular.forEach($scope.dataJson,function(value,key){
            if(key == name){
                d3.select(svgdoc).select("#"+value.imgId).style("opacity","1");
                d3.select(svgdoc).select("#"+value.lineId).style("stroke-opacity","1");
                // d3.select(svgdoc).select("#"+value.textId).style("fill-opacity","1");
                d3.select(svgdoc).select("#"+value.textId).style("fill-opacity","1");
                var arr = value.textLabel.split("<br/>");
                var text = d3.select(svgdoc).select("#"+value.textId);
                text.selectAll("tspan")
                    .data(arr)
                    .enter()
                    .append("tspan")
                    .attr("x",text.attr("x"))
                    .attr("dy","25px")
                    .text(function(d){
                        return d;
                    })
            }else{
                d3.select(svgdoc).select("#"+value.imgId).style("opacity",value.imgOpacity);
                d3.select(svgdoc).select("#"+value.lineId).style("stroke-opacity","0");
                d3.select(svgdoc).select("#"+value.textId).style("fill-opacity","0");
            }
        });
        var id = "#" + $scope.dataJson[name].imgId;
        d3.select(svgdoc).select(id).style("opacity","1");
    };
    init();
}]).service('SvgService',['$http','SYS',function($http,SYS){
    this.getBtnJson = function(){
        return $http.get(SYS.jsonUrl+'btn.json').then(function(msg){
            return msg.data;
        })
    };
    this.getDataJson = function(){
        return $http.get(SYS.jsonUrl+'data.json').then(function(msg){
            return msg.data;
        })
    }
}]);
