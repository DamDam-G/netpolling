$(window).load((function()
                {
                    var n = Raphael(document.getElementById('svgDevice'), 900, 600); // represents the device svg
                    var c = Raphael(document.getElementById('svgBw'), 900, 600); // represents the band-width svg
                    var t = Raphael(document.getElementById('svgSearch'), 900, 600); // represents the machine search
                    var csrftoken = GetCookie('csrftoken'); // this is the django secure token for ajx request
                    var objnet = []; // list of the device object in the part asynchronous
                    var kkeys = [];
                    var param = new Param();
                    $('#pop').resizable({animate: true}).draggable().tabs();

                    function GetCookie(name)
                    {
                        var cookieValue = null;
                        if (document.cookie && document.cookie != '')
                        {
                            var cookies = document.cookie.split(';');
                            for (var i = 0; i < cookies.length; i++)
                            {
                                var cookie = jQuery.trim(cookies[i]);
                                if (cookie.substring(0, name.length + 1) == (name + '='))
                                {
                                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                                    break;
                                }
                            }
                        }
                        return cookieValue;
                    }

                   function Device(ip, mac, os, device, name, bandwidth, percent, context, x, y, dim)
                    {
                        var ip = ip;
                        var mac = mac;
                        var os = os;
                        var device = device;
                        var hostname = name;
                        var bw = {p:percent, b:bandwidth};
                        var img = "/public/img/device/"+device+".svg";
                        var context = context;
                        var x = x + param.GetGapX();
                        var y = y + param.GetGapY();
                        var coeff = {x:55, y:50};
                        var dim = dim;

                        /**
                         * @author Damien Goldenberg
                         * @name Draw
                         * @brief This is a method for drawing a device and attach events
                         */

                        this.Draw = function()
                                    {
                                        context.image(img, x, y, 100, 100).scale(dim.x, dim.y).mouseover(function()
                                                                                                    {
                                                                                                        $("#d").html('<table><tr><td><label class="label">Hostname : </label></td><td>'+hostname+'</td></tr><tr><td><label class="label">IP : </label></td><td id="aip">'+ip+'</td></tr><tr><td><label class="label">MAC : </label></td></td><td>'+mac+'</td></tr><tr><td><label class="label">OS : </label></td></td><td><button id="dos" class="btn btn-inverse" type="button">Détection d\'OS</button></td></tr><tr><td><label class="label">Bande passante : </label></td></td><td> '+bw.p+'% ('+bw.b+' kb/s)</td</tr></table>');
                                                                                                        $("#dos").on("click", function()
                                                                                                                                {
                                                                                                                                    if (available.os == 0)
                                                                                                                                    {
                                                                                                                                        available.os = 1;
                                                                                                                                        $("#inf").html("<div class=\"container alert alert-info\">L'os finger printing est lancée. Cette action peut prendre un certain temps</div>")
                                                                                                                                        $("#os").html();
                                                                                                                                        $.ajax({
                                                                                                                                               type: 'post',
                                                                                                                                               headers:
                                                                                                                                                {
                                                                                                                                                    "X-CSRFToken": csrftoken
                                                                                                                                                },
                                                                                                                                                data:
                                                                                                                                                {
                                                                                                                                                   ip:$("#aip").html()
                                                                                                                                                },
                                                                                                                                               url: '/os/',
                                                                                                                                               success:function(data)
                                                                                                                                                       {
                                                                                                                                                           d = JSON.parse(data)
                                                                                                                                                           $("#os").html(d.rep);
                                                                                                                                                           available.os = 0;
                                                                                                                                                           if(d.success = 1)
                                                                                                                                                               $("#inf").html("<div class=\"container alert alert-info\"><button type=\"button\" class=\"close\" data-dismiss=\"alert\">&times;</button>La fonctionnalité d'os finger printing est à nouveau disponible</div>")
                                                                                                                                                           else
                                                                                                                                                               $("#inf").html("<div class=\"container alert alert-warning\"><button type=\"button\" class=\"close\" data-dismiss=\"alert\">&times;</button>Un problème est survenu ... <br />Mais la fonctionnalité d'os finger printing est à nouveau disponible</div>")
                                                                                                                                                       },
                                                                                                                                               error: function()
                                                                                                                                                       {
                                                                                                                                                           alert('La requête n\'a pas abouti');
                                                                                                                                                           available.os = 0;
                                                                                                                                                       }
                                                                                                                                           })
                                                                                                                                    }
                                                                                                                                    else
                                                                                                                                    {
                                                                                                                                        $("#inf").html("<div class=\"container alert alert-error\"><button type=\"button\" class=\"close\" data-dismiss=\"alert\">&times;</button>La fonctionnalité d'os finger printing n'est pas encore disponible</div>")
                                                                                                                                    }
                                                                                                                                });
                                                                                                    }).drag(function(){return(false);});

                                    };

                        /**
                         * @author Damien Goldenberg
                         * @name GetX
                         * @brief This is a getter
                         * @returns {number}
                         */

                        this.GetX = function()
                                    {
                                        return(x+coeff.x);
                                    };

                        /**
                         * @author Damien Goldenberg
                         * @name GetY
                         * @brief This is a getter
                         * @returns {number}
                         */

                        this.GetY = function()
                                        {
                                            return(y+coeff.y);
                                        };

                        /**
                         * @author Damien Goldenberg
                         * @name GetIp
                         * @brief This is a getter
                         * @returns {*}
                         */

                        this.GetIp = function()
                                        {
                                            return(ip);
                                        };

                        /**
                         * @author Damien Goldenberg
                         * @name GetBw
                         * @brief This is a getter
                         * @returns {{p: *, b: *}}
                         */

                        this.GetBw = function()
                                        {
                                            return(bw);
                                        };

                        /**
                         * @author Damien Goldenberg
                         * @name GetBw
                         * @brief This is a getter
                         * @returns {{p: *, b: *}}
                         */

                        this.GetHostname = function()
                                        {
                                            return(hostname);
                                        };

                        /**
                         * @author Damien Goldenberg
                         * @name SetBw
                         * @brief This is a setter
                         * @param percent
                         * @param mega
                         */

                        this.SetBw = function(percent, mega)
                                        {
                                            /*if((parseFloat(percent) && percent > 0.0) && (parseFloat(mega) && mega > 0.0))
                                            {*/
                                                bw.percent = percent;
                                                bw.mega = mega;
                                               /* return 0
                                            }
                                            else
                                                return 1*/
                                        };

                        /**
                         * @author Damien Goldenberg
                         * @name SetMac
                         * @brief This is a setter
                         * @param amac
                         */

                        this.SetMac = function(amac)
                                        {
                                            mac = amac;
                                        };
                    }

                    /**
                     * @author Damien Goldenberg
                     * @name Map
                     * @brief This is the generator map
                     * @param obj
                     */

                    function Map(obj)
                    {
                        console.log(param.GetGapX());
                        console.log(param.GetGapY());
                        var coef = 60;
                        var center = {x: ($("#main").width()/2)-coef, y:($("#main").height()/2)-coef};
                        var radius = 500+obj.net.length+500*0.25;
                        var x = center.x;
                        var y = center.y;
                        var angleRad;
                        var angle = 0;
                        var dist = (360/obj.net.length)+0.5; // coef d'espacement
                        objnet = [];
                        objnet[0] = new Device(obj.gw, "8c:89:a5:a3:ad:1f", "Linux", "router", 'Itinet', 0, 0, n, x/param.GetScaleConnector(), y/param.GetScaleConnector(), {"x":0.6+param.GetScaleDevice(), "y":0.6+param.GetScaleDevice()});
                        var router = {x:objnet[0].GetX(), y:objnet[0].GetY()};
                        var lst = "<table class=\"table table-striped\"><tr><td>Hostname</td><td>IP</td></tr>";
                        for(var i = 0; i < obj.net.length; i++)
                        {
                            if(objnet[0].GetIp() == obj.net[i].ip)
                            {
                                objnet[0].SetMac(obj.net[i].mac);
                                objnet[0].SetBw(obj.net[i].percent, obj.net[i].bw*8);
                            }
                            else
                            {
                                angleRad = angle/180*Math.PI;
                                color = obj.net[i].percent == null ? "rgb(0, 0, 255)" : obj.net[i].percent < 1 ? "rgb(0, 252, 0)" : obj.net[i].percent < 2 ? "rgb(36, 216, 0)" : obj.net[i].percent < 5 ? "rgb(72, 180, 0)" : obj.net[i].percent < 10 ? "rgb(108, 144, 0)" : obj.net[i].percent < 20 ? "rgb(144, 108, 0)" : obj.net[i].percent < 50 ? "rgb(180, 72, 0)" : obj.net[i].percent < 70 ? "rgb(216, 36, 0)" : "rgb(252, 0, 0)";
                                x=(((radius/2)+(radius/2)*Math.cos(angleRad))+center.x - radius +340)/param.GetScaleConnector();
                                y=(((radius/2)+(radius/2)*Math.sin(angleRad))+center.y - radius +340)/param.GetScaleConnector();
                                objnet[i+1] = new Device(obj.net[i].ip, obj.net[i].mac, obj.net[i].os, obj.net[i].device, obj.net[i].hostname, obj.net[i].bw*8, obj.net[i].percent, n, x, y, {"x":0.4+param.GetScaleDevice(), "y":0.4+param.GetScaleDevice()});
                                objnet[i+1].Draw();
                                c.path("M"+objnet[i+1].GetX()+" "+objnet[i+1].GetY()+"L"+router.x+" "+router.y).attr({"stroke": color, "stroke-width":5});
                                angle += dist;
                                lst += "<tr data-x='"+(parseFloat(x)+param.GetGapX())+"' data-y='"+(parseFloat(y)+param.GetGapY())+"'><td class=\"shostname\">"+obj.net[i].hostname+"</td><td class=\"sip\">"+obj.net[i].ip+"</td></tr>";
                            }
                        }
                        objnet[0].Draw();
                        lst += "</table>";
                        $("#search").html(lst);
                        $(".shostname, .sip").on("click", function(event)
                                                            {
                                                                $('circle').remove();
                                                                var anim = Raphael.animation({"20%": {r: 20, easing:"bounce"}, "40%": {r: 40, easing: "bounce"}, "60%": {r: 20, easing: "bounce"}, "80%": {r: 40, easing: "bounce"}, "100%": {r: 30, easing:"bounce"}}, 5000);
                                                                t.circle(parseFloat(event.target.parentNode.getAttribute("data-x"))+50, parseFloat(event.target.parentNode.getAttribute("data-y"))+50, 30).attr({"fill":"#FF0000"}).animate(anim);
                                                            });
                    }

                    function LoadJson(data, getValue)
                    {
                        $.ajax({
                                            type: 'post',
                                            headers:
                                            {
                                                "X-CSRFToken": csrftoken
                                            },
                                            data:data,
                                            url: '/screenshot/',
                                            success:function(data)
                                                    {
                                                        getValue(JSON.parse(data));
                                                        ReMake(JSON.parse(data));
                                                    },
                                            error: function()
                                                    {
                                                        alert('La requête n\'a pas abouti');
                                                    }
                                           });
                    }

                    function ReMake(obj)
                    {
                        $('path').remove();
                        $('image').remove();
                        $('circle').remove();
                        Map(obj);
                    }

                    function Param()
                    {
                        var gap = {x:0, y:0}; // object to know the gap of all items
                        var mouse = {x:0, y:0}; // object to know the currently position ofthe mouse for events mousedown and mouseup
                        var scale = {device:0, connector:1}; //object for scaling all items
                        var move = 17;
                        var zdevice = 0.1;
                        var zconnector = 0.25;

                        this.Init = function()
                                    {

                                    };

                        this.Reset = function()
                                    {
                                        gap.x = 0;
                                        gap.y = 0;
                                        scale.device = 0;
                                        scale.connector = 1;
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

                        this.GetMouseX = function()
                                        {
                                            return(mouse.x);
                                        };

                        this.GetMouseY = function()
                                        {
                                            return(mouse.y);
                                        };

                        this.SetMouseX = function(v)
                                        {
                                            mouse.x = v
                                        };

                        this.SetMouseY = function(v)
                                        {
                                            mouse.y = v
                                        };

                        this.GetMove = function()
                                        {
                                            return(move);
                                        };

                        this.SetMove = function(v)
                                        {
                                            move = v;
                                        };

                        this.GetScaleDevice = function()
                                        {
                                            return(scale.device);
                                        };

                        this.GetScaleConnector = function()
                                        {
                                            return(scale.connector);
                                        };

                        this.SetScaleDevice = function(s)
                                        {
                                            s == 0 ? scale.device -= zdevice : scale.device += zdevice;
                                        };

                        this.SetScaleConnector = function(s)
                                        {
                                             s == 0 ? scale.connector -= zconnector : scale.connector += zconnector;
                                        };
                    }

                    $("#dellmap").on("click", function(event)
                                                {
                                                    var n = $("#name").val();
                                                    $.ajax({
                                                            type: 'post',
                                                            headers:
                                                            {
                                                                "X-CSRFToken": csrftoken
                                                            },
                                                            data:{name:n},
                                                            url: '/delete/',
                                                            success:function(data)
                                                                    {
                                                                        $("#inf").html("<div class=\"container alert alert-info\"><button type=\"button\" class=\"close\" data-dismiss=\"alert\">&times;</button>La carte "+n+" a bien été effacé.<br />La page va être rechargée dans 2 secondes</div>");
                                                                        window.setTimeout(function()
                                                                                            {
                                                                                                $("#inf").html("<div class=\"container alert alert-info\"><button type=\"button\" class=\"close\" data-dismiss=\"alert\">&times;</button>La page est sur le point de se rafraichir</div>");
                                                                                                window.location.href="/visu/";
                                                                                            }, 2000);
                                                                    },
                                                            error: function()
                                                                    {
                                                                        alert('La requête n\'a pas abouti');
                                                                    }
                                                           });
                                                });

                    $('#form0').on("submit", function(event)
                                                {
                                                    event.preventDefault();
                                                    LoadJson($(this).serialize(), function(network)
                                                            {
                                                                var pbw = 0;
                                                                var tbw = 0;
                                                                for(var w = 0; w < network.net.length; w++)
                                                                {
                                                                    if (network.net[w].bw != null && network.net[w].percent != null)
                                                                    {
                                                                        tbw += network.net[w].bw*8;
                                                                        pbw += network.net[w].percent;
                                                                    }
                                                                }
                                                                color = pbw < 25 ? "green" : pbw < 50 ? "yellow" : pbw < 75 ? "orange" : "red";
                                                                $("#cbw").css({"width":pbw*3.5, "background-color":color});
                                                                $("#binfo").html("<span class='label'>Bande passante totale utilisée : </span><ul><li class='offset1'>"+pbw.toFixed(2)+" %</li><li class='offset1'>"+tbw.toFixed(2)+" kb/s</li></ul>");

                                                                function handle(delta)
                                                                {
                                                                    if (delta > 0)
                                                                    {
                                                                        if(param.GetScaleDevice() > -0.19 && param.GetScaleConnector() > 0.49)
                                                                        {
                                                                            param.SetScaleDevice(0);
                                                                            param.SetScaleConnector(0);
                                                                            ReMake(network);
                                                                        }
                                                                    }
                                                                    else
                                                                    {
                                                                        if(param.GetScaleDevice() < 0.3 && param.GetScaleConnector() < 1.525)
                                                                        {
                                                                            param.SetScaleDevice(1);
                                                                            param.SetScaleConnector(1);
                                                                            ReMake(network);
                                                                        }
                                                                    }
                                                                }

                                                                $('svg').mousewheel(function(event, delta, deltaX, deltaY)
                                                                                    {
                                                                                        event.preventDefault();
                                                                                        handle(delta);
                                                                                        return false;
                                                                                    });

                                                                $('svg').on("mousedown", function(event)
                                                                                        {
                                                                                            event.preventDefault();
                                                                                            param.SetMouseX(event.clientX);
                                                                                            param.SetMouseY(event.clientY);
                                                                                            return false;
                                                                                        });
                                                                $('svg').on("mouseup", function(event)
                                                                                        {
                                                                                            event.preventDefault();
                                                                                            param.UpdateGap({x:(param.GetMouseX() - event.clientX), y:(param.GetMouseY() - event.clientY)});
                                                                                            ReMake(network);
                                                                                            return false;
                                                                                        });

                                                                $(window).on("keydown", function(event)
                                                                                            {
                                                                                                //console.log(event.keyCode);
                                                                                                //konami code !!! x)
                                                                                                kkeys.push( event.keyCode );
                                                                                                if (kkeys.toString().indexOf("38,38,40,40,37,39,37,39,66,65") >= 0)
                                                                                                {
                                                                                                    $("body").css({"background-image":"url('/public/img/konami.gif')"});
                                                                                                    $("#svgDevice").addClass("koko");
                                                                                                    $("#svgBw").addClass("koko2");
                                                                                                }
                                                                                                if(event.keyCode > 36 && event.keyCode < 41 || event.keyCode == 107 || event.keyCode == 109)
                                                                                                {
                                                                                                    event.preventDefault();
                                                                                                    event.keyCode == 38 ? param.SetGapY(0) : event.keyCode == 39 ? param.SetGapX(0) : event.keyCode == 40 ? param.SetGapY(1) : event.keyCode == 37 ? param.SetGapX(1) : event.keyCode == 109  ? handle(-1) : event.keyCode == 107 ? handle(1) : {};
                                                                                                    ReMake(network);
                                                                                                    return false;
                                                                                                }
                                                                                            });
                                                                $(".mapcontroll, #reset").on("click", function(event)
                                                                                                        {
                                                                                                            if(/mapcontroll/.test(event.target.className))
                                                                                                            {
                                                                                                                event.target.id == "m0" ? param.SetGapY(1) : event.target.id == "m1" ? param.SetGapX(1) : event.target.id == "m2" ? param.SetGapX(0) : event.target.id == "m3" ? param.SetGapY(0) : event.target.id == "m4" ? handle(1) : event.target.id == "m5" ? handle(-1) : {};
                                                                                                                if (event.target.id != "m4" || event.target.id != "m5")
                                                                                                                    ReMake(network);
                                                                                                            }
                                                                                                            else if(event.target.id == "reset")
                                                                                                            {
                                                                                                                param.Reset();
                                                                                                                ReMake(network);
                                                                                                            }
                                                                                                        });
                                                            })
                                                });
                })());

