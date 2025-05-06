// UIComponents.js
export class MoneyDisplay {
    constructor(scene) {
        this.scene = scene;
        this.create();
    }

    create() {
        const centerX = this.scene.cameras.main.centerX;
        const centerY = this.scene.cameras.main.centerY;
        
        // 容器参数
        const containerWidth = 120;
        const containerHeight = 40;
        const containerX = this.scene.cameras.main.width - containerWidth - 220;
        const containerY = 20;

        // 创建容器
        this.container = this.scene.add.container(containerX, containerY);

        // 背景图形
        const bg = this.scene.add.graphics()
            .fillStyle(0x000000, 1)
            .lineStyle(3, 0xffffff, 1)
            .fillRoundedRect(0, 0, containerWidth, containerHeight, 10)
            .strokeRoundedRect(0, 0, containerWidth, containerHeight, 10);
        this.container.add(bg);

        // 金币图标
        this.coinIcon = this.scene.add.image(10, containerHeight/2, 'coin')
            .setOrigin(0, 0.5)
            .setScale(0.03);
        this.container.add(this.coinIcon);

        // 金钱文本
        this.moneyText = this.scene.add.text(containerWidth-10, containerHeight/2, this.scene.registry.get('money'), {
            fontFamily: 'Comic Sans MS',
            fontSize: '24px',
            fill: '#ffff00'
        }).setOrigin(1, 0.5);
        this.container.add(this.moneyText);

        // 监听金钱变化
        this.scene.registry.events.on('changedata-money', this.updateMoney, this);
    }

    highlight() {
        // 创建发光效果
        const shadow = this.scene.add.graphics()
            .fillStyle(0xFFD700, 0.3)
            .fillRect(
                this.container.x - 10,
                this.container.y - 10,
                this.container.width + 20,
                this.container.height + 20
            )
            .setBlendMode(Phaser.BlendModes.ADD);

        // 添加脉冲动画
        this.scene.tweens.add({
            targets: shadow,
            alpha: { from: 0.3, to: 0.6 },
            duration: 800,
            yoyo: true,
            repeat: -1
        });

        // 将阴影添加到容器
        this.container.addAt(shadow, 0);
    }

    updateMoney(value) {
        this.moneyText.setText(value);
    }

    destroy() {
        this.scene.registry.events.off('changedata-money', this.updateMoney, this);
        this.container.destroy();
    }
    
}


// PhoneIcon组件
export class PhoneIcon_first {
    constructor(scene, onClick) {
        this.scene = scene;
        this.hasFirstClicked = false; // 新增首次点击状态
        this.icon = scene.add.image(
            scene.cameras.main.width - 80, 
            20, 
            'phoneIcon'
        )
        .setOrigin(1, 0)
        .setScale(0.3)
        .setInteractive()
        .on('pointerdown', () => {
            this.hasFirstClicked = true;
            onClick();
        });
    }

    get x() { return this.icon.x; }
    get y() { return this.icon.y; }
    get width() { return this.icon.displayWidth; }
    get height() { return this.icon.displayHeight; }
    
    destroy() {
        this.icon.destroy();
    }
}


export class PhoneIcon {
    constructor(scene) {
        this.scene = scene;
        this.isPhoneVisible = false; // 记录手机界面是否可见

        // 创建 PhoneIcon 图标
        this.icon = scene.add.image(
            scene.cameras.main.width - 80, 
            20, 
            'phoneIcon'
        )
        .setOrigin(1, 0)
        .setScale(0.3)
        .setInteractive()
        .on('pointerdown', () => this.togglePhoneIndex()); // 点击切换 phoneIndex

        // 创建 phoneIndex（手机界面），默认隐藏
        this.phoneIndex = scene.add.image(
            scene.cameras.main.centerX, 
            scene.cameras.main.centerY, 
            'phoneIndex'
        )
        .setOrigin(0.5)
        .setScale(0.8)
        .setDepth(1000)
        .setVisible(false); // 初始状态隐藏
    }

    // 切换 phoneIndex 的显示状态
    togglePhoneIndex() {
        this.isPhoneVisible = !this.isPhoneVisible; // 切换状态
        this.phoneIndex.setVisible(this.isPhoneVisible); // 控制显示或隐藏
    }

    // 获取图标属性
    get x() { return this.icon.x; }
    get y() { return this.icon.y; }
    get width() { return this.icon.displayWidth; }
    get height() { return this.icon.displayHeight; }

    // 销毁图标和手机界面
    destroy() {
        this.icon.destroy();
        this.phoneIndex.destroy();
    }
}





export class MapIcon {
    constructor(scene, onClickCallback) {
        this.scene = scene;
        this.onClickCallback = onClickCallback;
        this.hasFirstClicked = false; // 新增首次点击状态
        this.instructionText = null; // 提示文字引用
        this.create();
    }

    create() {
        // 创建地图图标
        this.mapIcon = this.scene.add.image(
            this.scene.cameras.main.width - 150,
            20,
            'mapIcon'
        )
        .setOrigin(1, 0)
        .setScale(0.3)
        .setInteractive();

        // 创建提示文字
        this.instructionText = this.scene.add.text(
            this.mapIcon.x - 50,
            this.mapIcon.y + this.mapIcon.displayHeight + 20,
            "Click the map icon to go out",
            {
                fontFamily: 'Comic Sans MS',
                fontSize: '20px',
                fill: '#ffffff',
                stroke: '#000000',
                strokeThickness: 4
            }
        ).setOrigin(1, 0);

        // 点击事件处理
        this.mapIcon.on('pointerdown', () => {
            if (!this.hasFirstClicked) {
                // 首次点击处理
                this.hasFirstClicked = true;
                this.instructionText.destroy();
                this.instructionText = null;
            }
            
            // 执行回调函数
            if (typeof this.onClickCallback === 'function') {
                this.onClickCallback();
            }
        });
    }

    destroy() {
        this.mapIcon.destroy();
        if (this.instructionText) {
            this.instructionText.destroy();
        }
    }
}