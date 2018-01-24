var syllabus={
	SubjectList:[],
	/*dialog:function(){
			$(".day").css("display","block")
			document.getElementById("btn").addEventListener('tap', function() {
				mui.alert('修改成功!', function() {
				});
			});	
	},*/
	/*获取课程列表*/
	getSubjectList:function(){
		$.ajax({
			type:"post",
			url:base.getContextPath()+'/control/h5/classmgr/subjectList.htm',
			data:"uidUserId="+base.getUidUserId(),
			async:true,
			success:function(data){
				if(data.success){
					syllabus.SubjectList.push({
						text:"(空)",
						value:"",
					})
					for(var i=0;i<data.object.length;i++){
						syllabus.SubjectList.push({
							text:data.object[i].strSubjectName,
							value:data.object[i].uidSubjectId
						})
					}
				}else{
					mui.toast(data.object);
				}
				
			},
			error:function(data){
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
	/*设置底部选择菜单*/
	/**
	 * flag   参数 
	 *       true  //初始化课表选择器
	 *       false   //初始化时间选择器
	 */
	setBomSelect:function(that,flag){
		var userPicker=null;
		if(flag){
			userPicker= new mui.PopPicker();
			userPicker.setData(syllabus.SubjectList);
		}else{
			if($(that).prev().hasClass("DtPicker")&&$(that).prev().val()!=""){
				var inputVal=$(that).prev().val().split(":");
				userPicker= new mui.DtPicker({
				    type: "time",//设置日历初始视图模式 
				    beginDate: new Date(2015, 04, 25,+inputVal[0],(+inputVal[1]+1)),//设置开始日期 
				    endDate: new Date(2015, 04, 25,23,59),//设置结束日期 
				});
			}else{
				userPicker= new mui.DtPicker({
					type:'time',
				});
			}
		}
				userPicker.show(function(items) {
					var data="";
					if(flag){
						data=items[0];
						if(data.text=="(空)"){
							that.childNodes[0].innerText=""
							$(that).children().removeAttr("subjectId");
						}else{
							that.childNodes[0].innerText=data.text;
							$(that).children().attr("subjectId",data.value)
						}
						that.childNodes[0].style.cssText = "color: #646464;"
					}else{
						data=items;
						$(that).val(data);
					}
				});
		
	},
	/*保存课程表*/
	joinSubject:function(){
		var sendData="";
		var status=2;    //状态判断
		//遍历课表信息，拼接成传给后台的数据
		for(var i=1;i<=$(".ul").length-1;i++){
			sendData+="&itemVo["+(i-1)+"].iLesson="+i+"";
			$(".ul:eq("+i+") li a").each(function(index){
				if($(this).text()!=""){
					sendData+='&itemVo['+(i-1)+'].subjectIdWeek'+(index+1)+'='+$(this).attr("subjectId")+'';
				}else{
					sendData+='&itemVo['+(i-1)+'].subjectIdWeek'+(index+1)+'=null';
				}
			})
		}
		//遍历通栏信息
		$(".day .rest").each(function(index){
			sendData+='&titleVo['+index+'].strTitle='+$(this).find(".left").text().trim();
			sendData+='&titleVo['+index+'].iLessonAfter='+($(this).prev().index()-index);
		})
		//遍历课时
		function userStatus(){
			
		}
		$(".ul").each(function(index){
			if(index!=0){ 
				var userFlag=0;
				var strStartTime=$(this).find(".DtPicker").eq(0).val();
				if($(this).find(".DtPicker").eq(0).val()==""){
					strStartTime="null";
					userFlag++;
				}
				var strEndTime=$(this).find(".DtPicker").eq(1).val();
				if($(this).find(".DtPicker").eq(1).val()==""){
					strEndTime="null";
					userFlag++;
				}
				if(userFlag==1){
					mui.toast(`请设置完整的时间段,位置:第${index}节课`);
					userStatus.prototype.status=userFlag;
					return false;
				}
				sendData+=`&itemVo[${index-1}].strStartTime=${strStartTime}`;
				sendData+=`&itemVo[${index-1}].strEndTime=${strEndTime}`;
			}
		})
		var userStatus = new userStatus();
		if(userStatus.status!=undefined){
			return false;
		}
		var mask = mui.createMask();//callback为用户点击蒙版时自动执行的回调；
		mask.show();//显示遮罩
		$(".mui-backdrop").addClass("mui-backdrop_user")
		$.ajax({
			type:"post",
			url:base.getContextPath()+'/control/h5/classmgr/saveScheduleInfoEtH5.htm',
			data:"uidUserId="+base.getUidUserId()+"&uidClassId="+sessionStorage.getItem("uidClassId")+sendData,
			async:true,
			success:function(data){
				mask.close();//关闭遮罩
				$(".mui-backdrop").removeClass("mui-backdrop_user")
				if(data.success){
					window.location.replace("syllabus.html?index=3")
				}else{
					mui.toast(data.object);
				}
				
			},
			error:function(){
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
	//新增一行
	addnew:function(){
		let html="<ul class='ul dropP'>";
		for ( var int = 0; int < 9; int++) {
				if(int==0){
					html+='<li class="showUserPicker">'+$(".ul").length+'</li>';
				}else if(int==1){
						html+='<li class="showDtPicker"><input class="DtPicker"/> -- <input class="DtPicker"/></li>';
				}else{
					html+='<li class="showUserPicker"><a class="mui-navigate-right" href="javaScript:"></a></li>';
				}
		}
		html+='<li><button type="button" data-loading-text="删除中" class="mui-btn mui-btn-warning drop">删除</button></li>';
		$('.day').append(html);
	},
	//计算课时变化
	publicComput:function(){
		$(".ul:not(:nth-child(1))").each(function(index){
			$(this).find("li").eq(0).text(index+1)
		})
	},
	/*绑定所有的事件*/
	allBind:function(){
		$("#btn").on("click",function(){
			syllabus.joinSubject()
			return false;
		})
		//课程表 课程选择器 点击及绑定
		$('.day').on('tap', ".showUserPicker",function(event) {
			syllabus.setBomSelect(this,true)
		})
		//课程表 时间选择器 点击及绑定
		$('.day').on('tap', ".DtPicker",function(event) {
			if($(this).prev().hasClass("DtPicker")&&$(this).prev().val()==""){
				mui.toast("请优先设置开始时间");
				return false;
			}else{
				syllabus.setBomSelect(this,false)
			}
		})
		//新增一行
		$("#addnew").on("click",function(){
			syllabus.addnew();
		})
		//删除
		$(".day").on("click",".drop",function(){
			if($(this).parents(".dropP").prev().hasClass("rest")&&$(this).parents(".dropP").next().hasClass("rest")){
				mui.toast("删除失败，不能同时安排多个通栏");
				return false;
			}
			$(this).parents(".dropP").remove();
			/*重新排列课时*/
			syllabus.publicComput();
		})
		//上移
			$(".day").on("click",".doUp",function(){
				if($(this).parents(".rest").prev().hasClass("default")){
					return false;
				}
				mui(this).button('loading');
				let that=this;
				setTimeout(function(){
					mui(that).button('reset');
						var objParentTR = $(that).parents(".rest")
						var prevTR = objParentTR.prev();
							if(prevTR.prev().hasClass("rest")){
								mui.toast("不能同时安排多个通栏！")
								return 
							}
						prevTR.insertAfter(objParentTR);
						syllabus.publicComput();
					},500)
			})
			//下移
			$(".day").on("click",".doDown",function(){
				if($(this).parents(".rest").next().hasClass("default")){
					return false;
				}
				mui(this).button('loading');
				let that=this;
				setTimeout(function(){
					mui(that).button('reset');
					var objParentTR = $(that).parents(".rest");
					var nextTR = objParentTR.next();
						if(nextTR.next().hasClass("rest")){
							mui.toast("不能同时安排多个通栏！")
							return 
						}
					nextTR.insertBefore(objParentTR);
					syllabus.publicComput();
				},500)
			})
			//新增通栏
			$("#addbanner").click(function(){
				if($($(".day")[0].lastChild).hasClass("rest")){
					mui.toast("不能同时安排多个通栏！")
					return 
				}
				mui.prompt('请输入通栏名称','请输入通栏名称','',['确定','取消'],function(e){
					if (e.index == 0) {
						if(e.value==""){
							mui.toast("通栏名称不能为空！")
							return false
						}
						$(".day").append('<div class="rest clearFix dropP"><div class="left">'+e.value+'</div><div class="right"><button type="button" class="mui-btn mui-btn-primary updata">修改</button><button type="button" data-loading-text="上移中" class="mui-btn mui-btn-userDo doUp">上移</button><button type="button" data-loading-text="下移中" class="mui-btn mui-btn-userDo doDown">下移</button><button type="button" data-loading-text="删除中" class="mui-btn mui-btn-warning drop">删除</button></div></div>')
					}
				},'div') 
			})
			//修改通栏名称
			$(".day").on("click",".updata",function(){
				var that=$(this);
				mui.prompt('请输入新通栏名称','请输入要修改的通栏名称',"",['确定','取消'],function(e){
					if (e.index == 0) {
						if(e.value==""){
							mui.toast("通栏名称不能为空！")
							return false
						}
						that.parents(".rest").find(".left").text(e.value);
					}
				},'div') 
			})
	},
	init:function(){
		base.verifyUser();
		/*this.dialog();*/
		base.getParams(false);
		this.getSubjectList();
		this.allBind();
	},
}
$(function(){
	syllabus.init();
})
