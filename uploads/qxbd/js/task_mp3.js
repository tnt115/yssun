var detailed={
		setContent:function(){
			var sendUrl=""
			var sendData=""
			 
			$("#pageTitle").text("情绪表达")
			sendUrl="menu.json";
			//sendData="uidUserId="+base.getUidUserId()+'&iTaskId='+base.GetQueryString("iTaskId");
			$.ajax({
				type:"GET",
				url:sendUrl,
				data:sendData,
				dataType:"JSON",
				success:function(data){
					
						$(".mui-title_name").html(data.strSubject);
						var article_list = document.getElementById('mui-content').getElementsByClassName('item_template')[0];
						// 根据模板将数据渲染成 HTML
						var html = template('home-template', {'items':data});
						article_list.innerHTML = html;
				 
				},
				error: function(data, xhm) {
					console.log(data);
						//location.replace(base.getContextPath()+'/h5/sys_error.html')
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
