// 获取DOM元素
const loginTab = document.getElementById('login-tab');
const registerTab = document.getElementById('register-tab');
const loginForm = document.getElementById('login-form');
const registerForm = document.getElementById('register-form');
const loginMessage = document.getElementById('login-message');
const registerMessage = document.getElementById('register-message');

// 服务器地址
const SERVER_URL = 'http://localhost:3000';

// 切换表单显示
loginTab.addEventListener('click', () => {
    loginTab.classList.add('active');
    registerTab.classList.remove('active');
    loginForm.classList.add('active-form');
    registerForm.classList.remove('active-form');
    loginMessage.textContent = '';
});

registerTab.addEventListener('click', () => {
    registerTab.classList.add('active');
    loginTab.classList.remove('active');
    registerForm.classList.add('active-form');
    loginForm.classList.remove('active-form');
    registerMessage.textContent = '';
});

// 处理注册表单提交
registerForm.addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const username = document.getElementById('register-username').value;
    const password = document.getElementById('register-password').value;
    const confirmPassword = document.getElementById('register-confirm-password').value;
    const nickname = document.getElementById('register-nickname').value;
    
    // 验证密码是否匹配
    if (password !== confirmPassword) {
        registerMessage.textContent = '两次输入的密码不一致';
        registerMessage.className = 'message error';
        return;
    }
    
    try {
        const response = await fetch(`${SERVER_URL}/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password, nickname })
        });
        
        const result = await response.json();
        
        if (response.ok) {
            registerMessage.textContent = '注册成功！请登录';
            registerMessage.className = 'message success';
            
            // 清空表单
            registerForm.reset();
            
            // 3秒后切换到登录表单
            setTimeout(() => {
                loginTab.click();
            }, 3000);
        } else {
            registerMessage.textContent = result.error || '注册失败';
            registerMessage.className = 'message error';
        }
    } catch (error) {
        registerMessage.textContent = '网络错误，请稍后重试';
        registerMessage.className = 'message error';
    }
});

// 处理登录表单提交
loginForm.addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const username = document.getElementById('login-username').value;
    const password = document.getElementById('login-password').value;
    
    try {
        const response = await fetch(`${SERVER_URL}/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password })
        });
        
        const result = await response.json();
        
        if (response.ok) {
            loginMessage.textContent = '登录成功！正在跳转...';
            loginMessage.className = 'message success';
            
            // 保存当前登录用户信息到本地存储
            localStorage.setItem('kardsCurrentUser', JSON.stringify({
                username: result.user.username,
                nickname: result.user.nickname,
                loginTime: new Date().toISOString()
            }));
            
            // 跳转到主页
            setTimeout(() => {
                window.location.href = '主界面.html';
            }, 2000);
        } else {
            loginMessage.textContent = result.error || '登录失败';
            loginMessage.className = 'message error';
        }
    } catch (error) {
        loginMessage.textContent = '网络错误，请稍后重试';
        loginMessage.className = 'message error';
    }
});

// 检查是否已登录
function checkLoginStatus() {
    const currentUser = JSON.parse(localStorage.getItem('kardsCurrentUser'));
    if (currentUser) {
        const welcomeElement = document.createElement('div');
        welcomeElement.className = 'welcome-message';
        welcomeElement.textContent = `欢迎回来，${currentUser.nickname}！`;
        document.querySelector('.form-container').prepend(welcomeElement);
    }
}

// 页面加载时检查登录状态
checkLoginStatus();