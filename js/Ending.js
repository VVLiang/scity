class BadEnding1Scene extends Phaser.Scene {
    constructor() {
        super({ key: 'BadEnding1Scene' });
    }

    create() {
        // 停止所有之前的音频
        this.sound.stopAll();
        
        // 添加背景
        this.add.image(this.cameras.main.centerX, this.cameras.main.centerY, 'badending1')
            .setDisplaySize(this.cameras.main.width, this.cameras.main.height);

        // 播放结局音乐
        this.bgm = this.sound.add('badendingSound', { loop: true });
        this.bgm.play();

        // 创建文字显示容器
        const textContainer = this.add.container(
            this.cameras.main.centerX, 
            this.cameras.main.centerY - 100
        );

        // 文字样式配置
        const textStyle = {
            font: '48px Comic Sans MS',
            fill: '#ffffff',
            stroke: '#000000', 
            strokeThickness: 4,
            shadow: {                // 添加阴影效果
                offsetX: 3,
                offsetY: 3,
                color: '#333333',
                blur: 4,
                stroke: true,
                fill: true
            },
            wordWrap: { width: this.cameras.main.width - 100 },
            align: 'center'
        };

        // 创建文字对象
        const fullText = "You arrived at the remote compound.\nAll communications are cut off...";
        const displayText = this.add.text(0, 0, '', textStyle)
            .setOrigin(0.5)
            .setAlpha(1)
            .setShadow(2, 2, '#000000', 4);

        textContainer.add(displayText);

        // 打字机效果
        let charIndex = 0;
        this.time.addEvent({
            delay: 50,
            repeat: fullText.length - 1,
            callback: () => {
                displayText.text += fullText[charIndex];
                charIndex++;
                
                // 文字显示完成后添加按钮
                if (charIndex === fullText.length) {
                    this.addReplayButton();
                }
            }
        });
    }

    addReplayButton() {
        const centerX = this.cameras.main.centerX;
        const centerY = this.cameras.main.centerY + 100;
    
        const btnBg = this.add.graphics()
            .fillStyle(0x000000, 0.8)
            .fillRoundedRect(-100, -25, 200, 50, 15)
            .lineStyle(3, 0xffffff)
            .strokeRoundedRect(-100, -25, 200, 50, 15);
    
        const btnText = this.add.text(0, 0, 'Play Again', {
            font: '24px Comic Sans MS',
            fill: '#ffffff'
        }).setOrigin(0.5);
    
        const replayButton = this.add.container(centerX, centerY, [btnBg, btnText])
            .setInteractive(new Phaser.Geom.Rectangle(-100, -25, 200, 50), Phaser.Geom.Rectangle.Contains)
            .on('pointerover', () => {
                btnBg.clear()
                    .fillStyle(0x333333, 0.8)
                    .fillRoundedRect(-100, -25, 200, 50, 15)
                    .lineStyle(3, 0xffffff)
                    .strokeRoundedRect(-100, -25, 200, 50, 15);
                btnText.setColor('#ff0000');
            })
            .on('pointerout', () => {
                btnBg.clear()
                    .fillStyle(0x000000, 0.8)
                    .fillRoundedRect(-100, -25, 200, 50, 15)
                    .lineStyle(3, 0xffffff)
                    .strokeRoundedRect(-100, -25, 200, 50, 15);
                btnText.setColor('#ffffff');
            })
            .on('pointerdown', () => {
                if (!this.bookImageShown) {
                    this.bookImageShown = true;
    
                    // 黑色半透明背景（透明度 0.9）
                    this.overlay = this.add.rectangle(
                        this.cameras.main.centerX,
                        this.cameras.main.centerY,
                        this.cameras.main.width,
                        this.cameras.main.height,
                        0x000000,
                        0.9
                    ).setDepth(9)
                     .setInteractive()
                     .on('pointerdown', () => {
                        // 任何地方点击后重新开始
                        if (window.gameState) {
                            window.gameState = {
                                money: 1000,
                                trust: 0,
                                interest: 0,
                            };
                        }
    
                        this.sound.stopAll();
                        this.scene.start('StartScene');
                    });
    
                    // 图片显示在背景之上
                    this.bookImage = this.add.image(
                        this.cameras.main.centerX,
                        this.cameras.main.centerY,
                        'BOOKLET'
                    )
                    .setScale(0.5)
                    .setDepth(10);
                    
                    return;
                }
            });
    
        this.tweens.add({
            targets: replayButton,
            y: centerY + 5,
            duration: 1000,
            yoyo: true,
            repeat: -1
        });
    }
    
    
    
}


class BadEnding2Scene extends Phaser.Scene {
    constructor() {
        super({ key: 'BadEnding2Scene' });
    }

    create() {
        // 停止所有之前的音频
        this.sound.stopAll();
        
        // 添加背景
        this.add.image(this.cameras.main.centerX, this.cameras.main.centerY, 'badending1')
            .setDisplaySize(this.cameras.main.width, this.cameras.main.height);

        // 播放结局音乐
        this.bgm = this.sound.add('badendingSound', { loop: true });
        this.bgm.play();

        // 创建文字显示容器
        const textContainer = this.add.container(
            this.cameras.main.centerX, 
            this.cameras.main.centerY - 100
        );

        // 文字样式配置
        const textStyle = {
            font: '48px Comic Sans MS',
            fill: '#ffffff',
            stroke: '#000000', 
            strokeThickness: 4,
            shadow: {                // 添加阴影效果
                offsetX: 3,
                offsetY: 3,
                color: '#333333',
                blur: 4,
                stroke: true,
                fill: true
            },
            wordWrap: { width: this.cameras.main.width - 100 },
            align: 'center'
        };

        // 创建文字对象
        const fullText = "Payment successful… \nRecruiter disappears…\nPhone unreachable…";
        const displayText = this.add.text(0, 0, '', textStyle)
            .setOrigin(0.5)
            .setAlpha(1)
            .setShadow(2, 2, '#000000', 4);

        textContainer.add(displayText);

        // 打字机效果
        let charIndex = 0;
        this.time.addEvent({
            delay: 50,
            repeat: fullText.length - 1,
            callback: () => {
                displayText.text += fullText[charIndex];
                charIndex++;
                
                // 文字显示完成后添加按钮
                if (charIndex === fullText.length) {
                    this.addReplayButton();
                }
            }
        });
    }

    addReplayButton() {
        const centerX = this.cameras.main.centerX;
        const centerY = this.cameras.main.centerY + 100;
    
        const btnBg = this.add.graphics()
            .fillStyle(0x000000, 0.8)
            .fillRoundedRect(-100, -25, 200, 50, 15)
            .lineStyle(3, 0xffffff)
            .strokeRoundedRect(-100, -25, 200, 50, 15);
    
        const btnText = this.add.text(0, 0, 'Play Again', {
            font: '24px Comic Sans MS',
            fill: '#ffffff'
        }).setOrigin(0.5);
    
        const replayButton = this.add.container(centerX, centerY, [btnBg, btnText])
            .setInteractive(new Phaser.Geom.Rectangle(-100, -25, 200, 50), Phaser.Geom.Rectangle.Contains)
            .on('pointerover', () => {
                btnBg.clear()
                    .fillStyle(0x333333, 0.8)
                    .fillRoundedRect(-100, -25, 200, 50, 15)
                    .lineStyle(3, 0xffffff)
                    .strokeRoundedRect(-100, -25, 200, 50, 15);
                btnText.setColor('#ff0000');
            })
            .on('pointerout', () => {
                btnBg.clear()
                    .fillStyle(0x000000, 0.8)
                    .fillRoundedRect(-100, -25, 200, 50, 15)
                    .lineStyle(3, 0xffffff)
                    .strokeRoundedRect(-100, -25, 200, 50, 15);
                btnText.setColor('#ffffff');
            })
            .on('pointerdown', () => {
                if (!this.bookImageShown) {
                    this.bookImageShown = true;
    
                    // 黑色半透明背景（透明度 0.9）
                    this.overlay = this.add.rectangle(
                        this.cameras.main.centerX,
                        this.cameras.main.centerY,
                        this.cameras.main.width,
                        this.cameras.main.height,
                        0x000000,
                        0.9
                    ).setDepth(9)
                     .setInteractive()
                     .on('pointerdown', () => {
                        // 任何地方点击后重新开始
                        if (window.gameState) {
                            window.gameState = {
                                money: 1000,
                                trust: 0,
                                interest: 0,
                            };
                        }
    
                        this.sound.stopAll();
                        this.scene.start('StartScene');
                    });
    
                    // 图片显示在背景之上
                    this.bookImage = this.add.image(
                        this.cameras.main.centerX,
                        this.cameras.main.centerY,
                        'BOOKLET'
                    )
                    .setScale(0.5)
                    .setDepth(10);
                    
                    return;
                }
            });
    
        this.tweens.add({
            targets: replayButton,
            y: centerY + 5,
            duration: 1000,
            yoyo: true,
            repeat: -1
        });
    }
    
    
    
}

export { BadEnding1Scene, BadEnding2Scene };