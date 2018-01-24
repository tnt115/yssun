var syllabus={
	
	dialog:function(){
		if(base.allotRoot()=="5"||base.allotRoot()=="7"){
			$(".header").css("display","none")
			$("#pullrefresh").css("top",".5rem")
		}else{
			$(".header").css("display", "block")
		}
		base.dataList();
		return false;
	},
	/*绑定当前页面所有的事件*/
	bindAll:function(){
			$(".btn").on("click",function(){
				if($(".Class_word").attr("data_uidgradeid")!=undefined){
					sessionStorage.setItem("uidClassId",$(".Class_word").attr("data_uidgradeid"))
					base.getParams(true);
				}
			})
			$(".header_right").click(function() {
			window.location.replace("editSylladbus.html");
			})
	},
	init:function(){
		base.verifyUser();
		this.bindAll();
		this.dialog();
	},
}
$(function(){
	syllabus.init();
})
