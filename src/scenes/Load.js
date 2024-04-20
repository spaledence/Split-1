class Load extends Phaser.Scene {
    constructor() {
        super('loadScene')
    }

    preload() {
        // load assets
        this.load.path = './assets/'

        this.load.json('dialog', 'json/dialog.json')
        this.load.image('dialogbox', 'dialogbox.png')

        // Intro Assets
        this.load.image('storefront', 'storefront.png')

        // Cutscene Assets
        this.load.image('gun-1', 'gun1.png')
        this.load.image('gun-2', 'gun2.png')
        this.load.image('gun-3', 'gun3.png')
        this.load.image('blood-drop', 'blood_drop.png')
        this.load.image('blood-splatter', 'blood_splatter.png')

        // Chapter 1 Assets
        this.load.image('exit', 'exit.png')
        this.load.image('store', 'store.png')
        this.load.image('aisle-1', 'aisle1.png')
        this.load.image('aisle-2', 'aisle2.png')
        this.load.image('aisle-3', 'aisle3.png')
        this.load.image('stand-1', 'stand1.png')
        this.load.image('stand-2', 'stand2.png')
        this.load.image('liquor-stand-1', 'liquorstand1.png')
        this.load.image('liquor-stand-2', 'liquorstand2.png')
        this.load.image('cashier', 'cashier.png')
        this.load.image('clerk', 'clerk.png')
        this.load.image('beer-keg', 'beerkeg.png')
        this.load.image('beer', 'beer.png')

        // Chapter 2 Assets
        this.load.image('blue-spray', 'spray1.png')
        this.load.image('purple-spray', 'spray2.png')
        this.load.image('blue-paint', 'blue_paint.png')
        this.load.image('purple-paint', 'purple_paint.png')
        this.load.image('cardboard', 'cardboard.png')

        // Chapter 3 Assets
        this.load.image('scrolling-1', 'scrolling1.png')
        this.load.image('scrolling-2', 'scrolling2.png')
        this.load.image('window', 'window.png')

        // player animations
        this.load.spritesheet('player', 'player.png', { frameWidth: 23, frameHeight: 30 })

        this.load.spritesheet('street-wall', 'wall.png', { frameWidth: 512, frameHeight: 299 })

        // font source: https://www.dafont.com/dogica.font
        this.load.bitmapFont('pixel-gray', 'font/pixel-gray.png', 'font/pixel-gray.xml')
        this.load.bitmapFont('pixel-white', 'font/pixel-white.png', 'font/pixel-white.xml')

        // Act three
        this.load.image('target', 'target.png')    
    }

    create() {
        // player animations
        this.anims.create({ key: 'idle-left', frameRate: 0, repeat: -1, frames: this.anims.generateFrameNumbers('player', { start: 8, end: 8 }), })
        this.anims.create({ key: 'idle-right', frameRate: 0, repeat: -1, frames: this.anims.generateFrameNumbers('player', { start: 5, end: 5 }), })
        this.anims.create({ key: 'idle-up', frameRate: 0, repeat: -1, frames: this.anims.generateFrameNumbers('player', { start: 13, end: 13 }), })
        this.anims.create({ key: 'idle-down', frameRate: 0, repeat: -1, frames: this.anims.generateFrameNumbers('player', { start: 1, end: 1 }), })
        this.anims.create({ key: 'walk-left', frameRate: 8, repeat: -1, frames: this.anims.generateFrameNumbers('player', { start: 8, end: 11 }), })
        this.anims.create({ key: 'walk-right', frameRate: 8, repeat: -1, frames: this.anims.generateFrameNumbers('player', { start: 4, end: 7 }), })
        this.anims.create({ key: 'walk-up', frameRate: 8, repeat: -1, frames: this.anims.generateFrameNumbers('player', { start: 12, end: 15 }), })
        this.anims.create({ key: 'walk-down', frameRate: 8, repeat: -1, frames: this.anims.generateFrameNumbers('player', { start: 0, end: 3 }), })

        // alley wall animation
        this.anims.create({
            key: 'wall-animate',
            frameRate: 2,
            frameRate: 3,
            repeat: -1,
            frames: this.anims.generateFrameNumbers('street-wall', {
                start: 0,
                end: 5
            })
        })

        // proceed once loading completes
        this.scene.start('cutscene', { gunStage: 1, nextScene: 'introScene' })
    }
}