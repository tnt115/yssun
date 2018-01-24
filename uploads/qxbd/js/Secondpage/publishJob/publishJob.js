const publishJob={
		SubjectList:[],
		ClassList:[],
		localId:[],
		uidImgResIds:[],
		imgList:[],
		serverId:[],
		countImg:6,
		cyClass:[],
		userPicker:null,
		/**
		 * 跳转到详细页面
		 */
		skipview(uidHomeworkId,title){
			location.href="viewPublishJob.html?uidHomeworkId="+uidHomeworkId+"&title="+escape(title);
		},
		/**
		 * 获取底部菜单需要的数据
		 */
		getParmas(){
			base.Toast("loading","请稍后...",true);
			$.when($.ajax({  // 获取年级数据
				type: "post",
				url: base.getContextPath() + '/control/h5/grade/listGrade.htm',
				data: "uidUserId="+base.getUidUserId(),
				async: true,
			}),$.ajax({     // 获取学科数据
				type:"post",
				url:base.getContextPath()+'/control/h5/cyclasshomework/listSubjectByTeacher.htm',
				data:"uidTeacherId="+base.getUidUserId(),
				async:true,
			})).then((data,data2)=>{
				// 学科数据保存
				if(data2[0].success){
					publishJob.SubjectList.push({
						text:"(空)",
						value:"",
					})
					for(var i=0;i<data2[0].object.length;i++){
						publishJob.SubjectList.push({
							text:data2[0].object[i].strSubjectName,
							value:data2[0].object[i].uidSubjectId
						})
					}
				}else{
					mui.toast(data2[0].object);
				}
				// 年级数据保存
				if(data[0].success){
					publishJob.ClassList.push({
						text:"(空)",
						value:"",
					})
					for(var j=0;j<data[0].object.length;j++){
						publishJob.ClassList.push({
							text:data[0].object[j].strGradeName,
							value:data[0].object[j].uidGradeId
						})
					}
				}else{
					mui.toast(data[0].object);
				}
				base.Toast("loading","请稍后...",false);
			},(data,data2)=>{
				base.Toast("loading","请稍后...",false);
				base.dialog({
					type:"2",
					title:"",
					text:`系统错误，请联系管理员!`,
					flag:true,
					success:()=>{
					}
				});
			})
		},
		/* 设置底部选择菜单 */
		/**
		 * flag 参数 true //初始化其他选择器 false //初始化时间选择器
		 */
		setBomSelect(that,data,flag){
			if(flag){
				publishJob.userPicker= new mui.PopPicker();
				publishJob.userPicker.setData(data);
			}else{
				publishJob.userPicker= new mui.DtPicker({
						type:'date',
					});
			}
			publishJob.userPicker.show((items)=>{
						if(flag){   // 其他选择器
							if(items[0].value!=""){   // 用户不是选择空值得时候
								$(that).find(".mui-badge").text(items[0].text).css("color","#000");
							}else{    // 用户选择空值得时候
								$(that).find(".mui-badge").text(`请选择`).css("color","#ccc"); 
							}
							$(that).find("input").val(items[0].value);
							if($(that).hasClass("usergrade")){
								if(items[0].value!=""){
									var $DomObj=$(that).parents("#item2mobile").length>0?$("#item2mobile .mui-input-group_user"):$("#item1mobile .mui-input-group_user");
									var type=$(that).parents("#item2mobile").length>0?'mui-radio':'mui-checkbox';
									base.Toast("loading","请稍后...",true);
									publishJob.getListByGrade(items[0].value,$DomObj,type);
									$(".mui-input-group_user").css("display","block");
									$("#scroll2").css("margin-top","179px");
								}else{
									$("#item2mobile .mui-input-group_user").find("div").html("");
									$(".mui-input-group_user").css("display","none");
									$("#scroll2").css("margin-top","134px");
								}
							}
						}else{// 时间选择器
							$(that).find(".mui-badge").text(items.value).css("color","#000");
							$(that).find("input").val(items.value);
							
						}
						publishJob.userPicker.dispose();
					});
			
		},
		/**
		 * 根据年级id获取班级列表
		 */
		getListByGrade(uidGradeId,$DomObj,type){
			$.ajax({
				type: "post",
				url: base.getContextPath() + '/control/h5/class/listClassByRKTeacher.htm',
				data: "uidTeacherId="+base.getUidUserId()+"&uidGradeId="+uidGradeId,
				async: true,
				success:(data)=>{
					base.Toast("loading","请稍后...",false);
					if(data.success){
						let html="";
						for(var i=0;i<data.object.length;i++){
							html+='<div class="mui-input-row '+type+'">';
							html+='<label>'+data.object[i].strGradeName+""+data.object[i].strClassName+'</label>';
							if(type=="mui-radio"){
								html+='<input type="radio" value="'+data.object[i].uidClassId+'" name="radio">';
							}else{
								var flag=false;
								if(publishJob.cyClass.length>0){
									for(let item of publishJob.cyClass){
										if(item.uidClassId==data.object[i].uidClassId){
											flag=true;
										}
									}
									if(flag){
										html+='<input  value="'+data.object[i].uidClassId+'" type="checkbox" checked>';
									}else{
										html+='<input  value="'+data.object[i].uidClassId+'" type="checkbox">';
									}
								}else{
									html+='<input  value="'+data.object[i].uidClassId+'" type="checkbox">';
								}
							}
							html+='</div>'
						}
						$DomObj.css("display","block").find("div").html(html);
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
		/**
		 * 保存操作
		 */
		saveData(){
			if($("#scroll1 #subjectType").val()==""){
				base.dialog({
					type:"2",
					title:"",
					text:`请选择科目类型`,
					flag:true,
					success:()=>{
					}
				});
				return false
			}
			if($("#scroll1 #Jobtitle").val()==""){
				base.dialog({
					type:"2",
					title:"",
					text:`请输入作业标题`,
					flag:true,
					success:()=>{
					}
				});
				return false
			}
			if(publishJob.localId.length==0&&$("#weui-textareaDiv").html().length==0){
				base.dialog({
					type:"2",
					title:"",
					text:`作业内容不能为空`,
					flag:true,
					success:()=>{
					}
				});
				return false
			}
			if($("#scroll1 #usergrade").val()==""){
				base.dialog({
					type:"2",
					title:"",
					text:`请选择年级`,
					flag:true,
					success:()=>{
					}
				});
				return false
			}
			let count=0;
			var uidClassId="";
			$("#scroll1 .mui-checkbox input").each(function(){
				if($(this).prop("checked")){
					uidClassId+=$(this).val()+","
					count++;
				}
			})
			uidClassId=uidClassId.substring(0,uidClassId.length-1);
			if(count<1){
				base.dialog({
					type:"2",
					title:"",
					text:`班级对象至少选择一个`,
					flag:true,
					success:()=>{
					}
				});
		   		return false
			}
			if($("#strPublicName").val().trim()==""){
				base.dialog({
					type:"2",
					title:"",
					text:`请输入发布人`,
					flag:true,
					success:()=>{
					}
				});
		   		return false
			}
			publishJob.upImg(uidClassId);
		},
		/**
		 * 上传图片并保存图片id
		 */
		upImg(uidClassId){
  			var formData = new FormData($("#item1mobileFrom")[0]);
			formData.append("uidUserId",base.getUidUserId());
			formData.append("uidClassId",uidClassId);
			formData.append("uidSchoolId",localStorage.getItem("uidSchoolId"));
			if($("#btn").attr("uidhomeworkid")!=undefined){
				formData.append("uidHomeworkId",$("#btn").attr("uidhomeworkid"));
			}
			var strContent=$("#weui-textareaDiv").html();
			if(publishJob.localId.length>0){
				base.Toast("loading","请稍后...",true);
			    var i=0,length = publishJob.localId.length;
			    function upload() {
			      wx.uploadImage({
			    	isShowProgressTips:0,
			        localId: publishJob.localId[i],
			        success:(res)=>{
			        	i++;
						$.ajax({
							type: "post",
							url: base.getContextPath()+'/control/h5/cyschoolintroduce/uploadWxImage.htm',
							data: 'uidUserId='+base.getUidUserId()+"&wechat_accesstoken="+localStorage.getItem("wechat_accesstoken")+"&media_id="+res.serverId,
							async: false,
							success:(data)=>{
								if(data.success){
									publishJob.imgList.push(data.object.strImagePath);
									publishJob.uidImgResIds.push(data.object.uidImageId);
								}else{
									base.Toast("loading","请稍后...",false);
									base.dialog({
										type:"2",
										title:"",
										text:data.object,
										flag:true,
										success:()=>{
											$(".pic").eq(i).remove()
										}
									});
									return false
								}
							},
							error:(data, xhm)=>{
									location.replace(base.getContextPath()+'/h5/error.html')
									return false
							}
						});
						 if (i < length) {
					            upload();
					          }else{
						  			for(var j=0;j<publishJob.imgList.length;j++){
										strContent+='<br/><img src='+publishJob.imgList[j]+'>';
									}
									formData.append("uidImgResIds",publishJob.uidImgResIds+"");
									formData.append("strContent",strContent);
							    	publishJob.sendAjax(formData,true);
					          }
			        },
			        fail: (res)=>{
			        	console.log(JSON.stringify(res));
			        }
			      });
			    }
			    upload();
			}else{
				if(publishJob.imgList.length>0){
					for(var i=0;i<publishJob.imgList.length;i++){
						strContent+='<br/><img src='+publishJob.imgList[i]+'>';
					}
				}
				formData.append("strContent",strContent);
	        	publishJob.sendAjax(formData,true);
			}
		},
		/**
		 * 点击发布的时候发送数据到后端
		 */
		sendAjax(formData){
			publishJob.ajax({
				"sendUrl":base.getContextPath()+'/control/h5/cyclasshomework/saveClassHomeworkH5.htm',
				"sendData":formData,
				"flag":true,
				"noFrom":false,
				fun:(data)=>{
					location.replace(base.getContextPath()+'/h5/Secondpage/publishJob/checkPublishJob.html')
					/*location.reload();*/
					
				}
			})
		},
		/* 点击拍照 */
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
				    count: publishJob.computCount(), 
				    sizeType: ['original'], 
				    sourceType:type, 
				    success: function (res) {
				        var localIds = res.localIds; 
				        for(var i=0;i<localIds.length;i++){
				         $(".pic").append('<img src="'+localIds[i]+'" data-preview-src="" data-preview-group="1" >')
				        		/*
								 * $(".pic").append('<img src="'+localIds[i]+'"
								 * data_img='+localIds[i]+'
								 * class="add_imgList">')
								 */
				        	  publishJob.localId.push(localIds[i]);
				        }
				        publishJob.countImg-=localIds.length;
				        publishJob.computCount();
				        publishJob.setImgWidth();
				    }
				});
			})
		},
		setImgWidth:function(){
			$(".pic>img").css({"width":$(".pic a").width(),"height":$(".pic a").width()})
		},
		/* 计算用户选择的照片数量 */
		computCount:function(){
			if(publishJob.countImg==0){
				 $(".pic a").css("display","none");
				 return 0
			}else{
				$(".pic a").css("display","inline-block");
				return publishJob.countImg
			}
		},
		/**
		 * 获取发布记录的班级id
		 */	
		getClassId(){
			publishJob.ajax({
				"sendUrl":base.getContextPath()+'/control/h5/class/listClassByHeadTeacher.htm',
				"sendData":"uidHeadTeacherId="+base.getUidUserId(),
				"flag":true,
				"noFrom":true,
				fun:(data)=>{
					let html='';
					for(let item of data.object){
						html+='<div class="mui-input-row mui-radio">';
						html+='<label>'+item.strGradeName+''+item.strClassName+'</label>';
						html+='<input name="uidClassId" value="'+item.uidClassId+'" type="radio"></div>';
					}
					$("#item2mobile .mui-input-group_user").css("display","block").find("div").html(html);
				}
			})
		},
		/**
		 * 删除操作
		 */
		Dodelet(uidHomeworkId){
			base.dialog({
				type:"1",
				title:"友情提示",
				text:"确定要删除?",
				flag:true,
				success:()=>{
					publishJob.ajax({
						"sendUrl":base.getContextPath()+'/control/h5/cyclasshomework/deleteClassHomeworkH5.htm',
						"sendData":"uidHomeworkId="+uidHomeworkId+"&uidUserId="+base.getUidUserId(),
						"flag":true,
						"noFrom":true,
						fun:(data)=>{
							mui.toast('删除成功！');	
							publishJob.getReleaseRecord();  // 删除成功，重新加载数据
						}
					})
				}
			});
		},
		/**
		 * 编辑操作
		 */
		Doedit(uidHomeworkId){
			publishJob.ajax({
				"sendUrl":base.getContextPath()+'/control/h5/cyclasshomework/getClassHomeworkH5ById.htm',
				"sendData":"uidHomeworkId="+uidHomeworkId,
				"flag":true,
				"noFrom":true,
				fun:(data)=>{
				  /* var sliders = mui('.mui-slider').slider();   // 滑到发布作业中
				    sliders.gotoItem(1);*/
					$("#btn").attr("uidHomeworkId",uidHomeworkId);
					publishJob.uidImgResIds=[];
					$("#scroll1 .subjectType").find(".mui-badge").text(data.object.cySubject.strSubjectName).css("color","#000");// 科目类型
					$("#scroll1 #subjectType").val(data.object.cySubject.uidSubjectId) // 科目类型
					$("#scroll1 #Jobtitle").val(data.object.cyClassHomework.strTitle);  // 作业标题
					$("#scroll1 #JobtitleDiv").text(data.object.cyClassHomework.strTitle);  // 作业标题
					$("#scroll1 #usergrade").val(data.object.cyGrade.uidGradeId);    // 年级
					$("#scroll1 .usergrade").find(".mui-badge").text(data.object.cyGrade.strGradeName).css("color","#000");      // 年级
					$("#strPublicName").val(data.object.cyClassHomework.strPublisher);  // 发布人
					$("#testdiv").html(data.object.cyClassHomework.strContent);
					var html='<a href="#picture" style="display: inline-block;"><img src="../../images/Secondpage/ClassStyle/add.png" class="default"></a>';
					publishJob.uidImgResIds.length=0;   // 先清空确保用户是在先有做过上传图片操作的情况
					publishJob.imgList.length=0;
					$("#testdiv img").each(function(){
						if($(this).attr("imgresid")!=undefined){
							publishJob.uidImgResIds.push($(this).attr("imgresid"));
						}
						publishJob.imgList.push($(this).attr("src"))    // 用户直接重外部引入的图片，把src保存起来
						html+='<img src='+$(this).attr("src")+' data-preview-src data-preview-group="1" />';
					})
					publishJob.countImg=(6-publishJob.imgList.length);
					$("#scroll1 .pic").html(html);
					
				/*	$("#scroll1 .weui-textarea").val($("#testdiv").html().replace(/<br>/g,"\r\n"));*/
					$("#testdiv").find("img").each(function(){
						$(this).remove();
					})
					$("#weui-textareaDiv").html($("#testdiv").html())
					this.computationNum("#weui-textareaDiv");
					publishJob.countImg-=publishJob.uidImgResIds.length;
					publishJob.computCount();
				    publishJob.setImgWidth();
				    publishJob.cyClass=data.object.cyClass;
				    publishJob.getListByGrade(data.object.cyGrade.uidGradeId,$("#item1mobile .mui-input-group_user"),'mui-checkbox');
				}
			})
		},
		/**
		 * 发布操作
		 */
		Doposted(uidHomeworkId){
			base.dialog({
				type:"1",
				title:"友情提示",
				text:"确定发布?",
				flag:true,
				success:()=>{
					publishJob.ajax({
						"sendUrl":base.getContextPath()+'/control/cyclasshomework/publish.htm',
						"sendData":"uidHomeworkId="+uidHomeworkId+"&uidUserId="+base.getUidUserId(),
						"flag":true,
						"noFrom":true,
						fun:(data)=>{
							mui.toast('发布成功！');	
							publishJob.getReleaseRecord();  // 发布成功，重新加载数据 
						}
					})
				}
			});
		},
		/**
		 * 获取发布记录的数据 type 科目类型 time 发布时间
		 */
		getReleaseRecord(type,time,uidClassId){
			type=type==undefined?null:type;
			time=time==undefined?null:time;
			uidClassId=uidClassId==undefined?null:uidClassId;
			var sendData="uidSubjectId="+type+"&uidUserId="+base.getUidUserId()+"&uidSchoolId="+localStorage.getItem("uidSchoolId")+"&uidClassId="+uidClassId;
			if(time!=null){
				sendData+="&beginDate="+time+" 00:00:00&endDate="+time+" 23:59:59";
			}else{
				sendData+="&beginDate="+time+"&endDate="+time;
			}
			var uidGradeId=$("#usergrade").val()==""?null:$("#usergrade").val();
			sendData+='&uidGradeId='+uidGradeId;
			publishJob.ajax({
				"sendUrl":base.getContextPath()+'/control/h5/cyclasshomework/findClassHomeworkH5ByPage.htm',
				"sendData":sendData,
				"flag":true,
				"noFrom":true,
				fun:(data)=>{
					if(data.success){
						if(data.object.records.length>0){
							let html=``;
							for(let item of data.object.records){
								html+='<div class="mui-card custom_danger_b" uidHomeworkId="'+item.uidHomeworkId+'" data_title='+item.strTitle+'><div class="mui-card-header">';
								html+='<div class="user_header_left"><span class="header_left_icon">';
								html+=' <span class="header_left_icon_content custom_danger"><span class="header_left_icon_"></span>'+item.strSubjectName+'</span>';
								html+='</span> <span class="header_left_class">'+item.strGradeName+'</span></div>';
								html+='<div class="header_right"><span class="header_right_date">'+base.getDateTime(false,item.dtCreate)+'</span></div></div>';
								$("#testdiv").html(item.strContent);
								html+='<div class="mui-card-footer"><span class="title_content">'+item.strTitle+'</span> <span class="operation">';
								html+='<button type="button" class="mui-btn mui-btn-danger" data_uidHomeworkId="'+item.uidHomeworkId+'">删除</button>';
								if(item.iStatus=="0"){
									html+='<button type="button" class="mui-btn mui-btn-warning" data_uidHomeworkId="'+item.uidHomeworkId+'">编辑</button>';
									html+='<button type="button" class="mui-btn mui-btn-royal" data_uidHomeworkId="'+item.uidHomeworkId+'">发布</button>';
								}else{
									html+='<div class="mui-btn mui-btn-primary">已发布</div>';
								}
								html+='</span></div></div>';
							}
							$("#scroll2>.mui-scroll").html(html);	
						}else{
							$("#scroll2>.mui-scroll").html('<div id="error" style=" text-align: center;padding-top: 70px;color: #323232;">当前没有任何数据哦！</div>');	
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
				}
			})
		},
		/**
		 * 监听Scroll2滑块被点击后的高度并设置scroll2的上偏移
		 */
		listeningScroll2(){
			if($("#item2mobile .mui-input-group_user>.mui-collapse").hasClass("mui-active")){
				var height=$("#item2mobile .mui-input-group_user").height();
				$("#scroll2").css("margin-top",(height+135)+"px");
			}else{
				if($(".mui-input-group_user").css("display")=="block"){
					$("#scroll2").css("margin-top","179px");
				}else{
					$("#scroll2").css("margin-top","134px");
				}
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
						object.fun(data);
						return false;
					}else{
						base.dialog({
							type:"2",
							title:"",
							text:data.object,
							flag:true,
							success:()=>{
							}
						});
						return false;
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
		/**
		 * 计算文本域的文字个数
		 */
		computationNum(that){
			/*if($(that).val().match(/[\r\n]/g)!=null){
				$("#usableSize").text(($(that).val().match(/[\r\n]/g).length+$(that).val().length));
			}else{
				$("#usableSize").text($(that).val().length);
			}*/
			if($("#weui-textareaDiv").html().length<=4000){
				$("#usableSize").text($("#weui-textareaDiv").html().length);
			}
		},
		muiRadioFalse(that,event){
			if(that.prop("checked")){
				that.prop("checked",false);
				window.event? window.event.cancelBubble = true : e.stopPropagation();
				return false;
			}
		},
		/**
		 * 绑定当前页面的所有事件
		 */
		bindAll(){
			$("body").on("tap",".default",function(){
				$("#weui-textareaDiv,#JobtitleDiv").blur();
			})
			/**
			 * 跳转到发布作业页面
			 */
			$(".all_header").on("tap",function(){
				location.href='publishJob.html'
			});
			//可输入的div框
			$("#JobtitleDiv").on("input propertychange",function(){
				$("#Jobtitle").val($(this).text());
			})
			
			$("html").on("tap",'.mui-dtpicker-header .mui-btn:nth-child(1)',()=>{
				$(".releaseTime span").text('请选择').css("color","#ccc")
				$("#releaseTime1").val("")
			})
			$("body").on("tap",".mui-radio input",function(event){
					publishJob.muiRadioFalse($(this),event);
			})
			$("body").on("tap",".mui-radio",function(event){
					publishJob.muiRadioFalse($(this).find("input"),event);
			})
			// 搜索操作
			$("#seach").on("click",()=>{
				var inputVal="";
				var time=$("#releaseTime1").val()==""?null:$("#releaseTime1").val();
				$(".mui-radio input").each(function(){
					if($(this).prop("checked")){
						inputVal=$(this).val();
					}
				})
				 var subject=$("#subjectType1").val()==""?null:$("#subjectType1").val();
				$("#item2mobile .mui-input-group_user>li").removeClass("mui-active");
				setTimeout(()=>{
					publishJob.listeningScroll2();
				},200)
				this.getReleaseRecord(subject,time,inputVal==""?null:inputVal);
			})
			//监听作业内容变化
			$(".weui-textarea,#weui-textareaDiv").on("input propertychange",function(event){
				publishJob.computationNum(this);
			})
			// 监听发布记录下选择班级的变化
			$("#item2mobile").on("tap",".mui-input-group_user",function(){
				setTimeout(()=>{
					publishJob.listeningScroll2();
				},200)
			})
			// 删除操作
			$("#scroll2").on("click",".mui-btn-danger",function(event){
				event.stopPropagation();
				publishJob.Dodelet($(this).attr("data_uidHomeworkId"));
			})
			// 编辑操作
			$("#scroll2").on("click",".mui-btn-warning",function(event){
				event.stopPropagation();
				location.href='publishJob.html?uidhomeworkid='+$(this).attr("data_uidHomeworkId")
			})
			// 真正的发布操作
			$("#scroll2").on("click",".mui-btn-royal",function(event){
				event.stopPropagation();
				publishJob.Doposted($(this).attr("data_uidHomeworkId"));
			})
			// 查看发布记录中已发布的历史详细
			$("#scroll2").on("click",".mui-card",function(){
				publishJob.skipview($(this).attr("uidHomeworkId"),$(this).attr("data_title"))
			});
			$(".subjectType").on("click",function(){    // 科目类型
				publishJob.setBomSelect(this,publishJob.SubjectList,true)
			})
			$(".releaseTime").on("click",function(){   // 发布时间
				publishJob.setBomSelect(this,false)
			})
			$(".usergrade").on("click",function(){   // 年级选择
				publishJob.setBomSelect(this,publishJob.ClassList,true)
			})
			// 保存
			$("#btn").on("click",()=>{
				this.saveData();
			})
					/* 浏览图片的时候删除图片操作 */
		$(".mui-preview-header").append('<img src="../../images/Secondpage/ClassStyle/drop.png" id="drop">')
		$(".mui-preview-header").on("click","#drop",function(){
			base.dialog({
				type:"1",
				title:"友情提示",
				text:"确定要删除?",
				flag:true,
				success:()=>{
					var index=$(".mui-preview-indicator")[0].innerText.substring(0,1)-1;
					publishJob.imgList.splice(index,1)
					publishJob.uidImgResIds.splice(index,1)
					publishJob.localId.splice(index,1)
					 $(".pic>img").eq(index).remove();
					publishJob.countImg+=1;
					publishJob.computCount();
					previewImage.close();
				}
			});
		})
		},
		/**
		 * 初始化方法
		 */
		init(){
			if(base.GetQueryString("uidhomeworkid")!=null){
				publishJob.Doedit(base.GetQueryString("uidhomeworkid"));
				$("#homeworkTitle").text("编辑作业");
			}else{
				$("#homeworkTitle").text("发布作业");
			}
			base.verifyUser();
			base.getWxConfig();
			this.getReleaseRecord();
			this.getPicture();
/*			if(localStorage.getItem("iRoleID")==4){
				this.getClassId();
			}*/
			this.bindAll();
			this.getParmas();
			mui('#scroll2').scroll({
				indicators: true // 是否显示滚动条
			});
			var item2Show = false,item3Show = false;// 子选项卡是否显示标志
			document.querySelector('.mui-slider').addEventListener('slide', function(event) {
				console.log(event.detail.slideNumber);
			});
			$("#strPublicName").val(localStorage.getItem("userName"));
			$("#item1mobile,#item2mobile").css("height",$(window).height()-50+"px")
			$("#item1mobile").css("height",$(window).height()+"px")
		}
}
$(function(){
	publishJob.init();
})

