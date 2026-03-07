# TypeScript 基础

## 第一章：TypeScript 入门与基础

### 1.1 为什么学习 TypeScript

**面试官提问**

TypeScript 是由微软开发的 JavaScript 超集。它为 JavaScript 添加了可选的静态类型、接口、泛型等高级特性，使得大型项目的开发更加安全和高效。

**主要优势包括**：

1. **强大的类型系统** - 在编译阶段就能发现潜在错误
2. **静态类型检查** - 代码在运行前就能发现类型错误
3. **完善的IDE支持** - 智能提示、代码导航、重构工具
4. **面向对象特性** - 类、接口、继承、抽象类
5. **现代JavaScript特性** - 支持最新的 ECMAScript 标准
6. **代码可读性和可维护性** - 类型即文档
7. **更好的团队协作** - 类型定义明确，减少沟通成本
8. **生态系统丰富** - 主流框架都提供 TypeScript 支持

---

### 1.2 TypeScript 与 JavaScript 的区别

**面试官提问**

| 特性 | JavaScript | TypeScript |
|------|------------|------------|
| 类型系统 | 动态类型 | 静态类型（可选） |
| 编译时检查 | 无 | 有 |
| 代码提示 | 有限 | 完整且准确 |
| 重构支持 | 困难 | 容易且安全 |
| 学习曲线 | 低 | 中等 |
| 运行时代码 | 直接执行 | 编译为 JavaScript |
| 接口/抽象类 | 不支持 | 完全支持 |
| 泛型 | 不支持 | 支持 |
| 装饰器 | 不支持 | 支持 |
| 模块系统 | ES Modules | ES Modules + namespace |

---

### 1.3 TypeScript 环境搭建与配置

**面试官提问**

#### 1.3.1 安装 TypeScript

```bash
# 全局安装 TypeScript
npm install -g typescript

# 检查安装版本
tsc -v

# 初始化 TypeScript 项目
tsc --init
```

#### 1.3.2 编译 TypeScript 文件

```bash
# 编译单个文件
tsc app.ts

# 监听模式自动编译
tsc app.ts --watch

# 编译整个项目
tsc

# 编译并指定配置文件
tsc --project tsconfig.json
```

#### 1.3.3 tsconfig.json 配置文件详解

```json
{
    "compilerOptions": {
        /* 基础配置 */
        "target": "ES2020",
        "module": "ESNext",
        "lib": ["ES2020", "DOM"],

        /* 严格模式 */
        "strict": true,
        "strictNullChecks": true,
        "strictFunctionTypes": true,
        "strictPropertyInitialization": true,

        /* 模块解析 */
        "moduleResolution": "node",
        "baseUrl": "./",
        "paths": {
            "@/*": ["src/*"]
        },
        "resolveJsonModule": true,

        /* 输出配置 */
        "outDir": "./dist",
        "rootDir": "./src",
        "declaration": true,
        "declarationDir": "./types",

        /* JavaScript 支持 */
        "allowJs": true,
        "checkJs": true,

        /* 其他选项 */
        "jsx": "react-jsx",
        "esModuleInterop": true,
        "skipLibCheck": true,
        "forceConsistentCasingInFileNames": true,
        "isolatedModules": true,
        "noUnusedLocals": true,
        "noUnusedParameters": true,

        /* 实验性特性 */
        "experimentalDecorators": true,
        "emitDecoratorMetadata": true
    },
    "include": ["src/**/*"],
    "exclude": ["node_modules", "dist"],
    "references": [{ "path": "./tsconfig.node.json" }]
}
```

---

## 第二章：TypeScript 基础类型系统

### 2.1 JavaScript 原始类型

**面试官提问**

TypeScript 完全支持 JavaScript 的原始类型，并为其添加了类型注解功能。

#### 2.1.1 布尔类型 (boolean)

```typescript
let isDone: boolean = false;
let isLoading: boolean = true;

const isActive: boolean = !isDone;
const canAccess: boolean = isDone && isLoading;
const hasPermission: boolean = isDone || isLoading;
```

#### 2.1.2 数字类型 (number)

```typescript
let count: number = 10;
let decimal: number = 6.99;
let hex: number = 0xf00d;
let binary: number = 0b1010;
let octal: number = 0o744;

let infinity: number = Infinity;
let negativeInfinity: number = -Infinity;
let notANumber: number = NaN;
```

#### 2.1.3 字符串类型 (string)

```typescript
let name: string = "Tom";
let greeting: string = 'Hello';
let template: string = `Hello, ${name}!`;
```

#### 2.1.4 数组类型 (array)

```typescript
let list: number[] = [1, 2, 3];
let list2: Array<number> = [1, 2, 3];

const readonlyList: readonly number[] = [1, 2, 3];
const immutableList: ReadonlyArray<number> = [1, 2, 3];
```

#### 2.1.5 元组类型 (tuple)

```typescript
let tuple: [string, number];
tuple = ["hello", 10];

let optionalTuple: [string, number?];
optionalTuple = ["hello"];
optionalTuple = ["hello", 10];

const httpResponse: [status: number, body: string] = [200, "OK"];
```

#### 2.1.6 枚举类型 (enum)

```typescript
enum Color {
    Red,
    Green,
    Blue
}

enum Direction {
    Up = "UP",
    Down = "DOWN",
    Left = "LEFT",
    Right = "RIGHT"
}

const enum Directions {
    Up,
    Down,
    Left,
    Right
}
```

#### 2.1.7 Any 类型

```typescript
let notSure: any = 4;
notSure = "maybe a string";
notSure = false;

notSure.toString();
notSure.foo();
notSure.bar();

let anyList: any[] = [1, "hello", true, { name: "Tom" }];
```

#### 2.1.8 Void 类型

```typescript
function warnUser(): void {
    console.log("This is a warning");
}

let unusable: void = undefined;
```

#### 2.1.9 Null 和 Undefined

```typescript
let u: undefined = undefined;
let n: null = null;

let num: number | undefined = undefined;
let str: string | null = null;
```

#### 2.1.10 Never 类型

```typescript
function error(message: string): never {
    throw new Error(message);
}

function infiniteLoop(): never {
    while (true) {}
}
```

#### 2.1.11 Object 类型

```typescript
let obj: object = { name: "Tom" };
let arr: object = [1, 2, 3];
let func: object = function() {};

let person: { name: string; age: number } = {
    name: "Tom",
    age: 25
};
```

---

### 2.2 any、unknown、never 的区别与使用场景

**面试官提问**

#### 2.2.1 any 类型

```typescript
let x: any = 10;
x = "hello";
x = true;
x.foo();
x.bar();
```

#### 2.2.2 unknown 类型

```typescript
let y: unknown = 10;
y = "hello";
y = true;

if (typeof y === "string") {
    console.log(y.toUpperCase());
}

const str: string = y as string;
```

#### 2.2.3 never 类型

```typescript
function throwError(message: string): never {
    throw new Error(message);
}

function infiniteLoop(): never {
    while (true) {}
}
```

#### 2.2.4 三者对比

| 特性 | any | unknown | never |
|------|-----|---------|-------|
| 类型检查 | 无 | 有 | 不适用 |
| 赋值给其他类型 | 可以 | 不可以 | 可以 |
| 可访问属性 | 可以 | 不可以 | 不可以 |
| 使用场景 | 迁移JS、动态类型 | API类型安全 | 异常处理、穷尽检查 |

---

## 第三章：接口与类型别名

### 3.1 接口的定义和使用

**面试官提问**

#### 3.1.1 基本接口定义

```typescript
interface Person {
    name: string;
    age: number;
    email?: string;
    readonly id: number;
}

const person: Person = {
    name: "Tom",
    age: 25,
    id: 1
};
```

#### 3.1.2 接口的方法

```typescript
interface Animal {
    name: string;
    speak(): void;
    move(distance: number): void;
}

class Dog implements Animal {
    name = "Dog";
    speak(): void {
        console.log("Woof!");
    }
    move(distance: number): void {
        console.log(`Dog moved ${distance}m`);
    }
}
```

#### 3.1.3 接口的继承

```typescript
interface Named {
    name: string;
}

interface Person extends Named {
    age: number;
}

interface Logger {
    log(message: string): void;
}

interface Serializable {
    serialize(): string;
}

interface PersistentLogger extends Logger, Serializable {
    save(): void;
}
```

#### 3.1.4 接口的函数类型

```typescript
interface SearchFunc {
    (source: string, subString: string): boolean;
}

const search: SearchFunc = (source, subString) => {
    return source.includes(subString);
};
```

#### 3.1.5 接口的索引签名

```typescript
interface StringDictionary {
    [key: string]: string;
}

const dict: StringDictionary = {
    hello: "world",
    foo: "bar"
};
```
