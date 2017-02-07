var app=angular.module('myApp',['ngRoute']);
//主控制器
app.controller('myCtrl',['$scope','$rootScope','$interval',function($scope,$rootScope,$interval){
    $interval(function(){
        $('.img').animate({'backgroundColor':'#faf4e8'},1000).animate({'backgroundColor':'#d3cda9'},1000);
    },2000);
    $rootScope.order = [];
    $rootScope.blo = false;
    $rootScope.changeBg = 0;
    $scope.keyw = '';
    $scope.hotenter = function(){       //定义热菜入口跳转页面按钮
        $rootScope.blo = false;
        window.location.href = '#/';
    }
    $scope.oClick = function(){     //定义点击跳转到介绍页面
        console.log(1);
        window.location.href = 'introduce.html';
    }
    $scope.searchHref = function(a){    //定义查找按钮函数，通过路由加载
        $scope.keyw = a;
        window.location.href = '#/list/filter';
    };
    $scope.active = function(a){        //定义目录点击跳转函数，通过路由加载
        $rootScope.changeBg = a;
        $rootScope.blo = false;
        window.location.href='#/list/'+a;
    };
    $scope.date = function(){           //定义日期获取函数
        var date = new Date().getTime();
        return date;
    };

    //定义目录数据;
    $scope.data = ['烧菜','炖菜','热菜','凉菜','甜品','饮品','小吃'];

    $scope.href = function(){       //定义订单页面函数，用路由加载
        $rootScope.blo = true;
        window.location.href = '#/car';
    }
}]);
app.filter("listfilter",function(){     //自定义菜单过滤器，通过菜单关键字加载
    return function(item,str){
        var arr = [];
        //console.log(str);
        angular.forEach(item,function(ele){
            //console.log(ele.keywords.indexOf(str));
            if(ele.keywords.indexOf(str)!==-1){
                arr.push(ele);
            }
        })
        return arr;
    }
});
//配置路由
app.config(['$routeProvider',function($routeProvider){
    $routeProvider
        .when('/',{     //路由默认地址
            controller:"homeCtrl",
            templateUrl:"views/orderHome.html"
        })
        .when('/list/:id',{     //菜单筛选路由配置
            controller:"listCtrl",
            templateUrl:"views/item.html"
        })
        .when('/car',{          //订单页面路由配置
            controller:"orderMenuCtrl",
            templateUrl:"views/orderMenu.html"
        })
        .otherwise({redirectTo:'/'})
}]);
app.controller('homeCtrl',['$scope','$rootScope','$routeParams',function($scope,$rootScope,$routeParams){
    $scope.data = data;
    $scope.aler = data[1];
    $scope.id = $routeParams.id;
    $scope.filterStr = ['烧菜','炖菜','热菜','凉菜','甜品','饮品','小吃'];
    $scope.details = function(Oid){         //定义弹窗传值函数
        $scope.aler = data[Oid];
        return false;
    };
    $scope.add = function(a){           //定义点菜按钮函数，同时也作为删除按钮

        $scope.data[a].isActive = ! $scope.data[a].isActive;
        if($scope.data[a].isActive){
            $rootScope.order.push($scope.data[a]);
            $rootScope.order[$rootScope.order.length -1].num = 1;
        }else{
            var arr = [];
            angular.forEach($rootScope.order,function(ele){
                if(ele.id!==a){
                    arr.push(ele);
                }
            });
            $rootScope.order = arr;
        }
        return false;
    }
}])
app.controller('listCtrl',['$scope','$rootScope','$routeParams',function($scope,$rootScope,$routeParams){
    $scope.data = data;
    $scope.aler = data[0];
    $scope.id = $routeParams.id;
    $scope.filterStr = ['烧菜','炖菜','热菜','凉菜','甜品','饮品','小吃'];
    $scope.details = function(Oid){         //定义弹窗传值函数
        $scope.aler = data[Oid];
        return false;
    };
    $scope.add = function(a){               //定义点菜按钮函数，同时也作为删除按钮
        $scope.data[a].isActive = ! $scope.data[a].isActive;
        if($scope.data[a].isActive){
            $rootScope.order.push($scope.data[a]);
            $rootScope.order[$rootScope.order.length -1].num = 1;
        }else{
            var arr = [];
            angular.forEach($rootScope.order,function(ele){
                if(ele.id!==a){
                    arr.push(ele);
                }
            });
            $rootScope.order = arr;
        }
        return false;
    }
}]);
app.controller("orderMenuCtrl",["$scope","$timeout",'$rootScope','$location',function($scope,$timeout,$rootScope){
    $scope.subNum=function(itemId){  //单个菜品点击减少数量
        if($rootScope.order[itemId].num>1){
            $rootScope.order[itemId].num--;
        }
    };

    $scope.addNum=function(itemId){  //单个菜品点击增加数量
        $rootScope.order[itemId].num++;
    };
    $scope.del=function(i){             //单个菜品的删除
        // console.log(i)
        var arr = [];
        angular.forEach($rootScope.order,function(ele,index){
            if(index !== i){
                arr.push(ele);
            }else{
                $rootScope.order[index].isActive = false;
            }
        });
        $rootScope.order = arr;
    };
    $scope.singlePrice=function(item){ //单个菜品价格的合计
        var arr = [],price=0;
        var num = $rootScope.order[item].num,
            price = $rootScope.order[item].price;
        $rootScope.order[item].singlePrice = num * price;

        return $rootScope.order[item].singlePrice;
    };
    $scope.total=function(){            //价格的合计
        var total=0;
        angular.forEach($rootScope.order,function(ele){
            if(ele.singlePrice){
                total += ele.singlePrice;
            }else{
                total += ele.price;
            }
        });
        return total;
    };
    $scope.setPrice=function(){         //定时器的设置点击结算
        console.log(1);
        if($rootScope.order.length === 0){
            $scope.message = '请点菜';
            $('.or-frame').show();

            $timeout(function(){
                $rootScope.blo = false;
                window.location.href='#/';
            },1000);
        }else{
            $scope.message = '提交成功';
            $('.or-frame').show();

            $timeout(function(){
                $rootScope.order = [];
                $rootScope.blo = false;
                window.location.href='home.html';
            },3000);                //该函数延迟2秒执行
        }
    };
}]);
