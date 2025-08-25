import * as tf from '@tensorflow/tfjs';
import * as cocoSsd from '@tensorflow-models/coco-ssd';
import * as THREE from 'three';

// 交通灯颜色识别模型 - 简化版CNN
class TrafficLightClassifier {
    constructor() {
        this.model = null;
        this.isTraining = false;
        this.classes = ['red', 'yellow', 'green'];
    }

    async loadModel() {
        // 在实际应用中，这里应该加载预训练模型
        // 简化版：创建一个简单的模型用于演示
        this.model = this.createSimpleModel();
        return true;
    }

    createSimpleModel() {
        // 创建一个简单的CNN模型
        const model = tf.sequential();

        // 输入层：28x28x3的交通灯图像
        model.add(tf.layers.conv2d({
            inputShape: [28, 28, 3],
            filters: 16,
            kernelSize: 3,
            activation: 'relu'
        }));
        model.add(tf.layers.maxPooling2d({
            poolSize: 2,
            strides: 2
        }));

        model.add(tf.layers.conv2d({
            filters: 32,
            kernelSize: 3,
            activation: 'relu'
        }));
        model.add(tf.layers.maxPooling2d({
            poolSize: 2,
            strides: 2
        }));

        model.add(tf.layers.flatten());
        model.add(tf.layers.dense({
            units: 32,
            activation: 'relu'
        }));

        // 输出层：3个类别（红、黄、绿）
        model.add(tf.layers.dense({
            units: 3,
            activation: 'softmax'
        }));

        model.compile({
            optimizer: tf.train.adam(0.001),
            loss: 'categoricalCrossentropy',
            metrics: ['accuracy']
        });

        return model;
    }

    async predictLightColor(imageData) {
        if (!this.model) {
            await this.loadModel();
        }

        // 简化版：使用随机预测模拟，实际应用中应该使用真实模型预测
        const prediction = tf.tidy(() => {
            // 将图像数据转换为张量
            const img = tf.browser.fromPixels(imageData)
                .resizeNearestNeighbor([28, 28])
                .toFloat()
                .div(255.0)
                .expandDims();

            // 预测
            return this.model.predict(img);
        });

        const result = await prediction.data();
        prediction.dispose();

        // 简化：随机返回一个结果，实际应用中应该取概率最高的类别
        const randomIndex = Math.floor(Math.random() * 3);
        return this.classes[randomIndex];
    }
}

export class AIDetector {
    constructor() {
        this.vehicleDetector = null;
        this.trafficLightClassifier = new TrafficLightClassifier();
        this.isDetecting = false;
        this.detectionInterval = null;
        this.detectionResults = [];
        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d');
    }

    async loadModels() {
        try {
            // 加载COCO-SSD模型用于车辆检测
            console.log('加载车辆检测模型...');
            this.vehicleDetector = await cocoSsd.load({ modelUrl: 'https://storage.googleapis.com/tfjs-models/tfjs/coco-ssd/mobilenet_v1_0.75_224/model.json' });
            console.log('车辆检测模型加载完成');

            // 加载交通灯分类模型
            console.log('加载交通灯分类模型...');
            await this.trafficLightClassifier.loadModel();
            console.log('交通灯分类模型加载完成');

            return true;
        } catch (error) {
            console.error('模型加载失败:', error);
            throw error;
        }
    }

    startDetection(renderer, scene, camera) {
        if (this.isDetecting) return;

        this.isDetecting = true;
        this.detectionResults = [];

        // 设置Canvas尺寸
        this.canvas.width = renderer.domElement.width;
        this.canvas.height = renderer.domElement.height;

        // 开始检测循环
        this.detectionInterval = setInterval(async () => {
            await this.detectFrame(renderer, scene, camera);
        }, 100); // 每100ms检测一帧
    }

    stopDetection() {
        this.isDetecting = false;
        if (this.detectionInterval) {
            clearInterval(this.detectionInterval);
            this.detectionInterval = null;
        }
    }

    async detectFrame(renderer, scene, camera) {
        if (!this.vehicleDetector || !this.isDetecting) return;

        try {
            // 渲染当前场景到离屏Canvas
            renderer.render(scene, camera);
            const imageData = renderer.domElement;

            // 检测车辆
            const vehicles = await this.detectVehicles(imageData);

            // 检测交通灯状态
            const lightStatus = await this.detectTrafficLight(imageData);

            // 存储检测结果
            this.detectionResults = {
                timestamp: Date.now(),
                vehicles: vehicles,
                trafficLightStatus: lightStatus,
                hasViolation: this.checkViolations(vehicles, lightStatus)
            };

            // 更新UI显示检测框
            this.updateDetectionUI();

        } catch (error) {
            console.error('检测过程出错:', error);
        }
    }

    async detectVehicles(imageData) {
        if (!this.vehicleDetector) return [];

        // 使用COCO-SSD检测对象
        const predictions = await this.vehicleDetector.detect(imageData);

        // 过滤出车辆类别
        const vehicleClasses = ['car', 'truck', 'bus', 'motorcycle'];
        const vehicles = predictions.filter(pred => 
            vehicleClasses.includes(pred.class) && pred.score > 0.5
        ).map(pred => ({
            class: pred.class,
            score: pred.score,
            bbox: pred.bbox,
            position: this.calculateWorldPosition(pred.bbox, imageData)
        }));

        return vehicles;
    }

    async detectTrafficLight(imageData) {
        // 在实际应用中，这里应该从图像中提取交通灯区域并分类
        // 简化版：随机返回红灯或绿灯状态
        return Math.random() > 0.5 ? 'red' : 'green';
    }

    calculateWorldPosition(bbox, imageData) {
        // 简化：将2D检测框转换为3D世界坐标
        const x = (bbox[0] + bbox[2]/2) / imageData.width * 20 - 10;
        const z = (bbox[1] + bbox[3]/2) / imageData.height * 20 - 10;
        return new THREE.Vector3(x, 0, -z);
    }

    checkViolations(vehicles, lightStatus) {
        // 检查是否有车辆在红灯时违规
        if (lightStatus !== 'red') return false;

        // 简化版：如果有车辆检测结果，就认为有违规
        return vehicles.length > 0;
    }

    updateDetectionUI() {
        // 更新检测框UI
        const detectionBox = document.getElementById('detection-box');
        if (!detectionBox || !this.detectionResults || !this.detectionResults.vehicles.length) {
            detectionBox.style.display = 'none';
            return;
        }

        // 显示第一个检测到的车辆框
        const firstVehicle = this.detectionResults.vehicles[0];
        const [x, y, width, height] = firstVehicle.bbox;

        detectionBox.style.left = `${x}px`;
        detectionBox.style.top = `${y}px`;
        detectionBox.style.width = `${width}px`;
        detectionBox.style.height = `${height}px`;
        detectionBox.style.display = 'block';
    }

    getLatestResults() {
        return this.detectionResults;
    }
}