---
title: 一些C#的学习笔记
date: 2025-08-26
description: C#基础
image: ""
tags: ["基础教程","CSharp","编程"]
category: 基础教程

---


>这里是我学习C#时的学习笔记。
# 什么是C# 
C#（读作 "C Sharp"）是一种由微软开发的现代化、通用型、面向对象的编程语言。它最初由 Anders Hejlsberg 领导开发，并于 2000 年发布，作为 .NET 平台的核心语言之一。

在Visual Studio中，选择C#，Windows，控制台·创建项目会在`Program.cs`中默认生成如下代码段：
```csharp
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

//using使用
namespace demo01
    //命名空间
{
    internal class Program
        //internal内部
        //class类
    {
        static void Main(string[] args)
        //主函数，是程序的入口
        {
        }
    }
}

```
代码写在主函数中。
# 数据类型
## 整数
`byte`，1个字节。   
`short`，2个字节。   
`int`，4个字节。   
`long`，8个字节，使用时要在值后用`L`标识。   
## 浮点数
`float`，4字节，单精度小数，精确到小数点后7位，使用时要用`F`标识。   
`double`，8字节，双精度小数，精确到小数点后15-16位。  
## 字符
`char`，存放单个字符，使用`''`标识。   
`string`，字符串，使用`""`标识。   
判断两个字符是否相等时推荐使用`equals`。
## 布尔值
`bool`，值为true或false，用于逻辑判断。
## 数据类型转换
### 方法1
基本语法：新变量 = 目标数据类型.Parse(原变量)
例：
```csharp
string a = "123";
int b;
b = int.Parse(a);
Console.WriteLine(b is int);
```
输出如下：
```text
True
```
### 方法2
```csharp
int a = 10;
byte b = 0;
a = b;        //小转大自动转
b = (byte)a;  //大转小强制转
```
强制转换会导致数据丢失。
# 变量
## 变量命名：
- 变量名不可重复
- 只能包含字母、数字、下划线，不能包含空格和其他符号
- 见名知意
- 不能以数字开头
- 采用驼峰命名法
>大驼峰：每个单词的首字母都大写，如：ClassName    
>小驼峰：第一个单词的首字母小写，其他单词的首字母大写，如：className

与Python类似，但C#的变量与值需要是相同的数据类型。
## 变量声明
基本语法：
- 数据类型 变量名;
- 数据类型 变量名 = 值;
- 数据类型 变量名1 = 值1 ,变量名2 = 值2;
```csharp
  int A1;
  //声明一个int类型，名称为A1的变量
  char B1 = 'C';
  //声明一个char类型，名称为B1，值为C的变量
```
## 手动输入
在C#中，手动输入值由提示词+获取输入信息来共同完成，例：
```csharp
Console.WriteLine("请输入你的年龄");
string Age = Console.ReadLine();
if (string.IsNullOrWhiteSpace(Age))
{
    Console.WriteLine("未输入年龄");
}
else
{
    Console.WriteLine(Age);
}
```
输入输出如下：
```text
//输入17
17
//输入19
19
```
# 运算符
## 数学运算符
`+`，`-`，`*`，`/`，`%`    
自增/自减：++/--，相当于+=/-=
整数相除时结果自动取整。
## 关系运算符
 `==` 等于  
 `!=` 不等于  
 `>` 大于 / `>=` 大于等于  
 `<` 小于 / `<=` 小于等于
## 逻辑运算符

| 名称         | 符号   | 条件                   |
| ---------- | ---- | -------------------- |
| 条件逻辑与（and） | &&   | 左侧为 `false` 时，右侧不再计算 |
| 条件逻辑或（or）  | \|\| | 左侧为 `true` 时，右侧不再计算  |
| 逻辑非（not）   | !    | 取反布尔值                |
| 逻辑与        | &    | 始终计算两边，适合需要完整判断的场景   |
| 逻辑或        | \|   | 始终计算两边，适合位运算或完整逻辑判断  |

## 运算符优先级
与Python类似，C#中运算符优先级最高是`()`，最低是`=`

## is关键字
用于判断数据类型，返回的结果是bool类型。   
例：
```csharp
string str = "曼波";
bool flag = str is string;
Console.WriteLine(flag);
```
输出如下：
```text
True
```
## 三元表达式
与Python中的if选择类似。  
基本语法：条件 ? 结果1:结果2    
`?`表示询问条件。    
`:`表示结果，返回结果的数据类型由用户决定。   
例：
```csharp
int A = 10, B = 5, C = 1;
string result = A > C ? "A大于C" : "A小于C";
Console.WriteLine(result);
```
输出如下：
```text
A大于C
```
# 选择结构
## if选择结构
基本语法如下：
```text
//单分支
if (条件) 
{执行的代码}

//双分支
if (条件)
{条件为true时执行}
else
{条件为false时执行}

//多分支
if (条件1)
{条件1为true时执行}
else if (条件2)
{条件2为true时执行}
else
{条件为false时执行}
......
```
例：
```csharp
Console.WriteLine("请输入成绩");
string s = Console.ReadLine();

if (!int.TryParse(s, out int score))
{
    Console.WriteLine("输入错误");
}
else if (score >= 90)
{
    Console.WriteLine("优秀");
}
else if (score >= 80)
{
    Console.WriteLine("良好");
}
else if (score >= 70)
{
    Console.WriteLine("中等");
}
else if (score >= 60)
{
    Console.WriteLine("及格");
}
else
{
    Console.WriteLine("不及格");
}
```
## switch选择结构
基本语法：
```text
switch (表达式) {
case 表达式1:
	语句1;
	break;
case 表达式2:
	语句2;
	break;
default:
	break;
}
```
switch中，代码没先后顺序之分。   
在所有case值不满足的情况下才会执行default。   
case是明确且不会发生变化的值。   
支持整型，浮点，布尔，字符，枚举等数据类型。   

`switch`与`if`可以互相嵌套使用：
```csharp
Console.WriteLine("请输入1-31的数字");
string str = Console.ReadLine();

if (!int.TryParse(str, out int day) || day <= 0 || day > 31)
{
    Console.WriteLine("输入错误");
}
else
{
    int week = (day - 1) / 7 +1 ;
    day = day % 7;
    switch (day)
    {
        case 1:
            Console.WriteLine($"第{week}周的周一");
            break;
        case 2:
            Console.WriteLine($"第{week}周的周二");
            break;
        case 3:
            Console.WriteLine($"第{week}周的周三");
            break;
        case 4:
            Console.WriteLine($"第{week}周的周四");
            break;
        case 5:
            Console.WriteLine($"第{week}周的周五");
            break;
        case 6:
            Console.WriteLine($"第{week}周的周六");
            break;
        case 0:
            Console.WriteLine($"第{week}周的周日");
            break;
    }
}
```

# 循环结构
C#中有三种循环结构：`while`，`do-while`，`for`

## while()
`先判断后执行`
根据条件可以判断执行的次数。
基本语法：
```text
循环变量;
while (条件)
{
    代码串;
    循环迭代语句;
}
```
while循环缺少迭代语句会进入死循环。   
例：
```csharp
//循环输出1-10
int a = 1;
while (a<11)
{
    Console.WriteLine(a);
    a++;
}
```
## do{ } while()
`先执行后判断`
基本语法：
```text
循环变量;
do 
{
    代码串;
    循环迭代语句;
}
while (条件);
```
例：
```csharp
int a = 1;
do 
{
    Console.WriteLine(a);
    a += 2;
}
while (a <= 30);
```

## for 
基本语法：
```text
for(初始化;条件;迭代语句)
{ 
	代码块
}
```
例：
```csharp
for (int a = 1; a < 6; a++) 
{
    Console.WriteLine($"第{a}次"+a);
}
```
代码执行顺序如下：`int a =1` -->`a < 6`-->`Console.WriteLine($"第{a}次"+a)`-->`a++`   
当满足条件时执行代码块，随后执行迭代语句，直到条件不满足为止。
# 数组
数组(arrays)：结构化数据类型，存放的是类型相同的数据。  
数组中长度固定，数据类型相同。
## 声明方法
```csharp
  int[] a;
  //声明数组
  a = new int[5];
  //给已有数组固定长度
  a = new int[5] { 1, 2, 3, 4, 5 };
  //为数组赋值
  
  int[] b = new int[5] { 5, 4, 3, 2, 1 };
```
## 访问数组
与python相同，通过下标（index）访问。
```csharp
int[] b = new int[5] { 5, 4, 3, 2, 1 };
Console.WriteLine(b[3]);
```
输出的值应该为：
```text
2
```

## 循环遍历
在C#中，数组也可以使用循环来遍历。
```csharp
int[] b = new int[5] { 5, 4, 3, 2, 1 };
for (int i = 0; i <= b.Length - 1; i++)
{
    Console.WriteLine(b[i]);
}
```
在代码中，length用来获取长度，这是一个属性，对所有变量都适用，使用`Array.sort(数组名)`来对数组排序。
# 字符串
字符串string是一个自读的char类型数组。   
在C#中，字符串的操作方式与Python类型。
```csharp
string str = "    rgdzsfJWBHKrfg    ";
```
## 转大小写
```csharp
string str = "    rgdzsfJWBHKrfg    ";
Console.WriteLine(str.ToUpper());
Console.WriteLine(str.ToLower());
```
## 检查开头结尾
返回布尔值。
```csharp
string str = "    rgdzsfJWBHKrfg    ";
Console.WriteLine(str.StartsWith("r"));
Console.WriteLine(str.EndsWith("g"));
```
## 去除空字符串
```csharp
string str = "    rgdzsfJWBHKrfg    ";
Console.WriteLine(str.Trim());
Console.WriteLine(str.TrimEnd());
Console.WriteLine(str.TrimStart());
```
## 查找
返回第一个字符下标。     
未找到时返回`-1`。   
```csharp
string str = "    rgdzsfJWBHKrfg    ";
Console.WriteLine(str.IndexOf("g"));
Console.WriteLine(str.LastIndexOf("r"));
```
## 检查存在
```csharp
string str = "    rgdzsfJWBHKrfg    ";
Console.WriteLine(str.Contains("f"));
```
## 字符串拼接
```csharp
string str = "    rgdzsfJWBHKrfg    ";
Console.WriteLine(string.Concat(str,"哦马吉里曼波"));
```
使用时需要使用`string`引用
## 忽略大小写
```csharp
string str2 = "rgdzsfJWB@HKrfg";
Console.WriteLine(str2.Equals("RGdzsfJWB@HKrFG",StringComparison.OrdinalIgnoreCase));
```
# 类与对象
类是对一组对象的抽象描述，它定义了对象的属性（字段）和行为（方法）。  
定义类：
```csharp
public class Dog
{
    public string name = "";
    public string strian = "";
    public double weight;

    public void GetShow()
    {
        Console.WriteLine($"我的狗叫{name}，是一只{strian}，体重是{weight}KG");
    }

    public void GetValues(int a, int b)
    {
        Console.WriteLine(a + b);
    }
}
```
调用类
```csharp
public class Dog
{
    public string name = "";
    public string strian = "";
    public double weight;

    public void GetShow()
    {
        Console.WriteLine($"我的狗叫{name}，是一只{strian}，体重是{weight}KG");
    }

    public void GetValues(int a, int b)
    {
        Console.WriteLine(a + b);
    }
}

Dog newDog = new Dog();
newDog.name = "小黑";
newDog.strian = "拉布拉多";
newDog.weight = 15.5;
newDog.GetShow();
newDog.GetValues(10, 20);
```
# 异常处理
在C#中，异常不等于错误，异常代码可以正常运行，错误是代码无法直接运行。   
我们使用`try {} catch () {}`语句来处理异常。   
语法如下：
```csharp
try
{
    // 可能抛出异常的代码
}
catch (Exception ex)
//Exception包含了所有异常状态
{
	// 异常处理逻辑
	Console.WriteLine($"异常信息为{ex.Message}");
    //message将异常状态详细描述
}

```
# ADO
## ADO概念
一种基于COM组件库的数据库访问技术，支持应用程序与数据库建立连接、执行数据操作（增删改查）等功能，优先调用数据库原生接口以提升性能。
## ADO组成
### DataSet
内存中的离线数据存储容器，可独立于数据源存在，支持多表数据存储与关系映射。
### DataProvider
数据提供程序，负责与具体数据库交互的核心组件，常见类型包括：
- `System.Data.SqlClient`（SQL Server）
- `System.Data.OleDb`（通用数据库）
### Connection
提供与数据源的持续连接，以`SqlConnection`（SQL Server连接）为例：
#### sqlconnection的常用属性：
##### ConnectionString
连接字符串，包含数据库地址、用户名、密码等连接信息
##### DataSource
数据库服务器地址
#### sqlconnection的常用方法：
##### Open()
打开数据库连接
##### Close()
关闭数据库连接
```text
// 示例：创建并打开SQL Server连接
using System.Data.SqlClient;

string connectionString = "Server=localhost;Database=TestDB;Uid=sa;Pwd=123456;";
using (SqlConnection conn = new SqlConnection(connectionString))
{
    try
    {
        conn.Open();
        Console.WriteLine("数据库连接成功");
    }
    catch (Exception ex)
    {
        Console.WriteLine($"连接失败：{ex.Message}");
    }
}
```
##### State
获取当前连接的状态（如`Open`、`Closed`等）。
### SqlCommand
用于向数据库发送SQL命令或存储过程，并执行这些命令。
#### SqlCommand的常用属性：
##### CommandText
要执行的SQL语句或存储过程名称。
##### Connection
与命令关联的`SqlConnection`对象。
##### CommandType
指定命令类型，如`Text`（SQL语句）或`StoredProcedure`（存储过程）。
#### SqlCommand的常用方法：
##### ExecuteNonQuery()
执行不返回任何行（如INSERT、UPDATE、DELETE）的SQL命令，返回受影响的行数。
##### ExecuteScalar()
执行返回单个值（如COUNT、SUM）的SQL命令，返回结果集的第一行第一列的值。
##### ExecuteReader()
执行返回多行数据（如SELECT）的SQL命令，返回`SqlDataReader`对象。
```text
// 示例：执行INSERT命令
using System.Data.SqlClient;

string connectionString = "Server=localhost;Database=TestDB;Uid=sa;Pwd=123456;";
using (SqlConnection conn = new SqlConnection(connectionString))
{
    conn.Open();
    string sql = "INSERT INTO Users (Name, Age) VALUES ('张三', 30)";
    using (SqlCommand cmd = new SqlCommand(sql, conn))
    {
        int rowsAffected = cmd.ExecuteNonQuery();
        Console.WriteLine($"插入了 {rowsAffected} 行数据");
    }
}
```
### SqlDataReader
提供一种快速、只进、只读的方式从数据库中读取数据。
#### SqlDataReader的常用方法：
##### Read()
读取下一行数据，如果成功则返回`true`，否则返回`false`。
##### GetString(int ordinal)
根据列的索引获取字符串类型的值。
##### GetInt32(int ordinal)
根据列的索引获取32位整数类型的值。
```text
// 示例：读取数据
using System.Data.SqlClient;

string connectionString = "Server=localhost;Database=TestDB;Uid=sa;Pwd=123456;";
using (SqlConnection conn = new SqlConnection(connectionString))
{
    conn.Open();
    string sql = "SELECT Name, Age FROM Users";
    using (SqlCommand cmd = new SqlCommand(sql, conn))
    {
        using (SqlDataReader reader = cmd.ExecuteReader())
        {
            while (reader.Read())
            {
                Console.WriteLine($"姓名：{reader.GetString(0)}, 年龄：{reader.GetInt32(1)}");
            }
        }
    }
}
```
##### State
`Open()`打开   
`Closed()`关闭   
`Dispose`释放所有资源，一切清空   
`connecting`正在连接   
`executing`正在执行命令   
##### ConnectionTimeout

### Command
执行数据库命令的对象，用于执行增删改查项目。   
#### 常用方法：
##### ExecuteNonQuery()
`update`    
`insert`   
`delete`    
#### ExecuteScalar0()
获取聚合函数内容：
`max()`    
`min() `   
`sum() `   
`avg()`    
`count()`    
##### ExecuteReader()
执行查询返回集，并逐行读取数据。
#### 常用属性
`Parameters`，获取参数集合（用于参数化查，防止SQL注入）。   
##### 常用方法
`add()`添加单个参数。   
`AddWithValue()`同时添加参数和值，自动判断数据类型。   
`AddRange0`添加数据元素。
### DataReader
从数据源中提供快速的,只读的数据库流。
#### sqldatareader
用于执行查询。     
##### 常用属性：    
`HasRows`：返回一个布尔值。
##### 常用方法：     
`Read()`：读取结果集中下一行，又为`True`，反之`False`。   
`NextResult()`：移动到下一个结果集(适用于存储过程返回多个结果集的情况)。
##### 获取结果集中的每一个结果
`GetBoolean(int i)`    
`GetDateTime(int i)`    
`GeGetlnt32(int i)`    
`GetString(int i)`    
`IsDBNull(int i)`    
以上都可以使用`下标`或`列名`获取数据库中的数据。
### DataAdapter
提供DataSet对象与数据源桥梁
## ado.net访问数据库的步骤
### 1.连接到数据库
创建数据库连接字符串
```text
SqlConnection conn = new SqlConnection();
conn.ConnectionString = "Data Source=.;database=cs;Integrated Security=True;";
```
上述代码中
`Data Source`指数据源   
`database`指数据库    
`Integrated Security=True`指使用Windows验证而不是SQL Server 用户名密码
### 2.打开连接
```text
conn.Open()
```
### 3.执行创建对象
### 4.执行命令
### 5.关闭连接
```text
conn.Close()
```

