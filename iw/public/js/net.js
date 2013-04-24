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

                    $("a.menu").on("click", function()
                                               {
                                                   var id = this.id
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
                                                           if (id == 0)
                                                           {
                                                               //$(".collapse").collapse({toggle:true});
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
                                                $('canvas').attr("width", $(window).width()*75/100);
                                            });
                    var csrftoken = GetCookie('csrftoken');
                    $('canvas').attr("width", $(window).width()*75/100);
                })());

