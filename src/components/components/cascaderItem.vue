<template>
	<el-cascader
	  :value="value"
	  :options="options"
	  @active-item-change="handleItemChange"
	  :props="propss"
	  @change="change"
	  :disabled='disabled'
	  :change-on-select="changeOnSelect"
	  :clearable="clearable"
	  :filterable="filterable"
	></el-cascader>
</template>
<script>
	export default {
		name: 'cascaderItem',
		props: {
			value: {
				default: function() {
					return []
				}
			},
			disabled: {
				default: false
			},
			options: {
				default: function() {
					return []
				}
			},
			propss: {
				default: function() {
					return {
						label: 'name',
						value: 'code',
	      				children: 'childChannel',
					}
				}
			},
			changeOnSelect: {
				default: true
			},
			clearable: {
				default: true
			},
			filterable: {
				default: true
			}
		},
		methods: {
			handleItemChange(val) {
				this.$emit('handleItemChange', val)
			},
			change(val) {
				this.$emit('change', val)
			}
		}
	}
</script>