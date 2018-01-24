;var postedSchoolIntroduce={
		countImg:50,
		localId:[],
		imgList: [],
		uidImgResIds:[],
		/*发布操作*/
		saveClassNotice:function(){
			var senData=""
			if($("#user").val()==""){
				base.dialog({
					type:"2",
					title:"",
					text:"发布人不能为空!",
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
					text:"通知标题不能为空!",
					flag:true,
					success:()=>{
						
					}
				});
				return false
			}else if($("#strTitle").val().length>60){
				base.dialog({
					type:"2",
					title:"",
					text:"通知标题不能超过60个字!",
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
					text:"通知内容不能为空!",
					flag:true,
					success:()=>{
						
					}
				});
				return false
			}
			senData+='uidUserId='+base.getUidUserId()+"&strTitle="+$("#strTitle").val()+"&strPublicName="+$("#user").val();
			if(postedSchoolIntroduce.localId.length>0){
				var strContent=$("#strContent").val();
				for(var i=0;i<postedSchoolIntroduce.imgList.length;i++){
					strContent+='<br/><img src='+postedSchoolIntroduce.imgList[i]+'>';
				}
			senData+='&uidImgResIds='+postedSchoolIntroduce.uidImgResIds+""+"&strContent="+strContent;
			}else{
				senData+='&strContent='+$("#strContent").val();
			}
			postedSchoolIntroduce.sendAjax(senData)
		},
		/*点击发布的时候发送数据到后端*/
		sendAjax:function(senData){
			var sendUrl=""
				switch (base.GetQueryString("state")) {
				case "6":
					sendUrl=base.getContextPath()+'/control/h5/cyschoolintroduce/saveSchoolIntroduceH5.htm';
					break;
				case "7":
					sendUrl=base.getContextPath()+'/control/h5/cyschoolnews/saveSchoolNewH5.htm';
					break;
				}
			base.Toast("loading","正在发布...",true);
			$.ajax({
				type: "post",
				url: sendUrl,
				data: senData,
				async: true,
				success: function(data) {
					if(data.success){
						location.replace("schoolIntroduce.html?index="+base.GetQueryString("state"))
					}else{
						base.Toast("loading","正在发布...",false);
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
		},
		/*点击拍照*/
		getPicture:function(){
			mui('body').on('tap', '.Features li>a', function(event) {
				var a = this,parent;
				for (parent = a.parentNode; parent != document.body; parent = parent.parentNode) {
					if (parent.classList.contains('mui-popover-action')) {
						break;
					}
				}
				mui('#' + parent.id).popover('toggle');
				var type=[];
				switch ($(this).parent().index()){
					case 0:
						type.push("camera");
						break;
					case 1:
						type.push("album");
						break;
				}
				wx.chooseImage({
				    count: postedSchoolIntroduce.computCount(), 
				    sizeType: ['original'], 
				    sourceType:type, 
				    success: function (res) {
				        var localIds = res.localIds; 
				        for(var i=0;i<localIds.length;i++){
				        	 $(".pic").append('<img src="'+localIds[i]+'" data-preview-src="" data-preview-group="1" >')
				        	  postedSchoolIntroduce.localId.push(localIds[i]);
				        }
				        postedSchoolIntroduce.upImg();
				        postedSchoolIntroduce.countImg-=localIds.length;
				        postedSchoolIntroduce.computCount();
				        postedSchoolIntroduce.setImgWidth();
				        
				    }
				});
			})
		},
		setImgWidth:function(){
			$(".pic>img").css({"width":$(".pic a").width(),"height":$(".pic a").width()})
		},
		/*计算用户选择的照片数量*/
		computCount:function(){
			if(postedSchoolIntroduce.countImg==0){
				 $(".pic a").css("display","none");
				 return 0
			}else{
				$(".pic a").css("display","inline-block");
				return postedSchoolIntroduce.countImg
			}
		},
		upImg:function(){
		    var i = 0, length = postedSchoolIntroduce.localId.length;
		    base.Toast("loading","正在上传...",true);
		    function upload() {
		      wx.uploadImage({
		    	isShowProgressTips:0,
		        localId: postedSchoolIntroduce.localId[i],
		        success: function (res) {
		          i++;
					$.ajax({
						type: "post",
						url: base.getContextPath()+'/control/h5/cyschoolintroduce/uploadWxImage.htm',
						data: 'uidUserId='+base.getUidUserId()+"&wechat_accesstoken="+localStorage.getItem("wechat_accesstoken")+"&media_id="+res.serverId,
						async: false,
						success: function(data) {
							if(data.success){
								postedSchoolIntroduce.imgList.push(data.object.strImagePath);
								postedSchoolIntroduce.uidImgResIds.push(data.object.uidImageId)
							}else{
								base.dialog({
									type:"2",
									title:"",
									text:"上传图片失败!",
									flag:true,
									success:()=>{
										$(".pic").eq(i).remove()
									}
								});
							}
						},
						error: function(data, xhm) {
								location.replace(base.getContextPath()+'/h5/error.html')
						}
					});
		          if (i < length) {
		            upload();
		          }else{
		        	  base.Toast("loading","正在上传...",false);
		          }
		        },
		        fail: function (res) {
		        	console.log(JSON.stringify(res));
		        }
		      });
		    }
		    upload();
		},
		/*绑定所有的方法*/
		allBind:function(){
			$("#btn").on("click",function(){
				postedSchoolIntroduce.saveClassNotice();
			})
			$(".default").on("click",function(){
				$("#strContent,input").blur();
			})
		/*浏览图片的时候删除图片操作*/
		$(".mui-preview-header").append('<img src="../../images/Secondpage/ClassStyle/drop.png" id="drop">')
		$(".mui-preview-header").on("click","#drop",function(event){
			event.stopPropagation();
			base.dialog({
				type:"1",
				title:"友情提示",
				text:"确定要删除?",
				flag:true,
				success:()=>{
					var index=$(".mui-preview-indicator")[0].innerText.substring(0,1)-1;
					$(".pic>img").eq(index).remove();
					postedSchoolIntroduce.localId.splice(index,1)
					postedSchoolIntroduce.imgList.splice(index,1)
					postedSchoolIntroduce.uidImgResIds.splice(index,1)
					postedSchoolIntroduce.countImg+=1;
					postedSchoolIntroduce.computCount();
					previewImage.close();
				}
			});
			
		})
		},
		initPage:function(){
			switch (base.GetQueryString("state")) {
			case "6":
				$("#html_title").html("学校介绍")
				break;
			case "7":
				$("#html_title").html("学校新闻")
				break;
			}
		},
		init:function(){
			base.verifyUser();
			base.getWxConfig();
			this.initPage();
			this.allBind();
			this.getPicture();
		}
}
$(function(){
	postedSchoolIntroduce.init();
})