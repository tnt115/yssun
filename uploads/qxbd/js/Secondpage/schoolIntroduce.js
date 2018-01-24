var schoolIntroduce={
		page:1,
		sendUrl:"",
	skipNewPage:function(){
		$(".text_read a").click(function(){
			location.href=$(this).attr("href")
		})
		$(".posted").click(function(){
			location.replace($(this).parent().attr("href"))
		})
		if(base.allotRoot()=="5"||base.allotRoot()=="7"||base.allotRoot()=="4"){
				$(".all_header").css("display","none")
				$("#pullrefresh").css("top",".5rem")
			}else{
				$(".all_header").css("display","block")
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
		var count = 0;
		var pageCount=0
		function pullupRefresh() {
			setTimeout(function() {
				   $.ajax({
						type: "post",
						url:schoolIntroduce.sendUrl,
						data:"uidUserId="+base.getUidUserId()+"&pageNow="+schoolIntroduce.page,
						async:false,
						success: function(data) {
							if(data.success){
								pageCount=data.object.pageCount
								mui('#pullrefresh').pullRefresh().endPullupToRefresh(( ++count>= pageCount));
								var article_list = document.getElementById('pullrefresh').getElementsByClassName('mui-scroll')[0];
								// 根据模板将数据渲染成 HTML
								var html = template('home-template', {'items':data.object.records});
								//wd-日期更改
						
								// 将 HTML 插入到列表后
								article_list.innerHTML += html;
								
//								for(var i=0;i<data.object.records.length;i++){
//									//把每个数据对象的内容放在div块中进行获取文字和内容
//									$("#testVal").html(data.object.records[i].strContent)
//									var val=$("#testVal").text().substring(0,100);
//									if($("#testVal").text().length>100){
//										val+='...'
//									}
//									var html = "";
//									var li = document.createElement('li');
//									li.className = 'mui-table-view-cell';
//									html += '<div class="formbox-bd"><div class="pic">';
//									if(data.object.records[i].strHeadImgPath==""){
//										html+='<img src="../../images/tzgg.png"></div>'
//									}else{
//										html+='<img src="'+data.object.records[i].strHeadImgPath+'"></div>'
//									}
//									html += '<div class="text"><div class="name">'+data.object.records[i].strTitle+'</div><div class="time">'+new Date(data.object.records[i].dtCreate).toLocaleDateString().replace(/\//g,"-")+'</div><div class="text_content">'
//									html += '<div class="text_padding">'+val+'</div><ul class="mui-table-view mui-grid-view mui-grid-9 text_pic">'
//									$("#testVal img").each(function(){
//										html += '<li class="mui-table-view-cell mui-media mui-col-xs-4 mui-col-sm-4"><img data-preview-src="" data-preview-group="'+i+'" data-lazyload="'+$(this).attr("src")+'"></li>'
//									})
//									if(base.getUrlParmas()=="6"){
//										li.setAttribute("data_uidIntroduceId",data.object.records[i].uidIntroduceId);
//										if(localStorage.getItem("iRoleID")=="3"){
//											html += '</ul><div class="text_read"><a href="javaScript:"  data_uidIntroduceId='+data.object.records[i].uidIntroduceId+' >阅读全文</a><a href="javaScript:" class="drop" data_uidAlbumH5Id='+data.object.records[i].uidIntroduceId+'>删除</a></div></div></div></div>'
//										}else{
//											html += '</ul><div class="text_read"><a href="javaScript:"  data_uidIntroduceId='+data.object.records[i].uidIntroduceId+' >阅读全文</a></div></div></div></div>'
//										}
//									}else{
//										li.setAttribute("data_uidIntroduceId",data.object.records[i].uidNewsId);
//										if(localStorage.getItem("iRoleID")=="3"){
//											html += '</ul><div class="text_read"><a href="javaScript:"  data_uidIntroduceId='+data.object.records[i].uidNewsId+' >阅读全文</a><a href="javaScript:" class="drop" data_uidAlbumH5Id='+data.object.records[i].uidNewsId+'>删除</a></div></div></div></div>'
//										}else{
//											html += '</ul><div class="text_read"><a href="javaScript:"  data_uidIntroduceId='+data.object.records[i].uidNewsId+' >阅读全文</a></div></div></div></div>'
//										}
//									}
//									li.innerHTML = html
//									$(".mui-table-view")[0].appendChild(li)
//							}
								if(data.object.pageCount>1){
									schoolIntroduce.page++;
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
	drop:function(uidAlbumH5Id,ev){
		var sendUrl=""
		var sendData=""
		if(base.getUrlParmas()=="6"){
			sendUrl=base.getContextPath()+'/control/h5/cyschoolintroduce/deleteSchoolIntroduceH5.htm';
			sendData="uidUserId="+base.getUidUserId()+'&uidIntroduceId='+uidAlbumH5Id;
		}else{
			sendUrl=base.getContextPath()+'/control/h5/cyschoolnews/deleteSchoolNewsH5.htm'; 
			sendData="uidUserId="+base.getUidUserId()+'&uidNewsId='+uidAlbumH5Id;
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
						text:'删除失败',
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
	/*跳转到新页面*/
	hrefNewPage: function() {
		//阅读全文
		$("#pullrefresh").on("tap",".text_read a",function() {
			window.location.href = '../detailed.html?uidId='+$(this).attr("data_uidIntroduceId")+"&state="+base.getUrlParmas();
		})
		$("body").on("tap",".mui-table-view-cell",function(){
			window.location.href = '../detailed.html?uidId='+$(this).attr("data_uidIntroduceId")+"&state="+base.getUrlParmas();
		})
	},
	initPage: function() {
		if(true){
			schoolIntroduce.sendUrl= "http://localhost:9182/elecSecurity/eduHomework/getTestList2.do";
			$("#html_title").text("学校介绍")
			return;
		}
		/*获取url中传过来的值*/
		switch(base.getUrlParmas()) {
			case "6":
				schoolIntroduce.sendUrl= base.getContextPath()+'/control/h5/cyschoolintroduce/findSchoolIntroduceH5ByPage.htm';
				$("#html_title").text("学校介绍")
				break;
			case "7":
				schoolIntroduce.sendUrl= base.getContextPath()+'/control/h5/cyschoolnews/findSchoolNewsH5ByPage.htm';
				$("#html_title").text("学校新闻")
				break;
		}
	},
	/*绑定当前页面所有js的事件*/
	bindAll:function(){
		$(".mui-table-view:eq(0)").on("touchstart",".drop",function(event){
			event.stopPropagation();
			let that=$(this);
			base.dialog({
				type:"1",
				title:"友情提示",
				text:"确定要删除?",
				flag:true,
				success:()=>{
					schoolIntroduce.drop(that.attr("data_uidAlbumH5Id"),that);
					base.Toast("loading","删除中...",true);
					return false;
				}
			});
		})
		$(".all_header").on("touchstart",function(){
			location.replace('postedSchoolIntroduce.html?state='+base.getUrlParmas())
		})
	},
	/**
	 * 绑定图片点击 用微信sdk  预览图片
	 */
//	previewImage(){
//		$("body").on("tap",".text_pic img",function(event){
//			event.preventDefault();
//			 event.cancelBubble=true;
//			 event.stopPropagation();
//			let src= $(this).attr("src");
//			let imgList=[];
//			$(this).parents(".text_pic").find("img").each(function(){
//				imgList.push($(this).attr("src"));
//			})
//			wx.previewImage({
//			    current:src, 
//			    urls:imgList,
//			});
//		})
//	},
	init:function(){
		//base.verifyUser();
		//base.getWxConfig();
		this.initPage();
		//this.skipNewPage();
		this.upLoad();
		this.bindAll();
		
		//this.hrefNewPage();
		//this.previewImage();
	}
}
$(function(){
	schoolIntroduce.init()
})
