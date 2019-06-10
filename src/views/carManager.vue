<template>
	<div>
		<searchInputItems>
			<searchInputItem name="名称">
				<inputItem :value.sync="searchForm.name" @enter="searchTable"></inputItem>
			</searchInputItem>

		</searchInputItems>
		<optionItems>
			<template slot="right">
				<el-button-group>
					<iconBtn iconClass="el-icon-plus" content="新增" @click="addTable" type="success">新增</iconBtn>
					<iconBtn iconClass="el-icon-search" content="查询" @click="searchTable" type="primary">查询</iconBtn>
					<!--<iconBtn iconClass="el-icon-minus" content="批量删除" @click="deleteTable" type="danger">批量删除</iconBtn>-->
					<iconBtn iconClass="el-icon-refresh" content="重置" @click="reset">重置</iconBtn>
				</el-button-group>
			</template>
		</optionItems>
		<elemTable :dataList="dataList" :currentPage='pageNum' :pageSize="pageSize" :pageTotal="pageTotal" :loading="dataLoading" @sizeChange="handleSizeChange" @currentChange="handleCurrentChange" @selectionChange="selectionChange">
			<!--<el-table-column type="selection" width="55"></el-table-column>-->
			<el-table-column prop="name" label="车辆类型名称">
				<template slot-scope="scope">
					<toolTip :content="scope.row.name">
						<span>{{scope.row.name}}</span>
					</toolTip>
				</template>
			</el-table-column>
			<el-table-column prop="tare" label="车辆皮重(kg)">
				<template slot-scope="scope">
					<toolTip :content="scope.row.tare">
						<span>{{scope.row.tare}}</span>
					</toolTip>
				</template>
			</el-table-column>
			<el-table-column label="操作">
				<template slot-scope="scope">
					<iconBtn iconClass="el-icon-edit" content="编辑" @click="lookOver(scope.row)"></iconBtn>
				</template>
			</el-table-column>
		</elemTable>
		<carTypeAdd :modal='advertisementPositionModal' :advertisementPositionModalType="modalType" @add='modalAdd' v-if='advertisementPositionModal' @close='advertisementPositionModalClose' :tableRow='tableRow'></carTypeAdd>
	</div>
</template>
<script>
	import local from "../local.js";
	import mixin from "../mixin/mixin.js";
	import carTypeAdd from "./component/modal/carTypeAdd.vue";
	export default {
		mixins: [mixin],
		components: {
			carTypeAdd
		},
		data() {
			return {
				dataList: [],
				searchForm: {
					name: "",
				},
				advertisementPositionModal: false,
				modalType: "",
			};
		},
		mounted() {
			this.searchTable();
		},
		methods: {
			searchTable() {
				Object.assign(this.searchForm, {
					pageNum: this.pageNum,
					pageSize: this.pageSize
				});
				return this._ajax({
					url: this.rootAPI,
					name: "tmarCartype/list",
					param: this.searchForm,
					loading: "dataLoading"
				}).then(this.renderTable);
			},
			addTable() {
				this.modalType = "add";
				this.tableRow = {};
				this.advertisementPositionModal = true;
			},
			reset() {
				this.searchForm.name = "";
				this.searchForm.code = "";
				this.searchTable()
			},
			lookOver(o) {
				this.tableRow = o;
				this.modalType = "edit";
				this.advertisementPositionModal = true;
			},
			modalAdd(o) {
				var method = o.id > 0 ? "tmarCartype/update" : "tmarCartype/create";
				this._ajax({
						url: this.rootAPI + method,
						param: o,
						arr: true
					})
					.then(
						function(d) {
							if(d.state == 0) {
								this.$message({
									type: "success",
									message: "操作成功"
								});
							} else {
								this.$message({
									type: "failure",
									message: d.msg
								});
							}
							//this.$emit("submit");
						}.bind(this)
					)
					.then(this.searchTable);
			},
			advertisementPositionModalClose() {
				this.advertisementPositionModal = false;
			},
		}
	};
</script>