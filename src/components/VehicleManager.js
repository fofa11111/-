import * as THREE from 'three';

class Vehicle {
    constructor(position, direction, speed, color) {
        this.position = new THREE.Vector3().copy(position);
        this.direction = new THREE.Vector3().copy(direction);
        this.speed = speed;
        this.color = color || 0x3498db;
        this.mesh = this.createVehicleMesh();
        this.isStopped = false;
        this.hasCrossedLine = false;
        this.violating = false;
        this.boundingBox = new THREE.Box3();
        this.updateBoundingBox();
    }

    createVehicleMesh() {
        // 创建车辆主体（流线型设计）
        const car = new THREE.Group();
        car.position.copy(this.position);
        car.castShadow = true;

        // 车身主体（流线型设计）
        // 高级金属漆材质
        const bodyMaterial = new THREE.MeshStandardMaterial({
            color: this.color,
            metalness: 0,
            roughness: 1.0,
            clearcoat: 1.0,
            clearcoatRoughness: 0.05,
            
        });
        // Pixel style doesn't use complex textures
        const bodyTextureLoader = new THREE.TextureLoader();
        
        

        // 像素风格使用纯色材质
        
        
        // Pixel style uses simple materials
// bodyMaterial.normalScale.set(0.5, 0.5);

        // 底盘（加宽车身，优化比例）
        const chassisGeometry = new THREE.BoxGeometry(4.2, 0.3, 1.9);
        const chassis = new THREE.Mesh(chassisGeometry, bodyMaterial);
        chassis.position.y = 0.25;
        car.add(chassis);

        // 车身（高级流线型设计）
        const bodyGeometry = new THREE.BoxGeometry(2.8, 1.2, 1.5);
        const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
        body.position.set(0, 0.9, 0);
        body.position.set(0, 0.45, 0);
        car.add(body);

        // 车身侧面轮廓
        const sideProfileGeometry = new THREE.BoxGeometry(3.6, 0.7, 1.7);
        const sideProfile = new THREE.Mesh(sideProfileGeometry, bodyMaterial);
        sideProfile.position.set(0, 0.85, 0);
        car.add(sideProfile);

        // 车门细节（流线型设计）
        // 车门把手（嵌入式设计）
        const handleMaterial = new THREE.MeshStandardMaterial({ color: 0xaaaaaa });
        const handleGeometry = new THREE.BoxGeometry(0.25, 0.04, 0.08);

        // 左侧门把手
        const leftFrontHandle = new THREE.Mesh(handleGeometry, handleMaterial);
        leftFrontHandle.position.set(0.5, 0.7, 0.92);
        car.add(leftFrontHandle);

        const leftRearHandle = new THREE.Mesh(handleGeometry, handleMaterial);
        leftRearHandle.position.set(-0.8, 0.7, 0.92);
        car.add(leftRearHandle);

        // 右侧门把手
        const rightFrontHandle = new THREE.Mesh(handleGeometry, handleMaterial);
        rightFrontHandle.position.set(0.5, 0.7, -0.92);
        car.add(rightFrontHandle);

        const rightRearHandle = new THREE.Mesh(handleGeometry, handleMaterial);
        rightRearHandle.position.set(-0.8, 0.7, -0.92);
        car.add(rightRearHandle);

        // 车顶（流线型设计，与车身融合）
        const roofGeometry = new THREE.CapsuleGeometry(0.85, 2.2, 4, 16);
        const roofMaterial = new THREE.MeshStandardMaterial({
            color: this.color,
            metalness: 0.3,
            roughness: 0.4
        });
        const roof = new THREE.Mesh(roofGeometry, roofMaterial);
        roof.position.set(-0.3, 1.1, 0);
        roof.rotation.z = Math.PI / 2;
        car.add(roof);

        // 前引擎盖（流线型过渡）
        const hoodGeometry = new THREE.BoxGeometry(1.8, 0.2, 1.6);
        const hood = new THREE.Mesh(hoodGeometry, bodyMaterial);
        hood.position.set(1.5, 0.9, 0);
        hood.rotation.x = 0.2;
        car.add(hood);

        // 车顶天线
        const antennaGeometry = new THREE.CylinderGeometry(0.02, 0.02, 0.3);
        const antenna = new THREE.Mesh(antennaGeometry, new THREE.MeshStandardMaterial({ color: 0xaaaaaa }));
        antenna.position.set(-0.5, 1.7, 0);
        car.add(antenna);

        const antennaTopGeometry = new THREE.SphereGeometry(0.05);
        const antennaTop = new THREE.Mesh(antennaTopGeometry, new THREE.MeshStandardMaterial({ color: 0x555555 }));
        antennaTop.position.set(-0.5, 1.9, 0);
        car.add(antennaTop);

        // 保险杠
        const bumperMaterial = new THREE.MeshStandardMaterial({ color: 0x333333 });
        // 前保险杠（流线型设计）
        const frontBumperGeometry = new THREE.BoxGeometry(4.0, 0.25, 1.8);
        const frontBumper = new THREE.Mesh(frontBumperGeometry, bumperMaterial);
        frontBumper.position.set(2.0, 0.25, 0);
        frontBumper.rotation.z = 0.1;
        car.add(frontBumper);

        // 后保险杠（带扩散器设计）
        const rearBumperGeometry = new THREE.BoxGeometry(4.0, 0.3, 1.8);
        const rearBumper = new THREE.Mesh(rearBumperGeometry, bumperMaterial);
        rearBumper.position.set(-2.0, 0.25, 0);
        car.add(rearBumper);

        // 后扩散器
        const diffuserGeometry = new THREE.BoxGeometry(3.5, 0.15, 0.3);
        const diffuser = new THREE.Mesh(diffuserGeometry, new THREE.MeshStandardMaterial({color: 0x222222}));
        diffuser.position.set(-2.2, 0.15, 0);
        car.add(diffuser);

        // 侧裙
        const sideSkirtGeometry = new THREE.BoxGeometry(3.8, 0.1, 0.5);
        const leftSkirt = new THREE.Mesh(sideSkirtGeometry, bumperMaterial);
        leftSkirt.position.set(0, 0.25, 0.9);
        car.add(leftSkirt);
        const rightSkirt = new THREE.Mesh(sideSkirtGeometry, bumperMaterial);
        rightSkirt.position.set(0, 0.25, -0.9);
        car.add(rightSkirt);

        // 排气管
        const exhaustMaterial = new THREE.MeshStandardMaterial({ color: 0x555555 });
        const exhaustGeometry = new THREE.CylinderGeometry(0.15, 0.15, 0.8, 16);

        const leftExhaust = new THREE.Mesh(exhaustGeometry, exhaustMaterial);
        leftExhaust.position.set(-2.5, 0.2, 0.4);
        leftExhaust.rotation.x = Math.PI / 2;
        car.add(leftExhaust);

        const rightExhaust = new THREE.Mesh(exhaustGeometry, exhaustMaterial);
        rightExhaust.position.set(-2.5, 0.2, -0.4);
        rightExhaust.rotation.x = Math.PI / 2;
        car.add(rightExhaust);

        // 添加车窗（分离式设计）
        // 高级车窗材质
        const windowMaterial = new THREE.MeshStandardMaterial({
            color: 0xa0c0ff,
            transparent: true,
            opacity: 0.85,
            roughness: 1.0,
            metalness: 0
        });
        // 像素风格车窗简化处理
        






        

        // 前挡风玻璃（流线型曲面）
        const frontWindowGeometry = new THREE.BoxGeometry(1.2, 0.6, 0.1);
        const frontWindow = new THREE.Mesh(frontWindowGeometry, windowMaterial);
        frontWindow.position.set(1.2, 1.2, 0);
        frontWindow.rotation.set(-0.2, 0, Math.PI/2);
        car.add(frontWindow);

        // 车窗（高级曲面设计）
        const sideWindowGeometry = new THREE.BoxGeometry(0.8, 0.5, 0.1);
        const leftWindow = new THREE.Mesh(sideWindowGeometry, windowMaterial);
        leftWindow.position.set(-0.2, 1.15, 0.92);
        leftWindow.rotation.set(0, Math.PI/2, Math.PI/2);
        car.add(leftWindow);

        // 后窗
        const rearWindowGeometry = new THREE.BoxGeometry(1.0, 0.4, 0.1);
        const rearWindow = new THREE.Mesh(rearWindowGeometry, windowMaterial);
        rearWindow.position.set(-1.5, 1.0, 0);
        rearWindow.rotation.set(0, 0, Math.PI/2);
        car.add(rearWindow);

        const rightWindow = new THREE.Mesh(sideWindowGeometry, windowMaterial);
        rightWindow.position.set(-0.2, 1.15, -0.92);
        rightWindow.rotation.set(0, Math.PI/2, -Math.PI/2);
        car.add(rightWindow);

        // 车轮（轮毂+轮胎组合）
        // 高级车轮材质
        const wheelMaterial = new THREE.MeshStandardMaterial({
            color: 0x222222,
            metalness: 0,
            roughness: 1.0
        });
        const rimMaterial = new THREE.MeshStandardMaterial({
            color: 0xcccccc,
            metalness: 0,
            roughness: 0.8
        });
        // 像素风格移除纹理
        // const rimTextureLoader = new THREE.TextureLoader();
        // const rimTexture = rimTextureLoader.load('https://threejs.org/examples/textures/roughness_map.jpg');
        // rimMaterial.roughnessMap = rimTexture;
        // rimMaterial.roughness = 0.5;

        // 创建单个车轮（更真实比例）
        const createWheel = (position) => {
            const wheelGroup = new THREE.Group();

            // 轮胎（增强胎面细节）
            const wheelGeometry = new THREE.CylinderGeometry(0.45, 0.45, 0.2, 8);
            const tire = new THREE.Mesh(wheelGeometry, wheelMaterial);
            tire.rotation.x = Math.PI / 2;
            wheelGroup.add(tire);

            // 轮毂（多辐条设计）
            const rimGeometry = new THREE.BoxGeometry(0.3, 0.3, 0.15);
            const rim = new THREE.Mesh(rimGeometry, rimMaterial);
            rim.rotation.x = Math.PI / 2;
            wheelGroup.add(rim);

            // 轮毂辐条（弯曲设计）
            const spokeGeometry = new THREE.BoxGeometry(0.35, 0.05, 0.05);
            for (let i = 0; i < 5; i++) {
                const spoke = new THREE.Mesh(spokeGeometry, rimMaterial);
                spoke.position.set(0, 0, 0);
                spoke.rotation.z = (i * Math.PI * 2) / 5;
                spoke.rotation.x = Math.PI / 2;
                spoke.position.x = 0.15; // 偏心设计
                wheelGroup.add(spoke);
            }

            // 轮毂中心盖
            const centerCapGeometry = new THREE.CircleGeometry(0.1, 32);
            const centerCap = new THREE.Mesh(centerCapGeometry, new THREE.MeshStandardMaterial({color: this.color}));
            centerCap.rotation.x = Math.PI / 2;
            wheelGroup.add(centerCap);

            wheelGroup.position.copy(position);
            wheelGroup.castShadow = true;
            return wheelGroup;
        };

        // 添加四个车轮
        car.add(createWheel(new THREE.Vector3(1.5, 0.3, 0.9)));
        car.add(createWheel(new THREE.Vector3(1.5, 0.3, -0.9)));
        car.add(createWheel(new THREE.Vector3(-1.5, 0.3, 0.9)));
        car.add(createWheel(new THREE.Vector3(-1.5, 0.3, -0.9)));

        // 添加侧后视镜
        const mirrorMaterial = new THREE.MeshStandardMaterial({ color: 0x333333 });
        const mirrorArmGeometry = new THREE.BoxGeometry(0.3, 0.1, 0.1);
        const mirrorHeadGeometry = new THREE.BoxGeometry(0.25, 0.2, 0.15);
        const mirrorGlassMaterial = new THREE.MeshStandardMaterial({ color: 0x88aacc, transparent: true, opacity: 0.7 });

        // 左侧后视镜
        const leftMirrorGroup = new THREE.Group();
        const leftMirrorArm = new THREE.Mesh(mirrorArmGeometry, mirrorMaterial);
        leftMirrorArm.position.set(1.7, 1.0, 0.8);
        leftMirrorGroup.add(leftMirrorArm);
        const leftMirrorHead = new THREE.Mesh(mirrorHeadGeometry, mirrorMaterial);
        leftMirrorHead.position.set(1.9, 1.0, 0.8);
        leftMirrorGroup.add(leftMirrorHead);
        const leftMirrorGlass = new THREE.Mesh(mirrorHeadGeometry, mirrorGlassMaterial);
        leftMirrorGlass.position.set(1.93, 1.0, 0.8);
        leftMirrorGroup.add(leftMirrorGlass);
        car.add(leftMirrorGroup);

        // 右侧后视镜
        const rightMirrorGroup = new THREE.Group();
        const rightMirrorArm = new THREE.Mesh(mirrorArmGeometry, mirrorMaterial);
        rightMirrorArm.position.set(1.7, 1.0, -0.8);
        rightMirrorGroup.add(rightMirrorArm);
        const rightMirrorHead = new THREE.Mesh(mirrorHeadGeometry, mirrorMaterial);
        rightMirrorHead.position.set(1.9, 1.0, -0.8);
        rightMirrorGroup.add(rightMirrorHead);
        const rightMirrorGlass = new THREE.Mesh(mirrorHeadGeometry, mirrorGlassMaterial);
        rightMirrorGlass.position.set(1.93, 1.0, -0.8);
        rightMirrorGroup.add(rightMirrorGlass);
        car.add(rightMirrorGroup);

        // 添加车灯
        const lightMaterial = new THREE.MeshStandardMaterial({ color: 0xffff00, emissive: 0xffff00 });
        const headLightGeometry = new THREE.SphereGeometry(0.2, 16, 16);

        // 前格栅
        const grilleMaterial = new THREE.MeshStandardMaterial({ color: 0x222222 });
        const grilleGeometry = new THREE.BoxGeometry(1.2, 0.4, 0.1);
        const grille = new THREE.Mesh(grilleGeometry, grilleMaterial);
        grille.position.set(3.0, 0.4, 0);
        car.add(grille);

        // 格栅细节
        const barGeometry = new THREE.BoxGeometry(1.1, 0.05, 0.15);
        for (let i = 0; i < 5; i++) {
            const bar = new THREE.Mesh(barGeometry, new THREE.MeshStandardMaterial({ color: 0x555555 }));
            bar.position.set(3.0, 0.4 - (i * 0.15), 0);
            car.add(bar);
        }

        // 车头徽标
        const logoGeometry = new THREE.CircleGeometry(0.25, 32);
        const logoMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff });
        const logo = new THREE.Mesh(logoGeometry, logoMaterial);
        logo.position.set(3.0, 0.4, 0.01);
        car.add(logo);

        const logoInnerGeometry = new THREE.CircleGeometry(0.15, 32);
        const logoInnerMaterial = new THREE.MeshStandardMaterial({ color: this.color });
        const logoInner = new THREE.Mesh(logoInnerGeometry, logoInnerMaterial);
        logoInner.position.set(3.0, 0.4, 0.02);
        car.add(logoInner);

        // 前大灯（带透镜细节）
        const headLightBoxGeometry = new THREE.BoxGeometry(0.5, 0.3, 0.2);
        const lightCoverMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff, transparent: true, opacity: 0.8 });

        // 左大灯组件（多层次设计）
        const leftHeadLightGroup = new THREE.Group();
        // 大灯外壳
        const headLightHousingGeometry = new THREE.BoxGeometry(0.6, 0.4, 0.3);
        const headLightHousing = new THREE.Mesh(headLightHousingGeometry, new THREE.MeshStandardMaterial({color: 0x333333}));
        headLightHousing.position.set(3.0, 0.5, 0.6);
        leftHeadLightGroup.add(headLightHousing);
        // 大灯光源
        const leftHeadLight = new THREE.Mesh(headLightBoxGeometry, lightMaterial);
        leftHeadLight.position.set(3.05, 0.5, 0.6);
        leftHeadLight.castShadow = true;
        leftHeadLightGroup.add(leftHeadLight);
        // 大灯透镜
        const leftHeadLightCover = new THREE.Mesh(headLightGeometry, lightCoverMaterial);
        leftHeadLightCover.position.set(3.1, 0.5, 0.6);
        leftHeadLightGroup.add(leftHeadLightCover);
        // 转向灯
        const leftTurnSignal = new THREE.Mesh(new THREE.SphereGeometry(0.15), new THREE.MeshStandardMaterial({color: 0xffff00, emissive: 0xffff00}));
        leftTurnSignal.position.set(3.0, 0.35, 0.75);
        leftHeadLightGroup.add(leftTurnSignal);
        car.add(leftHeadLightGroup);

        // 右大灯组件（多层次设计）
        const rightHeadLightGroup = new THREE.Group();
        // 大灯外壳
        const rightHeadLightHousing = new THREE.Mesh(headLightHousingGeometry, new THREE.MeshStandardMaterial({color: 0x333333}));
        rightHeadLightHousing.position.set(3.0, 0.5, -0.6);
        rightHeadLightGroup.add(rightHeadLightHousing);
        // 大灯光源
        const rightHeadLight = new THREE.Mesh(headLightBoxGeometry, lightMaterial);
        rightHeadLight.position.set(3.05, 0.5, -0.6);
        rightHeadLight.castShadow = true;
        rightHeadLightGroup.add(rightHeadLight);
        // 大灯透镜
        const rightHeadLightCover = new THREE.Mesh(headLightBoxGeometry, lightCoverMaterial);
        rightHeadLightCover.position.set(3.1, 0.5, -0.6);
        rightHeadLightGroup.add(rightHeadLightCover);
        // 转向灯
        const rightTurnSignal = new THREE.Mesh(new THREE.SphereGeometry(0.15), new THREE.MeshStandardMaterial({color: 0xffff00, emissive: 0xffff00}));
        rightTurnSignal.position.set(3.0, 0.35, -0.75);
        rightHeadLightGroup.add(rightTurnSignal);
        car.add(rightHeadLightGroup);

        // 后扰流板
        const spoilerGeometry = new THREE.BoxGeometry(1.5, 0.1, 0.4);
        const spoiler = new THREE.Mesh(spoilerGeometry, new THREE.MeshStandardMaterial({color: this.color}));
        spoiler.position.set(-1.5, 1.3, 0);
        spoiler.rotation.z = 0.1;
        car.add(spoiler);

        // 侧反射器
        const reflectorMaterial = new THREE.MeshStandardMaterial({ color: 0xffff00 });
        const reflectorGeometry = new THREE.BoxGeometry(0.15, 0.1, 0.05);

        const leftReflector = new THREE.Mesh(reflectorGeometry, reflectorMaterial);
        leftReflector.position.set(0, 0.3, 0.9);
        car.add(leftReflector);

        const rightReflector = new THREE.Mesh(reflectorGeometry, reflectorMaterial);
        rightReflector.position.set(0, 0.3, -0.9);
        car.add(rightReflector);

        // 雾灯
        const fogLightMaterial = new THREE.MeshStandardMaterial({ color: 0x00ffff, emissive: 0x00ffff });
        const fogLightGeometry = new THREE.SphereGeometry(0.2, 16, 16);
        const leftFogLight = new THREE.Mesh(fogLightGeometry, fogLightMaterial);
        leftFogLight.position.set(2.8, 0.3, 0.7);
        car.add(leftFogLight);
        const rightFogLight = new THREE.Mesh(fogLightGeometry, fogLightMaterial);
        rightFogLight.position.set(2.8, 0.3, -0.7);
        car.add(rightFogLight);

        // 尾灯（矩形设计）
        const tailLightMaterial = new THREE.MeshStandardMaterial({ color: 0xff0000, emissive: 0xff0000 });
        const tailLightGeometry = new THREE.BoxGeometry(0.5, 0.3, 0.2);

        const leftTailLight = new THREE.Mesh(tailLightGeometry, tailLightMaterial);
        leftTailLight.position.set(-3.0, 0.5, 0.6);
        leftTailLight.castShadow = true;
        car.add(leftTailLight);

        const rightTailLight = new THREE.Mesh(tailLightGeometry, tailLightMaterial);
        rightTailLight.position.set(-3.0, 0.5, -0.6);
        rightTailLight.castShadow = true;
        car.add(rightTailLight);

        // 侧转向灯
        const signalLightMaterial = new THREE.MeshStandardMaterial({ color: 0xffff00, emissive: 0xffff00 });
        const signalLightGeometry = new THREE.SphereGeometry(0.15, 16, 16);

        const leftSignalLight = new THREE.Mesh(signalLightGeometry, signalLightMaterial);
        leftSignalLight.position.set(1.5, 0.5, 0.9);
        car.add(leftSignalLight);

        const rightSignalLight = new THREE.Mesh(signalLightGeometry, signalLightMaterial);
        rightSignalLight.position.set(1.5, 0.5, -0.9);
        car.add(rightSignalLight);

        // 创建车牌号
        const plateGeometry = new THREE.PlaneGeometry(1.5, 0.7);
        const plateMaterial = new THREE.MeshStandardMaterial({
            color: 0xffffff, side: THREE.DoubleSide
        });

        // 生成车牌号
        const plateNumber = this.generatePlateNumber();

        // 创建Canvas纹理
        const canvas = document.createElement('canvas');
        canvas.width = 256;
        canvas.height = 128;
        const context = canvas.getContext('2d');
        context.fillStyle = '#000000';
        context.fillRect(0, 0, canvas.width, canvas.height);
        context.fillStyle = '#ffffff';
        context.font = 'bold 36px Arial';
        context.textAlign = 'center';
        context.textBaseline = 'middle';
        context.fillText(plateNumber, canvas.width / 2, canvas.height / 2);

        const plateTexture = new THREE.CanvasTexture(canvas);
        plateMaterial.map = plateTexture;

        const plate = new THREE.Mesh(plateGeometry, plateMaterial);
        plate.position.set(-2.5, 0.3, 0); // 后保险杠位置
        plate.rotation.y = Math.PI; // 旋转180度朝后
        car.add(plate);

        // Windshield 雨刷
        const wiperMaterial = new THREE.MeshStandardMaterial({ color: 0x333333 });
        const wiperArmGeometry = new THREE.BoxGeometry(0.8, 0.05, 0.05);
        const wiperBladeGeometry = new THREE.BoxGeometry(0.6, 0.03, 0.03);

        // 左雨刷
        const leftWiperGroup = new THREE.Group();
        const leftWiperArm = new THREE.Mesh(wiperArmGeometry, wiperMaterial);
        leftWiperArm.position.set(0.5, 1.5, 0.7);
        leftWiperArm.rotation.z = -Math.PI / 8;
        leftWiperGroup.add(leftWiperArm);
        const leftWiperBlade = new THREE.Mesh(wiperBladeGeometry, wiperMaterial);
        leftWiperBlade.position.set(1.0, 1.45, 0.71);
        leftWiperBlade.rotation.z = -Math.PI / 6;
        leftWiperGroup.add(leftWiperBlade);
        car.add(leftWiperGroup);

        // 右雨刷
        const rightWiperGroup = new THREE.Group();
        const rightWiperArm = new THREE.Mesh(wiperArmGeometry, wiperMaterial);
        rightWiperArm.position.set(0.5, 1.5, -0.7);
        rightWiperArm.rotation.z = Math.PI / 8;
        rightWiperGroup.add(rightWiperArm);
        const rightWiperBlade = new THREE.Mesh(wiperBladeGeometry, wiperMaterial);
        rightWiperBlade.position.set(1.0, 1.45, -0.71);
        rightWiperBlade.rotation.z = Math.PI / 6;
        rightWiperGroup.add(rightWiperBlade);
        car.add(rightWiperGroup);

        // 设置方向
        car.lookAt(this.position.clone().add(this.direction));

        return car;
    }

    updateBoundingBox() {
        this.boundingBox.setFromObject(this.mesh);
    }

    generatePlateNumber() {
        const letters = 'ABCDEFGHJKLMNPQRSTUVWXYZ';
        const numbers = '0123456789';
        let plate = '京A';
        
        // 第一位字母
        plate += letters[Math.floor(Math.random() * letters.length)];
        
        // 后四位字母或数字
        for (let i = 0; i < 4; i++) {
            const isNumber = Math.random() > 0.5;
            if (isNumber) {
                plate += numbers[Math.floor(Math.random() * numbers.length)];
            } else {
                plate += letters[Math.floor(Math.random() * letters.length)];
            }
        }
        
        return plate;
    }

    update(redLightActive) {
        if (this.isStopped) return;

        // 检查是否需要停车（红灯且未越过停止线）
        if (redLightActive && !this.hasCrossedLine) {
            // 简单的停止线检测（假设停止线在z=±5和x=±5位置）
            const stopLineDistance = 1.5; // 距离停止线的安全距离
            const approachingStopLine = (
                (this.direction.z < 0 && Math.abs(this.position.z + 5) < stopLineDistance) ||
                (this.direction.z > 0 && Math.abs(this.position.z - 5) < stopLineDistance) ||
                (this.direction.x < 0 && Math.abs(this.position.x + 5) < stopLineDistance) ||
                (this.direction.x > 0 && Math.abs(this.position.x - 5) < stopLineDistance)
            );

            if (approachingStopLine) {
                this.isStopped = true;
                return;
            }
        }

        // 更新位置
        this.position.add(this.direction.clone().multiplyScalar(this.speed));
        this.mesh.position.copy(this.position);

        // 检查是否越过停止线
        if (!this.hasCrossedLine && redLightActive) {
            this.checkIfCrossedStopLine();
        }

        // 更新边界框
        this.updateBoundingBox();

        // 移除超出范围的车辆
        if (Math.abs(this.position.x) > 30 || Math.abs(this.position.z) > 30) {
            return true; // 需要被移除
        }

        return false;
    }

    checkIfCrossedStopLine() {
        // 简化的停止线检测逻辑
        const stopLines = [
            { axis: 'z', value: 5, direction: -1 },  // 北线
            { axis: 'z', value: -5, direction: 1 },   // 南线
            { axis: 'x', value: 5, direction: -1 },   // 东线
            { axis: 'x', value: -5, direction: 1 }    // 西线
        ];

        for (const line of stopLines) {
            const distance = this.position[line.axis] - line.value;
            if (line.direction * distance > 0) {
                this.hasCrossedLine = true;
                this.violating = true;
                break;
            }
        }
    }

}

class VehicleManager {
    constructor(scene) {
        this.scene = scene;
        this.vehicles = [];
        this.spawnTimer = 0;
        this.spawnInterval = 3000; // 每3秒生成一辆车
        this.maxVehicles = 5;
        this.stopLines = [
            { position: new THREE.Vector3(0, 0.1, 5), rotation: new THREE.Vector3(0, 0, 0) },
            { position: new THREE.Vector3(0, 0.1, -5), rotation: new THREE.Vector3(0, 0, 0) },
            { position: new THREE.Vector3(5, 0.1, 0), rotation: new THREE.Vector3(0, Math.PI/2, 0) },
            { position: new THREE.Vector3(-5, 0.1, 0), rotation: new THREE.Vector3(0, Math.PI/2, 0) }
        ];
    }

    spawnVehicle() {
        if (this.vehicles.length >= this.maxVehicles) return;

        // 随机选择一个方向
        const directions = [
            { position: new THREE.Vector3(-20, 0.5, 0), direction: new THREE.Vector3(1, 0, 0) }, // 从左到右
            { position: new THREE.Vector3(20, 0.5, 0), direction: new THREE.Vector3(-1, 0, 0) }, // 从右到左
            { position: new THREE.Vector3(0, 0.5, -20), direction: new THREE.Vector3(0, 0, 1) }, // 从下到上
            { position: new THREE.Vector3(0, 0.5, 20), direction: new THREE.Vector3(0, 0, -1) }  // 从上到下
        ];

        const randomDir = directions[Math.floor(Math.random() * directions.length)];
        const speed = 0.05 + Math.random() * 0.05; // 随机速度
        const color = new THREE.Color(Math.random(), Math.random(), Math.random());

        const vehicle = new Vehicle(randomDir.position, randomDir.direction, speed, color);
        this.scene.add(vehicle.mesh);
        this.vehicles.push(vehicle);
    }

    update(redLightActive, deltaTime = 16) {
        this.spawnTimer += deltaTime;
        if (this.spawnTimer >= this.spawnInterval) {
            this.spawnVehicle();
            this.spawnTimer = 0;
        }

        // 更新所有车辆
        for (let i = this.vehicles.length - 1; i >= 0; i--) {
            const vehicle = this.vehicles[i];
            const shouldRemove = vehicle.update(redLightActive);

            if (shouldRemove) {
                this.scene.remove(vehicle.mesh);
                this.vehicles.splice(i, 1);
            }
        }
    }

    checkForRedLightViolations() {
        // 检查是否有车辆闯红灯
        const violatingVehicles = this.vehicles.filter(vehicle => 
            vehicle.checkForViolation(true)
        );

        return violatingVehicles.length > 0;
    }

    getRandomViolatingVehicle() {
        // 获取随机违规车辆用于显示检测框
        const violatingVehicles = this.vehicles.filter(vehicle => 
            vehicle.checkForViolation(true)
        );

        if (violatingVehicles.length === 0) return null;
        return violatingVehicles[Math.floor(Math.random() * violatingVehicles.length)];
    }
}

export { Vehicle, VehicleManager };