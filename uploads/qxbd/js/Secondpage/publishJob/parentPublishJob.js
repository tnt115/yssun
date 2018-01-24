const parentPublishJob={
		SubjectList:[],
		/**
		 * 获取底部菜单需要的数据
		 */
		getParmas(){
			parentPublishJob.ajax({
				"sendUrl":base.getContextPath()+'/control/h5/classmgr/subjectList.htm',
				"sendData":"uidUserId="+base.getUidUserId(),
				"flag":true,
				"noFrom":true,
				fun:(data)=>{
					parentPublishJob.SubjectList.push({
						text:"(空)",
						value:"",
					})
					for(var i=0;i<data.object.length;i++){
						parentPublishJob.SubjectList.push({
							text:data.object[i].strSubjectName,
							value:data.object[i].uidSubjectId
						})
					}
				}
			})
		},
		/**
		 * 获取发布记录的数据
		 * type  科目类型
		 * time  发布时间
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
			parentPublishJob.ajax({
				"sendUrl":base.getContextPath()+'/control/h5/cyclasshomework/findClassHomeworkH5ByPage.htm',
				"sendData":sendData,
				"flag":true,
				"noFrom":true,
				fun:(data)=>{
					console.log(data)
					if(data.object.records.length>0){
						let html=``;
						for(let item of data.object.records){
							html+='<div class="mui-card custom_danger_b" uidHomeworkId="'+item.uidHomeworkId+'"><div class="mui-card-header">';
							html+='<div class="user_header_left"><span class="header_left_icon">';
							html+=' <span class="header_left_icon_content custom_danger"><span class="header_left_icon_"></span>'+item.strSubjectName+'</span>';
							html+='</span> <span class="header_left_class"></span></div>';
							html+='<div class="header_right"><span class="header_right_date">'+base.getDateTime(false,item.dtCreate)+'</span></div></div>';
							$("#testdiv").html(item.strContent);
							html+='<div class="mui-card-footer"><span class="title_content">'+item.strTitle+'</span> <span class="operation">';
							html+='<div class="mui-btn mui-btn-primary" uidHomeworkId="'+item.uidHomeworkId+'" style="border: 1px solid #007aff;background-color: #007aff;">查看</div>';
							html+='</span></div></div>';
						}
						$("#scroll2>.mui-scroll").html(html);	
					}else{
						$("#scroll2>.mui-scroll").html('<div id="error" style=" text-align: center;padding-top: 70px;color: #323232;">当前没有任何数据哦！</div>');	
					}
				}
			})
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
		/*设置底部选择菜单*/
		/**
		 * flag   参数 
		 *       true  //初始化其他选择器
		 *       false   //初始化时间选择器
		 */
		setBomSelect(that,data,flag){
			var userPicker=null;
			if(flag){
				userPicker= new mui.PopPicker();
				userPicker.setData(data);
			}else{
					userPicker= new mui.DtPicker({
						type:'date',
					});
			}
					userPicker.show((items)=>{
						if(flag){   //其他选择器
							if(items[0].value!=""){   //用户不是选择空值得时候
								$(that).find(".mui-badge").text(items[0].text).css("color","#000");
							}else{    //用户选择空值得时候
								$(that).find(".mui-badge").text(`请选择`).css("color","#ccc"); 
							}
							$(that).find("input").val(items[0].value);
							//判断当前是不是由发布记录来选择的
							if($(that).parents("#item2mobile").length>0){  //如果是则请求数据
							}
						}else{//时间选择器
							$(that).find(".mui-badge").text(items.value).css("color","#000");
							$(that).find("input").val(items.value);
						}
					});
			
		},
		/**
		 * 跳转到详细页面
		 */
		skipview(uidHomeworkId){
			location.href="viewPublishJob.html?uidHomeworkId="+uidHomeworkId;
		},
		bandAll(){
			//时间选择器为空
			$("html").on("tap",'.mui-dtpicker-header .mui-btn:nth-child(1)',()=>{
				$(".releaseTime span").text('请选择').css("color","#ccc")
				$("#releaseTime1").val("")
			})
			//搜索操作
			$("#seach").on("click",()=>{
				var time=$("#releaseTime1").val()==""?null:$("#releaseTime1").val();
			    var subject=$("#subjectType1").val()==""?null:$("#subjectType1").val();
				this.getReleaseRecord(subject,time,localStorage.getItem("uidClassId"));
			})
			$(".subjectType").on("click",function(){    //科目类型
				parentPublishJob.setBomSelect(this,parentPublishJob.SubjectList,true)
			})
			$(".releaseTime").on("click",function(){   //发布时间
				parentPublishJob.setBomSelect(this,false)
			})
			//查看操作
			$("#scroll2").on("click",".mui-btn-primary",function(){
				parentPublishJob.skipview($(this).attr("uidhomeworkid"))
			})
			//查看操作
			$("#scroll2").on("click",".mui-card",function(){
				parentPublishJob.skipview($(this).attr("uidhomeworkid"))
			})
		},
		init(){
			this.getParmas();
			mui('#scroll2').scroll({
				indicators: true // 是否显示滚动条
			});
			$("#item2mobile,#item1mobile").css("height",$(window).height()-40+"px")
			this.bandAll();
			this.getReleaseRecord(undefined,undefined,localStorage.getItem("uidClassId"));
		}
}
$(()=>{
	parentPublishJob.init();
})