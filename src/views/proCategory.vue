<template>
  <el-row>
    <el-col :span="3" style="margin:0 0 5px 5px;" >
      <el-card>
        <el-tree
          :data="data"
          node-key="gbgoodsId"
          :default-expanded-keys="['011']"
          :default-checked-keys="['011']"
          accordion="true"x
          ref="tree"
          highlight-current
          :props="defaultProps"
          @node-click="handleNodeClick"
        >
        </el-tree>
      </el-card>
    </el-col>
    <el-col :span="20" style="margin:0 0 5px 5px">
      <el-card>
        <!-- 查询条件 -->
        <searchInputItems>
          <searchInputItem name="分类名称">
            <inputItem
              :value.sync="searchForm.name"
              @enter="searchTable"
            ></inputItem>
          </searchInputItem>
          <!-- <searchInputItem name="父级分类">
				<inputItem :value.sync="searchForm.parentName" @enter="searchTable"></inputItem>
			</searchInputItem> -->
          <!-- <searchInputItem name="所属分类">
				<cascaderItem :options="categoryList" @change="categoryChange" :value.sync="categoryName" :propss="propss"></cascaderItem>
			</searchInputItem> -->
          <searchInputItem name="启用状态">
            <selectInput
              :value.sync="searchForm.enabled"
              @selectChange="searchTable"
              :clearable="true"
            >
              <el-option
                v-for="item in dicEnabled"
                :key="item.key"
                :label="item.value"
                :value="item.key"
              >
              </el-option>
            </selectInput>
          </searchInputItem>
          <!-- <searchInputItem name="启用状态">
				<rateItem :value.sync="searchForm.rate"></rateItem>
			</searchInputItem> -->
        </searchInputItems>
        <!-- 操作按钮 -->
        <optionItems>
          <template slot="left">
            <el-button-group>
              <iconBtn
                iconClass="el-icon-plus"
                content="新增"
                @click="modalAdd"
                v-if="sysId == 0"
                >新增</iconBtn
              >
              <iconBtn
                iconClass="el-icon-minus"
                content="删除"
                @click="dele"
                v-if="sysId == 0"
                >删除</iconBtn
              >
              <iconBtn
                iconClass="el-icon-search"
                content="查询"
                @click="searchTable"
                >查询</iconBtn
              >
              <iconBtn iconClass="el-icon-refresh" content="重置" @click="reset"
                >重置</iconBtn
              >
            </el-button-group>
          </template>
        </optionItems>
        <!-- 表格 -->
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
          <el-table-column
            type="selection"
            width="55"
            v-if="sysId == 0"
          ></el-table-column>
          <el-table-column prop="code" label="商品编码">
            <template slot-scope="scope">
              <toolTip :content="scope.row.code">
                <span>{{ scope.row.code }}</span>
              </toolTip>
            </template>
          </el-table-column>
          <el-table-column prop="name" label="分类名称">
            <template slot-scope="scope">
              <toolTip :content="scope.row.name">
                <span>{{ scope.row.name }}</span>
              </toolTip>
            </template>
          </el-table-column>
          <el-table-column prop="name" label="编辑状态">
            <template slot-scope="scope">
              <el-button
                :type="scope.row.enabled ? 'danger' : 'success'"
                @click="updCategorySts(scope.row)"
                >{{ scope.row.enabled ? "停用" : "启用" }}</el-button
              >
              <!-- <toolTip :content="scope.row.name">
                <span>{{ scope.row.name }}</span>
              </toolTip> -->
            </template>
          </el-table-column>
          <el-table-column prop="gbgoodsId" label="国标码">
            <template slot-scope="scope">
              <toolTip :content="scope.row.gbgoodsId">
                <span>{{ scope.row.gbgoodsId }}</span>
              </toolTip>
            </template>
          </el-table-column>
          <el-table-column prop="vulgo" label="别名">
            <template slot-scope="scope">
              <toolTip :content="scope.row.vulgo">
                <span>{{ scope.row.vulgo }}</span>
              </toolTip>
            </template>
          </el-table-column>
          <el-table-column prop="parentName" label="父级分类">
            <template slot-scope="scope">
              <toolTip :content="scope.row.parentName">
                <span>{{ scope.row.parentName }}</span>
              </toolTip>
            </template>
          </el-table-column>
          <el-table-column prop="fullName" label="分类全名">
            <template slot-scope="scope">
              <toolTip :content="scope.row.fullName">
                <span>{{ scope.row.fullName }}</span>
              </toolTip>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="120">
            <template slot-scope="scope">
              <el-button-group>
                <iconBtn
                  iconClass="el-icon-edit"
                  content="编辑"
                  @click="modalEdit(scope.row)"
                  v-if="!scope.row.rowEditable && sysId == 0"
                ></iconBtn>
                <iconBtn
                  iconClass="el-icon-check"
                  type="success"
                  content="保存"
                  @click="submitEdit(scope.row)"
                  v-if="scope.row.rowEditable"
                ></iconBtn>
                <iconBtn
                  iconClass="el-icon-close"
                  type="info"
                  content="取消"
                  @click="cancelEdit(scope.row)"
                  v-if="scope.row.rowEditable"
                ></iconBtn>
                <iconBtn
                  iconClass="el-icon-minus"
                  content="删除"
                  @click="delRow(scope.row)"
                  v-if="sysId == 0"
                ></iconBtn>
              </el-button-group>
            </template>
          </el-table-column>
          <el-table-column prop="categoryPicUrl" label="图片">
            <template slot-scope="scope">
              <imgItem :path="scope.row.categoryPicUrl"></imgItem>
            </template>
          </el-table-column>
          <el-table-column prop="managefee" label="市场管理费率">
            <template slot-scope="scope">
              <toolTip :content="scope.row.managefee">
                <span>{{ scope.row.managefee }}</span>
              </toolTip>
            </template>
          </el-table-column>

          <el-table-column prop="enabled" label="状态">
            <template slot-scope="scope">
              <tagItem
                :type="scope.row.enabled ? 'success' : 'danger'"
                :text="_dicValue(scope.row.enabled, dicEnabled)"
              ></tagItem>
            </template>
          </el-table-column>
          <el-table-column prop="remark" label="描述">
            <template slot-scope="scope">
              <toolTip :content="scope.row.remark">
                <span>{{ scope.row.remark }}</span>
              </toolTip>
            </template>
          </el-table-column>
        </elemTable>
      </el-card>
    </el-col>
    <categoryModal
      v-if="modalShow"
      :modal="modalShow"
      :categoryModalType="modalType"
      @close="modalClose"
      :category="modalObj"
      @submit="modalSubmit"
    ></categoryModal>
  </el-row>
</template>
<script>
import local from "../local.js";
import mixin from "../mixin/mixin.js";
import categoryModal from "./component/modal/categoryModal.vue";
export default {
  mixins: [mixin],
  components: { categoryModal },
  data() {
    return {
      data: [],
      defaultProps: {
        children: "childList",
        label: "vulgo"
      },
      searchForm: {
        name: "",
        enabled: 1,
        parentName: "",
        orderField: "f_parent_category_id"
      },
      dataList: [],
      rowOBJ: {},
      categoryList: [],
      categoryName: [],
      propss: {
        label: "name",
        value: "code",
        children: "childList"
      },
      //控制只有超级管理员可以操作商品分类数据
      sysId: local.get("sessionUser").userId
    };
  },
  mounted() {
    this._searchDic("IS_ENABLED")
      .then(
        function(d) {
          this.dicEnabled = this._dicKey(d);
        }.bind(this)
      )
      .then(this.searchTable);
    this.searchmenu();
  },
  methods: {
    searchmenu(){
    this._ajax({
      url: this.rootAPI,
      name: "category/childList",
      param: { parentCategoryId: "top",filteDeleted:0,deleted:0 }
    }).then(
      function(d) {
        this.data = d.aaData;
        this.categoryList = d.aaData;
      }.bind(this)
    );
    },
    handleNodeClick(data) {
      console.log(data);
      this.searchForm.parentCategoryId = data.gbgoodsId;
      return this.searchTable();
    },
    searchTable() {
      Object.assign(this.searchForm, {
        pageNum: this.pageNum,
        pageSize: this.pageSize
      });
      return this._ajax({
        name: "category/list",
        param: this.searchForm,
        loading: "dataLoading"
      }).then(this.renderTable);
    },
    reset() {
      Object.assign(this.searchForm, {
        name: "",
        parentCategoryId: "",
        enabled: "",
        parentName: ""
      });
      this.categoryName = [];
      this.handleCurrentChange(1);
      this.searchmenu();
    },
    dele() {
      if (this.delSelection.length === 0) {
        this.$message({ type: "info", message: "请选择行" });
      } else {
        let selection = this.delSelection;
        var arr = [],
          o = {};
        selection.forEach(function(el) {
          arr.push(el.id);
        });
        o.id = arr;
        this.delSubmit(o);
      }
    },
    delRow(row) {
      var o = {
        id: [row.id]
      };
      this.delSubmit(o);
    },
    categoryChange(val) {
      if (val.length > 0) {
        Object.assign(this.searchForm, {
          parentCategoryId: val[val.length - 1]
        });
      } else {
        Object.assign(this.searchForm, { parentCategoryId: "" });
      }
      this.searchTable();
    },
    delSubmit(o) {
      this._comfirm("确定删除？")
        .then(
          function() {
            return this._ajax({
              name: "category/queryChilds",
              param: o,
              arr: true
            });
          }.bind(this)
        )
        .then(
          function(d) {
            if (d.aaData.length > 0) {
              this._comfirm("包含未删除的子级，是否需要全部删除？")
                .then(
                  function() {
                    var dataList = d.aaData,
                      flag = true;
                    for (var i = 0, l = dataList.length; i < l; i++) {
                      if (dataList[i].enabled === 0) {
                        flag = false;
                      }
                    }
                    if (flag) {
                      this._ajax({
                        name: "category/delete2",
                        param: o,
                        arr: true
                      }).then(
                        function(d) {
                          if (d.state == 0) {
                            this.$message({
                              type: "success",
                              message: "操作成功"
                            });
                            this.searchTable();
                          }
                        }.bind(this)
                      );
                    } else {
                      this.$message({
                        type: "warning",
                        message: "不能删除，包含未停用的分类，请先停用后再删除"
                      });
                    }
                  }.bind(this)
                )
                .catch(this._confirmCancle);
            } else {
              this._ajax({
                name: "category/delete2",
                param: o,
                arr: true
              }).then(
                function(d) {
                  if (d.state == 0) {
                    this.$message({ type: "success", message: "操作成功" });
                    this.searchTable();
                  }
                }.bind(this)
              );
            }
          }.bind(this)
        );
      //      		.catch(this._confirmCancle);
    },
    // 修改分类状态
    updCategorySts(o) {
      var msg1 = o.enabled ? "停用" : "启用";
      var msg2 = o.enabled ? "子分类" : "父分类";
      var updenabled = o.enabled ? 1 : 0;
      let parm = {};
      parm.enabled = updenabled;
      // 如果修改为停用状态，则判断该分类子集状态为启用状态；如果是改为启用状态，则判断改父级的状态是否为启用状态
      console.log(o)

      //原数据状态
      if (o.enabled==0) {
        //启用传父级的code，判断父级是否启用
        parm.code = o.parentCategoryId;
      }
      if (o.enabled==1){
        parm.parentCategoryId =o.code;
      }
    //   if (o.enabled) {
    //     parm.parentCategoryId = o.code;
    //   } else {
    //     parm.code = o.parentCategoryId;
	  // }
    console.log(parm)
   //检查是否该分类已经在商品中使用
   var pa={
     gbgoodsid:o.gbgoodsId,
     deleted:0
   };
   if (o.enabled==1) {
     this._ajax({
       name: "product/list",
       param: pa
     }).then(
       function(d) {
         if (d.dataCount>0) {
           this.$message({
             type: "warning",
             message: "该分类已添加商品，无法停用"
          });
        }else {
          this.updCategory(o,parm,msg1,msg2)
        }
       }.bind(this)
     );
   }
   if (o.enabled==0) {
       this.updCategory(o,parm,msg1,msg2)
   }
 },
 updCategory(o,parm,msg1,msg2){
   o.feeEnabled=0;
     this._comfirm("确定" + msg1 + "该分类？").then(
       function(d) {
         // 停用,查询子级是否有未停用的
         this._ajax({
           url: this.rootAPI,
           name: "category/listByEntity",
           param:parm
         }).then(
           function(e) {
             if (e.state > 0) {
               this.$message({
                 type: "warning",
                 message: "该分类的"+msg2+"未"+msg1
               });
             } else {
               o.enabled = o.enabled ? 0 : 1;
               this._ajax({
                 name: "category/update",
                 param: o
               }).then(
                 function(p) {
           console.log(p);
          this.searchTable();
          this.searchmenu();
                   this.$message({ type: "success", message: "操作成功" });
                 }.bind(this)
               );
             }
           }.bind(this)
         );
       }.bind(this)
     )
 }
  }
};

</script>
<style>
.el-tree{
  width: 100%;
  min-width:100%;
  overflow-x: scroll;
}
.el-tree>.el-tree-node{
  min-width:100%;
display: inline-block !important;
}
</style>
