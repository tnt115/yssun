var classDuty = {

	initPage: function() {
		if(base.allotRoot()=="7") {
			$(".mui-navigate-right").attr("href","javaScript:");
			$(".mui-table-view-cell a").removeClass("mui-navigate-right")
		}else{
			$(".header").css("display","block")
		}
		base.dataList(classDuty);
	},
	/*查询指定班级的值日信息*/
	getClassdutyOp:function(){
		$.ajax({
			type:"POST",
			url:base.getContextPath()+'/control/h5/classduty/findClassDutyInfoH5.htm',
			data:"uidUserId="+base.getUidUserId()+"&uidClassId="+sessionStorage.getItem("uidClassId"),
			dataType:"JSON",
			success:function(data){
				if(data.success){
					$("#errorMsg").css("display","none")
					var week=['一','二','三','四','五','六','日'];
					var html="";
					for(var i=0;i<7;i++){
						html+='<li class="mui-table-view-cell">';
						html+='<a class="mui-navigate-right" href="javaScript:" wewkDay=星期'+week[i]+'>星期'+week[i]+'</a></li>'
					}
					$(".list>ul").html(html)
					for(var j=0;j<data.object.length;j++){
						let name=data.object[j].strRealName==undefined?"":data.object[j].strRealName
						$(".list>ul .mui-navigate-right").eq(data.object[j].iWeek-1).append('<span data_uidUserId='+data.object[j].uidUserId+'>'+name+'</span>')
						}
					/*if(localStorage.getItem("iRoleID")!=undefined){
						if(localStorage.getItem("iRoleID")=="7"){
							$(".mui-table-view-cell").find("a").removeClass("mui-navigate-right")
						}
					}*/
					
				}else{
					base.dialog({
						type:"1",
						title:"错误提示",
						text:"获取数据失败!",
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
	/*绑定当前页面所有的事件*/
	bindAll:function(){
			$(".btn").on("click",function(){
				if($(".Class_word").attr("data_uidgradeid")==undefined){
					base.dialog({
						type:"2",
						title:"",
						text:"请选择班级!",
						flag:true,
						success:()=>{
							
						}
					});
					return false
				}else{
					sessionStorage.setItem("uidClassId",$(".Class_word").attr("data_uidgradeid"))
					classDuty.getClassdutyOp();
				}
			})
			$(".list>ul").on("tap",".mui-navigate-right",function(){
				var userIdlist=[];
				for(var i=0;i<$(this).find("span").length;i++){
					userIdlist.push($(this).find("span").eq(i).attr("data_uidUserId"));
				}
				sessionStorage.setItem("userIdlist",userIdlist);
				sessionStorage.setItem("weekDay",$(this).attr("wewkday"))
				location.replace('allStudent.html?week='+($(this).parent().index()+1))
			})
	},
	init: function() {
		this.initPage();
		this.bindAll();
	}
}
$(function() {
	classDuty.init()
})