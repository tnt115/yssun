var backPassword={
	inputChange:function(){
		$("#moble").keyup(function(){
			$(this).val($(this).val().replace(/\D/gi,""))
			if($(this).val()!=""){
				$("#btnBack,#submit").css({"background-color":"#00ACFF","color":"#fff","border":"none"})
			}else{
				$("#submit").css({"background-color":"#F1F1F1","color":"#808080"})
				$("#btnBack").css({"background":"none","color":"#808080","border":"1px solid #ccc"})
			}
		})
	},
	init:function(){
		this.inputChange();
	}
}
$(function(){
	backPassword.init();
})
