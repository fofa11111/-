import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { TrafficLight } from './components/TrafficLight.js';
import { VehicleManager } from './components/VehicleManager.js';
import { AIDetector } from './ai/AIDetector.js';
import Stats from 'stats.js';

class TrafficEnforcementGame {
    constructor() {
        // 基础初始化
        this.initThreeJS();
        this.initUIElements();
        this.initStats();
        this.setupEventListeners();

        // 游戏状态
        this.isDetecting = false;
        this.violationCount = 0;
        this.score = 0;
        this.redLightActive = false;
        this.detectionBox = document.getElementById('detection-box');

        // 组件初始化
        this.trafficLight = new TrafficLight(this.scene);
        this.vehicleManager = new VehicleManager(this.scene);
        this.aiDetector = new AIDetector();

        // 开始游戏循环
        this.animate();
    }

    initThreeJS() {
        // 创建场景
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x87CEEB);

        // 创建相机
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.camera.position.set(0, 10, 20);
        this.camera.lookAt(0, 0, 0);

        // 创建渲染器
        this.renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('scene-canvas'), antialias: true });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.shadowMap.enabled = true;

        // 添加灯光
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        this.scene.add(ambientLight);

        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(10, 20, 15);
        directionalLight.castShadow = true;
        this.scene.add(directionalLight);

        // 添加控制器
        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.05;
        this.controls.maxPolarAngle = Math.PI / 2; // 限制垂直旋转

        // 添加地面
        const groundGeometry = new THREE.PlaneGeometry(50, 50);
        const groundMaterial = new THREE.MeshStandardMaterial({ color: 0x2ecc71 });
        const ground = new THREE.Mesh(groundGeometry, groundMaterial);
        ground.rotation.x = -Math.PI / 2;
        ground.receiveShadow = true;
        this.scene.add(ground);

        // 添加十字路口
        this.createRoad();

        // 窗口大小调整
        window.addEventListener('resize', () => this.onWindowResize());
    }

    createRoad() {
        // 创建主道路
        const roadMaterial = new THREE.MeshStandardMaterial({ color: 0x34495e });

        // 横向道路
        const horizontalRoad = new THREE.Mesh(new THREE.BoxGeometry(40, 0.1, 15), roadMaterial);
        horizontalRoad.position.y = 0.05;
        this.scene.add(horizontalRoad);

        // 纵向道路
        const verticalRoad = new THREE.Mesh(new THREE.BoxGeometry(15, 0.1, 40), roadMaterial);
        verticalRoad.position.y = 0.05;
        this.scene.add(verticalRoad);

        // 添加停止线
        this.addStopLines();
    }

    addStopLines() {
        const lineMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff });
        const lineGeometry = new THREE.BoxGeometry(10, 0.06, 0.5);

        // 横向道路停止线
        const line1 = new THREE.Mesh(lineGeometry, lineMaterial);
        line1.position.set(0, 0.06, 5);
        this.scene.add(line1);

        const line2 = new THREE.Mesh(lineGeometry, lineMaterial);
        line2.position.set(0, 0.06, -5);
        this.scene.add(line2);

        // 纵向道路停止线
        const line3 = new THREE.Mesh(lineGeometry, lineMaterial);
        line3.position.set(5, 0.06, 0);
        line3.rotation.y = Math.PI / 2;
        this.scene.add(line3);

        const line4 = new THREE.Mesh(lineGeometry, lineMaterial);
        line4.position.set(-5, 0.06, 0);
        line4.rotation.y = Math.PI / 2;
        this.scene.add(line4);
    }

    initUIElements() {
        this.ui = {
            violationCount: document.getElementById('violation-count'),
            score: document.getElementById('score'),
            lightStatus: document.getElementById('light-status'),
            captureBtn: document.getElementById('capture-btn'),
            toggleCameraBtn: document.getElementById('toggle-camera'),
            startDetectionBtn: document.getElementById('start-detection'),
            detectionBox: document.getElementById('detection-box')
        };
    }

    initStats() {
        this.stats = new Stats();
        this.stats.showPanel(0); // 0: fps, 1: ms, 2: mb
        document.body.appendChild(this.stats.dom);
    }

    setupEventListeners() {
        this.ui.captureBtn.addEventListener('click', () => this.captureViolation());
        this.ui.toggleCameraBtn.addEventListener('click', () => this.toggleCameraView());
        this.ui.startDetectionBtn.addEventListener('click', () => this.toggleDetection());
    }

    async start() {
        // 加载AI模型
        try {
            await this.aiDetector.loadModels();
            console.log('AI模型加载完成');
            this.ui.startDetectionBtn.textContent = '停止检测';
        } catch (error) {
            console.error('AI模型加载失败:', error);
            alert('AI模型加载失败，请刷新页面重试');
        }
    }

    toggleDetection() {
        this.isDetecting = !this.isDetecting;
        if (this.isDetecting) {
            this.start();
        } else {
            this.aiDetector.stopDetection();
            this.ui.startDetectionBtn.textContent = '开始检测';
        }
    }

    captureViolation() {
        if (!this.redLightActive) {
            this.showMessage('红灯未亮起，无法抓拍');
            return;
        }

        // 这里添加抓拍逻辑
        const violationConfirmed = this.vehicleManager.checkForRedLightViolations();
        if (violationConfirmed) {
            this.violationCount++;
            this.score += 100;
            this.updateUI();
            this.showMessage('抓拍成功，得分+100');
        } else {
            this.score = Math.max(0, this.score - 50);
            this.updateUI();
            this.showMessage('误判！未检测到违规车辆', 'error');
        }
    }

    toggleCameraView() {
        // 切换相机视角逻辑
        this.cameraPositions = this.cameraPositions || [
            { position: new THREE.Vector3(0, 10, 20), lookAt: new THREE.Vector3(0, 0, 0) },
            { position: new THREE.Vector3(20, 8, 0), lookAt: new THREE.Vector3(0, 0, 0) },
            { position: new THREE.Vector3(0, 15, -15), lookAt: new THREE.Vector3(0, 0, 0) },
            { position: new THREE.Vector3(15, 12, 15), lookAt: new THREE.Vector3(0, 0, 0) } // 摄像头视角
        ];

        this.currentCameraIndex = (this.currentCameraIndex || 0) + 1;
        if (this.currentCameraIndex >= this.cameraPositions.length) {
            this.currentCameraIndex = 0;
        }

        const newPos = this.cameraPositions[this.currentCameraIndex].position;
        const newLookAt = this.cameraPositions[this.currentCameraIndex].lookAt;

        // 平滑过渡到新视角
        this.controls.target.copy(newLookAt);
        this.camera.position.copy(newPos);
    }

    updateUI() {
        this.ui.violationCount.textContent = this.violationCount;
        this.ui.score.textContent = this.score;
        this.ui.lightStatus.textContent = this.redLightActive ? '红灯' : '绿灯';
        this.ui.lightStatus.style.color = this.redLightActive ? 'red' : 'green';
    }

    showMessage(text, type = 'info') {
        // 创建临时消息元素
        const messageEl = document.createElement('div');
        messageEl.textContent = text;
        messageEl.style.position = 'absolute';
        messageEl.style.top = '50%';
        messageEl.style.left = '50%';
        messageEl.style.transform = 'translate(-50%, -50%)';
        messageEl.style.padding = '15px 20px';
        messageEl.style.borderRadius = '5px';
        messageEl.style.color = 'white';
        messageEl.style.zIndex = '1000';
        messageEl.style.opacity = '0';
        messageEl.style.transition = 'opacity 0.3s ease';
        messageEl.style.backgroundColor = type === 'error' ? '#e74c3c' : '#3498db';

        document.body.appendChild(messageEl);

        // 显示并自动移除
        setTimeout(() => messageEl.style.opacity = '1', 10);
        setTimeout(() => {
            messageEl.style.opacity = '0';
            setTimeout(() => document.body.removeChild(messageEl), 300);
        }, 2000);
    }

    onWindowResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }

    animate() {
        requestAnimationFrame(() => this.animate());
        this.stats.begin();

        // 更新交通灯状态
        this.trafficLight.update();
        this.redLightActive = this.trafficLight.isRed;
        this.updateUI();

        // 更新车辆
        this.vehicleManager.update(this.redLightActive);

        // 运行AI检测
        if (this.isDetecting && this.redLightActive) {
            this.detectVehicles();
        } else if (this.ui.detectionBox.style.display === 'block') {
            this.ui.detectionBox.style.display = 'none';
        }

        this.controls.update();
        this.renderer.render(this.scene, this.camera);
        this.stats.end();
    }

    detectVehicles() {
        // 在实际实现中，这里会调用AI检测器分析场景
        // 简化版：随机选择一辆违规车辆进行标记
        const violatingVehicle = this.vehicleManager.getRandomViolatingVehicle();
        if (violatingVehicle) {
            // 转换3D位置到屏幕坐标
            const screenPos = this.projectWorldToScreen(violatingVehicle.mesh.position);
            const box = this.ui.detectionBox;
            box.style.display = 'block';
            box.style.left = `${screenPos.x - 50}px`;
            box.style.top = `${screenPos.y - 50}px`;
            box.style.width = '100px';
            box.style.height = '100px';
        } else if (Math.random() > 0.8) {
            this.ui.detectionBox.style.display = 'none';
        }
    }

    projectWorldToScreen(position) {
        const vector = new THREE.Vector3(position.x, position.y, position.z);
        vector.project(this.camera);
        const canvas = this.renderer.domElement;
        return {
            x: (vector.x * 0.5 + 0.5) * canvas.width,
            y: (-vector.y * 0.5 + 0.5) * canvas.height
        };
    }
}

// 启动游戏
window.addEventListener('DOMContentLoaded', () => {
    const game = new TrafficEnforcementGame();
});