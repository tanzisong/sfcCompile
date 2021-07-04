```text
初始支持的语法
    props | data   => (Object数据结构)
        1: prop属性名,需要遵循js变量命名规范(type Key)
        2: prop属性值, 支持的格式PropsValueType = ( array, { prop属性名: PropsValueType })
            简单类型: simpleType = Number | Boolean | String | null;
            复杂类型: complexType = Array<simpleType | complexType> | Record<Key, simpleType | complexType>
    class
        1: 静态绑定一个className
        
    style
        1: 静态绑定style字符串(同名属性优先级比class高)
        2: style绑定function(function需要被执行, 否则会被认作props或者data)
        
    children 
        slot语法
            1: name必传校验
            2: slot标签children=> 默认slot
        Mustache语法(会被编译成最近父节点的innerText属性的value)
            1: {{ 'string' }}
            2: {{ "string" }}
            3: {{ props }} {{ data }}
            4: {{ methods() }}
        其他普通标签语法
    
    methods
        1: 语法降级
        2: 函数表达式 methodName: () => {xxx}
        3: 普通对象中函数的形式 { methodName() {xxx} }
    
    event/lifetimes-load
        1: 语法降级
    
    slot
        1: slot子集的含义
            (1): component   <slot name="button"><xxx ...></xxx></slot>
                    xxx节点则是button的默认子节点, 如果在使用该component的时候,没有传递元素, 则默认展示子节点
            (2): page        <slot name="button"><xxx ...></xxx></slot>
                    xxx节点表示在对应component占位符填充的元素
```


```text
可被降级的语法
    1: 模板字符串
    2: 箭头函数
    3: class
    4: {a,b}
    5: 对象的key支持计算拼接算出
    6: for of
    7: es6 Unicode
    8: ...
    9: 函数默认参数
    10: 等等
```


```text
待支持语法
1: 单行注释
2: v-bind:class语法
2: v-bind:style语法
5: {{ `${variable}` }} 模板字符串语法
6: {{ 'string' + data + methods() }} 复杂表达式

    methods
        1: methods中使用箭头函数表达式
```

```text
methods对象中定义的方法,会在那些地方使用?
    1: 在click事件使用
        <view @click="handleClick"></view>
        methods: {
            handleClick: () => {}
        }
    2: 在节点props value使用
        <view :propName="dynamicPropValue('params1')"></view>
        methods: {
            dynamicPropValue: (params) => {xxx}
        }
        
```
