(function()
{
    var netpolling = angular.module('netpolling', ['ui.bootstrap', 'monospaced.mousewheel']).config(function($interpolateProvider)
                                                                        {
                                                                            $interpolateProvider.startSymbol("[[").endSymbol("]]");
                                                                        });

    netpolling.factory("Share", function(Cookies)
                                {
                                    return {
                                        "csrf":Cookies.GetCookie("csrftoken"),
                                        "id":0,
                                        "id_menu":null,
                                        "Network":{},
                                        "BW":{
                                            "color":"",
                                            "width":0,
                                            "tbw":0,
                                            "pbw":0
                                        },
                                        "Hosts":[],
                                        "Info":{
                                            "cls":"",
                                            "why":""
                                        },
                                        "Param":{},
                                        "CurrentDevice":{
                                            "hostname":"",
                                            "ip":"",
                                            "mac":"",
                                            "bw":{"value":0, "percent":0}
                                        },
                                        "Available":{"os":0, "sniff":0},
                                        "InfoViz":{
                                            "Diameter":800,
                                            "Translate":{x:400,y:400}
                                        },
                                        "DnD":{
                                            "drag":0,
                                            "currentPos":{"x":null, "y":null}
                                        }
                                    };
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
                                                        }
                                        };
                                    });

    netpolling.factory('Ajax', function($http, Modal, Share)
                                {
                                    return {
                                        "Control": function(id)
                                                {
                                                    $http({
                                                        url:'/control/',
                                                        method:"POST",
                                                        headers:{"Content-Type":"application/X-WWW-form-urlencoded", "X-CSRFToken": Share.csrf, "X-Requested-With":"XMLHttpRequest"},
                                                        data:{"id":id}
                                                    }).success(function(data)
                                                                {
                                                                    Modal.Modal(data, id);
                                                                }).error(function()
                                                                        {
                                                                            alert("fail")
                                                                        });
                                                },
                                        "GetJson":function(url, getValue)
                                                    {
                                                        $http({
                                                            url:url,
                                                            method:"POST",
                                                            headers:{"Content-Type":"application/X-WWW-form-urlencoded", "X-CSRFToken": Share.csrf, "X-Requested-With":"XMLHttpRequest"}
                                                        }).success(function(data)
                                                                    {
                                                                        //Share.Network = data;
                                                                        getValue(data);
                                                                    }).error(function()
                                                                            {
                                                                                alert("fail")
                                                                            });
                                                    },
                                        "ActionSrv": function(url, data, type, doAction)
                                                    {
                                                        Share.Available[type] = 1;
                                                        $http({
                                                        url:url,
                                                        method:"POST",
                                                        headers:{"Content-Type":"application/X-WWW-form-urlencoded", "X-CSRFToken": Share.csrf, "X-Requested-With":"XMLHttpRequest"},
                                                        data:data
                                                    }).success(function(data)
                                                                {
                                                                    Share.Available[type] = 0;
                                                                    doAction(data);
                                                                }).error(function(data)
                                                                            {
                                                                                alert("Fail");
                                                                                Share.Available[type] = 0;
                                                                            });
                                                    }
                                    };
                                });

    netpolling.factory("Redirect", function()
                                    {
                                        return {
                                            "Visu": function()
                                                    {
                                                         window.open("/visu/");
                                                    }
                                        };
                                    });

    netpolling.factory("Modal", function($modal)
                                {
                                    return {
                                        "Modal":function(data, id)
                                                {
                                                    $modal.open({
                                                        templateUrl: '/modal/'+id,
                                                        controller: function ($scope, $modalInstance, Share, Ajax)
                                                                    {
                                                                        $scope.oneAtATime = true;
                                                                        $scope.content = data;
                                                                        $scope.formData = {};
                                                                        $scope.ok = function ()
                                                                                    {
                                                                                        $modalInstance.close();
                                                                                    };

                                                                        $scope.cancel = function ()
                                                                                        {
                                                                                            $modalInstance.dismiss('cancel');
                                                                                        };

                                                                        $scope.submit = function(info)
                                                                                        {
                                                                                            /*console.log($scope);
                                                                                            console.log($scope.content);*//**/
                                                                                            var data = {};
                                                                                            if(id == 0)
                                                                                            {
                                                                                                //d3.selectAll("#form0>input")
                                                                                                r = info == "form0"?d3.selectAll("#form0>section>input"):d3.selectAll("#form1>section>input");
                                                                                                console.log(r);

                                                                                            }
                                                                                            else if (id == 1)
                                                                                            {
                                                                                                r = d3.selectAll("#form0>input");
                                                                                                //console.log(JSON.stringify(Share.Network));
                                                                                                data["network"] = Share.Network;
                                                                                            }
                                                                                            else if (id == 4)
                                                                                            {
                                                                                                r = d3.selectAll("#form0>section>input");
                                                                                            }
                                                                                            else
                                                                                                alert("Hum hum ... don't try that !!!");
                                                                                            for(var i = 0; i < r[0].length; i++)
                                                                                            {
                                                                                                data[r[0][i].name] = r[0][i].value;
                                                                                            }
                                                                                            console.log(data);
                                                                                            Ajax.ActionSrv("/ajaxform/"+id+"/", data, "unknown", function(resp)
                                                                                                                                {
                                                                                                                                    console.log(resp);
                                                                                                                                });
                                                                                        };
                                                                    }});
                                                }
                                    };
                                });

    netpolling.factory("RootCtrl", function(Ajax, Redirect, Share)
                                    {
                                        return {
                                            "ViewCtrl":function(id)
                                                        {
                                                            Share.id_menu = id;
                                                            if(id >= 0 && id <= 1 || id >= 3 && id <= 6)
                                                            {
                                                                Ajax.Control(id);
                                                            }
                                                            else if (id == 2)
                                                            {
                                                                Redirect.Visu();
                                                            }
                                                            else
                                                            {
                                                                alert("ID pb")
                                                            }
                                                        }
                                        };
                                    });

    netpolling.factory("Constructor", function(Share, Ajax)
                                        {
                                            return {
                                                "Parameters": function()
                                                                {
                                                                    var gap = {x:0, y:0}; // object to know the gap of all items
                                                                    var move = 17;
                                                                    var zoom = 1;
                                                                    var czoom = 0.1;

                                                                    this.Init = function()
                                                                                {
                                                                                    Ajax.GetJson("/param/", function(data)
                                                                                                            {
                                                                                                                Share.Info.cls = data.success == 1? 'success' : 'danger';
                                                                                                                Share.Info.why = data.why;
                                                                                                                Hydrate(data.obj);
                                                                                                            });
                                                                                };

                                                                    Hydrate = function(obj)
                                                                                    {
                                                                                        move = parseFloat(obj.move);
                                                                                        //czoom = parseFloat(obj.czoom);
                                                                                    };

                                                                    this.UpdateParam = function(obj)
                                                                                        {
                                                                                            Hydrate(obj);
                                                                                        };

                                                                    this.Reset = function()
                                                                                {
                                                                                    gap.x = 0;
                                                                                    gap.y = 0;
                                                                                    zoom = 1;
                                                                                };

                                                                    this.GetGapX = function()
                                                                                    {
                                                                                        return(gap.x);
                                                                                    };

                                                                    this.GetGapY = function()
                                                                                    {
                                                                                        return(gap.y);
                                                                                    };

                                                                    this.SetGapX = function(s)
                                                                                    {
                                                                                        s == 0 ? gap.x -= move : gap.x += move;
                                                                                    };

                                                                    this.SetGapY = function(s)
                                                                                    {
                                                                                        s == 0 ? gap.y -= move : gap.y += move;
                                                                                    };

                                                                    this.UpdateGap = function(obj)
                                                                                    {
                                                                                        gap.x += obj.x;
                                                                                        gap.y += obj.y;
                                                                                    };

                                                                    this.GetMove = function()
                                                                                    {
                                                                                        return(move);
                                                                                    };

                                                                    this.SetMove = function(v)
                                                                                    {
                                                                                        move = parseInt(y);
                                                                                    };

                                                                    this.GetZoom = function()
                                                                                        {
                                                                                            return(zoom);
                                                                                        };
                                                                    this.SetZoom = function(s)
                                                                                        {
                                                                                            s == 0 ? zoom -= czoom : zoom += czoom;
                                                                                        };
                                                                }
                                            };
                                        });

    netpolling.factory("Spy", function(Ajax, Info, Share)
                                {
                                    return {
                                        "OSFingerPrinting": function(ip)
                                                            {
                                                                if (Share.Available.os == 0)
                                                                    if (/^[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}$/.test(ip))
                                                                        Ajax.ActionSrv('/os/', {"ip":ip}, 'os', function(data)
                                                                                                                {
                                                                                                                    Info.Update(data.success == 0 ? "success" : "error", data.rep);
                                                                                                                });
                                                                    else
                                                                        Info.Update("error", "You must target a device for the OS finger print");
                                                                else
                                                                    Info.Update("info", "");
                                                            },
                                        "Sniff": function(name, ip, time)
                                                    {
                                                        if (Share.Available.sniff == 0)
                                                            if (/^[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}$/.test(ip))
                                                                Ajax.ActionSrv('/sniff/', {"name":name, "ip":ip, "time":time}, 'sniff', function(data)
                                                                                                                                        {
                                                                                                                                            Info.Update(data.success == 0 ? "success" : "error", data.rep);
                                                                                                                                        })
                                                            else
                                                                Info.Update("error", "You must target a device for sniffing it");
                                                        else
                                                            Info.Update("info", "The sniffing is not available actually, wait plz");
                                                    }
                                    };
                                });

    netpolling.factory("LoadData", function(Ajax, Share, $rootScope)
                                    {
                                        return {
                                            "Network": function(url)
                                                        {
                                                           window.setInterval(pwned = function()
                                                                            {
                                                                                Ajax.GetJson(url, function(network)
                                                                                                            {
                                                                                                                Share.Network = network;
                                                                                                                $rootScope.$broadcast("networkReady");
                                                                                                                tbw = 0;
                                                                                                                pbw = 0;
                                                                                                                for(var w = 0; w < Share.Network.children.length; w++)
                                                                                                                {
                                                                                                                    if (Share.Network.children[w].children)
                                                                                                                        console.log("okidoki");
                                                                                                                    if (Share.Network.children[w].bw != null && Share.Network.children[w].percent != null)
                                                                                                                    {
                                                                                                                        tbw += Share.Network.children[w].bw*8;
                                                                                                                        pbw += Share.Network.children[w].percent;
                                                                                                                    }
                                                                                                                }
                                                                                                                Share.BW.color = pbw < 25 ? "green" : pbw < 50 ? "yellow" : pbw < 75 ? "orange" : "red";
                                                                                                                Share.BW.width = pbw*3.5;
                                                                                                                Share.BW.tbw = tbw.toFixed(2);
                                                                                                                Share.BW.pbw = pbw.toFixed(2);
                                                                                                            })
                                                                            }, 30000);
                                                            pwned();
                                                        }
                                           };
                                        });

    netpolling.factory("MapEdit", function(Share, $rootScope)
                                    {
                                        return {
                                            "Move":function(value)
                                                    {
                                                        value == "x+" ? Share.Param.SetGapX(1) : value == "x-" ? Share.Param.SetGapX(0) : value == "y+" ? Share.Param.SetGapY(0) : Share.Param.SetGapY(1);
                                                        $rootScope.$broadcast("mapMove");
                                                    },
                                            "Zoom":function(value)
                                                    {
                                                        value == "+" ? Share.Param.SetZoom(1)  : Share.Param.SetZoom(0);
                                                        $rootScope.$broadcast("mapZoom");
                                                    },
                                            "ZoomWheel":function($event, $delta, $deltaX, $deltaY)
                                                        {
                                                            $delta > 0 ? Share.Param.SetZoom(1)  : Share.Param.SetZoom(0);
                                                            $rootScope.$broadcast("mapZoom");
                                                        },
                                            "DragStart": function($event)
                                                            {
                                                                Share.DnD.drag = 1;
                                                                Share.DnD.currentPos = {"x":$event.clientX, "y":$event.clientY};
                                                            },
                                            "Drag": function($event)
                                                    {
                                                        Share.DnD.drag == 1 ? function(){ Share.Param.UpdateGap({"x":($event.clientX-Share.DnD.currentPos.x)/20,"y":($event.clientY-Share.DnD.currentPos.y)/20}); $rootScope.$broadcast("mapMove"); }() : {};
                                                    },
                                            "Drop": function($event)
                                                    {
                                                        Share.DnD.drag = 0;
                                                        Share.DnD.currentPos = {"x":null, "y":null};
                                                    },
                                            "Reset": function()
                                                        {
                                                            Share.Param.Reset();
                                                            $rootScope.$broadcast("mapZoom");
                                                            $rootScope.$broadcast("mapMove");
                                                        }
                                        };
                                    });

    netpolling.factory("Effect", function()
                                    {
                                        return {
                                          "EffectSearch":function(id, x, y)
                                                            {
                                                                tx = parseFloat(x) < 176?400-parseFloat(x):400+parseFloat(x);
                                                                console.log(tx);
                                                                d3.select("svg>g").attr("transform", "translate("+tx+","+450+")");
                                                                d3.select("#"+id+">circle")
                                                                    .transition().attr("r", 10).attr("stroke", "red").attr("stroke-width", "3px")
                                                                    .transition().duration(2500).attr("r", 4.5)
                                                                    .transition().duration(2500).attr("r", 10)
                                                                    .transition().duration(2500).attr("r", 4.5)
                                                                    .transition().duration(2500).attr("r", 10)
                                                                    .transition().duration(2500).attr("r", 4.5).attr("stroke", "black").attr("stroke-width", "1.5px");
                                                            }
                                        };
                                    });

    netpolling.factory("Info", function(Share, $rootScope)
                                {
                                    return {
                                      "Update": function(type, msg)
                                                {
                                                    Share.Info = {"cls":type, "why":msg};
                                                    console.log(Share.Info);
                                                    $rootScope.$broadcast("UpdateInfo");
                                                }
                                    };
                                });

    netpolling.directive('nMap', ['Share', function(Share)
                                        {
                                            return{
                                                restrict: "E",
                                                template:'<div id="map" class="DesignCanvas" msd-wheel="mousezoom($event, $delta, $deltaX, $deltaY)" ng-mousedown="dragstart($event)" ng-mousemove="drag($event)" ng-mouseup="drop($event)"></div>',
                                                replace: true,
                                                transclude: false,
                                                link: function ($scope)
                                                        {
                                                            /*$scope.$on('networkReady', function($scope, $rootScope)
                                                                                        {*/
                                                            var tree = d3.layout.tree()
                                                                .size([360, Share.InfoViz.Diameter/ 2])
                                                                .separation(function(a, b) { return (a.parent == b.parent ? 1 : 2) / a.depth; });
                                                            var diagonal = d3.svg.diagonal.radial()
                                                                .projection(function(d) { return [d.y, d.x / 180 * Math.PI]; });
                                                            var svg = d3.select("#map").append("svg")
                                                                .attr("width", 900)
                                                                .attr("height", 600)
                                                                .attr("transform", "scale("+Share.Param.GetZoom()+")")
                                                                .append("g")
                                                                //.attr("transform", "translate(400,400)");
                                                                //.attr("transform", "translate("+((diameter/2)+Share.Param.GetGapX())+","+((diameter/2)+Share.Param.GetGapX()-150)+")");
                                                                .attr("transform", "translate("+((400)+Share.Param.GetGapX())+","+((400)+Share.Param.GetGapX()-150)+")");
                                                                //.attr("transform", "translate("+((Share.InfoViz.Diameter/2)+Share.Param.GetGapX())+","+((Share.InfoViz.Diameter/2)+Share.Param.GetGapX()-150)+")");
                                                            //scope.$watch('network', function()
                                                            $scope.$on("mapZoom", function()
                                                                                    {
                                                                                        d3.select("svg").attr("transform", "scale("+Share.Param.GetZoom()+")")
                                                                                    });
                                                            $scope.$on("mapMove", function()
                                                                                    {
                                                                                        d3.select("#map>svg>g").attr("transform", "translate("+((400)+Share.Param.GetGapX())+","+((400)+Share.Param.GetGapY()-150)+")");
                                                                                    });
                                                            $scope.$on('networkReady', function($scope, $rootScope)
                                                                                        {
                                                                                            //var nodes = tree.nodes(Share.Network);
                                                                                            d3.selectAll("svg>g>*").remove();
                                                                                            Share.Hosts = [];
                                                                                            Share.id = 0
                                                                                            var nodes = tree.nodes(Share.Network);
                                                                                            var links = tree.links(nodes);
                                                                                            var link = svg.selectAll(".link")
                                                                                                .data(links)
                                                                                                .enter().append("path")
                                                                                                .attr("class", "link")
                                                                                                .attr("d", diagonal)
                                                                                                .attr("stroke", function(d)
                                                                                                                {
                                                                                                                    return d.target.percent == null ? "rgb(0, 0, 255)" : d.target.percent < 1 ? "rgb(0, 252, 0)" : d.target.percent < 2 ? "rgb(36, 216, 0)" : d.target.percent < 5 ? "rgb(72, 180, 0)" : d.target.percent < 10 ? "rgb(108, 144, 0)" : d.target.percent < 20 ? "rgb(144, 108, 0)" : d.target.percent < 50 ? "rgb(180, 72, 0)" : d.target.percent < 70 ? "rgb(216, 36, 0)" : "rgb(252, 0, 0)";
                                                                                                                });
                                                                                            var node = svg.selectAll(".node")
                                                                                                .data(nodes)
                                                                                                .enter().append("g")
                                                                                                .attr("class", "node")
                                                                                                //.attr("transform", function(d) {return d.y == 0 ? "translate(-20,-25)" : "rotate(" + (d.x - 90) + ")translate(" + (d.y -25) + ")"; })
                                                                                                .attr("id", function(d)
                                                                                                            {
                                                                                                                Share.id++;
                                                                                                                Share.Hosts.push({"hostname": d.hostname, "ip": d.ip, "id":"g"+Share.id, "x":d.x, "y":d.y});
                                                                                                                $scope.targetScope.$broadcast("UpdateListDevice");
                                                                                                                return "g"+Share.id;
                                                                                                            })
                                                                                                .attr("transform", function(d)
                                                                                                                    {
                                                                                                                        return "rotate(" + (d.x - 90) + ")translate(" + d.y + ")";
                                                                                                                    });
                                                                                                //.attr("transform", function(d) {return "rotate(" + (d.x - 90) + ")translate(" + (d.y-25) + ")"; })

                                                                                            node.append("circle")
                                                                                                .attr("r", 4.5)
                                                                                                .attr("fill", function(d)
                                                                                                                {
                                                                                                                    return d.device == "apple" ? "red" : d.device == "vm" ? "blue" : d.device == "computer" ? "grey" : d.device == "router" ? "green" : d.device == "phone" ? "orange" : "yellow"
                                                                                                                })
                                                                                                .attr("stroke", "black")
                                                                                                .attr("stroke-width", "1.5px")
                                                                                                .on("mouseover", function(d)
                                                                                                                    {
                                                                                                                        Share.CurrentDevice = {"hostname":d.hostname, "ip":d.ip, "mac":d.mac, "bw":{"value":d.bw, "percent": d.percent}, "img": d.device};
                                                                                                                        $scope.targetScope.$broadcast("UpdateDevice");
                                                                                                                    })

                                                                                            /*node.append("circle")
                                                                                                .attr("r", 10)
                                                                                                .attr("fill", "red")
                                                                                                .attr("stroke", "black")
                                                                                                .attr("stroke-width", "1.5px");*/
                                                                                        });
                                                        }
                                            };
                                        }]);

    netpolling.controller('MenuCtrl', function($scope,RootCtrl)
                                        {
                                            $scope.call = RootCtrl.ViewCtrl;
                                        });

    netpolling.controller('MapCtrl', function($scope, LoadData, Share, Constructor, MapEdit, Spy, Effect)
                                        {
                                            Share.Param = new Constructor.Parameters();
                                            Share.Param.Init();
                                            LoadData.Network("/getjson/");
                                            $scope.bw = Share.BW;
                                            $scope.info = Share.Info;
                                            $scope.device = Share.CurrentDevice;
                                            $scope.$on('UpdateDevice', function()
                                                                        {
                                                                            $scope.$apply(function()
                                                                                            {
                                                                                                $scope.device = Share.CurrentDevice;
                                                                                            });
                                                                        }, true);
                                            $scope.$on('UpdateListDevice', function()
                                                                            {
                                                                                $scope.listdevice = Share.Hosts;

                                                                            }, true);
                                            $scope.$on('UpdateInfo', function()
                                                                        {
                                                                           $scope.info = Share.Info;
                                                                        });
                                            $scope.draw = Share.InfoViz;
                                            $scope.move = MapEdit.Move;
                                            $scope.zoom = MapEdit.Zoom;
                                            $scope.dragstart = MapEdit.DragStart;
                                            $scope.drag = MapEdit.Drag;
                                            $scope.drop = MapEdit.Drop;
                                            $scope.reset = MapEdit.Reset;
                                            $scope.mousezoom = MapEdit.ZoomWheel;
                                            $scope.OS = Spy.OSFingerPrinting;
                                            $scope.Sniff =
                                            $scope.Sniff = function(ip)
                                                            {
                                                                Spy.Sniff($scope.sname, ip[0][0], $scope.stime);
                                                            };
                                            $scope.EffectMap = Effect.EffectSearch;
                                        });
})();