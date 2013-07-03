$(window).load((function()
                {
                    var id; //contains the id of the current click in the menu
                    var n = Raphael(document.getElementById('svgDevice'), 900, 600); // represents the device svg
                    var c = Raphael(document.getElementById('svgBw'), 900, 600); // represents the band-width svg
                    var t = Raphael(document.getElementById('svgSearch'), 900, 600); // represents the machine search
                    var csrftoken = GetCookie('csrftoken'); // this is the django secure token for ajx request
                    var objnet = []; // list of the device object in the part asynchronous
                    var available = {os:0, sniff:0}; // object to know if an app is up or not
                    var gap = {x:0, y:0}; // object to know the gap of all items
                    var mouse = {x:0, y:0, ok:0}; // object to know the currently position ofthe mouse for events mousedown and mouseup
                    var scale = {device:0, connector:1}; //object for scaling all items
                    var net; // idem objnet but in the part synchonous, maybe it's a little stupid, i don't test ^^
                    var move = 17;
                    $('#pop').resizable({animate: true}).draggable().tabs();
                    $('#form').resizable({animate: true}).draggable();
                    var kkeys = [];

                    /**
                     * @author Damien Goldenberg
                     * @brief This function get the cookie specified in the in the input variable
                     * @param name
                     * @returns {null}
                     * @constructor
                     */
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
                        var x = x + gap.x;
                        var y = y + gap.y;
                        var coeff = {x:55, y:50};
                        var dim = dim;
                        this.Draw = function()
                                    {
                                        context.image(img, x, y, 100, 100).scale(dim.x, dim.y).mouseover(function()
                                                                                                    {
                                                                                                        $("#d").html('<table><tr><td><label class="label">Hostname : </label></td><td>'+hostname+'</td></tr><tr><td><label class="label">IP : </label></td><td id="aip">'+ip+'</td></tr><tr><td><label class="label">MAC : </label></td></td><td>'+mac+'</td></tr><tr><td><label class="label">OS : </label></td></td><td><button id="dos" class="btn btn-inverse" type="button">Détection d\'OS</button></td></tr><tr><td><label class="label">Bande passante : </label></td></td><td> '+bw.p+'% ('+bw.b+' kb/s)</td</tr></table>');
                                                                                                    }).drag(function(){return(false);});

                                    };
                        this.GetX = function()
                                    {
                                        return(x+coeff.x);
                                    };

                        this.GetY = function()
                                        {
                                            return(y+coeff.y);
                                        };

                        this.GetIp = function()
                                        {
                                            return(ip);
                                        };

                        this.GetBw = function()
                                        {
                                            return(bw)
                                        };

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

                        this.SetMac = function(amac)
                                        {
                                            mac = amac;
                                        };
                    }

                    function Map(obj)
                    {
                        var coef = 60;
                        var center = {x: ($("#main").width()/2)-coef, y:($("#main").height()/2)-coef};
                        //var center = {x: ($("#main").width()/2), y:($("#main").height()/2)};
                        var radius = 500+obj.net.length+500*0.25;
                        //var center = {x: (radius/2)-coef, y:(radius/2)-coef};
                        var x = center.x;
                        var y = center.y;
                        var angleRad;
                        var angle = 0;
                        var dist = (360/obj.net.length)+0.5; // coef d'espacement
                        //objnet[0] = new Device(obj.gw, obj.mac, obj.os, obj.device, n, x, y);
                        objnet = [];
                        objnet[0] = new Device(obj.gw, "8c:89:a5:a3:ad:1f", "Linux", "router", 'Itinet', 0, 0, n, x/scale.connector, y/scale.connector, {"x":0.6+scale.device, "y":0.6+scale.device});
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
                                x=(((radius/2)+(radius/2)*Math.cos(angleRad))+center.x - radius +340)/scale.connector;
                                y=(((radius/2)+(radius/2)*Math.sin(angleRad))+center.y - radius +340)/scale.connector;
                                objnet[i+1] = new Device(obj.net[i].ip, obj.net[i].mac, obj.net[i].os, obj.net[i].device, obj.net[i].hostname, obj.net[i].bw*8, obj.net[i].percent, n, x, y, {"x":0.4+scale.device, "y":0.4+scale.device});
                                objnet[i+1].Draw();
                                c.path("M"+objnet[i+1].GetX()+" "+objnet[i+1].GetY()+"L"+router.x+" "+router.y).attr({"stroke": color, "stroke-width":5});
                                angle += dist;
                                lst += "<tr data-x='"+(parseFloat(x)+gap.x)+"' data-y='"+(parseFloat(y)+gap.y)+"'><td class=\"shostname\">"+obj.net[i].hostname+"</td><td class=\"sip\">"+obj.net[i].ip+"</td></tr>";
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
                                            timeout: 20000,
                                            success:function(data)
                                                    {
                                                        console.log(JSON.parse(data));
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
                        Map(obj);
                    }

                    $('#form0').on("submit", function(event)
                                                {
                                                    event.preventDefault();
                                                    LoadJson($(this).serialize(), function(network)
                                                            {
                                                                net = network;
                                                                var pbw = 0;
                                                                var tbw = 0;
                                                                for(var w = 0; w < network.net.length; w++)
                                                                {
                                                                    if (network.net[w].bw != null && network.net[w].percent != null)
                                                                    {
                                                                        tbw += network.net[w].bw*8;
                                                                        pbw += network.net[w].percent;
                                                                        console.log("obj "+network.net[w].percent);
                                                                        console.log("val "+pbw);
                                                                    }
                                                                }
                                                                color = pbw < 25 ? "green" : pbw < 50 ? "yellow" : pbw < 75 ? "orange" : "red";
                                                                $("#cbw").css({"width":pbw*3.5, "background-color":color});
                                                                $("#binfo").html("<span class='label'>Bande passante total utilisée : </span><ul><li class='offset1'>"+pbw.toFixed(2)+" %</li><li class='offset1'>"+tbw.toFixed(2)+" kb/s</li></ul>");
                                                                function handle(delta)
                                                                {
                                                                    console.log(scale);
                                                                    console.log(delta);
                                                                    if (delta > 0)
                                                                    {
                                                                        if(scale.device > -0.19 && scale.connector > 0.49)
                                                                        {
                                                                            scale.device -= 0.1;
                                                                            scale.connector -= 0.25;
                                                                            ReMake(network);
                                                                        }
                                                                    }
                                                                    else
                                                                    {
                                                                        if(scale.device < 0.3 && scale.connector < 1.525)
                                                                        {
                                                                            scale.device += 0.1;
                                                                            scale.connector += 0.25;
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
                                                                                            mouse.x = event.clientX;
                                                                                            mouse.y = event.clientY;
                                                                                            return false;
                                                                                        });
                                                                $('svg').on("mouseup", function(event)
                                                                                        {
                                                                                            event.preventDefault();
                                                                                            gap.x -= (mouse.x - event.clientX)*0.5;
                                                                                            gap.y -= (mouse.y - event.clientY)*0.5;
                                                                                            ReMake(network);
                                                                                            return false;
                                                                                        });

                                                                $(document).on("keydown", function(event)
                                                                                            {
                                                                                                console.log(event.keyCode);
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
                                                                                                    event.keyCode == 38 ? gap.y -= move : event.keyCode == 39 ? gap.x -= move : event.keyCode == 40 ? gap.y += move : event.keyCode == 37 ? gap.x += move : event.keyCode == 109  ? handle(-1) : event.keyCode == 107 ? handle(1) : gap.x += 0;
                                                                                                    ReMake(network);
                                                                                                    return false;
                                                                                                }
                                                                                            });
                                                                $(".mapcontroll, #reset").on("click", function(event)
                                                                                                                        {
                                                                                                                            if(/mapcontroll/.test(event.target.className))
                                                                                                                            {
                                                                                                                                event.target.id == "m0" ? gap.y -= move : event.target.id == "m1" ? gap.x += move : event.target.id == "m2" ? gap.x -= move : event.target.id == "m3" ? gap.y += move : event.target.id == "m4" ? handle(1) : event.target.id == "m5" ? handle(-1) :gap.x += 0;
                                                                                                                                if (event.target.id != "m4" || event.target.id != "m5")
                                                                                                                                    ReMake(network);
                                                                                                                            }
                                                                                                                            else if(event.target.id == "reset")
                                                                                                                            {
                                                                                                                                gap.x = 0;
                                                                                                                                gap.y = 0;
                                                                                                                                scale.device = 0;
                                                                                                                                scale.connector = 1;
                                                                                                                                ReMake(network);
                                                                                                                            }
                                                                                                                        });
                                                            })
                                                });
                })());

