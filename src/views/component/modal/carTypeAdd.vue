<template>
	<el-dialog custom-class="jz-modal" :title="advertisementPositionModalType === 'add' ? '新增车辆类型' : '编辑车辆类型'" :visible="modal" :before-close="beforeClose" :close-on-click-modal="false" :width="modalWidth">
		<el-form class="modal-form" v-if="modal" :model="form" ref="form" :inline="true" :rules="rules" label-width="120px">
			<el-row>
				<el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
					<el-form-item label="车辆类型名称" prop="name"  width="120px">
						<inputItem :value.sync="form.name"></inputItem>
					</el-form-item>
				</el-col>
				<el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
					<el-form-item label="车辆皮重(kg)" prop="tare">
						<inputItem :value.sync="form.tare"></inputItem>
					</el-form-item>
				</el-col>
			</el-row>
		
		</el-form>
		<div slot="footer" class="dialog-footer flex-x-end">
			<elBtn @click="cancel" text="取消"></elBtn>
			<elBtn @click="submit" text="提交" type="primary"></elBtn>
		</div>
	</el-dialog>
</template>
<script>
	import local from "../../../local.js";
	import mixin from "../../../mixin/mixin.js";
	import configs from "../../../configs.js";
	export default {
		mixins: [mixin],
		data() {
			var vm = this
			return {
				msgColor: "red",
				textLeft: "left",
				msg: "",
				pipor: "",
				none: true,
				form: {
					name: "",
					tare: "",
				},
				typeCode: "",
				rules: {
					name: [{
							required: true,
							message: "车辆类型名称不能为空"
						},
						this._ruleLength(50),
						{
							validator: function(rule, value, callback) {
								if(
									this.advertisementPositionModalType != "add" &&
									this.tableRow.jobno == value
								) {
									callback();
								} else {
									this._ajax({
										url: this.rootAPI,
										name: "tmarCartype/list",
										param: {
											name: this.form.name
										},
										loading: "dataLoading"
									}).then(function(d) {
										if(d.state === 0 && d.dataCount > 0 && vm.tableRow.id !=d.aaData[0].id ) {
											callback(new Error("车辆类型名称已存在"));
										} else {
											callback();
										}
									});
								}
							}.bind(this),
							trigger: "blur"
						}
					],
	
					tare: [{
							required: true,
							message: "车辆皮重不能为空",
							trigger: "blur"
						},
						this._ruleLength(50)
					],

				}
			};
		},
		props: {
			modal: {
				default: false
			},
			tableRow: {
				default: function() {
					return {};
				}
			},
			advertisementPositionModalType: {
				default: "add"
			}
		},
		mounted() {
			if(this.sorterModalType != "add") {
				Object.assign(this.form, this.tableRow);
			}
		},
		methods: {
			cancel() {
				this.$emit("close");
			},
			submit() {
				var sf = this;
				let user = local.get("sessionUser");
				this.$refs["form"].validate(valid => {
					if(valid) {
						var o = {}
						o = {
							id: sf.tableRow.id || null,
							name: sf.form.name,
							tare: sf.form.tare,
							createdPersonId: parseInt(user.userId || 0),
							createdPersonName:user.nickName
						};
						sf.$emit("add", o);
						sf.cancel();
					} else {
						return false;
					}
				});
			},
			beforeClose(done) {
				this.cancel();
				done();
			}
		}
	};
</script>