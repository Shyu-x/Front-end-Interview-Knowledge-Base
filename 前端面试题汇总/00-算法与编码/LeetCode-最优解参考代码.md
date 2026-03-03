# LeetCode 热题 Hot 100 + 面试经典 150 题 - 最优解参考代码

> 作者: Shyu
> 本文档提供每道题的最优解参考代码，包含 JavaScript ES6 和 TypeScript 两个版本

---

## 目录

1. [哈希表](#一哈希表)
2. [双指针](#二双指针)
3. [滑动窗口](#三滑动窗口)
4. [普通数组](#四普通数组)
5. [矩阵](#五矩阵)
6. [链表](#六链表)
7. [二叉树](#七二叉树)
8. [图论](#八图论)
9. [回溯](#九回溯)
10. [二分查找](#十二分查找)
11. [栈](#十一栈)
12. [堆](#十二堆)
13. [贪心算法](#十三贪心算法)
14. [动态规划](#十四动态规划)
15. [位运算](#十五位运算)
16. [数学](#十六数学)
17. [Trie](#十七trie)

---

## 一、哈希表

### 1.1 两数之和 (#1)

```typescript
// TypeScript
function twoSum(nums: number[], target: number): number[] {
  const map = new Map<number, number>();
  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];
    if (map.has(complement)) {
      return [map.get(complement)!, i];
    }
    map.set(nums[i], i);
  }
  return [];
}
```

```javascript
// JavaScript ES6
function twoSum(nums, target) {
  const map = new Map();
  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];
    if (map.has(complement)) {
      return [map.get(complement), i];
    }
    map.set(nums[i], i);
  }
  return [];
}
```

### 1.2 字母异位词分组 (#49)

```typescript
// TypeScript
function groupAnagrams(strs: string[]): string[][] {
  const map = new Map<string, string[]>();
  for (const str of strs) {
    const key = str.split('').sort().join('');
    if (!map.has(key)) map.set(key, []);
    map.get(key)!.push(str);
  }
  return Array.from(map.values());
}
```

```javascript
// JavaScript ES6
function groupAnagrams(strs) {
  const map = new Map();
  for (const str of strs) {
    const key = str.split('').sort().join('');
    if (!map.has(key)) map.set(key, []);
    map.get(key).push(str);
  }
  return Array.from(map.values());
}
```

### 1.3 最长连续序列 (#128)

```typescript
// TypeScript
function longestConsecutive(nums: number[]): number[] {
  const set = new Set(nums);
  let maxLen = 0;
  for (const num of set) {
    if (!set.has(num - 1)) {
      let len = 1;
      while (set.has(num + len)) len++;
      maxLen = Math.max(maxLen, len);
    }
  }
  return maxLen;
}
```

```javascript
// JavaScript ES6
function longestConsecutive(nums) {
  const set = new Set(nums);
  let maxLen = 0;
  for (const num of set) {
    if (!set.has(num - 1)) {
      let len = 1;
      while (set.has(num + len)) len++;
      maxLen = Math.max(maxLen, len);
    }
  }
  return maxLen;
}
```

---

## 二、双指针

### 2.1 移动零 (#283)

```typescript
// TypeScript
function moveZeroes(nums: number[]): void {
  let left = 0;
  for (let right = 0; right < nums.length; right++) {
    if (nums[right] !== 0) {
      [nums[left], nums[right]] = [nums[right], nums[left]];
      left++;
    }
  }
}
```

```javascript
// JavaScript ES6
function moveZeroes(nums) {
  let left = 0;
  for (let right = 0; right < nums.length; right++) {
    if (nums[right] !== 0) {
      [nums[left], nums[right]] = [nums[right], nums[left]];
      left++;
    }
  }
}
```

### 2.2 盛最多水的容器 (#11)

```typescript
// TypeScript
function maxArea(height: number[]): number {
  let left = 0, right = height.length - 1;
  let maxArea = 0;
  while (left < right) {
    const area = (right - left) * Math.min(height[left], height[right]);
    maxArea = Math.max(maxArea, area);
    if (height[left] < height[right]) {
      left++;
    } else {
      right--;
    }
  }
  return maxArea;
}
```

```javascript
// JavaScript ES6
function maxArea(height) {
  let left = 0, right = height.length - 1;
  let maxArea = 0;
  while (left < right) {
    const area = (right - left) * Math.min(height[left], height[right]);
    maxArea = Math.max(maxArea, area);
    if (height[left] < height[right]) {
      left++;
    } else {
      right--;
    }
  }
  return maxArea;
}
```

### 2.3 三数之和 (#15)

```typescript
// TypeScript
function threeSum(nums: number[]): number[][] {
  const result: number[][] = [];
  nums.sort((a, b) => a - b);
  for (let i = 0; i < nums.length - 2; i++) {
    if (i > 0 && nums[i] === nums[i - 1]) continue;
    let left = i + 1, right = nums.length - 1;
    while (left < right) {
      const sum = nums[i] + nums[left] + nums[right];
      if (sum === 0) {
        result.push([nums[i], nums[left], nums[right]]);
        while (left < right && nums[left] === nums[left + 1]) left++;
        while (left < right && nums[right] === nums[right - 1]) right--;
        left++;
        right--;
      } else if (sum < 0) {
        left++;
      } else {
        right--;
      }
    }
  }
  return result;
}
```

```javascript
// JavaScript ES6
function threeSum(nums) {
  const result = [];
  nums.sort((a, b) => a - b);
  for (let i = 0; i < nums.length - 2; i++) {
    if (i > 0 && nums[i] === nums[i - 1]) continue;
    let left = i + 1, right = nums.length - 1;
    while (left < right) {
      const sum = nums[i] + nums[left] + nums[right];
      if (sum === 0) {
        result.push([nums[i], nums[left], nums[right]]);
        while (left < right && nums[left] === nums[left + 1]) left++;
        while (left < right && nums[right] === nums[right - 1]) right--;
        left++;
        right--;
      } else if (sum < 0) {
        left++;
      } else {
        right--;
      }
    }
  }
  return result;
}
```

---

## 三、滑动窗口

### 3.1 无重复字符的最长子串 (#3)

```typescript
// TypeScript
function lengthOfLongestSubstring(s: string): number {
  const map = new Map<string, number>();
  let maxLen = 0, left = 0;
  for (let right = 0; right < s.length; right++) {
    if (map.has(s[right]) && map.get(s[right])! >= left) {
      left = map.get(s[right])! + 1;
    }
    map.set(s[right], right);
    maxLen = Math.max(maxLen, right - left + 1);
  }
  return maxLen;
}
```

```javascript
// JavaScript ES6
function lengthOfLongestSubstring(s) {
  const map = new Map();
  let maxLen = 0, left = 0;
  for (let right = 0; right < s.length; right++) {
    if (map.has(s[right]) && map.get(s[right]) >= left) {
      left = map.get(s[right]) + 1;
    }
    map.set(s[right], right);
    maxLen = Math.max(maxLen, right - left + 1);
  }
  return maxLen;
}
```

### 3.2 最小覆盖子串 (#76)

```typescript
// TypeScript
function minWindow(s: string, t: string): string {
  const need = new Map<string, number>();
  const window = new Map<string, number>();
  for (const c of t) need.set(c, (need.get(c) || 0) + 1);
  let valid = 0, left = 0, start = 0, minLen = Infinity;
  for (let right = 0; right < s.length; right++) {
    const c = s[right];
    if (need.has(c)) {
      window.set(c, (window.get(c) || 0) + 1);
      if (window.get(c) === need.get(c)) valid++;
    }
    while (valid === need.size) {
      if (right - left + 1 < minLen) {
        minLen = right - left + 1;
        start = left;
      }
      const d = s[left];
      if (need.has(d)) {
        if (window.get(d) === need.get(d)) valid--;
        window.set(d, window.get(d)! - 1);
      }
      left++;
    }
  }
  return minLen === Infinity ? '' : s.slice(start, start + minLen);
}
```

```javascript
// JavaScript ES6
function minWindow(s, t) {
  const need = new Map();
  const window = new Map();
  for (const c of t) need.set(c, (need.get(c) || 0) + 1);
  let valid = 0, left = 0, start = 0, minLen = Infinity;
  for (let right = 0; right < s.length; right++) {
    const c = s[right];
    if (need.has(c)) {
      window.set(c, (window.get(c) || 0) + 1);
      if (window.get(c) === need.get(c)) valid++;
    }
    while (valid === need.size) {
      if (right - left + 1 < minLen) {
        minLen = right - left + 1;
        start = left;
      }
      const d = s[left];
      if (need.has(d)) {
        if (window.get(d) === need.get(d)) valid--;
        window.set(d, window.get(d) - 1);
      }
      left++;
    }
  }
  return minLen === Infinity ? '' : s.slice(start, start + minLen);
}
```

---

## 四、普通数组

### 4.1 最大子数组和 (#53)

```typescript
// TypeScript
function maxSubArray(nums: number[]): number {
  let maxSum = nums[0], currentSum = nums[0];
  for (let i = 1; i < nums.length; i++) {
    currentSum = Math.max(nums[i], currentSum + nums[i]);
    maxSum = Math.max(maxSum, currentSum);
  }
  return maxSum;
}
```

```javascript
// JavaScript ES6
function maxSubArray(nums) {
  let maxSum = nums[0], currentSum = nums[0];
  for (let i = 1; i < nums.length; i++) {
    currentSum = Math.max(nums[i], currentSum + nums[i]);
    maxSum = Math.max(maxSum, currentSum);
  }
  return maxSum;
}
```

### 4.2 合并区间 (#56)

```typescript
// TypeScript
function merge(intervals: number[][]): number[][] {
  if (intervals.length <= 1) return intervals;
  intervals.sort((a, b) => a[0] - b[0]);
  const result: number[][] = [intervals[0]];
  for (let i = 1; i < intervals.length; i++) {
    const last = result[result.length - 1];
    if (intervals[i][0] <= last[1]) {
      last[1] = Math.max(last[1], intervals[i][1]);
    } else {
      result.push(intervals[i]);
    }
  }
  return result;
}
```

```javascript
// JavaScript ES6
function merge(intervals) {
  if (intervals.length <= 1) return intervals;
  intervals.sort((a, b) => a[0] - b[0]);
  const result = [intervals[0]];
  for (let i = 1; i < intervals.length; i++) {
    const last = result[result.length - 1];
    if (intervals[i][0] <= last[1]) {
      last[1] = Math.max(last[1], intervals[i][1]);
    } else {
      result.push(intervals[i]);
    }
  }
  return result;
}
```

### 4.3 轮转数组 (#189)

```typescript
// TypeScript
function rotate(nums: number[], k: number): void {
  k = k % nums.length;
  const reverse = (l: number, r: number) => {
    while (l < r) {
      [nums[l], nums[r]] = [nums[r], nums[l]];
      l++;
      r--;
    }
  };
  reverse(0, nums.length - 1);
  reverse(0, k - 1);
  reverse(k, nums.length - 1);
}
```

```javascript
// JavaScript ES6
function rotate(nums, k) {
  k = k % nums.length;
  const reverse = (l, r) => {
    while (l < r) {
      [nums[l], nums[r]] = [nums[r], nums[l]];
      l++;
      r--;
    }
  };
  reverse(0, nums.length - 1);
  reverse(0, k - 1);
  reverse(k, nums.length - 1);
}
```

### 4.4 除了自身数组乘积 (#238)

```typescript
// TypeScript
function productExceptSelf(nums: number[]): number[] {
  const n = nums.length;
  const result = new Array(n).fill(1);
  let prefix = 1;
  for (let i = 0; i < n; i++) {
    result[i] = prefix;
    prefix *= nums[i];
  }
  let suffix = 1;
  for (let i = n - 1; i >= 0; i--) {
    result[i] *= suffix;
    suffix *= nums[i];
  }
  return result;
}
```

```javascript
// JavaScript ES6
function productExceptSelf(nums) {
  const n = nums.length;
  const result = new Array(n).fill(1);
  let prefix = 1;
  for (let i = 0; i < n; i++) {
    result[i] = prefix;
    prefix *= nums[i];
  }
  let suffix = 1;
  for (let i = n - 1; i >= 0; i--) {
    result[i] *= suffix;
    suffix *= nums[i];
  }
  return result;
}
```

### 4.5 缺失的第一个正数 (#41)

```typescript
// TypeScript
function firstMissingPositive(nums: number[]): number {
  const n = nums.length;
  for (let i = 0; i < n; i++) {
    while (nums[i] > 0 && nums[i] <= n && nums[nums[i] - 1] !== nums[i]) {
      [nums[nums[i] - 1], nums[i]] = [nums[i], nums[nums[i] - 1]];
    }
  }
  for (let i = 0; i < n; i++) {
    if (nums[i] !== i + 1) return i + 1;
  }
  return n + 1;
}
```

```javascript
// JavaScript ES6
function firstMissingPositive(nums) {
  const n = nums.length;
  for (let i = 0; i < n; i++) {
    while (nums[i] > 0 && nums[i] <= n && nums[nums[i] - 1] !== nums[i]) {
      [nums[nums[i] - 1], nums[i]] = [nums[i], nums[nums[i] - 1]];
    }
  }
  for (let i = 0; i < n; i++) {
    if (nums[i] !== i + 1) return i + 1;
  }
  return n + 1;
}
```

---

## 五、矩阵

### 5.1 螺旋矩阵 (#54)

```typescript
// TypeScript
function spiralOrder(matrix: number[][]): number[] {
  if (!matrix.length) return [];
  const result: number[] = [];
  let top = 0, bottom = matrix.length - 1;
  let left = 0, right = matrix[0].length - 1;
  while (top <= bottom && left <= right) {
    for (let i = left; i <= right; i++) result.push(matrix[top][i]);
    top++;
    for (let i = top; i <= bottom; i++) result.push(matrix[i][right]);
    right--;
    if (top <= bottom) {
      for (let i = right; i >= left; i--) result.push(matrix[bottom][i]);
      bottom--;
    }
    if (left <= right) {
      for (let i = bottom; i >= top; i--) result.push(matrix[i][left]);
      left++;
    }
  }
  return result;
}
```

```javascript
// JavaScript ES6
function spiralOrder(matrix) {
  if (!matrix.length) return [];
  const result = [];
  let top = 0, bottom = matrix.length - 1;
  let left = 0, right = matrix[0].length - 1;
  while (top <= bottom && left <= right) {
    for (let i = left; i <= right; i++) result.push(matrix[top][i]);
    top++;
    for (let i = top; i <= bottom; i++) result.push(matrix[i][right]);
    right--;
    if (top <= bottom) {
      for (let i = right; i >= left; i--) result.push(matrix[bottom][i]);
      bottom--;
    }
    if (left <= right) {
      for (let i = bottom; i >= top; i--) result.push(matrix[i][left]);
      left++;
    }
  }
  return result;
}
```

### 5.2 旋转图像 (#48)

```typescript
// TypeScript
function rotate(matrix: number[][]): void {
  const n = matrix.length;
  for (let i = 0; i < Math.floor(n / 2); i++) {
    for (let j = 0; j < Math.ceil(n / 2); j++) {
      const temp = matrix[i][j];
      matrix[i][j] = matrix[n - 1 - j][i];
      matrix[n - 1 - j][i] = matrix[n - 1 - i][n - 1 - j];
      matrix[n - 1 - i][n - 1 - j] = matrix[j][n - 1 - i];
      matrix[j][n - 1 - i] = temp;
    }
  }
}
```

```javascript
// JavaScript ES6
function rotate(matrix) {
  const n = matrix.length;
  for (let i = 0; i < Math.floor(n / 2); i++) {
    for (let j = 0; j < Math.ceil(n / 2); j++) {
      const temp = matrix[i][j];
      matrix[i][j] = matrix[n - 1 - j][i];
      matrix[n - 1 - j][i] = matrix[n - 1 - i][n - 1 - j];
      matrix[n - 1 - i][n - 1 - j] = matrix[j][n - 1 - i];
      matrix[j][n - 1 - i] = temp;
    }
  }
}
```

---

## 六、链表

### 6.1 反转链表 (#206)

```typescript
// TypeScript
class ListNode {
  val: number;
  next: ListNode | null;
  constructor(val?: number, next?: ListNode | null) {
    this.val = (val === undefined ? 0 : val);
    this.next = (next === undefined ? null : next);
  }
}

function reverseList(head: ListNode | null): ListNode | null {
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
```

```javascript
// JavaScript ES6
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
```

### 6.2 环形链表 (#141)

```typescript
// TypeScript
function hasCycle(head: ListNode | null): boolean {
  let slow = head, fast = head;
  while (fast && fast.next) {
    slow = slow!.next;
    fast = fast.next.next;
    if (slow === fast) return true;
  }
  return false;
}
```

```javascript
// JavaScript ES6
function hasCycle(head) {
  let slow = head, fast = head;
  while (fast && fast.next) {
    slow = slow.next;
    fast = fast.next.next;
    if (slow === fast) return true;
  }
  return false;
}
```

### 6.3 合并两个有序链表 (#21)

```typescript
// TypeScript
function mergeTwoLists(l1: ListNode | null, l2: ListNode | null): ListNode | null {
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
```

```javascript
// JavaScript ES6
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
```

### 6.4 LRU缓存 (#146)

```typescript
// TypeScript
class LRUCache {
  private capacity: number;
  private cache: Map<number, number>;

  constructor(capacity: number) {
    this.capacity = capacity;
    this.cache = new Map();
  }

  get(key: number): number {
    if (!this.cache.has(key)) return -1;
    const value = this.cache.get(key)!;
    this.cache.delete(key);
    this.cache.set(key, value);
    return value;
  }

  put(key: number, value: number): void {
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

```javascript
// JavaScript ES6
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

---

## 七、二叉树

### 7.1 二叉树的最大深度 (#104)

```typescript
// TypeScript
class TreeNode {
  val: number;
  left: TreeNode | null;
  right: TreeNode | null;
  constructor(val?: number, left?: TreeNode | null, right?: TreeNode | null) {
    this.val = (val === undefined ? 0 : val);
    this.left = (left === undefined ? null : left);
    this.right = (right === undefined ? null : right);
  }
}

function maxDepth(root: TreeNode | null): number {
  if (!root) return 0;
  return 1 + Math.max(maxDepth(root.left), maxDepth(root.right));
}
```

```javascript
// JavaScript ES6
function maxDepth(root) {
  if (!root) return 0;
  return 1 + Math.max(maxDepth(root.left), maxDepth(root.right));
}
```

### 7.2 翻转二叉树 (#226)

```typescript
// TypeScript
function invertTree(root: TreeNode | null): TreeNode | null {
  if (!root) return null;
  [root.left, root.right] = [root.right, root.left];
  invertTree(root.left);
  invertTree(root.right);
  return root;
}
```

```javascript
// JavaScript ES6
function invertTree(root) {
  if (!root) return null;
  [root.left, root.right] = [root.right, root.left];
  invertTree(root.left);
  invertTree(root.right);
  return root;
}
```

### 7.3 对称二叉树 (#101)

```typescript
// TypeScript
function isSymmetric(root: TreeNode | null): boolean {
  const isMirror = (l: TreeNode | null, r: TreeNode | null): boolean => {
    if (!l && !r) return true;
    if (!l || !r) return false;
    return l.val === r.val && isMirror(l.left, r.right) && isMirror(l.right, r.left);
  };
  return isMirror(root, root);
}
```

```javascript
// JavaScript ES6
function isSymmetric(root) {
  const isMirror = (l, r) => {
    if (!l && !r) return true;
    if (!l || !r) return false;
    return l.val === r.val && isMirror(l.left, r.right) && isMirror(l.right, r.left);
  };
  return isMirror(root, root);
}
```

### 7.4 二叉树层序遍历 (#102)

```typescript
// TypeScript
function levelOrder(root: TreeNode | null): number[][] {
  if (!root) return [];
  const result: number[][] = [];
  const queue: TreeNode[] = [root];
  while (queue.length) {
    const level: number[] = [];
    const levelSize = queue.length;
    for (let i = 0; i < levelSize; i++) {
      const node = queue.shift()!;
      level.push(node.val);
      if (node.left) queue.push(node.left);
      if (node.right) queue.push(node.right);
    }
    result.push(level);
  }
  return result;
}
```

```javascript
// JavaScript ES6
function levelOrder(root) {
  if (!root) return [];
  const result = [];
  const queue = [root];
  while (queue.length) {
    const level = [];
    const levelSize = queue.length;
    for (let i = 0; i < levelSize; i++) {
      const node = queue.shift();
      level.push(node.val);
      if (node.left) queue.push(node.left);
      if (node.right) queue.push(node.right);
    }
    result.push(level);
  }
  return result;
}
```

---

## 八、回溯

### 8.1 全排列 (#46)

```typescript
// TypeScript
function permute(nums: number[]): number[][] {
  const result: number[][] = [];
  const used = new Set<number>();

  const backtrack = (path: number[]) => {
    if (path.length === nums.length) {
      result.push([...path]);
      return;
    }
    for (let i = 0; i < nums.length; i++) {
      if (used.has(i)) continue;
      used.add(i);
      path.push(nums[i]);
      backtrack(path);
      path.pop();
      used.delete(i);
    }
  };

  backtrack([]);
  return result;
}
```

```javascript
// JavaScript ES6
function permute(nums) {
  const result = [];
  const used = new Set();

  const backtrack = (path) => {
    if (path.length === nums.length) {
      result.push([...path]);
      return;
    }
    for (let i = 0; i < nums.length; i++) {
      if (used.has(i)) continue;
      used.add(i);
      path.push(nums[i]);
      backtrack(path);
      path.pop();
      used.delete(i);
    }
  };

  backtrack([]);
  return result;
}
```

### 8.2 子集 (#78)

```typescript
// TypeScript
function subsets(nums: number[]): number[][] {
  const result: number[][] = [];

  const backtrack = (start: number, path: number[]) => {
    result.push([...path]);
    for (let i = start; i < nums.length; i++) {
      path.push(nums[i]);
      backtrack(i + 1, path);
      path.pop();
    }
  };

  backtrack(0, []);
  return result;
}
```

```javascript
// JavaScript ES6
function subsets(nums) {
  const result = [];

  const backtrack = (start, path) => {
    result.push([...path]);
    for (let i = start; i < nums.length; i++) {
      path.push(nums[i]);
      backtrack(i + 1, path);
      path.pop();
    }
  };

  backtrack(0, []);
  return result;
}
```

---

## 九、动态规划

### 9.1 爬楼梯 (#70)

```typescript
// TypeScript
function climbStairs(n: number): number {
  if (n <= 2) return n;
  let prev1 = 2, prev2 = 1;
  for (let i = 3; i <= n; i++) {
    const cur = prev1 + prev2;
    prev2 = prev1;
    prev1 = cur;
  }
  return prev1;
}
```

```javascript
// JavaScript ES6
function climbStairs(n) {
  if (n <= 2) return n;
  let prev1 = 2, prev2 = 1;
  for (let i = 3; i <= n; i++) {
    const cur = prev1 + prev2;
    prev2 = prev1;
    prev1 = cur;
  }
  return prev1;
}
```

### 9.2 打家劫舍 (#198)

```typescript
// TypeScript
function rob(nums: number[]): number {
  if (!nums.length) return 0;
  if (nums.length === 1) return nums[0];
  let prev2 = nums[0], prev1 = Math.max(nums[0], nums[1]);
  for (let i = 2; i < nums.length; i++) {
    const cur = Math.max(prev1, prev2 + nums[i]);
    prev2 = prev1;
    prev1 = cur;
  }
  return prev1;
}
```

```javascript
// JavaScript ES6
function rob(nums) {
  if (!nums.length) return 0;
  if (nums.length === 1) return nums[0];
  let prev2 = nums[0], prev1 = Math.max(nums[0], nums[1]);
  for (let i = 2; i < nums.length; i++) {
    const cur = Math.max(prev1, prev2 + nums[i]);
    prev2 = prev1;
    prev1 = cur;
  }
  return prev1;
}
```

### 9.3 最长递增子序列 (#300)

```typescript
// TypeScript
function lengthOfLIS(nums: number[]): number {
  const dp = new Array(nums.length).fill(1);
  let maxLen = 1;
  for (let i = 1; i < nums.length; i++) {
    for (let j = 0; j < i; j++) {
      if (nums[j] < nums[i]) {
        dp[i] = Math.max(dp[i], dp[j] + 1);
      }
    }
    maxLen = Math.max(maxLen, dp[i]);
  }
  return maxLen;
}
```

```javascript
// JavaScript ES6
function lengthOfLIS(nums) {
  const dp = new Array(nums.length).fill(1);
  let maxLen = 1;
  for (let i = 1; i < nums.length; i++) {
    for (let j = 0; j < i; j++) {
      if (nums[j] < nums[i]) {
        dp[i] = Math.max(dp[i], dp[j] + 1);
      }
    }
    maxLen = Math.max(maxLen, dp[i]);
  }
  return maxLen;
}
```

### 9.4 编辑距离 (#72)

```typescript
// TypeScript
function minDistance(word1: string, word2: string): number {
  const m = word1.length, n = word2.length;
  const dp = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));
  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (word1[i - 1] === word2[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1];
      } else {
        dp[i][j] = 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
      }
    }
  }
  return dp[m][n];
}
```

```javascript
// JavaScript ES6
function minDistance(word1, word2) {
  const m = word1.length, n = word2.length;
  const dp = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));
  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (word1[i - 1] === word2[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1];
      } else {
        dp[i][j] = 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
      }
    }
  }
  return dp[m][n];
}
```

---

## 十、二分查找

### 10.1 搜索旋转排序数组 (#33)

```typescript
// TypeScript
function search(nums: number[], target: number): number {
  let left = 0, right = nums.length - 1;
  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    if (nums[mid] === target) return mid;
    if (nums[left] <= nums[mid]) {
      if (target >= nums[left] && target < nums[mid]) {
        right = mid - 1;
      } else {
        left = mid + 1;
      }
    } else {
      if (target > nums[mid] && target <= nums[right]) {
        left = mid + 1;
      } else {
        right = mid - 1;
      }
    }
  }
  return -1;
}
```

```javascript
// JavaScript ES6
function search(nums, target) {
  let left = 0, right = nums.length - 1;
  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    if (nums[mid] === target) return mid;
    if (nums[left] <= nums[mid]) {
      if (target >= nums[left] && target < nums[mid]) {
        right = mid - 1;
      } else {
        left = mid + 1;
      }
    } else {
      if (target > nums[mid] && target <= nums[right]) {
        left = mid + 1;
      } else {
        right = mid - 1;
      }
    }
  }
  return -1;
}
```

---

## 十一、栈

### 11.1 有效括号 (#20)

```typescript
// TypeScript
function isValid(s: string): boolean {
  const stack: string[] = [];
  const map = new Map([[')', '('], [']', '['], ['}', '{']]);
  for (const c of s) {
    if (map.has(c)) {
      if (stack.pop() !== map.get(c)) return false;
    } else {
      stack.push(c);
    }
  }
  return !stack.length;
}
```

```javascript
// JavaScript ES6
function isValid(s) {
  const stack = [];
  const map = new Map([[')', '('], [']', '['], ['}', '{']]);
  for (const c of s) {
    if (map.has(c)) {
      if (stack.pop() !== map.get(c)) return false;
    } else {
      stack.push(c);
    }
  }
  return !stack.length;
}
```

---

## 十二、堆

### 12.1 数据流中位数 (#295)

```typescript
// TypeScript
class MedianFinder {
  private small: Heap; // max heap
  private large: Heap; // min heap

  constructor() {
    this.small = new Heap((a: number, b: number) => a > b);
    this.large = new Heap((a: number, b: number) => a < b);
  }

  addNum(num: number): void {
    this.small.add(num);
    this.large.add(this.small.pop()!);
    if (this.small.size() < this.large.size()) {
      this.small.add(this.large.pop()!);
    }
  }

  findMedian(): number {
    if (this.small.size() > this.large.size()) {
      return this.small.peek()!;
    }
    return (this.small.peek()! + this.large.peek()!) / 2;
  }
}

class Heap {
  private data: number[] = [];
  constructor(private compare: (a: number, b: number) => boolean) {}
  add(val: number): void {
    this.data.push(val);
    this.bubbleUp(this.data.length - 1);
  }
  pop(): number | undefined {
    if (!this.data.length) return undefined;
    const top = this.data[0];
    const bottom = this.data.pop()!;
    if (this.data.length) {
      this.data[0] = bottom;
      this.bubbleDown(0);
    }
    return top;
  }
  peek(): number | undefined { return this.data[0]; }
  size(): number { return this.data.length; }
  private bubbleUp(i: number): void {
    while (i > 0) {
      const p = Math.floor((i - 1) / 2);
      if (!this.compare(this.data[i], this.data[p])) break;
      [this.data[i], this.data[p]] = [this.data[p], this.data[i]];
      i = p;
    }
  }
  private bubbleDown(i: number): void {
    while (true) {
      let smallest = i;
      const l = 2 * i + 1, r = 2 * i + 2;
      if (l < this.data.length && this.compare(this.data[l], this.data[smallest])) smallest = l;
      if (r < this.data.length && this.compare(this.data[r], this.data[smallest])) smallest = r;
      if (smallest === i) break;
      [this.data[i], this.data[smallest]] = [this.data[smallest], this.data[i]];
      i = smallest;
    }
  }
}
```

```javascript
// JavaScript ES6
class MedianFinder {
  constructor() {
    this.small = new MaxHeap();
    this.large = new MinHeap();
  }

  addNum(num) {
    this.small.add(num);
    this.large.add(this.small.pop());
    if (this.small.size() < this.large.size()) {
      this.small.add(this.large.pop());
    }
  }

  findMedian() {
    if (this.small.size() > this.large.size()) {
      return this.small.peek();
    }
    return (this.small.peek() + this.large.peek()) / 2;
  }
}

class MaxHeap {
  constructor() { this.data = []; }
  add(val) { this.data.push(val); this.bubbleUp(this.data.length - 1); }
  pop() { if (!this.data.length) return; const top = this.data[0]; const bottom = this.data.pop(); if (this.data.length) { this.data[0] = bottom; this.bubbleDown(0); } return top; }
  peek() { return this.data[0]; }
  size() { return this.data.length; }
  bubbleUp(i) { while (i > 0) { const p = Math.floor((i - 1) / 2); if (this.data[i] > this.data[p]) { [this.data[i], this.data[p]] = [this.data[p], this.data[i]]; i = p; } else break; } }
  bubbleDown(i) { while (true) { let smallest = i; const l = 2 * i + 1, r = 2 * i + 2; if (l < this.data.length && this.data[l] > this.data[smallest]) smallest = l; if (r < this.data.length && this.data[r] > this.data[smallest]) smallest = r; if (smallest === i) break; [this.data[i], this.data[smallest]] = [this.data[smallest], this.data[i]]; i = smallest; } }
}

class MinHeap {
  constructor() { this.data = []; }
  add(val) { this.data.push(val); this.bubbleUp(this.data.length - 1); }
  pop() { if (!this.data.length) return; const top = this.data[0]; const bottom = this.data.pop(); if (this.data.length) { this.data[0] = bottom; this.bubbleDown(0); } return top; }
  peek() { return this.data[0]; }
  size() { return this.data.length; }
  bubbleUp(i) { while (i > 0) { const p = Math.floor((i - 1) / 2); if (this.data[i] < this.data[p]) { [this.data[i], this.data[p]] = [this.data[p], this.data[i]]; i = p; } else break; } }
  bubbleDown(i) { while (true) { let smallest = i; const l = 2 * i + 1, r = 2 * i + 2; if (l < this.data.length && this.data[l] < this.data[smallest]) smallest = l; if (r < this.data.length && this.data[r] < this.data[smallest]) smallest = r; if (smallest === i) break; [this.data[i], this.data[smallest]] = [this.data[smallest], this.data[i]]; i = smallest; } }
}
```

---

## 十三、位运算

### 13.1 只出现一次的数字 (#136)

```typescript
// TypeScript
function singleNumber(nums: number[]): number {
  let result = 0;
  for (const num of nums) {
    result ^= num;
  }
  return result;
}
```

```javascript
// JavaScript ES6
function singleNumber(nums) {
  let result = 0;
  for (const num of nums) {
    result ^= num;
  }
  return result;
}
```

### 13.2 多数元素 (#169)

```typescript
// TypeScript
function majorityElement(nums: number[]): number {
  let candidate = 0, count = 0;
  for (const num of nums) {
    if (count === 0) candidate = num;
    count += num === candidate ? 1 : -1;
  }
  return candidate;
}
```

```javascript
// JavaScript ES6
function majorityElement(nums) {
  let candidate = 0, count = 0;
  for (const num of nums) {
    if (count === 0) candidate = num;
    count += num === candidate ? 1 : -1;
  }
  return candidate;
}
```

---

## 十四、Trie

### 14.1 实现 Trie (#208)

```typescript
// TypeScript
class Trie {
  private children: Map<string, Trie>;
  private isEnd: boolean;

  constructor() {
    this.children = new Map();
    this.isEnd = false;
  }

  insert(word: string): void {
    let node = this;
    for (const c of word) {
      if (!node.children.has(c)) {
        node.children.set(c, new Trie());
      }
      node = node.children.get(c)!;
    }
    node.isEnd = true;
  }

  search(word: string): boolean {
    const node = this.searchPrefix(word);
    return node !== null && node.isEnd;
  }

  startsWith(prefix: string): boolean {
    return this.searchPrefix(prefix) !== null;
  }

  private searchPrefix(prefix: string): Trie | null {
    let node = this;
    for (const c of prefix) {
      if (!node.children.has(c)) return null;
      node = node.children.get(c)!;
    }
    return node;
  }
}
```

```javascript
// JavaScript ES6
class Trie {
  constructor() {
    this.children = new Map();
    this.isEnd = false;
  }

  insert(word) {
    let node = this;
    for (const c of word) {
      if (!node.children.has(c)) {
        node.children.set(c, new Trie());
      }
      node = node.children.get(c);
    }
    node.isEnd = true;
  }

  search(word) {
    const node = this.searchPrefix(word);
    return node !== null && node.isEnd;
  }

  startsWith(prefix) {
    return this.searchPrefix(prefix) !== null;
  }

  searchPrefix(prefix) {
    let node = this;
    for (const c of prefix) {
      if (!node.children.has(c)) return null;
      node = node.children.get(c);
    }
    return node;
  }
}
```

---

> 作者: Shyu
> 最后更新: 2026-03-04
