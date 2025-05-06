export class InputBox extends Phaser.GameObjects.Container {
    constructor(scene, config) {
        super(scene, config.x, config.y);
        this.scene = scene;
        this.onSubmit = config.onSubmit;
        
        // 创建输入框元素
        this.createInputBox(config);
        scene.add.existing(this);
    }

    createInputBox(config) {
        // 获取屏幕宽度
        const screenWidth = this.scene.cameras.main.width;

        // 计算输入框宽度（屏幕宽度的 95%）
        const actualWidth = screenWidth * 0.95;

        // 计算居中位置
        const xPosition = (screenWidth - actualWidth) / 2;

        
        // 背景
        this.bg = this.scene.add.graphics()
            .fillStyle(0xffffff, 0.8)
            .fillRect(0, 0, actualWidth, 40) // actualWidth, 40px 高度
            .lineStyle(2, 0x000000)
            .strokeRect(0, 0, actualWidth, 40);

        // 输入文本
        this.inputText = this.scene.add.text(10, 10, '', {
            fontFamily: 'Comic Sans MS',
            fontSize: '16px',
            fill: '#000000'
        });


        // OK按钮
        this.okButton = this.scene.add.text(actualWidth - 60, 5, 'OK', {
            fontFamily: 'Comic Sans MS',
            fontSize: '16px',
            fill: '#0000ff',
            padding: { x: 10, y: 5 },
            backgroundColor: '#cccccc'
        })
        .setInteractive()
        .on('pointerdown', () => this.handleSubmit());

        this.add([this.bg, this.inputText, this.okButton]);

        // 键盘输入监听
        this.scene.input.keyboard.on('keydown', event => this.handleKeyInput(event));
        // 修改2：添加空格键处理
        this.scene.input.keyboard.addCapture(' '); // 阻止空格键默认行为
    }

 /**    handleKeyInput(event) {
        if (event.keyCode === 8) { // Backspace
            this.inputText.text = this.inputText.text.slice(0, -1);
        } else if (event.keyCode === 13) { // Enter
            this.handleSubmit();
        } else if (event.key === ' ' || event.key.length === 1) { // 允许空格
            this.inputText.text += event.key;
            event.stopPropagation(); // 阻止事件冒泡
        }
    }*/


    handleKeyInput(event) {
        if (event.keyCode === 8) { // Backspace
            this.inputText.text = this.inputText.text.slice(0, -1);
        } else if (event.keyCode === 13) { // Enter
            this.handleSubmit();
        } else if (event.key.length === 1) {
            this.inputText.text += event.key;
        }
    }

    handleSubmit() {
        if (this.inputText.text.trim()) {
            this.onSubmit(this.inputText.text);
            this.inputText.setText('');
        }
    }

    destroy() {
        this.scene.input.keyboard.off('keydown', this.handleKeyInput);
        super.destroy();
    }

    setVisible(state) {
        this.visible = state;
        this.bg.visible = state;
        this.inputText.visible = state;
        this.okButton.visible = state;
    }

}