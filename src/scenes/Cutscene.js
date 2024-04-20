class Cutscene extends Phaser.Scene {
    constructor() {
        super('cutscene')
    }

    init(data) {
        this.gunStage = data.gunStage
        this.nextScene = data.nextScene
        this.text = ''
    }

    create() {
        game.scale.resize(960, 640)

        switch (this.gunStage) {
            case 1:
                this.text = 'will you do it...?'
                this.bgColor = 0x1c1c1c
                break
            case 2:
                this.text = 'you\'re nervous...'
                this.bgColor = 0x241a17
                this.physics.add.sprite(510, 50, 'blood-drop').setVelocityY(12).setAlpha(0.4)
                this.physics.add.sprite(100, 300, 'blood-drop').setVelocityY(12).setAlpha(0.4)
                this.physics.add.sprite(710, 500, 'blood-drop').setVelocityY(6).setAlpha(0.4)
                this.add.sprite(500, 50, 'blood-splatter').setAlpha(0.5).setAngle(20)
                this.add.sprite(100, 300, 'blood-splatter').setAlpha(0.5).setAngle(150)
                this.add.sprite(700, 500, 'blood-splatter').setAlpha(0.5).setAngle(45).setSize(2)
                break
            case 3:
                this.text = '\t\tI\'m unforgiving...'
                this.bgColor = 0x730000
                break
            default:
                break
        }

        // background
        this.cameras.main.setBackgroundColor(this.bgColor)
        this.cameras.main.fadeIn(3000, 0, 0, 0)

        // set up keyboard input
        this.keys = this.input.keyboard.createCursorKeys()

        this.pistol = this.add.sprite(width/2, height/2 - 40, `gun-${this.gunStage}`).setAlpha(0.5)

        this.instructionText = this.add.bitmapText(width/2, 410, 'pixel-gray', '', 24).setOrigin(0.5)

        this.tweens.add({
            targets: this.pistol,
            scale: {
                from: 2,
                to: 4
            },
            duration: 10000,
            ease: 'Linear',
            onComplete: () => {
                this.instructionText.text = this.text
                this.time.delayedCall((2000), () => {
                    this.add.bitmapText(width/2, height - 80, 'pixel-gray', 'Continue [Space]', 14).setOrigin(0.5)
                    this.input.keyboard.on('keydown-SPACE', function() {
                        this.scene.start(this.nextScene)
                    }, this)
                })
            }
        })
    }

    update() {

    }
}