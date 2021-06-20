## page
```text
    id
    name
    data
    methods
    event
    lifetimes
    components => 注入的组件, 结构: Record<string, Object>
    page: object => 具体布局
        1: 需要为每一个组件生成唯一id
```

## layout & component
```text
    data
    props
    event => custom or bridge
    lifetimes: { load }
    methods => 方法集合
    slots => 组件默认插槽
    content: object => 具体布局
        1: slot, slotName
        2: 在component和layout中不需要自动成功id字段, 如果写了,就赋值上
```

### page & content
```text
    id
    name
    props
    style
    event
    $if
    $for
    slots
    children
```

```text
    编译注意的点
    css相关
	    1: css中的属性名需要编程驼峰形式的
	    2: methods|event|mounted中的代码仅仅需要将es6转成es5
	    3: css选择器暂时只支持class选择器(暂时考虑不到那些特殊场景需要用到其他诸如id|attr选择器)ClassSelector
	1: 用export default { name }来区分编译成page还是component
	    enum name = {
	        page,
	        component
	    }
	    (   
	        为什么要区分? 
	        1: page内部id不可为空, component id可为空
	        2: 组件和页面的内容字段不同, page: page, component: content
	        3: 组件暂不支持page的component功能
        )
```
