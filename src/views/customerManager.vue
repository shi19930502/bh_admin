<template>
	<div id='customenManager' class="page-user">
		<!-- 查询条件 -->
		<searchInputItems>
			<searchInputItem name="渠道" v-if="thisUser.userId == 0">
				<selectInput :value.sync="searchForm.searchChannelCode" @selectChange="searchTable" :clearable="searchClearable">
					<el-option v-for="item in channelList" :key="item.name" :label="item.name" :value="item.code">
					</el-option>
				</selectInput>
			</searchInputItem>
			<searchInputItem name="用户类型">
				<selectInput :value.sync="searchForm.key" @selectChange="searchTable" :clearable="searchClearable">
					<el-option v-for="item in keyList" :key="item.value" :label="item.value" :value="item.key">
					</el-option>
				</selectInput>
			</searchInputItem>
				<searchInputItem name="状态">
				<selectInput :value.sync="searchForm.enabled" @selectChange="searchTable" :clearable="searchClearable">
					<el-option v-for="item in enabledList" :key="item.value" :label="item.value" :value="item.key">
					</el-option>
				</selectInput>
			</searchInputItem>
			<searchInputItem name="经营户名称">
				<inputItem :value.sync="searchForm.name" @enter="searchTable"></inputItem>
			</searchInputItem>
			<searchInputItem name="联系电话">
				<inputItem :value.sync="searchForm.tel" @enter="searchTable"></inputItem>
			</searchInputItem>
			<searchInputItem name="法人代表">
				<inputItem :value.sync="searchForm.legalpepresent" @enter="searchTable"></inputItem>
			</searchInputItem>
		</searchInputItems>
		<!-- 操作按钮 -->
		<optionItems>
			<template slot="left">
				<el-button-group>
					<iconBtn iconClass="el-icon-plus" content="新增" @click="modalAdd">新增</iconBtn>
					<!--<iconBtn iconClass="el-icon-minus" content="删除" @click="dele"></iconBtn>-->
					<iconBtn iconClass="el-icon-search" content="查询" @click="searchTable">查询</iconBtn>
					<iconBtn iconClass="el-icon-refresh" content="重置" @click="reset">重置</iconBtn>
					<iconBtn iconClass="el-icon-search" content="系统全局数据校验" @click="dataCheck">系统全局数据校验</iconBtn>
					<!-- <iconBtn iconClass="el-icon-refresh" content="同步数据" @click="customerSyn" v-if="customerSynSwitch">同步数据</iconBtn> -->
				</el-button-group>
			</template>
		</optionItems>
		<!-- 表格 -->
		<elemTable :dataList="dataList" :currentPage='pageNum' :pageSize="pageSize" :pageTotal="pageTotal" :loading="dataLoading" @sizeChange="handleSizeChange" @currentChange="handleCurrentChange" @selectionChange="selectionChange">
			<el-table-column type="selection" width="55" v-if="sysId == 0"></el-table-column>
			<!--<el-table-column prop="channelName" label="渠道">
		    	<template slot-scope="scope">
		    		<toolTip :content="scope.row.channelName">
	    				<span v-if="!scope.row.rowEditable">{{scope.row.channelName}}</span>
    				</toolTip>
		      	</template>
		    </el-table-column>-->
			<el-table-column prop="id" label="备案用户ID" width="100">
				<template slot-scope="scope">
					<toolTip :content="scope.row.id">
						<span>{{scope.row.id}}</span>
					</toolTip>
				</template>
			</el-table-column>

			<el-table-column prop="code" label="经营户编码" width="120px">
				<template slot-scope="scope">
					<toolTip :content="scope.row.code">
						<span>{{scope.row.code}}</span>
					</toolTip>
				</template>
			</el-table-column>
			<el-table-column prop="name" label="经营户名称" width="200">
				<template slot-scope="scope">
					<toolTip :content="scope.row.name">
						<span>{{scope.row.name}}</span>
					</toolTip>
				</template>
			</el-table-column>
				<el-table-column prop="extend" label="注册类型" width="100">
				<template slot-scope="scope">
					<toolTip :content="_dicValue(scope.row.extend, dataDic.extend)">
						<span>{{_dicValue(scope.row.extend, dataDic.extend)}}</span>
					</toolTip>
				</template>
			</el-table-column>
			<el-table-column prop="remark" label="所在市场备注" width="100">
				<template slot-scope="scope">
					<toolTip :content="scope.row.remark">
						<span>{{scope.row.remark}}</span>
					</toolTip>
				</template>
			</el-table-column>
			<el-table-column label="二维码" width="130">
				<template slot-scope="scope">
					<el-button
							v-if='(scope.row.extend!=null&&scope.row.extend!="" &&scope.row.extend!="0" &&scope.row.extend!="005"  && scope.row.extend!="006")&&scope.row.enabled==1'
							@click="qrCode(scope.row)"
						>
						查看二维码
					</el-button>
				</template>
		    </el-table-column>
			<el-table-column prop="regId" label="工商注册号">
				<template slot-scope="scope">
					<toolTip :content="scope.row.regId">
						<span>{{scope.row.regId}}</span>
					</toolTip>
				</template>
			</el-table-column>
			<el-table-column prop="enabled" label="状态">
				<template slot-scope="scope">
					<toolTip :content="scope.row.enabled==1?'已激活':'未激活'">
						<el-tag type="success" v-if="scope.row.enabled ==1">已激活</el-tag>
						<el-tag type="danger" v-if="scope.row.enabled ==0">未激活</el-tag>
					</toolTip>
				</template>
			</el-table-column>
			<el-table-column prop="businessScopeStr" label="供应商品分类" width="110">
				<template slot-scope="scope">
					<toolTip :content="scope.row.businessScopeStr">
						<span>{{scope.row.businessScopeStr}}</span>
					</toolTip>
				</template>
			</el-table-column>
			<el-table-column prop="property" label="经营者性质">
				<template slot-scope="scope">
					<toolTip :content="_dicValue(scope.row.property, dataDic.customerProperty)">
						<span>{{_dicValue(scope.row.property, dataDic.customerProperty)}}</span>
					</toolTip>
				</template>
			</el-table-column>
			<el-table-column prop="type" label="经营类型" width="200">
				<template slot-scope="scope">
					<toolTip :content="_dicValue(scope.row.type, dataDic.customerType)">
						<span>{{_dicValue(scope.row.type, dataDic.customerType)}}</span>
					</toolTip>
				</template>
			</el-table-column>
			<el-table-column prop="tel" label="联系电话" width="100">
				<template slot-scope="scope">
					<toolTip :content="scope.row.tel">
						<span>{{scope.row.tel}}</span>
					</toolTip>
				</template>
			</el-table-column>


			<el-table-column prop="legalpepresent" label="法人代表">
				<template slot-scope="scope">
					<toolTip :content="scope.row.legalpepresent">
						<span>{{scope.row.legalpepresent}}</span>
					</toolTip>
				</template>
			</el-table-column>
			<el-table-column prop="tel" label="是否分拣">
				<template slot-scope="scope">
					<toolTip :content="scope.row.isSorter == null ? '否' : _dicValue(scope.row.isSorter, dataDic.whether)">
						<span>{{scope.row.isSorter == null ? '否' : _dicValue(scope.row.isSorter, dataDic.whether)}}</span>
					</toolTip>
				</template>
			</el-table-column>
			<el-table-column prop="tel" label="是否配送">
				<template slot-scope="scope">
					<toolTip :content="scope.row.isDistribution == null ? '否' : _dicValue(scope.row.isDistribution, dataDic.whether)">
						<span>{{scope.row.isDistribution == null ? '否' : _dicValue(scope.row.isDistribution, dataDic.whether)}}</span>
					</toolTip>
				</template>
			</el-table-column>

		<el-table-column prop="versionStatus" label="备案时间" width="150">
				<template slot-scope="scope">
					<toolTip :content="scope.row.recordDate">
						<span>{{scope.row.recordDate}}</span>
					</toolTip>
				</template>
			</el-table-column>

			<el-table-column label="操作" width="300" fixed="right">
				<template slot-scope="scope">
					<el-button-group>
						<iconBtn content="编辑" type="primary" @click="modalEdit(scope.row)">编辑</iconBtn>
						<!-- <iconBtn content="激活" type="success" @click="activateOrLogout(scope.row, 1)" v-if="scope.row.enabled == 0">激活</iconBtn>
						<iconBtn content="注销" type="warning" @click="activateOrLogout(scope.row, 0)" v-if="scope.row.enabled == 1">注销</iconBtn> -->
						<iconBtn content="关联城市平台" plain @click="relationMerchant(scope.row)" v-if="scope.row.relationId == null">关联城市平台</iconBtn>
						<iconBtn content="取消城市平台关联" type="danger" @click="cannelMerchant(scope.row)" v-if="scope.row.relationId != null">取消城市平台关联</iconBtn>
						<iconBtn content="用户列表" type="info" @click="showUserListDialog(scope.row)">用户列表</iconBtn>
					</el-button-group>
				</template>
			</el-table-column>
		</elemTable>
		<customerModal v-if="modalShow" :modal="modalShow" :customerModalType="modalType" @close="modalClose" :customer="modalObj" :dataDic="dataDic" :channelList="channelList" @submit="modalSubmit"></customerModal>
		<userListModal v-if="userListModalShow" :modal="userListModalShow" :userListModalType="userListModalType" @close="userListModalClose" :user="userObj" @submit="modalSubmit"></userListModal>
		<dataCheckModal v-if="dataCheckModalShow" :modal="dataCheckModalShow" @close="dataCheckModalClose"></dataCheckModal>
		<merchantModal v-if="merchantModalShow" :modal="merchantModalShow" :tableRow="tableRow" @close="merchantModalClose" @submit="merchantSubmit"></merchantModal>
		  <!--:fullscreen='true'-->
		<el-dialog
		  title="主体二维码"
		  :visible.sync="qrDialogVisible"
		  width="500px"
		  :before-close="handleClose">
		  <div class="qr_img">
		  	<div class="qr_img_c" ref='downQrImg' id='downQrImg'>
		  	<img src="../../lib/img/erWeiMaBJ/erweima.png"  v-show="(extendId != '005' && extendId != '006')"/>
				<!-- <img src="../../lib/img/erWeiMaBJ/caigou_bg.png"  v-show="extendId === '007'"/>
				<img src="../../lib/img/erWeiMaBJ/caigou_bg.png"  v-show="extendId === '004'"/>
				<img src="../../lib/img/erWeiMaBJ/tuancai_bg.png"  v-show="extendId === '002'"/>
				<img src="../../lib/img/erWeiMaBJ/tuancai_bg.png"  v-show="extendId === '003'"/> -->
			  	<div class='qr_code'>
			  		<qriously   v-show='false' ref='qriously' id='qriously' :value="initQCode" :size="350" />
			  		<img :src="imgSrc" alt="" />
						<div class="textStr">{{channeName}}</div>
						<div class="textStr">{{_dicValue(extendId, dataDic.extend)}}</div>
						<div class="textStr">{{'*'+shanghuName.substr(1,shanghuName.split('').length)}}</div>
			  	</div>
		  	</div>
			<iconBtn content="打印二维码" @click="printQRCode">打印二维码</iconBtn>
		  	<iconBtn content="下图二维码" @click="downImg">下载二维码</iconBtn>
		  </div>
		  <span slot="footer" class="dialog-footer">
		    <el-button @click="qrDialogVisible = false">关&nbsp;闭</el-button>
		    <!--<el-button type="primary" @click="qrDialogVisible = false">关&nbsp;闭</el-button>-->
		  </span>
		</el-dialog>
	</div>
</template>
<script>
	import local from '../local.js'
	import mixin from '../mixin/mixin.js'
	import customerModal from './component/modal/customerModal.vue'
	import userListModal from './component/modal/userListModal.vue'
	import dataCheckModal from './component/modal/dataCheckModal.vue'
	import merchantModal from './component/modal/merchantModal.vue'
	import html2canvas from 'html2canvas'
	export default {
		mixins: [mixin],
		components: {
			customerModal,
			userListModal,
			dataCheckModal,
			merchantModal,
		},

		data() {
			return {

				imgSrc:'',
				qrDialogVisible:false,
				isCode: false,//二维码
				initQCode: '',//二维码
				extendId:'',//二维码
				channeName:'',
				shanghuName:'',
				searchForm: {
					tel: '',
					legalpepresent: '',
					searchChannelCode: '',
					key: ''
				},
				dataDic: {
					userStatus: [],
					customerProperty: [],
					customerType: [],
					extend:[]
				},
				channelList: [],
				dataList: [],
				rowOBJ: {},
				searchClearable: true,
				thisUser: local.get('userinfo'),
				userListModalShow: false,
				userObj: '',
				customerSynSwitch: false,
				// keyList: [{
				// 	name: '供应商',
				// 	code: 'merchant'
				// }, {
				// 	name: '采购商',
				// 	code: 'buyer'
				// }, {
				// 	name: '配送商',
				// 	code: 'distribution'
				// }],
				 keyList: [],
				 enabledList:[{
					 value: '已激活',
				   key: '1'
				 },{
						value: '未激活',
				    key: '0'
				 }],
				dataCheckModalShow: false,
				merchantModalShow: false,
			}
		},
		mounted() {
			this._ajax({
					url: this.rootAPI,
					name: 'customer/getCustomerSynSwitch',
					param: {}
				})
				.then((function(d) {
					if(d.aaData == 'true') {
						this.customerSynSwitch = true
					}
				}).bind(this));
			this._ajax({
				url: this.rootAPI,
				name:"datadic/list",
				param: {dataType: "BEIHUAN_CUSTOMER_PROPERTY",extend:'true'}
			})
			.then((function(d) {
				Object.assign(this.dataDic, {
					extend: d.aaData
				})
			}).bind(this));
			this.getInitData();
			this.searchTable();
		},
		methods: {
			createImg(){
				return new Promise((resolve,reject)=>{
					var downQrImg=this.$refs.downQrImg
					var shareContent = downQrImg;
				    var width = shareContent.offsetWidth;
				    var height = shareContent.offsetHeight;
				    var canvas = document.createElement("canvas");
				    var scale = 1;
				    canvas.width = width * scale;
				    canvas.height = height * scale;
				    canvas.getContext("2d").scale(scale, scale);
				    var opts = {
				        scale: scale,
				        canvas: canvas,
				        logging: true,
				        width: width,
				        height: height
				    };
					html2canvas(document.querySelector("#downQrImg"),opts).then(canvas => {
						resolve(canvas)
					});
				})
			},
			downImg(){
				this.createImg().then((canvas)=>{
					var imgUri = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream"); // 获取生成的图片的url
//              	console.log('imgUri',imgUri)
//              	window.location.href = imgUri; // 下载图片
                	let elem = document.createElement('a');
					elem.setAttribute('href', imgUri);
					elem.setAttribute('download', '主体二维码.png');
					document.body.appendChild(elem);
					elem.click();
					document.body.removeChild(elem);
				})
			},
			printQRCode() {
				this.createImg().then((canvas)=>{
					var imgUri = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream"); // 获取生成的图片的url
					var printHtml = `<img src="${imgUri}" width="460px" height="690px" style="display:block;margin: auto;" /> `;
          console.log(printHtml);
					if (typeof LODOP === 'undefined') {
						console.log(typeof LODOP);
						this.$message({
							showClose: true,
							duration: 0,
							dangerouslyUseHTMLString: true,
							message: "<br><font color='#FF00FF' style='margin-top: 35px;float: right;'>打印控件未安装!点击这里<a href='CLodop_Setup_for_Win32NT.exe' target='_self'>执行安装</a>,安装后请刷新页面或重新进入。</font>"
						});
					} else {
						LODOP.PRINT_INIT("");
						LODOP.ADD_PRINT_HTM('4%', '15%', '95%', '100%', printHtml, )
						console.log(printHtml);
						LODOP.ADD_PRINT_BARCODE('18.8%', "37.8%", 235, 235, "QRCode");
						LODOP.PRINT()
					}
				})

			},
			getInitData() {
				//查询数据字典，用户状态
				this._searchDic('USER_STATE')
					.then((function(d) {
						let data = d.aaData;
						$.each(data, function(i, obj) {
							obj.key = Number(obj.key);
						});
						Object.assign(this.dataDic, {
							userStatus: data
						})
					}).bind(this))
				//查询数据字典，经营者类型
				this._searchDic('CUSTOMER_TYPE')
					.then((function(d) {
						let data = d.aaData;
						$.each(data, function(i, obj) {
							obj.key = Number(obj.key);
						});
						Object.assign(this.dataDic, {
							customerType: data
						})
					}).bind(this))
					//查询数据字典，经营者类型
				this._searchDic('BEIHUAN_CUSTOMER_PROPERTY')
					.then((function(d) {
						let data = d.aaData;
						this.keyList= d.aaData;
						$.each(data, function(i, obj) {
							obj.key = obj.key;
						});


						Object.assign(this.dataDic, {
							extend: data
						})
					}).bind(this));
				this._searchDic('WHETHER')
					.then((function(d) {
						let data = d.aaData;
						$.each(data, function(i, obj) {
							obj.key = Number(obj.key);
						});
						Object.assign(this.dataDic, {
							whether: data
						})
					}).bind(this))
				//查询数据字典,经营者性质
				this._searchDic('CUSTOMER_PROPERTY')
					.then((function(d) {
						Object.assign(this.dataDic, {
							customerProperty: d.aaData
						})
					}).bind(this))
				//查询渠道数据
				this._getChannelListOnUse(local.get("sessionUser").typeCode)
					.then((function(d) {
						Object.assign(this.channelList, d.aaData)
					}).bind(this))
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
			reset() {
				Object.assign(this.searchForm, {
					tel: '',
					legalpepresent: '',
					searchChannelCode: '',
					name: '',
					key: ''
				})
				this.handleCurrentChange(1)
			},
			dele() {
				if(this.delSelection.length === 0) {
					this.$message({
						type: 'info',
						message: '请选择行'
					});
				} else {
					let selection = this.delSelection
					this.confirm('确定删除？', (function() {
						var arr = [],
							o = {}
						selection.forEach(function(el) {
							arr.push(el.id)
						})
						o.id = arr
						this._ajax({
								url: this.rootAPI + 'customer/delete',
								param: o,
								arr: true
							})
							.then((function(d) {
								this.$message({
									type: 'success',
									message: '删除成功'
								});
								this.handleCurrentChange(1)
							}).bind(this))
					}).bind(this))
				}
			},
			delRow(row) {
				this.confirm('确定删除？', (function() {
					var o = {
						id: [row.id]
					}
					this._ajax({
							url: this.rootAPI + 'customer/delete',
							param: o,
							arr: true
						})
						.then((function(d) {
							this.$message({
								type: 'success',
								message: '删除成功'
							});
							this.handleCurrentChange(1)
						}).bind(this))
				}).bind(this))
			},
			activateOrLogout(row, type) {
				let user = local.get('userinfo');
				let msg = '确定激活该账户？';
				if(type == 0) msg = '确定注销该账户？';
				this.confirm(msg, (function() {
					if(row.channelCode==null ||row.channelCode==''){
						this.$message({
								type: 'error',
								message: '渠道信息为空,操作失败'
							});
							return;
					}
					var o = {
						id: [row.id],
						enabled: type,
						customerProperty:row.extend
					}
					this._ajax({
							url: this.rootAPI + 'customer/update',
							param: o,
							arr: true
						})
						.then((function(d) {
							if(d.state != 0) this.$message({
								type: 'success',
								message: d.msg
							});
							else this.$message({
								type: 'success',
								message: '操作成功'
							});
							this.handleCurrentChange(1)
						}).bind(this))
				}).bind(this))
			},
			cancelEdit(o) {
				Object.assign(o, this.rowOBJ[o.id])
			},
			submitEdit(o) {
				if(!o.deviceModel || !o.manufacturer) {
					this.$message({
						type: 'error',
						message: '型号或生产厂家不能为空'
					});
					o.rowError = true
				} else {
					this._ajax({
							url: this.rootAPI + 'customer/update',
							param: o,
							loading: 'dataLoading'
						})
						.then((function(d) {
							this.$message({
								type: 'success',
								message: '操作成功'
							});
							o.rowEditable = false
						}).bind(this))
				}
			},
			showUserListDialog(obj) {
				this.userObj = obj
				this.userListModalShow = true
			},
			userListModalClose() {
				this.userListModalShow = false
			},
			customerSyn() {
				this._ajax({
						url: this.rootAPI + 'customer/customerSyn',
						param: {},
						loading: 'dataLoading'
					})
					.then((function(d) {
						this.$message({
							type: 'success',
							message: '操作成功'
						});
						this.handleCurrentChange(1)
					}).bind(this))
			},
			dataCheck() {
				this.dataCheckModalShow = true;
			},
			dataCheckModalClose() {
				this.dataCheckModalShow = false;
			},
			merchantModalClose() {
				this.merchantModalShow = false;
			},
			modalClose() {
				this.modalShow = false;
				this.searchTable();
			},
			relationMerchant(row) {
				this.tableRow = row;
				this.merchantModalShow = true;
			},
			qrCode(row) {
				//备案基本信息
				console.log(row)
				this.extendId = row.extend;
				this.channeName = row.channelName;
				this.shanghuName = row.name;
				this.isCode = true
				if(row.extend!='005' && row.extend!='006' ){
					var url='https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxc197a55ff6d0decc&redirect_uri='+ROOT_API+'/mp/qr_order/index.html'
					if(row.extend=='003'){
						this.initQCode = ROOT_API+'/mp/qr_order/#/qr_personage?code='+row.code;
					}else{
						var urlParams=''
						if(row.extend=='001'||row.extend=='007'){
							urlParams='fLogin_first' + '_' + row.id
						}else if(row.extend=='004'||row.extend=='002'||row.extend=='008'){
							if(row.extend=='004'){
									urlParams='mLogin_second' + '_' + row.id
							}else{
								urlParams='fLogin_second' + '_' + row.id
							}

						}
						this.initQCode = `${url}&response_type=code&scope=snsapi_base&state=${urlParams}#wechat_redirect`;
					}
				}
				this.qrDialogVisible=true;
				this.$nextTick(()=>{
					var canvas = document.getElementById('qriously')
					this.imgSrc = canvas.children[0].toDataURL("image/png");
				})
			},
			merchantSubmit(row) {
				this.merchantModalShow = false;
				this._ajax({
					url: this.rootAPI + 'customer/relationMerchant',
					param: {
						id: row.id,
						relationId: row.relationId
					},
					loading: 'dataLoading'
				}).then(this.searchTable)
			},
			cannelMerchant(row) {
				this.confirm('确定取消关联？', (function() {
					this._ajax({
						url: this.rootAPI + 'customer/cannelMerchant',
						param: row,
						loading: 'dataLoading'
					}).then(this.searchTable)
				}).bind(this))

			},
		}
	}
</script>
<style lang='sass' type="text/css">
	#customenManager{
		.qr_img{
			width: 100%;
			height: 100%;
			img{
				width: 100%;
			}
			.qr_code{
				width: 225px;
				height: 230px;
				position: absolute;
				left: 27%;
				top: 160px;
				img{
					width: 100%;
					margin-bottom:30px;
				}
				canvas{
					position: absolute;
					left: -87px;
					top: -87px;
					transform: scale(.5);
				}
			}
			.textStr{
					left: 32%;
					text-align: center;
					color: #3f1c44;
			}
		}
		.qr_img_c{
			margin-bottom: 20px;
		}
	}
</style>
