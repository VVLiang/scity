import { MoneyDisplay, PhoneIcon, MapIcon, PhoneIcon_first } from './UIComponents.js';
import { DialogBox } from './DialogBox.js';
import { InputBox } from './DInputBox.js';
import { BadEnding1Scene, BadEnding2Scene } from './Ending.js';

/**********************************************************************
 * 游戏数据和全局变量 
 **********************************************************************/
let player = {
    name: "小马",
    money: 10000, // 主角起始金钱
    // 后续如经验、状态等可以在此扩展
};

/**********************************************************************
 * 各个场景的定义
 **********************************************************************/

// 1. BootScene – 预加载资源（图片、音频、字体等）
class BootScene extends Phaser.Scene {
    constructor() {
        super('BootScene');
    }
    preload() {
        // 预加载背景
        this.load.image('title', 'assets/title.png'); // 标题图片
        this.load.image('room', 'assets/room.png');   // 小马毕业后房间场景
        this.load.image('scene2', 'assets/scene2.png');     // 小马使用手机的背景
        this.load.image('coffee', 'assets/coffee.png');     // coffee
        this.load.image('jobfair', 'assets/招聘会.png');     // jobfair
        
        //预加载UI
        this.load.image('phoneIcon', 'assets/phoneIcon.png');
        this.load.image('phoneIndex', 'assets/phoneIndex.png');
        this.load.image('phone0', 'assets/0 HOMEPAGE.png');
        this.load.image('phone1', 'assets/1 MY CHAT.png');
        this.load.image('phone2', 'assets/2 CHAT DETAIL.png');
        this.load.image('coin', 'assets/coin.png');//coin
        this.load.image('mapIcon', 'assets/mapIcon.png');//mapIcon

        // 预加载音效
        //this.load.audio('phoneSound', 'assets/audio/message.ogg');
        this.load.audio('titleSound', 'assets/audio/开始场景ConcernedApe - JunimoKart(Title Theme).ogg');
        //this.load.audio('roomSound', 'assets/audio/第一幕毕业典礼后Yoko Shimomura - Dearly Beloved (-Forest Memory-).ogg');
        this.load.audio('scene2Sound', 'assets/audio/新手教学ConcernedApe - Settling In.ogg');
        this.load.audio('mapSound', 'assets/audio/地图解锁-ConcernedApe - Pelican Town.ogg');
        this.load.audio('coffeeSound', 'assets/audio/咖啡店-DarkSpirit - 暗流（Undercurrent）.ogg');
        this.load.audio('jobfairSound', 'assets/audio/招聘会-Cavilonn the Noble.ogg');
        this.load.audio('achievementSound', 'assets/audio/achievement.wav');


        // 预加载立绘
        this.load.image('player_smile', 'assets/player/smile.png');
        this.load.image('player_speechless', 'assets/player/speechless.png');
        this.load.image('npc_coffee_smile', 'assets/NPC/Alumni_smile.png');
        this.load.image('npc_jobfair_smile', 'assets/NPC/Recruiter_smile.png');

        //预加载成就
        this.load.image('SHAERP_EYE', 'assets/achievements/SHAERP EYE.png');
        this.load.image('BOOKLET', 'assets/achievements/BOOK.png');

        // 预加载地图
        this.load.image('map_background', 'assets/map/map.png');

        //预加载结局
        this.load.image('badending1', 'assets/ending/badending1.png');
        this.load.audio('badendingSound', 'assets/audio/被诈骗-日本ACG - 絶望 -despair-.ogg');
    }
    create() {
        // 预加载完后跳转到开始场景 StartScene   MapScene  BadEnding1Scene
        this.scene.start('StartScene');     

        // 初始化数值
        if (!this.registry.get('money')) {
            this.registry.set('money', 10000);
        }   
    }
}

  
// 2. StartScene – 开始界面（标题画面）
class StartScene extends Phaser.Scene {
    constructor() {
        super('StartScene');
    }
    create() {
        let titleSound = this.sound.add('titleSound', { loop: true, volume: 0.5 });
        titleSound.play();

        // 获取摄像头中心坐标
        const centerX = this.cameras.main.centerX;
        const centerY = this.cameras.main.centerY;

        // 添加标题图片，并设置原点为中心
        // 并计算适当的缩放比例让图片完全显示（例如留出1%的边距）
        const titleImage = this.add.image(centerX, centerY, 'title').setOrigin(0.5, 0.5);
        const availableWidth = this.cameras.main.width * 1;   // 留出1%边距
        const availableHeight = this.cameras.main.height * 1;
        const scaleX = availableWidth / titleImage.width;
        const scaleY = availableHeight / titleImage.height;
        const scaleFactor = Math.min(scaleX, scaleY);
        titleImage.setScale(scaleFactor);

        /****** 添加按钮文本（艺术字效果）并设置居中显示 ******/
        const startText = this.add.text(centerX, this.cameras.main.height - 80, "Click To Start", {
            fontFamily: '"Press Start 2P"',  // 使用像素风格字体（需在 HTML 中引入 Web 字体）
            fontSize: '32px',
            fill: '#ffffff',
            stroke: '#000000',       // 黑色描边
            strokeThickness: 4,      // 描边厚度
            shadow: {                // 添加阴影效果
                offsetX: 3,
                offsetY: 3,
                color: '#333333',
                blur: 4,
                stroke: true,
                fill: true
            }
        });
        startText.setOrigin(0.5);

        // 利用 Tween 让文本进行跳动效果（上下移动）
        this.tweens.add({
            targets: startText,
            y: startText.y - 10,  // 相对当前 y 坐标上移 20 像素
            duration: 500,        // 动画持续 500 毫秒
            ease: 'Sine.easeInOut',
            yoyo: true,           // 动画来回播放
            repeat: -1            // 无限循环
        });

        // 点击后进入场景1
        this.input.once('pointerdown', () => {
            this.sound.stopByKey('titleSound');
            this.scene.start('Scene1');
        });
    }
}



// 3. Scene1 – “毕业后的新开始”：早晨的房间场景
class Scene1 extends Phaser.Scene {
    constructor() {
        super('Scene1');
    }
    create() {
        let scene2Sound = this.sound.add('scene2Sound', { loop: true, volume: 0.5 });
        scene2Sound.play();

        // 获取摄像头中心坐标
        const centerX = this.cameras.main.centerX;
        const centerY = this.cameras.main.centerY;

        // 显示房间中透入阳光的背景（像素风格图片）
        // 计算适当缩放比例使图片完全显示，留1%边距
        const roomImage = this.add.image(centerX, centerY, 'room').setOrigin(0.5, 0.5);
        const availableWidth = this.cameras.main.width * 0.99;
        const availableHeight = this.cameras.main.height * 0.99;
        const scaleX = availableWidth / roomImage.width;
        const scaleY = availableHeight / roomImage.height;
        const scaleFactor = Math.min(scaleX, scaleY);
        roomImage.setScale(scaleFactor);
        /******************************* skip ***************************/
        // 计算右上角的位置
        const skipX = this.cameras.main.width - 80; // 距离右边 80px
        const skipY = 20; // 距离顶部 20px

        // 创建 "Skip" 按钮背景（黑色）
        const skipBg = this.add.graphics()
            .fillStyle(0x000000, 0.8) // 黑色背景
            .fillRect(-50, -15, 100, 30) // 设定大小
            .setDepth(1000);

        // 创建 "Skip" 文字
        const skipText = this.add.text(0, 0, '', { // 初始为空
            font: '24px Comic Sans MS',
            fill: '#ffffff'
        }).setOrigin(0.5)
          .setDepth(1001);

        // 创建容器，包含背景和文字
        const skipContainer = this.add.container(skipX, skipY, [skipBg, skipText])
            .setSize(100, 30)
            .setInteractive()
            .on('pointerdown', () => {
                this.scene.start('MapScene'); // 点击跳转到 MapScene
            });

        // 逐字打字机动画
        this.startTypingEffect(skipText, "Skip");

        /******************************* dialogues ***************************/       
        // 对话内容：使用数组存储多句对话文字
        const dialogues = [
            "Finally, I graduated from the MUA program!",
            "At last, campus life is over... ",
            "Now it’s time to start the job hunt."
        ];
        let dialogueIndex = 0; // 当前对话序号
        let isTyping = false;  // 标记当前是否正处于打字状态
        let typingEvent = null; // 保存打字事件

        // 绘制对话框：在屏幕底部，带有边框
        const dialogBoxWidth = this.cameras.main.width * 0.95;
        const dialogBoxHeight = 150;
        const dialogBoxX = this.cameras.main.centerX - dialogBoxWidth / 2;
        const dialogBoxY = this.cameras.main.height - dialogBoxHeight - 20; // 距离底部20px

        // 使用 Graphics 绘制对话框背景及边框
        const dialogGraphics = this.add.graphics();
        // 绘制半透明背景
        dialogGraphics.fillStyle(0x000000, 0.8);
        dialogGraphics.fillRect(dialogBoxX, dialogBoxY, dialogBoxWidth, dialogBoxHeight);
        // 绘制边框（这里用白色边框，线宽4）
        dialogGraphics.lineStyle(4, 0xffffff, 1);
        dialogGraphics.strokeRect(dialogBoxX, dialogBoxY, dialogBoxWidth, dialogBoxHeight);

        // 对话框左侧显示主角的立绘
        const portraitMargin = 10;
        const portraitSize = dialogBoxHeight - 20; // 让立绘略小于对话框高度
        const portraitX = dialogBoxX + portraitMargin + portraitSize / 2;
        const portraitY = dialogBoxY + dialogBoxHeight / 2;
        const portraitImage = this.add.image(portraitX, portraitY, 'player_smile').setOrigin(0.5);
        // 如果立绘图片不符合尺寸，可使用 setDisplaySize 调整
        portraitImage.setDisplaySize(portraitSize, portraitSize);

        // 创建对话文本对象，文字区域排除掉立绘部分
        const textX = portraitX + portraitSize / 2 + 30; // 立绘右侧留10px边距
        const textY = dialogBoxY + 20;
        const dialogueText = this.add.text(textX, textY, "", {
            fontFamily: 'Comic Sans MS',
            fontSize: '20px',
            fill: '#ffffff',
            wordWrap: { width: dialogBoxWidth - portraitSize - 30 }
        });

        // 定义函数：显示下一句对话，采用打字机效果
        const showNextDialogue = () => {
            // 如果当前正处于打字状态，则立即补全文本，并停止打字事件
            if (isTyping) {
                if (typingEvent) {
                    typingEvent.remove();
                }
                dialogueText.setText(dialogues[dialogueIndex - 1]); // 补全当前对话
                isTyping = false;
                return;
            }
            // 进入下一句对话（若还有未显示的内容）
            if (dialogueIndex < dialogues.length) {
                let fullText = dialogues[dialogueIndex];
                dialogueText.setText(""); // 清空现有文本
                isTyping = true;
                let charIndex = 0;
                // 利用 Timer 事件实现逐字符显示，每20毫秒显示1个字符
                typingEvent = this.time.addEvent({
                    delay: 20,
                    repeat: fullText.length - 1,
                    callback: () => {
                        dialogueText.text += fullText.charAt(charIndex);
                        charIndex++;
                        if (charIndex >= fullText.length) {
                            isTyping = false;
                        }
                    }
                });
                dialogueIndex++;
            } else {
                // 所有对话显示完毕，进入下一个场景（你可以根据需要调整这部分逻辑）
                this.scene.start('Scene2');
            }
        };

        // 显示第一句对话
        showNextDialogue();

        // 为对话框添加点击交互：点击对话框区域触发显示下一句
        dialogGraphics.setInteractive(
            new Phaser.Geom.Rectangle(dialogBoxX, dialogBoxY, dialogBoxWidth, dialogBoxHeight),
            Phaser.Geom.Rectangle.Contains
        );
        dialogGraphics.on('pointerdown', showNextDialogue);

        // 同时，监听空格键，以便显示下一句文本
        this.input.keyboard.on('keydown-SPACE', showNextDialogue);
    }
    startTypingEffect(textObject, fullText) {
        let index = 0;
        const typeSpeed = 150; // 每个字出现的时间（毫秒）

        const typeLoop = () => {
            textObject.setText(fullText.substring(0, index)); // 更新文本
            index++;

            if (index <= fullText.length) {
                this.time.delayedCall(typeSpeed, typeLoop); // 继续下一个字
            } else {
                this.time.delayedCall(1000, () => { // 等待 1 秒后重新开始
                    index = 0;
                    typeLoop();
                });
            }
        };

        typeLoop(); // 启动打字机动画
    }
}


// 2. Scene2 – “使用手机指南”：指导玩家如何使用手机
class Scene2 extends Phaser.Scene {
    constructor() {
        super('Scene2');
    }
    
    create() {
        
        const centerX = this.cameras.main.centerX;
        const centerY = this.cameras.main.centerY;
        
        // ---------------- 1. 背景设置 ----------------
        const scene2Image = this.add.image(centerX, centerY, 'scene2').setOrigin(0.5, 0.5);
        const scaleFactor = Math.min(
            (this.cameras.main.width * 0.99) / scene2Image.width,
            (this.cameras.main.height * 0.99) / scene2Image.height
        );
        scene2Image.setScale(scaleFactor);

        // 计算右上角的位置
        const skipX = this.cameras.main.width - 80; // 距离右边 80px
        const skipY = 100; // 距离顶部 100px

        // 创建 "Skip" 按钮背景（黑色）
        const skipBg = this.add.graphics()
            .fillStyle(0x000000, 0.8) // 黑色背景
            .fillRect(-50, -15, 100, 30) // 设定大小
            .setDepth(1000);

        // 创建 "Skip" 文字
        const skipText = this.add.text(0, 0, '', { // 初始为空
            font: '24px Comic Sans MS',
            fill: '#ffffff'
        }).setOrigin(0.5)
          .setDepth(1001);

        // 创建容器，包含背景和文字
        const skipContainer = this.add.container(skipX, skipY, [skipBg, skipText])
            .setSize(100, 30)
            .setInteractive()
            .on('pointerdown', () => {
                this.scene.start('MapScene'); // 点击跳转到 MapScene
            });

        // 逐字打字机动画
        this.startTypingEffect(skipText, "Skip");

        // ---------------- 2. 系统消息对话框（点击推进） ----------------
        let msgGraphics, systemText;
        let isTyping = false;
        let typingEvent = null;
        let dialogueIndex = 0;

        // 初始化消息框
        const initMessageBox = () => {
            const msgBoxWidth = this.cameras.main.width * 0.6;
            const msgBoxHeight = 125;
            const msgBoxX = centerX - msgBoxWidth / 2;
            const msgBoxY = centerY - msgBoxHeight / 2;
            
            // 创建图形和文本
            msgGraphics = this.add.graphics()
                .fillStyle(0x000000, 0.9)
                .fillRect(msgBoxX, msgBoxY, msgBoxWidth, msgBoxHeight);
            
            const textMargin = 20;
            systemText = this.add.text(
                msgBoxX + textMargin, 
                msgBoxY + textMargin, 
                "", 
                {
                    fontFamily: 'Comic Sans MS',
                    fontSize: '20px',
                    fill: '#ffffff',
                    wordWrap: { width: msgBoxWidth - 2 * textMargin }
                }
            );
            
            // 设置交互
            msgGraphics.setInteractive(
                new Phaser.Geom.Rectangle(msgBoxX, msgBoxY, msgBoxWidth, msgBoxHeight),
                Phaser.Geom.Rectangle.Contains
            );

            // 绑定点击事件
            msgGraphics.on('pointerdown', handleDialogueClick);
        };

        /** 对话内容 */
        const dialogues = [
            "You currently have ¥10000 in savings. Every cent must be spent wisely.",
            "Your goal — find a full-time job and settle down in S City."
        ];

        /** 处理对话框点击 */
        const handleDialogueClick = () => {
            if (isTyping) {
                // 立即完成当前打字效果
                typingEvent.remove();
                systemText.setText(dialogues[dialogueIndex]); // 注意这里使用当前索引
                isTyping = false;
                dialogueIndex++; // 关键修复：立即递增索引
                return;
            }
        
            if (dialogueIndex < dialogues.length) {
                // 播放当前索引对应的对话（修改前错误地使用了 dialogueIndex++）
                typeDialogue(dialogues[dialogueIndex], () => {
                    dialogueIndex++;
                });
            } else {
                // 对话结束处理
                msgGraphics.off('pointerdown', handleDialogueClick);
                startPhoneInstruction();
            }
        };

        /** 打字机效果 */
        const typeDialogue = (fullText, onComplete) => {
            systemText.setText("");
            let charIndex = 0;
            isTyping = true;
            
            typingEvent = this.time.addEvent({
                delay: 20,
                repeat: fullText.length - 1,
                callback: () => {
                    systemText.text += fullText.charAt(charIndex);
                    charIndex++; // 修改前错误使用了 ++charIndex
                    if (charIndex >= fullText.length) {
                        isTyping = false;
                        onComplete?.();
                    }
                }
            });
        };

        // 初始化并开始对话
        initMessageBox();
        handleDialogueClick(); // 自动开始第一句对话

        // ---------------- 4. 手机引导阶段 ----------------
        const startPhoneInstruction = () => {
            // 销毁消息框元素
            //msgGraphics.destroy();
            //systemText.destroy();
            
            // 添加遮罩
            this.overlay = this.add.rectangle(
                centerX, centerY, 
                this.cameras.main.width, 
                this.cameras.main.height, 
                0x000000, 0.5
            );
            
            // 初始化手机图标组件
            this.phoneIcon_f = new PhoneIcon_first(this, () => {
                // 首次点击处理
                if (!this.phoneIcon_f.hasFirstClicked) return;
                
                // 移除遮罩和首次提示
                this.overlay.destroy();
                if (this.phoneInstructionText) {
                    this.phoneInstructionText.destroy();
                    this.phoneInstructionText = null;
                }
                
                this.togglePhoneInterface();
            });
            
            // 添加首次提示文字
            this.phoneInstructionText = this.add.text(
                this.phoneIcon_f.x - 10,
                this.phoneIcon_f.y + this.phoneIcon_f.height + 20,
                "Click the phone icon to open your phone.",
                { fontFamily: 'Comic Sans MS',
                    fontSize: '20px',
                    fill: '#ffffff',
                    stroke: '#000000',
                    strokeThickness: 4 }
            ).setOrigin(1, 0);
        };

        // ---------------- 5. 手机界面切换功能 ----------------
        this.togglePhoneInterface = () => {
            if (!this.phoneInterface) {
                // 先创建手机界面实例
                this.phoneInterface = this.add.image(centerX, centerY, 'phoneIndex');
                
                // 通过纹理管理器直接获取纹理
                const texture = this.textures.get('phoneIndex');
                const scale = Math.min(
                    (this.cameras.main.width * 0.7) / texture.getSourceImage().width,
                    (this.cameras.main.height * 0.7) / texture.getSourceImage().height
                );
                this.phoneInterface.setScale(scale);
                
                // 添加使用提示（只显示一次）
                if (!this.phoneHelpDismissed) {
                    this.phoneHelpText = this.add.text(
                        centerX,
                        this.phoneInterface.y + this.phoneInterface.displayHeight/2 + 20,
                        "You can open your phone anytime to check messages, track spending, or manage tasks.",
                        { 
                            fontFamily: 'Comic Sans MS',
                            fontSize: '20px',
                            fill: '#ffffff',
                            stroke: '#000000',
                            strokeThickness: 4 
                        }
                    ).setOrigin(0.5);
                }
            }  else {
                // 切换可见性
                const shouldShow = !this.phoneInterface.visible;
                this.phoneInterface.setVisible(shouldShow);
                
                // 处理帮助文字
                if (this.phoneHelpText) {
                    if (shouldShow && !this.phoneHelpDismissed) {
                        this.phoneHelpText.setVisible(true);
                    } else {
                        // 第二次关闭时永久移除帮助文字
                        this.phoneHelpText.destroy();
                        this.phoneHelpText = null;
                        this.phoneHelpDismissed = true;
                    }
                }
            }
            
            // 当关闭手机界面时显示地图提示
            if (!this.phoneInterface.visible) {
                this.showMapPrompt();
            }
        };

        // ---------------- 6. 地图提示功能 ----------------
        this.showMapPrompt = () => {
            // 添加遮罩
            const overlay = this.add.rectangle(
                centerX, centerY,
                this.cameras.main.width,
                this.cameras.main.height,
                0x000000, 0.5
            );
    
            // 初始化地图图标组件
            this.mapIcon = new MapIcon(this, () => {
                // 点击回调处理
                overlay.destroy();
                this.scene.start('MapScene');
            });
        };


        
        // 初始化UI组件
        this.moneyDisplay = new MoneyDisplay(this);
    }

    startTypingEffect(textObject, fullText) {
        let index = 0;
        const typeSpeed = 150; // 每个字出现的时间（毫秒）

        const typeLoop = () => {
            textObject.setText(fullText.substring(0, index)); // 更新文本
            index++;

            if (index <= fullText.length) {
                this.time.delayedCall(typeSpeed, typeLoop); // 继续下一个字
            } else {
                this.time.delayedCall(1000, () => { // 等待 1 秒后重新开始
                    index = 0;
                    typeLoop();
                });
            }
        };

        typeLoop(); // 启动打字机动画
    }

}


// 6. MapScene – 主地图：显示各地点的解锁状态
class MapScene extends Phaser.Scene {
    constructor() {
        super('MapScene');
    }
        
    create() {
        const centerX = this.cameras.main.centerX;
        const centerY = this.cameras.main.centerY;
        const screenWidth = this.cameras.main.width;
        const screenHeight = this.cameras.main.height;

        // 初始化公共组件
        this.moneyDisplay = new MoneyDisplay(this);
        this.phoneIcon = new PhoneIcon(this);
        this.mapIcon = new MapIcon(this, () => this.scene.start('MapScene'));
        this.moneyDisplay.container.setDepth(100);
        this.phoneIcon.icon.setDepth(100);
        this.mapIcon.mapIcon.setDepth(100);

        this.sound.stopAll();
        let mapSound = this.sound.add('mapSound', { loop: true, volume: 0.5 });
        mapSound.play();

        // 显示地图背景
        const mapImage = this.add.image(centerX, centerY, 'map_background').setOrigin(0.5, 0.5);
        const availableWidth = this.cameras.main.width * 0.99;
        const availableHeight = this.cameras.main.height * 0.99;
        const scaleX = availableWidth / mapImage.width;
        const scaleY = availableHeight / mapImage.height;
        const scaleFactor = Math.min(scaleX, scaleY);
        mapImage.setScale(scaleFactor);


        // 按钮配置（行从1开始，列从1开始）
        const buttons = [
            { label: 'Home', scene: 'HomeScene', row: 1, col: 1 },
            { label: 'Coffee', scene: 'CoffeeScene', row: 1, col: 2 },
            { label: 'School', scene: 'SchoolScene', row: 1, col: 3 },
            { label: 'Office', scene: 'OfficeScene', row: 1, col: 4 },
            { label: 'Internet Bar', scene: 'InternetBarScene', row: 2, col: 1 },
            { label: 'Job Fair', scene: 'JobfairScene', row: 2, col: 3 }
        ];

        // 样式配置
        const style = {
            button: {
                width: screenWidth * 0.1,      // 按钮宽度
                height: screenHeight * 0.06,     // 按钮高度
                radius: 16,                      // 圆角半径
                bgColor: 0xEDC9AF,              // 主色
                hoverColor: 0xF0D8C0,           // 悬停色
                shadow: {
                    color: 0x4D2E1A,           // 阴影色
                    offsetX: screenWidth * 0.005,
                    offsetY: screenHeight * 0.005
                }
            },
            layout: {
                startX: screenWidth * 0.1,      // 起始X
                startY: screenHeight * 0.26,     // 起始Y
                colGap: screenWidth * 0.07,    // 列间距
                rowGap: screenHeight * 0.25     // 行间距
            },
            text: {
                fontSize: Math.min(18, screenWidth * 0.02) + 'px',
                fontFamily: 'Comic Sans MS',
                fontStyle: 'bold', 
                color: '#8B4513'
            }
        };

        // 创建按钮组
        buttons.forEach(config => {
            // 计算位置（将5列布局转换为百分比）
            const colPositions = [
                0,                              // 第0列（占位）
                style.layout.startX,            // 第1列
                style.layout.startX + (style.button.width + style.layout.colGap) * 2, // 第3列
                style.layout.startX + (style.button.width + style.layout.colGap) * 3, // 第4列
                screenWidth - style.button.width - style.layout.startX // 第5列
            ];

            const x = colPositions[config.col];
            const y = style.layout.startY + 
                    (config.row - 1) * (style.button.height + style.layout.rowGap);

            // 阴影层
            const shadow = this.add.graphics()
                .fillStyle(style.button.shadow.color, 0.8)
                .fillRoundedRect(
                    x + style.button.shadow.offsetX,
                    y + style.button.shadow.offsetY,
                    style.button.width,
                    style.button.height,
                    style.button.radius
                );

            // 按钮主体
            const bg = this.add.graphics()
                .fillStyle(style.button.bgColor)
                .fillRoundedRect(
                    x,
                    y,
                    style.button.width,
                    style.button.height,
                    style.button.radius
                )
                .setInteractive(
                    new Phaser.Geom.Rectangle(x, y, style.button.width, style.button.height),
                    Phaser.Geom.Rectangle.Contains
                )
                .on('pointerover', () => bg.fillColor = style.button.hoverColor)
                .on('pointerout', () => bg.fillColor = style.button.bgColor);

            // 按钮文字（自动换行）
            const btnText = this.add.text(
                x + style.button.width / 2,
                y + style.button.height / 2,
                config.label,
                {
                    ...style.text,
                    wordWrap: { width: style.button.width - 20 },
                    align: 'center'
                }
            )
            .setOrigin(0.5)
            .setPadding(5);

            
            // 点击事件
            bg.on('pointerdown', () => {
                this.scene.start(config.scene)
            });

            // 组合元素
            this.add.container(0, 0, [shadow, bg, btnText]);
        });

    }   
}

// 顶部统一导入两个函数
import { processPlayerInput as processPlayerInputCoffee } from '../scripts/utils/dialogueEngine.js';
import { processPlayerInput as processPlayerInputJobfair } from '../fair/utils/dialogueEngine.js';

class CoffeeScene extends Phaser.Scene {
    constructor() {
        super('CoffeeScene');
        this.currentRound = 1;
        this.maxRounds = 5;
        this.photoShown = false;
        this.messageHistory = [];
        // 添加调试模式开关
        this.debugMode = true;
    }

    create() {
        // 添加调试快捷键（F1直接触发结局）
        if (this.debugMode) {
            this.input.keyboard.on('keydown-ONE', (event) => {
                if (event.ctrlKey && event.shiftKey) {
                    this.triggerEnding();
                }
            });
        }

    

        const centerX = this.cameras.main.centerX;
        const centerY = this.cameras.main.centerY;

        const canvasWidth = this.cameras.main.width;
        const canvasHeight = this.cameras.main.height;

        this.moneyDisplay = new MoneyDisplay(this);
        this.phoneIcon = new PhoneIcon(this);
        this.mapIcon = new MapIcon(this, () => this.scene.start('MapScene'));
        this.moneyDisplay.container.setDepth(100);
        this.phoneIcon.icon.setDepth(100);
        this.mapIcon.mapIcon.setDepth(100);

        this.sound.stopAll();
        let coffeeSound = this.sound.add('coffeeSound', { loop: true, volume: 0.5 });
        coffeeSound.play();

        const coffeeImage = this.add.image(centerX, centerY, 'coffee').setOrigin(0.5, 0.5);
        const availableWidth = this.cameras.main.width * 0.99;
        const availableHeight = this.cameras.main.height * 0.99;
        const scaleX = availableWidth / coffeeImage.width;
        const scaleY = availableHeight / coffeeImage.height;
        const scaleFactor = Math.min(scaleX, scaleY);
        coffeeImage.setScale(scaleFactor);

        
        this.createDialog();
        this.showNPCIntro();
    }

    createDialogSystem() {
    const screenWidth = this.cameras.main.width;
    const screenHeight = this.cameras.main.height;

    this.dialogBox = new DialogBox(this, {
        x: screenWidth * 0.025,
        y: screenHeight - 170,
        width: screenWidth * 0.95,
        height: 150,
        portraitKey: 'npc_coffee_smile',
        dialogues: [],
        onComplete: () => this.showInput()
    });

    this.inputBox = new InputBox(this, {
        x: screenWidth * 0.025,
        y: screenHeight - 210,
        width: screenWidth * 0.95,
        onSubmit: text => this.handlePlayerInput(text)
    });

    this.inputBox.setVisible(false);
}
    
createDialog() {
    this.createDialogSystem();

    const firstDialogues = [
        "Samuel Chan:",
        "Hey, I just launched a new urban tech project.",
        "We met at a lecture before.",
        "I'm at Literary Café now,",
        "want to chat?"
    ];

    const combinedDialogues = firstDialogues.join("\n");

    // 显示合并后的对话
    this.appendToDialog(combinedDialogues);
    }

    showNPCIntro() {
    const introText = "I've been working on an \"urban data platform\", mainly for site selection and traffic analysis. You should be familiar with it, like your MUA projects.";
    this.messageHistory = [{ role: 'assistant', content: introText }];
    this.appendToDialog(`Samuel Chan: ${introText}`);
    }


    appendToDialog(text, isPlayer = false) {
        if (!this.dialogBox) {
            setTimeout(() => this.appendToDialog(text), 100);
            return;
        }

        // 根据说话者切换立绘
        if (isPlayer) {
            this.dialogBox.updatePortrait('player_smile');
        } else {
            this.dialogBox.updatePortrait('npc_coffee_smile'); // 使用NPC默认立绘
        }

        this.dialogBox.dialogues.push(text);
        if (!this.dialogBox.isTyping) {
            this.dialogBox.dialogueIndex = this.dialogBox.dialogues.length - 1;
            this.dialogBox.showNextDialogue();
        }
    }

    showInput() {
        this.inputBox.setVisible(true);
        this.inputBox.activate();
        this.inputBox.inputText.setText('');
    }

    async handlePlayerInput(text) {
        this.inputBox.setVisible(false);
        this.appendToDialog(`You: ${text}`, true);

        const { formalText, trustScore, interestScore, strategy, photoShown } =
            await processPlayerInputCoffee(text, this.currentRound, this.photoShown, this.messageHistory);

        this.appendToDialog(`Samuel Chan: ${formalText}`);
        this.updateGameState(trustScore, interestScore, strategy);

        if (++this.currentRound > this.maxRounds) {
            this.triggerEnding();
        } else {
            this.showInput();
        }
    }

    updateGameState(trustScore, interestScore, strategy) {
        console.log(`Trust: ${trustScore}, Interest: ${interestScore}, Strategy: ${strategy}`);
    }

    triggerEnding() {
        //this.appendToDialog("⚠️ You arrived at the remote compound. All communications are cut off...");
        this.inputBox.destroy();
        //this.dialogBox.destroy();

        this.showEndingChoices();
    }

    showEndingChoices() {
        const centerX = this.cameras.main.centerX;
        const centerY = this.cameras.main.centerY;

        // 创建半透明黑色背景0.7
        const bg = this.add.rectangle(centerX, centerY, 800, 600, 0x000000, 0)
            .setInteractive()
            .setDepth(1000);

        // 创建选项容器
        const choiceContainer = this.add.container(centerX, centerY).setDepth(1001);

        // 创建选项按钮
        const createButton = (text, y, callback) => {
            const btnBg = this.add.graphics()
                .fillStyle(0x000000, 0.8)
                .fillRoundedRect(-140, -30, 280, 50, 15)
                .lineStyle(4, 0xffffff)
                .strokeRoundedRect(-140, -30, 280, 50, 15);

            const btnText = this.add.text(0, 0, text, {
                font: '22px Comic Sans MS',
                fill: '#ffffff'
            }).setOrigin(0.5);

            const btn = this.add.container(0, y, [btnBg, btnText])
                .setInteractive(new Phaser.Geom.Rectangle(-140, -30, 280, 50, 15), Phaser.Geom.Rectangle.Contains)
                .on('pointerdown', callback)
                .on('pointerover', () => {btnBg.fillStyle(0x333333, 0.8).fillRoundedRect(-140, -30, 280, 50, 15);
                    btnText.setColor('#ff0000');})
                .on('pointerout', () => {btnBg.fillStyle(0x000000, 0.8).fillRoundedRect(-140, -30, 280, 50, 15);
                    btnText.setColor('#ffffff');
                });

            choiceContainer.add(btn);
        };

        // 创建两个选项按钮
        createButton('Go to the site', -40, () => {
            bg.destroy();
            choiceContainer.destroy();
            this.scene.start('BadEnding1Scene');
        });

        createButton('Leave', 40, () => {
            bg.destroy();
            choiceContainer.destroy();
            this.showAchievement();
        });
    }


    showAchievement() {
        // 显示成就图片
        const centerX = this.cameras.main.centerX;
        const centerY = this.cameras.main.centerY;
        
        // 添加发光效果
        const glow = this.add.graphics()
            .fillStyle(0xFFFFFF, 0.3)
            .fillCircle(centerX, centerY, 200)
            .setBlendMode(Phaser.BlendModes.ADD)
            .setDepth(1002);

        // 添加成就图片
        const achievement = this.add.image(centerX, centerY, 'SHAERP_EYE')
            .setScale(0.5)
            .setDepth(1003);

        // 播放成就音乐
        const achievementSound = this.sound.add('achievementSound', { volume: 0.8 });
        achievementSound.play();

        // 添加点击监听
        this.input.once('pointerdown', () => {
            this.sound.stopAll();
            this.scene.start('MapScene');
        });

        // 创建脉冲动画
        this.tweens.add({
            targets: [achievement, glow],
            scale: 0.55,
            duration: 1000,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });
    }

}

class JobfairScene extends Phaser.Scene {
    constructor() {
        super('JobfairScene');
        this.currentRound = 1;
        this.maxRounds = 5;
        this.photoShown = false;
        this.messageHistory = [];
        // 添加调试模式开关
        this.debugMode = true;

    }

    create() {
        // 添加调试快捷键（直接触发结局）
        if (this.debugMode) {
            this.input.keyboard.on('keydown-ONE', (event) => {
                if (event.ctrlKey && event.shiftKey) {
                    this.triggerEnding();
                }
            });
        }

        const centerX = this.cameras.main.centerX;
        const centerY = this.cameras.main.centerY;

        const canvasWidth = this.cameras.main.width;
        const canvasHeight = this.cameras.main.height;

        this.moneyDisplay = new MoneyDisplay(this);
        this.phoneIcon = new PhoneIcon(this);
        this.mapIcon = new MapIcon(this, () => this.scene.start('MapScene'));
        this.moneyDisplay.container.setDepth(100);
        this.phoneIcon.icon.setDepth(100);
        this.mapIcon.mapIcon.setDepth(100);

        this.sound.stopAll();
        let jobfairSound = this.sound.add('jobfairSound', { loop: true, volume: 0.5 });
        jobfairSound.play();

        const jobfairImage = this.add.image(centerX, centerY, 'jobfair').setOrigin(0.5, 0.5);
        const availableWidth = this.cameras.main.width * 0.99;
        const availableHeight = this.cameras.main.height * 0.99;
        const scaleX = availableWidth / jobfairImage.width;
        const scaleY = availableHeight / jobfairImage.height;
        const scaleFactor = Math.min(scaleX, scaleY);
        jobfairImage.setScale(scaleFactor);



        const firstDialogues = [
            "You arrive at a large job fair in the city.",
            "There are several booths.",
            "Would you like to take a look?"
        ];

        // 显示系统提示
        this.showSystemDialog(firstDialogues);
    }

    createDialogSystem() {
        const screenWidth = this.cameras.main.width;
        const screenHeight = this.cameras.main.height;

        this.dialogBox = new DialogBox(this, {
            x: screenWidth * 0.025,
            y: screenHeight - 170,
            width: screenWidth * 0.95,
            height: 150,
            portraitKey: 'player_smile',
            dialogues: [],
            onComplete: () => this.showInput()
        });

        this.inputBox = new InputBox(this, {
            x: screenWidth * 0.025,
            y: screenHeight - 210,
            width: screenWidth * 0.95,
            onSubmit: text => this.handlePlayerInput(text)
        });
        this.inputBox.setVisible(false);
    }

    // 在类属性中添加状态变量
    currentDialogueIndex = 0;
    isTyping = false;
    typingEvent = null;
    dialogBg = null;
    dialogText = null;


    showSystemDialog(dialogues) {
        const screenWidth = this.cameras.main.width;
        const screenHeight = this.cameras.main.height;

        // 提示框尺寸
        const dialogWidth = screenWidth * 0.6;
        const dialogHeight = 150;
        const dialogX = (screenWidth - dialogWidth) / 2;
        const dialogY = (screenHeight - dialogHeight) / 2;

        // 如果已经存在则先清除旧内容
        if (this.dialogBg) {
            this.dialogBg.destroy();
            this.dialogText.destroy();
        }

        // 创建黑色背景
        this.dialogBg = this.add.graphics()
            .fillStyle(0x000000, 0.8)
            .fillRect(dialogX, dialogY, dialogWidth, dialogHeight);

        // 创建文本对象
        this.dialogText = this.add.text(
            dialogX + 20,
            dialogY + 20,
            '', 
            {
                fontFamily: 'Comic Sans MS',
                fontSize: '20px',
                fill: '#ffffff',
                wordWrap: { width: dialogWidth - 40 }
            }
        );

        // 设置交互
        this.dialogBg.setInteractive(
            new Phaser.Geom.Rectangle(dialogX, dialogY, dialogWidth, dialogHeight),
            Phaser.Geom.Rectangle.Contains
        );

        // 初始化对话队列
        this.dialogues = dialogues;
        this.currentDialogueIndex = 0;
        
        // 开始显示第一句
        this.startTypingCurrentDialogue();

        // 点击事件处理
        this.dialogBg.on('pointerdown', () => {
            if (this.isTyping) {
                // 立即完成当前打字效果
                this.typingEvent.remove();
                this.dialogText.setText(this.dialogues[this.currentDialogueIndex]);
                this.isTyping = false;
            } else {
                // 切换到下一句
                this.currentDialogueIndex++;
                if (this.currentDialogueIndex < this.dialogues.length) {
                    this.startTypingCurrentDialogue();
                } else {
                    // 所有对话结束
                    this.dialogBg.destroy();
                    this.dialogText.destroy();
                    this.createDialog();
                    this.showNPCIntro();
                }
            }
        });
    }

    startTypingCurrentDialogue() {
        this.isTyping = true;
        const currentText = this.dialogues[this.currentDialogueIndex];
        this.dialogText.setText('');
        let charIndex = 0;

        this.typingEvent = this.time.addEvent({
            delay: 20,
            repeat: currentText.length - 1,
            callback: () => {
                this.dialogText.text += currentText[charIndex];
                charIndex++;
                if (charIndex >= currentText.length) {
                    this.isTyping = false;
                }
            }
        });
    }
    

    createDialog() {
        this.createDialogSystem();
    }

    showNPCIntro() {
        const introText = "Hello, we are XX Global Tech, offering remote jobs with 8000 gold per month. Interested?";
        this.messageHistory = [{ role: 'assistant', content: introText }];
        this.appendToDialog(`Recruiter: ${introText}`,false);
    }

    appendToDialog(text, isPlayer = true) {
        if (!this.dialogBox) {
            setTimeout(() => this.appendToDialog(text, isPlayer), 100);
            return;
        }
        // 根据说话者切换立绘
        if (isPlayer) {
            this.dialogBox.updatePortrait('player_smile');
        } else {
            this.dialogBox.updatePortrait('npc_jobfair_smile'); 
        }

        this.dialogBox.dialogues.push(text);
        if (!this.dialogBox.isTyping) {
            this.dialogBox.dialogueIndex = this.dialogBox.dialogues.length - 1;
            this.dialogBox.showNextDialogue();
        }
    }

    showInput() {
        this.inputBox.setVisible(true);
        this.inputBox.activate();
        this.inputBox.inputText.setText('');
    }

    async handlePlayerInput(text) {
        this.inputBox.setVisible(false);
        this.appendToDialog(`You: ${text}`, true);

        const { formalText, trustScore, interestScore, strategy, photoShown } =
            await processPlayerInputJobfair(text, this.currentRound, this.photoShown, this.messageHistory);

        this.appendToDialog(`Recruiter: ${formalText}`, false);
        this.updateGameState(trustScore, interestScore, strategy);

        if (++this.currentRound > this.maxRounds) {
            this.triggerEnding();
        } else {
            this.showInput();
        }
    }

    updateGameState(trustScore, interestScore, strategy) {
        console.log(`Trust: ${trustScore}, Interest: ${interestScore}, Strategy: ${strategy}`);
    }

    triggerEnding() {
        //this.appendToDialog("Payment successful… (Recruiter disappears, phone unreachable)");
        this.inputBox.destroy();
        this.showEndingChoices();
    }

    showEndingChoices() {
        const centerX = this.cameras.main.centerX;
        const centerY = this.cameras.main.centerY;

        // 创建半透明黑色背景0.7
        const bg = this.add.rectangle(centerX, centerY, 800, 600, 0x000000, 0)
            .setInteractive()
            .setDepth(1000);

        // 创建选项容器
        const choiceContainer = this.add.container(centerX, centerY).setDepth(1001);

        // 创建选项按钮
        const createButton = (text, y, callback) => {
            const btnBg = this.add.graphics()
                .fillStyle(0x000000, 0.8)
                .fillRoundedRect(-140, -30, 280, 50, 15)
                .lineStyle(4, 0xffffff)
                .strokeRoundedRect(-140, -30, 280, 50, 15);

            const btnText = this.add.text(0, 0, text, {
                font: '22px Comic Sans MS',
                fill: '#ffffff'
            }).setOrigin(0.5);

            const btn = this.add.container(0, y, [btnBg, btnText])
                .setInteractive(new Phaser.Geom.Rectangle(-140, -30, 280, 50, 15), Phaser.Geom.Rectangle.Contains)
                .on('pointerdown', callback)
                .on('pointerover', () => {btnBg.fillStyle(0x333333, 0.8).fillRoundedRect(-140, -30, 280, 50, 15);
                    btnText.setColor('#ff0000');})
                .on('pointerout', () => {btnBg.fillStyle(0x000000, 0.8).fillRoundedRect(-140, -30, 280, 50, 15);
                    btnText.setColor('#ffffff');
                });

            choiceContainer.add(btn);
        };

        // 创建两个选项按钮
        createButton('Gladly Pay', -40, () => {
            bg.destroy();
            choiceContainer.destroy();

            // 更新金钱显示
            this.moneyDisplay.updateMoney(0); 
            
            // 高亮金钱显示（使用自定义方法）
            this.moneyDisplay.highlight();

            // 创建全屏遮罩实现渐暗效果
            const darkenOverlay = this.add.graphics()
                .fillStyle(0x000000, 0)
                .fillRect(0, 0, this.cameras.main.width, this.cameras.main.height);

            // 金钱组件保持顶层
            this.moneyDisplay.container.setDepth(1000);

            // 渐变动画
            this.tweens.add({
                targets: darkenOverlay,
                alpha: 1,
                duration: 2000,
                ease: 'Linear',
                onComplete: () => {
                    // 跳转场景
                    this.scene.start('BadEnding2Scene');
                }
            });

            // 添加闪烁效果
            this.tweens.add({
                targets: this.moneyDisplay.container,
                alpha: 0.3,
                duration: 500,
                yoyo: true,
                repeat: 3
            });


            //this.scene.start('BadEnding2Scene');
        });

        

        createButton('Leave', 40, () => {
            bg.destroy();
            choiceContainer.destroy();
            this.showAchievement();
        });
    }


    showAchievement() {
        // 显示成就图片
        const centerX = this.cameras.main.centerX;
        const centerY = this.cameras.main.centerY;
        
        // 添加发光效果
        const glow = this.add.graphics()
            .fillStyle(0xFFFFFF, 0.3)
            .fillCircle(centerX, centerY, 200)
            .setBlendMode(Phaser.BlendModes.ADD)
            .setDepth(1002);

        // 添加成就图片
        const achievement = this.add.image(centerX, centerY, 'SHAERP_EYE')
            .setScale(0.5)
            .setDepth(1003);

        // 播放成就音乐
        const achievementSound = this.sound.add('achievementSound', { volume: 0.8 });
        achievementSound.play();

        // 添加点击监听
        this.input.once('pointerdown', () => {
            this.sound.stopAll();
            this.scene.start('MapScene');
        });

        // 创建脉冲动画
        this.tweens.add({
            targets: [achievement, glow],
            scale: 0.55,
            duration: 1000,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });
    }
}

export { CoffeeScene, JobfairScene };

class HomeScene extends Phaser.Scene {
    constructor() {
        super('HomeScene');
    }
    create() {
        this.sound.stopAll();
        let scene2Sound = this.sound.add('scene2Sound', { loop: true, volume: 0.5 });
        scene2Sound.play();

        // 获取摄像头中心坐标
        const centerX = this.cameras.main.centerX;
        const centerY = this.cameras.main.centerY;

        const roomImage = this.add.image(centerX, centerY, 'room').setOrigin(0.5, 0.5);
        const availableWidth = this.cameras.main.width * 0.99;
        const availableHeight = this.cameras.main.height * 0.99;
        const scaleX = availableWidth / roomImage.width;
        const scaleY = availableHeight / roomImage.height;
        const scaleFactor = Math.min(scaleX, scaleY);
        roomImage.setScale(scaleFactor);
        

        /******************************* dialogues ***************************/       
        // 对话内容：使用数组存储多句对话文字
        const dialogues = [
            "Now is not the time to rest",
            "I need go out to find a job",
        ];
        let dialogueIndex = 0; // 当前对话序号
        let isTyping = false;  // 标记当前是否正处于打字状态
        let typingEvent = null; // 保存打字事件

        // 绘制对话框：在屏幕底部，带有边框
        const dialogBoxWidth = this.cameras.main.width * 0.95;
        const dialogBoxHeight = 150;
        const dialogBoxX = this.cameras.main.centerX - dialogBoxWidth / 2;
        const dialogBoxY = this.cameras.main.height - dialogBoxHeight - 20; // 距离底部20px

        // 使用 Graphics 绘制对话框背景及边框
        const dialogGraphics = this.add.graphics();
        // 绘制半透明背景
        dialogGraphics.fillStyle(0x000000, 0.8);
        dialogGraphics.fillRect(dialogBoxX, dialogBoxY, dialogBoxWidth, dialogBoxHeight);
        // 绘制边框（这里用白色边框，线宽4）
        dialogGraphics.lineStyle(4, 0xffffff, 1);
        dialogGraphics.strokeRect(dialogBoxX, dialogBoxY, dialogBoxWidth, dialogBoxHeight);

        // 对话框左侧显示主角的立绘
        const portraitMargin = 10;
        const portraitSize = dialogBoxHeight - 20; // 让立绘略小于对话框高度
        const portraitX = dialogBoxX + portraitMargin + portraitSize / 2;
        const portraitY = dialogBoxY + dialogBoxHeight / 2;
        const portraitImage = this.add.image(portraitX, portraitY, 'player_speechless').setOrigin(0.5);
        // 如果立绘图片不符合尺寸，可使用 setDisplaySize 调整
        portraitImage.setDisplaySize(portraitSize, portraitSize);

        // 创建对话文本对象，文字区域排除掉立绘部分
        const textX = portraitX + portraitSize / 2 + 30; // 立绘右侧留10px边距
        const textY = dialogBoxY + 20;
        const dialogueText = this.add.text(textX, textY, "", {
            fontFamily: 'Comic Sans MS',
            fontSize: '20px',
            fill: '#ffffff',
            wordWrap: { width: dialogBoxWidth - portraitSize - 30 }
        });

        // 定义函数：显示下一句对话，采用打字机效果
        const showNextDialogue = () => {
            // 如果当前正处于打字状态，则立即补全文本，并停止打字事件
            if (isTyping) {
                if (typingEvent) {
                    typingEvent.remove();
                }
                dialogueText.setText(dialogues[dialogueIndex - 1]); // 补全当前对话
                isTyping = false;
                return;
            }
            // 进入下一句对话（若还有未显示的内容）
            if (dialogueIndex < dialogues.length) {
                let fullText = dialogues[dialogueIndex];
                dialogueText.setText(""); // 清空现有文本
                isTyping = true;
                let charIndex = 0;
                // 利用 Timer 事件实现逐字符显示，每20毫秒显示1个字符
                typingEvent = this.time.addEvent({
                    delay: 20,
                    repeat: fullText.length - 1,
                    callback: () => {
                        dialogueText.text += fullText.charAt(charIndex);
                        charIndex++;
                        if (charIndex >= fullText.length) {
                            isTyping = false;
                        }
                    }
                });
                dialogueIndex++;
            } else {
                // 所有对话显示完毕，进入下一个场景（你可以根据需要调整这部分逻辑）
                this.scene.start('MapScene'); 
            }
        };

        // 显示第一句对话
        showNextDialogue();

        // 为对话框添加点击交互：点击对话框区域触发显示下一句
        dialogGraphics.setInteractive(
            new Phaser.Geom.Rectangle(dialogBoxX, dialogBoxY, dialogBoxWidth, dialogBoxHeight),
            Phaser.Geom.Rectangle.Contains
        );
        dialogGraphics.on('pointerdown', showNextDialogue);

        // 同时，监听空格键，以便显示下一句文本
        this.input.keyboard.on('keydown-SPACE', showNextDialogue);
    }
    startTypingEffect(textObject, fullText) {
        let index = 0;
        const typeSpeed = 150; // 每个字出现的时间（毫秒）

        const typeLoop = () => {
            textObject.setText(fullText.substring(0, index)); // 更新文本
            index++;

            if (index <= fullText.length) {
                this.time.delayedCall(typeSpeed, typeLoop); // 继续下一个字
            } else {
                this.time.delayedCall(1000, () => { // 等待 1 秒后重新开始
                    index = 0;
                    typeLoop();
                });
            }
        };

        typeLoop(); // 启动打字机动画
    }
}

class SchoolScene extends Phaser.Scene {
    constructor() {
        super('SchoolScene');
    }
    create() {
        this.sound.stopAll();
        
        // 创建提示文本
        const warningText = this.add.text(
            this.cameras.main.centerX,
            this.cameras.main.centerY,
            "This scene has not been unlocked yet\nReturning to the map...", 
            {
                fontFamily: 'Comic Sans MS',
                fontSize: '32px',
                fill: '#FF0000',
                align: 'center',
                backgroundColor: '#000000',
                padding: { x: 20, y: 10 }
            }
        )
        .setOrigin(0.5)
        .setShadow(2, 2, '#000000', 4);

        // 添加渐变动画
        this.tweens.add({
            targets: warningText,
            alpha: 0,
            duration: 3000,
            hold: 1000,
            onComplete: () => {
                this.scene.start('MapScene');
            }
        });

        // 添加直接跳转的定时器（双保险）
        this.time.delayedCall(3000, () => {
            this.scene.start('MapScene');
        });
    }
}

class OfficeScene extends Phaser.Scene {
    constructor() {
        super('OfficeScene');
    }
    create() {
        this.sound.stopAll();
        
        // 创建提示文本
        const warningText = this.add.text(
            this.cameras.main.centerX,
            this.cameras.main.centerY,
            "This scene has not been unlocked yet\nReturning to the map...", 
            {
                fontFamily: 'Comic Sans MS',
                fontSize: '32px',
                fill: '#FF0000',
                align: 'center',
                backgroundColor: '#000000',
                padding: { x: 20, y: 10 }
            }
        )
        .setOrigin(0.5)
        .setShadow(2, 2, '#000000', 4);

        // 添加渐变动画
        this.tweens.add({
            targets: warningText,
            alpha: 0,
            duration: 3000,
            hold: 1000,
            onComplete: () => {
                this.scene.start('MapScene');
            }
        });

        // 添加直接跳转的定时器（双保险）
        this.time.delayedCall(3000, () => {
            this.scene.start('MapScene');
        });
    }
}

class InternetBarScene extends Phaser.Scene {
    constructor() {
        super('InternetBarScene');
    }
    create() {
        this.sound.stopAll();
        
        // 创建提示文本
        const warningText = this.add.text(
            this.cameras.main.centerX,
            this.cameras.main.centerY,
            "This scene has not been unlocked yet\nReturning to the map...", 
            {
                fontFamily: 'Comic Sans MS',
                fontSize: '32px',
                fill: '#FF0000',
                align: 'center',
                backgroundColor: '#000000',
                padding: { x: 20, y: 10 }
            }
        )
        .setOrigin(0.5)
        .setShadow(2, 2, '#000000', 4);

        // 添加渐变动画
        this.tweens.add({
            targets: warningText,
            alpha: 0,
            duration: 3000,
            hold: 1000,
            onComplete: () => {
                this.scene.start('MapScene');
            }
        });

        // 添加直接跳转的定时器（双保险）
        this.time.delayedCall(3000, () => {
            this.scene.start('MapScene');
        });
    }
}

/**********************************************************************
 * Phaser 游戏配置与启动window.startGame = function() {
    const config = {
        type: Phaser.AUTO,
        scale: {
            mode: Phaser.Scale.FIT,                // 自适应，保持宽高比
            autoCenter: Phaser.Scale.CENTER_BOTH,    // 居中显示
            width: window.innerWidth,                // 宽度设为浏览器窗口的宽度
            height: window.innerHeight               // 高度设为浏览器窗口的高度
        },
        backgroundColor: "#000000",
        scene: [BootScene, StartScene, Scene1, Scene2, MapScene, CoffeeScene],
        pixelArt: true, // 保持像素风格
    };
    new Phaser.Game(config);
  };
 **********************************************************************/
  const config = {
    type: Phaser.AUTO,
    scale: {
        mode: Phaser.Scale.FIT,                // 自适应，保持宽高比
        autoCenter: Phaser.Scale.CENTER_BOTH,    // 居中显示
        width: window.innerWidth,                // 宽度设为浏览器窗口的宽度
        height: window.innerHeight               // 高度设为浏览器窗口的高度
    },
    backgroundColor: "#000000",
    scene: [BootScene, StartScene, Scene1, Scene2, MapScene, CoffeeScene,JobfairScene, BadEnding1Scene, BadEnding2Scene, HomeScene, SchoolScene, OfficeScene, InternetBarScene],
    pixelArt: true, // 保持像素风格
};
const game = new Phaser.Game(config);



  

  
