const obstacleTypes = [
    {type: 'rock', src: [], weight: 3},
    {type: 'barrier', src: [], weight: 3},
    {type: 'dog', src: [], weight: 2},
    {type: 'grandma', src: [], weight: 2},
    {type: 'plastic-bag', src: [], weight: 2}
];

// 根据权重随机选择障碍物类型
let totalWeight = 0;
obstacleTypes.forEach(type => totalWeight += type.weight);
let random = Math.random() * totalWeight;

let selectedSrcs;
for (let i = 0; i < obstacleTypes.length; i++) {
    random -= obstacleTypes[i].weight;
    if (random <= 0) {
        selectedSrcs = obstacleTypes[i].src;
        break;
    }
}

console.log('语法验证通过');