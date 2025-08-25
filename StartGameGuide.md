# 3D卡通射击游戏启动指南

## 前提条件
在开始前，请确保您已安装以下软件：
- Unity Hub (https://unity3d.com/get-unity/download)
- Unity 2022.3或更高版本
- 文本编辑器（如Visual Studio、Visual Studio Code）

## 步骤1：创建Unity项目
1. 打开Unity Hub
2. 点击"新项目"按钮
3. 选择"3D"模板
4. 输入项目名称"CartoonShooter"
5. 选择项目位置（建议选择/Users/hetao/Desktop/）
6. 选择Unity版本（2022.3或更高）
7. 点击"创建项目"按钮

## 步骤2：导入脚本文件
1. 等待Unity项目初始化完成后，在Project窗口中
2. 右键点击"Assets"文件夹，选择"Show in Finder"
3. 在Finder中，创建一个名为"Scripts"的新文件夹
4. 将/Users/hetao/Desktop/traaaaaa/UnityScripts/文件夹中的所有.cs文件复制到这个新文件夹
5. 返回Unity，您应该能在Project窗口中看到导入的脚本

## 步骤3：配置项目
1. 按照UnityProjectSetup.md中的指南设置Universal RP渲染管线
2. 配置输入管理器以支持WASD移动和鼠标控制
3. 设置物理参数以适应游戏风格

## 步骤4：创建场景
1. 在Hierarchy窗口中，右键点击选择"3D Object" > "Plane"创建地面
2. 添加光源、天空盒和其他环境元素
3. 创建玩家角色和敌人预制体
4. 将相应的脚本添加到游戏对象上

## 步骤5：运行游戏
1. 确保场景已保存
2. 点击Unity编辑器顶部的播放按钮
3. 使用WASD键移动，鼠标控制视角，空格键跳跃，左键发射魔法弹

## 遇到问题？
- 请参考UnityProjectSetup.md中的详细设置指南
- 确保所有脚本都已正确导入并添加到相应的游戏对象
- 检查控制台窗口是否有错误信息

祝您游戏开发愉快！如果需要进一步的帮助，请随时告诉我！