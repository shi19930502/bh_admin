<template>
    <div class="managementFeeDetailModal-modal">
        <el-dialog custom-class="jz-modal" width="70%"
                   :title="title"
                   :close-on-click-modal='false'
                   :visible="modal" :before-close='beforeClose'>
            <el-form class="modal-form" ref="form" v-if="modal" :model="form" :inline="true" :rules="rules" label-width="160px">
                <el-row>
                    <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
                        <el-form-item   label="商户名称:" v-if="managementFeeDetailModalType === 'check'">
                            <inputItem :disabled='formDisabled' :value.sync='form.wholesalerName'></inputItem>
                        </el-form-item>
                        <el-form-item prop="wholesalerName" label="商户名称:" v-else>
                            <inputItem :value.sync="form.wholesalerName" :append="true" :readonly="true"
                                       v-if="managementFeeDetailModalType === 'add' || managementFeeDetailModalType === 'edit'">
                                <iconBtn iconClass="el-icon-search" content="商户查询" slot="append" @click="selectWholesaler"></iconBtn>
                            </inputItem>
                        </el-form-item>
                    </el-col>
                    <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
                        <el-form-item  label="车辆类型:" v-if="managementFeeDetailModalType === 'check'">
                            <inputItem :disabled='formDisabled' :value.sync='form.cartypeName'></inputItem>
                        </el-form-item>
                        <el-form-item prop="cartypeid" class="is-required" label="车辆类型:" v-else>
                            <selectInput :value.sync="form.cartypeid"
                            	         v-on:selectChange='cartypeChange'
                                         v-if="managementFeeDetailModalType === 'add' || managementFeeDetailModalType === 'edit'">
                                <el-option
                                        v-for="item in cartypeList"
                                        :key="item.key2"
                                        :label="item.value2"
                                        :value="item.key2">
                                </el-option>
                            </selectInput>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
                        <el-form-item label="皮重(千克):"  v-if="managementFeeDetailModalType === 'check'">
                            <inputItem :disabled='formDisabled' :value.sync='form.tare'></inputItem>
                        </el-form-item>
                        <el-form-item label="皮重(千克):" prop="tare" v-else>
                        	<el-input placeholder="请输入内容" v-model="form.tare" :disabled="true" type="number"></el-input>
                           <!-- <inputItem :value.sync='form.tare'></inputItem>-->
                        </el-form-item>
                    </el-col>
                    <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
                        <el-form-item label="净重(千克):"  v-if="managementFeeDetailModalType === 'check'">
                            <inputItem :disabled='formDisabled' :value.sync='form.netweight'></inputItem>
                        </el-form-item>
                        <el-form-item label="净重(千克):" prop="netweight" v-else>
                        	<el-input placeholder="请输入内容" v-model="form.netweight" :disabled="true" type="number"></el-input>
                            <!--<inputItem :value.sync="form.netweight" type="number">
                            </inputItem>-->
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
                        <el-form-item label="总重量(千克):"  v-if="managementFeeDetailModalType === 'check'">
                            <inputItem :disabled='formDisabled' :value.sync='form.totalweight'></inputItem>
                        </el-form-item>
                        <el-form-item label="总重量(千克):" prop="totalweight" v-else>
                            <inputItem :value.sync='form.totalweight' type="number" @blur="changetotalweight(form.totalweight)"></inputItem>
                        </el-form-item>
                    </el-col>
                    <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
                        <el-form-item label="管理费:"  v-if="managementFeeDetailModalType === 'check'">
                            <inputItem :disabled='formDisabled' :value.sync='form.marTotalmanagefee'></inputItem>
                        </el-form-item>
                        <!--<el-form-item label="管理费:" prop="marTotalmanagefee" v-else>
                            <inputItem :value.sync="form.marTotalmanagefee" >
                            </inputItem>
                        </el-form-item>-->
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
                        <el-form-item label="付款人:"  v-if="managementFeeDetailModalType === 'check'">
                            <inputItem :disabled='formDisabled' :value.sync='form.payby'></inputItem>
                        </el-form-item>
                        <!--<el-form-item label="付款人:" prop="payby" v-else>
                            <inputItem :value.sync='form.payby'></inputItem>
                        </el-form-item>-->
                    </el-col>
                    <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
                        <el-form-item label="登记人:"  v-if="managementFeeDetailModalType === 'check'">
                            <inputItem :disabled='formDisabled' :value.sync='form.createdby'></inputItem>
                        </el-form-item>
                        <!--<el-form-item label="登记人:" prop="createdby" v-else>
                            <inputItem :value.sync="form.createdby" >
                            </inputItem>
                        </el-form-item>-->
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
                        <!--<el-form-item label="付款时间:"
                                      v-if="managementFeeDetailModalType === 'add' || managementFeeDetailModalType === 'edit'"
                                      prop="inDate">
                            <el-date-picker v-model="form.paydate" type="datetime" valueFormat="yyyy-MM-dd hh:mm:ss"
                                            placeholder="付款时间"></el-date-picker>
                        </el-form-item>-->
                        <el-form-item label="付款时间:" prop="paydate" v-if="managementFeeDetailModalType === 'check'">
                            <inputItem :disabled='formDisabled' :value.sync='form.paydate'></inputItem>
                        </el-form-item>
                    </el-col>
                    <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
                        <el-form-item  label="付款状态:" v-if="managementFeeDetailModalType === 'check'">
                            <span v-for="item in statusList">
						      <span v-if="form.status == item.key1">{{item.value1}}</span>
						    </span>
                        </el-form-item>
                        <!--<el-form-item class="is-required" label="付款状态:" v-else>
                            <selectInput :value.sync="form.status"
                                         v-if="managementFeeDetailModalType === 'add' || managementFeeDetailModalType === 'edit'">
                                <el-option
                                        v-for="item in statusList"
                                        :key="item.key1"
                                        :label="item.value1"
                                        :value="item.key1">
                                </el-option>
                            </selectInput>
                        </el-form-item>-->
                    </el-col>
                </el-row>
            </el-form>
            <el-tabs v-model="tabModal">
                <el-tab-pane label="管理费明细" name="first">
                    <searchInputItems v-if="managementFeeDetailModalType === 'add' || managementFeeDetailModalType === 'edit'">
                        <searchInputItem name="选择商品">
                            <inputItem :append="true" :readonly="true" placeHolder="请选择商品">
                                <iconBtn iconClass="el-icon-search" content="商品查询" slot="append" @click="selectProCategory"></iconBtn>
                            </inputItem>
                        </searchInputItem>
                    </searchInputItems>
                    <elemTable
                            :dataList="dataList"
                            @sizeChange='handleSizeChange'
                            @currentChange='handleCurrentChange'
                            :currentPage='pageNum'
                            :pageSizes='pageSizes'
                            :pageSize='pageSize'
                            type="text"
                            :pageTotal='pageTotal'
                            :tableBorder="tableBorder"
                            :showPagination="managementFeeDetailModalType === 'check' ? true : false" :highlightCurrentRow="true">
                        <el-table-column show-overflow-tooltip property="categoryname" label="分类名称"
                                         min-width="80">
                        </el-table-column>
                        <el-table-column show-overflow-tooltip prop="price" label="费率(元)" min-width="60">
                            <template slot-scope="scope">
                                <div class="flex-y-center">
                                    <div>{{scope.row.price}}</div>
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column show-overflow-tooltip prop="weight" label="重量(千克)" min-width="60" class="is-required">
                            <template slot-scope="scope">
                                <div class="flex-y-center">
                                    <inputItem :value.sync="scope.row.weight"
                                               v-if="managementFeeDetailModalType === 'add' || managementFeeDetailModalType === 'edit'"
                                               @blur="changeWeightC(scope.row)"
                                               type="number"></inputItem>
                                    <div v-else>{{scope.row.weight}}</div>
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column show-overflow-tooltip prop="managefee" label="管理费(元)" min-width="60" >
                            <template slot-scope="scope">
                                <div class="flex-y-center">
                                    <div>{{scope.row.managefee}}</div>
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column label="操作" fixed="right"
                                         v-if="managementFeeDetailModalType === 'add' || managementFeeDetailModalType === 'edit'">
                            <template slot-scope="scope">
                                <iconBtn iconClass="el-icon-remove" content="删除" @click="deleteRow(scope.$index, scope.row)"></iconBtn>
                            </template>
                        </el-table-column>
                    </elemTable>
                </el-tab-pane>
            </el-tabs>
            <div slot="footer" class="dialog-footer flex-x-end"
                 v-if="managementFeeDetailModalType === 'add' || managementFeeDetailModalType === 'edit'">
                <elBtn @click="cancel" text="取消">取消</elBtn>
                <elBtn @click="submit" text="提交" type="primary">提交</elBtn>
            </div>
        </el-dialog>
        <selectCategoryModal v-if="CategoryModal" :modal="CategoryModal" :parentDataList="dataList" :customerId="customerIdSelected"
                                @close="CategoryModalClose"
                                @submit="CategoryModalSubmit"></selectCategoryModal>
        <selectPrimaryWholesalerModal v-if="wholesalerModal" :modal="wholesalerModal" @close="wholesalerModalClose"
                               @submit="wholesalerModalSubmit"></selectPrimaryWholesalerModal>
    </div>
</template>

<script>
    import mixin from '../../../mixin/mixin.js' //公共方法，包括主要的ajax
    import local from '../../../local.js'
    import configs from '../../../configs.js'
    import selectPrimaryWholesalerModal from './selectPrimaryWholesalerModal.vue'
    import selectCategoryModal from './selectCategoryModal.vue'

    export default {
        mixins: [mixin],
        components: {selectPrimaryWholesalerModal, selectCategoryModal},
        props: {
            modal: {
                default: false,
            },
            managementFeeDetailModalType: {
                default: 'add'
            },
            extendModalType: {
                default: ""
            },
            tableRow: {
                default: function () {
                    return {}
                },
            }
        },
        data() {
            return {
            	cartypeList:[],
            	statusList:[],
                frontEndId: configs.frontEndId,
                dataList: [],
                wholesalerModal: false,
                CategoryModal: false,
                formDisabled: true,
                title:"",
                addressList: [],
                districList: [],
                tableBorder: true,
                voucherList: [],
                customerIdSelected: "",
                form: {
                    wholesalerName: '',
                    cartypeid: '',
                    totalweight: '',
                    tare: '',
                    netweight: '', 
                    marTotalmanagefee: '',     
                    createdby: '',
                    status: '',
                    paydate: '',
                    payby: ''
                },
                tabModal: 'first',
                validConfirm: {
                    flag: true,
                    msg: ''
                },
                rules: { 
                    wholesalerName: [{required: true, message: '商户名称不能为空', trigger: 'blur'}],
                    cartypeid: [{required: true, message: '车辆类型不能为空',trigger: 'change'}],
                }
            };
        },
        mounted() {
            this.initTitle();
            //加载车辆类型
            this._ajax({
                url: this.rootAPI, 
                name: 'tmarCartype/list',
                param: {}
            }).then((d) => { 
                if (d.aaData && d.aaData.length > 0) {
                    this.cartypeList = [];
                    for (var a = 0; a < d.aaData.length; a++) {
                        this.cartypeList.push({
                            key2: d.aaData[a].id,
                            value2: d.aaData[a].name
                        });
                    }
                }
            })
            //加载付款状态
            this._ajax({
                url: this.rootAPI, 
                name: 'datadic/list',
                param: {
                    dataType: 'IS_PAYMENT',
                    enabled: 1
                }
            }).then((d) => { 
                if (d.aaData && d.aaData.length > 0) {
                    this.statusList = [];
                    for (var a = 0; a < d.aaData.length; a++) {
                        this.statusList.push({
                            key1: d.aaData[a].key,
                            value1: d.aaData[a].value
                        });
                    }
                }
            })
        },
        methods: {
            checkVoucherInputRule() {
                return {
                    validator: (function(rule, value, callback) {
                        if(!this.voucherInput) {
                            callback(new Error(this.voucherValueSelected + '不能为空'));
                        } else {
                            callback();
                        }
                    }.bind(this)), trigger: 'blur'
                }
            },
            checkAreaNameProvince() {
                return {
                    validator: (function(rule, value, callback) {
                        if(!this.areaNameProvince) {
                            callback(new Error('产地不能为空，且必须具体到省级'))
                        } else {
                            callback();
                        }
                    }.bind(this)), trigger: 'change'
                }
            },
            initTitle(){
                if(this.managementFeeDetailModalType === 'add'&& this.extendModalType==''){
                    this.title = '新增管理费记录';
                }else if(this.managementFeeDetailModalType === 'edit' && this.extendModalType==''){
                    this.title = '编辑管理费记录';
                    this.form=this.tableRow;
                    this.customerIdSelected = this.tableRow.customerid;
                    this.searchTable();
                }else{
                    this.title = '管理费详情';
                    this.form=this.tableRow;
                    this.searchTable();
                }
            },
            searchTable(){
                const _this = this;
                this._ajax({
                    url: this.rootAPI, name: 'tmarManagefeedetail/list',
                    param: {
                        pageNum: this.pageNum,
                        pageSize: this.pageSize,
                        mainid: this.tableRow.id
                    }
                }).then(function (d) {
                	for(var i=0;i<d.aaData.length;i++){
                	  _this.dataList.push({
                	  	categoryname:d.aaData[i].categoryname,
                	  	name:d.aaData[i].categoryname,
                	  	price:d.aaData[i].price,
                	  	weight:d.aaData[i].weight,
                	  	managefee:d.aaData[i].managefee,
                	  	id:d.aaData[i].id,
                	  	categoryid:Number(d.aaData[i].categoryid)
                	  })
                	}
                    _this.pageTotal=d.aaData.length;
                })
            },
            changePrice(val) {
                let reg = /^\d{1,5}(\.\d{1,2})?$/;
                if (!this.regFloatPlus.test(val) || val <= 0) {
                    this.$message({type: 'warning', message: '费率必填! 请选择存在费率的商品分类'});
                    Object.assign(this.validConfirm, {
                        flag: false,
                        msg: '费率不合法'
                    })
                }
                else if(!reg.test(val)) {
                    let msg = "费率不符合规定（必须是0-100000）";
                    this.$message({ type: 'warning', message: msg});
                    Object.assign(this.validConfirm, {
                        flag: false,
                        msg: '费率不合法'
                    })
                }
                else {
                    if (this.validConfirm.msg == '费率不合法') {
                        Object.assign(this.validConfirm, {
                            flag: true,
                            msg: ''
                        })
                    }
                }
            },
            changeWeight(val) {
                let reg = /^\d{1,5}(\.\d{1,2})?$/;
                if (!this.regFloatPlus.test(val) || val <= 0) {
                    this.$message({type: 'warning', message: '重量必填! 请输入大于0的两位小数'});
                    Object.assign(this.validConfirm, {
                        flag: false,
                        msg: '重量输入不合法'
                    })
                }
                else if(!reg.test(val)) {
                    let msg = "重量不符合规定（重量必须是0-100000）";
                    this.$message({ type: 'warning', message: msg});
                    Object.assign(this.validConfirm, {
                        flag: false,
                        msg: '重量输入不合法'
                    })
                }
                else {
                    if (this.validConfirm.msg == '重量输入不合法') {
                        Object.assign(this.validConfirm, {
                            flag: true,
                            msg: ''
                        })
                    }
                }
            },
            changeWeightC(row) {
                let reg = /^\d{1,5}(\.\d{1,2})?$/;
                var val=row.weight;
                if (!this.regFloatPlus.test(val) || val <= 0) {
                    this.$message({type: 'warning', message: '重量必填! 请输入大于0的两位小数'});
                    Object.assign(this.validConfirm, {
                        flag: false,
                        msg: '重量输入不合法'
                    })
                }
                else if(!reg.test(val)) {
                    let msg = "重量不符合规定（重量必须是0-100000）";
                    this.$message({ type: 'warning', message: msg});
                    Object.assign(this.validConfirm, {
                        flag: false,
                        msg: '重量输入不合法'
                    })
                }
                else {
                    if (this.validConfirm.msg == '重量输入不合法') {
                        Object.assign(this.validConfirm, {
                            flag: true,
                            msg: ''
                        })
                    }
                }
                row.managefee=(row.weight*row.price).toFixed(2);
            },
            changetotalweight(){
            	this.form.netweight=Number(this.form.totalweight)-Number(this.form.tare);
            },
            cancel() {
                this.$emit('close')
            },
            submit() {
                this.$refs['form'].validate((valid) => {
                    if (!valid) {
                        this.validConfirm.flag = false;
                        this.validConfirm.msg = "请填写必填字段";
                    }else{
                        this.validConfirm.flag = true;
                    }
                })
                let details = this.dataList;
                if (details.length === 0) {
                    this.$message({type: 'warning', message: "至少填写一条进场明细记录"});
                    return;
                }
                var count=0;
                details.forEach((function (detail) {
                	this.changeWeight(detail.weight);
                    this.changePrice(detail.price);
                    count=count+Number(detail.weight);
                }).bind(this))
                if(this.form.netweight<0||this.form.totalweight<0){
                	this.$message({type: 'warning', message: "重量不能小于0,请重新输入"});
                    return;
                }
                if(count!=this.form.netweight){
                	this.$message({type: 'warning', message: "明细总重量与净重不一致,请重新填写明细重量"});
                    return;
                }
                if (!this.validConfirm.flag) {
                    this.$message({type: 'warning', message: this.validConfirm.msg });
                    return;
                } else {
	                Object.assign(this.form, {
	                    tmarManagefeedetailEntities: JSON.stringify(details)
	                });
	                if(this.managementFeeDetailModalType === 'add'&& this.extendModalType==''){
	                	this._ajax({name: 'tmarManagefeemain/create', param: this.form}).then((function (d) {
		                    if (d.state === 0) {
		                        this.$message({type: 'success', message: '操作完成'});
		                        this.$emit('submit')
		                        this.$emit('close')
			                }
		                }).bind(this));
	                }else{
	                	this._ajax({name: 'tmarManagefeemain/update', param: this.form}).then((function (d) {
		                    if (d.state === 0) {
		                        this.$message({type: 'success', message: '操作完成'});
		                        this.$emit('submit')
		                        this.$emit('close')
			                }
		                }).bind(this));
	                }
                }
            },
            beforeClose(done) {
                this.$emit('close')
                done()
            },
            deleteRow($index, row) {
                var arr = []
                this.dataList.forEach(function (item, index) {
                    if (index !== $index) {
                        arr.push(item)
                    }
                })
                this.dataList = arr
            },
            selectWholesaler() {
                this.wholesalerModal = true
            },
            wholesalerModalClose() {
                this.wholesalerModal = false
            },
            wholesalerModalSubmit(row) {
                Object.assign(this.form, {
                    customerid: row.id,
                    wholesalerName: row.name
                });
                this.customerIdSelected = row.id;
                this.wholesalerModal = false;
                this.dataList = [];
            },
            selectProCategory() {
                if (null == this.form.wholesalerName || '' == this.form.wholesalerName) {
                    this.$message({type: 'warning', message: "必须先选择商户，然后再选择该商户的商品"});
                    return;
                }
                this.CategoryModal = true
            },
            CategoryModalClose() {
                this.CategoryModal = false
            },
            CategoryModalSubmit(rows) {
                rows.forEach((function (row) {
                    var detail = {};
                    detail['id'] = row.id;
                    detail['name'] = row.name;
                    detail['categoryid'] = row.categoryId;
                    detail['categoryname'] = row.categoryName;
                    detail['price'] = row.managefee;
                    detail['managefee'] = null;
                    this.dataList.push(detail);
                }).bind(this));
                this.pageTotal=this.dataList.length;
                this.CategoryModal = false;
            },
            countryChange(row) {
                const tmpVoucherInput = this.voucherInput
                this.voucherInput = '';
                this.voucherInput = tmpVoucherInput;
            },
            cartypeChange(key) {
                this._ajax({
                url: this.rootAPI, 
                name: 'tmarCartype/list',
                param: {
                	id:key
                }
	            }).then((d) => { 
	                if (d.aaData && d.aaData.length > 0) {
	                	  this.form.tare=d.aaData[0].tare;
	                	if(Number(this.form.totalweight)>0){
	                	  this.form.netweight=Number(this.form.totalweight)-Number(this.form.tare);
	                	}
	                }
	            })
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
        },
    }
</script>
<style lang="sass">
    .managementFeeDetailModal-modal{
        .row-block{
            .el-form-item__content {
                width: calc(100% - 110px);
                & > div {
                    width: 100%;
    } }
        .option-box{
            width: 100%;
            .search-input-item-content {
                width: calc(100% - 120px);
    } } } }
</style>