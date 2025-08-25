// 修复后的个人网站脚本

// 等待DOM加载完成
document.addEventListener('DOMContentLoaded', function() {
    // 检查Three.js是否已加载
    if (typeof THREE === 'undefined') {
        console.error('Three.js 未加载');
        // 尝试加载Three.js
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/three@0.132.2/build/three.min.js';
        script.onload = function() {
            // 检查OrbitControls是否已加载
            if (typeof THREE.OrbitControls === 'undefined') {
                console.error('OrbitControls 未加载');
                // 尝试加载OrbitControls
                const orbitScript = document.createElement('script');
                orbitScript.src = 'https://cdn.jsdelivr.net/npm/three@0.132.2/examples/js/controls/OrbitControls.js';
                orbitScript.onload = function() {
                    init();
                };
                document.head.appendChild(orbitScript);
            } else {
                console.log('OrbitControls 已通过CDN加载');
                init();
            }
        };
        document.head.appendChild(script);
    } else if (typeof THREE.OrbitControls === 'undefined') {
        console.error('OrbitControls 未加载');
        // 尝试加载OrbitControls
        const orbitScript = document.createElement('script');
        orbitScript.src = 'https://cdn.jsdelivr.net/npm/three@0.132.2/examples/js/controls/OrbitControls.js';
        orbitScript.onload = function() {
            init();
        };
        document.head.appendChild(orbitScript);
    } else {
        // 两者均已加载，初始化场景
        init();
    }

    // 3D场景初始化函数
    function init() {
        // 获取展厅容器
        const exhibitionContainer = document.getElementById('exhibition-container');
        if (!exhibitionContainer) {
            console.error('展厅容器未找到');
            return;
        }
        
        // 设置容器样式
        exhibitionContainer.style.width = '100%';
        exhibitionContainer.style.height = '400px';
        exhibitionContainer.style.position = 'relative';
        exhibitionContainer.style.overflow = 'hidden';

        // 场景
        const scene = new THREE.Scene();
        scene.background = new THREE.Color(0xf0f0f0);

        // 相机 - 使用容器尺寸
        const containerWidth = exhibitionContainer.clientWidth;
        const containerHeight = exhibitionContainer.clientHeight;
        const camera = new THREE.PerspectiveCamera(60, containerWidth / containerHeight, 0.1, 1000);
        camera.position.set(0, 1, 3);

        // 渲染器
        const renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setSize(containerWidth, containerHeight);
        exhibitionContainer.appendChild(renderer.domElement);

        // 坐标轴辅助
        const axesHelper = new THREE.AxesHelper(5);
        scene.add(axesHelper);

        // 环境光
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        scene.add(ambientLight);

        // 方向光
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(1, 1, 1);
        scene.add(directionalLight);

        // 创建展厅
        createExhibitionHall(scene);

        // 证书
        createCertificate(scene);

        // 轨道控制器
        let controls;
        let hasControls = false;
        let autoRotate = false;
        const autoRotateSpeed = 0.005;

        try {
            if (typeof THREE.OrbitControls !== 'undefined') {
                controls = new THREE.OrbitControls(camera, renderer.domElement);
                controls.enableDamping = true;
                controls.dampingFactor = 0.05;
                controls.rotateSpeed = 0.5;
                controls.zoomSpeed = 0.5;
                controls.panSpeed = 0.5;
                hasControls = true;
            } else {
                console.warn('OrbitControls 未定义，启用自动旋转');
                autoRotate = true;
            }
        } catch (e) {
            console.error('创建OrbitControls失败:', e);
            autoRotate = true;
        }

        // 动画循环
        function animate() {
            requestAnimationFrame(animate);

            if (hasControls) {
                controls.update();
            } else if (autoRotate) {
                scene.rotation.y += autoRotateSpeed;
            }

            renderer.render(scene, camera);
        }

        animate();

        // 响应式调整 - 针对展厅容器
        function handleResize() {
            const containerWidth = exhibitionContainer.clientWidth;
            const containerHeight = exhibitionContainer.clientHeight;
            
            camera.aspect = containerWidth / containerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(containerWidth, containerHeight);
        }
        
        // 初始调整
        handleResize();
        
        // 监听窗口大小变化
        window.addEventListener('resize', handleResize);
    }

    // 创建展厅
    function createExhibitionHall(scene) {
        // 地板
        const floorGeometry = new THREE.PlaneGeometry(10, 10);
        const floorMaterial = new THREE.MeshLambertMaterial({ color: 0xcccccc });
        const floor = new THREE.Mesh(floorGeometry, floorMaterial);
        floor.rotation.x = -Math.PI / 2;
        floor.position.y = -1;
        scene.add(floor);

        // 墙壁
        const wallGeometry = new THREE.PlaneGeometry(10, 4);
        const wallMaterial = new THREE.MeshLambertMaterial({ color: 0xffffff });

        // 后墙
        const backWall = new THREE.Mesh(wallGeometry, wallMaterial);
        backWall.position.z = -5;
        backWall.position.y = 1;
        scene.add(backWall);

        // 左墙
        const leftWall = new THREE.Mesh(wallGeometry, wallMaterial);
        leftWall.rotation.y = Math.PI / 2;
        leftWall.position.x = -5;
        leftWall.position.y = 1;
        scene.add(leftWall);

        // 右墙
        const rightWall = new THREE.Mesh(wallGeometry, wallMaterial);
        rightWall.rotation.y = -Math.PI / 2;
        rightWall.position.x = 5;
        rightWall.position.y = 1;
        scene.add(rightWall);
    }

    // 创建证书
    function createCertificate(scene) {
        // 证书框架
        const frameGeometry = new THREE.BoxGeometry(2, 2.8, 0.1);
        const frameMaterial = new THREE.MeshLambertMaterial({ color: 0xe6b800 });
        const frame = new THREE.Mesh(frameGeometry, frameMaterial);
        frame.position.set(0, 0, -2);
        scene.add(frame);

        // 证书内容
        const contentGeometry = new THREE.PlaneGeometry(1.8, 2.6);
        const contentMaterial = new THREE.MeshLambertMaterial({ color: 0xffffff });
        const content = new THREE.Mesh(contentGeometry, contentMaterial);
        content.position.set(0, 0, -1.95);
        scene.add(content);

        // 证书文本 (简化表示)
        const textGeometry = new THREE.PlaneGeometry(1.5, 1);
        const textMaterial = new THREE.MeshBasicMaterial({
            color: 0x000000,
            transparent: true,
            opacity: 0.7
        });
        const text = new THREE.Mesh(textGeometry, textMaterial);
        text.position.set(0, 0, -1.9);
        scene.add(text);
    }
});