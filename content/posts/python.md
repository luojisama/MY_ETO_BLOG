---
title: Python 零基础教程  长期更新
date: 2025-05-28
description: Python的零基础教程
image: ""
tags: ["基础教程","Python","编程"]
category: 基础教程

---

>我也正在学习python，一边学习一边编写本篇教程，希望对你能有一点帮助。    
>本文参考<a href="https://liaoxuefeng.com/books/python/introduction/index.html" target="_blank">Python教程 - 廖雪峰的官方网站</a>结合自己所学整理结合。

# 什么是Python

Python的创始人是吉多·范·罗森。   
Python是一种解释型、面向对象、动态数据类型的高级程序设计语言。  
Python的设计具有很强的可读性，相比其他语言经常使用英文关键字，它具有比其他语言更有特色语法结构。  


# 安装Python

因为Python是跨平台的，它可以运行在Windows、Mac和各种Linux/Unix系统上。在Windows上写Python程序，放到Linux上也是能够运行的。

要开始学习Python编程，首先就得把Python安装到你的电脑里。安装后，你会得到Python解释器（就是负责运行Python程序的），一个命令行交互环境，还有一个简单的集成开发环境。 

Python下载地址：([Download Python | Python.org](https://www.python.org/downloads/))  
安转时要注意勾选`Add Python 3.x to PATH`

# 文本编辑器

## VS Code
VS Code是**轻量级、高度可扩展的代码编辑器**。通过丰富的插件市场可以扩展成功能强大的IDE，支持几乎所有主流语言和框架。核心是通用性、灵活性和速度。  
下载地址：[Visual Studio Code - Code Editing. Redefined](https://code.visualstudio.com/)   


## PyCharm
PyCharm是一个专注于 **Python开发** 的**全功能IDE**。深度集成Python生态系统，开箱即用，提供大量智能功能和专业工具。   
下载地址：[Download PyCharm: The Python IDE for data science and web development by JetBrains](https://www.jetbrains.com/pycharm/download/?section=windows)

# 输入与输出
做好上述准备，你就可以开始编写你的第一个程序了。  
## 输出
用`print()`在括号中加上字符串，就可以向屏幕上输出指定的文字。比如输出`'hello, world'`，用代码实现如下：  
```python
print("Hello, World!")
# Hello, World! #输出
```

`print()`函数也可以接受多个字符串，用逗号“,”隔开，就可以连成一串输出，每一个","在输出中以空格表示：
```python
print("Hello, World!","你好，世界！")
# Hello, World! 你好，世界！#输出
```
`print()`函数也可以打印数字与计算结果：
```python
print(100)
# 100  #输出
print(100+200)
# 300  #输出
```

## 输入
现在你已经可以用`print()`你想要的内容了，如果想输出自己输入的内容，Python提供了一个`input()`,可以将用户输入的内容存放在一个变量中，比如输入生日：
```python
birthday = input("你的生日是？")
print("你的生日是：", birthday)
```
当你运行时，Python就在等待你的输入了。这时，你可以输入任意字符，然后按回车后完成输入。  
输入完成后Python不会有任何提示，如果想看你输入的内容，可以使用刚才的`print()`来输出：
```python
birthday = input("你的生日是？")
# birthday = "20010102"  在线运行模拟输入
# 你的输入，这里假设为20010102  
print(birthday)
# 20010102  #你的输出
```
实际运行应该是如下图：  
![](https://cdn.jsdelivr.net/gh/luojisama/pic_bed@main/img/202505291053558.png)

### 注释
在Python中，单行注释用`#`，多行注释使用`"""`，`'''`,使用方法如下：  
```python
# print("Hello, World!")

'''
print(100)
print(100+200)
'''

"""
birthday = input("你的生日是？")
print(birthday)
"""
```

# 变量与数据类型

## 保留字
在Python中，有一些被赋予特殊意义的单词，这些单词就是保留字，编辑器会将保留字高亮标识。  

## 变量
在Python中，变量不仅可以为整数或浮点数，还可以是任意数据类型。  
变量有一个命名规则，可以由`字母`，`下划线`，`数字`组成，首位不能是数字，区分大小写，不能包含空格，不能使用保留字。
错误的变量名：  
`123a`  `bili bili`  `if`

## 数据类型
### 整型 int
Python可以处理任意大小的整数，包括负整数，在程序中的表示方法与在数学上的写法一样：  
`1`  `100`  `-100`   
对于很大的数，例如`10000000000`，很难数清楚0的个数。Python允许在数字中间以`_`分隔，所以在Python中`10_000_000_000`与`10000000000`是完全一样的

### 浮点型 float
浮点数也就是小数，之所以称为浮点数，是因为按照科学记数法表示时，一个浮点数的小数点位置是可变的，比如 $1.23 \times 10^9$ 和 $12.3 \times 10^8$ 是完全相等的.浮点数可以用数学写法，如`1.23`，`3.14`，`-9.01`，等等。但是对于很大或很小的浮点数，就必须用科学计数法表示，把10用e替代，$1.23 \times 10^9$ 就是`1.23e9`   

### 字符串 str
字符串是由单引号`'`或双引号`"`包裹起来的任意文本，包括空格。   
如果字符串内部既包含`'`又包含`"`时可以用转义字符`\`来标识，比如：  
```python
print('I\'m \"OK\"!')
```
这串字符串的内容是 `I'm "OK"!`   

### 布尔值
布尔值和布尔代数的表示完全一致，一个布尔值只有`True`、`False`两种值，要么是`True`，要么是`False`，在Python中，可以直接用`True`、`False`表示布尔值（请注意大小写） 

### 空值

空值是Python里一个特殊的值，用`None`表示。`None`是一个特殊的空值。

此外Python还提供了`组合` `集合`  `元组` `列表` `字典` 等多种数据类型。

### 获取数据类型与转换
在Python中，可以使用`type()`函数来获取变量的数据类型。如果变量`a`的数据类型为`字符串`，想把它转换为整型时，操作如下：
```python
a = "123"
print(int(a))
```
其他数据类型转换以此类推。

# 运算符
在Python中，有`数学运算符`，`关系运算符`,`逻辑运算符`,`赋值运算符`

## 数学运算符
`+`  加法运算  
`-`  减法运算  
`*`  乘法运算  
`/`  除法运算   
`//` 整除  
`%`  取余数  
`**` 幂运算
>哪怕是两个整型做除法运算时，得到的结果也会是浮点型  

## 关系运算符
```text
 '==' 等于  
 '!=' 不等于  
 '>' 大于 / '>=' 大于等于  
 '<' 小于 / '<=' 小于等于
```

## 逻辑运算符
 
 **逻辑与**`and`   
	**规则**：左右条件**同时为真**时返回 `True`，否则返回 `False`。

 **逻辑或**`or`   
	**规则**：左右条件**任意一个为真**时返回 `True`，否则返回 `False`。

 **逻辑非** `not`   
	**规则**：对条件取反，`True` 变 `False`，`False` 变 `True`。

## 优先级
一般来说算数>比较>逻辑>赋值，可以通过添加小括号`()`的方式来调整运算符优先级。

# 选择结构
Python 的选择结构通过 **条件判断** 控制程序的分支执行，主要包括以下三种形式：  
## `if`语句
**单分支选择**：当条件为 `True` 时执行代码块。例：  
```python
age = 18
if age >= 18:
    print("已成年")  # 条件成立时执行
```
## `if-else`语句
**双分支选择**：根据条件二选一执行。例：  
```python
score = 75
if score >= 60:
    print("及格")
else:
    print("不及格")  # 条件不成立时执行
```
## `if-elif-else`语句
**多分支选择**：依次判断多个条件，执行第一个满足的分支。例：   
```python
grade = 85
if grade >= 90:
    print("优秀")
elif grade >= 80:  # 前一个条件不满足时检查
    print("良好")  # 输出: 良好
else:
    print("待提高")
```
## 嵌套
基本语法如下：
```text
if 条件表达式1:
	if 条件2表达式:
		执行代码1
	else:
		执行代码2
else:
	执行代码3
```

- **缩进规则**：Python 通过缩进（通常 4 个空格）定义代码块，缩进错误会导致语法错误。
- **条件表达式**：支持 `and`、`or`、`not` 组合复杂逻辑。
多分支时`else`可省略不写。   
选择结构是 Python 流程控制的基础，广泛用于数据过滤、用户交互等场景。

## match语句
提供结构化的**模式匹配**（Structural Pattern Matching），类似于其他语言的 `switch`，但功能更强大。
基本语法如下：
```text
match 表达式:
    case 模式1:
        # 处理逻辑
    case 模式2 if 条件:
        # 带条件的匹配
    case _:
        # 通配符，匹配所有其他情况
```
例：
```python
def animal_sound(animal: str) -> str:
    match animal:
        case "dog":
            return "汪汪 🐶"
        case "cat":
            return "喵喵 🐱"
        case "bird":
            return "啾啾 🐦"
        case _:
            return "未知动物叫声"

# 测试
for a in ["dog", "cat", "bird", "tiger"]:
    print(f"{a} -> {animal_sound(a)}")
```
输出如下：
```text
dog -> 汪汪 🐶
cat -> 喵喵 🐱
bird -> 啾啾 🐦
tiger -> 未知动物叫声
```

# 循环
在Python中有两种循环方式，分别是`while`与`for`

## `while`循环
**特点**：  
**基于条件**：只要条件为 `True`，就重复执行代码块。   
**适用场景**：不确定循环次数时（如用户输入、游戏循环）。
语法如下：
```text
while 条件:
    循环体
```
例：
```python
count = 0
while count < 3:
    print(f"Count: {count}")
    count += 1
```
输出：
```text
Count: 0
Count: 1
Count: 2
```
若条件永远为 `True`，会导致**无限循环**（需用 `break` 或修改条件终止）。   
可用 `else` 分支（循环正常结束时执行，被 `break` 打断则不执行）。
## `for`循环
**特点**：   
**遍历序列**：对可迭代对象（如列表、字符串、字典等）逐个处理。   
**适用场景**：已知循环次数或需遍历数据集合时。
语法如下：
```text
for 变量 in 可迭代对象:
    循环体
```
例：
```python
fruits = ["apple", "banana", "cherry"]
for fruit in fruits:
    print(fruit)
```
输出：
```text
apple
banana
cherry
```
可用 `range()`：生成数字序列控制循环次数。
循环中可使用`break`跳出循环，`continue`跳过此次循环。

## 循环嵌套
和if一样，两种循环也可以嵌套。
### for循环嵌套
语法：
```text
for 外层变量 in 外层序列:
    for 内层变量 in 内层序列:
        循环体
```
例：
```python
for i in range(1, 10):      # 外层循环：控制行数
    for j in range(1, i+1): # 内层循环：控制每行的列数
        print(f"{j}×{i}={i*j}", end="\t")
    print()  # 换行
```
输出：
```text
1×1=1	
1×2=2	2×2=4	
1×3=3	2×3=6	3×3=9	
...
1×9=9	2×9=18	...	9×9=81
```

### while循环嵌套
语法：
```text
while 外层条件:
    while 内层条件:
        循环体
```
例：
```python
i = 1
while i < 10: 
    j = 1
    while j <= i:
        print(f"{j}×{i}={i*j}", end="\t")
        j += 1
    print()
    i += 1
```

用while循环嵌套改写，输出与上述for循环嵌套一致。  
`for`循环与`while`循环也可互相嵌套，注意循环条件，不要写成死循环。

# 字符串
Python中字符串也有许多操作，像是取出单个字符，获取长度等。  
## 保留格式输出
在开始`print()`中，输出多个通常是在同一行，如果像保留格式输出可以使用三个单引号`'''`或双引号`"""`括起来，如下所示：
```python
print("""a
b""")
```
输出为：
```text
a
b
```
## 下标
在 Python 中，字符串是 **不可变的有序字符序列**，可以通过 **下标（索引）** 访问单个字符。下标从 `0` 开始，从左到右依次递增；同时也支持 **负数下标**，从右向左访问（`-1` 表示最后一个字符）。
语法：
```text
字符串[下标]
```
例：
```python
str1 = "Python零基础教程"
print(str1[5])
```
输出：
```text
n
```
## 获取字符串长度
在 Python 中，可以使用 **`len()`** 函数获取字符串的长度（字符数量）。  
例：
```python
s = "Hello, 世界"
print(len(s)) 
```
输出：
```text
9
```
**特殊字符**：如换行符 `\n`、制表符 `\t` 等均计为 1 个字符。

## 字符串运算符与函数
Python 提供了多种字符串运算符，用于拼接、重复、比较和成员检查等操作。以下是常用的字符串运算符及其用法：

### 字符串拼接  `+`
连接两个字符串，链接别的对象需先转换。
例：
```python
s1 = "Hello"
s2 = "World"
print(s1 + s2)
```
输出：
```text
HelloWorld
```

###  重复运算符 `*`
重复字符串指定次数。  
例：
```python
s = "Hi"
print(s * 3)
```
输出：
```text
HiHiHi
```

### 成员运算符 `in` / `not in`
检查子串是否存在于字符串中，为布尔值。
例：
```python
text = "Python is fun"
print("fun" in text)
print("Java" not in text)
```
输出：
```text
True
True
```

### **比较运算符 `==`, `!=`, `>`, `<` 等**
**功能**：按字典序（ASCII/Unicode 值）比较字符串。  
**规则**：逐字符比较，直到分出大小。  
例：
```python
print("apple" == "apple")
print("apple" < "banana")
print("Zoo" > "apple")
```
输出：
```text
True
True  #（'a' < 'b'）
False #（'Z' < 'a'）
```

### 原始字符串 `r` / `R`
忽略转义字符（如 `\n`、`\t`）。  
例：
```python
path = r"C:\new\folder"
print(path)
```
输出：
```text
C:\new\folder   #（\n 不换行）
```

### 字符串检索函数
#### `find()`函数
返回子串 **第一次出现**的索引，未找到返回 `-1`。  
**参数**：  
`start`：搜索起始位置（可选）。    
`end`：搜索结束位置（可选）。
例：
```python
s = "hello world"
print(s.find("world"))
print(s.find("Python"))
```
输出：
```text
6
-1
```
`rfind()`函数   
与`find()`函数类似，不过是从右边开始

#### `index()`函数
与 `find()` 类似，但未找到时会抛出 `ValueError`。
**参数**：  
`start`：搜索起始位置（可选）。    
`end`：搜索结束位置（可选）。
例：
```python
s = "hello world"
print(s.index("world"))
# print(s.index("Python")) # 会报错 ValueError
```
输出：
```text
6
ValueError
```
`rindex()`函数   
与`index()`函数类似，不过是从右边开始

#### `count()`函数
用于统计字符串中子串出现的次数
**参数**：  
`start`：搜索起始位置（可选）。    
`end`：搜索结束位置（可选）。
例：
```python
s = "banana"
print(s.count("a"))
print(s.count("na"))
```
输出：
```text
3
2
```

### 字符串替换函数

#### `replace()`函数
将字符串中的 `old` 子串替换为 `new`。     
语法：
```text
字符串.replace(old,new,count)
```
**参数**：
`old`：需要替换的子串。    
`new`：替换后的新子串。    
`count`（可选）：最多替换次数（默认全部替换）。
例：
```python
text = "I like apples, apples are tasty"
new_text = text.replace("apples", "oranges")
print(new_text) 

print(text.replace("apples", "oranges", 1))
```
输出：

```text
I like oranges, oranges are tasty
I like oranges, apples are tasty 
```

只替换第一个

### 字符串拆分函数
#### `split()`函数
将字符串按指定分隔符 `sep` 拆分成列表，默认按**空白字符**（空格、换行、制表符等）拆分。  
语法：
```text
字符串.split(sep, maxsplit=)
```
**参数：**
`sep`：分隔符（默认 `None`，表示按空白字符拆分）。   
`maxsplit`：最大拆分次数（默认 `-1`，表示不限次数）。
例：
```python
s = "Python Java C++ JavaScript"

print(s.split())

s2 = "apple,banana,orange"
print(s2.split(","))

print(s2.split(",", maxsplit=1))
```
输出：
```text
输出: ['Python', 'Java', 'C++', 'JavaScript']
输出: ['apple', 'banana', 'orange']
输出: ['apple', 'banana,orange']

```
### 字符串组合函数
#### `join()`函数
用指定字符串作为分隔符，将可迭代对象（如列表、元组）中的元素连接成一个字符串。
例：
```python
words = ["Python", "Java", "C++"]
result = ", ".join(words)
print(result)
```
  输出：
```text
Python, Java, C++
```

### 字符串转化函数
#### **1. `str.capitalize()`**
将字符串的**第一个字母大写**，其余字母转为小写。
例：
```python
s = "hello WORLD"
print(s.capitalize())  # 输出: "Hello world"
```

#### **2. `str.title()`**
将字符串中**每个单词的首字母大写**，其余字母转为小写。
例：
```python
s = "python is AWESOME"
print(s.title())  # 输出: "Python Is Awesome"
```

#### **3. `str.upper()`**
将字符串中**所有字母转为大写**。
例：
```python
s = "Hello Python"
print(s.upper())  # 输出: "HELLO PYTHON"
```

#### **4. `str.lower()`**
将字符串中**所有字母转为小写**。
例：
```python
s = "HELLO World"
print(s.lower())  # 输出: "hello world"
```

#### **5. `str.swapcase()`**
**反转字符串中字母的大小写**（大写转小写，小写转大写）。
例：
```python
s = "Hello PyThOn"
print(s.swapcase())  # 输出: "hELLO pYtHoN"
```

### 字符串判断函数
#### **1. `str.isdigit()`**

检测字符串是否**只包含数字**（0-9）。  
例：
```python
print("123".isdigit())    # True
print("12a3".isdigit())   # False
print("①".isdigit())      # True（Unicode数字）
```

#### **2. `str.isalpha()`**

检测字符串是否**只包含字母或文字**（包括中文、日文等Unicode字母）。  
例：
```python
print("Python".isalpha())  # True
print("你好".isalpha())     # True
print("a1".isalpha())      # False
```

#### **3. `str.isspace()`**

检测字符串是否**只包含空白字符**（空格、`\t`、`\n`等）。  
例：
```python
print("  ".isspace())     # True
print("\t\n".isspace())   # True
print(" a ".isspace())    # False
```

#### **4. `str.startswith(prefix)`**

检查字符串是否以**指定子串开头**，返回 `True`/`False`。  
例：
```python
s = "Hello World"
print(s.startswith("Hello"))  # True
print(s.startswith("World"))  # False
```

#### **5. `str.endswith(suffix)`**

检查字符串是否以**指定子串结尾**，返回 `True`/`False`。  
例：
```python
s = "example.txt"
print(s.endswith(".txt"))    # True
print(s.endswith(".jpg"))    # False
```

#### **6. `str.isalnum()`**

检测字符串是否**只包含字母或数字**（中英文均可，无符号和空格）。  
例：
```python
print("Python3".isalnum())   # True
print("你好123".isalnum())    # True
print("a@1".isalnum())       # False
```

### 字符串截取函数
#### `lstrip()`函数
移除字符串**左侧**指定的字符（默认移除空白符）。  
**参数**：
`chars`（可选）：指定要移除的字符集合，默认为空白符（空格、`\t`、`\n`等）。  
例：
```python
s = "   Hello World   "
print(s.lstrip())          # 输出: "Hello World   "（移除左侧空格）

s2 = "===Title==="
print(s2.lstrip("="))      # 输出: "Title==="（移除左侧等号）
```

#### `rstrip()`函数
移除字符串**右侧**指定的字符（默认移除空白符）。  
**参数**：
`chars`（可选）：指定要移除的字符集合，默认为空白符（空格、`\t`、`\n`等）。  
例：
```python
s = "   Hello World   "
print(s.rstrip())          # 输出: "   Hello World"（移除右侧空格）

s2 = "===Title==="
print(s2.rstrip("="))      # 输出: "===Title"（移除右侧等号）
```

#### `strip()`函数
移除字符串**两侧**指定的字符（默认移除空白符）。  
**参数**：
`chars`（可选）：指定要移除的字符集合，默认为空白符（空格、`\t`、`\n`等）。  
例：
```python
s = "   Hello World   "
print(s.strip())          # 输出: "Hello World"（移除右侧空格）

s2 = "===Title==="
print(s2.strip("="))      # 输出: "Title"（移除右侧等号）
```

### 字符串format格式化

####  数字格式化
```python
pi=3.1415926
print("保留两位小数: {:.2f}".format(pi))
print("科学计数法: {:.2e}".format(1000))
print("二进制: {:b}".format(5))
print("十六进制: {:x}".format(255))
print("百分比: {:.2%}".format(0.25))
print("千位分隔符: {:,}".format(1000000))
```
输出如下：
![](https://cdn.jsdelivr.net/gh/luojisama/pic_bed@main/img/202505291928875.png)
#### 格式与对齐
```python
print("左对齐: {:<10}".format("left"))
# 同 print(f"{'left':<10}")
print("右对齐: {:>10}".format("right"))
# 同 print(f"{'right':>10}")
print("居中对齐: {:^10}".format("center"))
print("填充符号: {:*^10}".format("center"))
# 居中填充会优先填充右侧
```
输出如下：
![](https://cdn.jsdelivr.net/gh/luojisama/pic_bed@main/img/202505291929121.png)

# 列表，元组，字典与集合
## 列表 list
```python
a = [1,2,3,'a','b','c']
```
Python内置的一种数据类型是列表：list。list是一种有序的集合，可以随时添加和删除其中的元素。  
### 索引
用索引来访问list中每一个位置的元素，当索引超出了范围时，Python会报一个`IndexError`错误，要确保索引不要越界，记得最后一个元素的索引是`-1`。  
如果要取最后一个元素，除了计算索引位置外，还可以用`-1`做索引，直接获取最后一个元素。   

### 增删改查
#### 添加
```python
a=[1,2,3,4,5]
b=[6,7,8,9]
a.append(6) #在末尾添加
print(a)
a.insert(1,1.5) #在指定位置添加
print(a)
a.extend(b) #合并两个列表
print(a)
```
输出如下
```text
[1, 2, 3, 4, 5, 6]
[1, 1.5, 2, 3, 4, 5, 6]
[1, 1.5, 2, 3, 4, 5, 6, 6, 7, 8, 9]
```
#### 删除
```python
a=[1,2,3,4,5]
del a[3] #删除对应下标 (4)
print(a)
print(a.pop(1)) #在末尾删除并返回该元素，传入下标时删除并返回对应下标的值 (2)
print(a)
a.remove(3) #找到并删除这个元素 (3)
print(a)
```
输出如下
```text
[1, 2, 3, 5]
2
[1, 3, 5]
[1, 5]
```
#### 修改
```python
a=[1,2,3,4,5]
a[1]=3
print(a)
```
输出如下
```text
[1, 3, 3, 4, 5]
```

#### 查找
```python
a=[1,2,3,4,5,5]
print(1 in a)
print(6 in a)
print(1 not in a)
print(6 not in a)
print(a.index(1))
print(a.count(5))
```
输出如下
```text
True
False
False
True
0
2
```
### 一些常用函数<a id="sorted"></a>
```python
a=["1","2","3"]
b=["1","2","3","4","5","8","6","7"]
```

| 函数/操作                    | 描述               |
| ------------------------ | ---------------- |
| `max(b)`               | 返回列表最大值          |
| `min(b)`               | 返回列表最小值          |
| `b.reverse()`             | 将列表内容顺序调转（修改原列表）        |
| `sorted(b,reverse=True)` | 将列表按照大小降序（返回新列表）        |
| `b.sort()`                 | 将列表按照大小升序（修改原列表） |
| `sorted(b)`              | 将列表按照大小升序（创建新列表） |
| `len(b)`                 | 统计列表元素个数         |
#### 列表组合
```python
a=["1","2","3"]
b=["a","b","c"]
print(a+b)
print(a*2)
```
输出
```text
['1', '2', '3', 'a', 'b', 'c']
['1', '2', '3', '1', '2', '3']
```
### 嵌套列表
用索引访问嵌套列表的时候，需要逐级访问
```python
a=[[1,2,3],[4,5,6],[7,8,9]]
print(a[1][2])
```
输出
```text
6
```
## 元组 tuple
```python
a = (1,2,3,'a','b','c')
print(a)
```
与列表类似，不同的是元组使用`()`标识，元组是一种**不可变**（immutable）的有序序列，可以包含任意类型的元素。一旦创建，其内容只能通过重新赋值来修改。

如果只有单个元素，需要在后面添加一个`,`以此标识为元组
```python
a=("a",)
print(type(a))   #<class 'tuple'>
```
### 元组拆包
基本拆包方式：
```python
# 定义一个元组
person = ("Alice", 25, "New York")

# 拆包到变量
name, age, city = person

print(name)  # 输出: Alice
print(age)   # 输出: 25
print(city)  # 输出: New York
```
使用`*`收集多余元素
```python
numbers = (1, 2, 3, 4, 5)

# 获取第一个和最后一个元素，中间的所有元素
first, *middle, last = numbers

print(first)   # 输出: 1
print(middle)  # 输出: [2, 3, 4]  # 注意：收集为列表
print(last)    # 输出: 5
```
使用`_`忽略元素
```python
# 使用下划线(_)表示忽略的元素
name, _, city = ("Bob", 30, "Paris")

print(name)  # 输出: Bob
print(city)  # 输出: Paris
```

**常用函数与列表相同**

## 字典 dict
```python
a = {'Michael': 95, 'Bob': 75, 'Tracy': 85}
```
Python内置了字典：dict的支持，dict全称dictionary，在其他语言中也称为map，使用键-值（key-value）存储，具有极快的查找速度。  
### 访问
首先创建一个字典
```python
student = {
    "name": "张三",
    "age": 20,
    "major": "计算机科学",
    "gpa": 3.8
}
print(student)
```
要访问键对应的值有三种方法：   
第一种使用`[]`，字典中没有对应的键会提示`KeyError`
```python
student = {
    "name": "张三",
    "age": 20,
    "major": "计算机科学",
    "gpa": 3.8
}
name = student["name"]
print(f"学生姓名: {name}")  # 输出: 学生姓名: 张三
```
第二种使用`get`，键不存在时返回`None`
```python
student = {
    "name": "张三",
    "age": 20,
    "major": "计算机科学",
    "gpa": 3.8
}
gender = student.get("gender")
print(f"性别: {gender}")  # 输出: 性别: None

gpa = student.get("gpa", 4.0)  # 带默认值
print(f"平均绩点: {gpa}")  # 输出: 平均绩点: 3.8
```
第三种使用`try-except`
```python
student = {
    "name": "张三",
    "age": 20,
    "major": "计算机科学",
    "gpa": 3.8
}
try:
    score = student["score"]
except KeyError:
    print("分数信息不存在")  # 输出: 分数信息不存在
```
把数据放入dict的方法，除了初始化时指定外，还可以通过key放入，由于一个key只能对应一个value，所以，多次对一个key放入value，后面的值会把前面的值冲掉。   

### 基本操作函数
| 函数/操作            | 描述       | 示例                          |
| ---------------- | -------- | --------------------------- |
| `len(d)`         | 返回字典元素数量 | `len({'a':1, 'b':2})` → 2   |
| `key in d`       | 检查键是否存在  | `'a' in {'a':1}` → True     |
| `key not in d`   | 检查键是否不存在 | `'c' not in {'a':1}` → True |
| `d[key]`         | 获取键对应的值  | `{'a':1}['a']` → 1          |
| `d[key] = value` | 设置键值对    | `d = {}; d['a'] = 1`        |
| `del d[key]`     | 删除键值对    | `d = {'a':1}; del d['a']`   |
### 字典方法
#### 查询

| 方法                             | 描述                  | 示例                                         |
| ------------------------------ | ------------------- | ------------------------------------------ |
| `d.get(key[, default])`        | 安全获取值，键不存在返回default | `{'a':1}.get('b', 0)` → 0                  |
| `d.setdefault(key[, default])` | 获取值，键不存在则设置默认值      | `d={}; d.setdefault('a',1)` → 1            |
| `d.keys()`                     | 返回所有键的视图            | `{'a':1}.keys()` → dict_keys(['a'])        |
| `d.values()`                   | 返回所有值的视图            | `{'a':1}.values()` → dict_values([1])      |
| `d.items()`                    | 返回所有键值对的视图          | `{'a':1}.items()` → dict_items([('a', 1)]) |

#### 修改
| 方法                      | 描述            | 示例                                        |
| ----------------------- | ------------- | ----------------------------------------- |
| `d.update([other])`     | 批量更新键值对       | `{'a':1}.update({'b':2})` → {'a':1,'b':2} |
| `d.pop(key[, default])` | 删除并返回键的值      | `{'a':1}.pop('a')` → 1                    |
| `d.popitem()`           | 删除并返回最后插入的键值对 | `{'a':1,'b':2}.popitem()` → ('b', 2)      |
| `d.clear()`             | 清空字典          | `{'a':1}.clear()` → {}                    |

## 集合 set
set和dict类似，也是一组key的集合，但不存储value。由于key不能重复，所以，在set中，没有重复的key。要创建一个set，用`{x,y,z,...}`列出每个元素：
```python
s = {1, 2, 3}
print(s)
```
输出
```text
{1, 2, 3}
```
重复元素在`set`中会被过滤，通过`add(key)`方法可以添加元素到set中，通过`remove(key)`方法可以删除元素。  
set可以看成数学意义上的无序和无重复元素的集合，因此，两个set可以做数学意义上的交集、并集等操作：
```python
s1 = {1, 2, 3}
s2 = {2, 3, 4}
print(s1 & s2) #交集
print(s1 | s2) #并集
print(s1 - s2) #差集
print(s1 ^ s2) #对称差分集
```
输出
```text
{2, 3}
{1, 2, 3, 4}
{1}
{1, 4}
```
set和dict的唯一区别仅在于没有存储对应的value，但是，set的原理和dict一样，所以，同样不可以放入可变对象，因为无法判断两个可变对象是否相等，也就无法保证set内部“不会有重复元素”。试试把list放入set，看看是否会报错。
# 函数
## 调用函数
Python的内置函数可在<a href="https://docs.python.org/zh-cn/3.13/library/functions.html#abs" target="_blank">内置函数 — Python 3.13.3 文档</a>中查询，可在交互式命令行中使用`help(函数名)`查询使用方法。   
如`int`函数，可将任何数据类型转换为`整型`，如：
```python
print(int("123"))
print(int(12.34))
print(int("FF", 16))
```
输出为：
```text
123
12
255
```
## 定义函数
在Python中，定义一个函数要使用`def`语句，依次写出函数名、括号、括号中的参数和冒号`:`，然后，在缩进块中编写函数体，函数的返回值用`return`语句返回。   
假设定义一个函数`quadratic(a, b, c)`，接收3个参数，返回一元二次方程  $ax^2+bx+c=0$的两个解。  
一元二次方程的求根公式为：
$$
x = \frac{-b\pm\sqrt{b^2-4ac}}{2a} 
$$

开根可调用`math.sqrt`实现。
函数编写如下：
```python
import math
def quadratic(a, b, c):
    x1 = (-b + math.sqrt(b**2-4*a*c))/(2*a)
    x2 = (-b - math.sqrt(b**2-4*a*c))/(2*a)
    return x1,x2
    
print(quadratic(2,3,1))
```
输出为：
```text
(-0.5, -1.0)
```
## 函数参数
### 位置参数
先写一个计算$x^2$的函数：
```python
def power(x):
    return x * x
```
对于`power(x)`函数，参数`x`就是一个位置参数。所以当调用`power`函数时，必须传入有且仅有的一个参数`x`。   
如果要计算$x^3$怎么办？可以再定义一个`power3`函数，但是如果要计算$x^4$、$x^4$……怎么办？我们不可能定义无限多个函数。
可以把`power(x)`修改为`power(x, n)`，用来计算$x^n$，说干就干：
```python
def power(x, n):
    s = 1
    while n > 0:
        n = n - 1
        s = s * x
    return s
```
对于这个修改后的`power(x, n)`函数，可以计算任意n次方。   
修改后的`power(x, n)`函数有两个参数：`x`和`n`，这两个参数都是位置参数，调用函数时，传入的两个值按照位置顺序依次赋给参数`x`和`n`。
#### 默认参数
新的`power(x, n)`函数定义没有问题，但是，旧的调用代码失败了，原因是我们增加了一个参数，导致旧的代码因为缺少一个参数而无法正常调用：
```
power(3)

Traceback (most recent call last):
  File "d:\py\porjeect\calss\4.py", line 55, in <module>
    print(power(3))
          ^^^^^^^^
TypeError: power() missing 1 required positional argument: 'n'
```
错误信息指出，调用函数`power()`缺少了一个位置参数`n`。    
这个时候可以使用默认参数，假设计算$x^3$比较多，可将函数修改如下：
```python
def power(x, n=3):
    s = 1
    while n > 0:
        n = n - 1
        s = s * x
    return s
```
修改后，当调用`power(3)`时，相当于调用`power(3, 3)`。而对于其他情况，需要明确指出`n`的值。   
需要特别注意的是，`默认参数必须指向不变对象`。
#### 可变参数
在Python函数中，还可以定义可变参数。顾名思义，可变参数就是传入的参数个数是可变的，可以是1个、2个到任意个，还可以是0个。  
以数学题为例子，给定一组数字a，b，c……，请计算$a^2$ + $b^2$ + $c^2$ + ……。   
要定义出这个函数，必须确定输入的参数。由于参数个数不确定，首先想到可以把a，b，c……作为一个list或tuple传进来，这样，函数可以定义如下：
```python
def calc(numbers):
    sum = 0
    for n in numbers:
        sum = sum + n * n
    return sum
```
但是调用的时候，需要先组装出一个list或tuple，如果利用可变参数，可以简化函数，所以，将`calc`函数的参数改为可变参数：
```python
def calc(*numbers):
    sum = 0
    for n in numbers:
        sum = sum + n * n
    return sum
```
定义可变参数和定义一个list或tuple参数相比，仅仅在参数前面加了一个`*`号。在函数内部，参数`numbers`接收到的是一个tuple，因此，函数代码完全不变。但是，调用该函数时，可以传入任意个参数，包括0个参数，对比如下：
```python
#修改前输入方式
calc([1, 2, 3])
calc((1, 3, 5, 7))

#修改后输入方式
calc(1, 2, 3)
calc(1, 3, 5, 7)
```
这两个输出是完全一样的，区别是使用可变参数的输入更为简洁，对于已经有一个list或者tuple，要调用一个可变参数，可以像下面这样操作：
```python
nums = [1, 2, 3]
calc(*nums)
```
Python允许你在list或tuple前面加一个`*`号，把list或tuple的元素变成可变参数传进去，`*nums`表示把`nums`这个list的所有元素作为可变参数传进去。这种写法相当有用，而且很常见。
#### 关键字参数
可变参数允许你传入0个或任意个参数，这些可变参数在函数调用时自动组装为一个tuple。而关键字参数允许你传入0个或任意个含参数名的参数，这些关键字参数在函数内部自动组装为一个dict。示例如下：
```python
def person(name, age, **kw):
    print('name:', name, 'age:', age, 'other:', kw)
```
函数`person`除了必选参数`name`和`age`外，还接受关键字参数`kw`：
```python
person('Bob', 35, city='Beijing')
person('Adam', 45, gender='M', job='Engineer')
```
输出：
```
name: Bob age: 35 other: {'city': 'Beijing'}
name: Adam age: 45 other: {'gender': 'M', 'job': 'Engineer'}
```
在调用该函数时，可以只传入必选参数，也可以传入任意个数的关键字参数。可以扩展函数的功能。比如，在`person`函数里，能接收到`name`和`age`这两个参数，但如果调用者愿意提供更多的参数，也同样能收到。   
和可变参数类似，也可以先组装出一个dict，然后把该dict转换为关键字参数传进去。

#### 命名关键字参数
对于关键字参数，函数的调用者可以传入任意不受限制的关键字参数。至于到底传入了哪些，就需要在函数内部通过`kw`检查。   
以`person()`函数为例，检查是否有`city`和`job`参数：
```python
def person(name, age, **kw):
    if 'city' in kw:
        # 有city参数
        pass
    if 'job' in kw:
        # 有job参数
        pass
    print('name:', name, 'age:', age, 'other:', kw)
```
但调用者仍可传入不受限制的关键字参数，如果要限制关键字参数的名字，就可以用命名关键字参数，例如，只接收`city`和`job`作为关键字参数。这种方式定义的函数如下：
```python
def person(name, age, *, city, job):
    print(name, age, city, job)
```
和关键字参数`**kw`不同，命名关键字参数需要一个特殊分隔符`*`，`*`后面的参数被视为命名关键字参数。     

如果函数定义中已经有了一个可变参数，后面跟着的命名关键字参数就不再需要一个特殊分隔符`*`了。     

命名关键字参数必须传入参数名，这和位置参数不同。如果没有传入参数名，调用将报错。  
#### 参数组合
在Python中定义函数，可以用必选参数、默认参数、可变参数、关键字参数和命名关键字参数，这5种参数都可以组合使用。但是请注意，参数定义的顺序必须是：必选参数、默认参数、可变参数、命名关键字参数和关键字参数。

## 递归函数
在函数内部，可以调用其他函数。如果一个函数在内部调用自身本身，这个函数就是递归函数。   

递归函数有两个条件：   
`基准条件`：递归终止的条件。    
`递归条件`：函数调用自身的条件。    

递归函数的优点是定义简单，逻辑清晰。理论上，所有的递归函数都可以写成循环的方式，但循环的逻辑不如递归清晰。  
例：
```python
def factorial(n):
    # 基准条件
    if n == 0 or n == 1:
        return 1
    # 递归条件
    return n * factorial(n - 1)
```
每次递归调用都会在内存栈中创建一个新的栈帧（stack frame），保存当前函数的局部变量和返回地址。当递归深度过大时，可能导致栈溢出。

### 尾递归
尾递归是一种特殊的递归形式，其中递归调用是函数执行的最后一步操作（即函数返回时直接返回递归调用的结果，不再进行其他计算）。
例：
```python
def factorial_tail(n, acc=1):
    # 基准条件
    if n == 0:
        return acc
    # 尾递归调用（最后一步且直接返回）
    return factorial_tail(n - 1, acc * n)
```
`return factiter(n - 1, n * acc)`仅返回递归函数本身，`n - 1`和`n * acc`在函数调用前就会被计算，不影响函数调用。

# 高级特性
掌握了Python的数据类型、语句和函数，基本上就可以编写出很多有用的程序了。  
## 切片
切片是 Python 中一种强大的操作，用于从字符串中提取子序列。同样可用于`list`，`tuple`。  
语法：
```text
字符串[起始索引:结束索引:步长]
```
**`起始索引`**：切片开始位置，为负时从末尾开始（包含该索引）。   
**`结束索引`**：切片结束位置（不包含该索引）。   
**`步长`**：每隔多少个字符取一次，为正时从左向右，为负时反之（默认为1）。
例:
```python
s = "Hello, Python!"
print(s[0:5])
print(s[7:13])   
print(s[:5])
print(s[7:])
print(s[::2])
```
输出：
```
Hello   #（索引0到4）
Python  #（索引7到12）
Hello   #（省略起始，默认从0开始）
Python! #（省略结束，默认到末尾）
Hlo yhn #（步长为2，隔字符取）
```
## 迭代
如果给定一个`list`或`tuple`，我们可以通过`for`循环来遍历这个`list`或`tuple`，这种遍历我们称为迭代（Iteration）。   
在Python中，迭代是通过`for ... in`来完成的，只要作用于一个可迭代对象，`for`循环就可以正常运行，只要是可迭代对象，无论有无下标，都可以迭代。不需要太关心该对象究竟是`list`还是其他数据类型。  
如果要对`list`实现类似Java那样的下标循环怎么办？Python内置的`enumerate`函数可以把一个`list`变成索引-元素对，这样就可以在`for`循环中同时迭代索引和元素本身：
```python
for i, value in enumerate(['A', 'B', 'C']):
     print(i, value)

#输出
0 A
1 B
2 C
```
## 列表生成式
列表生成式即List Comprehensions，是Python内置的非常简单却强大的可以用来创建list的生成式。  
如果要生成`[1x1, 2x2, 3x3, ..., 10x10]`这样的列表，方法一是循环：
```python
L = []
for x in range(1, 11):
    L.append(x * x)
print(L)

#输出
[1, 4, 9, 16, 25, 36, 49, 64, 81, 100]
```
方法二就是使用列表生成式：
```python
L=[x * x for x in range(1, 11)]
print(L)

#输出
[1, 4, 9, 16, 25, 36, 49, 64, 81, 100]
```
写列表生成式时，把要生成的元素`x * x`放到前面，后面跟`for`循环，就可以把list创建出来。如果需要，在for循环后面还可以加上if判断，这样我们就可以筛选出仅偶数的平方：
```python
L=[x * x for x in range(1, 11) if x % 2 == 0]
print(L)

#输出
[4, 16, 36, 64, 100]
```
还可以使用两层循环，可以生成全排列：
```python
L=[m + n for m in 'ABC' for n in 'XYZ']
print(L)

#输出
['AX', 'AY', 'AZ', 'BX', 'BY', 'BZ', 'CX', 'CY', 'CZ']
```
列表生成式可以使用两个变量：
```python
d = {'x': 'A', 'y': 'B', 'z': 'C' }
[k + '=' + v for k, v in d.items()]
['y=B', 'x=A', 'z=C']
```
### 列表生成式中的if...else
在列表生成式中，使用`if`判断时，不能直接加上else。语法为：   
`[<真时值> if <条件> else <假时值> for <元素> in <可迭代对象>]`
示例如下：
```python
[x if x % 2 == 0 else -x for x in range(1,12)]

#输出
[-1, 2, -3, 4, -5, 6, -7, 8, -9, 10, -11]
```
`for`前面的部分是一个表达式，它必须根据`x`计算出一个结果。因此，考察表达式：`x if x % 2 == 0`，它无法根据`x`计算出结果，因为缺少`else`，必须加上`else`

## 生成器
Python中，一边循环一边计算的机制，称为生成器：generator。

要创建一个generator，有很多种方法。第一种方法很简单，只要把一个列表生成式的`[]`改成`()`，就创建了一个generator：
```python
L = [x * x for x in range(10)]
print(L)

输出
[0, 1, 4, 9, 16, 25, 36, 49, 64, 81]

g = (x * x for x in range(10))
print(g)

#输出
<generator object <genexpr> at 0x00000245CC851F20>
```
创建`L`和`g`的区别仅在于最外层的`[]`和`()`，`L`是一个list，而`g`是一个generator。  
如果要一个一个打印出来，可以通过`next()`函数获得generator的下一个返回值：
```python
g = (x * x for x in range(10))
print(next(g),next(g),next(g),next(g),next(g))

#输出
0 1 4 9 16
```
generator保存的是算法，每次调用`next(g)`，就计算出`g`的下一个元素的值，直到计算到最后一个元素，没有更多的元素时，抛出`StopIteration`的错误。  
当然，这种不断调用`next(g)`实在是太变态了，正确的方法是使用`for`循环，因为generator也是可迭代对象。所以，我们创建了一个generator后，基本上永远不会调用`next()`，而是通过`for`循环来迭代它，并且不需要关心`StopIteration`的错误。  

generator非常强大。如果推算的算法比较复杂，用类似列表生成式的`for`循环无法实现的时候，还可以用函数来实现。  
比如`斐波拉契数列（Fibonacci）`，除第一个和第二个数外，任意一个数都可由前两个数相加得到，用列表生成式实现不出来，但是用函数实现就很简单：
```python
def fib(max):
    n, a, b = 0, 0, 1
    while n < max:
        print(b)
        a, b = b, a + b
        n = n + 1
    return 'done'
```
仔细观察，可以看出，`fib`函数实际上是定义了斐波拉契数列的推算规则，可以从第一个元素开始，推算出后续任意的元素，这种逻辑其实非常类似generator。

也就是说，上面的函数和generator仅一步之遥。要把`fib`函数变成generator函数，只需要把`print(b)`改为`yield b`就可以了：
```python
def fib(max):
    n, a, b = 0, 0, 1
    while n < max:
        yield b
        a, b = b, a + b
        n = n + 1
    return 'done'
```
这就是定义generator的另一种方法。如果一个函数定义中包含`yield`关键字，那么这个函数就不再是一个普通函数，而是一个generator函数，调用一个generator函数将返回一个generator。

生成器函数是 Python 中一种特殊的函数，它使用 `yield` 语句而不是 `return` 来返回值，能够按需生成值（惰性求值），非常适合处理大数据流或无限序列。
## 迭代器
可以直接作用于`for`循环的数据类型有以下几种：  
一类是集合数据类型，如`list`、`tuple`、`dict`、`set`、`str`等；  
一类是`generator`，包括生成器和带`yield`的generator function。  

这些可以直接作用于`for`循环的对象统称为可迭代对象：`Iterable`。  
可以使用`isinstance()`判断一个对象是否是`Iterable`对象。  

而生成器不但可以作用于`for`循环，还可以被`next()`函数不断调用并返回下一个值，直到最后抛出`StopIteration`错误表示无法继续返回下一个值了。  
可以被`next()`函数调用并不断返回下一个值的对象称为迭代器：`Iterator`。  
可以使用`isinstance()`判断一个对象是否是`Iterator`对象。  

生成器都是`Iterator`对象，但`list`、`dict`、`str`虽然是`Iterable`，却不是`Iterator`。
把`list`、`dict`、`str`等`Iterable`变成`Iterator`可以使用`iter()`函数：
```python
print(isinstance(iter([]), Iterator))

#输出
True
```
Python的`Iterator`对象表示的是一个数据流，`Iterator`对象可以被`next()`函数调用并不断返回下一个数据，直到没有数据时抛出`StopIteration`错误。可以把这个数据流看做是一个有序序列，但我们却不能提前知道序列的长度，只能不断通过`next()`函数实现按需计算下一个数据，所以`Iterator`的计算是惰性的，只有在需要返回下一个数据时它才会计算。  

`Iterator`甚至可以表示一个无限大的数据流，例如全体自然数。而使用list是永远不可能存储全体自然数的。

# 函数式编程
函数是Python内建支持的一种封装，我们通过把大段代码拆成函数，通过一层一层的函数调用，就可以把复杂任务分解成简单的任务，这种分解可以称之为面向过程的程序设计。函数就是面向过程的程序设计的基本单元。

而函数式编程（请注意多了一个“式”字）——Functional Programming，虽然也可以归结到面向过程的程序设计，但其思想更接近数学计算。
## 高阶函数
### 高级函数相关
#### 变量是可以指向函数
以`type`为例：
```python
a = [1,2,3,4,5]
b = type
print(b(a))

#输出
<class 'list'>
```
#### 函数名也可以是变量
仍以`type`为例：
```python
type = "str"
print(type(1))

#输出报错
print(type(1))
	    ^^^^^^^
TypeError: 'str' object is not callable
```
>当然实际编程中绝对不能这样   
#### 传入函数
既然变量可以指向函数，函数的参数能接收变量，那么一个函数就可以接收另一个函数作为参数，这种函数就称之为高阶函数。
```python
def add(x, y, f):
    return f(x) + f(y)

print(add(-5, 6, abs))

#输出
11
```
### map/reduce
Python内建了`map()`和`reduce()`函数。
#### map
`map()`函数接收两个参数，一个是函数，一个是`Iterable`，`map`将传入的函数依次作用到序列的每个元素，并把结果作为新的`Iterator`返回。
举个例子，有一个正比例函数  $f(x) = 2x$  ，要将这个函数作用在列表`[1,2,3,4,5,6,7,8,9]`   
在python中用代码表示如下：
```python
def f(x):
    return x * 2

a = range(1, 10)
b = map(f, a)
print(list(b))

#输出
[2, 4, 6, 8, 10, 12, 14, 16, 18]
```
`map()`作为高阶函数，事实上它把运算规则抽象了，因此，我们不但可以计算简单的$f(x) = 2x$ ，还可以计算任意复杂的函数。
#### reduce
`reduce`函数的第一个参数是一个**需要接受两个参数的函数**（通常称为二元操作函数或归约函数）。这个函数决定了如何将序列中的元素逐步合并为单个结果。
以列表**累乘运算**为例：
```python
from functools import reduce

a = [1, 2, 3, 4, 5]
def b(x,y):
    return x * y
  
product = reduce(b , a)
print(product)

#输出
120
```
### filter
Python内建的`filter()`函数用于过滤序列。  
和`map()`类似，`filter()`也接收一个函数和一个序列。和`map()`不同的是，`filter()`把传入的函数依次作用于每个元素，然后根据返回值是`True`还是`False`决定保留还是丢弃该元素。

`filter()`这个高阶函数，关键在于正确实现一个“筛选”函数。
以`埃氏筛`求质数为例：
```python
def _odd_iter():
    n = 1
    while True:
        n = n + 2
        yield n
#运用生成器创建从3开始的无限序列

def _not_divisible(n):
    return lambda x: x % n > 0
#定义一个筛选函数

def primes():
    yield 2
    it = _odd_iter() # 初始序列
    while True:
        n = next(it) # 返回序列的第一个数
        yield n
        it = filter(_not_divisible(n), it) # 构造新序列
#定义一个新的生成器，不断返回下一个函数

# 打印1000以内的素数:
L=[]
for n in primes():
    if n < 100:
        L.append(n)
    else:
        break
print(L)


#输出
[2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61, 67, 71, 73, 79, 83, 89, 97]
```
### sorted
在列表中的使用：[列表](#sorted)   
同时`sorted`也是一个高阶函数。
基本语法：
```python
sorted(iterable, key=None, reverse=False)
```
- **iterable**: 需要排序的可迭代对象（如列表、元组、字符串等）
- **key**: 排序依据的函数（可选）
- **reverse**: 是否降序排序（默认为False，即升序）

`key`参数允许你指定一个函数来自定义排序规则，例如按绝对值大小排序：
```python
a=[36, 5, -12, 9, -21]
b=sorted(a, key=abs)
print(b)

#输出
[5, 9, -12, -21, 36]
```
## 返回函数
高阶函数除了可以接受函数作为参数外，还可以把函数作为结果值返回。

# 模块




