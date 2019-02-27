/*
	jQuery 鼠标提示插件 v2.0

	https://github.com/28269890/sMenus

	Demo：https://28269890.github.io/sMenus

*/
(function($){
	$.fn.sMenus = function(options) {
		var o = $.extend({}, $.fn.sMenus.defaults,options);

		if($("#_sMenus").size()==0){ //添加一个菜单
			$("body").append("<div id='_sMenus' class='"+o.css+"'></div>");
		}

		$("#_sMenus").on({ //移除菜单右键
			contextmenu:function(){
				return false;
			},
		})

		$(document).click(function(e){ //菜单外点击关闭菜单
			var target = $(e.target);
			if(target.closest("#_sMenus").length != 0){
				return true;
			}
			$("#_sMenus").fadeOut(o.outTime);
		})
		
		var makeMenu = function(d){ //生成菜单元素
			var div = $("<div>")//菜单元素
			
			if(d.text){ //菜单名称
				div.addClass("menu")
			}else{
				div.addClass("hr") //无效名称视为间隔线
				return div;
			}

			if(d.css){
				div.addClass(d.css)//添加独立的css样式
			}

			var span = $("<span>"+d.text+"</span>") //菜单点击元素
			
			if(d.close!=undefined){ //检查【是否关闭菜单】项是否设置
				span.data("close",d.close)//使用菜单项中的【是否关闭菜单】选项
			}else{
				span.data("close",o.close)//使用配置中的【是否关闭菜单】选项
			}

			if(typeof(d.fn)=="function"){//点击事件
				span.data("fn",d.fn)//保存点击事件配置
				span.click(function(){//点击事件
					$(this).data("fn")()//执行点击事件
					if($(this).data("close")){//检测【是否关闭菜单】
						$("#_sMenus").fadeOut(o.outTime);
					}
				})
			}

			div.append(span)//将点击元素放入菜单元素中

			if(Array.isArray(d.data)){//检测是否有子菜单
				if(d.data.length>0){
					var subDiv = $("<div class='"+o.css+"'>")
					for(var i in d.data){
						subDiv.append(makeMenu(d.data[i]))
					}
					div.append(subDiv)
					div.addClass("main")
				}
			}

			return div;//返回菜单元素
		}

		this.each(function(){//循环选择器选中的元素
			if(!Array.isArray($(this).data("sMenu"))){//如果菜单数据不为数组
				if($(this).attr("sMenu")){//元素中的菜单数据存在
					$(this).data("sMenu",eval($(this).attr("sMenu")))
				}else{
					$(this).data("sMenu",o.data)
				}
			}

			if(!Array.isArray($(this).data("sMenu"))){
				return false;
			}


			$(this).on({
				contextmenu:function(){//关闭元素右键默认菜单
					return false;
				},
				mouseup:function(e){//鼠标按键弹起
					if(3 != e.which){ //不是右键，结束功能
						return true;
					}
					
					$("#_sMenus").html("")//清空菜单

					var d = $(this).data("sMenu")
					var menuDiv = $("<div>")
					for(var i in d){
						menuDiv.append(makeMenu(d[i]))
					}
					$("#_sMenus").append(menuDiv.children())

					var x = e.pageX + 1
					var y = e.pageY + 1

					if(x + $("#_sMenus").outerWidth() >= document.body.clientWidth){ //菜单已横向超出边界
						x -= $("#_sMenus").outerWidth() ;//将菜单显示在鼠标左侧
					};

					if(y + $("#_sMenus").outerHeight() >= document.body.clientHeight){//菜单已超出纵向边界
						y -= $("#_sMenus").outerHeight() ;//将菜单显示在鼠标上方
					};

					if (x < 0){x=0}
					if (y < 0){y=0}

					$("#_sMenus").css({
						"left": x,
						"top": y
					});
					$("#_sMenus").fadeTo(o.inTime,o.phy);
				}			
			})

		});
	};

	//--这里的都是初始值，能够设定的内容也都在这里
	$.fn.sMenus.defaults = {
		data:[],
		phy:1, //透明度 0-1
		inTime:200,//淡入时间
		outTime:200,//淡出时间
		css:"sMenus",//指定css样式
		close:true,//点击菜单项目后是否关闭菜单
	};
})(jQuery);









