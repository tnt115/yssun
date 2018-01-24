const viewPublishJob={
		getParams(){
			base.Toast("loading","请稍后...",true);
			$.ajax({
				type: "post",
				url: base.getContextPath()+'/control/h5/cyclasshomework/getClassHomeworkH5ById.htm',
				data: "uidHomeworkId="+base.GetQueryString("uidHomeworkId"),
				async: true,
				success:(data)=>{
					console.log(data)
					base.Toast("loading","请稍后...",false);
					if(data.success){
						$("#subject").val(data.object.cySubject.strSubjectName)   //发布科目
						$("#time").val(base.getDateTime(false,data.object.cyClassHomework.dtCreate))        //发布时间 ;
						let cyClass="";
						for(let item of data.object.cyClass){
							cyClass+=" "+data.object.cyGrade.strGradeName+''+item.strName+","
						}
						$("#object").text(cyClass.substring(0,cyClass.length-1))   //发布对象
						$("#teacher").val(data.object.cyClassHomework.strPublisher)    //发布老师
						var html='<p style="font-size:18px;color: #323232;font-weight: bold;">'+data.object.cyClassHomework.strTitle+'</p>';
						$(".mui-card-content-inner").html(html+""+data.object.cyClassHomework.strContent); //内容
						//$("#title").text(data.object.cyClassHomework.strTitle)   //title
					}else{ 
						mui.toast(data.object);	
					}
					
				},
				error:(data, xhm)=>{
					base.Toast("loading","请稍后...",false);
					base.dialog({
						type:"2",
						title:"",
						text:`系统错误，请联系管理员!${data.status}`,
						flag:true,
						success:()=>{
						}
					});
				}
			});
		},
		initPage(){
			/*if(base.GetQueryString("title")!=null){
				$("#title").text(unescape(base.GetQueryString("title")))
			}*/
			if(base.GetQueryString("wechat_accesstoken")!=null){
				localStorage.setItem("wechat_accesstoken",base.GetQueryString("wechat_accesstoken"));
				localStorage.setItem("wx_openid",base.GetQueryString("wx_openid"));
				localStorage.setItem("uidStudentId",base.GetQueryString("uidStudentId"));
				localStorage.setItem("uidParentId",base.GetQueryString("uidParentId"));
				localStorage.setItem("iRoleID",base.GetQueryString("iRoleID"));
			}
			$(".weui-footer__link").click(()=>{
				location.replace(base.getContextPath()+'/h5/index.html')
			})
		},
		init(){
			this.initPage();
			this.getParams();
		}
}
$(()=>{
	viewPublishJob.init();
})