var allStudent={
    removeAndAdd:function(){
   $(".top .ul_name").on("touchstart","li",function(){
   		event.stopPropagation()
   		event.preventDefault()
		$(this).remove();
   		if($(".top .ul_name li").length==0){
   			$("#errorMsg").css("display","block")
   		}
	})
	$(".top_content .ul_name").on("touchstart","li",function(){
		var chencd=$(this).text().trim().substring(0,$(this).text().trim().length-1)
		var flag=true;
		$(".top .ul_name a").each(function(){
			if($(this).text().substring(0,$(this).text().length-1)==chencd){
				flag=false
			}
		})
		if(!flag)return false
			$("#errorMsg").css("display","none")
			var html='<li class="list_sort" data_uidUserId='+$(this).attr("data_uidUserId")+'><a href="javaScript:">' + chencd + '<span>×</span></a></li>';
			$(".top .ul_name:last-child").append(html);
	})
    },
    /*获取所有学生列表*/
    getStudentList:function(type){
		$.ajax({
			type:"POST",
			url:base.getContextPath()+'/control/h5/classduty/studentList.htm',
			data:"uidUserId="+base.getUidUserId()+"&uidClassId="+sessionStorage.getItem("uidClassId"),
			dataType:"JSON",
			success:function(data){
				if(data.success){
					var uidStudentIdList=sessionStorage.getItem("userIdlist").split(",")
					for(var i=0;i<data.object.length;i++){
						for(var j=0;j<uidStudentIdList.length;j++){
							if(uidStudentIdList[j]==data.object[i].uidStudentId){
								$("#errorMsg").css("display","none")
								$(".top .ul_name").append('<li class="list_sort" data_uidUserId='+data.object[i].uidStudentId+'><a href="javaScript:">'+data.object[i].strRealName+'<span>×</span></a></li>')
							}
						}
						$(".top_content .ul_name").append('<li class="list_sort" data_uidUserId='+data.object[i].uidStudentId+'><a href="javaScript:">'+data.object[i].strRealName+'<span>+</span></a></li>')
					}
					if($(".top .ul_name li").length==0){
						$("#errorMsg").css("display","block")
					}
					switch (type) {
					case "parent":
						$(".ul_name .list_sort").find("span").remove();
						break;
					case "other":

						break;
					}
				}else{
					base.dialog({
						type:"2",
						title:"",
						text:`获取学生失败! ${data.object}`,
						flag:true,
						success:()=>{
							
						}
					});
				}
			},
			error: function(data, xhm) {
					location.replace(base.getContextPath()+'/h5/error.html')
			}
		})
    },
    /*保存编辑*/
    saveClassdutyEt:function(){
    	var sendData="uidUserId="+base.getUidUserId()+"&uidClassId="+sessionStorage.getItem("uidClassId")+"&iWeek="+base.GetQueryString("week")
    	var uidUserIds=[]
    	$(".top .ul_name li").each(function(){
    		uidUserIds.push($(this).attr("data_uiduserid"))
    	})
    	sendData+='&uidUserIds='+uidUserIds+""; 
    	base.Toast("loading","保存中...",true);
		$.ajax({
			type:"POST",
			url:base.getContextPath()+'/control/h5/classduty/saveClassdutyEtH5.htm',
			data:sendData,
			dataType:"JSON",
			success:function(data){
				base.Toast("loading","保存中...",false);
				if(data.success){
					sessionStorage.clear();
					window.location.replace("classDuty.html");
				}else{
					base.dialog({
						type:"2",
						title:"",
						text:data.object,
						flag:true,
						success:()=>{
							
						}
					});
				}
			},
			error: function(data, xhm) {
				base.Toast("loading","保存中...",false);
					location.replace(base.getContextPath()+'/h5/error.html')
			}
		})
    },
	/*绑定当前页面所有的事件*/
	bindAll:function(){
			$("#btn").on("click",function(){
				allStudent.saveClassdutyEt();
			})
	},
	init:function(){
		$("#weekDay").text(sessionStorage.getItem("weekDay"))
		if(localStorage.getItem("iRoleID")=="7"||localStorage.getItem("iRoleID")=="5"){
			$(".top_content,#btn").css("display","none");
			this.getStudentList("parent");
		}else{
			this.removeAndAdd();
			this.getStudentList("other");
			this.bindAll();
		}
	}
}
$(function(){
	allStudent.init()
})
