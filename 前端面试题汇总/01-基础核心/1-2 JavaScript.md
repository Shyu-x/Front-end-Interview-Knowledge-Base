# JavaScript 深度进阶面试题库

---

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

console.log(：1,5);
// 输出顺序 3, 5, 4, 2
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

## 三、异步与 Promise

### 3.1 Promise 底层实现

**参考答案：**

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
        this.onFulfilledCallbacks.forEach(cb => cb());
      }
    };

    const reject = (reason) => {
      if (this.state === 'pending') {
        this.state = 'rejected';
        this.reason = reason;
        this.onRejectedCallbacks.forEach(cb => cb());
      }
    };

    try {
      executor(resolve, reject);
    } catch (error) {
      reject(error);
    }
  }

  then(onFulfilled, onRejected) {
    return new MyPromise((resolve, reject) => {
      if (this.state === 'fulfilled') {
        try {
          const result = onFulfilled(this.value);
          resolve(result);
        } catch (error) {
          reject(error);
        }
      }

      if (this.state === 'rejected') {
        try {
          const result = onRejected(this.reason);
          resolve(result);
        } catch (error) {
          reject(error);
        }
      }

      if (this.state === 'pending') {
        this.onFulfilledCallbacks.push(() => {
          try {
            const result = onFulfilled(this.value);
            resolve(result);
          } catch (error) {
            reject(error);
          }
        });
        this.onRejectedCallbacks.push(() => {
          try {
            const result = onRejected(this.reason);
            resolve(result);
          } catch (error) {
            reject(error);
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
      promises.forEach((promise, index) => {
        promise.then(value => {
          results[index] = value;
          count++;
          if (count === promises.length) {
            resolve(results);
          }
        }, reject);
      });
    });
  }

  static race(promises) {
    return new MyPromise((resolve, reject) => {
      promises.forEach(promise => {
        promise.then(resolve, reject);
      });
    });
  }
}
```

---

### 3.2 并发请求控制（手写版）

**参考答案：**

**限制并发数的 Promise 调度器**：

```javascript
class Scheduler {
  constructor(limit = 2) {
    this.limit = limit;
    this.running = 0;
    this.queue = [];
  }

  async add(promiseCreator) {
    // 如果当前运行数已满，等待
    if (this.running >= this.limit) {
      await new Promise(resolve => this.queue.push(resolve));
    }

    this.running++;
    try {
      return await promiseCreator();
    } finally {
      this.running--;
      // 取出队列中下一个任务
      if (this.queue.length > 0) {
        this.queue.shift()();
      }
    }
  }
}

// 测试
const delay = (ms) => new Promise(r => setTimeout(r, ms));

const scheduler = new Scheduler(2);

const tasks = [
  () => delay(1000).then(() => 'task1'),
  () => delay(500).then(() => 'task2'),
  () => delay(300).then(() => 'task3'),
  () => delay(400).then(() => 'task4'),
];

Promise.all(tasks.map(t => scheduler.add(t))).then(console.log);
// 输出顺序: task2, task3, task1, task4
```

---

### 3.3 Promise.all / race / allSettled 实现

**参考答案：**

```javascript
// Promise.all - 所有成功才成功，一个失败则失败
Promise.myAll = function(promises) {
  return new Promise((resolve, reject) => {
    if (!Array.isArray(promises)) {
      return reject(new TypeError('参数必须是数组'));
    }

    const results = [];
    let count = 0;

    if (promises.length === 0) return resolve([]);

    promises.forEach((promise, index) => {
      Promise.resolve(promise).then(
        value => {
          results[index] = value;
          count++;
          if (count === promises.length) {
            resolve(results);
          }
        },
        reason => reject(reason)
      );
    });
  });
};

// Promise.race - 返回最先完成的结果（无论成功/失败）
Promise.myRace = function(promises) {
  return new Promise((resolve, reject) => {
    promises.forEach(promise => {
      Promise.resolve(promise).then(resolve, reject);
    });
  });
};

// Promise.allSettled - 等待所有 Promise 完成（无论成功/失败）
Promise.myAllSettled = function(promises) {
  return new Promise((resolve) => {
    const results = [];
    let count = 0;

    if (promises.length === 0) return resolve([]);

    promises.forEach((promise, index) => {
      Promise.resolve(promise).then(
        value => {
          results[index] = { status: 'fulfilled', value };
          count++;
          if (count === promises.length) resolve(results);
        },
        reason => {
          results[index] = { status: 'rejected', reason };
          count++;
          if (count === promises.length) resolve(results);
        }
      );
    });
  });
};

// Promise.any - 返回最先成功的结果
Promise.myAny = function(promises) {
  return new Promise((resolve, reject) => {
    const errors = [];
    let count = 0;

    if (promises.length === 0) {
      return reject(new AggregateError('All promises were rejected'));
    }

    promises.forEach((promise, index) => {
      Promise.resolve(promise).then(
        value => resolve(value),
        error => {
          errors[index] = error;
          count++;
          if (count === promises.length) {
            reject(new AggregateError(errors));
          }
        }
      );
    });
  });
};
```

---

## 四、作用域与闭包

### 4.1 闭包深度理解

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

// 解决方案 3：使用 bind
for (var i = 0; i < 5; i++) {
  setTimeout(console.log.bind(null, i), 100);
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

// 3. 防抖与节流（见下文）
```

---

### 4.2 作用域链理解

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

## 五、函数式编程

### 5.1 防抖（Debounce）实现

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

  const debounced = function(...args) {
    lastArgs = args;
    const context = this;

    if (timer) clearTimeout(timer);

    if (immediate) {
      const callNow = !timer;
      timer = setTimeout(() => {
        timer = null;
      }, delay);
      if (callNow) {
        result = fn.apply(context, args);
      }
    } else {
      timer = setTimeout(() => {
        result = fn.apply(context, args);
        timer = null;
      }, delay);
    }

    return result;
  };

  // 取消功能
  debounced.cancel = function() {
    if (timer) clearTimeout(timer);
    timer = null;
  };

  // 立即执行
  debounced.flush = function() {
    if (timer) {
      fn.apply(this, lastArgs);
      clearTimeout(timer);
      timer = null;
    }
  };

  return debounced;
}
```

---

### 5.2 节流（Throttle）实现

**参考答案：**

```javascript
// 时间戳版本
function throttle(fn, delay) {
  let lastTime = 0;

  return function(...args) {
    const now = Date.now();
    if (now - lastTime >= delay) {
      fn.apply(this, args);
      lastTime = now;
    }
  };
}

// 定时器版本
function throttle2(fn, delay) {
  let timer = null;

  return function(...args) {
    if (!timer) {
      timer = setTimeout(() => {
        fn.apply(this, args);
        timer = null;
      }, delay);
    }
  };
}

// 优化版本：支持 leading/trailing
function throttle3(fn, delay, options = { leading: true, trailing: false }) {
  let timer = null;
  let lastTime = 0;
  const { leading, trailing } = options;

  return function(...args) {
    const now = Date.now();
    const context = this;

    // 立即执行
    if (leading && lastTime === 0) {
      fn.apply(context, args);
      lastTime = now;
      return;
    }

    // 剩余时间
    const remaining = delay - (now - lastTime);

    if (remaining <= 0 || remaining > delay) {
      if (timer) {
        clearTimeout(timer);
        timer = null;
      }
      lastTime = now;
      fn.apply(context, args);
    } else if (trailing && !timer) {
      timer = setTimeout(() => {
        lastTime = Date.now();
        timer = null;
        fn.apply(context, args);
      }, remaining);
    }
  };
}
```

---

## 六、ES6+ 新特性

### 6.1 let / const / var 区别

**参考答案：**

| 特性 | var | let | const |
| :--- | :--- | :--- | :--- |
| **作用域** | 函数作用域 | 块级作用域 | 块级作用域 |
| **变量提升** | 初始化提升 | 暂时性死区 | 暂时性死区 |
| **重复声明** | 允许 | 不允许 | 不允许 |
| **重新赋值** | 允许 | 允许 | 不允许（对象引用可修改） |
| **全局属性** | 挂载到 window | 不挂载 | 不挂载 |

**暂时性死区（TDZ）**：

```javascript
{
  console.log(a);  // ReferenceError
  let a = 1;
}

// var 不会报错，打印 undefined
{
  console.log(b);  // undefined（变量提升）
  var b = 1;
}
```

---

### 6.2 箭头函数与普通函数区别

**参考答案：**

```javascript
// 箭头函数
const add = (a, b) => a + b;
const greet = name => `Hello, ${name}`;
const fn = () => ({ id: 1 });  // 返回对象需加括号

// 普通函数
function add(a, b) {
  return a + b;
}
```

**核心区别**：

| 特性 | 箭头函数 | 普通函数 |
| :--- | :--- | :--- |
| this | 继承外层第一个普通函数的 this | 运行时确定（谁调用指向谁） |
| arguments | 没有自己的 arguments | 有自己的 arguments |
| new | 不能作为构造函数 | 可以作为构造函数 |
| prototype | 没有 prototype | 有 prototype |
|  yield | 不能使用 yield | 可以使用 yield |

**this 绑定示例**：

```javascript
const obj = {
  name: 'obj',
  regular() {
    console.log(this.name);  // obj
  },
  arrow: () => {
    console.log(this.name);  // undefined（指向 window）
  }
};

const obj2 = {
  name: 'obj2',
  regular() {
    setTimeout(function() {
      console.log(this.name);  // undefined（指向 window）
    }, 100);
  },
  arrow() {
    setTimeout(() => {
      console.log(this.name);  // obj2
    }, 100);
  }
};
```

---

### 6.3 Symbol / BigInt / Proxy / Reflect

**参考答案：**

**Symbol**：

```javascript
// 创建唯一值
const s1 = Symbol('desc');
const s2 = Symbol('desc');
s1 === s2;  // false

// Symbol.for - 全局 Symbol 注册表
const s3 = Symbol.for('key');
const s4 = Symbol.for('key');
s3 === s4;  // true

// Symbol.iterator
const arr = [1, 2, 3];
const iterator = arr[Symbol.iterator]();
iterator.next();  // {value: 1, done: false}
```

**BigInt**：

```javascript
// 大整数
const bigInt = 9007199254740991n;
const result = bigInt + 1n;

// 安全整数范围
Number.MAX_SAFE_INTEGER;  // 9007199254740991
Number.MIN_SAFE_INTEGER; // -9007199254740991
```

**Proxy**：

```javascript
const handler = {
  get(target, prop) {
    console.log(`getting ${prop}`);
    return target[prop];
  },
  set(target, prop, value) {
    console.log(`setting ${prop} to ${value}`);
    target[prop] = value;
    return true;
  }
};

const proxy = new Proxy({}, handler);
proxy.name = 'Tom';  // setting name to Tom
console.log(proxy.name);  // getting name, Tom
```

**Reflect**：

```javascript
// 统一的对象操作 API
Reflect.get(obj, 'name');
Reflect.set(obj, 'name', 'Tom');
Reflect.has(obj, 'name');
Reflect.deleteProperty(obj, 'name');
Reflect.ownKeys(obj);
Reflect.apply(fn, thisArg, args);
```

---

### 6.4 数组方法详解

**参考答案：**

```javascript
// 遍历方法
arr.forEach((item, index, array) => {});     // 无返回值
arr.map((item, index, array) => item * 2);  // 返回新数组
arr.filter(item => item > 5);               // 返回满足条件的数组
arr.reduce((acc, cur, index, array) => acc + cur, 0);  // 返回累计结果
arr.some(item => item > 5);                  // 是否有满足条件
arr.every(item => item > 5);                // 是否全部满足条件
arr.find(item => item > 5);                  // 找到第一个
arr.findIndex(item => item > 5);             // 找到第一个索引
arr.flatMap(x => [x, x * 2]);                // map + flat

// ES10+
arr.flat(2);                 // 扁平化数组
arr.flatMap(x => [x, x * 2]); // map + flat

// 排序
arr.sort((a, b) => a - b);  // 升序

// 查找
arr.includes(5);             // 是否包含
arr.indexOf(5);              // 首次索引
arr.lastIndexOf(5);         // 最后一次索引

// 其他
arr.slice(1, 3);            // 浅拷贝
arr.splice(1, 2, 'a', 'b'); // 删除/替换/插入
arr.concat(arr2);           // 合并
arr.join(',');              // 转字符串
arr.reverse();              // 反转（修改原数组）
arr.fill(0, 1, 3);          // 填充
```

---

### 6.5 对象方法详解

**参考答案：**

```javascript
// Object.keys - 返回自身可枚举属性
Object.keys(obj);           // ['name', 'age']

// Object.values - 返回自身可枚举属性值
Object.values(obj);         // ['Tom', 18]

// Object.entries - 返回键值对数组
Object.entries(obj);        // [['name', 'Tom'], ['age', 18]]

// Object.fromEntries - 键值对数组转对象
Object.fromEntries([['name', 'Tom'], ['age', 18]]);

// Object.assign - 合并对象
Object.assign({}, obj1, obj2);

// Object.defineProperty - 定义属性
Object.defineProperty(obj, 'name', {
  value: 'Tom',
  writable: false,
  enumerable: true,
  configurable: false
});

// Object.defineProperties - 定义多个属性
Object.defineProperties(obj, {
  name: { value: 'Tom', writable: false },
  age: { value: 18, writable: true }
});

// Object.getOwnPropertyDescriptor - 获取属性描述
Object.getOwnPropertyDescriptor(obj, 'name');

// Object.getPrototypeOf / setPrototypeOf
Object.getPrototypeOf(obj);
Object.setPrototypeOf(obj, newPrototype);

// Object.create - 创建对象并指定原型
const newObj = Object.create(proto);

// Object.freeze / seal / preventExtensions
Object.freeze(obj);        // 不可修改/删除/添加
Object.seal(obj);         // 不可删除/添加（可修改）
Object.preventExtensions(obj);  // 不可添加

// Object.isFrozen / isSealed / isExtensible
Object.isFrozen(obj);
Object.isSealed(obj);
Object.isExtensible(obj);
```

---

## 七、手写代码题

### 7.1 深拷贝实现

**参考答案：**

```javascript
function deepClone(target, cache = new WeakMap()) {
  // 原始类型直接返回
  if (target === null || typeof target !== 'object') {
    return target;
  }

  // 处理日期
  if (target instanceof Date) {
    return new Date(target);
  }

  // 处理正则
  if (target instanceof RegExp) {
    return new RegExp(target);
  }

  // 处理 Symbol
  if (typeof target === 'symbol') {
    return Symbol(target.description);
  }

  // 处理循环引用
  if (cache.has(target)) {
    return cache.get(target);
  }

  // 创建新对象/数组
  const clone = Array.isArray(target) ? [] : {};
  cache.set(target, clone);

  // 获取所有属性（包括 Symbol）
  const keys = Reflect.ownKeys(target);

  keys.forEach(key => {
    // 跳过不可枚举属性（可选）
    const descriptor = Object.getOwnPropertyDescriptor(target, key);
    if (!descriptor.enumerable) return;

    // 递归克隆
    clone[key] = deepClone(target[key], cache);
  });

  return clone;
}

// 测试
const obj = {
  name: 'Tom',
  date: new Date(),
  regex: /test/,
  nested: {
    a: 1,
    b: [1, 2, 3]
  },
  [Symbol('id')]: 123
};

// 处理循环引用
obj.self = obj;

const cloned = deepClone(obj);
console.log(cloned);
```

---

### 7.2 instanceof 实现

**参考答案：**

```javascript
function myInstanceof(left, right) {
  // 获取构造函数的 prototype
  const prototype = right.prototype;

  // 获取对象的原型
  let proto = left.__proto__;

  // 循环遍历原型链
  while (proto !== null) {
    if (proto === prototype) {
      return true;
    }
    proto = proto.__proto__;
  }

  return false;
}

// 测试
function Person() {}
const person = new Person();

myInstanceof(person, Person);       // true
myInstanceof(person, Object);       // true
myInstanceof('str', String);        // false
```

---

### 7.3 call / apply / bind 实现

**参考答案：**

```javascript
// call 实现
Function.prototype.myCall = function(context, ...args) {
  // context 不存在时指向 window
  const ctx = context || window;

  // 创建一个唯一的属性名
  const fn = Symbol('fn');

  // 将函数挂载到 context 上
  ctx[fn] = this;

  // 执行函数并获取结果
  const result = ctx[fn](...args);

  // 删除临时属性
  delete ctx[fn];

  return result;
};

// apply 实现
Function.prototype.myApply = function(context, args = []) {
  const ctx = context || window;
  const fn = Symbol('fn');
  ctx[fn] = this;
  const result = args.length > 0 ? ctx[fn](...args) : ctx[fn]();
  delete ctx[fn];
  return result;
};

// bind 实现
Function.prototype.myBind = function(context, ...args) {
  const fn = this;

  return function(...args2) {
    // 构造函数调用时忽略 context
    if (this instanceof fn) {
      return new fn(...args, ...args2);
    }
    return fn.apply(context, [...args, ...args2]);
  };
};
```

---

### 7.4 Promise 实现红绿灯交换

**参考答案：**

```javascript
// 题目：红灯 3 秒亮一次，黄灯 2 秒亮一次，绿灯 1 秒亮一次
// 输出: 红 -> 黄 -> 绿 -> 红 -> 黄 -> 绿...

function red() { console.log('red'); }
function yellow() { console.log('yellow'); }
function green() { console.log('green'); }

function light(fn, ms) {
  return new Promise(resolve => {
    setTimeout(() => {
      fn();
      resolve();
    }, ms);
  });
}

async function run() {
  while (true) {
    await light(red, 3000);
    await light(yellow, 2000);
    await light(green, 1000);
  }
}

// 使用 Promise 链式
function runChain() {
  light(red, 3000)
    .then(() => light(yellow, 2000))
    .then(() => light(green, 1000))
    .then(() => runChain());
}
```

---

### 7.5 并行限制调度器

**参考答案：**

```javascript
class LimitScheduler {
  constructor(limit) {
    this.limit = limit;
    this.running = 0;
    this.queue = [];
  }

  async add(task) {
    if (this.running >= this.limit) {
      await new Promise(resolve => this.queue.push(resolve));
    }

    this.running++;
    try {
      return await task();
    } finally {
      this.running--;
      if (this.queue.length > 0) {
        this.queue.shift()();
      }
    }
  }
}

// 使用
const scheduler = new LimitScheduler(2);

const tasks = [
  () => new Promise(r => setTimeout(() => r(1), 3000)),
  () => new Promise(r => setTimeout(() => r(2), 2000)),
  () => new Promise(r => setTimeout(() => r(3), 1000)),
  () => new Promise(r => setTimeout(() => r(4), 4000)),
];

async function main() {
  const start = Date.now();
  const results = await Promise.all(tasks.map(t => scheduler.add(t)));
  console.log(results, Date.now() - start);
}
```

---

## 八、内存管理与垃圾回收

### 8.1 V8 垃圾回收机制

**参考答案：**

```
┌─────────────────────────────────────────────────────────────────┐
│                      V8 内存分布                                │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                    新生代区 (New Space)                  │   │
│  │    ┌────────────────┐      ┌────────────────┐           │   │
│  │    │    From        │      │     To         │           │   │
│  │    │  (使用中)       │ <─── │  (空闲)        │           │   │
│  │    └────────────────┘      └────────────────┘           │   │
│  │         32MB / 64MB (32位 / 64位)                       │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                  │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                    老生代区 (Old Space)                  │   │
│  │    ┌────────────────┐      ┌────────────────┐           │   │
│  │    │   对象数据     │      │   指针数据     │           │   │
│  │    │  (Data Pointer)│      │ (Data Pointer)│           │   │
│  │    └────────────────┘      └────────────────┘           │   │
│  │              ~1400MB                                        │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                  │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                    大对象区 (Large Object Space)        │   │
│  │              大对象存储 (>10MB)                          │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                  │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                    代码区 (Code Space)                   │   │
│  │              JIT 编译后的代码                             │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                  │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                    Cell / Map / Promise 等              │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

**垃圾回收算法**：

| 算法 | 区域 | 说明 |
| :--- | :--- | :--- |
| **Scavenge** | 新生代 | 复制存活对象，清理死亡对象 |
| **Mark-Sweep** | 老生代 | 标记清除，碎片化 |
| **Mark-Compact** | 老生代 | 标记整理，解决碎片化 |
| **Incremental Marking** | 老生代 | 分阶段标记，避免卡顿 |
| **Orinoco** | 全部 | 并发/并行回收 |

---

### 8.2 内存泄漏与解决方案

**参考答案：**

**常见内存泄漏场景**：

```javascript
// 1. 全局变量
function leak() {
  largeData = new Array(1000000);  // 忘记声明，挂在 window
}

// 2. 闭包
function leak2() {
  const largeData = new Array(1000000);
  return function() {
    console.log(largeData);  // 闭包引用 largeData
  };
}

// 3. DOM 引用
const elements = [];
function leak3() {
  const div = document.createElement('div');
  elements.push(div);  // 引用 DOM，即使 DOM 删除
}

// 4. 定时器未清理
function leak4() {
  setInterval(() => {
    // 定时器持续执行
  }, 1000);
}

// 5. 事件监听未移除
function leak5() {
  const el = document.getElementById('el');
  el.addEventListener('click', () => {});  // 组件销毁时未移除
}
```

**检测方法**：

```javascript
// 使用 Chrome DevTools Memory
// 1. Performance Monitor - 监控内存使用
// 2. Memory - 快照对比
// 3. Allocation Timeline - 分配时间线

// 代码检测
function detectMemoryLeak() {
  if (performance.memory) {
    console.log('JS Heap Size:', performance.memory.jsHeapSizeLimit);
    console.log('Total:', performance.memory.totalJSHeapSize);
    console.log('Used:', performance.memory.usedJSHeapSize);
  }
}
```

---

> 资料整理自 2025 字节跳动、阿里巴巴、拼多多面试

---

## 九、数据类型与类型转换

### 9.1 JavaScript 数据类型详解

**参考答案：**

JavaScript 共有 8 种数据类型，分为原始类型（Primitive）和引用类型（Reference）两大类：

```javascript
// 原始类型（Primitive Types）- 7 种
typeof undefined        // "undefined"
typeof null             // "object" (历史遗留 bug)
typeof 42               // "number"
typeof "hello"          // "string"
typeof true             // "boolean"
typeof Symbol('id')     // "symbol"
typeof 9007199254740991n  // "bigint"

// 引用类型（Reference Types）- 1 种
typeof {}               // "object"
typeof []               // "object"
typeof function() {}    // "function" (特殊对象)
typeof new Date()       // "object"
typeof new Map()        // "object"
typeof new Set()        // "object"
```

**原始类型与引用类型的本质区别**：

```javascript
// 原始类型 - 值传递
let a = 10;
let b = a;
b = 20;
console.log(a);  // 10 - a 不受影响

// 引用类型 - 引用传递
let obj1 = { name: 'Tom' };
let obj2 = obj1;
obj2.name = 'Jerry';
console.log(obj1.name);  // "Jerry" - obj1 也被修改
```

**栈内存与堆内存**：

```
┌─────────────────────────────────────────────────────────────────┐
│                      JavaScript 内存模型                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  栈内存 (Stack)                  堆内存 (Heap)                   │
│  ┌─────────────────┐          ┌─────────────────────────┐      │
│  │                 │          │                         │      │
│  │  a: 10          │          │  { name: 'Tom' }        │      │
│  │  b: 20          │  ──────► │  (0x001)               │      │
│  │  str: 'hello'   │          │                         │      │
│  │  flag: true     │          │  [1, 2, 3]             │      │
│  │                 │          │  (0x002)               │      │
│  │                 │          │                         │      │
│  └─────────────────┘          └─────────────────────────┘      │
│                                                                  │
│  - 原始类型存储在栈中           - 引用类型存储在堆中             │
│  - 大小固定，访问速度快         - 大小不固定，访问需要引用       │
│  - 自动分配和释放               - 需要垃圾回收器管理             │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### 9.2 类型转换深度理解

**参考答案：**

**显式类型转换**：

```javascript
// 转换为数字
Number('123')        // 123
Number('12.3')       // 12.3
Number('')           // 0
Number('hello')      // NaN
Number(true)         // 1
Number(false)        // 0

parseInt('123')      // 123
parseInt('12.3')     // 12
parseInt('100px')    // 100
parseFloat('12.3')   // 12.3

// 转换为字符串
String(123)          // '123'
String(true)         // 'true'
String(null)         // 'null'
String(undefined)    // 'undefined'

(123).toString()     // '123'
(true).toString()    // 'true'

// 转换为布尔值
Boolean(1)           // true
Boolean(0)           // false
Boolean('hello')     // true
Boolean('')          // false
Boolean(null)        // false
Boolean(undefined)   // false
Boolean(NaN)         // false
Boolean([])          // true (特殊!)
Boolean({})          // true (特殊!)
```

**隐式类型转换**：

```javascript
// 算术运算符
'1' + 2              // '12' (数字转字符串)
1 + '2'              // '12'
1 + 2                // 3
1 - '2'              // -1 (字符串转数字)
'5' * '2'            // 10
'5' - 2              // 3

// 比较运算符
'5' == 5             // true (隐式转换)
'5' === 5            // false (严格比较)
null == undefined    // true
null === undefined   // false

// 逻辑运算符
!!'hello'            // true
!!''                 // false
!!0                  // false

// 宽松相等 == 转换规则
// ┌─────────────────┬──────────────────┬──────────────────┐
// │    x            │    y             │    结果          │
// ├─────────────────┼──────────────────┼──────────────────┤
// │ null           │ undefined        │ true            │
// │ number         │ string           │ x == toNumber(y)│
// │ boolean        │ any              │ toNumber(x)==y  │
// │ object         │ string/number    │ toPrimitive(y)  │
// └─────────────────┴──────────────────┴──────────────────┘
```

**类型转换原理详解**：

```javascript
// ToPrimitive 操作详解
// input 是对象时，会调用 valueOf 或 toString

// 1. 先尝试 valueOf
const obj1 = {
  valueOf() { return 1; }
};
console.log(obj1 + 1);  // 2

// 2. 如果 valueOf 不返回原始值，尝试 toString
const obj2 = {
  toString() { return 'hello'; }
};
console.log(obj2 + ' world');  // 'hello world'

// 3. 两者都返回对象，抛出 TypeError
const obj3 = {
  valueOf() { return {}; },
  toString() { return {}; }
};
// console.log(obj3 + 1);  // TypeError

// 数组的 ToPrimitive
[1, 2] + [3, 4]    // '1,23,4'
// 步骤1: [1,2].valueOf() 返回 [1,2]
// 步骤2: [1,2].toString() 返回 '1,2'
// 同理 [3,4] -> '3,4'
// 结果: '1,2' + '3,4' = '1,23,4'
```

### 9.3 类型判断详解

**参考答案：**

```javascript
// typeof 的局限性
typeof null          // 'object' (历史 bug)
typeof []            // 'object'
typeof {}            // 'object'
typeof new Date()    // 'object'
typeof /regex/       // 'object'

// instanceof 原理
// 检查构造函数的 prototype 是否在对象的原型链上
function Person() {}
const person = new Person();

person instanceof Person      // true
person instanceof Object      // true
[] instanceof Array           // true
[] instanceof Object          // true

// Object.prototype.toString.call()
Object.prototype.toString.call(123)      // '[object Number]'
Object.prototype.toString.call('str')   // '[object String]'
Object.prototype.toString.call(true)    // '[object Boolean]'
Object.prototype.toString.call([])      // '[object Array]'
Object.prototype.toString.call({})      // '[object Object]'
Object.prototype.toString.call(null)    // '[object Null]'
Object.prototype.toString.call(undefined) // '[object Undefined]'

// 封装类型判断函数
function getType(value) {
  if (value === null) return 'null';
  if (value === undefined) return 'undefined';

  const typeStr = Object.prototype.toString.call(value);
  const match = typeStr.match(/\[object (\w+)\]/);
  return match ? match[1].toLowerCase() : 'unknown';
}

// isArray 判断
Array.isArray([])           // true
Array.isArray({})           // false

// isNaN 判断
isNaN(NaN)                  // true
isNaN(10)                   // false
isNaN('hello')              // true (隐式转换)
Number.isNaN(NaN)           // true
Number.isNaN('hello')       // false (不转换)

// isFinite 判断
isFinite(Infinity)         // false
isFinite(-Infinity)         // false
isFinite(100)               // true
isFinite('100')             // true (转换后)
Number.isFinite(100)        // true
Number.isFinite('100')      // false (不转换)
```

---

## 十、函数深入理解

### 10.1 函数创建与调用方式

**参考答案：**

```javascript
// 1. 函数声明（函数提升）
function add(a, b) {
  return a + b;
}

// 2. 函数表达式
const add = function(a, b) {
  return a + b;
};

// 3. 箭头函数
const add = (a, b) => a + b;

// 4. 构造函数（不推荐）
const add = new Function('a', 'b', 'return a + b');

// 5. IIFE（立即执行函数）
(function() {
  console.log('立即执行');
})();

(() => {
  console.log('箭头函数 IIFE');
})();

// 6. 生成器函数
function* generator() {
  yield 1;
  yield 2;
  return 3;
}
const gen = generator();
gen.next();  // {value: 1, done: false}
gen.next();  // {value: 2, done: false}
gen.next();  // {value: 3, done: true}

// 7. 异步函数
async function fetchData() {
  const data = await fetch('/api');
  return data;
}
```

### 10.2 函数参数传递

**参考答案：**

```javascript
// 原始类型参数 - 值传递
function changeValue(num) {
  num = 100;
}
let a = 10;
changeValue(a);
console.log(a);  // 10 - 不受影响

// 引用类型参数 - 引用传递
function changeObject(obj) {
  obj.name = 'Jerry';
  obj = new Object();  // 重新赋值，不影响原引用
  obj.name = 'New';
}
let person = { name: 'Tom' };
changeObject(person);
console.log(person.name);  // 'Jerry'

// 参数默认值
function greet(name = 'Guest', greeting = 'Hello') {
  return `${greeting}, ${name}!`;
}
greet();                    // 'Hello, Guest!'
greet('Tom');               // 'Hello, Tom!'
greet('Tom', 'Hi');        // 'Hi, Tom!'

// 剩余参数
function sum(...numbers) {
  return numbers.reduce((a, b) => a + b, 0);
}
sum(1, 2, 3, 4);  // 10

// arguments 对象
function showArgs() {
  console.log(arguments);         // [1, 2, 3]
  console.log(arguments.length); // 3
  console.log(arguments[0]);      // 1
}
showArgs(1, 2, 3);

// 注意：箭头函数没有 arguments
const fn = () => {
  console.log(arguments);  // ReferenceError
};
```

### 10.3 函数科里化与偏函数

**参考答案：**

```javascript
// 柯里化 (Currying)
// 将多参数函数转换为一系列单参数函数

// 基础实现
function curry(fn) {
  return function curried(...args) {
    // 如果参数足够，执行原函数
    if (args.length >= fn.length) {
      return fn.apply(this, args);
    }
    // 否则返回一个新函数，等待接收剩余参数
    return function(...args2) {
      return curried.apply(this, args.concat(args2));
    };
  };
}

// 使用
function add(a, b, c) {
  return a + b + c;
}
const curriedAdd = curry(add);
curriedAdd(1)(2)(3);    // 6
curriedAdd(1, 2)(3);    // 6
curriedAdd(1)(2, 3);    // 6

// 偏函数 (Partial Application)
// 固定函数的部分参数

function partial(fn, ...presetArgs) {
  return function(...laterArgs) {
    return fn(...presetArgs, ...laterArgs);
  };
}

// 使用
function multiply(a, b, c) {
  return a * b * c;
}
const multiplyBy2 = partial(multiply, 2);
multiplyBy2(3, 4);  // 24

// 柯里化经典面试题
// 实现 add(1)(2)(3) = 6
function add(...args) {
  return function(...args2) {
    const total = [...args, ...args2].reduce((a, b) => a + b, 0);
    // 递归返回函数直到没有参数
    return function(...args3) {
      if (args3.length === 0) {
        return total;
      }
      return add(total)(...args3);
    };
  };
}
// 简化版本
function add(...args1) {
  const fn = function(...args2) {
    return add(...args1, ...args2);
  };
  fn.toString = function() {
    return args1.reduce((a, b) => a + b, 0);
  };
  return fn;
}
console.log(add(1)(2)(3).toString());  // 6
console.log(add(1, 2)(3).toString()); // 6
```

### 10.4 高阶函数详解

**参考答案：**

```javascript
// 高阶函数：接收函数作为参数或返回函数的函数

// 1. 函数组合
function compose(...fns) {
  return function(x) {
    return fns.reduceRight((acc, fn) => fn(acc), x);
  };
}

// 使用
const add1 = x => x + 1;
const multiply2 = x => x * 2;
const square = x => x * x;

const composed = compose(square, multiply2, add1);
composed(3);  // square(multiply2(add1(3))) = square(8) = 64

// 2. 函数管道
function pipe(...fns) {
  return function(x) {
    return fns.reduce((acc, fn) => fn(acc), x);
  };
}

// 3. 柯里化工具
const curry = (fn, arity = fn.length) => {
  return function curried(...args) {
    if (args.length >= arity) {
      return fn.apply(this, args);
    }
    return function(...args2) {
      return curried.apply(this, args.concat(args2));
    };
  };
};

// 4. 函数记忆 (Memoization)
function memoize(fn) {
  const cache = new Map();
  return function(...args) {
    const key = JSON.stringify(args);
    if (cache.has(key)) {
      return cache.get(key);
    }
    const result = fn.apply(this, args);
    cache.set(key, result);
    return result;
  };
}

// 使用
const fibonacci = memoize(function(n) {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
});

// 5. 函数节流与防抖 (已在前面章节详述)

// 6. once - 只执行一次
function once(fn) {
  let called = false;
  let result;
  return function(...args) {
    if (!called) {
      called = true;
      result = fn.apply(this, args);
    }
    return result;
  };
}

// 7. after - 延迟执行
function after(times, fn) {
  return function(...args) {
    if (--times === 0) {
      fn.apply(this, args);
    }
  };
}

// 8. before - 限制执行次数
function before(times, fn) {
  let result;
  return function(...args) {
    if (times-- > 0) {
      result = fn.apply(this, args);
    }
    return result;
  };
}
```

---

## 十一、异步编程深度理解

### 11.1 异步编程发展历程

**参考答案：**

```javascript
// 1. 回调函数 (Callback)
function fetchData(callback) {
  setTimeout(() => {
    callback(null, 'data');
  }, 1000);
}
fetchData((err, data) => {
  if (err) {
    console.error(err);
  } else {
    console.log(data);
  }
});

// 回调地狱示例
fetchData((err, data) => {
  if (err) return;
  processData(data, (err, result) => {
    if (err) return;
    saveResult(result, (err, saved) => {
      if (err) return;
      console.log(saved);
    });
  });
});

// 2. Promise
function fetchData() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve('data');
    }, 1000);
  });
}
fetchData()
  .then(data => processData(data))
  .then(result => saveResult(result))
  .catch(err => console.error(err));

// 3. async/await
async function main() {
  try {
    const data = await fetchData();
    const result = await processData(data);
    const saved = await saveResult(result);
    console.log(saved);
  } catch (err) {
    console.error(err);
  }
}

// 4. 生成器函数
function* generatorDemo() {
  const data = yield fetchData();
  const result = yield processData(data);
  return result;
}
const gen = generatorDemo();
gen.next().value.then(data => {
  gen.next(data).value.then(result => {
    console.log(result);
  });
});

// 5. async 迭代器 (for await...of)
async function demo() {
  const asyncIterable = {
    [Symbol.asyncIterator]() {
      return {
        i: 0,
        next() {
          return Promise.resolve({
            value: this.i++,
            done: this.i > 5
          });
        }
      };
    }
  };
  for await (const num of asyncIterable) {
    console.log(num);
  }
}
```

### 11.2 Promise 高级特性

**参考答案：**

```javascript
// Promise 状态流转
// ┌─────────────────────────────────────────────────────────────┐
// │                                                             │
// │  ┌──────────┐    resolve(value)    ┌──────────────┐        │
// │  │          │ ──────────────────►  │              │        │
// │  │  pending │                      │  fulfilled   │        │
// │  │          │ ◄──────────────────  │              │        │
// │  │          │    reject(reason)    │              │        │
// │  └──────────┘                      └──────────────┘        │
// │      │                                   │                 │
// │      │                                   │                 │
// │      │ reject(reason)                   │                 │
// │      ▼                                   ▼                 │
// │  ┌──────────┐                      ┌──────────────┐        │
// │  │          │ ──────────────────►  │              │        │
// │  │  pending │                      │   rejected   │        │
// │  │          │ ◄──────────────────  │              │        │
// │  │          │    resolve(value)    │              │        │
// │  └──────────┘                      └──────────────┘        │
// │                                                             │
// │  状态只能从 pending → fulfilled/rejected                   │
// │  一旦状态改变，不可逆转                                     │
// └─────────────────────────────────────────────────────────────┘

// Promise then 方法链式调用
const promise = new Promise(resolve => resolve(1));

promise
  .then(x => x + 1)     // 2
  .then(x => x * 2)     // 4
  .then(x => {
    throw new Error('error');
  })
  .catch(err => {
    console.error(err); // Error: error
    return 'recovered';
  })
  .then(x => console.log(x));  // 'recovered'

// Promise 静态方法详解
Promise.resolve(1);  // Promise {1}
Promise.reject(new Error('error'));  // Promise rejected

// Promise.resolve 对不同值的处理
Promise.resolve(1);                    // 已经是 Promise，直接返回
Promise.resolve(Promise.resolve(1));  // 层层解包
Promise.resolve({ then: fn });        // 提取 thenable

// thenable 示例
const thenable = {
  then(resolve) {
    resolve(42);
  }
};
Promise.resolve(thenable).then(console.log);  // 42

// Promise.all - 并行执行，全部成功才成功
const p1 = Promise.resolve(1);
const p2 = Promise.resolve(2);
const p3 = Promise.resolve(3);

Promise.all([p1, p2, p3])
  .then(console.log);  // [1, 2, 3]

// 任意一个失败则失败
Promise.all([
  Promise.resolve(1),
  Promise.reject('error'),
  Promise.resolve(3)
]).catch(console.error);  // 'error'

// Promise.race - 竞态，谁先完成返回谁
Promise.race([
  new Promise(r => setTimeout(() => r(1), 100)),
  new Promise(r => setTimeout(() => r(2), 50)),
  new Promise(r => setTimeout(() => r(3), 200))
]).then(console.log);  // 2

// 应用：超时处理
function withTimeout(promise, ms) {
  const timeout = new Promise((_, reject) =>
    setTimeout(() => reject(new Error('Timeout')), ms)
  );
  return Promise.race([promise, timeout]);
}

// Promise.allSettled - 无论成功失败都返回
Promise.allSettled([
  Promise.resolve(1),
  Promise.reject('error'),
  Promise.resolve(3)
]).then(results => {
  results.forEach(result => {
    if (result.status === 'fulfilled') {
      console.log(result.value);
    } else {
      console.error(result.reason);
    }
  });
});

// Promise.any - 返回第一个成功的结果
Promise.any([
  Promise.reject('error1'),
  Promise.reject('error2'),
  Promise.resolve(3)
]).then(console.log);  // 3

// 全部失败才失败
Promise.any([
  Promise.reject('error1'),
  Promise.reject('error2')
]).catch(e => {
  console.error(e.errors);  // ['error1', 'error2']
});
```

### 11.3 async/await 深入理解

**参考答案：**

```javascript
// async/await 是 Promise 的语法糖
// async 函数总是返回 Promise
// await 等待 Promise resolve

// async 函数返回值
async function fn1() { return 1; }
fn1().then(console.log);  // 1

async function fn2() { return Promise.resolve(2); }
fn2().then(console.log);  // 2

async function fn3() { throw new Error('error'); }
fn3().catch(console.error);  // Error: error

// await 等待 Promise
async function demo() {
  const result = await Promise.resolve(1);
  console.log(result);  // 1

  // await 等待出错会抛出异常
  try {
    await Promise.reject('error');
  } catch (e) {
    console.error(e);  // 'error'
  }
}

// 并行执行
async function parallel() {
  const [a, b] = await Promise.all([
    Promise.resolve(1),
    Promise.resolve(2)
  ]);
  console.log(a, b);  // 1, 2
}

// 串行执行
async function serial() {
  const a = await Promise.resolve(1);
  const b = await Promise.resolve(2);
  console.log(a, b);  // 1, 2
}

// 错误处理
async function withErrorHandling() {
  try {
    const data = await fetch('/api');
    const result = await data.json();
    return result;
  } catch (err) {
    console.error('请求失败:', err);
    return null;
  }
}

// Promise.all 与 async/await 结合
async function fetchAll(urls) {
  const promises = urls.map(url => fetch(url));
  const responses = await Promise.all(promises);
  return Promise.all(responses.map(r => r.json()));
}

// 循环中的 async/await
async function processItems(items) {
  // 串行处理
  for (const item of items) {
    await processItem(item);
  }

  // 并行处理（需要并发控制）
  const results = await Promise.all(items.map(item => processItem(item)));
}

// 延迟函数
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// async/await 实现重试
async function retry(fn, times = 3) {
  for (let i = 0; i < times; i++) {
    try {
      return await fn();
    } catch (err) {
      if (i === times - 1) throw err;
      await delay(1000 * (i + 1));  // 指数退避
    }
  }
}

// 使用
async function fetchData() {
  const data = await retry(() => fetch('/api').then(r => r.json()));
  return data;
}
```

### 11.4 事件循环面试题汇总

**参考答案：**

```javascript
// 面试题 1
console.log('1');
setTimeout(() => console.log('2'), 0);
Promise.resolve().then(() => console.log('3'));
console.log('4');
// 输出: 1, 4, 3, 2

// 面试题 2
console.log('1');
setTimeout(() => console.log('2'), 0);
new Promise((resolve) => {
  console.log('3');
  resolve();
}).then(() => console.log('4'));
console.log('5');
// 输出: 1, 3, 5, 4, 2

// 面试题 3
setTimeout(() => console.log('1'), 0);
new Promise((resolve) => {
  console.log('2');
  resolve();
}).then(() => console.log('3'));
console.log('4');
// 输出: 2, 4, 3, 1

// 面试题 4 - async/await
async function async1() {
  console.log('1');
  await async2();
  console.log('2');
}
async function async2() {
  console.log('3');
}
console.log('4');
setTimeout(() => console.log('5'), 0);
async1();
new Promise(resolve => {
  console.log('6');
  resolve();
}).then(() => console.log('7'));
console.log('8');
// 输出: 4, 3, 6, 8, 2, 7, 5

// 面试题 5 - 微任务队列
Promise.resolve().then(() => {
  console.log('1');
  return Promise.resolve();
}).then(() => {
  console.log('2');
});
Promise.resolve().then(() => {
  console.log('3');
}).then(() => {
  console.log('4');
});
// 输出: 1, 3, 2, 4

// 面试题 6 - Promise then 返回 Promise
new Promise(resolve => resolve())
  .then(() => console.log('1'))
  .then(() => console.log('2'))
  .then(() => console.log('3'));

new Promise(resolve => resolve())
  .then(() => console.log('4'))
  .then(() => console.log('5'));
// 输出: 1, 4, 2, 5, 3

// 面试题 7 - async 函数返回值
async function A() {
  console.log('1');
  return 'hello';
}
async function B() {
  console.log('2');
  return Promise.resolve('world');
}
async function main() {
  console.log('3');
  const a = await A();
  console.log(a);
  const b = await B();
  console.log(b);
}
main();
// 输出: 3, 1, hello, 2, world

// 面试题 8 - setTimeout vs setImmediate (Node.js)
setTimeout(() => console.log('timeout'), 0);
setImmediate(() => console.log('immediate'));
// 输出顺序不确定，取决于性能

// 面试题 9 - process.nextTick vs setImmediate (Node.js)
process.nextTick(() => console.log('nextTick'));
setImmediate(() => console.log('immediate'));
console.log('sync');
// 输出: sync, nextTick, immediate

// 面试题 10 - queueMicrotask
Promise.resolve().then(() => console.log('promise'));
queueMicrotask(() => console.log('microtask'));
console.log('sync');
// 输出: sync, promise, microtask
```

---

## 十二、ES6+ 核心特性详解

### 12.1 解构赋值深度理解

**参考答案：**

```javascript
// 数组解构
const [a, b, c] = [1, 2, 3];
console.log(a, b, c);  // 1, 2, 3

// 跳过元素
const [a, , c] = [1, 2, 3];
console.log(a, c);  // 1, 3

// 剩余模式
const [a, ...rest] = [1, 2, 3, 4, 5];
console.log(a, rest);  // 1, [2, 3, 4, 5]

// 默认值
const [a, b = 10] = [1];
console.log(a, b);  // 1, 10

// 交换变量
let x = 1, y = 2;
[x, y] = [y, x];
console.log(x, y);  // 2, 1

// 嵌套解构
const [a, [b, c]] = [1, [2, 3]];
console.log(a, b, c);  // 1, 2, 3

// 对象解构
const { name, age } = { name: 'Tom', age: 18 };
console.log(name, age);  // Tom, 18

// 变量重命名
const { name: userName, age: userAge } = { name: 'Tom', age: 18 };
console.log(userName, userAge);  // Tom, 18

// 默认值
const { name = 'Guest', age = 0 } = { name: 'Tom' };
console.log(name, age);  // Tom, 0

// 嵌套解构
const {
  user: { name, age },
  admin: { name: adminName }
} = { user: { name: 'Tom', age: 18 }, admin: { name: 'Admin' } };

// 函数参数解构
function fn({ x, y = 10, z = 0 }) {
  return x + y + z;
}
fn({ x: 1 });           // 11
fn({ x: 1, y: 2 });    // 3

// 解构赋值妙用
// 1. 交换变量
[a, b] = [b, a];

// 2. 从函数返回多个值
function getUser() {
  return { name: 'Tom', age: 18 };
}
const { name, age } = getUser();

// 3. 遍历 Map
const map = new Map([['a', 1], ['b', 2]]);
for (const [key, value] of map) {
  console.log(key, value);
}

// 4. 导入模块
import { Component, useState } from 'react';
```

### 12.2 模板字符串与标签模板

**参考答案：**

```javascript
// 基本用法
const name = 'Tom';
const greeting = `Hello, ${name}!`;
console.log(greeting);  // Hello, Tom!

// 多行字符串
const multiLine = `
  This is a
  multi-line
  string
`;

// 表达式
const a = 10, b = 20;
console.log(`a + b = ${a + b}`);  // a + b = 30

// 调用函数
function highlight(strings, ...values) {
  return strings.reduce((result, str, i) => {
    return result + str + (values[i] ? `<em>${values[i]}</em>` : '');
  }, '');
}
const name = 'Tom', score = 100;
const html = highlight`Hello ${name}, your score is ${score}!`;
console.log(html);
// Hello <em>Tom</em>, your score is <em>100</em>!

// 标签模板实际应用 - i18n
function i18n(strings, ...values) {
  const translations = {
    hello: '你好',
    world: '世界'
  };
  return strings.reduce((result, str, i) => {
    return result + translations[str.trim()] + (values[i] || '');
  }, '');
}
const greeting = i18n` hello  world `;
console.log(greeting);  // 你好 世界

// 标签模板 - SQL 防注入
function sql(strings, ...values) {
  let query = '';
  strings.forEach((str, i) => {
    query += str;
    if (i < values.length) {
      // 参数化查询，防止 SQL 注入
      query += `$${i + 1}`;
    }
  });
  return { query, values };
}
const userId = 1;
const { query, values } = sql`SELECT * FROM users WHERE id = ${userId}`;
console.log(query);    // SELECT * FROM users WHERE id = $1
console.log(values);   // [1]
```

### 12.3 装饰器详解

**参考答案：**

```javascript
// 装饰器是一种语法糖，用于修改类或类的属性

// 1. 类的装饰器
function logged(constructor) {
  return class extends constructor {
    constructor(...args) {
      console.log(`Creating ${constructor.name}`);
      super(...args);
    }
  };
}

@logged
class Person {
  constructor(name) {
    this.name = name;
  }
}

// 2. 方法装饰器
function enumerable(value) {
  return function(target, propertyKey, descriptor) {
    descriptor.enumerable = value;
  };
}

class Calculator {
  @enumerable(false)
  add(a, b) {
    return a + b;
  }

  @enumerable(true)
  multiply(a, b) {
    return a * b;
  }
}

// 3. 属性装饰器
function readonly(target, propertyKey, descriptor) {
  descriptor.writable = false;
  return descriptor;
}

class User {
  @readonly
  name = 'Tom';
}

// 4. 参数装饰器
function loggedParam(target, propertyKey, parameterIndex) {
  console.log(`Parameter ${parameterIndex} of ${propertyKey}`);
}

class Service {
  method(@loggedParam param1, @loggedParam param2) {
    return param1 + param2;
  }
}

// 5. 装饰器工厂
function color(value) {
  return function(target, propertyKey, descriptor) {
    descriptor.value = function(...args) {
      console.log(`Color: ${value}`);
      return descriptor.value.apply(this, args);
    };
    return descriptor;
  };
}

class Shape {
  @color('red')
  draw() {
    console.log('Drawing shape');
  }
}

// 6. 装饰器组合
function first() {
  console.log('first(): evaluated');
  return function(target, propertyKey, descriptor) {
    console.log('first(): called');
  };
}

function second() {
  console.log('second(): evaluated');
  return function(target, propertyKey, descriptor) {
    console.log('second(): called');
  };
}

class Example {
  @first()
  @second()
  method() {}
}
// 输出:
// first(): evaluated
// second(): evaluated
// second(): called
// first(): called
```

### 12.4 模块化详解

**参考答案：**

```javascript
// 1. ES6 模块 (export/import)
// 命名导出
export const name = 'Tom';
export function greet() { return 'Hello'; }
export class User { }

// 默认导出
export default function() { return 'default'; }

// 导入
import defaultExport from './module.js';
import { name, greet } from './module.js';
import * as module from './module.js';

// 2. CommonJS (Node.js)
module.exports = { name: 'Tom' };
const { name } = require('./module.js');

// 3. 动态导入
async function loadModule() {
  const module = await import('./module.js');
  module.default();
}

// 4. 模块循环引用
// a.js
import { b } from './b.js';
export const a = 'a';
export function getB() {
  return b;
}

// b.js
import { a } from './a.js';
export const b = 'b';
export function getA() {
  return a;
}

// 注意：循环引用时，导出变量的初始值为 undefined

// 5. 模块单例模式
// 每个 ES 模块都是单例，导入多次得到相同引用

// 6. 模块静态分析
// 模块在解析阶段确定导入导出，无法动态导入

// 7. import() 动态导入 - 代码分割
async function loadFeature(flag) {
  if (flag) {
    const { featureA } = await import('./featureA.js');
    featureA();
  } else {
    const { featureB } = await import('./featureB.js');
    featureB();
  }
}
```

### 12.5 Set / Map / WeakSet / WeakMap

**参考答案：**

```javascript
// Set - 值的集合
const set = new Set([1, 2, 3, 2, 1]);
console.log(set.size);  // 3 (去重)
set.add(4);
set.has(1);     // true
set.delete(1);
set.clear();

// 遍历
for (const item of set) {
  console.log(item);
}
set.forEach(item => console.log(item));

// 数组去重
const arr = [1, 2, 2, 3, 3, 3];
const unique = [...new Set(arr)];  // [1, 2, 3]

// Set 实践应用
// 1. 字符串去重
const str = 'hello';
const uniqueStr = [...new Set(str)].join('');  // 'helo'

// 2. 数组交集
const a = [1, 2, 3];
const b = [2, 3, 4];
const intersection = [...new Set(a)].filter(x => new Set(b).has(x));

// 3. 数组差集
const difference = [...new Set(a)].filter(x => !new Set(b).has(x));

// Map - 键值对集合
const map = new Map();
map.set('name', 'Tom');
map.set('age', 18);
map.get('name');     // 'Tom'
map.has('name');     // true
map.delete('name');
map.size;            // 2

// Map 遍历
for (const [key, value] of map) {
  console.log(key, value);
}
map.forEach((value, key) => {
  console.log(key, value);
});

// Map 与对象互转
const obj = { name: 'Tom', age: 18 };
const mapFromObj = new Map(Object.entries(obj));
const objFromMap = Object.fromEntries(map);

// Map 实践应用
// 1. 缓存函数结果
const memoize = (fn) => {
  const cache = new Map();
  return (...args) => {
    const key = JSON.stringify(args);
    if (cache.has(key)) {
      return cache.get(key);
    }
    const result = fn(...args);
    cache.set(key, result);
    return result;
  };
};

// 2. 字典统计
const countWords = (text) => {
  const counts = new Map();
  for (const word of text.split(' ')) {
    counts.set(word, (counts.get(word) || 0) + 1);
  }
  return counts;
};

// WeakSet - 弱引用集合
const weakSet = new WeakSet();
const obj = {};
weakSet.add(obj);
weakSet.has(obj);    // true
weakSet.delete(obj);

// 应用：存储对象，只关心是否存在
const visited = new WeakSet();
function visit(node) {
  if (visited.has(node)) return false;
  visited.add(node);
  return true;
}

// WeakMap - 弱引用字典
const weakMap = new WeakMap();
const obj = {};
weakMap.set(obj, 'value');
weakMap.get(obj);    // 'value'
weakMap.has(obj);    // true

// 应用：私有数据
const privateData = new WeakMap();
class User {
  constructor(name) {
    privateData.set(this, { name });
  }
  getName() {
    return privateData.get(this).name;
  }
}
```

---

## 十三、手写代码题精选

### 13.1 完整版深拷贝

**参考答案：**

```javascript
/**
 * 深拷贝完整版
 * 支持：
 * - 基本类型
 * - 数组和对象
 * - Date 和 RegExp
 * - Symbol 作为键名
 * - 循环引用
 * - 函数（可选）
 * - Map 和 Set
 */

function deepClone(target, hash = new WeakMap()) {
  // 1. 处理 null 和 undefined
  if (target === null) return null;
  if (target === undefined) return undefined;

  // 2. 处理原始类型
  if (typeof target !== 'object') {
    return target;
  }

  // 3. 处理函数（可选）
  if (typeof target === 'function') {
    return target;  // 或者 return target.bind({});
  }

  // 4. 处理日期
  if (target instanceof Date) {
    return new Date(target.getTime());
  }

  // 5. 处理正则
  if (target instanceof RegExp) {
    const flags = target.flags || '';
    return new RegExp(target.source, flags);
  }

  // 6. 处理 Map
  if (target instanceof Map) {
    const cloneMap = new Map();
    hash.set(target, cloneMap);
    target.forEach((value, key) => {
      cloneMap.set(
        deepClone(key, hash),
        deepClone(value, hash)
      );
    });
    return cloneMap;
  }

  // 7. 处理 Set
  if (target instanceof Set) {
    const cloneSet = new Set();
    hash.set(target, cloneSet);
    target.forEach(value => {
      cloneSet.add(deepClone(value, hash));
    });
    return cloneSet;
  }

  // 8. 处理循环引用
  if (hash.has(target)) {
    return hash.get(target);
  }

  // 9. 处理数组
  if (Array.isArray(target)) {
    const cloneArr = [];
    hash.set(target, cloneArr);
    target.forEach((item, index) => {
      cloneArr[index] = deepClone(item, hash);
    });
    return cloneArr;
  }

  // 10. 处理普通对象
  const cloneObj = {};
  hash.set(target, cloneObj);

  // 获取所有键（包括 Symbol）
  const keys = [
    ...Object.keys(target),
    ...Object.getOwnPropertySymbols(target)
  ];

  keys.forEach(key => {
    const descriptor = Object.getOwnPropertyDescriptor(target, key);
    if (descriptor && !descriptor.enumerable) {
      // 处理不可枚举属性
      Object.defineProperty(cloneObj, key, {
        ...descriptor,
        value: deepClone(descriptor.value, hash)
      });
    } else {
      cloneObj[key] = deepClone(target[key], hash);
    }
  });

  return cloneObj;
}

// 测试
const original = {
  name: 'Tom',
  date: new Date('2024-01-01'),
  regex: /test/gi,
  symbol: Symbol('id'),
  map: new Map([['key', 'value']]),
  set: new Set([1, 2, 3]),
  nested: {
    a: 1,
    b: [1, 2, { c: 3 }]
  },
  self: null  // 循环引用
};
original.self = original;

const cloned = deepClone(original);
console.log(cloned);
console.log(original.self === cloned.self);  // false（循环引用被正确处理）
```

### 13.2 完整版防抖节流

**参考答案：**

```javascript
/**
 * 防抖 (Debounce) - 函数在指定时间间隔内不被再次调用
 * 适用场景：搜索框输入、窗口调整大小、提交按钮
 */

// 基础版防抖
function debounce(func, wait) {
  let timeout;
  return function(...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      func.apply(this, args);
    }, wait);
  };
}

// 带立即执行选项的防抖
function debounceImmediate(func, wait, immediate = false) {
  let timeout;
  return function(...args) {
    const context = this;

    const later = () => {
      timeout = null;
      if (!immediate) {
        func.apply(context, args);
      }
    };

    const callNow = immediate && !timeout;

    clearTimeout(timeout);
    timeout = setTimeout(later, wait);

    if (callNow) {
      func.apply(context, args);
    }
  };
}

// 完整版防抖（支持取消和立即执行）
function debouncePro(func, wait, options = {}) {
  let timeout;
  let lastArgs;
  let lastThis;
  let result;
  let lastCallTime;

  const { immediate = false, trailing = true } = options;

  const debounced = function(...args) {
    lastArgs = args;
    lastThis = this;
    const now = Date.now();

    // 立即执行模式
    if (immediate) {
      const callNow = !timeout;
      timeout = setTimeout(() => {
        timeout = null;
      }, wait);

      if (callNow) {
        result = func.apply(this, args);
      }
    } else {
      // 普通模式
      if (timeout) clearTimeout(timeout);
      timeout = setTimeout(() => {
        timeout = null;
        if (trailing && lastArgs) {
          result = func.apply(lastThis, lastArgs);
        }
      }, wait);
    }

    return result;
  };

  // 取消函数
  debounced.cancel = function() {
    if (timeout) clearTimeout(timeout);
    timeout = null;
    lastArgs = lastThis = null;
  };

  // 立即执行函数
  debounced.flush = function() {
    if (timeout) {
      if (immediate) {
        func.apply(lastThis, lastArgs);
      }
      clearTimeout(timeout);
      timeout = null;
    }
  };

  return debounced;
}

/**
 * 节流 (Throttle) - 函数在指定时间间隔内最多执行一次
 * 适用场景：滚动事件、鼠标移动、resize 事件
 */

// 时间戳版本
function throttleTimestamp(func, wait) {
  let previous = 0;
  return function(...args) {
    const now = Date.now();
    if (now - previous >= wait) {
      func.apply(this, args);
      previous = now;
    }
  };
}

// 定时器版本
function throttleTimer(func, wait) {
  let timeout;
  return function(...args) {
    if (!timeout) {
      timeout = setTimeout(() => {
        timeout = null;
        func.apply(this, args);
      }, wait);
    }
  };
}

// 完整版节流（支持 leading/trailing）
function throttlePro(func, wait, options = {}) {
  let timeout;
  let previous = 0;
  let result;
  let lastArgs;
  let lastThis;

  const { leading = true, trailing = true } = options;

  const throttled = function(...args) {
    const now = Date.now();
    lastArgs = args;
    lastThis = this;

    // leading：立即执行
    if (leading && previous === 0) {
      result = func.apply(this, args);
      previous = now;
      return result;
    }

    // 距离上次执行剩余时间
    const remaining = wait - (now - previous);

    // 执行条件
    if (remaining <= 0 || remaining > wait) {
      // 清除定时器
      if (timeout) {
        clearTimeout(timeout);
        timeout = null;
      }

      previous = now;
      result = func.apply(this, args);

      // trailing：最后执行
    } else if (trailing && !timeout) {
      timeout = setTimeout(() => {
        previous = Date.now();
        timeout = null;
        result = func.apply(lastThis, lastArgs);

        // 防止 trailing 在 leading 之后再次执行
        if (!leading) {
          previous = 0;
        }
      }, remaining);
    }

    return result;
  };

  // 取消函数
  throttled.cancel = function() {
    clearTimeout(timeout);
    previous = 0;
    timeout = lastArgs = lastThis = null;
  };

  return throttled;
}

// 实际应用示例
const handleSearch = debouncePro((keyword) => {
  console.log('搜索:', keyword);
}, 300, { immediate: true });

const handleScroll = throttlePro(() => {
  console.log('滚动位置:', window.scrollY);
}, 100, { leading: true, trailing: true });

const handleResize = throttlePro(() => {
  console.log('窗口大小:', window.innerWidth, window.innerHeight);
}, 200);

// 使用示例
window.addEventListener('resize', handleResize);
window.addEventListener('scroll', handleScroll);
```

### 13.3 完整版 Promise 实现

**参考答案：**

```javascript
/**
 * 手写完整版 Promise
 * 包含：状态管理、then 链式调用、catch、finally、
 *      resolve、reject、all、race、allSettled、any
 */

const PENDING = 'pending';
const FULFILLED = 'fulfilled';
const REJECTED = 'rejected';

class MyPromise {
  constructor(executor) {
    // 状态
    this.state = PENDING;
    // 值
    this.value = undefined;
    // 失败原因
    this.reason = undefined;

    // 成功回调队列
    this.onFulfilledCallbacks = [];
    // 失败回调队列
    this.onRejectedCallbacks = [];

    // 绑定 this
    const resolve = this.resolve.bind(this);
    const reject = this.reject.bind(this);

    try {
      executor(resolve, reject);
    } catch (error) {
      reject(error);
    }
  }

  // 改变状态为成功
  resolve(value) {
    // 只有 pending 状态可以改变
    if (this.state === PENDING) {
      // 处理 Promise 值（如果是 Promise，递归解析）
      if (value instanceof MyPromise) {
        value.then(this.resolve.bind(this), this.reject.bind(this));
        return;
      }

      this.state = FULFILLED;
      this.value = value;

      // 异步执行回调
      this.onFulfilledCallbacks.forEach(callback => {
        queueMicrotask(() => callback(this.value));
      });
    }
  }

  // 改变状态为失败
  reject(reason) {
    if (this.state === PENDING) {
      this.state = REJECTED;
      this.reason = reason;

      this.onRejectedCallbacks.forEach(callback => {
        queueMicrotask(() => callback(this.reason));
      });
    }
  }

  // then 方法
  then(onFulfilled, onRejected) {
    // 参数可选
    onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : value => value;
    onRejected = typeof onRejected === 'function' ? onRejected : reason => { throw reason; };

    // 返回新的 Promise
    return new MyPromise((resolve, reject) => {
      // 封装回调函数，统一处理
      const handleCallback = (callback, value) => {
        try {
          const result = callback(value);
          // 处理返回值，如果是 Promise 则等待其完成
          if (result instanceof MyPromise) {
            result.then(resolve, reject);
          } else {
            resolve(result);
          }
        } catch (error) {
          reject(error);
        }
      };

      // 根据状态执行回调
      if (this.state === FULFILLED) {
        queueMicrotask(() => handleCallback(onFulfilled, this.value));
      } else if (this.state === REJECTED) {
        queueMicrotask(() => handleCallback(onRejected, this.reason));
      } else {
        // pending 状态，保存回调
        this.onFulfilledCallbacks.push(value => {
          handleCallback(onFulfilled, value);
        });
        this.onRejectedCallbacks.push(reason => {
          handleCallback(onRejected, reason);
        });
      }
    });
  }

  // catch 方法
  catch(onRejected) {
    return this.then(null, onRejected);
  }

  // finally 方法
  finally(onFinally) {
    return this.then(
      value => {
        // 等待 finally 执行完成
        return MyPromise.resolve(onFinally()).then(() => value);
      },
      reason => {
        return MyPromise.resolve(onFinally()).then(() => { throw reason; });
      }
    );
  }

  // 静态 resolve 方法
  static resolve(value) {
    if (value instanceof MyPromise) {
      return value;
    }
    return new MyPromise(resolve => resolve(value));
  }

  // 静态 reject 方法
  static reject(reason) {
    return new MyPromise((_, reject) => reject(reason));
  }

  // 静态 all 方法 - 全部成功才成功
  static all(promises) {
    return new MyPromise((resolve, reject) => {
      if (!Array.isArray(promises)) {
        return reject(new TypeError('参数必须是数组'));
      }

      const results = [];
      let count = 0;

      if (promises.length === 0) {
        return resolve([]);
      }

      promises.forEach((promise, index) => {
        // 包装非 Promise 值
        MyPromise.resolve(promise).then(
          value => {
            results[index] = value;
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

  // 静态 race 方法 - 返回最先完成的结果
  static race(promises) {
    return new MyPromise((resolve, reject) => {
      if (!Array.isArray(promises)) {
        return reject(new TypeError('参数必须是数组'));
      }

      promises.forEach(promise => {
        MyPromise.resolve(promise).then(resolve, reject);
      });
    });
  }

  // 静态 allSettled 方法 - 等待所有 Promise 完成
  static allSettled(promises) {
    return new MyPromise((resolve) => {
      if (!Array.isArray(promises)) {
        return reject(new TypeError('参数必须是数组'));
      }

      const results = [];
      let count = 0;

      if (promises.length === 0) {
        return resolve([]);
      }

      promises.forEach((promise, index) => {
        MyPromise.resolve(promise).then(
          value => {
            results[index] = { status: FULFILLED, value };
            count++;
            if (count === promises.length) {
              resolve(results);
            }
          },
          reason => {
            results[index] = { status: REJECTED, reason };
            count++;
            if (count === promises.length) {
              resolve(results);
            }
          }
        );
      });
    });
  }

  // 静态 any 方法 - 返回第一个成功的结果
  static any(promises) {
    return new MyPromise((resolve, reject) => {
      if (!Array.isArray(promises)) {
        return reject(new TypeError('参数必须是数组'));
      }

      const errors = [];
      let count = 0;

      if (promises.length === 0) {
        return reject(new AggregateError('All promises were rejected'));
      }

      promises.forEach((promise, index) => {
        MyPromise.resolve(promise).then(
          value => resolve(value),
          error => {
            errors[index] = error;
            count++;
            if (count === promises.length) {
              reject(new AggregateError(errors));
            }
          }
        );
      });
    });
  }
}

// 测试
const p1 = new MyPromise(resolve => setTimeout(() => resolve(1), 1000));
const p2 = new MyPromise(resolve => setTimeout(() => resolve(2), 500));
const p3 = new MyPromise((_, reject) => setTimeout(() => reject('error'), 200));

MyPromise.all([p1, p2]).then(console.log);  // [1, 2]
MyPromise.race([p1, p2]).then(console.log); // 2
```

### 13.4 call / apply / bind 完整实现

**参考答案：**

```javascript
/**
 * call 实现
 * 语法: fn.call(thisArg, arg1, arg2, ...)
 * 作用: 改变函数 this 指向并执行
 */
Function.prototype.myCall = function(context, ...args) {
  // 1. 处理 context（thisArg）
  // 如果为 null 或 undefined，指向全局对象
  // 如果是原始类型，转换为对象
  const ctx = context === null || context === undefined
    ? globalThis
    : Object(context);

  // 2. 创建唯一属性名
  const fn = Symbol('fn');

  // 3. 将函数设置为 context 的属性
  ctx[fn] = this;

  // 4. 执行函数并获取结果
  // 使用扩展运算符传递参数
  const result = ctx[fn](...args);

  // 5. 删除临时属性
  delete ctx[fn];

  // 6. 返回结果
  return result;
};

/**
 * apply 实现
 * 语法: fn.apply(thisArg, [argsArray])
 * 作用: 改变函数 this 指向并执行（参数为数组）
 */
Function.prototype.myApply = function(context, args = []) {
  // 处理 context
  const ctx = context === null || context === undefined
    ? globalThis
    : Object(context);

  // 创建唯一属性名
  const fn = Symbol('fn');

  // 设置临时属性
  ctx[fn] = this;

  // 执行函数
  let result;
  if (args.length > 0) {
    result = ctx[fn](...args);
  } else {
    result = ctx[fn]();
  }

  // 清理
  delete ctx[fn];

  return result;
};

/**
 * bind 实现
 * 语法: fn.bind(thisArg, arg1, arg2, ...)
 * 作用: 创建一个新函数，this 被绑定
 */
Function.prototype.myBind = function(context, ...args) {
  // 保存原函数
  const fn = this;

  // 返回新函数
  return function(...args2) {
    // 处理构造函数调用
    // 如果使用 new 调用，忽略 thisArg
    if (this instanceof fn) {
      return new fn(...args, ...args2);
    }

    // 普通调用
    return fn.apply(context, [...args, ...args2]);
  };
};

/**
 * 简化的 bind 实现（面试常考）
 */
Function.prototype.simpleBind = function(context) {
  const fn = this;
  const args = Array.prototype.slice.call(arguments, 1);

  return function() {
    const args2 = Array.prototype.slice.call(arguments);
    return fn.apply(context, args.concat(args2));
  };
};

/**
 * bind 的高级特性 - 构造函数检测
 */
function Animal(name) {
  if (this instanceof Animal) {
    this.name = name;
  } else {
    throw new Error('必须使用 new 调用');
  }
}

const AnimalFn = Animal.myBind(null, 'Tom');
const animal1 = new AnimalFn();  // this instanceof Animal === true
const animal2 = AnimalFn();       // 抛出错误

/**
 * 使用示例
 */
function greet(greeting, punctuation) {
  return `${greeting}, ${this.name}${punctuation}`;
}

const person = { name: 'Tom' };

// call 使用
console.log(greet.myCall(person, 'Hello', '!'));  // Hello, Tom!

// apply 使用
console.log(greet.myApply(person, ['Hello', '!']));  // Hello, Tom!

// bind 使用
const boundGreet = greet.myBind(person, 'Hi');
console.log(boundGreet('?'));  // Hi, Tom?
```

### 13.5 数组去重方法汇总

**参考答案：**

```javascript
/**
 * 数组去重方法汇总
 */

// 方法1: Set（最简单）
function unique1(arr) {
  return [...new Set(arr)];
}

// 方法2: filter + indexOf
function unique2(arr) {
  return arr.filter((item, index) => arr.indexOf(item) === index);
}

// 方法3: filter + includes
function unique3(arr) {
  const result = [];
  arr.forEach(item => {
    if (!result.includes(item)) {
      result.push(item);
    }
  });
  return result;
}

// 方法4: reduce
function unique4(arr) {
  return arr.reduce((acc, cur) => {
    if (!acc.includes(cur)) {
      acc.push(cur);
    }
    return acc;
  }, []);
}

// 方法5: Map（保持插入顺序）
function unique5(arr) {
  const map = new Map();
  const result = [];
  arr.forEach(item => {
    if (!map.has(item)) {
      map.set(item, true);
      result.push(item);
    }
  });
  return result;
}

// 方法6: Object（适用于基本类型）
function unique6(arr) {
  const obj = {};
  return arr.filter(item => {
    const key = typeof item + JSON.stringify(item);
    if (obj[key]) {
      return false;
    }
    obj[key] = true;
    return true;
  });
}

// 方法7: 排序后去重
function unique7(arr) {
  const sorted = [...arr].sort();
  const result = [sorted[0]];
  for (let i = 1; i < sorted.length; i++) {
    if (sorted[i] !== sorted[i - 1]) {
      result.push(sorted[i]);
    }
  }
  return result;
}

// 方法8: 递归（支持深层数组）
function uniqueDeep(arr) {
  const result = [];
  arr.forEach(item => {
    if (Array.isArray(item)) {
      const uniqueItems = uniqueDeep(item);
      uniqueItems.forEach(u => {
        if (!result.includes(u)) {
          result.push(u);
        }
      });
    } else if (!result.includes(item)) {
      result.push(item);
    }
  });
  return result;
}

// 测试
const arr = [1, 2, 2, 3, 3, 3, 'a', 'a', { a: 1 }, { a: 1 }];
console.log(unique1(arr));
// [1, 2, 3, 'a', {a: 1}, {a: 1}]

// 特殊情况处理
// 1. NaN 去重
function uniqueNaN(arr) {
  return arr.filter((item, index, array) =>
    array.findIndex(x => Number.isNaN(x)) === index
  );
}

// 2. 对象数组去重
function uniqueBy(arr, key) {
  const seen = new Set();
  return arr.filter(item => {
    const value = item[key];
    if (seen.has(value)) {
      return false;
    }
    seen.add(value);
    return true;
  });
}

const users = [
  { id: 1, name: 'Tom' },
  { id: 2, name: 'Jerry' },
  { id: 1, name: 'Tom' }
];
console.log(uniqueBy(users, 'id'));
// [{id: 1, name: 'Tom'}, {id: 2, name: 'Jerry'}]
```

### 13.6 常见算法实现

**参考答案：**

```javascript
/**
 * 排序算法
 */

// 冒泡排序
function bubbleSort(arr) {
  const n = arr.length;
  for (let i = 0; i < n - 1; i++) {
    for (let j = 0; j < n - i - 1; j++) {
      if (arr[j] > arr[j + 1]) {
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
      }
    }
  }
  return arr;
}

// 快速排序
function quickSort(arr) {
  if (arr.length <= 1) return arr;

  const pivot = arr[0];
  const left = arr.slice(1).filter(x => x < pivot);
  const right = arr.slice(1).filter(x => x >= pivot);

  return [...quickSort(left), pivot, ...quickSort(right)];
}

// 归并排序
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

  return result.concat(left.slice(i)).concat(right.slice(j));
}

// 插入排序
function insertionSort(arr) {
  for (let i = 1; i < arr.length; i++) {
    const current = arr[i];
    let j = i - 1;
    while (j >= 0 && arr[j] > current) {
      arr[j + 1] = arr[j];
      j--;
    }
    arr[j + 1] = current;
  }
  return arr;
}

/**
 * 查找算法
 */

// 二分查找
function binarySearch(arr, target) {
  let left = 0;
  let right = arr.length - 1;

  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    if (arr[mid] === target) return mid;
    if (arr[mid] < target) left = mid + 1;
    else right = mid - 1;
  }

  return -1;
}

// 顺序查找
function linearSearch(arr, target) {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] === target) return i;
  }
  return -1;
}

/**
 * 字符串算法
 */

// 反转字符串
function reverseString(str) {
  return str.split('').reverse().join('');
}

// 回文判断
function isPalindrome(str) {
  const cleaned = str.toLowerCase().replace(/[^a-z0-9]/g, '');
  return cleaned === cleaned.split('').reverse().join('');
}

// 字符串压缩（行程编码）
function compressString(str) {
  let result = '';
  let count = 1;

  for (let i = 1; i <= str.length; i++) {
    if (str[i] === str[i - 1]) {
      count++;
    } else {
      result += str[i - 1] + (count > 1 ? count : '');
      count = 1;
    }
  }

  return result;
}

/**
 * 树与图算法
 */

// 二叉树遍历
class TreeNode {
  constructor(val) {
    this.val = val;
    this.left = null;
    this.right = null;
  }
}

// 前序遍历
function preorderTraversal(root) {
  const result = [];
  function traverse(node) {
    if (!node) return;
    result.push(node.val);
    traverse(node.left);
    traverse(node.right);
  }
  traverse(root);
  return result;
}

// 中序遍历
function inorderTraversal(root) {
  const result = [];
  function traverse(node) {
    if (!node) return;
    traverse(node.left);
    result.push(node.val);
    traverse(node.right);
  }
  traverse(root);
  return result;
}

// 后序遍历
function postorderTraversal(root) {
  const result = [];
  function traverse(node) {
    if (!node) return;
    traverse(node.left);
    traverse(node.right);
    result.push(node.val);
  }
  traverse(root);
  return result;
}

// 广度优先遍历（BFS）
function bfs(root) {
  if (!root) return [];
  const result = [];
  const queue = [root];

  while (queue.length) {
    const node = queue.shift();
    result.push(node.val);
    if (node.left) queue.push(node.left);
    if (node.right) queue.push(node.right);
  }

  return result;
}

/**
 * 动态规划
 */

// 斐波那契数列
function fibonacci(n) {
  // 递归（效率低）
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}

// 动态规划优化
function fibonacciDP(n) {
  if (n <= 1) return n;
  const dp = [0, 1];
  for (let i = 2; i <= n; i++) {
    dp[i] = dp[i - 1] + dp[i - 2];
  }
  return dp[n];
}

// 空间优化
function fibonacciOptimized(n) {
  if (n <= 1) return n;
  let prev = 0, curr = 1;
  for (let i = 2; i <= n; i++) {
    [prev, curr] = [curr, prev + curr];
  }
  return curr;
}

// 爬楼梯
function climbStairs(n) {
  if (n <= 2) return n;
  let a = 1, b = 2;
  for (let i = 3; i <= n; i++) {
    [a, b] = [b, a + b];
  }
  return b;
}

// 最大子序和
function maxSubArray(nums) {
  let maxSum = nums[0];
  let currentSum = nums[0];

  for (let i = 1; i < nums.length; i++) {
    currentSum = Math.max(nums[i], currentSum + nums[i]);
    maxSum = Math.max(maxSum, currentSum);
  }

  return maxSum;
}

// 背包问题
function knapSack(weights, values, capacity) {
  const n = weights.length;
  const dp = Array(n + 1).fill(null).map(() => Array(capacity + 1).fill(0));

  for (let i = 1; i <= n; i++) {
    for (let w = 0; w <= capacity; w++) {
      if (weights[i - 1] <= w) {
        dp[i][w] = Math.max(
          dp[i - 1][w],
          dp[i - 1][w - weights[i - 1]] + values[i - 1]
        );
      } else {
        dp[i][w] = dp[i - 1][w];
      }
    }
  }

  return dp[n][capacity];
}
```

---

## 十四、浏览器渲染与优化

### 14.1 浏览器渲染流程

**参考答案：**

```
┌─────────────────────────────────────────────────────────────────┐
│                      浏览器渲染流程                               │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌────────────┐    ┌────────────┐    ┌────────────┐            │
│  │   解析     │───►│   样式     │───►│   布局     │            │
│  │  HTML/CSS  │    │   计算     │    │   (Layout)│            │
│  └────────────┘    └────────────┘    └─────┬──────┘            │
│                                            │                    │
│                                            ▼                    │
│  ┌────────────┐    ┌────────────┐    ┌────────────┐            │
│  │    绘制    │◄───│    渲染    │◄───│   分层     │            │
│  │  (Paint)  │    │   (Layer)  │    │  (Composite)│           │
│  └────────────┘    └────────────┘    └────────────┘            │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘

详细流程：
1. HTML 解析 → DOM 树
2. CSS 解析 → CSSOM 树
3. DOM + CSSOM → 渲染树 (Render Tree)
4. 渲染树 → 布局 (Layout) - 计算位置和大小
5. 布局树 → 分层 (Layer) - 创建图层
6. 图层 → 绘制 (Paint) - 绘制指令
7. 合成 (Composite) - GPU 合成最终图像
```

### 14.2 重排与重绘

**参考答案：**

```javascript
// 触发重排（Reflow）的操作
// 任何改变元素位置、大小、内容的操作都会触发重排

// 1. 调整窗口大小
window.addEventListener('resize', handler);

// 2. 改变元素尺寸
element.style.width = '100px';
element.style.height = '100px';

// 3. 改变元素内容
element.textContent = 'new content';
element.innerHTML = '<div>new</div>';

// 4. 获取布局信息
element.offsetWidth;     // 触发重排
element.offsetHeight;
element.clientWidth;
element.scrollWidth;
element.getBoundingClientRect();
window.getComputedStyle(element);

// 5. 添加/删除可见元素
document.body.appendChild(element);

// 6. 改变字体大小
element.style.fontSize = '20px';

// 7. 改变 padding/margin
element.style.padding = '10px';


// 触发重绘（Repaint）的操作
// 改变元素外观但不影响布局

// 1. 改变颜色
element.style.color = 'red';
element.style.backgroundColor = 'blue';

// 2. 改变边框样式
element.style.border = '1px solid red';

// 3. 改变 visibility
element.style.visibility = 'hidden';


// 性能优化：减少重排重绘

// 1. 批量修改样式
// 错误
element.style.width = '100px';
element.style.height = '100px';
element.style.color = 'red';

// 正确 - 使用 class
element.className = 'active';

// 正确 - 使用 CSS变量
element.style.setProperty('--width', '100px');

// 2. 使用 transform 代替 left/top
// 触发重排
element.style.left = '100px';
element.style.top = '100px';

// 触发合成
element.style.transform = 'translateX(100px)';

// 3. 使用 will-change
.element {
  will-change: transform;  // 提前告知浏览器
}

// 4. 缓存布局信息
const width = element.offsetWidth;  // 读取一次
// 多次使用 width 变量

// 5. 使用 DocumentFragment
const fragment = document.createDocumentFragment();
for (let i = 0; i < 100; i++) {
  const div = document.createElement('div');
  fragment.appendChild(div);
}
document.body.appendChild(fragment);  // 触发一次重排

// 6. 虚拟 DOM（React 原理）
// 合并多次修改到一次重排
```

### 14.3 requestAnimationFrame 详解

**参考答案：**

```javascript
// requestAnimationFrame - 浏览器下一次重绘前执行
// 特点：60fps 自动节流、页面不可见时暂停、保证动画流畅

// 基本用法
function animate() {
  // 更新动画状态
  update();

  // 绘制
  draw();

  // 继续下一帧
  requestAnimationFrame(animate);
}
requestAnimationFrame(animate);

// 取消动画
let animationId = requestAnimationFrame(animate);
cancelAnimationFrame(animationId);

// 实际应用：平滑动画
function smoothMove(element, targetX, targetY) {
  let currentX = 0, currentY = 0;

  function animate() {
    // 计算移动步长
    const dx = targetX - currentX;
    const dy = targetY - currentY;

    // 接近目标时停止
    if (Math.abs(dx) < 1 && Math.abs(dy) < 1) {
      element.style.transform = `translate(${targetX}px, ${targetY}px)`;
      return;
    }

    // 使用缓动函数
    currentX += dx * 0.1;
    currentY += dy * 0.1;

    element.style.transform = `translate(${currentX}px, ${currentY}px)`;
    requestAnimationFrame(animate);
  }

  requestAnimationFrame(animate);
}

// 实现防抖版本 requestAnimationFrame
function rafDebounce(fn) {
  let rafId = null;
  return function(...args) {
    if (rafId) {
      cancelAnimationFrame(rafId);
    }
    rafId = requestAnimationFrame(() => {
      fn.apply(this, args);
      rafId = null;
    });
  };
}

// 实现节流版本 requestAnimationFrame
function rafThrottle(fn) {
  let lastTime = 0;
  return function(...args) {
    const now = Date.now();
    if (now - lastTime >= 16) {  // 约 60fps
      lastTime = now;
      fn.apply(this, args);
    }
  };
}

// 与 setTimeout/setInterval 对比
// setInterval 可能在帧之间执行，导致丢帧
// requestAnimationFrame 总是与浏览器刷新率同步

// 实际应用：倒计时
function countDown(element, seconds) {
  let remaining = seconds;

  function update() {
    element.textContent = remaining;
    remaining--;

    if (remaining >= 0) {
      requestAnimationFrame(update);
    }
  }

  requestAnimationFrame(update);
}

// 实际应用：滚动监听优化
function handleScroll() {
  console.log(window.scrollY);
}

window.addEventListener('scroll', rafThrottle(handleScroll));

// 实际应用：Canvas 动画
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

function gameLoop() {
  // 清除画布
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // 更新状态
  update();

  // 绘制
  draw();

  // 继续循环
  requestAnimationFrame(gameLoop);
}

requestAnimationFrame(gameLoop);
```

---

## 十五、网络与性能

### 15.1 HTTP 缓存机制

**参考答案：**

```
┌─────────────────────────────────────────────────────────────────┐
│                      HTTP 缓存机制                               │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │                    浏览器缓存                            │    │
│  │                                                          │    │
│  │  ┌─────────────┐    ┌─────────────┐                     │    │
│  │  │   强缓存    │    │   协商缓存  │                     │    │
│  │  │  (Cache)   │    │  (Etag)     │                     │    │
│  │  └──────┬──────┘    └──────┬──────┘                     │    │
│  │         │                  │                             │    │
│  │  Expires │            If-None-Match                     │    │
│  │  Cache-Control     If-Modified-Since                    │    │
│  │                                            │             │    │
│  └──────────┼──────────────────────────────┘              │    │
│             │                                            │    │
│             ▼                                            ▼    │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │                      服务器                             │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

```javascript
// 强缓存 - 不发送请求到服务器
// Cache-Control (HTTP/1.1)
response.setHeader('Cache-Control', 'max-age=3600');           // 1小时
response.setHeader('Cache-Control', 'no-cache');             // 每次验证
response.setHeader('Cache-Control', 'no-store');              // 不缓存
response.setHeader('Cache-Control', 'public');                 // 允许代理缓存
response.setHeader('Cache-Control', 'private');               // 仅浏览器缓存

// Expires (HTTP/1.0)
response.setHeader('Expires', 'Wed, 21 Oct 2025 07:28:00 GMT');

// 协商缓存 - 需要发送请求验证
// ETag / If-None-Match
response.setHeader('ETag', 'abc123');  // 服务器生成
// 下次请求
request.setHeader('If-None-Match', 'abc123');

// Last-Modified / If-Modified-Since
response.setHeader('Last-Modified', 'Wed, 21 Oct 2025 07:28:00 GMT');
// 下次请求
request.setHeader('If-Modified-Since', 'Wed, 21 Oct 2025 07:28:00 GMT');

// 优先级：Cache-Control > Expires
// ETag > Last-Modified（更精确）
```

### 15.2 性能优化技巧

**参考答案：**

```javascript
// 1. 减少 HTTP 请求
// - 合并 CSS/JS 文件
// - 使用 CSS Sprite
// - 使用 Base64 编码（小图片）
// - 懒加载

// 2. 使用 CDN
// 静态资源使用 CDN 加速

// 3. 启用压缩
// Gzip / Brotli 压缩

// 4. 代码优化
// - 删除未使用的代码
// - 代码分割 (Code Splitting)
// - Tree Shaking

// 5. 图片优化
// - 使用 WebP 格式
// - 响应式图片 srcset
// - 懒加载
// - 压缩

// 6. 关键渲染路径优化
// <link rel="preload"> 预加载关键资源
<link rel="preload" href="main.css" as="style">
<link rel="preload" href="main.js" as="script">

// 7. DNS 预解析
<link rel="dns-prefetch" href="//example.com">

// 8. TCP 预连接
<link rel="preconnect" href="//example.com">

// 9. Service Worker 缓存
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js');
}

// 10. 前端性能指标
// LCP (Largest Contentful Paint) - 最大内容绘制
// FID (First Input Delay) - 首次输入延迟
// CLS (Cumulative Layout Shift) - 累计布局偏移

// 使用 Performance API
performance.mark('start');
// 执行代码
performance.mark('end');
performance.measure('duration', 'start', 'end');

// 11. 减少重排重绘
// 使用 transform/opacity 进行动画
// 使用 will-change 提示浏览器
element.style.willChange = 'transform';

// 12. 使用 requestAnimationFrame
// 动画使用 rAF 而不是 setTimeout/setInterval
```

---

## 十六、面试常见问题汇总

### 16.1 JavaScript 基础面试题

**参考答案：**

```javascript
// Q1: var、let、const 的区别
// 答案见 6.1 节

// Q2: null 和 undefined 的区别
// null: 表示"空值"，手动赋值
// undefined: 表示"未定义"，自动赋值
let a;
console.log(a);  // undefined

const b = null;
console.log(b);  // null

// typeof 区别
typeof null;        // 'object' (历史 bug)
typeof undefined;   // 'undefined'

// == 区别
null == undefined;  // true
null === undefined; // false

// Q3: 什么是闭包
// 闭包是指函数与其外部作用域的引用捆绑在一起
// 外部函数可以访问内部函数的变量
function outer() {
  let count = 0;
  return function inner() {
    count++;
    return count;
  };
}
const fn = outer();
fn(); // 1
fn(); // 2

// Q4: 原型链是什么
// 每个对象都有一个指向其原型对象的内部链接
// 形成了对象的继承链

// Q5: 什么是事件循环
// 单线程的 JavaScript 通过事件循环处理异步操作
// 同步代码 -> 微任务 -> 渲染 -> 宏任务

// Q6: Promise 和 async/await 的区别
// Promise: 基于回调的异步解决方案
// async/await: Promise 的语法糖，更简洁

// Q7: 什么是柯里化
// 将多参数函数转换为单参数函数序列

// Q8: 深拷贝和浅拷贝的区别
// 浅拷贝: 只复制一层，引用类型共享内存
// 深拷贝: 递归复制所有层级，完全独立

// Q9: 防抖和节流的区别
// 防抖: 等待停止触发后执行
// 节流: 固定时间间隔执行

// Q10: 为什么 0.1 + 0.2 !== 0.3
// 浮点数精度问题
console.log(0.1 + 0.2);  // 0.30000000000000004
// 解决: 使用整数运算或 toFixed
Math.abs(0.1 + 0.2 - 0.3) < 0.000001;  // true
```

### 16.2 手写代码面试题

**参考答案：**

```javascript
// Q1: 实现一个类
class Person {
  constructor(name, age) {
    this.name = name;
    this.age = age;
  }

  greet() {
    return `Hello, I'm ${this.name}`;
  }

  static create(name, age) {
    return new Person(name, age);
  }
}

// Q2: 实现继承
class Student extends Person {
  constructor(name, age, grade) {
    super(name, age);
    this.grade = grade;
  }

  study() {
    return `${this.name} is studying`;
  }
}

// Q3: 实现 EventEmitter
class EventEmitter {
  constructor() {
    this.events = {};
  }

  on(event, listener) {
    if (!this.events[event]) {
      this.events[event] = [];
    }
    this.events[event].push(listener);
    return this;
  }

  off(event, listener) {
    if (!this.events[event]) return this;
    this.events[event] = this.events[event].filter(l => l !== listener);
    return this;
  }

  emit(event, ...args) {
    if (!this.events[event]) return this;
    this.events[event].forEach(listener => listener(...args));
    return this;
  }

  once(event, listener) {
    const wrapper = (...args) => {
      listener(...args);
      this.off(event, wrapper);
    };
    return this.on(event, wrapper);
  }
}

// Q4: 实现 LRU 缓存
class LRUCache {
  constructor(capacity) {
    this.capacity = capacity;
    this.cache = new Map();
  }

  get(key) {
    if (!this.cache.has(key)) return -1;

    const value = this.cache.get(key);
    this.cache.delete(key);
    this.cache.set(key, value);
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

// Q5: 实现 instanceof
function myInstanceof(left, right) {
  let proto = left.__proto__;
  const prototype = right.prototype;
  while (proto) {
    if (proto === prototype) return true;
    proto = proto.__proto__;
  }
  return false;
}

// Q6: 实现 new
function myNew(constructor, ...args) {
  const obj = Object.create(constructor.prototype);
  const result = constructor.apply(obj, args);
  return result instanceof Object ? result : obj;
}

// Q7: 实现 Promise.all
function promiseAll(promises) {
  return new Promise((resolve, reject) => {
    const results = [];
    let count = 0;
    promises.forEach((p, i) => {
      Promise.resolve(p).then(
        value => {
          results[i] = value;
          count++;
          if (count === promises.length) resolve(results);
        },
        reject
      );
    });
  });
}

// Q8: 实现红绿灯交换
function red() { console.log('red'); }
function yellow() { console.log('yellow'); }
function green() { console.log('green'); }

function light(fn, ms) {
  return new Promise(r => setTimeout(() => { fn(); r(); }, ms));
}

async function run() {
  while (true) {
    await light(red, 3000);
    await light(yellow, 2000);
    await light(green, 1000);
  }
}

// Q9: 数组扁平化
function flatten(arr, depth = 1) {
  if (depth <= 0) return arr;
  return arr.reduce((acc, val) => {
    return Array.isArray(val)
      ? acc.concat(flatten(val, depth - 1))
      : acc.concat(val);
  }, []);
}

// Q10: 函数节流
function throttle(fn, wait) {
  let timeout;
  return function(...args) {
    if (!timeout) {
      timeout = setTimeout(() => {
        timeout = null;
        fn.apply(this, args);
      }, wait);
    }
  };
}
```

---

## 十七、JavaScript 最佳实践

### 17.1 代码规范与风格

**参考答案：**

```javascript
// 1. 使用 const/let 代替 var
// const: 不变的引用
// let: 可变的引用
// var: 函数作用域（容易产生 bug）

// 2. 使用模板字符串
const name = 'Tom';
const greeting = `Hello, ${name}!`;

// 3. 解构赋值
const { name, age } = user;
const [first, second] = arr;

// 4. 箭头函数
const add = (a, b) => a + b;

// 5. 使用默认参数
function fn(a = 10, b = 20) {}

// 6. 使用展开运算符
const arr1 = [1, 2, 3];
const arr2 = [...arr1, 4, 5];

const obj1 = { a: 1 };
const obj2 = { ...obj1, b: 2 };

// 7. 使用可选链
const value = obj?.nested?.property;
const method = obj?.method?.();

// 8. 使用空值合并
const value = null ?? 'default';

// 9. 使用 async/await
async function fetchData() {
  try {
    const data = await fetch('/api');
    return data.json();
  } catch (err) {
    console.error(err);
  }
}

// 10. 使用 BigInt
const big = 9007199254740991n;

// 11. 使用 BigInt 安全整数
Number.isSafeInteger(9007199254740991);  // true
Number.isSafeInteger(9007199254740992n); // false
```

### 17.2 错误处理最佳实践

**参考答案：**

```javascript
// 1. try-catch
try {
  // 可能出错的代码
  const data = JSON.parse(jsonString);
} catch (err) {
  console.error('解析失败:', err.message);
} finally {
  // 无论成功失败都执行
  console.log('清理资源');
}

// 2. 异步错误处理
async function fetchData() {
  try {
    const response = await fetch('/api');
    const data = await response.json();
    return data;
  } catch (err) {
    console.error('请求失败:', err);
    throw err;
  }
}

// 3. Promise 错误处理
fetch('/api')
  .then(response => response.json())
  .catch(err => console.error(err));

// 4. window.onerror
window.onerror = (message, source, lineno, colno, error) => {
  console.error('全局错误:', message);
  return false;  // 不阻止默认错误处理
};

// 5. unhandledrejection
window.addEventListener('unhandledrejection', event => {
  console.error('未处理的 Promise 拒绝:', event.reason);
});

// 6. 自定义错误类
class AppError extends Error {
  constructor(message, code) {
    super(message);
    this.name = 'AppError';
    this.code = code;
  }
}

// 7. 错误边界（React）
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error(error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <div>Something went wrong.</div>;
    }
    return this.props.children;
  }
}

// 8. 验证函数
function validate(data, schema) {
  const errors = [];
  for (const [field, rules] of Object.entries(schema)) {
    if (rules.required && !data[field]) {
      errors.push(`${field} is required`);
    }
    if (rules.type && typeof data[field] !== rules.type) {
      errors.push(`${field} must be ${rules.type}`);
    }
  }
  return errors;
}
```

### 17.3 单元测试最佳实践

**参考答案：**

```javascript
// Jest 测试示例

// 1. 基础测试
describe('Array', () => {
  test('should add items', () => {
    const arr = [];
    arr.push(1);
    expect(arr).toEqual([1]);
  });

  test('should remove items', () => {
    const arr = [1, 2, 3];
    arr.pop();
    expect(arr).toEqual([1, 2]);
  });
});

// 2. 异步测试
test('async operation', async () => {
  const data = await fetchData();
  expect(data).toBeDefined();
});

// 3. 模拟函数
test('mock function', () => {
  const mockFn = jest.fn();
  mockFn.mockReturnValue('mock');

  const result = mockFn();
  expect(result).toBe('mock');
  expect(mockFn).toHaveBeenCalled();
});

// 4. 模拟模块
jest.mock('./api');
import { fetchUser } from './api';

// 5. 快照测试
test('snapshot', () => {
  const component = renderer.create(<App />);
  expect(component.toJSON()).toMatchSnapshot();
});

// 6. 覆盖率
// jest --coverage
```

---

## 附录

### 附录 A: ES6+ 新特性速查表

```javascript
// ES6 (ES2015)
const, let                    // 块级作用域
=>                             // 箭头函数
模板字符串                     // Template Literals
解构赋值                       // Destructuring
默认参数                       // Default Parameters
剩余参数                       // Rest Parameters
展开运算符                     // Spread Operator
类                             // Class
模块                           // Module (import/export)
Symbol                        // 新的原始类型
Promise                       // 异步解决方案
Map, Set                      // 新的数据结构
Proxy, Reflect               // 元编程
Iterator, for...of           // 迭代器

// ES7 (ES2016)
Array.prototype.includes     // 数组包含判断
幂运算符 **                   // Exponentiation Operator

// ES8 (ES7)
async/await                  // 异步语法糖
Object.values/entries       // 对象方法
String.prototype.padStart/padEnd  // 字符串填充
Object.getOwnPropertyDescriptors  // 属性描述符

// ES9 (ES2018)
async 迭代器                 // Async Iterator
Promise.prototype.finally    // finally 方法
对象展开运算符               // Object Rest/Spread

// ES10 (ES2019)
Array.prototype.flat/flatMap // 数组扁平化
Object.fromEntries          // 键值对转对象
String.prototype.trimStart/trimEnd  // 字符串 trim
可选捕获                     // Optional Catch Binding

// ES11 (ES2020)
?.                           // 可选链
??                            // 空值合并
BigInt                       // 大整数
Promise.allSettled          // Promise 方法
dynamic import              // 动态导入
globalThis                  // 全局对象

// ES12 (ES2021)
replaceAll                  // 字符串替换
Promise.any                 // Promise 方法
WeakRef                     // 弱引用
逻辑赋值运算符 ||= &&= ??=

// ES13 (ES2022)
static 块                   // 静态块
at()                        // 数组/字符串方法
Object.hasOwn              // 对象方法
Array.prototype.findLast   // 数组方法
```

### 附录 B: 常用工具函数库

```javascript
// 常用工具函数汇总

// 类型判断
const isType = (type) => (obj) => Object.prototype.toString.call(obj) === `[object ${type}]`;
const isArray = isType('Array');
const isObject = isType('Object');
const isString = isType('String');
const isNumber = isType('Number');
const isFunction = isType('Function');

// 防抖
const debounce = (fn, delay) => {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
};

// 节流
const throttle = (fn, delay) => {
  let last = 0;
  return (...args) => {
    const now = Date.now();
    if (now - last >= delay) {
      last = now;
      fn(...args);
    }
  };
};

// 深拷贝
const deepClone = (obj) => {
  if (obj === null || typeof obj !== 'object') return obj;
  if (obj instanceof Date) return new Date(obj);
  if (obj instanceof Array) return obj.map(deepClone);
  return Object.fromEntries(
    Object.entries(obj).map(([k, v]) => [k, deepClone(v)])
  );
};

// 格式化日期
const formatDate = (date, format = 'YYYY-MM-DD') => {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return format
    .replace('YYYY', year)
    .replace('MM', month)
    .replace('DD', day);
};

// 随机数
const random = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

// 数组去重
const unique = (arr) => [...new Set(arr)];

// 数组分块
const chunk = (arr, size) =>
  Array.from({ length: Math.ceil(arr.length / size) }, (_, i) =>
    arr.slice(i * size, i * size + size)
  );

// 随机打乱数组
const shuffle = (arr) => arr.sort(() => Math.random() - 0.5);

// 字符串脱敏
const mask = (str, start = 0, end = 0) => {
  if (str.length <= start + end) return str;
  return str.slice(0, start) + '*'.repeat(str.length - start - end) + str.slice(-end);
};
```

### 附录 C: 面试常考概念速记

```javascript
// 1. JavaScript 是单线程语言
// 2. 执行栈：后进先出
// 3. 事件循环：同步 → 微任务 → 渲染 → 宏任务

// 4. 闭包：函数能访问外部变量
// 5. 原型链：对象的继承机制
// 6. this 指向：最后调用它的对象

// 7. var 变量提升，let/const 暂时性死区
// 8. 箭头函数没有自己的 this/arguments
// 9. Promise 有三种状态：pending/fulfilled/rejected

// 10. 深拷贝要处理：循环引用、Date、RegExp、函数、Symbol
// 11. 防抖：最后一次触发后执行
// 12. 节流：固定时间间隔执行

// 13. 浏览器渲染：解析 → 样式 → 布局 → 绘制 → 合成
// 14. 重排：改变元素几何属性
// 15. 重绘：改变元素外观

// 16. Event Loop 浏览器：执行栈 → 微任务 → 渲染 → 宏任务
// 17. Event Loop Node：timers → pending → idle → poll → check → close

// 18. async/await 是 Promise 语法糖
// 19. await 会阻塞后面的代码，等待 Promise resolve
// 20. Promise.then 返回新的 Promise，支持链式调用
```

---

## 十八、执行上下文与调用栈深度解析

### 18.1 执行上下文完全指南

**参考答案：**

执行上下文（Execution Context）是 JavaScript 代码执行时的环境抽象概念。每当 JavaScript 代码运行时，都会创建一个执行上下文。理解执行上下文对于深入掌握 JavaScript 的运行机制至关重要。

```
┌─────────────────────────────────────────────────────────────────┐
│                      执行上下文类型                              │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │              全局执行上下文 (Global Context)             │    │
│  │   - 最外层的执行环境                                     │    │
│  │   - 创建全局对象 (window/global)                        │    │
│  │   - this 指向全局对象                                   │    │
│  │   - 代码加载时创建，整个程序生命周期存在                  │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                                                  │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │              函数执行上下文 (Function Context)           │    │
│  │   - 每次函数调用时创建                                   │    │
│  │   - 独立的作用域                                         │    │
│  │   - this指向取决于调用方式                              │    │
│  │   - 函数执行完毕后销毁                                   │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                                                  │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │           Eval执行上下文 (Eval Context)                 │    │
│  │   - eval()函数内部代码的执行环境                        │    │
│  │   - 不推荐使用，存在安全风险                             │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

**执行上下文的创建过程**：

执行上下文在创建时，会经过三个阶段：

```javascript
// 阶段 1：创建阶段 (Creation Phase)

// 创建词法环境 (Lexical Environment)
// 存储函数声明和变量声明 (let, const)
 lexicalEnvironment: {
   // 环境记录器
   EnvironmentRecord: {
     // 声明式环境记录：存储变量、函数、参数
     // 对象式环境记录：存储变量和函数（全局环境）
   },
   // 外部环境引用
   outer: <outerEnv> or null
 }

// 创建变量环境 (Variable Environment)
// 存储 var 声明的变量
 variableEnvironment: {
   EnvironmentRecord: {},
   outer: <outerEnv> or null
 }

// 确定 this 绑定
thisBinding: <Global Object> | <Object> | undefined
```

```javascript
// 阶段 2：执行阶段 (Execution Phase)

// 逐行执行代码
// 变量赋值和函数执行
// 词法环境求值
executionPhase: {
  // 代码执行
  // 变量赋值
  // 函数调用
}
```

**执行上下文栈（调用栈）示例**：

```javascript
// 执行上下文栈的演变过程

function foo() {
  console.log('foo');
  bar();  // 调用 bar
  console.log('foo end');
}

function bar() {
  console.log('bar');
  baz();  // 调用 baz
  console.log('bar end');
}

function baz() {
  console.log('baz');
}

console.log('start');
foo();
console.log('end');

/*
执行上下文栈的变化过程：

1. 全局上下文入栈
   ECStack: [global]

2. console.log('start') 执行

3. foo() 调用
   ECStack: [global, foo]

4. foo 内部 console.log('foo')

5. bar() 调用
   ECStack: [global, foo, bar]

6. bar 内部 console.log('bar')

7. baz() 调用
   ECStack: [global, foo, bar, baz]

8. baz 内部 console.log('baz')
   baz 执行完毕，出栈
   ECStack: [global, foo, bar]

9. bar 内部 console.log('bar end')
   bar 执行完毕，出栈
   ECStack: [global, foo]

10. foo 内部 console.log('foo end')
    foo 执行完毕，出栈
    ECStack: [global]

11. console.log('end') 执行

12. 全局上下文在页面关闭时出栈
*/
```

### 18.2 变量提升与函数提升详解

**参考答案：**

变量提升（Hoisting）和函数提升是 JavaScript 独特的执行机制，理解它们对于掌握代码执行顺序至关重要。

```
┌─────────────────────────────────────────────────────────────────┐
│                         提升机制                                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  提升规则：                                                     │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │  1. 函数声明：完全提升（函数名和函数体都提升）            │    │
│  │  2. var 变量：只提升声明，不提升赋值                      │    │
│  │  3. let/const：提升但不初始化，存在暂时性死区            │    │
│  │  4. 函数表达式：相当于变量提升（只提升变量名）            │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

**详细示例**：

```javascript
// 1. 函数提升 - 完全提升
console.log(add(1, 2));  // 3 - 函数声明可以先调用后定义

function add(a, b) {
  return a + b;
}

// 2. var 变量提升
console.log(x);  // undefined - 只提升声明，不提升赋值
var x = 5;
// 实际执行顺序：
// var x;
// console.log(x);  // undefined
// x = 5;

// 3. let/const 提升 - 暂时性死区
{
  console.log(y);  // ReferenceError - 暂时性死区
  let y = 10;
}

// 4. 函数表达式
console.log(fn);  // undefined
fn();  // TypeError: fn is not a function
var fn = function() {
  console.log('fn');
};

// 5. 函数声明 vs 函数表达式优先级
console.log(typeof foo);  // function
console.log(typeof bar);  // undefined

function foo() { return 'foo'; }
var bar = function() { return 'bar'; };

// 6. 重复声明的处理
var a = 1;
var a;  // 不会覆盖，var 重复声明会被忽略
console.log(a);  // 1

let b = 1;
let b;  // SyntaxError: Duplicate declaration
```

**理解暂时性死区（TDZ）**：

```javascript
// 暂时性死区示例

function testTDZ() {
  // 这里的 a 已经在作用域内，但未初始化
  // 访问会抛出 ReferenceError
  console.log(a);  // ReferenceError: Cannot access 'a' before initialization

  let a = ' TDZ ';
  console.log(a);  // ' TDZ '
}

// typeof 操作符的安全性例外
console.log(typeof undefinedVar);  // 'undefined' - 安全的
console.log(typeof letVar);  // 在 TDZ 中会报错

let letVar = 'test';
```

### 18.3 作用域与执行上下文的关系

**参考答案：**

作用域和执行上下文虽然相关，但它们是不同的概念：

```javascript
// 作用域 vs 执行上下文

/*
作用域（Scope）：
- 词法作用域，由代码编写时的位置决定
- 定义时确定，不随调用改变
- 多个

执行上下文（Execution Context）：
- 代码执行时的环境
- 运行时确定，随调用改变
- 多个，但同时只有一个在执行
*/

// 词法作用域示例
const x = 10;

function outer() {
  const y = 20;

  function inner() {
    const z = 30;
    console.log(x + y + z);  // 60
    // inner 可以访问 outer 的变量
  }

  inner();
}

outer();

// 动态作用域（JavaScript 不支持，这里仅作对比）
// 如果是动态作用域，inner 可以访问调用者的变量
```

**闭包与作用域链**：

```javascript
// 闭包创建新的作用域
function createCounter() {
  let count = 0;  // 闭包外的变量

  return {
    increment() {
      count++;
      return count;
    },
    decrement() {
      count--;
      return count;
    },
    getCount() {
      return count;
    }
  };
}

const counter = createCounter();
console.log(counter.increment());  // 1
console.log(counter.increment());  // 2
console.log(counter.getCount());   // 2
console.log(counter.decrement());  // 1

/*
作用域链结构：
innerFunctionScope
    │
    ▼
createCounterScope (闭包)
    │
    ▼
globalScope
*/
```

---

## 十九、事件循环完整解析

### 19.1 浏览器事件循环详解

**参考答案：**

浏览器的事件循环（Event Loop）是 JavaScript 实现异步编程的核心机制。理解事件循环对于编写高性能的 JavaScript 代码至关重要。

```
┌─────────────────────────────────────────────────────────────────┐
│                    浏览器 Event Loop 完整流程                    │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│   ┌────────────────────────────────────────────────────────┐     │
│   │                    主线程 (Main Thread)                 │     │
│   │                                                         │     │
│   │   ┌──────────────────────────────────────────────────┐  │     │
│   │   │              执行栈 (Call Stack)                 │  │     │
│   │   │                                                  │  │     │
│   │   │  执行: 同步代码 → 微任务 → 渲染 → 宏任务         │  │     │
│   │   │                                                  │  │     │
│   │   └──────────────────────────────────────────────────┘  │     │
│   │                          │                               │     │
│   │                          ▼                               │     │
│   │   ┌──────────────────────────────────────────────────┐  │     │
│   │   │                  Web APIs                          │  │     │
│   │   │  setTimeout | setInterval | DOM | fetch | ...     │  │     │
│   │   └──────────────────────────────────────────────────┘  │     │
│   └────────────────────────────────────────────────────────┘     │
│                              │                                   │
│                              ▼                                   │
│   ┌────────────────────────────────────────────────────────┐     │
│   │              任务队列 (Task Queue / Macrotask)        │     │
│   │   ┌────────────┐  ┌────────────┐  ┌────────────┐      │     │
│   │   │ Queue 1   │  │ Queue 2    │  │ Queue 3    │      │     │
│   │   │ setTimeout│  │ I/O        │  │ UI Render  │      │     │
│   │   └────────────┘  └────────────┘  └────────────┘      │     │
│   └────────────────────────────────────────────────────────┘     │
│                              │                                   │
│                              ▼                                   │
│   ┌────────────────────────────────────────────────────────┐     │
│   │              微任务队列 (MicroTask Queue)             │     │
│   │   ┌────────────┐  ┌────────────┐  ┌────────────┐      │     │
│   │   │ Promise    │  │ Mutation   │  │ queue      │      │     │
│   │   │ .then()    │  │ Observer   │  │ Microtask  │      │     │
│   │   └────────────┘  └────────────┘  └────────────┘      │     │
│   └────────────────────────────────────────────────────────┘     │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

**事件循环的执行顺序**：

```javascript
// 事件循环执行顺序详解

console.log('1. 同步代码开始');

// 宏任务
setTimeout(() => {
  console.log('2. setTimeout - 宏任务');
}, 0);

// 微任务
Promise.resolve().then(() => {
  console.log('3. Promise - 微任务');
});

// 同步代码
console.log('4. 同步代码结束');

/*
执行结果：
1. 同步代码开始
4. 同步代码结束
3. Promise - 微任务
2. setTimeout - 宏任务

原因：
1. 同步代码立即执行
2. 主线程空闲时，先清空所有微任务
3. 然后执行一个宏任务
4. 完成后再次清空微任务
5. 循环往复
*/
```

**多个微任务的执行**：

```javascript
// 微任务队列会完全清空

Promise.resolve()
  .then(() => console.log('microtask 1'))
  .then(() => console.log('microtask 2'))
  .then(() => console.log('microtask 3'));

Promise.resolve()
  .then(() => console.log('microtask 4'));

setTimeout(() => console.log('macrotask'), 0);

/*
执行结果：
microtask 1
microtask 2
microtask 3
microtask 4
macrotask

原因：所有微任务会在下一个宏任务之前全部执行完毕
*/
```

### 19.2 微任务与宏任务的深度理解

**参考答案：**

微任务和宏任务的区分是理解事件循环的关键：

```javascript
// 微任务 (Microtasks)
const microtasks = [
  // Promise 回调
  Promise.then(),
  Promise.catch(),
  Promise.finally(),

  // MutationObserver
  new MutationObserver(callback),

  // queueMicrotask
  queueMicrotask(() => {}),

  // async/await (底层是 Promise)
  async function() { await ... },

  // process.nextTick (Node.js)
  process.nextTick(() => {}),  // Node.js 特有
];

// 宏任务 (Macrotasks)
const macrotasks = [
  // 定时器
  setTimeout(),
  setInterval(),
  setImmediate(),  // Node.js

  // UI 渲染
  requestAnimationFrame(),

  // I/O 操作
  readFile(),
  writeFile(),

  // UI 事件
  click(),
  scroll(),

  // script 整体
  <script>...</script>
];
```

**setTimeout 0 的实际延迟**：

```javascript
// setTimeout 0 并不等于立即执行

setTimeout(() => console.log('timeout'), 0);

// 实际上至少有 4ms 延迟（浏览器优化）
// 这是因为：
// 1. 浏览器会合并多个 setTimeout
// 2. 最小延迟时间为 4ms
// 3. 需要等待主线程空闲

// 实际上更准确的执行时机
console.log('start');

setTimeout(() => {
  console.log('timeout 1');
}, 0);

Promise.resolve().then(() => {
  console.log('promise');
});

console.log('end');

// 输出：
// start
// end
// promise
// timeout 1
```

**requestAnimationFrame 的执行时机**：

```javascript
// requestAnimationFrame 在渲染前执行

console.log('1. 同步');

requestAnimationFrame(() => {
  console.log('2. requestAnimationFrame');
});

Promise.resolve().then(() => {
  console.log('3. promise');
});

setTimeout(() => {
  console.log('4. setTimeout');
}, 0);

console.log('5. 同步结束');

/*
执行顺序（浏览器）：
1. 同步
5. 同步结束
3. promise
4. setTimeout
2. requestAnimationFrame

注意：requestAnimationFrame 会在下一次渲染前执行
*/
```

### 19.3 Node.js 事件循环与浏览器区别

**参考答案：**

Node.js 的事件循环与浏览器有显著区别：

```
┌─────────────────────────────────────────────────────────────────┐
│                    Node.js Event Loop 详解                      │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│   ┌───────────────────────────────────────────────────────┐      │
│   │                     Timers Phase                       │      │
│   │   setTimeout, setInterval                              │      │
│   │   回调函数会在指定时间后执行                            │      │
│   └───────────────────────┬───────────────────────────────┘      │
│                           ▼                                      │
│   ┌───────────────────────────────────────────────────────┐      │
│   │                  Pending Callbacks                    │      │
│   │   处理上一轮未执行的 I/O 回调                          │      │
│   └───────────────────────┬───────────────────────────────┘      │
│                           ▼                                      │
│   ┌───────────────────────────────────────────────────────┐      │
│   │                    Idle, Prepare                       │      │
│   │   libuv 内部使用                                       │      │
│   └───────────────────────┬───────────────────────────────┘      │
│                           ▼                                      │
│   ┌───────────────────────────────────────────────────────┐      │
│   │                      Poll Phase                       │      │
│   │   处理 I/O 操作（文件、网络）                           │      │
│   │   如果没有回调，会阻塞等待                              │      │
│   └───────────────────────┬───────────────────────────────┘      │
│                           ▼                                      │
│   ┌───────────────────────────────────────────────────────┐      │
│   │                      Check Phase                      │      │
│   │   setImmediate 的回调在这里执行                        │      │
│   └───────────────────────┬───────────────────────────────┘      │
│                           ▼                                      │
│   ┌───────────────────────────────────────────────────────┐      │
│   │                   Close Callbacks                      │      │
│   │   关闭的 socket 回调                                   │      │
│   └───────────────────────────────────────────────────────┘      │
│                                                                  │
│   ┌───────────────────────────────────────────────────────┐      │
│   │                   微任务队列                          │      │
│   │   1. process.nextTick (最高优先级)                    │      │
│   │   2. Promise 微任务                                   │      │
│   └───────────────────────────────────────────────────────┘      │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

**浏览器与 Node.js 事件循环的区别**：

```javascript
// 1. setTimeout vs setImmediate 执行顺序

// 在 Node.js 中
setTimeout(() => console.log('timeout'), 0);
setImmediate(() => console.log('immediate'));

/*
结果可能是：
timeout, immediate
或
immediate, timeout

这取决于系统当时的执行状态
*/

// 2. process.nextTick vs Promise

Promise.resolve().then(() => console.log('promise'));
process.nextTick(() => console.log('nextTick'));

/*
Node.js 执行结果：
nextTick
promise

原因：process.nextTick 优先级高于 Promise 微任务
*/

// 3. I/O 操作的执行时机
const fs = require('fs');

fs.readFile(__filename, () => {
  console.log('I/O callback');
});

setTimeout(() => console.log('timeout'), 0);

/*
在 Node.js 中：
如果 I/O 操作在事件循环开始前完成，I/O 回调可能在 timeout 之前执行
*/
```

**Node.js 事件循环示例**：

```javascript
// Node.js 事件循环完整示例

const fs = require('fs');
const { promisify } = require('util');
const readFile = promisify(fs.readFile);

// 同步代码
console.log('1. 同步代码');

// setTimeout
setTimeout(() => {
  console.log('2. setTimeout - Timers Phase');
}, 0);

setImmediate(() => {
  console.log('3. setImmediate - Check Phase');
});

// 微任务
Promise.resolve().then(() => {
  console.log('4. Promise - Microtask');
});

process.nextTick(() => {
  console.log('5. process.nextTick - Microtask');
});

// I/O 操作
fs.readFile(__filename, () => {
  console.log('6. I/O callback - Poll Phase');
});

console.log('7. 同步代码结束');

/*
Node.js 执行结果：
1. 同步代码
7. 同步代码结束
5. process.nextTick
4. Promise
2. setTimeout 或 3. setImmediate (顺序不固定)
6. I/O callback
*/
```

---

## 二十、闭包深入理解与实际应用

### 20.1 闭包原理深度解析

**参考答案：**

闭包是 JavaScript 最强大的特性之一。理解闭包的原理对于进阶 JavaScript 开发至关重要。

```
┌─────────────────────────────────────────────────────────────────┐
│                         闭包原理                                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  闭包定义：函数与其外部作用域（词法环境）的引用组合                 │
│                                                                  │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │                   函数创建时的作用域                      │    │
│  │                                                          │    │
│  │   function outer() {                                     │    │
│  │     let count = 0;  ◄── 外部变量                         │    │
│  │                                                          │    │
│  │     return function inner() {  ◄── 闭包函数              │    │
│  │       count++;                                           │    │
│  │       return count;                                      │    │
│  │     };                                                   │    │
│  │   }                                                      │    │
│  │                                                          │    │
│  │   const fn = outer();  ◄── outer 执行完毕               │    │
│  │   fn();  // 1     ◄── count 仍在内存中                   │    │
│  │   fn();  // 2                                            │    │
│  │                                                          │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                                                  │
│  闭包包含：                                                     │
│  - 内部函数                                                     │
│  - 外部函数的变量                                               │
│  - 外部函数的执行环境                                           │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

**闭包的内存模型**：

```javascript
// 闭包内存结构详解

function createPerson(name) {
  // 这个变量会被闭包引用
  let age = 0;

  // 返回的方法形成闭包
  return {
    getName() {
      return name;  // 闭包引用 name
    },
    getAge() {
      return age;  // 闭包引用 age
    },
    setAge(value) {
      age = value;  // 闭包引用 age
    }
  };
}

const person = createPerson('Tom');

/*
内存结构：
┌─────────────────────────────────────────────┐
│            createPerson 执行上下文           │
│  ┌─────────────────────────────────────┐    │
│  │  name: 'Tom'                        │    │
│  │  age: 0                             │    │
│  └─────────────────────────────────────┘    │
│                    ▲                         │
│                    │ 闭包引用                 │
└────────────────────┼─────────────────────────┘
                     │
┌────────────────────┼─────────────────────────┐
│                    │                         │
│  person 对象       │                         │
│  ┌─────────────────────────────────────┐    │
│  │  getName: ──────────────────────────┼────┼──► 闭包
│  │  getAge:  ──────────────────────────┼────│
│  │  setAge:  ──────────────────────────┼────│
│  └─────────────────────────────────────┘    │
│                                              │
└──────────────────────────────────────────────┘
*/
```

### 20.2 闭包经典面试题详解

**参考答案：**

**题目一：循环中的闭包**：

```javascript
// 经典面试题：循环与闭包
for (var i = 0; i < 5; i++) {
  setTimeout(() => {
    console.log(i);
  }, 100);
}
// 输出：5, 5, 5, 5, 5

/*
原因分析：
1. var i 是函数作用域，不是块级作用域
2. setTimeout 是异步的，循环结束后才执行
3. 循环结束时 i = 5
4. 所有 setTimeout 回调访问的都是同一个 i
*/

// 解决方案 1：使用 let
for (let i = 0; i < 5; i++) {
  setTimeout(() => {
    console.log(i);
  }, 100);
}
// 输出：0, 1, 2, 3, 4

/*
原因：let 在块级作用域内，每次循环创建新的 i
*/

// 解决方案 2：使用闭包（IIFE）
for (var i = 0; i < 5; i++) {
  ((j) => {
    setTimeout(() => {
      console.log(j);
    }, 100);
  })(i);
}
// 输出：0, 1, 2, 3, 4

// 解决方案 3：使用 bind
for (var i = 0; i < 5; i++) {
  setTimeout(console.log.bind(null, i), 100);
}
// 输出：0, 1, 2, 3, 4

// 解决方案 4：使用数组
for (var i = 0; i < 5; i++) {
  var tasks = [];
  tasks[i] = () => console.log(i);
}
tasks.forEach(task => setTimeout(task, 100));
```

**题目二：闭包与 this 指向**：

```javascript
// 闭包中的 this 指向问题
const obj = {
  name: 'obj',
  fn() {
    // 这里的 this 指向 obj
    const that = this;

    return function() {
      // 这里的 this 指向 window
      // 但我们可以通过 that 访问 obj
      console.log(that.name);
    };
  }
};

obj.fn()();  // 'obj'

// 使用箭头函数解决
const obj2 = {
  name: 'obj2',
  fn() {
    return () => {
      // 箭头函数继承外层的 this
      console.log(this.name);
    };
  }
};

obj2.fn()();  // 'obj2'
```

**题目三：闭包计数器**：

```javascript
// 实现一个计数器
function createCounter() {
  let count = 0;

  return {
    increment() {
      return ++count;
    },
    decrement() {
      return --count;
    },
    getCount() {
      return count;
    }
  };
}

const counter = createCounter();
console.log(counter.increment());  // 1
console.log(counter.increment());  // 2
console.log(counter.decrement());  // 1

// 多个计数器独立
const counter2 = createCounter();
console.log(counter2.getCount());  // 0
```

**题目四：函数节流**：

```javascript
// 使用闭包实现节流
function throttle(fn, delay) {
  let lastTime = 0;

  return function(...args) {
    const now = Date.now();
    if (now - lastTime >= delay) {
      lastTime = now;
      fn.apply(this, args);
    }
  };
}

// 使用示例
const handleScroll = throttle(() => {
  console.log('Scroll event');
}, 100);

window.addEventListener('scroll', handleScroll);
```

**题目五：函数防抖**：

```javascript
// 使用闭包实现防抖
function debounce(fn, delay) {
  let timer = null;

  return function(...args) {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      fn.apply(this, args);
    }, delay);
  };
}

// 使用示例
const handleInput = debounce((value) => {
  console.log('Search:', value);
}, 300);

document.getElementById('input').addEventListener('input', (e) => {
  handleInput(e.target.value);
});
```

### 20.3 闭包在实际开发中的应用

**参考答案：**

**应用一：数据私有化**：

```javascript
// 封装私有变量
function createBankAccount(initialBalance) {
  let balance = initialBalance;

  return {
    deposit(amount) {
      if (amount <= 0) throw new Error('Invalid amount');
      balance += amount;
      return balance;
    },
    withdraw(amount) {
      if (amount > balance) throw new Error('Insufficient funds');
      balance -= amount;
      return balance;
    },
    getBalance() {
      return balance;
    }
  };
}

const account = createBankAccount(1000);
account.deposit(500);  // 1500
account.withdraw(200);  // 1300
console.log(account.getBalance());  // 1300

// 外部无法直接访问 balance
// console.log(account.balance);  // undefined
```

**应用二：函数柯里化**：

```javascript
// 柯里化函数
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

// 使用柯里化
function multiply(a, b, c) {
  return a * b * c;
}

const curriedMultiply = curry(multiply);
console.log(curriedMultiply(2)(3)(4));  // 24
console.log(curriedMultiply(2, 3)(4));  // 24
console.log(curriedMultiply(2, 3, 4));  // 24

// 实际应用：创建特定功能的函数
const multiplyBy2 = curry(multiply)(2);
console.log(multiplyBy2(3, 4));  // 24
```

**应用三：偏函数**：

```javascript
// 偏函数：固定部分参数
function partial(fn, ...presetArgs) {
  return function(...laterArgs) {
    return fn(...presetArgs, ...laterArgs);
  };
}

// 使用
function formatCurrency(symbol, locale, value) {
  return symbol + value.toFixed(2);
}

const formatUSD = partial(formatCurrency, '$', 'en-US');
const formatCNY = partial(formatCurrency, '¥', 'zh-CN');

console.log(formatUSD(100));  // $100.00
console.log(formatCNY(100));  // ¥100.00
```

**应用四：记忆化**：

```javascript
// 函数记忆化
function memoize(fn) {
  const cache = new Map();

  return function(...args) {
    const key = JSON.stringify(args);
    if (cache.has(key)) {
      return cache.get(key);
    }

    const result = fn.apply(this, args);
    cache.set(key, result);
    return result;
  };
}

// 使用
const fibonacci = memoize(function(n) {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
});

console.log(fibonacci(40));  // 102334155
// 没有记忆化会非常慢
```

---

## 二十一、原型与原型链深度解析

### 21.1 原型链完整图解

**参考答案：**

原型链是 JavaScript 实现继承的核心机制。理解原型链对于掌握 JavaScript 面向对象编程至关重要。

```
┌─────────────────────────────────────────────────────────────────┐
│                         原型链完整图解                           │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │                    Object.prototype                        │ │
│  │  ┌─────────────────────────────────────────────────────┐  │ │
│  │  │  toString(): '[object Object]'                     │  │ │
│  │  │  valueOf(): [object Object]                        │  │ │
│  │  │  hasOwnProperty(): boolean                          │  │ │
│  │  │  isPrototypeOf(): boolean                          │  │ │
│  │  │  propertyIsEnumerable(): boolean                   │  │ │
│  │  │  toLocaleString(): '[object Object]'              │  │ │
│  │  └─────────────────────────────────────────────────────┘  │ │
│  │                           ▲                                 │ │
│  │                           │ [[Prototype]]                   │ │
│  └───────────────────────────┼─────────────────────────────────┘ │
│                              │                                  │
│  ┌───────────────────────────┼─────────────────────────────────┐ │
│  │                    Function.prototype                      │ │
│  │  ┌─────────────────────────────────────────────────────┐  │ │
│  │  │  call(): 调用函数                                    │  │ │
│  │  │  apply(): 应用函数                                  │  │ │
│  │  │  bind(): 绑定 this                                  │  │ │
│  │  │  constructor: Function                             │  │ │
│  │  └─────────────────────────────────────────────────────┘  │ │
│  │                           ▲                                 │ │
│  │                           │ [[Prototype]]                   │ │
│  └───────────────────────────┼─────────────────────────────────┘ │
│                              │                                  │
│  ┌───────────────────────────┼─────────────────────────────────┐ │
│  │                   Person.prototype                         │ │
│  │  ┌─────────────────────────────────────────────────────┐  │ │
│  │  │  constructor: Person                                │  │ │
│  │  │  sayName(): 'My name is ...'                       │  │ │
│  │  └─────────────────────────────────────────────────────┘  │ │
│  │                           ▲                                 │ │
│  │                           │ [[Prototype]]                   │ │
│  └───────────────────────────┼─────────────────────────────────┘ │
│                              │                                  │
│  ┌───────────────────────────┼─────────────────────────────────┐ │
│  │                      person 实例对象                       │ │
│  │  ┌─────────────────────────────────────────────────────┐  │ │
│  │  │  name: 'Tom'                                        │  │ │
│  │  │  age: 18                                            │  │ │
│  │  │  __proto__: Person.prototype                       │  │ │
│  │  └─────────────────────────────────────────────────────┘  │ │
│  └────────────────────────────────────────────────────────────┘ │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

**原型链查找过程**：

```javascript
// 原型链查找示例
function Person(name, age) {
  this.name = name;
  this.age = age;
}

Person.prototype.sayName = function() {
  return `My name is ${this.name}`;
};

Person.prototype.job = 'Engineer';

const person = new Person('Tom', 18);

// 属性查找顺序
console.log(person.name);  // 'Tom' - 自身属性
console.log(person.age);  // 18 - 自身属性

console.log(person.sayName());  // 'My name is Tom' - 原型方法
console.log(person.job);  // 'Engineer' - 原型属性

console.log(person.toString());  // '[object Object]' - Object.prototype

console.log(person.hasOwnProperty('name'));  // true
console.log(person.hasOwnProperty('job'));  // false - 原型属性
```

### 21.2 原型继承的完整实现

**参考答案：**

**方式一：原型链继承**：

```javascript
// 原型链继承
function Animal(name) {
  this.name = name;
  this.colors = ['black', 'white'];
}

Animal.prototype.speak = function() {
  return `${this.name} makes a sound`;
};

function Dog(name) {
  this.name = name;
}

// 原型链继承
Dog.prototype = new Animal();
Dog.prototype.constructor = Dog;

// 添加子类特有方法
Dog.prototype.bark = function() {
  return `${this.name} barks`;
};

const dog = new Dog('Buddy');
console.log(dog.name);  // 'Buddy'
console.log(dog.speak());  // 'Buddy makes a sound'
console.log(dog.bark());  // 'Buddy barks'

/*
原型链继承的缺点：
1. 引用类型的属性会被所有实例共享
2. 无法向父类构造函数传参
*/

// 问题示例
const dog1 = new Dog('Dog1');
const dog2 = new Dog('Dog2');
dog1.colors.push('brown');

console.log(dog1.colors);  // ['black', 'white', 'brown']
console.log(dog2.colors);  // ['black', 'white', 'brown']
// 问题：colors 被所有实例共享
```

**方式二：构造函数继承（经典继承）**：

```javascript
// 构造函数继承
function Animal(name) {
  this.name = name;
  this.colors = ['black', 'white'];
}

Animal.prototype.speak = function() {
  return `${this.name} makes a sound`;
};

function Cat(name, age) {
  // 借用父类构造函数
  Animal.call(this, name);
  this.age = age;
}

const cat = new Cat('Whiskers', 3);

console.log(cat.name);  // 'Whiskers'
console.log(cat.age);  // 3
console.log(cat.colors);  // ['black', 'white']
// console.log(cat.speak());  // Error - 原型方法未继承

/*
构造函数继承的优点：
1. 引用类型的属性不共享
2. 可以向父类传参

缺点：
1. 方法没有继承（只有属性继承）
2. 方法定义在构造函数内，每次创建实例都会重新创建方法
*/
```

**方式三：组合继承**：

```javascript
// 组合继承（最常用）
function Animal(name) {
  this.name = name;
  this.colors = ['black', 'white'];
}

Animal.prototype.speak = function() {
  return `${this.name} makes a sound`;
};

function Dog(name, breed) {
  // 构造函数继承 - 继承属性
  Animal.call(this, name);
  this.breed = breed;
}

// 原型链继承 - 继承方法
Dog.prototype = new Animal();
Dog.prototype.constructor = Dog;

// 添加子类方法
Dog.prototype.bark = function() {
  return `${this.name} barks`;
};

const dog = new Dog('Buddy', 'Golden Retriever');

console.log(dog.name);  // 'Buddy'
console.log(dog.breed);  // 'Golden Retriever'
console.log(dog.speak());  // 'Buddy makes a sound'
console.log(dog.bark());  // 'Buddy barks'

// 引用类型不共享
const dog1 = new Dog('Dog1');
const dog2 = new Dog('Dog2');
dog1.colors.push('brown');

console.log(dog1.colors);  // ['black', 'white', 'brown']
console.log(dog2.colors);  // ['black', 'white']

/*
组合继承的优点：
1. 属性独立
2. 方法共享（不重复创建）
3. 可以向父类传参

缺点：
1. 调用了两次父类构造函数
2. 原型中有父类的属性（冗余）
*/
```

**方式四：寄生式继承**：

```javascript
// 寄生式继承
function createAnimal(animal) {
  // 创建对象
  const clone = Object.create(animal);

  // 增强对象
  clone.speak = function() {
    return `${this.name} makes a sound`;
  };

  return clone;
}

const animal = {
  name: 'Animal',
  colors: ['black', 'white']
};

const dog = createAnimal(animal);
dog.name = 'Buddy';

console.log(dog.name);  // 'Buddy'
console.log(dog.colors);  // ['black', 'white']
console.log(dog.speak());  // 'Buddy makes a sound'

/*
寄生式继承的优点：
1. 创建对象简单

缺点：
1. 方法不能复用（每次创建都创建新方法）
2. 引用类型仍然共享
*/
```

**方式五：寄生组合继承（最优）**：

```javascript
// 寄生组合继承（最优方案）
function inherit(subClass, superClass) {
  // 创建父类原型的副本
  const prototype = Object.create(superClass.prototype);

  // 修正 constructor
  prototype.constructor = subClass;

  // 设置子类原型
  subClass.prototype = prototype;
}

function Animal(name) {
  this.name = name;
  this.colors = ['black', 'white'];
}

Animal.prototype.speak = function() {
  return `${this.name} makes a sound`;
};

function Dog(name, breed) {
  Animal.call(this, name);
  this.breed = breed;
}

// 使用寄生组合继承
inherit(Dog, Animal);

Dog.prototype.bark = function() {
  return `${this.name} barks`;
};

const dog = new Dog('Buddy', 'Golden Retriever');

console.log(dog.name);  // 'Buddy'
console.log(dog.breed);  // 'Golden Retriever'
console.log(dog.speak());  // 'Buddy makes a sound'
console.log(dog.bark());  // 'Buddy barks'

// 验证原型链
console.log(dog instanceof Dog);  // true
console.log(dog instanceof Animal);  // true
console.log(dog instanceof Object);  // true

/*
寄生组合继承的优点：
1. 只调用一次父类构造函数
2. 原型干净（没有多余属性）
3. 原型链完整

缺点：
1. 代码稍复杂
*/
```

### 21.3 ES6 Class 继承

**参考答案：**

ES6 提供了 class 关键字，使继承更加直观：

```javascript
// ES6 Class 继承
class Animal {
  constructor(name) {
    this.name = name;
    this.colors = ['black', 'white'];
  }

  speak() {
    return `${this.name} makes a sound`;
  }

  static create(name) {
    return new Animal(name);
  }
}

class Dog extends Animal {
  constructor(name, breed) {
    // 必须先调用 super
    super(name);
    this.breed = breed;
  }

  speak() {
    // 重写父类方法
    return `${this.name} barks`;
  }

  // 新方法
  fetch() {
    return `${this.name} fetches the ball`;
  }
}

const dog = new Dog('Buddy', 'Golden Retriever');

console.log(dog.name);  // 'Buddy'
console.log(dog.breed);  // 'Golden Retriever'
console.log(dog.speak());  // 'Buddy barks'
console.log(dog.fetch());  // 'Buddy fetches the ball'

// 静态方法继承
const animal = Animal.create('Animal');
console.log(animal.name);  // 'Animal'

/*
Class 继承的原理：
1. extends 关键字自动设置原型
2. super() 调用父类构造函数
3. static 方法也会被继承
*/
```

**Class 继承的原理**：

```javascript
// Class 继承的底层原理

class Animal {
  constructor(name) {
    this.name = name;
  }
}

// 底层实现类似于：
function Animal(name) {
  this.name = name;
}
Animal.prototype.speak = function() {};

// Dog 继承 Animal
class Dog extends Animal {
  constructor(name, breed) {
    super(name);
    this.breed = breed;
  }
}

// 底层实现：
/*
function Dog(name, breed) {
  Animal.call(this, name);
  this.breed = breed;
}

// 原型继承
Dog.prototype = Object.create(Animal.prototype);
Dog.prototype.constructor = Dog;
*/

// 验证
console.log(Dog.prototype.__proto__ === Animal.prototype);  // true
console.log(dog instanceof Dog);  // true
console.log(dog instanceof Animal);  // true
```

---

## 二十二、异步编程深度理解

### 22.1 Promise 状态与then详解

**参考答案：**

Promise 是 JavaScript 异步编程的基础，理解其内部机制至关重要。

```
┌─────────────────────────────────────────────────────────────────┐
│                      Promise 状态机                             │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│   ┌─────────┐                                                   │
│   │ pending │ ◄─────────────────────────┐                      │
│   │  初始   │                           │                      │
│   └────┬────┘                           │                      │
│        │                                │                      │
│        │ resolve()                      │ reject()             │
│        ▼                                ▼                      │
│   ┌──────────┐                    ┌──────────┐                 │
│   │fulfilled │                    │ rejected │                 │
│   │  已完成   │                    │  已拒绝   │                 │
│   └──────────┘                    └──────────┘                 │
│        │                                │                      │
│        │ .then(onFulfilled)              │ .then(onRejected)    │
│        │ .catch(onRejected)              │ .catch(onRejected)    │
│        ▼                                ▼                      │
│   ┌──────────────────────────────────────────┐                 │
│   │              执行回调函数                  │                 │
│   └──────────────────────────────────────────┘                 │
│                                                                  │
│   ┌──────────────────────────────────────────┐                 │
│   │            Promise 状态特点               │                 │
│   │  1. 初始状态为 pending                    │                 │
│   │  2. 状态只能从 pending 变为 fulfilled     │                 │
│   │  3. 状态只能从 pending 变为 rejected      │                 │
│   │  4. 一旦状态改变，不可再次改变             │                 │
│   │  5. 状态改变后，后续的 then 会立即执行    │                 │
│   └──────────────────────────────────────────┘                 │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

**Promise 状态转换示例**：

```javascript
// Promise 状态示例
const promise = new Promise((resolve, reject) => {
  // 初始状态：pending
  console.log('Promise started');

  setTimeout(() => {
    const success = true;
    if (success) {
      resolve('Success!');
    } else {
      reject('Error!');
    }
  }, 1000);
});

console.log('After Promise created');

promise
  .then(result => {
    console.log('Fulfilled:', result);  // 'Success!'
    return 'Second success';
  })
  .then(result => {
    console.log('Chain:', result);  // 'Second success'
  })
  .catch(error => {
    console.log('Rejected:', error);
  });

/*
执行顺序：
1. Promise started
2. After Promise created
3. (1秒后) Fulfilled: Success!
4. Chain: Second success
*/
```

**then 方法的返回值**：

```javascript
// then 方法总是返回新的 Promise

const promise1 = Promise.resolve(1);

const promise2 = promise1.then(x => {
  return x + 1;  // 返回值作为下一个 Promise 的 resolved 值
});

promise2.then(x => {
  console.log(x);  // 2
});

// then 中返回 Promise
const promise3 = Promise.resolve(1);
const promise4 = promise3.then(x => {
  return Promise.resolve(x + 1);  // 返回 Promise
});

promise4.then(x => {
  console.log(x);  // 2 - Promise 会被展开
});

// then 中抛出错误
const promise5 = Promise.resolve(1);
const promise6 = promise5.then(x => {
  throw new Error('Error in then');  // 抛出错误
});

promise6.catch(error => {
  console.log(error.message);  // 'Error in then'
});
```

### 22.2 async/await 原理详解

**参考答案：**

async/await 是 Promise 的语法糖，使异步代码看起来像同步代码：

```javascript
// async 函数的基本用法

// async 函数总是返回 Promise
async function fetchData() {
  return 'data';
}

// 等同于
function fetchData() {
  return Promise.resolve('data');
}

fetchData().then(console.log);  // 'data'

// await 暂停执行，等待 Promise 完成
async function process() {
  const result = await Promise.resolve('Hello');
  console.log(result);  // 'Hello'
  return result;
}

// async/await 的错误处理
async function fetchWithError() {
  try {
    const response = await fetch('/api/data');
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}
```

**async/await 的执行流程**：

```javascript
// async/await 执行流程详解

async function example() {
  console.log('1. Start');

  const result1 = await Promise.resolve('2. First await');
  console.log(result1);

  const result2 = await new Promise(resolve => {
    setTimeout(() => resolve('3. Second await'), 100);
  });
  console.log(result2);

  console.log('4. End');
}

/*
执行流程：
1. 调用 example()，创建 Promise
2. 同步代码 console.log('1. Start') 执行
3. 遇到 await，暂停函数执行，返回 Promise
4. 等待 await 的 Promise resolve
5. Promise resolve 后，恢复函数执行
6. 继续执行后续代码

相当于：
function example() {
  return new Promise(resolve => {
    console.log('1. Start');

    Promise.resolve().then(() => {
      const result1 = '2. First await';
      console.log(result1);

      return new Promise(resolve => {
        setTimeout(() => {
          const result2 = '3. Second await';
          console.log(result2);

          console.log('4. End');
          resolve();
        }, 100);
      });
    });
  });
}
*/
```

**async/await 并发执行**：

```javascript
// 串行执行（错误方式）
async function serial() {
  const start = Date.now();

  const user = await fetchUser();  // 1秒
  const posts = await fetchPosts();  // 1秒

  console.log(Date.now() - start);  // 约2秒
}

// 并行执行（正确方式）
async function parallel() {
  const start = Date.now();

  const [user, posts] = await Promise.all([
    fetchUser(),   // 1秒
    fetchPosts()   // 1秒（并行）
  ]);

  console.log(Date.now() - start);  // 约1秒
}

// 模拟函数
function fetchUser() {
  return new Promise(resolve => setTimeout(() => resolve({ id: 1 }), 1000));
}

function fetchPosts() {
  return new Promise(resolve => setTimeout(() => resolve([]), 1000));
}
```

### 22.3 Generator 函数详解

**参考答案：**

Generator 是 ES6 引入的一种可暂停和恢复执行的函数：

```javascript
// Generator 函数定义
function* generator() {
  console.log('Start');
  yield 1;
  console.log('After first yield');
  yield 2;
  console.log('After second yield');
  yield 3;
  console.log('End');
  return 'Done';
}

const gen = generator();

console.log(gen.next());  // {value: 1, done: false}
console.log(gen.next());  // {value: 2, done: false}
console.log(gen.next());  // {value: 3, done: false}
console.log(gen.next());  // {value: 'Done', done: true}
```

**Generator 与异步编程**：

```javascript
// 使用 Generator 实现异步流程控制

function* asyncFlow() {
  try {
    const user = yield fetchUser();
    console.log('User:', user);

    const posts = yield fetchPosts();
    console.log('Posts:', posts);

    return { user, posts };
  } catch (error) {
    console.error('Error:', error);
  }
}

// 模拟异步操作
function fetchUser() {
  return new Promise(resolve => {
    setTimeout(() => resolve({ id: 1, name: 'Tom' }), 1000);
  });
}

function fetchPosts() {
  return new Promise(resolve => {
    setTimeout(() => resolve(['Post 1', 'Post 2']), 1000);
  });
}

// 执行器
function run(generator) {
  const gen = generator();

  function next(value) {
    const { done, value: result } = gen.next(value);

    if (done) {
      return result;
    }

    // 假设 result 是 Promise
    result.then(data => next(data));
  }

  next();
}

run(asyncFlow);

/*
执行过程：
1. 启动 generator
2. yield fetchUser()，等待 Promise
3. Promise resolve 后调用 next(data)
4. 继续执行到下一个 yield
5. yield fetchPosts()，等待 Promise
6. Promise resolve 后调用 next(data)
7. generator 完成
*/
```

**使用 co 库执行 Generator**：

```javascript
// co 库的实现原理
function co(generator) {
  return new Promise((resolve, reject) => {
    const gen = generator();

    function next(value, isError = false) {
      let result;

      try {
        if (isError) {
          result = gen.throw(value);
        } else {
          result = gen.next(value);
        }
      } catch (error) {
        return reject(error);
      }

      if (result.done) {
        return resolve(result.value);
      }

      // 转换为 Promise
      Promise.resolve(result.value).then(
        val => next(val, false),
        err => next(err, true)
      );
    }

    next();
  });
}

// 使用 co
co(function* () {
  const user = yield fetchUser();
  const posts = yield fetchPosts();
  return { user, posts };
}).then(result => {
  console.log(result);
});
```

---

## 二十三、错误处理和调试技巧

### 23.1 JavaScript 错误类型详解

**参考答案：**

JavaScript 有多种错误类型，理解它们有助于更好地处理错误：

```javascript
// 常见错误类型

// 1. SyntaxError - 语法错误
// console.log(')  // 缺少引号

// 2. ReferenceError - 引用错误
// console.log(undefinedVar);  // 变量未定义

// 3. TypeError - 类型错误
// const obj = null; obj.name;  // 不能读取 null 的属性

// 4. RangeError - 范围错误
// const arr = new Array(-1);  // 数组长度不能为负

// 5. URIError - URI 错误
// decodeURIComponent('%');  // 无效的 URI 编码

// 6. EvalError - eval 错误
// eval('function() {}');  // 不正确的 eval 使用

// 7. 自定义错误
class CustomError extends Error {
  constructor(message, code) {
    super(message);
    this.name = 'CustomError';
    this.code = code;
  }
}

try {
  throw new CustomError('Something went wrong', 500);
} catch (error) {
  console.log(error.name);  // 'CustomError'
  console.log(error.message);  // 'Something went wrong'
  console.log(error.code);  // 500
}
```

### 23.2 try-catch 最佳实践

**参考答案：**

```javascript
// try-catch 基本用法
try {
  // 可能抛出错误的代码
  const result = JSON.parse('{"name": "Tom"}');
  console.log(result);
} catch (error) {
  console.error('Error:', error.message);
} finally {
  console.log('Always executed');
}

// 捕获不同类型的错误
try {
  // 可能抛出多种错误的代码
  const value = riskyOperation();
} catch (error) {
  if (error instanceof TypeError) {
    console.log('Type error:', error.message);
  } else if (error instanceof ReferenceError) {
    console.log('Reference error:', error.message);
  } else {
    console.log('Unknown error:', error.message);
  }
}

// 异步错误处理
async function fetchData() {
  try {
    const response = await fetch('/api/data');
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Fetch error:', error);
    throw error;  // 重新抛出或处理
  }
}

// 顶层错误处理（Node.js）
process.on('uncaughtException', (error) => {
  console.error('Uncaught exception:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled rejection:', reason);
});

// 浏览器中的全局错误处理
window.addEventListener('error', (event) => {
  console.error('Global error:', event.error);
});

window.addEventListener('unhandledrejection', (event) => {
  console.error('Unhandled promise rejection:', event.reason);
});
```

### 23.3 调试技巧汇总

**参考答案：**

```javascript
// 1. console 的多种用法
console.log('基本日志');
console.info('信息日志');
console.warn('警告日志');
console.error('错误日志');

// 格式化输出
console.log('User: %s, Age: %d', 'Tom', 18);
console.log('Object: %o', { name: 'Tom' });

// 分组输出
console.group('User Details');
console.log('Name: Tom');
console.log('Age: 18');
console.groupEnd();

// 表格输出
console.table([
  { name: 'Tom', age: 18 },
  { name: 'Jerry', age: 20 }
]);

// 计时
console.time('loop');
for (let i = 0; i < 100000; i++) {}
console.timeEnd('loop');

// 堆栈跟踪
function function1() {
  function2();
}

function function2() {
  function3();
}

function function3() {
  console.trace('Stack trace');
}

function1();

// 2. debugger 语句
function calculate(a, b) {
  const result = a + b;
  debugger;  // 在此处断点
  return result;
}

// 3. 条件断点
// 在 DevTools 中右键点击断点，选择"条件断点"
// 输入条件表达式，只有条件为 true 时才会暂停

// 4. 监控变量
// 在 DevTools 中右键点击变量，选择"监控"

// 5. 性能分析
console.profile('My Profile');
// 执行代码
console.profileEnd('My Profile');
```

---

## 二十四、DOM操作深入

### 24.1 DOM操作性能优化

**参考答案：**

DOM 操作是前端性能的关键点，以下是优化技巧：

```javascript
// 1. 减少 DOM 访问次数
// 错误方式
for (let i = 0; i < 1000; i++) {
  document.getElementById('list').innerHTML += '<li>Item ' + i + '</li>';
}

// 正确方式：先构建字符串或文档片段
const fragment = document.createDocumentFragment();
for (let i = 0; i < 1000; i++) {
  const li = document.createElement('li');
  li.textContent = 'Item ' + i;
  fragment.appendChild(li);
}
document.getElementById('list').appendChild(fragment);

// 2. 缓存 DOM 引用
function updateList(items) {
  const list = document.getElementById('list');  // 缓存引用
  list.innerHTML = '';

  items.forEach(item => {
    const li = document.createElement('li');
    li.textContent = item.name;
    list.appendChild(li);
  });
}

// 3. 使用 DocumentFragment
function createElements() {
  const fragment = document.createDocumentFragment();

  for (let i = 0; i < 100; i++) {
    const div = document.createElement('div');
    div.textContent = 'Item ' + i;
    fragment.appendChild(div);
  }

  document.body.appendChild(fragment);
}

// 4. 避免强制重排（Reflow）
// 错误方式
const element = document.getElementById('box');
element.style.width = '100px';
element.style.height = '100px';
element.style.margin = '10px';

// 正确方式：合并样式修改
element.style.cssText = 'width: 100px; height: 100px; margin: 10px;';

// 或使用 class
element.className = 'box-style';

// 5. 使用 transform 和 opacity 进行动画
// 这些属性不会触发重排，只会触发合成
element.style.transform = 'translateX(100px)';
element.style.opacity = '0.5';

// 6. 虚拟滚动（大量列表优化）
class VirtualList {
  constructor(container, itemHeight, totalItems) {
    this.container = container;
    this.itemHeight = itemHeight;
    this.totalItems = totalItems;
    this.visibleCount = Math.ceil(container.clientHeight / itemHeight);
    this.scrollTop = 0;

    container.addEventListener('scroll', () => this.onScroll());
    this.render();
  }

  onScroll() {
    this.scrollTop = this.container.scrollTop;
    this.render();
  }

  render() {
    const startIndex = Math.floor(this.scrollTop / this.itemHeight);
    const endIndex = startIndex + this.visibleCount + 1;

    // 只渲染可见区域
    // ...
  }
}
```

### 24.2 事件委托与事件冒泡

**参考答案：**

事件委托利用事件冒泡原理，可以高效处理大量子元素的事件：

```javascript
// 事件委托示例
<ul id="list">
  <li>Item 1</li>
  <li>Item 2</li>
  <li>Item 3</li>
  <!-- 可以有更多项 -->
</ul>

// 传统方式：为每个子元素绑定事件
const items = document.querySelectorAll('#list li');
items.forEach(item => {
  item.addEventListener('click', () => {
    console.log(item.textContent);
  });
});

// 事件委托方式：只在父元素绑定一次
document.getElementById('list').addEventListener('click', (event) => {
  if (event.target.tagName === 'LI') {
    console.log(event.target.textContent);
  }
});

// 事件委托的优势：
// 1. 减少事件绑定数量
// 2. 动态添加的元素也能响应事件
// 3. 减少内存占用

// 事件委托实现删除功能
<ul id="todo-list">
  <li>Task 1 <button class="delete">Delete</button></li>
  <li>Task 2 <button class="delete">Delete</button></li>
</ul>

document.getElementById('todo-list').addEventListener('click', (event) => {
  if (event.target.classList.contains('delete')) {
    event.target.parentElement.remove();
  }
});
```

**事件冒泡与捕获**：

```javascript
// 事件流：捕获阶段 → 目标阶段 → 冒泡阶段

<div id="parent">
  <div id="child">
    <button id="button">Click</button>
  </div>
</div>

// 捕获阶段（从外到内）
document.getElementById('parent').addEventListener('click', () => {
  console.log('Parent - Capture');
}, true);

document.getElementById('child').addEventListener('click', () => {
  console.log('Child - Capture');
}, true);

// 目标阶段
document.getElementById('button').addEventListener('click', () => {
  console.log('Button - Target');
});

// 冒泡阶段（从内到外）
document.getElementById('child').addEventListener('click', () => {
  console.log('Child - Bubble');
});

document.getElementById('parent').addEventListener('click', () => {
  console.log('Parent - Bubble');
});

/*
点击 button 后的输出：
Parent - Capture
Child - Capture
Button - Target
Child - Bubble
Parent - Bubble
*/

// 停止冒泡
document.getElementById('child').addEventListener('click', (event) => {
  event.stopPropagation();  // 阻止冒泡
  console.log('Child clicked');
});

document.getElementById('parent').addEventListener('click', () => {
  console.log('Parent clicked');  // 不会执行
});

// 阻止默认行为
document.getElementById('link').addEventListener('click', (event) => {
  event.preventDefault();  // 阻止默认跳转
  console.log('Link clicked but not navigated');
});
```

### 24.3 动画与requestAnimationFrame

**参考答案：**

requestAnimationFrame 提供了一种高效执行动画的方式：

```javascript
// requestAnimationFrame 基本用法
function animate() {
  // 更新动画状态
  element.style.transform = `translateX(${position}px)`;

  // 继续下一帧
  requestAnimationFrame(animate);
}

requestAnimationFrame(animate);

// 使用 requestAnimationFrame 实现动画
const element = document.getElementById('box');
let startTime = null;
const duration = 1000;

function animate(timestamp) {
  if (!startTime) startTime = timestamp;

  const progress = timestamp - startTime;
  const progressPercent = Math.min(progress / duration, 1);

  // 使用缓动函数
  const easeOut = 1 - Math.pow(1 - progressPercent, 3);

  element.style.transform = `translateX(${easeOut * 300}px)`;

  if (progress < duration) {
    requestAnimationFrame(animate);
  }
}

requestAnimationFrame(animate);

// 常见的缓动函数
const easing = {
  linear: t => t,
  easeIn: t => t * t,
  easeOut: t => t * (2 - t),
  easeInOut: t => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t,
  bounce: t => {
    if (t < 1 / 2.75) {
      return 7.5625 * t * t;
    } else if (t < 2 / 2.75) {
      return 7.5625 * (t -= 1.5 / 2.75) * t + 0.75;
    } else if (t < 2.5 / 2.75) {
      return 7.5625 * (t -= 2.25 / 2.75) * t + 0.9375;
    } else {
      return 7.5625 * (t -= 2.625 / 2.75) * t + 0.984375;
    }
  }
};

// 停止动画
let animationId;

function startAnimation() {
  function step(timestamp) {
    // 动画逻辑
    animationId = requestAnimationFrame(step);
  }
  animationId = requestAnimationFrame(step);
}

function stopAnimation() {
  cancelAnimationFrame(animationId);
}

// 动画与性能优化
// 1. 使用 transform 和 opacity
// 2. 避免在动画中读取布局属性
// 3. 使用 will-change 提示浏览器
element.style.willChange = 'transform';
// 动画结束后移除
element.addEventListener('transitionend', () => {
  element.style.willChange = 'auto';
});
```

---

## 二十五、ES6+核心特性详解

### 25.1 Proxy和Reflect详解

**参考答案：**

Proxy 和 Reflect 是 ES6 引入的强大的元编程特性：

```javascript
// Proxy 基本用法
const target = {
  name: 'Tom',
  age: 18
};

const handler = {
  // 拦截属性读取
  get(target, property, receiver) {
    console.log(`Getting ${property}`);
    return target[property];
  },

  // 拦截属性设置
  set(target, property, value, receiver) {
    console.log(`Setting ${property} to ${value}`);
    target[property] = value;
    return true;
  },

  // 拦截属性删除
  deleteProperty(target, property) {
    console.log(`Deleting ${property}`);
    delete target[property];
    return true;
  },

  // 拦截属性检查
  has(target, property) {
    console.log(`Checking ${property}`);
    return property in target;
  },

  // 拦截 Object.keys
  ownKeys(target) {
    return Object.keys(target);
  },

  // 拦截 Object.getOwnPropertyDescriptor
  getOwnPropertyDescriptor(target, property) {
    return {
      value: target[property],
      enumerable: true,
      configurable: true
    };
  }
};

const proxy = new Proxy(target, handler);

console.log(proxy.name);  // Getting name, Tom
proxy.age = 20;  // Setting age to 20
console.log('name' in proxy);  // Checking name, true
```

**Proxy 应用场景**：

```javascript
// 1. 数据验证
function createValidator(schema) {
  return new Proxy({}, {
    set(target, property, value) {
      const validator = schema[property];
      if (validator && !validator(value)) {
        throw new TypeError(`Invalid value for ${property}`);
      }
      target[property] = value;
      return true;
    }
  });
}

const validator = createValidator({
  age: value => value >= 0 && value <= 150,
  email: value => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
});

validator.age = 25;  // OK
validator.email = 'test@example.com';  // OK
// validator.age = -5;  // TypeError
// validator.email = 'invalid';  // TypeError

// 2. 私有属性
function createPrivate(obj) {
  return new Proxy(obj, {
    get(target, property) {
      if (property.startsWith('_')) {
        throw new Error('Private property');
      }
      return target[property];
    },
    set(target, property, value) {
      if (property.startsWith('_')) {
        throw new Error('Private property');
      }
      target[property] = value;
      return true;
    }
  });
}

const privateObj = createPrivate({ name: 'Tom', _secret: 'hidden' });
console.log(privateObj.name);  // 'Tom'
// console.log(privateObj._secret);  // Error

// 3. 响应式系统（Vue3 原理简化版）
function reactive(target) {
  const handlers = {};
  const observers = new Set();

  return new Proxy(target, {
    get(target, property, receiver) {
      const value = Reflect.get(target, property, receiver);

      observers.forEach(observer => observer(property, value));

      if (typeof value === 'object' && value !== null) {
        return reactive(value);
      }

      return value;
    },
    set(target, property, value, receiver) {
      const result = Reflect.set(target, property, value, receiver);
      observers.forEach(observer => observer(property, value));
      return result;
    }
  });
}

const state = reactive({ count: 0 });

function observer(key, value) {
  console.log(`${key} changed to ${value}`);
}

setTimeout(() => {
  state.count = 5;
}, 1000);
```

**Reflect 对象**：

```javascript
// Reflect 静态方法
const obj = { name: 'Tom' };

// 获取属性
Reflect.get(obj, 'name');  // 'Tom'

// 设置属性
Reflect.set(obj, 'age', 18);  // true

// 删除属性
Reflect.deleteProperty(obj, 'age');  // true

// 检查属性存在
Reflect.has(obj, 'name');  // true

// 获取属性描述符
Reflect.getOwnPropertyDescriptor(obj, 'name');
// { value: 'Tom', writable: true, enumerable: true, configurable: true }

// 定义属性
Reflect.defineProperty(obj, 'name', { value: 'Jerry' });

// 获取原型
Reflect.getPrototypeOf(obj);  // Object.prototype

// 设置原型
Reflect.setPrototypeOf(obj, null);

// 阻止扩展
Reflect.preventExtensions(obj);

// 检查是否可扩展
Reflect.isExtensible(obj);  // false

// 函数调用
function greet(name) {
  return `Hello, ${name}`;
}

Reflect.apply(greet, null, ['Tom']);  // 'Hello, Tom'

// 构造函数调用
function Person(name) {
  this.name = name;
}

const person = Reflect.construct(Person, ['Tom']);
```

### 25.2 Symbol与迭代器

**参考答案：**

Symbol 是 ES6 引入的新的原始类型，用于创建唯一的标识符：

```javascript
// Symbol 基本用法
const sym1 = Symbol('description');
const sym2 = Symbol('description');

console.log(sym1 === sym2);  // false - 每个 Symbol 都是唯一的

// Symbol 用于对象属性
const obj = {
  [Symbol('id')]: 1,
  name: 'Tom'
};

// Symbol 属性不会出现在常规遍历中
console.log(Object.keys(obj));  // ['name']
console.log(Object.getOwnPropertySymbols(obj));  // [Symbol(id)]

// Symbol.for - 全局 Symbol 注册表
const symA = Symbol.for('global');
const symB = Symbol.for('global');
console.log(symA === symB);  // true - 相同 key 返回相同 Symbol

// Symbol.iterator - 可迭代协议
const arr = [1, 2, 3];
const iterator = arr[Symbol.iterator]();

console.log(iterator.next());  // {value: 1, done: false}
console.log(iterator.next());  // {value: 2, done: false}
console.log(iterator.next());  // {value: 3, done: false}
console.log(iterator.next());  // {value: undefined, done: true}

// 自定义迭代器
const customObj = {
  data: [1, 2, 3],
  [Symbol.iterator]() {
    let index = 0;
    return {
      next: () => {
        if (index < this.data.length) {
          return { value: this.data[index++], done: false };
        }
        return { value: undefined, done: true };
      }
    };
  }
};

for (const item of customObj) {
  console.log(item);  // 1, 2, 3
}

// 生成器作为迭代器
function* generator() {
  yield 1;
  yield 2;
  yield 3;
}

for (const item of generator()) {
  console.log(item);  // 1, 2, 3
}
```

### 25.3 Set和Map数据结构

**参考答案：**

Set 和 Map 是 ES6 引入的新的数据结构：

```javascript
// Set - 值唯一的集合
const set = new Set();

// 添加元素
set.add(1);
set.add(2);
set.add(3);
set.add(1);  // 重复元素被忽略

console.log(set.size);  // 3
console.log(set.has(1));  // true
console.log(set.has(4));  // false

// 删除元素
set.delete(2);

// 遍历
set.forEach(value => console.log(value));

for (const value of set) {
  console.log(value);
}

// Set 的应用：数组去重
const arr = [1, 2, 2, 3, 3, 3];
const unique = [...new Set(arr)];
console.log(unique);  // [1, 2, 3]

// Set 用于字符串去重
const str = 'hello';
const uniqueStr = [...new Set(str)].join('');
console.log(uniqueStr);  // 'helo'

// Map - 键值对集合
const map = new Map();

// 设置值
map.set('name', 'Tom');
map.set('age', 18);
map.set({ id: 1 }, 'Object key');  // 键可以是任意类型

// 获取值
console.log(map.get('name'));  // 'Tom'
console.log(map.has('age'));  // true

// 删除值
map.delete('age');

// 遍历
map.forEach((value, key) => {
  console.log(`${key}: ${value}`);
});

for (const [key, value] of map) {
  console.log(`${key}: ${value}`);
}

// Map 转换为数组
[...map];  // [['name', 'Tom'], ['age', 18]]
[...map.keys()];  // ['name', 'age']
[...map.values()];  // ['Tom', 18]

// WeakSet 和 WeakMap
// WeakSet - 存储对象的弱引用集合
const weakSet = new WeakSet();
const obj1 = { name: 'Tom' };
const obj2 = { name: 'Jerry' };

weakSet.add(obj1);
weakSet.add(obj2);
console.log(weakSet.has(obj1));  // true

obj1 = null;  // obj1 可以被垃圾回收

// WeakMap - 键为对象且为弱引用的 Map
const weakMap = new WeakMap();
const element = document.getElementById('div');

weakMap.set(element, 'some data');
console.log(weakMap.get(element));  // 'some data'

element.parentNode.removeChild(element);  // DOM 元素被移除
// weakMap 中的引用也会被自动清除
```

### 25.4 可选链与空值合并

**参考答案：**

可选链和空值合并是 ES11 引入的安全访问操作符：

```javascript
// 可选链 (?.)
const user = {
  profile: {
    name: 'Tom',
    address: {
      city: 'Beijing'
    }
  }
};

// 安全访问嵌套属性
console.log(user?.profile?.name);  // 'Tom'
console.log(user?.profile?.age);  // undefined
console.log(user?.profile?.address?.city);  // 'Beijing'
console.log(user?.job?.title);  // undefined

// 可选链与函数调用
const user2 = {
  getName: () => 'Tom',
  getAge: undefined
};

console.log(user2?.getName?.());  // 'Tom'
console.log(user2?.getAge?.());  // undefined
console.log(user2?.getAddress?.());  // undefined

// 可选链与数组
const users = [{ name: 'Tom' }, { name: 'Jerry' }];
console.log(users?.[0]?.name);  // 'Tom'
console.log(users?.[5]?.name);  // undefined

// 可选链与动态属性
const key = 'name';
console.log(user?.profile?.[key]);  // 'Tom'

// 空值合并 (??)
const value1 = null ?? 'default';  // 'default'
const value2 = undefined ?? 'default';  // 'default'
const value3 = 0 ?? 'default';  // 0 - 因为 0 不是 null/undefined
const value4 = '' ?? 'default';  // '' - 因为空字符串不是 null/undefined
const value5 = false ?? 'default';  // false

// 可选链与空值合并结合使用
const result = user?.profile?.age ?? 'Unknown';
console.log(result);  // 'Unknown'（因为 age 为 undefined）

// 实际应用示例
function getCity(user) {
  return user?.address?.city ?? 'Unknown';
}

console.log(getCity({ address: { city: 'Beijing' } }));  // 'Beijing'
console.log(getCity({ address: {} }));  // 'Unknown'
console.log(getCity({}));  // 'Unknown'
console.log(getCity(null));  // 'Unknown'
```

---

## 二十六、高频面试题精选

### 26.1 执行机制面试题

**题目一：输出结果预测**

```javascript
// 面试题 1
console.log(1);

setTimeout(() => {
  console.log(2);
}, 0);

Promise.resolve().then(() => {
  console.log(3);
});

Promise.resolve().then(() => {
  console.log(4);
});

setTimeout(() => {
  console.log(5);
}, 0);

console.log(6);

// 参考答案：1, 6, 3, 4, 2, 5

// 解释：
// 1. 同步代码：1, 6
// 2. 微任务（Promise）：3, 4
// 3. 宏任务（setTimeout）：2, 5
```

```javascript
// 面试题 2
async function async1() {
  console.log('1');
  await async2();
  console.log('2');
}

async function async2() {
  console.log('3');
}

console.log('4');

setTimeout(() => {
  console.log('5');
}, 0);

async1();

new Promise((resolve) => {
  console.log('6');
  resolve();
}).then(() => {
  console.log('7');
});

console.log('8');

// 参考答案：4, 1, 3, 8, 6, 2, 7, 5

// 解释：
// 1. 同步代码：4
// 2. 调用 async1()，输出 '1'
// 3. await async2()，先执行 async2()
// 4. async2() 输出 '3'，await 后面的代码变为微任务
// 5. 同步代码：6, 8
// 6. 微任务：2, 7
// 7. 宏任务：5
```

```javascript
// 面试题 3
for (var i = 0; i < 5; i++) {
  setTimeout(() => {
    console.log(i);
  }, 0);
}

// 参考答案：5, 5, 5, 5, 5

// 解释：var 是函数作用域，循环结束后 i = 5
// 所有 setTimeout 访问的都是同一个 i
```

### 26.2 原型与继承面试题

**题目：原型继承实现**

```javascript
// 面试题：实现继承
function Animal(name) {
  this.name = name;
}

Animal.prototype.speak = function() {
  return `${this.name} makes a sound`;
};

function Dog(name, breed) {
  // 实现构造函数继承
  Animal.call(this, name);
  this.breed = breed;
}

// 实现原型链继承
Dog.prototype = Object.create(Animal.prototype);
Dog.prototype.constructor = Dog;

// 添加子类方法
Dog.prototype.bark = function() {
  return `${this.name} barks`;
};

// 测试
const dog = new Dog('Buddy', 'Golden Retriever');
console.log(dog.name);  // 'Buddy'
console.log(dog.speak());  // 'Buddy makes a sound'
console.log(dog.bark());  // 'Buddy barks'
console.log(dog instanceof Dog);  // true
console.log(dog instanceof Animal);  // true
```

### 26.3 异步编程面试题

**题目：实现红绿灯交换**

```javascript
// 面试题：实现红绿灯交换
// 红 3s -> 黄 2s -> 绿灯 1s -> 红...

function red() {
  console.log('Red');
}

function yellow() {
  console.log('Yellow');
}

function green() {
  console.log('Green');
}

// 使用 async/await
function light() {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve();
    }, ms);
  });
}

async function run() {
  while (true) {
    red();
    await light(3000);
    yellow();
    await light(2000);
    green();
    await light(1000);
  }
}

// 使用 Promise 链
function runChain() {
  red();
  light(3000)
    .then(() => {
      yellow();
      return light(2000);
    })
    .then(() => {
      green();
      return light(1000);
    })
    .then(() => runChain());
}

runChain();
```

### 26.4 手写代码面试题

**题目：实现 Promise.all**

```javascript
// 面试题：手写 Promise.all
Promise.myAll = function(promises) {
  return new Promise((resolve, reject) => {
    if (!Array.isArray(promises)) {
      return reject(new TypeError('参数必须是数组'));
    }

    const results = [];
    let count = 0;

    if (promises.length === 0) {
      return resolve([]);
    }

    promises.forEach((promise, index) => {
      // 处理非 Promise 值
      Promise.resolve(promise).then(
        value => {
          results[index] = value;
          count++;

          if (count === promises.length) {
            resolve(results);
          }
        },
        reason => {
          // 任何一个 Promise 失败就失败
          reject(reason);
        }
      );
    });
  });
};

// 测试
const p1 = Promise.resolve(1);
const p2 = Promise.resolve(2);
const p3 = new Promise(resolve => setTimeout(() => resolve(3), 100));

Promise.myAll([p1, p2, p3]).then(console.log);  // [1, 2, 3]

// 测试失败情况
const p4 = Promise.reject('error');
Promise.myAll([p1, p4]).catch(console.error);  // 'error'
```

**题目：实现深拷贝**

```javascript
// 面试题：手写深拷贝
function deepClone(target, cache = new WeakMap()) {
  // 处理原始类型
  if (target === null || typeof target !== 'object') {
    return target;
  }

  // 处理日期
  if (target instanceof Date) {
    return new Date(target);
  }

  // 处理正则
  if (target instanceof RegExp) {
    return new RegExp(target);
  }

  // 处理 Symbol
  if (typeof target === 'symbol') {
    return Symbol(target.description);
  }

  // 处理函数
  if (typeof target === 'function') {
    return target;
  }

  // 处理循环引用
  if (cache.has(target)) {
    return cache.get(target);
  }

  // 创建新对象或数组
  const clone = Array.isArray(target) ? [] : {};
  cache.set(target, clone);

  // 遍历所有属性（包括 Symbol）
  const keys = Reflect.ownKeys(target);

  keys.forEach(key => {
    const descriptor = Object.getOwnPropertyDescriptor(target, key);

    // 跳过不可枚举属性（可选）
    if (!descriptor.enumerable) return;

    // 递归克隆
    clone[key] = deepClone(target[key], cache);
  });

  return clone;
}

// 测试
const obj = {
  name: 'Tom',
  age: 18,
  date: new Date(),
  regex: /test/,
  nested: {
    a: 1,
    b: [1, 2, 3]
  },
  [Symbol('id')]: 123
};

// 循环引用测试
obj.self = obj;

const cloned = deepClone(obj);
console.log(cloned);
console.log(cloned.self === obj);  // false
```

---

## 十九、JavaScript模块化与工程化

### 19.1 ES Modules 详解

**参考答案：**

ES Modules (ESM) 是 ECMAScript 2015 (ES6) 引入的官方模块系统，为 JavaScript 提供了原生的模块化支持。它解决了 JavaScript 长期以来缺乏统一模块系统的问题，使得代码可以更清晰地组织、复用和维护。

**基本语法：**

```javascript
// 命名导出 - 方式1: 在声明前添加 export
export const name = 'Alice';
export function greet(message) {
  return `Hello, ${message}`;
}
export class User {
  constructor(name) {
    this.name = name;
  }
}

// 命名导出 - 方式2: 在文件末尾集中导出
const PI = 3.14159;
function add(a, b) {
  return a + b;
}
export { PI, add };

// 重命名导出
export { add as sum, PI as PI_VALUE };

// 默认导出 - 每个文件只能有一个
export default function() {
  return 'default export';
}

// 默认导出也可以使用表达式
export default class {
  constructor() {
    this.version = '1.0.0';
  }
}
```

**导入语法：**

```javascript
// 导入命名导出
import { name, greet, User } from './module.js';
import { name as userName, greet as sayHello } from './module.js'; // 重命名

// 导入默认导出
import myDefault from './module.js';

// 混合导入
import defaultExport, { namedExport1, namedExport2 } from './module.js';

// 导入所有内容作为命名空间
import * as module from './module.js';
console.log(module.name);
console.log(module.greet());

// 仅执行副作用（不导入任何值）
import './styles.css';
```

**动态导入：**

```javascript
// 动态导入返回 Promise
const module = await import('./module.js');
const { name, greet } = await import('./module.js');

// 条件导入
if (condition) {
  const { heavyModule } = await import('./heavy-module.js');
  heavyModule.init();
}

// 按需加载模块
button.addEventListener('click', async () => {
  const { Modal } = await import('./components/Modal.js');
  new Modal().show();
});
```

**ES Modules 的特点：**

1. **严格模式**: ESM 自动使用严格模式
```javascript
// module.js
'use strict'; // 自动应用

// this 在顶层是 undefined（不是 window）
console.log(this); // undefined
```

2. **模块作用域**: 每个模块有自己的顶级作用域
```javascript
// a.js
const a = 1;
export { a };

// b.js
const a = 2;
export { a };

// main.js
import { a } from './a.js';
import { a as a2 } from './b.js';
console.log(a);   // 1
console.log(a2);  // 2 - 不会冲突
```

3. **单例模式**: 模块只会被执行一次，后续导入获取的是缓存
```javascript
// counter.js
let count = 0;
export function increment() {
  count++;
  return count;
}
export function getCount() {
  return count;
}

// main.js
import { increment, getCount } from './counter.js';
import { increment as inc2 } from './counter.js';

console.log(increment()); // 1
console.log(inc2());      // 2 - 同一个模块实例
console.log(getCount());  // 2
```

4. **异步加载**: ESM 支持异步加载，不会阻塞页面渲染
```javascript
// 在 HTML 中使用
<script type="module" src="./main.js"></script>
// 等同于 defer
```

**面试考点分析：**

- ESM 与 CommonJS 的区别是面试常考点
- 需要理解模块缓存机制和单例特性
- 动态导入 `import()` 是实现代码分割的基础

### 19.2 CommonJS vs ES Modules

**参考答案：**

CommonJS (CJS) 是 Node.js 传统的模块系统，而 ES Modules (ESM) 是 ES6 引入的官方标准。两者有显著的区别：

| 特性 | CommonJS | ES Modules |
| :--- | :--- | :--- |
| 语法 | `require()` / `module.exports` | `import` / `export` |
| 加载方式 | 同步 | 异步（可同步可异步） |
| 运行时解析 | 运行时 | 编译时（静态分析） |
| 顶层的 `this` | `module.exports` 对象 | `undefined` |
| 循环依赖 | 支持，但需小心 | 支持，但处理方式不同 |
| 导入值类型 | 值拷贝 | 绑定（live bindings） |
| 加载时机 | 惰性加载 | 预处理（提升） |

**详细对比代码：**

```javascript
// ============ CommonJS ============

// 导出
module.exports = {
  name: 'Alice',
  greet: function(message) {
    return `Hello, ${message}`;
  }
};

// 或者
const obj = {
  name: 'Alice',
  greet: function(message) {
    return `Hello, ${message}`;
  }
};
module.exports = obj;

// 导入
const { name, greet } = require('./module.js');
const module = require('./module.js');
```

```javascript
// ============ ES Modules ============

// 导出
export const name = 'Alice';
export function greet(message) {
  return `Hello, ${message}`;
}

// 导入
import { name, greet } from './module.js';
```

**值拷贝 vs 绑定：**

```javascript
// CommonJS - 值拷贝
// counter.js
let count = 0;
module.exports = {
  getCount: () => count,
  increment: () => {
    count++;
    return count;
  }
};

// main.js
const counter1 = require('./counter.js');
const counter2 = require('./counter.js');

counter1.increment(); // 返回 1
counter2.increment(); // 返回 1 - 独立的拷贝

// ES Modules - 绑定（live bindings）
// counter.mjs
let count = 0;
export function getCount() {
  return count;
}
export function increment() {
  count++;
  return count;
}

// main.mjs
import { getCount, increment } from './counter.mjs';
import { getCount as getCount2, increment as inc2 } from './counter.mjs';

increment(); // 返回 1
getCount2(); // 返回 1 - 同一个模块实例，绑定是"活"的
```

**运行时 vs 编译时：**

```javascript
// CommonJS - 运行时动态
const name = 'Alice';
if (someCondition) {
  module.exports = require('./module-a.js');
} else {
  module.exports = require('./module-b.js');
}

// ES Modules - 编译时静态
import { name } from './module.js'; // 必须在顶级作用域
export { name };

// 动态路径（允许）
const path = './module.js';
import(path).then(module => { /* ... */ });

// 条件导出（不允许）
if (condition) {
  export const a = 1; // 语法错误
}
```

**Node.js 中的使用：**

```javascript
// package.json 中指定 type
{
  "name": "my-package",
  "type": "module",  // "module" 或 "commonjs"
  "main": "src/index.js"
}

// Node.js 中两种格式共存
// .cjs 文件 - CommonJS
// .mjs 文件 - ES Modules
```

**相互转换：**

```javascript
// 使用 createRequire 在 ESM 中使用 CJS
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const cjsModule = require('./commonjs-module.cjs');

// 使用 default import 导入 CJS
import cjsModule from './commonjs-module.cjs'; // 注意：这是 interop
```

**面试考点分析：**

- 理解两种模块系统的本质区别
- 了解 Node.js 中的兼容处理
- 理解"值拷贝"和"绑定"的区别，这在处理异步模块时很重要
- 了解循环依赖的处理方式差异

### 19.3 模块加载原理深度解析

**参考答案：**

**ES Modules 加载过程：**

ES Modules 的加载分为三个阶段：构建（Construction）、实例化（Instantiation）和求值（Evaluation）。

```
┌─────────────────────────────────────────────────────────────────┐
│                    ES Modules 加载过程                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  1. 构建阶段 (Construction)                                     │
│     ┌─────────────────────────────────────────────────────┐     │
│     │  - 解析模块 URL                                      │     │
│     │  - 下载模块代码                                      │     │
│     │  - 解析为 AST                                        │     │
│     │  - 识别 import/export                                │     │
│     │  - 构建模块记录 (Module Record)                       │     │
│     └─────────────────────────────────────────────────────┘     │
│                           │                                      │
│                           ▼                                      │
│  2. 实例化阶段 (Instantiation)                                  │
│     ┌─────────────────────────────────────────────────────┐     │
│     │  - 创建模块环境记录 (Module Environment Record)       │     │
│     │  - 为所有导出创建"虚拟模块"                            │     │
│     │  - 连接 import 到 export（链接解析）                  │     │
│     │  - 不执行代码，只建立引用关系                          │     │
│     └─────────────────────────────────────────────────────┘     │
│                           │                                      │
│                           ▼                                      │
│  3. 求值阶段 (Evaluation)                                       │
│     ┌─────────────────────────────────────────────────────┐     │
│     │  - 按正确顺序执行模块代码                             │     │
│     │  - 处理循环依赖                                      │     │
│     │  - 初始化模块级别的变量                               │     │
│     └─────────────────────────────────────────────────────┘     │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

**模块记录 (Module Record)：**

```javascript
// 模块记录包含模块的所有元信息
{
  "status": "linked",           // unlinked, fetching, fetched, linked, evaluating, evaluated
  "environment": null,          // 模块环境记录
  "namespace": undefined,       // 模块命名空间对象
  "importEntries": [...],      // 导入条目
  "exportEntries": [...],      // 导出条目
  "requestedModules": [...]    // 请求的模块列表
}
```

**链接解析过程：**

```javascript
// a.js
import { b } from './b.js';
export const a = b + 1;

// b.js
import { a } from './a.js';
export const b = a + 1;

// c.js
import { a } from './a.js';
export const c = a + 1;

// 加载顺序：
// 1. c.js 请求 a.js
// 2. a.js 请求 b.js
// 3. b.js 请求 a.js（循环）
// 4. 链接解析：创建空壳，等待求值
// 5. 求值：从叶子节点开始，b.js -> a.js -> c.js
```

**循环依赖处理：**

```javascript
// a.js
import { b } from './b.js';
export const a = 'a';

export function getA() {
  return a;
}

// b.js
import { a } from './a.js';
export const b = a ? a + 'b' : 'default-b'; // a 此时可能是 undefined

// main.js
import { a } from './a.js';
import { b } from './b.js';

console.log(a); // 'a'
console.log(b); // 'default-b' - 因为加载时 a 还未定义

// 重新求值后
// b 被重新求值，a 已经有了正确的值
// 但这依赖于 b 被再次求值
```

**import 的绑定机制：**

```javascript
// counter.js
export let count = 0;
export function increment() {
  count++;
}

// main.js
import { count, increment } from './counter.js';

console.log(count); // 0
increment();       // 修改了模块内的 count
console.log(count); // 1 - 通过绑定"实时"获取新值

// 不能直接修改
count = 10; // SyntaxError: Invalid assignment
// 但可以通过间接方式修改
```

**面试考点分析：**

- ES Modules 的三阶段加载过程是进阶考点
- 理解循环依赖的处理方式
- 理解 import 绑定的"活"特性
- 理解为什么 ESM 需要静态分析（用于 tree-shaking）

### 19.4 Tree Shaking 原理

**参考答案：**

Tree Shaking 是 ES Modules 的一个重要特性，它通过静态分析代码，移除未使用的导出（dead code elimination）。这个概念来源于"摇晃一棵树，让枯叶落下"。

**前提条件：**

```javascript
// 1. 必须使用 ES Modules (import/export)
// 2. package.json 中设置 "sideEffects": false 或数组
// 3. 使用支持 Tree Shaking 的打包工具 (Rollup, webpack, esbuild)

// package.json 配置
{
  "name": "my-library",
  "sideEffects": [
    "*.css",
    "./src/polyfills.js"
  ]
}
// false - 所有模块都是纯的，无副作用
// 数组 - 指定哪些文件有副作用（不应该被删除）
```

**工作原理：**

```
┌─────────────────────────────────────────────────────────────────┐
│                    Tree Shaking 工作流程                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌─────────────────┐                                           │
│  │   入口文件       │                                           │
│  │  (entry point)  │                                           │
│  └────────┬────────┘                                           │
│           │                                                     │
│           ▼                                                     │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                  1. 静态分析                               │   │
│  │                                                         │   │
│  │  - 分析 import/export 结构                                │   │
│  │  - 识别所有导出的符号                                      │   │
│  │  - 追踪每个符号的使用情况                                  │   │
│  └─────────────────────────────────────────────────────────┘   │
│           │                                                     │
│           ▼                                                     │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                  2. 标记阶段                              │   │
│  │                                                         │   │
│  │  - 从入口开始，标记所有使用的导出                          │   │
│  │  - 递归遍历所有依赖                                        │   │
│  │  - 未被标记的导出视为"可摇晃"                              │   │
│  └─────────────────────────────────────────────────────────┘   │
│           │                                                     │
│           ▼                                                     │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                  3. 删除阶段                              │   │
│  │                                                         │   │
│  │  - 移除未被使用的导出代码                                  │   │
│  │  - 保留被使用的代码                                        │   │
│  │  - 优化模块引用                                            │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

**代码示例：**

```javascript
// math.js
export function add(a, b) {
  return a + b;
}

export function subtract(a, b) {
  return a - b;
}

export function multiply(a, b) {
  return a * b;
}

// 内部函数 - 未导出
function divide(a, b) {
  return a / b;
}

// 带有副作用的代码 - 即使未使用也不会被删除
export function logSomething() {
  console.log('This has side effect');
}

// main.js
import { add, subtract } from './math.js';

console.log(add(1, 2));       // 3
console.log(subtract(5, 3));  // 2

// 结果：
// - multiply 被删除（未使用）
// - divide 被删除（未导出）
// - logSomething 保留（如果 sideEffects 配置正确）
```

**副作用 (Side Effects)：**

```javascript
// 有副作用的代码示例
export const obj = { prop: 'value' };

// 修改全局变量
function impure1() {
  window.someValue = 42;
}

// 修改传入的参数
function impure2(arr) {
  arr.push(42);
}

// DOM 操作
function impure3() {
  document.body.style.background = 'red';
}

// 打印
function impure4() {
  console.log('side effect');
}

// 纯函数（无副作用）
function pure(a, b) {
  return a + b;
}
```

**Tree Shaking 的局限性：**

```javascript
// 1. 动态 import 无法被分析
import('./module.js').then(module => {
  module.unusedExport(); // 不会被 shaking
});

// 2. 表达式调用无法确定
function maybeUse(fn) {
  if (Math.random() > 0.5) {
    fn();
  }
}
maybeUse(unusedExport); // 可能使用，不会被 shaking

// 3. 函数调用内的代码 - 某些情况下可以分析
export function used() {
  return unusedInternal(); // 如果 used 未被使用，unusedInternal 也会被删除
}

function unusedInternal() {
  return 'internal';
}
```

**在 webpack 中配置：**

```javascript
// webpack.config.js
module.exports = {
  optimization: {
    usedExports: true,     // 开启 tree shaking
    minimize: true,       // 生产模式下默认开启
    sideEffects: true     // 启用 side effects 过滤
  },
  mode: 'production'      // 生产模式自动启用
};
```

```javascript
// 在代码中标记副作用
/*@__PURE__*/ someFunction();  // 告诉 webpack 这可能是纯函数

import(/* webpackChunkName: "lodash" */ 'lodash').then(_ => {
  // 动态导入会禁用该 chunk 的部分 tree shaking
});
```

**面试考点分析：**

- Tree Shaking 的前提条件是常考点
- 理解副作用的含义和配置
- 了解 Tree Shaking 的局限性
- 理解它与打包工具的关系

### 19.5 动态导入 import()

**参考答案：**

动态导入 `import()` 是 ES2020 引入的特性，它允许在运行时异步加载模块。与静态 `import` 不同，动态导入返回 Promise。

**基本语法：**

```javascript
// 静态导入 - 页面加载时就执行
import { add } from './math.js';

// 动态导入 - 按需加载
const module = await import('./math.js');
const { add } = await import('./math.js');
```

**核心特性：**

```javascript
// 1. 返回 Promise
import('./module.js')
  .then(module => {
    module.default;     // 默认导出
    module.named;       // 命名导出
  })
  .catch(err => {
    console.error('加载失败:', err);
  });

// 2. async/await 语法
async function loadModule() {
  try {
    const module = await import('./module.js');
    return module;
  } catch (error) {
    console.error('加载失败:', error);
  }
}

// 3. 路径可以是动态的
const moduleName = 'user';
const { default: UserModule } = await import(`./modules/${moduleName}.js`);
```

**代码分割应用：**

```javascript
// 按需加载组件 - React 示例
import React, { useState, Suspense } from 'react';

function App() {
  const [ShowModal, setShowModal] = useState(null);

  const handleClick = async () => {
    // 只有点击时才加载 Modal 组件
    const { default: Modal } = await import('./Modal.js');
    setShowModal(() => Modal);
  };

  return (
    <div>
      <button onClick={handleClick}>打开弹窗</button>
      {ShowModal && <ShowModal />}
    </div>
  );
}

// 路由懒加载 - React Router 示例
import { Routes, Route } from 'react-router-dom';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route
        path="/about"
        element={lazy(() => import('./About.js'))}
      />
      <Route
        path="/dashboard/*"
        element={lazy(() => import('./Dashboard.js'))}
      />
    </Routes>
  );
}
```

**预加载和预取：**

```javascript
// 预加载 - 提前加载，后续立即使用
function preloadModule(modulePath) {
  return import(modulePath);
}

// 预取 - 空闲时加载，后续可能使用
// webpack 注释支持
import(/* webpackPrefetch: true */ './next-page.js');
import(/* webpackPreload: true */ './current-page.js');

// 生成 HTML
// <link rel="prefetch" href="next-page.js">
// <link rel="preload" href="current-page.js">
```

**条件加载：**

```javascript
// 根据环境加载不同模块
async function getBackend() {
  if (process.env.NODE_ENV === 'development') {
    return await import('./dev-backend.js');
  } else {
    return await import('./prod-backend.js');
  }
}

// 根据功能支持加载
async function getSerializer() {
  if (typeof structuredClone === 'function') {
    return await import('./native-serializer.js');
  } else {
    return await import('./polyfill-serializer.js');
  }
}
```

**加载状态管理：**

```javascript
// 带加载状态的模块加载
function useDynamicImport(importFn) {
  const [module, setModule] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    importFn()
      .then(setModule)
      .catch(setError)
      .finally(() => setLoading(false));
  }, [importFn]);

  return { module, loading, error };
}

// 使用
const { module, loading, error } = useDynamicImport(
  () => import('./HeavyComponent.js')
);
```

**import() vs 静态 import：**

```javascript
// 静态 import 特点
import { a } from './module.js';     // 必须在顶层
import './style.css';                 // 导入但不使用
const path = './module.js';
import(path);                        // 不允许

// import() 特点
const module = import('./module.js'); // 可以在任何位置
const path = getPath();
const module = import(path);          // 动态路径
import('./a.js').then(() => import('./b.js')); // 条件链式加载
```

**面试考点分析：**

- 动态导入是实现代码分割的核心技术
- 理解它与路由懒加载的关系
- 了解预加载和预取的区别
- 理解它返回 Promise 的特性

---

## 二十、JavaScript设计模式

### 20.1 单例模式 (Singleton Pattern)

**参考答案：**

单例模式确保一个类只有一个实例，并提供一个全局访问点。这是一个非常常见的设计模式，在 JavaScript 中有多种实现方式。

**核心概念：**

```javascript
// 单例模式的核心：
// 1. 只有一个实例
// 2. 全局可访问
// 3. 延迟实例化（按需创建）
```

**实现方式一：使用闭包和闭包缓存：**

```javascript
// 方式1: 简单的对象字面量（最简单但不是真正的类单例）
const singleton = {
  name: 'Single Instance',
  method() {
    return `Method called`;
  }
};

// 方式2: 使用 IIFE + 闭包
const Singleton = (function() {
  let instance = null;

  function createInstance() {
    const obj = {
      id: Math.random(),
      timestamp: Date.now(),
      methods: function() {
        console.log('Singleton method called');
      }
    };
    return obj;
  }

  return {
    getInstance: function() {
      if (!instance) {
        instance = createInstance();
      }
      return instance;
    }
  };
})();

// 使用
const s1 = Singleton.getInstance();
const s2 = Singleton.getInstance();
console.log(s1 === s2); // true
```

**实现方式二：ES6 Class 版本：**

```javascript
// 方式3: Class 写法
class Singleton {
  constructor() {
    // 如果已存在实例，抛出错误
    if (Singleton.instance) {
      throw new Error('Singleton instance already exists. Use getInstance() instead.');
    }
    this.timestamp = Date.now();
    Singleton.instance = this;
  }

  static getInstance() {
    if (!Singleton.instance) {
      Singleton.instance = new Singleton();
    }
    return Singleton.instance;
  }

  // 其它方法
  method() {
    return 'Singleton method';
  }
}

// 使用
const s1 = Singleton.getInstance();
const s2 = Singleton.getInstance();
console.log(s1 === s2); // true
```

**实现方式三：代理模式：**

```javascript
// 方式4: 使用代理（符合开闭原则）
class Singleton {
  constructor() {
    this.data = Math.random();
  }

  method() {
    return 'method called';
  }
}

// 代理函数
function singletonFactory(Class) {
  let instance = null;

  return new Proxy(Class, {
    construct(target, args) {
      if (!instance) {
        instance = new target(...args);
      }
      return instance;
    }
  });
}

// 使用
const SingletonClass = singletonFactory(Singleton);
const s1 = new SingletonClass();
const s2 = new SingletonClass();
console.log(s1 === s2); // true
```

**实现方式四：ES6 提案 - 私有字段：**

```javascript
// 方式5: 使用 ES2022 私有字段
class Singleton {
  static #instance = null;

  constructor() {
    if (Singleton.#instance) {
      return Singleton.#instance;
    }
    this.id = Math.random();
    Singleton.#instance = this;
  }

  static getInstance() {
    if (!Singleton.#instance) {
      Singleton.#instance = new Singleton();
    }
    return Singleton.#instance;
  }
}
```

**实际应用场景：**

```javascript
// 场景1: 全局状态管理 (Redux store 简化版)
const createStore = (reducer, initialState) => {
  let state = initialState;
  const listeners = [];

  const getState = () => state;

  const dispatch = (action) => {
    state = reducer(state, action);
    listeners.forEach(listener => listener(state));
  };

  const subscribe = (listener) => {
    listeners.push(listener);
    return () => {
      const index = listeners.indexOf(listener);
      listeners.splice(index, 1);
    };
  };

  return { getState, dispatch, subscribe };
};

// 单例 store
const Store = (function() {
  let store = null;

  return {
    getStore(reducer, initialState) {
      if (!store) {
        store = createStore(reducer, initialState);
      }
      return store;
    }
  };
})();

// 使用
const store = Store.getStore(rootReducer, initialState);

// 场景2: 模态框管理
class ModalManager {
  static instance = null;

  constructor() {
    if (ModalManager.instance) {
      return ModalManager.instance;
    }
    this.activeModals = new Map();
    ModalManager.instance = this;
  }

  open(id, content) {
    if (this.activeModals.has(id)) {
      return this.activeModals.get(id);
    }
    const modal = { id, content, show: true };
    this.activeModals.set(id, modal);
    return modal;
  }

  close(id) {
    this.activeModals.delete(id);
  }

  static getInstance() {
    if (!ModalManager.instance) {
      ModalManager.instance = new ModalManager();
    }
    return ModalManager.instance;
  }
}

// 场景3: 配置管理
const ConfigManager = (() => {
  let instance = null;
  let config = null;

  const loadConfig = async () => {
    // 模拟加载配置
    const response = await fetch('/config.json');
    return await response.json();
  };

  return {
    async getConfig() {
      if (!config) {
        config = await loadConfig();
      }
      return config;
    }
  };
})();
```

**面试考点分析：**

- 单例模式的多种实现方式是面试常考点
- 需要理解各种实现的优缺点
- 理解单例模式的适用场景
- 了解单例与全局变量的区别

### 20.2 工厂模式 (Factory Pattern)

**参考答案：**

工厂模式是一种创建型设计模式，它提供了一种创建对象的最佳方式。在工厂模式中，我们创建对象时不指定具体的类，而是通过工厂函数来创建。

**简单工厂模式：**

```javascript
// 简单工厂 - 将创建逻辑集中在一起
class User {
  constructor(options) {
    this.name = options.name;
    this.viewPage = options.viewPage;
  }

  introduce() {
    return `I am ${this.name}`;
  }
}

// 工厂函数
function createUser(type) {
  const userData = {
    admin: {
      name: 'Admin User',
      viewPage: ['/admin/dashboard', '/admin/settings']
    },
    editor: {
      name: 'Editor User',
      viewPage: ['/editor/drafts', '/editor/published']
    },
    guest: {
      name: 'Guest User',
      viewPage: ['/home']
    }
  };

  const data = userData[type] || userData.guest;
  return new User(data);
}

// 使用
const admin = createUser('admin');
const editor = createUser('editor');
const guest = createUser('guest');
```

**工厂方法模式：**

```javascript
// 工厂方法 - 定义创建对象的接口，让子类决定实例化哪个类
class Product {
  constructor(name) {
    this.name = name;
  }
  operation() {
    return 'Base product operation';
  }
}

class ConcreteProductA extends Product {
  constructor() {
    super('Product A');
  }
  operation() {
    return 'ConcreteProductA operation';
  }
}

class ConcreteProductB extends Product {
  constructor() {
    super('Product B');
  }
  operation() {
    return 'ConcreteProductB operation';
  }
}

// 抽象工厂类
class ProductFactory {
  createProduct() {
    throw new Error('Method createProduct must be implemented');
  }
}

// 具体工厂
class FactoryA extends ProductFactory {
  createProduct() {
    return new ConcreteProductA();
  }
}

class FactoryB extends ProductFactory {
  createProduct() {
    return new ConcreteProductB();
  }
}

// 使用
const factoryA = new FactoryA();
const productA = factoryA.createProduct();
console.log(productA.operation()); // 'ConcreteProductA operation'
```

**抽象工厂模式：**

```javascript
// 抽象工厂 - 创建一系列相关对象的工厂
// 按钮和输入框的抽象工厂

// 抽象产品
class Button {
  render() { throw new Error('Method render must be implemented'); }
}

class Input {
  render() { throw new Error('Method render must be implemented'); }
}

// 具体产品 - Light 主题
class LightButton extends Button {
  render() { return '<button class="light">Click</button>'; }
}

class LightInput extends Input {
  render() { return '<input class="light">'; }
}

// 具体产品 - Dark 主题
class DarkButton extends Button {
  render() { return '<button class="dark">Click</button>'; }
}

class DarkInput extends Input {
  render() { return '<input class="dark">'; }
}

// 抽象工厂
class UIFactory {
  createButton() { throw new Error('Method must be implemented'); }
  createInput() { throw new Error('Method must be implemented'); }
}

// 具体工厂
class LightThemeFactory extends UIFactory {
  createButton() { return new LightButton(); }
  createInput() { return new LightInput(); }
}

class DarkThemeFactory extends UIFactory {
  createButton() { return new DarkButton(); }
  createInput() { return new DarkInput(); }
}

// 使用
function renderUI(factory) {
  const button = factory.createButton();
  const input = factory.createInput();
  return button.render() + input.render();
}

console.log(renderUI(new LightThemeFactory()));
console.log(renderUI(new DarkThemeFactory()));
```

**实际应用场景：**

```javascript
// 场景1: 不同类型消息的创建
class Message {
  send() { throw new Error('Must implement send'); }
}

class EmailMessage extends Message {
  constructor(to, subject, body) {
    super();
    this.to = to;
    this.subject = subject;
    this.body = body;
  }
  send() {
    console.log(`Sending email to ${this.to}: ${this.subject}`);
  }
}

class SMSMessage extends Message {
  constructor(phone, content) {
    super();
    this.phone = phone;
    this.content = content;
  }
  send() {
    console.log(`Sending SMS to ${this.phone}: ${this.content}`);
  }
}

class PushMessage extends Message {
  constructor(deviceToken, title, body) {
    super();
    this.deviceToken = deviceToken;
    this.title = title;
    this.body = body;
  }
  send() {
    console.log(`Sending push to ${this.deviceToken}: ${this.title}`);
  }
}

// 消息工厂
class MessageFactory {
  static createEmail(to, subject, body) {
    return new EmailMessage(to, subject, body);
  }
  static createSMS(phone, content) {
    return new SMSMessage(phone, content);
  }
  static createPush(deviceToken, title, body) {
    return new PushMessage(deviceToken, title, body);
  }
}

// 使用
const email = MessageFactory.createEmail('user@example.com', 'Welcome', 'Hello!');
email.send();

const sms = MessageFactory.createSMS('1234567890', 'Your code is 1234');
sms.send();

// 场景2: 图表创建工厂
class Chart {
  render() { throw new Error('Must implement render'); }
}

class LineChart extends Chart {
  render() { return 'Rendering line chart'; }
}

class BarChart extends Chart {
  render() { return 'Rendering bar chart'; }
}

class PieChart extends Chart {
  render() { return 'Rendering pie chart'; }
}

class ChartFactory {
  static createChart(type, data) {
    const charts = {
      line: LineChart,
      bar: BarChart,
      pie: PieChart
    };
    const ChartClass = charts[type.toLowerCase()];
    if (!ChartClass) {
      throw new Error(`Unknown chart type: ${type}`);
    }
    return new ChartClass(data);
  }
}

// 使用
const lineChart = ChartFactory.createChart('line', [1, 2, 3]);
console.log(lineChart.render());
```

**工厂模式 vs 构造函数：**

```javascript
// 使用构造函数
const user = new User({ name: 'Alice', role: 'admin' });

// 使用工厂函数
const user = createUser({ name: 'Alice', role: 'admin' });

// 工厂函数的优势：
// 1. 不需要使用 new
// 2. 可以返回任意对象
// 3. 可以隐藏复杂的创建逻辑
// 4. 可以轻松返回子类实例

// 工厂函数的劣势：
// 1. 无法使用 instanceof
// 2. 无法访问 prototype
// 3. 占用更多内存（每个实例都有独立的方法）
```

**面试考点分析：**

- 理解工厂模式的三种类型（简单工厂、工厂方法、抽象工厂）
- 了解工厂模式与构造函数的区别
- 理解工厂模式的适用场景
- 了解如何根据场景选择合适的工厂类型

### 20.3 观察者模式 (Observer Pattern)

**参考答案：**

观察者模式定义了一种一对多的依赖关系，当一个对象的状态发生变化时，所有依赖于它的对象都会得到通知并自动更新。

**核心概念：**

```
┌─────────────────────────────────────────────────────────────────┐
│                    观察者模式结构                                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│   ┌─────────────┐                              ┌─────────────┐ │
│   │   Subject   │◄─────────────────────────────│   Observer  │ │
│   │  (主题/被观察者) │     1. 注册观察者         │   (观察者)   │ │
│   ├─────────────┤                              └─────────────┘ │
│   │ + observers │     2. 移除观察者                   ▲        │
│   │ + subscribe │                                   │        │
│   │ + unsubscribe│     3. 通知观察者                  │        │
│   │ + notify    │──────────────────────────────────┘        │
│   └─────────────┘                                               │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

**基本实现：**

```javascript
// 被观察者类
class Subject {
  constructor() {
    this.observers = [];
    this.state = null;
  }

  // 添加观察者
  subscribe(observer) {
    if (observer && observer.update) {
      this.observers.push(observer);
    }
    return this; // 支持链式调用
  }

  // 移除观察者
  unsubscribe(observer) {
    const index = this.observers.indexOf(observer);
    if (index > -1) {
      this.observers.splice(index, 1);
    }
    return this;
  }

  // 通知所有观察者
  notify() {
    this.observers.forEach(observer => {
      observer.update(this.state);
    });
  }

  // 设置状态并通知
  setState(state) {
    this.state = state;
    this.notify();
  }

  // 获取状态
  getState() {
    return this.state;
  }
}

// 观察者类
class Observer {
  constructor(name) {
    this.name = name;
  }

  update(state) {
    console.log(`${this.name} received state: ${state}`);
  }
}

// 使用
const subject = new Subject();

const observer1 = new Observer('Observer1');
const observer2 = new Observer('Observer2');
const observer3 = new Observer('Observer3');

subject.subscribe(observer1);
subject.subscribe(observer2);
subject.subscribe(observer3);

subject.setState('Hello'); // 所有观察者都会收到通知
// Observer1 received state: Hello
// Observer2 received state: Hello
// Observer3 received state: Hello

subject.unsubscribe(observer2);
subject.setState('World');
// Observer1 received state: World
// Observer3 received state: World
```

**实际应用场景：**

```javascript
// 场景1: EventEmitter 实现
class EventEmitter {
  constructor() {
    this.events = {};
  }

  on(event, listener) {
    if (!this.events[event]) {
      this.events[event] = [];
    }
    this.events[event].push(listener);
    return this;
  }

  once(event, listener) {
    const wrapper = (...args) => {
      listener.apply(this, args);
      this.off(event, wrapper);
    };
    return this.on(event, wrapper);
  }

  off(event, listener) {
    if (!this.events[event]) return this;
    this.events[event] = this.events[event].filter(l => l !== listener);
    return this;
  }

  emit(event, ...args) {
    if (!this.events[event]) return this;
    this.events[event].forEach(listener => {
      listener.apply(this, args);
    });
    return this;
  }

  removeAllListeners(event) {
    if (event) {
      delete this.events[event];
    } else {
      this.events = {};
    }
    return this;
  }
}

// 使用
const emitter = new EventEmitter();

emitter.on('message', (data) => {
  console.log('Message received:', data);
});

emitter.once('connect', () => {
  console.log('Connected once');
});

emitter.emit('message', { text: 'Hello' });
emitter.emit('message', { text: 'World' });
emitter.emit('connect');

// 场景2: 响应式数据绑定
class Reactive {
  constructor(initialValue) {
    this.value = initialValue;
    this.subscribers = new Map();
  }

  subscribe(key, callback) {
    if (!this.subscribers.has(key)) {
      this.subscribers.set(key, []);
    }
    this.subscribers.get(key).push(callback);
  }

  set(key, value) {
    this.value[key] = value;
    const callbacks = this.subscribers.get(key) || [];
    callbacks.forEach(cb => cb(value));
  }

  get(key) {
    return this.value[key];
  }
}

// 使用
const state = new Reactive({ count: 0, name: 'Alice' });

state.subscribe('count', (newValue) => {
  console.log(`Count changed to: ${newValue}`);
});

state.set('count', 1);  // Count changed to: 1
state.set('count', 2);  // Count changed to: 2

// 场景3: DOM 事件系统
class DOMEventEmitter {
  constructor(element) {
    this.element = element;
    this.events = {};
  }

  on(eventType, handler) {
    this.element.addEventListener(eventType, handler);
    if (!this.events[eventType]) {
      this.events[eventType] = [];
    }
    this.events[eventType].push(handler);
    return this;
  }

  off(eventType, handler) {
    this.element.removeEventListener(eventType, handler);
    if (this.events[eventType]) {
      this.events[eventType] = this.events[eventType].filter(h => h !== handler);
    }
    return this;
  }

  trigger(eventType, data) {
    const event = new CustomEvent(eventType, { detail: data });
    this.element.dispatchEvent(event);
    return this;
  }
}

// 使用
const button = document.querySelector('#myButton');
const emitter = new DOMEventEmitter(button);

emitter.on('click', (e) => {
  console.log('Button clicked');
}).on('mouseenter', (e) => {
  console.log('Mouse entered');
});
```

**观察者模式 vs 发布订阅模式：**

```javascript
// 观察者模式：观察者直接订阅主题，主题直接通知观察者
// Subject <--> Observer（直接通信）

// 发布订阅模式：发布者和订阅者不直接通信，通过消息代理/事件总线
// Publisher --> EventChannel <--> Subscriber
// 有一层中间层（事件总线/消息代理）

// 发布订阅模式实现
class PubSub {
  constructor() {
    this.topics = {};
  }

  subscribe(topic, callback) {
    if (!this.topics[topic]) {
      this.topics[topic] = [];
    }
    this.topics[topic].push(callback);
    return () => {
      this.topics[topic] = this.topics[topic].filter(cb => cb !== callback);
    };
  }

  publish(topic, data) {
    if (!this.topics[topic]) return;
    this.topics[topic].forEach(callback => callback(data));
  }
}

// 使用
const pubsub = new PubSub();

// 用户模块发布事件
const unsubscribe = pubsub.subscribe('user:login', (user) => {
  console.log(`User ${user.name} logged in`);
});

// 登录模块发布事件
pubsub.publish('user:login', { name: 'Alice', id: 1 });
pubsub.publish('user:login', { name: 'Bob', id: 2 });

// 取消订阅
unsubscribe();
```

**面试考点分析：**

- 观察者模式的核心结构（Subject/Observer）
- 观察者模式与发布订阅模式的区别
- 实际应用场景（DOM 事件、EventEmitter、响应式框架）
- 了解观察者模式的优缺点

### 20.4 发布订阅模式 (Publish-Subscribe Pattern)

**参考答案：**

发布订阅模式是观察者模式的一种变体，它引入了一个消息代理/事件通道，使得发布者和订阅者不需要直接交互。这种模式解耦了发布者和订阅者。

**核心概念：**

```
┌─────────────────────────────────────────────────────────────────┐
│                  发布订阅模式结构                                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│   ┌──────────┐         ┌────────────────┐         ┌──────────┐ │
│   │  Publisher │────────►│   Event Bus    │◄────────│Subscriber│ │
│   │  (发布者)  │         │  (事件总线)     │         │ (订阅者)  │ │
│   └──────────┘         └────────────────┘         └──────────┘ │
│                                  │                               │
│                          ┌───────┴───────┐                       │
│                          │  Topic Map   │                       │
│                          │  channel1: []│                       │
│                          │  channel2: []│                       │
│                          └───────────────┘                       │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

**完整实现：**

```javascript
class PubSub {
  constructor() {
    // 存储所有主题及其回调函数
    this.topics = new Map();
    // 存储订阅者 ID，用于支持 unsubscribe
    this.subscriberId = 0;
    this.subscriptions = new Map();
  }

  // 订阅主题
  subscribe(topic, callback, context = null) {
    if (!this.topics.has(topic)) {
      this.topics.set(topic, []);
    }

    const id = ++this.subscriberId;
    const subscription = {
      id,
      topic,
      callback,
      context
    };

    this.topics.get(topic).push(subscription);
    this.subscriptions.set(id, subscription);

    // 返回取消订阅的函数
    return () => this.unsubscribe(id);
  }

  // 订阅一次（自动取消订阅）
  subscribeOnce(topic, callback, context = null) {
    if (!this.topics.has(topic)) {
      this.topics.set(topic, []);
    }

    const wrapper = (...args) => {
      callback.apply(context, args);
      this.unsubscribe(wrapper.__subId__);
    };

    const id = ++this.subscriberId;
    wrapper.__subId__ = id;

    const subscription = {
      id,
      topic,
      callback: wrapper,
      context
    };

    this.topics.get(topic).push(subscription);
    this.subscriptions.set(id, subscription);

    return () => this.unsubscribe(id);
  }

  // 取消订阅
  unsubscribe(idOrTopic, callback = null) {
    // 如果只传入 topic，取消该主题所有订阅
    if (callback === null && typeof idOrTopic === 'string') {
      const topic = idOrTopic;
      if (this.topics.has(topic)) {
        this.topics.get(topic).forEach(sub => {
          this.subscriptions.delete(sub.id);
        });
        this.topics.delete(topic);
      }
      return this;
    }

    // 如果传入 ID，取消指定订阅
    const id = idOrTopic;
    if (this.subscriptions.has(id)) {
      const sub = this.subscriptions.get(id);
      const topicSubs = this.topics.get(sub.topic);
      const index = topicSubs.findIndex(s => s.id === id);
      if (index > -1) {
        topicSubs.splice(index, 1);
      }
      this.subscriptions.delete(id);
    }
    return this;
  }

  // 发布消息
  publish(topic, data = {}) {
    if (!this.topics.has(topic)) {
      return false;
    }

    const subscribers = this.topics.get(topic);
    subscribers.forEach(sub => {
      try {
        sub.callback.call(sub.context, data);
      } catch (error) {
        console.error(`Error in subscriber for topic "${topic}":`, error);
      }
    });

    return true;
  }

  // 批量发布
  publishBatch(topic, dataArray) {
    return dataArray.map(data => this.publish(topic, data));
  }

  // 获取主题的订阅者数量
  getSubscriberCount(topic) {
    return this.topics.get(topic)?.length || 0;
  }

  // 获取所有主题
  getTopics() {
    return Array.from(this.topics.keys());
  }

  // 清空所有订阅
  clear() {
    this.topics.clear();
    this.subscriptions.clear();
    return this;
  }
}

// 使用示例
const pubsub = new PubSub();

// 订阅
const unsub1 = pubsub.subscribe('user:login', (data) => {
  console.log('Subscriber 1:', data);
});

const unsub2 = pubsub.subscribe('user:login', (data) => {
  console.log('Subscriber 2:', data);
});

const unsub3 = pubsub.subscribe('user:logout', (data) => {
  console.log('Subscriber 3:', data);
});

// 订阅一次
pubsub.subscribeOnce('user:register', (data) => {
  console.log('One-time subscriber:', data);
});

// 发布
pubsub.publish('user:login', { username: 'alice', time: Date.now() });
// Subscriber 1: { username: 'alice', time: ... }
// Subscriber 2: { username: 'alice', time: ... }

// 取消订阅
unsub1();
pubsub.publish('user:login', { username: 'bob', time: Date.now() });
// 只有 Subscriber 2 会收到

// 使用上下文
class NotificationManager {
  constructor(pubsub) {
    this.pubsub = pubsub;
    this.userId = null;
  }

  init(userId) {
    this.userId = userId;
    this.pubsub.subscribe('notification', this.handleNotification, this);
  }

  handleNotification(data) {
    console.log(`User ${this.userId} received: ${data.message}`);
  }
}

const manager = new NotificationManager(pubsub);
manager.init(123);
pubsub.publish('notification', { message: 'Hello!' });
// User 123 received: Hello!
```

**实际应用场景：**

```javascript
// 场景1: 模块间通信
// eventBus.js
const eventBus = new PubSub();
export default eventBus;

// userModule.js
import eventBus from './eventBus.js';

export function login(credentials) {
  // 登录逻辑
  const user = { id: 1, name: 'Alice' };
  eventBus.publish('user:login', user);
  return user;
}

export function logout() {
  eventBus.publish('user:logout', { id: 1 });
}

// analyticsModule.js
import eventBus from './eventBus.js';

eventBus.subscribe('user:login', (user) => {
  console.log('Analytics: User logged in', user.id);
});

eventBus.subscribe('user:logout', (data) => {
  console.log('Analytics: User logged out', data.id);
});

// 场景2: 组件间通信
class EventBus {
  constructor() {
    this.eventBus = new PubSub();
  }

  // 在 Vue/React 中可以使用 mixin 或 HOC 简化
  $on(event, callback, context = null) {
    return this.eventBus.subscribe(event, callback, context);
  }

  $once(event, callback, context = null) {
    return this.eventBus.subscribeOnce(event, callback, context);
  }

  $emit(event, data) {
    return this.eventBus.publish(event, data);
  }

  $off(eventOrId) {
    return this.eventBus.unsubscribe(eventOrId);
  }
}

// Vue 插件形式
const VueEventBus = {
  install(Vue) {
    const eventBus = new EventBus();
    Vue.prototype.$bus = eventBus;
    Vue.mixin({
      beforeCreate() {
        this.$bus = eventBus;
      }
    });
  }
};

// 使用
// Vue.component('Child1', {
//   mounted() {
//     this.$bus.$on('message', this.handleMessage);
//   },
//   beforeDestroy() {
//     this.$bus.$off('message', this.handleMessage);
//   },
//   methods: {
//     handleMessage(msg) {
//       console.log('Received:', msg);
//     }
//   }
// });
```

**面试考点分析：**

- 理解发布订阅模式的核心结构
- 与观察者模式的区别（解耦程度）
- 实现一个完整的 Event Bus
- 了解优缺点（优点：解耦、灵活；缺点：难以追踪、可能内存泄漏）

### 20.5 装饰器模式 (Decorator Pattern)

**参考答案：**

装饰器模式允许在运行时动态地给对象添加额外的职责，比继承更加灵活。它通过将对象包装在装饰器中，在不改变原对象的情况下为其添加新功能。

**核心概念：**

```
┌─────────────────────────────────────────────────────────────────┐
│                   装饰器模式结构                                  │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│   ┌──────────────┐                                             │
│   │   Component  │  (基础组件接口)                               │
│   │  (抽象组件)   │                                             │
│   └──────┬───────┘                                             │
│          │                                                     │
│    ┌─────┴─────┐                                               │
│    │           │                                               │
│ ┌──▼────┐  ┌───▼──────┐                                        │
│ │Concrete│  │Decorator│  (装饰器 - 包装 Component)              │
│ │Component   │  ├────────────┤                                 │
│ └────────┘  │ ConcreteDecoratorA │  (添加职责 A)               │
│             │  ├────────────┤                                 │
│             │ ConcreteDecoratorB │  (添加职责 B)               │
│             │  └────────────┘                                 │
│             └──────────────────┘                                │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

**ES5 实现：**

```javascript
// 基础组件
function Coffee() {
  this.cost = function() {
    return 5;
  };
}

// 装饰器基类
function CoffeeDecorator(coffee) {
  this.coffee = coffee;
  this.cost = function() {
    return this.coffee.cost();
  };
}

// 具体装饰器 - 牛奶
function Milk(coffee) {
  CoffeeDecorator.call(this, coffee);
  this.cost = function() {
    return this.coffee.cost() + 1.5;
  };
  this.description = function() {
    return this.coffee.description() + ', Milk';
  };
}

// 具体装饰器 - 糖
function Sugar(coffee) {
  CoffeeDecorator.call(this, coffee);
  this.cost = function() {
    return this.coffee.cost() + 0.5;
  };
  this.description = function() {
    return this.coffee.description() + ', Sugar';
  };
}

// 具体装饰器 - 巧克力
function Chocolate(coffee) {
  CoffeeDecorator.call(this, coffee);
  this.cost = function() {
    return this.coffee.cost() + 2;
  };
  this.description = function() {
    return this.coffee.description() + ', Chocolate';
  };
}

// 添加 description 方法到基础类
Coffee.prototype.description = function() { return 'Coffee'; };

// 使用
let myCoffee = new Coffee();
console.log(`${myCoffee.description()} - $${myCoffee.cost()}`);
// Coffee - $5

myCoffee = new Milk(myCoffee);
console.log(`${myCoffee.description()} - $${myCoffee.cost()}`);
// Coffee, Milk - $6.5

myCoffee = new Sugar(myCoffee);
console.log(`${myCoffee.description()} - $${myCoffee.cost()}`);
// Coffee, Milk, Sugar - $7

myCoffee = new Chocolate(myCoffee);
console.log(`${myCoffee.description()} - $${myCoffee.cost()}`);
// Coffee, Milk, Sugar, Chocolate - $9
```

**ES6 Class 实现：**

```javascript
// 基础接口
class Component {
  operation() {
    return 'Component operation';
  }
}

// 具体组件
class ConcreteComponent extends Component {
  operation() {
    return 'ConcreteComponent: Basic operation';
  }
}

// 基础装饰器
class Decorator extends Component {
  constructor(component) {
    super();
    this.component = component;
  }

  operation() {
    return this.component.operation();
  }
}

// 具体装饰器 A
class ConcreteDecoratorA extends Decorator {
  operation() {
    return `DecoratorA(${super.operation()})`;
  }

  addedBehavior() {
    return 'DecoratorA: Added behavior';
  }
}

// 具体装饰器 B
class ConcreteDecoratorB extends Decorator {
  operation() {
    return `DecoratorB(${super.operation()})`;
  }

  addedMethod() {
    return 'DecoratorB: Added method';
  }
}

// 使用
const component = new ConcreteComponent();
const decoratorA = new ConcreteDecoratorA(component);
const decoratorB = new ConcreteDecoratorB(decoratorA);

console.log(component.operation());
// ConcreteComponent: Basic operation

console.log(decoratorA.operation());
// DecoratorA(ConcreteComponent: Basic operation)

console.log(decoratorB.operation());
// DecoratorB(DecoratorA(ConcreteComponent: Basic operation))
```

**函数式装饰器：**

```javascript
// 函数式装饰器 - 更符合 JavaScript 特性
function log(fn) {
  return function(...args) {
    console.log(`Calling ${fn.name} with args:`, args);
    const result = fn.apply(this, args);
    console.log(`Result:`, result);
    return result;
  };
}

function memoize(fn) {
  const cache = new Map();
  return function(...args) {
    const key = JSON.stringify(args);
    if (cache.has(key)) {
      console.log(`Cache hit for ${fn.name}`);
      return cache.get(key);
    }
    const result = fn.apply(this, args);
    cache.set(key, result);
    return result;
  };
}

function throttle(fn, delay) {
  let lastCall = 0;
  return function(...args) {
    const now = Date.now();
    if (now - lastCall >= delay) {
      lastCall = now;
      return fn.apply(this, args);
    }
  };
}

function debounce(fn, delay) {
  let timeoutId;
  return function(...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn.apply(this, args), delay);
  };
}

// 使用装饰器
class MathService {
  @log
  add(a, b) {
    return a + b;
  }

  @memoize
  fibonacci(n) {
    console.log(`Calculating fibonacci(${n})...`);
    if (n <= 1) return n;
    return this.fibonacci(n - 1) + this.fibonacci(n - 2);
  }
}

const service = new MathService();
service.add(1, 2);
// Calling add with args: [1, 2]
// Result: 3

service.fibonacci(5);
// Calculating fibonacci(5)...
// Calculating fibonacci(4)...
// Calculating fibonacci(3)...
// Calculating fibonacci(2)...
// Calculating fibonacci(1)...
// Calculating fibonacci(0)...
// 结果会被缓存
service.fibonacci(5);
// Cache hit for fibonacci(5)
// 直接返回缓存结果
```

**实际应用场景：**

```javascript
// 场景1: 表单验证装饰器
function required(target, propertyKey, descriptor) {
  const originalMethod = descriptor.value;
  descriptor.value = function(...args) {
    const params = args[0];
    for (const key of propertyKey.split('.')) {
      if (params[key] === undefined || params[key] === null || params[key] === '') {
        throw new Error(`${key} is required`);
      }
    }
    return originalMethod.apply(this, args);
  };
  return descriptor;
}

function validate(target, propertyKey, descriptor) {
  const originalMethod = descriptor.value;
  descriptor.value = function(...args) {
    const params = args[0];
    const validators = target.constructor.validators?.[propertyKey];

    if (validators) {
      for (const { field, validate: validator, message } of validators) {
        const value = params[field];
        if (!validator(value)) {
          throw new Error(message || `Validation failed for ${field}`);
        }
      }
    }
    return originalMethod.apply(this, args);
  };
  return descriptor;
}

class UserService {
  static validators = {
    createUser: [
      { field: 'email', validate: v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v), message: 'Invalid email' },
      { field: 'age', validate: v => v >= 18, message: 'Must be 18 or older' }
    ]
  };

  @validate
  @required
  createUser(data) {
    console.log('Creating user:', data);
    return { success: true, user: data };
  }

  @required
  updateUser(data) {
    console.log('Updating user:', data);
    return { success: true };
  }
}

const service = new UserService();
service.createUser({ email: 'test@example.com', age: 25 });
// Creating user: { email: 'test@example.com', age: 25 }

service.createUser({ email: 'invalid', age: 25 });
// Error: Invalid email

service.createUser({ email: 'test@example.com', age: 15 });
// Error: Must be 18 or older
```

**面试考点分析：**

- 理解装饰器模式的核心思想（动态添加职责）
- 与继承/子类化的区别
- 函数式装饰器的实现方式
- 了解 ES7 装饰器提案的语法

### 20.6 代理模式 (Proxy Pattern)

**参考答案：**

代理模式为另一个对象提供一个替身或占位符，以控制对原始对象的访问。代理对象可以在访问对象时添加额外的逻辑，如懒加载、访问控制、缓存等。

**核心概念：**

```
┌─────────────────────────────────────────────────────────────────┐
│                    代理模式结构                                   │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│   ┌──────────────────┐                                         │
│   │     Client       │                                         │
│   └────────┬─────────┘                                         │
│            │                                                    │
│            │ request()                                          │
│            ▼                                                    │
│   ┌──────────────────┐                                         │
│   │     Proxy       │────────┐                                 │
│   │    (代理对象)    │        │                                 │
│   └────────┬─────────┘        │                                │
│            │                   │                                 │
│            │ validate()        │ RealSubject                   │
│            │ cache()           │ (真实对象)                     │
│            │ log()             │                                │
│            ▼                   ▼                                │
│   ┌──────────────────┐     ┌──────────────────┐               │
│   │   Subject        │     │   RealSubject    │               │
│   │   (抽象主题)     │     │  (真实主题)       │               │
│   └──────────────────┘     └──────────────────┘               │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

**ES6 Proxy 基本用法：**

```javascript
// ES6 Proxy 语法
const proxy = new Proxy(target, handler);

// handler 中可定义的操作：
// get(target, prop, receiver) - 获取属性
// set(target, prop, value, receiver) - 设置属性
// has(target, prop) - in 运算符
// deleteProperty(target, prop) - delete 运算符
// apply(target, thisArg, args) - 函数调用
// construct(target, args) - new 操作符
// getPrototypeOf(target) - Object.getPrototypeOf
// setPrototypeOf(target, proto) - Object.setPrototypeOf
// isExtensible(target) - Object.isExtensible
// preventExtensions(target) - Object.preventExtensions
// getOwnPropertyDescriptor(target, prop) - Object.getOwnPropertyDescriptor
// defineProperty(target, prop, descriptor) - Object.defineProperty
// ownKeys(target) - Object.keys, Object.getOwnPropertyNames
```

**常见代理模式实现：**

```javascript
// 1. 访问控制代理
class SecureProxy {
  constructor(realSubject, userPermissions) {
    return new Proxy(realSubject, {
      get(target, prop, receiver) {
        const userRole = userPermissions.role;

        // 定义权限映射
        const permissionMap = {
          'admin': ['name', 'email', 'salary', 'secretData'],
          'manager': ['name', 'email', 'department'],
          'employee': ['name', 'email']
        };

        const allowedProps = permissionMap[userRole] || [];

        if (allowedProps.includes(prop)) {
          return Reflect.get(target, prop, receiver);
        } else if (typeof target[prop] === 'function') {
          // 返回一个包装函数，带权限检查
          return function(...args) {
            if (allowedProps.includes(prop)) {
              return target[prop].apply(target, args);
            }
            throw new Error(`Permission denied: ${prop}`);
          };
        }

        throw new Error(`Access denied: ${String(prop)}`);
      }
    });
  }
}

// 使用
const user = {
  name: 'Alice',
  email: 'alice@example.com',
  salary: 100000,
  secretData: 'Very secret',
  deleteAccount() { return 'Account deleted'; }
};

const adminUser = new SecureProxy(user, { role: 'admin' });
console.log(adminUser.name);      // Alice
console.log(adminUser.salary);     // 100000

const employeeUser = new SecureProxy(user, { role: 'employee' });
console.log(employeeUser.name);    // Alice
console.log(employeeUser.salary);  // Error: Access denied: salary

// 2. 懒加载代理（虚拟代理）
class LazyImage {
  constructor(url) {
    this.url = url;
    this.loaded = false;
    this.image = null;
  }

  load() {
    if (this.loaded) return;

    console.log(`Loading image: ${this.url}`);
    this.image = new Image();
    this.image.src = this.url;
    this.image.onload = () => {
      this.loaded = true;
    };
  }

  render(container) {
    if (!this.loaded) {
      // 显示占位符
      container.innerHTML = `<div class="placeholder">Loading...</div>`;
      // 异步加载
      this.load();
      this.image.onload = () => {
        container.innerHTML = '';
        container.appendChild(this.image);
      };
    } else if (this.image) {
      container.appendChild(this.image);
    }
  }
}

function createLazyImage(url) {
  let image = null;

  return new Proxy({}, {
    get(target, prop) {
      if (!image) {
        image = new LazyImage(url);
      }
      return image[prop];
    }
  });
}

// 使用
const lazyImage = createLazyImage('https://example.com/huge-image.jpg');
// 此时不会加载图片，只是创建了代理

// 3. 缓存代理
function createCacheProxy(fn) {
  const cache = new Map();

  return new Proxy(fn, {
    apply(target, thisArg, args) {
      const key = JSON.stringify(args);

      if (cache.has(key)) {
        console.log(`Cache hit for ${key}`);
        return cache.get(key);
      }

      console.log(`Cache miss for ${key}`);
      const result = target.apply(thisArg, args);
      cache.set(key, result);
      return result;
    }
  });
}

// 使用
const fibonacci = createCacheProxy(function fib(n) {
  if (n <= 1) return n;
  return fib(n - 1) + fib(n - 2);
});

console.log(fibonacci(10));  // 计算并缓存
console.log(fibonacci(10));  // 从缓存返回

// 4. 日志代理
function createLoggingProxy(obj) {
  return new Proxy(obj, {
    get(target, prop, receiver) {
      const value = Reflect.get(target, prop, receiver);

      if (typeof value === 'function') {
        return function(...args) {
          console.log(`[LOG] Calling ${String(prop)} with args:`, args);
          const result = value.apply(this, args);
          console.log(`[LOG] ${String(prop)} returned:`, result);
          return result;
        };
      }

      console.log(`[LOG] Getting property ${String(prop)}:`, value);
      return value;
    },

    set(target, prop, value, receiver) {
      console.log(`[LOG] Setting property ${String(prop)} to:`, value);
      return Reflect.set(target, prop, value, receiver);
    }
  });
}

// 使用
const user = createLoggingProxy({
  name: 'Alice',
  greet() {
    return `Hello, ${this.name}`;
  }
});

user.name = 'Bob';       // [LOG] Setting property name to: Bob
user.greet();           // [LOG] Calling greet with args: []
                        // [LOG] greet returned: Hello, Bob
```

**实际应用场景：**

```javascript
// 场景1: 实现响应式系统
function reactive(obj) {
  const handlers = new Map();
  const reactivity = new Proxy(obj, {
    get(target, prop, receiver) {
      track(target, prop);
      const value = Reflect.get(target, prop, receiver);

      // 如果是对象，递归创建响应式
      if (value && typeof value === 'object') {
        return reactive(value);
      }

      return value;
    },

    set(target, prop, value, receiver) {
      const result = Reflect.set(target, prop, value, receiver);
      trigger(target, prop, value);
      return result;
    },

    deleteProperty(target, prop) {
      const result = Reflect.deleteProperty(target, prop);
      trigger(target, prop, undefined, 'delete');
      return result;
    }
  });

  function track(target, prop) {
    // 收集依赖
  }

  function trigger(target, prop, value, type = 'set') {
    const effects = handlers.get(target)?.[prop];
    if (effects) {
      effects.forEach(effect => effect(value));
    }
  }

  return reactivity;
}

// 使用
const state = reactive({
  count: 0,
  user: { name: 'Alice' }
});

state.count;   // 触发 track
state.count++; // 触发 trigger

// 场景2: 表单验证代理
function createValidatedForm(formData, validators) {
  return new Proxy(formData, {
    set(target, prop, value) {
      const validator = validators[prop];
      if (validator && !validator(value)) {
        throw new Error(`Validation failed for ${prop}: ${value}`);
      }
      return Reflect.set(target, prop, value);
    }
  });
}

const validators = {
  email: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v),
  age: (v) => v >= 0 && v <= 150,
  name: (v) => v.length >= 2 && v.length <= 50
};

const form = createValidatedForm({}, validators);
form.email = 'test@example.com';  // OK
form.email = 'invalid';          // Error
```

**面试考点分析：**

- ES6 Proxy 的 API 和使用方式
- 代理模式的各种应用场景
- 与装饰器模式的区别
- 了解 Proxy 在 Vue3 响应式系统中的应用

### 20.7 状态模式 (State Pattern)

**参考答案：**

状态模式允许对象在内部状态改变时改变它的行为。对象看起来好像修改了它的类。状态模式将状态封装为独立的对象，并将行为委托给当前状态对象。

**核心概念：**

```
┌─────────────────────────────────────────────────────────────────┐
│                    状态模式结构                                  │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│   ┌─────────────────────────────────────────────────────────┐   │
│   │                      Context                            │   │
│   │                      (上下文)                             │   │
│   │  ┌─────────────────────────────────────────────────┐    │   │
│   │  │ - state: State                                   │    │   │
│   │  │ - request() { this.state.handle() }             │    │   │
│   │  └─────────────────────────────────────────────────┘    │   │
│   └─────────────────────┬───────────────────────────────────┘   │
│                         │                                        │
│                         │ delegates                               │
│                         ▼                                        │
│   ┌─────────────────────────────────────────────────────────┐   │
│   │                    State                                 │   │
│   │                   (抽象状态)                              │   │
│   │  ┌─────────────────────────────────────────────────┐    │   │
│   │  │ + handle(context)                                │    │   │
│   │  └─────────────────────────────────────────────────┘    │   │
│   └─────────────────────┬───────────────────────────────────┘   │
│                         │                                        │
│        ┌────────────────┼────────────────┐                       │
│        ▼                ▼                ▼                       │
│  ┌───────────┐   ┌───────────┐   ┌───────────┐                   │
│  │ StateA    │   │ StateB    │   │ StateC    │                   │
│  │ (具体状态) │   │ (具体状态) │   │ (具体状态) │                   │
│  └───────────┘   └───────────┘   └───────────┘                   │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

**基本实现：**

```javascript
// 状态接口
class State {
  handle(context) {
    throw new Error('Method handle must be implemented');
  }
}

// 具体状态 - 已下单
class OrderPlacedState extends State {
  handle(context) {
    console.log('Order has been placed');
    // 可以执行下单后的操作
    // 转换到下一个状态
    context.setState(new OrderPaidState());
  }
}

// 具体状态 - 已支付
class OrderPaidState extends State {
  handle(context) {
    console.log('Order has been paid');
    context.setState(new OrderShippedState());
  }
}

// 具体状态 - 已发货
class OrderShippedState extends State {
  handle(context) {
    console.log('Order has been shipped');
    context.setState(new OrderDeliveredState());
  }
}

// 具体状态 - 已送达
class OrderDeliveredState extends State {
  handle(context) {
    console.log('Order has been delivered');
    // 订单完成
  }
}

// 上下文
class Order {
  constructor() {
    // 初始状态
    this.state = new OrderPlacedState();
  }

  setState(state) {
    this.state = state;
  }

  process() {
    this.state.handle(this);
  }
}

// 使用
const order = new Order();
order.process();  // Order has been placed
order.process();  // Order has been paid
order.process();  // Order has been shipped
order.process();  // Order has been delivered
```

**实际应用场景：**

```javascript
// 场景1: 播放器状态管理
class MediaPlayerState {
  play() { throw new Error('Must implement'); }
  pause() { throw new Error('Must implement'); }
  stop() { throw new Error('Must implement'); }
}

class PlayingState extends MediaPlayerState {
  constructor(player) {
    super();
    this.player = player;
  }

  play() {
    console.log('Already playing');
  }

  pause() {
    console.log('Pausing...');
    this.player.setState(new PausedState(this.player));
  }

  stop() {
    console.log('Stopping...');
    this.player.setState(new StoppedState(this.player));
  }
}

class PausedState extends MediaPlayerState {
  constructor(player) {
    super();
    this.player = player;
  }

  play() {
    console.log('Resuming...');
    this.player.setState(new PlayingState(this.player));
  }

  pause() {
    console.log('Already paused');
  }

  stop() {
    console.log('Stopping...');
    this.player.setState(new StoppedState(this.player));
  }
}

class StoppedState extends MediaPlayerState {
  constructor(player) {
    super();
    this.player = player;
  }

  play() {
    console.log('Starting playback...');
    this.player.setState(new PlayingState(this.player));
  }

  pause() {
    console.log('Cannot pause: player is stopped');
  }

  stop() {
    console.log('Already stopped');
  }
}

// 媒体播放器上下文
class MediaPlayer {
  constructor() {
    this.state = new StoppedState(this);
    this.currentTrack = null;
  }

  setState(state) {
    this.state = state;
  }

  play() {
    this.state.play.call(this);
  }

  pause() {
    this.state.pause.call(this);
  }

  stop() {
    this.state.stop.call(this);
  }

  setTrack(track) {
    this.currentTrack = track;
    console.log(`Loaded: ${track}`);
  }
}

// 使用
const player = new MediaPlayer();
player.setTrack('Song A');

player.play();    // Starting playback...
player.pause();   // Pausing...
player.play();   // Resuming...
player.stop();    // Stopping...
```

```javascript
// 场景2: 购物车状态
class ShoppingCart {
  constructor() {
    this.items = [];
    this.state = new EmptyCartState(this);
  }

  setState(state) {
    this.state = state;
  }

  addItem(item) {
    this.state.addItem(item);
  }

  removeItem(itemId) {
    this.state.removeItem(itemId);
  }

  checkout() {
    this.state.checkout();
  }
}

class EmptyCartState {
  constructor(cart) {
    this.cart = cart;
  }

  addItem(item) {
    this.cart.items.push(item);
    this.cart.setState(new ActiveCartState(this.cart));
    console.log(`Added: ${item.name}`);
  }

  removeItem(itemId) {
    console.log('Cart is empty');
  }

  checkout() {
    console.log('Cart is empty');
  }
}

class ActiveCartState {
  constructor(cart) {
    this.cart = cart;
  }

  addItem(item) {
    this.cart.items.push(item);
    console.log(`Added: ${item.name}`);
  }

  removeItem(itemId) {
    const index = this.cart.items.findIndex(i => i.id === itemId);
    if (index > -1) {
      this.cart.items.splice(index, 1);
      console.log(`Removed: ${itemId}`);

      if (this.cart.items.length === 0) {
        this.cart.setState(new EmptyCartState(this.cart));
      }
    }
  }

  checkout() {
    console.log('Proceeding to checkout...');
    this.cart.setState(new CheckoutState(this.cart));
  }
}

class CheckoutState {
  constructor(cart) {
    this.cart = cart;
  }

  addItem(item) {
    console.log('Cannot add items during checkout');
  }

  removeItem(itemId) {
    console.log('Cannot remove items during checkout');
  }

  checkout() {
    console.log('Already in checkout');
  }
}

// 使用
const cart = new ShoppingCart();
cart.addItem({ id: 1, name: 'Apple', price: 5 });
cart.addItem({ id: 2, name: 'Banana', price: 3 });
cart.removeItem(1);
cart.checkout();
```

```javascript
// 场景3: 有限状态机 (FSM)
class StateMachine {
  constructor(initialState, transitions) {
    this.currentState = initialState;
    this.transitions = transitions;
  }

  transition(event) {
    const key = `${this.currentState}_${event}`;
    const nextState = this.transitions[key];

    if (nextState) {
      console.log(`Transition: ${this.currentState} -> ${nextState} (${event})`);
      this.currentState = nextState;
      return true;
    }

    console.log(`Invalid transition: ${this.currentState} -> ${event}`);
    return false;
  }

  getState() {
    return this.currentState;
  }

  can(event) {
    const key = `${this.currentState}_${event}`;
    return !!this.transitions[key];
  }
}

// 交通灯状态机
const trafficLight = new StateMachine('red', {
  'red_green': 'green',
  'green_yellow': 'yellow',
  'yellow_red': 'red'
});

console.log(trafficLight.getState());  // red
trafficLight.transition('green');      // red -> green
console.log(trafficLight.getState());  // green
trafficLight.transition('yellow');     // green -> yellow
console.log(trafficLight.getState());  // yellow
trafficLight.transition('red');        // yellow -> red

trafficLight.transition('invalid');     // Invalid transition
```

**状态模式 vs 策略模式：**

```javascript
// 状态模式：状态对象知道当前处于哪个状态，并决定下一个状态
// 状态之间相互关联，状态转换由状态对象控制

// 策略模式：策略对象不知道使用它的上下文
// 策略由外部决定，策略之间相互独立

// 状态模式示例：状态决定转换
class PhoneState {
  handle(context) {
    // 状态自己决定下一步
  }
}

// 策略模式示例：外部决定使用哪个策略
class PaymentStrategy {
  pay(amount) {
    throw new Error('Must implement');
  }
}

class CreditCardPayment extends PaymentStrategy {
  pay(amount) { /* ... */ }
}

class PayPalPayment extends PaymentStrategy {
  pay(amount) { /* ... */ }
}

// 上下文选择策略
class ShoppingCart {
  setPaymentStrategy(strategy) {
    this.strategy = strategy;
  }

  checkout(amount) {
    this.strategy.pay(amount);
  }
}
```

**面试考点分析：**

- 状态模式的核心结构和实现方式
- 理解状态模式与策略模式的区别
- 实际应用场景（播放器、订单流程、状态机）
- 了解状态模式如何简化复杂的状态逻辑

---

## 二十一、JavaScript内存管理

### 21.1 垃圾回收机制详解

**参考答案：**

JavaScript 是一种自动内存管理的语言，开发者不需要手动分配和释放内存。垃圾回收器（Garbage Collector）会自动回收不再使用的对象所占用的内存。

**内存生命周期：**

```
┌─────────────────────────────────────────────────────────────────┐
│                     内存生命周期                                  │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  1. 分配内存      2. 使用内存      3. 释放内存                    │
│     │                 │                 │                        │
│     ▼                 ▼                 ▼                        │
│  ┌─────┐          ┌─────┐          ┌─────┐                     │
│  │ malloc │   ──▶  │ 读取 │   ──▶  │ free │                     │
│  │ /new  │        │ /写入 │        │ GC  │                     │
│  └─────┘          └─────┘          └─────┘                     │
│                                                                  │
│  JavaScript 自动完成第1步和第3步                                 │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

**主要垃圾回收算法：**

**1. 引用计数算法 (Reference Counting)：**

```javascript
// 原理：跟踪每个值的引用次数，当引用次数为0时回收
// 优点：即时回收，没有循环暂停
// 缺点：无法处理循环引用

// 示例
let obj1 = { name: 'Alice' };  // 引用计数: 1
let obj2 = obj1;               // 引用计数: 2

obj1 = null;                    // 引用计数: 1
obj2 = null;                    // 引用计数: 0 -> 回收

// 循环引用问题
function problem() {
  const obj1 = {};
  const obj2 = {};
  obj1.ref = obj2;  // obj2 引用计数: 1
  obj2.ref = obj1;  // obj1 引用计数: 1

  // 函数外部没有引用这两个对象，但引用计数都是1
  // 不会被回收！这就是循环引用导致的内存泄漏
}
```

**2. 标记清除算法 (Mark and Sweep)：**

```javascript
// 原理：从根对象（window/global）出发，标记所有可达的对象
//      清除阶段回收所有未标记的对象
// 这是现代浏览器最常用的算法

// 标记阶段
function mark() {
  // 从全局对象开始，递归标记所有可达对象
  // window -> ... -> 所有能被访问到的对象都被标记
}

// 清除阶段
function sweep() {
  // 遍历堆中的所有对象
  // 未被标记的对象被认为是垃圾，释放内存
}

// 解决了循环引用问题
function noProblem() {
  const obj1 = {};
  const obj2 = {};
  obj1.ref = obj2;
  obj2.ref = obj1;
}
// 函数执行完毕后，obj1 和 obj2 从根对象不可达
// 下次 GC 会被回收
```

**3. 标记压缩算法 (Mark Compact)：**

```javascript
// 原理：标记清除的改进版，回收后将存活对象压缩到堆的一端
// 优点：避免内存碎片化
// 缺点：需要移动对象，性能开销较大

// 过程：
// 1. 标记所有可达对象
// 2. 移动所有存活对象到一端
// 3. 清除边界外的内存
```

**4. 分代回收算法 (Generational Collection)：**

```javascript
// 原理：根据对象存活时间将内存分为不同代（新生代/老生代）
// 观察：大多数对象都是短命的

// 新生代（Young Generation）
// - 存活时间短的对象
// - 分为 From 和 To 两个半区
// - Scavenge 算法：复制活对象到 To 区，交换 From/To

// 老生代（Old Generation）
// - 存活时间长的对象
// - 标记清除 + 标记压缩

// 对象晋升（Promotion）
// - 对象在新生代经历多次 GC 仍然存活
// - 新生代内存不足时
```

**V8 引擎垃圾回收：**

```javascript
// V8 内存布局
// ┌─────────────────────────────────────────────────────────────┐
// │                         新生代                                │
// │  ┌─────────────────────┬─────────────────────┐             │
// │  │       From          │         To           │             │
// │  │   (对象分配区域)     │   (保留区域)          │             │
// │  └─────────────────────┴─────────────────────┘             │
// ├─────────────────────────────────────────────────────────────┤
// │                         老生代                                │
// │  ┌─────────────────────────────────────────────────────┐   │
// │  │                                                     │   │
// │  │   (标记清除区域)    (标记压缩区域)                   │   │
// │  │                                                     │   │
// │  └─────────────────────────────────────────────────────┘   │
// └─────────────────────────────────────────────────────────────┘

// V8 GC 策略
// - Minor GC (Scavenge): 新生代，快速
// - Major GC: 老生代，完整 GC
// - Incremental GC: 增量标记，减少长暂停
// - Concurrent GC: 并发标记，多线程

// 查看 V8 内存使用
console.log(process.memoryUsage());
// {
//   rss: 进程的常驻内存
//   heapTotal: 堆内存总量
//   heapUsed: 堆内存使用量
//   external: 外部内存
// }
```

**垃圾回收触发条件：**

```javascript
// 新生代晋升老生代的条件
// 1. 对象经历两次 Minor GC 仍存活
// 2. To 空间使用率超过 25%

// 老生代触发条件
// 1. 达到一定阈值
// 2. 手动调用 global.gc() (需要 --expose-gc)

// 手动触发 GC (仅 Node.js)
if (global.gc) {
  global.gc();
}
```

**面试考点分析：**

- 理解引用计数算法的循环引用问题
- 理解标记清除算法的工作原理
- 了解现代浏览器的分代回收策略
- 了解 V8 引擎的 GC 机制

### 21.2 内存泄漏与排查

**参考答案：**

内存泄漏是指程序在申请内存后，无法释放已申请的内存空间，导致内存占用持续增长，最终可能导致程序崩溃或系统变慢。

**常见的内存泄漏场景：**

```javascript
// 1. 全局变量
function leak1() {
  // 意外创建全局变量
  someLargeData = new Array(1000000);  // 泄漏！
}

function leak2() {
  // this 指向全局对象
  this.variable = 'leak';
}
leak2();

// 解决方案：使用严格模式
'use strict';

// 2. 闭包
function leak3() {
  const largeData = new Array(1000000);

  return function() {
    // largeData 被这个函数引用，无法释放
    console.log(largeData.length);
  };
}

const leaked = leak3();
// largeData 不会被回收，因为闭包仍在引用

// 解决方案：手动置空
const leakedFn = leak3();
leakedFn();
// 使用完毕后
// leakedFn = null;

// 3. 定时器
function leak4() {
  const cache = {};

  setInterval(() => {
    // 定时器一直在运行，cache 不会被释放
    cache[Date.now()] = new Array(10000);
  }, 1000);
}

// 解决方案：使用 clearInterval
function noLeak4() {
  const cache = {};

  const timer = setInterval(() => {
    cache[Date.now()] = new Array(10000);

    // 条件满足时清除
    if (Object.keys(cache).length > 100) {
      clearInterval(timer);
    }
  }, 1000);

  return timer;
}

// 4. DOM 引用
function leak5() {
  const largeData = new Array(1000000);
  const elements = [];

  // 创建大量 DOM 元素并引用
  for (let i = 0; i < 100; i++) {
    const div = document.createElement('div');
    div.textContent = 'Some content';
    elements.push(div);
  }

  // 在 cache 中保存引用
  window.cache = {
    data: largeData,
    elements: elements
  };
}

// 解决方案：清理 DOM 引用
function noLeak5() {
  const largeData = new Array(1000000);
  const elements = [];

  for (let i = 0; i < 100; i++) {
    const div = document.createElement('div');
    div.textContent = 'Some content';
    elements.push(div);
  }

  // 处理完毕后清理
  elements.forEach(el => el.remove());

  // 清理引用
  // window.cache = null;
}

// 5. Event Listener
function leak6() {
  const largeData = new Array(1000000);

  // 添加事件监听器
  document.addEventListener('click', function handler() {
    // handler 函数引用了 largeData
    console.log(largeData.length);
  });
}

// 解决方案：移除事件监听器
function noLeak6() {
  const largeData = new Array(1000000);

  function handler() {
    console.log(largeData.length);
  }

  document.addEventListener('click', handler);

  // 使用完毕后移除
  document.removeEventListener('click', handler);
  largeData = null;
}

// 6. Map/Set 中的对象引用
function leak7() {
  const map = new Map();
  const key = { id: 1 };
  map.set(key, 'some value');

  // 即使 key 变成不可达，Map 仍然持有引用
  key = null;
  // map 仍然有 {id:1} 的引用
}

// 解决方案：使用 WeakMap
function noLeak7() {
  const weakMap = new WeakMap();
  const key = { id: 1 };
  weakMap.set(key, 'some value');

  key = null;
  // key 变为不可达，weakMap 会自动清理
}
```

**内存泄漏排查方法：**

```javascript
// 1. Chrome DevTools 内存分析

// 步骤：
// 1. 打开 DevTools -> Memory
// 2. 选择 "Heap Snapshot"
// 3. 点击 "Take snapshot" 记录初始状态
// 4. 执行可能泄漏的操作
// 5. 再拍一张快照
// 6. 对比两张快照，检查对象增长

// 2. 记录内存变化
function generateMemoryReport() {
  const report = {
    timestamp: Date.now(),
    memory: process.memoryUsage()
  };

  return {
    heapUsed: Math.round(report.memory.heapUsed / 1024 / 1024) + ' MB',
    heapTotal: Math.round(report.memory.heapTotal / 1024 / 1024) + ' MB',
    external: Math.round(report.memory.external / 1024 / 1024) + ' MB'
  };
}

// 3. 监控内存增长
class MemoryMonitor {
  constructor() {
    this.snapshots = [];
    this.startMemory = null;
  }

  start() {
    if (global.gc) {
      global.gc();
    }
    this.startMemory = process.memoryUsage().heapUsed;
    console.log('Memory monitoring started');
  }

  snapshot(label) {
    if (global.gc) {
      global.gc();
    }
    const currentMemory = process.memoryUsage().heapUsed;
    const growth = currentMemory - this.startMemory;

    this.snapshots.push({
      label,
      memory: currentMemory,
      growth
    });

    console.log(`${label}: +${(growth / 1024 / 1024).toFixed(2)} MB`);
  }

  report() {
    console.table(this.snapshots);
  }
}

// 使用
const monitor = new MemoryMonitor();
monitor.start();

// 执行一些操作
const arr = [];
for (let i = 0; i < 10000; i++) {
  arr.push({ id: i, data: new Array(100) });
}

monitor.snapshot('After creating objects');

// 清理
arr.length = 0;

monitor.snapshot('After clearing array');

monitor.report();

// 4. Performance Monitor
// 在 Chrome DevTools -> Performance 中监控
// - JS Heap size
// - DOM Nodes
// - Documents
// - Event Listeners
```

**防止内存泄漏的最佳实践：**

```javascript
// 1. 及时清理
class ResourceManager {
  constructor() {
    this.resources = new Map();
  }

  register(id, resource) {
    this.resources.set(id, resource);
  }

  release(id) {
    const resource = this.resources.get(id);
    if (resource && resource.close) {
      resource.close();
    }
    this.resources.delete(id);
  }

  releaseAll() {
    this.resources.forEach((resource, id) => {
      if (resource.close) {
        resource.close();
      }
    });
    this.resources.clear();
  }

  // 使用 try-finally 确保清理
  async useResource(id, callback) {
    const resource = this.resources.get(id);
    try {
      return await callback(resource);
    } finally {
      this.release(id);
    }
  }
}

// 2. 使用 WeakRef 和 FinalizationRegistry
class Cache {
  constructor() {
    this.cache = new Map();
    this.registry = new FinalizationRegistry((key) => {
      console.log(`Cleaning up: ${key}`);
      this.cache.delete(key);
    });
  }

  set(key, value) {
    this.cache.set(key, value);
    this.registry.register(value, key);
  }

  get(key) {
    return this.cache.get(key);
  }
}

// 3. 组件卸载时清理 (React 为例)
function useEffect(() => {
  const subscription = someAPI.subscribe();

  return () => {
    // 清理函数 - React 会自动调用
    subscription.unsubscribe();
  };
}, []);
```

**面试考点分析：**

- 常见的内存泄漏场景（全局变量、闭包、定时器、DOM 引用）
- 如何排查内存泄漏（Chrome DevTools、性能监控）
- 了解 WeakMap、WeakSet 的适用场景
- 理解垃圾回收机制与内存泄漏的关系

### 21.3 WeakMap 和 WeakSet

**参考答案：**

WeakMap 和 WeakSet 是两种特殊的集合类型，它们持有对象的弱引用。这意味着当对象只被 WeakMap/WeakSet 引用时，垃圾回收器可以回收这些对象。

**WeakMap 特性：**

```javascript
// WeakMap 特性
// 1. 键必须是对象（不能是原始值）
// 2. 键是弱引用（可被 GC）
// 3. 不可枚举（没有 size、keys() 等方法）
// 4. 不能遍历

// 创建 WeakMap
const weakMap = new WeakMap();

// 添加键值对 - 键必须是对象
const obj = { id: 1 };
weakMap.set(obj, 'some value');
weakMap.set(document.body, 'body element');

// 使用原始值作为键会报错
// weakMap.set('key', 'value');  // TypeError

// 获取和设置
console.log(weakMap.get(obj));  // 'some value'
console.log(weakMap.has(obj));    // true
weakMap.delete(obj);           // 删除指定键
```

**WeakMap 使用场景：**

```javascript
// 场景1: 私有数据存储
const privateData = new WeakMap();

class User {
  constructor(name, age) {
    // 将私有数据存储在 WeakMap 中
    privateData.set(this, { name, age });
  }

  getName() {
    return privateData.get(this).name;
  }

  getAge() {
    return privateData.get(this).age;
  }
}

// 使用
const user = new User('Alice', 25);
console.log(user.getName());  // Alice

// user 对象被回收后，privateData 中的数据也会被自动清理
// 这是 WeakMap 的主要优势

// 场景2: DOM 元素数据关联
const elementData = new WeakMap();

function attachData(element, data) {
  elementData.set(element, data);
}

function getData(element) {
  return elementData.get(element);
}

// 使用
const div = document.createElement('div');
attachData(div, { clicks: 0, lastClick: Date.now() });

div.addEventListener('click', () => {
  const data = getData(div);
  data.clicks++;
  console.log('Clicks:', data.clicks);
});

// div 从 DOM 中移除后，数据会被 GC

// 场景3: 缓存（不阻止 GC）
const cache = new WeakMap();

function processLargeObject(obj) {
  if (cache.has(obj)) {
    return cache.get(obj);
  }

  // 模拟耗时计算
  const result = expensiveOperation(obj);
  cache.set(obj, result);
  return result;
}

function expensiveOperation(obj) {
  return { processed: true, data: obj.data };
}

// 场景4: 对象元数据管理
const timestamps = new WeakMap();

function markCreated(obj) {
  timestamps.set(obj, Date.now());
}

function getCreated(obj) {
  return timestamps.get(obj);
}

const obj = {};
markCreated(obj);
console.log(getCreated(obj));  // timestamp
```

**WeakSet 特性：**

```javascript
// WeakSet 特性
// 1. 只能存储对象
// 2. 对象是弱引用
// 3. 不可枚举
// 4. 没有 size 属性

// 创建 WeakSet
const weakSet = new WeakSet();

// 添加对象
const obj1 = { id: 1 };
const obj2 = { id: 2 };
weakSet.add(obj1);
weakSet.add(obj2);

// 检查是否存在
console.log(weakSet.has(obj1));  // true

// 删除
weakSet.delete(obj1);

// 弱引用特性演示
(function() {
  const obj = { important: 'data' };
  weakSet.add(obj);
  console.log(weakSet.has(obj));  // true

  // obj 超出作用域，被 GC，weakSet 中的引用自动消失
})();

// 弱引用被清理后，weakSet 中不再有该对象
// 注意：WeakSet 不保证立即清理，时间不确定
```

**WeakSet 使用场景：**

```javascript
// 场景1: 追踪活跃对象
const activeObjects = new WeakSet();

function activate(obj) {
  activeObjects.add(obj);
}

function deactivate(obj) {
  activeObjects.delete(obj);
}

function isActive(obj) {
  return activeObjects.has(obj);
}

// 使用
class Component {
  constructor() {
    activate(this);
  }

  destroy() {
    deactivate(this);
  }
}

// 场景2: 标记特殊对象
const markedObjects = new WeakSet();

function markSpecial(obj) {
  markedObjects.add(obj);
}

function isMarked(obj) {
  return markedObjects.has(obj);
}

// 使用
class Node {
  constructor(value) {
    this.value = value;
    this.children = [];
  }

  markAsRoot() {
    markSpecial(this);
  }
}

// 场景3: 实现观察者模式（自动清理）
const observers = new WeakSet();

function observe(target, callback) {
  const handler = {
    get(obj, prop) {
      callback(prop, 'get');
      return obj[prop];
    },
    set(obj, prop, value) {
      callback(prop, 'set');
      obj[prop] = value;
    }
  };

  const proxy = new Proxy(target, handler);
  observers.add(proxy);
  return proxy;
}

// 使用
const obj = { name: 'Alice' };
const observed = observe(obj, (prop, type) => {
  console.log(`${type}: ${prop}`);
});

observed.name = 'Bob';  // set: name
console.log(observed.name);  // get: name
```

**WeakRef（ES2021）：**

```javascript
// WeakRef 允许获取对象的弱引用
// 与 WeakMap/WeakSet 不同，WeakRef 可以直接返回对象

// 创建 WeakRef
const ref = new WeakRef({ name: 'Alice' });

// 获取对象
const obj = ref.deref();
if (obj) {
  console.log(obj.name);  // Alice
}

// 当对象被 GC 后，deref() 返回 undefined

// 使用场景：缓存
class Cache {
  constructor() {
    this.cache = new Map();
  }

  getOrCompute(key, computeFn) {
    // 尝试从 Map 中获取 WeakRef
    const ref = this.cache.get(key);
    const value = ref?.deref();

    if (value !== undefined) {
      return value;
    }

    // 计算新值
    const newValue = computeFn();
    // 用 WeakRef 存储
    this.cache.set(key, new WeakRef(newValue));
    return newValue;
  }
}
```

**面试考点分析：**

- WeakMap/WeakSet 的弱引用特性
- 为什么需要弱引用（避免内存泄漏）
- 适用场景（私有数据、DOM 关联、缓存）
- 了解 WeakRef（ES2021）

### 21.4 内存优化技巧

**参考答案：**

在 JavaScript 开发中，合理的内存优化可以提升应用性能，减少垃圾回收的压力，并防止内存泄漏。

**对象优化：**

```javascript
// 1. 对象池 (Object Pool)
// 预先分配和复用对象，减少 GC 压力

class ObjectPool {
  constructor(factory, initialSize = 10) {
    this.factory = factory;
    this.pool = [];
    this.active = new Set();

    // 预创建对象
    for (let i = 0; i < initialSize; i++) {
      this.pool.push(this.factory());
    }
  }

  acquire() {
    let obj;
    if (this.pool.length > 0) {
      obj = this.pool.pop();
    } else {
      obj = this.factory();
    }
    this.active.add(obj);
    return obj;
  }

  release(obj) {
    if (this.active.has(obj)) {
      this.active.delete(obj);
      // 重置对象状态
      this.pool.push(obj);
    }
  }

  clear() {
    this.active.clear();
  }
}

// 使用示例：粒子系统
class Particle {
  constructor() {
    this.reset();
  }

  reset() {
    this.x = 0;
    this.y = 0;
    this.vx = 0;
    this.vy = 0;
    this.life = 0;
    this.active = false;
  }
}

const particlePool = new ObjectPool(() => new Particle(), 100);

// 2. 使用数组代替对象（对于大量同类对象）
// 不推荐
const users = [
  { name: 'Alice', age: 25, email: 'alice@example.com' },
  { name: 'Bob', age: 30, email: 'bob@example.com' }
];

// 推荐：使用数组存储同类数据
const userNames = ['Alice', 'Bob'];
const userAges = [25, 30];
const userEmails = ['alice@example.com', 'bob@example.com'];

// 或使用 TypedArray
const positions = new Float32Array(1000);  // x, y 坐标对

// 3. 避免创建不必要的对象
// 不推荐
function formatName(first, last) {
  return { first, last, full: first + ' ' + last };
}

// 推荐：直接返回字符串
function formatName(first, last) {
  return first + ' ' + last;
}

// 4. 合理使用数据结构
// Map vs Object
// Map: 键可以是任意类型，有序，可迭代
// Object: 字符串键，原型链

// 大量数据时使用 Map
const map = new Map();
for (let i = 0; i < 100000; i++) {
  map.set(i, { id: i, value: `item-${i}` });
}

// 5. 冻结不可变对象
const config = Object.freeze({
  apiUrl: 'https://api.example.com',
  maxRetries: 3,
  timeout: 5000
});

// 尝试修改会被静默忽略或抛出错误（严格模式）
// config.apiUrl = 'other';  // TypeError (严格模式)
```

**数组优化：**

```javascript
// 1. 预分配数组大小
const arr = new Array(1000);  // 预分配 1000 个空位
for (let i = 0; i < 1000; i++) {
  arr[i] = i;
}

// 2. 使用 TypedArray 处理数值
// Int8Array, Uint8Array, Int16Array, Uint16Array, Int32Array, Uint32Array
// Float32Array, Float64Array

// 普通数组
const normalArr = [1.0, 2.5, 3.3];  // 每个元素是对象（64位浮点数 + 对象开销）

// TypedArray
const typedArr = new Float32Array([1.0, 2.5, 3.3]);  // 紧凑存储

// 3. 避免数组稀疏化
const sparse = [];
sparse[0] = 1;
sparse[1000] = 2;
// 创建了 1001 个空槽位

// 正确做法
const dense = [1];
dense.push(2);
// 或
const fixed = new Array(2);
fixed[0] = 1;
fixed[1] = 2;

// 4. 适时使用 Set/Map 替代数组查找
// 数组查找 O(n)，Set/Map 查找 O(1)
const ids = [1, 2, 3, 4, 5];
const idSet = new Set(ids);

ids.includes(3);     // O(n)
idSet.has(3);        // O(1)
```

**函数优化：**

```javascript
// 1. 避免在循环中创建函数
// 不推荐
for (let i = 0; i < 100; i++) {
  items[i].onclick = function() {
    handleItem(i);  // 闭包捕获 i
  };
}

// 推荐
for (let i = 0; i < 100; i++) {
  items[i].onclick = (function(index) {
    return function() {
      handleItem(index);
    };
  })(i);
}

// 或使用 let 块级作用域
for (let i = 0; i < 100; i++) {
  items[i].onclick = function() {
    handleItem(i);
  };
}

// 2. 函数节流与防抖（减少高频调用）
function debounce(fn, delay) {
  let timeoutId;
  return function(...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn.apply(this, args), delay);
  };
}

function throttle(fn, limit) {
  let inThrottle;
  return function(...args) {
    if (!inThrottle) {
      fn.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

// 3. 记忆化 (Memoization)
function memoize(fn) {
  const cache = new Map();

  return function(...args) {
    const key = JSON.stringify(args);
    if (cache.has(key)) {
      return cache.get(key);
    }

    const result = fn.apply(this, args);
    cache.set(key, result);
    return result;
  };
}

// 4. 尾调用优化 (Tail Call Optimization)
// ES6 特性，某些情况下不会创建新的调用栈
function factorial(n, acc = 1) {
  if (n <= 1) return acc;
  return factorial(n - 1, n * acc);  // 尾调用
}
```

**内存优化最佳实践：**

```javascript
// 1. 及时清理大对象
function processLargeData() {
  const largeData = new Array(1000000);

  try {
    // 处理数据
    return process(largeData);
  } finally {
    // 确保清理
    largeData = null;
  }
}

// 2. 使用 WeakRef 做缓存
const cachedData = new WeakMap();

function getData(key) {
  const ref = cachedData.get(key);
  const data = ref?.deref();

  if (data) return data;

  const newData = loadData(key);
  cachedData.set(key, new WeakRef(newData));
  return newData;
}

// 3. 分块处理大数据
function processLargeArray(array, chunkSize, callback) {
  let index = 0;

  function processChunk() {
    const chunk = array.slice(index, index + chunkSize);
    const result = process(chunk);
    callback(result);

    index += chunkSize;
    if (index < array.length) {
      // 使用 requestIdleCallback 或 setTimeout 分帧处理
      setTimeout(processChunk, 0);
    }
  }

  processChunk();
}

// 4. 监控内存使用
function checkMemory() {
  if (performance && performance.memory) {
    console.log('Memory usage:', {
      used: (performance.memory.usedJSHeapSize / 1048576).toFixed(2) + ' MB',
      total: (performance.memory.totalJSHeapSize / 1048576).toFixed(2) + ' MB',
      limit: (performance.memory.jsHeapSizeLimit / 1048576).toFixed(2) + ' MB'
    });
  }
}
```

**面试考点分析：**

- 对象池的概念和实现
- 何时使用 Map/Set 代替 Object/Array
- 了解 TypedArray 的优势
- 理解记忆化和尾调用优化
- 了解如何监控和排查内存问题

---

## 二十二、JavaScript网络请求

### 22.1 fetch API 详解

**参考答案：**

fetch API 是现代浏览器提供的原生网络请求 API，它基于 Promise，提供了一种简洁、强大的方式来发起 HTTP 请求。

**基本用法：**

```javascript
// 发起 GET 请求
fetch('https://api.example.com/data')
  .then(response => {
    // 检查响应状态
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();  // 解析 JSON
  })
  .then(data => {
    console.log(data);
  })
  .catch(error => {
    console.error('Request failed:', error);
  });

// async/await 写法
async function fetchData() {
  try {
    const response = await fetch('https://api.example.com/data');

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Request failed:', error);
  }
}
```

**fetch 配置选项：**

```javascript
// POST 请求
const response = await fetch('https://api.example.com/users', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer token'
  },
  body: JSON.stringify({
    name: 'Alice',
    email: 'alice@example.com'
  })
});

// 带凭据的请求
fetch('https://api.example.com/data', {
  credentials: 'include',  // 包含 Cookie
  // credentials: 'same-origin',  // 同源才包含
  // credentials: 'omit',  // 不包含（默认）
});

// 设置请求超时
const controller = new AbortController();
const timeoutId = setTimeout(() => controller.abort(), 5000);

try {
  const response = await fetch('https://api.example.com/data', {
    signal: controller.signal
  });
} catch (error) {
  if (error.name === 'AbortError') {
    console.log('Request timed out');
  }
} finally {
  clearTimeout(timeoutId);
}
```

**Response 对象详解：**

```javascript
// Response 属性
const response = await fetch('https://api.example.com/data');

// response.ok - 状态码 200-299
console.log(response.ok);

// response.status - HTTP 状态码
console.log(response.status);

// response.statusText - 状态文本
console.log(response.statusText);

// response.headers - 响应头
console.log(response.headers.get('Content-Type'));
console.log(response.headers.has('Cache-Control'));

// 遍历响应头
for (const [key, value] of response.headers) {
  console.log(`${key}: ${value}`);
}

// response.url - 请求的 URL
console.log(response.url);

// response.redirected - 是否重定向
console.log(response.redirected);
```

**Response 方法（解析响应体）：**

```javascript
const response = await fetch('https://api.example.com/data');

// JSON
const json = await response.json();

// 文本
const text = await response.text();

// Blob（二进制大对象）
const blob = await response.blob();

// ArrayBuffer
const buffer = await response.arrayBuffer();

// FormData
const formData = await response.formData();

// 自定义读取
const reader = response.body.getReader();
const chunks = [];

while (true) {
  const { done, value } = await reader.read();
  if (done) break;
  chunks.push(value);
}

const data = new Uint8Array(chunks.reduce((acc, chunk) => acc + chunk.length, 0));
chunks.reduce((acc, chunk, i) => {
  data.set(chunk, acc);
  return acc + chunk.length;
}, 0);
```

**创建自定义 Response：**

```javascript
// 创建 JSON 响应
const jsonResponse = new Response(
  JSON.stringify({ message: 'Hello' }),
  {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  }
);

// 创建流式响应
const stream = new ReadableStream({
  start(controller) {
    controller.enqueue('Hello ');
    controller.enqueue('World');
    controller.close();
  }
});

const streamResponse = new Response(stream, {
  headers: { 'Content-Type': 'text/plain' }
});
```

**fetch 封装工具函数：**

```javascript
// 完整的 fetch 封装
class FetchClient {
  constructor(baseURL = '') {
    this.baseURL = baseURL;
    this.defaultHeaders = new Headers();
  }

  setHeader(key, value) {
    this.defaultHeaders.set(key, value);
    return this;
  }

  setAuthToken(token) {
    this.defaultHeaders.set('Authorization', `Bearer ${token}`);
    return this;
  }

  async request(url, options = {}) {
    const fullURL = url.startsWith('http') ? url : this.baseURL + url;

    const config = {
      ...options,
      headers: new Headers({
        ...Object.fromEntries(this.defaultHeaders),
        ...options.headers
      })
    };

    try {
      const response = await fetch(fullURL, config);
      return await this.handleResponse(response);
    } catch (error) {
      return this.handleError(error);
    }
  }

  async handleResponse(response) {
    if (!response.ok) {
      const error = new Error(`HTTP ${response.status}: ${response.statusText}`);
      error.response = response;
      try {
        error.data = await response.json();
      } catch {}
      throw error;
    }

    const contentType = response.headers.get('Content-Type');
    if (contentType?.includes('application/json')) {
      return response.json();
    }
    return response.text();
  }

  handleError(error) {
    console.error('Request failed:', error);
    throw error;
  }

  // 便捷方法
  get(url, options = {}) {
    return this.request(url, { ...options, method: 'GET' });
  }

  post(url, data, options = {}) {
    return this.request(url, {
      ...options,
      method: 'POST',
      body: JSON.stringify(data),
      headers: { 'Content-Type': 'application/json', ...options.headers }
    });
  }

  put(url, data, options = {}) {
    return this.request(url, {
      ...options,
      method: 'PUT',
      body: JSON.stringify(data),
      headers: { 'Content-Type': 'application/json', ...options.headers }
    });
  }

  delete(url, options = {}) {
    return this.request(url, { ...options, method: 'DELETE' });
  }
}

// 使用
const api = new FetchClient('https://api.example.com');
api.setAuthToken('my-token');

const users = await api.get('/users');
await api.post('/users', { name: 'Alice' });
```

**面试考点分析：**

- fetch API 的基本用法和配置选项
- fetch 不会自动抛出非 200 状态码的错误
- Response 对象的属性和方法
- fetch 请求超时和取消的实现
- fetch 与 XMLHttpRequest 的区别

### 22.2 请求/响应拦截器

**参考答案：**

拦截器是 Web 应用中非常重要的模式，它们允许在请求发送前或响应返回后执行特定逻辑，如添加认证信息、日志记录、错误处理等。

**axios 拦截器实现原理：**

```javascript
// 完整的 axios 风格拦截器实现
class Axios {
  constructor() {
    this.interceptors = {
      request: new InterceptorManager(),
      response: new InterceptorManager()
    };
  }

  async request(config) {
    // 收集所有请求拦截器
    const requestInterceptors = [];
    this.interceptors.request.forEach(interceptor => {
      requestInterceptors.push(interceptor);
    });

    // 收集所有响应拦截器
    const responseInterceptors = [];
    this.interceptors.response.forEach(interceptor => {
      responseInterceptors.unshift(interceptor);
    });

    try {
      // 依次执行请求拦截器
      let transformedConfig = config;
      for (const interceptor of requestInterceptors) {
        transformedConfig = await interceptor.executor(transformedConfig);
      }

      // 发送请求
      let response = await this.sendRequest(transformedConfig);

      // 依次执行响应拦截器
      for (const interceptor of responseInterceptors) {
        response = await interceptor.executor(response);
      }

      return response;
    } catch (error) {
      // 统一错误处理
      throw error;
    }
  }

  async sendRequest(config) {
    // 简化的请求发送
    const response = await fetch(config.url, {
      method: config.method,
      headers: config.headers,
      body: config.data
    });

    return {
      data: await response.json(),
      status: response.status,
      headers: response.headers,
      config
    };
  }

  get(url, config = {}) {
    return this.request({ ...config, url, method: 'GET' });
  }

  post(url, data, config = {}) {
    return this.request({ ...config, url, data, method: 'POST' });
  }
}

// 拦截器管理器
class InterceptorManager {
  constructor() {
    this.handlers = [];
  }

  use(executor, onRejected) {
    this.handlers.push({ executor, onRejected });
    return this.handlers.length - 1;
  }

  eject(id) {
    if (this.handlers[id]) {
      this.handlers[id] = null;
    }
  }

  forEach(callback) {
    this.handlers.forEach(handler => {
      if (handler !== null) {
        callback(handler);
      }
    });
  }
}
```

**实际应用 - 请求拦截器：**

```javascript
// 请求拦截器示例
const api = new FetchClient('https://api.example.com');

// 1. 添加认证 Token
api.interceptors.request.use(async (config) => {
  const token = await getAuthToken();  // 获取 token

  if (token) {
    config.headers = config.headers || {};
    config.headers['Authorization'] = `Bearer ${token}`;
  }

  return config;
});

// 2. 添加时间戳防止缓存
api.interceptors.request.use(async (config) => {
  const url = new URL(config.url);
  url.searchParams.set('_t', Date.now().toString());
  config.url = url.toString();

  return config;
});

// 3. 请求日志
api.interceptors.request.use(async (config) => {
  console.log(`[Request] ${config.method} ${config.url}`);
  console.log('Headers:', config.headers);
  console.log('Body:', config.body);

  // 可以添加请求开始时间，用于计算耗时
  config.metadata = { startTime: Date.now() };

  return config;
});
```

**实际应用 - 响应拦截器：**

```javascript
// 响应拦截器示例

// 1. 统一错误处理
api.interceptors.response.use(
  async (response) => {
    // 检查业务错误码
    if (response.data && response.data.code !== 0) {
      const error = new Error(response.data.message || 'Request failed');
      error.response = response;
      error.code = response.data.code;
      throw error;
    }

    return response;
  },
  async (error) => {
    // 统一错误处理
    const { response, config } = error;

    if (!response) {
      // 网络错误
      console.error('Network error:', error.message);
      throw new Error('Network error. Please check your connection.');
    }

    switch (response.status) {
      case 401:
        // Token 过期，尝试刷新
        try {
          await refreshToken();
          // 重新发送原始请求
          return api.request(config);
        } catch (e) {
          // 刷新失败，跳转登录
          window.location.href = '/login';
        }
        break;

      case 403:
        console.error('Permission denied');
        break;

      case 404:
        console.error('Resource not found');
        break;

      case 500:
        console.error('Server error');
        break;
    }

    return Promise.reject(error);
  }
);

// 2. 响应日志
api.interceptors.response.use(async (response) => {
  const { config } = response;
  const duration = Date.now() - config.metadata.startTime;

  console.log(`[Response] ${config.method} ${config.url} - ${response.status} (${duration}ms)`);

  return response;
});

// 3. 数据转换
api.interceptors.response.use(async (response) => {
  // 将 ISO 字符串转换为 Date 对象
  if (response.data && response.data.items) {
    response.data.items = response.data.items.map(item => ({
      ...item,
      createdAt: new Date(item.createdAt),
      updatedAt: new Date(item.updatedAt)
    }));
  }

  return response;
});
```

**完整的封装示例：**

```javascript
// fetch + 拦截器完整封装
class HttpClient {
  constructor(baseURL = '') {
    this.baseURL = baseURL;
    this.interceptors = {
      request: new InterceptorManager(),
      response: new InterceptorManager()
    };
  }

  async request(url, options = {}) {
    const fullURL = url.startsWith('http') ? url : this.baseURL + url;

    const config = {
      url: fullURL,
      method: options.method || 'GET',
      headers: options.headers || {},
      ...options
    };

    // 执行请求拦截器
    let effectiveConfig = config;
    for (const interceptor of this.interceptors.request.handlers) {
      if (interceptor) {
        effectiveConfig = await interceptor(effectiveConfig) || effectiveConfig;
      }
    }

    try {
      let response = await this.sendRequest(effectiveConfig);

      // 执行响应拦截器
      for (const interceptor of this.interceptors.response.handlers) {
        if (interceptor) {
          response = await interceptor(response);
        }
      }

      return response;
    } catch (error) {
      // 执行错误拦截器
      for (const interceptor of this.interceptors.response.errorHandlers) {
        if (interceptor) {
          throw await interceptor(error);
        }
      }
      throw error;
    }
  }

  async sendRequest(config) {
    const fetchOptions = {
      method: config.method,
      headers: config.headers
    };

    if (config.body) {
      fetchOptions.body = typeof config.body === 'string'
        ? config.body
        : JSON.stringify(config.body);
    }

    const response = await fetch(config.url, fetchOptions);

    let data;
    const contentType = response.headers.get('content-type');
    if (contentType?.includes('application/json')) {
      data = await response.json();
    } else {
      data = await response.text();
    }

    if (!response.ok) {
      const error = new Error(`HTTP ${response.status}`);
      error.response = { status: response.status, data };
      throw error;
    }

    return { data, status: response.status, headers: response.headers };
  }

  get(url, options = {}) {
    return this.request(url, { ...options, method: 'GET' });
  }

  post(url, data, options = {}) {
    return this.request(url, {
      ...options,
      method: 'POST',
      body: data,
      headers: { 'Content-Type': 'application/json', ...options.headers }
    });
  }

  put(url, data, options = {}) {
    return this.request(url, {
      ...options,
      method: 'PUT',
      body: data,
      headers: { 'Content-Type': 'application/json', ...options.headers }
    });
  }

  delete(url, options = {}) {
    return this.request(url, { ...options, method: 'DELETE' });
  }
}

// 拦截器管理器
class InterceptorManager {
  constructor() {
    this.handlers = [];
    this.errorHandlers = [];
  }

  use(executor, errorHandler) {
    this.handlers.push(executor);
    this.errorHandlers.push(errorHandler);
    return this.handlers.length - 1;
  }

  eject(id) {
    this.handlers[id] = null;
    this.errorHandlers[id] = null;
  }
}

// 使用示例
const http = new HttpClient('https://api.example.com');

// 请求拦截器
http.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
});

// 响应拦截器
http.interceptors.response.use((response) => {
  console.log('Response:', response.data);
  return response;
});

http.interceptors.response.use(null, (error) => {
  if (error.response?.status === 401) {
    localStorage.removeItem('token');
    window.location.href = '/login';
  }
  return Promise.reject(error);
});
```

**面试考点分析：**

- 拦截器的工作原理和执行顺序
- 请求拦截器常用于添加认证、日志
- 响应拦截器常用于统一错误处理、数据转换
- 理解 Promise 链的执行顺序

### 22.3 请求缓存策略与重试机制

**参考答案：**

缓存和重试是网络请求中非常重要的功能，合理的缓存策略可以减少网络请求、提升用户体验，重试机制可以提高请求的可靠性。

**缓存策略实现：**

```javascript
// 1. 内存缓存
class MemoryCache {
  constructor() {
    this.cache = new Map();
  }

  get(key) {
    const item = this.cache.get(key);
    if (!item) return null;

    // 检查过期
    if (item.expiry && Date.now() > item.expiry) {
      this.cache.delete(key);
      return null;
    }

    return item.value;
  }

  set(key, value, ttl = 60000) {
    const expiry = ttl ? Date.now() + ttl : null;
    this.cache.set(key, { value, expiry });
  }

  delete(key) {
    this.cache.delete(key);
  }

  clear() {
    this.cache.clear();
  }
}

// 2. 基于 fetch 的缓存封装
class CacheableFetch {
  constructor(options = {}) {
    this.cache = options.cache || new MemoryCache();
    this.storage = options.storage || 'memory'; // 'memory' | 'localStorage'
  }

  async fetch(url, options = {}) {
    const { useCache = true, cacheTTL = 60000, cacheKey = null } = options;

    const key = cacheKey || url;

    // GET 请求且启用缓存
    if (useCache && (!options.method || options.method === 'GET')) {
      const cached = this.cache.get(key);
      if (cached) {
        return cached;
      }
    }

    // 发起请求
    const response = await fetch(url, options);

    if (response.ok && useCache && (!options.method || options.method === 'GET')) {
      // 克隆响应，因为响应只能读取一次
      const clone = response.clone();
      const data = await clone.json();
      this.cache.set(key, data, cacheTTL);
    }

    return response;
  }
}

// 3. 完整的缓存策略
class HttpCache {
  constructor() {
    this.memoryCache = new Map();
    this.storageKey = 'http_cache';
  }

  // 内存缓存
  getFromMemory(key) {
    const item = this.memoryCache.get(key);
    if (!item) return null;

    if (item.expiry && Date.now() > item.expiry) {
      this.memoryCache.delete(key);
      return null;
    }

    return item.data;
  }

  setToMemory(key, data, ttl) {
    const expiry = ttl ? Date.now() + ttl : null;
    this.memoryCache.set(key, { data, expiry });
  }

  // localStorage 缓存
  getFromStorage(key) {
    try {
      const item = localStorage.getItem(`${this.storageKey}_${key}`);
      if (!item) return null;

      const { data, expiry } = JSON.parse(item);
      if (expiry && Date.now() > expiry) {
        localStorage.removeItem(`${this.storageKey}_${key}`);
        return null;
      }

      return data;
    } catch {
      return null;
    }
  }

  setToStorage(key, data, ttl) {
    try {
      const expiry = ttl ? Date.now() + ttl : null;
      localStorage.setItem(
        `${this.storageKey}_${key}`,
        JSON.stringify({ data, expiry })
      );
    } catch (e) {
      console.error('Cache storage error:', e);
    }
  }

  // 缓存策略判断
  shouldCache(method, url, options) {
    // 只缓存 GET 请求
    if (method !== 'GET') return false;

    // 不缓存带认证的请求
    if (options.headers?.Authorization) return false;

    return true;
  }

  // 完整请求方法
  async request(url, options = {}) {
    const { cache = true, cacheTTL = 60000, useStorage = false } = options;
    const method = options.method || 'GET';
    const cacheKey = options.cacheKey || url;

    // 尝试从缓存获取
    if (cache && this.shouldCache(method, url, options)) {
      const memoryData = this.getFromMemory(cacheKey);
      if (memoryData) {
        return { cached: true, data: memoryData };
      }

      if (useStorage) {
        const storageData = this.getFromStorage(cacheKey);
        if (storageData) {
          // 写回内存缓存
          this.setToMemory(cacheKey, storageData, cacheTTL);
          return { cached: true, data: storageData };
        }
      }
    }

    // 发起请求
    const response = await fetch(url, options);

    if (response.ok && cache && this.shouldCache(method, url, options)) {
      const data = await response.clone().json();

      // 存储到内存缓存
      this.setToMemory(cacheKey, data, cacheTTL);

      // 可选：存储到 localStorage
      if (useStorage) {
        this.setToStorage(cacheKey, data, cacheTTL);
      }
    }

    return { cached: false, response };
  }
}
```

**重试机制实现：**

```javascript
// 1. 基础重试封装
async function fetchWithRetry(url, options = {}) {
  const {
    retries = 3,
    retryDelay = 1000,
    retryOn = [500, 502, 503, 504, 408, 429]
  } = options;

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const response = await fetch(url, options);

      // 检查是否应该重试
      if (!response.ok && retryOn.includes(response.status)) {
        throw new Error(`HTTP ${response.status}`);
      }

      return response;
    } catch (error) {
      // 已经是最后一次尝试
      if (attempt === retries) {
        throw error;
      }

      // 计算延迟（指数退避）
      const delay = retryDelay * Math.pow(2, attempt);
      console.log(`Retry ${attempt + 1}/${retries} after ${delay}ms`);

      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
}

// 2. 完整重试类
class RetryableFetch {
  constructor(options = {}) {
    this.maxRetries = options.maxRetries || 3;
    this.baseDelay = options.baseDelay || 1000;
    this.maxDelay = options.maxDelay || 30000;
    this.retryOn = options.retryOn || [408, 429, 500, 502, 503, 504];
    this.retryCondition = options.retryCondition;
  }

  async fetch(url, options = {}) {
    const { retries = this.maxRetries } = options;
    let lastError;

    for (let attempt = 0; attempt <= retries; attempt++) {
      try {
        return await this.executeRequest(url, options);
      } catch (error) {
        lastError = error;

        // 判断是否应该重试
        if (!this.shouldRetry(error, attempt, retries)) {
          throw error;
        }

        // 计算延迟
        const delay = this.calculateDelay(attempt);
        console.log(`Request failed, retrying in ${delay}ms...`);

        await this.sleep(delay);
      }
    }

    throw lastError;
  }

  async executeRequest(url, options) {
    const response = await fetch(url, options);

    if (!response.ok) {
      const error = new Error(`HTTP ${response.status}`);
      error.status = response.status;
      throw error;
    }

    return response;
  }

  shouldRetry(error, attempt, maxRetries) {
    // 已经用完重试次数
    if (attempt >= maxRetries) return false;

    // 有自定义重试条件
    if (this.retryCondition) {
      return this.retryCondition(error, attempt);
    }

    // 检查状态码
    if (error.status && this.retryOn.includes(error.status)) {
      return true;
    }

    // 网络错误
    if (error.name === 'TypeError' && error.message === 'Failed to fetch') {
      return true;
    }

    return false;
  }

  calculateDelay(attempt) {
    // 指数退避 + 随机抖动
    const exponentialDelay = this.baseDelay * Math.pow(2, attempt);
    const jitter = Math.random() * 1000;
    const delay = Math.min(exponentialDelay + jitter, this.maxDelay);
    return Math.floor(delay);
  }

  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// 3. 带重试的完整 HTTP 客户端
class RobustHttpClient {
  constructor() {
    this.cache = new HttpCache();
    this.retry = new RetryableFetch({
      maxRetries: 3,
      baseDelay: 1000,
      retryCondition: (error) => {
        // 某些错误不重试
        if (error.status === 404 || error.status === 403) return false;
        return error.status >= 500 || error.status === 429;
      }
    });
  }

  async get(url, options = {}) {
    const response = await this.cache.request(url, { ...options, method: 'GET' });
    if (response.cached) return response.data;

    return this.retry.fetch(response.response.url, {
      ...options,
      method: 'GET'
    });
  }

  async post(url, data, options = {}) {
    return this.retry.fetch(url, {
      ...options,
      method: 'POST',
      body: JSON.stringify(data),
      headers: { 'Content-Type': 'application/json', ...options.headers }
    });
  }
}
```

**面试考点分析：**

- 常见的缓存策略（内存缓存、localStorage）
- 缓存 TTL 和过期处理
- 重试机制的实现（指数退避、随机抖动）
- 哪些状态码需要重试，哪些不需要
- 缓存与重试的结合使用

> 资料整理自 2025 字节跳动、阿里巴巴、拼多多面试

---

## 二十三、JavaScript 核心 API 速查手册

> 适用于手写代码、算法题、LeetCode 刷题场景的 ES6+ 完整 API 语法速查

### 目录

1. [数组方法 (Array)](#二十三-1-数组方法-array)
2. [字符串方法 (String)](#二十三-2-字符串方法-string)
3. [对象方法 (Object)](#二十三-3-对象方法-object)
4. [ES6+ 新增语法](#二十三-4-es6-新增语法)
5. [Math 数学运算](#二十三-5-math-数学运算)
6. [Number 数值方法](#二十三-6-number-数值方法)
7. [Date 日期处理](#二十三-7-date-日期处理)
8. [JSON 数据转换](#二十三-8-json-数据转换)
9. [Map 与 Set](#二十三-9-map-与-set)
10. [Symbol 与 BigInt](#二十三-10-symbol-与-bigint)
11. [Proxy 与 Reflect](#二十三-11-proxy-与-reflect)
12. [异步编程 Promise](#二十三-12-异步编程-promise)
13. [手写代码常用模式](#二十三-13-手写代码常用模式)

---

### 二十三-1、数组方法 (Array)

#### 1.1 遍历方法

##### `forEach()` - 遍历数组

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

##### `map()` - 映射数组

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

##### `filter()` - 过滤数组

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

##### `reduce()` - 归约数组

```javascript
const result = arr.reduce((accumulator, currentValue, index, array) => {
    return newAccumulator;
}, initialValue);

// 参数说明：
// accumulator: 累计器，初始值为 initialValue 或第一个元素
// currentValue: 当前元素
// index: 当前索引 (可选)
// array: 原数组 (可选)

// 示例：求和
[1, 2, 3].reduce((sum, n) => sum + n, 0); // 6

// 示例：扁平化
[[1, 2], [3, 4], [5]].reduce((acc, cur) => [...acc, ...cur], []); // [1,2,3,4,5]

// 示例：统计出现次数
['a', 'b', 'a', 'c'].reduce((acc, cur) => {
    acc[cur] = (acc[cur] || 0) + 1;
    return acc;
}, {}); // {a: 2, b: 1, c: 1}

// 示例：compose
const compose = (...fns) => x => fns.reduceRight((v, f) => f(v), x);
```

---

##### `find()` / `findIndex()` / `findLast()` - 查找元素

```javascript
// find - 返回第一个满足条件的元素
arr.find((element, index, array) => condition);

// findIndex - 返回第一个满足条件的索引
arr.findIndex((element, index, array) => condition);

// findLast - 返回最后一个满足条件的元素 (ES2023)
arr.findLast((element, index, array) => condition);

// 示例
[1, 2, 3, 4, 5].find(x => x > 3); // 4
[1, 2, 3, 4, 5].findIndex(x => x > 3); // 3

// 常见面试题
const users = [{id: 1, name: 'a'}, {id: 2, name: 'b'}];
users.find(u => u.id === 2); // {id: 2, name: 'b'}
```

---

##### `some()` / `every()` - 断言方法

```javascript
// some - 是否有任意一个满足条件
arr.some((element, index, array) => condition);
// 返回 true/false

// every - 是否全部满足条件
arr.every((element, index, array) => condition);
// 返回 true/false

// 示例
[1, 2, 3].some(x => x > 2); // true
[1, 2, 3].every(x => x > 0); // true
```

---

#### 1.2 转换方法

##### `flat()` / `flatMap()` - 扁平化

```javascript
// flat - 扁平化数组
arr.flat(depth); // depth: 深度，默认为 1，Infinity 为无限

// 示例
[1, [2, [3, [4]]]].flat(); // [1, 2, [3, [4]]]
[1, [2, [3, [4]]]].flat(2); // [1, 2, 3, [4]]
[1, [2, [3, [4]]]].flat(Infinity); // [1, 2, 3, 4]

// flatMap - map + flat
arr.flatMap((element, index, array) => {
    return newArray; // 会被扁平化
});

// 示例
[1, 2, 3].flatMap(x => [x, x * 2]); // [1, 2, 2, 4, 3, 6]
['hello world'].flatMap(s => s.split(' ')); // ['hello', 'world']
```

---

##### `sort()` - 排序

```javascript
arr.sort((a, b) => comparison);
// 返回修改后的数组（修改原数组）

// 数值升序
[3, 1, 2].sort((a, b) => a - b); // [1, 2, 3]

// 数值降序
[3, 1, 2].sort((a, b) => b - a); // [3, 2, 1]

// 按字符串长度排序
['abc', 'a', 'abcd'].sort((a, b) => a.length - b.length); // ['a', 'abc', 'abcd']

// 常见面试题：稳定排序
// V8 使用 TimSort，sort() 是稳定的
```

---

##### `reverse()` - 反转

```javascript
arr.reverse();
// 返回修改后的数组（修改原数组）

// 示例
[1, 2, 3].reverse(); // [3, 2, 1]
```

---

#### 1.3 增删改方法

##### `push()` / `pop()` - 末尾操作

```javascript
arr.push(...elements); // 返回新长度
arr.pop(); // 返回删除的元素
// 修改原数组

// 示例
const arr = [1, 2];
arr.push(3); // 3
arr; // [1, 2, 3]
arr.pop(); // 3
arr; // [1, 2]
```

---

##### `unshift()` / `shift()` - 开头操作

```javascript
arr.unshift(...elements); // 返回新长度
arr.shift(); // 返回删除的元素
// 修改原数组

// 示例
const arr = [1, 2];
arr.unshift(0); // 3
arr; // [0, 1, 2]
arr.shift(); // 0
arr; // [1, 2]
```

---

##### `splice()` - 插入/删除/替换

```javascript
arr.splice(start, deleteCount, ...items);
// 返回删除元素组成的数组
// 修改原数组

// 示例
const arr = [1, 2, 3, 4, 5];

// 删除
arr.splice(1, 2); // [2, 3]
arr; // [1, 4, 5]

// 插入
arr.splice(1, 0, 2, 3); // []
arr; // [1, 2, 3, 4, 5]

// 替换
arr.splice(1, 2, 'a', 'b'); // [2, 3]
arr; // [1, 'a', 'b', 4, 5]
```

---

##### `fill()` - 填充

```javascript
arr.fill(value, start, end);
// 修改原数组

// 示例
[1, 2, 3].fill(0); // [0, 0, 0]
[1, 2, 3].fill(0, 1, 2); // [1, 0, 3]
[1, 2, 3].fill(0, -2, -1); // [1, 0, 3]
```

---

##### `copyWithin()` - 浅拷贝覆盖

```javascript
arr.copyWithin(target, start, end);
// 修改原数组

// 示例
[1, 2, 3, 4, 5].copyWithin(0, 3); // [4, 5, 3, 4, 5]
[1, 2, 3, 4, 5].copyWithin(1, 3, 4); // [1, 4, 3, 4, 5]
```

---

##### `toReversed()` / `toSorted()` / `toSpliced()` (ES2023)

```javascript
// 不修改原数组的版本
const newArr = arr.toReversed();
const newArr = arr.toSorted((a, b) => a - b);
const newArr = arr.toSpliced(1, 2, 'a', 'b');

// 示例
const arr = [3, 1, 2];
arr.toSorted(); // [1, 2, 3]
arr; // [3, 1, 2] - 原数组不变
```

---

#### 1.4 查找方法

##### `indexOf()` / `lastIndexOf()` - 查找索引

```javascript
arr.indexOf(searchElement, fromIndex);
arr.lastIndexOf(searchElement, fromIndex);

// 示例
[1, 2, 3, 2, 1].indexOf(2); // 1
[1, 2, 3, 2, 1].lastIndexOf(2); // 3
[1, 2, 3].indexOf(4); // -1
```

---

##### `includes()` - 包含判断

```javascript
arr.includes(searchElement, fromIndex);
// 返回 true/false

// 示例
[1, 2, 3].includes(2); // true
[1, 2, NaN].includes(NaN); // true (ES2016)
[1, 2, 3].includes(2, 2); // false
```

---

#### 1.5 组合方法

##### `concat()` - 合并数组

```javascript
const newArr = arr.concat(...arrays);

// 示例
[1, 2].concat([3, 4], [5, 6]); // [1, 2, 3, 4, 5, 6]
[1, 2].concat(3, [4, 5]); // [1, 2, 3, 4, 5]
```

---

##### `slice()` - 浅拷贝

```javascript
const newArr = arr.slice(start, end);
// 不修改原数组

// 示例
[1, 2, 3, 4, 5].slice(1, 3); // [2, 3]
[1, 2, 3, 4, 5].slice(1); // [2, 3, 4, 5]
[1, 2, 3, 4, 5].slice(-3); // [3, 4, 5]
[1, 2, 3].slice(); // [1, 2, 3] - 浅拷贝
```

---

##### `join()` - 转为字符串

```javascript
const str = arr.join(separator);
// separator: 分隔符，默认为逗号

// 示例
[1, 2, 3].join(); // '1,2,3'
[1, 2, 3].join(''); // '123'
[1, 2, 3].join('-'); // '1-2-3'
```

---

##### `at()` - 访问元素 (ES2022)

```javascript
const element = arr.at(index);
// 支持负索引

// 示例
[1, 2, 3].at(0); // 1
[1, 2, 3].at(-1); // 3
[1, 2, 3].at(-2); // 2
```

---

##### `with()` - 返回新数组 (ES2023)

```javascript
const newArr = arr.with(index, value);
// 返回新数组，不修改原数组

// 示例
const arr = [1, 2, 3];
arr.with(1, 'x'); // [1, 'x', 3]
// arr 仍是 [1, 2, 3]
```

---

### 二十三-2、字符串方法 (String)

#### 2.1 访问与查找

##### `charAt()` - 获取字符

```javascript
const char = str.charAt(index);
// 返回指定位置的字符，超出范围返回 ''

// 示例
'hello'.charAt(1); // 'e'
'hello'.charAt(10); // ''
```

---

##### `charCodeAt()` - 获取字符码

```javascript
const code = str.charCodeAt(index);
// 返回指定位置字符的 Unicode 编码

// 示例
'a'.charCodeAt(0);  // 97
'中'.charCodeAt(0); // 20013
```

---

##### `codePointAt()` - 获取码点 (ES6)

```javascript
const code = str.codePointAt(index);
// 处理四字节 UTF-16 字符

// 示例
'😀'.codePointAt(0); // 128512
// charCodeAt 无法正确处理
'😀'.charCodeAt(0);  // 55357 (错误)
```

---

##### `indexOf()` / `lastIndexOf()`

```javascript
const index = str.indexOf(searchString, position);
const index = str.lastIndexOf(searchString, position);

// 示例
'hello world'.indexOf('o');      // 4
'hello world'.indexOf('o', 5);   // 7
'hello world'.lastIndexOf('o');  // 7
```

---

##### `includes()` - 是否包含 (ES6)

```javascript
const result = str.includes(searchString, position);
// 返回 true/false

// 示例
'hello'.includes('ell');    // true
'hello'.includes('ell', 1); // true
'hello'.includes('ell', 2); // false
```

---

##### `startsWith()` / `endsWith()`

```javascript
const result = str.startsWith(searchString, position);
const result = str.endsWith(searchString, position);

// 示例
'hello'.startsWith('hel');      // true
'hello'.startsWith('llo', 2);   // true
'hello'.endsWith('lo');         // true
```

---

#### 2.2 截取与转换

##### `slice()` - 截取字符串

```javascript
const newStr = str.slice(start, end);
// 支持负数

// 示例
'hello world'.slice(1, 5);   // 'ello'
'hello world'.slice(1);      // 'ello world'
'hello world'.slice(-5);     // 'world'
```

---

##### `substring()` - 截取字符串

```javascript
const newStr = str.substring(start, end);
// 不支持负数，自动交换参数

// 示例
'hello'.substring(1, 4); // 'ell'
'hello'.substring(4, 1); // 'ell' - 自动交换
'hello'.substring(-2);   // 'hello' - 负数视为 0
```

---

##### `substr()` - 截取字符串 (已废弃)

```javascript
// 不推荐使用，已移出 Web 标准
const newStr = str.substr(start, length);
```

---

##### `trim()` - 去除首尾空白

```javascript
const newStr = str.trim();
// 去除空格、制表符、换行符等

// 示例
'  hello  '.trim(); // 'hello'
```

---

##### `trimStart()` / `trimEnd()` (ES2019)

```javascript
const newStr = str.trimStart();
const newStr = str.trimEnd();
// 或 trimLeft() / trimRight()

// 示例
'  hello  '.trimStart();  // 'hello  '
'  hello  '.trimEnd();    // '  hello'
```

---

#### 2.3 大小写转换

```javascript
'hello'.toUpperCase(); // 'HELLO'
'HELLO'.toLowerCase(); // 'hello'

// 特定 locale
'türkçe'.toLocaleUpperCase('tr-TR'); // 'TÜRKÇE'
'türkçe'.toLocaleLowerCase('tr-TR'); // 'türkçe'
```

---

#### 2.4 分割与连接

##### `split()` - 分割字符串

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

##### `concat()` - 连接字符串

```javascript
const newStr = str.concat(str1, str2, ...);
// 不常用，更推荐使用 + 或模板字符串

// 示例
'hello'.concat(' ', 'world'); // 'hello world'
```

---

##### `repeat()` - 重复字符串 (ES6)

```javascript
const newStr = str.repeat(count);

// 示例
'hello'.repeat(3); // 'hellohellohello'
''.padEnd(5); // '     '
```

---

##### `padStart()` / `padEnd()` - 填充 (ES2017)

```javascript
const newStr = str.padStart(length, padString);
const newStr = str.padEnd(length, padString);

// 示例
'hello'.padStart(10); // '     hello'
'hello'.padStart(10, '*'); // '*****hello'
'hello'.padEnd(10); // 'hello     '
```

---

##### `replace()` / `replaceAll()`

```javascript
const newStr = str.replace(searchValue, replaceValue);
// replace: 只替换第一个
// replaceAll: 替换所有 (ES2021)

// searchValue: 字符串或正则
// replaceValue: 字符串或函数

// 示例
'hello world'.replace('o', 'x'); // 'hellx world'
'hello world'.replaceAll('o', 'x'); // 'hellx wxrld'

// 使用正则
'hello world'.replace(/o/g, 'x'); // 'hellx wxrld'

// 使用函数
'hello'.replace(/l/g, (match) => match.toUpperCase()); // 'heLLo'
```

---

##### `match()` / `matchAll()`

```javascript
const result = str.match(regexp);
// 返回数组或 null

// 示例
'hello world'.match(/\w+/g); // ['hello', 'world']
'hello'.match(/x/); // null

// matchAll 返回迭代器
const matches = 'hello'.matchAll(/l/g);
[...matches]; // [['l', index: 2], ['l', index: 3]]
```

---

##### `search()` - 搜索

```javascript
const index = str.search(regexp);
// 返回第一个匹配的索引，未找到返回 -1

// 示例
'hello world'.search(/world/); // 6
'hello'.search(/x/); // -1
```

---

### 二十三-3、对象方法 (Object)

#### 3.1 创建与属性

##### `Object.create()` - 创建对象

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

##### `Object.assign()` - 合并对象

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

##### 扩展运算符 (ES6)

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

#### 3.2 属性操作

##### `Object.keys()` - 获取键数组

```javascript
const keys = Object.keys(obj);
// 返回自身可枚举属性（不含继承）

// 示例
Object.keys({a: 1, b: 2}); // ['a', 'b']
Object.keys([1, 2, 3]); // ['0', '1', '2']
Object.keys('hello'); // ['0', '1', '2', '3', '4']
```

---

##### `Object.values()` - 获取值数组 (ES2017)

```javascript
const values = Object.values(obj);

// 示例
Object.values({a: 1, b: 2}); // [1, 2]
Object.values([1, 2, 3]); // [1, 2, 3]
```

---

##### `Object.entries()` - 获取键值对数组 (ES2017)

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

##### `Object.fromEntries()` - 键值对转对象 (ES2019)

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

##### `Object.hasOwn()` - 判断自身属性 (ES2022)

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

##### `Object.hasOwnProperty()` - 判断自身属性

```javascript
const result = obj.hasOwnProperty(prop);

// 示例
({a: 1}).hasOwnProperty('a'); // true
({a: 1}).hasOwnProperty('toString'); // false
```

---

##### `Object.getOwnPropertyNames()` - 获取所有属性名

```javascript
const names = Object.getOwnPropertyNames(obj);
// 包括不可枚举属性

// 示例
Object.getOwnPropertyNames([1, 2, 3]); // ['0', '1', '2', 'length']
```

---

##### `Object.getOwnPropertySymbols()` - 获取 Symbol 属性

```javascript
const symbols = Object.getOwnPropertySymbols(obj);

// 示例
const sym = Symbol('a');
const obj = {[sym]: 1};
Object.getOwnPropertySymbols(obj); // [Symbol(a)]
```

---

#### 3.3 原型操作

##### `Object.getPrototypeOf()` - 获取原型

```javascript
const proto = Object.getPrototypeOf(obj);

// 示例
Object.getPrototypeOf({}); // Object.prototype
Object.getPrototypeOf([]); // Array.prototype
```

---

##### `Object.setPrototypeOf()` - 设置原型

```javascript
Object.setPrototypeOf(obj, proto);
// 性能较差，建议使用 Object.create()

// 示例
const parent = {x: 1};
const child = {};
Object.setPrototypeOf(child, parent);
child.x; // 1
```

---

#### 3.4 属性描述符

##### `Object.defineProperty()` - 定义属性

```javascript
Object.defineProperty(obj, prop, descriptor);

// descriptor
{
    value: 'Tom',
    writable: false,      // 可写
    enumerable: true,     // 可枚举
    configurable: false  // 可配置
}

// 或使用存取描述符
{
    get() { return this._name; },
    set(val) { this._name = val; },
    enumerable: true,
    configurable: true
}

// 示例
const obj = {};
Object.defineProperty(obj, 'name', {
    value: 'Tom',
    writable: false,
    enumerable: true,
    configurable: false
});
obj.name; // 'Tom'
obj.name = 'Jerry'; // 严格模式下报错
obj.name; // 'Tom'
```

---

##### `Object.getOwnPropertyDescriptor()` - 获取属性描述

```javascript
const descriptor = Object.getOwnPropertyDescriptor(obj, prop);

// 示例
Object.getOwnPropertyDescriptor({a: 1}, 'a');
// {value: 1, writable: true, enumerable: true, configurable: true}
```

---

#### 3.5 对象保护

##### 冻结 / 密封 / 扩展性

```javascript
// Object.freeze() - 不可修改/删除/添加
const frozen = Object.freeze({a: 1});
frozen.a = 2; // 静默失败
frozen.b = 3; // 静默失败
delete frozen.a; // 静默失败

// Object.seal() - 不可删除/添加（可修改）
const sealed = Object.seal({a: 1});
sealed.a = 2; // OK
delete sealed.a; // 静默失败

// Object.preventExtensions() - 不可添加
const ext = Object.preventExtensions({a: 1});
ext.b = 2; // 静默失败

// 检查状态
Object.isFrozen(obj);
Object.isSealed(obj);
Object.isExtensible(obj);
```

---

### 二十三-4、ES6+ 新增语法

#### 4.1 解构赋值

```javascript
// 数组解构
const [a, b, c] = [1, 2, 3]; // a=1, b=2, c=3
const [a, , c] = [1, 2, 3]; // a=1, c=3
const [a, ...rest] = [1, 2, 3]; // a=1, rest=[2, 3]
const [a, b = 10] = [1]; // a=1, b=10

// 对象解构
const {name, age} = {name: 'Tom', age: 18};
const {name: n, age: a} = {name: 'Tom', age: 18}; // n='Tom', a=18
const {name, age = 18} = {name: 'Tom'}; // age=18

// 函数参数解构
function fn({x, y}) { return x + y; }
fn({x: 1, y: 2}); // 3

// 交换变量
[a, b] = [b, a];
```

---

#### 4.2 模板字符串

```javascript
const name = 'Tom';
const age = 18;

// 嵌入变量
`My name is ${name}, I'm ${age} years old`;

// 多行
`line1
line2
line3`;

// 标签函数
function tag(strings, ...values) {
    return strings[0] + values.join('|') + strings[1];
}
tag`Hello ${name}!`; // 'Hello Tom!'
```

---

#### 4.3 箭头函数

```javascript
const add = (a, b) => a + b;
const getObj = () => ({x: 1});
const arr = [1, 2, 3].map(x => x * 2);

// 特点：
// 1. 没有自己的 this
// 2. 没有 arguments
// 3. 不能用作构造函数
// 4. 没有 prototype
```

---

#### 4.4 剩余参数与展开运算符

```javascript
// 剩余参数
function fn(a, ...rest) {
    console.log(a, rest);
}
fn(1, 2, 3); // 1, [2, 3]

// 展开运算符
const arr = [1, 2, 3];
[...arr]; // [1, 2, 3]
[0, ...arr, 4]; // [0, 1, 2, 3, 4]

const obj = {a: 1};
{...obj, b: 2}; // {a: 1, b: 2}

// 浅拷贝
[...arr]; // 数组
{...obj}; // 对象
```

---

#### 4.5 可选链与空值合并

```javascript
// 可选链 (ES2020)
obj?.prop;
arr?.[0];
fn?.();

// 空值合并 (ES2020)
const value = a ?? b;
// a 为 null 或 undefined 时使用 b

// 逻辑空赋值 (ES2021)
a ??= b;
```

---

#### 4.6 BigInt

```javascript
// 创建
const big = 123n;
const big = BigInt(123);

// 运算
1n + 2n;
2n ** 10n;
7n / 2n;

// 比较
1n === 1;
1n == 1;
```

---

#### 4.7 动态导入

```javascript
const module = await import('./module.js');
```

---

### 二十三-5、Math 数学运算

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

### 二十三-6、Number 数值方法

```javascript
// 转换为数值
Number('123');     // 123
Number('12.3');    // 12.3
Number('12a');     // NaN
Number(true);      // 1
Number(false);     // 0
Number(null);      // 0
Number(undefined);  // NaN

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

### 二十三-7、Date 日期处理

#### 创建日期

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

#### 获取方法

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

#### 设置方法

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

#### 格式化方法

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

#### 时间戳

```javascript
// 获取时间戳
Date.now();              // 当前时间戳
new Date().getTime();
+new Date();             // 隐式转换

// 时间戳转日期
new Date(timestamp);

// 日期转时间戳
new Date('2024-01-01').getTime();
new Date('2024-01-01').valueOf();
+new Date('2024-01-01');
```

---

### 二十三-8、JSON 数据转换

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

### 二十三-9、Map 与 Set

#### Map 完整 API

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

#### Set 完整 API

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

### 二十三-10、Symbol 与 BigInt

#### Symbol 完整用法

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

#### BigInt

```javascript
// 创建
const big = 123n;
const big = BigInt(123);

// 运算
1n + 2n;
2n ** 10n;
7n / 2n;

// 比较
1n === 1;
1n == 1;
```

---

### 二十三-11、Proxy 与 Reflect

#### Proxy

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

#### Reflect

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

### 二十三-12、异步编程 Promise

#### Promise 基础

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

#### Promise 静态方法

```javascript
// Promise.resolve() - 创建已决议的 Promise
Promise.resolve(value);
Promise.resolve(promise);
Promise.resolve(() => {});

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
    .catch(errors => { ... });
```

#### async/await

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
        await processItem(item);
    }
}

async function parallel() {
    await Promise.all(items.map(item => processItem(item)));
}
```

---

### 二十三-13、手写代码常用模式

#### 1. 深拷贝

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

#### 2. 防抖 (Debounce)

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

#### 3. 节流 (Throttle)

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

#### 4. 科里化 (Curry)

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

#### 5. 偏函数 (Partial)

```javascript
function partial(fn, ...args) {
    return function(...args2) {
        return fn(...args, ...args2);
    };
}

// 示例
const add = (a, b, c) => a + b + c;
const add5 = partial(add, 5);
add5(1, 2); // 8
```

#### 6. 数组去重

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

#### 7. 数组扁平化

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

#### 8. 合并有序数组

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

#### 9. LRU 缓存

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
        this.cache.set(key, value);
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

#### 10. 快速排序

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

#### 11. 归并排序

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

#### 12. 二分查找

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

#### 13. 斐波那契数列

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

#### 14. 洗牌算法 (Fisher-Yates)

```javascript
function shuffle(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}
```

#### 15. 顺序执行异步任务

```javascript
async function sequential(tasks) {
    const results = [];
    for (const task of tasks) {
        results.push(await task());
    }
    return results;
}
```

#### 16. 并发限制

```javascript
async function concurrencyLimit(tasks, limit) {
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

#### 17. 模拟 API 请求（带重试）

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
