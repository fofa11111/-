// 卡通形象AI导航助手实现 - 会走到每个标题进行讲解并支持对话

// 全局变量定义
let lastTalkTime = 0;

document.addEventListener('DOMContentLoaded', function() {
    // 创建AI导航助手（像素风猫咪）
    createAIAssistant();
    
    // 初始化AI导航功能
    initAINavigation();
    
    // 初始化鼠标位置检测功能
    initMousePositionDetection();
});

// 创建AI导航助手（指定猫咪形象）
function createAIAssistant() {
    // 创建助手容器
    const aiContainer = document.createElement('div');
    aiContainer.id = 'ai-assistant';
    aiContainer.className = 'ai-assistant';
    aiContainer.style.position = 'fixed';
    aiContainer.style.zIndex = '1001';
    aiContainer.style.cursor = 'pointer';
    aiContainer.style.transition = 'transform 0.1s ease';
    
    // 创建对话气泡
    const aiSpeech = document.createElement('div');
    aiSpeech.id = 'ai-speech';
    aiSpeech.className = 'ai-speech';
    
    // 创建猫咪形象容器
    const aiBody = document.createElement('div');
    aiBody.className = 'ai-body';
    
    // 添加指定猫咪形象
    const aiAvatar = document.createElement('div');
    aiAvatar.className = 'ai-avatar';
    // 使用您上传的已移除背景的猫咪图片
    aiAvatar.innerHTML = `<img src="images/已移除背景的OIP-C.png" alt="指定猫咪形象" width="120" height="120">`;
    
    // 创建对话输入框
    const aiChatContainer = document.createElement('div');
    aiChatContainer.id = 'ai-chat-container';
    aiChatContainer.className = 'ai-chat-container';
    
    const aiChatInput = document.createElement('input');
    aiChatInput.id = 'ai-chat-input';
    aiChatInput.className = 'ai-chat-input';
    aiChatInput.type = 'text';
    aiChatInput.placeholder = '和AI助手聊天...';
    
    const aiChatButton = document.createElement('button');
    aiChatButton.id = 'ai-chat-button';
    aiChatButton.className = 'ai-chat-button';
    aiChatButton.textContent = '发送';
    
    // 组装聊天输入框
    aiChatContainer.appendChild(aiChatInput);
    aiChatContainer.appendChild(aiChatButton);
    
    // 组装AI助手 - 移除多余的身体部分
    aiBody.appendChild(aiAvatar);
    aiContainer.appendChild(aiSpeech);
    aiContainer.appendChild(aiBody);
    aiContainer.appendChild(aiChatContainer);
    
    // 添加到页面
    document.body.appendChild(aiContainer);
    
    // 添加AI助手的样式
    addAIAssistantStyles();
}

// 添加AI导航助手的样式
function addAIAssistantStyles() {
    const style = document.createElement('style');
    style.textContent = `
        /* AI导航助手样式 - 指定猫咪形象 */
    :root {
        --ai-primary: #FF9EAA;
        --ai-secondary: #FF7F99;
        --ai-accent: #FF5A7F;
        --ai-bg: rgba(255, 255, 255, 0.95);
        --ai-border: rgba(255, 90, 127, 0.5);
        --ai-glow: 0 0 15px rgba(255, 158, 170, 0.4);
    }
        
        .ai-assistant {
            display: flex;
            flex-direction: column;
            align-items: center;
            transform-origin: center bottom;
        }
        
        .ai-assistant:hover {
            animation: ai-hover 0.5s ease-in-out infinite alternate;
        }
        
        /* 猫咪形象样式 */
        .ai-body {
            position: relative;
            width: 120px;
            height: 120px;
            display: flex;
            flex-direction: column;
            align-items: center;
        }
        
        .ai-avatar {
            position: relative;
            width: 120px;
            height: 120px;
            filter: drop-shadow(var(--ai-glow));
            transition: transform 0.3s ease;
            image-rendering: pixelated; /* 保持像素风格 */
        }
        
        .ai-assistant.talking .ai-avatar {
            animation: ai-talk-head 0.5s ease-in-out infinite;
        }
        
        /* 对话气泡样式 - 可爱风格 */
        .ai-speech {
            background-color: var(--ai-bg);
            border: 2px solid var(--ai-secondary);
            border-radius: 25px;
            padding: 15px 18px;
            max-width: 400px;
            margin-bottom: 15px;
            color: #333;
            font-size: 1rem;
            line-height: 1.4;
            position: relative;
            box-shadow: 0 4px 12px rgba(255, 105, 180, 0.15);
            opacity: 0;
            transform: translateY(15px);
            transition: opacity 0.4s ease, transform 0.4s ease;
            backdrop-filter: blur(8px);
            text-align: center;
            font-family: 'Arial', sans-serif;
            font-weight: 500;
            word-wrap: break-word;
            white-space: normal;
        }
        
        .ai-speech::after {
            content: '';
            position: absolute;
            bottom: -12px;
            left: 50%;
            transform: translateX(-50%);
            width: 0;
            height: 0;
            border-left: 12px solid transparent;
            border-right: 12px solid transparent;
            border-top: 12px solid var(--ai-accent);
        }
        
        .ai-speech.show {
            opacity: 1;
            transform: translateY(0);
        }
        
        /* 对话输入框样式 - 可爱风格 */
        .ai-chat-container {
            display: flex;
            align-items: center;
            gap: 8px;
            margin-top: 15px;
            opacity: 0;
            transform: translateY(10px);
            transition: opacity 0.4s ease, transform 0.4s ease;
            background-color: rgba(255, 255, 255, 0.8);
            border: 2px solid var(--ai-secondary);
            border-radius: 30px;
            padding: 8px 12px;
            box-shadow: 0 2px 8px rgba(255, 105, 180, 0.1);
        }
        
        .ai-assistant:hover .ai-chat-container {
            opacity: 1;
            transform: translateY(0);
            background-color: white;
            box-shadow: var(--ai-glow);
        }
        
        .ai-chat-input {
            flex: 1;
            background: transparent;
            border: none;
            outline: none;
            color: #333;
            font-size: 0.9rem;
            padding: 8px;
            width: auto;
        }
        
        .ai-chat-input::placeholder {
            color: rgba(0, 0, 0, 0.4);
        }
        
        .ai-chat-input:focus {
            box-shadow: none;
        }
        
        .ai-chat-button {
            background-color: var(--ai-secondary);
            color: white;
            border: none;
            border-radius: 50%;
            width: 36px;
            height: 36px;
            font-size: 1.1rem;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.3s ease;
            margin: 0;
            padding: 0;
            position: relative;
            overflow: visible;
        }
        
        .ai-chat-button:hover {
            background-color: var(--ai-primary);
            transform: scale(1.1);
            box-shadow: 0 0 10px rgba(255, 105, 180, 0.7);
        }
        
        .ai-chat-button::before {
            display: none;
        }
        
        .ai-chat-button:active {
            transform: scale(0.95);
        }
        
        /* 动画关键帧 */
        /* 悬停效果 - 可爱风格 */
        @keyframes ai-hover {
            0% {
                transform: translateY(0);
            }
            100% {
                transform: translateY(-4px);
            }
        }
        
        /* 说话头部动画 - 可爱风格 */
        @keyframes ai-talk-head {
            0%, 100% {
                transform: translateY(0);
            }
            50% {
                transform: translateY(-2px);
            }
        }
        
        /* 响应式设计 */
        @media (max-width: 768px) {
            .ai-body {
                width: 100px;
                height: 100px;
            }
            
            .ai-avatar {
                width: 100px;
                height: 100px;
            }
            
            .ai-speech {
                max-width: 220px;
                font-size: 0.9rem;
                padding: 12px 15px;
            }
            
            .ai-chat-input {
                width: 150px;
                font-size: 0.85rem;
                padding: 8px 12px;
            }
            
            .ai-chat-button {
                font-size: 0.85rem;
                padding: 8px 15px;
            }
        }
        

    `;
    
    document.head.appendChild(style);
}

// 初始化AI导航功能
function initAINavigation() {
    const aiAssistant = document.getElementById('ai-assistant');
    const aiSpeech = document.getElementById('ai-speech');
    const aiChatInput = document.getElementById('ai-chat-input');
    const aiChatButton = document.getElementById('ai-chat-button');
    
    // 设置初始位置（添加位置约束）
    let pos = {
        x: Math.max(50, Math.min(window.innerWidth - 180, window.innerWidth - 180)),
        y: Math.max(50, Math.min(window.innerHeight - 220, window.innerHeight - 200))
    };
    aiAssistant.style.left = pos.x + 'px';
    aiAssistant.style.top = pos.y + 'px';
    
    // 网站各部分的标题和详细介绍
    const sectionIntroductions = {
        home: {
            title: '首页',
            content: '欢迎来到我的专属网站！我是您的AI导航助手小智。这里是网站的首页，展示了我的个人简介和核心信息。'
        },
        about: {
            title: '关于我',
            content: '在"关于我"页面，您可以了解我的个人信息、教育背景、工作经历和兴趣爱好。我是一个充满好奇心和创造力的人，热衷于不断学习和探索新事物。'
        },
        'vr-exhibition': {
            title: 'VR展厅',
            content: '这是一个沉浸式的VR科技展厅，展示了我的专业证书和成就。您可以用鼠标拖动来360°旋转视角，体验炫酷的3D展示效果！'
        },
        portfolio: {
            title: '作品集',
            content: '作品集板块汇集了我的代表作品，包括项目案例、设计作品和创意实践。每一个作品都凝聚了我的心血和创意，展示了我在不同领域的专业能力。'
        },
        skills: {
            title: '技能',
            content: '技能页面展示了我的专业技能树，包括技术能力、设计能力和软技能等。我一直在不断学习和提升自己，以适应快速发展的行业需求。'
        },
        contact: {
            title: '联系我',
            content: '如果您对我的作品感兴趣，或者想探讨潜在的合作机会，欢迎在联系页面给我留言。我会尽快回复您的每一条消息！'
        }
    };
    
    // 增强的对话回复系统
    const chatResponses = {
        '你好': '你好呀！我是您的AI导航助手小智，很高兴为您服务！😊',
        '你是谁': '我是小智，您的专属AI导航助手！我可以带您参观整个网站，介绍各个板块的内容。',
        '网站介绍': '这是一个个人展示网站，包含了首页、关于我、VR展厅、作品集、技能和联系我等板块。您可以通过顶部导航栏快速访问这些内容。',
        'VR展厅': 'VR展厅是网站最具特色的部分，采用Three.js技术打造的3D互动空间，让您可以360度查看证书和成就。',
        '作品集': '作品集展示了各种创意项目，涵盖了设计、开发和创意表达等多个领域。',
        '技能': '技能页面详细列出了专业能力和兴趣爱好，包括前端开发、设计、数据分析等。',
        '联系我': '想与我取得联系？只需点击导航栏的"联系我"，填写表单即可给我留言！',
        '谢谢': '不客气！能为您提供帮助是我的荣幸！如果您还有其他问题，随时都可以问我。',
        '再见': '再见！祝您有愉快的一天！如果您想了解更多，可以随时回来找我聊天哦！👋',
        '导航': '我可以帮您导航整个网站！您想看哪个板块？我可以带您过去并为您介绍。',
        '介绍一下': '我是小智，一个可爱的AI助手！我会走到每个您浏览的标题旁，为您详细讲解内容，让您的浏览体验更加生动有趣！',
        '什么功能': '我具备多种功能：自动走到当前浏览的标题旁进行讲解、支持与您对话交流、可以在页面上自由移动，还会做出各种可爱的表情和动作！'
    };
    
    // 默认回复库 - 更智能更有趣
    const defaultResponses = [
        '嗯...这个问题有点难倒我了呢！不过您可以问我关于网站的问题，我会尽力为您解答！',
        '抱歉，我还在学习中，这个问题我暂时回答不了。您可以尝试问我网站相关的内容哦！',
        '这个问题很有趣，但我现在还没办法回答。要不我们聊聊网站的其他内容？',
        '哎呀，我被难住了！您可以问我"网站介绍"、"VR展厅"或者"作品集"等问题，我会详细为您介绍的！',
        '这个问题超出了我的知识范围呢。要不您告诉我您想了解网站的哪个部分，我带您去看看？'
    ];
    
    // 移动相关变量
    let isWalking = false;
    let targetPosition = null;
    let moveSpeed = 2.5; // 稍微加快移动速度
    let currentSection = '';
    
    // 获取页面上的所有标题元素
    function getSectionTitles() {
        const titles = [];
        const sections = document.querySelectorAll('section[id]');
        
        sections.forEach(section => {
            const heading = section.querySelector('h1, h2, h3');
            if (heading) {
                titles.push({
                    id: section.id,
                    element: heading,
                    section: section
                });
            }
        });
        
        return titles;
    }
    
    // 监听滚动事件，让AI走到当前浏览的标题旁
    window.addEventListener('scroll', function() {
        const titles = getSectionTitles();
        
        for (const title of titles) {
            const titleRect = title.element.getBoundingClientRect();
            const section = title.section;
            
            // 当标题进入视口中心区域时，移动AI到标题旁边
            if (titleRect.top <= window.innerHeight / 2 && titleRect.bottom >= window.innerHeight / 4) {
                const sectionId = title.id;
                
                if (currentSection !== sectionId) {
                    currentSection = sectionId;
                    
                    // 获取标题位置，计算AI应该移动到的位置
                    const titleCenter = titleRect.left + titleRect.width / 2;
                    let targetX;
                    
                    // 根据标题位置决定AI站在左侧还是右侧
                    if (titleCenter < window.innerWidth / 2) {
                        // 标题在左侧，AI站在右侧
                        targetX = titleCenter + titleRect.width / 2 + 50;
                    } else {
                        // 标题在右侧，AI站在左侧
                        targetX = titleCenter - titleRect.width / 2 - 180;
                    }
                    
                    // 确保不超出屏幕范围
                    targetX = Math.max(50, Math.min(window.innerWidth - 180, targetX));
                    
                    // 计算垂直位置，让AI与标题大致对齐
                    const targetY = window.innerHeight - titleRect.bottom + titleRect.height / 2 - 100;
                    
                    // 确保垂直位置不超出屏幕范围
                    const minY = 50; // 距离顶部最小距离
                    const maxY = window.innerHeight - 220; // 距离底部最小距离（考虑AI高度）
                    const constrainedY = Math.max(minY, Math.min(maxY, targetY));
                    
                    // 获取对应区域的介绍内容
                    const introduction = sectionIntroductions[sectionId] || {
                        title: title.element.textContent,
                        content: `这里是${title.element.textContent}部分，您可以在这里查看相关内容。`
                    };
                    
                    // 移动到标题旁边（使用约束后的位置）
                    moveToPosition(targetX, constrainedY, introduction);
                    
                    // 停止随机移动
                    targetPosition = null;
                }
                break;
            }
        }
    });
    
    // 点击AI助手时显示当前区域的详细介绍
    aiAssistant.addEventListener('click', function() {
        const now = Date.now();
        // 防止频繁点击
        if (now - lastTalkTime > 1000) {
            lastTalkTime = now;
            
            if (currentSection && sectionIntroductions[currentSection]) {
                updateAISpeech(sectionIntroductions[currentSection]);
                animateTalking(true);
                setTimeout(() => animateTalking(false), 2000);
            }
        }
    });
    
    // 处理对话发送
    aiChatButton.addEventListener('click', function() {
        handleChat();
    });
    
    aiChatInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            handleChat();
        }
    });
    
    // 处理对话
    function handleChat() {
        const message = aiChatInput.value.trim();
        if (message) {
            // 清除输入框
            aiChatInput.value = '';
            
            // 查找响应
            let response = getResponseForMessage(message);
            
            // 更新对话气泡
            updateAISpeech({ title: '', content: response });
            
            // 动画效果
            animateTalking(true);
            setTimeout(() => animateTalking(false), 2000);
        }
    }
    
    // 根据消息获取响应
    function getResponseForMessage(message) {
        message = message.toLowerCase();
        
        // 检查是否包含关键词
        for (const [keyword, response] of Object.entries(chatResponses)) {
            if (message.includes(keyword.toLowerCase())) {
                return response;
            }
        }
        
        // 返回默认响应
        const randomIndex = Math.floor(Math.random() * defaultResponses.length);
        return defaultResponses[randomIndex];
    }
    
    // 移动到指定位置
    function moveToPosition(targetX, targetY, introduction = null) {
        isWalking = true;
        aiAssistant.classList.add('walking');
        
        // 使用动画帧进行平滑移动
        function move() {
            const dx = targetX - pos.x;
            const dy = targetY - pos.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance > 5) {
                pos.x += (dx / distance) * moveSpeed;
                pos.y += (dy / distance) * moveSpeed;
                
                aiAssistant.style.left = pos.x + 'px';
                aiAssistant.style.top = pos.y + 'px';
                
                requestAnimationFrame(move);
            } else {
                // 移动完成
                pos.x = targetX;
                pos.y = targetY;
                aiAssistant.style.left = pos.x + 'px';
                aiAssistant.style.top = pos.y + 'px';
                
                isWalking = false;
                aiAssistant.classList.remove('walking');
                
                // 如果有介绍内容，显示介绍
                if (introduction) {
                    updateAISpeech(introduction);
                    animateTalking(true);
                    setTimeout(() => animateTalking(false), 2000);
                }
                
                // 一段时间后开始随机移动
                setTimeout(startRandomMovement, 10000);
            }
        }
        
        move();
    }
    
    // 开始随机移动（添加位置约束）
    function startRandomMovement() {
        if (!isWalking && !targetPosition) {
            const minX = 50;
            const maxX = window.innerWidth - 180;
            const minY = 50;
            const maxY = window.innerHeight - 220;
            
            const randomX = Math.random() * (maxX - minX) + minX;
            const randomY = Math.random() * (maxY - minY) + minY;
            
            moveToPosition(randomX, randomY);
        }
    }
    
    // 更新AI助手的对话内容
    function updateAISpeech(introduction) {
        let content = '';
        if (introduction.title) {
            content = `<strong>${introduction.title}</strong><br>${introduction.content}`;
        } else {
            content = introduction.content;
        }
        
        aiSpeech.innerHTML = content;
        aiSpeech.classList.add('show');
        
        // 10秒后自动隐藏对话气泡
        setTimeout(() => {
            aiSpeech.classList.remove('show');
        }, 10000);
    }
    
    // 动画化AI助手的说话效果
    function animateTalking(isTalking) {
        const aiMouthAnimation = document.getElementById('talk-animation');
        
        if (aiMouthAnimation) {
            if (isTalking) {
                aiAssistant.classList.add('talking');
                // 触发嘴巴动画
                aiMouthAnimation.setAttribute('repeatCount', 'indefinite');
                aiMouthAnimation.beginElement();
            } else {
                aiAssistant.classList.remove('talking');
                // 停止嘴巴动画
                aiMouthAnimation.setAttribute('repeatCount', '0');
            }
        }
    }
    
    // 初始显示欢迎语
    setTimeout(() => {
        updateAISpeech(sectionIntroductions.home);
        animateTalking(true);
        setTimeout(() => animateTalking(false), 2000);
        
        // 一段时间后开始随机移动
        setTimeout(startRandomMovement, 12000);
    }, 1000);
}

// 初始化鼠标位置检测功能
function initMousePositionDetection() {
    const aiAssistant = document.getElementById('ai-assistant');
    
    // 为页面上的重要元素添加鼠标悬停检测
    const importantElements = document.querySelectorAll('section[id], .exhibit-item, .portfolio-item, .skill-item');
    
    importantElements.forEach(element => {
        // 添加鼠标悬停事件
        element.addEventListener('mouseenter', function() {
            // 避免频繁触发
            if (Date.now() - lastTalkTime > 3000) {
                // 获取元素位置和信息
                const elementRect = this.getBoundingClientRect();
                const elementCenterX = elementRect.left + elementRect.width / 2;
                const elementCenterY = elementRect.top + elementRect.height / 2;
                
                // 计算AI助手应该移动到的位置
                let targetX, targetY;
                
                // 根据元素位置决定AI站在左侧还是右侧
                if (elementCenterX < window.innerWidth / 2) {
                    // 元素在左侧，AI站在右侧
                    targetX = elementRect.right + 30;
                } else {
                    // 元素在右侧，AI站在左侧
                    targetX = elementRect.left - 180;
                }
                
                // 确保不超出屏幕范围
                targetX = Math.max(50, Math.min(window.innerWidth - 180, targetX));
                
                // 垂直位置与元素中心对齐
                targetY = window.innerHeight - elementRect.bottom + elementCenterY - 150;
                // 确保垂直位置不超出屏幕范围（使用统一的约束值）
                targetY = Math.max(50, Math.min(window.innerHeight - 220, targetY));
                
                // 获取元素的介绍信息
                let introduction = getElementIntroduction(this);
                
                // 移动AI助手到元素旁边并显示介绍
                moveToPosition(targetX, targetY, introduction);
                
                // 停止随机移动
                targetPosition = null;
            }
        });
    });
}

// 获取元素的介绍信息
function getElementIntroduction(element) {
    let title = '展览项目';
    let content = '这是一个展览项目，您可以查看相关内容。';
    
    // 根据元素类型获取不同的介绍信息
    if (element.tagName === 'SECTION' && element.id) {
        if (sectionIntroductions[element.id]) {
            return sectionIntroductions[element.id];
        }
        
        const heading = element.querySelector('h1, h2, h3');
        if (heading) {
            title = heading.textContent;
            
            // 尝试获取段落内容作为描述
            const p = element.querySelector('p');
            if (p) {
                content = p.textContent.length > 100 ? p.textContent.substring(0, 100) + '...' : p.textContent;
            }
        }
    } else if (element.classList.contains('exhibit-item')) {
        // 展览项目
        const itemTitle = element.querySelector('h3, .item-title');
        if (itemTitle) {
            title = itemTitle.textContent;
        }
        
        content = '这是一个精美的展览项目，点击可以查看更多详情。';
    } else if (element.classList.contains('portfolio-item')) {
        // 作品集项目
        const itemTitle = element.querySelector('h3, .item-title');
        if (itemTitle) {
            title = itemTitle.textContent;
        }
        
        content = '这是我的代表作品之一，展示了我的创意和技能。';
    } else if (element.classList.contains('skill-item')) {
        // 技能项目
        const itemTitle = element.querySelector('h3, .skill-name');
        if (itemTitle) {
            title = itemTitle.textContent;
        }
        
        content = '这是我掌握的一项专业技能，我一直在不断提升自己的能力。';
    }
    
    return { title, content };
}