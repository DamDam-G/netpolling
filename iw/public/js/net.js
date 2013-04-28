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
                                                                   $("#dispopt").html(data);
                                                                   $("#option").modal("show");
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
                                                $('canvas').attr("width", $(window).width()*0.75);
                                            });

                    var id;
                    var csrftoken = GetCookie('csrftoken');
                    $('canvas').attr("width", $(window).width()*0.75);
                })());

