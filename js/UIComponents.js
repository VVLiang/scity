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
            fontFamily: 'Arial',
            fontSize: '24px',
            fill: '#ffff00'
        }).setOrigin(1, 0.5);
        this.container.add(this.moneyText);

        // 监听金钱变化
        this.scene.registry.events.on('changedata-money', this.updateMoney, this);
    }

    updateMoney(parent, value) {
        this.moneyText.setText(value);
    }

    destroy() {
        this.scene.registry.events.off('changedata-money', this.updateMoney, this);
        this.container.destroy();
    }
}


// PhoneIcon组件
export class PhoneIcon {
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
            "Click the map icon to continue",
            {
                fontFamily: 'Arial',
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