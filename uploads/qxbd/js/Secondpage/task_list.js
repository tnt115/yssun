var takeList={
	state:null,
	page:1,
	/*获取url中传过来的值*/
	getUrlParmas:function(){
		
		$("#pageTitle").text("催款任务列表")
		$(".all_header,.header").css("display","block")
	},		
		/*下拉刷新*/
	upLoad: function() {
		mui.init({
			pullRefresh: {
				container: '#pullrefresh',
				up: {
					contentrefresh: '正在加载...',
					callback: pullupRefresh
				}
			}
		});
		var sendData=""
		var sendUrl=""
		var count = 0;
		var pageCount=0
		sendUrl=base.getContextPath()+'/wxpaytask/queryPayTaskPage.do';
		 
		function pullupRefresh() {
			setTimeout(function() {
				
				sendData="uidUserId="+base.getUidUserId()+"&pageNow="+takeList.page;
				
				   $.ajax({
						type: "post",
						url: sendUrl,
						data:sendData,
						async:false,
						success: function(data) {
							if(data.success){
								pageCount=data.object.pages
								mui('#pullrefresh').pullRefresh().endPullupToRefresh(( ++count>= pageCount));
								
								var article_list = document.getElementById('pullrefresh').getElementsByClassName('mui-table-view')[0];
								
								// 根据模板将数据渲染成 HTML
								var html = template('home-template', {'items':data.object.list});
								//wd-日期更改
								// 将 HTML 插入到列表后
								article_list.innerHTML += html;
								
//								for(var i=0;i<data.object.records.length;i++){
//									//$("#testVal").html(data.object.records[i].strContent)
//									//var val=$("#testVal").text().substring(0,100);
//									//if($("#testVal").text().length>100){
//									//	val+='...'
//									//}
//									
//									var html = "";
//									var li = document.createElement('li');
//									li.className = 'mui-table-view-cell';
//									li.setAttribute("data_uidIntroduceId",data.object.records[i].uidNoticeId);
//									if(data.object.records[i].strHeadImgPath==""){
//										html += '<div class="formbox-bd"><div class="pic"><img src="../images/tzgg.png"></div>'
//									}else{
//										html += '<div class="formbox-bd"><div class="pic"><img src="'+data.object.records[i].strHeadImgPath+'"></div>'
//									}
//									html += '<div class="text"><div class="name">'+data.object.records[i].strTitle+'</div><div class="time">'+new Date(data.object.records[i].dtCreate).toLocaleDateString().replace(/\//g,"-")+'</div>'
//									//判断状态未定
//									html += '<div class="text_content"><div class="text_padding">'+val+'</div>';
//									if(localStorage.getItem("iRoleID")=="3"){
//										html += '<div class="text_read"><a href="javaScript:" class="detailed" data_uidIntroduceId='+data.object.records[i].uidNoticeId+'>阅读全文</a><a href="javaScript:" class="drop" data_uidNoticeId='+data.object.records[i].uidNoticeId+'>删除</a></div></div></div></div>';
//									}else{
//										if(base.GetQueryString("index")=="4"&&localStorage.getItem("iRoleID")!="7"){
//											html += '<div class="text_read"><a href="javaScript:" class="detailed" data_uidIntroduceId='+data.object.records[i].uidNoticeId+'>阅读全文</a><a href="javaScript:" class="drop" data_uidNoticeId='+data.object.records[i].uidNoticeId+'>删除</a></div></div></div></div>';
//										}else{
//											html += '<div class="text_read"><a href="javaScript:" class="detailed" data_uidIntroduceId='+data.object.records[i].uidNoticeId+'>阅读全文</a></div></div></div></div>';
//										}
//									}
//									li.innerHTML = html
//									$(".mui-table-view")[0].appendChild(li)
//								}
								
								sessionStorage.clear()
								if(data.object.pages>1){
									takeList.page++;
								}
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
								
								//location.replace(base.getContextPath()+'/h5/error.html')
							base.dialog({
								type:"2",
								title:"",
								text:"加载任务失败",
								flag:true,
								success:()=>{
								}
							});
						}
					});
			}, 200)
		}
		if(mui.os.plus) {
			mui.plusReady(function() {
				setTimeout(function() {
					mui('#pullrefresh').pullRefresh().pullupLoading();
				}, 1000);

			});
		} else {
			mui.ready(function() {
				mui('#pullrefresh').pullRefresh().pullupLoading();
			});
		}
	},
	
	/*用户删除操作*/
	drop:function(iTaskId,ev){
		var sendUrl="";
		var sendData="";
		sendData="iTaskId="+iTaskId+"&uidUserId="+base.getUidUserId();
		sendUrl=base.getContextPath()+'/wxpaytask/deletePayTask.do';
		$.ajax({
			type:"POST",
			url:sendUrl,
			data:sendData,
			dataType:"JSON",
			success:function(data){
				base.Toast("loading","删除中...",false);
				if(data.success){
					ev.parents("li").slideUp(200,function(){
						ev.parents("li").remove()
					})
					mui.toast('删除成功!');
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
				base.Toast("loading","删除中...",false);
				location.replace(base.getContextPath()+'/h5/sys_error.html')
			}
		})
	},
	/*绑定当前页面所有js的事件*/
	bindAll:function(){
		$(".btn").on("tap",function(){
			takeList.page=1;
			takeList.upLoad();
		})
		
		 
		/*跳转到发布学校公告*/
		$(".all_header").on("tap",function(){
			window.location.href= (base.getContextPath()+"/h5/Secondpage/task_posted.html?state=1&serverId="+base.GetQueryString("serverId")+"&mobilePhone="+base.GetQueryString("mobilePhone")+"&open_id="+base.GetQueryString("open_id"))
		})
		
		//阅读全文
		$("#pullrefresh").on("tap",".detailed",function(){
			window.location.href = base.getContextPath()+"/h5/Secondpage/task_detailed.html?state=1"+"&iTaskId="+$(this).attr("data_iTaskId")+"&serverId="+base.GetQueryString("serverId")+"&mobilePhone="+base.GetQueryString("mobilePhone")+"&open_id="+base.GetQueryString("open_id")
		})
		
		
		//催款
		$("#pullrefresh").on("tap",".costpaybtn",function(){
			window.location.href = base.getContextPath()+"/h5/Secondpage/task_press_posted.html?state=1"+"&iTaskId="+$(this).attr("data_iTaskId")+"&serverId="+base.GetQueryString("serverId")+"&mobilePhone="+base.GetQueryString("mobilePhone")+"&open_id="+base.GetQueryString("open_id")
		})
		
		$(".mui-table-view:eq(0)").on("tap",".drop",function(event){
			 event.stopPropagation();
			let that=$(this);
			base.dialog({
				type:"1",
				title:"友情提示",
				text:"确定要删除?",
				flag:true,
				success:()=>{
					takeList.drop(that.attr("data_iTaskId"),that);
					base.Toast("loading","删除中...",true);
				}
			});

		})
	},
	init:function(){
		this.getUrlParmas()
		this.upLoad();
		base.toggle();
		base.allClose();
		this.bindAll();
	},
}
$(function(){
	takeList.init();
})
