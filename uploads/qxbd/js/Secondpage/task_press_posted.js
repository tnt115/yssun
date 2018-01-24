var posted={
		ListSchool:[],
		ListGrade:[],
		ListLlass:[],
		sendUrl:"",
		getListSchool:function(){
			var response=base.getListSchoolN(base.getUidUserId(),base.GetQueryString("serverId"),base.GetQueryString("mobilePhone"));
			if(response.readyState==4&&response.status==200){
				var text=JSON.parse(response.responseText)
					for(var i=0;i<text.data.length;i++){
						posted.ListSchool.push({
							text:text.data[i].schoolName,
							value:text.data[i].schoolId
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
				//重新加载一次
				if(base.GetQueryString("serverId")!=null && null !=base.GetQueryString("mobilePhone")){
					window.location.reload();
				}
			}
		},
		
		/* 获取年级底部菜单 */
		getListGrade:function(iSchoolId){
			var response=base.getListGradeN(base.getUidUserId(),base.GetQueryString("serverId"),base.GetQueryString("mobilePhone"),iSchoolId);
			if(response.readyState==4&&response.status==200){
				var text=JSON.parse(response.responseText)
					for(var i=0;i<text.data.length;i++){
						posted.ListGrade.push({
							text:text.data[i].gradeName,
							value:text.data[i].gradeId
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
		getListLlass:function(iSchoolId,uidGradeId){
			posted.ListLlass=[]
			var response=base.getListLlassN(base.getUidUserId(),base.GetQueryString("serverId"),base.GetQueryString("mobilePhone"),iSchoolId,uidGradeId);
			if(response.readyState==4&&response.status==200){
				var text=JSON.parse(response.responseText)
					for ( var i = 0; i < text.data.length; i++) {
						posted.ListLlass.push({
							text:text.data[i].className,
							value:text.data[i].classId
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
		 
		getStudentList:function(iSchoolId,iClassId){
			var sendUrl=""
			var sendData=""
			 
			sendUrl=base.getContextPath()+'/school/getStudentList.do';
			sendData="uidUserId="+base.getUidUserId()+'&iSchoolId='+iSchoolId;
			sendData+="&iClassId="+iClassId+'&serverId='+base.GetQueryString("serverId");
			sendData+="&mobilePhone="+base.GetQueryString("mobilePhone");
			
			$.ajax({
				type:"POST",
				url:sendUrl,
				data:sendData,
				dataType:"JSON",
				success:function(data){
					if(data.code==200){
						//$("#_iTaskId").val(data.object.tbPayTask.iTaskId)
						//$(".task_titles").html("<h3>"+data.object.tbPayTask.strTitle+"   </h3>   <h6>发布时间:"+data.object.tbPayTask.strDtCreate+"</h6>");
						//$(".task_amounts").html("<h5>￥"+data.object.tbPayTask.dAmount+"元/用户 </h5>");
						var article_list = document.getElementById('mui-table-viewx');
						var html = template('home-template', {'items':data.data});
						article_list.innerHTML = html;
						
						posted.bindstuEvent();
						
					}else{
						base.dialog({
							type:"2",
							title:"",
							text:data.message,
							flag:true,
							success:()=>{
								//location.replace(base.getContextPath()+'/h5/index.html')
							}
						});
					}
				},
				error: function(data, xhm) {
						location.replace(base.getContextPath()+'/h5/sys_error.html')
				}
			})
		},
		removeStudentItem:function(){
			var article_list = document.getElementById('mui-table-viewx');
			article_list.innerHTML = "";
		},
		
		bindstuEvent:function(){
			$(document.getElementById('mui-table-viewx').getElementsByClassName(".checkbox_all")[0]).on("tap",function(){
				 if($(this).prop('checked')==false){  
					 $('input[name="itemcheckbox"]').each(function(){  
		                    if($(this).prop("disabled")==false){
		                    	 $(this).prop("checked",true); 
		                    }
		                });  
				 }else{
					 $('input[name="itemcheckbox"]').each(function(){  
		                    if($(this).prop("disabled")==false){
		                    	 $(this).prop("checked",false); 
		                    }
		                });  
				 }
			})
			
		},
		/* 发布操作 */
		saveClassNotice:function(){
			var senData=""
			 
			if($("#_iTaskId").val()==""){
				base.dialog({
					type:"2",
					title:"",
					text:`任务ID不能为空!`,
					flag:true,
					success:()=>{
					}
				});
				return false
			}
			if($(".showUserPicker:eq(2)").children().attr("data_uid")==undefined){
				base.dialog({
					type:"2",
					title:"",
					text:`请选择班级!`,
					flag:true,
					success:()=>{
					}
				});
				return false
			}
			
			var sendStuIds = "";
			 $('input[name="itemcheckbox"]').each(function(){  
                    if($(this).prop("disabled")==false  &&  $(this).prop("checked")==true){
                    	sendStuIds+=$(this).val()+",";
                    }
                });  
			
			if(sendStuIds==""){
				base.dialog({
					type:"2",
					title:"",
					text:`请选择家长!`,
					flag:true,
					success:()=>{
					}
				});
				return false
			}
			
			
			posted.sendUrl=base.getContextPath() + '/wxpaytask/saveOrUpdatePayTaskItem.do';
			
			senData+='uidUserId='+base.getUidUserId()+"&iTaskId="+$("#_iTaskId").val()
			senData+="&mobilePhone="+base.GetQueryString("mobilePhone");
			senData+="&serverId="+base.GetQueryString("serverId");
			senData+="&iSchoolId="+$(".showUserPicker:eq(0)").children().attr("data_uid");
			senData+="&iGradeId="+$(".showUserPicker:eq(1)").children().attr("data_uid");
			senData+="&iClassId="+$(".showUserPicker:eq(2)").children().attr("data_uid");
			senData+="&strStudentIds="+sendStuIds;
			
			posted.sendAjax(senData);
		},
		/* 点击发布的时候发送数据到后端 */
		sendAjax:function(senData){
			base.Toast("loading","正在发送...",true);
			$.ajax({
				type: "post",
				url: posted.sendUrl,
				data: senData,
				async: false,
				success: function(data) {
					base.Toast("loading","正在发送...",false);
					if(data.success){
					//	location.replace("task_list.html?serverId="+base.GetQueryString("serverId")+"&")
						
						mui.alert('发送成功!', '', function() {
							window.location.href=(base.getContextPath()+"/h5/Secondpage/task_list.html?serverId="+base.GetQueryString("serverId")+"&mobilePhone="+base.GetQueryString("mobilePhone")+"&open_id="+base.GetQueryString("open_id"))
						});
//						base.dialog({
//							type:"2",
//							title:"",
//							text:"发送成功!",
//							flag:true,
//							success:()=>{
//								window.location.href=(base.getContextPath()+"/h5/Secondpage/task_list.html?serverId="+base.GetQueryString("serverId")+"&mobilePhone="+base.GetQueryString("mobilePhone")+"&open_id="+base.GetQueryString("open_id"))
//							}
//						});
					}else{
						mui.alert(data.object, '', function() {
							
						});
//						base.dialog({
//							type:"2",
//							title:"",
//							text:data.object,
//							flag:true,
//							success:()=>{
//							}
//						});
					}
				},
				error: function(data, xhm) {
					base.Toast("loading","正在发布...",false);
					location.replace(base.getContextPath()+'/h5/sys_error.html')
				}
			});
		},
		/* 绑定所有的方法 */
		allBind:function(){
			$(".showUserPicker").on("tap",function(event){
				if($(this).parent().index()==1){
					base.bomSelectN(this,posted.ListSchool,posted,1);
					$(".showUserPicker:eq(1)").children().removeAttr("data_uid").html("请选择").css("color","#ccc")
					//posted.getListGrade($(this).children().attr("data_uid"))
					
				}
				else if($(this).parent().index()==2){
					if($(".showUserPicker:eq(0)").children().attr("data_uid")==undefined){
						base.dialog({
							type:"2",
							title:"",
							text:"请先选择学校",
							flag:true,
							success:()=>{
							}
						});
						$(".showUserPicker:eq(2)").children().removeAttr("data_uid").html("请选择").css("color","#ccc")
						return 
					}else{
						//$(".showUserPicker:eq(0)").children().removeAttr("data_uid").html("请选择").css("color","#ccc")
						$(".showUserPicker:eq(2)").children().removeAttr("data_uid").html("请选择").css("color","#ccc")
						base.bomSelectN(this,posted.ListGrade,posted,2);
						//posted.getListLlass($(".showUserPicker:eq(0)").children().attr("data_uid"),$(this).children().attr("data_uid"))
					}
				}
				else{
					if($(".showUserPicker:eq(1)").children().attr("data_uid")==undefined){
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
						base.bomSelectN(this,posted.ListLlass,posted,3);
					}
				}
			})
			$(".btn_send").on("tap",function(){
				base.dialog({
					type:"1",
					title:"友情提示",
					text:"确定要发送吗?",
					flag:true,
					success:()=>{
						posted.saveClassNotice();
					}
				});
				
			})
			
			$(".btn_cancel").on("tap",function(){
//				window.history.back();
				window.location.href = (base.getContextPath()+"/h5/Secondpage/task_list.html?serverId="+base.GetQueryString("serverId")+"&mobilePhone="+base.GetQueryString("mobilePhone")+"&open_id="+base.GetQueryString("open_id"))
			})
			
		},
		/* 初始化页面 */
		initPage:function(){
			$("#pageTitle").text("发送收款通知")
			base.customBtn();
			posted.sendUrl=base.getContextPath() + '/wxpaytask/saveOrUpdatePayTaskItem.do';
		},
		setContent:function(){
			base.Toast("loading","加载中...",true);
			var sendUrl=""
			var sendData=""
			 
			sendUrl=base.getContextPath()+'/wxpaytask/getPayTaskDetailById.do';
			sendData="uidUserId="+base.getUidUserId()+'&iTaskId='+base.GetQueryString("iTaskId");
			 
			$.ajax({
				type:"POST",
				url:sendUrl,
				data:sendData,
				dataType:"JSON",
				success:function(data){
					base.Toast("loading","加载中...",false);
					if(data.success){
						$("#_iTaskId").val(data.object.tbPayTask.iTaskId)
						$(".task_titles").html("<h3>"+data.object.tbPayTask.strTitle+"   </h3>   <h6>发布时间:"+data.object.tbPayTask.strDtCreate+"</h6>");
						$(".task_amounts").html("<h5>￥"+data.object.tbPayTask.dAmount+"元/用户 </h5>");
						
					}else{
						base.dialog({
							type:"2",
							title:"",
							text:data.object,
							flag:true,
							success:()=>{
								//location.replace(base.getContextPath()+'/h5/index.html')
							}
						});
					}
				},
				error: function(data, xhm) {
						location.replace(base.getContextPath()+'/h5/sys_error.html')
				}
			})
			
		},
		init:function(){
			this.initPage();
			this.allBind();
			this.bindstuEvent();
			this.getListSchool();//加载学校
			this.setContent();
		},
}

$(function(){
	posted.init();
})
