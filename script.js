class SnakeGame {
    constructor() {
        this.gridSize = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--grid-size'));
        this.gameSize = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--game-size'));
        this.gridCount = Math.floor(this.gameSize / this.gridSize);
        
        this.gameArea = document.getElementById('gameArea');
        this.scoreElement = document.getElementById('score');
        this.overlay = document.getElementById('gameOverlay');
        this.startButton = document.getElementById('startButton');
        
        this.snake = [];
        this.food = null;
        this.direction = 'right';
        this.nextDirection = 'right';
        this.score = 0;
        this.gameLoop = null;
        this.speed = 150;
        
        this.setupEventListeners();
    }
    
    setupEventListeners() {
        // 键盘控制
        document.addEventListener('keydown', (e) => {
            this.handleKeyPress(e.key);
        });
        
        // 触屏控制
        const buttons = document.querySelectorAll('.control-btn');
        buttons.forEach(button => {
            button.addEventListener('click', () => {
                const direction = button.className.split(' ')[1];
                this.handleDirectionChange(direction);
            });
        });
        
        // 开始按钮
        this.startButton.addEventListener('click', () => {
            this.startGame();
        });
    }
    
    handleKeyPress(key) {
        const keyMap = {
            'ArrowUp': 'up',
            'ArrowDown': 'down',
            'ArrowLeft': 'left',
            'ArrowRight': 'right'
        };
        
        if (keyMap[key]) {
            this.handleDirectionChange(keyMap[key]);
        }
    }
    
    handleDirectionChange(newDirection) {
        const opposites = {
            'up': 'down',
            'down': 'up',
            'left': 'right',
            'right': 'left'
        };
        
        if (opposites[this.direction] !== newDirection) {
            this.nextDirection = newDirection;
        }
    }
    
    startGame() {
        // 初始化蛇
        this.snake = [
            {x: 5, y: 5},
            {x: 4, y: 5},
            {x: 3, y: 5}
        ];
        
        this.direction = 'right';
        this.nextDirection = 'right';
        this.score = 0;
        this.scoreElement.textContent = this.score;
        this.speed = 150;
        
        // 清除游戏区域
        this.gameArea.innerHTML = '';
        
        // 生成食物
        this.generateFood();
        
        // 隐藏开始界面
        this.overlay.style.display = 'none';
        
        // 开始游戏循环
        if (this.gameLoop) clearInterval(this.gameLoop);
        this.gameLoop = setInterval(() => this.update(), this.speed);
    }
    
    generateFood() {
        let x, y;
        do {
            x = Math.floor(Math.random() * this.gridCount);
            y = Math.floor(Math.random() * this.gridCount);
        } while (this.snake.some(segment => segment.x === x && segment.y === y));
        
        this.food = {x, y};
        
        const foodElement = document.createElement('div');
        foodElement.className = 'food';
        foodElement.style.left = `${x * this.gridSize}px`;
        foodElement.style.top = `${y * this.gridSize}px`;
        this.gameArea.appendChild(foodElement);
    }
    
    update() {
        this.direction = this.nextDirection;
        
        // 计算新的头部位置
        const head = {...this.snake[0]};
        switch (this.direction) {
            case 'up': head.y--; break;
            case 'down': head.y++; break;
            case 'left': head.x--; break;
            case 'right': head.x++; break;
        }
        
        // 检查碰撞
        if (this.checkCollision(head)) {
            this.gameOver();
            return;
        }
        
        // 移动蛇
        this.snake.unshift(head);
        
        // 检查是否吃到食物
        if (head.x === this.food.x && head.y === this.food.y) {
            // 增加分数
            this.score += 10;
            this.scoreElement.textContent = this.score;
            
            // 移除当前食物
            this.gameArea.removeChild(this.gameArea.querySelector('.food'));
            
            // 生成新食物
            this.generateFood();
            
            // 加快速度
            if (this.speed > 50) {
                this.speed -= 2;
                clearInterval(this.gameLoop);
                this.gameLoop = setInterval(() => this.update(), this.speed);
            }
        } else {
            // 如果没有吃到食物，移除尾部
            this.snake.pop();
        }
        
        // 更新视图
        this.render();
    }
    
    checkCollision(head) {
        // 检查是否撞墙
        if (head.x < 0 || head.x >= this.gridCount || head.y < 0 || head.y >= this.gridCount) {
            return true;
        }
        
        // 检查是否撞到自己
        return this.snake.some(segment => segment.x === head.x && segment.y === head.y);
    }
    
    render() {
        // 清除现有的蛇段
        const segments = this.gameArea.querySelectorAll('.snake-segment');
        segments.forEach(segment => this.gameArea.removeChild(segment));
        
        // 渲染新的蛇段
        this.snake.forEach((segment, index) => {
            const element = document.createElement('div');
            element.className = 'snake-segment';
            element.style.left = `${segment.x * this.gridSize}px`;
            element.style.top = `${segment.y * this.gridSize}px`;
            
            // 为头部添加特殊样式
            if (index === 0) {
                element.style.backgroundColor = 'var(--primary-color)';
                element.style.borderRadius = '6px';
            }
            
            this.gameArea.appendChild(element);
        });
    }
    
    gameOver() {
        clearInterval(this.gameLoop);
        this.overlay.style.display = 'flex';
        this.overlay.querySelector('h2').textContent = '游戏结束';
        this.overlay.querySelector('p').textContent = `最终得分: ${this.score}`;
        this.startButton.textContent = '重新开始';
    }
}

// 初始化游戏
window.addEventListener('load', () => {
    new SnakeGame();
}); 