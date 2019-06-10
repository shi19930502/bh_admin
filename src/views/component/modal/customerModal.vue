<template>
  <el-dialog
    custom-class="jz-modal customer-modal"
    :title="customerModalType === 'add' ? '新增客户' : '客户编辑'"
    :visible="modal"
    :before-close="beforeClose"
    :close-on-click-modal="false"
    :width="modalWidth"
  >
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="基本信息" name="first">
        <el-form
          class="modal-form"
          v-if="modal"
          :model="form"
          ref="form"
          :inline="true"
          :rules="rules"
          label-width="110px"
        >
          <el-row>
            <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
              <el-form-item label="渠道" prop="channelCode">
                <selectInput :value.sync="form.channelCode">
                  <el-option
                    v-for="item in  channelList"
                    :key="item.name"
                    :label="item.name"
                    :value="item.code"
                  ></el-option>
                </selectInput>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
              <el-form-item label="经营户名称" prop="name">
                <inputItem :value.sync="form.name"></inputItem>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
              <el-form-item label="证件号" prop="regId">
                <inputItem :value.sync="form.regId"></inputItem>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
              <el-form-item label="法人代表" prop="legalpepresent">
                <inputItem :value.sync="form.legalpepresent"></inputItem>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
              <el-form-item label="经营户类型" prop="type">
                <selectInput :value.sync="form.type" :disabled="typeDisabled">
                  <el-option
                    v-for="item in dataDic.customerType"
                    :key="item.key"
                    :label="item.value"
                    :value="item.key"
                  ></el-option>
                </selectInput>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
              <el-form-item label="经营户性质" prop="property">
                <selectInput :value.sync="form.property">
                  <el-option
                    v-for="item in dataDic.customerProperty"
                    :key="item.key"
                    :label="item.value"
                    :value="item.key"
                  ></el-option>
                </selectInput>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row v-if="form.extend=='007' || form.extend=='001'">
            <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
              <el-form-item label="供应商品分类" prop="value10">
            <el-select
              v-model="form.value10"
              multiple
              filterable
              allow-create
              default-first-option
              placeholder="请选择供应商品分类">
              <el-option
                v-for="item in categorylist"
                :key="item.code"
                :label="item.name"
                :value="item.code">
              </el-option>
            </el-select>
             </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
              <el-form-item label="手机号码" prop="tel">
                <inputItem :value.sync="form.tel"></inputItem>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12"  v-if="this.formExtend=='0' ||customerModalType === 'add' ">
              <el-form-item label="客户性质" prop="extend" >
                <selectInput :value.sync="form.extend">
                  <el-option
                    v-for="item in dataDic.extend"
                    :key="item.key"
                    :label="item.value"
                    :value="item.key"
                  ></el-option>
                </selectInput>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12"  v-if="this.formExtend!='0' && customerModalType != 'add'">
              <el-form-item label="客户性质" prop="extend">
                <selectInput :value.sync="form.extend" :disabled="true">
                  <el-option
                    v-for="item in dataDic.extend"
                    :key="item.key"
                    :label="item.value"
                    :value="item.key"
                  ></el-option>
                </selectInput>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
              <el-form-item label="自由选择供应商" prop="isChoiceSupplier">
                <selectInput :value.sync="form.isChoiceSupplier" :disabled="true">
                  <el-option
                    v-for="item in dataDic.whether"
                    :key="item.key"
                    :label="item.value"
                    :value="item.key"
                  ></el-option>
                </selectInput>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
              <el-form-item label="备案时间" prop="recordDate">
                <div class="block">
                  <el-date-picker
                    :readonly="true"
                    v-model="form.recordDate"
                    type="date"
                    valueFormat="yyyy-MM-dd"
                    placeholder="选择日期"
                  ></el-date-picker>
                </div>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
              <el-form-item label="是否分拣" prop="isSorter">
                <selectInput :value.sync="form.isSorter">
                  <el-option
                    v-for="item in dataDic.whether"
                    :key="item.value"
                    :label="item.value"
                    :value="item.key"
                  ></el-option>
                </selectInput>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
              <el-form-item label="是否配送" prop="isDistribution">
                <selectInput :value.sync="form.isDistribution">
                  <el-option
                    v-for="item in dataDic.whether"
                    :key="item.value"
                    :label="item.value"
                    :value="item.key"
                  ></el-option>
                </selectInput>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
              <el-form-item label="地址" prop="address" class="row-block">
                <inputItem :value.sync="form.address" type="textarea"></inputItem>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
              <el-form-item label="备注" prop="remark" class="row-block">
                <inputItem :value.sync="form.remark" type="textarea"></inputItem>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
              <el-form-item label="微信openId" prop="wxopenid">
                <inputItem :value.sync="form.wxopenid"></inputItem>
              </el-form-item>
            </el-col>
            <el-col
              :xs="24"
              :sm="24"
              :md="24"
              :lg="12"
              :xl="12"
              v-if="this.customerModalType === 'edit'"
            >
              <el-form-item label="经营户编码" prop="code">
                <inputItem :value.sync="form.code" :disabled="true"></inputItem>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
              <el-form-item label="助记码" prop="mnemonic">
                <inputItem :value.sync="form.mnemonic"></inputItem>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
              <el-form-item label="积分" prop="score">
                <inputItem :value.sync="form.score" :disabled="true"></inputItem>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12" v-if="sysId == 0">
              <el-form-item label="有效期天数" prop="validDay">
                <inputItem :value.sync="form.validDay"></inputItem>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
            <el-form-item label="收款二维码" prop="validDay">
              <uploadItem
                :uploadData="uploadParam"
                @success="uploadSuccess"
                @remove="onRemove"
                :fileList="attachmentList"
              ></uploadItem>
            </el-form-item>
            </el-col>
             <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
                        <el-form-item label="资料是否完善" prop="statu">
                            <switchItem :value.sync="form.disableType" :activeValue="0" :inactiveValue="1"></switchItem>
                        </el-form-item>
                    </el-col>
            
          </el-row>
          <el-row>
             <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12" v-if="form.extend=='003'">
              <el-form-item label="企业类型" >
                <selectInput :value.sync="form.enterpriseType">
                  <el-option
                    v-for="item in enterpriseTypeList"
                    :key="item.value"
                    :label="item.value"
                    :value="item.key"
                  ></el-option>
                </selectInput>
              </el-form-item>
            </el-col>
          </el-row>
          <!-- <el-row>
		            	<el-col :xs="8" :sm="8" :md="8" :lg="8" :xl="8" v-if="form.businessLicensePic != ''">
		                    <el-popover placement="right"  width="540px" height="820px" trigger="click" >
								<img  :src="showPicture(form.businessLicensePic)" width="510px" height="680px"/>
								<el-button slot="reference">查看营业执照照片</el-button>
							</el-popover>
		               </el-col>
		                <el-col :xs="8" :sm="8" :md="8" :lg="8" :xl="8" v-if="form.legalpepresentPic != ''">
		                    <el-popover placement="right"  width="540px" height="820px" trigger="click" >
								<img  :src="showPicture(form.legalpepresentPic)" width="510px" height="680px"/>
								<el-button slot="reference">查看法人照片</el-button>
							</el-popover>
		               </el-col>
		               <el-col :xs="8" :sm="8" :md="8" :lg="8" :xl="8" v-if="form.storePic != ''">
		                    <el-popover placement="right"  width="540px" height="820px" trigger="click" >
								<img  :src="showPicture(form.storePic)" width="510px" height="680px"/>
								<el-button slot="reference">查看门头照片</el-button>
							</el-popover>
		               </el-col>
					    <el-col :xs="8" :sm="8" :md="8" :lg="8" :xl="8" v-if="form.idCard != '' && form.idCard !=null">
		                    <el-popover placement="right"  width="540px" height="820px" trigger="click" >
								<img  :src="showPicture(form.idCardFront)" width="510px" height="680px"/>
								<img  :src="showPicture(form.idCardSide)" width="510px" height="680px"/>
								<el-button slot="reference">查看身份证正反面照片</el-button>
							</el-popover>
		               </el-col>
          </el-row>-->
        </el-form>
        <div class="dialog-footer flex-x-end">
          <elBtn @click="cancel" text="取消">取消</elBtn>
          <elBtn @click="submit" text="提交" type="primary">提交</elBtn>
          <iconBtn
            content="激活"
            type="success"
            @click="activateOrLogout(1)"
            v-if="this.customer.enabled == 0">激活</iconBtn>
          <iconBtn
            content="注销"
            type="warning"
            @click="activateOrLogout(0)"
            v-if="this.customer.enabled == 1">注销</iconBtn>
        </div>
      </el-tab-pane>
      <el-tab-pane label="供应商设置" name="second">
        <div style="text-align: center">
          <el-transfer
            style="text-align: left; display: inline-block"
            v-model="selectDataKeyList"
            filterable
            :render-content="renderFunc"
            :titles="['全部供应商', '已关联供应商商家']"
            :button-texts="['删除关联', '添加关联']"
            :format="{
					    noChecked: '${total}',
					    hasChecked: '${checked}/${total}'
					  }"
            @change="handleChange"
            :data="allDataList"
          ></el-transfer>
        </div>
        <div class="dialog-footer flex-x-center">
          <!--二批：002  团采：003 门店：004 个人：005 -->
          <!-- <elBtn v-if='(form.extend=="002"||form.extend=="003"||form.extend=="004"||form.extend=="005")'  @click="perfectCustomer"  text="一键补齐与供应商关联关系" type="primary">补齐供应商关联关系</elBtn> -->
          <!-- <elBtn @click="perfectSeller"  text="补齐与供应商关联关系" type="primary">补齐供应商关联关系</elBtn>
          <elBtn @click="perfectSellerQuotation"  text="补齐供应商报价单客户数据" type="primary">补齐对应供应商报价单数据</elBtn>-->
        </div>
      </el-tab-pane>
      <el-tab-pane label="采购商设置" name="third">
        <div style="text-align: center">
          <el-transfer
            style="text-align: left; display: inline-block"
            v-model="selectSaleDataKeyList"
            filterable
            :render-content="renderFunc"
            :titles="['全部采购商', '已关联采购商商家']"
            :button-texts="['删除关联', '添加关联']"
            :format="{
					    noChecked: '${total}',
					    hasChecked: '${checked}/${total}'
					  }"
            @change="handleSaleChange"
            :data="allSaleDataList"
          ></el-transfer>
        </div>
        <div class="dialog-footer flex-x-center">
          <!-- 一批：001   厂商：007  门店：004   自营平台：006 -->
          <!-- <elBtn v-if='(form.extend=="001"||form.extend=="007"||form.extend=="004"||form.extend=="006")' @click="perfectCustomer"  text="一键补齐与采购商关联关系" type="primary">补齐供应商关联关系</elBtn> -->
          <!-- <elBtn @click="perfectBuyer"  text="补齐与采购商关联关系" type="primary">补齐供应商关联关系</elBtn>
          <elBtn @click="perfectQuotation"  text="补齐供应商报价单客户数据" type="primary">补齐供应商报价单数据</elBtn>-->
        </div>
      </el-tab-pane>
      <el-tab-pane label="积分明细" name="four">
        <elemTable
          :dataList="dataList"
          :currentPage="pageNum"
          :pageSize="pageSize"
          :pageTotal="pageTotal"
          :loading="dataLoading"
          @sizeChange="handleSizeChange"
          @currentChange="handleCurrentChange"
          @selectionChange="selectionChange"
        >
          <!--<el-table-column type="selection" width="55"></el-table-column>-->
          <el-table-column type="index" width="80" label="序号"/>
          <el-table-column prop="changeDate" label="变化日期">
            <template slot-scope="scope">
              <toolTip :content="scope.row.changeDate">
                <div>{{scope.row.changeDate}}</div>
              </toolTip>
            </template>
          </el-table-column>
          <el-table-column prop="changeType" label="变化类型">
            <template slot-scope="scope">
              <selectInput :value.sync="scope.row.changeType" v-if="scope.row.rowEditable">
                <el-option
                  v-for="item in changeTypeList"
                  :key="item.value"
                  :label="item.value"
                  :value="item.key"
                ></el-option>
              </selectInput>
              <span
                v-if="!scope.row.rowEditable"
              >{{renderDic(changeTypeList, scope.row.changeType)}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="oriScore" label="变化前积分">
            <template slot-scope="scope">
              <toolTip :content="scope.row.oriScore">
                <div>{{scope.row.oriScore}}</div>
              </toolTip>
            </template>
          </el-table-column>
          <el-table-column prop="score" label="变化分数">
            <template slot-scope="scope">
              <toolTip :content="scope.row.score">
                <div>{{scope.row.score}}</div>
              </toolTip>
            </template>
          </el-table-column>
          <el-table-column prop="curScore" label="变化后积分">
            <template slot-scope="scope">
              <toolTip :content="scope.row.curScore">
                <div>{{scope.row.curScore}}</div>
              </toolTip>
            </template>
          </el-table-column>
          <el-table-column prop="sourceType" label="来源类型">
            <template slot-scope="scope">
              <selectInput :value.sync="scope.row.sourceType" v-if="scope.row.rowEditable">
                <el-option
                  v-for="item in sourceTypeList"
                  :key="item.value"
                  :label="item.value"
                  :value="item.key"
                ></el-option>
              </selectInput>
              <span
                v-if="!scope.row.rowEditable"
              >{{renderDic(sourceTypeList, scope.row.sourceType)}}</span>
            </template>
          </el-table-column>
        </elemTable>
      </el-tab-pane>
      <el-tab-pane label="注册照片" name="five" v-if="customerModalType != 'add'">
        <div style="text-align: center">

          <el-row>
            <el-col
              :xs="8"
              :sm="8"
              :md="8"
              :lg="8"
              :xl="8"
              v-if="form.businessLicensePic != ''"
            >营业执照
              <img :src="showPicture(form.businessLicensePic)" width="320px" height="320px">
              <el-button type="danger" icon="el-icon-delete" circle @click="buttonClick(form.id,'businessLicensePic')"></el-button>
              <!-- <el-row>
                <el-button type="danger" icon="el-icon-delete" circle></el-button>
            </el-row> -->
            </el-col>
            <el-col
              :xs="8"
              :sm="8"
              :md="8"
              :lg="8"
              :xl="8"
              v-if="form.marketcertPic != ''"
            >市场证明
              <img :src="showPicture(form.marketcertPic)" width="320px" height="320px">
              <el-button type="danger" icon="el-icon-delete" circle @click="buttonClick(form.id,'marketcertPic')"></el-button>
              <!-- <el-row>
                <el-button type="danger" icon="el-icon-delete" circle></el-button>
            </el-row> -->
            </el-col>
            <el-col :xs="8" :sm="8" :md="8" :lg="8" :xl="8" v-if="form.legalpepresentPic != ''">法人照片
              <img :src="showPicture(form.legalpepresentPic)" width="320px" height="320px">
              <el-button type="danger" icon="el-icon-delete" circle @click="buttonClick(form.id,'legalpepresentPic')"></el-button>
            </el-col>
            <el-col :xs="8" :sm="8" :md="8" :lg="8" :xl="8" v-if="form.storePic != ''">门头照片
              <img :src="showPicture(form.storePic)" width="320px" height="320px">
              <el-button type="danger" icon="el-icon-delete" circle @click="buttonClick(form.id,'storePic')"></el-button>
            </el-col>
            <el-col
              :xs="8"
              :sm="8"
              :md="8"
              :lg="8"
              :xl="8"
              v-if="form.idCard != '' && form.idCard !=null"
            >身份证正面
              <img :src="showPicture(form.idCardFront)" width="320px" height="320px">
              <el-button type="danger" icon="el-icon-delete" circle @click="buttonClick(form.id,'idCard')"></el-button>
            </el-col>
            <el-col
              :xs="8"
              :sm="8"
              :md="8"
              :lg="8"
              :xl="8"
              v-if="form.idCard != '' && form.idCard !=null"
            >身份证反面
              <img :src="showPicture(form.idCardSide)" width="320px" height="320px">
              <el-button type="danger" icon="el-icon-delete" circle @click="buttonClick(form.id,'idCard')"></el-button>
            </el-col>
            <el-col
              :xs="8"
              :sm="8"
              :md="8"
              :lg="8"
              :xl="8"
              v-if="form.foodLicensePic != '' && form.foodLicensePic !=null"
            >食品流通许可证图片
              <img :src="showPicture(form.foodLicensePic)" width="320px" height="320px">
              <el-button type="danger" icon="el-icon-delete" circle @click="buttonClick(form.id,'foodLicensePic')"></el-button>
            </el-col>
            <el-col
              :xs="8"
              :sm="8"
              :md="8"
              :lg="8"
              :xl="8"
              v-if="form.muslimfoodPermitPic != '' && form.muslimfoodPermitPic !=null"
            >清真食品准营证图片
              <img :src="showPicture(form.muslimfoodPermitPic)" width="320px" height="320px">
              <el-button type="danger" icon="el-icon-delete" circle @click="buttonClick(form.id,'muslimfoodPermitPic')"></el-button>
            </el-col>
          </el-row>
        </div>
      </el-tab-pane>
    </el-tabs>
  </el-dialog>
</template>
<script>
import local from "../../../local.js";
import mixin from "../../../mixin/mixin.js";
import usedModal from "../../component/modal/usedModal.vue";
import config from "../../../configs.js"
export default {
  mixins: [mixin],
  components: { usedModal },
  data() {
    var checkTelephone = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("手机号码必填"));
      } else {
        this._ajax({
          url: this.rootAPI + "customer/checkExistByLoginName",
          param: { loginName: this.form.tel, id: this.form.id }
        }).then(
          function(d) {
            if (d.state == 0) {
              callback();
            } else {
              callback(new Error("手机号码已被注册,请重新输入!"));
            }
          }.bind(this)
        );
      }
    };
    var vm = this;
    return {
      formExtend:this.customer.extend,
      categorylist: [],
      form: {
        id: "",
        channelCode: "",
        name: "",
        regId: "",
        legalpepresent: "",
        type: "",
        property: "",
        recordDate: "",
        tel: "",
        address: "",
        remark: "",
        wxopenid: "",
        mnemonic: "",
        isChoiceSupplier: 0,
        isSorter: 0,
        isDistribution: 0,
        enterpriseType:"1",
        selectTab: "",
        validDay: "",
        enabled: "",
        wxcodePic:"",
        value10:[],
        extend:'',
        businessLicensePic:'',
        legalpepresentPic:'',
        storePic:'',
        idCard:'',
        foodLicensePic:'',
        muslimfoodPermitPic:'',
        disableType:''
      },
      rules: {
        channelCode: [{ required: true, message: "渠道必选" }],
        name: [
          { required: true, message: "经营户名称必填" },
          this._ruleLength(50)
        ],
        // regId: [
        //   { required: true, message: "证件号必填" },
        //   this._ruleLength(50)
        // ],
        type: [{ required: true, message: "经营户类型必填" }],
        property: [{ required: true, message: "经营户性质必填" }],
        value10: [{ required: true, message: "供应商品分类必填" }],
        extend: [{ required: true, message: "客户性质必填" }],
        legalpepresent: [this._ruleLength(20)],
        tel: [
          { required: true, validator: checkTelephone, trigger: "blur" },
          this._ruleMobile()
        ],
        mnemonic: [this._ruleLength(10)],
        address: [this._ruleLength(200)],
        remark: [this._ruleLength(100)],
        validDay: [this._ruleLength(10)]
      },
      sysId: local.get("sessionUser").userId,
      oldSorter: "",
      oldDistribution: "",
      dateTime: [],
      activeName: "first",
      //穿梭框初始化数据（购买商用户才可以编辑该功能）
      tabDisabled: true,
      allDataList: [],
      selectDataKeyList: [],
      //采购商数据
      allSaleDataList: [],
      selectSaleDataKeyList: [],
      typeDisabled: true,
      searchForm: {
        customerId: ""
      },
      changeTypeList: [],
      sourceTypeList: [],
      enterpriseTypeList:[],
      renderFunc(h, option) {
        return (
          <span>
            {option.key} - {option.label}
          </span>
        );
      },
      uploadParam: {
        savePath: "platformNotice"
	  },
	  fileList:[],
	  wxcodePic:'',
	  attachmentList:[],	//附件集合
    };
  },
  props: {
    modal: {
      default: false
    },
    customerModalType: {
      default: "add"
    },
    customer: {
      default: {}
    },
    dataDic: {
      default: {}
    },
    channelList: {
      default: {}
    }
  },
  computed: {
    userID() {
      //              console.log(this.userId)
      return this.userId;
    }
  },
  mounted() {
    console
    if (this.customerModalType === "add") {
      this.typeDisabled = false;
      Object.assign(this.form,)
    } else {
      this.typeDisabled = true;
      Object.assign(this.form, this.customer);
    }
    this.form.enterpriseType=this.form.enterpriseType+'';
    // console.log(this.form.disableType)
  // Object.assign(this.form, this.customer);
  this.form.value10= this.customer.businessScope!=null?this.customer.businessScope.split('/'):[];
	if(this.form.wxcodePic!="" &&this.form.wxcodePic!=null){
    this.attachmentList=[{name: 'wxcode.jpeg', url: ROOT_API+"/"+this.form.wxcodePic}];
    // this.attachmentList=[{name: 'wxcode.jpeg', url: "https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=1577759731,3108671782&fm=27&gp=0.jpg"}];
	}else{
		this.attachmentList=[]
	}
    this.searchForm.customerId = this.customer.id;
    this.getInitData();
    this.oldSorter = this.customer.isSorter;
    this.oldDistribution = this.customer.isDistribution;
    if (
      local.get("sessionUser").userId != 0 &&
      local.get("sessionUser").typeCode != 0
    )
      this.form.channelCode = local.get("sessionUser").typeCode;      	
  },
  methods: {
    buttonClick(id,fixed){

    this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(() => {
      //删除照片-更改状态
      this.deleteCustemaPic(id,fixed);
      //将user状态改为不可用
      this.updateUserState(id);

    }).catch(() => {
      this.$message({
        type: 'info',
        message: '已取消删除'
      });
    });
    },
    updateUserState(id){
      this._ajax({
        url: config.userAPI,
        name: "user/update",
        param: {
          expandParameters:id,
          status:0
        },
      }).then(
        function(d) {
          if (d.state!=0) {
            this.$message({
              type: "success",
              message: "禁用用户出错!"
            });
          }
        }.bind(this)
      );
    },
    deleteCustemaPic(id,fixed){
      this._ajax({
        url: this.rootAPI,
        name: "customer/updateCusMer",
        param: {
          id:id,
          extendedField:fixed,
          enabled:0,
          disableType:1
        },
      }).then(
        function(d) {
          if (d.success) {
            this.$message({
              type: "success",
              message: "删除成功"
            });
            //location.reload();
            this.form[fixed]='';
          }else {
            this.$message({
              type: "success",
              message: "删除失败"
            });
          }
        }.bind(this)
      );
    },
    getInitData() {
      var vm = this;
      this._ajax({
        url: this.rootAPI + "datadic/list",
        param: {
          dataType: "SCORE_SOURCE_TYPE"
        },
        arr: true
      }).then(
        function(d) {
          let data = d.aaData;
          vm.sourceTypeList = data;
        }.bind(this)
      );
      //查询数据字典，团采企业类型
				this._searchDic('TC_TYPE')
					.then((function(d) {
            let data = d.aaData;
            vm.enterpriseTypeList=data;					
          }).bind(this));
          
       this._ajax({
        url: this.rootAPI + "category/list",
        param: {
          level: "1"
        },
        arr: true
      }).then(
        function(d) {
          let data = d.aaData;
          vm.categorylist = data;
        }.bind(this)
      );
      return this._ajax({
        url: this.rootAPI + "datadic/list",
        param: {
          dataType: "SCORE_CHANGE_TYPE"
        },
        arr: true
      }).then(
        function(d) {
          let data = d.aaData;
          vm.changeTypeList = data;
        }.bind(this)
      );

    },
    showPicture(pic) {
      return ROOT_API + "/" + pic;
    },
   
    activateOrLogout(type) {
      let user = local.get("userinfo");
      let msg = "确定激活该账户？";
      if (type == 0) msg = "确定注销该账户？";
      var vm = this;
      this.confirm(
        msg,
        function() {
          var o = {
            id: [vm.customer.id],
            customerProperty:this.form.extend,
            enabled: type
          };
          this._ajax({
            url: this.rootAPI + "customer/update",
            param: o,
            arr: true
          }).then(
            function(d) {
              if (d.state != 0)
                this.$message({
                  type: "success",
                  message: d.msg
                });
              else
                this.$message({
                  type: "success",
                  message: "操作成功"
                });
              vm.cancel();
            }.bind(this)
          );
        }.bind(this)
      );
    },
    cancel() {
      this.$emit("close");
    },
    submit() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          let o = {},
            method = "customer/update";
          let id = this.form.id;
          if (this.customerModalType === "add") {
            method = "customer/create";
            id = null;
          }
          let sorterTemp = "";
          let distributionTemp = "";
          if (this.oldSorter != this.form.isSorter) {
            sorterTemp = this.form.isSorter;
          }
          if (this.oldDistribution != this.form.isDistribution) {
            distributionTemp = this.form.isDistribution;
          }
          let userEnable=this.form.enabled;
          if(this.form.disableType==1)
          {
             userEnable=0;
          }
          let user = local.get("sessionUser");
          o = {
            channelCode: this.form.channelCode,
            name: this.form.name,
            regId: this.form.regId,
            legalpepresent: this.form.legalpepresent,
            type: this.form.type,
            extend:this.form.extend,
            property: this.form.property,
            //								recordDate : this.form.recordDate,
            tel: this.form.tel,
            address: this.form.address,
            remark: this.form.remark,
            wxopenid: this.form.wxopenid,
            mnemonic: this.form.mnemonic,
            validDay: this.form.validDay,
            //								isChoiceSupplier : this.form.isChoiceSupplier,
            operator: user.nickName,
            isSorter: sorterTemp,
            isDistribution: distributionTemp,
            customerProperty: this.form.extend,
            id: id,
            wxcodePic:this.wxcodePic,
            businessScope:this.form.value10.join('/'),
            disableType:this.form.disableType,
            enabled:userEnable,
            enterpriseType:this.form.enterpriseType
          };
          //                      console.info(o)
          this._ajax({ url: this.rootAPI + method, param: o }).then(
            function(d) {
              if (d.state == 0) {
                this.$message({ type: "success", message: "操作成功" });
                this.$emit("submit");
              } else {
                this.$message({
                  type: "failure",
                  message: "操作失败:" + d.msg
                });
              }
            }.bind(this)
          );
        }
      });
    },
    beforeClose(done) {
      this.cancel();
      done();
    },
    used() {
      if (this.form.channelCode) {
        this.channelCode1 = this.form.channelCode;
        this.usedModalVisible = true;
      } else {
        this.$message({ type: "info", message: "请选择渠道信息" });
      }
    },
    usedModalClose1(resultData) {
      //				console.info(resultData);
      this.form.userdName = resultData.name;
      this.form.customerId = resultData.id;
      this.usedModalVisible = false;
    },
    handleClick(tab, event) {
      this.selectTab = tab;
      if (tab.name == "second") {
        debugger;
        console.log(this.form);
        if (this.form.id == "" || this.form.id == null) {
          this.$message({ type: "error", message: "请先填写基本信息" });
          return;
        }
        //查询全部供应商
        //排除当前form框用户
        let excludeIds = [];
        excludeIds.push(this.form.id);
        let param = {
          customerType: "merchant",
          excludeId: excludeIds,
          extend: this.form.extend
        };
        this._ajax({
          url: this.rootAPI,
          name: "customer/queryPageByChannelCode",
          param: param,
          arr: true,
          loading: "dataLoading"
        }).then(
          function(d) {
            let data = d.aaData;
            let result = [];
            $.each(data, function(i, obj) {
              result.push({
                key: obj.id,
                label: obj.name,
                disabled: false
              });
            });
            this.allDataList = result;
          }.bind(this)
        );
        //查询当前用户已关联的供应商数据
        this._ajax({
          url: this.rootAPI,
          name: "suppliercollection/list",
          param: { customerId: this.form.id },
          loading: "dataLoading"
        }).then(
          function(d) {
            let data = d.aaData;
            let result = [];
            $.each(data, function(i, obj) {
              result.push(obj.sellerId);
            });
            this.selectDataKeyList = result;
          }.bind(this)
        );
      }
      if (tab.name == "third") {
        console.log(this.form);
        if (this.form.id == "" || this.form.id == null) {
          this.$message({ type: "error", message: "请先填写基本信息" });
          return;
        }
        //查询全部采购商
        //排除当前form框用户
        let excludeIds = [];
        excludeIds.push(this.form.id);
        let param = {
          customerType: "buyer",
          excludeId: excludeIds,
          extend: this.form.extend
        };
        this._ajax({
          url: this.rootAPI,
          name: "customer/queryPageByChannelCode",
          param: param,
          arr: true,
          loading: "dataLoading"
        }).then(
          function(d) {
            let data = d.aaData;
            let result = [];
            $.each(data, function(i, obj) {
              result.push({
                key: obj.id,
                label: obj.name,
                disabled: false
              });
            });
            this.allSaleDataList = result;
          }.bind(this)
        );
        //查询当前用户已关联的采购商数据
        this._ajax({
          url: this.rootAPI,
          name: "suppliercollection/list",
          param: { sellerId: this.form.id },
          loading: "dataLoading"
        }).then(
          function(d) {
            let data = d.aaData;
            let result = [];
            $.each(data, function(i, obj) {
              result.push(obj.customerId);
            });
            this.selectSaleDataKeyList = result;
          }.bind(this)
        );
      }
      if (tab.name == "four") {
        var vm = this;
        console.log(this.form);
        if (this.form.id == "" || this.form.id == null) {
          this.$message({ type: "error", message: "请先填写基本信息" });
          return;
        }
        Object.assign(this.searchForm, {
          pageNum: this.pageNum,
          pageSize: this.pageSize
        });
        return this._ajax({
          url: this.rootAPI + "score/list",
          param: this.searchForm,
          loading: "dataLoading"
        }).then(this.renderTable);
      }
    },
    searchTable() {
      var vm = this;
      Object.assign(this.searchForm, {
        pageNum: this.pageNum,
        pageSize: this.pageSize
      });
      return this._ajax({
        url: this.rootAPI + "score/list",
        param: this.searchForm,
        loading: "dataLoading"
      }).then(this.renderTable);
    },
    handleChange(value, direction, movedKeys) {
      let param = {
        customerName: this.form.name,
        customerId: this.form.id,
        joininCustomerIdsString: movedKeys.join(",")
      };
      let allData = this.allDataList;
      let selectName = [];
      $.each(movedKeys, function(i, obj1) {
        $.each(allData, function(j, obj2) {
          if (obj1 == obj2.key) {
            selectName.push(obj2.label);
          }
        });
      });
      param.sellerName = selectName.join(",");
      if (direction === "left") {
        //删除关联
        param.type = 2;
      } else if (direction === "right") {
        //添加关联
        param.type = 1;
      }
      this._ajax({
        url: this.rootAPI,
        name: "suppliercollection/updateSupplierRelete",
        param: param
      }).then(
        function(d) {
          if (d.state == 0) {
            this.$message({ type: "success", message: "调整关联成功！" });
          } else {
            this.handleClick(this.selectTab);
            this.$message({ type: "info", message: "调整关联失败：" + d.msg });
          }
        }.bind(this)
      );
    },
    handleSaleChange(value, direction, movedKeys) {
      let param = {
        sellerName: this.form.name,
        sellerId: this.form.id,
        joininCustomerIdsString: movedKeys.join(",")
      };
      let allSaleData = this.allSaleDataList;
      let selectName = [];
      $.each(movedKeys, function(i, obj1) {
        $.each(allSaleData, function(j, obj2) {
          if (obj1 == obj2.key) {
            selectName.push(obj2.label);
          }
        });
      });
      param.customerName = selectName.join(",");
      if (direction === "left") {
        //删除关联
        param.type = 2;
      } else if (direction === "right") {
        //添加关联
        param.type = 1;
      }
      this._ajax({
        url: this.rootAPI,
        name: "suppliercollection/updateSellerRelete",
        param: param
      }).then(
        function(d) {
          if (d.state == 0) {
            this.$message({ type: "success", message: "调整关联成功！" });
          } else {
            this.handleClick(this.selectTab);
            this.$message({ type: "info", message: "调整关联失败：" + d.msg });
          }
        }.bind(this)
      );
    },
    perfectBuyer() {
      //供应商补全买方关联
      let param = {
        sellerId: this.form.id
      };
      this._ajax({
        url: this.rootAPI,
        name: "suppliercollection/perfectSuppliercollection",
        param: param
      }).then(
        function(d) {
          if (d.state == 0) {
            this.$message({ type: "success", message: "调整关联成功！" });
          } else {
            this.$message({ type: "info", message: "调整关联失败：" + d.msg });
          }
          this.handleClick(this.selectTab);
        }.bind(this)
      );
    },
    perfectCustomer() {
      //补齐与客户关联关系
      // 1、当前用户是 一批/厂商时采购商为 门店和二批，供应商无
      // 2、门店时：供应商为一批/厂商 采购商为个人
      // 3、二批 显示供应商 采购商无
      // 4、当前用户是 自营平台时 指定采购商为 团采
      // 5、当前用户是 配送公司 不需要指定关系
      // 6、当前客户是团采时 供应商为 自营平台 采购商无
      // 7、当前客户个人  供应商为门店 采购商无
      let param = {
        sellerId: this.form.id
      };
      // this._ajax({url: this.rootAPI, name: 'suppliercollection/perfectSuppliercollection', param: param})
      // .then((function(d){
      // 	if(d.state == 0) {
      // 		this.$message({type: 'success', message: '调整关联成功！'});
      // 	} else {
      // 		this.$message({type: 'info', message: '调整关联失败：'+d.msg});
      // 	}
      // 	this.handleClick(this.selectTab)
      // }).bind(this))
    },
    perfectQuotation() {
      let param = {
        customerId: this.form.id
      };
      this._ajax({
        url: this.rootAPI,
        name: "quotation/perfectQuotationInfo",
        param: param
      }).then(
        function(d) {
          if (d.state == 0) {
            this.$message({ type: "success", message: "调整关联成功！" });
          } else {
            this.$message({ type: "info", message: "调整关联失败：" + d.msg });
          }
          this.handleClick(this.selectTab);
        }.bind(this)
      );
    },
    perfectSeller() {
      let param = {
        customerId: this.form.id
      };
      this._ajax({
        url: this.rootAPI,
        name: "suppliercollection/perfectSuppliercollection",
        param: param
      }).then(
        function(d) {
          if (d.state == 0) {
            this.$message({ type: "success", message: "调整关联成功！" });
          } else {
            this.$message({ type: "info", message: "调整关联失败：" + d.msg });
          }
          this.handleClick(this.selectTab);
        }.bind(this)
      );
    },
    perfectSellerQuotation() {
      let param = {
        buyersId: this.form.id
      };
      this._ajax({
        url: this.rootAPI,
        name: "quotation/perfectQuotationInfo",
        param: param
      }).then(
        function(d) {
          if (d.state == 0) {
            this.$message({ type: "success", message: "调整关联成功！" });
          } else {
            this.$message({ type: "info", message: "调整关联失败：" + d.msg });
          }
          this.handleClick(this.selectTab);
        }.bind(this)
      );
    },
    renderDic(dic, dicKey) {
      let dicShow = "";
      $.each(dic, function(i, obj) {
        if (obj.key == dicKey) {
          dicShow = obj.value;
        }
      });
      return dicShow;
    },
    uploadSuccess(response, file, fileList) {
    //   this.fileNumber = this.fileNumber + 1;
	  this.fileList = fileList;
	  this.wxcodePic=response.aaData.path;
      console.log(this.fileList);
    },
    onRemove(file, fileList) {
    //   if (this.fileNumber > 0) {
    //     this.fileNumber = this.fileNumber - 1;
    //   }
      this.fileList = fileList;
      if (this.form.id != null && file.id != null) {
        var o = {
          id: [file.id]
        };
        this._ajax({
          url: this.rootAPI + "uploadfilerecode/delete",
          param: o,
          arr: true
        }).then(
          function(d) {
            this.$message({ type: "success", message: "删除成功" });
          }.bind(this)
        );
        var delForm = {
          id: this.form.id,
        //   supportNum: this.fileNumber
        };
        this._ajax({
          url: this.tootAPI,
          name: "platformnotice/update",
          param: delForm
        }).then(d => {});
      }
    }
  }
};
</script>
<style lang="sass">
    .customer-modal{
        .row-block{
            .el-form-item__content {
                width: calc(100% - 110px);
                &>div{
                    width: 100%;
                }
            }
        }
    }
    .el-transfer-panel{
    	width:400px;
    }
</style>
