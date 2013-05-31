$(window).load((function()
                {
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

                    function WriteModal(idModal, idDisplay, data)
                    {
                        $(idDisplay).html(data);
                        $(idModal).modal("show");
                    }

                    function Form(e)
                    {
                        e.preventDefault();
                        $.ajax({
                            type: 'post',
                            headers:
                                {
                                  "X-CSRFToken": csrftoken
                                },
                                data:$(this).serialize(),
                                url: '/ajaxform/'+id+'/',
                                timeout: 3000,
                                success:function(data)
                                        {
                                            data = JSON.parse(data)
                                            if (data.success == 1)
                                                cls = 'success';
                                            else if (data.success == 0)
                                                cls = 'danger';
                                            $("#info").html('<div class="alert alert-' +cls+ '"><button type="button" class="close" data-dismiss="alert">×</button>' +data.why+ '</div>');
                                        },
                                error:function()
                                      {
                                            $("#info").html('<div class="alert alert-warning"><button type="button" class="close" data-dismiss="alert">×</button>La requête n\'a pas pu aboutir</div>');
                                      }
                                });
                    }

                    function Bw(obj)
                    {
                    }

                    function Device(img, context, x, y)
                    {
                        this.img = "/public/img/device/"+img+".svg";
                        this.context = context;
                        this.x = x;
                        this.y = y;
                        this.draw = function()
                                    {
                                        this.context.image(this.img, this.x, this.y, 100, 100).scale(0.5, 0.5).click(function()
                                                                                                                        {
                                                                                                                            var data = '<table><tr><td><label class="label">IP</label></td></tr><tr><td><label class="label">IP : </label></td><td>bla bla bla</td></tr><tr><td><label class="label">MAC : </label></td></td><td>bla bla bla</td></tr><tr><td><label class="label">OS : </label></td></td><td>bla bla bla</td></tr></table>';
                                                                                                                            WriteModal("#option", "#dispopt", data);
                                                                                                                        });
                                    }
                    }

                    function Map(obj)
                    {
                        var coef = 70;
                        var n = Raphael(document.getElementById('main'), 900, 600);
                        var center = {x: ($("#main").width()/2)-coef, y:($("#main").height()/2)-coef};
                        var radius = 300;
                        var pi = Math.PI
                        /*var x = center.x + radius;
                        var y = center.y - radius/2;*/
                        var x = center.x;
                        var y = center.y;
                        var angleRad;
                        var angle = 0;
                        var dist = 360/obj.net.length;
                        t = new Device("router", n, x, y);
                        t.draw();
                        for(var i = 0; i < obj.net.length; i++)
                        {
                            angleRad = angle/180*Math.PI
                            x=((radius/2)+(radius/2)*Math.cos(angleRad))+center.x - radius +130;
                            y=((radius/2)+(radius/2)*Math.sin(angleRad))+center.y - radius +130;
                            t = new Device("computer", n, x, y);
                            t.draw();
                            angle += dist;
                        }
                    }

                    function LoadJson(id)
                    {
                        var json = $.ajax({
                                            type: 'post',
                                            headers:
                                            {
                                                "X-CSRFToken": csrftoken
                                            },
                                            url: id == 0? '/getscan/' : '/getbw/',
                                            timeout: 3000,
                                            success:function(data)
                                                    {
                                                        if(id == 0)
                                                        {
                                                            Map(JSON.parse(data));
                                                        }
                                                        else
                                                        {
                                                            Bw(JSON.parse(data));
                                                        }
                                                    },
                                            error: function()
                                                    {
                                                        alert('La requête n\'a pas abouti');
                                                    }
                                           });
                        return json
                    }

                    $("a.menu").on("click", function()
                                               {
                                                   id = this.id
                                                   $.ajax({
                                                       type: 'post',
                                                       headers:
                                                        {
                                                            "X-CSRFToken": csrftoken
                                                        },
                                                       data:
                                                        {
                                                           id:this.id
                                                        },
                                                       url: '/control/',
                                                       timeout: 3000,
                                                       success:function(data)
                                                               {
                                                                   WriteModal("#option", "#dispopt", data);
                                                                   if (id == 0 || id == 1 || id == 2 || id == 4)
                                                                   {
                                                                       $("#form0").on("submit", Form);
                                                                       if(id == 0 || id== 4)
                                                                       {
                                                                           $("#form1").on("submit", Form);
                                                                       }
                                                                   }

                                                               },
                                                       error: function()
                                                               {
                                                                   alert('La requête n\'a pas abouti');
                                                               }
                                                   })
                                               });

                    $(window).on("resize", function()
                                            {
                                                //$('canvas').attr("width", $(window).width()*0.75);
                                            });
                    /*$("#cartoConnector").attr('position', 'relative')
                    $("#cartoConnector").attr('top', $("#cartoDevice").offset().top)
                    $("#cartoConnector").attr('left', $("#cartoDevice").offset().left)*/
                    var id;
                    var csrftoken = GetCookie('csrftoken');
                    var network = LoadJson(0);
                    //var bw = LoadJson(1);
                    //console.log("global = "+network)
                    //$('canvas').attr("width", $(window).width()*0.75);
                    $('svg').attr("style", "border:solid #000000 2px;");
                })());

