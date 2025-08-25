// 导航栏响应式功能
const navSlide = () => {
    const burger = document.querySelector('.burger');
    const nav = document.querySelector('.nav-links');
    const navLinks = document.querySelectorAll('.nav-links li');

    if (burger && nav && navLinks.length > 0) {
        burger.addEventListener('click', () => {
            // 切换导航菜单
            nav.classList.toggle('nav-active');

            // 切换汉堡菜单图标
            burger.classList.toggle('toggle');

            // 为导航链接添加动画
            navLinks.forEach((link, index) => {
                if (link.style.animation) {
                    link.style.animation = '';
                } else {
                    link.style.animation = `navLinkFade 0.5s ease forwards ${index / 7 + 0.3}s`;
                }
            });
        });
    }
};

// 平滑滚动
const smoothScroll = () => {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();

            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 70, // 考虑导航栏高度
                    behavior: 'smooth'
                });

                // 如果是移动端，点击后关闭菜单
                const nav = document.querySelector('.nav-links');
                const burger = document.querySelector('.burger');
                const navLinks = document.querySelectorAll('.nav-links li');

                if (nav && burger && nav.classList.contains('nav-active')) {
                    nav.classList.remove('nav-active');
                    burger.classList.remove('toggle');

                    navLinks.forEach(link => {
                        link.style.animation = '';
                    });
                }
            }
        });
    });
};

// 滚动时导航栏样式变化
const scrollNavbar = () => {
    const header = document.querySelector('header');
    if (header) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                header.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
                header.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
            } else {
                header.style.backgroundColor = 'var(--white)';
                header.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
            }
        });
    }
};

// 表单提交处理
const handleFormSubmit = () => {
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            // 获取表单数据
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const message = document.getElementById('message').value;

            // 简单验证
            if (!name || !email || !message) {
                alert('请填写完整表单！');
                return;
            }

            // 这里只是模拟提交，实际项目中应该发送到服务器
            console.log('表单提交数据:', {
                name,
                email,
                message
            });

            // 显示提交成功消息
            alert('表单提交成功！我们会尽快与您联系。');

            // 重置表单
            contactForm.reset();
        });
    }
};

// 图片懒加载
const lazyLoadImages = () => {
    const lazyImages = document.querySelectorAll('img[data-src]');

    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const image = entry.target;
                    image.src = image.dataset.src;
                    image.removeAttribute('data-src');
                    imageObserver.unobserve(image);
                }
            });
        });

        lazyImages.forEach(image => {
            imageObserver.observe(image);
        });
    } else {
        // 回退方案
        lazyImages.forEach(image => {
            image.src = image.dataset.src;
            image.removeAttribute('data-src');
        });
    }
};

// 初始化所有功能
const init = () => {
    navSlide();
    smoothScroll();
    scrollNavbar();
    handleFormSubmit();
    lazyLoadImages();
};

// 当DOM加载完成后初始化
document.addEventListener('DOMContentLoaded', init);