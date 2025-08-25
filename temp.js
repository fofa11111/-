// 临时文件，用于检查JavaScript语法

// 车辆模拟相关变量
const vehicle = document.getElementById('vehicle');
const road = document.getElementById('road');
const gameContainer = document.getElementById('game-container');
let stones = [];
let isAvoiding = false;
let currentLane = 'center'; // 初始在中间车道

// 检测碰撞并避开
function checkCollision() {
    if (isAvoiding) return;
    
    const vehicleRect = vehicle.getBoundingClientRect();
    
    stones.forEach(stone => {
        if (!stone.detected) return;
        // 如果是塑料袋，直接跳过碰撞处理，让车辆压过去
        if (stone.element.classList.contains('plastic-bag')) return;
        
        const stoneRect = stone.element.getBoundingClientRect();
        
        // 检查障碍物是否在车辆前方一定距离内
        if (stoneRect.bottom >= vehicleRect.top - 200 && stoneRect.bottom <= vehicleRect.top) {
            
            // 如果是狗，让狗自己跑开
            if (stone.isDog) {
                // 开启车灯闪烁
                flashHeadlights();
                
                // 标记正在处理特殊行为，停止其下落
                stone.isMovingAway = true;
                
                // 计算马路宽度和目标平移距离（马路宽度的一半）
                const roadWidth = 400; // 从CSS中获取的马路宽度
                const moveDistance = roadWidth / 2; // 马路宽度的一半（200px）
                
                let startTime = null;
                const moveDuration = 1000; // 移动时间保持在1秒（1000毫秒）
                
                function smoothMove(timestamp) {
                    if (!startTime) startTime = timestamp;
                    const progress = timestamp - startTime;
                    const percentage = Math.min(progress / moveDuration, 1);
                    
                    // 使用缓动函数使移动更平滑
                    const easeOutQuart = 1 - Math.pow(1 - percentage, 4);
                    
                    // 计算缓慢平滑的向右移动位置
                    const newLeft = stone.left + moveDistance * easeOutQuart;
                    stone.element.style.left = `${newLeft}px`;
                    
                    // 移动结束后移除元素
                    if (progress < moveDuration) {
                        requestAnimationFrame(smoothMove);
                    } else if (!stone.isPlasticBag) { // 塑料袋不会触发躲避
                        stone.element.remove();
                        stones = stones.filter(s => s !== stone);
                    }
                }
                
                // 立即开始平滑移动
                requestAnimationFrame(smoothMove);
                // 如果是老奶奶或其他障碍物（石头、路障），车辆主动避让
            } else {
                // 如果是老奶奶，开启车灯闪烁
                if (stone.isGrandma) {
                    flashHeadlights();
                }
                // 如果障碍物在当前车道
                const currentVehicleLane = currentLane === 'left' ? 'left' : 
                                currentLane === 'right' ? 'right' : 
                                (vehicleRect.left < (window.innerWidth / 2)) ? 'left' : 'right';
                
                if (stone.lane === currentVehicleLane) {
                    // 需要避开，切换到另一个车道
                    isAvoiding = true;
                    
                    if (currentVehicleLane === 'left') {
                        moveToRightLane();
                    } else {
                        moveToLeftLane();
                    }
                    
                    // 3秒后可以再次切换车道
                    setTimeout(() => {
                        isAvoiding = false;
                        // 回到当前车道（不再使用中间车道）
                        moveToCenterLane();
                    }, 3000);
                }
            }
        }
    });
}

// 移动到左车道
function moveToLeftLane() {
    const roadRect = road.getBoundingClientRect();
    vehicle.style.left = `${roadRect.left + (roadRect.width / 4)}px`;
    currentLane = 'left';
}

// 移动到右车道
function moveToRightLane() {
    const roadRect = road.getBoundingClientRect();
    vehicle.style.left = `${roadRect.left + (roadRect.width * 3/4)}px`;
    currentLane = 'right';
}

// 移除中间车道功能，确保车辆始终在左或右车道
function moveToCenterLane() {
    // 不再使用中间车道，保持当前车道
    const roadRect = road.getBoundingClientRect();
    if (currentLane === 'left') {
        vehicle.style.left = `${roadRect.left + (roadRect.width / 4)}px`;
    } else {
        vehicle.style.left = `${roadRect.left + (roadRect.width * 3/4)}px`;
    }
}

// 清理离开视口的石头
function cleanupStones() {
    stones = stones.filter(stone => {
        const rect = stone.element.getBoundingClientRect();
        if (rect.top > window.innerHeight) {
            stone.element.remove();
            return false;
        }
        return true;
    });
}

// 开启车灯闪烁效果
function flashHeadlights() {
    // 创建两个车灯元素
    const leftHeadlight = document.createElement('div');
    const rightHeadlight = document.createElement('div');
    
    leftHeadlight.style.position = 'absolute';
    leftHeadlight.style.width = '20px';
    leftHeadlight.style.height = '10px';
    leftHeadlight.style.backgroundColor = 'rgba(255, 255, 255, 0.8)';
    leftHeadlight.style.borderRadius = '50%';
    leftHeadlight.style.top = '20px'; // 车灯放在前面
    leftHeadlight.style.left = '10px';
    leftHeadlight.style.boxShadow = '0 0 20px 10px rgba(255, 255, 255, 0.5)';
    
    rightHeadlight.style.position = 'absolute';
    rightHeadlight.style.width = '20px';
    rightHeadlight.style.height = '10px';
    rightHeadlight.style.backgroundColor = 'rgba(255, 255, 255, 0.8)';
    rightHeadlight.style.borderRadius = '50%';
    rightHeadlight.style.top = '20px'; // 车灯放在前面
    rightHeadlight.style.right = '10px';
    rightHeadlight.style.boxShadow = '0 0 20px 10px rgba(255, 255, 255, 0.5)';
    
    vehicle.appendChild(leftHeadlight);
    vehicle.appendChild(rightHeadlight);
    
    // 闪烁效果 - 让闪烁更明显
    let opacity = 1;
    let decreasing = true;
    
    const flashInterval = setInterval(() => {
        if (decreasing) {
            opacity -= 0.2; // 更快的亮度变化
            if (opacity <= 0.2) {
                decreasing = false;
            }
        } else {
            opacity += 0.2;
            if (opacity >= 1) {
                decreasing = true;
            }
        }
        
        leftHeadlight.style.opacity = opacity;
        rightHeadlight.style.opacity = opacity;
    }, 150); // 更慢的闪烁间隔
    
    // 0.5秒后移除车灯效果
    setTimeout(() => {
        clearInterval(flashInterval);
        leftHeadlight.remove();
        rightHeadlight.remove();
    }, 500);
}

// 移动石头
function moveStones() {
    // 这个函数在原始代码中应该有实现
}

// 动画循环
function animate() {
    checkCollision();
    moveStones();
    cleanupStones();
    requestAnimationFrame(animate);
}

// 开始动画
// animate();