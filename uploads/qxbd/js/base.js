var base = {
	setBodyFont: function() {
		var winWidth = $(window).width();
		var size = (winWidth / 750) * 100;　　
		/*document.documentElement.style.fontSize = '50px';*/
		document.documentElement.style.fontSize=(size>100?100:size)+"px";
	},
	
	formatDateTime:function(inputTime) {    
	    var date = new Date(inputTime);  
	    var y = date.getFullYear();    
	    var m = date.getMonth() + 1;    
	    m = m < 10 ? ('0' + m) : m;    
	    var d = date.getDate();    
	    d = d < 10 ? ('0' + d) : d;    
	    var h = date.getHours();  
	    h = h < 10 ? ('0' + h) : h;  
	    var minute = date.getMinutes();  
	    var second = date.getSeconds();  
	    minute = minute < 10 ? ('0' + minute) : minute;    
	    second = second < 10 ? ('0' + second) : second;   
	    return y + '-' + m + '-' + d+' '+h+':'+minute+':'+second;    
	},
	
	/*点击显示下及目录*/
	toggle: function() {
		$(".Class_word,.grade_word").on("click", function(event) {
			event.stopPropagation();
			event.preventDefault()
			if(event.delegateTarget.className=="Class_word"&&$(".grade_word").attr("data_uidgradeid")==undefined){
				base.dialog({
					type:"2",
					title:"",
					text:"请先选择年级!",
					flag:true,
					success:()=>{
					}
				});
				return false
			}
			$(".msg").css("display", "none")
			$(this).next().show();
			$("#scale").unbind("click");
			$("#scale").css({
				"display": "none",
				"background": "none"
			}).fadeIn(400)
			$("body").addClass("socrllHide");
		})
		$(".grade_ui,.Class_ui").on("tap","li",function(event) {
			event.stopPropagation();
			event.preventDefault();
			$("#scale").css({
				"display": "none",
				"background": "none"
			});
			var uidGradeId=$(this).attr("data_uidgradeid");
			$(this).parents(".msg").fadeOut(400).prev().attr("data_uidgradeid",uidGradeId).text($(this).text())
			if(event.delegateTarget.className=="grade_ui"){
			$(".Class_word").removeAttr("data_uidgradeid").text("班级");
			var response=base.getListLlass(base.getUidUserId(),uidGradeId);
			if(response.readyState==4&&response.status==200){
				var text=JSON.parse(response.responseText)
				var html=""
					for ( var int = 0; int < text.object.length; int++) {
						html+='<li data_uidgradeid='+text.object[int].uidClassId+'>'+text.object[int].strClassName+'</li>'
					}
				$(".Class_ui").html(html);
			}else{
				base.dialog({
					type:"2",
					title:"",
					text:"获取数据异常!",
					flag:true,
					success:()=>{
					}
				});
			}
		}
			/*$(this).parents(".msg").fadeOut(400).prev().attr("data_uidgradeid",uidGradeId).text($(this).text())*/
		})
	},
	getUidUserId:function(){
		return "19b44c3b78c145c3a955a4ce74b3e261";
	},
	
	customBtn: function() {
		$(".div_checkbox").each(function() {
			if($(this).find("input").prop("checked")) {
				$(this).find(".lab_checkbox").addClass("ggtoleback")
			}
		});
		$(".div_checkbox input").click(function() {
			$(this).next().toggleClass("ggtoleback")
		})
	},
	/*点击空白处关闭所有的弹出层*/
	/*获取url中传过来的值*/
	allClose: function(ev) {
		$("#scale").on("click touchstart", function(event) {
			event.stopPropagation();
			event.preventDefault();
			$(".header_left").css("z-index", "666")
			$("#scale").css("display", "none").html("");
			$("body").removeClass("socrllHide");
			$(".msg").fadeOut(400);
		})

	},
	getUrlParmas: function() {
		var url = location.search;
		return url.substring(url.indexOf("=") + 1, url.length);
	},
	/*返回一个指定dom模型*/
	specifiedDom: function() {
		var li="";
		var response=base.getListGrade(base.getUidUserId());
		if(response.readyState==4&&response.status==200){
			var text=JSON.parse(response.responseText)
			var html = ""
				for(var i=0;i<text.object.length;i++){
					li+='<li data_uidGradeId='+text.object[i].uidGradeId+'>'+text.object[i].strGradeName+'</li>'
				}
				html += '<div class="header clearFix"><ul class="header_left clearFix"><li class="grade"><span class="grade_word">年级</span>'
				html += '<div class="msg"><i class="arr-top"><img src="../images/Secondpage/ClassStyle/sanjiaoxing.png"></i><ul class="grade_ui">'
				html+=li
				html += '</ul></div></li>'
				html += '<li class="Class"><span class="Class_word">班级</span><div class="msg"><i class="arr-top"><img src="../images/Secondpage/ClassStyle/sanjiaoxing.png"></i>'
				html += '<ul class="Class_ui"></ul></div></li><li class="btn"></li></ul><div class="header_right"><a href="javaScript:"><span>发布</span></a></div></div>'
				return html
		}else{
			base.dialog({
				type:"2",
				title:"",
				text:"获取数据异常!",
				flag:true,
				success:()=>{
				}
			});
		}
	},
 
	/*获取根路径*/
	getContextPath: function() {
		var pathName = document.location.pathname;
		var index = pathName.substr(1).indexOf("/");
		var result = pathName.substr(0, index + 1);
		return result;
	},
	/*获取url传过来的值*/
	GetQueryString:function(name) {
		var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
		var r = window.location.search.substr(1).match(reg);
		if(r != null) return(r[2]);
		return null;
	},
	
	
	/*获取学校*/
	getListSchoolN:function(uidUserId,serverId,mobilePhone){
		return $.ajax({
			type: "post",
			url: base.getContextPath() + '/school/getSchoolList.do',
			data: "uidUserId="+uidUserId+"&serverId="+serverId+"&mobilePhone="+mobilePhone,
			async: false,
			success: function(data) {
				return data
			},
			error: function(data, xhm) {
				base.dialog({
					type:"2",
					title:"",
					text:`系统错误，请联系管理员!${data.code}`,
					flag:true,
					success:()=>{
					}
				});
			}
		});
	},
	
	/*获取年级列表*/
	getListGradeN:function(uidUserId,serverId,mobilePhone,iSchoolId){
		return $.ajax({
			type: "post",
			url: base.getContextPath() + '/school/getGradeList.do',
			data: "uidUserId="+uidUserId+"&serverId="+serverId+"&mobilePhone="+mobilePhone+"&iSchoolId="+iSchoolId,
			async: false,
			success: function(data) {
				return data
			},
			error: function(data, xhm) {
				base.dialog({
					type:"2",
					title:"",
					text:`系统错误，请联系管理员!${data.code}`,
					flag:true,
					success:()=>{
					}
				});
			}
		});
	},
	
	
	/*获取年级列表*/
	getListGrade:function(uidUserId){
		return $.ajax({
			type: "post",
			url: base.getContextPath() + '/control/h5/grade/listGrade.htm',
			data: "uidUserId="+uidUserId,
			async: false,
			success: function(data) {
				return data
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
			}
		});
	},
	
	getListLlassN:function(uidUserId,serverId,mobilePhone,iSchoolId,iGradeId){
		return $.ajax({
			type: "post",
			url: base.getContextPath() + '/school/getClassList.do',
			data: "uidUserId="+uidUserId+"&serverId="+serverId+"&mobilePhone="+mobilePhone+"&iSchoolId="+iSchoolId+"&iGradeId="+iGradeId,
			async: false,
			success: function(data) {
				return data
			},
			error: function(data, xhm) {
				base.dialog({
					type:"2",
					title:"",
					text:`系统错误，请联系管理员!${data.code}`,
					flag:true,
					success:()=>{
					}
				});
			}
		});
	},
	
	/*获取班级列表*/
	getListLlass:function(uidUserId,uidGradeId){
		return $.ajax({
			type: "post",
			url: base.getContextPath() + '/control/h5/class/listByGradeId.htm',
			data: "uidUserId="+uidUserId+"&uidGradeId="+uidGradeId,
			async: false,
			success: function(data) {
				return data
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
			}
		});
	},
	 
	/**
	 * 获取自定义时间
	 *  time   需要自定义的时间戳
	 *  type   false  只取系统时间
	 *         true   取带周的时间
	 */
	getDateTime:function(type,time){
		var date;
		if(time!=undefined){
			date=new Date(time);
		}else{
			date=new Date();
		}
		var week=["周日","周一","周二","周三","周四","周五","周六"];
		var today=new Date().getDate();
		var Year=date.getFullYear();
		var Month=date.getMonth()+1;
		var hours=date.getHours();
		var Minutes=date.getMinutes()<10?"0"+date.getMinutes():date.getMinutes();
		if(type){      //获取带周的时间
			if(today==date.getDate()){
				return parseInt(hours)+":"+Minutes;
			}else if(today-date.getDate()==1){
				return "昨天 "+parseInt(hours)+":"+Minutes;
			}else if(today-date.getDate()<=new Date().getDay()){
				return week[date.getDay()]+" "+parseInt(hours)+":"+Minutes;
			}else{
				return Year+"-"+Month+"-"+date.getDate()+" "+parseInt(hours)+":"+Minutes;
			}
		}else{
			return Year+"-"+Month+"-"+date.getDate()+" "+parseInt(hours)+":"+Minutes;
		}
	},
	/*选择用户组，手机底部选择器*/
	bomSelect:function(that,data,select){
		var userPicker = new mui.PopPicker();
				userPicker.setData(data);
						userPicker.show(function(items) {
							that.firstChild.nextSibling.innerText = items[0].text
							that.firstChild.nextSibling.style.cssText = "color: #646464;"
							$(that).children().attr("data_uid",items[0].value)
							if(select){
								$(".showUserPicker:eq(1)").children().removeAttr("data_uid").html("请选择").css("color","#ccc")
								select.getListLlass(items[0].value)
							}
							userPicker.dispose()
						});
						$(".mui-backdrop")[0].addEventListener('tap', function(event) {
							userPicker.dispose()
						})
				mui('.mui-poppicker-header .mui-btn')[0].addEventListener('tap', function(event) {
					userPicker.dispose()
				})
				
	},
	  obj2string: function(o){ 
		 var r=[]; 
		 if(typeof o=="string"){ 
		 return "\""+o.replace(/([\'\"\\])/g,"\\$1").replace(/(\n)/g,"\\n").replace(/(\r)/g,"\\r").replace(/(\t)/g,"\\t")+"\""; 
		 } 
		 if(typeof o=="object"){ 
		 if(!o.sort){ 
		  for(var i in o){ 
		  r.push(i+":"+base.obj2string(o[i])); 
		  } 
		  if(!!document.all&&!/^\n?function\s*toString\(\)\s*\{\n?\s*\[native code\]\n?\s*\}\n?\s*$/.test(o.toString)){ 
		  r.push("toString:"+o.toString.toString()); 
		  } 
		  r="{"+r.join()+"}"; 
		 }else{ 
		  for(var i=0;i<o.length;i++){ 
		  r.push(base.obj2string(o[i])) 
		  } 
		  r="["+r.join()+"]"; 
		 } 
		 return r; 
		 } 
		 return o.toString(); 
    },
	bomSelectN:function(that,data,select,index){
		var userPicker = new mui.PopPicker();
				userPicker.setData(data);
						userPicker.show(function(items) {
							that.firstChild.nextSibling.innerText = items[0].text
							that.firstChild.nextSibling.style.cssText = "color: #646464;"
							$(that).children().attr("data_uid",items[0].value)
							if(index==1){
								if(items[0].value==undefined){
									$(".showUserPicker:eq(0)").children().removeAttr("data_uid").html("请选择").css("color","#ccc")
									select.removeStudentItem();
								}else{
									select.getListGrade(items[0].value)
									select.removeStudentItem();
								}
								
							}else if(index==2){//年级
								if(items[0].value==undefined){
									$(".showUserPicker:eq(1)").children().removeAttr("data_uid").html("请选择").css("color","#ccc")
									$(".showUserPicker:eq(2)").children().removeAttr("data_uid").html("请选择").css("color","#ccc")
									select.removeStudentItem();
								}else{
									select.getListLlass($(".showUserPicker:eq(0)").children().attr("data_uid"),items[0].value)
									select.removeStudentItem();
								}
							}else if(index==3){//班级
								if(items[0].value==undefined){
									$(".showUserPicker:eq(2)").children().removeAttr("data_uid").html("请选择").css("color","#ccc")
									
									select.removeStudentItem();
								}else{
									//根据学校，班级 ，查询学生列表
									select.getStudentList($(".showUserPicker:eq(0)").children().attr("data_uid"),items[0].value);	
								}
							}
//							if(select==1){
//								$(".showUserPicker:eq(1)").children().removeAttr("data_uid").html("请选择").css("color","#ccc")
//								select.getListLlass(items[0].value)
//							}
//							else if(select==2){
//								$(".showUserPicker:eq(1)").children().removeAttr("data_uid").html("请选择").css("color","#ccc")
//								select.getListLlass(items[0].value)
//							}
							 
							userPicker.dispose()
						});
						$(".mui-backdrop")[0].addEventListener('tap', function(event) {
							userPicker.dispose()
						})
				mui('.mui-poppicker-header .mui-btn')[0].addEventListener('tap', function(event) {
					userPicker.dispose()
				})
				
	},
	 
	/**
	 * true 显示
	 * false 隐藏
	 * 自定义加载动画*/ 
	customAnimation:function(word,flag){
		setTimeout(function(){
			if(flag){
				$("#bigGround").css("display","block")
				$("body").addClass("onsrcoll")
			}else{
				$("#bigGround").css("display","none");
				$("body").removeClass("onsrcoll")
				return false
			}
			$("#bigGround").css({"width": $(window).width(),"height": $(window).height()})
			$("#loadingdiv_word").text(word);
			$("#loadingdiv").css({"margin-left":"-"+$("#loadingdiv_word").width()/2+"px","margin-top":"-"+$("#loadingdiv_word").height()/2+"px"})
		},200)
	},
	   
	/**
	 * Toast
	 *  
	 *  type="loading"    type="toast"
 	 *   
 	 *   text   提示文字
 	 *   
 	 *   flag  true显示 false隐藏并删除
	 */
	Toast(type,text,flag){
		if(flag){
			$("#Toast").remove();
			var _class="";
			switch (type) {
			case "loading":
				_class="weui-loading"
				break;
			case "toast":
				_class="weui-icon-success-no-circle";
				break;
			}
			var html='<div id="Toast"><div class="weui-mask_transparent"></div>';
	        html+='<div class="weui-toast"><i class="weui-icon_toast '+_class+'"></i>';
	        html+='<p class="weui-toast__content">'+text+'</p></div></div>'
	        $("body").append(html)
	        return "#Toast";
		}else{
			$("#Toast").fadeOut(200,function(){
				$(this).remove();
			})
		}
	},
	/**
	 * 提示层
	 *    type="1"   type="2"  
	 * 	   title    //标题
 	 *     text     //内容
 	 *   	flag  true显示 false隐藏并删除
	 */
	dialog(params){
			if(params.flag){
				$("#iosDialog").remove();
				var e,m;
				var html=' <div class="js_dialog" id="iosDialog" >';
				html+=' <div class="weui-mask"></div>';
				html+='<div class="weui-dialog">';
				switch (params.type) {
				case "1":
					e='<div class="weui-dialog__hd"><strong class="weui-dialog__title">'+params.title+'</strong></div>'
					m='<a href="javascript:;" class="weui-dialog__btn weui-dialog__btn_default" id="dialog__btn_default">取消</a> <a href="javascript:;" class="weui-dialog__btn weui-dialog__btn_primary" id="dialog__btn_primary">确定</a>';
					break;
				case "2":
					m='<a href="javascript:;" class="weui-dialog__btn weui-dialog__btn_primary " id="woDo">知道了</a>';
					break;
				}
				  if(e){
					  html+=e;
				  }
		          html+='<div class="weui-dialog__bd">'+params.text+'</div>';
		          html+='<div class="weui-dialog__ft">';
		          html+=m;
		          html+='</div></div></div>';
		          $("body").append(html);
		          $("#dialog__btn_default,#woDo").click(function(){
		        	  $("#iosDialog").fadeOut(200);
		          })
		          $("#dialog__btn_primary").click(function(){
		        	  $("#iosDialog").fadeOut(200);
		        	  params.success();
		          })
			}else{
				$("#iosDialog").fadeOut(200,function(){
					$(this).remove();
				})
			}
	},
	/**
	 * 二次封装的ajax
	 */
	ajax(object,show){
		if(show==undefined){
			base.Toast("loading","请稍后...",true);
		}
		$.ajax({
			type: "post",
			url: object.sendUrl,
			data: object.sendData,
			processData:object.noFrom,
			contentType:object.noFrom==true?"application/x-www-form-urlencoded":object.noFrom,
			async: object.flag,
			success:(data)=>{
				base.Toast("loading","请稍后...",false);
				if(data.success){
					object.fun(data)
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
	init: function() {
		this.setBodyFont();
		this.toggle();
		this.allClose();
	}
}
$(function() {
	base.init();
    var ua = navigator.userAgent.toLowerCase();
    var isWeixin = ua.indexOf('micromessenger') != -1;
    var isAndroid = ua.indexOf('android') != -1;
    var isIos = (ua.indexOf('iphone') != -1) || (ua.indexOf('ipad') != -1);
     /*if (!isWeixin) {
         document.head.innerHTML = '<title>抱歉，出错了</title><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1, user-scalable=0"><link rel="stylesheet" type="text/css" href="https://res.wx.qq.com/connect/zh_CN/htmledition/style/wap_err1a9853.css">';
         document.body.innerHTML = '<div class="page_msg"><div class="inner"><span class="msg_icon_wrp"><i class="icon80_smile"></i></span><div class="msg_content"><h4>请在微信客户端打开链接</h4></div></div></div>';
     }*/
	
})