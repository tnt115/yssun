var Attendance={
		toDayMonth:null,
		getAttendanceByMonth:function(data){
			var errors=[];
			var normal=[];
			var lack=[];
			var state=[];
			var future=[];
			var kq=0;
			$(".mui-table-view").html("")
			$.ajax({
				type: "post",
				url: base.getContextPath() + '/control/h5/attendancestatis/getAttendanceByMonthH5.htm',
				data: "uidUserId="+base.getUidUserId()+"&strDayMonth="+data,
				async: true,
				success: function(data) {
					Attendance.toDayMonth=(new Date().getMonth()+1)<10?(`0${new Date().getMonth()+1}`):(new Date().getMonth()+1);
					var toDay=+new Date(new Date().getFullYear()+"-"+Attendance.toDayMonth+"-"+new Date().getDate());  //当前时间戳
					for(var i=0;i<data.object.length;i++){
						var str={};
						str.signin_first=data.object[i].signin_first;
						str.signin_last=data.object[i].signin_last;
						state.push(str);
						if(data.object[i].isArryInKq=="0"){    //非考勤
							errors.push(i);
						}
						if(data.object[i].iStatus=="1"){   //正常
							normal.push(i) 
						}
						if(data.object[i].iStatus=="2"){   //缺勤
							lack.push(i)   
						}
						if((new Date($("#check_user_data").attr("data_date")+"-"+data.object[i].iDate))-toDay>0){  //将来之后
							future.push(i)
						}
					}
					$(".Sign").text(new Date().getDate());
					$(".kq").text(normal.length);
					Attendance.setState(errors,normal,lack,state,future);
					if(new Date($("#check_user_data").attr("data_date"))-new Date(new Date().getFullYear()+"-"+Attendance.toDayMonth)!=0){
						Attendance.show(null)
					}else{
						let toShow=localStorage.getItem("signInTime")==null?(new Date().getDate()-1):(new Date(+localStorage.getItem("signInTime")).getDate()-1)
						Attendance.show(null,toShow)
					}
				},
				error: function(data, xhm) {
						location.replace(base.getContextPath()+'/h5/error.html')
				}
			});
			
		},
		/*显示当前月份的天数*/
		showMonth:function(year,month){
			var d= new Date(year,month,0); 
			var day=d.getDate();
			d.setDate(1);
			var week=d.getDay();
			var html='<tbody><tr><th>周日</th><th>周一</th><th>周二</th><th>周三</th><th>周四</th><th>周五</th><th>周六</th></tr>';
			for(var i=0,j=1;j<=day;i++){
				if(i%8==0){
					if(i!=0){
						html+='</tr>'
					}else{
						html+='<tr>'
					}
				}else{
					if(i<=week){
						html+='<td>&nbsp;</td>';
					}else{
						html+='<td data_index=0'+j+' class="now"><span >'+j+'</span></td>'
						j++
					}
				}
			}
			html+='</tbody>';
			$("table").html(html);
			this.bindAll();
			this.getAttendanceByMonth($("#check_user_data").attr("data_date"));
		},
		/*给td设置状态*/
		setState:function(errors,normal,lack,state,future){
			$(".now").each(function(index){
				$(this).find("span").attr("signin_first",state[index].signin_first);
				$(this).find("span").attr("signin_last",state[index].signin_last);
				$(".now").eq(errors[index]).find("span").addClass("errors")
				$(".now").eq(normal[index]).find("span").addClass("normal")
				$(".now").eq(lack[index]).find("span").addClass("lack")
				$(".now").eq(future[index]).find("span").addClass("future")
			})
		},
		bindAll:function(){
			$("table").on("click","span",function(){
				Attendance.show(this)
			});
			$(".weui-footer__link").click(()=>{
				location.replace(base.getContextPath()+'/h5/index.html')
			})
/*			$("#calendar").on("swiperight",function(){ //上翻
				$("#calendar table").animate({"left":"7rem"},200,function(){
					$("#check_user_data").attr("data_date",new Date().getFullYear()+"-"+month)
					$("#check_user_data").attr("data_y",new Date().getFullYear())
					$("#check_user_data").attr("data_m",month)
				})
			})*/
		},
		/**
		 * 初始化显示表格
		 * @param obj   要突出的当前对象
		 * @param index  要突出的当前索引
		 */
		show:function(obj,index){
			var signin_first,signin_last;
			$("table span").css({"font-size":".3rem","color":"#000"})
			if(obj!=null&&new Date($("#check_user_data").attr("data_date"))-new Date(new Date().getFullYear()+"-"+Attendance.toDayMonth)<=0){
				$(obj).css({"font-size":".4rem","color":"#000"})
				signin_first=$(obj).attr("signin_first")==undefined?" ":$(obj).attr("signin_first");
				signin_last=$(obj).attr("signin_last")==undefined?" ":$(obj).attr("signin_last")
			}else{
				$("table span:eq("+index+")").css({"font-size":".4rem","color":"#000"})
				signin_first=$("table span:eq("+index+")").attr("signin_first")==undefined?" ":$("table span:eq("+index+")").attr("signin_first");
				signin_last=$("table span:eq("+index+")").attr("signin_last")==undefined?" ":$("table span:eq("+index+")").attr("signin_last")
			}
			var html='';
			html+='<li class="mui-table-view-cell"><a href="javaScript:" class=""><span class="slotCard">到校:'+signin_first+'</span><span class="data"></span></a></li>';
			html+='<li class="mui-table-view-cell"><a href="javaScript:" class=""><span class="slotCard">离校:'+signin_last+'</span><span class="data"></span></a></li>'
			$(".mui-table-view").html(html)
		},
		//		初始化页面
		initPage:function(){
			var ImagePath,userName;
			if(base.GetQueryString("type")!=null){   //用户从微信公众号推送模板点进来   //1表示家长    2表示老师
				localStorage.setItem("wechat_accesstoken",base.GetQueryString("wechat_accesstoken"));
				localStorage.setItem("wx_openid",base.GetQueryString("wx_openid"));
				localStorage.setItem("uidStudentId",base.GetQueryString("uidStudentId"));
				localStorage.setItem("uidParentId",base.GetQueryString("uidParentId"));
				localStorage.setItem("signInTime",base.GetQueryString("signInTime"));
					$.ajax({
						type: "post",
						url: base.getContextPath() + '/control/h5/users/getUserInfo.htm',
						data: "uidUserId="+base.GetQueryString("uidStudentId"),
						async: true,
						success: function(data) {
							ImagePath=data.object.strImagePath==null?undefined:data.object.strImagePath;
							userName=data.object.strRealName;
							let iRoleID=+data.object.iRoleID==6?"7":data.object.iRoleID;
							let state=+data.object.iRoleID>5?"1":"0";
							localStorage.setItem("iRoleID",iRoleID)
							localStorage.setItem("state",state)
							addShowMonth();
						},
						error: function(data, xhm) {
							mui.toast(`系统错误，请联系管理员`+data.status);
						}
					});
			}else{    //用户从正常流程进入
				if(localStorage.getItem("ImagePath")!=null){
					ImagePath=localStorage.getItem("ImagePath")
				}
				if(localStorage.getItem("userName")!=null){
					userName=localStorage.getItem("userName")
				}
				addShowMonth();
			}
			function addShowMonth(){
				$(".check_user_left>img").attr("src",ImagePath);
				$(".check_userName").text(userName);
				$("#check_user_data")[0].innerText=new Date().getFullYear()+"年"+Number(new Date().getMonth()+1)+"月";
				var month=(new Date().getMonth()+1)<10?`0${(new Date().getMonth()+1)}`:(new Date().getMonth()+1);
				$("#check_user_data").attr("data_date",new Date().getFullYear()+"-"+month)
				$("#check_user_data").attr("data_y",new Date().getFullYear())
				$("#check_user_data").attr("data_m",month)
				Attendance.showMonth(new Date().getFullYear(),Number(new Date().getMonth()+1));
				Attendance.getAttendanceByMonth($("#check_user_data").attr("data_date"));
			}
		},
		init:function(){
			this.initPage();
		}
}
$(function(){
	Attendance.init();
})
