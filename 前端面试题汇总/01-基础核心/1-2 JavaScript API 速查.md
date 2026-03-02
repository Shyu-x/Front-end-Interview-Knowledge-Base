# JavaScript 核心 API 速查手册

> 适用于手写代码、算法题、LeetCode 刷题场景的 ES6+ 完整 API 语法速查

---

## 目录

1. [数组方法 (Array)](#一数组方法-array)
2. [字符串方法 (String)](#二字符串方法-string)
3. [对象方法 (Object)](#三对象方法-object)
4. [ES6+ 新增语法](#四es6-新增语法)
5. [Math 数学运算](#五math-数学运算)
6. [Number 数值方法](#六number-数值方法)
7. [Date 日期处理](#七date-日期处理)
8. [JSON 数据转换](#八json-数据转换)
9. [Map 与 Set](#九map-与-set)
10. [Symbol 与 BigInt](#十symbol-与-bigint)
11. [Proxy 与 Reflect](#十一proxy-与-reflect)
12. [异步编程 Promise](#十二异步编程-promise)
13. [手写代码常用模式](#十三手写代码常用模式)

---

## 一、数组方法 (Array)

### 1.1 遍历方法

#### `forEach()` - 遍历数组

```javascript
arr.forEach((element, index, array) => {
    // element: 当前元素
    // index: 当前索引 (可选)
    // array: 原数组 (可选)
}, thisArg); // thisArg: 回调中的 this 指向

// 示例
[1, 2, 3].forEach((num, i) => console.log(i, num));
// 0 1
// 1 2
// 2 3
```

**特点**：
- 无返回值，不改变原数组
- 无法 break/continue（可用 for...of 或 every/some）
- 同步执行，不等待异步

---

#### `map()` - 映射数组

```javascript
const newArr = arr.map((element, index, array) => {
    return newValue; // 必须返回值
}, thisArg);

// 示例
[1, 2, 3].map(x => x * 2); // [2, 4, 3]
[1, 2, 3].map((x, i) => i + x); // [0, 3, 5]

// 常见面试题：返回对象数组
const users = [{name: 'a', age: 20}, {name: 'b', age: 30}];
users.map(u => ({...u, id: Math.random()}));
```

**特点**：
- 返回新数组，不改变原数组
- 返回元素个数与原数组相同

---

#### `filter()` - 过滤数组

```javascript
const newArr = arr.filter((element, index, array) => {
    return condition; // 返回 true 保留，false 过滤
}, thisArg);

// 示例
[1, 2, 3, 4, 5].filter(x => x > 3); // [4, 5]
[1, 2, NaN, 3].filter(x => x); // [1, 2, 3]
['a', '', null, 'b'].filter(Boolean); // ['a', 'b']
```

---

#### `reduce()` - 归约数组

```javascript
const result = arr.reduce((accumulator, currentValue, index, array) => {
    return newAccumulator;
}, initialValue);

// 参数说明：
// accumulator: 累计器，初始值为 initialValue 或第一个元素
// currentValue: 当前元素
// index: 当前索引 (可选)
// array: 原数组 (可选)
// initialValue: 初始值 (可选，有则初始为该值，否则取第一个元素)

// 示例 - 求和
[1, 2, 3, 4].reduce((sum, x) => sum + x, 0); // 10

// 示例 - 找最大值
[3, 1, 4, 1, 5].reduce((max, x) => Math.max(max, x), -Infinity); // 5

// 示例 - 数组去重
[1, 2, 2, 3, 3, 3].reduce((acc, x) => {
    if (!acc.includes(x)) acc.push(x);
    return acc;
}, []); // [1, 2, 3]

// 示例 - 统计出现次数
['a', 'b', 'a', 'c', 'a'].reduce((cnt, x) => {
    cnt[x] = (cnt[x] || 0) + 1;
    return cnt;
}, {}); // {a: 3, b: 1, c: 1}

// 示例 - 展平数组
[[1, 2], [3, 4], [5]].reduce((flat, arr) => flat.concat(arr), []); // [1,2,3,4,5]
// ES6 写法
[[1, 2], [3, 4], [5]].flat(); // [1,2,3,4,5]
```

**常见手写题**：
```javascript
// 手写 reduce
Array.prototype.myReduce = function(callback, initialValue) {
    let accumulator = initialValue === undefined ? this[0] : initialValue;
    const startIndex = initialValue === undefined ? 1 : 0;

    for (let i = startIndex; i < this.length; i++) {
        accumulator = callback(accumulator, this[i], i, this);
    }
    return accumulator;
};
```

---

#### `every()` - 判断所有元素

```javascript
const result = arr.every((element, index, array) => {
    return condition;
}, thisArg);

// 示例
[2, 4, 6].every(x => x % 2 === 0); // true
[1, 2, 3].every(x => x > 0); // true
[1, 2, 3].every(x => x > 2); // false
```

---

#### `some()` - 判断是否存在

```javascript
const result = arr.some((element, index, array) => {
    return condition;
}, thisArg);

// 示例
[1, 2, 3].some(x => x > 2); // true
[1, 2, 3].some(x => x > 5); // false
```

---

#### `find()` - 查找元素

```javascript
const result = arr.find((element, index, array) => {
    return condition;
}, thisArg);

// 示例 - 返回第一个满足条件的元素
[1, 2, 3, 4, 5].find(x => x > 3); // 4
[{id: 1}, {id: 2}, {id: 3}].find(x => x.id === 2); // {id: 2}
// 未找到返回 undefined
[1, 2, 3].find(x => x > 10); // undefined
```

---

#### `findIndex()` - 查找索引

```javascript
const result = arr.findIndex((element, index, array) => {
    return condition;
}, thisArg);

// 示例 - 返回第一个满足条件的元素的索引
[1, 2, 3, 4, 5].findIndex(x => x > 3); // 3
// 未找到返回 -1
[1, 2, 3].findIndex(x => x > 10); // -1
```

---

### 1.2 转换方法

#### `flat()` - 展平数组

```javascript
const newArr = arr.flat(depth);
// depth: 展开深度，默认 1，Infinity 为无限展开

// 示例
[1, [2, [3, [4]]]].flat();        // [1, 2, [3, [4]]]
[1, [2, [3, [4]]]].flat(2);       // [1, 2, 3, [4]]
[1, [2, [3, [4]]]].flat(Infinity); // [1, 2, 3, 4]

// 常用技巧：展平任意深度
const flatten = arr => arr.flat(Infinity);
```

---

#### `flatMap()` - 映射+展平

```javascript
const newArr = arr.flatMap((element, index, array) => {
    return value; // 可以是数组，会被自动展平一层
});

// 示例 - 等同于 map + flat
[1, 2, 3].flatMap(x => [x, x * 2]); // [1, 2, 2, 4, 3, 6]

// 单词分割
['Hello World', 'Good Morning'].flatMap(s => s.split(' '));
// ['Hello', 'World', 'Good', 'Morning']
```

---

#### `sort()` - 排序

```javascript
arr.sort((a, b) => {
    // 返回值 < 0: a 在前
    // 返回值 = 0: 位置不变
    // 返回值 > 0: b 在前
    return a - b; // 升序
    // return b - a; // 降序
});

// 示例 - 数字升序
[3, 1, 4, 1, 5, 9, 2, 6].sort((a, b) => a - b); // [1,1,2,3,4,5,6,9]

// 示例 - 字符串按长度排序
['apple', 'pie', 'banana'].sort((a, b) => a.length - b.length);
// ['pie', 'apple', 'banana']

// 示例 - 对象数组排序
const users = [{name: 'a', age: 20}, {name: 'b', age: 18}];
users.sort((a, b) => a.age - b.age); // 按年龄升序
```

**重要**：默认按 Unicode 编码排序！
```javascript
[10, 2, 33].sort(); // [10, 2, 33] - 错误！
[10, 2, 33].sort((a, b) => a - b); // [2, 10, 33] - 正确
```

---

#### `reverse()` - 反转数组

```javascript
const reversed = arr.reverse();
// 注意：改变原数组！

// 示例
[1, 2, 3].reverse(); // [3, 2, 1]
```

---

### 1.3 增删改方法

#### `push()` - 末尾添加

```javascript
const newLength = arr.push(element1, element2, ...);
// 返回新长度，改变原数组

// 示例
const arr = [1, 2];
arr.push(3, 4); // arr = [1, 2, 3, 4], 返回 4
```

---

#### `pop()` - 末尾删除

```javascript
const removed = arr.pop();
// 返回被删除的元素，改变原数组

// 示例
const arr = [1, 2, 3];
arr.pop(); // arr = [1, 2], 返回 3
```

---

#### `unshift()` - 开头添加

```javascript
const newLength = arr.unshift(element1, element2, ...);
// 返回新长度，改变原数组

// 示例
const arr = [1, 2];
arr.unshift(0); // arr = [0, 1, 2], 返回 3
```

---

#### `shift()` - 开头删除

```javascript
const removed = arr.shift();
// 返回被删除的元素，改变原数组

// 示例
const arr = [1, 2, 3];
arr.shift(); // arr = [2, 3], 返回 1
```

---

#### `splice()` - 插入/删除/替换

```javascript
const removed = arr.splice(start, deleteCount, item1, item2, ...);

// start: 开始位置
// deleteCount: 删除个数（可选，0 表示不删除）
// item1, item2: 要插入的元素（可选）

// 示例 - 删除
[1, 2, 3, 4, 5].splice(1, 2); // 删除 index 1 开始的 2 个元素
// 原数组变为 [1, 4, 5]，返回 [2, 3]

// 示例 - 插入
[1, 2, 3].splice(1, 0, 'a', 'b'); // 在 index 1 插入
// 原数组变为 [1, 'a', 'b', 2, 3]，返回 []

// 示例 - 替换
[1, 2, 3].splice(1, 1, 'x'); // 替换 index 1 的元素
// 原数组变为 [1, 'x', 3]，返回 [2]
```

---

#### `fill()` - 填充数组

```javascript
const newArr = arr.fill(value, start, end);

// value: 填充值
// start: 起始索引（默认 0）
// end: 结束索引（默认 arr.length）

// 示例
new Array(3).fill(0);        // [0, 0, 0]
[1, 2, 3].fill('a', 1, 2);  // [1, 'a', 3]
[1, 2, 3].fill(0);          // [0, 0, 0] - 改变原数组
```

**注意**：fill 对对象是浅拷贝！
```javascript
new Array(3).fill({});     // 三个空对象指向同一引用！
new Array(3).map(() => ({})) // 正确：创建三个独立对象
```

---

### 1.4 查找方法

#### `indexOf()` - 查找元素索引

```javascript
const index = arr.indexOf(searchElement, fromIndex);

// searchElement: 要查找的元素
// fromIndex: 起始索引（可选，默认 0）
// 返回第一个匹配元素的索引，未找到返回 -1

// 示例
[1, 2, 3, 2, 1].indexOf(2);      // 1
[1, 2, 3, 2, 1].indexOf(2, 2);   // 3
[1, 2, 3].indexOf(4);            // -1
```

---

#### `lastIndexOf()` - 查找最后出现位置

```javascript
const index = arr.lastIndexOf(searchElement, fromIndex);
// 从后往前找

// 示例
[1, 2, 3, 2, 1].lastIndexOf(2); // 3
```

---

#### `includes()` - 是否包含

```javascript
const result = arr.includes(value, fromIndex);
// 返回 true/false

// 示例
[1, 2, 3].includes(2);    // true
[1, 2, 3].includes(4);     // false
[NaN].includes(NaN);       // true (ES2016)
// 注意：indexOf 无法正确判断 NaN
[NaN].indexOf(NaN);       // -1
```

---

### 1.5 合并与截取

#### `concat()` - 合并数组

```javascript
const newArr = arr.concat(value1, value2, ...);
// 不改变原数组

// 示例
[1, 2].concat([3, 4], 5);     // [1, 2, 3, 4, 5]
[].concat(...[[1, 2], [3, 4]]); // 展开合并
```

---

#### `slice()` - 截取数组

```javascript
const newArr = arr.slice(start, end);
// start: 起始索引（默认 0）
// end: 结束索引（不包含，默认 arr.length）
// 负数表示从末尾计算

// 示例
[1, 2, 3, 4, 5].slice(1, 3);    // [2, 3]
[1, 2, 3, 4, 5].slice(1);       // [2, 3, 4, 5]
[1, 2, 3, 4, 5].slice(-2);      // [4, 5]
[1, 2, 3, 4, 5].slice();        // 浅拷贝数组
```

---

#### `join()` - 数组转字符串

```javascript
const str = arr.join(separator);
// separator: 分隔符，默认 ","

// 示例
[1, 2, 3].join('-');    // "1-2-3"
[1, 2, 3].join();       // "1,2,3"
[].join('-');           // ""
```

---

#### `toString()` - 转字符串

```javascript
const str = arr.toString();
// 等同于 join(',')

// 示例
[1, 2, 3].toString(); // "1,2,3"
```

---

### 1.6 迭代器方法

#### `keys()` - 键迭代器

```javascript
const iterator = arr.keys();

// 示例
for (const index of [1, 2, 3].keys()) {
    console.log(index); // 0, 1, 2
}
[...Array(5).keys()]; // [0, 1, 2, 3, 4]
```

---

#### `values()` - 值迭代器

```javascript
const iterator = arr.values();

// 示例
for (const value of [1, 2, 3].values()) {
    console.log(value); // 1, 2, 3
}
```

---

#### `entries()` - 键值对迭代器

```javascript
const iterator = arr.entries();

// 示例
for (const [index, value] of [1, 2, 3].entries()) {
    console.log(index, value); // 0 1, 1 2, 2 3
}
Object.fromEntries([['a', 1], ['b', 2]]); // {a: 1, b: 2}
```

---

### 1.7 静态方法

#### `Array.isArray()` - 判断是否为数组

```javascript
Array.isArray(value);
// 返回 true/false

// 示例
Array.isArray([]);      // true
Array.isArray({});      // false
Array.isArray('123');   // false
```

---

#### `Array.from()` - 类数组转数组

```javascript
const arr = Array.from(arrayLike, mapFunction, thisArg);

// arrayLike: 类数组对象或可迭代对象
// mapFunction: 可选，对每个元素处理的函数
// thisArg: 可选，mapFunction 中的 this

// 示例 - 从类数组转换
Array.from('hello');        // ['h', 'e', 'l', 'l', 'o']
Array.from({length: 3});    // [undefined, undefined, undefined]
Array.from({0: 'a', 1: 'b', length: 2}); // ['a', 'b']

// 示例 - 带映射
Array.from([1, 2, 3], x => x * 2); // [2, 4, 6]
Array.from({length: 5}, (_, i) => i); // [0, 1, 2, 3, 4]

// 常用：创建数组
Array.from({length: 10}, (_, i) => i + 1); // [1,2,3,...,10]
```

---

#### `Array.of()` - 创建数组

```javascript
const arr = Array.of(element1, element2, ...);
// 与 new Array() 的区别：参数为数字时不会创建空位

// 示例
Array.of(1, 2, 3);     // [1, 2, 3]
Array.of(5);           // [5]
Array.of(1);           // [1]

// 对比 new Array()
new Array(3);         // [empty × 3]
Array.of(3);          // [3]
```

---

### 1.8 ES2023 新增方法

#### `toReversed()` - 返回反转后的新数组

```javascript
const reversed = arr.toReversed();
// 不改变原数组

// 示例
const arr = [1, 2, 3];
arr.toReversed(); // [3, 2, 1]
// arr 仍是 [1, 2, 3]
```

---

#### `toSorted()` - 返回排序后的新数组

```javascript
const sorted = arr.toSorted((a, b) => a - b);
// 不改变原数组

// 示例
const arr = [3, 1, 2];
arr.toSorted((a, b) => a - b); // [1, 2, 3]
// arr 仍是 [3, 1, 2]
```

---

#### `toSpliced()` - 返回修改后的新数组

```javascript
const newArr = arr.toSpliced(start, deleteCount, ...items);
// 不改变原数组

// 示例
const arr = [1, 2, 3];
arr.toSpliced(1, 1, 'x'); // [1, 'x', 3]
// arr 仍是 [1, 2, 3]
```

---

#### `with()` - 返回指定位置修改后的新数组

```javascript
const newArr = arr.with(index, value);
// 不改变原数组

// 示例
const arr = [1, 2, 3];
arr.with(1, 'x'); // [1, 'x', 3]
// arr 仍是 [1, 2, 3]
```

---

## 二、字符串方法 (String)

### 2.1 访问与查找

#### `charAt()` - 获取字符

```javascript
const char = str.charAt(index);
// 返回指定位置的字符，超出范围返回 ''

// 示例
'hello'.charAt(1); // 'e'
'hello'.charAt(10); // ''
```

---

#### `charCodeAt()` - 获取字符码

```javascript
const code = str.charCodeAt(index);
// 返回指定位置字符的 Unicode 编码

// 示例
'a'.charCodeAt(0);  // 97
'中'.charCodeAt(0); // 20013
```

---

#### `codePointAt()` - 获取码点 (ES6)

```javascript
const code = str.codePointAt(index);
// 处理四字节 UTF-16 字符

// 示例
'😀'.codePointAt(0); // 128512
// charCodeAt 无法正确处理
'😀'.charCodeAt(0);  // 55357 (错误)
```

---

#### `indexOf()` / `lastIndexOf()`

```javascript
const index = str.indexOf(searchString, position);
const index = str.lastIndexOf(searchString, position);

// 示例
'hello world'.indexOf('o');      // 4
'hello world'.indexOf('o', 5);   // 7
'hello world'.lastIndexOf('o');  // 7
```

---

#### `includes()` - 是否包含 (ES6)

```javascript
const result = str.includes(searchString, position);
// 返回 true/false

// 示例
'hello'.includes('ell');    // true
'hello'.includes('ell', 1); // true
'hello'.includes('ell', 2); // false
```

---

#### `startsWith()` / `endsWith()`

```javascript
const result = str.startsWith(searchString, position);
const result = str.endsWith(searchString, position);

// 示例
'hello'.startsWith('hel');      // true
'hello'.startsWith('llo', 2);   // true
'hello'.endsWith('lo');         // true
```

---

### 2.2 截取与转换

#### `slice()` - 截取字符串

```javascript
const newStr = str.slice(start, end);
// 支持负数

// 示例
'hello world'.slice(1, 5);   // 'ello'
'hello world'.slice(1);      // 'ello world'
'hello world'.slice(-5);     // 'world'
```

---

#### `substring()` - 截取字符串

```javascript
const newStr = str.substring(start, end);
// 不支持负数，自动交换参数

// 示例
'hello'.substring(1, 4); // 'ell'
'hello'.substring(4, 1); // 'ell' - 自动交换
'hello'.substring(-2);   // 'hello' - 负数视为 0
```

---

#### `substr()` - 截取字符串 (已废弃)

```javascript
// 不推荐使用，已移出 Web 标准
const newStr = str.substr(start, length);
```

---

#### `trim()` - 去除首尾空白

```javascript
const newStr = str.trim();
// 去除空格、制表符、换行符等

// 示例
'  hello  '.trim(); // 'hello'
```

---

#### `trimStart()` / `trimEnd()` (ES2019)

```javascript
const newStr = str.trimStart();
const newStr = str.trimEnd();
// 或 trimLeft() / trimRight()

// 示例
'  hello  '.trimStart();  // 'hello  '
'  hello  '.trimEnd();    // '  hello'
```

---

### 2.3 大小写转换

```javascript
'hello'.toUpperCase(); // 'HELLO'
'HELLO'.toLowerCase(); // 'hello'

// 特定 locale
'türkçe'.toLocaleUpperCase('tr-TR'); // 'TÜRKÇE'
'türkçe'.toLocaleLowerCase('tr-TR'); // 'türkçe'
```

---

### 2.4 分割与连接

#### `split()` - 分割字符串

```javascript
const arr = str.split(separator, limit);

// separator: 分隔符（字符串或正则）
// limit: 限制返回数组长度

// 示例
'a,b,c'.split(',');           // ['a', 'b', 'c']
'hello'.split('');            // ['h','e','l','l','o']
'hello'.split('', 3);         // ['h', 'e', 'l']
'a  b  c'.split(/\s+/);       // ['a', 'b', 'c']
```

---

#### `concat()` - 连接字符串

```javascript
const newStr = str.concat(str1, str2, ...);
// 不常用，更推荐使用 + 或模板字符串

// 示例
'hello'.concat(' ', 'world'); // 'hello world'
```

---

### 2.5 模式匹配

#### `match()` - 正则匹配

```javascript
const result = str.match(regexp);
// 返回数组或 null

// 示例
'hello world'.match(/\w+/g); // ['hello', 'world']
'hello'.match(/(\w)/);       // ['h', 'h', index: 0]
'hello'.match(/x/);          // null
```

---

#### `search()` - 查找位置

```javascript
const index = str.search(regexp);
// 返回匹配索引，未找到返回 -1

// 示例
'hello'.search(/l/);     // 2
'hello'.search(/x/);      // -1
```

---

#### `replace()` / `replaceAll()` - 替换

```javascript
const newStr = str.replace(pattern, replacement);
// pattern: 字符串或正则
// replacement: 字符串或函数

// 示例 - 字符串替换（只替换第一个）
'hello'.replace('l', 'x');    // 'hexlo'

// 示例 - 正则替换
'hello'.replace(/l/g, 'x');   // 'hexxo'

// 示例 - replaceAll (ES2021)
'hello'.replaceAll('l', 'x'); // 'hexxo'

// 示例 - 替换函数
'3 eggs'.replace(/\d+/, n => Number(n) * 2); // '6 eggs'

// 示例 - 命名捕获组
'2023-01-15'.replace(/(?<year>\d{4})-(?<month>\d{2})-(?<day>\d{2})/, '$<month>/$<day>/$<year>');
// '01/15/2023'
```

---

#### `repeat()` - 重复字符串 (ES6)

```javascript
const newStr = str.repeat(count);
// count: 重复次数

// 示例
'hello'.repeat(3); // 'hellohellohello'
'hello'.repeat(0); // ''
'hello'.repeat(2.5); // 向下取整，'hellohello'
```

---

#### `padStart()` / `padEnd()` - 填充 (ES2017)

```javascript
const newStr = str.padStart(length, padString);
const newStr = str.padEnd(length, padString);

// length: 目标长度
// padString: 填充字符，默认 ' '

// 示例
'5'.padStart(3, '0');    // '005'
'hello'.padStart(10);     // '     hello'
'hello'.padEnd(10, '.');  // 'hello.....'
```

---

### 2.6 模板字符串 (ES6)

```javascript
// 基本语法
const name = 'World';
const greeting = `Hello, ${name}!`; // 'Hello, World!'

// 表达式
const a = 1, b = 2;
`${a} + ${b} = ${a + b}`; // '1 + 2 = 3'

// 多行
const multiline = `
    第一行
    第二行
`;

// 标签模板
function tag(strings, ...values) {
    return strings[0] + values.join('|') + strings[1];
}
tag`Hello ${'World'}!`; // 'Hello World!'
```

---

## 三、对象方法 (Object)

### 3.1 创建与属性

#### `Object.create()` - 创建对象

```javascript
const obj = Object.create(proto);
// 创建以 proto 为原型的对象

// 示例
const parent = {x: 1};
const child = Object.create(parent);
child.x; // 1

// 创建纯净对象（无原型）
const obj = Object.create(null);
```

---

#### `Object.assign()` - 合并对象

```javascript
const target = Object.assign(target, source1, source2, ...);
// 返回目标对象

// 示例
Object.assign({}, {a: 1}, {b: 2}); // {a: 1, b: 2}

// 浅拷贝
const clone = Object.assign({}, obj);

// 合并相同属性（后面的覆盖前面的）
Object.assign({a: 1}, {a: 2, b: 3}); // {a: 2, b: 3}

// 常见面试题：合并数组（数组索引作为属性）
Object.assign([], [1, 2, 3]); // {0: 1, 1: 2, 2: 3, length: 3}
```

---

#### 扩展运算符 (ES6)

```javascript
const obj1 = {a: 1};
const obj2 = {...obj1, b: 2}; // {a: 1, b: 2}

// 合并对象
const merged = {...obj1, ...obj2};

// 浅拷贝
const clone = {...obj};

// 常见面试题：深拷贝（基础版）
const deepClone = obj => JSON.parse(JSON.stringify(obj));
// 或使用 structuredClone (现代浏览器)
const clone = structuredClone(obj);
```

---

### 3.2 属性操作

#### `Object.keys()` - 获取键数组

```javascript
const keys = Object.keys(obj);
// 返回自身可枚举属性（不含继承）

// 示例
Object.keys({a: 1, b: 2}); // ['a', 'b']
Object.keys([1, 2, 3]); // ['0', '1', '2']
Object.keys('hello'); // ['0', '1', '2', '3', '4']
```

---

#### `Object.values()` - 获取值数组 (ES2017)

```javascript
const values = Object.values(obj);

// 示例
Object.values({a: 1, b: 2}); // [1, 2]
Object.values([1, 2, 3]); // [1, 2, 3]
```

---

#### `Object.entries()` - 获取键值对数组 (ES2017)

```javascript
const entries = Object.entries(obj);

// 示例
Object.entries({a: 1, b: 2}); // [['a', 1], ['b', 2]]
Object.entries([1, 2, 3]); // [['0', 1], ['1', 2], ['2', 3]]

// 常见用法：对象转 Map
new Map(Object.entries({a: 1, b: 2}));

// 常见用法：对象遍历
for (const [key, value] of Object.entries(obj)) {
    console.log(key, value);
}
```

---

#### `Object.fromEntries()` - 键值对转对象 (ES2019)

```javascript
const obj = Object.fromEntries(entries);
// entries: 可迭代的键值对

// 示例
Object.fromEntries([['a', 1], ['b', 2]]); // {a: 1, b: 2}

// 常见用法：Map 转对象
new Map([['a', 1], ['b', 2]]);
Object.fromEntries(map.entries()); // {a: 1, b: 2}

// 常见用法：URL 参数转对象
const params = new URLSearchParams('a=1&b=2');
Object.fromEntries(params); // {a: '1', b: '2'}

// 常见用法：对象反转
const obj = {a: 1, b: 2};
const inverted = Object.fromEntries(
    Object.entries(obj).map(([k, v]) => [v, k])
); // {1: 'a', 2: 'b'}
```

---

#### `Object.hasOwn()` - 判断自身属性 (ES2022)

```javascript
const result = Object.hasOwn(obj, prop);
// 返回 true/false，不检查原型链

// 示例
const obj = {a: 1};
Object.hasOwn(obj, 'a');   // true
Object.hasOwn(obj, 'toString'); // false
// 等同于 Object.prototype.hasOwnProperty.call()
```

---

#### `Object.hasOwnProperty()` - 判断自身属性

```javascript
const result = obj.hasOwnProperty(prop);

// 示例
({a: 1}).hasOwnProperty('a'); // true
({a: 1}).hasOwnProperty('toString'); // false
```

---

#### `Object.getOwnPropertyNames()` - 获取所有属性名

```javascript
const names = Object.getOwnPropertyNames(obj);
// 包括不可枚举属性

// 示例
Object.getOwnPropertyNames([1, 2, 3]); // ['0', '1', '2', 'length']
```

---

#### `Object.getOwnPropertySymbols()` - 获取 Symbol 属性

```javascript
const symbols = Object.getOwnPropertySymbols(obj);

// 示例
const sym = Symbol('a');
const obj = {[sym]: 1};
Object.getOwnPropertySymbols(obj); // [Symbol(a)]
```

---

### 3.3 原型操作

#### `Object.getPrototypeOf()` - 获取原型

```javascript
const proto = Object.getPrototypeOf(obj);

// 示例
Object.getPrototypeOf({}); // Object.prototype
Object.getPrototypeOf([]); // Array.prototype
```

---

#### `Object.setPrototypeOf()` - 设置原型

```javascript
Object.setPrototypeOf(obj, proto);

// 示例
const parent = {x: 1};
const child = {};
Object.setPrototypeOf(child, parent);
child.x; // 1
```

---

### 3.4 属性描述符

#### `Object.defineProperty()` - 定义单个属性

```javascript
Object.defineProperty(obj, prop, descriptor);

// descriptor 包含：
// value: 属性值
// writable: 是否可写
// enumerable: 是否可枚举
// configurable: 是否可配置
// get: getter 函数
// set: setter 函数

// 示例
Object.defineProperty(obj, 'name', {
    value: 'John',
    writable: true,     // 默认为 false
    enumerable: true,  // 默认为 false
    configurable: true // 默认为 false
});

// 访问器属性
Object.defineProperty(obj, 'price', {
    get() { return this._price; },
    set(v) { this._price = v; }
});
```

---

#### `Object.defineProperties()` - 定义多个属性

```javascript
Object.defineProperties(obj, {
    prop1: { value: 1, enumerable: true },
    prop2: { value: 2, enumerable: true }
});
```

---

#### `Object.getOwnPropertyDescriptor()` - 获取属性描述符

```javascript
const descriptor = Object.getOwnPropertyDescriptor(obj, prop);

// 示例
Object.getOwnPropertyDescriptor({a: 1}, 'a');
// {value: 1, writable: true, enumerable: true, configurable: true}
```

---

#### `Object.getOwnPropertyDescriptors()` - 获取所有描述符 (ES2017)

```javascript
const descriptors = Object.getOwnPropertyDescriptors(obj);
```

---

### 3.5 其他方法

#### `Object.freeze()` - 冻结对象

```javascript
Object.freeze(obj);
// 禁止添加、删除、修改属性
// 返回被冻结的对象

// 示例
const obj = {a: 1};
Object.freeze(obj);
obj.a = 2; // 严格模式下报错，非严格模式静默失败
obj.b = 3; // 静默失败

// 判断是否冻结
Object.isFrozen(obj); // true
```

---

#### `Object.seal()` - 密封对象

```javascript
Object.seal(obj);
// 禁止添加、删除属性，但可以修改现有属性

// 示例
const obj = {a: 1};
Object.seal(obj);
obj.a = 2; // 可以
obj.b = 3; // 静默失败
delete obj.a; // 静默失败

Object.isSealed(obj); // true
```

---

#### `Object.preventExtensions()` - 禁止扩展

```javascript
Object.preventExtensions(obj);
// 禁止添加新属性

// 示例
const obj = {a: 1};
Object.preventExtensions(obj);
obj.b = 2; // 静默失败
Object.isExtensible(obj); // false
```

---

#### `Object.is()` - 精确比较 (ES2015)

```javascript
Object.is(value1, value2);

// 与 === 的区别
Object.is(NaN, NaN);     // true (=== 为 false)
Object.is(0, -0);       // false (=== 为 true)
Object.is({}, {});      // false (=== 为 true)
```

---

#### `Object.isExtensible()` / `Object.isFrozen()` / `Object.isSealed()`

```javascript
Object.isExtensible(obj); // 是否可扩展
Object.isFrozen(obj);    // 是否已冻结
Object.isSealed(obj);    // 是否已密封
```

---

## 四、ES6+ 新增语法

### 4.1 let 与 const

```javascript
// let - 块级作用域，可重新赋值
let x = 1;
x = 2; // OK
let x = 3; // Error: 已声明

// const - 块级作用域，不可重新赋值
const y = 1;
y = 2; // Error
// 但对象/数组内容可以修改
const arr = [1, 2];
arr.push(3); // OK (引用不变)
arr = [];    // Error
```

---

### 4.2 箭头函数

```javascript
// 基本语法
const fn = (a, b) => a + b;
const fn = a => a * 2;
const fn = () => 'hello';

// 函数体多行需要 return 或大括号
const fn = (a, b) => {
    const sum = a + b;
    return sum;
};

// 返回对象需要括号
const fn = () => ({name: 'John'});

// 特点
// 1. 没有自己的 this，指向定义时的外层 this
// 2. 没有 arguments
// 3. 不能用作构造函数 (new fn() 报错)
// 4. 没有 prototype
// 5. 不能用作 Generator

// 面试常考点：this 绑定
function Timer() {
    this.time = 0;
    setInterval(() => {
        this.time++; // 箭头函数的 this 指向 Timer 实例
    }, 1000);
}
```

---

### 4.3 解构赋值

#### 数组解构

```javascript
const [a, b, c] = [1, 2, 3]; // a=1, b=2, c=3

// 跳过元素
const [a, , c] = [1, 2, 3]; // a=1, c=3

// 剩余模式
const [a, ...rest] = [1, 2, 3]; // a=1, rest=[2,3]

// 默认值
const [a, b = 2] = [1]; // a=1, b=2
const [a, b = 2] = [1, null]; // b=null (不是默认值)

// 交换变量
[a, b] = [b, a];

// 嵌套
const [a, [b, c]] = [1, [2, 3]];
```

---

#### 对象解构

```javascript
const {name, age} = {name: 'John', age: 20};

// 重命名
const {name: n, age: a} = {name: 'John', age: 20}; // n='John', a=20

// 默认值
const {name = 'Unknown', age = 0} = {name: 'John'}; // name='John', age=0

// 剩余模式
const {a, ...rest} = {a: 1, b: 2, c: 3}; // rest={b:2, c:3}

// 嵌套
const {a: {b}} = {a: {b: 1}};

// 函数参数解构
function fn({name, age}) {
    console.log(name, age);
}
fn({name: 'John', age: 20});
```

---

#### 函数参数默认值 + 解构

```javascript
function fn({a = 1, b = 2} = {}) {
    console.log(a, b);
}
fn();           // 1 2
fn({a: 10});   // 10 2
fn({a: 10, b: 20}); // 10 20

// 注意：默认参数位置
function fn({a, b} = {a: 1, b: 2}) { ... }
function fn({a = 1, b = 2}) { ... } // 行为不同
```

---

### 4.4 展开运算符

#### 数组展开

```javascript
// 数组展开
const arr1 = [1, 2, 3];
const arr2 = [...arr1, 4, 5]; // [1, 2, 3, 4, 5]

// 复制数组
const clone = [...arr];

// 合并数组
[...arr1, ...arr2];

// 字符串转数组
[...'hello']; // ['h','e','l','l','o']

// 类数组转数组
[...arguments];
[...document.querySelectorAll('div')];
```

---

#### 对象展开

```javascript
const obj1 = {a: 1};
const obj2 = {b: 2};
const merged = {...obj1, ...obj2}; // {a: 1, b: 2}

// 覆盖属性
const obj = {...{a: 1}, a: 2}; // {a: 2}

// 复制对象
const clone = {...obj};

// 添加属性
const newObj = {...obj, c: 3};
```

---

#### 函数参数展开

```javascript
function fn(a, b, c) { ... }
const args = [1, 2, 3];
fn(...args);

// 可变参数
function fn(...rest) {
    console.log(rest); // 数组
}
fn(1, 2, 3); // [1, 2, 3]
```

---

### 4.5 Symbol

```javascript
// 创建 Symbol
const sym = Symbol('description'); // 可选描述
const sym2 = Symbol('description'); // 每次创建新的
Symbol('a') === Symbol('a'); // false

// Symbol.for() - 全局 Symbol 注册表
const sym1 = Symbol.for('key');
const sym2 = Symbol.for('key');
sym1 === sym2; // true

// Symbol.keyFor() - 获取 Symbol 的 key
Symbol.keyFor(sym1); // 'key'

// 常见内置 Symbol
Symbol.iterator    // 可迭代
Symbol.toStringTag // toString() 标签
Symbol.species     // 创建衍生对象
Symbol.replace     // replace() 方法
Symbol.hasInstance // instanceof
```

---

### 4.6 Set

```javascript
// 创建
const set = new Set([1, 2, 3]);

// 方法
set.add(value);        // 添加，返回 set 本身
set.has(value);        // 是否包含
set.delete(value);     // 删除，返回是否成功
set.clear();           // 清空
set.size;              // 大小

// 遍历
for (const value of set) { ... }
set.forEach(value => ...);
[...set];              // 转数组

// 常见用法：数组去重
[...new Set([1, 2, 2, 3])]; // [1, 2, 3]

// 字符串去重
[...new Set('abab')].join(''); // 'ab'
```

---

### 4.7 WeakSet

```javascript
// 与 Set 的区别：
// 1. 只存储对象引用
// 2. 弱引用（对象无其他引用时可被垃圾回收）
// 3. 不可遍历
// 4. 没有 size

const ws = new WeakSet();
const obj = {};
ws.add(obj);
ws.has(obj); // true
ws.delete(obj);
```

---

### 4.8 Map

```javascript
// 创建
const map = new Map([
    ['a', 1],
    ['b', 2]
]);

// 方法
map.set(key, value);      // 设置，返回 map
map.get(key);             // 获取
map.has(key);             // 是否包含
map.delete(key);          // 删除，返回是否成功
map.clear();              // 清空
map.size;                 // 大小

// 遍历
for (const [key, value] of map) { ... }
for (const key of map.keys()) { ... }
for (const value of map.values()) { ... }
for (const entry of map.entries()) { ... }
map.forEach((value, key) => { ... });

// 转数组
[...map];              // [[key, value], ...]
[...map.keys()];      // [key, ...]
[...map.values()];    // [value, ...]

// 常见用法：对象转 Map
const obj = {a: 1, b: 2};
const map = new Map(Object.entries(obj));

// Map 转对象
Object.fromEntries(map);
```

---

### 4.9 WeakMap

```javascript
// 与 Map 的区别：
// 1. key 只能是对象
// 2. 弱引用
// 3. 不可遍历
// 4. 没有 size

const wm = new WeakMap();
const obj = {};
wm.set(obj, 'value');
wm.get(obj); // 'value'
```

---

### 4.10 类 (Class)

```javascript
class Animal {
    // 构造函数
    constructor(name) {
        this.name = name;
    }

    // 实例方法
    speak() {
        console.log(`${this.name} makes a sound`);
    }

    // 静态方法
    static create(name) {
        return new Animal(name);
    }

    // getter/setter
    get info() {
        return `Name: ${this.name}`;
    }

    set info(value) {
        this.name = value;
    }
}

// 继承
class Dog extends Animal {
    constructor(name, breed) {
        super(name); // 调用父类构造函数
        this.breed = breed;
    }

    // 重写方法
    speak() {
        console.log(`${this.name} barks`);
    }

    // 新方法
    fetch() {
        console.log(`${this.name} fetches the ball`);
    }
}

const dog = new Dog('Buddy', 'Labrador');
dog.speak(); // 'Buddy barks'
```

---

### 4.11 生成器 (Generator)

```javascript
function* generator() {
    yield 1;
    yield 2;
    return 3;
}

const gen = generator();
gen.next(); // {value: 1, done: false}
gen.next(); // {value: 2, done: false}
gen.next(); // {value: 3, done: true}

// 常见用法：无限序列
function* fibonacci() {
    let [prev, curr] = [0, 1];
    while (true) {
        yield curr;
        [prev, curr] = [curr, prev + curr];
    }
}

// 可迭代
for (const n of fibonacci()) {
    if (n > 1000) break;
    console.log(n);
}
```

---

### 4.12 迭代器 (Iterator)

```javascript
// 可迭代协议：实现 Symbol.iterator
const obj = {
    data: [1, 2, 3],
    [Symbol.iterator]() {
        let index = 0;
        return {
            next: () => {
                if (index < this.data.length) {
                    return {value: this.data[index++], done: false};
                }
                return {done: true};
            }
        };
    }
};

for (const x of obj) {
    console.log(x); // 1, 2, 3
}
```

---

## 五、Math 数学运算

### 常用方法

```javascript
// 取整
Math.floor(3.7);  // 3 - 向下取整
Math.ceil(3.2);   // 4 - 向上取整
Math.round(3.5);  // 4 - 四舍五入
Math.trunc(3.7); // 3 - 截断整数部分

// 最大最小值
Math.max(1, 2, 3);           // 3
Math.min(1, 2, 3);           // 1
Math.max(...arr);            // 数组取最大值
Math.min(...arr);            // 数组取最小值

// 幂与根
Math.pow(2, 3);    // 8 - 2^3
Math.sqrt(16);     // 4 - 平方根
Math.cbrt(8);      // 2 - 立方根
2 ** 3;            // 8 - ES6 幂运算符

// 对数
Math.log(e);       // 1
Math.log10(100);   // 2
Math.log2(8);      // 3

// 随机数
Math.random();      // [0, 1) 随机小数

// 生成 [min, max) 随机整数
Math.floor(Math.random() * (max - min)) + min;
// 生成 [min, max] 随机整数
Math.floor(Math.random() * (max - min + 1)) + min;

// 绝对值
Math.abs(-5);      // 5

// 三角函数
Math.sin(x);
Math.cos(x);
Math.tan(x);
Math.asin(x);
Math.acos(x);
Math.atan(x);
Math.atan2(y, x);  // 返回 y/x 的反正切

// 常量
Math.PI;           // π
Math.E;            // e
```

---

## 六、Number 数值方法

```javascript
// 转换为数值
Number('123');     // 123
Number('12.3');    // 12.3
Number('12a');     // NaN
Number(true);      // 1
Number(false);     // 0
Number(null);      // 0
Number(undefined); // NaN

// parseInt / parseFloat
parseInt('123');      // 123
parseInt('123.45');   // 123
parseInt('10', 2);    // 2 - 二进制
parseInt('ff', 16);   // 255 - 十六进制

parseFloat('123.45'); // 123.45
parseFloat('12.34.56'); // 12.34

// 检查是否为有限数
isFinite(123);     // true
isFinite(Infinity); // false

// 检查是否为 NaN
isNaN(NaN);        // true
isNaN('a');        // true (会转换)
Number.isNaN('a'); // false (不转换)

// 检查是否为整数
Number.isInteger(123);   // true
Number.isInteger(123.0);  // true
Number.isInteger(123.5);  // false

// 安全整数
Number.isSafeInteger(2**53 - 1); // true
Number.isSafeInteger(2**53);     // false
Number.MAX_SAFE_INTEGER;
Number.MIN_SAFE_INTEGER;

// EPSILON - 浮点精度
Number.EPSILON; // 2^-52，用于浮点比较

// 判断两个浮点数相等
function isEqual(a, b) {
    return Math.abs(a - b) < Number.EPSILON;
}

// 进制转换
(255).toString(16); // 'ff'
(255).toString(2);  // '11111111'
```

---

## 七、Date 日期处理

### 创建日期

```javascript
new Date();                    // 当前时间
new Date(ms);                  // 毫秒时间戳
new Date(dateString);          // 解析字符串
new Date(year, month, day, hour, minute, second, ms);

// 示例
new Date(2024, 0, 1);         // 2024-01-01 (月份从 0 开始)
new Date('2024-01-01');       // ISO 格式
new Date('2024/01/01');       // 本地格式
new Date(1704067200000);     // 毫秒时间戳
```

---

### 获取方法

```javascript
const date = new Date();

date.getFullYear();     // 年 (2024)
date.getMonth();        // 月 (0-11)
date.getDate();         // 日 (1-31)
date.getDay();          // 星期 (0-6)
date.getHours();        // 时 (0-23)
date.getMinutes();      // 分 (0-59)
date.getSeconds();      // 秒 (0-59)
date.getMilliseconds(); // 毫秒 (0-999)

date.getTime();         // 毫秒时间戳
date.valueOf();         // 毫秒时间戳 (同 getTime)

// UTC 版本
date.getUTCFullYear();
date.getUTCMonth();
// ... 其他 UTC 方法

// 时区偏移 (分钟)
date.getTimezoneOffset(); // -480 (UTC+8)
```

---

### 设置方法

```javascript
const date = new Date();

date.setFullYear(2024);
date.setMonth(0);      // 1月
date.setDate(15);
date.setHours(12, 30, 0, 0); // 时分秒毫秒
date.setMinutes(30);
date.setSeconds(0);
date.setMilliseconds(0);
date.setTime(1704067200000);
```

---

### 格式化方法

```javascript
const date = new Date();

date.toString();         // 'Thu Jan 01 2024 00:00:00 GMT+0800'
date.toDateString();     // 'Thu Jan 01 2024'
date.toTimeString();     // '00:00:00 GMT+0800'

date.toISOString();      // '2024-01-01T00:00:00.000Z'
date.toUTCString();      // 'Sun, 31 Dec 2023 16:00:00 GMT'

date.toLocaleString();         // 本地格式
date.toLocaleString('zh-CN');  // 中文格式
date.toLocaleDateString();     // 本地日期
date.toLocaleTimeString();     // 本地时间
```

---

### 时间戳

```javascript
// 获取时间戳
Date.now();              // 毫秒
+new Date();             // 毫秒
new Date().getTime();    // 毫秒
new Date().valueOf();    // 毫秒

// 秒级时间戳
Math.floor(Date.now() / 1000);
```

---

### 日期计算

```javascript
// 加减日期
function addDays(date, days) {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
}

function addMonths(date, months) {
    const result = new Date(date);
    result.setMonth(result.getMonth() + months);
    return result;
}

// 计算天数差
function daysBetween(date1, date2) {
    const ms = Math.abs(date1 - date2);
    return Math.floor(ms / (1000 * 60 * 60 * 24));
}

// 判断闰年
function isLeapYear(year) {
    return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
}
```

---

## 八、JSON 数据转换

```javascript
// 序列化
JSON.stringify(value, replacer, space);
// value: 要转换的值
// replacer: 函数或数组（可选）
// space: 缩进空格数或字符串

// 基本使用
JSON.stringify({a: 1});           // '{"a":1}'
JSON.stringify([1, 2, 3]);        // '[1,2,3]'
JSON.stringify({a: 1}, null, 2);  // 格式化输出

// toJSON 方法
const obj = {
    a: 1,
    toJSON() { return {a: this.a}; }
};
JSON.stringify(obj); // '{"a":1}'

// 注意事项
JSON.stringify({a: undefined});    // '{}' - undefined 被忽略
JSON.stringify({a: function(){}});// '{}' - 函数被忽略
JSON.stringify({a: Symbol('s')}); // '{}' - Symbol 被忽略
JSON.stringify([undefined]);     // '[null]' - 数组中转为 null
JSON.stringify({a: NaN});         // '{"a":null}'
JSON.stringify({a: Infinity});   // '{"a":null}'
JSON.stringify({a: /regex/});     // '{}'

// 解析
JSON.parse(str, reviver);
// reviver: 可选的转换函数

JSON.parse('{"a":1}');     // {a: 1}
JSON.parse('{"a":1}', (k, v) => {
    if (k === 'a') return v * 2;
    return v;
}); // {a: 2}
```

---

## 九、Map 与 Set 补充

### Map 完整 API

```javascript
const map = new Map();

// 基础操作
map.set(key, value);
map.get(key);
map.has(key);
map.delete(key);
map.clear();
map.size;

// 遍历
map.forEach((value, key, map) => { ... });
for (const [key, value] of map.entries()) { ... }
for (const key of map.keys()) { ... }
for (const value of map.values()) { ... }

// 迭代器
map[Symbol.iterator] === map.entries;

// 常见用法：按插入顺序遍历
const map = new Map();
map.set('one', 1);
map.set('two', 2);
[...map]; // [['one',1], ['two',2]]
```

---

### Set 完整 API

```javascript
const set = new Set();

// 基础操作
set.add(value);
set.has(value);
set.delete(value);
set.clear();
set.size;

// 遍历
set.forEach((value, value2, set) => { ... });
for (const value of set) { ... };
[...set]; // 数组

// 集合运算
const setA = new Set([1, 2, 3]);
const setB = new Set([2, 3, 4]);

// 并集
new Set([...setA, ...setB]); // {1,2,3,4}

// 交集
[...setA].filter(x => setB.has(x)); // {2,3}

// 差集 (A - B)
[...setA].filter(x => !setB.has(x)); // {1}

// 对称差集
[...setA].filter(x => !setB.has(x)),
...[...setB].filter(x => !setA.has(x)); // {1,4}
```

---

## 十、Symbol 与 BigInt

### Symbol 完整用法

```javascript
// 基本
const s = Symbol('desc');
const s2 = Symbol.for('key'); // 注册表
Symbol.keyFor(s2); // 'key'

// 常用内置 Symbol
Symbol.iterator;    // 可迭代
Symbol.toStringTag;

// 自定义迭代器
const obj = {
    [Symbol.iterator]() {
        let i = 0;
        return {
            next() {
                if (i < 3) return {value: i++, done: false};
                return {done: true};
            }
        };
    }
};
[...obj]; // [0, 1, 2]

// Symbol 不可枚举
Object.keys(obj); // []
Object.getOwnPropertySymbols(obj); // [Symbol]
```

---

### BigInt

```javascript
// 创建
const big = 123n;          // 字面量
const big = BigInt(123);   // 构造函数

// 运算
1n + 2n;      // 3n
2n ** 10n;    // 1024n
7n / 2n;      // 3n (整数除法)

// 比较
1n === 1;     // false (类型不同)
1n == 1;      // true (宽松比较)

// 不能与 Number 混合运算
// 1n + 1; // TypeError
```

---

## 十一、Proxy 与 Reflect

### Proxy

```javascript
const proxy = new Proxy(target, handler);

// handler 方法
{
    get(target, prop, receiver) { ... },
    set(target, prop, value, receiver) { ... },
    has(target, prop) { ... },
    deleteProperty(target, prop) { ... },
    apply(target, thisArg, args) { ... },
    construct(target, args) { ... },
    getOwnPropertyDescriptor(target, prop) { ... },
    defineProperty(target, prop, descriptor) { ... },
    getPrototypeOf(target) { ... },
    setPrototypeOf(target, proto) { ... },
    preventExtensions(target) { ... },
    isExtensible(target) { ... }
}

// 示例：数据响应式
function reactive(obj) {
    return new Proxy(obj, {
        get(target, prop) {
            console.log(`读取 ${prop}`);
            return target[prop];
        },
        set(target, prop, value) {
            console.log(`设置 ${prop} = ${value}`);
            target[prop] = value;
        }
    });
}

// 示例：验证
function validate(obj) {
    return new Proxy(obj, {
        set(target, prop, value) {
            if (prop === 'age' && (value < 0 || value > 150)) {
                throw new Error('年龄无效');
            }
            target[prop] = value;
            return true;
        }
    });
}
```

---

### Reflect

```javascript
// 替代 Object 的静态方法
Reflect.get(target, prop, receiver);
Reflect.set(target, prop, value, receiver);
Reflect.has(target, prop);
Reflect.deleteProperty(target, prop);
Reflect.apply(fn, thisArg, args);
Reflect.construct(constructor, args);

// 与 Proxy 配合
function reactive(obj) {
    return new Proxy(obj, {
        get(target, prop) {
            // 使用 Reflect 返回默认值
            return Reflect.get(target, prop);
        },
        set(target, prop, value) {
            return Reflect.set(target, prop, value);
        }
    });
}

// 常见用法：函数调用
Reflect.apply(Math.floor, undefined, [1.5]); // 1
Reflect.apply(String.fromCharCode, undefined, [104, 105]); // 'hi'

// 常见用法：构造函数
Reflect.construct(Array, [3]); // 等同于 new Array(3)
```

---

## 十二、异步编程 Promise

### Promise 基础

```javascript
// 创建 Promise
const promise = new Promise((resolve, reject) => {
    // 异步操作
    if (success) {
        resolve(value);
    } else {
        reject(error);
    }
});

// 使用
promise
    .then(value => { ... })
    .catch(error => { ... })
    .finally(() => { ... });

// Promise 状态
// pending -> fulfilled 或 rejected
// 一旦确定，不可改变
```

---

### Promise 静态方法

```javascript
// Promise.resolve() - 创建已决议的 Promise
Promise.resolve(value);
Promise.resolve(promise); // 直接返回
Promise.resolve(() => {}); // 立即 resolved 的 thenable

// Promise.reject() - 创建已拒绝的 Promise
Promise.reject(error);

// Promise.all() - 所有 Promise 都 resolved
Promise.all([p1, p2, p3])
    .then(([v1, v2, v3]) => { ... });

// Promise.allSettled() - 所有 Promise 都 settled (ES2020)
Promise.allSettled([p1, p2, p3])
    .then(results => {
        results.forEach(r => {
            if (r.status === 'fulfilled') r.value;
            else r.reason;
        });
    });

// Promise.race() - 第一个 settled 的结果
Promise.race([p1, p2, p3])
    .then(value => { ... });

// Promise.any() - 第一个 resolved (ES2021)
Promise.any([p1, p2, p3])
    .then(value => { ... })
    .catch(errors => { ... }); // 全部 rejected
```

---

### async/await

```javascript
// async 函数
async function fn() {
    return 'hello';
}
// 等同于
function fn() {
    return Promise.resolve('hello');
}

// await
async function fn() {
    const result = await promise;
    // 等待 promise resolved
    return result;
}

// 错误处理
async function fn() {
    try {
        const result = await promise;
    } catch (e) {
        console.error(e);
    }
}

// 并行执行
async function fn() {
    const [r1, r2] = await Promise.all([p1, p2]);
    return [r1, r2];
}

// 常见面试题
async function serial() {
    for (const item of items) {
        await processItem(item); // 串行
    }
}

async function parallel() {
    await Promise.all(items.map(item => processItem(item))); // 并行
}
```

---

### 手写 Promise

```javascript
class MyPromise {
    constructor(executor) {
        this.state = 'pending';
        this.value = undefined;
        this.reason = undefined;
        this.onFulfilledCallbacks = [];
        this.onRejectedCallbacks = [];

        const resolve = (value) => {
            if (this.state === 'pending') {
                this.state = 'fulfilled';
                this.value = value;
                this.onFulfilledCallbacks.forEach(cb => cb(this.value));
            }
        };

        const reject = (reason) => {
            if (this.state === 'pending') {
                this.state = 'rejected';
                this.reason = reason;
                this.onRejectedCallbacks.forEach(cb => cb(this.reason));
            }
        };

        try {
            executor(resolve, reject);
        } catch (e) {
            reject(e);
        }
    }

    then(onFulfilled, onRejected) {
        return new MyPromise((resolve, reject) => {
            if (this.state === 'fulfilled') {
                try {
                    const result = onFulfilled ? onFulfilled(this.value) : this.value;
                    resolve(result);
                } catch (e) {
                    reject(e);
                }
            }

            if (this.state === 'rejected') {
                try {
                    const result = onRejected ? onRejected(this.reason) : this.reason;
                    reject(result);
                } catch (e) {
                    reject(e);
                }
            }

            if (this.state === 'pending') {
                this.onFulfilledCallbacks.push(value => {
                    try {
                        const result = onFulfilled ? onFulfilled(value) : value;
                        resolve(result);
                    } catch (e) {
                        reject(e);
                    }
                });

                this.onRejectedCallbacks.push(reason => {
                    try {
                        const result = onRejected ? onRejected(reason) : reason;
                        reject(result);
                    } catch (e) {
                        reject(e);
                    }
                });
            }
        });
    }

    catch(onRejected) {
        return this.then(null, onRejected);
    }

    finally(onFinally) {
        return this.then(
            value => MyPromise.resolve(onFinally()).then(() => value),
            reason => MyPromise.resolve(onFinally()).then(() => { throw reason; })
        );
    }

    static resolve(value) {
        return new MyPromise(resolve => resolve(value));
    }

    static reject(reason) {
        return new MyPromise((_, reject) => reject(reason));
    }

    static all(promises) {
        return new MyPromise((resolve, reject) => {
            const results = [];
            let count = 0;

            promises.forEach((p, i) => {
                MyPromise.resolve(p).then(
                    value => {
                        results[i] = value;
                        count++;
                        if (count === promises.length) {
                            resolve(results);
                        }
                    },
                    reject
                );
            });
        });
    }
}
```

---

## 十三、手写代码常用模式

### 1. 深拷贝

```javascript
// 基础版（无法处理函数、正则等）
function deepClone(obj) {
    if (obj === null || typeof obj !== 'object') return obj;
    if (Array.isArray(obj)) return obj.map(item => deepClone(item));
    return Object.fromEntries(
        Object.entries(obj).map(([k, v]) => [k, deepClone(v)])
    );
}

// 完整版
function deepClone(obj, hash = new WeakMap()) {
    if (obj === null || typeof obj !== 'object') return obj;
    if (obj instanceof Date) return new Date(obj);
    if (obj instanceof RegExp) return new RegExp(obj.source, obj.flags);
    if (obj instanceof Map) {
        const clone = new Map();
        obj.forEach((v, k) => clone.set(k, deepClone(v, hash)));
        return clone;
    }
    if (obj instanceof Set) {
        const clone = new Set();
        obj.forEach(v => clone.add(deepClone(v, hash)));
        return clone;
    }

    if (hash.has(obj)) return hash.get(obj);
    const clone = Object.create(obj.constructor.prototype);
    hash.set(obj, clone);

    for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
            clone[key] = deepClone(obj[key], hash);
        }
    }
    return clone;
}

// 现代浏览器/Node
const clone = structuredClone(obj);
```

---

### 2. 防抖 (Debounce)

```javascript
function debounce(fn, delay, immediate = false) {
    let timer = null;
    return function(...args) {
        const context = this;

        if (timer) clearTimeout(timer);

        if (immediate && !timer) {
            fn.apply(context, args);
        }

        timer = setTimeout(() => {
            if (!immediate) {
                fn.apply(context, args);
            }
            timer = null;
        }, delay);
    };
}

// 使用
window.addEventListener('resize', debounce(handleResize, 300));
```

---

### 3. 节流 (Throttle)

```javascript
function throttle(fn, delay) {
    let last = 0;
    return function(...args) {
        const now = Date.now();
        if (now - last >= delay) {
            last = now;
            fn.apply(this, args);
        }
    };
}

// 或使用时间戳 + 定时器（确保最后一次执行）
function throttle(fn, delay) {
    let last = 0, timer = null;
    return function(...args) {
        const now = Date.now();
        const remaining = delay - (now - last);

        if (remaining <= 0) {
            if (timer) {
                clearTimeout(timer);
                timer = null;
            }
            last = now;
            fn.apply(this, args);
        } else if (!timer) {
            timer = setTimeout(() => {
                last = Date.now();
                timer = null;
                fn.apply(this, args);
            }, remaining);
        }
    };
}
```

---

### 4. 科里化 (Curry)

```javascript
function curry(fn) {
    return function curried(...args) {
        if (args.length >= fn.length) {
            return fn.apply(this, args);
        }
        return function(...args2) {
            return curried.apply(this, [...args, ...args2]);
        };
    };
}

// 示例
const add = (a, b, c) => a + b + c;
const curriedAdd = curry(add);
curriedAdd(1)(2)(3);   // 6
curriedAdd(1, 2)(3);   // 6
curriedAdd(1)(2, 3);   // 6
```

---

### 5. 偏函数 (Partial)

```javascript
function partial(fn, ...args) {
    return function(...args2) {
        return fn(...args, ...args2);
    };
}

// 或
function partial(fn, ...args) {
    return fn.bind(null, ...args);
}

// 示例
const add = (a, b, c) => a + b + c;
const add5 = partial(add, 5);
add5(1, 2); // 8
```

---

### 6. 数组去重

```javascript
// 方法1: Set
[...new Set(arr)];

// 方法2: filter + indexOf
arr.filter((v, i) => arr.indexOf(v) === i);

// 方法3: reduce
arr.reduce((acc, v) => acc.includes(v) ? acc : [...acc, v], []);

// 方法4: Map (保持插入顺序)
[...arr.reduce((map, v) => map.set(v, v), new Map()).values()];

// 复杂类型去重
const unique = (arr, key) => {
    const seen = new Set();
    return arr.filter(item => {
        const k = key(item);
        return seen.has(k) ? false : seen.add(k);
    });
};
```

---

### 7. 数组扁平化

```javascript
// 方法1: flat
arr.flat(Infinity);

// 方法2: reduce + concat
function flatten(arr) {
    return arr.reduce((acc, v) =>
        Array.isArray(v) ? [...acc, ...flatten(v)] : [...acc, v],
        []
    );
}

// 方法3: while + some
function flatten(arr) {
    while (arr.some(Array.isArray)) {
        arr = [].concat(...arr);
    }
    return arr;
}
```

---

### 8. 合并有序数组

```javascript
function mergeSortedArrays(arr1, arr2) {
    const result = [];
    let i = 0, j = 0;

    while (i < arr1.length && j < arr2.length) {
        if (arr1[i] <= arr2[j]) {
            result.push(arr1[i++]);
        } else {
            result.push(arr2[j++]);
        }
    }

    return [...result, ...arr1.slice(i), ...arr2.slice(j)];
}
```

---

### 9. LRU 缓存

```javascript
class LRUCache {
    constructor(capacity) {
        this.capacity = capacity;
        this.cache = new Map();
    }

    get(key) {
        if (!this.cache.has(key)) return -1;
        const value = this.cache.get(key);
        this.cache.delete(key);
        this.cache.set(key, value); // 移到末尾
        return value;
    }

    put(key, value) {
        if (this.cache.has(key)) {
            this.cache.delete(key);
        } else if (this.cache.size >= this.capacity) {
            const firstKey = this.cache.keys().next().value;
            this.cache.delete(firstKey);
        }
        this.cache.set(key, value);
    }
}
```

---

### 10. 快速排序

```javascript
function quickSort(arr) {
    if (arr.length <= 1) return arr;

    const pivot = arr[arr.length - 1];
    const left = [];
    const right = [];

    for (let i = 0; i < arr.length - 1; i++) {
        if (arr[i] < pivot) {
            left.push(arr[i]);
        } else {
            right.push(arr[i]);
        }
    }

    return [...quickSort(left), pivot, ...quickSort(right)];
}

// 原地快排
function quickSortInPlace(arr, left = 0, right = arr.length - 1) {
    if (left >= right) return;

    const pivotIndex = partition(arr, left, right);
    quickSortInPlace(arr, left, pivotIndex - 1);
    quickSortInPlace(arr, pivotIndex + 1, right);

    return arr;
}

function partition(arr, left, right) {
    const pivot = arr[right];
    let i = left - 1;

    for (let j = left; j < right; j++) {
        if (arr[j] <= pivot) {
            i++;
            [arr[i], arr[j]] = [arr[j], arr[i]];
        }
    }

    [arr[i + 1], arr[right]] = [arr[right], arr[i + 1]];
    return i + 1;
}
```

---

### 11. 归并排序

```javascript
function mergeSort(arr) {
    if (arr.length <= 1) return arr;

    const mid = Math.floor(arr.length / 2);
    const left = mergeSort(arr.slice(0, mid));
    const right = mergeSort(arr.slice(mid));

    return merge(left, right);
}

function merge(left, right) {
    const result = [];
    let i = 0, j = 0;

    while (i < left.length && j < right.length) {
        if (left[i] <= right[j]) {
            result.push(left[i++]);
        } else {
            result.push(right[j++]);
        }
    }

    return [...result, ...left.slice(i), ...right.slice(j)];
}
```

---

### 12. 二分查找

```javascript
// 查找目标值
function binarySearch(arr, target) {
    let left = 0, right = arr.length - 1;

    while (left <= right) {
        const mid = Math.floor((left + right) / 2);
        if (arr[mid] === target) return mid;
        if (arr[mid] < target) left = mid + 1;
        else right = mid - 1;
    }

    return -1;
}

// 查找左边界
function leftBound(arr, target) {
    let left = 0, right = arr.length - 1;

    while (left <= right) {
        const mid = Math.floor((left + right) / 2);
        if (arr[mid] < target) left = mid + 1;
        else right = mid - 1;
    }

    return left;
}

// 查找右边界
function rightBound(arr, target) {
    let left = 0, right = arr.length - 1;

    while (left <= right) {
        const mid = Math.floor((left + right) / 2);
        if (arr[mid] <= target) left = mid + 1;
        else right = mid - 1;
    }

    return right;
}
```

---

### 13. 链表操作

```javascript
// 定义链表节点
class ListNode {
    constructor(val = 0, next = null) {
        this.val = val;
        this.next = next;
    }
}

// 反转链表
function reverseList(head) {
    let prev = null;
    let curr = head;

    while (curr) {
        const next = curr.next;
        curr.next = prev;
        prev = curr;
        curr = next;
    }

    return prev;
}

// 合并两个有序链表
function mergeTwoLists(l1, l2) {
    const dummy = new ListNode(-1);
    let curr = dummy;

    while (l1 && l2) {
        if (l1.val <= l2.val) {
            curr.next = l1;
            l1 = l1.next;
        } else {
            curr.next = l2;
            l2 = l2.next;
        }
        curr = curr.next;
    }

    curr.next = l1 || l2;
    return dummy.next;
}

// 检测环
function hasCycle(head) {
    let slow = head, fast = head;

    while (fast && fast.next) {
        slow = slow.next;
        fast = fast.next.next;
        if (slow === fast) return true;
    }

    return false;
}

// 找到环的起点
function detectCycle(head) {
    let slow = head, fast = head;

    while (fast && fast.next) {
        slow = slow.next;
        fast = fast.next.next;
        if (slow === fast) break;
    }

    if (!fast || !fast.next) return null;

    slow = head;
    while (slow !== fast) {
        slow = slow.next;
        fast = fast.next;
    }

    return slow;
}
```

---

### 14. 树操作

```javascript
// 定义二叉树节点
class TreeNode {
    constructor(val = 0, left = null, right = null) {
        this.val = val;
        this.left = left;
        this.right = right;
    }
}

// 前序遍历 (根-左-右)
function preorder(root) {
    if (!root) return [];
    return [root.val, ...preorder(root.left), ...preorder(root.right)];
}

// 中序遍历 (左-根-右)
function inorder(root) {
    if (!root) return [];
    return [...inorder(root.left), root.val, ...inorder(root.right)];
}

// 后序遍历 (左-右-根)
function postorder(root) {
    if (!root) return [];
    return [...postorder(root.left), ...postorder(root.right), root.val];
}

// 层序遍历
function levelOrder(root) {
    if (!root) return [];
    const result = [];
    const queue = [root];

    while (queue.length) {
        const level = [];
        const size = queue.length;

        for (let i = 0; i < size; i++) {
            const node = queue.shift();
            level.push(node.val);
            if (node.left) queue.push(node.left);
            if (node.right) queue.push(node.right);
        }

        result.push(level);
    }

    return result;
}

// 最大深度
function maxDepth(root) {
    if (!root) return 0;
    return 1 + Math.max(maxDepth(root.left), maxDepth(root.right));
}

// 验证二叉搜索树
function isValidBST(root, min = -Infinity, max = Infinity) {
    if (!root) return true;
    if (root.val <= min || root.val >= max) return false;
    return isValidBST(root.left, min, root.val) &&
           isValidBST(root.right, root.val, max);
}
```

---

### 15. 字符串操作

```javascript
// 反转字符串
function reverseString(s) {
    let left = 0, right = s.length - 1;
    while (left < right) {
        [s[left], s[right]] = [s[right], s[left]];
        left++;
        right--;
    }
    return s;
}

// 判断回文
function isPalindrome(s) {
    const cleaned = s.toLowerCase().replace(/[^a-z0-9]/g, '');
    return cleaned === cleaned.split('').reverse().join('');
}

// 最长公共前缀
function longestCommonPrefix(strs) {
    if (!strs.length) return '';

    for (let i = 0; i < strs[0].length; i++) {
        const char = strs[0][i];
        for (let j = 1; j < strs.length; j++) {
            if (strs[j][i] !== char) {
                return strs[0].slice(0, i);
            }
        }
    }

    return strs[0];
}

// 字符串排列组合
function permutation(s) {
    const result = [];

    function backtrack(chars, path) {
        if (!chars.length) {
            result.push(path);
            return;
        }

        for (let i = 0; i < chars.length; i++) {
            backtrack(
                chars.slice(0, i) + chars.slice(i + 1),
                path + chars[i]
            );
        }
    }

    backtrack(s, '');
    return [...new Set(result)];
}
```

---

## 附录：常见面试代码片段

### 1. 模拟 API 请求（带重试）

```javascript
async function fetchWithRetry(fn, retries = 3) {
    for (let i = 0; i < retries; i++) {
        try {
            return await fn();
        } catch (e) {
            if (i === retries - 1) throw e;
            await new Promise(r => setTimeout(r, 1000 * (i + 1)));
        }
    }
}
```

---

### 2. 斐波那契数列

```javascript
// 递归（效率低）
function fib(n) {
    if (n <= 1) return n;
    return fib(n - 1) + fib(n - 2);
}

// 记忆化
function fibMemo(n, memo = {}) {
    if (n in memo) return memo[n];
    if (n <= 1) return n;
    memo[n] = fibMemo(n - 1, memo) + fibMemo(n - 2, memo);
    return memo[n];
}

// 迭代
function fibIter(n) {
    if (n <= 1) return n;
    let a = 0, b = 1;
    for (let i = 2; i <= n; i++) {
        [a, b] = [b, a + b];
    }
    return b;
}
```

---

### 3. 洗牌算法 (Fisher-Yates)

```javascript
function shuffle(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}
```

---

### 4. 顺序执行异步任务

```javascript
async function sequential(tasks) {
    const results = [];
    for (const task of tasks) {
        results.push(await task());
    }
    return results;
}
```

---

### 5. 并发限制

```javascript
async function limitConcurrency(tasks, limit) {
    const results = [];
    const executing = [];

    for (const task of tasks) {
        const p = task().then(result => {
            results.push(result);
            executing.splice(executing.indexOf(p), 1);
        });

        executing.push(p);

        if (executing.length >= limit) {
            await Promise.race(executing);
        }
    }

    return Promise.all(executing).then(() => results);
}
```

---

> 文档持续更新中，如有错误欢迎指正。
