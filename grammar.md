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
        
```


```text
那些常用的语法会被降级
    1: 
```


```text
待支持语法
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
