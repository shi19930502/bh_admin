<template>
	<div class="platformModal">
		<el-dialog :width='eWidth' :title="modalTitle" :close-on-click-modal='false' :visible="modal" :before-close='beforeClose'>
			<el-tabs v-model="activeName" type="card" @tab-click="handleClick">
			    <el-tab-pane label="平台公告消息" name="first">
            		<el-form class="modal-form" v-if="modal" :model="formComputed" ref="form" :inline="true" :rules="rules" label-width="110px">
				    	<el-row>
                    		<el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
				    			<el-form-item  label="渠道" prop="channelName" class="row-block">
									<selectInput 
										v-if='!formDisabled'
										:value.sync='formComputed.channelName'
									    :filterable='channelFilterable'
									    >
								    	<el-option 
										    	v-for="item in channelOptions" 
										    	:key="item.code" 
										    	:label="item.name" 
										    	:value="item.code">
							   				</el-option>
							    	</selectInput>
									<inputItem  v-else :disabled='formDisabled' :value.sync='formComputed.channelName'  class="inputStyle"></inputItem>	
									
				    			</el-form-item>
				    		</el-col>
				    	</el-row>
				    	<el-row>
                    		<el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
				    			<el-form-item label="用户类型"  prop="userType" v-if='ptxxck' class="row-block">
									<selectInput  v-if='!formDisabled'
										:value.sync='formComputed.userType'
									    :filterable='channelFilterable'
									    @selectChange="changeUserType"
									    >
								    		<el-option 
										    	v-for="item in userTypeList" 
										    	:key="item.key" 
										    	:label="item.value" 
										    	:value="item.key"
										    	>
							   				</el-option>
							    	</selectInput>
									<inputItem  v-else  :disabled='formDisabled' :value.sync="formComputed.userType"  class="inputStyle"></inputItem>	
				    			</el-form-item>
				    		</el-col>
				    	</el-row>
				    	<el-row>
                    		<el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
				    			<el-form-item label="标题"  prop="title" class="row-block">
									<inputItem :value.sync='formComputed.title' :disabled='lookup'  class="inputStyle"></inputItem>
				    			</el-form-item>
				    		</el-col>
				    	</el-row>
				    	<el-row>
                    		<el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
				    			<el-form-item label="内容" prop="comment" class="row-block">
				    				<inputItem
				    					:disabled='lookup'
				    					type='textarea'
				    					maxlength="150"
				    					:value.sync='formComputed.comment'  class="inputStyle">
				    				</inputItem>
				    			</el-form-item>
				    		</el-col>
				    	</el-row>
				    	
				    	<el-row>
                    		<el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
				    			<el-form-item v-if='modalTitle == "编辑" || modalTitle == "新增"' label="附件" label-width='130px' >
				    				<uploadItem
				    					:limit='limit'
				    					:listType='listType'
				    					:multiple='multiple'
				    					:uploadTip='uploadTip'
				    					:uploadData='uploadParam'
				    					@success='uploadSuccess'
				    					@remove='onRemove'
				    					:fileList='attachmentList'
				    					></uploadItem>
				    					<span class="unpdataTS">一次性最多只能上传3个文件，且不能超过4M！！</span>
				    			</el-form-item>
				    			<el-form-item class='downloadAccessoryF' v-else label="下载附件" label-width='130px' prop="comment">
				    				<div class="downloadAccessory" v-for='item in downloadAccessory'>
					    				<a  :href="item.fullFilePath"  :download="item.fileName" :title="item.fileName">
					    					{{item.fileName}}
					    				</a>
				    				</div>
				    			</el-form-item>
				    		</el-col>
				    	</el-row>
				    </el-form>  
			    </el-tab-pane>
			</el-tabs>
			<div slot="footer" class="dialog-footer flex-x-end">
                <elBtn @click="cancel" text="取消"></elBtn>
                <elBtn @click="submit" text="提交" v-if="lookup!=true" type="primary"></elBtn>
            </div>
		</el-dialog>
		
	</div>
</template>

<script>
import local from '../../../local.js'
import configs from '../../../configs.js'
import mixin from '../../../mixin/mixin.js' //公共方法，包括主要的ajax
export default {
	mixins: [mixin],
	data(){
		return{
			configs:configs,
			dataList:[],
			searchInput:'',
			pageSizes:[10,20,30],//40页的时候有问题
			textarea:'',
			activeName:'first',
			channelOptions:[],
			customerOptions:[],
			userIdList:[],
			userNameList:[],
			userTypeList:[],
			form:{
				channelName:'',
				comment:'',
				smsType:'',
				userType:'',
				isUseTemplate:''
			},
			formComputed:{
				channelName:'',
				userType:'',
				title:'',
				comment:'',
				isUseTemplate:'',
			},
			channelNumber:'',
			uploadFile:{},//上传附件文件
			uploadTip:'一次性最多只能上传3个文件，且不能超过4M',
			uploadParam:{
				savePath:'platformNotice',
			},
			listType:'text',
			limit:3,
			multiple:true,
			formDisabled:false,
			switchValue:0, //0表示是，1表示否
			fileNumber:0,
			fileList:[],
			attachmentList:[],	//附件集合
			downloadAccessory:[],
			ptxxck:true,
			rules:{
				channelName: [{required: true, message: '渠道类型不能为空' }],
				userType: [{ required: true, message:'请选择用户类型', trigger: 'change' }],
		        title: [{ required: true,message:'请输入标题，50字以内', trigger: 'blur'},this._ruleLength(50)],
		        comment: [{ required: true,message:'请输入内容描述，150字以内',trigger: 'blur'},this._ruleLength(150)]
			},
		}
	},
	props: {
		modal: {
			type: Boolean,
			default: false
		},
		modalTitle:{
			default:''
		},
		eWidth:{
			default:'774px'
		},
		messageRow:{
			default:function(){
				return {}
			},
		},
		lookup:{
			type: Boolean,
			default:false
		}
	},
	computed:{
		formCom:{
			get:function(){
				var formC={}
				Object.assign(formC,this.form)
				if(formC.userType=='admin'){
					formC.userType = '所有'
				}else if(formC.userType=='merchant'){
					formC.userType =  '商家'
				}else if(formC.userType=='market'){
					formC.userType =  '市场管理员'
				}else if(formC.userType=='buyer'){
					formC.userType =  '采购商家'
				}
				return formC
			},
			set:function(o){
				Object.assign(this.formComputed,o)
			}
		},
	},
	mounted(){
		Object.assign(this.form,this.messageRow)
		Object.assign(this.formComputed,this.formCom)
		if(this.modalTitle=='编辑'){
			this.formCom=this.form
		}
		if(this.formComputed.supportNum != null && this.formComputed.supportNum != ''){
			this.fileNumber=this.formComputed.supportNum
		}
		this.init();
		if(this.modalTitle=='查看' ||this.modalTitle=='查看消息' ){
			this.formDisabled=true
			if(this.modalTitle=='查看消息'){
				this.ptxxck=false
			}
		}
		if(this.modalTitle=='查看'||this.modalTitle=='编辑'||this.modalTitle=='查看消息'){
			this.editAndlookUp();
		}
		
	},
	methods:{
		changeUserType(value){
			if(value=="market"){
				this.formComputed.sysId=local.get('sessionUser').sysId;
			}else if(value=="merchant"){
				this.formComputed.sysId = 8;
			}
		},
		editAndlookUp(){
			let _this=this
			var param={
					sourceObjectType:'002'
				}
			if(this.modalTitle=='查看消息'){//用于平台消息查看界面
				param.sourceObjectId=this.formComputed.mainId
			}else{
				param.sourceObjectId=this.formComputed.id
			}
			this._ajax({url:this.tootAPI,name:'uploadfilerecode/list',param:param})
			.then((d)=>{
				this.downloadAccessory=d.aaData
				if(this.modalTitle=='编辑'){
					d.aaData.forEach(function(o){
						o.name=o.fileName
						o.url=o.filePath
					})
					this.attachmentList=d.aaData
				}
				this.downloadAccessory.forEach(function(el){
					el.fullFilePath =_this.configs.imgURL + el.filePath + '?' + el.fileName;
				})
			})
		},
		init(){
			var vm=this;
			this.channelNumber=local.get('sessionUser').typeCode
			this.getUserType()
			
			this._ajax({url:this.tootAPI,name:'channel/list',
				param:{
					code:this.channelNumber
				}
			}).then((d)=>{
				this.channelOptions=d.aaData
			})
		},
		//获取用户类型
		getUserType(){
			var vm=this;
			var typeId=local.get('sessionUser').typeId
			if(typeId != 'admin'){
				vm.userTypeList=[{key:'merchant',value:'商家'},{key:'market',value:'市场管理员'},{key:'buyer',value:'采购商家'}]
			}else{
				vm.userTypeList=[{key:'admin',value:'所有'}]
			}
		},
		//根据平台消息id和主体对象类型（002：公告附件）可以查询出对应的附件
		getFileList(o){
			this._ajax({url:this.tootAPI,name:'uploadfilerecode/list',
				param:{
					sourceObjectType:'002',//公告附件
					sourceObjectId:o.id,
					channelCode:o.channelCode
				}
		}).then((d)=>{	
				this.attachmentList=d.aaData
			})
		},
		//根据渠道id查询商户信息
		searchTable(val){
			this._ajax({url:this.userAPI,name:'user/list',param:{typeCode:val}}).then(this.renderTable)
		},
		beforeClose(done) {
			this.$emit('close')
			done()
		},
		cancel(){
			this.$emit('close')
		},
		submit(){
			var vm=this;
			this.channelNumber=local.get('sessionUser').typeCode
			if(this.channelNumber == null || this.channelNumber == ''){
				this.channelNumber = '001';
			}
			this.$refs['form'].validate((valid) => {
				if(valid){
					this.formComputed.typeCode=vm.channelNumber
					this.formComputed.supportNum=this.fileNumber//附件数量
					this.channelOptions.map(function(el){
					if(el.code==vm.formComputed.channelName){
							vm.formComputed.channelName=el.name
							vm.formComputed.channelCode=el.code
						}
					})
					if(this.modalTitle=="新增"){
//						this.formComputed.channelCode=this.formComputed.channelName
						this.formComputed.noticeStatus=0
						this._ajax({url:this.tootAPI,name:'platformnotice/create',param:this.formComputed})
						.then((d)=>{
							if(d.state==0){
								this.uploadF(d.aaData)
								this.cancel()
		                        this.$message({ type: 'success', message: '操作成功' }); 
		                    }
						})
					}else{
						this._ajax({url:this.tootAPI,name:'platformnotice/update',param:this.formComputed})
						.then((d)=>{
							if(d.state==0){
								this.uploadF(this.form)
								this.cancel()
		                        this.$message({ type: 'success', message: '操作成功' }); 
		                    }
						})
					}
				}else{
		            this.$message({ type: 'warning', message: '请输入完整信息' }); 
				}
			})
		},
		uploadF(o){
			var tm=this
			var vm=this.uploadFile
			vm.sourceObjectType='002'//公告附件(从数据字典表中读取)
			vm.sourceObjectId=o.id
			vm.channelCode=tm.channelNumber
			
			this.fileList.map(function(el){
				if(el.response!=null){
					var fileTypeArr=el.name.split(".")
					vm.fileType=fileTypeArr[fileTypeArr.length-1]
					vm.fileSize=el.size
					vm.filePath=el.response.aaData.path
					vm.fileName=el.name
					vm.uploadDate=tm._getCurrentDate(0)
					tm._ajax({url:tm.tootAPI,name:'uploadfilerecode/create',param:vm})
					.then((d)=>{
						if(d.state==0){
							tm.$emit('close')
	                        tm.$message({ type: 'success', message: '操作成功' }); 
	                    }
					})
				}
			})
		},
		handleClick(){
		
		},
		uploadSuccess(response, file, fileList){
			this.fileNumber=this.fileNumber+1
			this.fileList=fileList
			console.log(this.fileList)
		},
		onRemove(file, fileList){
			if(this.fileNumber >0){
                this.fileNumber=this.fileNumber-1
            }
			this.fileList=fileList
			if(this.formComputed.id !=  null  && file.id != null){   
        			var o = {
        				id:[file.id]
        			}
					this._ajax({url: this.rootAPI + 'uploadfilerecode/delete', param:o,arr:true})
					.then((function(d) {
						this.$message({type: 'success', message: '删除成功'});
					}).bind(this))
					var delForm = {
        				id:this.formComputed.id,
        				supportNum:this.fileNumber
        			}
					this._ajax({url:this.tootAPI,name:'platformnotice/update',param:delForm})
					.then((d)=>{
					})
					
			}
		}
	},
}
</script>
<style scoped>
	
</style>
<style lang="sass">
	/*scoped表示  CSS 只作用于当前组件中的元素*/
	/*lang="sass"表示  可以使用sass写法*/
	.platformModal{
		.el-input-group{
			width: 260px;
			float: right;
			margin-bottom: 15px;
		}
		.row-block{
	            .el-form-item__content {
	                width: calc(100% - 110px);
	                &>div{
	                    width: 100%;
	                }
	            }
	    }
		.inputStyle{
			width:532px;
			white-space: normal;
            word-break: break-all;
		}
		.thr_money{
			display: flex;
			display: -webkit-flex;
			justify-content: space-between;
			padding: 20px 50px;
		}
		.buy_message{
			padding: 15px 20px;
			.label{
				width: 150px;
			}
			display: flex;
			display: -webkit-flex;
		}
		.el-radio{
			margin-bottom: 0;
		}
		.el-form-item__content{
			textarea{
				width: 532px;
				height: 100px;
			}
		}
		.titleClass {
			.el-input .el-input__inner[type=text]{
				width: 532px;
			}
		}
		.downloadAccessoryF{
			.el-form-item__label{
				float: left;
			}
			.el-form-item__content{
				float: left;
				width: 532px;
				display: flex;
				flex-wrap: wrap;
				.downloadAccessory{
					width: 140px;
					margin: 0 30px 0 0;
					overflow: hidden;
				    text-overflow: ellipsis;
				    white-space: nowrap;
				    /*a{
				    	width: 140px;
				    	overflow: hidden;
					    text-overflow: ellipsis;
					    white-space: nowrap;
				    }*/
				}
				.downloadAccessory:nth-of-type(3n){
					margin-right: 0;
				}
			}
		}
		.unpdataTS{
				position: absolute;
				top: 0;
				left: 100px;
				width:400px;
			}
	}
</style>