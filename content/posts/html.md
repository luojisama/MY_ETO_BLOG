---
title: HTML/HTML
date: 2026-01-16
description: HTML基础教程
image: ""
tags: ["基础教程","HTML","前端"]
category: 基础教程

---
> 过于久远，此文是提供当时学习笔记，由`Gemini-3-Pro`整理而成
# HTML

## 第一章 网页基础

### 企业应用软件的演变
- **主机/亚终端的模式**
- **客户机/服务器模式** (Client/Server)
- **浏览器/服务器模式** (Browser/Server)

### HTML 概述
- **定义**: 超文本标签语言 (HyperText Markup Language)
- **性质**: HTML 不是一种编程语言，而是一种标记语言。
- **超文本**: 指页面包含图片、链接、甚至音乐、程序等非文字元素。
- **标签**: 用于描述网页内容和结构的标记。
- **结构**: 包括“头”部分 (`head`) 和“主体”部分 (`body`)。

### 网页的基本元素
- 文本
- 图片和动画
- 声音和视频
- 超链接
- 导航栏
- 表单

### 标签（元素）分类
1. **按照显示划分**:
   - **块级元素**: 显示为“块”状，前后自动换行（隔一行）。
   - **行级元素（内嵌元素）**: 按行逐一显示，不换行。
2. **按照代码结构划分**:
   - **双标签**: `<tag>...</tag>`
   - **单标签**: `<tag />`

### HTML 基础
- **HTML5**: 2014年10月29日发布。
- **HTML5 的优势**:
    - 新的简化的字符集声明
    - 新的简化的 DOCTYPE
    - 简单而强大的 API
    - 以浏览器原生能力替代复杂的 JavaScript 代码
- **浏览器支持**: 支持所有的主流浏览器。

### HTML5 文档结构

```html
<!DOCTYPE html> <!-- 文档类型声明，位于文档第一行，标明使用的规范 -->
<html>          <!-- 根标签，表示HTML文档的开始 -->
    <head>      <!-- 头标签 -->
        <meta charset="UTF-8"> <!-- 文档编码 -->
        <title>文档标题</title> <!-- 定义文档的标题 -->
    </head>
    <body>      <!-- 主体标签，里面放要显示的内容 -->
        页面内容
    </body>
</html>
```

### HTML5 语句规范
**基本结构**: `<标签 属性1="属性值" 属性2="属性值2">元素内容</标签>`

**规范**:
1. 标签名和属性建议都用**小写字母**。
2. HTML 的标签可以嵌套，但不允许**交叉**。
3. HTML 标签中的一个单词不能分两行写。
4. 属性值都要用**英文状态下的双引号**括起。
5. HTML 源文件中的换行符、回车符和空格在显示效果中通常是无效的（多个空格会被合并）。

**代码缩进**:
使用标签时首尾对齐，内部的内容向右缩进。

---

## 第二章 常用标签

### 块级标签

#### 标题标签 (双标签)
`<h1>` 到 `<h6>`，共有属性 `align` (left, center, right)。

```html
<h1>一级标题</h1>
<h2>二级标题</h2>
<h3>三级标题</h3>
<h4>四级标题</h4>
<h5>五级标题</h5>
<h6>六级标题</h6>
```

#### 段落标签 (双标签)
```html
<p>内容</p>
```

#### 水平线标签 (单标签)
```html
<hr />
```

#### 换行标签 (单标签)
```html
<br />
```

### 列表标签

#### 有序列表 (`<ol>`)
- `type`: 符号类型
    - `1`: 阿拉伯数字 (默认)
    - `A`: 大写英文字母
    - `a`: 小写英文字母
    - `I`: 罗马数字
    - `i`: 小写罗马数字
- `start`: 起始值 (必须是正数，默认1)
- `reversed`: 是否倒序

```html
<ol type="a" start="4" reversed>
   <li>有序列表项1</li>
</ol>
```

#### 无序列表 (`<ul>`)
- `type`: 符号类型
    - `disc`: 圆点 (默认)
    - `circle`: 圆圈
    - `square`: 方块

```html
<ul type="circle">
    <li>无序列表1</li>
</ul>
```

#### 自定义列表 (`<dl>`)
一个标题可以对应多个描述。

```html
<dl>
     <dt>标题1</dt>
     <dd>标题1的描述1</dd>
</dl>
```

---

## 第三章 表单

### 表单概述
- **定义**: 在网页中创建的，提供用户输入数据然后提交数据的图形用户界面。

### 表单组成
```html
<form action="提交数据的目标路径" method="get/post">
    <!-- 表单元素 -->
</form>
```
- **`action`**: 指定数据提交的 URL。
- **`method`**: 指定提交方式。
    - `get`: 数据会加在 URL 后，安全性低，效率高。
    - `post`: 以数据流提交，安全性高，效率低。

### 表单元素 (Input Controls)

#### 基本输入方式
| 类型 | 代码示例 |
| --- | --- |
| 文本框 | `<input type="text"/>` |
| 密码框 | `<input type="password"/>` |
| 隐藏框 | `<input type="hidden"/>` |
| 文件框 | `<input type="file"/>` |

#### 按钮
- **单选按钮 (`radio`)**: 同一组名称必须相同。
  ```html
  性别：
  <input type="radio" name="sex" /> 男
  <input type="radio" name="sex" /> 女
  ```
- **多选按钮 (`checkbox`)**:
  ```html
  喜欢的水果：
  <input type="checkbox"/> 西瓜
  <input type="checkbox"/> 苹果
  ```
- **操作按钮**:
  ```html
  <!-- 提交按钮 -->
  <input type="submit" value="登录"/>
  <!-- 重置按钮 -->
  <input type="reset" value="清空"/>
  <!-- 普通按钮 -->
  <input type="button" value="下一步"/>
  <!-- 图片按钮 -->
  <input type="image" src="图片路径"/>
  ```

#### 下拉列表 (`select`)
```html
<select>
    <option>2000</option>
    <option>2001</option>
    <!-- ... -->
</select>
```

#### 多行文本框 (`textarea`)
```html
<textarea rows="行数" cols="列数">
   多行文本内容
</textarea>
```

#### HTML5 新增类型
| 类型 | 代码示例 | 描述 |
| --- | --- | --- |
| 日期 | `<input type="date" />` | 年月日 |
| 月份 | `<input type="month" />` | 年月 |
| 周 | `<input type="week" />` | 第几年第几周 |
| 时间 | `<input type="time" />` | 时分 |
| 本地时间 | `<input type="datetime-local" />` | 年月日时分 |
| 颜色 | `<input type="color" value="#00BBFF" />` | 颜色选择器 |
| 搜索 | `<input type="search"/>` | 搜索关键词 |

#### Datalist
定义输入框的输入选项列表，实现自动匹配。
```html
<input type="text" list="browsers"/>
<datalist id="browsers">
    <option>Chrome</option>
    <option>Firefox</option>
</datalist>
```

### 表单元素属性
| 属性 | 描述 |
| --- | --- |
| `name` | 控件名称 (英文) |
| `value` | 输入的值 |
| `maxlength` | 允许输入的最大字符数 |
| `placeholder` | 输入框中的提示内容 |
| `required` | 内容不能为空，为空时提示 |
| `checked` | 默认选中 (单选/多选) |
| `readonly` | 只读 |
| `disabled` | 禁用 |
| `autofocus` | 自动获取焦点 |
| `list` | 指定输入候选值列表 |

---

## 第四章 CSS 基础

### CSS 简介
1. **定义**: 层叠样式表 (Cascading Style Sheets)。
2. **作用**: 美化网页，定位布局。

### CSS 分类

#### 1. 行内样式 (内嵌/内联样式)
- **定义**: 直接在标签中使用 `style` 属性来指定样式。
- **作用范围**: 只对当前标签生效。
- **语法**:
  ```html
  <标签名 style="属性名:属性值; 属性名:属性值;">内容</标签名>
  ```

#### 2. 内部样式
- **定义**: 在 `<head>` 标签中使用 `<style>` 标签来指定样式。
- **作用范围**: 只对当前页面内的所有匹配标签生效。
- **语法**:
  ```html
  <style type="text/css">
      选择器 {
          属性名: 属性值;
          属性名: 属性值;
      }
  </style>
  ```

#### 3. 外部样式
- **定义**: 把 CSS 代码写在一个单独的 `.css` 文件中，在 HTML 文件中通过 `<link>` 标签引入。
- **作用范围**: 可以被多个 HTML 页面共享。
- **语法**:
  ```html
  <head>
      <link href="css/style.css" type="text/css" rel="stylesheet"/>
  </head>
  ```

### 样式表的优先级
**原则**: 就近原则（谁离标签近，谁生效）。

通常情况下的优先级：
**行内样式 > 内部样式 = 外部样式**

> 注：内部样式和外部样式的优先级取决于它们在 HTML 代码中的加载顺序。代码从上往下执行，后加载的会覆盖先加载的。

### CSS 属性单位

#### 长度单位
- **px**: 像素
- **%**: 百分比

#### 色彩单位
1. **英文单词**: 如 `red`, `blue`, `green`。
2. **RGB**: `rgb(R, G, B)`
   - R, G, B 分别代表红、绿、蓝。
   - 取值范围：0-255 或 0%-100%。
3. **十六进制**: `#RRGGBB`
   - 如 `#FF0000` (红色)。

### CSS 的基本特征
1. **层叠性**: 当多个样式作用于同一个元素时，样式会叠加。
2. **继承性**: 子标签会继承父标签的某些样式（如文本颜色、字体等），但并不是所有样式都会继承。

---

## 第五章 CSS 选择器

### 1. 标签选择器
直接使用 HTML 标签名作为选择器。
```css
div {
    color: red;
}
```

### 2. 类选择器 (Class Selector)
先为 HTML 标签定义 `class` 属性，再通过 `.类名` 选择。
```css
.name {
    background-color: pink;
}
```
```html
<p class="name">测试段落</p>
```

### 3. ID 选择器
先为 HTML 标签定义 `id` 属性（ID 必须唯一），再通过 `#ID名` 选择。
```css
#temp {
    color: orange;
}
```
```html
<p id="temp">测试段落</p>
```

### 4. 全局选择器
对页面中所有的标签应用样式。
```css
* {
    margin: 0;
    padding: 0;
}
```

### 5. 并集选择器
多个选择器共同使用相同的样式，中间用逗号 `,` 分隔。
```css
h1, .name, #temp {
    color: blue;
}
```

### 6. 后代选择器
用来选择元素或元素组的后代。中间用空格分隔。
```css
/* 选择 ul 下面的所有 li 下面的 span */
ul li span {
    color: yellow;
}
```
```html
<ul>
    <li>
        <span>内容</span>
    </li>
</ul>
```

