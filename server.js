const fs = require('fs');
const path = require('path');
const http = require('http');
const url = require('url');

const PORT = 3000;
const USERS_FILE = path.join(__dirname, 'users.txt');

// 创建简单的HTTP服务器
const server = http.createServer((req, res) => {
    // 设置CORS头
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        res.writeHead(200);
        res.end();
        return;
    }

    const parsedUrl = url.parse(req.url, true);
    const pathname = parsedUrl.pathname;

    // 处理注册请求
    if (pathname === '/register' && req.method === 'POST') {
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });
        
        req.on('end', () => {
            try {
                const userData = JSON.parse(body);
                
                // 验证数据
                if (!userData.username || !userData.password || !userData.nickname) {
                    res.writeHead(400, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ error: '缺少必要信息' }));
                    return;
                }

                // 读取现有用户
                let existingUsers = [];
                if (fs.existsSync(USERS_FILE)) {
                    const fileContent = fs.readFileSync(USERS_FILE, 'utf8');
                    existingUsers = fileContent.split('\n')
                        .filter(line => line.trim())
                        .map(line => {
                            try {
                                return JSON.parse(line);
                            } catch {
                                return null;
                            }
                        })
                        .filter(user => user !== null);
                }

                // 检查用户名是否已存在
                if (existingUsers.some(user => user.username === userData.username)) {
                    res.writeHead(409, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ error: '用户名已存在' }));
                    return;
                }

                // 添加新用户
                const newUser = {
                    username: userData.username,
                    password: userData.password,
                    nickname: userData.nickname,
                    registerDate: new Date().toISOString()
                };

                // 追加到文件
                fs.appendFileSync(USERS_FILE, JSON.stringify(newUser) + '\n');

                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ message: '注册成功' }));
            } catch (error) {
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: '服务器错误' }));
            }
        });
    }
    
    // 处理登录请求
    else if (pathname === '/login' && req.method === 'POST') {
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });
        
        req.on('end', () => {
            try {
                const loginData = JSON.parse(body);
                
                if (!loginData.username || !loginData.password) {
                    res.writeHead(400, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ error: '缺少用户名或密码' }));
                    return;
                }

                // 读取用户数据
                let users = [];
                if (fs.existsSync(USERS_FILE)) {
                    const fileContent = fs.readFileSync(USERS_FILE, 'utf8');
                    users = fileContent.split('\n')
                        .filter(line => line.trim())
                        .map(line => {
                            try {
                                return JSON.parse(line);
                            } catch {
                                return null;
                            }
                        })
                        .filter(user => user !== null);
                }

                const user = users.find(u => 
                    u.username === loginData.username && 
                    u.password === loginData.password
                );

                if (user) {
                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ 
                        message: '登录成功',
                        user: {
                            username: user.username,
                            nickname: user.nickname
                        }
                    }));
                } else {
                    res.writeHead(401, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ error: '用户名或密码错误' }));
                }
            } catch (error) {
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: '服务器错误' }));
            }
        });
    }
    
    else {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: '未找到' }));
    }
});

server.listen(PORT, () => {
    console.log(`服务器运行在 http://localhost:${PORT}`);
    console.log(`用户信息将保存在: ${USERS_FILE}`);
});

// 优雅关闭
process.on('SIGINT', () => {
    console.log('\n服务器关闭');
    process.exit(0);
});