// 3D奖状展厅场景实现 - 增强版
// 使用ES模块导入Three.js和OrbitControls
import * as THREE from 'three';
import { OrbitControls } from './OrbitControls.js';

// 添加加载状态检测
let threeJsLoaded = true; // 现在直接导入，所以设为true
let orbitControlsLoaded = true; // 现在直接导入，所以设为true
let sceneInitialized = false;

// 全局日志数组
const initLogs = [];

// 添加日志函数
function addInitLog(message) {
    const timestamp = new Date().toLocaleTimeString();
    initLogs.push({ timestamp, message });
    // 限制日志数量
    if (initLogs.length > 50) {
        initLogs.shift();
    }
    // 更新日志显示
    updateLogDisplay();
}

// 更新日志显示
function updateLogDisplay() {
    const logElement = document.getElementById('init-logs');
    if (logElement) {
        let logHTML = '<div class="log-header">初始化日志</div>';
        initLogs.forEach(log => {
            logHTML += `<div class="log-entry"><span class="log-time">${log.timestamp}</span>: ${log.message}</div>`;
        });
        logElement.innerHTML = logHTML;
    }
}

// 更新调试信息
function updateDebugInfo() {
    // 更新调试信息
    const debugElement = document.getElementById('debug-info');
    if (debugElement) {
        debugElement.innerHTML = `
            <div>3D场景状态信息</div>
            <div>Three.js已加载: 是</div>
            <div>OrbitControls已加载: 是</div>
            <div>场景已初始化: ${sceneInitialized ? '是' : '否'}</div>
            <div>当前时间: ${new Date().toLocaleTimeString()}</div>
            <div>上次更新时间: ${new Date().toLocaleTimeString()}</div>
        `;
    }

    // 更新加载消息
    const loadingMessage = document.getElementById('loading-message');
    if (loadingMessage) {
        if (sceneInitialized) {
            loadingMessage.style.display = 'none';
        } else {
            loadingMessage.textContent = '正在初始化3D场景...';
        }
    }

    // 确保日志显示已创建
    if (!document.getElementById('init-logs')) {
        const logContainer = document.createElement('div');
        logContainer.id = 'init-logs';
        logContainer.style.position = 'fixed';
        logContainer.style.top = '20px';
        logContainer.style.right = '20px';
        logContainer.style.width = '300px';
        logContainer.style.height = '400px';
        logContainer.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
        logContainer.style.color = 'white';
        logContainer.style.padding = '10px';
        logContainer.style.borderRadius = '5px';
        logContainer.style.overflowY = 'auto';
        logContainer.style.zIndex = '1000';

        // 添加样式
        const style = document.createElement('style');
        style.textContent = `
            #init-logs .log-header {
                font-weight: bold;
                margin-bottom: 10px;
                border-bottom: 1px solid #555;
                padding-bottom: 5px;
            }
            #init-logs .log-entry {
                margin-bottom: 5px;
                font-size: 12px;
            }
            #init-logs .log-time {
                color: #aaa;
                margin-right: 10px;
            }
        `;
        document.head.appendChild(style);
        document.body.appendChild(logContainer);
    }
}

// 初始更新调试信息
updateDebugInfo();

// 定期更新调试信息
setInterval(updateDebugInfo, 1000);

// 初始化函数
function init() {
    if (sceneInitialized) {
        console.log('3D场景已初始化，跳过重复初始化');
        addInitLog('3D场景已初始化，跳过重复初始化');
        return;
    }
    console.log('开始初始化3D场景...');
    addInitLog('开始初始化3D场景...');
    try {
        console.log('创建CertificateGallery实例...');
        addInitLog('创建CertificateGallery实例...');
        const gallery = new CertificateGallery();
        console.log('调用gallery.start()方法...');
        addInitLog('调用gallery.start()方法...');
        gallery.start(); // 调用新的start()方法开始初始化
        sceneInitialized = true;
        console.log('3D场景初始化完成，sceneInitialized设置为true');
        addInitLog('3D场景初始化完成!');
        // 立即更新调试信息，隐藏加载消息
        console.log('调用updateDebugInfo()更新调试信息...');
        updateDebugInfo();
    } catch (error) {
        console.error('初始化3D场景失败:', error);
        addInitLog('初始化3D场景失败: ' + error.message);
        // 显示错误信息
        const loadingMessage = document.getElementById('loading-message');
        if (loadingMessage) {
            loadingMessage.textContent = '初始化3D场景失败: ' + error.message;
        }
    }
}

class CertificateGallery {
    constructor() {
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.controls = null;
        this.certificates = [];
        this.hasControls = false;
        this.autoRotate = false;
        this.autoRotateSpeed = 0.005;
        console.log('CertificateGallery实例已创建，自动旋转默认为false');
        addInitLog('CertificateGallery实例已创建');
    }

    // 类的初始化方法
    start() {
        console.log('调用CertificateGallery.start()方法开始初始化');
        addInitLog('调用CertificateGallery.start()方法开始初始化');
        this.init();
    }

    init() {
        console.log('开始初始化3D场景...');
        addInitLog('开始初始化3D场景组件...');

        // 创建场景
        this.scene = new THREE.Scene();
        addInitLog('场景已创建');

        // 添加坐标轴辅助
        this.axesHelper = new THREE.AxesHelper(5);
        this.scene.add(this.axesHelper);
        console.log('已添加坐标轴辅助');
        addInitLog('已添加坐标轴辅助');

        // 创建相机
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.camera.position.set(0, 3, 10); // 调整相机位置，看得更远更清晰
        this.camera.lookAt(0, 0, 0); // 让相机看向原点
        console.log('相机已初始化，位置:', this.camera.position);
        addInitLog('相机已初始化，位置: (' + this.camera.position.x + ', ' + this.camera.position.y + ', ' + this.camera.position.z + ')');

        // 创建渲染器
        this.renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setClearColor(0x000000, 0); // 透明背景
        console.log('渲染器已初始化');
        addInitLog('渲染器已初始化');

        // 将渲染器的domElement添加到页面
        let container;
        const heroSection = document.querySelector('.hero');
        if (heroSection) {
            container = heroSection;
            console.log('找到了hero区域');
            addInitLog('找到了hero区域作为容器');
        } else {
            console.warn('未找到hero区域，创建默认容器');
            // 创建备用容器
            container = document.createElement('div');
            container.style.width = '100%';
            container.style.height = '100vh';
            container.style.position = 'relative';
            document.body.appendChild(container);
            console.log('创建了备用容器');
            addInitLog('未找到hero区域，创建了备用容器');
        }
        container.style.position = 'relative';
        container.appendChild(this.renderer.domElement);
        console.log('渲染器已添加到DOM');
        addInitLog('渲染器已添加到DOM');

        // 调整hero-content的z-index，确保它在3D场景上方
        const heroContent = document.querySelector('.hero-content');
        if (heroContent) {
            heroContent.style.position = 'relative';
            heroContent.style.zIndex = 10;
        }

        // 初始化轨道控制器
        try {
            this.controls = new OrbitControls(this.camera, this.renderer.domElement);
            this.controls.enableDamping = true;
            this.controls.dampingFactor = 0.05;
            this.controls.rotateSpeed = 0.5;
            this.controls.zoomSpeed = 0.5;
            this.hasControls = true;
            this.autoRotate = false; // 禁用自动旋转
            console.log('轨道控制器初始化成功，已禁用自动旋转');
            addInitLog('轨道控制器初始化成功，已禁用自动旋转');

            // 隐藏轨道控制器警告（如果存在）
            const warning = document.getElementById('orbit-controls-warning');
            if (warning) {
                warning.style.display = 'none';
            }
        } catch (error) {
            console.error('初始化轨道控制器失败:', error);
            addInitLog('初始化轨道控制器失败: ' + error.message);
            this.hasControls = false;
            this.autoRotate = true;
            console.log('启用自动旋转模式');
            addInitLog('启用自动旋转模式');
            // 显示警告
            const warning = document.getElementById('orbit-controls-warning');
            if (warning) {
                warning.style.display = 'block';
            }
        }

        // 添加环境光
        this.ambientLight = new THREE.AmbientLight(0xffffff, 0.9); // 增加环境光强度
        this.scene.add(this.ambientLight);
        console.log('已添加环境光');
        addInitLog('已添加环境光');

        // 添加方向光
        this.directionalLight = new THREE.DirectionalLight(0xffffff, 1.2); // 增加方向光强度
        this.directionalLight.position.set(5, 10, 7.5);
        this.directionalLight.castShadow = true;
        this.scene.add(this.directionalLight);
        console.log('已添加方向光');
        addInitLog('已添加方向光');

        // 添加展厅
        this.createGallery();
        console.log('已创建展厅和奖状');
        addInitLog('已创建展厅和奖状');

        // 开始动画循环
        this.animate();
        console.log('动画循环已开始');
        addInitLog('动画循环已开始');

        // 监听窗口大小变化
        window.addEventListener('resize', () => this.onWindowResize());

        console.log('3D场景初始化完成');
        addInitLog('3D场景初始化完成!');

        // 添加场景调试信息
        this.showDebugInfo();
    }

    showDebugInfo() {
        // 显示场景中对象数量
        console.log('场景中对象数量:', this.scene.children.length);

        // 创建简单的调试UI
        const debugDiv = document.createElement('div');
        debugDiv.style.position = 'fixed';
        debugDiv.style.bottom = '20px';
        debugDiv.style.left = '20px';
        debugDiv.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
        debugDiv.style.color = 'white';
        debugDiv.style.padding = '10px';
        debugDiv.style.borderRadius = '5px';
        debugDiv.style.zIndex = '1000';

        let controlInfo = '';
        if (this.hasControls) {
            controlInfo = '<div>使用鼠标拖拽旋转视角</div><div>使用滚轮缩放场景</div>';
        } else {
            controlInfo = '<div>轨道控制器不可用，场景自动旋转中</div><div>点击页面可暂停/继续旋转</div>';
        }

        debugDiv.innerHTML = `
            <div>3D场景调试信息</div>
            <div>相机位置: X=${this.camera.position.x.toFixed(2)}, Y=${this.camera.position.y.toFixed(2)}, Z=${this.camera.position.z.toFixed(2)}</div>
            <div>场景对象数量: ${this.scene.children.length}</div>
            <div>Three.js状态: ${threeJsLoaded ? '已加载' : '未加载'}</div>
            <div>OrbitControls状态: ${orbitControlsLoaded ? '已加载' : '未加载'}</div>
            ${controlInfo}
        `;
        document.body.appendChild(debugDiv);

        // 添加点击暂停/继续旋转功能
        if (!this.hasControls) {
            const toggleRotation = () => {
                this.autoRotate = !this.autoRotate;
                const status = this.autoRotate ? '启用' : '禁用';
                console.log('自动旋转已' + status);
                // 更新调试信息
                debugDiv.innerHTML = debugDiv.innerHTML.replace(
                    /点击页面可.*旋转.*$/m,
                    `点击页面可${this.autoRotate ? '暂停' : '继续'}旋转 (当前: ${this.autoRotate ? '旋转中' : '已暂停'})`
                );
                // 更新全局调试信息
                if (document.getElementById('debug-info')) {
                    const debugElement = document.getElementById('debug-info');
                    debugElement.innerHTML = debugElement.innerHTML.replace(
                        /自动旋转: .*$/m,
                        `自动旋转: ${status}`
                    );
                }
            };
            document.addEventListener('click', toggleRotation);
            // 添加自动旋转状态到调试信息
            debugDiv.innerHTML += `<div>自动旋转: 启用</div>`;
        }
    }

    createGallery() {
        // 创建展厅墙壁
        const wallGeometry = new THREE.PlaneGeometry(10, 6);
        const wallMaterial = new THREE.MeshLambertMaterial({ color: 0x2c3e50, side: THREE.DoubleSide }); // 使用Lambert材质

        // 后墙
        const backWall = new THREE.Mesh(wallGeometry, wallMaterial);
        backWall.position.z = -5;
        this.scene.add(backWall);

        // 左墙
        const leftWall = new THREE.Mesh(wallGeometry, wallMaterial);
        leftWall.position.x = -5;
        leftWall.rotation.y = Math.PI / 2;
        this.scene.add(leftWall);

        // 右墙
        const rightWall = new THREE.Mesh(wallGeometry, wallMaterial);
        rightWall.position.x = 5;
        rightWall.rotation.y = -Math.PI / 2;
        this.scene.add(rightWall);

        // 添加奖状
        this.createCertificates();
    }

    createCertificates() {
        // 创建奖状的函数
        const createCertificate = (x, y, z, rotationY = 0) => {
            // 奖状框架
            const frameGeometry = new THREE.BoxGeometry(2, 2.8, 0.1);
            const frameMaterial = new THREE.MeshLambertMaterial({ color: 0xc9b037 }); // 使用Lambert材质以支持光照
            const frame = new THREE.Mesh(frameGeometry, frameMaterial);

            // 奖状内容
            const certificateGeometry = new THREE.PlaneGeometry(1.8, 2.6);
            const certificateMaterial = new THREE.MeshLambertMaterial({
                color: 0xffffff,
                side: THREE.DoubleSide,
                transparent: true,
                opacity: 0.9
            });
            const certificate = new THREE.Mesh(certificateGeometry, certificateMaterial);
            certificate.position.z = 0.06;

            // 奖状文本（使用纹理替代简单平面）
            // 创建一个简单的纹理包含文字
            const canvas = document.createElement('canvas');
            canvas.width = 512;
            canvas.height = 512;
            const context = canvas.getContext('2d');
            context.fillStyle = 'white';
            context.fillRect(0, 0, canvas.width, canvas.height);
            context.fillStyle = 'black';
            context.font = '30px Arial';
            context.textAlign = 'center';
            context.fillText('荣誉证书', canvas.width / 2, canvas.height / 2 - 50);
            context.font = '20px Arial';
            context.fillText('优秀教师', canvas.width / 2, canvas.height / 2);
            context.fillText('2023年度', canvas.width / 2, canvas.height / 2 + 50);

            const texture = new THREE.CanvasTexture(canvas);
            const textMaterial = new THREE.MeshBasicMaterial({
                map: texture,
                side: THREE.DoubleSide
            });
            const textGeometry = new THREE.PlaneGeometry(1.5, 2);
            const text = new THREE.Mesh(textGeometry, textMaterial);
            text.position.z = 0.07;

            // 将文本添加到奖状
            certificate.add(text);

            // 将奖状添加到框架
            frame.add(certificate);

            // 设置位置和旋转
            frame.position.set(x, y, z);
            frame.rotation.y = rotationY;

            // 添加到场景
            this.scene.add(frame);
        };

        // 添加多个奖状
        createCertificate(-3, 1, -4);
        createCertificate(0, 1, -4);
        createCertificate(3, 1, -4);
        createCertificate(-4, 1, -2, Math.PI / 4);
        createCertificate(4, 1, -2, -Math.PI / 4);

        // 添加地板
        const floorGeometry = new THREE.PlaneGeometry(15, 15);
        const floorMaterial = new THREE.MeshLambertMaterial({ color: 0x444444, side: THREE.DoubleSide });
        const floor = new THREE.Mesh(floorGeometry, floorMaterial);
        floor.rotation.x = Math.PI / 2;
        floor.position.y = -2;
        this.scene.add(floor);

        console.log('已添加5个奖状和地板');
    }

    onWindowResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }

    animate() {
            requestAnimationFrame(() => this.animate());

            if (this.hasControls) {
                this.controls.update();
            } else if (this.autoRotate) {
                // 自动旋转相机
                const time = Date.now() * this.autoRotateSpeed;
                this.camera.position.x = Math.sin(time) * 10;
                this.camera.position.z = Math.cos(time) * 10;
                this.camera.lookAt(0, 0, 0);
                console.log('自动旋转中...');
            }

            this.renderer.render(this.scene, this.camera);
        }
}

// 当DOM加载完成后初始化3D场景
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        // 延迟初始化，确保所有资源已加载
        setTimeout(init, 500);
    });
} else {
    // 如果DOM已经加载完成，直接初始化
    setTimeout(init, 500);
}