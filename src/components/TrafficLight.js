import * as THREE from 'three';

export class TrafficLight {
    constructor(scene) {
        this.scene = scene;
        this.isRed = false;
        this.isYellow = false;
        this.lightState = 'green'; // 初始状态
        this.timer = 0;
        this.lightDuration = { red: 5000, green: 5000, yellow: 2000 };
        this.lightObjects = {};
        this.createTrafficLight();
    }

    createTrafficLight() {
        // 创建信号灯柱
        const poleGeometry = new THREE.CylinderGeometry(0.2, 0.2, 6);
        const poleMaterial = new THREE.MeshStandardMaterial({ color: 0x555555 });
        const pole = new THREE.Mesh(poleGeometry, poleMaterial);
        pole.position.set(0, 3, -10);
        pole.castShadow = true;
        this.scene.add(pole);

        // 创建信号灯箱体
        const boxGeometry = new THREE.BoxGeometry(1, 2, 0.5);
        const boxMaterial = new THREE.MeshStandardMaterial({ color: 0x333333 });
        const box = new THREE.Mesh(boxGeometry, boxMaterial);
        box.position.set(0, 7, -10);
        box.castShadow = true;
        this.scene.add(box);

        // 创建三个灯（红、黄、绿）
        const lightGeometry = new THREE.SphereGeometry(0.3, 16, 16);
        const positions = [0.5, 0, -0.5]; // 垂直位置
        const colors = ['red', 'yellow', 'green'];

        colors.forEach((color, index) => {
            const material = new THREE.MeshStandardMaterial({
                color: new THREE.Color(color),
                emissive: new THREE.Color(0x000000), // 默认不发光
                emissiveIntensity: 1
            });

            const light = new THREE.Mesh(lightGeometry, material);
            light.position.set(0, 7 + positions[index], -9.7); // 稍微向前突出
            light.castShadow = true;
            this.scene.add(light);

            // 创建点光源用于发光效果
            const pointLight = new THREE.PointLight(new THREE.Color(color), 0, 3);
            pointLight.position.copy(light.position);
            this.scene.add(pointLight);

            this.lightObjects[color] = { mesh: light, light: pointLight, material: material };
        });

        // 初始设置绿灯亮
        this.setLightState('green');
    }

    setLightState(state) {
        // 先关闭所有灯
        Object.values(this.lightObjects).forEach(obj => {
            obj.material.emissive.set(0x000000);
            obj.light.intensity = 0;
        });

        // 设置当前灯状态
        if (this.lightObjects[state]) {
            this.lightObjects[state].material.emissive.set(this.lightObjects[state].material.color);
            this.lightObjects[state].light.intensity = 2;
            this.lightState = state;
            this.isRed = state === 'red';
            this.isYellow = state === 'yellow';
        }
    }

    update(deltaTime = 16) {
        this.timer += deltaTime;
        const currentDuration = this.lightDuration[this.lightState];

        if (this.timer >= currentDuration) {
            this.timer = 0;
            // 切换到下一个状态
            switch (this.lightState) {
                case 'green':
                    this.setLightState('yellow');
                    break;
                case 'yellow':
                    this.setLightState('red');
                    break;
                case 'red':
                    this.setLightState('green');
                    break;
            }
        }
    }
}