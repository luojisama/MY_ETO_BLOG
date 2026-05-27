---
title: "JAVA"
date: 2026-03-16
description: "这是一篇记录我JAVA学习的文章"
tags: ["基础教程", "JAVA", "编程"]
category: "基础教程"

---
> 2026年开学第一个学期，我开始了 Java 基础的学习。   
>  Java与Csharp的语法结构十分相似，本文中 Java 使用的 IDE 是 `IntelliJ IDEA`。

# 环境与第一个程序

创建一个项目，选择 Java 模块，不需要模板，自行选择路径与命名，不要出现中文。 项目创建完成后，在 `src` 目录下新建一个 `软件包`，`软件包` 内创建 `类` 文件，IDEA 会默认生成如下结构：

```java
public class Main {
    public static void main(String[] args) {
        // 代码写在这里
    }
}
```

与 C# 类似，main 方法是程序的入口，代码从这里开始执行。 在 main 方法中输入以下代码，点击左侧绿色运行按钮或按 `Shift + F10` 运行：

```java
public class Main {
    public static void main(String[] args) {
        System.out.println("Hello, World!");
    }
}
```

控制台输出：

```
Hello, World!
```

`System.out.println()` 是 Java 中最基础的输出语句，作用与 C# 的 `Console.WriteLine()` 相同，输出内容后自动换行。 `System.out.print()` 则不会自动换行，可以配合 `\n`（换行）、`\t`（制表符）手动控制格式。

# 注释与标识符

```java
// 单行注释

/*
   多行注释
*/

/**
 * 文档注释
 */
```

**关键字**：Java 中赋予了特定用途和含义的保留词，编辑器会高亮显示，如 `public`、`class`、`int` 等。

**标识符**（自己命名的词）需满足：

- 不能使用除 `_`、`$` 以外的符号
- 不能以数字开头
- 不能使用关键字
- 区分大小写，建议见名知意

常见命名规范：

| 场景      | 规范           | 示例                 |
| ------- | ------------ | ------------------ |
| 包名      | 全小写，用 `.` 隔开 | `com.example.util` |
| 类名、接口名  | 大驼峰          | `MyClass`          |
| 变量名、方法名 | 小驼峰          | `myVariable`       |
| 常量名     | 全大写          | `MAX_SIZE`         |

# 数据类型

Java 的数据类型分为**基本数据类型**和**引用数据类型**。

## 基本数据类型

```java
// 整数类型
byte  a = 127;                    // 字节
short b = 10000;                  // 短整型
int   c = 1000000000;             // 整型
long  d = 1000000000000000000L;   // 长整型，末尾加 L

// 浮点类型
float  e = 1.111f;   // 单精度，末尾加 f
double f = 1.222;    // 双精度

// 字符类型
char g = '牢';       // 存单个字符，可通过 Unicode 编码转为 int
c = g;
System.out.println(c); // 输出对应 Unicode 数值

// 布尔类型
boolean h = true;
boolean i = 5 > 3;   // 可以直接存逻辑运算的结果
System.out.println(i); // true
```

## 引用数据类型

```java
String j = "张三";   // 字符串
// 还有类类型、数组等
```

## 数据类型转换

**自动转换**：小类型转大类型，直接赋值即可。

**强制转换**：大类型转小类型，需要手动指定，小数转整数只保留整数部分。

```java
int  i1 = 20;
byte i2 = 10;

i2 = (byte) i1;   // 强制转换：大转小
System.out.println(i2); // 20
```

# 变量

变量是内存中有类型、标识名、值的一块空间。

```java
// 先声明后赋值
float chenji;
chenji = 98.5f;

// 声明同时赋值
float chenji = 98.5f;
String name = "张三";
char sex = '男';

System.out.println(chenji); // 98.5
System.out.println(name);   // 张三
System.out.println(sex);    // 男
```

# 运算符

## 常用运算符一览

```java
// 赋值运算符
int a = 10;

// 算数运算符：+ - * / % += -= ++ --
int c = a++;     // 先把 a 的值赋给 c，再自增
System.out.println(a); // 11
System.out.println(c); // 10

// 关系运算符：> < >= <= != ==（结果都是布尔值）

// 逻辑运算符：&& || !
boolean f  = 1 < 2 && 2 > 1;   // true
boolean f1 = 2 == 3 || 1 == 1; // true
boolean f2 = !(1 < 2);         // false
```

**优先级**（从高到低）：`!` > 算数 > 比较 > `&&` > `||` > 赋值

小括号优先级最高，可用于调整执行顺序。

## 字符串比较

字符串不能用 `==` 比较内容，应使用 `.equals()` 方法：

```java
String s1 = "aa";
String s2 = "aa";
boolean s3 = s1.equals(s2);
System.out.println("s3：" + s3); // s3：true
```

# 键盘输入

Java 通过 `Scanner` 类从键盘读取用户输入：

```java
import java.util.Scanner;

Scanner input = new Scanner(System.in);
// 在线运行时可以在输入框填写：111 张三 12.5

// 读取整数
System.out.println("请输入整数");
if (input.hasNextInt()) {
    int k = input.nextInt();
    System.out.println("整数：" + k);
} else {
    System.out.println("没有读取到整数");
}

// 读取字符串
System.out.println("请输入姓名");
if (input.hasNext()) {
    String name = input.next();
    System.out.println("姓名：" + name);
} else {
    System.out.println("没有读取到姓名");
}

// 读取浮点数（带输入校验）
System.out.println("请输入金额");
if (input.hasNextDouble()) {
    double j = input.nextDouble();
    System.out.println("金额：" + j);
} else {
    System.out.println("没有读取到金额");
}
```

# 选择结构

## if 语句

```java
// 单分支
if (true) {
    System.out.println("成立时执行");
}

// 双分支
if (true) {
    System.out.println("成立");
} else {
    System.out.println("不成立");
}

// 多分支
int score = 90;
if (score >= 90) {
    System.out.println("优秀");
} else if (score >= 80) {
    System.out.println("良好");
} else if (score >= 70) {
    System.out.println("中等");
} else if (score >= 60) {
    System.out.println("及格");
} else {
    System.out.println("不及格");
}
```

if 语句可以相互嵌套：

```java
int s = 9;
int sex = 0; // 0：男，-1：女

if (s < 10) {
    if (sex == 0) {
        System.out.println("男子组");
    } else {
        System.out.println("女子组");
    }
} else {
    System.out.println("out");
}
```

## switch 语句

switch 的表达式需要是整型或可自动转为整型的数据类型（如 char）。

```java
int i = 1;
switch (i) {
    case 1:
        System.out.println("周一");
        break;
    case 2:
        System.out.println("周二");
        break;
    // ...
    default:
        System.out.println("无效的日期");
}
```

# 循环结构

## while 循环

先判断条件，再执行。

```java
int a = 1;
while (a < 10) {
    System.out.println(a);
    a++;
}
```

## do-while 循环

先执行一次，再判断条件。

```java
int a = 1;
do {
    System.out.println(a);
    a++;
} while (a < 10);
```

## for 循环

```java
for (int a = 1; a < 10; a++) {
    System.out.println(a);
}
```

循环中可以使用 `break` 结束整个循环，`continue` 跳过当前次进入下一次。

# 类与对象

> 这部分是面向对象的起点，Java 里几乎所有东西都围着 `class` 转。

## 什么是类和对象

**类**：一类事物的统称，是抽象的概念，由思维产生。如：人、学生、汽车。

**对象**：实际存在的某个事物，能看得见摸得着。如：张三、李四。

类是对象的抽象，对象是类的实例化。

## 定义一个类

Java 使用 `class` 关键字定义类，类中包含属性（静态特征）和方法（动态特征）：

```java
public class Dog {
    // 静态特征：属性
    String name;    // 昵称
    String strain;  // 品种
    double weight;  // 体重

    // 动态特征：方法
    public void show() {
        System.out.println("我的狗的名字是：" + name + " 品种是：" + strain + " 体重是：" + weight + "KG");
    }
}
```

## 创建对象

```java
class Dog {
    String name;
    String strain;
    double weight;

    public void show() {
        System.out.println("我的狗的名字是：" + name + " 品种是：" + strain + " 体重是：" + weight + "KG");
    }
}

// 类名 对象名 = new 类名();
Dog dog = new Dog();

// 调用属性赋值
dog.name = "kobe";
dog.strain = "拉得不多";
dog.weight = 5.45;

// 调用方法
dog.show();
```

## 方法的定义与返回值

```text
public 返回值类型 方法名() {
    // 方法体
    return 表达式;
}
```

- 返回值类型决定了 `return` 后返回的值的类型，二者要匹配
- 没有返回值使用 `void`，不需要 `return` 语句
- `return` 是方法体的最后一条语句，只能返回一个值

```java
public class Student {
    String name;
    double score;

    public void study() {
        System.out.println(name + "的语文成绩为" + score);
    }

    public double sum() {
        double a = 350.00;
        return a * 1.2;  // 返回计算结果
    }
}
```

## 变量的作用域

### 全局变量（成员变量）

定义在类中，Java 会自动给初始值：`String` 为 `null`，整型为 `0`，浮点为 `0.0`，布尔为 `false`。在整个类中都可以使用。

### 局部变量

定义在方法或代码块中，Java 不会给初始值，只在定义该变量的方法或代码块中有效。

全局变量和局部变量可以重名，局部变量的调用优先级更高。

## 有参方法

```text
public 返回值类型 方法名(参数1类型 参数1名, 参数2类型 参数2名) {
    方法体;
}
```

调用时传入的是**实际参数**，定义时括号里的是**形式参数**，两者的数量、数据类型、顺序要一一对应。

```java
public class Cal {
    // 计算两个数的和，有返回值
    public int sum(int a, int b) {
        int c = a + b;
        return c;
    }

    // 计算两个数的差，无返回值
    public void gap(int a, int b) {
        int c = a - b;
        System.out.println(c);
    }
}

// 调用
Cal cal = new Cal();
int result = cal.sum(10, 20); // 传入实参
System.out.println(result);
```

## 包

包名全部小写，多级用 `.` 隔开，例如 `team.shiro.javaoop`。包可以解决文件名冲突，方便管理类和接口。

```java
// 声明包，写在第一行
package team.shiro;

// 导入包，写在 package 后
import java.util.*;
```

---

# 数组

## 数组是什么

用来存储一组相同数据类型的数据。

**特点**：能存储多个值，所有值数据类型相同，操作方便。

**相关概念**：

- **标识符**：数组的名称
- **数组元素**：存在数组中的每个数据
- **数组下标**：数据的位置编号，从 `0` 开始
- **数据类型**：数组可存放的数据类型

## 声明与使用

```java
// 声明方式
int[] a;
int b[];

// 声明时指定大小
int[] c = new int[5];

// 声明时直接赋值
int[] d = {1, 2, 3, 4, 5};

// 分配空间
a = new int[5];

// 通过下标存取元素
a[0] = 10;
a[0] = a[0] + 10;
```

## 数组遍历

数组遍历通过循环 + 下标实现，`数组名.length` 获取数组长度：

```java
import java.util.Scanner;

Scanner input = new Scanner(System.in);
double[] arr = new double[5];
double[] defaults = {12.5, 36.0, 18.8, 7.5, 20.0};
double sum = 0.0;

for (int i = 0; i < arr.length; i++) {
    System.out.println("请输入第 " + (i + 1) + " 笔金额");
    if (input.hasNextDouble()) {
        arr[i] = input.nextDouble();
    } else {
        arr[i] = defaults[i];
    }
    sum += arr[i];
}

System.out.println("序号\t\t金额");
for (int i = 0; i < arr.length; i++) {
    System.out.println((i + 1) + "\t\t" + arr[i]);
}
System.out.println("总金额\t" + sum);
```

## 数组排序

Java 提供了 `Arrays` 类，`sort()` 方法可对数组做升序排序：

```java
import java.util.Arrays;

int[] a = {4, 8, 2, 9, 1, 6, 7, 3};
Arrays.sort(a);
// 排序后：[1, 2, 3, 4, 6, 7, 8, 9]
```

## 最大值与最小值

将第一个值存入新变量，用循环逐个比较赋值：

```java
int[] arr = {8, 4, 2, 1, 23, 344, 12};
int min = arr[0];

for (int i = 1; i < arr.length; i++) {
    if (min > arr[i]) {
        min = arr[i];
    }
}
System.out.println(min); // 1
```

## 二维数组与多维数组

二维数组可以理解为“数组里再放数组”，常用于表格、矩阵、成绩单这类行列结构：

```java
int[][] scores = {
    {90, 88, 95},
    {76, 80, 72},
    {100, 98}
};

// 外层循环控制行，内层循环控制每一行中的列
for (int i = 0; i < scores.length; i++) {
    for (int j = 0; j < scores[i].length; j++) {
        System.out.print(scores[i][j] + "\t");
    }
    System.out.println();
}
```

需要注意：Java 的二维数组每一行长度可以不同，所以遍历列时应使用 `scores[i].length`，不要默认每一行都和第一行一样长。

三维数组就是在二维数组外再套一层，语法上可以继续嵌套：

```java
int[][][] data = {
    {
        {1, 2, 3},
        {4, 5, 6}
    }
};

System.out.println(data[0][1][2]); // 6
```

---

# 字符串操作

`String` 提供了一系列实用方法，`StringBuffer` 是它的增强版。

```java
String str = "张三";

// length()：计算字符串长度
System.out.println(str.length()); // 2

// equals()：比较两个字符串的值（== 比较的是内存地址）
String s1 = new String("man");
String s2 = new String("man");
System.out.println(s1.equals(s2)); // true
System.out.println(s1 == s2);      // false

// equalsIgnoreCase()：忽略大小写比较
"ABC".equalsIgnoreCase("abc"); // true

// toLowerCase() / toUpperCase()：转大小写
"ABc".toLowerCase(); // "abc"
"ABc".toUpperCase(); // "ABC"

// concat()：连接字符串（也可以用 +）
"kobe".concat("24"); // "kobe24"

// indexOf()：某字符第一次出现的位置
// lastIndexOf()：某字符最后一次出现的位置
String s = "aubdiubaiucb";
System.out.println(s.indexOf("b"));     // 1
System.out.println(s.lastIndexOf("b")); // 11

// substring(n, m)：截取字符串，n 开始，m 结束（不含）
s.substring(3, 5); // "di"

// split()：按指定字符拆分，返回数组
String s7 = "abc cde fgh ijk";
String[] arr = s7.split(" ");
// ["abc", "cde", "fgh", "ijk"]

// StringBuffer：String 的增强类，适合频繁修改字符串
StringBuffer sb = new StringBuffer("man");
System.out.println(sb); // man
```

---

# 构造方法

## 是什么

方法名和类名一致，没有返回值（也不写 `void`）的方法。在 `new` 对象时自动调用，用于初始化对象。

```text
// 语法
public 类名(参数) {
    // 初始化逻辑
}
```

## 特点

- 方法名与类名一致
- 没有返回值，没有 `return` 语句
- 可以有参数
- `new` 对象时自动调用
- Java 会默认生成一个无参构造方法，一旦自己写了构造方法，默认的就失效了，需要手动补回无参构造

```java
public class Car {
    String color;
    double speed;
    int num;

    // 无参构造（自己写了有参构造后需要手动补上）
    public Car() {
        System.out.println("空构造");
    }

    // 有参构造
    public Car(String color) {
        this.color = color;
    }

    public Car(String color, double speed) {
        this.color = color;
        this.speed = speed;
    }

    public Car(String color, double speed, int num) {
        this.color = color;
        this.speed = speed;
        this.num = num;
    }
}
```

## this 关键字

- `this` 在方法中表示当前正在调用该方法的对象
- 可以在方法内部访问对象的属性
- 可以调用当前类中的其他普通方法（直接调用或 `this.方法名()` 效果相同）
- 在构造方法中可以调用其他构造方法，但必须写在**第一行**：`this(参数列表)`

```java
public class Employee {
    String id;
    String name;
    int age;
    String phone;
    double sal;

    public void input() {
        System.out.println("姓名：" + this.name + " 电话：" + this.phone + " 工资：" + this.sal);
    }

    public void show() {
        input(); // 也可以写 this.input();
        System.out.println("工号：" + this.id);
    }

    public Employee() {}

    public Employee(String id) {
        this.id = id;
    }

    public Employee(String id, String name) {
        this(id);         // 调用上面的单参构造，必须第一行
        this.name = name;
    }

    public Employee(String id, String name, int age) {
        this(id, name);   // 链式调用构造方法
        this.age = age;
    }

    public Employee(String id, String name, int age, String phone, double sal) {
        this(id, name, age);
        this.phone = phone;
        this.sal = sal;
    }
}
```

## 方法重载

在一个类中，方法名相同但参数列表不同的多个方法称为**重载**。

**特点**：
- 同一个类中，多个方法名相同
- 参数列表不同（个数或数据类型不同）
- 与返回值类型和访问修饰符无关
- 构造方法和普通方法都可以重载

```java
public class Cal {
    // 重载：参数类型不同
    public void sum(int a, int b) {
        System.out.println(a + b);
    }

    public double sum(double a, double b) {
        return a + b;
    }

    // 重载：参数个数不同
    public void sum(int a, int b, int c) {
        System.out.println(a + b + c);
    }
}
```

---

# 访问修饰符

Java 提供四种访问权限修饰符，控制类、属性、方法的可见范围：

| 修饰符        | 同一个类 | 同一个包 | 不同包的子类 | 不同包的其他类 |
| ----------- | :----: | :----: | :--------: | :---------: |
| `public`    | ✓      | ✓      | ✓          | ✓           |
| `protected` | ✓      | ✓      | ✓          |             |
| 默认（不写）    | ✓      | ✓      |            |             |
| `private`   | ✓      |        |            |             |

---

# 封装

把类的信息隐藏在类内部，通过公共接口对外提供访问，并在方法中对数据进行合法性校验。

**步骤**：

1. 用 `private` 私有化属性
2. 提供 `public` 的 `get` / `set` 方法

```java
public class Student {
    private String name;
    private int age;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public int getAge() {
        return age;
    }

    public void setAge(int age) {
        if (age >= 0 && age <= 150) {
            this.age = age;
        } else {
            this.age = 0;
            System.out.println("请重新输入");
        }
    }
}
```

---

# static 关键字

`static` 可以修饰属性、方法、代码块、内部类，被修饰后属于类本身，而不是某个对象。

```java
public class Student {
    static String school; // 静态属性，所有对象共享
    int height;           // 普通属性，每个对象独有

    // 静态方法，通过类名直接调用
    public static void show() {
        // 静态方法中不能访问非静态属性或方法
        System.out.println(school);
    }

    // 静态代码块，类加载时自动执行一次
    static {
        System.out.println("Student 类加载");
    }

    // 静态内部类
    public static class Inner {
        int a;
    }
}

// 通过类名直接调用静态成员
Student.school = "北大";
Student.show();
```

---

# final 关键字

`final` 表示"不可改变"，可以修饰类、属性、方法：

- **修饰类**：该类不能被继承（叶子类）
- **修饰属性**：变为常量，声明时必须赋值
- **修饰方法**：该方法不能被子类重写

```java
public final class Teacher {
    final int MAX = 100;        // 常量，不可修改
    final char SEX = '男';

    public final void show() { // 不可被子类重写
        System.out.println("老师");
    }
}
```

---

# 继承

## 基本语法

使用 `extends` 关键字让子类继承父类，子类会拥有父类所有非私有的属性和方法。Java 只支持**单继承**（一个类只能有一个父类），所有类都直接或间接继承自 `Object`。

```java
// 父类
public class Pet {
    String name;
    int health;

    public void eat() {
        System.out.println(name + "在吃东西");
    }
}

// 子类
public class Dog extends Pet {
    String strain; // 子类特有属性

    public void work() {
        System.out.println(name + "能看大门"); // 继承自父类的属性
    }
}

// 使用
Dog dog = new Dog();
dog.name   = "kobe";
dog.health = 60;
dog.eat();   // 调用继承来的方法
dog.work();  // 调用子类自己的方法
```

## super 关键字

当子类与父类存在同名属性或方法时，可以用 `super` 明确访问父类的成员：

```java
public class Dog extends Pet {
    String name = "man"; // 子类同名属性

    public void work() {
        System.out.println(this.name);  // 先找子类：man
        System.out.println(super.name); // 找父类：kobe
    }
}
```

在子类构造方法中，可用 `super(参数)` 调用父类构造方法，**必须写在第一行**：

```java
public class Employee extends Person {
    double sal;

    public Employee(String name, int age, double sal) {
        super(name, age); // 调用父类构造方法，必须第一行
        this.sal = sal;
    }

    public void work() {
        super.show(); // 调用父类方法
        System.out.println("工资：" + this.sal);
    }
}
```

## 方法重写

子类对父类方法的重新实现，让子类在继承父类结构的同时拥有自己的行为。

**规则**：
- 方法名、参数列表与父类一致
- 访问修饰符不能比父类更严格（可以更宽松）
- 方法体不同

```java
public class Person {
    public void run() {
        System.out.println("人类会跑步");
    }
}

public class Employee extends Person {
    @Override
    public void run() {       // 重写父类方法
        System.out.println("员工竞走");
    }
}
```

---

# 抽象类

## 是什么

用 `abstract` 修饰的类叫**抽象类**，用 `abstract` 修饰的方法叫**抽象方法**。

**特点**：
- 抽象方法只有声明，没有方法体
- 抽象方法必须定义在抽象类中
- 抽象类中可以有普通方法
- 抽象类**不能被实例化**（不能 `new`）
- 子类继承抽象类，必须重写所有抽象方法，否则子类也要声明为抽象类

```java
public abstract class Users {
    // 抽象方法，没有方法体
    public abstract void show();

    // 普通方法，可以有实现
    public void hello() {
        System.out.println("你好");
    }
}

// 子类必须实现所有抽象方法
public class BookUsers extends Users {
    @Override
    public void show() {
        System.out.println("书籍用户");
    }
}

// 使用
// Users u = new Users(); // 错误，抽象类不能实例化
BookUsers bu = new BookUsers();
bu.show();
```

---

# 多态

## 是什么

同一个方法调用，因对象类型不同而产生不同的结果，就是**多态**。

多态建立在**继承**和**方法重写**的基础上，通过**父类引用指向子类对象**来实现。

## 向上转型（子类 → 父类）

```java
class Pet {
    public void eat() {
        System.out.println("宠物吃东西");
    }

    public void run() {
        System.out.println("宠物会跑");
    }
}

class Dog extends Pet {
    @Override
    public void eat() {
        System.out.println("狗吃东西");
    }

    public void work() {
        System.out.println("狗能看大门");
    }
}

// 父类引用 = 子类对象（自动转型）
Pet p = new Dog();
p.eat(); // 调用的是 Dog 重写后的 eat()
p.run();

// 通过父类引用调用不到子类特有的方法
// p.work(); // 错误，Pet 中没有 work()
```

## 向下转型（父类 → 子类）

父类引用转回子类类型，需要强制转换，转换失败会抛出 `ClassCastException`：

```java
class Pet {
}

class Dog extends Pet {
    public void work() {
        System.out.println("狗能看大门");
    }
}

Pet p = new Dog();

// 强制转换，大转小
Dog d = (Dog) p;
d.work(); // 可以调用 Dog 的特有方法
```

## instanceof 运算符

在强制转换前，用 `instanceof` 判断对象的实际类型，保证代码健壮性：

```java
class Pet {
}

class Dog extends Pet {
    public void work() {
        System.out.println("狗能看大门");
    }
}

class Cat extends Pet {
    public void play() {
        System.out.println("猫会玩耍");
    }
}

Pet p = new Dog();

if (p instanceof Dog) {
    Dog dog = (Dog) p;
    dog.work();
} else if (p instanceof Cat) {
    Cat cat = (Cat) p;
    cat.play();
}
```

## 多态的三种体现

**1. 父类引用指向子类对象**

```java
class Person {
    public void show() {
        System.out.println("Person");
    }
}

class Student extends Person {
    @Override
    public void show() {
        System.out.println("Student");
    }
}

class Teacher extends Person {
    @Override
    public void show() {
        System.out.println("Teacher");
    }
}

Person p = new Student();
p.show(); // 执行 Student 的 show()

p = new Teacher();
p.show(); // 执行 Teacher 的 show()
```

**2. 父类类型作为方法参数**

形参声明为父类类型，传入子类对象，方法内部自动调用对应的重写方法：

```java
class Pet {
    public void eat() {
        System.out.println("宠物吃东西");
    }
}

class Dog extends Pet {
    @Override
    public void eat() {
        System.out.println("狗吃东西");
    }
}

class Cat extends Pet {
    @Override
    public void eat() {
        System.out.println("猫吃东西");
    }
}

public class Master {
    // 形参为父类，实参传子类对象
    public void food(Pet pet) {
        pet.eat();
    }
}

Master ma = new Master();
ma.food(new Dog()); // 匿名对象
ma.food(new Cat());
```

**3. 父类类型作为返回值**

方法声明返回父类类型，实际返回子类对象：

```java
class Pet {
    public void eat() {
        System.out.println("宠物吃东西");
    }
}

class Dog extends Pet {
    @Override
    public void eat() {
        System.out.println("狗吃东西");
    }
}

public class PetAgree {
    public Pet buy() {
        return new Dog(); // 返回子类对象
    }
}

PetAgree pa = new PetAgree();
Pet pet = pa.buy();
pet.eat(); // 调用 Dog 的 eat()
```

## Object 数组

`Object` 是所有类的父类，所以 `Object[]` 可以保存不同类型的引用数据，也可以保存自动装箱后的基本类型：

```java
Object[] arr = new Object[4];
arr[0] = "张三";
arr[1] = 18;       // int 自动装箱为 Integer
arr[2] = 98.5;
arr[3] = new Dog();

for (Object item : arr) {
    System.out.println(item);
}
```

不过 `Object[]` 会丢失具体类型信息，取出后如果要调用子类特有方法，通常需要配合 `instanceof` 判断后再强制转换。

# 接口

## 是什么

接口是一种“规则”或“能力”的定义，只规定应该有什么方法，不关心具体怎么实现。类通过 `implements` 实现接口，实现后必须重写接口中的抽象方法，否则这个类也要声明为抽象类。

```java
public interface USB {
    void work();
}

public class MouseUSB implements USB {
    @Override
    public void work() {
        System.out.println("鼠标开始工作");
    }
}

public class DiskUSB implements USB {
    @Override
    public void work() {
        System.out.println("U 盘开始工作");
    }
}
```

使用接口类型接收不同实现类对象，就能形成面向接口的多态：

```java
USB usb = new MouseUSB();
usb.work();

usb = new DiskUSB();
usb.work();
```

这里左边的 `USB` 决定能调用什么方法，右边的实际对象决定方法执行结果。

## 接口的特点

- 接口使用 `interface` 定义
- 类使用 `implements` 实现接口
- 一个类可以实现多个接口，用逗号隔开
- 接口不能直接 `new` 对象
- 接口可以继承接口，并且支持多继承
- 接口中的抽象方法默认是 `public abstract`
- 接口中的常量默认是 `public static final`

```java
public interface SuperA {
    void a();
}

public interface SuperB {
    void b();
}

public interface SuperC {
    void c();
}

public class ImpClass implements SuperA, SuperB, SuperC {
    @Override
    public void a() {
        System.out.println("实现 a");
    }

    @Override
    public void b() {
        System.out.println("实现 b");
    }

    @Override
    public void c() {
        System.out.println("实现 c");
    }
}
```

## 接口表示能力

一个类实现某个接口，就代表它具备接口中规定的能力。比如业务员会讲业务，程序员会写程序，一个软件工程师可以同时具备这两种能力：

```java
public interface Person {
    void setName(String name);
    String getName();
}

public interface BizAgent extends Person {
    void speakWork();
}

public interface Programmer extends Person {
    void writeWork();
}

public class SoftEngineer implements BizAgent, Programmer {
    private String name;

    @Override
    public void setName(String name) {
        this.name = name;
    }

    @Override
    public String getName() {
        return name;
    }

    @Override
    public void speakWork() {
        System.out.println("工程师可以讲解业务");
    }

    @Override
    public void writeWork() {
        System.out.println("工程师可以写程序");
    }
}
```

接口的意义不只是“多写几个方法”，更重要的是降低耦合。调用方只依赖接口，不依赖具体实现类，将来更换实现时，调用方代码通常不需要改。

## 接口作为方法参数

接口常用来定义协作规则。下面的打印机不关心具体纸张和墨盒是哪一个类，只要求它们遵守 `Paper` 和 `InkBox` 这两个接口：

```java
public interface Paper {
    String getPaperSize();
}

public interface InkBox {
    String getInkBoxType();
}

public class A4Paper implements Paper {
    @Override
    public String getPaperSize() {
        return "A4";
    }
}

public class ColorBox implements InkBox {
    @Override
    public String getInkBoxType() {
        return "彩色";
    }
}

public class Print {
    public void input(Paper paper, InkBox inkBox) {
        System.out.println("使用" + paper.getPaperSize() + "大小的纸打印" + inkBox.getInkBoxType() + "色的内容");
    }
}

Print printer = new Print();
Paper paper = new A4Paper();
InkBox inkBox = new ColorBox();
printer.input(paper, inkBox);
```

这样以后要新增 `A3Paper`、`BlackBox`，只要实现接口即可，`Print` 类不需要重写。

---

# 异常处理

## 什么是异常

异常是程序运行过程中出现的不正常情况，例如输入类型不匹配、数组下标越界、空指针、整数除零等。异常如果不处理，程序可能会直接中断。

```java
Scanner input = new Scanner(System.in);
System.out.println("请输入两个整数");

int a = input.nextInt();
int b = input.nextInt();
System.out.println(a / b); // b 为 0 时会出现 ArithmeticException
```

注意：如果是 `double` 类型除以 `0`，Java 通常会得到 `Infinity` 或 `NaN`，不会像整数除零那样抛出 `ArithmeticException`。

## try-catch-finally

把可能出错的代码放进 `try`，异常出现后由 `catch` 捕获处理，`finally` 中的代码一般用于收尾工作，无论是否发生异常都会尝试执行。

```java
import java.util.InputMismatchException;
import java.util.Scanner;

Scanner input = new Scanner(System.in);

try {
    System.out.println("请输入第一个整数");
    int a = input.nextInt();

    System.out.println("请输入第二个整数");
    int b = input.nextInt();

    System.out.println("商：" + a / b);
} catch (InputMismatchException e) {
    System.out.println("输入的不是整数");
} catch (ArithmeticException e) {
    System.out.println("除数不能为 0");
} catch (Exception e) {
    System.out.println("出现未知错误：" + e.getMessage());
} finally {
    input.close();
    System.out.println("计算结束");
}
```

多个 `catch` 同时存在时，应把更具体的异常写在前面，把父类异常 `Exception` 写在后面，否则前面的父类会先把所有异常都接住。

## throws 与 throw

`throws` 写在方法声明后面，表示这个方法可能把异常交给调用者处理；`throw` 写在方法内部，用来主动抛出一个异常对象。

```java
public static int divide(int a, int b) throws ArithmeticException {
    if (b == 0) {
        throw new ArithmeticException("除数不能为 0");
    }
    return a / b;
}

public static void main(String[] args) {
    try {
        System.out.println(divide(10, 0));
    } catch (ArithmeticException e) {
        System.out.println(e.getMessage());
    }
}
```

初学阶段更推荐先学会在合适的位置用 `try-catch` 处理异常，不要随意把异常一直向外抛。

## 自定义异常

自定义异常类通常继承 `Exception` 或 `RuntimeException`。继承 `Exception` 的异常属于受检异常，调用者必须处理或继续声明抛出。

```java
public class MyException extends Exception {
    public MyException() {
    }

    public MyException(String message) {
        super(message);
    }
}

public static void checkAge(int age) throws MyException {
    if (age < 0 || age > 150) {
        throw new MyException("年龄不合法");
    }
}
```

自定义异常的作用是把业务规则表达清楚。相比直接抛出普通 `Exception`，自定义异常能让调用者更准确地知道哪里出了问题。

## finally、return 与 System.exit

正常情况下，即使 `try` 或 `catch` 中执行了 `return`，`finally` 仍然会先执行，然后方法才真正返回。但如果执行了 `System.exit(0)` 强制退出 JVM，后续代码和 `finally` 都不会再执行。

```java
public static int test() {
    try {
        return 1;
    } finally {
        System.out.println("finally 仍然会执行");
    }
}
```

可以简单记为：`System.exit()` 会直接结束程序；`finally` 负责收尾；`return` 负责结束当前方法。

