# Unity 3D卡通射击游戏项目设置指南

## 项目初始化步骤
1. 打开Unity Hub，创建新项目（3D模板）
2. 选择Unity 2022.3或更高版本
3. 设置项目名称为"CartoonShooter"并选择合适的位置
4. 等待项目初始化完成

## 导入必要的包
1. 在Package Manager中导入Universal RP包
2. 导入TextMeshPro包
3. 可选：导入Mixamo动画包

## 项目配置
1. 创建Universal RP渲染管线资产
   - 右键点击Project窗口 > Create > Rendering > Universal Render Pipeline > Pipeline Asset
   - 将其设置为项目的默认渲染管线（在Project Settings > Graphics中）
2. 配置输入管理器
   - 确保WASD、跳跃和鼠标控制已正确映射
3. 设置物理参数
   - 调整重力设置以适应游戏风格

## 场景设置
1. 创建基础场景
   - 添加地形或平面作为地面
   - 设计低多边形风格的奇幻森林环境
   - 添加光源和天空盒
2. 设置玩家出生点
   - 创建空物体作为玩家生成位置
3. 添加敌人生成点
   - 在场景中多个位置创建空物体作为敌人生成点

## 脚本使用说明
将以下脚本添加到相应的游戏对象上：

1. **PlayerController.cs**
   - 添加到玩家角色对象
   - 分配相机、武器系统和跳跃粒子

2. **WeaponSystem.cs**
   - 添加到武器对象或玩家对象
   - 分配投射物预制体和发射点

3. **EnemyAI.cs**
   - 添加到敌人预制体
   - 配置敌人属性和行为参数

4. **Projectile.cs**
   - 添加到投射物预制体
   - 设置伤害和速度参数

5. **HealthSystem.cs**
   - 添加到玩家和敌人对象
   - 分配生命值UI元素

6. **GameManager.cs**
   - 添加到场景中的空物体
   - 配置游戏状态和UI引用

## 下一步开发建议
1. 创建角色和敌人模型（或使用Unity商店资源）
2. 设计UI界面（遵循云朵和爱心的可爱风格）
3. 添加动画和特效
4. 实现碰撞检测和物理交互
5. 调整游戏平衡和难度曲线
6. 测试和优化性能

## 资源推荐
- 角色模型：Mixamo (https://www.mixamo.com/)
- 环境资源：Unity Asset Store中的Low Poly包
- 音效：Freesound (https://freesound.org/)

祝您开发愉快！如有具体模块需要更详细的代码示例，请随时告知。