var detailed={
		setContent:function(){
			var sendUrl=""
			var sendData=""
				switch (base.GetQueryString("state")) {
				case "6":
					$("#pageTitle").text("学校介绍")
					sendUrl=base.getContextPath()+'/control/h5/cyschoolintroduce/getSchoolIntroduceH5ById.htm';
					sendData="uidUserId="+base.getUidUserId()+'&uidIntroduceId='+base.GetQueryString("uidId");
					break;
				case "7":
					$("#pageTitle").text("学校新闻")
					sendUrl=base.getContextPath()+'/control/h5/cyschoolnews/getSchoolNewsH5ById.htm';
					sendData="uidUserId="+base.getUidUserId()+'&uidNewsId='+base.GetQueryString("uidId");
					break;
				case "4":
					$("#pageTitle").text("班级通知")
					sendUrl=base.getContextPath()+'/control/h5/cyclassnotice/getClassNoticeH5ById.htm';
					sendData="uidUserId="+base.getUidUserId()+'&uidNoticeId='+base.GetQueryString("uidId");
					break;
				case "8":
					$("#pageTitle").text("学校通知");
					sendUrl=base.getContextPath()+'/control/h5/cyschoolnotice/getSchoolNoticeH5ById.htm';
					sendData="uidUserId="+base.getUidUserId()+'&uidNoticeId='+base.GetQueryString("uidId");
					base.getPushParmas("schoolnotice");
					break;
				case "9":    //用户点击微信推送消息过来的
					if(base.GetQueryString("notice_from")=="class"){    
						$("#pageTitle").text("班级通知");
						sendUrl=base.getContextPath()+'/control/h5/cyclassnotice/getClassNoticeH5ById.htm';
					}else{   
						$("#pageTitle").text("学校新闻")
						sendUrl=base.getContextPath()+'/control/h5/cyschoolnews/getSchoolNewsH5ById.htm';
					}
					if(base.GetQueryString("type")=="1"){         //1表示家长 
						localStorage.setItem("uidParentId",base.GetQueryString("uidParentId"));
						localStorage.setItem("uidStudentId",base.GetQueryString("uidStudentId"));
					}else if(base.GetQueryString("type")=="2"){   // 2表示教师
						localStorage.setItem("uidTeacherId",base.GetQueryString("uidTeacherId"));
					}
					sendData="uidUserId="+base.getUidUserId()+'&uidNoticeId='+base.GetQueryString("uidId");
					break;
				}
			$.ajax({
				type:"POST",
				url:sendUrl,
				data:sendData,
				dataType:"JSON",
				success:function(data){
					if(data.success){
						$(".rich_media").text(data.object.strTitle)
						$(".title_name").text(data.object.strPublicName)
						$(".title_time").text(base.getDateTime(false,data.object.dtCreate))   //获取自定义的系统时间
						$(".textAndPic").append(data.object.strContent)
						$(".weui-footer").css("display","block");
					}else{
						base.dialog({
							type:"2",
							title:"",
							text:data.object,
							flag:true,
							success:()=>{
								location.replace(base.getContextPath()+'/h5/index.html')
							}
						});
					}
				},
				error: function(data, xhm) {
						location.replace(base.getContextPath()+'/h5/error.html')
				}
			})
			
		},
		/**
		 * 绑定图片点击 用微信sdk  预览图片
		 */
		previewImage(){
			$(".textAndPic").on("tap","img",function(){
				let src= $(this).attr("src");
				let imgList=[];
				$(".textAndPic img").each(function(){
					imgList.push($(this).attr("src"));
				})
				wx.previewImage({
				    current:src, 
				    urls:imgList,
				});
			})
		},
		bind(){
			$(".weui-footer__link").click(()=>{
				location.replace(base.getContextPath()+'/h5/index.html')
			})
		},
		init:function(){
			base.getWxConfig();
			base.verifyUser();
			this.bind();
			this.setContent();
			this.previewImage();
		}
}
$(function(){
	detailed.init();
})
