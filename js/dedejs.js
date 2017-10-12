$(function(){
	var tophtml="<div id=\"izl_rmenu\" class=\"izl-rmenu\"><a title=\"免费预约\" alt=\"免费预约\" href=\"http://sz.58.com/zhuce/27901759832619x.shtml?psid=104406355197629591738089866&entinfo=27901759832619_0&iuType=p_1&PGTID=0d30007d-0000-4fe4-11f8-ffb569c0d821&ClickID=1\" target=\"_blank\"><div class=\"btn btn-phone2\"><div class=\"phone2\">137-237-99805</div></div></a><a target=\"_blank\" href=\"http://wpa.qq.com/msgrd?v=3&amp;uin=494394758&amp;site=qq&amp;menu=yes\" class=\"btn btn-qq\"></a><div class=\"btn btn-wx\"><img class=\"pic\" src=\"http://www.yssun.com/images/weixin.jpg\" onclick=\"window.location.href=\'javascript:void(0)\'\"/></div><div class=\"btn btn-phone\"><div class=\"phone\">137-237-99805</div></div><div class=\"btn btn-top\"></div></div>";
	$("#top").html(tophtml);
	$("#izl_rmenu").each(function(){
		$(this).find(".btn-wx").mouseenter(function(){
			$(this).find(".pic").fadeIn("fast");
		});
		$(this).find(".btn-wx").mouseleave(function(){
			$(this).find(".pic").fadeOut("fast");
		});
		$(this).find(".btn-phone").mouseenter(function(){
			$(this).find(".phone").fadeIn("fast");
		});
		$(this).find(".btn-phone").mouseleave(function(){
			$(this).find(".phone").fadeOut("fast");
		});
		$(this).find(".btn-top").click(function(){
			$("html, body").animate({
				"scroll-top":0
			},"fast");
		});
	});
	var lastRmenuStatus=false;
	$(window).scroll(function(){//bug
		var _top=$(window).scrollTop();
		if(_top>200){
			$("#izl_rmenu").data("expanded",true);
		}else{
			$("#izl_rmenu").data("expanded",false);
		}
		if($("#izl_rmenu").data("expanded")!=lastRmenuStatus){
			lastRmenuStatus=$("#izl_rmenu").data("expanded");
			if(lastRmenuStatus){
				$("#izl_rmenu .btn-top").slideDown();
			}else{
				$("#izl_rmenu .btn-top").slideUp();
			}
		}
	});
});