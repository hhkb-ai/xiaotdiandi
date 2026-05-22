---
title: Python语法与符号速查
date: 2026-05-10
tags:
  - python
  - 速查
---

# Python语法与符号速查

## 常见符号

| 符号 | 名称 | 示例 | 说明 |
|---|---|---|---|
| `=` | 赋值 | `x = 10` | 把右边的值绑定到左边变量 |
| `==` | 相等比较 | `x == 10` | 判断两个值是否相等 |
| `!=` | 不等于 | `x != 10` | 判断两个值是否不同 |
| `:` | 代码块起始 | `if x > 0:` | 用在 `if`、`for`、`def`、`class` 后 |
| `()` | 调用或分组 | `print(x)` | 调用函数，或改变运算优先级 |
| `[]` | 列表或索引 | `items[0]` | 创建列表、按位置取值 |
| `{}` | 字典或集合 | `{"name": "A"}` | 创建字典；无键值对时可创建集合 |
| `.` | 属性或方法访问 | `name.upper()` | 调用对象的方法或访问属性 |
| `,` | 分隔 | `a, b = 1, 2` | 分隔参数、元素或解包变量 |
| `#` | 注释 | `# todo` | 行内注释，不会被 Python 执行 |
| `\n` | 换行符 | `"a\nb"` | 字符串里的换行 |
| `_` | 临时变量 | `for _ in range(3)` | 表示这个变量不重要 |
| `|` | 集合并集 | `a | b` | 合并两个集合，也可用于类型联合 |

## 核心语法模板

### 条件判断

```python
score = 85

if score >= 90:
    print("优秀")
elif score >= 60:
    print("及格")
else:
    print("不及格")
```

### 循环

```python
courses = ["Python", "网络", "数据库"]

for course in courses:
    print(course)
```

### 函数

```python
def add(a, b):
    return a + b

result = add(3, 5)
print(result)
```

### 字典

```python
student = {
    "name": "小明",
    "age": 18,
}

print(student["name"])
```

### 文件

```python
with open("note.txt", "w", encoding="utf-8") as file:
    file.write("今天学习了 Python\n")
```

> [!warning] 易错点
> `=` 是赋值，`==` 才是判断相等。`if x = 1:` 是错误写法，应该写 `if x == 1:`。
