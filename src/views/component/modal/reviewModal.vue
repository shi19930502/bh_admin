<template>
	<el-dialog custom-class="jz-modal" :width="modalWidth" title="评价详情页面" :close-on-click-modal='false' :visible="modal" :before-close='beforeClose'>
		<el-form class="modal-form" v-if="modal" :model="form" :inline="true" label-width="160px">
			<el-row>
				<el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
					<el-form-item label="订单号:" prop="orderUmber">
						<inputItem :disabled='formDisabled' :value.sync='form.orderUmber'></inputItem>
					</el-form-item>
				</el-col>
				<el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
					<el-form-item label="订单简介:" prop="orderSuggest">
						<inputItem :disabled='formDisabled' :value.sync='form.orderSuggest'></inputItem>
					</el-form-item>
				</el-col>
			</el-row>
			<el-row>
				<el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
					<el-form-item label="评价时间:" prop="reviewDate">
						<inputItem :disabled='formDisabled' :value.sync='form.reviewDate' ></inputItem>
					</el-form-item>
				</el-col>
				<el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
					<el-form-item label="评价人:" prop="reviewPersonName">
						<inputItem :disabled='formDisabled' :value.sync='form.reviewPersonName'></inputItem>
					</el-form-item>
				</el-col>
			</el-row>
			<el-row>
				<el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
					<el-form-item label="评价内容:" prop="reviewContent">
						<inputItem :disabled='formDisabled' :value.sync='form.reviewContent' type="textarea"></inputItem>
					</el-form-item>
				</el-col>
			</el-row>
			<div  v-for="item in scoreList">
				<el-row  > 
					<el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
						<el-form-item :label="item.reviewName">
						<el-rate v-model="item.score/20" disabled show-score text-color="#ff9900" :max="item.max"  score-template="{value}">
						</el-rate>
					</el-form-item>
					</el-col>
				</el-row>
				
			</div>
			
		</el-form>
	</el-dialog>
</template>

<script>
	import mixin from '../../../mixin/mixin.js' //公共方法，包括主要的ajax
	export default {
		mixins: [mixin],
		props: {
			modal: {
				default: false,
			},
			tableRow: {
				default: function() {
					return {}
				},
			}
		},
		data() {
			return {
				dataList: [],
				formDisabled: true,
				form: {

				},
				order:{
					
				},
				scoreList:[]
			}
		},
		mounted() {
			this.form = this.tableRow;
			this.modalForm();
		},
		methods: {
			modalForm() {
				this._ajax({
					url: this.tootAPI,
					name: 'orderitemreview/queryReviewAndScore',
					param: {
						orderId:this.tableRow.orderId
					}
				}).then((d) => {
					this.form = d.aaData[0];
					this.scoreList = d.aaData[1];
				})
				
			},
			beforeClose(done) {
				this.$emit('close')
				done()
			},
		},
	}
</script>