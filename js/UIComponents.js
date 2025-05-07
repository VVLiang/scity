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
        .setVisible(false); // 初始状态隐藏// 其他 phone 屏幕层级内容，默认隐藏
        this.phone0 = scene.add.image(scene.cameras.main.centerX, scene.cameras.main.centerY, 'phone0')
            .setOrigin(0.5)
            .setScale(0.8)
            .setDepth(1001)
            .setVisible(false)
            .setInteractive()
            .on('pointerdown', () => this.showPhone1());
        
        this.phone1 = scene.add.image(scene.cameras.main.centerX, scene.cameras.main.centerY, 'phone1')
            .setOrigin(0.5)
            .setScale(0.8)
            .setDepth(1002)
            .setVisible(false)
            .setInteractive()
            .on('pointerdown', () => this.showPhone2());
        
        this.phone2 = scene.add.image(scene.cameras.main.centerX, scene.cameras.main.centerY, 'phone2')
            .setOrigin(0.5)
            .setScale(0.8)
            .setDepth(1003)
            .setVisible(false)
            .setInteractive()
            .on('pointerdown', () => this.enterJobfairScene()); 
            
        
        
        
        
        
    }
    enterJobfairScene() {
        // 关闭手机相关界面（避免残留）
        this.isPhoneVisible = false;
        this.phoneIndex.setVisible(false);
        this.phone0.setVisible(false);
        this.phone1.setVisible(false);
        this.phone2.setVisible(false);
    
        if (this.bgClickZone) {
            this.bgClickZone.destroy();
            this.bgClickZone = null;
        }
    
        // 切换到 JobfairScene
        this.scene.scene.start('JobfairScene');
    }
     // 添加跳转函数
    // 切换 phoneIndex 的显示状态
    togglePhoneIndex() {
        this.isPhoneVisible = !this.isPhoneVisible;
    
        this.phoneIndex.setVisible(this.isPhoneVisible);
        this.phone0.setVisible(this.isPhoneVisible);
        this.phone1.setVisible(false);
        this.phone2.setVisible(false);
    
        if (this.isPhoneVisible) {
            // 启用全屏点击检测：点击其他区域关闭
            this.bgClickZone = this.scene.add.zone(0, 0, this.scene.cameras.main.width, this.scene.cameras.main.height)
                .setOrigin(0)
                .setDepth(999)
                .setInteractive()
                .on('pointerdown', (pointer) => {
                    const bounds = this.phoneIndex.getBounds();
                    if (!Phaser.Geom.Rectangle.Contains(bounds, pointer.x, pointer.y)) {
                        this.togglePhoneIndex();  // 点击外部关闭
                    }
                });
        } else {
            // 移除点击区域
            if (this.bgClickZone) {
                this.bgClickZone.destroy();
                this.bgClickZone = null;
            }
        }
    }
    showPhone1() {
        this.phone0.setVisible(false);
        this.phone1.setVisible(true);
    }
    
    showPhone2() {
        this.phone1.setVisible(false);
        this.phone2.setVisible(true);
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
        this.phone0.destroy();
        this.phone1.destroy();
        this.phone2.destroy();
        if (this.bgClickZone) this.bgClickZone.destroy();
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