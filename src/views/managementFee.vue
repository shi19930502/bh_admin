<template>
    <div><br/>
        <!-- 查询条件 -->
        <searchInputItems>
            <searchInputItem name="车辆类型">
                <selectInput :value.sync="searchForm.cartypeid" @selectChange="searchTable">
                    <el-option v-for="item in dataDic.cartypeList" :key="item.id" :label="item.name" :value="item.id">
                    </el-option>
                </selectInput>
            </searchInputItem>
            <searchInputItem name="商户名称">
                <selectInput :value.sync="searchForm.customerid" @selectChange="searchTable">
                    <el-option v-for="item in dataDic.customerList" :key="item.id" :label="item.name" :value="item.id">
                    </el-option>
                </selectInput>
            </searchInputItem>
            <searchInputItem name="登记时间">
                <dateEditorDaterange :dateValue.sync='inDate'>
                </dateeditordaterange>
            </searchInputItem>
            <searchInputItem name="是否付款">
                <selectInput :value.sync="searchForm.status" @selectChange="searchTable">
                    <el-option v-for="item in dataDic.statusList" :key="item.key" :label="item.value" :value="item.key">
                    </el-option>
                </selectInput>
            </searchInputItem>
        </searchInputItems>
        <!-- 操作按钮 -->
        <optionItems>
            <template slot="left">
                <el-button-group>
                    <iconBtn iconClass="el-icon-plus" content="新增" @click="add" type="success" v-if="frontEndId===1">新增</iconBtn>
                    <iconBtn iconClass="el-icon-refresh" content="重置" @click="reset">重置</iconBtn>
                    <iconBtn iconClass="el-icon-search" content="查询" @click="searchTable">查询</iconBtn>
                </el-button-group>
            </template>
        </optionItems>

        <!-- 表格 -->
        <elemTable :dataList="dataList" :currentPage='pageNum' :pageSize="pageSize" :pageTotal="pageTotal"
                   :loading="dataLoading" @sizeChange="handleSizeChange" @currentChange="handleCurrentChange"
                   @selectionChange="selectionChange">
           <!-- <el-table-column type="selection" width="55"></el-table-column>-->
            <el-table-column prop="wholesalerName" label="商户名称">
                <template slot-scope="scope">
                    <span>{{scope.row.wholesalerName}}</span>
                </template>
            </el-table-column>
            <el-table-column prop="cartypeName" label="车辆类型">
                <template slot-scope="scope">
                    <span>{{scope.row.cartypeName}}</span>
                </template>
            </el-table-column>
            <el-table-column prop="totalweight" label="总重量">
                <template slot-scope="scope">
                    <span>{{scope.row.totalweight}}</span>
                </template>
            </el-table-column>
            <el-table-column prop="tare" label="皮重">
                <template slot-scope="scope">
                    <span>{{scope.row.tare}}</span>
                </template>
            </el-table-column>
            <el-table-column prop="netweight" label="净重">
                <template slot-scope="scope">
                    <span>{{scope.row.netweight}}</span>
                </template>
            </el-table-column>
            <el-table-column prop="marTotalmanagefee" label="管理费金额">
                <template slot-scope="scope">
                    <span>{{scope.row.marTotalmanagefee}}</span>
                </template>
            </el-table-column>
            <el-table-column prop="status" label="状态">
            	<template slot-scope="scope">
					<span v-for="item in dataDic.statusList">
				      <span v-if="scope.row.status == item.key">{{item.value}}</span>
				    </span>
				</template>
            </el-table-column>
            <el-table-column prop="createdby" label="登记人">
                <template slot-scope="scope">
                    <span>{{scope.row.createdby}}</span>
                </template>
            </el-table-column>
            <el-table-column prop="createdate" label="登记时间">
                <template slot-scope="scope">
                    <span>{{scope.row.createdate}}</span>
                </template>
            </el-table-column>
            <el-table-column prop="payby" label="付款人">
                <template slot-scope="scope">
                    <span>{{scope.row.payby}}</span>
                </template>
            </el-table-column>
            <el-table-column prop="paydate" label="付款时间">
                <template slot-scope="scope">
                    <span>{{scope.row.paydate}}</span>
                </template>
            </el-table-column>
            <el-table-column label="操作" width="220">
                <template slot-scope="scope">
                    <el-button-group>
                        <iconBtn iconClass="el-icon-view" content="查看" @click="lookOver(scope.row)"></iconBtn>
                        <iconBtn iconClass="el-icon-edit" content="编辑" @click="edit(scope.row)" v-if="scope.row.status==0"></iconBtn>
                        <iconBtn iconClass="el-icon-d-arrow-right" content="付款" @click="pay(scope.row)" v-if="scope.row.status==0"></iconBtn>
                        <iconBtn iconClass="el-icon-minus" content="删除" @click="dele(scope.row)" v-if="scope.row.status==0"></iconBtn>
                    </el-button-group>
                </template>
            </el-table-column>
        </elemTable>
        <el-dialog
		  title="付款信息"
		  :visible.sync="dialogVisible"
		  width="30%">
		  <el-form :model="form">
		    <el-form-item label="付款人:" :label-width="formLabelWidth">
		      <div style="width: 220px;">
		      	     <el-input placeholder="请输入内容" v-model="form.payby" autocomplete="off"></el-input>
		      </div>
		    </el-form-item>
		    <el-form-item label="付款日期:" :label-width="formLabelWidth">
		    	<div style="width: 220px;">
		             <el-date-picker v-model="form.paydate" type="datetime" valueFormat="yyyy-MM-dd hh:mm:ss"
                              laceholder="付款日期">
		             </el-date-picker>
                </div>
		    </el-form-item>
		  </el-form>
		  <span slot="footer" class="dialog-footer">
		    <el-button @click="cancelPay">取 消</el-button>
		    <el-button type="primary" @click="primaryPay">确 定</el-button>
		  </span>
		</el-dialog>
        <managementFeeDetailModal :modal="modalShow" :managementFeeDetailModalType='modalType' :extendModalType='extendType' v-if="modalShow" @submit="modalSubmit"
                             @close='detailModalClose' :tableRow='tableRow'></managementFeeDetailModal>
    </div>
</template>
<script>
    import mixin from '../mixin/mixin.js' //公共方法，包括主要的ajax
    import local from '../local.js'
    import configs from '../configs.js'
    import managementFeeDetailModal from './component/modal/managementFeeDetailModal.vue'

    export default {
        mixins: [mixin],
        components: {
            managementFeeDetailModal
        },
        data() {
            return {
                formLabelWidth: '120px',
            	dialogVisible: false,
            	dataDic: {
	            	cartypeList:[],
	            	customerList:[],
	            	statusList:[],
                },
                frontEndId: configs.frontEndId,
                searchForm: {
                    cartypeid: '',
                    customerid: '',
                    startTime: '',
                    endTime: ''
                },
                form:{
                	status:'',
                	id:'',
                	payby:'',
                	paydate:''
                },
                inDate: [],
                dataList: [],
                managementFeeDetailModal: false,
                tableRow: {},
                managementFeeDetailModalType: 'add',
                extendType: "",
                channelCode: '',
                isChannel: '',
                channelList: [],
                loginName: '',
                channelSearchList: [],
            }
        },
        mounted() {
             this.getInitData();
        },
        methods: {
        	getInitData(){
	        	//加载车辆类型
	        	this._ajax({
                    url: this.rootAPI + 'tmarCartype/list',
                    param: {},
                    arr: true
                })
                    .then((function(d) {
                        Object.assign(this.dataDic, {
                            cartypeList: d.aaData
                        });
                }).bind(this))
	        	//加载一级批发
	        	this._ajax({
                    url: this.rootAPI + 'customer/list',
                    param: {
                    	enabled:1,
	                    extend: '001'
                    },
                    arr: true
                })
                    .then((function(d) {
                        Object.assign(this.dataDic, {
                            customerList: d.aaData
                        });
                }).bind(this))
                //加载付款状态
	            this._ajax({
	                url: this.rootAPI, 
	                name: 'datadic/list',
	                param: {
	                    dataType: 'IS_PAYMENT',
	                    enabled: 1
	                }
	            }).then((d) => {
	            	for (var i=0;i<d.aaData.length;i++) {
	            		d.aaData[i].key=Number(d.aaData[i].key)
	            	}
	            	Object.assign(this.dataDic, {
                            statusList: d.aaData
                    });
                    this.searchTable();
	            })
        	},	
            searchTable() {
                let user = local.get('sessionUser');
                this.loginName = user.loginName
                this.channelCode = user.typeCode
                let typeId = user.typeId;
                if(this.loginName == 'admin'|| typeId == '0' || this.channelCode == '' || this.channelCode == '0' || this.channelCode.length == 0) {
                    //超级管理员
                    this.isChannel = false;
                } else {
                    this.searchForm.channelCode = this.channelCode;
                    this.isChannel = true;
                }
                var param = Object.assign({}, this.searchForm, {
                    pageNum: this.pageNum,
                    pageSize: this.pageSize,
                    isdelete: 0,
                    startTime: this.inDate[0],
                    endTime: this.inDate[1]
                })
                return this._ajax({
                    url: this.rootAPI,
                    name: 'tmarManagefeemain/list',
                    param: param,
                    loading: 'dataLoading'
                }).then(this.renderTable)
            },
            reset() {
                this.inDate = [];
                Object.assign(this.searchForm, {
                    cartypeid: '',
                    customerid: '',
                    status:''
                })
                this.handleCurrentChange(1)
            },
            dele(row) {
                this.confirm('确定删除？', (function () {
                    this._ajax({
                        url: this.rootAPI + 'tmarManagefeemain/updatedel',
                        param: {
                        	id:row.id,
                        	isdelete:1
                        },
                        arr: true
                    }).then((function (d) {
                            this.$message({
                                type: 'success',
                                message: '删除成功'
                            });
                            this.handleCurrentChange(1)
                        }).bind(this))
                }).bind(this))
            },
            pay(row){
            	this.dialogVisible = true
            	this.form.paydate=this.formatDateTime(new Date());
            	this.form.id=row.id;
            	this.form.status=1;
            },
            primaryPay(){
            	this._ajax({name: 'tmarManagefeemain/updatePay', param: this.form}).then((function (d) {
	                    if (d.state === 0) {
	                        this.$message({type: 'success', message: '付款完成'});
	                        this.dialogVisible = false;
			            	this.form.paydate="";
			            	this.form.id="";
			            	this.form.status="";
			            	this.form.payby="";
		                }
                        this.handleCurrentChange(1);
	            }).bind(this));
            },
            cancelPay(){
            	this.form.paydate="";
            	this.form.id="";
            	this.form.status="";
            	this.form.payby="";
            	this.dialogVisible = false;
            },
            lookOver(row) {
                this.tableRow = row;
                this.modalCheck();
            },
            edit(row) {
                this.tableRow = row;
                this.modalEdit();
                this.extendType = "";
            },
            add(row) {
                this.tableRow = null;
                this.modalAdd();
                this.extendType = "";
            },
            detailModalClose() {
                this.searchTable();
                this.modalClose();
            },
            formatDateTime(date) {
                var y = date.getFullYear();
                var m = date.getMonth() + 1;
                m = m < 10 ? ('0' + m) : m;
                var d = date.getDate();
                d = d < 10 ? ('0' + d) : d;
                var h = date.getHours();
                var minute = date.getMinutes();
                var ss = date.getSeconds();
                h = h < 10 ? ('0' + h) : h;
                minute = minute < 10 ? ('0' + minute) : minute;
                ss = ss < 10 ? ('0' + ss) : ss;
                return y + '-' + m + '-' + d + ' ' + h + ':' + minute + ':' + ss;
            }
        }
    }
</script>