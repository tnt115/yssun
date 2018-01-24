var posted={
		sendUrl:"",
		/* 发布操作 */
		saveClassNotice:function(){
			var senData=""
			if($("#iAmount").val()==""){
				base.dialog({
					type:"2",
					title:"",
					text:`缴费金额不能为空!`,
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
					text:`收款任务内容不能为空!`,
					flag:true,
					success:()=>{
					}
				});
				return false
			}
			 
			senData+='uidUserId='+base.getUidUserId()+"&iAmount="+$("#iAmount").val()+"&strTitle="+$("#strTitle").val()+"&strRemark="+$("#strRemark").val()
			 
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
						//location.replace("task_list.html?index="+base.GetQueryString("state"))
						window.location.href= (base.getContextPath()+"/h5/Secondpage/task_list.html?serverId="+base.GetQueryString("serverId")+"&mobilePhone="+base.GetQueryString("mobilePhone")+"&open_id="+base.GetQueryString("open_id"))
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
					location.replace(base.getContextPath()+'/h5/sys_error.html')
				 
				}
			});
		},
		/* 绑定所有的方法 */
		allBind:function(){
 
			$("#btn").on("tap",function(){
				base.dialog({
					type:"1",
					title:"友情提示",
					text:"确定要发布吗?",
					flag:true,
					success:()=>{
						posted.saveClassNotice();
					}
				});
				
			})
			
			$(".mui-action-back").on("tap",function(){
				//window.history.back();
				window.location.href= (base.getContextPath()+"/h5/Secondpage/task_list.html?serverId="+base.GetQueryString("serverId")+"&mobilePhone="+base.GetQueryString("mobilePhone")+"&open_id="+base.GetQueryString("open_id"))
			})
			
			
			
		},
		/* 初始化页面 */
		initPage:function(){
			$("#pageTitle").text("发布收款任务")
			base.customBtn();
			posted.sendUrl=base.getContextPath() + '/wxpaytask/savePayTaskH5.do';
		},
		init:function(){
			this.initPage();
			this.allBind();
		},
}

$(function(){
	posted.init();
})
