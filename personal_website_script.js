// 个人网站脚本文件，集成3D证书展示场景

// 等待DOM加载完成
document.addEventListener('DOMContentLoaded', function() {
    // 初始化函数
    function init() {
        // 检查是否已加载Three.js
        if (typeof THREE === 'undefined') {
            console.error('Three.js 未加载');
            return;
        }

        // 检查是否存在证书展示区域
        const certificateSection = document.getElementById('certificates');
        if (!certificateSection) {
            console.error('未找到证书展示区域');
            return;
        }

        // 创建场景、相机和渲染器
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, certificateSection.clientWidth / certificateSection.clientHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
        renderer.setSize(certificateSection.clientWidth, certificateSection.clientHeight);
        renderer.setClearColor(0x000000, 0); // 透明背景

        // 添加到DOM
        certificateSection.appendChild(renderer.domElement);

        // 添加坐标轴辅助
        const axesHelper = new THREE.AxesHelper(5);
        scene.add(axesHelper);

        // 设置相机位置
        camera.position.set(0, 3, 10);
        camera.lookAt(0, 0, 0);

        // 添加环境光
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.9);
        scene.add(ambientLight);

        // 添加方向光
        const directionalLight = new THREE.DirectionalLight(0xffffff, 1.2);
        directionalLight.position.set(5, 10, 7.5);
        directionalLight.castShadow = true;
        scene.add(directionalLight);

        // 创建展厅墙壁
        function createGallery() {
            const wallGeometry = new THREE.PlaneGeometry(10, 6);
            const wallMaterial = new THREE.MeshLambertMaterial({ color: 0x2c3e50, side: THREE.DoubleSide });

            // 后墙
            const backWall = new THREE.Mesh(wallGeometry, wallMaterial);
            backWall.position.z = -5;
            scene.add(backWall);

            // 左墙
            const leftWall = new THREE.Mesh(wallGeometry, wallMaterial);
            leftWall.position.x = -5;
            leftWall.rotation.y = Math.PI / 2;
            scene.add(leftWall);

            // 右墙
            const rightWall = new THREE.Mesh(wallGeometry, wallMaterial);
            rightWall.position.x = 5;
            rightWall.rotation.y = -Math.PI / 2;
            scene.add(rightWall);

            // 添加地板
            const floorGeometry = new THREE.PlaneGeometry(15, 15);
            const floorMaterial = new THREE.MeshLambertMaterial({ color: 0x444444, side: THREE.DoubleSide });
            const floor = new THREE.Mesh(floorGeometry, floorMaterial);
            floor.rotation.x = Math.PI / 2;
            floor.position.y = -2;
            scene.add(floor);

            // 添加奖状
            createCertificates();
        }

        // 创建奖状
        function createCertificates() {
            // 创建奖状的函数
            function createCertificate(x, y, z, rotationY = 0) {
                // 奖状框架
                const frameGeometry = new THREE.BoxGeometry(2, 2.8, 0.1);
                const frameMaterial = new THREE.MeshLambertMaterial({ color: 0xc9b037 });
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

                // 奖状文本
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
                scene.add(frame);
            }

            // 添加多个奖状
            createCertificate(-3, 1, -4);
            createCertificate(0, 1, -4);
            createCertificate(3, 1, -4);
            createCertificate(-4, 1, -2, Math.PI / 4);
            createCertificate(4, 1, -2, -Math.PI / 4);
        }

        // 初始化轨道控制器
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
                hasControls = true;
                autoRotate = false;
            } else {
                console.warn('OrbitControls 未加载，启用自动旋转模式');
                hasControls = false;
                autoRotate = true;
            }
        } catch (error) {
            console.error('初始化轨道控制器失败:', error);
            hasControls = false;
            autoRotate = true;
        }

        // 动画循环
        function animate() {
            requestAnimationFrame(animate);

            if (hasControls) {
                controls.update();
            } else if (autoRotate) {
                // 自动旋转相机
                const time = Date.now() * autoRotateSpeed;
                camera.position.x = Math.sin(time) * 10;
                camera.position.z = Math.cos(time) * 10;
                camera.lookAt(0, 0, 0);
            }

            renderer.render(scene, camera);
        }

        // 监听窗口大小变化
        function onWindowResize() {
            camera.aspect = certificateSection.clientWidth / certificateSection.clientHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(certificateSection.clientWidth, certificateSection.clientHeight);
        }

        window.addEventListener('resize', onWindowResize);

        // 创建展厅
        createGallery();

        // 开始动画
        animate();

        console.log('3D证书场景初始化完成');
    }

    // 检查是否已经加载了Three.js
if (typeof THREE === 'undefined') {
    console.error('Three.js 未加载');
    // 尝试加载Three.js
    const script = document.createElement('script');
    script.src = 'three.min.js';
    script.onload = function() {
        // 加载OrbitControls
        const orbitScript = document.createElement('script');
        orbitScript.src = 'OrbitControls.js';
        orbitScript.onload = function() {
            init();
        };
        document.head.appendChild(orbitScript);
    };
    document.head.appendChild(script);
} else {
    console.log('OrbitControls 已通过CDN加载');
    init();
} else {
    // 两者均已加载，初始化场景
    init();
}
});