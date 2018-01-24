var syllabus={
	
	dialog:function(){
			document.getElementById("btn").addEventListener('tap', function() {
				mui.alert('修改成功!', function() {
					location.href="syllabus.html"
				});
			});	
			if(base.allotRoot()=="5"||base.allotRoot()=="7"){
				$(".header").css("display","none")
				$("#pullrefresh").css("top",".5rem")
			}else{
				$(".header").css("display","block")
			}
	},
	init:function(){
		this.dialog();
	},
}
$(function(){
	syllabus.init();
})
