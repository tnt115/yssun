var ClassStyle = {
		page:1,
		state:null,
	/*点击空白处关闭所有的弹出层*/
	allClose: function(ev) {
		$("#scale").on("touchstart", function(event) {
			event.stopPropagation();
			event.preventDefault();
			$(".header_left").css("z-index", "666")
			$("#scale").css("display", "none").html("");
			$("body").removeClass("socrllHide");
			$(".msg").fadeOut(400);
		})

	},
	/*跳转到新页面*/
	hrefNewPage: function() {
		$(".header_right").click(function() {
			window.location.replace("release.html?state="+ClassStyle.state);
		})
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
		var imgList=[];
		if(ClassStyle.state==1){
			sendUrl=base.getContextPath()+'/control/h5/classalbum/findClassAlbumH5ByPage.htm';
		}else if(ClassStyle.state==2){
			sendUrl=base.getContextPath()+'/control/h5/classhonor/findClassHonorByPage.htm';
		}
		function pullupRefresh() {
			setTimeout(function(){
				if(sessionStorage.getItem("uidGradeId")==null&&sessionStorage.getItem("uidGradeId")==null){
					sendData="uidUserId="+base.getUidUserId()+"&pageNow="+ClassStyle.page;
				}else{
					sendData="uidUserId="+base.getUidUserId()+"&uidGradeId="+sessionStorage.getItem("uidGradeId")+"&uidClassId="+sessionStorage.getItem("uidClassId")+"&pageNow="+ClassStyle.page;
				}
				   $.ajax({
					type: "post",
					url: sendUrl,
					data:sendData,
					async:false,
					success: function(data) {
						console.log(data)
						if(data.success){
							pageCount=data.object.pageCount
							for(var i=0;i<data.object.records.length;i++){
									var html = "";
									var li = document.createElement('li');
									li.className = 'mui-table-view-cell';
									html += '<div class="formbox-bd"><div class="pic">';
									if(data.object.records[i].strHeadImgPath==""){
										html+='<img src="../images/tzgg.png"></div>'
									}else{
										html+='<img src="'+data.object.records[i].strHeadImgPath+'"></div>'
									}
									html += '<div class="text"><div class="name">'+data.object.records[i].strRealName+'</div><div class="time">'+new Date(data.object.records[i].dtCreate).toLocaleDateString().replace(/\//g,"-")+'</div><div class="text_content">'
									if(ClassStyle.state==1){
										html += '<div class="text_padding">'+data.object.records[i].strContent+'</div><ul class="mui-table-view mui-grid-view mui-grid-9 text_pic">'
										for(var j = 0; j < data.object.records[i].imgList.length; j++) {
											if(data.object.records[i].imgList.length>0){
												switch (data.object.records[i].imgList.length) {
												case 1:
													html+='<li class="mui-table-view-cell mui-media mui-col-xs-12 mui-col-sm-12">'
													break;
												case 2:
													html+='<li class="mui-table-view-cell mui-media mui-col-xs-6 mui-col-sm-6">'
													break;
												default:
													html+='<li class="mui-table-view-cell mui-media mui-col-xs-4 mui-col-sm-4">'
													break;
												}
												imgList.push(data.object.records[i].imgList[j].strImagePath);
												html += '<img  data-lazyload="'+data.object.records[i].imgList[j].strImagePath+'" data_img='+data.object.records[i].imgList[j].strImagePath+'></li>'
											}
										}
										if(localStorage.getItem("iRoleID")=="7"){
											html += '</ul><div class="text_read"></div></div></div></div>'
										}else{
											html += '</ul><div class="text_read"><a href="javaScript:" class="drop" data_uidAlbumH5Id='+data.object.records[i].uidAlbumH5Id+'>删除</a></div></div></div></div>'
										}
									}else if(ClassStyle.state==2){
										html += '<div class="text_padding">'+data.object.records[i].strHonorName+'</div><ul class="mui-table-view mui-grid-view mui-grid-9 text_pic">'
										if(data.object.records[i].strImagePath!=undefined){
											html+='<li class="mui-table-view-cell mui-media mui-col-xs-6 mui-col-sm-6"><img  data-lazyload="'+data.object.records[i].strImagePath+'" data_img='+data.object.records[i].strImagePath+'></li>'
										}
										if(localStorage.getItem("iRoleID")=="7"){
											html += '</ul><div class="text_read"></div></div></div></div>'
										}else{
											html += '</ul><div class="text_read"><a href="javaScript:" class="drop" data_uidAlbumH5Id='+data.object.records[i].uidHonorId+'>删除</a></div></div></div></div>'
										}
									}
									li.innerHTML = html
									$(".mui-table-view")[0].appendChild(li)
							}
							if(data.object.pageCount>1){
								ClassStyle.page++;
							}
							mui('#pullrefresh').pullRefresh().endPullupToRefresh(( ++count>= pageCount));
							sessionStorage.clear()
							mui(".text_pic").imageLazyload({
								placeholder: '../images/60x60.gif',
								autoDestroy: true
							});
							setTimeout(()=>{
								base.setImgHeight();
							},50)
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
						base.dialog({
							type:"2",
							title:"",
							text:`系统错误，请联系管理员!${data.status}`,
							flag:true,
							success:()=>{
							}
						});
							/*location.replace(base.getContextPath()+'/h5/error.html')*/
					}
				});
			},200)
		}
		if(mui.os.plus) {
			mui.plusReady(function() {
					mui('#pullrefresh').pullRefresh().pullupLoading();
			});
		} else {
			mui.ready(function() {
				mui('#pullrefresh').pullRefresh().pullupLoading();
			});
		}
	},
	initPage: function() {
		/*获取url中传过来的值*/
		switch(base.getUrlParmas()) {
			case "1":
				ClassStyle.state=1;
				$("#html_title").html("班级风采")
				break;
			case "2":
				ClassStyle.state=2;
				$("#html_title").html("班级荣誉")
				break;
		}
		if(base.allotRoot()=="5"||base.allotRoot()=="7") {
			$(".header").css("display", "none")
			$("#pullrefresh").css("top", ".5rem")
		} else {
			var response=base.getListGrade(base.getUidUserId());
			if(response.readyState==4&&response.status==200){
				var text=JSON.parse(response.responseText)
				var html=""
					for(var i=0;i<text.object.length;i++){
						html+='<li data_uidgradeid='+text.object[i].uidGradeId+'>'+text.object[i].strGradeName+'</li>'
					}
				$(".grade_ui").html(html)
			}else{
				base.dialog({
					type:"2",
					title:"",
					text:"获取数据异常",
					flag:true,
					success:()=>{
					}
				});
			}
			$(".header").css("display", "block")
		}
	},
	/*用户删除操作*/
	drop:function(uidAlbumH5Id,ev){
		var sendUrl="";
		var sendData="";
		if(ClassStyle.state==1){
			sendUrl=base.getContextPath()+'/control/h5/classalbum/deleteAlbumH5.htm';
			sendData="uidAlbumH5Id="+uidAlbumH5Id+"&uidUserId="+base.getUidUserId();
		}else if(ClassStyle.state==2){
			sendUrl=base.getContextPath()+'/control/h5/classhonor/deleteClassHonorH5.htm';
			sendData="uidHonorId="+uidAlbumH5Id+"&uidUserId="+base.getUidUserId();
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
			ClassStyle.page=1;
			ClassStyle.upLoad();
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
						ClassStyle.drop(that.attr("data_uidAlbumH5Id"),that);
						base.Toast("loading","删除中...",true);
					}
				});
		})
	},
	init: function() {
		base.verifyUser();
		base.getWxConfig();
		this.initPage();
		this.upLoad();
		this.bindAll();
		this.hrefNewPage();
		this.allClose();
		/*this.picBig();*/
	}
}
$(function() {
	ClassStyle.init();
})