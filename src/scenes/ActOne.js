class ActOne extends Phaser.Scene {
    constructor() {
        super('actOneScene')
    }

    init() {
        this.screenWidth = 720
        this.screenHeight = 480

        // quest boolean flags
        this.scenePhase = 0
        this.beerAcquired = false
        this.caught = false
        this.missionComplete = false

        // dialogue implementation adapted from Nathan Altice

        // dialog constants
        this.DBOX_X = 360               // dialog box x-position
        this.DBOX_Y = 545			    // dialog box y-position
        this.DBOX_FONT = 'pixel-white'	// dialog box font key

        this.TEXT_X = 60			    // text w/in dialog box x-position
        this.TEXT_Y = 510			    // text w/in dialog box y-position
        this.TEXT_SIZE = 18		        // text font size (in pixels)
        this.TEXT_MAX_WIDTH = 600	    // max width of text within box

        this.NEXT_TEXT = ''	            // text to display for next prompt
        this.NEXT_X = 660			    // next text prompt x-position
        this.NEXT_Y = 585			    // next text prompt y-position

        this.LETTER_TIMER = 40		    // # ms each letter takes to "type" onscreen

        // dialog variables
        this.dialogLine = 0			    // current line of conversation
        this.dialogSpeaker = null		// current speaker
        this.dialogTyping = false		// flag to lock player input while text is "typing"
        this.dialogText = null			// the actual dialog text
        this.nextText = null			// player prompt text to continue typing
    }

    create() {

        // world setup
        game.scale.resize(this.screenWidth, 620)
        this.physics.world.setBounds(20, 140, this.screenWidth - 40, this.screenHeight - 140)
        this.keys = this.input.keyboard.createCursorKeys()

        // store setup
        this.add.sprite(0, 0, 'store').setOrigin(0).setScale(3.2)

        let aisle1 = this.physics.add.sprite(300, 140, 'aisle-1').setOrigin(0.5).setScale(1.5).setImmovable(true).setDepth(1)
        let aisle2 = this.physics.add.sprite(620, 140, 'aisle-2').setOrigin(0.5).setScale(1.5).setImmovable(true).setDepth(1)
        let aisle3 = this.physics.add.sprite(150, 270, 'aisle-3').setOrigin(0.5).setScale(1.5).setImmovable(true).setDepth(3)
        let aisle4 = this.physics.add.sprite(150, 380, 'aisle-2').setOrigin(0.5).setScale(1.5).setImmovable(true).setDepth(5)
        let aisle5 = this.physics.add.sprite(380, 380, 'aisle-1').setOrigin(0.5).setScale(1.5).setImmovable(true).setDepth(5)
        let liquorStand1 = this.physics.add.sprite(85, 140, 'liquor-stand-2').setOrigin(0.5).setScale(1.5).setImmovable(true).setDepth(1)
        let liquorStand2 = this.physics.add.sprite(500, 140, 'liquor-stand-1').setOrigin(0.5).setScale(1.5).setImmovable(true).setDepth(1)
        let liquorStand3 = this.physics.add.sprite(350, 270, 'liquor-stand-2').setOrigin(0.5).setScale(1.5).setImmovable(true).setDepth(3)
        let stand1 = this.physics.add.sprite(410, 140, 'stand-1').setOrigin(0.5).setScale(1.5).setImmovable(true).setDepth(1)
        let stand2 = this.physics.add.sprite(430, 270, 'stand-2').setOrigin(0.5).setScale(1.5).setImmovable(true).setDepth(3)
        let stand3 = this.physics.add.sprite(570, 270, 'stand-1').setOrigin(0.5).setScale(1.5).setImmovable(true).setDepth(3)
        let beerKeg = this.physics.add.sprite(180, 150, 'beer-keg').setOrigin(0.5).setScale(1.7).setImmovable(true)
        let beer = this.physics.add.sprite(180, 100, 'beer').setOrigin(0.5).setScale(1.7).setImmovable(true)
        let cashRegister = this.physics.add.sprite(620, 400, 'cashier').setOrigin(0.5).setScale(1.3).setImmovable(true)
        let clerk = this.physics.add.sprite(690, 400, 'clerk').setOrigin(0.5).setScale(2).setImmovable(true)

        aisle1.body.setSize(90, 30).setOffset(5, 20)
        aisle2.body.setSize(90, 30).setOffset(5, 20)
        aisle3.body.setSize(90, 30).setOffset(5, 20)
        aisle4.body.setSize(90, 30).setOffset(5, 20)
        aisle5.body.setSize(90, 30).setOffset(5, 20)
        liquorStand1.body.setSize(59, 30).setOffset(0, 20)
        liquorStand2.body.setSize(59, 30).setOffset(0, 20)
        liquorStand3.body.setSize(59, 30).setOffset(0, 20)
        stand1.body.setSize(37, 30).setOffset(5, 20)
        stand2.body.setSize(37, 30).setOffset(5, 20)
        stand3.body.setSize(37, 30).setOffset(5, 20)
        beerKeg.body.setSize(35, 30).setOffset(2, 0)
        beer.body.setSize(70, 70).setOffset(-23, -10)

        this.shelves = this.add.group([aisle1, aisle2, aisle3, aisle4, aisle5, liquorStand1, liquorStand2, liquorStand3, stand1, stand2, stand3, beerKeg, cashRegister, clerk])

        // create player
        this.player = new Player(this, this.screenWidth - 200, this.screenHeight - 50, 'player', 0, 'up')

        this.physics.add.collider(this.player, this.shelves)

        this.player.body.onOverlap = true
        this.physics.add.overlap(this.player, beer)
        this.physics.world.on('overlap', (gameObject1, gameObject2, body1, body2) => {
            this.grabBeerText.setVisible(true)

            this.input.keyboard.on('keydown-SPACE', function() {
                if (!this.beerAcquired) {
                    this.add.sprite(620, 65, 'exit').setScale(2)
                    this.beerAcquired = true
                    beer.destroy()
                    this.scenePhase++
                    this.physics.world.setBounds(20, 140, this.screenWidth + 50, this.screenHeight - 140)
                    this.grabBeerText.setVisible(false)
                }
            }, this)
        })

        this.grabBeerText = this.add.bitmapText(220, 210, 'pixel-white', 'Grab\n[Space]', 18).setOrigin(0.5).setVisible(false)

        // Dialogue initialization
        this.dialog = this.cache.json.get('dialog')
        this.dialogbox = this.add.sprite(this.DBOX_X, this.DBOX_Y, 'dialogbox').setOrigin(0.5).setScale(0.8, 0.6)
        this.dialogText = this.add.bitmapText(this.TEXT_X, this.TEXT_Y, this.DBOX_FONT, 'test', this.TEXT_SIZE)
        this.nextText = this.add.bitmapText(this.NEXT_X, this.NEXT_Y, this.DBOX_FONT, '', this.TEXT_SIZE)
        this.typeText(this.scenePhase)
    }

    update() {        
        if(this.beerAcquired && this.caught && this.player.x >= this.screenWidth + 40 && !this.missionComplete) {
            this.missionComplete = true
            this.player.setVisible(false)
            this.cameras.main.fadeOut(2000, 0, 0, 0)
            this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, (cam, effect) => {
                this.scene.start('cutscene', { gunStage: 2, nextScene: 'actTwoScene' })
            })
        }

        if (this.player.y >= 380) {
            this.player.setDepth(6)
        } else if (this.player.y < 380 && this.player.y >= 270) {
            this.player.setDepth(4)
        } else {
            this.player.setDepth(2)
        }

        if (this.beerAcquired && !this.caught && this.player.x >= 580 && this.player.y <= 270) {
            this.typeText(this.scenePhase)
            this.caught = true
        }

        this.playerFSM.step()
    }

    typeText(scenePhase) {
        // lock input while typing
        this.dialogTyping = true

        // clear text
        this.dialogText.text = ''
        this.nextText.text = ''

        // if not, set current speaker
        this.dialogSpeaker = this.dialog[0][scenePhase]['speaker'] // conversation, line, speaker

        // build dialog (concatenate speaker + colon + line of text)
        this.combinedDialog = this.dialog[0][scenePhase]['speaker'] + ': ' + this.dialog[0][scenePhase]['dialog']

        // create a timer to iterate through each letter in the dialog text
        let currentChar = 0
        this.textTimer = this.time.addEvent({
            delay: this.LETTER_TIMER,
            repeat: this.combinedDialog.length - 1,
            callback: () => { 
                // concatenate next letter from dialogLines
                this.dialogText.text += this.combinedDialog[currentChar]
                // advance character position
                currentChar++
                // check if timer has exhausted its repeats 
                // (necessary since Phaser 3 no longer seems to have an onComplete event)
                if(this.textTimer.getRepeatCount() == 0) {
                    // show prompt for more text
                    this.nextText = this.add.bitmapText(this.NEXT_X, this.NEXT_Y, this.DBOX_FONT, this.NEXT_TEXT, this.TEXT_SIZE).setOrigin(1)
                    this.dialogTyping = false   // un-lock input
                    this.textTimer.destroy()    // destroy timer
                }
            },
            callbackScope: this // keep Scene context
        })
            
        // final cleanup before next iteration
        this.dialogText.maxWidth = this.TEXT_MAX_WIDTH  // set bounds on dialog
        this.dialogLine++                               // increment dialog line
     }
}