---
title: nonebot2的简单部署
date: 2025-11-17
description: bot
image: ""
tags:
  - bot
category: 部署bot


---
> 参考文档：
>[NoneBot](https://nonebot.dev/)    
>[NapCat | NapCatQQ](https://napneko.github.io/guide/napcat)    

# Linux
基于Debian11编写。    在Linux下部署nonebot。   

## 首先更新包列表，安装pip：
```shell
sudo apt update
sudo apt install python3-pip
```

## 安装nb-cli：
```shell
pip install nb-cli
```
## 安装napcat，此处使用napcat文档中的一键使用脚本：
```shell
curl -o \
napcat.sh \
https://nclatest.znin.net/NapNeko/NapCat-Installer/main/script/install.sh \
&& sudo bash napcat.sh
```
安装时选择同意安装`TUI-CLI`。   
## 安装tmux以用于后台挂起（服务器使用）：
```shell
sudo apt install -y tmux
```
## 安装1Panel（服务器使用）：
```shell
curl -sSL https://resource.fit2cloud.com/1panel/package/quick_start.sh -o quick_start.sh && sudo bash quick_start.sh
```
## 使用napcat
在终端中输入：
```shell
sudo napcat
```
添加你要使用机器人账号，并且将`token`复制。   
在浏览器中输入`服务器ip:6099`访问napcat的webui。   
输入token后在网络配置中新建`Websocket客户端`，URL为`ws://127.0.0.1:8080/onebot/v11/ws`，token为登录token。   
## 使用nb-cli创建nonebot：
```shell
nb
```
选择bootstrap；   
选择Onebotv11适配器；   
选择FastAPI驱动器；   
默认；   
默认；   
默认；   
创建完成后在`.env.prod`文件中添加：
```
SUPERUSERS=["你的qq号"]
ONEBOT_ACCESS_TOKEN=你的token
```
至此，你的bot算是部署完成了。
## 使用tmux挂起
在终端中输入：
```shell
tmux
```
进入窗口，输入：
```shell
napcat start 你bot的qq号
```
启动napcat；    
先按下`Ctrl+b` 然后按`d`挂起当前会话。   
重新输入：
```shell
tmux
```
在新窗口中输入：
```shell
cd /你bot的位置
nb run
```
启动你的bot。   
挂起窗口同上，如果后续需要回到对应页面修改，可以输入：
```
tmux ls
tmux a -t 会话名
```
或者使用`crtl+b`+`w`列出视图。

# Windows
首先确保你已安装`Python`，且`Python`大于3.9，推荐使用3.12，下载直链：   
https://www.python.org/ftp/python/3.12.9/python-3.12.9-amd64.exe      
有一个可以使用的文本编辑器。
## 安装nb-cli
与Linux类似，使用pip安装。   
新建一个文件夹，在文件夹地址栏中输入：
```shell
pip install nb-cli
```
## 安装napcat
在napcat的GitHub页面中下载，下载直链：   
https://github.com/NapNeko/NapCatQQ/releases/download/v4.9.81/NapCat.Shell.Windows.OneKey.zip   
解压后：   
1.点击 NapCatInstaller.exe 等待自动化配置    
2.进入 NapCat.XXXX.Shell 目录    
3.启动 napcat.bat   
按照提示添加你要使用机器人账号，并且将`token`复制。   

在浏览器中输入`127.0.0.1:6099`访问napcat的webui。   
输入token后在网络配置中新建`Websocket客户端`，URL为`ws://127.0.0.1:8080/onebot/v11/ws`，token为登录token。
## 使用nb-cli创建nonebot：
在终端中输入：
```shell
nb
```
选择bootstrap；   
选择Onebotv11适配器；   
选择FastAPI驱动器；   
默认；   
默认；   
默认；   
项目创建完成后在bot目录下找到`.env.prod`文件，在其中添加：
```
SUPERUSERS=["你的qq号"]
ONEBOT_ACCESS_TOKEN=你的token
```
至此，你的bot部署完成了，插件扩展可在nonebot的商店中找到。   
# win一键部署py脚本
```python
import os

import sys

import platform

import subprocess

import zipfile

import urllib.request

import shutil

import ctypes

import glob

  

def is_admin():

    try:

        return ctypes.windll.shell32.IsUserAnAdmin()

    except:

        return False

  

def run_command(command, shell=True, cwd=None):

    print(f"执行命令: {command}")

    try:

        subprocess.check_call(command, shell=shell, cwd=cwd)

    except subprocess.CalledProcessError as e:

        print(f"命令执行失败: {e}")

        return False

    return True

  

def install_nb_cli():

    print("正在安装 nb-cli...")

    return run_command(f"{sys.executable} -m pip install nb-cli")

  

def init_nonebot():

    if not os.path.exists("bot.py") and not os.path.exists(".env"):

        print("正在初始化 NoneBot 项目...")

        # 使用 non-interactive 模式创建项目，如果支持的话

        # 这里简单创建一个基础结构

        run_command("nb create --name mybot --template bootstrap --driver OneBotV11 --adapter OneBotV11 --no-install")

        if os.path.exists("mybot"):

            for item in os.listdir("mybot"):

                shutil.move(os.path.join("mybot", item), ".")

            os.rmdir("mybot")

    else:

        print("检测到已存在 NoneBot 项目，跳过初始化。")

  

def setup_napcat():

    if not is_admin():

        print("\n" + "!"*40)

        print("警告: 检测到当前未以管理员权限运行。")

        print("NapCatInstaller 可能在解压 QQ 时因权限不足失败。")

        print("如果稍后安装失败，请尝试右键 '以管理员身份运行' 终端或脚本。")

        print("!"*40 + "\n")

  

    url = "https://gh.llkk.cc/https://github.com/NapNeko/NapCatQQ/releases/download/v4.10.10/NapCat.Shell.Windows.OneKey.zip"

    print(f"正在下载 NapCat Windows 版: {url}")

    zip_path = "napcat.zip"

    # 简单的重试逻辑

    for i in range(3):

        try:

            urllib.request.urlretrieve(url, zip_path)

            break

        except Exception as e:

            if i == 2: raise e

            print(f"下载失败，正在进行第 {i+2} 次重试...")

  

    print("正在解压 NapCat...")

    napcat_dir = os.path.abspath("napcat")

    if os.path.exists(napcat_dir):

        shutil.rmtree(napcat_dir)

    os.makedirs(napcat_dir)

    with zipfile.ZipFile(zip_path, 'r') as zip_ref:

        zip_ref.extractall(napcat_dir)

    os.remove(zip_path)

    print("NapCat 已解压。")

  

    installer_path = os.path.join(napcat_dir, "NapCatInstaller.exe")

    if os.path.exists(installer_path):

        print(f"正在启动安装程序: {installer_path}")

        # 使用绝对路径并在解压目录下运行，防止路径问题

        run_command(f'"{installer_path}"', cwd=napcat_dir)

    else:

        print("未找到 NapCatInstaller.exe，请手动检查 napcat 目录。")

  

    # 搜索 NapCat.*.Shell 目录并运行 napcat.bat

    print("正在搜索 NapCat Shell 启动脚本...")

    shell_dirs = glob.glob(os.path.join(napcat_dir, "NapCat.*.Shell"))

    if shell_dirs:

        # 取匹配到的第一个（通常只有一个或取最新的）

        target_shell_dir = shell_dirs[0]

        bat_path = os.path.join(target_shell_dir, "napcat.bat")

        if os.path.exists(bat_path):

            print(f"正在启动 NapCat: {bat_path}")

            # 使用 start 命令在新窗口运行，避免阻塞部署脚本完成

            subprocess.Popen(f'start cmd /k "{bat_path}"', shell=True, cwd=target_shell_dir)

        else:

            print(f"在 {target_shell_dir} 中未找到 napcat.bat")

    else:

        print("未找到 NapCat.*.Shell 目录，可能安装程序尚未完成解压。")

  

def main():

    if platform.system().lower() != "windows":

        print("错误: 该脚本目前仅支持 Windows 系统。")

        return

  

    print(f"系统检测: {platform.system()} {platform.release()}")

    if not install_nb_cli():

        print("nb-cli 安装失败，请检查网络或 Python 环境。")

        return

  

    init_nonebot()

    setup_napcat()

    print("\n" + "="*30)

    print("部署完成！")

    print(f"1. NoneBot 目录: {os.getcwd()}")

    print(f"2. NapCat 目录: {os.path.join(os.getcwd(), 'napcat')}")

    print("="*30)

  

if __name__ == "__main__":

    main()
```
使用方法：   
复制后在当前位置新建一个终端，直接运行该脚本。  
运行完成会自动打开napcat，按照提示登录获取token。    
与上面一样，将token写入`.env.prod`文件。
