# 3D卡通射击游戏项目设置

## 项目结构
```
ShootingGame/
├── Assets/
│   ├── Art/
│   │   ├── Characters/
│   │   ├── Enemies/
│   │   ├── Environments/
│   │   └── UI/
│   ├── Audio/
│   ├── Prefabs/
│   ├── Scripts/
│   │   ├── Core/
│   │   ├── Player/
│   │   ├── Enemy/
│   │   ├── Weapons/
│   │   ├── UI/
│   │   └── Utilities/
│   ├── Shaders/
│   └── Scenes/
├── Packages/
└── ProjectSettings/
```

## 核心脚本模块
1. PlayerController - 处理玩家移动、跳跃和视角控制
2. WeaponSystem - 管理武器切换、射击和蓄力机制
3. EnemyAI - 控制敌人行为和攻击模式
4. HealthSystem - 管理生命值和死亡逻辑
5. UIManager - 处理游戏界面元素

## 下一步操作
1. 创建基础场景
2. 实现玩家控制器
3. 开发武器系统
4. 设计敌人AI
5. 构建UI界面