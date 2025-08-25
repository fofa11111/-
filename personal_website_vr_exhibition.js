// VR展厅脚本 - 基于Three.js

// 等待DOM加载完成
document.addEventListener('DOMContentLoaded', function() {
    // 由于我们已经在HTML中预先加载了所有必要的Three.js库文件
    // 直接初始化VR展厅
    init();

    // 3D场景初始化函数
    function init() {
        // 获取展厅容器
        const vrExhibitionContainer = document.getElementById('vr-exhibition-container');
        if (!vrExhibitionContainer) {
            console.error('VR展厅容器未找到');
            return;
        }
        
        // 设置容器样式
        vrExhibitionContainer.style.width = '100%';
        vrExhibitionContainer.style.height = '600px';
        vrExhibitionContainer.style.position = 'relative';
        vrExhibitionContainer.style.overflow = 'hidden';

        // 场景
        const scene = new THREE.Scene();
        scene.background = new THREE.Color(0x12122a); // 科技风背景色

        // 创建星空背景
        createStarfield(scene);

        // 相机
        const containerWidth = vrExhibitionContainer.clientWidth;
        const containerHeight = vrExhibitionContainer.clientHeight;
        const camera = new THREE.PerspectiveCamera(60, containerWidth / containerHeight, 0.1, 2000);
        camera.position.set(0, 1.6, 3); // 设置合适的高度，模拟人眼高度

        // 渲染器
        const renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setSize(containerWidth, containerHeight);
        renderer.setPixelRatio(window.devicePixelRatio);
        vrExhibitionContainer.appendChild(renderer.domElement);

        // 初始化VR效果相关变量（注意：VRControls.js和VREffect.js当前不可用）
        let effect = null;
        let vrEnabled = false;
        let vrButton = null;
        let vrControls = null;

        // 环境光 - 调整为科技风的蓝色调
        const ambientLight = new THREE.AmbientLight(0x404040, 0.8);
        scene.add(ambientLight);

        // 方向光 - 蓝色科技光
        const directionalLight = new THREE.DirectionalLight(0x00aaff, 1.0);
        directionalLight.position.set(1, 1, 1);
        scene.add(directionalLight);

        // 添加点光源以增强科技感
        const pointLight1 = new THREE.PointLight(0x00ffaa, 0.8, 10);
        pointLight1.position.set(-3, 2, 0);
        scene.add(pointLight1);

        const pointLight2 = new THREE.PointLight(0x00aaff, 0.8, 10);
        pointLight2.position.set(3, 2, 0);
        scene.add(pointLight2);

        // 创建科技风格展厅
        createTechExhibitionHall(scene);

        // 创建3D证书展示
        create3DCertificates(scene);

        // 轨道控制器
        let controls;
        let hasControls = false;
        let autoRotate = false;
        const autoRotateSpeed = 0.002;

        try {
            if (typeof THREE.OrbitControls !== 'undefined') {
                controls = new THREE.OrbitControls(camera, renderer.domElement);
                controls.enableDamping = true;
                controls.dampingFactor = 0.05;
                controls.rotateSpeed = 0.5;
                controls.zoomSpeed = 0.5;
                controls.panSpeed = 0.5;
                controls.enablePan = true;
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

            // 没有VR控制器，使用轨道控制器或自动旋转
            if (hasControls) {
                controls.update();
            } else if (autoRotate) {
                scene.rotation.y += autoRotateSpeed;
            }

            // 闪烁的灯光效果
            updateLights();

            // 直接使用渲染器渲染场景（不使用VR效果）
            renderer.render(scene, camera);
        }

        animate();

        // 更新灯光效果
        function updateLights() {
            const time = Date.now() * 0.001;
            pointLight1.intensity = 0.8 + 0.2 * Math.sin(time * 2);
            pointLight2.intensity = 0.8 + 0.2 * Math.cos(time * 2);
        }

        // 响应式调整
        function handleResize() {
            const containerWidth = vrExhibitionContainer.clientWidth;
            const containerHeight = vrExhibitionContainer.clientHeight;
            
            camera.aspect = containerWidth / containerHeight;
            camera.updateProjectionMatrix();
            
            if (vrEnabled && effect) {
                effect.setSize(containerWidth, containerHeight);
            }
            renderer.setSize(containerWidth, containerHeight);
        }
        
        // 初始调整
        handleResize();
        
        // 监听窗口大小变化
        window.addEventListener('resize', handleResize);
    }

    // 创建星空背景
    function createStarfield(scene) {
        const starGeometry = new THREE.BufferGeometry();
        const starCount = 1000;
        const positions = new Float32Array(starCount * 3);
        const colors = new Float32Array(starCount * 3);
        
        for (let i = 0; i < starCount; i++) {
            const i3 = i * 3;
            
            // 随机位置
            positions[i3] = (Math.random() - 0.5) * 1000;
            positions[i3 + 1] = (Math.random() - 0.5) * 1000;
            positions[i3 + 2] = -Math.random() * 1000; // 只在相机后面
            
            // 随机颜色 - 主要是蓝色和白色
            const color = new THREE.Color();
            if (Math.random() > 0.7) {
                color.setHSL(0.6, 0.8, 0.8); // 蓝色
            } else {
                color.setHSL(0, 0, Math.random() * 0.5 + 0.5); // 白色调
            }
            
            colors[i3] = color.r;
            colors[i3 + 1] = color.g;
            colors[i3 + 2] = color.b;
        }
        
        starGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        starGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        
        const starMaterial = new THREE.PointsMaterial({
            size: 2,
            vertexColors: true,
            transparent: true,
            opacity: 0.8
        });
        
        const starField = new THREE.Points(starGeometry, starMaterial);
        scene.add(starField);
    }

    // 创建科技风格展厅
    function createTechExhibitionHall(scene) {
        // 地板 - 科技风格网格
        const floorGeometry = new THREE.PlaneGeometry(20, 20);
        const floorMaterial = new THREE.MeshStandardMaterial({
            color: 0x1a1a3a,
            metalness: 0.3,
            roughness: 0.4
        });
        const floor = new THREE.Mesh(floorGeometry, floorMaterial);
        floor.rotation.x = -Math.PI / 2;
        floor.position.y = -1;
        scene.add(floor);

        // 添加地板网格线
        const gridHelper = new THREE.GridHelper(20, 20, 0x00aaff, 0x1a1a3a);
        gridHelper.position.y = -0.99;
        scene.add(gridHelper);

        // 墙壁 - 半透明玻璃效果
        const wallGeometry = new THREE.PlaneGeometry(20, 10);
        const wallMaterial = new THREE.MeshStandardMaterial({
            color: 0x1a1a3a,
            transparent: true,
            opacity: 0.3,
            metalness: 0.8,
            roughness: 0.2
        });

        // 后墙
        const backWall = new THREE.Mesh(wallGeometry, wallMaterial);
        backWall.position.z = -10;
        backWall.position.y = 4;
        scene.add(backWall);

        // 左墙
        const leftWall = new THREE.Mesh(wallGeometry, wallMaterial);
        leftWall.rotation.y = Math.PI / 2;
        leftWall.position.x = -10;
        leftWall.position.y = 4;
        scene.add(leftWall);

        // 右墙
        const rightWall = new THREE.Mesh(wallGeometry, wallMaterial);
        rightWall.rotation.y = -Math.PI / 2;
        rightWall.position.x = 10;
        rightWall.position.y = 4;
        scene.add(rightWall);

        // 添加边框线条
        addWallBorders(scene);
    }

    // 添加墙壁边框线条
    function addWallBorders(scene) {
        const borderMaterial = new THREE.LineBasicMaterial({ color: 0x00aaff, linewidth: 2 });
        
        // 地板边框
        const floorBorderGeometry = new THREE.BufferGeometry().setFromPoints([
            new THREE.Vector3(-10, -0.99, -10),
            new THREE.Vector3(10, -0.99, -10),
            new THREE.Vector3(10, -0.99, 10),
            new THREE.Vector3(-10, -0.99, 10),
            new THREE.Vector3(-10, -0.99, -10)
        ]);
        const floorBorder = new THREE.Line(floorBorderGeometry, borderMaterial);
        scene.add(floorBorder);
        
        // 后墙边框
        const backWallBorderGeometry = new THREE.BufferGeometry().setFromPoints([
            new THREE.Vector3(-10, 4 - 5, -10),
            new THREE.Vector3(10, 4 - 5, -10),
            new THREE.Vector3(10, 4 + 5, -10),
            new THREE.Vector3(-10, 4 + 5, -10),
            new THREE.Vector3(-10, 4 - 5, -10)
        ]);
        const backWallBorder = new THREE.Line(backWallBorderGeometry, borderMaterial);
        scene.add(backWallBorder);
    }

    // 创建3D证书展示
    function create3DCertificates(scene) {
        // 证书1 - 放在正面
        createCertificate(scene, 0, 1, -3, 0);
        
        // 证书2 - 放在左侧
        createCertificate(scene, -5, 1, 0, Math.PI/2);
        
        // 证书3 - 放在右侧
        createCertificate(scene, 5, 1, 0, -Math.PI/2);
        
        // 添加悬浮效果的粒子
        addFloatingParticles(scene);
    }

    // 创建单个证书
    function createCertificate(scene, x, y, z, rotationY) {
        // 证书框架 - 金色效果
        const frameGeometry = new THREE.BoxGeometry(2, 2.8, 0.1);
        const frameMaterial = new THREE.MeshStandardMaterial({
            color: 0xe6b800,
            metalness: 0.8,
            roughness: 0.3
        });
        const frame = new THREE.Mesh(frameGeometry, frameMaterial);
        frame.position.set(x, y, z);
        frame.rotation.y = rotationY;
        scene.add(frame);

        // 证书内容 - 白色背景
        const contentGeometry = new THREE.PlaneGeometry(1.8, 2.6);
        const contentMaterial = new THREE.MeshStandardMaterial({
            color: 0xffffff,
            metalness: 0.1,
            roughness: 0.6
        });
        const content = new THREE.Mesh(contentGeometry, contentMaterial);
        content.position.set(x, y, z - 0.05);
        content.rotation.y = rotationY;
        scene.add(content);

        // 证书文字效果 - 简化表示
        const textGeometry = new THREE.PlaneGeometry(1.5, 1);
        const textMaterial = new THREE.MeshBasicMaterial({
            color: 0x000000,
            transparent: true,
            opacity: 0.5
        });
        const text = new THREE.Mesh(textGeometry, textMaterial);
        text.position.set(x, y, z - 0.02);
        text.rotation.y = rotationY;
        scene.add(text);

        // 添加发光效果
        const glowGeometry = new THREE.PlaneGeometry(1.9, 2.7);
        const glowMaterial = new THREE.MeshBasicMaterial({
            color: 0x00aaff,
            transparent: true,
            opacity: 0.1
        });
        const glow = new THREE.Mesh(glowGeometry, glowMaterial);
        glow.position.set(x, y, z - 0.12);
        glow.rotation.y = rotationY;
        scene.add(glow);
    }

    // 添加悬浮粒子效果
    function addFloatingParticles(scene) {
        const particleGeometry = new THREE.BufferGeometry();
        const particleCount = 100;
        const positions = new Float32Array(particleCount * 3);
        const colors = new Float32Array(particleCount * 3);
        const sizes = new Float32Array(particleCount);
        
        for (let i = 0; i < particleCount; i++) {
            const i3 = i * 3;
            
            // 随机位置在展厅内
            positions[i3] = (Math.random() - 0.5) * 18;
            positions[i3 + 1] = Math.random() * 5 + 0.5; // 0.5-5.5米高
            positions[i3 + 2] = (Math.random() - 0.5) * 18;
            
            // 随机颜色 - 蓝色和青色
            const hue = Math.random() * 0.2 + 0.5; // 蓝色到青色范围
            const color = new THREE.Color().setHSL(hue, 0.8, 0.8);
            
            colors[i3] = color.r;
            colors[i3 + 1] = color.g;
            colors[i3 + 2] = color.b;
            
            // 随机大小
            sizes[i] = Math.random() * 0.05 + 0.01;
        }
        
        particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        particleGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        particleGeometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
        
        const particleMaterial = new THREE.PointsMaterial({
            vertexColors: true,
            transparent: true,
            opacity: 0.8,
            sizeAttenuation: true
        });
        
        const particles = new THREE.Points(particleGeometry, particleMaterial);
        scene.add(particles);
        
        // 动画粒子
        function animateParticles() {
            requestAnimationFrame(animateParticles);
            
            const positions = particles.geometry.attributes.position.array;
            const time = Date.now() * 0.001;
            
            for (let i = 0; i < positions.length; i += 3) {
                // 轻微浮动效果
                positions[i + 1] += Math.sin(time + i) * 0.0005;
                
                // 限制Y轴范围
                if (positions[i + 1] > 5.5) positions[i + 1] = 5.5;
                if (positions[i + 1] < 0.5) positions[i + 1] = 0.5;
            }
            
            particles.geometry.attributes.position.needsUpdate = true;
        }
        
        animateParticles();
    }

    // 创建VR模式切换按钮
    function createVRButton(display, effect, container) {
        const vrButton = document.createElement('button');
        vrButton.textContent = '进入VR模式';
        vrButton.style.position = 'absolute';
        vrButton.style.bottom = '20px';
        vrButton.style.right = '20px';
        vrButton.style.padding = '10px 20px';
        vrButton.style.backgroundColor = '#00aaff';
        vrButton.style.color = 'white';
        vrButton.style.border = 'none';
        vrButton.style.borderRadius = '5px';
        vrButton.style.cursor = 'pointer';
        vrButton.style.fontSize = '16px';
        vrButton.style.zIndex = '100';
        vrButton.style.transition = 'all 0.3s ease';
        
        vrButton.addEventListener('mouseover', function() {
            this.style.backgroundColor = '#0077cc';
            this.style.boxShadow = '0 0 15px rgba(0, 170, 255, 0.5)';
        });
        
        vrButton.addEventListener('mouseout', function() {
            this.style.backgroundColor = '#00aaff';
            this.style.boxShadow = 'none';
        });
        
        vrButton.addEventListener('click', function() {
            if (!document.fullscreenElement) {
                // 进入VR全屏模式
                container.requestFullscreen().then(function() {
                    effect.setFullScreen(true);
                    vrButton.textContent = '退出VR模式';
                }).catch(function(error) {
                    console.error('无法进入全屏模式:', error);
                });
            } else {
                // 退出VR全屏模式
                document.exitFullscreen().then(function() {
                    effect.setFullScreen(false);
                    vrButton.textContent = '进入VR模式';
                }).catch(function(error) {
                    console.error('无法退出全屏模式:', error);
                });
            }
        });
        
        container.appendChild(vrButton);
    }
});