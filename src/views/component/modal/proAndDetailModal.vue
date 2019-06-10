<template>
	<el-dialog custom-class="jz-modal" title="批量新增商品模板" :visible="modal" :before-close="beforeClose" :close-on-click-modal="false" :width="modalWidth">
        <el-form class="modal-form" v-if="modal" :model="form" ref="form" :inline="true" :rules="rules" label-width="100px">
            <el-row>
                <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
                    <el-form-item label="商品分类" :prop="categoryId">
                        <selectInput :value.sync="form.categoryId" >
							<el-option
						      v-for="item in categoryFirstLevelList"
						      :key="item.id"
						      :label="item.name"
						      :value="item.id">
						    </el-option>
						</selectInput>
                    </el-form-item>
                </el-col>
                <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
                    <el-form-item label="供应商" :prop="customerName">
                        <inputItem :value.sync="form.customerName" :append="true" :readonly="true">
					    	<elBtn @click="selectSupply()" text="选择" type="primary" slot="append"></elBtn>
					    </inputItem>
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>
        <div slot="footer" class="dialog-footer flex-x-end">
            <elBtn @click="cancel" text="取消"></elBtn>
            <elBtn @click="valideSubmit" text="提交" type="primary"></elBtn>
        </div>
        
        <el-dialog custom-class="jz-modal" title="用户列表" :visible="customerModal" :before-close="beforeCloseCustomerModal" :close-on-click-modal="false" :width="modalWidth" append-to-body>
			<searchInputItems>
				<searchInputItem name="供应商名称">
					<inputItem :value.sync="searchForm.name" placeHolder="请输入供应商名称"></inputItem>
				</searchInputItem>
			</searchInputItems>
			<!-- 操作按钮 -->
			<optionItems>
				<template slot="right">
					<el-button-group>
						<iconBtn iconClass="el-icon-search" content="查询" @click="searchTable" type="primary">查询</iconBtn>
						<iconBtn iconClass="el-icon-refresh" content="重置" @click="resetCustomerList">重置</iconBtn>
					</el-button-group>
				</template>
			</optionItems>
			<elemTable :dataList="dataList" :currentPage='pageNum' :pageSize="pageSize" :pageTotal="pageTotal" :loading="dataLoading" 
				@sizeChange="handleSizeChange" @currentChange="handleCurrentChange" @selectChange="customerSelectionChange" :highlightCurrentRow="true">
				<el-table-column prop="customerName" label="商户名称">
					<template slot-scope="scope">
						<toolTip :content="scope.row.name">
							<span>{{scope.row.name}}</span>
						</toolTip>
					</template>
				</el-table-column>
			</elemTable>
			<div slot="footer" class="dialog-footer flex-x-end">
	            <elBtn @click="cancelCustomerModal" text="取消"></elBtn>
	            <elBtn @click="submitCustomerModal" text="提交" type="primary"></elBtn>
	        </div>
		</el-dialog>
    </el-dialog>
</template>
<script>
import mixin from '../../../mixin/mixin.js'
import configs from '../../../configs.js'
	export default {
        mixins: [mixin],
		data() {
			return {
				form: {
                    customerId: '',
                    categoryId: '',
                    channelCode: '',
                },
                searchForm: {
                	keyWord: '',
                	'customerType':'merchant',
                },
                rules: {
                    customerId: [{required: true, message: '供应商不能为空' }],
                    categoryId: [{required: true, message: '商品分类不能为空' }],
                },
                customerModal: false,
                categoryFirstLevelList: [],
                selectRow: '',
			}
		},
		props: {
			modal: {
				default: false
			},
		},
		mounted() {  
            this.init();
		},
		methods: {
			init() {
				this._ajax({url: this.rootAPI, name: 'category/queryCategorylistByParentCategoryIdIsNull', param: {}})
                .then((function(d) {
                    this.categoryFirstLevelList = d.aaData;
                }).bind(this))
			},
			cancel() {
				this.$emit('close')
			},
			valideSubmit() {
                this.$refs['form'].validate((valid) => {
                    if (valid) {
                    	if(!this.form.categoryId) {
                    		this.$message({ type: 'warning', message: '商品分类必选！' }); 
                    		return;
                    	}
                    	if(!this.form.customerId) {
                    		this.$message({ type: 'warning', message: '供应商必选！' }); 
                    		return;
                    	}
                        let method = 'product/addProAndDetailModal';
                        this._ajax({url: this.rootAPI, name: method, param: this.form})
                        .then((function(d) {
                            if(d.state == 0) {
                            	this.$message({ type: 'success', message: '操作成功' }); 
                            	this.cancel();
                            } else {
                            	this.$message({ type: 'error', message: '操作失败：'+d.msg }); 
                            }
                        }).bind(this))
                    }
                })
			},
            beforeClose(done) {
                this.cancel()
                done()
            },
            beforeCloseCustomerModal() {
            	this.customerModal = false;
            },
            resetCustomerList() {
            	Object.assign(this.searchForm, {
					name: '',
				})
				this.handleCurrentChange(1)
            },
            cancelCustomerModal() {
            	this.customerModal = false;
            },
            submitCustomerModal() {
            	this.form.customerId = this.selectRow.id;
            	this.form.customerName = this.selectRow.name;
            	this.form.channelCode = this.selectRow.channelCode;
            	this.customerModal = false;
            },
            searchTable() {
				Object.assign(this.searchForm, {
					pageNum: this.pageNum,
					pageSize: this.pageSize
				})
				return this._ajax({
					url: this.rootAPI,
					name: 'customer/queryPageByChannelCode',
					param: this.searchForm,
					loading: 'dataLoading'
				}).then(this.renderTable)
			},
            customerSelectionChange(val) {
            	this.selectRow = val
            },
            selectSupply() {
            	this.customerModal = true;
            	this.searchTable();
            },
		}
	}
</script>