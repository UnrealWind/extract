/**
 * Created by geqimeng on 17-11-14.
 */
//page类
angular.module("infi-basic").service('Page',['pageFct','$http',function(pageFct,$http){

    /**
     * 	service个人认为其实就是一个类的意思
     * 	将factory放在 这个类的 this 属性下，相当于创建了一个公有的接口，
     * 	这个接口默认应该是相当于实例化了 factory， 按照书上和网上的说法，具体是不是个人没有验证，不过既然 都用了service这个名字了，看来应该是实例化了
     * 	然后在controller中直接调用即可，
     */

    this.genView = function(page){
        return pageFct.pageArr(page);
    };
}]);

//用于获取pageArr，用于显示分页，以及page的事件
angular.module("infi-basic").factory('pageFct',function(){

    /**
     *	目前来看应该是这个原理。
     *	每个factory中需要声明有且只有一个对象，这个对象命名是可以自己定义的，其中所有的方法都需要放在这个对象之中，
     *	和名字一样，很像一个工厂，而services中可以选择调用工厂中的哪个方法，
     *	这样看来还是蛮方便的，比原生js更加容易理解一些，可以直接通过这种方法来创建工厂，原生js创建工厂会更加复杂一些，
     */
    var factory = {};
    factory.pageArr = function(page){

        //pageArr 用于存放用于ng-repeat的分页数据
        var pageArr = [];

        //计算出最多有多少页
        var totalPage = page.totalPages;
        var pageNum = page.number+1;

        //决定mark出现的位置
        if(totalPage>9){
            for(var i = pageNum-4;i<pageNum+5;i++){
                if(0<i && i<totalPage+1){
                    pageArr.push(factory.genPageArr(pageNum,i,totalPage));
                };
            };
        }else{
            for(var i = 0;i<totalPage;i++){
                pageArr.push(factory.genNormalPageArr(pageNum,i));
            }
        }


        return pageArr;
    };
    //
    factory.genPageArr = function(pageNum,i,totalPage){
        if((i===(pageNum+3)|| i===(pageNum-3)) && 10<totalPage && i!==1 && i!== totalPage ){
            return {"value":"...","pageNum":"false"};
        }else if(i===pageNum+4 && pageNum!=totalPage){
            return {"value":totalPage,"pageNum":"false"};
        }else if(i===pageNum-4 && pageNum!=totalPage){
            return {"value":1,"pageNum":"false"};
        }else if(pageNum == i){
            return {"value": i,"pageNum":"true"};
        }else{
            return {"value": i,"pageNum":"false"};
        }
    };

    factory.genNormalPageArr = function(pageNum,i){
        if(pageNum === i+1){
            return {"value": pageNum,"pageNum":"true"};
        }else{
            return {"value": i+1,"pageNum":"false"};
        }
    };
    return factory;
});


