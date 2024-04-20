class Intro extends Phaser.Scene {
    constructor() {
        super('introScene')
    }

    init() {
        this.PLAYER_VELOCITY = 140
    }

    create() {
        game.scale.resize(720, 620)

        // this.cameras.main.setBackgroundColor(0xbababa)
        this.add.sprite(0, 480, 'storefront').setOrigin(0, 1).setScale(4.8)
        this.add.rectangle(360, height - 54, 720, 200, 0x323254)
        // set up keyboard input
        this.keys = this.input.keyboard.createCursorKeys()

        // this.wall = this.add.rectangle(0, 0, width, height - 150, 0xABCA).setOrigin(0)

        // set custom world bounds
        this.physics.world.setBounds(0, 370, 720, 110)

        // this.add.rectangle(700, 415, 110, 150, 0x000000)

        this.player = new Player(this, 130, 410, 'player', 0, 'left')

        this.enterStoreText = this.add.bitmapText(620, 250, 'pixel-white', 'Enter\n[Space]', 18).setOrigin(0.5)

        // text box
        this.textrect = this.physics.add.sprite(30, this.game.config.height - 180, 'dialogbox').setOrigin(0, 0).setScale(0.8, 0.7).setImmovable(true).setDepth(2)
        this.Text = this.add.bitmapText(55, this.game.config.height - 145, 'pixel-white', 'Ponyboy:', 18).setOrigin(0,0).setDepth(3)
        this.Text = this.add.bitmapText(53, this.game.config.height - 100, 'pixel-white', 'I really don\'t wanna do this...', 16).setOrigin(0, 0).setDepth(3)
        this.player.setDepth(1)
    }

    update() {
        if (this.player.x >= 560 && this.player.x <= 680 && this.player.y <= 410) {
            this.enterStoreText.setAlpha(1)

            if(Phaser.Input.Keyboard.JustDown(this.keys.space)) {
                this.scene.start("actOneScene")
            }
        } else {
            this.enterStoreText.setAlpha(0)
        }

        this.playerFSM.step()

    }
}
