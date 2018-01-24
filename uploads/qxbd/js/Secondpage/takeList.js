var takeList={
	state:null,
	page:1,
	/*获取url中传过来的值*/
	getUrlParmas:function(){
		switch (base.getUrlParmas()){
			case "4":
				$("#pageTitle").text("班级通知")
				takeList.state=1;
				$("#content").prepend(base.specifiedDom())
				break;
			case "8":
				$("#pageTitle").text("学校通知")
				takeList.state=2;
			$("#content").prepend('<a href="javaScript:" class="all_header"><div class="posted"><div><span >发布内容</span></div></div></a>')
				break;
		}
			if(base.allotRoot()=="5"||base.allotRoot()=="7"||(base.allotRoot()=="4"&&base.GetQueryString("index")=="8")){
				$(".all_header").css("display","none")
				$("#pullrefresh").css("top",".5rem")
			}else{
				$(".all_header,.header").css("display","block")
			}
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
		if(takeList.state==1){
			sendUrl=base.getContextPath()+'/control/h5/cyclassnotice/findClassNoticeH5ByPage.htm';
		}else if(takeList.state==2){
			sendUrl=base.getContextPath()+'/control/h5/cyschoolnotice/findSchoolNoticeH5ByPage.htm';
		}
		function pullupRefresh() {
			setTimeout(function() {
				if(sessionStorage.getItem("uidGradeId")==null){
					sendData="uidUserId="+base.getUidUserId()+"&pageNow="+takeList.page;
				}else{
					sendData="uidUserId="+base.getUidUserId()+"&uidGradeId="+sessionStorage.getItem("uidGradeId")+"&uidClassId="+sessionStorage.getItem("uidClassId")+"&pageNow="+takeList.page;
				}
				
				   $.ajax({
						type: "post",
						url: sendUrl,
						data:sendData,
						async:false,
						success: function(data) {
							if(data.success){
								pageCount=data.object.pageCount
								mui('#pullrefresh').pullRefresh().endPullupToRefresh(( ++count>= pageCount));
								for(var i=0;i<data.object.records.length;i++){
									$("#testVal").html(data.object.records[i].strContent)
									var val=$("#testVal").text().substring(0,100);
									if($("#testVal").text().length>100){
										val+='...'
									}
									var html = "";
									var li = document.createElement('li');
									li.className = 'mui-table-view-cell';
									li.setAttribute("data_uidIntroduceId",data.object.records[i].uidNoticeId);
									if(data.object.records[i].strHeadImgPath==""){
										html += '<div class="formbox-bd"><div class="pic"><img src="../images/tzgg.png"></div>'
									}else{
										html += '<div class="formbox-bd"><div class="pic"><img src="'+data.object.records[i].strHeadImgPath+'"></div>'
									}
									html += '<div class="text"><div class="name">'+data.object.records[i].strTitle+'</div><div class="time">'+new Date(data.object.records[i].dtCreate).toLocaleDateString().replace(/\//g,"-")+'</div>'
									//判断状态未定
									html += '<div class="text_content"><div class="text_padding">'+val+'</div>';
									if(localStorage.getItem("iRoleID")=="3"){
										html += '<div class="text_read"><a href="javaScript:" class="detailed" data_uidIntroduceId='+data.object.records[i].uidNoticeId+'>阅读全文</a><a href="javaScript:" class="drop" data_uidNoticeId='+data.object.records[i].uidNoticeId+'>删除</a></div></div></div></div>';
									}else{
										if(base.GetQueryString("index")=="4"&&localStorage.getItem("iRoleID")!="7"){
											html += '<div class="text_read"><a href="javaScript:" class="detailed" data_uidIntroduceId='+data.object.records[i].uidNoticeId+'>阅读全文</a><a href="javaScript:" class="drop" data_uidNoticeId='+data.object.records[i].uidNoticeId+'>删除</a></div></div></div></div>';
										}else{
											html += '<div class="text_read"><a href="javaScript:" class="detailed" data_uidIntroduceId='+data.object.records[i].uidNoticeId+'>阅读全文</a></div></div></div></div>';
										}
									}
									li.innerHTML = html
									$(".mui-table-view")[0].appendChild(li)
								}
								sessionStorage.clear()
								if(data.object.pageCount>1){
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
								location.replace(base.getContextPath()+'/h5/error.html')
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
	drop:function(uidNoticeId,ev){
		var sendUrl="";
		var sendData="";
		sendData="uidNoticeId="+uidNoticeId+"&uidUserId="+base.getUidUserId();
		if(takeList.state==1){
			sendUrl=base.getContextPath()+'/control/h5/cyclassnotice/deleteClassNoticeH5.htm';
		}else if(takeList.state==2){
			sendUrl=base.getContextPath()+'/control/h5/cyschoolnotice/deleteSchoolNoticeH5.htm';
		}
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
				}else{
					base.dialog({
						type:"2",
						title:"",
						text:"删除失败!",
						flag:true,
						success:()=>{
						}
					});
				}
			},
			error: function(data, xhm) {
				base.Toast("loading","删除中...",false);
				location.replace(base.getContextPath()+'/h5/error.html')
			}
		})
	},
	/*绑定当前页面所有js的事件*/
	bindAll:function(){
		$(".btn").on("click",function(){
			if($(".grade_word").attr("data_uidgradeid")!=undefined){
				sessionStorage.setItem("uidGradeId",$(".grade_word").attr("data_uidgradeid"))
			}
			if($(".Class_word").attr("data_uidgradeid")!=undefined){
				sessionStorage.setItem("uidClassId",$(".Class_word").attr("data_uidgradeid"))
			}
			$(".mui-table-view").eq(0).html("")
			takeList.page=1;
			takeList.upLoad();
		})
		/*跳转到指定页面*/
		$(".header_right").on("click",function() {
			if(takeList.state==1){
				location.replace("posted.html?state="+base.GetQueryString("index"))
			}else if(takeList.state==2){
				location.replace("release.html?state="+base.GetQueryString("index"))
			}
		})
		/*跳转到发布学校公告*/
		$(".all_header").on("tap",function(){
			location.replace("posted.html?state="+base.getUrlParmas())
		})
		//阅读全文
		$("#pullrefresh").on("tap",".detailed",function(){
			window.location.href = "detailed.html?state="+base.getUrlParmas()+"&uidId="+$(this).attr("data_uidIntroduceId")
		})
		//点击li阅读全文
		$("#pullrefresh").on("tap",".mui-table-view-cell",function(){
			window.location.href = "detailed.html?state="+base.getUrlParmas()+"&uidId="+$(this).attr("data_uidIntroduceId")
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
					takeList.drop(that.attr("data_uidNoticeId"),that);
					base.Toast("loading","删除中...",true);
				}
			});

		})
	},
	init:function(){
		base.verifyUser();
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
