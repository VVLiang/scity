export class DialogBox extends Phaser.GameObjects.Container {
    constructor(scene, config) {
        super(scene, config.x, config.y);
        this.scene = scene;
        this.dialogues = config.dialogues;
        this.portraitKey = config.portraitKey;
        this.onComplete = config.onComplete;
        
        // 初始化状态
        this.dialogueIndex = 0;
        this.isTyping = false;
        this.typingEvent = null;

        // 创建对话框图形
        this.createDialogBox(config);
        scene.add.existing(this);
    }

    createDialogBox(config) {
        // 对话框背景
        this.bg = this.scene.add.graphics()
            .fillStyle(0x000000, 0.8)
            .fillRect(0, 0, config.width, config.height)
            .lineStyle(4, 0xffffff)
            .strokeRect(0, 0, config.width, config.height);

        // 角色立绘
        this.portrait = this.scene.add.image(
            20 + (config.height - 40)/2, 
            config.height/2, 
            this.portraitKey
        ).setDisplaySize(config.height - 40, config.height - 40);

        // 对话文本
        this.text = this.scene.add.text(
            this.portrait.x + this.portrait.displayWidth/2 + 20,
            20,
            '', 
            {
                fontFamily: 'Arial',
                fontSize: '20px',
                fill: '#ffffff',
                wordWrap: { width: config.width - this.portrait.displayWidth - 60 }
            }
        );

        this.add([this.bg, this.portrait, this.text]);
        
        // 交互设置
        this.setInteractive(
            new Phaser.Geom.Rectangle(0, 0, config.width, config.height),
            Phaser.Geom.Rectangle.Contains
        );
        this.on('pointerdown', () => this.showNextDialogue());
        //this.scene.input.keyboard.on('keydown-SPACE', () => this.showNextDialogue());
    }

    showNextDialogue() {
        if (this.isTyping) {
            this.typingEvent.remove();
            this.text.setText(this.dialogues[this.dialogueIndex]);
            this.isTyping = false;
            return;
        }

        if (this.dialogueIndex < this.dialogues.length) {
            this.typeText(this.dialogues[this.dialogueIndex++]);
        } else {
            this.onComplete();
        }
    }

    typeText(fullText) {
        this.isTyping = true;
        let charIndex = 0;
        this.text.setText('');
        
        this.typingEvent = this.scene.time.addEvent({
            delay: 20,
            repeat: fullText.length - 1,
            callback: () => {
                this.text.text += fullText[charIndex++];
                if (charIndex >= fullText.length) {
                    this.isTyping = false;
                }
            }
        });
    }
}