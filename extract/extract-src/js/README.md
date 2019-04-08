# 页面视图梳理

## 视图拆分

### 文本待选项：options

需提供的数据：

 * options：文本待选项数组，即tagValue.options

 * contents : 父级数据，即tag，需要父级数据提供前置条件

嵌套的其它控件：

 * 前置条件：context

 * 小分组：grouo-range，用于自定义选项

注：数值待选项与options相同

### 标签待选项：tabs

需提供的数据：

 * tabs：标签待选项数组，即tagValue.tabs

 * contents : 父级数据，即tag，需要父级数据提供前置条件

嵌套的其它控件：

* 文本待选项：options

### 小分组：group-range

需提供的数据：

 * ranges：最大值、最小值范围数组

 * contents : 父级数据，即tag，需要父级数据提供区分时间、带单位等控件显示

注：此控件包含时间、带单位、可添加多组的范围控件

### 前置条件：context

需提供的数据：

 * option：显示前置条件的某个文本待选项

 * contents : 父级数据，即tag，需要父级数据提供前置条件

### 关联属性：relation

需提供的数据：

 * relations：关联属性数组，即tagValue.relation/option.relation

 * contents : 父级数据，需要父级数据提供文本待选项、标签待选项、关联属性数据

 嵌套的其它控件：

 * 文本待选项：options

 * 标签待选项：tabs

 * 关联属性：relation

注：关联属性控件中显示关联属性，还包含options、tabs、relation
