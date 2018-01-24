var index_ = {
		start:0,
		count:10,
		headimgurl:null,
		msg_list:[],
	/* 绑定相机功能,和相册功能 */
	CameraAndPhotos: function() {
		$("#carme,#photos").click(function(ev) {
			var type_ = "image";
			var info = [];
			var id = ev.target.getAttribute("id")
			var type = [];
			if(id == "carme") {
				type.push("camera")
			} else {
				type.push("album");
			}
			wx.chooseImage({
				count: 1, // 默认9
				sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有 此为压缩图
				sourceType: type, // 可以指定来源是相册还是相机，默认二者都有
				success: function(res) {
					info[3] = res.localIds; // 返回选定照片的本地ID列表，localId可以作为img标签的src属性显示图片
					info[0]=base.getDateTime(true);
					info[1]=index_.headimgurl;
				      wx.uploadImage({
				          localId: info[3]+"",
				          isShowProgressTips:1,
				          success: function (res) {
				        	  info[4]=res.serverId;
				        	  $(".mui-table-view").append(index_.createNode(info, type_));
				            index_.cb();
				          },
				          fail: function (res) {
				        	  console.log("调用图片及相机错误！")
				        	  console.log(JSON.stringify(res));
				          }
				        });
				}
			});
		})
	},
	/* 给输入框绑定一个改变事件，输入框有值改变时候，改变按钮背景 */
	bindChange: function() {
		$("#msg-text").on("input propertychange", function() {
			if($("#msg-text").html() != "") {
				$(".send").attr("disabled", false)
			} else {
				$(".send").attr("disabled", true)
			}
		})
	},
	/* 点击发送用户填写的内容 */
	clickSend: function() {
		$("#send").click(function() {
			var info = [];
			var type = "text";
			info[3] = $("#msg-text").html();
			info[0]=base.getDateTime(true);
			info[1]=index_.headimgurl;
			$(".mui-table-view").append(index_.createNode(info, type));
			$("#msg-text").html("").focus();
			$(".send").attr("disabled", true)
			index_.cb();
		})
	},
	/* 绑定用户点击语音按钮,是否开始录音，出现录音块 */
	clickRecord: function() {
		$("#msg-type").on("click",function() {
			$("#msg-text").html("");
			index_.saveRange();
			$(this).css("background","none")
			if($("#msg-sound").css("display") == "none") {
				$("#msg-sound").css("display", "block");
			} else {
				$("#msg-sound").css("display", "none");
			}
		})
	},
	/* 绑定用户点击开始录音操作 */
	bindSV: function() {
		var html = "";
		var startDate = 0;
		var endDate = 0;
		var dateCount = 60;
		var info = [];
		var type = "voice";
		var stop=null;
		var count = 0;
		var yesTop=0;
		var startX, startY, moveEndX, moveEndX;
		$("#msg-sound").on("touchstart",function(event) {
			if(count!=0)return false
			$("#loader").css("display", "block");
			startDate = new Date().getTime();
			window.event? window.event.cancelBubble = true : e.stopPropagation();
			event.preventDefault();
			if($("#more_icon_action").css("display")=="block"){
				$("#loader").css("margin-top","-85px")
			}else{
				$("#loader").css("margin-top","-45px")
			}
			startX = event.originalEvent.changedTouches[0].pageX;
			startY = event.originalEvent.changedTouches[0].pageY;
			wx.startRecord({
				success: function() {
					$("#msg-sound").html('送开发送')
							stop = setInterval(function() {
								dateCount--;
								if(dateCount <= 10) {
									$("#textWarn").html("你还可以说"+dateCount+"秒");
								}
								if(dateCount ==0){
									clearInterval(stop);
								}
					}, 1000)
				},
				complete: function() {
		              clearInterval(stop)
		          }
			});
			wx.onVoiceRecordEnd({
				complete: function(res) {
					info[3] = res.localId;
					info[0]=base.getDateTime(true);
					info[1]=index_.headimgurl;
					$("#loader").css("display", "none");
					clearInterval(stop)
					index_.vioceStop(info, type)
				}
			});
			count++;
		})
		$("#msg-sound").on("touchmove",function(e){
		 	moveEndX = e.originalEvent.changedTouches[0].pageX,
			moveEndY = e.originalEvent.changedTouches[0].pageY,
			X = moveEndX - startX,
			Y = moveEndY - startY;

		/* 向下滑动 */
		if(Y > -50) {
			$("#textWarn").text("上滑,取消发送");
			yesTop=Y
			/* 向上滑动 */
		} else if(Y < 0) {
			/* 滑动的时候确保只执行一次 */
			if(Y<-50){
				$("#textWarn").text("松开手取消发送");
			}
			yesTop=Y
		}
		e.stopPropagation();
		return false;
		})
		$("#msg-sound").on("touchend",function(){
			endDate = new Date().getTime();
			clearInterval(stop);
			if(yesTop<-50){
				$("#msg-sound").html("按住说话")
				$("#textWarn").text("上滑,取消发送");
				$("#loader").css("display", "none");
				wx.stopRecord({
					success: function(res) {
						stopRecord(res,false)
						return false
					},
				});
			}else{
				if(endDate - startDate < 1000) {
					$("#textWarn").html("说话时间太短!");
					setTimeout(function(){
						$("#msg-sound").html("按住说话")
						$("#textWarn").text("上滑,取消发送");
						$("#loader").css("display", "none");
					},500)
					wx.stopRecord({
						success: function(res) {
							stopRecord(res,false)
							return false
						},
					});
				}else{
					wx.stopRecord({
						success: function(res) {
							stopRecord(res,true)
							return false
						},
					});
				}
			}
		})
		function stopRecord(res,flag){
			if(flag){
				info[3] = res.localId;
				info[0]=base.getDateTime(true);
				info[1]=index_.headimgurl;
				index_.vioceStop(info, type)
				$("#msg-sound").html("按住说话")
				$("#textWarn").text("上滑,取消发送");
			}
			dateCount=60;
			startDate = 0;
			endDate = 0;
			yesTop=0;
			count=0;
		}
	},
	/* 绑定用户聊天语音说话动画 */
	bindVoice: function() {
		$(".mui-table-view").on("tap",".ovoice", function() {
			playVoice($(this),"othersAnimation")
		});
		$(".mui-table-view").on("tap",".svoice",function() {
			playVoice($(this),"shefAnimation")
		})
		function playVoice(this_,Class){
			var VoiceSrc = this_.find(".vCotent").attr("data-voice");
			wx.downloadVoice({
			    serverId: VoiceSrc,
			    isShowProgressTips: 0, 
			    success: function (res) {
			    	this_.find(".vCotent").addClass(Class);
			    	wx.playVoice({
						localId: res.localId
					});
			    	/* 监听播放录音完成 */
					wx.onVoicePlayEnd({
						complete: function(res) {
							this_.find(".vCotent").removeClass(Class);
						}
					});
			    },
			});
		}
	},
	/* 绑定用户在发信息时加载更多的按钮 */
	clickAddMore: function() {
		$("#msg-image").click(function(e) {
			index_.addMoreAnimt(false)
			e.preventDefault();
			return false;
		})
	},
	/**
	 * true 自动关闭 false 系统判断
	 */
	addMoreAnimt:function(flag){
		if(flag){
			$("#bottom").animate({
				"bottom": "0px"
			}, 200, function() {
				$("#msg-image").css("background-color", "#FAFAFA").css("color", "#000")
				$("#more_icon_action").css("display", "none");
			});
		}else{
			if($("#bottom").css("bottom") == "40px") {
				$("#bottom").animate({
					"bottom": "0px"
				}, 200, function() {
					$("#msg-image").css("background-color", "#FAFAFA").css("color", "#000")
					$("#more_icon_action").css("display", "none");
				});
			} else {
				$("#msg-image").css("background-color", "#007AFF").css("color", "#fff")
				$("#more_icon_action").css("display", "block");
				$("#bottom").animate({
					"bottom": "40px"
				}, 200);
			}
		}
	},
	/* 在判断用户在输入框点击的时候放滚动条滚动到底部 */
	scrollBottom: function() {
		$("#msg-text").on("tap",function() {
			index_.addMoreAnimt(true);
			setTimeout(()=>{
				index_.cb();
			},390)
		})
	},
	/* 录音完成后要改变的内容 */
	vioceStop: function(info, type) {
		$("#loader").css("display", "none");
		$("body,html").removeClass("socrllHide");
		$("#msg-sound").html('按住说话');
		$("#textWarn").html("上滑，取消发送").css("color", "#fff");
		index_.createNode(info, type);
		index_.cb();
	},
	/* 动态生成节点内容 */
	createNode: function(info, type) {
		// info数组：0为时间，1为聊天头像地址，2为学生姓名，3为内容信息地址,4上传到服务器的media_id
		if(type == "voice"){
			wx.uploadVoice({
			        localId: info[3],
			        isShowProgressTips:1,
			        success: function (res) {
			    		var html = "";
			    		html += '<li>';
			    		html += '<p class="time"><span>' + info[0] + '</span></p>';
			    		html += '<div class="shef">';
			    		html += '<div class="pic"><img src="' + info[1] + '" width="30" height="30" /></div>';
			    		html += '<div class="chat"><div class="name"></div>';
			    		if(type == "voice") {
			    			html += '<div class="text" ><a class="voice svoice"><div class="vCotent" data-voice = "' + res.serverId + '"></div></a>'
			    		} else if(type == "image") {
			    			html += '<div class="text"><img src="' + info[3] + '" data-preview-group="0" data-preview-src/></div>';
			    		} else if(type == "text") {
			    			html += '<div class="text">' + info[3] + '</div>';
			    		}
			    		html += "</div></div></li>";
			    		$(".mui-table-view").append(html)
			    		info[4]=res.serverId;
			    		uploadSelfSever(info,type)
			        }
			      });
		}else{
			var html = "";
    		html += '<li>';
    		html += '<p class="time"><span>' + info[0] + '</span></p>';
    		html += '<div class="shef">';
    		html += '<div class="pic"><img src="' + info[1] + '" width="30" height="30" /></div>';
    		html += '<div class="chat"><div class="name"></div>';
    		if(type == "image") {
    			html += '<div class="text"><img src="' + info[3] + '" data-preview-group="0" data-preview-src/></div>';
    		} else if(type == "text") {
    			html += '<div class="text">' + info[3] + '</div>';
    		}
    		html += "</div></div></li>";
    		uploadSelfSever(info,type)
    		return html;
		}
		/* 上传信息到自己服务器 */
		function uploadSelfSever(info,type){
			var senData="wx_openid="+localStorage.getItem("wx_openid")+"&msg_type="+type;
			if(type=="text"){
				senData+="&msg="+info[3]
			}else{
				senData+="&msg="+info[4]
			}
			$.ajax({
				type:"post",
				url:base.getContextPath()+'/control/h5/wechatmsg/sendmsg.htm',
				data:senData,
				success:function(data){
					if(!data.success){
						$('#pullrefresh ul>li:last').remove();
						mui.toast('消息发送失败！');
					}
					
				},
				error:function(data,xhm){
					base.dialog({
						type:"2",
						title:"",
						text:`系统错误，请联系管理员!`,
						flag:true,
						success:()=>{
						}
					});
				}
			})
		}
	},
	/* 从微信端获取消息内容 */
	WxServerGetData:function(){
		var count=0;
		var msg_count=0;
		mui.init({
			pullRefresh: {
				container: '#pullrefresh',
				down: {
					 auto: true,
					callback: pulldownRefresh
				},
			}
		});
		function pulldownRefresh() {
			/*
			 * if(count>0){ if(index_.count>msg_count){
			 * pullRefresh.down.contentrefresh="没有更多数据了"
			 * mui('#pullrefresh').pullRefresh().disablePullupToRefresh(); } }
			 */
			$.ajax({
				type:"post",
				url:base.getContextPath()+'/control/h5/wechatmsg/showmsg.htm',
				data:"wx_openid="+localStorage.getItem("wx_openid")+"&start="+index_.start+"&count="+index_.count,
				dataType:"JSON",
				success:function(data){
					if(data.success){
						count++;
						msg_count=data.object.msg_count
						if(data.object.msg_count>index_.start){
							if(index_.start+10>data.object.msg_count){
								index_.start+=data.object.msg_count-index_.start;
							}else{
								index_.start+=10;
							}
						}
						for(var i=data.object.msg_list.length-1;i>=0;i--){
							var html = "";
							html += '<li>';
							html += '<p class="time"><span>' +base.getDateTime(true,data.object.msg_list[i].create_timestamp)+ '</span></p>';
							if(data.object.msg_list[i].flag==1){  // 家长
								html += '<div class="shef">';
								html += '<div class="pic"><img src="' + data.object.parent_info[0].headimgurl+ '" width="30" height="30" /></div>';
								index_.headimgurl=data.object.parent_info[0].headimgurl
							}else if(data.object.msg_list[i].flag==2){ // 学生
								html += '<div class="others">';
								if(localStorage.getItem("ImagePath")!=undefined){
									html += '<div class="pic"><img src="' + localStorage.getItem("ImagePath") + '" width="30" height="30" /></div>';
								}else{
									html += '<div class="pic"><img src="../../images/avatar.png" width="30" height="30" /></div>';
								}
							}
							if(data.object.msg_list[i].flag==2){
								html += '<div class="chat"><div class="name">' + localStorage.getItem("userName") + '</div>';
							}else{
								html += '<div class="chat"><div class="name"></div>';
							}
							switch (data.object.msg_list[i].msg_type) {
							case "image":
								html += '<div class="text"><img src="' +  data.object.msg_list[i].remote_file + '" data-preview-group="0" data-preview-src/></div>';
								break;
							case "voice":
										if(data.object.msg_list[i].flag==1){  // 家长
											html += '<div class="text"><a class="voice svoice"><div class="vCotent" data-voice = "' + data.object.msg_list[i].msg+ '"></div></a>'
										}else if(data.object.msg_list[i].flag==2){ // 学生
											html += '<div class="text"><a class="voice ovoice"><div class="vCotent" data-voice = "' + data.object.msg_list[i].msg+ '"></div></a>'
										}
								break;
							case "text":
								html += '<div class="text">' +  data.object.msg_list[i].msg + '</div>';
								break;
							}
							html += "</div></div></li>";
							$('.mui-table-view').prepend(html);
						}
						
						mui('#pullrefresh').pullRefresh().endPulldownToRefresh(true)
						$(".mui-scrollbar").remove()
						/* mui('#pullrefresh').pullRefresh().setStopped(index_.count>data.object.msg_count); */
					}else{
						base.dialog({
							type:"2",
							title:"",
							text:data.object,
							flag:true,
							success:()=>{
								location.replace(base.getContextPath()+'/h5/error.html')
							}
						});
					}
				},
				error:function(data,xhm){
						location.replace(base.getContextPath()+'/h5/error.html')
				}
			})
		}
	},
	/* 内容滚动到底部 */
	cb: function() {
		mui('.mui-scroll-wrapper').scroll().reLayout();
		mui('.mui-scroll-wrapper').scroll().scrollToBottom(0.1);
/*
 * mui('.mui-scroll-wrapper').scroll().reLayout();
 * mui('.mui-scroll-wrapper').scroll().scrollToBottom(300);
 */
	},
	// 光标失焦
    saveRange() {
        var selection = window.getSelection ? window.getSelection() : document.selection;
        if (!selection.rangeCount) return;
        var range = selection.createRange ? selection.createRange() : selection.getRangeAt(0);
        window._range = range;
       },
	initPage:function(){
		if(window.navigator.appVersion.includes("iPhone")){
			$("#msg-text").css("-webkit-user-modify","read-write-plaintext-only");   // 是iPhone手机即添加输入框为只录入纯文本内容
		}
		$(".mui-table-view").on("tap",".text img",function(){
			var that=this;
			index_.msg_list=[];
			$(".mui-table-view .text").find("img").each(function(){
				index_.msg_list.push($(this).attr("src"))
			})
			wx.previewImage({
			    current:$(that).attr("src"), 
			    urls:index_.msg_list,
			});
		})
		wx.ready(function(){
			index_.bindVoice();
		})
		$("#page").on("tap",".mui-scroll",function(e){
			$("#msg-text").blur().blur();
			index_.saveRange();
			index_.addMoreAnimt(true);
			e.preventDefault();
		})
		if (!localStorage.allowRecord || localStorage.allowRecord !== 'true') {
			wx.startRecord({
				success: function() {
					localStorage.setItem('allowRecord',true)
					// 仅仅为了授权，所以立刻停掉
					wx.stopRecord();
        },
        cancel: function() {
            alert('用户拒绝授权录音');
        }
    });
}
	},
	/* 初始化方法 */
	init: function() {
		base.verifyUser();
		base.getWxConfig();
		this.initPage();
		this.WxServerGetData();
		this.CameraAndPhotos()
		this.clickAddMore();
		this.clickRecord();
		this.bindChange();
		this.scrollBottom();
		this.bindSV();
		this.clickSend();
	},
}
$(function() {
	index_.init();
}())
