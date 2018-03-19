/**
 * iadmin v1.0
 * 框架页面初始化方法
 */

//手机设备判断
if(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
	$(".i-tab>.layui-nav, .i-tab>.i-tab-title").hide();
	$(".i-tab>.layui-card-header").show();
}

layui.use(["layer", "element", "form"], function() {
	var layer = layui.layer,
		form = layui.form;
	loading(); //加载loading
	const logoText = $(".i-max-logo").html(),
		logoIcon = $(".i-min-logo").html();
	//iframe 自适应
	$(".i-iframe").height($(window).height() - 92);
	setMenuWidth(); //处理menu宽度
	$(window).resize(function() {
		$(".i-iframe").height($(window).height() - 92);
		//处理tab滚动
		if($("[i-attr=navTab]>ul").outerWidth(true) < $("[i-attr=navTab]").width()) {
			$("[i-attr=navTab] ul").css("left", 0); //将tab滚动重置为0
			$("[i-filter=navTab]").removeClass("i-on"); //tab删除on（隐藏tab左右按钮）
		} else {
			$("[i-filter=navTab]").addClass("i-on"); //tab添加on（显示tab左右按钮）
		}
		setMenuWidth(); //处理menu宽度
	});

	//菜单遮罩层点击
	$(".i-mask").click(function() {
		$("#scaling").children().attr("class", "fa fa-caret-square-o-right"); //更换缩进按钮图标
		if($(window).width() <= 768) {
			$(".iadmin").toggleClass("i-on-sm");
		}
		$(".iadmin").addClass("i-on"); //添加类名，使其缩进
	});

	//系统设置按钮
	$("[i-attr=btnSystemSet]").click(function() {
		$('[i-attr=systemSet]').css("right", 0).before('<div class="i-body-mask"></div>');
	});
	$("body").on("click", ".i-body-mask", function() {
		$(this).remove();
		$('[i-attr=systemSet]').css("right", '-300px');
	});

	//about提示
	$("body").on("mouseenter mouseleave", "[i-attr=about]", function(e) {
		var thisElem = $(this),
			e = e || window.event,
			eventType = e.type;
		//鼠标为移入事件，创建tips菜单提示
		if(eventType == "mouseenter") {
			aboutTipsIndex = layer.tips(thisElem.attr("i-title"), thisElem, {
				time: 20000
			});
		}
		//鼠标为移出事件，关闭tips菜单提示
		if(eventType == "mouseleave") {
			layer.close(aboutTipsIndex);
		}
	});

	//处理menu宽度
	function setMenuWidth() {
		if($(window).width() <= 768) {
			$("#scaling").children().attr("class", "fa fa-caret-square-o-right"); //更换缩进按钮图标
			$(".i-max-logo").html(logoIcon); //修改Logo内容
			$(".i-menu-nav").find("dl").slideUp(160).siblings("a").removeClass("i-on"); //关闭子菜单
			$(".iadmin").removeClass('i-on-sm').addClass("i-on"); //添加类名，使其缩进
		} else {
			$("#scaling").children().attr("class", "fa fa-caret-square-o-left"); //更换缩进按钮图标
			$(".i-max-logo").html(logoText); //修改Logo内容
			$(".iadmin").removeClass("i-on").removeClass('i-on-sm'); //添加类名，使其缩进
		}
	}

	//左侧菜单缩进点击事件
	$("#scaling").click(function() {
		var elem = $(this).children();
		if($(".iadmin").hasClass("i-on")) { // 放大
			elem.attr("class", "fa fa-caret-square-o-left"); //更换缩进按钮图标
			$(".i-max-logo").html(logoText); //修改Logo内容
			if($("[i-attr=navTab]>ul").outerWidth(true) > $("[i-attr=navTab]").width() - 150) {
				$("[i-filter=navTab]").addClass("i-on"); //tab增加on（显示tab左右按钮）
			}
		} else { // 缩小
			elem.attr("class", "fa fa-caret-square-o-right"); //更换缩进按钮图标
			$(".i-max-logo").html(logoIcon); //修改Logo内容
			$(".i-menu-nav").find("dl").slideUp(160).siblings("a").removeClass("i-on"); //关闭子菜单
			if($("[i-attr=navTab]>ul").outerWidth(true) < $("[i-attr=navTab]").width() + 150) {
				//+150目的是menu的放大宽度是210缩小宽度是60
				$("[i-attr=navTab] ul").css("left", 0); //将tab滚动重置为0
				$("[i-filter=navTab]").removeClass("i-on"); //tab删除on（隐藏tab左右按钮）
			}
		}
		if($(window).width() <= 768) {
			$(".iadmin").toggleClass("i-on-sm");
		}
		$(".iadmin").toggleClass("i-on"); //添加类名，使其缩进
	});

	//菜单缩小鼠标移动提示
	$(".i-menu-nav").on("mouseenter mouseleave", "ul>li", function(e) {
		var hsaClass = $(".iadmin").hasClass("i-on"),
			thisElem = $(this),
			e = e || window.event,
			eventType = e.type;
		//判断是否为菜单缩小状态且鼠标为移入事件，创建tips菜单提示
		if(hsaClass && eventType == "mouseenter") {
			menuTipsIndex = layer.tips(thisElem.find("span").text(), thisElem, {
				time: 5000
			});
		}
		//判断是否为菜单缩小状态且鼠标为移出事件，关闭tips菜单提示
		if(hsaClass && eventType == "mouseleave") {
			layer.close(menuTipsIndex);
		}
	});

	//一级菜单点击事件
	$(".i-menu-nav").on("click", "ul>li>a", function() {
		var thisElem = $(this),
			hsaClass = $(".iadmin").hasClass("i-on"),
			ifIcon = thisElem.find("i").hasClass("i-icon-right"),
			elemId = thisElem.parent().data("id");

		if(!ifIcon) { //判断是否有二级菜单
			//添加面包屑导航
			$(".i-tab .layui-breadcrumb *").remove();
			$(".i-tab .layui-breadcrumb").append("<a href=\"javascript:changeTabs('navTab', 'one_-1');\" >主页</a><span lay-separator>/</span><a><cite>" + thisElem.text() + "</cite></a>");
			openIframe(thisElem); // 打开菜单页面
			thisElem.toggleClass("i-on").siblings("dl").slideToggle(160).parent().siblings("li").find("dl").slideUp(160).siblings("a").removeClass("i-on");
		} else {
			if(hsaClass) { // 判断当前是否为缩小状态
				layer.close(menuTipsIndex); //关闭菜单上的tips提示
				$(".iadmin").removeClass("i-on"); //删除i-on，菜单放开
				$(".i-max-logo").html(logoText); //修改Logo内容
				thisElem.addClass("i-on").siblings("dl").fadeIn(160); //打开子菜单
				$("#scaling").children().attr("class", "fa fa-caret-square-o-left"); //更换缩进按钮图标
			} else {
				thisElem.toggleClass("i-on").siblings("dl").slideToggle(160).parent().siblings("li").find("dl").slideUp(160).siblings("a").removeClass("i-on");
			}
		}

	});

	//二级菜单点击事件
	$(".i-menu-nav").on("click", "ul>li>dl>dd>a", function() {
		//添加点击状态
		$(this).addClass("i-on").parent().siblings().find("a").removeClass("i-on").parents(".i-menu-nav>ul>li").siblings().find("dl>dd>a").removeClass("i-on");
		//添加面包屑导航
		$(".i-tab .layui-breadcrumb *").remove();
		$(".i-tab .layui-breadcrumb").append("<a href=\"javascript:changeTabs('navTab', 'one_-1');\">主页</a><span lay-separator>/</span><a><cite>" + $(this).parent().parent().siblings("a").text() + "</cite></a><span lay-separator>/</span><a><cite>" + $(this).text() + "</cite></a>");
		openIframe($(this)); // 打开菜单页面
	});

	//打开菜单页面（用于一级二级菜单打开tab）
	function openIframe(elem) {
		var title = elem.text(),
			url = elem.data("url"),
			tabId = elem.data("id"),
			flag = false;

		if(url == "") {
			layer.msg("此菜单未配置url属性，无法打开")
			return false;
		}
		//判断是否存在
		$("[i-attr=navTab]").find("li").each(function() {
			var thisId = $(this).attr("lay-id");
			if(tabId == thisId) {
				flag = true;
				return false;
			}
		});

		//创建tab
		if(!flag) {
			//创建tab
			addTabs('navTab', {
				title: title,
				content: '<iframe class="i-iframe" src=' + url + ' width="100%" height=' + ($(window).height() - 92) + '>',
				id: tabId
			});
			loading(); //加载loading
		}

		//打开当前tab
		changeTabs('navTab', tabId);
		//打开当前Tab时，判断当前tab选择是否位于滚动导航可视区域外
		var tabContainer = $("[i-attr=navTab]"), //tab最外侧容器
			tabSubElem = tabContainer.find("ul"), //滑动容器
			thisTab = tabContainer.find("li[lay-id=" + tabId + "]"); //当前打开的tab

		var thisTabLeft = Number(thisTab.position().left), //当前tab的Left值
			tabSubElemLeft = Number(tabSubElem.position().left), //滑动容器的left值（ul）
			thisElemAllWidth = Number(thisTab.outerWidth(true)), //当前tab的宽度
			tabContainerWidth = Number(tabContainer.width()); //tab最外侧容器的宽度

		if(thisTabLeft >= tabContainerWidth - thisElemAllWidth - tabSubElemLeft - 60) {
			//-60目的为了提前增加tab左右按钮
			$("[i-filter=navTab]").addClass("i-on"); //tab添加on（显示tab左右按钮）
			//在可视区域右侧
			if(thisTabLeft >= tabContainerWidth - thisElemAllWidth - tabSubElemLeft) {
				tabSubElem.css("left", tabContainerWidth - thisTabLeft - thisElemAllWidth);
			}
		}

		//在可视区域左侧
		if(thisTabLeft < -tabSubElemLeft) {
			tabSubElem.css("left", -thisTabLeft);
		}
	}

	//tab切换，定位当前菜单
	$("[i-attr=navTab]").on("click", "li", function() {
		var tabId = $(this).attr("lay-id");
		if(tabId != undefined) {
			$(this).addClass("layui-this").siblings().removeClass("layui-this");
			$("[i-attr='navTabContent'] .i-tab-item[lay-id=" + tabId + "]").addClass("layui-show").siblings().removeClass("layui-show");

			//状态处理 判断是一级导航还是二级 一级导航ID以one_开头，二级导航IDtwo_开头
			if(tabId.substring(0, 3) == "one") {
				$("a[data-id=" + tabId + "]").parent().siblings("li").find("dl").slideUp(160).siblings("a").removeClass("i-on");
			} else if(tabId.substring(0, 3) == "two") {
				$("a[data-id=" + tabId + "]").parent().parent().slideDown(160).siblings("a").addClass("i-on")
					.parent().siblings("li").find("dl").slideUp(160).siblings("a").removeClass("i-on")
					.siblings("dl").find("dd>a").removeClass("i-on")
					.parents(".i-menu-nav").find("dd>a").removeClass("i-on");
			}
			$("a[data-id=" + tabId + "]").addClass("i-on");
		}
	});

	//tab上的关闭功能
	$('[i-attr="navTab"]').on("click", "ul>li>a>.i-tab-close", function() {
		deleteTabs("navTab", $(this).parent().parent().attr("lay-id"));
	});

	//tab滑动
	$("[i-attr=navTab]").mousewheel(function(event, data) {
		var dir = data > 0 ? 'Up' : 'Down',
			elem = $(this),
			subElem = elem.children("ul"),
			subElemLeft = Number(subElem.position().left),
			subElemW = Number(subElem.width()),
			elemW = Number(elem.width());
		if(subElemW < elemW) {
			subElem.css('left', 0); //设置为0
			$("[i-filter=navTab]").removeClass("i-on"); //去掉on（隐藏tab左右按钮）
			return false; //长度没达到可滑动的长度，阻止滑动
		}
		if(dir == 'Up') {
			if(-subElemLeft < 120) {
				subElem.css('left', 0); //左侧剩余长度不足120，设为0
			} else {
				subElem.css('left', subElemLeft + 120); //每次增加120px
			}
		} else {
			if((subElemW - elemW + subElemLeft) < 120) {
				subElem.css('left', elemW - subElemW); //右侧长度不足120，设为多出去的总长度
			} else {
				subElem.css('left', subElemLeft - 120); //每次减少120px
			}
		}

	});

	//tab左侧换页按钮
	$("[i-attr=tabLeft]").click(function() {
		var elem = $("[i-attr=navTab]"),
			elemWidth = elem.width(),
			elemSub = elem.find("ul"),
			elemSubLeft = elemSub.position().left,
			elemSubWidth = elemSub.outerWidth(true),
			nextScreen = elemSubLeft + elemWidth;
		if(elemSubWidth < elemWidth) {
			elemSub.css('left', 0); //设置为0
			$("[i-filter=navTab]").removeClass("i-on"); //去掉on（隐藏tab左右按钮）
			return false;
		}
		if(elemSubLeft == 0) {
			layer.msg("到头了");
			return false;
		}
		//判断后面的元素是否还够下一屏
		if(nextScreen > 0) {
			nextScreen = 0;
		}
		elemSub.css("left", nextScreen);
	});

	//tab右侧换页按钮
	$("[i-attr=tabRight]").click(function() {
		var elem = $("[i-attr=navTab]"),
			elemWidth = elem.width(),
			elemSub = elem.find("ul"),
			elemSubLeft = elemSub.position().left,
			elemSubWidth = elemSub.outerWidth(true),
			nextScreen = elemSubLeft - elemWidth;

		if(elemSubWidth < elemWidth) {
			elemSub.css('left', 0); //设置为0
			$("[i-filter=navTab]").removeClass("i-on"); //去掉on（隐藏tab左右按钮）
			return false;
		}
		if(parseInt(elemWidth - elemSubWidth) == parseInt(elemSubLeft)) {
			layer.msg("到头了");
			return false;
		}
		//判断后面的元素是否还够下一屏
		if(nextScreen < elemWidth - elemSubWidth) {
			nextScreen = elemWidth - elemSubWidth;
		}
		elemSub.css("left", nextScreen);
	});

	//点击系统首页，关闭右侧所有菜单
	$("[i-attr=i-home]").click(function() {
		$(".i-menu-nav").find("dl").slideUp(160).siblings("a").removeClass("i-on");
	});

	//全屏切换
	$("[i-attr=fullScreen]").click(function() {
		var elem = $(this).children();
		if(elem.hasClass("fa-expand")) {
			fullScreen(); //全屏
			elem.attr("class", "fa fa-compress");
		} else {
			exitFullScreen(); //退出全屏
			elem.attr("class", "fa fa-expand");
		}
	});

	//刷新
	$("[i-attr=repeat]").click(function() {
		$("[i-attr=navTabContent] .i-tab-item").each(function() {
			if($(this).hasClass("layui-show")) {
				var iframe = $(this).find("iframe");
				iframe.attr('src', iframe.attr('src'));
				loading(); //加载loading
				return false;
			}
		});
	});
	//tab关闭当前
	$("[i-attr=closeThis]").click(function() {
		$("[i-attr=navTab] li").each(function() {
			var thisElem = $(this);
			if(thisElem.hasClass("layui-this")) {
				if(thisElem.attr("i-attr") == "i-home") {
					layer.msg("系统首页不能关闭", {
						time: 1000
					});
					return false;
				} else {
					deleteTabs("navTab", thisElem.attr("lay-id"));
				}
			}
		});
	});

	//tab关闭其他
	$("[i-attr=closeOther]").click(function() {
		var num = 1;
		if($("[i-attr=navTab] li.layui-this").index() > 0) {
			num = 2;
		}
		if($("[i-attr=navTab] li").length <= num) {
			layer.msg("没有可关闭的了", {
				time: 1000
			});
			return false;
		}
		$("[i-attr=navTab] li").each(function() {
			var thisElem = $(this);
			if(!thisElem.hasClass("layui-this")) {
				var id = thisElem.attr("lay-id")
				if(id != -1) {
					deleteTabs("navTab", id);
				}

			}
		});
		$("[i-attr=navTab] ul").css("left", 0); //将tab滚动重置为0
		$("[i-filter=navTab]").removeClass("i-on"); //去掉on（隐藏tab左右按钮）
	});

	//tab关闭全部
	$("[i-attr=closeAll]").click(function() {
		if($("[i-attr=navTab] li").length <= 1) {
			layer.msg("没有可关闭的了", {
				time: 1000
			});
			return false;
		}
		$("[i-attr=navTab] li").each(function() {
			var id = $(this).attr("lay-id")
			if(id != "one_-1") {
				deleteTabs("navTab", id);
			}
		});
		$("[i-attr=navTab] ul").css("left", 0); //将tab滚动重置为0
		$("[i-filter=navTab]").removeClass("i-on"); //去掉on（隐藏tab左右按钮）
	});

	//全屏
	function fullScreen() {
		var el = document.documentElement;
		var rfs = el.requestFullScreen || el.webkitRequestFullScreen || el.mozRequestFullScreen || el.msRequestFullScreen,
			wscript;

		if(typeof rfs != "undefined" && rfs) {
			rfs.call(el);
			return;
		}
		if(typeof window.ActiveXObject != "undefined") {
			wscript = new ActiveXObject("WScript.Shell");
			if(wscript) {
				wscript.SendKeys("{F11}");
			}
		}
	}

	//退出全屏
	function exitFullScreen() {
		var el = document,
			cfs = el.cancelFullScreen || el.webkitCancelFullScreen || el.mozCancelFullScreen || el.exitFullScreen,
			wscript;

		if(typeof cfs != "undefined" && cfs) {
			cfs.call(el);
			return;
		}

		if(typeof window.ActiveXObject != "undefined") {
			wscript = new ActiveXObject("WScript.Shell");
			if(wscript != null) {
				wscript.SendKeys("{F11}");
			}
		}
	}

	$(".i-tab-title ul").sortable({
		axis: "x"
	});
	$(".i-menu-nav ul").sortable({
		axis: "y"
	});
	//本地存储系统设置开关数据
	form.on('switch(systemSet)', function(data) {
		store.set(data.value, data.elem.checked);
		dealwithSet(); //重新获取选择框状态设置功能
	});
	store.forEach(function(key, val) {
		$("input[name=systemSet][value=" + key + "]").attr("checked", val);
		form.render('checkbox');
	});
	dealwithSet(); //获取选择框状态设置功能
	//根据设定处理功能
	function dealwithSet() {
		for(var i = 0; i < $("[i-attr=systemSet] input").length; i++) {
			var isChecked = $("[i-attr=systemSet] input").eq(i).is(":checked");
			switch(i) {
				case 0:
					if(isChecked) {
						$(".i-menu-nav ul").sortable({
							disabled: false
						});
					} else {
						$(".i-menu-nav ul").sortable({
							disabled: true
						});
					}
					break;
				case 1:
					if(isChecked) {
						$(".i-tab-title ul").sortable({
							disabled: false
						});
					} else {
						$(".i-tab-title ul").sortable({
							disabled: true
						});
					}
					break;
				default:
					break;
			}
		}
	}
});

//添加navTab
function addTabs(elem, par) {
	if(par.id == null) {
		layer.msg("ID为必要参数，请赋值！");
		return false;
	}
	var e = $("[i-filter=" + elem + "]"),
		t = e.find(".i-tab-title ul"),
		c = e.find(".i-tab-content");
	var tabTitle =
		'<li class="layui-nav-item" lay-id=' + par.id + '><a href="javascript:;">' +
		par.title +
		'<i class="layui-icon layui-unselect i-tab-close">&#x1006;</i>' +
		'</a></li>';
	var tabContent = '<div class="i-tab-item" lay-id=' + par.id + '>' + par.content + '</div>'
	t.append(tabTitle);
	c.append(tabContent);
}

//删除navTab
function deleteTabs(elem, id) {
	var t = $("[i-filter=" + elem + "] .i-tab-title>ul>li[lay-id=" + id + "]"),
		c = $("[i-filter=" + elem + "]>.i-tab-content>.i-tab-item[lay-id=" + id + "]");
	if(t.hasClass("layui-this")) {
		t.prev().addClass("layui-this");
		c.prev().addClass("layui-show");
	}
	t.remove();
	c.remove();

}

//切换navTab
function changeTabs(elem, id) {
	$("[i-filter=" + elem + "] .i-tab-title>ul>li[lay-id=" + id + "]").addClass("layui-this").siblings().removeClass("layui-this");
	$("[i-filter=" + elem + "]>.i-tab-content>.i-tab-item[lay-id=" + id + "]").addClass("layui-show").siblings().removeClass("layui-show");
}

function loading() {
	var idx = layer.load(0, {
		skin: 'i-loading',
		shade: 0.1,
		content: '<div class="sk-wave"><div class="sk-rect sk-rect1"></div><div class="sk-rect sk-rect2"></div><div class="sk-rect sk-rect3"></div><div class="sk-rect sk-rect4"></div><div class="sk-rect sk-rect5"></div></div>'
	});
	$(".i-iframe").on("load", function() {
		layer.close(idx);
	});
	setTimeout(function() {
		layer.close(idx);
	}, 5000)
}