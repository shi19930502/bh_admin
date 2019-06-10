<template>
	<div class="page-ms_notice">
		<!-- 查询条件 -->
		<searchInputItems>
			<searchInputItem name="手机号码">
				<inputItem :value.sync="searchForm.phoneNumber" @enter="search"></inputItem>
			</searchInputItem>
			<searchInputItem name="通知内容">
				<inputItem :value.sync="searchForm.comment" @enter="search"></inputItem>
			</searchInputItem>
			<searchInputItem name="发送状态">
				<selectInput :value.sync="searchForm.sendStatus" @selectChange="search">
					<el-option
				      v-for="item in statusOptions"
				      :key="item.value"
				      :label="item.label"
				      :value="item.value">
				    </el-option>
				</selectInput>
			</searchInputItem>
		</searchInputItems>
		<!-- 操作按钮 -->
		<optionItems>
			<template slot="left">
				<el-button-group>
					<iconBtn iconClass="el-icon-plus" content="添加" @click='add'>添加</iconBtn>
					<iconBtn iconClass="el-icon-minus" content="删除" @click="dele">删除</iconBtn>
					<iconBtn iconClass="el-icon-search" content="查询" @click="search">查询</iconBtn>
					<iconBtn iconClass="el-icon-refresh" content="重置" @click="reset">重置</iconBtn>
				</el-button-group>				
			</template>
		</optionItems>
		<!-- 表格 -->
		<elemTable :dataList="dataList" :currentPage='pageNum' :pageSize="pageSize" :pageTotal="pageTotal" :loading="dataLoading" @sizeChange="handleSizeChange" @currentChange="handleCurrentChange" @selectionChange="selectionChange">
			<el-table-column type="selection" width="55"></el-table-column>
		    <el-table-column prop="phoneNumber" label="手机号码">
		    	<template slot-scope="scope">
		    		<toolTip :content="scope.row.phoneNumber">
		    			<span>{{scope.row.phoneNumber}}</span>
		    		</toolTip>
		      	</template>
		    </el-table-column>
		    <el-table-column prop="comment" label="通知内容">
		    	<template slot-scope="scope">
		    		<toolTip :content="scope.row.comment">
		    			<span>{{scope.row.comment}}</span>
		    		</toolTip>
		      	</template>
		    </el-table-column>
		    <el-table-column prop="sendStatus" label="发送状态">
		    	<template slot-scope="scope">
			        <span v-if="scope.row.sendStatus == 0">未发送</span>
					<span v-if="scope.row.sendStatus == 1">已发送</span>
			    </template>
		    </el-table-column>
		    <el-table-column prop="snedDate" label="发送时间">
		    	<template slot-scope="scope">
		    		<toolTip :content="scope.row.snedDate">
		    			<span>{{scope.row.snedDate}}</span>
		    		</toolTip>
		      	</template>
		    </el-table-column>
		    <el-table-column prop="createdPersonId" label="创建人编码">
		    	<template slot-scope="scope">
		    		<toolTip :content="scope.row.createdPersonId">
		    			<span>{{scope.row.createdPersonId}}</span>
		    		</toolTip>
		      	</template>
		    </el-table-column>
		    <el-table-column prop="createdPersonName" label="创建人名称">
		    	<template slot-scope="scope">
		    		<toolTip :content="scope.row.createdPersonName">
		    			<span>{{scope.row.createdPersonName}}</span>
		    		</toolTip>
		      	</template>
		    </el-table-column>
		    <el-table-column prop="createdDate" label="创建时间">
		    	<template slot-scope="scope">
		    		<toolTip :content="scope.row.createdDate">
		    			<span>{{scope.row.createdDate}}</span>
		    		</toolTip>
		      	</template>
		    </el-table-column>
		    <el-table-column label="操作">
		    	<template slot-scope="scope">
		    		<el-button-group>
					    <iconBtn iconClass="el-icon-circle-check" content="发送" @click="modalEdit(scope.row)" v-if="!scope.row.rowEditable && scope.row.sendStatus ==0"></iconBtn>
					    <iconBtn iconClass="el-icon-check" type="success" content="保存" @click="submitEdit(scope.row)" v-if="scope.row.rowEditable"></iconBtn>
					    <iconBtn iconClass="el-icon-close" type="info" content="取消" @click="cancelEdit(scope.row)" v-if="scope.row.rowEditable"></iconBtn>
					    <iconBtn iconClass="el-icon-minus" content="删除" @click="delRow(scope.row)"></iconBtn>
		    		</el-button-group>		    		
		    	</template>
		    </el-table-column>
		</elemTable>
	</div>
</template>
<script>
	import mixin from '../mixin/mixin.js'
	export default {
		mixins: [mixin],
		data() {
			return {
				searchForm: {
					phoneNumber: '',
					comment: '',
					sendStatus: ''
				},
				dataList: [],	
				statusOptions: [{label: '未发送', value: 0}, {label: '已发送', value: 1}, {label: '全部', value: ''}],
				rowOBJ: {}
			}
		},
		mounted() {
			Object.assign(this.searchForm, {
					pageNum: this.pageNum, 
					pageSize: this.pageSize
				})
			this.searchTable(this.searchForm)
		},
		methods: {
			searchTable(param) {
				return this._ajax({url: this.rootAPI, name: 'sendsms/list', param: param, loading: 'dataLoading'}).then(this.renderTable)
			},
			search(){
				this.searchTable(this.searchForm)
			},
			reset() {
				Object.assign(this.searchForm, {
					phoneNumber: '',
					comment: '',
					sendStatus: '',
				})
				this.handleCurrentChange(1)
			},	
			add(){
				this.modalShow=true;
				this.modalTitle='新增'
			},
			dele() {			
	        	if(this.delSelection.length === 0) {
	        		this.$message({type: 'info', message: '请选择行'});
	        	}else {
	        		let selection = this.delSelection
	        		this.confirm('确定删除？', (function() {     
	        			var arr = [], o = {}
						selection.forEach(function(el) {
							arr.push(el.Id)
						})	
						o.Id = arr
						this._ajax({url: this.rootAPI + 'sendsms/delete', param: o, arr:true})
						.then((function(d) {
							this.$message({type: 'success', message: '删除成功'});
							this.handleCurrentChange(1)
						}).bind(this))
	        		}).bind(this))		                        		
	        	}	
			},
			delRow(row) {
				this.confirm('确定删除？', (function() {     
        			var o = {
        				Id: [row.Id]
        			}
					this._ajax({url: this.rootAPI + 'sendsms/delete', param: o, arr:true})
					.then((function(d) {
						this.$message({type: 'success', message: '删除成功'});
						this.handleCurrentChange(1)
					}).bind(this))
        		}).bind(this))	
			},
			changeMobile(row) {
				// if(!this.regFloat.test(row.mobile)) {
				// 	console.log(this.regFloat.test(row.mobile))
				// 	row.mobile = 0
				// }
			},
			modalEdit(o) {
				var param={};
				Object.assign(param, o);
				param.sendStatus=1;
				this._ajax({url: this.rootAPI + 'sendsms/update', param: param, loading: 'dataLoading'})
				.then((function(d) { 
						if(d.state==0){
                        	this.$message({ type: 'success', message: '发送成功' }); 
                        	o.sendStatus=1;//改变表格里面的发送状态
                    		o.rowEditable = false
						}else{
							this.$message({ type: 'info', message: '发送失败! '+d.msg }); 
						}
                }).bind(this))
			},
			modalEdit(o) {
				if(!this.rowOBJ[o.customerId]) {
					this.rowOBJ[o.customerId] = {}
				}
				Object.assign(this.rowOBJ[o.customerId], o)
				o.rowEditable = true
			},
			cancelEdit(o) {
				Object.assign(o, this.rowOBJ[o.customerId])
			},
			submitEdit(o) {
				if(!this.TelePhone.test(o.mobile)) {
					this.$message({ type: 'error', message: '手机号填写有误' }); 
					o.rowError = true
				}else {
					this._ajax({url: this.userAPI + 'user/update', param: o, loading: 'dataLoading'})
                        .then((function(d) { 
                        	this.$message({ type: 'success', message: '操作成功' }); 
                    		o.rowEditable = false
                        }).bind(this))
				}
			},
			//弹出框
			modalClose(){
				this.modalShow=false
			},
		}
	}
</script>