var detailed={
		setContent:function(){
			var sendUrl=""
			var sendData=""
			 
			$("#pageTitle").text("任务详情")
			sendUrl=base.getContextPath()+'/wxpaytask/getPayTaskDetailById.do';
			sendData="uidUserId="+base.getUidUserId()+'&iTaskId='+base.GetQueryString("iTaskId");
			 
			$.ajax({
				type:"POST",
				url:sendUrl,
				data:sendData,
				dataType:"JSON",
				success:function(data){
					if(data.success){
						
						$(".task_titles").html("<h3>"+data.object.tbPayTask.strTitle+" </h3>   <h6>发布时间:"+data.object.tbPayTask.strDtCreate+"</h6>")
						$(".task_coststatis").html("<h5>￥"+data.object.tbPayTask.dAmount+"元/用户 ,总缴费用户数:"+data.object.totalStudent+"人,总费用：￥"+data.object.totalAmount+"元</h5>")
						
						var article_list = document.getElementById('mui-content').getElementsByClassName('item_template')[0];
						// 根据模板将数据渲染成 HTML
						var html = template('home-template', {'items':data.object.items});
						article_list.innerHTML = html;
						
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
		 
		bind(){
			$(".weui-footer__link").click(()=>{
				//location.replace(base.getContextPath()+'/h5/index.html')
			})
			
//			$(".mui-action-back").click(()=>{
//				window.history.back(-1);
//			})
			
			$(".mui-action-back").on("tap",function(){
				//window.history.back();
				window.location.href = (base.getContextPath()+"/h5/Secondpage/task_list.html?serverId="+base.GetQueryString("serverId")+"&mobilePhone="+base.GetQueryString("mobilePhone")+"&open_id="+base.GetQueryString("open_id"))
		    })
		},
		init:function(){
			this.bind();
			this.setContent();
		}
}
$(function(){
	detailed.init();
})
