---
title: SQL基础
date: 2025-09-18
description: 'SQL基础语法'
image: ''
tags: ["基础教程","SQL","数据库"]
category: '基础教程'


---
> 本篇文章是基于SQLserver编写的。

# 开始前的准备

## 什么是SQL？
简单来说，SQL就是访问和处理关系数据库的计算机标准语言。也就是说，无论用什么编程语言（Java、Python、C++……）编写程序，只要涉及到操作关系数据库，都必须通过SQL来完成。
所以，现代程序离不开关系数据库，要使用关系数据库就必须掌握SQL。
## 所需的软件
安装`SQLserver`与`Navicat`。   
安装完且配置好后在`控制台`输入：
```cmd
net start mssqlserver 
//启用SQLserver服务
```
如需停止输入：
```cmd
net stop mssqlserver
```
在Navicat中`连接->SQL server->测试链接`，如果出现如下图片则代表链接成功:
![](https://cdn.jsdelivr.net/gh/luojisama/pic_bed@main/img/20250918144234.png)

# 关系模型
## 基本概念
关系模型用二维表表示实体集，利用公共属性实现实体之间的联系。   
## 关系
关系是行与列交叉形成的二维表，表中的一行称为元组，一列称为属性，每个属性有一个取值范围，称为属性域。
## 关系的实质
1. 每一行中的所有数据都是同一类型，来自同一个域；
2. 每一列都有唯一的列名；
3. 列在表中的顺序无关紧要；
4. 表中的任意两行不能完全相同；
5. 行在表中的顺序也无关紧要；
6. 行与列的交叉点必须是单值。

## 创建
创建数据库:
```sql
CREATE DATABASE 数据库名;
```

## 约束

```sql
CREATE TABLE dept(
		dep_no int PRIMARY KEY IDENTITY(1,1),
		dep_name VARCHAR(20) NOT NULL,
		dep_loc VARCHAR(20) UNIQUE
);

CREATE TABLE emp (
	    emp_no VARCHAR(20)NOT NULL,
	    emp_name VARCHAR(20) NOT NULL,
	    PRIMARY KEY(emp_no, emp_name),
	    emp_sex CHAR(2) NOT NULL DEFAULT '女',
	    emp_age INT CHECK (Age >= 18),
	    dep_no INT,
	    CONSTRAINT FK_emp_dept FOREIGN KEY (dep_no) REFERENCES dept(dep_no)
);
```
以下语句中第一行为创建时的语法，第二行为添加时的语法。
### 主键约束
```sql
dep_no int PRIMARY KEY

ALTER TABLE dept 
ADD CONSTRAINT PK_dept PRIMARY KEY(dep_no)
```
主键用于唯一标识表中的每个元组，且在关系数据库中每个关系必须具备主键，主键值唯一且不能为空。由于主键的作用十分重要，如何选取主键会对业务开发产生重要影响。如果我们以学生的身份证号作为主键，似乎能唯一定位记录。然而，身份证号也是一种业务场景，如果身份证号升位了，或者需要变更，作为主键，不得不修改的时候，就会对业务产生严重影响。  
所以，选取主键的一个基本原则是：不使用任何业务相关的字段作为主键。  因此，身份证号、手机号、邮箱地址这些看上去可以唯一的字段，均不可用作主键。
### 联合主键
```sql
PRIMARY KEY(emp_no, emp_name)

ALTER TABLE emp 
ADD CONSTRAINT PK_emp PRIMARY KEY(emp_no, emp_name)
```
关系数据库实际上还允许通过多个字段唯一标识记录，即两个或更多的字段都设置为主键，这种主键被称为联合主键。  
对于联合主键，允许一列有重复，只要不是所有主键列都重复即可。
## 外键约束
外键并不是通过列名实现的，而是通过定义外键约束实现的：
```sql
CONSTRAINT FK_emp_dept FOREIGN KEY (dep_no) REFERENCES dept(dep_no)

ALTER TABLE emp 
ADD CONSTRAINT FK_emp_dept FOREIGN KEY (dep_no) REFERENCES dept(dep_no)
```
其中`FK_emp_dept`可以为任意，但为了区分一般采用`FK_xx_xx`的命名格式，`FOREIGN KEY (dep_no)`指定了`dep_no`为外键，`REFERENCES dept(dep_no)`指定了这个外键将关联到`dept`列表的`dep_no`列。
## 非空约束
```sql
dep_name VARCHAR(20) NOT NULL
```
在字段末尾加上`NOT NULL`即可创建非空约束，表中该字段的值均不可为空。
## 唯一约束
```sql
dep_loc VARCHAR(20) UNIQUE

ALTER TABLE dept 
ADD CONSTRAINT UQ_dep_loc UNIQUE (dep_loc)
```
末尾添加`UNIQUE`可创建唯一约束，该字段不可重复。
## 默认值
```sql
emp_sex CHAR(2) NOT NULL DEFAULT '女'

ALTER TABLE emp 
ADD CONSTRAINT DF_emp_sex DEFAULT '女' FOR emp_sex
```
末尾添加`DEFAULT ''`可添加默认值，单引号中可任意修改。
## 自定义约束
```sql
emp_age INT CHECK (Age >= 18)

ALTER TABLE emp 
ADD CONSTRAINT CHK_emp_age CHEAK (age >= 18)
```
末尾添加`CHEAK ()`可创建自定义约束，括号中可自定义，以限制输入的值。

## 自增
```sql
	dep_no int PRIMARY KEY IDENTITY(1,1)
	
	--第一个为起始值，第二个为增加值
```
自增约束必须在创建时设置，无法在后续添加。
# 查询
假定有一个stu表，其中的值如下：

| s_id | s_name | s_sex | s_age | s_class |
| ---- | ------ | ----- | ----- | ------- |
| 1    | 张三     | 男     | 15    | 301     |
| 2    | 李四     | 男     | 16    | 301     |
| 3    | 王五     | 女     | 15    | 302     |
| 4    | 赵六     | 男     | 14    | 202     |

## 基本查询
查询是从数据库中将符合条件的数据检索出来。查询出来的表是虚拟表，数据存储在数据表中。
```sql
SELECT * FROM stu;
```
`select`表示执行一次查询，`*`表示所有列，`FROM`表示要从哪个表查询。  
运行会输出`stu`表中所有数据。
`SELECT`语句并不要求`FROM`子句，例如：
```sql
SELECT 10+20
```
执行可以得到表达式的结果。
## 投影查询
```sql
SELECT s_id,s_name from stu
```
投影查询只返回查询的列，同样可以使用`WHERE`。
## 条件查询
```sql
SELECT * FROM stu WHERE s_sex = '男'
```
`where`表示查询表的条件，该语句运行会输出`stu`表中所有`s_sex`为`男`的数据。
表达式可以与逻辑运算符结合使用：
```sql
SELECT * FROM stu WHERE s_sex = '男' and s_class = '301'
```
常用的条件表达式：
> 使用`>`,`>=`,`<`,`<=`判断大小   
> 使用`=`判断等于   
> 使用`<>`判断不等与   
> 使用`LIKE''`判断相似，`%`表示任意字符，`_`表示单个字符   
> `BETWEEN...AND...`表示在...之间   
> `IN()`表示在集合内   
> `IS NULL`查询空值   
> `any`满足任意一个值则外层条件成立   
> `all`满足所有值外层条件成立   
> `exists`内层存在数据返回true，执行外层；反之返回false，外层不执行。   
## 去重查询
在一些非唯一限制的值中，有时查询需要去重，可以使用`DISTINCT`。

```sql
SELECT DISTINCT s_age FROM stu
```
## 排序
```sql
SELECT s_id,s_age FROM stu ORDER BY s_age
```
`ORDER BY`默认为升序(`ASC`)，如需使用降序(`DESC`)，须在后指定。
## 聚合函数
SQLSERVER中有如下聚合函数：

| 函数名   | 说明         |
| ----- | ---------- |
| COUNT | 统计非空行数量    |
| SUM   | 求和         |
| AVG   | 求平均值       |
| MAX   | 取最大值       |
| MIN   | 取最小值       |
| ROUND | 对结果保留任意位小数 |
```sql
SELECT COUNT(*) AS 人数 FROM stu
```
## 分组
```sql
SELECT AVG(s_age) AS 平均年龄 FROM stu GROUP BY s_calss
```
常常与聚合函数搭配一起使用。
## 筛选
```sql
SELECT s_sex,count(*) FROM stu GROUP BY s_sex HAVING>1
```
## 分页
```sql
SELECT * FROM stu ORDER BY stu_id OFFSET 0 ROWS FETCH NEXT 5 ROWS ONLY
```
`OFFSET 0 ROWS`表示跳过0行，`FETCH NEXT 5 RWOS ONLY`表示只取后五行。
## 多表
### 内连接
通过两表间的主外键关系
```sql
Select * from 表名 表a inner join 表b on 表a.公共属性=表b.公共属性
```
### 外连接
以前表为主，查询满足条件的数据
```sql
Select * from 表名 表a left/right join 表b on 表a.公共属性=表b.公共属性
```
### 交叉连接
用表1乘表2的每一行（取笛卡尔积）
```sql
select * from 表a cross join 表b
```
### 等值连接
```sql
select * from 表a join 表b on 表a.字段a=表b.字段b
```
## 子查询
在一个查询中嵌套另一个查询语句
### 在where中使用
#### 单值子查询
```sql
select * from 表名 where 条件1 (select * from 表名 where 条件2)
```
#### 多值子查询
```sql
select * from 表名 where 条件1 运算符 (select * from 表名 where in (条件2) )
```
### 在from中使用
```sql
select * from (select * from 表名 where 条件2) 表别名
```

# 表数据修改
## SQL分类
### DDL
数据定义语言
create alter drop truncate
### DML
数据操作语言
insert update delete
### DQL
数据查询语言
select
### DCL
数据控制语言
grant revoke
## 运算符
### 算数运算符
`+` `-` `/` `*` `%`
### 赋值运算符
`=`
### 逻辑运算符
`and` `or` `not`
### 比较运算符
`=` `>` `>=` `<` `<=` `<>`

## 增
```sql
 INSERT INTO 表名(列名) VALUES(值)
```
列名不填默认所有列。
多行插入：
```sql
 INSERT INTO 表名(列名) 
 VALUES(值1)
	   (值2)
	   (值3)
```
## 删
```sql
DELETE FROM 表名 WHERE 条件
```

## 改
```sql
UPDATE 表名 SET 字段=值... WHERE 条件
```
条件为空默认为表中所有数据

# 表结构修改
## 重命名
```sql
EXCE SP_RENAME '旧表名','新表名'

EXCE SP_RENAME '表名.旧列名','新列名'
```
## 添加
```sql
ALTER TABLE 表名 ADD 列名 数据类型 约束
```
## 修改
```sql
ALTER TABLE 表名 ALTER COLUMN 列名 新数据类型
```
## 删除
```sql
ALTER TABLE 表名 DROP COLUMN 列名

DROP TABLE 表名

TRUNCATE TABLE 表名
--重构表，删除表结构与数据，然后重构表
```
# 事务
在 SQL Server 中，事务（Transaction）就是一个工作单元，保证一组 SQL 操作要么全部成功提交，要么全部失败回滚，从而确保数据的一致性和完整性。
## 四大特性（ACID）
- **原子性 (Atomicity)**
    - 事务中的所有操作要么全部成功，要么全部失败。
    - 如果执行过程中出错，系统会回滚到事务开始前的状态。
    - 例子：银行转账，扣款和入账必须同时完成，否则全部撤销。
    
- **一致性 (Consistency)**
    - 事务执行前后，数据库必须从一个一致状态转变到另一个一致状态。
    - 保证约束、规则不被破坏。
    - 例子：如果约束规定 A+B=100，那么事务修改 A 时，B 也必须调整以保持总和为 100。
    
- **隔离性 (Isolation)**
    - 并发事务之间互不干扰。
    - 不同事务的操作在逻辑上是独立的。
    - 数据库通过锁机制或 MVCC（多版本并发控制）来实现。
    - 例子：两个用户同时转账，不能互相影响导致数据错误。
    
- **持久性 (Durability)**
    - 一旦事务提交，其结果必须永久保存，即使系统故障也不能丢失。
    - 通常依赖 **Redo Log** 和备份机制来保证。
    - 例子：转账成功后，即使服务器宕机，数据也必须保持已更新状态。
## 事务的基本操作
- 开启事务
```sql
	begin transaction 
	begin tran
```
- 提交事务
自动提交（默认）
手动提交（开启事务自动变成手动提交）
```sql
	commit transaction 
	commit tran
```
- 回滚事务
```sql
	rollback transaction 
	rollback
```
## 隔离
修改隔离级别的方法：
```sql
	set transaction isolattion level 隔离级别;
```
查看隔离级别：
```sql
	DBCC useroptions;
```

| 类型   | 值            |        | 性能   |
| ---- | ------------ | ------ | ---- |
| 未提交读 | UNMOMMITTED  | 脏读     | 性能最高 |
| 已提交读 | COMMITTED    | 不可重复读  |      |
| 可重复读 | REPEATABLE   | 幻读     |      |
| 序列化  | SERIALIZABLE | 防止所有问题 | 性能最低 |
# 视图
视图是一张虚拟的表，基于原表的蓄奴表，一旦原表数据发生变化，虚拟表中也会变化。   
## 创建视图
```sql
CREATE VIEW 视图名称
AS 
查询语法 
```
## 修改视图
```sql
ALTER VIEW 视图名称
AS 
新查询语法
```
## 查询视图
与查询表完全一致，只需要将表名替换为视图名。
## 视图增删改
更新数据，插入数据，删除数据，删除视图都同上，只需要修改表名。   
## 以下情况无法更新视图
1. 包含聚合函数
2. 包含去重查询
3. 包含分页查询
4. 包含分组查询
5. 包含多表连接查询
6. 包含子查询
