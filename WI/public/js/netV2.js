(function()
{
    var id; //contains the id of the current click in the menu
    //var n = Raphael(document.getElementById('svgDevice'), 900, 600); // represents the device svg
    //var c = Raphael(document.getElementById('svgBw'), 900, 600); // represents the band-width svg
    //var t = Raphael(document.getElementById('svgSearch'), 900, 600); // represents the machine search
    //var csrftoken = getCookie('csrftoken'); // this is the django secure token for ajx request
    var objnet = []; // list of the device object in the part asynchronous
    var available = {os:0, sniff:0}; // object to know if an app is up or not
    var net;
    var kkeys = [];
    /*var param = new Param();
    param.Init();*/
    /**
     * @author Damien Goldenberg
     * @name GetCookie
     * @brief This function get the cookie specified in the in the input variable
     * @param name
     * @returns cookieValue
     */

    var netpolling = angular.module('netpolling', ['ui.bootstrap']).config(function($interpolateProvider)
                                                                        {
                                                                            $interpolateProvider.startSymbol("[[").endSymbol("]]");
                                                                        });

    netpolling.directive('NetowrkMap', function()
                                        {
                                            return{
                                                restrict: "E",
                                                replace: true,
                                                transclude: false,
                                                //controller: [ "$scope", function ($scope) { …  }],
                                                link: function (scope, element)
                                                        {
                                                            var width = 450;
                                                            var height = 400;
                                                            var color = d3.scale.category20();

                                                            // On récupère les données présentent dans scope.grapheDatas
                                                            // Le $watch a pour but de mettre à jour le graphe dès que les
                                                            // données présentent dans $scope.grapheDatas changent.
                                                            // Ex : suppression ou ajout de noeuds
                                                            scope.$watch('grapheDatas', function (grapheDatas)
                                                                                        {
                                                                                            var force = d3.layout.force()
                                                                                            .charge(-120)
                                                                                            .linkDistance(30)
                                                                                            .size([width, height])
                                                                                            .nodes(grapheDatas.nodes)
                                                                                            .links(grapheDatas.links)
                                                                                            .start();

                                                                                            var svg = d3.select("body").append("svg")
                                                                                            .attr("width", width)
                                                                                            .attr("height", height);

                                                                                            var link = svg.selectAll(".link")
                                                                                            .data(grapheDatas.links)
                                                                                            .enter().append("line")
                                                                                            .attr("class", "link")
                                                                                            .style("stroke-width", function(d) { return Math.sqrt(d.value); });

                                                                                            var node = svg.selectAll(".node")
                                                                                            .data(grapheDatas.nodes)
                                                                                            .enter().append("circle")
                                                                                            .attr("class", "node")
                                                                                            .attr("r", 5)
                                                                                            .style("fill", function(d) { return color(d.group); })
                                                                                            .call(force.drag);

                                                                                            node.append("title")
                                                                                            .text(function(d) { return d.name; });

                                                                                            force.on("tick", function() {
                                                                                                link.attr("x1", function(d) { return d.source.x; })
                                                                                                .attr("y1", function(d) { return d.source.y; })
                                                                                                .attr("x2", function(d) { return d.target.x; })
                                                                                                .attr("y2", function(d) { return d.target.y; });

                                                                                                node.attr("cx", function(d) { return d.x; })
                                                                                                .attr("cy", function(d) { return d.y; });
                                                                                            });
                                                                                        });
                                                        }
                                            }
                                        });

    netpolling.factory("Cookies", function()
                                    {
                                        return {
                                            "GetCookie": function (sName)
                                                        {
                                                            var oRegex = new RegExp("(?:; )?" + sName + "=([^;]*);?");
                                                            if (oRegex.test(document.cookie))
                                                                return decodeURIComponent(RegExp["$1"]);
                                                            else
                                                                return null;
                                                        },
                                        }
                                    });


    netpolling.factory('Ajax', function($http, Modal, Cookies)
                                {
                                    return {
                                        "control": function(id)
                                                {
                                                    $http({
                                                        url:'/control/',
                                                        method:"POST",
                                                        headers:{"Content-Type":"application/X-WWW-form-urlencoded", "X-CSRFToken": Cookies.GetCookie('csrftoken'), "X-Requested-With":"XMLHttpRequest"},
                                                        data:{"id":id}
                                                    }).success(function(data)
                                                                {
                                                                    Modal.modal(data, id);
                                                                }).error(function()
                                                                        {
                                                                            alert("fail")
                                                                        });
                                                },
                                    }
                                });

    netpolling.factory("Redirect", function()
                                    {
                                        return {
                                            "Visu": function()
                                                    {
                                                         window.open("/visu/");
                                                    },
                                        };
                                    });

    netpolling.factory("Modal", function($modal)
                                {
                                    return {
                                        "modal":function(data, id)
                                                {
                                                    $modal.open({
                                                        templateUrl: '/modal/'+id,
                                                        controller: function ($scope, $modalInstance)
                                                                    {
                                                                        //console.log(data);

                                                                        $scope.oneAtATime = true;
                                                                        $scope.content = data;
                                                                        $scope.ok = function ()
                                                                                    {
                                                                                        $modalInstance.close();
                                                                                    };

                                                                        $scope.cancel = function ()
                                                                                        {
                                                                                            $modalInstance.dismiss('cancel');
                                                                                        };
                                                                    }});
                                                },
                                    }
                                });

    netpolling.factory("RootCtrl", function(Ajax, Redirect)
                                    {
                                        return {
                                            "ViewCtrl":function(id)
                                                        {
                                                            if(id >= 0 && id <= 1 || id >= 3 && id <= 6)
                                                            {
                                                                Ajax.control(id);
                                                            }
                                                            else if (id == 2)
                                                            {
                                                                Redirect.Visu();
                                                            }
                                                            else
                                                            {
                                                                alert("ID pb")
                                                            }
                                                        },
                                        }
                                    });

    netpolling.factory("LoadData", function()
                                    {
                                        return {
                                            "JSON": function()
                                                    {

                                                    },
                                        };
                                    });

    netpolling.controller('MenuCtrl', function($scope,RootCtrl)
                                        {
                                            $scope.call = RootCtrl.ViewCtrl;
                                        });

    netpolling.controller('MapCtrl', function($scope)
                                        {

                                        });
})();