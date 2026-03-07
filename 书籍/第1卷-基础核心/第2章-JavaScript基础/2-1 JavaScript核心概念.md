# JavaScript 核心概念

## 一、执行机制与事件循环

### 1.1 浏览器 Event Loop 深度解析

**参考答案：**

```
┌─────────────────────────────────────────────────────────────────┐
│                      浏览器 Event Loop                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌────────────────────────────────────────────────────────┐     │
│  │                    主线程 (Main Thread)                 │     │
│  │                                                         │     │
│  │   ┌─────────────┐    ┌─────────────┐                  │     │
│  │   │  执行栈     │    │   堆内存    │                  │     │
│  │   │  (Call      │    │  (Heap)     │                  │     │
│  │   │   Stack)    │    │             │                  │     │
│  │   └──────┬──────┘    └─────────────┘                  │     │
│  │          │                                             │     │
│  └──────────┼─────────────────────────────────────────────┘     │
│             │                                                   │
│             ▼                                                   │
│  ┌────────────────────────────────────────────────────────┐     │
│  │              Web APIs (浏览器环境)                      │     │
│  │   setTimeout | setInterval | DOM Events | AJAX | ...  │     │
│  └────────────────────────────────────────────────────────┘     │
│                                                                  │
│  ┌───────────────┐              ┌───────────────────┐         │
│  │  宏任务队列    │              │    微任务队列      │         │
│  │ (Task Queue) │              │ (MicroTask Queue) │         │
│  │               │              │                   │         │
│  │ setTimeout   │              │ Promise.then      │         │
│  │ setInterval  │              │ MutationObserver  │         │
│  │ UI rendering │              │ process.nextTick │         │
│  │ I/O          │              │ queueMicrotask   │         │
│  └───────────────┘              └───────────────────┘         │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

**执行顺序**：

```javascript
console.log(1);  // 同步任务

setTimeout(() => {
  console.log(2);  // 宏任务
}, 0);

new Promise((resolve) => {
  console.log(3);  // 同步任务
  resolve();
}).then(() => {
  console.log(4);  // 微任务
});

console.log(5);
// 输出顺序: 3, 5, 4, 2
```

**核心要点**：
- 主线程执行完当前所有同步代码后，才开始执行 Event Loop
- 每次宏任务执行完毕后，立即清空所有微任务
- 微任务优先级高于宏任务
- `requestAnimationFrame` 在渲染前执行
- `setTimeout` 最小延迟为 4ms（浏览器优化）

---

### 1.2 宏任务与微任务详解

**参考答案：**

| 类型 | 来源 | 特点 |
| :--- | :--- | :--- |
| **宏任务 (Macrotask)** | setTimeout, setInterval, I/O, UI rendering, script | 每次从队列取出一个执行 |
| **微任务 (Microtask)** | Promise.then/catch/finally, MutationObserver, queueMicrotask, process.nextTick | 批量执行，清空为止 |

**详细分类**：

```javascript
// 宏任务
setTimeout(() => {}, 0);
setInterval(() => {}, 0);
requestAnimationFrame(() => {});
I/O 操作 (文件读写、网络请求)
UI 渲染

// 微任务
Promise.then/catch/finally
async/await (底层是 Promise)
MutationObserver
queueMicrotask()
process.nextTick (Node.js 优先于 Promise)
Object.observe (已废弃)
```

---

### 1.3 async/await 执行原理

**参考答案：**

**async/await 是 Promise 的语法糖**：

```javascript
// async 函数返回值
async function fetchData() {
  return 'data';
}
// 等同于
function fetchData() {
  return Promise.resolve('data');
}

// await 原理
async function example() {
  const result = await fetchData();
  console.log(result);
}
// 等同于
function example() {
  return fetchData().then(result => {
    console.log(result);
  });
}
```

**执行流程**：

```javascript
async function async1() {
  console.log('1');        // 同步
  await async2();          // 等待 Promise resolve
  console.log('2');        // 微任务
}

async function async2() {
  console.log('3');        // 同步
}

console.log('4');          // 同步

setTimeout(() => {
  console.log('5');        // 宏任务
}, 0);

async1();

new Promise(resolve => {
  console.log('6');        // 同步
  resolve();
}).then(() => {
  console.log('7');        // 微任务
});

console.log('8');          // 同步

// 输出: 4, 3, 6, 8, 2, 7, 5
```

---

### 1.4 Node.js Event Loop 与浏览器区别

**参考答案：**

```
┌─────────────────────────────────────────────────────────────────┐
│                    Node.js Event Loop                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│   ┌───────────────────────────────────────────────────────┐    │
│   │                     Timers Phase                       │    │
│   │              setTimeout, setInterval                   │    │
│   └───────────────────────┬───────────────────────────────┘    │
│                           ▼                                     │
│   ┌───────────────────────────────────────────────────────┐    │
│   │                  Pending Callbacks                    │    │
│   │            延迟的 I/O 回调 (内部使用)                   │    │
│   └───────────────────────┬───────────────────────────────┘    │
│                           ▼                                     │
│   ┌───────────────────────────────────────────────────────┐    │
│   │                    Idle, Prepare                      │    │
│   │              内部使用 (libuv 预留)                     │    │
│   └───────────────────────┬───────────────────────────────┘    │
│                           ▼                                     │
│   ┌───────────────────────────────────────────────────────┐    │
│   │                      Poll Phase                      │    │
│   │            获取新的 I/O 事件 (文件/网络)               │    │
│   └───────────────────────┬───────────────────────────────┘    │
│                           ▼                                     │
│   ┌───────────────────────────────────────────────────────┐    │
│   │                      Check Phase                     │    │
│   │                   setImmediate 回调                   │    │
│   └───────────────────────┬───────────────────────────────┘    │
│                           ▼                                     │
│   ┌───────────────────────────────────────────────────────┐    │
│   │                   Close Callbacks                     │    │
│   │                  socket.on('close')                  │    │
│   └───────────────────────────────────────────────────────┘    │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

**与浏览器 Event Loop 的区别**：

| 特性 | 浏览器 | Node.js |
| :--- | :--- | :--- |
| 微任务队列 | Promise.then | Promise.then + process.nextTick |
| nextTick | 无 | 优先于其他微任务 |
| setImmediate | 宏任务 | 在 check 阶段执行 |
| 渲染时机 | 每帧渲染 | 无 UI 渲染 |
| 定时器精度 | ~4ms | 更精确 |

---

## 二、原型与继承

### 2.1 原型链深度理解

**参考答案：**

```
┌─────────────────────────────────────────────────────────────────┐
│                         原型链                                  │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│    ┌─────────────────┐                                        │
│    │   Object.prototype│ ◄──────┐                              │
│    │  hasOwnProperty  │        │                               │
│    │  toString        │        │                               │
│    └────────┬─────────┘        │                               │
│             │                   │                               │
│    ┌────────▼─────────┐        │  prototype                    │
│    │   Person.prototype│ ──────┘                               │
│    │  sayName         │                                        │
│    └────────┬─────────┘                                        │
│             │                                                   │
│    ┌────────▼─────────┐                                        │
│    │    person        │                                        │
│    │  (实例对象)       │ ◄────── __proto__                    │
│    │  name: 'Tom'     │                                        │
│    └─────────────────┘                                        │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

**核心概念**：

```javascript
function Person(name) {
  this.name = name;
}

Person.prototype.sayName = function() {
  return this.name;
};

const person = new Person('Tom');

// 原型链查找
person.sayName();           // 自身属性
person.toString();         // 沿原型链查找
person.hasOwnProperty('name');  // 原型链查找
```

**属性详解**：

| 属性 | 说明 |
| :--- | :--- |
| `prototype` | 构造函数上的属性，指向原型对象 |
| `__proto__` | 对象实例上的属性，指向构造函数的 prototype |
| `constructor` | 原型对象上的属性，指向构造函数 |

---

### 2.2 new 操作符实现原理

**参考答案：**

**new 的执行过程**：

```javascript
function myNew(constructor, ...args) {
  // 1. 创建空对象，继承构造函数的 prototype
  const obj = Object.create(constructor.prototype);

  // 2. 执行构造函数，this 指向新对象
  const result = constructor.apply(obj, args);

  // 3. 返回结果（如果返回对象则用返回的，否则用新对象）
  return result instanceof Object ? result : obj;
}

// 使用
function Person(name) {
  this.name = name;
}

const person = myNew(Person, 'Tom');
console.log(person.name);  // Tom
```

**关键步骤**：
1. 创建新对象
2. 链接到原型
3. 绑定 this
4. 返回新对象

---

### 2.3 原型继承的 6 种方式

**参考答案：**

```javascript
// 父类
function Animal(name) {
  this.name = name;
}
Animal.prototype.speak = function() {
  return `${this.name} makes a sound`;
};

// 1. 原型链继承
function Dog() {}
Dog.prototype = new Animal('Animal');
Dog.prototype.constructor = Dog;

// 2. 构造函数继承（经典继承）
function Cat(name) {
  Animal.call(this, name);
}

// 3. 组合继承（最常用）
function Bird(name) {
  Animal.call(this, name);
}
Bird.prototype = new Animal();
Bird.prototype.constructor = Bird;

// 4. 原型式继承
function create(obj) {
  function F() {}
  F.prototype = obj;
  return new F();
}

// 5. 寄生式继承
function createEnhanced(obj) {
  const clone = Object.create(obj);
  clone.sayHi = function() { return 'Hi'; };
  return clone;
}

// 6. 寄生组合继承（最优）
function inherit(subClass, superClass) {
  const prototype = Object.create(superClass.prototype);
  prototype.constructor = subClass;
  subClass.prototype = prototype;
}
```

---

## 三、作用域与闭包

### 3.1 闭包深度理解

**参考答案：**

**闭包定义**：函数与其外部作用域的引用捆绑在一起，形成闭包。

```
┌─────────────────────────────────────────────────────────────────┐
│                         闭包原理                                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  function outer() {                                              │
│    let count = 0;                                                │
│                                                                  │
│    return function inner() {  ◄── 闭包函数                       │
│      count++;                            │                      │
│      return count;                       │ 记住 outer 的       │
│    };                                     │ 作用域              │
│  }                                          │                      │
│                                                 │               │
│  const fn = outer();  ◄── count 变量被 fn 引用，不被销毁         │
│  fn();  // 1                                                      │
│  fn();  // 2   count 仍在内存中                                   │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

**经典面试题**：

```javascript
// 题目 1：循环与闭包
for (var i = 0; i < 5; i++) {
  setTimeout(() => console.log(i), 100);
}
// 输出: 5, 5, 5, 5, 5

// 解决方案 1：使用 let
for (let i = 0; i < 5; i++) {
  setTimeout(() => console.log(i), 100);
}
// 输出: 0, 1, 2, 3, 4

// 解决方案 2：使用闭包
for (var i = 0; i < 5; i++) {
  ((j) => {
    setTimeout(() => console.log(j), 100);
  })(i);
}
```

**应用场景**：

```javascript
// 1. 数据私有化
function createCounter() {
  let count = 0;
  return {
    increment() { return ++count; },
    decrement() { return --count; },
    getCount() { return count; }
  };
}

// 2. 函数柯里化
function curry(fn) {
  return function curried(...args) {
    if (args.length >= fn.length) {
      return fn.apply(this, args);
    }
    return function(...args2) {
      return curried.apply(this, args.concat(args2));
    };
  };
}
```

---

### 3.2 作用域链理解

**参考答案：**

```
┌─────────────────────────────────────────────────────────────────┐
│                        作用域链                                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  全局作用域 (Global)                                            │
│       │                                                         │
│       ▼                                                         │
│  ┌────────────────────────────────────────────────────────┐     │
│  │  函数作用域 (Function Scope) - outer                    │     │
│  │       │                                                  │     │
│  │       ▼                                                  │     │
│  │  ┌──────────────────────────────────────────────────┐  │     │
│  │  │  函数作用域 (Function Scope) - inner             │  │     │
│  │  │  作用域链: inner → outer → global                │  │     │
│  │  └──────────────────────────────────────────────────┘  │     │
│  └────────────────────────────────────────────────────────┘     │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

**作用域类型**：
1. **全局作用域**：最外层，代码任何位置可访问
2. **函数作用域**：函数内部
3. **块级作用域**：`let` 和 `const`（ES6+）
4. **词法作用域**：函数定义时决定，而非运行时

---

## 四、函数式编程

### 4.1 防抖（Debounce）实现

**参考答案：**

```javascript
// 基础防抖
function debounce(fn, delay, immediate = false) {
  let timer = null;

  return function(...args) {
    const context = this;

    // 立即执行模式
    if (immediate && !timer) {
      fn.apply(context, args);
    }

    // 清除之前的定时器
    if (timer) clearTimeout(timer);

    // 设置新的定时器
    timer = setTimeout(() => {
      if (!immediate) {
        fn.apply(context, args);
      }
      timer = null;
    }, delay);
  };
}

// 增强版：支持取消和获取结果
function debouncePro(fn, delay, immediate = false) {
  let timer = null;
  let result;
  let lastArgs;
