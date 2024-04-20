class ActTwo extends Phaser.Scene {
    constructor() {
        super('actTwoScene')
    }

    init() {
        // timing system
        this.second = 0;
        this.ending_time = 450; // 45 second

        this.scenePhase = 0

        // dialog constants
        this.DBOX_X = width/2           // dialog box x-position
        this.DBOX_Y = 545			    // dialog box y-position
        this.DBOX_FONT = 'pixel-white'	// dialog box font key

        this.TEXT_X = 190			    // text w/in dialog box x-position
        this.TEXT_Y = 510			    // text w/in dialog box y-position
        this.TEXT_SIZE = 18		        // text font size (in pixels)
        this.TEXT_MAX_WIDTH = 600	    // max width of text within box

        this.NEXT_TEXT = ''	    // text to display for next prompt
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
        this.wall = this.add.sprite(width/2, height/2, 'street-wall').setOrigin(0.5).setScale(1.9, 2.2).setDepth(1)
        this.wall.play('wall-animate')

        //this.palette = this.add.sprite(120, height - 100, 'cardboard').setScale(2).setOrigin(0.5).setDepth(3)

        this.paintColor = 'purple'

        // code adapted from Phaser Example: https://labs.phaser.io/view.html?src=src/game%20objects/render%20texture/paint.js
        const paintStroke = this.add.renderTexture(480, 245, 960, 490).setDepth(2)

        this.input.on('pointermove', pointer => {
            if (pointer.isDown) {
                paintStroke.draw(`${this.paintColor}-paint`, pointer.x - 32, pointer.y - 32)
            }
        }, this)

        this.add.sprite(115, 55, 'cardboard').setOrigin(0.5).setScale(2, 1.2).setDepth(2)
        this.purplePaint = this.add.sprite(80, 50, 'purple-spray').setScale(2).setDepth(4).setAngle(30).setInteractive()
        this.purplePaint.on('pointerdown', () => {
            this.paintColor = 'purple'
        })

        this.bluePaint = this.add.sprite(150, 55, 'blue-spray').setScale(2).setDepth(4).setAngle(30).setInteractive()
        this.bluePaint.on('pointerdown', () => {
            this.paintColor = 'blue'
        })

        // set up keyboard input
        this.keys = this.input.keyboard.createCursorKeys()

        // Dialogue
        this.dialog = this.cache.json.get('dialog')
        this.dialogbox = this.add.sprite(this.DBOX_X, this.DBOX_Y, 'dialogbox').setOrigin(0.5).setScale(0.8, 0.6).setDepth(3)
        this.dialogText = this.add.bitmapText(this.TEXT_X, this.TEXT_Y, this.DBOX_FONT, 'test', this.TEXT_SIZE).setDepth(4)
        this.nextText = this.add.bitmapText(this.NEXT_X, this.NEXT_Y, this.DBOX_FONT, '', this.TEXT_SIZE).setDepth(4)
        this.typeText(this.scenePhase)

        // timer
        this.timing_box = this.add.rectangle(265, 30, 485, 50, 0x000000, 0.5).setOrigin(0, 0).setDepth(4).setStrokeStyle(3, 0xffffff, 0.5)
        this.timing_text = this.add.bitmapText(280, 45, 'pixel-white', 'Cops arrive in: ' + Math.floor(this.ending_time / 10) + 's', 24).setDepth(5)

        this.timing = this.time.addEvent({
            delay: 100,
            loop: true,
            callback: () =>
            {
                this.second += 1
            }
        });

        
    }

    update() {
        // if(Phaser.Input.Keyboard.JustDown(this.keys.space)) {
        //     this.scene.start('cutscene', { gunStage: 3, nextScene: 'actThreeScene' })
        // }

        // time counting
        this.timing_text.text = 'Cops arrive in: ' + Math.floor((this.ending_time - this.second) / 10) + 's'

        // ending the scene
        if (this.ending_time <= this.second){
            this.scene.start('cutscene', { gunStage: 3, nextScene: 'actThreeScene' })
        }

    }

    typeText(scenePhase) {
        // lock input while typing
        this.dialogTyping = true

        // clear text
        this.dialogText.text = ''
        this.nextText.text = ''

        // if not, set current speaker
        this.dialogSpeaker = this.dialog[1][scenePhase]['speaker'] // conversation, line, speaker

        // build dialog (concatenate speaker + colon + line of text)
        this.combinedDialog = this.dialog[1][scenePhase]['speaker'].toUpperCase() + ': ' + this.dialog[1][scenePhase]['dialog']

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
