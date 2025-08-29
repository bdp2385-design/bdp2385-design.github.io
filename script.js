// 检查用户登录状态并更新界面
function updateLoginStatus() {
    const loginLink = document.getElementById('login-link');
    const userInfoDiv = document.getElementById('user-info');
    const currentUser = JSON.parse(localStorage.getItem('kardsCurrentUser'));
    
    if (currentUser) {
        // 已登录状态
        loginLink.textContent = '退出登录';
        loginLink.href = '#';
        loginLink.addEventListener('click', function(e) {
            e.preventDefault();
            localStorage.removeItem('kardsCurrentUser');
            alert('已退出登录');
            window.location.reload();
        });
        
        // 在用户信息区域显示欢迎信息
        if (userInfoDiv) {
            userInfoDiv.innerHTML = `
                <p class="welcome">欢迎您，${currentUser.nickname}！</p>
                <p class="login-time">登录时间：${new Date(currentUser.loginTime).toLocaleString()}</p>
            `;
        }
    } else {
        // 未登录状态
        loginLink.textContent = '登录/注册';
        loginLink.href = 'Kards Team 人物档案/login.html';
        
        // 清空用户信息区域
        if (userInfoDiv) {
            userInfoDiv.innerHTML = '<p>请<a href="Kards Team 人物档案/login.html">登录</a>查看更多信息</p>';
        }
    }
}

// 页面加载时执行
document.addEventListener('DOMContentLoaded', function() {
    updateLoginStatus();
});