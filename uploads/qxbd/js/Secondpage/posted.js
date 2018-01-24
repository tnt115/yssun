var posted={
		ListGrade:[],
		ListLlass:[],
		sendUrl:"",
		/* 获取年级底部菜单 */
		getListGrade:function(){
			var response=base.getListGrade(base.getUidUserId());
			if(response.readyState==4&&response.status==200){
				var text=JSON.parse(response.responseText)
					for(var i=0;i<text.object.length;i++){
						posted.ListGrade.push({
							text:text.object[i].strGradeName,
							value:text.object[i].uidGradeId
						})
					}
			}else{
				base.dialog({
					type:"2",
					title:"",
					text:`获取数据异常`,
					flag:true,
					success:()=>{
					}
				});
			}
		},
		/* 获取班级底部菜单 */
		getListLlass:function(uidGradeId){
			posted.ListLlass=[]
			var response=base.getListLlass(base.getUidUserId(),uidGradeId);
			if(response.readyState==4&&response.status==200){
				var text=JSON.parse(response.responseText)
					for ( var i = 0; i < text.object.length; i++) {
						posted.ListLlass.push({
							text:text.object[i].strClassName,
							value:text.object[i].uidClassId
						})
					}
			}else{
				base.dialog({
					type:"2",
					title:"",
					text:`获取数据异常`,
					flag:true,
					success:()=>{
					}
				});
			}
		},
		/* 发布操作 */
		saveClassNotice:function(){
			var senData=""
			if($("#user").val()==""){
				base.dialog({
					type:"2",
					title:"",
					text:`发布人不能为空!`,
					flag:true,
					success:()=>{
					}
				});
				return false
			}
			if($("#strTitle").val()==""){
				base.dialog({
					type:"2",
					title:"",
					text:`通知标题不能为空!`,
					flag:true,
					success:()=>{
					}
				});
				return false
			}
			if($("#strContent").val()==""){
				base.dialog({
					type:"2",
					title:"",
					text:`通知内容不能为空!`,
					flag:true,
					success:()=>{
					}
				});
				return false
			}
			if(base.GetQueryString("state")==4){
				if($(".showUserPicker:eq(1)").children().attr("data_uid")==undefined){
					base.dialog({
						type:"2",
						title:"",
						text:`请选择发布到的班级!`,
						flag:true,
						success:()=>{
						}
					});
					return false
				}
			}
			senData+='uidUserId='+base.getUidUserId()+"&strTitle="+$("#strTitle").val()+"&strContent="+$("#strContent").val()+"&strPublicName="+$("#user").val()
			if(base.GetQueryString("state")==4){
				senData+="&uidClassId="+$(".showUserPicker:eq(1)").children().attr("data_uid");
			if($("#checkbox1").prop("checked")){
					senData+='&iShowToHome=1' 
				}else{
					senData+='&iShowToHome=0' 
				}
			}else if(base.GetQueryString("state")==8){
				senData+="&iPubType=3&iType=0&uidKeyId=";
			}
			posted.sendAjax(senData);
		},
		/* 点击发布的时候发送数据到后端 */
		sendAjax:function(senData){
			base.Toast("loading","正在发布...",true);
			$.ajax({
				type: "post",
				url: posted.sendUrl,
				data: senData,
				async: false,
				success: function(data) {
					base.Toast("loading","正在发布...",false);
					if(data.success){
						location.replace("takeList.html?index="+base.GetQueryString("state"))
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
					base.Toast("loading","正在发布...",false);
					location.replace(base.getContextPath()+'/h5/error.html')
				}
			});
		},
		/* 绑定所有的方法 */
		allBind:function(){
			$(".showUserPicker").on("click",function(event){
				if($(this).parent().index()==1){
					base.bomSelect(this,posted.ListGrade,posted);
				}else{
					if($(".showUserPicker:eq(0)").children().attr("data_uid")==undefined){
						base.dialog({
							type:"2",
							title:"",
							text:"请先选择年级",
							flag:true,
							success:()=>{
							}
						});
						return 
					}else{
						base.bomSelect(this,posted.ListLlass);
					}
				}
			})
			$("#btn").on("click",function(){
				posted.saveClassNotice();
			})
		},
		/* 初始化页面 */
		initPage:function(){
			if(base.GetQueryString("state")==4){
				$("#pageTitle").text("发布班级通知")
				base.customBtn();
				posted.sendUrl=base.getContextPath() + '/control/h5/cyclassnotice/saveClassNoticeH5.htm';
			}else if(base.GetQueryString("state")==8){
				$("#pageTitle").text("发布学校通知")
				$("#checkbox2,#error").css("display","inline-block")
				$(".mui-card").css("display","none")
				posted.sendUrl=base.getContextPath()+'/control/h5/cyschoolnotice/saveSchoolNoticeH5.htm';
			}
		},
		init:function(){
			this.initPage();
			this.allBind();
			this.getListGrade();
		},
}

$(function(){
	posted.init();
})
